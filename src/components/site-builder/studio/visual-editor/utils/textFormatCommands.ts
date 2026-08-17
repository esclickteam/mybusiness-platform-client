import type { StylePatch } from "../../types";

import {
  applyInlinePatchToHtml,
  applyRichTextToNode,
  harvestRichHtmlFromNode,
  isInlineCapablePatch,
  pickInlineStylePatch,
  resolveInlineOffsets,
  snapshotTextRange,
} from "./richTextHtml";

export { snapshotTextRange };

export const TEXT_STYLE_PRESETS: Array<{
  id: string;
  label: string;
  tags: string[];
  style: StylePatch;
}> = [
  {
    id: "h1",
    label: "Heading 1",
    tags: ["h1"],
    style: {
      "font-size": "48px",
      fontSize: "48px",
      "font-weight": "700",
      fontWeight: "700",
      "line-height": "1.15",
      lineHeight: "1.15",
    },
  },
  {
    id: "h2",
    label: "Heading 2",
    tags: ["h2"],
    style: {
      "font-size": "36px",
      fontSize: "36px",
      "font-weight": "700",
      fontWeight: "700",
      "line-height": "1.2",
      lineHeight: "1.2",
    },
  },
  {
    id: "h3",
    label: "Heading 3",
    tags: ["h3"],
    style: {
      "font-size": "28px",
      fontSize: "28px",
      "font-weight": "600",
      fontWeight: "600",
      "line-height": "1.25",
      lineHeight: "1.25",
    },
  },
  {
    id: "h4",
    label: "Heading 4",
    tags: ["h4"],
    style: {
      "font-size": "22px",
      fontSize: "22px",
      "font-weight": "600",
      fontWeight: "600",
      "line-height": "1.3",
      lineHeight: "1.3",
    },
  },
  {
    id: "paragraph",
    label: "Paragraph",
    tags: ["p", "span", "div"],
    style: {
      "font-size": "16px",
      fontSize: "16px",
      "font-weight": "400",
      fontWeight: "400",
      "line-height": "1.55",
      lineHeight: "1.55",
    },
  },
];

export function inferTextStyleId(tagName: string, fontSize: string) {
  const tag = String(tagName || "").toLowerCase();
  const presetByTag = TEXT_STYLE_PRESETS.find((item) => item.tags.includes(tag));
  if (presetByTag) return presetByTag.id;

  const size = Number.parseFloat(String(fontSize || ""));
  if (!Number.isFinite(size)) return "paragraph";
  if (size >= 40) return "h1";
  if (size >= 32) return "h2";
  if (size >= 24) return "h3";
  if (size >= 20) return "h4";
  return "paragraph";
}

export function isTextSettingsElement(element: any) {
  const type = String(
    element?.type ||
      element?.elementType ||
      element?.kind ||
      "",
  )
    .trim()
    .toLowerCase();

  if (["text", "heading", "paragraph"].includes(type)) return true;

  const node =
    element?.node ||
    element?.domNode ||
    element?.element ||
    null;
  if (!(node instanceof HTMLElement)) return type === "button";

  const visualType = String(
    node.getAttribute("data-visual-edit-type") || "",
  )
    .trim()
    .toLowerCase();
  if (["text", "heading", "paragraph"].includes(visualType)) return true;

  const tag = String(node.tagName || "").toLowerCase();
  return [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "span",
    "strong",
    "em",
    "small",
    "label",
    "blockquote",
    "figcaption",
  ].includes(tag);
}

export function getSelectedTextNode(element: any): HTMLElement | null {
  const node =
    element?.node ||
    element?.domNode ||
    element?.element ||
    null;
  return node instanceof HTMLElement ? node : null;
}

export function applySharedTextFormat(options: {
  elementId: string;
  patch: StylePatch | Record<string, any>;
  node: HTMLElement | null;
  currentHtml?: string;
  currentText?: string;
  applyElementStyle: (elementId: string, patch: StylePatch) => boolean;
  persistRichText: (elementId: string, text: string, html: string) => boolean;
  forceElement?: boolean;
}) {
  const {
    elementId,
    patch,
    node,
    applyElementStyle,
    persistRichText,
    forceElement,
  } = options;

  if (!elementId) return { applied: false, mode: "none" as const };

  const href = String((patch as { href?: string }).href || "").trim();
  const hasInlineStyles = Object.keys(pickInlineStylePatch(patch)).length > 0;
  const offsets =
    !forceElement &&
    node &&
    (hasInlineStyles || Boolean(href))
      ? resolveInlineOffsets(node, elementId)
      : null;

  if (offsets && node) {
    const currentText = String(
      options.currentText ?? node.innerText ?? node.textContent ?? "",
    );
    const currentHtml = String(
      options.currentHtml ?? harvestRichHtmlFromNode(node) ?? "",
    );
    const nextHtml = applyInlinePatchToHtml(
      currentHtml,
      currentText,
      offsets,
      patch,
    );
    applyRichTextToNode(node, currentText, nextHtml);
    persistRichText(elementId, currentText, nextHtml);
    return { applied: true, mode: "inline" as const, html: nextHtml };
  }

  applyElementStyle(elementId, patch as StylePatch);
  return { applied: true, mode: "element" as const };
}
