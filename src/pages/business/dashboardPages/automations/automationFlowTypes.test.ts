import { describe, expect, it } from "vitest";
import {
  PALETTE,
  buildTriggerPaletteItems,
  clampRouteCount,
  ensureRouterPaths,
} from "./automationFlowTypes";

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
        { id: "path_1", label: "a" },
        { id: "path_2", label: "b" },
      ],
    });
    expect(preserved.pathCount).toBe(2);
    expect(preserved.paths).toHaveLength(2);
  });

  it("allows a single path and keeps the existing 1-6 clamp", () => {
    expect(ensureRouterPaths({ pathCount: 1 }).pathCount).toBe(1);
    expect(ensureRouterPaths({}).pathCount).toBe(1);
    expect(clampRouteCount(1, 1)).toBe(1);
    expect(clampRouteCount(2, 1)).toBe(2);
    expect(clampRouteCount(0, 1)).toBe(1);
    expect(clampRouteCount(9, 1)).toBe(6);
  });
});

describe("new trigger routeCount", () => {
  it("writes routeCount 1 onto newly created catalog trigger node data", () => {
    const items = buildTriggerPaletteItems([
      {
        key: "new_lead",
        label: "lead",
        description: "",
        category: "crm",
        isSupported: true,
        isPublishable: true,
        keywords: [],
        billingNote: "",
        triggerBillable: false,
      },
    ]);
    expect(items).toHaveLength(1);
    expect(items[0].defaults.routeCount).toBe(1);
    const nodeData = { ...items[0].defaults };
    expect(nodeData.routeCount).toBe(1);
  });

  it("preserves an explicit saved routeCount of 2", () => {
    expect(clampRouteCount(2, 1)).toBe(2);
  });
});
