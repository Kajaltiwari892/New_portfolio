import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile, projects } from './content.js';
gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const escape = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const previews = {
  orbit: `<div class="mock orbit"><div class="mock-nav"><b>◉ orbit</b><span>Workspace　↗</span></div><div class="orbit-body"><aside>Overview<br/><span>Projects</span><br/>Your team<br/>Notes<div class="mini-avatar">a.</div></aside><div class="orbit-main"><small>YOUR SPACE, YOUR PACE</small><h3>Good things<br/>are taking shape<span>✳</span></h3><div class="orbit-columns"><div><small>IN PROGRESS</small><article><i class="tile purple">✳</i><b>Something new</b><p>Make room for ideas.</p><span class="pill">Exploring</span></article></div><div><small>ON THE HORIZON</small><article><i class="tile yellow">↗</i><b>The next chapter</b><p>A little further forward.</p><span class="pill">Coming together</span></article></div></div></div></div></div>`,
  forma: `<div class="mock forma"><div class="mock-nav"><b>forma®</b><span>Objects　 About　 Bag (0)</span></div><div class="forma-body"><small>LESS, BUT BETTER.</small><h3>Objects for<br/>the everyday.</h3><div class="vase"><div></div></div><span class="forma-caption">THE CURVE COLLECTION　↗</span></div></div>`,
  frequency: `<div class="mock frequency"><div class="mock-nav"><b>frequency ≋</b><span>Discover　 Library</span></div><div class="frequency-body"><small>PRESS PLAY. GO SOMEWHERE.</small><h3>A feeling.<br/>On repeat.</h3><div class="record"><span>f.</span></div><div class="player"><span>↶　▶　↷</span><div></div><small>02:42</small></div></div></div>`
};

