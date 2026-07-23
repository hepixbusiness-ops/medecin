import { config as loadEnv } from "dotenv";
loadEnv();

import { promises as fs } from "fs";
import path from "path";
import { analyserImage } from "./vision";
import { detecterDoublon } from "./duplicates";
import { createRecord, uploadImageAttachment, listAllRecords } from "./airtableClient";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

function log(message: string): void {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

/** Analyse une image et crée son enregistrement Airtable. Renvoie le "Nom" utilisé (préfixé par le nom de fichier, pour le dédoublonnage). */
async function analyserEtEnregistrer(filePath: string): Promise<string> {
  const resolved = path.resolve(filePath);
  const filename = path.basename(resolved);
  log(`Analyse de l'image : ${filename}`);

  const analyse = await analyserImage(resolved);
  log(`Analyse terminée : "${analyse.titre}" (${analyse.metier} / ${analyse.categorie})`);

  log("Vérification des doublons...");
  const doublon = await detecterDoublon(analyse.titre, analyse.descriptionFacebook, analyse.metier);
  if (doublon.estDoublon) {
    log(`Doublon potentiel détecté (proche de "${doublon.correspondance}") — enregistré quand même, marqué comme doublon.`);
  }

  const remarques = doublon.estDoublon
    ? `${analyse.remarquesIA}\n\nDoublon potentiel : similaire à "${doublon.correspondance}".`
    : analyse.remarquesIA;

  const nom = `${filename} — ${analyse.nom}`;

  const fields: Record<string, unknown> = {
    Nom: nom,
    Titre: analyse.titre,
    Accroche: analyse.accroche,
    "Description Facebook": analyse.descriptionFacebook,
    "Description Instagram": analyse.descriptionInstagram,
    "Description TikTok": analyse.descriptionTiktok,
    "Description LinkedIn": analyse.descriptionLinkedin,
    "Description YouTube": analyse.descriptionYoutube,
    CTA: analyse.cta,
    Hashtags: analyse.hashtags,
    "Mots-cles": analyse.motsCles,
    Resume: analyse.resume,
    "Texte alternatif": analyse.texteAlternatif,
    Metier: analyse.metier,
    Secteur: analyse.secteur,
    Fonctionnalite: analyse.fonctionnalite,
    Categorie: analyse.categorie,
    "Objectif marketing": analyse.objectifMarketing,
    "Type de publication": analyse.typePublication,
    "Style graphique": analyse.styleGraphique,
    "Couleur dominante": analyse.couleurDominante,
    Format: analyse.format,
    Langue: analyse.langue,
    Auteur: process.env.LIBRARY_AUTHOR || "Agent IA",
    "Date de creation": new Date().toISOString(),
    Version: 1,
    Statut: "Brouillon",
    Valide: false,
    Publie: false,
    "Score qualite": analyse.scoreQualite,
    "Score marketing": analyse.scoreMarketing,
    "Presence logo": analyse.presenceLogo,
    "Respect charte graphique": analyse.respectCharteGraphique,
    "Doublon detecte": doublon.estDoublon,
    "Remarques IA": remarques,
  };

  log("Création de l'enregistrement Airtable...");
  const record = await createRecord(fields);

  log("Envoi de l'image en pièce jointe...");
  await uploadImageAttachment(record.id, resolved);

  log(`Terminé : ${filename} → enregistrement ${record.id}`);
  return nom;
}

async function resoudreFichiers(cible: string): Promise<string[]> {
  const resolved = path.resolve(cible);
  const stats = await fs.stat(resolved).catch(() => null);
  if (!stats) {
    throw new Error(`Chemin introuvable : ${resolved}`);
  }

  if (!stats.isDirectory()) {
    return [resolved];
  }

  const entries = await fs.readdir(resolved);
  return entries
    .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .map((f) => path.join(resolved, f))
    .sort();
}

async function main(): Promise<void> {
  const cible = process.argv[2];
  if (!cible) {
    console.error("Usage : npm run analyse-image -- <chemin-vers-image-ou-dossier>");
    process.exitCode = 1;
    return;
  }

  let fichiers: string[];
  try {
    fichiers = await resoudreFichiers(cible);
  } catch (error) {
    console.error((error as Error).message);
    process.exitCode = 1;
    return;
  }

  if (fichiers.length === 0) {
    log("Aucune image trouvée à analyser.");
    return;
  }

  log(`${fichiers.length} image(s) à traiter.`);
  log("Récupération des publications déjà en bibliothèque (pour éviter de retraiter une image déjà analysée)...");
  const existants = await listAllRecords();
  const nomsExistants = new Set(
    existants.map((r) => (typeof r.fields["Nom"] === "string" ? (r.fields["Nom"] as string) : "")).filter(Boolean)
  );

  let echecs = 0;

  for (const fichier of fichiers) {
    const filename = path.basename(fichier);
    const dejaPresent = [...nomsExistants].some((nom) => nom.startsWith(`${filename} —`));
    if (dejaPresent) {
      log(`Ignoré (déjà analysée précédemment) : ${filename}`);
      continue;
    }

    try {
      const nom = await analyserEtEnregistrer(fichier);
      nomsExistants.add(nom);
    } catch (error) {
      echecs++;
      log(`Échec sur ${filename} : ${(error as Error).message}`);
    }
  }

  if (echecs > 0) {
    process.exitCode = 1;
  }
}

main();
