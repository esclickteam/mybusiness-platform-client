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

/** Visual content keys that mirror live store fields and must not block refresh. */
export function isStoreBoundVisualContentKey(key: string) {
  const normalized = String(key || "").trim();
  return (
    /^products\.\d+\.(image|name|price|tag|card)$/.test(normalized) ||
    /^categories\.\d+\.image$/.test(normalized)
  );
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
      if (!isStoreBoundVisualContentKey(key)) return;
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
