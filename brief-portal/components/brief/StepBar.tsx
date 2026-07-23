"use client";

import { motion } from "motion/react";
import { Check } from "@phosphor-icons/react";
import { STEP_LABELS } from "@/lib/config";
import { computeCompletion } from "@/lib/completion";
import type { BriefFormData } from "@/lib/types";

interface StepBarProps {
  currentStep: number;
  data: BriefFormData;
}

export function StepBar({ currentStep, data }: StepBarProps) {
  const completion = computeCompletion(data);

  return (
    <div className="sticky top-0 z-20 flex flex-col gap-3 border-b border-border bg-bg-base/95 px-5 py-4 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between">
        <ol className="flex flex-1 items-center gap-1.5">
          {STEP_LABELS.map((label, index) => {
            const stepNumber = index + 1;
            const isDone = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            return (
              <li key={label} className="flex flex-1 items-center gap-1.5">
                <span
                  className={`label-mono flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] transition-colors duration-200 ${
                    isDone
                      ? "bg-accent text-white"
                      : isActive
                        ? "border border-accent text-accent"
                        : "border border-border text-ink-soft/50"
                  }`}
                >
                  {isDone ? <Check weight="bold" size={13} /> : String(stepNumber).padStart(2, "0")}
                </span>
                {stepNumber !== STEP_LABELS.length && (
                  <span
                    className={`h-px flex-1 ${isDone ? "bg-accent" : "bg-border"}`}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <div className="flex items-center justify-between">
        <span className="label-mono text-[10px] text-ink-soft">
          Étape {currentStep}/{STEP_LABELS.length} — {STEP_LABELS[currentStep - 1]}
        </span>
        <span className="label-mono text-[10px] text-accent">{completion}%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-border-soft">
        <motion.div
          className="h-full rounded-full bg-accent"
          animate={{ width: `${completion}%` }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
