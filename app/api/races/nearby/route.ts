import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRaces } from "@/lib/discovery";

export async function GET(request: Request) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const limit = Math.min(Number(searchParams.get("limit") ?? "3") || 3, 6);

  if (!lat || !lng) {
    return NextResponse.json({ races: [] });
  }

  const races = await getRaces(
    {
      status: "UPCOMING",
      sort: "nearest",
      lat,
      lng
    },
    session?.user?.id
  );

  return NextResponse.json({ races: races.slice(0, limit) });
}
