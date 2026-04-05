import uiHtml from "./ui.html";
import {
  type ColumnFillMode,
  computeMasonryLayout,
  detectTopRowColumnCount,
  getSharedParent,
  hasLayout,
} from "./masonry";

figma.showUI(uiHtml, {
  width: 280,
  height: 385,
  themeColors: true,
});

function pushSelectionState() {
  const raw = figma.currentPage.selection;
  const forDetect: (SceneNode & LayoutMixin)[] = [];
  for (const n of raw) {
    if (!n.locked && hasLayout(n)) {
      forDetect.push(n);
    }
  }
  const detectedColumns =
    forDetect.length >= 1 ? detectTopRowColumnCount(forDetect) : null;
  figma.ui.postMessage({
    type: "selection",
    count: raw.length,
    detectedColumns,
  });
}

figma.on("selectionchange", pushSelectionState);
pushSelectionState();

type ApplyMessage = {
  type: "apply";
  columns: number;
  gapX: number;
  gapY: number;
  uniformColumns: boolean;
  uniformGaps: boolean;
  columnFillMode: ColumnFillMode;
  detectColumns: boolean;
};

type RequestSyncMessage = { type: "requestSelectionSync" };

figma.ui.onmessage = (msg: ApplyMessage | RequestSyncMessage) => {
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

  const nodes: (SceneNode & LayoutMixin)[] = [];
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
    columns = detectTopRowColumnCount(nodes) ?? columns;
  }

  const gapX = Math.max(0, Math.min(999, Number(msg.gapX) || 0));
  const gapY = Math.max(0, Math.min(999, Number(msg.gapY) || 0));

  const fillMode: ColumnFillMode =
    msg.columnFillMode === "nearestColumn" ? "nearestColumn" : "nearestWidth";

  let result: ReturnType<typeof computeMasonryLayout>;
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
