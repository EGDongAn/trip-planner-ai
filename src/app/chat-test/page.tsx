'use client';

import { useState } from 'react';
import { ChatContainer } from '@/components/chat';
import { ChatMessage } from '@/types/chat';

export default function ChatTestPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! 여행 계획을 도와드리겠습니다. 어디로 여행을 가고 싶으신가요?',
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `"${content}"에 대한 여행 계획을 준비하고 있습니다. 잠시만 기다려주세요!`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleSuggestionSelect = (action: string) => {
    console.log('Selected action:', action);

    const actionMessages: Record<string, string> = {
      add_free_time_day2: '2일차에 자유시간을 추가해드릴게요.',
      change_hotel: '호텔 변경 옵션을 보여드리겠습니다.',
      search_flights: '항공편을 검색하고 있습니다.',
      check_budget: '예산 내역을 확인해드리겠습니다.',
    };

    const response: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: actionMessages[action] || '처리 중입니다.',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, response]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Chat Components Test
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          채팅 컴포넌트 테스트 페이지
        </p>
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="h-[600px] w-full max-w-2xl">
          <ChatContainer
            messages={messages}
            onSendMessage={handleSendMessage}
            onSuggestionSelect={handleSuggestionSelect}
          />
        </div>
      </main>
    </div>
  );
}
