import Link from "next/link";

export default function NotFound() {
  return (
    <div className="glass-border rounded-[28px] bg-white/85 p-8 text-center shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-apex-muted">
        Off Line
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-apex-slate">Page not found</h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-apex-muted">
        The requested Racing Platform route is not on the current grid. Head back to the homepage and
        continue exploring.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5"
      >
        Return Home
      </Link>
    </div>
  );
}
