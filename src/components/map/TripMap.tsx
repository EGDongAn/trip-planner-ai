"use client";

import { useCallback, useState, useMemo } from "react";
import { GoogleMap, Polyline } from "@react-google-maps/api";
import { TimelineRow } from "@/types/trip";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { MapMarker } from "./MapMarker";

interface TripMapProps {
  timeline: TimelineRow[];
  center?: { lat: number; lng: number };
}

const defaultMapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "400px",
};

const defaultMapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  clickableIcons: true,
  scrollwheel: true,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: true,
};

export function TripMap({ timeline, center }: TripMapProps) {
  const { isLoaded, loadError } = useGoogleMaps();
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Filter timeline items with coordinates
  const timelineWithCoords = useMemo(
    () => timeline.filter((row) => row.coordinates),
    [timeline]
  );

  // Calculate center if not provided
  const mapCenter = useMemo(() => {
    if (center) return center;
    if (timelineWithCoords.length === 0) {
      return { lat: 0, lng: 0 };
    }

    const avgLat =
      timelineWithCoords.reduce((sum, row) => sum + (row.coordinates?.lat || 0), 0) /
      timelineWithCoords.length;
    const avgLng =
      timelineWithCoords.reduce((sum, row) => sum + (row.coordinates?.lng || 0), 0) /
      timelineWithCoords.length;

    return { lat: avgLat, lng: avgLng };
  }, [center, timelineWithCoords]);

  // Create path for polyline
  const path = useMemo(
    () => timelineWithCoords.map((row) => row.coordinates!),
    [timelineWithCoords]
  );

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);

    // Fit bounds to show all markers
    if (timelineWithCoords.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      timelineWithCoords.forEach((row) => {
        if (row.coordinates) {
          bounds.extend(row.coordinates);
        }
      });
      map.fitBounds(bounds);
    }
  }, [timelineWithCoords]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center text-red-600">
          <p className="font-semibold">Error loading maps</p>
          <p className="text-sm">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center text-gray-600">
          <p className="font-semibold">Loading map...</p>
        </div>
      </div>
    );
  }

  if (timelineWithCoords.length === 0) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center text-gray-600">
          <p className="font-semibold">No locations to display</p>
          <p className="text-sm">Timeline items need coordinates to show on the map</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={defaultMapContainerStyle}
      center={mapCenter}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={defaultMapOptions}
    >
      {/* Draw path connecting locations */}
      {path.length > 1 && (
        <Polyline
          path={path}
          options={{
            strokeColor: "#3B82F6",
            strokeOpacity: 0.6,
            strokeWeight: 3,
            geodesic: true,
          }}
        />
      )}

      {/* Render markers */}
      {timelineWithCoords.map((row) => (
        <MapMarker
          key={row.id}
          row={row}
          isSelected={selectedMarkerId === row.id}
          onClick={() => setSelectedMarkerId(row.id)}
          onClose={() => setSelectedMarkerId(null)}
        />
      ))}
    </GoogleMap>
  );
}
