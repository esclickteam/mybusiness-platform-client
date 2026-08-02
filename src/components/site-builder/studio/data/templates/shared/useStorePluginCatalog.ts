import { useEffect, useMemo, useRef, useState } from "react";

import {
  getPublicShop,
  type PublicStoreCategory,
  type PublicStoreProduct,
} from "../../../../../../api/publicStoreApi";
import {
  resolveStoreUnitPrice,
  resolveStoreVariantPrice,
} from "../../../../../../utils/storePricing";
import { subscribeStoreCatalogChanged } from "./storeCatalogSync";

export type StoreCatalogVariant = {
  id: string;
  optionName: string;
  optionValue: string;
  label: string;
  price?: number;
  sku?: string;
  stock: number;
};

export type StoreCatalogProduct = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  shortDescription: string;
  category: string;
  categorySlug: string;
  badge?: string;
  href: string;
  featured?: boolean;
  tags: string[];
  sku?: string;
  stock: number;
  trackStock: boolean;
  allowBackorder: boolean;
  inStock: boolean;
  variants: StoreCatalogVariant[];
};

export type StoreCatalogCategory = {
  id: string;
  name: string;
  slug: string;
  image?: string;
};

export type DemoStoreProductSeed = {
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  shortDescription?: string;
  category: string;
  badge?: string;
  featured?: boolean;
};

function slugify(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0590-\u05FF-]+/g, "")
    .replace(/-+/g, "-");
}

function productImage(product: PublicStoreProduct) {
  return String(
    product.mainImage ||
      product.image ||
      (Array.isArray(product.images) ? product.images[0] : "") ||
      "",
  ).trim();
}

function categoryLabel(product: PublicStoreProduct) {
  if (product.categoryName) return String(product.categoryName);
  if (product.categoryId && typeof product.categoryId === "object") {
    return String(product.categoryId.name || "כללי");
  }
  return "כללי";
}

function categorySlugOf(product: PublicStoreProduct) {
  if (product.categoryId && typeof product.categoryId === "object") {
    return String(product.categoryId.slug || slugify(product.categoryId.name || "all"));
  }
  return slugify(categoryLabel(product));
}

function mapApiProduct(product: PublicStoreProduct): StoreCatalogProduct {
  const { price, compareAtPrice } = resolveStoreUnitPrice(product);
  const trackStock = product.trackStock !== false;
  const allowBackorder = Boolean(product.allowBackorder);
  const variants = (Array.isArray(product.variants) ? product.variants : [])
    .map((variant) => {
      const optionName = String(variant.optionName || "").trim();
      const optionValue = String(variant.optionValue || "").trim();
      const label = [optionName, optionValue].filter(Boolean).join(" / ");
      const variantPrice = resolveStoreVariantPrice(variant);
      return {
        id: String(variant._id || ""),
        optionName,
        optionValue,
        label,
        price: Number.isFinite(variantPrice as number)
          ? (variantPrice as number)
          : undefined,
        sku: variant.sku ? String(variant.sku) : undefined,
        stock: Math.max(0, Number(variant.stock || 0)),
      };
    })
    .filter((variant) => variant.id || variant.label);

  const stock =
    variants.length > 0
      ? variants.reduce((sum, variant) => sum + variant.stock, 0)
      : Math.max(0, Number(product.stock || 0));

  const inStock =
    !trackStock ||
    allowBackorder ||
    (product.status !== "out_of_stock" && stock > 0);

  return {
    id: String(product._id),
    name: String(product.name || "מוצר"),
    price,
    compareAtPrice,
    image: productImage(product),
    shortDescription: String(product.shortDescription || product.description || ""),
    category: categoryLabel(product),
    categorySlug: categorySlugOf(product),
    badge: !inStock
      ? "אזל"
      : product.isFeatured
        ? "נבחר"
        : stock > 0 && stock <= 3 && trackStock
          ? "מלאי נמוך"
          : undefined,
    href: product.slug ? `/product/${product.slug}` : "/product",
    featured: Boolean(product.isFeatured),
    tags: Array.isArray(product.tags) ? product.tags.map(String) : [],
    sku: product.sku ? String(product.sku) : undefined,
    stock,
    trackStock,
    allowBackorder,
    inStock,
    variants,
  };
}

function mapApiCategory(category: PublicStoreCategory): StoreCatalogCategory {
  return {
    id: String(category._id),
    name: String(category.name || "קטגוריה"),
    slug: String(category.slug || slugify(category.name || "category")),
    image: category.image ? String(category.image) : undefined,
  };
}

function buildDemoCatalog(seeds: DemoStoreProductSeed[]): {
  products: StoreCatalogProduct[];
  categories: StoreCatalogCategory[];
} {
  const products = seeds.map((seed, index) => ({
    id: `demo-${slugify(seed.category)}-${index + 1}`,
    name: seed.name,
    price: seed.price,
    compareAtPrice: seed.compareAtPrice,
    image: seed.image,
    shortDescription: seed.shortDescription || "",
    category: seed.category,
    categorySlug: slugify(seed.category),
    badge: seed.badge,
    href: "/product",
    featured: Boolean(seed.featured),
    tags: [],
    stock: 99,
    trackStock: false,
    allowBackorder: true,
    inStock: true,
    variants: [] as StoreCatalogVariant[],
  }));

  const categoryMap = new Map<string, StoreCatalogCategory>();
  for (const product of products) {
    if (!categoryMap.has(product.categorySlug)) {
      categoryMap.set(product.categorySlug, {
        id: product.categorySlug,
        name: product.category,
        slug: product.categorySlug,
        image: product.image,
      });
    }
  }

  return {
    products,
    categories: Array.from(categoryMap.values()),
  };
}

