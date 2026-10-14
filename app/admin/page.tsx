'use client';
import { useCallback, useEffect, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { validEvidence } from '../../lib/commerce/approval';

type Evidence = { country: string; intended_use: string; valid_from: string; valid_until: string; evidence_url: string; restrictions: string; status: 'pending' | 'verified' | 'blocked' };
type Offer = { catalog_visible: boolean; on_hold: boolean; hold_reason: string | null; legal_evidence: Evidence[]; reviewed_at: string | null; approved_by: string | null; updated_at: string; id: string; slug: string; name: string; description: string | null; image_url: string | null; allowed_countries: string[]; price_cents: number | null; shipping_cents: number; stock_quantity: number | null; approval_reference: string | null; manual_approved: boolean; is_published: boolean; compliance_status: string };
type Legal = { slug: string; title: string; body: string; published: boolean };
type Order = { id: string; buyer_name: string; email: string; country_code: string; items: Array<{ name?: string; quantity?: number }>; total_cents: number; status: string; payment_mode: 'sandbox' | 'live'; paypal_order_id: string | null; paypal_capture_id: string | null; created_at: string; paid_at: string | null };
type Dashboard = { owner: boolean; accessRequests: Array<{ user_id: string; email: string; status: string; requested_at: string; approved_by: string | null }>; settings: { mode: string }; offers: Offer[]; pages: Legal[]; orders: Order[]; env: { paypal: boolean; paypalLive: boolean; paypalEnvironment: string; checkoutEnabled: boolean; origin: boolean; supabase: boolean }; legalReady: boolean; offersReady: boolean };
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let authClient: SupabaseClient | null = null;
function auth() {
  if (!url || !key) return null;
  if (!authClient) authClient = createBrowserClient(url, key, { auth: { flowType: 'implicit' } });
  return authClient;
}
const euro = (c: number) => (c / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });


