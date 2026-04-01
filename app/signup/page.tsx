import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/my-tracking");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="surface-card-strong rounded-[28px] p-6 text-white">
        <p className="app-kicker">
          Join The Grid
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Create your Racing Platform account</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-300">
          Build your personal motorsports dashboard with tracked races, followed series, favorite
          racers, and saved tracks.
        </p>
      </section>

      <section className="app-panel rounded-[28px] p-6">
        <p className="app-kicker">Sign Up</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50">
          Start tracking what matters
        </h2>
        <p className="mt-3 text-sm leading-7 text-zinc-300">
          Create an account to follow championships, save upcoming races, and keep your own racing
          watchlist.
        </p>
        <div className="mt-6">
          <SignupForm />
        </div>
      </section>
    </div>
  );
}
