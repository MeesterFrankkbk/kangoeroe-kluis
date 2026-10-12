'use strict';
/* ======================= REKENEN ======================= */

function rekenUit(expr, toegestaan) {
  const s = expr.replace(/\s+/g, '').replace(/[x×*]/gi, '*').replace(/[:÷/]/g, '/').replace(/[−–]/g, '-');
  const t = []; let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/\d/.test(ch)) { let j = i; while (j < s.length && /\d/.test(s[j])) j++; t.push({ n: Number(s.slice(i, j)) }); i = j; }
    else if ('+-*/()'.includes(ch)) { t.push({ o: ch }); i++; }
    else throw new Error(`Dit teken ken ik niet: ${ch}`);
  }
  let p = 0; const gebruikt = [];
  const som = () => { let v = term(); while (t[p] && (t[p].o === '+' || t[p].o === '-')) { const o = t[p++].o, w = term(); v = o === '+' ? v + w : v - w; if (v < 0) throw new Error('Een tussenuitkomst mag niet negatief zijn.'); } return v; };
  const term = () => { let v = fac(); while (t[p] && (t[p].o === '*' || t[p].o === '/')) { const o = t[p++].o, w = fac(); if (o === '*') v *= w; else { if (w === 0 || v % w) throw new Error('Delen moet opgaan (geen kommagetallen).'); v /= w; } } return v; };
  const fac = () => {
    const tk = t[p]; if (!tk) throw new Error('De bewerking is nog niet af.');
    if (tk.n !== undefined) { p++; gebruikt.push(tk.n); return tk.n; }
    if (tk.o === '(') { p++; const v = som(); if (!t[p] || t[p].o !== ')') throw new Error('Er ontbreekt een haakje.'); p++; return v; }
    throw new Error('Kijk je tekens en haakjes nog eens na.');
  };
  const v = som(); if (p < t.length) throw new Error('Kijk je tekens en haakjes nog eens na.');
  const pool = [...toegestaan];
  for (const g of gebruikt) { const k = pool.indexOf(g); if (k < 0) throw new Error(`Het getal ${g} mag je niet (zo vaak) gebruiken.`); pool.splice(k, 1); }
  return v;
}

/* Rekent met voorrangsregels: eerst × en :, dan + en − */
function rekenTekens(getallen, tekens) {
  const a = [getallen[0]], o = [];
  for (let k = 0; k < tekens.length; k++) {
    const t = tekens[k], g = getallen[k + 1];
    if (t === '×') a[a.length - 1] *= g;
    else if (t === ':') { if (g === 0 || a[a.length - 1] % g) return NaN; a[a.length - 1] /= g; }
    else { o.push(t); a.push(g); }
  }
  let r = a[0]; o.forEach((t, k) => r = t === '+' ? r + a[k + 1] : r - a[k + 1]); return r;
}

/* ---------------- Rekenpiramide ---------------- */
SPELLEN.push({
  id: 'piramide', naam: 'Rekenpiramide', vak: 'rekenen', icoon: '🔺',
  kort: 'Elk blok is de som van de twee eronder.',
  uitleg: 'Elk blok is de som van de twee blokken eronder. Vul alle lege blokken in. Soms moet je dus ook aftrekken!',
  maak(n, doos) {
    const R = [0, 4, 5, 5, 6, 7][n], max = [0, 9, 20, 50, 60, 35][n];
    const v = [Array.from({ length: R }, () => U.r(1, max))];
    for (let k = 1; k < R; k++) { v[k] = []; for (let c = 0; c < R - k; c++) v[k][c] = v[k - 1][c] + v[k - 1][c + 1]; }
    const alle = []; for (let k = 0; k < R; k++) for (let c = 0; c < R - k; c++) alle.push(k + ',' + c);
    const getoond = new Set(alle);
    const oplosbaar = () => {
      const kn = new Set(getoond); let ch = true;
      while (ch) {
        ch = false;
        for (let k = 1; k < R; k++) for (let c = 0; c < R - k; c++) {
          const t = [(k - 1) + ',' + c, (k - 1) + ',' + (c + 1), k + ',' + c];
          if (t.filter(x => kn.has(x)).length === 2) { t.forEach(x => kn.add(x)); ch = true; }
        }
      }
      return kn.size === alle.length;
    };
    const doel = Math.round(alle.length * [0, 0.5, 0.65, 1, 1, 1][n]);
    let verborgen = 0;
    for (const key of U.shuffle(alle)) {
      if (verborgen >= doel) break;
      getoond.delete(key); if (oplosbaar()) verborgen++; else getoond.add(key);
    }
    const wrap = U.el('div', { class: 'piramide' }), cellen = [];
    for (let k = R - 1; k >= 0; k--) {
      const rij = U.el('div', { class: 'pir-rij' });
      for (let c = 0; c < R - k; c++) {
        if (getoond.has(k + ',' + c)) rij.append(U.el('div', { class: 'pir-blok gegeven' }, String(v[k][c])));
        else { const i = U.getal('pir-blok'); rij.append(i); cellen.push({ i, op: v[k][c] }); }
      }
      wrap.append(rij);
    }
    doos.append(wrap);
    return U.invul(cellen);
  }
});

