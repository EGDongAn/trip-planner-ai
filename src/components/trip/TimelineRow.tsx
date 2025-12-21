import React from 'react';
import { Clock, MapPin, DollarSign, CheckCircle, Coffee, Utensils, Plane, Camera, ShoppingBag, Music } from 'lucide-react';

export interface TimelineItem {
  id: string;
  time: string;
  activity: string;
  location: string;
  category: 'transport' | 'food' | 'activity' | 'accommodation' | 'shopping' | 'entertainment';
  cost?: {
    amount: number;
    currency: string;
  };
  verified: boolean;
}

const categoryConfig = {
  transport: { icon: Plane, color: 'text-blue-400 bg-blue-500/20', label: '이동' },
  food: { icon: Utensils, color: 'text-orange-400 bg-orange-500/20', label: '식사' },
  activity: { icon: Camera, color: 'text-green-400 bg-green-500/20', label: '활동' },
  accommodation: { icon: Coffee, color: 'text-purple-400 bg-purple-500/20', label: '숙소' },
  shopping: { icon: ShoppingBag, color: 'text-pink-400 bg-pink-500/20', label: '쇼핑' },
  entertainment: { icon: Music, color: 'text-yellow-400 bg-yellow-500/20', label: '엔터테인먼트' }
};

export interface TimelineRowProps {
  item: TimelineItem;
}

export const TimelineRow: React.FC<TimelineRowProps> = ({ item }) => {
  const categoryInfo = categoryConfig[item.category];
  const CategoryIcon = categoryInfo.icon;

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg hover:bg-slate-750 transition-all duration-200 group">
      <div className="flex items-center gap-3 min-w-[100px]">
        <Clock className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-300">{item.time}</span>
      </div>

      <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
        <CategoryIcon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-slate-100 mb-1">
          {item.activity}
        </h4>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{item.location}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {item.cost && (
          <div className="flex items-center gap-1 text-sm text-slate-300">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span>{item.cost.amount.toLocaleString()} {item.cost.currency}</span>
          </div>
        )}

        {item.verified && (
          <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            <span>확인됨</span>
          </div>
        )}
      </div>
    </div>
  );
};
