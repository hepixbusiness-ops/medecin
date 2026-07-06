"use client";

import { motion } from "motion/react";
import { Check } from "@phosphor-icons/react";

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function Chip({ label, selected, onClick, disabled }: ChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-[14px] font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-base disabled:cursor-not-allowed disabled:opacity-40 ${
        selected
          ? "border-accent bg-accent text-white"
          : "border-border bg-surface-2 text-ink-soft hover:border-ink-soft/50 hover:text-ink"
      }`}
    >
      {selected && <Check weight="bold" size={14} />}
      {label}
    </motion.button>
  );
}
