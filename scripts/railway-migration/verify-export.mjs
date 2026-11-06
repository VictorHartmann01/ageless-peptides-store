#!/usr/bin/env node
/**
 * Offline, read-only verification of source and destination data exports.
 * Never prints database rows, email addresses, credentials, object contents.
 * Usage: node scripts/railway-migration/verify-export.mjs SOURCE_DIR [DESTINATION_DIR]
 * Each directory must contain manifest.json and the files it describes.
 */
import { createReadStream, existsSync, lstatSync, readFileSync, realpathSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname, sep } from 'node:path';
import { createInterface } from 'node:readline';
import { once } from 'node:events';

const mandatory = ['ageless_offers', 'ageless_legal_pages', 'ageless_orders',
  'ageless_store_settings', 'ageless_admin_access_requests', 'ageless_tester_access'];

function ensureFile(base, path) {
  if (typeof path !== 'string' || path.startsWith('/') || path.includes('\\') ||
      path.split('/').some(p => !p || p === '.' || p === '..')) throw new Error('Unsafe file path');
  const dest = resolve(base, path);
  if (!dest.startsWith(realpathSync(base) + sep)) throw new Error('File escaped export directory');
  let item = base;
  for (const part of path.split('/')) {
    item = resolve(item, part);
    if (!existsSync(item) || lstatSync(item).isSymbolicLink()) throw new Error('Missing file or symlink');
  }
  if (!lstatSync(dest).isFile()) throw new Error('Not a regular file');
  return dest;
}
async function checksum(file) {
  const hash = createHash('sha256');
  const stream = createReadStream(file);
  stream.on('data', chunk => hash.update(chunk));
  await once(stream, 'end');
  return hash.digest('hex');
}
async function lineCount(file) {
  const lines = createInterface({ input: createReadStream(file), crlfDelay: Infinity });
  let count = 0;
  for await (const line of lines) {
    if (!line.trim()) throw new Error('Empty JSONL line');
    JSON.parse(line);
    count++;
  }
  return count;
}
export async function inspect(dir) {
  const base = realpathSync(resolve(dir));
  const manifestPath = ensureFile(base, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.format !== 'ageless-export-v1' ||
      !Array.isArray(manifest.files) || !manifest.files.length) throw new Error('Invalid manifest format');
  const names = new Set();
  const evidence = new Map();
  for (const entry of manifest.files) {
    if (!entry || !/^[a-f0-9]{64}$/.test(entry.sha256) || names.has(entry.path)) throw new Error('Duplicate or invalid manifest entry');
    names.add(entry.path);
    const file = ensureFile(base, entry.path);
    if (await checksum(file) !== entry.sha256) throw new Error('SHA-256 mismatch: ' + entry.path);
    if (entry.path.startsWith('tables/') || entry.path.startsWith('auth/')) {
      if (!entry.path.endsWith('.jsonl') || !Number.isSafeInteger(entry.records) || entry.records < 0)
        throw new Error('Missing JSONL record count');
      if (await lineCount(file) !== entry.records) throw new Error('Record count mismatch: ' + entry.path);
    }
    evidence.set(entry.path, { sha256: entry.sha256, records: entry.records ?? null });
  }
  for (const table of mandatory) if (!names.has('tables/' + table + '.jsonl'))
    throw new Error('Required data table missing: ' + table);
  if (!names.has('auth/users.jsonl')) throw new Error('Auth user inventory missing');
  if (!names.has('schema.sql')) throw new Error('Source SQL schema missing');
  if (!names.has('roles-and-policies.json')) throw new Error('Role/RLS inventory missing');
  return evidence;
}
export function sameInventory(source, dest) {
  if (source.size !== dest.size) return false;
  for (const [path, entry] of source) {
    const other = dest.get(path);
    if (!other || other.sha256 !== entry.sha256 || other.records !== entry.records) return false;
  }
  return true;
}
if (process.argv[1] && import.meta.url === new URL('file://' + resolve(process.argv[1])).href) {
  try {
    const src = await inspect(process.argv[2]);
    if (process.argv[3]) {
      const dst = await inspect(process.argv[3]);
      if (!sameInventory(src, dst)) throw new Error('Source and target snapshots differ');
    }
    console.log('PASS: verified export files, hashes, record counts, mandatory tables and auth inventory. Files: ' + src.size);
  } catch (error) {
    console.error('FAIL: ' + (error instanceof Error ? error.message : 'Unknown error'));
    process.exitCode = 1;
  }
}
