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
 * Échoue avec un message clair si le token est absent, invalide ou expiré.
 *
 * Ne bloque plus sur l'absence du scope OAuth "pages_manage_posts" dans
 * `scopes` : pour un token de Page dérivé d'un utilisateur système Business
 * Manager, le droit de publier est gouverné par les tâches assignées sur la
 * Page (ex. CREATE_CONTENT/MANAGE), pas par ce scope classique — qui peut
 * être absent de la réponse debug_token même quand la publication fonctionne.
 * On se contente d'avertir, et on laisse le véritable appel de publication
 * (facebook/publish.ts) faire foi.
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
    console.warn(
      "[facebook] Avertissement : pages_manage_posts absent des scopes OAuth du token. " +
        "Si le token provient d'un utilisateur système Business Manager avec la tâche CREATE_CONTENT/MANAGE " +
        "sur la Page, la publication peut fonctionner malgré tout — on continue."
    );
  }

  return {
    expiresAt: info.expires_at && info.expires_at > 0 ? info.expires_at : null,
    scopes: info.scopes ?? [],
  };
}
