'use strict';
/* ======================= TAAL (Nederlands) ======================= */

function woordLijst(ctx, min = 3, max = 15) {
  const uit = [], gezien = new Set();
  for (const [w, o] of (ctx?.bron?.woorden || [])) {
    const W = U.groot(w);
    if (W.length < min || W.length > max || gezien.has(W)) continue;
    gezien.add(W); uit.push([W, o || '']);
  }
  return uit;
}
const alleWoorden = (min, max) => woordLijst({ bron: INGEBOUWD.woorden[0] }, min, max);
const schoonZin = z => U.zonderAccent(z).toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
/* Zinnen mogen een betekenis hebben: "zin ; betekenis" */
const splitsZin = r => { const [z, ...b] = String(r).split(/\s*;\s*/); return { z: schoonZin(z), b: b.join('; ').trim() }; };
function zinLijst(ctx) {
  const z = (ctx?.bron?.zinnen || []).map(r => splitsZin(r).z).filter(z => z.length >= 6);
  return z.length ? z : INGEBOUWD.zinnen[0].zinnen.map(r => splitsZin(r).z);
}
const alleZinItems = ctx => [...(ctx?.bron?.zinnen || []), ...Object.values(INGEBOUWD.zinnen).flatMap(b => b.zinnen), ...((typeof EIGEN !== 'undefined' && EIGEN.zinnen) || []).flatMap(b => b.zinnen || [])].map(splitsZin);
const betekenisVan = (ctx, zin) => alleZinItems(ctx).find(x => x.z === zin && x.b)?.b || '';
const leesbaar = z => z.charAt(0) + z.slice(1).toLowerCase();
/* Na het oplossen: kies de juiste betekenis van het spreekwoord of de uitdrukking */
function metBetekenis(inst, doos, zin, ctx) {
  const b = betekenisVan(ctx, zin);
  if (!b || !inst) return inst;
  let fase = 1, mc = null;
  const blok = U.el('div', { class: 'betekenis' });
  return {
    ...inst,
    controleer() {
      if (fase === 1) {
        const r = inst.controleer(); if (!r.ok) return r;
        fase = 2;
        const pool = [...new Set(alleZinItems(ctx).filter(x => x.b && x.b !== b).map(x => x.b))];
        const opties = U.shuffle([b, ...U.shuffle(pool).slice(0, 3)]);
        mc = rijMC(['Wat betekent ', U.el('b', {}, `"${leesbaar(zin)}"`), '?'], opties, opties.indexOf(b));
        blok.append(U.el('div', { class: 'label' }, '✅ Gevonden! Nog één vraag:'), mc.el);
        doos.append(blok); blok.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
        return { ok: false, info: true, msg: 'Goed zo! Klik nu de juiste betekenis aan en controleer opnieuw.' };
      }
      const st = mc.status();
      if (st === null) return { ok: false, info: true, msg: 'Klik eerst de betekenis aan die volgens jou juist is.' };
      mc.el.classList.toggle('fout', !st); mc.el.classList.toggle('goed', st);
      return st ? { ok: true } : { ok: false, msg: 'Dat is niet de juiste betekenis. Probeer opnieuw. Tip: zoek het spreekwoord op in een woordenboek.' };
    },
    hint() { if (fase === 1) return inst.hint(); mc.hint(); return 'De juiste betekenis is aangeduid.'; }
  };
}
/* Kies een zin tussen min en max tekens, met woorden van hoogstens maxWoord letters */
function kiesZin(lijst, min, max, maxWoord = 99) {
  const passend = lijst.filter(z => z.split(' ').every(w => w.length <= maxWoord));
  const bron = passend.length ? passend : INGEBOUWD.zinnen.flatMap(b => b.zinnen).map(r => splitsZin(r).z).filter(z => z.split(' ').every(w => w.length <= maxWoord));
  const binnen = bron.filter(z => z.length >= min && z.length <= max);
  if (binnen.length) return U.pick(binnen);
  const afstand = z => z.length < min ? min - z.length : z.length - max;
  const best = Math.min(...bron.map(afstand));
  return U.pick(bron.filter(z => afstand(z) === best));
}
const LETTERFREQ = 'EEEEEEEEEENNNNNNNAAAAAAATTTTTIIIIIRRRRROOOOODDDDDSSSSLLLLGGGVVHHKKKMMMUUBBPPWJZCFY';

