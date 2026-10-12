'use strict';
/* ======================= LOGICA ======================= */

/* ---------------- Magisch vierkant ---------------- */
function siamees(n) { const M = Array.from({ length: n }, () => Array(n).fill(0)); let r = 0, c = Math.floor(n / 2); for (let k = 1; k <= n * n; k++) { M[r][c] = k; const nr = (r - 1 + n) % n, nc = (c + 1) % n; if (M[nr][nc]) r = (r + 1) % n; else { r = nr; c = nc; } } return M; }
SPELLEN.push({
  id: 'magisch', naam: 'Magisch vierkant', vak: 'logica', icoon: '✨',
  kort: 'Elke rij, kolom en diagonaal dezelfde som.',
  uitleg: 'Vul het vierkant zo in dat elke rij, elke kolom en beide diagonalen dezelfde som hebben. Elk getal gebruik je precies één keer.',
  maak(n, doos) {
    let M = n >= 5 ? siamees(5) : n >= 3 ? [[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]] : [[8, 1, 6], [3, 5, 7], [4, 9, 2]];
    const draai = A => A[0].map((_, c) => A.map(r => r[c]).reverse());
    for (let k = U.r(0, 3); k > 0; k--) M = draai(M);
    if (Math.random() < 0.5) M = M.map(r => [...r].reverse());
    const N = M.length;
    if (Math.random() < 0.5) M = M.map(r => r.map(v => N * N + 1 - v));
    const plus = n === 2 || n === 4 ? U.r(3, 20) : 0;
    M = M.map(r => r.map(v => v + plus));
    const S = M[0].reduce((a, b) => a + b);
    const getallen = M.flat().sort((a, b) => a - b);
    const gegeven = new Set(U.shuffle([...Array(N * N).keys()]).slice(0, [0, 4, 2, 6, 4, 8][n]));
    const rooster = U.el('div', { class: 'magisch', style: `grid-template-columns: repeat(${N}, 3.4rem)` });
    const inputs = [];
    for (let k = 0; k < N * N; k++) {
      const v = M[Math.floor(k / N)][k % N];
      if (gegeven.has(k)) { rooster.append(U.el('div', { class: 'mcel gegeven' }, String(v))); inputs.push(null); }
      else { const i = U.getal('mcel'); rooster.append(i); inputs.push(i); }
    }
    const chips = U.el('div', { class: 'chips' });
    const waarden = () => inputs.map((i, k) => i ? U.leesGetal(i.value) : M[Math.floor(k / N)][k % N]);
    const tekenChips = () => { const gebruikt = waarden().filter(v => v !== null); chips.replaceChildren(...getallen.map(g => { const k = gebruikt.indexOf(g); if (k >= 0) gebruikt.splice(k, 1); return U.el('span', { class: 'chip' + (k >= 0 ? ' op' : '') }, String(g)); })); };
    inputs.forEach(i => i && i.addEventListener('input', tekenChips));
    tekenChips();
    doos.append(U.el('p', { class: 'opdracht' }, `Magische som: ${S}. Te gebruiken getallen:`), chips, rooster);
    return {
      controleer() {
        const w = waarden();
        if (w.includes(null)) return { ok: false, msg: 'Vul eerst alle vakjes in.' };
        if ([...w].sort((a, b) => a - b).join() !== getallen.join()) return { ok: false, msg: 'Je moet elk getal precies één keer gebruiken.' };
        const lijnen = [];
        for (let r = 0; r < N; r++) lijnen.push([...Array(N).keys()].map(c => r * N + c));
        for (let c = 0; c < N; c++) lijnen.push([...Array(N).keys()].map(r => r * N + c));
        lijnen.push([...Array(N).keys()].map(k => k * N + k), [...Array(N).keys()].map(k => k * N + (N - 1 - k)));
        const fout = lijnen.filter(l => l.reduce((a, k) => a + w[k], 0) !== S).length;
        return fout ? { ok: false, msg: `${fout} ${fout === 1 ? 'lijn heeft' : 'lijnen hebben'} niet de som ${S}.` } : { ok: true };
      },
      hint() {
        const kand = inputs.map((i, k) => ({ i, v: M[Math.floor(k / N)][k % N] })).filter(x => x.i && U.leesGetal(x.i.value) !== x.v);
        if (!kand.length) return 'Alles is al ingevuld!';
        const x = U.pick(kand); x.i.value = x.v; x.i.readOnly = true; U.mark(x.i, 'hint'); tekenChips();
        return 'Eén vakje is ingevuld (paars).';
      }
    };
  }
});

