'use strict';
/* ======================= FRANS & ENGELS ======================= */

/* ---------- Bouwstenen ---------- */
let laatsteVeld = null;
document.addEventListener('focusin', e => { if (e.target.matches?.('input.tekst, textarea.tekst')) laatsteVeld = e.target; });
function accentBalk() {
  return U.el('div', { class: 'accenten' }, U.el('span', {}, 'Tekens:'), [...'éèêëàâçîïôùûœ'].map(ch => U.el('button', {
    type: 'button', onmousedown: e => e.preventDefault(), onclick: () => {
      const v = laatsteVeld; if (!v || v.readOnly) return;
      const s = v.selectionStart ?? v.value.length, e = v.selectionEnd ?? s;
      v.value = v.value.slice(0, s) + ch + v.value.slice(e); v.focus(); v.setSelectionRange(s + 1, s + 1); v.dispatchEvent(new Event('input'));
    }
  }, ch)));
}

function rijMC(vraag, opties, juist, { taal, spreek } = {}) {
  let gekozen = -1, vast = false;
  const el = U.el('div', { class: 'trij' });
  const knoppen = opties.map((o, k) => U.el('button', {
    class: 'optie', type: 'button', onclick: () => {
      if (vast) return; gekozen = k; knoppen.forEach((b, j) => b.classList.toggle('gekozen', j === k)); el.classList.remove('goed', 'fout');
      if (spreek) Spraak.spreek(o, taal);
    }
  }, o));
  el.append(U.el('div', { class: 'trij-v' }, vraag), U.el('div', { class: 'opties' }, knoppen));
  return {
    el, status: () => gekozen < 0 ? null : gekozen === juist,
    hint() { gekozen = juist; vast = true; knoppen.forEach((b, j) => { b.classList.toggle('gekozen', j === juist); b.disabled = j !== juist; }); knoppen[juist].classList.add('hint'); },
  };
}
function rijVelden(vraag, velden, { strikt, lidwoordVrij } = {}) {
  const el = U.el('div', { class: 'trij' });
  const inputs = velden.map(v => { const i = U.tekst('tekst', v.label || ''); i.addEventListener('input', () => { U.mark(i, ''); el.classList.remove('goed', 'fout'); }); return i; });
  const juistVeld = (i, juist) => U.vergelijk(i.value, juist, strikt) || (lidwoordVrij && U.vergelijk(U.zonderLidwoord(i.value), String(juist).split('/').map(U.zonderLidwoord).join('/'), strikt));
  el.append(U.el('div', { class: 'trij-v' }, vraag), U.el('div', { class: 'velden' }, inputs.map((i, k) => U.el('label', {}, velden[k].label ? U.el('small', {}, velden[k].label) : null, i))));
  return {
    el,
    status() { if (inputs.some(i => !i.value.trim())) return inputs.every(i => !i.value.trim()) ? null : false; return inputs.every((i, k) => juistVeld(i, velden[k].juist)); },
    markeer() { inputs.forEach((i, k) => { if (i.value.trim() && !i.readOnly) U.mark(i, juistVeld(i, velden[k].juist) ? 'goed' : 'fout'); }); },
    hint() { const k = inputs.findIndex((i, k) => !juistVeld(i, velden[k].juist)); if (k < 0) return; inputs[k].value = U.eersteVorm(velden[k].juist); inputs[k].readOnly = true; U.mark(inputs[k], 'hint'); },
  };
}
function rijenSpel(rijen) {
  return {
    controleer() {
      let fout = 0, leeg = 0;
      for (const r of rijen) {
        const s = r.status(); r.markeer?.();
        r.el.classList.toggle('goed', s === true); r.el.classList.toggle('fout', s === false);
        if (s === null) leeg++; else if (!s) fout++;
      }
      return U.uitslag(fout, leeg, ['antwoord is fout', 'antwoorden zijn fout', 'vraag', 'vragen']);
    },
    hint() {
      const r = U.pick(rijen.filter(r => r.status() !== true));
      if (!r) return 'Alles is juist. Klik op Controleer!';
      r.hint(); r.el.classList.remove('fout'); return 'Eén antwoord is voor je ingevuld (paars).';
    }
  };
}
const afleiders = (juist, pool, aantal = 3) => {
  const j = U.norm(juist), uit = [];
  for (const x of U.shuffle(pool)) { if (uit.length >= aantal) break; if (U.norm(x) !== j && !uit.some(y => U.norm(y) === U.norm(x))) uit.push(x); }
  return uit;
};
const mcOpties = (juist, pool) => { const opties = U.shuffle([juist, ...afleiders(juist, pool)]); return { opties, juist: opties.indexOf(juist) }; };

