(function(){
  const frame=document.getElementById('app');
  function boot(){
    try{
      const d=frame.contentDocument,w=frame.contentWindow;
      if(!d||!w)return;
      const mapEl=d.querySelector('.map');
      if(!mapEl||!mapEl._leaflet_map)return;
      const map=mapEl._leaflet_map;
      if(d.getElementById('locateMeBtn'))return;
      const btn=d.createElement('button');
      btn.id='locateMeBtn';
      btn.type='button';
      btn.textContent='موقعي';
      btn.title='تحديد موقعي الحالي';
      btn.style.cssText='position:absolute;z-index:1000;top:10px;left:10px;border:1px solid #355174;background:#10233b;color:#fff;border-radius:10px;padding:9px 12px;font:700 11px Tahoma,Arial,sans-serif;box-shadow:0 8px 20px rgba(0,0,0,.3);cursor:pointer';
      mapEl.style.position='relative';
      mapEl.appendChild(btn);
      let marker=null;
      let circle=null;
      btn.onclick=function(){
        if(!w.navigator?.geolocation){alert('تحديد الموقع غير مدعوم في هذا المتصفح.');return;}
        btn.disabled=true;btn.textContent='جارٍ التحديد...';
        w.navigator.geolocation.getCurrentPosition(pos=>{
          const lat=pos.coords.latitude,lng=pos.coords.longitude;
          map.setView([lat,lng],16,{animate:true});
          if(marker)map.removeLayer(marker);
          if(circle)map.removeLayer(circle);
          marker=w.L.marker([lat,lng]).addTo(map).bindPopup('موقعي الحالي').openPopup();
          circle=w.L.circle([lat,lng],{radius:Math.max(pos.coords.accuracy||30,20),weight:1}).addTo(map);
          btn.disabled=false;btn.textContent='موقعي';
        },err=>{
          btn.disabled=false;btn.textContent='موقعي';
          const msg=err.code===1?'اسمح للمتصفح بالوصول إلى الموقع ثم أعد المحاولة.':err.code===2?'تعذر تحديد موقعك حاليًا.':'انتهت مهلة تحديد الموقع.';
          const t=d.createElement('div');t.textContent=msg;t.style.cssText='position:absolute;z-index:1001;top:50px;left:10px;max-width:260px;background:#10253d;color:#fff;border:1px solid #345777;padding:9px 11px;border-radius:10px;font:11px Tahoma,Arial,sans-serif;';mapEl.appendChild(t);setTimeout(()=>t.remove(),3500);
        },{enableHighAccuracy:true,timeout:12000,maximumAge:30000});
      };
    }catch(e){console.error('location enhancement',e)}
  }
  frame.addEventListener('load',()=>{boot();setTimeout(boot,800);setTimeout(boot,1800);setInterval(boot,2000)});
})();
