'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

type Mode = 'login' | 'register' | 'forgot' | 'reset';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function CustomerLogin() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => { if (new URLSearchParams(window.location.search).get('reset') === '1') setMode('reset'); }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      if (!url || !key) throw new Error('Die Anmeldung ist noch nicht eingerichtet.');
      const client = createBrowserClient(url, key);
      if (mode === 'register') {
        if (password.length < 12) throw new Error('Bitte wähle mindestens 12 Zeichen.');
        const { error } = await client.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + '/login' } });
        if (error) throw error;
        setMessage('Bitte bestätige deine E-Mail-Adresse. Dein Testzugang muss anschließend freigegeben werden.');
        setPassword('');
        setMode('login');
      } else if (mode === 'forgot') {
        const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/login?reset=1' });
        if (error) throw error;
        setMessage('Falls dein Konto existiert, erhältst du eine E-Mail zum Zurücksetzen des Passworts.');
        setMode('login');
      } else if (mode === 'reset') {
        if (password.length < 12) throw new Error('Bitte wähle mindestens 12 Zeichen.');
        const { error } = await client.auth.updateUser({ password });
        if (error) throw new Error('Der Reset-Link ist abgelaufen oder ungültig. Fordere bitte einen neuen Link an.');
        await client.auth.signOut();
        setMessage('Passwort geändert. Bitte melde dich erneut an.');
        setPassword('');
        setMode('login');
      } else {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw new Error('Anmeldung fehlgeschlagen. Bitte Zugangsdaten und E-Mail-Bestätigung prüfen.');
        setAuthenticated(true);
        setPassword('');
        setMessage('Anmeldung erfolgreich. Der Shopzugang wird serverseitig geprüft.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten.');
    } finally {
      setBusy(false);
    }
  }

  return <main className="al-customer-auth">
    <header className="al-customer-auth-header"><Link href="/" aria-label="AgeLess Startseite"><img src="/ageless-logo.svg" alt="AgeLess" /></Link><Link href="/">Zur Startseite ↗</Link></header>
    <section className="al-customer-auth-layout">
      <div className="al-customer-auth-intro"><span>AGELESS · PRIVATE ACCESS</span><h1>Willkommen<br/><em>bei AgeLess.</em></h1><p>Dein persönlicher Zugang zur AgeLess-Produktwelt. Entdecke unser Sortiment in Ruhe – klar, hochwertig und übersichtlich.</p></div>
      <div className="al-customer-auth-card"><span className="al-customer-auth-kicker">PERSÖNLICHER ZUGANG</span>
        <h2>{mode === 'register' ? 'Konto erstellen' : mode === 'forgot' ? 'Passwort zurücksetzen' : mode === 'reset' ? 'Neues Passwort' : 'Anmelden'}</h2>
        <p>{mode === 'register' ? 'Erstelle dein Konto. Für den geschützten Testshop ist anschließend eine Freigabe nötig.' : mode === 'forgot' ? 'Wir schicken dir einen Link zum Zurücksetzen.' : mode === 'reset' ? 'Lege dein neues Passwort fest.' : 'Melde dich mit deiner E-Mail-Adresse an.'}</p>
        <form onSubmit={submit}>
          {mode !== 'reset' && <><label htmlFor="al-customer-email">E-Mail-Adresse</label>
          <input id="al-customer-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@beispiel.de" /></>}
          {mode !== 'forgot' && <><label htmlFor="al-customer-password">Passwort</label><div className="al-customer-password"><input id="al-customer-password" type={show ? 'text' : 'password'} autoComplete={mode === 'register' || mode === 'reset' ? 'new-password' : 'current-password'} required minLength={mode === 'register' || mode === 'reset' ? 12 : undefined} value={password} onChange={e => setPassword(e.target.value)} /><button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Passwort verbergen' : 'Passwort anzeigen'} aria-pressed={show}>{show ? 'Verbergen' : 'Anzeigen'}</button></div></>}
          <button className="al-customer-submit" type="submit" disabled={busy}>{busy ? 'Bitte warten …' : mode === 'register' ? 'Konto erstellen →' : mode === 'forgot' ? 'Link anfordern →' : mode === 'reset' ? 'Passwort speichern →' : 'Jetzt anmelden →'}</button>
        </form>
        {message && <p role="status" className="al-customer-auth-message">{message}</p>}
        {authenticated && <Link className="al-customer-shop-link" href="/shop">Zum geschützten Shop →</Link>}
        <div className="al-customer-auth-options">
          {mode === 'login' ? <><button type="button" onClick={() => {setMode('forgot');setMessage('');}}>Passwort vergessen?</button><button type="button" onClick={() => {setMode('register');setMessage('');}}>Konto erstellen</button></> : <button type="button" onClick={() => {setMode('login');setMessage('');}}>Zur Anmeldung</button>}
        </div>
        <p className="al-customer-auth-note">Der Zugang zum Testshop ist nur nach E-Mail-Bestätigung und Freigabe möglich. Der Verwaltungszugang ist getrennt.</p>
      </div>
    </section>
    <footer className="al-customer-auth-footer"><Link href="/rechtliches/impressum">Impressum</Link><Link href="/rechtliches/datenschutz">Datenschutz</Link></footer>
  </main>;
}
