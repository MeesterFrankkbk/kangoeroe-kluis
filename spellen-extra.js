'use strict';
/* ======================= EXTRA: rebus, droedels, codekraker (taal) · robot, doolhof, kakuro, bruggen (logica) ======================= */

/* ---------------- Rebus ---------------- */
const RB = (a, ...p) => ({ a, p });
const REBUSSEN = {
  1: [RB('VOETBAL', ['🦶', 'voet'], '+', ['⚽', 'bal']), RB('APPELBOOM', ['🍎', 'appel'], '+', ['🌳', 'boom']), RB('HANDSCHOEN', ['✋', 'hand'], '+', ['👞', 'schoen']),
    RB('KOEMELK', ['🐄', 'koe'], '+', ['🥛', 'melk']), RB('VUURTOREN', ['🔥', 'vuur'], '+', ['🗼', 'toren']), RB('VOGELHUIS', ['🐦', 'vogel'], '+', ['🏠', 'huis']),
    RB('REGENBOOG', ['🌧️', 'regen'], '+', ['🏹', 'boog']), RB('DEURBEL', ['🚪', 'deur'], '+', ['🔔', 'bel']), RB('IJSBEER', ['🧊', 'ijs'], '+', ['🐻', 'beer']),
    RB('ZEEPAARD', ['🌊', 'zee'], '+', ['🐴', 'paard']), RB('SNEEUWMAN', ['❄️', 'sneeuw'], '+', ['👨', 'man']), RB('BOOMHUT', ['🌳', 'boom'], '+', ['🛖', 'hut']),
    RB('OORBEL', ['👂', 'oor'], '+', ['🔔', 'bel']), RB('HANDTAS', ['✋', 'hand'], '+', ['👜', 'tas']), RB('HAMERHAAI', ['🔨', 'hamer'], '+', ['🦈', 'haai']),
    RB('ZEESTER', ['🌊', 'zee'], '+', ['⭐', 'ster']), RB('ZEEHOND', ['🌊', 'zee'], '+', ['🐶', 'hond']), RB('BEDLAMP', ['🛏️', 'bed'], '+', ['💡', 'lamp']),
    RB('KERKTOREN', ['⛪', 'kerk'], '+', ['🗼', 'toren']), RB('TANDPASTA', ['🦷', 'tand'], '+', ['🍝', 'pasta']), RB('BALPEN', ['⚽', 'bal'], '+', ['🖊️', 'pen'])],
  2: [RB('ZONNEBRIL', ['☀️', 'zon'], '+ NE +', ['👓', 'bril']), RB('SLAKKENHUIS', ['🐌', 'slak'], '+ KEN +', ['🏠', 'huis']), RB('KOEKOEK', ['🐄', 'koe'], '+ K +', ['🐄', 'koe'], '+ K'),
    RB('KONINGSKROON', ['🤴', 'koning'], '+ S +', ['👑', 'kroon']), RB('ZONNEBLOEM', ['☀️', 'zon'], '+ NE +', ['🌸', 'bloem']), RB('PANNENKOEK', ['🍳', 'pan'], '+ NEN +', ['🍪', 'koek']),
    RB('KIKKERVISJE', ['🐸', 'kikker'], '+', ['🐟', 'vis'], '+ JE'), RB('VLINDERDAS', ['🦋', 'vlinder'], '+', ['🦡', 'das']), RB('KATER', ['🐱', 'kat'], '+ ER'),
    RB('VISSER', ['🐟', 'vis'], '+ SER'), RB('SPINNENWEB', ['🕷️', 'spin'], '+ NEN +', ['🕸️', 'web']), RB('MAANDAG', ['🌙', 'maan'], '+ DAG'), RB('STERREN', ['⭐', 'ster'], '+ REN')],
  3: [RB('HUIS', ['🐭', 'muis'], 'M → H'), RB('MOND', ['🐶', 'hond'], 'H → M'), RB('PEER', ['🐻', 'beer'], 'B → P'), RB('KAM', ['🐱', 'kat'], 'T → M'),
    RB('BEL', ['⚽', 'bal'], 'A → E'), RB('MAAND', ['🌙', 'maan'], '+ D'), RB('ROOK', ['🌹', 'roos'], 'S → K'), RB('ROOM', ['🌳', 'boom'], 'B → R'),
    RB('HAND', ['🦷', 'tand'], 'T → H'), RB('GOED', ['🎩', 'hoed'], 'H → G'), RB('ZOET', ['🦶', 'voet'], 'V → Z'), RB('HOOG', 'H +', ['👁️', 'oog']),
    RB('REIS', 'R +', ['🥚', 'ei'], '+ S'), RB('KAAS', ['🕯️', 'kaars'], '− R'), RB('LANG', ['🐍', 'slang'], '− S'), RB('PAAR', ['🐴', 'paard'], '− D'),
    RB('MUUR', ['🔥', 'vuur'], 'V → M'), RB('AARDAPPEL', ['🌍', 'aarde'], '− E +', ['🍎', 'appel'])],
  4: [RB('KAMPVUUR', ['🐱', 'kat'], 'T → M', '+ P +', ['🔥', 'vuur']), RB('ROOMIJS', ['🌳', 'boom'], 'B → R', '+', ['🧊', 'ijs']), RB('HANDBAL', ['🦷', 'tand'], 'T → H', '+', ['⚽', 'bal']),
    RB('MUURBLOEM', ['🔥', 'vuur'], 'V → M', '+', ['🌸', 'bloem']), RB('PEERBOOM', ['🐻', 'beer'], 'B → P', '+', ['🌳', 'boom']), RB('BELHAMER', ['⚽', 'bal'], 'A → E', '+', ['🔨', 'hamer']),
    RB('ROOKWOLK', ['🌹', 'roos'], 'S → K', '+', ['☁️', 'wolk']), RB('ZOETWATER', ['🦶', 'voet'], 'V → Z', '+', ['💧', 'water']), RB('HUISKAT', ['🐭', 'muis'], 'M → H', '+', ['🐱', 'kat']),
    RB('KAASBOER', ['🕯️', 'kaars'], '− R +', ['🐻', 'beer'], 'E → O'), RB('HOOGTE', 'H +', ['👁️', 'oog'], '+ TE')],
  5: [RB('De kat uit de boom kijken', 'De', ['🐱', 'kat'], 'uit de', ['🌳', 'boom'], 'kijken'), RB('Als een olifant in de porseleinkast', 'Als een', ['🐘', 'olifant'], 'in de porseleinkast'),
    RB('Twee vliegen in een klap slaan', 'Twee', ['🪰', 'vliegen'], 'in een klap slaan'), RB('Met de deur in huis vallen', 'Met de', ['🚪', 'deur'], 'in', ['🏠', 'huis'], 'vallen'),
    RB('Het ei van Columbus', 'Het', ['🥚', 'ei'], 'van Columbus'), RB('Zich voelen als een vis in het water', 'Zich voelen als een', ['🐟', 'vis'], 'in het', ['💧', 'water']),
    RB('Een kat in de zak kopen', 'Een', ['🐱', 'kat'], 'in de zak kopen'), RB('De beer is los', 'De', ['🐻', 'beer'], 'is los'),
    RB('Van een mug een olifant maken', 'Van een', ['🦟', 'mug'], 'een', ['🐘', 'olifant'], 'maken'), RB('Het paard achter de wagen spannen', 'Het', ['🐴', 'paard'], 'achter de wagen spannen'),
    RB('Door de zure appel heen bijten', 'Door de zure', ['🍎', 'appel'], 'heen bijten'), RB('Er zit een adder onder het gras', 'Er zit een', ['🐍', 'adder'], 'onder het gras'),
    RB('Zo trots als een pauw', 'Zo trots als een', ['🦚', 'pauw']), RB('Leven als hond en kat', 'Leven als', ['🐶', 'hond'], 'en', ['🐱', 'kat']),
    RB('Ergens geen brood in zien', 'Ergens geen', ['🍞', 'brood'], 'in zien'), RB('Het ijs breken', 'Het', ['🧊', 'ijs'], 'breken'),
    RB('Water naar de zee dragen', ['💧', 'water'], 'naar de', ['🌊', 'zee'], 'dragen'), RB('Iemand een hart onder de riem steken', 'Iemand een', ['❤️', 'hart'], 'onder de riem steken'),
    RB('De koe bij de hoorns vatten', 'De', ['🐄', 'koe'], 'bij de hoorns vatten'), RB('In de wolken zijn', 'In de', ['☁️', 'wolken'], 'zijn'),
    RB('Iets uit je duim zuigen', 'Iets uit je', ['👍', 'duim'], 'zuigen')],
};
SPELLEN.push({
  id: 'rebus', naam: 'Rebus', vak: 'taal', icoon: '🧠', kort: 'Puzzel woorden en uitdrukkingen uit prentjes.',
  uitleg: 'Elk prentje staat voor een woord. Plak de woorden aan elkaar en voer de letterbewerkingen uit (− R betekent: haal de R weg; M → H betekent: vervang de M door een H). Op diamant ontdek je een uitdrukking en kies je daarna de juiste betekenis.',
  maak(n, doos, ctx) {
    const pool = U.shuffle(REBUSSEN[n]).slice(0, n === 5 ? 3 : 4);
    const rijen = pool.map(rb => {
      const namen = [], velden = [];
      const tokens = rb.p.map(t => {
        if (typeof t === 'string') return U.el('span', { class: n === 5 ? 'rb-woord' : 'rb-op' }, t);
        const naam = U.el('small', { class: 'rb-naam' }, '');
        namen.push({ naam, w: t[1] });
        if (n === 5) { const i = U.tekst('tekst rb-in', '…'); i.style.width = `${Math.max(5, t[1].length + 2)}ch`; velden.push({ i, w: t[1] }); return U.el('span', { class: 'rb-pic' }, U.el('span', { class: 'rb-emoji' }, t[0]), i); }
        return U.el('span', { class: 'rb-pic' }, U.el('span', { class: 'rb-emoji' }, t[0]), naam);
      });
      const el = U.el('div', { class: 'trij rebus' }, U.el('div', { class: 'rb-zin' }, tokens));
      let antw = null, mc = null;
      if (n < 5) { antw = U.tekst('tekst', 'Oplossing'); antw.addEventListener('input', () => { U.mark(antw, ''); el.classList.remove('goed', 'fout'); }); el.append(antw); }
      else {
        const b = betekenisVan(ctx, schoonZin(rb.a));
        if (b) { const pool2 = [...new Set(alleZinItems(ctx).filter(x => x.b && x.b !== b).map(x => x.b))]; const opties = U.shuffle([b, ...U.shuffle(pool2).slice(0, 3)]); mc = rijMC('Wat betekent deze uitdrukking?', opties, opties.indexOf(b)); el.append(mc.el); }
      }
      let hints = 0;
      const woordOk = v => U.groot(v.i.value) === U.groot(v.w);
      return {
        el,
        status() {
          if (n < 5) return antw.value.trim() ? U.groot(antw.value) === rb.a : null;
          if (velden.every(v => !v.i.value.trim()) && (!mc || mc.status() === null)) return null;
          return velden.every(woordOk) && (!mc || mc.status() === true);
        },
        markeer() { if (n === 5) velden.forEach(v => v.i.value.trim() && U.mark(v.i, woordOk(v) ? 'goed' : 'fout')); else if (antw.value.trim()) U.mark(antw, U.groot(antw.value) === rb.a ? 'goed' : 'fout'); },
        hint() {
          hints++;
          const open = namen.find(x => !x.naam.textContent && n < 5);
          if (open && hints <= namen.length) { open.naam.textContent = open.w; return; }
          if (n < 5) { antw.value = rb.a; antw.readOnly = true; U.mark(antw, 'hint'); return; }
          const v = velden.find(v => !woordOk(v)); if (v) { v.i.value = v.w; v.i.readOnly = true; U.mark(v.i, 'hint'); return; }
          mc?.hint();
        }
      };
    });
    doos.append(U.el('div', { class: 'trijen' }, rijen.map(r => r.el)));
    const spel = rijenSpel(rijen);
    return { ...spel, hint() { const r = U.pick(rijen.filter(r => r.status() !== true)); if (!r) return 'Alles is juist!'; r.hint(); r.el.classList.remove('fout'); return 'Een hulpje: onder een prentje staat nu wat het voorstelt, of een antwoord is ingevuld.'; } };
  }
});

