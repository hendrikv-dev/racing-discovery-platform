import Link from "next/link";

const links = [
  { href: "/my-tracking", label: "Overview" },
  { href: "/my-tracking/races", label: "Races" },
  { href: "/my-tracking/championships", label: "Championships" },
  { href: "/my-tracking/racers", label: "Racers" },
  { href: "/my-tracking/tracks", label: "Tracks" }
];

export function MyTrackingNav({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F] ${
            pathname === link.href
              ? "border-violet-500 bg-violet-600 text-white"
              : "border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/90 hover:text-white"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
