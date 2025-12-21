import React from 'react';
import { DollarSign, Zap, Heart } from 'lucide-react';
import { Card } from '../ui/Card';

export interface TripPlan {
  id: string;
  label: 'A' | 'B' | 'C';
  name: string;
  description: string;
  pace: 'relaxed' | 'moderate' | 'active';
  highlights: string[];
  estimatedCost: {
    total: number;
    currency: string;
  };
}

export interface PlanSelectorProps {
  plans: TripPlan[];
  selectedId?: string;
  onSelect: (plan: TripPlan) => void;
}

const paceConfig = {
  relaxed: { label: '여유로운', icon: Heart, color: 'text-green-400 bg-green-500/20' },
  moderate: { label: '적당한', icon: Zap, color: 'text-blue-400 bg-blue-500/20' },
  active: { label: '활동적인', icon: Zap, color: 'text-orange-400 bg-orange-500/20' }
};

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  plans,
  selectedId,
  onSelect
}) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">
        여행 플랜 선택
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const paceInfo = paceConfig[plan.pace];
          const PaceIcon = paceInfo.icon;

          return (
            <Card
              key={plan.id}
              selected={selectedId === plan.id}
              onClick={() => onSelect(plan)}
              className="flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl font-bold">
                    {plan.label}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">
                      {plan.name}
                    </h3>
                    <div className={`flex items-center gap-1 mt-1 text-xs font-medium px-2 py-1 rounded ${paceInfo.color}`}>
                      <PaceIcon className="w-3 h-3" />
                      <span>{paceInfo.label}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-400 mb-4">
                {plan.description}
              </p>

              <div className="flex-1">
                <h4 className="text-xs font-medium text-slate-400 mb-2">주요 특징</h4>
                <ul className="space-y-2">
                  {plan.highlights.map((highlight, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">예상 비용</span>
                  <div className="flex items-center gap-1 text-lg font-bold text-slate-100">
                    <DollarSign className="w-5 h-5" />
                    <span>{plan.estimatedCost.total.toLocaleString()} {plan.estimatedCost.currency}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
