# Help Bridge Safety Case

- **Document status:** Draft; explicitly blocked from production pending human safeguarding review
- **Review date:** 2026-07-12
- **Next review:** Before production, after any safety-affecting change, and at least every three months while published
- **Safety owner:** Product Safety Owner
- **Required approver:** Safeguarding Reviewer
- **Supporting reviewers:** Privacy Reviewer, Security Reviewer, Accessibility Reviewer, Localisation Reviewer, Release Owner

## 1. Safety claim

Help Bridge may be released only when evidence shows that it provides a calm, limited next-step plan without delaying immediate help, collecting unnecessary private information, or implying that the application itself reports, calls, removes content, or guarantees an outcome.

This document does not approve the current crisis copy or translations. Human safeguarding review of every crisis route, emergency instruction, external help resource, and child-facing translation is an explicit pre-production blocker.

## 2. Intended purpose

Help Bridge is a short planning aid for a young person experiencing one of the currently supported online situations:

- insults or bullying;
- pressure involving images;
- hate speech or targeted abuse.

It is intended to help the user pause, recognise urgency, keep only limited useful evidence, choose a trusted adult, and use platform safety tools with adult support.

## 3. Explicit limits and non-claims

Help Bridge is not:

- an emergency service, hotline, reporting channel, or monitored inbox;
- a substitute for a nearby safe adult, police, emergency services, a safeguarding professional, or a qualified counsellor;
- a diagnostic, legal, medical, or mental-health assessment;
- a guarantee that a platform will remove content or that an adult or authority will respond in a particular way;
- a secure evidence vault;
- able to erase browser history, screenshots, device backups, network logs, monitoring software, or content held by another person;
- able to determine the user's country without collecting additional information;
- suitable for receiving, uploading, copying, or storing private or intimate images.

Unsupported or uncertain situations must never be presented as safe merely because they fall outside the three named incident categories.

## 4. Safety-critical assets

| Asset | Safety concern |
| --- | --- |
| Immediate-danger instructions | Must remain correct, visible, accessible, and available without JavaScript |
| Triage route and urgency label | A false low-urgency route may delay help; an unsupported high-urgency route may cause distress |
| Incident-specific next steps | Must not escalate contact, destroy necessary evidence, or encourage possession/redistribution of harmful material |
| Trusted-adult handoff | Must be practical without promising a particular adult response |
| Emergency and helpline information | Must be regionally correct, current, and reviewed |
| Triage choices and free text | May reveal abuse, threats, location, images, account identifiers, school, or alleged offender |
| Crisis copy and translations | Small wording changes can alter urgency or action |
| Deployed version | A rollback must be possible if guidance is found harmful or inaccurate |

## 5. Trust boundaries

### Child to form

The user may be distressed, interrupted, coerced, unsure, have limited literacy, or enter identifying details. Required controls must not depend on the user reading every paragraph.

### Form state to DOM

The current UI does not request names, handles, locations, private messages, images
or free-text notes. Reintroducing any such field requires a new safety/privacy review.

### Browser memory to current-tab storage

Current-tab storage still creates a shared-device disclosure risk while the tab is
open. A `help-bridge:` prefix is not access control and does not isolate data from
other same-origin scripts. Structured answers may reveal a highly sensitive incident
even when names and notes are excluded.

### Static logic to real-world danger

The route is based only on a small set of answers. It cannot observe tone, coercion, age, location, relationship, escalation outside the platform, or other facts. It must therefore use conservative invariants and foreground human help.

### Product to external help

The product cannot verify that a trusted adult is safe, that a platform report will work, or that a regional phone service is available in the user's language. Resource content and regional scope require recurring human review.

### Source copy to translation

Urgency words, negation, geographical limits, and instructions about images/evidence must retain the same safety meaning. Machine translation alone is not acceptable evidence.

## 6. Triage inputs

The current model uses:

| Input | Safety meaning |
| --- | --- |
| `incidentType` | One of insults/bullying, image pressure, or hate/targeting |
| `safeNow` | Yes, no, or not sure whether the user is physically safe now |
| `directThreat` | Yes, no, or not sure whether a direct threat was made |
| `knowsLocation` | Yes, no, or not sure whether the other person may know where to find the user |
| `repeatedContact` | Yes, no, or not sure whether contact is repeated |
| `imageShared` | Yes, no, or not sure whether an image may already have been shared |
| `adultRole` | The type of trusted adult the user may approach |

The form presents yes/no/not-sure choices. A not-sure answer to physical safety,
direct threat, or location knowledge routes to immediate adult checking and never
to `steady`. New answer types, incident categories, or regional inputs reopen review.

## 7. Mandatory triage invariants