/* ---------------- Droedels ---------------- */
const svgD = inhoud => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${inhoud}</svg>`;
const DROEDELS = [
  ['Een zwarte kat in een donkere kelder', svgD(`<rect width="200" height="200" fill="#151515"/><ellipse cx="78" cy="96" rx="15" ry="8" fill="#F5D000"/><ellipse cx="122" cy="96" rx="15" ry="8" fill="#F5D000"/><rect x="76" y="88" width="4" height="16" fill="#151515"/><rect x="120" y="88" width="4" height="16" fill="#151515"/>`)],
  ['Een ijsbeer in een sneeuwstorm', svgD(`<rect width="200" height="200" fill="#fff"/>${[[20, 30], [60, 15], [150, 40], [180, 90], [30, 150], [90, 170], [160, 160], [120, 20], [10, 90], [170, 130]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#CFD8DC"/>`).join('')}<circle cx="88" cy="96" r="4"/><circle cx="112" cy="96" r="4"/><ellipse cx="100" cy="112" rx="6" ry="4"/>`)],
  ['Een giraf die voorbij het raam loopt', svgD(`<rect width="200" height="200" fill="#DDEFFF"/><rect x="78" y="0" width="44" height="200" fill="#E8B04A"/>${[[90, 20], [108, 55], [86, 92], [110, 128], [92, 165]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#9A5B1E"/>`).join('')}<rect x="6" y="6" width="188" height="188" fill="none" stroke="#7A4E2D" stroke-width="12"/><line x1="100" y1="6" x2="100" y2="194" stroke="#7A4E2D" stroke-width="8"/><line x1="6" y1="100" x2="194" y2="100" stroke="#7A4E2D" stroke-width="8"/>`)],
  ['Een hond die achter een muur wandelt', svgD(`<rect width="200" height="200" fill="#EAF6FF"/><polygon points="30,112 42,80 54,112" fill="#8D6E63"/><polygon points="58,112 70,80 82,112" fill="#8D6E63"/><path d="M150 112 Q160 70 182 74" stroke="#8D6E63" stroke-width="9" fill="none" stroke-linecap="round"/><rect x="0" y="110" width="200" height="90" fill="#B5533C"/>${[130, 155, 180].map(y => `<line x1="0" y1="${y}" x2="200" y2="${y}" stroke="#E7C9BF" stroke-width="3"/>`).join('')}${[[40, 110, 130], [100, 110, 130], [160, 110, 130], [70, 130, 155], [130, 130, 155], [40, 155, 180], [100, 155, 180], [160, 155, 180]].map(([x, a, b]) => `<line x1="${x}" y1="${a}" x2="${x}" y2="${b}" stroke="#E7C9BF" stroke-width="3"/>`).join('')}`)],
  ['Een spook dat zich achter een boom verstopt', svgD(`<rect width="200" height="200" fill="#26324A"/><path d="M85 60 Q50 70 55 110 Q48 130 62 150 L85 150 Z" fill="#fff"/><path d="M115 60 Q150 70 145 110 Q152 130 138 150 L115 150 Z" fill="#fff"/><circle cx="132" cy="90" r="5" fill="#26324A"/><rect x="85" y="0" width="30" height="200" fill="#6D4C41"/>`)],
  ['Een slak die als eerste over de finish komt', svgD(`<rect width="200" height="200" fill="#F1F8E9"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => `<rect x="${150 + (k % 2) * 10}" y="${k * 20}" width="10" height="20" fill="#222"/>`).join('')}<path d="M40 150 L170 150" stroke="#A1887F" stroke-width="10" stroke-linecap="round"/><path d="M118 140 m-28 0 a28 28 0 1 1 56 0 a20 20 0 1 1 -40 0 a12 12 0 1 1 24 0 a5 5 0 1 1 -10 0" fill="none" stroke="#795548" stroke-width="5"/><line x1="160" y1="150" x2="175" y2="128" stroke="#795548" stroke-width="4"/>`)],
  ['Twee wormen die elkaar ontmoeten in een appel', svgD(`<circle cx="100" cy="105" r="85" fill="#D32F2F"/><circle cx="100" cy="105" r="74" fill="#FFF3C4"/><path d="M28 100 Q55 80 92 102" stroke="#C8A97E" stroke-width="10" fill="none"/><path d="M172 112 Q140 130 108 104" stroke="#C8A97E" stroke-width="10" fill="none"/><circle cx="93" cy="103" r="6" fill="#F48FB1"/><circle cx="107" cy="103" r="6" fill="#F48FB1"/><rect x="96" y="12" width="7" height="22" fill="#5D4037"/>`)],
  ['Een ridder die door het vizier van zijn helm gluurt', svgD(`<rect width="200" height="200" fill="#ECEFF1"/><path d="M40 190 L40 80 Q40 20 100 20 Q160 20 160 80 L160 190 Z" fill="#90A4AE" stroke="#546E7A" stroke-width="5"/><rect x="50" y="88" width="100" height="18" rx="6" fill="#263238"/><circle cx="82" cy="97" r="6" fill="#fff"/><circle cx="118" cy="97" r="6" fill="#fff"/><circle cx="84" cy="97" r="3"/><circle cx="120" cy="97" r="3"/>`)],
  ['Een mier die een sliert spaghetti opslurpt', svgD(`<rect width="200" height="200" fill="#fff"/><path d="M0 60 Q40 20 70 70 T140 90 T150 150" stroke="#F2C94C" stroke-width="5" fill="none"/><circle cx="152" cy="156" r="4"/><circle cx="158" cy="162" r="3"/><line x1="148" y1="158" x2="142" y2="164" stroke="#000"/><line x1="156" y1="160" x2="152" y2="168" stroke="#000"/><line x1="160" y1="158" x2="166" y2="156" stroke="#000"/>`)],
  ['Een vis die onderaan het aquarium bellen blaast', svgD(`<rect width="200" height="200" fill="#B3E5FC"/>${[[100, 170, 5], [96, 140, 7], [104, 108, 9], [98, 72, 12], [102, 32, 15]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="3"/>`).join('')}<ellipse cx="100" cy="196" rx="14" ry="9" fill="#FB8C00"/><ellipse cx="100" cy="196" rx="6" ry="4" fill="#E65100"/>`)],
  ['Een zebra die door de brievenbus gluurt', svgD(`<rect width="200" height="200" fill="#8D6E63"/><rect x="40" y="85" width="120" height="30" rx="4" fill="#CFD8DC" stroke="#78909C" stroke-width="4"/><rect x="48" y="92" width="104" height="16" fill="#fff"/>${[52, 66, 80, 120, 134].map(x => `<rect x="${x}" y="92" width="7" height="16" fill="#111"/>`).join('')}<circle cx="100" cy="100" r="6" fill="#111"/><circle cx="102" cy="98" r="2" fill="#fff"/>`)],
  ['Een egel die net een ballon heeft geknuffeld', svgD(`<rect width="200" height="200" fill="#FFFDE7"/><path d="M40 180 Q100 90 160 180 Z" fill="#6D4C41"/>${Array.from({ length: 11 }, (_, k) => { const a = Math.PI * (k + 0.5) / 11; const x = 100 - Math.cos(a) * 62, y = 180 - Math.sin(a) * 62; return `<line x1="${100 - Math.cos(a) * 45}" y1="${180 - Math.sin(a) * 45}" x2="${x}" y2="${y}" stroke="#4E342E" stroke-width="4"/>`; }).join('')}<path d="M70 50 l10 6 -4 10z" fill="#E53935"/><path d="M130 40 l8 10 -10 2z" fill="#E53935"/><path d="M100 30 l6 -8 6 10z" fill="#E53935"/><text x="100" y="105" font-size="26" text-anchor="middle" font-weight="bold" fill="#E53935">PANG!</text>`)],
  ['Een rups die door een tunnel kruipt', svgD(`<rect width="200" height="200" fill="#E8F5E9"/>${[20, 38].map(x => `<circle cx="${x}" cy="150" r="10" fill="#7CB342"/>`).join('')}${[162, 180].map(x => `<circle cx="${x}" cy="150" r="10" fill="#7CB342"/>`).join('')}<circle cx="188" cy="146" r="3"/><path d="M50 162 L50 110 Q100 60 150 110 L150 162 Z" fill="#9E9E9E"/><path d="M68 162 L68 118 Q100 88 132 118 L132 162 Z" fill="#424242"/>`)],
  ['Een vogel die door een wolk vliegt', svgD(`<rect width="200" height="200" fill="#90CAF9"/><polygon points="22,100 46,92 46,108" fill="#FB8C00"/><polygon points="160,92 188,78 182,100 188,122 160,108" fill="#5D4037"/><g fill="#fff"><circle cx="70" cy="100" r="30"/><circle cx="105" cy="85" r="35"/><circle cx="140" cy="102" r="28"/><rect x="60" y="100" width="90" height="28" rx="14"/></g>`)],
  ['Een pinguïn die uit een gat in het ijs kijkt', svgD(`<rect width="200" height="200" fill="#E1F5FE"/><ellipse cx="100" cy="110" rx="50" ry="26" fill="#0D47A1"/><ellipse cx="100" cy="110" rx="26" ry="18" fill="#111"/><circle cx="92" cy="104" r="5" fill="#fff"/><circle cx="108" cy="104" r="5" fill="#fff"/><circle cx="93" cy="104" r="2"/><circle cx="107" cy="104" r="2"/><polygon points="94,112 106,112 100,121" fill="#FB8C00"/>`)],
  ['Een hoge hoed, van bovenaf gezien', svgD(`<rect width="200" height="200" fill="#fff"/><circle cx="100" cy="100" r="80" fill="#222"/><circle cx="100" cy="100" r="44" fill="#333" stroke="#000" stroke-width="3"/><circle cx="100" cy="100" r="50" fill="none" stroke="#B71C1C" stroke-width="6"/>`)],
];
const DROEDEL_LOK = ['Een olifant die in de spiegel kijkt', 'Een kaars die smelt in de zon', 'Een draak die zijn verjaardagskaarsjes uitblaast', 'Een astronaut die op de maan springt', 'Een spin die aan het plafond hangt', 'Een tandenborstel op vakantie'];
SPELLEN.push({
  id: 'droedels', naam: 'Droedels', vak: 'taal', icoon: '🖍️', kort: 'Wat stelt die rare tekening voor?',
  uitleg: 'Een droedel is een eenvoudige tekening met een grappige uitleg. Kies bij elke droedel de juiste titel. Op platinum en diamant koppel je titels aan tekeningen. Bij "Eerst leren" kun je zelf een droedel tekenen!',
  leer(doos) {
    const c = U.el('canvas', { width: 400, height: 400, class: 'droedel-doek' });
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 400, 400); g.lineCap = 'round'; g.lineJoin = 'round';
    let kleur = '#222', dikte = 5, tekenen = false;
    const pos = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * 400 / r.width, (e.clientY - r.top) * 400 / r.height]; };
    c.addEventListener('pointerdown', e => { tekenen = true; c.setPointerCapture(e.pointerId); const [x, y] = pos(e); g.beginPath(); g.moveTo(x, y); });
    c.addEventListener('pointermove', e => { if (!tekenen) return; const [x, y] = pos(e); g.strokeStyle = kleur; g.lineWidth = dikte; g.lineTo(x, y); g.stroke(); });
    c.addEventListener('pointerup', () => tekenen = false);
    const titel = U.tekst('tekst', 'Titel van jouw droedel');
    const kleuren = ['#222', '#E53935', '#1E88E5', '#43A047', '#FB8C00', '#8E24AA', '#fff'];
    doos.append(U.el('p', { class: 'opdracht' }, 'Teken je eigen droedel: hou het eenvoudig en verzin er een grappige titel bij. Laat je klasgenoten raden!'),
      U.el('div', { class: 'knoppenrij' }, kleuren.map(k => U.el('button', { class: 'kleurknop', style: `background:${k}`, title: k === '#fff' ? 'gom' : 'kleur', onclick: () => { kleur = k; dikte = k === '#fff' ? 24 : 5; } })),
        U.el('button', { class: 'knop klein tweede', onclick: () => { g.fillStyle = '#fff'; g.fillRect(0, 0, 400, 400); } }, '🗑 Wis'),
        U.el('button', { class: 'knop klein', onclick: () => { const out = document.createElement('canvas'); out.width = 400; out.height = 460; const o = out.getContext('2d'); o.fillStyle = '#fff'; o.fillRect(0, 0, 400, 460); o.drawImage(c, 0, 0); o.fillStyle = '#222'; o.font = 'bold 18px sans-serif'; o.textAlign = 'center'; o.fillText(titel.value || 'Mijn droedel', 200, 440); const a = U.el('a', { href: out.toDataURL('image/png'), download: 'mijn-droedel.png' }); document.body.append(a); a.click(); a.remove(); } }, '⬇ Bewaar als prent')),
      c, titel);
  },
  maak(n, doos) {
    const aantal = [0, 3, 4, 5, 6, 8][n];
    const keuze = U.shuffle(DROEDELS).slice(0, aantal);
    if (n <= 3) {
      const rijen = keuze.map(([t, svg]) => {
        const opties = U.shuffle([t, ...U.shuffle([...DROEDELS.map(d => d[0]), ...DROEDEL_LOK].filter(x => x !== t)).slice(0, n + 1)]);
        const r = rijMC(U.el('div', { class: 'droedel', html: svg }), opties, opties.indexOf(t));
        r.el.classList.add('droedel-rij'); return r;
      });
      doos.append(U.el('div', { class: 'droedel-raster' }, rijen.map(r => r.el)));
      return rijenSpel(rijen);
    }
    const titels = U.shuffle([...keuze.map(d => d[0]), ...(n === 5 ? U.shuffle(DROEDEL_LOK).slice(0, 2) : [])]);
    const rijen = keuze.map(([t, svg]) => {
      const sel = U.el('select', { class: 'droedel-sel' }, U.el('option', { value: '' }, '— kies de titel —'), titels.map(x => U.el('option', { value: x }, x)));
      const el = U.el('div', { class: 'trij droedel-rij' }, U.el('div', { class: 'droedel', html: svg }), sel);
      sel.addEventListener('change', () => el.classList.remove('goed', 'fout'));
      return { el, status: () => !sel.value ? null : sel.value === t, hint() { sel.value = t; sel.disabled = true; sel.classList.add('hint'); } };
    });
    doos.append(U.el('p', { class: 'opdracht' }, n === 5 ? 'Koppel elke droedel aan de juiste titel. Let op: er zijn twee titels te veel!' : 'Koppel elke droedel aan de juiste titel.'), U.el('div', { class: 'droedel-raster' }, rijen.map(r => r.el)));
    return rijenSpel(rijen);
  }
});

