export type Evidence = { country: string; intended_use: string; valid_from: string; valid_until: string; evidence_url: string; restrictions: string; status: 'pending' | 'verified' | 'blocked' };
const date = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0,10) === s;
export function validEvidence(rows: unknown, countries: string[], now = new Date()): rows is Evidence[] {
  if (!Array.isArray(rows) || !rows.length || rows.length > 20 || !countries.length) return false;
  if (new Set(rows.map(r => r?.country)).size !== rows.length) return false;
  const today = now.toISOString().slice(0,10);
  return countries.every(country => rows.some((r: Evidence) => r && r.country === country && r.status === 'verified' && typeof r.intended_use === 'string' && r.intended_use.trim().length >= 3 && r.intended_use.length <= 500 && typeof r.restrictions === 'string' && r.restrictions.length <= 2000 && date(r.valid_from) && r.valid_from <= today && (!r.valid_until || (date(r.valid_until) && r.valid_until >= today && r.valid_until >= r.valid_from)) && typeof r.evidence_url === 'string' && r.evidence_url.length <= 2000 && /^https:\/\/[^\s]+$/.test(r.evidence_url)));
}
