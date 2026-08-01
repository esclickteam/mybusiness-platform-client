import React from "react";

import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import {
  formatStorePrice,
  useStorePluginCatalog,
  type StoreCatalogProduct,
} from "../shared/useStorePluginCatalog";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import {
  chanelDefaultData,
  chanelPages as chanelPagesData,
  type ChanelData,
  type ChanelMediaValue,
  type ChanelPageId,
} from "./chanelData";

export const chanelPages = [...chanelPagesData];

const CHANEL_PAGE_IDS = ["home", "products", "product", "cart"] as const;
const SELECTED_PRODUCT_KEY = "bizuply:chanel-selected-product";
const CART_STORAGE_KEY = "bizuply:chanel-cart";

type ChanelCartLine = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  variantId?: string;
  variantLabel?: string;
  sku?: string;
};

type ChanelPagesProps = {
  initialPage?: ChanelPageId | string;
  activePageId?: ChanelPageId | string;
  currentPageId?: ChanelPageId | string;
  pageId?: ChanelPageId | string;
  page?: ChanelPageId | string;
  initialPageId?: ChanelPageId | string;
  mode?: "preview" | "editor" | "edit" | "public" | string;
  viewMode?: string;
  runtimeMode?: string;
  isPublic?: boolean;
  data?: Partial<ChanelData>;
  isStudioStatic?: boolean;
  businessId?: string;
  onPageChange?: (pageId: string) => void;
};

type VisualElementType = "text" | "image" | "button" | "section" | "box";

type SharedProps = {
  data: ChanelData;
  mode: string;
};

function readSelectedProductId() {
  if (typeof window === "undefined") return "";
  try {
    const fromQuery = new URLSearchParams(window.location.search).get("pid");
    if (fromQuery) return String(fromQuery).trim();
  } catch {
    // ignore
  }
  try {
    return String(sessionStorage.getItem(SELECTED_PRODUCT_KEY) || "").trim();
  } catch {
    return "";
  }
}

function persistSelectedProductId(productId: string) {
  if (typeof window === "undefined") return;
  const id = String(productId || "").trim();
  try {
    if (id) sessionStorage.setItem(SELECTED_PRODUCT_KEY, id);
    else sessionStorage.removeItem(SELECTED_PRODUCT_KEY);
  } catch {
    // ignore
  }
}

function readStoredCart(): ChanelCartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function productHref(productId?: string) {
  const id = String(productId || "").trim();
  return id ? `/product?pid=${encodeURIComponent(id)}` : "/product";
}

const REVEAL_CLASS =
  "chanel-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out data-[revealed=true]:translate-y-0 data-[revealed=true]:opacity-100";

function isEditorMode(mode: string) {
  return mode === "editor" || mode === "edit";
}

function visualProps(
  id: string,
  type: VisualElementType,
  label?: string,
): Record<string, string> {
  return {
    "data-visual-edit-id": id,
    "data-visual-edit-type": type,
    "data-visual-type": type,
    "data-visual-editable": "true",
    ...(label ? { "data-visual-edit-label": label } : {}),
  };
}

function sectionProps(
  id: string,
  label: string,
  kind: string,
): Record<string, string> {
  return {
    ...visualProps(id, "section", label),
    "data-template-section-id": id,
    "data-section-kind": kind,
    "data-section-title": label,
    "data-bizuply-block": "section",
  };
}

function safeArray<T>(
  value: readonly T[] | null | undefined,
  fallback: readonly T[] = [],
): T[] {
  return Array.isArray(value) ? [...value] : [...fallback];
}

function safeObject<T extends object>(value: unknown): Partial<T> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Partial<T>;
}

function getMediaUrl(value: unknown): string {
  if (typeof value === "string") return value.trim();

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const item = value as Record<string, unknown>;
    return String(
      item.secureUrl ||
        item.secure_url ||
        item.url ||
        item.src ||
        item.originalUrl ||
        "",
    ).trim();
  }

  return "";
}

function isVideoUrl(value: unknown): boolean {
  const src = getMediaUrl(value).toLowerCase().split("?")[0].split("#")[0];
  return Boolean(
    src.includes("/video/upload/") ||
      src.endsWith(".mp4") ||
      src.endsWith(".webm") ||
      src.endsWith(".mov") ||
      src.endsWith(".m4v") ||
      src.endsWith(".ogv"),
  );
}

function resolveMedia(value: unknown, fallback: unknown): string {
  const selected = getMediaUrl(value);
  return selected || getMediaUrl(fallback);
}

function mergeData(data?: Partial<ChanelData>): ChanelData {
  const incoming = safeObject<ChanelData>(data);
  const defaultHero = chanelDefaultData.hero;
  const incomingHero = safeObject<ChanelData["hero"]>(incoming.hero);
  const incomingCraft = safeObject<ChanelData["craft"]>(incoming.craft);
  const incomingFooter = safeObject<ChanelData["footer"]>(incoming.footer);

  return {
    ...chanelDefaultData,
    ...incoming,
    brand: {
      ...chanelDefaultData.brand,
      ...safeObject<ChanelData["brand"]>(incoming.brand),
    },
    promo: {
      ...chanelDefaultData.promo,
      ...safeObject<ChanelData["promo"]>(incoming.promo),
    },
    hero: {
      ...defaultHero,
      ...incomingHero,
      image: resolveMedia(incomingHero.image, defaultHero.image),
    },
    categoriesHeading: {
      ...chanelDefaultData.categoriesHeading,
      ...safeObject<ChanelData["categoriesHeading"]>(
        incoming.categoriesHeading,
      ),
    },
    productsHeading: {
      ...chanelDefaultData.productsHeading,
      ...safeObject<ChanelData["productsHeading"]>(incoming.productsHeading),
    },
    valuesHeading: {
      ...chanelDefaultData.valuesHeading,
      ...safeObject<ChanelData["valuesHeading"]>(incoming.valuesHeading),
    },
    communityHeading: {
      ...chanelDefaultData.communityHeading,
      ...safeObject<ChanelData["communityHeading"]>(
        incoming.communityHeading,
      ),
    },
    testimonialHeading: {
      ...chanelDefaultData.testimonialHeading,
      ...safeObject<ChanelData["testimonialHeading"]>(
        incoming.testimonialHeading,
      ),
    },
    journalHeading: {
      ...chanelDefaultData.journalHeading,
      ...safeObject<ChanelData["journalHeading"]>(incoming.journalHeading),
    },
    craft: {
      ...chanelDefaultData.craft,
      ...incomingCraft,
      image: resolveMedia(incomingCraft.image, chanelDefaultData.craft.image),
    },
    newsletter: {
      ...chanelDefaultData.newsletter,
      ...safeObject<ChanelData["newsletter"]>(incoming.newsletter),
    },
    footer: {
      ...chanelDefaultData.footer,
      ...incomingFooter,
      links: safeArray(incomingFooter.links, chanelDefaultData.footer.links),
    },
    nav: safeArray(incoming.nav, chanelDefaultData.nav),
    categories: safeArray(incoming.categories, chanelDefaultData.categories).map(
      (item, index) => {
        const fallback =
          chanelDefaultData.categories[
            index % Math.max(1, chanelDefaultData.categories.length)
          ];
        return {
          ...fallback,
          ...item,
          image: resolveMedia(item?.image, fallback?.image),
        };
      },
    ),
    products: safeArray(incoming.products, chanelDefaultData.products).map(
      (item, index) => {
        const fallback =
          chanelDefaultData.products[
            index % Math.max(1, chanelDefaultData.products.length)
          ];
        return {
          ...fallback,
          ...item,
          image: resolveMedia(item?.image, fallback?.image),
        };
      },
    ),
    values: safeArray(incoming.values, chanelDefaultData.values),
    community: safeArray(incoming.community, chanelDefaultData.community).map(
      (item, index) => {
        const fallback =
          chanelDefaultData.community[
            index % Math.max(1, chanelDefaultData.community.length)
          ];
        return {
          ...fallback,
          ...item,
          image: resolveMedia(item?.image, fallback?.image),
        };
      },
    ),
    testimonials: safeArray(
      incoming.testimonials,
      chanelDefaultData.testimonials,
    ).map((item, index) => {
      const fallback =
        chanelDefaultData.testimonials[
          index % Math.max(1, chanelDefaultData.testimonials.length)
        ];
      return {
        ...fallback,
        ...item,
        avatar: resolveMedia(item?.avatar, fallback?.avatar),
      };
    }),
    journal: safeArray(incoming.journal, chanelDefaultData.journal).map(
      (item, index) => {
        const fallback =
          chanelDefaultData.journal[
            index % Math.max(1, chanelDefaultData.journal.length)
          ];
        return {
          ...fallback,
          ...item,
          image: resolveMedia(item?.image, fallback?.image),
        };
      },
    ),
    productsPage: {
      ...chanelDefaultData.productsPage,
      ...safeObject<ChanelData["productsPage"]>(incoming.productsPage),
    },
    productPage: {
      ...chanelDefaultData.productPage,
      ...safeObject<ChanelData["productPage"]>(incoming.productPage),
      image: resolveMedia(
        safeObject<ChanelData["productPage"]>(incoming.productPage).image,
        chanelDefaultData.productPage.image,
      ),
      gallery: safeArray(
        safeObject<ChanelData["productPage"]>(incoming.productPage).gallery,
        chanelDefaultData.productPage.gallery,
      ).map((item, index) =>
        resolveMedia(
          item,
          chanelDefaultData.productPage.gallery[index] ||
            chanelDefaultData.productPage.image,
        ),
      ),
    },
    cartPage: {
      ...chanelDefaultData.cartPage,
      ...safeObject<ChanelData["cartPage"]>(incoming.cartPage),
      items: safeArray(
        safeObject<ChanelData["cartPage"]>(incoming.cartPage).items,
        chanelDefaultData.cartPage.items,
      ).map((item, index) => {
        const fallback =
          chanelDefaultData.cartPage.items[
            index % Math.max(1, chanelDefaultData.cartPage.items.length)
          ];
        return {
          ...fallback,
          ...item,
          image: resolveMedia(item?.image, fallback?.image),
        };
      }),
    },
  };
}

