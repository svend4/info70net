# Child safety product standard

**Review date:** 2026-07-12

**Applies to:** all four prototypes and any future service derived from them

**Status:** mandatory project policy; not a guarantee that all legal or safeguarding duties have been satisfied

## Purpose

This standard turns the project's child-rights and safety commitments into
testable product rules. It protects children's privacy, safety, agency, access to
information, and ability to seek help without treating protection as surveillance.

The present repository is a static educational prototype. It does not accept
reports, contact children, moderate UGC, provide counselling, or dispatch emergency
help. A future production service may not imply that it performs any of those
functions until the people, processes, availability, and oversight genuinely exist.

## Governing principles

1. **Best interests with all rights considered.** Safety decisions must also
   consider privacy, non-discrimination, participation, access to information,
   evolving capacities, accessibility, education, and play.
2. **Safety, privacy, and security by design.** Protective defaults are part of
   architecture and acceptance criteria, not an optional settings layer.
3. **Least intrusive effective control.** Prefer content design and restricted
   functionality over identity collection or continuous monitoring.
4. **Child agency.** Explain controls, give meaningful choices, and provide an easy
   route back to a safer default without shame or punishment.
5. **No commercial exploitation.** Do not use behavioural advertising, paid
   pressure, artificial scarcity, loot-box-like mechanics, streaks, or purchase
   prompts aimed at children.
6. **Honest capability boundaries.** Never describe a static plan, automated
   result, or unstaffed form as counselling, emergency response, trusted reporting,
   or professional advice.

