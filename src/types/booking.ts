import type { FlightInfo, HotelInfo } from "./travel";

export type BookingType = "flight" | "hotel" | "unknown";
export type BookingStatus = "uploading" | "parsing" | "ready" | "error";

export interface ParsedFlightInfo {
  type: "flight";
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  duration?: string;
  passengers?: number;
}

export interface ParsedHotelInfo {
  type: "hotel";
  name: string;
  address?: string;
  checkIn: string;
  checkOut: string;
  roomType?: string;
  guests?: number;
}

export interface ParsedUnknownInfo {
  type: "unknown";
  rawText: string;
}

export type ParsedBookingData = ParsedFlightInfo | ParsedHotelInfo | ParsedUnknownInfo;

export interface BookingAttachment {
  id: string;
  type: BookingType;
  fileName: string;
  fileUrl: string;
  parsedData?: ParsedBookingData;
  status: BookingStatus;
  error?: string;
}

export interface UploadBookingResponse {
  success: boolean;
  id: string;
  fileUrl: string;
  type: BookingType;
  parsedData?: ParsedBookingData;
  error?: string;
}

// Helper function to convert ParsedFlightInfo to FlightInfo
export function toFlightInfo(parsed: ParsedFlightInfo): Partial<FlightInfo> {
  return {
    airline: parsed.airline,
    flightNumber: parsed.flightNumber,
    departure: parsed.departure,
    arrival: parsed.arrival,
    duration: parsed.duration || "",
    verified: false,
    source: "manual",
  };
}

// Helper function to convert ParsedHotelInfo to HotelInfo
export function toHotelInfo(parsed: ParsedHotelInfo): Partial<HotelInfo> {
  return {
    name: parsed.name,
    address: parsed.address || "",
    verified: false,
    source: "manual",
  };
}
