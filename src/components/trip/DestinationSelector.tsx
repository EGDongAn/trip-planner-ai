import React from 'react';
import { MapPin, DollarSign, Cloud, Star } from 'lucide-react';
import { Card } from '../ui/Card';

export interface Destination {
  id: string;
  name: string;
  country: string;
  highlights: string[];
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  };
  weather: {
    temperature: string;
    condition: string;
  };
  matchScore: number;
}

export interface DestinationSelectorProps {
  destinations: Destination[];
  selectedId?: string;
  onSelect: (destination: Destination) => void;
}

export const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  destinations,
  selectedId,
  onSelect
}) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">
        추천 여행지
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {destinations.map((destination) => (
          <Card
            key={destination.id}
            selected={selectedId === destination.id}
            onClick={() => onSelect(destination)}
            className="flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  {destination.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-slate-400 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{destination.country}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg text-xs font-medium">
                <Star className="w-3 h-3" />
                <span>{Math.round(destination.matchScore * 100)}%</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h4 className="text-xs font-medium text-slate-400 mb-1">하이라이트</h4>
                <ul className="space-y-1">
                  {destination.highlights.slice(0, 3).map((highlight, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-start gap-1">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">
                    {destination.estimatedCost.currency} {destination.estimatedCost.min.toLocaleString()} - {destination.estimatedCost.max.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Cloud className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">
                    {destination.weather.temperature} • {destination.weather.condition}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
