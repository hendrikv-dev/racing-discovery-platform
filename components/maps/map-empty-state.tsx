import { MapPinned } from "lucide-react";

export function MapEmptyState({
  title,
  description,
  note
}: {
  title: string;
  description: string;
  note?: string;
}) {
  return (
    <div className="glass-border rounded-[28px] bg-slate-950 p-8 text-white shadow-panel">
      <MapPinned className="h-6 w-6 text-blue-200" />
      <h3 className="mt-4 text-2xl font-bold">{title}</h3>
      <p className="mt-3 max-w-lg text-sm leading-7 text-slate-300">{description}</p>
      {note ? <p className="mt-4 text-xs uppercase tracking-[0.24em] text-blue-200">{note}</p> : null}
    </div>
  );
}
