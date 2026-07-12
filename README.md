# Digital safety prototypes

This repository contains four small, focused product prototypes for young people and families. They share a dependency-free foundation while keeping each product free to develop its own interaction model.
The visible [Safety & Privacy page](./safety.html) explains the exact browser
storage, external-link boundary, deletion controls, and product limits in plain
language. Repository policies turn those statements into release gates. This is a
development prototype, not a legal compliance certification, emergency service, or
substitute for human safeguarding review.


| App ID | Product focus |
| --- | --- |
| `safe-search` | Purpose-led searching and source awareness |
| `media-time` | A balanced, editable weekly media plan |
| `help-bridge` | Calm support paths for difficult online situations |
| `ai-literacy` | Short exercises for checking and improving AI output |

Safe Search and Media Time are presented in German; Help Bridge and AI Literacy are presented in English. The portal preserves each app's language instead of mixing languages inside a workflow.

## Run the checks

Node.js 22 or newer is sufficient; there is nothing to install.

```sh
npm test
npm run validate
npm run policy
```

The test suite checks the public shared API, safe HTML rendering, storage
boundaries and expiry, all 243 tri-state Help Bridge combinations per incident
type, the policy page, and each app's pure product logic. The validator checks
structure and languages. The policy gate checks prototype review metadata, declared
link shape, prohibited network APIs across product JavaScript, policy files, and the
storage manifest. It does not replace live redirect, destination, or hosting review.

### Browser smoke check

The optional smoke check drives an isolated Chrome tab through the site,
verifies one complete loop in every app, checks browser storage, and writes
responsive screenshots to the ignored `artifacts/` directory.

For XAMPP, place this repository at `C:\xampp\htdocs\info70net`, start Apache,
and use the default `http://127.0.0.1/info70net` origin. A different folder or a
temporary static server is supported by setting `APP_ORIGIN`; the smoke script
does not require a particular server implementation.

Start Chrome with a separate local test profile in another PowerShell window:

```powershell
& "$env:ProgramFiles\Google\Chrome\Application\chrome.exe" --headless=new --remote-debugging-port=9223 --user-data-dir="$env:TEMP\small-steps-smoke" about:blank
```

Then run:

```sh
npm run smoke
```

`APP_ORIGIN`, `CDP_ORIGIN`, and `ARTIFACT_DIR` can override the defaults.

## Shared foundation

The public module is `packages/shared/src/index.js`.

- `getAppConfig(id)` returns the immutable configuration for one of the four known IDs, or `null` for an unknown ID.
- `escapeHTML(value)` converts a value to safe text for HTML interpolation.
- `renderAppIntro(config)` renders an accessible product introduction with a safe in-page action target.
- `renderExperienceCards(items)` renders a semantic list of escaped, keyboard-operable intent links.
- `createStorage(namespace)` creates a persistent, namespaced JSON store; `createSessionStorage(namespace)` provides the same API for the current tab session.

Safe Search keeps exact query history in page memory by default. Persistent history
requires an explicit checkbox; starred curated-resource IDs remain until removed.
Media Time and AI Literacy progress use current-tab session storage. Help Bridge
stores nothing until an explicit action, then keeps only an allowlisted structured
record in session storage for 30 minutes. Names and free-text notes are never stored.
Storage restrictions and quota failures fall back to separate in-memory stores.

The machine-readable source of truth is
[`policy/storage-manifest.json`](./policy/storage-manifest.json), with the full
human-readable map in
[`docs/policy/privacy-data-map.md`](./docs/policy/privacy-data-map.md).

The shared stylesheet is `packages/shared/styles/base.css`. It uses system fonts,
visible focus, reduced-motion and forced-colour support, and makes no external request.

## Integration example

```js
import {
  getAppConfig,
  renderAppIntro,
  renderExperienceCards,
} from '../../packages/shared/src/index.js';

const config = getAppConfig('safe-search');

document.querySelector('#app-intro').innerHTML = renderAppIntro(config);
document.querySelector('#experiences').innerHTML = renderExperienceCards(
  config.domainExperiences,
);
```

Include the foundation styles from an app HTML file:

```html
<link rel="stylesheet" href="../../packages/shared/styles/base.css">
```

All strings passed to a renderer are escaped. Apps should use DOM text properties for later updates and should never concatenate user input into markup.

## Repository layout

```text
apps/                         App-owned interfaces and interaction logic
packages/shared/src/index.js  Shared data and browser utilities
packages/shared/styles/       Shared accessible design foundation
scripts/                      Repository validation
scripts/check-policy.mjs      Automated metadata/storage/network-surface checks
policy/                       Machine-readable policy manifests and source records
docs/policy/                  Applicability, safety, privacy and release gates
tests/shared.test.mjs         Shared API tests
```

## Policy and release documentation

- [Compliance applicability matrix](./docs/policy/compliance-matrix.md)
- [Child-safety product standard](./docs/policy/child-safety-standard.md)
- [Privacy and data map](./docs/policy/privacy-data-map.md)
- [Threat model](./docs/policy/threat-model.md)
- [Content governance](./docs/policy/content-governance.md)
- [Help Bridge safety case](./docs/policy/help-bridge-safety-case.md)
- [Release checklist](./docs/policy/release-checklist.md)
- [Product roadmap](./docs/roadmap.md)
- [Security reporting](./SECURITY.md)
- [Contributing rules](./CONTRIBUTING.md)

The current static prototype deliberately has no live AI, accounts, UGC, messaging,
advertising, analytics, payments, or remote incident reporting. Adding any of those
is a new architecture release and reopens the legal, privacy, child-rights, safety,
security, accessibility, and content reviews.

The shared layer deliberately owns product metadata and reusable primitives, not app-specific state machines. This keeps the four interfaces consistent in quality without forcing them into the same screen structure.
