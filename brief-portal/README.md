# Portail de brief client

Formulaire multi-étapes (Next.js App Router) qu'une agence envoie par lien
unique à un client pour collecter toutes les infos et fichiers nécessaires à
la création de son site.

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseigner les variables
npm run dev
```

## Variables d'environnement

Voir `.env.example`. `SUPABASE_SERVICE_ROLE_KEY` et `N8N_WEBHOOK_URL` ne
sont utilisées que côté serveur (route `app/api/submit-brief/route.ts`),
jamais exposées au navigateur.

## Base de données

Appliquer `supabase/migrations/0001_briefs.sql` sur le projet Supabase
(SQL Editor du dashboard, ou `supabase db push`). Cela crée la table
`briefs` et le bucket de stockage privé `briefs`.

## Contrat du webhook n8n

À chaque soumission validée, l'API POST un JSON vers `N8N_WEBHOOK_URL` :

```json
{
  "reference": "BR-A1B2C3D4",
  "submissionId": "uuid",
  "submittedAt": "2026-07-06T12:00:00.000Z",
  "companyName": "...",
  "sector": "...",
  "city": "...",
  "activity": "...",
  "email": "...",
  "whatsapp": "...",
  "brandColors": ["#0F6B57"],
  "inspirationLinks": "...",
  "siteType": "vitrine",
  "pages": ["Accueil", "Contact"],
  "features": ["Bouton WhatsApp"],
  "goal": "...",
  "timeline": "...",
  "budget": "...",
  "message": "...",
  "logoUrl": "https://... (URL signée, valable 7 jours)",
  "photoUrls": ["https://..."]
}
```

Le workflow n8n attendu, en une passe :

1. Crée un dossier Google Drive `Client - {companyName} - {date}`.
2. Télécharge `logoUrl` et `photoUrls` puis les dépose dans ce dossier.
3. Crée une page Notion avec le brief complet.
4. Envoie un email de notification à l'agence.

Si le webhook échoue, le dossier reste enregistré dans Supabase
(`n8n_notified = false`) — rien n'est perdu, la notification peut être
rejouée manuellement.

## Configuration éditoriale

Toutes les listes (secteurs, villes, types de site, pages, fonctionnalités,
délais, budgets) sont déclarées en tête de `lib/config.ts`.
