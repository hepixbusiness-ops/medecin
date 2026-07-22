import { airtableRequest } from "./airtable";

export type PostStatus = "success" | "error";

export interface PostAttempt {
  themeKey: string;
  description?: string | null;
  imageRef?: string | null;
  fbPostId?: string | null;
  status: PostStatus;
  error?: string | null;
}

interface AirtableFields {
  "Theme Key"?: string;
  Description?: string;
  "Image Ref"?: string;
  "FB Post ID"?: string;
  Status?: PostStatus;
  Error?: string;
  "Published At"?: string;
}

interface AirtableRecord {
  id: string;
  fields: AirtableFields;
}

interface AirtableListResponse {
  records: AirtableRecord[];
}

function buildQuery(params: Record<string, string>): string {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : "";
}

async function fetchRecentSuccess(limit: number): Promise<AirtableRecord[]> {
  const query = buildQuery({
    maxRecords: String(limit),
    "sort[0][field]": "Published At",
    "sort[0][direction]": "desc",
    filterByFormula: '{Status}="success"',
  });

  const data = await airtableRequest<AirtableListResponse>(query);
  return data.records;
}

/**
 * Renvoie les `limit` derniers theme_key publiés avec succès, du plus récent
 * au plus ancien. Sert de base à la rotation sans répétition récente.
 */
export async function getRecentThemeKeys(limit = 7): Promise<string[]> {
  const records = await fetchRecentSuccess(limit);
  return records.map((r) => r.fields["Theme Key"]).filter((v): v is string => Boolean(v));
}

/**
 * Renvoie les `limit` derniers image_ref publiés avec succès. Sert au mode
 * IMAGE_PROVIDER=banque pour éviter de repiocher une image récente.
 */
export async function getRecentImageRefs(limit = 7): Promise<string[]> {
  const records = await fetchRecentSuccess(limit);
  return records.map((r) => r.fields["Image Ref"]).filter((v): v is string => Boolean(v));
}

/**
 * Compte le nombre de publications réussies aujourd'hui (jour UTC), pour
 * garantir qu'on ne dépasse jamais le quota quotidien de publications.
 */
export async function countPublishedToday(): Promise<number> {
  const records = await fetchRecentSuccess(20);
  const startOfDayUtc = new Date();
  startOfDayUtc.setUTCHours(0, 0, 0, 0);
  const startMs = startOfDayUtc.getTime();

  return records.filter((record) => {
    const publishedAt = record.fields["Published At"];
    return publishedAt ? new Date(publishedAt).getTime() >= startMs : false;
  }).length;
}

/**
 * Enregistre une tentative de publication (succès ou échec) dans l'historique.
 */
export async function recordAttempt(attempt: PostAttempt): Promise<void> {
  const fields: AirtableFields = {
    "Theme Key": attempt.themeKey,
    Status: attempt.status,
    "Published At": new Date().toISOString(),
  };

  if (attempt.description) fields.Description = attempt.description;
  if (attempt.imageRef) fields["Image Ref"] = attempt.imageRef;
  if (attempt.fbPostId) fields["FB Post ID"] = attempt.fbPostId;
  if (attempt.error) fields.Error = attempt.error;

  await airtableRequest("", {
    method: "POST",
    body: JSON.stringify({ records: [{ fields }] }),
  });
}
