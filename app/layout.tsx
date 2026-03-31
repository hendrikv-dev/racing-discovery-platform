import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { auth } from "@/auth";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { ToastProvider } from "@/components/feedback/toast-provider";
import { SiteHeader } from "@/components/site-header";
import { getBuildInfo } from "@/lib/build-info";

export const metadata: Metadata = {
  title: "Racing Platform",
  description: "Premium motorsports discovery platform for races, racers, and tracks."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();
  const buildInfo = getBuildInfo();
  const buildLabel = buildInfo.commit ? `Build ${buildInfo.commit}` : "Build local";
  const detailParts = [buildInfo.branch, buildInfo.context].filter(Boolean);

  return (
    <html lang="en">
      <body className="apex-shell antialiased">
        <AuthSessionProvider session={session}>
          <ToastProvider>
            <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-8">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <footer className="mt-10 border-t border-white/10 pt-5 text-xs text-zinc-400">
                <p aria-label={`Build marker: ${buildLabel}`}>
                  {buildLabel}
                  {detailParts.length > 0 ? ` • ${detailParts.join(" • ")}` : ""}
                </p>
              </footer>
            </div>
          </ToastProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
