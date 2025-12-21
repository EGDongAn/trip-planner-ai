# Type Compatibility Guide

## Overview

There are two sets of type definitions in this project:

1. **UI State Types** (`src/types/trip.ts`) - For React state management
2. **Engine Types** (`src/lib/trip/schemas.ts`) - For Gemini API interactions

## Type Mapping

### DestinationOption

**UI Type** (`src/types/trip.ts`):
```typescript
interface DestinationOption {
  id: string;
  name: string;
  country: string;
  matchScore: number;
  highlights: string[];
  bestFor: string;
  estimatedBudget: { min: number; max: number; currency: string };
  weatherNote: string;
  imageUrl?: string;
}
```

**Engine Type** (`src/lib/trip/schemas.ts`):
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
```

**Conversion**:
```typescript
import type { DestinationOption as UIDestination } from "@/types/trip";
import type { DestinationOption as EngineDestination } from "@/lib/trip";

function engineToUI(engine: EngineDestination): UIDestination {
  return {
    id: engine.id,
    name: engine.name,
    country: engine.country,
    matchScore: 0.9, // Calculate based on relevance
    highlights: engine.bestFor.slice(0, 3),
    bestFor: engine.bestFor.join(", "),
    estimatedBudget: parseBudget(engine.estimatedBudget), // "$2000-3000" → {min: 2000, max: 3000}
    weatherNote: engine.climate,
    imageUrl: engine.imageUrl,
  };
}

function parseBudget(budget: string): { min: number; max: number; currency: string } {
  // Parse "$2000-3000" or "$$" format
  if (budget.startsWith("$") && budget.includes("-")) {
    const [min, max] = budget.replace(/\$/g, "").split("-").map(Number);
    return { min, max, currency: "USD" };
  }
  // Handle $, $$, $$$ format
  const dollarCount = budget.split("$").length - 1;
  return {
    min: dollarCount * 500,
    max: dollarCount * 1000,
    currency: "USD"
  };
}
```

### PlanOption

**UI Type**:
```typescript
interface PlanOption {
  id: string;
  label: "A" | "B" | "C";
  name: string;
  description: string;
  pace: "relaxed" | "moderate" | "intense";
  highlights: string[];
  totalDays: number;
  estimatedCost: { min: number; max: number; currency: string };
  includes: string[];
}
```

**Engine Type**:
```typescript
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
```

**Conversion**:
```typescript
function engineToUI(engine: EnginePlan, totalDays: number): UIPlan {
  return {
    id: engine.id,
    label: engine.id as "A" | "B" | "C",
    name: engine.title,
    description: engine.description,
    pace: mapPace(engine.pace),
    highlights: engine.highlights,
    totalDays,
    estimatedCost: parseBudget(engine.estimatedCost),
    includes: engine.highlights,
  };
}

