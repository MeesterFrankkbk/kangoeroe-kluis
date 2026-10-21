'use strict';
/* Kangoeroe-Kluis — leerlingenapp */
const $app = document.getElementById('app');
const el = U.el;
const toon = (...k) => $app.replaceChildren(...k.flat().filter(x => x != null && x !== false));

const opslag = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } },
  weg(k) { try { localStorage.removeItem(k); } catch { } },
};
const sessie = {
  get() { try { return JSON.parse(sessionStorage.getItem('kk_sessie')); } catch { return null; } },
  set(v) { try { v ? sessionStorage.setItem('kk_sessie', JSON.stringify(v)) : sessionStorage.removeItem('kk_sessie'); } catch { } },
};

const S = { online: false, leerlingen: [], wie: null, resultaten: [], vak: opslag.get('kk_vak', 'taal'), toetsen: [] };
const inVolgorde = () => !!(EIGEN.instellingen && EIGEN.instellingen.niveausInVolgorde);
const volleNaam = l => `${l.voornaam} ${l.naam}`;

async function api(actie, body) {
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 10000);
  try {
    const r = await fetch(`/api?actie=${actie}`, { method: body ? 'POST' : 'GET', headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined, signal: ctrl.signal, cache: 'no-store' });
    const d = await r.json().catch(() => { throw new Error('geen-api'); });
    if (!r.ok) throw Object.assign(new Error(d.fout || 'Serverfout'), { status: r.status });
    return d;
  } finally { clearTimeout(t); }
}
const sleutel = () => ({ id: S.wie.id, pin: S.wie.pin });

/* ---------- resultaten & medailles ---------- */
const sleutelRes = id => 'kk_res_' + id;
const punten = r => r.juist ? Math.max(r.niveau * 10 - r.hints * 3, r.niveau * 3) : 0;
const besteNiveau = (spel, thema) => Math.max(0, ...S.resultaten.filter(r => r.spel === spel.id && r.juist && (thema === undefined || !spel.perThema || r.thema === thema)).map(r => r.niveau));
const totaal = () => S.resultaten.reduce((a, r) => a + (r.punten || 0), 0);
/* persoonlijk record: snelste keer juist zonder hints, per onderdeel, lijst en niveau */
const record = (spel, thema, niveau) => { let b = null; for (const r of S.resultaten) if (r.spel === spel && r.niveau === niveau && r.juist && !r.hints && (r.thema || '') === (thema || '') && (b === null || r.seconden < b)) b = r.seconden; return b; };
const mmss = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function bewaarResultaat(item) {
  S.resultaten.push(item);
  opslag.set(sleutelRes(S.wie.id), S.resultaten);
  if (!S.online) return;
  const rij = opslag.get('kk_wachtrij', []);
  rij.push({ id: S.wie.id, pin: S.wie.pin, item });
  opslag.set('kk_wachtrij', rij);
  verstuurWachtrij();
}
let bezig = false;
async function verstuurWachtrij() {
  if (!S.online || bezig) return; bezig = true;
  try {
    const rij = opslag.get('kk_wachtrij', []);
    const groepen = {};
    for (const x of rij) (groepen[x.id] = groepen[x.id] || { id: x.id, pin: x.pin, items: [] }).items.push(x.item);
    for (const g of Object.values(groepen)) {
      try {
        await api('resultaat', g);
        opslag.set('kk_wachtrij', opslag.get('kk_wachtrij', []).filter(x => x.id !== g.id || !g.items.some(i => i.id === x.item.id)));
      } catch (e) { if (e.status === 401) opslag.set('kk_wachtrij', opslag.get('kk_wachtrij', []).filter(x => x.id !== g.id)); }
    }
  } finally { bezig = false; }
}

/* ---------- kop ---------- */
function kop() {
  const r = document.getElementById('kop-rechts');
  if (!S.wie) { r.replaceChildren(); return; }
  r.replaceChildren(
    el('span', { class: 'pil' }, `${volleNaam(S.wie)}${S.wie.klas ? ' · ' + S.wie.klas : ''}`),
    el('span', { class: 'pil' }, `⭐ ${totaal()}`),
    el('button', { onclick: () => verlaatSpel(toonMijn) }, 'Mijn resultaten'),
    el('button', { onclick: () => verlaatSpel(afmelden) }, 'Afmelden'));
}
function afmelden() { sessie.set(null); S.wie = null; S.resultaten = []; kop(); toonLogin(); }

/* ---------- start ---------- */
async function start() {
  try {
    if (location.protocol === 'file:') throw new Error('lokaal');
    const [d, inh] = await Promise.all([api('leerlingen'), api('inhoud').catch(() => ({ inhoud: {} }))]);
    S.online = true; S.leerlingen = d.leerlingen || []; EIGEN = inh.inhoud || {};
    document.getElementById('modus').textContent = 'Resultaten gaan naar je leerkracht';
  } catch {
    S.online = false;
    document.getElementById('modus').textContent = 'Oefenmodus: resultaten blijven op deze computer';
  }
  const s = sessie.get();
  if (s && (!S.online || S.leerlingen.some(l => l.id === s.id))) { S.wie = s; S.resultaten = opslag.get(sleutelRes(s.id), []); kop(); toonHome(); verstuurWachtrij(); laadToetsen(); }
  else toonLogin();
}

