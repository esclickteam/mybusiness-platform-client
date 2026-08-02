/**
 * Shared store pricing helpers for public catalog / checkout.
 * salePrice of 0 or negative means "no sale" (same as empty/null).
 */

export function resolveStoreUnitPrice(input: {
  price?: number | null;
  salePrice?: number | null;
  compareAtPrice?: number | null;
}): { price: number; compareAtPrice?: number; onSale: boolean } {
  const regular = Number(input.price ?? 0);
  const saleRaw = input.salePrice;
  const sale =
    saleRaw === null || saleRaw === undefined || saleRaw === ("" as any)
      ? NaN
      : Number(saleRaw);

  const onSale =
    Number.isFinite(sale) &&
    sale > 0 &&
    (regular <= 0 || sale < regular);

  const price = onSale ? sale : Number.isFinite(regular) ? regular : 0;
  const compareAt = onSale
    ? regular
    : Number(input.compareAtPrice || 0);

  return {
    price: Number.isFinite(price) ? price : 0,
    compareAtPrice: compareAt > price ? compareAt : undefined,
    onSale,
  };
}

export function resolveStoreVariantPrice(variant: {
  price?: number | null;
  salePrice?: number | null;
}): number | undefined {
  const sale = Number(variant.salePrice);
  if (Number.isFinite(sale) && sale > 0) return sale;

  const price = Number(variant.price);
  if (Number.isFinite(price)) return price;

  return undefined;
}

export function resolveStoreShippingPrice(input: {
  itemCount: number;
  subtotal: number;
  defaultShippingPrice?: number | null;
  freeShippingFrom?: number | null;
}): number {
  if (!input.itemCount) return 0;

  const freeFrom = Number(input.freeShippingFrom);
  if (Number.isFinite(freeFrom) && freeFrom > 0 && input.subtotal >= freeFrom) {
    return 0;
  }

  const shipping = Number(input.defaultShippingPrice);
  return Number.isFinite(shipping) && shipping > 0 ? shipping : 0;
}
