from pathlib import Path
import re

p = Path('sohar_modern_crm_v2.html')
s = p.read_text(encoding='utf-8')

# 1) Add a mobile navigation bar so all views remain reachable when the sidebar is hidden.
if 'id="mobileNav"' not in s:
    marker = '</main></div><div id="modal"'
    nav = '''</main><nav id="mobileNav" class="mobile-nav" aria-label="التنقل"><button data-v="home">الرئيسية</button><button data-v="properties">العقارات</button><button data-v="owners">الملاك</button><button data-v="renters">المستأجرون</button><button data-v="matches">المطابقة</button><button data-v="map">الخريطة</button></nav><div id="modal"'''
    if marker not in s:
        raise SystemExit('mobile nav insertion point not found')
    s = s.replace(marker, nav, 1)

# 2) CSS for mobile nav and KPI click affordance.
if '.mobile-nav' not in s:
    css_marker = '.toast{position:fixed;'
    css = '''.mobile-nav{display:none;position:fixed;left:10px;right:10px;bottom:10px;z-index:4500;grid-template-columns:repeat(6,1fr);gap:5px;padding:6px;border:1px solid var(--l);border-radius:16px;background:rgba(6,17,30,.94);backdrop-filter:blur(16px);box-shadow:0 14px 40px rgba(0,0,0,.35)}.mobile-nav button{border:0;background:transparent;color:var(--m);padding:8px 4px;border-radius:10px;font-size:9px}.mobile-nav button.active{background:linear-gradient(135deg,rgba(107,120,255,.24),rgba(66,221,255,.14));color:#fff}.kpi[data-route]{cursor:pointer}@media(max-width:1180px){.mobile-nav{display:grid}.main{padding-bottom:82px}}'''
    if css_marker not in s:
        raise SystemExit('css insertion point not found')
    s = s.replace(css_marker, css + css_marker, 1)

# 3) Replace share URL so property links point to the canonical app root.
s = s.replace("const url=location.origin+location.pathname+'?property='+encodeURIComponent(String(a.id));", "const url=location.origin+'/?property='+encodeURIComponent(String(a.id));")

# 4) Add robust in-core navigation and canonical shared-property opening.
anchor = "document.querySelectorAll('.nav button').forEach(b=>b.onclick=()=>go(b.dataset.v));"
if anchor not in s:
    raise SystemExit('nav anchor not found')

if 'function bindCoreNavigation()' not in s:
    nav_js = r'''document.querySelectorAll('.nav button').forEach(b=>b.onclick=()=>go(b.dataset.v));
function bindCoreNavigation(){const routes={ka:'properties',ko:'owners',kn:'owners',kr:'owners',kt:'renters',kp:'properties'};Object.entries(routes).forEach(([id,v])=>{const n=$(id),c=n&&n.closest('.kpi');if(c&&!c.dataset.coreRoute){c.dataset.route=v;c.dataset.coreRoute='1';c.setAttribute('role','button');c.tabIndex=0;const open=()=>go(v);c.addEventListener('click',open);c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})}});document.querySelectorAll('#mobileNav button').forEach(b=>{if(!b.dataset.bound){b.dataset.bound='1';b.onclick=()=>go(b.dataset.v)}})}
function syncMobileNav(){document.querySelectorAll('#mobileNav button').forEach(b=>b.classList.toggle('active',location.hash.slice(1)===b.dataset.v||(!location.hash&&b.dataset.v==='home')))}
function openSharedProperty(){const id=new URLSearchParams(location.search).get('property');if(!id)return;const a=D.ads.find(x=>String(x.id)===String(id));if(!a)return;go('properties');setTimeout(()=>detailsProp(id),120)}
window.addEventListener('hashchange',()=>{const v=location.hash.slice(1);if(['home','properties','owners','renters','matches','map'].includes(v)){go(v);syncMobileNav()}});
bindCoreNavigation();
window.addEventListener('load',()=>setTimeout(()=>{bindCoreNavigation();syncMobileNav();openSharedProperty()},80));
'''
    s = s.replace(anchor, nav_js, 1)

p.write_text(s, encoding='utf-8')

# Ensure the wrapper only supplies its own share/install shell; core navigation is self-contained.
idx = Path('index.html')
x = idx.read_text(encoding='utf-8')
for name in ('location_enhancement.js','property_save_fix.js','property_actions.js'):
    x = re.sub(r'<script src="\./'+re.escape(name)+r'(?:\?v=[^"]+)?"></script>', '', x)
x = re.sub(r'v=20260905-\d+', 'v=20260905-0400', x)
idx.write_text(x, encoding='utf-8')

# Static safety checks.
assert 'function renderProps' in s
assert 'function detailsProp' in s
assert 'function bindCoreNavigation()' in s
assert 'function openSharedProperty()' in s
assert 'id="mobileNav"' in s
assert 'id="pLocate"' in s or 'موقعي الحالي' in s
assert 'property_actions.js' not in x
assert 'location_enhancement.js' not in x
assert 'property_save_fix.js' not in x

blocks = re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>', s, re.S)
Path('/tmp/sohar_crm.js').write_text('\n'.join(blocks), encoding='utf-8')
