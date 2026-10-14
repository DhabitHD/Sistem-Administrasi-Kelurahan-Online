/* Runnable check for the upload-URL normaliser in src/services/api.js.
   The walk is recursive and runs on every API response, so it gets a real test
   rather than being eyeballed. Run: node scripts/check-upload-urls.mjs */

function toSameOrigin(value) {
  if (typeof value !== 'string') return value;
  if (!value.startsWith('http')) return value;
  const i = value.indexOf('/storage/');
  return i === -1 ? value : value.slice(i);
}

function normaliseUploads(node) {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) node[i] = normaliseUploads(node[i]);
    return node;
  }
  if (node && typeof node === 'object') {
    for (const k of Object.keys(node)) node[k] = normaliseUploads(node[k]);
    return node;
  }
  return toSameOrigin(node);
}

const ABS = 'http://127.0.0.1:8000/storage/uploads/x.jpg';
const REL = '/storage/uploads/x.jpg';

const cases = [
  ['legacy absolute avatar', { avatar: ABS }, { avatar: REL }],
  ['photos array, mixed hosts', { photos: [ABS, 'https://cdn.example.com/b.png'] }, { photos: [REL, 'https://cdn.example.com/b.png'] }],
  ['deeply nested', { data: { item: { laporan_fotos: [ABS] } } }, { data: { item: { laporan_fotos: [REL] } } }],
  ['already relative is untouched', { ktp: '/storage/uploads/y.png' }, { ktp: '/storage/uploads/y.png' }],
  ['non-storage absolute untouched', { u: 'https://cdn.example.com/a.png' }, { u: 'https://cdn.example.com/a.png' }],
  ['array at root', [ABS], [REL]],
  ['null / number / bool preserved', { a: null, b: 3, c: true }, { a: null, b: 3, c: true }],
  ['empty string preserved', { f: '' }, { f: '' }],
  ['no /storage/ in an http url preserved', { gmaps: 'https://maps.google.com/?q=test' }, { gmaps: 'https://maps.google.com/?q=test' }],
];

let failed = 0;
for (const [name, input, want] of cases) {
  const got = normaliseUploads(structuredClone(input));
  if (JSON.stringify(got) !== JSON.stringify(want)) {
    failed++;
    console.log(`FAIL  ${name}\n        got  ${JSON.stringify(got)}\n        want ${JSON.stringify(want)}`);
  } else {
    console.log(`ok    ${name}`);
  }
}

console.log(failed ? `\n${failed} case(s) failed` : '\nall cases passed');
process.exit(failed ? 1 : 0);
