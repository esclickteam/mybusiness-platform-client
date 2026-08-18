/**
 * Universal header nav for all website templates.
 *
 * Many templates hide desktop <nav> with `hidden lg:flex` / `md:flex` but never
 * ship a hamburger. This enhancer adds a toggle and opens the existing nav as a
 * dropdown — driven by viewport, studio device preview, container width, and
 * live overflow — without editing each template's React tree.
 */

const STYLE_ID = "bizuply-template-mobile-nav-styles";
const TOGGLE_ATTR = "data-bizuply-mobile-toggle";
const HEADER_ATTR = "data-bizuply-mobile-nav";
const BP_ATTR = "data-bizuply-nav-bp";
const OPEN_ATTR = "data-bizuply-nav-open";
const OVERFLOW_ATTR = "data-bizuply-header-overflow";
const OPEN_CLASS = "bizuply-mobile-nav-open";

const DROPDOWN_NAV = `
  display: flex !important;
  flex-direction: column !important;
  flex-wrap: nowrap !important;
  align-items: stretch !important;
  gap: 0.25rem !important;
  position: absolute !important;
  inset-inline: 0.75rem !important;
  top: calc(100% + 0.4rem) !important;
  width: auto !important;
  max-height: min(70vh, 28rem) !important;
  overflow: auto !important;
  padding: 0.65rem !important;
  border-radius: 1.25rem !important;
  background: #ffffff !important;
  color: #0f172a !important;
  box-shadow: 0 22px 55px rgba(15, 23, 42, 0.22) !important;
  z-index: 70 !important;
`;

