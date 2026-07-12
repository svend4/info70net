# Product and development roadmap

**Review date:** 2026-07-12

**Scope:** child digital-safety tools in `svend4/info70net` only

**Status:** proposal and sequencing guide, not a delivery promise or legal guarantee

## Product direction

Build a small, trustworthy toolkit that helps children, families, and educators:

- discover curated information and understand why a source deserves trust;
- plan media use without surveillance or shame;
- prepare a calm, privacy-preserving next step after a difficult online situation;
- practise checking AI output, evidence, perspectives, and prompts.

The product is not a game platform, general social network, surveillance product,
benefits-information service, counselling provider, emergency dispatcher, or legal
advice service. Unrelated Nexus, game, site, and child-benefit work remains outside
this repository.

## Current baseline

At the review date the repository contains:

- one static portal and four dependency-free apps;
- curated local Safe Search results, saved items, page-memory history, and an explicit
  opt-in that stores only later searches;
- an editable weekly Media Time plan with current-tab session persistence and reset;
- Help Bridge structured triage, urgency guidance, explicit privacy-minimised draft
  save, conservative Resume, automatic expiry and clear service limitations;
- three fixed AI Literacy exercises with current-tab session progress and reset;
- shared safe rendering, namespaced persistent and session storage, accessible styles,
  tests, validation, policy checks, and browser smoke coverage;
- no backend, account, remote analytics, advertising, UGC, messaging, upload, payment,
  age-assurance, or live AI service.

## Decision principles

1. Prefer a safer static or local solution until a backend has a demonstrated child
   benefit that outweighs its risk.
2. Treat privacy, security, accessibility, and child rights as acceptance criteria.
3. Add one evidence-backed user outcome at a time, with a complete testable loop.
4. Do not use engagement time as the success objective.
5. Do not introduce accounts, UGC, AI, or monetisation as an assumed next step.
6. Verify time-sensitive policy and content claims against primary official sources.
7. Use synthetic research and test data; never invite real incident disclosure into
   development tooling.

## Phase 0 - policy and evidence foundation

**Outcome:** the project can explain its scope, current data behaviour, safety model,
release gates, and limits before further feature work.

- Maintain the compliance matrix and source dates.
- Adopt the child-safety standard, privacy data map, content governance process,
  release checklist, security policy, and contribution rules.
- Create a child-rights impact assessment template and a lightweight DPIA threshold
  template for future material changes.
- Create a content inventory containing audience, class, source, reviewer, last
  review date, and next trigger.
- Create an outbound-link register for every Safe Search and future help destination.
- Record the actual hosting architecture and access-log retention before a public
  deployment.

**Exit evidence:** all requested policy documents exist; facts match the reviewed
commit; official links resolve; no document claims certification.

## Phase 1 - production-quality static toolkit

**Outcome:** the existing no-account/no-backend product becomes suitable for a
controlled public preview.

### Shared foundation

- Add user-facing, layered privacy, safety, and accessibility information based on
  the approved policies.
- Decide storage necessity per key. Prefer an explicit "remember on this device"
  choice where persistence is convenience rather than essential.
- Add proportionate expiry and a single clear-local-data view, with the strictest
  treatment for Help Bridge.
- Verify hosting security headers, HTTPS, referrer behaviour, caching, and logs.
- Add automated accessibility checks while retaining manual keyboard, screen-reader,
  zoom/reflow, contrast, and forced-colour reviews.
- Add link-health automation and a human review ledger; automation must not label a
  destination safe.
- Resolve encoding or localisation defects and keep one intentional language within
  each workflow.

### Safe Search

- Show the reason each source is included, its organisation, target age, language,
  and review date.
- Provide a visible transition notice before leaving for an external service where
  it materially improves understanding.
- Add local category and source-literacy activities without scraping, remote queries,
  or personalised ranking.
- Explore a printable/offline source guide for families and classrooms.

### Media Time

- Make the planner explicitly child-led and family-discussion oriented.
- Improve adjustable guidance for different contexts without creating a health or
  behavioural score.
- Add a privacy-preserving print/export path that does not upload the plan.
- Test screen-reader table interaction, touch editing, error recovery, and printing.

### Help Bridge

- Strengthen the quick-clear/shared-device explanation without pretending browser
  erasure is forensic deletion.
- Add a reviewed Germany-focused help directory only after destination scope, hours,
  age, privacy, language, and review ownership are recorded.
- Keep plans local and avoid upload/reporting until a trained safeguarding operation
  exists.
