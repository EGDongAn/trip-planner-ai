# Travel Search Implementation Guide

## Overview
Complete SerpAPI-powered travel search system for the Trip Planner application, including flight and hotel search functionality with modern UI components.

## Files Created

### 1. SerpAPI Service
**Location**: `/home/egskin/dev/personal/trip/src/lib/travel/serpApiService.ts`

**Purpose**: Core service for interfacing with SerpAPI to search flights and hotels.

**Key Features**:
- Flight search using Google Flights engine
- Hotel search using Google Hotels engine
- Response transformation to match application types
- Error handling and validation
- Support for round-trip flights and multi-guest hotels

**API Methods**:
```typescript
searchFlights(params: FlightSearchParams): Promise<FlightInfo[]>
searchHotels(params: HotelSearchParams): Promise<HotelInfo[]>
```

### 2. Travel Search Hook
**Location**: `/home/egskin/dev/personal/trip/src/hooks/useTravelSearch.ts`

**Purpose**: React hook for managing travel search state and API communication.

**Features**:
- Centralized state management for flights and hotels
- Loading and error state handling
- API route communication (`/api/travel/flights`, `/api/travel/hotels`)
- Clear functions for resetting search results

**Hook Interface**:
```typescript
{
  flights: FlightInfo[];
  hotels: HotelInfo[];
  isLoading: boolean;
  error: string | null;
  searchFlights: (params) => Promise<void>;
  searchHotels: (params) => Promise<void>;
  clearFlights: () => void;
  clearHotels: () => void;
}
```

### 3. Flight Card Component
**Location**: `/home/egskin/dev/personal/trip/src/components/travel/FlightCard.tsx`

**Purpose**: Display individual flight information in a card format.

**Features**:
- Airline and flight number display
- Departure and arrival times with airport codes
- Flight duration visualization
- Price display with currency formatting
- External booking link with icon
- Verified badge for SerpAPI results
- Source indicator (SerpAPI vs Manual)
- Responsive design with hover effects

**Icons Used**:
- `Plane` - Flight indicator
- `Clock` - Duration indicator
- `ExternalLink` - Booking link
- `CheckCircle` - Verification badge

### 4. Hotel Card Component
**Location**: `/home/egskin/dev/personal/trip/src/components/travel/HotelCard.tsx`

**Purpose**: Display individual hotel information in a card format.

**Features**:
- Hotel name with star rating
- Guest rating display
- Address with map pin icon
- Amenity badges with icons (WiFi, breakfast, gym, restaurant)
- Optional hotel image display
- Price per night with currency formatting
- External booking link
- Verified badge for SerpAPI results
- Source indicator
- Responsive grid layout for amenities

**Icons Used**:
- `Hotel` - Hotel indicator
- `Star` - Star rating
- `MapPin` - Address indicator
- `Wifi`, `Coffee`, `Dumbbell`, `Utensils` - Amenity icons
- `ExternalLink` - Booking link
- `CheckCircle` - Verification badge

### 5. Travel Search Panel Component
**Location**: `/home/egskin/dev/personal/trip/src/components/travel/TravelSearchPanel.tsx`

**Purpose**: Main component providing search interface and results display.

**Features**:
- Tab navigation between Flights and Hotels
- Flight search form with:
  - Departure/arrival airport codes
  - Departure date (required)
  - Return date (optional)
  - Number of adults (1-6)
- Hotel search form with:
  - Location name
  - Check-in/check-out dates
  - Number of guests (1-6)
- Loading state with spinner
- Error message display
- Grid layout for results
- No results message
- Form validation
- Uppercase conversion for airport codes

**Icons Used**:
- `Plane`, `Hotel` - Tab indicators
- `Search` - Search button
- `Calendar` - Date fields (visual reference)
- `Users` - Guest/passenger count
- `MapPin` - Location (visual reference)
- `Loader2` - Loading spinner

### 6. Component Index
**Location**: `/home/egskin/dev/personal/trip/src/components/travel/index.ts`

**Purpose**: Export barrel for travel components.

## Integration Requirements

### API Routes Needed
The following Next.js API routes need to be created:

