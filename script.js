(function(){
const $=s=>document.querySelector(s);
const home=$('#home'),info=$('#personal-info'),toast=$('#toast');
let timer;
function showToast(m){toast.textContent=m;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),3200)}
function showPage(p){
  const isInfo=p==='personal-info';
  home.style.display=isInfo?'none':'';
  info.classList.toggle('active',isInfo);
  try{history.replaceState(null,'',isInfo?'#personal-info':'#home')}catch(e){}
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-page="Personal Info"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showPage('personal-info')}));
document.querySelectorAll('[data-home]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showPage('home')}));
document.querySelectorAll('[data-soon]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showToast(a.dataset.soon+' page is coming soon.')}));
if(location.hash==='#personal-info')showPage('personal-info');

// Photo fallback
const img=$('#profileImage'),ph=$('#placeholder');
function noPhoto(){img.hidden=true;ph.hidden=false}
img.addEventListener('error',noPhoto);
if(img.complete&&img.naturalWidth===0)noPhoto();

// Particles
const canvas=$('#particles'),ctx=canvas.getContext('2d');
let dots=[];
function resize(){
  const r=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;
  canvas.width=w*r;canvas.height=h*r;canvas.style.width=w+'px';canvas.style.height=h+'px';
  ctx.setTransform(r,0,0,r,0,0);
  dots=Array.from({length:Math.min(55,Math.floor(w/24))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.5+.5}));
}
function animate(){
  const w=innerWidth,h=innerHeight;
  ctx.clearRect(0,0,w,h);
  for(let i=0;i<dots.length;i++){
    const p=dots[i];p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>w)p.vx*=-1;
    if(p.y<0||p.y>h)p.vy*=-1;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(113,205,255,.55)';ctx.fill();
    for(let j=i+1;j<dots.length;j++){
      const q=dots[j],d=Math.hypot(p.x-q.x,p.y-q.y);
      if(d<115){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(93,161,235,${.12*(1-d/115)})`;ctx.lineWidth=.7;ctx.stroke()}
    }
  }
  requestAnimationFrame(animate);
}
addEventListener('resize',resize);resize();animate();

// Typewriter intro
(function(){
  const sub=$('.hero-copy .subtitle');
  const els=['.eyebrow','.first-name','.last-name'].map(s=>$('.hero-copy '+s));
  if(!sub||els.some(e=>!e))return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){sub.classList.add('intro-visible');return}
  const speeds=[34,90,90],texts=els.map(e=>e.textContent.trim());
  els.forEach(e=>e.textContent='');
  let i=0;
  function next(){
    if(i>=els.length){sub.classList.add('intro-visible');return}
    const el=els[i],t=texts[i],s=speeds[i];let c=0;
    el.classList.add('typing-caret');
    (function tick(){
      el.textContent=t.slice(0,++c);
      if(c<t.length)setTimeout(tick,s);
      else{el.classList.remove('typing-caret');i++;setTimeout(next,180)}
    })();
  }
  next();
})();
})();
