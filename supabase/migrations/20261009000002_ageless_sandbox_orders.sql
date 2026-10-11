-- Keep practice orders separate from real sales and preserve live inventory.
alter table public.ageless_orders
  add column if not exists payment_mode text not null default 'live'
  check (payment_mode in ('sandbox','live'));
alter table public.ageless_orders drop constraint if exists ageless_orders_status_check;
alter table public.ageless_orders add constraint ageless_orders_status_check
  check (status in ('pending_payment','payment_created','paid','sandbox_paid','paid_manual_review','payment_failed','cancelled','refunded'));
create index if not exists ageless_orders_mode_idx on public.ageless_orders(payment_mode,created_at desc);