function MediaElement({
  value,
  fallback,
  field,
  alt,
  className,
  decorative = false,
}: {
  value: unknown;
  fallback?: unknown;
  field: string;
  alt: string;
  className?: string;
  decorative?: boolean;
}) {
  const src = resolveMedia(value, fallback);
  if (!src) return null;

  const mediaType = isVideoUrl(src) ? "video" : "image";
  const common = {
    className,
    ...visualProps(field, "image", alt),
    "data-editable": "image",
    "data-field": field,
    "data-image-field": field,
    "data-media-field": field,
    "data-visual-image-field": field,
    "data-visual-media-type": mediaType,
    "data-resource-type": mediaType,
    "data-visual-current-src": src,
  } as Record<string, unknown>;

  if (mediaType === "video") {
    return (
      <video
        {...common}
        src={src}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : alt}
      />
    );
  }

  const fallbackSrc = resolveMedia(fallback, "");

  return (
    <img
      {...common}
      src={src}
      alt={decorative ? "" : alt}
      aria-hidden={decorative || undefined}
      loading="lazy"
      decoding="async"
      onError={(event) => {
        const image = event.currentTarget;
        if (fallbackSrc && image.src !== fallbackSrc) {
          image.src = fallbackSrc;
          return;
        }
        image.style.display = "none";
      }}
    />
  );
}

function useRevealRuntime(
  rootRef: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList = [],
) {
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;

    let observer: IntersectionObserver | null = null;
    const observed = new WeakSet<Element>();

    const revealNow = (element: HTMLElement) => {
      element.dataset.revealed = "true";
      element.style.opacity = "1";
      element.style.visibility = "visible";
      element.style.transform = "none";
    };

    const bind = () => {
      const elements = Array.from(
        root.querySelectorAll<HTMLElement>(".chanel-reveal"),
      );

      if (!("IntersectionObserver" in window)) {
        elements.forEach(revealNow);
        return;
      }

      if (!observer) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const element = entry.target as HTMLElement;
              revealNow(element);
              observer?.unobserve(element);
            });
          },
          // Generous margin so editor scroll-containers and product swaps reveal.
          { threshold: 0.01, rootMargin: "25% 0px 25% 0px" },
        );
      }

      elements.forEach((element) => {
        if (element.dataset.revealed === "true") return;
        if (observed.has(element)) return;
        observed.add(element);
        element.dataset.revealed = "false";
        observer?.observe(element);

        // Already on screen after catalog swap / page change — reveal immediately.
        const rect = element.getBoundingClientRect();
        const inView =
          rect.top < window.innerHeight * 1.15 &&
          rect.bottom > -80 &&
          rect.width > 0 &&
          rect.height > 0;
        if (inView) {
          revealNow(element);
          observer?.unobserve(element);
        }
      });
    };

    bind();

    const mutationObserver =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => bind())
        : null;
    mutationObserver?.observe(root, { childList: true, subtree: true });

    // Editor frames sometimes miss the first IO pass.
    const retry = window.setTimeout(bind, 120);

    return () => {
      window.clearTimeout(retry);
      observer?.disconnect();
      mutationObserver?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- explicit dependency list for catalog/page swaps
  }, [rootRef, ...deps]);
}

function useSmoothLinks(
  rootRef: React.RefObject<HTMLElement | null>,
  mode: string,
) {
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;
    if (isEditorMode(mode)) return;

    const links = Array.from(
      root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
    );

    const onClick = (event: Event) => {
      const link = event.currentTarget as HTMLAnchorElement;
      const href = link.getAttribute("href") || "";
      if (href === "#" || href.length < 2) return;
      const target = root.querySelector<HTMLElement>(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    links.forEach((link) => link.addEventListener("click", onClick));
    return () => {
      links.forEach((link) => link.removeEventListener("click", onClick));
    };
  }, [rootRef, mode]);
}

function SectionHeading({
  eyebrow,
  title,
  accent,
  scope,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  scope: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <span
        className={`mb-4 inline-block text-[10px] font-semibold uppercase tracking-[0.28em] ${
          dark ? "text-white/50" : "text-[#1a1a1a]/45"
        }`}
        data-editable="text"
        {...visualProps(`${scope}.eyebrow`, "text", "תגית כותרת")}
      >
        {eyebrow}
      </span>

      <h2
        className={`text-balance text-[clamp(2rem,5vw,4rem)] font-light leading-[1.1] tracking-[-0.02em] ${
          dark ? "text-white" : "text-[#1a1a1a]"
        }`}
      >
        <span
          data-editable="text"
          {...visualProps(`${scope}.title`, "text", "כותרת")}
        >
          {title}
        </span>{" "}
        <em
          className={`font-normal not-italic italic ${
            dark ? "text-white/40" : "text-[#1a1a1a]/35"
          }`}
          data-editable="text"
          {...visualProps(`${scope}.accent`, "text", "הדגשה")}
        >
          {accent}
        </em>
      </h2>
    </div>
  );
}

