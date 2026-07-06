export interface BrandColor {
  id: string;
  hex: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string;
}

export interface BriefFormData {
  // Étape 1 — Entreprise
  companyName: string;
  sector: string;
  city: string;
  activity: string;
  email: string;
  whatsapp: string;

  // Étape 2 — Identité
  logo: UploadedFile | null;
  brandColors: BrandColor[];
  photos: UploadedFile[];
  inspirationLinks: string;

  // Étape 3 — Le site
  siteType: string;
  pages: string[];
  features: string[];
  goal: string;

  // Étape 4 — Cadre
  timeline: string;
  budget: string;
  message: string;
}

export const createEmptyBriefForm = (): BriefFormData => ({
  companyName: "",
  sector: "",
  city: "",
  activity: "",
  email: "",
  whatsapp: "",
  logo: null,
  brandColors: [],
  photos: [],
  inspirationLinks: "",
  siteType: "",
  pages: [],
  features: [],
  goal: "",
  timeline: "",
  budget: "",
  message: "",
});

export type FieldErrors = Partial<Record<keyof BriefFormData, string>>;

export type SubmissionStatus = "idle" | "loading" | "success" | "error";
