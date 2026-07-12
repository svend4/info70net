import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const pages = [
  ["index.html", "./safety.html"],
  ["safety.html", "./safety.html"],
  ["apps/safe-search/index.html", "../../safety.html"],
  ["apps/media-time/index.html", "../../safety.html"],
  ["apps/help-bridge/index.html", "../../safety.html"],
  ["apps/ai-literacy/index.html", "../../safety.html"],
];

async function read(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

function attribute(tag, name) {
  return tag.match(
    new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i"),
  )?.[1] ?? null;
}

function findNestedRule(source) {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const stack = [];
  let segmentStart = 0;

  for (let index = 0; index < css.length; index += 1) {
    const character = css[index];
    if (character === ";") {
      segmentStart = index + 1;
      continue;
    }
    if (character === "{") {
      const prelude = css.slice(segmentStart, index).trim();
      if (stack.at(-1) === "rule") {
        return prelude || "(unknown nested rule)";
      }
      stack.push(prelude.startsWith("@") ? "at-rule" : "rule");
      segmentStart = index + 1;
      continue;
    }
    if (character === "}") {
      stack.pop();
      segmentStart = index + 1;
    }
  }

  return null;
}

test("every product page links to the plain-language policy page", async () => {
  for (const [relativePath, safetyHref] of pages) {
    const html = await read(relativePath);
    assert.match(html, /<html\b[^>]*\blang=["'][^"']+["']/i);
    assert.ok(
      html.includes(`href="${safetyHref}"`),
      `${relativePath} must link to ${safetyHref}`,
    );
    assert.doesNotMatch(html, /<iframe\b/i);

    for (const tag of html.match(/<script\b[^>]*>/gi) ?? []) {
      const source = attribute(tag, "src");
      assert.ok(source, `${relativePath} contains an inline script`);
      assert.doesNotMatch(source, /^(?:https?:|\/\/|data:)/i);
    }

    for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
      if (attribute(tag, "rel")?.toLowerCase() !== "stylesheet") continue;
      assert.doesNotMatch(attribute(tag, "href"), /^(?:https?:|\/\/|data:)/i);
    }
  }
});

test("the storage manifest documents the exact approved keys", async () => {
  const manifest = JSON.parse(await read("policy/storage-manifest.json"));
  const byKey = new Map(manifest.entries.map((entry) => [entry.key, entry]));

  assert.deepEqual(
    [...byKey.keys()].sort(),
    [
      "ai-literacy:exercise-progress",
      "help-bridge:triage-draft",
      "media-time:weekly-plan",
      "safe-search:history",
      "safe-search:history-opt-in",
      "safe-search:saved",
    ],
  );
  assert.equal(byKey.get("safe-search:history").trigger, "search-after-explicit-opt-in");
  assert.equal(byKey.get("media-time:weekly-plan").storage, "sessionStorage");
  assert.equal(byKey.get("ai-literacy:exercise-progress").storage, "sessionStorage");
  assert.equal(byKey.get("help-bridge:triage-draft").storage, "sessionStorage");
  assert.equal(byKey.get("help-bridge:triage-draft").ttlMinutes, 30);
  assert.deepEqual(
    byKey.get("help-bridge:triage-draft").excludedFields,
    ["adult-name", "notes", "free-text", "images"],
  );
});