document.querySelector('#app').innerHTML = `
  <a class="skip" href="#work">Skip to projects</a>
  <header><a class="brand" href="#home"><span>✳</span> ${escape(profile.shortName)}<sup>®</sup></a><nav aria-label="Main navigation"><a href="#work">Work <span>03</span></a><a href="#about">About</a><a class="nav-contact" href="#contact">Let’s talk <span>↗</span></a></nav></header>
  <main>
  <section class="hero" id="home"><div class="hero-top"><p>${escape(profile.role)} / Portfolio</p><span class="edition">A WORK IN MOTION — 2026</span></div>
    <h1><span>IDEAS.</span><span>CODE.</span><span class="outline">CHARACTER.</span></h1>
    <div class="hero-art" aria-hidden="true"><div class="scene-fallback">✳</div><canvas id="scene"></canvas></div>
    <div class="floating-window window-one" aria-hidden="true"><div class="window-bar"><i></i><i></i><i></i><small>an idea, in progress</small></div><div class="window-inner"><span>hello,<br/>world<span class="tiny-star">✳</span></span><small>GOOD THINGS START WITH CURIOSITY.</small></div></div>
    <div class="floating-window window-two" aria-hidden="true"><div class="window-bar"><i></i><i></i><i></i><small>make something move</small></div><div class="window-inner code"><small>01　 const idea = curiosity;</small><small>02　 <em>build</em>(idea);</small><small>03　 // make it feel alive.</small><span>↗</span></div></div>
    <span class="hero-sticker" aria-hidden="true">A LITTLE<br/>EXTRA ✳</span>
    <div class="hero-bottom"><p>${escape(profile.intro)}</p><a class="round-link" href="#work">Explore my work <span>↓</span></a><small class="sample-note">MVP PREVIEW · SAMPLE CONTENT</small></div>
  </section>
  <div class="ticker" aria-hidden="true"><div>${[...profile.skills,...profile.skills].map(s=>`<span>${escape(s)} <i>✳</i></span>`).join('')}</div></div>
  <section class="work" id="work"><div class="work-stage"><div class="section-top"><span>01 / SELECTED WORK</span><span>A FEW IDEAS, BROUGHT TO LIFE.</span></div><div class="work-heading"><h2>Pick a <br/><em>different</em> perspective.</h2><p>Thoughtful interfaces.<br/>Playful details. A story in every project.</p></div>
    <div class="project-layout"><div class="project-copy"><span class="project-category"></span><h3 class="project-title"></h3><p class="project-description"></p><div class="tags"></div><button class="case-button">Explore the concept <span>↗</span></button><div class="project-links"></div><small class="project-note">ILLUSTRATIVE PROJECT / REPLACE WITH YOUR WORK</small></div><div class="preview-wrap"><div class="preview-blob" aria-hidden="true"></div><div class="project-preview"></div><span class="preview-sticker" aria-hidden="true">MADE WITH<br/>CURIOSITY ↗</span></div></div>
    <div class="project-controls"><div class="project-tabs" role="tablist" aria-label="Selected projects">${projects.map((p,i)=>`<button role="tab" id="project-tab-${i}" aria-controls="project-panel" aria-selected="${i===0}" data-project="${i}"><small>0${i+1}</small> ${escape(p.title)}</button>`).join('')}</div><div class="arrows"><span class="project-count"></span><button aria-label="Previous project">←</button><button aria-label="Next project">→</button></div></div><div class="scroll-hint">SCROLL TO EXPLORE <span>↓</span></div></div></section>
  <section class="about" id="about"><div class="section-top"><span>02 / THE PERSON BEHIND THE PIXELS</span><span>ALWAYS CURIOUS.</span></div><div class="about-layout"><div><h2>Serious about<br/>the craft.<br/><em>Playful</em> by nature.</h2><div class="about-stamp" aria-hidden="true">✳</div></div><div class="about-copy"><span class="eyebrow">HELLO, I’M ${escape(profile.name.toUpperCase())}.</span><p>${escape(profile.about)}</p><p class="muted">A portfolio should feel like the person behind it. This one makes space for thoughtful work and a little experimentation.</p><div class="skill-list"><span>THINGS I LOVE WORKING WITH</span><div>Interfaces <b>↗</b></div><div>Creative code <b>↗</b></div><div>Motion & interaction <b>↗</b></div></div></div></div></section>
  <section class="contact" id="contact"><div class="section-top"><span>03 / WHAT’S NEXT?</span><span>LET’S MAKE SOMETHING GOOD.</span></div><h2>Have an idea?<br/><em>Let’s talk.</em><span>↗</span></h2><div class="contact-bottom"><div>${profile.email?`<a class="email" href="mailto:${escape(profile.email)}">${escape(profile.email)} ↗</a>`:'<p class="email">Your next collaboration starts here.</p><small>Contact details coming soon.</small>'}</div><div class="socials">${profile.github?`<a href="${escape(profile.github)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>`:''}${profile.linkedin?`<a href="${escape(profile.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>`:''}<a href="#home">Back to top ↑</a></div></div><footer><span>${escape(profile.shortName)} / PORTFOLIO</span><span>BUILT WITH CURIOSITY. AND CODE.</span><span>© 2026</span></footer></section>
  </main><dialog aria-labelledby="dialog-title"><button class="dialog-close" aria-label="Close project">✕</button><span class="eyebrow">PROJECT CONCEPT / MVP PREVIEW</span><h2 id="dialog-title"></h2><div class="dialog-preview"></div><p class="dialog-detail"></p><div class="dialog-tags tags"></div></dialog>`;

let current = 0;
const stage = document.querySelector('.work-stage');
const panel = document.querySelector('.project-layout');
panel.id='project-panel'; panel.setAttribute('role','tabpanel');
function selectProject(index, animate=true) {
  current = (index+projects.length)%projects.length;
  const p=projects[current];
  document.querySelector('.project-category').textContent=p.category;
  document.querySelector('.project-title').textContent=p.title;
  document.querySelector('.project-description').textContent=p.description;
  document.querySelector('.tags').innerHTML=p.tags.map(t=>`<span>${escape(t)}</span>`).join('');
  document.querySelector('.project-preview').innerHTML=previews[p.type];
  document.querySelector('.project-count').textContent=`0${current+1} / 0${projects.length}`;
  document.querySelector('.project-links').innerHTML=[p.live&&`<a target="_blank" rel="noopener noreferrer" href="${escape(p.live)}">Live site ↗</a>`,p.source&&`<a target="_blank" rel="noopener noreferrer" href="${escape(p.source)}">Source code ↗</a>`].filter(Boolean).join('');
  panel.setAttribute('aria-labelledby',`project-tab-${current}`);
  document.querySelectorAll('[data-project]').forEach((el,i)=> {el.setAttribute('aria-selected',i===current);el.tabIndex=i===current?0:-1;});
  if(animate&&!reduced) {gsap.to(stage,{backgroundColor:p.color,color:p.ink,duration:.65});gsap.fromTo('.project-preview',{y:45,rotate:-5,opacity:0},{y:0,rotate:-3,opacity:1,duration:.65,ease:'power3.out'});gsap.fromTo('.project-copy',{y:18,opacity:0},{y:0,opacity:1,duration:.45});}
  else {stage.style.background=p.color;stage.style.color=p.ink;}
}
selectProject(0,false);
document.querySelectorAll('[data-project]').forEach(el=> {el.addEventListener('click',()=>selectProject(+el.dataset.project));el.addEventListener('keydown', e=> {if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();selectProject(e.key==='Home'?0:e.key==='End'?projects.length-1:current+(e.key==='ArrowRight'?1:-1));document.querySelector(`[data-project="${current}"]`).focus();}});});
document.querySelector('[aria-label="Previous project"]').onclick=()=>selectProject(current-1);
document.querySelector('[aria-label="Next project"]').onclick=()=>selectProject(current+1);
const dialog=document.querySelector('dialog');
document.querySelector('.case-button').onclick=()=> {const p=projects[current];dialog.querySelector('h2').textContent=p.title;dialog.querySelector('.dialog-detail').textContent=p.detail;dialog.querySelector('.dialog-preview').innerHTML=previews[p.type];dialog.querySelector('.dialog-tags').innerHTML=p.tags.map(t=>`<span>${escape(t)}</span>`).join('');dialog.showModal();};
document.querySelector('.dialog-close').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});

