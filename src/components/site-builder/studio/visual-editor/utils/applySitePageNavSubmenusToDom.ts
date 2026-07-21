import {
  buildNavTreeFromSitePages,
  type SiteNavTreeItem,
  type SitePageNavSource,
} from "./syncNavWithSitePages";

const STYLE_ID = "bizuply-nav-submenu-styles";
const SUBMENU_ATTR = "data-bizuply-nav-submenu";
const SUBMENU_PANEL_ATTR = "data-bizuply-nav-submenu-panel";
const PARENT_ATTR = "data-bizuply-nav-parent";
const CHILD_HIDDEN_ATTR = "data-bizuply-nav-child-hidden";
const WRAPPER_ATTR = "data-bizuply-nav-item";
const WRAPPER_DOM_VALUE = "dom";
const CHEVRON_ATTR = "data-bizuply-nav-chevron";

const NAV_SUBMENU_CSS = `
/* Keep header row layout intact — dropdown overlays, never expands the bar */
[${WRAPPER_ATTR}] {
  position: relative;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  overflow: visible;
}

header,
nav,
[data-template-section-type="header"],
[data-section-kind="header"] {
  overflow: visible !important;
}

[${WRAPPER_ATTR}] > :first-child {
  display: inline-flex !important;
  align-items: center;
  gap: 0.4em;
}

[${CHEVRON_ATTR}="true"] {
  display: inline-block;
  width: 0.4em;
  height: 0.4em;
  border-inline-end: 1.6px solid currentColor;
  border-bottom: 1.6px solid currentColor;
  transform: rotate(45deg);
  opacity: 0.85;
  flex: 0 0 auto;
  margin-top: -0.2em;
  transition: transform 0.18s ease;
  pointer-events: none;
}

[${WRAPPER_ATTR}].is-open [${CHEVRON_ATTR}="true"],
[${WRAPPER_ATTR}]:hover [${CHEVRON_ATTR}="true"],
[${WRAPPER_ATTR}]:focus-within [${CHEVRON_ATTR}="true"] {
  transform: rotate(-135deg);
  margin-top: 0.12em;
}

/*
  Outer submenu is the hover hit-area (padding-top = bridge).
  Inner panel carries the visible cream/white surface — no dead gap.
*/
[${SUBMENU_ATTR}="true"],
header [${SUBMENU_ATTR}="true"],
[data-template-section-type="header"] [${SUBMENU_ATTR}="true"] {
  position: absolute;
  inset-inline-start: 0;
  top: 100%;
  display: none;
  flex-direction: column;
  align-items: stretch;
  min-width: max(11rem, 100%);
  padding: 0.45rem 0 0;
  margin: 0;
  list-style: none;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  z-index: 200;
  pointer-events: auto;
}

[${WRAPPER_ATTR}].is-open > [${SUBMENU_ATTR}="true"],
[${WRAPPER_ATTR}]:hover > [${SUBMENU_ATTR}="true"],
[${WRAPPER_ATTR}]:focus-within > [${SUBMENU_ATTR}="true"] {
  display: flex;
}

[${SUBMENU_PANEL_ATTR}="true"] {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.15rem;
  padding: 0.45rem 0.35rem;
  background: #ffffff !important;
  color: #111827 !important;
  -webkit-text-fill-color: #111827 !important;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 0.65rem;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.18);
  pointer-events: auto;
}

[${SUBMENU_ATTR}="true"] a,
[${SUBMENU_ATTR}="true"] button,
header [${SUBMENU_ATTR}="true"] a,
header [${SUBMENU_ATTR}="true"] button,
[data-template-section-type="header"] [${SUBMENU_ATTR}="true"] a,
[data-template-section-type="header"] [${SUBMENU_ATTR}="true"] button {
  display: block;
  width: 100%;
  text-align: inherit;
  padding: 0.55rem 0.75rem;
  border: 0;
  border-radius: 0.45rem;
  background: transparent !important;
  color: #111827 !important;
  -webkit-text-fill-color: #111827 !important;
  opacity: 1 !important;
  font: inherit;
  font-weight: 700;
  text-decoration: none !important;
  cursor: pointer;
  white-space: nowrap;
  pointer-events: auto !important;
  position: relative;
  z-index: 1;
}

[${SUBMENU_ATTR}="true"] a *,
[${SUBMENU_ATTR}="true"] button *,
header [${SUBMENU_ATTR}="true"] a *,
header [${SUBMENU_ATTR}="true"] button *,
[data-template-section-type="header"] [${SUBMENU_ATTR}="true"] a *,
[data-template-section-type="header"] [${SUBMENU_ATTR}="true"] button * {
  color: #111827 !important;
  -webkit-text-fill-color: #111827 !important;
  opacity: 1 !important;
  pointer-events: none;
}

[${SUBMENU_ATTR}="true"] a:hover,
[${SUBMENU_ATTR}="true"] button:hover,
[${SUBMENU_ATTR}="true"] a.is-active,
[${SUBMENU_ATTR}="true"] button.is-active,
header [${SUBMENU_ATTR}="true"] a:hover,
header [${SUBMENU_ATTR}="true"] button:hover,
[data-template-section-type="header"] [${SUBMENU_ATTR}="true"] a:hover,
[data-template-section-type="header"] [${SUBMENU_ATTR}="true"] button:hover {
  background: rgba(15, 23, 42, 0.08) !important;
  color: #0f172a !important;
  -webkit-text-fill-color: #0f172a !important;
}

[${CHILD_HIDDEN_ATTR}="true"] {
  display: none !important;
}
`;

