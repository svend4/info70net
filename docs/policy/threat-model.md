# Child Safety Toolkit Threat Model

- **Document status:** Draft policy baseline; not a production approval
- **Scope:** Safe Search, Media Time, Help Bridge, AI Literacy, the shared browser utilities, and their static hosting environment
- **Review date:** 2026-07-12
- **Next review:** Before any production launch and at least every six months thereafter
- **Policy owner:** Product Safety Owner
- **Required reviewers:** Safeguarding Reviewer, Privacy Reviewer, Security Reviewer, Accessibility Reviewer, Content Governance Reviewer

## 1. Purpose

This threat model identifies safety, privacy, security, and content-integrity risks for a suite intended for children, families, and learning groups. It treats child wellbeing and loss of trust as harms alongside conventional confidentiality, integrity, and availability failures.

The current product is a dependency-free set of static browser applications. That reduces the application network surface, but it does not make the product risk-free. The browser, the shared origin, device storage, the hosting provider, external destinations, repository access, and human content decisions remain trust boundaries.

This document is a design and release control. It is not legal advice and does not by itself determine whether a particular law applies.

## 2. Safety and security objectives

The product must:

1. avoid creating new danger for a child who uses a shared or monitored device;
2. minimise collection and persistence of child-related information;
3. preserve the integrity and availability of urgent safety guidance;
4. avoid presenting a curated link, automated route, media-time suggestion, or AI-literacy lesson as an infallible answer;
5. keep external navigation explicit and constrained to reviewed HTTPS destinations;
6. remain useful without accounts, profiling, advertising, or behavioural analytics;
7. fail conservatively when stored data, content metadata, or safety inputs are incomplete or invalid;
8. provide accessible, age-appropriate explanations of limitations and deletion controls;
9. make safety-affecting changes reviewable, testable, reversible, and attributable to an owner role.

## 3. System scope and assumptions

### In scope

- Portal and the four application pages.
- Application logic and shared rendering/storage utilities.
- Browser memory and web storage used by the applications.
- Curated external links and the claims made about them.
- Static hosting, CDN delivery, browser security headers, and deployment integrity.
- Repository, review, release, and incident-response practices.
- German and English child-facing content and translations.

### Out of scope, but release-relevant dependencies

- Internal security and privacy practices of external linked sites.
- Operating-system logs, browser history, device backups, parental-control software, screenshots, or monitoring tools.
- Emergency services, helplines, schools, platforms, or trusted adults contacted outside the product.
- Legal or clinical diagnosis.

The interface must not imply that clearing application storage clears browser history, network logs, screenshots, device backups, or evidence held by another person.

## 4. Assets

| Asset | Why it matters | Sensitivity |
| --- | --- | --- |
| Help Bridge triage choices | Can reveal bullying, threats, location knowledge, repeated contact, or image pressure | Critical child-safety information |
| Names and free-text notes entered into Help Bridge | May identify a child, adult, school, account, location, or alleged abuser | Critical personal information |
| Safe Search queries and history | May reveal health, identity, family, abuse, school, or other private interests | Potentially sensitive child information |
| Saved Safe Search resources | Reveal interests and may expose a child on a shared device | Personal preference information |
| Media Time weekly plan | Can reveal routines and periods of activity or absence | Personal routine information |
| AI Literacy progress | Can reveal learning activity or be misused as a judgment of ability | Low-to-moderate child information |
| Crisis-routing rules and copy | Incorrect or unavailable guidance may delay help | Safety-critical content |
| Curated URL catalogue and safety claims | A changed destination can expose a child to tracking, harmful content, or manipulation | High-integrity content |
| Application code and deployment | Compromise can expose all same-origin state or replace safety guidance | High-integrity system asset |
| Child and family trust | Overclaiming safety or privacy can cause unsafe reliance | Core product asset |

## 5. Relevant actors and misuse conditions