/* ---------------- Doelgetal ---------------- */
SPELLEN.push({
  id: 'doelgetal', naam: 'Doelgetal', vak: 'rekenen', icoon: '🎯',
  kort: 'Maak het doelgetal met de gegeven getallen.',
  uitleg: 'Maak het doelgetal met de gegeven getallen. Je mag + − × : en haakjes gebruiken. Elk getal hoogstens één keer. Je hoeft niet alle getallen te gebruiken. Delen moet opgaan.',
  maak(n, doos) {
    const aantal = [0, 4, 5, 6, 6, 6][n], stappen = [0, 2, 3, 3, 4, 5][n];
    const [lo, hi] = [[0, 0], [10, 60], [40, 300], [100, 600], [100, 999], [300, 999]][n];
    let getallen, doel, opl;
    for (let poging = 0; poging < 4000; poging++) {
      getallen = Array.from({ length: aantal }, (_, k) => n > 1 && k === 0 ? U.pick([25, 50, 75, 100]) : U.r(1, 10));
      let pool = U.shuffle(getallen).slice(0, stappen + 1).map(x => ({ v: x, e: String(x) })), ok = true;
      while (pool.length > 1) {
        const a = pool.shift(), b = pool.shift(); let res = null;
        for (const o of U.shuffle(['+', '-', '*', '/'])) {
          if (o === '+') res = { v: a.v + b.v, e: `(${a.e} + ${b.e})` };
          if (o === '-' && a.v !== b.v) res = a.v > b.v ? { v: a.v - b.v, e: `(${a.e} − ${b.e})` } : { v: b.v - a.v, e: `(${b.e} − ${a.e})` };
          if (o === '*' && a.v > 1 && b.v > 1) res = { v: a.v * b.v, e: `(${a.e} × ${b.e})` };
          if (o === '/' && b.v > 1 && a.v % b.v === 0) res = { v: a.v / b.v, e: `(${a.e} : ${b.e})` };
          if (res) break;
        }
        if (!res) { ok = false; break; }
        pool.push(res); pool = U.shuffle(pool);
      }
      if (!ok) continue;
      if (pool[0].v >= lo && pool[0].v <= hi && !getallen.includes(pool[0].v)) { doel = pool[0].v; opl = pool[0].e.replace(/^\((.*)\)$/, '$1'); break; }
    }
    if (doel === undefined) { getallen = [3, 6, 5, 4]; doel = 45; opl = '(3 + 6) × 5'; }
    const inp = U.tekst('tekst groot', 'bv. (8 + 2) × 5');
    const voeg = s => { inp.value += s; inp.focus(); };
    doos.append(
      U.el('div', { class: 'doel' }, U.el('small', {}, 'Doelgetal'), String(doel)),
      U.el('div', { class: 'knoppenrij' }, getallen.map(g => U.el('button', { class: 'tegel groot', onclick: () => voeg(` ${g} `) }, String(g)))),
      U.el('div', { class: 'knoppenrij' }, ['+', '−', '×', ':', '(', ')'].map(o => U.el('button', { class: 'tegel op', onclick: () => voeg(` ${o} `) }, o)),
        U.el('button', { class: 'tegel op', onclick: () => { inp.value = ''; inp.focus(); } }, 'wis')),
      inp);
    let hints = 0;
    return {
      controleer() {
        if (!inp.value.trim()) return { ok: false, msg: 'Schrijf eerst een bewerking.' };
        try {
          const v = rekenUit(inp.value, getallen);
          const ok = v === doel; U.mark(inp, ok ? 'goed' : 'fout');
          return ok ? { ok } : { ok, msg: `Jouw bewerking geeft ${v}. Dat is nog niet ${doel}.` };
        } catch (e) { U.mark(inp, 'fout'); return { ok: false, msg: e.message }; }
      },
      hint() {
        hints++;
        if (hints === 1) return `Het kan met ${(opl.match(/\d+/g) || []).length} getallen.`;
        const binnen = opl.match(/\(\d+ [^()]+ \d+\)/);
        if (hints === 2 && binnen) return `Begin bijvoorbeeld met ${binnen[0]}.`;
        inp.value = opl.replace(/−/g, '-'); U.mark(inp, 'hint');
        return `Een mogelijke oplossing staat nu in het vak.`;
      }
    };
  }
});

/* ---------------- Verdwenen tekens ---------------- */
SPELLEN.push({
  id: 'tekens', naam: 'Verdwenen tekens', vak: 'rekenen', icoon: '❓',
  kort: 'Welke rekentekens zijn verdwenen?',
  uitleg: 'De rekentekens zijn verdwenen! Kies telkens + − × of : zodat de som klopt. Let op: eerst × en :, daarna + en −.',
  maak(n, doos) {
    const opties = n === 1 ? ['+', '−'] : ['+', '−', '×', ':'];
    const lengte = [0, 3, 3, 4, 5, 5][n], max = [0, 20, 12, 12, 12, 25][n];
    const sommen = [];
    while (sommen.length < (n === 1 ? 4 : 3)) {
      const g = Array.from({ length: lengte }, () => U.r(1, max));
      const t = Array.from({ length: lengte - 1 }, () => U.pick(opties));
      if (n > 1 && !t.some(x => x === '×' || x === ':')) continue;
      const r = rekenTekens(g, t);
      if (!Number.isInteger(r) || r < 0 || r > (n === 5 ? 600 : 200)) continue;
      sommen.push({ g, t, r });
    }
    const rijen = sommen.map(s => {
      const sels = s.t.map(() => U.el('select', { class: 'teken' }, U.el('option', { value: '' }, '?'), opties.map(o => U.el('option', { value: o }, o))));
      const el = U.el('div', { class: 'tekens-rij' });
      s.g.forEach((g, k) => { el.append(U.el('span', { class: 'getal' }, String(g))); if (sels[k]) el.append(sels[k]); });
      el.append(U.el('span', { class: 'is' }, '='), U.el('span', { class: 'getal uitkomst' }, String(s.r)));
      doos.append(el); return { s, sels, el };
    });
    return {
      controleer() {
        let fout = 0, leeg = 0;
        for (const r of rijen) {
          if (r.sels.some(x => !x.value)) { leeg++; r.el.classList.remove('goed', 'fout'); continue; }
          const ok = rekenTekens(r.s.g, r.sels.map(x => x.value)) === r.s.r;
          r.el.classList.toggle('goed', ok); r.el.classList.toggle('fout', !ok); if (!ok) fout++;
        }
        if (fout) return { ok: false, msg: `${fout} ${fout === 1 ? 'som klopt' : 'sommen kloppen'} nog niet.` };
        if (leeg) return { ok: false, msg: 'Vul alle tekens in.' };
        return { ok: true };
      },
      hint() {
        const r = rijen.find(r => r.sels.some(x => !x.value) || rekenTekens(r.s.g, r.sels.map(x => x.value)) !== r.s.r);
        if (!r) return 'Alles klopt al!';
        const k = r.sels.findIndex((x, k) => x.value !== r.s.t[k]);
        r.sels[k].value = r.s.t[k]; r.sels[k].classList.add('hint'); r.sels[k].disabled = true;
        return 'Er is één teken voor je gekozen (paars).';
      }
    };
  }
});

