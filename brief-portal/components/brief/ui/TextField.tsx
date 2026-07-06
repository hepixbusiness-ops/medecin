"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { FieldShell } from "./FieldShell";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, required, hint, error, id, className, ...props }, ref) => {
    const fieldId = id ?? `field-${label.replace(/\s+/g, "-").toLowerCase()}`;

    return (
      <FieldShell label={label} htmlFor={fieldId} required={required} hint={hint} error={error}>
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={Boolean(error)}
          aria-required={required}
          className={`h-12 w-full rounded-lg border bg-surface-2 px-4 text-[15px] text-ink placeholder:text-ink-soft/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:bg-border-soft disabled:text-ink-soft/60 ${
            error ? "border-danger" : "border-border hover:border-ink-soft/40"
          } ${className ?? ""}`}
          {...props}
        />
      </FieldShell>
    );
  }
);

TextField.displayName = "TextField";
