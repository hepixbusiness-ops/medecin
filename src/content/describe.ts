import { METIERS, Metier } from "./metiers";
import { TYPES_CONTENU, TypeContenu } from "./typesContenu";
import { buildTheme, buildCta } from "./themes";
import { getRecentThemeKeys } from "../store/history";

export interface DailyContent {
  themeKey: string;
  descriptionImage: string;
  legende: string;
}

const RECENT_WINDOW = 7;

/** Petites variations de rendu ajoutées au prompt image pour éviter des images identiques d'une rotation à l'autre. */
const IMAGE_STYLE_VARIANTS = [
  "légère texture de papier en arrière-plan",
  "éclairage doux du matin",
  "éclairage chaud de fin de journée",
  "léger dégradé radial en arrière-plan",
  "reflets subtils sur les formes principales",
];

function pickRandom<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error("pickRandom: la liste fournie est vide.");
  }
  return items[Math.floor(Math.random() * items.length)] as T;
}

function parseMetierKey(themeKey: string): string {
  return themeKey.split("__")[0] ?? themeKey;
}

function parseTypeKey(themeKey: string): string {
  return themeKey.split("__")[1] ?? "";
}

/**
 * Choisit le métier du jour, en évitant les métiers déjà ciblés lors des
 * `RECENT_WINDOW` dernières publications réussies. Un seul métier est choisi
 * par jour ; les publications du jour varient ensuite par type de contenu.
 */
export async function selectMetierDuJour(): Promise<Metier> {
  const recentKeys = await getRecentThemeKeys(RECENT_WINDOW);
  const recentMetierKeys = new Set(recentKeys.map(parseMetierKey));

  let candidates = METIERS.filter((m) => !recentMetierKeys.has(m.key));
  if (candidates.length === 0) candidates = METIERS;

  return pickRandom(candidates);
}

/**
 * Choisit un type de contenu pour le métier du jour, en évitant les types
 * déjà utilisés récemment pour ce métier ainsi que ceux déjà utilisés plus
 * tôt dans le run en cours (`excludeTypeKeys`).
 */
export async function selectTypeContenu(
  metier: Metier,
  excludeTypeKeys: string[] = []
): Promise<TypeContenu> {
  const recentKeys = await getRecentThemeKeys(RECENT_WINDOW);
  const recentTypeKeysForMetier = new Set(
    recentKeys.filter((k) => parseMetierKey(k) === metier.key).map(parseTypeKey)
  );
  const excluded = new Set([...recentTypeKeysForMetier, ...excludeTypeKeys]);

  let candidates = TYPES_CONTENU.filter((t) => !excluded.has(t.key));
  if (candidates.length === 0) {
    candidates = TYPES_CONTENU.filter((t) => !excludeTypeKeys.includes(t.key));
  }
  if (candidates.length === 0) candidates = TYPES_CONTENU;

  return pickRandom(candidates);
}

async function buildAiContent(
  metier: Metier,
  type: TypeContenu,
  angle: string,
  secteur: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("CONTENT_MODE=ai requiert la variable d'environnement ANTHROPIC_API_KEY.");
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
  const ctaLine = buildCta();

  const systemPrompt = [
    "Tu rédiges des légendes Facebook en français pour ProRDV, une application camerounaise de réservation en ligne pour professionnels sur rendez-vous.",
    `Type de publication demandé : "${type.nom}".`,
    "Consignes strictes :",
    "- Français uniquement, ton chaleureux et professionnel.",
    "- 2 à 3 emojis maximum, jamais plus.",
    `- Inclure explicitement l'appel à l'action : "${ctaLine}".`,
    "- Terminer par 4 à 6 hashtags pertinents incluant toujours #ProRDV et #Cameroun.",
    "- Réponds uniquement avec le texte final de la légende, sans introduction ni commentaire.",
  ].join("\n");

  const userPrompt = [
    `Angle commercial du jour : ${angle}`,
    `Secteur ciblé : ${secteur}`,
    `Douleur du métier à adresser : ${metier.douleur}`,
    `Bénéfice ProRDV à mettre en avant : ${metier.beneficeCle}`,
    `Rédige une légende Facebook originale et naturelle, dans le style "${type.nom}", à partir de ces éléments.`,
  ].join("\n");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Appel à l'API Anthropic échoué (${response.status}) : ${errorText}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const legende = data.content?.find((block) => block.type === "text")?.text?.trim();
  if (!legende) {
    throw new Error("Réponse de l'API Anthropic vide ou invalide.");
  }

  return legende;
}

/**
 * Génère la description d'image et la légende finale pour un (métier, type
 * de contenu) donnés, selon CONTENT_MODE ("template" par défaut, ou "ai").
 */
export async function describePost(metier: Metier, type: TypeContenu): Promise<DailyContent> {
  const theme = buildTheme(metier, type);
  const mode = (process.env.CONTENT_MODE || "template").toLowerCase();

  const variant = pickRandom(IMAGE_STYLE_VARIANTS);
  const descriptionImage = `${theme.promptImage} Variation du jour : ${variant}.`;

  if (mode === "ai") {
    const legende = await buildAiContent(metier, type, theme.angle, theme.secteur);
    return { themeKey: theme.key, descriptionImage, legende };
  }

  return { themeKey: theme.key, descriptionImage, legende: theme.gabaritLegende };
}
