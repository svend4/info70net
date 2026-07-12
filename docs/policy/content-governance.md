# Content governance policy

**Review date:** 2026-07-12

**Scope:** interface copy, exercises, safety guidance, curated results, outbound links, translations, metadata, and documentation

**Status:** project policy; not a legal, medical, psychological, or safeguarding certification

## Objectives

Content must help children and families act safely without overstating the project's
authority. It must be age-appropriate, accessible, evidence-based, calm, current,
and clear about what the product cannot do.

The current repository publishes a fixed static catalogue and fixed educational
flows. It has no UGC moderation operation. The production requirements below become
mandatory before adding dynamic feeds, user submissions, live support, or AI output.

## Roles

A release record must identify people performing these roles. One person may hold
more than one role only when the review remains meaningfully independent for the
risk involved.

- **Content owner:** defines purpose, audience, source evidence, and review date.
- **Child-safety reviewer:** checks risk, age appropriateness, capability claims,
  escalation wording, and foreseeable misuse.
- **Privacy and security reviewer:** checks requested information, storage,
  outbound disclosure, tracking, and sensitive examples.
- **Accessibility reviewer:** checks structure, plain language, alternatives,
  interaction instructions, and assistive-technology behaviour.
- **Localisation reviewer:** checks meaning, cultural context, reading level, and
  consistency in each published language.
- **Release approver:** confirms required evidence and unresolved-risk decisions.

No role title implies professional licensing. Where content requires legal,
clinical, counselling, law-enforcement, or specialist safeguarding judgement, the
project must obtain an appropriately qualified review rather than infer expertise.

## Source hierarchy

Use the most direct and authoritative source reasonably available:

1. binding legislation and official consolidated legal text;
2. official regulator, ministry, standards body, or UN guidance;
3. the destination organisation's own current service information;
4. established child-safety, education, or research organisations with transparent
   methods and current publication details;
5. secondary explanation only when primary material is unavailable, recorded as
   such and not presented as law.

