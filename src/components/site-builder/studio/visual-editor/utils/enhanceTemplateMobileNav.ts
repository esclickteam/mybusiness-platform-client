/**
 * Universal mobile nav for all website templates.
 *
 * Many templates hide desktop <nav> with `hidden lg:flex` / `md:flex` but never
 * ship a hamburger. This enhancer adds a toggle + opens the existing nav as a
 * dropdown on small screens / studio Mobile·Tablet preview — without editing
 * each template's React tree.
 */

const STYLE_ID = "bizuply-template-mobile-nav-styles";
const TOGGLE_ATTR = "data-bizuply-mobile-toggle";
const HEADER_ATTR = "data-bizuply-mobile-nav";
const BP_ATTR = "data-bizuply-nav-bp";
const OPEN_ATTR = "data-bizuply-nav-open";
const OPEN_CLASS = "bizuply-mobile-nav-open";

const MOBILE_NAV_CSS = `
[${TOGGLE_ATTR}="true"] {
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  flex: 0 0 auto;
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

header[${HEADER_ATTR}="on"] {
  /* Do NOT force position:relative — that pulls fixed/absolute headers out of layout. */
  overflow: visible !important;
}

/* Real viewports */
@media (max-width: 767px) {
  header[${HEADER_ATTR}="on"][${BP_ATTR}="md"] [${TOGGLE_ATTR}="true"],
  header[${HEADER_ATTR}="on"][${BP_ATTR}="lg"] [${TOGGLE_ATTR}="true"],
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"] [${TOGGLE_ATTR}="true"] {
    display: inline-flex !important;
  }

  header[${HEADER_ATTR}="on"][${BP_ATTR}="md"].${OPEN_CLASS} > nav,
  header[${HEADER_ATTR}="on"][${BP_ATTR}="md"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"],
  header[${HEADER_ATTR}="on"][${BP_ATTR}="lg"].${OPEN_CLASS} > nav,
  header[${HEADER_ATTR}="on"][${BP_ATTR}="lg"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"],
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"].${OPEN_CLASS} > nav,
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] {
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
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  header[${HEADER_ATTR}="on"][${BP_ATTR}="lg"] [${TOGGLE_ATTR}="true"],
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"] [${TOGGLE_ATTR}="true"] {
    display: inline-flex !important;
  }

  header[${HEADER_ATTR}="on"][${BP_ATTR}="lg"].${OPEN_CLASS} > nav,
  header[${HEADER_ATTR}="on"][${BP_ATTR}="lg"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"],
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"].${OPEN_CLASS} > nav,
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] {
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
  }
}

@media (min-width: 1024px) and (max-width: 1279px) {
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"] [${TOGGLE_ATTR}="true"] {
    display: inline-flex !important;
  }

  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"].${OPEN_CLASS} > nav,
  header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 0.25rem !important;
    position: absolute !important;
    inset-inline: 0.75rem !important;
    top: calc(100% + 0.4rem) !important;
    padding: 0.65rem !important;
    border-radius: 1.25rem !important;
    background: #ffffff !important;
    box-shadow: 0 22px 55px rgba(15, 23, 42, 0.22) !important;
    z-index: 70 !important;
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
}

header.${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] a:hover,
header.${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] button:hover {
  background: rgba(15, 23, 42, 0.06) !important;
}

/* Studio device toggles (Tailwind @media still sees desktop window) */
[data-visual-device="mobile"] header[${HEADER_ATTR}="on"] [${TOGGLE_ATTR}="true"],
[data-visual-device="tablet"] header[${HEADER_ATTR}="on"][${BP_ATTR}="lg"] [${TOGGLE_ATTR}="true"],
[data-visual-device="tablet"] header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"] [${TOGGLE_ATTR}="true"] {
  display: inline-flex !important;
}

[data-visual-device="mobile"] header[${HEADER_ATTR}="on"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"],
[data-visual-device="tablet"] header[${HEADER_ATTR}="on"][${BP_ATTR}="lg"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"],
[data-visual-device="tablet"] header[${HEADER_ATTR}="on"][${BP_ATTR}="xl"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 0.25rem !important;
  position: absolute !important;
  inset-inline: 0.75rem !important;
  top: calc(100% + 0.4rem) !important;
  max-height: min(70vh, 28rem) !important;
  overflow: auto !important;
  padding: 0.65rem !important;
  border-radius: 1.25rem !important;
  background: #ffffff !important;
  color: #0f172a !important;
  box-shadow: 0 22px 55px rgba(15, 23, 42, 0.22) !important;
  z-index: 70 !important;
}

[data-visual-device="desktop"] header[${HEADER_ATTR}="on"] [${TOGGLE_ATTR}="true"] {
  display: none !important;
}

[data-visual-device="desktop"] header[${HEADER_ATTR}="on"].${OPEN_CLASS} nav[data-bizuply-desktop-nav="true"] {
  /* let Tailwind desktop rules win */
  position: static !important;
  inset: auto !important;
  max-height: none !important;
  padding: unset !important;
  box-shadow: none !important;
  background: unset !important;
}
`.trim();

