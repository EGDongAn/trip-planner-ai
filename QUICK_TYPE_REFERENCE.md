# Quick Type Reference

## When to Use Which Type

### Use `TripState` (from `/src/types/trip.ts`)
- ✅ In React components
- ✅ In state management (hooks, context)
- ✅ In API request/response bodies
- ✅ In UI layer code

**Example:**
```typescript
import type { TripState } from "@/types/trip";

const [tripState, setTripState] = useState<TripState>({
  stage: "initial",
  // ... other fields
});
```

### Use `TripEngineState` (from `/src/lib/trip/schemas`)
- ✅ When calling `TripPlannerEngine.refineTimeline()`
- ✅ In `buildRefinementPrompt()`
- ✅ Inside the `/src/lib/trip/` module

**Example:**
```typescript
import type { TripEngineState } from "@/lib/trip/schemas";

const engineState: TripEngineState = {
  destination,
  plan,
  timeline,
  summary,
  metadata
};
```

## Conversion Cheat Sheet

### App → Engine
```typescript
import { toEngineState } from "@/lib/trip/converters";

const engineState = toEngineState(appState);
if (!engineState) {
  // Handle error: missing required data
}
```

**Returns `null` when:**
- No destination selected
- No plan selected
- Timeline is empty

### Engine → App
```typescript
import { updateStateWithRefinedTimeline } from "@/lib/trip/converters";

if (result.updatedTimeline) {
  const newState = updateStateWithRefinedTimeline(appState, result.updatedTimeline);
}
```

## Import Paths

### Main App Types
```typescript
import type {
  TripState,
  TripStage,
  DestinationOption,
  PlanOption,
  TimelineRow,
  TripMetadata
} from "@/types/trip";
```

### Engine Types
```typescript
import type {
  TripEngineState,
  RefinementResponse
} from "@/lib/trip/schemas";
```

### Converters
```typescript
import {
  toEngineState,
  updateStateWithRefinedTimeline
} from "@/lib/trip/converters";
```

## Common Patterns

### API Route Pattern
```typescript
// In /api/trip/refine/route.ts
import { toEngineState, updateStateWithRefinedTimeline } from "@/lib/trip/converters";
import type { TripState } from "@/types/trip";

const { currentState } = body as { currentState: TripState };

// Convert to engine state
const engineState = toEngineState(currentState);
if (!engineState) {
  return NextResponse.json({ error: "Invalid state" }, { status: 400 });
}

// Call engine
const result = await engine.refineTimeline(engineState, message);

// Convert back
let updatedState = currentState;
if (result.updatedTimeline) {
  updatedState = updateStateWithRefinedTimeline(currentState, result.updatedTimeline);
}
```

### React Component Pattern
```typescript
import type { TripState } from "@/types/trip";
import { toEngineState } from "@/lib/trip/converters";

const handleRefine = async (message: string) => {
  const engineState = toEngineState(tripState);

  if (!engineState) {
    alert("Please select a destination and plan first");
    return;
  }

  const response = await fetch("/api/trip/refine", {
    method: "POST",
    body: JSON.stringify({ currentState: tripState, message })
  });

  const result = await response.json();
  if (result.updatedState) {
    setTripState(result.updatedState);
  }
};
```

## Key Differences

| Feature | TripState | TripEngineState |
|---------|-----------|-----------------|
| **Stage** | ✅ Has workflow stage | ❌ No stage |
| **Options** | ✅ Multiple options | ❌ Single selection |
| **Conversation** | ✅ Chat history | ❌ No chat |
| **Timeline** | Simple structure | Detailed structure |
| **Location** | String | Object with coords |
| **Cost** | Object {amount, currency} | String "$20-30" |

## Troubleshooting

### Error: Type mismatch in API route
```typescript
// ❌ Wrong - passing app state directly to engine
await engine.refineTimeline(tripState, message);

// ✅ Correct - convert first
const engineState = toEngineState(tripState);
if (engineState) {
  await engine.refineTimeline(engineState, message);
}
```

### Error: Cannot read property 'destination'
```typescript
// Check if state is ready for engine
const engineState = toEngineState(tripState);
if (!engineState) {
  // User hasn't selected destination/plan yet
  // or timeline is empty
}
```

### Error: Timeline format mismatch
```typescript
// Use converter, don't manually map
// ❌ Wrong
const timeline = result.updatedTimeline;
setTripState({ ...state, timeline });

// ✅ Correct
if (result.updatedTimeline) {
  const newState = updateStateWithRefinedTimeline(state, result.updatedTimeline);
  setTripState(newState);
}
```
