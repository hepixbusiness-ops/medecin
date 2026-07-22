import { config } from "dotenv";
config();

import { describeToday } from "./content/describe";
import { generateDailyImage } from "./image/generate";
import { validatePageToken } from "./facebook/token";
import { publishPost } from "./facebook/publish";
import { hasPublishedToday, recordAttempt } from "./store/history";
import { alertFailure } from "./notify/alert";

function log(message: string): void {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  log(`Démarrage de l'agent ProRDV (${dryRun ? "dry-run" : "publication réelle"})`);

  let themeKey: string | null = null;

  try {
    if (!dryRun) {
      log("Validation du token de Page Facebook...");
      await validatePageToken();

      log("Vérification qu'aucune publication n'a déjà eu lieu aujourd'hui...");
      if (await hasPublishedToday()) {
        log("Une publication a déjà réussi aujourd'hui : arrêt sans action.");
        return;
      }
    }

    log("Sélection du thème et génération de la description du jour...");
    const daily = await describeToday();
    themeKey = daily.themeKey;
    log(`Thème sélectionné : ${themeKey}`);

    log("Génération de l'image du jour...");
    const image = await generateDailyImage(daily.descriptionImage, themeKey);
    log(`Image prête (${image.type}) : ${image.value}`);

    if (dryRun) {
      log("--dry-run activé : aucune publication effectuée. Aperçu du rendu ci-dessous.\n");
      console.log(`--- Légende ---\n${daily.legende}\n`);
      console.log(`--- Image ---\n${image.value}\n`);
      return;
    }

    log("Publication sur la Page Facebook...");
    const fbPostId = await publishPost(image, daily.legende);
    log(`Publication réussie, ID du post : ${fbPostId}`);

    await recordAttempt({
      themeKey,
      description: daily.descriptionImage,
      imageRef: image.value,
      fbPostId,
      status: "success",
    });
    log("Historique enregistré dans Airtable.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`Échec : ${message}`);

    if (!dryRun) {
      try {
        await recordAttempt({
          themeKey: themeKey ?? "inconnu",
          status: "error",
          error: message,
        });
      } catch (recordError) {
        log(
          `Impossible d'enregistrer l'échec dans l'historique : ${
            recordError instanceof Error ? recordError.message : String(recordError)
          }`
        );
      }

      await alertFailure({
        date: new Date().toISOString(),
        themeKey,
        error: message,
      });
    }

    process.exitCode = 1;
  }
}

main();
