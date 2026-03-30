import Link from "next/link";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/championships", label: "Championships" },
  { href: "/admin/races", label: "Races" },
  { href: "/admin/racers", label: "Racers" },
  { href: "/admin/tracks", label: "Tracks" },
  { href: "/admin/submissions", label: "Submissions" }
];

export function AdminNav({ pathname }: { pathname: string }) {
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
