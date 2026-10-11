-- One-time prerequisites for an empty project, reconstructed from repository
-- contracts. Apply BEFORE the dated legacy migrations (see bootstrap README).
-- This is not an old-project data restore and never grants profile writes.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer','admin','staff')),
  created_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  image_url text,
  compliance_status text not null default 'manual_review',
  sales_mode text not null default 'catalog_only',
  jurisdiction_note text,
  evidence_note text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  sku text unique,
  stock_quantity integer check (stock_quantity >= 0),
  price_cents integer check (price_cents > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists product_variants_product_idx on public.product_variants(product_id);
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
revoke all on public.profiles, public.products, public.product_variants from public, anon, authenticated;
grant all on public.profiles, public.products, public.product_variants to service_role;
-- The profile role is exclusively managed server-side. Ordinary users cannot
-- assign admin/staff to themselves, including through user_metadata.
grant select (id,role) on public.profiles to authenticated;
create policy "users read own role only" on public.profiles for select to authenticated
  using (id = (select auth.uid()));
grant select (id,name,slug,short_description,description,image_url,compliance_status,
  sales_mode,jurisdiction_note,evidence_note,is_active) on public.products to anon,authenticated;
create policy "public read approved research catalog" on public.products for select to anon,authenticated
  using (is_active and compliance_status='approved' and sales_mode in ('catalog_only','research_only'));
