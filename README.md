# Folio personal portfolio

## Hosting

Deploy this portfolio only to the owner's Vercel account, `kajal-tiwaris-projects`, using `Kajaltiwari892/New_portfolio`. Production: https://kajal-portfolio-brown.vercel.app. The owner explicitly requested removal from ChatGPT Sites; do not recreate or publish a Sites deployment. `vercel.json` configures the Vite build and direct `/admin` access. Firebase continues to provide authentication and the analytics database independently of hosting.

## Private portfolio analytics

The `/admin` route uses Firebase Google sign-in and Firestore rules restricted to `kanjal55567@gmail.com`. See [the implementation plan](ADMIN_ANALYTICS_PLAN.md) and [setup status and verification](FIREBASE_SETUP.md). Basic activity collection starts automatically on the approved production hostname, without a consent prompt. Browser privacy preferences, previous declines, localhost, and owner/admin visits remain excluded. Owner login and visitor-to-dashboard delivery were verified on Vercel; App Check remains in monitoring mode, not enforcement. The public navbar's **Stats** page remains GitHub activity.

Run `node --test tests/analytics.test.mjs tests/analytics-collector.test.mjs tests/contact.test.mjs tests/github.test.mjs` for regression tests. `npm run test:rules` checks database authorization in an isolated demo emulator and requires Java 21+. `/tests/admin-ui.html` is a local-only visual fixture with explicitly synthetic data; it is not included in the production build.

## Contact form and resume

