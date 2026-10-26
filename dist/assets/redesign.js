// Exact published scene downloaded from the user-supplied Spline URL.
const sceneURL=new URL('./scene.splinecode?v=ed506348f4f7',import.meta.url).href;
const runtimeURL='https://cdn.spline.design/@splinetool/runtime@2.0.111/build/runtime.js';
const visual=document.querySelector('#hero-visual'), canvas=document.querySelector('#spline-canvas');
const toggle=document.querySelector('#scene-toggle'), status=document.querySelector('#scene-status');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let application,loading=false,ready=false,userPaused=false,inView=true,explicit=false;

// Constant render aspect ratio; scale the entire stage uniformly, never stretch its bitmap.
const stage=document.createElement('div');stage.className='spline-stage';canvas.before(stage);stage.append(canvas);
function sizeScene(){
 const width=visual.clientWidth,height=visual.clientHeight;if(!width||!height)return;
 // Mobile uses a portrait camera viewport, not a stretched landscape bitmap.
 const mobile=matchMedia('(max-width:700px)').matches;
 const renderWidth=mobile?900:1200,renderHeight=mobile?Math.round(900*height/width):900;
 stage.style.width=`${renderWidth}px`;stage.style.height=`${renderHeight}px`;
 const scale=Math.min(width/renderWidth,height/renderHeight);
 stage.style.transform=`translate(-50%,-50%) scale(${scale})`;
 if(ready)application.setSize(renderWidth,renderHeight);
}
sizeScene();
new ResizeObserver(()=>sizeScene()).observe(visual);
function syncPlayback(){if(!ready)return;(userPaused||!inView||document.hidden)?application.stop():application.play();}
function label(){toggle.textContent=userPaused?'Play 3D':'Pause 3D';toggle.setAttribute('aria-label',userPaused?'Play 3D animation':'Pause 3D animation');toggle.setAttribute('aria-pressed',String(userPaused));}
async function loadScene(){
 if(loading||ready)return;loading=true;visual.dataset.state='loading';toggle.disabled=true;toggle.textContent='Loading 3D';status.textContent='Loading your Spline scene…';
 let timeout;
 try{
  const {Application}=await Promise.race([import(runtimeURL),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('Runtime timeout')),20000)})]);clearTimeout(timeout);
  application=new Application(canvas,{htmlContentMode:'inline'});
  await Promise.race([application.load(sceneURL),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('Scene timeout')),25000)})]);clearTimeout(timeout);
  ready=true;visual.dataset.state='ready';sizeScene();status.textContent='Interactive 3D scene loaded.';
  userPaused=reduced.matches&&!explicit;label();syncPlayback();
 }catch(error){
  clearTimeout(timeout);application?.dispose();application=null;ready=false;visual.dataset.state='fallback';
  toggle.textContent='Retry 3D';toggle.setAttribute('aria-label','Retry loading the 3D scene');
  status.textContent='The 3D scene is unavailable. You can retry below.';
  console.info('Spline fallback active:',error.message);
 }finally{loading=false;toggle.disabled=false;}
}
toggle.addEventListener('click',()=>{explicit=true;if(!ready){loadScene();return;}userPaused=!userPaused;label();syncPlayback();});
const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;syncPlayback();},{rootMargin:'80px'});observer.observe(visual);
document.addEventListener('visibilitychange',syncPlayback);
reduced.addEventListener('change',()=>{if(reduced.matches&&ready){userPaused=true;label();syncPlayback();}});
canvas.addEventListener('webglcontextlost',()=>{ready=false;visual.dataset.state='fallback';toggle.textContent='Retry 3D';status.textContent='The 3D connection was interrupted. Retry to reconnect.';});
// Pointer events only on fine pointers; touch users retain vertical page scrolling.
if(matchMedia('(pointer:coarse)').matches)canvas.style.pointerEvents='none';
const saveData=navigator.connection?.saveData||['slow-2g','2g'].includes(navigator.connection?.effectiveType);
if(!reduced.matches&&!saveData){if('requestIdleCallback'in window)requestIdleCallback(()=>loadScene(),{timeout:2000});else setTimeout(loadScene,400);}
window.addEventListener('pagehide',()=>application?.stop());window.addEventListener('pageshow',syncPlayback);
// Native dialogs keep focus inside the open surface and restore it on close.
const menu=document.querySelector('#menu-toggle'),menuDialog=document.querySelector('#mobile-menu');
const reviewDialog=document.querySelector('#review-dialog');

