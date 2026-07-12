import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const cdpOrigin = process.env.CDP_ORIGIN ?? "http://127.0.0.1:9223";
const appOrigin = (
  process.env.APP_ORIGIN ?? "http://127.0.0.1/info70net"
).replace(/\/+$/, "");
const storageOrigin = new URL(appOrigin).origin;
const artifactDirectory = path.resolve(process.env.ARTIFACT_DIR ?? "artifacts");

async function waitForChrome(timeoutMs = 12_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`${cdpOrigin}/json/list`);
      if (response.ok) return response.json();
    } catch {
      // The browser process may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error("Chrome DevTools did not become ready.");
}

const targets = await waitForChrome();
const pageTarget = targets.find((target) => target.type === "page");
assert.ok(pageTarget?.webSocketDebuggerUrl, "A headless page target is required.");

const socket = new WebSocket(pageTarget.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const pageEvents = [];
const observedRequests = [];
const browserErrors = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const operation = pending.get(message.id);
    if (!operation) return;
    pending.delete(message.id);
    if (message.error) operation.reject(new Error(message.error.message));
    else operation.resolve(message.result);
    return;
  }

  pageEvents.push(message);
  if (message.method === "Runtime.exceptionThrown") {
    const details = message.params.exceptionDetails;
    browserErrors.push(details.exception?.description ?? `${details.text} at ${details.url}:${details.lineNumber}`);
  }
  if (message.method === "Log.entryAdded" && ["error", "warning"].includes(message.params.entry.level)) {
    browserErrors.push(`${message.params.entry.level}: ${message.params.entry.text}`);
  }
  if (message.method === "Network.requestWillBeSent") {
    observedRequests.push(message.params.request.url);
  }
});

function send(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression: `(async () => { ${expression} })()`,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  }
  return result.result.value;
}

async function navigate(pathname) {
  pageEvents.length = 0;
  await send("Page.navigate", { url: `${appOrigin}${pathname}` });
  const started = Date.now();
  while (Date.now() - started < 10_000) {
    if (pageEvents.some((event) => event.method === "Page.loadEventFired")) break;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  await evaluate("for (let attempt = 0; attempt < 40 && document.readyState !== 'complete'; attempt += 1) await new Promise((resolve) => setTimeout(resolve, 50)); await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))); return true;");
}

async function screenshot(name, width, height, fullPage = true) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 600,
  });
  const metrics = await send("Page.getLayoutMetrics");
  const content = metrics.cssContentSize ?? metrics.contentSize;
  const clip = fullPage
    ? { x: 0, y: 0, width: Math.min(content.width, width), height: content.height, scale: 1 }
    : undefined;
  const capture = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: fullPage,
    ...(clip ? { clip } : {}),
  });
  await mkdir(artifactDirectory, { recursive: true });
  await writeFile(path.join(artifactDirectory, name), Buffer.from(capture.data, "base64"));
}

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");
await send("Network.enable");
await send("Storage.clearDataForOrigin", { origin: storageOrigin, storageTypes: "all" });

const report = {};

await navigate("/");
report.portal = await evaluate(`
  return {
    title: document.title,
    cards: document.querySelectorAll(".portal-card").length,
    heading: document.querySelector("h1")?.textContent.trim(),
    links: [...document.querySelectorAll(".portal-card a")].map((link) => link.getAttribute("href")),
    safetyHref: document.querySelector('.portal-policy-link')?.getAttribute("href"),
  };
`);
assert.equal(report.portal.cards, 4);
assert.equal(report.portal.links.length, 4);
await screenshot("portal-desktop.png", 1440, 1000);
assert.equal(report.portal.safetyHref, "./safety.html");

