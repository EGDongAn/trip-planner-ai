# Export Buttons Usage Example

## Basic Integration

Here's how to integrate the export buttons into your trip timeline page:

```tsx
import { ExportButtons } from '@/components/trip/ExportButtons';
import { TimelineDisplay } from '@/components/trip/TimelineDisplay';
import type { TimelineRow, TripMetadata } from '@/types/trip';

export default function TripPage() {
  // Your trip data
  const destination = "Tokyo";
  const plan = "문화와 음식 탐방";

  const metadata: TripMetadata = {
    travelers: 2,
    departureDate: "2024-03-15",
    returnDate: "2024-03-22",
    departureCity: "Seoul",
    budget: 3000000,
    preferences: ["문화", "음식", "쇼핑"]
  };

  const timeline: TimelineRow[] = [
    {
      id: "1",
      day: 1,
      date: "2024-03-15",
      time: "09:00",
      activity: "인천공항 출발",
      location: "인천국제공항",
      duration: "3시간",
      category: "transport",
      verified: true,
      cost: { amount: 450000, currency: "KRW" }
    },
    // ... more timeline items
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Timeline Display */}
        <TimelineDisplay
          schedule={groupTimelineByDay(timeline)}
          totalCost={{ amount: 2850000, currency: "KRW" }}
        />

        {/* Export Buttons */}
        <ExportButtons
          destination={destination}
          plan={plan}
          timeline={timeline}
          metadata={metadata}
        />
      </div>
    </div>
  );
}

// Helper function to group timeline by day
function groupTimelineByDay(timeline: TimelineRow[]) {
  const grouped = timeline.reduce((acc, item) => {
    const existingDay = acc.find(d => d.dayNumber === item.day);
    if (existingDay) {
      existingDay.items.push({
        id: item.id,
        time: item.time,
        activity: item.activity,
        location: item.location,
        category: item.category as any,
        cost: item.cost,
        verified: item.verified
      });
    } else {
      acc.push({
        date: item.date,
        dayNumber: item.day,
        items: [{
          id: item.id,
          time: item.time,
          activity: item.activity,
          location: item.location,
          category: item.category as any,
          cost: item.cost,
          verified: item.verified
        }]
      });
    }
    return acc;
  }, [] as any[]);

  return grouped;
}
```

## Using Export Functions Directly

If you need more control, you can use the export functions directly:

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { exportToSheet } from '@/lib/sheets';
import { exportToPdf } from '@/lib/export';
import { FileSpreadsheet } from 'lucide-react';

export function CustomExportButton({ tripData }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);

    try {
      // Export to Google Sheets
      const result = await exportToSheet({
        destination: tripData.destination,
        plan: tripData.plan,
        timeline: tripData.timeline,
        metadata: tripData.metadata
      });

      if (result.success) {
        // Open the spreadsheet
        window.open(result.spreadsheetUrl, '_blank');

        // Also export to PDF for backup
        await exportToPdf({
          destination: tripData.destination,
          plan: tripData.plan,
          timeline: tripData.timeline,
          metadata: tripData.metadata,
          filename: `${tripData.destination}_trip.pdf`
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={loading}>
      <FileSpreadsheet className="w-4 h-4 mr-2" />
      Export to Sheets & PDF
    </Button>
  );
}
```

## Server-Side Export (API Route)

For server-side export (avoiding CORS issues), use the API route:

```tsx
'use client';

import { useState } from 'react';

export function ServerExportButton({ tripData }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/sheets/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData)
      });

      const result = await response.json();

      if (result.success) {
        window.open(result.spreadsheetUrl, '_blank');
      } else {
        console.error('Export failed:', result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleExport} disabled={loading}>
      {loading ? 'Exporting...' : 'Export to Sheets'}
    </button>
  );
}
```

## Styling the Export Section

Here's an example of how to style the export section:

```tsx
<div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
  <ExportButtons
    destination={destination}
    plan={plan}
    timeline={timeline}
    metadata={metadata}
    className="w-full"
  />
</div>
```

## Checking Configuration

To check if Google Sheets export is configured:

```tsx
import { isAppsScriptConfigured } from '@/lib/sheets';

export function ExportSection({ tripData }) {
  const sheetsConfigured = isAppsScriptConfigured();

  return (
    <div>
      {sheetsConfigured ? (
        <ExportButtons {...tripData} />
      ) : (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-4 rounded-lg">
          Google Sheets export is not configured. See EXPORT_SETUP.md for instructions.
        </div>
      )}
    </div>
  );
}
```

## Error Handling

The ExportButtons component includes built-in error handling with user feedback:

```tsx
// The component will automatically show:
// - Success messages (green)
// - Error messages (red)
// - Loading states (spinner)

<ExportButtons
  destination={destination}
  plan={plan}
  timeline={timeline}
  metadata={metadata}
/>

// Messages auto-clear after 5 seconds
```

## Custom Styling

You can customize the appearance by passing className:

```tsx
<ExportButtons
  {...tripData}
  className="max-w-3xl mx-auto"
/>
```

Or by wrapping in your own container:

```tsx
<div className="flex justify-end">
  <div className="w-full md:w-auto">
    <ExportButtons {...tripData} />
  </div>
</div>
```
