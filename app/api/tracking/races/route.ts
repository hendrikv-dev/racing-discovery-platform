import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { raceId?: string };

  if (!body.raceId) {
    return NextResponse.json({ error: "raceId is required." }, { status: 400 });
  }

  await prisma.trackedRace.upsert({
    where: {
      userId_raceId: {
        userId: session.user.id,
        raceId: body.raceId
      }
    },
    update: {},
    create: {
      userId: session.user.id,
      raceId: body.raceId
    }
  });

  return NextResponse.json({ ok: true });
}
