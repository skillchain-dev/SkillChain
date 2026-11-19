/**
 * geminiClient.js
 * Safe wrapper around @google/genai.
 * If @google/genai is not yet installed or GEMINI_API_KEY is not set,
 * returns null so the service functions seamlessly in fallback mode.
 */
let GoogleGenAI = null;
try {
  ({ GoogleGenAI } = require('@google/genai'));
} catch {
  // Module not installed in the environment; fallback mode will be used.
}

let _client = null;

function getClient() {
  if (_client) return _client;
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey || !GoogleGenAI) return null;
  try {
    _client = new GoogleGenAI({ apiKey });
    return _client;
  } catch (err) {
    console.warn('[ai-service] Failed to initialize GoogleGenAI client:', err.message);
    return null;
  }
}

module.exports = { getClient };
