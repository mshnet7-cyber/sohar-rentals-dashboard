(() => {
  const OBS='2026-09-02';
  const CAT={
    residential:'https://om.opensooq.com/en/al-batinah/sohar/property/apartments-for-rent',
    studio:'https://om.opensooq.com/en/al-batinah/sohar/property/apartments-for-rent/studio',
    commercial:'https://om.opensooq.com/en/al-batinah/sohar/property/commercial-for-rent',
    warehouse:'https://om.opensooq.com/en/al-batinah/sohar/property/warehouses-for-rent',
    office:'https://om.opensooq.com/en/al-batinah/sohar/property/offices-for-rent',
    shop:'https://om.opensooq.com/en/al-batinah/sohar/property/shops-for-rent',
    land:'https://om.opensooq.com/en/al-batinah/sohar/property/lands-for-rent/industrial',
    villa:'https://om.opensooq.com/en/al-batinah/sohar/property/villas-palaces-for-rent',
    townhouse:'https://om.opensooq.com/en/al-batinah/sohar/property/townhouses-for-rent',
    rooms:'https://om.opensooq.com/en/al-batinah/sohar/property/shared-rooms-for-rent',
    chalet:'https://om.opensooq.com/en/al-batinah/sohar/property/farms-chalets-for-rent'
  };
  const add=(id,type,area,details,price,phone,platform,link,pub)=>rows.push({'#':id,'النوع':type,'المنطقة':area,'التفاصيل':details,'السعر (ر.ع)':price,'رقم التواصل':phone,'المنصة':platform,'رابط الإعلان':link,'تاريخ الرصد':OBS,'تاريخ النشر':pub});
  add(79,'مكتب','صحار سيتي سنتر','30م²، مفروش، أرضي، 5 أشخاص، شهري',429,'774212XX','السوق المفتوح',CAT.office,'2026-09-02 (قبل 12 ساعة)');
  add(80,'مستودعات ومصانع','مدائن صحار','8250م²، سنوي',1,'910000XX','السوق المفتوح',CAT.warehouse,'2026-09-02 (قبل 7 ساعات)');
  add(81,'مخزن','صناعية العوهي','1100م²، شهري',450,'993834XX','السوق المفتوح',CAT.warehouse,'2026-09-01 (أمس)');
  add(82,'محلات + شقق سكنية','حي الرفعة','42م²، 5 أبواب، سنوي',110,'972077XX','السوق المفتوح',CAT.shop,'2026-09-01 (أمس)');
  add(83,'محل','كورنيش صحار','70م²، شهري',300,'775558XX','السوق المفتوح',CAT.shop,'2026-09-01 (أمس)');
  add(84,'شقق','صحار','مبنى جديد، 4 شقق أرضية، 2 غرفة + 2 حمام، 115م²، شهري/سنوي للشركات والمستثمرين',140,'963036XX','السوق المفتوح',CAT.residential,'2026-09-02 (قبل 5 ساعات)');
  add(85,'شقة','صحار','130م²، غرفتان، الحمامات غير مذكورة، 120 ر.ع',120,'944447XX','السوق المفتوح',CAT.residential,'2026-09-02 (قبل 9 ساعات)');
  add(86,'شقة','صحار','110م²، غرفتان، الحمامات غير مذكورة، 150 ر.ع',150,'963616XX','السوق المفتوح',CAT.residential,'2026-09-01 (أمس)');
  add(87,'غرفة/إقامة مفروشة','صحار','44م²، غرفة + حمام، مفروشة، يومي/بالساعات للعوائل والعزاب، واتساب فقط',10,'947080XX','السوق المفتوح',CAT.rooms,'2026-09-01 (قبل 15 ساعة)');
  add(88,'استوديو','كورنيش صحار','80م²، غرفة + حمام، مفروش، يومي',1,'775244XX','السوق المفتوح',CAT.studio,'2026-09-02 (قبل 15 ساعة)');
  add(89,'شقة فندقية','غيل الشبول','120م²، أرض 300م²، غرفة + حمام، يومي: نصف يوم 25، كامل 30، مبيت 35',25,'932147XX','السوق المفتوح',CAT.chalet,'2026-09-02 (قبل 9 ساعات)');
  add(90,'استراحة','الوقيبة','120م²، أرض 600م²، 3 غرف، 4 حمامات، مفروشة، يومي',50,'920585XX','السوق المفتوح',CAT.chalet,'2026-09-02 (قبل 11 ساعة)');
  add(91,'أرض صناعية','صحار','1200م²، شهري',600,'933327XX','السوق المفتوح',CAT.land,'2026-09-02 (قبل 6 ساعات)');
  add(92,'أرض تجارية/سكنية/مخازن','قرب صحار','8000م²، موقع مميز، سنوي',10,'971449XX','السوق المفتوح',CAT.land,'2026-09-01 (قبل 16 ساعة)');
  add(93,'أرض صناعية','صحار','1500م²، للإيجار أو الاستثمار، شهري',450,'772475XX','السوق المفتوح',CAT.land,'2026-09-01 (أمس)');
  add(94,'مركز أعمال','صحار','مكاتب مجهزة + قاعات اجتماعات + كوفي، 600م²، مفروش، شهري',100,'964101XX','السوق المفتوح',CAT.office,'2026-09-02 (قبل 6 ساعات)');
  add(95,'تاون هاوس','صحار','212م²، 5 غرف، شهري',500,'967772XX','السوق المفتوح',CAT.townhouse,'2026-09-01 (أمس)');
  add(96,'تاون هاوس','صحار','3 غرف، 170 ر.ع، شهري؛ المساحة المنشورة 4م² تبدو غير منطقية، فتم الاحتفاظ بها كما وردت',170,'944490XX','السوق المفتوح',CAT.townhouse,'2026-09-01 (أمس)');
  add(97,'بيت','عوتب','250م²، أرض 300م²، 3 غرف، 3 حمامات، غير مفروش، سنوي',150,'941845XX','السوق المفتوح',CAT.villa,'2026-09-01 (أمس)');
  add(98,'استوديو','قرب كورنيش صحار','80م²، غرفة + حمام، نصف مفروش، شهري',130,'993579XX','السوق المفتوح',CAT.studio,'2026-09-01 (أمس)');
  add(99,'شقة','صحار','90م²، غرفتان، 165 ر.ع',165,'995935XX','السوق المفتوح',CAT.residential,'2026-09-01 (أمس)');
  add(100,'شقة','صحار','80م²، غرفتان، 75 ر.ع',75,'771787XX','السوق المفتوح',CAT.residential,'2026-09-01 (قبل 22 ساعة)');
  add(101,'شقة','صحار','165م²، غرفتان، 100 ر.ع',100,'726079XX','السوق المفتوح',CAT.residential,'2026-09-01 (أمس)');
  add(102,'غرفة','صحار','3م²، غرفة + حمام، شهري؛ يفضل طالب جامعي',47,'980887XX','السوق المفتوح',CAT.rooms,'2026-09-01 (قبل 14 ساعة)');
  add(103,'شقة للموظفات والطالبات','صحار','100م²، 3 غرف، حمامان، مفروشة، للنساء العمانيات فقط، شهري',55,'741141XX','السوق المفتوح',CAT.residential,'2026-09-01 (أمس)');
  add(104,'شاليه','صحار','غرفة نوم واحدة، يومي',45,'962880XX','السوق المفتوح',CAT.chalet,'2026-09-01 (أمس)');
  add(105,'فيلا','الصويحرة قرب جامعة صحار','350م²، أرض 600م²، 5 غرف، أكثر من 6 حمامات، شهري',330,'772662XX','السوق المفتوح',CAT.villa,'2026-09-01 (أمس)');
  add(106,'سكن/غرف مفروشة','صحار','سكن مفروش شهري، التفاصيل والمساحة غير موضحة في الفهرس',600,'967545XX','السوق المفتوح',CAT.rooms,'2026-09-01 (أمس)');
  add(107,'غرفتان + مطبخ','صحار','غرفتان، حمام ومطبخ، شهري، غير مفروش',80,'958905XX','السوق المفتوح',CAT.rooms,'2026-09-01 (أمس)');
  add(108,'شقة','صحار','130م²، غرفتان، 2 حمام غير مذكورين، 75 ر.ع',75,'771787XX','السوق المفتوح',CAT.residential,'2026-09-01 (قبل 22 ساعة)');
  // 108 is intentionally retained as the indexed listing; duplicate-looking rows are removed below by key.
  const seen=new Set(), kept=[];
  for(const r of rows){
    const key=[r['النوع'],r['المنطقة'],r['السعر (ر.ع)'],r['رقم التواصل'],r['التفاصيل']].join('|');
    if(seen.has(key)) continue; seen.add(key); kept.push(r);
  }
  rows.splice(0,rows.length,...kept);
  const statusKey=id=>'sohar-rent-status-v1:'+id;
  const getStatus=id=>localStorage.getItem(statusKey(id))||'';
  const setStatus=(id,s)=>{localStorage.setItem(statusKey(id),s); render(); updateStatusPanel();};
  const statuses=['تم التواصل','وافق','لا يريد','لا يوجد رد'];
  const countStatuses=()=>Object.fromEntries(statuses.map(s=>[s,rows.filter(r=>getStatus(r['#'])===s).length]));
  function updateStatusPanel(){
    let p=document.getElementById('statusPanel');
    if(!p){p=document.createElement('div');p.id='statusPanel';p.className='panel';p.style.marginBottom='18px';document.querySelector('.cards').after(p);}
    const c=countStatuses();
    p.innerHTML='<h3>حالات المتابعة المحفوظة على هذا الجهاز</h3><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">'+statuses.map(s=>`<div class="card" style="padding:12px"><div class="label">${s}</div><div class="value" style="font-size:22px">${c[s]}</div></div>`).join('')+'</div>';
  }
  const oldRender=window.render;
  window.render=function(){
    const query=q.value.trim().toLowerCase();
    const filtered=rows.filter(r=>{const text=[r['النوع'],r['المنطقة'],r['التفاصيل'],r['رقم التواصل'],r['المنصة']].join(' ').toLowerCase();const st=getStatus(r['#']);const ns=String(r['رقم التواصل']).includes('XX')?'mask':'full';return(!query||text.includes(query))&&(!typeFilter.value||r['النوع']===typeFilter.value)&&(!areaFilter.value||r['المنطقة']===areaFilter.value)&&(!platformFilter.value||r['المنصة']===platformFilter.value)&&(!statusFilter.value||ns===statusFilter.value);});
    document.getElementById('count').textContent=`النتائج: ${filtered.length}`;
    const tb=document.getElementById('tbody');tb.innerHTML='';
    filtered.forEach(r=>{const tr=document.createElement('tr');const n=String(r['رقم التواصل']);const cls=n.includes('XX')?'mask':'full';const price=r['السعر (ر.ع)']!==''?fmt(r['السعر (ر.ع)'])+' ر.ع':'—';const st=getStatus(r['#']);tr.innerHTML=`<td>${r['#']}</td><td>${esc(r['النوع'])}</td><td>${esc(r['المنطقة'])}</td><td>${esc(r['التفاصيل'])}</td><td>${price}</td><td class="num ${cls}">${esc(n)}</td><td>${esc(r['المنصة'])}</td><td>${esc(r['تاريخ الرصد']||'—')}</td><td>${esc(r['تاريخ النشر']||'—')}</td><td><a href="${escAttr(r['رابط الإعلان'])}" target="_blank" rel="noopener">فتح الإعلان ↗</a></td><td><select data-status-id="${r['#']}" style="min-width:120px"><option value="">— بدون حالة —</option>${statuses.map(x=>`<option ${st===x?'selected':''}>${x}</option>`).join('')}</select></td>`;tb.appendChild(tr);});
    document.querySelector('thead tr').innerHTML='<th>#</th><th>النوع</th><th>المنطقة</th><th>التفاصيل</th><th>السعر</th><th>رقم التواصل</th><th>المنصة</th><th>تاريخ الرصد</th><th>تاريخ النشر</th><th>الإعلان</th><th>الحالة</th>';
    const full=rows.filter(r=>!String(r['رقم التواصل']).includes('XX')).length;const masked=rows.length-full;const unique=new Set(rows.map(r=>String(r['رقم التواصل']))).size;const prices=rows.map(r=>Number(r['السعر (ر.ع)'])).filter(Number.isFinite);const avg=prices.length?prices.reduce((a,b)=>a+b,0)/prices.length:0;document.getElementById('total').textContent=fmt(rows.length);document.getElementById('full').textContent=fmt(full);document.getElementById('masked').textContent=fmt(masked);document.getElementById('unique').textContent=fmt(unique);document.getElementById('avg').textContent=fmt(avg)+' ر.ع';
  };
  document.getElementById('tbody').addEventListener('change',e=>{const id=e.target.getAttribute('data-status-id');if(id)setStatus(id,e.target.value);});
  window.render();updateStatusPanel();
})();