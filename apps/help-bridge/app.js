import {
  createSessionStorage,
  createStorage,
  escapeHTML,
  getAppConfig,
  renderAppIntro,
  renderExperienceCards,
} from "../../packages/shared/src/index.js";
import {
  assessUrgency,
  buildSafetyPlan,
  createSessionDraftRecord,
  readSessionDraftRecord,
  getDraftCompletion,
  normalizeDraft,
} from "./logic.js";

const APP_ID = "help-bridge";
const DRAFT_KEY = "triage-draft";
const config = getAppConfig(APP_ID);
const storage = createSessionStorage(APP_ID);
const legacyStorage = createStorage(APP_ID);
legacyStorage.remove(DRAFT_KEY);

const intro = document.querySelector("#app-intro");
const experienceSection = document.querySelector("#experiences");
const experienceCards = document.querySelector("#experience-cards");
const form = document.querySelector("#triage-form");
const steps = [...document.querySelectorAll(".form-step")];
const nextButton = document.querySelector("#next-button");
const backButton = document.querySelector("#back-button");
const planButton = document.querySelector("#plan-button");
const saveButton = document.querySelector("#save-button");
const clearButton = document.querySelector("#clear-button");
const saveStatus = document.querySelector("#save-status");
const stepLabel = document.querySelector("#step-label");
const meterFill = document.querySelector("#meter-fill");
const immediateWarning = document.querySelector("#immediate-warning");

const resumePanel = document.querySelector("#resume-draft");
const resumeButton = document.querySelector("#resume-button");
const discardDraftButton = document.querySelector("#discard-draft-button");
let currentStep = 0;
let draftExpiryTimer = null;

intro.innerHTML = renderAppIntro(config);
const experiences = config.domainExperiences ?? config.experiences ?? [];
if (experiences.length > 0) {
  experienceCards.innerHTML = renderExperienceCards(experiences);
} else {
  experienceSection.hidden = true;
}

if (config.title) document.title = `${config.title} · Small Steps`;

function formValue() {
  return normalizeDraft(Object.fromEntries(new FormData(form).entries()));
}

function setFormValue(draftValue) {
  const draft = normalizeDraft(draftValue);
  for (const [name, value] of Object.entries(draft)) {
    const controls = [...form.querySelectorAll(`[name="${name}"]`)];
    for (const control of controls) {
      if (control.type === "radio") {
        const normalizedValue = value === "unsure"
          ? "unsure"
          : value === true ? "yes" : value === false ? "no" : "";
        control.checked = name === "incidentType"
          ? control.value === value
          : control.value === normalizedValue;
      } else {
        control.value = value ?? "";
      }
    }
  }
}

function setStatus(message) {
  saveStatus.textContent = message;
}

function clearExpiryTimer() {
  if (draftExpiryTimer !== null) {
    clearTimeout(draftExpiryTimer);
    draftExpiryTimer = null;
  }
}

function removeStoredDraft(message) {
  storage.remove(DRAFT_KEY);
  clearExpiryTimer();
  resumePanel.hidden = true;
  if (message) {
    setStatus(message);
  }
}

function expireStoredDraft() {
  removeStoredDraft("The temporary draft expired and was removed from this tab.");
}

function scheduleDraftExpiry(expiresAt) {
  clearExpiryTimer();
  const delay = Math.max(0, Date.parse(expiresAt) - Date.now());
  draftExpiryTimer = setTimeout(() => {
    draftExpiryTimer = null;
    expireStoredDraft();
  }, delay);
}

function enforceDraftExpiry() {
  const record = storage.get(DRAFT_KEY, null);
  if (!record) {
    resumePanel.hidden = true;
    clearExpiryTimer();
    return;
  }

  if (!readSessionDraftRecord(record)) {
    expireStoredDraft();
    return;
  }

  scheduleDraftExpiry(record.expiresAt);
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) enforceDraftExpiry();
});
globalThis.addEventListener("focus", enforceDraftExpiry);
globalThis.addEventListener("pageshow", enforceDraftExpiry);

function updateImmediateWarning() {
  const draft = formValue();
  const urgency = assessUrgency(draft);
  const hasCriticalUncertainty = [
    draft.safeNow,
    draft.directThreat,
    draft.knowsLocation,
  ].includes("unsure");

  immediateWarning.hidden = !urgency.emergency && !hasCriticalUncertainty;
  if (immediateWarning.hidden) {
    return;
  }

  const heading = immediateWarning.querySelector("strong");
  const copy = immediateWarning.querySelector("p");
  heading.textContent = urgency.emergency
    ? "Get immediate help now."
    : "Check your safety with an adult now.";
  copy.textContent = urgency.emergency
    ? "Move toward a safer place and involve a nearby adult. If danger is immediate, call your local emergency number (112 in Germany and across the EU). Keep using this form only if it is safe."
    : "Move near a safe adult and check the uncertain details together. If you may be in immediate danger, use your local emergency number.";
}

