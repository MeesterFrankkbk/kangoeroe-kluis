'use strict';
/* ======================= Korte reflectie na een spel (gedeeld door leerling- en leerkrachtpagina) =======================
   De leerling blikt kort terug wanneer hij een spel verlaat (niet na elk niveau): hoe ging het, wat was moeilijk, wat deed ik toen,
   wat heb ik geleerd, wat neem ik mee. De leerkracht ziet alles, kan reageren, duidt aan wat besproken is en drukt per periode af. */
const SPELGEVOEL = [
  { ico: '😴', t: 'Te makkelijk' },
  { ico: '🙂', t: 'Goed' },
  { ico: '🧗', t: 'Moeilijk' },
];
const AANPAK = [
  ['uitleg', '📖 Ik las de uitleg opnieuw'], ['stap', '🪜 Ik werkte stap voor stap'], ['anders', '🔄 Ik probeerde een andere manier'],
  ['schets', '✏️ Ik maakte een schets of notitie'], ['patroon', '🔍 Ik zocht een patroon of regel'], ['controle', '✔️ Ik controleerde mijn antwoord'],
  ['hint', '💡 Ik nam een hint'], ['pauze', '☕ Ik nam even pauze en probeerde opnieuw'], ['hulp', '🙋 Ik vroeg hulp'], ['stop', '🛑 Ik stopte ermee'],
];
const VOLGENDE = [
  ['hoger', '⬆️ Een hoger niveau'], ['meester', '👑 De meesterproef'], ['record', '⏱ Mijn record breken'], ['zonderhint', '🚫 Geen hints gebruiken'], ['ander', '🧩 Een ander onderdeel'],
];
const REFL_STANDAARD = { aan: true, hoeVaak: 'dag', min: 3, overslaan: true };
const reflInst = () => ({ ...REFL_STANDAARD, ...((typeof EIGEN !== 'undefined' && EIGEN?.instellingen?.reflectie) || {}) });
const aanpakNaam = k => (AANPAK.find(a => a[0] === k) || [k, k])[1];
const volgendeNaam = k => (VOLGENDE.find(a => a[0] === k) || [k, k])[1];
const spelNaamVan = id => SPELLEN.find(s => s.id === id)?.naam || id;
const spelIcoVan = id => SPELLEN.find(s => s.id === id)?.icoon || '';

/* korte zin met de feiten van het oefenmoment */
function sessieZin(s = {}) {
  if (!s.opgaven) return '';
  const niv = (s.niveaus || []).map(n => NIVEAUS[n]?.toLowerCase()).filter(Boolean);
  const nivTxt = niv.length > 1 ? niv.slice(0, -1).join(', ') + ' en ' + niv[niv.length - 1] : niv[0] || '';
  return `${s.opgaven} ${s.opgaven === 1 ? 'opgave' : 'opgaven'} (${s.gelukt} gelukt)${nivTxt ? ' op ' + nivTxt : ''}` +
    `${s.hints ? `, ${s.hints} ${s.hints === 1 ? 'hint' : 'hints'}` : ', zonder hints'}${s.minuten ? `, ${s.minuten} min` : ''}` +
    `${s.nieuw ? ` · nieuwe medaille: ${NIVEAUS[s.nieuw]}` : ''}${s.meester ? ' · 👑 meesterproef' : ''}`;
}
const lokaalDatum = d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d + 'T00:00') : new Date(d);
const dagStart = d => { const x = lokaalDatum(d); x.setHours(0, 0, 0, 0); return x; };
const dagEind = d => { const x = lokaalDatum(d); x.setHours(23, 59, 59, 999); return x; };

/* Snelkeuzes voor een periode */
function periodeKeuzes(nu = new Date()) {
  const sj = Number(schooljaarVan(nu).slice(0, 4));
  const d = n => { const x = new Date(nu); x.setDate(x.getDate() - n); return x; };
  return [
    ['Laatste 2 weken', d(13), nu],
    ['Laatste maand', d(30), nu],
    ['Deze maand', new Date(nu.getFullYear(), nu.getMonth(), 1), nu],
    [PERIODES[0], new Date(sj, 8, 1), new Date(sj, 11, 31)],
    [PERIODES[1], new Date(sj + 1, 0, 1), new Date(sj + 1, 2, 31)],
    [PERIODES[2], new Date(sj + 1, 3, 1), new Date(sj + 1, 5, 30)],
    [`Schooljaar ${sj}-${sj + 1}`, new Date(sj, 8, 1), new Date(sj + 1, 7, 31)],
  ];
}
const isoDag = d => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };

