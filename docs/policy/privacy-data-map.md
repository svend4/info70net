# Privacy and data map

**Review date:** 2026-07-12

**Architecture reviewed:** current dependency-free static prototype

**Status:** internal engineering record; not a public privacy notice, legal opinion, or compliance guarantee

## Architecture summary

The current app has no project backend, account service, analytics service,
advertising service, remote log collector, or live AI provider. JavaScript and
styles are served from the same project. The shared storage helpers use
`localStorage` only for deliberately longer-lived choices and `sessionStorage`
for current-tab progress. Both have separate in-memory fallbacks. The
[storage manifest](../../policy/storage-manifest.json) is the source of truth for
keys, triggers, fields, sensitivity, and retention.

The app does not intentionally synchronise local state. A browser, operating
system, managed device, backup tool, or shared user profile may nevertheless expose
or preserve browser storage outside the app's control. Product copy must not promise
that local storage is secret or impossible to recover.

Safe Search contains outbound links. No request is made to those destinations until
the user opens a link. The destination then receives an ordinary web request and may
process network and device information under its own policies. Current result links
open with `noopener noreferrer`.

## Current data inventory

| App or component | Namespace and key | Data | When written | Location and recipients | Current deletion and retention | Risk and required follow-up |
| --- | --- | --- | --- | --- | --- | --- |
| Shared storage helpers | Per-app prefix in `localStorage` or `sessionStorage`; separate in-memory fallbacks | JSON-serialised allowlisted values supplied by each app | At the product triggers listed below | Browser origin on the device; no project server recipient | Namespace-aware `remove`/`clear`; session values end with the tab; Help Bridge adds a product TTL | Document strict necessity under [TDDDG Section 25](https://www.gesetze-im-internet.de/ttdsg/__25.html) or obtain valid consent before non-essential storage. Namespaces prevent collisions but are not confidentiality boundaries. |
| Safe Search saved sources | `safe-search:saved` | IDs of curated catalogue entries | User explicitly saves or unsaves a result | Device browser only | Until unsaved, site data is cleared, or storage is otherwise removed; no current expiry | Low sensitivity in isolation, but interests can reveal information about a user. Keep catalogue IDs only; never add child IDs or profiles. |
| Safe Search history preference | `safe-search:history-opt-in` | Boolean preference | Only when the user enables the checkbox | Device browser only | Removed when history is disabled | The default is false. If no preference exists, legacy stored history is removed. |
| Safe Search history | `safe-search:history` | Up to six entries with query text (maximum 120 characters), category, result count, timestamp, and ID | Only for searches after explicit opt-in | Device browser only | Clear-history action, disabling opt-in, or browser-site-data deletion | Query text can reveal interests or concerns. It remains page-memory only by default and is never transmitted by the app. |
| Safe Search outbound navigation | No project storage key | Requested destination; ordinary request metadata is processed by the external site after click | User opens a result | External destination selected by the user | Determined by the destination, not this repository | Maintain `noopener noreferrer`, avoid embeds and tracking redirects, show that the user is leaving the project where appropriate, and review destination privacy/safety under the content policy. |
| Media Time plan | `media-time:weekly-plan` | Minutes for learning, creative, and offline activity for each day of the week | Automatically when a planner value changes | Current tab's `sessionStorage` only | Direct reset action or tab/session close | A routine can reveal household habits. On load, this version removes any legacy `localStorage` copy under the same key. |
| Help Bridge working form | No persistent key until Keep | Incident category; safety, threat, location-knowledge, repeated-contact and image-sharing answers; trusted-adult role | Held in page memory while the user completes the form | Current browser page only | Lost on reset/close/reload unless browser behaviour outside the app preserves form state | The UI does not request a name, account handle, location, image, private message, or free-text narrative. Never transmit form state in the static prototype. |
| Help Bridge temporary draft | `help-bridge:triage-draft` | Schema version, creation/expiry timestamps and allowlisted structured choices, maximum 2 KB | Only after "Keep in this tab for 30 minutes" | Current tab's `sessionStorage` only | Unusable after 30 minutes, tab close, or direct clear; active-tab timer and resume/focus checks remove invalid records | Browser suspension can delay physical removal until the tab resumes, so same-origin residual risk remains. Legacy persistent copies are removed on load. Production remains blocked pending human safeguarding review. |
| AI Literacy progress | `ai-literacy:exercise-progress` | Schema version and, per exercise ID, selected answer IDs plus a correctness boolean | Automatically when the user checks an answer | Current tab's `sessionStorage` only | Direct reset action or tab/session close | Do not treat this as an ability, school-performance, or behavioural profile. On load, this version removes any legacy persistent copy. |
| Safety & Privacy deletion control | No new key | Known Small Steps key prefixes only | Explicit removal action | Current origin's persistent local storage and current tab's session storage | Immediate removal of matching toolkit prefixes available to that page | It deliberately avoids `clear()`, so unrelated XAMPP applications are not erased. Other tabs retain their own session data; browser history, host logs, and external-site data are outside this control. |
| Static server and hosting environment | Outside app code | A hosting stack may create ordinary access/security logs such as IP address, time, path, user agent, and error details | When deployed and requested | Hosting operator and authorised infrastructure providers | Not defined by this repository | Before deployment, inventory the actual host, log fields, processors, location, access, security, and deletion period. Disable or minimise logs not needed for security and operation. Do not log form values or URL parameters containing child data. |

## Data deliberately not collected by the prototype

- account identity, email address, telephone number, postal address, or school;
- date of birth, identity document, face, voice, biometric, or precise location;
- contacts, messages, social graph, device advertising identifier, or cross-site ID;
- uploaded image, screenshot, incident evidence, or intimate content;
- Help Bridge adult name or free-text note in persistent storage;
- remote analytics events, crash reports, advertising profiles, or AI prompts.

Tests, fixtures, screenshots, issues, and pull requests must use synthetic data. They
must not contain a real child's details or real incident material. See
[SECURITY.md](../../SECURITY.md).

## Current processing decisions

1. **No server data by default.** The current feature set must remain usable without
   an account, remote telemetry, or third-party SDK.
2. **Search history is opt-in.** Queries remain page-memory only unless the user
   enables history; disabling it deletes persistent query history.
3. **Help Bridge is short-lived and explicit.** Its structured draft uses current-tab
   storage with a 30-minute TTL, a 2 KB maximum and explicit Resume. Unknown,
   malformed, oversized and expired records fail closed.
4. **Identifying text is not requested.** Help Bridge uses structured choices and
   tells users not to enter names, handles, locations, messages or images.
5. **Automatic planning and learning progress is tab-scoped.** Media Time and AI
   Literacy use session storage, not persistent storage.
6. **Storage failure is non-fatal.** The in-memory fallback avoids pressure to weaken
   browser privacy settings.
7. **No hidden parent or school feed.** Nothing is sent to another person or account.

These are architectural facts at the review date, not promises about an unknown
future host or browser. They must be reverified in release testing.

## Production data decision gates

| Proposed change | Default decision | Evidence required before approval |
| --- | --- | --- |
| Accounts or cloud sync | Do not add until a clear child benefit cannot be met locally | Purpose and field map; lawful basis; age/consent analysis; child-readable privacy information; processor and transfer review; authentication and recovery threat model; deletion/export design; DPIA threshold assessment |
| Analytics | No behavioural or third-party analytics | A decision question that cannot be answered safely another way; aggregate/minimal event design; TDDDG necessity or consent analysis; retention; access; child-rights and re-identification assessment |
| Child safety report or support case | Do not collect through this prototype | Named trained service owner; safeguarding and emergency protocol; hours and response objectives; legal basis; confidentiality limits; Article 9 analysis; DPIA; secure case system; access audit; retention/deletion; child-readable explanation and appeal |
| UGC, chat, profile, or upload | Do not enable by default | DSA/JuSchG/JMStV classification; CRIA and DPIA; safe defaults; moderation; notice and action; block/report/appeal; grooming and abuse controls; staffing; law-enforcement request process; abuse testing |
| Age assurance | No exact birth date or identity collection for the present content | Legal or risk-based threshold; proportionality analysis; minimal attribute; vendor and transfer review; security; error/appeal path; deletion; accessibility and discrimination testing |
| AI input or output | No child input may be sent to an AI provider without a separate approved design | AI Act role/risk classification; provider contract and data-use settings; prompt minimisation; retention/training prohibition where achievable; redaction; child safety testing; human oversight; DPIA/CRIA; incident and rollback plan |
| Parent or educator dashboard | No hidden monitoring | Child benefit and rights analysis; visibility to the child; age-appropriate control; least intrusive fields; no confidential Help Bridge content; role/access model; misuse and domestic-safety assessment |

## Retention standard

The production owner must maintain a retention schedule containing the category,
purpose, start event, duration, deletion method, backup treatment, owner, and legal
hold rule. "Keep indefinitely" and "until no longer needed" are not acceptable
durations without a narrower documented rule.

Help Bridge has a tested 30-minute expiry. Media Time and AI Literacy end with the
tab session. Safe Search starred resources and opted-in history remain until a clear
or disable action or browser-site-data deletion. Before production, record the TDDDG
decision and consider a time-based expiry for opted-in query history.

## Security controls for future personal data

- TLS in transit and appropriate encryption at rest;
- separation of identifiers from sensitive content where identification is needed;
- least privilege, multifactor authentication for privileged access, and periodic
  access review;
- structured logging that excludes prompts, notes, images, secrets, and request
  bodies containing child data;
- tested deletion, backup expiry, export, incident response, and breach assessment;
- processor inventory, documented instructions, location/transfer review, and
  contractual safeguards;
- development, support, and moderation environments that use synthetic data;
- no production data copied to local developer devices or public collaboration tools.

These controls reflect [GDPR Articles 5, 25, 32 and 35](https://eur-lex.europa.eu/eli/reg/2016/679/2016-05-04/eng)
and the child-specific transparency rule in Article 12. They are minimum project
controls, not proof that a particular future processing operation is lawful.

## Ownership and review

Before operating a production service, the responsible legal entity, controller
role, privacy contact route, processor list, and competent supervisory context must
be documented. This repository does not currently identify or invent those details.

Review this map whenever a storage schema, host, external link, dependency,
permission, data field, recipient, retention rule, account feature, AI provider, or
user population changes.
