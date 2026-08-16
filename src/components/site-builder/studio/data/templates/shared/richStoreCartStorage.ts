export type RichStoreCartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  variantId?: string;
  variantLabel?: string;
  sku?: string;
};

export function richStoreCartKey(businessId: string): string {
  return `bizuply_store_cart_${businessId}`;
}

export function resolveRichStoreCartBusinessId(
  businessId?: string | null,
): string {
  return String(businessId || "").trim();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

export function normalizeRichStoreCartItem(
  raw: unknown,
  index = 0,
): RichStoreCartItem | null {
  const item = asRecord(raw);
  if (!item) return null;

  const name = String(item.name || item.title || "").trim();
  const productId = String(item.productId || "").trim();
  const price = Number(item.price);
  const qty = Math.max(1, Math.floor(Number(item.qty ?? item.quantity) || 0));
  if (!name || !productId || !Number.isFinite(price) || price < 0 || qty < 1) {
    return null;
  }

  const variantId = item.variantId ? String(item.variantId) : undefined;
  const fallbackId = variantId ? `${productId}:${variantId}` : productId;
  const id = String(item.id || fallbackId || `line-${index}`).trim() || fallbackId;

  return {
    id,
    productId,
    name,
    price,
    image: String(item.image || ""),
    qty,
    variantId,
    variantLabel: item.variantLabel ? String(item.variantLabel) : undefined,
    sku: item.sku ? String(item.sku) : undefined,
  };
}

export function normalizeRichStoreCartItems(raw: unknown): RichStoreCartItem[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const items: RichStoreCartItem[] = [];
  raw.forEach((entry, index) => {
    const item = normalizeRichStoreCartItem(entry, index);
    if (!item || seen.has(item.id)) return;
    seen.add(item.id);
    items.push(item);
  });
  return items;
}

export function serializeRichStoreCart(
  items: RichStoreCartItem[],
): Array<Record<string, unknown>> {
  return items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.qty,
    qty: item.qty,
    image: item.image,
    variantId: item.variantId,
    variantLabel: item.variantLabel,
    sku: item.sku,
  }));
}

export function loadRichStoreCart(
  businessId?: string | null,
  storage?: Pick<Storage, "getItem"> | null,
): RichStoreCartItem[] {
  const id = resolveRichStoreCartBusinessId(businessId);
  if (!id) return [];
  const store =
    storage ||
    (typeof window !== "undefined" ? window.localStorage : null);
  if (!store) return [];
  try {
    const raw = store.getItem(richStoreCartKey(id));
    if (!raw) return [];
    return normalizeRichStoreCartItems(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function persistRichStoreCart(
  businessId: string | null | undefined,
  items: RichStoreCartItem[],
  storage?: Pick<Storage, "setItem"> | null,
): boolean {
  const id = resolveRichStoreCartBusinessId(businessId);
  if (!id) return false;
  const store =
    storage ||
    (typeof window !== "undefined" ? window.localStorage : null);
  if (!store) return false;
  try {
    store.setItem(richStoreCartKey(id), JSON.stringify(serializeRichStoreCart(items)));
    return true;
  } catch {
    return false;
  }
}
