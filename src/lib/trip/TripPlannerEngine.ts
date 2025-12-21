import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";
import {
  DESTINATION_SCHEMA,
  PLAN_SCHEMA,
  TIMELINE_SCHEMA,
  REFINEMENT_SCHEMA,
  type DestinationOption,
  type PlanOption,
  type TimelineRow,
  type TimelineSummary,
  type TripMetadata,
  type TripEngineState,
  type RefinementResponse,
} from "./schemas";
import {
  buildDestinationPrompt,
  buildPlanPrompt,
  buildTimelinePrompt,
  buildRefinementPrompt,
} from "./prompts";

/**
 * Core Trip Planner Engine using Gemini 2.0 Flash with Structured Outputs
 */
export class TripPlannerEngine {
  private genAI: GoogleGenerativeAI;
  private model = "gemini-2.0-flash-exp";

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Gemini API key is required");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Generate 5 destination options based on user input and preferences
   */
  async generateDestinations(
    userInput: string,
    metadata: TripMetadata
  ): Promise<DestinationOption[]> {
    try {
      const prompt = buildDestinationPrompt(userInput, metadata);

      const model = this.genAI.getGenerativeModel({
        model: this.model,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: DESTINATION_SCHEMA,
        },
      });

      const result: GenerateContentResult = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      const parsed = JSON.parse(text);

      if (!parsed.destinations || !Array.isArray(parsed.destinations)) {
        throw new Error("Invalid response format: missing destinations array");
      }

      if (parsed.destinations.length !== 5) {
        console.warn(`Expected 5 destinations, got ${parsed.destinations.length}`);
      }

      return parsed.destinations as DestinationOption[];
    } catch (error) {
      console.error("Error generating destinations:", error);
      throw new Error(
        `Failed to generate destinations: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Generate A/B/C plan options for a selected destination
   */
  async generatePlanOptions(
    destination: DestinationOption,
    metadata: TripMetadata
  ): Promise<PlanOption[]> {
    try {
      const prompt = buildPlanPrompt(destination, metadata);

      const model = this.genAI.getGenerativeModel({
        model: this.model,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: PLAN_SCHEMA,
        },
      });

      const result: GenerateContentResult = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      const parsed = JSON.parse(text);

      if (!parsed.plans || !Array.isArray(parsed.plans)) {
        throw new Error("Invalid response format: missing plans array");
      }

      if (parsed.plans.length !== 3) {
        console.warn(`Expected 3 plans, got ${parsed.plans.length}`);
      }

      return parsed.plans as PlanOption[];
    } catch (error) {
      console.error("Error generating plan options:", error);
      throw new Error(
        `Failed to generate plan options: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Generate detailed timeline with activities, locations, and logistics
   */
  async generateTimeline(
    destination: DestinationOption,
    plan: PlanOption,
    metadata: TripMetadata
  ): Promise<{ timeline: TimelineRow[]; summary: TimelineSummary }> {
    try {
      const prompt = buildTimelinePrompt(destination, plan, metadata);

      const model = this.genAI.getGenerativeModel({
        model: this.model,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: TIMELINE_SCHEMA,
        },
      });

      const result: GenerateContentResult = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      const parsed = JSON.parse(text);

      if (!parsed.timeline || !Array.isArray(parsed.timeline)) {
        throw new Error("Invalid response format: missing timeline array");
      }

      if (!parsed.summary) {
        throw new Error("Invalid response format: missing summary object");
      }

      // Validate timeline structure
      const timeline = parsed.timeline as TimelineRow[];
      const summary = parsed.summary as TimelineSummary;

      // Sort timeline by day and time for consistency
      timeline.sort((a, b) => {
        if (a.day !== b.day) return a.day - b.day;
        // Simple time slot comparison (rough ordering)
        return a.timeSlot.localeCompare(b.timeSlot);
      });

      // Validate summary matches timeline
      if (summary.totalActivities !== timeline.length) {
        console.warn(
          `Summary activity count (${summary.totalActivities}) doesn't match timeline length (${timeline.length})`
        );
        summary.totalActivities = timeline.length;
      }

      const uniqueDays = new Set(timeline.map(t => t.day)).size;
      if (summary.totalDays !== uniqueDays) {
        console.warn(
          `Summary day count (${summary.totalDays}) doesn't match unique days in timeline (${uniqueDays})`
        );
        summary.totalDays = uniqueDays;
      }

      return { timeline, summary };
    } catch (error) {
      console.error("Error generating timeline:", error);
      throw new Error(
        `Failed to generate timeline: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Refine timeline based on conversational user input
   */
  async refineTimeline(
    currentState: TripEngineState,
    userMessage: string
  ): Promise<RefinementResponse> {
    try {
      const prompt = buildRefinementPrompt(currentState, userMessage);

      const model = this.genAI.getGenerativeModel({
        model: this.model,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: REFINEMENT_SCHEMA,
        },
      });

      const result: GenerateContentResult = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      const parsed = JSON.parse(text);

      if (!parsed.response || typeof parsed.response !== "string") {
        throw new Error("Invalid response format: missing or invalid response field");
      }

      const refinementResponse: RefinementResponse = {
        response: parsed.response,
        updatedTimeline: parsed.updatedTimeline || undefined,
        suggestedActions: parsed.suggestedActions || undefined,
        changesSummary: parsed.changesSummary || undefined,
      };

      // If timeline was updated, validate and sort it
      if (refinementResponse.updatedTimeline) {
        refinementResponse.updatedTimeline.sort((a, b) => {
          if (a.day !== b.day) return a.day - b.day;
          return a.timeSlot.localeCompare(b.timeSlot);
        });
      }

      return refinementResponse;
    } catch (error) {
      console.error("Error refining timeline:", error);
      throw new Error(
        `Failed to refine timeline: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get model information
   */
  getModelInfo(): { model: string; provider: string } {
    return {
      model: this.model,
      provider: "Google Gemini",
    };
  }

  /**
   * Validate API key by making a simple test call
   */
  async validateApiKey(): Promise<boolean> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContent("Say 'OK' if you can hear me.");
      const response = result.response;
      const text = response.text();
      return text.length > 0;
    } catch (error) {
      console.error("API key validation failed:", error);
      return false;
    }
  }
}

/**
 * Factory function to create TripPlannerEngine instance
 */
export function createTripPlannerEngine(apiKey?: string): TripPlannerEngine {
  const key = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!key) {
    throw new Error(
      "Gemini API key not provided. Set NEXT_PUBLIC_GEMINI_API_KEY or GEMINI_API_KEY environment variable."
    );
  }

  return new TripPlannerEngine(key);
}

/**
 * Export a singleton instance for convenience (optional)
 * Note: Only use this in client components where env vars are available
 */
let engineInstance: TripPlannerEngine | null = null;

export function getTripPlannerEngine(): TripPlannerEngine {
  if (!engineInstance) {
    engineInstance = createTripPlannerEngine();
  }
  return engineInstance;
}
