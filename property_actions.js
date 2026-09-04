(function(){
  const frame=document.getElementById('app');
  function esc(v){return String(v??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]))}
  function digits(v){return String(v||'').replace(/[^0-9]/g,'')}
  function phoneFor(v){let p=digits(v);if(!p)return '';if(p.startsWith('00'))p=p.slice(2);if(p.length===8 && /^[79]/.test(p))p='968'+p;return p}
  function boot(){
    try{
      const w=frame.contentWindow,d=frame.contentDocument;if(!w||!d?.body||!w.D)return;
      if(!d.getElementById('propActionsStyle')){
        const s=d.createElement('style');s.id='propActionsStyle';s.textContent=`
          .prop-actions{display:flex;gap:5px;flex-wrap:wrap;align-items:center}
          .prop-actions .btn{padding:7px 9px;font-size:9px}
          .prop-details{display:grid;gap:10px}.prop-details-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
          .prop-detail{padding:9px;border:1px solid #244868;border-radius:11px;background:#0b1a2c}.prop-detail b{display:block;color:#42ddff;font-size:9px;margin-bottom:4px}.prop-detail span{font-size:11px}
          @media(max-width:650px){.prop-details-grid{grid-template-columns:1fr}}
        `;d.head.appendChild(s)
      }
      const rows=[...d.querySelectorAll('#prows tr')];
      rows.forEach(tr=>{
        if(tr.dataset.propActions==='1')return;
        const idText=tr.querySelector('td .muted')?.textContent||'';const m=idText.match(/#(.+)$/);if(!m)return;
        const id=m[1].trim(),a=(w.D.ads||[]).find(x=>String(x.id)===id);if(!a)return;
        const cell=tr.lastElementChild;if(!cell)return;
        const old=[...cell.querySelectorAll('button')];
        const wrap=d.createElement('div');wrap.className='prop-actions';
        const add=(label,cls,fn)=>{const b=d.createElement('button');b.className='btn '+(cls||'');b.textContent=label;b.onclick=fn;wrap.appendChild(b)};
        if(a.phone){
          add('واتساب','good',()=>{const p=phoneFor(a.phone);if(p)w.open('https://wa.me/'+p,'_blank');});
          add('اتصال','',()=>{const p=phoneFor(a.phone);if(p)w.location.href='tel:+'+p;});
        }
        add('تفاصيل','',()=>showDetails(a));
        add('مشاركة','cyan',()=>shareProperty(a));
        old.forEach(b=>wrap.appendChild(b));
        cell.innerHTML='';cell.appendChild(wrap);tr.dataset.propActions='1';
      });
      w.propShare=shareProperty;
      async function shareProperty(a){
        const base=w.location.origin+w.location.pathname;
        const url=base+'#property='+encodeURIComponent(String(a.id));
        const text=[a.name||'عقار',a.area||'',a.type||'',a.price?String(a.price)+' '+(a.period||''):''].filter(Boolean).join(' • ');
        try{
          if(w.navigator.share){await w.navigator.share({title:a.name||'صحار العقاري',text,url});w.toast?.('تمت مشاركة رابط العقار')}else{await w.navigator.clipboard.writeText(url);w.toast?.('تم نسخ رابط العقار')}
        }catch(e){try{await w.navigator.clipboard.writeText(url);w.toast?.('تم نسخ رابط العقار')}catch(_){w.prompt('انسخ رابط العقار',url)}}
      }
      function showDetails(a){
        const p=phoneFor(a.phone),o=typeof w.owner==='function'?w.owner(a):null,m=typeof w.mon==='function'?w.mon(a):null,b=typeof w.bench==='function'?w.bench(a):null,s=typeof w.score==='function'?w.score(a):null;
        const src=a.url?`<a href="${esc(a.url)}" target="_blank" rel="noopener" class="btn cyan">فتح الإعلان الأصلي</a>`:'';
        const contact=p?`<div class="actions-row"><button class="btn good" onclick="window.open('https://wa.me/${p}','_blank')">واتساب</button><a class="btn" href="tel:+${p}">اتصال</a><button class="btn cyan" onclick="propShare(${JSON.stringify(a.id)})">مشاركة</button></div>`:'';
        const map=a.lat&&a.lng?`<div class="prop-detail"><b>الموقع</b><span>${esc(a.lat)}, ${esc(a.lng)}</span></div>`:'';
        w.openModal('تفاصيل العقار — '+(a.name||'عقار'),`<div class="prop-details"><div class="prop-details-grid"><div class="prop-detail"><b>النوع</b><span>${esc(a.type||'—')}</span></div><div class="prop-detail"><b>المنطقة</b><span>${esc(a.area||'—')}</span></div><div class="prop-detail"><b>السعر</b><span>${esc(a.price||'—')} ${esc(a.period||'')}</span></div><div class="prop-detail"><b>شهري تقريبي</b><span>${m?Math.round(m)+' ر.ع':'—'}</span></div><div class="prop-detail"><b>مرجع السوق</b><span>${b?Math.round(b)+' ر.ع':'—'}</span></div><div class="prop-detail"><b>درجة الفرصة</b><span>${s!=null?s:'—'}</span></div><div class="prop-detail"><b>المالك</b><span>${esc(o?.owner_name||'غير مربوط')}</span></div><div class="prop-detail"><b>الهاتف</b><span>${esc(a.phone||'—')}</span></div>${map}</div><div class="prop-detail"><b>التفاصيل</b><span>${esc(a.details||'لا توجد تفاصيل')}</span></div>${a.photo?`<img src="${esc(a.photo)}" style="max-width:100%;max-height:280px;border-radius:12px;object-fit:contain">`:''}<div class="actions-row">${src}<button class="btn" onclick="closeModal()">إغلاق</button></div>${contact}</div>`)
      }
      const hash=w.location.hash;const hm=hash.match(/^#property=(.+)$/);if(hm){const a=(w.D.ads||[]).find(x=>String(x.id)===decodeURIComponent(hm[1]));if(a)setTimeout(()=>showDetails(a),300)}
    }catch(e){console.error('property actions',e)}
  }
  frame.addEventListener('load',()=>{boot();setInterval(boot,800)});
})();
