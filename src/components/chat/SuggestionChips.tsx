'use client';

import { Sparkles } from 'lucide-react';

interface SuggestionChip {
  id: string;
  label: string;
  action: string;
}

interface SuggestionChipsProps {
  suggestions?: SuggestionChip[];
  onSelect: (action: string) => void;
  disabled?: boolean;
}

const defaultSuggestions: SuggestionChip[] = [
  { id: '1', label: '2일차에 자유시간 추가', action: 'add_free_time_day2' },
  { id: '2', label: '호텔 변경', action: 'change_hotel' },
  { id: '3', label: '항공편 검색', action: 'search_flights' },
  { id: '4', label: '예산 확인', action: 'check_budget' },
];

export function SuggestionChips({
  suggestions = defaultSuggestions,
  onSelect,
  disabled = false,
}: SuggestionChipsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
        <Sparkles className="h-3.5 w-3.5" />
        <span>빠른 액션</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion.action)}
            disabled={disabled}
            className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  );
}
