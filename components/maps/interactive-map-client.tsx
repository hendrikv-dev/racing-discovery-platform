"use client";

import { useEffect, useMemo } from "react";
import { LatLngBoundsExpression } from "leaflet";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import { InteractiveMapPoint } from "@/components/maps/interactive-map";

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

export function InteractiveMapClient({
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
    <div className={`map-frame ${className}`}>
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
                color: selected ? "#c4b5fd" : "#99f6e4",
                fillColor: selected ? "#7C3AED" : "#14B8A6",
                fillOpacity: 0.95,
                weight: selected ? 4 : 2
              }}
              eventHandlers={{
                click: () => onSelect?.(point.id)
              }}
            >
              <Popup>
                <div className="min-w-[180px] text-white">
                  <p className="font-semibold">{point.title}</p>
                  <p className="mt-1 text-sm text-zinc-300">{point.subtitle}</p>
                  {point.meta ? (
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-teal-300">
                      {point.meta}
                    </p>
                  ) : null}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
