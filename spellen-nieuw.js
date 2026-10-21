'use strict';
/* ======================= Nieuwe onderdelen: oefenwedstrijd, ruimtelijk inzicht, logigrammen, strategiespellen, raadsels van klasgenoten ======================= */

/* ---------------- Oefenwedstrijd: een Koala-reeks in echte wedstrijdvorm ---------------- */
const WEDSTRIJD = {
  1: { van: 1, tot: 8, min: 15, drempel: .6 }, 2: { van: 1, tot: 16, min: 30, drempel: .6 }, 3: { van: 9, tot: 24, min: 30, drempel: .6 },
  4: { van: 1, tot: 24, min: 50, drempel: .6 }, 5: { van: 1, tot: 24, min: 50, drempel: .8 },
};
SPELLEN.push({
  id: 'oefenwedstrijd', naam: 'Oefenwedstrijd', vak: 'rekenen', icoon: '⏱️', bron: 'uitdagingen', perThema: true, geenMeester: true,
  kort: 'Een Koala-reeks zoals op de echte wedstrijd: tegen de klok, zonder hulp.',
  uitleg: 'Zoals op de echte Kangoeroe-wedstrijd: juist antwoord = 5 punten, geen antwoord = 1 punt, fout antwoord = 0 punten. Je hebt een beperkte tijd en er is geen hulp. Twijfel je echt? Laat de vraag dan open. Klik nog eens op je letter om een antwoord weg te halen. Klik op Controleer om in te leveren. Brons: vragen 1–8 in 15 minuten. Zilver: 1–16 in 30 minuten. Goud: 9–24 in 30 minuten. Platinum: alle 24 in 50 minuten. Voor een medaille heb je 60 % van de punten nodig, op diamant 80 %.',
  leer(doos, ctx) {
    doos.append(U.el('p', { class: 'opdracht' }, 'Tips voor de wedstrijd'),
      U.el('ol', { class: 'uit-stappen' }, ['Lees eerst alle vragen snel door en begin met wat je zeker kunt.', 'Een fout antwoord levert 0 punten op, geen antwoord 1 punt. Gok dus niet zomaar!', 'Kun je 2 of 3 antwoorden zeker schrappen? Dan is een gok wél de moeite waard.', 'Hou de klok in het oog: blijf niet hangen bij één vraag.', 'Na het inleveren zie je welke vragen fout waren. Probeer ze daarna opnieuw bij Wiskunde-uitdagingen, mét hulp.'].map(t => U.el('li', {}, t))));
  },
  maak(n, doos, ctx) {
    const r = ctx?.bron, w = WEDSTRIJD[n];
    const vragen = (r?.vragen || []).map((v, k) => ({ ...v, nr: k + 1 })).filter(v => v.nr >= w.van && v.nr <= w.tot);
    if (!vragen.length) { doos.append(U.el('p', {}, 'Deze reeks heeft geen vragen.')); return { controleer: () => ({ ok: false, msg: 'Kies een andere reeks.' }), hint: () => '' }; }
    const max = vragen.length * 5, eind = Date.now() + w.min * 60000;
    let ingeleverd = false;
    const klok = U.el('div', { class: 'wd-klok' }, '');
    const uitslag = U.el('div', { class: 'wd-uitslag' });
    const rijen = vragen.map(v => {
      let gekozen = null;
      const knoppen = 'ABCDE'.split('').map(l => U.el('button', { class: 'uit-letter', type: 'button', onclick: () => { if (ingeleverd) return; gekozen = gekozen === l ? null : l; knoppen.forEach(b => b.classList.toggle('gekozen', b.textContent === gekozen)); } }, l));
      const status = U.el('span', { class: 'wd-status' });
      const el = U.el('div', { class: 'uit-vraag' }, U.el('div', { class: 'uit-kop' }, U.el('b', {}, `Vraag ${v.nr}`), status),
        (() => { const i = U.el('img', { class: 'uit-beeld', alt: `Vraag ${v.nr}` }); zetBeeld(i, v.beeld); return i; })(),
        U.el('div', { class: 'uit-letters' }, U.el('span', { class: 'stil' }, 'Mijn antwoord:'), knoppen));
      return { el, v, punten: () => gekozen == null ? 1 : String(v.juist).includes(gekozen) ? 5 : 0, toon() { const p = this.punten(); el.classList.add(p === 5 ? 'goed' : p === 0 ? 'fout' : 'leeg'); status.textContent = p === 5 ? '✔ juist · 5 punten' : p === 0 ? `✘ fout · 0 punten (juist: ${v.juist[0]})` : `– geen antwoord · 1 punt (juist: ${v.juist[0]})`; } };
    });
    const lever = auto => {
      if (ingeleverd) return; ingeleverd = true; clearInterval(t);
      rijen.forEach(r => r.toon());
      const score = rijen.reduce((a, r) => a + r.punten(), 0), juist = rijen.filter(r => r.punten() === 5).length, leeg = rijen.filter(r => r.punten() === 1).length;
      const ok = score >= Math.ceil(max * w.drempel);
      uitslag.replaceChildren(U.el('h2', {}, `${score} / ${max} punten`), U.el('p', {}, `${juist} juist · ${rijen.length - juist - leeg} fout · ${leeg} niet beantwoord${auto ? ' · de tijd was om' : ''}.`),
        U.el('p', {}, ok ? 'Proficiat, dat is genoeg voor de medaille!' : `Nodig voor de medaille: ${Math.ceil(max * w.drempel)} punten. Probeer de foute vragen eens opnieuw bij Wiskunde-uitdagingen, mét hulp.`));
      uitslag.classList.add(ok ? 'goed' : 'fout'); uitslag.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const msg = ok ? `${score} / ${max} punten: proficiat!` : `${score} / ${max} punten. Net niet genoeg: probeer later opnieuw!`;
      if (ok) ctx.klaar?.(); else ctx.mislukt?.(msg);
      return { ok: false, info: ok, msg };
    };
    const tik = () => { const s = Math.max(0, Math.round((eind - Date.now()) / 1000)); klok.textContent = `⏳ Nog ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; klok.classList.toggle('bijna', s < 120); if (s <= 0) lever(true); };
    const t = setInterval(tik, 1000); tik();
    doos.append(U.el('div', { class: 'wd-balk' }, U.el('b', {}, `${r.naam} · ${vragen.length} vragen · ${w.min} minuten`), klok), uitslag, U.el('div', { class: 'uit-lijst' }, rijen.map(r => r.el)));
    return {
      controleer() { if (ingeleverd) return { ok: false, msg: 'Je hebt al ingeleverd. Klik op Nieuwe opgave om opnieuw te beginnen.' }; if (!confirm('Inleveren? Daarna kun je niets meer veranderen.')) return { ok: false, msg: 'Nog niet ingeleverd.', info: true }; return lever(false); },
      hint: () => 'Tijdens een wedstrijd is er geen hulp. Tip: geen antwoord = 1 punt, fout = 0 punten.',
      stop: () => clearInterval(t),
    };
  }
});

/* ---------------- Ruimtelijk inzicht ---------------- */
const RI = (() => {
  const S = 30, DX = 15, DY = 13; /* schuine projectie: x naar rechts, y naar achter (rechts-boven), z omhoog */
  const P = (x, y, z) => [x * S + y * DX, -z * S - y * DY];
  const pts = a => a.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ');
  const veld = h => h.length, breed = h => h[0].length;
  function bouwsel(h, kleur = ['#2E9CCA', '#BFE6F5', '#1D6E8E']) {
    const poly = [];
    for (let y = veld(h) - 1; y >= 0; y--) for (let z = 0; z < Math.max(...h.flat()); z++) for (let x = 0; x < breed(h); x++) {
      if (h[y][x] <= z) continue;
      poly.push(`<polygon points="${pts([P(x, y, z), P(x + 1, y, z), P(x + 1, y, z + 1), P(x, y, z + 1)])}" fill="${kleur[0]}"/>`);
      poly.push(`<polygon points="${pts([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)])}" fill="${kleur[1]}"/>`);
      poly.push(`<polygon points="${pts([P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)])}" fill="${kleur[2]}"/>`);
    }
    const H = Math.max(...h.flat()), b = breed(h), d = veld(h);
    const minX = -2, maxX = b * S + d * DX + 2, minY = -H * S - d * DY - 2, maxY = 2;
    return `<svg class="ri-svg" viewBox="${minX} ${minY} ${maxX - minX} ${maxY - minY}" style="width:${Math.min(260, (maxX - minX) * 1.25)}px"><g stroke="#16313a" stroke-width="1.2" stroke-linejoin="round">${poly.join('')}</g></svg>`;
  }
  /* aanzichten als rooster: rijen van boven naar onder */
  const boven = h => { const r = []; for (let y = veld(h) - 1; y >= 0; y--) r.push(h[y].map(v => v > 0 ? 1 : 0)); return r; };
  const kolomRooster = hoogtes => { const H = Math.max(1, ...hoogtes); return Array.from({ length: H }, (_, i) => hoogtes.map(v => v >= H - i ? 1 : 0)); };
  const voor = h => kolomRooster(h[0].map((_, x) => Math.max(...h.map(r => r[x]))));
  const zij = h => kolomRooster(h.map(r => Math.max(...r)));
  const sleutel = g => g.map(r => r.join('')).join('/');
  function rooster(g, c = '#2E9CCA') {
    const s = 22, w = g[0].length * s, hh = g.length * s;
    const cel = g.flatMap((r, i) => r.map((v, j) => `<rect x="${j * s}" y="${i * s}" width="${s}" height="${s}" fill="${v ? c : '#fff'}" stroke="${v ? '#16313a' : '#d5dde0'}" stroke-width="1"/>`)).join('');
    return `<svg class="ri-svg klein" viewBox="-2 -2 ${w + 4} ${hh + 4}" style="width:${Math.min(150, w + 4)}px">${cel}</svg>`;
  }
  /* bouwplaten */
  const NETTEN = [
    [[0,1],[1,1],[2,1],[3,1],[0,0],[0,2]], [[0,1],[1,1],[2,1],[3,1],[0,0],[1,2]], [[0,1],[1,1],[2,1],[3,1],[0,0],[2,2]], [[0,1],[1,1],[2,1],[3,1],[0,0],[3,2]],
    [[0,1],[1,1],[2,1],[3,1],[1,0],[1,2]], [[0,1],[1,1],[2,1],[3,1],[1,0],[2,2]],
    [[0,0],[1,0],[1,1],[2,1],[3,1],[1,2]].map(([a,b])=>[a,b]), [[0,0],[1,0],[1,1],[2,1],[3,1],[2,2]], [[0,0],[1,0],[1,1],[2,1],[3,1],[3,2]],
    [[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]], [[0,0],[1,0],[2,0],[2,1],[3,1],[4,1]],
  ];
  const draai = cel => { const t = cel.map(([x, y]) => [y, -x]); const mx = Math.min(...t.map(c => c[0])), my = Math.min(...t.map(c => c[1])); return t.map(([x, y]) => [x - mx, y - my]); };
  const spiegel = cel => { const mx = Math.max(...cel.map(c => c[0])); return cel.map(([x, y]) => [mx - x, y]); };
  const willekeurig = cel => { let c = cel; for (let i = U.r(0, 3); i > 0; i--) c = draai(c); return Math.random() < .5 ? spiegel(c) : c; };
  const vormSleutel = cel => { let best = null; let c = cel; for (let m = 0; m < 2; m++) { for (let r = 0; r < 4; r++) { c = draai(c); const k = c.map(p => p.join(',')).sort().join(';'); if (!best || k < best) best = k; } c = spiegel(c); } return best; };
  function vouw(cel) { /* rollen: elk vakje krijgt het lichaamsvlak dat onderaan ligt */
    const set = new Map(cel.map(c => [c.join(','), c]));
    const start = cel[0], lab = new Map(), q = [[start, { B: '-z', T: '+z', N: '+y', S: '-y', E: '+x', W: '-x' }]];
    lab.set(start.join(','), q[0][1].B);
    const rol = { E: s => ({ B: s.E, E: s.T, T: s.W, W: s.B, N: s.N, S: s.S }), W: s => ({ B: s.W, W: s.T, T: s.E, E: s.B, N: s.N, S: s.S }), N: s => ({ B: s.N, N: s.T, T: s.S, S: s.B, E: s.E, W: s.W }), S: s => ({ B: s.S, S: s.T, T: s.N, N: s.B, E: s.E, W: s.W }) };
    while (q.length) { const [[x, y], st] = q.shift(); for (const [r, dx, dy] of [['E', 1, 0], ['W', -1, 0], ['N', 0, -1], ['S', 0, 1]]) { const k = `${x + dx},${y + dy}`; if (set.has(k) && !lab.has(k)) { const ns = rol[r](st); lab.set(k, ns.B); q.push([[x + dx, y + dy], ns]); } } }
    return cel.map(c => lab.get(c.join(',')));
  }
  const isKubus = cel => new Set(vouw(cel)).size === 6;
  function foutNet() {
    for (;;) { const cel = [[0, 0]]; const has = (x, y) => cel.some(c => c[0] === x && c[1] === y);
      while (cel.length < 6) { const [x, y] = U.pick(cel); const [dx, dy] = U.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]); if (!has(x + dx, y + dy)) cel.push([x + dx, y + dy]); }
      const mx = Math.min(...cel.map(c => c[0])), my = Math.min(...cel.map(c => c[1])); const n = cel.map(([x, y]) => [x - mx, y - my]);
      if (Math.max(...n.map(c => c[0])) > 4 || Math.max(...n.map(c => c[1])) > 3) continue;
      if (!isKubus(n)) return n; }
  }
  function net(cel, kleuren) {
    const s = 24, w = (Math.max(...cel.map(c => c[0])) + 1) * s, h = (Math.max(...cel.map(c => c[1])) + 1) * s;
    return `<svg class="ri-svg klein" viewBox="-2 -2 ${w + 4} ${h + 4}" style="width:${Math.min(150, w + 4)}px">${cel.map(([x, y], i) => `<rect x="${x * s}" y="${y * s}" width="${s}" height="${s}" fill="${kleuren ? kleuren[i] : '#BFE6F5'}" stroke="#16313a" stroke-width="1.2"/>`).join('')}</svg>`;
  }
  /* gekleurde kubus: 24 draaiingen */
  const AS = { '+x': [1, 0, 0], '-x': [-1, 0, 0], '+y': [0, 1, 0], '-y': [0, -1, 0], '+z': [0, 0, 1], '-z': [0, 0, -1] };
  const naam = v => Object.keys(AS).find(k => AS[k].every((a, i) => a === v[i]));
  const DRAAIEN = (() => { const uit = []; const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
    for (const p of perms) for (const s of [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]]) {
      const M = [0, 1, 2].map(i => [0, 1, 2].map(j => (p[i] === j ? s[i] : 0)));
      const det = M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
      if (det === 1) uit.push(M); }
    return uit; })();
  const pas = (M, v) => M.map(r => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
  function zichten(vlakKleur) { /* alle (voor, boven, rechts) die een echte kubus kan tonen */
    const set = new Set();
    for (const M of DRAAIEN) { const k = {}; for (const [n, c] of Object.entries(vlakKleur)) k[naam(pas(M, AS[n]))] = c; set.add(`${k['-y']}|${k['+z']}|${k['+x']}`); }
    return set;
  }
  function kubus([v, b, r]) {
    const s = 60, d = 30, e = 26;
    return `<svg class="ri-svg" viewBox="-3 ${-s - e - 3} ${s + d + 6} ${s + e + 6}" style="width:110px"><g stroke="#16313a" stroke-width="2" stroke-linejoin="round">
      <polygon points="0,0 ${s},0 ${s},${-s} 0,${-s}" fill="${v}"/><polygon points="0,${-s} ${s},${-s} ${s + d},${-s - e} ${d},${-s - e}" fill="${b}"/><polygon points="${s},0 ${s + d},${-e} ${s + d},${-s - e} ${s},${-s}" fill="${r}"/></g></svg>`;
  }
  return { bouwsel, boven, voor, zij, sleutel, rooster, NETTEN, willekeurig, vormSleutel, isKubus, foutNet, net, vouw, zichten, kubus, spiegelRooster: g => g.map(r => [...r].reverse()) };
})();
const RI_KLEUREN = ['#E74C3C', '#F4D03F', '#3498DB', '#2ECC71', '#8E44AD', '#FFFFFF'];
function riHoogtes(d, b, max, vol = .8) {
  for (;;) { const h = Array.from({ length: d }, () => Array.from({ length: b }, () => Math.random() < vol ? U.r(1, max) : 0)); if (!(h.flat().filter(Boolean).length >= Math.max(2, d * b - 2) && Math.max(...h.flat()) > 1)) continue;
    /* naar achter oplopend: zo is elke toren zichtbaar en kan er niets verstopt zitten */
    for (let x = 0; x < b; x++) { const kol = h.map(r => r[x]).sort((a, c) => a - c); kol.forEach((v, y) => { h[y][x] = v; }); }
    return h; }
}
function riVraag(vraag, beeld, opties, juist, tip) {
  let gekozen = -1, vast = false;
  const el = U.el('div', { class: 'trij ri-vraag' });
  const knoppen = opties.map((o, k) => U.el('button', { class: 'ri-optie', type: 'button', onclick: () => { if (vast) return; gekozen = k; knoppen.forEach((b, j) => b.classList.toggle('gekozen', j === k)); el.classList.remove('goed', 'fout'); } }, U.el('b', {}, 'ABCDE'[k]), U.el('span', { html: o })));
  const tipEl = U.el('p', { class: 'ri-tip' });
  el.append(U.el('div', { class: 'trij-v' }, vraag), beeld ? U.el('div', { class: 'ri-beeld', html: beeld }) : null, U.el('div', { class: 'ri-opties' }, knoppen), tipEl);
  let hints = 0;
  return { el, status: () => gekozen < 0 ? null : gekozen === juist, hint() { hints++; if (hints === 1 && tip) { tipEl.textContent = '💡 ' + tip; return; } gekozen = juist; vast = true; knoppen.forEach((b, j) => b.classList.toggle('gekozen', j === juist)); knoppen[juist].classList.add('hint'); } };
}
function riMC(vraag, beeld, juistHtml, foutHtml, tip) {
  const opties = U.shuffle([juistHtml, ...foutHtml]);
  return riVraag(vraag, beeld, opties, opties.indexOf(juistHtml), tip);
}
function riTelVraag(n) {
  const [d, b, m] = n === 1 ? [2, U.r(2, 3), 2] : [3, 3, 3];
  const h = riHoogtes(d, b, m), tot = h.flat().reduce((a, v) => a + v, 0);
  if (n === 2 && Math.random() < .5) {
    const H = Math.max(...h.flat()), nodig = d * b * H - tot;
    const opts = [...new Set([nodig, nodig + 1, nodig - 1, nodig + 2, nodig - 2].filter(v => v >= 0))].slice(0, 4).map(String);
    return riMC(`Hoeveel blokjes moet je nog bijleggen om er een volle balk van ${b} × ${d} × ${H} van te maken?`, RI.bouwsel(h), String(nodig), U.shuffle(opts.filter(o => o !== String(nodig))).slice(0, 3), 'Hoeveel blokjes heeft de volle balk? Hoeveel blokjes staan er al (ook de verborgen blokjes onder andere blokjes)?');
  }
  const opts = [...new Set([tot - 2, tot - 1, tot + 1, tot + 2].filter(v => v > 0))].map(String);
  return riMC('Hoeveel blokjes telt dit bouwsel? (Blokjes zweven nooit: onder een blokje staat altijd een ander blokje of de grond.)', RI.bouwsel(h), String(tot), U.shuffle(opts).slice(0, 3), 'Tel per torentje hoe hoog het is en tel alles op. Vergeet de verborgen blokjes niet.');
}
function riAanzichtVraag() {
  for (;;) {
    const h = riHoogtes(3, 3, 3, .75);
    const soort = U.pick(['boven', 'voor', 'zij']);
    const juist = RI[soort](h), naam = { boven: 'bovenaanzicht (je kijkt van bovenaf)', voor: 'vooraanzicht (je kijkt recht van voren)', zij: 'zijaanzicht (je kijkt van rechts)' }[soort];
    const kand = [RI.boven(h), RI.voor(h), RI.zij(h), RI.spiegelRooster(juist), juist.map((r, i) => r.map((v, j) => (i === 0 && j === 0 ? 1 - v : v)))];
    const gezien = new Set([RI.sleutel(juist)]), fout = [];
    for (const g of U.shuffle(kand)) { const k = RI.sleutel(g); if (!gezien.has(k) && g.flat().some(Boolean)) { gezien.add(k); fout.push(g); } if (fout.length === 3) break; }
    if (fout.length < 3) continue;
    return riMC(`Welke figuur is het ${naam}?`, RI.bouwsel(h), RI.rooster(juist), fout.map(g => RI.rooster(g)),
      soort === 'boven' ? 'Kijk van bovenaf: op welke plaatsen staat er minstens één blokje? De voorste rij komt onderaan in de tekening.' : soort === 'voor' ? 'Kijk van voren: hoe hoog is de hoogste toren in elke kolom van links naar rechts?' : 'Kijk van rechts: hoe hoog is de hoogste toren in elke rij? De voorste rij staat links.');
  }
}
function riNetVraag() {
  const goed = Math.random() < .55;
  const juisten = U.shuffle(RI.NETTEN).slice(0, 3).map(RI.willekeurig);
  const fouten = []; const keys = new Set();
  while (fouten.length < 3) { const f = RI.foutNet(); const k = RI.vormSleutel(f); if (!keys.has(k)) { keys.add(k); fouten.push(f); } }
  if (goed) return riMC('Welke bouwplaat kun je vouwen tot een kubus?', null, RI.net(juisten[0]), fouten.map(f => RI.net(f)), 'Kies één vierkant als bodem en vouw de andere in gedachten omhoog. Komen er twee vierkanten op dezelfde plaats? Dan is het geen kubus.');
  return riMC('Welke bouwplaat kun je NIET vouwen tot een kubus?', null, RI.net(fouten[0]), juisten.map(f => RI.net(f)), 'Kies één vierkant als bodem en vouw de andere in gedachten omhoog. Bij één bouwplaat komen er twee vierkanten op dezelfde plaats.');
}
function riKubusVraag() {
  const cel = RI.willekeurig(U.pick(RI.NETTEN)), kl = U.shuffle(RI_KLEUREN), lab = RI.vouw(cel);
  const vk = Object.fromEntries(lab.map((n, i) => [n, kl[i]]));
  const ok = RI.zichten(vk);
  const juist = U.pick([...ok]).split('|');
  const fout = []; const gezien = new Set([juist.join('|')]);
  while (fout.length < 3) { const t = U.shuffle(kl).slice(0, 3); const k = t.join('|'); if (!ok.has(k) && !gezien.has(k)) { gezien.add(k); fout.push(t); } }
  return riMC('Je vouwt deze bouwplaat tot een kubus. Welke kubus kan het zijn?', RI.net(cel, kl), RI.kubus(juist), fout.map(f => RI.kubus(f)), 'Welke kleuren liggen tegenover elkaar? Die zie je nooit tegelijk. Kijk daarna in welke volgorde drie kleuren rond een hoekpunt liggen.');
}
SPELLEN.push({
  id: 'ruimtelijk', naam: 'Ruimtelijk inzicht', vak: 'rekenen', icoon: '🧊',
  kort: 'Blokjes tellen, aanzichten, bouwplaten van een kubus.',
  uitleg: 'Brons en zilver: tel de blokjes van een bouwsel, of hoeveel er nog nodig zijn voor een volle balk. Goud: kies het juiste bovenaanzicht, vooraanzicht of zijaanzicht. Platinum: welke bouwplaat kun je (niet) vouwen tot een kubus? Diamant: welke gekleurde kubus hoort bij de bouwplaat?',
  leer(doos) {
    const h = [[2, 1, 1], [1, 0, 2]];
    doos.append(U.el('p', { class: 'opdracht' }, 'Zo bekijk je een bouwsel'),
      U.el('div', { class: 'ri-leer' }, U.el('div', { html: RI.bouwsel(h) }),
        U.el('div', {}, U.el('b', {}, 'Bovenaanzicht'), U.el('div', { html: RI.rooster(RI.boven(h)) })),
        U.el('div', {}, U.el('b', {}, 'Vooraanzicht'), U.el('div', { html: RI.rooster(RI.voor(h)) })),
        U.el('div', {}, U.el('b', {}, 'Zijaanzicht (rechts)'), U.el('div', { html: RI.rooster(RI.zij(h)) }))),
      U.el('p', { class: 'stil' }, 'Bovenaanzicht: waar staat minstens één blokje? Vooraanzicht en zijaanzicht: hoe hoog is de hoogste toren in elke kolom of rij? Een kubus heeft 11 verschillende bouwplaten. Teken ze, knip ze uit en vouw ze: zo leer je het snelst!'));
  },
  maak(n, doos) {
    const maak = { 1: riTelVraag, 2: riTelVraag, 3: riAanzichtVraag, 4: riNetVraag, 5: riKubusVraag }[n];
    const rijen = Array.from({ length: 3 }, () => maak(n));
    doos.append(U.el('div', { class: 'trijen' }, rijen.map(r => r.el)));
    const spel = rijenSpel(rijen);
    return { ...spel, hint() { const r = U.pick(rijen.filter(r => r.status() !== true)); if (!r) return 'Alles is juist!'; r.hint(); r.el.classList.remove('fout'); return 'Er staat een tip (of het antwoord) bij een vraag.'; } };
  }
});

/* ---------------- Logigrammen ---------------- */
const LG_NAMEN = ['Lotte', 'Daan', 'Noor', 'Milan', 'Amira', 'Finn', 'Lina', 'Sem', 'Yara', 'Lucas'];
const LG_SOORTEN = [
  { naam: 'Huisdier', w: ['hond', 'kat', 'konijn', 'hamster', 'cavia'], pos: v => `heeft een ${v}`, neg: v => `heeft geen ${v}`, wie: v => `wie een ${v} heeft` },
  { naam: 'Sport', w: ['voetbal', 'tennis', 'hockey', 'basket', 'badminton'], pos: v => `speelt ${v}`, neg: v => `speelt geen ${v}`, wie: v => `wie ${v} speelt` },
  { naam: 'Fiets', w: ['rood', 'blauw', 'groen', 'geel', 'paars'], bij: { rood: 'rode', blauw: 'blauwe', groen: 'groene', geel: 'gele', paars: 'paarse' }, pos(v) { return `heeft een ${this.bij[v]} fiets`; }, neg(v) { return `heeft geen ${this.bij[v]} fiets`; }, wie(v) { return `wie een ${this.bij[v]} fiets heeft`; } },
  { naam: 'Fruit', w: ['appels', 'peren', 'bananen', 'kersen', 'druiven'], pos: v => `eet het liefst ${v}`, neg: v => `eet niet het liefst ${v}`, wie: v => `wie het liefst ${v} eet` },
  { naam: 'Reis', w: ['Spanje', 'Frankrijk', 'Italië', 'Noorwegen', 'Griekenland'], pos: v => `gaat op reis naar ${v}`, neg: v => `gaat niet naar ${v}`, wie: v => `wie naar ${v} gaat` },
];
const LG_NIVEAU = { 1: [3, 2, ['np', 'nn']], 2: [3, 3, ['np', 'nn', 'lp']], 3: [4, 2, ['np', 'nn', 'lp', 'ln']], 4: [4, 3, ['nn', 'lp', 'ln', 'np']], 5: [5, 3, ['nn', 'lp', 'ln', 'np']] };
function lgOplossingen(N, C, clues, max = 2) {
  const A = Array.from({ length: C }, () => Array(N).fill(-1)), gebruikt = Array.from({ length: C }, () => Array(N).fill(false));
  const ok = () => clues.every(k => {
    if (k.t === 'np') return A[k.c][k.p] < 0 || A[k.c][k.p] === k.v;
    if (k.t === 'nn') return A[k.c][k.p] < 0 || A[k.c][k.p] !== k.v;
    for (let p = 0; p < N; p++) { const a = A[k.c1][p], b = A[k.c2][p]; if (a < 0 || b < 0) continue; if (k.t === 'lp' && ((a === k.v1) !== (b === k.v2))) return false; if (k.t === 'ln' && a === k.v1 && b === k.v2) return false; }
    return true;
  });
  let n = 0;
  (function rec(i) {
    if (n >= max) return;
    if (i === N * C) { n++; return; }
    const c = Math.floor(i / N), p = i % N;
    for (let v = 0; v < N; v++) { if (gebruikt[c][v]) continue; A[c][p] = v; gebruikt[c][v] = true; if (ok()) rec(i + 1); A[c][p] = -1; gebruikt[c][v] = false; if (n >= max) return; }
  })(0);
  return n;
}
function lgMaak(niveau) {
  const [N, C, types] = LG_NIVEAU[niveau];
  const soorten = U.shuffle(LG_SOORTEN).slice(0, C), namen = U.shuffle(LG_NAMEN).slice(0, N);
  const waarden = soorten.map(s => U.shuffle(s.w).slice(0, N));
  const opl = soorten.map(() => U.shuffle([...Array(N).keys()])); /* opl[c][persoon] = waarde-index */
  const pool = [];
  for (let c = 0; c < C; c++) for (let p = 0; p < N; p++) for (let v = 0; v < N; v++) {
    if (types.includes('np') && opl[c][p] === v) pool.push({ t: 'np', c, p, v });
    if (types.includes('nn') && opl[c][p] !== v) pool.push({ t: 'nn', c, p, v });
  }
  for (let c1 = 0; c1 < C; c1++) for (let c2 = c1 + 1; c2 < C; c2++) for (let v1 = 0; v1 < N; v1++) for (let v2 = 0; v2 < N; v2++) {
    const p = opl[c1].indexOf(v1), samen = opl[c2][p] === v2;
    if (samen && types.includes('lp')) pool.push({ t: 'lp', c1, v1, c2, v2 });
    if (!samen && types.includes('ln')) pool.push({ t: 'ln', c1, v1, c2, v2 });
  }
  const gewicht = k => (niveau >= 4 && k.t === 'np' ? .15 : 1);
  let clues = [];
  for (const k of U.shuffle(pool)) { if (Math.random() > gewicht(k)) continue; clues.push(k); if (clues.length >= N && lgOplossingen(N, C, clues) === 1) break; }
  while (lgOplossingen(N, C, clues) !== 1) clues.push(U.pick(pool.filter(k => !clues.includes(k))));
  for (const k of U.shuffle([...clues])) { const zonder = clues.filter(x => x !== k); if (lgOplossingen(N, C, zonder) === 1) clues = zonder; }
  const zin = k => {
    const hoofd = s => s[0].toUpperCase() + s.slice(1);
    if (k.t === 'np') return `${namen[k.p]} ${soorten[k.c].pos(waarden[k.c][k.v])}.`;
    if (k.t === 'nn') return `${namen[k.p]} ${soorten[k.c].neg(waarden[k.c][k.v])}.`;
    const voor = hoofd(soorten[k.c1].wie(waarden[k.c1][k.v1]));
    return `${voor}, ${k.t === 'lp' ? soorten[k.c2].pos(waarden[k.c2][k.v2]) : soorten[k.c2].neg(waarden[k.c2][k.v2])}.`;
  };
  return { N, C, namen, soorten, waarden, opl, zinnen: U.shuffle(clues).map(zin) };
}
SPELLEN.push({
  id: 'logigram', naam: 'Logigrammen', vak: 'logica', icoon: '🔍',
  kort: 'Wie heeft welk huisdier? Redeneer met een kruistabel.',
  uitleg: 'Lees de aanwijzingen en vul de kruistabel in. Klik één keer op een vakje voor ✗ (kan niet), twee keer voor ✓ (zeker), drie keer om het weer leeg te maken. Staat er in een rij een ✓? Dan krijgen de andere vakjes in die rij en kolom een ✗. Klik op een aanwijzing om ze door te strepen als je ze gebruikt hebt. Je bent klaar als elke persoon in elke tabel precies één ✓ heeft.',
  leer(doos) {
    doos.append(U.el('p', { class: 'opdracht' }, 'Zo los je een logigram op'),
      U.el('ol', { class: 'uit-stappen' }, ['Begin met de aanwijzingen die iets zeker zeggen ("Lotte speelt tennis"): zet een ✓ en kruis de rest van die rij en kolom af.', 'Zet bij elke "geen" of "niet" een ✗.', 'Blijft er in een rij of kolom maar één leeg vakje over? Dan moet daar een ✓ komen!', 'Aanwijzingen als "Wie een hond heeft, speelt tennis" verbinden twee tabellen. Weet je wie de hond heeft? Dan weet je ook wie tennis speelt.', 'Lees de aanwijzingen opnieuw: soms helpt een aanwijzing pas later.'].map(t => U.el('li', {}, t))));
  },
  maak(n, doos) {
    const L = lgMaak(n);
    const stand = L.soorten.map(() => Array.from({ length: L.N }, () => Array(L.N).fill(0))); /* 0 leeg, 1 ✗, 2 ✓ */
    const cellen = [];
    const teken = (c, p, v) => { const b = cellen[c][p][v]; b.textContent = ['', '✗', '✓'][stand[c][p][v]]; b.className = `lg-cel s${stand[c][p][v]}${b.dataset.hint ? ' hint' : ''}`; };
    const tabellen = L.soorten.map((s, c) => {
      cellen[c] = [];
      return U.el('table', { class: 'lg-tabel' },
        U.el('tr', {}, U.el('th', { class: 'lg-soort' }, s.naam), L.waarden[c].map(w => U.el('th', { class: 'lg-kop' }, U.el('span', {}, w)))),
        L.namen.map((nm, p) => { cellen[c][p] = []; return U.el('tr', {}, U.el('th', {}, nm), L.waarden[c].map((w, v) => { const b = U.el('button', { class: 'lg-cel', type: 'button', onclick: () => { if (b.dataset.hint) return; stand[c][p][v] = (stand[c][p][v] + 1) % 3; teken(c, p, v); } }); cellen[c][p][v] = b; return U.el('td', {}, b); })); }));
    });
    /* hulptabellen eigenschap × eigenschap (niet nodig voor de controle, wel om te redeneren) */
    const hulp = [];
    if (n >= 2) for (let c1 = 0; c1 < L.C; c1++) for (let c2 = c1 + 1; c2 < L.C; c2++) {
      hulp.push(U.el('table', { class: 'lg-tabel hulp' },
        U.el('tr', {}, U.el('th', { class: 'lg-soort' }, `${L.soorten[c1].naam} × ${L.soorten[c2].naam}`), L.waarden[c2].map(w => U.el('th', { class: 'lg-kop' }, U.el('span', {}, w)))),
        L.waarden[c1].map(w1 => U.el('tr', {}, U.el('th', {}, w1), L.waarden[c2].map(() => { let st = 0; const b = U.el('button', { class: 'lg-cel', type: 'button', onclick: () => { st = (st + 1) % 3; b.textContent = ['', '✗', '✓'][st]; b.className = `lg-cel s${st}`; } }); return U.el('td', {}, b); })))));
    }
    if (hulp.length) tabellen.push(U.el('div', { class: 'lg-hulpkop' }, U.el('b', {}, 'Hulptabellen'), U.el('small', { class: 'stil' }, ' (om aanwijzingen als "Wie een … heeft, …" bij te houden)')), ...hulp);
    doos.append(U.el('div', { class: 'lg-wrap' },
      U.el('div', { class: 'lg-aanw' }, U.el('b', {}, `${L.N} kinderen: ${L.namen.join(', ')}. Wat weten we?`),
        U.el('ol', {}, L.zinnen.map(z => { const li = U.el('li', { onclick: () => li.classList.toggle('weg') }, z); return li; }))),
      U.el('div', { class: 'lg-tabellen' }, tabellen)));
    return {
      controleer() {
        let fout = 0, leeg = 0;
        for (let c = 0; c < L.C; c++) for (let p = 0; p < L.N; p++) { const v = stand[c][p].map((x, i) => x === 2 ? i : -1).filter(i => i >= 0); if (!v.length) leeg++; else if (v.length > 1 || v[0] !== L.opl[c][p]) fout++; }
        if (!fout && !leeg) return { ok: true };
        if (fout) return { ok: false, msg: `${fout} ✓ ${fout === 1 ? 'staat' : 'staan'} nog niet goed. Kijk de aanwijzingen opnieuw na.` };
        return { ok: false, info: true, msg: `Zet in elke tabel bij elk kind precies één ✓. Er ${leeg === 1 ? 'ontbreekt er nog 1' : `ontbreken er nog ${leeg}`}.` };
      },
      hint() {
        const open = []; for (let c = 0; c < L.C; c++) for (let p = 0; p < L.N; p++) if (stand[c][p][L.opl[c][p]] !== 2) open.push([c, p]);
        if (!open.length) return 'Alle ✓ staan juist. Haal eventuele extra ✓ weg.';
        const [c, p] = U.pick(open), v = L.opl[c][p];
        stand[c][p].forEach((_, i) => { stand[c][p][i] = i === v ? 2 : 1; teken(c, p, i); });
        cellen[c][p][v].dataset.hint = '1'; teken(c, p, v);
        return `${L.namen[p]}: ${L.soorten[c].naam.toLowerCase()} = ${L.waarden[c][v]}. Kun je nu verder?`;
      }
    };
  }
});

/* ---------------- Strategiespellen: Nim tegen de computer ---------------- */
const NIM = {
  1: { naam: 'Neem 1 of 2', stapels: () => [U.pick([10, 11, 13, 14])], max: 2, laatsteWint: true, slim: .5,
    regel: 'Er ligt één stapel fiches. Om beurten neem je 1 of 2 fiches. Wie het laatste fiche neemt, wint.',
    tips: ['Wie mag er kiezen als er nog 3 fiches liggen? Kan die speler winnen?', 'Probeer na jouw beurt een veelvoud van 3 over te laten: 3, 6, 9, 12 …'] },
  2: { naam: 'Neem 1, 2 of 3', stapels: () => [U.pick([15, 17, 18, 19, 21, 22])], max: 3, laatsteWint: true, slim: .75,
    regel: 'Er ligt één stapel fiches. Om beurten neem je 1, 2 of 3 fiches. Wie het laatste fiche neemt, wint.',
    tips: ['Wat gebeurt er als je tegenstander moet kiezen bij 4 fiches?', 'Laat na jouw beurt altijd een veelvoud van 4 over: 4, 8, 12, 16 …'] },
  3: { naam: 'Het laatste fiche verliest', stapels: () => [U.pick([14, 15, 16, 18, 19, 20])], max: 3, laatsteWint: false, slim: 1,
    regel: 'Er ligt één stapel fiches. Om beurten neem je 1, 2 of 3 fiches. Opgelet: wie het LAATSTE fiche moet nemen, verliest!',
    tips: ['Je wilt dat je tegenstander bij precies 1 fiche moet kiezen.', 'Laat na jouw beurt 1, 5, 9, 13, 17 … fiches over (een viervoud plus 1).'] },
  4: { naam: 'Twee stapels', stapels: () => { for (;;) { const a = U.r(3, 8), b = U.r(3, 9); if (a !== b) return [a, b]; } }, max: 99, laatsteWint: true, slim: 1,
    regel: 'Er liggen twee stapels. Om beurten neem je uit één stapel zoveel fiches als je wilt (minstens 1). Wie het laatste fiche neemt, wint.',
    tips: ['Wat gebeurt er als beide stapels even groot zijn en je tegenstander aan de beurt is?', 'Maak na elke beurt de twee stapels even groot. Doe daarna altijd hetzelfde als je tegenstander, maar in de andere stapel.'] },
  5: { naam: 'Drie stapels', stapels: () => { for (;;) { const s = [U.r(2, 7), U.r(3, 8), U.r(4, 9)]; if ((s[0] ^ s[1] ^ s[2]) !== 0) return s; } }, max: 99, laatsteWint: true, slim: 1,
    regel: 'Er liggen drie stapels. Om beurten neem je uit één stapel zoveel fiches als je wilt (minstens 1). Wie het laatste fiche neemt, wint.',
    tips: ['Schrijf elke stapel als een som van 4, 2 en 1 (bv. 7 = 4 + 2 + 1, 5 = 4 + 1).', 'Tel hoe vaak 4, 2 en 1 voorkomen in alle stapels samen. Zorg dat na jouw beurt elk ervan een EVEN aantal keer voorkomt.'] },
};
function nimWinnend(st, cfg) { /* geeft een winnende zet [stapel, aantal] of null */
  if (st.length === 1) {
    const n = st[0], m = cfg.max + 1;
    const doel = cfg.laatsteWint ? n % m : (n - 1) % m;
    return doel >= 1 && doel <= cfg.max && doel <= n ? [0, doel] : null;
  }
  const x = st.reduce((a, b) => a ^ b, 0);
  if (!x) return null;
  for (let i = 0; i < st.length; i++) { const t = st[i] ^ x; if (t < st[i]) return [i, st[i] - t]; }
  return null;
}
SPELLEN.push({
  id: 'nim', naam: 'Strategiespellen', vak: 'logica', icoon: '♟️',
  kort: 'Versla de computer en ontdek de winnende strategie.',
  uitleg: 'Speel tegen de computer. Om beurten neem je fiches weg: klik op een fiche om dat fiche en alle fiches erboven weg te nemen. Win je, dan heb je de medaille. Bij elk spel bestaat er een strategie waarmee je ALTIJD wint. Kun je ze ontdekken en uitleggen? Schrijf je strategie in je paspoort! De hint geeft je telkens een stapje van de strategie.',
  leer(doos) {
    doos.append(U.el('p', { class: 'opdracht' }, 'Zo ontdek je een winnende strategie'),
      U.el('ol', { class: 'uit-stappen' }, ['Begin bij het einde: met hoeveel fiches op tafel win je zeker als jij aan de beurt bent? En wanneer verlies je zeker?', 'Werk terug: welke aantallen moet je voor je tegenstander achterlaten?', 'Zoek het patroon in die aantallen (veelvouden van …?).', 'Test je strategie: win je nu altijd?', 'Leg je strategie in één zin uit aan een klasgenoot.'].map(t => U.el('li', {}, t))),
      U.el('div', { class: 'nim-leer' }, Object.entries(NIM).map(([n, c]) => U.el('p', {}, medaille(Number(n)), ' ', U.el('b', {}, c.naam + ': '), c.regel))));
  },
  maak(n, doos, ctx) {
    const cfg = NIM[n];
    let st = cfg.stapels(), beurt = 'jij', klaar = false, tipNr = 0;
    /* zorg dat de leerling kan winnen: start in een winnende positie, anders begint de computer */
    if (!nimWinnend(st, cfg)) beurt = 'computer';
    const bord = U.el('div', { class: 'nim-bord' }), info = U.el('div', { class: 'nim-info' }), log = U.el('ul', { class: 'nim-log' });
    const neem = (i, k, wie) => {
      st[i] -= k; log.prepend(U.el('li', {}, `${wie === 'jij' ? 'Jij neemt' : 'De computer neemt'} ${k} ${k === 1 ? 'fiche' : 'fiches'}${st.length > 1 ? ` uit stapel ${'ABC'[i]}` : ''}.`));
      const leeg = st.every(v => v === 0);
      if (leeg) { klaar = true; const winnaar = cfg.laatsteWint ? wie : (wie === 'jij' ? 'computer' : 'jij'); teken(); if (winnaar === 'jij') { info.textContent = '🎉 Je hebt gewonnen!'; ctx.klaar?.(); } else { info.textContent = '😕 De computer wint deze keer. Klik op Nieuwe opgave en probeer opnieuw!'; ctx.mislukt?.('De computer won. Probeer opnieuw: gebruik de hint als je de strategie zoekt.'); } return; }
      beurt = wie === 'jij' ? 'computer' : 'jij'; teken();
      if (beurt === 'computer') setTimeout(computer, 900);
    };
    const computer = () => {
      if (klaar) return;
      let zet = Math.random() < cfg.slim ? nimWinnend(st, cfg) : null;
      if (!zet) { const i = U.pick(st.map((v, j) => v > 0 ? j : -1).filter(j => j >= 0)); zet = [i, U.r(1, Math.min(cfg.max, st[i], st.length > 1 ? 3 : cfg.max))]; }
      neem(zet[0], zet[1], 'computer');
    };
    const teken = () => {
      bord.replaceChildren(...st.map((v, i) => U.el('div', { class: 'nim-stapel' }, st.length > 1 ? U.el('b', {}, `Stapel ${'ABC'[i]}`) : null,
        U.el('div', { class: 'nim-fiches' }, Array.from({ length: v }, (_, j) => {
          const k = j + 1; /* bovenste fiche = eerste in de lijst */
          const mag = !klaar && beurt === 'jij' && k <= cfg.max;
          return U.el('button', { class: 'nim-fiche' + (mag ? ' mag' : ''), type: 'button', disabled: !mag, title: mag ? `Neem ${k}` : '', onmouseenter: e => { if (!mag) return; [...e.target.parentNode.children].forEach((b, t) => b.classList.toggle('kies', t <= j)); }, onmouseleave: e => [...e.target.parentNode.children].forEach(b => b.classList.remove('kies')), onclick: () => neem(i, k, 'jij') });
        })), U.el('small', {}, `${v} ${v === 1 ? 'fiche' : 'fiches'}`))));
      if (!klaar) info.textContent = beurt === 'jij' ? `Jij bent aan de beurt: klik op een fiche. Je neemt dat fiche en alles erboven${cfg.max < 99 ? ` (hoogstens ${cfg.max})` : ''}.` : 'De computer denkt na…';
    };
    doos.append(U.el('p', { class: 'opdracht' }, cfg.regel), info, bord, U.el('details', { class: 'nim-logwrap' }, U.el('summary', {}, 'Wat gebeurde er?'), log));
    teken();
    if (beurt === 'computer') setTimeout(computer, 1200);
    return {
      controleer: () => (klaar ? { ok: false, info: true, msg: 'Het spel is gedaan. Klik op Nieuwe opgave voor een nieuw spel.' } : { ok: false, info: true, msg: 'Speel het spel uit: wie wint er?' }),
      hint() {
        const tip = cfg.tips[Math.min(tipNr, cfg.tips.length - 1)]; tipNr++;
        if (tipNr > cfg.tips.length && beurt === 'jij' && !klaar) { const z = nimWinnend(st, cfg); return z ? `Een goede zet nu: neem ${z[1]}${st.length > 1 ? ` uit stapel ${'ABC'[z[0]]}` : ''}.` : 'Er is nu geen winnende zet: neem 1 fiche en hoop dat de computer een fout maakt.'; }
        return tip;
      },
      stop() { klaar = true; },
    };
  }
});

/* ---------------- Raadsels van klasgenoten ---------------- */
const RAADSEL_AANTAL = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
function raadselNorm(s) {
  return U.zonderAccent(String(s)).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\b(de|het|een|n|t)\b/g, ' ').replace(/\s+/g, '');
}
function afstand(a, b) {
  const d = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) { let vorig = d[0]; d[0] = i; for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, vorig + (a[i - 1] === b[j - 1] ? 0 : 1)); vorig = t; } }
  return d[b.length];
}
function raadselJuist(invoer, r) {
  const x = raadselNorm(invoer); if (!x) return false;
  const goed = [r.antwoord, ...String(r.ook || '').split(/[;\/\n]/)].map(raadselNorm).filter(Boolean);
  return goed.some(g => g === x || (g.length >= 5 && afstand(g, x) <= (g.length >= 10 ? 2 : 1)));
}
const raadselBeeld = r => `/api?actie=beeld&id=${encodeURIComponent(r.beeld)}`;
const raadselOnline = () => typeof S !== 'undefined' && S.online && S.wie && typeof sleutel === 'function';

function tekenbord() {
  const W = 560, H = 400, cv = U.el('canvas', { width: W, height: H, class: 'rd-doek' }), g = cv.getContext('2d');
  let kleur = '#222', dikte = 5, gom = false, tekent = false, laatste = null, leeg = true;
  const stappen = [];
  const wit = () => { g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); };
  wit();
  const pos = e => { const b = cv.getBoundingClientRect(); return [(e.clientX - b.left) * W / b.width, (e.clientY - b.top) * H / b.height]; };
  cv.addEventListener('pointerdown', e => { e.preventDefault(); cv.setPointerCapture(e.pointerId); tekent = true; stappen.push(g.getImageData(0, 0, W, H)); if (stappen.length > 30) stappen.shift(); laatste = pos(e); lijn(laatste, laatste); });
  cv.addEventListener('pointermove', e => { if (!tekent) return; const p = pos(e); lijn(laatste, p); laatste = p; });
  const stop = () => { tekent = false; }; cv.addEventListener('pointerup', stop); cv.addEventListener('pointercancel', stop);
  function lijn(a, b) { g.strokeStyle = gom ? '#fff' : kleur; g.lineWidth = gom ? dikte * 4 : dikte; g.lineCap = g.lineJoin = 'round'; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); leeg = false; }
  const knoppen = U.el('div', { class: 'rd-gereedschap' });
  const kleuren = ['#222', '#E74C3C', '#2E86DE', '#27AE60', '#F39C12', '#8E5B2E', '#9B59B6'];
  const zet = () => knoppen.querySelectorAll('[data-k]').forEach(b => b.classList.toggle('aan', !gom && b.dataset.k === kleur) || (b.dataset.k === 'gom' && b.classList.toggle('aan', gom)));
  knoppen.append(...kleuren.map(k => U.el('button', { type: 'button', class: 'rd-kleur', 'data-k': k, style: `background:${k}`, title: 'Kleur', onclick: () => { kleur = k; gom = false; zet(); } })),
    U.el('button', { type: 'button', class: 'klein-knop', 'data-k': 'gom', onclick: () => { gom = !gom; zet(); } }, '🧽 Gom'),
    U.el('select', { class: 'rd-dikte', onchange: e => { dikte = Number(e.target.value); } }, [['3', 'Dun'], ['5', 'Normaal'], ['10', 'Dik']].map(([v, t]) => U.el('option', { value: v, selected: v === '5' }, t))),
    U.el('button', { type: 'button', class: 'klein-knop', onclick: () => { const s = stappen.pop(); if (s) g.putImageData(s, 0, 0); } }, '↶ Terug'),
    U.el('button', { type: 'button', class: 'klein-knop', onclick: () => { stappen.push(g.getImageData(0, 0, W, H)); wit(); leeg = true; } }, '🗑 Alles wissen'));
  zet();
  return { el: U.el('div', { class: 'rd-bord' }, knoppen, cv), leeg: () => leeg, data: () => cv.toDataURL('image/png'), wis: () => { wit(); leeg = true; stappen.length = 0; } };
}

function raadselKaart(r, { metAntwoord = false } = {}) {
  return U.el('div', { class: 'rd-kaart' },
    r.soort === 'tekening' && r.beeld ? U.el('img', { src: raadselBeeld(r), alt: 'tekening', class: 'rd-prent' }) : null,
    U.el('p', { class: 'rd-vraag' }, r.vraag || (r.soort === 'tekening' ? 'Wat stelt deze tekening voor?' : '')),
    metAntwoord ? U.el('p', {}, U.el('b', {}, 'Antwoord: '), r.antwoord, r.ook ? U.el('span', { class: 'stil' }, ` (ook goed: ${r.ook})`) : null) : null,
    metAntwoord && r.hint ? U.el('p', { class: 'stil' }, '💡 ' + r.hint) : null);
}

SPELLEN.push({
  id: 'raadsels', naam: 'Raadsels van klasgenoten', vak: 'logica', icoon: '🧩', geenMeester: true, leerKnop: '✏️ Zelf een raadsel maken',
  kort: 'Los raadsels van je klasgenoten op en maak er zelf een.',
  uitleg: 'Hier vind je raadsels, rebussen en tekenraadsels die je klasgenoten zelf bedachten. Brons = 1 raadsel oplossen, zilver = 2, goud = 3, platinum = 4, diamant = 5 na elkaar. Klik op "✏️ Zelf een raadsel maken" om er zelf een te bedenken: een tekstraadsel of een tekening. Je leerkracht bekijkt het eerst, daarna kunnen je klasgenoten het oplossen.',
  leer(doos) {
    if (!raadselOnline()) { doos.append(U.el('div', { class: 'melding info' }, 'Raadsels maken en delen kan alleen als je aangemeld bent via de site van je klas (niet in oefenmodus).')); return; }
    let soort = 'tekst';
    const bord = tekenbord(), msg = U.el('div'), mijnLijst = U.el('div', { class: 'rd-mijn' });
    const vraag = U.el('textarea', { class: 'tekst', rows: 4, maxlength: 600, placeholder: 'Bv. Ik heb een hoofd maar geen ogen, een voet maar geen tenen. Wat ben ik?' });
    const antw = U.tekst('tekst', 'Het antwoord (bv. een kool)'), ook = U.tekst('tekst', 'Ook goed (niet verplicht), bv. kool; bloemkool'), hint = U.tekst('tekst', 'Een hint (niet verplicht)'), uitl = U.tekst('tekst', 'Uitleg na het oplossen (niet verplicht)');
    [antw, ook, hint, uitl].forEach((x, i) => x.maxLength = [80, 200, 200, 400][i]);
    const tekenDeel = U.el('div', { style: 'display:none' }, bord.el);
    const soortKnop = (s, t) => U.el('button', { type: 'button', class: 'rd-soort' + (s === soort ? ' aan' : ''), 'data-s': s, onclick: e => {
      soort = s; e.target.parentNode.querySelectorAll('button').forEach(b => b.classList.toggle('aan', b.dataset.s === s)); tekenDeel.style.display = s === 'tekening' ? '' : 'none';
      vraag.placeholder = s === 'tekening' ? 'Je vraag bij de tekening (niet verplicht), bv. Welk spreekwoord teken ik?' : 'Bv. Ik heb een hoofd maar geen ogen, een voet maar geen tenen. Wat ben ik?';
    } }, t);
    const laadMijn = async () => {
      try {
        const d = await api('raadsels', sleutel());
        const status = { wacht: ['⏳ wacht op je leerkracht', 'wacht'], ok: ['✅ goedgekeurd', 'ok'], nee: ['✖ niet goedgekeurd', 'nee'] };
        mijnLijst.replaceChildren(U.el('h3', {}, 'Mijn raadsels'), d.mijn.length ? null : U.el('p', { class: 'stil' }, 'Je hebt nog geen raadsels ingestuurd.'),
          ...d.mijn.slice().reverse().map(r => U.el('div', { class: 'rd-mijnrij' }, raadselKaart(r, { metAntwoord: true }),
            U.el('div', { class: 'rd-status ' + status[r.status][1] }, status[r.status][0], r.status === 'ok' ? ` · ${r.opgelost || 0}× opgelost` : ''),
            r.opmerking ? U.el('p', { class: 'rd-opm' }, '💬 Je leerkracht: ' + r.opmerking) : null,
            U.el('button', { class: 'klein-knop', onclick: async () => { if (!confirm('Dit raadsel verwijderen?')) return; await api('raadsel-weg', { ...sleutel(), raadselId: r.id }); laadMijn(); } }, '🗑 Verwijderen'))));
      } catch { mijnLijst.replaceChildren(U.el('p', { class: 'stil' }, 'Je raadsels konden niet geladen worden.')); }
    };
    const stuur = async () => {
      if (!antw.value.trim()) return msg.replaceChildren(U.el('div', { class: 'melding fout' }, 'Vul het antwoord in.'));
      if (soort === 'tekst' && vraag.value.trim().length < 10) return msg.replaceChildren(U.el('div', { class: 'melding fout' }, 'Schrijf je raadsel uit.'));
      if (soort === 'tekening' && bord.leeg()) return msg.replaceChildren(U.el('div', { class: 'melding fout' }, 'Maak eerst je tekening.'));
      msg.replaceChildren(U.el('div', { class: 'melding info' }, 'Even versturen…'));
      try {
        await api('raadsel-insturen', { ...sleutel(), raadsel: { soort, vraag: vraag.value, antwoord: antw.value, ook: ook.value, hint: hint.value, uitleg: uitl.value, tekening: soort === 'tekening' ? bord.data() : undefined } });
        [vraag, antw, ook, hint, uitl].forEach(x => x.value = ''); bord.wis();
        msg.replaceChildren(U.el('div', { class: 'melding goed' }, 'Verstuurd! Je leerkracht bekijkt je raadsel. Daarna kunnen je klasgenoten het oplossen.')); laadMijn();
      } catch (e) { msg.replaceChildren(U.el('div', { class: 'melding fout' }, e.message || 'Versturen lukte niet.')); }
    };
    doos.append(U.el('p', { class: 'opdracht' }, 'Bedenk een raadsel voor je klasgenoten'),
      U.el('ul', { class: 'uit-stappen' }, ['Een goed raadsel is moeilijk, maar eerlijk: wie het antwoord hoort, denkt "Ah, natuurlijk!"', 'Gebruik geen namen van klasgenoten en niets wat iemand kan kwetsen.', 'Zijn er meerdere goede antwoorden? Vul ze in bij "Ook goed", gescheiden door ;'].map(t => U.el('li', {}, t))),
      U.el('div', { class: 'rd-soorten' }, soortKnop('tekst', '✍️ Tekstraadsel'), soortKnop('tekening', '🎨 Tekenraadsel (bv. een rebus of droedel)')),
      tekenDeel, U.el('div', { class: 'rd-form' }, vraag, antw, ook, hint, uitl),
      U.el('div', { class: 'knoppenrij' }, U.el('button', { class: 'knop', onclick: stuur }, '📨 Insturen')), msg, mijnLijst);
    laadMijn();
  },
  maak(n, doos, ctx) {
    const nodig = RAADSEL_AANTAL[n]; let lijst = [], k = 0, tipNr = 0, klaar = false, geladen = false;
    const kaart = U.el('div'), teller = U.el('div', { class: 'rd-teller' }), invoer = U.tekst('tekst', 'Jouw antwoord'), na = U.el('div');
    invoer.addEventListener('keydown', e => { if (e.key === 'Enter') document.querySelector('.acties .knop')?.click(); });
    const toonRaadsel = () => {
      const r = lijst[k]; tipNr = 0; invoer.value = '';
      teller.textContent = `Raadsel ${k + 1} van ${nodig} · bedacht door ${r.auteur}${r.klas ? ' (' + r.klas + ')' : ''}`;
      kaart.replaceChildren(raadselKaart(r), U.el('button', { class: 'klein-knop', onclick: () => { const rest = lijst.slice(nodig); if (!rest.length) { na.replaceChildren(U.el('p', { class: 'stil' }, 'Er zijn geen andere raadsels meer.')); return; } lijst.splice(k, 1); lijst.push(r); toonRaadsel(); } }, '⏭ Ander raadsel'));
      invoer.focus({ preventScroll: true });
    };
    doos.append(teller, kaart, U.el('div', { class: 'rd-antw' }, invoer), na);
    if (!raadselOnline()) { kaart.replaceChildren(U.el('div', { class: 'melding info' }, 'De raadsels van je klasgenoten zie je alleen als je aangemeld bent via de site van je klas.')); invoer.style.display = 'none'; }
    else {
      kaart.replaceChildren(U.el('p', { class: 'laden' }, 'Raadsels laden…'));
      api('raadsels', sleutel()).then(d => {
        lijst = U.shuffle(d.raadsels || []); geladen = true;
        if (lijst.length < nodig) { invoer.style.display = 'none'; kaart.replaceChildren(U.el('div', { class: 'melding info' }, lijst.length ? `Er zijn nog maar ${lijst.length} goedgekeurde ${lijst.length === 1 ? 'raadsel' : 'raadsels'} van klasgenoten. Kies een lager niveau, of maak zelf een raadsel!` : 'Er zijn nog geen goedgekeurde raadsels van klasgenoten. Wees de eerste: maak zelf een raadsel!')); return; }
        toonRaadsel();
      }).catch(() => kaart.replaceChildren(U.el('div', { class: 'melding fout' }, 'De raadsels konden niet geladen worden.')));
    }
    return {
      controleer() {
        if (!geladen || lijst.length < nodig || klaar) return { ok: false, info: true, msg: 'Er is (nog) geen raadsel om op te lossen.' };
        const r = lijst[k];
        if (!invoer.value.trim()) return { ok: false, info: true, msg: 'Typ eerst je antwoord.' };
        if (!raadselJuist(invoer.value, r)) return { ok: false, msg: 'Nog niet juist. Lees het raadsel nog eens heel nauwkeurig.' };
        api('raadsel-opgelost', { ...sleutel(), raadselId: r.id }).catch(() => { });
        na.replaceChildren(U.el('div', { class: 'melding goed' }, `✔ Juist: ${r.antwoord}!`, r.uitleg ? U.el('div', {}, r.uitleg) : null));
        k++;
        if (k >= nodig) { klaar = true; return { ok: true }; }
        toonRaadsel();
        return { ok: false, info: true, msg: `Juist! Op naar raadsel ${k + 1}.` };
      },
      hint() {
        const r = lijst[k]; if (!r) return 'Maak zelf een raadsel via "✏️ Zelf een raadsel maken".';
        tipNr++;
        if (tipNr === 1 && r.hint) return r.hint;
        const a = r.antwoord.trim();
        if (tipNr <= 2) return `Het antwoord heeft ${a.replace(/\s/g, '').length} letters${/\s/.test(a) ? ` (${a.split(/\s+/).length} woorden)` : ''}.`;
        return `Het antwoord begint met "${a.slice(0, Math.min(tipNr - 1, Math.ceil(a.length / 2)))}".`;
      },
    };
  }
});
