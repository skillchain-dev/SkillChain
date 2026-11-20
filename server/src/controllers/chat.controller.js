const { sendChatMessage } = require('../services/chat.service');
const { success, failure } = require('../utils/apiResponse');

const MAX_MESSAGE_LENGTH = 4000;

/**
 * POST /api/ai/chat
 * Body: { message: string, previousInteractionId?: string }
 */
async function chat(request, response) {
  const { message, previousInteractionId } = request.body || {};

  if (typeof message !== 'string' || message.trim().length === 0) {
    return response
      .status(400)
      .json(failure('INVALID_CHAT_MESSAGE', 'message must be a non-empty string'));
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return response
      .status(413)
      .json(failure('CHAT_MESSAGE_TOO_LONG', `message must be ${MAX_MESSAGE_LENGTH} characters or fewer`));
  }

  try {
    const result = await sendChatMessage(
      message.trim(),
      typeof previousInteractionId === 'string' ? previousInteractionId : null
    );
    return response.json(success(result));
  } catch (error) {
    return response
      .status(500)
      .json(failure('CHAT_FAILED', error.message || 'Chat request failed'));
  }
}

module.exports = { chat };

