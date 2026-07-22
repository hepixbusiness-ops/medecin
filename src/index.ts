import { config } from "dotenv";
config();

import { describeToday } from "./content/describe";
import { generateDailyImage } from "./image/generate";
import { validatePageToken } from "./facebook/token";
import { publishPost } from "./facebook/publish";
import { countPublishedToday, recordAttempt } from "./store/history";
import { alertFailure } from "./notify/alert";

/** Nombre de publications Facebook générées par jour. */
const POSTS_PER_DAY = 3;

function log(message: string): void {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

/** Génère et publie un post (thème + image + légende). Renvoie true en cas de succès. */
async function publishOne(index: number, total: number, usedThemeKeys: string[]): Promise<boolean> {
  let themeKey: string | null = null;

  try {
    log(`[${index}/${total}] Sélection du thème et génération de la description...`);
    const daily = await describeToday(usedThemeKeys);
    themeKey = daily.themeKey;
    usedThemeKeys.push(themeKey);
    log(`[${index}/${total}] Thème sélectionné : ${themeKey}`);

    log(`[${index}/${total}] Génération de l'image...`);
    const image = await generateDailyImage(daily.descriptionImage, themeKey);
    log(`[${index}/${total}] Image prête (${image.type}) : ${image.value}`);

    log(`[${index}/${total}] Publication sur la Page Facebook...`);
    const fbPostId = await publishPost(image, daily.legende);
    log(`[${index}/${total}] Publication réussie, ID du post : ${fbPostId}`);

    await recordAttempt({
      themeKey,
      description: daily.descriptionImage,
      imageRef: image.value,
      fbPostId,
      status: "success",
    });

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`[${index}/${total}] Échec : ${message}`);

    try {
      await recordAttempt({
        themeKey: themeKey ?? "inconnu",
        status: "error",
        error: message,
      });
    } catch (recordError) {
      log(
        `[${index}/${total}] Impossible d'enregistrer l'échec dans l'historique : ${
          recordError instanceof Error ? recordError.message : String(recordError)
        }`
      );
    }

    await alertFailure({
      date: new Date().toISOString(),
      themeKey,
      error: message,
    });

    return false;
  }
}

async function runDryRun(): Promise<void> {
  log(`--dry-run activé : génération de ${POSTS_PER_DAY} description(s)/image(s), sans publication.`);
  const usedThemeKeys: string[] = [];

  for (let i = 1; i <= POSTS_PER_DAY; i++) {
    const daily = await describeToday(usedThemeKeys);
    usedThemeKeys.push(daily.themeKey);
    log(`[${i}/${POSTS_PER_DAY}] Thème : ${daily.themeKey}`);

    const image = await generateDailyImage(daily.descriptionImage, daily.themeKey);
    console.log(`--- [${i}/${POSTS_PER_DAY}] Légende ---\n${daily.legende}\n`);
    console.log(`--- [${i}/${POSTS_PER_DAY}] Image ---\n${image.value}\n`);
  }
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  log(`Démarrage de l'agent ProRDV (${dryRun ? "dry-run" : "publication réelle"})`);

  if (dryRun) {
    await runDryRun();
    return;
  }

  try {
    log("Validation du token de Page Facebook...");
    await validatePageToken();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`Échec : ${message}`);
    await alertFailure({ date: new Date().toISOString(), themeKey: null, error: message });
    process.exitCode = 1;
    return;
  }

  const alreadyPublished = await countPublishedToday();
  const remaining = POSTS_PER_DAY - alreadyPublished;

  if (remaining <= 0) {
    log(`${POSTS_PER_DAY} publication(s) déjà réalisée(s) aujourd'hui : arrêt sans action.`);
    return;
  }

  log(`${alreadyPublished}/${POSTS_PER_DAY} déjà publiée(s) aujourd'hui, ${remaining} restante(s) à générer.`);

  const usedThemeKeys: string[] = [];
  let hasFailure = false;

  for (let i = alreadyPublished + 1; i <= POSTS_PER_DAY; i++) {
    const success = await publishOne(i, POSTS_PER_DAY, usedThemeKeys);
    if (!success) hasFailure = true;
  }

  if (hasFailure) {
    process.exitCode = 1;
  }
}

main();
