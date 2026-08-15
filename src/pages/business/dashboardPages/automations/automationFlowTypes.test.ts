import { describe, expect, it } from "vitest";
import { PALETTE, clampRouteCount, ensureRouterPaths } from "./automationFlowTypes";

describe("new router defaults", () => {
  it("defaults newly created router nodes to 1 result", () => {
    const router = PALETTE.find((item) => item.key === "router");
    expect(router?.defaults?.pathCount).toBe(1);
    expect(Array.isArray(router?.defaults?.paths)).toBe(true);
    expect((router?.defaults?.paths as unknown[]).length).toBe(1);
  });

  it("does not coerce an existing saved pathCount of 2 up or down", () => {
    const preserved = ensureRouterPaths({
      pathCount: 2,
      paths: [
        { id: "path_1", label: "תוצאה 1" },
        { id: "path_2", label: "תוצאה 2" },
      ],
    });
    expect(preserved.pathCount).toBe(2);
    expect(preserved.paths).toHaveLength(2);
  });

  it("allows a single path and keeps the existing 1–6 clamp", () => {
    expect(ensureRouterPaths({ pathCount: 1 }).pathCount).toBe(1);
    expect(ensureRouterPaths({}).pathCount).toBe(1);
    expect(clampRouteCount(1, 1)).toBe(1);
    expect(clampRouteCount(2, 1)).toBe(2);
    expect(clampRouteCount(0, 1)).toBe(1);
    expect(clampRouteCount(9, 1)).toBe(6);
  });
});
