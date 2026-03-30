"use client";

import { ErrorState } from "@/components/states";

export default function Error() {
  return <ErrorState title="Track view unavailable" description="Something went wrong while loading track details or map data." />;
}
