# Opportunity analysis: child-safe digital apps for Germany

_Last updated: 2026-07-12._

## Evidence base

- The former federal initiative **Ein Netz für Kinder** was discontinued in 2019, but its whitelist/safe-search idea continues through fragFINN and related child-friendly resources.
- The BzKJ 2026 funding call for **kindgerechte digitale Angebote** emphasises participation, interaction, democratic competence, AI, safe settings, and active involvement of children and teenagers.
- KIM 2024 reports that internet use is now a regular part of life for 6- to 13-year-olds: WhatsApp, videos/streaming, search engines, TikTok, child-specific websites, Wikipedia, and Instagram all appear in weekly use patterns.
- JIM 2025 reports that AI use has become mainstream among 12- to 19-year-olds and that information/news competence is increasingly tied to AI literacy.
- Current German prevention resources repeatedly point families toward safe search, media-time routines, help/reporting pathways, counselling, and media literacy.

## Prioritised app portfolio

| Rank | App | Monorepo path | Demand score | Why now | MVP scope |
| --- | --- | --- | ---: | --- | --- |
| 1 | KinderSafe Search Companion | `apps/safe-search` | 95 | Children use search/video discovery weekly and need a safe route before open platforms. | Curated start page, resource cards, parent-approved topics, child-friendly explanations. |
| 2 | Family Media Time Planner | `apps/media-time` | 89 | Daily online time is increasing; parents and schools need routines rather than only blocking tools. | Family media agreement, age bands, daily rhythm planner, reflection prompts. |
| 3 | Youth Help Bridge | `apps/help-bridge` | 86 | Cyberbullying, hate speech, fake news, unwanted contact, and sexual harassment need fast, calm triage. | Situation chooser, evidence checklist, escalation map to jugend.support and counselling. |
| 4 | AI Literacy Lab for Teens | `apps/ai-literacy` | 84 | Teenagers now use AI broadly; they need verification, bias awareness, and transparent prompt habits. | Micro-lessons, source-check challenge, AI disclosure cards, teacher mode. |

## Product requirements shared across all apps

1. Age-appropriate content and wording.
2. Data minimisation: no unnecessary account, tracking, or permissions in the MVP.
3. No manipulative monetisation, advertising, dark patterns, or app-store pressure.
4. Safe defaults, clear parent/educator guidance, and child-friendly explanations.
5. Participation loop: each app must include a child/teen testing protocol before production.
6. Accessibility and mobile-first design.
7. Localisation-ready copy for German first, then Ukrainian/Russian/Turkish/Arabic support.

## Monorepo architecture started

- `packages/shared-data` contains shared safety principles, trusted resources, and demand scoring.
- Each app under `apps/*` has a dependency-free static prototype with its own local server.
- The root `validate` script checks that all prototypes and analysis assets are present.

## Next development milestones

1. Replace placeholder static screens with task-specific flows.
2. Add German-language copy and co-design interview scripts.
3. Add automated accessibility checks and content-safety linting.
4. Decide whether to keep dependency-free static apps or migrate to a shared UI framework.
5. Prepare a BzKJ-aligned concept note for a future funding window.

## Continuation sprint: prototype depth added

The first continuation sprint moves the repo beyond placeholder landing pages:

- Shared `appConfigs` now define audience, product promise, primary action, feature cards, safety checklist, and next-sprint backlog for every app.
- Shared `riskRoutes` now model early triage needs for cyberbullying, unwanted contact, hate speech, and AI misinformation.
- Every app renders its own German-language product flow from shared data while keeping local styling and a dependency-free server.
- The validation script now imports shared data and verifies that app configs, demand scores, vetted resources, and risk routes exist.

## Detailed MVP flows

### `apps/safe-search`

1. Child chooses a safe topic room.
2. Parent-approved / whitelist-first links are shown before any broad web discovery.
3. The interface explains why some content is hidden instead of silently blocking it.

### `apps/media-time`

1. Family selects an age band and weekday/weekend rhythm.
2. Child chooses learning, creativity, play, movement, and rest slots.
3. The app produces a printable media agreement instead of a surveillance dashboard.

### `apps/help-bridge`

1. Teen chooses the problem type in calm, non-blaming language.
2. The app separates emergency, counselling, reporting, and evidence-preservation paths.
3. The app routes to trusted help resources without storing sensitive case data.

### `apps/ai-literacy`

1. Teen sees a prompt, an AI answer, and a source-check rubric.
2. The app asks for evidence, recency, perspective, and bias checks.
3. Teacher mode turns exercises into classroom discussion cards.

## Continuation sprint 2: engineering quality

The second continuation sprint reduces copy-pasted application code and makes the prototypes easier to extend:

- `packages/app-shell` owns the shared browser renderer for scorecards, feature cards, flow steps, demo chips, checklists, and trusted resources.
- `packages/static-server` owns the local dependency-free server and the module routes for `/shared/index.js` and `/shell/render.js`.
- Individual app `app.js` files are now thin entrypoints that provide only the app slug and shared data.
- `appConfigs` now include `flowSteps` and `demoItems` so each app has an explicit interaction model instead of a static page only.

## Continuation sprint 3: automated checks and server hardening

The third continuation sprint adds real automated tests and hardens the local prototype server:

- `npm test` now runs Node's built-in test runner over shared-data and static-server tests.
- Static-server tests verify app HTML, shared module serving, shell module serving, and path traversal protection.
- Shared-data tests verify that every app has demand scoring, cards, flow steps, demo items, and valid risk-route mappings.
- The static server now resolves paths against the public root and returns `403 Forbidden` for traversal attempts outside the app's `public/` directory.

## Continuation sprint 4: app-specific product substance

The fourth continuation sprint adds product-specific content blocks so the four apps no longer feel like the same shell with different titles:

- `safe-search` now has topic-room examples for homework, child-friendly news, hobbies, and creativity.
- `media-time` now has weekly planning blocks that distinguish learning, creative media work, and offline balance.
- `help-bridge` now has first-aid paths for insults, image pressure, and hate-speech situations.
- `ai-literacy` now has AI-check exercises for evidence, missing perspectives, and prompt improvement.
