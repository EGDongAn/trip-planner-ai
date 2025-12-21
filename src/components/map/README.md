# TripMap Component

Google Maps integration for displaying trip timeline locations.

## Setup

1. Get a Google Maps API Key from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geometry API
3. Add the API key to your `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

## Usage

```tsx
import { TripMap } from '@/components/map/TripMap';
import { TimelineRow } from '@/types/trip';

const timeline: TimelineRow[] = [
  {
    id: '1',
    day: 1,
    date: '2024-01-15',
    time: '09:00',
    activity: 'Arrive at Airport',
    location: 'JFK Airport',
    coordinates: { lat: 40.6413, lng: -73.7781 },
    duration: '30 min',
    category: 'transport',
    verified: true,
  },
  // ... more timeline items
];

function MyComponent() {
  return (
    <div className="w-full h-[600px]">
      <TripMap timeline={timeline} />
    </div>
  );
}
```

## Props

### TripMap

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `timeline` | `TimelineRow[]` | Yes | Array of timeline items to display |
| `center` | `{ lat: number; lng: number }` | No | Map center coordinates (auto-calculated if not provided) |

### MapMarker

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `row` | `TimelineRow` | Yes | Timeline row to display as marker |
| `isSelected` | `boolean` | Yes | Whether the marker info window is open |
| `onClick` | `() => void` | Yes | Callback when marker is clicked |
| `onClose` | `() => void` | Yes | Callback when info window is closed |

## Features

- **Automatic Center & Zoom**: Map automatically centers and zooms to fit all markers
- **Category Colors**: Different marker colors for each category:
  - Transport: Blue (#3B82F6)
  - Activity: Green (#10B981)
  - Food: Orange (#F59E0B)
  - Accommodation: Purple (#8B5CF6)
  - Free: Gray (#6B7280)
- **Route Visualization**: Polyline connects locations in timeline order
- **Info Windows**: Click markers to see detailed information
- **Responsive**: Works on all screen sizes

## Timeline Item Requirements

For items to appear on the map, they must have the `coordinates` property:

```typescript
{
  coordinates: { lat: number; lng: number }
}
```

Items without coordinates will be filtered out automatically.

## Customization

### Map Options

Edit `defaultMapOptions` in `TripMap.tsx`:

```typescript
const defaultMapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  clickableIcons: true,
  scrollwheel: true,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: true,
};
```

### Marker Colors

Edit `MARKER_COLORS` in `MapMarker.tsx`:

```typescript
const MARKER_COLORS: Record<TimelineRow["category"], string> = {
  transport: "#3B82F6",
  activity: "#10B981",
  food: "#F59E0B",
  accommodation: "#8B5CF6",
  free: "#6B7280",
};
```

### Polyline Style

Edit polyline options in `TripMap.tsx`:

```typescript
<Polyline
  path={path}
  options={{
    strokeColor: "#3B82F6",
    strokeOpacity: 0.6,
    strokeWeight: 3,
    geodesic: true,
  }}
/>
```

## Error Handling

The component handles three states:

1. **Loading**: Shows loading message while Google Maps API loads
2. **Error**: Displays error message if API fails to load
3. **No Data**: Shows message if no timeline items have coordinates

## Performance

- Uses `useMemo` for expensive calculations
- Filters coordinates once on timeline change
- Optimized marker rendering with React keys
