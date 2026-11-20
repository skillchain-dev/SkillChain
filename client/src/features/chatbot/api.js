import httpClient from '../../services/httpClient.js';

// Talks to the backend AI route (server/src/routes/ai.routes.js -> POST /api/ai/chat).
// Expected request:  { message: string, history: [{ role: 'user' | 'assistant', content: string }] }
// Expected response: { reply: string }
// Set VITE_MOCK_CHAT=true in client/.env to test the UI before the backend endpoint exists.
const USE_MOCK = import.meta.env.VITE_MOCK_CHAT === 'true';

const mockReply = (message) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        reply: `(demo reply) You asked: "${message}". Once the backend /ai/chat endpoint is connected, the real AI answer will appear here.`,
      });
    }, 900);
  });

export const chatbotApi = {
  send: async ({ message, history }) => {
    if (USE_MOCK) return mockReply(message);
    const data = await httpClient.post('/ai/chat', { message, history });
    return data.data ?? data; // httpClient returns the axios response; unwrap the body
  },
};