- Test urgent and non-urgent paths with safeguarding and accessibility specialists
  using synthetic scenarios.

### AI Literacy Lab

- Expand fixed exercises on citations, recency, missing perspectives, hallucination,
  persuasive design, privacy, synthetic media, and appropriate AI disclosure.
- Add educator discussion notes and printable activities without student accounts or
  individual performance tracking.
- Clearly date examples whose answer depends on current facts.
- Keep live AI out of this phase.

**Exit evidence:** the complete [release checklist](./policy/release-checklist.md)
passes for a controlled static preview; policy/UI/implementation agree; manual
accessibility and content review evidence is attached to the reviewed commit.

## Phase 2 - safeguarded co-design and evaluation

**Outcome:** product decisions are informed by children, parents, educators, and
specialists without collecting real incident stories.

- Define target age bands and reading-level goals per app.
- Approve research recruitment, assent, any required guardian permission,
  accessibility accommodations, incentives, recordings, retention, and distress
  protocol before sessions.
- Use fictional tasks and synthetic incidents; actively stop collection of real
  names, accounts, images, or abuse details.
- Include children with disabilities and different language or access needs.
- Test understanding of limitations, local storage, external navigation, urgent
  guidance, AI uncertainty, and clearing data.
- Publish an anonymised decision log describing what changed and why, without raw
  participant material.

**Guardrail:** participation informs decisions but does not substitute for qualified
safeguarding, privacy, security, accessibility, or legal review.

## Phase 3 - deployment and architecture decision

**Outcome:** choose the least complex architecture that supports a validated need.

Evaluate two explicit options:

### Option A: remain static/local

Best when the validated outcomes can be met through curated content, local plans,
print/export, and external trusted services. Benefits include lower data risk,
simpler security, and less need for age or identity processing.

### Option B: introduce a narrowly scoped backend

Consider only for a benefit that cannot be delivered locally. Before approval:

- define controller/operator and support ownership;
- complete data map, lawful-basis analysis, CRIA, DPIA threshold/DPIA, threat model,
  processor/transfer review, retention, deletion, and incident response;
- define hosting region, access controls, operational coverage, monitoring, and cost;
- prove that an account or identifier is necessary;
- run the relevant DSA, JuSchG, JMStV, TDDDG, accessibility, and consumer review.

The architecture decision record must include the rejected safer alternative and
why it did not meet the validated need.

## Phase 4 - conditional capabilities, not committed backlog

These are separate programmes of work. None is approved merely by appearing here.

### Accounts or cloud sync

Require a demonstrated benefit, field-level data justification, child-readable
privacy information, secure recovery, deletion/export, retention, and DPIA/CRIA.
Anonymous or local access to core safety information must remain available.

### UGC, profiles, messaging, uploads, or reporting

Require DSA/JuSchG/JMStV classification; safe defaults; trained moderation and
safeguarding coverage; child-friendly reporting, blocking, appeal, and remedy;
grooming and abuse prevention; evidence handling; and tested emergency escalation.
Do not pilot with children until the operation, not only the interface, exists.

### Live AI

Require AI Act classification, staff literacy, prohibited-practice assessment,
child-readable transparency, provider data controls, child-specific evaluations,
human oversight, monitoring, rollback, and DPIA/CRIA. AI must not be a friend
simulation, commercial nudge, or sole safeguarding decision maker.

### Monetisation

Behavioural advertising to children remains out of scope. Any funding, sponsorship,
subscription, or purchase flow requires a new consumer, DSA/JMStV, accessibility,
privacy, and child-rights review. Commercial incentives must not shape safety results
or source ranking.

## Quality and outcome evidence

Prefer evidence that does not require behavioural surveillance:

- task completion in moderated synthetic usability sessions;
- comprehension of source reasons, storage, limitations, and next safe steps;
- accessibility defects found and resolved;
- content/link review coverage and time to correct an invalid destination;
- automated test, validation, and browser-smoke reliability;
- number and severity of unresolved safety/privacy risks at release;
- child-participation decisions implemented or transparently declined.

Do not optimise for session length, notification opens, return streaks, number of
disclosures, or amount of data collected.

## Review cadence and triggers

Review the roadmap after material evidence from a phase, and before any account,
backend, UGC, AI, monetisation, age-assurance, public-sector, or native-app decision.
Also review it when official law, regulator guidance, standards, destination
ownership, audience, or safeguarding capability changes.

Dates and phases communicate sequence, not a promise of delivery. A feature may be
deferred or rejected when its safety, privacy, accessibility, operational, or legal
conditions cannot be met.
