import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/my-tracking");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="glass-border rounded-[28px] bg-slate-950 p-6 text-white shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
          Member Access
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Sign in to your racing profile</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Access tracked races, followed championships, saved circuits, and a personalized
          discovery dashboard.
        </p>
      </section>

      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-apex-muted">Log In</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-apex-slate">
          Welcome back
        </h2>
        <p className="mt-3 text-sm leading-7 text-apex-muted">
          Sign in with your email and password to continue where you left off.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </section>
    </div>
  );
}
