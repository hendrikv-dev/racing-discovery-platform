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
    <header className="glass-border sticky top-4 z-50 mb-8 rounded-2xl bg-[#10111A]/92 px-5 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.34)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link
          href={isComingSoon ? "/coming-soon" : "/"}
          className="flex shrink-0 items-center gap-3 self-start"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_0_24px_rgba(124,58,237,0.28)]">
            RP
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Racing Platform
            </p>
            <p className="text-lg font-semibold text-zinc-50">
              {isComingSoon ? "Launching Soon" : "Racing Platform"}
            </p>
          </div>
        </Link>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
          {isComingSoon ? null : (
            <div className="min-w-0 w-full md:w-auto md:min-w-[240px] md:max-w-[320px]">
              <SearchTypeahead />
            </div>
          )}
          <nav className="flex flex-wrap items-center gap-2 text-sm text-zinc-300">
            {navigation.map((item) => (
              "href" in item ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl border px-4 py-2 transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F] ${
                    pathname === item.href
                      ? "border-violet-500 bg-violet-600 text-white shadow-[0_0_18px_rgba(124,58,237,0.24)]"
                      : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.label}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400"
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
                  className="secondary-action rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
                >
                  Admin
                </Link>
              ) : null}
              <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100">
                {session.user.name ?? session.user.email}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="primary-action inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <nav className="flex flex-wrap items-center gap-2 text-sm text-zinc-300">
              <Link
                href="/login"
                className="secondary-action inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="primary-action inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
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
