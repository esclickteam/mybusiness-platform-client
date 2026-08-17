import type { StylePatch } from "../../types";

export const RICH_TEXT_ATTR = "data-visual-rich-text";
export const RICH_PAINT_ATTR = "data-visual-rich-paint";
export const INLINE_MARK_ATTR = "data-visual-inline-mark";

export const INLINE_STYLE_KEYS = [
  "font-family",
  "fontFamily",
  "font-size",
  "fontSize",
  "font-weight",
  "fontWeight",
  "font-style",
  "fontStyle",
  "text-decoration",
  "textDecoration",
  "color",
  "-webkit-text-fill-color",
  "WebkitTextFillColor",
  "background-color",
  "backgroundColor",
] as const;

const ELEMENT_ONLY_KEYS = new Set([
  "text-align",
  "textAlign",
  "line-height",
  "lineHeight",
  "letter-spacing",
  "letterSpacing",
  "direction",
  "unicode-bidi",
  "unicodeBidi",
  "background-image",
  "backgroundImage",
  "background-clip",
  "backgroundClip",
  "-webkit-background-clip",
  "WebkitBackgroundClip",
]);

const ALLOWED_TAGS = new Set(["SPAN", "B", "I", "U", "STRONG", "EM", "A", "BR"]);
const ALLOWED_STYLE_PROPS = new Set([
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "text-decoration",
  "color",
  "-webkit-text-fill-color",
  "background-color",
]);

type TextRangeOffsets = {
  start: number;
  end: number;
};

type RangeSnapshot = {
  elementId: string;
  start: number;
  end: number;
};

let lastRangeSnapshot: RangeSnapshot | null = null;

function escapeHtml(value: string) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cssPropertyName(key: string) {
  if (key.startsWith("--")) return key;
  return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function isSafeHref(value: string) {
  const href = String(value || "").trim();
  if (!href) return false;
  if (href.startsWith("#") || href.startsWith("/")) return true;
  return /^(https?:|mailto:|tel:|sms:)/i.test(href);
}

export function isInlineCapablePatch(patch: StylePatch | Record<string, any>) {
  const keys = Object.keys(patch || {});
  if (!keys.length) return false;
  return keys.some((key) => !ELEMENT_ONLY_KEYS.has(key));
}

export function pickInlineStylePatch(patch: StylePatch | Record<string, any>) {
  const next: Record<string, string> = {};
  Object.entries(patch || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (ELEMENT_ONLY_KEYS.has(key)) return;
    if (key === "href" || key === "target" || key === "rel") return;
    const property = cssPropertyName(key);
    if (!ALLOWED_STYLE_PROPS.has(property)) return;
    next[property] = String(value);
  });
  return next;
}

export function sanitizeRichHtml(html: string) {
  const raw = String(html || "");
  if (!raw.trim()) return "";
  if (typeof document === "undefined") {
    return raw.replace(/<\/?(script|style|iframe|object|embed)[^>]*>/gi, "");
  }

  const root = document.createElement("div");
  root.innerHTML = raw;

  const walk = (node: Node) => {
    const children = Array.from(node.childNodes);
    children.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) return;
      if (!(child instanceof HTMLElement)) {
        child.parentNode?.removeChild(child);
        return;
      }

      if (!ALLOWED_TAGS.has(child.tagName)) {
        const parent = child.parentNode;
        while (child.firstChild) {
          parent?.insertBefore(child.firstChild, child);
        }
        parent?.removeChild(child);
        return;
      }

      Array.from(child.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name === "style") return;
        if (name === INLINE_MARK_ATTR || name === "data-visual-inline-mark") return;
        if (child.tagName === "A" && (name === "href" || name === "target" || name === "rel")) {
          if (name === "href" && !isSafeHref(attr.value)) {
            child.removeAttribute(attr.name);
          }
          return;
        }
        child.removeAttribute(attr.name);
      });

      if (child.getAttribute("style")) {
        const kept: string[] = [];
        String(child.getAttribute("style") || "")
          .split(";")
          .forEach((part) => {
            const [prop, ...rest] = part.split(":");
            const property = String(prop || "").trim().toLowerCase();
            const value = rest.join(":").trim();
            if (!property || !value) return;
            if (!ALLOWED_STYLE_PROPS.has(property)) return;
            if (/expression|url\s*\(|javascript:/i.test(value)) return;
            kept.push(`${property}: ${value}`);
          });
        if (kept.length) child.setAttribute("style", kept.join("; "));
        else child.removeAttribute("style");
      }

      walk(child);
    });
  };

  walk(root);
  return root.innerHTML;
}