function resolveBusinessId(explicit?: string | null) {
  const fromProp = String(explicit || "").trim();
  if (fromProp) return fromProp;
  return "";
}

const EMPTY_DEMO_PRODUCTS: DemoStoreProductSeed[] = [];

/**
 * Loads products + categories from the Bizuply store plugin (`/store/:id/shop`).
 *
 * Site-scoped only: fetch ONLY when an explicit `businessId` prop is passed
 * (site editor / published site). Never infer from `/business/:id/...` URL or DOM —
 * that leaked live shop products into shared template gallery/preview.
 *
 * Behavior:
 * - No businessId / studio static → template demo seeds (preview)
 * - businessId + fetching → empty catalog (no demo→live card flash)
 * - businessId + live products → live catalog
 * - businessId + empty store / error → template demos after resolve
 */
export function useStorePluginCatalog(options: {
  businessId?: string | null;
  demoProducts?: DemoStoreProductSeed[];
  enabled?: boolean;
}) {
  const businessId = resolveBusinessId(options.businessId);

  const demoSeeds = options.demoProducts;
  const demo = useMemo(
    () => buildDemoCatalog(demoSeeds || EMPTY_DEMO_PRODUCTS),
    [demoSeeds],
  );

  const shouldFetch =
    options.enabled !== false && Boolean(businessId);

  // When a live shop will load, start empty — painting demos first caused every
  // store template to flash demo cards then swap to seeded/live products.
  const [products, setProducts] = useState<StoreCatalogProduct[]>(() =>
    shouldFetch ? [] : demo.products,
  );
  const [categories, setCategories] = useState<StoreCatalogCategory[]>(() =>
    shouldFetch ? [] : demo.categories,
  );
  const [loading, setLoading] = useState(shouldFetch);
  const [fromPlugin, setFromPlugin] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [currency, setCurrency] = useState("ILS");
  const [defaultShippingPrice, setDefaultShippingPrice] = useState(0);
  const [freeShippingFrom, setFreeShippingFrom] = useState<number | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const fromPluginRef = useRef(false);

  useEffect(() => {
    fromPluginRef.current = fromPlugin;
  }, [fromPlugin]);

  useEffect(() => {
    // Demo/template previews have no businessId — ignore live store mutations.
    if (!businessId) return;
    return subscribeStoreCatalogChanged((detail) => {
      const changedId = String(detail.businessId || "").trim();
      if (changedId && changedId !== businessId) return;
      setRefreshToken((value) => value + 1);
    });
  }, [businessId]);

  useEffect(() => {
    let cancelled = false;

    if (options.enabled === false || !businessId) {
      setProducts(demo.products);
      setCategories(demo.categories);
      setFromPlugin(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Clear demos/placeholders before the first live resolve. Keep the current
    // live catalog visible while a refresh is in flight.
    if (!fromPluginRef.current) {
      setProducts([]);
      setCategories([]);
    }

    getPublicShop(businessId)
      .then((shop) => {
        if (cancelled) return;
        const apiProducts = Array.isArray(shop.products)
          ? shop.products.map(mapApiProduct)
          : [];
        const apiCategories = Array.isArray(shop.categories)
          ? shop.categories.map(mapApiCategory)
          : [];

        setStoreName(String(shop.settings?.storeName || ""));
        setCurrency(String(shop.settings?.currency || "ILS"));
        setDefaultShippingPrice(
          Number(shop.settings?.defaultShippingPrice ?? 0) || 0,
        );
        const freeFromRaw = shop.settings?.freeShippingFrom;
        const freeFromNum = Number(freeFromRaw);
        setFreeShippingFrom(
          freeFromRaw == null ||
            !Number.isFinite(freeFromNum) ||
            freeFromNum <= 0
            ? null
            : freeFromNum,
        );

        // Empty store → demos only after resolve (never as a pre-live flash).
        if (apiProducts.length === 0) {
          setProducts(demo.products);
          setCategories(demo.categories);
          setFromPlugin(false);
          return;
        }

        setProducts(apiProducts);
        setCategories(
          apiCategories.length > 0
            ? apiCategories
            : buildDemoCatalog(
                apiProducts.map((p) => ({
                  name: p.name,
                  price: p.price,
                  image: p.image,
                  category: p.category,
                })),
              ).categories,
        );
        setFromPlugin(true);
      })
      .catch(() => {
        if (cancelled) return;
        // Network error → demos after resolve, never wipe a live catalog mid-refresh.
        if (!fromPluginRef.current) {
          setProducts(demo.products);
          setCategories(demo.categories);
          setFromPlugin(false);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    businessId,
    demo.categories,
    demo.products,
    options.enabled,
    refreshToken,
  ]);

  return {
    businessId,
    products,
    categories,
    loading,
    fromPlugin,
    storeName,
    currency,
    defaultShippingPrice,
    freeShippingFrom,
    demoFallback: !fromPlugin,
  };
}

export function formatStorePrice(price: number, currency = "ILS") {
  try {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: currency || "ILS",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  } catch {
    return `₪${Number(price || 0).toLocaleString("he-IL")}`;
  }
}
