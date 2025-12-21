"use client";

import { useTripPlanner } from "@/hooks/useTripPlanner";
import {
  TripInputForm,
  DestinationSelector,
  PlanSelector,
  TimelineDisplay,
  ChatContainer,
  type TripFormData,
  type Destination,
  type TripPlan,
  type DaySchedule,
} from "@/components";
import type { DestinationOption, PlanOption, TimelineRow as TimelineRowType } from "@/types/trip";

export default function PlanPage() {
  const {
    tripState,
    isLoading,
    error,
    generateDestinations,
    selectDestination,
    selectPlan,
    refineTimeline,
    resetTrip,
    updateMetadata,
  } = useTripPlanner();

  // Transform data to match component interfaces
  const transformDestinations = (destinations: DestinationOption[]): Destination[] => {
    return destinations.map((dest) => ({
      id: dest.id,
      name: dest.name,
      country: dest.country,
      highlights: dest.highlights,
      estimatedCost: dest.estimatedBudget,
      weather: {
        temperature: dest.weatherNote || 'N/A',
        condition: 'N/A',
      },
      matchScore: dest.matchScore,
    }));
  };

  const transformPlans = (plans: PlanOption[]): TripPlan[] => {
    return plans.map((plan) => ({
      id: plan.id,
      label: plan.label,
      name: plan.name,
      description: plan.description,
      pace: plan.pace === 'intense' ? 'active' : plan.pace as 'relaxed' | 'moderate' | 'active',
      highlights: plan.highlights,
      estimatedCost: {
        total: (plan.estimatedCost.min + plan.estimatedCost.max) / 2,
        currency: plan.estimatedCost.currency,
      },
    }));
  };

  const transformTimeline = (timeline: TimelineRowType[]): DaySchedule[] => {
    const grouped = timeline.reduce((acc, row) => {
      const key = row.day;
      if (!acc[key]) {
        acc[key] = {
          date: row.date,
          dayNumber: row.day,
          items: [],
        };
      }

      // Map category to match component expectations
      let category: 'transport' | 'food' | 'activity' | 'accommodation' | 'shopping' | 'entertainment' = 'activity';
      if (row.category === 'free') {
        category = 'activity';
      } else if (['transport', 'food', 'accommodation'].includes(row.category)) {
        category = row.category as 'transport' | 'food' | 'accommodation';
      }

      acc[key].items.push({
        id: row.id,
        time: row.time,
        activity: row.activity,
        location: row.location,
        category,
        cost: row.cost,
        verified: row.verified,
      });
      return acc;
    }, {} as Record<number, DaySchedule>);

    return Object.values(grouped).sort((a, b) => a.dayNumber - b.dayNumber);
  };

  const handleTripInputSubmit = (data: TripFormData) => {
    const metadata = {
      travelers: data.travelers || 2,
      departureDate: data.startDate || '',
      returnDate: data.endDate || '',
      departureCity: data.origin || '',
      preferences: [],
    };
    generateDestinations(data.query, metadata);
  };

  const handleDestinationSelect = (destination: Destination) => {
    const originalDest = tripState.destinationOptions.find((d) => d.id === destination.id);
    if (originalDest) {
      selectDestination(originalDest);
    }
  };

  const handlePlanSelect = (plan: TripPlan) => {
    const originalPlan = tripState.planOptions.find((p) => p.id === plan.id);
    if (originalPlan) {
      selectPlan(originalPlan);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg dark:bg-red-950 dark:border-red-800 dark:text-red-200">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Stage-based Rendering */}
      {tripState.stage === "initial" && (
        <TripInputForm
          onSubmit={handleTripInputSubmit}
          isLoading={isLoading}
        />
      )}

      {tripState.stage === "choose_destination" && (
        <DestinationSelector
          destinations={transformDestinations(tripState.destinationOptions)}
          onSelect={handleDestinationSelect}
        />
      )}

      {tripState.stage === "choose_plan" && tripState.selectedDestination && (
        <PlanSelector
          plans={transformPlans(tripState.planOptions)}
          onSelect={handlePlanSelect}
        />
      )}

      {tripState.stage === "itinerary_ready" &&
        tripState.selectedDestination &&
        tripState.selectedPlan && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timeline Display */}
            <div className="lg:col-span-1">
              <TimelineDisplay
                schedule={transformTimeline(tripState.timeline)}
                totalCost={{
                  amount: tripState.selectedPlan.estimatedCost.min,
                  currency: tripState.selectedPlan.estimatedCost.currency,
                }}
              />
            </div>

            {/* Chat Container */}
            <div className="lg:col-span-1">
              <ChatContainer
                messages={tripState.conversation}
                onSendMessage={refineTimeline}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-zinc-900 dark:text-zinc-50 font-medium">
                {tripState.stage === "initial" && "Generating destination options..."}
                {tripState.stage === "choose_destination" && "Creating travel plans..."}
                {tripState.stage === "choose_plan" && "Building your itinerary..."}
                {tripState.stage === "itinerary_ready" && "Refining your trip..."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