export function hasRichMarkup(html: string) {
  return /<\s*(span|b|i|u|strong|em|a|br)\b/i.test(String(html || ""));
}

export function serializeRichHtml(node: HTMLElement | null) {
  if (!node) return "";
  const paint = node.querySelector<HTMLElement>(`[${RICH_PAINT_ATTR}="true"]`);
  const source = paint || node;
  return sanitizeRichHtml(source.innerHTML);
}

export function getLiveTextRange(node: HTMLElement | null): Range | null {
  if (!node || typeof window === "undefined") return null;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }

  const range = selection.getRangeAt(0);
  if (!node.contains(range.commonAncestorContainer)) return null;
  if (!String(range.toString() || "")) return null;
  return range;
}

export function getRangeOffsets(
  root: HTMLElement,
  range: Range,
): TextRangeOffsets | null {
  try {
    const pre = range.cloneRange();
    pre.selectNodeContents(root);
    pre.setEnd(range.startContainer, range.startOffset);
    const start = pre.toString().length;
    const end = start + range.toString().length;
    if (end <= start) return null;
    return { start, end };
  } catch {
    return null;
  }
}

export function snapshotTextRange(
  node: HTMLElement | null,
  elementId: string,
  options?: { clearIfNone?: boolean },
) {
  const id = String(elementId || "").trim();
  if (!node || !id) return;
  const range = getLiveTextRange(node);
  const offsets = range ? getRangeOffsets(node, range) : null;
  if (!offsets) {
    if (options?.clearIfNone && (!lastRangeSnapshot || lastRangeSnapshot.elementId === id)) {
      lastRangeSnapshot = null;
    }
    return;
  }
  lastRangeSnapshot = { elementId: id, ...offsets };
}

export function peekTextRangeSnapshot(elementId: string) {
  const id = String(elementId || "").trim();
  if (!id || !lastRangeSnapshot || lastRangeSnapshot.elementId !== id) {
    return null;
  }
  return lastRangeSnapshot;
}

export function clearTextRangeSnapshot(elementId?: string) {
  if (!elementId || lastRangeSnapshot?.elementId === elementId) {
    lastRangeSnapshot = null;
  }
}

export function resolveInlineOffsets(
  node: HTMLElement | null,
  elementId: string,
): TextRangeOffsets | null {
  if (!node) return peekTextRangeSnapshot(elementId);
  const live = getLiveTextRange(node);
  if (live) {
    const offsets = getRangeOffsets(node, live);
    if (offsets) {
      lastRangeSnapshot = { elementId, ...offsets };
      return offsets;
    }
  }
  return peekTextRangeSnapshot(elementId);
}

function wrapTextRangeInHtml(
  html: string,
  start: number,
  end: number,
  style: Record<string, string>,
  link?: { href: string; target?: string },
) {
  if (typeof document === "undefined") return html;
  const root = document.createElement("div");
  root.innerHTML = html || "";

  if (!root.childNodes.length) {
    root.appendChild(document.createTextNode(""));
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let cursor = 0;
  let started: { node: Text; offset: number } | null = null;
  let ended: { node: Text; offset: number } | null = null;
  const nodes: Text[] = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }

  nodes.forEach((textNode) => {
    const value = textNode.nodeValue || "";
    const next = cursor + value.length;
    if (!started && start >= cursor && start <= next) {
      started = { node: textNode, offset: start - cursor };
    }
    if (!ended && end >= cursor && end <= next) {
      ended = { node: textNode, offset: end - cursor };
    }
    cursor = next;
  });

  if (!started || !ended) return sanitizeRichHtml(root.innerHTML);

  const range = document.createRange();
  range.setStart(started.node, started.offset);
  range.setEnd(ended.node, ended.offset);

  const mark = document.createElement(link?.href ? "a" : "span");
  mark.setAttribute(INLINE_MARK_ATTR, "true");
  if (link?.href && isSafeHref(link.href)) {
    mark.setAttribute("href", link.href);
    mark.setAttribute("target", link.target || "_self");
    if ((link.target || "_self") === "_blank") {
      mark.setAttribute("rel", "noopener noreferrer");
    }
  }
  const css = Object.entries(style)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
  if (css) mark.setAttribute("style", css);

  try {
    range.surroundContents(mark);
  } catch {
    const contents = range.extractContents();
    mark.appendChild(contents);
    range.insertNode(mark);
  }

  return sanitizeRichHtml(root.innerHTML);
}