/* ---------------- Filippine ---------------- */
SPELLEN.push({
  id: 'filippine', naam: 'Filippine', vak: 'taal', icoon: '🧩', bron: 'woorden',
  kort: 'Zoek de woorden en ontdek het oplossingswoord.',
  uitleg: 'Zoek bij elke omschrijving het juiste woord. In de gekleurde kolom verschijnt dan van boven naar onder het oplossingswoord.',
  maak(n, doos, ctx) {
    const [minL, maxL] = [[0, 0], [4, 6], [5, 8], [7, 10], [8, 13], [8, 13]][n];
    const maxRij = [0, 7, 9, 11, 13, 14][n];
    const eigen = woordLijst(ctx, 3, maxRij), alle = alleWoorden(3, maxRij);
    const kandOpl = [...U.shuffle(eigen.map(x => x[0])), ...U.shuffle(FILIPPINE_OPLOSSINGEN)].filter(w => w.length >= minL && w.length <= maxL);
    const bouw = (opl, pool) => {
      for (let p = 0; p < 30; p++) {
        const gebruikt = new Set([opl]), rijen = [];
        for (const ch of opl) {
          const kand = pool.filter(([w]) => !gebruikt.has(w) && w.includes(ch));
          if (!kand.length) { rijen.length = 0; break; }
          const [w, o] = U.pick(kand); gebruikt.add(w);
          const pos = [...w].map((c, k) => c === ch ? k : -1).filter(k => k >= 0);
          rijen.push({ w, o, pos: U.pick(pos) });
        }
        if (rijen.length === opl.length) return rijen;
      }
      return null;
    };
    let rijen = null;
    for (const pool of [eigen, [...eigen, ...alle]]) {
      for (const opl of kandOpl.slice(0, 40)) { rijen = bouw(opl, pool); if (rijen) break; }
      if (rijen) break;
    }
    for (const opl of U.shuffle(FILIPPINE_OPLOSSINGEN)) { if (rijen) break; rijen = bouw(opl, alleWoorden(3, 14)); }
    const kol =Math.max(...rijen.map(r => r.pos));
    const breed = Math.max(...rijen.map(r => kol - r.pos + r.w.length));
    const cellen = [];
    const rooster = U.el('div', { class: 'fil-rooster', style: `grid-template-columns: 2rem repeat(${breed}, var(--cel))` });
    rijen.forEach((r, k) => {
      rooster.append(U.el('div', { class: 'fil-nr' }, n === 5 ? '' : String(k + 1)));
      const start = kol - r.pos, rijInputs = [];
      for (let c = 0; c < breed; c++) {
        const idx = c - start;
        if (idx < 0 || idx >= r.w.length) { rooster.append(U.el('div')); continue; }
        const inp = U.letter(c === kol ? 'lcel sleutel' : 'lcel');
        if (n === 1 && idx === 0) { inp.value = r.w[0]; inp.readOnly = true; inp.classList.add('gegeven'); }
        rooster.append(inp); rijInputs.push(inp); cellen.push({ i: inp, op: r.w[idx] });
      }
      U.koppelRij(rijInputs);
    });
    let omschr = rijen.map((r, k) => ({ k, t: `${r.o || 'Woord van ' + r.w.length + ' letters'} (${r.w.length})` }));
    if (n === 5) omschr = [...omschr].sort((a, b) => a.t.localeCompare(b.t, 'nl'));
    doos.append(U.el('div', { class: 'scroll-x' }, rooster),
      n === 5 ? U.el('p', { class: 'opdracht' }, 'Diamant: de omschrijvingen staan door elkaar. Welke hoort bij welke rij?') : null,
      U.el(n === 5 ? 'ul' : 'ol', { class: 'fil-omschr' }, omschr.map(o => U.el('li', {}, o.t))));
    return U.invul(cellen);
  }
});

/* ---------------- Letterhussel (diamant = dubbelpuzzel) ---------------- */
SPELLEN.push({
  id: 'letterhussel', naam: 'Letterhussel', vak: 'taal', icoon: '🔀', bron: 'woorden',
  kort: 'Zet de letters weer in de juiste volgorde.',
  uitleg: 'De letters van elk woord zijn door elkaar geschud. Zet ze weer in de juiste volgorde. Op diamant vormen de letters in de cirkels samen nog een geheim woord!',
  maak(n, doos, ctx) {
    if (n === 5) return dubbelpuzzel(doos, ctx);
    const [lo, hi] = [[0, 0], [4, 6], [5, 8], [6, 10], [8, 14]][n];
    let keuze = U.shuffle(woordLijst(ctx, lo, hi));
    if (keuze.length < 5) keuze = [...keuze, ...U.shuffle(alleWoorden(lo, hi))];
    keuze = keuze.slice(0, n >= 3 ? 6 : 5);
    const cellen = [];
    const tabel = U.el('div', { class: 'hussel' });
    for (const [w, o] of keuze) {
      let mix; do { mix = U.shuffle([...w]).join(''); } while (mix === w);
      const inp = U.tekst('tekst', 'Typ het woord');
      inp.addEventListener('input', () => inp.value = inp.value.toUpperCase());
      tabel.append(U.el('div', { class: 'hussel-rij' },
        U.el('div', { class: 'tegels' }, [...mix].map(c => U.el('span', { class: 'tegel' }, c))),
        U.el('div', { class: 'hussel-in' }, n <= 3 && o ? U.el('small', {}, o) : null, inp)));
      cellen.push({ i: inp, op: w });
    }
    doos.append(tabel);
    const inv = U.invul(cellen);
    return {
      controleer: inv.controleer,
      hint() {
        const c = cellen.find(c => c.i.value.trim().toUpperCase() !== c.op);
        if (!c) return 'Alles staat al juist!';
        const juist = [...c.op].findIndex((ch, k) => c.i.value.toUpperCase()[k] !== ch);
        c.i.value = c.op.slice(0, juist + 1); U.mark(c.i, 'hint'); c.i.focus();
        return 'Het begin van een woord staat er nu.';
      }
    };
  }
});

