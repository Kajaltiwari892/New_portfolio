# Portfolio implementation plan

## Current direction

The portfolio is organized as five separate pages with native hash navigation. A compact illustrated Home introduces the site, then visitors choose Work, About, Beyond work, or Contact. Warm paper, coral details, muted mint/lilac/yellow accents, original paper illustrations, and restrained motion follow the supplied PDF's editorial direction. A coordinated dark theme is available.

The PDF is an art and structure reference. Its personal examples do not establish the owner's identity, work history, hobbies, projects, or achievements.

## Implemented content structure

| Page | Content and behavior |
| --- | --- |
| Home (`#/`) | Brief introduction, animated supporting text, original illustration, and four destination cards |
| Work (`#/work`) | Taskboard, Focus timer, and Palette lab; All work/Useful tools/Design play filters; demo and study tabs |
| About (`#/about`) | Draft personal introduction, three skill accordions, and an expandable Understand/Explore/Make/Refine timeline |
| Beyond work (`#/beyond`) | Six illustrated cards: color, type/space, drawing, and three full editorial articles; detail dialogs and local save hearts |
| Contact (`#/contact`) | Local brief with a copy action; real email and social links appear only after they are supplied |

Unknown routes show a useful not-found page. Direct hash URLs, refreshes, and browser Back/Forward retain page navigation. Legacy section links map into the new pages: `#approach` to About, `#notes` and `#/hobbies` to Beyond work, `#questions` to Contact, and matching Home/Work/About/Contact fragments to their pages. Navigation updates the title, starts the page at the top, and focuses the heading. The skip link focuses main content while retaining the current route.

## Working studies and board

Taskboard supports adding, moving, deleting, and resetting tasks, with browser persistence and focus handling after changes. Focus timer supports four durations, pause/resume/reset, and a persisted deadline so reopening reflects elapsed time. Palette lab cycles five curated sets and copies hex values.

Each study has challenge, approach, and result copy. These are tools made for this portfolio, with no claims of commercial deployment or business metrics.

The Beyond board includes original CSS/SVG artwork and complete readable details. Each of its six cards opens a dialog and has a separate save/unsave heart. Saved card IDs and a visible saved count persist locally; no account or remote collection is involved. The three articles discuss clear interfaces, purposeful motion, and responsive content. They do not establish personal biography.

## Foundation and accessibility

React and TypeScript run through Vite, with Tailwind CSS v4 and portfolio-specific CSS. The current pages use official-source Aceternity Timeline and TextGenerateEffect, plus shadcn Button, Badge, Tabs, Dialog, Accordion, and Tooltip. Aceternity BentoGrid remains installed for future use but is not rendered in this layout. Component headers preserve source URLs.

The timeline's stock biography was removed. Reduced-motion preferences are handled by Motion configuration, the text effect, timeline, and CSS. The interface includes a skip link, active-page navigation, named controls, keyboard dialogs, and focus restoration. Route transitions reset page scroll; they do not promise restoration of each page's previous scroll position.

## Personalization still needed

1. Supply the real name, email, GitHub, and LinkedIn in `src/portfolio-content.ts`; all four remain `null`.
2. Review the first-person introduction, About copy, skill descriptions, process, and editorial articles.
3. Add the owner's photograph when supplied, with a suitable crop and alt text.
4. Add verified personal projects, links, roles, and outcomes. Keep the included tools identified as studies.
5. Replace or extend the Beyond board with confirmed personal interests when available.

No employers, employment dates, credentials, clients, testimonials, or results are fabricated. Unused older FAQ/strength exports remain in the content module; the current site has five routes rather than the earlier eight-section structure.

## Data and contact scope

Theme, tasks, timer state, saved board IDs, and the brief use browser local storage. Palette selection is temporary. Copy actions use the clipboard. The brief explicitly says that no message is sent; there is no submission endpoint, backend, or analytics integration. With a supplied email, the contact action opens the visitor's email client through `mailto:`.

Local values are not encrypted or synchronized. Clearing site data removes them. Google Fonts makes external font requests; the application does not transmit local task or draft content. README lists the exact storage keys.

## Validation scope

Use `npm run typecheck` and `npm run build` for implementation changes. Functional review covers all five direct routes, unknown routes, legacy aliases, Back/Forward, skip-link focus, heading/title updates, mobile navigation, dialogs, study controls and persistence, timer reopening, board hearts and articles, filters, theme, reduced motion, clipboard feedback, and contact-draft behavior. Publishing and verified personal content are separate from this local draft.