These invariants are requirements, not descriptions that may be relaxed by copy changes.

### HB-I01: Immediate-danger dominance

The route is `urgent` whenever any of these is true:

- `safeNow` is false;
- `directThreat` is true;
- `knowsLocation` is true.

No incident type, reassurance, later answer, navigation action, or restored state may reduce an urgent result.

### HB-I02: No final steady route from incomplete immediate-risk answers

A final `steady` plan requires explicit valid answers. Missing, malformed, unknown,
or unsupported values block completion; `not sure` on a critical safety question
routes to at least same-day adult support and never silently maps to `no`.

### HB-I03: Same-day support for elevated online harm

In the absence of an urgent signal, the route is at least `soon` when any of these is true:

- the incident involves image pressure;
- an image may already have been shared;
- contact is repeated.

### HB-I04: Monotonicity

Adding a risk signal must never lower urgency. Removing a reassuring answer must never create a more reassuring route.

### HB-I05: Human handoff

Every complete plan includes a practical trusted-adult step. The route must not require an optional adult name, and it must acknowledge that the safest available adult may differ from the user's first choice.

### HB-I06: Immediate help is never gated

Emergency information must be visible on initial page load, before form completion, without saving, without an account, and without JavaScript. A user must not need to disclose an incident type to see it.

### HB-I07: No dangerous evidence collection

No route may instruct a user to:

- send another image or message;
- pay, bargain, or comply with a threat;
- reply only to obtain more evidence;
- download, forward, repost, or upload a private or intimate image;
- provoke or confront the other person;
- remain in contact when leaving, muting, or blocking is safe.

Evidence guidance must be limited, incident-aware, and reviewed. It must not imply that evidence collection is more important than immediate safety.

### HB-I08: Honest capability boundaries

Every plan and surrounding copy must remain consistent with these facts:

- Help Bridge does not contact anyone;
- Help Bridge does not file a platform or police report;
- Help Bridge does not remove content;
- Help Bridge does not monitor saved drafts;
- Help Bridge cannot guarantee an outcome.

### HB-I09: No persistence without explicit action

Building, viewing, navigating, or changing a plan must not store a draft. The current
prototype requires a separate "Keep in this tab for 30 minutes" action and records
schema, creation, expiry, and allowlisted structured choices only.

### HB-I10: Sensitive text exclusion

Injected `adultName`, `notes`, unknown fields, and copied private content must
never enter browser storage. The UI does not solicit them, and stored data uses an
exact schema allowlist with a 2 KB maximum.

### HB-I11: Conservative restoration

Malformed, expired, oversized, unknown-version, or semantically invalid saved state must not be restored. A restored draft must pass the same validation and routing invariants as fresh input.

### HB-I12: Translation parity

Every supported-language version must preserve emergency scope, negation, urgency, limitations, image/evidence cautions, and the distinction between emergency and non-emergency help. Crisis translations require human safeguarding approval.

## 8. Routing model and required evidence

| Route | Minimum condition | Required child-facing effect |
| --- | --- | --- |
| Urgent | Any HB-I01 signal | Move toward a safer/shared place, involve a nearby safe adult now, and use the applicable local emergency number when danger is immediate |
| Soon | No urgent signal and any HB-I03 signal | Stop escalation, involve a trusted adult today, retain only limited safe evidence, and use platform safety tools with support |
| Steady | All required risk questions valid and negative, with no elevated signal | Pause contact, preserve limited evidence, and talk with a trusted adult without implying the situation is harmless |
| Incomplete/unknown | Missing, malformed, unsupported, or uncertain immediate-risk input | Do not issue a final steady plan; ask for the missing answer or route conservatively |

For every supported incident and combination of answers, test evidence must show:

1. urgent dominance;
2. monotonicity;
3. no final steady result from incomplete immediate-risk answers;
4. image-pressure and repeated-contact escalation;
5. presence of an adult handoff;
6. absence of dangerous actions;
7. correct session-storage, expiry, and deletion behaviour.

Generated testing covers all `3^5 = 243` valid yes/no/not-sure combinations per
incident type, not only hand-picked examples.

## 9. Non-JavaScript emergency information

The initial HTML must contain a complete emergency notice that is meaningful when scripts fail, are blocked, or have not loaded. At minimum it must:

- have a visible heading identifying immediate danger;
- tell the user to move toward a safer place and involve a nearby safe adult;
- state the reviewed regional emergency number and its geographical scope;
- tell users outside that scope to use their local emergency number;
- state that the site cannot call or contact anyone;
- remain keyboard-readable, zoomable, and understandable without colour or animation.

