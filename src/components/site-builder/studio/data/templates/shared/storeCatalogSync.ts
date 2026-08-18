const STORE_CATALOG_CHANGED_EVENT = "bizuply:store-catalog-changed";

export type StoreCatalogChangedDetail = {
  businessId?: string;
};

export function emitStoreCatalogChanged(businessId?: string | null) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<StoreCatalogChangedDetail>(STORE_CATALOG_CHANGED_EVENT, {
      detail: {
        businessId: String(businessId || "").trim() || undefined,
      },
    }),
  );
}

export function subscribeStoreCatalogChanged(
  listener: (detail: StoreCatalogChangedDetail) => void,
) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<StoreCatalogChangedDetail>).detail || {};
    listener(detail);
  };

  window.addEventListener(STORE_CATALOG_CHANGED_EVENT, handler);
  return () => {
    window.removeEventListener(STORE_CATALOG_CHANGED_EVENT, handler);
  };
}

/** Visual content keys that mirror live store fields — never persist into site/template data. */
export function isStoreBoundVisualContentKey(key: string) {
  const normalized = String(key || "").trim();
  if (!normalized) return false;
  return (
    /^products\.\d+\.(image|name|price|tag|card|title|text|description)$/.test(
      normalized,
    ) ||
    /^categories\.\d+\.(image|name|title)$/.test(normalized) ||
    /(?:^|\.)(?:shop\.)?products\.\d+\.(image|name|price|tag|card|title|text|description)$/.test(
      normalized,
    ) ||
    /(?:^|\.)(?:hero\.)?products\.\d+\.(image|name|price|tag|card|title)$/.test(
      normalized,
    )
  );
}

/**
 * Auto-stamped DOM-path ids from registerAllVisualElements.
 * Store pages mint thousands of these (gallery/product nodes) and
 * harvesting them is what blew D_SAVE to ~1.1MB / 10s+.
 */
export function isAutoHarvestedVisualContentKey(key: string) {
  const normalized = String(key || "").trim();
  if (!normalized) return false;
  if (isStoreBoundVisualContentKey(normalized)) return true;
  if (/\.html-id\./.test(normalized)) return true;
  if (
    /\.(img|div|span|p|a|button|h[1-6]|section|nav|header|footer|ul|li|article|picture|video|source)\./i.test(
      normalized,
    )
  ) {
    return true;
  }
  return normalized.split(".").filter(Boolean).length >= 5;
}

const VISUAL_MAPS_TO_PRUNE = [
  "__content",
  "__styles",
  "__animations",
  "__layout",
  "__attributes",
  "__responsive",
  "__hiddenElements",
  "__deletedElements",
  "__lockedElements",
];

function pruneHarvestedKeysFromMap(map: Record<string, any> | null | undefined) {
  if (!map || typeof map !== "object" || Array.isArray(map)) return map;
  const next: Record<string, any> = {};
  let dropped = 0;
  Object.keys(map).forEach((key) => {
    if (
      isStoreBoundVisualContentKey(key) ||
      isAutoHarvestedVisualContentKey(key)
    ) {
      dropped += 1;
      return;
    }
    next[key] = map[key];
  });
  return dropped ? next : map;
}

/**
 * Drop auto-stamped DOM-path maps before structuredClone/normalize.
 * Store canvases can hold thousands of these in memory after load;
 * cloning them is what burned ~10s before D_SAVE's PUT.
 */
export function pruneAutoHarvestedVisualMaps(
  data: Record<string, any> | null | undefined,
) {
  if (!data || typeof data !== "object") return data || {};

  const next: Record<string, any> = { ...data };
  let changed = false;

  VISUAL_MAPS_TO_PRUNE.forEach((mapKey) => {
    const pruned = pruneHarvestedKeysFromMap(next[mapKey]);
    if (pruned !== next[mapKey]) {
      next[mapKey] = pruned;
      changed = true;
    }
  });

  const chrome = next.__sharedChrome;
  if (chrome && typeof chrome === "object") {
    const nextChrome: Record<string, any> = { ...chrome };
    let chromeChanged = false;
    VISUAL_MAPS_TO_PRUNE.forEach((mapKey) => {
      const pruned = pruneHarvestedKeysFromMap(nextChrome[mapKey]);
      if (pruned !== nextChrome[mapKey]) {
        nextChrome[mapKey] = pruned;
        chromeChanged = true;
      }
    });
    if (chromeChanged) {
      next.__sharedChrome = nextChrome;
      changed = true;
    }
  }

  if (Array.isArray(next.products)) {
    delete next.products;
    changed = true;
  }

  return changed ? next : data;
}

export function stripStoreBoundVisualImageOverrides(
  data: Record<string, any> | null | undefined,
) {
  if (!data || typeof data !== "object") return data;

  let changed = false;
  const next: Record<string, any> = { ...data };

  const content = data.__content;
  if (content && typeof content === "object") {
    const nextContent: Record<string, any> = { ...content };
    Object.keys(nextContent).forEach((key) => {
      if (
        !isStoreBoundVisualContentKey(key) &&
        !isAutoHarvestedVisualContentKey(key)
      ) {
        return;
      }
      delete nextContent[key];
      changed = true;
    });
    if (changed) next.__content = nextContent;
  }

  // Drop baked-in product arrays so the live store catalog wins on refresh.
  if (Array.isArray(next.products)) {
    delete next.products;
    changed = true;
  }

  return changed ? next : data;
}