/* ---------------- Rullo ---------------- */
SPELLEN.push({
  id: 'rullo', naam: 'Rullo', vak: 'logica', icoon: '❎',
  kort: 'Streep getallen weg tot de sommen kloppen.',
  uitleg: 'Streep getallen weg (klik erop) tot de overgebleven getallen in elke rij en kolom samen de som aan de rand geven. Klik twee keer om een getal te omcirkelen als je zeker bent dat het blijft.',
  maak(n, doos) {
    const N = [0, 4, 5, 6, 7, 8][n], maxG = [0, 6, 9, 9, 9, 15][n];
    let G, houd;
    do {
      G = Array.from({ length: N }, () => Array.from({ length: N }, () => U.r(1, maxG)));
      houd = G.map(r => r.map(() => Math.random() < 0.6));
    } while (houd.some(r => !r.some(Boolean)) || [...Array(N).keys()].some(c => !houd.some(r => r[c])) || houd.flat().every(Boolean));
    const rijDoel = G.map((r, i) => r.reduce((a, v, j) => a + (houd[i][j] ? v : 0), 0));
    const kolDoel = [...Array(N).keys()].map(j => G.reduce((a, r, i) => a + (houd[i][j] ? r[j] : 0), 0));
    const st = G.map(r => r.map(() => 0)), vast = G.map(r => r.map(() => false));
    const rooster = U.el('div', { class: 'rullo', style: `grid-template-columns: repeat(${N}, var(--rc)) var(--rc)` });
    const knoppen = G.map(() => []), rijLbl = [], kolLbl = [];
    const update = () => {
      G.forEach((r, i) => r.forEach((v, j) => { knoppen[i][j].className = 'rcel s' + st[i][j] + (vast[i][j] ? ' hint' : ''); }));
      rijLbl.forEach((l, i) => l.classList.toggle('ok', G[i].reduce((a, v, j) => a + (st[i][j] !== 1 ? v : 0), 0) === rijDoel[i]));
      kolLbl.forEach((l, j) => l.classList.toggle('ok', G.reduce((a, r, i) => a + (st[i][j] !== 1 ? r[j] : 0), 0) === kolDoel[j]));
    };
    G.forEach((r, i) => {
      r.forEach((v, j) => { const b = U.el('button', { onclick: () => { if (vast[i][j]) return; st[i][j] = (st[i][j] + 1) % 3; update(); } }, String(v)); knoppen[i].push(b); rooster.append(b); });
      const l = U.el('div', { class: 'rdoel' }, String(rijDoel[i])); rijLbl.push(l); rooster.append(l);
    });
    kolDoel.forEach(d => { const l = U.el('div', { class: 'rdoel' }, String(d)); kolLbl.push(l); rooster.append(l); });
    update();
    doos.append(U.el('div', { class: 'scroll-x' }, rooster));
    return {
      controleer() {
        const fout = [...rijLbl, ...kolLbl].filter(l => !l.classList.contains('ok')).length;
        return !fout ? { ok: true } : { ok: false, msg: `${fout} ${fout === 1 ? 'som klopt' : 'sommen kloppen'} nog niet (de grijze getallen aan de rand).` };
      },
      hint() {
        const kand = []; G.forEach((r, i) => r.forEach((v, j) => { if (!vast[i][j] && (st[i][j] === 1) === houd[i][j]) kand.push([i, j]); }));
        if (!kand.length) G.forEach((r, i) => r.forEach((v, j) => { if (!vast[i][j] && st[i][j] === 0 && houd[i][j]) kand.push([i, j]); }));
        if (!kand.length) return 'Je zit op de goede weg. Kijk de randsommen na!';
        const [i, j] = U.pick(kand); st[i][j] = houd[i][j] ? 2 : 1; vast[i][j] = true; update();
        return houd[i][j] ? 'Eén getal is omcirkeld: dat blijft staan.' : 'Eén getal is voor je weggestreept.';
      }
    };
  }
});

/* ---------------- Latijnse vierkanten: Calcudoku, Sudoku, Futoshiki ---------------- */
function latijnsVierkant(N) {
  const v = telOplossingen(Array(N * N).fill(0), N, { random: true, limiet: 1 }).eerste;
  return [...Array(N).keys()].map(r => v.slice(r * N, r * N + N));
}

/* Algemene oplosser voor rooster met rijen/kolommen (en vakken) en extra controle. Telt oplossingen tot 'limiet'. */
function telOplossingen(g, N, { bw, bh, extra, limiet = 2, random = false, maxKnopen = 200000 } = {}) {
  const v = g.slice(), VOL = (1 << (N + 1)) - 2;
  const rij = Array(N).fill(0), kol = Array(N).fill(0), box = Array(N).fill(0);
  const bi = (r, c) => bw ? Math.floor(r / bh) * (N / bw) + Math.floor(c / bw) : 0;
  for (let i = 0; i < N * N; i++) if (v[i]) { const r = Math.floor(i / N), c = i % N, b = 1 << v[i]; if ((rij[r] | kol[c] | (bw ? box[bi(r, c)] : 0)) & b) return { tel: 0 }; rij[r] |= b; kol[c] |= b; if (bw) box[bi(r, c)] |= b; }
  let tel = 0, knopen = 0, eerste = null;
  const rec = () => {
    if (++knopen > maxKnopen) return;
    let best = -1, bestM = 0, bestN = 99;
    for (let i = 0; i < N * N; i++) if (!v[i]) {
      const r = Math.floor(i / N), c = i % N;
      let m = VOL & ~(rij[r] | kol[c] | (bw ? box[bi(r, c)] : 0));
      if (extra) { let m2 = 0; for (let d = 1; d <= N; d++) if (m & (1 << d)) { v[i] = d; if (extra(v, i)) m2 |= 1 << d; v[i] = 0; } m = m2; }
      let cnt = 0; for (let x = m; x; x &= x - 1) cnt++;
      if (!cnt) return;
      if (cnt < bestN) { best = i; bestM = m; bestN = cnt; if (cnt === 1) break; }
    }
    if (best < 0) { tel++; if (!eerste) eerste = v.slice(); return; }
    const r = Math.floor(best / N), c = best % N;
    let ds = []; for (let d = 1; d <= N; d++) if (bestM & (1 << d)) ds.push(d);
    if (random) ds = U.shuffle(ds);
    for (const d of ds) {
      const b = 1 << d; v[best] = d; rij[r] |= b; kol[c] |= b; if (bw) box[bi(r, c)] |= b;
      rec();
      v[best] = 0; rij[r] &= ~b; kol[c] &= ~b; if (bw) box[bi(r, c)] &= ~b;
      if (tel >= limiet || knopen > maxKnopen) return;
    }
  };
  rec();
  return { tel: knopen > maxKnopen ? limiet : tel, eerste };
}

