import React from "react";
import { Menu, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import VelmoraHome from "./template-pages/VelmoraHome";
import VelmoraShop from "./template-pages/VelmoraShop";
import VelmoraAbout from "./template-pages/VelmoraAbout";
import VelmoraProjects from "./template-pages/VelmoraProjects";
import VelmoraCustom from "./template-pages/VelmoraCustom";
import VelmoraContact from "./template-pages/VelmoraContact";
import VelmoraProduct from "./template-pages/VelmoraProduct";

export type VelmoraPageId =
  | "home"
  | "about"
  | "shop"
  | "projects"
  | "custom"
  | "contact"
  | "product"
  | "cart";

export type VelmoraCartItem = {
  cartId: string;
  productId: string;
  ref: string;
  title: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
};

export type VelmoraCartInput = Omit<VelmoraCartItem, "cartId">;

export type VelmoraPageSection = {
  id: string;
  type:
    | "header"
    | "hero"
    | "about"
    | "collections"
    | "carousel"
    | "projects"
    | "custom"
    | "gallery"
    | "contact"
    | "product"
    | "cart"
    | "footer";
  title: string;
};

export const velmoraPages = [
  {
    id: "home",
    name: "Home",
    slug: "/",
    sections: [
      "header",
      "hero",
      "about",
      "carousel",
      "collections",
      "projects",
      "custom",
      "gallery",
      "contact",
      "footer",
    ],
  },
  {
    id: "about",
    name: "About",
    slug: "/about",
    sections: ["header", "about", "gallery", "custom", "footer"],
  },
  {
    id: "shop",
    name: "Shop",
    slug: "/shop",
    sections: ["header", "product", "footer"],
  },
  {
    id: "product",
    name: "Product",
    slug: "/product",
    sections: ["header", "product", "gallery", "footer"],
  },
  {
    id: "cart",
    name: "Cart",
    slug: "/cart",
    sections: ["header", "cart", "footer"],
  },
  {
    id: "projects",
    name: "Projects",
    slug: "/projects",
    sections: ["header", "projects", "gallery", "custom", "footer"],
  },
  {
    id: "custom",
    name: "Custom",
    slug: "/custom",
    sections: ["header", "custom", "gallery", "contact", "footer"],
  },
  {
    id: "contact",
    name: "Contact",
    slug: "/contact",
    sections: ["header", "contact", "gallery", "footer"],
  },
] as const;

export const velmoraSections: VelmoraPageSection[] = [
  { id: "header", type: "header", title: "Header" },
  { id: "hero", type: "hero", title: "Hero" },
  { id: "about", type: "about", title: "About" },
  { id: "collections", type: "collections", title: "Collections" },
  { id: "carousel", type: "carousel", title: "Carousel" },
  { id: "projects", type: "projects", title: "Projects" },
  { id: "custom", type: "custom", title: "Custom" },
  { id: "gallery", type: "gallery", title: "Gallery" },
  { id: "contact", type: "contact", title: "Contact" },
  { id: "product", type: "product", title: "Product" },
  { id: "cart", type: "cart", title: "Cart" },
  { id: "footer", type: "footer", title: "Footer" },
];

type ShellProps = {
  activePage: VelmoraPageId;
  cartCount: number;
  siteRootRef: React.RefObject<HTMLDivElement | null>;
  onPageChange: (page: VelmoraPageId) => void;
  children: React.ReactNode;
};

const leftNavItems: Array<{ id: VelmoraPageId; label: string }> = [
  { id: "about", label: "אודות" },
  { id: "shop", label: "חנות" },
  { id: "projects", label: "קולקציות" },
];

const rightNavItems: Array<{ id: VelmoraPageId; label: string }> = [
  { id: "custom", label: "סטיילינג" },
  { id: "contact", label: "צור קשר" },
];

const footerNavItems: Array<{ id: VelmoraPageId; label: string }> = [
  { id: "home", label: "בית" },
  { id: "about", label: "אודות" },
  { id: "shop", label: "חנות" },
  { id: "projects", label: "קולקציות" },
  { id: "custom", label: "סטיילינג" },
  { id: "contact", label: "צור קשר" },
  { id: "cart", label: "סל קניות" },
];

function formatPrice(price: number) {
  return `₪${price.toLocaleString("he-IL")}`;
}

function NavButton({
  id,
  label,
  activePage,
  onPageChange,
}: {
  id: VelmoraPageId;
  label: string;
  activePage: VelmoraPageId;
  onPageChange: (page: VelmoraPageId) => void;
}) {
  const active = activePage === id;

  return (
    <button
      type="button"
      onClick={() => onPageChange(id)}
      className={[
        "relative text-[13px] font-medium transition duration-300 hover:text-black",
        active ? "text-black" : "text-black/55",
      ].join(" ")}
    >
      {label}

      <span
        className={[
          "absolute -bottom-2 right-0 h-px bg-black transition-all duration-300",
          active ? "w-full" : "w-0",
        ].join(" ")}
      />
    </button>
  );
}

function VelmoraTemplateHeader({
  activePage,
  cartCount,
  onPageChange,
}: {
  activePage: VelmoraPageId;
  cartCount: number;
  onPageChange: (page: VelmoraPageId) => void;
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#f6f2ea]/92 px-4 py-4 backdrop-blur-xl">
      <div className="mx-auto w-[min(1120px,calc(100%-12px))] rounded-[10px] border border-black/10 bg-white/90 shadow-[0_18px_55px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        <div className="grid h-[58px] grid-cols-[1fr_auto_1fr] items-center px-5">
          <nav className="hidden items-center justify-start gap-9 lg:flex">
            {leftNavItems.map((item) => (
              <NavButton
                key={item.id}
                id={item.id}
                label={item.label}
                activePage={activePage}
                onPageChange={onPageChange}
              />
            ))}
          </nav>

          <button
            type="button"
            onClick={() => onPageChange("home")}
            className="text-center"
            aria-label="Go to homepage"
          >
            <p className="[font-family:Georgia,Times_New_Roman,serif] text-[25px] font-normal uppercase leading-none tracking-[0.08em] text-[#27231f]">
              ATELIER NOA
            </p>

            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
              Boutique
            </p>
          </button>

          <nav className="hidden items-center justify-end gap-9 lg:flex">
            {rightNavItems.map((item) => (
              <NavButton
                key={item.id}
                id={item.id}
                label={item.label}
                activePage={activePage}
                onPageChange={onPageChange}
              />
            ))}

            <button
              type="button"
              onClick={() => onPageChange("cart")}
              className={[
                "relative flex h-11 items-center gap-2 rounded-[5px] px-5 text-[13px] font-bold transition duration-300 hover:-translate-y-0.5",
                activePage === "cart"
                  ? "bg-black text-white"
                  : "bg-[#292318] text-white hover:bg-black",
              ].join(" ")}
            >
              סל קניות
              <ShoppingBag className="h-4 w-4" />

              {cartCount > 0 && (
                <span className="absolute -left-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b68a55] px-1.5 text-[11px] font-black leading-none text-white shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
          </nav>

          <div className="flex justify-start lg:hidden">
            <button
              type="button"
              onClick={() => onPageChange("cart")}
              className="relative flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -left-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b68a55] px-1.5 text-[11px] font-black leading-none text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="mr-2 flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function VelmoraShell({
  activePage,
  cartCount,
  siteRootRef,
  onPageChange,
  children,
}: ShellProps) {
  return (
    <div
      ref={siteRootRef}
      dir="rtl"
      className="min-h-screen bg-[#f6f2ea] text-[#27231f] [font-family:Inter,Arial,sans-serif]"
    >
      <VelmoraTemplateHeader
        activePage={activePage}
        cartCount={cartCount}
        onPageChange={onPageChange}
      />

      {children}

      <footer className="border-t border-black/10 bg-[#e8dfcf]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <div>
            <p className="[font-family:Georgia,Times_New_Roman,serif] text-3xl uppercase tracking-[0.08em]">
              ATELIER NOA
            </p>

            <p className="mt-3 max-w-sm text-sm leading-7 text-black/55">
              אופנה מדויקת, סגנון אישי וחוויית רכישה נקייה לכל קהל יעד.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold">שירות לקוחות</h3>

            <div className="mt-4 grid gap-2 text-sm text-black/60">
              <button type="button" className="text-right hover:text-black">
                שאלות נפוצות
              </button>

              <button type="button" className="text-right hover:text-black">
                משלוחים והחזרות
              </button>

              <button type="button" className="text-right hover:text-black">
                שירות והזמנות
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">מידע</h3>

            <div className="mt-4 grid gap-2 text-sm text-black/60">
              <button type="button" className="text-right hover:text-black">
                תקנון אתר
              </button>

              <button type="button" className="text-right hover:text-black">
                מדיניות פרטיות
              </button>

              <button type="button" className="text-right hover:text-black">
                הצהרת נגישות
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">ניווט מהיר</h3>

            <div className="mt-4 grid gap-2 text-sm text-black/60">
              {footerNavItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onPageChange(item.id)}
                  className="text-right hover:text-black"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 px-5 py-5">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs text-black/45 md:flex-row md:items-center">
            <p>© 2026 ATELIER NOA. כל הזכויות שמורות.</p>

            <div className="flex flex-wrap gap-5">
              <button type="button" className="hover:text-black">
                תקנון אתר
              </button>

              <button type="button" className="hover:text-black">
                מדיניות פרטיות
              </button>

              <button type="button" className="hover:text-black">
                נגישות
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function VelmoraCartPage({
  cartItems,
  onPageChange,
  onIncrease,
  onDecrease,
  onRemove,
  onClearCart,
}: {
  cartItems: VelmoraCartItem[];
  onPageChange: (page: VelmoraPageId) => void;
  onIncrease: (cartId: string) => void;
  onDecrease: (cartId: string) => void;
  onRemove: (cartId: string) => void;
  onClearCart: () => void;
}) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = cartItems.length > 0 ? 29 : 0;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-[#f6f2ea] px-5 pb-24 pt-20 text-[#27231f]">
      <section className="mx-auto max-w-[1500px]">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm tracking-[0.22em] text-black/40">
              ATELIER NOA CART
            </p>

            <h1 className="mt-4 [font-family:Georgia,Times_New_Roman,serif] text-[64px] font-normal leading-[0.95] tracking-[-0.055em] text-[#2b2722] md:text-[96px]">
              סל קניות
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-black/55">
              כאן מוצגים כל הפריטים שנוספו לסל, כולל מידה, צבע, כמות וסיכום
              הזמנה.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onPageChange("shop")}
            className="h-12 rounded-[4px] border border-black/10 bg-white px-7 text-sm font-bold text-[#292318] transition hover:border-black"
          >
            המשך קנייה
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-[10px] border border-black/10 bg-white p-12 text-center shadow-[0_24px_90px_rgba(0,0,0,0.08)]">
            <ShoppingBag className="mx-auto h-12 w-12 text-[#292318]" />

            <h2 className="mt-6 [font-family:Georgia,serif] text-5xl">
              הסל ריק
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-black/55">
              אפשר לחזור לחנות, לבחור מוצר, לבחור מידה וצבע ואז ללחוץ על
              הוספה לסל.
            </p>

            <button
              type="button"
              onClick={() => onPageChange("shop")}
              className="mt-8 h-12 rounded-[4px] bg-[#292318] px-8 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
            >
              מעבר לחנות
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div className="grid gap-4">
              {cartItems.map((item) => (
                <article
                  key={item.cartId}
                  className="grid gap-5 rounded-[8px] border border-black/10 bg-white p-5 shadow-sm md:grid-cols-[150px_1fr_auto]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-44 w-full rounded-[6px] object-cover md:h-36"
                  />

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-black/35">
                      {item.ref}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-[#292318]">
                      {item.title}
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2 text-sm text-black/55">
                      <span className="rounded-full bg-[#f6f2ea] px-3 py-1">
                        מידה: {item.size}
                      </span>

                      <span className="rounded-full bg-[#f6f2ea] px-3 py-1">
                        צבע: {item.color}
                      </span>

                      <span className="rounded-full bg-[#f6f2ea] px-3 py-1">
                        מחיר: {formatPrice(item.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemove(item.cartId)}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-black/45 transition hover:text-black"
                    >
                      הסרה מהסל
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-col items-start justify-between gap-5 md:items-end">
                    <p className="text-2xl font-black text-[#292318]">
                      {formatPrice(item.price * item.quantity)}
                    </p>

                    <div className="flex items-center overflow-hidden rounded-[4px] border border-black/10 bg-[#f6f2ea]">
                      <button
                        type="button"
                        onClick={() => onIncrease(item.cartId)}
                        className="flex h-11 w-12 items-center justify-center hover:bg-white"
                      >
                        <Plus className="h-4 w-4" />
                      </button>

                      <div className="flex h-11 min-w-14 items-center justify-center border-x border-black/10 bg-white px-4 text-sm font-black">
                        {item.quantity}
                      </div>

                      <button
                        type="button"
                        onClick={() => onDecrease(item.cartId)}
                        className="flex h-11 w-12 items-center justify-center hover:bg-white"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-[8px] border border-black/10 bg-white p-7 shadow-[0_24px_90px_rgba(0,0,0,0.08)]">
              <h2 className="[font-family:Georgia,serif] text-4xl">
                סיכום הזמנה
              </h2>

              <div className="mt-7 grid gap-4 text-sm">
                <div className="flex justify-between border-b border-black/10 pb-3">
                  <span className="text-black/55">סכום ביניים</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>

                <div className="flex justify-between border-b border-black/10 pb-3">
                  <span className="text-black/55">משלוח</span>
                  <strong>{formatPrice(shipping)}</strong>
                </div>

                <div className="flex justify-between pt-2 text-xl">
                  <span className="font-black">סה״כ</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
              </div>

              <button
                type="button"
                className="mt-8 h-12 w-full rounded-[4px] bg-[#292318] text-sm font-black text-white transition hover:-translate-y-1 hover:bg-black"
              >
                מעבר לתשלום
              </button>

              <button
                type="button"
                onClick={onClearCart}
                className="mt-3 h-12 w-full rounded-[4px] border border-black/10 bg-white text-sm font-bold text-[#292318] transition hover:border-black"
              >
                ניקוי סל
              </button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

export default function VelmoraPages() {
  const siteRootRef = React.useRef<HTMLDivElement | null>(null);

  const [activePage, setActivePage] = React.useState<VelmoraPageId>("home");
  const [cartItems, setCartItems] = React.useState<VelmoraCartItem[]>([]);

  const cartCount = React.useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  function scrollTemplateToTop() {
    requestAnimationFrame(() => {
      const siteRoot = siteRootRef.current;
      const previewScrollContainer = siteRoot?.parentElement;

      if (previewScrollContainer) {
        previewScrollContainer.scrollTo({
          top: 0,
          behavior: "auto",
        });
      }

      if (typeof window !== "undefined") {
        window.scrollTo({
          top: 0,
          behavior: "auto",
        });
      }
    });
  }

  function handlePageChange(page: VelmoraPageId) {
    setActivePage(page);
    scrollTemplateToTop();
  }

  function handleAddToCart(item: VelmoraCartInput) {
    const cartId = `${item.productId}-${item.size}-${item.color}`;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.cartId === cartId
      );

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.cartId === cartId
            ? {
                ...cartItem,
                quantity: cartItem.quantity + item.quantity,
              }
            : cartItem
        );
      }

      return [
        ...currentItems,
        {
          ...item,
          cartId,
        },
      ];
    });

    setActivePage("cart");
    scrollTemplateToTop();
  }

  function handleIncreaseCartItem(cartId: string) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function handleDecreaseCartItem(cartId: string) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  }

  function handleRemoveCartItem(cartId: string) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.cartId !== cartId)
    );
  }

  function handleClearCart() {
    setCartItems([]);
  }

  return (
    <VelmoraShell
      activePage={activePage}
      cartCount={cartCount}
      siteRootRef={siteRootRef}
      onPageChange={handlePageChange}
    >
      {activePage === "home" && (
        <VelmoraHome onPageChange={handlePageChange} />
      )}

      {activePage === "about" && (
        <VelmoraAbout onPageChange={handlePageChange} />
      )}

      {activePage === "shop" && (
        <VelmoraShop onPageChange={handlePageChange} />
      )}

      {activePage === "projects" && (
        <VelmoraProjects onPageChange={handlePageChange} />
      )}

      {activePage === "custom" && (
        <VelmoraCustom onPageChange={handlePageChange} />
      )}

      {activePage === "contact" && (
        <VelmoraContact onPageChange={handlePageChange} />
      )}

      {activePage === "product" && (
        <VelmoraProduct
          cartCount={cartCount}
          onAddToCart={handleAddToCart}
          onPageChange={handlePageChange}
        />
      )}

      {activePage === "cart" && (
        <VelmoraCartPage
          cartItems={cartItems}
          onPageChange={handlePageChange}
          onIncrease={handleIncreaseCartItem}
          onDecrease={handleDecreaseCartItem}
          onRemove={handleRemoveCartItem}
          onClearCart={handleClearCart}
        />
      )}
    </VelmoraShell>
  );
}