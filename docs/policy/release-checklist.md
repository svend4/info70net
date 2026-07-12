# Release checklist

**Review date:** 2026-07-12

**Applies to:** every public preview and production release

**Status:** project release gate; completion is not a legal certification or guarantee of safety

## How to use this checklist

For the current static prototype, complete every item marked **Current**. For a
future feature, complete the relevant **Conditional** gate before implementation
or procurement, not only before launch. Record `Not applicable` with the factual
reason; do not silently skip an item.

The release record must identify the commit, environment, date, evidence links,
reviewers by role, unresolved issues, rollback owner, and final decision. Do not put
real child data or incident material in that record.

## Current static release

### Scope and repository hygiene

- [ ] **Current:** The release contains only the four child digital-safety apps,
  their shared foundation, tests, and relevant documentation.
- [ ] **Current:** Unrelated projects, games, Nexus material, benefit-related text,
  raw chat exports, local artefacts, browser profiles, logs, and personal files are
  absent from the commit.
- [ ] **Current:** Generated screenshots and fixtures contain synthetic content only.
- [ ] **Current:** No secret, token, credential, private URL, or personal contact
  detail is present in source, history, test output, or documentation.
- [ ] **Current:** The actual deployed commit and asset set match the reviewed commit.

### Capability claims

- [ ] **Current:** Help Bridge is described as a planning tool, not an emergency,
  counselling, evidence-storage, or reporting service.
- [ ] **Current:** Safe Search is described as a curated local catalogue, not a
  complete search or permanent certification of the web.
- [ ] **Current:** Media Time does not present its prompts as medical diagnosis or
  universal health rules.
- [ ] **Current:** AI Literacy Lab is clearly a fixed educational exercise, not a
  live AI, fact-checking service, or proof of organisational AI Act compliance.
- [ ] **Current:** No page promises absolute safety, privacy, confidentiality,
  accessibility, legal compliance, or a guaranteed outcome.

### Privacy and device storage

- [ ] **Current:** Browser inspection confirms no analytics, advertising, tracking,
  remote logging, AI API, account, or unexpected third-party request.
- [ ] **Current:** Every `localStorage` and `sessionStorage` key, field, trigger,
  and retention rule matches [privacy-data-map.md](./privacy-data-map.md) and the
  [storage manifest](../../policy/storage-manifest.json).
- [ ] **Current:** Safe Search query history is page-memory only by default;
  persistent history requires explicit opt-in, and disabling it deletes the key.
- [ ] **Current:** Help Bridge writes no draft until "Keep in this tab" is selected;
  the record has a valid schema, 30-minute TTL, and fail-closed expiry.
- [ ] **Current:** Help Bridge stored state excludes names, notes, handles, exact
  locations, evidence, images, free text, and unknown fields.
- [ ] **Current:** Save, reset, clear history, clear draft, reset progress, and the
  Safety & Privacy removal control work and affect only intended namespaces.
- [ ] **Current:** The UI accurately explains what is stored locally and does not
  claim that a shared device is private.
- [ ] **Current:** Automatic Media Time and AI Literacy progress is current-tab
  only. Every remaining device-storage operation has a documented TDDDG decision
  before production.
- [ ] **Current:** Hosting access/error logs are inventoried and minimise IP,
  user-agent, path, and retention; form values and sensitive URL parameters are not
  logged.

### Child safety and content

- [ ] **Current:** The feature passes [child-safety-standard.md](./child-safety-standard.md).
- [ ] **Current:** Every C1/C2 statement has the required safety review and uses
  non-graphic, non-blaming, age-appropriate language.
- [ ] **Current:** Urgent Help Bridge outcomes direct the user to immediate human
  help without claiming that the project received or escalated the situation.
- [ ] **Current:** No flow requests a private or intimate image, real evidence, or
  identifying incident detail.
- [ ] **Current:** All external destinations have a current decision record under
  [content-governance.md](./content-governance.md), still resolve to the intended
  organisation and content, and introduce no unreviewed redirect.
- [ ] **Current:** Link text and surrounding copy do not imply endorsement or
  permanent safety of an external service.
- [ ] **Current:** Dates and primary official links supporting legal, policy, health,
  or safety claims are current as of the release review.

### Accessibility and inclusive use

- [ ] **Current:** All flows complete with keyboard alone in a logical order, with a
  visible, unobscured focus indicator.
- [ ] **Current:** Page language, headings, landmarks, labels, descriptions, groups,
  errors, and live status messages are exposed correctly to assistive technology.
- [ ] **Current:** Text and non-text contrast meet the selected WCAG target.
- [ ] **Current:** Content works at 200% and 400% zoom and reflows without loss at
  a narrow viewport.
- [ ] **Current:** Controls do not rely only on colour, position, hover, drag, motion,
  or a fine pointer.
- [ ] **Current:** Touch targets, error prevention, redundant entry, consistent help,
  reduced motion, forced colours, and screen-reader announcements have been checked.
- [ ] **Current:** German and English flows have a language-competent review; language
  does not unexpectedly switch inside a task.
- [ ] **Current:** No WCAG, EN 301 549, BITV, or BFSG conformance claim is published
  without a complete documented evaluation of the whole user experience.

