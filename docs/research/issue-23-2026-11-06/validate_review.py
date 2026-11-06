"""Offline integrity check; does not test product safety, lawfulness or a live shop."""
import json,re,hashlib
from pathlib import Path
base=Path(__file__).resolve().parent
review=json.loads((base/'historical-review.json').read_text())
sources=json.loads((base/'sources.json').read_text())
source=next((p/q for p in base.parents for q in ['data/ageless-product-intake-2026-10-11.json','input/data/ageless-product-intake-2026-10-11.json'] if (p/q).is_file()),None)
if source is None: raise SystemExit('Original intake file required; run from the repository checkout.')
original=json.loads(source.read_text())
rows=review['rows'];lookup={r['legacy_id']:r for r in rows};ids={s['id'] for s in sources}
checks=[]
def check(name,result):
 checks.append({'check':name,'passed':bool(result)})
check('47 unique historical records',len(rows)==47 and len(lookup)==47)
check('Exact legacy ID set preserved',set(lookup)=={p['id'] for p in original['products']})
check('Original names and variants preserved',all((lookup[p['id']]['name_as_recorded'],lookup[p['id']]['variant_as_recorded'])==(p['name'],p['variant']) for p in original['products']))
check('No current SKU IDs invented',all(r['current_sku_id'] is None for r in rows))
check('Historical scope and unresolved exclusion retained',not review['current_catalog_verified'] and review['excluded_product_ids'] is None and all(r['scope']=='HISTORICAL_AUDIT_ONLY' for r in rows))
check('No release or listing readiness invented',review['release_recommendations']==0 and all(r['public_listing_ready'] is False and r['assessment']=='Gezielte Ergänzung erforderlich' for r in rows))
check('Every source ID resolves',all(set(r['source_ids'])<=ids and r['source_ids'] for r in rows))
check('Every record has review date purpose gap text owner',all(all(r.get(k) for k in ['reviewed_at','intended_use','missing_evidence','internal_product_text','next_action_owner','publication_recommendation']) for r in rows))
check('11 confirmed vial forms kept distinct',sum('Vial laut' in r['form'] for r in rows)==11)
check('GHK and NAD strength variants not merged',[(lookup[k]['name_as_recorded'],lookup[k]['variant_as_recorded']) for k in ['AGL-001','AGL-041','AGL-002','AGL-042']]==[('GHK-Cu','100 mg'),('GHK-Cu','50 mg'),('NAD+','500 mg'),('NAD+','10 mg')])
check('Source dates URLs approval boundaries present',all(s['retrieved_at']=='2026-11-06' and s['url'].startswith('https://') and s['sku_approval'] is False and s['access'] and s['supports'] for s in sources))
check('Human-readable matrix contains all IDs exactly once',re.findall(r'^\| (AGL-\d{3}) ',(base/'MATRIX.md').read_text(),re.M)==[r['legacy_id'] for r in rows])
result={'date':'2026-11-06','scope':'Offline document/data integrity only; not legal approval, source identity verification, deployment or live QA','passed':all(c['passed'] for c in checks),'checks':checks,'rows':len(rows),'source_count':len(sources)}
(base/'VALIDATION.json').write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
print(json.dumps(result,ensure_ascii=False))
raise SystemExit(0 if result['passed'] else 1)