- A child using a private device.
- A child using a family, school, library, or otherwise shared device.
- A parent, sibling, peer, teacher, administrator, or other person with legitimate device access.
- A controlling, coercive, or abusive person who can inspect the device or browser.
- A curious user who enters names, locations, account identifiers, or other private information despite instructions.
- A malicious contributor or a contributor whose account is compromised.
- A maintainer who makes an accidental safety, translation, URL, or data-retention error.
- An external site that changes content, redirects, adds tracking/account requirements, expires, or is taken over.
- An attacker who injects hostile values into web storage or finds an HTML/URL injection path.
- A hosting, CDN, browser-extension, school-network, or endpoint operator that observes normal connection metadata.

Children are not treated as adversaries when they make mistakes, misunderstand a control, or explore unexpected inputs. Safe defaults must account for those behaviours.

## 6. Trust boundaries

### TB-1: Child and browser UI

Input crosses from a child into application state and DOM rendering. Length, type, and allowed-value validation are required. Instructions alone are not a security control.

### TB-2: Browser memory and persistent storage

Session state may become visible to another person who uses the same tab or device. `localStorage` persists across sessions and is readable by any script running on the same origin. A namespace prevents accidental key collisions; it is not confidentiality or access control.

### TB-3: One application and another application on the same origin

All same-origin applications share the effective web-storage and script trust boundary. A future XSS or third-party script in any one page may expose state created by another page. Highly sensitive Help Bridge state must therefore not rely on namespacing for isolation.

### TB-4: First-party application and external destination

Opening a curated resource sends connection metadata to another operator and places the child under that site's content, cookie, advertising, account, and moderation rules. `noreferrer` reduces referrer disclosure but does not remove the external site's data processing.

### TB-5: Source repository, CI, and deployed site

Reviewed source can differ from deployed content because of compromised credentials, unreviewed changes, stale caches, or deployment mistakes. Protected review, reproducible checks, rollback, and post-deploy verification are required.

### TB-6: Automated routing and human safeguarding judgment

Help Bridge logic cannot understand full context and cannot replace a trained safeguarding professional, emergency service, trusted adult, platform report, or law-enforcement decision. Automated routing must remain narrow, conservative, and explicit about its limits.

### TB-7: Content authoring and child-facing translation

A semantically plausible translation may change urgency, scope, or meaning. Crisis copy and translations require human safeguarding review; machine translation or author-only review is insufficient.

## 7. Abuse cases, controls, and residual risk

| ID | Scenario and harm | Required controls | Residual risk |
| --- | --- | --- | --- |
| TM-01 | Another person reads a child's saved searches on a shared device | Do not persist exact search history by default; use explicit opt-in, short retention, visible storage state, and one-step deletion | Browser history, OS logs, and observers outside the application remain visible |
| TM-02 | Another person discovers a Help Bridge incident from restored state | Explicit Keep, current-tab storage, exact 2 KB schema, 30-minute TTL, neutral start, Resume and clear deletion | Device administrators, extensions, screenshots, backups, another user of the open tab, delayed physical removal in a suspended tab, and same-origin compromise may still expose state |
| TM-03 | A user tries to enter a name, account, location, private narrative or image | The current Help Bridge UI does not request free text and explicitly warns against these details; injected unknown stored fields fail closed | A nearby person can still see other structured choices; browser or extension behaviour outside application control remains possible |
| TM-04 | Incomplete or ambiguous danger answers produce a reassuring route | Required immediate-risk questions must be answered before a final steady plan; urgent signals always dominate; future `not sure` answers route conservatively | No finite form can identify every dangerous situation |
| TM-05 | A child relies on Help Bridge instead of getting immediate help | Keep emergency information visible before and without JavaScript; state that the product cannot call, report, remove content, or guarantee outcomes | Stress, literacy, disability, language, or coercion may prevent action |
| TM-06 | An external domain changes, redirects, expires, or becomes harmful | HTTPS and exact-host allowlist; content manifest with owner and review date; automated redirect/availability checks; recurring human suitability review; fail closed when overdue | A destination can change between automated checks and a child's visit |
| TM-07 | The product calls a resource “safe” after its content changes | Use time-bounded “reviewed starting point” language and display or retain review metadata; prohibit absolute safety guarantees | Users may still infer endorsement from inclusion |
| TM-08 | A malicious catalogue URL becomes script execution or an unsafe scheme | Parse URLs and permit only reviewed HTTPS hosts; reject `javascript:`, `data:`, `blob:`, credentials, raw IPs, and unapproved redirects | An approved host can itself be compromised |
| TM-09 | Hostile or corrupted web-storage content causes XSS, logic bypass, or denial of service | Allowlist fields and enum values, cap lengths and byte size, validate timestamps, escape text, reject unknown schema versions, and test malicious payloads | Same-origin code execution would bypass these application-level controls |
| TM-10 | Media Time feedback shames a child or is interpreted as medical advice | Child-agency language, no punitive scoring or streaks, explainable and adjustable examples, inclusive review, and documented evidence for fixed thresholds | Family circumstances and individual needs cannot be inferred by a generic planner |
| TM-11 | A child treats a stronger prompt or confident AI answer as verified truth | Teach that prompts do not guarantee truth, AI can invent citations, sources require independent inspection, and private details must not be entered | Users may transfer lessons incompletely to other AI services |
| TM-12 | A future live AI, analytics, account, ad, or recommender feature silently expands processing | Architectural gate requiring a new threat model, data-flow map, privacy/legal review, child-safety evaluation, and explicit approval before implementation | Product pressure may encourage exceptions; branch protection and ownership are needed |
| TM-13 | Crisis copy or translation is changed without qualified review | Safety-content ownership, two-role approval, versioned copy, regression tests, and a production blocker for human safeguarding review | Review quality still depends on reviewer competence and current regional knowledge |
| TM-14 | A harmful release cannot be removed quickly | Severity model, private reporting channel, named owner roles, tested rollback/quarantine procedure, and post-deploy verification | CDN/browser caches may delay complete removal |
| TM-15 | “Local only” is understood as “nobody else receives any data” | Distinguish absence of application telemetry from hosting/CDN connection logs and requests to external destinations | Users may not read notices; hosting-provider practices can change |