await navigate("/apps/safe-search/");
report.safeSearch = await evaluate(`
  document.querySelector('[data-experience-intent="school"]').click();
  const intentCategory = document.querySelector("#search-category").value;
  const intentFocused = document.activeElement.id;
  const query = document.querySelector("#search-query");
  query.value = "Politik";
  query.dispatchEvent(new Event("input", { bubbles: true }));
  document.querySelector("#search-form").requestSubmit();
  await new Promise((resolve) => setTimeout(resolve, 30));
  const initialResults = document.querySelectorAll(".result-card").length;
  const resultsFocused = document.activeElement.id;
  document.querySelector("[data-save-id]").click();
  const defaultHistory = localStorage.getItem("safe-search:history");
  const visibleHistory = document.querySelectorAll(".history-list li").length;
  const historyOptIn = document.querySelector("#history-opt-in");
  historyOptIn.click();
  await new Promise((resolve) => setTimeout(resolve, 20));
  const historyImmediatelyAfterOptIn = localStorage.getItem("safe-search:history");
  query.value = "Nachrichten";
  query.dispatchEvent(new Event("input", { bubbles: true }));
  document.querySelector("#search-form").requestSubmit();
  await new Promise((resolve) => setTimeout(resolve, 30));
  const storedHistory = JSON.parse(localStorage.getItem("safe-search:history") || "[]").length;
  historyOptIn.click();
  const historyClearedAfterOptOut = localStorage.getItem("safe-search:history");

  return {
    intents: document.querySelectorAll("[data-experience-intent]").length,
    intentCategory,
    intentFocused,
    resultsFocused,
    results: initialResults,
    saved: document.querySelector("#saved-count")?.textContent.trim(),
    defaultHistory,
    visibleHistory,
    historyImmediatelyAfterOptIn,
    storedHistory,
    historyClearedAfterOptOut,
  };
`);
assert.equal(report.safeSearch.intents, 3);
assert.equal(report.safeSearch.intentCategory, "school");
assert.equal(report.safeSearch.intentFocused, "search-query");
assert.equal(report.safeSearch.resultsFocused, "search-results");
assert.ok(report.safeSearch.results >= 1);
assert.equal(report.safeSearch.saved, "1");
assert.equal(report.safeSearch.defaultHistory, null);
assert.equal(report.safeSearch.visibleHistory, 1);
assert.equal(report.safeSearch.historyImmediatelyAfterOptIn, null);
assert.equal(report.safeSearch.storedHistory, 1);
assert.equal(report.safeSearch.historyClearedAfterOptOut, null);
await screenshot("safe-search-mobile.png", 390, 844);

await evaluate(`
  localStorage.setItem("media-time:weekly-plan", JSON.stringify({ legacy: true }));
  return true;
`);
await navigate("/apps/media-time/");
report.mediaTime = await evaluate(`
  document.querySelector('[data-experience-intent="learning"]').click();
  const intentCategory = document.activeElement.dataset.categoryId;
  const input = document.querySelector('[data-day-id="monday"][data-category-id="learning"]');
  input.value = "240";
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 30));
  return {
    intents: document.querySelectorAll("[data-experience-intent]").length,
    intentCategory,
    mondayDigital: document.querySelector("#digital-monday")?.textContent.trim(),
    messages: document.querySelectorAll(".feedback-item").length,
    storedInSession: sessionStorage.getItem("media-time:weekly-plan") !== null,
    storedInLocal: localStorage.getItem("media-time:weekly-plan"),
  };
`);
assert.equal(report.mediaTime.intents, 3);
assert.equal(report.mediaTime.intentCategory, "learning");
assert.match(report.mediaTime.mondayDigital, /Std\.|Min\./);
assert.ok(report.mediaTime.messages >= 1);
assert.equal(report.mediaTime.storedInSession, true);
assert.equal(report.mediaTime.storedInLocal, null);
await screenshot("media-time-mobile.png", 390, 844);
report.mediaTime.cleared = await evaluate(`document.querySelector("#reset-plan").click(); return sessionStorage.getItem("media-time:weekly-plan") === null;`);
assert.equal(report.mediaTime.cleared, true);

