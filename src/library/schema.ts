/**
 * Vocabulaires contrôlés pour la bibliothèque marketing, alignés exactement
 * sur les choix des champs singleSelect/multipleSelects créés dans la base
 * Airtable "ProRDV Bibliothèque Marketing" (table "Publications"). L'IA de
 * vision (vision.ts) doit obligatoirement classer chaque publication dans
 * l'une de ces valeurs.
 */

export const METIER_CHOICES = [
  "Coiffeur",
  "Barbier",
  "Institut de beaute",
  "Spa",
  "Restaurant",
  "Dentiste",
  "Medecin",
  "Kinesitherapeute",
  "Osteopathe",
  "Salle de sport",
  "Coach sportif",
  "Auto-ecole",
  "Boutique de mode",
  "Pressing",
  "Traiteur",
  "Photographe",
  "Garage",
  "Hotel",
  "Cabinet d'avocat",
  "Comptable",
  "Consultant",
  "Artisan",
  "Autre",
] as const;

export const FONCTIONNALITE_CHOICES = [
  "Prise de rendez-vous",
  "Catalogue produits",
  "Planning",
  "Paiement",
  "Acompte",
  "Mobile Money",
  "QR Code",
  "Avis",
  "Site Internet",
  "Notifications",
  "Agenda",
  "Employes",
  "Statistiques",
  "Rappels",
] as const;

export const CATEGORIE_CHOICES = [
  "Conseil",
  "Promotion",
  "Tutoriel",
  "Avant / Apres",
  "Nouveaute",
  "Cas client",
  "Storytelling",
  "Citation",
  "FAQ",
  "Astuce",
  "Comparaison",
  "Produit",
  "Service",
] as const;

export const OBJECTIF_CHOICES = [
  "Notoriete",
  "Engagement",
  "Conversion",
  "Fidelisation",
  "Information",
  "Promotion",
  "Education",
] as const;

/** Utilisé à la fois pour "Type de publication" et "Format" (mêmes choix dans Airtable). */
export const FORMAT_CHOICES = [
  "Carre",
  "Story",
  "Portrait",
  "Paysage",
  "Carrousel",
  "Publication",
  "Banniere",
  "Flyer",
] as const;

export const STYLE_CHOICES = [
  "Flat Design",
  "Minimaliste",
  "Professionnel",
  "Corporate",
  "Illustration",
  "Mockup",
  "UI",
  "Vectoriel",
] as const;

export const LANGUE_CHOICES = ["Francais", "Anglais"] as const;

export const STATUT_CHOICES = ["Brouillon", "En revision", "Valide", "Rejete"] as const;

export type Metier = (typeof METIER_CHOICES)[number];
export type Fonctionnalite = (typeof FONCTIONNALITE_CHOICES)[number];
export type Categorie = (typeof CATEGORIE_CHOICES)[number];
export type Objectif = (typeof OBJECTIF_CHOICES)[number];
export type FormatChoice = (typeof FORMAT_CHOICES)[number];
export type Style = (typeof STYLE_CHOICES)[number];
export type Langue = (typeof LANGUE_CHOICES)[number];

/** Ramène une valeur libre vers la valeur autorisée la plus proche (ou un défaut sûr). */
export function toValidChoice<T extends string>(
  value: string | undefined | null,
  choices: readonly T[],
  fallback: T
): T {
  if (!value) return fallback;
  const match = choices.find((c) => c.toLowerCase() === value.trim().toLowerCase());
  return match ?? fallback;
}

/** Filtre une liste de valeurs libres vers les seuls choix autorisés (multipleSelects). */
export function toValidChoices<T extends string>(values: unknown, choices: readonly T[]): T[] {
  if (!Array.isArray(values)) return [];
  const lower = new Map(choices.map((c) => [c.toLowerCase(), c] as const));
  const result: T[] = [];
  for (const v of values) {
    if (typeof v !== "string") continue;
    const match = lower.get(v.trim().toLowerCase());
    if (match && !result.includes(match)) result.push(match);
  }
  return result;
}
