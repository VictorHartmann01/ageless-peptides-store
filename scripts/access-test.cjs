const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { NextRequest } = require('next/server');
let user = null, access = null, authError = null, dbError = null, mode = 'sandbox', refreshed = false;
const env = { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test', SUPABASE_SERVICE_ROLE_KEY: 'server-test', AGELESS_OWNER_EMAILS: 'owner@example.com' };
const db = { from(table) { const q = { select: () => q, eq: () => q,
  maybeSingle: async () => ({ data: access, error: dbError }),
  single: async () => ({ data: { mode }, error: dbError }) }; return q; } };
const exportsObject = {};
const js = ts.transpileModule(fs.readFileSync('proxy.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
vm.runInNewContext(js, { exports: exportsObject, process: { env }, URL, require(name) {
  if (name === '@supabase/ssr') return { createServerClient: (_url, _key, options) => ({ auth: { getUser: async () => {
    if (refreshed) options.cookies.setAll([{ name: 'refreshed-session', value: 'new', options: { path: '/' } }]);
    return { data: { user }, error: authError };
  } } }) };
  if (name === '@supabase/supabase-js') return { createClient: () => db };
  return require(name);
} });
let checks = 0;
async function response(path) { return exportsObject.proxy(new NextRequest('https://www.ageless-peptides.store' + path)); }
async function expect(path, status) { const res = await response(path); assert.equal(res.status, status, path); checks++; return res; }
(async () => {
  for (const path of ['/', '/shop', '/shop/angebote', '/shop/product', '/shop/warenkorb', '/shop/checkout/return', '/images/ageless/hero-couple.webp', '/_next/image?url=%2Fshop']) {
    const res = await expect(path, 307); assert.equal(new URL(res.headers.get('location')).pathname, '/zugang'); checks++;
  }
  for (const path of ['/zugang', '/admin', '/api/admin', '/rechtliches/impressum', '/rechtliches/datenschutz', '/ageless-logo.svg', '/_next/static/app.js', '/robots.txt', '/sitemap.xml']) await expect(path, 200);
  const denied = await expect('/api/checkout/create', 403);
  assert.equal(denied.headers.get('cache-control'), 'private, no-store'); checks++;
  user = { id: 'tester', email: 'tester@example.com', email_confirmed_at: null };
  access = { status: 'approved', email: user.email }; await expect('/shop', 307);
  user.email_confirmed_at = 'confirmed'; access.status = 'pending'; await expect('/shop', 307);
  access.status = 'rejected'; await expect('/shop', 307);
  access.status = 'approved'; access.email = 'other@example.com'; await expect('/shop', 307);
  access.email = user.email; await expect('/shop', 200);
  authError = new Error('revoked session'); await expect('/shop', 307); authError = null;
  dbError = new Error('unavailable'); await expect('/shop', 307); dbError = null;
  access.status = 'rejected'; user.email = 'OWNER@example.com'; await expect('/shop', 200);
  refreshed = true; const allowed = await expect('/shop', 200);
  assert.equal(allowed.cookies.get('refreshed-session').value, 'new'); checks++;
  mode = 'live'; await expect('/api/checkout/create', 403);
  mode = 'draft'; await expect('/api/checkout/capture', 403);
  mode = 'sandbox'; await expect('/api/checkout/create', 200);
  delete env.SUPABASE_SERVICE_ROLE_KEY; await expect('/shop', 307); await expect('/api/checkout/create', 503);
  env.AGELESS_SITE_ACCESS = 'public'; await expect('/shop', 200);
  console.log(`${checks} access checks passed (mocked Auth and DB; not a live login).`);
})().catch(error => { console.error(error); process.exitCode = 1; });
