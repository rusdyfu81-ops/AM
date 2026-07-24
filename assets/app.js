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

/* ---------- denah SVG: cubit, geser, ketuk ---------- */
let PLAN_ZONE='ALL', VB=null, BASE=null, SVGEL=null;
const clampN=(v,a,b)=>Math.max(a,Math.min(b,v));

function planBox(zone){
  if(zone==='ALL')return{x:0,y:0,w:PLAN_W,h:PLAN_H};
  const list=units().filter(u=>u.z===zone);
  if(!list.length)return{x:0,y:0,w:PLAN_W,h:PLAN_H};
  const x1=Math.min(...list.map(u=>u.x)),y1=Math.min(...list.map(u=>u.y));
  const x2=Math.max(...list.map(u=>u.x+u.w)),y2=Math.max(...list.map(u=>u.y+u.h));
  const p=44;return{x:x1-p,y:y1-p,w:(x2-x1)+p*2,h:(y2-y1)+p*2};
}
function elAspect(){
  if(!SVGEL)return PLAN_H/PLAN_W;
  const r=SVGEL.getBoundingClientRect();
  return (r.width&&r.height)?r.height/r.width:PLAN_H/PLAN_W;
}
/* lebarkan kotak agar rasionya sama dengan frame — supaya tidak ada bagian terpotong
   dan gerakan cubit/geser memetakan satu banding satu */
