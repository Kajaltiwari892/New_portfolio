# Motion Portfolio

A Fizzi-inspired portfolio MVP with an original visual direction: real Three.js sculpture, GSAP scroll motion, floating UI windows and a color-changing project showcase.

## Run locally
```sh
npm install
npm run dev
```
Open the URL printed by Vite (normally http://127.0.0.1:5173).

## Production
```sh
npm run build
npm run preview
```
Deploy `dist/` to a static host such as Vercel. No environment variables or backend required.

## Make it yours
Edit `src/content.js` for your name, role, bio, email, social links and project details. Sample projects are explicitly labeled; replace them before a public launch. Set `live` and `source` URLs to enable real project links. Replace the previews in `src/main.js` with your project screenshots or custom scenes. `PLAN.md` documents the content journey and MVP scope.

Reduced motion disables scroll pinning and continuous animation. WebGL failures fall back to a CSS visual. On small screens, the project stage becomes a normal section with buttons instead of a pinned scroll experience.

Inspiration: https://fizzi-demo.vercel.app/ and https://github.com/Kajaltiwari892/Fizzi. No reference source or branded assets are copied.
