"use client";

import { StepShell } from "../StepShell";
import { TextArea } from "../ui/TextArea";
import { Chip } from "../ui/Chip";
import { FONCTIONNALITES, PAGES, TYPES_SITE } from "@/lib/config";
import type { BriefFormData, FieldErrors } from "@/lib/types";

interface Step3Props {
  data: BriefFormData;
  errors: FieldErrors;
  onChange: <K extends keyof BriefFormData>(key: K, value: BriefFormData[K]) => void;
  onToggleList: (key: "pages" | "features", value: string) => void;
}

export function Step3Site({ data, errors, onChange, onToggleList }: Step3Props) {
  return (
    <StepShell
      stepNumber={3}
      eyebrow="Le site"
      title="Le site que vous voulez"
      subtitle="Le type de site oriente toute la suite du projet — le reste peut évoluer avec vous."
    >
      <div className="flex flex-col gap-2.5">
        <span className="label-mono text-[11px] font-bold text-ink-soft">
          Type de site<span className="ml-1 text-accent">*</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {TYPES_SITE.map((type) => (
            <Chip
              key={type.value}
              label={type.label}
              selected={data.siteType === type.value}
              onClick={() => onChange("siteType", type.value)}
            />
          ))}
        </div>
        {errors.siteType && (
          <p role="alert" className="text-sm leading-snug text-danger">
            {errors.siteType}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        <span className="label-mono text-[11px] font-bold text-ink-soft">
          Pages souhaitées
        </span>
        <div className="flex flex-wrap gap-2">
          {PAGES.map((page) => (
            <Chip
              key={page}
              label={page}
              selected={data.pages.includes(page)}
              onClick={() => onToggleList("pages", page)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <span className="label-mono text-[11px] font-bold text-ink-soft">
          Fonctionnalités
        </span>
        <div className="flex flex-wrap gap-2">
          {FONCTIONNALITES.map((feature) => (
            <Chip
              key={feature}
              label={feature}
              selected={data.features.includes(feature)}
              onClick={() => onToggleList("features", feature)}
            />
          ))}
        </div>
      </div>

      <TextArea
        label="L'objectif n°1 de ce site"
        placeholder="Ex. Faire connaître mes produits et recevoir des commandes par WhatsApp."
        value={data.goal}
        onChange={(e) => onChange("goal", e.target.value)}
      />
    </StepShell>
  );
}
