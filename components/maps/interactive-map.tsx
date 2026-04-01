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
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-[24px] border border-white/10 bg-[#0F1118]/95 px-6 text-center text-sm text-zinc-300 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
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
