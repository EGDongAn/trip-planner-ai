# Trip Planner Type System

This document explains the type system used in the Trip Planner application and how types are converted between different layers.

## Type Definitions

### Main Application Types (`/src/types/trip.ts`)

The main application uses a **stage-based state machine** approach:

```typescript
interface TripState {
  stage: TripStage;              // Current stage in the planning workflow
  userInput: string;             // Initial user input
  destinationOptions: [];        // 5 destination options
  selectedDestination: null;     // User's chosen destination
  planOptions: [];               // 3 plan options (A/B/C)
  selectedPlan: null;            // User's chosen plan
  timeline: TimelineRow[];       // Day-by-day itinerary
  conversation: ChatMessage[];   // Chat history
  metadata: TripMetadata;        // Trip parameters
}
```

**Purpose**: Manages the entire user journey from initial input to final itinerary.

### Engine Types (`/src/lib/trip/schemas.ts`)

The TripPlannerEngine uses a **focused state** for AI operations:

```typescript
interface TripEngineState {
  destination: DestinationOption;  // Single chosen destination
  plan: PlanOption;                // Single chosen plan
  timeline: TimelineRow[];         // Current timeline
  summary: TimelineSummary;        // Trip summary stats
  metadata: TripMetadata;          // Trip parameters
}
```

**Purpose**: Provides the minimal necessary context for Gemini AI to refine the timeline.

## Why Two Type Systems?

1. **Separation of Concerns**
   - Main app manages workflow state
   - Engine focuses on AI operations

2. **Different Schemas**
   - Main types match UI/UX needs
   - Engine types match Gemini structured output schemas

3. **Type Safety**
   - Prevents accidental misuse of types
   - Clear boundaries between layers

## Type Conversion

### Converting to Engine State

Use `toEngineState()` when calling TripPlannerEngine methods:

```typescript
import { toEngineState } from "@/lib/trip/converters";

const engineState = toEngineState(appState);
if (engineState) {
  const result = await engine.refineTimeline(engineState, message);
}
```

**Requirements**: The app state must have:
- A selected destination (`selectedDestination !== null`)
- A selected plan (`selectedPlan !== null`)
- A non-empty timeline (`timeline.length > 0`)

### Converting Back to App State

Use `updateStateWithRefinedTimeline()` to update app state with AI results:

```typescript
import { updateStateWithRefinedTimeline } from "@/lib/trip/converters";

if (result.updatedTimeline) {
  const updatedState = updateStateWithRefinedTimeline(appState, result.updatedTimeline);
}
```

## API Route Usage

The `/api/trip/refine` route demonstrates proper conversion:

```typescript
// 1. Receive app state from frontend
const { currentState } = body as { currentState: TripState };

// 2. Convert to engine state
const engineState = toEngineState(currentState);

// 3. Call engine
const result = await engine.refineTimeline(engineState, message);

// 4. Convert results back
let updatedState = currentState;
if (result.updatedTimeline) {
  updatedState = updateStateWithRefinedTimeline(currentState, result.updatedTimeline);
}

// 5. Return updated state to frontend
return NextResponse.json({ updatedState });
```

## Field Mapping

### DestinationOption

| Main Type | Engine Type | Conversion |
|-----------|-------------|------------|
| `highlights: string[]` | `description: string` | Join array |
| `bestFor: string` | `bestFor: string[]` | Wrap in array |
| `estimatedBudget: {min, max, currency}` | `estimatedBudget: string` | Format as range |
| `weatherNote: string` | `climate: string` | Direct map |

### PlanOption

| Main Type | Engine Type | Conversion |
|-----------|-------------|------------|
| `name: string` | `title: string` | Direct map |
| `estimatedCost: {min, max, currency}` | `estimatedCost: string` | Format as range |
| `includes: string[]` | `targetAudience: string[]` | Direct map |

### TimelineRow

| Main Type | Engine Type | Conversion |
|-----------|-------------|------------|
| `time: string` | `timeSlot: string` | Direct map |
| `location: string` | `location: {name, address, coordinates}` | Wrap in object |
| `notes?: string` | `description: string` | Use notes or activity |
| `category: enum` | `category: string` | Map "free" to "Activity" |
| `cost?: {amount, currency}` | `estimatedCost?: string` | Format as string |

## Best Practices

1. **Always Convert**: Never pass main types directly to engine or vice versa
2. **Validate State**: Check `toEngineState()` returns non-null before using
3. **Preserve IDs**: Both type systems use the same ID format for timeline rows
4. **Error Handling**: Handle conversion failures gracefully with user-friendly messages
5. **Type Imports**: Import from correct location:
   - App types: `@/types/trip`
   - Engine types: `@/lib/trip/schemas`
   - Converters: `@/lib/trip/converters`

## Future Improvements

- [ ] Add Zod schemas for runtime validation
- [ ] Create more granular conversion utilities
- [ ] Add comprehensive unit tests for converters
- [ ] Document edge cases and error conditions
- [ ] Consider unifying types if schemas become similar
