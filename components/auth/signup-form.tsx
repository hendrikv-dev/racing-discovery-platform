"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState, useTransition } from "react";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/my-tracking";
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "Unable to create your account.");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl
      });

      if (!result || result.error) {
        setError("Your account was created, but automatic sign-in failed.");
        return;
      }

      router.push(result.url ?? callbackUrl);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="block">
        <span className="app-label">Name</span>
        <input
          name="name"
          required
          className="app-input"
          placeholder="Your name"
        />
      </label>

      <label className="block">
        <span className="app-label">Email</span>
        <input
          name="email"
          type="email"
          required
          className="app-input"
          placeholder="you@example.com"
        />
      </label>

      <label className="block">
        <span className="app-label">Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="app-input"
          placeholder="Create a password"
        />
      </label>

      {error ? (
        <div className="rounded-[18px] border border-violet-400/25 bg-violet-500/10 px-4 py-3 text-sm text-zinc-100">{error}</div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="primary-action rounded-xl px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
      >
        {isPending ? "Creating Account..." : "Create Account"}
      </button>

      <p className="text-sm text-zinc-300">
        Already have an account?{" "}
        <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-violet-300 underline-offset-4 hover:text-violet-200 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
