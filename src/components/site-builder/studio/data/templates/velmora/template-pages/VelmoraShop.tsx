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

import type { VelmoraPageId } from "../pages";

type Props = {
  onPageChange: (page: VelmoraPageId) => void;
};

type ProductCategory =
  | "הכל"
  | "שמלות"
  | "חולצות"
  | "חליפות"
  | "מעילים"
  | "אקססוריז"
  | "נעליים";

type SortOption = "newest" | "price-low" | "price-high" | "popular";

type Product = {
  id: string;
  ref: string;
  name: string;
  category: Exclude<ProductCategory, "הכל">;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  colors: string[];
};

const productImages = [
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=90",
];

const productNames = [
  ["שמלת LUNA", "שמלות"],
  ["שמלת NOA", "שמלות"],
  ["שמלת ערב רכה", "שמלות"],
  ["שמלת פשתן נקייה", "שמלות"],
  ["שמלת קיץ בהירה", "שמלות"],
  ["חולצת אטלייה", "חולצות"],
  ["חולצת כפתורים לבנה", "חולצות"],
  ["חולצת משי רכה", "חולצות"],
  ["חולצת בסיס איכותית", "חולצות"],
  ["חולצת סטודיו", "חולצות"],
  ["חליפת LINEN", "חליפות"],
  ["סט שחור מחויט", "חליפות"],
  ["חליפת ערב נקייה", "חליפות"],
  ["סט שמנת מלא", "חליפות"],
  ["חליפת CITY", "חליפות"],
  ["מעיל NOVA", "מעילים"],
  ["מעיל פשתן ארוך", "מעילים"],
  ["ז׳קט מחויט", "מעילים"],
  ["בלייזר NORA", "מעילים"],
  ["מעיל מעבר קל", "מעילים"],
  ["תיק MILA", "אקססוריז"],
  ["תיק עור קלאסי", "אקססוריז"],
  ["חגורת עור", "אקססוריז"],
  ["צעיף כותנה", "אקססוריז"],
  ["תיק ערב קטן", "אקססוריז"],
  ["נעלי LOFT", "נעליים"],
  ["סנדלי קיץ", "נעליים"],
  ["נעלי ערב נקיות", "נעליים"],
  ["מוקסין עור", "נעליים"],
  ["נעלי סטודיו", "נעליים"],
  ["שמלת MIDI", "שמלות"],
  ["שמלת כתפיות", "שמלות"],
  ["שמלת מעטפת", "שמלות"],
  ["חולצת RIB", "חולצות"],
  ["חולצת קרם", "חולצות"],
  ["בלייזר OLIVE", "מעילים"],
  ["ז׳קט קצר", "מעילים"],
  ["חליפת SOFT", "חליפות"],
  ["סט יום־יום", "חליפות"],
  ["תיק קניות", "אקססוריז"],
  ["שרשרת מינימלית", "אקססוריז"],
  ["צעיף סאטן", "אקססוריז"],
  ["נעלי עקב נמוך", "נעליים"],
  ["סנדלי עור", "נעליים"],
  ["שמלת SATIN", "שמלות"],
  ["חולצת ערב", "חולצות"],
  ["מעיל צמר", "מעילים"],
  ["סט TRAVEL", "חליפות"],
  ["תיק כתף", "אקססוריז"],
  ["נעלי CITY", "נעליים"],
] as const;

const products: Product[] = productNames.map(([name, category], index) => {
  const basePrice = 129 + ((index * 37) % 430);
  const price = Math.round(basePrice / 10) * 10 + 9;

  return {
    id: `velmora-product-${index + 1}`,
    ref: `REF. VLM-${String(24001 + index)}`,
    name,
    category,
    price,
    oldPrice: index % 7 === 0 ? price + 80 : undefined,
    image: productImages[index % productImages.length],
    badge:
      index % 11 === 0
        ? "חדש"
        : index % 8 === 0
        ? "רב־מכר"
        : index % 9 === 0
        ? "מוגבל"
        : undefined,
    colors:
      index % 4 === 0
        ? ["#E8DDCC", "#2A231C", "#9C8D78"]
        : index % 4 === 1
        ? ["#FFFFFF", "#D8C9B6", "#111111"]
        : index % 4 === 2
        ? ["#B8A58C", "#5D5A43", "#EFE7DB"]
        : ["#111111", "#CDBEA8", "#F7F2EA"],
  };
});

const categories: ProductCategory[] = [
  "הכל",
  "שמלות",
  "חולצות",
  "חליפות",
  "מעילים",
  "אקססוריז",
  "נעליים",
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
}: {
  product: Product;
  index: number;
  onPageChange: (page: VelmoraPageId) => void;
}) {
  return (
    <Reveal delay={(index % 8) * 70}>
      <article className="group relative overflow-hidden rounded-[7px] border border-black/10 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
        <button
          type="button"
          onClick={() => onPageChange("product")}
          className="relative block w-full overflow-hidden bg-[#eee7da]"
        >
          <img
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
            onClick={() => onPageChange("product")}
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

export default function VelmoraShop({ onPageChange }: Props) {
  const [activeCategory, setActiveCategory] =
    React.useState<ProductCategory>("הכל");
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortOption>("newest");

  const filteredProducts = React.useMemo(() => {
    let nextProducts = products.filter((product) => {
      const matchesCategory =
        activeCategory === "הכל" || product.category === activeCategory;

      const searchValue = query.trim().toLowerCase();

      const matchesSearch =
        searchValue.length === 0 ||
        product.name.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue) ||
        product.ref.toLowerCase().includes(searchValue);

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
  }, [activeCategory, query, sort]);

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
                  50 פריטים לדוגמה לתצוגת חנות מלאה: שמלות, חולצות, חליפות,
                  מעילים, אקססוריז ונעליים — עם תמונות, מחירים וכרטיסי מוצר.
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
                ["50", "מוצרים לדוגמה"],
                ["6", "קטגוריות"],
                ["₪129+", "טווח מחירים"],
                ["RTL", "מותאם עברית"],
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

          {filteredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onPageChange={onPageChange}
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