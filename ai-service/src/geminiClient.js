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
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.startsWith('your_') || !GoogleGenAI) return null;
  try {
    const timeout = Number(process.env.AI_TIMEOUT_MS) || 15000;
    _client = new GoogleGenAI({ apiKey, httpOptions: { timeout: Math.max(12000, timeout) } });
    return _client;
  } catch (err) {
    console.warn('[ai-service] Failed to initialize GoogleGenAI client:', err.message);
    return null;
  }
}

module.exports = { getClient };
