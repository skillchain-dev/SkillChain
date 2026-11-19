import { useCallback, useEffect, useRef, useState } from 'react';
import { chatbotApi } from './api.js';

const GREETING = {
  id: 'greeting',
  role: 'assistant',
  content: 'Hi! I\'m SkillChain AI. Ask me about jobs, your resume, skills or certificates.',
};

let counter = 0;
const nextId = () => `m-${Date.now()}-${counter++}`;

export function useChat() {
  const [messages, setMessages] = useState([GREETING]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesRef = useRef(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const send = useCallback(async (text) => {
    const message = text.trim();
    if (!message || loading) return;

    setError('');
    const userMsg = { id: nextId(), role: 'user', content: message };
    // Last 10 real messages (skip the local greeting) are sent as context.
    const history = messagesRef.current
      .filter((m) => m.id !== 'greeting')
      .slice(-10)
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { reply } = await chatbotApi.send({ message, history });
      // animate: true => the reply is shown with a typewriter effect once.
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'assistant', content: reply || 'Sorry, I have no answer for that.', animate: true },
      ]);
    } catch (err) {
      setError(err.message || 'Could not reach the assistant. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Called by ChatMessage when the typewriter finishes, so it never replays.
  const markDone = useCallback((id) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, animate: false } : m)));
  }, []);

  const reset = useCallback(() => {
    setMessages([GREETING]);
    setError('');
  }, []);

  return { messages, loading, error, send, reset, markDone };
}