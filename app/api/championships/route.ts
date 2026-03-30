import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getChampionships } from "@/lib/discovery";

export async function GET() {
  const session = await auth();
  const championships = await getChampionships(session?.user?.id);
  return NextResponse.json(championships);
}
