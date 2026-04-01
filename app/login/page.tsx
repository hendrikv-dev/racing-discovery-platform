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
      <section className="surface-card-strong rounded-[28px] p-6 text-white">
        <p className="app-kicker">
          Member Access
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Sign in to your racing profile</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-300">
          Access tracked races, followed championships, saved circuits, and a personalized
          discovery dashboard.
        </p>
      </section>

      <section className="app-panel rounded-[28px] p-6">
        <p className="app-kicker">Log In</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50">
          Welcome back
        </h2>
        <p className="mt-3 text-sm leading-7 text-zinc-300">
          Sign in with your email and password to continue where you left off.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </section>
    </div>
  );
}
