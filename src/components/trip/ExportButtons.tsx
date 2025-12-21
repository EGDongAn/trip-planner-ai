'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, FileText, Image, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { exportToSheet } from '@/lib/sheets/appsScriptClient';
import { exportToPdf } from '@/lib/export/pdfService';
import { exportToImage } from '@/lib/export/imageService';
import type { TimelineRow, TripMetadata } from '@/types/trip';

export interface ExportButtonsProps {
  destination: string;
  plan: string;
  timeline: TimelineRow[];
  metadata: TripMetadata;
  className?: string;
}

type ExportType = 'sheets' | 'pdf' | 'image' | null;

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  destination,
  plan,
  timeline,
  metadata,
  className = ''
}) => {
  const [loading, setLoading] = useState<ExportType>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExportToSheets = async () => {
    setLoading('sheets');
    setError(null);
    setSuccess(null);

    try {
      const result = await exportToSheet({
        destination,
        plan,
        timeline,
        metadata
      });

      if (result.success && result.spreadsheetUrl) {
        setSuccess('Google Sheets로 내보내기 완료!');
        // Open the spreadsheet in a new tab
        window.open(result.spreadsheetUrl, '_blank');
      } else {
        setError(result.error || '내보내기에 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(null);
      // Clear messages after 5 seconds
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
    }
  };

  const handleExportToPdf = async () => {
    setLoading('pdf');
    setError(null);
    setSuccess(null);

    try {
      await exportToPdf({
        destination,
        plan,
        timeline,
        metadata
      });
      setSuccess('PDF 다운로드 완료!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF 생성에 실패했습니다.');
    } finally {
      setLoading(null);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
    }
  };

  const handleExportToImage = async () => {
    setLoading('image');
    setError(null);
    setSuccess(null);

    try {
      await exportToImage({
        destination,
        plan,
        timeline,
        metadata,
        format: 'png'
      });
      setSuccess('이미지 다운로드 완료!');
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 생성에 실패했습니다.');
    } finally {
      setLoading(null);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Download className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-100">일정 내보내기</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          onClick={handleExportToSheets}
          disabled={loading !== null}
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          {loading === 'sheets' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="w-4 h-4" />
          )}
          <span>Google Sheets</span>
        </Button>

        <Button
          onClick={handleExportToPdf}
          disabled={loading !== null}
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          {loading === 'pdf' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>PDF</span>
        </Button>

        <Button
          onClick={handleExportToImage}
          disabled={loading !== null}
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          {loading === 'image' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Image className="w-4 h-4" />
          )}
          <span>이미지</span>
        </Button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
          ✅ {success}
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-slate-400 mt-2">
        여행 일정을 다양한 형식으로 저장하거나 공유할 수 있습니다.
      </p>
    </div>
  );
};
