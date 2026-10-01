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

/** Restore a history position if a viewport change reset the scroller. Never pin to the bottom from a resize — that jumps the thread while typing or when the keyboard opens. */
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
  if (wasNearBottom) return;
  if (el.scrollTop === 0 && previousScrollTop > 0) {
    el.scrollTop = previousScrollTop;
  }
}
