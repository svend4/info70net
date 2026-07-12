import test from "node:test";
import assert from "node:assert/strict";
import {
  assessUrgency,
  buildSafetyPlan,
  DRAFT_MAX_BYTES,
  DRAFT_TTL_MS,
  createSessionDraftRecord,
  readSessionDraftRecord,
  createPersistableDraft,
  getDraftCompletion,
  getTrustedAdultLabel,
  normalizeDraft,
} from "../apps/help-bridge/logic.js";

const calmDraft = {
  incidentType: "insults",
  safeNow: "yes",
  directThreat: "no",
  knowsLocation: "no",
  repeatedContact: "no",
  imageShared: "no",
  adultRole: "teacher",
  adultName: "Ms Lee",
};

test("assessUrgency marks immediate safety signals as urgent", () => {
  const result = assessUrgency({ ...calmDraft, safeNow: "no" });
  assert.equal(result.level, "urgent");
  assert.equal(result.emergency, true);
  assert.match(result.reasons[0], /not physically safe/i);
});

test("image pressure is routed to same-day adult support without claiming an emergency", () => {
  const result = assessUrgency({ ...calmDraft, incidentType: "image-pressure" });
  assert.equal(result.level, "soon");
  assert.equal(result.emergency, false);
  assert.match(result.summary, /trusted adult/i);
});

test("buildSafetyPlan adds incident-specific, evidence and trusted-adult steps", () => {
  const plan = buildSafetyPlan({ ...calmDraft, incidentType: "image-pressure", imageShared: "yes" });
  assert.ok(plan.steps.some((step) => /Do not send another image/i.test(step.detail)));
  assert.ok(plan.steps.some((step) => step.id === "evidence" && /without downloading or forwarding/i.test(step.detail)));
  assert.ok(plan.steps.some((step) => step.title.includes("Ms Lee")));
  assert.ok(plan.steps.some((step) => /cannot be guaranteed/i.test(step.detail)));
});

test("normalization limits free text and ignores unknown choices", () => {
  const draft = normalizeDraft({
    incidentType: "unknown",
    adultRole: "stranger",
    notes: `  ${"x".repeat(900)}  `,
  });
  assert.equal(draft.incidentType, "");
  assert.equal(draft.adultRole, "");
  assert.equal(draft.notes.length, 600);
});

test("persistable drafts exclude optional names, notes and unknown fields", () => {
  const persisted = createPersistableDraft({
    ...calmDraft,
    adultName: "Ms Lee",
    notes: "Private context that must remain session-only.",
    unexpected: "drop me",
  });

  assert.deepEqual(persisted, {
    incidentType: "insults",
    safeNow: true,
    directThreat: false,
    knowsLocation: false,
    repeatedContact: false,
    imageShared: false,
    adultRole: "teacher",
  });
  assert.equal("adultName" in persisted, false);
  assert.equal("notes" in persisted, false);
});

test("draft completion only becomes ready after all triage answers", () => {
  assert.equal(getDraftCompletion(calmDraft).ready, true);
  assert.equal(getDraftCompletion({ ...calmDraft, directThreat: undefined }).ready, false);
  assert.equal(getTrustedAdultLabel(calmDraft), "Ms Lee (a teacher)");
});

test("not-sure critical answers never produce a steady route", () => {
  const uncertain = normalizeDraft({
    ...calmDraft,
    safeNow: "unsure",
    directThreat: "unsure",
    knowsLocation: "unsure",
  });

  assert.equal(uncertain.safeNow, "unsure");
  assert.equal(uncertain.directThreat, "unsure");
  assert.equal(uncertain.knowsLocation, "unsure");
  assert.equal(getDraftCompletion(uncertain).ready, true);
  assert.equal(assessUrgency(uncertain).level, "soon");
  assert.match(assessUrgency(uncertain).label, /adult now/i);
});

test("temporary draft records expire and reject unknown or tampered schemas", () => {
  const startedAt = Date.UTC(2026, 6, 12, 12, 0, 0);
  const record = createSessionDraftRecord(
    {
      ...calmDraft,
      adultName: "Must not persist",
      notes: "Must not persist",
      unexpected: "drop",
    },
    startedAt,
  );

  assert.equal(Date.parse(record.expiresAt) - Date.parse(record.createdAt), DRAFT_TTL_MS);
  assert.ok(
    new TextEncoder().encode(JSON.stringify(record)).byteLength <= DRAFT_MAX_BYTES,
  );
  assert.equal(Object.hasOwn(record.draft, "adultName"), false);
  assert.equal(Object.hasOwn(record.draft, "notes"), false);
  assert.deepEqual(
    readSessionDraftRecord(record, startedAt + DRAFT_TTL_MS - 1),
    createPersistableDraft(calmDraft),
  );
  assert.equal(readSessionDraftRecord(record, startedAt + DRAFT_TTL_MS), null);
  assert.equal(readSessionDraftRecord({ ...record, version: 999 }, startedAt + 1), null);
  assert.equal(
    readSessionDraftRecord(
      {
        ...record,
        expiresAt: new Date(startedAt + DRAFT_TTL_MS + 1).toISOString(),
      },
      startedAt + 1,
    ),
    null,
  );
  assert.equal(readSessionDraftRecord(record, startedAt - 1), null);
  assert.equal(
    readSessionDraftRecord(
      { ...record, draft: { ...record.draft, unknown: "drop" } },
      startedAt + 1,
    ),
    null,
  );
  assert.equal(
    readSessionDraftRecord(
      { ...record, draft: { ...record.draft, safeNow: "maybe" } },
      startedAt + 1,
    ),
    null,
  );
  assert.equal(
    readSessionDraftRecord({ ...record, unknown: true }, startedAt + 1),
    null,
  );
  assert.equal(
    readSessionDraftRecord(
      { ...record, createdAt: "not-a-date" },
      startedAt + 1,
    ),
    null,
  );
  assert.equal(
    readSessionDraftRecord({ ...record, createdAt: "x".repeat(DRAFT_MAX_BYTES) }, startedAt + 1),
    null,
  );
  assert.throws(() => createSessionDraftRecord(calmDraft, Number.NaN), TypeError);
});

test("all 3^5 tri-state combinations preserve the routing invariants", () => {
  const answers = ["yes", "no", "unsure"];
  const incidents = ["insults", "image-pressure", "hate-speech"];
  let combinations = 0;

  for (const incidentType of incidents) {
    for (const safeNow of answers) {
      for (const directThreat of answers) {
        for (const knowsLocation of answers) {
          for (const repeatedContact of answers) {
            for (const imageShared of answers) {
              const urgency = assessUrgency({
                incidentType,
                safeNow,
                directThreat,
                knowsLocation,
                repeatedContact,
                imageShared,
              });
              combinations += 1;

              if (safeNow === "no" || directThreat === "yes" || knowsLocation === "yes") {
                assert.equal(urgency.level, "urgent");
              } else if ([safeNow, directThreat, knowsLocation].includes("unsure")) {
                assert.equal(urgency.level, "soon");
              } else if (
                incidentType === "image-pressure" ||
                repeatedContact === "yes" ||
                imageShared === "yes"
              ) {
                assert.equal(urgency.level, "soon");
              } else {
                assert.equal(urgency.level, "steady");
              }
            }
          }
        }
      }
    }
  }

  assert.equal(combinations, incidents.length * 3 ** 5);
});
