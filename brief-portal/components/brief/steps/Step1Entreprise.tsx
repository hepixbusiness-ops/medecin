"use client";

import { StepShell } from "../StepShell";
import { TextField } from "../ui/TextField";
import { TextArea } from "../ui/TextArea";
import { Select } from "../ui/Select";
import { SECTEURS, VILLES } from "@/lib/config";
import type { BriefFormData, FieldErrors } from "@/lib/types";

interface StepProps {
  data: BriefFormData;
  errors: FieldErrors;
  onChange: <K extends keyof BriefFormData>(key: K, value: BriefFormData[K]) => void;
}

export function Step1Entreprise({ data, errors, onChange }: StepProps) {
  return (
    <StepShell
      stepNumber={1}
      eyebrow="Entreprise"
      title="Parlez-nous de votre entreprise"
      subtitle="Ces quelques informations nous permettent de démarrer votre dossier et de vous recontacter au bon endroit."
    >
      <TextField
        label="Nom de l'entreprise"
        required
        placeholder="Ex. Boulangerie Awa"
        value={data.companyName}
        error={errors.companyName}
        onChange={(e) => onChange("companyName", e.target.value)}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Select
          label="Secteur d'activité"
          placeholder="Choisissez un secteur"
          options={SECTEURS}
          value={data.sector}
          onChange={(e) => onChange("sector", e.target.value)}
        />
        <Select
          label="Ville"
          placeholder="Choisissez une ville"
          options={VILLES}
          value={data.city}
          onChange={(e) => onChange("city", e.target.value)}
        />
      </div>

      <TextArea
        label="Votre activité en une phrase"
        placeholder="Ex. Nous vendons du pain et des pâtisseries artisanales à Abidjan."
        value={data.activity}
        onChange={(e) => onChange("activity", e.target.value)}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TextField
          label="Email"
          required
          type="email"
          placeholder="nom@domaine.com"
          value={data.email}
          error={errors.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
        <TextField
          label="WhatsApp"
          required
          type="tel"
          placeholder="+225 07 00 00 00 00"
          value={data.whatsapp}
          error={errors.whatsapp}
          onChange={(e) => onChange("whatsapp", e.target.value)}
        />
      </div>
    </StepShell>
  );
}
