type MapMarkerCardProps = {
  title: string;
  subtitle: string;
  meta: string;
};

export function MapMarkerCard({ title, subtitle, meta }: MapMarkerCardProps) {
  return (
    <div className="min-w-[190px] rounded-[18px] border border-white/10 bg-[#10111A]/95 px-3 py-3 text-white shadow-lg">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-zinc-300">{subtitle}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-teal-300">{meta}</p>
    </div>
  );
}
