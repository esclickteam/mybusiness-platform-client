export const ANNOUNCEMENT_HEIGHT_VAR = "--bizuply-announcement-height";
export const ANNOUNCEMENT_INSET_VAR = "--bizuply-announcement-inset";

const ROOT_SELECTOR =
  '[data-bizuply-site="true"], [data-bizuply-public-render-root="true"], [data-template-id], [data-studio-page="true"]';

const HEADER_SELECTOR = [
  "header",
  '[data-section-kind="header"]',
  '[data-template-section-type="header"]',
].join(",");

const OFFSET_ATTR = "data-bizuply-announcement-offset";
const TOP_BASE_ATTR = "data-bizuply-header-top-base";
const TOP_INLINE_ATTR = "data-bizuply-header-top-inline";

function readHeaderElements(): HTMLElement[] {
  if (typeof document === "undefined") return [];
  const roots = Array.from(document.querySelectorAll<HTMLElement>(ROOT_SELECTOR));
  const scopes: Array<ParentNode> = roots.length ? roots : [document];
  const found = new Set<HTMLElement>();
  for (const scope of scopes) {
    scope.querySelectorAll<HTMLElement>(HEADER_SELECTOR).forEach((el) => {
      if (el.closest('[data-bizuply-widget="announcement-bar"]')) return;
      found.add(el);
    });
  }
  return Array.from(found);
}

function rememberHeaderTop(header: HTMLElement) {
  if (header.hasAttribute(TOP_BASE_ATTR)) return;
  header.setAttribute(TOP_INLINE_ATTR, header.style.top || "");
  const computedTop = window.getComputedStyle(header).top;
  header.setAttribute(
    TOP_BASE_ATTR,
    computedTop && computedTop !== "auto" ? computedTop : "0px"
  );
}

function restoreHeaderTop(header: HTMLElement) {
  const inline = header.getAttribute(TOP_INLINE_ATTR);
  if (inline) header.style.top = inline;
  else header.style.removeProperty("top");
  header.removeAttribute(OFFSET_ATTR);
  header.removeAttribute(TOP_BASE_ATTR);
  header.removeAttribute(TOP_INLINE_ATTR);
}

export function viewportAnnouncementInset(bar: HTMLElement | null) {
  if (!bar) return 0;
  const rect = bar.getBoundingClientRect();
  if (rect.height <= 0 || rect.bottom <= 0) return 0;
  if (rect.top >= 0) return rect.height;
  return Math.max(0, rect.bottom);
}

function offsetForHeader(position: string, layoutHeight: number, inset: number) {
  if (position === "absolute") return layoutHeight;
  if (position === "fixed" || position === "sticky") return inset;
  return 0;
}

export function applyPublicAnnouncementLayout(
  layoutHeight: number,
  viewportInset = layoutHeight
) {
  if (typeof document === "undefined") return;
  const layoutPx = Math.max(0, Math.round(Number(layoutHeight) || 0));
  const insetPx = Math.max(0, Math.round(Number(viewportInset) || 0));
  document.documentElement.style.setProperty(
    ANNOUNCEMENT_HEIGHT_VAR,
    `${layoutPx}px`
  );
  document.documentElement.style.setProperty(
    ANNOUNCEMENT_INSET_VAR,
    `${insetPx}px`
  );
  document.querySelectorAll<HTMLElement>(ROOT_SELECTOR).forEach((root) => {
    root.style.setProperty(ANNOUNCEMENT_HEIGHT_VAR, `${layoutPx}px`);
    root.style.setProperty(ANNOUNCEMENT_INSET_VAR, `${insetPx}px`);
  });

  for (const header of readHeaderElements()) {
    const position = window.getComputedStyle(header).position;
    const px = offsetForHeader(position, layoutPx, insetPx);
    if (px <= 0) {
      if (header.hasAttribute(OFFSET_ATTR)) restoreHeaderTop(header);
      continue;
    }
    rememberHeaderTop(header);
    const base = header.getAttribute(TOP_BASE_ATTR) || "0px";
    header.style.top = `calc(${base} + ${px}px)`;
    header.setAttribute(OFFSET_ATTR, String(px));
  }
}

export function applyPublicAnnouncementHeight(height: number) {
  applyPublicAnnouncementLayout(height, height);
}

export function observePublicAnnouncementLayout(
  bar: HTMLElement | null
): () => void {
  if (typeof window === "undefined") return () => {};
  if (!bar) {
    applyPublicAnnouncementLayout(0, 0);
    return () => {};
  }

  const measure = () => {
    const layoutHeight = bar.getBoundingClientRect().height || bar.offsetHeight || 0;
    applyPublicAnnouncementLayout(layoutHeight, viewportAnnouncementInset(bar));
  };

  measure();
  const observer =
    typeof ResizeObserver === "function"
      ? new ResizeObserver(() => measure())
      : null;
  observer?.observe(bar);
  window.addEventListener("resize", measure);
  window.addEventListener("scroll", measure, { passive: true });
  return () => {
    observer?.disconnect();
    window.removeEventListener("resize", measure);
    window.removeEventListener("scroll", measure);
    applyPublicAnnouncementLayout(0, 0);
  };
}
