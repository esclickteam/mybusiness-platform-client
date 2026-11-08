import React from "react";
import type { StudioTemplateRenderer } from "./templateEditorTypes";

type AiSiteProps = {
  data?: Record<string, unknown>;
  mode?: string;
};

function scopeSelectorList(selector: string) {
  return selector
    .split(",")
    .map((part) => {
      const item = part.trim();
      if (!item || item.startsWith("@")) return item;
      if (item === "html" || item === "body" || item === ":root" || item === "html,body") {
        return '[data-template-id="ai-site"]';
      }
      if (item.startsWith('[data-template-id="ai-site"]')) return item;
      return `[data-template-id="ai-site"] ${item}`;
    })
    .join(",");
}

function scopeEditorCss(css: string): string {
  let index = 0;
  let output = "";
  const source = String(css || "");
  while (index < source.length) {
    if (source.startsWith("@import", index)) {
      const end = source.indexOf(";", index);
      output += end < 0 ? source.slice(index) : source.slice(index, end + 1);
      index = end < 0 ? source.length : end + 1;
      continue;
    }
    const brace = source.indexOf("{", index);
    if (brace < 0) {
      output += source.slice(index);
      break;
    }
    const selector = source.slice(index, brace).trim();
    let depth = 1;
    let cursor = brace + 1;
    while (cursor < source.length && depth) {
      if (source[cursor] === "{") depth += 1;
      else if (source[cursor] === "}") depth -= 1;
      cursor += 1;
    }
    const inner = source.slice(brace + 1, cursor - 1);
    if (selector.startsWith("@media") || selector.startsWith("@supports")) {
      output += `${selector}{${scopeEditorCss(inner)}}`;
    } else if (selector.startsWith("@keyframes") || selector.startsWith("@font-face")) {
      output += `${selector}{${inner}}`;
    } else if (selector) {
      output += `${scopeSelectorList(selector)}{${inner}}`;
    }
    index = cursor;
  }
  return output;
}

export const aiSiteRenderer: StudioTemplateRenderer = {
  key: "ai-site",
  name: "AI",
  editorMode: "visual-react",
  pages: [{ id: "home", name: "ראשי", slug: "home" }],
  Component: function AiSiteDocument({ data }: AiSiteProps) {
    const html = String(data?.__aiDocument || "");
    const css = scopeEditorCss(String(data?.__aiCss || ""));
    return (
      <div data-template-id="ai-site" style={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
        <style>{css}</style>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  },
  defaultData: {},
  editorCss: "",
};