/* ---------------- Letterdroedels (woorden uitgebeeld met de plaats van letters) ---------------- */
const LD = (() => {
  const lc = s => String(s).toLowerCase();
  const deel = x => (typeof x === 'string' ? LD.t(x) : x);
  const STER = '<svg class="ld-ster" viewBox="0 0 100 100"><polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38" fill="none" stroke="currentColor" stroke-width="7" stroke-linejoin="round"/></svg>';
  const GETAL = { 1: 'één', 2: 'twee', 3: 'drie', 4: 'vier', 8: 'acht', 10: 'tien', 11: 'elf' };
  const LD = {
    t: s => ({ h: `<span class="ld-t">${s}</span>`, l: lc(s), w: s.length * .72 }),
    n: g => ({ h: `<span class="ld-t">${g}</span>`, l: GETAL[g], w: String(g).length * .7 }),
    ster: () => ({ h: STER, l: 'ster', w: 1.1 }),
    en: () => ({ h: '<span class="ld-teken">+</span>', l: 'en', w: .7 }),
    is: () => ({ h: '<span class="ld-teken">=</span>', l: 'is', w: .7 }),
    /* x in y: grote holle letter(s) y met x erin */
    in: (x, y) => { x = deel(x); const g = y.length === 1 ? 'g1' : y.length <= 3 ? 'g2' : 'g3'; return { h: `<span class="ld-in ${g}"><span class="ld-buiten">${y}</span><span class="ld-binnen"><span>${x.h}</span></span></span>`, l: `${x.l} in ${lc(y)}`, w: y.length * (g === 'g1' ? 2 : g === 'g2' ? 1.5 : 1.15) }; },
    /* x op y: kleine x staat bovenop y */
    op: (x, y) => ({ h: `<span class="ld-op"><span class="ld-klein">${x}</span><span>${y}</span></span>`, l: `${lc(x)} op ${lc(y)}`, w: y.length * .72 }),
    /* x onder y: y boven de streep, x eronder */
    onder: (x, y) => ({ h: `<span class="ld-breuk"><span>${y}</span><span>${x}</span></span>`, l: `${lc(x)} onder ${lc(y)}`, w: Math.max(x.length, y.length) * .72 }),
    /* x na y: geschreven als y/x */
    na: (x, y) => ({ h: `<span class="ld-na">${y}<i>/</i>${x}</span>`, l: `${lc(x)} na ${lc(y)}`, w: (x.length + y.length) * .72 + .6 }),
    /* x om y: x staat in een kring rond y */
    om: (x, y) => {
      y = deel(y); const b = y.w + 2.2, hgt = Math.max(3.4, b * .45), k = Math.max(6, Math.round(b * 2.1));
      const rond = Array.from({ length: k }, (_, i) => { const a = 2 * Math.PI * i / k - Math.PI / 2; return `<span class="ld-rond" style="left:${50 + 46 * Math.cos(a)}%;top:${50 + 44 * Math.sin(a)}%">${x}</span>`; }).join('');
      return { h: `<span class="ld-om" style="width:${b}em;height:${hgt}em">${rond}<span class="ld-midden">${y.h}</span></span>`, l: `${lc(x)} om ${y.l}`, w: b };
    },
    /* x uit y: y in een doos, x springt eruit */
    uit: (x, y) => ({ h: `<span class="ld-uit"><span class="ld-doos">${y}</span><span class="ld-eruit">${x}</span></span>`, l: `${lc(x)} uit ${lc(y)}`, w: y.length * .72 + 1.5 }),
  };
  return LD;
})();
const L_ = LD;
const LDR = (woord, ...delen) => ({ w: woord, d: delen.map(d => typeof d === 'string' ? LD.t(d) : typeof d === 'number' ? LD.n(d) : d) });
const LETTERDROEDELS = {
  1: [LDR('kind', L_.in('K', 'D')), LDR('lint', L_.in('L', 'T')), LDR('vink', L_.in('V', 'K')), LDR('prins', L_.in('PR', 'S')),
    LDR('kopen', L_.op('K', 'EN')), LDR('hopen', L_.op('H', 'EN')), LDR('bomen', L_.om('B', 'EN')), LDR('zomer', L_.om('Z', 'ER')),
    LDR('pracht', 'PR', 8), LDR('zacht', 'Z', 8), LDR('steen', 'ST', 1), LDR('teen', 'T', 1), LDR('been', 'B', 1), LDR('sterk', L_.ster(), 'K'),
    LDR('tent', 'T', L_.en(), 'T'), LDR('denk', 'D', L_.en(), 'K'), LDR('wens', 'W', L_.en(), 'S'), LDR('kist', 'K', L_.is(), 'T'), LDR('mist', 'M', L_.is(), 'T'),
    LDR('tiener', 10, 'ER'), LDR('driehoek', 3, 'HOEK'), LDR('vierkant', 4, 'KANT')],
  2: [LDR('dinsdag', L_.in('D', 'S'), 'DAG'), LDR('kinderen', L_.in('K', 'DEREN')), LDR('koper', L_.op('K', 'ER')), LDR('zingen', L_.in('Z', 'G'), 'EN'), LDR('vinger', L_.in('V', 'GER')),
    LDR('roman', L_.om('R', 'AN')), LDR('komeet', L_.om('K', 'EET')), LDR('tomaat', L_.om('T', 'AAT')), LDR('kanaal', L_.na('KA', 'AL')), LDR('ananas', L_.na('A', 'NAS')),
    LDR('helft', 'H', 11, 'T'), LDR('eenhoorn', 1, 'HOORN'), LDR('achtbaan', 8, 'BAAN'), LDR('achtste', 8, 'STE'), LDR('venster', 'VEN', L_.ster()), LDR('gisteren', 'GI', L_.ster(), 'EN'),
    LDR('meester', 'MEE', L_.ster()), LDR('zuster', 'ZU', L_.ster()), LDR('knopen', L_.op('KN', 'EN')), LDR('stomen', L_.om('ST', 'EN')), LDR('trommel', L_.om('TR', 'MEL')),
    LDR('nachtegaal', 'N', 8, 'EGAAL'), LDR('wachten', 'W', 8, 'EN'), LDR('hengel', 'H', L_.en(), 'GEL'), LDR('zender', 'Z', L_.en(), 'DER'), LDR('donderdag', L_.onder('D', 'DAG')),
    LDR('sluiten', L_.uit('SL', 'EN')), LDR('fluiten', L_.uit('FL', 'EN')), LDR('lintworm', L_.in('L', 'T'), 'WORM')],
  3: [LDR('winkel', L_.in('W', 'K'), 'EL'), LDR('prinses', L_.in('PR', 'S'), 'ES'), LDR('spinnen', L_.in('SP', 'N'), 'EN'), LDR('springen', L_.in('SPR', 'G'), 'EN'), LDR('tomaten', L_.om('T', 'AAT'), 'EN'),
    LDR('banaal', L_.na('BA', 'AL')), LDR('spruitjes', L_.uit('SPR', 'JES')), LDR('kinderwagen', L_.in('K', 'DER'), 'WAGEN'), LDR('wintersport', L_.in('W', 'TER'), 'SPORT'), LDR('zomerkamp', L_.om('Z', 'ER'), 'KAMP'),
    LDR('steenbok', 'ST', 1, 'BOK'), LDR('tweewieler', 2, 'WIELER'), LDR('driewieler', 3, 'WIELER'), LDR('tienkamp', 10, 'KAMP'), LDR('verwachten', 'VERW', 8, 'EN'),
    LDR('meesterwerk', 'MEE', L_.ster(), 'WERK'), LDR('schoppen', L_.op('SCH', 'PEN')), LDR('lachten', 'L', 8, 'EN'), LDR('achtentachtig', 8, L_.en(), 8, 'TIG'), LDR('winkelwagen', L_.in('W', 'K'), 'EL', 'WAGEN')],
  4: [LDR('komkommer', L_.om('K', L_.om('K', 'MER'))), LDR('sinterklaas', L_.in('S', 'TER'), 'KLAAS'), LDR('winterster', L_.in('W', 'TER'), L_.ster()), LDR('dinosaurus', L_.in('D', 'O'), 'SAURUS'),
    LDR('slingeren', L_.in('SL', 'GER'), 'EN'), LDR('bewonderen', L_.onder('BEW', 'EN')), LDR('verwonderen', L_.onder('VERW', 'EN')), LDR('springtouw', L_.in('SPR', 'G'), 'TOUW'),
    LDR('vingerafdruk', L_.in('V', 'GER'), 'AFDRUK'), LDR('tweelingzus', 2, L_.in('L', 'G'), 'ZUS'), LDR('stomerij', L_.om('ST', 'ER'), 'IJ'), LDR('spinnenweb', L_.in('SP', 'N'), 'EN', 'WEB'),
    LDR('tomatensoep', L_.om('T', 'AAT'), 'EN', 'SOEP'), LDR('donderdagavond', L_.onder('D', 'DAG'), 'AVOND')],
  5: [LDR('prinsengracht', L_.in('PR', 'S'), L_.en(), 'GR', 8), LDR('sterrenwacht', L_.ster(), 'R', L_.en(), 'W', 8), LDR('sterrenkind', L_.ster(), 'R', L_.en(), L_.in('K', 'D')),
    LDR('verwachtingen', 'VERW', L_.in(L_.n(8), 'GEN')), LDR('komkommersoep', L_.om('K', L_.om('K', 'MER')), 'SOEP'), LDR('eendrachtig', 1, 'D', 'R', 8, 'IG'),
    LDR('tweelingbroer', 2, L_.in('L', 'G'), 'BROER'), LDR('kinderboerderij', L_.in('K', 'DER'), 'BOERDERIJ'), LDR('wintersterren', L_.in('W', 'TER'), L_.ster(), 'R', 'EN'),
    LDR('dinsdagavond', L_.in('D', 'S'), 'DAG', 'AVOND'), LDR('prinsenhof', L_.in('PR', 'S'), L_.en(), 'HOF')],
};
const ldBeeld = d => U.el('div', { class: 'ld-beeld', html: d.d.map(x => x.h).join('') });
const ldLees = d => d.d.map(x => x.l).join(' · ');
SPELLEN.push({
  id: 'letterdroedels', naam: 'Letterdroedels', vak: 'taal', icoon: '🔠', kort: 'Woorden uitgebeeld met letters: K in D = kind.',
  uitleg: 'Een letterdroedel beeldt een woord uit met letters, cijfers en tekens. Kijk goed WAAR de letters staan: in, op, onder, om, na, uit … Lees alles hardop en je hoort het woord. Bij "Eerst leren" zie je alle trucjes.',
  leer(doos) {
    const vb = [
      ['in', LDR('kind', L_.in('K', 'D')), 'Kleine letters IN een grote letter.'],
      ['op', LDR('kopen', L_.op('K', 'EN')), 'Letters bovenOP andere letters.'],
      ['onder', LDR('donderdag', L_.onder('D', 'DAG')), 'Letters ONDER de streep.'],
      ['om', LDR('bomen', L_.om('B', 'EN')), 'Letters in een kring OM andere letters.'],
      ['na', LDR('kanaal', L_.na('KA', 'AL')), 'AL/KA: KA komt NA AL.'],
      ['uit', LDR('sluiten', L_.uit('SL', 'EN')), 'Letters springen UIT de doos.'],
      ['cijfers', LDR('wachten', 'W', 8, 'EN'), 'Een cijfer lees je als woord: 8 = acht, 1 = één.'],
      ['tekens', LDR('meester', 'MEE', L_.ster()), '★ = ster, + = en, = is.'],
    ];
    doos.append(U.el('p', { class: 'opdracht' }, 'Zo lees je letterdroedels. Lees elk stukje hardop en plak alles aan elkaar.'),
      U.el('div', { class: 'ld-leer' }, vb.map(([k, d, t]) => U.el('div', { class: 'ld-vb' }, ldBeeld(d), U.el('div', {}, U.el('b', {}, k), U.el('p', {}, t), U.el('p', { class: 'stil' }, `${ldLees(d)} → `, U.el('b', {}, d.w)))))),
      U.el('p', { class: 'stil' }, 'Zelf maken? Probeer er een paar op papier en laat ze oplossen door iemand uit je groep.'));
  },
  maak(n, doos) {
    const pool = U.shuffle(LETTERDROEDELS[n]).slice(0, n === 5 ? 3 : 4);
    const rijen = pool.map(d => {
      const antw = U.tekst('tekst', 'Welk woord?');
      const lees = U.el('small', { class: 'ld-lees' }, '');
      const el = U.el('div', { class: 'trij ld-rij' }, ldBeeld(d), U.el('div', { class: 'ld-antw' }, antw, lees));
      antw.addEventListener('input', () => { U.mark(antw, ''); el.classList.remove('goed', 'fout'); });
      let hints = 0;
      const ok = () => U.norm(antw.value) === U.norm(d.w);
      return {
        el,
        status() { if (!antw.value.trim()) return null; const r = ok(); if (r) lees.textContent = `${ldLees(d)} → ${d.w}`; return r; },
        markeer() { if (antw.value.trim() && !antw.readOnly) U.mark(antw, ok() ? 'goed' : 'fout'); },
        hint() { hints++; if (hints === 1) { lees.textContent = ldLees(d); return; } antw.value = d.w; antw.readOnly = true; U.mark(antw, 'hint'); lees.textContent = `${ldLees(d)} → ${d.w}`; },
      };
    });
    doos.append(U.el('div', { class: 'trijen' }, rijen.map(r => r.el)));
    const spel = rijenSpel(rijen);
    return { ...spel, hint() { const r = U.pick(rijen.filter(r => r.status() !== true)); if (!r) return 'Alles is juist!'; r.hint(); r.el.classList.remove('fout'); return 'Een hulpje: onder een droedel staat nu hoe je hem leest (of het antwoord).'; } };
  }
});

