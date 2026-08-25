const NEAR_BOTTOM_PX = 72;

export function isNearBottom(
  el: Pick<HTMLElement, "scrollHeight" | "scrollTop" | "clientHeight"> | null,
  thresholdPx = NEAR_BOTTOM_PX
) {
  if (!el) return true;
  return el.scrollHeight - el.scrollTop - el.clientHeight < thresholdPx;
}

export function scrollScrollerToBottom(
  el: HTMLElement | null,
  smooth = false
) {
  if (!el) return;
  const top = el.scrollHeight;
  if (smooth && typeof el.scrollTo === "function") {
    el.scrollTo({ top, behavior: "smooth" });
    return;
  }
  el.scrollTop = top;
}

export function preserveScrollerOnResize(
  el: HTMLElement,
  {
    wasNearBottom,
    previousScrollTop,
  }: {
    wasNearBottom: boolean;
    previousScrollTop: number;
  }
) {
  if (wasNearBottom) {
    scrollScrollerToBottom(el, false);
    return;
  }
  if (el.scrollTop === 0 && previousScrollTop > 0) {
    el.scrollTop = previousScrollTop;
  }
}