await evaluate(`
  localStorage.setItem("help-bridge:triage-draft", JSON.stringify({ adultName: "LEGACY-CANARY", notes: "LEGACY-CANARY" }));
  return true;
`);
await navigate("/apps/help-bridge/");
report.helpBridge = await evaluate(`
  document.querySelector('[data-experience-intent="image-pressure"]').click();
  const intentControl = document.querySelector('[name="incidentType"]:checked');
  const intentFocused = document.activeElement === intentControl;
  document.querySelector("#next-button").click();
  document.querySelector('[name="safeNow"][value="no"]').click();
  for (const name of ["directThreat", "knowsLocation", "repeatedContact"]) {
    document.querySelector('[name="' + name + '"][value="no"]').click();
  }
  document.querySelector('[name="imageShared"][value="yes"]').click();
  document.querySelector("#next-button").click();
  document.querySelector("#adult-role").value = "parent";
  const beforeBuild = sessionStorage.getItem("help-bridge:triage-draft");
  const localBeforeBuild = localStorage.getItem("help-bridge:triage-draft");
  document.querySelector("#plan-button").click();
  const afterBuild = sessionStorage.getItem("help-bridge:triage-draft");
  document.querySelector("#save-button").click();
  await new Promise((resolve) => setTimeout(resolve, 30));
  return {
    documentTitle: document.title,
    intents: document.querySelectorAll("[data-experience-intent]").length,
    intent: intentControl?.value,
    intentFocused,
    title: document.querySelector("#plan-title")?.textContent.trim(),
    urgency: document.querySelector("#urgency-label")?.textContent.trim(),
    steps: document.querySelectorAll("#plan-list li").length,
    beforeBuild,
    afterBuild,
    localBeforeBuild,
    warningVisible: !document.querySelector("#immediate-warning").hidden,
    stored: JSON.parse(sessionStorage.getItem("help-bridge:triage-draft") || "null"),
  };
`);
assert.equal(report.helpBridge.documentTitle, "Help Bridge · Small Steps");
assert.equal(report.helpBridge.intents, 3);
assert.equal(report.helpBridge.intent, "image-pressure");
assert.equal(report.helpBridge.intentFocused, true);
assert.equal(report.helpBridge.urgency, "Get immediate help");
assert.ok(report.helpBridge.steps >= 4);
assert.equal(report.helpBridge.beforeBuild, null);
assert.equal(report.helpBridge.afterBuild, null);
assert.equal(report.helpBridge.localBeforeBuild, null);
assert.equal(report.helpBridge.warningVisible, true);
assert.ok(report.helpBridge.stored);
assert.equal(report.helpBridge.stored.version, 1);
assert.equal(Object.hasOwn(report.helpBridge.stored.draft, "adultName"), false);
assert.equal(Object.hasOwn(report.helpBridge.stored.draft, "notes"), false);
assert.equal(
  Date.parse(report.helpBridge.stored.expiresAt) - Date.parse(report.helpBridge.stored.createdAt),
  30 * 60 * 1000,
);
await screenshot("help-bridge-mobile.png", 390, 844);
await navigate("/apps/help-bridge/");
await screenshot("help-bridge-resume-mobile.png", 390, 844);
report.helpBridge.restored = await evaluate(`
  const resumeVisible = !document.querySelector("#resume-draft").hidden;
  const incidentBeforeResume = document.querySelector('[name="incidentType"]:checked')?.value ?? null;
  document.querySelector("#resume-button").click();
  return {
    resumeVisible,
    incidentBeforeResume,
    incidentAfterResume: document.querySelector('[name="incidentType"]:checked')?.value,
  };
`);
assert.deepEqual(report.helpBridge.restored, {
  resumeVisible: true,
  incidentBeforeResume: null,
  incidentAfterResume: "image-pressure",
});

