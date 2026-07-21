import { getSupabaseClient } from "./supabase";

const TABLE = "facebook_posts";

export type PostStatus = "success" | "error";

export interface PostAttempt {
  themeKey: string;
  description?: string | null;
  imageRef?: string | null;
  fbPostId?: string | null;
  status: PostStatus;
  error?: string | null;
}

/**
 * Renvoie les `limit` derniers theme_key publiés avec succès, du plus récent
 * au plus ancien. Sert de base à la rotation sans répétition récente.
 */
export async function getRecentThemeKeys(limit = 7): Promise<string[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("theme_key")
    .eq("status", "success")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Lecture de l'historique Supabase impossible : ${error.message}`);
  }

  return (data ?? []).map((row) => row.theme_key as string);
}

/**
 * Renvoie les `limit` derniers image_ref publiés avec succès. Sert au mode
 * IMAGE_PROVIDER=banque pour éviter de repiocher une image récente.
 */
export async function getRecentImageRefs(limit = 7): Promise<string[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("image_ref")
    .eq("status", "success")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Lecture de l'historique des images impossible : ${error.message}`);
  }

  return (data ?? [])
    .map((row) => row.image_ref as string | null)
    .filter((ref): ref is string => Boolean(ref));
}

/**
 * Vérifie si une publication a déjà réussi aujourd'hui (jour UTC), pour
 * garantir qu'on ne publie jamais deux fois le même jour.
 */
export async function hasPublishedToday(): Promise<boolean> {
  const supabase = getSupabaseClient();

  const startOfDayUtc = new Date();
  startOfDayUtc.setUTCHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from(TABLE)
    .select("id")
    .eq("status", "success")
    .gte("published_at", startOfDayUtc.toISOString())
    .limit(1);

  if (error) {
    throw new Error(`Vérification de publication du jour impossible : ${error.message}`);
  }

  return (data ?? []).length > 0;
}

/**
 * Enregistre une tentative de publication (succès ou échec) dans l'historique.
 */
export async function recordAttempt(attempt: PostAttempt): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from(TABLE).insert({
    theme_key: attempt.themeKey,
    description: attempt.description ?? null,
    image_ref: attempt.imageRef ?? null,
    fb_post_id: attempt.fbPostId ?? null,
    status: attempt.status,
    error: attempt.error ?? null,
  });

  if (error) {
    throw new Error(`Enregistrement de l'historique Supabase impossible : ${error.message}`);
  }
}
