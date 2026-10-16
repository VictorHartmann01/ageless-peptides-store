const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
const {NextRequest}=require('next/server');
function load(file,mocks){
 const exports={};
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 vm.runInNewContext(code,{exports,require:n=>mocks[n]||require(n),process,console,URL,URLSearchParams,Date});
 return exports;
}
function setup({status='pending',email='tester@example.com',confirmed=true,authError=false,dbError=false,mode='sandbox',owner=false}={}){
 process.env.NEXT_PUBLIC_SUPABASE_URL='https://example.supabase.co';
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='test-only';
 process.env.SUPABASE_SERVICE_ROLE_KEY='test-only';
 process.env.AGELESS_OWNER_EMAILS=owner?email:'owner@example.com';
 const user={id:'test-user',email,email_confirmed_at:confirmed?'2026-10-16':null};
 const db={from(table){const q={select(){return q},eq(){return q},order(){return q},insert(){return q},update(){return q},then(resolve){resolve({data:null,error:null})},async maybeSingle(){return {data:status===null?null:{status,email:status==='wrong-email'?'other@example.com':email},error:dbError?{}:null}},async single(){return {data:{mode},error:dbError?{}:null}}};return q}};
 const auth={auth:{async getUser(){return {data:{user},error:authError?{}:null}}}};
 const mocks={'@supabase/ssr':{createServerClient:()=>auth},'@supabase/supabase-js':{createClient:()=>db}};
 return {proxy:load('proxy.ts',mocks).proxy,api:load('app/api/customer-access/route.ts',{'@supabase/supabase-js':{createClient:()=>auth},'../../../lib/commerce/server':{getAdminClient:()=>db}})};
}
const req=(path)=>new NextRequest('https://ageless.example'+path);
for(const path of ['/','/zugang','/login','/rechtliches/impressum','/rechtliches/datenschutz','/ageless-logo.svg','/images/ageless/hero-couple.webp','/_next/static/chunks/test.js'])test('public '+path,async()=>{const {proxy}=setup();assert.equal((await proxy(req(path))).headers.get('x-middleware-next'),'1')});
for(const status of ['pending','rejected',null,'wrong-email'])test('deny tester '+status,async()=>{const {proxy}=setup({status});const r=await proxy(req('/shop'));assert.equal(r.status,307);assert.equal(r.headers.get('location'),'https://ageless.example/zugang');assert.match(r.headers.get('cache-control'),/no-store/)});
for(const options of [{confirmed:false},{authError:true},{dbError:true}])test('fail closed '+JSON.stringify(options),async()=>{const {proxy}=setup({status:'approved',...options});assert.equal((await proxy(req('/shop'))).status,307)});
test('approved tester allowed',async()=>{const {proxy}=setup({status:'approved'});assert.equal((await proxy(req('/shop'))).headers.get('x-middleware-next'),'1')});
test('public flag cannot bypass approvals',async()=>{process.env.AGELESS_SITE_ACCESS='public';const {proxy}=setup();assert.equal((await proxy(req('/shop'))).status,307);delete process.env.AGELESS_SITE_ACCESS});
test('protected API denies anonymous',async()=>{const {proxy}=setup({authError:true});assert.equal((await proxy(req('/api/checkout/create'))).status,403)});
test('prefix cannot bypass access API',async()=>{const {proxy}=setup();assert.equal((await proxy(req('/api/customer-access-evil'))).status,403)});
for(const mode of ['live','draft','sandbox'])test('checkout mode '+mode,async()=>{const {proxy}=setup({status:'approved',mode});assert.equal((await proxy(req('/api/checkout/create'))).status,mode==='sandbox'?200:403)});
test('admin approval does not confer tester role',async()=>{const {proxy}=setup();assert.equal((await proxy(req('/shop'))).status,307)});
test('nonowner cannot approve tester',async()=>{const {api}=setup({status:'approved'});const r=await api.POST(new NextRequest('https://ageless.example/api/customer-access',{method:'POST',headers:{authorization:'Bearer test','content-type':'application/json'},body:JSON.stringify({action:'decide',user_id:'other',status:'approved'})}));assert.equal(r.status,403);assert.equal((await r.json()).error,'OWNER_REQUIRED')});
test('unconfirmed account cannot request access',async()=>{const {api}=setup({confirmed:false});const r=await api.GET(new NextRequest('https://ageless.example/api/customer-access',{headers:{authorization:'Bearer test'}}));assert.equal(r.status,401)});
test('legacy login preserves recovery query',async()=>{const {default:page}=load('app/login/page.tsx',{'next/navigation':{redirect(url){throw new Error(url)}}});await assert.rejects(()=>page({searchParams:Promise.resolve({code:'abc',reset:'1'})}),/\/zugang\?code=abc&reset=1/)});
