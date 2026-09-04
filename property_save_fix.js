(function(){
  const frame=document.getElementById('app');
  function boot(){
    try{
      const w=frame.contentWindow,d=frame.contentDocument;if(!w||!d?.body)return;
      w.saveProp=async function(enc){
        try{
          const id=decodeURIComponent(enc)||'manual-'+Date.now();
          const a={id,name:d.getElementById('pn')?.value?.trim()||'عقار يدوي',phone:d.getElementById('pp')?.value?.trim()||'',type:d.getElementById('py')?.value?.trim()||'شقة',area:d.getElementById('pv')?.value?.trim()||'',price:d.getElementById('pz')?.value?.trim()||'',period:d.getElementById('pe')?.value||'شهري',url:d.getElementById('pu')?.value?.trim()||'',details:d.getElementById('pd2')?.value?.trim()||'',active:true,is_manual:!enc,manual_override:!enc,platform:enc?'تعديل':'إضافة يدوية'};
          const pc=d.getElementById('pc');if(pc?.dataset.lat&&pc?.dataset.lng){a.lat=Number(pc.dataset.lat);a.lng=Number(pc.dataset.lng)}
          const f=d.getElementById('pi')?.files?.[0];
          if(f){const data=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f)});a.photo=(await w.api('upload',{id,dataUri:data,contentType:f.type||'image/jpeg'})).url}
          await w.api('upsert',{ad:a});
          w.D.ads=w.D.ads.filter(x=>String(x.id)!==String(a.id));w.D.ads.unshift(a);
          if(typeof w.render==='function')w.render();
          w.closeModal();w.toast('تم حفظ العقار بنجاح');
          try{await w.load()}catch(e){w.toast('تم الحفظ، لكن تعذر تحديث البيانات من الخادم')}
        }catch(e){console.error('property save fix',e);w.toast('تعذر حفظ العقار: '+(e?.message||e))}
      };
      [...d.querySelectorAll('.map')].forEach(mapEl=>{
        const map=mapEl._leaflet_map;if(!map||mapEl.dataset.locateBound==='1')return;mapEl.dataset.locateBound='1';
        const b=d.createElement('button');b.type='button';b.textContent='موقعي';b.title='تحديد موقعي الحالي';b.style.cssText='position:absolute;z-index:1000;top:10px;left:10px;border:1px solid #355174;background:#10233b;color:#fff;border-radius:10px;padding:9px 12px;font:700 11px Tahoma,Arial,sans-serif;box-shadow:0 8px 20px rgba(0,0,0,.3);cursor:pointer';
        b.onclick=()=>{if(!w.navigator.geolocation){w.alert('تحديد الموقع غير مدعوم');return}b.disabled=true;b.textContent='جارٍ التحديد...';w.navigator.geolocation.getCurrentPosition(p=>{const lat=p.coords.latitude,lng=p.coords.longitude;map.setView([lat,lng],16,{animate:true});if(mapEl.__loc)map.removeLayer(mapEl.__loc);mapEl.__loc=w.L.marker([lat,lng]).addTo(map).bindPopup('موقعي الحالي').openPopup();const pc=d.getElementById('pc');if(pc){pc.textContent='الإحداثيات: '+lat.toFixed(6)+', '+lng.toFixed(6);pc.dataset.lat=lat;pc.dataset.lng=lng}b.disabled=false;b.textContent='موقعي'},()=>{b.disabled=false;b.textContent='موقعي';w.alert('تعذر تحديد موقعك. تأكد من السماح للموقع في المتصفح.')},{enableHighAccuracy:true,timeout:12000,maximumAge:30000})};
        mapEl.style.position='relative';mapEl.appendChild(b);
      });
    }catch(e){console.error('property fix boot',e)}
  }
  frame.addEventListener('load',()=>{boot();setTimeout(boot,500);setTimeout(boot,1500);setInterval(boot,1000)});
})();
