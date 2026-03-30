"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { SearchTypeahead } from "@/components/search/search-typeahead";
import { isAdminEmail } from "@/lib/admin-config";

const defaultNavigation = [
  { href: "/", label: "Home" },
  { href: "/races", label: "Races" },
  { href: "/championships", label: "Championships" },
  { href: "/search", label: "Search" },
  { href: "/my-tracking", label: "My Tracking" },
  { href: "/submit-race", label: "Submit Race" }
];

const comingSoonNavigation = [{ label: "Coming Soon", static: true }];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isComingSoon = pathname === "/coming-soon";
  const isAuthenticated = status === "authenticated" && Boolean(session?.user);
  const navigation = isComingSoon
    ? comingSoonNavigation
    : defaultNavigation.filter((item) => item.href !== "/my-tracking" || isAuthenticated);

  return (
    <header className="glass-border sticky top-4 z-50 mb-8 rounded-[20px] bg-white/80 px-5 py-4 shadow-panel backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link
          href={isComingSoon ? "/coming-soon" : "/"}
          className="flex shrink-0 items-center gap-3 self-start"
        >
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

        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
          {isComingSoon ? null : (
            <div className="min-w-0 w-full md:w-auto md:min-w-[220px] md:max-w-[280px]">
              <SearchTypeahead />
            </div>
          )}
          <nav className="flex flex-wrap items-center gap-2 text-sm text-apex-muted">
            {navigation.map((item) => (
              "href" in item ? (
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
              ) : (
                <span
                  key={item.label}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-apex-muted"
                >
                  {item.label}
                </span>
              )
            ))}
          </nav>

          {isComingSoon ? null : isAuthenticated && session?.user ? (
            <div className="flex flex-wrap items-center gap-2">
              {isAdminEmail(session.user.email) ? (
                <Link
                  href="/admin"
                  className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-apex-blue transition duration-200 hover:-translate-y-0.5"
                >
                  Admin
                </Link>
              ) : null}
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-apex-slate">
                {session.user.name ?? session.user.email}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-apex-blue"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <nav className="flex flex-wrap items-center gap-2 text-sm text-apex-muted">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-900 hover:text-white"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-apex-blue"
              >
                Sign Up
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