function dubbelpuzzel(doos, ctx) {
  const eigen = woordLijst(ctx, 4, 11), alle = alleWoorden(4, 11);
  let geheim, rijen;
  for (let p = 0; p < 200 && !rijen; p++) {
    const pool = p < 100 && eigen.length >= 10 ? eigen : [...eigen, ...alle];
    geheim = U.pick([...pool.map(x => x[0]), ...FILIPPINE_OPLOSSINGEN].filter(w => w.length >= 5 && w.length <= 7));
    const gebruikt = new Set([geheim]), r = [];
    for (const ch of geheim) {
      const kand = pool.filter(([w]) => !gebruikt.has(w) && w.includes(ch) && w.length >= 5);
      if (!kand.length) break;
      const [w, o] = U.pick(kand); gebruikt.add(w);
      r.push({ w, o, pos: U.pick([...w].map((c, k) => c === ch ? k : -1).filter(k => k >= 0)) });
    }
    if (r.length === geheim.length) rijen = U.shuffle(r);
  }
  const cellen = [];
  const box = U.el('div', { class: 'hussel' });
  for (const r of rijen) {
    let mix; do { mix = U.shuffle([...r.w]).join(''); } while (mix === r.w);
    const vakjes = [...r.w].map((ch, k) => { const i = U.letter(k === r.pos ? 'lcel cirkel' : 'lcel'); cellen.push({ i, op: ch }); return i; });
    U.koppelRij(vakjes);
    box.append(U.el('div', { class: 'hussel-rij' },
      U.el('div', { class: 'tegels' }, [...mix].map(c => U.el('span', { class: 'tegel' }, c))),
      U.el('div', { class: 'hussel-in' }, r.o ? U.el('small', {}, r.o) : null, U.el('div', { class: 'vakjesrij' }, vakjes))));
  }
  const slot = [...geheim].map(ch => { const i = U.letter('lcel sleutel'); cellen.push({ i, op: ch }); return i; });
  U.koppelRij(slot);
  doos.append(box, U.el('div', { class: 'label' }, 'Geheim woord: hussel de letters uit de cirkels'), U.el('div', { class: 'vakjesrij' }, slot));
  return U.invul(cellen);
}

