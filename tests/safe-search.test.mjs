import test from "node:test";
import assert from "node:assert/strict";

import {
  SAFE_RESULTS,
  SEARCH_CATEGORIES,
  addHistoryEntry,
  createHistoryEntry,
  filterResults,
  getCategoryForExperienceIntent,
  getSavedResults,
  sanitizeHistory,
  getApprovedResultUrl,
  sanitizeStoredIds,
  toggleSavedId,
} from "../apps/safe-search/logic.js";

test("safe search exposes a varied curated local collection", () => {
  assert.ok(SAFE_RESULTS.length >= 8);
  assert.ok(new Set(SAFE_RESULTS.map((result) => result.category)).size >= 4);
  assert.ok(SAFE_RESULTS.every((result) => result.safetyReasons.length >= 3));
});

test("every external result has current review metadata and passes the URL guard", () => {
  const ids = new Set();
  const urls = new Set();

  for (const result of SAFE_RESULTS) {
    assert.equal(result.reviewStatus, "active");
    assert.match(result.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(result.reviewDue, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(result.reviewOwner.length > 0);
    assert.match(result.reviewEvidence, /^https:\/\//);
    assert.equal(getApprovedResultUrl(result), new URL(result.url).href);
    assert.equal(new URL(result.url).hostname, result.canonicalHost);
    assert.equal(ids.has(result.id), false);
    assert.equal(urls.has(result.url), false);
    ids.add(result.id);
    urls.add(result.url);
  }

  const valid = SAFE_RESULTS[0];
  assert.equal(
    getApprovedResultUrl({ ...valid, url: "javascript:alert(1)" }),
    null,
  );
  assert.equal(
    getApprovedResultUrl({
      ...valid,
      url: "https://attacker.example/",
    }),
    null,
  );
  assert.equal(
    getApprovedResultUrl({
      ...valid,
      url: `https://user:secret@${valid.canonicalHost}/`,
    }),
    null,
  );
  assert.equal(getApprovedResultUrl({ ...valid, reviewStatus: "overdue" }), null);
  assert.equal(
    getApprovedResultUrl(valid, Date.parse("2026-10-10T23:59:59.000Z")),
    new URL(valid.url).href,
  );
  assert.equal(
    getApprovedResultUrl(valid, Date.parse("2026-10-11T00:00:00.000Z")),
    null,
  );
  assert.equal(
    getApprovedResultUrl(
      { ...valid, reviewedAt: "2026-02-31" },
      Date.parse("2026-07-12T00:00:00.000Z"),
    ),
    null,
  );
});

test("search matches normalized terms and category filters", () => {
  assert.deepEqual(
    filterResults(SAFE_RESULTS, {
      query: "Politik Lexikon",
      category: "school",
    }).map((result) => result.id),
    ["hanisauland-school"],
  );
  assert.deepEqual(
    filterResults(SAFE_RESULTS, { query: "HOREN", category: "news" }).map(
      (result) => result.id,
    ),
    ["maus-audio-news"],
  );
  assert.equal(
    filterResults(SAFE_RESULTS, {
      query: "nachrichten",
      category: "school",
    }).length,
    0,
  );
  assert.equal(
    filterResults(SAFE_RESULTS, {
      query: "does-not-exist",
      category: "all",
    }).length,
    0,
  );
  assert.ok(
    filterResults(SAFE_RESULTS, { category: "news" }).every(
      (result) => result.category === "news",
    ),
  );
  assert.equal(filterResults(SAFE_RESULTS).length, SAFE_RESULTS.length);
});

test("experience intents map only to supported, available search categories", () => {
  assert.equal(getCategoryForExperienceIntent("school"), "school");
  assert.equal(getCategoryForExperienceIntent(" NEWS "), "news");
  assert.equal(getCategoryForExperienceIntent("creative"), "creative");
  assert.equal(getCategoryForExperienceIntent("safety"), null);
  assert.equal(getCategoryForExperienceIntent("unknown"), null);
  assert.equal(getCategoryForExperienceIntent(null), null);
  assert.equal(
    getCategoryForExperienceIntent(
      "school",
      SEARCH_CATEGORIES.filter((category) => category.id !== "school"),
    ),
    null,
  );
  assert.equal(getCategoryForExperienceIntent("school", null), null);
});

test("saved result toggles are unique and resolve in collection order", () => {
  const firstId = SAFE_RESULTS[0].id;
  const secondId = SAFE_RESULTS[1].id;

  assert.deepEqual(toggleSavedId([], firstId), [firstId]);
  assert.deepEqual(toggleSavedId([firstId], firstId), []);
  assert.deepEqual(toggleSavedId([firstId, firstId], secondId), [
    firstId,
    secondId,
  ]);
  assert.deepEqual(
    getSavedResults(SAFE_RESULTS, [secondId, firstId]).map((item) => item.id),
    [firstId, secondId],
  );
});

test("stored IDs and history are repaired before use", () => {
  const validId = SAFE_RESULTS[0].id;
  const secondValidId = SAFE_RESULTS[1].id;

  assert.deepEqual(
    sanitizeStoredIds([validId, "unknown", validId, null, secondValidId]),
    [validId, secondValidId],
  );
  assert.deepEqual(sanitizeStoredIds("not-an-array"), []);
  assert.deepEqual(sanitizeHistory([{ nope: true }]), []);

  const repaired = sanitizeHistory(
    [
      {
        id: 42,
        query: "  Tiere  ",
        category: "school",
        resultCount: "3",
        timestamp: "2026-01-01T10:00:00.000Z",
      },
      {
        query: "News",
        category: "news",
        resultCount: -4,
        timestamp: "2026-01-02T10:00:00.000Z",
      },
      null,
    ],
    2,
  );

  assert.deepEqual(repaired, [
    {
      id: "42",
      query: "Tiere",
      category: "school",
      resultCount: 3,
      timestamp: "2026-01-01T10:00:00.000Z",
    },
    {
      id: "2026-01-02T10:00:00.000Z:News:news",
      query: "News",
      category: "news",
      resultCount: 0,
      timestamp: "2026-01-02T10:00:00.000Z",
    },
  ]);
  assert.deepEqual(sanitizeHistory(repaired, 0), []);
});

test("history keeps the newest distinct search and respects the limit", () => {
  const first = createHistoryEntry(
    { query: "Tiere", category: "school", resultCount: 2 },
    "2026-01-01T10:00:00.000Z",
  );
  const replacement = createHistoryEntry(
    { query: "TIERE", category: "school", resultCount: 3 },
    "2026-01-01T11:00:00.000Z",
  );
  const otherCategory = createHistoryEntry(
    { query: "Tiere", category: "creative", resultCount: 1 },
    "2026-01-01T12:00:00.000Z",
  );

  const next = addHistoryEntry([first], replacement, 6);
  assert.equal(next.length, 1);
  assert.equal(next[0].resultCount, 3);
  assert.deepEqual(addHistoryEntry(next, otherCategory, 1), [otherCategory]);
  assert.deepEqual(addHistoryEntry([], createHistoryEntry({}), 6), []);
  assert.equal(createHistoryEntry({ resultCount: -5 }).resultCount, 0);
  const oversized = createHistoryEntry({
    query: "x".repeat(500),
    category: "school",
    resultCount: 1,
  });
  assert.equal(oversized.query.length, 120);

});
