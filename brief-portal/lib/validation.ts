import type { BriefFormData, FieldErrors } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WHATSAPP_RE = /^[+\d][\d\s().-]{7,}$/;

export function validateStep1(data: BriefFormData): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.companyName.trim()) {
    errors.companyName =
      "Dites-nous comment s'appelle votre entreprise — c'est le point de départ du dossier.";
  }

  if (!data.email.trim()) {
    errors.email = "Une adresse email est nécessaire pour vous recontacter.";
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = "Cette adresse email ne semble pas complète (ex. nom@domaine.com).";
  }

  if (!data.whatsapp.trim()) {
    errors.whatsapp = "Un numéro WhatsApp nous permet de vous joindre rapidement.";
  } else if (!WHATSAPP_RE.test(data.whatsapp.trim())) {
    errors.whatsapp =
      "Ce numéro ne semble pas complet — indiquez l'indicatif pays si possible (ex. +225 07 00 00 00 00).";
  }

  return errors;
}

export function validateStep3(data: BriefFormData): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.siteType) {
    errors.siteType =
      "Choisissez le type de site qui colle le mieux à votre projet — tout le reste du dossier en dépend.";
  }

  return errors;
}

export function validateStep(step: number, data: BriefFormData): FieldErrors {
  if (step === 1) return validateStep1(data);
  if (step === 3) return validateStep3(data);
  return {};
}

export function isStepValid(step: number, data: BriefFormData): boolean {
  return Object.keys(validateStep(step, data)).length === 0;
}
