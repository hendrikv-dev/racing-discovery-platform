"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function FindNearYouButton({
  className = "",
  children
}: {
  className?: string;
  children?: ReactNode;
}) {
  const router = useRouter();

  function handleClick() {
    if (!navigator.geolocation) {
      router.push("/races?view=map&sort=nearest");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        router.push(`/races?view=map&sort=nearest&lat=${latitude}&lng=${longitude}`);
      },
      () => {
        router.push("/races?view=map&sort=nearest");
      },
      { enableHighAccuracy: false, timeout: 4000, maximumAge: 300000 }
    );
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children ?? "Find races near you"}
    </button>
  );
}