/* ---------------- Codekraker ---------------- */
const MORSE = { A: '·−', B: '−···', C: '−·−·', D: '−··', E: '·', F: '··−·', G: '−−·', H: '····', I: '··', J: '·−−−', K: '−·−', L: '·−··', M: '−−', N: '−·', O: '−−−', P: '·−−·', Q: '−−·−', R: '·−·', S: '···', T: '−', U: '··−', V: '···−', W: '·−−', X: '−··−', Y: '−·−−', Z: '−−··' };
function varkenshok(l) {
  const i = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(l); if (i < 0) return '';
  let lijnen = '', punt = false;
  if (i < 18) {
    const k = i % 9, r = Math.floor(k / 3), c = k % 3; punt = i >= 9;
    if (r > 0) lijnen += '<line x1="4" y1="4" x2="26" y2="4"/>'; if (r < 2) lijnen += '<line x1="4" y1="26" x2="26" y2="26"/>';
    if (c > 0) lijnen += '<line x1="4" y1="4" x2="4" y2="26"/>'; if (c < 2) lijnen += '<line x1="26" y1="4" x2="26" y2="26"/>';
  } else {
    const k = (i - 18) % 4; punt = i >= 22;
    lijnen = ['<polyline points="4,4 15,22 26,4" fill="none"/>', '<polyline points="4,4 22,15 4,26" fill="none"/>', '<polyline points="26,4 8,15 26,26" fill="none"/>', '<polyline points="4,26 15,8 26,26" fill="none"/>'][k];
  }
  return `<svg viewBox="0 0 30 30" class="vh" stroke="#0F5257" stroke-width="3" stroke-linecap="round">${lijnen}${punt ? '<circle cx="15" cy="15" r="2.6" fill="#E8772E" stroke="none"/>' : ''}</svg>`;
}
const POLY = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
SPELLEN.push({
  id: 'codekraker', naam: 'Codekraker', vak: 'taal', icoon: '📡', bron: 'zinnen', kort: 'Getallencode, morse, varkenshok en meer.',
  uitleg: 'Ontcijfer de geheime boodschap met de sleutel. Brons: getallencode. Zilver: morse. Goud: varkenshokcode. Platinum: vierkantcode (rij en kolom). Diamant: code met een sleutelwoord.',
  maak(n, doos, ctx) {
    const zin = kiesZin(zinLijst(ctx), [0, 8, 8, 8, 12, 12][n], [0, 26, 24, 26, 34, 32][n]);
    doos.dataset.zin = zin;
    const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', woorden = zin.split(' ');
    const sleutelwoord = U.pick(['KAT', 'ZON', 'BOS', 'MUIS', 'ROOS', 'DUIF']);
    let sleutel, code;
    if (n === 1) { sleutel = U.el('div', { class: 'sleutel-tabel' }, [...ABC].map((c, k) => U.el('div', {}, U.el('b', {}, String(k + 1)), U.el('span', {}, c)))); code = woorden.map(w => [...w].map(c => ABC.indexOf(c) + 1).join('-')); }
    else if (n === 2) { sleutel = U.el('div', { class: 'sleutel-tabel morse' }, [...ABC].map(c => U.el('div', {}, U.el('b', {}, MORSE[c]), U.el('span', {}, c)))); code = woorden.map(w => [...w].map(c => MORSE[c] || c).join('  ')); }
    else if (n === 3) { sleutel = U.el('div', { class: 'sleutel-tabel' }, [...ABC].map(c => U.el('div', {}, U.el('b', { html: varkenshok(c) }), U.el('span', {}, c)))); code = null; }
    else if (n === 4) {
      sleutel = U.el('table', { class: 'poly' }, U.el('tr', {}, U.el('th'), [1, 2, 3, 4, 5].map(k => U.el('th', {}, String(k)))), [0, 1, 2, 3, 4].map(r => U.el('tr', {}, U.el('th', {}, String(r + 1)), [0, 1, 2, 3, 4].map(c => U.el('td', {}, POLY[r * 5 + c] === 'I' ? 'I/J' : POLY[r * 5 + c])))));
      code = woorden.map(w => [...w.replace(/J/g, 'I')].map(c => { const k = POLY.indexOf(c); return `${Math.floor(k / 5) + 1}${k % 5 + 1}`; }).join(' '));
    } else {
      let k = 0;
      sleutel = U.el('div', {}, U.el('p', { class: 'opdracht' }, `Het sleutelwoord is ${sleutelwoord}. Elke letter van de boodschap is opgeschoven met een letter van het sleutelwoord (A = 0 plaatsen, B = 1, C = 2 …). Herhaal het sleutelwoord: ${(sleutelwoord.repeat(6)).slice(0, 12)}…`), U.el('div', { class: 'abc-strook' }, [...ABC].map((c, j) => U.el('span', { title: j }, c))));
      code = woorden.map(w => [...w].map(c => { const s = ABC.indexOf(sleutelwoord[k++ % sleutelwoord.length]); return ABC[(ABC.indexOf(c) + s) % 26]; }).join(''));
    }
    const tekst = n === 3 ? U.el('div', { class: 'code-tekst' }, woorden.map(w => U.el('span', { class: 'code-woord', html: [...w].map(varkenshok).join('') })))
      : n === 2 ? U.el('div', { class: 'code-tekst morse' }, woorden.map(w => U.el('span', { class: 'code-woord' }, [...w].map(c => U.el('span', { class: 'm-letter' }, MORSE[c] || c)))))
      : U.el('div', { class: 'code-tekst klein' }, code.map(w => U.el('span', { class: 'code-woord' }, w)));
    const inp = U.el('textarea', { class: 'tekst groot', rows: 2, placeholder: 'Schrijf hier de ontcijferde boodschap…', spellcheck: 'false' });
    doos.append(U.el('div', { class: 'label' }, 'Sleutel'), sleutel, U.el('div', { class: 'label' }, 'Geheime boodschap'), tekst, inp);
    const norm = s => U.groot(s).replace(/J/g, n === 4 ? 'I' : 'J');
    return {
      controleer() {
        if (!inp.value.trim()) return { ok: false, msg: 'Schrijf eerst je oplossing.' };
        const ok = norm(inp.value) === norm(zin); U.mark(inp, ok ? 'goed' : 'fout');
        return ok ? { ok } : { ok, msg: 'Dat klopt nog niet helemaal. Kijk letter per letter na.' };
      },
      hint() {
        const typ = U.zonderAccent(inp.value).toUpperCase().replace(/[^A-Z ]/g, '').trim().split(/\s+/).filter(Boolean);
        let m = 0; while (m < typ.length && typ[m] === woorden[m]) m++;
        inp.value = woorden.slice(0, m + 1).join(' ') + (m + 1 < woorden.length ? ' ' : ''); U.mark(inp, 'hint');
        return 'Er staat een woord meer juist ingevuld.';
      }
    };
  }
});
{ const sp = SPELLEN.find(x => x.id === 'codekraker'), orig = sp.maak; sp.maak = function (n, doos, ctx) { return metBetekenis(orig.call(this, n, doos, ctx), doos, doos.dataset.zin, ctx); }; }

