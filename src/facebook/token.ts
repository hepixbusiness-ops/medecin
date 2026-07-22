import { requireEnv } from "../env";

const DEFAULT_GRAPH_VERSION = "v21.0";

export interface PageTokenInfo {
  expiresAt: number | null;
  scopes: string[];
}

interface DebugTokenResponse {
  data?: {
    is_valid?: boolean;
    expires_at?: number;
    scopes?: string[];
  };
  error?: { message?: string };
}

function graphVersion(): string {
  return process.env.GRAPH_API_VERSION || DEFAULT_GRAPH_VERSION;
}

/**
 * Valide FB_PAGE_ACCESS_TOKEN via l'endpoint debug_token de la Graph API.
 * Échoue avec un message clair si le token est absent, invalide, expiré ou
 * sans la permission pages_manage_posts requise pour publier.
 */
export async function validatePageToken(): Promise<PageTokenInfo> {
  const token = requireEnv("FB_PAGE_ACCESS_TOKEN");
  requireEnv("FB_PAGE_ID");

  const url = `https://graph.facebook.com/${graphVersion()}/debug_token?input_token=${encodeURIComponent(
    token
  )}&access_token=${encodeURIComponent(token)}`;

  const response = await fetch(url);
  const data = (await response.json()) as DebugTokenResponse;

  if (!response.ok || data.error) {
    throw new Error(
      `Impossible de valider le token de Page Facebook : ${data.error?.message ?? response.statusText}`
    );
  }

  const info = data.data;
  if (!info?.is_valid) {
    throw new Error(
      "FB_PAGE_ACCESS_TOKEN est invalide ou expiré. Régénère un token de Page (voir README)."
    );
  }

  if (info.expires_at && info.expires_at > 0 && info.expires_at * 1000 < Date.now()) {
    throw new Error("FB_PAGE_ACCESS_TOKEN a expiré. Régénère un token de Page (voir README).");
  }

  if (!info.scopes?.includes("pages_manage_posts")) {
    throw new Error(
      "FB_PAGE_ACCESS_TOKEN n'a pas la permission pages_manage_posts, requise pour publier sur la Page."
    );
  }

  return {
    expiresAt: info.expires_at && info.expires_at > 0 ? info.expires_at : null,
    scopes: info.scopes ?? [],
  };
}
