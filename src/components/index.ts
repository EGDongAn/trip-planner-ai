// Trip components
export { TripInputForm } from './trip/TripInputForm';
export { DestinationSelector } from './trip/DestinationSelector';
export { PlanSelector } from './trip/PlanSelector';
export { TimelineDisplay } from './trip/TimelineDisplay';
export { TimelineRow } from './trip/TimelineRow';

// Chat components
export { ChatContainer } from './chat/ChatContainer';
export { ChatMessage } from './chat/ChatMessage';
export { ChatInput } from './chat/ChatInput';
export { SuggestionChips } from './chat/SuggestionChips';

// Map components
export { TripMap } from './map/TripMap';
export { MapMarker } from './map/MapMarker';

// Travel components
export { FlightCard } from './travel/FlightCard';
export { HotelCard } from './travel/HotelCard';
export { TravelSearchPanel } from './travel/TravelSearchPanel';

// UI components
export { Button } from './ui/Button';
export { Card } from './ui/Card';
export { Input } from './ui/Input';
export { Spinner } from './ui/Spinner';

// Export types
export type { TripInputFormProps, TripFormData } from './trip/TripInputForm';
export type { Destination } from './trip/DestinationSelector';
export type { TripPlan, PlanSelectorProps } from './trip/PlanSelector';
export type { DaySchedule, TimelineDisplayProps } from './trip/TimelineDisplay';
export type { TimelineItem, TimelineRowProps } from './trip/TimelineRow';
export type { FlightCardProps } from './travel/FlightCard';
export type { HotelCardProps } from './travel/HotelCard';