export function applyInlinePatchToHtml(
  currentHtml: string,
  plainText: string,
  offsets: TextRangeOffsets,
  patch: StylePatch | Record<string, any>,
) {
  const source = hasRichMarkup(currentHtml)
    ? sanitizeRichHtml(currentHtml)
    : escapeHtml(plainText);
  const style = pickInlineStylePatch(patch);
  const href = String((patch as any).href || "").trim();
  const target = String((patch as any).target || "").trim();
  return wrapTextRangeInHtml(
    source,
    offsets.start,
    offsets.end,
    style,
    href ? { href, target } : undefined,
  );
}

function firstDirectTextNode(node: HTMLElement) {
  return Array.from(node.childNodes).find(
    (child): child is Text => child.nodeType === Node.TEXT_NODE,
  );
}

export function applyRichTextToNode(
  node: HTMLElement,
  text: string,
  html?: string,
) {
  const safeHtml = sanitizeRichHtml(String(html || ""));
  const paint = node.querySelector<HTMLElement>(`[${RICH_PAINT_ATTR}="true"]`);

  if (!safeHtml || !hasRichMarkup(safeHtml)) {
    paint?.remove();
    node.removeAttribute(RICH_TEXT_ATTR);
    return false;
  }

  const currentHtml = sanitizeRichHtml(
    paint ? paint.innerHTML : node.innerHTML,
  );
  if (!paint && currentHtml === safeHtml) {
    node.setAttribute(RICH_TEXT_ATTR, "true");
    return true;
  }

  node.setAttribute(RICH_TEXT_ATTR, "true");

  let textNode = firstDirectTextNode(node);
  if (!textNode) {
    textNode = document.createTextNode("");
    node.insertBefore(textNode, node.firstChild);
  }
  if (textNode.nodeValue) {
    textNode.nodeValue = "";
  }

  let paintNode = paint;
  if (!paintNode) {
    paintNode = node.ownerDocument.createElement("span");
    paintNode.setAttribute(RICH_PAINT_ATTR, "true");
    node.appendChild(paintNode);
  }
  if (paintNode.innerHTML !== safeHtml) {
    paintNode.innerHTML = safeHtml;
  }

  void text;
  return true;
}

export function harvestRichHtmlFromNode(node: HTMLElement | null) {
  if (!node) return "";
  if (node.getAttribute(RICH_TEXT_ATTR) === "true") {
    return serializeRichHtml(node);
  }
  if (node.querySelector(`[${INLINE_MARK_ATTR}="true"]`)) {
    return serializeRichHtml(node);
  }
  return "";
}

export function plainTextFromRichHtml(html: string) {
  const raw = String(html || "");
  if (!raw.trim()) return "";
  if (typeof document === "undefined") {
    return raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  const root = document.createElement("div");
  root.innerHTML = sanitizeRichHtml(raw);
  return String(root.innerText || root.textContent || "").replace(/\s+/g, " ").trim();
}

export function richHtmlMatchesText(html: string, text: string) {
  return plainTextFromRichHtml(html) === String(text || "").replace(/\s+/g, " ").trim();
}

export function readComputedInlineState(node: HTMLElement | null) {
  if (!node || typeof window === "undefined") {
    return {
      fontFamily: "",
      fontSize: "",
      fontWeight: "",
      italic: false,
      underline: false,
      color: "",
      highlight: "",
    };
  }

  const selection = window.getSelection();
  const target =
    selection &&
    selection.rangeCount > 0 &&
    node.contains(selection.anchorNode)
      ? selection.anchorNode instanceof HTMLElement
        ? selection.anchorNode
        : selection.anchorNode?.parentElement
      : node;

  const computed = target
    ? window.getComputedStyle(target)
    : window.getComputedStyle(node);

  return {
    fontFamily: String(computed.fontFamily || ""),
    fontSize: String(computed.fontSize || ""),
    fontWeight: String(computed.fontWeight || ""),
    italic: String(computed.fontStyle || "") === "italic",
    underline: String(computed.textDecorationLine || computed.textDecoration || "")
      .includes("underline"),
    color: String(computed.color || ""),
    highlight: String(computed.backgroundColor || ""),
  };
}
