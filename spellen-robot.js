'use strict';
/* =====================================================================
   PROGRAMMEREN 2: Slimme robot (voorwaarden, één programma voor meerdere doolhoven)
   en Foutenjager (een programma met fouten herstellen).
   Bouwt verder op Robotlogica (spellen-extra.js: RICHT, robotUitvoeren, maakRobotPuzzel, telRobot).
   ===================================================================== */

/* ---------- Taal van de slimme robot ----------
   tokens: F vooruit · L links · R rechts · H(n) herhaal n keer · T herhaal tot de vlag ·
           I(c) als … · X anders · E einde (sluit H, T of I af)
   voorwaarden c: V = vooruit vrij, LV = links vrij, RV = rechts vrij */
const SR_VOORW = { V: 'vooruit vrij', LV: 'links vrij', RV: 'rechts vrij' };
const SR_LABEL = { F: '▲ vooruit', L: '⟲ links', R: '⟳ rechts', H: '🔁 herhaal', T: '🔁 herhaal tot 🏁', I: '❓ als', X: '↪ anders', E: '⏹ einde', A: '🅰 functie A' };
function srParse(tokens) {
  const wortel = { b: [] }, stapel = [{ node: wortel, doel: wortel.b }];
  for (const t of tokens) {
    const top = stapel[stapel.length - 1];
    if (t.t === 'F' || t.t === 'L' || t.t === 'R' || t.t === 'A') top.doel.push({ t: t.t });
    else if (t.t === 'H' || t.t === 'T' || t.t === 'I') {
      const node = t.t === 'H' ? { t: 'H', n: t.n, b: [] } : t.t === 'T' ? { t: 'T', b: [] } : { t: 'I', c: t.c, b: [], anders: [] };
      top.doel.push(node); stapel.push({ node, doel: node.b });
    } else if (t.t === 'X') {
      if (top.node.t !== 'I' || top.doel === top.node.anders) return { fout: '"Anders" hoort bij een "als" (en maar één keer).' };
      top.doel = top.node.anders;
    } else if (t.t === 'E') {
      if (stapel.length === 1) return { fout: 'Er staat een "einde" te veel.' };
      stapel.pop();
    }
  }
  if (stapel.length > 1) return { fout: `Een "${stapel[stapel.length - 1].node.t === 'I' ? 'als' : 'herhaal'}" is nog niet afgesloten met "einde".` };
  return { prog: wortel.b };
}
const srTel = tokens => tokens.filter(t => t.t !== 'E' && t.t !== 'X').length;

/* doolhof: { N, open: Set(celnummers), start: {r,c,d}, doel: [r,c] } */
function srVoer(tokens, dh, max = 600) {
  const p = srParse(tokens); if (p.fout) return { fout: p.fout, frames: [] };
  const { N } = dh;
  let { r, c, d } = dh.start, stappen = 0, bereikt = false, fout = null;
  const spoor = [r * N + c], frames = [[r, c, d, [...spoor]]];
  const vrij = rel => { const dd = (d + rel + 4) % 4, nr = r + RICHT[dd][0], nc = c + RICHT[dd][1]; return nr >= 0 && nc >= 0 && nr < N && nc < N && dh.open.has(nr * N + nc); };
  const voorw = cnd => cnd === 'V' ? vrij(0) : cnd === 'LV' ? vrij(-1) : vrij(1);
  const stap = t => {
    if (++stappen > max) { fout = 'De robot blijft maar doorgaan en vindt de vlag niet. Zit je programma in een kringetje?'; return; }
    if (t === 'L') d = (d + 3) % 4; else if (t === 'R') d = (d + 1) % 4;
    else { if (!vrij(0)) { fout = 'Botsing! Daar staat een muur.'; return; } r += RICHT[d][0]; c += RICHT[d][1]; spoor.push(r * N + c); }
    frames.push([r, c, d, [...spoor]]);
    if (r === dh.doel[0] && c === dh.doel[1]) bereikt = true;
  };
  const doe = blok => {
    for (const x of blok) {
      if (bereikt || fout) return;
      if (x.t === 'F' || x.t === 'L' || x.t === 'R') stap(x.t);
      else if (x.t === 'H') for (let k = 0; k < x.n && !bereikt && !fout; k++) doe(x.b);
      else if (x.t === 'T') { let leeg = 0; while (!bereikt && !fout) { const v = stappen; doe(x.b); if (stappen === v && ++leeg > 1) { fout = 'Je "herhaal tot 🏁" doet niets: de robot blijft stilstaan.'; return; } } }
      else if (x.t === 'I') doe(voorw(x.c) ? x.b : x.anders);
    }
  };
  doe(p.prog);
  if (!fout && !bereikt) fout = 'Het programma is gedaan, maar de robot staat niet op de vlag.';
  return { frames, ok: !fout && bereikt, fout, stappen };
}