/* ---------- Woordhulp: klik op een woord voor de vertaling ---------- */
const nrmW = x => String(x).toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, ' ').trim();
const LIDW = /^(le |la |les |l'|un |une |des |the |a |an |to )/i;
/* "woordenboekvorm ; Nederlands ; vorm(en) in de tekst" */
function leesWoordenlijst(tekst) {
  return String(tekst || '').split(/\r?\n/).map(r => r.split(/\s*;\s*/).map(x => x.trim())).filter(d => d[0] && d[1])
    .map(([vr, nl, vormen]) => ({ vr, nl, vormen: (vormen ? vormen.split(/\s*,\s*/) : [vr.replace(LIDW, '')]).map(v => nrmW(v).replace(/[?!.]+$/, '').trim()).filter(Boolean) }));
}
function tekstHulp(t) {
  const b = (typeof TEKSTHULP !== 'undefined' && TEKSTHULP[t.id]) || {};
  const woorden = leesWoordenlijst(t.woordenlijst ?? b.woorden ?? '');
  const vert = String(t.vertaling ?? b.vertaling ?? '').split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  const index = new Map();
  for (const w of woorden) for (const v of w.vormen) if (!index.has(v)) index.set(v, w);
  const maxN = Math.max(1, ...[...index.keys()].map(k => k.split(' ').length));
  return { woorden, vert, index, maxN };
}
let woordPopup = null;
function toonWoordhulp(doel, vorm, w, taal) {
  woordPopup?.remove();
  Spraak.spreek(vorm, taal);
  const r = doel.getBoundingClientRect();
  woordPopup = U.el('div', { class: 'woordhulp', style: `left:${Math.max(8, Math.min(window.innerWidth - 300, r.left + window.scrollX))}px; top:${r.bottom + window.scrollY + 6}px` },
    U.el('div', {}, U.el('b', {}, vorm), nrmW(w.vr) !== nrmW(vorm) ? U.el('span', { class: 'stil' }, ` → ${w.vr}`) : null),
    U.el('div', { class: 'nl' }, w.nl),
    U.el('button', { class: 'luister', type: 'button', title: 'Luister', onclick: e => { e.stopPropagation(); Spraak.spreek(w.vr, taal); } }, '🔊'));
  document.body.append(woordPopup);
}
document.addEventListener('click', e => { if (woordPopup && !e.target.closest('.woordhulp, .gl')) { woordPopup.remove(); woordPopup = null; } });
/* een zin in stukjes: woorden uit de woordenlijst worden klikbaar (ook uitdrukkingen van meerdere woorden) */
function zinMetHulp(z, hulp, taal) {
  const d = z.split(/([\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*)/u), uit = [];
  const span = (tekst, w) => U.el('span', { class: 'gl', onclick: e => { e.stopPropagation(); toonWoordhulp(e.currentTarget, tekst, w, taal); } }, tekst);
  for (let p = 0; p < d.length; p++) {
    if (p % 2 === 0) { if (d[p]) uit.push(d[p]); continue; }
    let gevonden = false;
    for (let n = hulp.maxN; n >= 1 && !gevonden; n--) {
      const eind = p + 2 * (n - 1); if (eind >= d.length) continue;
      let ok = true; const ws = [];
      for (let q = p; q <= eind; q += 2) { ws.push(d[q]); if (q < eind && !/^\s+$/.test(d[q + 1])) { ok = false; break; } }
      if (!ok) continue;
      const w = hulp.index.get(nrmW(ws.join(' ')));
      if (w) { uit.push(span(d.slice(p, eind + 1).join(''), w)); p = eind; gevonden = true; }
    }
    if (gevonden) continue;
    const k = d[p].search(/['’]/);
    const w2 = k > 0 ? hulp.index.get(nrmW(d[p].slice(k + 1))) : null;
    if (w2) uit.push(d[p].slice(0, k + 1), span(d[p].slice(k + 1), w2)); else uit.push(d[p]);
  }
  return uit;
}

/* Tekst met voorleesknoppen en markering van de zin die voorgelezen wordt.
   hulp = woordhulp (klikbare woorden); vertaling = knop om de Nederlandse vertaling te tonen */
function tekstBlok(tekst, taal, { verborgen = false, hulp = null, vertaling = false } = {}) {
  const paragrafen = tekst.split('\n').map(p => splitsZinnen(p));
  const alle = paragrafen.flat();
  const perZin = hulp && hulp.vert.length === alle.length;
  let k = 0;
  const spans = [];
  const box = U.el('div', { class: 'leestekst' + (verborgen ? ' verborgen' : '') + (hulp && !verborgen ? ' met-hulp' : '') }, paragrafen.map(p => U.el('p', {}, p.map(z => {
    const nl = perZin ? hulp.vert[k] : null; k++;
    const s = U.el('span', { class: 'zin', title: 'Klik om deze zin te beluisteren', onclick: () => { stop(); Spraak.spreek(z, taal); } }, ...(hulp ? zinMetHulp(z, hulp, taal) : [z]), ' ');
    spans.push(s);
    return nl ? [s, U.el('span', { class: 'nl-zin' }, nl)] : s;
  }).flat())));
  const vrijeVertaling = hulp && hulp.vert.length && !perZin ? U.el('div', { class: 'vrije-vertaling' }, hulp.vert.map(x => U.el('p', {}, x))) : null;
  let stopper = null, traag = false;
  const stop = () => { stopper?.(); stopper = null; speel.textContent = verborgen ? '▶ Beluister de tekst' : '▶ Lees voor'; };
  const speel = U.el('button', { class: 'knop klein', type: 'button', onclick: () => {
    if (stopper) return stop();
    speel.textContent = '⏹ Stop';
    stopper = Spraak.leesReeks(alle, taal, { traag, onZin: k => spans.forEach((s, j) => s.classList.toggle('nu', j === k)), onKlaar: () => stop() });
  } }, verborgen ? '▶ Beluister de tekst' : '▶ Lees voor');
  const tr = U.el('button', { class: 'knop klein tweede', type: 'button', onclick: () => { traag = !traag; tr.classList.toggle('aan', traag); } }, '🐢 Traag');
  const vk = vertaling && hulp?.vert.length ? U.el('button', { class: 'knop klein tweede', type: 'button', onclick: () => { const aan = box.classList.toggle('met-vertaling'); vrijeVertaling?.classList.toggle('aan', aan); vk.textContent = aan ? '🙈 Verberg de vertaling' : '🇳🇱 Toon de vertaling'; } }, '🇳🇱 Toon de vertaling') : null;
  const bediening = U.el('div', { class: 'knoppenrij' }, speel, tr, vk, Spraak.ok ? null : U.el('span', { class: 'stil' }, 'Voorlezen werkt niet in deze browser.'));
  return { el: U.el('div', {}, bediening, hulp && hulp.woorden.length && !verborgen ? U.el('p', { class: 'stil hulp-tip' }, '💡 Klik op een onderstreept woord: je hoort het en je ziet wat het betekent.') : null, box, vrijeVertaling), stop };
}
/* naar de woordenlijst van een tekst (bij Woordenschat) */
function naarWoordenVanTekst(taal, t) {
  if (typeof toonStart !== 'function' || typeof opslag === 'undefined') return null;
  if (tekstHulp(t).woorden.length < 4) return null;
  return U.el('button', { class: 'knop tweede', type: 'button', onclick: () => { opslag.set(`kk_bron_${taal}-woorden`, 'tw-' + t.id); toonStart(SPELLEN.find(s => s.id === `${taal}-woorden`)); } }, '📚 Oefen eerst de woorden van deze tekst');
}

function opnamePaneel() {
  const wrap = U.el('div', { class: 'opname' }, U.el('div', { class: 'label' }, '🎙 Lees zelf voor'));
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') { wrap.append(U.el('p', { class: 'stil' }, 'Opnemen kan niet in deze browser.')); return wrap; }
  let rec = null, stukken = [];
  const audio = U.el('audio', { controls: true, style: 'display:none' });
  const knop = U.el('button', { class: 'knop klein', type: 'button', onclick: async () => {
    if (rec) { rec.stop(); return; }
    try {
      const stroom = await navigator.mediaDevices.getUserMedia({ audio: true });
      rec = new MediaRecorder(stroom); stukken = [];
      rec.ondataavailable = e => stukken.push(e.data);
      rec.onstop = () => { stroom.getTracks().forEach(t => t.stop()); audio.src = URL.createObjectURL(new Blob(stukken, { type: rec.mimeType })); audio.style.display = ''; rec = null; knop.textContent = '🎙 Opnieuw opnemen'; };
      rec.start(); knop.textContent = '⏹ Stop opname';
    } catch { wrap.append(U.el('p', { class: 'stil' }, 'De microfoon mag niet gebruikt worden. Kijk de instellingen van je browser na.')); }
  } }, '🎙 Start opname');
  wrap.append(U.el('p', { class: 'stil' }, 'Neem jezelf op terwijl je de tekst voorleest. Luister daarna en vergelijk met de voorleesstem.'), U.el('div', { class: 'knoppenrij' }, knop), audio);
  return wrap;
}

/* ---------- Woordenschat ---------- */
function woordenschatSpel(taal) {
  const vak = taal === 'fr' ? 'frans' : 'engels', T = taal === 'fr' ? 'Frans' : 'Engels';
  return {
    id: `${taal}-woorden`, naam: 'Woordenschat', vak, icoon: '📚', bron: `${taal}-woorden`, perThema: true, taal,
    kort: `Leer en oefen ${T}e woordjes per thema.`,
    uitleg: `Brons: kies de betekenis. Zilver: kies het ${T}e woord. Goud: typ het ${T}e woord. Platinum: luister en typ. Diamant: typ alles foutloos, met lidwoord en accenten.`,
    leerKnop: '📖 Leren en oefenen',
    leer(doos, ctx) {
      const L = ctx.bron.woorden.filter(w => w[0] && w[1]);
      const paneel = U.el('div');
      let stopper = null;
      const tekst = ctx.bron.tekstId ? bronVan(`${taal}-teksten`, ctx.bron.tekstId) : null;
      const naarTekst = tekst && typeof toonLeer === 'function' ? U.el('button', { class: 'knop tweede klein', type: 'button', onclick: () => toonLeer(SPELLEN.find(s => s.id === `${taal}-teksten`), tekst) }, `📖 Lees de tekst "${tekst.titel}"`) : null;
      /* 1. woordenlijst met uitspraak; Frans/Engels of Nederlands verbergen om jezelf te testen */
      const lijst = () => {
        const rijen = L.map(([nl, vr]) => U.el('tr', {},
          U.el('td', { class: 'wl-vr', onclick: e => e.currentTarget.classList.toggle('toon') }, U.el('b', {}, vr.replace(/\//g, ' / ')), ' ', Spraak.knoppen(U.eersteVorm(vr), taal)),
          U.el('td', { class: 'wl-nl', onclick: e => e.currentTarget.classList.toggle('toon') }, nl)));
        const tabel = U.el('table', { class: 'lijst woordenlijst' }, U.el('tr', {}, U.el('th', {}, T), U.el('th', {}, 'Nederlands')), rijen);
        const knop = (t, cls) => U.el('button', { class: 'knop klein tweede', type: 'button', onclick: e => { const aan = tabel.classList.toggle(cls); tabel.querySelectorAll('.toon').forEach(x => x.classList.remove('toon')); e.currentTarget.classList.toggle('aan', aan); } }, t);
        return U.el('div', {}, U.el('p', { class: 'opdracht' }, `Lees elk woord, luister naar de uitspraak (🔊, 🐢 = traag) en zeg het na. Test jezelf: verberg een kolom en klik op een vakje om te spieken.`),
          U.el('div', { class: 'knoppenrij' }, U.el('button', { class: 'knop klein', type: 'button', onclick: () => { stopper?.(); stopper = Spraak.leesReeks(L.map(w => U.eersteVorm(w[1])), taal, { onZin: k => rijen.forEach((x, j) => x.classList.toggle('nu', j === k)) }); } }, '▶ Lees alles voor'),
            knop(`🙈 Verberg het ${T}`, 'zonder-vr'), knop('🙈 Verberg het Nederlands', 'zonder-nl')), U.el('div', { class: 'tabelwrap' }, tabel));
      };
      /* 2. woordkaarten */
      const kaarten = () => {
        const ks = L.map(([nl, vr]) => { const k = U.el('button', { class: 'flashkaart', type: 'button', onclick: () => { k.classList.toggle('om'); if (k.classList.contains('om')) Spraak.spreek(U.eersteVorm(vr), taal); } }, U.el('span', { class: 'voor' }, nl), U.el('span', { class: 'achter' }, vr.replace(/\//g, ' / '))); return k; });
        const raster = U.el('div', { class: 'flashraster' }, ks);
        return U.el('div', {}, U.el('p', { class: 'opdracht' }, `Kijk naar het Nederlandse woord. Weet je het ${T}e woord? Klik op de kaart om het te zien en te horen.`),
          U.el('div', { class: 'knoppenrij' }, U.el('button', { class: 'knop klein tweede', type: 'button', onclick: () => ks.forEach(k => k.classList.add('om')) }, 'Toon alles'), U.el('button', { class: 'knop klein tweede', type: 'button', onclick: () => ks.forEach(k => k.classList.remove('om')) }, 'Verberg alles'), U.el('button', { class: 'knop klein tweede', type: 'button', onclick: () => raster.replaceChildren(...U.shuffle(ks)) }, '🔀 Hussel')), raster);
      };
      /* 3. memory: zoek telkens het woord en zijn vertaling */
      const memory = () => {
        const wrap = U.el('div'), info = U.el('div', { class: 'mem-info' });
        const nieuw = () => {
          const paren = U.shuffle(L).slice(0, Math.min(8, L.length));
          const kaartjes = U.shuffle(paren.flatMap((w, i) => [{ i, t: U.eersteVorm(w[1]), vr: true }, { i, t: w[0] }]));
          let open = [], beurten = 0, gevonden = 0, wacht = false;
          const knoppen = kaartjes.map(c => {
            const b = U.el('button', { class: 'mem-kaart' + (c.vr ? ' vr' : ''), type: 'button', onclick: () => {
              if (wacht || b.classList.contains('open') || b.classList.contains('weg')) return;
              b.classList.add('open'); b.textContent = c.t; if (c.vr) Spraak.spreek(c.t, taal);
              open.push([b, c]);
              if (open.length < 2) return;
              beurten++;
              const [[b1, c1], [b2, c2]] = open; open = [];
              if (c1.i === c2.i && c1.vr !== c2.vr) { b1.classList.add('weg'); b2.classList.add('weg'); gevonden++; }
              else { wacht = true; setTimeout(() => { [b1, b2].forEach(x => { x.classList.remove('open'); x.textContent = '?'; }); wacht = false; }, 1100); }
              info.textContent = gevonden === paren.length ? `🎉 Alle paren gevonden in ${beurten} beurten! Lukt het de volgende keer in minder?` : `Beurten: ${beurten} · gevonden: ${gevonden} van ${paren.length}`;
            } }, '?');
            return b;
          });
          info.textContent = `Zoek telkens het ${T}e woord en zijn vertaling. ${paren.length} paren.`;
          wrap.replaceChildren(U.el('div', { class: 'mem-raster' }, knoppen));
        };
        nieuw();
        return U.el('div', {}, info, wrap, U.el('div', { class: 'knoppenrij' }, U.el('button', { class: 'knop klein tweede', type: 'button', onclick: nieuw }, '🔀 Nieuw spel')));
      };
      const tabs = [['📋 Woordenlijst', lijst], ['🃏 Kaarten', kaarten], ['🧠 Memory', memory]];
      const tabEl = U.el('div', { class: 'solo-tabs' }, tabs.map(([t, f], k) => U.el('button', { type: 'button', class: k ? '' : 'aan', onclick: e => { stopper?.(); Spraak.stop(); tabEl.querySelectorAll('button').forEach(b => b.classList.toggle('aan', b === e.currentTarget)); paneel.replaceChildren(f()); } }, t)));
      paneel.append(lijst());
      doos.append(naarTekst ? U.el('div', { class: 'knoppenrij' }, naarTekst) : null, tabEl, paneel);
      return { stop() { stopper?.(); Spraak.stop(); } };
    },
    maak(n, doos, ctx) {
      const L = ctx.bron.woorden.filter(w => w[0] && w[1]);
      const items = U.shuffle(L).slice(0, Math.min(10, L.length));
      const pool = L.length >= 6 ? L : [...L, ...INGEBOUWD[`${taal}-woorden`].flatMap(b => b.woorden)];
      if (n >= 3 && taal === 'fr') doos.append(accentBalk());
      if (n === 5) doos.append(U.el('p', { class: 'opdracht' }, taal === 'fr' ? 'Diamant: typ het woord mét lidwoord (le, la, l\', les) en met de juiste accenten.' : 'Diamant: typ elk woord foutloos.'));
      const rijen = items.map(([nl, vr]) => {
        const vrE = U.eersteVorm(vr);
        if (n === 1) { const m = mcOpties(nl, pool.map(w => w[0])); return rijMC([U.el('b', {}, vrE), Spraak.knoppen(vrE, taal)], m.opties, m.juist); }
        if (n === 2) { const m = mcOpties(vrE, pool.map(w => U.eersteVorm(w[1]))); return rijMC(U.el('b', {}, nl), m.opties, m.juist, { taal, spreek: true }); }
        if (n === 3) return rijVelden(U.el('b', {}, nl), [{ juist: vr }], { lidwoordVrij: true });
        if (n === 4) return rijVelden([Spraak.knoppen(vrE, taal), U.el('span', { class: 'stil' }, 'Luister en typ')], [{ juist: vr }], { lidwoordVrij: true });
        return rijVelden(U.el('b', {}, nl), [{ juist: vr }], { strikt: true });
      });
      doos.append(U.el('div', { class: 'trijen' }, rijen.map(r => r.el)));
      return rijenSpel(rijen);
    }
  };
}

/* ---------- Werkwoorden ---------- */
const FR_VNW = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];
const frVnw = (k, vorm) => k === 0 ? (/^[aeiouéèêëàâîïôûœh]/i.test(vorm) ? "j'" : 'je') : k === 2 ? U.pick(['il', 'elle']) : k === 5 ? U.pick(['ils', 'elles']) : FR_VNW[k];
const hoofd = s => s.charAt(0).toUpperCase() + s.slice(1);
const metVnw = (v, rest) => v === "j'" ? `j'${rest}` : `${v} ${rest}`;

const FR_WW = {
  id: 'fr-werkwoorden', naam: 'Werkwoorden', vak: 'frans', icoon: '🔤', bron: 'fr-ww', perThema: true, taal: 'fr',
  kort: 'Vervoeg Franse werkwoorden in de présent.',
  uitleg: 'Brons: kies de juiste vorm. Zilver: vervoeg één werkwoord helemaal. Goud: gemengde vormen. Platinum: in een zin. Diamant: het werkwoord staat in het Nederlands en accenten tellen mee!',
  leer(doos, ctx) {
    doos.append(U.el('p', { class: 'opdracht' }, 'Klik op een vorm om ze te horen. Leer de vervoeging uit het hoofd.'),
      U.el('div', { class: 'ww-raster' }, ctx.bron.ww.map(w => U.el('div', { class: 'ww-kaart' },
        U.el('div', { class: 'ww-kop' }, U.el('b', {}, w.inf), ` · ${w.nl}`, Spraak.knoppen(w.vormen.map((v, k) => metVnw(frVnw(k, v).replace(/^(il|elle)$/, 'il').replace(/^(ils|elles)$/, 'ils'), v)).join(', '), 'fr')),
        U.el('table', {}, w.vormen.map((v, k) => { const z = metVnw(k === 0 ? frVnw(0, v) : FR_VNW[k], v); return U.el('tr', { onclick: () => Spraak.spreek(z.replace('/elle', '').replace('/elles', ''), 'fr') }, U.el('td', {}, k === 0 ? frVnw(0, v) : FR_VNW[k]), U.el('td', {}, U.el('b', {}, v))); }))))));
  },
  maak(n, doos, ctx) {
    const ww = ctx.bron.ww.filter(w => w.vormen?.length === 6);
    if (n >= 2) doos.append(accentBalk());
    let rijen = [];
    if (n === 2) {
      const w = U.pick(ww);
      doos.append(U.el('p', { class: 'opdracht' }, `Vervoeg: `, U.el('b', {}, w.inf), ` (${w.nl})`));
      rijen = w.vormen.map((v, k) => rijVelden(U.el('span', { class: 'vnw' }, k === 0 ? frVnw(0, v) : FR_VNW[k]), [{ juist: v }]));
    } else {
      const paren = U.shuffle(ww.flatMap(w => w.vormen.map((v, k) => ({ w, k, v })))).slice(0, 8);
      rijen = paren.map(({ w, k, v }) => {
        const vnw = frVnw(k, v);
        if (n === 1) {
          const pool = [...new Set([...w.vormen, ...ww.flatMap(x => x.vormen)])];
          const opties = U.shuffle([v, ...afleiders(v, w.vormen.length >= 4 ? [...new Set(w.vormen)] : pool)].slice(0, 4));
          return rijMC([U.el('span', { class: 'vnw' }, vnw), ' ___ ', U.el('small', {}, `(${w.inf})`)], opties, opties.indexOf(v));
        }
        if (n === 3 || !w.zin) return rijVelden([U.el('span', { class: 'vnw' }, vnw), ' … ', U.el('small', {}, `(${n === 5 ? U.eersteVorm(w.nl) : w.inf})`)], [{ juist: v }], { strikt: n === 5 });
        const begin = vnw === "j'" ? "J'" : hoofd(vnw) + ' ';
        return rijVelden([U.el('span', {}, begin), U.el('span', { class: 'gat' }, '…'), U.el('small', {}, ` (${n === 5 ? U.eersteVorm(w.nl) : w.inf}) `), U.el('span', {}, `${w.zin}.`)], [{ juist: v }], { strikt: n === 5 });
      });
    }
    doos.append(U.el('div', { class: 'trijen' }, rijen.map(r => r.el)));
    return rijenSpel(rijen);
  }
};

const EN_WW = {
  id: 'en-werkwoorden', naam: 'Irregular verbs', vak: 'engels', icoon: '🔤', bron: 'en-ww', perThema: true, taal: 'en',
  kort: 'De onregelmatige werkwoorden van het Engels.',
  uitleg: 'Brons: kies de past simple. Zilver: typ de past simple. Goud: past simple én past participle. Platinum: vanuit het Nederlands alle drie de vormen. Diamant: alleen luisteren en alle drie de vormen foutloos typen.',
  leer(doos, ctx) {
    doos.append(U.el('p', { class: 'opdracht' }, 'Klik op een rij om de drie vormen te horen.'),
      U.el('div', { class: 'tabelwrap' }, U.el('table', { class: 'lijst ww-tabel' },
        U.el('tr', {}, ['Infinitive', 'Past simple', 'Past participle', 'Betekenis'].map(h => U.el('th', {}, h))),
        ctx.bron.ww.map(w => U.el('tr', { class: 'klik', onclick: () => Spraak.spreek(`${w.inf}, ${U.eersteVorm(w.past)}, ${U.eersteVorm(w.pp)}`, 'en', { traag: true }) },
          U.el('td', {}, U.el('b', {}, w.inf)), U.el('td', {}, w.past), U.el('td', {}, w.pp), U.el('td', {}, w.nl))))));
  },
  maak(n, doos, ctx) {
    const ww = ctx.bron.ww, items = U.shuffle(ww).slice(0, 8);
    const rijen = items.map(w => {
      if (n === 1) {
        const j = U.eersteVorm(w.past);
        const fout = [w.inf.endsWith('e') ? w.inf + 'd' : w.inf + 'ed', ...ww.map(x => U.eersteVorm(x.past))];
        const opties = U.shuffle([j, ...afleiders(j, fout)].slice(0, 4));
        return rijMC([U.el('b', {}, w.inf), U.el('small', {}, ` (${w.nl}) → past simple?`)], opties, opties.indexOf(j));
      }
      if (n === 2) return rijVelden([U.el('b', {}, w.inf), U.el('small', {}, ` (${w.nl})`)], [{ label: 'past simple', juist: w.past }]);
      if (n === 3) return rijVelden([U.el('b', {}, w.inf), U.el('small', {}, ` (${w.nl})`)], [{ label: 'past simple', juist: w.past }, { label: 'past participle', juist: w.pp }]);
      const velden = [{ label: 'infinitive', juist: w.inf }, { label: 'past simple', juist: w.past }, { label: 'past participle', juist: w.pp }];
      if (n === 4) return rijVelden(U.el('b', {}, w.nl), velden);
      return rijVelden(Spraak.knoppen(w.inf, 'en'), velden, { strikt: true });
    });
    doos.append(U.el('div', { class: 'trijen' }, rijen.map(r => r.el)));
    return rijenSpel(rijen);
  }
};

/* ---------- Teksten ---------- */
function tekstSpel(taal) {
  const vak = taal === 'fr' ? 'frans' : 'engels', T = taal === 'fr' ? 'Franse' : 'Engelse';
  return {
    id: `${taal}-teksten`, naam: 'Lezen en luisteren', vak, icoon: '📖', bron: `${taal}-teksten`, perThema: true, taal,
    kort: `Lees, beluister en begrijp ${T} teksten.`,
    uitleg: 'Brons: lees en beluister de tekst en beantwoord de vragen. Klik op een onderstreept woord om de betekenis te zien. Zilver: vul de ontbrekende woorden in met de woordbank. Goud: je hoort de tekst alleen (je ziet hem niet) en beantwoordt de vragen. Platinum: vul de gaten in zonder woordbank. Diamant: dictee! Luister en schrijf de zinnen foutloos.',
    leer(doos, ctx) {
      const tb = tekstBlok(ctx.bron.tekst, taal, { hulp: tekstHulp(ctx.bron), vertaling: true });
      const knop = naarWoordenVanTekst(taal, ctx.bron);
      doos.append(U.el('h2', {}, ctx.bron.titel), U.el('p', { class: 'opdracht' }, 'Klik op een zin om ze te horen, of laat de hele tekst voorlezen. Lees eerst zelf. De vertaling gebruik je om te controleren of je het goed begrepen hebt.'), knop ? U.el('div', { class: 'knoppenrij' }, knop) : null, tb.el, opnamePaneel());
      return { stop: tb.stop };
    },
    maak(n, doos, ctx) {
      const t = ctx.bron;
      let modus = n;
      if (!t.vragen?.length && (n === 1 || n === 3)) modus = n + 1;
      doos.append(U.el('h2', {}, t.titel));
      if (modus === 1 || modus === 3) {
        const tb = tekstBlok(t.tekst, taal, { verborgen: modus === 3, hulp: modus === 1 ? tekstHulp(t) : null });
        doos.append(tb.el);
        const rijen = t.vragen.map((v, k) => { const opties = U.shuffle(v.opties.map((o, j) => ({ o, j }))); return rijMC(`${k + 1}. ${v.v}`, opties.map(x => x.o), opties.findIndex(x => x.j === v.juist)); });
        doos.append(U.el('div', { class: 'label' }, 'Vragen'), U.el('div', { class: 'trijen' }, rijen.map(r => r.el)));
        return { ...rijenSpel(rijen), stop: tb.stop };
      }
      if (modus === 2 || modus === 4) {
        if (taal === 'fr') doos.append(accentBalk());
        const tb = tekstBlok(t.tekst, taal, { verborgen: true });
        doos.append(U.el('p', { class: 'opdracht' }, 'Je mag de tekst beluisteren. Vul daarna de gaten in.'), tb.el);
        const stukken = t.tekst.split(/([A-Za-zÀ-ÖØ-öø-ÿœŒ]+)/);
        const kand = [];
        stukken.forEach((s, k) => { if (k % 2 === 1 && s.length >= 4 && s[0] === s[0].toLowerCase()) kand.push(k); });
        const gekozen = new Set(U.shuffle(kand).slice(0, Math.min(8, kand.length)));
        const gaten = [];
        const box = U.el('div', { class: 'leestekst gatentekst' });
        let p = U.el('p'); box.append(p);
        stukken.forEach((s, k) => {
          if (gekozen.has(k)) { const i = U.el('input', { class: 'tekst gat-in', style: `width:${Math.max(4, s.length + 1)}ch`, autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off' }); gaten.push({ i, w: s }); p.append(i); }
          else s.split('\n').forEach((d, j) => { if (j) { p = U.el('p'); box.append(p); } if (d) p.append(d); });
        });
        const bank = U.el('div', { class: 'woordbank' });
        const bankSpans = U.shuffle(gaten.map(g => g.w)).map(w => U.el('span', { 'data-w': w.toLowerCase() }, w));
        const herBank = () => { const typed = gaten.map(g => g.i.value.trim().toLowerCase()); bankSpans.forEach(s => { const k = typed.indexOf(s.dataset.w); s.classList.toggle('op', k >= 0); if (k >= 0) typed[k] = null; }); };
        gaten.forEach(g => g.i.addEventListener('input', () => { U.mark(g.i, ''); herBank(); }));
        if (modus === 2) bank.append(...bankSpans);
        doos.append(modus === 2 ? U.el('div', {}, U.el('div', { class: 'label' }, 'Woordbank'), bank) : null, box);
        const rijen = gaten.map(g => ({ el: g.i, status: () => !g.i.value.trim() ? null : U.vergelijk(g.i.value, g.w, false), hint() { g.i.value = g.w; g.i.readOnly = true; U.mark(g.i, 'hint'); herBank(); } }));
        return { ...rijenSpel(rijen), stop: tb.stop };
      }
      /* Diamant: dictee */
      if (taal === 'fr') doos.append(accentBalk());
      const zinnen = splitsZinnen(t.tekst.replace(/\n/g, ' ')).filter(z => z.length >= 20 && z.length <= 120);
      const start = U.r(0, Math.max(0, zinnen.length - 3));
      const keuze = (zinnen.length ? zinnen : splitsZinnen(t.tekst)).slice(start, start + 3);
      doos.append(U.el('p', { class: 'opdracht' }, 'Luister naar elke zin en schrijf hem foutloos op. Hoofdletters en leestekens tellen niet mee, accenten wel.'));
      const rijen = keuze.map((z, k) => {
        const i = U.el('textarea', { class: 'tekst', rows: 2, spellcheck: 'false', autocapitalize: 'off' });
        const el = U.el('div', { class: 'trij' }, U.el('div', { class: 'trij-v' }, `Zin ${k + 1} `, Spraak.knoppen(z, taal)), i);
        const juist = () => U.normZin(i.value, true) === U.normZin(z, true);
        i.addEventListener('input', () => { U.mark(i, ''); el.classList.remove('goed', 'fout'); });
        return {
          el, status: () => !i.value.trim() ? null : juist(),
          markeer() { if (i.value.trim()) U.mark(i, juist() ? 'goed' : 'fout'); },
          hint() {
            const goedW = U.normZin(z, true).split(' '), echteW = z.replace(/[.,!?;:"«»“”()\-–—]/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
            const typ = U.normZin(i.value, true).split(' ').filter(Boolean);
            let m = 0; while (m < typ.length && typ[m] === goedW[m]) m++;
            i.value = echteW.slice(0, m + 1).join(' '); U.mark(i, 'hint');
          }
        };
      });
      doos.append(U.el('div', { class: 'trijen' }, rijen.map(r => r.el)));
      return rijenSpel(rijen);
    }
  };
}

SPELLEN.push(tekstSpel('fr'), woordenschatSpel('fr'), FR_WW, tekstSpel('en'), woordenschatSpel('en'), EN_WW);
/* Woordenschat: ook de woorden van elke tekst bij Lezen en luisteren */
for (const taal of ['fr', 'en']) BRON_AFGELEID[`${taal}-woorden`] = () => bronnen(`${taal}-teksten`).map(t => ({ t, h: tekstHulp(t) })).filter(x => x.h.woorden.length >= 4)
  .map(({ t, h }) => ({ id: 'tw-' + t.id, naam: `📖 Woorden uit de tekst: ${t.titel}`, tekstId: t.id, woorden: h.woorden.map(w => [w.nl, w.vr]) }));
