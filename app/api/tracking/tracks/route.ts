import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { trackId?: string };

  if (!body.trackId) {
    return NextResponse.json({ error: "trackId is required." }, { status: 400 });
  }

  await prisma.trackedTrack.upsert({
    where: {
      userId_trackId: {
        userId: session.user.id,
        trackId: body.trackId
      }
    },
    update: {},
    create: {
      userId: session.user.id,
      trackId: body.trackId
    }
  });

  return NextResponse.json({ ok: true });
}
