import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { getRecentImageRefs } from "../store/history";

export interface GeneratedImage {
  /** "file" = chemin local à uploader en multipart ; "url" = URL publique directement exploitable par la Graph API */
  type: "file" | "url";
  value: string;
}

const IMAGE_SIZE = 1080;

/** Contraintes de marque ProRDV, toujours préfixées au prompt avant la description du jour. */
const BRAND_PREFIX =
  "Illustration flat design premium pour la marque ProRDV : violet #7C3AED comme couleur dominante, " +
  "blanc et gris clair en complément, coins arrondis, ombres douces, style flat design épuré, " +
  "ambiance africaine urbaine contemporaine, aucun visage réaliste ni personnage photoréaliste, " +
  "rendu haute qualité. ";

const BANQUE_DIR = path.resolve(process.cwd(), "assets/banque");
const OUTPUT_DIR = path.resolve(process.cwd(), "tmp");
const RECENT_WINDOW = 7;

function buildPrompt(descriptionImage: string): string {
  return `${BRAND_PREFIX}${descriptionImage}`;
}

async function generateWithOpenAI(prompt: string): Promise<Buffer> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("IMAGE_PROVIDER=openai requiert la variable d'environnement OPENAI_API_KEY.");
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      n: 1,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Génération d'image OpenAI échouée (${response.status}) : ${errorText}`);
  }

  const data = (await response.json()) as { data?: Array<{ b64_json?: string }> };
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("Réponse OpenAI sans image (champ b64_json manquant).");
  }

  return Buffer.from(b64, "base64");
}

async function generateWithIdeogram(prompt: string): Promise<Buffer> {
  const apiKey = process.env.IDEOGRAM_API_KEY;
  if (!apiKey) {
    throw new Error("IMAGE_PROVIDER=ideogram requiert la variable d'environnement IDEOGRAM_API_KEY.");
  }

  const response = await fetch("https://api.ideogram.ai/generate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Api-Key": apiKey,
    },
    body: JSON.stringify({
      image_request: {
        prompt,
        aspect_ratio: "ASPECT_1_1",
        model: "V_2",
        magic_prompt_option: "AUTO",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Génération d'image Ideogram échouée (${response.status}) : ${errorText}`);
  }

  const data = (await response.json()) as { data?: Array<{ url?: string }> };
  const imageUrl = data.data?.[0]?.url;
  if (!imageUrl) {
    throw new Error("Réponse Ideogram sans URL d'image.");
  }

  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(`Téléchargement de l'image Ideogram échoué (${imageResponse.status}).`);
  }

  return Buffer.from(await imageResponse.arrayBuffer());
}

async function saveToTmp(buffer: Buffer, themeKey: string): Promise<string> {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const fileName = `${themeKey}-${Date.now()}.png`;
  const filePath = path.join(OUTPUT_DIR, fileName);
  await fs.writeFile(filePath, buffer);
  return filePath;
}

/** Pioche une affiche déjà produite dans /assets/banque, en évitant celles publiées ces 7 derniers jours. */
async function pickFromBanque(): Promise<GeneratedImage> {
  let files: string[];
  try {
    files = (await fs.readdir(BANQUE_DIR)).filter((f) => /\.(png|jpe?g)$/i.test(f));
  } catch {
    throw new Error(`Dossier de banque d'images introuvable : ${BANQUE_DIR}`);
  }

  if (files.length === 0) {
    throw new Error(`Aucune image disponible dans ${BANQUE_DIR} pour IMAGE_PROVIDER=banque.`);
  }

  const recentRefs = await getRecentImageRefs(RECENT_WINDOW);
  const recentBasenames = new Set(recentRefs.map((ref) => path.basename(ref)));

  let candidates = files.filter((f) => !recentBasenames.has(f));
  if (candidates.length === 0) {
    candidates = files;
  }

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  return { type: "file", value: path.join(BANQUE_DIR, chosen) };
}

/**
 * Génère l'image carrée 1080x1080 du jour à partir de la description fournie
 * par describe.ts, selon le fournisseur configuré (IMAGE_PROVIDER).
 */
export async function generateDailyImage(
  descriptionImage: string,
  themeKey: string
): Promise<GeneratedImage> {
  const provider = (process.env.IMAGE_PROVIDER || "openai").toLowerCase();

  if (provider === "banque") {
    return pickFromBanque();
  }

  const prompt = buildPrompt(descriptionImage);

  let rawBuffer: Buffer;
  if (provider === "openai") {
    rawBuffer = await generateWithOpenAI(prompt);
  } else if (provider === "ideogram") {
    rawBuffer = await generateWithIdeogram(prompt);
  } else {
    throw new Error(
      `IMAGE_PROVIDER inconnu : "${provider}". Valeurs acceptées : openai, ideogram, banque.`
    );
  }

  const squared = await sharp(rawBuffer)
    .resize(IMAGE_SIZE, IMAGE_SIZE, { fit: "cover" })
    .png()
    .toBuffer();

  const filePath = await saveToTmp(squared, themeKey);
  return { type: "file", value: filePath };
}
