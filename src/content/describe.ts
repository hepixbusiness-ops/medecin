import { THEMES, CTA, Theme } from "./themes";
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

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i] as T;
    arr[i] = arr[j] as T;
    arr[j] = temp;
  }
  return arr;
}

/**
 * Choisit le thème du jour en évitant les `RECENT_WINDOW` derniers thèmes
 * publiés avec succès (rotation sans répétition récente).
 */
export async function selectDailyTheme(): Promise<Theme> {
  const recentKeys = await getRecentThemeKeys(RECENT_WINDOW);
  let candidates = THEMES.filter((theme) => !recentKeys.includes(theme.key));

  if (candidates.length === 0) {
    const lastKey = recentKeys[0];
    candidates = THEMES.filter((theme) => theme.key !== lastKey);
  }

  return pickRandom(candidates);
}

function splitHashtagLine(text: string): [string, string | undefined] {
  const lines = text.split("\n");
  const lastLine = lines[lines.length - 1] ?? "";
  if (lastLine.trim().startsWith("#")) {
    return [lines.slice(0, -1).join("\n"), lastLine];
  }
  return [text, undefined];
}

/** Remplit le gabarit avec le CTA et mélange l'ordre des hashtags secondaires (léger effet de variation). */
function fillCaptionTemplate(theme: Theme): string {
  const filled = theme.gabaritLegende.replace("{CTA}", CTA);
  const [body, hashtagLine] = splitHashtagLine(filled);
  if (!hashtagLine) return filled;

  const [brandTag, ...otherTags] = hashtagLine.trim().split(/\s+/);
  const reordered = [brandTag, ...shuffle(otherTags)].join(" ");
  return `${body}\n${reordered}`;
}

function buildTemplateContent(theme: Theme): { descriptionImage: string; legende: string } {
  const variant = pickRandom(IMAGE_STYLE_VARIANTS);
  const descriptionImage = `${theme.promptImage} Variation du jour : ${variant}.`;
  const legende = fillCaptionTemplate(theme);
  return { descriptionImage, legende };
}

async function buildAiContent(theme: Theme): Promise<{ descriptionImage: string; legende: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("CONTENT_MODE=ai requiert la variable d'environnement ANTHROPIC_API_KEY.");
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

  const systemPrompt = [
    "Tu rédiges des légendes Facebook en français pour ProRDV, une application camerounaise de réservation en ligne pour établissements (coiffure, spa, restaurant, fitness, hôtel, santé).",
    "Consignes strictes :",
    "- Français uniquement, ton chaleureux et professionnel.",
    "- 2 à 3 emojis maximum, jamais plus.",
    `- Inclure explicitement l'appel à l'action : "${CTA}".`,
    "- Terminer par 4 à 6 hashtags pertinents incluant toujours #ProRDV et #Cameroun.",
    "- Réponds uniquement avec le texte final de la légende, sans introduction ni commentaire.",
  ].join("\n");

  const userPrompt = [
    `Angle commercial du jour : ${theme.angle}`,
    `Secteur ciblé : ${theme.secteur}`,
    "Rédige une légende Facebook originale et naturelle à partir de cet angle.",
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
      max_tokens: 400,
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

  const variant = pickRandom(IMAGE_STYLE_VARIANTS);
  const descriptionImage = `${theme.promptImage} Variation du jour : ${variant}.`;

  return { descriptionImage, legende };
}

/**
 * Sélectionne le thème du jour puis génère la description d'image et la
 * légende finale, selon CONTENT_MODE ("template" par défaut, ou "ai").
 */
export async function describeToday(): Promise<DailyContent> {
  const theme = await selectDailyTheme();
  const mode = (process.env.CONTENT_MODE || "template").toLowerCase();

  const { descriptionImage, legende } =
    mode === "ai" ? await buildAiContent(theme) : buildTemplateContent(theme);

  return { themeKey: theme.key, descriptionImage, legende };
}