await evaluate(`
  localStorage.setItem("ai-literacy:exercise-progress", JSON.stringify({ legacy: true }));
  return true;
`);
await navigate("/apps/ai-literacy/");
report.aiLiteracy = await evaluate(`
  document.querySelector('[data-experience-intent="missing-perspectives"]').click();
  const intentCard = document.querySelector('[data-exercise-id="missing-perspectives"]');
  const intentFocused = intentCard.contains(document.activeElement);
  for (let attempt = 0; attempt < 40 && !document.querySelector('[value="trace-source"]'); attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  document.querySelector('[value="trace-source"]').click();
  document.querySelector('[data-exercise-id="source-check"] [data-check]').click();
  for (const value of ["young-people", "accessibility", "independent-research"]) {
    document.querySelector('[value="' + value + '"]').click();
  }
  document.querySelector('[data-exercise-id="missing-perspectives"] [data-check]').click();
  document.querySelector('[value="evidence"]').click();
  document.querySelector('[data-exercise-id="prompt-improvement"] [data-check]').click();
  await new Promise((resolve) => setTimeout(resolve, 30));
  return {
    documentTitle: document.title,
    intents: document.querySelectorAll("[data-experience-intent]").length,
    storedInSession: sessionStorage.getItem("ai-literacy:exercise-progress") !== null,
    storedInLocal: localStorage.getItem("ai-literacy:exercise-progress"),
    intentFocused,
    progress: document.querySelector("#progress-copy")?.textContent.trim(),
    score: document.querySelector("#score-copy")?.textContent.trim(),
    completed: !document.querySelector("#completion-note")?.hidden,
  };
`);
assert.equal(report.aiLiteracy.documentTitle, "AI Literacy Lab · Small Steps");
assert.equal(report.aiLiteracy.intents, 3);
assert.equal(report.aiLiteracy.intentFocused, true);
assert.equal(report.aiLiteracy.progress, "3 of 3 exercises checked");
assert.equal(report.aiLiteracy.storedInSession, true);
assert.equal(report.aiLiteracy.storedInLocal, null);
assert.equal(report.aiLiteracy.completed, true);
await screenshot("ai-literacy-mobile.png", 390, 844);
assert.equal(report.aiLiteracy.score, "3 / 3");

await navigate("/safety.html");
report.safety = await evaluate(`
  localStorage.setItem("safe-search:smoke-removal", JSON.stringify(true));
  sessionStorage.setItem("help-bridge:smoke-removal", JSON.stringify(true));
  localStorage.setItem("unrelated-app:keep", "yes");
  sessionStorage.setItem("unrelated-session:keep", "yes");
  const clearButton = document.querySelector("#clear-toolkit-data");
  const clearButtonEnabled = !clearButton.disabled;
  clearButton.click();

  const toolkitPrefixes = [
    "safe-search:",
    "media-time:",
    "help-bridge:",
    "ai-literacy:",
  ];
  const toolkitLocalKeys = Object.keys(localStorage).filter((key) =>
    toolkitPrefixes.some((prefix) => key.startsWith(prefix))
  );
  const toolkitSessionKeys = Object.keys(sessionStorage).filter((key) =>
    toolkitPrefixes.some((prefix) => key.startsWith(prefix))
  );

  return {
    heading: document.querySelector("h1")?.textContent.trim(),
    dataRows: document.querySelectorAll("tbody tr").length,
    selfLink: document.querySelector('[aria-current="page"]')?.getAttribute("href"),
    toolkitLocalKeys,
    toolkitSessionKeys,
    unrelatedLocal: localStorage.getItem("unrelated-app:keep"),
    unrelatedSession: sessionStorage.getItem("unrelated-session:keep"),
    status: document.querySelector("#clear-status")?.textContent.trim(),
    cookies: document.cookie,
    clearButtonEnabled,
  };
`);
assert.equal(report.safety.heading, "Safety & privacy");
assert.equal(report.safety.dataRows, 4);
assert.equal(report.safety.selfLink, "./safety.html");
assert.deepEqual(report.safety.toolkitLocalKeys, []);
assert.deepEqual(report.safety.toolkitSessionKeys, []);
assert.equal(report.safety.unrelatedLocal, "yes");
assert.equal(report.safety.unrelatedSession, "yes");
assert.equal(report.safety.clearButtonEnabled, true);
assert.match(report.safety.status, /removed/i);
assert.equal(report.safety.cookies, "");
await screenshot("safety-privacy-desktop.png", 1440, 1000);

const unexpectedRequests = observedRequests.filter((requestUrl) => {
  try {
    return new URL(requestUrl).origin !== storageOrigin;
  } catch {
    return true;
  }
});
assert.deepEqual([...new Set(unexpectedRequests)], []);
report.network = { requests: observedRequests.length, unexpectedRequests };

assert.deepEqual(browserErrors, [], `Browser errors: ${browserErrors.join(" | ")}`);
console.log(JSON.stringify({ ...report, browserErrors }, null, 2));
socket.close();
