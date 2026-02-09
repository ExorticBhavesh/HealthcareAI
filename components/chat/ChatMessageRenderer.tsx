import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageRendererProps {
  content: string;
  role: 'user' | 'assistant';
}

function formatAssistantMessage(content: string): string {
  // Already contains emoji section headers — return as-is
  if (/[🧠📌✅⚠️📊💡🔍]/.test(content)) return content;

  const lines = content.split('\n').filter(Boolean);
  if (lines.length <= 2) return content;

  // Try to detect key sections and add structure
  return content;
}

function renderFormattedContent(content: string) {
  const sections = content.split('\n\n');

  return sections.map((section, i) => {
    const trimmed = section.trim();
    if (!trimmed) return null;

    // Detect header-like lines (emoji + text or **bold** headers)
    const headerMatch = trimmed.match(/^(#{1,3}\s+|[🧠📌✅⚠️📊💡🔍🩺]\s*\*{0,2})(.+)/);
    if (headerMatch) {
      return (
        <div key={i} className="mt-3 first:mt-0">
          <p className="font-bold text-xs uppercase tracking-wider text-primary mb-1.5">
            {trimmed.split('\n')[0].replace(/\*\*/g, '').replace(/#{1,3}\s+/, '')}
          </p>
          {trimmed.split('\n').slice(1).map((line, j) => (
            <p key={j} className="text-sm leading-relaxed text-foreground/80">
              {renderInlineFormatting(line)}
            </p>
          ))}
        </div>
      );
    }

    // Detect bullet points
    if (/^[\-•\*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').filter(Boolean);
      return (
        <ul key={i} className="space-y-1.5 mt-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm leading-relaxed text-foreground/80">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 shrink-0" />
              <span>{renderInlineFormatting(item.replace(/^[\-•\*\d.]\s*/, ''))}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Regular paragraph
    return (
      <p key={i} className="text-sm leading-relaxed text-foreground/80 mt-1.5 first:mt-0">
        {renderInlineFormatting(trimmed)}
      </p>
    );
  });
}

function renderInlineFormatting(text: string) {
  // Handle **bold** formatting
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export const ChatMessageRenderer = memo(function ChatMessageRenderer({ content, role }: ChatMessageRendererProps) {
  if (role === 'user') {
    return (
      <div className="flex justify-end gap-2">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary text-primary-foreground px-4 py-2.5">
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center mt-1">
          <User className="w-3.5 h-3.5 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-2">
      <div className="flex-shrink-0 w-7 h-7 rounded-full gradient-health flex items-center justify-center mt-1 shadow-sm">
        <Bot className="w-3.5 h-3.5 text-primary-foreground" />
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-muted/80 backdrop-blur-sm border border-border/30 px-4 py-3">
        {renderFormattedContent(content)}
      </div>
    </div>
  );
});
