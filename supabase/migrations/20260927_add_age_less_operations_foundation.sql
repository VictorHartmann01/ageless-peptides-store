create table if not exists public.substances (
  id uuid primary key default gen_random_uuid(),
  canonical_name text not null unique,
  synonyms text[] not null default '{}',
  description text,
  known_uses text,
  evidence_summary text,
  status text not null default 'draft' check (status in ('draft','researching','review','approved','restricted','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products
  add column if not exists substance_id uuid references public.substances(id),
  add column if not exists due_diligence_status text not null default 'not_started' check (due_diligence_status in ('not_started','queued','researching','review','approved','rejected','stale')),
  add column if not exists minimum_stock integer not null default 0 check (minimum_stock >= 0);

alter table public.product_variants
  add column if not exists reserved_quantity integer not null default 0 check (reserved_quantity >= 0);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  quantity_delta integer not null check (quantity_delta <> 0),
  movement_type text not null check (movement_type in ('opening','purchase','sale','reservation','release','adjustment','return','damage','correction')),
  reference_type text,
  reference_id uuid,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists inventory_movements_variant_created_idx on public.inventory_movements(variant_id, created_at desc);

create table if not exists public.due_diligence_reports (
  id uuid primary key default gen_random_uuid(),
  substance_id uuid not null references public.substances(id) on delete cascade,
  version integer not null default 1,
  summary text,
  known_effects text,
  known_uses text,
  legal_status_summary text,
  regulatory_summary text,
  risk_summary text,
  country_findings jsonb not null default '[]'::jsonb,
  limitations text,
  confidence text check (confidence in ('low','medium','high')),
  status text not null default 'draft' check (status in ('draft','researching','review','approved','rejected','superseded')),
  researched_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.research_sources (
  id uuid primary key default gen_random_uuid(),
  due_diligence_report_id uuid references public.due_diligence_reports(id) on delete cascade,
  news_article_id uuid,
  title text not null,
  url text,
  publisher text,
  published_at timestamptz,
  source_type text,
  reliability_note text,
  accessed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  substance_id uuid references public.substances(id),
  product_id uuid references public.products(id),
  title text not null,
  slug text not null unique,
  language_code text not null default 'en',
  summary text,
  body text,
  seo_title text,
  meta_description text,
  status text not null default 'draft' check (status in ('draft','review','approved','published','archived')),
  compliance_status text not null default 'unchecked' check (compliance_status in ('unchecked','review','approved','rejected')),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.research_sources add constraint research_sources_news_article_fk foreign key (news_article_id) references public.news_articles(id) on delete cascade;

create table if not exists public.social_campaigns (
  id uuid primary key default gen_random_uuid(),
  news_article_id uuid references public.news_articles(id) on delete set null,
  name text not null,
  objective text,
  audience text,
  language_codes text[] not null default '{en}',
  status text not null default 'draft' check (status in ('draft','review','approved','scheduled','published','archived')),
  compliance_status text not null default 'unchecked' check (compliance_status in ('unchecked','review','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_campaign_assets (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.social_campaigns(id) on delete cascade,
  platform text not null check (platform in ('linkedin','facebook','instagram','tiktok','whatsapp','x','other')),
  format text not null,
  language_code text not null default 'en',
  hook text,
  caption text,
  script text,
  call_to_action text,
  visual_brief text,
  status text not null default 'draft' check (status in ('draft','review','approved','published','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.ai_tasks (
  id uuid primary key default gen_random_uuid(),
  task_type text not null,
  input_text text,
  target_type text,
  target_id uuid,
  status text not null default 'queued' check (status in ('queued','running','review','approved','completed','failed','cancelled')),
  result jsonb,
  error_message text,
  requested_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

alter table public.substances enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.due_diligence_reports enable row level security;
alter table public.research_sources enable row level security;
alter table public.news_articles enable row level security;
alter table public.social_campaigns enable row level security;
alter table public.social_campaign_assets enable row level security;
alter table public.ai_tasks enable row level security;
alter table public.audit_log enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin','staff')
  );
$$;

create policy "admin can manage substances" on public.substances for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin can manage inventory movements" on public.inventory_movements for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin can manage due diligence" on public.due_diligence_reports for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin can manage research sources" on public.research_sources for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin can manage news" on public.news_articles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin can manage campaigns" on public.social_campaigns for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin can manage campaign assets" on public.social_campaign_assets for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin can manage ai tasks" on public.ai_tasks for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin can read audit log" on public.audit_log for select to authenticated using (public.is_admin());
create policy "admin can insert audit log" on public.audit_log for insert to authenticated with check (public.is_admin());
