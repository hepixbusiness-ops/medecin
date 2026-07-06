export const SECTEURS = [
  "Restauration & alimentation",
  "Commerce & boutique",
  "Santé & bien-être",
  "Beauté & coiffure",
  "Hôtellerie & tourisme",
  "Immobilier & BTP",
  "Éducation & formation",
  "Finance & assurance",
  "Artisanat & services à domicile",
  "Transport & logistique",
  "Association & ONG",
  "Autre",
] as const;

export const VILLES = [
  "Abidjan",
  "Bouaké",
  "Yamoussoukro",
  "San-Pédro",
  "Korhogo",
  "Daloa",
  "Man",
  "Gagnoa",
  "Abengourou",
  "Dakar",
  "Cotonou",
  "Lomé",
  "Autre ville",
] as const;

export const TYPES_SITE = [
  { value: "vitrine", label: "Site vitrine" },
  { value: "e-commerce", label: "Boutique en ligne" },
  { value: "landing", label: "Landing page" },
  { value: "blog", label: "Blog / magazine" },
  { value: "portfolio", label: "Portfolio" },
  { value: "reservation", label: "Prise de RDV / réservation" },
  { value: "autre", label: "Autre projet" },
] as const;

export const PAGES = [
  "Accueil",
  "À propos",
  "Services",
  "Produits",
  "Portfolio / Réalisations",
  "Tarifs",
  "Blog",
  "FAQ",
  "Témoignages",
  "Équipe",
  "Contact",
  "Mentions légales",
] as const;

export const FONCTIONNALITES = [
  "Paiement Mobile Money",
  "Bouton WhatsApp",
  "Bilingue FR/EN",
  "Boutique en ligne",
  "Prise de RDV",
  "Formulaire de contact",
  "Newsletter",
  "Espace client",
  "Multilingue (autres langues)",
  "Chat en direct",
] as const;

export const DELAIS = [
  "Le plus vite possible",
  "Sous 2 semaines",
  "Sous 1 mois",
  "1 à 3 mois",
  "Pas de contrainte particulière",
] as const;

export const BUDGETS_FCFA = [
  "Moins de 200 000 FCFA",
  "200 000 – 500 000 FCFA",
  "500 000 – 1 000 000 FCFA",
  "1 000 000 – 2 500 000 FCFA",
  "Plus de 2 500 000 FCFA",
  "Je ne sais pas encore",
] as const;

export const MAX_BRAND_COLORS = 5;
export const MAX_PHOTOS = 8;
export const MAX_FILE_SIZE_MB = 15;

export const ACCEPTED_LOGO_TYPES = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
  "application/pdf",
];

export const ACCEPTED_PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"];

export const TOTAL_STEPS = 4;

export const STEP_LABELS = ["Entreprise", "Identité", "Le site", "Cadre"] as const;
