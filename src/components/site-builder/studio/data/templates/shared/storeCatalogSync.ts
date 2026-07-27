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
  return /^(products|categories)\.\d+\.image$/.test(String(key || "").trim());
}

export function stripStoreBoundVisualImageOverrides(
  data: Record<string, any> | null | undefined,
) {
  if (!data || typeof data !== "object") return data;
  const content = data.__content;
  if (!content || typeof content !== "object") return data;

  let changed = false;
  const nextContent: Record<string, any> = { ...content };
  Object.keys(nextContent).forEach((key) => {
    if (!isStoreBoundVisualContentKey(key)) return;
    delete nextContent[key];
    changed = true;
  });

  if (!changed) return data;
  return {
    ...data,
    __content: nextContent,
  };
}