/* ---------------- Geheimschrift ---------------- */
SPELLEN.push({
  id: 'geheimschrift', naam: 'Geheimschrift', vak: 'taal', icoon: '🕵️', bron: 'zinnen',
  kort: 'Kraak de code van de geheime boodschap.',
  uitleg: 'Elke letter is vervangen door een teken of een andere letter. Typ onder elk teken de echte letter: hetzelfde teken krijgt overal dezelfde letter.',
  maak(n, doos, ctx) {
    const zinnen = zinLijst(ctx);
    let tekst = n <= 3 ? kiesZin(zinnen, [0, 10, 16, 20][n], [0, 26, 34, 42][n]) : kiesZin(zinnen, n === 4 ? 26 : 34, n === 4 ? 50 : 80);
    if (n === 5 && tekst.length < 40) { let t2; do { t2 = kiesZin(zinnen, 20, 45); } while (t2 === tekst && zinnen.length > 1); tekst += ' ' + t2; }
    doos.dataset.zin = tekst;
    const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const code = {};
    let verschuiving = 0;
    if (n === 1) { const sym = U.shuffle([...'★☆♠♣♥♦●○■□▲△▼▽◆◇♪♫☀☁☂☃✿❀✚✖']); [...ABC].forEach((c, k) => code[c] = sym[k]); }
    else if (n <= 3) { verschuiving = U.r(2, 23); [...ABC].forEach((c, k) => code[c] = ABC[(k + verschuiving) % 26]); }
    else { let p; do { p = U.shuffle([...ABC]); } while (p.some((c, k) => c === ABC[k])); [...ABC].forEach((c, k) => code[c] = p[k]); }
    const echt = Object.fromEntries(Object.entries(code).map(([a, b]) => [b, a]));
    const letters = [...new Set(tekst.replace(/[^A-Z]/g, ''))];
    const gegeven = new Set(n >= 4 ? U.shuffle(letters).slice(0, n === 4 ? 5 : 2).map(c => code[c]) : []);
    if (n === 1) doos.append(U.el('div', { class: 'sleutel-tabel' }, [...ABC].map(c => U.el('div', {}, U.el('b', {}, code[c]), U.el('span', {}, c)))));
    else if (n <= 3) doos.append(U.el('p', { class: 'opdracht' }, n === 2 ? `Elke letter is ${verschuiving} plaatsen opgeschoven in het alfabet. Voorbeeld: A werd ${code.A}.` : 'Elke letter is een vast aantal plaatsen opgeschoven in het alfabet. Hoeveel? Dat moet je zelf ontdekken!'),
      U.el('div', { class: 'abc-strook' }, [...ABC].map(c => U.el('span', {}, c))));
    else doos.append(U.el('p', { class: 'opdracht' }, `Elke letter is vervangen door een willekeurige andere letter. ${gegeven.size} letters zijn al gegeven. Tip: in het Nederlands komen E, N, A en T het vaakst voor.`));
    const perTeken = {}, volgorde = [];
    const wrap = U.el('div', { class: 'gs-tekst' });
    for (const woord of tekst.split(' ')) {
      const w = U.el('span', { class: 'gs-woord' });
      for (const ch of woord) {
        if (!/[A-Z]/.test(ch)) { w.append(U.el('span', { class: 'gs-cel leeg' }, U.el('span', { class: 'gs-code' }, ch), U.el('span', { class: 'gs-vast' }, ch))); continue; }
        const t = code[ch], inp = U.letter('gs-in');
        (perTeken[t] = perTeken[t] || []).push(inp); volgorde.push(inp);
        if (gegeven.has(t)) { inp.value = ch; inp.readOnly = true; inp.classList.add('gegeven'); }
        inp.addEventListener('input', () => {
          const v = inp.value.toUpperCase().replace(/[^A-Z]/g, '').slice(-1);
          perTeken[t].forEach(x => { x.value = v; U.mark(x, ''); });
          if (v) { let j = volgorde.indexOf(inp) + 1; while (volgorde[j] && (volgorde[j].readOnly || volgorde[j].value)) j++; volgorde[j]?.focus(); }
        });
        inp.addEventListener('focus', () => { Object.values(perTeken).flat().forEach(x => x.classList.remove('zelfde')); perTeken[t].forEach(x => x.classList.add('zelfde')); });
        w.append(U.el('span', { class: 'gs-cel' }, U.el('span', { class: 'gs-code' }, t), inp));
      }
      wrap.append(w);
    }
    doos.append(wrap);
    let hints = 0;
    return {
      controleer() {
        let fout = 0, leeg = 0;
        for (const [t, inps] of Object.entries(perTeken)) {
          const v = inps[0].value;
          if (!v) { leeg++; continue; }
          const ok = v === echt[t]; if (!ok) fout++;
          inps.forEach(x => { if (!x.readOnly) U.mark(x, ok ? 'goed' : 'fout'); });
        }
        return U.uitslag(fout, leeg, ['teken is fout', 'tekens zijn fout', 'teken', 'tekens']);
      },
      hint() {
        hints++;
        if (n === 3 && hints === 1) return `De letters zijn ${verschuiving} plaatsen opgeschoven.`;
        const open = Object.entries(perTeken).filter(([t, i]) => i[0].value !== echt[t]).sort((a, b) => b[1].length - a[1].length);
        if (!open.length) return 'Alles staat juist!';
        const [t, inps] = open[0];
        inps.forEach(x => { x.value = echt[t]; x.readOnly = true; U.mark(x, 'hint'); });
        return `Het teken ${t} is de letter ${echt[t]}.`;
      }
    };
  }
});

