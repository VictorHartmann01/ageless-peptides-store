const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const id = '11111111-1111-4111-8111-111111111111';
const offer = { id, name: 'Testprodukt', image_url: 'https://example.test/product.png', description: '', shipping_cents: 0, price_cents: 1000, stock_quantity: 2, allowed_countries: ['DE'], legal_evidence: [], manual_approved: true, is_published: true, on_hold: false, catalog_visible: true };
const proof = {country:'DE',intended_use:'Fertige Produktvariante',valid_from:'2026-01-01',valid_until:'2099-12-31',evidence_url:'https://example.test/proof',restrictions:'Nur äußerlich',status:'verified'};
const approval = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/commerce/approval.ts','utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:approval,Date,URL});
const dashboard = { owner: true, offers: [offer, { ...offer, id: 'second', name: 'Zweites Produkt' }], settings: { mode: 'sandbox' }, env: {}, pages: [], orders: [], accessRequests: [] };
let states, cursor, checks = 0;
const out = {};
const js = ts.transpileModule(fs.readFileSync('app/admin/page.tsx', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
vm.runInNewContext(js, { exports: out, process: { env: {} }, require(name) {
  if (name === 'react') return { ...React, useEffect() {}, useCallback: f => f, useState(initial) { const index = cursor++; if (!(index in states)) states[index] = initial; return [states[index], next => { states[index] = typeof next === 'function' ? next(states[index]) : next; }]; } };
  if (name === '../../lib/commerce/approval') return approval;
  return require(name);
} });
function render({ owner = true, held = false, offers = dashboard.offers, index = 0 } = {}) {
  states = ['', '', 'login', '', 'test', { ...dashboard, owner, offers: offers.map(o => ({ ...o, on_hold: held })) }, 'products', false, '', '', '', '', '', '', index]; cursor = 0;
  const nodes = []; function walk(node) { if (!node || typeof node !== 'object') return; if (Array.isArray(node)) return node.forEach(walk); nodes.push(node); walk(node.props?.children); } walk(out.default()); return nodes;
}
function label(node) { const child = node?.props?.children; return Array.isArray(child) ? child.map(x => typeof x === 'object' ? label(x) : x || '').join('') : typeof child === 'object' ? label(child) : child || ''; }
function button(nodes, text) { return nodes.find(n => n.type === 'button' && label(n).includes(text)); }
function check(value, message) { assert.ok(value, message); checks++; }
let nodes = render();
check(nodes.filter(n => n.type === 'input' && n.props.type === 'file').length === 1, 'one visible upload');
check(nodes.some(n => n.type === 'img' && n.props.src === offer.image_url), 'large product image');
check(button(nodes, 'Vorheriges').props.disabled, 'previous disabled at first product');
check(!button(nodes, 'Nächstes').props.disabled, 'next available');
check(nodes.find(n => n.type === 'select' && n.props['aria-label'] === 'Produkt auswählen').props.children.length === 2, 'product selector lists both');
button(nodes, 'Produkt pausieren').props.onClick();
check(states[5].offers[0].on_hold && !states[5].offers[0].manual_approved && !states[5].offers[0].is_published, 'hold clears both sale flags in draft');
nodes = render({ owner: false });
for (const text of ['Zum Verkauf freigeben', 'Nicht verkaufen', 'Im Katalog anzeigen', 'Produkt pausieren']) check(button(nodes, text).props.disabled, 'staff cannot change ' + text);
nodes = render({ held: true });
check(button(nodes, 'Zum Verkauf freigeben').props.disabled, 'held product cannot be approved');
nodes = render(); check(button(nodes,'Zum Verkauf freigeben').props.disabled,'missing proofs disable approval');
const ready = {...offer,legal_evidence:[proof],approval_reference:'Produktprüfung'};
nodes = render({offers:[ready]});
check(!button(nodes,'Zum Verkauf freigeben').props.disabled,'documented product enables owner decision');
check(nodes.some(n=>n.type==='a'&&n.props.href===proof.evidence_url&&n.props.rel==='noopener noreferrer'),'source is safely linked');
check(nodes.some(n=>n.type==='p'&&label(n).includes('Nur äußerlich')),'restrictions are visible');
button(nodes,'Nicht verkaufen').props.onClick(); check(!states[5].offers[0].manual_approved&&!states[5].offers[0].is_published,'negative decision clears both flags');
button(nodes,'Zum Verkauf freigeben').props.onClick(); check(states[5].offers[0].manual_approved&&states[5].offers[0].is_published,'positive decision prepares both flags');
for (const [name,patch] of [['expired',{valid_until:'2026-01-02'}],['future',{valid_from:'2099-01-01'}],['pending',{status:'pending'}],['blocked',{status:'blocked'}],['unsafe',{evidence_url:'javascript:alert(1)'}],['malformed',{evidence_url:'https://'}]]) {
 nodes=render({offers:[{...ready,legal_evidence:[{...proof,...patch}]}]});
 check(button(nodes,'Zum Verkauf freigeben').props.disabled,name+' disables decision');
 check(!nodes.some(n=>n.type==='strong'&&label(n).includes('Dokumentiert geprüft')),name+' is not labelled current');
 if(name==='unsafe'||name==='malformed') check(!nodes.some(n=>n.type==='a'&&n.props.href===patch.evidence_url),name+' not clickable');
}
for (const patch of [{allowed_countries:['DE','AT']},{approval_reference:''},{price_cents:null},{stock_quantity:null}]) { nodes=render({offers:[{...ready,...patch}]});check(button(nodes,'Zum Verkauf freigeben').props.disabled,'missing prerequisite disables decision'); }
nodes = render({ offers: [] }); check(!nodes.some(n => n.type === 'input' && n.props.type === 'file'), 'empty catalogue renders without editor');
nodes = render({ index: 1 }); check(button(nodes, 'Nächstes').props.disabled, 'next disabled at last product');
console.log(`${checks} editor checks passed (component tree and handlers; no browser visual or live session test).`);
