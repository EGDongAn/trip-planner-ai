import { NextRequest, NextResponse } from 'next/server';
import { SerpApiService } from '@/lib/travel/serpApiService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const location = searchParams.get('location');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const adults = searchParams.get('adults')
    ? parseInt(searchParams.get('adults')!)
    : undefined;

  if (!location || !checkIn || !checkOut) {
    return NextResponse.json(
      { error: 'Missing required parameters: location, checkIn, and checkOut' },
      { status: 400 }
    );
  }

  // Validate dates
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (checkOutDate <= checkInDate) {
    return NextResponse.json(
      { error: 'checkOut must be after checkIn' },
      { status: 400 }
    );
  }

  const apiKey = process.env.SERPAPI_API_KEY;

  // Return mock data if API key is not configured
  if (!apiKey) {
    console.warn('SERPAPI_API_KEY not configured, returning mock data');
    return NextResponse.json({
      hotels: [
        {
          name: 'Grand Plaza Hotel',
          rating: 4.5,
          stars: 4,
          address: `${location} Downtown`,
          coordinates: {
            lat: 35.6762,
            lng: 139.6503
          },
          pricePerNight: {
            amount: 150,
            currency: 'USD'
          },
          amenities: ['Free WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa'],
          imageUrl: undefined,
          bookingUrl: '#',
          verified: false,
          source: 'manual' as const
        },
        {
          name: 'Luxury Resort & Spa',
          rating: 4.8,
          stars: 5,
          address: `${location} Beach Area`,
          coordinates: {
            lat: 35.6862,
            lng: 139.6603
          },
          pricePerNight: {
            amount: 250,
            currency: 'USD'
          },
          amenities: ['Free WiFi', 'Pool', 'Spa', 'Beach Access', 'Restaurant', 'Bar'],
          imageUrl: undefined,
          bookingUrl: '#',
          verified: false,
          source: 'manual' as const
        },
        {
          name: 'Budget Inn',
          rating: 3.8,
          stars: 3,
          address: `${location} City Center`,
          coordinates: {
            lat: 35.6662,
            lng: 139.6403
          },
          pricePerNight: {
            amount: 80,
            currency: 'USD'
          },
          amenities: ['Free WiFi', 'Breakfast'],
          imageUrl: undefined,
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
    const hotels = await serpApi.searchHotels({
      location,
      checkIn,
      checkOut,
      adults
    });

    return NextResponse.json({ hotels });
  } catch (error) {
    console.error('Hotel search error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to search hotels',
        hotels: []
      },
      { status: 500 }
    );
  }
}