/* ---------------- Muurstenen ---------------- */
SPELLEN.push({
  id: 'zinsstenen', naam: 'Muurstenen', vak: 'taal', icoon: '🧱', bron: 'zinnen',
  kort: 'Bouw de muur en lees de zin.',
  uitleg: 'Een zin is in stenen gebroken. Klik de stenen in de juiste volgorde om de muur weer op te bouwen. Een · is een spatie. Klik op een steen in de muur om hem terug te leggen.',
  maak(n, doos, ctx) {
    const zinnen = zinLijst(ctx);
    let zin = kiesZin(zinnen, [0, 10, 18, 24, 28, 36][n], [0, 24, 32, 42, 55, 80][n]);
    if (n === 5 && zin.length < 36) zin += ' ' + kiesZin(zinnen.filter(z => z !== zin), 10, 40);
    doos.dataset.zin = zin;
    const grootte = [0, 4, 3, 3, 2, 2][n];
    const stenen = [];
    for (let k = 0; k < zin.length; k += grootte) stenen.push(zin.slice(k, k + grootte));
    const stapel = U.shuffle(stenen.map((t, k) => ({ t, k }))), muur = [];
    const muurEl = U.el('div', { class: 'muur' }), stapelEl = U.el('div', { class: 'stapel' });
    const toon = s => s.replace(/ /g, '·');
    function teken() {
      muurEl.replaceChildren(...(muur.length ? muur.map((s, k) => U.el('button', { class: 'steen geplaatst' + (s.vast ? ' hint' : ''), onclick: () => { if (s.vast) return; muur.splice(k, 1); stapel.push(s); teken(); } }, toon(s.t))) : [U.el('span', { class: 'leeg-tekst' }, 'Klik hieronder op de eerste steen…')]));
      stapelEl.replaceChildren(...stapel.map((s, k) => U.el('button', { class: 'steen', onclick: () => { stapel.splice(k, 1); muur.push(s); teken(); } }, toon(s.t))));
    }
    teken();
    doos.append(U.el('div', { class: 'label' }, 'De muur'), muurEl, U.el('div', { class: 'label' }, 'Losse stenen'), stapelEl);
    return {
      controleer() {
        if (stapel.length) return { ok: false, msg: `Er liggen nog ${stapel.length} stenen naast de muur.` };
        const ok = muur.map(s => s.t).join('') === zin;
        muurEl.classList.toggle('fout', !ok);
        return ok ? { ok } : { ok, msg: 'De muur staat nog niet goed. Lees de zin hardop: klopt hij?' };
      },
      hint() {
        let p = 0; while (p < muur.length && muur[p].t === stenen[p]) p++;
        if (p >= stenen.length) return 'De muur staat al goed!';
        stapel.push(...muur.splice(p));
        const s = stapel.splice(stapel.findIndex(s => s.t === stenen[p]), 1)[0]; muur.push(s);
        muur.forEach(s => s.vast = true); teken();
        return 'Het begin van de muur staat nu vast.';
      }
    };
  }
});

/* ---------------- Gevallen letters ---------------- */
SPELLEN.push({
  id: 'gevallen', naam: 'Gevallen letters', vak: 'taal', icoon: '🍂', bron: 'zinnen',
  kort: 'Zet de gevallen letters terug op het bord.',
  uitleg: 'De letters zijn van het bord gevallen! Elke letter ligt onder de kolom waar hij thuishoort. Zet ze terug in de juiste rij. Zwarte vakjes zijn tussenruimtes. Een letter die je gebruikt, wordt onderaan doorgestreept.',
  maak(n, doos, ctx) {
    const W = [0, 9, 11, 13, 13, 15][n];
    const zinnen = zinLijst(ctx);
    let zin = kiesZin(zinnen, [0, 10, 18, 26, 32, 40][n], [0, 22, 30, 40, 55, 80][n], W);
    if (n === 5 && zin.length < 40) zin += ' ' + kiesZin(zinnen.filter(z => z !== zin), 10, 40, W);
    doos.dataset.zin = zin;
    const lijnen = []; let huidig = '';
    for (const w of zin.split(' ')) {
      if (!huidig) huidig = w; else if ((huidig + ' ' + w).length <= W) huidig += ' ' + w; else { lijnen.push(huidig); huidig = w; }
    }
    lijnen.push(huidig);
    const rooster = U.el('div', { class: 'val-rooster', style: `grid-template-columns: repeat(${W}, var(--cel))` });
    const cellen = [], kolomLetters = Array.from({ length: W }, () => []), kolomInputs = Array.from({ length: W }, () => []), perRij = [];
    lijnen.forEach(l => {
      const rij = [];
      for (let c = 0; c < W; c++) {
        const ch = l[c];
        if (!ch || ch === ' ') { rooster.append(U.el('div', { class: 'zwart' })); continue; }
        const inp = U.letter(); rooster.append(inp); rij.push(inp); kolomInputs[c].push(inp);
        cellen.push({ i: inp, op: ch }); kolomLetters[c].push(ch);
      }
      perRij.push(rij);
    });
    perRij.forEach(U.koppelRij);
    const kolomSpans = kolomLetters.map(ls => [...ls].sort().map(c => U.el('span', { 'data-l': c }, c)));
    const onder = U.el('div', { class: 'val-letters', style: `grid-template-columns: repeat(${W}, var(--cel))` }, kolomSpans.map(sp => U.el('div', {}, sp)));
    const herteken = c => {
      const tel = {};
      kolomInputs[c].forEach(i => { if (i.value) tel[i.value] = (tel[i.value] || 0) + 1; });
      kolomSpans[c].forEach(s => { const l = s.dataset.l; if (tel[l] > 0) { s.classList.add('op'); tel[l]--; } else s.classList.remove('op'); });
      kolomInputs[c].forEach(i => i.classList.toggle('teveel', !!i.value && !kolomLetters[c].includes(i.value)));
    };
    kolomInputs.forEach((inps, c) => inps.forEach(i => i.addEventListener('input', () => herteken(c))));
    doos.append(U.el('div', { class: 'scroll-x' }, rooster, onder));
    return U.invul(cellen);
  }
});