/* ---------- Doolhoven maken ---------- */
const srBuren = (N, i) => { const r = Math.floor(i / N), c = i % N; return RICHT.map(([a, b]) => [r + a, c + b]).filter(([x, y]) => x >= 0 && y >= 0 && x < N && y < N).map(([x, y]) => x * N + y); };
/* gang langs een reeks bewegingen; geldig als de gang zichzelf nergens raakt (behalve opeenvolgende vakjes) */
function srGang(N, stappen, start) {
  let { r, c, d } = start; const pad = [r * N + c];
  for (const s of stappen) {
    if (s === 'L') d = (d + 3) % 4; else if (s === 'R') d = (d + 1) % 4;
    else { r += RICHT[d][0]; c += RICHT[d][1]; if (r < 0 || c < 0 || r >= N || c >= N) return null; const i = r * N + c; if (pad.includes(i)) return null; pad.push(i); }
  }
  const pos = new Map(pad.map((x, k) => [x, k]));
  for (let k = 0; k < pad.length; k++) for (const b of srBuren(N, pad[k])) if (pos.has(b) && Math.abs(pos.get(b) - k) > 1) return null;
  return { N, open: new Set(pad), start: { ...start }, doel: [Math.floor(pad[pad.length - 1] / N), pad[pad.length - 1] % N], pad };
}
function srRandStart(N) { return { r: U.r(0, N - 1), c: U.r(0, N - 1), d: U.r(0, 3) }; }
/* zijpaadjes (doodlopend) toevoegen aan een gang */
function srZijpaden(dh, aantal) {
  const { N } = dh, open = new Set(dh.open);
  let gelukt = 0;
  for (let poging = 0; poging < 200 && gelukt < aantal; poging++) {
    const k = U.r(1, dh.pad.length - 2), basis = dh.pad[k], lengte = U.r(1, 2);
    let cur = basis, nieuw = [], ok = true;
    const richting = U.pick(srBuren(N, basis).filter(b => !open.has(b)));
    if (richting === undefined) continue;
    const dr = Math.floor(richting / N) - Math.floor(basis / N), dc = richting % N - basis % N;
    for (let s = 0; s < lengte; s++) {
      const r = Math.floor(cur / N) + dr, c = cur % N + dc;
      if (r < 0 || c < 0 || r >= N || c >= N) { ok = false; break; }
      const i = r * N + c;
      if (open.has(i) || srBuren(N, i).some(b => open.has(b) && b !== cur)) { ok = false; break; }
      nieuw.push(i); cur = i;
    }
    if (!ok || !nieuw.length) continue;
    nieuw.forEach(i => open.add(i)); gelukt++;
  }
  return { ...dh, open };
}
/* perfect doolhof (geen lussen) op een rooster van 2k+1 */
function srPerfect(k) {
  const N = 2 * k + 1, open = new Set(), cel = (a, b) => (2 * a + 1) * N + (2 * b + 1);
  const gezien = new Set([0]), stapel = [[0, 0]]; open.add(cel(0, 0));
  while (stapel.length) {
    const [a, b] = stapel[stapel.length - 1];
    const opties = [[0, 1], [1, 0], [0, -1], [-1, 0]].map(([x, y]) => [a + x, b + y]).filter(([x, y]) => x >= 0 && y >= 0 && x < k && y < k && !gezien.has(x * k + y));
    if (!opties.length) { stapel.pop(); continue; }
    const [x, y] = U.pick(opties); gezien.add(x * k + y);
    open.add(cel(x, y)); open.add((a + x + 1) * N + (b + y + 1)); stapel.push([x, y]);
  }
  /* start en vlag ver van elkaar */
  const cellen = [...Array(k * k).keys()].map(i => [Math.floor(i / k), i % k]);
  const [s] = U.shuffle(cellen);
  const afst = new Map([[cel(...s), 0]]), q = [cel(...s)];
  while (q.length) { const i = q.shift(); for (const b of srBuren(N, i)) if (open.has(b) && !afst.has(b)) { afst.set(b, afst.get(i) + 1); q.push(b); } }
  const verst = cellen.map(x => cel(...x)).sort((a, b) => afst.get(b) - afst.get(a));
  const doel = U.pick(verst.slice(0, 3));
  const si = cel(...s), d = U.pick([0, 1, 2, 3].filter(dd => { const r = Math.floor(si / N) + RICHT[dd][0], c = si % N + RICHT[dd][1]; return open.has(r * N + c); }));
  return { N, open, start: { r: Math.floor(si / N), c: si % N, d }, doel: [Math.floor(doel / N), doel % N] };
}
const T_ = t => ({ t }), Hk = n => ({ t: 'H', n }), Tl = () => ({ t: 'T' }), Ia = c => ({ t: 'I', c }), Xa = () => ({ t: 'X' }), Ee = () => ({ t: 'E' });
/* referentie-oplossingen */
const SR_GANG_VOLGER = [Tl(), Ia('V'), T_('F'), Xa(), Ia('LV'), T_('L'), Xa(), T_('R'), Ee(), Ee(), Ee()];
const SR_RECHTERHAND = [Tl(), Ia('RV'), T_('R'), T_('F'), Xa(), Ia('V'), T_('F'), Xa(), T_('L'), Ee(), Ee(), Ee()];
const kopie = toks => toks.map(t => ({ ...t }));