const MOBILE_NAV_CSS = `
[${TOGGLE_ATTR}="true"] {
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  flex: 0 0 auto;
  flex-shrink: 0;
  border-radius: 9999px;
  border: 1px solid rgba(15, 23, 42, 0.14);
  background: rgba(255, 255, 255, 0.96);
  color: #0f172a;
  font-size: 1.35rem;
  line-height: 1;
  cursor: pointer;
  z-index: 60;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.12);
  -webkit-tap-highlight-color: transparent;
}

header[${HEADER_ATTR}="on"],
header[${HEADER_ATTR}="native"] {
  overflow: visible !important;
}

header[${HEADER_ATTR}] nav,
header[${HEADER_ATTR}] nav a,
header[${HEADER_ATTR}] nav button,
header[${HEADER_ATTR}] nav span {
  flex-shrink: 0;
  white-space: nowrap;
  overflow-wrap: normal;
  word-break: normal;
}

/* Real viewports */
@media (max-width: 767px) {
  header[${HEADER_ATTR}="on"] [${TOGGLE_ATTR}="true"] {
    display: inline-flex !important;
  }
  header[${HEADER_ATTR}="on"]:not(.${OPEN_CLASS}) nav[data-bizuply-desktop-nav="true"] {
    display: none !important;
  }
  header[${HEADER_ATTR}="on"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] {
    ${DROPDOWN_NAV}
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  header[${HEADER_ATTR}="on"][${BP_ATTR}="lg"] [${TOGGLE_ATTR}="true"],
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"] [${TOGGLE_ATTR}="true"] {
    display: inline-flex !important;
  }
  header[${HEADER_ATTR}="on"][${BP_ATTR}="lg"]:not(.${OPEN_CLASS}) nav[data-bizuply-desktop-nav="true"],
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"]:not(.${OPEN_CLASS}) nav[data-bizuply-desktop-nav="true"] {
    display: none !important;
  }
  header[${HEADER_ATTR}="on"][${BP_ATTR}="lg"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"],
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] {
    ${DROPDOWN_NAV}
  }
}

@media (min-width: 1024px) and (max-width: 1279px) {
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"] [${TOGGLE_ATTR}="true"] {
    display: inline-flex !important;
  }
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"]:not(.${OPEN_CLASS}) nav[data-bizuply-desktop-nav="true"] {
    display: none !important;
  }
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] {
    ${DROPDOWN_NAV}
  }
}

header.${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] a,
header.${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] button {
  display: flex !important;
  width: 100% !important;
  justify-content: flex-start !important;
  text-align: start !important;
  padding: 0.75rem 0.9rem !important;
  border-radius: 0.85rem !important;
  color: inherit !important;
  background: transparent !important;
  white-space: normal !important;
}

header.${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] a:hover,
header.${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] button:hover {
  background: rgba(15, 23, 42, 0.06) !important;
}

/* Studio device toggles (Tailwind @media still sees desktop window) */
[data-visual-device="mobile"] header[${HEADER_ATTR}="on"] [${TOGGLE_ATTR}="true"],
[data-visual-device="tablet"] header[${HEADER_ATTR}="on"] [${TOGGLE_ATTR}="true"] {
  display: inline-flex !important;
}

[data-visual-device="mobile"] header[${HEADER_ATTR}="on"]:not(.${OPEN_CLASS}) nav[data-bizuply-desktop-nav="true"],
[data-visual-device="tablet"] header[${HEADER_ATTR}="on"]:not(.${OPEN_CLASS}) nav[data-bizuply-desktop-nav="true"] {
  display: none !important;
}

[data-visual-device="mobile"] header[${HEADER_ATTR}="on"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"],
[data-visual-device="tablet"] header[${HEADER_ATTR}="on"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] {
  ${DROPDOWN_NAV}
}

[data-visual-device="desktop"] header[${HEADER_ATTR}="on"]:not([${OVERFLOW_ATTR}="true"]) [${TOGGLE_ATTR}="true"] {
  display: none !important;
}

[data-visual-device="desktop"] header[${HEADER_ATTR}="on"]:not([${OVERFLOW_ATTR}="true"]).${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] {
  position: static !important;
  inset: auto !important;
  max-height: none !important;
  padding: unset !important;
  box-shadow: none !important;
  background: unset !important;
}

/* Canvas / nested site width — same rules as viewport, independent of window */
@container bizuply-template (max-width: 767px) {
  header[${HEADER_ATTR}="on"] [${TOGGLE_ATTR}="true"] {
    display: inline-flex !important;
  }
  header[${HEADER_ATTR}="on"]:not(.${OPEN_CLASS}) nav[data-bizuply-desktop-nav="true"] {
    display: none !important;
  }
  header[${HEADER_ATTR}="on"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] {
    ${DROPDOWN_NAV}
  }
}

@container bizuply-template (min-width: 768px) and (max-width: 1023px) {
  header[${HEADER_ATTR}="on"][${BP_ATTR}="lg"] [${TOGGLE_ATTR}="true"],
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"] [${TOGGLE_ATTR}="true"] {
    display: inline-flex !important;
  }
  header[${HEADER_ATTR}="on"][${BP_ATTR}="lg"]:not(.${OPEN_CLASS}) nav[data-bizuply-desktop-nav="true"],
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"]:not(.${OPEN_CLASS}) nav[data-bizuply-desktop-nav="true"] {
    display: none !important;
  }
  header[${HEADER_ATTR}="on"][${BP_ATTR}="lg"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"],
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] {
    ${DROPDOWN_NAV}
  }
}

@container bizuply-template (min-width: 1024px) and (max-width: 1279px) {
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"] [${TOGGLE_ATTR}="true"] {
    display: inline-flex !important;
  }
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"]:not(.${OPEN_CLASS}) nav[data-bizuply-desktop-nav="true"] {
    display: none !important;
  }
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] {
    ${DROPDOWN_NAV}
  }
}

/* Live overflow: hamburger instead of crushed flex text */
header[${OVERFLOW_ATTR}="true"] [${TOGGLE_ATTR}="true"],
header[${OVERFLOW_ATTR}="true"] [data-header-mobile-menu="true"] {
  display: inline-flex !important;
}

header[${OVERFLOW_ATTR}="true"]:not(.${OPEN_CLASS}) nav[data-bizuply-desktop-nav="true"] {
  display: none !important;
}

header[${OVERFLOW_ATTR}="true"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] {
  ${DROPDOWN_NAV}
}
`.trim();

function ensureStyles(doc: Document) {
  let style = doc.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = doc.createElement("style");
    style.id = STYLE_ID;
    doc.head.appendChild(style);
  }
  if (style.textContent !== MOBILE_NAV_CSS) style.textContent = MOBILE_NAV_CSS;
}

function unwrapIllegalNavLinkWraps(header: HTMLElement) {
  header.querySelectorAll("nav a[data-visual-element-link='true']").forEach((wrap) => {
    if (!(wrap instanceof HTMLAnchorElement)) return;
    if (!wrap.querySelector("a")) return;
    const parent = wrap.parentElement;
    if (!parent) return;
    while (wrap.firstChild) parent.insertBefore(wrap.firstChild, wrap);
    wrap.remove();
  });
}

