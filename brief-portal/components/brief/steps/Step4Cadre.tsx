"use client";

import { PencilSimple } from "@phosphor-icons/react";
import { StepShell } from "../StepShell";
import { TextArea } from "../ui/TextArea";
import { Select } from "../ui/Select";
import { BUDGETS_FCFA, DELAIS, TYPES_SITE } from "@/lib/config";
import type { BriefFormData } from "@/lib/types";

interface Step4Props {
  data: BriefFormData;
  onChange: <K extends keyof BriefFormData>(key: K, value: BriefFormData[K]) => void;
  onEditStep: (step: number) => void;
}

function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
      <span className="label-mono w-40 shrink-0 text-[10px] text-ink-soft/70">
        {label}
      </span>
      <span className="text-[14px] text-ink">{value}</span>
    </div>
  );
}

function RecapCard({
  title,
  step,
  onEditStep,
  children,
}: {
  title: string;
  step: number;
  onEditStep: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-2 p-5">
      <div className="flex items-center justify-between">
        <h3 className="label-mono text-[11px] font-bold text-ink-soft">{title}</h3>
        <button
          type="button"
          onClick={() => onEditStep(step)}
          className="flex items-center gap-1 text-[12px] font-medium text-accent transition-opacity duration-150 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface-2 rounded"
        >
          <PencilSimple size={13} weight="bold" />
          Modifier
        </button>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

export function Step4Cadre({ data, onChange, onEditStep }: Step4Props) {
  const siteTypeLabel = TYPES_SITE.find((t) => t.value === data.siteType)?.label;

  return (
    <StepShell
      stepNumber={4}
      eyebrow="Cadre & récap"
      title="Le cadre du projet"
      subtitle="Un dernier mot sur le délai et le budget, puis relisez votre dossier avant l'envoi."
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Select
          label="Délai souhaité"
          placeholder="Choisissez un délai"
          options={DELAIS}
          value={data.timeline}
          onChange={(e) => onChange("timeline", e.target.value)}
        />
        <Select
          label="Budget (FCFA)"
          placeholder="Choisissez une fourchette"
          options={BUDGETS_FCFA}
          value={data.budget}
          onChange={(e) => onChange("budget", e.target.value)}
        />
      </div>

      <TextArea
        label="Un message pour l'équipe"
        placeholder="Toute information utile que vous souhaitez ajouter."
        value={data.message}
        onChange={(e) => onChange("message", e.target.value)}
      />

      <div className="flex flex-col gap-4 pt-2">
        <span className="label-mono text-[11px] font-bold text-ink">
          Récapitulatif du dossier
        </span>

        <RecapCard title="Entreprise" step={1} onEditStep={onEditStep}>
          <RecapRow label="Nom" value={data.companyName || "—"} />
          <RecapRow label="Secteur" value={data.sector || "—"} />
          <RecapRow label="Ville" value={data.city || "—"} />
          <RecapRow label="Email" value={data.email || "—"} />
          <RecapRow label="WhatsApp" value={data.whatsapp || "—"} />
        </RecapCard>

        <RecapCard title="Identité" step={2} onEditStep={onEditStep}>
          <RecapRow label="Logo" value={data.logo ? data.logo.file.name : "—"} />
          <RecapRow
            label="Couleurs"
            value={data.brandColors.length > 0 ? `${data.brandColors.length} couleur(s)` : "—"}
          />
          <RecapRow
            label="Photos"
            value={data.photos.length > 0 ? `${data.photos.length} fichier(s)` : "—"}
          />
        </RecapCard>

        <RecapCard title="Le site" step={3} onEditStep={onEditStep}>
          <RecapRow label="Type" value={siteTypeLabel || "—"} />
          <RecapRow label="Pages" value={data.pages.length > 0 ? data.pages.join(", ") : "—"} />
          <RecapRow
            label="Fonctionnalités"
            value={data.features.length > 0 ? data.features.join(", ") : "—"}
          />
        </RecapCard>

        <RecapCard title="Cadre" step={4} onEditStep={onEditStep}>
          <RecapRow label="Délai" value={data.timeline || "—"} />
          <RecapRow label="Budget" value={data.budget || "—"} />
        </RecapCard>
      </div>
    </StepShell>
  );
}