/* ---------------- Woordzoeker ---------------- */
SPELLEN.push({
  id: 'woordzoeker', naam: 'Woordzoeker', vak: 'taal', icoon: '🔎', bron: 'woorden',
  kort: 'Vind alle verstopte woorden.',
  uitleg: 'Zoek de woorden in het rooster. Klik op de eerste letter en daarna op de laatste letter van een woord. Op hogere niveaus staan de woorden ook schuin en achterstevoren. Op diamant krijg je alleen omschrijvingen!',
  maak(n, doos, ctx) {
    const N = [0, 8, 10, 12, 14, 15][n], aantal = [0, 6, 8, 10, 12, 12][n];
    const R = [[0, 1], [1, 0]];
    const dirs = n === 1 ? R : n === 2 ? [...R, [1, 1]] : n === 3 ? [...R, [1, 1], [0, -1], [-1, 0]] : [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];
    let pool = U.shuffle(woordLijst(ctx, 3, N));
    if (pool.length < aantal) pool = [...pool, ...U.shuffle(alleWoorden(3, N))];
    const G = Array.from({ length: N }, () => Array(N).fill('')), woorden = [];
    for (const [w, o] of pool) {
      if (woorden.length >= aantal) break;
      if (woorden.some(x => x.w === w || x.w.includes(w) || w.includes(x.w))) continue;
      for (let t = 0; t < 150; t++) {
        const [dr, dc] = U.pick(dirs), r = U.r(0, N - 1), c = U.r(0, N - 1);
        const er = r + dr * (w.length - 1), ec = c + dc * (w.length - 1);
        if (er < 0 || er >= N || ec < 0 || ec >= N) continue;
        let ok = true;
        for (let k = 0; k < w.length; k++) { const x = G[r + dr * k][c + dc * k]; if (x && x !== w[k]) { ok = false; break; } }
        if (!ok) continue;
        const pos = [];
        for (let k = 0; k < w.length; k++) { G[r + dr * k][c + dc * k] = w[k]; pos.push((r + dr * k) * N + c + dc * k); }
        woorden.push({ w, o, pos }); break;
      }
    }
    const knoppen = [];
    const rooster = U.el('div', { class: 'wz-rooster', style: `grid-template-columns: repeat(${N}, var(--wz))` });
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      if (!G[r][c]) G[r][c] = U.pick([...LETTERFREQ]);
      const b = U.el('button', { class: 'wz-cel', onclick: () => klik(r * N + c) }, G[r][c]);
      knoppen.push(b); rooster.append(b);
    }
    const lijst = U.el('ul', { class: 'wz-lijst' + (n === 5 ? ' omschr' : '') });
    const tekenLijst = () => lijst.replaceChildren(...[...woorden].sort((a, b) => n === 5 ? 0 : a.w.localeCompare(b.w)).map(x =>
      U.el('li', { class: x.gevonden ? 'gevonden' : '' }, n === 5 ? (x.gevonden ? `${x.w} — ${x.o}` : `${x.o || 'Woord'} (${x.w.length})`) : x.w)));
    tekenLijst();
    let start = null;
    const kleuren = ['#FFD9B3', '#CDEBD9', '#D6E4FF', '#F6D2F0', '#FFF0A8', '#D2F1F4'];
    const vind = x => { x.gevonden = true; const kl = kleuren[woorden.filter(w => w.gevonden).length % kleuren.length]; x.pos.forEach(p => { knoppen[p].classList.add('gevonden'); knoppen[p].style.background = kl; }); tekenLijst(); if (woorden.every(w => w.gevonden)) ctx.klaar?.(); };
    function klik(p) {
      if (start === null) { start = p; knoppen[p].classList.add('kies'); return; }
      const a = start; start = null; knoppen.forEach(k => k.classList.remove('kies'));
      if (a === p) return;
      const r1 = Math.floor(a / N), c1 = a % N, r2 = Math.floor(p / N), c2 = p % N;
      const dr = Math.sign(r2 - r1), dc = Math.sign(c2 - c1), len = Math.max(Math.abs(r2 - r1), Math.abs(c2 - c1)) + 1;
      if (!(r1 === r2 || c1 === c2 || Math.abs(r2 - r1) === Math.abs(c2 - c1))) return flits(p);
      const sel = []; for (let k = 0; k < len; k++) sel.push((r1 + dr * k) * N + c1 + dc * k);
      const sleutel = [...sel].sort((x, y) => x - y).join();
      const x = woorden.find(w => !w.gevonden && [...w.pos].sort((x, y) => x - y).join() === sleutel);
      if (x) vind(x); else flits(p);
    }
    const flits = p => { knoppen[p].classList.add('mis'); setTimeout(() => knoppen[p].classList.remove('mis'), 400); };
    doos.append(U.el('div', { class: 'wz-wrap' }, U.el('div', { class: 'scroll-x' }, rooster), U.el('div', {}, U.el('div', { class: 'label' }, `Te vinden (${woorden.length})`), lijst)));
    return {
      controleer() { const rest = woorden.filter(w => !w.gevonden).length; return rest ? { ok: false, msg: `Nog ${rest} ${rest === 1 ? 'woord' : 'woorden'} te vinden.` } : { ok: true }; },
      hint() {
        const x = woorden.find(w => !w.gevonden && w.hintStart) || U.pick(woorden.filter(w => !w.gevonden));
        if (!x) return 'Je vond alles al!';
        if (!x.hintStart) { x.hintStart = true; knoppen[x.pos[0]].classList.add('hintstart'); return 'Een woord begint bij de paarse letter.'; }
        vind(x); return `Gevonden: ${x.w}.`;
      }
    };
  }
});

