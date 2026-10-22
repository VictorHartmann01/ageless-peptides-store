import test from 'node:test';
import assert from 'node:assert/strict';
import { validEvidence } from '../lib/commerce/approval.ts';

const good = { country: 'DE', intended_use: 'Kosmetik zur äußeren Anwendung', valid_from: '2026-01-01', valid_until: '', evidence_url: 'https://example.org/legal-proof', restrictions: '', status: 'verified' };
const now = new Date('2026-10-14T12:00:00Z');

test('requires verified evidence for each delivery country', () => {
  assert.equal(validEvidence([good], ['DE'], now), true);
  assert.equal(validEvidence([good], ['DE', 'AT'], now), false);
  assert.equal(validEvidence([{ ...good, status: 'pending' }], ['DE'], now), false);
  assert.equal(validEvidence([{ ...good, status: 'blocked' }], ['DE'], now), false);
});
test('rejects expired, future-dated, malformed and duplicated proofs', () => {
  assert.equal(validEvidence([{ ...good, valid_until: '2026-10-13' }], ['DE'], now), false);
  assert.equal(validEvidence([{ ...good, valid_from: '2026-10-15' }], ['DE'], now), false);
  assert.equal(validEvidence([{ ...good, evidence_url: 'http://example.org' }], ['DE'], now), false);
  assert.equal(validEvidence([good, good], ['DE'], now), false);
  assert.equal(validEvidence([], ['DE'], now), false);
});
