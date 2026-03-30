"use client";

import { Search } from "lucide-react";

export function SearchInput({
  value,
  onChange,
  placeholder,
  className = "",
  autoFocus = false,
  onKeyDown
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  autoFocus?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}) {
  return (
    <label
      className={`glass-border flex items-center gap-3 rounded-[20px] bg-slate-50 px-4 py-3 ${className}`}
    >
      <Search className="h-5 w-5 text-apex-muted" />
      <input
        aria-label={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        className="w-full bg-transparent text-sm outline-none placeholder:text-apex-muted"
        placeholder={placeholder}
      />
    </label>
  );
}
