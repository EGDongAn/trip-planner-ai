import { NextRequest, NextResponse } from 'next/server';
import type { TimelineRow, TripMetadata } from '@/types/trip';

export const runtime = 'edge';

interface ExportRequestBody {
  destination: string;
  plan: string;
  timeline: TimelineRow[];
  metadata: TripMetadata;
}

/**
 * POST /api/sheets/export
 *
 * Server-side endpoint for exporting trip data to Google Sheets.
 * This route proxies the request to the Apps Script Web App to avoid CORS issues.
 *
 * @param request - Next.js request object
 * @returns Response with spreadsheet URL or error message
 */
export async function POST(request: NextRequest) {
  try {
    const body: ExportRequestBody = await request.json();
    const { destination, plan, timeline, metadata } = body;

    // Validate required fields
    if (!destination || !plan || !timeline || !metadata) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // Get Apps Script URL from environment
    const webAppUrl = process.env.APPS_SCRIPT_URL || process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

    if (!webAppUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Apps Script URL이 설정되지 않았습니다. 환경 변수를 확인해주세요.'
        },
        { status: 500 }
      );
    }

    // Forward request to Apps Script
    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'createTripSheet',
        data: {
          destination,
          plan,
          metadata: {
            travelers: metadata.travelers,
            departureDate: metadata.departureDate,
            returnDate: metadata.returnDate,
            departureCity: metadata.departureCity,
            budget: metadata.budget,
            preferences: metadata.preferences
          },
          timeline: timeline.map(row => ({
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
      throw new Error(`Apps Script responded with status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({
        success: true,
        spreadsheetUrl: result.spreadsheetUrl,
        spreadsheetId: result.spreadsheetId
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || '스프레드시트 생성에 실패했습니다.'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Sheets export API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sheets/export
 *
 * Health check endpoint to verify API route is working
 */
export async function GET() {
  const configured = !!(process.env.APPS_SCRIPT_URL || process.env.NEXT_PUBLIC_APPS_SCRIPT_URL);

  return NextResponse.json({
    status: 'ok',
    configured,
    message: configured
      ? 'Google Sheets export is configured'
      : 'Apps Script URL not configured'
  });
}
