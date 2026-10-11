begin;
alter table public.ageless_offers add column if not exists legal_evidence jsonb not null default '[]'::jsonb;
alter table public.ageless_offers add column if not exists approved_by text;
alter table public.ageless_offers add column if not exists on_hold boolean not null default false;
alter table public.ageless_offers add column if not exists hold_reason text;
alter table public.ageless_offers add constraint ageless_hold_guard check (not on_hold or (not manual_approved and not is_published and nullif(trim(hold_reason),'') is not null));

-- Date-sensitive eligibility is evaluated on every read, including after expiry.
create or replace function public.ageless_evidence_valid(evidence jsonb, countries text[])
returns boolean language plpgsql stable set search_path = public as $$
declare country text; r jsonb; covered boolean;
begin
  if evidence is null or jsonb_typeof(evidence) <> 'array' or coalesce(cardinality(countries),0) not between 1 and 20 then return false; end if;
  if jsonb_array_length(evidence) not between 1 and 20 then return false; end if;
  if (select count(*) <> count(distinct value->>'country') from jsonb_array_elements(evidence)) then return false; end if;
  foreach country in array countries loop
    covered := false;
    for r in select value from jsonb_array_elements(evidence) loop
      if jsonb_typeof(r) = 'object' and country ~ '^[A-Z]{2}$' and r->>'country' = country and r->>'status' = 'verified'
        and length(trim(r->>'intended_use')) >= 3 and length(r->>'intended_use') <= 500
        and jsonb_typeof(r->'restrictions') = 'string' and length(r->>'restrictions') <= 2000
        and length(r->>'evidence_url') <= 2000
        and r->>'evidence_url' ~ '^https://[^[:space:]]+$'
        and r->>'valid_from' ~ '^\d{4}-\d{2}-\d{2}$'
        and (r->>'valid_from')::date <= (now() at time zone 'UTC')::date
        and (coalesce(r->>'valid_until','') = '' or
          (r->>'valid_until' ~ '^\d{4}-\d{2}-\d{2}$' and (r->>'valid_until')::date >= (now() at time zone 'UTC')::date and (r->>'valid_until')::date >= (r->>'valid_from')::date))
      then covered := true; end if;
    end loop;
    if not covered then return false; end if;
  end loop;
  return true;
exception when others then return false;
end; $$;

-- Never silently withdraw existing approvals during deployment.
-- Existing installations require a backup and separately reviewed data transition.
do $$ begin
  if exists (select 1 from public.ageless_offers where manual_approved or is_published) then
    raise exception 'EXISTING_APPROVALS_REQUIRE_BACKUP_AND_REVIEW';
  end if;
end $$;
alter table public.ageless_offers add constraint ageless_evidence_guard check (
  not manual_approved or (nullif(trim(approved_by),'') is not null
    and public.ageless_evidence_valid(legal_evidence, allowed_countries))
);
drop policy if exists "public may read eligible offers" on public.ageless_offers;
create policy "public may read eligible offers" on public.ageless_offers
for select to anon, authenticated using (
  not on_hold and is_published and manual_approved and compliance_status='approved'
  and reviewed_at is not null and stock_quantity>0
  and public.ageless_evidence_valid(legal_evidence,allowed_countries)
);
-- Internal evidence and reviewer identity stay private.
revoke all on public.ageless_offers from anon, authenticated;
grant select (id,product_id,slug,name,description,image_url,currency,price_cents,
  shipping_cents,stock_quantity,allowed_countries,compliance_status,manual_approved,
  reviewed_at,approval_reference,is_published,created_at,updated_at)
on public.ageless_offers to anon, authenticated;
-- Recheck after capture under row locks; revoked offers require manual resolution.
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
  eligible boolean;
begin
  select * into o from public.ageless_orders where id = p_order_id for update;
  if not found then raise exception 'order_not_found'; end if;
  if o.status in ('paid','paid_manual_review','sandbox_paid') then return o.status; end if;
  if o.status <> 'payment_created' then raise exception 'invalid_order_state'; end if;
  if nullif(trim(p_capture_id),'') is null then raise exception 'capture_required'; end if;
  if jsonb_typeof(o.items) <> 'array' or jsonb_array_length(o.items) not between 1 and 20 then
    raise exception 'invalid_order_items';
  end if;
  if (select count(*) <> count(distinct value->>'offer_id') from jsonb_array_elements(o.items)) then
    raise exception 'duplicate_order_items';
  end if;
  for item in select value from jsonb_array_elements(o.items) loop
    if (item->>'quantity')::integer not between 1 and 10 or item->>'quantity' is null then
      raise exception 'invalid_quantity';
    end if;
  end loop;
  if o.payment_mode = 'sandbox' then
    update public.ageless_orders set status='sandbox_paid', paypal_capture_id=p_capture_id, paid_at=now() where id=p_order_id;
    return 'sandbox_paid';
  end if;
  -- Lock offer rows deterministically to prevent overselling.
  perform 1 from public.ageless_offers
    where id in (select (value->>'offer_id')::uuid from jsonb_array_elements(o.items))
    order by id for update;
  for item in select value from jsonb_array_elements(o.items) loop
    offer_id := (item->>'offer_id')::uuid;
    qty := (item->>'quantity')::integer;
    select stock_quantity, (not on_hold and is_published and manual_approved and compliance_status='approved'
      and reviewed_at is not null and nullif(trim(approval_reference),'') is not null
      and price_cents = (item->>'unit_price_cents')::integer
      and o.country_code = any(allowed_countries)
      and public.ageless_evidence_valid(legal_evidence,array[o.country_code]))
    into available, eligible from public.ageless_offers where id = offer_id;
    if available is null or available < qty or eligible is not true then
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


-- Explicit server grants: do not depend on project-specific default privileges.
grant all on public.ageless_offers, public.ageless_orders, public.ageless_store_settings,
 public.ageless_legal_pages, public.ageless_admin_access_requests to service_role;
-- Legacy operations roles must not become a parallel path around owner approvals.
revoke all on public.substances, public.inventory_movements, public.due_diligence_reports,
 public.research_sources, public.news_articles, public.social_campaigns,
 public.social_campaign_assets, public.ai_tasks, public.audit_log from public, anon, authenticated;
grant all on public.substances, public.inventory_movements, public.due_diligence_reports,
 public.research_sources, public.news_articles, public.social_campaigns,
 public.social_campaign_assets, public.ai_tasks, public.audit_log to service_role;
commit;
