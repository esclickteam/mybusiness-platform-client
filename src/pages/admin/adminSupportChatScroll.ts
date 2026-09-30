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
  const top = el.scrollHeight;
  if (smooth && typeof el.scrollTo === "function") {
    el.scrollTo({ top, behavior: "smooth" });
    return;
  }
  el.scrollTop = top;
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
  attempts = 12
) {
  let n = 0;
  const tick = () => {
    if (!shouldStick()) return;
    scrollScrollerToBottom(getEl(), false);
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
