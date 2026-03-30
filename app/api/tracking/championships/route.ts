import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { championshipId?: string };

  if (!body.championshipId) {
    return NextResponse.json({ error: "championshipId is required." }, { status: 400 });
  }

  await prisma.trackedChampionship.upsert({
    where: {
      userId_championshipId: {
        userId: session.user.id,
        championshipId: body.championshipId
      }
    },
    update: {},
    create: {
      userId: session.user.id,
      championshipId: body.championshipId
    }
  });

  return NextResponse.json({ ok: true });
}
