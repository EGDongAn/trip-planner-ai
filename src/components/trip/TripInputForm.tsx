import React, { useState } from 'react';
import { MapPin, Users, Calendar, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PresetCards } from './PresetCards';
import { BookingUpload } from './BookingUpload';
import type { BookingAttachment } from '@/types/booking';

export interface TripInputFormProps {
  onSubmit: (data: TripFormData) => void;
  isLoading?: boolean;
}

export interface TripFormData {
  query: string;
  origin?: string;
  travelers?: number;
  startDate?: string;
  endDate?: string;
  presets?: string[];
  bookings?: BookingAttachment[];
}

export const TripInputForm: React.FC<TripInputFormProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [query, setQuery] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [origin, setOrigin] = useState('');
  const [travelers, setTravelers] = useState<number>(2);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [bookings, setBookings] = useState<BookingAttachment[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      query,
      origin: origin || undefined,
      travelers: travelers || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      presets: selectedPresets.length > 0 ? selectedPresets : undefined,
      bookings: bookings.filter(b => b.status === 'ready').length > 0
        ? bookings.filter(b => b.status === 'ready')
        : undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6">
      {/* 텍스트 입력 */}
      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="12월 따뜻한 곳에서 부모님과 5박 6일 여행을 계획하고 싶어요..."
          className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          rows={3}
          required
        />
      </div>

      {/* 프리셋 카드 선택 */}
      <PresetCards
        selected={selectedPresets}
        onSelect={setSelectedPresets}
      />

      {/* 예약 정보 업로드 */}
      <BookingUpload
        bookings={bookings}
        onBookingsChange={setBookings}
      />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
        >
          {showOptions ? '간단히 입력하기' : '상세 옵션 표시'}
        </button>
        <Button type="submit" variant="primary" disabled={isLoading || !query.trim()}>
          <Sparkles className="w-5 h-5 mr-2 inline" />
          여행 계획 생성
        </Button>
      </div>

      {showOptions && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-800/50 rounded-xl">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="출발지"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-400" />
            <Input
              type="number"
              placeholder="인원수"
              value={travelers || ''}
              onChange={(e) => setTravelers(parseInt(e.target.value) || 0)}
              min={1}
              className="text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <Input
              type="date"
              placeholder="출발일"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <Input
              type="date"
              placeholder="귀국일"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      )}
    </form>
  );
};
