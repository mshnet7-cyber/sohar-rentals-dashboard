const SUPABASE_URL = 'https://jwspwefzpsleovjuifxi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jWtSwXizl3kJJ9f7x6_KQQ_vXcR9YTw';
const INGEST_URL = `${SUPABASE_URL}/functions/v1/sohar-rentals-ingest-v2`;

const SOURCES = [
  ['OpenSooq', 'https://om.opensooq.com/en/al-batinah/sohar/property/property-for-rent'],
  ['OpenSooq', 'https://om.opensooq.com/en/al-batinah/sohar/property/residential-for-rent'],
  ['OpenSooq', 'https://om.opensooq.com/en/al-batinah/sohar/property/apartments-for-rent'],
  ['OpenSooq', 'https://om.opensooq.com/en/al-batinah/sohar/property/villas-palaces-for-rent'],
  ['OpenSooq', 'https://om.opensooq.com/en/al-batinah/sohar/property/whole-buildings-for-rent'],
  ['OpenSooq', 'https://om.opensooq.com/en/al-batinah/sohar/property/commercial-for-rent'],
  ['OpenSooq', 'https://om.opensooq.com/en/al-batinah/sohar/property/shops-for-rent'],
  ['OpenSooq', 'https://om.opensooq.com/en/al-batinah/sohar/property/warehouses-for-rent'],
  ['OpenSooq', 'https://om.opensooq.com/en/al-batinah/sohar/property/lands-for-rent'],
  ['Sakan', 'https://om.sakan.co/en/rent/apartment/al-batinah-north-governor/sohar'],
  ['Sakan', 'https://om.sakan.co/en/rent/villa']
];

const H = {
  'user-agent': 'Mozilla/5.0 (compatible; SoharRentalIndexer/2.0)',
  'accept-language': 'ar,en;q=0.8'
};

const timeout = ms => ({ signal: AbortSignal.timeout(ms) });

function clean(x) {
  return String(x ?? '')
    .replace(/&nbsp;|\u00a0/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function abs(base, href) {
  try { return new URL(href, base).href; } catch { return ''; }
}

function stableId(source, url) {
  const u = new URL(url);
  const raw = `${source}|${u.hostname}|${u.pathname}`.toLowerCase();
  let h = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `${source.toLowerCase()}-${(h >>> 0).toString(36)}`;
}

function inferType(t) {
  t = t.toLowerCase();
  if (/warehouse|مخزن|مستودع/.test(t)) return 'مخزن';
  if (/office|مكتب/.test(t)) return 'مكتب';
  if (/shop|showroom|store|محل|معرض/.test(t)) return 'محل';
  if (/land|أرض|ارض/.test(t)) return 'أرض';
  if (/building|عمارة|عماره|مبنى/.test(t)) return 'مبنى';
  if (/villa|فيلا/.test(t)) return 'فيلا';
  if (/room|غرفة/.test(t)) return 'غرفة';
  if (/studio|استوديو/.test(t)) return 'استوديو';
  return 'شقة';
}

function inferPeriod(t) {
  t = t.toLowerCase();
  if (/daily|يومي/.test(t)) return 'يومي';
  if (/weekly|أسبوعي|اسبوعي/.test(t)) return 'أسبوعي';
  if (/yearly|annual|سنوي/.test(t)) return 'سنوي';
  if (/monthly|month|شهري/.test(t)) return 'شهري';
  return '';
}

function explicitPrice(t) {
  const s = String(t ?? '');
  const matches = [
    ...s.matchAll(/(?:OMR|ريال(?:\s+عماني)?|ر\.ع\.?)[^0-9]{0,8}([\d,]{1,8}(?:\.\d+)?)/gi),
    ...s.matchAll(/([\d,]{1,8}(?:\.\d+)?)[^0-9]{0,8}(?:OMR|ريال(?:\s+عماني)?|ر\.ع\.?)/gi)
  ];
  const values = matches.map(m => Number(String(m[1]).replace(/,/g, '')))
    .filter(n => n >= 5 && n <= 50000);
  return values.length ? String(values[0]) : '';
}

function area(t) {
  const areas = [
    'Al Tarif','At Turayf','Al Hambar','Alhambar','Al Multaqa',
    'Falaj Al Qabail','As Suwayhrah','Al Wiqaybah','Ghayl Ash Shabul',
    'Al Ghushbah','Awtib','Sohar Corniche','Al Rafaa','Al Awhi',
    'الطريف','الحمر','المتلقى','الملتقى','فلج القبائل','السويحرة',
    'الويقبية','غضي الشبول','الغشبة','عوتب','كورنيش صحار',
    'الرفعة','العوهي'
  ];
  const low = t.toLowerCase();
  for (const x of areas) if (low.includes(x.toLowerCase())) return x;
  return 'صحار';
}

function phone(t) {
  const tel = [...t.matchAll(/(?:href|data-href)=["']tel:\s*\+?([0-9][0-9\s-]{7,12})["']/gi)]
    .map(m => m[1].replace(/\D/g, ''))
    .find(d => /^\d{8}$/.test(d));
  if (tel) return tel;
  for (const m of t.matchAll(/(?:phone|mobile|contact|call|هاتف|جوال|اتصل|تواصل)[^0-9]{0,40}((?:\+968\s*)?(?:\d[\s-]?){8,10})/gi)) {
    const d = m[1].replace(/\D/g, '');
    if (/^\d{8}$/.test(d)) return d;
  }
  return '';
}

function published(html) {
  for (const r of [
    /datePublished["'\s:=>]+["']([^"']+)/i,
    /article:published_time["'\s]+content=["']([^"']+)/i
  ]) {
    const m = html.match(r);
    if (m && !Number.isNaN(Date.parse(m[1]))) return new Date(m[1]).toISOString();
  }
  return null;
}

function image(html, base) {
  const m =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image/i);
  return m ? abs(base, m[1]) : '';
}

function title(html, fallback) {
  const m =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i) ||
    html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return clean(m?.[1] || fallback).slice(0, 240);
}

function description(html, txt) {
  const m = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i);
  return clean(m?.[1] || txt.slice(0, 1000)).slice(0, 1200);
}

