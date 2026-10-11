-- Minimal base schema required by the committed migrations and catalog queries.
-- No users, products, inventory or approvals are seeded.
begin;
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer','admin','staff'))
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  image_url text,
  compliance_status text not null default 'unchecked',
  sales_mode text not null default 'catalog_only',
  jurisdiction_note text,
  evidence_note text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  stock_quantity integer not null default 0 check (stock_quantity >= 0)
);
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
revoke all on public.profiles, public.products, public.product_variants from public, anon, authenticated;
-- profiles roles cannot be assigned by a browser, including the user's own row.
grant select on public.profiles to authenticated;
create policy "read own profile" on public.profiles for select to authenticated using (id = (select auth.uid()));
-- Catalog is deliberately closed until its independent publication workflow is reviewed.
grant select (id,name,slug,short_description,description,image_url,compliance_status,sales_mode,jurisdiction_note,evidence_note,is_active)
  on public.products to anon, authenticated;
grant all on public.profiles, public.products, public.product_variants to service_role;
commit;
