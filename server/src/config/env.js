const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const crypto = require('crypto');

module.exports = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillchain',
  authTokenSecret: process.env.AUTH_TOKEN_SECRET || crypto.randomBytes(32).toString('hex'),
  aiApiKey: process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '',
  aiTimeoutMs: Number(process.env.AI_TIMEOUT_MS || 8000),
  maxResumeCharacters: Number(process.env.MAX_RESUME_CHARACTERS || 200000),
  clientBaseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:5173',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFrom: process.env.SMTP_FROM || process.env.SMTP_USER || '',
  smtpSecure: process.env.SMTP_SECURE === 'true',
  blockchainRpcUrl: process.env.BLOCKCHAIN_RPC_URL || '',
  blockchainPrivateKey: process.env.BLOCKCHAIN_PRIVATE_KEY || '',
  blockchainContractAddress: process.env.BLOCKCHAIN_CONTRACT_ADDRESS || '',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    url: process.env.CLOUDINARY_URL || '',
  },
};
