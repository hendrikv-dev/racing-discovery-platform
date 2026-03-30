"use client";

import { ErrorState } from "@/components/states";

export default function Error() {
  return <ErrorState title="Tracking dashboard unavailable" description="Something went wrong while loading your saved races, racers, tracks, or championships." />;
}
