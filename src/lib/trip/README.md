# Trip Planner Engine

A comprehensive trip planning solution powered by Google Gemini 2.0 Flash with Structured Outputs.

## Overview

This library provides a type-safe, AI-powered trip planning engine with four main capabilities:

1. **Destination Generation**: Generate 5 diverse destination options based on user input
2. **Plan Options**: Create A/B/C trip plans with different styles and pacing
3. **Timeline Generation**: Build detailed day-by-day itineraries with logistics
4. **Conversational Refinement**: Allow users to modify and improve their plans through natural language

## Installation

The library uses the following dependencies (already in package.json):
- `@google/generative-ai`: ^0.24.1

## Quick Start

```typescript
import { createTripPlannerEngine } from "@/lib/trip";

// Create engine instance
const engine = createTripPlannerEngine(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Or use the singleton
import { getTripPlannerEngine } from "@/lib/trip";
const engine = getTripPlannerEngine();
```

## API Reference

### `generateDestinations(userInput, metadata)`

Generate 5 destination options based on user preferences.

```typescript
const destinations = await engine.generateDestinations(
  "I want a relaxing beach vacation in Asia",
  {
    startDate: "2024-07-15",
    endDate: "2024-07-25",
    numberOfDays: 10,
    budget: "$2000-3000",
    travelStyle: "Relaxed",
    interests: ["beaches", "culture", "food"],
    travelers: { adults: 2 },
  }
);

// Returns array of 5 DestinationOption objects
```

### `generatePlanOptions(destination, metadata)`

Create A/B/C plan variations for a destination.

```typescript
const plans = await engine.generatePlanOptions(destinations[0], {
  numberOfDays: 10,
  budget: "$2000-3000",
  travelStyle: "Balanced",
  interests: ["beaches", "culture"],
  travelers: { adults: 2 },
});

// Returns array of 3 PlanOption objects (A, B, C)
```

### `generateTimeline(destination, plan, metadata)`

Generate detailed day-by-day timeline.

```typescript
const { timeline, summary } = await engine.generateTimeline(
  destinations[0],
  plans[1], // Plan B
  {
    startDate: "2024-07-15",
    numberOfDays: 10,
    budget: "$2000-3000",
    interests: ["beaches", "culture", "food"],
    travelers: { adults: 2 },
  }
);

// Returns:
// - timeline: Array of TimelineRow objects
// - summary: TimelineSummary object
```

### `refineTimeline(currentState, userMessage)`

Conversational refinement of the timeline.

```typescript
const currentState = {
  destination: destinations[0],
  plan: plans[1],
  timeline: timeline,
  summary: summary,
  metadata: { /* ... */ },
};

const refinement = await engine.refineTimeline(
  currentState,
  "Can we add a cooking class on day 3?"
);

// Returns RefinementResponse:
// - response: Natural language explanation
// - updatedTimeline: Modified timeline (or undefined if no changes)
// - suggestedActions: Follow-up suggestions
// - changesSummary: Summary of what changed
```

## Type Reference

### Core Types

```typescript
interface DestinationOption {
  id: string;
  name: string;
  country: string;
  description: string;
  bestFor: string[];
  estimatedBudget: string;
  imageUrl?: string;
  climate: string;
}

interface PlanOption {
  id: string; // "A", "B", or "C"
  title: string;
  description: string;
  style: string;
  pace: string;
  highlights: string[];
  estimatedCost: string;
  targetAudience: string[];
}

interface TimelineRow {
  id: string;
  day: number;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  activity: string;
  description: string;
  location: TimelineLocation;
  category: string;
  estimatedCost?: string;
  estimatedDuration?: string;
  tips?: string[];
  bookingRequired?: boolean;
  transportInfo?: TransportInfo;
}

interface TripMetadata {
  startDate?: string;
  endDate?: string;
  numberOfDays?: number;
  budget?: string;
  travelStyle?: string;
  interests?: string[];
  travelers?: {
    adults: number;
    children?: number;
    seniors?: number;
  };
  specialRequirements?: string[];
}
```

## Usage Patterns

### Complete Trip Planning Flow

