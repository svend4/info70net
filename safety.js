const TOOLKIT_PREFIXES = Object.freeze([
  "safe-search:",
  "media-time:",
  "help-bridge:",
  "ai-literacy:",
]);

const clearButton = document.querySelector("#clear-toolkit-data");
const clearStatus = document.querySelector("#clear-status");
function resolveStorage(name) {
  try {
    return globalThis[name] ?? null;
  } catch {
    return null;
  }
}


function removeToolkitKeys(storage) {
  let removed = 0;

  if (!storage) {
    return { removed, available: false };
  }

  try {
    for (let index = storage.length - 1; index >= 0; index -= 1) {
      const key = storage.key(index);
      if (
        typeof key === "string" &&
        TOOLKIT_PREFIXES.some((prefix) => key.startsWith(prefix))
      ) {
        storage.removeItem(key);
        removed += 1;
      }
    }
  } catch {
    return { removed, available: false };
  }

  return { removed, available: true };
}

clearButton.addEventListener("click", () => {
  const localResult = removeToolkitKeys(resolveStorage("localStorage"));
  const sessionResult = removeToolkitKeys(resolveStorage("sessionStorage"));
  const removed = localResult.removed + sessionResult.removed;

  if (!localResult.available && !sessionResult.available) {
    clearStatus.textContent =
      "Browser storage is unavailable. Close the tool tabs to remove in-memory progress.";
    return;
  }

  clearStatus.textContent = removed === 0
    ? "No stored Small Steps data was found in this tab or browser."
    : `${removed} stored ${removed === 1 ? "item was" : "items were"} removed. Close or clear other open tool tabs to remove their own session data and in-memory values.`;
});

clearButton.disabled = false;
