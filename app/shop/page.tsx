import Link from 'next/link';
import { createPublicClient } from '../../lib/supabase/public';

type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  compliance_status: string;
  sales_mode: string;
  jurisdiction_note: string | null;
  evidence_note: string | null;
};

export const metadata = {
  title: 'Research Catalog | AgeLess',
  description: 'Evidence-aware AgeLess research catalog. Products shown here are controlled by the platform compliance state.',
};

export default async function ShopPage() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('products')
    .select('id,name,slug,short_description,description,image_url,compliance_status,sales_mode,jurisdiction_note,evidence_note')
    .eq('is_active', true)
    .in('sales_mode', ['catalog_only', 'research_only'])
    .order('name');

  if (error) {
    return (
      <main className="catalog-page">
        <div className="catalog-shell">
          <Link href="/" className="catalog-back">← AgeLess</Link>
          <div className="catalog-error">
            <span>CATALOG / SYSTEM STATUS</span>
            <h1>The research catalog is temporarily unavailable.</h1>
            <p>The storefront is fail-closed: if the data layer cannot be verified, products are not displayed.</p>
          </div>
        </div>
      </main>
    );
  }

  const products = (data ?? []) as Product[];

  return (
    <main className="catalog-page">
      <header className="catalog-header">
        <Link href="/" className="catalog-brand"><b>Age</b><em>Less</em></Link>
        <div className="catalog-status">RESEARCH CATALOG · COMPLIANCE-AWARE</div>
      </header>

      <section className="catalog-hero">
        <div>
          <div className="section-kicker">AGELESS / KNOWLEDGE LAYER</div>
          <h1>Research first.<br /><span>Commerce only when justified.</span></h1>
          <p>Every visible item is filtered through the platform's product state. This catalog intentionally separates research information from purchasable commerce.</p>
        </div>
        <div className="catalog-rule">
          <span>CORE RULE</span>
          <strong>Unverified ≠ sellable.</strong>
          <p>Compliance uncertainty keeps an item out of checkout.</p>
        </div>
      </section>

      <section className="catalog-grid" aria-label="Research products">
        {products.length === 0 ? (
          <div className="catalog-empty">
            <span>CATALOG STATUS / 00</span>
            <h2>No public products are currently approved for display.</h2>
            <p>The database currently contains product records, but none are active in the public catalog. This is the intended fail-closed state until publication criteria are satisfied.</p>
            <Link href="/" className="catalog-button">Back to AgeLess <span>→</span></Link>
          </div>
        ) : (
          products.map((product) => (
            <article className="catalog-card" key={product.id}>
              <div className="catalog-image">
                {product.image_url ? <img src={product.image_url} alt="" /> : <div className="catalog-placeholder">AGELESS<br />RESEARCH</div>}
              </div>
              <div className="catalog-card-body">
                <div className="catalog-card-top">
                  <span>{product.sales_mode === 'research_only' ? 'RESEARCH ONLY' : 'CATALOG'}</span>
                  <span>{product.compliance_status.replaceAll('_', ' ').toUpperCase()}</span>
                </div>
                <h2>{product.name}</h2>
                <p>{product.short_description ?? product.description ?? 'Research record.'}</p>
                <div className="catalog-note">{product.jurisdiction_note ?? 'Jurisdiction-specific review applies before any commercial action.'}</div>
                <div className="catalog-card-foot">
                  <span>Evidence-aware record</span>
                  <span>↗</span>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