function maakSlimPuzzel(n) {
  for (let poging = 0; poging < 3000; poging++) {
    let doolhoven = [], oplossing, tip;
    if (n === 1) {
      const patronen = [['F'], ['F', 'R', 'F', 'L'], ['F', 'L', 'F', 'R'], ['F', 'F', 'R', 'F', 'L'], ['F', 'L', 'F', 'F', 'R']];
      const pat = U.pick(patronen), N = 7;
      const herh = U.shuffle([2, 3, 4, 5, 6]).slice(0, 3);
      for (const h of herh) { let dh = null; for (let p = 0; p < 300 && !dh; p++) dh = srGang(N, Array.from({ length: h }, () => pat).flat(), srRandStart(N)); if (!dh) break; doolhoven.push(dh); }
      oplossing = [Tl(), ...pat.map(T_), Ee()];
      tip = 'Elk doolhof heeft hetzelfde patroon, maar het ene is langer dan het andere. Gebruik "herhaal tot 🏁".';
    } else if (n === 2 || n === 3) {
      const N = 7, kant = U.pick(['R', 'L']);
      for (let m = 0; m < 3; m++) {
        let dh = null;
        for (let p = 0; p < 400 && !dh; p++) {
          const st = [], bochten = U.r(2, n === 2 ? 3 : 5);
          for (let b = 0; b <= bochten; b++) { st.push(...Array(U.r(1, 3)).fill('F')); if (b < bochten) st.push(n === 2 ? kant : U.pick(['L', 'R'])); }
          dh = srGang(N, st, srRandStart(N));
          if (dh && dh.pad.length < 7) dh = null;
        }
        if (!dh) break; doolhoven.push(dh);
      }
      oplossing = n === 2 ? [Tl(), Ia('V'), T_('F'), Xa(), T_(kant), Ee(), Ee()] : kopie(SR_GANG_VOLGER);
      tip = n === 2 ? 'De robot moet zelf kunnen "zien" of hij vooruit kan. Gebruik "als vooruit vrij … anders …" binnen "herhaal tot 🏁".' : 'Soms moet de robot links, soms rechts. Een "als" mag ook in een "anders" staan.';
    } else if (n === 4) {
      const N = 8;
      for (let m = 0; m < 3; m++) {
        let dh = null;
        for (let p = 0; p < 400 && !dh; p++) {
          const st = [], bochten = U.r(3, 5);
          for (let b = 0; b <= bochten; b++) { st.push(...Array(U.r(1, 3)).fill('F')); if (b < bochten) st.push(U.pick(['L', 'R'])); }
          dh = srGang(N, st, srRandStart(N)); if (dh && dh.pad.length < 9) dh = null;
        }
        if (!dh) break; doolhoven.push(srZijpaden(dh, U.r(2, 3)));
      }
      oplossing = kopie(SR_RECHTERHAND);
      tip = 'Er zijn doodlopende zijpaadjes. Een bekende truc: hou je rechterhand altijd tegen de muur.';
    } else {
      for (let m = 0; m < 3; m++) doolhoven.push(srPerfect(4));
      oplossing = kopie(SR_RECHTERHAND);
      tip = 'Een echt doolhof! Denk aan de rechterhandregel: kun je rechts? Draai rechts en ga vooruit. Anders rechtdoor. Anders draai links.';
    }
    if (doolhoven.length < 3) continue;
    /* moet werken met de oplossing, en (vanaf zilver) NIET met de oplossing van het vorige niveau */
    if (!doolhoven.every(dh => srVoer(oplossing, dh).ok)) continue;
    if (n === 2 && doolhoven.every(dh => srVoer([Tl(), T_('F'), Ee()], dh).ok)) continue;
    if (n >= 4 && doolhoven.every(dh => srVoer(SR_GANG_VOLGER, dh).ok)) continue;
    if (new Set(doolhoven.map(dh => [...dh.open].sort().join() + dh.doel)).size < 3) continue;
    const limiet = srTel(oplossing) + (n === 1 ? 0 : 2);
    return { n, doolhoven, oplossing, tip, limiet };
  }
}