function asPlainObject(value: unknown): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, any>;
}

function normalizeKey(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.html?$/i, "");
}

function ensureSubmenuStyles(doc: Document) {
  let style = doc.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = doc.createElement("style");
    style.id = STYLE_ID;
    doc.head.appendChild(style);
  }
  style.textContent = NAV_SUBMENU_CSS;
}

function readNodeHref(node: Element) {
  return normalizeKey(
    node.getAttribute("data-bizuply-public-href") ||
      node.getAttribute("data-visual-link-href") ||
      node.getAttribute("data-link-url") ||
      node.getAttribute("data-href") ||
      (node.matches("a") ? node.getAttribute("href") : "") ||
      "",
  );
}

function readNodeLabel(node: Element) {
  return String(node.textContent || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function readNodePageId(node: Element) {
  return normalizeKey(
    node.getAttribute("data-site-page-id") ||
      node.getAttribute("data-page-id") ||
      "",
  );
}

function clearPreviousSubmenus(root: HTMLElement) {
  root.querySelectorAll(`[${WRAPPER_ATTR}="${WRAPPER_DOM_VALUE}"]`).forEach((wrapper) => {
    if (!(wrapper instanceof HTMLElement)) return;
    wrapper.querySelectorAll(`[${SUBMENU_ATTR}="true"]`).forEach((node) => {
      node.remove();
    });
    wrapper.querySelectorAll(`[${CHEVRON_ATTR}="true"]`).forEach((node) => {
      node.remove();
    });
    const parent = wrapper.parentElement;
    if (!parent) return;
    while (wrapper.firstChild) {
      const child = wrapper.firstChild;
      if (child instanceof HTMLElement) {
        child.removeAttribute(PARENT_ATTR);
        child.removeAttribute("aria-haspopup");
        child.removeAttribute("aria-expanded");
        child.classList.remove("is-open");
      }
      parent.insertBefore(child, wrapper);
    }
    wrapper.remove();
  });

  root.querySelectorAll(`[${CHILD_HIDDEN_ATTR}="true"]`).forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    node.removeAttribute(CHILD_HIDDEN_ATTR);
  });
}

function collectNavTriggerNodes(container: Element): HTMLElement[] {
  const nodes = container.querySelectorAll(
    [
      "a.servora-nav-link",
      "button.servora-nav-link",
      ".servora-nav-link",
      "nav > a",
      "nav > button",
      "nav a[href]",
      "nav button",
      '[data-editable="link"]',
      "[data-visual-link-href]",
      "[data-bizuply-public-href]",
    ].join(", "),
  );

  const result: HTMLElement[] = [];
  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    if (node.closest(`[${SUBMENU_ATTR}="true"]`)) return;
    if (node.closest("footer, [data-template-section-type='footer']")) return;
    result.push(node);
  });
  return result;
}

function matchNavNodeToPage(
  node: HTMLElement,
  pages: SitePageNavSource[],
): SitePageNavSource | null {
  const pageId = readNodePageId(node);
  if (pageId) {
    const byId =
      pages.find((page) => normalizeKey(page.id) === pageId) || null;
    if (byId) return byId;
  }

  const href = readNodeHref(node);
  if (href) {
    const byHref =
      pages.find((page) => {
        const slug = normalizeKey(page.slug || page.id);
        if (page.isHome || slug === "home" || slug === "index") {
          return href === "" || href === "/" || href === "home" || href === "index";
        }
        return slug === href || normalizeKey(page.id) === href;
      }) || null;
    if (byHref) return byHref;
  }

  const label = readNodeLabel(node);
  if (!label) return null;

  const byTitle = pages.filter((page) => {
    const title = String(page.title || page.name || "")
      .trim()
      .toLowerCase();
    return title && title === label;
  });
  return byTitle.length === 1 ? byTitle[0] : null;
}

function createSubmenuLink(
  doc: Document,
  item: SiteNavTreeItem,
): HTMLAnchorElement {
  const link = doc.createElement("a");
  link.href = item.href || `/${item.slug || item.id}`;
  link.textContent = item.title || item.slug || item.id;
  link.setAttribute("data-bizuply-public-href", link.href);
  link.setAttribute("data-visual-link-href", link.href);
  link.setAttribute("data-link-url", link.href);
  link.setAttribute("data-bizuply-public-link", "true");
  link.setAttribute("data-site-page-id", item.id);
  // Beat template header link colors (e.g. Justora cream-on-dark) on white panels
  link.style.setProperty("color", "#111827", "important");
  link.style.setProperty("-webkit-text-fill-color", "#111827", "important");
  link.style.setProperty("opacity", "1", "important");
  return link;
}

