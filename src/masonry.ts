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
 * FigJam `MEDIA` nodes do not expose stroke fields in the plugin API, but they can still
 * show an outline in the editor. Pasting into Figma Design often yields stroke weight 8,
 * so we use that as a layout-only approximation for gap spacing when the user enables
 * “FigJam Video Outline Fix”.
 */
const FIGJAM_MEDIA_DEFAULT_OUTLINE_STROKE_PX = 8;

function getEditorType():
  | "figma"
  | "figjam"
  | "dev"
  | "slides"
  | "buzz" {
  const f = (globalThis as unknown as { figma?: { editorType?: string } }).figma;
  const t = f?.editorType;
  if (t === "figjam" || t === "figma" || t === "dev" || t === "slides" || t === "buzz") {
    return t;
  }
  return "figma";
}

/** Filename hints for FigJam video media when the API does not expose MIME type. */
const VIDEO_FILENAME_EXT = /\.(mp4|mov|webm|mkv|m4v|avi)/i;

/**
 * FigJam `MediaData` only exposes a hash. Video items often have no `getImageByHash` entry
 * (no raster preview), while images typically do. We also treat obvious video filenames as video.
 */
export function isFigJamVideoMediaFile(node: SceneNode): boolean {
  if (getEditorType() !== "figjam") {
    return false;
  }
  if ((node as { type?: string }).type !== "MEDIA") {
    return false;
  }
  if (!hasLayout(node)) {
    return false;
  }
  if ("name" in node && typeof (node as { name?: string }).name === "string") {
    if (VIDEO_FILENAME_EXT.test((node as { name: string }).name)) {
      return true;
    }
  }
  const md = (node as { mediaData?: { hash?: string } }).mediaData;
  if (!md || typeof md.hash !== "string") {
    return false;
  }
  const fig = (globalThis as unknown as { figma?: { getImageByHash?: (h: string) => unknown } })
    .figma;
  const get = fig?.getImageByHash;
  if (typeof get !== "function") {
    return false;
  }
  try {
    return get.call(fig, md.hash) == null;
  } catch {
    return false;
  }
}

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
function strokeOutsets(
  node: SceneNode & LayoutMixin,
  videoOutlineFix: boolean
): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  const z = { top: 0, right: 0, bottom: 0, left: 0 };
  // FigJam video media: no stroke API; optional 8px outline approximation for gap math.
  if (videoOutlineFix && isFigJamVideoMediaFile(node)) {
    const w = FIGJAM_MEDIA_DEFAULT_OUTLINE_STROKE_PX;
    return { top: w, right: w, bottom: w, left: w };
  }
  if (!("strokes" in node) || !("strokeAlign" in node)) {
    return z;
  }
  // If strokes are hidden/disabled, ignore them in spacing.
  // Note: typings can vary (sometimes `strokes` can be mixed). We handle unknown types safely.
  const strokes = (node as unknown as { strokes: unknown }).strokes;
  if (Array.isArray(strokes)) {
    if (strokes.length === 0) {
      return z;
    }
    const anyVisible = (strokes as readonly Paint[]).some((p) => {
      const paint = p as Paint & { visible?: boolean; opacity?: number };
      if (paint.visible === false) return false;
      if (typeof paint.opacity === "number" && paint.opacity <= 0) return false;
      return true;
    });
    if (!anyVisible) {
      return z;
    }
  }
  // If strokes are mixed/unknown, conservatively assume they may be visible.
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

  if (topW <= 0 && rightW <= 0 && bottomW <= 0 && leftW <= 0) {
    return z;
  }

  return {
    top: topW * f,
    right: rightW * f,
    bottom: bottomW * f,
    left: leftW * f,
  };
}

