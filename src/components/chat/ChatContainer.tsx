'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SuggestionChips } from './SuggestionChips';

interface ChatContainerProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  onSuggestionSelect?: (action: string) => void;
  disabled?: boolean;
  showSuggestions?: boolean;
}

export function ChatContainer({
  messages,
  onSendMessage,
  onSuggestionSelect,
  disabled = false,
  showSuggestions = true,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestionSelect = (action: string) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(action);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      {/* Messages Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{
          scrollBehavior: 'smooth',
        }}
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center p-8">
            <div className="text-center">
              <p className="text-lg font-medium text-zinc-400 dark:text-zinc-500">
                여행 계획을 시작해보세요
              </p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                목적지나 여행 날짜를 입력하세요
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      {showSuggestions && (
        <SuggestionChips
          onSelect={handleSuggestionSelect}
          disabled={disabled}
        />
      )}

      {/* Input Area */}
      <ChatInput onSend={onSendMessage} disabled={disabled} />
    </div>
  );
}
