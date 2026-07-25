import React, { useEffect, useMemo, useState } from "react";

import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { Reveal } from "./Reveal";
import { resolveStoreLayout, type StoreLayoutId } from "./storeLayouts";
import { useTemplatePageNavigation } from "./useTemplatePageNavigation";
import {
  formatStorePrice,
  useStorePluginCatalog,
  type DemoStoreProductSeed,
  type StoreCatalogCategory,
  type StoreCatalogProduct,
} from "./useStorePluginCatalog";

export type StoreSitePageId =
  | "home"
  | "shop"
  | "collections"
  | "product"
  | "cart"
  | "lookbook"
  | "about"
  | "journal"
  | "contact"
  | "faq"
  | "shipping";

type StorePage = { id: string; label: string; slug: string };

export type StoreCartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

export type StoreSiteRuntimeProps = {
  templateId: string;
  layout?: StoreLayoutId;
  defaultData: Record<string, any>;
  editorCss: string;
  demoProducts: DemoStoreProductSeed[];
  pages: StorePage[];
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
  isStudioStatic?: boolean;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
  } as Record<string, string | undefined>;
}

/** Guaranteed image used when a remote asset fails — never show letter placeholders. */
const SAFE_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80";

function StoreImage({
  src,
  alt,
  className,
  fallbackLabel: _fallbackLabel,
  fallbackClassName: _fallbackClassName,
}: {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  fallbackClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const resolved = String(src || "").trim();

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <img
      src={!resolved || failed ? SAFE_IMAGE_FALLBACK : resolved}
      alt={alt}
      className={className}
      onError={(event) => {
        const el = event.currentTarget;
        if (el.dataset.fallback === "1") return;
        el.dataset.fallback = "1";
        setFailed(true);
        el.src = SAFE_IMAGE_FALLBACK;
      }}
    />
  );
}

const productCardClassByLayout: Record<StoreLayoutId, string> = {
  techCinema: "rounded-none border-sky-300/20 bg-black/55 text-white shadow-[0_0_48px_rgba(14,165,233,0.16)]",
  marketBento: "rounded-[2rem] border-green-900/15 bg-white shadow-[0_18px_44px_rgba(21,128,61,0.12)]",
  athleticStack: "rounded-none border-black bg-[var(--dark)] text-white shadow-[10px_10px_0_var(--p)]",
  softCloud: "rounded-[2.4rem] border-pink-100 bg-white/90 shadow-[0_22px_70px_rgba(244,114,182,0.18)]",
  editorialRoom: "rounded-none border-stone-300 bg-[#f8f4ed] shadow-none",
  playfulPets: "rounded-[2rem] border-orange-200 bg-white shadow-[0_18px_0_rgba(251,146,60,0.2)]",
  libraryStacks: "rounded-none border-amber-900/25 bg-[#fffaf0] shadow-[0_16px_0_rgba(120,53,15,0.12)]",
  beautyGloss: "rounded-[2rem] border-white/25 bg-white/10 text-white shadow-[0_28px_80px_rgba(244,114,182,0.22)] backdrop-blur",
  industrialYard: "rounded-none border-yellow-400/40 bg-slate-950 text-white shadow-[8px_8px_0_rgba(250,204,21,0.35)]",
  jewelGallery: "rounded-none border-stone-700 bg-transparent text-[var(--text)] shadow-none",
};

const productMediaClassByLayout: Record<StoreLayoutId, string> = {
  techCinema: "aspect-[16/10]",
  marketBento: "aspect-[5/4] rounded-[1.6rem]",
  athleticStack: "aspect-[4/3]",
  softCloud: "aspect-square rounded-[2rem]",
  editorialRoom: "aspect-[3/4]",
  playfulPets: "aspect-square rounded-[1.5rem]",
  libraryStacks: "aspect-[4/5]",
  beautyGloss: "aspect-[3/4] rounded-[1.75rem]",
  industrialYard: "aspect-[5/4]",
  jewelGallery: "aspect-[4/5]",
};

