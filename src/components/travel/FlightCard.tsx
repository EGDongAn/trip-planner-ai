import React from 'react';
import { Plane, Clock, ExternalLink, CheckCircle } from 'lucide-react';
import { FlightInfo } from '@/types/travel';
import { Card } from '@/components/ui/Card';

export interface FlightCardProps {
  flight: FlightInfo;
  onBook?: () => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, onBook }) => {
  const handleBooking = () => {
    if (onBook) {
      onBook();
    } else if (flight.bookingUrl !== '#') {
      window.open(flight.bookingUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="hover:border-blue-500/50 border border-transparent transition-colors">
      <div className="space-y-4">
        {/* Header: Airline and Flight Number */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Plane className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                {flight.airline}
              </h3>
              <p className="text-sm text-slate-400">
                Flight {flight.flightNumber}
              </p>
            </div>
          </div>
          {flight.verified && (
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs">Verified</span>
            </div>
          )}
        </div>

        {/* Flight Route and Times */}
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Departure */}
          <div className="text-left">
            <p className="text-2xl font-bold text-slate-100">
              {flight.departure.time}
            </p>
            <p className="text-sm text-slate-300 font-medium">
              {flight.departure.airport}
            </p>
            <p className="text-xs text-slate-500">
              {new Date(flight.departure.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Duration */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="h-px bg-slate-600 flex-1"></div>
              <Clock className="w-4 h-4 text-slate-400" />
              <div className="h-px bg-slate-600 flex-1"></div>
            </div>
            <p className="text-sm text-slate-400">{flight.duration}</p>
          </div>

          {/* Arrival */}
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-100">
              {flight.arrival.time}
            </p>
            <p className="text-sm text-slate-300 font-medium">
              {flight.arrival.airport}
            </p>
            <p className="text-xs text-slate-500">
              {new Date(flight.arrival.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Price and Booking */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <div>
            <p className="text-xs text-slate-400">Price per person</p>
            <p className="text-2xl font-bold text-blue-400">
              {flight.price.currency} {flight.price.amount.toLocaleString()}
            </p>
          </div>
          {flight.bookingUrl !== '#' && (
            <button
              onClick={handleBooking}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Book Now
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Source Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Source: {flight.source === 'serpapi' ? 'SerpAPI' : 'Manual'}
          </span>
        </div>
      </div>
    </Card>
  );
};
