'use strict';
/* Kangoeroe-Kluis — leerkrachtomgeving */
const el = U.el, $app = document.getElementById('app');
const toon = (...k) => $app.replaceChildren(...k.flat().filter(x => x != null && x !== false));
const S = { ww: sessionStorage.getItem('kk_lk') || '', data: null, toetsData: null, tab: 'overzicht', detail: null, klas: '', toetsBewerk: null, toetsRes: null, inhoudBewerk: null };
const naamSpel = id => SPELLEN.find(s => s.id === id)?.naam || id;
const spelVan = id => SPELLEN.find(s => s.id === id);
const fmtDatum = d => new Date(d).toLocaleString('nl-BE', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' });
const tijd = s => s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;
const volleNaam = l => `${l.naam} ${l.voornaam}`;
const nieuwId = (p = '') => p + Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(2, 7);

async function api(actie, body = {}) {
  const r = await fetch(`/api?actie=${actie}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...body, wachtwoord: S.ww }), cache: 'no-store' });
  const d = await r.json().catch(() => { throw new Error('De server is niet bereikbaar. Staat de site op Netlify via GitHub? (zie LEESMIJ)'); });
  if (!r.ok) throw Object.assign(new Error(d.fout || 'Fout'), { status: r.status });
  return d;
}
const melding = (soort, tekst) => el('div', { class: `melding ${soort}`, style: 'max-width:none' }, tekst);

/* ================= Aanmelden en laden ================= */
function toonLogin(fout) {
  document.getElementById('kop-rechts').replaceChildren();
  const inp = el('input', { class: 'tekst', type: 'password', placeholder: 'Wachtwoord leerkracht', style: 'max-width:320px;margin:0 auto;display:block;text-align:center' });
  const ga = async () => { S.ww = inp.value; await laad(); };
  inp.addEventListener('keydown', e => e.key === 'Enter' && ga());
  toon(el('div', { class: 'welkom' }, el('h1', {}, 'Leerkrachtomgeving'), fout ? melding('fout', fout) : null, inp, el('p', {}, el('button', { class: 'knop', onclick: ga }, 'Aanmelden'))));
  inp.focus();
}
async function laad() {
  try {
    const [d, t, pp] = await Promise.all([api('overzicht'), api('lk-toetsen'), api('lk-paspoorten').catch(() => ({ paspoorten: {} }))]);
    S.data = d; S.toetsData = t; S.paspoorten = pp.paspoorten || {}; EIGEN = d.inhoud || {};
    sessionStorage.setItem('kk_lk', S.ww);
    document.getElementById('kop-rechts').replaceChildren(
      el('button', { onclick: laad }, '↻ Vernieuwen'),
      el('button', { onclick: () => { sessionStorage.removeItem('kk_lk'); S.ww = ''; toonLogin(); } }, 'Afmelden'));
    teken();
  } catch (e) { sessionStorage.removeItem('kk_lk'); toonLogin(e.status === 401 ? 'Dat wachtwoord klopt niet.' : e.message); }
}
const klassen = () => [...new Set(S.data.leerlingen.map(l => l.klas || ''))].sort((a, b) => a.localeCompare(b, 'nl', { numeric: true }));

function teken() {
  const tabs = { overzicht: '📊 Overzicht', spellen: '🧩 Per spel', logboek: '🕘 Logboek', toetsen: '📝 Toetsen', inhoud: '✏️ Eigen inhoud', leerlingen: '👥 Leerlingen & codes' };
  const kop = [];
  if (S.data.standaardWachtwoord) kop.push(melding('fout', 'Let op: je gebruikt nog het standaardwachtwoord "kangoeroe". Stel in Netlify de omgevingsvariabele LEERKRACHT_WACHTWOORD in (zie LEESMIJ).'));
  const klasFilter = ['overzicht', 'spellen', 'logboek'].includes(S.tab) && !S.detail ? el('label', { class: 'rechts' }, 'Klas', el('select', { onchange: e => { S.klas = e.target.value; teken(); } }, el('option', { value: '' }, 'Alle klassen'), klassen().map(k => el('option', { value: k, selected: S.klas === k }, k || '(geen)')))) : null;
  kop.push(el('div', { class: 'tabs' }, Object.entries(tabs).map(([k, v]) => el('button', { class: S.tab === k ? 'aan' : '', onclick: () => { S.tab = k; S.detail = null; S.toetsBewerk = null; S.toetsRes = null; S.inhoudBewerk = null; teken(); } }, v)), klasFilter));
  let inhoud;
  if (S.detail) inhoud = detail(S.detail);
  else inhoud = { overzicht, spellen: perSpel, logboek: () => logboek(), toetsen: toetsenTab, inhoud: inhoudTab, leerlingen: beheer }[S.tab]();
  toon(...kop, inhoud);
}

/* ================= Overzicht ================= */
function leerlingenMetData() {
  const lijst = S.data.leerlingen.map(l => ({ ...l, inLijst: true }));
  for (const id of Object.keys(S.data.resultaten)) if (!lijst.some(l => l.id === id)) lijst.push({ id, naam: '(verwijderd)', voornaam: id, klas: '', inLijst: false });
  return lijst.filter(l => !S.klas || (l.klas || '') === S.klas).map(l => {
    const res = S.data.resultaten[l.id] || [];
    const best = s => Math.max(0, ...res.filter(r => r.spel === s.id && r.juist).map(r => r.niveau));
    const perVak = Object.fromEntries(Object.keys(VAKKEN).map(v => { const sp = SPELLEN.filter(s => s.vak === v); const r = res.filter(x => spelVan(x.spel)?.vak === v); return [v, { med: sp.reduce((a, s) => a + best(s), 0), max: sp.length * 5, gelukt: r.filter(x => x.juist).length, pogingen: r.length }]; }));
    return { ...l, res, perVak, punten: res.reduce((a, r) => a + (r.punten || 0), 0), hints: res.reduce((a, r) => a + r.hints, 0), laatste: res.length ? res.reduce((a, r) => r.datum > a ? r.datum : a, '') : null };
  }).sort((a, b) => (a.klas || '').localeCompare(b.klas || '', 'nl', { numeric: true }) || a.naam.localeCompare(b.naam, 'nl') || a.voornaam.localeCompare(b.voornaam, 'nl'));
}

function overzicht() {
  const ll = leerlingenMetData(), alle = ll.flatMap(l => l.res);
  const actief7 = ll.filter(l => l.laatste && Date.now() - Date.parse(l.laatste) < 7 * 864e5).length;
  const wrap = el('div');
  wrap.append(el('div', { class: 'tegels-kpi' },
    el('div', { class: 'kpi' }, el('b', {}, String(ll.length)), el('span', {}, 'leerlingen')),
    el('div', { class: 'kpi' }, el('b', {}, String(actief7)), el('span', {}, 'actief in de laatste 7 dagen')),
    el('div', { class: 'kpi' }, el('b', {}, String(alle.filter(r => r.juist).length)), el('span', {}, 'kluizen gekraakt')),
    el('div', { class: 'kpi' }, el('b', {}, alle.length ? Math.round(100 * alle.filter(r => r.juist).length / alle.length) + '%' : '–'), el('span', {}, 'van de pogingen gelukt'))));
  if (!ll.length) { wrap.append(melding('info', 'Nog geen leerlingen. Voeg ze toe bij "Leerlingen & codes".')); return wrap; }
  wrap.append(el('div', { class: 'rij-acties geen-print' }, el('button', { class: 'knop tweede', onclick: exportCSV }, '⬇ Exporteer naar Excel (CSV)'), el('button', { class: 'knop tweede', onclick: () => print() }, '🖨 Afdrukken'),
    el('span', { class: 'stil' }, 'Per vak: behaalde medailles / maximum, en hoeveel opgaven gelukt zijn. Klik op een leerling voor alle details.')));
  wrap.append(el('div', { class: 'tabelwrap' }, el('table', { class: 'lijst' },
    el('tr', {}, el('th', {}, 'Leerling'), el('th', {}, 'Klas'), Object.values(VAKKEN).map(v => el('th', { style: 'text-align:center' }, `${v.icoon} ${v.naam}`)), el('th', {}, 'Punten'), el('th', {}, 'Hints'), el('th', {}, 'Laatst actief')),
    ll.map(l => el('tr', { class: 'klik', onclick: () => { S.detail = l.id; teken(); } },
      el('td', {}, el('b', {}, l.naam), ' ', l.voornaam), el('td', {}, l.klas || ''),
      Object.keys(VAKKEN).map(v => { const x = l.perVak[v]; return el('td', { class: 'm' }, x.pogingen ? `${x.med}/${x.max}` : '–', x.pogingen ? el('small', {}, `${x.gelukt} gelukt van ${x.pogingen}`) : null); }),
      el('td', {}, String(l.punten)), el('td', {}, String(l.hints)), el('td', {}, l.laatste ? fmtDatum(l.laatste) : '–'))))));
  return wrap;
}

function detail(id) {
  S.klas = '';
  const l = leerlingenMetData().find(x => x.id === id);
  const wrap = el('div');
  wrap.append(el('div', { class: 'spelkop' }, el('button', { class: 'knop tweede', onclick: () => { S.detail = null; teken(); } }, '← Terug'), el('h1', {}, `${l.voornaam} ${l.naam}`), el('span', { class: 'badge-thema' }, l.klas || 'geen klas')));
  wrap.append(el('div', { class: 'tegels-kpi' }, Object.entries(VAKKEN).map(([k, v]) => { const x = l.perVak[k]; return el('div', { class: 'kpi' }, el('span', {}, `${v.icoon} ${v.naam}`), el('b', {}, `${x.med}/${x.max}`), el('span', {}, `medailles · ${x.gelukt}/${x.pogingen} gelukt`)); })));
  const rijen = SPELLEN.map(s => {
    const r = l.res.filter(x => x.spel === s.id); if (!r.length) return null;
    const ok = r.filter(x => x.juist), t = ok.map(x => x.seconden).sort((a, b) => a - b);
    const best = Math.max(0, ...ok.map(x => x.niveau));
    const themas = s.perThema ? [...new Set(ok.map(x => x.themaNaam))].filter(Boolean) : [];
    return el('tr', {}, el('td', {}, `${s.icoon} ${s.naam}`), el('td', {}, VAKKEN[s.vak].naam), el('td', {}, best ? [medaille(best), ' ', NIVEAUS[best]] : '–'),
      el('td', {}, String(r.length)), el('td', {}, String(ok.length)), el('td', {}, t.length ? tijd(t[Math.floor(t.length / 2)]) : '–'), el('td', {}, String(r.reduce((a, x) => a + x.hints, 0))),
      el('td', { style: 'white-space:normal' }, themas.join(', ')), el('td', {}, fmtDatum(r.reduce((a, x) => x.datum > a ? x.datum : a, ''))));
  }).filter(Boolean);
  wrap.append(el('h2', {}, 'Per spel'), rijen.length ? el('div', { class: 'tabelwrap' }, el('table', { class: 'lijst' }, el('tr', {}, ['Spel', 'Vak', 'Beste', 'Pogingen', 'Gelukt', 'Mediaan tijd', 'Hints', 'Lijsten/teksten', 'Laatst'].map(h => el('th', {}, h))), rijen)) : el('p', {}, 'Nog niets gespeeld.'));
  const tr = (S.toetsData.toetsen || []).map(t => ({ t, r: S.toetsData.resultaten[t.id]?.[id] })).filter(x => x.r);
  if (tr.length) wrap.append(el('h2', {}, 'Toetsen'), el('div', { class: 'tabelwrap' }, el('table', { class: 'lijst' }, el('tr', {}, ['Toets', 'Status', 'Score', '%'].map(h => el('th', {}, h))),
    tr.map(({ t, r }) => el('tr', {}, el('td', {}, t.titel), el('td', {}, r.ingeleverd ? `ingeleverd ${fmtDatum(r.ingeleverd)}` : 'bezig'), el('td', {}, `${r.score}/${r.max}`), el('td', {}, r.max ? Math.round(100 * r.score / r.max) + '%' : '–'))))));
  wrap.append(paspoortBlok(l));
  wrap.append(el('h2', {}, 'Logboek'), logboek(id));
  wrap.append(el('div', { class: 'rij-acties geen-print' }, el('button', { class: 'knop tweede', onclick: async () => {
    if (!confirm(`Alle oefenresultaten van ${l.voornaam} ${l.naam} wissen? Dit kan niet ongedaan gemaakt worden.`)) return;
    await api('wis', { id }); S.detail = null; await laad();
  } }, '🗑 Oefenresultaten van deze leerling wissen')));
  return wrap;
}

function perSpel() {
  const ids = new Set(leerlingenMetData().map(l => l.id));
  const alle = Object.entries(S.data.resultaten).filter(([id]) => ids.has(id)).flatMap(([, r]) => r);
  return el('div', {}, Object.entries(VAKKEN).map(([vk, v]) => el('div', {}, el('h2', {}, `${v.icoon} ${v.naam}`), el('div', { class: 'tabelwrap' }, el('table', { class: 'lijst' },
    el('tr', {}, ['Spel', 'Niveau', 'Pogingen', 'Gelukt', 'Slaagkans', 'Mediaan tijd', 'Gem. hints', 'Leerlingen'].map(h => el('th', {}, h))),
    SPELLEN.filter(s => s.vak === vk).flatMap(s => [1, 2, 3, 4, 5].map(n => {
      const r = alle.filter(x => x.spel === s.id && x.niveau === n), ok = r.filter(x => x.juist);
      const t = ok.map(x => x.seconden).sort((a, b) => a - b), pct = r.length ? Math.round(100 * ok.length / r.length) : null;
      return el('tr', {}, el('td', {}, n === 1 ? `${s.icoon} ${s.naam}` : ''), el('td', {}, medaille(n), ' ', NIVEAUS[n]), el('td', {}, String(r.length)), el('td', {}, String(ok.length)),
        el('td', {}, pct === null ? '–' : `${pct}%`), el('td', {}, t.length ? tijd(t[Math.floor(t.length / 2)]) : '–'), el('td', {}, ok.length ? (ok.reduce((a, x) => a + x.hints, 0) / ok.length).toFixed(1) : '–'),
        el('td', {}, String(new Set(Object.entries(S.data.resultaten).filter(([id, rs]) => ids.has(id) && rs.some(x => x.spel === s.id && x.niveau === n && x.juist)).map(([id]) => id)).size)));
    })))))));
}

function logboek(id) {
  const namen = Object.fromEntries(S.data.leerlingen.map(l => [l.id, l]));
  const rijen = Object.entries(S.data.resultaten).filter(([lid]) => id ? lid === id : (!S.klas || (namen[lid]?.klas || '') === S.klas))
    .flatMap(([lid, res]) => res.map(r => ({ ...r, lid }))).sort((a, b) => b.datum.localeCompare(a.datum));
  if (!rijen.length) return el('p', {}, 'Nog geen resultaten.');
  return el('div', { class: 'tabelwrap' }, el('table', { class: 'lijst' },
    el('tr', {}, [id ? null : 'Leerling', 'Wanneer', 'Spel', 'Lijst/tekst', 'Niveau', 'Resultaat', 'Tijd', 'Controles', 'Hints', 'Punten'].filter(Boolean).map(h => el('th', {}, h))),
    rijen.slice(0, 600).map(r => el('tr', {}, id ? null : el('td', {}, namen[r.lid] ? `${namen[r.lid].naam} ${namen[r.lid].voornaam}` : r.lid), el('td', {}, fmtDatum(r.datum)), el('td', {}, naamSpel(r.spel)), el('td', {}, r.themaNaam || ''),
      el('td', {}, medaille(r.niveau), ' ', NIVEAUS[r.niveau]), el('td', {}, r.juist ? '✅ gelukt' : '❌ gestopt'), el('td', {}, tijd(r.seconden)), el('td', {}, String(r.pogingen)), el('td', {}, String(r.hints)), el('td', {}, String(r.punten))))));
}

function exportCSV() {
  const namen = Object.fromEntries(S.data.leerlingen.map(l => [l.id, l]));
  const rijen = [['Klas', 'Naam', 'Voornaam', 'Datum', 'Tijdstip', 'Vak', 'Spel', 'Lijst/tekst', 'Niveau', 'Gelukt', 'Seconden', 'Controles', 'Hints', 'Punten']];
  for (const [id, res] of Object.entries(S.data.resultaten)) {
    const l = namen[id] || { klas: '', naam: '(verwijderd)', voornaam: id };
    if (S.klas && (l.klas || '') !== S.klas) continue;
    for (const r of res) { const d = new Date(r.datum); rijen.push([l.klas, l.naam, l.voornaam, d.toLocaleDateString('nl-BE'), d.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' }), VAKKEN[spelVan(r.spel)?.vak]?.naam || '', naamSpel(r.spel), r.themaNaam || '', NIVEAUS[r.niveau], r.juist ? 'ja' : 'nee', r.seconden, r.pogingen, r.hints, r.punten]); }
  }
  download(`kangoeroe-kluis-${new Date().toISOString().slice(0, 10)}.csv`, rijen);
}
function download(naam, rijen) {
  const csv = '﻿' + rijen.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\r\n');
  const a = el('a', { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })), download: naam });
  document.body.append(a); a.click(); a.remove();
}

/* ================= Leerlingen & codes ================= */
function beheer() {
  let lijst = S.data.leerlingen.map(l => ({ ...l }));
  const nieuwePin = () => { let p; do { p = String(Math.floor(1000 + Math.random() * 9000)); } while (lijst.some(l => l.pin === p)); return p; };
  const sorteer = () => lijst.sort((a, b) => (a.klas || '').localeCompare(b.klas || '', 'nl', { numeric: true }) || (a.naam || '').localeCompare(b.naam || '', 'nl') || (a.voornaam || '').localeCompare(b.voornaam || '', 'nl'));
  const box = el('tbody'), msg = el('div');
  const tekenLijst = () => box.replaceChildren(...lijst.map((l, k) => el('tr', {},
    ...['klas', 'naam', 'voornaam'].map(v => el('td', {}, el('input', { class: 'veld', value: l[v] || '', placeholder: v, oninput: e => l[v] = e.target.value }))),
    el('td', {}, el('input', { class: 'veld', value: l.pin || '', maxlength: 6, inputmode: 'numeric', style: 'max-width:6.5rem', oninput: e => l.pin = e.target.value.replace(/\D/g, '') })),
    el('td', {}, el('button', { class: 'x', title: 'Verwijderen', onclick: () => { if (confirm(`${l.voornaam} ${l.naam} verwijderen? De resultaten blijven bewaard tot je ze wist.`)) { lijst.splice(k, 1); tekenLijst(); } } }, '✕')))));
  sorteer(); tekenLijst();
  const plak = el('textarea', { class: 'tekst', rows: 5, placeholder: 'Plak hier uit Excel: klas, naam, voornaam en eventueel code (één leerling per regel, kolommen gescheiden door tab of ;)\nbv.  6A;Peeters;Lotte;4821' });
  const bewaar = async () => {
    const fout = lijst.find(l => !String(l.voornaam || '').trim() || !String(l.naam || '').trim() || String(l.pin || '').length < 4);
    if (fout) { msg.replaceChildren(melding('fout', 'Elke leerling heeft een naam, een voornaam en een code van 4 tot 6 cijfers nodig.')); return; }
    const sl = new Map(); for (const l of lijst) { const k = `${l.klas}|${l.naam}|${l.voornaam}`.toLowerCase(); if (sl.has(k)) { msg.replaceChildren(melding('fout', `${l.voornaam} ${l.naam} (${l.klas}) staat er twee keer in.`)); return; } sl.set(k, 1); }
    lijst.forEach(l => { if (!l.id) l.id = nieuwId('L'); });
    try { const d = await api('bewaar-leerlingen', { leerlingen: lijst }); S.data.leerlingen = d.leerlingen; lijst = d.leerlingen.map(l => ({ ...l })); sorteer(); tekenLijst(); msg.replaceChildren(melding('goed', `Bewaard: ${d.leerlingen.length} leerlingen.`)); }
    catch (e) { msg.replaceChildren(melding('fout', e.message)); }
  };
  const klasKeuze = el('select', {}, el('option', { value: '' }, 'alle klassen'), klassen().map(k => el('option', { value: k }, k || '(geen)')));
  return el('div', {},
    el('p', {}, 'Leerlingen melden zich aan door hun klas te kiezen, dan hun naam, en daarna hun persoonlijke code (4 tot 6 cijfers). Je mag zelf codes kiezen of laten maken. Een leerling die van klas verandert, pas je hier gewoon aan: alle resultaten blijven bij die leerling. Vergeet niet te bewaren.'),
    el('div', { class: 'tabelwrap' }, el('table', { class: 'lijst ll-tabel' }, el('thead', {}, el('tr', {}, ['Klas', 'Naam', 'Voornaam', 'Code', ''].map(h => el('th', {}, h)))), box)),
    el('div', { class: 'rij-acties' },
      el('button', { class: 'knop tweede', onclick: () => { lijst.push({ klas: lijst[lijst.length - 1]?.klas || '', naam: '', voornaam: '', pin: nieuwePin() }); tekenLijst(); box.lastChild?.querySelectorAll('input')[1]?.focus(); } }, '+ Leerling'),
      el('button', { class: 'knop tweede', onclick: () => { lijst.forEach(l => { if (!l.pin || l.pin.length < 4) l.pin = nieuwePin(); }); tekenLijst(); } }, '🎲 Codes voor wie er geen heeft'),
      el('button', { class: 'knop', onclick: bewaar }, '💾 Bewaar')),
    msg,
    el('h2', {}, 'Leerlingen toevoegen uit Excel'), plak,
    el('div', { class: 'rij-acties' }, el('button', { class: 'knop tweede', onclick: () => {
      let n = 0;
      plak.value.split(/\r?\n/).map(r => r.split(/\t|;/).map(s => s.trim())).filter(r => r.length >= 3 && r[2]).forEach(([klas, naam, voornaam, pin]) => {
        if (/^klas$/i.test(klas)) return;
        if (lijst.some(l => (l.klas || '') === klas && l.naam === naam && l.voornaam === voornaam)) return;
        lijst.push({ klas, naam, voornaam, pin: /^\d{4,6}$/.test(pin || '') ? pin : nieuwePin() }); n++;
      });
      plak.value = ''; sorteer(); tekenLijst(); msg.replaceChildren(melding('info', `${n} leerlingen toegevoegd. Klik op Bewaar.`));
    } }, 'Toevoegen aan de lijst')),
    el('h2', {}, 'Aanmeldkaartjes'),
    el('div', { class: 'rij-acties' }, klasKeuze, el('button', { class: 'knop tweede', onclick: () => kaartjes(lijst.filter(l => !klasKeuze.value || (l.klas || '') === klasKeuze.value)) }, '🖨 Kaartjes afdrukken')),
    el('h2', {}, '🛂 Kangoeroe-paspoorten afdrukken'),
    el('p', { class: 'stil' }, 'Het voorblad (Dit ben ik) en het groeiblad dienen voor 3 schooljaren. De bladen Mijn medailles, Andere uitdagingen en Reflectie zijn per schooljaar: vink "alleen de jaarbladen" aan om die bij de start van een nieuw schooljaar bij te drukken. Blanco = om met de hand in te vullen. Ingevuld = met wat de leerlingen digitaal invulden en hun resultaten uit de app.'),
    (() => {
      const jb = el('input', { type: 'checkbox' });
      const k = el('select', {}, klassen().map(x => el('option', { value: x }, x || '(geen)')));
      return el('div', { class: 'rij-acties' }, el('label', { class: 'vink' }, jb, ' alleen de jaarbladen'),
        el('button', { class: 'knop tweede', onclick: () => drukPaspoort([{}], { jaarbladen: jb.checked }) }, '🖨 Blanco paspoort'), k,
        el('button', { class: 'knop tweede', onclick: () => drukPaspoort(S.data.leerlingen.filter(l => (l.klas || '') === k.value).map(l => ({ leerling: l, paspoort: S.paspoorten?.[l.id], resultaten: S.data.resultaten[l.id] || [] })), { jaarbladen: jb.checked }) }, '🖨 Ingevulde paspoorten van deze klas'));
    })(),
    el('h2', { style: 'margin-top:2rem' }, 'Gevarenzone'),
    el('button', { class: 'knop tweede', style: 'color:var(--fout)', onclick: async () => {
      if (!confirm('ALLE oefenresultaten van ALLE leerlingen wissen? Dit kan niet ongedaan gemaakt worden.')) return;
      if (prompt('Typ WISSEN om te bevestigen') !== 'WISSEN') return;
      await api('wis'); await laad();
    } }, '🗑 Alle oefenresultaten wissen'));
}
function kaartjes(lijst) {
  const url = location.origin + location.pathname.replace(/leerkracht\.html$/, '');
  const esc = s => String(s || '').replace(/[<&]/g, c => ({ '<': '&lt;', '&': '&amp;' }[c]));
  const w = open('', '_blank');
  w.document.write(`<!doctype html><meta charset="utf-8"><title>Aanmeldkaartjes</title><style>body{font-family:sans-serif;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:10px}div{border:2px dashed #999;border-radius:12px;padding:12px;text-align:center;page-break-inside:avoid}b{font-size:20px;display:block}i{color:#666;font-style:normal}span{font-size:30px;letter-spacing:6px;font-weight:bold}small{color:#666;word-break:break-all}</style>` +
    lijst.map(l => `<div>🦘 Kangoeroe-Kluis<b>${esc(l.voornaam)} ${esc(l.naam)}</b><i>klas ${esc(l.klas)}</i><br>Mijn persoonlijke code:<br><span>${esc(l.pin)}</span><br><small>${url}</small></div>`).join('') + `<script>print()<\/script>`);
  w.document.close();
}

/* ================= Eigen inhoud ================= */
const INHOUD_SOORTEN = [
  ['woorden', 'Nederlandse woordenlijsten', 'Voor Filippine, Letterhussel, Woordzoeker en Kruiswoordraadsel.'],
  ['zinnen', 'Nederlandse zinnen', 'Voor Muurstenen, Gevallen letters, Geheimschrift, Codekraker en de Spreekwoordrebus.'],
  ['uitdagingen', 'Wiskunde-uitdagingen', 'Reeksen meerkeuzevragen (A–E) als prent: upload de prenten, vul de sleutel in en schrijf eventueel hulp (tips) per vraag.'],
  ['fr-woorden', 'Frans: woordenschat', 'Voor de oefening Woordenschat (Frans) en voor toetsen.'],
  ['fr-ww', 'Frans: werkwoorden', 'Voor de oefening Werkwoorden (Frans) en voor toetsen.'],
  ['fr-teksten', 'Frans: teksten', 'Voor Lezen en luisteren (Frans) en voor toetsen.'],
  ['en-woorden', 'Engels: woordenschat', 'Voor de oefening Woordenschat (Engels) en voor toetsen.'],
  ['en-ww', 'Engels: werkwoorden', 'Voor Irregular verbs en voor toetsen.'],
  ['en-teksten', 'Engels: teksten', 'Voor Lezen en luisteren (Engels) en voor toetsen.'],
  ['toneel', 'Toneelteksten', 'Voor de Toneelrepetitor. Eén regel per beurt: Naam: tekst. Regieaanwijzingen tussen haakjes.'],
];
const FORMAAT = {
  woorden: ['Eén woord per regel: WOORD ; omschrijving', 'KASTEEL ; Groot stenen gebouw met torens\nRIDDER ; Hij draagt een harnas'],
  zinnen: ['Eén zin per regel. Bij een spreekwoord of uitdrukking mag je de betekenis erachter zetten: zin ; betekenis (de leerlingen kiezen die betekenis dan na het oplossen). Betekenissen opzoeken kan bv. op woorden.org.', 'Al doende leert men ; Je leert iets door het te doen.\nEen octopus heeft drie harten'],
  'fr-woorden': ['Eén woord per regel: Nederlands ; Frans  (meerdere goede antwoorden met /)', 'de hond ; le chien\nhet ijsje ; la glace'],
  'en-woorden': ['Eén woord per regel: Nederlands ; Engels  (meerdere goede antwoorden met /)', 'de hond ; dog\nde gom ; rubber/eraser'],
  'fr-ww': ['Eén werkwoord per regel: infinitief ; betekenis ; je ; tu ; il ; nous ; vous ; ils ; aanvulling voor een zin (mag leeg)', 'aller ; gaan ; vais ; vas ; va ; allons ; allez ; vont ; à l\'école'],
  'en-ww': ['Eén werkwoord per regel: infinitive ; past simple ; past participle ; betekenis', 'go ; went ; gone ; gaan'],
};
function naarTekst(soort, b) {
  if (soort === 'woorden' || soort.endsWith('-woorden')) return (b.woorden || []).map(w => w.join(' ; ')).join('\n');
  if (soort === 'zinnen') return (b.zinnen || []).join('\n');
  if (soort === 'fr-ww') return (b.ww || []).map(w => [w.inf, w.nl, ...w.vormen, w.zin || ''].join(' ; ')).join('\n');
  if (soort === 'en-ww') return (b.ww || []).map(w => [w.inf, w.past, w.pp, w.nl].join(' ; ')).join('\n');
  return '';
}
function vanTekst(soort, tekst) {
  const regels = tekst.split(/\r?\n/).map(r => r.trim()).filter(Boolean);
  const delen = r => r.split(/\s*[;\t]\s*/);
  if (soort === 'woorden' || soort.endsWith('-woorden')) return { woorden: regels.map(delen).filter(d => d[0] && (soort === 'woorden' || d[1])).map(d => [d[0], d[1] || '']) };
  if (soort === 'zinnen') return { zinnen: regels };
  if (soort === 'fr-ww') return { ww: regels.map(delen).filter(d => d.length >= 8).map(d => ({ inf: d[0], nl: d[1], vormen: d.slice(2, 8), zin: d[8] || '' })) };
  if (soort === 'en-ww') return { ww: regels.map(delen).filter(d => d.length >= 4).map(d => ({ inf: d[0], past: d[1], pp: d[2], nl: d[3] })) };
}
const vragenNaarTekst = vr => (vr || []).map(v => [v.v, ...v.opties.map((o, k) => (k === v.juist ? '*' : '') + o)].join(' | ')).join('\n');
const vragenVanTekst = t => t.split(/\r?\n/).map(r => r.trim()).filter(Boolean).map(r => { const d = r.split('|').map(s => s.trim()); const opties = d.slice(1).map(o => o.replace(/^\*/, '').trim()); return { v: d[0], opties, juist: d.slice(1).findIndex(o => o.startsWith('*')) }; }).filter(v => v.opties.length >= 2 && v.juist >= 0);
const aantalVan = (soort, b) => soort === 'uitdagingen' ? `${b.vragen?.length || 0} vragen` : soort === 'toneel' ? `${new Set(leesToneel(b.tekst).flatMap(r => r.rollen || [])).size} rollen` : soort.endsWith('teksten') ? `${b.vragen?.length || 0} vragen` : soort === 'zinnen' ? `${b.zinnen?.length || 0} zinnen` : soort.endsWith('-ww') ? `${b.ww?.length || 0} werkwoorden` : `${b.woorden?.length || 0} woorden`;

async function bewaarInhoud(msgEl) {
  try { await api('bewaar-inhoud', { inhoud: EIGEN }); S.data.inhoud = EIGEN; msgEl?.replaceChildren(melding('goed', 'Bewaard. De leerlingen zien dit vanaf hun volgende aanmelding.')); return true; }
  catch (e) { msgEl?.replaceChildren(melding('fout', e.message)); return false; }
}

function inhoudTab() {
  if (S.inhoudBewerk) return inhoudEditor(S.inhoudBewerk);
  const msg = el('div');
  const inst = EIGEN.instellingen || {};
  const wrap = el('div', {},
    el('div', { class: 'blok' }, el('h3', {}, '⚙️ Instellingen voor de leerlingen'),
      el('label', {}, el('input', { type: 'checkbox', checked: !!inst.niveausInVolgorde, onchange: async e => { EIGEN.instellingen = { ...(EIGEN.instellingen || {}), niveausInVolgorde: e.target.checked }; await bewaarInhoud(msg); } }),
        ' Niveaus in volgorde vrijspelen (eerst brons, dan zilver …). Uit = leerlingen kiezen zelf op welk niveau ze beginnen.'),
      el('div', { style: 'margin-top:1rem' }, el('b', {}, '🛂 Andere uitdagingen in het Kangoeroe-paspoort'), el('p', { class: 'stil' }, 'Eén uitdaging per regel. De leerlingen duiden hiervoor zelf hun status, niveau en gevoel aan.'),
        (() => { const t = el('textarea', { class: 'tekst', rows: 6 }); t.value = paspoortUitdagingen().join('\n'); return [t, el('div', { class: 'rij-acties' }, el('button', { class: 'knop tweede klein', onclick: async () => { EIGEN.instellingen = { ...(EIGEN.instellingen || {}), uitdagingen: t.value.split(/\r?\n/).map(x => x.trim()).filter(Boolean) }; await bewaarInhoud(msg); } }, '💾 Bewaar lijst'))]; })())),
    el('p', {}, 'Maak hier je eigen lijsten en teksten. Ze verschijnen bij de leerlingen bovenaan de keuzelijst, met een ★. Tip: kopieer een ingebouwde lijst als vertrekpunt.'), msg);
  for (const [soort, titel, uitleg] of INHOUD_SOORTEN) {
    const eigen = EIGEN[soort] || [];
    wrap.append(el('div', { class: 'blok' }, el('h3', {}, titel), el('p', { class: 'stil' }, uitleg),
      el('div', { class: 'sets' },
        eigen.map((b, k) => el('div', { class: 'set' }, el('b', {}, '★ ' + (b.naam || b.titel)), el('span', { class: 'stil' }, aantalVan(soort, b)),
          el('button', { class: 'klein-knop', onclick: () => { S.inhoudBewerk = { soort, b: JSON.parse(JSON.stringify(b)), index: k }; teken(); } }, 'Bewerken'),
          el('button', { class: 'klein-knop', onclick: async () => { if (!confirm(`"${b.naam || b.titel}" verwijderen?`)) return; EIGEN[soort].splice(k, 1); await bewaarInhoud(msg); teken(); } }, 'Verwijderen'))),
        el('details', {}, el('summary', { class: 'stil' }, `Ingebouwd (${INGEBOUWD[soort].length})`),
          el('div', { class: 'sets' }, INGEBOUWD[soort].filter(b => b.id !== 'alles').map(b => el('div', { class: 'set' }, el('span', { style: 'flex:1' }, b.naam || b.titel), el('span', { class: 'stil' }, aantalVan(soort, b)),
            el('button', { class: 'klein-knop', onclick: () => { const c = JSON.parse(JSON.stringify(b)); c.id = nieuwId('e'); if (c.naam) c.naam += ' (kopie)'; if (c.titel) c.titel += ' (kopie)'; S.inhoudBewerk = { soort, b: c, index: -1 }; teken(); } }, 'Kopiëren')))))),
      el('div', { class: 'rij-acties' }, el('button', { class: 'knop tweede klein', onclick: () => { S.inhoudBewerk = { soort, b: { id: nieuwId('e'), ...(soort.endsWith('teksten') ? { titel: '', niveau: 2, tekst: '', vragen: [] } : soort === 'toneel' ? { titel: '', tekst: '' } : soort === 'uitdagingen' ? { naam: '', vragen: [] } : { naam: '' }) }, index: -1 }; teken(); } }, '+ Nieuw'))));
  }
  wrap.append(el('div', { class: 'blok' }, el('h3', {}, 'Reservekopie'), el('p', { class: 'stil' }, 'Bewaar al je eigen inhoud in één bestand, of zet een reservekopie terug.'),
    el('div', { class: 'rij-acties' },
      el('button', { class: 'knop tweede klein', onclick: () => { const a = el('a', { href: URL.createObjectURL(new Blob([JSON.stringify(EIGEN, null, 1)], { type: 'application/json' })), download: `kangoeroe-inhoud-${new Date().toISOString().slice(0, 10)}.json` }); document.body.append(a); a.click(); a.remove(); } }, '⬇ Download reservekopie'),
      el('label', { class: 'knop tweede klein' }, '⬆ Terugzetten', el('input', { type: 'file', accept: '.json', style: 'display:none', onchange: async e => {
        try { const d = JSON.parse(await e.target.files[0].text()); if (!confirm('Je huidige eigen inhoud vervangen door deze reservekopie?')) return; EIGEN = d; await bewaarInhoud(msg); teken(); } catch { msg.replaceChildren(melding('fout', 'Dat bestand kon ik niet lezen.')); }
      } })))));
  return wrap;
}

function inhoudEditor({ soort, b, index }) {
  const msg = el('div');
  const isTekst = soort.endsWith('teksten'), isToneel = soort === 'toneel';
  const naam = el('input', { class: 'veld', value: (isTekst || isToneel ? b.titel : b.naam) || '', placeholder: isTekst || isToneel ? 'Titel' : 'Naam van de lijst (bv. Ridders – les 3)' });
  const form = el('div', { class: 'form' }, el('label', {}, isTekst || isToneel ? 'Titel' : 'Naam', naam));
  let lees;
  if (soort === 'uitdagingen') {
    const vragen = (b.vragen || []).map(v => ({ ...v, hulp: [...(v.hulp || [])] }));
    const bronV = el('input', { class: 'veld', value: b.bron || '', placeholder: 'bv. Wiskunde Kangoeroe 2010 (mag leeg)' });
    const linkV = el('input', { class: 'veld', value: b.link || '', placeholder: 'https://… (mag leeg)' });
    const lijstEl = el('div', { class: 'uit-bewerk' }), status = el('div');
    const sleutel = el('input', { class: 'veld', placeholder: 'bv. BDDDADCC EADEDCDB …', style: 'font-family:monospace' });
    const tekenLijst = () => lijstEl.replaceChildren(...vragen.map((v, k) => el('div', { class: 'uit-b-rij' },
      el('b', {}, k + 1), (() => { const i = el('img', { alt: '' }); zetBeeld(i, v.beeld); return i; })(),
      el('div', { class: 'uit-b-velden' },
        el('label', {}, 'Juist antwoord ', el('select', { onchange: e => v.juist = e.target.value }, ['', ...'ABCDE'].map(l => el('option', { value: l, selected: v.juist === l }, l || '…')))),
        el('label', {}, 'Hulp: één tip per regel (van een klein duwtje naar een grotere hulp)', el('textarea', { class: 'tekst', rows: 3, oninput: e => v.hulp = e.target.value.split(/\r?\n/).map(x => x.trim()).filter(Boolean) }, (v.hulp || []).join('\n')))),
      el('div', { class: 'uit-b-knoppen' },
        el('button', { class: 'klein-knop', disabled: k === 0, onclick: () => { [vragen[k - 1], vragen[k]] = [vragen[k], vragen[k - 1]]; tekenLijst(); } }, '↑'),
        el('button', { class: 'klein-knop', disabled: k === vragen.length - 1, onclick: () => { [vragen[k + 1], vragen[k]] = [vragen[k], vragen[k + 1]]; tekenLijst(); } }, '↓'),
        el('button', { class: 'klein-knop', onclick: () => { if (confirm(`Vraag ${k + 1} verwijderen?`)) { vragen.splice(k, 1); tekenLijst(); } } }, '✕')))));
    const verklein = file => new Promise((ok, nok) => {
      const img = new Image(); img.onload = () => {
        const sch = Math.min(1, 1000 / img.width), c = document.createElement('canvas'); c.width = Math.round(img.width * sch); c.height = Math.round(img.height * sch);
        const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
        let d = c.toDataURL('image/png'); if (d.length > 900000) d = c.toDataURL('image/jpeg', .88); URL.revokeObjectURL(img.src); ok(d);
      }; img.onerror = () => nok(new Error(`${file.name} is geen prent.`)); img.src = URL.createObjectURL(file);
    });
    const upload = el('input', { type: 'file', accept: 'image/*', multiple: true, style: 'display:none', onchange: async e => {
      const files = [...e.target.files].sort((a, c) => a.name.localeCompare(c.name, 'nl', { numeric: true }));
      for (const [k, f] of files.entries()) {
        status.replaceChildren(melding('info', `Prent ${k + 1} van ${files.length} uploaden: ${f.name}`));
        try { const r = await api('lk-beeld', { data: await verklein(f) }); vragen.push({ beeld: r.id, juist: '', hulp: [] }); tekenLijst(); }
        catch (err) { status.replaceChildren(melding('fout', `${f.name}: ${err.message}`)); return; }
      }
      status.replaceChildren(melding('goed', `${files.length} prent(en) toegevoegd. Vul nu de sleutel in.`)); e.target.value = '';
    } });
    form.append(el('label', {}, 'Bron (wordt getoond bij de reeks)', bronV), el('label', {}, 'Link naar de reeks op jullie site', linkV),
      el('div', {}, el('b', {}, 'Vragen'), el('p', { class: 'stil' }, 'Upload één prent per vraag (meerdere tegelijk mag). Ze worden op bestandsnaam gesorteerd, bv. Opgave 0901, 0902 …'),
        el('label', { class: 'knop tweede klein' }, '📷 Prenten toevoegen', upload), status),
      el('label', {}, 'Sleutel in één keer invullen (letters A–E in volgorde; spaties mogen)', el('div', { class: 'rij-acties' }, sleutel, el('button', { class: 'knop tweede klein', type: 'button', onclick: () => { const l = sleutel.value.toUpperCase().replace(/[^A-E]/g, ''); [...l].forEach((x, k) => { if (vragen[k]) vragen[k].juist = x; }); tekenLijst(); status.replaceChildren(melding(l.length === vragen.length ? 'goed' : 'info', `${l.length} letters ingevuld voor ${vragen.length} vragen.`)); } }, 'Invullen'))),
      lijstEl);
    tekenLijst();
    lees = () => ({ ...b, naam: naam.value.trim(), bron: bronV.value.trim(), link: linkV.value.trim(), vragen });
  } else if (isToneel) {
    const tekst = el('textarea', { class: 'tekst', placeholder: '(De meester zit aan zijn tafel.)\nMeester: Goedemorgen!\nSam: Goedemorgen, meester.' }, b.tekst || '');
    form.append(el('label', {}, 'Tekst: één beurt per regel, zo → Naam: tekst. Regie tussen haakjes. Twee spelers samen: Lotte & Daan: …', tekst));
    lees = () => ({ ...b, titel: naam.value.trim(), tekst: tekst.value.trim() });
  } else if (isTekst) {
    const niv = el('select', {}, [1, 2, 3, 4, 5].map(n => el('option', { value: n, selected: Number(b.niveau) === n }, `${NIVEAUS[n]} (moeilijkheid ${n})`)));
    const tekst = el('textarea', { class: 'tekst', placeholder: 'Plak hier de tekst. Een nieuwe regel = een nieuwe alinea.' }, b.tekst || '');
    const vragen = el('textarea', { class: 'tekst', placeholder: 'Wie is Léa? | *Een meisje | Een hond | Een juf' }, vragenNaarTekst(b.vragen));
    form.append(el('label', {}, 'Moeilijkheid (tip voor de leerlingen)', niv), el('label', {}, 'Tekst', tekst),
      el('label', {}, 'Vragen (één per regel: vraag | *juist antwoord | fout | fout)', vragen),
      el('p', { class: 'stil' }, 'De gatentekst en het dictee worden automatisch uit de tekst gemaakt. Zonder vragen werken brons en goud ook als gatentekst.'));
    lees = () => ({ ...b, titel: naam.value.trim(), niveau: Number(niv.value), tekst: tekst.value.trim(), vragen: vragenVanTekst(vragen.value) });
  } else {
    const [uitleg, vb] = FORMAAT[soort];
    const t = el('textarea', { class: 'tekst', placeholder: vb }, naarTekst(soort, b));
    form.append(el('label', {}, uitleg, t), el('p', { class: 'stil' }, 'Voorbeeld:', el('pre', { style: 'margin:.2rem 0;white-space:pre-wrap' }, vb)));
    lees = () => ({ ...b, naam: naam.value.trim(), ...vanTekst(soort, t.value) });
  }
  const bewaar = async () => {
    const nieuw = lees();
    if (!(nieuw.naam || nieuw.titel)) { msg.replaceChildren(melding('fout', 'Geef een naam of titel.')); return; }
    if (soort === 'uitdagingen') {
      if (!nieuw.vragen.length) { msg.replaceChildren(melding('fout', 'Voeg eerst prenten toe.')); return; }
      const leeg = nieuw.vragen.findIndex(v => !v.juist); if (leeg >= 0) { msg.replaceChildren(melding('fout', `Vraag ${leeg + 1} heeft nog geen juist antwoord.`)); return; }
    }
    const n = soort === 'uitdagingen' ? nieuw.vragen.length : soort.endsWith('teksten') || soort === 'toneel' ? (soort === 'toneel' ? leesToneel(nieuw.tekst).filter(r => r.rol).length : nieuw.tekst.length) : (nieuw.woorden || nieuw.zinnen || nieuw.ww || []).length;
    if (!n) { msg.replaceChildren(melding('fout', 'Er staat nog niets (bruikbaars) in. Kijk het formaat na.')); return; }
    if (soort.endsWith('-woorden') && nieuw.woorden.length < 4) { msg.replaceChildren(melding('fout', 'Zet minstens 4 woorden in de lijst.')); return; }
    EIGEN[soort] = EIGEN[soort] || [];
    if (index >= 0) EIGEN[soort][index] = nieuw; else EIGEN[soort].push(nieuw);
    if (await bewaarInhoud(msg)) { S.inhoudBewerk = null; teken(); }
  };
  const proef = () => {
    const nieuw = lees();
    const spel = SPELLEN.find(s => s.bron === soort);
    if (!spel) return;
    const doos = el('div', { class: 'speelveld' });
    try { spel.maak(1, doos, { bron: nieuw, taal: BRONSOORTEN[soort].taal }); } catch (e) { doos.append(melding('fout', 'Dit lukt nog niet: ' + e.message)); }
    voorbeeld.replaceChildren(el('h3', {}, `Voorbeeld: ${spel.naam} (brons)`), doos);
  };
  const voorbeeld = el('div', { style: 'margin-top:1rem' });
  return el('div', {}, el('div', { class: 'spelkop' }, el('button', { class: 'knop tweede', onclick: () => { S.inhoudBewerk = null; teken(); } }, '← Terug'), el('h1', {}, INHOUD_SOORTEN.find(x => x[0] === soort)[1])),
    el('div', { class: 'blok' }, form), msg,
    el('div', { class: 'rij-acties' }, el('button', { class: 'knop', onclick: bewaar }, '💾 Bewaar'), el('button', { class: 'knop tweede', onclick: proef }, '👀 Probeer uit')), voorbeeld);
}

/* ================= Toetsen ================= */
const naarLokaal = iso => { if (!iso) return ''; const d = new Date(iso); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };
const vanLokaal = v => v ? new Date(v).toISOString() : '';
const statusVan = t => { const nu = Date.now(); if (t.van && Date.parse(t.van) > nu) return ['gepland', 'Gepland']; if (t.tot && Date.parse(t.tot) < nu) return ['dicht', 'Gesloten']; return ['open', 'Open']; };

function toetsenTab() {
  if (S.toetsBewerk) return toetsEditor(S.toetsBewerk);
  if (S.toetsRes) return toetsResultaten(S.toetsRes);
  const lijst = [...(S.toetsData.toetsen || [])].sort((a, b) => (b.van || '').localeCompare(a.van || ''));
  const nieuw = () => { const nu = new Date(); const tot = new Date(nu.getTime() + 7 * 864e5); S.toetsBewerk = { id: nieuwId('t'), titel: '', uitleg: '', klassen: [], van: nu.toISOString(), tot: tot.toISOString(), duur: 0, toonScore: true, strikt: false, vragen: [] }; teken(); };
  return el('div', {},
    el('p', {}, 'Stel een toets samen en bepaal wanneer ze open staat (van … tot …) en eventueel hoeveel minuten de leerlingen krijgen. De leerlingen zien de toets onder "📝 Toetsen" zolang ze open is. Elke leerling kan de toets één keer maken.'),
    el('div', { class: 'rij-acties' }, el('button', { class: 'knop', onclick: nieuw }, '+ Nieuwe toets')),
    lijst.length ? el('div', { class: 'tabelwrap' }, el('table', { class: 'lijst' },
      el('tr', {}, ['Toets', 'Klassen', 'Open van', 'Tot', 'Duur', 'Status', 'Ingeleverd', ''].map(h => el('th', {}, h))),
      lijst.map(t => { const [st, stT] = statusVan(t); const res = Object.values(S.toetsData.resultaten[t.id] || {}); return el('tr', {},
        el('td', {}, el('b', {}, t.titel), el('small', { class: 'stil' }, ` · ${(t.vragen || []).filter(v => v.type !== 'tekst').length} vragen`)), el('td', {}, t.klassen?.length ? t.klassen.join(', ') : 'alle'),
        el('td', {}, t.van ? fmtDatum(t.van) : '–'), el('td', {}, t.tot ? fmtDatum(t.tot) : '–'), el('td', {}, t.duur ? `${t.duur} min` : '–'), el('td', {}, el('span', { class: `status ${st}` }, stT)),
        el('td', {}, `${res.filter(r => r.ingeleverd).length}${res.some(r => !r.ingeleverd) ? ` (+${res.filter(r => !r.ingeleverd).length} bezig)` : ''}`),
        el('td', {}, el('div', { class: 'knoppenrij', style: 'margin:0' },
          el('button', { class: 'klein-knop', onclick: () => { S.toetsRes = t.id; teken(); } }, 'Resultaten'),
          el('button', { class: 'klein-knop', onclick: () => { S.toetsBewerk = JSON.parse(JSON.stringify(t)); teken(); } }, 'Bewerken'),
          el('button', { class: 'klein-knop', onclick: () => { const c = JSON.parse(JSON.stringify(t)); c.id = nieuwId('t'); c.titel += ' (kopie)'; S.toetsBewerk = c; teken(); } }, 'Kopie'),
          el('button', { class: 'klein-knop', onclick: async () => { if (!confirm(`Toets "${t.titel}" en alle antwoorden verwijderen?`)) return; await api('verwijder-toets', { toetsId: t.id }); await laad(); } }, '🗑'))));
      }))) : el('p', { class: 'stil' }, 'Nog geen toetsen.'));
}

function toetsEditor(t) {
  const msg = el('div');
  const veld = (k, props = {}) => { const i = el('input', { class: 'veld', value: t[k] ?? '', ...props, oninput: e => t[k] = props.type === 'number' ? Number(e.target.value) || 0 : e.target.value }); return i; };
  const van = el('input', { class: 'veld', type: 'datetime-local', value: naarLokaal(t.van), onchange: e => t.van = vanLokaal(e.target.value) });
  const tot = el('input', { class: 'veld', type: 'datetime-local', value: naarLokaal(t.tot), onchange: e => t.tot = vanLokaal(e.target.value) });
  const vinkje = (k, tekst) => el('label', {}, el('input', { type: 'checkbox', checked: !!t[k], onchange: e => t[k] = e.target.checked }), ' ', tekst);
  const kl = el('div', { class: 'vinkjes' }, klassen().map(k => el('label', {}, el('input', { type: 'checkbox', checked: t.klassen.includes(k), onchange: e => { t.klassen = e.target.checked ? [...t.klassen, k] : t.klassen.filter(x => x !== k); } }), ' ', k || '(geen klas)')));
  const vragenBox = el('div', { style: 'display:grid;gap:.5rem' });
  const tekenVragen = () => {
    let nr = 0;
    vragenBox.replaceChildren(...(t.vragen.length ? t.vragen.map((v, k) => {
      const kop = el('div', { class: 'kopje' }, el('span', { class: 'soort' }, { mc: 'meerkeuze', open: 'open vraag', tekst: 'tekst' }[v.type]), el('b', {}, v.type === 'tekst' ? (v.titel || 'Tekstblok') : `Vraag ${++nr}`),
        el('button', { class: 'klein-knop', disabled: k === 0, onclick: () => { [t.vragen[k - 1], t.vragen[k]] = [t.vragen[k], t.vragen[k - 1]]; tekenVragen(); } }, '▲'),
        el('button', { class: 'klein-knop', disabled: k === t.vragen.length - 1, onclick: () => { [t.vragen[k + 1], t.vragen[k]] = [t.vragen[k], t.vragen[k + 1]]; tekenVragen(); } }, '▼'),
        el('button', { class: 'x', onclick: () => { t.vragen.splice(k, 1); tekenVragen(); } }, '✕'));
      const inp = (veldNaam, ph, extra = {}) => el('input', { class: 'veld', value: v[veldNaam] ?? '', placeholder: ph, ...extra, oninput: e => v[veldNaam] = e.target.value });
      const taalKeuze = (veldNaam = 'taal') => el('select', { onchange: e => v[veldNaam] = e.target.value }, [['', 'geen voorleesstem'], ['fr', 'Frans'], ['en', 'Engels'], ['nl', 'Nederlands']].map(([w, n]) => el('option', { value: w, selected: (v[veldNaam] || '') === w }, n)));
      if (v.type === 'tekst') return el('div', { class: 'vraagkaart' }, kop, inp('titel', 'Titel (mag leeg)'),
        el('textarea', { class: 'tekst', rows: 5, oninput: e => v.tekst = e.target.value }, v.tekst || ''),
        el('div', { class: 'knoppenrij' }, el('span', { class: 'stil' }, 'Voorlezen:'), taalKeuze(), el('label', {}, el('input', { type: 'checkbox', checked: !!v.verborgen, onchange: e => v.verborgen = e.target.checked }), ' alleen beluisteren (tekst verborgen)')));
      const audio = el('div', { class: 'knoppenrij' }, el('span', { class: 'stil' }, '🔊 Laat voorlezen (optioneel):'), inp('audio', 'tekst die voorgelezen wordt', { style: 'flex:1;min-width:12rem' }), taalKeuze());
      if (v.type === 'mc') return el('div', { class: 'vraagkaart' }, kop, inp('vraag', 'Vraag'),
        el('textarea', { class: 'tekst', rows: Math.max(3, v.opties.length), placeholder: 'Eén antwoord per regel. Zet * voor het juiste antwoord.', oninput: e => { const r = e.target.value.split(/\r?\n/).filter(x => x.trim()); v.opties = r.map(x => x.replace(/^\*\s*/, '').trim()); v.juist = Math.max(0, r.findIndex(x => x.trim().startsWith('*'))); } }, v.opties.map((o, j) => (j === v.juist ? '*' : '') + o).join('\n')), audio);
      return el('div', { class: 'vraagkaart' }, kop, inp('vraag', 'Vraag'), inp('antwoord', 'Juist antwoord (meerdere goede antwoorden scheiden met /)'), audio);
    }) : [el('p', { class: 'stil' }, 'Nog geen vragen. Voeg ze hieronder toe.')]));
  };
  tekenVragen();
  const voeg = (...vs) => { t.vragen.push(...vs.map(v => ({ id: nieuwId('v'), ...v }))); tekenVragen(); gen.replaceChildren(); };
  const gen = el('div');
  /* Generatoren */
  const kiesBron = (soorten) => el('select', {}, soorten.flatMap(s => bronnen(s).filter(b => b.id !== 'alles').map(b => el('option', { value: `${s}|${b.id}` }, `${BRONSOORTEN[s].vak === 'frans' ? 'FR' : 'EN'} · ${b.eigen ? '★ ' : ''}${b.naam || b.titel}`))));
  const uitKeuze = sel => { const [s, id] = sel.value.split('|'); return { soort: s, b: bronVan(s, id), taal: BRONSOORTEN[s].taal }; };
  const genWoorden = () => {
    const bron = kiesBron(['fr-woorden', 'en-woorden']);
    const richting = el('select', {}, [['typ', 'Nederlands → typ het vreemde woord'], ['terug', 'Vreemd woord → typ het Nederlands'], ['mc', 'Nederlands → kies het vreemde woord (meerkeuze)'], ['luister', 'Luister → typ het vreemde woord']].map(([w, n]) => el('option', { value: w }, n)));
    const aantal = el('input', { class: 'veld', type: 'number', value: 10, min: 1, max: 40, style: 'width:5rem' });
    const lidwoord = el('input', { type: 'checkbox', checked: true });
    gen.replaceChildren(el('div', { class: 'generator' }, el('b', {}, 'Vragen uit een woordenlijst'), el('div', { class: 'rij2' }, bron, richting, el('label', {}, 'Aantal ', aantal)),
      el('label', {}, lidwoord, ' Het lidwoord (le, la, the …) moet erbij bij typvragen'),
      el('button', { class: 'knop klein', onclick: () => {
        const { b, taal } = uitKeuze(bron), items = U.shuffle(b.woorden).slice(0, Number(aantal.value) || 10);
        voeg(...items.map(([nl, vr]) => {
          const vrE = U.eersteVorm(vr);
          const metOfZonder = lidwoord.checked ? vr : [...new Set([...vr.split('/'), ...vr.split('/').map(U.zonderLidwoord)])].join('/');
          if (richting.value === 'typ') return { type: 'open', vraag: `Vertaal: ${nl}`, antwoord: metOfZonder };
          if (richting.value === 'terug') return { type: 'open', vraag: `Wat betekent: ${vrE}?`, antwoord: nl.replace(/^(de|het|een)\s+/i, '') + '/' + nl, audio: vrE, taal };
          if (richting.value === 'luister') return { type: 'open', vraag: 'Luister en schrijf het woord.', antwoord: metOfZonder, audio: vrE, taal };
          const opties = U.shuffle([vrE, ...afleiders(vrE, b.woorden.map(w => U.eersteVorm(w[1])))]);
          return { type: 'mc', vraag: `Hoe zeg je: ${nl}?`, opties, juist: opties.indexOf(vrE) };
        }));
      } }, 'Voeg toe')));
  };
  const genWw = () => {
    const bron = kiesBron(['fr-ww', 'en-ww']);
    const aantal = el('input', { class: 'veld', type: 'number', value: 8, min: 1, max: 40, style: 'width:5rem' });
    gen.replaceChildren(el('div', { class: 'generator' }, el('b', {}, 'Vragen uit werkwoorden'), el('div', { class: 'rij2' }, bron, el('label', {}, 'Aantal ', aantal)),
      el('p', { class: 'stil' }, 'Frans: een vorm invullen (bv. nous … (aller)). Engels: past simple en past participle.'),
      el('button', { class: 'knop klein', onclick: () => {
        const { soort, b } = uitKeuze(bron), n = Number(aantal.value) || 8;
        if (soort === 'fr-ww') voeg(...U.shuffle(b.ww.flatMap(w => w.vormen.map((v, k) => ({ w, v, k })))).slice(0, n).map(({ w, v, k }) => ({ type: 'open', vraag: `${frVnw(k, v)} … (${w.inf})${w.zin ? ' ' + w.zin : ''}`, antwoord: v })));
        else voeg(...U.shuffle(b.ww).slice(0, n).flatMap(w => [{ type: 'open', vraag: `Past simple van "${w.inf}" (${w.nl})`, antwoord: w.past }, { type: 'open', vraag: `Past participle van "${w.inf}"`, antwoord: w.pp }]));
      } }, 'Voeg toe')));
  };
  const genTekst = () => {
    const bron = kiesBron(['fr-teksten', 'en-teksten']);
    const verborgen = el('input', { type: 'checkbox' });
    gen.replaceChildren(el('div', { class: 'generator' }, el('b', {}, 'Tekst met begripsvragen'), bron, el('label', {}, verborgen, ' alleen beluisteren (tekst verborgen)'),
      el('button', { class: 'knop klein', onclick: () => {
        const { b, taal } = uitKeuze(bron);
        voeg({ type: 'tekst', titel: b.titel, tekst: b.tekst, taal, verborgen: verborgen.checked }, ...(b.vragen || []).map(v => ({ type: 'mc', vraag: v.v, opties: v.opties, juist: v.juist })));
      } }, 'Voeg toe')));
  };
  const bewaar = async () => {
    if (!t.titel.trim()) { msg.replaceChildren(melding('fout', 'Geef de toets een titel.')); return; }
    if (!t.vragen.some(v => v.type !== 'tekst')) { msg.replaceChildren(melding('fout', 'Voeg minstens één vraag toe.')); return; }
    if (t.van && t.tot && Date.parse(t.tot) <= Date.parse(t.van)) { msg.replaceChildren(melding('fout', '"Tot" moet na "van" liggen.')); return; }
    const leeg = t.vragen.find(v => (v.type === 'mc' && (v.opties.length < 2 || !v.vraag)) || (v.type === 'open' && (!v.vraag || !String(v.antwoord || '').trim())));
    if (leeg) { msg.replaceChildren(melding('fout', 'Er is een vraag zonder vraagtekst, antwoord of keuzes.')); return; }
    try { await api('bewaar-toets', { toets: t }); S.toetsBewerk = null; await laad(); } catch (e) { msg.replaceChildren(melding('fout', e.message)); }
  };
  const proef = () => {
    const w = open('', '_blank');
    w.document.write(`<!doctype html><meta charset="utf-8"><title>${t.titel}</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;line-height:1.5}.v{margin:1rem 0;padding:.6rem;border:1px solid #ccc;border-radius:8px}.j{color:green;font-weight:bold}</style><h1>${t.titel}</h1>` +
      t.vragen.map((v, k) => v.type === 'tekst' ? `<div class="v" style="background:#f6f2ea"><b>${v.titel || ''}</b><p>${(v.tekst || '').replace(/</g, '&lt;').replace(/\n/g, '<br>')}</p></div>` : `<div class="v"><b>${v.vraag}</b>${v.audio ? ` 🔊 <i>${v.audio}</i>` : ''}<br>${v.type === 'mc' ? v.opties.map((o, j) => `<div class="${j === v.juist ? 'j' : ''}">${String.fromCharCode(97 + j)}) ${o}</div>`).join('') : `<span class="j">→ ${v.antwoord}</span>`}</div>`).join('') + `<p><i>Juiste antwoorden in het groen.</i></p>`);
    w.document.close();
  };
  return el('div', {},
    el('div', { class: 'spelkop' }, el('button', { class: 'knop tweede', onclick: () => { if (confirm('Terug zonder te bewaren?')) { S.toetsBewerk = null; teken(); } } }, '← Terug'), el('h1', {}, t.titel || 'Nieuwe toets')),
    el('div', { class: 'blok form' },
      el('label', {}, 'Titel', veld('titel', { placeholder: 'bv. Frans – woordenschat school' })),
      el('label', {}, 'Uitleg voor de leerlingen (mag leeg)', veld('uitleg')),
      el('div', { class: 'rij2' }, el('label', {}, 'Open van', van), el('label', {}, 'Open tot', tot), el('label', {}, 'Tijd per leerling (minuten, 0 = geen limiet)', veld('duur', { type: 'number', min: 0, max: 300 }))),
      el('div', {}, el('b', {}, 'Voor welke klassen? '), el('span', { class: 'stil' }, '(niets aangevinkt = alle klassen)'), kl),
      el('div', { class: 'vinkjes' }, vinkje('toonScore', 'Toon de score aan de leerling na het inleveren'), vinkje('strikt', 'Accenten tellen mee bij open vragen'))),
    el('h2', {}, 'Vragen'), vragenBox,
    el('div', { class: 'rij-acties' },
      el('button', { class: 'knop tweede klein', onclick: () => voeg({ type: 'mc', vraag: '', opties: ['', ''], juist: 0 }) }, '+ Meerkeuzevraag'),
      el('button', { class: 'knop tweede klein', onclick: () => voeg({ type: 'open', vraag: '', antwoord: '' }) }, '+ Open vraag'),
      el('button', { class: 'knop tweede klein', onclick: () => voeg({ type: 'tekst', titel: '', tekst: '' }) }, '+ Tekstblok'),
      el('button', { class: 'knop tweede klein', onclick: genWoorden }, '+ Uit woordenlijst'),
      el('button', { class: 'knop tweede klein', onclick: genWw }, '+ Uit werkwoorden'),
      el('button', { class: 'knop tweede klein', onclick: genTekst }, '+ Tekst met vragen')),
    gen, msg,
    el('div', { class: 'rij-acties' }, el('button', { class: 'knop', onclick: bewaar }, '💾 Bewaar toets'), el('button', { class: 'knop tweede', onclick: proef }, '👀 Bekijk met antwoorden')));
}

function toetsResultaten(toetsId) {
  const t = S.toetsData.toetsen.find(x => x.id === toetsId);
  const res = S.toetsData.resultaten[toetsId] || {};
  const vragen = t.vragen.filter(v => v.type !== 'tekst');
  const doelgroep = S.data.leerlingen.filter(l => !t.klassen?.length || t.klassen.includes(l.klas || ''))
    .sort((a, b) => (a.klas || '').localeCompare(b.klas || '', 'nl', { numeric: true }) || a.naam.localeCompare(b.naam, 'nl'));
  const per = vragen.map(v => { const r = Object.values(res).filter(x => x.ingeleverd); return r.length ? Math.round(100 * r.filter(x => x.per?.[v.id]).length / r.length) : null; });
  const ingeleverd = Object.values(res).filter(r => r.ingeleverd);
  const gem = ingeleverd.length ? ingeleverd.reduce((a, r) => a + r.score / (r.max || 1), 0) / ingeleverd.length : null;
  const csv = () => download(`toets-${t.titel.replace(/[^\w-]+/g, '_')}.csv`, [['Klas', 'Naam', 'Voornaam', 'Status', 'Score', 'Max', '%', ...vragen.map((v, k) => `V${k + 1}`)],
    ...doelgroep.map(l => { const r = res[l.id]; return [l.klas, l.naam, l.voornaam, r ? (r.ingeleverd ? 'ingeleverd' : 'bezig') : 'niet gestart', r?.score ?? '', r?.max ?? '', r?.max ? Math.round(100 * r.score / r.max) : '', ...vragen.map(v => r ? (r.per?.[v.id] ? 1 : 0) : '')]; })]);
  const detailBox = el('div');
  const toonAntw = l => {
    const r = res[l.id]; if (!r) return;
    detailBox.replaceChildren(el('div', { class: 'blok' }, el('h3', {}, `${l.voornaam} ${l.naam}: ${r.score}/${r.max}`),
      el('div', { class: 'tabelwrap' }, el('table', { class: 'lijst' }, el('tr', {}, ['#', 'Vraag', 'Antwoord leerling', 'Juist antwoord', ''].map(h => el('th', {}, h))),
        vragen.map((v, k) => { const a = r.antwoorden?.[v.id]; return el('tr', {}, el('td', {}, String(k + 1)), el('td', { style: 'white-space:normal' }, v.vraag),
          el('td', { style: 'white-space:normal' }, v.type === 'mc' ? (a !== undefined && a !== '' ? v.opties[a] : '–') : (a || '–')), el('td', { style: 'white-space:normal' }, v.type === 'mc' ? v.opties[v.juist] : v.antwoord), el('td', {}, r.per?.[v.id] ? el('span', { class: 'ok' }, '✓') : el('span', { class: 'nok' }, '✗'))); })))));
    detailBox.scrollIntoView({ behavior: 'smooth' });
  };
  return el('div', {},
    el('div', { class: 'spelkop' }, el('button', { class: 'knop tweede', onclick: () => { S.toetsRes = null; teken(); } }, '← Toetsen'), el('h1', {}, t.titel)),
    el('div', { class: 'tegels-kpi' },
      el('div', { class: 'kpi' }, el('b', {}, `${ingeleverd.length}/${doelgroep.length}`), el('span', {}, 'ingeleverd')),
      el('div', { class: 'kpi' }, el('b', {}, gem === null ? '–' : Math.round(gem * 100) + '%'), el('span', {}, 'gemiddelde score')),
      el('div', { class: 'kpi' }, el('b', {}, String(vragen.length)), el('span', {}, 'vragen'))),
    el('div', { class: 'rij-acties' }, el('button', { class: 'knop tweede', onclick: csv }, '⬇ Exporteer naar Excel (CSV)'), el('button', { class: 'knop tweede', onclick: laad }, '↻ Vernieuwen'), el('span', { class: 'stil' }, 'Klik op een leerling om de antwoorden te zien.')),
    el('div', { class: 'tabelwrap' }, el('table', { class: 'lijst' },
      el('tr', {}, el('th', {}, 'Leerling'), el('th', {}, 'Klas'), el('th', {}, 'Status'), el('th', {}, 'Score'), el('th', {}, '%'), vragen.map((v, k) => el('th', { title: v.vraag }, `V${k + 1}`)), el('th', {}, '')),
      el('tr', {}, el('td', { class: 'stil' }, '% juist per vraag'), el('td'), el('td'), el('td'), el('td'), per.map(p => el('td', { class: 'stil' }, p === null ? '' : p + '%')), el('td')),
      doelgroep.map(l => { const r = res[l.id]; return el('tr', { class: r ? 'klik' : '', onclick: () => toonAntw(l) },
        el('td', {}, el('b', {}, l.naam), ' ', l.voornaam), el('td', {}, l.klas || ''),
        el('td', {}, r ? (r.ingeleverd ? `✅ ${fmtDatum(r.ingeleverd)}${r.telaat ? ' (tijd om)' : ''}` : '⏳ bezig') : '–'),
        el('td', {}, r ? `${r.score}/${r.max}` : ''), el('td', {}, r?.max ? Math.round(100 * r.score / r.max) + '%' : ''),
        vragen.map(v => el('td', {}, r ? (r.per?.[v.id] ? el('span', { class: 'ok' }, '✓') : el('span', { class: 'nok' }, '✗')) : '')),
        el('td', {}, r ? el('button', { class: 'klein-knop', onclick: async e => { e.stopPropagation(); if (!confirm(`${l.voornaam} mag de toets opnieuw maken? Het huidige resultaat wordt gewist.`)) return; await api('toets-reset', { toetsId, leerlingId: l.id }); await laad(); } }, 'Opnieuw') : ''));
      }))),
    detailBox);
}

S.ww ? laad() : toonLogin();


/* ================= Paspoort (leerkracht) ================= */
function paspoortBlok(l) {
  const pp = normPaspoort(S.paspoorten?.[l.id]);
  const sj = schooljaarVan();
  const wrap = el('div', { class: 'blok' }, el('div', { class: 'spelkop' }, el('h2', { style: 'margin:0;flex:1' }, '🛂 Kangoeroe-paspoort'),
    el('button', { class: 'knop tweede klein', onclick: () => drukPaspoort([{ leerling: l, paspoort: pp, resultaten: S.data.resultaten[l.id] || [], jaar: sj }]) }, '🖨 Paspoort afdrukken')));
  if (!S.paspoorten?.[l.id]) { wrap.append(el('p', { class: 'stil' }, 'Deze leerling heeft het paspoort nog niet ingevuld. Je kunt wel al een paspoort afdrukken met de resultaten uit de app.')); return wrap; }
  const ikJaren = Object.keys(pp.ditBenIk).sort().reverse().filter(j => DIT_BEN_IK.some(([k]) => pp.ditBenIk[j][k]));
  if (ikJaren.length) wrap.append(el('h3', {}, 'Dit ben ik'), ...ikJaren.map(j => el('div', {}, el('b', { class: 'stil' }, `Schooljaar ${j}`),
    el('ul', {}, DIT_BEN_IK.filter(([k]) => pp.ditBenIk[j][k]).map(([k, t]) => el('li', {}, el('b', {}, t + ': '), pp.ditBenIk[j][k]))))));
  const uit = paspoortUitdagingen().map(n => [n, pp.uitdagingen?.[n]?.[sj]]).filter(([, u]) => u && (u.status || u.niveau || u.notitie));
  if (uit.length) wrap.append(el('h3', {}, `Andere uitdagingen ${sj}`), el('div', { class: 'tabelwrap' }, el('table', { class: 'lijst' }, el('tr', {}, ['Uitdaging', 'Status', 'Niveau', 'Gevoel', 'Notitie'].map(h => el('th', {}, h))),
    uit.map(([n, u]) => el('tr', {}, el('td', {}, n), el('td', {}, { nog: 'nog niet', bezig: 'bezig', klaar: '✔ klaar' }[u.status] || ''), el('td', {}, u.niveau ? medaille(u.niveau) : ''), el('td', {}, u.gevoel ? GEVOEL[u.gevoel - 1] : ''), el('td', { style: 'white-space:normal' }, u.notitie || ''))))));
  const refl = [...(pp.reflecties || [])].sort((a, b) => b.datum.localeCompare(a.datum));
  if (refl.length) wrap.append(el('h3', {}, 'Reflecties'), ...refl.map(r => {
    const t = el('textarea', { class: 'tekst', rows: 2, placeholder: 'Schrijf feedback voor de leerling…' }); t.value = r.feedback?.tekst || '';
    const m = el('span', { class: 'stil' });
    return el('div', { class: 'pp-reflectie' }, el('div', { class: 'pp-r-kop' }, el('b', {}, `${PERIODES[r.periode]} · ${r.schooljaar}`), el('span', {}, `${r.motivatie ? 'motivatie ' + GEVOEL[r.motivatie - 1] : ''} ${r.uitdaging ? '· uitdaging: ' + ['te makkelijk', 'makkelijk', 'precies goed', 'pittig', 'te moeilijk'][r.uitdaging - 1] : ''}`)),
      REFLECTIEVRAGEN.filter(([k]) => r[k]).map(([k, q]) => el('p', {}, el('b', {}, q + ' '), r[k])),
      el('div', { class: 'pp-feedback' }, el('b', {}, '💬 Jouw feedback'), t, el('div', { class: 'knoppenrij' }, el('button', { class: 'knop klein', onclick: async () => {
        try { await api('lk-feedback', { id: l.id, reflectieId: r.id, tekst: t.value }); r.feedback = t.value.trim() ? { tekst: t.value } : undefined; m.textContent = 'Bewaard ✓ De leerling ziet dit in het paspoort.'; } catch (e) { m.textContent = e.message; }
      } }, 'Bewaar feedback'), m)));
  }));
  return wrap;
}