/* ---------- aanmelden: klas → naam → code ---------- */
function toonLogin(fout) {
  kop();
  const w = el('div', { class: 'welkom' }, el('h1', {}, 'Welkom in de Kangoeroe-Kluis'));
  if (fout) w.append(el('div', { class: 'melding fout' }, fout));
  if (!S.online) {
    w.append(el('p', {}, 'Oefenmodus: je resultaten worden alleen op deze computer bewaard.'));
    const vn = U.tekst('tekst', 'Voornaam'), nm = U.tekst('tekst', 'Familienaam'), kl = U.tekst('tekst', 'Klas');
    w.append(el('div', { class: 'formulier' }, vn, nm, kl), el('button', { class: 'knop', onclick: () => {
      if (!vn.value.trim() || !nm.value.trim()) return vn.focus();
      const l = { id: 'lokaal-' + U.norm(vn.value + nm.value + kl.value), voornaam: vn.value.trim(), naam: nm.value.trim(), klas: kl.value.trim(), pin: '' };
      aanmelden(l, opslag.get(sleutelRes(l.id), []));
    } }, 'Start'));
    toon(w); return;
  }
  const klassen = [...new Set(S.leerlingen.map(l => l.klas || ''))].sort((a, b) => a.localeCompare(b, 'nl', { numeric: true }));
  if (!S.leerlingen.length) w.append(el('div', { class: 'melding info' }, 'Je leerkracht heeft nog geen leerlingen toegevoegd.'));
  else if (klassen.length === 1) return toonNamen(klassen[0]);
  else w.append(el('p', {}, 'Kies je klas.'), el('div', { class: 'klassen' }, klassen.map(k => el('button', { class: 'klasknop', onclick: () => toonNamen(k) }, k || 'Zonder klas'))));
  toon(w);
}
function toonNamen(klas) {
  const ll = S.leerlingen.filter(l => (l.klas || '') === klas).sort((a, b) => a.naam.localeCompare(b.naam, 'nl') || a.voornaam.localeCompare(b.voornaam, 'nl'));
  toon(el('div', { class: 'welkom' },
    el('h1', {}, klas ? `Klas ${klas}` : 'Kies je naam'), el('p', {}, 'Klik op je naam.'),
    el('div', { class: 'namen' }, ll.map(l => el('button', { class: 'naamknop', onclick: () => toonPin(l) }, el('b', {}, l.naam), el('span', {}, l.voornaam)))),
    el('p', {}, el('a', { href: '#', onclick: e => { e.preventDefault(); toonLogin(); } }, '← Andere klas'))));
}
function toonPin(l) {
  let pin = '';
  const vak = el('div', { class: 'pinvak' }), melding = el('div');
  const teken = () => vak.replaceChildren(...[...Array(Math.max(4, pin.length))].map((_, k) => el('span', {}, pin[k] ? '●' : '')));
  const probeer = async () => {
    if (pin.length < 4) { melding.replaceChildren(el('div', { class: 'melding fout' }, 'Je code heeft minstens 4 cijfers.')); return; }
    melding.replaceChildren(el('div', { class: 'melding info' }, 'Even controleren…'));
    try {
      const d = await api('login', { id: l.id, pin });
      const lokaal = opslag.get(sleutelRes(l.id), []), ids = new Set((d.resultaten || []).map(r => r.id));
      aanmelden({ ...l, pin }, [...(d.resultaten || []), ...lokaal.filter(r => !ids.has(r.id))]);
    } catch (e) { pin = ''; teken(); melding.replaceChildren(el('div', { class: 'melding fout' }, e.status === 401 ? 'Die code klopt niet. Probeer opnieuw.' : 'Geen verbinding. Probeer opnieuw.')); }
  };
  const druk = c => { if (c === '⌫') pin = pin.slice(0, -1); else if (c === 'OK') return probeer(); else if (pin.length < 6) pin += c; teken(); };
  teken();
  toon(el('div', { class: 'welkom' },
    el('h1', {}, `Hallo ${l.voornaam}!`), el('p', {}, 'Tik je persoonlijke code en druk op OK.'),
    vak, el('div', { class: 'pad' }, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'].map(c => el('button', { class: c === 'OK' ? 'ok' : '', onclick: () => druk(c) }, c))),
    melding, el('p', {}, el('a', { href: '#', onclick: e => { e.preventDefault(); toonNamen(l.klas || ''); } }, '← Dat ben ik niet'))));
}
document.addEventListener('keydown', e => {
  const pad = document.querySelector('.pad'); if (!pad) return;
  const k = /^[0-9]$/.test(e.key) ? e.key : e.key === 'Backspace' ? '⌫' : e.key === 'Enter' ? 'OK' : null;
  if (k) [...pad.querySelectorAll('button')].find(b => b.textContent === k)?.click();
});
function aanmelden(wie, resultaten) {
  S.wie = wie; S.resultaten = resultaten; sessie.set(wie);
  opslag.set(sleutelRes(wie.id), resultaten);
  kop(); toonHome(); verstuurWachtrij(); laadToetsen();
}

/* ---------- home ---------- */
async function laadToetsen() {
  if (!S.online || !S.wie) return;
  try { S.toetsen = (await api('toetsen', sleutel())).toetsen || []; } catch { S.toetsen = []; }
  const t = document.querySelector('[data-vak="toetsen"] .teller');
  const open = S.toetsen.filter(x => x.status !== 'ingeleverd').length;
  if (t) { t.textContent = open || ''; t.style.display = open ? '' : 'none'; }
  if (S.vak === 'toetsen' && document.querySelector('.home-kop')) toonHome();
}
function toonHome() {
  stopSpel(); kop();
  const open = S.toetsen.filter(x => x.status !== 'ingeleverd').length;
  const tabs = el('div', { class: 'vaktabs' },
    Object.entries(VAKKEN).map(([k, v]) => el('button', { 'data-vak': k, class: S.vak === k ? 'aan' : '', onclick: () => { S.vak = k; opslag.set('kk_vak', k); toonHome(); } }, `${v.icoon} ${v.naam}`)),
    el('button', { 'data-vak': 'paspoort', class: S.vak === 'paspoort' ? 'aan' : '', onclick: () => { S.vak = 'paspoort'; toonHome(); } }, '🛂 Mijn paspoort'),
    S.online ? el('button', { 'data-vak': 'toetsen', class: S.vak === 'toetsen' ? 'aan' : '', onclick: () => { S.vak = 'toetsen'; toonHome(); laadToetsen(); } }, '🗒️ Toetsen', el('span', { class: 'teller', style: open ? '' : 'display:none' }, String(open || ''))) : null);
  if (S.vak === 'paspoort') { toon(el('div', { class: 'home-kop' }, el('h1', {}, 'Mijn Kangoeroe-paspoort')), tabs, el('div', { id: 'pp' }, el('p', { class: 'laden' }, 'Even laden…'))); toonPaspoort(); return; }
  if (S.vak === 'toetsen') { toon(el('div', { class: 'home-kop' }, el('h1', {}, 'Toetsen')), tabs, toetsLijst()); return; }
  const spellen = SPELLEN.filter(s => s.vak === S.vak);
  const raster = el('div', { class: 'raster' }, spellen.map(s => {
    const best = besteNiveau(s);
    return el('button', { class: 'kaart', onclick: () => toonStart(s) },
      el('div', { class: 'kaart-kop' }, el('span', { class: 'ico' }, s.icoon), best ? medaille(best) : null),
      el('h3', {}, s.naam), el('p', {}, s.kort || ''),
      el('div', { class: 'pips' }, [1, 2, 3, 4, 5].map(n => el('span', { class: `pip${n <= best ? ' m' + n : ''}`, title: NIVEAUS[n] }))));
  }));
  const med = spellen.reduce((a, s) => a + besteNiveau(s), 0);
  toon(weekBanner(), el('div', { class: 'home-kop' }, el('h1', {}, 'Kies een kluis'), el('div', { class: 'stil' }, `${VAKKEN[S.vak].naam}: ${med} van ${spellen.length * 5} medailles. ${inVolgorde() ? 'Haal brons → zilver → goud → platinum → diamant.' : 'Kies zelf op welk niveau je begint!'}`)), tabs, raster);
}

/* ---------- uitdaging van de week (automatisch gekozen) ---------- */
function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const dag = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dag); const jan1 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return { jaar: t.getUTCFullYear(), week: Math.ceil(((t - jan1) / 864e5 + 1) / 7) };
}
function weekMaandag(d = new Date()) { const m = new Date(d); m.setHours(0, 0, 0, 0); m.setDate(m.getDate() - ((m.getDay() + 6) % 7)); return m; }
function uitdagingVanDeWeek(d = new Date()) {
  const { jaar, week } = isoWeek(d);
  const kandidaten = SPELLEN.filter(s => s.id !== 'raadsels' && s.vak !== 'toneel' && VAKKEN[s.vak]).sort((a, b) => a.id.localeCompare(b.id));
  let h = (jaar * 53 + week) >>> 0; /* vaste 'toevallige' keuze per week (mulberry32) */
  const rnd = () => { h = (h + 0x6D2B79F5) >>> 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  /* elke week een ander vak dan vorige week: draai door de vakken */
  const vakken = [...new Set(kandidaten.map(s => s.vak))];
  const vak = vakken[(jaar * 53 + week) % vakken.length];
  const uitVak = kandidaten.filter(s => s.vak === vak);
  const spel = uitVak[Math.floor(rnd() * uitVak.length)];
  const niveau = [2, 3, 3, 4][Math.floor(rnd() * 4)];
  return { spel, niveau, week };
}
function weekGedaan(u) { const m = weekMaandag().getTime(); return S.resultaten.some(r => r.spel === u.spel.id && r.juist && r.niveau >= u.niveau && Date.parse(r.datum) >= m); }
function weekBanner() {
  const u = uitdagingVanDeWeek(); if (!u.spel) return null;
  const klaar = weekGedaan(u);
  const start = () => { const soort = u.spel.bron, lijst = soort ? bronnen(soort) : []; const bron = soort ? (lijst.find(b => b.id === u.spel.standaardBron) || lijst.find(b => !b.eigen) || lijst[0]) : null; toonSpel(u.spel, u.niveau, bron); };
  return el('div', { class: 'week' + (klaar ? ' gedaan' : '') }, el('span', { class: 'ico' }, klaar ? '✅' : '🏆'),
    el('div', { class: 'week-tekst' }, el('b', {}, `Uitdaging van week ${u.week}: `), `${u.spel.icoon} ${u.spel.naam} (${VAKKEN[u.spel.vak].naam}) op niveau `, medaille(u.niveau), ` ${NIVEAUS[u.niveau]}`,
      el('small', {}, klaar ? 'Gelukt deze week! Volgende maandag wacht er een nieuwe uitdaging.' : 'Elke maandag kiest de kluis een nieuwe uitdaging. Lukt het jou deze week?')),
    el('button', { class: 'knop' + (klaar ? ' tweede' : ''), onclick: start }, klaar ? 'Nog eens' : 'Doe mee'));
}

/* ---------- startscherm van een spel ---------- */
function toonStart(spel) {
  stopSpel(); kop();
  const soort = spel.bron, lijst = soort ? bronnen(soort) : [];
  const gekozenId = opslag.get('kk_bron_' + spel.id, null);
  let bron = soort ? (lijst.find(b => b.id === gekozenId) || lijst.find(b => b.eigen) || lijst.find(b => b.id === spel.standaardBron) || lijst[0]) : null;
  const inhoud = el('div');
  const teken = () => {
    const thema = spel.perThema ? bron?.id : undefined;
    const best = besteNiveau(spel, thema);
    inhoud.replaceChildren(
      el('div', { class: 'niveaus' }, [1, 2, 3, 4, 5].map(n => {
        const open = !inVolgorde() || n <= best + 1;
        return el('button', { class: `niveauknop n${n}${best >= n ? ' gehaald' : ''}`, disabled: !open, onclick: () => toonSpel(spel, n, bron) },
          medaille(n, 'groot' + (open ? '' : ' slot')), el('span', {}, NIVEAUS[n]), el('small', {}, best >= n ? 'gehaald' : open ? 'speel' : '🔒'), (rec => rec !== null ? el('small', { class: 'rec' }, `⏱ ${mmss(rec)}`) : null)(record(spel.id, spel.bron ? bron?.id || '' : '', n)));
      })),
      spel.leer || spel.druk ? el('div', { class: 'knoppenrij', style: 'justify-content:center' }, spel.leer ? el('button', { class: 'knop tweede', onclick: () => toonLeer(spel, bron) }, spel.leerKnop || '📖 Eerst leren / bekijken') : null, spel.druk && bron ? spel.druk(bron) : null) : null);
  };
  const keuze = soort && lijst.length ? el('label', { class: 'bronkeuze' }, el('span', {}, BRONSOORTEN[soort].label + ':'),
    el('select', { onchange: e => { bron = lijst.find(b => b.id === e.target.value); opslag.set('kk_bron_' + spel.id, bron.id); teken(); } },
      lijst.map(b => { const bt = spel.perThema ? besteNiveau(spel, b.id) : 0; return el('option', { value: b.id, selected: b === bron }, (b.eigen ? '★ ' : '') + (b.naam || b.titel) + (b.niveau ? ` (${NIVEAUS[b.niveau]})` : '') + (bt ? ` ✓ ${NIVEAUS[bt]}` : '')); }))) : null;
  teken();
  toon(
    el('div', { class: 'spelkop' }, el('button', { class: 'knop tweede', onclick: toonHome }, '← Kluizen'), el('h1', {}, `${spel.icoon} ${spel.naam}`)),
    el('div', { class: 'uitleg' }, spel.uitleg),
    keuze, el('p', { class: 'stil', style: 'text-align:center' }, (inVolgorde() ? '' : 'Kies zelf je niveau: begin waar je denkt dat je uitdaging ligt. ') + (spel.perThema ? 'Je medailles tellen per lijst of tekst.' : '')), inhoud);
}

function toonLeer(spel, bron) {
  stopSpel();
  const doos = el('div', { class: 'speelveld' });
  toon(el('div', { class: 'spelkop' }, el('button', { class: 'knop tweede', onclick: () => toonStart(spel) }, '← Terug'), el('h1', {}, `📖 ${spel.naam}`), el('span', { class: 'stil' }, bron?.naam || bron?.titel || '')), doos);
  const r = spel.leer(doos, { bron, taal: spel.taal });
  huidig = { inst: r };
}

/* ---------- spel ---------- */
let klok = null, huidig = null;
function stopSpel() { clearInterval(klok); Spraak.stop(); huidig?.inst?.stop?.(); huidig = null; document.querySelector('.overlay')?.remove(); }
function verlaatSpel(doe) { if (huidig?.verlaat) huidig.verlaat(doe); else { stopSpel(); doe(); } }
function toonSpel(spel, niveau, bron) {
  stopSpel();
  const start = Date.now();
  let pogingen = 0, hints = 0, klaar = false, opgeslagen = false;
  const timer = el('span', { class: 'timer' }, '0:00');
  klok = setInterval(() => { const s = Math.floor((Date.now() - start) / 1000); timer.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }, 1000);
  const veld = el('div', { class: 'speelveld' });
  const fb = el('div', { class: 'feedback' });
  const thema = spel.bron ? bron?.id || '' : '';
  const registreer = juist => {
    if (opgeslagen) return; opgeslagen = true;
    const item = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), spel: spel.id, thema, themaNaam: bron?.naam || bron?.titel || '', niveau, juist, seconden: Math.round((Date.now() - start) / 1000), pogingen, hints, datum: new Date().toISOString() };
    if (Vers.spel === spel.id && Vers.items.length) item.items = Vers.items.slice(0, 20);
    item.vorigRecord = record(spel.id, thema, niveau);
    item.punten = punten(item);
    bewaarResultaat(item);
    return item;
  };
  const gelukt = () => {
    if (klaar) return; klaar = true; clearInterval(klok);
    const item = registreer(true);
    fb.className = 'feedback goed'; fb.textContent = 'Juist!';
    kop(); toonSucces(spel, niveau, bron, item);
  };
  const mislukt = msg => { if (klaar) return; klaar = true; clearInterval(klok); registreer(false); fb.className = 'feedback fout'; fb.textContent = msg || 'Jammer, deze keer niet gelukt.'; };
  const ctx = { bron, taal: spel.taal, klaar: () => setTimeout(gelukt, 250), mislukt, niveau };
  let inst;
  Vers.start(spel.id);
  try { inst = spel.maak(niveau, veld, ctx); } catch (e) { console.error(e); veld.append(el('p', {}, 'Oei, deze opgave lukte niet. Klik op "Nieuwe opgave".')); }
  huidig = { inst, verlaat: doe => { if (!klaar && pogingen + hints > 0) registreer(false); stopSpel(); doe(); } };
  window.__spel = inst;
  const controleer = () => {
    if (!inst || klaar) return;
    pogingen++;
    const r = inst.controleer();
    if (r.ok) gelukt(); else { fb.className = 'feedback ' + (r.info ? 'hint' : 'fout'); fb.textContent = r.msg; }
  };
  const hintKnop = el('button', { class: 'knop paars', onclick: () => { if (!inst || klaar) return; hints++; fb.className = 'feedback hint'; fb.textContent = '💡 ' + inst.hint(); hintKnop.textContent = `💡 Hint (${hints})`; } }, '💡 Hint');
  toon(
    el('div', { class: 'spelkop' },
      el('button', { class: 'knop tweede', onclick: () => verlaatSpel(() => toonStart(spel)) }, '← Terug'),
      el('h1', {}, `${spel.icoon} ${spel.naam}`), medaille(niveau), el('span', { class: 'stil' }, NIVEAUS[niveau]),
      bron ? el('span', { class: 'badge-thema' }, bron.naam || bron.titel) : null, timer),
    el('details', { class: 'uitleg' }, el('summary', {}, 'Hoe werkt het?'), spel.uitleg),
    veld,
    el('div', { class: 'acties' },
      el('button', { class: 'knop', onclick: controleer }, '✔ Controleer'), hintKnop,
      el('button', { class: 'knop tweede', onclick: () => verlaatSpel(() => toonSpel(spel, niveau, bron)) }, '↻ Nieuwe opgave')),
    fb);
  veld.querySelector('input:not([readonly]),textarea')?.focus({ preventScroll: true });
}

