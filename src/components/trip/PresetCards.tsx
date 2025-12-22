'use client';

import React from 'react';
import {
  Palmtree,
  Building2,
  Landmark,
  Mountain,
  UtensilsCrossed,
  Heart,
  Users,
  Camera,
  Sparkles,
  Wallet,
  type LucideIcon
} from 'lucide-react';

interface PresetOption {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const PRESETS: PresetOption[] = [
  { id: 'beach', icon: Palmtree, title: '해변 휴양', description: '바다, 리조트, 휴식' },
  { id: 'city', icon: Building2, title: '도시 탐험', description: '쇼핑, 맛집, 야경' },
  { id: 'culture', icon: Landmark, title: '문화 여행', description: '역사, 박물관, 전통' },
  { id: 'adventure', icon: Mountain, title: '액티비티', description: '하이킹, 스포츠' },
  { id: 'food', icon: UtensilsCrossed, title: '미식 여행', description: '로컬 맛집, 푸드투어' },
  { id: 'romantic', icon: Heart, title: '로맨틱', description: '커플, 허니문, 기념일' },
  { id: 'family', icon: Users, title: '가족 여행', description: '아이동반, 효도여행' },
  { id: 'photo', icon: Camera, title: '포토스팟', description: 'SNS, 인생샷, 뷰맛집' },
  { id: 'luxury', icon: Sparkles, title: '럭셔리', description: '5성급, 프리미엄' },
  { id: 'budget', icon: Wallet, title: '가성비', description: '알뜰여행, 백패커' },
];

export interface PresetCardsProps {
  selected: string[];
  onSelect: (presets: string[]) => void;
}

export const PresetCards: React.FC<PresetCardsProps> = ({ selected, onSelect }) => {
  const handleToggle = (id: string) => {
    if (selected.includes(id)) {
      onSelect(selected.filter((s) => s !== id));
    } else {
      onSelect([...selected, id]);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400">
        어떤 스타일의 여행을 원하시나요? <span className="text-slate-500">(복수 선택 가능)</span>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isSelected = selected.includes(preset.id);

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleToggle(preset.id)}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200
                ${isSelected
                  ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500/50'
                  : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600'
                }
              `}
            >
              <Icon
                className={`w-6 h-6 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}
              />
              <div className="text-center">
                <p className={`text-sm font-medium ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                  {preset.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                  {preset.description}
                </p>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { PRESETS };
export type { PresetOption };