/* ---------------- Robotlogica ---------------- */
const RICHT = [[-1, 0], [0, 1], [1, 0], [0, -1]], PIJL = ['▲', '▶', '▼', '◀'];
function robotParse(tokens) {
  let diepte = 0;
  for (const t of tokens) { if (t.t === 'H') diepte++; if (t.t === 'E') diepte--; if (diepte < 0) return { fout: 'Er staat een "einde herhaal" te veel.' }; }
  if (diepte > 0) return { fout: 'Een "herhaal" is nog niet afgesloten met "einde herhaal".' };
  const parse = i => { const blok = []; while (i < tokens.length) { const t = tokens[i]; if (t.t === 'E') return [blok, i + 1]; if (t.t === 'H') { const [b, j] = parse(i + 1); blok.push({ t: 'H', n: t.n, b }); i = j; } else { blok.push(t); i++; } } return [blok, i]; };
  return { prog: parse(0)[0] };
}
function robotUitvoeren(main, fA = [], max = 600) {
  const m = robotParse(main); if (m.fout) return { fout: m.fout };
  const a = robotParse(fA); if (a.fout) return { fout: 'Functie A: ' + a.fout };
  const uit = [];
  const plat = (b, d) => { for (const t of b) { if (uit.length > max || d > 12) return; if (t.t === 'H') for (let k = 0; k < t.n; k++) plat(t.b, d + 1); else if (t.t === 'A') plat(a.prog, d + 1); else uit.push(t.t); } };
  plat(m.prog, 0);
  if (uit.length > max) return { fout: 'Je programma is veel te lang (of roept zichzelf eindeloos op).' };
  return { stappen: uit };
}
const telRobot = tokens => tokens.filter(t => t.t !== 'E').length;
function maakRobotPuzzel(n) {
  const N = [0, 5, 6, 7, 8, 9][n];
  const T = t => ({ t }), H = k => ({ t: 'H', n: k }), E = () => ({ t: 'E' }), A = () => ({ t: 'A' });
  const fs = k => Array.from({ length: k }, () => T('F'));
  const dr = () => T(U.pick(['L', 'R'])), tegen = t => T(t.t === 'L' ? 'R' : 'L');
  const lus = (k, body) => [H(k), ...body, E()];
  const sjablonen = {
    1: [() => [...fs(U.r(1, 3)), dr(), ...fs(U.r(1, 3))], () => [...fs(U.r(1, 2)), dr(), ...fs(U.r(1, 2)), dr(), ...fs(U.r(1, 2))]],
    2: [() => { const p = []; for (let s = 0; s < U.r(4, 6); s++) { if (s) p.push(dr()); p.push(...fs(U.r(1, 3))); } return p; }],
    3: [
      () => [...fs(U.r(0, 2)), ...lus(U.r(3, 5), [...fs(U.r(1, 2)), dr()])],
      () => { const t = dr(); return [...fs(U.r(0, 1)), ...lus(U.r(3, 4), [T('F'), t, T('F'), tegen(t)]), ...fs(U.r(0, 2))]; },
      () => { const t = dr(); return [...lus(U.r(2, 3), [...fs(U.r(2, 3)), t, T('F'), t, ...fs(U.r(2, 3)), tegen(t), T('F'), tegen(t)])]; },
      () => [...lus(U.r(3, 6), fs(1)), dr(), ...lus(U.r(3, 6), fs(1)), dr(), ...fs(U.r(1, 2))],
    ],
    4: [
      () => { const t = dr(); return [...lus(3, [...lus(U.r(3, 5), fs(1)), t]), ...fs(U.r(1, 2))]; },
      () => { const t = dr(); return [...lus(U.r(2, 3), [...lus(U.r(2, 3), [T('F'), t, T('F'), tegen(t)]), t])]; },
      () => { const t = dr(); return [...lus(U.r(3, 4), [T('F'), t, T('F'), tegen(t)]), ...fs(U.r(1, 2)), tegen(t), ...lus(U.r(2, 4), [T('F'), tegen(t), T('F'), t])]; },
      () => { const t = dr(); return [...lus(2, [...lus(U.r(3, 5), fs(1)), t, T('F'), t, ...lus(U.r(3, 5), fs(1)), tegen(t), T('F'), tegen(t)])]; },
    ],
    5: [
      () => { const t = dr(); return { main: lus(3, [A(), t]), A: [...lus(U.r(3, 4), fs(1)), t, T('F'), tegen(t)] }; },
      () => { const t = dr(), k = U.r(3, 5); return { main: lus(U.r(2, 3), [A()]), A: [...lus(k, fs(1)), t, T('F'), t, ...lus(k, fs(1)), tegen(t), T('F'), tegen(t)] }; },
      () => { const t = dr(); return { main: [A(), A(), A()], A: [...lus(U.r(2, 3), [T('F'), t, T('F'), tegen(t)]), t] }; },
      () => { const t = dr(); return { main: [A(), T('F'), t, A(), T('F'), tegen(t), A()], A: lus(U.r(2, 3), [T('F'), t, T('F'), tegen(t)]) }; },
      () => { const t = dr(); return { main: lus(2, [A(), t, T('F'), t, A(), tegen(t), T('F'), tegen(t)]), A: lus(U.r(3, 5), fs(1)) }; },
      () => { const t = dr(); return { main: lus(U.r(2, 3), [A(), A(), t]), A: [...fs(U.r(1, 2)), t, T('F'), tegen(t)] }; },
      () => { const t = dr(); return { main: [...lus(U.r(2, 3), [A(), t]), T('F'), ...lus(2, [A(), tegen(t)])], A: [...fs(U.r(2, 3)), t, T('F'), tegen(t)] }; },
    ],
  };
  for (let poging = 0; poging < 6000; poging++) {
    let g = U.pick(sjablonen[n])(); if (Array.isArray(g)) g = { main: g, A: [] };
    const { stappen, fout } = robotUitvoeren(g.main, g.A); if (fout) continue;
    let r = U.r(0, N - 1), c = U.r(0, N - 1), d = U.r(0, 3), ok = true;
    const start = { r, c, d }, pad = [[r, c]], bezocht = new Set([r * N + c]);
    for (const st of stappen) {
      if (st === 'L') d = (d + 3) % 4; else if (st === 'R') d = (d + 1) % 4;
      else { r += RICHT[d][0]; c += RICHT[d][1]; if (r < 0 || c < 0 || r >= N || c >= N || bezocht.has(r * N + c)) { ok = false; break; } bezocht.add(r * N + c); pad.push([r, c]); }
    }
    if (!ok || pad.length < [0, 3, 7, 8, 10, 12][n]) continue;
    const doel = pad[pad.length - 1];
    const sterren = n >= 3 ? U.shuffle(pad.slice(2, -1)).slice(0, [0, 0, 0, 1, 3, 4][n]) : [];
    const muren = new Set(); const vrij = [...Array(N * N).keys()].filter(i => !bezocht.has(i));
    U.shuffle(vrij).slice(0, Math.round(vrij.length * [0, 0.2, 0.25, 0.3, 0.38, 0.42][n])).forEach(i => muren.add(i));
    const limiet = n === 1 ? 99 : n === 2 ? stappen.length : telRobot(g.main) + telRobot(g.A);
    return { N, prog: g.main, fA: g.A, start, doel, sterren, muren, limiet, functies: n === 5 };
  }
}
SPELLEN.push({
  id: 'robot', naam: 'Robotlogica', vak: 'logica', icoon: '🤖', kort: 'Programmeer de robot naar de vlag.',
  uitleg: 'Bouw een programma met blokjes: ▲ één vakje vooruit, ⟲ draai links, ⟳ draai rechts (de robot draait ter plaatse). Met 🔁 herhaal laat je blokjes een aantal keer herhalen (klik op ×2 om het aantal te veranderen) en je sluit af met "einde herhaal". Herhalingen mogen ook in elkaar. Op diamant schrijf je bovendien een functie A: een eigen blokje dat je in je hoofdprogramma zo vaak kunt gebruiken als je wil. Pak alle sterren en blijf binnen het maximum aantal blokjes. Elke "Nieuwe opgave" is een nieuw parcours.',
  maak(n, doos, ctx) {
    const P = maakRobotPuzzel(n), N = P.N;
    const progs = { main: [], A: [] };
    let actief = 'main', bezig = false;
    const rooster = U.el('div', { class: 'robot-rooster', style: `grid-template-columns: repeat(${N}, var(--rob))` });
    const cellen = [...Array(N * N)].map(() => { const c = U.el('div', { class: 'rob-cel' }); rooster.append(c); return c; });
    const status = U.el('div', { class: 'route-info' }), melding = U.el('div', { class: 'rob-melding' });
    const tekenVeld = (r = P.start.r, c = P.start.c, d = P.start.d, gepakt = new Set(), spoor = []) => {
      cellen.forEach((el, i) => {
        const rr = Math.floor(i / N), cc = i % N;
        el.className = 'rob-cel' + (P.muren.has(i) ? ' muur' : '') + (spoor.includes(i) ? ' spoor' : '');
        el.textContent = (rr === r && cc === c) || P.muren.has(i) ? '' : (rr === P.doel[0] && cc === P.doel[1]) ? '🏁' : P.sterren.some(s => s[0] === rr && s[1] === cc && !gepakt.has(rr * N + cc)) ? '⭐' : '';
        if (rr === r && cc === c) el.append(U.el('span', { class: 'robot', style: `--hoek:${d * 90}deg` }, U.el('span', { class: 'robot-pijl' }, '▲'), '🤖'));
      });
    };
    const kader = naam => U.el('div', { class: 'programma' + (actief === naam ? ' actief' : ''), onclick: () => { if (P.functies && actief !== naam) { actief = naam; tekenProg(); } } });
    const progBox = U.el('div');
    const telAlles = () => telRobot(progs.main) + telRobot(progs.A);
    const chips = naam => {
      let diepte = 0;
      const lijst = progs[naam];
      return lijst.length ? lijst.map((t, k) => {
        if (t.t === 'E') diepte--;
        const el = U.el('span', { class: 'blok b' + t.t, style: `margin-left:${Math.max(0, diepte) * 1.2}rem`, title: 'Klik om weg te halen', onclick: e => { e.stopPropagation(); if (bezig) return; lijst.splice(k, 1); tekenProg(); } },
          { F: '▲ vooruit', L: '⟲ links', R: '⟳ rechts', H: '🔁 herhaal', E: '⏹ einde herhaal', A: '🅰 functie A' }[t.t],
          t.t === 'H' ? U.el('button', { class: 'aantal', onclick: e => { e.stopPropagation(); t.n = t.n >= 9 ? 2 : t.n + 1; tekenProg(); } }, `×${t.n}`) : null);
        if (t.t === 'H') diepte++;
        return el;
      }) : [U.el('span', { class: 'stil' }, naam === 'main' ? 'Klik hieronder op blokjes om je programma te bouwen.' : 'Klik hier en voeg blokjes toe aan functie A.')];
    };
    const tekenProg = () => {
      const m = kader('main'); m.append(...chips('main'));
      if (P.functies) { const a = kader('A'); a.append(...chips('A')); progBox.replaceChildren(U.el('div', { class: 'label' }, 'Hoofdprogramma' + (actief === 'main' ? ' (actief)' : ' — klik om te bewerken')), m, U.el('div', { class: 'label' }, '🅰 Functie A' + (actief === 'A' ? ' (actief)' : ' — klik om te bewerken')), a); }
      else progBox.replaceChildren(U.el('div', { class: 'label' }, 'Jouw programma'), m);
      status.replaceChildren(U.el('span', {}, `Blokjes: ${telAlles()}${P.limiet < 99 ? ' / max ' + P.limiet : ''}`), P.sterren.length ? U.el('span', {}, `⭐ pak alle ${P.sterren.length} sterren`) : null);
      knopA && (knopA.disabled = actief === 'A');
    };
    const voeg = t => { if (bezig) return; progs[actief].push(t); melding.textContent = ''; tekenProg(); };
    const simuleer = () => {
      const res = robotUitvoeren(progs.main, progs.A); if (res.fout) return { fout: res.fout };
      let { r, c, d } = P.start; const gepakt = new Set(), spoor = [r * N + c], frames = [[r, c, d, new Set(), []]];
      for (const st of res.stappen) {
        if (st === 'L') d = (d + 3) % 4; else if (st === 'R') d = (d + 1) % 4;
        else { const nr = r + RICHT[d][0], nc = c + RICHT[d][1]; if (nr < 0 || nc < 0 || nr >= N || nc >= N || P.muren.has(nr * N + nc)) return { frames, fout: 'Botsing! De robot kan daar niet heen.' }; r = nr; c = nc; spoor.push(r * N + c); if (P.sterren.some(s2 => s2[0] === r && s2[1] === c)) gepakt.add(r * N + c); }
        frames.push([r, c, d, new Set(gepakt), [...spoor]]);
      }
      if (!(r === P.doel[0] && c === P.doel[1])) return { frames, fout: 'De robot staat niet op de vlag.' };
      if (gepakt.size < P.sterren.length) return { frames, fout: `Nog niet alle sterren gepakt (${gepakt.size}/${P.sterren.length}).` };
      if (telAlles() > P.limiet) return { frames, fout: `Het lukt, maar je gebruikt ${telAlles()} blokjes. Het moet met maximaal ${P.limiet}. ${P.functies ? 'Gebruik functie A slimmer!' : 'Gebruik (geneste) herhalingen!'}` };
      return { frames, ok: true };
    };
    const speel = () => {
      if (bezig) return; const s = simuleer(); melding.textContent = '';
      if (!s.frames) { melding.textContent = s.fout; return; }
      bezig = true; let k = 0;
      const t = setInterval(() => {
        if (!rooster.isConnected) { clearInterval(t); return; }
        const f = s.frames[k]; tekenVeld(...f); k++;
        if (k >= s.frames.length) { clearInterval(t); bezig = false; if (s.ok) ctx.klaar?.(); else melding.textContent = s.fout; }
      }, Math.max(90, 280 - s.frames.length * 3));
    };
    let knopA = null;
    tekenVeld();
    const palet = U.el('div', {},
      U.el('div', { class: 'knoppenrij' }, U.el('button', { class: 'blok bF', onclick: () => voeg({ t: 'F' }) }, '▲ vooruit'), U.el('button', { class: 'blok bL', onclick: () => voeg({ t: 'L' }) }, '⟲ links'), U.el('button', { class: 'blok bR', onclick: () => voeg({ t: 'R' }) }, '⟳ rechts')),
      n >= 2 ? U.el('div', { class: 'knoppenrij' }, U.el('button', { class: 'blok bH', onclick: () => voeg({ t: 'H', n: 2 }) }, '🔁 herhaal'), U.el('button', { class: 'blok bE', onclick: () => voeg({ t: 'E' }) }, '⏹ einde herhaal'),
        P.functies ? (knopA = U.el('button', { class: 'blok bA', onclick: () => voeg({ t: 'A' }) }, '🅰 functie A')) : null) : null,
      U.el('div', { class: 'knoppenrij' }, U.el('button', { class: 'knop', onclick: speel }, '▶ Start de robot'), U.el('button', { class: 'knop tweede klein', onclick: () => { if (!bezig) { tekenVeld(); melding.textContent = ''; } } }, '↺ Robot terug'), U.el('button', { class: 'knop tweede klein', onclick: () => { if (!bezig) { progs[actief] = []; tekenProg(); tekenVeld(); } } }, '🗑 Wis')));
    tekenProg();
    doos.append(U.el('div', { class: 'robot-wrap' }, rooster, U.el('div', {}, progBox, status, melding, palet)));
    return {
      controleer() { const s = simuleer(); return s.ok ? { ok: true } : { ok: false, msg: s.fout }; },
      hint() {
        const gelijk = (x, y) => x.t === y.t && (x.t !== 'H' || x.n === y.n);
        const prefix = (a, b) => { let k = 0; while (k < a.length && k < b.length && gelijk(a[k], b[k])) k++; return k; };
        const vul = (naam, juist) => { const k = prefix(progs[naam], juist); progs[naam] = juist.slice(0, Math.min(juist.length, k + 1)).map(t => ({ ...t })); };
        if (P.functies && (prefix(progs.A, P.fA) < P.fA.length || progs.A.length > P.fA.length)) { vul('A', P.fA); actief = 'A'; }
        else { vul('main', P.prog); actief = 'main'; }
        tekenProg(); tekenVeld();
        return P.functies ? 'Er staat een stukje van een goede oplossing klaar (kijk ook naar functie A).' : 'Het begin van een goed programma staat er nu.';
      }
    };
  }
});

