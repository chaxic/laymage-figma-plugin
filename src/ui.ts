const columnsEl = document.getElementById("columns") as HTMLInputElement;
const gapXEl = document.getElementById("gapX") as HTMLInputElement;
const gapYEl = document.getElementById("gapY") as HTMLInputElement;
const gapAllEl = document.getElementById("gapAll") as HTMLInputElement;
const gapSplitSection = document.getElementById("gapSplitSection") as HTMLDivElement;
const gapUnifiedSection = document.getElementById("gapUnifiedSection") as HTMLDivElement;
const applyEl = document.getElementById("apply") as HTMLButtonElement;
const hintEl = document.getElementById("hint") as HTMLParagraphElement;
const uniformEl = document.getElementById("uniformColumns") as HTMLInputElement;
const uniformGapsEl = document.getElementById("uniformGaps") as HTMLInputElement;
const detectColumnsEl = document.getElementById("detectColumns") as HTMLInputElement;

function requestSelectionSyncFromMain(): void {
  parent.postMessage({ pluginMessage: { type: "requestSelectionSync" } }, "*");
}

detectColumnsEl.addEventListener("change", () => {
  requestSelectionSyncFromMain();
});

function syncGapInputsFromMode(): void {
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

function updateGapSectionVisibility(): void {
  const unified = uniformGapsEl.checked;
  gapSplitSection.style.display = unified ? "none" : "";
  gapUnifiedSection.style.display = unified ? "" : "none";
}

uniformGapsEl.addEventListener("change", () => {
  syncGapInputsFromMode();
  updateGapSectionVisibility();
});
updateGapSectionVisibility();
function readColumnFillMode(): "nearestWidth" | "nearestColumn" {
  const el = document.querySelector(
    'input[name="columnFillMode"]:checked'
  ) as HTMLInputElement | null;
  return el?.value === "nearestColumn" ? "nearestColumn" : "nearestWidth";
}

function readPositiveInt(el: HTMLInputElement, fallback: number): number {
  const n = parseInt(el.value, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function readColumns(): number {
  const n = parseInt(columnsEl.value, 10);
  return Number.isFinite(n) && n >= 1 ? Math.min(24, n) : 3;
}

function setApplyEnabled(ok: boolean, message: string) {
  applyEl.disabled = !ok;
  hintEl.textContent = message;
}

applyEl.onclick = () => {
  const uniformGaps = uniformGapsEl.checked;
  const gapX = uniformGaps
    ? readPositiveInt(gapAllEl, 16)
    : readPositiveInt(gapXEl, 16);
  const gapY = uniformGaps
    ? readPositiveInt(gapAllEl, 16)
    : readPositiveInt(gapYEl, 16);
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
        detectColumns: detectColumnsEl.checked,
      },
    },
    "*"
  );
};

window.onmessage = (event: MessageEvent) => {
  const msg = event.data.pluginMessage;
  if (!msg || msg.type !== "selection") {
    return;
  }
  const count = msg.count as number;
  const detected = msg.detectedColumns as number | null | undefined;
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
