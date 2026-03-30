import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type PropsWithChildren } from "react";

export function SectionContainer({
  children,
  className = ""
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section className={`glass-border rounded-[28px] bg-white/85 p-6 shadow-panel sm:p-8 ${className}`}>
      {children}
    </section>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`h-14 w-full rounded-full border border-slate-200 bg-white px-5 text-sm text-apex-slate outline-none transition duration-200 placeholder:text-apex-muted focus:border-apex-blue focus:ring-4 focus:ring-blue-100 ${className}`}
        {...props}
      />
    );
  }
);

export function Button({
  children,
  className = "",
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }>) {
  return (
    <button
      className={`inline-flex h-14 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
