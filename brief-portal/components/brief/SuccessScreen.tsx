"use client";

import { motion, useReducedMotion } from "motion/react";
import { Envelope, WhatsappLogo } from "@phosphor-icons/react";

interface SuccessScreenProps {
  companyName: string;
  reference: string;
}

export function SuccessScreen({ companyName, reference }: SuccessScreenProps) {
  const shouldReduceMotion = useReducedMotion();
  const displayName = companyName.trim() || "votre entreprise";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-h-[70dvh] flex-col items-center justify-center gap-8 py-16 text-center"
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent-soft">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden>
          <motion.circle
            cx="26"
            cy="26"
            r="23"
            stroke="var(--accent)"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
          <motion.path
            d="M15 27 L22.5 34.5 L37 18"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.4,
              delay: shouldReduceMotion ? 0 : 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <span className="label-mono text-[11px] font-bold text-accent">
          Dossier envoyé
        </span>
        <h1 className="h1-clamp max-w-lg font-semibold text-ink">
          Merci, {displayName} !
        </h1>
        <p className="mx-auto max-w-md text-[15px] leading-relaxed text-ink-soft">
          Votre dossier a bien été reçu. Notre équipe l&apos;étudie et revient vers
          vous sous <strong className="text-ink">48 heures</strong> par email ou
          WhatsApp.
        </p>
      </div>

      <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface-2 px-6 py-4">
        <span className="label-mono text-[10px] text-ink-soft/70">
          Référence de dossier
        </span>
        <span className="label-mono text-[18px] font-bold tracking-wide text-ink">
          {reference}
        </span>
      </div>

      <div className="flex flex-col items-center gap-2 text-[13px] text-ink-soft">
        <div className="flex items-center gap-2">
          <Envelope size={15} weight="bold" />
          <span>Vous recevrez une confirmation par email.</span>
        </div>
        <div className="flex items-center gap-2">
          <WhatsappLogo size={15} weight="bold" />
          <span>Gardez votre WhatsApp à portée de main.</span>
        </div>
      </div>
    </motion.div>
  );
}
