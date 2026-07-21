import {
  buildNavTreeFromSitePages,
  type SiteNavTreeItem,
  type SitePageNavSource,
} from "./syncNavWithSitePages";

const STYLE_ID = "bizuply-nav-submenu-styles";
const SUBMENU_ATTR = "data-bizuply-nav-submenu";
const PARENT_ATTR = "data-bizuply-nav-parent";
const CHILD_HIDDEN_ATTR = "data-bizuply-nav-child-hidden";
const WRAPPER_ATTR = "data-bizuply-nav-item";
const WRAPPER_DOM_VALUE = "dom";
const CHEVRON_ATTR = "data-bizuply-nav-chevron";

const NAV_SUBMENU_CSS = `
[${WRAPPER_ATTR}] {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
}

[${WRAPPER_ATTR}] > :first-child {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
}

[${CHEVRON_ATTR}="true"] {
  display: inline-block;
  width: 0.45em;
  height: 0.45em;
  border-inline-end: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
  opacity: 0.75;
  flex: 0 0 auto;
  margin-top: -0.15em;
  transition: transform 0.18s ease;
}

[${WRAPPER_ATTR}].is-open [${CHEVRON_ATTR}="true"],
[${WRAPPER_ATTR}]:hover [${CHEVRON_ATTR}="true"],
[${WRAPPER_ATTR}]:focus-within [${CHEVRON_ATTR}="true"] {
  transform: rotate(-135deg);
  margin-top: 0.15em;
}

[${SUBMENU_ATTR}="true"] {
  display: none;
  flex-direction: column;
  align-items: stretch;
  gap: 0.15rem;
  min-width: max(10rem, 100%);
  padding: 0.45rem 0.35rem;
  margin: 0;
  list-style: none;
  background: #ffffff;
  color: #111827;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 0.65rem;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.14);
  z-index: 80;
}

[${WRAPPER_ATTR}].is-open > [${SUBMENU_ATTR}="true"],
[${WRAPPER_ATTR}]:hover > [${SUBMENU_ATTR}="true"],
[${WRAPPER_ATTR}]:focus-within > [${SUBMENU_ATTR}="true"] {
  display: flex;
}

@media (min-width: 768px) {
  [${WRAPPER_ATTR}] > [${SUBMENU_ATTR}="true"] {
    position: absolute;
    inset-inline-start: 0;
    top: calc(100% + 0.35rem);
  }
}

[${SUBMENU_ATTR}="true"] a,
[${SUBMENU_ATTR}="true"] button {
  display: block;
  width: 100%;
  text-align: inherit;
  padding: 0.55rem 0.75rem;
  border: 0;
  border-radius: 0.45rem;
  background: transparent;
  color: inherit;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
}

[${SUBMENU_ATTR}="true"] a:hover,
[${SUBMENU_ATTR}="true"] button:hover,
[${SUBMENU_ATTR}="true"] a.is-active,
[${SUBMENU_ATTR}="true"] button.is-active {
  background: rgba(15, 23, 42, 0.06);
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
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = NAV_SUBMENU_CSS;
  doc.head.appendChild(style);
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

  subpages.forEach((child) => {
    submenu.appendChild(createSubmenuLink(doc, child));
  });

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
