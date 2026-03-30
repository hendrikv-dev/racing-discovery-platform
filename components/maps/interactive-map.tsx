"use client";

import { LatLngBoundsExpression } from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";

export type InteractiveMapPoint = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle: string;
  meta?: string;
};

function FitBounds({
  bounds,
  selectedPoint
}: {
  bounds: LatLngBoundsExpression | null;
  selectedPoint?: InteractiveMapPoint | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedPoint) {
      map.setView([selectedPoint.lat, selectedPoint.lng], Math.max(map.getZoom(), 5), {
        animate: true
      });
      return;
    }

    if (bounds) {
      map.fitBounds(bounds, {
        padding: [32, 32]
      });
    }
  }, [bounds, map, selectedPoint]);

  return null;
}

export function InteractiveMap({
  points,
  selectedId,
  onSelect,
  className = "h-[420px]"
}: {
  points: InteractiveMapPoint[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const selectedPoint = points.find((point) => point.id === selectedId) ?? null;

  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (points.length === 0) {
      return null;
    }

    return points.map((point) => [point.lat, point.lng]) as LatLngBoundsExpression;
  }, [points]);

  return (
    <div className={`overflow-hidden rounded-[24px] ${className}`}>
      <MapContainer
        center={selectedPoint ? [selectedPoint.lat, selectedPoint.lng] : [20, 0]}
        zoom={selectedPoint ? 6 : 2}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds bounds={bounds} selectedPoint={selectedPoint} />
        {points.map((point) => {
          const selected = point.id === selectedId;

          return (
            <CircleMarker
              key={point.id}
              center={[point.lat, point.lng]}
              radius={selected ? 10 : 7}
              pathOptions={{
                color: selected ? "#bfdbfe" : "#60a5fa",
                fillColor: selected ? "#2563eb" : "#1d4ed8",
                fillOpacity: 0.9,
                weight: selected ? 4 : 2
              }}
              eventHandlers={{
                click: () => onSelect?.(point.id)
              }}
            >
              <Popup>
                <div className="min-w-[180px] text-slate-900">
                  <p className="font-semibold">{point.title}</p>
                  <p className="mt-1 text-sm">{point.subtitle}</p>
                  {point.meta ? <p className="mt-2 text-xs uppercase tracking-[0.16em] text-blue-700">{point.meta}</p> : null}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
