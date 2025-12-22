import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ParsedBookingData, UploadBookingResponse } from "@/types/booking";

// Schema for booking parsing
const bookingParseSchema = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["flight", "hotel", "unknown"],
    },
    // Flight fields
    airline: { type: "string" },
    flightNumber: { type: "string" },
    departure: {
      type: "object",
      properties: {
        airport: { type: "string" },
        time: { type: "string" },
        date: { type: "string" },
      },
    },
    arrival: {
      type: "object",
      properties: {
        airport: { type: "string" },
        time: { type: "string" },
        date: { type: "string" },
      },
    },
    duration: { type: "string" },
    passengers: { type: "number" },
    // Hotel fields
    name: { type: "string" },
    address: { type: "string" },
    checkIn: { type: "string" },
    checkOut: { type: "string" },
    roomType: { type: "string" },
    guests: { type: "number" },
    // Unknown
    rawText: { type: "string" },
  },
  required: ["type"],
};

const parseBookingPrompt = `Analyze this booking document/image and extract information.

IMPORTANT: Return valid JSON only, no markdown.

If it's a FLIGHT booking, return:
{
  "type": "flight",
  "airline": "airline name",
  "flightNumber": "XX123",
  "departure": { "airport": "ICN or airport code", "time": "HH:MM", "date": "YYYY-MM-DD" },
  "arrival": { "airport": "HKG or airport code", "time": "HH:MM", "date": "YYYY-MM-DD" },
  "duration": "2h 30m",
  "passengers": 1
}

If it's a HOTEL booking, return:
{
  "type": "hotel",
  "name": "Hotel Name",
  "address": "Full address",
  "checkIn": "YYYY-MM-DD",
  "checkOut": "YYYY-MM-DD",
  "roomType": "Deluxe Double",
  "guests": 2
}

If you cannot determine the type or extract information, return:
{
  "type": "unknown",
  "rawText": "summary of what you can see"
}

Extract as much information as possible from the document.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "API key not configured" } as UploadBookingResponse,
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" } as UploadBookingResponse,
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only PDF, PNG, JPG allowed." } as UploadBookingResponse,
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Determine mime type for Gemini
    let mimeType = file.type;
    if (mimeType === "application/pdf") {
      mimeType = "application/pdf";
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: bookingParseSchema,
      } as never,
    });

    // Call Gemini Vision API
    const result = await model.generateContent([
      parseBookingPrompt,
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
    ]);

    const response = result.response;
    const text = response.text();

    let parsedData: ParsedBookingData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      parsedData = { type: "unknown", rawText: text };
    }

    // Generate unique ID
    const id = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // For now, we'll store the file URL as a data URL (in production, use R2)
    // In Cloudflare Workers with R2, we would do:
    // const r2 = env.BOOKING_FILES;
    // await r2.put(id, bytes, { httpMetadata: { contentType: file.type } });
    // const fileUrl = `https://your-r2-bucket.r2.dev/${id}`;

    // Temporary: use data URL for local development
    const fileUrl = `data:${file.type};base64,${base64.substring(0, 100)}...`;

    return NextResponse.json({
      success: true,
      id,
      fileUrl,
      type: parsedData.type,
      parsedData,
    } as UploadBookingResponse);
  } catch (error) {
    console.error("Upload booking error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process booking",
      } as UploadBookingResponse,
      { status: 500 }
    );
  }
}