/* Gewone latijnse-vierkant-UI: N×N invoervakjes met gegeven waarden */
function latijnRooster(N, gegeven, opts = {}) {
  const inputs = [];
  const rooster = U.el('div', { class: 'lat-rooster ' + (opts.cls || ''), style: `grid-template-columns: repeat(${N}, var(--lc))` });
  for (let i = 0; i < N * N; i++) {
    const r = Math.floor(i / N), c = i % N;
    const inp = U.el('input', { class: 'lcelg', inputmode: 'numeric', maxlength: 1, autocomplete: 'off' });
    if (gegeven[i]) { inp.value = gegeven[i]; inp.readOnly = true; inp.classList.add('gegeven'); }
    const wrap = U.el('div', { class: 'lat-cel' }, inp);
    if (opts.bw) { if (c % opts.bw === 0 && c) wrap.classList.add('bl'); if (r % opts.bh === 0 && r) wrap.classList.add('bt'); }
    inp.addEventListener('input', () => { inp.value = inp.value.replace(new RegExp(`[^1-${N}]`, 'g'), '').slice(-1); U.mark(inp, ''); });
    inp.addEventListener('keydown', e => { const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: N, ArrowUp: -N }[e.key]; if (d) { e.preventDefault(); inputs[i + d]?.focus(); } });
    inputs.push(inp); rooster.append(wrap);
  }
  return { rooster, inputs };
}
function latijnControle(N, inputs, opl, regels) {
  return {
    controleer() {
      const w = inputs.map(i => Number(i.value) || 0);
      if (w.includes(0)) return { ok: false, msg: `Vul elk vakje met een getal van 1 tot ${N}.` };
      if (opl && w.every((x, k) => x === opl[k])) { inputs.forEach(i => !i.readOnly && U.mark(i, 'goed')); return { ok: true }; }
      const fouten = regels(w);
      inputs.forEach((i, k) => { if (!i.readOnly) U.mark(i, fouten.has(k) ? 'fout' : ''); });
      return fouten.size ? { ok: false, msg: 'Nog niet alles klopt. Kijk naar de rode vakjes.' } : { ok: true };
    },
    hint() {
      const kand = inputs.map((i, k) => k).filter(k => Number(inputs[k].value) !== opl[k]);
      if (!kand.length) return 'Alles staat juist!';
      const k = U.pick(kand); inputs[k].value = opl[k]; inputs[k].readOnly = true; U.mark(inputs[k], 'hint');
      return 'Eén vakje is ingevuld (paars).';
    }
  };
}
function dubbelsIn(w, N, bw, bh) {
  const f = new Set();
  const groepen = [];
  for (let k = 0; k < N; k++) { groepen.push([...Array(N).keys()].map(c => k * N + c), [...Array(N).keys()].map(r => r * N + k)); }
  if (bw) for (let br = 0; br < N; br += bh) for (let bc = 0; bc < N; bc += bw) { const g = []; for (let r = br; r < br + bh; r++) for (let c = bc; c < bc + bw; c++) g.push(r * N + c); groepen.push(g); }
  for (const g of groepen) { const tel = {}; g.forEach(k => (tel[w[k]] = tel[w[k]] || []).push(k)); Object.values(tel).forEach(ks => ks.length > 1 && ks.forEach(k => f.add(k))); }
  return f;
}

SPELLEN.push({
  id: 'calcudoku', naam: 'Calcudoku', vak: 'logica', icoon: '🔢',
  kort: 'Sudoku met rekenkooien.',
  uitleg: 'In elke rij en kolom komt elk getal precies één keer voor. In elk dik omrand gebied moeten de getallen samen de uitkomst geven met de bewerking die erbij staat. Bij − en : maakt de volgorde niet uit.',
  maak(n, doos) {
    const N = [0, 4, 5, 6, 6, 7][n];
    const L = latijnsVierkant(N);
    const cid = L.map(r => r.map(() => -1)), kooien = [];
    const maxK = n >= 4 ? 4 : 3;
    for (const idx of U.shuffle([...Array(N * N).keys()])) {
      const r = Math.floor(idx / N), c = idx % N; if (cid[r][c] >= 0) continue;
      const id = kooien.length, grootte = Math.random() < (n >= 4 ? 0.06 : 0.12) ? 1 : U.r(2, maxK), leden = [[r, c]]; cid[r][c] = id;
      while (leden.length < grootte) {
        const buren = [];
        for (const [a, b] of leden) for (const [da, db] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const x = a + da, y = b + db; if (x >= 0 && y >= 0 && x < N && y < N && cid[x][y] < 0) buren.push([x, y]); }
        if (!buren.length) break;
        const [x, y] = U.pick(buren); cid[x][y] = id; leden.push([x, y]);
      }
      const v = leden.map(([a, b]) => L[a][b]);
      let op, doel;
      if (leden.length === 1) { op = ''; doel = v[0]; }
      else if (leden.length === 2) {
        const mx = Math.max(...v), mn = Math.min(...v);
        op = U.pick(n === 1 ? ['+', '−'] : n === 2 ? ['+', '−', '×'] : ['+', '−', '×', ...(mx % mn === 0 ? [':'] : [])]);
        doel = op === '+' ? mx + mn : op === '−' ? mx - mn : op === '×' ? mx * mn : mx / mn;
      } else { op = U.pick(n === 1 ? ['+'] : ['+', '×']); doel = op === '+' ? v.reduce((a, b) => a + b) : v.reduce((a, b) => a * b); }
      leden.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      kooien.push({ leden, op, doel });
    }
    const { rooster, inputs } = latijnRooster(N, [], { cls: 'calcu' });
    const dik = '3px solid var(--inkt)';
    [...rooster.children].forEach((cel, i) => {
      const r = Math.floor(i / N), c = i % N, k = kooien[cid[r][c]];
      if (r === 0 || cid[r - 1][c] !== cid[r][c]) cel.style.borderTop = dik;
      if (c === 0 || cid[r][c - 1] !== cid[r][c]) cel.style.borderLeft = dik;
      if (c === N - 1) cel.style.borderRight = dik; if (r === N - 1) cel.style.borderBottom = dik;
      if (k.leden[0][0] === r && k.leden[0][1] === c) cel.prepend(U.el('span', { class: 'clabel' }, `${k.doel}${k.op}`));
    });
    doos.append(U.el('p', { class: 'opdracht' }, `Gebruik de getallen 1 tot en met ${N}.`), U.el('div', { class: 'scroll-x' }, rooster));
    const opl = L.flat();
    return latijnControle(N, inputs, opl, w => {
      const f = dubbelsIn(w, N);
      for (const kooi of kooien) {
        const v = kooi.leden.map(([r, c]) => w[r * N + c]), mx = Math.max(...v), mn = Math.min(...v);
        const ok = kooi.op === '' ? v[0] === kooi.doel : kooi.op === '+' ? v.reduce((a, b) => a + b) === kooi.doel : kooi.op === '×' ? v.reduce((a, b) => a * b) === kooi.doel : kooi.op === '−' ? mx - mn === kooi.doel : mx / mn === kooi.doel;
        if (!ok) kooi.leden.forEach(([r, c]) => f.add(r * N + c));
      }
      return f;
    });
  }
});

