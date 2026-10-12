# Motion portfolio — content and MVP plan

## Direction
An expressive, playful developer portfolio inspired by Fizzi's floating 3D objects, oversized type, saturated palettes and scroll choreography. Original composition and assets; no soda branding or copied source. Coral, cream, ink, lavender and acid yellow. A glossy sculptural loop moves with the scroll, accompanied by floating project windows.

## Content journey
1. Opening: name, role, headline, short introduction, selected-work link. One memorable 3D scene, entrance animation and cursor parallax.
2. Work: sticky project stage with selectable projects, distinct palette and preview, project description, technologies, case study, live demo and repository links when supplied.
3. About: personal introduction, approach and skills. No invented career history, metrics or client claims.
4. Contact: clear invitation and supplied email/social links.

## Motion choreography
- Hero typography enters in a stagger; project windows float gently.
- A real Three.js object rotates, scales and travels as the visitor scrolls through the hero.
- GSAP ScrollTrigger drives section reveals and a pinned desktop project showcase. Scroll changes the selected project and palette; arrows and tabs also select projects.
- Project windows respond to pointer position. A continuous skills ticker bridges sections.
- Respect prefers-reduced-motion, support keyboard navigation and provide a CSS scene fallback if WebGL is unavailable.

## MVP scope
Responsive Vite application with Three.js and GSAP, configurable content in src/content.js, three clearly labeled sample projects, working case-study dialogs, accessible project selectors, desktop/mobile layouts, local preview and production build. Placeholder contact information is clearly identified and never sends to a made-up address.

## Content needed for personalization
Name, role, short bio, 3–5 projects (title, problem, contribution, technologies, screenshots, live URL and source URL), email and social links. The supplied Fizzi repository is an inspiration reference; ownership of it is not assumed.

## Later refinement
Replace sample previews with real screenshots/models, tune choreography to each project, add project-specific narratives and optional resume link. Test on real mobile devices before a public launch.
