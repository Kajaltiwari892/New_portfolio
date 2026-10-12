# Portfolio content and implementation plan

The current direction is a complete, modern editorial portfolio: light paper surfaces, blue accents, a clear reading order, useful small interactions, and an optional dark theme. The personal feel of the supplied heheboi.in reference informed the direction; the layout details, illustrations, studies, and editorial content belong to this implementation.

## Eight-section content structure

| Section | Implemented content and behavior |
| --- | --- |
| Home | Design-led introduction, animated supporting text, and links into Work and About |
| Work | Three working studies; All work/Productivity/Design tools filters; demo and case-study tabs |
| About | Four illustrated bento cards connecting design, code, tools, and interface principles |
| Strengths | Three areas of focus with concrete supporting practices |
| Approach | Understand → Explore → Make → Refine, shown through a scroll-responsive process timeline |
| Notes | Three complete articles on hierarchy, purposeful motion, and responsive content |
| Questions | Four FAQ answers using a single-open, collapsible accordion |
| Contact | A browser-local brief with a copy action until a real email address is supplied |

## Working studies

- **Taskboard:** add tasks, move them through To do/In progress/Done, delete them, or reset the board. Tasks persist locally, and keyboard focus follows moved or deleted cards.
- **Focus timer:** choose a session duration, start or pause it, and reset it. A saved deadline allows elapsed time to be reflected when the preview reopens.
- **Palette lab:** explore five curated color sets, see a contextual preview, and copy a hex value.

Each study has its own challenge, approach, and outcome copy. These are interface studies made for this site; their descriptions make no claims about clients, commercial deployment, or measured business results.

## Foundation and interaction

React and TypeScript run through Vite, with Tailwind CSS v4 and portfolio-specific CSS. The app uses actual official-source Aceternity BentoGrid, Timeline, and TextGenerateEffect components, plus shadcn Button, Badge, Tabs, Dialog, Accordion, and Tooltip. The installed component headers preserve their source URLs.

The Aceternity timeline describes a design process, not an invented career history. Its stock biography is removed. Reduced-motion preferences are respected in the text animation, timeline, Motion configuration, and CSS effects. The layout includes a skip link, active navigation, accessible control names, responsive dialogs, and focus restoration to the control that opened a dialog.

## Content that still needs the owner

The implementation is complete as a working portfolio draft. Personalization remains a content step:

1. Supply the real name, email, GitHub, and LinkedIn fields in `src/portfolio-content.ts`; they currently remain `null`.
2. Review and personalize the first-person introduction, About copy, strengths, process, and notes.
3. Add the user's own photograph when supplied, with an appropriate crop and alt text.
4. Add verified personal projects, role descriptions, links, and outcomes when available. Keep the included tools labeled as studies.

There are no fabricated employers, dates of employment, credentials, testimonials, clients, or performance metrics. Empty contact fields do not generate fake destinations.

## Data and contact scope

Theme, Taskboard state, Focus timer state, and the contact draft are stored only in the browser's local storage. Palette selection is temporary. Copy buttons use the clipboard after a user action. The brief explicitly says it does not send a message; there is no submission endpoint or backend. Once a real email is supplied, the contact button opens the visitor's email client through `mailto:`.

Google Fonts provides the two typefaces through external font requests. The local draft and study state are not transmitted by the application. The README records the exact storage keys and how to clear them.

## Validation scope

The project exposes `npm run typecheck` and `npm run build`. Functional review should cover all study controls, local persistence, timer reopening, filters and dialog tabs, article dialogs, FAQ behavior, theme persistence, reduced motion, keyboard focus, clipboard feedback, and layouts at phone and desktop widths. Publishing and personal content approval are separate from the local implementation.