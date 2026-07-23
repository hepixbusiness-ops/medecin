import { config as loadEnv } from "dotenv";
loadEnv();

import { promises as fs } from "fs";
import path from "path";
import { listAllRecords, LibraryRecord } from "./airtableClient";

function log(message: string): void {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function bool(value: unknown): boolean {
  return value === true;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Récupère l'image en pièce jointe et la convertit en data: URI (pour un fichier HTML autonome et durable). */
async function imageToDataUri(record: LibraryRecord): Promise<string | null> {
  const attachments = record.fields["Image"];
  if (!Array.isArray(attachments) || attachments.length === 0) return null;

  const first = attachments[0] as { url?: string; type?: string };
  if (!first.url) return null;

  const response = await fetch(first.url);
  if (!response.ok) return null;

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = first.type || "image/png";
  return `data:${contentType};base64,${buffer.toString("base64")}`;
}

interface ReseauLien {
  cle: string;
  label: string;
  champ: string;
  ouvrir: string;
}

function buildReseaux(): ReseauLien[] {
  const facebookPageId = process.env.FB_PAGE_ID;
  const facebookUrl = facebookPageId
    ? `https://www.facebook.com/${encodeURIComponent(facebookPageId)}`
    : "https://www.facebook.com/";

  return [
    { cle: "facebook", label: "Facebook", champ: "Description Facebook", ouvrir: facebookUrl },
    { cle: "instagram", label: "Instagram", champ: "Description Instagram", ouvrir: "https://www.instagram.com/" },
    { cle: "tiktok", label: "TikTok", champ: "Description TikTok", ouvrir: "https://www.tiktok.com/upload" },
    { cle: "linkedin", label: "LinkedIn", champ: "Description LinkedIn", ouvrir: "https://www.linkedin.com/feed/?shareActive=true" },
    { cle: "youtube", label: "YouTube", champ: "Description YouTube", ouvrir: "https://studio.youtube.com/" },
  ];
}

function buildCard(record: LibraryRecord, imageDataUri: string | null, reseaux: ReseauLien[]): string {
  const f = record.fields;
  const titre = str(f["Titre"]) || str(f["Nom"]) || "Sans titre";
  const metier = str(f["Metier"]);
  const categorie = str(f["Categorie"]);
  const statut = str(f["Statut"]) || "Brouillon";
  const doublon = bool(f["Doublon detecte"]);

  const img = imageDataUri
    ? `<img src="${imageDataUri}" alt="${escapeHtml(titre)}" class="visuel" data-filename="${escapeHtml(titre)}.png">`
    : `<div class="visuel visuel-vide">Aucune image</div>`;

  const onglets = reseaux
    .map(
      (r, i) => `<button class="onglet${i === 0 ? " actif" : ""}" data-cible="${r.cle}-${record.id}">${r.label}</button>`
    )
    .join("");

  const panneaux = reseaux
    .map((r, i) => {
      const texte = str(f[r.champ]) || "(aucun texte généré pour ce réseau)";
      return `
      <div class="panneau${i === 0 ? " actif" : ""}" id="${r.cle}-${record.id}">
        <textarea readonly class="legende">${escapeHtml(texte)}</textarea>
        <div class="actions">
          <button class="btn btn-copier" data-copier="${r.cle}-${record.id}">Copier la légende</button>
          <a class="btn btn-ouvrir" href="${r.ouvrir}" target="_blank" rel="noopener">Ouvrir ${r.label}</a>
        </div>
      </div>`;
    })
    .join("");

  return `
  <article class="carte" data-metier="${escapeHtml(metier)}" data-statut="${escapeHtml(statut)}">
    <div class="carte-visuel">
      ${img}
      <button class="btn btn-telecharger" data-telecharger="${record.id}">Télécharger l'image</button>
    </div>
    <div class="carte-corps">
      <div class="badges">
        <span class="badge badge-metier">${escapeHtml(metier || "Métier non défini")}</span>
        <span class="badge badge-categorie">${escapeHtml(categorie || "Catégorie non définie")}</span>
        <span class="badge badge-statut badge-statut-${escapeHtml(statut.toLowerCase().replace(/\s+/g, "-"))}">${escapeHtml(statut)}</span>
        ${doublon ? `<span class="badge badge-doublon">⚠ Doublon potentiel</span>` : ""}
      </div>
      <h3>${escapeHtml(titre)}</h3>
      <div class="onglets">${onglets}</div>
      ${panneaux}
    </div>
  </article>`;
}

const STYLE = `
  :root { --bg:#FAFAF8; --carte:#FFFFFF; --ink:#1C1917; --ink-soft:#57534E; --ligne:#E7E4DE; --accent:#7C3AED; --accent-wash:#F3ECFF; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--ink); font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
  header { padding:28px 32px; border-bottom:1px solid var(--ligne); background:var(--carte); position:sticky; top:0; z-index:5; }
  header h1 { margin:0 0 4px; font-size:20px; }
  header p { margin:0; color:var(--ink-soft); font-size:13px; }
  .filtres { display:flex; gap:10px; margin-top:14px; flex-wrap:wrap; }
  .filtres select, .filtres input { padding:7px 10px; border:1px solid var(--ligne); border-radius:8px; font-size:13px; background:var(--carte); color:var(--ink); }
  main { max-width:1400px; margin:0 auto; padding:28px 32px 80px; display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:20px; }
  .carte { background:var(--carte); border:1px solid var(--ligne); border-radius:14px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 1px 2px rgba(0,0,0,.04); }
  .carte-visuel { position:relative; }
  .visuel { width:100%; aspect-ratio:1/1; object-fit:cover; display:block; background:#eee; }
  .visuel-vide { display:flex; align-items:center; justify-content:center; color:#999; font-size:13px; }
  .btn-telecharger { position:absolute; bottom:10px; right:10px; }
  .carte-corps { padding:16px; display:flex; flex-direction:column; gap:10px; }
  h3 { margin:0; font-size:15px; line-height:1.3; }
  .badges { display:flex; flex-wrap:wrap; gap:6px; }
  .badge { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.03em; padding:3px 9px; border-radius:99px; background:var(--accent-wash); color:var(--accent); }
  .badge-doublon { background:#FEF3C7; color:#92400E; }
  .onglets { display:flex; gap:4px; flex-wrap:wrap; border-bottom:1px solid var(--ligne); padding-bottom:8px; }
  .onglet { border:none; background:none; padding:5px 10px; border-radius:7px; font-size:12px; cursor:pointer; color:var(--ink-soft); }
  .onglet.actif { background:var(--accent); color:#fff; }
  .panneau { display:none; flex-direction:column; gap:8px; }
  .panneau.actif { display:flex; }
  .legende { width:100%; min-height:110px; resize:vertical; border:1px solid var(--ligne); border-radius:8px; padding:8px 10px; font-size:12.5px; font-family:inherit; background:#FAFAF8; color:var(--ink); }
  .actions { display:flex; gap:8px; flex-wrap:wrap; }
  .btn { border:1px solid var(--ligne); background:var(--carte); color:var(--ink); font-size:12px; font-weight:600; padding:7px 12px; border-radius:8px; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; }
  .btn-copier { background:var(--accent); color:#fff; border-color:var(--accent); }
  .btn-copier.copie { background:#16A34A; border-color:#16A34A; }
  .carte.masquee { display:none; }
`;

const SCRIPT = `
  document.querySelectorAll('.onglets').forEach(function(onglets) {
    onglets.addEventListener('click', function(e) {
      var bouton = e.target.closest('.onglet');
      if (!bouton) return;
      var carte = bouton.closest('.carte');
      carte.querySelectorAll('.onglet').forEach(function(o) { o.classList.remove('actif'); });
      carte.querySelectorAll('.panneau').forEach(function(p) { p.classList.remove('actif'); });
      bouton.classList.add('actif');
      document.getElementById(bouton.dataset.cible).classList.add('actif');
    });
  });

  document.querySelectorAll('[data-copier]').forEach(function(bouton) {
    bouton.addEventListener('click', function() {
      var texte = document.getElementById(bouton.dataset.copier).querySelector('.legende').value;
      navigator.clipboard.writeText(texte).then(function() {
        bouton.classList.add('copie');
        var original = bouton.textContent;
        bouton.textContent = 'Copié !';
        setTimeout(function() { bouton.classList.remove('copie'); bouton.textContent = original; }, 1500);
      });
    });
  });

  document.querySelectorAll('[data-telecharger]').forEach(function(bouton) {
    bouton.addEventListener('click', function() {
      var carte = bouton.closest('.carte');
      var img = carte.querySelector('img.visuel');
      if (!img) return;
      var lien = document.createElement('a');
      lien.href = img.src;
      lien.download = (img.dataset.filename || 'image') + '.png';
      lien.click();
    });
  });

  function appliquerFiltres() {
    var metier = document.getElementById('filtre-metier').value;
    var statut = document.getElementById('filtre-statut').value;
    var recherche = document.getElementById('filtre-recherche').value.toLowerCase();
    document.querySelectorAll('.carte').forEach(function(carte) {
      var okMetier = !metier || carte.dataset.metier === metier;
      var okStatut = !statut || carte.dataset.statut === statut;
      var okRecherche = !recherche || carte.textContent.toLowerCase().indexOf(recherche) !== -1;
      carte.classList.toggle('masquee', !(okMetier && okStatut && okRecherche));
    });
  }
  ['filtre-metier', 'filtre-statut'].forEach(function(id) {
    document.getElementById(id).addEventListener('change', appliquerFiltres);
  });
  document.getElementById('filtre-recherche').addEventListener('input', appliquerFiltres);
`;

function buildFiltreOptions(values: string[]): string {
  const unique = Array.from(new Set(values.filter(Boolean))).sort();
  return unique.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
}

async function main(): Promise<void> {
  log("Récupération des publications depuis Airtable...");
  const records = await listAllRecords();
  log(`${records.length} publication(s) trouvée(s). Téléchargement des images...`);

  const reseaux = buildReseaux();
  const cartes: string[] = [];

  for (const record of records) {
    const imageDataUri = await imageToDataUri(record);
    cartes.push(buildCard(record, imageDataUri, reseaux));
  }

  const metiers = buildFiltreOptions(records.map((r) => str(r.fields["Metier"])));
  const statuts = buildFiltreOptions(records.map((r) => str(r.fields["Statut"]) || "Brouillon"));

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>ProRDV — Bibliothèque marketing</title>
<style>${STYLE}</style>
</head>
<body>
<header>
  <h1>Bibliothèque marketing ProRDV</h1>
  <p>${records.length} publication(s) — copie la légende du réseau visé, télécharge l'image, ouvre le réseau, publie manuellement.</p>
  <div class="filtres">
    <select id="filtre-metier"><option value="">Tous les métiers</option>${metiers}</select>
    <select id="filtre-statut"><option value="">Tous les statuts</option>${statuts}</select>
    <input id="filtre-recherche" type="search" placeholder="Rechercher...">
  </div>
</header>
<main>
${cartes.join("\n")}
</main>
<script>${SCRIPT}</script>
</body>
</html>`;

  const outDir = path.resolve(process.cwd(), "tmp");
  await fs.mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, "bibliotheque.html");
  await fs.writeFile(outFile, html, "utf-8");

  log(`Terminé. Ouvre ce fichier dans ton navigateur : ${outFile}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Échec : ${message}`);
  process.exitCode = 1;
});
