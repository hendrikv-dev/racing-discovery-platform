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
          className={`rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
            pathname === link.href
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-apex-slate hover:-translate-y-0.5"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
