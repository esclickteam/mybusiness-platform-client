/**
 * Home first-paint uses html.bizuply-home / hx-preview + an inline brand background.
 * Those must be cleared when leaving the public homepage, otherwise SPA routes
 * (login, dashboard, CRM) keep a solid #root and look blank.
 */
const HOME_PAINT = /#5b21b6|#2541f5|91,\s*33,\s*182|37,\s*65,\s*245/i;

export function clearHomeDocumentPaint(doc: Document = document): void {
  const html = doc.documentElement;
  html.classList.remove("bizuply-home", "hx-preview");

  const style = html.getAttribute("style") || "";
  if (HOME_PAINT.test(style)) {
    html.style.removeProperty("background");
    // Keep unrelated inline vars (a11y scale, etc.).
    if (!(html.getAttribute("style") || "").trim()) {
      html.removeAttribute("style");
    }
  }

  const body = doc.body;
  if (body) {
    const bodyBg = `${body.style.background} ${body.style.backgroundColor}`;
    if (HOME_PAINT.test(bodyBg)) {
      body.style.removeProperty("background");
      body.style.removeProperty("background-color");
    }
  }

  doc.getElementById("bizuply-first-paint")?.remove();
  doc.getElementById("root")?.removeAttribute("hidden");
}

export function isHomePaintPath(pathname: string): boolean {
  return pathname === "/" || pathname === "/home-preview";
}