function PasswordField({ value, onChange, autoComplete, minLength }: {
  value: string; onChange: (value: string) => void;
  autoComplete: string; minLength?: number;
}) {
  const [visible, setVisible] = useState(false);
  return <span style={{ display: 'block', position: 'relative' }}>
    <input type={visible ? 'text' : 'password'} required minLength={minLength}
      autoComplete={autoComplete} value={value} onChange={e => onChange(e.target.value)}
      style={{ paddingRight: '56px' }} />
    <button type="button" aria-label={visible ? 'Passwort verbergen' : 'Passwort anzeigen'}
      aria-pressed={visible} title={visible ? 'Passwort verbergen' : 'Passwort anzeigen'}
      onClick={() => setVisible(current => !current)}
      style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)',
        width: '44px', height: '44px', minHeight: '44px', margin: 0, padding: 0,
        display: 'grid', placeItems: 'center', background: 'transparent', color: '#123443',
        border: 0, borderRadius: '6px', cursor: 'pointer' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
        {visible && <path d="m3 3 18 18" />}
      </svg>
    </button>
  </span>;
}

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>('login');
  const [newPassword, setNewPassword] = useState('');
  const [token, setToken] = useState('');
  const [data, setData] = useState<Dashboard | null>(null);
  const [tab, setTab] = useState('overview');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [confirmLive, setConfirmLive] = useState('');

  const load = useCallback(async (accessToken: string) => {
    const response = await fetch('/api/admin', { headers: { Authorization: 'Bearer ' + accessToken }, cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error === 'ACCESS_PENDING_OR_UNAUTHORIZED' ? 'Dein Zugang ist noch nicht freigegeben. Bitte E-Mail bestätigen; Victor muss deinen Zugang anschließend genehmigen.' : 'Die Verwaltung ist noch nicht betriebsbereit. Bitte den Betreiber informieren.');
    setData(result as Dashboard);
  }, []);

  useEffect(() => {
    const client = auth();
    if (!client) { setMessage('Supabase-Zugang für die Anmeldung fehlt.'); return; }
    client.auth.getSession().then(({ data: session }) => {
      const t = session.session?.access_token;
      if (t) { setToken(t); load(t).catch(e => setMessage(String(e.message))); }
    });
    const { data: listener } = client.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setAuthMode('reset');
      setToken(session?.access_token || '');
      if (!session) setData(null);
      else if (event !== 'PASSWORD_RECOVERY') setTimeout(() => { load(session.access_token).catch(e => setMessage(e.message)); }, 0);
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

  async function accountAction(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const client = auth();
      if (!client) throw new Error('Anmeldedienst nicht konfiguriert.');
      const redirectTo = window.location.origin + '/admin';
      if (authMode === 'signup') {
        if (password.length < 12) throw new Error('Bitte mindestens 12 Zeichen als Passwort wählen.');
        const { error } = await client.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
        if (error) throw error;
        setMessage('Konto angelegt. Bitte E-Mail bestätigen und danach anmelden, um den Zugang zu beantragen. Der Zugang bleibt bis zur Freigabe durch den Betreiber gesperrt.');
        setAuthMode('login');
      } else if (authMode === 'forgot') {
        const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) throw error;
        setMessage('Falls das Konto existiert, erhältst du einen Link zum Zurücksetzen des Passworts.');
        setAuthMode('login');
      } else if (authMode === 'reset') {
        if (newPassword.length < 12) throw new Error('Bitte mindestens 12 Zeichen als Passwort wählen.');
        const { error } = await client.auth.updateUser({ password: newPassword });
        if (error) throw error;
        setNewPassword(''); setAuthMode('login');
        setMessage('Passwort geändert. Bitte erneut anmelden.');
        await client.auth.signOut();
      }
      setPassword('');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Anfrage fehlgeschlagen'); }
    finally { setBusy(false); }
  }

  async function save(payload: Record<string, unknown>) {
    const client = auth();
    const session = await client?.auth.getSession();
    const t = session?.data.session?.access_token || token;
    if (!t) { setMessage('Sitzung abgelaufen. Bitte erneut anmelden.'); return false; }
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin', { method: 'POST', headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Speichern fehlgeschlagen');
      await load(t);
      setMessage('Gespeichert.');
      return true;
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Speichern fehlgeschlagen'); return false; }
    finally { setBusy(false); }
  }
  function changeOffer(id: string, key: keyof Offer, value: string | number | boolean | string[] | Evidence[] | null) {
    setData(current => current ? { ...current, offers: current.offers.map(o => o.id === id ? { ...o, [key]: value } : o) } : null);
  }
  function changeLegal(slug: string, key: keyof Legal, value: string | boolean) {
    setData(current => current ? { ...current, pages: current.pages.map(p => p.slug === slug ? { ...p, [key]: value } : p) } : null);
  }
  return <main className="age-admin">
    <header className="age-admin-header"><Link href="/"><img src="/ageless-logo.svg" alt="AgeLess" /></Link><span>STORE CONTROL CENTER</span>{token && <button type="button" onClick={async () => { await auth()?.auth.signOut(); setToken(''); setData(null); }}>Abmelden</button>}</header>
    {!data ? <section className="age-admin-login"><span>GESCHÜTZTER BEREICH</span><h1>{authMode === 'signup' ? 'Zugang beantragen' : authMode === 'forgot' ? 'Passwort vergessen' : authMode === 'reset' ? 'Neues Passwort' : 'AgeLess Verwaltung'}</h1><p>{authMode === 'signup' ? 'Nach E-Mail-Bestätigung ist eine persönliche Freigabe durch den Betreiber erforderlich.' : authMode === 'forgot' ? 'Wir senden einen Link zum Zurücksetzen an deine E-Mail-Adresse.' : authMode === 'reset' ? 'Vergib ein neues, sicheres Passwort.' : 'Nur bestätigte und freigegebene Administratoren können sich anmelden.'}</p><form onSubmit={authMode === 'login' ? signIn : accountAction}>{authMode !== 'reset' && <label>E-Mail-Adresse<input type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} /></label>}{(authMode === 'login' || authMode === 'signup') && <label>Passwort<PasswordField key={authMode} minLength={authMode === 'signup' ? 12 : undefined} autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={setPassword} /></label>}{authMode === 'reset' && <label>Neues Passwort<PasswordField key="reset" minLength={12} autoComplete="new-password" value={newPassword} onChange={setNewPassword} /></label>}<button disabled={busy} type="submit">{busy ? 'Bitte warten …' : authMode === 'signup' ? 'Freigabe beantragen' : authMode === 'forgot' ? 'Reset-Link senden' : authMode === 'reset' ? 'Passwort speichern' : 'Sicher anmelden →'}</button></form><div className="age-admin-auth-links">{authMode !== 'login' && <button type="button" onClick={() => { setAuthMode('login'); setMessage(''); }}>Zum Log-in</button>}{authMode === 'login' && <><button type="button" onClick={() => { setAuthMode('signup'); setMessage(''); }}>Sign-up / Zugang beantragen</button><button type="button" onClick={() => { setAuthMode('forgot'); setMessage(''); }}>Passwort vergessen?</button></>}</div>{message && <p role="alert">{message}</p>}</section>
    : <div className="age-admin-layout">
      <aside className="age-admin-sidebar"><h2>Verwaltung</h2>{[['overview','Übersicht'],['products','Produkte & Bestand'],['orders','Bestellungen'],['legal','Rechtstexte'],['payment','Zahlung & Livegang'],...(data.owner ? [['users','Nutzerfreigabe']] : [])].map(([id,label]) => <button key={id} type="button" className={tab === id ? 'active' : ''} onClick={() => { setTab(id); setMessage(''); }}>{label}</button>)}<Link href="/shop/angebote">Öffentlichen Shop ansehen ↗</Link></aside>
      <div className="age-admin-main">
        <div className="age-admin-heading"><div><span>AGELESS / ADMIN</span><h1>{tab === 'overview' ? 'Dein Dashboard' : tab === 'products' ? 'Produkte & Inventar' : tab === 'orders' ? 'Bestellungen & Testläufe' : tab === 'legal' ? 'Rechtliche Pflichtseiten' : tab === 'users' ? 'Nutzerfreigaben' : 'Zahlung & Veröffentlichung'}</h1></div><span className="age-admin-mode">MODUS: {data.settings.mode.toUpperCase()}</span></div>
        {message && <p className="age-admin-alert" role="status">{message}</p>}
        {tab === 'overview' && <><div className="age-admin-cards"><article><span>01 / PRODUKTE</span><strong>{data.offers.length}</strong><p>Erfasste Angebote</p></article><article><span>02 / RECHTSTEXTE</span><strong>{data.pages.filter(p => p.published).length}/4</strong><p>Veröffentlicht</p></article><article><span>03 / ZAHLUNG</span><strong>{data.env.paypalLive ? 'LIVE BEREIT' : data.env.paypal ? 'SANDBOX' : 'OFF'}</strong><p>PayPal-Konfiguration</p></article></div><section className="age-admin-panel"><h2>Deine nächsten Schritte</h2><ol><li>Produkte und Bestände erfassen, Verkaufsfreigabe dokumentieren.</li><li>Impressum, Datenschutz, AGB und Widerruf juristisch prüfen und veröffentlichen.</li><li>PayPal-Sandbox und Server-Zugangsdaten in Railway konfigurieren.</li><li>Testbestellung durchführen; erst danach auf Live wechseln.</li></ol></section></>}
        {tab === 'products' && <><section className="age-admin-panel"><h2>Neues Produkt anlegen</h2><p>Neue Angebote starten immer als nicht freigegebener Entwurf.</p><div className="age-admin-fields"><label>Produktname<input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Produktname" /></label><label>URL-Kürzel<input value={newSlug} onChange={e => setNewSlug(e.target.value)} placeholder="produkt-name" /></label><label>Preis in €<input type="number" min="0.01" step="0.01" value={newPrice} onChange={e => setNewPrice(e.target.value)} /></label><label>Bestand (Stück)<input type="number" min="0" step="1" value={newStock} onChange={e => setNewStock(e.target.value)} /></label></div><button disabled={busy} onClick={() => save({ action:'create_offer', name:newName, slug:newSlug, price_cents:newPrice === '' ? null : Math.round(Number(newPrice)*100), stock_quantity:newStock === '' ? null : Number(newStock) }).then(ok => { if (ok) { setNewName(''); setNewSlug(''); } })}>Produkt als Entwurf anlegen</button></section>
        {data.offers.map(o => <section className="age-admin-panel" key={o.id}><div className="age-admin-panel-head"><h2>{o.name}</h2><span>{o.on_hold ? 'ON HOLD – VERKAUF UND ANFRAGEN PAUSIERT' : o.is_published ? 'ÖFFENTLICH' : 'ENTWURF'}</span></div><div className="age-admin-fields"><label>Name<input value={o.name} onChange={e => changeOffer(o.id,'name',e.target.value)} /></label><label>Preis (€)<input type="number" min="0.01" step="0.01" placeholder="Noch unbekannt" value={o.price_cents === null ? '' : (o.price_cents/100).toFixed(2)} onChange={e => changeOffer(o.id,'price_cents',e.target.value === '' ? null : Math.round(Number(e.target.value)*100))} /></label><label>Versand (€)<input type="number" min="0" step="0.01" value={(o.shipping_cents/100).toFixed(2)} onChange={e => changeOffer(o.id,'shipping_cents',Math.round(Number(e.target.value)*100))} /></label><label>Inventar<input type="number" min="0" step="1" placeholder="Noch unbekannt" value={o.stock_quantity ?? ''} onChange={e => changeOffer(o.id,'stock_quantity',e.target.value === '' ? null : Number(e.target.value))} /></label></div><label>Produktbeschreibung<textarea rows={3} value={o.description || ''} onChange={e => changeOffer(o.id,'description',e.target.value)} /></label><label>Produktbild (HTTPS-URL)<input value={o.image_url || ''} onChange={e => changeOffer(o.id,'image_url',e.target.value)} placeholder="https://..." /></label><label>Lieferländer (ISO-Codes, Komma-getrennt)<input value={o.allowed_countries.join(',')} onChange={e => changeOffer(o.id,'allowed_countries',e.target.value.split(',').map(x => x.trim().toUpperCase()))} placeholder="DE,AT" /></label><label>Nachweis der rechtlichen Produktfreigabe<input value={o.approval_reference || ''} onChange={e => changeOffer(o.id,'approval_reference',e.target.value)} placeholder="Prüfvermerk / Dokumentreferenz" /></label><label><input type="checkbox" disabled={!data.owner} checked={o.on_hold} onChange={e => { changeOffer(o.id,'on_hold',e.target.checked); if (e.target.checked) { changeOffer(o.id,'manual_approved',false); changeOffer(o.id,'is_published',false); } }} /> On hold: Verkauf und tägliche E-Mail-Anfragen pausieren</label><label>Hold-Grund<input disabled={!data.owner} value={o.hold_reason || ''} onChange={e => changeOffer(o.id,'hold_reason',e.target.value)} placeholder="Warum pausiert dieses Produkt?" /></label><label><input type="checkbox" disabled={!data.owner} checked={o.catalog_visible === true} onChange={e => changeOffer(o.id,'catalog_visible',e.target.checked)} /> Produkt öffentlich anzeigen (erteilt keine Verkaufsfreigabe)</label><h3>Rechtsnachweise je Verkaufsland</h3><p role="status">{validEvidence(o.legal_evidence, o.allowed_countries) ? 'Nachweise für alle Lieferländer aktuell geprüft' : 'VERKAUF GESPERRT: Nachweise fehlen, sind ungeklärt oder abgelaufen'}</p><p>Freigabe gilt nur für das angegebene Produkt, Land und den dokumentierten Verwendungszweck. Offene oder abgelaufene Nachweise sperren den Checkout.</p>
        {(o.legal_evidence || []).map((r,index) => <fieldset key={index}><legend>{r.country || 'Neuer Nachweis'} · {r.status === 'verified' ? 'Geprüft' : r.status === 'blocked' ? 'Gesperrt' : 'Klärung offen'}</legend><div className="age-admin-fields">{([['country','Land (ISO-Code)'],['intended_use','Verwendungszweck / Produktvariante'],['valid_from','Rechtlich gültig seit'],['valid_until','Gültig bis (optional)'],['evidence_url','Originalnachweis (HTTPS)'],['restrictions','Auflagen / offene Fragen']] as const).map(([key,label]) => <label key={key}>{label}<input disabled={!data.owner} type={key.startsWith('valid_') ? 'date' : 'text'} value={r[key]} onChange={e => changeOffer(o.id,'legal_evidence',o.legal_evidence.map((row,i) => i === index ? {...row,[key]: key === 'country' ? e.target.value.toUpperCase() : e.target.value} : row))} /></label>)}</div><label>Prüfstatus<select disabled={!data.owner} value={r.status} onChange={e => changeOffer(o.id,'legal_evidence',o.legal_evidence.map((row,i) => i === index ? {...row,status:e.target.value as Evidence['status']} : row))}><option value="pending">Ungeklärt / Nachweis fehlt</option><option value="verified">Nachweis kontrolliert</option><option value="blocked">Verkauf gesperrt</option></select></label>{data.owner && <button disabled={busy} onClick={() => changeOffer(o.id,'legal_evidence',o.legal_evidence.filter((_,i) => i !== index))}>Nachweis entfernen</button>}</fieldset>)}
        {data.owner && <button disabled={busy} onClick={() => changeOffer(o.id,'legal_evidence',[...(o.legal_evidence || []),{country:'DE',intended_use:'',valid_from:'',valid_until:'',evidence_url:'',restrictions:'',status:'pending'}])}>Nachweis hinzufügen</button>}
        <p>Letzte Freigabe: {o.reviewed_at ? new Date(o.reviewed_at).toLocaleString('de-DE') : 'Noch nicht freigegeben'} · {o.approved_by || 'Keine Freigabe durch Betreiber'}</p>
        <div className="age-admin-checks"><label><input disabled={!data.owner || o.on_hold} type="checkbox" checked={o.manual_approved} onChange={e => changeOffer(o.id,'manual_approved',e.target.checked)} /> Als Betreiber endgültig für Verkauf freigeben</label><label><input disabled={!data.owner || o.on_hold} type="checkbox" checked={o.is_published} onChange={e => changeOffer(o.id,'is_published',e.target.checked)} /> Bestellung für dieses Produkt freischalten</label></div><button disabled={busy} onClick={() => save({ action:'offer', ...o, allowed_countries:o.allowed_countries.join(',') })}>Produkt speichern</button><small>Freigabe nur durch Betreiber mit gültigen, geprüften Nachweisen für jedes Lieferland.</small></section>)}</>}
        {tab === 'users' && data.owner && <section className="age-admin-panel"><h2>Zugänge durch Victor freigeben</h2><p>Bestätigte Konten beantragen beim ersten Login Zugang. Bis zur Freigabe bleiben sie gesperrt.</p>{data.accessRequests.length === 0 && <p>Keine Zugangsanforderungen vorhanden.</p>}{data.accessRequests.map(r => <article key={r.user_id}><h3>{r.email}</h3><p>{r.status} · Angefragt am {new Date(r.requested_at).toLocaleString('de-DE')}</p><button disabled={busy || r.status === 'approved'} onClick={() => save({action:'access',user_id:r.user_id,status:'approved'})}>Zugang freigeben</button><button disabled={busy || r.status === 'rejected'} onClick={() => save({action:'access',user_id:r.user_id,status:'rejected'})}>Zugang sperren</button></article>)}</section>}
        {tab === 'orders' && <section className="age-admin-panel"><div className="age-admin-panel-head"><h2>Letzte Bestellungen</h2><span>{data.orders.length} Einträge</span></div><p>Sandbox-Bestellungen werden klar von echten Live-Bestellungen getrennt. Der Admin-Bereich zeigt nur serverseitig gespeicherte Zahlungszustände.</p>{data.orders.length === 0 ? <p>Noch keine Bestellungen vorhanden.</p> : <div className="age-admin-orders">{data.orders.map(o => <article key={o.id}><div><strong>{o.payment_mode === 'sandbox' ? 'TEST' : 'LIVE'} · {o.status.toUpperCase()}</strong><span>{new Date(o.created_at).toLocaleString('de-DE')}</span></div><h3>{o.buyer_name}</h3><p>{o.email} · {o.country_code} · {o.items?.map(i => (i.name || 'Produkt') + ' × ' + (i.quantity || 1)).join(', ')}</p><div><b>{euro(o.total_cents)}</b><small>{o.paid_at ? 'Bezahlt: ' + new Date(o.paid_at).toLocaleString('de-DE') : 'Noch nicht als bezahlt bestätigt'}</small></div></article>)}</div>}</section>}
        {tab === 'legal' && data.pages.map(p => <section className="age-admin-panel" key={p.slug}><div className="age-admin-panel-head"><h2>{p.title}</h2><Link href={'/rechtliches/'+p.slug} target="_blank">Seite ansehen ↗</Link></div><p>Hier ausschließlich geprüfte Texte des tatsächlichen Betreibers einfügen. Kein automatisch erzeugter Rechtstext wird als rechtlich freigegeben behandelt.</p><textarea rows={10} value={p.body} onChange={e => changeLegal(p.slug,'body',e.target.value)} placeholder={'Geprüften Text für '+p.title+' einfügen'} /><label className="age-admin-check"><input type="checkbox" checked={p.published} onChange={e => changeLegal(p.slug,'published',e.target.checked)} /> Geprüft und öffentlich veröffentlichen</label><button disabled={busy} onClick={() => save({ action:'legal', slug:p.slug, body:p.body, published:p.published })}>Rechtstext speichern</button></section>)}
        {tab === 'payment' && <><section className="age-admin-panel"><h2>PayPal-Anbindung</h2><p>Zahlungsdaten und geheime API-Schlüssel werden ausschließlich in Railway hinterlegt, niemals hier im Browser.</p><div className="age-admin-status">{[['PayPal Sandbox',data.env.paypal],['PayPal Live',data.env.paypalLive],['Shop-Origin',data.env.origin],['Checkout-Serverfreigabe',data.env.checkoutEnabled],['Datenbank-Servicezugang',data.env.supabase],['Pflichttexte veröffentlicht',data.legalReady],['Verkaufsprodukt freigegeben',data.offersReady]].map(([label,ok]) => <div key={String(label)}><span>{label}</span><strong>{ok ? 'Bereit' : 'Offen'}</strong></div>)}</div><p>Sandbox- und Live-Zugangsdaten werden getrennt in Railway hinterlegt. Der Umschalter benötigt anschließend keine Änderung der API-Schlüssel.</p></section>
        <section className="age-admin-panel"><h2>Betriebsmodus</h2><p>Entwurf: keine Zahlungen. Sandbox: ausschließlich PayPal-Testzahlungen. Live: reale Zahlungen nur nach erfüllten Freigabebedingungen.</p><div className="age-admin-mode-buttons"><button disabled={busy} onClick={() => save({action:'mode',mode:'draft'})}>Entwurf / Stop</button><button disabled={busy} onClick={() => save({action:'mode',mode:'sandbox'})}>Sandbox aktivieren</button></div><label>Für Live-Freigabe exakt LIVE FREIGEBEN eingeben<input value={confirmLive} onChange={e => setConfirmLive(e.target.value)} placeholder="LIVE FREIGEBEN" /></label><button className="age-admin-live" disabled={busy || confirmLive !== 'LIVE FREIGEBEN'} onClick={() => save({action:'mode',mode:'live',confirm:confirmLive})}>Live-Verkauf freigeben</button><small>Eine Freigabe umgeht weder PayPal-Zulassung noch gesetzliche Vorgaben.</small></section></>}
      </div>
    </div>}
  </main>;
}

