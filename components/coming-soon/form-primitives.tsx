import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type PropsWithChildren } from "react";

export function SectionContainer({
  children,
  className = ""
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section className={`rounded-[28px] border border-white/10 bg-[#11131C]/95 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.3)] sm:p-8 ${className}`}>
      {children}
    </section>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`h-14 w-full rounded-full border border-zinc-800 bg-zinc-950 px-5 text-sm text-zinc-100 outline-none transition duration-150 placeholder:text-zinc-500 focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F] ${className}`}
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
      className={`inline-flex h-14 items-center justify-center rounded-full bg-violet-600 px-6 text-sm font-semibold text-white transition duration-150 hover:-translate-y-0.5 hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
