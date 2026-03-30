import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getChampionshipBySlug } from "@/lib/discovery";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await auth();
  const championship = await getChampionshipBySlug(slug, session?.user?.id);

  if (!championship) {
    return NextResponse.json({ error: "Championship not found." }, { status: 404 });
  }

  return NextResponse.json(championship);
}
