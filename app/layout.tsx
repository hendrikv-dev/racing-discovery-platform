import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/auth";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { SiteHeader } from "@/components/site-header";

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

  return (
    <html lang="en">
      <body className="apex-shell antialiased">
        <AuthSessionProvider session={session}>
          <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-8">
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </div>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
