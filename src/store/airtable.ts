const AIRTABLE_API_BASE = "https://api.airtable.com/v0";

interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
}

let config: AirtableConfig | null = null;

function getConfig(): AirtableConfig {
  if (config) return config;

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Facebook Posts";

  if (!apiKey || !baseId) {
    throw new Error(
      "Configuration Airtable manquante : AIRTABLE_API_KEY (Personal Access Token) et AIRTABLE_BASE_ID sont requis."
    );
  }

  config = { apiKey, baseId, tableName };
  return config;
}

/**
 * Appelle l'API REST Airtable sur la table configurée (AIRTABLE_TABLE_NAME).
 * `path` est ajouté tel quel après le nom de table (ex: "?maxRecords=5").
 */
export async function airtableRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { apiKey, baseId, tableName } = getConfig();
  const url = `${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}${path}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Appel Airtable échoué (${response.status}) : ${errorText}`);
  }

  return (await response.json()) as T;
}
