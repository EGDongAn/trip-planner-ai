import { NextRequest, NextResponse } from 'next/server';
import { SerpApiService } from '@/lib/travel/serpApiService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const departure = searchParams.get('departure');
  const arrival = searchParams.get('arrival');
  const departureDate = searchParams.get('departureDate');
  const returnDate = searchParams.get('returnDate') || undefined;
  const adults = searchParams.get('adults')
    ? parseInt(searchParams.get('adults')!)
    : undefined;

  if (!departure || !arrival || !departureDate) {
    return NextResponse.json(
      { error: 'Missing required parameters: departure, arrival, and departureDate' },
      { status: 400 }
    );
  }

  const apiKey = process.env.SERPAPI_API_KEY;

  // Return mock data if API key is not configured
  if (!apiKey) {
    console.warn('SERPAPI_API_KEY not configured, returning mock data');
    return NextResponse.json({
      flights: [
        {
          airline: 'Mock Airlines',
          flightNumber: 'MA123',
          departure: {
            airport: departure,
            time: '10:00',
            date: departureDate
          },
          arrival: {
            airport: arrival,
            time: '15:30',
            date: departureDate
          },
          duration: '5h 30m',
          price: {
            amount: 299,
            currency: 'USD'
          },
          bookingUrl: '#',
          verified: false,
          source: 'manual' as const
        },
        {
          airline: 'Sky Express',
          flightNumber: 'SE456',
          departure: {
            airport: departure,
            time: '14:00',
            date: departureDate
          },
          arrival: {
            airport: arrival,
            time: '19:30',
            date: departureDate
          },
          duration: '5h 30m',
          price: {
            amount: 349,
            currency: 'USD'
          },
          bookingUrl: '#',
          verified: false,
          source: 'manual' as const
        }
      ],
      disclaimer: 'Mock data - SERPAPI_API_KEY not configured'
    });
  }

  try {
    const serpApi = new SerpApiService(apiKey);
    const flights = await serpApi.searchFlights({
      departure,
      arrival,
      departureDate,
      returnDate,
      adults
    });

    return NextResponse.json({ flights });
  } catch (error) {
    console.error('Flight search error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to search flights',
        flights: []
      },
      { status: 500 }
    );
  }
}