function ProductCardLink({
  href,
  mode,
  productId,
  onOpenProduct,
  className,
  children,
}: {
  href: string;
  mode: string;
  productId?: string;
  onOpenProduct?: (productId: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      data-editable="link"
      onClick={(event) => {
        const id = String(productId || "").trim();
        if (!id || !onOpenProduct) return;
        // In editor/preview SPA, navigate inside the template stack.
        if (isEditorMode(mode) || mode === "preview") {
          event.preventDefault();
          event.stopPropagation();
          onOpenProduct(id);
        }
      }}
    >
      {children}
    </a>
  );
}

function ProductsCatalogPage({
  data,
  mode,
  onOpenProduct,
}: SharedProps & { onOpenProduct?: (productId: string) => void }) {
  return (
    <section
      className="py-20 sm:py-28"
      {...sectionProps("products.catalog", "קטלוג מוצרים", "products")}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow={data.productsPage.eyebrow}
          title={data.productsPage.title}
          accent={data.productsPage.accent}
          scope="productsPage"
        />
        <p
          className="mt-6 max-w-2xl text-sm leading-7 text-[#1a1a1a]/65 sm:text-base"
          data-editable="text"
          {...visualProps("productsPage.description", "text", "תיאור עמוד מוצרים")}
        >
          {data.productsPage.description}
        </p>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {safeArray(data.products).map((item, index) => {
            const productId = String(item.id || "").trim();
            const href = item.href || productHref(productId);
            return (
              <article
                key={`catalog-product-${productId || index}`}
                data-revealed="true"
                className={`${REVEAL_CLASS} group overflow-hidden border border-[#1a1a1a]/8 bg-white`}
                style={{ transitionDelay: `${index * 70}ms` }}
                {...visualProps(
                  `products.${index}.card`,
                  "section",
                  `מוצר ${index + 1}`,
                )}
              >
                <ProductCardLink
                  href={href}
                  mode={mode}
                  productId={productId}
                  onOpenProduct={onOpenProduct}
                  className="block"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-[#f5f0e8]">
                    <MediaElement
                      value={item.image}
                      fallback={chanelDefaultData.products[index]?.image}
                      field={`products.${index}.image`}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      decorative={!isEditorMode(mode)}
                    />
                  </div>
                  <div className="space-y-2 p-5">
                    {item.tag ? (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/45">
                        {item.tag}
                      </span>
                    ) : null}
                    <h3
                      className="text-lg font-light"
                      data-editable="text"
                      {...visualProps(`products.${index}.name`, "text", `שם מוצר ${index + 1}`)}
                    >
                      {item.name}
                    </h3>
                    <p
                      className="text-sm tracking-[0.08em] text-[#1a1a1a]/70"
                      data-editable="text"
                      {...visualProps(`products.${index}.price`, "text", `מחיר ${index + 1}`)}
                    >
                      {item.price}
                    </p>
                  </div>
                </ProductCardLink>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductDetailPage({
  data,
  mode,
  selectedProduct,
  currency,
  qty,
  setQty,
  selectedVariantId,
  setSelectedVariantId,
  stockMessage,
  onAddToCart,
  onBuyNow,
  onBackToShop,
}: SharedProps & {
  selectedProduct: StoreCatalogProduct | null;
  currency: string;
  qty: number;
  setQty: React.Dispatch<React.SetStateAction<number>>;
  selectedVariantId: string;
  setSelectedVariantId: React.Dispatch<React.SetStateAction<string>>;
  stockMessage: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onBackToShop: () => void;
}) {
  const fallback = data.productPage;
  const live = selectedProduct;
  const unitPrice =
    live?.variants.find((variant) => variant.id === selectedVariantId)?.price ??
    live?.price;
  const priceLabel = live
    ? formatStorePrice(Number(unitPrice ?? live.price), currency)
    : fallback.price;

  return (
    <section
      className="py-16 sm:py-24"
      {...sectionProps("product.detail", "עמוד מוצר", "product")}
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-4">
          <div className="aspect-[4/5] overflow-hidden bg-[#f5f0e8]">
            <MediaElement
              value={live?.image || fallback.image}
              fallback={chanelDefaultData.productPage.image}
              field="productPage.image"
              alt={live?.name || fallback.name}
              className="h-full w-full object-cover"
              decorative={!isEditorMode(mode)}
            />
          </div>
          {!live ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {safeArray(fallback.gallery).map((item, index) => (
                <div key={`gallery-${index}`} className="aspect-square overflow-hidden bg-[#f5f0e8]">
                  <MediaElement
                    value={item}
                    fallback={chanelDefaultData.productPage.gallery[index]}
                    field={`productPage.gallery.${index}`}
                    alt={`תמונת מוצר ${index + 1}`}
                    className="h-full w-full object-cover"
                    decorative={!isEditorMode(mode)}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col justify-center">
          <span
            className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#1a1a1a]/45"
            data-editable="text"
            {...visualProps("productPage.tag", "text", "תגית מוצר")}
          >
            {live?.badge || live?.category || fallback.tag}
          </span>
          <h1
            className="text-balance text-[clamp(2rem,5vw,3.5rem)] font-light leading-tight"
            data-editable="text"
            {...visualProps("productPage.name", "text", "שם מוצר")}
          >
            {live?.name || fallback.name}
          </h1>
          <div className="mt-5 flex items-baseline gap-4">
            <strong
              className="text-2xl font-normal"
              data-editable="text"
              {...visualProps("productPage.price", "text", "מחיר מוצר")}
            >
              {priceLabel}
            </strong>
            {live?.compareAtPrice ? (
              <span className="text-sm text-[#1a1a1a]/40 line-through">
                {formatStorePrice(live.compareAtPrice, currency)}
              </span>
            ) : (
              <span
                className="text-sm text-[#1a1a1a]/40 line-through"
                data-editable="text"
                {...visualProps("productPage.comparePrice", "text", "מחיר לפני הנחה")}
              >
                {fallback.comparePrice}
              </span>
            )}
          </div>
          {live?.sku ? (
            <p className="mt-3 text-xs tracking-[0.12em] text-[#1a1a1a]/45">
              מק״ט: {live.sku}
            </p>
          ) : null}
          <p
            className="mt-6 text-sm leading-8 text-[#1a1a1a]/70 sm:text-base"
            data-editable="text"
            {...visualProps("productPage.description", "text", "תיאור מוצר")}
          >
            {live?.shortDescription || fallback.description}
          </p>

          {live && live.variants.length > 0 ? (
            <div className="mt-6">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/45">
                בחירת וריאציה
              </p>
              <div className="flex flex-wrap gap-2">
                {live.variants.map((variant) => {
                  const disabled =
                    live.trackStock && !live.allowBackorder && variant.stock <= 0;
                  return (
                    <button
                      key={variant.id || variant.label}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={[
                        "border px-4 py-2 text-xs tracking-[0.12em] transition",
                        selectedVariantId === variant.id
                          ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#f5f0e8]"
                          : "border-[#1a1a1a]/20 hover:border-[#1a1a1a]",
                        disabled ? "opacity-40" : "",
                      ].join(" ")}
                    >
                      {variant.label || variant.optionValue}
                      {live.trackStock ? ` · ${variant.stock}` : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {live && !live.inStock ? (
            <p className="mt-4 text-sm font-medium text-rose-700">אזל מהמלאי</p>
          ) : live && live.trackStock && live.stock <= 3 ? (
            <p className="mt-4 text-sm font-medium text-amber-700">
              נותרו {live.stock} במלאי
            </p>
          ) : null}

          {stockMessage ? (
            <p className="mt-3 text-sm font-medium text-rose-700">{stockMessage}</p>
          ) : null}

          {!live ? (
            <ul className="mt-6 space-y-2 text-sm text-[#1a1a1a]/65">
              {safeArray(fallback.details).map((detail, index) => (
                <li
                  key={`detail-${index}`}
                  data-editable="text"
                  {...visualProps(`productPage.details.${index}`, "text", `פירוט ${index + 1}`)}
                >
                  • {detail}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {live ? (
              <div className="flex items-center border border-[#1a1a1a]/20">
                <button
                  type="button"
                  className="px-4 py-3 text-sm"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                >
                  -
                </button>
                <span className="min-w-10 text-center text-sm">{qty}</span>
                <button
                  type="button"
                  className="px-4 py-3 text-sm"
                  onClick={() => setQty((value) => value + 1)}
                >
                  +
                </button>
              </div>
            ) : null}

            <button
              type="button"
              disabled={Boolean(live && !live.inStock)}
              onClick={onAddToCart}
              className="bg-[#1a1a1a] px-8 py-3.5 text-[10px] uppercase tracking-[0.22em] text-[#f5f0e8] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              {...visualProps("productPage.primaryButton", "button", "הוספה לעגלה")}
            >
              <span data-editable="text">
                {live && !live.inStock
                  ? "אזל מהמלאי"
                  : fallback.primaryButton || "הוספה לסל"}
              </span>
            </button>

            {live ? (
              <button
                type="button"
                disabled={!live.inStock}
                onClick={onBuyNow}
                className="border border-[#1a1a1a] px-8 py-3.5 text-[10px] uppercase tracking-[0.22em] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f0e8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                לתשלום
              </button>
            ) : null}

            <button
              type="button"
              onClick={onBackToShop}
              className="border border-[#1a1a1a]/20 px-8 py-3.5 text-[10px] uppercase tracking-[0.22em] transition-colors hover:border-[#1a1a1a]"
              {...visualProps("productPage.secondaryButton", "button", "המשך קניות")}
            >
              <span data-editable="text">
                {fallback.secondaryButton || "חזרה לחנות"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CartPage({
  data,
  mode,
  cartItems,
  currency,
  onCheckout,
  onContinue,
  onRemove,
}: SharedProps & {
  cartItems: ChanelCartLine[];
  currency: string;
  onCheckout: () => void;
  onContinue: () => void;
  onRemove: (lineId: string) => void;
}) {
  const cart = data.cartPage;
  const liveMode = cartItems.length > 0 || mode !== "edit";
  const items = liveMode
    ? cartItems
    : safeArray(cart.items).map((item, index) => ({
        id: `demo-${index}`,
        productId: `demo-${index}`,
        name: item.name,
        price: Number(String(item.price).replace(/[^\d.]/g, "")) || 0,
        image: String(
          typeof item.image === "string"
            ? item.image
            : item.image?.url || item.image?.src || "",
        ),
        qty: Number(item.quantity) || 1,
      }));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <section
      className="py-16 sm:py-24"
      {...sectionProps("cart.main", "עגלת קניות", "cart")}
    >
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <SectionHeading
          eyebrow={cart.eyebrow}
          title={cart.title}
          accent={cart.accent}
          scope="cartPage"
        />

        {items.length ? (
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-5">
              {items.map((item, index) => (
                <article
                  key={item.id}
                  className="flex items-center gap-5 border border-[#1a1a1a]/10 bg-white p-4 sm:p-5"
                  {...visualProps(`cartPage.items.${index}.row`, "section", `פריט עגלה ${index + 1}`)}
                >
                  <div className="h-24 w-20 shrink-0 overflow-hidden bg-[#f5f0e8] sm:h-28 sm:w-24">
                    <MediaElement
                      value={item.image}
                      fallback={chanelDefaultData.cartPage.items[index]?.image}
                      field={`cartPage.items.${index}.image`}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-light">{item.name}</h3>
                    {item.variantLabel ? (
                      <p className="mt-1 text-xs text-[#1a1a1a]/45">
                        {item.variantLabel}
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm text-[#1a1a1a]/60">
                      {formatStorePrice(item.price, currency)}
                    </p>
                  </div>
                  <span className="text-sm tracking-[0.08em] text-[#1a1a1a]/70">
                    ×{item.qty}
                  </span>
                  {liveMode ? (
                    <button
                      type="button"
                      className="text-xs text-rose-600"
                      onClick={() => onRemove(item.id)}
                    >
                      הסר
                    </button>
                  ) : null}
                </article>
              ))}
            </div>

            <aside className="h-fit border border-[#1a1a1a]/10 bg-white p-6 sm:p-8">
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>{cart.subtotalLabel}</span>
                  <strong>{formatStorePrice(subtotal, currency)}</strong>
                </div>
                <div className="flex items-center justify-between border-t border-[#1a1a1a]/10 pt-4 text-base">
                  <span>{cart.totalLabel}</span>
                  <strong>{formatStorePrice(subtotal, currency)}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={onCheckout}
                className="mt-6 block w-full bg-[#1a1a1a] py-3.5 text-center text-[10px] uppercase tracking-[0.22em] text-[#f5f0e8] transition-opacity hover:opacity-85"
                {...visualProps("cartPage.checkoutButton", "button", "לתשלום")}
              >
                <span data-editable="text">{cart.checkoutButton || "לתשלום"}</span>
              </button>
              <button
                type="button"
                onClick={onContinue}
                className="mt-3 block w-full border border-[#1a1a1a] py-3.5 text-center text-[10px] uppercase tracking-[0.22em] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f0e8]"
                {...visualProps("cartPage.continueButton", "button", "המשך קניות")}
              >
                <span data-editable="text">{cart.continueButton || "המשך קניות"}</span>
              </button>
            </aside>
          </div>
        ) : (
          <div className="mt-10">
            <p
              className="text-sm leading-7 text-[#1a1a1a]/60"
              data-editable="text"
              {...visualProps("cartPage.emptyText", "text", "עגלה ריקה")}
            >
              {cart.emptyText || "העגלה ריקה כרגע."}
            </p>
            <button
              type="button"
              onClick={onContinue}
              className="mt-6 border border-[#1a1a1a] px-6 py-3 text-[10px] uppercase tracking-[0.2em]"
            >
              לכל המוצרים
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ChanelPages({
  initialPage = "home",
  activePageId,
  currentPageId,
  pageId: pageIdProp,
  page,
  initialPageId,
  mode = "preview",
  viewMode,
  runtimeMode,
  isPublic,
  data,
  businessId,
  isStudioStatic = false,
  onPageChange,
}: ChanelPagesProps = {}) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const {
    products: storeProducts,
    fromPlugin,
    loading: storeLoading,
    currency,
  } = useStorePluginCatalog({
    businessId,
    enabled: !isStudioStatic,
  });
  const { currentPage, goTo } = useTemplatePageNavigation(
    {
      initialPage,
      activePageId,
      currentPageId,
      pageId: pageIdProp,
      page,
      initialPageId,
      onPageChange,
      isPublic,
      viewMode,
      runtimeMode,
    },
    { allowedPages: [...CHANEL_PAGE_IDS], fallbackPage: "home" },
  );

  const [selectedProductId, setSelectedProductId] = React.useState(() =>
    readSelectedProductId(),
  );
  const [cart, setCart] = React.useState<ChanelCartLine[]>(() =>
    isStudioStatic ? [] : readStoredCart(),
  );
  const [qty, setQty] = React.useState(1);
  const [selectedVariantId, setSelectedVariantId] = React.useState("");
  const [stockMessage, setStockMessage] = React.useState("");

  React.useEffect(() => {
    if (isStudioStatic) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, isStudioStatic]);

  React.useEffect(() => {
    const fromUrl = readSelectedProductId();
    if (fromUrl && fromUrl !== selectedProductId) {
      setSelectedProductId(fromUrl);
    }
  }, [currentPage, selectedProductId]);

  const selectedProduct =
    storeProducts.find((product) => product.id === selectedProductId) ||
    storeProducts[0] ||
    null;

  React.useEffect(() => {
    if (!selectedProduct) {
      setSelectedVariantId("");
      return;
    }
    const firstAvailable =
      selectedProduct.variants.find(
        (variant) =>
          !selectedProduct.trackStock ||
          selectedProduct.allowBackorder ||
          variant.stock > 0,
      )?.id ||
      selectedProduct.variants[0]?.id ||
      "";
    setSelectedVariantId(firstAvailable);
    setQty(1);
    setStockMessage("");
  }, [selectedProduct?.id]);

  const openProduct = React.useCallback(
    (productId: string) => {
      const id = String(productId || "").trim();
      if (!id) return;
      persistSelectedProductId(id);
      setSelectedProductId(id);
      goTo("product");
    },
    [goTo],
  );

  const addToCart = React.useCallback(
    (product: StoreCatalogProduct, amount = 1, variantId?: string) => {
      if (product.variants.length > 0 && !variantId) {
        setStockMessage("בחרו וריאציה לפני הוספה לסל");
        openProduct(product.id);
        return false;
      }

      const variant =
        product.variants.find((entry) => entry.id === variantId) || null;
      const available = variant ? variant.stock : product.stock;
      const unitPrice =
        variant?.price !== undefined ? variant.price : product.price;
      const cartKey = variant
        ? `${product.id}:${variant.id}`
        : product.id;

      if (
        product.trackStock &&
        !product.allowBackorder &&
        (!product.inStock || available < amount)
      ) {
        setStockMessage(
          available <= 0
            ? `"${product.name}" אזל מהמלאי`
            : `מלאי לא מספיק. זמין: ${available}`,
        );
        return false;
      }

      setStockMessage("");
      setCart((prev) => {
        const existing = prev.find((item) => item.id === cartKey);
        if (existing) {
          const nextQty = existing.qty + amount;
          if (
            product.trackStock &&
            !product.allowBackorder &&
            nextQty > available
          ) {
            setStockMessage(`מלאי לא מספיק. זמין: ${available}`);
            return prev;
          }
          return prev.map((item) =>
            item.id === cartKey ? { ...item, qty: nextQty } : item,
          );
        }
        return [
          ...prev,
          {
            id: cartKey,
            productId: product.id,
            name: product.name,
            price: unitPrice,
            image: product.image,
            qty: amount,
            variantId: variant?.id,
            variantLabel: variant?.label,
            sku: variant?.sku || product.sku,
          },
        ];
      });
      return true;
    },
    [openProduct],
  );

  const openCheckout = React.useCallback(
    (items = cart) => {
      if (typeof window === "undefined" || !items.length) return;
      window.dispatchEvent(
        new CustomEvent("bizuply:open-checkout", {
          detail: {
            items: items.map((item) => ({
              productId: item.productId || item.id,
              name: item.name,
              price: item.price,
              quantity: item.qty,
              image: item.image,
              variantId: item.variantId,
              variantLabel: item.variantLabel,
              sku: item.sku,
              custom: !/^[a-f\d]{24}$/i.test(item.productId || item.id),
            })),
          },
        }),
      );
    },
    [cart],
  );

  const templateData = React.useMemo(() => {
    const merged = mergeData(data);
    const curatedCategories = safeArray(merged.categories);

    // Preview / empty store / loading: keep curated demos until real products exist.
    if (!fromPlugin || storeLoading || storeProducts.length === 0) {
      return merged;
    }

    // Keep Chanel category art/names from the template; only product cards come from the store.
    // Index-merging store categories used to rename "תכשיטים" and wipe images.
    const categories = curatedCategories.map((category) => ({
      ...category,
      href: category.href || "/products",
      image:
        category.image ||
        chanelDefaultData.categories.find(
          (entry) => entry.name === category.name,
        )?.image ||
        "",
    }));

    return {
      ...merged,
      products: storeProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: formatStorePrice(product.price, currency),
        tag: product.badge,
        image: product.image || "",
        href: productHref(product.id),
        description: product.shortDescription,
        sku: product.sku,
      })),
      categories,
    };
  }, [
    currency,
    data,
    fromPlugin,
    storeLoading,
    storeProducts,
  ]);

  const pageId = String(currentPage || "home");
  const stackPageId = ["products", "product", "cart"].includes(pageId)
    ? pageId
    : "home";
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  useRevealRuntime(rootRef, [
    stackPageId,
    fromPlugin,
    storeLoading,
    safeArray(templateData.products).length,
    safeArray(templateData.categories).length,
  ]);
  useSmoothLinks(rootRef, mode);

  return (
    <main
      ref={rootRef}
      id="top"
      dir="rtl"
      data-template-id="chanel"
      data-template-mode={mode}
      data-template-page-id={pageId}
      data-studio-page="true"
      data-bizuply-site="true"
      className="relative min-h-screen w-full overflow-x-clip bg-[#f5f0e8] text-[#1a1a1a] antialiased [font-family:'Cormorant_Garamond',Georgia,serif] selection:bg-[#1a1a1a] selection:text-[#f5f0e8]"
    >
      <PromoBar data={templateData} mode={mode} />
      <Header
        data={templateData}
        mode={mode}
        pageId={pageId}
        cartCount={cartCount}
        onOpenCart={() => goTo("cart")}
      />

      <VisualPageStack
        activePageId={stackPageId}
        pages={[
          {
            id: "home",
            content: (
              <>
                <HeroSection data={templateData} mode={mode} />
                <CategoriesSection data={templateData} mode={mode} />
                <ProductsSection
                  data={templateData}
                  mode={mode}
                  onOpenProduct={openProduct}
                />
                <ValuesSection data={templateData} mode={mode} />
                <CommunitySection data={templateData} mode={mode} />
                <TestimonialsSection data={templateData} mode={mode} />
                <CraftSection data={templateData} mode={mode} />
                <JournalSection data={templateData} mode={mode} />
                <NewsletterSection data={templateData} mode={mode} />
              </>
            ),
          },
          {
            id: "products",
            content: (
              <ProductsCatalogPage
                data={templateData}
                mode={mode}
                onOpenProduct={openProduct}
              />
            ),
          },
          {
            id: "product",
            content: (
              <ProductDetailPage
                data={templateData}
                mode={mode}
                selectedProduct={selectedProduct}
                currency={currency}
                qty={qty}
                setQty={setQty}
                selectedVariantId={selectedVariantId}
                setSelectedVariantId={setSelectedVariantId}
                stockMessage={stockMessage}
                onAddToCart={() => {
                  if (!selectedProduct) {
                    goTo("cart");
                    return;
                  }
                  const ok = addToCart(
                    selectedProduct,
                    qty,
                    selectedVariantId || undefined,
                  );
                  if (ok) goTo("cart");
                }}
                onBuyNow={() => {
                  if (!selectedProduct) return;
                  const ok = addToCart(
                    selectedProduct,
                    qty,
                    selectedVariantId || undefined,
                  );
                  if (!ok) return;
                  const variant =
                    selectedProduct.variants.find(
                      (entry) => entry.id === selectedVariantId,
                    ) || null;
                  const unitPrice =
                    variant?.price !== undefined
                      ? variant.price
                      : selectedProduct.price;
                  openCheckout([
                    {
                      id: variant
                        ? `${selectedProduct.id}:${variant.id}`
                        : selectedProduct.id,
                      productId: selectedProduct.id,
                      name: selectedProduct.name,
                      price: unitPrice,
                      image: selectedProduct.image,
                      qty,
                      variantId: variant?.id,
                      variantLabel: variant?.label,
                      sku: variant?.sku || selectedProduct.sku,
                    },
                  ]);
                }}
                onBackToShop={() => goTo("products")}
              />
            ),
          },
          {
            id: "cart",
            content: (
              <CartPage
                data={templateData}
                mode={mode}
                cartItems={cart}
                currency={currency}
                onCheckout={() => openCheckout()}
                onContinue={() => goTo("products")}
                onRemove={(lineId) =>
                  setCart((prev) => prev.filter((item) => item.id !== lineId))
                }
              />
            ),
          },
        ]}
      />

      <Footer data={templateData} mode={mode} />
    </main>
  );
}

function PromoBar({ data }: SharedProps) {
  return (
    <div
      className="relative z-[60] bg-[#1a1a1a] py-2.5 text-center text-[11px] tracking-[0.12em] text-[#f5f0e8]"
      {...sectionProps("home.promo", "פס קידום", "promo")}
    >
      <span
        data-editable="text"
        {...visualProps("promo.text", "text", "טקסט קידום")}
      >
        {data.promo.text}
      </span>
      {" · "}
      <a
        href={data.promo.link}
        className="underline underline-offset-4 transition-opacity hover:opacity-70"
        data-editable="link"
        {...visualProps("promo.link", "button", "קישור קידום")}
      >
        <span data-editable="text">{data.promo.linkLabel}</span>
      </a>
    </div>
  );
}

function Header({
  data,
  mode,
  pageId,
  cartCount = 0,
  onOpenCart,
}: SharedProps & {
  pageId: string;
  cartCount?: number;
  onOpenCart?: () => void;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header"
      className="sticky top-0 z-50 border-b border-[#1a1a1a]/8 bg-[#f5f0e8]/95 backdrop-blur-md"
      {...sectionProps("home.header", "כותרת עליונה", "header")}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-8">
        <a
          href="/"
          className="text-xl font-light uppercase tracking-[0.35em] text-[#1a1a1a] transition-opacity hover:opacity-70"
          data-editable="link"
          {...visualProps("brand.name", "button", "לוגו")}
        >
          <span
            data-editable="text"
            {...visualProps("brand.name.text", "text", "שם המותג")}
          >
            {data.brand.name}
          </span>
        </a>

        <nav
          className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.2em] md:flex"
          aria-label="ניווט ראשי"
        >
          {safeArray(data.nav).map((item, index) => (
            <a
              key={`${item.href}-${index}`}
              href={item.href}
              className="text-[#1a1a1a]/70 transition-colors hover:text-[#1a1a1a]"
              data-editable="link"
              {...visualProps(
                `nav.${index}.label`,
                "button",
                `קישור ניווט ${index + 1}`,
              )}
            >
              <span data-editable="text">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="/cart"
            className="relative flex h-10 items-center justify-center rounded-full border border-[#1a1a1a]/15 px-3 text-[11px] uppercase tracking-[0.12em] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f0e8]"
            data-editable="link"
            {...visualProps("home.header.cart", "button", "עגלת קניות")}
            aria-label="עגלת קניות"
            onClick={(event) => {
              if (!onOpenCart) return;
              if (isEditorMode(mode) || mode === "preview") {
                event.preventDefault();
                onOpenCart();
              }
            }}
          >
            <span data-editable="text">עגלה</span>
            {cartCount > 0 ? (
              <span className="absolute -left-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1a1a1a] px-1 text-[9px] text-[#f5f0e8]">
                {cartCount}
              </span>
            ) : null}
          </a>

          <a
            href="/#newsletter"
            className="hidden border border-[#1a1a1a] px-5 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f0e8] sm:inline-block"
            data-editable="link"
            {...visualProps("home.header.cta", "button", "כפתור יצירת קשר")}
          >
            <span data-editable="text">הצטרפו</span>
          </a>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center md:hidden"
            aria-label="תפריט"
            onClick={() => setMenuOpen((open) => !open)}
            {...visualProps("home.header.menu", "button", "תפריט נייד")}
          >
            <span className="text-lg">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          className="border-t border-[#1a1a1a]/8 px-5 py-4 md:hidden"
          aria-label="ניווט נייד"
        >
          {safeArray(data.nav).map((item, index) => (
            <a
              key={`mobile-${item.href}-${index}`}
              href={item.href}
              className="block py-3 text-sm uppercase tracking-[0.15em] text-[#1a1a1a]/70"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

function HeroSection({ data, mode }: SharedProps) {
  return (
    <section
      className="relative min-h-[85vh] overflow-hidden"
      {...sectionProps("home.hero", "אזור פתיחה", "hero")}
    >
      <div className="absolute inset-0">
        <MediaElement
          value={data.hero.image}
          fallback={chanelDefaultData.hero.image}
          field="hero.image"
          alt="תמונת אזור פתיחה"
          className="h-full w-full object-cover"
          decorative={!isEditorMode(mode)}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#1a1a1a]/60 via-[#1a1a1a]/25 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-[1400px] flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-24">
        <span
          className="mb-5 text-[10px] uppercase tracking-[0.3em] text-[#f5f0e8]/70"
          data-editable="text"
          {...visualProps("hero.eyebrow", "text", "תגית פתיחה")}
        >
          {data.hero.eyebrow}
        </span>

        <h1 className="max-w-2xl text-balance text-[clamp(2.5rem,7vw,5.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-[#f5f0e8]">
          <span
            data-editable="text"
            {...visualProps("hero.title", "text", "כותרת פתיחה")}
          >
            {data.hero.title}
          </span>{" "}
          <em
            className="font-normal not-italic italic text-[#f5f0e8]/50"
            data-editable="text"
            {...visualProps("hero.accent", "text", "הדגשת כותרת")}
          >
            {data.hero.accent}
          </em>
        </h1>

        <p
          className="mt-6 max-w-lg text-sm leading-7 text-[#f5f0e8]/75 sm:text-base"
          data-editable="text"
          {...visualProps("hero.description", "text", "תיאור פתיחה")}
        >
          {data.hero.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="/products"
            className="bg-[#f5f0e8] px-7 py-3.5 text-[10px] uppercase tracking-[0.22em] text-[#1a1a1a] transition-transform hover:-translate-y-0.5"
            data-editable="link"
            {...visualProps("hero.primaryButton", "button", "כפתור ראשי")}
          >
            <span data-editable="text">{data.hero.primaryButton}</span>
          </a>
          <a
            href="/#craft"
            className="border border-[#f5f0e8]/60 px-7 py-3.5 text-[10px] uppercase tracking-[0.22em] text-[#f5f0e8] transition-colors hover:bg-[#f5f0e8]/10"
            data-editable="link"
            {...visualProps("hero.secondaryButton", "button", "כפתור משני")}
          >
            <span data-editable="text">{data.hero.secondaryButton}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection({ data, mode }: SharedProps) {
  return (
    <section
      id="categories"
      className="py-20 sm:py-28"
      {...sectionProps("home.categories", "קטגוריות", "categories")}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow={data.categoriesHeading.eyebrow}
          title={data.categoriesHeading.title}
          accent={data.categoriesHeading.accent}
          scope="categoriesHeading"
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {safeArray(data.categories).map((item, index) => (
            <a
              key={`category-${index}`}
              href={item.href || "/products"}
              data-revealed="false"
              className={`${REVEAL_CLASS} group relative overflow-hidden`}
              style={{ transitionDelay: `${index * 80}ms` }}
              data-editable="link"
              onClick={(event) => {
                // Keep editing inside the studio; do not follow /products into the host app.
                if (isEditorMode(mode) || mode === "preview") {
                  event.preventDefault();
                  event.stopPropagation();
                }
              }}
              {...visualProps(
                `categories.${index}.card`,
                "section",
                `קטגוריה ${index + 1}`,
              )}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <MediaElement
                  value={item.image}
                  fallback={chanelDefaultData.categories[index]?.image}
                  field={`categories.${index}.image`}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-[#f5f0e8]">
                <h3
                  className="text-xl font-light tracking-wide"
                  data-editable="text"
                  {...visualProps(
                    `categories.${index}.name`,
                    "text",
                    `שם קטגוריה ${index + 1}`,
                  )}
                >
                  {item.name}
                </h3>
                <p
                  className="mt-2 text-xs leading-5 text-[#f5f0e8]/65"
                  data-editable="text"
                  {...visualProps(
                    `categories.${index}.description`,
                    "text",
                    `תיאור קטגוריה ${index + 1}`,
                  )}
                >
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection({
  data,
  mode,
  onOpenProduct,
}: SharedProps & { onOpenProduct?: (productId: string) => void }) {
  return (
    <section
      id="products"
      className="bg-[#1a1a1a] py-20 text-[#f5f0e8] sm:py-28"
      {...sectionProps("home.products", "מוצרים נבחרים", "products")}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={data.productsHeading.eyebrow}
            title={data.productsHeading.title}
            accent={data.productsHeading.accent}
            scope="productsHeading"
            dark
          />
          <a
            href="/products"
            className="border border-[#f5f0e8]/30 px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-[#f5f0e8] hover:text-[#1a1a1a]"
            data-editable="link"
            {...visualProps(
              "productsHeading.button",
              "button",
              "כפתור לכל המוצרים",
            )}
          >
            <span data-editable="text">{data.productsHeading.button}</span>
          </a>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {safeArray(data.products).map((item, index) => {
            const productId = String(item.id || "").trim();
            return (
              <article
                key={`product-${productId || index}-${item.image || item.name}`}
                data-revealed="true"
                className={`${REVEAL_CLASS} group`}
                style={{ transitionDelay: `${index * 70}ms` }}
                {...visualProps(
                  `products.${index}.card`,
                  "section",
                  `מוצר ${index + 1}`,
                )}
              >
                <ProductCardLink
                  href={item.href || productHref(productId)}
                  mode={mode}
                  productId={productId}
                  onOpenProduct={onOpenProduct}
                  className="block"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#2a2a2a]">
                    <MediaElement
                      value={item.image}
                      fallback={chanelDefaultData.products[index]?.image}
                      field={`products.${index}.image`}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {item.tag ? (
                      <span
                        className="absolute right-3 top-3 bg-[#f5f0e8] px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-[#1a1a1a]"
                        data-editable="text"
                        {...visualProps(
                          `products.${index}.tag`,
                          "text",
                          `תגית מוצר ${index + 1}`,
                        )}
                      >
                        {item.tag}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4">
                    <h3
                      className="text-sm font-light tracking-wide sm:text-base"
                      data-editable="text"
                      {...visualProps(
                        `products.${index}.name`,
                        "text",
                        `שם מוצר ${index + 1}`,
                      )}
                    >
                      {item.name}
                    </h3>
                    <p
                      className="mt-1 text-sm text-[#f5f0e8]/55"
                      data-editable="text"
                      {...visualProps(
                        `products.${index}.price`,
                        "text",
                        `מחיר מוצר ${index + 1}`,
                      )}
                    >
                      {item.price}
                    </p>
                  </div>
                </ProductCardLink>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ValuesSection({ data }: SharedProps) {
  return (
    <section
      className="py-20 sm:py-28"
      {...sectionProps("home.values", "ערכים", "values")}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow={data.valuesHeading.eyebrow}
          title={data.valuesHeading.title}
          accent={data.valuesHeading.accent}
          scope="valuesHeading"
        />

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {safeArray(data.values).map((item, index) => (
            <article
              key={`value-${index}`}
              data-revealed="false"
              className={`${REVEAL_CLASS} border-t border-[#1a1a1a]/15 pt-8`}
              style={{ transitionDelay: `${index * 80}ms` }}
              {...visualProps(
                `values.${index}.card`,
                "section",
                `ערך ${index + 1}`,
              )}
            >
              <span
                className="text-2xl text-[#1a1a1a]/25"
                data-editable="text"
                {...visualProps(
                  `values.${index}.icon`,
                  "text",
                  `אייקון ערך ${index + 1}`,
                )}
              >
                {item.icon}
              </span>
              <h3
                className="mt-4 text-lg font-light tracking-wide"
                data-editable="text"
                {...visualProps(
                  `values.${index}.title`,
                  "text",
                  `כותרת ערך ${index + 1}`,
                )}
              >
                {item.title}
              </h3>
              <p
                className="mt-3 text-sm leading-7 text-[#1a1a1a]/55"
                data-editable="text"
                {...visualProps(
                  `values.${index}.description`,
                  "text",
                  `תיאור ערך ${index + 1}`,
                )}
              >
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunitySection({ data }: SharedProps) {
  return (
    <section
      className="bg-[#ebe5da] py-20 sm:py-28"
      {...sectionProps("home.community", "קהילה", "community")}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow={data.communityHeading.eyebrow}
          title={data.communityHeading.title}
          accent={data.communityHeading.accent}
          scope="communityHeading"
        />
        <p
          className="mt-5 max-w-xl text-sm leading-7 text-[#1a1a1a]/55"
          data-editable="text"
          {...visualProps(
            "communityHeading.description",
            "text",
            "תיאור קהילה",
          )}
        >
          {data.communityHeading.description}
        </p>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {safeArray(data.community).map((item, index) => (
            <figure
              key={`community-${index}`}
              data-revealed="false"
              className={`${REVEAL_CLASS} group relative overflow-hidden ${
                index === 0 ? "col-span-2 row-span-2 sm:col-span-1" : ""
              }`}
              style={{ transitionDelay: `${index * 60}ms` }}
              {...visualProps(
                `community.${index}.card`,
                "section",
                `תמונת קהילה ${index + 1}`,
              )}
            >
              <div
                className={`overflow-hidden ${
                  index === 0 ? "aspect-[4/5]" : "aspect-square"
                }`}
              >
                <MediaElement
                  value={item.image}
                  fallback={chanelDefaultData.community[index]?.image}
                  field={`community.${index}.image`}
                  alt={item.caption}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <figcaption
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a1a1a]/60 to-transparent p-4 text-xs tracking-wide text-[#f5f0e8]"
                data-editable="text"
                {...visualProps(
                  `community.${index}.caption`,
                  "text",
                  `כיתוב ${index + 1}`,
                )}
              >
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ data, mode }: SharedProps) {
  const testimonials = safeArray(data.testimonials);
  const [index, setIndex] = React.useState(0);
  const length = Math.max(1, testimonials.length);
  const current = testimonials[index % length];

  const move = (direction: number) => {
    if (isEditorMode(mode)) return;
    setIndex((current) => (current + direction + length) % length);
  };

  return (
    <section
      className="py-20 sm:py-28"
      {...sectionProps("home.testimonials", "המלצות", "testimonials")}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow={data.testimonialHeading.eyebrow}
          title={data.testimonialHeading.title}
          accent={data.testimonialHeading.accent}
          scope="testimonialHeading"
        />

        {current ? (
          <article
            data-revealed="false"
            className={`${REVEAL_CLASS} mx-auto mt-16 max-w-3xl text-center`}
            {...visualProps(
              `testimonials.${index}.card`,
              "section",
              `המלצה ${index + 1}`,
            )}
          >
            <div className="text-sm tracking-[0.3em] text-[#1a1a1a]/30">
              ★★★★★
            </div>

            <blockquote
              className="mt-8 text-balance text-xl font-light leading-relaxed tracking-wide sm:text-2xl"
              data-editable="text"
              {...visualProps(
                `testimonials.${index}.quote`,
                "text",
                `המלצה ${index + 1}`,
              )}
            >
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            <div className="mt-10 flex items-center justify-center gap-4">
              <MediaElement
                value={current.avatar}
                fallback={chanelDefaultData.testimonials[index]?.avatar}
                field={`testimonials.${index}.avatar`}
                alt={current.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="text-right">
                <strong
                  className="block text-sm font-normal tracking-wide"
                  data-editable="text"
                  {...visualProps(
                    `testimonials.${index}.name`,
                    "text",
                    `שם ממליץ ${index + 1}`,
                  )}
                >
                  {current.name}
                </strong>
                <span
                  className="mt-0.5 block text-xs text-[#1a1a1a]/45"
                  data-editable="text"
                  {...visualProps(
                    `testimonials.${index}.location`,
                    "text",
                    `מיקום ${index + 1}`,
                  )}
                >
                  {current.location}
                </span>
              </div>
            </div>
          </article>
        ) : null}

        <div className="mt-10 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="המלצה קודמת"
            className="flex h-10 w-10 items-center justify-center border border-[#1a1a1a]/20 text-sm transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f0e8]"
            {...visualProps("home.testimonials.previous", "button", "הקודם")}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="המלצה הבאה"
            className="flex h-10 w-10 items-center justify-center border border-[#1a1a1a]/20 text-sm transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f0e8]"
            {...visualProps("home.testimonials.next", "button", "הבא")}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

function CraftSection({ data, mode }: SharedProps) {
  return (
    <section
      id="craft"
      className="bg-[#1a1a1a] py-20 text-[#f5f0e8] sm:py-28"
      {...sectionProps("home.craft", "אומנות הייצור", "craft")}
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:min-h-[32rem]">
          <MediaElement
            value={data.craft.image}
            fallback={chanelDefaultData.craft.image}
            field="craft.image"
            alt="אומנות הייצור"
            className="h-full w-full object-cover"
            decorative={!isEditorMode(mode)}
          />
        </div>

        <div>
          <span
            className="text-[10px] uppercase tracking-[0.3em] text-[#f5f0e8]/50"
            data-editable="text"
            {...visualProps("craft.eyebrow", "text", "תגית ייצור")}
          >
            {data.craft.eyebrow}
          </span>

          <h2 className="mt-5 text-balance text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.1] tracking-[-0.02em]">
            <span
              data-editable="text"
              {...visualProps("craft.title", "text", "כותרת ייצור")}
            >
              {data.craft.title}
            </span>{" "}
            <em
              className="font-normal not-italic italic text-[#f5f0e8]/40"
              data-editable="text"
              {...visualProps("craft.accent", "text", "הדגשת ייצור")}
            >
              {data.craft.accent}
            </em>
          </h2>

          <p
            className="mt-6 text-sm leading-8 text-[#f5f0e8]/65 sm:text-base"
            data-editable="text"
            {...visualProps("craft.description", "text", "תיאור ייצור")}
          >
            {data.craft.description}
          </p>

          <div className="mt-10 flex gap-12">
            <div>
              <strong
                className="block text-3xl font-light tracking-wide"
                data-editable="text"
                {...visualProps("craft.stat1", "text", "מדד 1")}
              >
                {data.craft.stat1}
              </strong>
              <span
                className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-[#f5f0e8]/45"
                data-editable="text"
                {...visualProps("craft.stat1Label", "text", "תווית מדד 1")}
              >
                {data.craft.stat1Label}
              </span>
            </div>
            <div>
              <strong
                className="block text-3xl font-light tracking-wide"
                data-editable="text"
                {...visualProps("craft.stat2", "text", "מדד 2")}
              >
                {data.craft.stat2}
              </strong>
              <span
                className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-[#f5f0e8]/45"
                data-editable="text"
                {...visualProps("craft.stat2Label", "text", "תווית מדד 2")}
              >
                {data.craft.stat2Label}
              </span>
            </div>
          </div>

          <a
            href="#craft"
            className="mt-10 inline-block border border-[#f5f0e8]/40 px-7 py-3.5 text-[10px] uppercase tracking-[0.22em] transition-colors hover:bg-[#f5f0e8] hover:text-[#1a1a1a]"
            data-editable="link"
            {...visualProps("craft.button", "button", "כפתור ייצור")}
          >
            <span data-editable="text">{data.craft.button}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function JournalSection({ data }: SharedProps) {
  return (
    <section
      id="journal"
      className="py-20 sm:py-28"
      {...sectionProps("home.journal", "יומן", "journal")}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow={data.journalHeading.eyebrow}
          title={data.journalHeading.title}
          accent={data.journalHeading.accent}
          scope="journalHeading"
        />

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {safeArray(data.journal).map((item, index) => (
            <article
              key={`journal-${index}`}
              data-revealed="false"
              className={`${REVEAL_CLASS} group`}
              style={{ transitionDelay: `${index * 90}ms` }}
              {...visualProps(
                `journal.${index}.card`,
                "section",
                `פוסט ${index + 1}`,
              )}
            >
              <a href={item.href} className="block" data-editable="link">
                <div className="aspect-[4/3] overflow-hidden">
                  <MediaElement
                    value={item.image}
                    fallback={chanelDefaultData.journal[index]?.image}
                    field={`journal.${index}.image`}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-5">
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/40"
                    data-editable="text"
                    {...visualProps(
                      `journal.${index}.date`,
                      "text",
                      `תאריך ${index + 1}`,
                    )}
                  >
                    {item.date}
                  </span>
                  <h3
                    className="mt-2 text-lg font-light tracking-wide"
                    data-editable="text"
                    {...visualProps(
                      `journal.${index}.title`,
                      "text",
                      `כותרת פוסט ${index + 1}`,
                    )}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mt-3 text-sm leading-7 text-[#1a1a1a]/55"
                    data-editable="text"
                    {...visualProps(
                      `journal.${index}.excerpt`,
                      "text",
                      `תקציר ${index + 1}`,
                    )}
                  >
                    {item.excerpt}
                  </p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection({ data, mode }: SharedProps) {
  const handleSubmit = (event: React.FormEvent) => {
    if (isEditorMode(mode)) {
      event.preventDefault();
    }
  };

  return (
    <section
      id="newsletter"
      className="border-t border-[#1a1a1a]/10 bg-[#ebe5da] py-20 sm:py-28"
      {...sectionProps("home.newsletter", "ניוזלטר", "newsletter")}
    >
      <div className="mx-auto max-w-xl px-5 text-center sm:px-8">
        <h2
          className="text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-light tracking-[-0.02em]"
          data-editable="text"
          {...visualProps("newsletter.title", "text", "כותרת ניוזלטר")}
        >
          {data.newsletter.title}
        </h2>
        <p
          className="mt-4 text-sm leading-7 text-[#1a1a1a]/55"
          data-editable="text"
          {...visualProps("newsletter.description", "text", "תיאור ניוזלטר")}
        >
          {data.newsletter.description}
        </p>

        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          onSubmit={handleSubmit}
          data-visual-edit-id="home.newsletter.form"
          data-visual-edit-type="form" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-id="chanel-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
          <input
            type="email"
            placeholder={data.newsletter.placeholder}
            className="flex-1 border border-[#1a1a1a]/20 bg-transparent px-5 py-3.5 text-sm outline-none placeholder:text-[#1a1a1a]/35 focus:border-[#1a1a1a]"
            readOnly={isEditorMode(mode)}
            {...visualProps("newsletter.placeholder", "text", "שדה אימייל")}
          />
          <button
            type="submit"
            className="bg-[#1a1a1a] px-8 py-3.5 text-[10px] uppercase tracking-[0.22em] text-[#f5f0e8] transition-colors hover:bg-[#333]"
            {...visualProps("newsletter.button", "button", "כפתור הרשמה")}
          >
            <span data-editable="text">{data.newsletter.button}</span>
          </button>
        </form>

        <p
          className="mt-4 text-[10px] text-[#1a1a1a]/35"
          data-editable="text"
          {...visualProps("newsletter.disclaimer", "text", "הערת פרטיות")}
        >
          {data.newsletter.disclaimer}
        </p>
      </div>
    </section>
  );
}

function Footer({ data }: SharedProps) {
  return (
    <footer
      className="bg-[#1a1a1a] pt-16 text-[#f5f0e8]"
      {...sectionProps("home.footer", "תחתית האתר", "footer")}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 border-b border-[#f5f0e8]/10 pb-14 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <a
              href="#top"
              className="text-2xl font-light uppercase tracking-[0.35em]"
            >
              <span
                data-editable="text"
                {...visualProps("footer.brandName", "text", "שם מותג בתחתית")}
              >
                {data.brand.name}
              </span>
            </a>
            <p
              className="mt-5 max-w-md text-sm leading-7 text-[#f5f0e8]/50"
              data-editable="text"
              {...visualProps("footer.description", "text", "תיאור תחתית")}
            >
              {data.footer.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#f5f0e8]/40">
              <a href={`mailto:${data.brand.email}`}>{data.brand.email}</a>
              <a href={`tel:${data.brand.phone}`}>{data.brand.phone}</a>
            </div>
          </div>

          <nav
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm"
            aria-label="ניווט תחתון"
          >
            {safeArray(data.footer.links).map((item, index) => (
              <a
                key={`footer-link-${index}`}
                href={item.href}
                className="text-[#f5f0e8]/50 transition-colors hover:text-[#f5f0e8]"
                data-editable="link"
                {...visualProps(
                  `footer.links.${index}.label`,
                  "button",
                  `קישור תחתון ${index + 1}`,
                )}
              >
                <span data-editable="text">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="py-6 text-center text-[10px] uppercase tracking-[0.15em] text-[#f5f0e8]/30">
          <span
            data-editable="text"
            {...visualProps("footer.copyright", "text", "זכויות יוצרים")}
          >
            {data.footer.copyright}
          </span>
        </div>
      </div>
    </footer>
  );
}
