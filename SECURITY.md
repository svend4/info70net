# Security policy

**Review date:** 2026-07-12

**Project status:** static child digital-safety prototype, not an emergency or incident-reporting service

## Critical child-safety boundary

**Never place a real child's incident details or images in a public GitHub issue,
discussion, pull request, commit, test, screenshot, build log, or documentation.**

This prohibition includes names, faces, intimate or abuse-related images, handles,
messages, school, address, precise location, contact details, identifiers, medical or
sexual information, and any narrative or evidence that could identify a child or
another person. Do not upload, forward, clone, or quote such material to demonstrate
a bug.

Use synthetic data for every security report and proof of concept. If a child or any
person may be in immediate danger, contact an appropriate local emergency service or
qualified child-protection service. This repository is not monitored or staffed as
an emergency channel and cannot receive or act on a safeguarding report.

## Report a vulnerability privately

Report suspected vulnerabilities through GitHub's private vulnerability reporting
form:

**[Open a private security report for `svend4/info70net`](https://github.com/svend4/info70net/security/advisories/new)**

GitHub explains the private process in its
[official private vulnerability reporting documentation](https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/privately-reporting-a-security-vulnerability).

Do not disclose vulnerability details in a public issue, discussion, pull request,
fork description, commit message, or social post. If the private form is unavailable,
do not publish the details; use a previously established private channel with the
repository owner or wait for private reporting to become available. No security
email address is asserted by this repository.

## What to include

Use synthetic values and provide only what is necessary:

- affected commit, tag, URL, app, and browser or runtime version;
- vulnerability type and realistic impact;
- minimal, repeatable steps or a synthetic proof of concept;
- expected and actual result;
- whether the issue affects confidentiality, integrity, availability, child safety,
  privacy, external navigation, browser storage, or accessibility of a safety flow;
- suggested mitigation, if known;
- any deadline you believe is material, with the reason.

Do not attach a production database, access token, private log, browser profile,
real message, image, or child incident. Redact secrets and personal data. A report
that cannot be demonstrated without real child material should describe the data
shape with synthetic placeholders instead.

## Relevant vulnerability classes

Examples include:

- cross-site scripting, HTML/script injection, unsafe URL handling, or open redirect;
- exposure or cross-namespace deletion of browser-stored data;
- accidental transmission of Help Bridge input, names, notes, or structured incident
  choices;
- third-party requests, telemetry, tracking, or dependencies not disclosed by the UI
  and privacy map;
- deployment misconfiguration such as missing HTTPS or unsafe content, frame,
  referrer, caching, or MIME policies;
- path traversal or unintended file disclosure by a server used with the project;
- supply-chain, workflow, secret, branch-protection, or release-integrity issue;
- a flaw that bypasses a child-safety control, hides urgent guidance, or exposes a
  child to an unreviewed external destination;
- an accessibility defect that makes a critical safety, clear-data, or exit action
  unavailable to a user with a disability.

A normal typo, non-sensitive broken link, or feature request may use a public issue.
Do not use a public issue when the report includes a security exploit, private data,
or a real child's situation.

## Safe research boundaries

Security research must not:

- involve or target real children;
- request, collect, retain, transmit, or access real personal or incident data;
- use social engineering, credential theft, impersonation, or contact with users;
- degrade service, perform denial of service, send high-volume traffic, or damage data;
- obtain persistence, move laterally, or access more information than required to
  demonstrate a synthetic issue;
- test an external Safe Search or help destination without that operator's separate
  authorisation;
- make a vulnerability public before coordinated remediation and disclosure have
  been discussed privately.

Stop when the issue is demonstrated with the least access possible. Delete synthetic
test state when it is no longer needed. This policy does not grant authorisation to
test systems, accounts, or infrastructure not owned by the repository operator and
does not provide a legal safe-harbour guarantee.

## Maintainer process

Private reports should be handled inside the GitHub security advisory:

1. confirm receipt without requesting child data;
2. reproduce with synthetic data in an isolated environment;
3. assess technical, privacy, accessibility, and child-safety impact;
4. restrict access to people needed for remediation;
5. prepare a fix, regression test, release and rollback plan;
6. coordinate disclosure and credit with the reporter where appropriate;
7. update the threat model, privacy map, content controls, and release checklist.

No response time, remediation deadline, bounty, credit, or production support level
is guaranteed by this prototype policy. Status and coordination should remain in the
private GitHub report.

## Current security properties and limitations

At the review date, the repository has no backend, account database, analytics,
advertising, UGC, upload, messaging, payment, or live AI integration. App-owned
state uses namespaced browser `localStorage` or `sessionStorage`, with separate
in-memory fallbacks. Media Time, Help Bridge, and AI Literacy remove legacy
persistent copies of their current tab-only keys on load. Help Bridge writes only
after an explicit 30-minute Keep action, enforces an allowlisted 2 KB schema, and
requires an explicit Resume before incident choices are shown.
Shared renderers escape configured text, and current outbound Safe Search links use
`noopener noreferrer`.

These properties reduce attack surface but do not make a deployment secure by
themselves. The hosting server, headers, TLS, logs, cache, domain, CI, repository
permissions, external destinations, browser extensions, shared devices, and future
features require separate review. Follow
[docs/policy/release-checklist.md](docs/policy/release-checklist.md) for each release.

Where personal data is introduced, security measures must be proportionate to risk
under [GDPR Article 32](https://eur-lex.europa.eu/eli/reg/2016/679/2016-05-04/eng),
and high-risk processing requires the assessment described in Article 35. This
reference is not a conclusion that a particular deployment complies.
