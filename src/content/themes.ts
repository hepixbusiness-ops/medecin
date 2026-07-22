/**
 * Construit une publication (Theme) à la demande à partir d'un métier
 * (metiers.ts) et d'un type de contenu (typesContenu.ts). Remplace l'ancienne
 * banque statique de thèmes : avec 22 métiers × 24 types, la combinatoire
 * suffit largement à éviter les répétitions sans avoir à rédiger chaque
 * publication à la main.
 */

import { Metier } from "./metiers";
import { TypeContenu } from "./typesContenu";

export interface Theme {
  /** Identifiant unique et stable : "{metierKey}__{typeKey}" */
  key: string;
  /** Argument commercial du jour, en une phrase (utilisé en mode CONTENT_MODE=ai) */
  angle: string;
  /** Secteur ciblé */
  secteur: string;
  /** Prompt d'illustration flat design (préfixé par la charte de marque dans generate.ts) */
  promptImage: string;
  /** Légende Facebook finale (déjà complète : CTA et hashtags inclus) */
  gabaritLegende: string;
}

/** Appels à l'action, variés à chaque publication. */
export const CTA_VARIANTS = [
  "Essayez gratuitement",
  "Inscrivez-vous",
  "Réservez une démonstration",
  "Découvrez ProRDV",
  "Testez maintenant",
  "Créez votre compte",
  "Commencez gratuitement",
];

const HASHTAGS_RESERVATION = ["#ReservationEnLigne", "#GestionRDV", "#Planning"];
const HASHTAGS_BUSINESS = ["#Entreprenariat", "#PME", "#Business"];
const HASHTAGS_LOCAL = ["#Cameroun", "#Yaoundé", "#Douala"];
const HASHTAGS_SAAS = ["#SaaS", "#TechAfrique", "#DigitalAfrica"];

function pickRandom<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error("pickRandom: la liste fournie est vide.");
  }
  return items[Math.floor(Math.random() * items.length)] as T;
}

/** Construit une ligne d'appel à l'action, tirée aléatoirement parmi CTA_VARIANTS. */
export function buildCta(): string {
  return `${pickRandom(CTA_VARIANTS)} → prordv.app/pro`;
}

/** Construit une ligne de hashtags : #ProRDV + métier + une pioche par catégorie. */
export function buildHashtags(metier: Metier): string {
  return [
    "#ProRDV",
    metier.hashtag,
    pickRandom(HASHTAGS_RESERVATION),
    pickRandom(HASHTAGS_BUSINESS),
    pickRandom(HASHTAGS_LOCAL),
    pickRandom(HASHTAGS_SAAS),
  ].join(" ");
}

/** Construit une publication complète pour un métier et un type de contenu donnés. */
export function buildTheme(metier: Metier, type: TypeContenu): Theme {
  const { accroche, corps } = type.generer(metier);
  const bullets = corps.map((ligne) => `✅ ${ligne}`).join("\n");
  const gabaritLegende = `${accroche}\n\n${bullets}\n\n${buildCta()}\n\n${buildHashtags(metier)}`;

  return {
    key: `${metier.key}__${type.key}`,
    angle: `${type.nom} pour ${metier.nom} : ${metier.beneficeCle}.`,
    secteur: metier.secteur,
    promptImage:
      `Illustration flat design ${metier.visuel}, superposée d'une interface de réservation ` +
      `violette flottante avec coche verte de confirmation, fond violet #7C3AED et blanc, ` +
      `ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, ` +
      `sans visage réaliste, haute qualité.`,
    gabaritLegende,
  };
}
