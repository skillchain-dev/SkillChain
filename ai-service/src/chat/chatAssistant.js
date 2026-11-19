/**
 * chatAssistant.js
 *
 * Multi-turn career assistant powered by Gemini.
 * Falls back to a helpful static message when no API key is configured.
 */
const { getClient } = require('../geminiClient');
const chatPrompt = require('../prompts/chat.prompt');

/**
 * chat
 *
 * Sends a message to the Gemini model and returns the assistant's reply.
 * Accepts an optional previousInteractionId to continue a conversation thread.
 *
 * @param {string} message                 User's message
 * @param {string|null} previousInteractionId  ID from the previous turn (optional)
 * @returns {Promise<{reply: string, interactionId: string|null, source: string}>}
 */
async function chat(message, previousInteractionId = null) {
  if (typeof message !== 'string' || message.trim().length === 0) {
    throw new Error('message must be a non-empty string');
  }

  const client = getClient();

  if (client) {
    try {
      const params = {
        model: 'gemini-3.8-flash',
        input: message.trim(),
        system_instruction: chatPrompt,
        store: true, // Enables multi-turn via previous_interaction_id
      };

      if (previousInteractionId) {
        params.previous_interaction_id = previousInteractionId;
      }

      const interaction = await client.interactions.create(params);

      return {
        reply: interaction.output_text || 'Sorry, I could not generate a response.',
        interactionId: interaction.id || null,
        source: 'gemini',
      };
    } catch (err) {
      console.warn('[ai-service] Gemini chat failed:', err.message);
    }
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  return {
    reply:
      "I'm the SkillChain Career Assistant. I'm not fully configured yet — please ask your administrator to set the GEMINI_API_KEY. In the meantime, check out the Jobs page to browse open roles and the Resume page to upload your CV.",
    interactionId: null,
    source: 'fallback',
  };
}

module.exports = { chat };

