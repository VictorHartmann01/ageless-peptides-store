// AgeLess production-readiness smoke test (safe: no payment is initiated).
// Usage: AGELESS_BASE_URL=https://www.ageless-peptides.store node scripts/smoke-test.mjs
const base = (process.env.AGELESS_BASE_URL || 'https://www.ageless-peptides.store').replace(/\/$/, '');
const paths = [
  '/', '/shop', '/shop/angebote', '/shop/warenkorb', '/shop/checkout',
  '/robots.txt', '/sitemap.xml', '/icon.svg',
];
let failures = 0;
for (const path of paths) {
  try {
    const response = await fetch(base + path, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
    const body = await response.text();
    const contentType = response.headers.get('content-type') || '';
    let ok = response.status === 200 && body.length > 0;
    if (path === '/') ok &&= body.includes('AgeLess');
    if (path === '/shop') ok &&= body.includes('AgeLess') && /PRODUKT|Produkt/.test(body);
    if (path === '/shop/angebote') ok &&= body.includes('AgeLess') && /Angebot|Produkt|Bestell/.test(body);
    if (path === '/shop/warenkorb') ok &&= body.includes('Warenkorb') && body.includes('AgeLess');
    if (path === '/shop/checkout') ok &&= body.includes('AgeLess') && /PayPal|Checkout|bestellen/.test(body);
    if (path === '/robots.txt') ok &&= body.includes('User-agent') && body.includes('Sitemap:');
    if (path === '/sitemap.xml') ok &&= body.includes('<urlset') && body.includes('/shop');
    if (path === '/icon.svg') ok &&= contentType.includes('svg') && body.includes('<svg');
    console.log((ok ? 'PASS' : 'FAIL') + ' ' + path + ' HTTP ' + response.status + ' ' + contentType);
    if (!ok) failures++;
  } catch (error) {
    console.error('FAIL ' + path + ' ' + (error instanceof Error ? error.message : String(error)));
    failures++;
  }
}
// Invalid cart must NEVER produce a PayPal approval URL, regardless of checkout release state.
try {
  const response = await fetch(base + '/api/checkout/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart: [], address: {} }),
    signal: AbortSignal.timeout(15000),
  });
  const result = await response.json().catch(() => ({}));
  const ok = [400, 503].includes(response.status) && !result.approvalUrl;
  console.log((ok ? 'PASS' : 'FAIL') + ' checkout rejects invalid cart HTTP ' + response.status);
  if (!ok) failures++;
} catch (error) {
  console.error('FAIL checkout invalid-cart guard ' + (error instanceof Error ? error.message : String(error)));
  failures++;
}
if (failures) {
  console.error(failures + ' production smoke check(s) failed');
  process.exitCode = 1;
} else {
  console.log('PASS all public route and invalid-cart checks. Payment, product approval, order persistence and legal review require separate end-to-end verification.');
}
