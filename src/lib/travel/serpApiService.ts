import { FlightInfo, HotelInfo } from '@/types/travel';

interface FlightSearchParams {
  departure: string;      // Airport code (e.g., ICN)
  arrival: string;        // Airport code (e.g., NRT)
  departureDate: string;  // YYYY-MM-DD
  returnDate?: string;    // YYYY-MM-DD (optional for round trip)
  adults?: number;        // Number of adult passengers
}

interface HotelSearchParams {
  location: string;       // City or location name
  checkIn: string;        // YYYY-MM-DD
  checkOut: string;       // YYYY-MM-DD
  adults?: number;        // Number of guests
}

interface SerpApiFlightResponse {
  flights?: Array<{
    airline?: string;
    flight_number?: string;
    departure_airport?: { id?: string; time?: string };
    arrival_airport?: { id?: string; time?: string };
    duration?: number;
    price?: number;
    currency?: string;
    booking_token?: string;
  }>;
}

interface SerpApiHotelResponse {
  hotels?: Array<{
    name?: string;
    rating?: number;
    stars?: number;
    address?: string;
    gps_coordinates?: { latitude?: number; longitude?: number };
    rate_per_night?: { extracted_lowest?: number; currency?: string };
    amenities?: string[];
    images?: Array<{ thumbnail?: string }>;
    link?: string;
  }>;
}

export class SerpApiService {
  private apiKey: string;
  private baseUrl = 'https://serpapi.com/search.json';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Search for flights using SerpAPI Google Flights engine
   */
  async searchFlights(params: FlightSearchParams): Promise<FlightInfo[]> {
    try {
      const queryParams = new URLSearchParams({
        engine: 'google_flights',
        api_key: this.apiKey,
        departure_id: params.departure,
        arrival_id: params.arrival,
        outbound_date: params.departureDate,
        ...(params.returnDate && { return_date: params.returnDate }),
        ...(params.adults && { adults: params.adults.toString() }),
        currency: 'USD',
        hl: 'en'
      });

      const response = await fetch(`${this.baseUrl}?${queryParams}`);

      if (!response.ok) {
        throw new Error(`SerpAPI request failed: ${response.statusText}`);
      }

      const data: SerpApiFlightResponse = await response.json();

      return this.transformFlightsResponse(data, params);
    } catch (error) {
      console.error('Flight search error:', error);
      throw new Error('Failed to search flights. Please try again.');
    }
  }

  /**
   * Search for hotels using SerpAPI Google Hotels engine
   */
  async searchHotels(params: HotelSearchParams): Promise<HotelInfo[]> {
    try {
      const queryParams = new URLSearchParams({
        engine: 'google_hotels',
        api_key: this.apiKey,
        q: params.location,
        check_in_date: params.checkIn,
        check_out_date: params.checkOut,
        ...(params.adults && { adults: params.adults.toString() }),
        currency: 'USD',
        hl: 'en'
      });

      const response = await fetch(`${this.baseUrl}?${queryParams}`);

      if (!response.ok) {
        throw new Error(`SerpAPI request failed: ${response.statusText}`);
      }

      const data: SerpApiHotelResponse = await response.json();

      return this.transformHotelsResponse(data);
    } catch (error) {
      console.error('Hotel search error:', error);
      throw new Error('Failed to search hotels. Please try again.');
    }
  }

  /**
   * Transform SerpAPI flight response to FlightInfo format
   */
  private transformFlightsResponse(
    data: SerpApiFlightResponse,
    params: FlightSearchParams
  ): FlightInfo[] {
    if (!data.flights || data.flights.length === 0) {
      return [];
    }

    return data.flights.slice(0, 10).map((flight) => {
      const departureTime = flight.departure_airport?.time || '00:00';
      const arrivalTime = flight.arrival_airport?.time || '00:00';
      const duration = flight.duration || 0;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;

      return {
        airline: flight.airline || 'Unknown Airline',
        flightNumber: flight.flight_number || 'N/A',
        departure: {
          airport: flight.departure_airport?.id || params.departure,
          time: departureTime,
          date: params.departureDate
        },
        arrival: {
          airport: flight.arrival_airport?.id || params.arrival,
          time: arrivalTime,
          date: params.departureDate
        },
        duration: `${hours}h ${minutes}m`,
        price: {
          amount: flight.price || 0,
          currency: flight.currency || 'USD'
        },
        bookingUrl: flight.booking_token
          ? `https://www.google.com/travel/flights/booking?token=${flight.booking_token}`
          : '#',
        verified: true,
        source: 'serpapi'
      };
    });
  }

  /**
   * Transform SerpAPI hotel response to HotelInfo format
   */
  private transformHotelsResponse(data: SerpApiHotelResponse): HotelInfo[] {
    if (!data.hotels || data.hotels.length === 0) {
      return [];
    }

    return data.hotels.slice(0, 10).map((hotel) => ({
      name: hotel.name || 'Unknown Hotel',
      rating: hotel.rating || 0,
      stars: hotel.stars || 0,
      address: hotel.address || '',
      coordinates: {
        lat: hotel.gps_coordinates?.latitude || 0,
        lng: hotel.gps_coordinates?.longitude || 0
      },
      pricePerNight: {
        amount: hotel.rate_per_night?.extracted_lowest || 0,
        currency: hotel.rate_per_night?.currency || 'USD'
      },
      amenities: hotel.amenities || [],
      imageUrl: hotel.images?.[0]?.thumbnail,
      bookingUrl: hotel.link || '#',
      verified: true,
      source: 'serpapi'
    }));
  }
}
