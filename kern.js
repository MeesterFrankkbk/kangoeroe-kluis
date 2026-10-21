'use strict';
/* ============================================================
   Kangoeroe-Kluis — kern: hulpfuncties, niveaus, bronnen, spraak
   Een spel: { id, naam, vak, icoon, kort, uitleg, bron?, perThema?, leer?(doos, ctx), maak(niveau, doos, ctx) }
   maak() tekent het spel en geeft { controleer(), hint() } terug.
   Een spel dat zichzelf afsluit (bv. Lichtjes uit) roept ctx.klaar() op.
   ============================================================ */

const NIVEAUS = { 1: 'Brons', 2: 'Zilver', 3: 'Goud', 4: 'Platinum', 5: 'Diamant' };
const MAX_NIVEAU = 5;
const VAKKEN = {
  taal: { naam: 'Taal', icoon: '📝' },
  rekenen: { naam: 'Rekenen', icoon: '🔢' },
  logica: { naam: 'Logica', icoon: '🧠' },
  frans: { naam: 'Frans', icoon: '🇫🇷' },
  engels: { naam: 'Engels', icoon: '🇬🇧' },
};
const SPELLEN = [];

/* Lege onderdelen (null/false) nooit als tekst "null" tonen */
if (typeof Element !== 'undefined') for (const P of [Element.prototype, DocumentFragment.prototype]) for (const m of ['append', 'prepend', 'replaceChildren']) {
  const orig = P[m]; P[m] = function (...a) { return orig.apply(this, a.filter(x => x != null && x !== false)); };
}