function classNameOf(el: Element): string {
  if (typeof el.className === "string") return el.className;
  return el.getAttribute("class") || "";
}

function navBreakpoint(cls: string): "md" | "lg" | "xl" {
  if (/\bxl:flex\b/.test(cls)) return "xl";
  if (/\blg:flex\b/.test(cls)) return "lg";
  if (/\bmd:flex\b/.test(cls)) return "md";
  return "lg";
}

export function detectDesktopNav(header: HTMLElement): {
  nav: HTMLElement;
  bp: "md" | "lg" | "xl";
} | null {
  const navs = Array.from(header.querySelectorAll("nav")).filter(
    (nav): nav is HTMLElement => nav instanceof HTMLElement,
  );

  for (const nav of navs) {
    const cls = classNameOf(nav);
    if (!/\bhidden\b/.test(cls)) continue;
    if (/\b(?:md|lg|xl):flex\b/.test(cls)) {
      return { nav, bp: navBreakpoint(cls) };
    }
  }

  const fallback = navs[0];
  if (!fallback) return null;
  return { nav: fallback, bp: navBreakpoint(classNameOf(fallback)) };
}

function isNativeMenuButton(btn: HTMLButtonElement): boolean {
  const cls = classNameOf(btn);
  if (!/\b(?:sm|md|lg|xl):hidden\b/.test(cls) && !btn.hasAttribute("data-header-mobile-menu")) {
    return false;
  }

  const text = (btn.textContent || "").replace(/\s+/g, "").trim();
  if (
    text === "☰" ||
    text === "×" ||
    text === "✕" ||
    text === "Menu" ||
    text === "תפריט"
  ) {
    return true;
  }

  const looksSquare =
    /\bh-(9|10|11|12)\b/.test(cls) && /\bw-(9|10|11|12)\b/.test(cls);
  if (looksSquare && (btn.querySelector("svg") || btn.querySelectorAll("span").length >= 2)) {
    return true;
  }

  if (/\bgrid\b/.test(cls) && /\bplace-items-center\b/.test(cls) && btn.querySelector("svg")) {
    return true;
  }

  return btn.getAttribute("data-header-mobile-menu") === "true";
}

function hasNativeMobileToggle(header: HTMLElement): boolean {
  if (header.querySelector(`[${TOGGLE_ATTR}="true"]`)) return false;
  return Array.from(header.querySelectorAll("button")).some(
    (btn) => btn instanceof HTMLButtonElement && isNativeMenuButton(btn),
  );
}

function bindNativeOverflowMenu(header: HTMLElement) {
  if (header.dataset.bizuplyNativeOverflowBound === "true") return;
  header.dataset.bizuplyNativeOverflowBound = "true";

  header.addEventListener(
    "click",
    (event) => {
      if (header.getAttribute(OVERFLOW_ATTR) !== "true") return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const btn = target.closest("button");
      if (!(btn instanceof HTMLButtonElement) || !header.contains(btn)) return;
      if (!isNativeMenuButton(btn)) return;

      event.preventDefault();
      event.stopPropagation();
      const next = header.getAttribute(OPEN_ATTR) !== "true";
      header.setAttribute(OPEN_ATTR, next ? "true" : "false");
      header.classList.toggle(OPEN_CLASS, next);
      btn.setAttribute("aria-expanded", next ? "true" : "false");
    },
    true,
  );
}

function syncOpenState(header: HTMLElement, toggle: HTMLButtonElement) {
  const open = header.getAttribute(OPEN_ATTR) === "true";
  header.classList.toggle(OPEN_CLASS, open);
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  toggle.textContent = open ? "×" : "☰";
}

export function headerNeedsCompactNav(header: HTMLElement): boolean {
  const bp = header.getAttribute(BP_ATTR);
  const row =
    (header.querySelector(":scope > div") as HTMLElement | null) || header;
  const width = Math.round(
    row.getBoundingClientRect?.().width || row.clientWidth || 0,
  );

  if (bp === "md") return width > 0 && width < 768;
  if (bp === "lg") return width > 0 && width < 1024;
  if (bp === "xl") return width > 0 && width < 1280;
  return false;
}

