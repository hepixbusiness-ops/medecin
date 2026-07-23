import { config as loadEnv } from "dotenv";
loadEnv();

import path from "path";
import { analyserImage } from "./vision";
import { detecterDoublon } from "./duplicates";
import { createRecord, uploadImageAttachment } from "./airtableClient";

function log(message: string): void {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

async function main(): Promise<void> {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage : npm run analyse-image -- <chemin-vers-image>");
    process.exitCode = 1;
    return;
  }

  const resolved = path.resolve(filePath);
  log(`Analyse de l'image : ${resolved}`);

  try {
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

    const fields: Record<string, unknown> = {
      Nom: analyse.nom,
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

    log(`Terminé. Enregistrement créé : ${record.id}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`Échec : ${message}`);
    process.exitCode = 1;
  }
}

main();
