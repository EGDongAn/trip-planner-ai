# Google Sheets Integration

This module provides Google Sheets export functionality via Apps Script Web App.

## Overview

The Trip Planner can export timeline data to a formatted Google Spreadsheet with:
- Trip metadata and summary
- Day-by-day timeline with activities
- Color-coded categories
- Costs and notes
- Professional formatting

## Setup Required

This service requires a deployed Google Apps Script Web App. See `EXPORT_SETUP.md` for detailed instructions.

Quick setup:
1. Go to https://script.google.com
2. Create new project
3. Copy code from `scripts/AppsScript.gs`
4. Deploy as Web App
5. Add URL to `.env.local`

## Usage

```typescript
import { exportToSheet } from '@/lib/sheets';

const result = await exportToSheet({
  destination: "Tokyo",
  plan: "문화와 음식 탐방",
  timeline: timelineData,
  metadata: tripMetadata
});

if (result.success) {
  console.log('Spreadsheet URL:', result.spreadsheetUrl);
  window.open(result.spreadsheetUrl, '_blank');
} else {
  console.error('Export failed:', result.error);
}
```

## Configuration Check

```typescript
import { isAppsScriptConfigured } from '@/lib/sheets';

if (isAppsScriptConfigured()) {
  // Show export button
} else {
  // Show setup instructions
}
```

## API

### `exportToSheet(data: SheetExportData): Promise<SheetExportResponse>`

Export trip data to Google Sheets.

**Parameters**:
```typescript
interface SheetExportData {
  destination: string;
  plan: string;
  timeline: TimelineRow[];
  metadata: TripMetadata;
}
```

**Returns**:
```typescript
interface SheetExportResponse {
  success: boolean;
  spreadsheetUrl?: string;
  spreadsheetId?: string;
  error?: string;
}
```

### `isAppsScriptConfigured(): boolean`

Check if Apps Script URL is configured in environment variables.

## Environment Variables

Required:
```env
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

Optional (for server-side API route):
```env
APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

## Server-Side Alternative

To avoid CORS issues, use the API route:

```typescript
const response = await fetch('/api/sheets/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    destination,
    plan,
    timeline,
    metadata
  })
});

const result = await response.json();
```

## Apps Script Features

The generated spreadsheet includes:

1. **Header Section**:
   - Trip title and plan name
   - Travel dates
   - Number of travelers
   - Departure city
   - Budget

2. **Timeline Table**:
   - Day number
   - Date and time
   - Activity description
   - Location
   - Duration
   - Category (color-coded)
   - Cost
   - Notes
   - Verification status

3. **Formatting**:
   - Color-coded categories
   - Frozen header row
   - Auto-sized columns
   - Professional styling

## Customization

To customize the spreadsheet output:

1. Edit `scripts/AppsScript.gs`
2. Modify formatting, colors, or layout
3. Add additional columns or sheets
4. Add charts or conditional formatting
5. Redeploy the Web App

## Error Handling

```typescript
try {
  const result = await exportToSheet(data);

  if (!result.success) {
    // Handle export failure
    console.error(result.error);
  }
} catch (error) {
  // Handle network or other errors
  console.error('Export error:', error);
}
```

## Troubleshooting

**"Apps Script URL not configured"**
- Add NEXT_PUBLIC_APPS_SCRIPT_URL to .env.local
- Restart development server

**CORS errors**
- Verify Web App deployment settings
- Use API route alternative
- Check "Anyone" access in Apps Script

**"Authorization required"**
- Run script once from Apps Script editor
- Complete authorization flow
- Verify permissions

## Security

- Web App URL is public
- Script has limited permissions (create spreadsheets only)
- No sensitive data should be in environment variables
- Use `.env.local` for development (gitignored)

## See Also

- `scripts/AppsScript.gs` - Apps Script source code
- `src/app/api/sheets/export/route.ts` - API route
- `EXPORT_SETUP.md` - Detailed setup guide
- `src/lib/export/` - PDF and Image export services
