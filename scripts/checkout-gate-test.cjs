const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
function read(path,mocks){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:n=>mocks[n]||require(n),process,Date,console,Buffer,fetch:()=>{throw Error('Unexpected network access');}});return exports;}
const id='11111111-1111-4111-8111-111111111111';
let calls=0, mode='live';
const order={id,status:'payment_created',paypal_order_id:'TESTPAYPAL12345',payment_mode:'live'};
const db={from(table){const q={select(){return q},eq(){return q},single:async()=>({data:{mode},error:null}),maybeSingle:async()=>({data:order,error:null})};return q;}};
const mocks={'next/server':{NextResponse:{json:(body,opts)=>({body,status:opts?.status||200})}},'../../../../lib/commerce/server':{getAdminClient:()=>db,priceCart:()=>{throw Error('Pricing must not run before gate')},paypalRequest:()=>{calls++;throw Error('PayPal must not run')}}};
const create=read('app/api/checkout/create/route.ts',mocks),capture=read('app/api/checkout/capture/route.ts',mocks);
const req={headers:{get:()=> 'application/json'},json:async()=>({orderId:id,paypalOrderId:order.paypal_order_id})};
(async()=>{
 delete process.env.AGELESS_LIVE_RELEASE_APPROVED; process.env.AGELESS_CHECKOUT_ENABLED='true';
 assert.equal((await create.POST(req)).body.error,'LIVE_RELEASE_NOT_APPROVED');
 assert.equal((await capture.POST(req)).body.error,'LIVE_RELEASE_NOT_APPROVED');
 process.env.AGELESS_CHECKOUT_ENABLED='false';
 assert.equal((await capture.POST(req)).body.error,'CHECKOUT_NOT_RELEASED');
 assert.equal((await create.POST(req)).body.error,'CHECKOUT_NOT_RELEASED');
 process.env.AGELESS_CHECKOUT_ENABLED='true'; mode='draft';
 assert.equal((await capture.POST(req)).body.error,'CHECKOUT_NOT_RELEASED');
 const server=read('lib/commerce/server.ts',{'server-only':{},'@supabase/supabase-js':{},'./approval':{}});
 await assert.rejects(server.paypalRequest('/v2/checkout/orders','POST',{},'test','live'),/LIVE_RELEASE_NOT_APPROVED/);
 assert.equal(calls,0); console.log('7 checkout gate checks passed (mocked; zero payment/network calls).');
})().catch(e=>{console.error(e);process.exitCode=1});
