"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const defaultNavigation = [
  { href: "/", label: "Home" },
  { href: "/races", label: "Races" },
  { href: "/search", label: "Search" },
  { href: "/submit-race", label: "Submit Race" }
];

const comingSoonNavigation = [
  { href: "/coming-soon", label: "Coming Soon" },
  { href: "/coming-soon#waitlist", label: "Join Waitlist", primary: true }
];

export function SiteHeader() {
  const pathname = usePathname();
  const isComingSoon = pathname === "/coming-soon";
  const navigation = isComingSoon ? comingSoonNavigation : defaultNavigation;

  return (
    <header className="glass-border sticky top-4 z-50 mb-8 rounded-[20px] bg-white/80 px-5 py-4 shadow-panel backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href={isComingSoon ? "/coming-soon" : "/"} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-apex-slate text-sm font-semibold uppercase tracking-[0.3em] text-white">
            RP
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-apex-muted">
              Racing Platform
            </p>
            <p className="text-lg font-bold text-apex-slate">
              {isComingSoon ? "Launching Soon" : "Racing Platform"}
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm text-apex-muted">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 transition duration-200 hover:-translate-y-0.5 ${
                "primary" in item && item.primary
                  ? "bg-slate-900 font-semibold text-white hover:bg-apex-blue"
                  : "hover:bg-slate-900 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
