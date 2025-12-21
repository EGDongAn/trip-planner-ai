export interface FlightInfo {
  airline: string;
  flightNumber: string;
  departure: { airport: string; time: string; date: string };
  arrival: { airport: string; time: string; date: string };
  duration: string;
  price: { amount: number; currency: string };
  bookingUrl: string;
  verified: boolean;
  source: "serpapi" | "manual";
}

export interface HotelInfo {
  name: string;
  rating: number;
  stars: number;
  address: string;
  coordinates: { lat: number; lng: number };
  pricePerNight: { amount: number; currency: string };
  amenities: string[];
  imageUrl?: string;
  bookingUrl: string;
  verified: boolean;
  source: "serpapi" | "manual";
}
