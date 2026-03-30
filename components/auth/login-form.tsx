"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState, useTransition } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/my-tracking";
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setError(null);

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl
      });

      if (!result || result.error) {
        setError("Email or password was incorrect.");
        return;
      }

      router.push(result.url ?? callbackUrl);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-apex-slate">Email</span>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
          placeholder="you@example.com"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-apex-slate">Password</span>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
          placeholder="Enter your password"
        />
      </label>

      {error ? (
        <div className="rounded-[18px] bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Signing In..." : "Sign In"}
      </button>

      <p className="text-sm text-apex-muted">
        New here?{" "}
        <Link href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-apex-blue">
          Create an account
        </Link>
      </p>
    </form>
  );
}