function wrapParentWithSubmenu(
  parentNode: HTMLElement,
  subpages: SiteNavTreeItem[],
) {
  if (!subpages.length) return;

  // React templates may already render a submenu — don't double-wrap.
  if (
    parentNode.closest(`[${WRAPPER_ATTR}]`)?.querySelector(`[${SUBMENU_ATTR}="true"]`) ||
    parentNode.parentElement?.querySelector(`:scope > [${SUBMENU_ATTR}="true"]`)
  ) {
    return;
  }

  const doc = parentNode.ownerDocument;
  if (!doc) return;

  let wrapper = parentNode.parentElement;
  if (
    !(wrapper instanceof HTMLElement) ||
    wrapper.getAttribute(WRAPPER_ATTR) !== WRAPPER_DOM_VALUE
  ) {
    wrapper = doc.createElement("div");
    wrapper.setAttribute(WRAPPER_ATTR, WRAPPER_DOM_VALUE);
    parentNode.parentElement?.insertBefore(wrapper, parentNode);
    wrapper.appendChild(parentNode);
  }

  parentNode.setAttribute(PARENT_ATTR, "true");
  parentNode.setAttribute("aria-haspopup", "true");
  parentNode.setAttribute("aria-expanded", "false");

  if (!parentNode.querySelector(`[${CHEVRON_ATTR}="true"]`)) {
    const chevron = doc.createElement("span");
    chevron.setAttribute(CHEVRON_ATTR, "true");
    chevron.setAttribute("aria-hidden", "true");
    parentNode.appendChild(chevron);
  }

  const submenu = doc.createElement("div");
  submenu.setAttribute(SUBMENU_ATTR, "true");
  submenu.setAttribute("role", "menu");

  const panel = doc.createElement("div");
  panel.setAttribute(SUBMENU_PANEL_ATTR, "true");

  subpages.forEach((child) => {
    panel.appendChild(createSubmenuLink(doc, child));
  });

  submenu.appendChild(panel);
  wrapper.appendChild(submenu);
}

/**
 * Nest Site Menu sub-pages under their parents in every template header.
 * Works for React templates and HTML snapshots after visual DOM apply.
 */
export function applySitePageNavSubmenusToDom(
  root: HTMLElement | null | undefined,
  visualData: Record<string, any> | null | undefined,
) {
  if (!root) return;

  const data = asPlainObject(visualData);
  const pages = (
    Array.isArray(data.__sitePages) ? data.__sitePages : []
  ) as SitePageNavSource[];

  clearPreviousSubmenus(root);

  const tree = Array.isArray(data.__navTree)
    ? (data.__navTree as SiteNavTreeItem[])
    : buildNavTreeFromSitePages(pages);

  const parentsWithKids = tree.filter(
    (item) => Array.isArray(item.subpages) && item.subpages.length > 0,
  );
  if (!parentsWithKids.length) return;

  ensureSubmenuStyles(root.ownerDocument || document);

  const childIds = new Set<string>();
  const childKeys = new Set<string>();
  parentsWithKids.forEach((parent) => {
    parent.subpages.forEach((child) => {
      childIds.add(String(child.id));
      childKeys.add(normalizeKey(child.id));
      childKeys.add(normalizeKey(child.slug));
      childKeys.add(normalizeKey(child.href));
      childKeys.add(String(child.title || "").trim().toLowerCase());
    });
  });

  const containers = root.querySelectorAll(
    "nav, .servora-nav, [data-template-section-type='header'], [aria-label*='ניווט'], [aria-label*='navigation' i]",
  );
  const scopes = containers.length ? Array.from(containers) : [root];

  scopes.forEach((container) => {
    if (!(container instanceof Element)) return;
    if (container.closest("footer, [data-template-section-type='footer']")) {
      return;
    }

    const triggers = collectNavTriggerNodes(container);
    const matchedParents: Array<{
      node: HTMLElement;
      item: SiteNavTreeItem;
    }> = [];

    triggers.forEach((node) => {
      const matched = matchNavNodeToPage(node, pages);
      if (!matched) return;

      const id = String(matched.id || "");
      if (childIds.has(id) || childKeys.has(normalizeKey(matched.slug))) {
        node.setAttribute(CHILD_HIDDEN_ATTR, "true");
        return;
      }

      const treeItem = parentsWithKids.find((item) => item.id === id);
      if (treeItem) {
        matchedParents.push({ node, item: treeItem });
      }
    });

    matchedParents.forEach(({ node, item }) => {
      wrapParentWithSubmenu(node, item.subpages);
    });
  });
}

/** CSS string for public base styles (optional duplicate of injected tag). */
export const SITE_PAGE_NAV_SUBMENU_CSS = NAV_SUBMENU_CSS;
