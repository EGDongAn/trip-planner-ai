import type { TripState } from "@/types/trip";
import type {
  TripEngineState,
  DestinationOption as SchemaDestinationOption,
  PlanOption as SchemaPlanOption,
  TimelineRow as SchemaTimelineRow,
  TripMetadata as SchemaTripMetadata,
} from "./schemas";

/**
 * Convert main TripState to TripEngineState for use with TripPlannerEngine
 * This assumes the user has already selected a destination and plan
 */
export function toEngineState(state: TripState): TripEngineState | null {
  // Check if we have the required data for refinement
  if (!state.selectedDestination || !state.selectedPlan || state.timeline.length === 0) {
    return null;
  }

  // Convert destination from main types to schema types
  const destination: SchemaDestinationOption = {
    id: state.selectedDestination.id,
    name: state.selectedDestination.name,
    country: state.selectedDestination.country,
    description: state.selectedDestination.description,
    bestFor: state.selectedDestination.bestFor,
    estimatedBudget: state.selectedDestination.estimatedBudget,
    imageUrl: state.selectedDestination.imageUrl,
    climate: state.selectedDestination.climate,
  };

  // Convert plan from main types to schema types
  const plan: SchemaPlanOption = {
    id: state.selectedPlan.id,
    title: state.selectedPlan.name,
    description: state.selectedPlan.description,
    style: state.selectedPlan.pace,
    pace: state.selectedPlan.pace,
    highlights: state.selectedPlan.highlights,
    estimatedCost: state.selectedPlan.estimatedCost
      ? `${state.selectedPlan.estimatedCost.currency}${state.selectedPlan.estimatedCost.min}-${state.selectedPlan.estimatedCost.max}`
      : "Unknown",
    targetAudience: state.selectedPlan.includes || [],
  };

  // Convert timeline from main types to schema types
  const timeline: SchemaTimelineRow[] = state.timeline.map((row) => ({
    id: row.id,
    day: row.day,
    date: row.date,
    timeSlot: row.time,
    activity: row.activity,
    description: row.notes || row.activity,
    location: {
      name: row.location,
      address: row.location,
      coordinates: row.coordinates
        ? {
            lat: row.coordinates.lat,
            lng: row.coordinates.lng,
          }
        : undefined,
    },
    category: row.category === "free" ? "Activity" : row.category,
    estimatedCost: row.cost ? `${row.cost.currency}${row.cost.amount}` : undefined,
    estimatedDuration: row.duration,
    tips: row.notes ? [row.notes] : undefined,
    bookingRequired: row.verified,
    transportInfo:
      row.category === "transport"
        ? {
            method: row.activity,
            duration: row.duration,
            cost: row.cost ? `${row.cost.currency}${row.cost.amount}` : undefined,
          }
        : undefined,
  }));

  // Convert metadata
  const metadata: SchemaTripMetadata = {
    startDate: state.metadata.departureDate,
    endDate: state.metadata.returnDate,
    numberOfDays: calculateDays(state.metadata.departureDate, state.metadata.returnDate),
    budget: state.metadata.budget ? `$${state.metadata.budget}` : undefined,
    travelStyle: state.metadata.preferences[0],
    interests: state.metadata.preferences,
    travelers: {
      adults: state.metadata.travelers,
    },
    specialRequirements: [],
  };

  // Calculate summary from timeline
  const uniqueDays = new Set(timeline.map((t) => t.day)).size;
  const summary = {
    totalDays: uniqueDays,
    totalActivities: timeline.length,
    estimatedTotalCost: state.metadata.budget ? `$${state.metadata.budget}` : undefined,
    keyHighlights: state.selectedPlan.highlights,
  };

  return {
    destination,
    plan,
    timeline,
    summary,
    metadata,
  };
}

/**
 * Helper function to calculate number of days between two dates
 */
function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end days
}

/**
 * Update the main TripState with refined timeline from engine
 */
export function updateStateWithRefinedTimeline(
  state: TripState,
  refinedTimeline: SchemaTimelineRow[]
): TripState {
  // Convert schema timeline back to main types timeline
  const updatedTimeline = refinedTimeline.map((row) => ({
    id: row.id,
    day: row.day,
    date: row.date,
    time: row.timeSlot,
    activity: row.activity,
    location: row.location.name,
    coordinates: row.location.coordinates
      ? {
          lat: row.location.coordinates.lat || 0,
          lng: row.location.coordinates.lng || 0,
        }
      : undefined,
    duration: row.estimatedDuration || "",
    category: (row.category.toLowerCase() as "transport" | "activity" | "food" | "accommodation" | "free") || "activity",
    notes: row.description,
    cost: row.estimatedCost
      ? {
          amount: parseFloat(row.estimatedCost.replace(/[^0-9.]/g, "")),
          currency: "USD",
        }
      : undefined,
    verified: row.bookingRequired || false,
    bookingUrl: undefined,
    flightInfo: undefined,
    hotelInfo: undefined,
  }));

  return {
    ...state,
    timeline: updatedTimeline,
  };
}
