type Listener = (active: boolean) => void;

const listeners = new Map<string, Set<Listener>>();
const activated = new Set<string>();
const queue: string[] = [];
let pumping = false;

/** Keep gallery light: only a few live cards at once. */
const BATCH_SIZE = 2;
const BATCH_DELAY_MS = 48;
const MAX_ACTIVE = 8;

function normalizeKey(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

function notify(key: string, active: boolean) {
  const set = listeners.get(key);
  if (!set) return;
  set.forEach((listener) => listener(active));
}

function pump() {
  if (pumping) return;
  pumping = true;

  const step = () => {
    while (activated.size >= MAX_ACTIVE && queue.length) {
      // Drop oldest queued keys that are not yet active — IO will re-request.
      queue.shift();
    }

    if (!queue.length) {
      pumping = false;
      return;
    }

    const batch = queue.splice(0, BATCH_SIZE);
    for (const key of batch) {
      if (activated.has(key)) continue;
      if (activated.size >= MAX_ACTIVE) {
        queue.unshift(key);
        break;
      }
      activated.add(key);
      notify(key, true);
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
 * Schedule a gallery card preview mount (viewport-driven callers).
 */
export function scheduleGalleryPreview(keyValue: string | null | undefined) {
  const key = normalizeKey(keyValue);
  if (!key) return () => undefined;

  if (activated.has(key)) {
    return (listener: Listener) => {
      listener(true);
      return () => undefined;
    };
  }

  if (!queue.includes(key)) {
    queue.push(key);
    pump();
  }

  return (listener: Listener) => {
    let set = listeners.get(key);
    if (!set) {
      set = new Set();
      listeners.set(key, set);
    }
    set.add(listener);

    if (activated.has(key)) {
      listener(true);
    }

    return () => {
      set?.delete(listener);
      if (set && set.size === 0) {
        listeners.delete(key);
      }
    };
  };
}

/** Release a card when it leaves the viewport so other cards can mount. */
export function releaseGalleryPreview(keyValue: string | null | undefined) {
  const key = normalizeKey(keyValue);
  if (!key || !activated.has(key)) return;
  activated.delete(key);
  notify(key, false);
}

export function prefetchGalleryPreviewKeys(
  keys: Array<string | null | undefined>,
) {
  keys.slice(0, MAX_ACTIVE).forEach((key) => {
    scheduleGalleryPreview(key);
  });
}

/** @deprecated use scheduleGalleryPreview */
export const scheduleTemplatePreview = scheduleGalleryPreview;
/** @deprecated use prefetchGalleryPreviewKeys */
export const prefetchTemplatePreviewKeys = prefetchGalleryPreviewKeys;

export function isGalleryPreviewActivated(keyValue: string | null | undefined) {
  return activated.has(normalizeKey(keyValue));
}