The Germany/EU 112 statement is recorded in [the help resource registry](../../policy/help-resources.json)
against the official [European Commission 112 page](https://digital-strategy.ec.europa.eu/en/policies/112).
Non-emergency helplines require their own reviewed scope, hours and language records.

A production browser check must load the page with JavaScript disabled and verify the emergency heading, scope, capability limitation, and readable order.

## 10. Privacy and shared-device safety

### Data minimisation claim

The prototype now limits an explicitly requested draft to current-tab
`sessionStorage` and 30 minutes. That reduces but does not eliminate shared-device
and same-origin risk. Production still requires a documented decision showing why
restoration benefit outweighs the residual risk.

The expiry timestamp makes a record unusable after 30 minutes. A timer plus
visibility, focus and pageshow checks remove it while the page is active; browser
suspension can delay physical removal until the tab resumes.

At minimum, a retained save feature requires:

- explicit opt-in after a short child-readable explanation;
- only the structured allowlisted fields needed to restore the check-in;
- no name, notes, account identifier, location text, image, or free text;
- schema version, creation time, expiry time, and maximum byte size;
- automatic expiry and deletion;
- neutral initial presentation and an explicit Resume action before incident details are shown;
- one-step deletion and accurate confirmation;
- an origin-isolation assessment, because namespacing is not isolation;
- tests proving that building a plan alone never writes storage.

Client-side encryption without a secret unavailable to other device users is not a substitute for minimisation or origin isolation.

The UI must not claim that deleting the draft removes browser history, screenshots, device backups, network logs, monitoring records, or content held elsewhere.

## 11. Content and regional safety controls

- Emergency and helpline resources have an owner role, source URL, country/region, language, service type, availability notes, `lastReviewed`, and `nextReview`.
- Crisis resources and copy are reviewed before each production release and at least every three months while live.
- An overdue resource is hidden or explicitly quarantined; it is not silently treated as current.
- English content does not imply that 112 is the correct emergency number in every country.
- Translations are reviewed in rendered context, including line breaks, button labels, negation, and accessible names.
- A safeguarding reviewer verifies that evidence guidance is lawful and safe for the intended region; the product does not give definitive legal advice.
- Copy must avoid blame, shame, disbelief, or responsibility being placed on the child.

## 12. Accessibility and distress-aware interaction

Safety-critical content must:

- use short headings and concrete actions;
- avoid timers, streaks, countdown pressure, celebratory scoring, and unnecessary animation;
- retain visible focus and logical reading order;
- announce urgent changes without repeatedly overwhelming a screen reader user;
- not rely on colour alone;
- work at 200% zoom and on a narrow mobile viewport;
- allow back navigation without losing unsaved answers;
- avoid forcing the child to repeat upsetting details;
- keep the structured privacy warning, Resume and Clear controls easy to understand.

Accessibility failure in emergency information, route selection, Save/Clear, or trusted-adult handoff is release-blocking.

## 13. Misuse and failure analysis

| ID | Failure or misuse | Control | Residual risk |
| --- | --- | --- | --- |
| HB-R01 | Controlling person opens a restored draft | Prefer no persistence; otherwise explicit resume, neutral start, short TTL, deletion, origin assessment | Device-level access and monitoring cannot be prevented |
| HB-R02 | Child enters identifying details | Optional, bounded, session-only text; no logging/storage/transmission; plain-language warning | On-screen disclosure remains possible |
| HB-R03 | Child is unsafe but leaves a question unanswered | Static emergency notice; no steady plan from incomplete risk inputs | A child may leave the site without acting |
| HB-R04 | Child incorrectly answers `no` under fear or coercion | Repeated reminder that help is available and they can involve an adult at any time; no claim of certainty | The application cannot detect coercion or truthfulness |
| HB-R05 | “Trusted adult” is not actually safe | Wording says safest available adult and permits alternatives; reviewer checks escalation copy | The product cannot evaluate real relationships |
| HB-R06 | Evidence advice causes retention of harmful material | Minimal incident-specific guidance; never request an image; no forwarding/downloading/reposting | Regional law and platform behaviour vary |
| HB-R07 | Emergency number is wrong for user location | Explicit geographic scope; local-number instruction outside scope; maintained registry | Product does not know location and the user may overlook scope |
| HB-R08 | Translation reverses or weakens a safety instruction | Human safeguarding and localisation review; parity checklist; snapshot tests | Human review can still miss ambiguity |
| HB-R09 | JavaScript fails during crisis | Complete emergency notice in static HTML; progressive enhancement | Interactive plan remains unavailable |
| HB-R10 | Platform reporting fails or causes disappointment | No guaranteed-removal claim; adult-supported alternatives | External platform processes remain outside control |
| HB-R11 | Malformed local state changes routing | Strict allowlist, enum validation, expiry, fail-closed restoration, invariant tests | Same-origin code execution would bypass local validation |
| HB-R12 | Safety copy becomes stale after release | Review dates, release checks, private reporting, quarantine and rollback | Harm can occur between discovery and mitigation |

## 14. Release evidence checklist

The Release Owner must retain evidence that:

- [ ] all triage invariants pass exhaustive or generated tests;
- [ ] each immediate-risk signal independently forces urgent routing;
- [ ] incomplete immediate-risk answers cannot produce a final steady plan;
- [ ] image pressure, image shared, and repeated contact independently produce at least same-day support;
- [ ] every complete route includes a trusted-adult step;
- [ ] no route contains a prohibited action;
- [ ] building and navigating a plan creates no stored draft;
- [ ] a kept session draft contains only allowlisted fields and valid expiry metadata;
- [ ] canary names and notes do not appear in storage, URLs, logs, console output, caches, or network requests;
- [ ] Clear removes approved application state and does not overclaim broader deletion;
- [ ] the emergency notice works with JavaScript disabled;
- [ ] keyboard, screen reader, mobile, zoom, reduced-motion, and forced-colour checks pass for critical controls;
- [ ] emergency and helpline information is in date and geographically scoped;
- [ ] German and English safety meaning is equivalent where both are offered;
- [ ] deployed content matches the reviewed safety-content version;
- [ ] rollback or feature quarantine has been exercised or verified;
- [ ] unresolved residual risks have an owner role, decision, and expiry date.

## 15. Explicit pre-production blocker

**BLOCKER HB-SAFE-001 — Human safeguarding approval**

Production deployment is prohibited until a qualified human acting in the **Safeguarding Reviewer** role has reviewed and approved, in rendered context:

1. every emergency notice;
2. every triage condition and urgency label;
3. every incident-specific action and evidence instruction;
4. every statement about emergency numbers, helplines, platform reporting, and product limitations;
5. every child-facing translation of that content;
6. shared-device Keep, Resume, expiry, and Clear language;
7. the residual-risk decision for unsupported or uncertain situations.

Automated tests, technical review, machine translation, prior prototype review, or approval of one language do not satisfy this blocker. Approval must record the safety-content version, review date, reviewer role, scope, conditions, and next review date.

Until HB-SAFE-001 is closed, this safety case remains draft and Help Bridge must not be represented as production-approved.

## 16. Incident response and rollback

The following are safety-critical incidents: wrong emergency routing, missing emergency information, harmful evidence advice, leaked triage state, a misleading regional number, a materially incorrect translation, or deployment of unreviewed crisis copy.

For a safety-critical incident:

1. the Incident Coordinator classifies and records the affected version without collecting child incident details;
2. the Release Owner quarantines Help Bridge or rolls back to the last approved safety-content version;
3. the Content Governance Reviewer disables any disputed external resource;
4. the Privacy Reviewer assesses any data exposure using minimal incident records;
5. the Safeguarding Reviewer approves corrected copy and regression cases;
6. the Security Reviewer verifies deployment integrity and storage/network boundaries;
7. a blameless review updates this safety case, tests, and content review date.

Public issue templates must instruct reporters not to upload private images, names, messages, account identifiers, locations, or details identifying a child. A private reporting path must be available.

## 17. Ownership and approval roles

| Decision | Accountable role |
| --- | --- |
| Product safety claim and residual-risk acceptance | Product Safety Owner |
| Triage, crisis copy, evidence guidance, and emergency resources | Safeguarding Reviewer |
| Persistent-data decision, retention, and notices | Privacy Reviewer |
| Storage, XSS, URL, header, repository, and deployment controls | Security Reviewer |
| Child-facing semantic parity across languages | Localisation Reviewer with Safeguarding Reviewer |
| Critical-flow accessibility | Accessibility Reviewer |
| Test evidence, deployment match, quarantine, and rollback | Release Owner |
| Incident coordination | Incident Coordinator |

Roles must be assigned before production. A single person may hold multiple roles only where governance permits, but the author of a crisis-copy change must not be its sole safeguarding approver.

## 18. Change triggers

This safety case must be reopened before release when any of the following changes:

- incident categories, questions, answer choices, routing rules, or urgency labels;
- emergency numbers, helplines, evidence advice, platform-reporting advice, or trusted-adult wording;
- language, translation, layout, reading order, or accessible announcement behaviour;
- storage fields, retention, expiry, resume behaviour, origin, analytics, or network requests;
- live chat, upload, account, location, AI, reporting, moderation, or human-contact features;
- intended age range, country, school use, or deployment environment;
- an incident or user study reveals misunderstanding or unsafe behaviour.

No approval of the current static prototype extends automatically to any such change.
