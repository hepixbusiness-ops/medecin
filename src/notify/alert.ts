export interface FailureAlert {
  date: string;
  themeKey: string | null;
  error: string;
}

/**
 * Envoie une alerte d'échec vers le webhook n8n configuré (N8N_ALERT_WEBHOOK_URL).
 * Si la variable n'est pas définie, se contente d'un log console. Ne lève
 * jamais d'erreur : une alerte ratée ne doit pas faire échouer l'exécution.
 */
export async function alertFailure(alert: FailureAlert): Promise<void> {
  const webhookUrl = process.env.N8N_ALERT_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error(`[alert] Échec de publication (${alert.date}, thème: ${alert.themeKey ?? "?"}) : ${alert.error}`);
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(alert),
    });

    if (!response.ok) {
      console.error(`[alert] Webhook n8n a répondu HTTP ${response.status}, alerte non confirmée.`);
    }
  } catch (error) {
    console.error(`[alert] Envoi de l'alerte au webhook n8n impossible : ${(error as Error).message}`);
  }
}
