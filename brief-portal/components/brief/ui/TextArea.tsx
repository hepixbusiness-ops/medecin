"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { FieldShell } from "./FieldShell";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, required, hint, error, id, className, rows = 3, ...props }, ref) => {
    const fieldId = id ?? `field-${label.replace(/\s+/g, "-").toLowerCase()}`;

    return (
      <FieldShell label={label} htmlFor={fieldId} required={required} hint={hint} error={error}>
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-required={required}
          className={`w-full resize-y rounded-lg border bg-surface-2 px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-ink-soft/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:bg-border-soft disabled:text-ink-soft/60 ${
            error ? "border-danger" : "border-border hover:border-ink-soft/40"
          } ${className ?? ""}`}
          {...props}
        />
      </FieldShell>
    );
  }
);

TextArea.displayName = "TextArea";
