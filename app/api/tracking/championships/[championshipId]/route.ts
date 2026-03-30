import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ championshipId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { championshipId } = await params;

  await prisma.trackedChampionship.deleteMany({
    where: {
      userId: session.user.id,
      championshipId
    }
  });

  return NextResponse.json({ ok: true });
}
