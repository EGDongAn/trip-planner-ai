# Quick Integration Guide

## Add Export Buttons to Your App in 3 Steps

### Step 1: Import the Component

In your trip timeline page (e.g., `src/app/trip/[id]/page.tsx` or wherever you display the timeline):

```tsx
import { ExportButtons } from '@/components/trip/ExportButtons';
```

### Step 2: Add the Component to Your JSX

Add the ExportButtons component below your timeline display:

```tsx
export default function TripPage() {
  // ... your existing state and data

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Your existing timeline display */}
      <TimelineDisplay
        schedule={schedule}
        totalCost={totalCost}
      />

      {/* Add this: Export buttons section */}
      <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <ExportButtons
          destination={selectedDestination?.name || "여행지"}
          plan={selectedPlan?.name || "여행 계획"}
          timeline={timeline}
          metadata={metadata}
        />
      </div>
    </div>
  );
}
```

### Step 3: Set Up Environment Variables (Optional for Google Sheets)

If you want to enable Google Sheets export:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Follow the Google Apps Script setup in `EXPORT_SETUP.md`

3. Add your Apps Script URL to `.env.local`:
   ```env
   NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
   ```

That's it! The PDF and Image exports work immediately. Google Sheets export requires the optional Apps Script setup.

## Example with Existing State

If you're using the Trip Planner state structure:

```tsx
'use client';

import { useState } from 'react';
import { ExportButtons } from '@/components/trip/ExportButtons';
import type { TripState } from '@/types/trip';

export default function TripPage() {
  const [tripState, setTripState] = useState<TripState>({
    stage: 'itinerary_ready',
    selectedDestination: null,
    selectedPlan: null,
    timeline: [],
    metadata: {
      travelers: 2,
      departureDate: '',
      returnDate: '',
      departureCity: '',
      preferences: []
    },
    // ... other state
  });

  // Only show export buttons when timeline is ready
  const showExport = tripState.stage === 'itinerary_ready' && tripState.timeline.length > 0;

  return (
    <div>
      {/* Your existing UI */}

      {showExport && (
        <ExportButtons
          destination={tripState.selectedDestination?.name || "여행지"}
          plan={tripState.selectedPlan?.name || "여행 계획"}
          timeline={tripState.timeline}
          metadata={tripState.metadata}
        />
      )}
    </div>
  );
}
```

## Conditional Rendering

Show export buttons only when ready:

```tsx
{timeline.length > 0 && (
  <div className="mt-8">
    <ExportButtons
      destination={destination}
      plan={plan}
      timeline={timeline}
      metadata={metadata}
    />
  </div>
)}
```

## Custom Styling

Customize the appearance:

```tsx
<ExportButtons
  destination={destination}
  plan={plan}
  timeline={timeline}
  metadata={metadata}
  className="max-w-2xl mx-auto"
/>
```

## Troubleshooting

**Problem**: Component not found

**Solution**: Make sure the file exists at `/home/egskin/dev/personal/trip/src/components/trip/ExportButtons.tsx`

---

**Problem**: TypeScript errors

**Solution**: Ensure your types match the expected structure. Check `src/types/trip.ts` for type definitions.

---

**Problem**: "Apps Script URL not configured" error

**Solution**: This is expected if you haven't set up Google Sheets export yet. PDF and Image exports will still work. To enable Sheets export, see `EXPORT_SETUP.md`.

## Testing

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to a trip with timeline data

3. Click each export button:
   - PDF: Should download a PDF file
   - Image: Should download a PNG image
   - Sheets: Should open a new Google Sheet (if configured)

For more details, see:
- `EXPORT_SETUP.md` - Complete setup instructions
- `USAGE_EXAMPLE.md` - Advanced usage examples
