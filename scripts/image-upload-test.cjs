const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { NextRequest, NextResponse } = require('next/server');
const { webcrypto } = require('node:crypto');
const id = '11111111-1111-4111-8111-111111111111';
const owner = { id, email: 'owner@example.com', email_confirmed_at: 'yes' };
let user = owner, staff = null, authError = null, lookupError = null, offer = { id }, uploadError = null;
let uploads = [], updates = 0, checks = 0;
const env = { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test', AGELESS_OWNER_EMAILS: owner.email };
const db = { from(table) { const q = { select: () => q, eq: () => q, update() { updates++; return q; }, maybeSingle: async () => ({ data: table === 'ageless_offers' ? offer : staff, error: lookupError }) }; return q; }, storage: { from(bucket) { return { upload: async (path, bytes, options) => { uploads.push({ bucket, path, bytes, options }); return { error: uploadError }; }, getPublicUrl: path => ({ data: { publicUrl: 'https://example.supabase.co/storage/v1/object/public/ageless-product-images/' + path } }) }; } } };
const out = {};
const js = ts.transpileModule(fs.readFileSync('app/api/admin/image-upload/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
vm.runInNewContext(js, { exports: out, process: { env }, File, Uint8Array, crypto: webcrypto, require(name) {
  if (name === 'next/server') return { NextResponse };
  if (name === '@supabase/supabase-js') return { createClient: () => ({ auth: { getUser: async () => ({ data: { user }, error: authError }) } }) };
  if (name === '../../../../lib/commerce/server') return { getAdminClient: () => db };
  return require(name);
} });
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jH3sAAAAASUVORK5CYII=', 'base64');
function request({ token = 'test', product = id, bytes = png, type = 'image/png', missing = false } = {}) {
  const body = new FormData(); body.set('offer_id', product);
  if (!missing) body.set('image', new File([bytes], 'untrusted-name.png', { type }));
  return new NextRequest('https://example.test/api/admin/image-upload', { method: 'POST', headers: token ? { Authorization: 'Bearer ' + token } : {}, body });
}
async function expect(name, options, status) { const before = uploads.length; const res = await out.POST(request(options)); assert.equal(res.status, status, name); if (status !== 200) assert.equal(uploads.length, before, name + ': no storage write'); assert.equal(res.headers.get('cache-control'), 'no-store'); checks++; return res; }
(async () => {
  await expect('anonymous', { token: '' }, 401);
  user = null; await expect('invalid session', {}, 401);
  user = { ...owner, email_confirmed_at: null }; await expect('unconfirmed account', {}, 401);
  user = { ...owner, email: 'staff@example.com' };
  for (const status of ['pending', 'rejected']) { staff = { email: user.email, status }; await expect(status + ' staff', {}, 403); }
  staff = { email: 'someoneelse@example.com', status: 'approved' }; await expect('mismatched staff identity', {}, 403);
  staff = { email: user.email, status: 'approved' }; await expect('approved staff upload', {}, 200);
  user = owner; staff = null;
  await expect('invalid product id', { product: '../escape' }, 400);
  await expect('missing file', { missing: true }, 400);
  await expect('empty image', { bytes: new Uint8Array() }, 400);
  await expect('oversized image', { bytes: new Uint8Array(5 * 1024 * 1024 + 1) }, 400);
  await expect('SVG rejected', { type: 'image/svg+xml', bytes: Buffer.from('<svg/>') }, 400);
  await expect('disguised content rejected', { bytes: Buffer.from('<script>bad</script>') }, 400);
  offer = null; await expect('unknown product', {}, 404); offer = { id };
  lookupError = {}; await expect('database error', {}, 404); lookupError = null;
  uploadError = {}; const failed = await out.POST(request()); assert.equal(failed.status, 500); checks++; uploadError = null;
  const res = await expect('owner upload', {}, 200); const body = await res.json();
  assert.match(body.url, /ageless-product-images\/[0-9a-f-]+\/[0-9a-f-]+\.png$/);
  const last = uploads.at(-1); assert.equal(last.bucket, 'ageless-product-images'); assert.equal(last.options.upsert, false); assert.equal(last.options.contentType, 'image/png'); assert.deepEqual(Buffer.from(last.bytes), png); assert.equal(updates, 0, 'upload never changes product data or approval'); checks += 6;
  console.log(`${checks} image upload checks passed (mocked Auth, DB and Storage; no hosted upload).`);
})().catch(error => { console.error(error); process.exitCode = 1; });
