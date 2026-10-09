'use client';
import { useCallback, useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Link from 'next/link';

type Offer = { id: string; slug: string; name: string; price_cents: number; shipping_cents: number; stock_quantity: number; approval_reference: string | null; manual_approved: boolean; is_published: boolean; compliance_status: string };
type Legal = { slug: string; title: string; body: string; published: boolean };
type Dashboard = { settings: { mode: string }; offers: Offer[]; pages: Legal[]; env: { paypal: boolean; paypalLive: boolean; paypalEnvironment: string; checkoutEnabled: boolean; origin: boolean; supabase: boolean }; legalReady: boolean; offersReady: boolean };
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let authClient: SupabaseClient | null = null;
function auth() {
  if (!url || !key) return null;
  if (!authClient) authClient = createClient(url, key);
  return authClient;
}
const euro = (c: number) => (c / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [data, setData] = useState<Dashboard | null>(null);
  const [tab, setTab] = useState('overview');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newPrice, setNewPrice] = useState('19.90');
  const [newStock, setNewStock] = useState('0');
  const [confirmLive, setConfirmLive] = useState('');

  const load = useCallback(async (accessToken: string) => {
    const response = await fetch('/api/admin', { headers: { Authorization: 'Bearer ' + accessToken }, cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error === 'UNAUTHORIZED' ? 'Keine Admin-Berechtigung. Prüfe AGELESS_ADMIN_EMAILS und die bestätigte E-Mail-Adresse.' : 'Admin-Datenbank nicht bereit. SQL-Migration und Railway-Variablen prüfen.');
    setData(result as Dashboard);
  }, []);

  useEffect(() => {
    const client = auth();
    if (!client) { setMessage('Supabase-Zugang für die Anmeldung fehlt.'); return; }
    client.auth.getSession().then(({ data: session }) => {
      const t = session.session?.access_token;
      if (t) { setToken(t); load(t).catch(e => setMessage(String(e.message))); }
    });
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token || '');
      if (!session) setData(null);
    });
    return () => listener.subscription.unsubscribe();
  }, [load]);

  async function signIn(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const client = auth();
      if (!client) throw new Error('Supabase ist nicht konfiguriert.');
      const { data: session, error } = await client.auth.signInWithPassword({ email, password });
      if (error || !session.session) throw new Error('Anmeldung fehlgeschlagen. Bitte Zugangsdaten und E-Mail-Bestätigung prüfen.');
      setToken(session.session.access_token);
      await load(session.session.access_token);
      setPassword('');
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Fehler'); }
    finally { setBusy(false); }
  }

  async function save(payload: Record<string, unknown>) {
    const client = auth();
    const session = await client?.auth.getSession();
    const t = session?.data.session?.access_token || token;
    if (!t) { setMessage('Sitzung abgelaufen. Bitte erneut anmelden.'); return; }
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin', { method: 'POST', headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Speichern fehlgeschlagen');
      await load(t);
      setMessage('Gespeichert.');
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Speichern fehlgeschlagen'); }
    finally { setBusy(false); }
  }
  function changeOffer(id: string, key: keyof Offer, value: string | number | boolean) {
    setData(current => current ? { ...current, offers: current.offers.map(o => o.id === id ? { ...o, [key]: value } : o) } : null);
  }
  function changeLegal(slug: string, key: keyof Legal, value: string | boolean) {
    setData(current => current ? { ...current, pages: current.pages.map(p => p.slug === slug ? { ...p, [key]: value } : p) } : null);
  }
  return <main className="age-admin">
    <header className="age-admin-header"><Link href="/"><img src="/ageless-logo.svg" alt="AgeLess" /></Link><span>STORE CONTROL CENTER</span>{token && <button type="button" onClick={async () => { await auth()?.auth.signOut(); setToken(''); setData(null); }}>Abmelden</button>}</header>
    {!data ? <section className="age-admin-login"><span>GESCHÜTZTER BEREICH</span><h1>AgeLess Verwaltung</h1><p>Nur für freigeschaltete Administratoren. Keine öffentliche Registrierung.</p><form onSubmit={signIn}><label>E-Mail-Adresse<input type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} /></label><label>Passwort<input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></label><button disabled={busy} type="submit">{busy ? 'Anmeldung läuft …' : 'Sicher anmelden →'}</button></form>{message && <p role="alert">{message}</p>}</section>
    : <div className="age-admin-layout">
      <aside className="age-admin-sidebar"><h2>Verwaltung</h2>{[['overview','Übersicht'],['products','Produkte & Bestand'],['legal','Rechtstexte'],['payment','Zahlung & Livegang']].map(([id,label]) => <button key={id} type="button" className={tab === id ? 'active' : ''} onClick={() => { setTab(id); setMessage(''); }}>{label}</button>)}<Link href="/shop/angebote">Öffentlichen Shop ansehen ↗</Link></aside>
      <div className="age-admin-main">
        <div className="age-admin-heading"><div><span>AGELESS / ADMIN</span><h1>{tab === 'overview' ? 'Dein Dashboard' : tab === 'products' ? 'Produkte & Inventar' : tab === 'legal' ? 'Rechtliche Pflichtseiten' : 'Zahlung & Veröffentlichung'}</h1></div><span className="age-admin-mode">MODUS: {data.settings.mode.toUpperCase()}</span></div>
        {message && <p className="age-admin-alert" role="status">{message}</p>}
        {tab === 'overview' && <><div className="age-admin-cards"><article><span>01 / PRODUKTE</span><strong>{data.offers.length}</strong><p>Erfasste Angebote</p></article><article><span>02 / RECHTSTEXTE</span><strong>{data.pages.filter(p => p.published).length}/4</strong><p>Veröffentlicht</p></article><article><span>03 / ZAHLUNG</span><strong>{data.env.paypalLive ? 'LIVE BEREIT' : data.env.paypal ? 'SANDBOX' : 'OFF'}</strong><p>PayPal-Konfiguration</p></article></div><section className="age-admin-panel"><h2>Deine nächsten Schritte</h2><ol><li>Produkte und Bestände erfassen, Verkaufsfreigabe dokumentieren.</li><li>Impressum, Datenschutz, AGB und Widerruf juristisch prüfen und veröffentlichen.</li><li>PayPal-Sandbox und Server-Zugangsdaten in Railway konfigurieren.</li><li>Testbestellung durchführen; erst danach auf Live wechseln.</li></ol></section></>}
        {tab === 'products' && <><section className="age-admin-panel"><h2>Neues Produkt anlegen</h2><p>Neue Angebote starten immer als nicht freigegebener Entwurf.</p><div className="age-admin-fields"><label>Produktname<input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Produktname" /></label><label>URL-Kürzel<input value={newSlug} onChange={e => setNewSlug(e.target.value)} placeholder="produkt-name" /></label><label>Preis in €<input type="number" min="0.01" step="0.01" value={newPrice} onChange={e => setNewPrice(e.target.value)} /></label><label>Bestand (Stück)<input type="number" min="0" step="1" value={newStock} onChange={e => setNewStock(e.target.value)} /></label></div><button disabled={busy} onClick={() => save({ action:'create_offer', name:newName, slug:newSlug, price_cents:Math.round(Number(newPrice)*100), stock_quantity:Number(newStock) }).then(() => { setNewName(''); setNewSlug(''); })}>Produkt als Entwurf anlegen</button></section>
        {data.offers.map(o => <section className="age-admin-panel" key={o.id}><div className="age-admin-panel-head"><h2>{o.name}</h2><span>{o.is_published ? 'ÖFFENTLICH' : 'ENTWURF'}</span></div><div className="age-admin-fields"><label>Name<input value={o.name} onChange={e => changeOffer(o.id,'name',e.target.value)} /></label><label>Preis (€)<input type="number" min="0.01" step="0.01" value={(o.price_cents/100).toFixed(2)} onChange={e => changeOffer(o.id,'price_cents',Math.round(Number(e.target.value)*100))} /></label><label>Versand (€)<input type="number" min="0" step="0.01" value={(o.shipping_cents/100).toFixed(2)} onChange={e => changeOffer(o.id,'shipping_cents',Math.round(Number(e.target.value)*100))} /></label><label>Inventar<input type="number" min="0" step="1" value={o.stock_quantity} onChange={e => changeOffer(o.id,'stock_quantity',Number(e.target.value))} /></label></div><label>Nachweis der rechtlichen Produktfreigabe<input value={o.approval_reference || ''} onChange={e => changeOffer(o.id,'approval_reference',e.target.value)} placeholder="Prüfvermerk / Dokumentreferenz" /></label><div className="age-admin-checks"><label><input type="checkbox" checked={o.manual_approved} onChange={e => changeOffer(o.id,'manual_approved',e.target.checked)} /> Rechtliche Produktprüfung abgeschlossen</label><label><input type="checkbox" checked={o.is_published} onChange={e => changeOffer(o.id,'is_published',e.target.checked)} /> Öffentlich im Verkauf anzeigen</label></div><button disabled={busy} onClick={() => save({ action:'offer', ...o })}>Produkt speichern</button><small>Freigabe nur mit dokumentierter Prüfung und positivem Bestand.</small></section>)}</>}
        {tab === 'legal' && data.pages.map(p => <section className="age-admin-panel" key={p.slug}><div className="age-admin-panel-head"><h2>{p.title}</h2><Link href={'/rechtliches/'+p.slug} target="_blank">Seite ansehen ↗</Link></div><p>Hier ausschließlich geprüfte Texte des tatsächlichen Betreibers einfügen. Kein automatisch erzeugter Rechtstext wird als rechtlich freigegeben behandelt.</p><textarea rows={10} value={p.body} onChange={e => changeLegal(p.slug,'body',e.target.value)} placeholder={'Geprüften Text für '+p.title+' einfügen'} /><label className="age-admin-check"><input type="checkbox" checked={p.published} onChange={e => changeLegal(p.slug,'published',e.target.checked)} /> Geprüft und öffentlich veröffentlichen</label><button disabled={busy} onClick={() => save({ action:'legal', slug:p.slug, body:p.body, published:p.published })}>Rechtstext speichern</button></section>)}
        {tab === 'payment' && <><section className="age-admin-panel"><h2>PayPal-Anbindung</h2><p>Zahlungsdaten und geheime API-Schlüssel werden ausschließlich in Railway hinterlegt, niemals hier im Browser.</p><div className="age-admin-status">{[['PayPal Sandbox',data.env.paypal],['PayPal Live',data.env.paypalLive],['Shop-Origin',data.env.origin],['Checkout-Serverfreigabe',data.env.checkoutEnabled],['Datenbank-Servicezugang',data.env.supabase],['Pflichttexte veröffentlicht',data.legalReady],['Verkaufsprodukt freigegeben',data.offersReady]].map(([label,ok]) => <div key={String(label)}><span>{label}</span><strong>{ok ? 'Bereit' : 'Offen'}</strong></div>)}</div><p>Sandbox- und Live-Zugangsdaten werden getrennt in Railway hinterlegt. Der Umschalter benötigt anschließend keine Änderung der API-Schlüssel.</p></section>
        <section className="age-admin-panel"><h2>Betriebsmodus</h2><p>Entwurf: keine Zahlungen. Sandbox: ausschließlich PayPal-Testzahlungen. Live: reale Zahlungen nur nach erfüllten Freigabebedingungen.</p><div className="age-admin-mode-buttons"><button disabled={busy} onClick={() => save({action:'mode',mode:'draft'})}>Entwurf / Stop</button><button disabled={busy} onClick={() => save({action:'mode',mode:'sandbox'})}>Sandbox aktivieren</button></div><label>Für Live-Freigabe exakt LIVE FREIGEBEN eingeben<input value={confirmLive} onChange={e => setConfirmLive(e.target.value)} placeholder="LIVE FREIGEBEN" /></label><button className="age-admin-live" disabled={busy || confirmLive !== 'LIVE FREIGEBEN'} onClick={() => save({action:'mode',mode:'live',confirm:confirmLive})}>Live-Verkauf freigeben</button><small>Eine Freigabe umgeht weder PayPal-Zulassung noch gesetzliche Vorgaben.</small></section></>}
      </div>
    </div>}
  </main>;
}