export function headerRowOverflows(header: HTMLElement): boolean {
  const row = findHeaderRow(header);
  const win = header.ownerDocument.defaultView;
  if (!win || !row) return false;

  const cs = win.getComputedStyle(row);
  const available =
    row.clientWidth -
    parsePx(cs.paddingInlineStart || cs.paddingLeft) -
    parsePx(cs.paddingInlineEnd || cs.paddingRight);
  if (available <= 0) return false;

  const children = Array.from(row.children).filter((node): node is HTMLElement => {
    if (!(node instanceof HTMLElement)) return false;
    if (node.getAttribute(TOGGLE_ATTR) === "true") return false;
    if (node.getAttribute("data-header-mobile-menu") === "true") return false;
    return win.getComputedStyle(node).display !== "none";
  });

  if (!children.length) return false;

  const gap = Math.max(
    parsePx(cs.columnGap),
    parsePx(cs.gap === "normal" ? "0" : cs.gap),
  );

  let used = 0;
  children.forEach((child, index) => {
    used += intrinsicChromeWidth(child);
    if (index > 0) used += gap;
  });

  return used > available + 8;
}

function parsePx(value: string | undefined): number {
  const n = parseFloat(value || "0");
  return Number.isFinite(n) ? n : 0;
}

function findHeaderRow(header: HTMLElement): HTMLElement {
  const candidates = [header, ...Array.from(header.querySelectorAll("div"))];
  for (const node of candidates) {
    if (!(node instanceof HTMLElement)) continue;
    const display =
      node.ownerDocument.defaultView?.getComputedStyle(node).display || "";
    if (!display.includes("flex")) continue;
    if (
      node.ownerDocument.defaultView?.getComputedStyle(node).flexDirection ===
      "column"
    ) {
      continue;
    }
    const hasNav = Boolean(node.querySelector(":scope > nav, :scope nav"));
    const realKids = Array.from(node.children).filter(
      (child) =>
        child instanceof HTMLElement &&
        child.getAttribute(TOGGLE_ATTR) !== "true",
    );
    if (hasNav && realKids.length >= 2) return node;
  }
  return (header.querySelector(":scope > div") as HTMLElement | null) || header;
}

function intrinsicChromeWidth(el: HTMLElement): number {
  const nav =
    el.tagName === "NAV"
      ? el
      : (el.querySelector("nav") as HTMLElement | null);
  if (nav) return intrinsicNavWidth(nav);

  return measureMaxContent(el);
}

function intrinsicNavWidth(nav: HTMLElement): number {
  const items = Array.from(nav.querySelectorAll(":scope > a, :scope > button"));
  if (!items.length) return measureMaxContent(nav);

  const win = nav.ownerDocument.defaultView;
  const gap = parsePx(win?.getComputedStyle(nav).columnGap || win?.getComputedStyle(nav).gap);
  let width = 0;
  items.forEach((item, index) => {
    if (!(item instanceof HTMLElement)) return;
    width += measureMaxContent(item);
    if (index > 0) width += gap;
  });
  return width;
}

function measureMaxContent(el: HTMLElement): number {
  const prev = el.getAttribute("style");
  el.style.setProperty("flex", "0 0 auto", "important");
  el.style.setProperty("width", "max-content", "important");
  el.style.setProperty("max-width", "none", "important");
  el.style.setProperty("min-width", "min-content", "important");
  el.style.setProperty("white-space", "nowrap", "important");
  el.style.setProperty("display", el.tagName === "NAV" ? "flex" : getComputedStyle(el).display === "flex" ? "flex" : "inline-flex", "important");
  const width = Math.max(
    el.scrollWidth,
    Math.ceil(el.getBoundingClientRect().width),
  );
  if (prev) el.setAttribute("style", prev);
  else el.removeAttribute("style");
  return width;
}

function applyOverflowFlag(header: HTMLElement) {
  try {
    if (headerRowOverflows(header) || headerNeedsCompactNav(header)) {
      header.setAttribute(OVERFLOW_ATTR, "true");
    } else {
      header.removeAttribute(OVERFLOW_ATTR);
    }
  } catch {
    header.removeAttribute(OVERFLOW_ATTR);
  }
}