Legal and standards statements must link to primary official sources such as
[EUR-Lex](https://eur-lex.europa.eu/), [BfDI](https://www.bfdi.bund.de/),
[BzKJ/KidD](https://www.bzkj.de/bzkj/anbieterpflichten/strukturelle-vorsorgemassnahmen),
an official state consolidation of the
[JMStV](https://gesetze.berlin.de/bsbe/?aiz=1&docId=jlr-JMedienSchStVtrBErahmen),
[W3C WCAG](https://www.w3.org/TR/WCAG22/), or the
[UN Treaty Body database](https://documents.un.org/api/symbol/access?l=en&s=CRC%2FC%2FGC%2F25&t=pdf).

Search summaries, generated text, screenshots, and memory are discovery aids, not
final authority. Every material safety or legal claim must be verified at the source.

## Content risk classes

| Class | Examples | Approval and presentation rule |
| --- | --- | --- |
| C0 - general educational | Search literacy, balanced planning, source checks | Content owner plus normal accessibility and localisation review |
| C1 - sensitive educational | Bullying, hate speech, pressure involving images, privacy, misleading AI | Child-safety review; calm non-graphic language; no real incident material; clear next step and limitation |
| C2 - urgent or safeguarding | Direct threat, location exposure, immediate physical safety, abuse-reporting route | Qualified safeguarding review before production; prominent human-help route; tested escalation wording; no promise that the project receives or acts on a case |
| C3 - prohibited repository content | Intimate or abuse-related child images, real child incident evidence, identifying details, operational exploitation instructions | Must not be stored in the repository, issue tracker, pull request, screenshot, test, or documentation; follow [SECURITY.md](../../SECURITY.md) |

## Editorial rules

- State the audience and purpose of each page or exercise.
- Use direct, non-blaming language. Do not imply that harm is the child's fault.
- Do not diagnose, score risk as a clinical conclusion, or guarantee safety.
- Separate facts, legal requirements, project policy, design recommendations, and
  unresolved questions.
- Date time-sensitive content and retain the supporting official URL.
- Explain acronyms and avoid legal or technical jargon in child-facing copy.
- Give children a concrete safe action without requiring them to disclose details.
- Do not request names, handles, locations, school, contact details, evidence, or
  images when the feature does not need them.
- Never ask a user to forward, download, reproduce, or publicly share an intimate
  image. Evidence guidance must minimise copying and distribution.
- Do not imply endorsement by a linked organisation or authority.
- Do not call a destination, result, or platform "safe" without defining the limited
  basis and date of the assessment. Prefer "curated" or "reviewed against the listed
  criteria."

## App-specific rules

### Safe Search

Each catalogue entry must have a recorded owner, canonical URL, intended age range,
reason for inclusion, latest review date, and reviewer. Review must consider:

- current ownership, purpose, and reputation;
- child-appropriate content and discoverability of unsuitable adjacent content;
- advertising, commerce, tracking, sign-up, chat, UGC, uploads, and outbound links;
- accessibility and mobile usability;
- privacy information and whether navigation exposes the child to new profiling;
- whether the link still lands on the reviewed content.

Safety/help destinations must be checked at least every 90 days; other catalogue
destinations at least every 180 days and before a release that changes the catalogue.
An automated link check is useful but does not replace content review. A failed,
redirected, sold, materially changed, or compromised destination must be disabled
until reviewed.

### Media Time

Planning suggestions must be presented as adjustable prompts, not universal medical
limits. Content must recognise age, disability, education, creativity, social
connection, sleep, movement, family context, and the child's voice without converting
them into surveillance metrics. Any health claim requires a current authoritative
source and appropriate expert review.

### Help Bridge

The limitation "planning tool, not an emergency or reporting service" must remain
visible where a user builds or saves a plan. Guidance must:

- prioritise immediate human help when the answers indicate immediate danger;
- avoid promising confidentiality that the browser, device, or future service cannot
  guarantee;
- avoid requesting or storing evidence in the prototype;
- distinguish emergency, trusted-adult, counselling, platform-reporting, and
  evidence-minimisation routes;
- never state that a report has been sent or reviewed when it has not;
- use only verified independent help destinations and record their scope, hours,
  location coverage, age conditions, privacy limits, and last review date.

### AI Literacy Lab

Exercises must separate source evidence, recency, perspective, bias, uncertainty,
and prompt quality. Examples must not reproduce personal prompts or confidential
model output. A model name, capability, law, or current event must be checked as of
the stated review date. Fixed examples must not be represented as live AI.

## External-link decision record

For every child-facing external link, record:

- canonical URL, organisation, and jurisdiction;
- product purpose and child benefit;
- target age and language;
- reviewed page and relevant adjacent pathways;
- advertising, tracking, account, UGC, contact, payment, and permission risks;
- accessibility observations;
- review date, reviewer, decision, and next review trigger;
- fallback or removal plan.

The current `SAFE_RESULTS` fields provide only a time-bounded prototype metadata
gate for URL ownership, evidence and review dates. They are not the complete
production decision record above. A controlled/public preview remains blocked until
the full destination-risk, accessibility, adjacent-pathway and removal-plan register
is completed and reviewed.

Outbound links must use secure HTTPS unless a documented exceptional source cannot.
Do not use tracking or affiliate redirects. Opening a link must be a deliberate user
action. The project cannot control the destination after navigation and must not
suggest otherwise.

## Localisation

Machine translation may support a draft but may not be the sole review for C1 or C2
content. A reviewer competent in the target language must check safety meaning,
tone, reading level, emergency terminology, cultural assumptions, and link coverage.
Do not mix languages inside one safety flow unless the switch is intentional and
clearly labelled.

## Change and release workflow

1. Open a scoped change with audience, purpose, content class, source links, and date.
2. Draft using synthetic examples only.
3. Perform the role reviews required by the content class.
4. Check links, HTML semantics, keyboard flow, small screens, zoom, and screen-reader
   announcements.
5. Run repository tests and validation.
6. Record unresolved questions and the person accepting any residual product risk.
7. Merge only when the applicable items in
   [release-checklist.md](./release-checklist.md) are complete.

Urgent correction of dangerous, materially false, compromised, or privacy-exposing
content may be expedited. The correction still requires a documented retrospective
review. Never reproduce a child's identifying details or incident material in the
change record.

## Future dynamic content and UGC

Dynamic feeds, submissions, messaging, uploads, or AI-generated guidance may not be
enabled using this static-content process alone. Before implementation, establish:

- DSA/JuSchG/JMStV applicability and child-readable terms;
- moderation rules, trained staffing, coverage, priority, quality assurance, and
  reviewer wellbeing support;
- child-friendly notice, report, block, appeal, and remedy flows;
- illegal-content and imminent-life/safety escalation procedures;
- privacy, security, evidence handling, retention, access logging, and DPIA;
- algorithmic and recommender testing, explanation, monitoring, and rollback;
- transparent publication of capabilities and response expectations.

Following this process demonstrates the project's review discipline. It does not
guarantee that content, a destination, or a future service is legally compliant or
free from harm.
