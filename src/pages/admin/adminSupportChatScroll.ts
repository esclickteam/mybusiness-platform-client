const NEAR_BOTTOM_PX = 140;

export function isNearBottom(
  el: Pick<HTMLElement, "scrollHeight" | "scrollTop" | "clientHeight"> | null,
  thresholdPx = NEAR_BOTTOM_PX
) {
  if (!el) return true;
  return el.scrollHeight - el.scrollTop - el.clientHeight < thresholdPx;
}

export function isNearTop(
  el: Pick<HTMLElement, "scrollTop"> | null,
  thresholdPx = 80
) {
  if (!el) return false;
  return el.scrollTop < thresholdPx;
}

export function scrollScrollerToBottom(el: HTMLElement | null, smooth = false) {
  if (!el) return;
  const top = Math.max(0, el.scrollHeight - el.clientHeight);
  if (smooth && typeof el.scrollTo === "function") {
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    return;
  }
  el.scrollTop = el.scrollHeight;
}

/** Pin the thread scroller to a dedicated bottom anchor above the composer. */
export function pinThreadToBottom(
  scroller: HTMLElement | null,
  anchor: HTMLElement | null,
  smooth = false
) {
  if (anchor && typeof anchor.scrollIntoView === "function") {
    try {
      anchor.scrollIntoView({
        block: "end",
        inline: "nearest",
        behavior: smooth ? "smooth" : "auto",
      });
    } catch {
      /* jsdom / older browsers */
    }
  }
  scrollScrollerToBottom(scroller, smooth);
}

export function preserveScrollAfterPrepend(
  el: HTMLElement | null,
  previousHeight: number,
  previousTop: number
) {
  if (!el) return;
  el.scrollTop = el.scrollHeight - previousHeight + previousTop;
}

/** Scroll after bubbles have laid out so we don't stop above the last message. */
export function scheduleScrollToBottomAfterLayout(
  getEl: () => HTMLElement | null,
  shouldStick: () => boolean,
  attempts = 16,
  getAnchor?: () => HTMLElement | null
) {
  let n = 0;
  const tick = () => {
    if (!shouldStick()) return;
    pinThreadToBottom(getEl(), getAnchor ? getAnchor() : null, false);
    n += 1;
    if (n < attempts) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function previewWhatsAppTemplateBody(
  body: string,
  vars: Record<string, string>
) {
  let out = String(body || "");
  for (const [key, value] of Object.entries(vars || {})) {
    if (!key) continue;
    out = out.split(`{{${key}}}`).join(value ?? "");
  }
  return out;
}
