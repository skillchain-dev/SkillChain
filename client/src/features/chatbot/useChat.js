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
  const sessionIdRef = useRef(null);

  // Load the saved conversation from MongoDB when the widget mounts.
  useEffect(() => {
    let cancelled = false;
    chatbotApi.history()
      .then(({ sessionId, messages: saved }) => {
        if (cancelled) return;
        sessionIdRef.current = sessionId || null;
        if (saved?.length) {
          setMessages([
            GREETING,
            ...saved.map((m, i) => ({ id: `h-${i}`, role: m.role, content: m.content })),
          ]);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const send = useCallback(async (text) => {
    const message = text.trim();
    if (!message || loading) return;

    setError('');
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', content: message }]);
    setLoading(true);

    try {
      const { reply, sessionId } = await chatbotApi.send({ message, sessionId: sessionIdRef.current });
      if (sessionId) sessionIdRef.current = sessionId;
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

  // "New chat": delete saved history on the server and start fresh.
  const reset = useCallback(() => {
    chatbotApi.clear().catch(() => {});
    sessionIdRef.current = null;
    setMessages([GREETING]);
    setError('');
  }, []);

  return { messages, loading, error, send, reset, markDone };
}
