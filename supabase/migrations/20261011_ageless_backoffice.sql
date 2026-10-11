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
  if jsonb_typeof(evidence) <> 'array' or coalesce(cardinality(countries),0) = 0 then return false; end if;
  if (select count(*) <> count(distinct value->>'country') from jsonb_array_elements(evidence)) then return false; end if;
  foreach country in array countries loop
    covered := false;
    for r in select value from jsonb_array_elements(evidence) loop
      if r->>'country' = country and r->>'status' = 'verified'
        and length(trim(r->>'intended_use')) >= 3
        and r->>'evidence_url' ~ '^https://[^[:space:]]+$'
        and r->>'valid_from' ~ '^\d{4}-\d{2}-\d{2}$'
        and (r->>'valid_from')::date <= (now() at time zone 'UTC')::date
        and (coalesce(r->>'valid_until','') = '' or
          ((r->>'valid_until')::date >= (now() at time zone 'UTC')::date and (r->>'valid_until')::date >= (r->>'valid_from')::date))
      then covered := true; end if;
    end loop;
    if not covered then return false; end if;
  end loop;
  return true;
exception when others then return false;
end; $$;

-- Legacy approvals require a fresh, evidenced owner review.
update public.ageless_offers set manual_approved=false, is_published=false,
  compliance_status='manual_review', reviewed_at=null
  where manual_approved or is_published;
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
revoke select on public.ageless_offers from anon, authenticated;
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
  if o.status in ('paid','paid_manual_review') then return o.status; end if;
  if o.status <> 'payment_created' then raise exception 'invalid_order_state'; end if;
  -- Lock offer rows deterministically to prevent overselling.
  perform 1 from public.ageless_offers
    where id in (select (value->>'offer_id')::uuid from jsonb_array_elements(o.items))
    order by id for update;
  for item in select value from jsonb_array_elements(o.items) loop
    offer_id := (item->>'offer_id')::uuid;
    qty := (item->>'quantity')::integer;
    select stock_quantity, (not on_hold and is_published and manual_approved and compliance_status='approved'
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


commit;
