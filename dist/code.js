"use strict";
(() => {
  // inlined-ui:inlined-ui-html
  var inlined_ui_html_default = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      :root {
        font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 12px;
        color: var(--figma-color-text, #333);
      }
      body {
        margin: 0;
        padding: 12px;
      }
      label {
        display: block;
        margin-bottom: 4px;
        font-weight: 500;
      }
      .row {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 10px;
      }
      input[type="number"] {
        box-sizing: border-box;
        padding: 6px 8px;
        border: 1px solid var(--figma-color-border, #ccc);
        border-radius: 4px;
        background: var(--figma-color-bg, #fff);
        color: inherit;
      }
      button {
        width: 100%;
        padding: 8px;
        margin-top: 4px;
        border: none;
        border-radius: 4px;
        background: var(--figma-color-bg-brand, #0d99ff);
        color: var(--figma-color-text-onbrand, #fff);
        font-weight: 600;
        cursor: pointer;
      }
      button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .hint {
        margin-top: 10px;
        color: var(--figma-color-text-secondary, #666);
        line-height: 1.4;
      }
      details.plugin-group {
        border: 1px solid var(--figma-color-border, #ccc);
        border-radius: 4px;
        margin: 0;
        overflow: hidden;
      }
      details.plugin-group summary {
        font-weight: 500;
        padding: 8px 10px;
        cursor: pointer;
        user-select: none;
        list-style: none;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      details.plugin-group summary::-webkit-details-marker {
        display: none;
      }
      details.plugin-group summary::before {
        content: "";
        display: block;
        flex-shrink: 0;
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-left: 9px solid var(--figma-color-text, #333);
        opacity: 0.85;
        transition: transform 0.15s ease;
        transform-origin: 40% 50%;
      }
      details.plugin-group[open] summary::before {
        transform: rotate(90deg);
      }
      details.plugin-group .group-body {
        padding: 8px 10px 10px;
        border-top: 1px solid var(--figma-color-border, #ccc);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .labeled-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .labeled-row label {
        margin: 0;
        font-weight: 500;
        flex-shrink: 0;
      }
      .labeled-row input[type="number"] {
        flex: 1;
        min-width: 0;
        width: auto;
      }
      .checkbox-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .checkbox-row label {
        margin: 0;
        font-weight: 500;
        flex: 1;
      }
      .checkbox-row label.video-outline-label {
        font-weight: 700;
      }
      .pre-apply-block {
        margin-bottom: 8px;
      }
      .checkbox-row input[type="checkbox"] {
        flex-shrink: 0;
      }
      .radio-option {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .radio-option label {
        margin: 0;
        font-weight: 400;
        flex: 1;
      }
      .radio-option input[type="radio"] {
        flex-shrink: 0;
      }
      #gapSplitSection,
      #gapUnifiedSection {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    </style>
  </head>
  <body>
    <div class="row">
      <div class="labeled-row">
        <label for="columns" title="How many columns to flow items into.">Columns</label>
        <input
          id="columns"
          type="number"
          min="1"
          max="24"
          value="3"
          title="How many columns to flow items into."
        />
      </div>
      <div class="checkbox-row">
        <label
          for="uniformColumns"
          title="Use the same column width for every column (based on the widest header)."
          >Uniform columns</label
        >
        <input
          id="uniformColumns"
          type="checkbox"
          title="Use the same column width for every column (based on the widest header)."
        />
      </div>
      <div class="checkbox-row">
        <label
          for="lockBounds"
          title="Keep the selection\u2019s overall width the same by scaling column widths to fit within the original bounds."
          >Lock bounds</label
        >
        <input
          id="lockBounds"
          type="checkbox"
          title="Keep the selection\u2019s overall width the same by scaling column widths to fit within the original bounds."
        />
      </div>
      <div class="checkbox-row">
        <label
          for="detectColumns"
          title="Auto-set Columns based on how many selected layers share the top row (same y within 1px). If fewer than two share that row, uses 1."
          >Detect columns</label
        >
        <input
          id="detectColumns"
          type="checkbox"
          title="Auto-set Columns based on how many selected layers share the top row (same y within 1px). If fewer than two share that row, uses 1."
        />
      </div>
    </div>
    <div class="row">
      <div id="gapSplitSection">
        <div class="labeled-row">
          <label
            for="gapX"
            title="Horizontal space between columns, measured between visible stroke edges when strokes are enabled."
            >Horizontal gap</label
          >
          <input
            id="gapX"
            type="number"
            min="0"
            max="999"
            value="16"
            title="Horizontal space between columns, measured between visible stroke edges when strokes are enabled."
          />
        </div>
        <div class="labeled-row">
          <label
            for="gapY"
            title="Vertical space between items in a column, measured between visible stroke edges when strokes are enabled."
            >Vertical gap</label
          >
          <input
            id="gapY"
            type="number"
            min="0"
            max="999"
            value="16"
            title="Vertical space between items in a column, measured between visible stroke edges when strokes are enabled."
          />
        </div>
      </div>
      <div id="gapUnifiedSection" style="display: none">
        <div class="labeled-row">
          <label
            for="gapAll"
            title="Single gap value used for both horizontal and vertical spacing."
            >Gap</label
          >
          <input
            id="gapAll"
            type="number"
            min="0"
            max="999"
            value="16"
            title="Single gap value used for both horizontal and vertical spacing."
          />
        </div>
      </div>
      <div class="checkbox-row">
        <label
          for="uniformGaps"
          title="Use one gap value for both horizontal and vertical gaps."
          >Uniform gaps</label
        >
        <input
          id="uniformGaps"
          type="checkbox"
          title="Use one gap value for both horizontal and vertical gaps."
        />
      </div>
    </div>
    <div class="row">
      <details class="plugin-group" open>
        <summary>Arrange by</summary>
        <div class="group-body">
          <div class="radio-option">
            <label
              for="fillNearestWidth"
              title="Assign items to the column whose header width is closest to the item\u2019s current width."
              >Nearest width</label
            >
            <input
              id="fillNearestWidth"
              type="radio"
              name="columnFillMode"
              value="nearestWidth"
              checked
              title="Assign items to the column whose header width is closest to the item\u2019s current width."
            />
          </div>
          <div class="radio-option">
            <label
              for="fillNearestColumn"
              title="Assign items to the nearest column horizontally (based on distance to the column header\u2019s center)."
              >Nearest column</label
            >
            <input
              id="fillNearestColumn"
              type="radio"
              name="columnFillMode"
              value="nearestColumn"
              title="Assign items to the nearest column horizontally (based on distance to the column header\u2019s center)."
            />
          </div>
        </div>
      </details>
    </div>
    <div id="videoOutlineRow" class="pre-apply-block" style="display: none">
      <div class="checkbox-row">
        <label
          class="video-outline-label"
          for="videoOutlineFix"
          title="FigJam does not expose strokes on video media. Turn on to add 8px outline spacing in gap math so layout matches what you see on the board."
          >Video Outline Fix</label
        >
        <input
          id="videoOutlineFix"
          type="checkbox"
          title="FigJam does not expose strokes on video media. Turn on to add 8px outline spacing in gap math so layout matches what you see on the board."
        />
      </div>
    </div>
    <button
      id="apply"
      type="button"
      disabled
      title="Apply the layout to the current selection."
    >
      Apply layout
    </button>
    <p class="hint" id="hint">Select at least two layers with the same parent.</p>
    <script>
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
  var lockBoundsEl = document.getElementById("lockBounds");
  var videoOutlineRow = document.getElementById("videoOutlineRow");
  var videoOutlineFixEl = document.getElementById("videoOutlineFix");
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
    var _a;
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
          detectColumns: detectColumnsEl.checked,
          lockBounds: lockBoundsEl.checked,
          videoOutlineFix: (_a = videoOutlineFixEl == null ? void 0 : videoOutlineFixEl.checked) != null ? _a : false
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
    const videoOutlineFixVisible = msg.videoOutlineFixVisible === true;
    if (videoOutlineRow && videoOutlineFixEl) {
      if (videoOutlineFixVisible) {
        videoOutlineRow.style.display = "";
      } else {
        videoOutlineRow.style.display = "none";
        videoOutlineFixEl.checked = false;
      }
    }
    const detected = msg.detectedColumns;
    if (detectColumnsEl.checked && detected != null) {
      columnsEl.value = String(detected);
    }
    if (count < 2) {
      setApplyEnabled(false, "Select at least two layers.");
    } else {
      setApplyEnabled(true, "Ready.");
    }
  };
})();

</script>
  </body>
</html>
`;

  // src/masonry.ts
  function hasLayout(node) {
    return "width" in node && "height" in node && "x" in node && "y" in node;
  }
  function getSharedParent(nodes) {
    if (nodes.length === 0) {
      return null;
    }
    const p = nodes[0].parent;
    if (!p || !("children" in p)) {
      return null;
    }
    for (let i = 1; i < nodes.length; i++) {
      if (nodes[i].parent !== p) {
        return null;
      }
    }
    return p;
  }
  function selectionBounds(nodes) {
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;
    for (const n of nodes) {
      left = Math.min(left, n.x);
      top = Math.min(top, n.y);
      right = Math.max(right, n.x + n.width);
      bottom = Math.max(bottom, n.y + n.height);
    }
    return {
      left,
      top,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top)
    };
  }
  var MIN_SIZE = 0.01;
  var TOP_ROW_Y_TOLERANCE = 1;
  var FIGJAM_MEDIA_DEFAULT_OUTLINE_STROKE_PX = 8;
  function getEditorType() {
    const f = globalThis.figma;
    const t = f == null ? void 0 : f.editorType;
    if (t === "figjam" || t === "figma" || t === "dev" || t === "slides" || t === "buzz") {
      return t;
    }
    return "figma";
  }
  var VIDEO_FILENAME_EXT = /\.(mp4|mov|webm|mkv|m4v|avi)/i;
  function isFigJamVideoMediaFile(node) {
    if (getEditorType() !== "figjam") {
      return false;
    }
    if (node.type !== "MEDIA") {
      return false;
    }
    if (!hasLayout(node)) {
      return false;
    }
    if ("name" in node && typeof node.name === "string") {
      if (VIDEO_FILENAME_EXT.test(node.name)) {
        return true;
      }
    }
    const md = node.mediaData;
    if (!md || typeof md.hash !== "string") {
      return false;
    }
    const fig = globalThis.figma;
    const get = fig == null ? void 0 : fig.getImageByHash;
    if (typeof get !== "function") {
      return false;
    }
    try {
      return get.call(fig, md.hash) == null;
    } catch (e) {
      return false;
    }
  }
  function detectTopRowColumnCount(nodes) {
    if (nodes.length === 0) {
      return null;
    }
    if (nodes.length === 1) {
      return 1;
    }
    let minY = Infinity;
    for (const n of nodes) {
      minY = Math.min(minY, n.y);
    }
    let topRow = 0;
    for (const n of nodes) {
      if (Math.abs(n.y - minY) <= TOP_ROW_Y_TOLERANCE) {
        topRow++;
      }
    }
    if (topRow < 2) {
      return 1;
    }
    return Math.min(24, topRow);
  }
  function strokeOutsets(node, videoOutlineFix) {
    const z = { top: 0, right: 0, bottom: 0, left: 0 };
    if (videoOutlineFix && isFigJamVideoMediaFile(node)) {
      const w = FIGJAM_MEDIA_DEFAULT_OUTLINE_STROKE_PX;
      return { top: w, right: w, bottom: w, left: w };
    }
    if (!("strokes" in node) || !("strokeAlign" in node)) {
      return z;
    }
    const strokes = node.strokes;
    if (Array.isArray(strokes)) {
      if (strokes.length === 0) {
        return z;
      }
      const anyVisible = strokes.some((p) => {
        const paint = p;
        if (paint.visible === false) return false;
        if (typeof paint.opacity === "number" && paint.opacity <= 0) return false;
        return true;
      });
      if (!anyVisible) {
        return z;
      }
    }
    const align = node.strokeAlign;
    const f = align === "OUTSIDE" ? 1 : align === "CENTER" ? 0.5 : 0;
    if (f === 0) {
      return z;
    }
    let topW;
    let rightW;
    let bottomW;
    let leftW;
    if ("strokeTopWeight" in node && typeof node.strokeTopWeight === "number") {
      const s = node;
      topW = s.strokeTopWeight;
      rightW = s.strokeRightWeight;
      bottomW = s.strokeBottomWeight;
      leftW = s.strokeLeftWeight;
    } else if (typeof node.strokeWeight === "number") {
      topW = rightW = bottomW = leftW = node.strokeWeight;
    } else {
      return z;
    }
    if (topW <= 0 && rightW <= 0 && bottomW <= 0 && leftW <= 0) {
      return z;
    }
    return {
      top: topW * f,
      right: rightW * f,
      bottom: bottomW * f,
      left: leftW * f
    };
  }
  function layoutOutsets(node, videoOutlineFix) {
    return strokeOutsets(node, videoOutlineFix);
  }
  function compareTopLeft(a, b) {
    if (a.y !== b.y) {
      return a.y - b.y;
    }
    return a.x - b.x;
  }
  function fitWidthPreservingAspect(node, targetWidth) {
    function readStrokeWeights(n) {
      if (!("strokes" in n) || !("strokeAlign" in n)) {
        return { kind: "none" };
      }
      if (n.strokes.length === 0) {
        return { kind: "none" };
      }
      if ("strokeTopWeight" in n && typeof n.strokeTopWeight === "number") {
        const s = n;
        return {
          kind: "individual",
          top: s.strokeTopWeight,
          right: s.strokeRightWeight,
          bottom: s.strokeBottomWeight,
          left: s.strokeLeftWeight
        };
      }
      if ("strokeWeight" in n) {
        const w2 = n.strokeWeight;
        if (typeof w2 === "number" && Number.isFinite(w2)) {
          return { kind: "uniform", weight: w2 };
        }
      }
      return { kind: "none" };
    }
    function restoreStrokeWeights(n, state) {
      if (state.kind === "none") return;
      if (!("strokes" in n) || !("strokeAlign" in n)) return;
      if (n.strokes.length === 0) return;
      if (state.kind === "individual") {
        if ("strokeTopWeight" in n && typeof n.strokeTopWeight === "number") {
          const s = n;
          s.strokeTopWeight = state.top;
          s.strokeRightWeight = state.right;
          s.strokeBottomWeight = state.bottom;
          s.strokeLeftWeight = state.left;
        }
        return;
      }
      if ("strokeWeight" in n) {
        const w2 = n.strokeWeight;
        if (typeof w2 === "number") {
          n.strokeWeight = state.weight;
        }
      }
    }
    if (targetWidth < MIN_SIZE) {
      return;
    }
    if (node.type === "LINE") {
      node.resize(Math.max(MIN_SIZE, targetWidth), 0);
      return;
    }
    const w = node.width;
    if (w < MIN_SIZE) {
      return;
    }
    const scale = targetWidth / w;
    if (scale < MIN_SIZE) {
      return;
    }
    const strokeState = readStrokeWeights(node);
    let rescaleFn;
    try {
      rescaleFn = node.rescale;
    } catch (e) {
      rescaleFn = void 0;
    }
    if (typeof rescaleFn === "function") {
      try {
        rescaleFn.call(node, scale);
        restoreStrokeWeights(node, strokeState);
        return;
      } catch (e) {
      }
    }
    const h = node.height;
    const newW = Math.max(MIN_SIZE, targetWidth);
    const newH = Math.max(MIN_SIZE, h * scale);
    node.resize(newW, newH);
  }
  function columnXStarts(left, targetW, gapX, uniformColumns, headersByCol, videoOutlineFix) {
    var _a;
    const cols = targetW.length;
    const xs = new Array(cols);
    const out = (i) => i < headersByCol.length ? layoutOutsets(headersByCol[i], videoOutlineFix) : { top: 0, right: 0, bottom: 0, left: 0 };
    xs[0] = left;
    if (uniformColumns) {
      const w = (_a = targetW[0]) != null ? _a : 0;
      for (let c = 1; c < cols; c++) {
        xs[c] = xs[c - 1] + w + out(c - 1).right + gapX + out(c).left;
      }
      return xs;
    }
    for (let c = 1; c < cols; c++) {
      const wPrev = targetW[c - 1];
      if (wPrev < MIN_SIZE) {
        xs[c] = xs[c - 1];
        continue;
      }
      xs[c] = xs[c - 1] + wPrev + out(c - 1).right + gapX + out(c).left;
    }
    return xs;
  }
  function buildColumnStacks(nodes, colCount, gapY, columnFillMode, videoOutlineFix) {
    const sorted = [...nodes].sort(compareTopLeft);
    const headerCount = Math.min(colCount, nodes.length);
    const rawHeaders = sorted.slice(0, headerCount);
    const headersByCol = [...rawHeaders].sort((a, b) => a.x - b.x);
    const headerSet = new Set(headersByCol);
    const refW = new Array(colCount).fill(0);
    for (let c = 0; c < headersByCol.length; c++) {
      refW[c] = headersByCol[c].width;
    }
    const stacks = Array.from({ length: colCount }, () => []);
    const colHeights = new Array(colCount).fill(0);
    for (let c = 0; c < headersByCol.length; c++) {
      const h = headersByCol[c];
      stacks[c].push(h);
      const o = layoutOutsets(h, videoOutlineFix);
      colHeights[c] = h.height + o.bottom + gapY;
    }
    const remaining = nodes.filter((n) => !headerSet.has(n));
    const remainingSorted = [...remaining].sort(compareTopLeft);
    function pickShortestColumn() {
      let col = 0;
      let minH = colHeights[0];
      for (let j = 1; j < colCount; j++) {
        if (colHeights[j] < minH) {
          minH = colHeights[j];
          col = j;
        }
      }
      return col;
    }
    for (const node of remainingSorted) {
      let bestCol = 0;
      if (columnFillMode === "nearestWidth") {
        let bestDist = Infinity;
        let bestH = Infinity;
        for (let j = 0; j < colCount; j++) {
          if (refW[j] < MIN_SIZE) {
            continue;
          }
          const d = Math.abs(node.width - refW[j]);
          const h = colHeights[j];
          if (d < bestDist || d === bestDist && h < bestH || d === bestDist && h === bestH && j < bestCol) {
            bestDist = d;
            bestH = h;
            bestCol = j;
          }
        }
        if (bestDist === Infinity) {
          bestCol = pickShortestColumn();
        }
      } else {
        const cx = node.x + node.width / 2;
        let bestDist = Infinity;
        let bestH = Infinity;
        for (let j = 0; j < colCount; j++) {
          if (j >= headersByCol.length) {
            continue;
          }
          const hdr = headersByCol[j];
          const hc = hdr.x + hdr.width / 2;
          const d = Math.abs(cx - hc);
          const h = colHeights[j];
          if (d < bestDist || d === bestDist && h < bestH || d === bestDist && h === bestH && j < bestCol) {
            bestDist = d;
            bestH = h;
            bestCol = j;
          }
        }
        if (bestDist === Infinity) {
          bestCol = pickShortestColumn();
        }
      }
      stacks[bestCol].push(node);
      const o = layoutOutsets(node, videoOutlineFix);
      colHeights[bestCol] += o.top + node.height + o.bottom + gapY;
    }
    return { stacks, headersByCol };
  }
  function computeMasonryLayout(nodes, columns, gapX, gapY, uniformColumns, columnFillMode, uniformGaps, lockBounds = false, videoOutlineFix = false) {
    var _a, _b, _c;
    const safeCols = Math.max(1, Math.floor(columns));
    const { left, top, width: boundsWidth } = selectionBounds(nodes);
    const { stacks, headersByCol } = buildColumnStacks(
      nodes,
      safeCols,
      gapY,
      columnFillMode,
      videoOutlineFix
    );
    const refW = new Array(safeCols).fill(0);
    for (let c = 0; c < headersByCol.length; c++) {
      refW[c] = headersByCol[c].width;
    }
    let maxFirst = 0;
    for (let c = 0; c < safeCols; c++) {
      if (refW[c] > maxFirst) {
        maxFirst = refW[c];
      }
    }
    if (maxFirst < MIN_SIZE) {
      return {
        ok: false,
        reason: "Could not read a valid width from the column headers."
      };
    }
    const targetW = new Array(safeCols);
    if (uniformColumns) {
      for (let c = 0; c < safeCols; c++) {
        targetW[c] = maxFirst;
      }
    } else {
      for (let c = 0; c < safeCols; c++) {
        targetW[c] = refW[c] > MIN_SIZE ? refW[c] : 0;
      }
    }
    if (lockBounds && safeCols >= 1) {
      const out = (i) => i < headersByCol.length ? layoutOutsets(headersByCol[i], videoOutlineFix) : { top: 0, right: 0, bottom: 0, left: 0 };
      let fixedSpacing = 0;
      for (let c = 1; c < safeCols; c++) {
        fixedSpacing += out(c - 1).right + gapX + out(c).left;
      }
      let sumWidths = 0;
      if (uniformColumns) {
        sumWidths = ((_a = targetW[0]) != null ? _a : 0) * safeCols;
      } else {
        for (let c = 0; c < safeCols; c++) sumWidths += (_b = targetW[c]) != null ? _b : 0;
      }
      const available = boundsWidth - fixedSpacing;
      if (available < MIN_SIZE * safeCols || sumWidths < MIN_SIZE) {
        return {
          ok: false,
          reason: "Lock bounds failed: selection is too narrow for the current columns/gap settings."
        };
      }
      const scale = available / sumWidths;
      if (!Number.isFinite(scale) || scale < MIN_SIZE) {
        return {
          ok: false,
          reason: "Lock bounds failed: invalid scaling factor for current selection bounds."
        };
      }
      for (let c = 0; c < safeCols; c++) {
        targetW[c] = Math.max(MIN_SIZE, ((_c = targetW[c]) != null ? _c : 0) * scale);
      }
    }
    for (let c = 0; c < safeCols; c++) {
      const tw = targetW[c];
      for (const node of stacks[c]) {
        fitWidthPreservingAspect(node, tw);
      }
    }
    const colXs = columnXStarts(
      left,
      targetW,
      gapX,
      uniformColumns,
      headersByCol,
      videoOutlineFix
    );
    const placements = [];
    for (let c = 0; c < safeCols; c++) {
      let prevY = top;
      let prevH = 0;
      let prevOutBottom = 0;
      let isFirst = true;
      for (const node of stacks[c]) {
        const o = layoutOutsets(node, videoOutlineFix);
        const y = isFirst ? top : prevY + prevH + prevOutBottom + gapY + o.top;
        placements.push({ node, x: colXs[c], y });
        isFirst = false;
        prevY = y;
        prevH = node.height;
        prevOutBottom = o.bottom;
      }
    }
    return { ok: true, placements };
  }

  // src/code.ts
  figma.showUI(inlined_ui_html_default, {
    width: 280,
    height: 430,
    themeColors: true
  });
  function pushSelectionState() {
    const raw = figma.currentPage.selection;
    const forDetect = [];
    for (const n of raw) {
      if (!n.locked && hasLayout(n)) {
        forDetect.push(n);
      }
    }
    const detectedColumns = forDetect.length >= 1 ? detectTopRowColumnCount(forDetect) : null;
    figma.ui.postMessage({
      type: "selection",
      count: raw.length,
      detectedColumns,
      editorType: figma.editorType,
      videoOutlineFixVisible: selectionIncludesFigJamVideoMedia(raw)
    });
  }
  figma.on("selectionchange", pushSelectionState);
  pushSelectionState();
  function selectionIncludesFigJamVideoMedia(raw) {
    if (figma.editorType !== "figjam") {
      return false;
    }
    for (const n of raw) {
      if (isFigJamVideoMediaFile(n)) {
        return true;
      }
    }
    return false;
  }
  figma.ui.onmessage = (msg) => {
    var _a;
    if (msg.type === "requestSelectionSync") {
      pushSelectionState();
      return;
    }
    if (msg.type !== "apply") {
      return;
    }
    const raw = figma.currentPage.selection;
    if (raw.length < 2) {
      figma.notify("Select at least two layers.");
      return;
    }
    const nodes = [];
    for (const n of raw) {
      if (n.locked) {
        figma.notify("Unlock all selected layers and try again.");
        return;
      }
      if (!hasLayout(n)) {
        figma.notify("Selection includes a layer without layout (size/position).");
        return;
      }
      nodes.push(n);
    }
    const parent = getSharedParent(nodes);
    if (!parent) {
      figma.notify("All selected layers must share the same parent.");
      return;
    }
    let columns = Math.max(1, Math.min(24, Math.floor(Number(msg.columns)) || 3));
    if (msg.detectColumns) {
      columns = (_a = detectTopRowColumnCount(nodes)) != null ? _a : columns;
    }
    const gapX = Math.max(0, Math.min(999, Number(msg.gapX) || 0));
    const gapY = Math.max(0, Math.min(999, Number(msg.gapY) || 0));
    const fillMode = msg.columnFillMode === "nearestColumn" ? "nearestColumn" : "nearestWidth";
    const selectionHasVideoMedia = selectionIncludesFigJamVideoMedia(raw);
    const videoOutlineFix = figma.editorType === "figjam" && Boolean(msg.videoOutlineFix) && selectionHasVideoMedia;
    let result;
    try {
      result = computeMasonryLayout(
        nodes,
        columns,
        gapX,
        gapY,
        Boolean(msg.uniformColumns),
        fillMode,
        Boolean(msg.uniformGaps),
        Boolean(msg.lockBounds),
        videoOutlineFix
      );
    } catch (e) {
      const m = e instanceof Error ? e.message : String(e);
      figma.notify(`Layout failed: ${m}`);
      return;
    }
    if (!result.ok) {
      figma.notify(result.reason);
      return;
    }
    for (const { node, x, y } of result.placements) {
      node.x = x;
      node.y = y;
    }
    figma.notify("Layout applied.");
  };
})();
