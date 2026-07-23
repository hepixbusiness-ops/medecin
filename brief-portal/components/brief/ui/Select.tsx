"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { FieldShell } from "./FieldShell";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  placeholder?: string;
  options: readonly string[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, required, hint, error, id, className, placeholder, options, ...props },
    ref
  ) => {
    const fieldId = id ?? `field-${label.replace(/\s+/g, "-").toLowerCase()}`;

    return (
      <FieldShell label={label} htmlFor={fieldId} required={required} hint={hint} error={error}>
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            aria-invalid={Boolean(error)}
            aria-required={required}
            className={`h-12 w-full appearance-none rounded-lg border bg-surface-2 px-4 pr-11 text-[15px] text-ink transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:bg-border-soft disabled:text-ink-soft/60 ${
              error ? "border-danger" : "border-border hover:border-ink-soft/40"
            } ${className ?? ""}`}
            {...props}
          >
            <option value="" disabled>
              {placeholder ?? "Choisissez une option"}
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <CaretDown
            aria-hidden
            weight="bold"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft"
            size={16}
          />
        </div>
      </FieldShell>
    );
  }
);

Select.displayName = "Select";
