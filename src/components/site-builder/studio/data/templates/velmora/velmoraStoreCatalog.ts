import type {
  DemoStoreProductSeed,
  StoreCatalogCategory,
  StoreCatalogProduct,
} from "../shared/useStorePluginCatalog";

export type VelmoraShopProduct = {
  id: string;
  ref: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  colors: string[];
  description?: string;
  sku?: string;
  inStock?: boolean;
};

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=90",
];

const DEMO_NAMES = [
  ["שמלת LUNA", "שמלות"],
  ["שמלת NOA", "שמלות"],
  ["שמלת ערב רכה", "שמלות"],
  ["חולצת אטלייה", "חולצות"],
  ["חליפת LINEN", "חליפות"],
  ["מעיל NOVA", "מעילים"],
  ["תיק MILA", "אקססוריז"],
  ["נעלי LOFT", "נעליים"],
] as const;

/** Compact demo seeds for empty-store / gallery preview (not the old 50-item wall). */
export const velmoraDemoProductSeeds: DemoStoreProductSeed[] = DEMO_NAMES.map(
  ([name, category], index) => {
    const price = 129 + index * 40;
    return {
      name,
      price,
      compareAtPrice: index % 3 === 0 ? price + 80 : undefined,
      image: DEMO_IMAGES[index % DEMO_IMAGES.length],
      shortDescription: "פריט לדוגמה — יוחלף במוצרים מהחנות שלך",
      category,
      badge: index === 0 ? "חדש" : undefined,
      featured: index < 3,
    };
  },
);

export function mapStoreProductToVelmora(
  product: StoreCatalogProduct,
): VelmoraShopProduct {
  return {
    id: product.id,
    ref: product.sku ? `מק״ט ${product.sku}` : `REF ${product.id.slice(-6)}`,
    name: product.name,
    category: product.category || "כללי",
    price: product.price,
    oldPrice: product.compareAtPrice,
    image: product.image || DEMO_IMAGES[0],
    badge: product.badge,
    colors: ["#E8DDCC", "#2A231C", "#9C8D78"],
    description: product.shortDescription,
    sku: product.sku,
    inStock: product.inStock,
  };
}

export function mapDemoSeedToVelmora(
  seed: DemoStoreProductSeed,
  index: number,
): VelmoraShopProduct {
  return {
    id: `demo-${index + 1}`,
    ref: `REF. DEMO-${String(1001 + index)}`,
    name: seed.name,
    category: seed.category,
    price: seed.price,
    oldPrice: seed.compareAtPrice,
    image: seed.image || DEMO_IMAGES[index % DEMO_IMAGES.length],
    badge: seed.badge || (index === 0 ? "דמו" : undefined),
    colors: ["#E8DDCC", "#2A231C", "#FFFFFF"],
    description: seed.shortDescription,
    inStock: true,
  };
}

export function buildVelmoraShopCatalog(options: {
  fromPlugin: boolean;
  storeProducts: StoreCatalogProduct[];
  storeCategories: StoreCatalogCategory[];
}) {
  // Live store connection wins — including an empty catalog after seed/clear.
  if (options.fromPlugin) {
    const products = options.storeProducts.map(mapStoreProductToVelmora);
    const categoryNames = Array.from(
      new Set(
        [
          ...options.storeCategories.map((c) => c.name),
          ...products.map((product) => product.category),
        ].filter(Boolean),
      ),
    );
    return {
      products,
      categories: ["הכל", ...categoryNames],
      isLive: true as const,
    };
  }

  const products = velmoraDemoProductSeeds.map(mapDemoSeedToVelmora);
  const categoryNames = Array.from(
    new Set(products.map((product) => product.category)),
  );
  return {
    products,
    categories: ["הכל", ...categoryNames],
    isLive: false as const,
  };
}
