type Listener = (active: boolean) => void;

const listeners = new Map<string, Set<Listener>>();
const activated = new Set<string>();
const queue: string[] = [];
const releaseTimers = new Map<string, number>();
let pumping = false;

/**
 * Concurrent live mounts for ~2–3 visible rows. Off-screen cards release
 * quickly so scrolling never leaves the current viewport blank.
 */
const BATCH_SIZE = 8;
const BATCH_DELAY_MS = 10;
const MAX_ACTIVE = 20;
const RELEASE_DELAY_MS = 350;

function normalizeKey(value: string | null | undefined) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function notify(key: string, active: boolean) {
  const set = listeners.get(key);
  if (!set) return;
  set.forEach((listener) => listener(active));
}

function cancelRelease(key: string) {
  const timer = releaseTimers.get(key);
  if (timer == null) return;
  window.clearTimeout(timer);
  releaseTimers.delete(key);
}

function addListener(key: string, listener: Listener) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(listener);
  return () => {
    set?.delete(listener);
    if (set && set.size === 0) {
      listeners.delete(key);
    }
  };
}

/** Drop activated keys that nobody is listening to (e.g. prefetch orphans). */
function evictOrphans() {
  for (const key of [...activated]) {
    const set = listeners.get(key);
    if (!set || set.size === 0) {
      activated.delete(key);
    }
  }
}

function pump() {
  if (pumping) return;
  pumping = true;

  const step = () => {
    if (!queue.length) {
      pumping = false;
      return;
    }

    evictOrphans();

    if (activated.size >= MAX_ACTIVE) {
      // Viewport cards steal slots via prioritizeGalleryPreview; just wait.
      window.setTimeout(step, 60);
      return;
    }

    let activatedThisTick = 0;
    while (
      queue.length &&
      activated.size < MAX_ACTIVE &&
      activatedThisTick < BATCH_SIZE
    ) {
      const key = queue.shift();
      if (!key || activated.has(key)) continue;
      cancelRelease(key);
      activated.add(key);
      notify(key, true);
      activatedThisTick += 1;
    }

    if (queue.length) {
      window.setTimeout(step, BATCH_DELAY_MS);
    } else {
      pumping = false;
    }
  };

  step();
}

/**
 * Schedule a gallery card preview mount (viewport / preload callers).
 */
export function scheduleGalleryPreview(
  keyValue: string | null | undefined,
  options?: { priority?: boolean },
) {
  const key = normalizeKey(keyValue);
  if (!key) return () => undefined;

  cancelRelease(key);

  if (!activated.has(key)) {
    if (!queue.includes(key)) {
      if (options?.priority) queue.unshift(key);
      else queue.push(key);
      pump();
    } else if (options?.priority) {
      const idx = queue.indexOf(key);
      if (idx > 0) {
        queue.splice(idx, 1);
        queue.unshift(key);
        pump();
      }
    }
  }

  return (listener: Listener) => {
    const remove = addListener(key, listener);

    if (activated.has(key)) {
      listener(true);
    }

    return () => {
      remove();
    };
  };
}

/** Force-activate a card immediately (hover / visible viewport). */
export function prioritizeGalleryPreview(keyValue: string | null | undefined) {
  const key = normalizeKey(keyValue);
  if (!key) return;

  cancelRelease(key);

  if (activated.has(key)) {
    notify(key, true);
    return;
  }

  while (activated.size >= MAX_ACTIVE) {
    const oldest = activated.values().next().value as string | undefined;
    if (!oldest || oldest === key) break;
    activated.delete(oldest);
    notify(oldest, false);
  }

  const idx = queue.indexOf(key);
  if (idx >= 0) queue.splice(idx, 1);
  activated.add(key);
  notify(key, true);
  pump();
}

/** Release a card after a short delay so tiny scroll jitter stays warm. */
export function releaseGalleryPreview(keyValue: string | null | undefined) {
  const key = normalizeKey(keyValue);
  if (!key || !activated.has(key)) return;

  cancelRelease(key);
  const timer = window.setTimeout(() => {
    releaseTimers.delete(key);
    if (!activated.has(key)) return;
    activated.delete(key);
    notify(key, false);
    if (queue.length) pump();
  }, RELEASE_DELAY_MS);
  releaseTimers.set(key, timer);
}

/**
 * Queue keys for warm-up ahead of scroll.
 */
export function prefetchGalleryPreviewKeys(
  keys: Array<string | null | undefined>,
  options?: { limit?: number; priority?: boolean },
) {
  const limit = Math.max(1, Number(options?.limit) || MAX_ACTIVE);
  keys.slice(0, limit).forEach((key, index) => {
    scheduleGalleryPreview(key, {
      priority: Boolean(options?.priority) && index < 8,
    });
  });
}

/** @deprecated use scheduleGalleryPreview */
export const scheduleTemplatePreview = scheduleGalleryPreview;
/** @deprecated use prefetchGalleryPreviewKeys */
export const prefetchTemplatePreviewKeys = prefetchGalleryPreviewKeys;

export function isGalleryPreviewActivated(keyValue: string | null | undefined) {
  return activated.has(normalizeKey(keyValue));
}

export const GALLERY_PREVIEW_MAX_ACTIVE = MAX_ACTIVE;
