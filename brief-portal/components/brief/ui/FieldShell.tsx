"use client";

import type { ReactNode } from "react";

interface FieldShellProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function FieldShell({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: FieldShellProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={htmlFor}
          className="label-mono text-[11px] font-bold text-ink-soft"
        >
          {label}
          {required && <span className="ml-1 text-accent">*</span>}
        </label>
        {hint && (
          <span className="label-mono text-[10px] text-ink-soft/70">{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <p
          role="alert"
          className="flex items-start gap-1.5 text-sm leading-snug text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}
