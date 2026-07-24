/* ============================================================
   Lapisan bersama — dipakai semua halaman
   Penyimpanan: localStorage kalau tersedia, kalau tidak jatuh ke
   memori (halaman tetap jalan, hanya tidak tersimpan antar halaman).
   ============================================================ */
const DB={
  ns:'msj_v1',
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
const jt=n=>'Rp '+(n/1e6).toLocaleString('id-ID',{maximumFractionDigits:0})+' juta';
const qs=k=>new URLSearchParams(location.search).get(k);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function baseURL(){return location.href.replace(/[^/]*$/,'')}

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

/* ---------- denah ---------- */
function arah(u){
  if(u.u.indexOf('K')>-1)return'Kios di tengah koridor, tepat seberang lift.';
  const r=parseInt(u.r.split('/')[0],10);
  if(r<=1)return'Deret depan sisi utara. Dari eskalator utama lantai 3, belok kiri, ikuti deretan sampai nomor kios.';
  if(r<=5)return'Sisi barat, tepat sebelum eskalator. Dari eskalator, jalan lurus lalu belok kanan.';
  if(r<=8)return'Sisi barat bagian dalam, dekat toilet dan lift.';
  return'Deret belakang sisi selatan. Dari eskalator utama, jalan lurus melewati atrium.';
}
function renderPlan(planEl,listEl){
  const U=units();let h='';
  const cell=u=>{const v=!isLive(u),lab=v?(u.nonaktif?'Tidak tampil':(u.sis==='renovasi'?'Renovasi':'Tersedia')):u.n;
    h+=`<button class="unit ${v?'vacant':u.k}" style="grid-column:${u.c};grid-row:${u.r}" data-u="${u.u}">
      <span class="cat-bar"></span><span class="code">${u.u}</span><span class="nm">${esc(lab)}</span></button>`};
  U.slice(0,6).forEach(cell);
  h+=`<div class="corridor" style="grid-row:4/5">· · · · · K O R I D O R · · · · ·</div>`;
  U.slice(6,14).forEach(cell);
  FIXTURES.forEach(f=>h+=`<div class="fixture" style="grid-column:${f.c};grid-row:${f.r}">${f.t}</div>`);
  h+=`<div class="corridor" style="grid-row:11/12">· · · · · K O R I D O R · · · · ·</div>`;
  U.slice(14).forEach(cell);
  planEl.innerHTML=h;
  if(listEl)listEl.innerHTML=U.map(u=>{const v=!isLive(u);
    return `<button class="${v?'vacant':u.k}" data-u="${u.u}"><span class="lc">${u.u}</span>
    <span><span class="ln">${esc(v?(u.nonaktif?'Tidak tampil':(u.sis==='renovasi'?'Renovasi':'Tersedia')):u.n)}</span><br>
    <span class="lk">${v?'—':esc(u.kat)+' · '+u.jam}</span></span></button>`}).join('');
}
function flashUnit(code){
  const pv=document.querySelector('.viewtog button[data-pv="plan"]');
  if(pv&&!pv.classList.contains('on'))pv.click();
  const pc=document.querySelector('.plan-card');if(pc)pc.scrollIntoView({behavior:'smooth',block:'center'});
  const el=document.querySelector('.unit[data-u="'+code+'"]');
  if(el){el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');
    clearTimeout(el._ft);el._ft=setTimeout(()=>el.classList.remove('flash'),2200)}
}
