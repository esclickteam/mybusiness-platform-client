import { describe, expect, it } from "vitest";
import {
  resolveToolbarAddStep,
  shouldIgnoreCanvasPickerClose,
} from "./toolbarAddStep";

describe("resolveToolbarAddStep", () => {
  it("opens the general picker when nothing is selected", () => {
    expect(resolveToolbarAddStep(null)).toEqual({
      afterNodeId: null,
      mode: "all",
      replaceInspector: true,
    });
  });

  it("adds the next step after the selected node", () => {
    expect(resolveToolbarAddStep("node_trigger_1")).toEqual({
      afterNodeId: "node_trigger_1",
      mode: "all",
      replaceInspector: true,
    });
  });
});

describe("shouldIgnoreCanvasPickerClose", () => {
  it("holds the picker open across the ReactFlow selection race", () => {
    expect(
      shouldIgnoreCanvasPickerClose({
        holdPickerOpen: true,
        closingDrawer: false,
      })
    ).toBe(true);
    expect(
      shouldIgnoreCanvasPickerClose({
        holdPickerOpen: false,
        closingDrawer: true,
      })
    ).toBe(true);
    expect(
      shouldIgnoreCanvasPickerClose({
        holdPickerOpen: false,
        closingDrawer: false,
      })
    ).toBe(false);
  });
});