/** Stroke outsets used so gaps measure visual space between stroke edges. */
function layoutOutsets(
  node: SceneNode & LayoutMixin,
  videoOutlineFix: boolean
): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  return strokeOutsets(node, videoOutlineFix);
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
  function readStrokeWeights(
    n: SceneNode & LayoutMixin
  ):
    | { kind: "none" }
    | { kind: "uniform"; weight: number }
    | { kind: "individual"; top: number; right: number; bottom: number; left: number } {
    if (!("strokes" in n) || !("strokeAlign" in n)) {
      return { kind: "none" };
    }
    if (n.strokes.length === 0) {
      return { kind: "none" };
    }
    if (
      "strokeTopWeight" in n &&
      typeof (n as IndividualStrokesMixin).strokeTopWeight === "number"
    ) {
      const s = n as IndividualStrokesMixin;
      return {
        kind: "individual",
        top: s.strokeTopWeight,
        right: s.strokeRightWeight,
        bottom: s.strokeBottomWeight,
        left: s.strokeLeftWeight,
      };
    }
    if ("strokeWeight" in n) {
      const w = (n as GeometryMixin).strokeWeight;
      if (typeof w === "number" && Number.isFinite(w)) {
        return { kind: "uniform", weight: w };
      }
    }
    return { kind: "none" };
  }

  function restoreStrokeWeights(
    n: SceneNode & LayoutMixin,
    state:
      | { kind: "none" }
      | { kind: "uniform"; weight: number }
      | { kind: "individual"; top: number; right: number; bottom: number; left: number }
  ): void {
    if (state.kind === "none") return;
    if (!("strokes" in n) || !("strokeAlign" in n)) return;
    if (n.strokes.length === 0) return;
    if (state.kind === "individual") {
      if ("strokeTopWeight" in n && typeof (n as IndividualStrokesMixin).strokeTopWeight === "number") {
        const s = n as IndividualStrokesMixin;
        s.strokeTopWeight = state.top;
        s.strokeRightWeight = state.right;
        s.strokeBottomWeight = state.bottom;
        s.strokeLeftWeight = state.left;
      }
      return;
    }
    if ("strokeWeight" in n) {
      const w = (n as GeometryMixin).strokeWeight;
      if (typeof w === "number") {
        (n as GeometryMixin).strokeWeight = state.weight;
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

  // FigJam `MEDIA` nodes do not implement `rescale()`; reading the property can throw.
  let rescaleFn: unknown;
  try {
    rescaleFn = (node as unknown as { rescale?: unknown }).rescale;
  } catch {
    rescaleFn = undefined;
  }
  if (typeof rescaleFn === "function") {
    try {
      (rescaleFn as (s: number) => void).call(node, scale);
      restoreStrokeWeights(node, strokeState);
      return;
    } catch {
      // fall through to resize-based scaling
    }
  }

  const h = node.height;
  const newW = Math.max(MIN_SIZE, targetWidth);
  const newH = Math.max(MIN_SIZE, h * scale);
  node.resize(newW, newH);
}

function columnXStarts(
  left: number,
  targetW: readonly number[],
  gapX: number,
  uniformColumns: boolean,
  headersByCol: readonly (SceneNode & LayoutMixin)[],
  videoOutlineFix: boolean
): number[] {
  const cols = targetW.length;
  const xs = new Array<number>(cols);
  const out = (i: number) =>
    i < headersByCol.length
      ? layoutOutsets(headersByCol[i], videoOutlineFix)
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
  videoOutlineFix: boolean
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
    const o = layoutOutsets(h, videoOutlineFix);
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
    const o = layoutOutsets(node, videoOutlineFix);
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
  uniformGaps: boolean,
  lockBounds: boolean = false,
  videoOutlineFix: boolean = false
): MasonryResult {
  const safeCols = Math.max(1, Math.floor(columns));
  const { left, top, width: boundsWidth } = selectionBounds(nodes);

  const { stacks, headersByCol } = buildColumnStacks(
    nodes,
    safeCols,
    gapY,
    columnFillMode,
    videoOutlineFix
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

  if (lockBounds && safeCols >= 1) {
    const out = (i: number) =>
      i < headersByCol.length
        ? layoutOutsets(headersByCol[i], videoOutlineFix)
        : { top: 0, right: 0, bottom: 0, left: 0 };

    let fixedSpacing = 0;
    for (let c = 1; c < safeCols; c++) {
      fixedSpacing += out(c - 1).right + gapX + out(c).left;
    }

    let sumWidths = 0;
    if (uniformColumns) {
      sumWidths = (targetW[0] ?? 0) * safeCols;
    } else {
      for (let c = 0; c < safeCols; c++) sumWidths += targetW[c] ?? 0;
    }

    const available = boundsWidth - fixedSpacing;
    if (available < MIN_SIZE * safeCols || sumWidths < MIN_SIZE) {
      return {
        ok: false,
        reason:
          "Lock bounds failed: selection is too narrow for the current columns/gap settings.",
      };
    }

    const scale = available / sumWidths;
    if (!Number.isFinite(scale) || scale < MIN_SIZE) {
      return {
        ok: false,
        reason:
          "Lock bounds failed: invalid scaling factor for current selection bounds.",
      };
    }

    for (let c = 0; c < safeCols; c++) {
      targetW[c] = Math.max(MIN_SIZE, (targetW[c] ?? 0) * scale);
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
  const placements: MasonryPlacement[] = [];

  for (let c = 0; c < safeCols; c++) {
    let prevY = top;
    let prevH = 0;
    let prevOutBottom = 0;
    let isFirst = true;
    for (const node of stacks[c]) {
      const o = layoutOutsets(node, videoOutlineFix);
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
