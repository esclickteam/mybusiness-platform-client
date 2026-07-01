import React from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  LockKeyhole,
  Menu,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";

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
  | "cart"
  | "terms"
  | "privacy"
  | "accessibility";

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
    | "info"
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
  {
    id: "terms",
    name: "Terms",
    slug: "/terms",
    sections: ["header", "info", "footer"],
  },
  {
    id: "privacy",
    name: "Privacy",
    slug: "/privacy",
    sections: ["header", "info", "footer"],
  },
  {
    id: "accessibility",
    name: "Accessibility",
    slug: "/accessibility",
    sections: ["header", "info", "footer"],
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
  { id: "info", type: "info", title: "Info Page" },
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

const footerPageItems: Array<{ id: VelmoraPageId; label: string }> = [
  { id: "home", label: "בית" },
  { id: "about", label: "אודות" },
  { id: "shop", label: "חנות" },
  { id: "projects", label: "קולקציות" },
  { id: "custom", label: "סטיילינג" },
  { id: "contact", label: "צור קשר" },
  { id: "cart", label: "סל קניות" },
];

const footerInfoItems: Array<{ id: VelmoraPageId; label: string }> = [
  { id: "terms", label: "תקנון אתר" },
  { id: "privacy", label: "מדיניות פרטיות" },
  { id: "accessibility", label: "נגישות" },
];

function formatPrice(price: number) {
  return `₪${price.toLocaleString("he-IL")}`;
}

function scrollNodeToTop(node: HTMLElement | null) {
  if (!node) return;

  try {
    node.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  } catch {
    node.scrollTop = 0;
    node.scrollLeft = 0;
  }
}

function findScrollableParent(node: HTMLElement | null): HTMLElement | null {
  let current = node?.parentElement ?? null;

  while (current) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY;
    const canScroll =
      (overflowY === "auto" || overflowY === "scroll") &&
      current.scrollHeight > current.clientHeight;

    if (canScroll) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
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
        "relative text-[13px] font-medium transition duration-300 active:scale-95",
        active ? "text-black" : "text-black/55 hover:text-black",
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

function FooterLinkButton({
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
        "group flex w-full items-center justify-between rounded-[6px] px-3 py-2 text-right text-sm transition duration-300 active:scale-[0.98]",
        active
          ? "bg-white/75 font-black text-[#292318] shadow-sm"
          : "text-black/55 hover:bg-white/45 hover:text-black",
      ].join(" ")}
    >
      <span>{label}</span>

      <span
        className={[
          "h-px bg-[#292318] transition-all duration-300",
          active ? "w-8" : "w-0 group-hover:w-5",
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
            className="text-center transition duration-300 active:scale-95"
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
                "relative flex h-11 items-center gap-2 rounded-[5px] px-5 text-[13px] font-bold transition duration-300 hover:-translate-y-0.5 active:scale-95",
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
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <section className="text-right">
            <button
              type="button"
              onClick={() => onPageChange("home")}
              className="block text-right transition active:scale-[0.98]"
            >
              <p className="[font-family:Georgia,Times_New_Roman,serif] text-4xl uppercase tracking-[0.08em] text-[#292318]">
                ATELIER NOA
              </p>

              <p className="mt-1 text-xs font-black uppercase tracking-[0.28em] text-black/40">
                Boutique
              </p>
            </button>

            <p className="mt-5 max-w-md text-sm leading-8 text-black/55">
              אופנה מדויקת, סגנון אישי וחוויית רכישה נקייה לכל קהל יעד.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {["Fashion Store", "RTL", "Boutique"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/10 bg-white/45 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black/45"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section className="text-right">
            <h3 className="mb-4 border-b border-black/10 pb-3 text-sm font-black text-[#292318]">
              עמודי האתר
            </h3>

            <div className="grid gap-1">
              {footerPageItems.map((item) => (
                <FooterLinkButton
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  activePage={activePage}
                  onPageChange={onPageChange}
                />
              ))}
            </div>
          </section>

          <section className="text-right">
            <h3 className="mb-4 border-b border-black/10 pb-3 text-sm font-black text-[#292318]">
              מידע חשוב
            </h3>

            <div className="grid gap-1">
              {footerInfoItems.map((item) => (
                <FooterLinkButton
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  activePage={activePage}
                  onPageChange={onPageChange}
                />
              ))}
            </div>

            <p className="mt-5 text-xs leading-6 text-black/45">
              עמודי דוגמה בלבד לתצוגת הטמפלט. את התוכן האמיתי מחליפים בעריכה.
            </p>
          </section>

          <section className="text-right">
            <h3 className="mb-4 border-b border-black/10 pb-3 text-sm font-black text-[#292318]">
              שירות לקוחות
            </h3>

            <div className="grid gap-1">
              {["שאלות נפוצות", "משלוחים והחזרות", "שירות והזמנות"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onPageChange("contact")}
                    className="rounded-[6px] px-3 py-2 text-right text-sm text-black/55 transition hover:bg-white/45 hover:text-black active:scale-[0.98]"
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() => onPageChange("contact")}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-[4px] bg-[#292318] px-5 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black active:scale-[0.98]"
            >
              יצירת קשר
              <ArrowLeft className="h-4 w-4" />
            </button>
          </section>
        </div>

        <div className="border-t border-black/10 px-5 py-5">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs text-black/45 md:flex-row md:items-center">
            <p>© 2026 ATELIER NOA. כל הזכויות שמורות.</p>

            <div className="flex flex-wrap gap-5">
              {footerInfoItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onPageChange(item.id)}
                  className={[
                    "transition hover:text-black active:scale-[0.98]",
                    activePage === item.id ? "font-black text-black" : "",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
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
            className="h-12 rounded-[4px] border border-black/10 bg-white px-7 text-sm font-bold text-[#292318] transition hover:border-black active:scale-95"
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
              className="mt-8 h-12 rounded-[4px] bg-[#292318] px-8 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black active:scale-95"
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
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-black/45 transition hover:text-black active:scale-95"
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
                        className="flex h-11 w-12 items-center justify-center hover:bg-white active:scale-95"
                      >
                        <Plus className="h-4 w-4" />
                      </button>

                      <div className="flex h-11 min-w-14 items-center justify-center border-x border-black/10 bg-white px-4 text-sm font-black">
                        {item.quantity}
                      </div>

                      <button
                        type="button"
                        onClick={() => onDecrease(item.cartId)}
                        className="flex h-11 w-12 items-center justify-center hover:bg-white active:scale-95"
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
                className="mt-8 h-12 w-full rounded-[4px] bg-[#292318] text-sm font-black text-white transition hover:-translate-y-1 hover:bg-black active:scale-95"
              >
                מעבר לתשלום
              </button>

              <button
                type="button"
                onClick={onClearCart}
                className="mt-3 h-12 w-full rounded-[4px] border border-black/10 bg-white text-sm font-bold text-[#292318] transition hover:border-black active:scale-95"
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

function VelmoraInfoPage({
  type,
  onPageChange,
}: {
  type: "terms" | "privacy" | "accessibility";
  onPageChange: (page: VelmoraPageId) => void;
}) {
  const pageData = {
    terms: {
      eyebrow: "SITE TERMS",
      title: "תקנון אתר",
      icon: FileText,
      intro:
        "עמוד דוגמה לתקנון אתר. כאן ניתן להכניס את תנאי השימוש, מדיניות רכישה, משלוחים, החזרות וכל מידע רלוונטי לעסק.",
      sections: [
        {
          title: "כללי",
          text: "זהו טקסט דוגמה בלבד. באזור זה אפשר להסביר למשתמשים את מטרת האתר, אופן השימוש בו ותנאי הגלישה הכלליים.",
        },
        {
          title: "רכישה באתר",
          text: "כאן ניתן להציג מידע לדוגמה על תהליך הזמנה, בחירת מוצרים, מחירים, זמינות, תשלום ואישור הזמנה.",
        },
        {
          title: "משלוחים והחזרות",
          text: "כאן ניתן להכניס מידע לדוגמה על אפשרויות משלוח, זמני אספקה, החלפות והחזרות בהתאם למדיניות העסק.",
        },
        {
          title: "שירות לקוחות",
          text: "כאן ניתן להציג פרטי יצירת קשר, שעות פעילות, מענה לפניות ואופן הטיפול בבקשות לקוחות.",
        },
      ],
    },
    privacy: {
      eyebrow: "PRIVACY POLICY",
      title: "מדיניות פרטיות",
      icon: LockKeyhole,
      intro:
        "עמוד דוגמה למדיניות פרטיות. כאן בעל העסק יוכל להחליף את הטקסט ולהסביר כיצד נאסף, נשמר ומנוהל מידע באתר.",
      sections: [
        {
          title: "איסוף מידע",
          text: "כאן ניתן להסביר איזה מידע נאסף דרך טפסים, הזמנות, הרשמה לניוזלטר או שימוש באתר.",
        },
        {
          title: "שימוש במידע",
          text: "כאן ניתן להציג כיצד המידע משמש למענה לפניות, טיפול בהזמנות, שיפור השירות ושליחת עדכונים.",
        },
        {
          title: "שמירת מידע",
          text: "כאן ניתן להוסיף טקסט דוגמה על שמירת מידע, אבטחה וניהול הרשאות.",
        },
        {
          title: "יצירת קשר בנושא פרטיות",
          text: "כאן ניתן להציג דרך לפנייה בנושא פרטיות, עדכון פרטים או בקשה להסרת מידע.",
        },
      ],
    },
    accessibility: {
      eyebrow: "ACCESSIBILITY",
      title: "הצהרת נגישות",
      icon: ShieldCheck,
      intro:
        "עמוד דוגמה להצהרת נגישות. כאן ניתן להציג את התאמות הנגישות באתר ואת פרטי איש הקשר לפניות בנושא.",
      sections: [
        {
          title: "התאמות באתר",
          text: "כאן ניתן להציג התאמות דוגמה כמו מבנה כותרות ברור, ניגודיות, ניווט מקלדת וטקסטים קריאים.",
        },
        {
          title: "שימוש באתר",
          text: "כאן ניתן להסביר כיצד ניתן לנווט באתר, לעבור בין עמודים, להשתמש בטפסים וליצור קשר.",
        },
        {
          title: "פנייה בנושא נגישות",
          text: "כאן ניתן להוסיף פרטי קשר לפניות בנושא נגישות, שיפור חוויית שימוש או דיווח על בעיה.",
        },
        {
          title: "עדכון ההצהרה",
          text: "כאן ניתן לציין תאריך עדכון אחרון ומידע כללי על תחזוקת העמוד.",
        },
      ],
    },
  }[type];

  const Icon = pageData.icon;

  return (
    <main className="bg-[#f6f2ea] text-[#27231f]">
      <section className="px-5 pb-24 pt-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-10 lg:grid-cols-[340px_1fr]">
            <aside className="h-fit rounded-[10px] border border-black/10 bg-white/70 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.07)] lg:sticky lg:top-28">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#292318] text-white">
                <Icon className="h-6 w-6" />
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-black/35">
                {pageData.eyebrow}
              </p>

              <h2 className="mt-3 [font-family:Georgia,Times_New_Roman,serif] text-4xl font-normal text-[#2b2722]">
                {pageData.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-black/55">
                תוכן דוגמה בלבד לצורך עיצוב הטמפלט.
              </p>

              <div className="mt-7 border-t border-black/10 pt-5">
                <p className="text-sm font-black text-[#292318]">
                  תוכן העניינים
                </p>

                <div className="mt-3 grid gap-2">
                  {pageData.sections.map((section, index) => (
                    <a
                      key={section.title}
                      href={`#info-section-${index + 1}`}
                      className="rounded-[6px] px-3 py-2 text-sm text-black/55 transition hover:bg-[#f6f2ea] hover:text-black"
                    >
                      {index + 1}. {section.title}
                    </a>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onPageChange("contact")}
                className="mt-7 h-11 w-full rounded-[4px] bg-[#292318] text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black active:scale-[0.98]"
              >
                יצירת קשר
              </button>
            </aside>

            <article className="rounded-[12px] border border-black/10 bg-white p-7 shadow-[0_24px_90px_rgba(0,0,0,0.08)] md:p-12">
              <p className="text-sm tracking-[0.26em] text-black/40">
                {pageData.eyebrow}
              </p>

              <h1 className="mt-5 [font-family:Georgia,Times_New_Roman,serif] text-[58px] font-normal leading-[0.95] tracking-[-0.055em] text-[#2b2722] md:text-[92px]">
                {pageData.title}
              </h1>

              <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold text-black/45">
                <span className="rounded-full bg-[#f6f2ea] px-4 py-2">
                  עדכון אחרון: דוגמה
                </span>

                <span className="rounded-full bg-[#f6f2ea] px-4 py-2">
                  עמוד מידע
                </span>

                <span className="rounded-full bg-[#f6f2ea] px-4 py-2">
                  ניתן לעריכה
                </span>
              </div>

              <p className="mt-8 max-w-3xl text-lg leading-9 text-black/60">
                {pageData.intro}
              </p>

              <div className="mt-10 rounded-[8px] border border-[#d8cbb8] bg-[#f6f2ea] p-6">
                <p className="text-sm font-black text-[#292318]">
                  הערה חשובה
                </p>

                <p className="mt-2 text-sm leading-7 text-black/55">
                  זהו טקסט דוגמה בלבד שמיועד להמחשת מבנה ועיצוב. בעל האתר
                  יחליף את התוכן לפי העסק, השירותים והמדיניות האמיתית שלו.
                </p>
              </div>

              <div className="mt-12 grid gap-6">
                {pageData.sections.map((section, index) => (
                  <section
                    key={section.title}
                    id={`info-section-${index + 1}`}
                    className="border-t border-black/10 pt-8"
                  >
                    <div className="flex items-start gap-5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#292318] text-sm font-black text-white">
                        {index + 1}
                      </span>

                      <div>
                        <h2 className="[font-family:Georgia,Times_New_Roman,serif] text-4xl font-normal text-[#2b2722]">
                          {section.title}
                        </h2>

                        <p className="mt-4 max-w-3xl text-base leading-8 text-black/55">
                          {section.text}
                        </p>

                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                          {["סעיף דוגמה", "מידע ניתן לעריכה"].map((item) => (
                            <div
                              key={item}
                              className="flex items-center gap-3 rounded-[6px] bg-[#f6f2ea] p-4 text-sm text-black/55"
                            >
                              <CheckCircle2 className="h-5 w-5 text-[#292318]" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-12 flex flex-wrap gap-3 border-t border-black/10 pt-8">
                <button
                  type="button"
                  onClick={() => onPageChange("shop")}
                  className="inline-flex h-12 items-center gap-3 rounded-[4px] bg-[#292318] px-8 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black active:scale-[0.98]"
                >
                  מעבר לחנות
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onPageChange("home")}
                  className="inline-flex h-12 items-center gap-3 rounded-[4px] border border-black/15 bg-white px-8 text-sm font-bold text-[#292318] transition hover:border-black active:scale-[0.98]"
                >
                  חזרה לעמוד הבית
                </button>
              </div>
            </article>
          </div>
        </div>
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

      scrollNodeToTop(findScrollableParent(siteRoot));
      scrollNodeToTop(siteRoot?.parentElement ?? null);

      if (typeof window !== "undefined") {
        window.scrollTo({
          top: 0,
          left: 0,
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

      {activePage === "terms" && (
        <VelmoraInfoPage type="terms" onPageChange={handlePageChange} />
      )}

      {activePage === "privacy" && (
        <VelmoraInfoPage type="privacy" onPageChange={handlePageChange} />
      )}

      {activePage === "accessibility" && (
        <VelmoraInfoPage
          type="accessibility"
          onPageChange={handlePageChange}
        />
      )}
    </VelmoraShell>
  );
}