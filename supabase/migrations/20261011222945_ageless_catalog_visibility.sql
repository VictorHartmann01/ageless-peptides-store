-- Catalogue visibility is explicitly owner-controlled and grants no sale permission.
alter table public.ageless_offers add column if not exists catalog_visible boolean not null default false;
update public.ageless_offers set catalog_visible=true where is_published and manual_approved and compliance_status='approved';
-- Public offers RLS remains the strict purchase-eligibility policy. The server
-- renders only explicitly visible records and projects public information;
-- internal evidence documents, reviewer identities and hold reasons stay private.
