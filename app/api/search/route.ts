import { NextResponse } from "next/server";
import { getSearchParams, searchDiscovery } from "@/lib/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const results = await searchDiscovery(
    getSearchParams({
      q: searchParams.get("q") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      championship: searchParams.get("championship") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      start: searchParams.get("start") ?? undefined,
      end: searchParams.get("end") ?? undefined,
      limit: searchParams.get("limit") ?? undefined
    })
  );

  return NextResponse.json(results);
}
