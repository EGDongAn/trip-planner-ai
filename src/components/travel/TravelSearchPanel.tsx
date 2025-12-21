import React, { useState } from 'react';
import { Plane, Hotel, Search, Calendar, Users, MapPin, Loader2 } from 'lucide-react';
import { useTravelSearch } from '@/hooks/useTravelSearch';
import { FlightCard } from './FlightCard';
import { HotelCard } from './HotelCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type SearchTab = 'flights' | 'hotels';

export const TravelSearchPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SearchTab>('flights');
  const {
    flights,
    hotels,
    isLoading,
    error,
    searchFlights,
    searchHotels,
    clearFlights,
    clearHotels
  } = useTravelSearch();

  // Flight form state
  const [flightForm, setFlightForm] = useState({
    departure: '',
    arrival: '',
    departureDate: '',
    returnDate: '',
    adults: 1
  });

  // Hotel form state
  const [hotelForm, setHotelForm] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    adults: 1
  });

  const handleFlightSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchFlights({
      departure: flightForm.departure,
      arrival: flightForm.arrival,
      departureDate: flightForm.departureDate,
      returnDate: flightForm.returnDate || undefined,
      adults: flightForm.adults
    });
  };

  const handleHotelSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchHotels({
      location: hotelForm.location,
      checkIn: hotelForm.checkIn,
      checkOut: hotelForm.checkOut,
      adults: hotelForm.adults
    });
  };

  const handleTabChange = (tab: SearchTab) => {
    setActiveTab(tab);
    if (tab === 'flights') {
      clearHotels();
    } else {
      clearFlights();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4">
        <button
          onClick={() => handleTabChange('flights')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'flights'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Plane className="w-5 h-5" />
          Flights
        </button>
        <button
          onClick={() => handleTabChange('hotels')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'hotels'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Hotel className="w-5 h-5" />
          Hotels
        </button>
      </div>

      {/* Search Forms */}
      <Card>
        {activeTab === 'flights' ? (
          // Flight Search Form
          <form onSubmit={handleFlightSearch} className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">
              Search Flights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Departure Airport (Code)"
                placeholder="e.g., ICN, JFK"
                value={flightForm.departure}
                onChange={(e) =>
                  setFlightForm({ ...flightForm, departure: e.target.value.toUpperCase() })
                }
                required
              />
              <Input
                label="Arrival Airport (Code)"
                placeholder="e.g., NRT, LAX"
                value={flightForm.arrival}
                onChange={(e) =>
                  setFlightForm({ ...flightForm, arrival: e.target.value.toUpperCase() })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  label="Departure Date"
                  type="date"
                  value={flightForm.departureDate}
                  onChange={(e) =>
                    setFlightForm({ ...flightForm, departureDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Input
                  label="Return Date (Optional)"
                  type="date"
                  value={flightForm.returnDate}
                  onChange={(e) =>
                    setFlightForm({ ...flightForm, returnDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Adults
                </label>
                <select
                  value={flightForm.adults}
                  onChange={(e) =>
                    setFlightForm({ ...flightForm, adults: Number(e.target.value) })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Adult' : 'Adults'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search Flights
                </>
              )}
            </Button>
          </form>
        ) : (
          // Hotel Search Form
          <form onSubmit={handleHotelSearch} className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">
              Search Hotels
            </h3>

            <div>
              <Input
                label="Location"
                placeholder="e.g., Tokyo, Paris, New York"
                value={hotelForm.location}
                onChange={(e) =>
                  setHotelForm({ ...hotelForm, location: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  label="Check-in Date"
                  type="date"
                  value={hotelForm.checkIn}
                  onChange={(e) =>
                    setHotelForm({ ...hotelForm, checkIn: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Input
                  label="Check-out Date"
                  type="date"
                  value={hotelForm.checkOut}
                  onChange={(e) =>
                    setHotelForm({ ...hotelForm, checkOut: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Guests
                </label>
                <select
                  value={hotelForm.adults}
                  onChange={(e) =>
                    setHotelForm({ ...hotelForm, adults: Number(e.target.value) })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search Hotels
                </>
              )}
            </Button>
          </form>
        )}
      </Card>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {activeTab === 'flights' && flights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-100">
            Flight Results ({flights.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {flights.map((flight, index) => (
              <FlightCard key={index} flight={flight} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'hotels' && hotels.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-100">
            Hotel Results ({hotels.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotels.map((hotel, index) => (
              <HotelCard key={index} hotel={hotel} />
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {!isLoading &&
        !error &&
        ((activeTab === 'flights' && flights.length === 0) ||
          (activeTab === 'hotels' && hotels.length === 0)) && (
        <div className="text-center py-12">
          <div className="p-4 bg-slate-800/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            {activeTab === 'flights' ? (
              <Plane className="w-8 h-8 text-slate-400" />
            ) : (
              <Hotel className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <p className="text-slate-400">
            {activeTab === 'flights'
              ? 'No flights found. Try searching with different criteria.'
              : 'No hotels found. Try searching with different criteria.'}
          </p>
        </div>
      )}
    </div>
  );
};
