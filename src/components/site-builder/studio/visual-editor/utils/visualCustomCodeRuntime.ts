import type { VisualCustomCode } from "./visualData";

export const CUSTOM_CODE_RUNTIME_ATTR = "data-bizuply-custom-code-runtime";

function safeString(value: unknown) {
  return String(value ?? "");
}

/**
 * Clone HTML nodes so &lt;script&gt; tags actually execute
 * (template.cloneNode / innerHTML will not run them).
 */
export function materializeHtmlNode(node: Node): Node {
  if (node.nodeName === "SCRIPT") {
    const source = node as HTMLScriptElement;
    const script = document.createElement("script");
    Array.from(source.attributes || []).forEach((attr) => {
      script.setAttribute(attr.name, attr.value);
    });
    script.textContent = source.textContent || "";
    return script;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const source = node as Element;
    const clone = source.cloneNode(false) as Element;
    Array.from(source.childNodes).forEach((child) => {
      clone.appendChild(materializeHtmlNode(child));
    });
    return clone;
  }

  return node.cloneNode(true);
}

export function injectHtmlIntoElement(
  target: Element,
  html: string,
  options?: { markRuntime?: boolean; allowScripts?: boolean },
) {
  const template = document.createElement("template");
  template.innerHTML = html;

  Array.from(template.content.childNodes).forEach((node) => {
    if (node.nodeName === "SCRIPT" && options?.allowScripts === false) {
      return;
    }

    const materialized = materializeHtmlNode(node);
    if (
      options?.markRuntime &&
      materialized instanceof Element
    ) {
      materialized.setAttribute(CUSTOM_CODE_RUNTIME_ATTR, "true");
    }
    target.appendChild(materialized);
  });
}

export function clearCustomCodeRuntimeNodes(
  root: ParentNode = document,
) {
  root
    .querySelectorAll(`[${CUSTOM_CODE_RUNTIME_ATTR}="true"]`)
    .forEach((node) => node.remove());
}

export type ApplyCustomCodeOptions = {
  /** When false, skip &lt;script&gt; from headHtml and the javascript field */
  runScripts?: boolean;
  /** CSS only (editor canvas) — skip head/js */
  cssOnly?: boolean;
  document?: Document;
};

/**
 * Apply custom CSS / head HTML / JS into the live document.
 * Body HTML should be rendered via slots (React or injectHtmlIntoElement).
 */
export function applyCustomCodeToDocument(
  customCode: VisualCustomCode | Record<string, any> | null | undefined,
  options: ApplyCustomCodeOptions = {},
) {
  const doc = options.document || document;
  if (typeof doc === "undefined") {
    return () => undefined;
  }

  clearCustomCodeRuntimeNodes(doc);

  const code = customCode && typeof customCode === "object" ? customCode : {};
  const enabled = (code as VisualCustomCode).enabled !== false;
  if (!enabled) {
    return () => clearCustomCodeRuntimeNodes(doc);
  }

  const css = safeString((code as VisualCustomCode).css).trim();
  if (css) {
    const style = doc.createElement("style");
    style.setAttribute(CUSTOM_CODE_RUNTIME_ATTR, "true");
    style.setAttribute("data-bizuply-custom-css", "true");
    style.textContent = css;
    doc.head.appendChild(style);
  }

  if (options.cssOnly) {
    return () => clearCustomCodeRuntimeNodes(doc);
  }

  const headHtml = safeString((code as VisualCustomCode).headHtml).trim();
  if (headHtml) {
    const template = doc.createElement("template");
    template.innerHTML = headHtml;
    Array.from(template.content.childNodes).forEach((node) => {
      const isScript = node.nodeName === "SCRIPT";
      if (isScript && options.runScripts === false) return;

      const materialized = materializeHtmlNode(node);
      if (materialized instanceof Element) {
        materialized.setAttribute(CUSTOM_CODE_RUNTIME_ATTR, "true");
      }
      doc.head.appendChild(materialized);
    });
  }

  const javascript = safeString((code as VisualCustomCode).javascript).trim();
  if (javascript && options.runScripts !== false) {
    const script = doc.createElement("script");
    script.setAttribute(CUSTOM_CODE_RUNTIME_ATTR, "true");
    script.setAttribute("data-bizuply-custom-js", "true");
    script.textContent = javascript;
    doc.body.appendChild(script);
  }

  return () => clearCustomCodeRuntimeNodes(doc);
}

export function getCustomCodeCss(
  customCode: VisualCustomCode | Record<string, any> | null | undefined,
) {
  const code = customCode && typeof customCode === "object" ? customCode : {};
  if ((code as VisualCustomCode).enabled === false) return "";
  return safeString((code as VisualCustomCode).css).trim();
}

export function normalizeCustomCodeDraft(
  patch: Partial<VisualCustomCode> | Record<string, any> | null | undefined,
): VisualCustomCode {
  const source = patch && typeof patch === "object" ? patch : {};
  return {
    enabled: source.enabled !== false,
    css: safeString(source.css),
    headHtml: safeString(source.headHtml),
    bodyStartHtml: safeString(source.bodyStartHtml),
    bodyEndHtml: safeString(source.bodyEndHtml),
    javascript: safeString(source.javascript),
    ...(safeString(source.updatedAt)
      ? { updatedAt: safeString(source.updatedAt) }
      : {}),
  };
}

function joinCodeParts(...parts: string[]) {
  return parts.map((part) => part.trim()).filter(Boolean).join("\n\n");
}

/**
 * Site-wide code runs on every page; page code only on the current page.
 * Order: site → page for head/css/js/bodyStart; page → site for bodyEnd.
 */
export function mergeCustomCodeLayers(
  siteCode?: VisualCustomCode | Record<string, any> | null,
  pageCode?: VisualCustomCode | Record<string, any> | null,
): VisualCustomCode {
  const site = normalizeCustomCodeDraft(siteCode);
  const page = normalizeCustomCodeDraft(pageCode);
  const siteOn = site.enabled !== false;
  const pageOn = page.enabled !== false;

  return {
    enabled: siteOn || pageOn,
    css: joinCodeParts(siteOn ? site.css || "" : "", pageOn ? page.css || "" : ""),
    headHtml: joinCodeParts(
      siteOn ? site.headHtml || "" : "",
      pageOn ? page.headHtml || "" : "",
    ),
    bodyStartHtml: joinCodeParts(
      siteOn ? site.bodyStartHtml || "" : "",
      pageOn ? page.bodyStartHtml || "" : "",
    ),
    bodyEndHtml: joinCodeParts(
      pageOn ? page.bodyEndHtml || "" : "",
      siteOn ? site.bodyEndHtml || "" : "",
    ),
    javascript: joinCodeParts(
      siteOn ? site.javascript || "" : "",
      pageOn ? page.javascript || "" : "",
    ),
    updatedAt:
      [site.updatedAt, page.updatedAt].filter(Boolean).sort().at(-1) ||
      undefined,
  };
}

export function hasCustomCodeContent(
  code?: VisualCustomCode | Record<string, any> | null,
) {
  const normalized = normalizeCustomCodeDraft(code);
  return Boolean(
    normalized.css?.trim() ||
      normalized.headHtml?.trim() ||
      normalized.bodyStartHtml?.trim() ||
      normalized.bodyEndHtml?.trim() ||
      normalized.javascript?.trim(),
  );
}
