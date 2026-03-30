"use client";

import { InteractiveMap, InteractiveMapPoint } from "@/components/maps/interactive-map";

export function MiniMap({
  point,
  className = "h-[240px]"
}: {
  point: InteractiveMapPoint;
  className?: string;
}) {
  return (
    <InteractiveMap
      points={[point]}
      selectedId={point.id}
      className={className}
    />
  );
}
