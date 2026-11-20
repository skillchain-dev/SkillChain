const mongoose = require('mongoose');
const { chat } = require('../../../ai-service/src');
const ChatSession = require('../models/ChatSession.model');

/**
 * Thin wrapper so the server layer can call the AI service's chat function
 * without importing the ai-service path elsewhere.
 */
async function sendChatMessage(message, previousInteractionId) {
  return chat(message, previousInteractionId);
}

async function findSession(userId, sessionId) {
  if (!sessionId || !mongoose.isValidObjectId(sessionId)) return null;
  return ChatSession.findOne({ _id: sessionId, user: userId });
}

async function getLatestSession(userId) {
  return ChatSession.findOne({ user: userId }).sort({ updatedAt: -1 });
}

// Saves the user message and the assistant reply. Creates the session if needed.
async function saveExchange(userId, session, userMessage, result) {
  const target = session || new ChatSession({ user: userId });
  target.messages.push({ role: 'user', content: userMessage });
  target.messages.push({ role: 'assistant', content: result.reply });
  if (result.interactionId) target.interactionId = result.interactionId;
  await target.save();
  return target;
}

async function clearSessions(userId) {
  await ChatSession.deleteMany({ user: userId });
}

module.exports = { sendChatMessage, findSession, getLatestSession, saveExchange, clearSessions };
