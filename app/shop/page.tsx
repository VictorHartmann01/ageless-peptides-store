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
  title: 'Produkte & Research | AgeLess',
  description: 'Kuratiertes AgeLess Research- und Produktuniversum rund um Peptide, Longevity und transparente Einordnung.',
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
            <span>RESEARCH CATALOG</span>
            <h1>Die Produktübersicht ist vorübergehend nicht verfügbar.</h1>
            <p>AgeLess zeigt Produkte nur dann öffentlich an, wenn die zugrunde liegenden Daten verlässlich geladen und geprüft werden können.</p>
          </div>
        </div>
      </main>
    );
  }

  const products = (data ?? []) as Product[];

  return (
    <main className="catalog-page">
      <header className="catalog-header">
        <Link href="/" className="catalog-brand" aria-label="AgeLess">
          <img src="/ageless-logo.svg" alt="AgeLess — Science for a Longer, Better Life" />
        </Link>
        <div className="catalog-status">PEPTIDE · LONGEVITY · RESEARCH</div>
      </header>

      <section className="catalog-hero">
        <div>
          <div className="ag-section-label">AGELESS / PRODUKTWELT</div>
          <h1>Wissenschaftlich orientiert.<br /><span>Transparent eingeordnet.</span></h1>
          <p>Die AgeLess Produktwelt verbindet Peptide, Longevity-Themen und Research-Substanzen mit klarer Einordnung zu Produktform, Evidenz und regulatorischem Kontext.</p>
        </div>
        <div className="catalog-rule">
          <span>AGELESS STANDARD</span>
          <strong>Unklarheit wird sichtbar.</strong>
          <p>Produkte mit offener Einordnung werden nicht als regulär kaufbar dargestellt.</p>
        </div>
      </section>

      <section className="catalog-grid" aria-label="AgeLess Produkte">
        {products.length === 0 ? (
          <div className="catalog-empty">
            <span>PRODUKTSTATUS</span>
            <h2>Aktuell sind keine Produkte für die öffentliche Darstellung freigegeben.</h2>
            <p>AgeLess priorisiert eine klare und verantwortungsvolle Einordnung. Produkte werden erst sichtbar, wenn die erforderlichen Veröffentlichungskriterien erfüllt sind.</p>
            <Link href="/" className="catalog-button">Zurück zu AgeLess <span>→</span></Link>
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
                <p>{product.short_description ?? product.description ?? 'AgeLess Research Record.'}</p>
                <div className="catalog-note">{product.jurisdiction_note ?? 'Vor einer kommerziellen Handlung gilt die jeweils erforderliche regulatorische Einordnung.'}</div>
                <Link className="catalog-card-foot catalog-card-link" href={`/shop/${encodeURIComponent(product.slug)}`}>
                  <span>Produktinformationen ansehen</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