/* ---------------- Kraak de kluis ---------------- */
SPELLEN.push({
  id: 'kluis', naam: 'Kraak de kluis', vak: 'rekenen', icoon: '🔐',
  kort: 'Druk de juiste knoppen in om de kluis te openen.',
  uitleg: 'Druk op precies het juiste aantal knoppen zodat de som van die getallen het codegetal is. Op diamant moet het PRODUCT (×) kloppen!',
  maak(n, doos) {
    const k = [0, 3, 4, 4, 5, 3][n], totaalKnoppen = n === 4 ? 12 : 10, schaal = n === 3 || n === 4 ? 10 : 1;
    const product = n === 5;
    let gekozen, doel, rest = [];
    const maak = (lo, hi, filt = () => true) => { let x; do { x = U.r(lo, hi); } while (!filt(x)); return x; };
    if (n === 1) { gekozen = Array.from({ length: k }, () => U.r(5, 40)); doel = gekozen.reduce((a, b) => a + b); }
    else if (n === 2) { do { gekozen = Array.from({ length: k - 1 }, () => U.r(8, 45)); gekozen.push(100 - gekozen.reduce((a, b) => a + b)); } while (gekozen[k - 1] < 5 || gekozen[k - 1] > 60); doel = 100; }
    else if (n === 3 || n === 4) { const som = n === 3 ? 100 : 200; do { gekozen = Array.from({ length: k - 1 }, () => maak(3, 60, x => x % 10)); gekozen.push(som - gekozen.reduce((a, b) => a + b)); } while (gekozen[k - 1] < 3 || gekozen[k - 1] > 70 || gekozen[k - 1] % 10 === 0); doel = som; }
    else { gekozen = Array.from({ length: k }, () => U.r(2, 15)); doel = gekozen.reduce((a, b) => a * b); }
    const som = arr => product ? arr.reduce((a, b) => a * b, 1) : arr.reduce((a, b) => a + b, 0);
    while (rest.length < totaalKnoppen - k) {
      const x = n === 1 ? U.r(5, 40) : n === 2 ? U.r(5, 60) : n <= 4 ? maak(3, 70, x => x % 10) : U.r(2, 15);
      rest.push(x);
    }
    const knoppen = U.shuffle([...gekozen.map(v => ({ v, juist: true })), ...rest.map(v => ({ v }))]);
    const toon = v => schaal === 10 ? U.komma(v / 10) : String(v);
    const display = U.el('div', { class: 'kluis-display' });
    const paneel = U.el('div', { class: 'kluis-paneel', style: `grid-template-columns: repeat(${totaalKnoppen === 12 ? 6 : 5}, 1fr)` });
    const update = () => { const sel = knoppen.filter(b => b.aan); display.replaceChildren(U.el('span', {}, `Code: ${toon(doel)}`), U.el('span', { class: 'klein' }, `${sel.length} van ${k} knoppen · ${product ? 'product' : 'som'}`)); };
    knoppen.forEach(b => { b.el = U.el('button', { class: 'kluis-knop', onclick: () => { if (b.vast) return; b.aan = !b.aan; b.el.classList.toggle('aan', b.aan); update(); } }, toon(b.v)); paneel.append(b.el); });
    update();
    doos.append(U.el('div', { class: 'kluis-kast' }, display, paneel));
    return {
      controleer() {
        const sel = knoppen.filter(b => b.aan);
        if (sel.length !== k) return { ok: false, msg: `Je moet precies ${k} knoppen indrukken.` };
        const s = som(sel.map(b => b.v));
        return s === doel ? { ok: true } : { ok: false, msg: `Jouw knoppen geven samen ${toon(s)}. De kluis blijft dicht…` };
      },
      hint() {
        knoppen.filter(b => b.aan && !b.vast).forEach(b => { b.aan = false; b.el.classList.remove('aan'); });
        const b = knoppen.find(b => b.juist && !b.vast);
        if (!b) return 'Alle juiste knoppen zijn al aangeduid.';
        b.aan = b.vast = true; b.el.classList.add('aan', 'hint'); update();
        return 'Eén juiste knop is vastgezet (paars).';
      }
    };
  }
});

/* ---------------- Rekendriehoek ---------------- */
SPELLEN.push({
  id: 'arithmagon', naam: 'Rekendriehoek', vak: 'rekenen', icoon: '🔻',
  kort: 'Welke getallen horen in de hoeken?',
  uitleg: 'Op elke lijn staat de uitkomst van de twee hoekgetallen. Welke getallen horen in de hoeken?',
  maak(n, doos) {
    const product = n >= 4, deci = n === 3;
    const h = product ? Array.from({ length: 3 }, () => U.r(2, n === 4 ? 12 : 25)) : Array.from({ length: 3 }, () => deci ? U.r(5, 99) : U.r(1, n === 1 ? 20 : 60));
    const f = (a, b) => product ? a * b : a + b;
    const zijden = [f(h[0], h[1]), f(h[1], h[2]), f(h[2], h[0])];
    const toon = v => deci ? U.komma(v / 10) : String(v);
    const pos = [[150, 30], [40, 220], [260, 220]];
    const box = U.el('div', { class: 'driehoek', html: `<svg viewBox="0 0 300 250" aria-hidden="true"><polygon points="150,30 40,220 260,220" /></svg>` });
    const cellen = [];
    const gegevenHoek = n === 1 ? U.r(0, 2) : -1;
    h.forEach((v, k) => {
      const [x, y] = pos[k];
      if (k === gegevenHoek) box.append(U.el('div', { class: 'hoek gegeven', style: `left:${x}px;top:${y}px` }, toon(v)));
      else { const i = U.getal('hoek'); i.style.cssText = `left:${x}px;top:${y}px`; box.append(i); cellen.push({ i, op: deci ? v / 10 : v }); }
    });
    [[0, 1], [1, 2], [2, 0]].forEach(([a, b], k) => box.append(U.el('div', { class: 'zijde', style: `left:${(pos[a][0] + pos[b][0]) / 2}px;top:${(pos[a][1] + pos[b][1]) / 2}px` }, toon(zijden[k]))));
    doos.append(U.el('p', { class: 'opdracht' }, product ? 'Het getal op een lijn is het PRODUCT (×) van de twee hoeken.' : `Het getal op een lijn is de SOM (+) van de twee hoeken.${deci ? ' Let op: kommagetallen!' : ''}`), box);
    return U.invul(cellen);
  }
});

