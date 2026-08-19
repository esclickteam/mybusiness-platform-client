/**
 * Shared source of truth for the public/editor floating cart overlay.
 * The cart is a store feature — never inject it just because a site has a businessId.
 */

export type StoreCartSiteLike = {
  businessId?: unknown;
  business?: { _id?: unknown } | null;
  enabledPlugins?: unknown;
  templateKey?: unknown;
  templateId?: unknown;
  templateName?: unknown;
  products?: unknown;
  storeProducts?: unknown;
  shopProducts?: unknown;
  data?: Record<string, unknown> | null;
  templateData?: Record<string, unknown> | null;
  visualEditorPayload?: Record<string, unknown> | null;
  pages?: unknown;
};

function readBusinessId(site: StoreCartSiteLike | null | undefined): string {
  return String(site?.businessId || site?.business?._id || "").trim();
}

function readEnabledPlugins(site: StoreCartSiteLike | null | undefined): string[] {
  return Array.isArray(site?.enabledPlugins)
    ? site.enabledPlugins.map((key) => String(key || "").trim()).filter(Boolean)
    : [];
}

function isProductRecord(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  const name = String(item.name || item.title || "").trim();
  if (!name) return false;
  const hasId = Boolean(item._id || item.id || item.productId);
  const price = Number(item.price);
  return hasId || Number.isFinite(price);
}

function arrayHasProducts(value: unknown): boolean {
  return Array.isArray(value) && value.some(isProductRecord);
}

function collectPageProductBuckets(pages: unknown): unknown[] {
  if (!Array.isArray(pages)) return [];
  const buckets: unknown[] = [];
  pages.forEach((page) => {
    if (!page || typeof page !== "object") return;
    const record = page as Record<string, unknown>;
    const data =
      record.data && typeof record.data === "object"
        ? (record.data as Record<string, unknown>)
        : null;
    const visual =
      record.visualEditorPayload && typeof record.visualEditorPayload === "object"
        ? (record.visualEditorPayload as Record<string, unknown>)
        : null;
    buckets.push(
      record.products,
      data?.products,
      data?.storeProducts,
      data?.shopProducts,
      visual?.products,
      visual?.storeProducts,
      visual?.shopProducts
    );
  });
  return buckets;
}

export function isStoreFeatureEnabled(site: StoreCartSiteLike | null | undefined): boolean {
  return readEnabledPlugins(site).includes("store");
}

export function siteHasStoreProductEvidence(
  site: StoreCartSiteLike | null | undefined
): boolean {
  const data = site?.data && typeof site.data === "object" ? site.data : null;
  const templateData =
    site?.templateData && typeof site.templateData === "object"
      ? site.templateData
      : null;
  const visual =
    site?.visualEditorPayload && typeof site.visualEditorPayload === "object"
      ? site.visualEditorPayload
      : null;

  const buckets = [
    site?.products,
    site?.storeProducts,
    site?.shopProducts,
    data?.products,
    data?.storeProducts,
    data?.shopProducts,
    templateData?.products,
    templateData?.storeProducts,
    visual?.products,
    visual?.storeProducts,
    visual?.shopProducts,
    ...collectPageProductBuckets(site?.pages),
  ];

  return buckets.some(arrayHasProducts);
}

export function shouldShowPublicStoreCart(
  site: StoreCartSiteLike | null | undefined
): boolean {
  if (!readBusinessId(site)) return false;
  return isStoreFeatureEnabled(site) || siteHasStoreProductEvidence(site);
}