/* Wat gebeurde er in de app in deze periode? (oefenen + nieuwe medailles) */
function periodeCijfers(resultaten = [], van, tot) {
  const a = +dagStart(van), b = +dagEind(tot);
  const inP = resultaten.filter(r => { const t = Date.parse(r.datum); return t >= a && t <= b; });
  const nieuw = [];
  for (const s of SPELLEN) {
    const ok = resultaten.filter(r => r.spel === s.id && r.juist);
    const voor = Math.max(0, ...ok.filter(r => Date.parse(r.datum) < a).map(r => r.niveau));
    const per = Math.max(0, ...ok.filter(r => { const t = Date.parse(r.datum); return t >= a && t <= b; }).map(r => r.niveau));
    const kroon = ok.some(r => r.meester && Date.parse(r.datum) >= a && Date.parse(r.datum) <= b) && !ok.some(r => r.meester && Date.parse(r.datum) < a);
    if (per > voor || kroon) nieuw.push({ spel: s, van: voor, tot: Math.max(per, voor), kroon });
  }
  return {
    opgaven: inP.length, gelukt: inP.filter(r => r.juist).length, minuten: Math.round(inP.reduce((x, r) => x + (r.seconden || 0), 0) / 60),
    onderdelen: new Set(inP.map(r => r.spel)).size, medailles: nieuw.reduce((x, n) => x + n.tot - n.van, 0), nieuw,
  };
}

