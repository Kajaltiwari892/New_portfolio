# Folio — personal portfolio

A responsive editorial portfolio built with React, TypeScript, Vite, and Tailwind CSS v4. Light paper surfaces, blue accents, original interface illustrations, and restrained motion support eight sections: Home, Work, About, Strengths, Approach, Notes, Questions, and Contact. A persistent dark theme is also available.

## Run locally

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. `npm run typecheck` checks TypeScript, `npm run build` checks types and creates `dist/`, and `npm run preview` serves that production build locally.

If the npm launcher is broken in the current Windows environment, run npm through Node:

```powershell
node 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' ci
node 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' run dev
```

## What is implemented

- **Work:** three interactive studies with category filters, working demos, and challenge/approach/result descriptions in dialogs.
- **Taskboard:** add, move, delete, and reset tasks across three stages; up to 40 tasks, saved in this browser.
- **Focus timer:** 5-, 15-, 25-, and 50-minute sessions with start, pause, reset, and progress feedback. The saved deadline restores the correct remaining time when the preview reopens.
- **Palette lab:** cycle through five curated palettes, preview each in context, and copy individual hex values. Clipboard failures provide an alternative instruction.
- **About and Strengths:** an illustrated bento layout and three areas of focus.
- **Approach:** a four-step process timeline: Understand, Explore, Make, and Refine.
- **Notes and Questions:** three complete articles in dialogs and four expandable FAQ answers.
- **Contact:** a local project-brief draft with a copy action while an email address is unset.

The interface includes a skip link, scroll-aware navigation, keyboard controls, visible focus, dialog focus restoration, responsive layouts, and reduced-motion handling.

## Actual component sources

The app imports locally installed source components from the official registries:

- [shadcn/ui](https://ui.shadcn.com/docs/components): Button, Badge, Tabs, Dialog, Accordion, and Tooltip, backed by Radix primitives.
- Aceternity UI: [Bento Grid](https://ui.aceternity.com/components/bento-grid) for About, [Timeline](https://ui.aceternity.com/components/timeline) for Approach, and [Text Generate Effect](https://ui.aceternity.com/components/text-generate-effect) for the introduction.

Each component file retains its registry source URL. Local adaptations add theme integration, reduced-motion support, animation cleanup, and responsive timeline measurements. Timeline's stock biography was removed; its optional heading and description are caller-owned. Motion powers the animations, and Lucide supplies icons.

## Where to edit

| File | Purpose |
| --- | --- |
| `src/portfolio-content.ts` | Profile fields, study descriptions, strengths, process, articles, and FAQ |
| `src/App.tsx` | Eight-section layout, preview artwork, dialogs, navigation, theme, and contact draft |
| `src/components/project-demos.tsx` | Taskboard, Focus timer, and Palette lab behavior |
| `src/components/ui/` | Official shadcn source components |
| `src/components/aceternity/` | Official Aceternity source components and documented adaptations |
| `src/tailwind.css` | Tailwind v4 imports, shadcn tokens, and animation utilities |
| `src/style.css` | Portfolio art direction, light/dark themes, and responsive rules |
| `src/main.tsx` | React entry; imports Tailwind before the portfolio styles |
| `components.json` | Component registry configuration and aliases |
| `vite.config.ts`, `tsconfig*.json` | React/Tailwind setup and the `@/` to `src/` alias |

## Content and personal details

`profile.name`, `email`, `github`, and `linkedin` are deliberately `null`. The interface uses the neutral name “folio” and renders external profile links only when supplied. Setting an email changes the contact action to a `mailto:` link; it does not add a server-side form.

Taskboard, Focus timer, and Palette lab are working studies created for this portfolio, not claims of previous client projects. About copy, strengths, process, and articles are draft editorial content for the owner to review. No employment history, client names, testimonials, results metrics, or external project links have been invented. The user's own photograph can be added later; no substitute portrait is included.

## Local data and contact behavior

There is no application backend, account system, analytics integration, or message-submission endpoint. The contact draft does **not** send a message. Copy actions write to the clipboard only when clicked.

Local storage holds the theme (`portfolio-theme`), tasks (`portfolio-taskboard-v1`), timer state (`portfolio-focus-v1`), and contact draft (`portfolio-project-brief`). These values are local to the site's browser origin; they are not encrypted or synchronized between devices. Clearing this site's browser data removes them. Palette selection is temporary. Storage failures are handled so the interface remains usable.

The page loads DM Sans and Manrope from Google Fonts. Those font requests are external; the application does not include stored tasks or contact drafts in them.