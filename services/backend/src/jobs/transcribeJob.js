const Queue = require('bull');
const Redis = require('ioredis');
const axios = require('axios');

// Create Redis connection
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Create queue
const transcribeQueue = new Queue('transcription', {
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

// Process transcription jobs
transcribeQueue.process('transcribe', async (job) => {
  const { entryId, cid, language } = job.data;
  
  try {
    console.log(`Processing transcription for entry ${entryId}`);
    
    // Download file from IPFS
    const fileBuffer = await downloadFromIPFS(cid);
    
    // Send to transcription service
    const transcript = await transcribeAudio(fileBuffer, language);
    
    // Update backend with transcript
    await updateBackendWithTranscript(entryId, transcript);
    
    return {
      success: true,
      entryId,
      transcriptLength: transcript.length
    };
    
  } catch (error) {
    console.error(`Transcription job failed for entry ${entryId}:`, error);
    throw error;
  }
});

// Process symbolization jobs
transcribeQueue.process('symbolize', async (job) => {
  const { entryId, transcript, context } = job.data;
  
  try {
    console.log(`Processing symbolization for entry ${entryId}`);
    
    // Extract atoms from transcript
    const atoms = await symbolizeTranscript(transcript, context);
    
    // Update backend with atoms
    await updateBackendWithAtoms(entryId, atoms);
    
    return {
      success: true,
      entryId,
      atomCount: atoms.length
    };
    
  } catch (error) {
    console.error(`Symbolization job failed for entry ${entryId}:`, error);
    throw error;
  }
});

// Helper functions
async function downloadFromIPFS(cid) {
  try {
    const response = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${cid}`,
      { responseType: 'arraybuffer' }
    );
    return Buffer.from(response.data);
  } catch (error) {
    throw new Error(`IPFS download failed: ${error.message}`);
  }
}

async function transcribeAudio(audioBuffer, language) {
  try {
    const FormData = require('form-data');
    const formData = new FormData();
    
    formData.append('file', audioBuffer, {
      filename: 'audio.wav',
      contentType: 'audio/wav'
    });
    formData.append('language', language);
    
    const response = await axios.post(
      `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/transcribe`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        }
      }
    );
    
    return response.data.transcript;
  } catch (error) {
    throw new Error(`Transcription failed: ${error.message}`);
  }
}

async function symbolizeTranscript(transcript, context) {
  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/symbolize`,
      {
        transcript,
        context
      }
    );
    
    return response.data.atoms;
  } catch (error) {
    throw new Error(`Symbolization failed: ${error.message}`);
  }
}

async function updateBackendWithTranscript(entryId, transcript) {
  try {
    await axios.patch(
      `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/submit/${entryId}/transcript`,
      {
        transcript,
        status: 'transcribed'
      }
    );
  } catch (error) {
    throw new Error(`Backend update failed: ${error.message}`);
  }
}

async function updateBackendWithAtoms(entryId, atoms) {
  try {
    await axios.patch(
      `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/submit/${entryId}/atoms`,
      {
        atoms,
        status: 'symbolized'
      }
    );
  } catch (error) {
    throw new Error(`Backend update failed: ${error.message}`);
  }
}

// Queue event handlers
transcribeQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed for entry ${result.entryId}`);
});

transcribeQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed:`, error);
});

transcribeQueue.on('stalled', (job) => {
  console.warn(`Job ${job.id} stalled`);
});

// Clean up completed jobs older than 1 day
setInterval(async () => {
  try {
    await transcribeQueue.clean(86400000, 'completed');
    await transcribeQueue.clean(86400000, 'failed');
  } catch (error) {
    console.error('Queue cleanup error:', error);
  }
}, 3600000); // Run every hour

module.exports = transcribeQueue;