SPELLEN.push({
  id: 'sudoku', naam: 'Sudoku', vak: 'logica', icoon: '🔲',
  kort: 'De klassieker: van 4×4 tot een pittige 9×9.',
  uitleg: 'Vul het rooster zo in dat elk getal precies één keer voorkomt in elke rij, elke kolom en elk dik omrand vak.',
  maak(n, doos) {
    const N = [0, 4, 6, 9, 9, 9][n], bw = N === 4 ? 2 : 3, bh = N === 9 ? 3 : 2;
    const vol = telOplossingen(Array(N * N).fill(0), N, { bw, bh, limiet: 1, random: true }).eerste;
    const doelGegeven = [0, 6, 16, 36, 29, 24][n];
    const g = vol.slice();
    for (const i of U.shuffle([...Array(N * N).keys()])) {
      if (g.filter(Boolean).length <= doelGegeven) break;
      const t = g[i]; g[i] = 0;
      if (telOplossingen(g, N, { bw, bh, maxKnopen: 30000 }).tel !== 1) g[i] = t;
    }
    const { rooster, inputs } = latijnRooster(N, g, { bw, bh, cls: 'sudoku' });
    doos.append(U.el('div', { class: 'scroll-x' }, rooster));
    return latijnControle(N, inputs, vol, w => dubbelsIn(w, N, bw, bh));
  }
});

SPELLEN.push({
  id: 'futoshiki', naam: 'Futoshiki', vak: 'logica', icoon: '⋖',
  kort: 'Groter of kleiner? Puzzelen met tekens.',
  uitleg: 'Elk getal komt precies één keer voor in elke rij en kolom. De tekens < en > (en ∧ ∨ verticaal) tussen de vakjes moeten kloppen. De punt wijst naar het kleinste getal.',
  maak(n, doos) {
    const N = [0, 4, 5, 5, 6, 7][n];
    const L = latijnsVierkant(N).flat();
    let paren = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { if (c < N - 1) paren.push([r * N + c, r * N + c + 1]); if (r < N - 1) paren.push([r * N + c, (r + 1) * N + c]); }
    let tekens = new Set(paren.map((_, k) => k)), gegeven = new Set();
    const maakExtra = () => { const per = Array.from({ length: N * N }, () => []); [...tekens].forEach(k => { const [a, b] = paren[k]; per[a].push([a, b]); per[b].push([a, b]); }); return (v, i) => per[i].every(([a, b]) => !v[a] || !v[b] || (L[a] < L[b]) === (v[a] < v[b])); };
    const uniek = () => { const g = Array(N * N).fill(0); gegeven.forEach(i => g[i] = L[i]); return telOplossingen(g, N, { extra: maakExtra(), maxKnopen: N >= 7 ? 2500 : 20000 }).tel === 1; };
    while (!uniek()) { const vrij = [...Array(N * N).keys()].filter(i => !gegeven.has(i)); gegeven.add(U.pick(vrij)); }
    for (const i of U.shuffle([...gegeven])) { gegeven.delete(i); if (!uniek()) gegeven.add(i); }
    const minTekens = Math.round(N * [0, 2.5, 2, 1.6, 1.4, 1.3][n]);
    for (const k of U.shuffle([...tekens])) { if (tekens.size <= minTekens) break; tekens.delete(k); if (!uniek()) tekens.add(k); }
    const extraGegeven = [0, 3, 2, 1, 0, 0][n];
    U.shuffle([...Array(N * N).keys()].filter(i => !gegeven.has(i))).slice(0, extraGegeven).forEach(i => gegeven.add(i));
    const inputs = [];
    const rooster = U.el('div', { class: 'futo', style: `grid-template-columns: repeat(${2 * N - 1}, auto)` });
    for (let R = 0; R < 2 * N - 1; R++) for (let C = 0; C < 2 * N - 1; C++) {
      if (R % 2 === 0 && C % 2 === 0) {
        const i = (R / 2) * N + C / 2, inp = U.el('input', { class: 'lcelg', inputmode: 'numeric', maxlength: 1, autocomplete: 'off' });
        if (gegeven.has(i)) { inp.value = L[i]; inp.readOnly = true; inp.classList.add('gegeven'); }
        inp.addEventListener('input', () => { inp.value = inp.value.replace(new RegExp(`[^1-${N}]`, 'g'), '').slice(-1); U.mark(inp, ''); });
        inputs[i] = inp; rooster.append(U.el('div', { class: 'lat-cel' }, inp));
      } else if (R % 2 === 0) {
        const a = (R / 2) * N + (C - 1) / 2, b = a + 1, k = paren.findIndex(p => p[0] === a && p[1] === b);
        rooster.append(U.el('div', { class: 'futo-t' }, tekens.has(k) ? (L[a] < L[b] ? '<' : '>') : ''));
      } else if (C % 2 === 0) {
        const a = ((R - 1) / 2) * N + C / 2, b = a + N, k = paren.findIndex(p => p[0] === a && p[1] === b);
        rooster.append(U.el('div', { class: 'futo-t v' }, tekens.has(k) ? (L[a] < L[b] ? '∧' : '∨') : ''));
      } else rooster.append(U.el('div'));
    }
    doos.append(U.el('p', { class: 'opdracht' }, `Gebruik de getallen 1 tot en met ${N}.`), U.el('div', { class: 'scroll-x' }, rooster));
    return latijnControle(N, inputs, L, w => {
      const f = dubbelsIn(w, N);
      [...tekens].forEach(k => { const [a, b] = paren[k]; if ((L[a] < L[b]) !== (w[a] < w[b])) { f.add(a); f.add(b); } });
      return f;
    });
  }
});