function allowedAdUrl(source, href) {
  try {
    const u = new URL(href);
    const p = u.pathname.replace(/\/$/, '').toLowerCase();
    if (source === 'OpenSooq') {
      if (!/opensooq\.com$/.test(u.hostname)) return false;
      if (!/\/al-batinah\/sohar\/property\//i.test(p)) return false;
      const last = p.split('/').filter(Boolean).at(-1) || '';
      if (/^(property-for-rent|residential-for-rent|apartments-for-rent|villas-palaces-for-rent|whole-buildings-for-rent|commercial-for-rent|shops-for-rent|warehouses-for-rent|lands-for-rent|for-rent)$/i.test(last)) return false;
      return p.split('/').filter(Boolean).length >= 7;
    }
    if (source === 'Sakan') {
      return /sakan\.co$/.test(u.hostname) && /\/property\/details\/\d+/i.test(p) && /sohar/i.test(p);
    }
    return false;
  } catch {
    return false;
  }
}

function candidates(html, source, base) {
  const out = [];
  const re = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) && out.length < 18) {
    const href = abs(base, m[1]);
    const label = clean(m[2]);
    if (!href || label.length < 4 || !allowedAdUrl(source, href)) continue;
    const hay = `${href} ${label}`;
    if (source === 'Sakan' && !/sohar/i.test(hay)) continue;
    if (!/(rent|للإيجار|إيجار|apartment|villa|room|studio|building|office|warehouse|shop|showroom|land|شقة|فيلا|غرفة|استوديو|مبنى|مكتب|مخزن|محل|معرض|أرض|ارض)/i.test(hay)) continue;
    out.push({ href, label });
  }
  return [...new Map(out.map(x => [x.href, x])).values()];
}

async function get(url, ms = 6000, retries = 2) {
  let last = '';
  for (let i = 0; i <= retries; i++) {
    try {
      const r = await fetch(url, { ...timeout(ms), headers: H, redirect: 'follow' });
      const html = await r.text();
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return html;
    } catch (e) {
      last = String(e?.message || e);
      if (i < retries) await new Promise(r => setTimeout(r, 350 * (i + 1)));
    }
  }
  throw new Error(last);
}

async function ingest(payload) {
  const r = await fetch(INGEST_URL, {
    ...timeout(12000),
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const txt = await r.text();
  if (!r.ok) throw new Error(`Supabase ingest ${r.status}: ${txt.slice(0, 800)}`);
  return txt ? JSON.parse(txt) : null;
}

async function workerPool(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      try { results[i] = { ok: true, value: await fn(items[i], i) }; }
      catch (e) { results[i] = { ok: false, error: String(e?.message || e) }; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length || 1) }, worker));
  return results;
}

async function scrapePage(source, page) {
  const main = await get(page, 6500, 2);
  const cs = candidates(main, source, page).slice(0, 6);
  const results = await workerPool(cs, 4, async c => {
    const html = await get(c.href, source === 'Sakan' ? 8000 : 6500, 2);
    const txt = clean(html);
    const n = title(html, c.label);
    const d = description(html, txt);
    const combined = `${n} ${d} ${c.href} ${txt.slice(0, 7000)}`;
    return {
      id: stableId(source, c.href),
      type: inferType(combined),
      name: n,
      area: area(combined),
      details: d,
      price: explicitPrice(combined),
      period: inferPeriod(combined),
      phone: phone(html.slice(0, 60000)),
      platform: source,
      url: c.href,
      photo: image(html, c.href),
      lat: null,
      lng: null,
      is_manual: false,
      manual_override: false,
      active: true,
      published_at: published(html)
    };
  });
  return {
    candidates: cs.length,
    ads: results.filter(x => x?.ok).map(x => x.value),
    skipped: results.filter(x => !x?.ok).map(x => x.error)
  };
}

module.exports = async function(req, res) {
  const started = new Date().toISOString();
  try {
    const results = await workerPool(SOURCES, 6, async ([source, page]) => {
      try { return { source, ...(await scrapePage(source, page)) }; }
      catch (e) { return { source, candidates: 0, ads: [], skipped: [], errors: [String(e?.message || e)] }; }
    });

    const stats = {};
    const all = [];
    for (const item of results.filter(x => x?.ok)) {
      const r = item.value;
      stats[r.source] ??= { pages: 0, candidates: 0, details: 0, skipped: 0, errors: [] };
      stats[r.source].pages++;
      stats[r.source].candidates += r.candidates || 0;
      stats[r.source].details += r.ads?.length || 0;
      stats[r.source].skipped += r.skipped?.length || 0;
      stats[r.source].errors.push(...(r.errors || []));
      all.push(...(r.ads || []));
    }

    const unique = [...new Map(all.map(a => [a.id, a])).values()];
    const result = await ingest({
      ads: unique,
      run: { started_at: started, details: { stats } }
    });

    return res.status(200).json({
      ok: true,
      scheduled: '06:00 UTC / 10:00 Asia-Muscat',
      status: result?.status || 'success',
      seen: result?.seen || unique.length,
      new_ads: result?.new_ads || 0,
      updated_ads: result?.updated_ads || 0,
      skipped_manual_override: result?.skipped_manual_override || 0,
      error_count: result?.error_count || 0,
      sources: stats,
      finished_at: result?.finished_at || new Date().toISOString()
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
};
