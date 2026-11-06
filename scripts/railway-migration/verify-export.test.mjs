import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { inspect, sameInventory } from './verify-export.mjs';

const required = ['ageless_offers', 'ageless_legal_pages', 'ageless_orders',
'ageless_store_settings', 'ageless_admin_access_requests', 'ageless_tester_access'];
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'ageless-preflight-'));
  const files = [];
  function write(path, body, records) {
    const out = join(root, path);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, body);
    files.push({ path, sha256: createHash('sha256').update(body).digest('hex'),
      ...(records === undefined ? {} : { records }) });
  }
  for (const t of required) write('tables/' + t + '.jsonl', '{"id":"example"}\n', 1);
  write('auth/users.jsonl', '{"id":"example"}\n', 1);
  write('schema.sql', '-- schema\n');
  write('roles-and-policies.json', '{}');
  write('assets/one.png', Buffer.from([137,80,78,71]));
  writeFileSync(join(root, 'manifest.json'), JSON.stringify({ format:'ageless-export-v1', files }));
  return root;
}
test('verifies source files and equal target', async t => {
  const a=fixture(), b=fixture();
  t.after(()=>{rmSync(a,{recursive:true,force:true});rmSync(b,{recursive:true,force:true});});
  assert.equal(sameInventory(await inspect(a),await inspect(b)),true);
});
test('detects tampered table data even when count matches', async t => {
  const a=fixture();t.after(()=>rmSync(a,{recursive:true,force:true}));
  writeFileSync(join(a,'tables/ageless_offers.jsonl'),'{"id":"tampered"}\n');
  await assert.rejects(()=>inspect(a),/SHA-256 mismatch/);
});
test('detects missing required table', async t => {
  const a=fixture();t.after(()=>rmSync(a,{recursive:true,force:true}));
  const p=join(a,'manifest.json'), m=JSON.parse(readFileSync(p,'utf8'));
  m.files=m.files.filter(f=>!f.path.includes('ageless_orders'));
  writeFileSync(p,JSON.stringify(m));
  await assert.rejects(()=>inspect(a),/Required data table missing/);
});
test('rejects traversal and symlink escapes', async t => {
  const a=fixture();t.after(()=>rmSync(a,{recursive:true,force:true}));
  const p=join(a,'manifest.json'), m=JSON.parse(readFileSync(p,'utf8'));
  m.files[0].path='../bad';
  writeFileSync(p,JSON.stringify(m));
  await assert.rejects(()=>inspect(a),/Unsafe file path/);
});
test('detects mismatched target inventory', async t => {
  const a=fixture(),b=fixture();t.after(()=>{rmSync(a,{recursive:true,force:true});rmSync(b,{recursive:true,force:true});});
  const p=join(b,'assets/one.png');writeFileSync(p,Buffer.from([10,20,30]));
  const mpath=join(b,'manifest.json');const m=JSON.parse(readFileSync(mpath,'utf8'));
  m.files.find(x=>x.path==='assets/one.png').sha256=createHash('sha256').update(Buffer.from([10,20,30])).digest('hex');
  writeFileSync(mpath,JSON.stringify(m));
  assert.equal(sameInventory(await inspect(a),await inspect(b)),false);
});
