// AgeLess live smoke test. Run: node scripts/smoke-test.mjs
// Optional: AGELESS_BASE_URL=https://www.ageless-peptides.store node scripts/smoke-test.mjs
const base = (process.env.AGELESS_BASE_URL || 'https://www.ageless-peptides.store').replace(/\/$/, '');
const paths = ['/', '/shop', '/robots.txt', '/sitemap.xml', '/icon.svg'];
let failures = 0;
for (const path of paths) {
  try {
    const response = await fetch(base + path, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
    const body = await response.text();
    const contentType = response.headers.get('content-type') || '';
    let ok = response.status === 200 && body.length > 0;
    if (path === '/') ok &&= body.includes('AgeLess');
    if (path === '/shop') ok &&= body.includes('AgeLess') && (body.includes('PRODUKT') || body.includes('Produkt'));
    if (path === '/robots.txt') ok &&= body.includes('User-agent') && body.includes('Sitemap:');
    if (path === '/sitemap.xml') ok &&= body.includes('<urlset') && body.includes('/shop');
    if (path === '/icon.svg') ok &&= contentType.includes('svg') && body.includes('<svg');
    console.log((ok ? 'PASS' : 'FAIL') + ' ' + path + ' HTTP ' + response.status + ' ' + contentType);
    if (!ok) failures++;
  } catch (error) {
    console.error('FAIL ' + path + ' ' + error.message);
    failures++;
  }
}
if (failures) {
  console.error(failures + ' smoke check(s) failed');
  process.exitCode = 1;
} else {
  console.log('PASS all public route smoke checks. This does NOT verify ordering or payment.');
}