function toonSucces(spel, niveau, bron, item) {
  const volgende = niveau < MAX_NIVEAU ? niveau + 1 : null;
  const ov = el('div', { class: 'overlay' }, el('div', { class: 'succes' },
    medaille(niveau, 'reus'),
    el('h2', {}, 'De kluis is open!'),
    el('p', {}, `${spel.naam} · ${NIVEAUS[niveau]} in ${item.seconden} seconden${item.hints ? ` met ${item.hints} ${item.hints === 1 ? 'hint' : 'hints'}` : ', zonder hints'}.`),
    el('p', {}, el('b', {}, `+${item.punten} punten`)),
    !item.hints && item.vorigRecord !== null && item.seconden < item.vorigRecord ? el('p', { class: 'record' }, `🏅 Nieuw persoonlijk record! Vorige keer: ${mmss(item.vorigRecord)}, nu: ${mmss(item.seconden)}.`) : !item.hints && item.vorigRecord === null ? el('p', { class: 'stil' }, `Je eerste tijd zonder hints: ${mmss(item.seconden)}. Kun je die later verbeteren?`) : item.vorigRecord !== null ? el('p', { class: 'stil' }, `Jouw record op dit niveau: ${mmss(item.vorigRecord)} zonder hints.`) : null,
    el('div', { class: 'knoppenrij' },
      volgende ? el('button', { class: 'knop', onclick: () => { ov.remove(); toonSpel(spel, volgende, bron); } }, `Probeer ${NIVEAUS[volgende]}`) : null,
      el('button', { class: 'knop tweede', onclick: () => { ov.remove(); toonSpel(spel, niveau, bron); } }, 'Nog eens'),
      el('button', { class: 'knop tweede', onclick: () => { ov.remove(); toonHome(); } }, 'Alle kluizen'))));
  document.body.append(ov);
}

