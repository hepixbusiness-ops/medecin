import { config } from "dotenv";
config();

import { selectMetierDuJour, selectTypeContenu, describePost } from "./content/describe";
import { Metier } from "./content/metiers";
import { generateDailyImage } from "./image/generate";
import { validatePageToken } from "./facebook/token";
import { publishPost } from "./facebook/publish";
import { countPublishedToday, recordAttempt } from "./store/history";
import { alertFailure } from "./notify/alert";

/** Nombre de publications Facebook générées par jour (même métier, types de contenu différents). */
const POSTS_PER_DAY = 3;

function log(message: string): void {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

/** Génère et publie un post (type de contenu + image + légende) pour le métier du jour. */
async function publishOne(
  index: number,
  total: number,
  metier: Metier,
  usedTypeKeys: string[]
): Promise<boolean> {
  let themeKey: string | null = null;

  try {
    log(`[${index}/${total}] Sélection du type de contenu et génération de la description...`);
    const type = await selectTypeContenu(metier, usedTypeKeys);
    usedTypeKeys.push(type.key);

    const daily = await describePost(metier, type);
    themeKey = daily.themeKey;
    log(`[${index}/${total}] Publication : ${metier.nom} / ${type.nom} (${themeKey})`);

    log(`[${index}/${total}] Génération de l'image...`);
    const image = await generateDailyImage(daily.descriptionImage, themeKey);
    log(`[${index}/${total}] Image prête (${image.type}) : ${image.value}`);

    log(`[${index}/${total}] Publication sur la Page Facebook...`);
    const fbPostId = await publishPost(image, daily.legende);
    log(`[${index}/${total}] Publication réussie, ID du post : ${fbPostId}`);

    await recordAttempt({
      themeKey,
      description: daily.descriptionImage,
      legende: daily.legende,
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

  const metier = await selectMetierDuJour();
  log(`Métier du jour : ${metier.nom}`);

  const usedTypeKeys: string[] = [];

  for (let i = 1; i <= POSTS_PER_DAY; i++) {
    const type = await selectTypeContenu(metier, usedTypeKeys);
    usedTypeKeys.push(type.key);

    const daily = await describePost(metier, type);
    log(`[${i}/${POSTS_PER_DAY}] Type de contenu : ${type.nom} (${daily.themeKey})`);

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

  const metier = await selectMetierDuJour();
  log(`Métier du jour : ${metier.nom}`);

  const usedTypeKeys: string[] = [];
  let hasFailure = false;

  for (let i = alreadyPublished + 1; i <= POSTS_PER_DAY; i++) {
    const success = await publishOne(i, POSTS_PER_DAY, metier, usedTypeKeys);
    if (!success) hasFailure = true;
  }

  if (hasFailure) {
    process.exitCode = 1;
  }
}

main();
