-- Private approval workflow for AgeLess administration.
create table if not exists public.ageless_admin_access_requests (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  approval_token_hash text unique,
  approval_expires_at timestamptz,
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by text
);
create unique index if not exists ageless_admin_access_email_idx on public.ageless_admin_access_requests (lower(email));
alter table public.ageless_admin_access_requests enable row level security;
revoke all on public.ageless_admin_access_requests from anon, authenticated;
-- Service-role access only. Public accounts cannot read or approve requests.
