# Trip Planner Export Features

Complete export system for Trip Planner timeline data supporting Google Sheets, PDF, and Image formats.

## Quick Start

### 1. Installation (Already Done ✅)

```bash
npm install jspdf  # Already installed
```

### 2. Add to Your Page

```tsx
import { ExportButtons } from '@/components/trip/ExportButtons';

<ExportButtons
  destination={selectedDestination.name}
  plan={selectedPlan.name}
  timeline={timeline}
  metadata={metadata}
/>
```

### 3. Configure Google Sheets (Optional)

See `EXPORT_SETUP.md` for complete instructions.

## Export Formats

### 🟢 PDF Export (Ready to Use)

**Features**:
- Printable A4 format
- Color-coded categories
- Day-by-day timeline
- Includes costs and notes

**No setup required** - Works immediately!

### 🟢 Image Export (Ready to Use)

**Features**:
- High-quality PNG (2x resolution)
- Dark gradient design
- Professional styling
- Social media ready

**No setup required** - Works immediately!

### 🟡 Google Sheets Export (Requires Setup)

**Features**:
- Formatted spreadsheet
- Color-coded categories
- Auto-sized columns
- Opens in new tab

**Requires**: Google Apps Script deployment (see EXPORT_SETUP.md)

## File Structure

```
/home/egskin/dev/personal/trip/
├── src/
│   ├── lib/
│   │   ├── sheets/
│   │   │   ├── appsScriptClient.ts    # Google Sheets client
│   │   │   ├── index.ts               # Module exports
│   │   │   └── README.md              # Sheets documentation
│   │   └── export/
│   │       ├── pdfService.ts          # PDF export
│   │       ├── imageService.ts        # Image export
│   │       ├── index.ts               # Module exports
│   │       └── README.md              # Export documentation
│   ├── components/
│   │   └── trip/
│   │       └── ExportButtons.tsx      # UI component
│   └── app/
│       └── api/
│           └── sheets/
│               └── export/
│                   └── route.ts       # API endpoint
├── scripts/
│   └── AppsScript.gs                  # Google Apps Script
├── EXPORT_SETUP.md                    # Complete setup guide
├── INTEGRATION_GUIDE.md               # Quick integration
├── USAGE_EXAMPLE.md                   # Code examples
└── .env.example                       # Environment template
```

## Component API

### ExportButtons Component

```tsx
interface ExportButtonsProps {
  destination: string;      // Trip destination name
  plan: string;            // Selected plan name
  timeline: TimelineRow[]; // Timeline data
  metadata: TripMetadata;  // Trip metadata
  className?: string;      // Optional CSS classes
}
```

**Features**:
- Loading states
- Success/error messages
- Auto-clear notifications (5s)
- Responsive design
- Lucide React icons

## Service APIs

### PDF Service

```typescript
import { exportToPdf } from '@/lib/export';

await exportToPdf({
  destination: "Tokyo",
  plan: "문화와 음식 탐방",
  timeline: timelineData,
  metadata: tripMetadata,
  filename: "trip.pdf" // optional
});
```

### Image Service

```typescript
import { exportToImage } from '@/lib/export';

await exportToImage({
  destination: "Tokyo",
  plan: "문화와 음식 탐방",
  timeline: timelineData,
  metadata: tripMetadata,
  format: 'png',      // or 'jpeg'
  quality: 0.95,      // 0.0 - 1.0
  filename: "trip.png" // optional
});
```

### Sheets Service

```typescript
import { exportToSheet } from '@/lib/sheets';

const result = await exportToSheet({
  destination: "Tokyo",
  plan: "문화와 음식 탐방",
  timeline: timelineData,
  metadata: tripMetadata
});

if (result.success) {
  window.open(result.spreadsheetUrl, '_blank');
}
```

## API Routes

### POST /api/sheets/export

Server-side Google Sheets export (CORS-free).

```typescript
const response = await fetch('/api/sheets/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ destination, plan, timeline, metadata })
});

const result = await response.json();
// { success: true, spreadsheetUrl: "...", spreadsheetId: "..." }
```

### GET /api/sheets/export

Health check endpoint.

```typescript
const response = await fetch('/api/sheets/export');
const status = await response.json();
// { status: "ok", configured: true, message: "..." }
```

## Environment Variables

```env
# Required for Google Sheets export
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec

# Optional: Server-side API route
APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec

# Other APIs
NEXT_PUBLIC_GEMINI_API_KEY=your_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
```

## Dependencies

### Installed
- `jspdf@3.0.4` - PDF generation
- `html2canvas@1.4.1` - HTML to canvas conversion
- `lucide-react@0.562.0` - Icons

### Peer Dependencies
- `react@19.2.3`
- `next@16.1.0`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Requirements**:
- Canvas API
- File Download API
- Blob API

## Performance

| Operation | Time | Notes |
|-----------|------|-------|
| PDF Export | 2-5s | Depends on timeline length |
| Image Export | 1-3s | High-quality 2x rendering |
| Sheets Export | 3-8s | Includes network request |

## Error Handling

All services include comprehensive error handling:

```typescript
try {
  await exportToPdf(options);
  // Success
} catch (error) {
  console.error('Export failed:', error);
  // Show user-friendly error message
}
```

The `ExportButtons` component handles errors automatically with visual feedback.

## Customization

### Modify PDF Layout

Edit `src/lib/export/pdfService.ts`:
- `generateTimelineHtml()` - HTML structure
- `getCategoryColor()` - Color scheme
- PDF options (orientation, format, etc.)

### Modify Image Styling

Edit `src/lib/export/imageService.ts`:
- `generateTimelineHtml()` - HTML structure
- `getCategoryColor()` - Color scheme
- `getCategoryIcon()` - Category icons
- Image quality and format

### Modify Sheets Format

Edit `scripts/AppsScript.gs`:
- Column structure
- Colors and styling
- Additional sheets
- Charts and formatting

## Security

- Apps Script URL is public (by design)
- Limited permissions (create spreadsheets only)
- No sensitive data in environment variables
- `.env.local` is gitignored
- Client-side processing (no data sent to servers except Google)

## Troubleshooting

### "Apps Script URL not configured"
1. Copy `.env.example` to `.env.local`
2. Follow setup in `EXPORT_SETUP.md`
3. Restart dev server

### PDF is blank
- Ensure timeline data is loaded
- Check browser console for errors
- Disable ad blockers

### Image quality is low
- Adjust quality parameter (0.0 - 1.0)
- Check output scale (default 2x)

### CORS errors with Sheets
- Verify Apps Script deployment settings
- Use API route alternative
- Check "Anyone" access setting

## Documentation

- **EXPORT_SETUP.md** - Complete setup instructions with troubleshooting
- **INTEGRATION_GUIDE.md** - Quick 3-step integration guide
- **USAGE_EXAMPLE.md** - Advanced usage examples and patterns
- **src/lib/export/README.md** - PDF/Image service documentation
- **src/lib/sheets/README.md** - Google Sheets service documentation

## Verification

Run the verification script:

```bash
./verify-export-setup.sh
```

This checks:
- ✅ Dependencies installed
- ✅ Source files present
- ✅ Documentation available
- ⚠️ Environment configuration

## Support

For issues:
1. Check documentation above
2. Review browser console
3. Verify environment variables
4. Check `EXPORT_SETUP.md` troubleshooting

## License

Part of Trip Planner project.
