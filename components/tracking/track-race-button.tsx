"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";

export function TrackRaceButton({
  raceId,
  initialTracked
}: {
  raceId: string;
  initialTracked: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [tracked, setTracked] = useState(initialTracked);
  const [isPending, startTransition] = useTransition();

  function getCallbackUrl() {
    const search = searchParams.toString();
    return search ? `${pathname}?${search}` : pathname;
  }

  function handleClick() {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(getCallbackUrl())}`);
      return;
    }

    startTransition(async () => {
      const response = await fetch(
        tracked ? `/api/tracking/races/${raceId}` : "/api/tracking/races",
        tracked
          ? { method: "DELETE" }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ raceId })
            }
      );

      if (response.ok) {
        setTracked((current) => !current);
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${
        tracked
          ? "bg-slate-900 text-white hover:bg-apex-blue"
          : "bg-white text-apex-slate ring-1 ring-slate-200 hover:-translate-y-0.5"
      } disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {isPending ? "Saving..." : tracked ? "Tracked" : "Track Race"}
    </button>
  );
}