## 8. Required control baseline

### 8.1 Data and shared-device controls

- No account, behavioural profile, advertising identifier, cross-site tracking, or application analytics by default.
- Persistent storage is an optional enhancement, not a prerequisite for accessing safety guidance.
- Exact search queries and Help Bridge free text must not persist by default.
- Every sensitive or time-bounded stored schema must document purpose, field allowlist, maximum size, version, creation time, expiry, and deletion behaviour.
- Unknown, malformed, oversized, or expired stored data must be ignored and removed where safe.
- A clear control must remove only the intended namespace and must accurately describe what it cannot remove.
- Sensitive canary strings must be absent from storage, cookies, URLs, console output, cache storage, and network requests in automated browser tests.

### 8.2 Content-integrity controls

- Every curated external resource must have a canonical URL, exact permitted host, audience, inclusion rationale, risk class, status, content owner role, safeguarding reviewer role where applicable, last-review date, and next-review date.
- Link availability and redirect chains should be checked on a schedule. Child suitability and privacy/account assumptions require human review at least quarterly for Safe Search resources.
- Overdue, unexpectedly redirected, ownership-changed, or materially changed resources must be quarantined rather than silently retained.
- Safety claims must be specific, attributable, time-bounded, and not framed as guarantees.
- Crisis copy, emergency numbers, helplines, and translations must be reviewed before every production release and at least quarterly while published.

### 8.3 Application and hosting controls

- Only first-party static scripts, styles, and assets may load before a user intentionally follows an external link.
- New network APIs, remote assets, iframes, service workers, analytics, or form submissions require explicit privacy and security review.
- Production hosting should enforce a restrictive Content Security Policy, anti-framing, no-sniff, no-referrer, and least-privilege Permissions Policy headers. Unsupported headers must be recorded as a release risk, not assumed present.
- Branch protection, required review, required checks, least-privilege deployment credentials, and a documented rollback path are required for production.

### 8.4 Child-facing communication controls

- Critical instructions use short, direct sentences and remain accessible without colour or animation.
- Safety actions do not depend on completing an educational exercise, accepting storage, or creating an account.
- The product must not promise that a report will remove content, that an adult will respond in a particular way, or that the application will contact anyone.
- A quick-leave control, if introduced, must not claim to erase browser history, device logs, screenshots, or monitoring records.

## 9. Application-specific security and safety invariants

