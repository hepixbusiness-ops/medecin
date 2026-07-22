# ProRDV — Agent de publication Facebook automatique

Agent Node.js/TypeScript qui publie automatiquement, une fois par jour, sur la
Page Facebook ProRDV : une image générée (ou piochée dans une banque locale) +
une légende en français, avec rotation des thèmes sans répétition récente.

## Sommaire

- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation locale](#installation-locale)
- [Configuration des identifiants](#configuration-des-identifiants)
  - [Facebook](#1-facebook--fb_page_id-et-fb_page_access_token)
  - [Airtable](#2-airtable--airtable_api_key-et-airtable_base_id)
  - [Génération d'image (optionnel)](#3-génération-dimage-optionnel)
  - [Légendes par IA (optionnel)](#4-légendes-par-ia-optionnel)
- [Structure de la table Airtable](#structure-de-la-table-airtable)
- [Exécution locale](#exécution-locale)
- [Configuration GitHub Secrets](#configuration-github-secrets)
- [Planification](#planification)
- [Dépannage](#dépannage)

## Architecture

```
/src
  /content
    themes.ts        → banque de 14 thèmes rotatifs
    describe.ts       → sélection du thème du jour + description/légende
  /image
    generate.ts       → génération/sélection de l'image du jour
  /facebook
    token.ts          → validation du token de Page (debug_token)
    publish.ts         → publication photo + légende via la Graph API
  /store
    airtable.ts        → client REST Airtable
    history.ts          → lecture/écriture de l'historique des posts
  /notify
    alert.ts            → alerte en cas d'échec (webhook n8n ou log console)
  index.ts               → orchestrateur
/assets/banque            → tes affiches déjà produites (mode IMAGE_PROVIDER=banque)
/.github/workflows/daily-post.yml
```

## Prérequis

- Node.js **v20 ou supérieur**
- Un compte Facebook, administrateur de la Page ProRDV
- Un compte Airtable

## Installation locale

```bash
git clone <url-du-repo>
cd medecin
npm install
cp .env.example .env
# renseigne .env avec tes identifiants (voir section suivante)
```

## Configuration des identifiants

### 1. Facebook — `FB_PAGE_ID` et `FB_PAGE_ACCESS_TOKEN`

Deux méthodes possibles. La méthode B (Business Suite) est recommandée pour un
usage en production car le token généré n'expire pas et ne dépend pas d'une
revue d'app Meta.

#### Méthode A — Graph API Explorer (rapide, token 60 jours renouvelable)

1. Crée une app sur https://developers.facebook.com/apps (type **Entreprise**).
2. Note l'**App ID** et l'**App Secret** (Paramètres → Général).
3. Va sur https://developers.facebook.com/tools/explorer, sélectionne ton app.
4. Ajoute les permissions : `pages_show_list`, `pages_read_engagement`,
   `pages_manage_posts`, puis **Generate Access Token** (autorise l'accès à
   la Page ProRDV).
5. Échange ce token contre un token utilisateur longue durée (60 jours) :
   ```
   https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={SHORT_TOKEN}
   ```
6. Récupère le token de Page définitif :
   ```
   https://graph.facebook.com/v21.0/me/accounts?access_token={LONG_USER_TOKEN}
   ```
   → `"id"` = `FB_PAGE_ID`, `"access_token"` = `FB_PAGE_ACCESS_TOKEN`.

#### Méthode B — Meta Business Suite (token qui n'expire pas)

1. Sur https://business.facebook.com, crée/ouvre un portfolio business.
2. **Paramètres de l'entreprise → Comptes → Pages** → ajoute ta Page ProRDV.
3. **Comptes → Apps** → ajoute ton App ID (celui créé en méthode A, étape 1-2).
4. **Utilisateurs → Utilisateurs système** → crée un système utilisateur (rôle
   Admin), assigne-lui la Page et l'app en **Contrôle total**.
5. Génère un token pour ce système utilisateur avec les permissions
   `pages_manage_posts`, `pages_read_engagement`, `pages_show_list`, expiration
   **"Aucune"**.
6. Échange-le contre le vrai token de Page :
   ```
   https://graph.facebook.com/v21.0/{PAGE_ID}?fields=access_token&access_token={SYSTEM_USER_TOKEN}
   ```
   → `"access_token"` = `FB_PAGE_ACCESS_TOKEN`.

#### Vérifier le token

```
https://graph.facebook.com/debug_token?input_token={FB_PAGE_ACCESS_TOKEN}&access_token={FB_PAGE_ACCESS_TOKEN}
```
`"is_valid"` doit être `true` et `"scopes"` doit contenir `pages_manage_posts`.
L'agent fait cette même vérification automatiquement à chaque exécution
(`src/facebook/token.ts`).

### 2. Airtable — `AIRTABLE_API_KEY` et `AIRTABLE_BASE_ID`

1. Crée une base Airtable avec une table (voir structure exacte plus bas).
2. Sur https://airtable.com/create/tokens, crée un **Personal Access Token**
   avec les scopes `data.records:read` et `data.records:write`, limité à
   cette base.
3. `AIRTABLE_BASE_ID` = l'ID de la base (commence par `app...`, visible dans
   l'URL de la base ou via l'API).

### 3. Génération d'image (optionnel)

Par défaut (`IMAGE_PROVIDER=banque`), aucune clé n'est nécessaire : l'agent
pioche une image dans `/assets/banque` en évitant celles publiées ces 7
derniers jours. Dépose simplement tes affiches (`.png`/`.jpg`) dans ce
dossier.

Pour générer les images par IA à la place :
- `IMAGE_PROVIDER=openai` + `OPENAI_API_KEY` (modèle `gpt-image-1`)
- `IMAGE_PROVIDER=ideogram` + `IDEOGRAM_API_KEY` (meilleur rendu du texte
  français incrusté)

### 4. Légendes par IA (optionnel)

Par défaut (`CONTENT_MODE=template`), les légendes sont générées localement à
partir des gabarits de `themes.ts`, gratuitement. Pour des légendes rédigées
par IA : `CONTENT_MODE=ai` + `ANTHROPIC_API_KEY`.

## Structure de la table Airtable

Table `Facebook Posts` (nom configurable via `AIRTABLE_TABLE_NAME`) :

| Champ | Type Airtable |
|---|---|
| Theme Key | Texte sur une ligne |
| Description | Texte long (prompt de génération d'image, pas la légende) |
| Legende | Texte long (texte exact publié en légende Facebook) |
| Image Ref | Texte sur une ligne |
| FB Post ID | Texte sur une ligne |
| Status | Texte sur une ligne ou Single select (`success` / `error`) |
| Error | Texte long |
| Published At | Date avec heure (ISO, fuseau UTC) |

<details>
<summary>Équivalent SQL (si tu préfères Postgres/Supabase à la place d'Airtable)</summary>

```sql
create table facebook_posts (
  id uuid default gen_random_uuid() primary key,
  theme_key text not null,
  description text,
  image_ref text,
  fb_post_id text,
  status text not null default 'success',
  error text,
  published_at timestamptz not null default now()
);
```
Basculer dessus demanderait de réécrire `src/store/airtable.ts` et
`src/store/history.ts` avec un client Postgres/Supabase ; les autres modules
n'ont pas besoin de changer (ils ne dépendent que des fonctions exportées par
`history.ts`).
</details>

## Exécution locale

```bash
npm run build

# Aperçu sans publier : génère description + image, affiche le résultat
npm run post:dry-run

# Publication réelle sur la Page Facebook
npm run post
```

Variantes sans compilation préalable (via `ts-node`) : `npm run dev:post` et
`npm run dev:post:dry-run`.

## Configuration GitHub Secrets

Dans le repo → **Settings → Secrets and variables → Actions → New repository
secret**. Pour ta configuration (images depuis `/assets/banque`, légendes en
`template`), 5 secrets suffisent :

| Secret | Valeur |
|---|---|
| `FB_PAGE_ID` | obtenu section Facebook ci-dessus |
| `FB_PAGE_ACCESS_TOKEN` | obtenu section Facebook ci-dessus |
| `AIRTABLE_API_KEY` | obtenu section Airtable ci-dessus |
| `AIRTABLE_BASE_ID` | obtenu section Airtable ci-dessus |
| `IMAGE_PROVIDER` | `banque` |

Les autres variables de `.env.example` sont optionnelles ; ajoute-les
seulement si tu actives le mode IA ou un fournisseur d'image externe.

## Planification

### GitHub Actions (par défaut)

Déjà configuré dans `.github/workflows/daily-post.yml` : cron quotidien à
**8h00 UTC (9h00 heure du Cameroun)**, plus un déclencheur manuel
(`workflow_dispatch`) disponible dans l'onglet **Actions** du repo.

### Variante VPS Linux (alternative)

```bash
cd /chemin/vers/le/projet
npm install
npm run build
```

Puis ajoute au crontab (`crontab -e`) :

```
0 9 * * * cd /chemin/agent && /usr/bin/node dist/index.js >> logs/post.log 2>&1
```

Assure-toi que les variables d'environnement (`.env`) sont présentes dans le
répertoire du projet, ou exportées dans l'environnement du cron.

## Dépannage

- **`FB_PAGE_ACCESS_TOKEN est invalide ou expiré`** : régénère un token (voir
  section Facebook). Privilégie la méthode B (Business Suite) pour un token
  qui n'expire pas.
- **`n'a pas la permission pages_manage_posts`** : la permission n'a pas été
  accordée lors de la génération du token ; recommence en vérifiant qu'elle
  est bien cochée.
- **Erreur `rate limit` Facebook** : l'agent retente automatiquement une fois ;
  si ça persiste, attends avant de relancer manuellement.
- **`IMAGE_PROVIDER=banque` échoue avec "Aucune image disponible"** : vérifie
  que `/assets/banque` contient au moins un fichier `.png`/`.jpg`/`.jpeg`.
- **Publication en double le même jour** : impossible par design — l'agent
  vérifie l'historique Airtable avant de publier et s'arrête si un succès
  existe déjà pour le jour UTC courant.
