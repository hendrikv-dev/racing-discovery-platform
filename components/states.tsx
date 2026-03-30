export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="glass-border rounded-[24px] bg-white/80 p-8 text-center shadow-panel">
      <h3 className="text-xl font-bold text-apex-slate">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-apex-muted">{description}</p>
    </div>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="glass-border rounded-[24px] bg-white/80 p-8 shadow-panel">
      <div className="h-3 w-28 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-4 h-8 w-56 animate-pulse rounded-full bg-slate-200" />
      <p className="mt-5 text-sm text-apex-muted">{label}</p>
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
    <div className="glass-border rounded-[24px] bg-red-50 p-8 shadow-panel">
      <h3 className="text-xl font-bold text-red-800">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-red-700">{description}</p>
    </div>
  );
}
