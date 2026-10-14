const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function moduleAt(path, mocks = {}) {
  const exports = {};
  const js = ts.transpileModule(fs.readFileSync(path,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(js, {exports,require: name => mocks[name] || require(name),process,Date,console,Buffer,fetch});
  return exports;
}
const approval = moduleAt('lib/commerce/approval.ts');
const catalog = moduleAt('lib/commerce/catalog.ts', {'./approval':approval});
const row = {country:'DE',intended_use:'Dokumentierter Verwendungszweck',valid_from:'2026-01-01',valid_until:'2026-12-31',evidence_url:'https://authority.example/document',restrictions:'',status:'verified'};
const now = new Date('2026-10-11T12:00:00Z');
let checks = 0;
function check(name, actual, expected) {assert.equal(actual, expected, name); checks++;}
check('current country proof', approval.validEvidence([row],['DE'],now),true);
for (const [name, patch] of [['pending',{status:'pending'}],['blocked',{status:'blocked'}],['expired',{valid_until:'2026-10-10'}],['future',{valid_from:'2026-11-01'}],['invalid calendar',{valid_from:'2026-02-30'}],['no document',{evidence_url:''}],['no use',{intended_use:''}],['insecure source',{evidence_url:'http://example.com'}]]) check(name,approval.validEvidence([{...row,...patch}],['DE'],now),false);
check('uncovered country',approval.validEvidence([row],['DE','AT'],now),false);
check('contradictory duplicate country',approval.validEvidence([row,{...row,status:'blocked'}],['DE'],now),false);
check('empty proof',approval.validEvidence([],['DE'],now),false);
check('malformed proof',approval.validEvidence([null],['DE'],now),false);
check('expiry day inclusive',approval.validEvidence([{...row,valid_until:'2026-10-11'}],['DE'],now),true);
process.env.NEXT_PUBLIC_SUPABASE_URL='https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='test';
process.env.AGELESS_OWNER_EMAILS='owner@example.com';
let user = null, access = null, writes = [], concurrent = false;
const id = '11111111-1111-4111-8111-111111111111';
const offer = {id,compliance_status:'approved',on_hold:false,hold_reason:null,name:'Product',description:'',approval_reference:'Review',manual_approved:true,is_published:true,approved_by:'owner@example.com',legal_evidence:[row],allowed_countries:['DE'],updated_at:'version1',reviewed_at:'2026-10-01',stock_quantity:2,price_cents:1000,shipping_cents:0};
const db = {from(table) {
  let update = null;
  const q = {select(){return q;},eq(){return q;},order(){return q;},limit(){return q;},update(v){update=v;writes.push({table,value:v});return q;},upsert(v){writes.push({table,value:v});return q;},
    single:async()=>({data:table==='ageless_offers' ? offer : {user_id:id},error:concurrent&&update ? {}:null}),
    maybeSingle:async()=>({data:access,error:null}),
    then(resolve,reject){return Promise.resolve({data:table==='ageless_offers'?[offer]:[],error:null}).then(resolve,reject);}};
  return q;
}};
const route=moduleAt('app/api/admin/route.ts',{'next/server':{NextResponse:{json:(body,opts)=>({body,status:opts?.status||200})}},'@supabase/supabase-js':{createClient:()=>({auth:{getUser:async()=>({data:{user},error:null})}})},'../../../lib/commerce/server':{getAdminClient:()=>db},'../../../lib/commerce/approval':approval});
const req = payload => ({headers:{get:name=>name==='authorization'?'Bearer test':'application/json'},json:async()=>payload});
async function run() {
  check('anonymous denied',(await route.POST(req({action:'access'}))).status,403);
  user={id:'22222222-2222-4222-8222-222222222222',email:'staff@example.com',email_confirmed_at:'yes'};
  check('pending denied',(await route.GET(req({}))).status,403);
  check('pending request recorded',writes.at(-1).value.status,'pending');
  access={status:'approved',email:user.email};
  check('staff cannot approve users',(await route.POST(req({action:'access',user_id:id,status:'approved'}))).status,403);
  check('staff cannot activate checkout',(await route.POST(req({action:'mode',mode:'live'}))).status,403);
  check('staff cannot publish catalogue',(await route.POST(req({action:'offer',...offer,allowed_countries:'DE',image_url:'',catalog_visible:true}))).status,403);
  const payload={action:'offer',...offer,allowed_countries:'DE',image_url:'',stock_quantity:0};
  check('approved staff may set stock zero',(await route.POST(req(payload))).status,200);
  check('stale stock update rejected',(await route.POST(req({...payload,updated_at:'old'}))).status,409);
  concurrent=true;
  check('concurrent stock update rejected',(await route.POST(req(payload))).status,409);
  concurrent=false;
  user={...user,email:'owner@example.com'};
  check('owner rejects missing country evidence',(await route.POST(req({...payload,allowed_countries:'DE,AT'}))).status,409);
  check('owner rejects pending evidence',(await route.POST(req({...payload,legal_evidence:[{...row,status:'pending'}]}))).status,409);
  check('hold needs a reason',(await route.POST(req({...payload,on_hold:true}))).status,400);
  check('owner can hold product',(await route.POST(req({...payload,on_hold:true,hold_reason:'Herstellerprüfung pausiert'}))).status,200);
  check('hold revokes approval',writes.at(-1).value.manual_approved,false);
  check('hold unpublishes',writes.at(-1).value.is_published,false);
  check('owner can approve requested user',(await route.POST(req({action:'access',user_id:id,status:'approved'}))).status,200);
  check('owner cannot self-approve',(await route.POST(req({action:'access',user_id:user.id,status:'approved'}))).status,400);
  check('unknown price cannot be approved',(await route.POST(req({...payload,price_cents:null}))).status,400);
  check('unknown stock cannot be approved',(await route.POST(req({...payload,stock_quantity:null}))).status,400);
  check('unknown draft values stay editable',(await route.POST(req({...payload,price_cents:null,stock_quantity:null,manual_approved:false,is_published:false}))).status,200);
  check('unknown draft price stays null',writes.at(-1).value.price_cents,null);
  check('unknown draft stock stays null',writes.at(-1).value.stock_quantity,null);
  check('visible unapproved product blocks ordering',catalog.catalogBlockReason({...offer,manual_approved:false},true),'Dieses Produkt ist noch nicht vom Betreiber für den Verkauf freigegeben.');
  check('hold blocks ordering',catalog.catalogBlockReason({...offer,on_hold:true},true),'Der Verkauf dieses Produkts ist vorübergehend pausiert.');
  check('missing proof blocks ordering',catalog.catalogBlockReason({...offer,legal_evidence:[]},true),'Die Rechtsprüfung für dieses Produkt ist offen oder die Nachweise sind abgelaufen.');
  check('unknown price blocks ordering',catalog.catalogBlockReason({...offer,price_cents:null},true),'Für dieses Produkt ist noch kein Preis freigegeben.');
  check('unknown stock blocks ordering',catalog.catalogBlockReason({...offer,stock_quantity:null},true),'Dieses Produkt ist derzeit nicht bestellbar.');
  check('global switch blocks ordering',catalog.catalogBlockReason(offer,false),'Die Bestellfunktion ist derzeit noch nicht aktiviert.');
  check('ready offer may enter cart',catalog.catalogBlockReason(offer,true),undefined);
  console.log(`${checks} backoffice checks passed (mocked API; no live DB or payment).`);
}
run().catch(e=>{console.error(e);process.exitCode=1;});
