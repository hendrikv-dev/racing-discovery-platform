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
    <div className="surface-card-strong rounded-[28px] p-8 text-white">
      <MapPinned className="h-6 w-6 text-teal-300" />
      <h3 className="mt-4 text-2xl font-bold">{title}</h3>
      <p className="mt-3 max-w-lg text-sm leading-7 text-zinc-300">{description}</p>
      {note ? <p className="mt-4 text-xs uppercase tracking-[0.24em] text-violet-300">{note}</p> : null}
    </div>
  );
}
