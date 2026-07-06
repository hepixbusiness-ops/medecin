"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface StepShellProps {
  stepNumber: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function StepShell({ stepNumber, eyebrow, title, subtitle, children }: StepShellProps) {
  return (
    <motion.div
      key={stepNumber}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-3">
        <span className="label-mono text-[11px] font-bold text-accent">
          {String(stepNumber).padStart(2, "0")} — {eyebrow}
        </span>
        <h1 className="h1-clamp font-semibold text-ink">{title}</h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-ink-soft">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </motion.div>
  );
}
