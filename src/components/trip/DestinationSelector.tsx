import React from 'react';
import { MapPin, DollarSign, Cloud } from 'lucide-react';
import { Card } from '../ui/Card';

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  bestFor: string[];
  estimatedBudget: string;
  climate: string;
  imageUrl?: string;
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
            <div className="mb-3">
              <h3 className="text-lg font-bold text-slate-100">
                {destination.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-slate-400 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{destination.country}</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <p className="text-sm text-slate-300 line-clamp-3">
                {destination.description}
              </p>

              <div>
                <h4 className="text-xs font-medium text-slate-400 mb-1">추천 포인트</h4>
                <div className="flex flex-wrap gap-1">
                  {destination.bestFor.slice(0, 4).map((tag, idx) => (
                    <span key={idx} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">
                    {destination.estimatedBudget}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Cloud className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">
                    {destination.climate}
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
