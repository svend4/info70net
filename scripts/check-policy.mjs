import { access, readFile, readdir } from "node:fs/promises";
import { isIP } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  SAFE_RESULTS,
  getApprovedResultUrl,
} from "../apps/safe-search/logic.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const failures = [];

const requiredFiles = [
  "safety.html",
  "safety.css",
  "safety.js",
  "policy/storage-manifest.json",
  "policy/help-resources.json",
  "docs/policy/compliance-matrix.md",
  "docs/policy/child-safety-standard.md",
  "docs/policy/privacy-data-map.md",
  "docs/policy/threat-model.md",
  "docs/policy/content-governance.md",
  "docs/policy/help-bridge-safety-case.md",
  "docs/policy/release-checklist.md",
  "docs/roadmap.md",
  "SECURITY.md",
  "CONTRIBUTING.md",
];

const htmlPages = [
  { file: "index.html", safetyHref: "./safety.html" },
  { file: "safety.html", safetyHref: "./safety.html" },
  ...["safe-search", "media-time", "help-bridge", "ai-literacy"].map(
    (appId) => ({
      file: `apps/${appId}/index.html`,
      safetyHref: "../../safety.html",
    }),
  ),
];


function check(condition, message) {
  if (!condition) failures.push(message);
}

async function readText(relativePath) {
  try {
    return await readFile(path.join(repositoryRoot, relativePath), "utf8");
  } catch {
    failures.push("Missing or unreadable required file: " + relativePath);
    return null;
  }
}

const skippedProductDirectories = new Set([
  ".git",
  "artifacts",
  "docs",
  "node_modules",
  "policy",
  "scripts",
  "tests",
]);

async function collectProductJavaScript(relativeDirectory = ".") {
  const absoluteDirectory = path.join(repositoryRoot, relativeDirectory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = relativeDirectory === "."
      ? entry.name
      : path.posix.join(relativeDirectory.replaceAll("\\", "/"), entry.name);
    if (entry.isDirectory()) {
      if (relativeDirectory === "." && skippedProductDirectories.has(entry.name)) continue;
      files.push(...await collectProductJavaScript(relativePath));
    } else if (/\.(?:js|mjs)$/.test(entry.name)) {
      files.push(relativePath);
    }
  }

  return files;
}

function attribute(tag, name) {
  const match = tag.match(
    new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i"),
  );
  return match?.[1] ?? null;
}

function isLocalAsset(value) {
  return (
    typeof value === "string" &&
    !/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value) &&
    !value.includes("\\")
  );
}

function parseDay(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
    ? date
    : null;
}

await Promise.all(
  requiredFiles.map(async (relativePath) => {
    try {
      await access(path.join(repositoryRoot, relativePath));
    } catch {
      failures.push("Missing policy file: " + relativePath);
    }
  }),
);

for (const page of htmlPages) {
  const html = await readText(page.file);
  if (html === null) continue;

  check(
    html.includes(`href="${page.safetyHref}"`),
    `${page.file} must link to Safety & Privacy.`,
  );
  check(
    /<html\b[^>]*\blang\s*=\s*["'][a-z]{2}(?:-[A-Za-z0-9-]+)?["']/i.test(
      html,
    ),
    `${page.file} must declare a valid page language.`,
  );
  check(!/<iframe\b/i.test(html), `${page.file} must not embed an iframe.`);

  for (const tag of html.match(/<script\b[^>]*>/gi) ?? []) {
    const source = attribute(tag, "src");
    check(Boolean(source), `${page.file} must not contain inline scripts.`);
    check(
      !source || isLocalAsset(source),
      `${page.file} must use only first-party script assets: ${source}`,
    );
  }

  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (attribute(tag, "rel")?.toLowerCase() !== "stylesheet") continue;
    const href = attribute(tag, "href");
    check(
      isLocalAsset(href),
      `${page.file} must use only first-party stylesheets: ${href}`,
    );
  }

  for (const tag of html.match(/<a\b[^>]*>/gi) ?? []) {
    const href = attribute(tag, "href");
    if (!href || !/^https:/i.test(href)) continue;
    check(
      attribute(tag, "target") === "_blank",
      `${page.file} external links must open in a new tab.`,
    );
    const rel = new Set((attribute(tag, "rel") ?? "").toLowerCase().split(/\s+/));
    check(
      rel.has("noopener") && rel.has("noreferrer"),
      `${page.file} external links must use noopener noreferrer.`,
    );
  }

  const trackerPatterns = [
    /googletagmanager/i,
    /google-analytics/i,
    /\bgtag\s*\(/i,
    /\bmixpanel\b/i,
    /\bsegment\.(?:com|io)\b/i,
    /\bplausible\b/i,
    /facebook\.net\/.*fbevents/i,
  ];
  for (const pattern of trackerPatterns) {
    check(
      !pattern.test(html),
      `${page.file} contains a prohibited tracking signature: ${pattern}`,
    );
  }
}

