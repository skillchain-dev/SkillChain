import httpClient from '../../services/httpClient.js';

// Talks to the backend AI route (server/src/routes/ai.routes.js -> POST /api/ai/chat).
// Expected request:  { message: string, history: [{ role: 'user' | 'assistant', content: string }], previousInteractionId?: string }
// Expected response: { reply: string, interactionId?: string, source?: string }
const USE_MOCK = import.meta.env.VITE_MOCK_CHAT === 'true';

const mockReply = (message) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        reply: `(demo reply) You asked: "${message}". Once the backend /ai/chat endpoint is connected, the real AI answer will appear here.`,
        interactionId: null,
        source: 'mock',
      });
    }, 900);
  });

export const chatbotApi = {
  send: async ({ message, history, previousInteractionId }) => {
    if (USE_MOCK) return mockReply(message);
    const response = await httpClient.post('/ai/chat', { message, history, previousInteractionId });
    return response.data?.data ?? response.data;
  },
};
