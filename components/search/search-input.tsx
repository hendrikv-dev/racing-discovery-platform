"use client";

import { Search } from "lucide-react";

export function SearchInput({
  value,
  onChange,
  placeholder,
  className = "",
  autoFocus = false,
  onKeyDown,
  onFocus
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  autoFocus?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
}) {
  return (
    <label
      className={`glass-border flex min-h-11 items-center gap-3 rounded-xl border border-white/10 bg-[#09090F] px-4 py-3 transition duration-150 focus-within:border-violet-400/60 focus-within:ring-2 focus-within:ring-violet-400 focus-within:ring-offset-2 focus-within:ring-offset-[#09090F] ${className}`}
    >
      <Search className="h-5 w-5 text-zinc-400" />
      <input
        aria-label={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500 md:text-base"
        placeholder={placeholder}
      />
    </label>
  );
}