/* ---------------- Getallenreeksen ---------------- */
function maakReeks(n) {
  const gen = {
    1: [
      () => { const a = U.r(1, 40), d = U.r(2, 12); return { t: [...Array(8)].map((_, k) => a + d * k), regel: `Telkens +${d}.` }; },
      () => { const d = U.r(2, 9), a = d * 8 + U.r(5, 60); return { t: [...Array(8)].map((_, k) => a - d * k), regel: `Telkens −${d}.` }; },
    ],
    2: [
      () => { const q = U.pick([2, 3]), a = U.r(1, q === 2 ? 6 : 3); return { t: [...Array(8)].map((_, k) => a * q ** k), regel: `Telkens ×${q}.` }; },
      () => { const a = U.r(5, 12), b = U.r(2, a - 1), s = U.r(1, 20); return { t: [...Array(8)].map((_, k) => s + Math.ceil(k / 2) * a - Math.floor(k / 2) * b), regel: `Afwisselend +${a} en −${b}.` }; },
      () => { const a = U.r(10, 99), d = U.pick([15, 25, 19, 21, 50, 35, 45]); return { t: [...Array(8)].map((_, k) => a + d * k), regel: `Telkens +${d}.` }; },
    ],
    3: [
      () => { const a = U.r(1, 20), d = U.r(1, 5), s = U.r(1, 3); return { t: [...Array(8)].map((_, k) => a + d * k + s * k * (k - 1) / 2), regel: `Het verschil wordt telkens ${s} groter.` }; },
      () => { const o = U.r(1, 5); return { t: [...Array(8)].map((_, k) => (k + o) ** 2), regel: 'Kwadraten: elk getal is een getal maal zichzelf (1×1, 2×2, 3×3 …).' }; },
      () => { const c = U.r(1, 5), t = [U.r(1, 5)]; for (let k = 1; k < 8; k++) t.push(k % 2 ? t[k - 1] * 2 : t[k - 1] + c); return { t, regel: `Afwisselend ×2 en +${c}.` }; },
      () => { const a = U.r(100, 300), d = U.r(3, 9); return { t: [...Array(8)].map((_, k) => a - d * k * (k + 1) / 2), regel: `Je trekt telkens ${d} meer af: −${d}, −${2 * d}, −${3 * d} …` }; },
    ],
    4: [
      () => { const a = U.r(1, 20), b = U.r(50, 90), d1 = U.r(2, 7), d2 = U.r(2, 7); return { t: [...Array(8)].map((_, k) => k % 2 ? b - d2 * ((k - 1) / 2) : a + d1 * (k / 2)), regel: `Twee reeksen door elkaar: de ene doet +${d1}, de andere −${d2}.` }; },
      () => { const t = [U.r(1, 5), U.r(2, 7)]; for (let k = 2; k < 8; k++) t.push(t[k - 1] + t[k - 2]); return { t, regel: 'Elk getal is de som van de twee vorige getallen.' }; },
      () => { const p = U.pick([1, -1]), t = [U.r(2, 6)]; for (let k = 1; k < 8; k++) t.push(t[k - 1] * 2 + p); return { t, regel: `Telkens ×2 en dan ${p > 0 ? '+1' : '−1'}.` }; },
      () => { const c = U.r(1, 9); return { t: [...Array(8)].map((_, k) => (k + 1) ** 2 + c), regel: `Kwadraten plus ${c}: 1×1+${c}, 2×2+${c}, 3×3+${c} …` }; },
    ],
    5: [
      () => ({ t: [...Array(8)].map((_, k) => (k + 1) ** 3), regel: 'Derdemachten: 1×1×1, 2×2×2, 3×3×3 …' }),
      () => { const P = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71], o = U.r(0, 10); return { t: P.slice(o, o + 8), regel: 'Priemgetallen: getallen die enkel deelbaar zijn door 1 en zichzelf.' }; },
      () => { const a = U.r(1, 20), d = U.r(1, 3); return { t: [...Array(8)].map((_, k) => a + d * (2 ** k - 1)), regel: `Het verschil verdubbelt telkens: +${d}, +${2 * d}, +${4 * d} …` }; },
      () => { const t = [U.r(2, 5)]; for (let k = 1; k < 8; k++) t.push(t[k - 1] * 3 - 2); return { t, regel: 'Telkens ×3 en dan −2.' }; },
      () => { const a = U.r(2, 6), b = U.r(1, 4), t = [U.r(1, 10)]; for (let k = 1; k < 8; k++) t.push([x => x + a, x => x * 2, x => x - b][(k - 1) % 3](t[k - 1])); return { t, regel: `Een cyclus van drie stappen: +${a}, ×2, −${b}.` }; },
      () => { const a = U.pick([5, 10, 15, 20, 25, 30]) * 32; return { t: [...Array(8)].map((_, k) => a / 2 ** k), regel: 'Telkens gedeeld door 2 (je komt bij kommagetallen uit).' }; },
    ],
  };
  for (let p = 0; p < 50; p++) { const r = U.pick(gen[n])(); if (r.t.every(x => Math.abs(x) < 100000 && Math.round(x * 1000) === x * 1000)) return r; }
  return gen[1][0]();
}

SPELLEN.push({
  id: 'reeksen', naam: 'Getallenreeksen', vak: 'rekenen', icoon: '📈',
  kort: 'Ontdek de regel en zet de reeks verder.',
  uitleg: 'Elke reeks volgt een geheime regel. Ontdek de regel en vul de volgende twee getallen in.',
  maak(n, doos) {
    const reeksen = Array.from({ length: n <= 2 ? 4 : 3 }, () => maakReeks(n)), cellen = [];
    const uit = reeksen.map(r => {
      const a = U.getal('cel breed'), b = U.getal('cel breed');
      cellen.push({ i: a, op: r.t[6] }, { i: b, op: r.t[7] });
      const regel = U.el('div', { class: 'regel' });
      doos.append(U.el('div', { class: 'reeks' }, U.el('div', { class: 'reeks-getallen' }, r.t.slice(0, 6).map(x => U.el('span', { class: 'rg' }, U.komma(x))), a, b), regel));
      return { r, regel };
    });
    const inv = U.invul(cellen);
    return {
      controleer: inv.controleer,
      hint() {
        const x = uit.find(u => !u.regel.textContent);
        if (x) { x.regel.textContent = '💡 ' + x.r.regel; return 'Onder een reeks staat nu de regel.'; }
        return inv.hint();
      }
    };
  }
});

