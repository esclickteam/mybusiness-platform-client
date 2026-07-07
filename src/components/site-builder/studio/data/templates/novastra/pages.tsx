import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Gift,
  Menu,
  MessageCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";

import { novastraDefaultData } from "./defaultData";
import { novastraEditorCss } from "./editorCss";

type TemplateMode = "preview" | "editor" | "public";

type NovastraImageItem = {
  src: string;
  alt?: string;
  label?: string;
  title?: string;
  text?: string;
};

type NovastraProduct = {
  title: string;
  category?: string;
  price?: string;
  badge?: string;
  image: string;
};

type NovastraReview = {
  quote: string;
  name: string;
  meta?: string;
  avatar?: string;
};

type NovastraArticle = {
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
};

type NovastraFaq = {
  question: string;
  answer: string;
};

type NovastraData = typeof novastraDefaultData & {
  heroImages?: NovastraImageItem[];
  products?: NovastraProduct[];
  categories?: NovastraImageItem[];
  promoCards?: NovastraImageItem[];
  reviews?: NovastraReview[];
  articles?: NovastraArticle[];
  faqs?: NovastraFaq[];
};

type NovastraPagesProps = {
  initialPage?: string;
  mode?: TemplateMode;
  data?: Partial<NovastraData>;
  onNavigate?: (pageId: string) => void;
};

function mergeTemplateData(data?: Partial<NovastraData>): NovastraData {
  return {
    ...novastraDefaultData,
    ...(data || {}),
    heroImages: data?.heroImages?.length ? data.heroImages : novastraDefaultData.heroImages,
    products: data?.products?.length ? data.products : novastraDefaultData.products,
    categories: data?.categories?.length ? data.categories : novastraDefaultData.categories,
    promoCards: data?.promoCards?.length ? data.promoCards : novastraDefaultData.promoCards,
    reviews: data?.reviews?.length ? data.reviews : novastraDefaultData.reviews,
    articles: data?.articles?.length ? data.articles : novastraDefaultData.articles,
    faqs: data?.faqs?.length ? data.faqs : novastraDefaultData.faqs,
  };
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-300">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </p>
  );
}

function Button({
  children,
  dark = false,
  className,
  onClick,
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300",
        "focus:outline-none focus:ring-2 focus:ring-zinc-900/30 focus:ring-offset-2",
        dark
          ? "bg-zinc-950 text-white hover:-translate-y-0.5 hover:bg-zinc-800"
          : "bg-white text-zinc-950 hover:-translate-y-0.5 hover:bg-zinc-100",
        className,
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
    </button>
  );
}