const U = {
  r: (a, b) => Math.floor(Math.random() * (b - a + 1)) + a,
  pick: a => a[Math.floor(Math.random() * a.length)],
  shuffle: a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  ggd: (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; },
  el(tag, props = {}, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v === false || v == null) continue;
      if (k === 'class') e.className = v;
      else if (k === 'style') e.style.cssText = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if (k === 'value') e.value = v;
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat(Infinity)) { if (c == null || c === false) continue; e.append(c.nodeType ? c : document.createTextNode(c)); }
    return e;
  },
  zonderAccent: s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe').replace(/Œ/g, 'OE').replace(/æ/g, 'ae'),
  norm: s => U.zonderAccent(s).toLowerCase().replace(/[^a-z0-9]/g, ''),
  groot: s => U.zonderAccent(s).toUpperCase().replace(/[^A-Z]/g, ''),
  getal: (cls = 'cel') => U.el('input', { class: cls, inputmode: 'numeric', autocomplete: 'off', maxlength: 7 }),
  letter: (cls = 'lcel') => U.el('input', { class: cls, maxlength: 1, autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false' }),
  tekst: (cls = 'tekst', ph = '') => U.el('input', { class: cls, autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', placeholder: ph }),
  mark(i, st) { i.classList.remove('goed', 'fout', 'hint'); if (st) i.classList.add(st); },
  uitslag(fout, leeg, wat = ['fout', 'fouten', 'vakje', 'vakjes']) {
    if (fout) return { ok: false, msg: `${fout} ${fout === 1 ? wat[0] : wat[1]}. Wat rood staat, klopt nog niet.` };
    if (leeg) return { ok: false, msg: `Bijna! Nog ${leeg} ${leeg === 1 ? wat[2] : wat[3]} leeg.` };
    return { ok: true };
  },
  komma: x => String(Math.round(x * 1e6) / 1e6).replace('.', ','),
  leesGetal: s => { const t = String(s).trim().replace(/\s/g, '').replace(',', '.').replace(/%$/, ''); return t === '' || isNaN(Number(t)) ? null : Number(t); },
  /* Taalvergelijking: hoofdletters tellen niet; accenten enkel als strikt */
  normTaal(s, strikt) {
    let t = String(s ?? '').replace(/[’‘`´]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
    t = t.replace(/[.!?;:,]+$/g, '').replace(/\s*'\s*/g, "'").trim();
    if (!strikt) t = U.zonderAccent(t);
    return t;
  },
  normZin(s, strikt) {
    let t = String(s ?? '').replace(/[’‘`´]/g, "'").toLowerCase().replace(/[.,!?;:"«»“”()\-–—]/g, ' ').replace(/\s*'\s*/g, "'").replace(/\s+/g, ' ').trim();
    if (!strikt) t = U.zonderAccent(t);
    return t;
  },
  vergelijk(antw, juist, strikt) {
    const a = U.normTaal(antw, strikt);
    return a !== '' && String(juist).split(/\s*[\/|]\s*/).some(j => U.normTaal(j, strikt) === a);
  },
  eersteVorm: s => String(s).split(/\s*[\/|]\s*/)[0].trim(),
  zonderLidwoord: s => String(s).replace(/^(le|la|les|l'|l’|un|une|des|the|a|an)\s*/i, '').trim(),
  /* Invulspel: cellen = [{i: input, op: oplossing}] */
  invul(cellen) {
    const eq = (i, op) => typeof op === 'number' ? U.leesGetal(i.value) === op : i.value.trim().toUpperCase() === String(op).toUpperCase();
    return {
      controleer() {
        let fout = 0, leeg = 0;
        for (const c of cellen) { if (c.i.value.trim() === '') { leeg++; U.mark(c.i, ''); continue; } const ok = eq(c.i, c.op); if (!c.i.readOnly) U.mark(c.i, ok ? 'goed' : 'fout'); if (!ok) fout++; }
        return U.uitslag(fout, leeg);
      },
      hint() {
        const kand = cellen.filter(c => !eq(c.i, c.op));
        if (!kand.length) return 'Alles staat al juist. Klik op Controleer!';
        const c = U.pick(kand); c.i.value = typeof c.op === 'number' ? U.komma(c.op) : c.op; c.i.readOnly = true; U.mark(c.i, 'hint');
        c.i.dispatchEvent(new Event('input'));
        return 'Er is één vakje voor je ingevuld (paars).';
      }
    };
  },
  /* Letters: automatisch naar volgend vakje springen */
  koppelRij(inputs) {
    inputs.forEach((inp, k) => {
      inp.addEventListener('input', () => {
        inp.value = inp.value.toUpperCase().replace(/[^A-Z]/g, '').slice(-1);
        if (inp.value) { let j = k + 1; while (inputs[j] && inputs[j].readOnly) j++; inputs[j]?.focus(); }
      });
      inp.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !inp.value && inputs[k - 1]) { e.preventDefault(); inputs[k - 1].focus(); if (!inputs[k - 1].readOnly) inputs[k - 1].value = ''; }
        if (e.key === 'ArrowRight' && inputs[k + 1]) inputs[k + 1].focus();
        if (e.key === 'ArrowLeft' && inputs[k - 1]) inputs[k - 1].focus();
      });
    });
  },
};

function medaille(n, extra = '') { return U.el('span', { class: `med m${n} ${extra}`, title: NIVEAUS[n] || '' }, n ? ['', 'B', 'Z', 'G', 'P', 'D'][n] : ''); }

/* ---------------- Vers: nooit twee keer hetzelfde (zolang er nieuwe inhoud is) ----------------
   Spellen met een vaste lijst (rebussen, droedels, zinnen …) kiezen eerst wat de leerling nog nooit kreeg,
   daarna wat het langst geleden is. Wat getoond werd, wordt als korte code bij het resultaat bewaard (ook op de server). */
const Vers = {
  spel: null, items: [],
  start(spelId) { this.spel = spelId; this.items = []; },
  code(x) { const t = typeof x === 'string' ? x : JSON.stringify(x); let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); },
  laatst() {
    const m = new Map(), res = (typeof S !== 'undefined' && S.resultaten) || [];
    for (const r of res) if (r.spel === this.spel && r.items) { const t = Date.parse(r.datum) || 0; for (const c of r.items) if ((m.get(c) || 0) < t) m.set(c, t); }
    return m;
  },
  /* lijst ordenen: nooit gezien (willekeurig) eerst, dan van lang geleden naar recent */
  orden(lijst) { const m = this.laatst(); return U.shuffle(lijst).map(x => [x, m.get(this.code(x)) || 0]).sort((a, b) => a[1] - b[1]).map(x => x[0]); },
  kies(lijst, aantal) { const uit = this.orden(lijst).slice(0, aantal); this.markeer(...uit); return uit; },
  markeer(...xs) { for (const x of xs) { const c = this.code(x); if (!this.items.includes(c)) this.items.push(c); } },
};

/* ---------------- Ingebouwde inhoud die de leerkracht uitzette (EIGEN.uit[soort] = codes) ---------------- */
const Ingebouwd = {
  uit(soort) { return new Set((typeof EIGEN !== 'undefined' && EIGEN.uit && EIGEN.uit[soort]) || []); },
  /* lijst zonder uitgezette items; blijft er minder over dan 'min', dan toch alles (de opgave moet altijd lukken) */
  pool(soort, lijst, eigen = [], min = 1) { const u = this.uit(soort); const f = [...lijst.filter(x => !u.has(Vers.code(x))), ...eigen]; return f.length >= min ? f : [...lijst, ...eigen]; },
};

/* ---------------- Bronnen: ingebouwd + eigen inhoud van de leerkracht ---------------- */
const BRONSOORTEN = {
  woorden: { label: 'Woordenlijst', vak: 'taal' },
  zinnen: { label: 'Zinnen', vak: 'taal' },
  'fr-woorden': { label: 'Woordenschat', vak: 'frans', taal: 'fr' },
  'en-woorden': { label: 'Woordenschat', vak: 'engels', taal: 'en' },
  'fr-ww': { label: 'Werkwoorden', vak: 'frans', taal: 'fr' },
  'en-ww': { label: 'Werkwoorden', vak: 'engels', taal: 'en' },
  'fr-teksten': { label: 'Tekst', vak: 'frans', taal: 'fr' },
  'en-teksten': { label: 'Tekst', vak: 'engels', taal: 'en' },
  uitdagingen: { label: 'Reeks', vak: 'rekenen' },
};
const INGEBOUWD = Object.fromEntries(Object.keys(BRONSOORTEN).map(k => [k, []]));
let EIGEN = {};
function bronnen(soort) {
  const eigen = (EIGEN[soort] || []).filter(b => !b.verborgen).map(b => ({ ...b, eigen: true }));
  const verborgen = new Set(EIGEN.verborgen || []);
  const ingebouwd = (INGEBOUWD[soort] || []).filter(b => !verborgen.has(b.id));
  return [...eigen, ...(ingebouwd.length || eigen.length ? ingebouwd : INGEBOUWD[soort] || [])];
}
function bronVan(soort, id) { const l = bronnen(soort); return l.find(b => b.id === id) || l[0]; }

/* ---------------- Spraak ---------------- */
const Spraak = {
  ok: typeof window !== 'undefined' && 'speechSynthesis' in window,
  lang: { fr: 'fr-FR', en: 'en-GB', nl: 'nl-BE' },
  stem(taal) {
    const v = speechSynthesis.getVoices();
    const voorkeur = { fr: ['fr-FR', 'fr-BE', 'fr-CA'], en: ['en-GB', 'en-US', 'en-IE'], nl: ['nl-BE', 'nl-NL'] }[taal] || [];
    return voorkeur.map(p => v.find(x => x.lang.replace('_', '-') === p)).find(Boolean) || v.find(x => x.lang.toLowerCase().startsWith(taal));
  },
  spreek(tekst, taal, opt = {}) {
    if (!this.ok) return false;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(tekst);
    u.lang = this.lang[taal] || taal;
    const s = this.stem(taal); if (s) u.voice = s;
    u.rate = opt.traag ? 0.65 : 0.9;
    if (opt.einde) { u.onend = opt.einde; u.onerror = opt.einde; }
    speechSynthesis.speak(u);
    return true;
  },
  /* Lees een reeks zinnen na elkaar voor; onZin(k) bij elke zin, onKlaar() op het einde */
  leesReeks(zinnen, taal, { traag, onZin, onKlaar } = {}) {
    if (!this.ok) return () => { };
    let k = 0, gestopt = false;
    const volgende = () => {
      if (gestopt) return;
      if (k >= zinnen.length) { onZin?.(-1); onKlaar?.(); return; }
      onZin?.(k);
      this.spreek(zinnen[k], taal, { traag, einde: () => { k++; volgende(); } });
    };
    volgende();
    return () => { gestopt = true; speechSynthesis.cancel(); onZin?.(-1); };
  },
  stop() { if (this.ok) speechSynthesis.cancel(); },
  knoppen(tekst, taal) {
    return U.el('span', { class: 'spreekknoppen' },
      U.el('button', { class: 'luister', type: 'button', title: 'Luister', onclick: e => { e.stopPropagation(); Spraak.spreek(typeof tekst === 'function' ? tekst() : tekst, taal); } }, '🔊'),
      U.el('button', { class: 'luister', type: 'button', title: 'Luister traag', onclick: e => { e.stopPropagation(); Spraak.spreek(typeof tekst === 'function' ? tekst() : tekst, taal, { traag: true }); } }, '🐢'));
  },
};
if (Spraak.ok) { speechSynthesis.getVoices(); speechSynthesis.addEventListener?.('voiceschanged', () => { }); }

/* Zinnen splitsen voor teksten */
function splitsZinnen(tekst) {
  return (String(tekst).replace(/\s+/g, ' ').match(/[^.!?]+[.!?]+["»”')]*|[^.!?]+$/g) || []).map(s => s.trim()).filter(Boolean);
}

if (typeof module !== 'undefined') module.exports = { U, NIVEAUS, SPELLEN };
