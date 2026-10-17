'use strict';
/* ======================= Kangoeroe-paspoort (gedeeld door leerling- en leerkrachtpagina) ======================= */
const PASPOORT_UITDAGINGEN = [
  'WO: De aarde (website en werkbundel)', 'Zelfstudie: Planeten', 'Zelfstudie: Ridders en kastelen', 'Toneel en gedichten',
  'Droedels', 'Breinbrekers', "Sudoku's", 'Engels', 'Excel: interactieve werkblaadjes',
];
const PERIODES = ['Periode 1 (sept – dec)', 'Periode 2 (jan – maart)', 'Periode 3 (april – juni)'];
const GEVOEL = ['😟', '😐', '🙂', '😄', '🤩'];
const DIT_BEN_IK = [
  ['goedIn', 'Hier ben ik goed in'], ['nieuwsgierig', 'Hier ben ik nieuwsgierig naar'], ['favoriet', 'Mijn favoriete uitdaging'],
  ['moeilijk', 'Dit vind ik (nog) moeilijk'], ['leerdoel', 'Dit wil ik dit jaar leren'], ['motto', 'Mijn motto'],
];
const REFLECTIEVRAGEN = [
  ['goed', 'Wat ging goed?'], ['moeilijk', 'Wat was moeilijk?'], ['geleerd', 'Wat heb ik geleerd?'],
  ['aanpak', 'Hoe heb ik het aangepakt? Wat werkte?'], ['doel', 'Mijn volgend doel'],
];
const schooljaarVan = (d = new Date()) => { d = new Date(d); const j = d.getFullYear(), m = d.getMonth(); return m >= 8 ? `${j}-${j + 1}` : `${j - 1}-${j}`; };
const periodeVan = (d = new Date()) => { const m = new Date(d).getMonth(); return m >= 8 ? 0 : m <= 2 ? 1 : 2; };
const leegPaspoort = () => ({ ditBenIk: {}, uitdagingen: {}, reflecties: [] });
const paspoortUitdagingen = () => (EIGEN?.instellingen?.uitdagingen?.length ? EIGEN.instellingen.uitdagingen : PASPOORT_UITDAGINGEN);
const appVakken = () => Object.entries(VAKKEN).map(([k, v]) => ({ k, naam: `${v.icoon} Kangoeroe-Kluis: ${v.naam}` }));
const spellenVan = vak => SPELLEN.filter(s => s.vak === vak);
/* "Dit ben ik" wordt per schooljaar bewaard: { '2026-2027': { goedIn: '…' } }. Oude paspoorten (zonder schooljaar) worden omgezet. */
function normPaspoort(p) {
  p = { ...leegPaspoort(), ...(p || {}) };
  const d = p.ditBenIk || {};
  if (Object.values(d).some(v => typeof v === 'string')) p.ditBenIk = { [schooljaarVan(p.bijgewerkt || new Date())]: d };
  return p;
}
/* De drie schooljaren van het paspoort: vanaf het eerste jaar met gegevens (maximaal 3 jaar terug). */
function paspoortJaren(pp = leegPaspoort(), resultaten = []) {
  const alle = [schooljaarVan(), ...resultaten.map(r => schooljaarVan(r.datum)), ...Object.keys(pp.ditBenIk || {}), ...(pp.reflecties || []).map(r => r.schooljaar)].filter(j => /^\d{4}-\d{4}$/.test(j)).sort();
  let start = Number(alle[0].slice(0, 4)); const nu = Number(schooljaarVan().slice(0, 4));
  if (nu - start > 2) start = nu - 2;
  return [0, 1, 2].map(i => `${start + i}-${start + i + 1}`);
}
/* Per spel: hoogste niveau vóór dit schooljaar (eerder) en tot en met dit schooljaar (nu). */
function medaillesVan(resultaten = [], jaar = schooljaarVan()) {
  const best = f => Math.max(0, ...f.map(r => r.niveau));
  return Object.fromEntries(SPELLEN.map(s => {
    const ok = resultaten.filter(r => r.spel === s.id && r.juist);
    return [s.id, { eerder: best(ok.filter(r => schooljaarVan(r.datum) < jaar)), nu: best(ok.filter(r => schooljaarVan(r.datum) <= jaar)) }];
  }));
}
/* Groei per schooljaar en per vak: medailles = per spel het hoogste niveau tot en met dat jaar (max. 5 per spel). */
function groeiVan(resultaten = [], jaren) {
  jaren = jaren || [...new Set([...resultaten.map(r => schooljaarVan(r.datum)), schooljaarVan()])].sort();
  return jaren.map(jaar => {
    const m = medaillesVan(resultaten, jaar);
    const ditJaar = resultaten.filter(r => r.juist && schooljaarVan(r.datum) === jaar);
    const vakken = Object.fromEntries(Object.keys(VAKKEN).map(v => {
      const sp = spellenVan(v);
      const med = sp.reduce((a, s) => a + m[s.id].nu, 0), eerder = sp.reduce((a, s) => a + m[s.id].eerder, 0);
      const gekraakt = ditJaar.filter(r => SPELLEN.find(s => s.id === r.spel)?.vak === v).length;
      return [v, { med, nieuw: med - eerder, max: sp.length * 5, spellen: sp.length, gekraakt }];
    }));
    return { jaar, vakken, medailles: m, gekraakt: ditJaar.length, toekomst: jaar > schooljaarVan() };
  });
}

