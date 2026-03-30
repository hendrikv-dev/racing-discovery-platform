import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ racerId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { racerId } = await params;

  await prisma.trackedRacer.deleteMany({
    where: {
      userId: session.user.id,
      racerId
    }
  });

  return NextResponse.json({ ok: true });
}