/* ---------------- Romeinse cijfers ---------------- */
const romein = n => { let s = ''; for (const [v, r] of [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]) while (n >= v) { s += r; n -= v; } return s; };
SPELLEN.push({
  id: 'romeins', naam: 'Romeinse cijfers', vak: 'rekenen', icoon: '🏛️',
  kort: 'Lees, schrijf en reken als een Romein.',
  uitleg: 'Zet Romeinse cijfers om naar gewone getallen en omgekeerd. Op diamant reken je zelfs met Romeinse cijfers!',
  maak(n, doos) {
    const max = [0, 50, 100, 1000, 3999, 2000][n];
    const opg = [];
    if (n < 5) {
      for (let k = 0; k < 6; k++) {
        let x = U.r(1, max); if (n === 4 && k < 2) x = U.r(1000, 2030);
        const naarGetal = n === 1 || k % 2 === 0;
        opg.push(naarGetal ? { v: romein(x), op: x } : { v: String(x), op: romein(x) });
      }
    } else {
      for (let k = 0; k < 5; k++) {
        const t = U.pick(['+', '−', '×']);
        let a = U.r(10, 900), b = U.r(5, 500);
        if (t === '−' && b > a) [a, b] = [b, a];
        if (t === '×') { a = U.r(5, 60); b = U.r(2, 12); }
        const r = t === '+' ? a + b : t === '−' ? a - b : a * b;
        opg.push({ v: `${romein(a)} ${t} ${romein(b)}`, op: romein(r) });
      }
    }
    if (n <= 3) doos.append(U.el('div', { class: 'legenda' }, [['I', 1], ['V', 5], ['X', 10], ['L', 50], ['C', 100], ['D', 500], ['M', 1000]].map(([r, v]) => U.el('span', {}, U.el('b', {}, r), ' = ' + v))));
    const cellen = [];
    for (const o of opg) {
      const i = U.tekst('tekst kort', typeof o.op === 'number' ? 'getal' : 'Romeins');
      if (typeof o.op !== 'number') i.addEventListener('input', () => i.value = i.value.toUpperCase());
      cellen.push({ i, op: o.op });
      doos.append(U.el('div', { class: 'rom-rij' }, U.el('span', { class: 'rom-v' }, o.v), U.el('span', { class: 'is' }, '='), i));
    }
    return U.invul(cellen);
  }
});

/* ---------------- Kruisbewerking ---------------- */
SPELLEN.push({
  id: 'kruisbewerking', naam: 'Kruisbewerking', vak: 'rekenen', icoon: '✖️',
  kort: 'Rekenraadsel in rijen en kolommen.',
  uitleg: 'Plaats elk getal precies één keer zodat alle bewerkingen kloppen, horizontaal én verticaal. Eerst × en :, daarna + en −.',
  maak(n, doos) {
    const N = n === 5 ? 4 : 3, M = N * N;
    const ops = n === 1 ? ['+', '−'] : n === 2 ? ['+', '−', '×'] : ['+', '−', '×', ':'];
    const v = U.shuffle([...Array(M)].map((_, k) => k + 1));
    const combos = [[]];
    for (let k = 0; k < N - 1; k++) combos.splice(0, combos.length, ...combos.flatMap(c => ops.map(o => [...c, o])));
    const kiesOps = getallen => {
      const geldig = combos.map(c => ({ c, r: rekenTekens(getallen, c) })).filter(x => Number.isInteger(x.r) && x.r >= 0 && x.r <= 999);
      const pittig = geldig.filter(x => x.c.some(o => o !== '+') && new Set(x.c).size > 1);
      return U.pick(pittig.length ? pittig : geldig);
    };
    const rijen = [...Array(N)].map((_, r) => kiesOps(v.slice(r * N, r * N + N)));
    const kols = [...Array(N)].map((_, c) => kiesOps([...Array(N)].map((_, r) => v[r * N + c])));
    const hOps = rijen.map(x => x.c), hRes = rijen.map(x => x.r), vOps = kols.map(x => x.c), vRes = kols.map(x => x.r);
    const gegeven = new Set(U.shuffle([...Array(M).keys()]).slice(0, [0, 3, 2, 1, 0, 4][n]));
    const inputs = [];
    const rooster = U.el('div', { class: 'kb-rooster', style: `grid-template-columns: repeat(${2 * N + 1}, auto)` });
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const k = r * N + c;
        if (gegeven.has(k)) { rooster.append(U.el('div', { class: 'kb-cel gegeven' }, String(v[k]))); inputs.push(null); }
        else { const i = U.getal('kb-cel'); rooster.append(i); inputs.push(i); }
        rooster.append(U.el('div', { class: 'kb-op' }, c < N - 1 ? hOps[r][c] : '='));
      }
      rooster.append(U.el('div', { class: 'kb-res' }, String(hRes[r])));
      if (r < N - 1) { for (let c = 0; c < N; c++) rooster.append(U.el('div', { class: 'kb-op' }, vOps[c][r]), U.el('div')); rooster.append(U.el('div')); }
    }
    for (let c = 0; c < N; c++) rooster.append(U.el('div', { class: 'kb-op' }, '='), U.el('div')); rooster.append(U.el('div'));
    for (let c = 0; c < N; c++) rooster.append(U.el('div', { class: 'kb-res' }, String(vRes[c])), U.el('div')); rooster.append(U.el('div'));
    doos.append(U.el('p', { class: 'opdracht' }, `Gebruik de getallen 1 tot en met ${M}, elk één keer.`), rooster);
    const w = k => inputs[k] ? U.leesGetal(inputs[k].value) : v[k];
    return {
      controleer() {
        const alle = [...Array(M).keys()].map(w);
        if (alle.includes(null)) return { ok: false, msg: 'Vul eerst alle vakjes in.' };
        if (new Set(alle).size !== M || alle.some(x => x < 1 || x > M)) return { ok: false, msg: `Gebruik elk getal van 1 tot ${M} precies één keer.` };
        let fout = 0;
        for (let r = 0; r < N; r++) if (rekenTekens([...Array(N)].map((_, c) => w(r * N + c)), hOps[r]) !== hRes[r]) fout++;
        for (let c = 0; c < N; c++) if (rekenTekens([...Array(N)].map((_, r) => w(r * N + c)), vOps[c]) !== vRes[c]) fout++;
        return fout ? { ok: false, msg: `${fout} ${fout === 1 ? 'bewerking klopt' : 'bewerkingen kloppen'} nog niet.` } : { ok: true };
      },
      hint() {
        const kand = inputs.map((i, k) => ({ i, k })).filter(x => x.i && U.leesGetal(x.i.value) !== v[x.k]);
        if (!kand.length) return 'Alles staat er al!';
        const x = U.pick(kand); x.i.value = v[x.k]; x.i.readOnly = true; U.mark(x.i, 'hint');
        return 'Eén vakje is ingevuld (paars).';
      }
    };
  }
});