/* ---------- Afdrukversie (A4). Zonder gegevens = blanco paspoort om met de hand in te vullen.
   Blad 1 (Dit ben ik) en het laatste blad (Mijn groei) dienen voor 3 schooljaren; de bladen ertussen zijn per schooljaar.
   opties.jaarbladen = alleen de bladen van één schooljaar afdrukken. ---------- */
function paspoortHTML(lijst, opties = {}) {
  const esc = s => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const med = (n, stand) => `<span class="m m${n}${stand ? ' ' + stand : ''}">${'BZGPD'[n - 1]}</span>`;
  const medRij = niveau => [1, 2, 3, 4, 5].map(n => med(n, niveau >= n ? 'aan' : '')).join('');
  const medRijSpel = (eerder, nu) => [1, 2, 3, 4, 5].map(n => med(n, n <= eerder ? 'eerder' : n <= nu ? 'aan' : '')).join('');
  const lijnen = (tekst, aantal) => tekst ? `<div class="ingevuld">${esc(tekst).replace(/\n/g, '<br>')}</div>` : '<div class="lijn"></div>'.repeat(aantal);
  const jaarTxt = j => j ? j.replace('-', ' – ') : '20… – 20…';
  const paginas = lijst.map(({ leerling = {}, paspoort, resultaten = [], jaar }) => {
    const blanco = !leerling.voornaam;
    const p = normPaspoort(paspoort);
    const sj = blanco ? null : (jaar || schooljaarVan());
    const jaren = blanco ? [null, null, null] : paspoortJaren(p, resultaten);
    const groei = blanco ? [] : groeiVan(resultaten, jaren);
    const gj = blanco ? null : groeiVan(resultaten, [sj])[0];
    const naam = blanco ? '' : `${esc(leerling.voornaam)} ${esc(leerling.naam)}`;
    const kop = titel => `<header><span class="logo">🦘 Kangoeroe-paspoort</span><span class="kop-naam">${naam || 'Naam: …………………………………'}</span><span class="titel">${titel}</span></header>`;
    let h = '';
    /* 1. Voorblad: voor 3 schooljaren */
    if (!opties.jaarbladen) h += `<section class="blad voorblad">
      <div class="pas-kop"><div class="pas-logo">🦘</div><div><h1>Kangoeroe-paspoort</h1><p>Mijn uitdagingen, mijn groei, mijn verhaal</p></div></div>
      <table class="gegevens"><tr><th>Naam</th><td>${naam}</td></tr></table>
      <h2>Dit ben ik <small>Vul elk schooljaar een nieuwe kolom in. Zo zie je hoe je verandert.</small></h2>
      <table class="ik"><thead><tr><th></th>${jaren.map((j, i) => `<th>Jaar ${i + 1}<br><span>${jaarTxt(j)}</span></th>`).join('')}</tr></thead>
      <tbody>${DIT_BEN_IK.map(([k, l]) => `<tr><th>${l}</th>${jaren.map(j => `<td>${lijnen(j && p.ditBenIk[j]?.[k], 3)}</td>`).join('')}</tr>`).join('')}</tbody></table>
    </section>`;
    /* 2. Medailles per onderdeel (per schooljaar) */
    const blok = ({ k }) => {
      const sp = spellenVan(k), v = gj?.vakken[k];
      return `<div class="kluis"><h3>${VAKKEN[k].icoon} ${VAKKEN[k].naam}<span>${v ? v.med : '……'} / ${sp.length * 5}</span></h3>
        ${sp.map(s => { const m = gj?.medailles[s.id]; return `<div class="ond"><span>${s.icoon || ''} ${esc(s.naam)}</span><span class="meds">${medRijSpel(m?.eerder || 0, m?.nu || 0)}</span></div>`; }).join('')}
        ${[1, 2].map(() => `<div class="ond nieuw"><span class="schrijf"></span><span class="meds">${medRij(0)}</span></div>`).join('')}</div>`;
    };
    h += `<section class="blad">${kop(`Mijn medailles · ${jaarTxt(sj)}`)}
      <p class="uitleg">${blanco ? 'Nieuw schooljaar, nieuw blad. Zet eerst een ✓ in de medailles die je vorig jaar al had. Kleur daarna elke medaille die je dit jaar haalt. Schrijf bovenaan elke kluis hoeveel medailles je in totaal hebt (✓ en gekleurd samen). Komt er een nieuw onderdeel bij in de app? Schrijf het op een lege lijn.' : 'Gekleurd = dit schooljaar behaald · ✓ = al behaald in een vorig schooljaar. Bovenaan elke kluis zie je je totaal. Komt er een nieuw onderdeel bij in de app? Schrijf het op een lege lijn.'}
      <br><b>Brons</b> = ik ken de basis · <b>Zilver</b> = het lukt meestal · <b>Goud</b> = het lukt vlot · <b>Platinum</b> = ik kan het uitleggen · <b>Diamant</b> = ik zoek er zelf nog moeilijkere uitdagingen bij.</p>
      <div class="kluizen">${appVakken().map(blok).join('')}</div>
    </section>`;
    /* 3. Andere uitdagingen (per schooljaar) */
    const rijAnder = paspoortUitdagingen().map(n => {
      const u = (sj && p.uitdagingen?.[n]?.[sj]) || {};
      const st = { nog: 'nog niet', bezig: 'bezig', klaar: '✔ klaar' }[u.status] || '';
      return `<tr><td class="u-naam">${esc(n)}</td><td class="c">${esc(u.datum || '')}</td><td class="meds">${medRij(u.niveau || 0)}</td><td class="c">${st || '<span class="vakje"></span>'}</td><td class="gevoel">${GEVOEL.map((e, i) => `<span class="${u.gevoel === i + 1 ? 'aan' : ''}">${e}</span>`).join('')}</td></tr>${u.notitie ? `<tr class="notitie"><td colspan="5">📝 ${esc(u.notitie)}</td></tr>` : ''}`;
    }).join('');
    h += `<section class="blad">${kop(`Andere uitdagingen · ${jaarTxt(sj)}`)}
      <p class="uitleg">Kleur je niveau, duid aan of je klaar bent en kleur hoe het voelde.</p>
      <table class="kaart"><thead><tr><th>Uitdaging</th><th>Gestart op</th><th>Mijn niveau</th><th>Klaar?</th><th>Hoe voelde het?</th></tr></thead><tbody>${rijAnder}
        ${Array.from({ length: Math.max(3, 10 - Math.max(0, paspoortUitdagingen().length - 9)) }, () => `<tr><td class="u-naam leeg"></td><td></td><td class="meds">${medRij(0)}</td><td class="c"><span class="vakje"></span></td><td class="gevoel">${GEVOEL.map(e => `<span>${e}</span>`).join('')}</td></tr>`).join('')}</tbody></table>
      <div class="trots"><b>⭐ Mijn mooiste uitdaging dit jaar was … omdat …</b>${lijnen('', 2)}</div>
    </section>`;
    /* 4. Reflectiebladen (per schooljaar): ingevulde reflecties van dit schooljaar, of 1 blanco */
    const refl = blanco ? [null] : (p.reflecties || []).filter(r => r.schooljaar === sj);
    for (const r of (refl.length ? refl : [null])) {
      h += `<section class="blad">${kop(`Reflectie · ${r ? esc(PERIODES[r.periode] || '') + ' · ' + jaarTxt(sj) : 'periode …… · ' + jaarTxt(sj)}`)}
        <div class="schalen-p">
          <div><b>Hoe gemotiveerd was ik?</b><div class="gevoel groot">${GEVOEL.map((e, i) => `<span class="${r?.motivatie === i + 1 ? 'aan' : ''}">${e}</span>`).join('')}</div></div>
          <div><b>Hoeveel uitdaging voelde ik?</b><div class="thermo">${['te makkelijk', 'makkelijk', 'precies goed', 'pittig', 'te moeilijk'].map((t, i) => `<span class="${r?.uitdaging === i + 1 ? 'aan' : ''}">${t}</span>`).join('')}</div></div>
        </div>
        ${REFLECTIEVRAGEN.map(([k, l]) => `<div class="vraag"><b>${l}</b>${lijnen(r?.[k], k === 'doel' ? 2 : 3)}</div>`).join('')}
        <div class="feedback-p"><b>💬 Feedback van mijn leerkracht</b>${lijnen(r?.feedback?.tekst, 3)}</div>
        <div class="handtekening"><span>Datum: ${r ? new Date(r.datum).toLocaleDateString('nl-BE') : '………………'}</span><span>Handtekening leerling: ……………………</span><span>Leerkracht: ……………………</span></div>
      </section>`;
    }
    /* 5. Mijn groei: voor 3 schooljaren */
    if (!opties.jaarbladen) h += `<section class="blad">${kop('Mijn groei over 3 schooljaren')}
      <p class="uitleg">Tel op je medailleblad hoeveel medailles je hebt in elke kluis (✓ en gekleurd samen) en schrijf het getal op. Kleur dan <b>1 blokje per 5 medailles</b>. Elke kluis heeft evenveel blokjes als onderdelen: alle blokjes gekleurd = overal diamant! De blokjes met stippellijn zijn voor nieuwe onderdelen die later in de app bijkomen.</p>
      <table class="groei"><thead><tr><th>Kangoeroe-Kluis</th>${jaren.map((j, i) => `<th>Jaar ${i + 1} · ${jaarTxt(j)}</th>`).join('')}</tr></thead><tbody>
      ${appVakken().map(({ k }) => { const n = spellenVan(k).length; return `<tr><th>${VAKKEN[k].icoon} ${VAKKEN[k].naam}</th>${jaren.map((j, i) => { const v = groei[i] && !groei[i].toekomst ? groei[i].vakken[k] : null; const aan = v ? Math.floor(v.med / 5) : 0; return `<td><span class="blokjes">${Array.from({ length: n }, (_, b) => `<i class="${b < aan ? 'aan' : ''}"></i>`).join('')}<i class="extra"></i><i class="extra"></i></span><small>${v ? v.med : '……'} / ${n * 5} medailles</small></td>`; }).join('')}</tr>`; }).join('')}
      <tr><th>🔐 Kluizen gekraakt</th>${jaren.map((j, i) => `<td class="c"><b>${groei[i] && !groei[i].toekomst ? groei[i].gekraakt : '……'}</b></td>`).join('')}</tr>
      </tbody></table>
      ${jaren.map((j, i) => `<div class="trots"><b>🏆 Jaar ${i + 1}: hier ben ik het meest trots op</b>${lijnen('', 2)}</div>`).join('')}
      <div class="trots"><b>🚀 Mijn grootste groei in deze 3 jaar</b>${lijnen('', 2)}</div>
    </section>`;
    return h;
  }).join('');
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>Kangoeroe-paspoort</title>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
<style>
@page { size: A4; margin: 11mm; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font: 11pt/1.35 'Nunito', sans-serif; color: #1F2A2E; margin: 0; background: #e9e5dd; }
.blad { width: 188mm; min-height: 274mm; margin: 8mm auto; background: #fff; padding: 9mm; page-break-after: always; break-after: page; position: relative; border-radius: 3mm; }
@media print { body { background: #fff; } .blad { margin: 0; padding: 0; border-radius: 0; width: auto; min-height: 0; height: 273mm; } .knoppen { display: none; } }
h1, h2, h3, .logo, .titel { font-family: 'Fredoka', sans-serif; }
header { display: flex; align-items: center; gap: 4mm; border-bottom: 1.2mm solid #0F5257; padding-bottom: 2mm; margin-bottom: 4mm; }
.logo { color: #0F5257; font-weight: 700; font-size: 12pt; } .kop-naam { flex: 1; color: #5C6B70; font-weight: 700; } .titel { font-size: 15pt; font-weight: 700; color: #E8772E; }
.voorblad { background: linear-gradient(180deg, #0F5257 0 50mm, #fff 50mm); } @media print { .voorblad { background: linear-gradient(180deg, #0F5257 0 41mm, #fff 41mm); } }
.pas-kop { display: flex; align-items: center; gap: 6mm; color: #fff; padding-top: 4mm; }
.pas-logo { width: 34mm; height: 34mm; border-radius: 50%; background: #E8772E; display: grid; place-items: center; font-size: 22mm; border: 1.5mm solid #fff; }
.pas-kop h1 { font-size: 30pt; margin: 0; } .pas-kop p { margin: 1mm 0 0; font-size: 13pt; opacity: .9; }
table.gegevens { width: 100%; border-collapse: collapse; margin-top: 12mm; } table.gegevens th { text-align: left; width: 22mm; color: #0F5257; padding: 2.5mm 0; font-size: 13pt; } table.gegevens td { border-bottom: .4mm solid #C9C2B5; font-weight: 800; font-size: 15pt; }
h2 { color: #0F5257; margin: 6mm 0 2.5mm; font-size: 17pt; } h2 small { font: 400 9pt 'Nunito', sans-serif; color: #5C6B70; margin-left: 2mm; }
table.ik { width: 100%; border-collapse: separate; border-spacing: 1.5mm; table-layout: fixed; margin: 0 -1.5mm; }
table.ik thead th { background: #E3F0EF; color: #0F5257; border-radius: 2mm; padding: 1.5mm; font: 700 10.5pt 'Fredoka', sans-serif; } table.ik thead th span { font: 700 8.5pt 'Nunito', sans-serif; color: #5C6B70; } table.ik thead th:first-child { background: none; width: 33mm; }
table.ik tbody th { text-align: left; vertical-align: top; color: #0F5257; font-size: 9.5pt; padding-top: 1.5mm; }
table.ik td { vertical-align: top; border: .3mm solid #E2DCD0; border-radius: 2mm; padding: 0 2mm 1mm; height: 27mm; } table.ik .lijn { height: 8mm; } table.ik .ingevuld { border: none; font-size: 9.5pt; }
.vak b, .vraag b, .trots b, .feedback-p b { color: #0F5257; display: block; margin-bottom: 1mm; }
.lijn { border-bottom: .3mm solid #C9C2B5; height: 7.5mm; }
.ingevuld { font-family: 'Comic Sans MS', 'Segoe Print', cursive; color: #1d3f8a; min-height: 7mm; border-bottom: .3mm solid #C9C2B5; padding: 1mm 0; }
.kluizen { column-count: 2; column-gap: 6mm; }
.kluis { break-inside: avoid; border: .4mm solid #E2DCD0; border-radius: 2.5mm; padding: 1.2mm 2.5mm 1.5mm; margin-bottom: 3mm; }
.kluis h3 { display: flex; justify-content: space-between; margin: 0 0 1mm; color: #0F5257; font-size: 11pt; border-bottom: .4mm solid #E3F0EF; padding-bottom: 1mm; } .kluis h3 span { color: #E8772E; font-size: 10pt; }
.ond { display: flex; justify-content: space-between; align-items: center; font-size: 8.5pt; font-weight: 700; padding: .35mm 0; border-bottom: .2mm dotted #E2DCD0; } .ond:last-child { border-bottom: none; }
.ond > span:first-child { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-right: 1.5mm; } .ond .meds { white-space: nowrap; flex: none; }
.ond.nieuw .schrijf { flex: 1; border-bottom: .3mm solid #C9C2B5; height: 4mm; margin-right: 3mm; }
.ond .m { width: 4.6mm; height: 4.6mm; font-size: 5.6pt; margin-right: .6mm; }
.m.eerder { color: transparent; position: relative; border-color: #8C99A3; } .m.eerder::after { content: '✓'; position: absolute; inset: 0; display: grid; place-items: center; color: #2E8B57; font-size: 8pt; font-weight: 800; }
tr.notitie td { height: auto; font-size: 8.5pt; color: #1d3f8a; padding-top: 0; }
.uitleg { color: #5C6B70; font-size: 9.5pt; margin: 0 0 3mm; }
table.kaart { width: 100%; border-collapse: collapse; margin-bottom: 5mm; font-size: 9.5pt; }
table.kaart th { background: #E3F0EF; color: #0F5257; text-align: left; padding: 1.8mm; font-size: 8.5pt; text-transform: uppercase; letter-spacing: .3px; }
table.kaart td { border-bottom: .3mm solid #E2DCD0; padding: 1.2mm 1.6mm; height: 8.6mm; } .u-naam { font-weight: 800; width: 58mm; } .u-naam.leeg { border-bottom: .3mm solid #9a9488; }
.c { text-align: center; } .vakje { display: inline-block; width: 5mm; height: 5mm; border: .4mm solid #5C6B70; border-radius: 1mm; }
.m { display: inline-grid; place-items: center; width: 6mm; height: 6mm; border-radius: 50%; border: .4mm solid #B9B2A5; font: 700 7pt 'Fredoka', sans-serif; color: #B9B2A5; margin-right: .8mm; }
.m.aan.m1 { background: #C07A3A; color: #fff; border-color: #A0602A; } .m.aan.m2 { background: #A7B1B8; color: #fff; border-color: #8C99A3; } .m.aan.m3 { background: #D4A017; color: #fff; border-color: #B58800; } .m.aan.m4 { background: #7F9AAB; color: #fff; border-color: #5f7a8b; } .m.aan.m5 { background: #6BC8F0; color: #fff; border-color: #3fa9d6; }
.gevoel { white-space: nowrap; } .gevoel span { font-size: 9.5pt; margin-right: .6mm; opacity: .35; } .gevoel span.aan { opacity: 1; font-size: 12pt; } .gevoel.groot span { font-size: 17pt; margin-right: 3mm; }
.schalen-p { display: grid; grid-template-columns: 1fr 1.3fr; gap: 6mm; background: #FBF6EE; border-radius: 3mm; padding: 3mm 4mm; margin-bottom: 3mm; }
.thermo { display: flex; gap: 1mm; margin-top: 1.5mm; } .thermo span { flex: 1; text-align: center; font-size: 7.5pt; font-weight: 800; border: .4mm solid #C9C2B5; border-radius: 2mm; padding: 1.2mm .5mm; color: #5C6B70; } .thermo span.aan { background: #E8772E; color: #fff; border-color: #E8772E; }
.vraag { margin-bottom: 3mm; }
.feedback-p { background: #EFE8FB; border-radius: 3mm; padding: 3mm 4mm; margin-top: 2mm; } .feedback-p b { color: #7C4DCC; } .feedback-p .lijn { border-color: #cdbff0; }
.handtekening { display: flex; justify-content: space-between; margin-top: 5mm; font-size: 9pt; color: #5C6B70; }
table.groei { width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 5mm; }
table.groei thead th { background: #E3F0EF; color: #0F5257; font: 700 9.5pt 'Fredoka', sans-serif; padding: 1.8mm; text-align: left; } table.groei thead th:first-child { width: 32mm; }
table.groei tbody th { text-align: left; color: #0F5257; font-size: 9.5pt; } table.groei td, table.groei tbody th { border-bottom: .3mm solid #E2DCD0; padding: 2mm 1.5mm; }
table.groei small { display: block; font-size: 8pt; color: #5C6B70; margin-top: .8mm; }
.blokjes { display: flex; gap: .6mm; } .blokjes i { flex: 1; max-width: 5mm; height: 5mm; border: .3mm solid #B9B2A5; border-radius: .8mm; } .blokjes i.aan { background: #2E8B57; border-color: #2E8B57; } .blokjes i.extra { border-style: dashed; }
.trots { margin-bottom: 4mm; }
.knoppen { position: sticky; top: 0; text-align: center; padding: 3mm; background: #0F5257; } .knoppen button { font: 700 12pt 'Nunito', sans-serif; padding: 2mm 6mm; border-radius: 99px; border: none; background: #E8772E; color: #fff; cursor: pointer; }
</style></head><body><div class="knoppen"><button onclick="print()">🖨 Afdrukken (of bewaren als PDF)</button></div>${paginas}</body></html>`;
}
function drukPaspoort(lijst, opties) {
  const w = window.open('', '_blank');
  if (!w) { alert('Je browser blokkeerde het afdrukvenster. Sta pop-ups toe voor deze site.'); return; }
  w.document.write(paspoortHTML(lijst, opties)); w.document.close();
}
