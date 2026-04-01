export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/60 p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
      <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{description}</p>
    </div>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="surface-card rounded-2xl p-8">
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
    <div className="rounded-2xl border border-violet-400/25 bg-violet-500/10 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
      <h3 className="text-lg font-semibold text-violet-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-200">{description}</p>
    </div>
  );
}