if (!reduced) {
 gsap.from('h1 > span',{yPercent:115,rotate:3,opacity:0,duration:1.1,stagger:.13,ease:'power4.out'});
 gsap.from('.hero-bottom,.hero-top',{opacity:0,y:15,delay:.6,duration:.8});
 gsap.from('.floating-window',{scale:.7,opacity:0,y:80,duration:1.4,delay:.4,stagger:.15,ease:'elastic.out(1,.8)'});
 gsap.to('.window-one',{y:-18,rotate:-9,duration:3,yoyo:true,repeat:-1,ease:'sine.inOut'});
 gsap.to('.window-two',{y:16,rotate:10,duration:3.5,yoyo:true,repeat:-1,ease:'sine.inOut'});
 gsap.to('.hero h1',{y:-90,opacity:.15,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
 gsap.to('.hero-sticker',{rotate:80,y:120,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
 gsap.utils.toArray('.about h2,.about-copy,.contact h2').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:.9,scrollTrigger:{trigger:el,start:'top 85%'}}));
 ScrollTrigger.matchMedia({'(min-width: 900px)':()=> {ScrollTrigger.create({trigger:'.work',start:'top top',end:'+=180%',pin:'.work-stage',onUpdate:self=>{const i=Math.min(projects.length-1,Math.floor(self.progress*projects.length));if(i!==current)selectProject(i);}});}});
}
document.querySelector('.preview-wrap').addEventListener('pointermove',e=>{if(reduced||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();gsap.to('.project-preview',{rotateY:((e.clientX-r.left)/r.width-.5)*12,rotateX:-((e.clientY-r.top)/r.height-.5)*8,duration:.6});});
document.querySelector('.preview-wrap').addEventListener('pointerleave',()=>gsap.to('.project-preview',{rotateY:0,rotateX:0,duration:.6}));
import('./scene.js').then(({createScene})=>createScene(document.querySelector('#scene'),reduced)).catch(()=>document.querySelector('#scene').style.display='none');
