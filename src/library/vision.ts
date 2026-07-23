import { promises as fs } from "fs";
import path from "path";
import {
  CATEGORIE_CHOICES,
  FONCTIONNALITE_CHOICES,
  FORMAT_CHOICES,
  LANGUE_CHOICES,
  METIER_CHOICES,
  OBJECTIF_CHOICES,
  STYLE_CHOICES,
  toValidChoice,
  toValidChoices,
} from "./schema";

export interface AnalyseImage {
  nom: string;
  titre: string;
  accroche: string;
  descriptionFacebook: string;
  descriptionInstagram: string;
  descriptionTiktok: string;
  descriptionLinkedin: string;
  descriptionYoutube: string;
  cta: string;
  hashtags: string;
  motsCles: string;
  resume: string;
  texteAlternatif: string;
  metier: (typeof METIER_CHOICES)[number];
  secteur: string;
  fonctionnalite: (typeof FONCTIONNALITE_CHOICES)[number][];
  categorie: (typeof CATEGORIE_CHOICES)[number];
  objectifMarketing: (typeof OBJECTIF_CHOICES)[number];
  typePublication: (typeof FORMAT_CHOICES)[number];
  styleGraphique: (typeof STYLE_CHOICES)[number];
  couleurDominante: string;
  format: (typeof FORMAT_CHOICES)[number];
  langue: (typeof LANGUE_CHOICES)[number];
  scoreQualite: number;
  scoreMarketing: number;
  presenceLogo: boolean;
  respectCharteGraphique: boolean;
  remarquesIA: string;
}

const MEDIA_TYPE_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function detectMediaType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mediaType = MEDIA_TYPE_BY_EXT[ext];
  if (!mediaType) {
    throw new Error(`Extension d'image non supportée : "${ext}". Utilise .png, .jpg, .jpeg ou .webp.`);
  }
  return mediaType;
}

const SYSTEM_PROMPT = `
Tu es l'agent IA de gestion de la bibliothèque marketing de ProRDV, une application camerounaise de réservation en ligne pour professionnels (coiffure, restaurant, santé, spa, auto-école, etc.).
Identité de marque à connaître pour évaluer la conformité : couleur principale violet #7C3AED, style flat design, minimaliste, professionnel, moderne, illustrations vectorielles, logo ProRDV, CTA visible, grandes marges, titres impactants.

Tu ne publies jamais et ne programmes aucune diffusion. Ta seule mission : analyser entièrement l'image fournie et produire tous les contenus rédactionnels et métadonnées nécessaires pour la classer dans une bibliothèque Airtable.

Analyse l'image en détail : métier concerné, fonctionnalité ProRDV mise en avant, message marketing, couleurs, style graphique, format, texte visible, icônes, logo, CTA éventuel, éléments visuels importants. Détermine ensuite l'objectif marketing (notoriété, engagement, conversion, fidélisation, information, promotion, éducation).

Rédige des textes adaptés à chaque réseau social (Facebook plus long et conversationnel avec une question en fin, Instagram visuel et hashtags optimisés, TikTok hook immédiat et ton dynamique, LinkedIn professionnel orienté ROI/business, YouTube Community avec une question/sondage). Ne copie jamais le même texte d'un réseau à l'autre.

Réponds UNIQUEMENT avec un objet JSON valide (aucun texte avant/après, aucun bloc markdown), avec exactement ces clés :
{
  "nom": string (nom interne court pour retrouver la publication, ex: "Dentiste - Rappel automatique"),
  "titre": string,
  "accroche": string,
  "descriptionFacebook": string,
  "descriptionInstagram": string,
  "descriptionTiktok": string,
  "descriptionLinkedin": string,
  "descriptionYoutube": string,
  "cta": string,
  "hashtags": string (séparés par des espaces, avec #),
  "motsCles": string (séparés par des virgules),
  "resume": string (2-3 phrases),
  "texteAlternatif": string (texte alternatif SEO/accessibilité de l'image),
  "metier": string (un métier parmi : ${METIER_CHOICES.join(", ")}),
  "secteur": string (libellé libre du secteur),
  "fonctionnalite": string[] (une ou plusieurs valeurs parmi : ${FONCTIONNALITE_CHOICES.join(", ")}),
  "categorie": string (une valeur parmi : ${CATEGORIE_CHOICES.join(", ")}),
  "objectifMarketing": string (une valeur parmi : ${OBJECTIF_CHOICES.join(", ")}),
  "typePublication": string (une valeur parmi : ${FORMAT_CHOICES.join(", ")}),
  "styleGraphique": string (une valeur parmi : ${STYLE_CHOICES.join(", ")}),
  "couleurDominante": string (ex: "Violet #7C3AED"),
  "format": string (une valeur parmi : ${FORMAT_CHOICES.join(", ")}),
  "langue": string (une valeur parmi : ${LANGUE_CHOICES.join(", ")}),
  "scoreQualite": number (0 à 10, qualité graphique générale),
  "scoreMarketing": number (0 à 10, efficacité marketing perçue),
  "presenceLogo": boolean (le logo ProRDV est-il visible ?),
  "respectCharteGraphique": boolean (violet #7C3AED, flat design, lisibilité, CTA visible ?),
  "remarquesIA": string (signale ici tout élément manquant ou non conforme : logo absent, CTA peu visible, contraste faible, etc. ; si rien à signaler, décris brièvement pourquoi l'image est conforme)
}

Ne laisse jamais un champ vide. Si une information n'est pas visible dans l'image, indique-le explicitement dans le champ concerné (ex: "Aucun CTA visible sur l'image") plutôt que d'inventer un contenu qui n'y figure pas.
`.trim();

