"use client";

import { ErrorState } from "@/components/states";

export default function Error() {
  return <ErrorState title="Admin tools unavailable" description="Something went wrong while loading or saving admin data." />;
}