/* ---------------- Breuk, kommagetal, procent ---------------- */
function leesBreuk(s) {
  const t = String(s).trim().replace(/\s+/g, ' ');
  let m = t.match(/^(\d+) (\d+)\/(\d+)$/); if (m) return { t: +m[1] * +m[3] + +m[2], n: +m[3], gemengd: true };
  m = t.match(/^(\d+)\s*\/\s*(\d+)$/); if (m) return { t: +m[1], n: +m[2] };
  m = t.match(/^\d+$/); if (m) return { t: +t, n: 1 };
  return null;
}
SPELLEN.push({
  id: 'breuken', naam: 'Breuk · komma · procent', vak: 'rekenen', icoon: '½',
  kort: 'Eén getal, drie schrijfwijzen.',
  uitleg: 'Eén getal kun je schrijven als breuk, als kommagetal en als procent. Vul de ontbrekende vakjes in. Een breuk typ je zo: 3/4. Een gemengd getal zo: 1 3/4.',
  maak(n, doos) {
    const noemers = [[], [2, 4, 10], [2, 4, 5, 10, 20, 100], [4, 5, 8, 20, 25, 50], [4, 5, 8, 10, 20, 25, 40], [2, 4, 5, 8, 20, 25, 40]][n];
    const rijen = [];
    const gezien = new Set();
    while (rijen.length < 5) {
      const q = U.pick(noemers);
      let p = U.r(1, n >= 4 ? q * 2 : q - 1);
      if (n === 5 && Math.random() < 0.6) p = q * U.r(1, 3) + U.r(1, q - 1);
      const g = U.ggd(p, q); const ps = p / g, qs = q / g;
      if (qs === 1 || gezien.has(ps + '/' + qs)) continue; gezien.add(ps + '/' + qs);
      const k = n === 4 ? U.r(2, 4) : 1;
      rijen.push({ p: ps, q: qs, toonP: ps * k, toonQ: qs * k, waarde: ps / qs, gegeven: U.pick(['b', 'k', 'p']) });
    }
    if (n >= 4) doos.append(U.el('p', { class: 'opdracht' }, 'Schrijf breuken altijd zo eenvoudig mogelijk (vereenvoudigd).'));
    const tabel = U.el('div', { class: 'bkp' }, U.el('div', { class: 'bkp-kop' }, 'Breuk'), U.el('div', { class: 'bkp-kop' }, 'Kommagetal'), U.el('div', { class: 'bkp-kop' }, 'Procent'));
    const vakken = [];
    const breukTekst = r => r.p > r.q && n === 5 ? `${Math.floor(r.p / r.q)} ${r.p % r.q}/${r.q}` : `${r.p}/${r.q}`;
    for (const r of rijen) {
      for (const soort of ['b', 'k', 'p']) {
        if (soort === r.gegeven) { tabel.append(U.el('div', { class: 'bkp-gegeven' }, soort === 'b' ? (n === 4 ? `${r.toonP}/${r.toonQ}` : breukTekst(r)) : soort === 'k' ? U.komma(r.waarde) : U.komma(r.waarde * 100) + ' %')); continue; }
        const i = U.tekst('tekst kort', soort === 'b' ? 'a/b' : soort === 'k' ? '0,…' : '%');
        vakken.push({ i, soort, r }); tabel.append(U.el('div', {}, i));
      }
    }
    doos.append(tabel);
    const juist = v => {
      const val = v.i.value.trim(); if (!val) return null;
      if (v.soort === 'k') { const x = U.leesGetal(val); return x !== null && Math.abs(x - v.r.waarde) < 1e-9; }
      if (v.soort === 'p') { const x = U.leesGetal(val); return x !== null && Math.abs(x - v.r.waarde * 100) < 1e-7; }
      const b = leesBreuk(val); if (!b || !b.n) return false;
      if (Math.abs(b.t / b.n - v.r.waarde) > 1e-9) return false;
      if (n >= 4 && U.ggd(b.t, b.n) !== 1) return false;
      return true;
    };
    return {
      controleer() {
        let fout = 0, leeg = 0;
        for (const v of vakken) { const j = juist(v); if (j === null) { leeg++; U.mark(v.i, ''); } else { if (!v.i.readOnly) U.mark(v.i, j ? 'goed' : 'fout'); if (!j) fout++; } }
        const r = U.uitslag(fout, leeg);
        if (!r.ok && fout && n >= 4) r.msg += ' Denk eraan: breuken vereenvoudigen.';
        return r;
      },
      hint() {
        const v = U.pick(vakken.filter(v => !juist(v)));
        if (!v) return 'Alles staat juist!';
        v.i.value = v.soort === 'k' ? U.komma(v.r.waarde) : v.soort === 'p' ? U.komma(v.r.waarde * 100) : breukTekst(v.r);
        v.i.readOnly = true; U.mark(v.i, 'hint'); return 'Eén vakje is ingevuld (paars).';
      }
    };
  }
});

