require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillchain',
  aiApiKey: process.env.AI_API_KEY || '',
  aiTimeoutMs: Number(process.env.AI_TIMEOUT_MS || 8000),
  maxResumeCharacters: Number(process.env.MAX_RESUME_CHARACTERS || 200000),
};