# Contributing

**Review date:** 2026-07-12

Thank you for helping improve this child digital-safety toolkit. Contributions must
stay within the repository's narrow scope: Safe Search, Media Time, Help Bridge, AI
Literacy Lab, their shared foundation, tests, and directly supporting documentation.

Do not add unrelated games, Nexus work, general site experiments, benefits-related
material, raw chat exports, personal notes, or data from another project.

## Before opening anything public

Never include a real child's name, face, image, account, contact information,
location, school, private message, incident narrative, evidence, or other personal
data in an issue, discussion, pull request, commit, test, fixture, screenshot, or
documentation.

- For a vulnerability, use the
  [private GitHub security report](https://github.com/svend4/info70net/security/advisories/new)
  and follow [SECURITY.md](SECURITY.md).
- For a real child-safety situation, contact an appropriate local emergency or
  qualified child-protection service. This project is not a reporting or emergency
  channel.
- For a normal non-sensitive bug or content correction, a public issue is acceptable
  when it uses synthetic examples.

No contribution should require a child to disclose a real experience.

## Development setup

Use Node.js 22 or newer. The current project has no package installation step.

```sh
npm test
npm run validate
npm run policy
```

The optional browser smoke check requires a reviewed local or test deployment and
an isolated Chrome debugging session:

```sh
npm run smoke
```

Keep generated browser artefacts, local profiles, coverage, logs, exports, and
personal files out of Git.

## Choose a focused change

A good contribution has one clear user or quality outcome and preserves the current
privacy boundary. Examples include:

- correcting or improving age-appropriate copy with sources;
- adding a fixed educational exercise using synthetic material;
- improving keyboard, screen-reader, zoom, contrast, or responsive behaviour;
- strengthening safe rendering, storage isolation, validation, or tests;
- reviewing a curated destination and updating its evidence record;
- improving policy or developer documentation to match actual behaviour.

Accounts, analytics, cloud sync, UGC, messaging, uploads, reporting, payments,
advertising, age assurance, native-app permissions, or live AI are not ordinary
incremental changes. Start with an explicit architecture and policy proposal and
complete the relevant conditional gates in
[docs/policy/release-checklist.md](docs/policy/release-checklist.md) before code or
vendor procurement.

## Required design rules

- Keep core safety information usable without an account.
- Collect no data or permission that is not necessary for the stated outcome.
- Do not add behavioural advertising, dark patterns, streaks, autoplay, infinite
  scroll, false urgency, or engagement pressure.
- Preserve child agency and avoid hidden parent, school, or advertiser monitoring.
- Do not diagnose, promise safety, or describe the project as counselling,
  emergency response, evidence storage, or a reporting service.
- Treat Help Bridge structured state as sensitive even without a name.
- Never request or accept an intimate or abuse-related image.
- Escape untrusted text and validate URLs; do not concatenate user input into HTML.
- Use system assets and same-origin resources where possible. A new dependency,
  remote font, script, SDK, iframe, embed, or network destination requires security,
  privacy, accessibility, licensing, maintenance, and child-safety review.
- Preserve visible focus, reduced motion, forced colours, semantic structure, and
  mobile reflow. Target [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/), while recognising
  that conformance requires complete manual and automated evaluation.

## Data and storage changes

Any added or changed field, local key, log, URL parameter, request, recipient, or
retention rule must update
[docs/policy/privacy-data-map.md](docs/policy/privacy-data-map.md) in the same change.

The change description must state:

- field and purpose;
- why a less data-intensive design is insufficient;
- write/read trigger and user expectation;
- device/server location and recipients;
- lawful-basis and TDDDG assumptions where relevant;
- retention, clear/delete, access, and security behaviour;
- child-specific misuse and shared-device risks;
- whether CRIA or DPIA review was triggered.

Tests use synthetic values only. Do not copy production data into development,
CI, local files, prompts, screenshots, or public collaboration tools.

## Content and sources

Follow [docs/policy/content-governance.md](docs/policy/content-governance.md).
Material legal, regulatory, safety, health, or standards claims require a dated
primary official source. Relevant official starting points include:

- [EUR-Lex](https://eur-lex.europa.eu/) for EU law;
- [BfDI](https://www.bfdi.bund.de/) and
  [BzKJ/KidD](https://www.bzkj.de/bzkj/anbieterpflichten/strukturelle-vorsorgemassnahmen)
  for relevant German official guidance;
- the official state consolidation of the
  [JMStV](https://gesetze.berlin.de/bsbe/?aiz=1&docId=jlr-JMedienSchStVtrBErahmen);
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/);
- [UN CRC General Comment No. 25](https://documents.un.org/api/symbol/access?l=en&s=CRC%2FC%2FGC%2F25&t=pdf).

Search snippets, generated text, and secondary summaries may help discovery but are
not sufficient evidence. Do not claim that a source, destination, design, or release
is legally compliant or permanently safe.

Outbound child-facing links require a destination decision record and human review.
Use HTTPS, direct non-affiliate URLs, deliberate navigation, and `noopener noreferrer`
for a new browsing context. A successful status code is not a safety review.

## Language and translation

Keep the current intentional language of each workflow unless the change explicitly
adds a complete localisation. Do not mix languages unexpectedly inside a task.
Machine translation may be a draft aid, but sensitive or urgent guidance requires a
language-competent human review for meaning, tone, reading level, cultural context,
and service availability.

## AI-assisted contributions

Do not send repository secrets, private reports, child data, real incidents, or
unreleased sensitive material to an AI service. Generated code or content must be
reviewed, tested, licensed appropriately, and verified against primary sources just
like human-authored work. AI output is not evidence and must not be cited as an
authority.

Live AI product features require the separate AI gates in the child-safety standard
and release checklist. A fixed exercise about AI does not trigger permission to add
an AI API.

## Tests and review

At minimum, before requesting review:

1. run `npm test`;
2. run `npm run validate`;
3. run `npm run policy`;
4. run `npm run smoke` when browser behaviour, storage, navigation, layout, or copy
   flow changes;
5. manually test keyboard use and the affected screen-reader/status behaviour;
6. test narrow and wide layouts, zoom/reflow, reduced motion, and forced colours as
   applicable;
7. inspect browser network and console output for unexpected requests or errors;
8. complete the applicable items in
   [docs/policy/release-checklist.md](docs/policy/release-checklist.md).

Add focused regression tests for logic and safety/privacy boundaries. Do not weaken
validation or remove a failing test merely to make a change pass.

## Pull request description

Include:

- problem and intended child/family/educator outcome;
- scope and explicit non-goals;
- UI and data-flow changes;
- safety, privacy, security, accessibility, and content considerations;
- official sources and review dates for material claims;
- tests and manual evidence;
- conditional gates considered and reasons for `Not applicable`;
- known limitations, residual risks, rollback, and follow-up.

Use synthetic screenshots and examples. Keep the change focused and do not include
unrelated formatting or files.

## Licensing and review outcome

Contributors must have the right to submit their work and agree that accepted
contributions are provided under the repository's [LICENSE](LICENSE). Do not copy
protected articles, proprietary exercises, images, or third-party code without a
compatible right and attribution record.

A maintainer may request changes or decline a contribution when evidence,
operational capability, safety, privacy, accessibility, security, licensing, scope,
or legal questions remain unresolved. Acceptance means the project review process
was satisfied for that change; it is not a legal or safety guarantee.
