import { ChatMessage as ChatMessageType } from '@/types/chat';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      className={cn(
        'flex w-full gap-3 px-4 py-3',
        isUser && 'flex-row-reverse'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser && 'bg-blue-600 dark:bg-blue-500',
          isAssistant && 'bg-zinc-700 dark:bg-zinc-600'
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Bot className="h-5 w-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex max-w-[70%] flex-col gap-1',
          isUser && 'items-end'
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-2',
            isUser && 'bg-blue-600 text-white dark:bg-blue-500',
            isAssistant && 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100'
          )}
        >
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <span className="px-2 text-xs text-zinc-500 dark:text-zinc-400">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
