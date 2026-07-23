import { promises as fs } from "fs";
import path from "path";
import { requireEnv } from "../env";

const AIRTABLE_API_BASE = "https://api.airtable.com/v0";
const AIRTABLE_CONTENT_BASE = "https://content.airtable.com/v0";

interface LibraryConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
}

let config: LibraryConfig | null = null;

function getConfig(): LibraryConfig {
  if (config) return config;

  const apiKey = requireEnv("AIRTABLE_API_KEY");
  const baseId = requireEnv("LIBRARY_AIRTABLE_BASE_ID");
  const tableName = process.env.LIBRARY_AIRTABLE_TABLE_NAME || "Publications";

  config = { apiKey, baseId, tableName };
  return config;
}

async function apiRequest<T>(pathSuffix: string, init: RequestInit = {}): Promise<T> {
  const { apiKey, baseId, tableName } = getConfig();
  const url = `${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}${pathSuffix}`;

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
    throw new Error(`Appel Airtable (bibliothèque marketing) échoué (${response.status}) : ${errorText}`);
  }

  return (await response.json()) as T;
}

export interface LibraryRecord {
  id: string;
  fields: Record<string, unknown>;
}

/** Renvoie les `limit` derniers enregistrements, du plus récent au plus ancien (pour le dédoublonnage). */
export async function listRecentRecords(limit = 200): Promise<LibraryRecord[]> {
  const query = new URLSearchParams({
    maxRecords: String(limit),
    "sort[0][field]": "Date de creation",
    "sort[0][direction]": "desc",
  }).toString();

  const data = await apiRequest<{ records: LibraryRecord[] }>(`?${query}`);
  return data.records;
}

/** Renvoie TOUS les enregistrements (pagination automatique), du plus récent au plus ancien. */
export async function listAllRecords(): Promise<LibraryRecord[]> {
  const records: LibraryRecord[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams({
      "sort[0][field]": "Date de creation",
      "sort[0][direction]": "desc",
    });
    if (offset) params.set("offset", offset);

    const data = await apiRequest<{ records: LibraryRecord[]; offset?: string }>(`?${params.toString()}`);
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

/** Crée un nouvel enregistrement de publication (sans l'image, ajoutée séparément via uploadImageAttachment). */
export async function createRecord(fields: Record<string, unknown>): Promise<LibraryRecord> {
  const data = await apiRequest<{ records: LibraryRecord[] }>("", {
    method: "POST",
    body: JSON.stringify({ records: [{ fields }] }),
  });

  const record = data.records[0];
  if (!record) {
    throw new Error("Airtable n'a renvoyé aucun enregistrement créé.");
  }
  return record;
}

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function detectContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return CONTENT_TYPE_BY_EXT[ext] || "application/octet-stream";
}

/** Envoie le fichier image en pièce jointe sur le champ "Image" de l'enregistrement donné. */
export async function uploadImageAttachment(recordId: string, filePath: string): Promise<void> {
  const { apiKey, baseId } = getConfig();
  const fieldName = process.env.LIBRARY_IMAGE_FIELD || "Image";

  const buffer = await fs.readFile(filePath);
  const base64 = buffer.toString("base64");
  const contentType = detectContentType(filePath);

  const url = `${AIRTABLE_CONTENT_BASE}/${baseId}/${recordId}/${encodeURIComponent(fieldName)}/uploadAttachment`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      contentType,
      file: base64,
      filename: path.basename(filePath),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Envoi de l'image vers Airtable échoué (${response.status}) : ${errorText}`);
  }
}
