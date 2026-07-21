import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Retourne un client Supabase singleton, initialisé à partir des variables
 * d'environnement. Échoue immédiatement si la configuration est incomplète.
 */
export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Configuration Supabase manquante : SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis."
    );
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });

  return client;
}
