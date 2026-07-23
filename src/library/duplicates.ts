import { listRecentRecords } from "./airtableClient";

const SIMILARITY_THRESHOLD = 0.6;

export interface DuplicateCheck {
  estDoublon: boolean;
  correspondance?: string;
}

function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .join(" ");
}

/** Similarité de Jaccard sur les mots des deux textes (0 = aucun rapport, 1 = identique). */
function similarite(a: string, b: string): number {
  const motsA = new Set(normaliser(a).split(" ").filter(Boolean));
  const motsB = new Set(normaliser(b).split(" ").filter(Boolean));
  if (motsA.size === 0 || motsB.size === 0) return 0;

  let intersection = 0;
  for (const mot of motsA) {
    if (motsB.has(mot)) intersection++;
  }
  const union = new Set([...motsA, ...motsB]).size;
  return intersection / union;
}

function fieldAsString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * Compare titre + description Facebook + métier aux publications existantes
 * pour repérer un doublon probable. Ne bloque jamais la création : signale
 * seulement (voir champ "Doublon detecte" dans Airtable).
 */
export async function detecterDoublon(
  titre: string,
  descriptionFacebook: string,
  metier: string
): Promise<DuplicateCheck> {
  const recents = await listRecentRecords(200);

  for (const record of recents) {
    const recordMetier = fieldAsString(record.fields["Metier"]);
    if (recordMetier && recordMetier !== metier) continue;

    const recordTitre = fieldAsString(record.fields["Titre"]);
    const recordDescription = fieldAsString(record.fields["Description Facebook"]);

    const similariteTitre = similarite(titre, recordTitre);
    const similariteDescription = similarite(descriptionFacebook, recordDescription);

    if (similariteTitre >= SIMILARITY_THRESHOLD || similariteDescription >= SIMILARITY_THRESHOLD) {
      const nom = fieldAsString(record.fields["Nom"]) || record.id;
      return { estDoublon: true, correspondance: nom };
    }
  }

  return { estDoublon: false };
}
