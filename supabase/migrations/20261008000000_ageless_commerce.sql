-- AgeLess commerce foundation. Apply in Supabase SQL editor before enabling checkout.
-- Default deny: nothing is purchasable until an administrator explicitly approves an offer.
create table if not exists public.ageless_offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  slug text not null unique,
  name text not null,
  description text,
  image_url text,
  currency text not null default 'EUR' check (currency = 'EUR'),
  price_cents integer not null check (price_cents > 0),
  shipping_cents integer not null check (shipping_cents >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  allowed_countries text[] not null default '{DE}',
  compliance_status text not null default 'manual_review'
    check (compliance_status in ('manual_review','approved','blocked')),
  manual_approved boolean not null default false,
  reviewed_at timestamptz,
  approval_reference text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ageless_offer_approval_guard check (
    not (manual_approved and compliance_status = 'approved')
    or (reviewed_at is not null and nullif(trim(approval_reference),'') is not null)
  )
);
create table if not exists public.ageless_orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  buyer_name text not null,
  shipping_address jsonb not null,
  country_code text not null,
  items jsonb not null,
  currency text not null default 'EUR' check (currency = 'EUR'),
  subtotal_cents integer not null check (subtotal_cents >= 0),
  shipping_cents integer not null check (shipping_cents >= 0),
  total_cents integer not null check (total_cents > 0),
  status text not null default 'pending_payment'
    check (status in ('pending_payment','payment_created','paid','paid_manual_review','payment_failed','cancelled','refunded')),
  paypal_order_id text unique,
  paypal_capture_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index if not exists ageless_orders_created_idx on public.ageless_orders(created_at desc);
alter table public.ageless_offers enable row level security;
alter table public.ageless_orders enable row level security;
-- Only approved, published, stocked offers are readable to the public.
create policy "public may read eligible offers" on public.ageless_offers
  for select to anon, authenticated
  using (is_published and manual_approved and compliance_status = 'approved'
         and reviewed_at is not null and stock_quantity > 0);
-- There are intentionally no public INSERT/UPDATE/SELECT policies for orders.
-- All writes and sensitive reads must go through server-side service-role access.
revoke all on public.ageless_orders from anon, authenticated;
grant select on public.ageless_offers to anon, authenticated;
-- Atomic, idempotent stock update after an independently verified PayPal capture.
create or replace function public.ageless_complete_paid_order(p_order_id uuid, p_capture_id text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.ageless_orders%rowtype;
  item jsonb;
  offer_id uuid;
  qty integer;
  available integer;
begin
  select * into o from public.ageless_orders where id = p_order_id for update;
  if not found then raise exception 'order_not_found'; end if;
  if o.status in ('paid','paid_manual_review') then return o.status; end if;
  if o.status <> 'payment_created' then raise exception 'invalid_order_state'; end if;
  -- Lock offer rows deterministically to prevent overselling.
  perform 1 from public.ageless_offers
    where id in (select (value->>'offer_id')::uuid from jsonb_array_elements(o.items))
    order by id for update;
  for item in select value from jsonb_array_elements(o.items) loop
    offer_id := (item->>'offer_id')::uuid;
    qty := (item->>'quantity')::integer;
    select stock_quantity into available from public.ageless_offers where id = offer_id;
    if available is null or available < qty then
      update public.ageless_orders
        set status='paid_manual_review', paypal_capture_id=p_capture_id, paid_at=now()
        where id=p_order_id;
      return 'paid_manual_review';
    end if;
  end loop;
  for item in select value from jsonb_array_elements(o.items) loop
    update public.ageless_offers
      set stock_quantity=stock_quantity-(item->>'quantity')::integer, updated_at=now()
      where id=(item->>'offer_id')::uuid;
  end loop;
  update public.ageless_orders
    set status='paid', paypal_capture_id=p_capture_id, paid_at=now()
    where id=p_order_id;
  return 'paid';
end;
$$;
revoke all on function public.ageless_complete_paid_order(uuid,text) from public, anon, authenticated;
grant execute on function public.ageless_complete_paid_order(uuid,text) to service_role;
