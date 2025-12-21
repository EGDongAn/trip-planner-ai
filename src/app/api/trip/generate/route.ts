import { NextRequest, NextResponse } from "next/server";
import { TripPlannerEngine } from "@/lib/trip/TripPlannerEngine";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const engine = new TripPlannerEngine(apiKey);

    switch (body.action) {
      case "destinations": {
        if (!body.userInput) {
          return NextResponse.json(
            { error: "userInput is required for destinations action" },
            { status: 400 }
          );
        }
        const destinations = await engine.generateDestinations(
          body.userInput,
          body.metadata
        );
        return NextResponse.json({ destinations });
      }

      case "plans": {
        if (!body.destination) {
          return NextResponse.json(
            { error: "destination is required for plans action" },
            { status: 400 }
          );
        }
        const plans = await engine.generatePlanOptions(
          body.destination,
          body.metadata
        );
        return NextResponse.json({ plans });
      }

      case "timeline": {
        if (!body.destination || !body.plan) {
          return NextResponse.json(
            { error: "destination and plan are required for timeline action" },
            { status: 400 }
          );
        }
        const timeline = await engine.generateTimeline(
          body.destination,
          body.plan,
          body.metadata
        );
        return NextResponse.json({ timeline });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action. Must be one of: destinations, plans, timeline" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Trip generation error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
