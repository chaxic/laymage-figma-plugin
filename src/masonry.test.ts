import { describe, expect, it } from "vitest";

import {
  detectTopRowColumnCount,
  getSharedParent,
  hasLayout,
  selectionBounds,
} from "./masonry";

function n(x: number, y: number, width: number, height: number, parent?: unknown) {
  return { x, y, width, height, parent } as any;
}

describe("masonry helpers", () => {
  describe("hasLayout()", () => {
    it("returns true when x/y/width/height exist", () => {
      expect(hasLayout({ x: 0, y: 0, width: 10, height: 20 } as any)).toBe(true);
    });

    it("returns false when any field is missing", () => {
      expect(hasLayout({ x: 0, y: 0, width: 10 } as any)).toBe(false);
    });
  });

  describe("getSharedParent()", () => {
    it("returns null for empty input", () => {
      expect(getSharedParent([])).toBeNull();
    });

    it("returns null when parents differ", () => {
      const p1 = { children: [] };
      const p2 = { children: [] };
      expect(getSharedParent([{ parent: p1 } as any, { parent: p2 } as any])).toBeNull();
    });

    it("returns the shared parent when all nodes share it", () => {
      const p = { children: [] };
      expect(getSharedParent([{ parent: p } as any, { parent: p } as any])).toBe(p);
    });

    it("returns null when the parent has no children property", () => {
      const p = {};
      expect(getSharedParent([{ parent: p } as any, { parent: p } as any])).toBeNull();
    });
  });

  describe("selectionBounds()", () => {
    it("computes bounds for a selection", () => {
      const a = n(10, 20, 50, 40);
      const b = n(0, 30, 10, 5);
      expect(selectionBounds([a, b] as any)).toEqual({
        left: 0,
        top: 20,
        width: 60,
        height: 40,
      });
    });

    it("returns zero width/height for inverted infinities (defensive)", () => {
      expect(selectionBounds([] as any)).toEqual({
        left: Infinity,
        top: Infinity,
        width: 0,
        height: 0,
      });
    });
  });

  describe("detectTopRowColumnCount()", () => {
    it("returns null for empty input", () => {
      expect(detectTopRowColumnCount([] as any)).toBeNull();
    });

    it("returns 1 for single node", () => {
      expect(detectTopRowColumnCount([n(0, 0, 10, 10)] as any)).toBe(1);
    });

    it("counts nodes on the top row within tolerance", () => {
      const nodes = [
        n(0, 100, 10, 10),
        n(50, 100.5, 10, 10), // within 1px tolerance
        n(100, 101, 10, 10), // within 1px tolerance
        n(0, 120, 10, 10),
      ];
      expect(detectTopRowColumnCount(nodes as any)).toBe(3);
    });

    it("returns 1 when only one node is on the top row", () => {
      const nodes = [n(0, 0, 10, 10), n(0, 10, 10, 10)];
      expect(detectTopRowColumnCount(nodes as any)).toBe(1);
    });

    it("caps the count at 24", () => {
      const nodes = Array.from({ length: 30 }, (_, i) => n(i * 10, 0, 10, 10));
      expect(detectTopRowColumnCount(nodes as any)).toBe(24);
    });
  });
});

