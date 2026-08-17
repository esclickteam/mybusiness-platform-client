import { describe, expect, it } from "vitest";

import {
  applySharedTextFormat,
  inferTextStyleId,
  isTextSettingsElement,
} from "./textFormatCommands";

describe("textFormatCommands", () => {
  it("infers heading presets from tag and size", () => {
    expect(inferTextStyleId("h1", "16px")).toBe("h1");
    expect(inferTextStyleId("section", "72px")).toBe("h1");
    expect(inferTextStyleId("section", "16px")).toBe("paragraph");
  });

  it("opens Text Settings only for text-like elements", () => {
    expect(isTextSettingsElement({ type: "text" })).toBe(true);
    expect(isTextSettingsElement({ type: "image" })).toBe(false);
    expect(isTextSettingsElement({ type: "section" })).toBe(false);
    const heading = document.createElement("h1");
    const link = document.createElement("a");
    link.setAttribute("data-visual-element-link", "true");
    heading.appendChild(link);
    expect(isTextSettingsElement({ type: "link", node: link })).toBe(true);
  });

  it("formats the whole element when no text range is selected", () => {
    const applied: Array<Record<string, unknown>> = [];
    const result = applySharedTextFormat({
      elementId: "hero-title",
      patch: { "font-weight": "700", fontWeight: "700" },
      node: null,
      applyElementStyle: (_id, patch) => {
        applied.push(patch as Record<string, unknown>);
        return true;
      },
      persistRichText: () => false,
    });

    expect(result.mode).toBe("element");
    expect(applied[0]?.fontWeight).toBe("700");
  });
});