/* ---------------- Getalspeurder ---------------- */
function maakRaadsel(n) {
  const [lo, hi, venster] = [[0, 0, 0], [10, 99, 30], [10, 99, 50], [100, 999, 150], [100, 999, 400], [100, 9999, 1500]][n];
  const cijfers = x => String(x).split('').map(Number);
  const isPriem = x => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
  const delers = x => { let t = 0; for (let d = 1; d <= x; d++) if (x % d === 0) t++; return t; };
  const isKwadraat = x => Number.isInteger(Math.sqrt(x));
  for (let poging = 0; poging < 200; poging++) {
    const N = U.r(lo, hi);
    const a = Math.max(lo - 1, N - U.r(1, venster - 1)), b = a + venster;
    let kand = []; for (let x = a + 1; x < b; x++) kand.push(x);
    const tips = [`Ik ben groter dan ${a} en kleiner dan ${b}.`];
    const pool = [
      () => N % 2 ? ['Ik ben oneven.', x => x % 2 === 1] : ['Ik ben even.', x => x % 2 === 0],
      () => { const k = U.pick(n <= 1 ? [3, 4, 5, 6, 9, 10] : [3, 4, 6, 7, 8, 9, 11, 12]); return N % k === 0 ? [`Ik zit in de tafel van ${k}.`, x => x % k === 0] : [`Ik ben niet deelbaar door ${k}.`, x => x % k !== 0]; },
      () => { const s = cijfers(N).reduce((p, q) => p + q); return [`De som van mijn cijfers is ${s}.`, x => cijfers(x).reduce((p, q) => p + q) === s]; },
      () => { const d = N % 10; return [`Mijn laatste cijfer is ${d}.`, x => x % 10 === d]; },
      () => { const c = cijfers(N); return c[c.length - 2] > c[c.length - 1] ? ['Mijn tientallen zijn groter dan mijn eenheden.', x => { const y = cijfers(x); return y[y.length - 2] > y[y.length - 1]; }] : ['Mijn tientallen zijn niet groter dan mijn eenheden.', x => { const y = cijfers(x); return !(y[y.length - 2] > y[y.length - 1]); }]; },
      ...(n >= 3 ? [
        () => isKwadraat(N) ? ['Ik ben een kwadraatgetal.', isKwadraat] : null,
        () => { const c = cijfers(N); return new Set(c).size === c.length ? ['Al mijn cijfers zijn verschillend.', x => { const y = cijfers(x); return new Set(y).size === y.length; }] : ['Minstens twee van mijn cijfers zijn gelijk.', x => { const y = cijfers(x); return new Set(y).size < y.length; }]; },
        () => { const c = cijfers(N); return [`Mijn eerste cijfer is ${c[0]}.`, x => cijfers(x)[0] === c[0]]; },
      ] : []),
      ...(n >= 4 ? [
        () => isPriem(N) ? ['Ik ben een priemgetal.', isPriem] : ['Ik ben geen priemgetal.', x => !isPriem(x)],
        () => { const [p, q] = U.pick([[2, 3], [3, 4], [4, 6], [2, 5], [3, 5], [6, 8], [4, 10]]); return N % p === 0 && N % q === 0 ? [`Ik ben een veelvoud van ${p} én van ${q}.`, x => x % p === 0 && x % q === 0] : null; },
        () => { const r = N % 7; return [`Als je mij deelt door 7, is de rest ${r}.`, x => x % 7 === r]; },
      ] : []),
      ...(n >= 5 ? [
        () => { const d = delers(N); return [`Ik heb precies ${d} delers.`, x => delers(x) === d]; },
        () => { const p = cijfers(N).reduce((p, q) => p * q); return [`Het product van mijn cijfers is ${p}.`, x => cijfers(x).reduce((p, q) => p * q) === p]; },
      ] : []),
    ];
    let p = 0;
    while (kand.length > 1 && p++ < 40 && tips.length < 7) {
      const t = U.pick(pool)(); if (!t) continue;
      const nieuw = kand.filter(t[1]);
      if (nieuw.length < kand.length && nieuw.includes(N)) { kand = nieuw; tips.push(t[0]); }
    }
    if (kand.length === 1 && tips.length >= 3) return { N, tips: [tips[0], ...U.shuffle(tips.slice(1))] };
  }
  return { N: 42, tips: ['Ik ben groter dan 40 en kleiner dan 45.', 'Ik ben even.', 'Ik zit in de tafel van 7.'] };
}
SPELLEN.push({
  id: 'getalspeurder', naam: 'Getalspeurder', vak: 'rekenen', icoon: '🕵️‍♀️',
  kort: 'Welk getal ben ik? Lees de aanwijzingen.',
  uitleg: 'Lees alle aanwijzingen goed. Er is maar één getal dat aan alles voldoet. Welk getal is het?',
  maak(n, doos) {
    const cellen = [];
    for (let k = 0; k < (n <= 3 ? 3 : 2); k++) {
      const r = maakRaadsel(n), i = U.getal('cel breed');
      cellen.push({ i, op: r.N });
      doos.append(U.el('div', { class: 'raadsel' }, U.el('ul', {}, r.tips.map(t => U.el('li', {}, t))), U.el('div', { class: 'raadsel-in' }, 'Ik ben ', i)));
    }
    return U.invul(cellen);
  }
});