/* ---------------- Doolhof ---------------- */
SPELLEN.push({
  id: 'doolhof', naam: 'Doolhof', vak: 'logica', icoon: '🌀', kort: 'Vind de uitgang (en de sleutels).',
  uitleg: 'Loop met de pijltjestoetsen of de knoppen (of klik op een vakje naast je) van linksboven naar de uitgang rechtsonder. Op platinum moet je eerst 3 sleutels verzamelen. Op diamant is het donker: je ziet alleen wat dicht bij je is!',
  maak(n, doos, ctx) {
    const N = [0, 8, 12, 16, 18, 20][n];
    const muur = Array(N * N).fill(15);
    const bez = new Set([0]), stapel = [0];
    while (stapel.length) {
      const p = stapel[stapel.length - 1], r = Math.floor(p / N), c = p % N;
      const opties = [[0, -1, 0, 1, 4], [1, 0, 1, 2, 8], [2, 1, 0, 4, 1], [3, 0, -1, 8, 2]].map(([, dr, dc, b1, b2]) => [r + dr, c + dc, b1, b2]).filter(([rr, cc]) => rr >= 0 && cc >= 0 && rr < N && cc < N && !bez.has(rr * N + cc));
      if (!opties.length) { stapel.pop(); continue; }
      const [rr, cc, b1, b2] = U.pick(opties), q = rr * N + cc;
      muur[p] &= ~b1; muur[q] &= ~b2; bez.add(q); stapel.push(q);
    }
    const sleutels = new Set(n >= 4 ? U.shuffle([...Array(N * N).keys()].filter(i => i > N && i !== N * N - 1)).slice(0, 3) : []);
    let pos = 0; const spoor = new Set([0]);
    const S = 26, W = N * S;
    const svg = U.el('div', { class: 'doolhof' });
    const kan = (p, dr, dc) => { const b = dr === -1 ? 1 : dc === 1 ? 2 : dr === 1 ? 4 : 8; return !(muur[p] & b); };
    const teken = () => {
      const r0 = Math.floor(pos / N), c0 = pos % N;
      let s = `<svg viewBox="-2 -2 ${W + 4} ${W + 4}" width="100%" style="max-width:${Math.min(W + 4, 560)}px">`;
      s += `<rect x="${(N - 1) * S}" y="${(N - 1) * S}" width="${S}" height="${S}" fill="#CDEBD9"/>`;
      spoor.forEach(p => { s += `<rect x="${p % N * S + 8}" y="${Math.floor(p / N) * S + 8}" width="${S - 16}" height="${S - 16}" rx="4" fill="#FFE0B8"/>`; });
      sleutels.forEach(p => { s += `<text x="${p % N * S + S / 2}" y="${Math.floor(p / N) * S + S * 0.75}" font-size="${S * 0.7}" text-anchor="middle">🔑</text>`; });
      s += `<text x="${(N - 1) * S + S / 2}" y="${(N - 1) * S + S * 0.75}" font-size="${S * 0.7}" text-anchor="middle">🚪</text>`;
      let lijnen = '';
      for (let p = 0; p < N * N; p++) { const x = p % N * S, y = Math.floor(p / N) * S; if (muur[p] & 1) lijnen += `M${x} ${y}h${S}`; if (muur[p] & 8) lijnen += `M${x} ${y}v${S}`; if (p % N === N - 1 && muur[p] & 2) lijnen += `M${x + S} ${y}v${S}`; if (Math.floor(p / N) === N - 1 && muur[p] & 4) lijnen += `M${x} ${y + S}h${S}`; }
      s += `<path d="${lijnen}" stroke="#0F5257" stroke-width="3" stroke-linecap="round" fill="none"/>`;
      s += `<circle cx="${c0 * S + S / 2}" cy="${r0 * S + S / 2}" r="${S * 0.32}" fill="#E8772E"/>`;
      if (n === 5) { for (let p = 0; p < N * N; p++) { const r = Math.floor(p / N), c = p % N; const d = Math.abs(r - r0) + Math.abs(c - c0); if (d > 2) s += `<rect x="${c * S - 0.5}" y="${r * S - 0.5}" width="${S + 1}" height="${S + 1}" fill="#1F2A2E" opacity="${spoor.has(p) ? 0.55 : 1}"/>`; } }
      svg.innerHTML = s + '</svg>';
      info.textContent = sleutels.size || n < 4 ? (n >= 4 ? `Nog ${sleutels.size} sleutel(s) te vinden` : 'Zoek de uitgang 🚪') : 'Alle sleutels! Nu naar de uitgang 🚪';
    };
    const info = U.el('div', { class: 'route-info' });
    const stap = (dr, dc) => {
      if (!svg.isConnected && document.body.contains(doos)) return;
      const r = Math.floor(pos / N), c = pos % N;
      if (r + dr < 0 || c + dc < 0 || r + dr >= N || c + dc >= N || !kan(pos, dr, dc)) return;
      pos = (r + dr) * N + c + dc; spoor.add(pos); sleutels.delete(pos); teken();
      if (pos === N * N - 1 && !sleutels.size) ctx.klaar?.();
    };
    const toets = e => { if (!svg.isConnected) { document.removeEventListener('keydown', toets); return; } const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key]; if (d && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName)) { e.preventDefault(); stap(...d); } };
    document.addEventListener('keydown', toets);
    svg.addEventListener('click', e => { const b = svg.querySelector('svg').getBoundingClientRect(); const x = (e.clientX - b.left) / b.width * (W + 4) - 2, y = (e.clientY - b.top) / b.height * (W + 4) - 2; const c = Math.floor(x / S), r = Math.floor(y / S), r0 = Math.floor(pos / N), c0 = pos % N; if (Math.abs(r - r0) + Math.abs(c - c0) === 1) stap(r - r0, c - c0); });
    const pijlen = U.el('div', { class: 'pijlen' }, U.el('span'), U.el('button', { onclick: () => stap(-1, 0) }, '▲'), U.el('span'), U.el('button', { onclick: () => stap(0, -1) }, '◀'), U.el('button', { onclick: () => stap(1, 0) }, '▼'), U.el('button', { onclick: () => stap(0, 1) }, '▶'));
    teken();
    doos.append(info, U.el('div', { class: 'doolhof-wrap' }, svg, pijlen));
    const bfs = doel => {
      const vorige = new Map([[pos, -1]]), q = [pos];
      while (q.length) { const p = q.shift(); if (doel(p)) { const pad = []; let x = p; while (x !== pos) { pad.unshift(x); x = vorige.get(x); } return pad; } const r = Math.floor(p / N), c = p % N; for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= N || cc >= N || !kan(p, dr, dc)) continue; const nq = rr * N + cc; if (!vorige.has(nq)) { vorige.set(nq, p); q.push(nq); } } }
      return [];
    };
    return {
      controleer() { return pos === N * N - 1 && !sleutels.size ? { ok: true } : { ok: false, msg: sleutels.size ? 'Je mist nog sleutels.' : 'Je bent nog niet aan de uitgang.' }; },
      hint() {
        const pad = bfs(p => sleutels.size ? sleutels.has(p) : p === N * N - 1);
        for (const p of pad.slice(0, 8)) { const dr = Math.floor(p / N) - Math.floor(pos / N), dc = p % N - pos % N; stap(dr, dc); }
        return 'Ik heb je een stukje in de goede richting gezet.';
      }
    };
  }
});

