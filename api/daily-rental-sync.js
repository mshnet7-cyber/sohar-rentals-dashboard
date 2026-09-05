const SUPABASE_URL = 'https://jwspwefzpsleovjuifxi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jWtSwXizl3kJJ9f7x6_KQQ_vXcR9YTw';
const REST = `${SUPABASE_URL}/rest/v1`;
const SOURCES = [
  ['OpenSooq','https://om.opensooq.com/en/sohar/property-for-rent'],
  ['OpenSooq','https://om.opensooq.com/en/sohar/property-for-rent/apartments-for-rent'],
  ['OpenSooq','https://om.opensooq.com/en/sohar/property-for-rent/villas-for-rent'],
  ['OpenSooq','https://om.opensooq.com/en/sohar/property-for-rent/rooms-for-rent'],
  ['Sakan','https://sakan.co/en/properties-for-rent/sohar'],
  ['Sakan','https://sakan.co/en/apartments-for-rent/sohar'],
  ['Sakan','https://sakan.co/en/villas-for-rent/sohar']
];
const H = { 'user-agent':'Mozilla/5.0 (compatible; SoharRentalIndexer/1.0; +https://sohar-rentals.vercel.app/)', 'accept-language':'ar,en;q=0.8' };
function clean(x){return String(x??'').replace(/&nbsp;|\u00a0/gi,' ').replace(/&amp;/gi,'&').replace(/&#39;/gi,"'").replace(/&quot;/gi,'"').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()}
function abs(base,href){try{return new URL(href,base).href}catch{return ''}}
function escRx(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
function stableId(source,url){const u=new URL(url);const raw=`${source}|${u.hostname}|${u.pathname}`.toLowerCase();let h=2166136261;for(let i=0;i<raw.length;i++){h^=raw.charCodeAt(i);h=Math.imul(h,16777619)}return `${source.toLowerCase()}-${(h>>>0).toString(36)}-${u.pathname.split('/').filter(Boolean).pop()?.slice(0,70)||'listing'}`}
function inferType(t){t=t.toLowerCase();if(/warehouse|مخزن|مستودع/.test(t))return'مخزن';if(/office|مكتب/.test(t))return'مكتب';if(/building|عمارة|عماره|مبنى/.test(t))return'مبنى';if(/villa|فيلا/.test(t))return'فيلا';if(/room|غرفة/.test(t))return'غرفة';if(/studio|استوديو/.test(t))return'استوديو';return'شقة'}
function inferPeriod(t){t=t.toLowerCase();if(/daily|يومي/.test(t))return'يومي';if(/weekly|أسبوعي|اسبوعي/.test(t))return'أسبوعي';if(/yearly|annual|سنوي/.test(t))return'سنوي';return'شهري'}
function price(t){const vals=[...t.matchAll(/(?:OMR|ريال(?: عماني)?)[^0-9]{0,8}(\d{1,5}(?:\.\d+)?)/gi),...t.matchAll(/\b(\d{2,5})(?:\s*(?:OMR|ريال))?\b/gi)].map(m=>Number(m[1])).filter(n=>n>=5&&n<=50000);return vals.length?String(vals[0]):''}
function area(t){const a=['Al Tarif','At Turayf','Al Hambar','Alhambar','Al Multaqa','Falaj Al Qabail','As Suwayhrah','Al Wiqaybah','Ghayl Ash Shabul','Al Ghushbah','Awtib','Sohar Corniche','الطريف','الحمر','المتلقى','الملتقى','فلج القبائل','السويحرة','الويقبية','غضي الشبول','الغشبة','عوتب','كورنيش صحار'];for(const x of a)if(new RegExp(escRx(x),'i').test(t))return x;return'صحار'}
function phone(t){const m=t.match(/(?:\+968\s*)?(?:\d[\s-]?){8,10}/);if(!m)return'';const d=m[0].replace(/\D/g,'');return d.replace(/^968/,'').length===8?d.replace(/^968/,''):''}
function published(html){const ms=[/datePublished["'\s:=>]+["']([^"']+)/i,/article:published_time["'\s]+content=["']([^"']+)/i,/published_time["'\s:=>]+["']([^"']+)/i];for(const r of ms){const m=html.match(r);if(m&&!Number.isNaN(Date.parse(m[1])))return new Date(m[1]).toISOString()}return null}
function image(html,base){const m=html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)||html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image/i);return m?abs(base,m[1]):''}
function title(html,fallback){const a=html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)||html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);return clean(a?.[1]||fallback).slice(0,240)}
function description(html){const m=html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i);return clean(m?.[1]||'').slice(0,1200)}
function candidates(html,source,base){const out=[];const re=/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;let m;while((m=re.exec(html))&&out.length<40){const href=abs(base,m[1]);const label=clean(m[2]);if(!href||label.length<5)continue;if(source==='OpenSooq'&&!/opensooq\.com/i.test(href))continue;if(source==='Sakan'&&!/sakan\.co/i.test(href))continue;if(!/(rent|للإيجار|إيجار|apartment|villa|room|studio|building|office|warehouse|شقة|فيلا|غرفة|استوديو|مبنى|مكتب|مخزن)/i.test(`${href} ${label}`))continue;if(/javascript:|mailto:|#/.test(href))continue;out.push({href,label})}return [...new Map(out.map(x=>[x.href,x])).values()]}
async function get(url){const r=await fetch(url,{headers:H,redirect:'follow'});const html=await r.text();if(!r.ok)throw new Error(`HTTP ${r.status}`);return html}
async function rest(path,opts={}){const r=await fetch(`${REST}/${path}`,{...opts,headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json',Prefer:'return=representation',...(opts.headers||{})}});const txt=await r.text();if(!r.ok)throw new Error(`Supabase ${r.status}: ${txt.slice(0,500)}`);return txt?JSON.parse(txt):null}
async function writeRun(row){try{return await rest('sohar_ingestion_runs',{method:'POST',body:JSON.stringify(row)})}catch(e){return null}}
module.exports = async function handler(req,res){
  const started=new Date().toISOString();
  const current=await rest('sohar_ads?select=id,url,first_seen,published_at,active');
  const existing=new Map((current||[]).map(x=>[String(x.id),x]));
  const ads=[];const stats={};
  for(const [source,page] of SOURCES){stats[source]??={pages:0,candidates:0,details:0,errors:[]};stats[source].pages++;
    try{
      const main=await get(page);const cs=candidates(main,source,page).slice(0,12);stats[source].candidates+=cs.length;
      for(const c of cs){try{const html=await get(c.href);const txt=clean(html);const n=title(html,c.label);if(!n)continue;const d=description(html)||txt.slice(0,900);const a={id:stableId(source,c.href),type:inferType(`${n} ${d}`),name:n,area:area(`${n} ${d}`),details:d,price:price(`${n} ${d} ${txt.slice(0,4000)}`),period:inferPeriod(`${n} ${d} ${txt.slice(0,4000)}`),phone:phone(txt.slice(0,20000)),platform:source,url:c.href,photo:image(html,c.href),lat:null,lng:null,is_manual:false,manual_override:false,active:true,last_seen:new Date().toISOString(),published_at:published(html)};const old=existing.get(a.id);a.first_seen=old?.first_seen||a.last_seen;if(!a.published_at)a.published_at=old?.published_at||null;ads.push(a);stats[source].details++}catch(e){stats[source].errors.push(String(e.message||e))}}
    }catch(e){stats[source].errors.push(String(e.message||e))}
  }
  const unique=[...new Map(ads.map(a=>[a.id,a])).values()];
  const startedRun={started_at:started,source:'all',status:'running',seen_count:unique.length,inserted_count:0,updated_count:0,error_count:0,details:{stats}};
  try{
    for(let i=0;i<unique.length;i+=25){const chunk=unique.slice(i,i+25);await rest('sohar_ads?on_conflict=id',{method:'POST',body:JSON.stringify(chunk),headers:{Prefer:'resolution=merge-duplicates,return=minimal'}})}
    const inserted=unique.filter(a=>!existing.has(a.id)).length;const updated=unique.length-inserted;
    startedRun.status='success';startedRun.inserted_count=inserted;startedRun.updated_count=updated;startedRun.finished_at=new Date().toISOString();startedRun.details={stats,source_count:Object.keys(stats).length};await writeRun(startedRun);
    return res.status(200).json({ok:true,scheduled:'06:00 UTC / 10:00 Asia-Muscat',seen:unique.length,new_ads:inserted,updated_ads:updated,sources:stats,finished_at:startedRun.finished_at});
  }catch(e){startedRun.status='error';startedRun.error_count=1;startedRun.finished_at=new Date().toISOString();startedRun.details={stats,error:String(e.message||e)};await writeRun(startedRun);return res.status(500).json({ok:false,error:String(e.message||e),seen:unique.length,sources:stats})}
}
