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
            userInput,
            metadata,
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
        const response = await fetch("/api/trip/select-destination", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destination,
            metadata: tripState.metadata,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to select destination: ${response.statusText}`);
        }

        const data = await response.json();

        setTripState((prev) => ({
          ...prev,
          stage: "choose_plan",
          selectedDestination: destination,
          planOptions: data.plans,
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

  const selectPlan = useCallback(
    async (plan: PlanOption) => {
      if (!tripState.selectedDestination) {
        setError("No destination selected");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/trip/select-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destination: tripState.selectedDestination,
            plan,
            metadata: tripState.metadata,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to select plan: ${response.statusText}`);
        }

        const data = await response.json();

        setTripState((prev) => ({
          ...prev,
          stage: "itinerary_ready",
          selectedPlan: plan,
          timeline: data.timeline,
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
              content: data.initialMessage || "Great choice! Here's your personalized itinerary. You can chat with me to refine it.",
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