/* ---------------- Nonogram ---------------- */
function lijnLos(clue, staat) {
  const n = staat.length, kanVol = Array(n).fill(false), kanLeeg = Array(n).fill(false);
  const bl = clue.filter(x => x > 0); let ok = false;
  const rest = []; for (let i = bl.length - 1, s = 0; i >= 0; i--) { s += bl[i] + (i < bl.length - 1 ? 1 : 0); rest[i] = s; }
  const cur = Array(n).fill(0);
  let teller = 0;
  const rec = (i, start) => {
    if (++teller > 200000) return;
    if (i === bl.length) {
      for (let k = start; k < n; k++) if (staat[k] === 1) return;
      ok = true;
      for (let k = 0; k < n; k++) { if (k < start && cur[k]) kanVol[k] = true; else kanLeeg[k] = true; }
      return;
    }
    for (let p = start; p + rest[i] <= n; p++) {
      if (p > start && staat[p - 1] === 1) break;
      let past = true; for (let k = p; k < p + bl[i]; k++) if (staat[k] === 0) { past = false; break; }
      if (!past) continue;
      const na = p + bl[i];
      if (na < n && staat[na] === 1) continue;
      for (let k = start; k < p; k++) cur[k] = 0; for (let k = p; k < na; k++) cur[k] = 1; if (na < n) cur[na] = 0;
      rec(i + 1, Math.min(n, na + 1));
    }
  };
  rec(0, 0);
  return ok ? { kanVol, kanLeeg } : null;
}
const lijnClue = arr => { const c = []; let t = 0; for (const x of arr) { if (x === 1) t++; else if (t) { c.push(t); t = 0; } } if (t) c.push(t); return c.length ? c : [0]; };
function nonoOplosbaar(R, K, H, B) {
  const g = Array.from({ length: H }, () => Array(B).fill(-1));
  let veranderd = true;
  while (veranderd) {
    veranderd = false;
    for (let r = 0; r < H; r++) { const res = lijnLos(R[r], g[r]); if (!res) return false; for (let c = 0; c < B; c++) if (g[r][c] < 0) { if (!res.kanLeeg[c]) { g[r][c] = 1; veranderd = true; } else if (!res.kanVol[c]) { g[r][c] = 0; veranderd = true; } } }
    for (let c = 0; c < B; c++) { const kol = g.map(x => x[c]); const res = lijnLos(K[c], kol); if (!res) return false; for (let r = 0; r < H; r++) if (g[r][c] < 0) { if (!res.kanLeeg[r]) { g[r][c] = 1; veranderd = true; } else if (!res.kanVol[r]) { g[r][c] = 0; veranderd = true; } } }
  }
  return g.every(r => r.every(x => x >= 0));
}
SPELLEN.push({
  id: 'nonogram', naam: 'Nonogram', vak: 'logica', icoon: '🟦',
  kort: 'Kleur de vakjes met de getallen als aanwijzing.',
  uitleg: 'De getallen bij elke rij en kolom vertellen hoeveel vakjes na elkaar gekleurd zijn, in die volgorde, met minstens één wit vakje ertussen. Kies "kleur" of "kruisje" en klik (of sleep) over de vakjes. Een kruisje betekent: zeker wit.',
  maak(n, doos) {
    const N = [0, 5, 7, 10, 12, 15][n];
    let S, R, K;
    for (let t = 0; t < 80; t++) {
      S = Array.from({ length: N }, () => Array.from({ length: N }, () => Math.random() < 0.58 ? 1 : 0));
      R = S.map(lijnClue); K = [...Array(N).keys()].map(c => lijnClue(S.map(r => r[c])));
      if (nonoOplosbaar(R, K, N, N)) break;
    }
    const st = Array.from({ length: N }, () => Array(N).fill(0));
    let modus = 1, verf = null;
    const cel = [];
    const tabel = U.el('div', { class: 'nono', style: `grid-template-columns: auto repeat(${N}, var(--nc))` });
    tabel.append(U.el('div'));
    const kolLbl = K.map(k => U.el('div', { class: 'nono-k' }, k.map(x => U.el('span', {}, String(x)))));
    tabel.append(...kolLbl);
    const rijLbl = [];
    const teken = (r, c) => { const b = cel[r][c]; b.className = 'nono-cel s' + st[r][c] + (c % 5 === 4 && c < N - 1 ? ' br' : '') + (r % 5 === 4 && r < N - 1 ? ' bb' : '') + (b.dataset.hint ? ' hint' : ''); };
    const lbls = () => {
      rijLbl.forEach((l, r) => l.classList.toggle('klaar', lijnClue(st[r].map(x => x === 1 ? 1 : 0)).join() === R[r].join()));
      kolLbl.forEach((l, c) => l.classList.toggle('klaar', lijnClue(st.map(x => x[c] === 1 ? 1 : 0)).join() === K[c].join()));
    };
    const zet = (r, c, v) => { if (cel[r][c].dataset.hint) return; st[r][c] = v; teken(r, c); };
    for (let r = 0; r < N; r++) {
      const l = U.el('div', { class: 'nono-r' }, R[r].map(x => U.el('span', {}, String(x)))); rijLbl.push(l); tabel.append(l);
      cel.push([]);
      for (let c = 0; c < N; c++) {
        const b = U.el('div', { class: 'nono-cel' });
        b.addEventListener('pointerdown', e => { e.preventDefault(); verf = st[r][c] === modus ? 0 : modus; zet(r, c, verf); lbls(); b.releasePointerCapture?.(e.pointerId); });
        b.addEventListener('pointerenter', () => { if (verf !== null) { zet(r, c, verf); lbls(); } });
        cel[r].push(b); tabel.append(b); teken(r, c);
      }
    }
    window.addEventListener('pointerup', () => verf = null);
    const mk = U.el('div', { class: 'knoppenrij' });
    const tekenModus = () => mk.replaceChildren(
      U.el('button', { class: 'modus' + (modus === 1 ? ' aan' : ''), onclick: () => { modus = 1; tekenModus(); } }, '■ Kleur'),
      U.el('button', { class: 'modus' + (modus === 2 ? ' aan' : ''), onclick: () => { modus = 2; tekenModus(); } }, '✕ Kruisje'));
    tekenModus();
    doos.append(mk, U.el('div', { class: 'scroll-x' }, tabel));
    return {
      controleer() {
        const fout = rijLbl.filter(l => !l.classList.contains('klaar')).length + kolLbl.filter(l => !l.classList.contains('klaar')).length;
        return fout ? { ok: false, msg: `${fout} rijen of kolommen kloppen nog niet. Wat klaar is, wordt grijs.` } : { ok: true };
      },
      hint() {
        const kand = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if ((st[r][c] === 1) !== (S[r][c] === 1) || (S[r][c] === 0 && st[r][c] === 0 && false)) kand.push([r, c]);
        if (!kand.length) return 'Alles staat juist!';
        const [r, c] = U.pick(kand); st[r][c] = S[r][c] ? 1 : 2; cel[r][c].dataset.hint = '1'; teken(r, c); lbls();
        return 'Eén vakje is juist gezet (paarse rand).';
      }
    };
  }
});