function mapPace(pace: string): "relaxed" | "moderate" | "intense" {
  const lower = pace.toLowerCase();
  if (lower.includes("slow") || lower.includes("relaxed")) return "relaxed";
  if (lower.includes("fast") || lower.includes("intensive")) return "intense";
  return "moderate";
}
```

### TimelineRow

**UI Type**:
```typescript
interface TimelineRow {
  id: string;
  day: number;
  date: string;
  time: string;
  activity: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  duration: string;
  category: "transport" | "activity" | "food" | "accommodation" | "free";
  notes?: string;
  cost?: { amount: number; currency: string };
  verified: boolean;
  bookingUrl?: string;
  flightInfo?: FlightInfo;
  hotelInfo?: HotelInfo;
}
```

**Engine Type**:
```typescript
interface TimelineRow {
  id: string;
  day: number;
  date: string;
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
```

**Conversion**:
```typescript
function engineToUI(engine: EngineTimeline): UITimeline {
  return {
    id: engine.id,
    day: engine.day,
    date: engine.date,
    time: engine.timeSlot,
    activity: engine.activity,
    location: engine.location.name,
    coordinates: engine.location.coordinates,
    duration: engine.estimatedDuration || "Unknown",
    category: mapCategory(engine.category),
    notes: engine.description,
    cost: parseCost(engine.estimatedCost),
    verified: false,
    bookingUrl: undefined,
  };
}

function mapCategory(category: string): UICategory {
  const lower = category.toLowerCase();
  if (lower.includes("transport")) return "transport";
  if (lower.includes("food") || lower.includes("restaurant")) return "food";
  if (lower.includes("hotel") || lower.includes("accommodation")) return "accommodation";
  return "activity";
}

function parseCost(cost?: string): { amount: number; currency: string } | undefined {
  if (!cost) return undefined;
  const match = cost.match(/\$?(\d+)/);
  if (match) {
    return { amount: parseInt(match[1]), currency: "USD" };
  }
  return undefined;
}
```

### TripState

**UI Type**:
```typescript
interface TripState {
  stage: TripStage;
  userInput: string;
  destinationOptions: DestinationOption[];
  selectedDestination: DestinationOption | null;
  planOptions: PlanOption[];
  selectedPlan: PlanOption | null;
  timeline: TimelineRow[];
  conversation: ChatMessage[];
  metadata: TripMetadata;
}
```

**Engine Type**:
```typescript
interface TripState {
  destination: DestinationOption;
  plan: PlanOption;
  timeline: TimelineRow[];
  summary: TimelineSummary;
  metadata: TripMetadata;
}
```

**Usage**: These serve different purposes. UI TripState manages the entire app state, while Engine TripState is only for refinement calls.

## Recommended Approach

### Option 1: Convert at Boundaries (Recommended)

Keep both type systems and convert at API boundaries:

```typescript
// In your React component
import { createTripPlannerEngine } from "@/lib/trip";
import type { DestinationOption as UIDestination } from "@/types/trip";

const engine = createTripPlannerEngine();

const handleGenerate = async () => {
  // Get engine results
  const engineDestinations = await engine.generateDestinations(...);

  // Convert to UI format
  const uiDestinations: UIDestination[] = engineDestinations.map(engineToUI);

  // Use in React state
  setDestinations(uiDestinations);
};
```

### Option 2: Extend Engine Types

Add conversion utilities to the engine:

```typescript
// src/lib/trip/converters.ts
export function toUIDestination(engine: EngineDestination): UIDestination {
  // conversion logic
}

export function toUIPlan(engine: EnginePlan, totalDays: number): UIPlan {
  // conversion logic
}

export function toUITimeline(engine: EngineTimeline): UITimeline {
  // conversion logic
}
```

### Option 3: Unify Types (Future)

Eventually, consider unifying to a single type system. The Engine types are more flexible and comprehensive, so they could become the canonical types.

## TripMetadata Differences

**UI Type**:
```typescript
interface TripMetadata {
  travelers: number;
  departureDate: string;
  returnDate: string;
  departureCity: string;
  budget?: number;
  preferences: string[];
}
```

**Engine Type**:
```typescript
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

**Conversion**:
```typescript
function uiMetadataToEngine(ui: UIMetadata): EngineMetadata {
  return {
    startDate: ui.departureDate,
    endDate: ui.returnDate,
    numberOfDays: calculateDays(ui.departureDate, ui.returnDate),
    budget: ui.budget ? `$${ui.budget}` : undefined,
    interests: ui.preferences,
    travelers: { adults: ui.travelers },
  };
}
```

## Complete Example

```typescript
// src/lib/converters.ts
import type {
  DestinationOption as EngineDestination,
  PlanOption as EnginePlan,
  TimelineRow as EngineTimeline,
  TripMetadata as EngineMetadata
} from "@/lib/trip";

import type {
  DestinationOption as UIDestination,
  PlanOption as UIPlan,
  TimelineRow as UITimeline,
  TripMetadata as UIMetadata
} from "@/types/trip";

export class TripConverter {
  static toUIDestination(engine: EngineDestination): UIDestination {
    return {
      id: engine.id,
      name: engine.name,
      country: engine.country,
      matchScore: 0.9,
      highlights: engine.bestFor.slice(0, 3),
      bestFor: engine.bestFor.join(", "),
      estimatedBudget: this.parseBudget(engine.estimatedBudget),
      weatherNote: engine.climate,
      imageUrl: engine.imageUrl,
    };
  }

  static toUIPlan(engine: EnginePlan, totalDays: number): UIPlan {
    return {
      id: engine.id,
      label: engine.id as "A" | "B" | "C",
      name: engine.title,
      description: engine.description,
      pace: this.mapPace(engine.pace),
      highlights: engine.highlights,
      totalDays,
      estimatedCost: this.parseBudget(engine.estimatedCost),
      includes: engine.highlights,
    };
  }

  static toUITimeline(engine: EngineTimeline): UITimeline {
    return {
      id: engine.id,
      day: engine.day,
      date: engine.date,
      time: engine.timeSlot,
      activity: engine.activity,
      location: engine.location.name,
      coordinates: engine.location.coordinates,
      duration: engine.estimatedDuration || "Unknown",
      category: this.mapCategory(engine.category),
      notes: engine.description,
      cost: this.parseCost(engine.estimatedCost),
      verified: false,
    };
  }

  static toEngineMetadata(ui: UIMetadata): EngineMetadata {
    return {
      startDate: ui.departureDate,
      endDate: ui.returnDate,
      numberOfDays: this.calculateDays(ui.departureDate, ui.returnDate),
      budget: ui.budget ? `$${ui.budget}` : undefined,
      interests: ui.preferences,
      travelers: { adults: ui.travelers },
    };
  }

  private static parseBudget(budget: string) {
    // Implementation
  }

  private static mapPace(pace: string): "relaxed" | "moderate" | "intense" {
    // Implementation
  }

  private static mapCategory(category: string) {
    // Implementation
  }

  private static parseCost(cost?: string) {
    // Implementation
  }

  private static calculateDays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  }
}
```

## Usage in Components

```typescript
import { TripConverter } from "@/lib/converters";
import { createTripPlannerEngine } from "@/lib/trip";

export function TripPlanner() {
  const engine = createTripPlannerEngine();

  const handleGenerate = async (uiMetadata: UIMetadata) => {
    // Convert UI metadata to Engine format
    const engineMetadata = TripConverter.toEngineMetadata(uiMetadata);

    // Call engine
    const engineDestinations = await engine.generateDestinations(
      userInput,
      engineMetadata
    );

    // Convert back to UI format
    const uiDestinations = engineDestinations.map(
      TripConverter.toUIDestination
    );

    // Use in state
    setDestinations(uiDestinations);
  };
}
```

## Summary

- **Keep Both**: UI types for state management, Engine types for API
- **Convert at Boundaries**: Transform data when crossing UI/Engine boundary
- **Use Converters**: Create utility functions for consistent conversion
- **Future**: Consider unifying to Engine types (more flexible)

The Engine types are production-ready and don't need modification. Focus on building converters for UI integration.
