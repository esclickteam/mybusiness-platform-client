/**
 * Home first-paint uses html.bizuply-home / hx-preview + inline purple background.
 * Those must be cleared when leaving the public homepage, otherwise SPA routes
 * (login, dashboard, CRM) keep a solid purple #root and look blank/broken.
 */
export function clearHomeDocumentPaint(doc: Document = document): void {
  const html = doc.documentElement;
  html.classList.remove("bizuply-home", "hx-preview");

  const style = html.getAttribute("style") || "";
  if (/#5b21b6|91,\s*33,\s*182/i.test(style)) {
    html.style.removeProperty("background");
    // Keep unrelated inline vars (a11y scale, etc.).
    if (!(html.getAttribute("style") || "").trim()) {
      html.removeAttribute("style");
    }
  }

  const body = doc.body;
  if (body) {
    const bodyBg = `${body.style.background} ${body.style.backgroundColor}`;
    if (/#5b21b6|91,\s*33,\s*182/i.test(bodyBg)) {
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
