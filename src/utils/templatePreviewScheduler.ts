type Listener = (active: boolean) => void;

const listeners = new Map<string, Set<Listener>>();
const activated = new Set<string>();
const queue: string[] = [];
let pumping = false;

/** Keep gallery light, but never drop visible cards forever. */
const BATCH_SIZE = 3;
const BATCH_DELAY_MS = 40;
const MAX_ACTIVE = 12;

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
    if (!queue.length) {
      pumping = false;
      return;
    }

    if (activated.size >= MAX_ACTIVE) {
      // Wait for a slot — do NOT drop queued cards.
      window.setTimeout(step, 120);
      return;
    }

    const batch = queue.splice(0, BATCH_SIZE);
    for (const key of batch) {
      if (activated.has(key)) continue;
      if (activated.size >= MAX_ACTIVE) {
        queue.unshift(key, ...batch.slice(batch.indexOf(key) + 1));
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
export function scheduleGalleryPreview(
  keyValue: string | null | undefined,
  options?: { priority?: boolean },
) {
  const key = normalizeKey(keyValue);
  if (!key) return () => undefined;

  if (activated.has(key)) {
    return (listener: Listener) => {
      listener(true);
      return () => undefined;
    };
  }

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

/** Force-activate a card immediately (e.g. on hover). */
export function prioritizeGalleryPreview(keyValue: string | null | undefined) {
  const key = normalizeKey(keyValue);
  if (!key) return;

  if (activated.has(key)) {
    notify(key, true);
    return;
  }

  // Free one slot if needed so hover always wins.
  if (activated.size >= MAX_ACTIVE) {
    const oldest = activated.values().next().value as string | undefined;
    if (oldest && oldest !== key) {
      activated.delete(oldest);
      notify(oldest, false);
    }
  }

  const idx = queue.indexOf(key);
  if (idx >= 0) queue.splice(idx, 1);
  activated.add(key);
  notify(key, true);
  pump();
}

/** Release a card when it leaves the viewport so other cards can mount. */
export function releaseGalleryPreview(keyValue: string | null | undefined) {
  const key = normalizeKey(keyValue);
  if (!key || !activated.has(key)) return;
  activated.delete(key);
  notify(key, false);
  // Freeing a slot — continue the queue.
  if (queue.length) pump();
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
