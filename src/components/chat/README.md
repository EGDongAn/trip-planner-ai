# Chat Components

Trip Planner의 채팅 UI 컴포넌트 모음입니다.

## 컴포넌트

### ChatContainer
메인 채팅 컨테이너로, 메시지 목록, 입력 필드, 제안 칩을 모두 포함합니다.

### ChatMessage
개별 메시지를 표시하는 컴포넌트입니다.
- `user`: 파란색 배경, 오른쪽 정렬
- `assistant`: 회색 배경, 왼쪽 정렬
- 타임스탬프 자동 표시

### ChatInput
채팅 입력 필드와 전송 버튼을 포함합니다.
- Enter 키로 전송 (Shift+Enter는 줄바꿈)
- 자동 높이 조절 (최대 120px)

### SuggestionChips
빠른 액션을 위한 제안 버튼들을 표시합니다.

## 사용 예제

```tsx
'use client';

import { useState } from 'react';
import { ChatContainer } from '@/components/chat';
import { ChatMessage } from '@/types/chat';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! 여행 계획을 도와드리겠습니다.',
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

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '메시지를 받았습니다!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleSuggestionSelect = (action: string) => {
    console.log('Selected action:', action);
    // 제안 액션 처리
  };

  return (
    <div className="h-screen p-4">
      <ChatContainer
        messages={messages}
        onSendMessage={handleSendMessage}
        onSuggestionSelect={handleSuggestionSelect}
      />
    </div>
  );
}
```

## 스타일링

모든 컴포넌트는 Tailwind CSS를 사용하며 다크 모드를 지원합니다.

## 의존성

- `lucide-react`: 아이콘
- `clsx` & `tailwind-merge`: 클래스 이름 관리
- `@/types/chat`: ChatMessage 타입
