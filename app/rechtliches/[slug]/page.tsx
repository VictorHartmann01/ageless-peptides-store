import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminClient } from '../../../lib/commerce/server';

export const dynamic = 'force-dynamic';
const names: Record<string,string> = { impressum: 'Impressum', datenschutz: 'Datenschutz', agb: 'Allgemeine Geschäftsbedingungen', widerruf: 'Widerrufsbelehrung' };
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: names[slug] ? names[slug] + ' | AgeLess' : 'AgeLess', robots: { index: false, follow: false } };
}
export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!names[slug]) notFound();
  let page: { title: string; body: string } | null = null;
  try {
    const { data, error } = await getAdminClient().from('ageless_legal_pages').select('title,body').eq('slug',slug).eq('published',true).maybeSingle();
    if (!error && data) page = data;
  } catch { /* Not published until configured. */ }
  if (!page) notFound();
  return <main className="age-legal"><header><Link href="/"><img src="/ageless-logo.svg" alt="AgeLess" /></Link></header><article><Link href="/">← Startseite</Link><h1>{page.title}</h1><div className="age-legal-text">{page.body}</div></article><footer><Link href="/rechtliches/impressum">Impressum</Link><Link href="/rechtliches/datenschutz">Datenschutz</Link><Link href="/rechtliches/agb">AGB</Link><Link href="/rechtliches/widerruf">Widerruf</Link></footer></main>;
}
