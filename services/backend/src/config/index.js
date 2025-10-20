const Joi = require('joi');

// Environment variables schema
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  
  PORT: Joi.number()
    .default(4000),
  
  DATABASE_URL: Joi.string()
    .required()
    .description('PostgreSQL database URL'),
  
  REDIS_URL: Joi.string()
    .default('redis://localhost:6379'),
  
  PINATA_JWT: Joi.string()
    .required()
    .description('Pinata JWT for IPFS'),
  
  PINATA_API_KEY: Joi.string()
    .optional(),
  
  PINATA_SECRET_API_KEY: Joi.string()
    .optional(),
  
  OPENAI_API_KEY: Joi.string()
    .required()
    .description('OpenAI API key for transcription and symbolization'),
  
  HUGGINGFACE_TOKEN: Joi.string()
    .optional()
    .description('HuggingFace token for alternative transcription'),
  
  WEB3_PROVIDER: Joi.string()
    .required()
    .description('Web3 provider URL'),
  
  CONTRACT_ADDRESS: Joi.string()
    .required()
    .description('Smart contract address'),
  
  PRIVATE_KEY: Joi.string()
    .required()
    .description('Private key for blockchain transactions'),
  
  METTA_API_URL: Joi.string()
    .default('http://localhost:8080')
    .description('MeTTa API endpoint'),
  
  FRONTEND_URL: Joi.string()
    .default('http://localhost:3000')
    .description('Frontend URL for CORS'),
  
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info')
}).unknown()
  .required();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  
  database: {
    url: envVars.DATABASE_URL,
    options: {
      logging: envVars.NODE_ENV === 'development',
      pool: {
        max: 20,
        min: 5,
        acquire: 60000,
        idle: 10000
      }
    }
  },
  
  redis: {
    url: envVars.REDIS_URL,
    options: {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false
    }
  },
  
  ipfs: {
    pinataJWT: envVars.PINATA_JWT,
    pinataApiKey: envVars.PINATA_API_KEY,
    pinataSecret: envVars.PINATA_SECRET_API_KEY,
    gateway: 'https://gateway.pinata.cloud'
  },
  
  ai: {
    openai: {
      apiKey: envVars.OPENAI_API_KEY,
      model: 'gpt-4',
      whisperModel: 'whisper-1'
    },
    huggingface: {
      token: envVars.HUGGINGFACE_TOKEN
    }
  },
  
  blockchain: {
    provider: envVars.WEB3_PROVIDER,
    contractAddress: envVars.CONTRACT_ADDRESS,
    privateKey: envVars.PRIVATE_KEY,
    gasLimit: 500000,
    gasPrice: '30000000000' // 30 gwei
  },
  
  metta: {
    endpoint: envVars.METTA_API_URL,
    timeout: 30000
  },
  
  cors: {
    origin: envVars.FRONTEND_URL,
    credentials: true
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    submissionLimit: 10 // submissions per hour
  },
  
  upload: {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
      files: 1
    },
    allowedMimes: [
      'audio/*',
      'video/*',
      'text/plain',
      'application/json'
    ]
  },
  
  jobs: {
    concurrency: 5,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  },
  
  logging: {
    level: envVars.LOG_LEVEL,
    format: envVars.NODE_ENV === 'production' ? 'json' : 'dev'
  }
};

// Environment-specific overrides
if (config.env === 'production') {
  config.rateLimit.max = 200;
  config.database.options.logging = false;
  config.logging.level = 'warn';
}

if (config.env === 'test') {
  config.database.url = process.env.TEST_DATABASE_URL || config.database.url;
  config.rateLimit.max = 1000; // Higher limit for tests
}

module.exports = config;