import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPublicClient } from '../../../lib/supabase/public';

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

type Props = { params: Promise<{ slug: string }> };

async function getPublicProduct(slug: string): Promise<Product | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('products')
    .select('id,name,slug,short_description,description,image_url,compliance_status,sales_mode,jurisdiction_note,evidence_note')
    .eq('slug', slug)
    .eq('is_active', true)
    .in('sales_mode', ['catalog_only', 'research_only'])
    .maybeSingle();
  if (error) throw new Error('Produktdaten konnten nicht geladen werden.');
  return (data as Product | null) ?? null;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  if (!product) return { title: 'Produkt nicht gefunden | AgeLess', robots: { index: false } };
  return {
    title: `${product.name} | AgeLess`,
    description: product.short_description ?? 'Produktinformation und wissenschaftliche Einordnung bei AgeLess.',
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  if (!product) notFound();

  const isResearch = product.sales_mode === 'research_only';

  return (
    <main className="catalog-page">
      <header className="catalog-header">
        <Link href="/" className="catalog-brand" aria-label="AgeLess Startseite">
          <img src="/ageless-logo.svg" alt="AgeLess — Science for a Longer, Better Life" />
        </Link>
        <Link href="/shop" className="catalog-back">← Zur Produktübersicht</Link>
      </header>

      <article className="ag-detail">
        <div className="ag-detail-visual">
          {product.image_url
            ? <img src={product.image_url} alt={product.name} />
            : <div className="ag-detail-placeholder">AGELESS<span>SCIENCE FOR A LONGER, BETTER LIFE</span></div>}
        </div>
        <div className="ag-detail-content">
          <span className="ag-section-label">AGELESS / PRODUKTINFORMATION</span>
          <h1>{product.name}</h1>
          <p className="ag-detail-lead">{product.short_description ?? 'Wissenschaftlich orientierte Produktinformation mit transparenter Einordnung.'}</p>
          <div className="ag-detail-status">
            <strong>{isResearch ? 'Research / nicht zur Humananwendung freigegeben' : 'Produktinformation / derzeit nicht bestellbar'}</strong>
            <span>Einordnung: {product.compliance_status.replaceAll('_', ' ')}</span>
          </div>
          {product.description && <section className="ag-detail-section"><h2>Beschreibung</h2><p>{product.description}</p></section>}
          {product.evidence_note && <section className="ag-detail-section"><h2>Wissenschaftliche Einordnung</h2><p>{product.evidence_note}</p></section>}
          <section className="ag-detail-section">
            <h2>Rechtliche Einordnung</h2>
            <p>{product.jurisdiction_note ?? 'Die konkrete Produktform und der Verwendungszweck müssen vor einer möglichen Vermarktung gesondert geprüft werden.'}</p>
            <p>Diese Seite ist eine Produktinformation und kein Kaufangebot. Es sind derzeit keine Bestellungen für dieses Produkt möglich. Research Use Only bedeutet keine Freigabe zur Anwendung am Menschen.</p>
          </section>
          <Link href="/shop" className="ag-detail-return">Alle Produkte ansehen <span>→</span></Link>
        </div>
      </article>
    </main>
  );
}