test("implementation and data map agree on privacy boundaries", async () => {
  const [
    safeSearch,
    mediaTime,
    helpBridge,
    aiLiteracy,
    privacyMap,
  ] = await Promise.all([
    read("apps/safe-search/app.js"),
    read("apps/media-time/app.js"),
    read("apps/help-bridge/app.js"),
    read("apps/ai-literacy/app.js"),
    read("docs/policy/privacy-data-map.md"),
  ]);

  assert.match(safeSearch, /historyOptIn \? sanitizeHistory/);
  assert.match(safeSearch, /storage\.remove\("history"\)/);
  assert.match(safeSearch, /storage\.set\("history-opt-in", true\)/);
  assert.match(mediaTime, /createSessionStorage\(APP_ID\)/);
  assert.match(aiLiteracy, /createSessionStorage\(APP_ID\)/);
  assert.match(helpBridge, /createSessionStorage\(APP_ID\)/);
  assert.match(helpBridge, /createSessionDraftRecord/);
  assert.match(helpBridge, /readSessionDraftRecord/);
  assert.doesNotMatch(helpBridge, /legacyStorage\.set\(/);

  assert.match(privacyMap, /30-minute TTL/i);
  assert.match(privacyMap, /sessionStorage/);
  assert.match(privacyMap, /history is opt-in/i);
});

test("toolkit-wide deletion cannot clear unrelated same-origin applications", async () => {
  const source = await read("safety.js");
  assert.doesNotMatch(source, /(?:localStorage|sessionStorage)\.clear\s*\(/);
  assert.doesNotMatch(source, /\bstorage\.clear\s*\(/);
  for (const prefix of [
    "safe-search:",
    "media-time:",
    "help-bridge:",
    "ai-literacy:",
  ]) {
    assert.ok(source.includes(`"${prefix}"`));
  }
});

test("high-risk claims and production blockers stay visible", async () => {
  const [safetyPage, helpPage, safetyCase] = await Promise.all([
    read("safety.html"),
    read("apps/help-bridge/index.html"),
    read("docs/policy/help-bridge-safety-case.md"),
  ]);

  assert.match(safetyPage, /does not claim legal or accessibility conformance/i);
  assert.match(helpPage, /not an emergency or reporting service/i);
  assert.match(helpPage, /Human safeguarding review is required before production/i);
  assert.match(safetyCase, /HB-SAFE-001/);
  assert.match(safetyCase, /blocked from production pending human safeguarding review/i);
});

test("storage fields and emergency evidence are fully documented", async () => {
  const manifest = JSON.parse(await read("policy/storage-manifest.json"));
  const byKey = new Map(manifest.entries.map((entry) => [entry.key, entry]));

  assert.deepEqual(byKey.get("safe-search:history").fields, [
    "entry-id",
    "query-up-to-120-characters",
    "category",
    "result-count",
    "timestamp",
  ]);
  assert.equal(byKey.get("help-bridge:triage-draft").maximumBytes, 2048);
  assert.deepEqual(byKey.get("ai-literacy:exercise-progress").fields, [
    "schema-version",
    "answers-by-exercise-id",
    "selected-answer-ids",
    "correctness-result",
  ]);

  const helpRegistry = JSON.parse(await read("policy/help-resources.json"));
  const emergency112 = helpRegistry.resources.find(
    (resource) => resource.id === "eu-emergency-112",
  );
  assert.equal(emergency112.number, "112");
  assert.match(emergency112.scope, /Germany/);
  assert.match(emergency112.scope, /European Union/);
  assert.equal(
    emergency112.sourceUrl,
    "https://digital-strategy.ec.europa.eu/en/policies/112",
  );
});

test("session-only apps remove their legacy persistent keys", async () => {
  const [mediaTime, helpBridge, aiLiteracy] = await Promise.all([
    read("apps/media-time/app.js"),
    read("apps/help-bridge/app.js"),
    read("apps/ai-literacy/app.js"),
  ]);

  assert.match(mediaTime, /legacyStorage\.remove\(PLAN_KEY\)/);
  assert.match(helpBridge, /legacyStorage\.remove\(DRAFT_KEY\)/);
  assert.match(aiLiteracy, /legacyStorage\.remove\(PROGRESS_KEY\)/);
  for (const source of [mediaTime, helpBridge, aiLiteracy]) {
    assert.doesNotMatch(source, /legacyStorage\.set\(/);
  }
});

test("stylesheets avoid accidental selector nesting", async () => {
  const stylesheets = [
    "portal.css",
    "safety.css",
    "packages/shared/styles/base.css",
    "apps/safe-search/styles.css",
    "apps/media-time/styles.css",
    "apps/help-bridge/styles.css",
    "apps/ai-literacy/styles.css",
  ];

  for (const relativePath of stylesheets) {
    const nestedRule = findNestedRule(await read(relativePath));
    assert.equal(
      nestedRule,
      null,
      `${relativePath} accidentally nests selector: ${nestedRule}`,
    );
  }
});

test("browser smoke embedded evaluation bodies parse", async () => {
  const source = await read("scripts/browser-smoke.mjs");
  const fragments = [...source.matchAll(/evaluate\(`([\s\S]*?)`\)/g)].map(
    (match) => match[1],
  );
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

  assert.ok(fragments.length >= 8);
  for (const fragment of fragments) {
    assert.doesNotThrow(() => new AsyncFunction(fragment));
  }
});

test("sensitive UI controls and claims stay conservative", async () => {
  const [helpPage, aiPage, safetyPage] = await Promise.all([
    read("apps/help-bridge/index.html"),
    read("apps/ai-literacy/index.html"),
    read("safety.html"),
  ]);

  assert.doesNotMatch(helpPage, /name="adultName"|name="notes"/);
  assert.match(helpPage, /Do not enter names, account handles, locations/i);
  assert.match(aiPage, /AI can invent a citation/i);
  assert.match(
    safetyPage,
    /id="clear-toolkit-data"[^>]*disabled/i,
  );
});
