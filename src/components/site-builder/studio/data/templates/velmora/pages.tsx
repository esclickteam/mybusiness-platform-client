import React from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  HelpCircle,
  LockKeyhole,
  Minus,
  PackageCheck,
  Plus,
  ReceiptText,
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
import VelmoraShell from "./components/VelmoraShell";

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
  | "accessibility"
  | "faq"
  | "shipping"
  | "orders";

type VelmoraPageInput = VelmoraPageId | string;

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

export type VelmoraTemplateData = Record<string, any>;

export const velmoraPages = [
  {
    id: "home",
    name: "בית",
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
    name: "אודות",
    slug: "/אודות",
    sections: ["header", "about", "gallery", "custom", "footer"],
  },
  {
    id: "shop",
    name: "חנות",
    slug: "/חנות",
    sections: ["header", "product", "footer"],
  },
  {
    id: "product",
    name: "עמוד מוצר",
    slug: "/עמוד-מוצר",
    sections: ["header", "product", "gallery", "footer"],
  },
  {
    id: "cart",
    name: "סל קניות",
    slug: "/סל-קניות",
    sections: ["header", "cart", "footer"],
  },
  {
    id: "projects",
    name: "קולקציות",
    slug: "/קולקציות",
    sections: ["header", "projects", "gallery", "custom", "footer"],
  },
  {
    id: "custom",
    name: "סטיילינג אישי",
    slug: "/סטיילינג-אישי",
    sections: ["header", "custom", "gallery", "contact", "footer"],
  },
  {
    id: "contact",
    name: "יצירת קשר",
    slug: "/יצירת-קשר",
    sections: ["header", "contact", "gallery", "footer"],
  },
  {
    id: "terms",
    name: "תקנון",
    slug: "/תקנון",
    sections: ["header", "info", "footer"],
  },
  {
    id: "privacy",
    name: "מדיניות פרטיות",
    slug: "/מדיניות-פרטיות",
    sections: ["header", "info", "footer"],
  },
  {
    id: "accessibility",
    name: "הצהרת נגישות",
    slug: "/נגישות",
    sections: ["header", "info", "footer"],
  },
  {
    id: "faq",
    name: "שאלות נפוצות",
    slug: "/שאלות-נפוצות",
    sections: ["header", "info", "footer"],
  },
  {
    id: "shipping",
    name: "משלוחים והחזרות",
    slug: "/משלוחים-והחזרות",
    sections: ["header", "info", "footer"],
  },
  {
    id: "orders",
    name: "שירות והזמנות",
    slug: "/הזמנות",
    sections: ["header", "info", "footer"],
  },
] as const;

export const velmoraSections: VelmoraPageSection[] = [
  { id: "header", type: "header", title: "תפריט עליון" },
  { id: "hero", type: "hero", title: "אזור פתיחה" },
  { id: "about", type: "about", title: "אודות" },
  { id: "collections", type: "collections", title: "קולקציות" },
  { id: "carousel", type: "carousel", title: "קרוסלה" },
  { id: "projects", type: "projects", title: "פרויקטים" },
  { id: "custom", type: "custom", title: "התאמה אישית" },
  { id: "gallery", type: "gallery", title: "גלריה" },
  { id: "contact", type: "contact", title: "יצירת קשר" },
  { id: "product", type: "product", title: "מוצר" },
  { id: "cart", type: "cart", title: "סל קניות" },
  { id: "info", type: "info", title: "עמוד מידע" },
  { id: "footer", type: "footer", title: "פוטר" },
];

function formatPrice(price: number) {
  return `₪${price.toLocaleString("he-IL")}`;
}

function normalizePageInput(value: VelmoraPageInput | undefined) {
  return String(value || "home")
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}

