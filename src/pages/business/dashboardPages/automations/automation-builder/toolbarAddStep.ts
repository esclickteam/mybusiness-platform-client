export type ToolbarAddStepIntent = {
  afterNodeId: string | null;
  mode: "all";
  replaceInspector: true;
};

/**
 * Top-toolbar "הוסף שלב" must always open the picker.
 * If a node is selected, the next step is inserted after it.
 * Any open config drawer is replaced — never ignored.
 */
export function resolveToolbarAddStep(
  selectedId: string | null
): ToolbarAddStepIntent {
  return {
    afterNodeId: selectedId,
    mode: "all",
    replaceInspector: true,
  };
}

export function shouldIgnoreCanvasPickerClose(opts: {
  holdPickerOpen: boolean;
  closingDrawer: boolean;
}): boolean {
  return opts.holdPickerOpen || opts.closingDrawer;
}