function ensureStyles(doc: Document) {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = MOBILE_NAV_CSS;
  doc.head.appendChild(style);
}

function classNameOf(el: Element): string {
  if (typeof el.className === "string") return el.className;
  return el.getAttribute("class") || "";
}

function detectDesktopNav(header: HTMLElement): {
  nav: HTMLElement;
  bp: "md" | "lg" | "xl";
} | null {
  const navs = Array.from(header.querySelectorAll("nav"));
  for (const nav of navs) {
    if (!(nav instanceof HTMLElement)) continue;
    const cls = classNameOf(nav);
    if (!/\bhidden\b/.test(cls)) continue;
    if (/\bxl:flex\b/.test(cls)) return { nav, bp: "xl" };
    if (/\blg:flex\b/.test(cls)) return { nav, bp: "lg" };
    if (/\bmd:flex\b/.test(cls)) return { nav, bp: "md" };
  }
  return null;
}

function hasNativeMobileToggle(header: HTMLElement): boolean {
  if (header.querySelector(`[${TOGGLE_ATTR}="true"]`)) return false;

  const buttons = Array.from(header.querySelectorAll("button"));
  return buttons.some((btn) => {
    const cls = classNameOf(btn);
    if (!/\b(?:sm|md|lg|xl):hidden\b/.test(cls)) return false;

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

    // Square icon buttons (lucide Menu / X) used as hamburgers
    const looksSquare =
      /\bh-(9|10|11|12)\b/.test(cls) && /\bw-(9|10|11|12)\b/.test(cls);
    if (looksSquare && btn.querySelector("svg")) return true;

    if (/\bgrid\b/.test(cls) && /\bplace-items-center\b/.test(cls) && btn.querySelector("svg")) {
      return true;
    }

    return false;
  });
}

function syncOpenState(header: HTMLElement, toggle: HTMLButtonElement) {
  const open = header.getAttribute(OPEN_ATTR) === "true";
  header.classList.toggle(OPEN_CLASS, open);
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  toggle.textContent = open ? "×" : "☰";
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

  // Close after choosing a nav item
  if (!header.dataset.bizuplyMobileNavBound) {
    header.dataset.bizuplyMobileNavBound = "true";
    header.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (target.closest(`[${TOGGLE_ATTR}="true"]`)) return;
        if (!target.closest("nav[data-bizuply-desktop-nav='true'] a, nav[data-bizuply-desktop-nav='true'] button")) {
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
    // Prefer the actual <header> when both match
    const header =
      node.tagName === "HEADER"
        ? node
        : (node.closest("header") as HTMLElement | null) || node;

    if (seen.has(header)) return;
    seen.add(header);

    if (hasNativeMobileToggle(header)) {
      header.setAttribute(HEADER_ATTR, "native");
      return;
    }

    const found = detectDesktopNav(header);
    if (!found) {
      if (header.getAttribute(HEADER_ATTR) === "on") {
        header.removeAttribute(HEADER_ATTR);
        header.removeAttribute(BP_ATTR);
        header.querySelector(`[${TOGGLE_ATTR}="true"]`)?.remove();
      }
      return;
    }

    found.nav.setAttribute("data-bizuply-desktop-nav", "true");
    ensureToggle(header, found.bp);
  });

  // Re-attach after React remounts the header (toggle is outside React's VDOM).
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