function Header({
  data,
  currentPage,
  onNavigate,
}: {
  data: NovastraData;
  currentPage: string;
  onNavigate: (pageId: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "home", label: data.navHome },
    { id: "collection", label: data.navShop },
    { id: "journal", label: data.navJournal },
    { id: "contact", label: data.navContact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/88 text-white backdrop-blur-2xl">
      <div className="flex min-h-[42px] items-center justify-center border-b border-white/10 bg-white px-4 text-center text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-950">
        {data.announcement}
      </div>

      <div className="mx-auto flex max-w-[1480px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 text-left"
          aria-label="Novastra home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white text-sm font-black text-zinc-950">
            N
          </span>
          <span className="text-2xl font-black uppercase tracking-[-0.05em] sm:text-3xl">
            {data.brandName}
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white"
            >
              {data.navShop}
              <ChevronDown className="h-4 w-4" />
            </button>

            <div className="pointer-events-none absolute left-0 top-full w-[760px] translate-y-4 rounded-[2rem] border border-white/10 bg-zinc-950/95 p-5 opacity-0 shadow-2xl shadow-black/40 backdrop-blur-2xl transition duration-300 group-hover:pointer-events-auto group-hover:translate-y-3 group-hover:opacity-100">
              <div className="grid grid-cols-[1fr_1fr_1.25fr] gap-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                    Category
                  </p>
                  <div className="space-y-2 text-sm font-semibold text-zinc-100">
                    {data.megaCategories.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => onNavigate("collection")}
                        className="block w-full rounded-xl px-3 py-2 text-left transition hover:bg-white/10"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                    Collections
                  </p>
                  <div className="space-y-2 text-sm font-semibold text-zinc-100">
                    {data.megaCollections.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => onNavigate("collection")}
                        className="block w-full rounded-xl px-3 py-2 text-left transition hover:bg-white/10"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate("collection")}
                  className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-900 text-left"
                >
                  <img
                    src={data.megaImage}
                    alt=""
                    className="h-full min-h-[210px] w-full object-cover opacity-80 transition duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">
                      Featured
                    </p>
                    <p className="mt-1 text-xl font-black">{data.megaTitle}</p>
                    <p className="mt-1 text-sm text-zinc-300">{data.megaText}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {navItems.slice(1).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cx(
                "rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white/10 hover:text-white",
                currentPage === item.id ? "bg-white text-zinc-950" : "text-zinc-200",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white hover:text-zinc-950"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white px-4 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200"
          >
            <ShoppingBag className="h-4 w-4" />
            {data.cartLabel}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[80] bg-zinc-950/95 p-4 text-white backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black uppercase tracking-[-0.05em]">{data.brandName}</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-zinc-950"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-10 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-xl font-black"
              >
                {item.label}
                <ArrowRight className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Hero({ data, onNavigate }: { data: NovastraData; onNavigate: (pageId: string) => void }) {
  return (
    <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
      <div className="absolute left-1/2 top-0 -z-10 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-12 right-10 -z-10 hidden h-[300px] w-[300px] rounded-full bg-zinc-600/20 blur-3xl lg:block" />

      <div className="mx-auto grid min-h-[calc(100vh-112px)] max-w-[1480px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <SectionEyebrow>{data.heroEyebrow}</SectionEyebrow>
          <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.82] tracking-[-0.085em] sm:text-7xl md:text-8xl xl:text-[9.4rem]">
            {data.heroTitle}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-zinc-300 sm:text-lg">
            {data.heroText}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => onNavigate("collection")}>{data.primaryCta}</Button>
            <Button dark className="border border-white/15 bg-white/5" onClick={() => onNavigate("journal")}>
              {data.secondaryCta}
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {data.popularSearches.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[600px]">
          <div className="absolute left-[2%] top-[2%] h-[46%] w-[38%] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/40 novastra-float-slow">
            <img src={data.heroImages[0]?.src} alt={data.heroImages[0]?.alt || ""} className="h-full w-full object-cover" />
          </div>

          <div className="absolute right-[4%] top-[0%] h-[58%] w-[44%] overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/40 novastra-float-medium">
            <img src={data.heroImages[1]?.src} alt={data.heroImages[1]?.alt || ""} className="h-full w-full object-cover" />
          </div>

          <div className="absolute bottom-[7%] left-[15%] h-[42%] w-[48%] overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/40 novastra-float-fast">
            <img src={data.heroImages[2]?.src} alt={data.heroImages[2]?.alt || ""} className="h-full w-full object-cover" />
          </div>

          <div className="absolute bottom-[1%] right-[0%] h-[31%] w-[31%] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/40">
            <img src={data.heroImages[3]?.src} alt={data.heroImages[3]?.alt || ""} className="h-full w-full object-cover" />
          </div>

          <div className="absolute left-[44%] top-[45%] grid h-32 w-32 place-items-center rounded-full border border-white/15 bg-white text-center text-sm font-black uppercase tracking-[-0.04em] text-zinc-950 shadow-2xl shadow-black/40">
            {data.heroBadge}
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee({ items }: { items: string[] }) {
  const content = [...items, ...items, ...items];

  return (
    <section className="overflow-hidden border-y border-zinc-200 bg-white py-5 text-zinc-950">
      <div className="novastra-marquee flex w-max items-center gap-5">
        {content.map((item, index) => (
          <React.Fragment key={`${item}-${index}`}>
            <span className="text-2xl font-black uppercase tracking-[-0.05em] sm:text-4xl">{item}</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-zinc-950 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

function CategoryCards({ data }: { data: NovastraData }) {
  return (
    <section className="bg-[#f5f0e8] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-zinc-500">{data.categoryEyebrow}</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.06em] text-zinc-950 sm:text-6xl">
              {data.categoryTitle}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-zinc-600">{data.categoryText}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {data.categories.map((category, index) => (
            <button
              key={`${category.title}-${index}`}
              type="button"
              className={cx(
                "group relative min-h-[420px] overflow-hidden rounded-[2rem] bg-zinc-900 text-left text-white shadow-xl",
                index === 1 && "md:translate-y-8",
              )}
            >
              <img
                src={category.src}
                alt={category.alt || category.title || ""}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-300">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em]">{category.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{category.text}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoGrid({ data }: { data: NovastraData }) {
  return (
    <section className="bg-zinc-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1480px] gap-4 md:grid-cols-4">
        {data.promoCards.map((card, index) => (
          <div
            key={`${card.title}-${index}`}
            className="group relative min-h-[260px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]"
          >
            <img src={card.src} alt={card.alt || card.title || ""} className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-lg font-black uppercase leading-tight tracking-[-0.04em]">{card.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductGrid({ data, compact = false }: { data: NovastraData; compact?: boolean }) {
  const products = compact ? data.products.slice(0, 4) : data.products;

  return (
    <section className="bg-white px-4 py-16 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-zinc-500">{data.productsEyebrow}</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.06em] sm:text-6xl">
              {data.productsTitle}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-zinc-600">{data.productsText}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <article
              key={`${product.title}-${index}`}
              className="group overflow-hidden rounded-[2rem] border border-zinc-200 bg-[#f7f3ec] p-3 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-zinc-950/10"
            >
              <div className="relative aspect-[0.78] overflow-hidden rounded-[1.5rem] bg-zinc-200">
                <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-zinc-950">
                  {product.badge || data.productBadgeFallback}
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{product.category}</p>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <h3 className="text-xl font-black uppercase leading-tight tracking-[-0.05em]">{product.title}</h3>
                  {product.price ? <p className="whitespace-nowrap text-sm font-black">{product.price}</p> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Community({ data }: { data: NovastraData }) {
  return (
    <section className="bg-[#f5f0e8] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1480px] items-center gap-6 overflow-hidden rounded-[2.5rem] bg-zinc-950 p-5 text-white lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-[430px] overflow-hidden rounded-[2rem]">
          <img src={data.communityImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4">
            <div className="flex -space-x-3">
              {data.communityAvatars.map((avatar, index) => (
                <img
                  key={`${avatar}-${index}`}
                  src={avatar}
                  alt=""
                  className="h-12 w-12 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-950">
              {data.communityBadge}
            </span>
          </div>
        </div>

        <div className="px-2 py-6 sm:px-6">
          <SectionEyebrow>{data.communityEyebrow}</SectionEyebrow>
          <h2 className="max-w-2xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.075em] sm:text-7xl">
            {data.communityTitle}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-300">{data.communityText}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {data.communityStats.map((stat) => (
              <div key={stat.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-3xl font-black tracking-[-0.08em]">{stat.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedPiece({ data }: { data: NovastraData }) {
  return (
    <section className="bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1480px] gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[640px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04]">
          <img src={data.featuredImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-zinc-300">{data.featuredEyebrow}</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.06em] sm:text-6xl">
              {data.featuredTitle}
            </h2>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-5 rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">{data.featuredProductLabel}</p>
            <h3 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-6xl">
              {data.featuredProductName}
            </h3>
            <p className="mt-5 text-base leading-8 text-zinc-300">{data.featuredText}</p>
          </div>

          <div className="rounded-[2rem] bg-white p-3 text-zinc-950">
            <img src={data.featuredProductImage} alt="" className="aspect-[1.2] w-full rounded-[1.5rem] object-cover" />
            <div className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">{data.featuredProductCategory}</p>
                <p className="mt-1 text-2xl font-black uppercase tracking-[-0.05em]">{data.featuredProductName}</p>
              </div>
              <Button dark>{data.buyCta}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefits({ data }: { data: NovastraData }) {
  const icons = [Truck, ShieldCheck, RefreshCw, Gift];

  return (
    <section className="bg-white px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1480px] gap-3 md:grid-cols-4">
        {data.benefits.map((benefit, index) => {
          const Icon = icons[index] || Sparkles;

          return (
            <div key={benefit.title} className="rounded-[1.6rem] border border-zinc-200 bg-[#f7f3ec] p-6">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-zinc-950 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-black uppercase tracking-[-0.04em]">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{benefit.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Reviews({ data }: { data: NovastraData }) {
  return (
    <section className="overflow-hidden bg-[#f5f0e8] py-16 text-zinc-950">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-zinc-500">{data.reviewsEyebrow}</p>
        <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.06em] sm:text-6xl">
          {data.reviewsTitle}
        </h2>
      </div>

      <div className="novastra-review-track mt-8 flex w-max gap-4 px-4 sm:px-6 lg:px-8">
        {[...data.reviews, ...data.reviews].map((review, index) => (
          <article
            key={`${review.name}-${index}`}
            className="w-[330px] shrink-0 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-950/5 sm:w-[430px]"
          >
            <div className="flex gap-1 text-zinc-950">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star key={starIndex} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-6 text-lg font-semibold leading-8">“{review.quote}”</p>
            <div className="mt-8 flex items-center gap-3">
              {review.avatar ? <img src={review.avatar} alt="" className="h-12 w-12 rounded-full object-cover" /> : null}
              <div>
                <p className="font-black uppercase tracking-[-0.04em]">{review.name}</p>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">{review.meta}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Journal({ data }: { data: NovastraData }) {
  return (
    <section className="bg-white px-4 py-16 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-zinc-500">{data.journalEyebrow}</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.06em] sm:text-6xl">
              {data.journalTitle}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-zinc-600">{data.journalText}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {data.articles.map((article, index) => (
            <article
              key={`${article.title}-${index}`}
              className="group overflow-hidden rounded-[2rem] border border-zinc-200 bg-[#f7f3ec] p-3"
            >
              <div className="aspect-[1.1] overflow-hidden rounded-[1.5rem] bg-zinc-200">
                <img src={article.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">
                  {article.tag} · {article.date}
                </p>
                <h3 className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.05em]">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">{article.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqNewsletter({ data, onNavigate }: { data: NovastraData; onNavigate: (pageId: string) => void }) {
  return (
    <section className="bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1480px] gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-zinc-500">{data.faqEyebrow}</p>
          <h2 className="mt-3 text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-6xl">
            {data.faqTitle}
          </h2>
          <p className="mt-5 text-base leading-8 text-zinc-300">{data.faqText}</p>
          <Button className="mt-8" onClick={() => onNavigate("contact")}>{data.faqCta}</Button>
        </div>

        <div className="space-y-3">
          {data.faqs.map((faq, index) => (
            <details
              key={`${faq.question}-${index}`}
              className="group rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 open:bg-white open:text-zinc-950"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black uppercase tracking-[-0.04em]">
                {faq.question}
                <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="mt-4 text-sm leading-7 text-zinc-400 group-open:text-zinc-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-[1480px] overflow-hidden rounded-[2.5rem] bg-white text-zinc-950 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-6 sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-zinc-500">{data.newsletterEyebrow}</p>
          <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.06em] sm:text-6xl">
            {data.newsletterTitle}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-600">{data.newsletterText}</p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder={data.newsletterPlaceholder}
              className="min-h-[52px] flex-1 rounded-full border border-zinc-300 bg-white px-5 text-sm font-semibold outline-none transition focus:border-zinc-950"
            />
            <button
              type="button"
              className="min-h-[52px] rounded-full bg-zinc-950 px-7 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-zinc-800"
            >
              {data.newsletterButton}
            </button>
          </form>
        </div>
        <div className="relative min-h-[360px]">
          <img src={data.newsletterImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function Footer({ data, onNavigate }: { data: NovastraData; onNavigate: (pageId: string) => void }) {
  return (
    <footer className="bg-zinc-950 px-4 pb-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1480px] gap-8 border-t border-white/10 pt-10 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
        <div>
          <h2 className="text-5xl font-black uppercase tracking-[-0.08em]">{data.brandName}</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-zinc-400">{data.footerText}</p>
        </div>
        {[
          { title: data.footerCol1Title, links: data.footerCol1Links },
          { title: data.footerCol2Title, links: data.footerCol2Links },
          { title: data.footerCol3Title, links: data.footerCol3Links },
        ].map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-black uppercase tracking-[0.22em] text-zinc-500">{group.title}</h3>
            <div className="mt-4 space-y-3">
              {group.links.map((link) => (
                <button
                  key={link}
                  type="button"
                  onClick={() => onNavigate(link.toLowerCase().includes("journal") ? "journal" : "collection")}
                  className="block text-sm font-semibold text-zinc-300 transition hover:text-white"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-10 flex max-w-[1480px] flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500 sm:flex-row">
        <p>{data.copyright}</p>
        <p>{data.footerCredit}</p>
      </div>
    </footer>
  );
}

function FloatingChat({ data }: { data: NovastraData }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[70]">
      {open ? (
        <div className="mb-3 w-[310px] overflow-hidden rounded-[2rem] border border-zinc-200 bg-white text-zinc-950 shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between bg-zinc-950 p-4 text-white">
            <div>
              <p className="text-sm font-black uppercase tracking-[-0.04em]">{data.chatTitle}</p>
              <p className="text-xs text-zinc-400">{data.chatStatus}</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4">
            <p className="rounded-2xl bg-[#f5f0e8] p-4 text-sm leading-6">{data.chatMessage}</p>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="grid h-14 w-14 place-items-center rounded-full bg-white text-zinc-950 shadow-2xl shadow-black/25 ring-1 ring-zinc-200 transition hover:-translate-y-1"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}

function HomePage({ data, onNavigate }: { data: NovastraData; onNavigate: (pageId: string) => void }) {
  return (
    <>
      <Hero data={data} onNavigate={onNavigate} />
      <Marquee items={data.marqueeItems} />
      <CategoryCards data={data} />
      <PromoGrid data={data} />
      <Community data={data} />
      <ProductGrid data={data} compact />
      <FeaturedPiece data={data} />
      <Benefits data={data} />
      <Reviews data={data} />
      <Journal data={data} />
      <FaqNewsletter data={data} onNavigate={onNavigate} />
    </>
  );
}

function CollectionPage({ data }: { data: NovastraData }) {
  return (
    <>
      <section className="bg-zinc-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1480px]">
          <SectionEyebrow>{data.collectionPageEyebrow}</SectionEyebrow>
          <h1 className="max-w-4xl text-6xl font-black uppercase leading-[0.84] tracking-[-0.08em] sm:text-8xl">
            {data.collectionPageTitle}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-300">{data.collectionPageText}</p>
        </div>
      </section>
      <ProductGrid data={data} />
      <Benefits data={data} />
    </>
  );
}

function JournalPage({ data }: { data: NovastraData }) {
  return (
    <>
      <section className="bg-zinc-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1480px]">
          <SectionEyebrow>{data.journalEyebrow}</SectionEyebrow>
          <h1 className="max-w-4xl text-6xl font-black uppercase leading-[0.84] tracking-[-0.08em] sm:text-8xl">
            {data.journalPageTitle}
          </h1>
        </div>
      </section>
      <Journal data={data} />
      <Reviews data={data} />
    </>
  );
}

function ContactPage({ data }: { data: NovastraData }) {
  return (
    <section className="bg-[#f5f0e8] px-4 py-16 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1480px] gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2.5rem] bg-zinc-950 p-8 text-white">
          <SectionEyebrow>{data.contactEyebrow}</SectionEyebrow>
          <h1 className="text-6xl font-black uppercase leading-[0.86] tracking-[-0.08em] sm:text-7xl">
            {data.contactTitle}
          </h1>
          <p className="mt-6 text-base leading-8 text-zinc-300">{data.contactText}</p>
          <div className="mt-8 space-y-4 text-sm font-semibold text-zinc-300">
            <p>{data.contactEmail}</p>
            <p>{data.contactPhone}</p>
            <p>{data.contactAddress}</p>
          </div>
        </div>

        <form className="rounded-[2.5rem] bg-white p-6 shadow-2xl shadow-zinc-950/10 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="rounded-2xl border border-zinc-200 bg-[#f7f3ec] px-5 py-4 text-sm font-semibold outline-none focus:border-zinc-950" placeholder={data.contactNamePlaceholder} />
            <input className="rounded-2xl border border-zinc-200 bg-[#f7f3ec] px-5 py-4 text-sm font-semibold outline-none focus:border-zinc-950" placeholder={data.contactEmailPlaceholder} />
          </div>
          <input className="mt-4 w-full rounded-2xl border border-zinc-200 bg-[#f7f3ec] px-5 py-4 text-sm font-semibold outline-none focus:border-zinc-950" placeholder={data.contactSubjectPlaceholder} />
          <textarea className="mt-4 min-h-[180px] w-full rounded-2xl border border-zinc-200 bg-[#f7f3ec] px-5 py-4 text-sm font-semibold outline-none focus:border-zinc-950" placeholder={data.contactMessagePlaceholder} />
          <Button dark className="mt-4">{data.contactButton}</Button>
        </form>
      </div>
    </section>
  );
}

export function NovastraPages({
  initialPage = "home",
  mode = "preview",
  data,
  onNavigate,
}: NovastraPagesProps) {
  const mergedData = useMemo(() => mergeTemplateData(data), [data]);
  const [localPage, setLocalPage] = useState(initialPage || "home");

  const currentPage = localPage || "home";

  function handleNavigate(pageId: string) {
    if (mode === "editor") {
      setLocalPage(pageId);
      onNavigate?.(pageId);
      return;
    }

    setLocalPage(pageId);
    onNavigate?.(pageId);
  }

  return (
    <div dir={mergedData.direction} className="novastra-template min-h-screen bg-white text-zinc-950 antialiased">
      <style>{novastraEditorCss}</style>
      <Header data={mergedData} currentPage={currentPage} onNavigate={handleNavigate} />

      <main>
        {currentPage === "collection" ? <CollectionPage data={mergedData} /> : null}
        {currentPage === "journal" ? <JournalPage data={mergedData} /> : null}
        {currentPage === "contact" ? <ContactPage data={mergedData} /> : null}
        {currentPage === "home" || !["collection", "journal", "contact"].includes(currentPage) ? (
          <HomePage data={mergedData} onNavigate={handleNavigate} />
        ) : null}
      </main>

      <Footer data={mergedData} onNavigate={handleNavigate} />
      <FloatingChat data={mergedData} />
    </div>
  );
}

export const novastraPages = [
  {
    id: "home",
    name: "Home",
    label: "Home",
    path: "/",
    Component: NovastraPages,
    component: NovastraPages,
  },
  {
    id: "collection",
    name: "Collection",
    label: "Collection",
    path: "/collection",
    Component: NovastraPages,
    component: NovastraPages,
  },
  {
    id: "journal",
    name: "Journal",
    label: "Journal",
    path: "/journal",
    Component: NovastraPages,
    component: NovastraPages,
  },
  {
    id: "contact",
    name: "Contact",
    label: "Contact",
    path: "/contact",
    Component: NovastraPages,
    component: NovastraPages,
  },
];

export default NovastraPages;