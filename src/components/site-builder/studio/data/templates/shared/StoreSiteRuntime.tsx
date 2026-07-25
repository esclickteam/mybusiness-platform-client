import React, { useEffect, useMemo, useRef, useState } from "react";

import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { Reveal } from "./Reveal";
import { useTemplatePageNavigation } from "./useTemplatePageNavigation";
import {
  formatStorePrice,
  useStorePluginCatalog,
  type DemoStoreProductSeed,
  type StoreCatalogProduct,
} from "./useStorePluginCatalog";

export type StoreSitePageId =
  | "home"
  | "shop"
  | "product"
  | "cart"
  | "about"
  | "contact"
  | "faq"
  | "shipping";

export type StoreCartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

export type StoreSiteRuntimeProps = {
  templateId: string;
  defaultData: Record<string, any>;
  editorCss: string;
  demoProducts: DemoStoreProductSeed[];
  pages: Array<{ id: string; label: string; slug: string }>;
  businessId?: string;
  initialPage?: string;
  initialPageId?: string;
  page?: string;
  pageId?: string;
  activePageId?: string;
  currentPageId?: string;
  mode?: string;
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
};

function getValue(data: Record<string, any>, fallback: Record<string, any>, key: string) {
  const value = data?.[key];
  if (value === undefined || value === null || value === "") {
    return fallback?.[key] ?? "";
  }
  return value;
}

function sectionProps(id: string, kind: string, label: string) {
  return {
    "data-template-section-id": id,
    "data-template-section-type": kind,
    "data-section-kind": kind,
    "data-section-title": label,
    "data-bizuply-block": kind === "products" || kind === "store" ? "products" : "section",
    "data-bizuply-block-products": kind === "products" || kind === "store" ? "true" : undefined,
    "data-visual-edit-id": id,
    "data-visual-edit-type": "section",
    "data-visual-editable": "true",
  } as Record<string, string>;
}

