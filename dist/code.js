"use strict";
(() => {
  // inlined-ui:inlined-ui-html
  var inlined_ui_html_default = `<!DOCTYPE html>\r
<html>\r
  <head>\r
    <meta charset="utf-8" />\r
    <style>\r
      :root {\r
        font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;\r
        font-size: 12px;\r
        color: var(--figma-color-text, #333);\r
      }\r
      body {\r
        margin: 0;\r
        padding: 12px;\r
      }\r
      label {\r
        display: block;\r
        margin-bottom: 4px;\r
        font-weight: 500;\r
      }\r
      .row {\r
        display: flex;\r
        flex-direction: column;\r
        gap: 8px;\r
        margin-bottom: 10px;\r
      }\r
      input[type="number"] {\r
        box-sizing: border-box;\r
        padding: 6px 8px;\r
        border: 1px solid var(--figma-color-border, #ccc);\r
        border-radius: 4px;\r
        background: var(--figma-color-bg, #fff);\r
        color: inherit;\r
      }\r
      button {\r
        width: 100%;\r
        padding: 8px;\r
        margin-top: 4px;\r
        border: none;\r
        border-radius: 4px;\r
        background: var(--figma-color-bg-brand, #0d99ff);\r
        color: var(--figma-color-text-onbrand, #fff);\r
        font-weight: 600;\r
        cursor: pointer;\r
      }\r
      button:disabled {\r
        opacity: 0.45;\r
        cursor: not-allowed;\r
      }\r
      .hint {\r
        margin-top: 10px;\r
        color: var(--figma-color-text-secondary, #666);\r
        line-height: 1.4;\r
      }\r
      details.plugin-group {\r
        border: 1px solid var(--figma-color-border, #ccc);\r
        border-radius: 4px;\r
        margin: 0;\r
        overflow: hidden;\r
      }\r
      details.plugin-group summary {\r
        font-weight: 500;\r
        padding: 8px 10px;\r
        cursor: pointer;\r
        user-select: none;\r
        list-style: none;\r
        display: flex;\r
        align-items: center;\r
        gap: 6px;\r
      }\r
      details.plugin-group summary::-webkit-details-marker {\r
        display: none;\r
      }\r
      details.plugin-group summary::before {\r
        content: "";\r
        display: block;\r
        flex-shrink: 0;\r
        width: 0;\r
        height: 0;\r
        border-top: 6px solid transparent;\r
        border-bottom: 6px solid transparent;\r
        border-left: 9px solid var(--figma-color-text, #333);\r
        opacity: 0.85;\r
        transition: transform 0.15s ease;\r
        transform-origin: 40% 50%;\r
      }\r
      details.plugin-group[open] summary::before {\r
        transform: rotate(90deg);\r
      }\r
      details.plugin-group .group-body {\r
        padding: 8px 10px 10px;\r
        border-top: 1px solid var(--figma-color-border, #ccc);\r
        display: flex;\r
        flex-direction: column;\r
        gap: 8px;\r
      }\r
      .labeled-row {\r
        display: flex;\r
        align-items: center;\r
        gap: 8px;\r
      }\r
      .labeled-row label {\r
        margin: 0;\r
        font-weight: 500;\r
        flex-shrink: 0;\r
      }\r
      .labeled-row input[type="number"] {\r
        flex: 1;\r
        min-width: 0;\r
        width: auto;\r
      }\r
      .checkbox-row {\r
        display: flex;\r
        align-items: center;\r
        gap: 8px;\r
      }\r
      .checkbox-row label {\r
        margin: 0;\r
        font-weight: 500;\r
        flex: 1;\r
      }\r
      .checkbox-row input[type="checkbox"] {\r
        flex-shrink: 0;\r
      }\r
      .radio-option {\r
        display: flex;\r
        align-items: center;\r
        gap: 8px;\r
      }\r
      .radio-option label {\r
        margin: 0;\r
        font-weight: 400;\r
        flex: 1;\r
      }\r
      .radio-option input[type="radio"] {\r
        flex-shrink: 0;\r
      }\r
      #gapSplitSection,\r
      #gapUnifiedSection {\r
        display: flex;\r
        flex-direction: column;\r
        gap: 8px;\r
      }\r
    </style>\r
  </head>\r
  <body>\r
    <div class="row">\r
      <div class="labeled-row">\r
        <label for="columns">Columns</label>\r
        <input id="columns" type="number" min="1" max="24" value="3" />\r
      </div>\r
      <div class="checkbox-row">\r
        <label for="uniformColumns">Uniform columns</label>\r
        <input id="uniformColumns" type="checkbox" />\r
      </div>\r
      <div class="checkbox-row">\r
        <label for="detectColumns">Detect columns</label>\r
        <input id="detectColumns" type="checkbox" />\r
      </div>\r
    </div>\r
    <div class="row">\r
      <div id="gapSplitSection">\r
        <div class="labeled-row">\r
          <label for="gapX">Horizontal gap</label>\r
          <input id="gapX" type="number" min="0" max="999" value="16" />\r
        </div>\r
        <div class="labeled-row">\r
          <label for="gapY">Vertical gap</label>\r
          <input id="gapY" type="number" min="0" max="999" value="16" />\r
        </div>\r
      </div>\r
      <div id="gapUnifiedSection" style="display: none">\r
        <div class="labeled-row">\r
          <label for="gapAll">Gap</label>\r
          <input id="gapAll" type="number" min="0" max="999" value="16" />\r
        </div>\r
      </div>\r
      <div class="checkbox-row">\r
        <label for="uniformGaps">Uniform gaps</label>\r
        <input id="uniformGaps" type="checkbox" />\r
      </div>\r
    </div>\r
    <div class="row">\r
      <details class="plugin-group" open>\r
        <summary>Arrange by</summary>\r
        <div class="group-body">\r
          <div class="radio-option">\r
            <label for="fillNearestWidth">Nearest width</label>\r
            <input\r
              id="fillNearestWidth"\r
              type="radio"\r
              name="columnFillMode"\r
              value="nearestWidth"\r
              checked\r
            />\r
          </div>\r
          <div class="radio-option">\r
            <label for="fillNearestColumn">Nearest column</label>\r
            <input\r
              id="fillNearestColumn"\r
              type="radio"\r
              name="columnFillMode"\r
              value="nearestColumn"\r
            />\r
          </div>\r
        </div>\r
      </details>\r
    </div>\r
    <button id="apply" type="button" disabled>Apply masonry</button>\r
    <p class="hint" id="hint">Select at least two layers with the same parent.</p>\r
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

</script>\r
  </body>\r
</html>\r
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
  function strokeOutsets(node) {
    const z = { top: 0, right: 0, bottom: 0, left: 0 };
    if (!("strokes" in node) || !("strokeAlign" in node)) {
      return z;
    }
    if (node.strokes.length === 0) {
      return z;
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
    return {
      top: topW * f,
      right: rightW * f,
      bottom: bottomW * f,
      left: leftW * f
    };
  }
  function layoutOutsets(node, uniformGaps) {
    if (uniformGaps) {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    }
    return strokeOutsets(node);
  }
  function compareTopLeft(a, b) {
    if (a.y !== b.y) {
      return a.y - b.y;
    }
    return a.x - b.x;
  }
  function fitWidthPreservingAspect(node, targetWidth) {
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
    node.rescale(scale);
  }
  function columnXStarts(left, targetW, gapX, uniformColumns, headersByCol, uniformGaps) {
    var _a;
    const cols = targetW.length;
    const xs = new Array(cols);
    const out = (i) => i < headersByCol.length ? layoutOutsets(headersByCol[i], uniformGaps) : { top: 0, right: 0, bottom: 0, left: 0 };
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
  function buildColumnStacks(nodes, colCount, gapY, columnFillMode, uniformGaps) {
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
      const o = layoutOutsets(h, uniformGaps);
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
      const o = layoutOutsets(node, uniformGaps);
      colHeights[bestCol] += o.top + node.height + o.bottom + gapY;
    }
    return { stacks, headersByCol };
  }
  function computeMasonryLayout(nodes, columns, gapX, gapY, uniformColumns, columnFillMode, uniformGaps) {
    const safeCols = Math.max(1, Math.floor(columns));
    const { left, top } = selectionBounds(nodes);
    const { stacks, headersByCol } = buildColumnStacks(
      nodes,
      safeCols,
      gapY,
      columnFillMode,
      uniformGaps
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
      uniformGaps
    );
    const placements = [];
    for (let c = 0; c < safeCols; c++) {
      let prevY = top;
      let prevH = 0;
      let prevOutBottom = 0;
      let isFirst = true;
      for (const node of stacks[c]) {
        const o = layoutOutsets(node, uniformGaps);
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
    height: 385,
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
      detectedColumns
    });
  }
  figma.on("selectionchange", pushSelectionState);
  pushSelectionState();
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
    let result;
    try {
      result = computeMasonryLayout(
        nodes,
        columns,
        gapX,
        gapY,
        Boolean(msg.uniformColumns),
        fillMode,
        Boolean(msg.uniformGaps)
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
    figma.notify("Masonry layout applied.");
  };
})();
