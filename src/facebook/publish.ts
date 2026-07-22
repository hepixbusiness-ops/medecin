import { promises as fs } from "fs";
import path from "path";
import { requireEnv } from "../env";
import type { GeneratedImage } from "../image/generate";

const DEFAULT_GRAPH_VERSION = "v21.0";
const MAX_ATTEMPTS = 2;

interface GraphApiResponse {
  id?: string;
  post_id?: string;
  error?: { message?: string; type?: string; code?: number };
}

function graphVersion(): string {
  return process.env.GRAPH_API_VERSION || DEFAULT_GRAPH_VERSION;
}

function explainGraphError(status: number, body: GraphApiResponse): string {
  const err = body.error;
  if (!err) return `Erreur Graph API inconnue (HTTP ${status}).`;

  if (err.code === 190) {
    return `Token Facebook invalide ou expiré (code 190) : ${err.message}`;
  }
  if (err.type === "OAuthException") {
    return `Permission Facebook manquante ou refusée : ${err.message}`;
  }
  if (err.code === 4 || err.code === 32 || err.code === 613) {
    return `Limite de requêtes Facebook atteinte (rate limit) : ${err.message}`;
  }
  return `Erreur Graph API (HTTP ${status}, code ${err.code ?? "?"}) : ${err.message}`;
}

function extractPostId(data: GraphApiResponse): string {
  const postId = data.post_id || data.id;
  if (!postId) {
    throw new Error("Réponse Graph API sans identifiant de post.");
  }
  return postId;
}

async function publishFromUrl(
  pageId: string,
  token: string,
  imageUrl: string,
  caption: string
): Promise<string> {
  const endpoint = `https://graph.facebook.com/${graphVersion()}/${pageId}/photos`;
  const body = new URLSearchParams({ url: imageUrl, caption, access_token: token });

  const response = await fetch(endpoint, { method: "POST", body });
  const data = (await response.json()) as GraphApiResponse;

  if (!response.ok || data.error) {
    throw new Error(explainGraphError(response.status, data));
  }

  return extractPostId(data);
}

async function publishFromFile(
  pageId: string,
  token: string,
  filePath: string,
  caption: string
): Promise<string> {
  const endpoint = `https://graph.facebook.com/${graphVersion()}/${pageId}/photos`;

  const fileBuffer = await fs.readFile(filePath);
  const form = new FormData();
  form.append("caption", caption);
  form.append("access_token", token);
  form.append("source", new Blob([fileBuffer]), path.basename(filePath));

  const response = await fetch(endpoint, { method: "POST", body: form });
  const data = (await response.json()) as GraphApiResponse;

  if (!response.ok || data.error) {
    throw new Error(explainGraphError(response.status, data));
  }

  return extractPostId(data);
}

async function attemptPublish(image: GeneratedImage, caption: string): Promise<string> {
  const pageId = requireEnv("FB_PAGE_ID");
  const token = requireEnv("FB_PAGE_ACCESS_TOKEN");

  return image.type === "url"
    ? publishFromUrl(pageId, token, image.value, caption)
    : publishFromFile(pageId, token, image.value, caption);
}

/**
 * Publie une photo + légende sur la Page Facebook. 2 tentatives en cas
 * d'échec (réseau, erreur transitoire de la Graph API).
 */
export async function publishPost(image: GeneratedImage, caption: string): Promise<string> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await attemptPublish(image, caption);
    } catch (error) {
      lastError = error;
      console.error(
        `[facebook] Tentative ${attempt}/${MAX_ATTEMPTS} échouée : ${(error as Error).message}`
      );
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
