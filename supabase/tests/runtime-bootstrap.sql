-- Isolated test engine only. Supabase provides these roles/auth objects itself.
create role anon;
create role authenticated;
create role service_role bypassrls;
create schema auth;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
 select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid;
$$;
grant usage on schema public, auth to anon, authenticated, service_role;
grant execute on function auth.uid() to authenticated;
-- Reproduce legacy Supabase broad default grants to test explicit revocation.
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
