(function(){
  const KEY='sohar_rental_followup_status_v1';
  const labels={'':'غير محدد','contacted':'تم التواصل','agreed':'وافق','no':'لا يريد','no_reply':'لا يوجد رد'};
  const colors={contacted:'#46a6ff',agreed:'#36d399',no:'#ff6b6b',no_reply:'#f6c85f','':'#9db0ca'};
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
  function save(x){try{localStorage.setItem(KEY,JSON.stringify(x))}catch(e){}}
  let state=load();
  function setupFilter(){
    const old=document.getElementById('statusFilter'); if(!old||document.getElementById('followupFilter')) return;
    old.id='phoneFilter'; old.options[0].textContent='كل الأرقام';
    const s=document.createElement('select'); s.id='followupFilter';
    s.innerHTML='<option value="">كل حالات المتابعة</option><option value="">غير محدد</option><option value="contacted">تم التواصل</option><option value="agreed">وافق</option><option value="no">لا يريد</option><option value="no_reply">لا يوجد رد</option>';
    old.parentNode.appendChild(s);
    s.addEventListener('change',renderStatuses);
  }
  function getRows(){return document.querySelectorAll('#tbody tr')}
  function renderStatuses(){
    setupFilter();
    const f=document.getElementById('followupFilter'); const wanted=f?f.value:'';
    getRows().forEach(tr=>{
      const first=tr.cells[0]; if(!first)return;
      const id=(first.textContent||'').trim();
      if(!id)return;
      let cell=tr.querySelector('.followup-cell');
      if(!cell){cell=tr.insertCell(-1);cell.className='followup-cell';}
      const current=state[id]||'';
      cell.innerHTML='';
      const sel=document.createElement('select'); sel.className='followup-select';
      Object.keys(labels).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=labels[k];if(k===current)o.selected=true;sel.appendChild(o)});
      sel.style.cssText='background:#0d1728;color:'+colors[current]+';border:1px solid #263653;border-radius:8px;padding:7px 8px;min-width:120px;font-weight:700';
      sel.onchange=function(){state[id]=this.value; if(!this.value) delete state[id]; save(state); renderSummary(); this.style.color=colors[this.value]||colors[''];};
      cell.appendChild(sel);
      if(wanted && current!==wanted) tr.style.display='none'; else tr.style.display='';
    });
    renderSummary();
  }
  function renderSummary(){
    let box=document.getElementById('followupSummary');
    if(!box){box=document.createElement('div');box.id='followupSummary';box.className='followup-summary';const panel=document.querySelector('.tablewrap');if(panel)panel.parentNode.insertBefore(box,panel)}
    const all=Object.values(state); const c={contacted:0,agreed:0,no:0,no_reply:0}; all.forEach(x=>{if(c[x]!=null)c[x]++});
    box.innerHTML='متابعة: <b>'+c.contacted+'</b> تم التواصل · <b>'+c.agreed+'</b> وافق · <b>'+c.no+'</b> لا يريد · <b>'+c.no_reply+'</b> لا يوجد رد · <b>'+((document.querySelectorAll('#tbody tr').length)-all.filter(x=>x).length)+'</b> غير محدد';
  }
  function addHead(){const th=document.querySelector('#tbody')?.closest('table')?.querySelector('thead tr');if(th&&!th.querySelector('.followup-head')){const x=document.createElement('th');x.className='followup-head';x.textContent='حالة المتابعة';th.appendChild(x)}}
  function init(){
    addHead();setupFilter();renderStatuses();
    const tb=document.getElementById('tbody'); if(tb){new MutationObserver(()=>{addHead();renderStatuses()}).observe(tb,{childList:true,subtree:true})}
  }
  const st=document.createElement('style');st.textContent='.followup-summary{margin:10px 0;padding:11px 13px;border:1px solid #263653;border-radius:10px;background:#111b2e;color:#9db0ca;font-size:13px}.followup-summary b{color:#edf3fb}.followup-cell{min-width:145px}.followup-head{min-width:145px}';document.head.appendChild(st);
  setTimeout(init,300);
})();