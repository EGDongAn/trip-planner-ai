import React from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import { TimelineRow, TimelineItem } from './TimelineRow';

export interface DaySchedule {
  date: string;
  dayNumber: number;
  items: TimelineItem[];
  dailyCost?: {
    total: number;
    currency: string;
  };
}

export interface TimelineDisplayProps {
  schedule: DaySchedule[];
  totalCost?: {
    amount: number;
    currency: string;
  };
}

export const TimelineDisplay: React.FC<TimelineDisplayProps> = ({
  schedule,
  totalCost
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-100">
          상세 일정
        </h2>
        {totalCost && (
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
            <DollarSign className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-400">총 예상 비용:</span>
            <span className="text-lg font-bold text-slate-100">
              {totalCost.amount.toLocaleString()} {totalCost.currency}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {schedule.map((day) => (
          <div key={day.date} className="space-y-3">
            <div className="flex items-center justify-between sticky top-0 bg-slate-900 py-3 z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">
                  {day.dayNumber}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-lg font-semibold text-slate-100">
                    {new Date(day.date).toLocaleDateString('ko-KR', {
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </span>
                </div>
              </div>
              {day.dailyCost && (
                <div className="flex items-center gap-1 text-sm text-slate-300">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span>{day.dailyCost.total.toLocaleString()} {day.dailyCost.currency}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 pl-11">
              {day.items.map((item) => (
                <TimelineRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
