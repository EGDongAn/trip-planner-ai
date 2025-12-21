# Trip Planner - Quick Start Guide

## Setup (1 minute)

### 1. Add Your Gemini API Key

Create `.env.local` file:
```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key: https://aistudio.google.com/app/apikey

### 2. Verify Installation

All dependencies are already installed. The engine is ready to use!

## Basic Usage

### Import the Engine

```typescript
import { createTripPlannerEngine } from "@/lib/trip";

const engine = createTripPlannerEngine();
```

### Simple Example

```typescript
// Generate 5 destination options
const destinations = await engine.generateDestinations(
  "Summer beach vacation in Asia",
  {
    numberOfDays: 7,
    budget: "$1500-2500",
    interests: ["beaches", "food", "culture"],
    travelers: { adults: 2 }
  }
);

// destinations is now an array of 5 DestinationOption objects
console.log(destinations[0].name); // e.g., "Bali"
console.log(destinations[0].description);
console.log(destinations[0].bestFor); // ["beaches", "culture", "relaxation"]
```

## Complete Flow

### Client Component Example

```typescript
"use client";

import { useState } from "react";
import { createTripPlannerEngine } from "@/lib/trip";
import type { DestinationOption, PlanOption, TimelineRow } from "@/lib/trip";

export default function TripPlannerPage() {
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [selectedDest, setSelectedDest] = useState<DestinationOption | null>(null);
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [timeline, setTimeline] = useState<TimelineRow[]>([]);
  const [loading, setLoading] = useState(false);

  const engine = createTripPlannerEngine();

  // Step 1: Generate destinations
  const handleGenerateDestinations = async () => {
    setLoading(true);
    try {
      const results = await engine.generateDestinations(
        "Beach vacation in Southeast Asia",
        {
          numberOfDays: 10,
          budget: "$2000-3000",
          interests: ["beaches", "culture", "food"],
          travelers: { adults: 2 }
        }
      );
      setDestinations(results);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Step 2: Generate plans for selected destination
  const handleSelectDestination = async (dest: DestinationOption) => {
    setSelectedDest(dest);
    setLoading(true);
    try {
      const results = await engine.generatePlanOptions(dest, {
        numberOfDays: 10,
        budget: "$2000-3000",
        travelStyle: "Balanced"
      });
      setPlans(results);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Step 3: Generate timeline for selected plan
  const handleSelectPlan = async (plan: PlanOption) => {
    if (!selectedDest) return;
    setLoading(true);
    try {
      const { timeline } = await engine.generateTimeline(
        selectedDest,
        plan,
        {
          startDate: "2024-07-15",
          numberOfDays: 10,
          budget: "$2000-3000"
        }
      );
      setTimeline(timeline);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Trip Planner</h1>

      {/* Step 1: Destinations */}
      <button
        onClick={handleGenerateDestinations}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Generating..." : "Get Destinations"}
      </button>

      {destinations.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => handleSelectDestination(dest)}
              className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <h3 className="font-bold">{dest.name}, {dest.country}</h3>
              <p className="text-sm text-gray-600">{dest.description}</p>
              <p className="text-xs mt-2">Budget: {dest.estimatedBudget}</p>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Plans */}
      {plans.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handleSelectPlan(plan)}
                className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <h3 className="font-bold">Plan {plan.id}: {plan.title}</h3>
                <p className="text-sm">{plan.description}</p>
                <p className="text-xs mt-2">
                  {plan.style} • {plan.pace}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Timeline */}
      {timeline.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Itinerary</h2>
          {timeline.map((activity) => (
            <div key={activity.id} className="border-l-4 border-blue-500 pl-4 mb-4">
              <div className="font-bold">
                Day {activity.day} • {activity.timeSlot}
              </div>
              <h4 className="text-lg">{activity.activity}</h4>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <p className="text-xs text-gray-500">
                📍 {activity.location.name}
                {activity.estimatedCost && ` • 💰 ${activity.estimatedCost}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## API Route Example (Server-Side)

```typescript
// app/api/trip/destinations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createTripPlannerEngine } from "@/lib/trip";

export async function POST(request: NextRequest) {
  try {
    const { userInput, metadata } = await request.json();

    const engine = createTripPlannerEngine();
    const destinations = await engine.generateDestinations(userInput, metadata);

    return NextResponse.json({ destinations });
  } catch (error) {
    console.error("Error generating destinations:", error);
    return NextResponse.json(
      { error: "Failed to generate destinations" },
      { status: 500 }
    );
  }
}
```

## Testing

### 1. Test API Key

```typescript
import { createTripPlannerEngine } from "@/lib/trip";

const engine = createTripPlannerEngine();
const isValid = await engine.validateApiKey();

if (isValid) {
  console.log("✅ API key is working!");
} else {
  console.error("❌ API key is invalid");
}
```

### 2. Test Destination Generation

```typescript
const destinations = await engine.generateDestinations(
  "Weekend getaway",
  { numberOfDays: 3 }
);

console.log(`Generated ${destinations.length} destinations`);
console.log(destinations[0]);
```

## File Structure

```
src/lib/trip/
├── index.ts              # Import from here
├── TripPlannerEngine.ts  # Main engine class
├── schemas.ts            # Type definitions
├── prompts.ts            # Prompt templates
├── README.md             # Full documentation
└── example.ts            # More examples
```

## Common Patterns

### With Loading States

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const generate = async () => {
  setLoading(true);
  setError(null);
  try {
    const results = await engine.generateDestinations(...);
    // Handle results
  } catch (err) {
    setError(err instanceof Error ? err.message : "Unknown error");
  } finally {
    setLoading(false);
  }
};
```

### With Caching

```typescript
const [cache, setCache] = useState<{
  destinations?: DestinationOption[];
  plans?: PlanOption[];
}>({});

// Cache destinations
if (!cache.destinations) {
  const destinations = await engine.generateDestinations(...);
  setCache(prev => ({ ...prev, destinations }));
}
```

### With Local Storage

```typescript
// Save timeline
localStorage.setItem("trip-timeline", JSON.stringify(timeline));

// Load timeline
const saved = localStorage.getItem("trip-timeline");
if (saved) {
  setTimeline(JSON.parse(saved));
}
```

## Next Steps

1. ✅ API key set up
2. ⬜ Build UI components
3. ⬜ Add map integration
4. ⬜ Implement export features
5. ⬜ Add refinement chat

## Get Help

- **Full Documentation**: See `src/lib/trip/README.md`
- **Examples**: See `src/lib/trip/example.ts`
- **Types**: All types are in `src/lib/trip/schemas.ts`

## Performance Tips

- **Cache Results**: Store generated plans to avoid re-generation
- **Show Loading**: Operations take 3-10 seconds
- **Progressive Enhancement**: Generate destinations → plans → timeline
- **Optimize Metadata**: More context = better results but slightly slower

## Common Issues

### API Key Not Working
```bash
# Make sure it's in .env.local
echo $NEXT_PUBLIC_GEMINI_API_KEY

# Restart dev server after adding
npm run dev
```

### TypeScript Errors
```bash
# Verify types
npx tsc --noEmit
```

### Network Errors
```typescript
// Add retry logic
const retryGenerate = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await engine.generateDestinations(...);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
};
```

Ready to build! 🚀
