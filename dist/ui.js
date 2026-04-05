"use strict";
(() => {
  // src/ui.ts
  var columnsEl = document.getElementById("columns");
  var gapXEl = document.getElementById("gapX");
  var gapYEl = document.getElementById("gapY");
  var gapAllEl = document.getElementById("gapAll");
  var gapSplitSection = document.getElementById("gapSplitSection");
  var gapUnifiedSection = document.getElementById("gapUnifiedSection");
  var applyEl = document.getElementById("apply");
  var hintEl = document.getElementById("hint");
  var uniformEl = document.getElementById("uniformColumns");
  var uniformGapsEl = document.getElementById("uniformGaps");
  var detectColumnsEl = document.getElementById("detectColumns");
  function requestSelectionSyncFromMain() {
    parent.postMessage({ pluginMessage: { type: "requestSelectionSync" } }, "*");
  }
  detectColumnsEl.addEventListener("change", () => {
    requestSelectionSyncFromMain();
  });
  function syncGapInputsFromMode() {
    if (uniformGapsEl.checked) {
      const x = readPositiveInt(gapXEl, 16);
      const y = readPositiveInt(gapYEl, 16);
      gapAllEl.value = String(Math.round((x + y) / 2));
    } else {
      const g = readPositiveInt(gapAllEl, 16);
      gapXEl.value = String(g);
      gapYEl.value = String(g);
    }
  }
  function updateGapSectionVisibility() {
    const unified = uniformGapsEl.checked;
    gapSplitSection.style.display = unified ? "none" : "";
    gapUnifiedSection.style.display = unified ? "" : "none";
  }
  uniformGapsEl.addEventListener("change", () => {
    syncGapInputsFromMode();
    updateGapSectionVisibility();
  });
  updateGapSectionVisibility();
  function readColumnFillMode() {
    const el = document.querySelector(
      'input[name="columnFillMode"]:checked'
    );
    return (el == null ? void 0 : el.value) === "nearestColumn" ? "nearestColumn" : "nearestWidth";
  }
  function readPositiveInt(el, fallback) {
    const n = parseInt(el.value, 10);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  }
  function readColumns() {
    const n = parseInt(columnsEl.value, 10);
    return Number.isFinite(n) && n >= 1 ? Math.min(24, n) : 3;
  }
  function setApplyEnabled(ok, message) {
    applyEl.disabled = !ok;
    hintEl.textContent = message;
  }
  applyEl.onclick = () => {
    const uniformGaps = uniformGapsEl.checked;
    const gapX = uniformGaps ? readPositiveInt(gapAllEl, 16) : readPositiveInt(gapXEl, 16);
    const gapY = uniformGaps ? readPositiveInt(gapAllEl, 16) : readPositiveInt(gapYEl, 16);
    parent.postMessage(
      {
        pluginMessage: {
          type: "apply",
          columns: readColumns(),
          gapX,
          gapY,
          uniformColumns: uniformEl.checked,
          uniformGaps,
          columnFillMode: readColumnFillMode(),
          detectColumns: detectColumnsEl.checked
        }
      },
      "*"
    );
  };
  window.onmessage = (event) => {
    const msg = event.data.pluginMessage;
    if (!msg || msg.type !== "selection") {
      return;
    }
    const count = msg.count;
    const detected = msg.detectedColumns;
    if (detectColumnsEl.checked && detected != null) {
      columnsEl.value = String(detected);
    }
    if (count < 2) {
      setApplyEnabled(false, "Select at least two layers.");
    } else {
      setApplyEnabled(
        true,
        "Detect columns: Columns = layers on the top row (same y, 1px tol.), or 1 if fewer than two share that row."
      );
    }
  };
})();
