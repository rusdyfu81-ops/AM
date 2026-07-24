/* ============================================================
   Lapisan bersama — dipakai semua halaman
   Penyimpanan: localStorage kalau tersedia, kalau tidak jatuh ke
   memori (halaman tetap jalan, hanya tidak tersimpan antar halaman).
   ============================================================ */
const DB={
  ns:'msj_v2',
  mem:{},
  ok:(function(){try{localStorage.setItem('_t','1');localStorage.removeItem('_t');return true}catch(e){return false}})(),
  get(k,d){try{if(!this.ok)return (k in this.mem)?this.mem[k]:d;
    const v=localStorage.getItem(this.ns+'.'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{if(!this.ok){this.mem[k]=v;return v}localStorage.setItem(this.ns+'.'+k,JSON.stringify(v))}catch(e){this.mem[k]=v}return v},
  wipe(){try{Object.keys(localStorage).filter(k=>k.indexOf(this.ns)===0).forEach(k=>localStorage.removeItem(k))}catch(e){}this.mem={}}
};
const clone=o=>JSON.parse(JSON.stringify(o));

/* ---------- state ---------- */
function units(){let u=DB.get('units',null);if(!u){u=clone(SEED_UNITS);DB.set('units',u)}return u}
function saveUnits(u){DB.set('units',u)}
function unit(code){return units().find(x=>x.u===code)}
function patchUnit(code,fn){const all=units();const u=all.find(x=>x.u===code);if(u){fn(u);saveUnits(all)}return u}
function cfg(){return Object.assign({},CFG_DEFAULT,DB.get('cfg',{}))}
function setCfg(patch){DB.set('cfg',Object.assign({},DB.get('cfg',{}),patch))}
function zeroLog(){let z=DB.get('zero',null);if(!z){z=clone(SEED_ZERO);DB.set('zero',z)}return z}
function saveZero(z){DB.set('zero',z)}
function reports(){return DB.get('reports',[])}
function addReport(r){const a=reports();a.unshift(Object.assign({t:Date.now()},r));DB.set('reports',a.slice(0,80))}
function neighbors(){return DB.get('nbrs',[])}
function addNeighbor(n){const a=neighbors();a.unshift(Object.assign({t:Date.now()},n));DB.set('nbrs',a.slice(0,80))}
function resetAll(){DB.wipe()}

/* ---------- util ---------- */
const isLive=u=>u.sis==='aktif'&&!u.nonaktif;
const RANK={sorotan:0,aktif:1,dasar:2};
const rp=n=>'Rp '+Number(n).toLocaleString('id-ID');
const jt=n=>{const m=n/1e6;return m>=1000?'Rp '+(m/1000).toLocaleString('id-ID',{maximumFractionDigits:2})+' miliar'
  :'Rp '+m.toLocaleString('id-ID',{maximumFractionDigits:0})+' juta'};
const qs=k=>new URLSearchParams(location.search).get(k);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function baseURL(){return location.href.replace(/[?#].*$/,'').replace(/[^/]*$/,'')}

let _tt;
function toast(m){let e=document.getElementById('toast');
  if(!e){e=document.createElement('div');e.id='toast';document.body.appendChild(e)}
  e.textContent=m;e.classList.add('on');clearTimeout(_tt);_tt=setTimeout(()=>e.classList.remove('on'),3900)}

function qrSvg(text,cells){
  const q=qrcode(0,'M');q.addData(text);q.make();
  return q.createSvgTag({cellSize:cells||4,margin:0,scalable:true});
}

/* ---------- topbar ---------- */
function topbar(opts){
  const c=cfg(),o=opts||{};
  return `<header class="topbar"><div class="topbar-in">
    <div class="brand"><a class="brand-mark" href="index.html">${esc(c.namaMall).toUpperCase()}</a>
    <span class="brand-floor">${esc(o.tag||c.lantai)}</span></div>
    ${o.search?`<div class="searchwrap">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F1EEE5" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
      <input id="q" type="search" placeholder="Cari toko atau barang — misal: kopi, apotek, hijab" autocomplete="off"></div>`:''}
  </div></header>
  ${o.bar?`<div class="demobar">${o.bar}</div>`:''}`;
}

/* ---------- arah ---------- */
const ZONA_ARAH={
 A:'Blok luar sisi utara, deret paling depan setelah pintu masuk utama.',
 B:'Sayap barat. Dari atrium tengah, ambil koridor kiri.',
 C:'Sayap timur. Dari atrium tengah, ambil koridor kanan.',
 D:'Blok tengah, mengelilingi atrium dan eskalator.',
 E:'Kios di tengah koridor, area terbuka dekat toilet dan lift.',
 F:'Deret selatan, sebelum area anchor tenant.',
 G:'Anchor tenant di sisi selatan, pintu masuknya lebar dan mudah terlihat.'};
function arah(u){return ZONA_ARAH[u.z]||'Lantai 3.'}

/* ---------- denah SVG ---------- */
let PLAN_ZONE='ALL';
function planBox(zone){
  if(zone==='ALL')return{x:0,y:0,w:PLAN_W,h:PLAN_H};
  const list=units().filter(u=>u.z===zone);
  if(!list.length)return{x:0,y:0,w:PLAN_W,h:PLAN_H};
  const x1=Math.min(...list.map(u=>u.x)),y1=Math.min(...list.map(u=>u.y));
  const x2=Math.max(...list.map(u=>u.x+u.w)),y2=Math.max(...list.map(u=>u.y+u.h));
  const p=44;return{x:x1-p,y:y1-p,w:(x2-x1)+p*2,h:(y2-y1)+p*2};
}
function renderPlan(planEl,listEl,zone){
  if(zone)PLAN_ZONE=zone;
  const U=units(),b=planBox(PLAN_ZONE),full=PLAN_ZONE==='ALL';
  const fs=Math.max(8,Math.round(b.w/60));
  let s=`<svg class="plan-svg ${full?'all':'zoom'}" viewBox="${b.x} ${b.y} ${b.w} ${b.h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Denah lantai 3">`;
  FIXTURES.forEach(f=>{s+=`<rect class="fx" x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="3"/>`+
    `<text class="fxt" x="${f.x+f.w/2}" y="${f.y+f.h/2+fs/3}" font-size="${fs*.85}" text-anchor="middle">${f.t}</text>`});
  U.forEach(u=>{
    const v=!isLive(u),cls=v?'vacant':u.k,dim=(!full&&u.z!==PLAN_ZONE)?' dim':'';
    s+=`<rect class="u ${cls}${dim}" data-u="${u.u}" x="${u.x}" y="${u.y}" width="${u.w}" height="${u.h}" rx="2">`+
       `<title>${esc(u.u)} — ${esc(u.n||'kosong')}</title></rect>`;
    if((!full&&u.z===PLAN_ZONE)||u.z==='G')
      s+=`<text class="ut" x="${u.x+u.w/2}" y="${u.y+u.h/2+fs/3}" font-size="${u.z==='G'?fs*1.05:fs}" text-anchor="middle">${u.u.replace('L3-','')}</text>`;
  });
  s+='</svg>';
  planEl.innerHTML=s;
  if(listEl){
    const list=full?U:U.filter(u=>u.z===PLAN_ZONE);
    listEl.innerHTML=list.map(u=>{const v=!isLive(u);
      return `<button class="${v?'vacant':u.k}" data-u="${u.u}"><span class="lc">${u.u.replace('L3-','')}</span>
      <span><span class="ln">${esc(v?(u.nonaktif?'Tidak tampil':(u.sis==='renovasi'?'Renovasi':'Tersedia')):u.n)}</span><br>
      <span class="lk">${v?'—':esc(u.kat)+' · '+u.jam}</span></span></button>`}).join('');
  }
}
function selectUnit(code){
  document.querySelectorAll('.plan-svg .u').forEach(e=>e.classList.toggle('sel',e.dataset.u===code));
}
function flashUnit(code){
  const u=unit(code);if(!u)return;
  const pv=document.querySelector('.viewtog button[data-pv="plan"]');
  if(pv&&!pv.classList.contains('on'))pv.click();
  const zb=document.querySelector('.zonebar button[data-z="'+u.z+'"]');
  if(zb&&!zb.classList.contains('on'))zb.click();
  const pc=document.querySelector('.plan-card');if(pc)pc.scrollIntoView({behavior:'smooth',block:'center'});
  setTimeout(()=>{
    const el=document.querySelector('.plan-svg [data-u="'+code+'"]');
    if(el){el.classList.remove('flash');void el.getBoundingClientRect();el.classList.add('flash');
      clearTimeout(el._ft);el._ft=setTimeout(()=>el.classList.remove('flash'),2400)}},80);
}
function zonebar(el,onPick){
  el.innerHTML=`<button data-z="ALL" class="on">SEMUA · 200</button>`+
    Object.keys(ZONES).map(z=>{const n=SEED_UNITS.filter(u=>u.z===z).length;
      return `<button data-z="${z}">${z} · ${esc(ZONES[z])} · ${n}</button>`}).join('');
  el.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    el.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    onPick(b.dataset.z)});
}
