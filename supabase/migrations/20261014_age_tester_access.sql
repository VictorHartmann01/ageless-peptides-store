-- Separate customer/tester access from the admin permission system.
create table if not exists public.ageless_tester_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by text
);
alter table public.ageless_tester_access enable row level security;
revoke all on public.ageless_tester_access from anon, authenticated;
create index if not exists ageless_tester_access_status_idx on public.ageless_tester_access(status,requested_at);