/* ---------- Gedeelde weergave: doolhoven + blokjesprogramma ---------- */
function srDoolhofEl(dh, klein) {
  const el = U.el('div', { class: 'sr-dh' + (klein ? ' klein' : ''), style: `grid-template-columns: repeat(${dh.N}, var(--srcel))` });
  const cellen = [...Array(dh.N * dh.N)].map(() => { const c = U.el('div', { class: 'sr-cel' }); el.append(c); return c; });
  const teken = (r = dh.start.r, c = dh.start.c, d = dh.start.d, spoor = []) => {
    const sp = new Set(spoor);
    cellen.forEach((x, i) => {
      const rr = Math.floor(i / dh.N), cc = i % dh.N;
      x.className = 'sr-cel' + (dh.open.has(i) ? '' : ' wand') + (sp.has(i) ? ' spoor' : '');
      x.replaceChildren(rr === r && cc === c ? U.el('span', { class: 'robot', style: `--hoek:${d * 90}deg` }, U.el('span', { class: 'robot-pijl' }, '▲'), '🤖') : rr === dh.doel[0] && cc === dh.doel[1] ? '🏁' : '');
    });
  };
  teken();
  return { el, teken };
}
/* blokjeseditor; opties.palet = lijst tokens die mogen; opties.bewerk = wijzigmodus (foutenjager) */
function srEditor({ palet, tokens = [], opWijzig, label = 'Programma' }) {
  let lijst = tokens, gekozen = -1;
  const box = U.el('div', { class: 'programma sr-prog' });
  const maakTok = s => s === 'H' ? { t: 'H', n: 2 } : s === 'I' ? { t: 'I', c: 'V' } : { t: s };
  const tekst = t => t.t === 'I' ? '❓ als ' : SR_LABEL[t.t];
  const teken = () => {
    let diepte = 0;
    box.replaceChildren(...(lijst.length ? lijst.map((t, k) => {
      if (t.t === 'E' || t.t === 'X') diepte--;
      const chip = U.el('span', { class: `rblok b${t.t}${k === gekozen ? ' gekozen' : ''}`, style: `margin-left:${Math.max(0, diepte) * 1.3}rem`, title: 'Klik om te kiezen', onclick: e => { e.stopPropagation(); gekozen = gekozen === k ? -1 : k; teken(); } },
        tekst(t),
        t.t === 'H' ? U.el('button', { class: 'aantal', type: 'button', onclick: e => { e.stopPropagation(); t.n = t.n >= 9 ? 2 : t.n + 1; wijzig(); } }, `×${t.n}`) : null,
        t.t === 'I' ? U.el('button', { class: 'aantal', type: 'button', onclick: e => { e.stopPropagation(); t.c = { V: 'LV', LV: 'RV', RV: 'V' }[t.c]; wijzig(); } }, SR_VOORW[t.c] + ' ▾') : null);
      if (t.t === 'H' || t.t === 'T' || t.t === 'I' || t.t === 'X') diepte++;
      return chip;
    }) : [U.el('span', { class: 'stil' }, 'Klik hieronder op blokjes om je programma te bouwen.')]));
    acties.replaceChildren(...(gekozen >= 0 ? [U.el('span', { class: 'stil' }, `Gekozen: blokje ${gekozen + 1}. `),
      U.el('button', { class: 'klein-knop', type: 'button', onclick: () => { lijst.splice(gekozen, 1); gekozen = -1; wijzig(); } }, '🗑 Weg'),
      U.el('span', { class: 'stil' }, ' · Klik op een blokje hieronder om het ', U.el('b', {}, modus === 'vervang' ? 'te vervangen' : 'ervoor in te voegen'), '. '),
      U.el('button', { class: 'klein-knop', type: 'button', onclick: () => { modus = modus === 'vervang' ? 'invoegen' : 'vervang'; teken(); } }, modus === 'vervang' ? '↔ liever invoegen' : '↔ liever vervangen')] : [U.el('span', { class: 'stil' }, 'Tip: klik op een blokje in je programma om het weg te halen, te vervangen of er iets vóór te zetten.')]));
  };
  let modus = 'vervang';
  const acties = U.el('div', { class: 'sr-acties' });
  const wijzig = () => { teken(); opWijzig?.(); };
  const voeg = s => {
    const t = maakTok(s);
    if (gekozen >= 0) { if (modus === 'vervang') { lijst[gekozen] = t; gekozen = -1; } else { lijst.splice(gekozen, 0, t); gekozen++; } }
    else lijst.push(t);
    wijzig();
  };
  const paletEl = U.el('div', { class: 'sr-palet' }, palet.map(s => U.el('button', { class: `rblok b${s}`, type: 'button', onclick: () => voeg(s) }, SR_LABEL[s])));
  teken();
  return {
    el: U.el('div', {}, label ? U.el('div', { class: 'label' }, label) : null, box, acties, paletEl),
    get tokens() { return lijst; },
    zet(t) { lijst = t; gekozen = -1; teken(); },
    teken,
  };
}