/* ---------------- Kakuro ---------------- */
SPELLEN.push({
  id: 'kakuro', naam: 'Kakuro', vak: 'logica', icoon: '➕', kort: 'Kruiswoordraadsel met sommen.',
  uitleg: 'Vul de witte vakjes met de cijfers 1 tot 9. Het getal in een grijs vakje is de som van de witte vakjes rechts ervan (bovenaan) of eronder (onderaan). In één som mag elk cijfer maar één keer voorkomen.',
  maak(n, doos) {
    const M = [0, 3, 4, 5, 6, 7][n], kans = [0, 0, 0.1, 0.18, 0.22, 0.24][n];
    let wit, opl;
    for (let poging = 0; poging < 300; poging++) {
      wit = Array.from({ length: M + 1 }, (_, r) => Array.from({ length: M + 1 }, (_, c) => r > 0 && c > 0 && Math.random() >= kans));
      let ch = true;
      const runLen = (r, c, dr, dc) => { let k = 0, rr = r, cc = c; while (rr >= 0 && cc >= 0 && rr <= M && cc <= M && wit[rr][cc]) { rr -= dr; cc -= dc; } rr += dr; cc += dc; while (rr <= M && cc <= M && wit[rr][cc]) { k++; rr += dr; cc += dc; } return k; };
      while (ch) { ch = false; for (let r = 1; r <= M; r++) for (let c = 1; c <= M; c++) if (wit[r][c] && (runLen(r, c, 0, 1) < 2 || runLen(r, c, 1, 0) < 2 || runLen(r, c, 0, 1) > 9 || runLen(r, c, 1, 0) > 9)) { wit[r][c] = false; ch = true; } }
      const cellen = []; for (let r = 1; r <= M; r++) for (let c = 1; c <= M; c++) if (wit[r][c]) cellen.push([r, c]);
      if (cellen.length < M * M * 0.55) continue;
      opl = Array.from({ length: M + 1 }, () => Array(M + 1).fill(0));
      const magH = (r, c, v) => { for (let cc = c - 1; cc >= 1 && wit[r][cc]; cc--) if (opl[r][cc] === v) return false; for (let cc = c + 1; cc <= M && wit[r][cc]; cc++) if (opl[r][cc] === v) return false; return true; };
      const magV = (r, c, v) => { for (let rr = r - 1; rr >= 1 && wit[rr][c]; rr--) if (opl[rr][c] === v) return false; for (let rr = r + 1; rr <= M && wit[rr][c]; rr++) if (opl[rr][c] === v) return false; return true; };
      let knopen = 0;
      const rec = i => { if (i === cellen.length) return true; if (++knopen > 20000) return false; const [r, c] = cellen[i]; for (const v of U.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) { if (magH(r, c, v) && magV(r, c, v)) { opl[r][c] = v; if (rec(i + 1)) return true; opl[r][c] = 0; } } return false; };
      if (rec(0)) break;
      opl = null;
    }
    const runs = [];
    for (let r = 0; r <= M; r++) for (let c = 0; c <= M; c++) {
      if (wit[r][c]) continue;
      if (c < M && wit[r][c + 1]) { const cel = []; for (let cc = c + 1; cc <= M && wit[r][cc]; cc++) cel.push([r, cc]); runs.push({ r, c, d: 'h', cel, som: cel.reduce((a, [x, y]) => a + opl[x][y], 0) }); }
      if (r < M && wit[r + 1][c]) { const cel = []; for (let rr = r + 1; rr <= M && wit[rr][c]; rr++) cel.push([rr, c]); runs.push({ r, c, d: 'v', cel, som: cel.reduce((a, [x, y]) => a + opl[x][y], 0) }); }
    }
    const inp = {}, cellen = [];
    const gegeven = new Set(U.shuffle(Object.keys(Object.fromEntries(runs.flatMap(x => x.cel).map(([r, c]) => [r * 100 + c, 1])))).slice(0, [0, 2, 1, 0, 0, 0][n]));
    const rooster = U.el('div', { class: 'kakuro', style: `grid-template-columns: repeat(${M + 1}, var(--kk))` });
    for (let r = 0; r <= M; r++) for (let c = 0; c <= M; c++) {
      if (wit[r][c]) {
        const i = U.el('input', { class: 'kk-in', inputmode: 'numeric', maxlength: 1, autocomplete: 'off' });
        i.addEventListener('input', () => { i.value = i.value.replace(/[^1-9]/g, '').slice(-1); U.mark(i, ''); });
        if (gegeven.has(String(r * 100 + c))) { i.value = opl[r][c]; i.readOnly = true; i.classList.add('gegeven'); }
        inp[r * 100 + c] = i; cellen.push({ i, op: opl[r][c] }); rooster.append(U.el('div', { class: 'kk-wit' }, i));
      } else {
        const h = runs.find(x => x.r === r && x.c === c && x.d === 'h'), v = runs.find(x => x.r === r && x.c === c && x.d === 'v');
        rooster.append(U.el('div', { class: 'kk-zwart' + (h || v ? ' som' : '') }, h ? U.el('span', { class: 'kk-h' }, String(h.som)) : null, v ? U.el('span', { class: 'kk-v' }, String(v.som)) : null));
      }
    }
    doos.append(U.el('div', { class: 'scroll-x' }, rooster));
    const inv = U.invul(cellen);
    return {
      controleer() {
        const w = (r, c) => Number(inp[r * 100 + c].value) || 0;
        if (cellen.some(x => !x.i.value)) return { ok: false, msg: `Nog ${cellen.filter(x => !x.i.value).length} vakjes leeg.` };
        const fout = new Set();
        for (const run of runs) { const v = run.cel.map(([r, c]) => w(r, c)); if (v.reduce((a, b) => a + b) !== run.som || new Set(v).size !== v.length) run.cel.forEach(([r, c]) => fout.add(r * 100 + c)); }
        Object.entries(inp).forEach(([k, i]) => { if (!i.readOnly) U.mark(i, fout.has(Number(k)) ? 'fout' : 'goed'); });
        return fout.size ? { ok: false, msg: 'Niet alle sommen kloppen. Kijk naar de rode vakjes.' } : { ok: true };
      },
      hint: inv.hint
    };
  }
});

