type Listener = (active: boolean) => void;

const listeners = new Map<string, Set<Listener>>();
const activated = new Set<string>();
const queue: string[] = [];
let pumping = false;

const BATCH_SIZE = 4;
const BATCH_DELAY_MS = 24;

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

    const batch = queue.splice(0, BATCH_SIZE);
    for (const key of batch) {
      if (activated.has(key)) continue;
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
 * Webflow-style gallery loading: schedule ALL template previews to mount in
 * quick batches on page open (not only when the user scrolls to them).
 */
export function scheduleTemplatePreview(templateKey: string | null | undefined) {
  const key = normalizeKey(templateKey);
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

export function prefetchTemplatePreviewKeys(keys: Array<string | null | undefined>) {
  keys.forEach((key) => {
    scheduleTemplatePreview(key);
  });
}

export function isTemplatePreviewActivated(templateKey: string | null | undefined) {
  return activated.has(normalizeKey(templateKey));
}
