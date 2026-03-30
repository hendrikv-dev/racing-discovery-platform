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
      <section className="glass-border rounded-[28px] bg-slate-950 p-6 text-white shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
          Join The Grid
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Create your Racing Platform account</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Build your personal motorsports dashboard with tracked races, followed series, favorite
          racers, and saved tracks.
        </p>
      </section>

      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-apex-muted">Sign Up</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-apex-slate">
          Start tracking what matters
        </h2>
        <p className="mt-3 text-sm leading-7 text-apex-muted">
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
