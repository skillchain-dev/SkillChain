module.exports = {
  port: Number(process.env.PORT || 5000),
  aiApiKey: process.env.AI_API_KEY || '',
  aiTimeoutMs: Number(process.env.AI_TIMEOUT_MS || 8000),
  maxResumeCharacters: Number(process.env.MAX_RESUME_CHARACTERS || 200000),
};