import { describe, expect, it } from "vitest";

import {
  getStudioTemplateRendererKeys,
  studioTemplateRendererRegistry,
} from "../../data/templates/templateRendererRegistry";
import {
  shouldDeleteElementOnKey,
  shouldUseElementClipboardOnKey,
} from "../hooks/useVisualKeyboardShortcuts";
import {
  applyInlinePatchToHtml,
  deleteSelectedTextInNode,
  hasRichMarkup,
  isInlineCapablePatch,
  pickInlineStylePatch,
  replaceSelectedTextInNode,
  sanitizeRichHtml,
} from "./richTextHtml";

describe("richTextHtml", () => {
  it("keeps only safe inline tags and styles", () => {
    const html = sanitizeRichHtml(
      '<span style="color: red; font-weight: 700" onclick="alert(1)">Hi</span><script>x()</script>',
    );
    expect(html).toContain("color: red");
    expect(html).toContain("font-weight: 700");
    expect(html).not.toContain("onclick");
    expect(html).not.toContain("script");
  });

  it("drops unsafe hrefs", () => {
    const html = sanitizeRichHtml('<a href="javascript:alert(1)">x</a>');
    expect(html).not.toContain("javascript:");
  });

  it("wraps a plain-text range with the requested style", () => {
    const html = applyInlinePatchToHtml("Your Trusted Towing", "Your Trusted Towing", {
      start: 5,
      end: 12,
    }, {
      "font-weight": "700",
      fontWeight: "700",
    });
    expect(hasRichMarkup(html)).toBe(true);
    expect(html).toContain("Trusted");
    expect(html).toContain("font-weight: 700");
  });

  it("deletes only the selected part of a sentence", () => {
    const node = document.createElement("p");
    node.setAttribute("data-visual-edit-id", "heroSubtitle");
    node.setAttribute("data-visual-edit-type", "text");
    node.textContent = "שלום עולם יפה";
    document.body.appendChild(node);

    const text = node.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, 5);
    range.setEnd(text, 9);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    const result = deleteSelectedTextInNode(node);

    expect(result?.text.replace(/\s+/g, " ").trim()).toBe("שלום יפה");
    expect(result?.text).toContain("שלום");
    expect(result?.text).toContain("יפה");
    expect(result?.text).not.toContain("עולם");
    expect(node.textContent).not.toContain("עולם");
    expect(node.textContent).toContain("שלום");
    expect(node.textContent).toContain("יפה");

    document.body.removeChild(node);
  });

  it("replaces only the selected part of a sentence", () => {
    const node = document.createElement("p");
    node.setAttribute("data-visual-edit-id", "heroSubtitle");
    node.setAttribute("data-visual-edit-type", "text");
    node.textContent = "שלום עולם יפה";
    document.body.appendChild(node);

    const text = node.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, 5);
    range.setEnd(text, 9);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    const result = replaceSelectedTextInNode(node, "בית");

    expect(result?.text.replace(/\s+/g, " ").trim()).toBe("שלום בית יפה");
    expect(node.textContent).toContain("שלום");
    expect(node.textContent).toContain("בית");
    expect(node.textContent).toContain("יפה");
    expect(node.textContent).not.toContain("עולם");

    document.body.removeChild(node);
  });

  it("treats alignment as element-only", () => {
    expect(isInlineCapablePatch({ "text-align": "center" })).toBe(false);
    expect(isInlineCapablePatch({ "font-weight": "700" })).toBe(true);
    expect(pickInlineStylePatch({ "text-align": "center", color: "#111" })).toEqual({
      color: "#111",
    });
  });
});

describe("shouldDeleteElementOnKey", () => {
  it("does not delete the element while a text range is selected", () => {
    expect(
      shouldDeleteElementOnKey({
        selectedElementId: "heroTitle",
        hasTextSelection: true,
      }),
    ).toBe(false);
  });

  it("does not delete the element while typing or inline-editing", () => {
    expect(
      shouldDeleteElementOnKey({
        selectedElementId: "heroTitle",
        isTyping: true,
      }),
    ).toBe(false);
  });

  it("deletes the element when no text range is selected", () => {
    expect(
      shouldDeleteElementOnKey({
        selectedElementId: "heroTitle",
      }),
    ).toBe(true);
  });

  it("does not copy or paste the whole element while a text range is selected", () => {
    expect(
      shouldUseElementClipboardOnKey({
        selectedElementId: "heroTitle",
        hasTextSelection: true,
      }),
    ).toBe(false);
  });
});

describe("template text range audit", () => {
  it("keeps every registered studio template on the shared visual editor", () => {
    const keys = getStudioTemplateRendererKeys();
    expect(keys.length).toBeGreaterThan(80);

    const grapesKeys = keys.filter(
      (key) =>
        studioTemplateRendererRegistry[key]?.editorMode !== "visual-react",
    );

    expect(grapesKeys).toEqual([]);
  });

  it.each([
    ["h1", "text"],
    ["p", "text"],
    ["span", "text"],
    ["div", "text"],
    ["button", "button"],
    ["a", "link"],
    ["li", "text"],
  ] as const)("deletes only the selected word in %s", (tag, type) => {
    const node = document.createElement(tag);
    node.setAttribute("data-visual-edit-id", `sample.${tag}`);
    node.setAttribute("data-visual-edit-type", type);
    node.textContent = "שלום עולם יפה";
    document.body.appendChild(node);

    const text = node.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, 5);
    range.setEnd(text, 9);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    const result = deleteSelectedTextInNode(node);
    expect(result?.text.replace(/\s+/g, " ").trim()).toBe("שלום יפה");
    expect(node.textContent).not.toContain("עולם");
    document.body.removeChild(node);
  });

  it("does not flatten a parent section when a nested heading is selected", () => {
    const section = document.createElement("section");
    section.setAttribute("data-visual-edit-id", "home.hero");
    section.setAttribute("data-visual-edit-type", "section");
    const heading = document.createElement("h1");
    heading.setAttribute("data-visual-edit-id", "heroTitle");
    heading.setAttribute("data-visual-edit-type", "text");
    heading.textContent = "שלום עולם יפה";
    section.appendChild(heading);
    document.body.appendChild(section);

    const text = heading.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, 5);
    range.setEnd(text, 9);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    const result = deleteSelectedTextInNode(section);
    expect(result?.node).toBe(heading);
    expect(section.querySelector("h1")).toBe(heading);
    expect(heading.textContent).not.toContain("עולם");
    expect(heading.textContent).toContain("שלום");
    document.body.removeChild(section);
  });
});