function ProductCard({
  product,
  currency,
  onOpen,
  onAdd,
  index = 0,
}: {
  product: StoreCatalogProduct;
  currency: string;
  onOpen: () => void;
  onAdd: () => void;
  index?: number;
}) {
  return (
    <Reveal delayMs={(index % 6) * 70} variant={index % 2 === 0 ? "up" : "scale"} className="h-full">
      <article className="store-card group relative flex h-full flex-col overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
        <button type="button" onClick={onOpen} className="relative block overflow-hidden">
          <div className="store-media aspect-[4/5] overflow-hidden bg-[var(--bg-soft)]">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-[var(--muted)]">אין תמונה</div>
            )}
          </div>
          {product.badge ? (
            <span className="absolute start-3 top-3 bg-[var(--p)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--on-p)]">
              {product.badge}
            </span>
          ) : null}
        </button>
        <div className="flex flex-1 flex-col gap-3 p-4 text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            {product.category}
          </p>
          <button type="button" onClick={onOpen} className="store-display text-start text-lg font-bold leading-snug">
            {product.name}
          </button>
          <div className="mt-auto flex items-end justify-between gap-3">
            <div>
              <p className="text-base font-black text-[var(--p)]">
                {formatStorePrice(product.price, currency)}
              </p>
              {product.compareAtPrice ? (
                <p className="text-xs text-[var(--muted)] line-through">
                  {formatStorePrice(product.compareAtPrice, currency)}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onAdd}
              className="bg-[var(--dark)] px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-[var(--p)] hover:text-[var(--on-p)]"
            >
              הוסף
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function StoreSiteRuntime({
  templateId,
  defaultData,
  editorCss,
  demoProducts,
  pages,
  businessId,
  data,
  ...navProps
}: StoreSiteRuntimeProps) {
  const mergedData = useMemo(
    () => ({ ...defaultData, ...(data || {}) }),
    [data, defaultData],
  );
  const g = (key: string) => getValue(mergedData, defaultData, key);

  const allowedPages = pages.map((p) => p.id);
  const { currentPage, goTo: goToPage } = useTemplatePageNavigation(navProps, {
    allowedPages,
    fallbackPage: "home",
  });

  const { products, categories, loading, fromPlugin, currency } =
    useStorePluginCatalog({
      businessId,
      demoProducts,
    });

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [cart, setCart] = useState<StoreCartItem[]>([]);
  const [qty, setQty] = useState(1);
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedProductId && products[0]) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (activeCategory !== "all") {
      list = list.filter(
        (p) => p.categorySlug === activeCategory || p.category === activeCategory,
      );
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "he"));
    if (sort === "featured") {
      list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [activeCategory, products, search, sort]);

  const featured = useMemo(
    () => products.filter((p) => p.featured).slice(0, 8),
    [products],
  );
  const showcase = featured.length ? featured : products.slice(0, 8);
  const selectedProduct =
    products.find((p) => p.id === selectedProductId) || products[0] || null;

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const openProduct = (product: StoreCatalogProduct) => {
    setSelectedProductId(product.id);
    setQty(1);
    goToPage("product");
  };

  const addToCart = (product: StoreCatalogProduct, amount = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + amount }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: amount,
        },
      ];
    });
  };

  const Header = (
    <header
      {...sectionProps("header", "header", "כותרת")}
      className="store-header sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-xl"
      data-visual-flow-lock="true"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goToPage("home")} className="text-right">
          <div className="flex items-center gap-3">
            <span className="store-logo grid h-11 w-11 place-items-center bg-[var(--p)] text-sm font-black text-[var(--on-p)]">
              {g("logoText")}
            </span>
            <div>
              <p className="store-display text-xl font-black leading-none">{g("brandName")}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
                {g("tagline")}
              </p>
            </div>
          </div>
        </button>
        <nav className="hidden items-center gap-4 xl:flex">
          {pages.slice(0, 6).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goToPage(item.id)}
              className={`text-[11px] font-black uppercase tracking-[0.16em] transition ${
                currentPage === item.id ? "text-[var(--p)]" : "opacity-70 hover:opacity-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToPage("shop")}
            className="hidden border border-[var(--line)] px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] md:inline-flex"
          >
            {g("navShop")}
          </button>
          <button
            type="button"
            onClick={() => goToPage("cart")}
            className="relative bg-[var(--dark)] px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] text-white"
          >
            {g("navCart")}
            {cartCount > 0 ? (
              <span className="absolute -start-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--p)] px-1 text-[10px] text-[var(--on-p)]">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );

  const Footer = (
    <footer {...sectionProps("footer", "footer", "פוטר")} className="border-t border-[var(--line)] bg-[var(--dark)] px-5 py-14 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2 text-right">
          <p className="store-display text-3xl font-black">{g("brandName")}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/70">{g("footerText")}</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
            {fromPlugin ? "מחובר לתוסף החנות" : "תצוגת דמו — חברו מוצרים בתוסף החנות"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">ניווט</p>
          <div className="mt-4 grid gap-2">
            {pages.map((item) => (
              <button key={item.id} type="button" onClick={() => goToPage(item.id)} className="text-sm opacity-80 hover:opacity-100">
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">יצירת קשר</p>
          <p className="mt-4 text-sm">{g("phone")}</p>
          <p className="mt-2 text-sm">{g("email")}</p>
          <p className="mt-2 text-sm text-white/70">{g("address")}</p>
        </div>
      </div>
    </footer>
  );

  const homeContent = (
    <div>
      {Header}
      <section {...sectionProps("promo", "promo", "פס קידום")} className="store-promo overflow-hidden bg-[var(--p)] text-[var(--on-p)]">
        <div ref={marqueeRef} className="store-marquee flex whitespace-nowrap py-2 text-xs font-black uppercase tracking-[0.28em]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-6">
              {g("promoText")}
            </span>
          ))}
        </div>
      </section>

      <section {...sectionProps("hero", "hero", "הירו")} className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={g("heroImage")} alt="" className="store-kenburns h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-[var(--dark)]/85 via-[var(--dark)]/55 to-transparent" />
        </div>
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-end px-5 py-20 lg:px-8 lg:py-28">
          <Reveal variant="left" className="max-w-2xl text-right text-white">
            <p className="inline-flex border border-white/30 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] backdrop-blur">
              {g("heroEyebrow")}
            </p>
            <h1 className="store-display mt-6 text-5xl font-black leading-[1.05] md:text-7xl">
              {g("heroTitle")}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/80 md:text-lg">
              {g("heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => goToPage("shop")} className="bg-[var(--p)] px-7 py-4 text-sm font-black text-[var(--on-p)]">
                {g("heroPrimaryButton")}
              </button>
              <button type="button" onClick={() => goToPage("about")} className="border border-white/40 px-7 py-4 text-sm font-black text-white">
                {g("heroSecondaryButton")}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <section {...sectionProps("categories", "categories", "קטגוריות")} className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{g("categoriesEyebrow")}</p>
            <h2 className="store-display mt-4 text-4xl font-black md:text-5xl">{g("categoriesTitle")}</h2>
            <p className="mt-4 text-[var(--muted)]">{g("categoriesText")}</p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(categories.length ? categories : [
              { id: "1", name: g("catOne"), slug: "c1", image: g("catOneImage") },
              { id: "2", name: g("catTwo"), slug: "c2", image: g("catTwoImage") },
              { id: "3", name: g("catThree"), slug: "c3", image: g("catThreeImage") },
              { id: "4", name: g("catFour"), slug: "c4", image: g("catFourImage") },
            ]).slice(0, 4).map((cat, index) => (
              <Reveal key={cat.id || cat.slug} delayMs={index * 90} variant="up">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.slug || "all");
                    goToPage("shop");
                  }}
                  className="store-card group relative aspect-[4/5] w-full overflow-hidden border border-[var(--line)]"
                >
                  <img
                    src={cat.image || g("heroImage")}
                    alt={cat.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-right text-white">
                    <p className="store-display text-2xl font-black">{cat.name}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/70">לצפייה בקטגוריה</p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        {...sectionProps("products", "products", "מוצרים נבחרים")}
        className="bg-[var(--bg-soft)] px-5 py-20 lg:px-8 lg:py-28"
        data-bizuply-widget="products"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal className="text-right">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{g("productsEyebrow")}</p>
              <h2 className="store-display mt-3 text-4xl font-black md:text-5xl">{g("productsTitle")}</h2>
              <p className="mt-3 max-w-xl text-[var(--muted)]">{g("productsText")}</p>
            </Reveal>
            <button type="button" onClick={() => goToPage("shop")} className="border border-[var(--line)] px-5 py-3 text-xs font-black uppercase tracking-[0.16em]">
              לכל המוצרים
            </button>
          </div>
          {loading ? (
            <p className="mt-10 text-sm text-[var(--muted)]">טוען מוצרים מתוסף החנות…</p>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {showcase.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  index={index}
                  onOpen={() => openProduct(product)}
                  onAdd={() => addToCart(product)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section {...sectionProps("values", "values", "ערכים")} className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {[
            [g("valueOneTitle"), g("valueOneText")],
            [g("valueTwoTitle"), g("valueTwoText")],
            [g("valueThreeTitle"), g("valueThreeText")],
          ].map(([title, text], index) => (
            <Reveal key={title} delayMs={index * 100} variant="up">
              <article className="store-card h-full border border-[var(--line)] bg-[var(--surface)] p-7 text-right">
                <p className="text-sm font-black text-[var(--p)]">0{index + 1}</p>
                <h3 className="store-display mt-4 text-2xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section {...sectionProps("lookbook", "gallery", "לוקבוק")} className="overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{g("lookbookEyebrow")}</p>
            <h2 className="store-display mt-4 text-4xl font-black md:text-5xl">{g("lookbookTitle")}</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-12">
            <Reveal className="md:col-span-7" variant="right">
              <img src={g("lookOne")} alt="" className="store-float-a aspect-[16/11] w-full object-cover" />
            </Reveal>
            <div className="grid gap-4 md:col-span-5">
              <Reveal variant="left"><img src={g("lookTwo")} alt="" className="store-float-b aspect-[16/10] w-full object-cover" /></Reveal>
              <Reveal delayMs={120} variant="left"><img src={g("lookThree")} alt="" className="store-float-c aspect-[16/10] w-full object-cover" /></Reveal>
            </div>
          </div>
        </div>
      </section>

      <section {...sectionProps("testimonials", "testimonials", "המלצות")} className="bg-[var(--dark)] px-5 py-20 text-white lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--accent)]">{g("testimonialsEyebrow")}</p>
            <h2 className="store-display mt-4 text-4xl font-black md:text-5xl">{g("testimonialsTitle")}</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [g("reviewOneName"), g("reviewOneText")],
              [g("reviewTwoName"), g("reviewTwoText")],
              [g("reviewThreeName"), g("reviewThreeText")],
            ].map(([name, text], index) => (
              <Reveal key={name} delayMs={index * 110} variant="scale">
                <blockquote className="h-full border border-white/15 bg-white/5 p-7 text-right backdrop-blur">
                  <p className="text-sm leading-7 text-white/80">“{text}”</p>
                  <footer className="mt-6 text-sm font-black text-[var(--accent)]">{name}</footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section {...sectionProps("journal", "journal", "יומן")} className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{g("journalEyebrow")}</p>
            <h2 className="store-display mt-3 text-4xl font-black md:text-5xl">{g("journalTitle")}</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [g("journalOneTitle"), g("journalOneText"), g("lookOne")],
              [g("journalTwoTitle"), g("journalTwoText"), g("lookTwo")],
              [g("journalThreeTitle"), g("journalThreeText"), g("lookThree")],
            ].map(([title, text, image], index) => (
              <Reveal key={title} delayMs={index * 90}>
                <article className="store-card overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
                  <img src={image} alt="" className="aspect-[16/10] w-full object-cover" />
                  <div className="p-5 text-right">
                    <h3 className="store-display text-xl font-black">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section {...sectionProps("newsletter", "newsletter", "ניוזלטר")} className="px-5 pb-20 lg:px-8 lg:pb-28">
        <Reveal>
          <div className="mx-auto grid max-w-7xl items-center gap-8 overflow-hidden border border-[var(--line)] bg-[var(--bg-soft)] p-8 md:grid-cols-2 lg:p-12">
            <div className="text-right">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{g("newsletterEyebrow")}</p>
              <h2 className="store-display mt-3 text-3xl font-black md:text-4xl">{g("newsletterTitle")}</h2>
              <p className="mt-3 text-[var(--muted)]">{g("newsletterText")}</p>
            </div>
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="האימייל שלך"
                className="min-w-0 flex-1 border border-[var(--line)] bg-[var(--surface)] px-4 py-4 text-sm outline-none focus:border-[var(--p)]"
              />
              <button type="submit" className="bg-[var(--p)] px-6 py-4 text-sm font-black text-[var(--on-p)]">
                {g("newsletterButton")}
              </button>
            </form>
          </div>
        </Reveal>
      </section>
      {Footer}
    </div>
  );

  const shopContent = (
    <div>
      {Header}
      <section {...sectionProps("shop-hero", "hero", "חנות")} className="border-b border-[var(--line)] px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl text-right">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{g("shopEyebrow")}</p>
            <h1 className="store-display mt-4 text-5xl font-black md:text-6xl">{g("shopTitle")}</h1>
            <p className="mt-4 max-w-2xl text-[var(--muted)]">{g("shopText")}</p>
          </Reveal>
        </div>
      </section>

      <section {...sectionProps("shop-filters", "filters", "סינונים")} className="border-b border-[var(--line)] bg-[var(--bg-soft)] px-5 py-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${
                activeCategory === "all" ? "bg-[var(--p)] text-[var(--on-p)]" : "border border-[var(--line)] bg-[var(--surface)]"
              }`}
            >
              הכל
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${
                  activeCategory === cat.slug ? "bg-[var(--p)] text-[var(--on-p)]" : "border border-[var(--line)] bg-[var(--surface)]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש מוצר…"
              className="min-w-[200px] flex-1 border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--p)]"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-sm"
            >
              <option value="featured">נבחרים</option>
              <option value="price-asc">מחיר: נמוך לגבוה</option>
              <option value="price-desc">מחיר: גבוה לנמוך</option>
              <option value="name">שם א–ת</option>
            </select>
          </div>
        </div>
      </section>

      <section
        {...sectionProps("shop-grid", "products", "רשת מוצרים")}
        className="px-5 py-16 lg:px-8 lg:py-20"
        data-bizuply-widget="products"
      >
        <div className="mx-auto max-w-7xl">
          <p className="mb-8 text-sm text-[var(--muted)]">
            {filteredProducts.length} מוצרים
            {fromPlugin ? " · נטענו מתוסף החנות" : " · תצוגת דמו עד שיוגדרו מוצרים בתוסף"}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                index={index}
                onOpen={() => openProduct(product)}
                onAdd={() => addToCart(product)}
              />
            ))}
          </div>
          {!filteredProducts.length ? (
            <div className="mt-16 border border-dashed border-[var(--line)] p-10 text-center text-[var(--muted)]">
              לא נמצאו מוצרים בסינון הנוכחי. הוסיפו מוצרים בתוסף החנות או נסו קטגוריה אחרת.
            </div>
          ) : null}
        </div>
      </section>

      <section {...sectionProps("shop-benefits", "values", "יתרונות")} className="bg-[var(--bg-soft)] px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {[g("shipBenefit"), g("returnBenefit"), g("supportBenefit"), g("secureBenefit")].map((text, i) => (
            <Reveal key={text} delayMs={i * 80}>
              <div className="border border-[var(--line)] bg-[var(--surface)] p-5 text-center text-sm font-bold">{text}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section {...sectionProps("shop-cta", "cta", "קריאה לפעולה")} className="px-5 py-16 lg:px-8">
        <Reveal>
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border border-[var(--line)] bg-[var(--dark)] p-8 text-white md:flex-row md:items-center lg:p-12">
            <div className="text-right">
              <h2 className="store-display text-3xl font-black">{g("shopCtaTitle")}</h2>
              <p className="mt-3 text-white/70">{g("shopCtaText")}</p>
            </div>
            <button type="button" onClick={() => goToPage("contact")} className="bg-[var(--p)] px-6 py-4 text-sm font-black text-[var(--on-p)]">
              {g("shopCtaButton")}
            </button>
          </div>
        </Reveal>
      </section>

      {/* pad to keep ~10 section rhythm on shop */}
      <section {...sectionProps("shop-story", "about", "סיפור")} className="px-5 pb-10 lg:px-8">
        <Reveal className="mx-auto max-w-7xl grid gap-8 md:grid-cols-2 items-center">
          <img src={g("aboutImage")} alt="" className="aspect-[5/4] w-full object-cover" />
          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{g("aboutEyebrow")}</p>
            <h2 className="store-display mt-3 text-3xl font-black">{g("aboutTitle")}</h2>
            <p className="mt-4 text-[var(--muted)] leading-8">{g("aboutText")}</p>
          </div>
        </Reveal>
      </section>
      <section {...sectionProps("shop-faq-teaser", "faq", "שאלות")} className="px-5 pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-4 md:grid-cols-3">
          {[
            [g("faqOneQ"), g("faqOneA")],
            [g("faqTwoQ"), g("faqTwoA")],
            [g("faqThreeQ"), g("faqThreeA")],
          ].map(([q, a], i) => (
            <Reveal key={q} delayMs={i * 70}>
              <article className="border border-[var(--line)] bg-[var(--surface)] p-5 text-right">
                <h3 className="font-black">{q}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{a}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      {Footer}
    </div>
  );

  const productContent = (
    <div>
      {Header}
      <section {...sectionProps("product-main", "product", "מוצר")} className="px-5 py-16 lg:px-8 lg:py-24">
        {selectedProduct ? (
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
            <Reveal variant="right">
              <div className="overflow-hidden border border-[var(--line)] bg-[var(--bg-soft)]">
                {selectedProduct.image ? (
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="aspect-square w-full object-cover" />
                ) : (
                  <div className="grid aspect-square place-items-center text-[var(--muted)]">אין תמונה</div>
                )}
              </div>
            </Reveal>
            <Reveal variant="left" className="text-right">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--p)]">{selectedProduct.category}</p>
              <h1 className="store-display mt-4 text-4xl font-black md:text-5xl">{selectedProduct.name}</h1>
              <p className="mt-4 text-2xl font-black text-[var(--p)]">
                {formatStorePrice(selectedProduct.price, currency)}
              </p>
              <p className="mt-6 text-base leading-8 text-[var(--muted)]">
                {selectedProduct.shortDescription || g("productFallbackText")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="flex items-center border border-[var(--line)]">
                  <button type="button" className="px-4 py-3" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
                  <span className="min-w-10 text-center font-black">{qty}</span>
                  <button type="button" className="px-4 py-3" onClick={() => setQty((q) => q + 1)}>+</button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(selectedProduct, qty);
                    goToPage("cart");
                  }}
                  className="bg-[var(--p)] px-7 py-3.5 text-sm font-black text-[var(--on-p)]"
                >
                  הוספה לסל
                </button>
                <button type="button" onClick={() => goToPage("shop")} className="border border-[var(--line)] px-7 py-3.5 text-sm font-black">
                  חזרה לחנות
                </button>
              </div>
            </Reveal>
          </div>
        ) : (
          <p className="mx-auto max-w-7xl text-[var(--muted)]">אין מוצרים להצגה. הגדירו מוצרים בתוסף החנות.</p>
        )}
      </section>

      <section {...sectionProps("product-details", "features", "פרטים")} className="bg-[var(--bg-soft)] px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[g("productDetailOne"), g("productDetailTwo"), g("productDetailThree")].map((text, i) => (
            <Reveal key={text} delayMs={i * 80}>
              <div className="border border-[var(--line)] bg-[var(--surface)] p-6 text-right text-sm leading-7">{text}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section {...sectionProps("product-related", "products", "מוצרים דומים")} className="px-5 py-16 lg:px-8" data-bizuply-widget="products">
        <div className="mx-auto max-w-7xl">
          <h2 className="store-display text-3xl font-black">אולי גם יעניין אתכם</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products
              .filter((p) => p.id !== selectedProduct?.id)
              .slice(0, 4)
              .map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  index={index}
                  onOpen={() => openProduct(product)}
                  onAdd={() => addToCart(product)}
                />
              ))}
          </div>
        </div>
      </section>
      {Footer}
    </div>
  );

  const cartContent = (
    <div>
      {Header}
      <section {...sectionProps("cart-main", "cart", "סל")} className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="store-display text-4xl font-black md:text-5xl">{g("cartTitle")}</h1>
          <p className="mt-3 text-[var(--muted)]">{g("cartText")}</p>
          <div className="mt-10 space-y-4">
            {cart.length === 0 ? (
              <div className="border border-dashed border-[var(--line)] p-10 text-center">
                <p className="text-[var(--muted)]">הסל ריק כרגע.</p>
                <button type="button" onClick={() => goToPage("shop")} className="mt-6 bg-[var(--p)] px-6 py-3 text-sm font-black text-[var(--on-p)]">
                  לעמוד החנות
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 border border-[var(--line)] bg-[var(--surface)] p-4">
                  <div className="flex items-center gap-4">
                    {item.image ? <img src={item.image} alt="" className="h-20 w-16 object-cover" /> : null}
                    <div className="text-right">
                      <p className="font-black">{item.name}</p>
                      <p className="text-sm text-[var(--muted)]">{formatStorePrice(item.price, currency)} × {item.qty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-black">{formatStorePrice(item.price * item.qty, currency)}</p>
                    <button
                      type="button"
                      className="text-xs font-bold text-red-600"
                      onClick={() => setCart((prev) => prev.filter((x) => x.id !== item.id))}
                    >
                      הסר
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 ? (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
              <p className="text-xl font-black">סה״כ: {formatStorePrice(cartTotal, currency)}</p>
              <button type="button" onClick={() => goToPage("contact")} className="bg-[var(--dark)] px-7 py-3.5 text-sm font-black text-white">
                המשך לתשלום / יצירת קשר
              </button>
            </div>
          ) : null}
        </div>
      </section>
      {Footer}
    </div>
  );

  const aboutContent = (
    <div>
      {Header}
      <section {...sectionProps("about-hero", "hero", "אודות")} className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <Reveal variant="right"><img src={g("aboutImage")} alt="" className="aspect-[5/4] w-full object-cover" /></Reveal>
          <Reveal variant="left" className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{g("aboutEyebrow")}</p>
            <h1 className="store-display mt-4 text-5xl font-black">{g("aboutTitle")}</h1>
            <p className="mt-6 text-base leading-8 text-[var(--muted)]">{g("aboutText")}</p>
            <p className="mt-4 text-base leading-8 text-[var(--muted)]">{g("aboutTextTwo")}</p>
          </Reveal>
        </div>
      </section>
      <section {...sectionProps("about-values", "values", "ערכים")} className="bg-[var(--bg-soft)] px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[
            [g("valueOneTitle"), g("valueOneText")],
            [g("valueTwoTitle"), g("valueTwoText")],
            [g("valueThreeTitle"), g("valueThreeText")],
          ].map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90}>
              <article className="border border-[var(--line)] bg-[var(--surface)] p-7 text-right">
                <h3 className="store-display text-2xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <section {...sectionProps("about-cta", "cta", "CTA")} className="px-5 py-16 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-7xl border border-[var(--line)] bg-[var(--dark)] p-10 text-center text-white">
            <h2 className="store-display text-3xl font-black">{g("ctaTitle")}</h2>
            <p className="mt-3 text-white/70">{g("ctaText")}</p>
            <button type="button" onClick={() => goToPage("shop")} className="mt-6 bg-[var(--p)] px-7 py-3.5 text-sm font-black text-[var(--on-p)]">
              {g("ctaButton")}
            </button>
          </div>
        </Reveal>
      </section>
      {Footer}
    </div>
  );

  const contactContent = (
    <div>
      {Header}
      <section {...sectionProps("contact-main", "contact", "צור קשר")} className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <Reveal variant="right" className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{g("contactEyebrow")}</p>
            <h1 className="store-display mt-4 text-5xl font-black">{g("contactTitle")}</h1>
            <p className="mt-4 text-[var(--muted)]">{g("contactText")}</p>
            <div className="mt-8 space-y-3 text-sm">
              <p><strong>טלפון:</strong> {g("phone")}</p>
              <p><strong>אימייל:</strong> {g("email")}</p>
              <p><strong>כתובת:</strong> {g("address")}</p>
            </div>
          </Reveal>
          <Reveal variant="left">
            <form className="grid gap-3 border border-[var(--line)] bg-[var(--surface)] p-6" onSubmit={(e) => e.preventDefault()}>
              <input className="border border-[var(--line)] px-4 py-3 text-sm" placeholder="שם מלא" />
              <input className="border border-[var(--line)] px-4 py-3 text-sm" placeholder="טלפון" />
              <input className="border border-[var(--line)] px-4 py-3 text-sm" placeholder="אימייל" />
              <textarea className="min-h-32 border border-[var(--line)] px-4 py-3 text-sm" placeholder="הודעה" />
              <button type="submit" className="bg-[var(--p)] px-5 py-3.5 text-sm font-black text-[var(--on-p)]">{g("contactButton")}</button>
            </form>
          </Reveal>
        </div>
      </section>
      {Footer}
    </div>
  );

  const faqContent = (
    <div>
      {Header}
      <section {...sectionProps("faq-main", "faq", "שאלות נפוצות")} className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-right">
          <h1 className="store-display text-5xl font-black">{g("faqTitle")}</h1>
          <p className="mt-4 text-[var(--muted)]">{g("faqText")}</p>
          <div className="mt-10 space-y-4">
            {[
              [g("faqOneQ"), g("faqOneA")],
              [g("faqTwoQ"), g("faqTwoA")],
              [g("faqThreeQ"), g("faqThreeA")],
              [g("faqFourQ"), g("faqFourA")],
              [g("faqFiveQ"), g("faqFiveA")],
            ].map(([q, a], i) => (
              <Reveal key={q} delayMs={i * 60}>
                <article className="border border-[var(--line)] bg-[var(--surface)] p-6">
                  <h3 className="text-lg font-black">{q}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{a}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      {Footer}
    </div>
  );

  const shippingContent = (
    <div>
      {Header}
      <section {...sectionProps("shipping-main", "shipping", "משלוחים")} className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-right">
          <h1 className="store-display text-5xl font-black">{g("shippingTitle")}</h1>
          <p className="mt-4 text-[var(--muted)]">{g("shippingText")}</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              [g("shipOneTitle"), g("shipOneText")],
              [g("shipTwoTitle"), g("shipTwoText")],
              [g("shipThreeTitle"), g("shipThreeText")],
              [g("shipFourTitle"), g("shipFourText")],
            ].map(([title, text], i) => (
              <Reveal key={title} delayMs={i * 70}>
                <article className="border border-[var(--line)] bg-[var(--surface)] p-6">
                  <h3 className="font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      {Footer}
    </div>
  );

  const stackPages = [
    { id: "home", content: homeContent },
    { id: "shop", content: shopContent },
    { id: "product", content: productContent },
    { id: "cart", content: cartContent },
    { id: "about", content: aboutContent },
    { id: "contact", content: contactContent },
    { id: "faq", content: faqContent },
    { id: "shipping", content: shippingContent },
  ];

  return (
    <div
      dir="rtl"
      data-template-id={String(navProps.mode || "").includes("preview") ? `${templateId}-preview` : templateId}
      data-bizuply-site="true"
      data-store-plugin="true"
      className="min-h-screen w-full overflow-x-hidden bg-[var(--bg)] text-[var(--text)]"
    >
      <style dangerouslySetInnerHTML={{ __html: editorCss }} />
      <VisualPageStack activePageId={currentPage} pages={stackPages} />
    </div>
  );
}
