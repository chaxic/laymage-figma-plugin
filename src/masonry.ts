/** Nodes that support x/y/width/height in parent space. */
export function hasLayout(
  node: SceneNode
): node is SceneNode & LayoutMixin {
  return "width" in node && "height" in node && "x" in node && "y" in node;
}

export function getSharedParent(
  nodes: readonly SceneNode[]
): (BaseNode & ChildrenMixin) | null {
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

export function selectionBounds(
  nodes: readonly (SceneNode & LayoutMixin)[]
): { left: number; top: number; width: number; height: number } {
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
    height: Math.max(0, bottom - top),
  };
}

export type MasonryPlacement = { node: SceneNode & LayoutMixin; x: number; y: number };

export type MasonryResult =
  | { ok: true; placements: MasonryPlacement[] }
  | { ok: false; reason: string };

/** How non-header layers pick a column (slider: nearest width ↔ nearest column). */
export type ColumnFillMode = "nearestWidth" | "nearestColumn";

const MIN_SIZE = 0.01;

/** Top edges within this many px of the minimum y count as one horizontal row. */
const TOP_ROW_Y_TOLERANCE = 1;

/**
 * Counts layers on the top row (same top y within tolerance).
 * If at least two share that row, returns that count (capped at 24).
 * Otherwise returns 1. Empty input returns null.
 */
export function detectTopRowColumnCount(
  nodes: readonly (SceneNode & LayoutMixin)[]
): number | null {
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

/**
 * Outside/Center stroke extends past layout width/height; inside does not.
 * Used so gapX/gapY measure visual space between stroke edges.
 */
function strokeOutsets(node: SceneNode & LayoutMixin): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
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

  let topW: number;
  let rightW: number;
  let bottomW: number;
  let leftW: number;
  if (
    "strokeTopWeight" in node &&
    typeof (node as IndividualStrokesMixin).strokeTopWeight === "number"
  ) {
    const s = node as IndividualStrokesMixin;
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
    left: leftW * f,
  };
}

/** When true, gapX/gapY are between layout edges only (ignore border/stroke outsets). */
function layoutOutsets(
  node: SceneNode & LayoutMixin,
  uniformGaps: boolean
): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  if (uniformGaps) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  return strokeOutsets(node);
}

function compareTopLeft(
  a: SceneNode & LayoutMixin,
  b: SceneNode & LayoutMixin
): number {
  if (a.y !== b.y) {
    return a.y - b.y;
  }
  return a.x - b.x;
}

/**
 * Scale width to target while preserving aspect ratio.
 * Uses rescale() so groups and their contents scale together (like the Scale tool).
 */
function fitWidthPreservingAspect(
  node: SceneNode & LayoutMixin,
  targetWidth: number
): void {
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

function columnXStarts(
  left: number,
  targetW: readonly number[],
  gapX: number,
  uniformColumns: boolean,
  headersByCol: readonly (SceneNode & LayoutMixin)[],
  uniformGaps: boolean
): number[] {
  const cols = targetW.length;
  const xs = new Array<number>(cols);
  const out = (i: number) =>
    i < headersByCol.length
      ? layoutOutsets(headersByCol[i], uniformGaps)
      : { top: 0, right: 0, bottom: 0, left: 0 };

  xs[0] = left;
  if (uniformColumns) {
    const w = targetW[0] ?? 0;
    for (let c = 1; c < cols; c++) {
      xs[c] =
        xs[c - 1] +
        w +
        out(c - 1).right +
        gapX +
        out(c).left;
    }
    return xs;
  }
  for (let c = 1; c < cols; c++) {
    const wPrev = targetW[c - 1];
    if (wPrev < MIN_SIZE) {
      xs[c] = xs[c - 1];
      continue;
    }
    xs[c] =
      xs[c - 1] +
      wPrev +
      out(c - 1).right +
      gapX +
      out(c).left;
  }
  return xs;
}

/**
 * Headers: the N globally top-left items (min y, then min x), N = min(columns, count).
 * Column index: those N headers sorted left to right (min x).
 * Remaining items: nearest header width, or nearest column (horizontal distance to header center).
 */
function buildColumnStacks(
  nodes: readonly (SceneNode & LayoutMixin)[],
  colCount: number,
  gapY: number,
  columnFillMode: ColumnFillMode,
  uniformGaps: boolean
): {
  stacks: (SceneNode & LayoutMixin)[][];
  headersByCol: (SceneNode & LayoutMixin)[];
} {
  const sorted = [...nodes].sort(compareTopLeft);
  const headerCount = Math.min(colCount, nodes.length);
  const rawHeaders = sorted.slice(0, headerCount);
  const headersByCol = [...rawHeaders].sort((a, b) => a.x - b.x);
  const headerSet = new Set<SceneNode>(headersByCol);

  const refW = new Array<number>(colCount).fill(0);
  for (let c = 0; c < headersByCol.length; c++) {
    refW[c] = headersByCol[c].width;
  }

  const stacks: (SceneNode & LayoutMixin)[][] = Array.from({ length: colCount }, () => []);
  const colHeights = new Array<number>(colCount).fill(0);

  for (let c = 0; c < headersByCol.length; c++) {
    const h = headersByCol[c];
    stacks[c].push(h);
    const o = layoutOutsets(h, uniformGaps);
    colHeights[c] = h.height + o.bottom + gapY;
  }

  const remaining = nodes.filter((n) => !headerSet.has(n));
  const remainingSorted = [...remaining].sort(compareTopLeft);

  function pickShortestColumn(): number {
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
        if (
          d < bestDist ||
          (d === bestDist && h < bestH) ||
          (d === bestDist && h === bestH && j < bestCol)
        ) {
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
        if (
          d < bestDist ||
          (d === bestDist && h < bestH) ||
          (d === bestDist && h === bestH && j < bestCol)
        ) {
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

/**
 * Headers = N top-most in (y then x) order; columns = those headers sorted by x.
 * Other layers: nearest header width or nearest column (horizontal), per columnFillMode.
 */
export function computeMasonryLayout(
  nodes: readonly (SceneNode & LayoutMixin)[],
  columns: number,
  gapX: number,
  gapY: number,
  uniformColumns: boolean,
  columnFillMode: ColumnFillMode,
  uniformGaps: boolean
): MasonryResult {
  const safeCols = Math.max(1, Math.floor(columns));
  const { left, top } = selectionBounds(nodes);

  const { stacks, headersByCol } = buildColumnStacks(
    nodes,
    safeCols,
    gapY,
    columnFillMode,
    uniformGaps
  );

  const refW = new Array<number>(safeCols).fill(0);
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
      reason: "Could not read a valid width from the column headers.",
    };
  }

  const targetW = new Array<number>(safeCols);
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
  const placements: MasonryPlacement[] = [];

  for (let c = 0; c < safeCols; c++) {
    let prevY = top;
    let prevH = 0;
    let prevOutBottom = 0;
    let isFirst = true;
    for (const node of stacks[c]) {
      const o = layoutOutsets(node, uniformGaps);
      const y = isFirst
        ? top
        : prevY + prevH + prevOutBottom + gapY + o.top;
      placements.push({ node, x: colXs[c], y });
      isFirst = false;
      prevY = y;
      prevH = node.height;
      prevOutBottom = o.bottom;
    }
  }

  return { ok: true, placements };
}