/* ---------- Afdrukversie: periodiek overzicht per leerling (A4, ook leesbaar voor ouders) ---------- */
function terugblikHTML(lijst, opties = {}) {
  const esc = s => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const van = lokaalDatum(opties.van), tot = lokaalDatum(opties.tot);
  const fd = d => new Date(d).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' });
  const fk = d => new Date(d).toLocaleDateString('nl-BE', { weekday: 'short', day: 'numeric', month: 'short' });
  const a = +dagStart(van), b = +dagEind(tot);
  const inP = d => { const t = Date.parse(d); return t >= a && t <= b; };
  const lijnen = n => '<div class="lijn"></div>'.repeat(n);
  const med = n => `<span class="m m${n}">${'BZGPD'[n - 1]}</span>`;
  const paginas = lijst.map(({ leerling, srefs = [], resultaten = [], paspoort }) => {
    const refl = srefs.filter(r => inP(r.datum) && !r.overgeslagen).sort((x, y) => x.datum.localeCompare(y.datum));
    const c = periodeCijfers(resultaten, van, tot);
    const telG = [0, 1, 2].map(i => refl.filter(r => r.gevoel === i + 1).length);
    const telA = {}; refl.forEach(r => (r.aanpak || []).forEach(k => telA[k] = (telA[k] || 0) + 1));
    const topA = Object.entries(telA).sort((x, y) => y[1] - x[1]).slice(0, 5);
    const periodiek = opties.metPeriodiek ? (normPaspoort(paspoort).reflecties || []).filter(r => inP(r.datum)) : [];
    let h = `<section class="blad">
      <header><span class="logo">🦘 Kangoeroe-Kluis</span><span class="kop-naam">${esc(leerling.voornaam)} ${esc(leerling.naam)}${leerling.klas ? ' · ' + esc(leerling.klas) : ''}</span><span class="titel">Terugblik</span></header>
      <p class="periode"><b>Periode:</b> ${fd(van)} – ${fd(tot)}</p>
      <p class="uitleg">Na het oefenen in de Kangoeroe-Kluis blikt ${esc(leerling.voornaam)} kort terug: hoe ging het, wat was moeilijk en wat deed ${esc(leerling.voornaam)} toen, wat is er bijgeleerd en wat neemt ${esc(leerling.voornaam)} mee naar de volgende stap. Dit overzicht bundelt die reflecties${opties.metMedailles ? ' en wat er in deze periode bereikt werd' : ''}.</p>`;
    if (opties.metMedailles) h += `<div class="kader cijfers">
        <div><b>${c.opgaven}</b><span>opgaven gemaakt</span></div><div><b>${c.gelukt}</b><span>kluizen gekraakt</span></div>
        <div><b>${c.onderdelen}</b><span>onderdelen</span></div><div><b>${c.minuten}</b><span>minuten geoefend</span></div><div><b>${c.medailles}</b><span>nieuwe medailles</span></div></div>
      ${c.nieuw.length ? `<div class="nieuw"><b>Nieuw behaald:</b> ${c.nieuw.map(n => `<span class="nm">${esc(n.spel.icoon || '')} ${esc(n.spel.naam)} ${n.tot > n.van ? Array.from({ length: n.tot - n.van }, (_, i) => med(n.van + i + 1)).join('') : ''}${n.kroon ? ' ♛' : ''}</span>`).join(' ')}</div>` : ''}`;
    h += `<div class="kader samen">
        <div><b>Hoe voelde het?</b> ${SPELGEVOEL.map((g, i) => `<span class="gv">${g.ico} ${g.t.toLowerCase()}: <b>${telG[i]}</b></span>`).join('')}</div>
        ${topA.length ? `<div><b>Zo pakte ${esc(leerling.voornaam)} moeilijke momenten aan:</b> ${topA.map(([k, n]) => `${esc(aanpakNaam(k))} (${n}×)`).join(' · ')}</div>` : ''}
      </div>`;
    if (!refl.length) h += `<p class="leeg">Geen korte reflecties in deze periode.</p>`;
    h += refl.map(r => `<div class="refl">
        <div class="r-kop"><b>${esc(spelIcoVan(r.spel))} ${esc(spelNaamVan(r.spel))}</b>${r.themaNaam ? ` <span class="thema">${esc(r.themaNaam)}</span>` : ''}<span class="r-dat">${fk(r.datum)}</span><span class="r-gv">${r.gevoel ? SPELGEVOEL[r.gevoel - 1].ico + ' ' + SPELGEVOEL[r.gevoel - 1].t : ''}</span></div>
        ${r.sessie?.opgaven ? `<div class="feit">${esc(sessieZin(r.sessie))}</div>` : ''}
        ${r.moeilijk ? `<p><b>${r.gevoel === 1 ? 'Waarom te makkelijk?' : 'Wat vond ik moeilijk?'}</b> ${esc(r.moeilijk)}</p>` : ''}
        ${(r.aanpak || []).length || r.aanpakTekst ? `<p><b>Wat deed ik toen?</b> ${esc([...(r.aanpak || []).map(aanpakNaam), r.aanpakTekst].filter(Boolean).join(' · '))}</p>` : ''}
        ${(r.volgende || []).length ? `<p><b>Volgende keer kies ik:</b> ${esc(r.volgende.map(volgendeNaam).join(' · '))}</p>` : ''}
        ${r.geleerd ? `<p><b>Wat heb ik (bij)geleerd?</b> ${esc(r.geleerd)}</p>` : ''}
        ${r.meenemen ? `<p><b>Wat neem ik mee?</b> ${esc(r.meenemen)}</p>` : ''}
        ${r.reactie?.tekst && opties.metReactie !== false ? `<p class="reactie"><b>💬 Leerkracht:</b> ${esc(r.reactie.tekst)}</p>` : ''}
      </div>`).join('');
    if (periodiek.length) h += `<h3>Reflecties in het paspoort</h3>` + periodiek.map(r => `<div class="refl">
        <div class="r-kop"><b>${esc(PERIODES[r.periode] || '')} · ${esc(r.schooljaar)}</b><span class="r-dat">${fk(r.datum)}</span><span class="r-gv">${r.motivatie ? 'motivatie ' + GEVOEL[r.motivatie - 1] : ''}</span></div>
        ${REFLECTIEVRAGEN.filter(([k]) => r[k]).map(([k, l]) => `<p><b>${esc(l)}</b> ${esc(r[k])}</p>`).join('')}
        ${r.feedback?.tekst ? `<p class="reactie"><b>💬 Leerkracht:</b> ${esc(r.feedback.tekst)}</p>` : ''}</div>`).join('');
    h += `<div class="slot"><div class="kader"><b>Opmerking van de leerkracht</b>${lijnen(3)}</div>
        <div class="kader"><b>Reactie van de ouders</b>${lijnen(3)}</div>
        <div class="handtekening"><span>Handtekening leerkracht: ……………………</span><span>Handtekening ouder: ……………………</span></div></div>
    </section>`;
    return h;
  }).join('');
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>Terugblik Kangoeroe-Kluis</title>
<style>
@page { size: A4; margin: 12mm; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font: 10pt/1.4 Verdana, 'DejaVu Sans', Arial, sans-serif; color: #000; margin: 0; background: #d9d9d9; }
.blad { width: 186mm; margin: 8mm auto; background: #fff; break-after: page; page-break-after: always; }
.blad:last-of-type { break-after: auto; page-break-after: auto; }
@media screen { .blad { padding: 10mm; width: 210mm; box-shadow: 0 1mm 4mm rgba(0,0,0,.25); } }
@media print { body { background: #fff; } .blad { margin: 0; } .knoppen { display: none; } }
h3, .logo, .titel { font-family: Arial, 'Liberation Sans', sans-serif; }
header { display: flex; align-items: flex-end; gap: 4mm; border-bottom: .8mm solid #000; padding-bottom: 1.5mm; margin-bottom: 3mm; }
.logo { font-weight: 700; font-size: 11pt; white-space: nowrap; } .kop-naam { flex: 1; font-size: 11pt; font-weight: 700; } .titel { font-size: 14pt; font-weight: 700; }
.periode { margin: 0 0 1.5mm; font-size: 10.5pt; } .uitleg { font-size: 8.8pt; color: #222; margin: 0 0 3mm; }
.kader { border: .35mm solid #000; border-radius: 2.5mm; padding: 2mm 3mm; margin-bottom: 2.5mm; break-inside: avoid; }
.cijfers { display: grid; grid-template-columns: repeat(5, 1fr); text-align: center; } .cijfers b { display: block; font-size: 15pt; font-family: Arial, sans-serif; } .cijfers span { font-size: 8pt; }
.nieuw { font-size: 9pt; margin: -1mm 0 2.5mm; } .nm { white-space: nowrap; margin-right: 2.5mm; }
.m { display: inline-grid; place-items: center; width: 4.6mm; height: 4.6mm; border-radius: 50%; border: .5mm solid #000; font: 700 6.5pt Arial, sans-serif; margin-left: .5mm; vertical-align: -1mm; }
.m1 { background: #E3A46F; } .m2 { background: #D0D5D9; } .m3 { background: #F2CE4C; } .m4 { background: #B9CCD8; } .m5 { background: #A8E0F7; }
.samen div + div { margin-top: 1mm; } .gv { margin-left: 3mm; white-space: nowrap; }
.refl { border-left: 1.2mm solid #000; padding: 1mm 0 1mm 3mm; margin: 0 0 2.5mm; break-inside: avoid; }
.r-kop { display: flex; gap: 2.5mm; align-items: baseline; flex-wrap: wrap; } .r-dat { margin-left: auto; font-size: 8.5pt; } .r-gv { font-size: 9pt; font-weight: 700; } .thema { font-size: 8.5pt; color: #333; }
.feit { font-size: 8.3pt; color: #333; } .refl p { margin: .6mm 0; } .refl p b { font-size: 9pt; }
.reactie { background: #eee; border-radius: 1.5mm; padding: .8mm 2mm; }
.leeg { font-style: italic; color: #444; } h3 { font-size: 11pt; margin: 4mm 0 2mm; border-bottom: .3mm solid #000; }
.slot { break-inside: avoid; margin-top: 4mm; } .lijn { border-bottom: .3mm solid #666; height: 7.5mm; }
.handtekening { display: flex; justify-content: space-between; font-size: 9pt; margin-top: 3mm; }
.knoppen { position: sticky; top: 0; z-index: 2; text-align: center; padding: 3mm; background: #0F5257; color: #fff; font: 10pt Verdana, Arial, sans-serif; } .knoppen button { font: 700 12pt Verdana, Arial, sans-serif; padding: 2mm 6mm; border-radius: 99px; border: none; background: #E8772E; color: #fff; cursor: pointer; } .knoppen p { margin: 2mm 0 0; }
</style></head><body><div class="knoppen"><button onclick="print()">🖨 Afdrukken (of bewaren als PDF)</button><p>${lijst.length} ${lijst.length === 1 ? 'leerling' : 'leerlingen'} · elke leerling begint op een nieuw blad · papier A4, schaal 100 %, koptekst en voettekst uit.</p></div>${paginas}</body></html>`;
}
function drukTerugblik(lijst, opties) {
  const w = window.open('', '_blank');
  if (!w) { alert('Je browser blokkeerde het afdrukvenster. Sta pop-ups toe voor deze site.'); return; }
  w.document.write(terugblikHTML(lijst, opties)); w.document.close();
}
