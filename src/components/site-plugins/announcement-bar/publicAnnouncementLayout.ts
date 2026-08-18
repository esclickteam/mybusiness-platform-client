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
  const found = new Set<HTMLElement>();
  document.querySelectorAll<HTMLElement>(HEADER_SELECTOR).forEach((el) => {
    if (el.closest('[data-bizuply-widget="announcement-bar"]')) return;
    found.add(el);
  });
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

function absoluteOffsetPx(header: HTMLElement, bar: HTMLElement) {
  const parent = (header.offsetParent as HTMLElement | null) || header.parentElement;
  const parentTop = parent ? parent.getBoundingClientRect().top : 0;
  return Math.max(0, Math.round(bar.getBoundingClientRect().bottom - parentTop));
}

function offsetForHeader(
  header: HTMLElement,
  position: string,
  bar: HTMLElement | null,
  layoutHeight: number,
  inset: number
) {
  if (!bar) return 0;
  if (position === "absolute") return absoluteOffsetPx(header, bar);
  if (position === "fixed" || position === "sticky") return inset;
  return 0;
}

function writeCssVars(layoutPx: number, insetPx: number) {
  document.documentElement.style.setProperty(ANNOUNCEMENT_HEIGHT_VAR, `${layoutPx}px`);
  document.documentElement.style.setProperty(ANNOUNCEMENT_INSET_VAR, `${insetPx}px`);
  document.querySelectorAll<HTMLElement>(ROOT_SELECTOR).forEach((root) => {
    root.style.setProperty(ANNOUNCEMENT_HEIGHT_VAR, `${layoutPx}px`);
    root.style.setProperty(ANNOUNCEMENT_INSET_VAR, `${insetPx}px`);
  });
}

export function applyPublicAnnouncementFromBar(bar: HTMLElement | null) {
  if (typeof document === "undefined") return;
  const layoutPx = bar
    ? Math.max(0, Math.round(bar.getBoundingClientRect().height || bar.offsetHeight || 0))
    : 0;
  const insetPx = viewportAnnouncementInset(bar);
  writeCssVars(layoutPx, insetPx);

  for (const header of readHeaderElements()) {
    const position = window.getComputedStyle(header).position;
    const px = offsetForHeader(header, position, bar, layoutPx, insetPx);
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

export function applyPublicAnnouncementLayout(
  layoutHeight: number,
  viewportInset = layoutHeight
) {
  if (typeof document === "undefined") return;
  const layoutPx = Math.max(0, Math.round(Number(layoutHeight) || 0));
  const insetPx = Math.max(0, Math.round(Number(viewportInset) || 0));
  writeCssVars(layoutPx, insetPx);

  for (const header of readHeaderElements()) {
    const position = window.getComputedStyle(header).position;
    const px =
      position === "absolute"
        ? layoutPx
        : position === "fixed" || position === "sticky"
          ? insetPx
          : 0;
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
    applyPublicAnnouncementFromBar(null);
    return () => {};
  }

  const measure = () => applyPublicAnnouncementFromBar(bar);
  measure();
  const resizeObserver =
    typeof ResizeObserver === "function" ? new ResizeObserver(() => measure()) : null;
  resizeObserver?.observe(bar);
  const mutationObserver =
    typeof MutationObserver === "function"
      ? new MutationObserver(() => {
          requestAnimationFrame(measure);
        })
      : null;
  document.querySelectorAll(ROOT_SELECTOR).forEach((root) => {
    mutationObserver?.observe(root, { childList: true, subtree: true });
  });
  if (document.body) {
    mutationObserver?.observe(document.body, { childList: true, subtree: true });
  }
  window.addEventListener("resize", measure);
  window.addEventListener("scroll", measure, { passive: true });
  return () => {
    resizeObserver?.disconnect();
    mutationObserver?.disconnect();
    window.removeEventListener("resize", measure);
    window.removeEventListener("scroll", measure);
  };
}
