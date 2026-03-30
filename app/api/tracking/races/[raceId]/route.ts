import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ raceId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { raceId } = await params;

  await prisma.trackedRace.deleteMany({
    where: {
      userId: session.user.id,
      raceId
    }
  });

  return NextResponse.json({ ok: true });
}