/* ---------------- Binairo ---------------- */
function binairoVol(N) {
  for (let poging = 0; poging < 50; poging++) {
    const g = Array(N * N).fill(-1); let knopen = 0;
    const ok = (i, v) => {
      const r = Math.floor(i / N), c = i % N;
      if (c >= 2 && g[i - 1] === v && g[i - 2] === v) return false;
      if (r >= 2 && g[i - N] === v && g[i - 2 * N] === v) return false;
      let tr = 0, tk = 0; for (let k = 0; k < N; k++) { if (g[r * N + k] === v) tr++; if (g[k * N + c] === v) tk++; }
      if (tr >= N / 2 || tk >= N / 2) return false;
      return true;
    };
    const rijUniek = (r) => { const s = g.slice(r * N, r * N + N).join(); for (let q = 0; q < r; q++) if (g.slice(q * N, q * N + N).join() === s) return false; return true; };
    const kolUniek = (c) => { const s = [...Array(N).keys()].map(r => g[r * N + c]).join(); for (let q = 0; q < c; q++) if ([...Array(N).keys()].map(r => g[r * N + q]).join() === s) return false; return true; };
    const rec = i => {
      if (++knopen > 60000) return false;
      if (i === N * N) return true;
      for (const v of U.shuffle([0, 1])) {
        if (!ok(i, v)) continue;
        g[i] = v;
        const r = Math.floor(i / N), c = i % N;
        if ((c === N - 1 && !rijUniek(r)) || (r === N - 1 && !kolUniek(c))) { g[i] = -1; continue; }
        if (rec(i + 1)) return true;
        g[i] = -1;
      }
      return false;
    };
    if (rec(0)) return g;
  }
  return null;
}
function binairoLogisch(start, N) {
  const g = start.slice(); let ch = true;
  const lijnen = []; for (let k = 0; k < N; k++) { lijnen.push([...Array(N).keys()].map(c => k * N + c), [...Array(N).keys()].map(r => r * N + k)); }
  while (ch) {
    ch = false;
    for (const L of lijnen) {
      for (let k = 0; k < N; k++) {
        const i = L[k]; if (g[i] >= 0) continue;
        const a = L[k - 1] !== undefined ? g[L[k - 1]] : -1, b = L[k - 2] !== undefined ? g[L[k - 2]] : -1, c = L[k + 1] !== undefined ? g[L[k + 1]] : -1, d = L[k + 2] !== undefined ? g[L[k + 2]] : -1;
        let v = -1;
        if (a >= 0 && a === b) v = 1 - a; else if (c >= 0 && c === d) v = 1 - c; else if (a >= 0 && a === c) v = 1 - a;
        if (v >= 0) { g[i] = v; ch = true; }
      }
      const t0 = L.filter(i => g[i] === 0).length, t1 = L.filter(i => g[i] === 1).length;
      if (t0 === N / 2 && t1 < N / 2) { L.forEach(i => { if (g[i] < 0) { g[i] = 1; ch = true; } }); }
      else if (t1 === N / 2 && t0 < N / 2) { L.forEach(i => { if (g[i] < 0) { g[i] = 0; ch = true; } }); }
    }
  }
  return g.every(x => x >= 0);
}
SPELLEN.push({
  id: 'binairo', naam: 'Binairo', vak: 'logica', icoon: '0️⃣',
  kort: 'Puzzelen met nullen en enen.',
  uitleg: 'Vul het rooster met 0 en 1. Nooit meer dan twee dezelfde naast of onder elkaar. Elke rij en kolom heeft evenveel nullen als enen. Klik op een vakje om te wisselen tussen leeg, 0 en 1.',
  maak(n, doos) {
    const N = [0, 6, 8, 10, 10, 12][n];
    const opl = binairoVol(N);
    const g = opl.slice();
    const minGegeven = [0, 0.5, 0.42, 0.38, 0, 0][n] * N * N;
    for (const i of U.shuffle([...Array(N * N).keys()])) {
      if (g.filter(x => x >= 0).length <= minGegeven) break;
      const t = g[i]; g[i] = -1; if (!binairoLogisch(g, N)) g[i] = t;
    }
    const st = g.slice(), knoppen = [];
    const rooster = U.el('div', { class: 'bin', style: `grid-template-columns: repeat(${N}, var(--bc))` });
    for (let i = 0; i < N * N; i++) {
      const b = U.el('button', { class: 'bin-cel' + (g[i] >= 0 ? ' gegeven' : ''), onclick: () => { if (g[i] >= 0 || b.classList.contains('hint')) return; st[i] = st[i] === -1 ? 0 : st[i] === 0 ? 1 : -1; b.textContent = st[i] < 0 ? '' : st[i]; b.classList.remove('fout'); } }, g[i] >= 0 ? String(g[i]) : '');
      knoppen.push(b); rooster.append(b);
    }
    doos.append(U.el('div', { class: 'scroll-x' }, rooster));
    return {
      controleer() {
        if (st.includes(-1)) return { ok: false, msg: `Nog ${st.filter(x => x < 0).length} vakjes leeg.` };
        const fout = new Set();
        for (let k = 0; k < N; k++) {
          const rij = [...Array(N).keys()].map(c => k * N + c), kol = [...Array(N).keys()].map(r => r * N + k);
          for (const L of [rij, kol]) {
            if (L.filter(i => st[i] === 0).length !== N / 2) L.forEach(i => fout.add(i));
            for (let j = 2; j < N; j++) if (st[L[j]] === st[L[j - 1]] && st[L[j]] === st[L[j - 2]]) [L[j], L[j - 1], L[j - 2]].forEach(i => fout.add(i));
          }
        }
        const rijen = [...Array(N).keys()].map(r => st.slice(r * N, r * N + N).join()), kols = [...Array(N).keys()].map(c => [...Array(N).keys()].map(r => st[r * N + c]).join());
        const dubbel = new Set(rijen).size < N || new Set(kols).size < N;
        knoppen.forEach((b, i) => b.classList.toggle('fout', fout.has(i) && g[i] < 0));
        if (fout.size) return { ok: false, msg: 'Niet alles klopt: kijk naar de rode vakjes.' };
        if (dubbel) return { ok: false, msg: 'Twee rijen of twee kolommen zijn precies hetzelfde. Dat mag niet.' };
        return { ok: true };
      },
      hint() {
        const kand = [...Array(N * N).keys()].filter(i => st[i] !== opl[i]);
        if (!kand.length) return 'Alles staat juist!';
        const i = U.pick(kand); st[i] = opl[i]; knoppen[i].textContent = opl[i]; knoppen[i].classList.add('hint');
        return 'Eén vakje is ingevuld (paars).';
      }
    };
  }
});

