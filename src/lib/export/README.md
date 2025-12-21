# Export Services

This module provides export functionality for Trip Planner timeline data in multiple formats.

## Services

### PDF Export (`pdfService.ts`)

Export timeline to printable PDF using jsPDF and html2canvas.

```typescript
import { exportToPdf } from '@/lib/export';

await exportToPdf({
  destination: "Tokyo",
  plan: "문화와 음식 탐방",
  timeline: timelineData,
  metadata: tripMetadata,
  filename: "tokyo-trip.pdf" // optional
});
```

**Features**:
- A4 paper size, portrait orientation
- Multi-page support
- Color-coded categories
- Includes trip metadata
- Day-by-day timeline layout

### Image Export (`imageService.ts`)

Export timeline as high-quality PNG or JPEG image.

```typescript
import { exportToImage } from '@/lib/export';

await exportToImage({
  destination: "Tokyo",
  plan: "문화와 음식 탐방",
  timeline: timelineData,
  metadata: tripMetadata,
  format: 'png', // or 'jpeg'
  quality: 0.95, // 0.0 - 1.0
  filename: "tokyo-trip.png" // optional
});
```

**Features**:
- High-resolution (2x scaling)
- Dark gradient background
- Professional styling
- PNG or JPEG format
- Optimized for social sharing

### Direct Element Export

Export an existing DOM element directly:

```typescript
import { exportElementToImage } from '@/lib/export';

await exportElementToImage(
  'timeline-container', // element ID
  'my-timeline.png',    // filename
  'png',                // format
  0.95                  // quality
);
```

## Usage with Component

The easiest way to use these services is through the `ExportButtons` component:

```typescript
import { ExportButtons } from '@/components/trip/ExportButtons';

<ExportButtons
  destination={destination}
  plan={plan}
  timeline={timeline}
  metadata={metadata}
/>
```

This provides a complete UI with all export options, loading states, and error handling.

## Types

```typescript
interface PdfExportOptions {
  destination: string;
  plan: string;
  timeline: TimelineRow[];
  metadata: TripMetadata;
  filename?: string;
}

interface ImageExportOptions {
  destination: string;
  plan: string;
  timeline: TimelineRow[];
  metadata: TripMetadata;
  filename?: string;
  format?: 'png' | 'jpeg';
  quality?: number; // 0.0 - 1.0
}
```

## Dependencies

- `jspdf` - PDF generation
- `html2canvas` - HTML to canvas conversion

## Error Handling

All export functions throw errors that should be caught:

```typescript
try {
  await exportToPdf(options);
  console.log('PDF exported successfully');
} catch (error) {
  console.error('PDF export failed:', error);
}
```

## Browser Compatibility

- Modern browsers with Canvas API support
- File download API support required
- Works in Chrome, Firefox, Safari, Edge

## Performance

- PDF generation: ~2-5 seconds for typical timeline
- Image generation: ~1-3 seconds
- Processing happens client-side
- Large timelines may take longer

## Customization

To customize the output, modify the HTML generation functions:

- `generateTimelineHtml()` in each service
- `getCategoryColor()` for color schemes
- `getCategoryIcon()` for icons (image service)

## See Also

- `src/lib/sheets/` - Google Sheets export
- `src/components/trip/ExportButtons.tsx` - UI component
- `EXPORT_SETUP.md` - Complete setup guide
- `USAGE_EXAMPLE.md` - Integration examples