function ProductCard({
  product,
  currency,
  onOpen,
  onAdd,
  index = 0,
  layout = "editorialRoom",
  className,
}: {
  product: StoreCatalogProduct;
  currency: string;
  onOpen: () => void;
  onAdd: () => void;
  index?: number;
  layout?: StoreLayoutId;
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [product.image]);

  return (
    <Reveal delayMs={(index % 6) * 70} variant={index % 2 === 0 ? "up" : "scale"} className="h-full">
      <article
        className={cx(
          "store-card store-product-card group relative flex h-full flex-col overflow-hidden border p-2 transition",
          productCardClassByLayout[layout],
          className,
        )}
      >
        <button type="button" onClick={onOpen} className="relative block overflow-hidden text-start">
          <div className={cx("store-media overflow-hidden bg-[var(--bg-soft)]", productMediaClassByLayout[layout])}>
            <img
              src={
                product.image && !imageFailed
                  ? product.image
                  : SAFE_IMAGE_FALLBACK
              }
              alt={product.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              onError={(event) => {
                const el = event.currentTarget;
                if (el.dataset.fallback === "1") return;
                el.dataset.fallback = "1";
                setImageFailed(true);
                el.src = SAFE_IMAGE_FALLBACK;
              }}
            />
          </div>
          {product.badge ? (
            <span className="absolute start-4 top-4 bg-[var(--p)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--on-p)]">
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

function SectionHeading({
  eyebrow,
  title,
  text,
  align = "right",
  className,
  giant = false,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "right" | "center";
  className?: string;
  giant?: boolean;
}) {
  return (
    <Reveal className={cx(align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-right", className)}>
      {eyebrow ? (
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{eyebrow}</p>
      ) : null}
      <h2 className={cx("store-display mt-3 font-black leading-tight", giant ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl")}>
        {title}
      </h2>
      {text ? <p className="mt-4 text-base leading-8 text-[var(--muted)]">{text}</p> : null}
    </Reveal>
  );
}

function StatPill({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cx("border border-[var(--line)] bg-[var(--surface)]/70 p-5 text-right", className)}>
      <p className="store-display text-3xl font-black text-[var(--p)]">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">{label}</p>
    </div>
  );
}

export default function StoreSiteRuntime({
  templateId,
  layout,
  defaultData,
  editorCss,
  demoProducts,
  pages,
  businessId,
  data,
  isStudioStatic = false,
  ...navProps
}: StoreSiteRuntimeProps) {
  const layoutId = resolveStoreLayout(templateId, layout);
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
      enabled: !isStudioStatic,
    });

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [cart, setCart] = useState<StoreCartItem[]>([]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!selectedProductId && products[0]) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  const fallbackCategoryImages = [
    g("catOneImage"),
    g("catTwoImage"),
    g("catThreeImage"),
    g("catFourImage"),
  ];

  const categoryTiles: StoreCatalogCategory[] = (
    categories.length
      ? categories.map((cat, index) => ({
          ...cat,
          image:
            cat.image ||
            fallbackCategoryImages[index % fallbackCategoryImages.length] ||
            g("heroImage") ||
            SAFE_IMAGE_FALLBACK,
        }))
      : [
          { id: "1", name: g("catOne"), slug: "c1", image: g("catOneImage") || SAFE_IMAGE_FALLBACK },
          { id: "2", name: g("catTwo"), slug: "c2", image: g("catTwoImage") || SAFE_IMAGE_FALLBACK },
          { id: "3", name: g("catThree"), slug: "c3", image: g("catThreeImage") || SAFE_IMAGE_FALLBACK },
          { id: "4", name: g("catFour"), slug: "c4", image: g("catFourImage") || SAFE_IMAGE_FALLBACK },
        ]
  ).slice(0, 6);

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

  const pickProduct = (index: number) => {
    if (!products.length) return null;
    return products[index % products.length];
  };

  const navigateCategory = (cat: StoreCatalogCategory) => {
    setActiveCategory(cat.slug || "all");
    goToPage("shop");
  };

  const Header = (
    <header
      {...sectionProps("header", "header", "כותרת")}
      className={cx(
        "store-header sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-xl",
        `store-header-${layoutId}`,
      )}
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
          {pages
            .filter((item) => item.id !== "product" && item.id !== "cart")
            .slice(0, 7)
            .map((item) => (
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
        <div className="text-right md:col-span-2">
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

  const fallbackCategoryImages = [
    g("catOneImage"),
    g("catTwoImage"),
    g("catThreeImage"),
    g("catFourImage"),
  ];

  const CategoryTile = ({
    cat,
    index,
    className,
    imageClassName,
    labelClassName,
  }: {
    cat: StoreCatalogCategory;
    index: number;
    className?: string;
    imageClassName?: string;
    labelClassName?: string;
  }) => (
    <Reveal delayMs={index * 80} variant={index % 2 ? "left" : "right"}>
      <button
        type="button"
        onClick={() => navigateCategory(cat)}
        className={cx("store-card group relative w-full overflow-hidden border border-[var(--line)] text-right", className)}
      >
        <StoreImage
          src={cat.image || fallbackCategoryImages[index % fallbackCategoryImages.length] || g("heroImage")}
          alt={cat.name}
          fallbackLabel={cat.name}
          className={cx("h-full w-full object-cover transition duration-700 group-hover:scale-110", imageClassName)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        <div className={cx("absolute inset-x-0 bottom-0 p-5 text-white", labelClassName)}>
          <p className="store-display text-2xl font-black">{cat.name}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/70">לצפייה בקטגוריה</p>
        </div>
      </button>
    </Reveal>
  );

  const ProductRail = ({
    id,
    label,
    title,
    text,
    productsToShow = showcase,
    className,
    railClassName,
  }: {
    id: string;
    label: string;
    title: string;
    text?: string;
    productsToShow?: StoreCatalogProduct[];
    className?: string;
    railClassName?: string;
  }) => (
    <section {...sectionProps(id, "products", label)} className={cx("px-5 py-20 lg:px-8", className)} data-bizuply-widget="products">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow={g("productsEyebrow")} title={title} text={text} />
          <button type="button" onClick={() => goToPage("shop")} className="border border-[var(--line)] px-5 py-3 text-xs font-black uppercase tracking-[0.16em]">
            לכל המוצרים
          </button>
        </div>
        {loading ? (
          <p className="mt-10 text-sm text-[var(--muted)]">טוען מוצרים מתוסף החנות...</p>
        ) : (
          <div className={cx("mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4", railClassName)}>
            {productsToShow.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                index={index}
                layout={layoutId}
                onOpen={() => openProduct(product)}
                onAdd={() => addToCart(product)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );

  const ValuesStrip = ({ className, cardClassName }: { className?: string; cardClassName?: string }) => (
    <section {...sectionProps("values", "values", "ערכים")} className={cx("px-5 py-20 lg:px-8", className)}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {[
          [g("valueOneTitle"), g("valueOneText")],
          [g("valueTwoTitle"), g("valueTwoText")],
          [g("valueThreeTitle"), g("valueThreeText")],
        ].map(([title, text], index) => (
          <Reveal key={title} delayMs={index * 100} variant="up">
            <article className={cx("store-card h-full border border-[var(--line)] bg-[var(--surface)] p-7 text-right", cardClassName)}>
              <p className="text-sm font-black text-[var(--p)]">0{index + 1}</p>
              <h3 className="store-display mt-4 text-2xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );

  const JournalCards = ({ className }: { className?: string }) => (
    <section {...sectionProps("journal", "journal", "יומן")} className={cx("px-5 py-20 lg:px-8", className)}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={g("journalEyebrow")} title={g("journalTitle")} text={g("journalText")} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            [g("journalOneTitle"), g("journalOneText"), g("lookOne")],
            [g("journalTwoTitle"), g("journalTwoText"), g("lookTwo")],
            [g("journalThreeTitle"), g("journalThreeText"), g("lookThree")],
          ].map(([title, text, image], index) => (
            <Reveal key={title} delayMs={index * 90}>
              <article className="store-card overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
                <StoreImage src={image} alt="" fallbackLabel={title} className="aspect-[16/10] w-full object-cover" />
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
  );

  const Newsletter = ({ className }: { className?: string }) => (
    <section {...sectionProps("newsletter", "newsletter", "ניוזלטר")} className={cx("px-5 pb-20 lg:px-8 lg:pb-28", className)}>
      <Reveal>
        <div className="mx-auto grid max-w-7xl items-center gap-8 overflow-hidden border border-[var(--line)] bg-[var(--bg-soft)] p-8 md:grid-cols-2 lg:p-12">
          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{g("newsletterEyebrow")}</p>
            <h2 className="store-display mt-3 text-3xl font-black md:text-4xl">{g("newsletterTitle")}</h2>
            <p className="mt-3 text-[var(--muted)]">{g("newsletterText")}</p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="האימייל שלך" className="min-w-0 flex-1 border border-[var(--line)] bg-[var(--surface)] px-4 py-4 text-sm outline-none focus:border-[var(--p)]" />
            <button type="submit" className="bg-[var(--p)] px-6 py-4 text-sm font-black text-[var(--on-p)]">
              {g("newsletterButton")}
            </button>
          </form>
        </div>
      </Reveal>
    </section>
  );

  const Testimonials = ({ className }: { className?: string }) => (
    <section {...sectionProps("testimonials", "testimonials", "המלצות")} className={cx("bg-[var(--dark)] px-5 py-20 text-white lg:px-8", className)}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={g("testimonialsEyebrow")} title={g("testimonialsTitle")} align="center" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            [g("reviewOneName"), g("reviewOneText")],
            [g("reviewTwoName"), g("reviewTwoText")],
            [g("reviewThreeName"), g("reviewThreeText")],
          ].map(([name, text], index) => (
            <Reveal key={name} delayMs={index * 110} variant="scale">
              <blockquote className="h-full border border-white/15 bg-white/5 p-7 text-right backdrop-blur">
                <p className="text-sm leading-7 text-white/80">"{text}"</p>
                <footer className="mt-6 text-sm font-black text-[var(--accent)]">{name}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );

  const ShippingTeaser = ({ className }: { className?: string }) => (
    <section {...sectionProps("shipping-teaser", "shipping", "משלוחים")} className={cx("px-5 py-16 lg:px-8", className)}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {[g("shipBenefit"), g("returnBenefit"), g("supportBenefit"), g("secureBenefit")].map((text, i) => (
          <Reveal key={text} delayMs={i * 80}>
            <div className="border border-[var(--line)] bg-[var(--surface)] p-5 text-center text-sm font-bold">{text}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );

  const renderHome = () => {
    if (layoutId === "techCinema") {
      const hero = pickProduct(0);
      return (
        <div>
          {Header}
          <section {...sectionProps("cinema-promo", "promo", "פס ניאון")} className="overflow-hidden bg-black text-sky-200">
            <div className="store-marquee whitespace-nowrap py-3 text-xs font-black uppercase tracking-[0.35em]">
              {Array.from({ length: 8 }).map((_, i) => <span key={i} className="mx-8">{g("promoText")}</span>)}
            </div>
          </section>
          <section {...sectionProps("cinema-hero", "hero", "הירו קולנועי")} className="relative min-h-[94vh] overflow-hidden bg-black">
            <StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="absolute inset-0 h-full w-full object-cover opacity-60 store-kenburns" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.25),rgba(0,0,0,0.92))]" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-300/70 shadow-[0_0_40px_#38bdf8]" />
            <div className="relative mx-auto grid min-h-[94vh] max-w-7xl items-end gap-10 px-5 py-24 lg:grid-cols-[1fr_360px] lg:px-8">
              <Reveal variant="left" className="max-w-3xl text-right text-white">
                <p className="inline-flex border border-cyan-300/50 bg-cyan-300/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-cyan-100">{g("heroEyebrow")}</p>
                <h1 className="store-display mt-6 text-6xl font-black leading-[0.95] md:text-8xl">{g("heroTitle")}</h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">{g("heroSubtitle")}</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <button type="button" onClick={() => goToPage("shop")} className="bg-[var(--p)] px-7 py-4 text-sm font-black text-[var(--on-p)]">{g("heroPrimaryButton")}</button>
                  <button type="button" onClick={() => goToPage("collections")} className="border border-white/40 px-7 py-4 text-sm font-black text-white">{g("navCollections") || "קולקציות"}</button>
                </div>
              </Reveal>
              {hero ? (
                <ProductCard product={hero} currency={currency} layout={layoutId} onOpen={() => openProduct(hero)} onAdd={() => addToCart(hero)} />
              ) : null}
            </div>
          </section>
          <section {...sectionProps("neon-rails", "features", "מסילות ניאון")} className="bg-black px-5 py-10 text-white lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
              {["SYNC", "4K READY", "FAST CHARGE", "SMART HOME"].map((value, i) => <StatPill key={value} value={value} label={`מפרט 0${i + 1}`} className="bg-cyan-300/5" />)}
            </div>
          </section>
          <ProductRail id="cinema-scroll" label="סקרולר מוצרים" title={g("productsTitle")} text={g("productsText")} className="bg-[#03080d] text-white" railClassName="flex snap-x overflow-x-auto pb-4 sm:grid-cols-none lg:grid-cols-none [&>*]:min-w-[280px]" />
          <section {...sectionProps("cinema-categories", "categories", "קטגוריות")} className="bg-black px-5 py-20 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <SectionHeading eyebrow={g("categoriesEyebrow")} title={g("categoriesTitle")} text={g("categoriesText")} />
              <div className="mt-12 grid gap-4 md:grid-cols-4">
                {categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[3/5] border-cyan-300/30" />)}
              </div>
            </div>
          </section>
          <section {...sectionProps("cinema-spec-strip", "features", "פס מפרטים")} className="border-y border-cyan-300/20 bg-cyan-300/10 px-5 py-12 text-white lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
              {[g("productDetailOne"), g("productDetailTwo"), g("productDetailThree")].map((text, i) => <Reveal key={text} delayMs={i * 80}><p className="text-right text-sm leading-7 text-cyan-50">{text}</p></Reveal>)}
            </div>
          </section>
          <ValuesStrip className="bg-black text-white" cardClassName="bg-white/5" />
          <section {...sectionProps("cinema-lookbook", "gallery", "לוקבוק")} className="bg-[#03080d] px-5 py-20 text-white lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-12">
              <Reveal className="md:col-span-8"><StoreImage src={g("lookOne")} alt="" fallbackLabel={g("lookbookTitle")} className="aspect-[16/8] w-full object-cover" /></Reveal>
              <div className="grid gap-4 md:col-span-4">
                <StoreImage src={g("lookTwo")} alt="" fallbackLabel={g("lookbookTitle")} className="aspect-square w-full object-cover" />
                <StoreImage src={g("lookThree")} alt="" fallbackLabel={g("lookbookTitle")} className="aspect-square w-full object-cover" />
              </div>
            </div>
          </section>
          <Testimonials />
          <JournalCards className="bg-black text-white" />
          <Newsletter className="bg-black text-white" />
          {Footer}
        </div>
      );
    }

    if (layoutId === "marketBento") {
      return (
        <div>
          {Header}
          <section {...sectionProps("market-hero", "hero", "בנטו שוק")} className="px-5 py-16 lg:px-8 lg:py-24">
            <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-12">
              <Reveal className="rounded-[2rem] bg-[var(--dark)] p-8 text-right text-white md:col-span-5 lg:p-12">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--accent)]">{g("heroEyebrow")}</p>
                <h1 className="store-display mt-5 text-5xl font-black md:text-6xl">{g("heroTitle")}</h1>
                <p className="mt-5 leading-8 text-white/70">{g("heroSubtitle")}</p>
                <button type="button" onClick={() => goToPage("shop")} className="mt-8 rounded-full bg-[var(--accent)] px-7 py-4 text-sm font-black text-[var(--dark)]">{g("heroPrimaryButton")}</button>
              </Reveal>
              <Reveal className="md:col-span-4"><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="h-full min-h-[360px] rounded-[2rem] object-cover" /></Reveal>
              <div className="grid gap-5 md:col-span-3">
                {categoryTiles.slice(0, 2).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-square rounded-[2rem]" />)}
              </div>
            </div>
          </section>
          <section {...sectionProps("produce-crates", "categories", "ארגזי תוצרת")} className="px-5 pb-20 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[5/4] rounded-[1.5rem]" />)}
            </div>
          </section>
          <section {...sectionProps("seasonal-banner", "promo", "עונתי")} className="px-5 py-10 lg:px-8">
            <div className="mx-auto rounded-[2rem] border border-[var(--line)] bg-[var(--p)] p-8 text-center text-[var(--on-p)] max-w-7xl">
              <p className="store-display text-4xl font-black">{g("promoText")}</p>
            </div>
          </section>
          <ProductRail id="market-products" label="דוכני מוצרים" title={g("productsTitle")} text={g("productsText")} railClassName="lg:grid-cols-3" />
          <section {...sectionProps("harvest-story", "about", "סיפור הקטיף")} className="bg-[var(--bg-soft)] px-5 py-20 lg:px-8">
            <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2">
              <StoreImage src={g("aboutImage")} alt="" fallbackLabel={g("aboutTitle")} className="aspect-[5/4] rounded-[2rem] object-cover" />
              <SectionHeading eyebrow={g("aboutEyebrow")} title={g("aboutTitle")} text={g("aboutText")} />
            </div>
          </section>
          <section {...sectionProps("market-stats", "features", "מדדי טריות")} className="px-5 py-16 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
              <StatPill value="06:00" label="קטיף בוקר" className="rounded-[2rem]" />
              <StatPill value="4" label="משקי מקור" className="rounded-[2rem]" />
              <StatPill value="24h" label="עד הסל" className="rounded-[2rem]" />
              <StatPill value="0" label="אריזות מיותרות" className="rounded-[2rem]" />
            </div>
          </section>
          <ValuesStrip cardClassName="rounded-[2rem]" />
          <JournalCards className="bg-[var(--bg-soft)]" />
          <Testimonials />
          <ShippingTeaser />
          <Newsletter />
          {Footer}
        </div>
      );
    }

    if (layoutId === "athleticStack") {
      const spotlights = [pickProduct(0), pickProduct(1), pickProduct(2)].filter(Boolean) as StoreCatalogProduct[];
      return (
        <div>
          {Header}
          <section {...sectionProps("athletic-ticker", "promo", "טיקר ביצועים")} className="overflow-hidden bg-[var(--p)] text-[var(--on-p)]">
            <div className="store-marquee whitespace-nowrap py-3 text-xs font-black uppercase tracking-[0.35em]">
              {Array.from({ length: 10 }).map((_, i) => <span key={i} className="mx-8">{g("promoText")}</span>)}
            </div>
          </section>
          <section {...sectionProps("athletic-hero", "hero", "פאנלים אתלטיים")} className="px-5 py-14 lg:px-8 lg:py-20">
            <div className="mx-auto grid max-w-7xl gap-5">
              {[g("heroTitle"), g("heroSubtitle"), g("tagline")].map((line, index) => (
                <Reveal key={line} delayMs={index * 90}>
                  <div className={cx("store-athletic-panel border border-[var(--line)] bg-[var(--dark)] p-8 text-white", index === 1 && "ms-8 bg-[var(--p)] text-[var(--on-p)]", index === 2 && "me-12 bg-[var(--surface)] text-[var(--text)]")}>
                    <p className="store-display text-5xl font-black uppercase leading-none md:text-8xl">{line}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
          <section {...sectionProps("athletic-stats", "features", "סטטיסטיקות")} className="px-5 py-12 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
              <StatPill value="+42%" label="קצב אימון" />
              <StatPill value="8" label="קטגוריות כוח" />
              <StatPill value="24/7" label="מוכנות" />
              <StatPill value="0" label="פשרות" />
            </div>
          </section>
          {spotlights.map((product, index) => (
            <section key={product.id} {...sectionProps(`athletic-spot-${index + 1}`, "product", "ספוטלייט מוצר")} className="px-5 py-12 lg:px-8">
              <div className={cx("mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2", index % 2 ? "lg:[&>div:first-child]:order-2" : "")}>
                <StoreImage src={product.image} alt={product.name} fallbackLabel={product.name} className="aspect-[16/10] w-full object-cover" />
                <Reveal className="text-right">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{product.category}</p>
                  <h2 className="store-display mt-4 text-5xl font-black">{product.name}</h2>
                  <p className="mt-4 text-2xl font-black text-[var(--p)]">{formatStorePrice(product.price, currency)}</p>
                  <p className="mt-4 text-[var(--muted)]">{product.shortDescription}</p>
                  <button type="button" onClick={() => openProduct(product)} className="mt-7 bg-[var(--dark)] px-7 py-4 text-sm font-black text-white">בדיקת ציוד</button>
                </Reveal>
              </div>
            </section>
          ))}
          <section {...sectionProps("athletic-cats", "categories", "מחלקות אימון")} className="bg-[var(--dark)] px-5 py-20 text-white lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[4/3]" />)}</div>
          </section>
          <ProductRail id="athletic-grid" label="גריד ציוד" title={g("productsTitle")} text={g("productsText")} />
          <ValuesStrip className="bg-[var(--bg-soft)]" />
          <Testimonials />
          <JournalCards />
          <Newsletter />
          {Footer}
        </div>
      );
    }

    if (layoutId === "softCloud") {
      return (
        <div>
          {Header}
          <section {...sectionProps("cloud-hero", "hero", "ענן רך")} className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
            <div className="absolute end-[-8rem] top-10 h-80 w-80 rounded-full bg-[var(--accent)]/50 blur-3xl" />
            <div className="absolute start-[-6rem] bottom-0 h-96 w-96 rounded-full bg-[var(--p)]/20 blur-3xl" />
            <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
              <Reveal className="text-right">
                <p className="rounded-full bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--p)]">{g("heroEyebrow")}</p>
                <h1 className="store-display mt-6 text-5xl font-black leading-tight md:text-7xl">{g("heroTitle")}</h1>
                <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p>
                <button type="button" onClick={() => goToPage("shop")} className="mt-8 rounded-full bg-[var(--p)] px-7 py-4 text-sm font-black text-[var(--on-p)]">{g("heroPrimaryButton")}</button>
              </Reveal>
              <Reveal variant="scale"><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="store-cloud-drift aspect-square w-full rounded-[45%_55%_60%_40%] object-cover" /></Reveal>
            </div>
          </section>
          <section {...sectionProps("pastel-path", "features", "שביל פסטל")} className="px-5 py-12 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">
              {["להרגיע", "לעטוף", "לשחק", "לגדול"].map((step, index) => <StatPill key={step} value={`0${index + 1}`} label={step} className="rounded-[2rem]" />)}
            </div>
          </section>
          <ProductRail id="gentle-carousel" label="קרוסלת מוצרים עדינה" title={g("productsTitle")} text={g("productsText")} railClassName="flex overflow-x-auto pb-4 sm:grid-cols-none lg:grid-cols-none [&>*]:min-w-[260px]" />
          <section {...sectionProps("nursery-categories", "categories", "חדרי תינוקות")} className="bg-[var(--bg-soft)] px-5 py-20 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
              {categoryTiles.slice(0, 6).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-square rounded-[40%_60%_50%_50%]" />)}
            </div>
          </section>
          <ValuesStrip cardClassName="rounded-[2.5rem]" />
          <section {...sectionProps("cloud-story", "about", "סיפור רך")} className="px-5 py-20 lg:px-8">
            <div className="mx-auto max-w-4xl rounded-[3rem] bg-white p-10 text-center shadow-xl">
              <SectionHeading eyebrow={g("aboutEyebrow")} title={g("aboutTitle")} text={g("aboutText")} align="center" />
            </div>
          </section>
          <section {...sectionProps("cloud-lookbook", "gallery", "לוקבוק עננים")} className="px-5 py-20 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
              {[g("lookOne"), g("lookTwo"), g("lookThree")].map((image, index) => <StoreImage key={image} src={image} alt="" fallbackLabel={g("lookbookTitle")} className={cx("w-full object-cover", index === 1 ? "aspect-[3/4] rounded-[3rem]" : "aspect-square rounded-full")} />)}
            </div>
          </section>
          <Testimonials className="rounded-t-[4rem]" />
          <JournalCards />
          <ShippingTeaser className="bg-[var(--bg-soft)]" />
          <Newsletter />
          {Footer}
        </div>
      );
    }

    if (layoutId === "editorialRoom") {
      return (
        <div>
          {Header}
          <section {...sectionProps("editorial-cover", "hero", "שער מגזין")} className="px-5 py-16 lg:px-8 lg:py-24">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <Reveal className="text-right">
                <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--p)]">{g("heroEyebrow")}</p>
                <h1 className="store-display mt-4 text-6xl font-black leading-none md:text-8xl">{g("heroTitle")}</h1>
                <p className="mt-6 border-y border-[var(--line)] py-6 text-lg leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p>
              </Reveal>
              <StoreImage src={g("lookOne")} alt="" fallbackLabel={g("lookbookTitle")} className="aspect-[4/5] w-full object-cover" />
            </div>
          </section>
          <section {...sectionProps("room-scenes", "gallery", "סצנות חדרים")} className="px-5 py-16 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-12">
              <StoreImage src={g("lookTwo")} alt="" fallbackLabel={g("lookbookTitle")} className="aspect-[16/9] w-full object-cover md:col-span-7" />
              <StoreImage src={g("lookThree")} alt="" fallbackLabel={g("lookbookTitle")} className="aspect-[4/5] w-full object-cover md:col-span-5" />
            </div>
          </section>
          <ProductRail id="editor-picks" label="בחירות מערכת" title={g("productsTitle")} text={g("productsText")} className="bg-[var(--bg-soft)]" railClassName="lg:grid-cols-3" />
          <section {...sectionProps("editorial-categories", "categories", "מדורי הבית")} className="px-5 py-20 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[3/4]" />)}</div>
          </section>
          <ValuesStrip className="border-y border-[var(--line)]" />
          <section {...sectionProps("material-note", "features", "חומרים")} className="px-5 py-20 lg:px-8">
            <div className="mx-auto max-w-5xl text-center">
              <p className="store-display text-5xl font-black leading-tight">{g("productDetailOne")} {g("productDetailTwo")}</p>
            </div>
          </section>
          <section {...sectionProps("house-story", "about", "סיפור הבית")} className="bg-[var(--dark)] px-5 py-20 text-white lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2"><SectionHeading eyebrow={g("aboutEyebrow")} title={g("aboutTitle")} text={g("aboutText")} /><StoreImage src={g("aboutImage")} alt="" fallbackLabel={g("aboutTitle")} className="aspect-[5/4] w-full object-cover" /></div>
          </section>
          <Testimonials />
          <JournalCards />
          <ShippingTeaser />
          <Newsletter />
          {Footer}
        </div>
      );
    }

    if (layoutId === "playfulPets") {
      return (
        <div>
          {Header}
          <section {...sectionProps("pet-diagonal-promo", "promo", "פס אלכסוני")} className="store-diagonal-band bg-[var(--p)] px-5 py-5 text-[var(--on-p)] lg:px-8">
            <p className="text-center text-sm font-black uppercase tracking-[0.28em]">{g("promoText")}</p>
          </section>
          <section {...sectionProps("pet-hero", "hero", "משחקים באלכסון")} className="relative overflow-hidden px-5 py-20 lg:px-8">
            <div className="absolute inset-0 store-paw-pattern opacity-20" />
            <div className="relative mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2">
              <Reveal className="text-right">
                <p className="inline-flex rounded-full bg-[var(--accent)] px-5 py-2 text-xs font-black uppercase tracking-[0.24em]">{g("heroEyebrow")}</p>
                <h1 className="store-display mt-5 text-6xl font-black leading-none md:text-8xl">{g("heroTitle")}</h1>
                <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p>
                <button type="button" onClick={() => goToPage("shop")} className="mt-8 rounded-full bg-[var(--dark)] px-7 py-4 text-sm font-black text-white">{g("heroPrimaryButton")}</button>
              </Reveal>
              <StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="store-wiggle aspect-[5/4] w-full rounded-[2rem] object-cover" />
            </div>
          </section>
          <section {...sectionProps("paw-stats", "features", "טביעות כף")} className="px-5 py-12 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{["כיף", "נשנוש", "טיול", "שינה"].map((x, i) => <StatPill key={x} value="PAW" label={`${x} 0${i + 1}`} className="rounded-[2rem]" />)}</div></section>
          <section {...sectionProps("pet-rounded-tiles", "categories", "אריחי חיות")} className="bg-[var(--bg-soft)] px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-square rounded-[2.5rem]" />)}</div></section>
          <ProductRail id="pet-toy-products" label="צעצועים ומוצרים" title={g("productsTitle")} text={g("productsText")} railClassName="lg:grid-cols-4" />
          <section {...sectionProps("pet-story", "about", "סיפור להקה")} className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 rounded-[3rem] bg-[var(--accent)]/30 p-8 md:grid-cols-2"><StoreImage src={g("aboutImage")} alt="" fallbackLabel={g("aboutTitle")} className="aspect-square rounded-[2rem] object-cover" /><SectionHeading eyebrow={g("aboutEyebrow")} title={g("aboutTitle")} text={g("aboutText")} /></div></section>
          <ValuesStrip cardClassName="rounded-[2rem]" />
          <Testimonials />
          <JournalCards className="bg-[var(--bg-soft)]" />
          <ShippingTeaser />
          <Newsletter />
          {Footer}
        </div>
      );
    }

    if (layoutId === "libraryStacks") {
      return (
        <div>
          {Header}
          <section {...sectionProps("chapter-hero", "hero", "פרק ראשון")} className="px-5 py-20 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-5xl border-x border-[var(--line)] px-8 text-center">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--p)]">פרק 01 / {g("heroEyebrow")}</p>
              <h1 className="store-display mt-6 text-6xl font-black leading-tight md:text-8xl">{g("heroTitle")}</h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p>
            </div>
          </section>
          <section {...sectionProps("quote-interlude", "quote", "ציטוט")} className="bg-[var(--dark)] px-5 py-16 text-white lg:px-8"><blockquote className="mx-auto max-w-4xl text-center store-display text-4xl leading-tight">"{g("tagline")}"</blockquote></section>
          <section {...sectionProps("shelf-categories", "categories", "מדפי קטגוריות")} className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[16/4]" />)}</div></section>
          <ProductRail id="book-shelves" label="שורות מדף" title={g("productsTitle")} text={g("productsText")} railClassName="lg:grid-cols-4" />
          <section {...sectionProps("reading-path", "features", "מסלול קריאה")} className="bg-[var(--bg-soft)] px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-3">{[g("valueOneTitle"), g("valueTwoTitle"), g("valueThreeTitle")].map((x, i) => <div key={x} className="border border-[var(--line)] bg-[var(--surface)] p-8 text-right"><p className="store-display text-5xl text-[var(--p)]">{i + 1}</p><h3 className="mt-4 font-black">{x}</h3></div>)}</div></section>
          <section {...sectionProps("author-story", "about", "הערת העורך")} className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.7fr_1.3fr]"><StoreImage src={g("aboutImage")} alt="" fallbackLabel={g("aboutTitle")} className="aspect-[3/4] object-cover" /><SectionHeading eyebrow={g("aboutEyebrow")} title={g("aboutTitle")} text={g("aboutText")} /></div></section>
          <section {...sectionProps("book-lookbook", "gallery", "עמודי השראה")} className="px-5 py-16 lg:px-8"><div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">{[g("lookOne"), g("lookTwo"), g("lookThree")].map((image) => <StoreImage key={image} src={image} alt="" fallbackLabel={g("lookbookTitle")} className="aspect-[3/4] object-cover" />)}</div></section>
          <Testimonials />
          <JournalCards />
          <ShippingTeaser />
          <Newsletter />
          {Footer}
        </div>
      );
    }

    if (layoutId === "beautyGloss") {
      return (
        <div>
          {Header}
          <section {...sectionProps("gloss-hero", "hero", "יופי מבריק")} className="relative overflow-hidden bg-[var(--dark)] px-5 py-20 text-white lg:px-8 lg:py-28">
            <div className="absolute inset-x-0 top-1/3 h-28 store-shimmer-strip bg-white/10" />
            <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
              <Reveal className="text-right"><p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--accent)]">{g("heroEyebrow")}</p><h1 className="store-display mt-5 text-6xl font-black md:text-8xl">{g("heroTitle")}</h1><p className="mt-6 text-lg leading-8 text-white/70">{g("heroSubtitle")}</p><button type="button" onClick={() => goToPage("shop")} className="mt-8 rounded-full bg-white px-8 py-4 text-sm font-black text-[var(--dark)]">{g("heroPrimaryButton")}</button></Reveal>
              <StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="aspect-[4/5] rounded-[2rem] object-cover" />
            </div>
          </section>
          <section {...sectionProps("ritual-split", "features", "טקסים מפוצלים")} className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">{[g("valueOneTitle"), g("valueTwoTitle"), g("valueThreeTitle")].map((title, i) => <Reveal key={title} delayMs={i * 90}><div className="rounded-[2rem] bg-[var(--bg-soft)] p-8 text-right"><p className="text-[var(--p)]">RITUAL 0{i + 1}</p><h3 className="store-display mt-3 text-3xl font-black">{title}</h3></div></Reveal>)}</div></section>
          <ProductRail id="gloss-portraits" label="פורטרטים מוצר" title={g("productsTitle")} text={g("productsText")} railClassName="lg:grid-cols-3" />
          <section {...sectionProps("beauty-categories", "categories", "טקסי יופי")} className="bg-[var(--dark)] px-5 py-20 text-white lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[3/4] rounded-[2rem]" />)}</div></section>
          <section {...sectionProps("ingredient-glow", "features", "מרכיבים")} className="px-5 py-20 lg:px-8"><div className="mx-auto max-w-4xl text-center"><p className="store-display text-5xl font-black">{g("productDetailOne")}</p><p className="mt-5 text-[var(--muted)]">{g("productDetailTwo")}</p></div></section>
          <section {...sectionProps("gloss-gallery", "gallery", "גלוס")} className="px-5 py-16 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-12"><StoreImage src={g("lookOne")} alt="" fallbackLabel={g("lookbookTitle")} className="aspect-[16/9] object-cover md:col-span-8" /><StoreImage src={g("lookTwo")} alt="" fallbackLabel={g("lookbookTitle")} className="aspect-square object-cover md:col-span-4" /></div></section>
          <ValuesStrip className="bg-[var(--bg-soft)]" cardClassName="rounded-[2rem]" />
          <Testimonials />
          <JournalCards />
          <Newsletter />
          {Footer}
        </div>
      );
    }

    if (layoutId === "industrialYard") {
      return (
        <div>
          {Header}
          <section {...sectionProps("blueprint-hero", "hero", "גריד בלופרינט")} className="store-blueprint-grid bg-slate-950 px-5 py-20 text-white lg:px-8 lg:py-28">
            <div className="mx-auto grid max-w-7xl items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <Reveal className="text-right"><p className="text-xs font-black uppercase tracking-[0.32em] text-yellow-300">{g("heroEyebrow")}</p><h1 className="store-display mt-5 text-6xl font-black uppercase leading-none md:text-8xl">{g("heroTitle")}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{g("heroSubtitle")}</p></Reveal>
              <StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="aspect-square object-cover" />
            </div>
          </section>
          <section {...sectionProps("numbered-process", "features", "תהליך ממוספר")} className="px-5 py-16 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{["מדידה", "חיתוך", "חיבור", "בדיקה"].map((x, i) => <StatPill key={x} value={`0${i + 1}`} label={x} />)}</div></section>
          <ProductRail id="tool-benches" label="ספסלי מוצרים" title={g("productsTitle")} text={g("productsText")} className="bg-[var(--dark)] text-white" railClassName="lg:grid-cols-4" />
          <section {...sectionProps("yard-categories", "categories", "קירות כלים")} className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[4/5]" />)}</div></section>
          <section {...sectionProps("spec-table", "features", "טבלת מפרטים")} className="bg-slate-950 px-5 py-20 text-white lg:px-8"><div className="mx-auto max-w-7xl divide-y divide-yellow-300/30 border-y border-yellow-300/30">{[g("productDetailOne"), g("productDetailTwo"), g("productDetailThree")].map((text, i) => <div key={text} className="grid gap-4 py-6 md:grid-cols-[120px_1fr]"><strong>SPEC 0{i + 1}</strong><p>{text}</p></div>)}</div></section>
          <section {...sectionProps("project-story", "about", "סיפור פרויקט")} className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2"><StoreImage src={g("aboutImage")} alt="" fallbackLabel={g("aboutTitle")} className="aspect-[16/10] object-cover" /><SectionHeading eyebrow={g("aboutEyebrow")} title={g("aboutTitle")} text={g("aboutText")} /></div></section>
          <ValuesStrip className="bg-[var(--bg-soft)]" />
          <Testimonials />
          <JournalCards />
          <ShippingTeaser />
          <Newsletter />
          {Footer}
        </div>
      );
    }

    return (
      <div>
        {Header}
        <section {...sectionProps("jewel-hero", "hero", "גלריה מינימלית")} className="px-5 py-24 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.4em] text-[var(--p)]">{g("heroEyebrow")}</p>
            <h1 className="store-display mx-auto mt-8 max-w-5xl text-7xl font-light leading-none md:text-9xl">{g("heroTitle")}</h1>
            <p className="mx-auto mt-8 max-w-xl text-sm leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p>
          </div>
        </section>
        <section {...sectionProps("thin-rule", "divider", "קו דק")} className="px-5 lg:px-8"><div className="mx-auto h-px max-w-7xl bg-[var(--line)]" /></section>
        {[pickProduct(0), pickProduct(1), pickProduct(2)].filter(Boolean).map((product, index) => {
          const item = product as StoreCatalogProduct;
          return (
            <section key={item.id} {...sectionProps(`jewel-stage-${index + 1}`, "product", "במת מוצר")} className="px-5 py-20 lg:px-8">
              <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
                <StoreImage src={item.image} alt={item.name} fallbackLabel={item.name} className="aspect-[4/5] w-full object-cover" />
                <Reveal className="text-right"><p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">{item.category}</p><h2 className="store-display mt-6 text-6xl font-light">{item.name}</h2><p className="mt-5 text-2xl text-[var(--p)]">{formatStorePrice(item.price, currency)}</p><button type="button" onClick={() => openProduct(item)} className="mt-8 border border-[var(--line)] px-8 py-4 text-xs font-black uppercase tracking-[0.2em]">התבוננות</button></Reveal>
              </div>
            </section>
          );
        })}
        <section {...sectionProps("jewel-categories", "categories", "אוספים")} className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[3/4]" />)}</div></section>
        <section {...sectionProps("material-silence", "features", "חומרים")} className="px-5 py-24 lg:px-8"><div className="mx-auto max-w-3xl text-center"><p className="store-display text-5xl font-light leading-tight">{g("productDetailOne")}</p></div></section>
        <section {...sectionProps("jewel-gallery", "gallery", "גלריה")} className="px-5 py-16 lg:px-8"><div className="mx-auto grid max-w-7xl gap-1 md:grid-cols-3">{[g("lookOne"), g("lookTwo"), g("lookThree")].map((image) => <StoreImage key={image} src={image} alt="" fallbackLabel={g("lookbookTitle")} className="aspect-[4/5] object-cover" />)}</div></section>
        <Testimonials className="bg-transparent text-[var(--text)]" />
        <JournalCards />
        <Newsletter />
        {Footer}
      </div>
    );
  };

  const homeContent = renderHome();

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
            {categoryTiles.map((cat) => (
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
              placeholder="חיפוש מוצר..."
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
              <option value="name">שם א-ת</option>
            </select>
          </div>
        </div>
      </section>

      <section {...sectionProps("shop-grid", "products", "רשת מוצרים")} className="px-5 py-16 lg:px-8 lg:py-20" data-bizuply-widget="products">
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
                layout={layoutId}
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
      <ShippingTeaser className="bg-[var(--bg-soft)]" />
      {Footer}
    </div>
  );

  const collectionsContent = (
    <div>
      {Header}
      <section {...sectionProps("collections-hero", "hero", "קולקציות")} className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow={g("collectionsEyebrow")} title={g("collectionsTitle")} text={g("collectionsText")} giant />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryTiles.slice(0, 4).map((cat, index) => (
              <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[4/5]" />
            ))}
          </div>
        </div>
      </section>
      <section {...sectionProps("collection-rows", "products", "שורות קולקציה")} className="bg-[var(--bg-soft)] px-5 py-16 lg:px-8" data-bizuply-widget="products">
        <div className="mx-auto grid max-w-7xl gap-10">
          {categoryTiles.slice(0, 4).map((cat) => {
            const items = products.filter((product) => product.categorySlug === cat.slug || product.category === cat.name).slice(0, 4);
            const displayItems = items.length ? items : showcase.slice(0, 4);
            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
                  <h2 className="store-display text-3xl font-black">{cat.name}</h2>
                  <button type="button" onClick={() => navigateCategory(cat)} className="text-xs font-black uppercase tracking-[0.18em] text-[var(--p)]">לצפייה</button>
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {displayItems.map((product, index) => (
                    <ProductCard key={`${cat.id}-${product.id}`} product={product} currency={currency} index={index} layout={layoutId} onOpen={() => openProduct(product)} onAdd={() => addToCart(product)} />
                  ))}
                </div>
              </div>
            );
          })}
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
                <StoreImage src={selectedProduct.image} alt={selectedProduct.name} fallbackLabel={selectedProduct.name} className="aspect-square w-full object-cover" />
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
                  layout={layoutId}
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
                    <StoreImage src={item.image} alt="" fallbackLabel={item.name} className="h-20 w-16 object-cover" />
                    <div className="text-right">
                      <p className="font-black">{item.name}</p>
                      <p className="text-sm text-[var(--muted)]">{formatStorePrice(item.price, currency)} x {item.qty}</p>
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
              <p className="text-xl font-black">סה"כ: {formatStorePrice(cartTotal, currency)}</p>
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

  const lookbookContent = (
    <div>
      {Header}
      <section {...sectionProps("lookbook-main", "gallery", "לוקבוק")} className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow={g("lookbookEyebrow")} title={g("lookbookTitle")} text={g("lookbookText")} giant />
          <div className="mt-12 grid gap-4 md:grid-cols-12">
            <StoreImage src={g("lookOne")} alt="" fallbackLabel={g("lookbookTitle")} className="aspect-[16/10] w-full object-cover md:col-span-7" />
            <div className="grid gap-4 md:col-span-5">
              <StoreImage src={g("lookTwo")} alt="" fallbackLabel={g("lookbookTitle")} className="aspect-[16/10] w-full object-cover" />
              <StoreImage src={g("lookThree")} alt="" fallbackLabel={g("lookbookTitle")} className="aspect-[16/10] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>
      <ProductRail id="lookbook-products" label="מוצרים מתוך הלוקבוק" title={g("productsTitle")} text={g("productsText")} className="bg-[var(--bg-soft)]" />
      {Footer}
    </div>
  );

  const aboutContent = (
    <div>
      {Header}
      <section {...sectionProps("about-hero", "hero", "אודות")} className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <Reveal variant="right"><StoreImage src={g("aboutImage")} alt="" fallbackLabel={g("aboutTitle")} className="aspect-[5/4] w-full object-cover" /></Reveal>
          <Reveal variant="left" className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{g("aboutEyebrow")}</p>
            <h1 className="store-display mt-4 text-5xl font-black">{g("aboutTitle")}</h1>
            <p className="mt-6 text-base leading-8 text-[var(--muted)]">{g("aboutText")}</p>
            <p className="mt-4 text-base leading-8 text-[var(--muted)]">{g("aboutTextTwo")}</p>
          </Reveal>
        </div>
      </section>
      <ValuesStrip className="bg-[var(--bg-soft)]" />
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

  const journalContent = (
    <div>
      {Header}
      <JournalCards />
      <Newsletter />
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

  // Mount only the active page so store templates stay fast in editor/public.
  // Cart/product selection state lives above, so navigation remains correct.
  const activeContent =
    currentPage === "shop"
      ? shopContent
      : currentPage === "collections"
        ? collectionsContent
        : currentPage === "product"
          ? productContent
          : currentPage === "cart"
            ? cartContent
            : currentPage === "lookbook"
              ? lookbookContent
              : currentPage === "about"
                ? aboutContent
                : currentPage === "journal"
                  ? journalContent
                  : currentPage === "contact"
                    ? contactContent
                    : currentPage === "faq"
                      ? faqContent
                      : currentPage === "shipping"
                        ? shippingContent
                        : homeContent;

  const stackPages = [{ id: currentPage || "home", content: activeContent }];

  return (
    <div
      dir="rtl"
      data-template-id={templateId}
      data-store-layout={layoutId}
      data-bizuply-site="true"
      data-store-plugin="true"
      className="min-h-screen w-full overflow-x-hidden bg-[var(--bg)] text-[var(--text)]"
    >
      <style dangerouslySetInnerHTML={{ __html: editorCss }} />
      <VisualPageStack activePageId={currentPage || "home"} pages={stackPages} />
    </div>
  );
}