const prohibitedRuntimePatterns = [
  { pattern: /\bfetch\s*\(/, label: "fetch" },
  { pattern: /\bXMLHttpRequest\b/, label: "XMLHttpRequest" },
  { pattern: /\bWebSocket\s*\(/, label: "WebSocket" },
  { pattern: /\bEventSource\s*\(/, label: "EventSource" },
  { pattern: /\bsendBeacon\s*\(/, label: "sendBeacon" },
  { pattern: /serviceWorker\s*\.\s*register\s*\(/, label: "service worker" },
  { pattern: /document\s*\.\s*cookie\b/, label: "cookies" },
];

const productJavaScript = await collectProductJavaScript();
for (const relativePath of productJavaScript) {
  const source = await readText(relativePath);
  if (source === null) continue;

  for (const { pattern, label } of prohibitedRuntimePatterns) {
    check(
      !pattern.test(source),
      `${relativePath} introduces ${label}; a privacy review and policy update are required first.`,
    );
  }
}

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const today = new Date();
const todayUtc = Date.UTC(
  today.getUTCFullYear(),
  today.getUTCMonth(),
  today.getUTCDate(),
);
const seenIds = new Set();
const seenUrls = new Set();

for (const result of SAFE_RESULTS) {
  const location = `Safe Search resource ${result?.id ?? "(missing id)"}`;
  for (const field of [
    "id",
    "title",
    "source",
    "url",
    "canonicalHost",
    "reviewedAt",
    "reviewDue",
    "reviewOwner",
    "reviewStatus",
    "reviewEvidence",
  ]) {
    check(
      typeof result?.[field] === "string" && result[field].trim() !== "",
      `${location} must define ${field}.`,
    );
  }

  check(!seenIds.has(result.id), `${location} has a duplicate ID.`);
  seenIds.add(result.id);
  check(!seenUrls.has(result.url), `${location} has a duplicate URL.`);
  seenUrls.add(result.url);
  check(
    result.reviewStatus === "active",
    `${location} must be quarantined unless reviewStatus is active.`,
  );
  check(
    getApprovedResultUrl(result) !== null,
    `${location} does not pass the HTTPS exact-host URL guard.`,
  );
  check(!isIP(result.canonicalHost), `${location} must not use a raw IP host.`);

  const reviewedAt = parseDay(result.reviewedAt);
  const reviewDue = parseDay(result.reviewDue);
  check(Boolean(reviewedAt), `${location} has an invalid reviewedAt date.`);
  check(Boolean(reviewDue), `${location} has an invalid reviewDue date.`);
  if (reviewedAt && reviewDue) {
    check(
      reviewedAt.getTime() <= todayUtc,
      `${location} reviewedAt must not be in the future.`,
    );
    check(
      reviewDue.getTime() >= todayUtc,
      `${location} review is overdue; quarantine it until reviewed.`,
    );
    check(
      reviewDue.getTime() > reviewedAt.getTime(),
      `${location} reviewDue must follow reviewedAt.`,
    );
    check(
      reviewDue.getTime() - reviewedAt.getTime() <= 90 * millisecondsPerDay,
      `${location} review interval must not exceed 90 days.`,
    );
  }

  try {
    const evidence = new URL(result.reviewEvidence);
    check(
      evidence.protocol === "https:" &&
        !evidence.username &&
        !evidence.password &&
        !evidence.port,
      `${location} review evidence must be a clean HTTPS URL.`,
    );
  } catch {
    failures.push(`${location} reviewEvidence is not a valid URL.`);
  }
}

const manifestSource = await readText("policy/storage-manifest.json");
if (manifestSource !== null) {
  try {
    const manifest = JSON.parse(manifestSource);
    check(manifest.schemaVersion === 1, "Storage manifest schemaVersion must be 1.");
    const manifestReviewedAt = parseDay(manifest.reviewedAt);
    check(Boolean(manifestReviewedAt), "Storage manifest reviewedAt must be a real ISO date.");
    if (manifestReviewedAt) {
      check(
        manifestReviewedAt.getTime() <= todayUtc,
        "Storage manifest reviewedAt must not be in the future.",
      );
      check(
        todayUtc - manifestReviewedAt.getTime() <= 90 * millisecondsPerDay,
        "Storage manifest review is older than 90 days.",
      );
    }
    check(Array.isArray(manifest.entries), "Storage manifest entries must be an array.");

    const entries = Array.isArray(manifest.entries) ? manifest.entries : [];
    const keys = entries.map((entry) => entry?.key);
    check(new Set(keys).size === keys.length, "Storage manifest keys must be unique.");
    check(
      keys.every((key) =>
        /^(safe-search|media-time|help-bridge|ai-literacy):[a-z0-9-]+$/.test(
          key,
        ),
      ),
      "Every storage manifest key must use an approved app namespace.",
    );
    check(
      entries.every((entry) =>
        ["localStorage", "sessionStorage"].includes(entry?.storage),
      ),
      "Every storage manifest entry must name localStorage or sessionStorage.",
    );

    const byKey = new Map(entries.map((entry) => [entry.key, entry]));
    check(
      byKey.get("safe-search:history")?.trigger ===
        "search-after-explicit-opt-in",
      "Safe Search history must remain explicit opt-in.",
    );
    check(
      byKey.get("media-time:weekly-plan")?.storage === "sessionStorage",
      "Media Time plan must remain current-tab storage.",
    );
    check(
      byKey.get("ai-literacy:exercise-progress")?.storage === "sessionStorage",
      "AI Literacy progress must remain current-tab storage.",
    );
    const helpDraft = byKey.get("help-bridge:triage-draft");
    check(
      helpDraft?.storage === "sessionStorage" &&
        helpDraft?.ttlMinutes === 30 &&
        helpDraft?.maximumBytes === 2048,
      "Help Bridge draft must remain session-only with a 30-minute TTL and 2 KB maximum.",
    );
    check(
      ["adult-name", "notes", "free-text", "images"].every((field) =>
        helpDraft?.excludedFields?.includes(field),
      ),
      "Help Bridge manifest must explicitly exclude names, notes, free text and images.",
    );
  } catch (error) {
    failures.push("Storage manifest is invalid JSON: " + error.message);
  }
}


const helpRegistrySource = await readText("policy/help-resources.json");
if (helpRegistrySource !== null) {
  try {
    const registry = JSON.parse(helpRegistrySource);
    check(registry.schemaVersion === 1, "Help resource registry schemaVersion must be 1.");
    check(Array.isArray(registry.resources), "Help resource registry resources must be an array.");
    const emergency112 = registry.resources?.find(
      (resource) => resource?.id === "eu-emergency-112",
    );
    check(Boolean(emergency112), "Help resource registry must record the EU 112 claim.");
    if (emergency112) {
      check(
        emergency112.number === "112" &&
          emergency112.status === "active" &&
          emergency112.scope.includes("Germany") &&
          emergency112.scope.includes("European Union"),
        "The 112 entry must record its active Germany/EU scope.",
      );
      check(
        emergency112.sourceOwner === "European Commission" &&
          emergency112.sourceUrl ===
            "https://digital-strategy.ec.europa.eu/en/policies/112",
        "The 112 entry must cite the official European Commission source.",
      );

      const reviewedAt = parseDay(emergency112.reviewedAt);
      const reviewDue = parseDay(emergency112.reviewDue);
      check(Boolean(reviewedAt), "The 112 entry needs a valid reviewedAt date.");
      check(Boolean(reviewDue), "The 112 entry needs a valid reviewDue date.");
      if (reviewedAt && reviewDue) {
        check(
          reviewedAt.getTime() <= todayUtc,
          "The 112 reviewedAt date must not be in the future.",
        );
        check(
          reviewDue.getTime() >= todayUtc,
          "The 112 claim is overdue and must be quarantined.",
        );
        check(
          reviewDue.getTime() - reviewedAt.getTime() <= 90 * millisecondsPerDay,
          "The 112 review interval must not exceed 90 days.",
        );
      }
    }
  } catch (error) {
    failures.push("Help resource registry is invalid JSON: " + error.message);
  }
}
const safetyScript = await readText("safety.js");
if (safetyScript !== null) {
  check(
    !/\.(?:localStorage|sessionStorage)\s*\.\s*clear\s*\(/.test(
      safetyScript,
    ) && !/\bstorage\s*\.\s*clear\s*\(/.test(safetyScript),
    "Safety deletion must never clear unrelated origin storage.",
  );
  for (const prefix of [
    "safe-search:",
    "media-time:",
    "help-bridge:",
    "ai-literacy:",
  ]) {
    check(
      safetyScript.includes(`"${prefix}"`),
      `Safety deletion must include the ${prefix} namespace.`,
    );
  }
}

if (failures.length > 0) {
  console.error("Policy check failed:\n- " + failures.join("\n- "));
  process.exitCode = 1;
} else {
  console.log(
    `Policy check passed: ${htmlPages.length} pages, ${SAFE_RESULTS.length} resources with current prototype metadata, storage controls, and the 112 source record satisfy the static gates.`,
  );
}
