import { describe, expect, it } from "vitest";

import {
  applyVisualContentToDom,
  applyVisualStylesToDom,
} from "./visualDomApply";
import { applySharedTextFormat } from "./textFormatCommands";

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
});
