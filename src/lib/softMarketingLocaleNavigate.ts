/**
 * Soft locale navigation for marketing pages (home and localized cousins).
 *
 * Full `location.assign` between `/` and `/he` (etc.) remounts the document
 * against `html.bizuply-home { background:#ffffff }`, so users can see a blank
 * white frame before the hero product media paints. Soft navigation keeps the SPA
 * alive, only remounts the locale basename router, and holds a visual clone
 * of the current hero until the next hero (with media) is ready.
 */

export const LOCALE_HOLD_ID = "bizuply-locale-hold";
export const SOFT_LOCALE_EVENT = "bizuply:soft-locale";

export type SoftLocaleDetail = {
  path: string;
  locale?: string;
};

let softLocaleHandlerInstalled = false;

/** SoftLocaleRouter calls this while mounted so LanguageSwitcher can soft-nav. */
export function setSoftLocaleHandlerInstalled(installed: boolean): void {
  softLocaleHandlerInstalled = installed;
}

export function isSoftLocaleHandlerInstalled(): boolean {
  return softLocaleHandlerInstalled;
}

function isUsableHero(node: Element | null): node is HTMLElement {
  if (!node || !(node instanceof HTMLElement)) return false;
  const rect = node.getBoundingClientRect();
  return rect.width > 40 && rect.height > 40;
}

export function captureLocalePaintHold(doc: Document = document): HTMLElement | null {
  doc.getElementById(LOCALE_HOLD_ID)?.remove();

  const hero =
    doc.querySelector<HTMLElement>("#root .hx-hero") ||
    doc.querySelector<HTMLElement>("#bizuply-first-paint .hx-hero") ||
    doc.querySelector<HTMLElement>(".hx-hero");
  if (!isUsableHero(hero)) return null;

  const hold = doc.createElement("div");
  hold.id = LOCALE_HOLD_ID;
  hold.setAttribute("aria-hidden", "true");
  hold.dataset.softLocaleHold = "1";
  Object.assign(hold.style, {
    position: "fixed",
    inset: "0",
    zIndex: "2147483000",
    pointerEvents: "none",
    overflow: "hidden",
    background: "#ffffff",
  });

  const wrap = doc.createElement("div");
  wrap.style.minHeight = "100%";
  wrap.style.background = "#ffffff";

  const header =
    doc.querySelector("#root .site-header") ||
    doc.querySelector("#root header.site-header") ||
    doc.querySelector("#root header") ||
    doc.querySelector(".site-header");
  if (header) {
    wrap.appendChild(header.cloneNode(true));
  }
  wrap.appendChild(hero.cloneNode(true));
  hold.appendChild(wrap);
  doc.documentElement.appendChild(hold);
  return hold;
}

export function hideRootForSoftLocale(doc: Document = document): void {
  const root = doc.getElementById("root");
  if (!root) return;
  root.dataset.softLocalePending = "1";
  root.style.visibility = "hidden";
}

export function revealRootAfterSoftLocale(doc: Document = document): void {
  const root = doc.getElementById("root");
  if (!root) return;
  delete root.dataset.softLocalePending;
  root.style.visibility = "";
}

export function releaseLocalePaintHold(doc: Document = document): void {
  doc.getElementById(LOCALE_HOLD_ID)?.remove();
  revealRootAfterSoftLocale(doc);
}

export function heroMediaReady(doc: Document = document): boolean {
  const hero = doc.querySelector<HTMLElement>("#root .hx-hero");
  if (!isUsableHero(hero)) return false;
  if (hero.querySelector(".bj-window, .bj-title")) return true;
  const shot =
    doc.querySelector<HTMLImageElement>("#root .hx-hero-shot-1") ||
    doc.querySelector<HTMLImageElement>("#root .hx-hero-stage-inner img") ||
    doc.querySelector<HTMLImageElement>("#root .hx-hero-frame img") ||
    doc.querySelector<HTMLVideoElement>("#root .hx-theater-video") ||
    doc.querySelector<HTMLVideoElement>("#root .hx-hero-frame video");
  if (!shot) return false;
  if (shot instanceof HTMLImageElement) {
    return shot.complete && shot.naturalWidth > 0;
  }
  if (shot instanceof HTMLVideoElement) {
    return shot.readyState >= 2 || Boolean(shot.poster);
  }
  return true;
}

/**
 * Poll until the remounted hero has product media, then drop the paint hold.
 * Call only AFTER the locale router remount so a stale pre-remount hero cannot
 * satisfy readiness and uncover a purple gap.
 */
export function releaseLocalePaintHoldWhenReady(
  doc: Document = document,
  timeoutMs = 4500,
): void {
  const hold = doc.getElementById(LOCALE_HOLD_ID);
  if (!hold) {
    revealRootAfterSoftLocale(doc);
    return;
  }
  const started = Date.now();

  const tick = () => {
    if (heroMediaReady(doc) || Date.now() - started > timeoutMs) {
      hold.remove();
      revealRootAfterSoftLocale(doc);
      return;
    }
    const win = doc.defaultView;
    if (win) win.requestAnimationFrame(tick);
    else {
      hold.remove();
      revealRootAfterSoftLocale(doc);
    }
  };

  const win = doc.defaultView;
  if (win) win.requestAnimationFrame(tick);
  else {
    hold.remove();
    revealRootAfterSoftLocale(doc);
  }
}

/**
 * Soft-navigate to a marketing locale path. Returns true when handled.
 * Callers should already have applied i18n for `locale`.
 * SoftLocaleRouter must be mounted (enableSoftLocale); otherwise returns false
 * so callers can fall back to a full navigation.
 */
export function softMarketingLocaleNavigate(
  nextPath: string,
  locale?: string,
  win: Window = window,
): boolean {
  if (!softLocaleHandlerInstalled) return false;

  const path = String(nextPath || "").split(/[?#]/)[0];
  if (!path || path === win.location.pathname) return false;

  captureLocalePaintHold(win.document);
  hideRootForSoftLocale(win.document);
  win.dispatchEvent(
    new CustomEvent<SoftLocaleDetail>(SOFT_LOCALE_EVENT, {
      detail: { path, locale },
    }),
  );
  return true;
}
