import httpClient from '../../services/httpClient.js';

/**
 * chatApi — sends a message to the SkillChain career assistant.
 *
 * send(message, previousInteractionId?)
 *   POST /api/ai/chat
 *   Returns { reply, interactionId, source }
 */
export const chatApi = {
  send: (message, previousInteractionId = null) =>
    httpClient.post('/ai/chat', { message, previousInteractionId }),
};

