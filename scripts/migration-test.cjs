const {PGlite} = require('@electric-sql/pglite');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async()=>{
 const db = new PGlite();
 await db.exec(fs.readFileSync('supabase/tests/runtime-bootstrap.sql','utf8'));
 const files = fs.readdirSync('supabase/migrations').filter(f=>f.endsWith('.sql')).sort();
 assert.equal(new Set(files.map(f=>f.split('_')[0])).size,files.length,'unique versions');
 const backoffice=files.find(f=>f.endsWith('_ageless_backoffice.sql'));
 const sql=fs.readFileSync('supabase/migrations/'+backoffice,'utf8');
 await assert.rejects(db.exec(sql),/ageless_offers.*does not exist/);
 await db.exec('rollback');
 console.log('PASS backoffice alone rejected on empty schema');
 for(const f of files) {
  if(f===backoffice){
   await db.exec(`insert into ageless_offers(slug,name,price_cents,shipping_cents,manual_approved,is_published,compliance_status,reviewed_at,approval_reference) values ('legacy-fixture','Legacy fixture',1000,0,true,true,'approved',now(),'legacy')`);
   await assert.rejects(db.exec(sql),/EXISTING_APPROVALS_REQUIRE_BACKUP_AND_REVIEW/);
   await db.exec('rollback');
   const rows=await db.query(`select manual_approved,is_published from ageless_offers where slug='legacy-fixture'`);
   assert.equal(rows.rows[0].manual_approved,true); assert.equal(rows.rows[0].is_published,true);
   await db.exec(`delete from ageless_offers where slug='legacy-fixture'`);
   console.log('PASS existing approvals preserved on guarded rollback');
  }
  await db.exec(fs.readFileSync('supabase/migrations/'+f,'utf8')); console.log('APPLIED',f); }
 await db.exec(fs.readFileSync('supabase/tests/backoffice.sql','utf8'));
 await db.close();
 console.log('Isolated PostgreSQL migration and security tests passed. No remote DB used.');
})().catch(e=>{console.error(e);process.exitCode=1});
