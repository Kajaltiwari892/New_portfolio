import './style.css';
import { profile } from './content.js';
import { collageArt, projectArt } from './illustrations.js';
const dialogArt = projectArt.replaceAll('project-browser-', 'dialog-browser-');

const escape = (value) => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const icon = (name, size = 20) => {
  const paths = {
    arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
    down: '<path d="M12 5v14m-6-6 6 6 6-6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    moon: '<path d="M20.5 13.2A8.7 8.7 0 0 1 10.8 3.5a8.8 8.8 0 1 0 9.7 9.7Z"/>',
    code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    spark: '<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.spark}</svg>`;
};
const mark = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5v38M5 24h38M10.6 10.6l26.8 26.8M10.6 37.4l26.8-26.8" stroke="currentColor" stroke-width="7" stroke-linecap="round"/></svg>';
const validLink = value => { try { return new URL(value).protocol === 'https:'; } catch { return false; } };
const hasEmail = typeof profile.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email);
const socialLinks = [['GitHub', profile.github], ['LinkedIn', profile.linkedin]].filter(([,url]) => validLink(url));
const tools = [
  ['HTML', 'The structure', 'Semantic markup and accessible navigation.', 'html'],
  ['CSS', 'The personality', 'Responsive layouts, color, and the little details.', 'css'],
  ['JavaScript', 'The interactions', 'Small, useful moments that make a page feel alive.', 'js'],
  ['Vite', 'The workspace', 'A lightweight setup for building this portfolio.', 'vite'],
];
const details = [
  ['Clarity', 'Easy to find your way.', 'Simple navigation and a clear reading order.', 'clarity'],
  ['Personality', 'A little less ordinary.', 'Original illustrations and a playful visual language.', 'personality'],
  ['Care', 'Details that count.', 'Keyboard access, readable type, and reduced motion.', 'care'],
  ['Simplicity', 'Room to breathe.', 'A focused page without unnecessary distractions.', 'simplicity'],
];
const toolCards = list => list.map(([name,label,description,key]) => `<article class="tool-card"><span class="tool-icon ${key}" aria-hidden="true">${key === 'js' ? 'JS' : key === 'html' ? '&lt;/&gt;' : key === 'css' ? '#' : key === 'vite' ? 'ϟ' : icon(key === 'care' ? 'heart' : key === 'clarity' ? 'grid' : 'spark',24)}</span><div><h3>${name}</h3><span>${label}</span></div><p>${description}</p></article>`).join('');
const name = profile.name || 'Your name';

