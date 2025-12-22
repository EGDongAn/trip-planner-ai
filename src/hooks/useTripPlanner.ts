"use client";

import { useState, useCallback } from "react";
import type {
  TripState,
  DestinationOption,
  PlanOption,
  TripMetadata,
  TimelineRow,
} from "@/types/trip";
import type { ChatMessage } from "@/types/chat";

const initialState: TripState = {
  stage: "initial",
  userInput: "",
  destinationOptions: [],
  selectedDestination: null,
  planOptions: [],
  selectedPlan: null,
  timeline: [],
  conversation: [],
  metadata: {
    travelers: 2,
    departureDate: "",
    returnDate: "",
    departureCity: "",
    preferences: [],
  },
};

export function useTripPlanner() {
  const [tripState, setTripState] = useState<TripState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDestinations = useCallback(
    async (userInput: string, metadata: TripMetadata) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/trip/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "destinations",
            userInput,
            metadata: {
              ...metadata,
              startDate: metadata.departureDate,
              endDate: metadata.returnDate,
              numberOfDays: metadata.departureDate && metadata.returnDate
                ? Math.ceil((new Date(metadata.returnDate).getTime() - new Date(metadata.departureDate).getTime()) / (1000 * 60 * 60 * 24))
                : undefined,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate destinations: ${response.statusText}`);
        }

        const data = await response.json();

        setTripState((prev) => ({
          ...prev,
          stage: "choose_destination",
          userInput,
          metadata,
          destinationOptions: data.destinations,
          conversation: [
            ...prev.conversation,
            {
              id: crypto.randomUUID(),
              role: "user",
              content: userInput,
              timestamp: new Date(),
              metadata: {
                stage: "initial",
                action: undefined,
              },
            },
          ],
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to generate destinations";
        setError(errorMessage);
        console.error("Error generating destinations:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const selectDestination = useCallback(
    async (destination: DestinationOption) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/trip/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "plans",
            destination,
            metadata: {
              ...tripState.metadata,
              startDate: tripState.metadata.departureDate,
              endDate: tripState.metadata.returnDate,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to select destination: ${response.statusText}`);
        }

        const data = await response.json();

        // Transform plans from API schema to frontend type
        const transformedPlans: PlanOption[] = data.plans.map((plan: {
          id: string;
          title: string;
          description: string;
          style: string;
          pace: string;
          highlights: string[];
          estimatedCost: string;
          targetAudience: string[];
        }, index: number) => ({
          id: plan.id,
          label: (['A', 'B', 'C'] as const)[index] || 'A',
          name: plan.title,
          description: plan.description,
          pace: mapPace(plan.pace),
          highlights: plan.highlights,
          totalDays: tripState.metadata.departureDate && tripState.metadata.returnDate
            ? Math.ceil((new Date(tripState.metadata.returnDate).getTime() - new Date(tripState.metadata.departureDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
            : 5,
          estimatedCost: parsePlanCost(plan.estimatedCost),
          includes: plan.targetAudience,
        }));

        setTripState((prev) => ({
          ...prev,
          stage: "choose_plan",
          selectedDestination: destination,
          planOptions: transformedPlans,
          conversation: [
            ...prev.conversation,
            {
              id: crypto.randomUUID(),
              role: "user",
              content: `I'd like to visit ${destination.name}, ${destination.country}`,
              timestamp: new Date(),
              metadata: {
                stage: "choose_destination",
                action: "select_destination",
                data: destination,
              },
            } as ChatMessage,
          ],
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to select destination";
        setError(errorMessage);
        console.error("Error selecting destination:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [tripState.metadata]
  );

  // Helper function to map pace string to typed pace
  function mapPace(pace: string): "relaxed" | "moderate" | "intense" {
    const lower = pace.toLowerCase();
    if (lower.includes('relax') || lower.includes('slow')) return 'relaxed';
    if (lower.includes('intense') || lower.includes('fast') || lower.includes('adventure')) return 'intense';
    return 'moderate';
  }

  // Helper function to parse plan cost string
  function parsePlanCost(costStr: string): { min: number; max: number; currency: string } {
    // Try to extract numbers from cost string like "$1500-2000" or "$$"
    const rangeMatch = costStr.match(/([^\d]*)([\d,]+)\s*[-–]\s*([\d,]+)/);
    if (rangeMatch) {
      const currency = rangeMatch[1].trim() || 'USD';
      const min = parseFloat(rangeMatch[2].replace(/,/g, ''));
      const max = parseFloat(rangeMatch[3].replace(/,/g, ''));
      return { min, max, currency };
    }

    // Single number
    const singleMatch = costStr.match(/([^\d]*)([\d,]+)/);
    if (singleMatch) {
      const currency = singleMatch[1].trim() || 'USD';
      const amount = parseFloat(singleMatch[2].replace(/,/g, ''));
      return { min: amount * 0.8, max: amount * 1.2, currency };
    }

    // Budget indicators like "$", "$$", "$$$"
    const dollarCount = (costStr.match(/\$/g) || []).length;
    if (dollarCount > 0) {
      const baseAmount = dollarCount * 500;
      return { min: baseAmount, max: baseAmount * 1.5, currency: 'USD' };
    }

    return { min: 1000, max: 2000, currency: 'USD' };
  }

  const selectPlan = useCallback(
    async (plan: PlanOption) => {
      if (!tripState.selectedDestination) {
        setError("No destination selected");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/trip/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "timeline",
            destination: tripState.selectedDestination,
            plan,
            metadata: {
              ...tripState.metadata,
              startDate: tripState.metadata.departureDate,
              endDate: tripState.metadata.returnDate,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to select plan: ${response.statusText}`);
        }

        const data = await response.json();

        // Transform timeline data from API to match our types
        const transformedTimeline: TimelineRow[] = data.timeline.timeline.map((row: {
          id: string;
          day: number;
          date: string;
          timeSlot: string;
          activity: string;
          location: { name: string; coordinates?: { lat?: number; lng?: number } };
          category: string;
          estimatedDuration?: string;
          description?: string;
          estimatedCost?: string;
          bookingRequired?: boolean;
        }) => ({
          id: row.id,
          day: row.day,
          date: row.date,
          time: row.timeSlot,
          activity: row.activity,
          location: row.location.name,
          coordinates: row.location.coordinates ? {
            lat: row.location.coordinates.lat || 0,
            lng: row.location.coordinates.lng || 0,
          } : undefined,
          duration: row.estimatedDuration || '',
          category: mapCategory(row.category),
          notes: row.description,
          cost: row.estimatedCost ? parseCost(row.estimatedCost) : undefined,
          verified: row.bookingRequired || false,
        }));

        setTripState((prev) => ({
          ...prev,
          stage: "itinerary_ready",
          selectedPlan: plan,
          timeline: transformedTimeline,
          conversation: [
            ...prev.conversation,
            {
              id: crypto.randomUUID(),
              role: "user",
              content: `I'd like to go with Plan ${plan.label}: ${plan.name}`,
              timestamp: new Date(),
              metadata: {
                stage: "choose_plan",
                action: "select_plan",
                data: plan,
              },
            } as ChatMessage,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: "Great choice! Here's your personalized itinerary. You can chat with me to refine it.",
              timestamp: new Date(),
              metadata: {
                stage: "itinerary_ready",
              },
            } as ChatMessage,
          ],
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to select plan";
        setError(errorMessage);
        console.error("Error selecting plan:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [tripState.selectedDestination, tripState.metadata]
  );

  // Helper function to map API category to our category type
  function mapCategory(category: string): "transport" | "activity" | "food" | "accommodation" | "free" {
    const lower = category.toLowerCase();
    if (lower.includes('transport') || lower.includes('travel') || lower.includes('flight')) return 'transport';
    if (lower.includes('food') || lower.includes('dining') || lower.includes('restaurant') || lower.includes('meal')) return 'food';
    if (lower.includes('accommodation') || lower.includes('hotel') || lower.includes('lodging')) return 'accommodation';
    if (lower.includes('free') || lower.includes('leisure')) return 'free';
    return 'activity';
  }

  // Helper function to parse cost string
  function parseCost(costStr: string): { amount: number; currency: string } | undefined {
    if (!costStr || costStr.toLowerCase() === 'free') return undefined;
    const match = costStr.match(/([^\d]*)([\d,.]+)/);
    if (match) {
      const currency = match[1].trim() || 'USD';
      const amount = parseFloat(match[2].replace(/,/g, ''));
      if (!isNaN(amount)) {
        return { amount, currency };
      }
    }
    return undefined;
  }

  const refineTimeline = useCallback(
    async (message: string) => {
      if (!tripState.selectedDestination || !tripState.selectedPlan) {
        setError("No destination or plan selected");
        return;
      }

      setIsLoading(true);
      setError(null);

      // Optimistically add user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
        timestamp: new Date(),
        metadata: {
          stage: "itinerary_ready",
          action: "modify_timeline",
        },
      };

      setTripState((prev) => ({
        ...prev,
        conversation: [...prev.conversation, userMessage],
      }));

      try {
        const response = await fetch("/api/trip/refine", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            currentTimeline: tripState.timeline,
            destination: tripState.selectedDestination,
            plan: tripState.selectedPlan,
            metadata: tripState.metadata,
            conversationHistory: tripState.conversation,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to refine timeline: ${response.statusText}`);
        }

        const data = await response.json();

        setTripState((prev) => ({
          ...prev,
          timeline: data.timeline,
          conversation: [
            ...prev.conversation,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: data.response,
              timestamp: new Date(),
              metadata: {
                stage: "itinerary_ready",
              },
            } as ChatMessage,
          ],
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to refine timeline";
        setError(errorMessage);
        console.error("Error refining timeline:", err);

        // Remove the optimistic user message on error
        setTripState((prev) => ({
          ...prev,
          conversation: prev.conversation.filter((msg) => msg.id !== userMessage.id),
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [
      tripState.selectedDestination,
      tripState.selectedPlan,
      tripState.timeline,
      tripState.metadata,
      tripState.conversation,
    ]
  );

  const resetTrip = useCallback(() => {
    setTripState(initialState);
    setError(null);
  }, []);

  const updateMetadata = useCallback((metadata: Partial<TripMetadata>) => {
    setTripState((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        ...metadata,
      },
    }));
  }, []);

  return {
    tripState,
    isLoading,
    error,
    generateDestinations,
    selectDestination,
    selectPlan,
    refineTimeline,
    resetTrip,
    updateMetadata,
  };
}