The engineering target is [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/).
Public-sector or commercial deployment may require a separate formal review under
[EN 301 549](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_20/en_301549v030201a.pdf),
[BITV 2.0](https://www.gesetze-im-internet.de/bitv_2_0/__3.html), or
[BFSG](https://www.gesetze-im-internet.de/bfsg/BFSG.pdf).

### Security and resilience

- [ ] **Current:** The checks in [SECURITY.md](../../SECURITY.md) are followed.
- [ ] **Current:** User-controlled text is escaped or inserted through text
  properties; no unsafe HTML, script URL, or open redirect has been introduced.
- [ ] **Current:** External links opened in a new context use `noopener noreferrer`.
- [ ] **Current:** Browser storage denial, corrupt JSON, and quota failure degrade to
  a safe usable state without exposing data.
- [ ] **Current:** The deployed host uses HTTPS and appropriate security headers;
  framing, MIME sniffing, referrer leakage, and content-source policy are reviewed
  for the actual environment.
- [ ] **Current:** The incident and rollback owner can remove or replace unsafe
  static content promptly.

### Automated and browser evidence

- [ ] **Current:** `npm test` passes using the supported Node.js version.
- [ ] **Current:** `npm run validate` passes.
- [ ] **Current:** `npm run policy` passes with current metadata and source records.
- [ ] **Current:** `npm run smoke` passes against the intended deployment or an
  equivalent reviewed local environment.
- [ ] **Current:** Browser smoke covers the portal and a complete loop in all four
  apps, storage persistence/reset, urgent Help Bridge behaviour, and browser errors.
- [ ] **Current:** Screenshots are reviewed at representative narrow and wide sizes;
  artefacts remain ignored and contain no real personal data.
- [ ] **Current:** Test evidence records versions and date so the result can be
  reproduced; no pass is inferred from an earlier, different commit.

### Documentation and decision

- [ ] **Current:** README behaviour, policy documentation, UI copy, and implementation
  do not contradict one another.
- [ ] **Current:** The compliance matrix has been reviewed against product facts and
  official sources; unresolved legal questions are not converted into assertions.
- [ ] **Current:** Privacy data map, content inventory, source dates, security policy,
  and roadmap reflect the released state.
- [ ] **Current:** Known limitations and residual risks are recorded with owners and
  review triggers.
- [ ] **Current:** The final decision is explicitly `release`, `limited preview`, or
  `do not release`, with rollback criteria.

## Conditional production gates

### Accounts, identity, cloud sync, or analytics

- [ ] Data-field purpose and lawful-basis map approved.
- [ ] GDPR Article 8 child-consent analysis completed where consent is the basis.
- [ ] TDDDG device-storage analysis completed.
- [ ] DPIA threshold decision and CRIA completed before implementation.
- [ ] Child-readable privacy information and rights flows tested.
- [ ] Authentication, recovery, deletion, export, retention, processor, transfer,
  logging, and breach-response controls tested.
- [ ] Analytics is demonstrably necessary and minimal; behavioural or advertising
  profiling of children is prohibited.

### UGC, messaging, uploads, profiles, or reporting

- [ ] DSA, JuSchG, and JMStV classification recorded, including the limits of any
  micro/small-enterprise exemption.
- [ ] Child-readable terms, content rules, moderation explanations, reporting,
  blocking, decision reasons, appeal, and remedy are tested.
- [ ] Private-by-default contact and discoverability settings are verified.
- [ ] Trained moderation and safeguarding coverage, escalation, audit, quality,
  reviewer wellbeing, and response objectives are operational.
- [ ] Grooming, coercion, harassment, hate, evasion, mass-reporting, and account-
  recovery misuse tests pass.
- [ ] Image/evidence handling does not invite or expose intimate child content.
- [ ] Imminent life/safety and lawful-authority request processes are approved and
  tested without making unsupported response promises.

### AI

- [ ] AI Act provider/deployer and risk classification recorded.
- [ ] Article 4 literacy plan and Article 5 prohibited-practice review completed.
- [ ] Article 50 interaction and synthetic-content transparency implemented before
  its 2026-08-02 application date where relevant.
- [ ] Model/system card, intended use, prohibited use, data handling, vendor terms,
  evaluation set, limitations, monitoring, rollback, and incident process approved.
- [ ] Child-specific adversarial tests cover manipulation, dependency, grooming,
  self-harm, sexual content, hate, dangerous instructions, privacy extraction,
  hallucination, and commercial nudging using synthetic cases.
- [ ] AI is optional, clearly non-human, easy to leave, and never the sole decision
  maker for emergency, safeguarding, significant educational, or disciplinary action.

### Monetisation or consumer contracting

- [ ] Behavioural advertising to children remains prohibited by project policy.
- [ ] Sponsorship, commercial communication, ranking, affiliate, and purchase copy
  pass DSA/JMStV/consumer and child-safety review.
- [ ] No direct purchase exhortation, false urgency, default add-on, loot-box-like
  mechanism, or cancellation friction exists.
- [ ] BFSG/e-commerce and consumer-information applicability is formally reviewed.
- [ ] Refund, cancellation, guardian/child authority, and spending controls are clear
  and accessible.

### Public-sector or native-app deployment

- [ ] Applicable BGG/BITV, EN 301 549, procurement, accessibility statement, and
  feedback requirements are reviewed.
- [ ] JMStV app/OS age-setting responsibilities are reviewed for the distribution
  model, including purpose limitation and deletion of age-setting data.
- [ ] App-store declarations, permissions, privacy labels, age rating, and update
  process accurately describe the product.

## Release record template

```text
Commit/tag:
Environment and URL:
Review date:
Scope:
Current checklist evidence:
Conditional gates and N/A reasons:
Test/browser evidence:
Policy/source versions reviewed:
Known limitations and residual risks:
Rollback criteria and owner:
Decision: release | limited preview | do not release
Reviewers by role:
```

Never include a child's name, account, image, location, school, private message,
incident narrative, or evidence in this record.