document.querySelector('#app').innerHTML = `
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="page-frame">
    <header class="site-header">
      <a class="brand" href="#home" aria-label="Home"><span class="brand-mark">${mark}</span><span>my space<span class="brand-period">.</span></span></a>
      <nav aria-label="Main navigation">
        <a class="active" href="#home" aria-current="location">Home</a><a href="#work">Work</a><a href="#about">About</a><a href="#toolbox">Toolbox</a>
      </nav>
      <div class="header-actions"><a href="#contact" class="header-contact" aria-label="Get in touch">${icon('mail',18)}</a><button class="theme-toggle" aria-label="Switch to dark theme" aria-pressed="false">${icon('moon',18)}</button></div>
    </header>
    <main id="main">
      <section class="hero" id="home" aria-labelledby="hero-title">
        <div class="hello-badge"><span aria-hidden="true">✦</span> Hey, I’m ${escape(name)} <span class="wave" aria-hidden="true">✋</span></div>
        <h1 id="hero-title">A curious mind.<br>A little <span class="hand-underline">digital home<svg viewBox="0 0 360 15" preserveAspectRatio="none" aria-hidden="true"><path d="M3 10Q170-1 357 8M58 13Q224 5 331 12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></span>.</h1>
        <p class="hero-intro">${escape(profile.intro)}<br>Make yourself at home.</p>
        <div class="hero-links"><a class="button primary" href="#work">Explore my work ${icon('arrow',17)}</a><a class="text-link" href="#about">A little about me <span aria-hidden="true">↗</span></a></div>
        <div class="collage" role="img" aria-label="A playful collage of a code window, a handwritten make something good note, and a design sketch.">${collageArt}</div>
        <div class="hero-caption"><span class="tiny-cross" aria-hidden="true">+</span><span>A work in progress, just like me.</span><span class="tiny-cross" aria-hidden="true">+</span></div>
      </section>

      <section class="section work-section" id="work" aria-labelledby="work-title">
        <div class="section-top"><div><p class="eyebrow"><span class="section-dot"></span> The things I make</p><h2 id="work-title">Made with a little care.</h2></div><span class="section-index">01 / WORK</span></div>
        <article class="project-card">
          <button class="project-visual" data-project aria-label="Read the story of this portfolio">${projectArt}<span class="visual-open">${icon('arrow',20)}</span></button>
          <div class="project-info"><div class="project-meta"><span>PERSONAL PROJECT</span><span class="status-dot">In progress</span></div><h3>This little corner.</h3><p>A personal space for work, ideas, and everything in between. Built to be easy to explore, with a few details to make you smile.</p><div class="tags"><span>Web development</span><span>UI design</span></div><button class="text-link project-read" data-project>Behind the build ${icon('arrow',17)}</button></div>
        </article>
        <p class="work-footnote">More projects will find a home here. For now, you’re exploring the first one.</p>
      </section>

      <section class="section about-section" id="about" aria-labelledby="about-title">
        <div class="section-top"><div><p class="eyebrow"><span class="section-dot"></span> The person behind the pixels</p><h2 id="about-title">A little more human.</h2></div><span class="section-index">02 / ABOUT</span></div>
        <div class="bento-grid">
          <article class="about-card bento-card"><span class="card-symbol">${icon('spark',21)}</span><h3>Good things start<br>with curiosity.</h3><p>${escape(profile.about)}</p><div class="signature">a little curiosity goes a long way <span aria-hidden="true">↗</span></div></article>
          <article class="now-card bento-card"><div class="card-label"><span class="live-dot"></span> ON MY DESK RIGHT NOW</div><h3>Making this space<br>feel like me.</h3><p>Building, trying things out, and finding the right balance between simple and playful.</p><div class="desk-art" aria-hidden="true"><div class="note-paper"><span>note to self</span><strong>Keep making.<br>Keep learning.</strong><span class="note-star">✳</span></div><div class="paper-clip"></div><div class="pencil"></div></div></article>
          <a class="toolbox-teaser bento-card" href="#toolbox"><div class="teaser-copy"><span class="card-label">MY LITTLE TOOLBOX</span><h3>Ideas need good tools.</h3><p>A peek at what brings this site to life.</p></div><div class="mini-tools" aria-hidden="true"><span class="mini-js">JS</span><span class="mini-css">#</span><span class="mini-html">&lt;/&gt;</span></div><span class="card-arrow">${icon('arrow',19)}</span></a>
          <article class="details-card bento-card"><span class="card-label">A FEW THINGS I CARE ABOUT</span><div class="interest-list"><span>${icon('grid',16)} Clear ideas</span><span>${icon('heart',16)} Thoughtful details</span><span>${icon('spark',16)} A bit of personality</span></div></article>
        </div>
      </section>

      <section class="section toolbox-section" id="toolbox" aria-labelledby="toolbox-title">
        <div class="section-top"><div><p class="eyebrow"><span class="section-dot"></span> Tools & small decisions</p><h2 id="toolbox-title">Behind the scenes.</h2></div><span class="section-index">03 / TOOLBOX</span></div>
        <div class="toolbox-top"><p>A look at how this little website comes together.</p><div class="tabs" role="tablist" aria-label="Explore the toolbox"><button role="tab" id="tab-building" aria-controls="panel-building" aria-selected="true" tabindex="0">The building blocks</button><button role="tab" id="tab-details" aria-controls="panel-details" aria-selected="false" tabindex="-1">The little details</button></div></div>
        <div class="tool-grid" id="panel-building" role="tabpanel" aria-labelledby="tab-building" tabindex="0">${toolCards(tools)}</div>
        <div class="tool-grid" id="panel-details" role="tabpanel" aria-labelledby="tab-details" tabindex="0" hidden>${toolCards(details)}</div>
      </section>

      <section class="contact-section" id="contact" aria-labelledby="contact-title">
        <span class="contact-mark" aria-hidden="true">${mark}</span><p class="eyebrow">GOOD CONVERSATIONS START WITH A HELLO</p><h2 id="contact-title">Have an idea?<br>Let’s make it <em>something.</em></h2><p>A project, a collaboration, or just a friendly hello.</p>
        ${hasEmail ? `<div class="contact-actions"><a class="button primary" href="mailto:${escape(profile.email)}">Say hello ${icon('arrow',17)}</a><button class="copy-email" aria-label="Copy email address">${icon('mail',17)} Copy email</button></div><p class="contact-address">${escape(profile.email)}</p>` : '<p class="contact-pending">Email and social links are being added.</p>'}
        ${socialLinks.length ? `<div class="social-links">${socialLinks.map(([label,url])=>`<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${label} ${icon('arrow',15)}</a>`).join('')}</div>` : ''}
        <span class="contact-doodle doodle-one" aria-hidden="true">✧</span><span class="contact-doodle doodle-two" aria-hidden="true">✳</span>
      </section>
    </main>
    <footer><div><a class="footer-brand" href="#home">${mark}<span>my space.</span></a><span>A little corner, made with care.</span></div><a href="#home" class="back-top">Back to top <span aria-hidden="true">↑</span></a></footer>
  </div>
  <dialog class="project-dialog" aria-labelledby="dialog-title">
    <button class="dialog-close" aria-label="Close project details">${icon('close',21)}</button>
    <div class="dialog-art">${dialogArt}</div>
    <div class="dialog-copy"><p class="eyebrow">PERSONAL PROJECT · IN PROGRESS</p><h2 id="dialog-title">A home for the things I make.</h2><p class="dialog-lead">The website you’re exploring is a project in itself: a small, personal place that can grow with the work.</p><h3>The idea</h3><p>Make a portfolio feel like an invitation. Keep the navigation simple, give the work room to breathe, and add personality through original illustrations and small interactions.</p><h3>The details</h3><ul><li>A responsive layout for phones, tablets, and larger screens.</li><li>Light and dark themes, with your preference saved on this device.</li><li>Keyboard-friendly navigation, tabs, and project details.</li><li>Gentle motion that respects reduced-motion settings.</li></ul><h3>The build</h3><p>HTML, CSS, JavaScript, and Vite. The illustrations are original SVG artwork, and the site has no runtime framework or animation library.</p><div class="dialog-end"><span>Still evolving.</span><button class="button secondary dialog-done">Back to exploring ${icon('arrow',17)}</button></div></div>
  </dialog>
  <div class="toast" role="status" aria-live="polite"></div>
`;

