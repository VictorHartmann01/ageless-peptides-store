-- Unknown draft prices and stock must stay unknown, not fabricated zeros.
alter table public.ageless_offers alter column price_cents drop not null;
alter table public.ageless_offers alter column stock_quantity drop not null;
alter table public.ageless_offers alter column stock_quantity drop default;
alter table public.ageless_offers add constraint ageless_known_commercial_values_guard
  check (not (manual_approved or is_published) or (price_cents is not null and price_cents > 0 and stock_quantity is not null));
alter function public.is_admin() set search_path = public;
revoke execute on function public.is_admin() from public,anon;
grant execute on function public.is_admin() to authenticated,service_role;
-- Operational data goes through the authenticated server API. Profile policy
-- remains read-only; no user can assign themselves a privileged profile role.
revoke all on public.substances,public.inventory_movements,public.due_diligence_reports,
  public.research_sources,public.news_articles,public.social_campaigns,
  public.social_campaign_assets,public.ai_tasks,public.audit_log,
  public.ageless_orders,public.ageless_store_settings,public.ageless_legal_pages,
  public.ageless_admin_access_requests from public,anon,authenticated;
grant all on public.substances,public.inventory_movements,public.due_diligence_reports,
  public.research_sources,public.news_articles,public.social_campaigns,
  public.social_campaign_assets,public.ai_tasks,public.audit_log,
  public.ageless_offers,public.ageless_orders,public.ageless_store_settings,
  public.ageless_legal_pages,public.ageless_admin_access_requests to service_role;
-- Foreign-key indexes support review and inventory joins.
create index if not exists products_substance_idx on public.products(substance_id);
create index if not exists due_diligence_substance_idx on public.due_diligence_reports(substance_id);
create index if not exists research_sources_report_idx on public.research_sources(due_diligence_report_id);
create index if not exists research_sources_news_idx on public.research_sources(news_article_id);