#### Flight Search API
**Path**: `/home/egskin/dev/personal/trip/src/app/api/travel/flights/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { SerpApiService } from '@/lib/travel/serpApiService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const departure = searchParams.get('departure');
  const arrival = searchParams.get('arrival');
  const departureDate = searchParams.get('departureDate');
  const returnDate = searchParams.get('returnDate') || undefined;
  const adults = searchParams.get('adults')
    ? parseInt(searchParams.get('adults')!)
    : undefined;

  if (!departure || !arrival || !departureDate) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const serpApi = new SerpApiService(process.env.SERPAPI_KEY!);
    const flights = await serpApi.searchFlights({
      departure,
      arrival,
      departureDate,
      returnDate,
      adults
    });

    return NextResponse.json({ flights });
  } catch (error) {
    console.error('Flight search error:', error);
    return NextResponse.json(
      { error: 'Failed to search flights' },
      { status: 500 }
    );
  }
}
```

#### Hotel Search API
**Path**: `/home/egskin/dev/personal/trip/src/app/api/travel/hotels/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { SerpApiService } from '@/lib/travel/serpApiService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const location = searchParams.get('location');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const adults = searchParams.get('adults')
    ? parseInt(searchParams.get('adults')!)
    : undefined;

  if (!location || !checkIn || !checkOut) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const serpApi = new SerpApiService(process.env.SERPAPI_KEY!);
    const hotels = await serpApi.searchHotels({
      location,
      checkIn,
      checkOut,
      adults
    });

    return NextResponse.json({ hotels });
  } catch (error) {
    console.error('Hotel search error:', error);
    return NextResponse.json(
      { error: 'Failed to search hotels' },
      { status: 500 }
    );
  }
}
```

### Environment Variables
Add to `.env.local`:

```bash
SERPAPI_KEY=your_serpapi_key_here
```

Get your API key from: https://serpapi.com/

## Usage Example

```typescript
import { TravelSearchPanel } from '@/components/travel';

export default function TravelPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Travel Search</h1>
      <TravelSearchPanel />
    </div>
  );
}
```

## Component Architecture

```
TravelSearchPanel (Main Component)
├── useTravelSearch Hook
│   └── API Routes (/api/travel/flights, /api/travel/hotels)
│       └── SerpApiService (SerpAPI Integration)
│           └── External SerpAPI (https://serpapi.com)
├── FlightCard (Results Display)
└── HotelCard (Results Display)
```

## Design System Compliance

All components follow the project's design system:
- **Colors**: Slate color palette with blue accents
- **Typography**: Consistent font sizes and weights
- **Spacing**: Tailwind spacing scale
- **Shadows**: Blue-tinted shadows for interactive elements
- **Border Radius**: Rounded-xl for cards, rounded-lg for buttons
- **Transitions**: Smooth 200ms transitions
- **Focus States**: Ring-based focus indicators

## Accessibility Features

- Semantic HTML elements
- Proper ARIA labels where needed
- Keyboard navigation support
- Focus indicators on interactive elements
- Color contrast compliance
- Screen reader friendly alt text and labels

## Responsive Design

- Mobile-first approach
- Grid layouts adjust for different screen sizes
- Touch-friendly tap targets (minimum 44x44px)
- Horizontal scrolling prevented
- Readable text at all viewport sizes

## Error Handling

- Network error handling with user-friendly messages
- API error display in dedicated error component
- Loading states with spinners
- Form validation for required fields
- Graceful degradation when API fails

## Performance Considerations

- Lazy loading of search results
- Debounced API calls (can be added if needed)
- Optimized re-renders with proper state management
- Image lazy loading for hotel photos
- Efficient list rendering with React keys

## Future Enhancements

1. **Filtering**: Add price range, airline, hotel rating filters
2. **Sorting**: Sort by price, duration, rating
3. **Favorites**: Save favorite flights/hotels
4. **Comparison**: Side-by-side comparison feature
5. **Map Integration**: Show hotels on map
6. **Calendar View**: Visual calendar for date selection
7. **Price Alerts**: Notify users of price changes
8. **Multi-City**: Support for multi-city flight searches
9. **Reviews**: Display user reviews from SerpAPI
10. **Caching**: Implement result caching to reduce API calls

## Testing Recommendations

1. **Unit Tests**: Test hooks and utility functions
2. **Component Tests**: Test component rendering and interactions
3. **Integration Tests**: Test full search workflow
4. **E2E Tests**: Test user journey from search to booking
5. **API Tests**: Mock SerpAPI responses for testing
6. **Accessibility Tests**: Use tools like axe-core

## SerpAPI Limitations

- Rate limits apply based on your plan
- Some results may require premium SerpAPI subscription
- Booking URLs may expire or change
- Real-time availability not guaranteed
- Prices may vary from actual booking sites

## Support

For SerpAPI documentation: https://serpapi.com/docs
For component issues: Check the project repository
For bug reports: Create an issue with detailed reproduction steps