function validateStep(index) {
  const requiredControls = [...steps[index].querySelectorAll("[required]")];
  const checkedNames = new Set();

  for (const control of requiredControls) {
    if (control.type === "radio") {
      if (checkedNames.has(control.name)) continue;
      checkedNames.add(control.name);
      const selected = steps[index].querySelector(`[name="${control.name}"]:checked`);
      if (!selected) {
        control.setCustomValidity("Choose an answer to continue.");
        control.reportValidity();
        control.setCustomValidity("");
        return false;
      }
    } else if (!control.checkValidity()) {
      control.reportValidity();
      return false;
    }
  }
  return true;
}

function showStep(index, { focus = true } = {}) {
  currentStep = Math.max(0, Math.min(index, steps.length - 1));
  steps.forEach((step, stepIndex) => { step.hidden = stepIndex !== currentStep; });

  const isPlan = currentStep === steps.length - 1;
  nextButton.hidden = currentStep >= steps.length - 2;
  planButton.hidden = currentStep !== steps.length - 2;
  backButton.hidden = currentStep === 0;
  stepLabel.textContent = `Step ${currentStep + 1} of ${steps.length}`;
  meterFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;

  if (currentStep === 1) {
    immediateWarning.hidden = true;
    updateImmediateWarning();
  }

  if (focus) {
    const heading = steps[currentStep].querySelector("h3, [tabindex='-1']");
    heading?.focus({ preventScroll: true });
    steps[currentStep].scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (isPlan) renderPlan();
}

function renderPlan() {
  const { urgency, steps: planSteps } = buildSafetyPlan(formValue());
  const panel = document.querySelector("#urgency-panel");
  panel.dataset.level = urgency.level;
  document.querySelector("#urgency-label").textContent = urgency.label;
  document.querySelector("#plan-title").textContent = urgency.emergency
    ? "Start with immediate safety"
    : "Your calm next-step plan";
  document.querySelector("#urgency-summary").textContent = urgency.summary;
  document.querySelector("#plan-list").innerHTML = planSteps.map((step) => `
    <li>
      <span class="plan-number" aria-hidden="true"></span>
      <div><h4>${escapeHTML(step.title)}</h4><p>${escapeHTML(step.detail)}</p></div>
    </li>
  `).join("");
}

nextButton.addEventListener("click", () => {
  if (!validateStep(currentStep)) return;
  showStep(currentStep + 1);
});

backButton.addEventListener("click", () => showStep(currentStep - 1));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateStep(currentStep)) return;
  showStep(steps.length - 1);
  setStatus("Plan built without saving. Use Keep in this tab only if you want a 30-minute temporary draft.");
});

saveButton.addEventListener("click", () => {
  const draft = formValue();
  const completion = getDraftCompletion(draft);
  const record = createSessionDraftRecord(draft);
  storage.set(DRAFT_KEY, record);
  resumePanel.hidden = true;
  scheduleDraftExpiry(record.expiresAt);
  setStatus(`Temporary structured draft kept in this tab for 30 minutes (${completion.complete} of ${completion.total} check-in answers complete).`);
});

clearButton.addEventListener("click", () => {
  form.reset();
  removeStoredDraft("Your temporary Help Bridge draft was cleared from this tab.");
  updateImmediateWarning();
  showStep(0);
});

resumeButton.addEventListener("click", () => {
  const record = storage.get(DRAFT_KEY, null);
  const draft = readSessionDraftRecord(record);
  if (!draft) {
    expireStoredDraft();
    return;
  }

  setFormValue(draft);
  resumePanel.hidden = true;
  scheduleDraftExpiry(record.expiresAt);
  const completion = getDraftCompletion(draft);
  setStatus(`Temporary draft resumed in this tab (${completion.percent}% complete).`);
  updateImmediateWarning();
  showStep(0);
});

discardDraftButton.addEventListener("click", () => {
  removeStoredDraft("The temporary draft was discarded without showing its answers.");
  form.reset();
  showStep(0);
});

form.addEventListener("change", (event) => {
  if (steps[1].contains(event.target)) {
    updateImmediateWarning();
  }
});

experienceCards.addEventListener("click", (event) => {
  const intentControl = event.target.closest("[data-experience-intent]");
  if (!intentControl) {
    return;
  }

  const incidentType = normalizeDraft({
    incidentType: intentControl.dataset.experienceIntent,
  }).incidentType;
  if (!incidentType) {
    return;
  }

  event.preventDefault();
  const incidentControl = [...form.querySelectorAll('[name="incidentType"]')].find(
    (control) => control.value === incidentType,
  );
  if (incidentControl) {
    incidentControl.checked = true;
  }
  showStep(0);
  incidentControl?.focus({ preventScroll: true });
  setStatus("Starting point selected. Review it, then continue when you are ready.");
});

const storedRecord = storage.get(DRAFT_KEY, null);
const savedDraft = readSessionDraftRecord(storedRecord);
if (storedRecord && !savedDraft) {
  removeStoredDraft("An expired, oversized or unknown temporary draft was removed.");
} else if (savedDraft) {
  resumePanel.hidden = false;
  scheduleDraftExpiry(storedRecord.expiresAt);
  setStatus("A temporary draft is available. Its incident answers remain hidden until you choose Resume.");
}

showStep(0, { focus: false });
form.hidden = false;
