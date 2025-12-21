import { useState } from 'react';
import { FlightInfo, HotelInfo } from '@/types/travel';

interface FlightSearchParams {
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
}

interface HotelSearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
}

interface UseTravelSearchReturn {
  flights: FlightInfo[];
  hotels: HotelInfo[];
  isLoading: boolean;
  error: string | null;
  searchFlights: (params: FlightSearchParams) => Promise<void>;
  searchHotels: (params: HotelSearchParams) => Promise<void>;
  clearFlights: () => void;
  clearHotels: () => void;
}

export function useTravelSearch(): UseTravelSearchReturn {
  const [flights, setFlights] = useState<FlightInfo[]>([]);
  const [hotels, setHotels] = useState<HotelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFlights = async (params: FlightSearchParams): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        departure: params.departure,
        arrival: params.arrival,
        departureDate: params.departureDate,
        ...(params.returnDate && { returnDate: params.returnDate }),
        ...(params.adults && { adults: params.adults.toString() })
      });

      const response = await fetch(`/api/travel/flights?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch flights');
      }

      const data = await response.json();
      setFlights(data.flights || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search flights';
      setError(errorMessage);
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchHotels = async (params: HotelSearchParams): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        location: params.location,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        ...(params.adults && { adults: params.adults.toString() })
      });

      const response = await fetch(`/api/travel/hotels?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }

      const data = await response.json();
      setHotels(data.hotels || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search hotels';
      setError(errorMessage);
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFlights = (): void => {
    setFlights([]);
    setError(null);
  };

  const clearHotels = (): void => {
    setHotels([]);
    setError(null);
  };

  return {
    flights,
    hotels,
    isLoading,
    error,
    searchFlights,
    searchHotels,
    clearFlights,
    clearHotels
  };
}