The contact form sends JSON through [FormSubmit’s documented browser AJAX endpoint](https://formsubmit.co/ajax-documentation) to `kanjal55567@gmail.com`. It uses the activated canonical URL `https://kajal-portfolio-brown.vercel.app/`, rather than the visitor's current URL or hash. The sender's email is the reply-to address. A hidden honeypot is included; no CAPTCHA-disabling option is sent. A Vercel server relay was tested but rejected by FormSubmit with HTTP 403, so the deployed form uses its supported browser flow.

The browser has a 15-second network deadline. A success response requires explicit acceptance from the provider. There are no automatic retries, which could send duplicates after an uncertain timeout. Failed requests preserve the form fields, and duplicate clicks while sending are blocked.

The owner must click **ACTIVATE FORM** in the email from FormSubmit before inbox delivery works. Visitors do not activate anything. If FormSubmit requests activation for a new deployment origin, confirm the corresponding email once. An HTTP 200 alone is not treated as success: the response must explicitly accept the message and must not request activation. Tests mock provider responses; they do not establish inbox delivery. A direct email link remains available if the service fails. The older `public/thanks.html` remains for existing links but is no longer used by the form.

Run `node --test tests/contact.test.mjs` to check delivery handling and failure responses without sending email.

For browser checks, open `/tests/contact-ui.html#contact` on the Vite development server. This isolated fixture simulates accepted, failed, and activation responses without contacting the email service. It is excluded from the production build.

The navbar opens `public/assets/KajalTiwariResume.pdf` in a new tab. Replace that file to update the resume, or edit `profile.resume` in `src/portfolio-content.ts` to use another path.

The older implementation notes below are retained for reference; the current site is one continuous page with Home, About, Work, and Contact sections.

A responsive portfolio built with React, TypeScript, Vite, and Tailwind CSS v4. Five separate hash-routed pages share a compact header, footer, and persistent light/dark theme. The supplied PDF informed the warm paper, coral accents, soft pastel cards, editorial typography, and personal scrapbook direction. Its example people, hobbies, and projects are references, not facts about this portfolio's owner.

## Run locally

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. `npm run typecheck` checks TypeScript, `npm run build` checks types and creates `dist/`, and `npm run preview` serves the production build locally.

If the npm launcher is broken in the current Windows environment, run npm through Node:

```powershell
node 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' ci
node 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' run dev
```

## Pages and navigation

| Page | URL fragment | Content |
| --- | --- | --- |
| Home | `#/` | Compact introduction, original paper/browser illustration, and four destination cards |
| Work | `#/work` | Three working studies, category filters, interactive demos, and study descriptions |
| About | `#/about` | Draft introduction, three expandable skill areas, and an expandable four-step process timeline |
| Beyond work | `#/beyond` | Six illustrated board cards with full details or articles and locally saved hearts |
| Contact | `#/contact` | A local project-brief draft and copy action until real contact details are supplied |

Each fragment can be opened directly after the site's base URL. Native links preserve browser Back/Forward history without requiring server-side route rewrites. Page changes update the document title, return to the top, and move focus to the new heading after initial navigation. The skip link focuses the current main content without replacing its route fragment. Unknown fragments show a page-not-found view.

Legacy links remain supported: `#home`, `#work`, `#about`, and `#contact` open their matching pages; `#approach` opens About; `#notes` and `#/hobbies` open Beyond work; `#questions` opens Contact. An empty fragment opens Home. The parser also preserves the current route for `#main`.

## Working interactions

- **Taskboard:** add, move, delete, and reset tasks across three stages. Up to 40 tasks persist in this browser.
- **Focus timer:** choose 5, 15, 25, or 50 minutes; start, pause, and reset. A saved deadline restores elapsed time when the preview reopens.
- **Palette lab:** cycle through five curated palettes, preview each, and copy individual hex values. Selection is temporary.
- **Beyond work:** open six cards covering color, typography, an original drawing, and three complete articles about clarity, motion, and responsive content. Save or unsave each card using its heart; selections persist on this device.
- **Contact draft:** write up to 5,000 characters and copy the brief. It does not send a message.

Dialogs include keyboard behavior and focus restoration. Controls provide visible focus and feedback; layouts adapt to phones and desktop widths, and motion respects reduced-motion preferences.

## Component sources

The project contains real source components from the official registries:

- [shadcn/ui](https://ui.shadcn.com/docs/components): Button, Badge, Tabs, Dialog, Accordion, and Tooltip, backed by Radix primitives.
- Aceternity UI: [Timeline](https://ui.aceternity.com/components/timeline) for the About process and [Text Generate Effect](https://ui.aceternity.com/components/text-generate-effect) for the Home introduction. [Bento Grid](https://ui.aceternity.com/components/bento-grid) is installed but is not used by the current page layout.

Component headers retain registry source URLs. Adaptations include theme integration, reduced-motion support, animation cleanup, and responsive timeline measurements. The timeline's stock biography was removed; it describes a process rather than employment history. Motion powers transitions, and Lucide supplies icons.

## Where to edit

| File | Purpose |
| --- | --- |
| `src/App.tsx` | Five page layouts, navigation, title/focus handling, theme, and contact presentation |
| `src/lib/portfolio-router.ts` | Hash parsing, route links, and history subscription |
| `src/portfolio-content.ts` | Profile fields, study descriptions, process, and articles; older unused content exports remain available |
| `src/components/portfolio-pieces.tsx` | Project cards, study dialogs, mark, and local contact draft |
| `src/components/project-demos.tsx` | Taskboard, Focus timer, and Palette lab behavior |
| `src/components/beyond-board.tsx` | Six board cards, detail dialogs, original illustrations, and saved hearts |
| `src/components/ui/`, `src/components/aceternity/` | Official component sources and local adaptations |
| `src/tailwind.css` | Tailwind v4 imports, shadcn tokens, and animation utilities |
| `src/style.css` | Shared typography, controls, study previews, and responsive styles |
| `src/pages.css` | Warm page themes, route layouts, Home art, and navigation |
| `src/beyond-board.css` | Board, card, and detail-dialog presentation |
| `src/main.tsx` | React entry and stylesheet imports |
| `components.json`, `vite.config.ts`, `tsconfig*.json` | Registry configuration, React/Tailwind setup, and the `@/` alias |

## Personal content and privacy

`profile.name`, `email`, `github`, and `linkedin` remain `null`. The interface uses the neutral name "folio" and displays external profile links only when supplied. Setting an email changes the contact action to `mailto:`; it does not add a form submission service. The owner's photograph can be added later; no substitute portrait is included.

Taskboard, Focus timer, and Palette lab are working studies created for this site. The first-person copy, skill descriptions, process, and articles are drafts for the owner to review. No employers, employment dates, credentials, client projects, testimonials, or performance metrics have been invented. The Beyond board contains design experiments and editorial notes rather than unverified personal hobbies. Older FAQ and strength data remain in the content module but are not separate pages in this version.

There is no application backend, account system, analytics integration, or message-submission endpoint. Clipboard writes happen only after a copy action. Local storage contains:

| Key | Data |
| --- | --- |
| `portfolio-theme` | Light/dark preference |
| `portfolio-taskboard-v1` | Taskboard tasks |
| `portfolio-focus-v1` | Timer state |
| `portfolio-inspiration-saved-v1` | IDs of saved Beyond board cards |
| `portfolio-project-brief` | Contact draft |

These values belong to the site's browser origin. They are not encrypted or synchronized between devices; clearing the site's browser data removes them. Storage failures leave the interactions usable for the current visit. Google Fonts supplies DM Sans and Manrope through external requests; stored tasks and drafts are not included in those requests.