### Safe Search

- Search is limited to a maintained catalogue; it must not silently become an unrestricted web search.
- Query history is session-only unless the user explicitly enables persistent history after a child-readable explanation.
- Only reviewed HTTPS destinations are linkable.
- A resource is described as reviewed, not guaranteed safe.

### Media Time

- Inputs are bounded and sanitised.
- The planner does not infer diagnosis, addiction, parenting quality, or moral worth.
- Feedback supports agency and adjustment rather than punishment or coercion.
- Routines are not transmitted and should not persist without a clear user choice.

### Help Bridge

- The invariants and release blockers in `help-bridge-safety-case.md` are mandatory.
- Immediate emergency information remains present in static HTML and usable without JavaScript.
- No private image is requested, uploaded, copied, or stored.
- No plan advises paying, bargaining, retaliating, confronting, or collecting additional harmful material.

### AI Literacy

- The current application remains a local exercise, not a live model integration.
- Progress is not used for ranking, profiling, eligibility, or claims about a child's ability.
- Lessons distinguish evidence from model output and explain that cited sources can be invented or misrepresented.
- A live AI feature is a new high-risk system change and cannot inherit approval from this static version.

## 10. Verification expectations

Release checks must cover:

- unit tests for storage allowlists, expiry, malformed values, length limits, and deletion;
- exhaustive or generated tests for Help Bridge routing invariants;
- hostile HTML, attribute, URL-scheme, and stored-JSON payloads;
- an external-link manifest check and a scheduled redirect/availability check;
- browser network observation proving no unapproved requests before external navigation;
- non-JavaScript visibility of emergency guidance;
- keyboard, screen-reader, reduced-motion, zoom, mobile, and forced-colour checks for critical flows;
- deployment-header and deployed-version verification;
- a fresh-profile test and a shared-device restoration/deletion test.

Passing automation is necessary but not sufficient for crisis copy, translations, resource suitability, or child comprehension.

## 11. Residual risks requiring explicit acceptance

Before production, the owner roles must record whether they accept, mitigate, or block at least these residual risks:

1. normal hosting/CDN connection metadata exists even without application analytics;
2. external destinations can change between reviews;
3. same-origin scripts and device-level actors can inspect persistent browser state;
4. a static triage flow cannot understand all context or guarantee help;
5. users may misunderstand privacy and safety notices under stress;
6. browser history and operating-system artefacts cannot be erased by application storage controls;
7. content and emergency resources can become stale across regions and languages.

No residual risk involving inaccurate crisis guidance or an unreviewed crisis translation may be accepted solely by a technical reviewer.

## 12. Production blockers

The following block production release:

- missing human safeguarding approval for Help Bridge crisis copy, routing rules, emergency information, or any translation;
- a Help Bridge route that can produce a steady plan with unanswered required immediate-risk questions;
- browser-stored sensitive Help Bridge data without an approved retention, expiry, shared-device, and origin-isolation decision;
- automatic persistence of exact Safe Search queries without an approved necessity/consent decision;
- an external resource with overdue review, unexpected redirect, changed ownership, or materially inaccurate description;
- unapproved third-party code, analytics, tracking, live AI, accounts, advertising, or user-to-user features;
- missing rollback owner or inability to quarantine a harmful resource or release;
- unresolved critical accessibility failure in emergency or deletion controls.

## 13. Review and change ownership

| Responsibility | Owner role |
| --- | --- |
| Product safety policy and risk acceptance | Product Safety Owner |
| Crisis copy, triage logic, and child safeguarding | Safeguarding Reviewer |
| Data inventory, retention, and regulatory assessment | Privacy Reviewer |
| XSS, URL, storage, headers, repository, and deployment controls | Security Reviewer |
| Curated resource suitability and freshness | Content Governance Reviewer |
| German/English semantic parity | Localisation Reviewer and Safeguarding Reviewer |
| Critical-flow accessibility | Accessibility Reviewer |
| Release evidence and rollback readiness | Release Owner |

Any change to storage fields, external destinations, crisis copy, triage conditions, languages, network behaviour, accounts, analytics, live AI, or hosting origin requires this threat model to be reviewed before release.
