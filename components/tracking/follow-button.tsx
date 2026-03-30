"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useToast } from "@/components/feedback/toast-provider";

type FollowEntity = "championships" | "racers" | "tracks";

export function FollowButton({
  entity,
  entityId,
  initialTracked,
  activeLabel,
  inactiveLabel
}: {
  entity: FollowEntity;
  entityId: string;
  initialTracked: boolean;
  activeLabel: string;
  inactiveLabel: string;
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
        tracked ? `/api/tracking/${entity}/${entityId}` : `/api/tracking/${entity}`,
        tracked
          ? { method: "DELETE" }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ [`${entity.slice(0, -1)}Id`]: entityId })
            }
      );

      if (response.ok) {
        setTracked((current) => !current);
        showToast(
          tracked ? `${activeLabel} removed` : `${inactiveLabel.replace(/^Follow /, "")} added to tracking`
        );
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
      {isPending ? "Saving..." : tracked ? activeLabel : inactiveLabel}
    </button>
  );
}
