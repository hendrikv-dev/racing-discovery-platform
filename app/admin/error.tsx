"use client";

import { ErrorState } from "@/components/states";

export default function Error() {
  return <ErrorState title="Admin workflow unavailable" description="Something went wrong while loading or saving admin data." />;
}
