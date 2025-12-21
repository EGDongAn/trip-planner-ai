# Trip Planner - Export Setup Guide

This guide explains how to set up and use the export features for Trip Planner.

## Export Options

Trip Planner supports three export formats:

1. **Google Sheets** - Create a formatted spreadsheet with your trip itinerary
2. **PDF** - Download a printable PDF document
3. **Image** - Save your timeline as a PNG image

## Setup Instructions

### 1. Google Sheets Export Setup

To enable Google Sheets export, you need to deploy a Google Apps Script Web App:

#### Step 1: Create Apps Script Project

1. Go to [Google Apps Script](https://script.google.com)
2. Click **New Project**
3. Name your project (e.g., "Trip Planner Exporter")

#### Step 2: Add the Script Code

1. Copy the code from `scripts/AppsScript.gs`
2. Paste it into the `Code.gs` file in your Apps Script project
3. Save the project (Ctrl+S or Cmd+S)

#### Step 3: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: Trip Planner Export
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Important**: Copy the Web App URL (it will look like `https://script.google.com/macros/s/ABC123.../exec`)

#### Step 4: Configure Environment Variable

1. Create a `.env.local` file in the project root (if it doesn't exist)
2. Add the following line with your Web App URL:

```env
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

3. Restart your development server

### 2. PDF Export

PDF export works out of the box with no additional setup required. It uses:

- **html2canvas** - To convert the timeline to an image
- **jsPDF** - To generate the PDF file

The PDF export creates a printable A4 document with:
- Trip metadata (destination, dates, travelers, budget)
- Day-by-day timeline with activities
- Color-coded categories
- Costs and notes

### 3. Image Export

Image export also works out of the box. It creates a high-quality PNG image (2x resolution) with:

- Dark gradient background
- Trip information header
- Styled timeline with icons
- Professional formatting

## Using the Export Buttons

Once set up, you can use the export buttons in your trip timeline:

```tsx
import { ExportButtons } from '@/components/trip/ExportButtons';

<ExportButtons
  destination="Tokyo"
  plan="문화와 음식 탐방"
  timeline={timelineData}
  metadata={tripMetadata}
/>
```

### Props

- `destination` (string) - Trip destination name
- `plan` (string) - Selected plan name
- `timeline` (TimelineRow[]) - Array of timeline items
- `metadata` (TripMetadata) - Trip metadata (dates, travelers, etc.)
- `className` (string, optional) - Additional CSS classes

## API Routes

### POST /api/sheets/export

Server-side endpoint for Google Sheets export (optional, for avoiding CORS issues).

**Request Body:**
```json
{
  "destination": "Tokyo",
  "plan": "문화와 음식 탐방",
  "timeline": [...],
  "metadata": {...}
}
```

**Response:**
```json
{
  "success": true,
  "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/...",
  "spreadsheetId": "1ABC123..."
}
```

### GET /api/sheets/export

Health check endpoint to verify Apps Script configuration.

**Response:**
```json
{
  "status": "ok",
  "configured": true,
  "message": "Google Sheets export is configured"
}
```

## Troubleshooting

### Google Sheets Export Issues

**Problem**: "Apps Script URL이 설정되지 않았습니다"

**Solution**: Make sure you've added `NEXT_PUBLIC_APPS_SCRIPT_URL` to your `.env.local` file and restarted the dev server.

---

**Problem**: CORS errors when exporting to Sheets

**Solution**:
1. Verify your Apps Script deployment has "Who has access" set to "Anyone"
2. Alternatively, use the API route `/api/sheets/export` which bypasses CORS

---

**Problem**: "Authorization required" error

**Solution**: When you first deploy the Apps Script, you'll need to authorize it:
1. Run the script once from the Apps Script editor
2. Click "Review permissions"
3. Allow the script to access Google Sheets

### PDF Export Issues

**Problem**: PDF is blank or incomplete

**Solution**:
1. Make sure your timeline data is fully loaded before exporting
2. Check browser console for errors
3. Some ad blockers may interfere with html2canvas

### Image Export Issues

**Problem**: Image is low quality

**Solution**: The export uses 2x scaling by default. You can adjust the quality in the code:

```typescript
await exportToImage({
  // ... other options
  quality: 1.0 // Max quality (0.0 - 1.0)
});
```

## Advanced Usage

### Programmatic Export

You can also use the export functions directly in your code:

```typescript
import { exportToSheet } from '@/lib/sheets/appsScriptClient';
import { exportToPdf } from '@/lib/export/pdfService';
import { exportToImage } from '@/lib/export/imageService';

// Export to Sheets
const result = await exportToSheet({
  destination,
  plan,
  timeline,
  metadata
});

if (result.success) {
  console.log('Spreadsheet URL:', result.spreadsheetUrl);
}

// Export to PDF
await exportToPdf({
  destination,
  plan,
  timeline,
  metadata,
  filename: 'my-trip.pdf'
});

// Export to Image
await exportToImage({
  destination,
  plan,
  timeline,
  metadata,
  filename: 'my-trip.png',
  format: 'png',
  quality: 0.95
});
```

### Customizing the Apps Script

You can customize the Google Sheets output by editing `scripts/AppsScript.gs`:

- Change colors and formatting
- Add additional columns
- Create multiple sheets
- Add charts or conditional formatting

## Security Notes

- The Apps Script URL is public and should be treated as such
- The script only has access to create new spreadsheets
- No sensitive data should be stored in environment variables committed to git
- Always use `.env.local` for local development (it's in `.gitignore`)

## Support

For issues or questions:
1. Check this guide first
2. Review the code in `src/lib/sheets/` and `src/lib/export/`
3. Check browser console for error messages
4. Verify all environment variables are set correctly
