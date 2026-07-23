-- Table des dossiers de brief client
create table if not exists public.briefs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  reference text not null,
  status text not null default 'nouveau',

  -- Étape 1 — Entreprise
  company_name text not null,
  sector text,
  city text,
  activity text,
  email text not null,
  whatsapp text not null,

  -- Étape 2 — Identité
  logo_path text,
  brand_colors text[] not null default '{}',
  photo_paths text[] not null default '{}',
  inspiration_links text,

  -- Étape 3 — Le site
  site_type text not null,
  pages text[] not null default '{}',
  features text[] not null default '{}',
  goal text,

  -- Étape 4 — Cadre
  timeline text,
  budget text,
  message text,

  -- Automatisation
  n8n_notified boolean not null default false
);

create index if not exists briefs_created_at_idx on public.briefs (created_at desc);
create unique index if not exists briefs_reference_idx on public.briefs (reference);

alter table public.briefs enable row level security;

-- Aucune policy publique : toutes les écritures/lectures passent par la clé
-- service_role côté serveur (route API Next.js), qui contourne RLS.

-- Bucket de stockage pour les fichiers du brief (logo, photos).
insert into storage.buckets (id, name, public)
values ('briefs', 'briefs', false)
on conflict (id) do nothing;
