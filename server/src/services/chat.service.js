const { chat } = require('../../../ai-service/src');

/**
 * chatService.chat
 *
 * Thin wrapper so the server layer can call the AI service's chat function
 * without directly importing from the ai-service package path elsewhere.
 *
 * @param {string} message
 * @param {string|null} previousInteractionId
 */
async function sendChatMessage(message, previousInteractionId) {
  return chat(message, previousInteractionId);
}

module.exports = { sendChatMessage };

