import { useEffect, useRef, useState } from 'react';
import { useChat } from './useChat.js';
import ChatMessage, { TypingIndicator } from './ChatMessage.jsx';

const SUGGESTIONS = ['How do I improve my resume?', 'Which skills are in demand?', 'How do I verify a certificate?'];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, loading, error, send, reset } = useChat();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Keep the newest message in view.
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const submit = (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput('');
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) submit(event);
  };

  const showSuggestions = messages.length === 1 && !loading;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <section
          role="dialog"
          aria-label="SkillChain AI assistant"
          className="flex h-[32rem] max-h-[calc(100vh-6rem)] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-card border border-mist-200 bg-cream shadow-lift"
        >
          <header className="flex items-center justify-between bg-forest-600 px-4 py-3 text-white">
            <div>
              <p className="font-display text-sm font-semibold">SkillChain Assistant</p>
              <p className="text-xs text-forest-100">AI-powered help</p>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={reset} className="rounded px-2 py-1 text-xs text-forest-100 hover:bg-forest-500" title="Start a new chat">
                New chat
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="rounded p-1 hover:bg-forest-500">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => <ChatMessage key={m.id} role={m.role} content={m.content} />)}
            {loading && <TypingIndicator />}
            {error && <p className="rounded bg-danger-50 px-3 py-2 text-xs font-medium text-danger-600" role="alert">{error}</p>}
            {showSuggestions && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-mist-300 bg-white px-3 py-1.5 text-xs text-forest-600 hover:border-clay-500">
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={submit} className="flex items-end gap-2 border-t border-mist-200 bg-white p-3">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your question..."
              maxLength={1000}
              className="max-h-24 flex-1 resize-none rounded border border-mist-300 px-3 py-2 text-sm outline-none focus:border-clay-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded bg-clay-500 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-clay-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-clay-500 text-white shadow-lift transition-colors hover:bg-clay-600"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" />
        </svg>
      </button>
    </div>
  );
}