/* ---------------- Lichtjes uit ---------------- */
SPELLEN.push({
  id: 'lichtjes', naam: 'Lichtjes uit', vak: 'logica', icoon: '💡',
  kort: 'Doe alle lampjes uit.',
  uitleg: 'Als je op een lampje klikt, wisselen dat lampje én zijn buren (boven, onder, links, rechts) van aan naar uit of omgekeerd. Doe alle lampjes uit!',
  maak(n, doos, ctx) {
    const N = [0, 3, 4, 5, 5, 6][n], k = [0, 3, 5, 7, 10, 14][n];
    const aan = Array(N * N).fill(false), nodig = new Set();
    const druk = (i, tel = true) => {
      const r = Math.floor(i / N), c = i % N;
      [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => { const rr = r + dr, cc = c + dc; if (rr >= 0 && cc >= 0 && rr < N && cc < N) aan[rr * N + cc] = !aan[rr * N + cc]; });
      if (nodig.has(i)) nodig.delete(i); else nodig.add(i);
      if (tel) { zetten++; teken(); if (aan.every(x => !x)) ctx.klaar?.(); }
    };
    let zetten = 0;
    U.shuffle([...Array(N * N).keys()]).slice(0, k).forEach(i => druk(i, false));
    const knoppen = [];
    const info = U.el('div', { class: 'route-info' });
    const rooster = U.el('div', { class: 'licht', style: `grid-template-columns: repeat(${N}, var(--lc2))` });
    for (let i = 0; i < N * N; i++) { const b = U.el('button', { onclick: () => { knoppen.forEach(x => x.classList.remove('hint')); druk(i); } }); knoppen.push(b); rooster.append(b); }
    const teken = () => { knoppen.forEach((b, i) => b.classList.toggle('aan', aan[i])); info.replaceChildren(U.el('span', {}, `Zetten: ${zetten}`), U.el('span', {}, `Lampjes aan: ${aan.filter(Boolean).length}`)); };
    teken();
    doos.append(U.el('p', { class: 'opdracht' }, `Het kan in ${nodig.size} zetten. Lukt het jou?`), info, rooster);
    return {
      controleer() { const a = aan.filter(Boolean).length; return a ? { ok: false, msg: `Er branden nog ${a} lampjes.` } : { ok: true }; },
      hint() { const i = [...nodig][0]; if (i === undefined) return 'Alles is al uit!'; druk(i); knoppen[i].classList.add('hint'); return 'Ik drukte op het lampje met de paarse rand.'; }
    };
  }
});

