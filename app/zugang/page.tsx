'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let instance: SupabaseClient | null = null;
function auth() {
  if (!instance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Anmeldung derzeit nicht verfügbar.');
    instance = createBrowserClient(url, key);
  }
  return instance;
}
export default function AccessPage() {
  const [mode,setMode] = useState<'login'|'signup'|'forgot'|'reset'>('login');
  const [email,setEmail] = useState('');
  const [show,setShow] = useState(false);
  const [approved,setApproved] = useState(false);
  const [password,setPassword] = useState('');
  const [message,setMessage] = useState('');
  const [busy,setBusy] = useState(false);
  const [token,setToken] = useState('');
  const [owner,setOwner] = useState(false);
  const [requests,setRequests] = useState<Array<{user_id:string;email:string;status:string}>>([]);
  async function api(jwt:string, method:'GET'|'POST'='GET', body?:object) {
    const res=await fetch('/api/customer-access',{method,headers:{Authorization:'Bearer '+jwt,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store'});
    const data=await res.json();
    if(!res.ok) throw new Error('Zugriffsprüfung fehlgeschlagen.');
    return data;
  }
  async function check(jwt:string) {
    setApproved(false);setOwner(false);
    const data=await api(jwt,'POST',{action:'request'});
    setToken(jwt);
    if(data.owner) {
      setOwner(true);setApproved(true);
      const all=await api(jwt);
      setRequests(all.requests||[]);
      setMessage('Betreiber angemeldet. Testzugänge können hier freigegeben werden.');
    } else if(data.status==='approved') {
      setApproved(true);
      setMessage('Zugang freigegeben. Du kannst den geschützten Testbereich öffnen.');
    } else if(data.status==='rejected') setMessage('Dein Zugang wurde nicht freigegeben.');
    else setMessage('Zugang beantragt. Bis zur persönlichen Freigabe bleibt der Testbereich gesperrt.');
  }
  useEffect(()=>{
    let live=true;try {
      const client=auth();
      if(new URLSearchParams(window.location.search).get('reset')==='1')setMode('reset');
      // The SSR browser client exchanges PKCE codes during initialization.
      // Do not exchange the same single-use code a second time here.
      client.auth.getSession().then(async ({data,error})=>{
        if(error)throw error;
        if(live&&data.session)await check(data.session.access_token);
      }).catch(e=>setMessage(String(e)));
      const {data}=client.auth.onAuthStateChange((event,session)=>{
        if(event==='PASSWORD_RECOVERY')setMode('reset');
        if(!session && live){setToken('');setOwner(false);setApproved(false);}
      });
      return()=>{live=false;data.subscription.unsubscribe()};
    } catch(e){setMessage(String(e));}
  },[]);
  async function submit(event:React.FormEvent) {
    event.preventDefault();setBusy(true);setMessage('');
    try {
      const client=auth();
      if(mode==='login') {
        const {data,error}=await client.auth.signInWithPassword({email,password});
        if(error||!data.session)throw new Error('Anmeldung fehlgeschlagen. E-Mail-Bestätigung und Zugangsdaten prüfen.');
        await check(data.session.access_token);
        setPassword('');
      } else if(mode==='signup') {
        const {error}=await client.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin+'/zugang'}});
        if(error)throw error;
        setMessage('Registrierung empfangen. Bitte die E-Mail bestätigen. Der Testzugang muss anschließend freigegeben werden.');
        setMode('login');setPassword('');
      } else if(mode==='forgot') {
        const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+'/zugang?reset=1'});
        if(error)throw error;
        setMessage('Wenn das Konto existiert, wird eine Nachricht zur Passwortänderung gesendet.');
      } else {
        const {error}=await client.auth.updateUser({password});
        if(error)throw error;
        setMode('login');setMessage('Passwort geändert. Du kannst dich anmelden.');setPassword('');
      }
    }catch(e){setMessage(e instanceof Error?e.message:'Fehler bei der Anmeldung.');}
    finally{setBusy(false);}
  }
  async function decide(id:string,status:string){
    setBusy(true);try{
      await api(token,'POST',{action:'decide',user_id:id,status});
      const data=await api(token);
      setRequests(data.requests||[]);
      setMessage('Freigabestatus gespeichert.');
    }catch(e){setMessage(String(e))}finally{setBusy(false)}
  }
  return <main className="age-admin"><header className="age-admin-header"><Link href="/zugang"><img src="/ageless-logo.svg" alt="AgeLess" /></Link><span>GESCHÜTZTER TESTBEREICH</span></header>
    <section className="age-admin-login"><span>AGELESS</span><h1>{mode==='signup'?'Zugang beantragen':mode==='forgot'?'Passwort zurücksetzen':mode==='reset'?'Neues Passwort':'Willkommen bei AgeLess'}</h1>
    <p>Unser Shop befindet sich in einer geschlossenen Testphase. Nur persönlich freigegebene Konten erhalten Zugriff.</p>
    <form onSubmit={submit} style={{display:'grid',gap:14}}>
    {mode!=='reset' && <label>E-Mail-Adresse<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>}
    {(mode==='login'||mode==='signup'||mode==='reset')&&<label>Passwort<input type={show?"text":"password"} autoComplete={mode==='login'?'current-password':'new-password'} minLength={mode==='login'?undefined:12} required value={password} onChange={e=>setPassword(e.target.value)}/></label>}
    {mode!=='forgot'&&<button type="button" aria-pressed={show} onClick={()=>setShow(!show)}>{show?'Passwort verbergen':'Passwort anzeigen'}</button>}
    <button type="submit" disabled={busy}>{busy?'Bitte warten…':mode==='signup'?'Registrieren':mode==='forgot'?'Reset-Link senden':mode==='reset'?'Neues Passwort speichern':'Anmelden'}</button>
    </form>
    <nav style={{display:'flex',gap:16,flexWrap:'wrap',marginTop:16}}>
      <button type="button" onClick={()=>{setMode('login');setMessage('')}}>Login</button>
      <button type="button" onClick={()=>{setMode('signup');setMessage('')}}>Registrieren</button>
      <button type="button" onClick={()=>{setMode('forgot');setMessage('')}}>Passwort vergessen?</button>
    </nav>
    {message&&<p role="status">{message}</p>}
    {token&&<p>{approved&&<Link href="/shop">Geschützten Bereich öffnen →</Link>} · <button type="button" onClick={async()=>{await auth().auth.signOut();setToken('');setOwner(false);setApproved(false);setMessage('Abgemeldet.')}}>Abmelden</button></p>}
    {owner&&<section aria-label="Testerfreigaben"><h2>Testerfreigaben (nur Betreiber)</h2>
      {requests.length===0?<p>Keine Anfragen vorhanden.</p>:requests.map(x=><div key={x.user_id} style={{margin:'14px 0',padding:12,border:'1px solid #ddd'}}><strong>{x.email}</strong><p>Status: {x.status}</p><button disabled={busy} onClick={()=>decide(x.user_id,'approved')}>Freigeben</button> <button disabled={busy} onClick={()=>decide(x.user_id,'rejected')}>Sperren</button></div>)}
    </section>}
    <p><Link href="/rechtliches/impressum">Impressum</Link> · <Link href="/rechtliches/datenschutz">Datenschutz</Link></p>
    </section></main>;
}