/* ---------------- Bruggen ---------------- */
SPELLEN.push({
  id: 'bruggen', naam: 'Bruggen bouwen', vak: 'logica', icoon: '🌉', kort: 'Verbind de eilanden met bruggen.',
  uitleg: 'Het getal op elk eiland zegt hoeveel bruggen er vertrekken. Bruggen lopen recht (horizontaal of verticaal), kruisen elkaar nooit, en tussen twee eilanden liggen hoogstens 2 bruggen. Alle eilanden moeten samen één geheel vormen. Klik op een eiland en daarna op een ander eiland om een brug te leggen (nog eens klikken = dubbele brug, nog eens = weg).',
  maak(n, doos) {
    const N = [0, 5, 6, 7, 8, 9][n], doel = [0, 6, 8, 11, 14, 18][n];
    let eil, opl;
    for (let poging = 0; poging < 200; poging++) {
      eil = []; opl = new Map();
      const bezet = Array.from({ length: N }, () => Array(N).fill(null));
      const r0 = U.r(0, N - 1), c0 = U.r(0, N - 1); eil.push({ r: r0, c: c0 }); bezet[r0][c0] = 'E';
      for (let t = 0; t < 3000 && eil.length < doel; t++) {
        const a = U.r(0, eil.length - 1), A = eil[a], [dr, dc] = U.pick([[0, 1], [1, 0], [0, -1], [-1, 0]]), d = U.r(2, Math.max(2, Math.floor(N / 2) + 1));
        const r = A.r + dr * d, c = A.c + dc * d;
        if (r < 0 || c < 0 || r >= N || c >= N || bezet[r][c]) continue;
        let vrij = true; for (let k = 1; k < d; k++) if (bezet[A.r + dr * k][A.c + dc * k]) vrij = false;
        if (!vrij) continue;
        if ([[0, 1], [1, 0], [0, -1], [-1, 0]].some(([a2, b2]) => bezet[r + a2]?.[c + b2] === 'E')) continue;
        eil.push({ r, c }); bezet[r][c] = 'E';
        for (let k = 1; k < d; k++) bezet[A.r + dr * k][A.c + dc * k] = dr ? 'V' : 'H';
        opl.set(`${Math.min(a, eil.length - 1)}-${Math.max(a, eil.length - 1)}`, U.r(1, 2));
      }
      if (eil.length >= doel) break;
    }
    const nummer = eil.map((_, i) => [...opl].reduce((s, [k, v]) => s + (k.split('-').map(Number).includes(i) ? v : 0), 0));
    const S = 48, W = N * S;
    const mijn = new Map(); let gekozen = null;
    const buur = (a, b) => { const A = eil[a], B = eil[b]; if (A.r !== B.r && A.c !== B.c) return false; return !eil.some((E, k) => k !== a && k !== b && (A.r === B.r ? E.r === A.r && E.c > Math.min(A.c, B.c) && E.c < Math.max(A.c, B.c) : E.c === A.c && E.r > Math.min(A.r, B.r) && E.r < Math.max(A.r, B.r))); };
    const cellenVan = key => { const [a, b] = key.split('-').map(Number), A = eil[a], B = eil[b], uit = []; if (A.r === B.r) for (let c = Math.min(A.c, B.c) + 1; c < Math.max(A.c, B.c); c++) uit.push(`${A.r},${c},h`); else for (let r = Math.min(A.r, B.r) + 1; r < Math.max(A.r, B.r); r++) uit.push(`${r},${A.c},v`); return uit; };
    const kruist = (k1, k2) => { const a = cellenVan(k1).map(x => x.slice(0, x.lastIndexOf(','))), b = cellenVan(k2).map(x => x.slice(0, x.lastIndexOf(','))); return a.some(x => b.includes(x)); };
    const telVan = i => [...mijn].reduce((s, [k, v]) => s + (k.split('-').map(Number).includes(i) ? v : 0), 0);
    const box = U.el('div', { class: 'bruggen' });
    const teken = () => {
      let s = `<svg viewBox="0 0 ${W} ${W}" width="100%" style="max-width:${W}px">`;
      for (const [k, v] of mijn) { const [a, b] = k.split('-').map(Number), A = eil[a], B = eil[b]; const x1 = A.c * S + S / 2, y1 = A.r * S + S / 2, x2 = B.c * S + S / 2, y2 = B.r * S + S / 2; const off = v === 2 ? 4 : 0, hor = A.r === B.r; for (const o of v === 2 ? [-off, off] : [0]) s += `<line x1="${x1 + (hor ? 0 : o)}" y1="${y1 + (hor ? o : 0)}" x2="${x2 + (hor ? 0 : o)}" y2="${y2 + (hor ? o : 0)}" stroke="#8F6B3E" stroke-width="3"/>`; }
      eil.forEach((E, i) => { const t = telVan(i), kl = t === nummer[i] ? '#2E8B57' : t > nummer[i] ? '#C8372D' : '#0F5257'; s += `<g data-i="${i}" style="cursor:pointer"><circle cx="${E.c * S + S / 2}" cy="${E.r * S + S / 2}" r="${S * 0.36}" fill="${gekozen === i ? '#E8772E' : '#fff'}" stroke="${kl}" stroke-width="3"/><text x="${E.c * S + S / 2}" y="${E.r * S + S / 2 + 6}" text-anchor="middle" font-size="18" font-weight="800" fill="${kl}">${nummer[i]}</text></g>`; });
      box.innerHTML = s + '</svg>';
      box.querySelectorAll('g').forEach(g => g.addEventListener('click', () => klik(Number(g.dataset.i))));
    };
    const klik = i => {
      if (gekozen === null) { gekozen = i; teken(); return; }
      const a = gekozen; gekozen = null;
      if (a !== i && buur(a, i)) {
        const k = `${Math.min(a, i)}-${Math.max(a, i)}`, v = ((mijn.get(k) || 0) + 1) % 3;
        if (v && [...mijn.keys()].some(k2 => k2 !== k && kruist(k, k2))) { teken(); return; }
        if (v) mijn.set(k, v); else mijn.delete(k);
      }
      teken();
    };
    teken();
    doos.append(U.el('div', { class: 'scroll-x' }, box));
    return {
      controleer() {
        const fout = eil.filter((_, i) => telVan(i) !== nummer[i]).length;
        if (fout) return { ok: false, msg: `${fout} ${fout === 1 ? 'eiland heeft' : 'eilanden hebben'} nog niet het juiste aantal bruggen.` };
        const gezien = new Set([0]), q = [0];
        while (q.length) { const x = q.shift(); for (const k of mijn.keys()) { const [a, b] = k.split('-').map(Number); const y = a === x ? b : b === x ? a : -1; if (y >= 0 && !gezien.has(y)) { gezien.add(y); q.push(y); } } }
        return gezien.size === eil.length ? { ok: true } : { ok: false, msg: 'Alle eilanden moeten met elkaar verbonden zijn (één geheel).' };
      },
      hint() {
        const sleutels = [...new Set([...opl.keys(), ...mijn.keys()])].filter(k => (opl.get(k) || 0) !== (mijn.get(k) || 0));
        if (!sleutels.length) return 'Alles ligt juist!';
        const k = sleutels.find(x => !opl.has(x)) || U.pick(sleutels);
        if (opl.has(k)) { for (const k2 of [...mijn.keys()]) if (k2 !== k && kruist(k, k2)) mijn.delete(k2); mijn.set(k, opl.get(k)); } else mijn.delete(k);
        gekozen = null; teken(); return 'Eén brug is juist gelegd (of een foute weggehaald).';
      }
    };
  }
});