/* ---------------- Kruiswoordraadsel ---------------- */
function bouwKruiswoord(woorden, aantal, LIM = 15) {
  let best = null;
  for (let poging = 0; poging < 50; poging++) {
    const kand = U.shuffle(woorden).slice(0, aantal * 5).sort((a, b) => b[0].length - a[0].length + (Math.random() - 0.5) * 6);
    const cel = new Map(), geplaatst = [];
    const get = (r, c) => cel.get(r + ',' + c);
    let minR = 0, maxR = 0, minC = 0, maxC = 0;
    const zet = (w, o, r, c, d) => {
      for (let k = 0; k < w.length; k++) {
        const rr = r + (d ? k : 0), cc = c + (d ? 0 : k), key = rr + ',' + cc, x = cel.get(key) || { ch: w[k] };
        if (d) x.v = true; else x.h = true; cel.set(key, x);
        minR = Math.min(minR, rr); maxR = Math.max(maxR, rr); minC = Math.min(minC, cc); maxC = Math.max(maxC, cc);
      }
      geplaatst.push({ w, o, r, c, d });
    };
    const past = (w, r, c, d) => {
      if (get(r - (d ? 1 : 0), c - (d ? 0 : 1)) || get(r + (d ? w.length : 0), c + (d ? 0 : w.length))) return -1;
      const er = r + (d ? w.length - 1 : 0), ec = c + (d ? 0 : w.length - 1);
      if (Math.max(maxR, er) - Math.min(minR, r) >= LIM || Math.max(maxC, ec) - Math.min(minC, c) >= LIM) return -1;
      let kruis = 0;
      for (let k = 0; k < w.length; k++) {
        const rr = r + (d ? k : 0), cc = c + (d ? 0 : k), x = get(rr, cc);
        if (x) { if (x.ch !== w[k] || (d ? x.v : x.h)) return -1; kruis++; }
        else if (d ? (get(rr, cc - 1) || get(rr, cc + 1)) : (get(rr - 1, cc) || get(rr + 1, cc))) return -1;
      }
      return kruis;
    };
    zet(kand[0][0], kand[0][1], 0, 0, 0);
    for (const [w, o] of kand.slice(1)) {
      if (geplaatst.length >= aantal) break;
      if (geplaatst.some(p => p.w === w)) continue;
      const opties = [];
      for (const p of geplaatst) for (let i = 0; i < p.w.length; i++) for (let j = 0; j < w.length; j++) if (p.w[i] === w[j]) {
        const d = p.d ? 0 : 1, pr = p.r + (p.d ? i : 0), pc = p.c + (p.d ? 0 : i);
        const r = pr - (d ? j : 0), c = pc - (d ? 0 : j), k = past(w, r, c, d);
        if (k > 0) opties.push({ r, c, d, k });
      }
      if (opties.length) { const m = Math.max(...opties.map(x => x.k)); const o2 = U.pick(opties.filter(x => x.k === m)); zet(w, o, o2.r, o2.c, o2.d); }
    }
    const score = geplaatst.length * 100 - (maxR - minR + 1) * (maxC - minC + 1) / 4;
    if (!best || score > best.score) best = { score, geplaatst: geplaatst.map(p => ({ ...p, r: p.r - minR, c: p.c - minC })), H: maxR - minR + 1, B: maxC - minC + 1 };
    if (best.geplaatst.length >= aantal && poging > 8) break;
  }
  return best;
}