These principles align with the [UN Committee on the Rights of the Child General
Comment No. 25](https://documents.un.org/api/symbol/access?l=en&s=CRC%2FC%2FGC%2F25&t=pdf),
[DSA Article 28](https://eur-lex.europa.eu/eli/reg/2022/2065/oj/eng), the
[Commission's 2025 minors guidelines](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ%3AC_202505519),
and [JuSchG Section 24a](https://www.gesetze-im-internet.de/juschg/__24a.html).

## Current prototype requirements

### Shared requirements

- No account, remote analytics, tracking pixel, advertising SDK, chat, upload, or
  public profile.
- No unnecessary device permission and no automatic external request.
- User input must be escaped or inserted as text, never concatenated into HTML.
- Persistent storage must be named, minimal, visible to the user, and clearable.
- Every important action must work by keyboard and expose an understandable name,
  state, error, and result to assistive technology.
- Wording must be calm, concrete, non-blaming, and appropriate for the stated
  audience. It must not diagnose a child or promise an outcome.
- A safety limitation must appear at the point where a user might otherwise infer
  professional, reporting, or emergency capability.

### Safe Search

- Results remain a manually curated catalogue, not a claim that the open web has
  been searched or certified safe.
- Every destination must pass the source and outbound-link review in
  [content-governance.md](./content-governance.md).
- Exact query history is page-memory only by default. Persistent history requires
  explicit opt-in and has direct clear and disable actions.
- Opening an external destination is a deliberate user action. Links must retain
  `noopener noreferrer`; the interface must not embed third-party trackers.
- A listed source is not permanently approved. Content and ownership can change.

### Media Time

- The planner supports family discussion and child agency; it is not a surveillance
  dashboard, behavioural score, clinical measure, or universal health rule.
- Recommendations must be framed as prompts, not diagnoses or moral judgements.
- The child must be able to see and change the plan; the product must not secretly
  report activity to a parent, school, advertiser, or other third party.
- Avoid gamification that rewards longer use of the planner itself.

### Help Bridge

- Help Bridge remains a planning tool, not an emergency, counselling, evidence
  storage, or reporting service.
- The default is no stored draft. "Keep in this tab" is explicit, stores only the
  structured fields in [privacy-data-map.md](./privacy-data-map.md), and expires
  after 30 minutes or when the tab session closes.
- Names, handles, contact details, free-text notes, exact locations, evidence, and
  images must never enter browser storage in the current prototype.
- The interface must tell users not to paste or upload private images. The project
  must never request intimate or abuse-related imagery.
- Urgent answers must prompt the user to move to immediate human help, such as a
  nearby trusted adult or local emergency service. The interface must not claim that
  the project has received, reviewed, or escalated the situation.
- Clearing a draft must be direct and remove the project record and its expiry timer
  from the current tab namespace.

### AI Literacy Lab

- Fixed exercises must be described as educational examples, not live AI output or
  a complete fact-check.
- Correct-answer explanations must distinguish evidence, uncertainty, missing
  perspectives, and prompt quality.
- Progress must not become a hidden ability, school-performance, or behavioural
  profile.
- The static lab must not imply that completing it proves legal AI literacy for an
  organisation under Article 4 of the AI Act.

## Prohibited product patterns

The following may not be introduced without changing this standard, completing the
required impact assessments, and passing a production release review:

- public profiles, discoverability, direct messages, comments, live streams, or UGC;
- collection of exact birth dates, identity documents, face or voice biometrics;
- location sharing, contact-book upload, background monitoring, or hidden parent mode;
- behavioural advertising, commercial profiling, affiliate pressure, or paid ranking;
- streaks, infinite scroll, autoplay, deceptive notifications, popularity counts, or
  variable-reward mechanics designed to prolong use;
- AI companions, emotion inference, automated grooming-risk labels, or automated
  decisions about emergency response, discipline, access to help, or education;
- storage or transmission of child incident evidence, intimate images, names,
  handles, addresses, or free-text disclosures through repository or project tooling.

## Future production gates

### Accounts, contact, or UGC

Before implementation:

1. classify the service under the DSA, JuSchG, and JMStV;
2. complete a child-rights impact assessment and GDPR DPIA threshold assessment;
3. design private-by-default accounts and age-appropriate permissions;
4. establish trained moderation and safeguarding ownership, coverage, escalation,
   audit, appeal, and response-time objectives;
5. provide child-friendly, accessible, confidential-by-default reporting and an
   explanation of what happens next;
6. test block, mute, report, delete, and account-recovery flows with children and
   accessibility specialists using synthetic scenarios;
7. prevent unknown contact and disable non-essential location, camera, microphone,
   downloads, autoplay, push notifications, read receipts, and recommendations by
   default.

### AI

Before an AI feature is exposed to a child:

1. classify provider and deployer roles and determine AI Act risk status;
2. complete child-rights, safety, privacy, security, and misuse assessments;
3. make the feature off by default, optional, and easy to leave;
4. keep a persistent child-readable notice that it is AI, not a person, and can be
   wrong;
5. prevent the model from requesting secrets, private images, contact details, or
   migration to another channel;
6. prohibit commercial nudging and simulated emotional dependency;
7. implement tested human escalation without representing AI output as a final
   safeguarding decision;
8. document model, version, purpose, limitations, tests, monitoring, rollback, and
   incident response.

The AI requirements reflect [AI Act Articles 4, 5 and 50 and Annex III](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng).
Article 50 applies from 2026-08-02, shortly after this review date.

## Child participation

Child participation must be voluntary, age-appropriate, accessible, safeguarded,
and proportionate. Research must use synthetic scenarios and must not invite
children to disclose real incidents. Recruitment, assent, any required guardian
permission, incentives, recordings, retention, researcher access, and distress
protocols must be approved before sessions begin.

Feedback must be recorded as product evidence without names or unnecessary
demographics. The team must show how children's views affected the decision or why
a different course was necessary. Participation is not permission to transfer the
team's safeguarding responsibility to children.

## Safety review record

Every material feature review must record:

- intended age range, benefit, and foreseeable use;
- contact, conduct, content, contract/commercial, and cross-cutting risks;
- differential effects on younger children, disabled children, and other groups;
- privacy and security data flows;
- safer alternatives considered;
- mitigations, test evidence, residual risk, owner, and review trigger;
- child-participation evidence, where appropriate;
- unresolved questions requiring specialist or legal advice.

Passing this review means the documented project gate was followed. It is not a
legal guarantee and must not be described as one.
