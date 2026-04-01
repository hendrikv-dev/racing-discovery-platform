import Link from "next/link";

export default function NotFound() {
  return (
    <div className="app-panel rounded-[28px] p-8 text-center">
      <p className="app-kicker">
        Off Line
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-50">Page not found</h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-300">
        The requested Racing Platform route is not on the current grid. Head back to the homepage and
        continue exploring.
      </p>
      <Link
        href="/"
        className="primary-action mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
      >
        Return Home
      </Link>
    </div>
  );
}