function observeOverflow(header: HTMLElement) {
  if (header.dataset.bizuplyHeaderOverflowBound === "true") return;
  header.dataset.bizuplyHeaderOverflowBound = "true";

  const run = () => applyOverflowFlag(header);
  run();

  if (typeof ResizeObserver === "function") {
    const ro = new ResizeObserver(() => run());
    ro.observe(header);
    const row = findHeaderRow(header);
    if (row && row !== header) ro.observe(row);
  }

  header.ownerDocument.defaultView?.addEventListener("resize", run);
}

function ensureToggle(header: HTMLElement, bp: "md" | "lg" | "xl") {
  header.setAttribute(HEADER_ATTR, "on");
  header.setAttribute(BP_ATTR, bp);

  let toggle = header.querySelector(
    `[${TOGGLE_ATTR}="true"]`,
  ) as HTMLButtonElement | null;

  if (!toggle) {
    toggle = header.ownerDocument.createElement("button");
    toggle.type = "button";
    toggle.setAttribute(TOGGLE_ATTR, "true");
    toggle.setAttribute("aria-label", "תפריט");
    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const next = header.getAttribute(OPEN_ATTR) !== "true";
      header.setAttribute(OPEN_ATTR, next ? "true" : "false");
      syncOpenState(header, toggle!);
    });

    const bar =
      (header.querySelector(":scope > div") as HTMLElement | null) || header;
    bar.appendChild(toggle);
  }

  syncOpenState(header, toggle);

  if (!header.dataset.bizuplyMobileNavBound) {
    header.dataset.bizuplyMobileNavBound = "true";
    header.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (target.closest(`[${TOGGLE_ATTR}="true"]`)) return;
        if (
          !target.closest(
            "nav[data-bizuply-desktop-nav='true'] a, nav[data-bizuply-desktop-nav='true'] button",
          )
        ) {
          return;
        }
        header.setAttribute(OPEN_ATTR, "false");
        const t = header.querySelector(
          `[${TOGGLE_ATTR}="true"]`,
        ) as HTMLButtonElement | null;
        if (t) syncOpenState(header, t);
      },
      true,
    );
  }
}

export function enhanceTemplateMobileNav(root: HTMLElement | null) {
  if (!root || typeof document === "undefined") return;

  ensureStyles(root.ownerDocument || document);

  const headers = Array.from(
    root.querySelectorAll(
      "header, [data-template-section-type='header'], [data-section-kind='header']",
    ),
  );

  const seen = new Set<HTMLElement>();

  headers.forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const header =
      node.tagName === "HEADER"
        ? node
        : (node.closest("header") as HTMLElement | null) || node;

    if (seen.has(header)) return;
    seen.add(header);

    unwrapIllegalNavLinkWraps(header);

    if (hasNativeMobileToggle(header)) {
      header.setAttribute(HEADER_ATTR, "native");
      const found = detectDesktopNav(header);
      if (found) {
        found.nav.setAttribute("data-bizuply-desktop-nav", "true");
        header.setAttribute(BP_ATTR, found.bp);
      }
      bindNativeOverflowMenu(header);
      observeOverflow(header);
      return;
    }

    const found = detectDesktopNav(header);
    if (!found) {
      if (header.getAttribute(HEADER_ATTR) === "on") {
        header.removeAttribute(HEADER_ATTR);
        header.removeAttribute(BP_ATTR);
        header.querySelector(`[${TOGGLE_ATTR}="true"]`)?.remove();
      }
      observeOverflow(header);
      return;
    }

    found.nav.setAttribute("data-bizuply-desktop-nav", "true");
    ensureToggle(header, found.bp);
    observeOverflow(header);
  });

  if (!root.dataset.bizuplyMobileNavObserving && typeof MutationObserver !== "undefined") {
    root.dataset.bizuplyMobileNavObserving = "true";
    let frame = 0;
    const observer = new MutationObserver((mutations) => {
      const relevant = mutations.some((mutation) => {
        if (mutation.type !== "childList") return false;
        const nodes = [
          ...Array.from(mutation.addedNodes),
          ...Array.from(mutation.removedNodes),
        ];
        return nodes.some((n) => {
          if (!(n instanceof Element)) return false;
          if (n.getAttribute?.(TOGGLE_ATTR) === "true") return false;
          return (
            n.matches?.("header, nav, [data-template-section-type='header']") ||
            n.querySelector?.("header, nav") != null
          );
        });
      });
      if (!relevant) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => enhanceTemplateMobileNav(root));
    });
    observer.observe(root, { childList: true, subtree: true });
  }
}
