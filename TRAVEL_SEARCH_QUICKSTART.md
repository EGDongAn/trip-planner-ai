# Travel Search Quick Start Guide

## Setup (2 minutes)

### 1. Install Dependencies
All required dependencies are already installed:
- `lucide-react` - Icons
- `next` - Framework
- `react` - UI library

### 2. Configure Environment Variable
Create or update `.env.local`:

```bash
# Optional: For real SerpAPI data
SERPAPI_API_KEY=your_serpapi_key_here
```

**Note**: The system works without an API key by providing mock data for development.

### 3. Get SerpAPI Key (Optional)
1. Visit https://serpapi.com/
2. Sign up for free account (100 searches/month free)
3. Copy your API key from the dashboard
4. Add to `.env.local`

## Usage

### Basic Usage

```typescript
import { TravelSearchPanel } from '@/components/travel';

export default function TravelPage() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Travel Search
        </h1>
        <TravelSearchPanel />
      </div>
    </div>
  );
}
```

### Individual Components

#### Flight Card Only
```typescript
import { FlightCard } from '@/components/travel';
import type { FlightInfo } from '@/types/travel';

const flight: FlightInfo = {
  airline: 'Korean Air',
  flightNumber: 'KE001',
  departure: {
    airport: 'ICN',
    time: '10:00',
    date: '2024-03-20'
  },
  arrival: {
    airport: 'NRT',
    time: '12:30',
    date: '2024-03-20'
  },
  duration: '2h 30m',
  price: {
    amount: 299,
    currency: 'USD'
  },
  bookingUrl: 'https://example.com/book',
  verified: true,
  source: 'serpapi'
};

<FlightCard flight={flight} />
```

#### Hotel Card Only
```typescript
import { HotelCard } from '@/components/travel';
import type { HotelInfo } from '@/types/travel';

const hotel: HotelInfo = {
  name: 'Grand Hyatt Tokyo',
  rating: 4.5,
  stars: 5,
  address: 'Roppongi, Tokyo',
  coordinates: { lat: 35.6595, lng: 139.7290 },
  pricePerNight: {
    amount: 350,
    currency: 'USD'
  },
  amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant'],
  imageUrl: 'https://example.com/hotel.jpg',
  bookingUrl: 'https://example.com/book',
  verified: true,
  source: 'serpapi'
};

<HotelCard hotel={hotel} />
```

#### Using the Hook Directly
```typescript
import { useTravelSearch } from '@/hooks/useTravelSearch';

function MyComponent() {
  const {
    flights,
    hotels,
    isLoading,
    error,
    searchFlights,
    searchHotels
  } = useTravelSearch();

  const handleSearch = async () => {
    await searchFlights({
      departure: 'ICN',
      arrival: 'NRT',
      departureDate: '2024-03-20',
      returnDate: '2024-03-25',
      adults: 2
    });
  };

  return (
    <div>
      <button onClick={handleSearch}>Search Flights</button>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {flights.map((flight, i) => (
        <div key={i}>{flight.airline}</div>
      ))}
    </div>
  );
}
```

## Testing Without API Key

The system automatically provides mock data when `SERPAPI_API_KEY` is not configured:

### Flight Mock Data
- 2 sample flights
- Realistic pricing ($299-$349)
- Proper time formatting
- Source marked as 'manual'

### Hotel Mock Data
- 3 sample hotels (Budget, Mid-range, Luxury)
- Price range: $80-$250/night
- Various amenities
- Realistic ratings and locations

## Airport Codes Reference

### Common Airport Codes
- **ICN** - Seoul Incheon (South Korea)
- **NRT** - Tokyo Narita (Japan)
- **JFK** - New York JFK (USA)
- **LAX** - Los Angeles (USA)
- **LHR** - London Heathrow (UK)
- **CDG** - Paris Charles de Gaulle (France)
- **SIN** - Singapore Changi (Singapore)
- **DXB** - Dubai International (UAE)

Find more codes: https://www.iata.org/en/publications/directories/code-search/

## Component Features

### TravelSearchPanel
- ✅ Tab navigation (Flights/Hotels)
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design
- ✅ Mock data support

### FlightCard
- ✅ Airline and flight number
- ✅ Departure/arrival times and airports
- ✅ Flight duration
- ✅ Price display
- ✅ Booking link
- ✅ Verification badge
- ✅ Hover effects

### HotelCard
- ✅ Hotel name and star rating
- ✅ Guest rating
- ✅ Address with map pin
- ✅ Amenity badges with icons
- ✅ Hotel image (optional)
- ✅ Price per night
- ✅ Booking link
- ✅ Verification badge

## Customization

### Custom Booking Handler
```typescript
<FlightCard
  flight={flight}
  onBook={() => {
    // Custom booking logic
    console.log('Booking flight:', flight.flightNumber);
  }}
/>
```

### Custom Styling
```typescript
<Card className="border-2 border-blue-500 shadow-xl">
  <FlightCard flight={flight} />
</Card>
```

## API Routes

### Flight Search
**Endpoint**: `GET /api/travel/flights`

**Query Parameters**:
- `departure` (required): Airport code
- `arrival` (required): Airport code
- `departureDate` (required): YYYY-MM-DD
- `returnDate` (optional): YYYY-MM-DD
- `adults` (optional): Number of passengers

**Example**:
```
/api/travel/flights?departure=ICN&arrival=NRT&departureDate=2024-03-20&adults=2
```

### Hotel Search
**Endpoint**: `GET /api/travel/hotels`

**Query Parameters**:
- `location` (required): City or location name
- `checkIn` (required): YYYY-MM-DD
- `checkOut` (required): YYYY-MM-DD
- `adults` (optional): Number of guests

**Example**:
```
/api/travel/hotels?location=Tokyo&checkIn=2024-03-20&checkOut=2024-03-25&adults=2
```

## Troubleshooting

### Issue: No results showing
**Solution**: Check browser console for errors. Verify API route is accessible.

### Issue: "Failed to search flights/hotels"
**Solutions**:
1. Verify `SERPAPI_API_KEY` is correct (if using real API)
2. Check SerpAPI quota hasn't been exceeded
3. Ensure date format is YYYY-MM-DD
4. Verify airport codes are valid IATA codes

### Issue: Type errors
**Solution**: Ensure you're importing types from `@/types/travel`

### Issue: Mock data not appearing
**Solution**: This is expected if `SERPAPI_API_KEY` is configured. Remove it to use mock data.

## Next Steps

1. **Add to Trip Planner**: Integrate TravelSearchPanel into main trip planning flow
2. **Enable Filtering**: Add price range, airline, or hotel rating filters
3. **Add Sorting**: Sort by price, duration, or rating
4. **Map Integration**: Show hotels on Google Maps
5. **Favorites**: Allow users to save favorite options
6. **Compare View**: Side-by-side comparison of flights or hotels

## File Locations

```
/src
├── components/travel/
│   ├── FlightCard.tsx           # Flight display component
│   ├── HotelCard.tsx            # Hotel display component
│   ├── TravelSearchPanel.tsx    # Main search panel
│   └── index.ts                 # Exports
├── hooks/
│   └── useTravelSearch.ts       # Search state hook
├── lib/travel/
│   └── serpApiService.ts        # SerpAPI integration
├── types/
│   └── travel.ts                # Type definitions
└── app/api/travel/
    ├── flights/route.ts         # Flight search API
    └── hotels/route.ts          # Hotel search API
```

## Support

- **SerpAPI Docs**: https://serpapi.com/docs
- **Component Issues**: Check implementation guide
- **Type Definitions**: See `/src/types/travel.ts`

## License

Part of the Trip Planner project.
