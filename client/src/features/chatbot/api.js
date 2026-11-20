import httpClient from '../../services/httpClient.js';

// Talks to the backend (server/src/routes/ai.routes.js):
//   POST   /api/ai/chat          { message, sessionId? } -> { reply, sessionId }
//   GET    /api/ai/chat/history  -> { sessionId, messages: [{ role, content }] }
//   DELETE /api/ai/chat/history  -> starts a fresh chat
// Set VITE_MOCK_CHAT=true in client/.env to test the UI without the backend.
const USE_MOCK = import.meta.env.VITE_MOCK_CHAT === 'true';

const mockReply = (message) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ reply: `(demo reply) You asked: "${message}".`, sessionId: null });
    }, 900);
  });

// The server wraps every response as { success, data, error }.
const unwrap = (response) => response.data?.data ?? response.data;

export const chatbotApi = {
  send: async ({ message, sessionId }) => {
    if (USE_MOCK) return mockReply(message);
    return unwrap(await httpClient.post('/ai/chat', { message, sessionId }));
  },
  history: async () => {
    if (USE_MOCK) return { sessionId: null, messages: [] };
    return unwrap(await httpClient.get('/ai/chat/history'));
  },
  clear: async () => {
    if (USE_MOCK) return;
    await httpClient.delete('/ai/chat/history');
  },
};