const dialogAnimations=new WeakMap();
function openDialog(dialog){
 dialogAnimations.get(dialog)?.cancel();dialog.classList.remove('is-closing');
 if(!dialog.open)dialog.showModal();document.body.classList.add('has-dialog');
 if(!reduced.matches){const anim=dialog.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.22,.61,.36,1)'});dialogAnimations.set(dialog,anim);}
}
function closeDialog(dialog){
 if(!dialog.open||dialog.classList.contains('is-closing'))return;
 const current=getComputedStyle(dialog),from={opacity:current.opacity,transform:current.transform};
 dialogAnimations.get(dialog)?.cancel();dialog.classList.add('is-closing');
 const finish=()=>{dialog.close();dialog.classList.remove('is-closing');dialogAnimations.delete(dialog);};
 if(reduced.matches){finish();return;}
 const anim=dialog.animate([from,{opacity:0,transform:'translateY(-12px)'}],{duration:300,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
 dialogAnimations.set(dialog,anim);anim.finished.then(()=>{finish();anim.cancel();}).catch(()=>{});
}
for(const dialog of [menuDialog,reviewDialog]){
 dialog.querySelector('.dialog-close').addEventListener('click',()=>closeDialog(dialog));
 dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog(dialog);});
 dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('has-dialog');});
 dialog.addEventListener('click',e=>{if(e.target===dialog&&dialog===reviewDialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(dialog);}});
}
menu.addEventListener('click',()=>{openDialog(menuDialog);menu.setAttribute('aria-expanded','true');});
menuDialog.addEventListener('close',()=>{menu.setAttribute('aria-expanded','false');if(compact.matches)menu.focus({preventScroll:true});});
menuDialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeDialog(menuDialog)));
const compact=matchMedia('(max-width:1050px)');compact.addEventListener('change',()=>{if(!compact.matches&&menuDialog.open)closeDialog(menuDialog);});
const menuTabs=[...menuDialog.querySelectorAll('[role="tab"]')];
function selectMenuTab(button){menuTabs.forEach(b=>{const active=b===button;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;document.getElementById(b.getAttribute('aria-controls')).hidden=!active;});}
menuTabs.forEach((button,i)=>{
 button.addEventListener('click',()=>selectMenuTab(button));
 button.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?menuTabs.length-1:(i+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1)+menuTabs.length)%menuTabs.length;selectMenuTab(menuTabs[next]);menuTabs[next].focus();}});
});
const dropdowns=[...document.querySelectorAll('.nav-dropdown')];
const dropdownAnimations=new WeakMap();
function setDropdown(d,open){
 const panel=d.querySelector('.nav-panel');
 const from=d.open?{opacity:getComputedStyle(panel).opacity,transform:getComputedStyle(panel).transform}:{opacity:0,transform:'translateY(-8px)'};
 dropdownAnimations.get(d)?.cancel();
 d.querySelector('summary').setAttribute('aria-expanded',String(open));
 if(open){d.open=true;dropdowns.filter(other=>other!==d&&other.open).forEach(other=>setDropdown(other,false));}
 if(!d.open)return;
 if(reduced.matches){d.open=open;return;}
 const anim=panel.animate([from,{opacity:open?1:0,transform:open?'translateY(0)':'translateY(-8px)'}],{duration:open?320:220,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});
 dropdownAnimations.set(d,anim);anim.finished.then(()=>{if(!open)d.open=false;anim.cancel();dropdownAnimations.delete(d);}).catch(()=>{});
}
dropdowns.forEach(d=>d.querySelector('summary').addEventListener('click',e=>{e.preventDefault();setDropdown(d,d.querySelector('summary').getAttribute('aria-expanded')!=='true');}));
document.addEventListener('click',e=>dropdowns.forEach(d=>{if(d.open&&!d.contains(e.target))setDropdown(d,false);}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]'))dropdowns.forEach(d=>{if(d.open){setDropdown(d,false);d.querySelector('summary').focus({preventScroll:true});}});});
const track=document.querySelector('#review-track'),reviews=[...track.querySelectorAll('.review-shell')];
let activeReview=0;
const prev=document.querySelector('#reviews-prev'),next=document.querySelector('#reviews-next'),position=document.querySelector('.review-controls span');
function updateReviewPosition(){
 const step=reviews[1].offsetLeft-reviews[0].offsetLeft;
 activeReview=Math.max(0,Math.min(reviews.length-1,Math.round(track.scrollLeft/step)));
 position.textContent=String(activeReview+1).padStart(2,'0')+' / 05';
 prev.disabled=track.scrollLeft<5;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-5;
}
function scrollReviews(direction){const step=reviews[1].offsetLeft-reviews[0].offsetLeft;track.scrollBy({left:direction*step,behavior:reduced.matches?'instant':'smooth'});}
prev.addEventListener('click',()=>scrollReviews(-1));next.addEventListener('click',()=>scrollReviews(1));track.addEventListener('scroll',updateReviewPosition,{passive:true});new ResizeObserver(updateReviewPosition).observe(track);updateReviewPosition();
track.addEventListener('keydown',e=>{if(e.target===track&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();scrollReviews(e.key==='ArrowRight'?1:-1);}});
document.querySelectorAll('.read-review').forEach(button=>button.addEventListener('click',()=>{
 const card=button.parentNode.querySelector('.review-card');
 document.querySelector('#review-author').textContent=card.querySelector('img').alt;
 document.querySelector('#review-text').textContent=card.querySelector(':scope>p').textContent;
 document.querySelector('#review-source').href=card.href;openDialog(reviewDialog);
}));
// Arm below-fold items before observing; never animate already visible content backwards.
if(!reduced.matches){
 const enter=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('is-visible');enter.unobserve(entry.target);});},{threshold:0,rootMargin:'0px 0px 70px 0px'});
 for(const section of document.querySelectorAll('main>section:not(#hero):not(#partners):not(#stats)')){
  const items=[...section.querySelectorAll(':scope>div:first-child, .service-card, :scope#projects>div:nth-child(2)>a, :scope#process>div:nth-child(2)>div:not(.absolute), :scope#advantage>div:nth-child(2)>div')];
  items.forEach((el,i)=>{if(el.getBoundingClientRect().top<innerHeight)return;el.classList.add('reveal-item');el.style.setProperty('--reveal-delay',`${Math.min(i,3)*55}ms`);enter.observe(el);});
 }
 reduced.addEventListener('change',()=>{if(reduced.matches){enter.disconnect();document.querySelectorAll('.reveal-item').forEach(el=>el.classList.add('is-visible'));}});
}
// Header artwork enters left to right and exits in reverse without shifting navigation.
const header=document.querySelector('header');
let scrollQueued=false;
function updateHeader(){header.classList.toggle('brand-compact',scrollY>24);scrollQueued=false;}
window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateHeader);}},{passive:true});updateHeader();
const dismissLoader=()=>{document.documentElement.classList.remove('booting');header.classList.add('brand-ready');};
Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,900))]).then(()=>requestAnimationFrame(dismissLoader));
setTimeout(dismissLoader,1500);
// Image drift and pointer parallax have separate transform layers.
for(const card of document.querySelectorAll('#projects>div:nth-child(2)>a')){
 const img=card.querySelector('img');if(!img)continue;
 const layer=document.createElement('div');layer.className='project-image-layer';img.before(layer);layer.append(img);
 card.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType==='touch')return;const r=card.getBoundingClientRect();layer.style.setProperty('--px',`${(e.clientX-r.left)/r.width*10-5}px`);layer.style.setProperty('--py',`${(e.clientY-r.top)/r.height*8-4}px`);});
 card.addEventListener('pointerleave',()=>{layer.style.setProperty('--px','0px');layer.style.setProperty('--py','0px');});
}
const driftObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('drift-active',e.isIntersecting)));driftObserver.observe(document.querySelector('#projects'));
const faqAnimations=new WeakMap();
document.querySelectorAll('#faq button').forEach(b=>b.addEventListener('click',()=>{
 const answer=document.getElementById(b.getAttribute('aria-controls')),open=b.getAttribute('aria-expanded')!=='true';
 const height=answer.hidden?0:answer.getBoundingClientRect().height;
 const opacity=answer.hidden?'0':getComputedStyle(answer).opacity;
 faqAnimations.get(answer)?.cancel();b.setAttribute('aria-expanded',String(open));answer.hidden=false;answer.inert=!open;
 if(reduced.matches){answer.hidden=!open;return;}
 const target=answer.scrollHeight;
 const anim=answer.animate([{height:`${height}px`,opacity},{height:`${open?target:0}px`,opacity:open?1:0}],{duration:380,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});
 faqAnimations.set(answer,anim);anim.finished.then(()=>{answer.hidden=!open;anim.cancel();faqAnimations.delete(answer);}).catch(()=>{});
}));
// Published count-up values, observed on the live homepage after scrolling.
const targets=[150,99.9,24,50];
const stats=[...document.querySelectorAll('#stats .tabular-nums')];
function setStats(progress){stats.forEach((el,i)=>{const value=targets[i]*progress;el.firstChild.textContent=i===1?value.toFixed(1):Math.round(value);});}
setStats(1);
if(!reduced.matches){const counters=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)return;counters.disconnect();const start=performance.now();function step(now){const t=Math.min(1,(now-start)/1000);setStats(1-Math.pow(1-t,3));if(t<1)requestAnimationFrame(step);}requestAnimationFrame(step);},{threshold:.3});counters.observe(document.querySelector('#stats'));}
