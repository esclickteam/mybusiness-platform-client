import React, { useEffect, useMemo, useState } from "react";

import {
  getPublicShop,
  type PublicStoreProduct,
} from "../../../api/publicStoreApi";
import { resolveStoreUnitPrice } from "../../../utils/storePricing";

function formatMoney(amount: number, currency = "ILS") {
  try {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: currency || "ILS",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

function productImage(product: PublicStoreProduct) {
  return String(
    product.mainImage ||
      product.image ||
      (Array.isArray(product.images) ? product.images[0] : "") ||
      ""
  ).trim();
}

function isStoreCatalogPath(pathname?: string) {
  const path = String(pathname || (typeof window !== "undefined" ? window.location.pathname : "") || "")
    .split("?")[0]
    .replace(/\/+$/, "")
    .toLowerCase();
  return path === "/store" || path === "/shop" || path.endsWith("/store") || path.endsWith("/shop");
}

export default function PublicStoreCatalogGrid({
  businessId,
  enabled = true,
}: {
  businessId: string;
  enabled?: boolean;
}) {
  const [products, setProducts] = useState<PublicStoreProduct[]>([]);
  const [currency, setCurrency] = useState("ILS");
  const [selected, setSelected] = useState<PublicStoreProduct | null>(null);
  const visible = useMemo(
    () => Boolean(enabled && businessId && isStoreCatalogPath()),
    [enabled, businessId]
  );

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    getPublicShop(businessId)
      .then((data) => {
        if (cancelled) return;
        setCurrency(String(data?.settings?.currency || "ILS"));
        setProducts(Array.isArray(data?.products) ? data.products : []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [businessId, visible]);

  if (!visible) return null;

  const shown = selected || null;

  return (
    <section
      data-bizuply-widget="store-catalog"
      data-bizuply-plugin="store"
      data-bizuply-plugin-runtime="true"
      data-bizuply-block="products"
      className="relative z-[40] mx-auto my-8 max-w-6xl px-4"
      dir="rtl"
    >
      {shown ? (
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <button
            type="button"
            className="mb-4 text-sm font-bold text-slate-500"
            onClick={() => setSelected(null)}
          >
            חזרה לחנות
          </button>
          {productImage(shown) ? (
            <img
              src={productImage(shown)}
              alt={shown.name}
              className="mb-4 h-64 w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="mb-4 flex h-40 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              {shown.name}
            </div>
          )}
          <h1 className="text-3xl font-black text-slate-900">{shown.name}</h1>
          <p className="mt-2 text-xl font-black text-violet-700">
            {formatMoney(resolveStoreUnitPrice(shown).price, currency)}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {shown.shortDescription || shown.description || ""}
          </p>
          <button
            type="button"
            data-bizuply-add-to-cart={shown._id}
            data-product-id={shown._id}
            className="mt-5 rounded-full bg-slate-900 px-6 py-3 text-sm font-black text-white"
          >
            הוספה לסל
          </button>
        </article>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product._id}
              className="flex flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <button type="button" onClick={() => setSelected(product)} className="text-right">
                {productImage(product) ? (
                  <img
                    src={productImage(product)}
                    alt={product.name}
                    className="h-44 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    {product.name}
                  </div>
                )}
                <h2 className="mt-4 text-xl font-black text-slate-900">{product.name}</h2>
                <p className="mt-2 text-lg font-black text-violet-700">
                  {formatMoney(resolveStoreUnitPrice(product).price, currency)}
                </p>
              </button>
              <button
                type="button"
                data-bizuply-add-to-cart={product._id}
                data-product-id={product._id}
                className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-black text-white"
              >
                הוספה לסל
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
