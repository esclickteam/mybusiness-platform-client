import React from "react";
import {
  ArrowLeft,
  Eye,
  Heart,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import type { VelmoraCartInput, VelmoraPageId } from "../pages";
import {
  mapDemoSeedToVelmora,
  velmoraDemoProductSeeds,
  type VelmoraShopProduct,
} from "../velmoraStoreCatalog";

type Props = {
  onPageChange: (page: VelmoraPageId) => void;
  onAddToCart?: (item: VelmoraCartInput) => void;
  onOpenProduct?: (productId: string) => void;
  products?: VelmoraShopProduct[];
  categories?: string[];
  isLiveCatalog?: boolean;
  catalogLoading?: boolean;
};

type SortOption = "newest" | "price-low" | "price-high" | "popular";

type Product = VelmoraShopProduct;

const PREVIEW_DEMO_PRODUCTS = velmoraDemoProductSeeds.map(mapDemoSeedToVelmora);
const PREVIEW_DEMO_CATEGORIES = [
  "הכל",
  ...Array.from(
    new Set(PREVIEW_DEMO_PRODUCTS.map((product) => product.category)),
  ),
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={[
        "transition-all duration-[850ms] ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function formatPrice(price: number) {
  return `₪${price.toLocaleString("he-IL")}`;
}

function ProductCard({
  product,
  index,
  onPageChange,
  onAddToCart,
  onOpenProduct,
}: {
  product: Product;
  index: number;
  onPageChange: (page: VelmoraPageId) => void;
  onAddToCart?: (item: VelmoraCartInput) => void;
  onOpenProduct?: (productId: string) => void;
}) {
  function openProduct() {
    if (onOpenProduct) {
      onOpenProduct(product.id);
      return;
    }
    onPageChange("product");
  }

  function handleAddToCart(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (onAddToCart) {
      onAddToCart({
        productId: product.id,
        ref: product.ref,
        title: product.name,
        image: product.image,
        price: product.price,
        size: "M",
        color: product.colors[0] || "ברירת מחדל",
        quantity: 1,
      });
      return;
    }

    openProduct();
  }

  return (
    <Reveal delay={(index % 8) * 70}>
      <article className="group relative overflow-hidden rounded-[7px] border border-black/10 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
        <button
          type="button"
          onClick={openProduct}
          className="relative block w-full overflow-hidden bg-[#eee7da]"
        >
          <img data-visual-edit-id={`shop.products.${index}.image`} data-visual-edit-type="image" data-visual-type="image" data-visual-editable="true" data-editable="image" data-field={`shop.products.${index}.image`} data-image-field={`shop.products.${index}.image`} data-visual-image-field={`shop.products.${index}.image`}
            src={product.image}
            alt={product.name}
            className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/35" />

          {product.badge && (
            <span className="absolute right-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-black tracking-[0.14em] text-[#292318] shadow-sm backdrop-blur">
              {product.badge}
            </span>
          )}

          <div className="absolute inset-x-4 bottom-4 flex translate-y-6 items-center justify-center gap-2 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-xs font-black text-[#292318] shadow-xl">
              צפייה במוצר
              <Eye className="h-4 w-4" />
            </span>
          </div>
        </button>

        <div className="p-5 text-right">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/35">
                {product.ref}
              </p>

              <h3 className="mt-2 text-xl font-bold text-[#292318]">
                {product.name}
              </h3>

              <p className="mt-1 text-sm text-black/45">{product.category}</p>
            </div>

            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[#f6f2ea] text-[#292318] transition hover:bg-[#292318] hover:text-white"
              aria-label="הוספה למועדפים"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <p className="text-lg font-black text-[#292318]">
                {formatPrice(product.price)}
              </p>

              {product.oldPrice && (
                <p className="text-sm text-black/35 line-through">
                  {formatPrice(product.oldPrice)}
                </p>
              )}
            </div>

            <div className="flex gap-1.5">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className="h-4 w-4 rounded-full border border-black/10"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[4px] bg-[#292318] text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-black"
          >
            הוספה לסל
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </article>
    </Reveal>
  );
}

export default function VelmoraShop({
  onPageChange,
  onAddToCart,
  onOpenProduct,
  products: productsProp,
  categories: categoriesProp,
  isLiveCatalog = false,
  catalogLoading = false,
}: Props) {
  // Match shared store templates: while resolving → empty; live catalog → only
  // merchant products; preview/empty store → demos. Never override a live resolve
  // with local FALLBACK when the parent already decided the catalog.
  const products = catalogLoading
    ? []
    : Array.isArray(productsProp)
      ? productsProp
      : isLiveCatalog
        ? []
        : PREVIEW_DEMO_PRODUCTS;
  const categories = catalogLoading
    ? ["הכל"]
    : Array.isArray(categoriesProp) && categoriesProp.length > 0
      ? categoriesProp
      : isLiveCatalog
        ? ["הכל"]
        : PREVIEW_DEMO_CATEGORIES;
  const [activeCategory, setActiveCategory] = React.useState("הכל");
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortOption>("newest");

  React.useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory("הכל");
    }
  }, [activeCategory, categories]);

  const filteredProducts = React.useMemo(() => {
    let nextProducts = products.filter((product) => {
      const matchesCategory =
        activeCategory === "הכל" || product.category === activeCategory;

      const searchValue = query.trim().toLowerCase();

      const matchesSearch =
        searchValue.length === 0 ||
        product.name.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue) ||
        product.ref.toLowerCase().includes(searchValue) ||
        String(product.sku || "")
          .toLowerCase()
          .includes(searchValue);

      return matchesCategory && matchesSearch;
    });

    if (sort === "price-low") {
      nextProducts = [...nextProducts].sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      nextProducts = [...nextProducts].sort((a, b) => b.price - a.price);
    }

    if (sort === "popular") {
      nextProducts = [...nextProducts].sort((a, b) => {
        const aScore = a.badge ? 1 : 0;
        const bScore = b.badge ? 1 : 0;
        return bScore - aScore;
      });
    }

    return nextProducts;
  }, [activeCategory, products, query, sort]);

  const minPrice = products.reduce(
    (min, product) => Math.min(min, product.price),
    products[0]?.price || 0,
  );

  return (
    <main className="overflow-hidden bg-[#f6f2ea] text-[#27231f]">
      {/* HERO */}
      <section className="px-5 pb-16 pt-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-sm tracking-[0.24em] text-black/45">
                  חנות ATELIER NOA
                </p>

                <h1 className="mt-6 [font-family:Georgia,Times_New_Roman,serif] text-[64px] font-normal leading-[0.95] tracking-[-0.055em] text-[#2b2722] md:text-[104px]">
                  חנות
                </h1>

                <p className="mt-6 max-w-xl text-base leading-8 text-black/55 md:text-lg">
                  {isLiveCatalog
                    ? "המוצרים כאן מגיעים מניהול החנות שלך — לחצו על פריט לצפייה, הוספה לסל ותשלום."
                    : "תצוגת דמו זמנית. הוסיפו מוצרים בתוסף החנות (פאנל חנות בעורך) והם יופיעו כאן במקום הדמו."}
                </p>
              </div>

              <div className="rounded-[8px] border border-black/10 bg-white/75 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.08)] backdrop-blur">
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <label className="relative block">
                    <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />

                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="חיפוש מוצר, קטגוריה או REF"
                      className="h-12 w-full rounded-[4px] border border-black/10 bg-white pr-11 pl-4 text-sm outline-none transition focus:border-black"
                    />
                  </label>

                  <label className="relative block">
                    <SlidersHorizontal className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />

                    <select
                      value={sort}
                      onChange={(event) =>
                        setSort(event.target.value as SortOption)
                      }
                      className="h-12 min-w-[190px] appearance-none rounded-[4px] border border-black/10 bg-white pr-11 pl-4 text-sm font-bold outline-none transition focus:border-black"
                    >
                      <option value="newest">חדש קודם</option>
                      <option value="popular">פופולרי</option>
                      <option value="price-low">מחיר נמוך לגבוה</option>
                      <option value="price-high">מחיר גבוה לנמוך</option>
                    </select>
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const active = activeCategory === category;

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        className={[
                          "h-10 rounded-full border px-4 text-xs font-black transition",
                          active
                            ? "border-[#292318] bg-[#292318] text-white"
                            : "border-black/10 bg-white text-[#292318] hover:border-black",
                        ].join(" ")}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-12 grid gap-4 rounded-[8px] border border-black/10 bg-white/70 p-4 shadow-sm md:grid-cols-4">
              {[
                [
                  String(products.length),
                  isLiveCatalog ? "מוצרים בחנות" : "מוצרים לדוגמה",
                ],
                [String(Math.max(0, categories.length - 1)), "קטגוריות"],
                [
                  products.length ? `₪${minPrice.toLocaleString("he-IL")}+` : "—",
                  "טווח מחירים",
                ],
                [isLiveCatalog ? "LIVE" : "DEMO", isLiveCatalog ? "מחובר לחנות" : "מצב הדגמה"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-[6px] border border-black/10 bg-[#f6f2ea] p-5 text-center"
                >
                  <p className="[font-family:Georgia,serif] text-4xl text-[#292318]">
                    {value}
                  </p>
                  <p className="mt-2 text-xs font-bold tracking-[0.18em] text-black/45">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURED STRIP */}
      <section className="border-y border-black/10 bg-white py-8">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-hidden px-5">
          <Sparkles className="h-5 w-5 shrink-0 text-[#292318]" />

          <div className="flex w-max animate-[velmoraShopMarquee_34s_linear_infinite] gap-10 whitespace-nowrap text-sm font-bold tracking-[0.12em] text-black/55">
            {[...products.slice(0, 12), ...products.slice(0, 12)].map(
              (product, index) => (
                <span key={`${product.id}-${index}`}>
                  {product.name} · {formatPrice(product.price)}
                </span>
              )
            )}
          </div>
        </div>

        <style>
          {`
            @keyframes velmoraShopMarquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}
        </style>
      </section>

      {/* PRODUCTS */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm tracking-[0.2em] text-black/40">
                  {filteredProducts.length} מוצרים נמצאו
                </p>

                <h2 className="mt-3 [font-family:Georgia,Times_New_Roman,serif] text-4xl font-normal tracking-[-0.04em] text-[#2b2722] md:text-5xl">
                  כל הפריטים
                </h2>
              </div>

              <button
                type="button"
                onClick={() => onPageChange("home")}
                className="inline-flex h-11 items-center gap-3 rounded-[4px] border border-black/10 bg-white px-5 text-sm font-bold text-[#292318] transition hover:border-black"
              >
                חזרה לעמוד הבית
                <ArrowLeft className="h-4 w-4" />
              </button>
            </div>
          </Reveal>

          {catalogLoading ? (
            <div className="rounded-[8px] border border-black/10 bg-white p-12 text-center shadow-sm">
              <p className="text-sm tracking-[0.18em] text-black/45">
                טוען מוצרים מהחנות...
              </p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onPageChange={onPageChange}
                  onAddToCart={onAddToCart}
                  onOpenProduct={onOpenProduct}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[8px] border border-black/10 bg-white p-12 text-center shadow-sm">
              <p className="[font-family:Georgia,serif] text-4xl">
                לא נמצאו מוצרים
              </p>

              <p className="mt-4 text-black/50">
                אפשר לנסות חיפוש אחר או לבחור קטגוריה אחרת.
              </p>

              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("הכל");
                }}
                className="mt-6 h-11 rounded-[4px] bg-[#292318] px-6 text-sm font-bold text-white"
              >
                איפוס סינון
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}