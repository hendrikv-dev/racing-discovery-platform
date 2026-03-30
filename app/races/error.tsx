"use client";

import { ErrorState } from "@/components/states";

export default function Error() {
  return <ErrorState title="Race view unavailable" description="Something went wrong while loading race filters or views." />;
}
