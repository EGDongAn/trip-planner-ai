'use client';

import React, { useState } from 'react';
import { Calendar, DollarSign, Download, FileSpreadsheet, Map, ChevronDown } from 'lucide-react';
import { TimelineRow as TimelineRowComponent, TimelineItem } from './TimelineRow';
import { downloadCSV, downloadKML } from '@/lib/export/mapsExport';
import type { TimelineRow } from '@/types/trip';

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
  tripName?: string;
  rawTimeline?: TimelineRow[];
}

export const TimelineDisplay: React.FC<TimelineDisplayProps> = ({
  schedule,
  totalCost,
  tripName = 'My Trip',
  rawTimeline
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportCSV = () => {
    const filename = `${tripName.replace(/\s+/g, '-').toLowerCase()}-itinerary.csv`;
    downloadCSV(schedule, rawTimeline, filename);
    setShowExportMenu(false);
  };

  const handleExportKML = () => {
    const filename = `${tripName.replace(/\s+/g, '-').toLowerCase()}-itinerary.kml`;
    downloadKML(schedule, rawTimeline, tripName, filename);
    setShowExportMenu(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-100">
          상세 일정
        </h2>
        <div className="flex items-center gap-3">
          {totalCost && (
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-400">총 예상 비용:</span>
              <span className="text-lg font-bold text-slate-100">
                {totalCost.amount.toLocaleString()} {totalCost.currency}
              </span>
            </div>
          )}

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">내보내기</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden">
                  <div className="p-2 border-b border-slate-700">
                    <p className="text-xs text-slate-400 px-2">Google My Maps용</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleExportCSV}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-200 hover:bg-slate-700 rounded-md transition-colors"
                    >
                      <FileSpreadsheet className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm font-medium">CSV 다운로드</p>
                        <p className="text-xs text-slate-400">스프레드시트 호환</p>
                      </div>
                    </button>
                    <button
                      onClick={handleExportKML}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-200 hover:bg-slate-700 rounded-md transition-colors"
                    >
                      <Map className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm font-medium">KML 다운로드</p>
                        <p className="text-xs text-slate-400">Google Earth/Maps 호환</p>
                      </div>
                    </button>
                  </div>
                  <div className="p-2 border-t border-slate-700 bg-slate-800/50">
                    <p className="text-xs text-slate-500 px-2">
                      My Maps에서 가져오기로 사용하세요
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
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
                <TimelineRowComponent key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