const themeButton = document.querySelector('.theme-toggle');
let savedTheme;
try { savedTheme = localStorage.getItem('portfolio-theme'); } catch {}
let theme = savedTheme === 'dark' ? 'dark' : 'light';
const setTheme = value => {
  theme = value;
  document.documentElement.dataset.theme = value;
  document.querySelector('meta[name="theme-color"]').content = value === 'dark' ? '#17191f' : '#faf9f6';
  themeButton.innerHTML = icon(value === 'dark' ? 'sun' : 'moon', 18);
  themeButton.setAttribute('aria-label', `Switch to ${value === 'dark' ? 'light' : 'dark'} theme`);
  themeButton.setAttribute('aria-pressed', String(value === 'dark'));
};
setTheme(theme);
themeButton.addEventListener('click', () => {
  setTheme(theme === 'light' ? 'dark' : 'light');
  try { localStorage.setItem('portfolio-theme', theme); } catch {}
});

const tabs = [...document.querySelectorAll('[role="tab"]')];
const activateTab = tab => {
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  });
};
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
    if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
    if (event.key === 'Home') next = tabs[0];
    if (event.key === 'End') next = tabs[tabs.length - 1];
    if (next) { event.preventDefault(); activateTab(next); next.focus(); }
  });
});

const dialog = document.querySelector('.project-dialog');
let previousFocus;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  previousFocus = button;
  dialog.showModal();
  document.body.classList.add('dialog-open');
  dialog.scrollTop = 0;
}));
const closeDialog = () => dialog.close();
document.querySelector('.dialog-close').addEventListener('click', closeDialog);
document.querySelector('.dialog-done').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog();
});
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); previousFocus?.focus(); });

const navLinks = [...document.querySelectorAll('nav a')];
const sections = ['home','work','about','toolbox'].map(id => document.getElementById(id));
const updateActiveSection = () => {
  const y = window.scrollY + 160;
  let current = sections[0];
  sections.forEach(section => { if (section.offsetTop <= y) current = section; });
  navLinks.forEach(link => {
    const active = link.hash === '#' + current.id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
  });
};
let scrollFrame = 0;
const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(() => { updateActiveSection(); scrollFrame = 0; }); };
window.addEventListener('scroll', onScroll, { passive: true });
updateActiveSection();

let toastTimer;
document.querySelector('.copy-email')?.addEventListener('click', async () => {
  const toast = document.querySelector('.toast');
  try { await navigator.clipboard.writeText(profile.email); toast.textContent = 'Email copied. Say hello anytime!'; }
  catch { toast.textContent = 'Please select the email address below to copy it.'; }
  toast.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
});
if (import.meta.hot) import.meta.hot.dispose(() => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(scrollFrame); clearTimeout(toastTimer); document.body.classList.remove('dialog-open'); });

