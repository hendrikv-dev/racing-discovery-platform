import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { racerId?: string };

  if (!body.racerId) {
    return NextResponse.json({ error: "racerId is required." }, { status: 400 });
  }

  await prisma.trackedRacer.upsert({
    where: {
      userId_racerId: {
        userId: session.user.id,
        racerId: body.racerId
      }
    },
    update: {},
    create: {
      userId: session.user.id,
      racerId: body.racerId
    }
  });

  return NextResponse.json({ ok: true });
}