/* ---------- mijn resultaten ---------- */
function toonMijn() {
  stopSpel(); kop();
  const naam = id => SPELLEN.find(s => s.id === id)?.naam || id;
  const rijen = [...S.resultaten].reverse().slice(0, 100);
  toon(
    el('div', { class: 'spelkop' }, el('button', { class: 'knop tweede', onclick: toonHome }, '← Kluizen'), el('h1', {}, 'Mijn resultaten')),
    el('div', { class: 'tegels-kpi' }, Object.entries(VAKKEN).map(([k, v]) => { const sp = SPELLEN.filter(s => s.vak === k); return el('div', { class: 'kpi' }, el('span', {}, `${v.icoon} ${v.naam}`), el('b', {}, `${sp.reduce((a, s) => a + besteNiveau(s), 0)}/${sp.length * 5}`), el('span', {}, 'medailles')); })),
    rijen.length ? el('div', { class: 'tabelwrap' }, el('table', { class: 'lijst' },
      el('tr', {}, ['Wanneer', 'Spel', 'Lijst', 'Niveau', 'Gelukt?', 'Tijd', 'Hints', 'Punten'].map(h => el('th', {}, h))),
      rijen.map(r => el('tr', {}, el('td', {}, new Date(r.datum).toLocaleString('nl-BE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })), el('td', {}, naam(r.spel)), el('td', {}, r.themaNaam || ''), el('td', {}, medaille(r.niveau)), el('td', {}, r.juist ? '✅' : '—'), el('td', {}, `${r.seconden}s`), el('td', {}, String(r.hints)), el('td', {}, String(r.punten || 0))))))
      : el('p', {}, 'Nog geen resultaten. Kraak je eerste kluis!'));
}

/* ---------- toetsen ---------- */
const fmt = d => new Date(d).toLocaleString('nl-BE', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
function toetsLijst() {
  if (!S.toetsen.length) return el('div', { class: 'melding info' }, 'Er staat op dit moment geen toets voor je klaar.');
  return el('div', { class: 'raster' }, S.toetsen.map(t => el('div', { class: 'kaart toetskaart' },
    el('h3', {}, t.titel),
    el('p', { class: 'stil' }, `Open tot ${fmt(t.tot)}${t.duur ? ` · ${t.duur} minuten` : ''} · ${t.aantal} vragen`),
    t.status === 'ingeleverd'
      ? el('p', {}, el('b', {}, '✅ Ingeleverd'), t.score != null ? ` · ${t.score}/${t.max}` : '')
      : el('button', { class: 'knop', onclick: () => startToets(t) }, t.status === 'bezig' ? 'Verder werken' : 'Start de toets'))));
}
async function startToets(t) {
  if (t.status !== 'bezig' && !confirm(`Start "${t.titel}"?${t.duur ? `\nJe hebt ${t.duur} minuten.` : ''}\nJe kunt de toets maar één keer maken.`)) return;
  let d;
  try { d = await api('toets-start', { ...sleutel(), toetsId: t.id }); } catch (e) { alert(e.message); return laadToetsen(); }
  toonToets(d.toets, d.antwoorden || {}, d.nu);
}
function toonToets(toets, antwoorden, serverNu) {
  stopSpel();
  const lokaalSleutel = `kk_toets_${toets.id}_${S.wie.id}`;
  antwoorden = { ...antwoorden, ...opslag.get(lokaalSleutel, {}) };
  const verschil = serverNu ? serverNu - Date.now() : 0;
  let bewaarT = null, ingeleverd = false;
  const bewaar = () => { opslag.set(lokaalSleutel, antwoorden); clearTimeout(bewaarT); bewaarT = setTimeout(() => api('toets-bewaar', { ...sleutel(), toetsId: toets.id, antwoorden }).catch(() => { }), 1500); };
  const timer = el('span', { class: 'timer groot' });
  const vragen = toets.vragen;
  let nr = 0;
  const lijst = el('div', { class: 'toets-vragen' }, vragen.map(v => {
    const audio = v.audio ? Spraak.knoppen(v.audio, v.taal || 'fr') : null;
    if (v.type === 'tekst') {
      if (v.taal) { const tb = tekstBlok(v.tekst, v.taal, { verborgen: !!v.verborgen }); return el('div', { class: 'toets-tekst' }, v.titel ? el('h3', {}, v.titel) : null, tb.el); }
      return el('div', { class: 'toets-tekst' }, v.titel ? el('h3', {}, v.titel) : null, el('div', { class: 'leestekst' }, v.tekst.split('\n').map(p => el('p', {}, p))));
    }
    nr++;
    const kop = el('div', { class: 'trij-v' }, `${nr}. `, v.vraag, audio);
    if (v.type === 'mc') {
      const knoppen = v.opties.map((o, k) => el('button', { class: 'optie' + (String(antwoorden[v.id]) === String(k) ? ' gekozen' : ''), type: 'button', onclick: () => { antwoorden[v.id] = k; knoppen.forEach((b, j) => b.classList.toggle('gekozen', j === k)); bewaar(); } }, o));
      return el('div', { class: 'trij' }, kop, el('div', { class: 'opties' }, knoppen));
    }
    const i = U.tekst('tekst', 'Jouw antwoord'); i.value = antwoorden[v.id] || '';
    i.addEventListener('input', () => { antwoorden[v.id] = i.value; bewaar(); });
    return el('div', { class: 'trij' }, kop, i);
  }));
  const inleveren = async (auto) => {
    if (ingeleverd) return;
    const leeg = vragen.filter(v => v.type !== 'tekst' && (antwoorden[v.id] === undefined || antwoorden[v.id] === '')).length;
    if (!auto && leeg && !confirm(`Je hebt nog ${leeg} ${leeg === 1 ? 'vraag' : 'vragen'} niet beantwoord. Toch inleveren?`)) return;
    if (!auto && !leeg && !confirm('Ben je klaar? Na het inleveren kun je niets meer veranderen.')) return;
    ingeleverd = true; clearInterval(klok); clearTimeout(bewaarT);
    try {
      const r = await api('toets-inleveren', { ...sleutel(), toetsId: toets.id, antwoorden });
      opslag.weg(lokaalSleutel);
      toon(el('div', { class: 'welkom' }, el('h1', {}, auto ? '⏰ De tijd is om' : '✅ Ingeleverd'), el('p', {}, `Je toets "${toets.titel}" is ingeleverd.`),
        r.score != null ? el('p', { class: 'grote-score' }, `${r.score} / ${r.max}`) : el('p', {}, 'Je leerkracht bekijkt je antwoorden.'),
        el('button', { class: 'knop', onclick: () => { S.vak = 'toetsen'; laadToetsen(); toonHome(); } }, 'Terug')));
    } catch (e) { ingeleverd = false; alert('Inleveren lukte niet: ' + e.message + '\nProbeer het opnieuw.'); }
  };
  const tik = () => {
    if (!toets.eind) { timer.textContent = ''; return; }
    const rest = Math.round((toets.eind - (Date.now() + verschil)) / 1000);
    if (rest <= 0) { timer.textContent = '0:00'; inleveren(true); return; }
    timer.textContent = `⏱ ${Math.floor(rest / 60)}:${String(rest % 60).padStart(2, '0')}`;
    timer.classList.toggle('bijna', rest < 120);
  };
  klok = setInterval(tik, 1000); tik();
  huidig = { verlaat: doe => { if (confirm('Je verlaat de toets. Je antwoorden zijn bewaard en je kunt verder werken zolang de toets open is. Doorgaan?')) { clearInterval(klok); doe(); } } };
  toon(
    el('div', { class: 'spelkop' }, el('h1', {}, `📝 ${toets.titel}`), timer),
    toets.uitleg ? el('div', { class: 'uitleg' }, toets.uitleg) : null,
    toets.vragen.some(v => v.taal === 'fr') ? accentBalk() : null,
    el('div', { class: 'speelveld' }, lijst),
    el('div', { class: 'acties' }, el('button', { class: 'knop', onclick: () => inleveren(false) }, '📨 Inleveren'), el('button', { class: 'knop tweede', onclick: () => verlaatSpel(() => { S.vak = 'toetsen'; toonHome(); laadToetsen(); }) }, 'Later verder')));
}

/* ---------- Kangoeroe-paspoort ---------- */
let PP = null, PP_VAN = null, ppTimer = null;
const ppMelding = () => document.getElementById('pp-melding');
async function laadPaspoort() {
  if (PP && PP_VAN === S.wie.id) return;
  PP = null;
  if (S.online) { try { PP = (await api('paspoort', sleutel())).paspoort; } catch { } }
  PP = normPaspoort(PP || opslag.get('kk_pp_' + S.wie.id, null)); PP_VAN = S.wie.id;
}
function bewaarPaspoort() {
  opslag.set('kk_pp_' + S.wie.id, PP);
  const m = ppMelding(); if (m) m.textContent = 'Bewaren…';
  if (!S.online) { if (m) m.textContent = 'Bewaard op deze computer ✓'; return; }
  clearTimeout(ppTimer);
  ppTimer = setTimeout(async () => {
    try { const r = await api('paspoort-bewaar', { ...sleutel(), paspoort: PP }); PP.reflecties = r.paspoort.reflecties; if (ppMelding()) ppMelding().textContent = 'Bewaard ✓'; }
    catch { if (ppMelding()) ppMelding().textContent = '⚠ Niet bewaard: geen verbinding. Probeer later opnieuw.'; }
  }, 700);
}
async function toonPaspoort() {
  await laadPaspoort();
  const doos = document.getElementById('pp'); if (!doos) return;
  S.ppTab = S.ppTab || 'ik';
  S.ppJaar = S.ppJaar || schooljaarVan();
  const jaren = paspoortJaren(PP, S.resultaten).filter(j => j <= schooljaarVan());
  if (!jaren.includes(S.ppJaar)) S.ppJaar = schooljaarVan();
  const groei = groeiVan(S.resultaten, paspoortJaren(PP, S.resultaten));
  const jaarKeuze = () => el('select', { class: 'veld', onchange: e => { S.ppJaar = e.target.value; toonPaspoort(); } }, jaren.map(j => el('option', { value: j, selected: j === S.ppJaar }, `Schooljaar ${j}`)));
  const tabs = { ik: '🙋 Dit ben ik', uitdagingen: '🗺️ Mijn uitdagingen', reflectie: '💭 Reflectie', groei: '📈 Mijn groei' };
  const inhoud = el('div', { class: 'speelveld' });
  doos.replaceChildren(
    el('div', { class: 'pp-balk' }, el('div', { class: 'filters' }, Object.entries(tabs).map(([k, v]) => el('button', { class: S.ppTab === k ? 'aan' : '', onclick: () => { S.ppTab = k; toonPaspoort(); } }, v))),
      el('span', { id: 'pp-melding', class: 'stil' }), el('button', { class: 'knop tweede klein', onclick: () => drukPaspoort([{ leerling: S.wie, paspoort: PP, resultaten: S.resultaten, jaar: S.ppJaar }]) }, '🖨 Afdrukken')),
    inhoud);
  const tekstvak = (obj, k, rijen = 2, ph = '') => { const t = el('textarea', { class: 'tekst', rows: rijen, placeholder: ph }); t.value = obj[k] || ''; t.addEventListener('input', () => { obj[k] = t.value; bewaarPaspoort(); }); return t; };
  if (S.ppTab === 'ik') {
    const dit = PP.ditBenIk[S.ppJaar] = PP.ditBenIk[S.ppJaar] || {};
    const vorig = jaren.filter(j => j < S.ppJaar).reverse().map(j => PP.ditBenIk[j]).find(Boolean) || {};
    inhoud.append(el('div', { class: 'knoppenrij' }, jaarKeuze()),
      el('p', { class: 'opdracht' }, 'Vertel iets over jezelf. Elk schooljaar vul je dit opnieuw in: zo zie je hoe je verandert.'),
      el('div', { class: 'pp-raster' }, DIT_BEN_IK.map(([k, l]) => el('label', { class: 'pp-vak' }, el('b', {}, l), tekstvak(dit, k, 2), vorig[k] ? el('small', { class: 'stil' }, 'Vorig jaar: ' + vorig[k]) : null))));
  }
  if (S.ppTab === 'uitdagingen') {
    const gj = groeiVan(S.resultaten, [S.ppJaar])[0];
    inhoud.append(el('div', { class: 'knoppenrij' }, jaarKeuze()),
      el('div', { class: 'label' }, 'Mijn medailles in de Kangoeroe-Kluis (vult zichzelf in)'),
      el('p', { class: 'stil' }, 'Gekleurd = behaald dit schooljaar · ✓ = al behaald in een vorig schooljaar · grijs = nog te halen.'),
      el('div', { class: 'pp-kluizen' }, appVakken().map(({ k }) => { const v = gj.vakken[k]; return el('div', { class: 'pp-kluis' },
        el('div', { class: 'pp-kluis-kop' }, el('b', {}, `${VAKKEN[k].icoon} ${VAKKEN[k].naam}`), el('small', {}, `${v.med}/${v.max} medailles${v.nieuw ? ` · ${v.nieuw} nieuw dit jaar` : ''}`)),
        el('div', { class: 'pp-meter' }, el('i', { style: `width:${100 * v.med / v.max}%` })),
        spellenVan(k).map(sp => { const m = gj.medailles[sp.id]; return el('div', { class: 'pp-ond' }, el('span', {}, `${sp.icoon || ''} ${sp.naam}`),
          el('span', { class: 'pp-med' }, [1, 2, 3, 4, 5].map(n => medaille(n, n <= m.eerder ? 'eerder' : n <= m.nu ? '' : 'slot')))); })); })),
      el('div', { class: 'label' }, 'Andere uitdagingen (vul zelf in)'),
      el('div', { class: 'pp-lijst' }, paspoortUitdagingen().map(naam => {
        PP.uitdagingen[naam] = PP.uitdagingen[naam] || {};
        const u = PP.uitdagingen[naam][S.ppJaar] = PP.uitdagingen[naam][S.ppJaar] || {};
        const rij = el('div', { class: 'pp-uit' });
        const teken = () => rij.replaceChildren(
          el('b', { class: 'pp-naam' }, naam),
          el('div', { class: 'pp-status' }, [['nog', 'Nog niet'], ['bezig', 'Bezig'], ['klaar', 'Klaar ✔']].map(([w, t]) => el('button', { class: u.status === w ? 'aan ' + w : '', onclick: () => { u.status = w; if (w !== 'nog' && !u.datum) u.datum = new Date().toLocaleDateString('nl-BE'); bewaarPaspoort(); teken(); } }, t))),
          el('div', { class: 'pp-med', title: 'Mijn niveau' }, [1, 2, 3, 4, 5].map(n => el('button', { onclick: () => { u.niveau = u.niveau === n ? 0 : n; bewaarPaspoort(); teken(); } }, medaille(n, (u.niveau || 0) >= n ? '' : 'slot')))),
          el('div', { class: 'pp-gevoel', title: 'Hoe voelde het?' }, GEVOEL.map((e, i) => el('button', { class: u.gevoel === i + 1 ? 'aan' : '', onclick: () => { u.gevoel = i + 1; bewaarPaspoort(); teken(); } }, e))),
          (() => { const i = U.tekst('tekst pp-notitie', 'Korte notitie…'); i.value = u.notitie || ''; i.addEventListener('input', () => { u.notitie = i.value; bewaarPaspoort(); }); return i; })());
        teken(); return rij;
      })),
      el('p', { class: 'stil' }, 'Niveaus: brons = ik ken de basis · zilver = het lukt meestal · goud = het lukt vlot · platinum = ik kan het uitleggen · diamant = ik zoek er zelf nog moeilijkere uitdagingen bij.'));
  }
  if (S.ppTab === 'reflectie') {
    const r = S.ppBewerk || { id: 'r' + Date.now().toString(36), schooljaar: schooljaarVan(), periode: periodeVan(), datum: new Date().toISOString() };
    const schaal = (k, labels) => el('div', { class: 'pp-schaal' }, labels.map((t, i) => el('button', { class: r[k] === i + 1 ? 'aan' : '', onclick: e => { r[k] = i + 1; e.target.parentNode.querySelectorAll('button').forEach((b, j) => b.classList.toggle('aan', j === i)); } }, t)));
    const velden = Object.fromEntries(REFLECTIEVRAGEN.map(([k]) => { const t = el('textarea', { class: 'tekst', rows: 2 }); t.value = r[k] || ''; return [k, t]; }));
    const periode = el('select', { class: 'veld' }, PERIODES.map((p, i) => el('option', { value: i, selected: r.periode === i }, `${p} · ${r.schooljaar}`)));
    inhoud.append(el('h2', {}, S.ppBewerk ? 'Reflectie aanpassen' : 'Nieuwe reflectie'),
      el('div', { class: 'knoppenrij' }, periode),
      el('div', { class: 'pp-raster' },
        el('div', { class: 'pp-vak' }, el('b', {}, 'Hoe gemotiveerd was ik?'), schaal('motivatie', GEVOEL)),
        el('div', { class: 'pp-vak' }, el('b', {}, 'Hoeveel uitdaging voelde ik?'), schaal('uitdaging', ['te makkelijk', 'makkelijk', 'precies goed', 'pittig', 'te moeilijk']))),
      el('div', { class: 'pp-raster' }, REFLECTIEVRAGEN.map(([k, l]) => el('label', { class: 'pp-vak' }, el('b', {}, l), velden[k]))),
      el('div', { class: 'knoppenrij' },
        el('button', { class: 'knop', onclick: () => {
          REFLECTIEVRAGEN.forEach(([k]) => r[k] = velden[k].value.trim()); r.periode = Number(periode.value);
          if (!REFLECTIEVRAGEN.some(([k]) => r[k])) { ppMelding().textContent = 'Schrijf eerst iets in je reflectie.'; return; }
          const k = PP.reflecties.findIndex(x => x.id === r.id); if (k >= 0) PP.reflecties[k] = r; else PP.reflecties.push(r);
          S.ppBewerk = null; bewaarPaspoort(); toonPaspoort();
        } }, '💾 Bewaar reflectie'),
        S.ppBewerk ? el('button', { class: 'knop tweede', onclick: () => { S.ppBewerk = null; toonPaspoort(); } }, 'Annuleer') : null));
    const oud = [...PP.reflecties].sort((a, b) => b.datum.localeCompare(a.datum));
    if (oud.length) inhoud.append(el('h2', { style: 'margin-top:1.5rem' }, 'Mijn reflecties'), el('div', { class: 'pp-reflecties' }, oud.map(x => el('div', { class: 'pp-reflectie' },
      el('div', { class: 'pp-r-kop' }, el('b', {}, `${PERIODES[x.periode]} · ${x.schooljaar}`), el('span', {}, x.motivatie ? GEVOEL[x.motivatie - 1] : ''), el('button', { class: 'knop klein tweede', onclick: () => { S.ppBewerk = JSON.parse(JSON.stringify(x)); toonPaspoort(); scrollTo(0, 0); } }, 'Aanpassen')),
      REFLECTIEVRAGEN.filter(([k]) => x[k]).map(([k, l]) => el('p', {}, el('b', {}, l + ' '), x[k])),
      x.feedback ? el('div', { class: 'pp-feedback' }, el('b', {}, '💬 Feedback van je leerkracht: '), x.feedback.tekst) : null))));
  }
  if (S.ppTab === 'groei') {
    inhoud.append(el('p', { class: 'opdracht' }, 'Zo groei je in de Kangoeroe-Kluis, over 3 schooljaren. Elke kluis telt 5 medailles per onderdeel.'),
      el('div', { class: 'pp-groei' }, groei.filter(g => !g.toekomst).map((g, i) => el('div', { class: 'pp-jaar' }, el('h3', {}, `Jaar ${i + 1} · ${g.jaar}`),
        appVakken().map(({ k }) => { const v = g.vakken[k]; return el('div', { class: 'pp-balk-rij' }, el('span', {}, `${VAKKEN[k].icoon} ${VAKKEN[k].naam}`), el('div', { class: 'pp-meter' }, el('i', { style: `width:${v.max ? 100 * v.med / v.max : 0}%` })), el('small', {}, `${v.med}/${v.max}`)); }),
        el('p', { class: 'stil' }, `Kluizen gekraakt: ${g.gekraakt} · reflecties: ${PP.reflecties.filter(r => r.schooljaar === g.jaar).length}`)))));
  }
}

window.addEventListener('online', verstuurWachtrij);
setInterval(verstuurWachtrij, 60000);
start();
