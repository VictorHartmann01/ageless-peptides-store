-- AgeLess admin console: apply in Supabase SQL editor before using /admin.
create table if not exists public.ageless_store_settings (
  id integer primary key default 1 check (id = 1),
  mode text not null default 'draft' check (mode in ('draft','sandbox','live')),
  payment_provider text not null default 'paypal' check (payment_provider in ('paypal')),
  updated_at timestamptz not null default now()
);
insert into public.ageless_store_settings(id,mode) values (1,'draft') on conflict (id) do nothing;
create table if not exists public.ageless_legal_pages (
  slug text primary key check (slug in ('impressum','datenschutz','agb','widerruf')),
  title text not null,
  body text not null default '',
  published boolean not null default false,
  updated_at timestamptz not null default now()
);
insert into public.ageless_legal_pages(slug,title) values
 ('impressum','Impressum'),('datenschutz','Datenschutz'),('agb','Allgemeine Geschäftsbedingungen'),('widerruf','Widerrufsbelehrung')
on conflict (slug) do nothing;
alter table public.ageless_store_settings enable row level security;
alter table public.ageless_legal_pages enable row level security;
revoke all on public.ageless_store_settings from anon, authenticated;
revoke all on public.ageless_legal_pages from anon, authenticated;
-- Intentionally no public RLS policies: only server-side service-role may read/write.
