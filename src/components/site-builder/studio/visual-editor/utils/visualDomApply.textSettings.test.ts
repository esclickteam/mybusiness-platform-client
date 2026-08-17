import { describe, expect, it } from "vitest";

import {
  applyVisualContentToDom,
  applyVisualStylesToDom,
} from "./visualDomApply";
import { applySharedTextFormat } from "./textFormatCommands";
import { snapshotTextRange } from "./richTextHtml";
import { persistVisualTextFields } from "./visualData";
import { resolvePersistedVisualId } from "./visualPersistId";

describe("visual text persistence", () => {
  it("applies persisted typography onto the matching text node", () => {
    const root = document.createElement("div");
    const heading = document.createElement("h1");
    heading.setAttribute("data-visual-edit-id", "heroTitle");
    heading.textContent = "Hello";
    heading.style.fontSize = "128px";
    root.appendChild(heading);

    applyVisualStylesToDom(root, {
      __styles: {
        heroTitle: {
          "font-size": "42px",
          color: "#e11d48",
          "text-align": "center",
          "background-color": "#fff59d",
        },
      },
    });

    expect(heading.style.fontSize).toBe("42px");
    expect(heading.style.color).toBe("rgb(225, 29, 72)");
    expect(heading.style.textAlign).toBe("center");
    expect(heading.style.backgroundColor).toBe("rgb(255, 245, 157)");
  });

  it("wraps a whole text element in a usable link", () => {
    const root = document.createElement("div");
    const heading = document.createElement("h1");
    heading.setAttribute("data-visual-edit-id", "heroTitle");
    heading.textContent = "Hello";
    root.appendChild(heading);

    applyVisualContentToDom(root, {
      __content: {
        heroTitle: {
          text: "Hello",
          href: "https://example.com/ts-e2e",
          target: "_blank",
        },
      },
    });

    const link = heading.querySelector("a");
    expect(link).toBeTruthy();
    expect(link?.getAttribute("href")).toBe("https://example.com/ts-e2e");
    expect(link?.textContent).toBe("Hello");
  });

  it("wraps only the selected range in an inline link", () => {
    const node = document.createElement("p");
    node.textContent = "שלום עולם יפה";
    document.body.appendChild(node);
    const text = node.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, 5);
    range.setEnd(text, 9);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    let html = "";
    const result = applySharedTextFormat({
      elementId: "heroTitle",
      patch: { href: "https://example.com/inline" },
      node,
      applyElementStyle: () => false,
      persistRichText: (_id, _text, nextHtml) => {
        html = nextHtml;
        return true;
      },
    });

    expect(result.mode).toBe("inline");
    expect(html).toContain("עולם");
    expect(html).toContain("https://example.com/inline");
    expect(html).not.toMatch(/<a[^>]*>שלום/);
    expect(html).not.toMatch(/<a[^>]*>יפה/);
    document.body.removeChild(node);
  });

  it("keeps a snapshotted inline range after the live selection collapses", () => {
    const node = document.createElement("p");
    node.textContent = "שלום עולם יפה";
    document.body.appendChild(node);
    const text = node.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, 5);
    range.setEnd(text, 9);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    snapshotTextRange(node, "heroSubtitle");
    selection?.removeAllRanges();

    let html = "";
    const result = applySharedTextFormat({
      elementId: "heroSubtitle",
      patch: { "font-style": "italic", fontStyle: "italic" },
      node,
      applyElementStyle: () => false,
      persistRichText: (_id, _text, nextHtml) => {
        html = nextHtml;
        return true;
      },
    });

    expect(result.mode).toBe("inline");
    expect(html).toMatch(/italic|font-style/i);
    expect(html).toContain("עולם");
    expect(html).not.toMatch(/<(em|i|span)[^>]*>שלום/);
    expect(html).not.toMatch(/<(em|i|span)[^>]*>יפה/);
    document.body.removeChild(node);
  });

  it("persists rich html onto the matching scalar field, not the paint wrapper", () => {
    const root = document.createElement("div");
    const paragraph = document.createElement("p");
    paragraph.setAttribute("data-visual-edit-id", "heroSubtitle");
    const paint = document.createElement("span");
    paint.setAttribute("data-visual-rich-paint", "true");
    paint.setAttribute("data-visual-auto-id", "true");
    paint.setAttribute("data-visual-edit-id", "page.hero.text.span.p-1.span-1");
    paint.innerHTML =
      'שלום <a data-visual-inline-mark="true" href="https://example.com/inline"><em>עולם</em></a> יפה';
    paragraph.appendChild(paint);
    root.appendChild(paragraph);

    expect(resolvePersistedVisualId(paint)).toBe("heroSubtitle");

    const next = persistVisualTextFields(
      {
        heroSubtitle: "שלום עולם יפה",
      },
      "page.hero.text.span.p-1.span-1",
      {
        text: "שלום עולם יפה",
        html: 'שלום <a href="https://example.com/inline"><em>עולם</em></a> יפה',
      },
      "שלום עולם יפה",
    );

    expect(next.__content.heroSubtitle.html).toContain("עולם");
    expect(next.__content.heroSubtitle.html).toContain("https://example.com/inline");
    expect(next.__content.heroSubtitle.html).not.toMatch(/<a[^>]*>שלום/);
  });

  it("rehydrates inline html onto the stable text node after remount", () => {
    const root = document.createElement("div");
    const paragraph = document.createElement("p");
    paragraph.setAttribute("data-visual-edit-id", "heroSubtitle");
    paragraph.textContent = "שלום עולם יפה";
    root.appendChild(paragraph);

    applyVisualContentToDom(root, {
      __content: {
        heroSubtitle: {
          text: "שלום עולם יפה",
          html: 'שלום <a href="https://example.com/inline" style="font-style: italic; color: #2563eb; background-color: #facc15">עולם</a> יפה',
        },
      },
    });

    const link = paragraph.querySelector("a");
    expect(paragraph.textContent).toContain("שלום עולם יפה");
    expect(link?.textContent).toBe("עולם");
    expect(link?.getAttribute("href")).toBe("https://example.com/inline");
    expect(paragraph.innerHTML).not.toMatch(/<a[^>]*>שלום/);
    expect(paragraph.innerHTML).not.toMatch(/<a[^>]*>יפה/);
  });
});
