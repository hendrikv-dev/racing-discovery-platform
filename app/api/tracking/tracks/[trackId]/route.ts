import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ trackId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { trackId } = await params;

  await prisma.trackedTrack.deleteMany({
    where: {
      userId: session.user.id,
      trackId
    }
  });

  return NextResponse.json({ ok: true });
}
