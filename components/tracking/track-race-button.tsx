"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useToast } from "@/components/feedback/toast-provider";

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
  const { showToast } = useToast();
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
        showToast(tracked ? "Race removed from your tracking" : "Race added to your tracking");
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F] ${
        tracked
          ? "border border-violet-500 bg-violet-600 text-white"
          : "border border-zinc-800 bg-zinc-900/80 text-zinc-100 hover:border-zinc-700 hover:bg-zinc-800/90"
      } disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {isPending ? "Saving..." : tracked ? "Tracked" : "Track Race"}
    </button>
  );
}