```typescript
import { createTripPlannerEngine } from "@/lib/trip";

async function planTrip() {
  const engine = createTripPlannerEngine();

  // Step 1: Get destinations
  const destinations = await engine.generateDestinations(
    "Summer vacation in Europe",
    {
      numberOfDays: 14,
      budget: "$3000-5000",
      interests: ["culture", "history", "food"],
      travelers: { adults: 2 },
    }
  );

  // User selects destination
  const selectedDestination = destinations[0];

  // Step 2: Get plan options
  const plans = await engine.generatePlanOptions(selectedDestination, {
    numberOfDays: 14,
    budget: "$3000-5000",
    interests: ["culture", "history", "food"],
  });

  // User selects plan
  const selectedPlan = plans[1]; // Plan B

  // Step 3: Generate timeline
  const { timeline, summary } = await engine.generateTimeline(
    selectedDestination,
    selectedPlan,
    {
      startDate: "2024-06-15",
      numberOfDays: 14,
      budget: "$3000-5000",
      interests: ["culture", "history", "food"],
      travelers: { adults: 2 },
    }
  );

  // Step 4: Refine as needed
  const refinement = await engine.refineTimeline(
    {
      destination: selectedDestination,
      plan: selectedPlan,
      timeline,
      summary,
      metadata: { numberOfDays: 14 },
    },
    "Can we add more food experiences?"
  );

  if (refinement.updatedTimeline) {
    // Use updated timeline
    return refinement.updatedTimeline;
  }

  return timeline;
}
```

### React Component Example

```typescript
"use client";

import { useState } from "react";
import { createTripPlannerEngine, type DestinationOption } from "@/lib/trip";

export function TripPlanner() {
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateDestinations = async (userInput: string) => {
    setLoading(true);
    try {
      const engine = createTripPlannerEngine();
      const results = await engine.generateDestinations(userInput, {
        numberOfDays: 7,
        budget: "$1500-2500",
      });
      setDestinations(results);
    } catch (error) {
      console.error("Failed to generate destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => handleGenerateDestinations("Beach vacation in Asia")}
        disabled={loading}
      >
        {loading ? "Generating..." : "Get Destinations"}
      </button>

      <div>
        {destinations.map((dest) => (
          <div key={dest.id}>
            <h3>{dest.name}, {dest.country}</h3>
            <p>{dest.description}</p>
            <p>Best for: {dest.bestFor.join(", ")}</p>
            <p>Budget: {dest.estimatedBudget}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Structured Outputs

All API calls use Gemini's Structured Outputs feature with JSON schemas to ensure:

- **Type Safety**: Responses match TypeScript interfaces exactly
- **Consistency**: Same structure every time
- **Validation**: Schema validation at the API level
- **No Parsing Errors**: Guaranteed valid JSON

## Error Handling

All methods include comprehensive error handling:

```typescript
try {
  const destinations = await engine.generateDestinations(input, metadata);
} catch (error) {
  console.error("Error:", error);
  // Handle error appropriately
}
```

Common errors:
- Missing or invalid API key
- Network issues
- Invalid input parameters
- API rate limits

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
# or
GEMINI_API_KEY=your_api_key_here
```

The `NEXT_PUBLIC_` prefix makes it available in client components.

## Performance Notes

- Destination generation: ~3-5 seconds
- Plan options: ~4-6 seconds
- Timeline generation: ~6-10 seconds (due to complexity)
- Refinement: ~3-5 seconds

Times may vary based on:
- Network latency
- API load
- Complexity of request
- Amount of metadata provided

## Best Practices

1. **Provide Rich Metadata**: More context = better results
2. **Handle Errors Gracefully**: Network issues can occur
3. **Show Loading States**: Operations take several seconds
4. **Cache Results**: Store generated plans to avoid re-generation
5. **Validate Dates**: Ensure date formats are correct (YYYY-MM-DD)
6. **Progressive Enhancement**: Generate destinations → plans → timeline
7. **User Feedback**: Show what the AI is doing during generation

## Advanced Customization

You can customize prompts by importing prompt builders:

```typescript
import { buildDestinationPrompt } from "@/lib/trip";

// Customize the prompt
const customPrompt = buildDestinationPrompt(userInput, metadata) +
  "\n\nAdditional requirement: Focus on eco-friendly destinations.";

// Use with custom model configuration
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: DESTINATION_SCHEMA,
    temperature: 0.9, // More creative
  },
});
```

## License

Part of the Trip Planner application.
