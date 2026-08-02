const FONT_IMPORT_RE =
  /@import\s+(?:url\()?['"]?(https:\/\/fonts\.googleapis\.com\/css2?\?[^'")\s]+)['"]?\)?\s*;?/gi;

/**
 * Google Fonts stylesheets without crossorigin="anonymous" cannot be read via
 * cssRules (CORS). html-to-image then logs SecurityError while capturing.
 * Promote @import fonts to CORS-enabled <link> tags and mark existing links.
 */
export function prepareDocumentFontsForCapture(doc: Document | null | undefined) {
  if (!doc?.head) return;

  const urls = new Set<string>();

  doc.querySelectorAll("style").forEach((styleEl) => {
    const css = String(styleEl.textContent || "");
    if (!css.includes("fonts.googleapis.com")) return;

    let match: RegExpExecArray | null;
    FONT_IMPORT_RE.lastIndex = 0;
    while ((match = FONT_IMPORT_RE.exec(css))) {
      urls.add(match[1]);
    }

    const cleaned = css.replace(FONT_IMPORT_RE, "").trim();
    if (cleaned !== css) {
      styleEl.textContent = cleaned;
    }
  });

  doc.querySelectorAll('link[rel="stylesheet"]').forEach((node) => {
    if (!(node instanceof HTMLLinkElement)) return;
    const href = String(node.href || "");
    if (!href.includes("fonts.googleapis.com")) return;
    urls.add(href);
    node.setAttribute("crossorigin", "anonymous");
  });

  urls.forEach((url) => {
    const existing = Array.from(
      doc.head.querySelectorAll('link[rel="stylesheet"]'),
    ).find(
      (node) =>
        node instanceof HTMLLinkElement &&
        (node.href === url || node.getAttribute("href") === url),
    );

    if (existing instanceof HTMLLinkElement) {
      existing.setAttribute("crossorigin", "anonymous");
      return;
    }

    const link = doc.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.setAttribute("crossorigin", "anonymous");
    link.setAttribute("data-bizuply-capture-font", "true");
    doc.head.appendChild(link);
  });
}