/** Analyse une image via l'API Anthropic (vision) et renvoie une structure prête pour Airtable. */
export async function analyserImage(filePath: string): Promise<AnalyseImage> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("La bibliothèque marketing requiert la variable d'environnement ANTHROPIC_API_KEY.");
  }

  const mediaType = detectMediaType(filePath);
  const imageBuffer = await fs.readFile(filePath);
  const base64Image = imageBuffer.toString("base64");
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64Image },
            },
            {
              type: "text",
              text: "Analyse cette image et renvoie l'objet JSON demandé, rien d'autre.",
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Appel à l'API Anthropic (vision) échoué (${response.status}) : ${errorText}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const rawText = data.content?.find((block) => block.type === "text")?.text?.trim();
  if (!rawText) {
    throw new Error("Réponse de l'API Anthropic (vision) vide ou invalide.");
  }

  const jsonText = extractJson(rawText);
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error(`Réponse de l'API Anthropic non-JSON : ${rawText.slice(0, 300)}`);
  }

  return normaliser(parsed);
}

/** Retire un éventuel bloc markdown ```json autour de la réponse. */
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1]!.trim() : text;
}

function str(value: unknown, fallback = "Non déterminé"): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function num(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(10, Math.round(n))) : fallback;
}

function bool(value: unknown): boolean {
  return value === true;
}

function normaliser(raw: Record<string, unknown>): AnalyseImage {
  return {
    nom: str(raw.nom, "Publication sans nom"),
    titre: str(raw.titre),
    accroche: str(raw.accroche),
    descriptionFacebook: str(raw.descriptionFacebook),
    descriptionInstagram: str(raw.descriptionInstagram),
    descriptionTiktok: str(raw.descriptionTiktok),
    descriptionLinkedin: str(raw.descriptionLinkedin),
    descriptionYoutube: str(raw.descriptionYoutube),
    cta: str(raw.cta, "Aucun CTA détecté"),
    hashtags: str(raw.hashtags, "#ProRDV"),
    motsCles: str(raw.motsCles, "ProRDV"),
    resume: str(raw.resume),
    texteAlternatif: str(raw.texteAlternatif),
    metier: toValidChoice(str(raw.metier, ""), METIER_CHOICES, "Autre"),
    secteur: str(raw.secteur, "Non déterminé"),
    fonctionnalite: toValidChoices(raw.fonctionnalite, FONCTIONNALITE_CHOICES),
    categorie: toValidChoice(str(raw.categorie, ""), CATEGORIE_CHOICES, "Service"),
    objectifMarketing: toValidChoice(str(raw.objectifMarketing, ""), OBJECTIF_CHOICES, "Information"),
    typePublication: toValidChoice(str(raw.typePublication, ""), FORMAT_CHOICES, "Publication"),
    styleGraphique: toValidChoice(str(raw.styleGraphique, ""), STYLE_CHOICES, "Flat Design"),
    couleurDominante: str(raw.couleurDominante, "Non déterminée"),
    format: toValidChoice(str(raw.format, ""), FORMAT_CHOICES, "Publication"),
    langue: toValidChoice(str(raw.langue, ""), LANGUE_CHOICES, "Francais"),
    scoreQualite: num(raw.scoreQualite),
    scoreMarketing: num(raw.scoreMarketing),
    presenceLogo: bool(raw.presenceLogo),
    respectCharteGraphique: bool(raw.respectCharteGraphique),
    remarquesIA: str(raw.remarquesIA, "Aucune remarque."),
  };
}