/* ---------------- Torens van Hanoi ---------------- */
function hanoiZet(pos, k, doel) {
  for (let d = k - 1; d >= 0; d--) {
    if (pos[d] !== doel) { const ander = 3 - pos[d] - doel; return hanoiZet(pos, d, ander) || [pos[d], doel]; }
  }
  return null;
}
SPELLEN.push({
  id: 'hanoi', naam: 'Torens van Hanoi', vak: 'logica', icoon: '🗼',
  kort: 'Verplaats de toren, schijf per schijf.',
  uitleg: 'Verplaats de hele toren naar de rechterpaal. Je mag maar één schijf tegelijk verplaatsen en nooit een grote schijf op een kleinere leggen. Klik op een paal om de bovenste schijf te nemen en daarna op de paal waar ze naartoe moet.',
  maak(n, doos, ctx) {
    const D = [0, 3, 4, 5, 6, 7][n], min = 2 ** D - 1;
    const pos = Array(D).fill(0);
    let gekozen = null, zetten = 0;
    const info = U.el('div', { class: 'route-info' });
    const palen = [0, 1, 2].map(p => U.el('button', { class: 'paal', onclick: () => klik(p) }));
    const kleuren = ['#E8772E', '#0F5257', '#7C4DCC', '#D4A017', '#C8372D', '#2E8B57', '#3B6FB6'];
    const boven = p => { for (let d = 0; d < D; d++) if (pos[d] === p) return d; return -1; };
    const teken = () => {
      palen.forEach((el, p) => {
        const schijven = [];
        for (let d = D - 1; d >= 0; d--) if (pos[d] === p) schijven.push(U.el('div', { class: 'schijf' + (gekozen === p && d === boven(p) ? ' op' : ''), style: `width:${30 + d * 60 / D}%;background:${kleuren[d % 7]}` }));
        el.replaceChildren(U.el('div', { class: 'stok' }), ...schijven);
        el.classList.toggle('kies', gekozen === p);
      });
      info.replaceChildren(U.el('span', {}, `Zetten: ${zetten}`), U.el('span', {}, `Minimum: ${min}`));
    };
    const verzet = (a, b) => { const d = boven(a), e = boven(b); if (d < 0 || (e >= 0 && e < d)) return false; pos[d] = b; zetten++; return true; };
    function klik(p) {
      if (gekozen === null) { if (boven(p) >= 0) gekozen = p; }
      else { if (p !== gekozen && !verzet(gekozen, p)) palen[p].animate?.([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], 200); gekozen = null; }
      teken();
      if (pos.every(x => x === 2)) ctx.klaar?.();
    }
    teken();
    doos.append(info, U.el('div', { class: 'hanoi' }, palen));
    return {
      controleer() { return pos.every(x => x === 2) ? { ok: true } : { ok: false, msg: 'De toren staat nog niet helemaal op de rechterpaal.' }; },
      hint() { gekozen = null; const z = hanoiZet(pos, D, 2); if (!z) return 'Klaar!'; verzet(z[0], z[1]); teken(); if (pos.every(x => x === 2)) ctx.klaar?.(); return `Ik heb één zet gedaan: van paal ${z[0] + 1} naar paal ${z[1] + 1}.`; }
    };
  }
});

/* ---------------- Schuifpuzzel ---------------- */
SPELLEN.push({
  id: 'schuif', naam: 'Schuifpuzzel', vak: 'logica', icoon: '🧮',
  kort: 'Schuif de getallen in de juiste volgorde.',
  uitleg: 'Klik op een tegel naast het lege vak om hem te verschuiven. Zet alle getallen op volgorde, met het lege vak rechtsonder.',
  maak(n, doos, ctx) {
    const N = [0, 3, 3, 4, 4, 5][n], schud = [0, 15, 60, 40, 150, 250][n];
    const T = [...Array(N * N).keys()].map(i => (i + 1) % (N * N));
    let leeg = N * N - 1;
    const stapel = [];
    const buren = p => { const r = Math.floor(p / N), c = p % N, b = []; if (r > 0) b.push(p - N); if (r < N - 1) b.push(p + N); if (c > 0) b.push(p - 1); if (c < N - 1) b.push(p + 1); return b; };
    const schuif = (p, registreer = true) => {
      T[leeg] = T[p]; T[p] = 0;
      if (registreer) { if (stapel.length && stapel[stapel.length - 1] === p) stapel.pop(); else stapel.push(leeg); }
      leeg = p;
    };
    let vorige = -1;
    for (let k = 0; k < schud; k++) { const opt = buren(leeg).filter(x => x !== vorige); const p = U.pick(opt); vorige = leeg; schuif(p); }
    let zetten = 0;
    const info = U.el('div', { class: 'route-info' });
    const rooster = U.el('div', { class: 'schuif', style: `grid-template-columns: repeat(${N}, var(--sc))` });
    const opgelost = () => T.every((v, i) => v === (i + 1) % (N * N));
    const teken = () => {
      rooster.replaceChildren(...T.map((v, p) => v ? U.el('button', { class: 'tegelS' + (v === p + 1 ? ' juist' : ''), onclick: () => { if (buren(leeg).includes(p)) { schuif(p); zetten++; teken(); if (opgelost()) ctx.klaar?.(); } } }, String(v)) : U.el('div', { class: 'tegelS leeg' })));
      info.replaceChildren(U.el('span', {}, `Zetten: ${zetten}`));
    };
    teken();
    doos.append(info, rooster);
    return {
      controleer() { return opgelost() ? { ok: true } : { ok: false, msg: 'Nog niet alles staat op volgorde.' }; },
      hint() {
        if (opgelost()) return 'Klaar!';
        const p = stapel[stapel.length - 1]; schuif(p); zetten++; teken(); if (opgelost()) ctx.klaar?.();
        return 'Ik heb één tegel voor je verschoven.';
      }
    };
  }
});
