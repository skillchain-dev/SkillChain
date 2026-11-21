import { useCallback, useEffect, useRef, useState } from 'react';
import { useChat } from './useChat.js';
import ChatMessage, { AiAvatar, TypingIndicator } from './ChatMessage.jsx';
import { ChevronDownIcon, CloseIcon, SendIcon, SparkleIcon } from './icons.jsx';

const SUGGESTIONS = [
  { icon: '📄', title: 'Improve my resume', prompt: 'How do I improve my resume?' },
  { icon: '💼', title: 'Find the right jobs', prompt: 'How can I find jobs that match my skills?' },
  { icon: '🚀', title: 'Skills in demand', prompt: 'Which skills are in demand right now?' },
  { icon: '✅', title: 'Verify a certificate', prompt: 'How do I verify a certificate?' },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, loading, error, send, reset, markDone } = useChat();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, []);

  useEffect(() => { if (open) scrollToBottom(); }, [messages, loading, error, open, scrollToBottom]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 150); }, [open]);

  // Auto-grow the textarea up to a max height.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [input]);

  const submit = (event) => {
    event.preventDefault();
    if (!input.trim() || loading) return;
    send(input);
    setInput('');
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) submit(event);
  };

  const isEmpty = messages.length === 1 && !loading;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Chat window */}
      <section
        role="dialog"
        aria-label="SkillChain AI assistant"
        aria-hidden={!open}
        className={`pointer-events-auto flex h-[34rem] max-h-[calc(100vh-6.5rem)] w-[24rem] max-w-[calc(100vw-2.5rem)] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-mist-200 bg-cream shadow-lift transition-all duration-300
          ${open ? 'visible translate-y-0 scale-100 opacity-100' : 'hidden translate-y-4 scale-95 opacity-0'}`}
      >
        {/* Header */}
        <header className="relative overflow-hidden bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 px-4 py-3.5 text-white">
          <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-clay-500/30 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur">
              <SparkleIcon className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-semibold leading-tight">SkillChain AI</p>
              <p className="flex items-center gap-1.5 text-xs text-forest-100">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Online · Career Assistant
              </p>
            </div>
            <button type="button" onClick={reset} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/20 !border-0" title="Start a new chat">
              New chat
            </button>
            <button type="button" onClick={() => setOpen(false)} aria-label="Minimize chat" className="rounded-full p-1.5 text-white transition-colors hover:bg-white/15 !border-0">
              <ChevronDownIcon />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {isEmpty ? (
            <div className="flex flex-col items-center pt-2 text-center">
              <AiAvatar size="h-14 w-14" icon="h-7 w-7" />
              <h3 className="mt-3 font-display text-lg font-semibold text-forest-700">Hi, I&apos;m SkillChain AI</h3>
              <p className="mt-1 max-w-[16rem] text-sm text-mist-600">Your smart assistant for jobs, resumes, skills and certificates.</p>
              <div className="mt-5 grid w-full grid-cols-2 gap-2.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => send(s.prompt)}
                    className="rounded-xl border border-mist-200 bg-white p-3 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-clay-500 hover:shadow-lift"
                  >
                    <span className="text-lg">{s.icon}</span>
                    <span className="mt-1 block text-xs font-semibold leading-snug text-forest-700">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <ChatMessage
                key={m.id}
                role={m.role}
                content={m.content}
                animate={m.animate}
                onTick={scrollToBottom}
                onDone={() => markDone(m.id)}
              />
            ))
          )}
          {loading && <TypingIndicator />}
          {error && (
            <p role="alert" className="rounded-xl border border-danger-500/20 bg-danger-50 px-3 py-2 text-xs font-medium text-danger-600">
              {error}
            </p>
          )}
        </div>

        {/* Input */}
        <form onSubmit={submit} className="border-t border-mist-200 bg-white p-3">
          <div className="flex items-end gap-2 rounded-2xl border border-mist-300 bg-cream px-3 py-2 transition-colors focus-within:border-clay-500 focus-within:bg-white">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask SkillChain AI..."
              maxLength={1000}
              className="max-h-24 flex-1 resize-none !rounded-none !border-0 bg-transparent !p-0 !py-1 text-sm text-ink outline-none placeholder:text-mist-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex h-8 w-8 shrink-0 items-center justify-center !rounded-full bg-gradient-to-br from-clay-500 to-clay-600 text-white shadow-card transition-all hover:scale-105 disabled:cursor-not-allowed disabled:from-mist-300 disabled:to-mist-300 disabled:shadow-none disabled:hover:scale-100 !p-0 !border-0"
            >
              <SendIcon />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-mist-600">AI can make mistakes. Please double-check important information.</p>
        </form>
      </section>

      {/* Launcher */}
      <div className="relative pointer-events-auto">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
          aria-expanded={open}
          className={`relative flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-forest-600 via-forest-500 to-clay-500 font-semibold text-white shadow-lift ring-2 ring-white/60 transition-all duration-300 hover:scale-105 !border-0
            ${open ? 'h-12 w-12 !p-0' : 'h-12 px-4 text-sm'}`}
        >
          {open ? (
            <CloseIcon className="h-5 w-5" />
          ) : (
            <>
              <SparkleIcon className="h-5 w-5 text-amber-300" />
              <span>Ask AI</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-forest-600" title="Online" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}