SPELLEN.push({
  id: 'kruiswoord', naam: 'Kruiswoordraadsel', vak: 'taal', icoon: '✏️', bron: 'woorden',
  kort: 'Een echt kruiswoordraadsel.',
  uitleg: 'Vul het kruiswoordraadsel in met de omschrijvingen. Klik op een omschrijving of op een vakje. Klik nog eens op hetzelfde vakje om van richting te wisselen.',
  maak(n, doos, ctx) {
    const aantal = [0, 5, 7, 9, 11, 14][n], maxL = [0, 7, 9, 11, 13, 14][n];
    let pool = woordLijst(ctx, 3, maxL).filter(x => x[1]);
    if (pool.length < aantal + 3) pool = [...pool, ...alleWoorden(3, maxL)];
    const kw = bouwKruiswoord(pool, aantal);
    const { geplaatst, H, B } = kw;
    const starts = [...new Set(geplaatst.map(p => p.r * 100 + p.c))].sort((a, b) => a - b);
    geplaatst.forEach(p => p.nr = starts.indexOf(p.r * 100 + p.c) + 1);
    const veld = Array.from({ length: H }, () => Array(B).fill(null));
    const cellen = [];
    geplaatst.forEach((p, wi) => {
      for (let k = 0; k < p.w.length; k++) {
        const r = p.r + (p.d ? k : 0), c = p.c + (p.d ? 0 : k);
        if (!veld[r][c]) { const i = U.letter('lcel kw'); veld[r][c] = { i, ch: p.w[k], woorden: {} }; cellen.push({ i, op: p.w[k] }); }
        veld[r][c].woorden[p.d ? 'v' : 'h'] = { wi, k };
      }
      if (n === 1) { const c0 = veld[p.r][p.c]; c0.i.value = p.w[0]; c0.i.readOnly = true; c0.i.classList.add('gegeven'); }
    });
    let richting = 'h', laatste = null;
    const celVan = (wi, k) => { const p = geplaatst[wi]; return veld[p.r + (p.d ? k : 0)][p.c + (p.d ? 0 : k)]; };
    const markeer = cel => {
      document.querySelectorAll('.kw.actief').forEach(x => x.classList.remove('actief'));
      const w = cel.woorden[richting]; if (!w) return;
      const p = geplaatst[w.wi]; for (let k = 0; k < p.w.length; k++) celVan(w.wi, k).i.classList.add('actief');
    };
    const rooster = U.el('div', { class: 'kw-rooster', style: `grid-template-columns: repeat(${B}, var(--cel))` });
    for (let r = 0; r < H; r++) for (let c = 0; c < B; c++) {
      const cel = veld[r][c];
      if (!cel) { rooster.append(U.el('div', { class: 'kw-leeg' })); continue; }
      const nr = geplaatst.find(p => p.r === r && p.c === c)?.nr;
      rooster.append(U.el('div', { class: 'kw-cel' }, nr ? U.el('span', { class: 'kw-nr' }, String(nr)) : null, cel.i));
      cel.i.addEventListener('mousedown', () => { if (laatste === cel && cel.woorden.h && cel.woorden.v) richting = richting === 'h' ? 'v' : 'h'; else if (!cel.woorden[richting]) richting = cel.woorden.h ? 'h' : 'v'; });
      cel.i.addEventListener('focus', () => { if (!cel.woorden[richting]) richting = cel.woorden.h ? 'h' : 'v'; laatste = cel; markeer(cel); });
      const stap = delta => { const w = cel.woorden[richting]; if (!w) return; const p = geplaatst[w.wi]; const k = w.k + delta; if (k >= 0 && k < p.w.length) celVan(w.wi, k).i.focus(); };
      cel.i.addEventListener('input', () => { cel.i.value = cel.i.value.toUpperCase().replace(/[^A-Z]/g, '').slice(-1); U.mark(cel.i, ''); if (cel.i.value) stap(1); });
      cel.i.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !cel.i.value) { e.preventDefault(); stap(-1); }
        const pijl = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] }[e.key];
        if (pijl) { e.preventDefault(); richting = pijl[0] ? 'v' : 'h'; veld[r + pijl[0]]?.[c + pijl[1]]?.i.focus(); }
      });
    }
    const lijst = d => U.el('ol', { class: 'kw-lijst' }, geplaatst.filter(p => p.d === d).sort((a, b) => a.nr - b.nr).map(p =>
      U.el('li', { value: p.nr, onclick: () => { richting = d ? 'v' : 'h'; const c0 = veld[p.r][p.c]; laatste = c0; c0.i.focus(); markeer(c0); } }, `${p.o} (${p.w.length})`)));
    doos.append(U.el('div', { class: 'kw-wrap' }, U.el('div', { class: 'scroll-x' }, rooster),
      U.el('div', { class: 'kw-omschr' }, U.el('div', { class: 'label' }, 'Horizontaal →'), lijst(0), U.el('div', { class: 'label' }, 'Verticaal ↓'), lijst(1))));
    return U.invul(cellen);
  }
});

/* Spreekwoordspellen krijgen een betekenisvraag */
for (const id of ['geheimschrift', 'zinsstenen', 'gevallen']) {
  const sp = SPELLEN.find(x => x.id === id), orig = sp.maak;
  sp.maak = function (n, doos, ctx) { const inst = orig.call(this, n, doos, ctx); return metBetekenis(inst, doos, doos.dataset.zin, ctx); };
  sp.uitleg += ' Is de oplossing een spreekwoord of uitdrukking, dan kies je daarna ook de juiste betekenis.';
}
