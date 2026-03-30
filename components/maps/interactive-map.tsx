"use client";

import dynamic from "next/dynamic";

export type InteractiveMapPoint = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle: string;
  meta?: string;
};

const InteractiveMapClient = dynamic(
  () =>
    import("@/components/maps/interactive-map-client").then((module) => module.InteractiveMapClient),
  {
    ssr: false,
    loading: () => (
      <div className="glass-border flex h-full min-h-[320px] items-center justify-center rounded-[24px] bg-slate-950/90 px-6 text-center text-sm text-slate-300">
        Loading map...
      </div>
    )
  }
);

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
  return (
    <InteractiveMapClient
      points={points}
      selectedId={selectedId}
      onSelect={onSelect}
      className={className}
    />
  );
}

