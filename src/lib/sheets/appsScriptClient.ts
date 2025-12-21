import type { TimelineRow, TripMetadata } from '@/types/trip';

export interface SheetExportData {
  destination: string;
  plan: string;
  timeline: TimelineRow[];
  metadata: TripMetadata;
}

export interface SheetExportResponse {
  success: boolean;
  spreadsheetUrl?: string;
  spreadsheetId?: string;
  error?: string;
}

/**
 * Export trip data to Google Sheets via Apps Script Web App
 *
 * @param data - Trip data to export
 * @returns Promise with export result including spreadsheet URL
 */
export async function exportToSheet(data: SheetExportData): Promise<SheetExportResponse> {
  const webAppUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

  if (!webAppUrl) {
    return {
      success: false,
      error: 'Apps Script URL이 설정되지 않았습니다. 환경 변수를 확인해주세요.'
    };
  }

  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'createTripSheet',
        data: {
          destination: data.destination,
          plan: data.plan,
          metadata: {
            travelers: data.metadata.travelers,
            departureDate: data.metadata.departureDate,
            returnDate: data.metadata.returnDate,
            departureCity: data.metadata.departureCity,
            budget: data.metadata.budget,
            preferences: data.metadata.preferences
          },
          timeline: data.timeline.map(row => ({
            day: row.day,
            date: row.date,
            time: row.time,
            activity: row.activity,
            location: row.location,
            duration: row.duration,
            category: row.category,
            notes: row.notes,
            cost: row.cost,
            verified: row.verified,
            bookingUrl: row.bookingUrl
          }))
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        spreadsheetUrl: result.spreadsheetUrl,
        spreadsheetId: result.spreadsheetId
      };
    } else {
      return {
        success: false,
        error: result.error || '스프레드시트 생성에 실패했습니다.'
      };
    }
  } catch (error) {
    console.error('Sheet export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

/**
 * Validate Apps Script configuration
 */
export function isAppsScriptConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
}
