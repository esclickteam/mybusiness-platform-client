/**
 * Ensures only one marketing live-template preview mounts at a time.
 * Prevents mobile scroll jank when heavy templates (e.g. Velmora) mount together.
 */

type Listener = (activeId: string | null) => void;

const ratios = new Map<string, number>();
const listeners = new Set<Listener>();
let activeId: string | null = null;

function pickBest(): string | null {
  let bestId: string | null = null;
  let bestRatio = 0;
  for (const [id, ratio] of ratios) {
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestId = id;
    }
  }
  return bestId;
}

function publish() {
  const next = pickBest();
  if (next === activeId) return;
  activeId = next;
  listeners.forEach((listener) => listener(activeId));
}

export function reportPreviewVisibility(
  id: string,
  ratio: number,
  intersecting: boolean,
) {
  if (!intersecting || ratio <= 0) {
    ratios.delete(id);
  } else {
    ratios.set(id, ratio);
  }
  publish();
}

export function subscribePreviewMount(listener: Listener) {
  listeners.add(listener);
  listener(activeId);
  return () => {
    listeners.delete(listener);
  };
}

export function getActivePreviewId() {
  return activeId;
}
