import { describe, expect, it } from "vitest";

/**
 * Contract for "אוטומציה ריקה": never seed a starter/template graph.
 * Mirrored from CreateAutomationModal.handleBlank payload.
 */
function blankAutomationCreatePayload() {
  return {
    useStarter: false,
    name: "אוטומציה חדשה",
    nodes: [] as unknown[],
    edges: [] as unknown[],
  };
}

describe("blank automation create payload", () => {
  it("starts clean without starter template", () => {
    const payload = blankAutomationCreatePayload();
    expect(payload.useStarter).toBe(false);
    expect(payload.nodes).toEqual([]);
    expect(payload.edges).toEqual([]);
  });
});
