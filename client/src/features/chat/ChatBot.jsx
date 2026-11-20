import { useState, useRef, useEffect } from 'react';
import { chatApi } from './api.js';

/**
 * ChatBot.jsx
 *
 * Floating, collapsible career-assistant chat widget backed by the Gemini API
 * via POST /api/ai/chat.
 *
 * The conversation state is kept locally; previousInteractionId threads the
 * turns server-side so Gemini maintains context across messages.
 */
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm SkillChain Career Assistant ✦\nAsk me anything about skills, jobs, or your resume.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [interactionId, setInteractionId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const { data } = await chatApi.send(text, interactionId);
      const result = data.data;
      setInteractionId(result.interactionId || interactionId);
      setMessages((prev) => [...prev, { role: 'assistant', text: result.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `Sorry, something went wrong: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close career assistant' : 'Open career assistant'}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: '#153d35',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px #153d3540',
          zIndex: 1000,
          transition: 'transform 0.2s',
        }}
      >
        {open ? '✕' : '✦'}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 92,
            right: 28,
            width: 340,
            maxHeight: 480,
            background: '#fff',
            border: '1px solid #e2e9e2',
            borderRadius: 10,
            boxShadow: '0 12px 40px #153d3520',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#153d35',
              color: '#fff',
              padding: '14px 18px',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ color: '#f0a868' }}>✦</span> Career Assistant
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 10,
                background: '#f0a86820',
                color: '#f0a868',
                borderRadius: 3,
                padding: '2px 6px',
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              Gemini
            </span>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.role === 'user' ? '#153d35' : '#f7f8f3',
                  color: msg.role === 'user' ? '#fff' : '#17211b',
                  borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                  padding: '9px 13px',
                  fontSize: 13,
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {msg.text}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: '#f7f8f3',
                  borderRadius: '10px 10px 10px 2px',
                  padding: '9px 13px',
                  display: 'flex',
                  gap: 4,
                }}
              >
                {[0, 1, 2].map((n) => (
                  <span
                    key={n}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#809086',
                      display: 'inline-block',
                      animation: `bounce 1.2s ${n * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            style={{
              borderTop: '1px solid #edf0eb',
              padding: '10px 12px',
              display: 'flex',
              gap: 8,
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              placeholder="Ask about skills, jobs…"
              style={{
                flex: 1,
                resize: 'none',
                fontSize: 13,
                padding: '8px 10px',
                border: '1px solid #dce4dc',
                borderRadius: 4,
                outline: 'none',
                lineHeight: 1.4,
              }}
            />
            <button
              type="button"
              onClick={send}
              disabled={loading || !input.trim()}
              className="button primary"
              style={{ padding: '8px 14px', flexShrink: 0 }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Bounce keyframe */}
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </>
  );
}

