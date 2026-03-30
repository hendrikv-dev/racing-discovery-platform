"use client";

import { useState } from "react";
import { Button, Input } from "@/components/coming-soon/form-primitives";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmissionState =
  | { kind: "idle"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function WaitlistForm({
  buttonLabel,
  compact = false
}: {
  buttonLabel: string;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<SubmissionState>({
    kind: "idle",
    message: ""
  });

  const emailError = !email ? "" : emailPattern.test(email) ? "" : "Enter a valid email address.";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setSubmission({ kind: "error", message: "Email is required." });
      return;
    }

    if (emailError) {
      setSubmission({ kind: "error", message: emailError });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setSubmission({
          kind: "error",
          message: payload.message ?? "Something went wrong. Try again."
        });
        return;
      }

      setSubmission({
        kind: "success",
        message: payload.message ?? "You're on the list."
      });
      setEmail("");
    } catch {
      setSubmission({
        kind: "error",
        message: "Something went wrong. Try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex ${compact ? "flex-col gap-3 sm:flex-row" : "flex-col gap-4"} rounded-[28px]`}
    >
      <div className="flex-1">
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          aria-label="Email address"
          aria-invalid={Boolean(emailError || submission.kind === "error")}
        />
        <p
          className={`mt-3 text-sm ${
            submission.kind === "success"
              ? "text-green-600"
              : submission.kind === "error"
                ? "text-apex-alert"
                : "text-apex-muted"
          }`}
        >
          {submission.message || "Single-field signup. No spam, just launch updates."}
        </p>
      </div>
      <Button type="submit" disabled={isSubmitting} className={compact ? "sm:min-w-[190px]" : ""}>
        {isSubmitting ? "Submitting..." : buttonLabel}
      </Button>
    </form>
  );
}