function fitBox(b){
  const a=elAspect();let w=b.w,h=b.h;
  if(h/w<a)h=w*a;else w=h/a;
  return{x:b.x+b.w/2-w/2,y:b.y+b.h/2-h/2,w,h};
}
function applyVB(v,smooth){
  const minW=BASE.w/16, maxW=BASE.w*1.08;
  let w=clampN(v.w,minW,maxW), h=w*elAspect();
  const pad=Math.max(BASE.w,BASE.h)*.28;
  let x=clampN(v.x,BASE.x-pad,BASE.x+BASE.w+pad-w);
  let y=clampN(v.y,BASE.y-pad,BASE.y+BASE.h+pad-h);
  VB={x,y,w,h};
  if(!SVGEL)return;
  SVGEL.style.transition=smooth?'none':'';
  SVGEL.setAttribute('viewBox',`${x} ${y} ${w} ${h}`);
  SVGEL.classList.toggle('lbl',w<=560);
  const z=BASE.w/w;
  const zl=document.getElementById('zlvl');if(zl)zl.textContent=z.toFixed(1)+'×';
}
function zoomBy(f,cx,cy){
  const r=SVGEL.getBoundingClientRect();
  const px=cx==null?.5:(cx-r.left)/r.width, py=cy==null?.5:(cy-r.top)/r.height;
  const ax=VB.x+px*VB.w, ay=VB.y+py*VB.h;
  const nw=VB.w/f, nh=nw*elAspect();
  applyVB({x:ax-px*nw,y:ay-py*nh,w:nw,h:nh});
}
function focusUnit(code,zoom){
  const u=unit(code);if(!u||!SVGEL)return;
  const a=elAspect(), pad=Math.max(u.w,u.h)*(zoom||2.8);
  applyVB({x:u.x+u.w/2-pad,y:u.y+u.h/2-pad*a,w:pad*2,h:pad*2*a});
}
function gestures(svg){
  let mode=0,sx=0,sy=0,sVB=null,sDist=0,sMid=null,lastTap=0;
  const R=()=>svg.getBoundingClientRect();
  const dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
  const mid=t=>({x:(t[0].clientX+t[1].clientX)/2,y:(t[0].clientY+t[1].clientY)/2});
  const toSvg=(cx,cy)=>{const r=R();return{x:VB.x+(cx-r.left)/r.width*VB.w,y:VB.y+(cy-r.top)/r.height*VB.h}};

  svg.addEventListener('touchstart',e=>{
    const t=e.touches;
    if(t.length===1){mode=1;sx=t[0].clientX;sy=t[0].clientY;sVB={...VB};
      const now=Date.now();
      if(now-lastTap<300){zoomBy(2,sx,sy);mode=0}
      lastTap=now;
    }else if(t.length===2){mode=2;sDist=dist(t);sMid=toSvg(mid(t).x,mid(t).y);sVB={...VB}}
  },{passive:true});

  svg.addEventListener('touchmove',e=>{
    const t=e.touches,r=R();
    if(mode===1&&t.length===1){
      e.preventDefault();
      const dx=(t[0].clientX-sx)/r.width*sVB.w, dy=(t[0].clientY-sy)/r.height*sVB.h;
      applyVB({x:sVB.x-dx,y:sVB.y-dy,w:sVB.w,h:sVB.h},true);
    }else if(mode===2&&t.length===2){
      e.preventDefault();
      const nw=sVB.w*(sDist/dist(t)), nh=nw*elAspect();
      const m=mid(t),px=(m.x-r.left)/r.width,py=(m.y-r.top)/r.height;
      applyVB({x:sMid.x-px*nw,y:sMid.y-py*nh,w:nw,h:nh},true);
    }
  },{passive:false});
  svg.addEventListener('touchend',()=>{mode=0;svg.style.transition=''},{passive:true});

  /* desktop */
  svg.addEventListener('wheel',e=>{e.preventDefault();
    zoomBy(e.deltaY<0?1.18:1/1.18,e.clientX,e.clientY)},{passive:false});
  let drag=false,dx0=0,dy0=0,dVB=null;
  svg.addEventListener('mousedown',e=>{drag=true;dx0=e.clientX;dy0=e.clientY;dVB={...VB};svg.style.cursor='grabbing'});
  addEventListener('mousemove',e=>{if(!drag)return;const r=R();
    applyVB({x:dVB.x-(e.clientX-dx0)/r.width*dVB.w,y:dVB.y-(e.clientY-dy0)/r.height*dVB.h,w:dVB.w,h:dVB.h},true)});
  addEventListener('mouseup',()=>{drag=false;svg.style.cursor='';svg.style.transition=''});
}
function renderPlan(planEl,listEl,zone){
  if(zone)PLAN_ZONE=zone;
  const U=units();
  const full=PLAN_ZONE==='ALL';
  const B0=planBox(PLAN_ZONE);
  let s=`<div class="plan-wrap"><svg class="plan-svg" viewBox="${B0.x} ${B0.y} ${B0.w} ${B0.h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Denah lantai 3">`;
  FIXTURES.forEach(f=>{const fz=Math.min(f.w/8,f.h/5);
    s+=`<rect class="fx" x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="3"/>`+
       `<text class="fxt" x="${f.x+f.w/2}" y="${f.y+f.h/2+fz/3}" font-size="${fz}" text-anchor="middle">${f.t}</text>`});
  U.forEach(u=>{
    const v=!isLive(u),cls=v?'vacant':u.k,dim=(!full&&u.z!==PLAN_ZONE)?' dim':'';
    const fz=Math.min(u.w/3.4,u.h/2.4);
    s+=`<rect class="u ${cls}${dim}" data-u="${u.u}" x="${u.x}" y="${u.y}" width="${u.w}" height="${u.h}" rx="2">`+
       `<title>${esc(u.u)} — ${esc(u.n||'kosong')}</title></rect>`+
       `<text class="ut${u.z==='G'?' big':''}${dim?' dim':''}" x="${u.x+u.w/2}" y="${u.y+u.h/2+fz/3}" font-size="${fz}" text-anchor="middle">${u.u.replace('L3-','')}</text>`;
  });
  s+=`</svg><div class="zoomctl">
    <button data-zm="in" aria-label="Perbesar">+</button>
    <button data-zm="out" aria-label="Perkecil">−</button>
    <button data-zm="fit" aria-label="Sesuaikan">⤢</button>
    <span id="zlvl">1.0×</span></div>
    <div class="planhint">Cubit untuk memperbesar · ketuk dua kali untuk zoom · geser untuk berpindah</div></div>`;
  planEl.innerHTML=s;
  SVGEL=planEl.querySelector('.plan-svg');
  BASE=fitBox(planBox(PLAN_ZONE));
  applyVB({...BASE});
  gestures(SVGEL);
  planEl.querySelectorAll('[data-zm]').forEach(b=>b.onclick=()=>{
    if(b.dataset.zm==='in')zoomBy(1.6);
    else if(b.dataset.zm==='out')zoomBy(1/1.6);
    else applyVB({...BASE})});
  if(listEl){
    const list=full?U:U.filter(u=>u.z===PLAN_ZONE);
    listEl.innerHTML=list.map(u=>{const v=!isLive(u);
      return `<button class="${v?'vacant':u.k}" data-u="${u.u}"><span class="lc">${u.u.replace('L3-','')}</span>
      <span><span class="ln">${esc(v?(u.nonaktif?'Tidak tampil':(u.sis==='renovasi'?'Renovasi':'Tersedia')):u.n)}</span><br>
      <span class="lk">${v?'—':esc(u.kat)+' · '+u.jam}</span></span></button>`}).join('');
  }
}
let _rz;
addEventListener('resize',()=>{clearTimeout(_rz);_rz=setTimeout(()=>{
  if(!SVGEL||!BASE)return;const c=VB?{x:VB.x+VB.w/2,y:VB.y+VB.h/2,w:VB.w}:null;
  BASE=fitBox(planBox(PLAN_ZONE));
  if(c)applyVB({x:c.x-c.w/2,y:c.y-c.w*elAspect()/2,w:c.w,h:0});else applyVB({...BASE})},160)});
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
    focusUnit(code);selectUnit(code);
    const el=document.querySelector('.plan-svg [data-u="'+code+'"]');
    if(el){el.classList.remove('flash');void el.getBoundingClientRect();el.classList.add('flash');
      clearTimeout(el._ft);el._ft=setTimeout(()=>el.classList.remove('flash'),2600)}},90);
}
function zonebar(el,onPick){
  el.innerHTML=`<button data-z="ALL" class="on">SEMUA · 200</button>`+
    Object.keys(ZONES).map(z=>{const n=SEED_UNITS.filter(u=>u.z===z).length;
      return `<button data-z="${z}">${z} · ${esc(ZONES[z])} · ${n}</button>`}).join('');
  el.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    el.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    onPick(b.dataset.z)});
}
