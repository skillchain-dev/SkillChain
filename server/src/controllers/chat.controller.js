const {
  sendChatMessage,
  findSession,
  getLatestSession,
  saveExchange,
  clearSessions,
} = require('../services/chat.service');
const { verifyAccessToken } = require('../utils/authToken');
const { success, failure } = require('../utils/apiResponse');

const MAX_MESSAGE_LENGTH = 4000;

// Chat works for guests too; history is only saved when a valid token is sent.
function getUserId(request) {
  const match = (request.get('authorization') || '').match(/^Bearer\s+(.+)$/i);
  const claims = match && verifyAccessToken(match[1]);
  return claims ? claims.sub : null;
}

/**
 * POST /api/ai/chat
 * Body: { message: string, sessionId?: string, previousInteractionId?: string }
 */
async function chat(request, response) {
  const { message, sessionId, previousInteractionId } = request.body || {};

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
    const userId = getUserId(request);
    const text = message.trim();

    let session = null;
    let previousId = typeof previousInteractionId === 'string' ? previousInteractionId : null;
    if (userId) {
      session = await findSession(userId, sessionId);
      if (session) previousId = session.interactionId;
    }

    const result = await sendChatMessage(text, previousId);

    let savedSessionId = null;
    if (userId) {
      try {
        const saved = await saveExchange(userId, session, text, result);
        savedSessionId = String(saved._id);
      } catch (error) {
        console.warn('[chat] could not save chat history:', error.message);
      }
    }

    return response.json(success({ ...result, sessionId: savedSessionId }));
  } catch (error) {
    return response
      .status(500)
      .json(failure('CHAT_FAILED', error.message || 'Chat request failed'));
  }
}

/** GET /api/ai/chat/history  (login required) -> latest session */
async function history(request, response) {
  const userId = getUserId(request);
  if (!userId) return response.status(401).json(failure('UNAUTHORIZED', 'A valid access token is required.'));

  try {
    const session = await getLatestSession(userId);
    return response.json(success({
      sessionId: session ? String(session._id) : null,
      messages: session ? session.messages.map(({ role, content }) => ({ role, content })) : [],
    }));
  } catch (error) {
    return response.status(500).json(failure('CHAT_HISTORY_FAILED', error.message));
  }
}

/** DELETE /api/ai/chat/history  (login required) -> start a fresh chat */
async function clearHistory(request, response) {
  const userId = getUserId(request);
  if (!userId) return response.status(401).json(failure('UNAUTHORIZED', 'A valid access token is required.'));

  try {
    await clearSessions(userId);
    return response.json(success({ cleared: true }));
  } catch (error) {
    return response.status(500).json(failure('CHAT_HISTORY_FAILED', error.message));
  }
}

module.exports = { chat, history, clearHistory };
