export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="glass-border rounded-2xl border-dashed bg-zinc-900/50 p-8 text-center shadow-panel">
      <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{description}</p>
    </div>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="glass-border rounded-2xl bg-zinc-900/70 p-8 shadow-panel">
      <div className="h-3 w-28 animate-pulse rounded-full bg-zinc-700" />
      <div className="mt-4 h-8 w-56 animate-pulse rounded-full bg-zinc-800" />
      <p className="mt-5 text-sm text-zinc-300">{label}</p>
    </div>
  );
}

export function ErrorState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="glass-border rounded-2xl border-red-500/30 bg-red-500/10 p-8 shadow-panel">
      <h3 className="text-lg font-semibold text-red-200">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-red-100">{description}</p>
    </div>
  );
}
