import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return Response.json({ message: "Email is required." }, { status: 400 });
    }

    if (!emailPattern.test(email)) {
      return Response.json({ message: "Enter a valid email address." }, { status: 400 });
    }

    await prisma.waitlistSubscriber.create({
      data: { email }
    });

    return Response.json({ message: "You're on the list." }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json({ message: "You're already on the list." }, { status: 409 });
    }

    return Response.json({ message: "Something went wrong. Try again." }, { status: 500 });
  }
}
