import { Marker, InfoWindow } from "@react-google-maps/api";
import { TimelineRow } from "@/types/trip";

interface MapMarkerProps {
  row: TimelineRow;
  isSelected: boolean;
  onClick: () => void;
  onClose: () => void;
}

const MARKER_COLORS: Record<TimelineRow["category"], string> = {
  transport: "#3B82F6", // blue
  activity: "#10B981", // green
  food: "#F59E0B", // orange
  accommodation: "#8B5CF6", // purple
  free: "#6B7280", // gray
};

export function MapMarker({ row, isSelected, onClick, onClose }: MapMarkerProps) {
  if (!row.coordinates) return null;

  const markerColor = MARKER_COLORS[row.category];

  return (
    <>
      <Marker
        position={row.coordinates}
        onClick={onClick}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
          scale: 8,
        }}
        title={row.activity}
      />
      {isSelected && (
        <InfoWindow position={row.coordinates} onCloseClick={onClose}>
          <div className="p-2 max-w-xs">
            <h3 className="font-semibold text-sm mb-1">{row.activity}</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Day {row.day}</span> • {row.date}
              </p>
              <p>{row.time}</p>
              <p>{row.location}</p>
              {row.duration && (
                <p className="text-gray-500">Duration: {row.duration}</p>
              )}
              {row.cost && (
                <p className="font-medium">
                  {row.cost.amount} {row.cost.currency}
                </p>
              )}
              {row.notes && <p className="text-gray-500 italic">{row.notes}</p>}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
