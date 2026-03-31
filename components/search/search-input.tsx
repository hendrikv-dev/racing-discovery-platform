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
      className={`glass-border flex min-h-11 items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 ${className}`}
    >
      <Search className="h-5 w-5 text-zinc-400" />
      <input
        aria-label={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
        placeholder={placeholder}
      />
    </label>
  );
}
