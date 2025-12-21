import React from 'react';
import { Hotel, Star, MapPin, ExternalLink, CheckCircle, Wifi, Coffee, Dumbbell, Utensils } from 'lucide-react';
import { HotelInfo } from '@/types/travel';
import { Card } from '@/components/ui/Card';

export interface HotelCardProps {
  hotel: HotelInfo;
  onBook?: () => void;
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  breakfast: <Coffee className="w-4 h-4" />,
  gym: <Dumbbell className="w-4 h-4" />,
  restaurant: <Utensils className="w-4 h-4" />
};

const getAmenityIcon = (amenity: string): React.ReactNode => {
  const lowerAmenity = amenity.toLowerCase();
  for (const [key, icon] of Object.entries(amenityIcons)) {
    if (lowerAmenity.includes(key)) {
      return icon;
    }
  }
  return null;
};

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onBook }) => {
  const handleBooking = () => {
    if (onBook) {
      onBook();
    } else if (hotel.bookingUrl !== '#') {
      window.open(hotel.bookingUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="hover:border-blue-500/50 border border-transparent transition-colors">
      <div className="space-y-4">
        {/* Image */}
        {hotel.imageUrl && (
          <div className="relative h-48 -mx-6 -mt-6 mb-4 rounded-t-xl overflow-hidden">
            <img
              src={hotel.imageUrl}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            {hotel.verified && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-green-500/90 rounded-full">
                <CheckCircle className="w-3 h-3 text-white" />
                <span className="text-xs text-white font-medium">Verified</span>
              </div>
            )}
          </div>
        )}

        {/* Header: Hotel Name and Stars */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Hotel className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-100 leading-tight">
                {hotel.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {/* Star Rating */}
                {hotel.stars > 0 && (
                  <div className="flex items-center gap-1">
                    {[...Array(hotel.stars)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                )}
                {/* Guest Rating */}
                {hotel.rating > 0 && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="text-sm font-medium">{hotel.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {!hotel.imageUrl && hotel.verified && (
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs">Verified</span>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-slate-400">{hotel.address}</p>
        </div>

        {/* Amenities */}
        {hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 6).map((amenity, index) => {
              const icon = getAmenityIcon(amenity);
              return (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 rounded-full"
                >
                  {icon && <span className="text-slate-400">{icon}</span>}
                  <span className="text-xs text-slate-300">{amenity}</span>
                </div>
              );
            })}
            {hotel.amenities.length > 6 && (
              <div className="flex items-center px-3 py-1.5 bg-slate-700/50 rounded-full">
                <span className="text-xs text-slate-300">
                  +{hotel.amenities.length - 6} more
                </span>
              </div>
            )}
          </div>
        )}

        {/* Price and Booking */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <div>
            <p className="text-xs text-slate-400">Price per night</p>
            <p className="text-2xl font-bold text-blue-400">
              {hotel.pricePerNight.currency} {hotel.pricePerNight.amount.toLocaleString()}
            </p>
          </div>
          {hotel.bookingUrl !== '#' && (
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
            Source: {hotel.source === 'serpapi' ? 'SerpAPI' : 'Manual'}
          </span>
        </div>
      </div>
    </Card>
  );
};
