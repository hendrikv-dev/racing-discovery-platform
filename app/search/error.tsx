"use client";

import { ErrorState } from "@/components/states";

export default function Error() {
  return (
    <ErrorState
      title="Search unavailable"
      description="Something went wrong while loading search results."
    />
  );
}