function resolveVelmoraPageId(value: VelmoraPageInput | undefined): VelmoraPageId {
  const clean = normalizePageInput(value);

  if (!clean || clean === "home" || clean === "בית") return "home";

  if (clean === "about" || clean === "אודות") return "about";

  if (
    clean === "shop" ||
    clean === "store" ||
    clean === "products" ||
    clean === "חנות"
  ) {
    return "shop";
  }

  if (
    clean === "product" ||
    clean === "product-page" ||
    clean === "עמוד-מוצר" ||
    clean === "עמוד מוצר" ||
    clean === "מוצר"
  ) {
    return "product";
  }

  if (
    clean === "cart" ||
    clean === "basket" ||
    clean === "סל" ||
    clean === "סל-קניות" ||
    clean === "סל קניות"
  ) {
    return "cart";
  }

  if (
    clean === "projects" ||
    clean === "collections" ||
    clean === "collection" ||
    clean === "קולקציות" ||
    clean === "פרויקטים"
  ) {
    return "projects";
  }

  if (
    clean === "custom" ||
    clean === "custom-style" ||
    clean === "styling" ||
    clean === "סטיילינג" ||
    clean === "סטיילינג-אישי" ||
    clean === "סטיילינג אישי" ||
    clean === "התאמה-אישית" ||
    clean === "התאמה אישית"
  ) {
    return "custom";
  }

  if (
    clean === "contact" ||
    clean === "contact-us" ||
    clean === "יצירת-קשר" ||
    clean === "יצירת קשר"
  ) {
    return "contact";
  }

  if (
    clean === "terms" ||
    clean === "terms-of-service" ||
    clean === "תקנון" ||
    clean === "תקנון-אתר" ||
    clean === "תקנון אתר"
  ) {
    return "terms";
  }

  if (
    clean === "privacy" ||
    clean === "privacy-policy" ||
    clean === "מדיניות-פרטיות" ||
    clean === "מדיניות פרטיות"
  ) {
    return "privacy";
  }

  if (
    clean === "accessibility" ||
    clean === "accessibility-statement" ||
    clean === "נגישות" ||
    clean === "הצהרת-נגישות" ||
    clean === "הצהרת נגישות"
  ) {
    return "accessibility";
  }

  if (
    clean === "faq" ||
    clean === "questions" ||
    clean === "שאלות" ||
    clean === "שאלות-נפוצות" ||
    clean === "שאלות נפוצות"
  ) {
    return "faq";
  }

  if (
    clean === "shipping" ||
    clean === "returns" ||
    clean === "shipping-returns" ||
    clean === "משלוחים" ||
    clean === "משלוחים-והחזרות" ||
    clean === "משלוחים והחזרות"
  ) {
    return "shipping";
  }

  if (
    clean === "orders" ||
    clean === "order-service" ||
    clean === "הזמנות" ||
    clean === "שירות-והזמנות" ||
    clean === "שירות והזמנות"
  ) {
    return "orders";
  }

  return "home";
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
    0,
  );

  const shipping = cartItems.length > 0 ? 29 : 0;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-[#f6f2ea] px-5 pb-24 pt-20 text-[#27231f]">
      <section className="mx-auto max-w-[1500px]">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm tracking-[0.22em] text-black/40">
              סל הקניות שלך
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
  type:
    | "terms"
    | "privacy"
    | "accessibility"
    | "faq"
    | "shipping"
    | "orders";
  onPageChange: (page: VelmoraPageId) => void;
}) {
  const pageData = {
    terms: {
      eyebrow: "תקנון אתר",
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
      eyebrow: "מדיניות פרטיות",
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
      eyebrow: "הצהרת נגישות",
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
    faq: {
      eyebrow: "שאלות נפוצות",
      title: "שאלות נפוצות",
      icon: HelpCircle,
      intro:
        "עמוד דוגמה לשאלות נפוצות. כאן ניתן להציג תשובות על מוצרים, מידות, זמני אספקה, החלפות, שירות אישי ותהליך רכישה.",
      sections: [
        {
          title: "איך בוחרים מידה?",
          text: "כאן ניתן להציג תשובה לדוגמה על בחירת מידה, שימוש בטבלת מידות וקבלת המלצה לפני רכישה.",
        },
        {
          title: "האם אפשר לקבל ייעוץ לפני קנייה?",
          text: "כאן ניתן להסביר שניתן לפנות לצוות, לשלוח פרטים ולקבל המלצה לפי סגנון, צורך או אירוע.",
        },
        {
          title: "איך יודעים אם מוצר זמין?",
          text: "כאן ניתן להציג מידע לדוגמה על זמינות מוצרים, מלאי, צבעים ומידות.",
        },
        {
          title: "איך יוצרים קשר?",
          text: "כאן ניתן להפנות לעמוד יצירת קשר, טופס פנייה או שירות לקוחות.",
        },
      ],
    },
    shipping: {
      eyebrow: "משלוחים והחזרות",
      title: "משלוחים והחזרות",
      icon: PackageCheck,
      intro:
        "עמוד דוגמה למדיניות משלוחים והחזרות. כאן בעל העסק יוכל להציג זמני אספקה, אפשרויות שילוח, החלפות והחזרות.",
      sections: [
        {
          title: "אפשרויות משלוח",
          text: "כאן ניתן להציג משלוח עד הבית, איסוף עצמי, משלוח מהיר או אפשרויות נוספות לפי העסק.",
        },
        {
          title: "זמני אספקה",
          text: "כאן ניתן להציג טווחי זמן לדוגמה, אזורי חלוקה והערות חשובות לגבי זמינות.",
        },
        {
          title: "החלפות",
          text: "כאן ניתן להסביר איך מתבצעת החלפה של מוצר, באילו תנאים ומה התהליך מול שירות לקוחות.",
        },
        {
          title: "החזרות",
          text: "כאן ניתן להציג טקסט דוגמה על החזרת מוצר, בדיקת מצב מוצר ואופן קבלת מענה.",
        },
      ],
    },
    orders: {
      eyebrow: "שירות והזמנות",
      title: "שירות והזמנות",
      icon: ReceiptText,
      intro:
        "עמוד דוגמה לשירות והזמנות. כאן ניתן להציג מידע על מעקב הזמנה, שינוי פרטים, שאלות לאחר רכישה ופנייה לצוות.",
      sections: [
        {
          title: "מעקב הזמנה",
          text: "כאן ניתן להציג טקסט דוגמה על בדיקת סטטוס הזמנה, מספר הזמנה וקבלת עדכונים.",
        },
        {
          title: "שינוי פרטי הזמנה",
          text: "כאן ניתן להסביר איך מבקשים שינוי כתובת, מידה, צבע או פרטים נוספים לפני שילוח.",
        },
        {
          title: "שירות לאחר רכישה",
          text: "כאן ניתן להציג מענה לשאלות אחרי רכישה, החלפה, החזרה או התאמה נוספת.",
        },
        {
          title: "פנייה לצוות",
          text: "כאן ניתן להפנות לעמוד יצירת קשר או להשאיר הנחיות לפנייה מסודרת.",
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

              <p className="mt-6 text-xs font-black tracking-[0.22em] text-black/35">
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

type VelmoraPagesProps = {
  /**
   * initialPage נשאר לתאימות לאחור.
   */
  initialPage?: VelmoraPageInput;

  /**
   * תמיכה ב-Preview: כל טאב עובד כדף נפרד בלי לשנות נתיב בדפדפן.
   */
  activePageId?: VelmoraPageInput | null;
  pageId?: VelmoraPageInput | null;

  /**
   * מאפשר ל-Preview חיצוני לעדכן query param / state.
   */
  onPageChange?: (page: VelmoraPageId) => void;

  isStudioStatic?: boolean;
  isVisualEditor?: boolean;
  templateData?: VelmoraTemplateData;
  data?: VelmoraTemplateData;
  studioData?: VelmoraTemplateData;
};

export default function VelmoraPages({
  initialPage = "home",
  activePageId,
  pageId,
  onPageChange,
  isStudioStatic = false,
  isVisualEditor = false,
  templateData,
  data,
  studioData,
}: VelmoraPagesProps = {}) {
  const mergedTemplateData = React.useMemo<VelmoraTemplateData>(() => {
    return {
      ...(templateData || {}),
      ...(data || {}),
      ...(studioData || {}),
    };
  }, [templateData, data, studioData]);

  const siteRootRef = React.useRef<HTMLDivElement | null>(null);

  const requestedPage = activePageId ?? pageId ?? initialPage;

  const safeInitialPage = React.useMemo<VelmoraPageId>(() => {
    return resolveVelmoraPageId(requestedPage || "home");
  }, [requestedPage]);

  const [activePage, setActivePage] =
    React.useState<VelmoraPageId>(safeInitialPage);

  const [cartItems, setCartItems] = React.useState<VelmoraCartItem[]>([]);

  /**
   * חשוב:
   * רק activePageId / pageId הם שליטה חיצונית אמיתית.
   * isStudioStatic לא אומר שאסור להחליף דף בתוך הפריוויו.
   * אחרת לחיצה על קטגוריות לא עושה כלום, כי pageToRender נשאר תמיד initialPage.
   */
  const isControlledPage = Boolean(activePageId || pageId);

  const pageToRender: VelmoraPageId = isControlledPage
    ? safeInitialPage
    : activePage;

  const cartCount = React.useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  React.useEffect(() => {
    setActivePage(safeInitialPage);
  }, [safeInitialPage]);

  function scrollTemplateToTop() {
    requestAnimationFrame(() => {
      const siteRoot = siteRootRef.current;

      scrollNodeToTop(findScrollableParent(siteRoot));
      scrollNodeToTop(siteRoot?.parentElement ?? null);

      if (!isStudioStatic && typeof window !== "undefined") {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });
      }
    });
  }

  function handlePageChange(page: VelmoraPageId) {
    const nextPage = resolveVelmoraPageId(page);

    onPageChange?.(nextPage);

    /**
     * אם יש שליטה חיצונית דרך Preview, מודיעים החוצה.
     * אם אין שליטה חיצונית, מחליפים דף פנימי כאן.
     */
    setActivePage(nextPage);
    scrollTemplateToTop();
  }

  function handleAddToCart(item: VelmoraCartInput) {
    if (isStudioStatic) return;

    const cartId = `${item.productId}-${item.size}-${item.color}`;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.cartId === cartId,
      );

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.cartId === cartId
            ? {
                ...cartItem,
                quantity: cartItem.quantity + item.quantity,
              }
            : cartItem,
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
    if (isStudioStatic) return;

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  }

  function handleDecreaseCartItem(cartId: string) {
    if (isStudioStatic) return;

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1),
            }
          : item,
      ),
    );
  }

  function handleRemoveCartItem(cartId: string) {
    if (isStudioStatic) return;

    setCartItems((currentItems) =>
      currentItems.filter((item) => item.cartId !== cartId),
    );
  }

  function handleClearCart() {
    if (isStudioStatic) return;

    setCartItems([]);
  }

  return (
    <VelmoraShell
      activePage={pageToRender}
      cartCount={cartCount}
      templateData={mergedTemplateData}
      data={mergedTemplateData}
      studioData={mergedTemplateData}
      isVisualEditor={isVisualEditor}
      onPageChange={handlePageChange}
    >
      <div ref={siteRootRef}>
        {pageToRender === "home" && (
          <VelmoraHome
            onPageChange={handlePageChange}
            templateData={mergedTemplateData}
            data={mergedTemplateData}
            studioData={mergedTemplateData}
            isVisualEditor={isVisualEditor}
          />
        )}

        {pageToRender === "about" && (
          <VelmoraAbout onPageChange={handlePageChange} />
        )}

        {pageToRender === "shop" && (
          <VelmoraShop onPageChange={handlePageChange} />
        )}

        {pageToRender === "projects" && (
          <VelmoraProjects onPageChange={handlePageChange} />
        )}

        {pageToRender === "custom" && (
          <VelmoraCustom onPageChange={handlePageChange} />
        )}

        {pageToRender === "contact" && (
          <VelmoraContact onPageChange={handlePageChange} />
        )}

        {pageToRender === "product" && (
          <VelmoraProduct
            cartCount={cartCount}
            onAddToCart={handleAddToCart}
            onPageChange={handlePageChange}
          />
        )}

        {pageToRender === "cart" && (
          <VelmoraCartPage
            cartItems={cartItems}
            onPageChange={handlePageChange}
            onIncrease={handleIncreaseCartItem}
            onDecrease={handleDecreaseCartItem}
            onRemove={handleRemoveCartItem}
            onClearCart={handleClearCart}
          />
        )}

        {pageToRender === "terms" && (
          <VelmoraInfoPage type="terms" onPageChange={handlePageChange} />
        )}

        {pageToRender === "privacy" && (
          <VelmoraInfoPage type="privacy" onPageChange={handlePageChange} />
        )}

        {pageToRender === "accessibility" && (
          <VelmoraInfoPage
            type="accessibility"
            onPageChange={handlePageChange}
          />
        )}

        {pageToRender === "faq" && (
          <VelmoraInfoPage type="faq" onPageChange={handlePageChange} />
        )}

        {pageToRender === "shipping" && (
          <VelmoraInfoPage type="shipping" onPageChange={handlePageChange} />
        )}

        {pageToRender === "orders" && (
          <VelmoraInfoPage type="orders" onPageChange={handlePageChange} />
        )}
      </div>
    </VelmoraShell>
  );
}