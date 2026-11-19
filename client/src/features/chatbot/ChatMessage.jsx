import { useEffect, useState } from 'react';
import { CheckIcon, CopyIcon, SparkleIcon } from './icons.jsx';

// Round gradient avatar shown next to every AI message.
export function AiAvatar({ size = 'h-8 w-8', icon = 'h-4 w-4' }) {
  return (
    <div className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-forest-600 to-clay-500 text-white shadow-card`}>
      <SparkleIcon className={icon} />
    </div>
  );
}

// Tiny markdown support so AI answers look good: **bold** and "- bullet" lines.
function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4
      ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
      : part
  );
}

function RichText({ text }) {
  const blocks = [];
  let list = [];
  const flush = (key) => {
    if (list.length) {
      blocks.push(<ul key={`ul-${key}`} className="my-1.5 list-disc space-y-1 pl-5">{list}</ul>);
      list = [];
    }
  };
  text.split('\n').forEach((line, i) => {
    const bullet = line.match(/^\s*[-*•]\s+(.*)/);
    if (bullet) {
      list.push(<li key={i}>{renderInline(bullet[1])}</li>);
    } else {
      flush(i);
      if (line.trim()) blocks.push(<p key={i} className="my-1">{renderInline(line)}</p>);
    }
  });
  flush('end');
  return <>{blocks}</>;
}

// Reveals the AI reply a few characters at a time (typewriter effect).
function useTypewriter(text, enabled, onTick, onDone) {
  const [shown, setShown] = useState(enabled ? 0 : text.length);

  useEffect(() => {
    if (!enabled) return undefined;
    let index = 0;
    const step = Math.max(1, Math.ceil(text.length / 110));
    const timer = setInterval(() => {
      index = Math.min(text.length, index + step);
      setShown(index);
      onTick?.();
      if (index >= text.length) {
        clearInterval(timer);
        onDone?.();
      }
    }, 20);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, enabled]);

  return text.slice(0, shown);
}

export default function ChatMessage({ role, content, animate = false, onTick, onDone }) {
  const [copied, setCopied] = useState(false);
  const isUser = role === 'user';
  const visible = useTypewriter(content, !isUser && animate, onTick, onDone);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard not available — ignore */ }
  };

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[82%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-gradient-to-br from-forest-600 to-forest-500 px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-card">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-2.5">
      <AiAvatar />
      <div className="min-w-0 max-w-[82%]">
        <div className="break-words rounded-2xl rounded-tl-md border border-mist-200 bg-white px-3.5 py-2 text-sm leading-relaxed text-ink shadow-card">
          <RichText text={visible} />
        </div>
        {!animate && content && (
          <button
            type="button"
            onClick={copy}
            className="mt-1 flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-mist-600 opacity-0 transition-opacity hover:text-forest-600 focus-visible:opacity-100 group-hover:opacity-100"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5" aria-live="polite" aria-label="AI is thinking">
      <AiAvatar />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-mist-200 bg-white px-4 py-3.5 shadow-card">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-2 w-2 animate-bounce rounded-full bg-gradient-to-br from-forest-500 to-clay-500"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}