SPELLEN.push({
  id: 'slimmerobot', naam: 'Slimme robot', vak: 'logica', icoon: '🦾',
  kort: 'Eén programma voor drie doolhoven: laat de robot zelf kijken.',
  uitleg: 'Je schrijft ÉÉN programma dat de robot in alle doolhoven naar de vlag brengt. Een vaste route werkt dus niet: de robot moet zelf kijken. Met "herhaal tot 🏁" herhaalt hij tot hij op de vlag staat. Met "als … anders …" kijkt hij of er vooruit, links of rechts een muur staat (klik op de voorwaarde om ze te veranderen). Sluit elke "herhaal" en "als" af met "einde". Brons: herhaal tot 🏁. Zilver: één keer "als". Goud: een "als" in een "als". Platinum: doodlopende zijpaadjes. Diamant: echte doolhoven.',
  leer(doos) {
    doos.append(U.el('p', { class: 'opdracht' }, 'Van route naar algoritme'),
      U.el('p', {}, 'Bij Robotlogica schrijf je een route: precies welke stappen de robot zet. Een slimme robot krijgt een regel waarmee hij zelf beslist. Zo werkt een stofzuigerrobot of een robot in een magazijn ook.'),
      U.el('ol', { class: 'uit-stappen' }, ['Bekijk alle doolhoven. Wat is overal hetzelfde? Wat is anders?', 'Bedenk wat de robot op elk vakje moet beslissen: wat kijkt hij eerst na?', 'Schrijf die beslissing met "als … anders …" en zet alles in "herhaal tot 🏁".', 'Start de robot en kijk in welk doolhof het misloopt. Waarom daar?'].map(t => U.el('li', {}, t))),
      U.el('p', {}, U.el('b', {}, 'Voorbeeld: '), 'herhaal tot 🏁 → als vooruit vrij → vooruit → anders → rechts → einde → einde. Deze robot gaat rechtdoor zolang het kan en draait anders rechtsaf.'));
  },
  maak(n, doos, ctx) {
    const P = maakSlimPuzzel(n);
    const palet = n === 1 ? ['F', 'L', 'R', 'T', 'E'] : ['F', 'L', 'R', 'T', 'I', 'X', 'E'];
    let bezig = false, tipNr = 0;
    const dhs = P.doolhoven.map(dh => ({ dh, ...srDoolhofEl(dh, n === 5), st: U.el('div', { class: 'sr-uitslag' }) }));
    const melding = U.el('div', { class: 'rob-melding' }), teller = U.el('div', { class: 'route-info' });
    const ed = srEditor({ palet, opWijzig: () => { melding.textContent = ''; tel(); } });
    const tel = () => teller.textContent = `Blokjes: ${srTel(ed.tokens)} / max ${P.limiet}`;
    const test = () => P.doolhoven.map(dh => srVoer(ed.tokens, dh));
    const speel = () => {
      if (bezig) return; const res = test();
      if (res[0].fout && !res[0].frames.length) { melding.textContent = res[0].fout; return; }
      bezig = true; let k = 0; const max = Math.max(...res.map(r => r.frames.length));
      dhs.forEach(d => d.st.textContent = '');
      const t = setInterval(() => {
        if (!doos.isConnected) { clearInterval(t); return; }
        res.forEach((r, i) => { const f = r.frames[Math.min(k, r.frames.length - 1)]; if (f) dhs[i].teken(...f); });
        k++;
        if (k >= max) {
          clearInterval(t); bezig = false;
          res.forEach((r, i) => { dhs[i].st.textContent = r.ok ? '✅ vlag!' : '❌ ' + (r.fout || ''); dhs[i].st.className = 'sr-uitslag ' + (r.ok ? 'goed' : 'fout'); });
          const goed = res.filter(r => r.ok).length;
          melding.textContent = goed === res.length ? (srTel(ed.tokens) <= P.limiet ? '' : `Het werkt overal, maar met ${srTel(ed.tokens)} blokjes. Het kan met ${P.limiet}.`) : `${goed} van de ${res.length} doolhoven gelukt.`;
          if (goed === res.length && srTel(ed.tokens) <= P.limiet) ctx.klaar?.();
        }
      }, Math.max(25, 220 - max * 2));
    };
    tel();
    doos.append(U.el('p', { class: 'opdracht' }, `Schrijf één programma dat in ${P.doolhoven.length === 3 ? 'alle drie' : 'alle'} doolhoven werkt.`),
      U.el('div', { class: 'sr-doolhoven' }, dhs.map((d, i) => U.el('div', { class: 'sr-dhwrap' }, U.el('b', {}, `Doolhof ${i + 1}`), d.el, d.st))),
      U.el('div', { class: 'sr-werk' }, ed.el, U.el('div', {}, teller, melding, U.el('div', { class: 'knoppenrij' },
        U.el('button', { class: 'knop', type: 'button', onclick: speel }, '▶ Start de robots'),
        U.el('button', { class: 'knop tweede klein', type: 'button', onclick: () => { if (!bezig) { dhs.forEach(d => { d.teken(); d.st.textContent = ''; }); melding.textContent = ''; } } }, '↺ Robots terug'),
        U.el('button', { class: 'knop tweede klein', type: 'button', onclick: () => { if (!bezig) { ed.zet([]); tel(); } } }, '🗑 Wis')))));
    return {
      controleer() {
        const res = test(), goed = res.filter(r => r.ok).length;
        if (goed < res.length) return { ok: false, msg: `Je programma werkt in ${goed} van de ${res.length} doolhoven. Klik op "Start de robots" om te zien waar het misloopt.` };
        if (srTel(ed.tokens) > P.limiet) return { ok: false, msg: `Het werkt, maar je gebruikt ${srTel(ed.tokens)} blokjes. Het moet met hoogstens ${P.limiet}.` };
        return { ok: true };
      },
      hint() {
        tipNr++;
        if (tipNr === 1) return P.tip;
        const juist = P.oplossing; let k = 0;
        const gelijk = (x, y) => x.t === y.t && (x.t !== 'H' || x.n === y.n) && (x.t !== 'I' || x.c === y.c);
        while (k < ed.tokens.length && k < juist.length && gelijk(ed.tokens[k], juist[k])) k++;
        ed.zet(kopie(juist.slice(0, Math.min(juist.length, k + 1)))); tel();
        return 'Het begin van een goed programma staat er nu.';
      },
    };
  }
});

