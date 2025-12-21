/**
 * Example Usage of Trip Planner Engine
 *
 * This file demonstrates how to use the TripPlannerEngine for building
 * a complete trip planning workflow.
 */

import { createTripPlannerEngine, type TripMetadata } from "./index";

/**
 * Example 1: Complete trip planning flow
 */
export async function exampleCompleteTripPlanning() {
  // Initialize engine (use your own API key)
  const engine = createTripPlannerEngine();

  // Define trip metadata
  const metadata: TripMetadata = {
    startDate: "2024-07-15",
    endDate: "2024-07-25",
    numberOfDays: 10,
    budget: "$2000-3000",
    travelStyle: "Balanced",
    interests: ["beaches", "culture", "food", "nature"],
    travelers: {
      adults: 2,
    },
    specialRequirements: ["vegetarian-friendly restaurants"],
  };

  console.log("Step 1: Generating destination options...");
  const destinations = await engine.generateDestinations(
    "I want a relaxing beach vacation in Southeast Asia with cultural experiences",
    metadata
  );

  console.log(`Generated ${destinations.length} destinations:`);
  destinations.forEach((dest, index) => {
    console.log(`\n${index + 1}. ${dest.name}, ${dest.country}`);
    console.log(`   ${dest.description}`);
    console.log(`   Best for: ${dest.bestFor.join(", ")}`);
    console.log(`   Budget: ${dest.estimatedBudget}`);
  });

  // User selects a destination (e.g., first one)
  const selectedDestination = destinations[0];

  console.log("\n\nStep 2: Generating plan options...");
  const plans = await engine.generatePlanOptions(selectedDestination, metadata);

  console.log(`\nGenerated ${plans.length} plan options:`);
  plans.forEach((plan) => {
    console.log(`\nPlan ${plan.id}: ${plan.title}`);
    console.log(`Style: ${plan.style}, Pace: ${plan.pace}`);
    console.log(`Description: ${plan.description}`);
    console.log(`Highlights: ${plan.highlights.join(", ")}`);
    console.log(`Estimated Cost: ${plan.estimatedCost}`);
  });

  // User selects a plan (e.g., Plan B - Balanced)
  const selectedPlan = plans[1];

  console.log("\n\nStep 3: Generating detailed timeline...");
  const { timeline, summary } = await engine.generateTimeline(
    selectedDestination,
    selectedPlan,
    metadata
  );

  console.log(`\nGenerated timeline with ${timeline.length} activities:`);
  console.log(`Total Days: ${summary.totalDays}`);
  console.log(`Total Activities: ${summary.totalActivities}`);
  if (summary.estimatedTotalCost) {
    console.log(`Estimated Total Cost: ${summary.estimatedTotalCost}`);
  }

  // Group timeline by day
  const dayGroups = timeline.reduce((acc, row) => {
    if (!acc[row.day]) acc[row.day] = [];
    acc[row.day].push(row);
    return acc;
  }, {} as Record<number, typeof timeline>);

  Object.entries(dayGroups).forEach(([day, activities]) => {
    console.log(`\n--- Day ${day} (${activities[0].date}) ---`);
    activities.forEach((activity) => {
      console.log(
        `${activity.timeSlot}: ${activity.activity} at ${activity.location.name} (${activity.category})`
      );
      if (activity.estimatedCost) {
        console.log(`  Cost: ${activity.estimatedCost}`);
      }
    });
  });

  console.log("\n\nStep 4: Refining timeline with user input...");
  const refinement = await engine.refineTimeline(
    {
      destination: selectedDestination,
      plan: selectedPlan,
      timeline,
      summary,
      metadata,
    },
    "Can we add a cooking class on day 3 in the afternoon?"
  );

  console.log(`\nAI Response: ${refinement.response}`);

  if (refinement.changesSummary) {
    console.log(`Changes: ${refinement.changesSummary}`);
  }

  if (refinement.suggestedActions) {
    console.log("\nSuggested follow-up actions:");
    refinement.suggestedActions.forEach((action, i) => {
      console.log(`${i + 1}. ${action}`);
    });
  }

  if (refinement.updatedTimeline) {
    console.log(`\nUpdated timeline has ${refinement.updatedTimeline.length} activities`);
  }

  return {
    destination: selectedDestination,
    plan: selectedPlan,
    timeline: refinement.updatedTimeline || timeline,
    summary,
  };
}

/**
 * Example 2: Quick destination generation only
 */
export async function exampleQuickDestinations() {
  const engine = createTripPlannerEngine();

  const destinations = await engine.generateDestinations(
    "Weekend getaway for photography enthusiasts",
    {
      numberOfDays: 3,
      budget: "$500-800",
      interests: ["photography", "nature", "architecture"],
      travelers: { adults: 1 },
    }
  );

  return destinations;
}

/**
 * Example 3: API key validation
 */
export async function exampleValidateApiKey() {
  try {
    const engine = createTripPlannerEngine();
    const isValid = await engine.validateApiKey();

    if (isValid) {
      console.log("✅ API key is valid and working");
      const info = engine.getModelInfo();
      console.log(`Using model: ${info.model} from ${info.provider}`);
    } else {
      console.log("❌ API key validation failed");
    }

    return isValid;
  } catch (error) {
    console.error("Error validating API key:", error);
    return false;
  }
}

/**
 * Example 4: Error handling
 */
export async function exampleErrorHandling() {
  try {
    const engine = createTripPlannerEngine();

    const destinations = await engine.generateDestinations(
      "Beach vacation",
      { numberOfDays: 7 }
    );

    return { success: true, destinations };
  } catch (error) {
    console.error("Error occurred:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Example 5: React Hook pattern
 */
export function useTripPlanner() {
  // This would be used in a React component
  return {
    async generateDestinations(userInput: string, metadata: TripMetadata) {
      const engine = createTripPlannerEngine();
      return engine.generateDestinations(userInput, metadata);
    },

    async generatePlans(destination: any, metadata: TripMetadata) {
      const engine = createTripPlannerEngine();
      return engine.generatePlanOptions(destination, metadata);
    },

    async generateTimeline(destination: any, plan: any, metadata: TripMetadata) {
      const engine = createTripPlannerEngine();
      return engine.generateTimeline(destination, plan, metadata);
    },

    async refineTimeline(state: any, message: string) {
      const engine = createTripPlannerEngine();
      return engine.refineTimeline(state, message);
    },
  };
}

/**
 * Run example if executed directly
 */
if (require.main === module) {
  console.log("🚀 Running Trip Planner Engine Examples\n");
  console.log("=" .repeat(60));

  exampleValidateApiKey()
    .then(() => {
      console.log("\n" + "=".repeat(60));
      console.log("\n📍 Example 1: Complete Trip Planning Flow\n");
      return exampleCompleteTripPlanning();
    })
    .then((result) => {
      console.log("\n✅ Trip planning completed successfully!");
      console.log(`Final destination: ${result.destination.name}`);
      console.log(`Total activities: ${result.timeline.length}`);
    })
    .catch((error) => {
      console.error("\n❌ Error:", error);
      process.exit(1);
    });
}
