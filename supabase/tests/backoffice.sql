-- All fixtures are synthetic and exist only in the disposable test database.
create function pg_temp.assert_true(ok boolean, label text) returns void language plpgsql as $$
begin if ok is distinct from true then raise exception 'FAILED: %',label; end if; end $$;
select pg_temp.assert_true(not exists(select 1 from pg_tables where schemaname='public' and not rowsecurity),'RLS on every public table');
select pg_temp.assert_true(not has_table_privilege('authenticated','public.profiles','UPDATE'),'no self role escalation');
select pg_temp.assert_true(not has_table_privilege('authenticated','public.ageless_admin_access_requests','UPDATE'),'no self approval');
select pg_temp.assert_true(not has_table_privilege('anon','public.ageless_orders','SELECT'),'private orders');
select pg_temp.assert_true(not has_column_privilege('anon','public.ageless_offers','legal_evidence','SELECT'),'private evidence');
select pg_temp.assert_true(not has_column_privilege('authenticated','public.ageless_offers','approved_by','SELECT'),'private reviewer');
select pg_temp.assert_true(not has_function_privilege('anon','public.ageless_complete_paid_order(uuid,text)','EXECUTE'),'anonymous RPC denied');
select pg_temp.assert_true(not has_function_privilege('authenticated','public.ageless_complete_paid_order(uuid,text)','EXECUTE'),'authenticated RPC denied');
select pg_temp.assert_true(has_function_privilege('service_role','public.ageless_complete_paid_order(uuid,text)','EXECUTE'),'server RPC granted');
select pg_temp.assert_true((select mode='draft' from public.ageless_store_settings),'checkout draft default');
insert into ageless_offers(id,slug,name,price_cents,shipping_cents,stock_quantity) values
 ('11111111-1111-4111-8111-111111111111','test-fixture','Synthetic fixture',1000,0,5);
update ageless_offers set legal_evidence=jsonb_build_array(jsonb_build_object('country','DE','status','verified','intended_use','Synthetic test','evidence_url','https://example.invalid/fixture','valid_from',(current_date-1)::text,'valid_until',(current_date+1)::text,'restrictions','')),
 approved_by='owner@example.invalid',approval_reference='synthetic',reviewed_at=now(),manual_approved=true,is_published=true,compliance_status='approved';
set role anon;
select id from ageless_offers; -- one eligible row, internal columns unavailable
reset role;
select pg_temp.assert_true((select count(*)=1 from ageless_offers),'fixture created');
do $$ begin
 begin set local role authenticated; update public.ageless_admin_access_requests set status='approved';
 raise exception 'self approval unexpectedly allowed'; exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 begin set local role authenticated; update ageless_offers set manual_approved=true;
 raise exception 'direct product approval unexpectedly allowed'; exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 begin update ageless_offers set on_hold=true,hold_reason='Test hold';
 raise exception 'hold without withdrawal allowed'; exception when check_violation then null; end;
end $$;
update ageless_offers set on_hold=true,hold_reason='Test hold',manual_approved=false,is_published=false;
set role anon;
do $$ begin if (select count(*) from ageless_offers) <> 0 then raise exception 'hold visible'; end if; end $$;
reset role;
-- Releasing hold alone must never republish.
update ageless_offers set on_hold=false;
select pg_temp.assert_true((select not manual_approved and not is_published from ageless_offers),'release requires fresh approval');
update ageless_offers set manual_approved=true,is_published=true;
insert into ageless_orders(id,email,buyer_name,shipping_address,country_code,items,subtotal_cents,shipping_cents,total_cents,status,payment_mode) values
 ('22222222-2222-4222-8222-222222222222','fixture@example.invalid','Fixture','{}','DE','[{"offer_id":"11111111-1111-4111-8111-111111111111","quantity":2,"unit_price_cents":1000}]',2000,0,2000,'payment_created','sandbox');
select pg_temp.assert_true(ageless_complete_paid_order('22222222-2222-4222-8222-222222222222','TEST-SANDBOX')='sandbox_paid','sandbox completion');
select pg_temp.assert_true((select stock_quantity=5 from ageless_offers),'sandbox preserves stock');
update ageless_orders set id='33333333-3333-4333-8333-333333333333',status='payment_created',payment_mode='live',paypal_capture_id=null;
select pg_temp.assert_true(ageless_complete_paid_order('33333333-3333-4333-8333-333333333333','TEST-LIVE')='paid','live fixture completion');
select pg_temp.assert_true(ageless_complete_paid_order('33333333-3333-4333-8333-333333333333','TEST-LIVE')='paid','idempotent completion');
select pg_temp.assert_true((select stock_quantity=3 from ageless_offers),'single stock reduction');
update ageless_orders set id='44444444-4444-4444-8444-444444444444',status='payment_created',paypal_capture_id=null;
update ageless_offers set on_hold=true,hold_reason='Withdrawn',manual_approved=false,is_published=false;
select pg_temp.assert_true(ageless_complete_paid_order('44444444-4444-4444-8444-444444444444','TEST-HOLD')='paid_manual_review','hold after capture requires resolution');
select pg_temp.assert_true((select stock_quantity=3 from ageless_offers),'hold preserves stock');
update ageless_orders set id='55555555-5555-4555-8555-555555555555',status='payment_created',items='[{"offer_id":"11111111-1111-4111-8111-111111111111","quantity":-2}]';
do $$ begin
 begin perform ageless_complete_paid_order('55555555-5555-4555-8555-555555555555','TEST-BAD');
 raise exception 'negative quantity allowed'; exception when raise_exception then if sqlerrm <> 'invalid_quantity' then raise; end if; end;
end $$;
select pg_temp.assert_true(not ageless_evidence_valid(null,array['DE']),'null proof rejected');
select pg_temp.assert_true(not ageless_evidence_valid('[]',array['DE']),'empty proof rejected');
select pg_temp.assert_true(not ageless_evidence_valid('[{"country":"DE","status":"pending"}]',array['DE']),'pending proof rejected');
select pg_temp.assert_true(not ageless_evidence_valid('[{"country":"DE","status":"verified","intended_use":"Test","evidence_url":"https://example.invalid","valid_from":"2026-02-30"}]',array['DE']),'invalid date rejected');
update ageless_offers set on_hold=false,legal_evidence=jsonb_set(legal_evidence,'{0,valid_until}',to_jsonb((current_date-1)::text));
select pg_temp.assert_true(not ageless_evidence_valid((select legal_evidence from ageless_offers),array['DE']),'expired proof rejected');

-- Simulate an approval expiring after its original valid write.
-- Only this disposable fixture removes the write-time check, then restores it.
alter table ageless_offers drop constraint ageless_evidence_guard;
update ageless_offers set manual_approved=true,is_published=true;
set role anon;
do $$ begin if (select count(*) from ageless_offers) <> 0 then raise exception 'expired approval visible'; end if; end $$;
reset role;
update ageless_offers set manual_approved=false,is_published=false;
alter table ageless_offers add constraint ageless_evidence_guard check (
 not manual_approved or (nullif(trim(approved_by),'') is not null and ageless_evidence_valid(legal_evidence,allowed_countries)));

select pg_temp.assert_true(not ageless_evidence_valid('[{"country":"DE","status":"verified","intended_use":"Test","evidence_url":"https://example.invalid","valid_from":"2026-01-01","valid_until":"infinity","restrictions":""}]',array['DE']),'infinite proof rejected');