/* ---------- Foutenjager ---------- */
/* afstand tussen twee programma's (aantal wijzigingen: weg, erbij, vervangen, getal of voorwaarde aangepast) */
function srAfstand(a, b) {
  const g = (x, y) => x.t === y.t && (x.t !== 'H' || x.n === y.n) && (x.t !== 'I' || x.c === y.c);
  const d = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) { let vorig = d[0]; d[0] = i; for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, vorig + (g(a[i - 1], b[j - 1]) ? 0 : 1)); vorig = t; } }
  return d[b.length];
}
/* één willekeurige fout in een programma steken */
function srMuteer(toks) {
  const t = kopie(toks);
  const plaatsen = t.map((x, i) => i).filter(i => t[i].t !== 'E' && t[i].t !== 'X' && t[i].t !== 'T');
  const i = U.pick(plaatsen), x = t[i];
  const soort = U.pick(x.t === 'H' ? ['getal', 'getal', 'weg-binnen'] : x.t === 'I' ? ['voorwaarde', 'voorwaarde'] : x.t === 'A' ? ['vervang'] : ['vervang', 'vervang', 'weg', 'erbij']);
  if (soort === 'getal') x.n = Math.max(2, x.n + U.pick([-1, 1, 1]));
  else if (soort === 'voorwaarde') x.c = U.pick(Object.keys(SR_VOORW).filter(c => c !== x.c));
  else if (soort === 'vervang') { if (x.t === 'A') t[i] = { t: 'F' }; else x.t = U.pick(['F', 'L', 'R'].filter(s => s !== x.t)); }
  else if (soort === 'weg') t.splice(i, 1);
  else if (soort === 'erbij') t.splice(i, 0, { t: U.pick(['F', 'L', 'R']) });
  else if (soort === 'weg-binnen') { const j = t.findIndex((y, k) => k > i && (y.t === 'F' || y.t === 'L' || y.t === 'R')); if (j < 0) return null; t.splice(j, 1); }
  return t;
}
/* robotpuzzel (Robotlogica) als doolhof voor de slimme uitvoerder */
function srVanRobot(P) {
  const open = new Set([...Array(P.N * P.N).keys()].filter(i => !P.muren.has(i)));
  return { N: P.N, open, start: P.start, doel: P.doel, sterren: P.sterren };
}
/* functie A uitschrijven: A in het hoofdprogramma vervangen door de inhoud van A */
function srMetFunctie(main, fA) { return main.flatMap(t => t.t === 'A' ? kopie(fA) : [{ ...t }]); }
function maakFoutPuzzel(n) {
  const fouten = [0, 1, 1, 2, 2, 2][n];
  for (let poging = 0; poging < 500; poging++) {
    let doolhoven, juist, functie = null;
    if (n <= 4) {
      const P = maakRobotPuzzel([0, 2, 3, 4, 5][n]); if (!P) continue;
      doolhoven = [srVanRobot(P)];
      if (n === 4) { juist = P.prog; functie = P.fA; } else juist = P.prog;
    } else {
      const S2 = maakSlimPuzzel(U.pick([3, 4])); if (!S2) continue;
      doolhoven = S2.doolhoven; juist = S2.oplossing;
    }
    const werkt = (main, fA) => doolhoven.every(dh => { const r = srVoer(fA ? srMetFunctie(main, fA) : main, dh); return r.ok && (!dh.sterren?.length || dh.sterren.every(s => r.frames.some(f => f[3].includes(s[0] * dh.N + s[1])))); });
    if (!werkt(juist, functie)) continue;
    /* fouten steken: op niveau 4 ook in functie A */
    let fout = kopie(juist), foutA = functie ? kopie(functie) : null, ok = true;
    for (let k = 0; k < fouten; k++) {
      if (foutA && (k === 0 || Math.random() < .5)) { const m = srMuteer(foutA); if (!m) { ok = false; break; } foutA = m; }
      else { const m = srMuteer(fout); if (!m) { ok = false; break; } fout = m; }
    }
    if (!ok) continue;
    if (srParse(fout).fout || (foutA && srParse(foutA).fout)) continue;
    if (werkt(fout, foutA)) continue;
    const afst = srAfstand(fout, juist) + (foutA ? srAfstand(foutA, functie) : 0);
    if (afst !== fouten) continue;
    /* ook de juiste oplossing moet geen "lege" herhaling hebben */
    return { n, doolhoven, juist, functie, fout, foutA, fouten, testritten: [0, 99, 99, 5, 3, 3][n] };
  }
}
SPELLEN.push({
  id: 'foutenjager', naam: 'Foutenjager', vak: 'logica', icoon: '🐞',
  kort: 'Dit programma zou moeten werken… maar er zit een fout in.',
  uitleg: 'Iemand schreef een programma voor de robot, maar er zitten fouten in. Zoek ze en herstel ze, met zo weinig mogelijk wijzigingen. Klik op een blokje in het programma om het weg te halen, te vervangen of er iets vóór te zetten. Brons en zilver: 1 fout. Goud: 2 fouten, met herhalingen in herhalingen. Platinum: 2 fouten, ook in functie A. Diamant: 2 fouten in het programma van een slimme robot. Vanaf goud mag je de robot maar een paar keer testen: denk dus eerst goed na!',
  leer(doos) {
    doos.append(U.el('p', { class: 'opdracht' }, 'Zo jaag je op fouten'),
      U.el('ol', { class: 'uit-stappen' }, ['Lees het programma en voorspel waar de robot naartoe gaat. Wijs het met je vinger aan op het rooster.', 'Waar wijkt de robot af van de weg naar de vlag? Daar (of net ervoor) zit de fout.', 'Wat bedoelde de programmeur? Herstel alleen wat fout is: er staan precies zoveel fouten in als er gevraagd wordt.', 'Test pas als je denkt dat het klopt. Programmeurs noemen dit "debuggen": een bug is een fout (vroeger letterlijk een insect in de computer!).'].map(t => U.el('li', {}, t))));
  },
  maak(n, doos, ctx) {
    const P = maakFoutPuzzel(n);
    const metFunctie = !!P.functie;
    let bezig = false, ritten = 0, tipNr = 0, actief = 'main';
    const dhs = P.doolhoven.map(dh => ({ dh, ...srDoolhofEl(dh, n === 5), st: U.el('div', { class: 'sr-uitslag' }) }));
    /* sterren tekenen in Robotlogica-doolhoven */
    const tekenSterren = (spoor = []) => dhs.forEach(d => (d.dh.sterren || []).forEach(([r, c]) => { const cel = d.el.children[r * d.dh.N + c]; if (!spoor.includes(r * d.dh.N + c) && !cel.textContent) cel.textContent = '⭐'; }));
    const palet = n === 5 ? ['F', 'L', 'R', 'T', 'I', 'X', 'E'] : n === 4 ? ['F', 'L', 'R', 'H', 'E', 'A'] : n >= 2 ? ['F', 'L', 'R', 'H', 'E'] : ['F', 'L', 'R'];
    const melding = U.el('div', { class: 'rob-melding' }), teller = U.el('div', { class: 'route-info' });
    const edM = srEditor({ palet, tokens: kopie(P.fout), label: metFunctie ? null : 'Programma', opWijzig: () => { melding.textContent = ''; tel(); } });
    const edA = metFunctie ? srEditor({ palet: palet.filter(s => s !== 'A'), tokens: kopie(P.foutA), label: null, opWijzig: () => { melding.textContent = ''; tel(); } }) : null;
    const wijzigingen = () => srAfstand(P.fout, edM.tokens) + (edA ? srAfstand(P.foutA, edA.tokens) : 0);
    const tel = () => teller.replaceChildren(U.el('span', {}, `Wijzigingen: ${wijzigingen()} / max ${P.fouten}`), P.testritten < 99 ? U.el('span', {}, `Testritten over: ${P.testritten - ritten}`) : null);
    const programma = () => edA ? srMetFunctie(edM.tokens, edA.tokens) : edM.tokens;
    const sterrenOk = (dh, r) => !dh.sterren?.length || dh.sterren.every(s => r.frames.some(f => f[3].includes(s[0] * dh.N + s[1])));
    const test = () => P.doolhoven.map(dh => { const r = srVoer(programma(), dh); if (r.ok && !sterrenOk(dh, r)) return { ...r, ok: false, fout: 'Niet alle sterren gepakt.' }; return r; });
    const speel = () => {
      if (bezig) return;
      if (ritten >= P.testritten) { melding.textContent = 'Je testritten zijn op. Denk na en klik op Controleer als je zeker bent.'; return; }
      const res = test();
      if (res[0].fout && !res[0].frames.length) { melding.textContent = res[0].fout; return; }
      ritten++; tel(); bezig = true; let k = 0; const max = Math.max(...res.map(r => r.frames.length));
      const t = setInterval(() => {
        if (!doos.isConnected) { clearInterval(t); return; }
        res.forEach((r, i) => { const f = r.frames[Math.min(k, r.frames.length - 1)]; if (f) dhs[i].teken(...f); });
        tekenSterren(res[0].frames[Math.min(k, res[0].frames.length - 1)]?.[3] || []);
        k++;
        if (k >= max) {
          clearInterval(t); bezig = false;
          res.forEach((r, i) => { dhs[i].st.textContent = r.ok ? '✅ vlag!' : '❌ ' + (r.fout || ''); dhs[i].st.className = 'sr-uitslag ' + (r.ok ? 'goed' : 'fout'); });
          if (res.every(r => r.ok) && wijzigingen() <= P.fouten) ctx.klaar?.();
          else if (res.every(r => r.ok)) melding.textContent = `Het werkt, maar met ${wijzigingen()} wijzigingen. Er zitten maar ${P.fouten} ${P.fouten === 1 ? 'fout' : 'fouten'} in: herstel alleen wat fout is.`;
        }
      }, Math.max(25, 240 - max * 2));
    };
    const terug = () => { dhs.forEach(d => { d.teken(); d.st.textContent = ''; }); tekenSterren(); };
    tel(); terug();
    const progs = metFunctie ? U.el('div', {}, U.el('div', { class: 'label' }, 'Hoofdprogramma'), edM.el, U.el('div', { class: 'label' }, '🅰 Functie A'), edA.el) : edM.el;
    doos.append(U.el('p', { class: 'opdracht' }, `Er ${P.fouten === 1 ? 'zit 1 fout' : `zitten ${P.fouten} fouten`} in dit programma. Herstel ${P.fouten === 1 ? 'ze' : 'ze'} met hoogstens ${P.fouten} ${P.fouten === 1 ? 'wijziging' : 'wijzigingen'}.`),
      U.el('div', { class: 'sr-doolhoven' }, dhs.map((d, i) => U.el('div', { class: 'sr-dhwrap' }, dhs.length > 1 ? U.el('b', {}, `Doolhof ${i + 1}`) : null, d.el, d.st))),
      U.el('div', { class: 'sr-werk' }, progs, U.el('div', {}, teller, melding, U.el('div', { class: 'knoppenrij' },
        U.el('button', { class: 'knop', type: 'button', onclick: speel }, '▶ Test de robot'),
        U.el('button', { class: 'knop tweede klein', type: 'button', onclick: () => { if (!bezig) terug(); } }, '↺ Robot terug'),
        U.el('button', { class: 'knop tweede klein', type: 'button', onclick: () => { if (bezig) return; edM.zet(kopie(P.fout)); edA?.zet(kopie(P.foutA)); tel(); melding.textContent = 'Het oorspronkelijke programma staat er terug.'; } }, '↶ Oorspronkelijk programma')))));
    return {
      controleer() {
        const res = test(), goed = res.filter(r => r.ok).length;
        if (goed < res.length) return { ok: false, msg: res.length > 1 ? `Het programma werkt nu in ${goed} van de ${res.length} doolhoven.` : `Nog niet: ${res[0].fout}` };
        if (wijzigingen() > P.fouten) return { ok: false, msg: `Het werkt, maar je deed ${wijzigingen()} wijzigingen. Er ${P.fouten === 1 ? 'zit maar 1 fout' : `zitten maar ${P.fouten} fouten`} in: herstel alleen die.` };
        return { ok: true };
      },
      hint() {
        tipNr++;
        /* zoek de eerste plek waar het programma afwijkt van de bedoeling */
        const eerste = (a, b) => { let k = 0; const g = (x, y) => x && y && x.t === y.t && (x.t !== 'H' || x.n === y.n) && (x.t !== 'I' || x.c === y.c); while (k < a.length && g(a[k], b[k])) k++; return k; };
        const kA = edA ? eerste(edA.tokens, P.functie) : Infinity, kM = eerste(edM.tokens, P.juist);
        const inA = edA && (kA < edA.tokens.length || kA < P.functie.length) && srAfstand(edA.tokens, P.functie) > 0;
        const plaats = inA ? kA : kM;
        if (tipNr === 1) return 'Voorspel eerst met je vinger waar de robot naartoe gaat. Waar verlaat hij de goede weg?';
        if (tipNr === 2) return `Kijk eens goed ${inA ? 'in functie A' : 'in het hoofdprogramma'}, rond blokje ${plaats + 1}.`;
        const [ed, juist] = inA ? [edA, P.functie] : [edM, P.juist];
        const nieuw = kopie(ed.tokens);
        if (srAfstand(nieuw.slice(0, plaats + 1), juist.slice(0, plaats + 1)) === 1 && nieuw.length === juist.length) nieuw[plaats] = { ...juist[plaats] };
        else if (nieuw.length > juist.length) nieuw.splice(plaats, 1);
        else nieuw.splice(plaats, 0, { ...juist[plaats] });
        ed.zet(nieuw); tel();
        return `Blokje ${plaats + 1} ${inA ? 'in functie A ' : ''}is hersteld.`;
      },
    };
  }
});
