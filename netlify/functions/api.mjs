// Kangoeroe-Kluis — centrale opslag (Netlify Blobs): leerlingen, resultaten, eigen inhoud en toetsen
import { getStore } from '@netlify/blobs';

const json = (d, status = 200) => new Response(JSON.stringify(d), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const resKey = id => 'res/' + id;
const toetsKey = (t, l) => `toets/${t}/${l}`;
const MAX_PER_LEERLING = 8000;
const GRATIE_MS = 2 * 60 * 1000;

const zonderAccent = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe').replace(/æ/g, 'ae');
function normTaal(s, strikt) {
  let t = String(s ?? '').replace(/[’‘`´]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
  t = t.replace(/[.!?;:,]+$/g, '').replace(/\s*'\s*/g, "'").trim();
  return strikt ? t : zonderAccent(t);
}
const vergelijk = (a, juist, strikt) => { const x = normTaal(a, strikt); return x !== '' && String(juist ?? '').split(/\s*[\/|]\s*/).some(j => normTaal(j, strikt) === x); };

/* Te veel resultaten (na jaren)? Eerst de oudste NIET-gelukte pogingen weg; behaalde medailles blijven altijd bewaard. */
function bijsnoeien(res) {
  if (res.length <= MAX_PER_LEERLING) return res;
  let teVeel = res.length - MAX_PER_LEERLING;
  const uit = res.filter(r => { if (teVeel > 0 && !r.juist) { teVeel--; return false; } return true; });
  return teVeel > 0 ? uit.slice(teVeel) : uit;
}
function schoonResultaat(item) {
  const getal = (v, max) => Math.max(0, Math.min(max, Math.round(Number(v) || 0)));
  if (!item || typeof item !== 'object') return null;
  const spel = String(item.spel || '').slice(0, 40);
  if (!/^[a-z0-9-]+$/.test(spel)) return null;
  return {
    id: String(item.id || '').slice(0, 40), spel, thema: String(item.thema || '').slice(0, 60), themaNaam: String(item.themaNaam || '').slice(0, 80),
    niveau: getal(item.niveau, 5) || 1, juist: !!item.juist,
    seconden: getal(item.seconden, 86400), pogingen: getal(item.pogingen, 999), hints: getal(item.hints, 99), punten: getal(item.punten, 100),
    datum: isNaN(Date.parse(item.datum)) ? new Date().toISOString() : new Date(item.datum).toISOString(),
    ...(item.meester ? { meester: true } : {}),
    ...(Array.isArray(item.items) && item.items.length ? { items: item.items.slice(0, 20).map(x => String(x).slice(0, 12)) } : {}),
  };
}

function beoordeel(toets, antwoorden = {}) {
  let score = 0, max = 0; const per = {};
  for (const v of toets.vragen || []) {
    if (v.type === 'tekst') continue;
    const p = Number(v.punten) || 1; max += p;
    const a = antwoorden[v.id];
    const ok = v.type === 'mc' ? a !== undefined && a !== '' && Number(a) === Number(v.juist) : vergelijk(a, v.antwoord, !!toets.strikt);
    if (ok) score += p;
    per[v.id] = ok;
  }
  return { score, max, per };
}
const voorLeerling = t => ({
  id: t.id, titel: t.titel, uitleg: t.uitleg || '', strikt: !!t.strikt,
  vragen: (t.vragen || []).map(v => { const { juist, antwoord, ...rest } = v; return rest; }),
});
const isOpen = (t, nu = Date.now()) => (!t.van || Date.parse(t.van) <= nu) && (!t.tot || nu <= Date.parse(t.tot));
const vanKlas = (t, l) => !t.klassen?.length || t.klassen.includes(l.klas || '');
const eindVan = (t, rec) => { const tot = t.tot ? Date.parse(t.tot) : Infinity; const duur = t.duur ? rec.start + t.duur * 60000 : Infinity; const e = Math.min(tot, duur); return e === Infinity ? null : e; };

export default async (req) => {
  const actie = new URL(req.url).searchParams.get('actie');
  const store = getStore({ name: 'kangoeroe-kluis', consistency: 'strong' });
  const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
  const wachtwoord = process.env.LEERKRACHT_WACHTWOORD || 'kangoeroe';
  const isLeerkracht = typeof body.wachtwoord === 'string' && body.wachtwoord === wachtwoord;
  const lijst = async () => (await store.get('leerlingen', { type: 'json' })) || [];
  const toetsen = async () => (await store.get('toetsen', { type: 'json' })) || [];
  const leerling = async () => (await lijst()).find(l => l.id === body.id && String(l.pin) === String(body.pin));
  const nietLk = () => json({ fout: 'Verkeerd wachtwoord' }, 401);
  const nietLl = () => json({ fout: 'Verkeerde code' }, 401);

  switch (actie) {
    /* ---------- leerlingen ---------- */
    case 'leerlingen':
      return json({ leerlingen: (await lijst()).map(({ pin, ...l }) => l) });
    case 'inhoud':
      return json({ inhoud: (await store.get('inhoud', { type: 'json' })) || {} });
    case 'login': {
      const l = await leerling(); if (!l) return nietLl();
      return json({ ok: true, resultaten: (await store.get(resKey(l.id), { type: 'json' })) || [] });
    }
    case 'resultaat': {
      const l = await leerling(); if (!l) return nietLl();
      const nieuw = (Array.isArray(body.items) ? body.items : []).map(schoonResultaat).filter(Boolean);
      const res = (await store.get(resKey(l.id), { type: 'json' })) || [];
      const ids = new Set(res.map(r => r.id));
      for (const r of nieuw) if (!ids.has(r.id)) res.push(r);
      await store.setJSON(resKey(l.id), bijsnoeien(res));
      return json({ ok: true, aantal: nieuw.length });
    }

    /* ---------- toetsen voor leerlingen ---------- */
    case 'toetsen': {
      const l = await leerling(); if (!l) return nietLl();
      const nu = Date.now(), uit = [];
      for (const t of await toetsen()) {
        if (!vanKlas(t, l)) continue;
        const rec = await store.get(toetsKey(t.id, l.id), { type: 'json' });
        if (!isOpen(t, nu) && !rec?.ingeleverd) continue;
        if (!isOpen(t, nu) && rec?.ingeleverd && nu - Date.parse(t.tot) > 7 * 864e5) continue;
        const verlopen = rec && !rec.ingeleverd && eindVan(t, rec) && nu > eindVan(t, rec) + GRATIE_MS;
        uit.push({ id: t.id, titel: t.titel, van: t.van, tot: t.tot, duur: t.duur || 0, aantal: (t.vragen || []).filter(v => v.type !== 'tekst').length,
          status: rec?.ingeleverd || verlopen ? 'ingeleverd' : rec ? 'bezig' : 'open', score: rec?.ingeleverd && t.toonScore ? rec.score : null, max: rec?.ingeleverd && t.toonScore ? rec.max : null });
      }
      return json({ toetsen: uit });
    }
    case 'toets-start': {
      const l = await leerling(); if (!l) return nietLl();
      const t = (await toetsen()).find(x => x.id === body.toetsId);
      if (!t || !vanKlas(t, l)) return json({ fout: 'Deze toets bestaat niet (meer).' }, 404);
      if (!isOpen(t)) return json({ fout: 'Deze toets is niet open.' }, 403);
      const key = toetsKey(t.id, l.id);
      let rec = await store.get(key, { type: 'json' });
      if (rec?.ingeleverd) return json({ fout: 'Je hebt deze toets al ingeleverd.' }, 403);
      if (!rec) { rec = { start: Date.now(), antwoorden: {} }; await store.setJSON(key, rec); }
      const eind = eindVan(t, rec);
      if (eind && Date.now() > eind + GRATIE_MS) return json({ fout: 'De tijd voor deze toets is voorbij.' }, 403);
      return json({ toets: { ...voorLeerling(t), eind }, antwoorden: rec.antwoorden || {}, nu: Date.now() });
    }
    case 'toets-bewaar': {
      const l = await leerling(); if (!l) return nietLl();
      const key = toetsKey(body.toetsId, l.id);
      const rec = await store.get(key, { type: 'json' });
      if (!rec || rec.ingeleverd) return json({ ok: false });
      rec.antwoorden = typeof body.antwoorden === 'object' && body.antwoorden ? body.antwoorden : {};
      await store.setJSON(key, rec);
      return json({ ok: true });
    }
    case 'toets-inleveren': {
      const l = await leerling(); if (!l) return nietLl();
      const t = (await toetsen()).find(x => x.id === body.toetsId);
      if (!t) return json({ fout: 'Deze toets bestaat niet (meer).' }, 404);
      const key = toetsKey(t.id, l.id);
      const rec = await store.get(key, { type: 'json' });
      if (!rec) return json({ fout: 'Deze toets is niet gestart.' }, 403);
      if (rec.ingeleverd) return json({ ok: true, score: t.toonScore ? rec.score : null, max: t.toonScore ? rec.max : null });
      const eind = eindVan(t, rec);
      const telaat = eind && Date.now() > eind + GRATIE_MS;
      const antwoorden = telaat ? rec.antwoorden || {} : (typeof body.antwoorden === 'object' && body.antwoorden ? body.antwoorden : {});
      const b = beoordeel(t, antwoorden);
      await store.setJSON(key, { ...rec, antwoorden, ingeleverd: Date.now(), score: b.score, max: b.max, per: b.per, telaat: !!telaat });
      return json({ ok: true, score: t.toonScore ? b.score : null, max: t.toonScore ? b.max : null });
    }

    /* ---------- paspoort ---------- */
    case 'paspoort': {
      const l = await leerling(); if (!l) return nietLl();
      return json({ paspoort: (await store.get('paspoort/' + l.id, { type: 'json' })) || null });
    }
    case 'paspoort-bewaar': {
      const l = await leerling(); if (!l) return nietLl();
      const nieuw = body.paspoort && typeof body.paspoort === 'object' ? body.paspoort : null;
      if (!nieuw || JSON.stringify(nieuw).length > 300000) return json({ fout: 'Ongeldig paspoort.' }, 400);
      const oud = (await store.get('paspoort/' + l.id, { type: 'json' })) || {};
      const feedback = Object.fromEntries((oud.reflecties || []).filter(r => r.feedback).map(r => [r.id, r.feedback]));
      nieuw.reflecties = (Array.isArray(nieuw.reflecties) ? nieuw.reflecties : []).map(r => ({ ...r, feedback: feedback[r.id] || undefined }));
      nieuw.bijgewerkt = new Date().toISOString();
      await store.setJSON('paspoort/' + l.id, nieuw);
      return json({ ok: true, paspoort: nieuw });
    }

    /* ---------- raadsels van klasgenoten ---------- */
    case 'raadsels': {
      const l = await leerling(); if (!l) return nietLl();
      const alle = (await store.get('raadsels', { type: 'json' })) || [];
      return json({ raadsels: alle.filter(r => r.status === 'ok' && r.leerlingId !== l.id).map(({ leerlingId, opmerking, ...r }) => r), mijn: alle.filter(r => r.leerlingId === l.id) });
    }
    case 'raadsel-insturen': {
      const l = await leerling(); if (!l) return nietLl();
      const b = body.raadsel || {};
      const tekst = (s, n) => String(s || '').trim().slice(0, n);
      const r = { id: 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), leerlingId: l.id, auteur: l.voornaam, klas: l.klas || '', soort: b.soort === 'tekening' ? 'tekening' : 'tekst',
        vraag: tekst(b.vraag, 600), antwoord: tekst(b.antwoord, 80), ook: tekst(b.ook, 200), hint: tekst(b.hint, 200), uitleg: tekst(b.uitleg, 400), status: 'wacht', datum: new Date().toISOString(), opgelost: 0 };
      if (!r.antwoord || (!r.vraag && r.soort === 'tekst')) return json({ fout: 'Vul een raadsel en het antwoord in.' }, 400);
      const alle = (await store.get('raadsels', { type: 'json' })) || [];
      if (alle.filter(x => x.leerlingId === l.id && x.status === 'wacht').length >= 5) return json({ fout: 'Je hebt al 5 raadsels die wachten op je leerkracht. Wacht even tot die bekeken zijn.' }, 429);
      if (r.soort === 'tekening') {
        const m = /^data:(image\/(png|jpeg));base64,(.+)$/.exec(String(b.tekening || ''));
        const buf = m && Buffer.from(m[3], 'base64');
        if (!buf || buf.length > 600_000) return json({ fout: 'De tekening is te groot of ongeldig.' }, 400);
        r.beeld = 'rb' + r.id.slice(1); await store.set('beeld/' + r.beeld, buf, { metadata: { type: m[1] } });
      }
      alle.push(r);
      while (alle.length > 400) { const k = alle.findIndex(x => x.status !== 'ok'); const [weg] = alle.splice(k >= 0 ? k : 0, 1); if (weg.beeld) await store.delete('beeld/' + weg.beeld); }
      await store.setJSON('raadsels', alle);
      return json({ ok: true, raadsel: r });
    }
    case 'raadsel-weg': {
      const l = await leerling(); if (!l) return nietLl();
      const alle = (await store.get('raadsels', { type: 'json' })) || [];
      const weg = alle.find(r => r.id === body.raadselId && r.leerlingId === l.id);
      if (weg) { if (weg.beeld) await store.delete('beeld/' + weg.beeld); await store.setJSON('raadsels', alle.filter(r => r !== weg)); }
      return json({ ok: true });
    }
    case 'raadsel-opgelost': {
      const l = await leerling(); if (!l) return nietLl();
      const alle = (await store.get('raadsels', { type: 'json' })) || [];
      const r = alle.find(x => x.id === body.raadselId && x.leerlingId !== l.id);
      if (r) { r.opgelost = (r.opgelost || 0) + 1; await store.setJSON('raadsels', alle); }
      return json({ ok: true });
    }
    case 'lk-raadsels': {
      if (!isLeerkracht) return nietLk();
      return json({ raadsels: (await store.get('raadsels', { type: 'json' })) || [] });
    }
    case 'lk-raadsel': {
      if (!isLeerkracht) return nietLk();
      let alle = (await store.get('raadsels', { type: 'json' })) || [];
      if (body.wis) { const weg = alle.find(r => r.id === body.raadselId); if (weg?.beeld) await store.delete('beeld/' + weg.beeld); alle = alle.filter(r => r !== weg); }
      else {
        const r = alle.find(x => x.id === body.raadselId); if (!r) return json({ fout: 'Raadsel niet gevonden.' }, 404);
        for (const k of ['vraag', 'antwoord', 'ook', 'hint', 'uitleg']) if (typeof body[k] === 'string') r[k] = body[k].trim().slice(0, k === 'vraag' ? 600 : 400);
        if (['ok', 'nee', 'wacht'].includes(body.status)) r.status = body.status;
        if (typeof body.opmerking === 'string') r.opmerking = body.opmerking.trim().slice(0, 400);
      }
      await store.setJSON('raadsels', alle);
      return json({ ok: true });
    }

    /* ---------- leerkracht ---------- */
    case 'lk-paspoorten': {
      if (!isLeerkracht) return nietLk();
      const { blobs } = await store.list({ prefix: 'paspoort/' });
      const paspoorten = {};
      await Promise.all(blobs.map(async b => { paspoorten[b.key.slice(9)] = await store.get(b.key, { type: 'json' }); }));
      return json({ paspoorten });
    }
    case 'lk-feedback': {
      if (!isLeerkracht) return nietLk();
      const key = 'paspoort/' + String(body.id || '');
      const pp = await store.get(key, { type: 'json' }); if (!pp) return json({ fout: 'Geen paspoort gevonden.' }, 404);
      const r = (pp.reflecties || []).find(x => x.id === body.reflectieId); if (!r) return json({ fout: 'Reflectie niet gevonden.' }, 404);
      r.feedback = String(body.tekst || '').trim() ? { tekst: String(body.tekst).slice(0, 2000), datum: new Date().toISOString() } : undefined;
      await store.setJSON(key, pp);
      return json({ ok: true });
    }
    case 'overzicht': {
      if (!isLeerkracht) return nietLk();
      const { blobs } = await store.list({ prefix: 'res/' });
      const resultaten = {};
      await Promise.all(blobs.map(async b => { resultaten[b.key.slice(4)] = (await store.get(b.key, { type: 'json' })) || []; }));
      return json({ leerlingen: await lijst(), resultaten, inhoud: (await store.get('inhoud', { type: 'json' })) || {}, standaardWachtwoord: !process.env.LEERKRACHT_WACHTWOORD });
    }
    case 'bewaar-leerlingen': {
      if (!isLeerkracht) return nietLk();
      const gezien = new Set();
      const nieuw = (Array.isArray(body.leerlingen) ? body.leerlingen : [])
        .map(l => ({ id: String(l.id || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 30) || 'L' + Math.random().toString(36).slice(2, 10), klas: String(l.klas || '').trim().slice(0, 20), naam: String(l.naam || '').trim().slice(0, 50), voornaam: String(l.voornaam || '').trim().slice(0, 40), pin: String(l.pin || '').replace(/\D/g, '').slice(0, 6) }))
        .filter(l => l.voornaam && l.pin.length >= 4 && !gezien.has(l.id) && gezien.add(l.id));
      await store.setJSON('leerlingen', nieuw);
      return json({ ok: true, leerlingen: nieuw });
    }
    case 'wis': {
      if (!isLeerkracht) return nietLk();
      if (body.id) await store.delete(resKey(body.id));
      else { const { blobs } = await store.list({ prefix: 'res/' }); await Promise.all(blobs.map(b => store.delete(b.key))); }
      return json({ ok: true });
    }
    /* ---------- prenten voor eigen wiskunde-uitdagingen ---------- */
    case 'beeld': {
      const id = new URL(req.url).searchParams.get('id') || '';
      if (!/^[a-z0-9]{6,40}$/.test(id)) return new Response('Niet gevonden', { status: 404 });
      const r = await store.getWithMetadata('beeld/' + id, { type: 'arrayBuffer' });
      if (!r) return new Response('Niet gevonden', { status: 404 });
      return new Response(r.data, { headers: { 'content-type': r.metadata?.type || 'image/png', 'cache-control': 'public, max-age=31536000, immutable' } });
    }
    case 'lk-beeld': {
      if (!isLeerkracht) return nietLk();
      const m = /^data:(image\/(png|jpeg|gif|webp));base64,(.+)$/.exec(String(body.data || ''));
      if (!m) return json({ fout: 'Dit is geen prent (png, jpg, gif of webp).' }, 400);
      const buf = Buffer.from(m[3], 'base64');
      if (buf.length > 2_500_000) return json({ fout: 'Deze prent is te groot (max. 2,5 MB).' }, 413);
      const id = 'b' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      await store.set('beeld/' + id, buf, { metadata: { type: m[1] } });
      return json({ ok: true, id });
    }
    case 'bewaar-inhoud': {
      if (!isLeerkracht) return nietLk();
      const inh = typeof body.inhoud === 'object' && body.inhoud ? body.inhoud : {};
      if (JSON.stringify(inh).length > 4_000_000) return json({ fout: 'Te veel inhoud.' }, 413);
      await store.setJSON('inhoud', inh);
      return json({ ok: true });
    }
    case 'lk-toetsen': {
      if (!isLeerkracht) return nietLk();
      const lijstT = await toetsen();
      const { blobs } = await store.list({ prefix: 'toets/' });
      const resultaten = {};
      await Promise.all(blobs.map(async b => {
        const [, t, l] = b.key.split('/');
        const rec = await store.get(b.key, { type: 'json' }); if (!rec) return;
        const toets = lijstT.find(x => x.id === t);
        if (toets && !rec.ingeleverd) { const b2 = beoordeel(toets, rec.antwoorden); Object.assign(rec, { tussenstand: true, score: b2.score, max: b2.max, per: b2.per }); }
        (resultaten[t] = resultaten[t] || {})[l] = rec;
      }));
      return json({ toetsen: lijstT, resultaten, nu: Date.now() });
    }
    case 'bewaar-toets': {
      if (!isLeerkracht) return nietLk();
      const t = body.toets; if (!t || !t.id || !t.titel) return json({ fout: 'Toets onvolledig.' }, 400);
      const lijstT = await toetsen();
      const k = lijstT.findIndex(x => x.id === t.id);
      if (k >= 0) lijstT[k] = t; else lijstT.push(t);
      await store.setJSON('toetsen', lijstT);
      return json({ ok: true });
    }
    case 'verwijder-toets': {
      if (!isLeerkracht) return nietLk();
      await store.setJSON('toetsen', (await toetsen()).filter(x => x.id !== body.toetsId));
      const { blobs } = await store.list({ prefix: `toets/${body.toetsId}/` });
      await Promise.all(blobs.map(b => store.delete(b.key)));
      return json({ ok: true });
    }
    case 'toets-reset': {
      if (!isLeerkracht) return nietLk();
      await store.delete(toetsKey(body.toetsId, body.leerlingId));
      return json({ ok: true });
    }
    default:
      return json({ fout: 'Onbekende actie' }, 400);
  }
};

export const config = { path: '/api' };
