// Stage-based state machine
export type TripStage = "initial" | "choose_destination" | "choose_plan" | "itinerary_ready" | "refining";

export interface DestinationOption {
  id: string;
  name: string;
  country: string;
  description: string;
  bestFor: string[];
  estimatedBudget: string;
  climate: string;
  imageUrl?: string;
}

export interface PlanOption {
  id: string;
  label: "A" | "B" | "C";
  name: string;
  description: string;
  pace: "relaxed" | "moderate" | "intense";
  highlights: string[];
  totalDays: number;
  estimatedCost: { min: number; max: number; currency: string };
  includes: string[];
}

export interface TimelineRow {
  id: string;
  day: number;
  date: string;
  time: string;
  activity: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  duration: string;
  category: "transport" | "activity" | "food" | "accommodation" | "free";
  notes?: string;
  cost?: { amount: number; currency: string };
  verified: boolean;
  bookingUrl?: string;
  flightInfo?: FlightInfo;
  hotelInfo?: HotelInfo;
}

export interface TripMetadata {
  travelers: number;
  departureDate: string;
  returnDate: string;
  departureCity: string;
  budget?: number;
  preferences: string[];
  presets?: string[];
  bookings?: BookingAttachment[];
}

import type { BookingAttachment } from "./booking";

export interface TripState {
  stage: TripStage;
  userInput: string;
  destinationOptions: DestinationOption[];
  selectedDestination: DestinationOption | null;
  planOptions: PlanOption[];
  selectedPlan: PlanOption | null;
  timeline: TimelineRow[];
  conversation: ChatMessage[];
  metadata: TripMetadata;
}

// Import types for references
import type { FlightInfo, HotelInfo } from "./travel";
import type { ChatMessage } from "./chat";
