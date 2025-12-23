'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Upload, Plane, Hotel, X, FileText, Loader2, AlertCircle } from 'lucide-react';
import type { BookingAttachment, ParsedFlightInfo, ParsedHotelInfo } from '@/types/booking';

export interface BookingUploadProps {
  bookings: BookingAttachment[];
  onBookingsChange: (bookings: BookingAttachment[]) => void;
}

export const BookingUpload: React.FC<BookingUploadProps> = ({
  bookings,
  onBookingsChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Use ref to track current bookings to avoid stale closure
  const bookingsRef = React.useRef(bookings);
  bookingsRef.current = bookings;

  const handleUpload = useCallback(async (file: File) => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Add to list with uploading status
    const newBooking: BookingAttachment = {
      id: tempId,
      type: 'unknown',
      fileName: file.name,
      fileUrl: '',
      status: 'uploading',
    };

    // Add new booking using current ref value
    onBookingsChange([...bookingsRef.current, newBooking]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/trip/upload-booking', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Update the booking with parsed data using ref for current state
        onBookingsChange(
          bookingsRef.current
            .filter((b) => b.id !== tempId)
            .concat({
              id: result.id,
              type: result.type,
              fileName: file.name,
              fileUrl: result.fileUrl,
              parsedData: result.parsedData,
              status: 'ready',
            })
        );
      } else {
        // Update with error using ref for current state
        onBookingsChange(
          bookingsRef.current.map((b) =>
            b.id === tempId
              ? { ...b, status: 'error' as const, error: result.error || 'Upload failed' }
              : b
          )
        );
      }
    } catch (error) {
      console.error('Upload error:', error);
      onBookingsChange(
        bookingsRef.current.map((b) =>
          b.id === tempId
            ? { ...b, status: 'error' as const, error: 'Network error' }
            : b
        )
      );
    }
  }, [onBookingsChange]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

    Array.from(files).forEach((file) => {
      if (validTypes.includes(file.type)) {
        handleUpload(file);
      }
    });
  }, [handleUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (id: string) => {
    onBookingsChange(bookings.filter((b) => b.id !== id));
  };

  const renderBookingCard = (booking: BookingAttachment) => {
    const isLoading = booking.status === 'uploading' || booking.status === 'parsing';
    const isError = booking.status === 'error';
    const isFlight = booking.type === 'flight';
    const isHotel = booking.type === 'hotel';

    const Icon = isFlight ? Plane : isHotel ? Hotel : FileText;

    let summary = booking.fileName;
    if (booking.parsedData) {
      if (booking.parsedData.type === 'flight') {
        const f = booking.parsedData as ParsedFlightInfo;
        if (f.departure?.airport && f.arrival?.airport) {
          summary = `${f.departure.airport} → ${f.arrival.airport}`;
        }
      } else if (booking.parsedData.type === 'hotel') {
        const h = booking.parsedData as ParsedHotelInfo;
        if (h.name) {
          summary = h.name;
        }
      }
    }

    let detail = '';
    if (booking.parsedData) {
      if (booking.parsedData.type === 'flight') {
        const f = booking.parsedData as ParsedFlightInfo;
        const parts = [];
        if (f.flightNumber) parts.push(f.flightNumber);
        if (f.departure?.date) parts.push(f.departure.date);
        if (f.departure?.time) parts.push(f.departure.time);
        detail = parts.join(' | ');
      } else if (booking.parsedData.type === 'hotel') {
        const h = booking.parsedData as ParsedHotelInfo;
        if (h.checkIn && h.checkOut) {
          detail = `${h.checkIn} ~ ${h.checkOut}${h.roomType ? ` | ${h.roomType}` : ''}`;
        }
      }
    }

    return (
      <div
        key={booking.id}
        className={`
          relative flex items-start gap-3 p-3 rounded-lg border
          ${isError
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-slate-800/50 border-slate-700'
          }
        `}
      >
        <div
          className={`
            p-2 rounded-lg
            ${isFlight ? 'bg-blue-500/20 text-blue-400' : ''}
            ${isHotel ? 'bg-purple-500/20 text-purple-400' : ''}
            ${!isFlight && !isHotel ? 'bg-slate-700 text-slate-400' : ''}
          `}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isError ? (
            <AlertCircle className="w-5 h-5 text-red-400" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">
            {summary}
          </p>
          {detail && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {detail}
            </p>
          )}
          {isLoading && (
            <p className="text-xs text-slate-500 mt-0.5">
              {booking.status === 'uploading' ? '업로드 중...' : '분석 중...'}
            </p>
          )}
          {isError && (
            <p className="text-xs text-red-400 mt-0.5">
              {booking.error || '오류 발생'}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => handleRemove(booking.id)}
          className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400 flex items-center gap-2">
        <span>📎</span>
        <span>예약 정보 첨부 <span className="text-slate-500">(선택사항)</span></span>
      </p>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all
          ${isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/30'
          }
        `}
      >
        <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-400' : 'text-slate-500'}`} />
        <div className="text-center">
          <p className="text-sm text-slate-300">
            파일을 드래그하거나 클릭하여 업로드
          </p>
          <p className="text-xs text-slate-500 mt-1">
            PDF, PNG, JPG 지원
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Uploaded Files */}
      {bookings.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500">업로드된 예약:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {bookings.map(renderBookingCard)}
          </div>
        </div>
      )}
    </div>
  );
};
