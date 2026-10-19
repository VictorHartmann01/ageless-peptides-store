export type Evidence = { country: string; intended_use: string; valid_from: string; valid_until: string; evidence_url: string; restrictions: string; status: 'pending' | 'verified' | 'blocked' };
const date = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0,10) === s;
export function safeEvidenceUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2000 || /[\s\\]/.test(value) || !value.startsWith('https://')) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !!url.hostname && !url.username && !url.password;
  } catch { return false; }
}
export function evidenceIssues(row: unknown, now = new Date()): string[] {
  if (!row || typeof row !== 'object') return ['Nachweis fehlt'];
  const r = row as Evidence;
  const issues: string[] = [];
  const today = now.toISOString().slice(0,10);
  if (r.status !== 'verified') issues.push(r.status === 'blocked' ? 'Verkauf gesperrt' : 'Prüfung offen');
  if (typeof r.country !== 'string' || !/^[A-Z]{2}$/.test(r.country)) issues.push('Verkaufsland fehlt oder ist ungültig');
  if (typeof r.intended_use !== 'string' || r.intended_use.trim().length < 3 || r.intended_use.length > 500) issues.push('Produktvariante / Verwendungszweck fehlt oder ist ungültig');
  if (typeof r.restrictions !== 'string' || r.restrictions.length > 2000) issues.push('Auflagen sind ungültig');
  if (typeof r.valid_from !== 'string' || !date(r.valid_from)) issues.push('Gültigkeitsbeginn fehlt oder ist ungültig');
  else if (r.valid_from > today) issues.push('Nachweis noch nicht gültig');
  if (typeof r.valid_until !== 'string' || (r.valid_until && (!date(r.valid_until) || r.valid_until < r.valid_from))) issues.push('Gültigkeitsende ist ungültig');
  else if (r.valid_until && r.valid_until < today) issues.push('Nachweis abgelaufen');
  if (!safeEvidenceUrl(r.evidence_url)) issues.push('Gültige HTTPS-Originalquelle fehlt');
  return issues;
}
export function validEvidence(rows: unknown, countries: string[], now = new Date()): rows is Evidence[] {
  if (!Array.isArray(rows) || !rows.length || rows.length > 20 || !Array.isArray(countries) || !countries.length || countries.length > 20 || countries.some(c => typeof c !== 'string' || !/^[A-Z]{2}$/.test(c)) || new Set(countries).size !== countries.length) return false;
  if (new Set(rows.map(r => r?.country)).size !== rows.length) return false;
  return countries.every(country => rows.some((r: Evidence) => r && r.country === country && evidenceIssues(r, now).length === 0));
}
