-- Run with postgres via Supabase execute_sql. Fixtures are always rolled back;
-- no external payment API or user email is called.
begin;
do $$
declare offer uuid; ord uuid; v jsonb; result text; stock integer;
begin
  if exists(select 1 from pg_tables where schemaname='public' and not rowsecurity) then raise exception 'missing_rls'; end if;
  if has_table_privilege('anon','public.ageless_orders','SELECT') then raise exception 'order_leak'; end if;
  if has_table_privilege('authenticated','public.profiles','UPDATE') then raise exception 'self_assign_role'; end if;
  if has_column_privilege('anon','public.ageless_offers','legal_evidence','SELECT') then raise exception 'evidence_leak'; end if;
  if has_function_privilege('authenticated','public.ageless_complete_paid_order(uuid,text)','EXECUTE') then raise exception 'public_capture'; end if;
  v := jsonb_build_array(jsonb_build_object('country','DE','status','verified','intended_use','Test fixture only','evidence_url','https://example.invalid/test','valid_from',current_date::text,'valid_until',''));
  if not public.ageless_evidence_valid(v,array['DE']) then raise exception 'valid_evidence_failed'; end if;
  if public.ageless_evidence_valid(v,array['AT']) then raise exception 'country_bypass'; end if;
  if public.ageless_evidence_valid(v || v,array['DE']) then raise exception 'duplicate_country'; end if;
  if public.ageless_evidence_valid(jsonb_set(v,'{0,valid_until}',to_jsonb((current_date-1)::text)),array['DE']) then raise exception 'expired_evidence'; end if;
  insert into public.ageless_offers(slug,name,price_cents,stock_quantity,shipping_cents)
    values('__bo_fixture__','Rollback fixture',null,null,0) returning id into offer;
  begin
    update public.ageless_offers set manual_approved=true,compliance_status='approved',reviewed_at=now(),approval_reference='TEST',approved_by='fixture@example.invalid',legal_evidence=v where id=offer;
    raise exception 'unknown_values_approved';
  exception when check_violation then null; end;
  begin
    update public.ageless_offers set on_hold=true where id=offer;
    raise exception 'hold_without_reason';
  exception when check_violation then null; end;
  update public.ageless_offers set price_cents=100,stock_quantity=2,manual_approved=true,compliance_status='approved',reviewed_at=now(),approval_reference='TEST',approved_by='fixture@example.invalid',legal_evidence=v,is_published=true where id=offer;
  insert into public.ageless_orders(email,buyer_name,shipping_address,items,country_code,subtotal_cents,shipping_cents,total_cents,status,payment_mode)
    values('fixture@example.invalid','Rollback fixture','{}',jsonb_build_array(jsonb_build_object('offer_id',offer,'quantity',1)),'DE',100,0,100,'payment_created','sandbox') returning id into ord;
  result:=public.ageless_complete_paid_order(ord,'rollback_capture');
  if result <> 'paid' then raise exception 'completion_failed'; end if;
  result:=public.ageless_complete_paid_order(ord,'rollback_capture');
  select stock_quantity into stock from public.ageless_offers where id=offer;
  if result <> 'paid' or stock <> 1 then raise exception 'duplicate_stock_capture'; end if;
  -- A product held before DB completion must require manual handling.
  update public.ageless_offers set on_hold=true,hold_reason='Test pause',manual_approved=false,is_published=false where id=offer;
  insert into public.ageless_orders(email,buyer_name,shipping_address,items,country_code,subtotal_cents,shipping_cents,total_cents,status,payment_mode)
    values('fixture@example.invalid','Rollback fixture','{}',jsonb_build_array(jsonb_build_object('offer_id',offer,'quantity',1)),'DE',100,0,100,'payment_created','sandbox') returning id into ord;
  if public.ageless_complete_paid_order(ord,'rollback_capture_held') <> 'paid_manual_review' then raise exception 'held_completion_bypass'; end if;
  select stock_quantity into stock from public.ageless_offers where id=offer;
  if stock <> 1 then raise exception 'held_stock_decrement'; end if;
end $$;
set local role anon;
do $$ begin
  if exists(select 1 from public.ageless_offers where slug='__bo_fixture__') then raise exception 'anon_hold_visible'; end if;
end $$;
reset role;
select 'database_checks_passed_including_actual_anon_rls' as result;
rollback;
