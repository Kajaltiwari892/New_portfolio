import './style.css';
import { profile } from './content.js';

const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const hasEmail = typeof profile.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email);

document.querySelector('#app').innerHTML = `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <a class="wordmark" href="#top" aria-label="Portfolio home"><span class="brand-symbol" aria-hidden="true">✳</span><span>folio<span class="brand-dot">.</span></span></a>
    <nav aria-label="Main navigation">
      <a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a>
    </nav>
    <a class="header-link" href="#contact">Say hello <span aria-hidden="true">↗</span></a>
  </header>

  <main id="main">
    <section class="hero" id="home" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="small-star" aria-hidden="true">✳</span> A little corner of the internet</p>
        <h1 id="hero-title">Small details.<br>Big <em>ideas.</em></h1>
        <p class="intro">Hi, I’m <span>${escape(profile.name)}</span>.<br>A curious mind with a love for creating.</p>
        <a class="primary-link" href="#work">Explore my work ${arrow}</a>
        <div class="hero-note"><span class="note-line" aria-hidden="true"></span><p>A few things I’ve made.<br>A little about who I am.</p></div>
      </div>
      <figure class="portrait">
        <img src="/girl-portrait.png" alt="A miniature girl with dark hair, a black T-shirt and blue jeans, standing on an open palm and looking upward." width="834" height="1172" fetchpriority="high" />
        <figcaption><span>A different perspective.</span><span aria-hidden="true">↗</span></figcaption>
      </figure>
      <div class="hero-bottom"><span>Personal portfolio</span><a href="#work">Scroll to explore <span aria-hidden="true">↓</span></a><span>Made with curiosity</span></div>
    </section>

    <section class="work section" id="work" aria-labelledby="work-title">
      <div class="section-heading"><p class="eyebrow">01 / Selected work</p><h2 id="work-title">Things I’m working on<span>.</span></h2></div>
      <div class="work-empty"><span class="empty-symbol" aria-hidden="true">↗</span><div><h3>A space for what’s next.</h3><p>Projects will be added here soon.</p></div><span class="coming-soon">Coming soon</span></div>
    </section>

    <section class="about section" id="about" aria-labelledby="about-title">
      <div class="section-heading"><p class="eyebrow">02 / A little about me</p><h2 id="about-title">Always curious<span>.</span></h2></div>
      <div class="about-copy"><p>Good ideas start with a little curiosity. This is a place for my work, my experiments, and the things I learn along the way.</p><p class="muted">A more personal introduction is coming soon.</p></div>
    </section>

    <section class="contact section" id="contact" aria-labelledby="contact-title">
      <p class="eyebrow">03 / Get in touch</p><div class="contact-row"><h2 id="contact-title">Let’s make<br><em>something good.</em></h2>${hasEmail ? `<a class="contact-arrow" href="mailto:${escape(profile.email)}" aria-label="Send an email">↗</a>` : '<span class="contact-arrow" aria-hidden="true">↗</span>'}</div>
      ${hasEmail ? `<a class="email-link" href="mailto:${escape(profile.email)}">${escape(profile.email)}</a>` : '<p class="contact-note">Contact details coming soon.</p>'}
    </section>
  </main>
  <footer><a class="footer-brand" href="#top">folio.</a><span>A small space for big ideas.</span><a href="#top">Back to top ↑</a></footer>
`;

