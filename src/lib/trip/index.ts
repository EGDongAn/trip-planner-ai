/**
 * Trip Planner Library - Gemini-powered trip planning engine
 *
 * This module provides a complete trip planning solution using Gemini's
 * Structured Outputs for consistent, type-safe responses.
 */

// Export the main engine
export {
  TripPlannerEngine,
  createTripPlannerEngine,
  getTripPlannerEngine,
} from "./TripPlannerEngine";

// Export all schemas
export {
  DESTINATION_SCHEMA,
  PLAN_SCHEMA,
  TIMELINE_SCHEMA,
  REFINEMENT_SCHEMA,
} from "./schemas";

// Export all types
export type {
  DestinationOption,
  PlanOption,
  TimelineRow,
  TimelineLocation,
  TransportInfo,
  TimelineSummary,
  TripMetadata,
  TripEngineState,
  RefinementResponse,
} from "./schemas";

// Export converters
export {
  toEngineState,
  updateStateWithRefinedTimeline,
} from "./converters";

// Export prompt builders (useful for customization)
export {
  buildDestinationPrompt,
  buildPlanPrompt,
  buildTimelinePrompt,
  buildRefinementPrompt,
} from "./prompts";
