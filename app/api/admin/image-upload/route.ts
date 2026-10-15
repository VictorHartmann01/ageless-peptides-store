import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAdminClient } from '../../../../lib/commerce/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const noStore = { 'Cache-Control': 'no-store' };
const fail = (error: string, status: number) => NextResponse.json({ error }, { status, headers: noStore });
const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const allowed = new Map([['image/png','png'], ['image/jpeg','jpg'], ['image/webp','webp']]);
const bucket = 'ageless-product-images';

export async function POST(req: NextRequest) {
  const bearer = req.headers.get('authorization');
  if (!bearer?.startsWith('Bearer ')) return fail('AUTH_REQUIRED',401);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return fail('SERVER_NOT_READY',503);
  const auth = createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:{user},error:authError} = await auth.auth.getUser(bearer.slice(7));
  if (authError || !user?.email || !user.email_confirmed_at) return fail('AUTH_REQUIRED',401);
  const email = user.email.toLowerCase();
  const owners = (process.env.AGELESS_OWNER_EMAILS || process.env.AGELESS_ADMIN_APPROVER_EMAIL || '')
    .split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
  try {
    const db = getAdminClient();
    if (!owners.includes(email)) {
      const {data:staff,error} = await db.from('ageless_admin_access_requests')
        .select('email,status').eq('user_id',user.id).maybeSingle();
      if (error || staff?.status !== 'approved' || staff.email?.toLowerCase() !== email) return fail('ADMIN_REQUIRED',403);
    }
    const form = await req.formData();
    const id = form.get('offer_id');
    const file = form.get('image');
    if (typeof id !== 'string' || !idPattern.test(id)) return fail('INVALID_PRODUCT',400);
    if (!(file instanceof File)) return fail('IMAGE_REQUIRED',400);
    const ext = allowed.get(file.type);
    if (!ext || file.size < 1 || file.size > 5 * 1024 * 1024) return fail('INVALID_IMAGE',400);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const png = ext === 'png' && bytes.length > 8 && bytes.slice(0,8).every((v,i)=>v===[137,80,78,71,13,10,26,10][i]);
    const jpg = ext === 'jpg' && bytes[0]===255 && bytes[1]===216 && bytes[2]===255;
    const webp = ext === 'webp' && String.fromCharCode(...bytes.slice(0,4))==='RIFF' && String.fromCharCode(...bytes.slice(8,12))==='WEBP';
    if (!png && !jpg && !webp) return fail('INVALID_IMAGE_CONTENT',400);
    const {data:offer,error:lookupError} = await db.from('ageless_offers').select('id').eq('id',id).maybeSingle();
    if (lookupError || !offer) return fail('PRODUCT_NOT_FOUND',404);
    const path = id+'/'+crypto.randomUUID()+'.'+ext;
    const {error:uploadError} = await db.storage.from(bucket).upload(path,bytes,{contentType:file.type,upsert:false,cacheControl:'3600'});
    if (uploadError) return fail('UPLOAD_FAILED',500);
    const {data:publicData} = db.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({url:publicData.publicUrl},{headers:noStore});
  } catch { return fail('UPLOAD_FAILED',503); }
}