/* ---------------- Geheime route ---------------- */
SPELLEN.push({
  id: 'route', naam: 'Geheime route', vak: 'rekenen', icoon: '🗺️',
  kort: 'Vind de weg waarvan de som klopt.',
  uitleg: 'Start linksboven en eindig rechtsonder. Klik vakje per vakje een route aan. Alle getallen op je route moeten samen precies het doelgetal geven. Klik op het laatste vakje om een stap terug te zetten.',
  maak(n, doos, ctx) {
    const N = [0, 4, 5, 5, 6, 6][n], vrij = n >= 4;
    const buren = (p, alleenRO) => { const r = Math.floor(p / N), c = p % N, b = []; if (c < N - 1) b.push(p + 1); if (r < N - 1) b.push(p + N); if (!alleenRO) { if (c > 0) b.push(p - 1); if (r > 0) b.push(p - N); } return b; };
    let pad;
    if (!vrij) { pad = [0]; while (pad[pad.length - 1] !== N * N - 1) pad.push(U.pick(buren(pad[pad.length - 1], true))); }
    else {
      for (let t = 0; t < 2000; t++) {
        const p = [0], gezien = new Set([0]);
        while (p[p.length - 1] !== N * N - 1 && p.length < N * N) {
          const opties = buren(p[p.length - 1], false).filter(x => !gezien.has(x));
          if (!opties.length) break;
          const x = U.pick(opties); p.push(x); gezien.add(x);
        }
        if (p[p.length - 1] === N * N - 1 && p.length >= 2 * N + 1) { pad = p; break; }
      }
      if (!pad) { pad = [0]; while (pad[pad.length - 1] !== N * N - 1) pad.push(U.pick(buren(pad[pad.length - 1], true))); }
    }
    const waarde = () => n === 1 ? U.r(1, 9) : n === 2 ? U.r(1, 20) : n === 3 ? U.r(5, 50) : n === 4 ? U.r(1, 25) : U.pick([U.r(-9, -1), U.r(1, 25), U.r(1, 25)]);
    const V = [...Array(N * N)].map(waarde);
    const doel = pad.reduce((a, p) => a + V[p], 0);
    let route = [0];
    const knoppen = [];
    const info = U.el('div', { class: 'route-info' });
    const rooster = U.el('div', { class: 'route-rooster', style: `grid-template-columns: repeat(${N}, 3.2rem)` });
    const teken = () => {
      knoppen.forEach((b, p) => { b.className = 'route-cel' + (route.includes(p) ? ' op' : '') + (p === route[route.length - 1] ? ' kop' : '') + (p === 0 ? ' start' : '') + (p === N * N - 1 ? ' einde' : ''); });
      const s = route.reduce((a, p) => a + V[p], 0);
      info.replaceChildren(U.el('span', {}, `Doel: ${doel}`), U.el('span', { class: s === doel ? 'ok' : '' }, `Jouw som: ${s}`));
    };
    for (let p = 0; p < N * N; p++) {
      const b = U.el('button', {
        onclick: () => {
          const kop = route[route.length - 1];
          if (p === kop && route.length > 1) route.pop();
          else if (!route.includes(p) && buren(kop, !vrij).includes(p) && kop !== N * N - 1) route.push(p);
          teken();
          if (route[route.length - 1] === N * N - 1 && route.reduce((a, q) => a + V[q], 0) === doel) ctx.klaar?.();
        }
      }, String(V[p]));
      knoppen.push(b); rooster.append(b);
    }
    teken();
    doos.append(U.el('p', { class: 'opdracht' }, vrij ? 'Je mag naar rechts, links, boven en onder, maar nooit twee keer over hetzelfde vakje.' : 'Je mag enkel naar rechts of naar onder.'), info, rooster);
    return {
      controleer() {
        if (route[route.length - 1] !== N * N - 1) return { ok: false, msg: 'Je route komt nog niet aan de finish (rechtsonder).' };
        const s = route.reduce((a, p) => a + V[p], 0);
        return s === doel ? { ok: true } : { ok: false, msg: `Jouw route geeft ${s}, niet ${doel}.` };
      },
      hint() {
        let k = 0; while (k < route.length && route[k] === pad[k]) k++;
        route = pad.slice(0, Math.min(pad.length, k + 1));
        teken(); return 'Je route is een stukje juist verder gezet.';
      }
    };
  }
});

/* ---------------- Weegschaal ---------------- */
function rangVol(rijen, m) {
  const A = rijen.map(r => [...r]); let rang = 0;
  for (let c = 0; c < m && rang < A.length; c++) {
    let p = A.findIndex((r, i) => i >= rang && Math.abs(r[c]) > 1e-9); if (p < 0) continue;
    [A[rang], A[p]] = [A[p], A[rang]];
    for (let i = 0; i < A.length; i++) if (i !== rang) { const f = A[i][c] / A[rang][c]; for (let j = 0; j < m; j++) A[i][j] -= f * A[rang][j]; }
    rang++;
  }
  return rang === m;
}
SPELLEN.push({
  id: 'weegschaal', naam: 'Wikken en wegen', vak: 'rekenen', icoon: '⚖️',
  kort: 'Hoeveel weegt elke vorm?',
  uitleg: 'Alle weegschalen zijn in evenwicht. Gelijke vormen wegen evenveel. Hoeveel weegt elke vorm?',
  maak(n, doos) {
    const m = [0, 2, 3, 3, 4, 4][n], maxW = n === 5 ? 20 : 12;
    const vormen = [['▲', '#E8772E'], ['●', '#0F5257'], ['■', '#7C4DCC'], ['◆', '#C8372D']].slice(0, m);
    const W = vormen.map(() => U.r(1, maxW));
    let vgl = [];
    const telSom = t => t.reduce((a, x, i) => a + x * W[i], 0);
    if (n <= 3) {
      const volg = U.shuffle([...Array(m).keys()]);
      volg.forEach((v, k) => {
        const links = Array(m).fill(0); links[v] = U.r(1, n === 3 ? 3 : 2);
        for (let j = 0; j < k; j++) if (Math.random() < 0.7 || j === k - 1) links[volg[j]] = U.r(1, n === 3 ? 2 : 1);
        if (k === 0 && n === 1) links[v] = 1;
        vgl.push({ links, rechts: Array(m).fill(0), getal: telSom(links) });
      });
      if (n === 3) vgl = U.shuffle(vgl);
    } else {
      for (let p = 0; p < 500; p++) {
        vgl = [];
        for (let e = 0; e < m + (n === 5 ? 1 : 0); e++) {
          const links = Array(m).fill(0), rechts = Array(m).fill(0);
          const idx = U.shuffle([...Array(m).keys()]);
          if (n === 4) { idx.slice(0, U.r(2, 3)).forEach(i => links[i] = U.r(1, 2)); vgl.push({ links, rechts, getal: telSom(links) }); }
          else {
            idx.slice(0, U.r(1, 2)).forEach(i => links[i] = U.r(1, 3)); idx.slice(2, 2 + U.r(1, 2)).forEach(i => rechts[i] = U.r(1, 2));
            let verschil = telSom(links) - telSom(rechts);
            if (verschil < 0) { vgl.push({ links: rechts, rechts: links, getal: -verschil }); } else vgl.push({ links, rechts, getal: verschil });
          }
        }
        if (rangVol(vgl.map(v => v.links.map((x, i) => x - v.rechts[i])), m)) break;
      }
    }
    const kant = (t, getal) => U.el('div', { class: 'schaal' }, t.flatMap((x, i) => Array(x).fill(0).map(() => U.el('span', { class: 'vorm', style: `color:${vormen[i][1]}` }, vormen[i][0]))), getal ? U.el('span', { class: 'gewicht' }, `${getal} kg`) : null);
    doos.append(U.el('div', { class: 'schalen' }, vgl.map(v => U.el('div', { class: 'balans' }, kant(v.links, 0), U.el('span', { class: 'balans-is' }, '⚖'), kant(v.rechts, v.getal)))));
    const cellen = vormen.map(([s, k], i) => { const inp = U.getal('cel breed'); return { i: inp, op: W[i], s, k }; });
    doos.append(U.el('div', { class: 'antwoorden' }, cellen.map(c => U.el('label', { class: 'vorm-in' }, U.el('span', { class: 'vorm', style: `color:${c.k}` }, c.s), ' = ', c.i, ' kg'))));
    return U.invul(cellen);
  }
});
