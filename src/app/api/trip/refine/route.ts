import { NextRequest, NextResponse } from "next/server";
import { TripPlannerEngine } from "@/lib/trip/TripPlannerEngine";
import { toEngineState, updateStateWithRefinedTimeline } from "@/lib/trip/converters";
import type { TripState } from "@/types/trip";

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

    if (!body.currentState || !body.message) {
      return NextResponse.json(
        { error: "currentState and message are required" },
        { status: 400 }
      );
    }

    const { currentState, message } = body as {
      currentState: TripState;
      message: string;
    };

    // Convert main TripState to TripEngineState
    const engineState = toEngineState(currentState);

    if (!engineState) {
      return NextResponse.json(
        { error: "Invalid state: destination, plan, and timeline are required" },
        { status: 400 }
      );
    }

    const engine = new TripPlannerEngine(apiKey);

    // Refine the timeline based on user feedback
    const result = await engine.refineTimeline(engineState, message);

    // Convert the refined timeline back to main types
    let updatedState = currentState;
    if (result.updatedTimeline) {
      updatedState = updateStateWithRefinedTimeline(currentState, result.updatedTimeline);
    }

    return NextResponse.json({
      response: result.response,
      updatedState: result.updatedTimeline ? updatedState : undefined,
      suggestedActions: result.suggestedActions,
      changesSummary: result.changesSummary,
    });
  } catch (error) {
    console.error("Trip refinement error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
