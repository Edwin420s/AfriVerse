const Queue = require('bull');
const Redis = require('ioredis');
const axios = require('axios');
const logger = require('../utils/logger');

// Create Redis connection
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Create symbolize queue
const symbolizeQueue = new Queue('symbolization', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    },
    timeout: 300000 // 5 minutes
  }
});

// Process symbolization jobs
symbolizeQueue.process('symbolize', async (job) => {
  const { entryId, transcript, context } = job.data;
  
  try {
    logger.info(`Processing symbolization for entry ${entryId}`);
    
    // Extract atoms from transcript
    const atoms = await symbolizeTranscript(transcript, context);
    
    // Validate atoms
    const validatedAtoms = await validateAtoms(atoms, context);
    
    // Update backend with atoms
    await updateBackendWithAtoms(entryId, validatedAtoms);
    
    return {
      success: true,
      entryId,
      atomCount: validatedAtoms.length,
      validatedCount: validatedAtoms.filter(a => a.valid).length
    };
    
  } catch (error) {
    logger.error(`Symbolization job failed for entry ${entryId}:`, error);
    throw error;
  }
});

// Process bulk symbolization jobs
symbolizeQueue.process('bulk-symbolize', async (job) => {
  const { entries } = job.data;
  
  try {
    logger.info(`Processing bulk symbolization for ${entries.length} entries`);
    
    const results = [];
    
    for (const entry of entries) {
      try {
        const atoms = await symbolizeTranscript(entry.transcript, entry.context);
        const validatedAtoms = await validateAtoms(atoms, entry.context);
        
        await updateBackendWithAtoms(entry.entryId, validatedAtoms);
        
        results.push({
          entryId: entry.entryId,
          success: true,
          atomCount: validatedAtoms.length
        });
      } catch (entryError) {
        logger.error(`Symbolization failed for entry ${entry.entryId}:`, entryError);
        results.push({
          entryId: entry.entryId,
          success: false,
          error: entryError.message
        });
      }
    }
    
    return {
      success: true,
      results,
      processed: results.length,
      successful: results.filter(r => r.success).length
    };
    
  } catch (error) {
    logger.error('Bulk symbolization job failed:', error);
    throw error;
  }
});

// Helper functions
async function symbolizeTranscript(transcript, context) {
  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/submit/symbolize`,
      {
        transcript,
        context
      },
      {
        timeout: 60000 // 60 seconds
      }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Symbolization failed');
    }
    
    return response.data.atoms || [];
  } catch (error) {
    throw new Error(`Symbolization service error: ${error.message}`);
  }
}

async function validateAtoms(atoms, context) {
  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/validate/atoms`,
      {
        atoms,
        context
      }
    );
    
    return response.data.validatedAtoms || atoms.map(atom => ({ atom, valid: true }));
  } catch (error) {
    // If validation fails, mark all atoms as valid but with warning
    logger.warn('Atom validation service unavailable, proceeding without validation');
    return atoms.map(atom => ({ 
      atom, 
      valid: true,
      warning: 'Validation skipped'
    }));
  }
}

async function updateBackendWithAtoms(entryId, atoms) {
  try {
    await axios.patch(
      `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/submit/${entryId}/atoms`,
      {
        atoms: atoms.filter(a => a.valid).map(a => a.atom),
        status: 'symbolized',
        validationResults: atoms
      }
    );
  } catch (error) {
    throw new Error(`Backend update failed: ${error.message}`);
  }
}

// Queue event handlers
symbolizeQueue.on('completed', (job, result) => {
  logger.info(`Symbolization job ${job.id} completed for entry ${result.entryId}`);
});

symbolizeQueue.on('failed', (job, error) => {
  logger.error(`Symbolization job ${job.id} failed:`, error);
});

symbolizeQueue.on('stalled', (job) => {
  logger.warn(`Symbolization job ${job.id} stalled`);
});

symbolizeQueue.on('waiting', (jobId) => {
  logger.info(`Symbolization job ${jobId} is waiting`);
});

symbolizeQueue.on('active', (job) => {
  logger.info(`Symbolization job ${job.id} is now active`);
});

// Clean up completed jobs older than 1 day
setInterval(async () => {
  try {
    await symbolizeQueue.clean(86400000, 'completed');
    await symbolizeQueue.clean(86400000, 'failed');
  } catch (error) {
    logger.error('Symbolize queue cleanup error:', error);
  }
}, 3600000); // Run every hour

// Metrics collection
setInterval(async () => {
  try {
    const counts = await symbolizeQueue.getJobCounts();
    const metrics = {
      waiting: counts.waiting,
      active: counts.active,
      completed: counts.completed,
      failed: counts.failed,
      delayed: counts.delayed,
      timestamp: new Date().toISOString()
    };
    
    // Store metrics in Redis for monitoring
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    await redis.set('queue:symbolize:metrics', JSON.stringify(metrics));
    await redis.quit();
    
  } catch (error) {
    logger.error('Symbolize queue metrics collection error:', error);
  }
}, 60000); // Collect metrics every minute

module.exports = symbolizeQueue;