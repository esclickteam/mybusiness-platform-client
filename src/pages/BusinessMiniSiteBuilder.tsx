"use client";

import React, { useMemo, useState } from "react";

type DeviceMode = "desktop" | "mobile";
type PanelKey =
  | "studio"
  | "design"
  | "domain"
  | "business"
  | "services"
  | "products"
  | "booking"
  | "contact"
  | "seo";

type BlockType =
  | "hero"
  | "about"
  | "services"
  | "products"
  | "gallery"
  | "reviews"
  | "faq"
  | "booking"
  | "club"
  | "contact"
  | "custom";

type WidthMode = "full" | "wide" | "boxed" | "split";
type EffectMode = "none" | "glass" | "glow" | "luxury" | "soft";
type AnimationMode = "none" | "fade" | "rise" | "zoom";

type SiteBlock = {
  id: string;
  type: BlockType;
  title: string;
  enabled: boolean;
  width: WidthMode;
  radius: number;
  padding: number;
  effect: EffectMode;
  animation: AnimationMode;
  background: string;
};

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
};

type ProductItem = {
  id: string;
  title: string;
  description: string;
  price: string;
};

type ReviewItem = {
  id: string;
  name: string;
  text: string;
};

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type SiteState = {
  slug: string;
  customDomain: string;
  published: boolean;

  businessName: string;
  logoText: string;
  category: string;
  city: string;

  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  primaryButton: string;
  secondaryButton: string;

  aboutTitle: string;
  aboutText: string;

  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  template: "clean" | "luxury" | "modern" | "bold";
  pageRadius: number;
  pageSpacing: number;
  globalAnimation: AnimationMode;

  paymentsEnabled: boolean;
  bookingEnabled: boolean;
  customerClubEnabled: boolean;

  phone: string;
  whatsapp: string;
  email: string;
  address: string;

  seoTitle: string;
  seoDescription: string;

  services: ServiceItem[];
  products: ProductItem[];
  gallery: string[];
  reviews: ReviewItem[];
  faqs: FaqItem[];
  blocks: SiteBlock[];
};

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const initialSite: SiteState = {
  slug: "hadar-beauty",
  customDomain: "",
  published: false,

  businessName: "הדר עשת ביוטי",
  logoText: "HB",
  category: "איפור קבוע וטיפולי יופי",
  city: "קריית אתא",

  heroTitle: "הדר עשת ביוטי",
  heroSubtitle: "איפור קבוע וטיפולי יופי בהתאמה אישית, בגימור טבעי ומדויק.",
  heroImage:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90",
  primaryButton: "קביעת תור",
  secondaryButton: "שליחת הודעה",

  aboutTitle: "קצת על העסק",
  aboutText:
    "סטודיו מקצועי לטיפולי יופי, איפור קבוע, גבות ושירותי אסתטיקה מתקדמים. כל טיפול מותאם אישית למבנה הפנים, לסגנון ולמטרה של הלקוחה.",

  primaryColor: "#7c3aed",
  secondaryColor: "#f4e8ff",
  backgroundColor: "#f8f5ff",
  textColor: "#0f172a",
  fontFamily: "Heebo",
  template: "luxury",
  pageRadius: 34,
  pageSpacing: 28,
  globalAnimation: "rise",

  paymentsEnabled: true,
  bookingEnabled: true,
  customerClubEnabled: true,

  phone: "050-0000000",
  whatsapp: "050-0000000",
  email: "hello@business.com",
  address: "קריית אתא",

  seoTitle: "הדר עשת ביוטי | איפור קבוע בקריות",
  seoDescription:
    "אתר עסקי מקצועי עם שירותים, גלריה, ביקורות, תיאום תורים ומוצרים.",

  services: [
    {
      id: "service-1",
      title: "איפור קבוע בגבות",
      description: "עיצוב גבות טבעי ומדויק בהתאמה למבנה הפנים.",
      price: "₪850",
      duration: "90 דקות",
    },
    {
      id: "service-2",
      title: "טיפולי פנים",
      description: "טיפול פנים מקצועי לניקוי, הזנה וזוהר.",
      price: "₪350",
      duration: "60 דקות",
    },
    {
      id: "service-3",
      title: "הדגשת שפתיים",
      description: "הדגשה עדינה וטבעית למראה אלגנטי.",
      price: "₪900",
      duration: "90 דקות",
    },
  ],

  products: [
    {
      id: "product-1",
      title: "סרום טיפוח",
      description: "סרום עדין לשגרת טיפוח יומית.",
      price: "₪129",
    },
    {
      id: "product-2",
      title: "קרם לחות",
      description: "קרם לחות מקצועי לעור רך וזוהר.",
      price: "₪99",
    },
  ],

  gallery: [
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=90",
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=90",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=90",
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=700&q=90",
  ],

  reviews: [
    {
      id: "review-1",
      name: "מיכל לוי",
      text: "שירות מקצועי, יחס אישי ותוצאה מושלמת. ממליצה בחום!",
    },
    {
      id: "review-2",
      name: "נועה כהן",
      text: "חוויה מהממת, המקום נקי, נעים והתוצאה בדיוק כמו שרציתי.",
    },
  ],

  faqs: [
    {
      id: "faq-1",
      question: "איך קובעים תור?",
      answer: "לוחצים על כפתור קביעת תור, בוחרים שירות, תאריך ושעה פנויה.",
    },
    {
      id: "faq-2",
      question: "האם אפשר לשלם באתר?",
      answer: "כן, ניתן לחבר סליקה ולהפעיל תשלום עבור מוצרים או מקדמה לתור.",
    },
  ],

  blocks: [
    {
      id: "block-hero",
      type: "hero",
      title: "הדר ראשי",
      enabled: true,
      width: "wide",
      radius: 34,
      padding: 48,
      effect: "glow",
      animation: "rise",
      background: "#ffffff",
    },
    {
      id: "block-about",
      type: "about",
      title: "אודות",
      enabled: true,
      width: "boxed",
      radius: 28,
      padding: 44,
      effect: "soft",
      animation: "fade",
      background: "#ffffff",
    },
    {
      id: "block-services",
      type: "services",
      title: "שירותים",
      enabled: true,
      width: "wide",
      radius: 30,
      padding: 48,
      effect: "glass",
      animation: "rise",
      background: "#f8fafc",
    },
    {
      id: "block-products",
      type: "products",
      title: "מוצרים וסליקה",
      enabled: true,
      width: "boxed",
      radius: 30,
      padding: 44,
      effect: "soft",
      animation: "rise",
      background: "#ffffff",
    },
    {
      id: "block-gallery",
      type: "gallery",
      title: "גלריה",
      enabled: true,
      width: "wide",
      radius: 30,
      padding: 48,
      effect: "soft",
      animation: "zoom",
      background: "#f8fafc",
    },
    {
      id: "block-reviews",
      type: "reviews",
      title: "ביקורות",
      enabled: true,
      width: "boxed",
      radius: 30,
      padding: 44,
      effect: "soft",
      animation: "fade",
      background: "#ffffff",
    },
    {
      id: "block-booking",
      type: "booking",
      title: "תיאום תורים",
      enabled: true,
      width: "wide",
      radius: 32,
      padding: 46,
      effect: "luxury",
      animation: "rise",
      background: "#111827",
    },
    {
      id: "block-club",
      type: "club",
      title: "מועדון לקוחות",
      enabled: true,
      width: "boxed",
      radius: 30,
      padding: 34,
      effect: "glow",
      animation: "fade",
      background: "#7c3aed",
    },
    {
      id: "block-contact",
      type: "contact",
      title: "יצירת קשר",
      enabled: true,
      width: "wide",
      radius: 30,
      padding: 46,
      effect: "luxury",
      animation: "fade",
      background: "#020617",
    },
  ],
};

const panels: { key: PanelKey; label: string; icon: string }[] = [
  { key: "studio", label: "סטודיו בלוקים", icon: "✥" },
  { key: "design", label: "עיצוב ותבניות", icon: "✦" },
  { key: "domain", label: "דומיין", icon: "◎" },
  { key: "business", label: "פרטי העסק", icon: "⌂" },
  { key: "services", label: "שירותים", icon: "◇" },
  { key: "products", label: "מוצרים וסליקה", icon: "▣" },
  { key: "booking", label: "תיאום תורים", icon: "◷" },
  { key: "contact", label: "יצירת קשר", icon: "☎" },
  { key: "seo", label: "SEO", icon: "↗" },
];

const blockOptions: { type: BlockType; title: string; description: string }[] = [
  { type: "hero", title: "הדר ראשי", description: "פתיחה עם תמונה וכפתורים" },
  { type: "about", title: "אודות", description: "טקסט על העסק" },
  { type: "services", title: "שירותים", description: "שירותים מהמערכת" },
  { type: "products", title: "מוצרים", description: "מוצרים וסליקה" },
  { type: "gallery", title: "גלריה", description: "תמונות ועבודות" },
  { type: "reviews", title: "ביקורות", description: "המלצות לקוחות" },
  { type: "faq", title: "שאלות נפוצות", description: "שאלות ותשובות" },
  { type: "booking", title: "תיאום תורים", description: "חיבור ליומן" },
  { type: "club", title: "מועדון לקוחות", description: "הצטרפות להטבות" },
  { type: "contact", title: "יצירת קשר", description: "טלפון, וואטסאפ ומייל" },
];

const paletteOptions = [
  {
    name: "Luxury Purple",
    primary: "#7c3aed",
    secondary: "#f4e8ff",
    background: "#f8f5ff",
    text: "#0f172a",
  },
  {
    name: "Rose Studio",
    primary: "#db2777",
    secondary: "#ffe4ef",
    background: "#fff7fb",
    text: "#111827",
  },
  {
    name: "Black Gold",
    primary: "#b45309",
    secondary: "#fef3c7",
    background: "#faf7ef",
    text: "#111827",
  },
  {
    name: "Ocean Pro",
    primary: "#0f766e",
    secondary: "#ccfbf1",
    background: "#f0fdfa",
    text: "#0f172a",
  },
  {
    name: "Blue SaaS",
    primary: "#2563eb",
    secondary: "#dbeafe",
    background: "#f8fbff",
    text: "#0f172a",
  },
];

const templateOptions: {
  key: SiteState["template"];
  title: string;
  description: string;
}[] = [
  {
    key: "clean",
    title: "Clean",
    description: "נקי, פשוט, יוקרתי",
  },
  {
    key: "modern",
    title: "Modern",
    description: "מודרני, רך, פרימיום",
  },
  {
    key: "luxury",
    title: "Luxury",
    description: "יוקרתי, עמוק, וואו",
  },
  {
    key: "bold",
    title: "Bold",
    description: "חזק, מכירתי, בולט",
  },
];

const inputClass =
  "w-full rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3 text-sm font-bold text-slate-800 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100";

const textareaClass =
  "w-full resize-none rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3 text-sm font-bold leading-7 text-slate-800 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100";

export default function BusinessMiniSiteBuilder() {
  const [site, setSite] = useState<SiteState>(initialSite);
  const [activePanel, setActivePanel] = useState<PanelKey>("studio");
  const [selectedBlockId, setSelectedBlockId] = useState(site.blocks[0]?.id || "");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState("");

  const selectedBlock = site.blocks.find((block) => block.id === selectedBlockId);

  const publicUrl = useMemo(() => {
    const cleanSlug = site.slug.trim() || "your-business";
    return `https://${cleanSlug}.bizuply.com`;
  }, [site.slug]);

  const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(site.slug);

  const updateSite = <K extends keyof SiteState>(key: K, value: SiteState[K]) => {
    setSite((prev) => ({ ...prev, [key]: value }));
  };

  const updateBlock = (blockId: string, patch: Partial<SiteBlock>) => {
    setSite((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) =>
        block.id === blockId ? { ...block, ...patch } : block
      ),
    }));
  };

  const moveBlock = (blockId: string, direction: "up" | "down") => {
    const currentIndex = site.blocks.findIndex((block) => block.id === blockId);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= site.blocks.length) return;

    const nextBlocks = [...site.blocks];
    const [removed] = nextBlocks.splice(currentIndex, 1);
    nextBlocks.splice(targetIndex, 0, removed);

    updateSite("blocks", nextBlocks);
  };

  const handleDropBlock = (targetBlockId: string) => {
    if (!draggedBlockId || draggedBlockId === targetBlockId) return;

    const draggedIndex = site.blocks.findIndex((block) => block.id === draggedBlockId);
    const targetIndex = site.blocks.findIndex((block) => block.id === targetBlockId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const nextBlocks = [...site.blocks];
    const [dragged] = nextBlocks.splice(draggedIndex, 1);
    nextBlocks.splice(targetIndex, 0, dragged);

    updateSite("blocks", nextBlocks);
    setDraggedBlockId(null);
  };

  const addBlock = (type: BlockType) => {
    const option = blockOptions.find((item) => item.type === type);

    const newBlock: SiteBlock = {
      id: makeId(),
      type,
      title: option?.title || "בלוק חדש",
      enabled: true,
      width: type === "hero" || type === "services" ? "wide" : "boxed",
      radius: 30,
      padding: 42,
      effect: type === "hero" ? "glow" : "soft",
      animation: "rise",
      background:
        type === "booking" || type === "contact"
          ? "#111827"
          : type === "club"
            ? site.primaryColor
            : "#ffffff",
    };

    updateSite("blocks", [...site.blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    setActivePanel("studio");
  };

  const duplicateBlock = (blockId: string) => {
    const block = site.blocks.find((item) => item.id === blockId);
    if (!block) return;

    const cloned: SiteBlock = {
      ...block,
      id: makeId(),
      title: `${block.title} copy`,
    };

    const index = site.blocks.findIndex((item) => item.id === blockId);
    const nextBlocks = [...site.blocks];
    nextBlocks.splice(index + 1, 0, cloned);

    updateSite("blocks", nextBlocks);
    setSelectedBlockId(cloned.id);
  };

  const deleteBlock = (blockId: string) => {
    const nextBlocks = site.blocks.filter((block) => block.id !== blockId);
    updateSite("blocks", nextBlocks);
    setSelectedBlockId(nextBlocks[0]?.id || "");
  };

  const applyPalette = (palette: (typeof paletteOptions)[number]) => {
    setSite((prev) => ({
      ...prev,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      backgroundColor: palette.background,
      textColor: palette.text,
    }));
  };

  const applyTemplate = (template: SiteState["template"]) => {
    if (template === "clean") {
      setSite((prev) => ({
        ...prev,
        template,
        pageRadius: 20,
        pageSpacing: 22,
        globalAnimation: "fade",
        blocks: prev.blocks.map((block) => ({
          ...block,
          radius: 20,
          effect: "none",
        })),
      }));
    }

    if (template === "modern") {
      setSite((prev) => ({
        ...prev,
        template,
        pageRadius: 30,
        pageSpacing: 28,
        globalAnimation: "rise",
        blocks: prev.blocks.map((block) => ({
          ...block,
          radius: 28,
          effect: "soft",
        })),
      }));
    }

    if (template === "luxury") {
      setSite((prev) => ({
        ...prev,
        template,
        pageRadius: 38,
        pageSpacing: 34,
        globalAnimation: "rise",
        blocks: prev.blocks.map((block) => ({
          ...block,
          radius: 34,
          effect: block.type === "hero" ? "glow" : "glass",
        })),
      }));
    }

    if (template === "bold") {
      setSite((prev) => ({
        ...prev,
        template,
        pageRadius: 26,
        pageSpacing: 24,
        globalAnimation: "zoom",
        blocks: prev.blocks.map((block) => ({
          ...block,
          radius: 24,
          effect: "luxury",
        })),
      }));
    }
  };

  const updateService = (
    serviceId: string,
    field: keyof ServiceItem,
    value: string
  ) => {
    updateSite(
      "services",
      site.services.map((service) =>
        service.id === serviceId ? { ...service, [field]: value } : service
      )
    );
  };

  const updateProduct = (
    productId: string,
    field: keyof ProductItem,
    value: string
  ) => {
    updateSite(
      "products",
      site.products.map((product) =>
        product.id === productId ? { ...product, [field]: value } : product
      )
    );
  };

  const addService = () => {
    updateSite("services", [
      ...site.services,
      {
        id: makeId(),
        title: "שירות חדש",
        description: "תיאור קצר של השירות",
        price: "₪0",
        duration: "60 דקות",
      },
    ]);
  };

  const addProduct = () => {
    updateSite("products", [
      ...site.products,
      {
        id: makeId(),
        title: "מוצר חדש",
        description: "תיאור קצר של המוצר",
        price: "₪0",
      },
    ]);
  };

  const saveSite = () => {
    if (!slugValid) return;

    const payload = {
      miniSite: {
        ...site,
        published: true,
        publicUrl,
      },
    };

    console.log("SAVE MINI SITE:", payload);

    setSite((prev) => ({
      ...prev,
      published: true,
    }));

    setSavedAt(
      new Date().toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_12%,rgba(124,58,237,0.22),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(217,70,239,0.13),transparent_30%),linear-gradient(135deg,#f8f7ff_0%,#f2efff_48%,#ffffff_100%)] text-slate-950"
      style={{ fontFamily: site.fontFamily }}
    >
      <div className="grid h-screen grid-cols-[290px_500px_minmax(0,1fr)]">
        <aside className="relative flex h-screen flex-col border-l border-white/70 bg-white/75 shadow-[0_30px_120px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <div className="flex h-[96px] items-center gap-3 border-b border-slate-200/70 px-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-violet-700 via-fuchsia-600 to-violet-500 text-xl font-black text-white shadow-2xl shadow-violet-200">
              B
            </div>

            <div>
              <p className="text-xs font-black text-violet-700">Bizuply</p>
              <h1 className="text-xl font-black tracking-tight text-slate-950">
                Website Studio
              </h1>
              <p className="text-xs font-bold text-slate-400">No-code builder</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <p className="mb-3 px-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              ניהול האתר
            </p>

            <div className="space-y-1.5">
              {panels.map((panel) => {
                const active = activePanel === panel.key;

                return (
                  <button
                    key={panel.key}
                    type="button"
                    onClick={() => setActivePanel(panel.key)}
                    className={[
                      "group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-black transition-all duration-200",
                      active
                        ? "bg-gradient-to-l from-violet-700 to-fuchsia-600 text-white shadow-xl shadow-violet-200"
                        : "text-slate-600 hover:-translate-x-0.5 hover:bg-white hover:text-slate-950 hover:shadow-lg hover:shadow-slate-200/60",
                    ].join(" ")}
                  >
                    <span>{panel.label}</span>
                    <span
                      className={[
                        "flex h-8 w-8 items-center justify-center rounded-xl text-sm transition",
                        active
                          ? "bg-white/18 text-white"
                          : "bg-slate-100 text-slate-400 group-hover:bg-violet-50 group-hover:text-violet-700",
                      ].join(" ")}
                    >
                      {panel.icon}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-7">
              <p className="mb-3 px-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                הוספת בלוקים
              </p>

              <div className="grid grid-cols-2 gap-2">
                {blockOptions.map((block) => (
                  <button
                    key={block.type}
                    type="button"
                    onClick={() => addBlock(block.type)}
                    className="rounded-2xl border border-slate-200/80 bg-white/80 p-3 text-right shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50"
                  >
                    <p className="text-xs font-black text-slate-900">{block.title}</p>
                    <p className="mt-1 text-[10px] font-bold leading-4 text-slate-400">
                      {block.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/70 p-4">
            <div className="overflow-hidden rounded-[1.8rem] bg-slate-950 p-4 text-white shadow-2xl shadow-slate-300">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold text-white/45">כתובת ציבורית</p>
                <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-black text-emerald-300">
                  {site.published ? "פורסם" : "טיוטה"}
                </span>
              </div>

              <p className="truncate text-sm font-black" dir="ltr">
                {publicUrl}
              </p>

              <button
                type="button"
                onClick={saveSite}
                disabled={!slugValid}
                className="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-sm font-black text-violet-700 shadow-xl transition hover:-translate-y-0.5 hover:bg-violet-50 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
              >
                פרסם אתר
              </button>
            </div>
          </div>
        </aside>

        <section className="h-screen overflow-y-auto border-l border-white/70 bg-white/55 backdrop-blur-2xl">
          <div className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 px-6 py-5 shadow-sm backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">
                  עורך האתר
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                  {panels.find((panel) => panel.key === activePanel)?.label}
                </h2>
              </div>

              {savedAt && (
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                  נשמר {savedAt}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-5 p-6">
            {activePanel === "studio" && (
              <>
                <EditorCard
                  title="גרירה, מחיקה, שכפול וסידור בלוקים"
                  subtitle="גררי את הבלוקים כדי לשנות סדר. לחיצה על בלוק תפתח עריכה מתקדמת."
                >
                  <div className="space-y-3">
                    {site.blocks.map((block, index) => {
                      const active = selectedBlockId === block.id;

                      return (
                        <div
                          key={block.id}
                          draggable
                          onDragStart={() => setDraggedBlockId(block.id)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={() => handleDropBlock(block.id)}
                          onClick={() => setSelectedBlockId(block.id)}
                          className={[
                            "cursor-pointer rounded-[1.5rem] border p-4 transition-all duration-200",
                            active
                              ? "border-violet-500 bg-violet-50 shadow-2xl shadow-violet-100"
                              : "border-slate-200 bg-white/80 shadow-lg shadow-slate-200/50 hover:-translate-y-0.5 hover:border-violet-200",
                          ].join(" ")}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-sm font-black text-slate-500">
                                ⋮⋮
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-950">
                                  {index + 1}. {block.title}
                                </p>
                                <p className="text-xs font-bold text-slate-400">
                                  {block.type} · {block.width} · radius {block.radius}px
                                </p>
                              </div>
                            </div>

                            <label
                              onClick={(event) => event.stopPropagation()}
                              className="flex items-center gap-2 text-xs font-black text-slate-500"
                            >
                              פעיל
                              <input
                                type="checkbox"
                                checked={block.enabled}
                                onChange={(event) =>
                                  updateBlock(block.id, {
                                    enabled: event.target.checked,
                                  })
                                }
                                className="h-4 w-4 accent-violet-700"
                              />
                            </label>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <SmallAction onClick={() => moveBlock(block.id, "up")}>
                              למעלה
                            </SmallAction>
                            <SmallAction onClick={() => moveBlock(block.id, "down")}>
                              למטה
                            </SmallAction>
                            <SmallAction onClick={() => duplicateBlock(block.id)}>
                              שכפול
                            </SmallAction>
                            <SmallAction
                              danger
                              onClick={() => deleteBlock(block.id)}
                            >
                              מחיקה
                            </SmallAction>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </EditorCard>

                {selectedBlock && (
                  <EditorCard
                    title={`עריכת בלוק: ${selectedBlock.title}`}
                    subtitle="כאן משנים גודל, ריווח, עיגול פינות, רקע, אפקטים ואנימציות."
                  >
                    <Field
                      label="שם הבלוק"
                      value={selectedBlock.title}
                      onChange={(value) =>
                        updateBlock(selectedBlock.id, { title: value })
                      }
                    />

                    <Label>רוחב הבלוק</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {(["full", "wide", "boxed", "split"] as WidthMode[]).map(
                        (width) => (
                          <button
                            key={width}
                            type="button"
                            onClick={() =>
                              updateBlock(selectedBlock.id, { width })
                            }
                            className={[
                              "rounded-2xl px-3 py-3 text-xs font-black transition",
                              selectedBlock.width === width
                                ? "bg-violet-700 text-white shadow-xl shadow-violet-200"
                                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-violet-50",
                            ].join(" ")}
                          >
                            {width}
                          </button>
                        )
                      )}
                    </div>

                    <RangeField
                      label="עיגול פינות"
                      value={selectedBlock.radius}
                      min={0}
                      max={60}
                      onChange={(value) =>
                        updateBlock(selectedBlock.id, { radius: value })
                      }
                    />

                    <RangeField
                      label="ריווח פנימי"
                      value={selectedBlock.padding}
                      min={16}
                      max={90}
                      onChange={(value) =>
                        updateBlock(selectedBlock.id, { padding: value })
                      }
                    />

                    <Label>אפקט</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {(["none", "glass", "glow", "luxury", "soft"] as EffectMode[]).map(
                        (effect) => (
                          <button
                            key={effect}
                            type="button"
                            onClick={() =>
                              updateBlock(selectedBlock.id, { effect })
                            }
                            className={[
                              "rounded-2xl px-3 py-3 text-[11px] font-black transition",
                              selectedBlock.effect === effect
                                ? "bg-slate-950 text-white"
                                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
                            ].join(" ")}
                          >
                            {effect}
                          </button>
                        )
                      )}
                    </div>

                    <Label>אנימציה</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {(["none", "fade", "rise", "zoom"] as AnimationMode[]).map(
                        (animation) => (
                          <button
                            key={animation}
                            type="button"
                            onClick={() =>
                              updateBlock(selectedBlock.id, { animation })
                            }
                            className={[
                              "rounded-2xl px-3 py-3 text-xs font-black transition",
                              selectedBlock.animation === animation
                                ? "bg-violet-700 text-white shadow-xl shadow-violet-200"
                                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-violet-50",
                            ].join(" ")}
                          >
                            {animation}
                          </button>
                        )
                      )}
                    </div>

                    <div className="grid grid-cols-[1fr_72px] gap-3">
                      <div>
                        <Label>רקע הבלוק</Label>
                        <input
                          value={selectedBlock.background}
                          onChange={(event) =>
                            updateBlock(selectedBlock.id, {
                              background: event.target.value,
                            })
                          }
                          className={inputClass}
                          dir="ltr"
                        />
                      </div>

                      <div>
                        <Label>בחירה</Label>
                        <input
                          type="color"
                          value={selectedBlock.background}
                          onChange={(event) =>
                            updateBlock(selectedBlock.id, {
                              background: event.target.value,
                            })
                          }
                          className="h-[49px] w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-2"
                        />
                      </div>
                    </div>
                  </EditorCard>
                )}
              </>
            )}

            {activePanel === "design" && (
              <>
                <EditorCard title="מבנים מוכנים" subtitle="בחרי מבנה עיצובי לכל האתר">
                  <div className="grid grid-cols-2 gap-3">
                    {templateOptions.map((template) => (
                      <button
                        key={template.key}
                        type="button"
                        onClick={() => applyTemplate(template.key)}
                        className={[
                          "rounded-[1.6rem] border p-4 text-right transition hover:-translate-y-1",
                          site.template === template.key
                            ? "border-violet-500 bg-violet-50 shadow-2xl shadow-violet-100"
                            : "border-slate-200 bg-white/85 shadow-lg shadow-slate-200/50",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "mb-4 h-24 rounded-[1.2rem]",
                            template.key === "clean" &&
                              "bg-gradient-to-br from-slate-50 to-slate-200",
                            template.key === "modern" &&
                              "bg-gradient-to-br from-pink-100 via-white to-violet-200",
                            template.key === "luxury" &&
                              "bg-gradient-to-br from-slate-950 via-violet-950 to-black",
                            template.key === "bold" &&
                              "bg-gradient-to-br from-fuchsia-600 via-violet-700 to-blue-600",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        />
                        <p className="text-base font-black text-slate-950">
                          {template.title}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                          {template.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </EditorCard>

                <EditorCard title="תבניות צבעים" subtitle="אפשר לבחור תבנית או להגדיר לבד">
                  <div className="space-y-3">
                    {paletteOptions.map((palette) => (
                      <button
                        key={palette.name}
                        type="button"
                        onClick={() => applyPalette(palette)}
                        className="flex w-full items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/85 p-4 shadow-lg shadow-slate-200/50 transition hover:-translate-y-0.5 hover:border-violet-200"
                      >
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-950">
                            {palette.name}
                          </p>
                          <p className="mt-1 text-xs font-bold text-slate-400">
                            צבע ראשי, רקע, טקסט והדגשות
                          </p>
                        </div>

                        <div className="flex gap-1">
                          {[palette.primary, palette.secondary, palette.background, palette.text].map(
                            (color) => (
                              <span
                                key={color}
                                className="h-8 w-8 rounded-xl border border-white shadow"
                                style={{ backgroundColor: color }}
                              />
                            )
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <ColorField
                      label="צבע ראשי"
                      value={site.primaryColor}
                      onChange={(value) => updateSite("primaryColor", value)}
                    />
                    <ColorField
                      label="צבע משני"
                      value={site.secondaryColor}
                      onChange={(value) => updateSite("secondaryColor", value)}
                    />
                    <ColorField
                      label="רקע אתר"
                      value={site.backgroundColor}
                      onChange={(value) => updateSite("backgroundColor", value)}
                    />
                    <ColorField
                      label="צבע טקסט"
                      value={site.textColor}
                      onChange={(value) => updateSite("textColor", value)}
                    />
                  </div>
                </EditorCard>

                <EditorCard title="הגדרות כלליות" subtitle="עיגול פינות, ריווח, פונט ואנימציה">
                  <Label>פונט</Label>
                  <select
                    value={site.fontFamily}
                    onChange={(event) =>
                      updateSite("fontFamily", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="Heebo">Heebo</option>
                    <option value="Assistant">Assistant</option>
                    <option value="Rubik">Rubik</option>
                    <option value="Arial">Arial</option>
                  </select>

                  <RangeField
                    label="עיגול פינות כללי"
                    value={site.pageRadius}
                    min={0}
                    max={60}
                    onChange={(value) => updateSite("pageRadius", value)}
                  />

                  <RangeField
                    label="מרווחים בין בלוקים"
                    value={site.pageSpacing}
                    min={8}
                    max={70}
                    onChange={(value) => updateSite("pageSpacing", value)}
                  />

                  <Label>אנימציה גלובלית</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["none", "fade", "rise", "zoom"] as AnimationMode[]).map(
                      (animation) => (
                        <button
                          key={animation}
                          type="button"
                          onClick={() => updateSite("globalAnimation", animation)}
                          className={[
                            "rounded-2xl px-3 py-3 text-xs font-black transition",
                            site.globalAnimation === animation
                              ? "bg-violet-700 text-white shadow-xl shadow-violet-200"
                              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-violet-50",
                          ].join(" ")}
                        >
                          {animation}
                        </button>
                      )
                    )}
                  </div>
                </EditorCard>
              </>
            )}

            {activePanel === "domain" && (
              <EditorCard
                title="דומיין ציבורי"
                subtitle="העסק חייב לבחור שם באנגלית. זה יהיה האתר הציבורי שלו."
              >
                <Label>שם האתר באנגלית</Label>
                <div className="flex overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-lg shadow-slate-200/60">
                  <input
                    value={site.slug}
                    onChange={(event) =>
                      updateSite("slug", event.target.value.toLowerCase().trim())
                    }
                    placeholder="hadar-beauty"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-left text-sm font-black text-slate-800 outline-none"
                    dir="ltr"
                  />
                  <div className="border-r border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-black text-slate-500">
                    .bizuply.com
                  </div>
                </div>

                {!slugValid && (
                  <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-xs font-black leading-5 text-rose-600">
                    מותר רק אותיות באנגלית קטנות, מספרים ומקף. לדוגמה:
                    hadar-beauty
                  </p>
                )}

                <div className="mt-5 rounded-[1.7rem] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-300">
                  <p className="text-xs font-bold text-white/45">
                    כתובת האתר הציבורי
                  </p>
                  <p className="mt-2 break-all text-lg font-black" dir="ltr">
                    {publicUrl}
                  </p>
                </div>

                <Field
                  label="דומיין אישי, אופציונלי"
                  value={site.customDomain}
                  onChange={(value) => updateSite("customDomain", value)}
                  placeholder="www.yourbusiness.co.il"
                  dir="ltr"
                />
              </EditorCard>
            )}

            {activePanel === "business" && (
              <EditorCard title="פרטי העסק" subtitle="הפרטים הראשיים שיופיעו באתר">
                <Field
                  label="שם העסק"
                  value={site.businessName}
                  onChange={(value) => updateSite("businessName", value)}
                />
                <Field
                  label="אותיות לוגו"
                  value={site.logoText}
                  onChange={(value) => updateSite("logoText", value)}
                />
                <Field
                  label="תחום העסק"
                  value={site.category}
                  onChange={(value) => updateSite("category", value)}
                />
                <Field
                  label="עיר / אזור"
                  value={site.city}
                  onChange={(value) => updateSite("city", value)}
                />
                <Field
                  label="כותרת ראשית"
                  value={site.heroTitle}
                  onChange={(value) => updateSite("heroTitle", value)}
                />
                <Textarea
                  label="כותרת משנה"
                  value={site.heroSubtitle}
                  onChange={(value) => updateSite("heroSubtitle", value)}
                  rows={4}
                />
                <Field
                  label="תמונת קאבר URL"
                  value={site.heroImage}
                  onChange={(value) => updateSite("heroImage", value)}
                  dir="ltr"
                />
                <Field
                  label="כפתור ראשי"
                  value={site.primaryButton}
                  onChange={(value) => updateSite("primaryButton", value)}
                />
                <Field
                  label="כפתור משני"
                  value={site.secondaryButton}
                  onChange={(value) => updateSite("secondaryButton", value)}
                />
                <Field
                  label="כותרת אודות"
                  value={site.aboutTitle}
                  onChange={(value) => updateSite("aboutTitle", value)}
                />
                <Textarea
                  label="טקסט אודות"
                  value={site.aboutText}
                  onChange={(value) => updateSite("aboutText", value)}
                  rows={6}
                />
              </EditorCard>
            )}

            {activePanel === "services" && (
              <EditorCard
                title="שירותים"
                subtitle="השירותים מוגדרים כאן ומופיעים אוטומטית בבלוק שירותים באתר."
                actionLabel="+ הוספת שירות"
                onAction={addService}
              >
                <div className="space-y-4">
                  {site.services.map((service) => (
                    <div
                      key={service.id}
                      className="rounded-[1.7rem] border border-slate-200/80 bg-white/80 p-4 shadow-lg shadow-slate-200/50"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-black text-slate-800">
                          {service.title}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            updateSite(
                              "services",
                              site.services.filter((item) => item.id !== service.id)
                            )
                          }
                          className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-600"
                        >
                          מחיקה
                        </button>
                      </div>

                      <Field
                        label="שם שירות"
                        value={service.title}
                        onChange={(value) =>
                          updateService(service.id, "title", value)
                        }
                      />
                      <Textarea
                        label="תיאור"
                        value={service.description}
                        onChange={(value) =>
                          updateService(service.id, "description", value)
                        }
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <Field
                          label="מחיר"
                          value={service.price}
                          onChange={(value) =>
                            updateService(service.id, "price", value)
                          }
                        />
                        <Field
                          label="משך זמן"
                          value={service.duration}
                          onChange={(value) =>
                            updateService(service.id, "duration", value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </EditorCard>
            )}

            {activePanel === "products" && (
              <EditorCard
                title="מוצרים וסליקה"
                subtitle="מוצרים שיופיעו באתר. כפתורי רכישה יתחברו בהמשך לסליקה של העסק."
                actionLabel="+ הוספת מוצר"
                onAction={addProduct}
              >
                <Toggle
                  label="הפעלת סליקה באתר"
                  checked={site.paymentsEnabled}
                  onChange={(value) => updateSite("paymentsEnabled", value)}
                />

                <div className="mt-5 space-y-4">
                  {site.products.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-[1.7rem] border border-slate-200/80 bg-white/80 p-4 shadow-lg shadow-slate-200/50"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-black text-slate-800">
                          {product.title}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            updateSite(
                              "products",
                              site.products.filter((item) => item.id !== product.id)
                            )
                          }
                          className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-600"
                        >
                          מחיקה
                        </button>
                      </div>

                      <Field
                        label="שם מוצר"
                        value={product.title}
                        onChange={(value) =>
                          updateProduct(product.id, "title", value)
                        }
                      />
                      <Textarea
                        label="תיאור מוצר"
                        value={product.description}
                        onChange={(value) =>
                          updateProduct(product.id, "description", value)
                        }
                      />
                      <Field
                        label="מחיר"
                        value={product.price}
                        onChange={(value) =>
                          updateProduct(product.id, "price", value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </EditorCard>
            )}

            {activePanel === "booking" && (
              <EditorCard
                title="תיאום תורים"
                subtitle="עדיף להשאיר את ניהול שעות הפעילות בקוד נפרד של CRM/יומן, והאתר רק יציג את הזמנים הפנויים."
              >
                <Toggle
                  label="הפעלת תיאום תורים באתר"
                  checked={site.bookingEnabled}
                  onChange={(value) => updateSite("bookingEnabled", value)}
                />

                <div className="mt-5 rounded-[1.7rem] border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 shadow-lg shadow-violet-100/60">
                  <p className="text-sm font-black text-violet-900">
                    מומלץ טכנית:
                  </p>
                  <p className="mt-2 text-sm font-bold leading-6 text-violet-700">
                    שעות פעילות, זמינות, שירותים ותורים יהיו בקומפוננטות/מודלים נפרדים:
                    CRMServices, WorkHours, Appointments. ה־Builder רק בוחר אם להציג
                    אותם ואיך לעצב אותם באתר.
                  </p>
                </div>
              </EditorCard>
            )}

            {activePanel === "contact" && (
              <EditorCard title="יצירת קשר" subtitle="פרטים שיופיעו באתר הציבורי">
                <Field
                  label="טלפון"
                  value={site.phone}
                  onChange={(value) => updateSite("phone", value)}
                />
                <Field
                  label="וואטסאפ"
                  value={site.whatsapp}
                  onChange={(value) => updateSite("whatsapp", value)}
                />
                <Field
                  label="אימייל"
                  value={site.email}
                  onChange={(value) => updateSite("email", value)}
                />
                <Field
                  label="כתובת"
                  value={site.address}
                  onChange={(value) => updateSite("address", value)}
                />
              </EditorCard>
            )}

            {activePanel === "seo" && (
              <EditorCard title="SEO" subtitle="כותרת ותיאור למנועי חיפוש">
                <Field
                  label="כותרת SEO"
                  value={site.seoTitle}
                  onChange={(value) => updateSite("seoTitle", value)}
                />
                <Textarea
                  rows={6}
                  label="תיאור SEO"
                  value={site.seoDescription}
                  onChange={(value) => updateSite("seoDescription", value)}
                />
              </EditorCard>
            )}
          </div>
        </section>

        <section className="h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_30%),linear-gradient(135deg,#f7f3ff,#ffffff)] p-6">
          <div className="sticky top-0 z-30 mb-5 flex items-center justify-between rounded-[1.8rem] border border-white/80 bg-white/82 px-5 py-4 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">
                תצוגה מקדימה חיה
              </p>
              <p className="mt-1 text-sm font-black text-slate-800" dir="ltr">
                {publicUrl}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex rounded-2xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setDeviceMode("desktop")}
                  className={[
                    "rounded-xl px-4 py-2 text-xs font-black transition",
                    deviceMode === "desktop"
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-500",
                  ].join(" ")}
                >
                  מחשב
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode("mobile")}
                  className={[
                    "rounded-xl px-4 py-2 text-xs font-black transition",
                    deviceMode === "mobile"
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-500",
                  ].join(" ")}
                >
                  מובייל
                </button>
              </div>

              <button
                type="button"
                onClick={saveSite}
                disabled={!slugValid}
                className="rounded-2xl bg-gradient-to-l from-violet-700 to-fuchsia-600 px-5 py-3 text-sm font-black text-white shadow-xl shadow-violet-200 transition hover:-translate-y-0.5 disabled:opacity-40"
              >
                שמור ופרסם
              </button>
            </div>
          </div>

          <div
            className={[
              "mx-auto transition-all duration-300",
              deviceMode === "mobile" ? "max-w-[390px]" : "max-w-7xl",
            ].join(" ")}
          >
            <LivePreview
              site={site}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onOpenStudio={() => setActivePanel("studio")}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function LivePreview({
  site,
  selectedBlockId,
  onSelectBlock,
  onOpenStudio,
}: {
  site: SiteState;
  selectedBlockId: string;
  onSelectBlock: (id: string) => void;
  onOpenStudio: () => void;
}) {
  const visibleBlocks = site.blocks.filter((block) => block.enabled);

  return (
    <div
      className="overflow-hidden border border-white bg-white shadow-[0_45px_160px_rgba(15,23,42,0.16)]"
      style={{
        borderRadius: site.pageRadius,
        backgroundColor: site.backgroundColor,
        color: site.textColor,
      }}
    >
      <header className="flex items-center justify-between border-b border-slate-100 bg-white/90 px-7 py-5 backdrop-blur-xl">
        <nav className="hidden gap-6 text-sm font-black text-slate-600 xl:flex">
          <a>דף הבית</a>
          <a>אודות</a>
          <a>שירותים</a>
          <a>מוצרים</a>
          <a>גלריה</a>
          <a>ביקורות</a>
          <a>צור קשר</a>
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black text-white shadow-xl"
            style={{ backgroundColor: site.primaryColor }}
          >
            {site.logoText}
          </div>
          <div>
            <p className="text-sm font-black text-slate-950">{site.businessName}</p>
            <p className="text-xs font-bold text-slate-400">{site.category}</p>
          </div>
        </div>
      </header>

      <div style={{ padding: site.pageSpacing }}>
        <div className="space-y-6">
          {visibleBlocks.map((block) => (
            <PreviewBlockShell
              key={block.id}
              block={block}
              selected={selectedBlockId === block.id}
              onClick={() => {
                onSelectBlock(block.id);
                onOpenStudio();
              }}
            >
              <RenderBlock block={block} site={site} />
            </PreviewBlockShell>
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewBlockShell({
  block,
  selected,
  onClick,
  children,
}: {
  block: SiteBlock;
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const maxWidth =
    block.width === "full"
      ? "100%"
      : block.width === "wide"
        ? "1180px"
        : block.width === "boxed"
          ? "880px"
          : "1040px";

  const effectClass =
    block.effect === "glass"
      ? "bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_25px_100px_rgba(15,23,42,0.10)]"
      : block.effect === "glow"
        ? "shadow-[0_30px_120px_rgba(124,58,237,0.22)]"
        : block.effect === "luxury"
          ? "shadow-[0_35px_140px_rgba(2,6,23,0.24)]"
          : block.effect === "soft"
            ? "shadow-[0_22px_80px_rgba(15,23,42,0.08)]"
            : "";

  const animationClass =
    block.animation === "fade"
      ? "animate-[fadeIn_0.45s_ease-out]"
      : block.animation === "rise"
        ? "animate-[riseIn_0.5s_ease-out]"
        : block.animation === "zoom"
          ? "animate-[zoomIn_0.45s_ease-out]"
          : "";

  return (
    <section
      onClick={onClick}
      className={[
        "group relative mx-auto cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-0.5",
        selected ? "ring-4 ring-violet-400 ring-offset-4 ring-offset-white" : "",
        effectClass,
        animationClass,
      ].join(" ")}
      style={{
        maxWidth,
        width: "100%",
        borderRadius: block.radius,
        padding: block.padding,
        background: block.background,
      }}
    >
      <div className="absolute right-4 top-4 z-20 hidden rounded-full bg-slate-950/90 px-3 py-1 text-xs font-black text-white shadow-xl group-hover:block">
        {block.title} · לחץ לעריכה
      </div>

      {children}
    </section>
  );
}

function RenderBlock({ block, site }: { block: SiteBlock; site: SiteState }) {
  if (block.type === "hero") {
    return (
      <div className="relative grid min-h-[430px] items-center gap-10 xl:grid-cols-[1fr_0.85fr]">
        <div
          className="absolute inset-0 -z-10 opacity-80"
          style={{
            background: `radial-gradient(circle at 12% 16%, ${site.secondaryColor}, transparent 38%), linear-gradient(135deg,#ffffff,${site.backgroundColor})`,
          }}
        />

        <div>
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-xs font-black text-slate-600 shadow-sm backdrop-blur-xl">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: site.primaryColor }}
            />
            {site.city} · {site.category}
          </div>

          <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-slate-950 xl:text-6xl">
            {site.heroTitle}
          </h1>

          <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-slate-600">
            {site.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {site.bookingEnabled && (
              <button
                className="rounded-2xl px-7 py-4 text-sm font-black text-white shadow-2xl transition hover:-translate-y-0.5"
                style={{ backgroundColor: site.primaryColor }}
              >
                {site.primaryButton}
              </button>
            )}

            <button className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-sm font-black text-slate-800 shadow-lg">
              {site.secondaryButton}
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div
            className="absolute -inset-8 rounded-[3rem] blur-3xl"
            style={{ backgroundColor: `${site.primaryColor}2d` }}
          />
          <div className="relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl">
            <img
              src={site.heroImage}
              alt=""
              className="h-[360px] w-[330px] rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "about") {
    return (
      <div className="text-center">
        <SectionTitle title={site.aboutTitle} color={site.primaryColor} />
        <p className="mx-auto mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-600">
          {site.aboutText}
        </p>
      </div>
    );
  }

  if (block.type === "services") {
    return (
      <div>
        <SectionTitle title="השירותים שלנו" color={site.primaryColor} />

        <div className="mt-8 grid gap-4 xl:grid-cols-3">
          {site.services.map((service) => (
            <article
              key={service.id}
              className="rounded-[1.7rem] border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black text-white"
                style={{ backgroundColor: site.primaryColor }}
              >
                ✦
              </div>

              <p className="text-lg font-black text-slate-950">{service.title}</p>
              <p className="mt-2 min-h-14 text-sm font-semibold leading-6 text-slate-500">
                {service.description}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm font-black text-slate-400">
                  {service.duration}
                </span>
                <span
                  className="rounded-full px-3 py-1 text-sm font-black text-white"
                  style={{ backgroundColor: site.primaryColor }}
                >
                  {service.price}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "products") {
    return (
      <div>
        <SectionTitle title="מוצרים לרכישה" color={site.primaryColor} />

        <div className="mt-8 grid gap-4 xl:grid-cols-2">
          {site.products.map((product) => (
            <article
              key={product.id}
              className="flex items-center justify-between gap-4 rounded-[1.7rem] border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/60"
            >
              <div>
                <p className="text-lg font-black">{product.title}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                  {product.description}
                </p>
              </div>

              <div className="text-left">
                <p className="text-xl font-black">{product.price}</p>
                {site.paymentsEnabled && (
                  <button
                    className="mt-2 rounded-xl px-4 py-2 text-xs font-black text-white"
                    style={{ backgroundColor: site.primaryColor }}
                  >
                    הוספה לסל
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "gallery") {
    return (
      <div>
        <SectionTitle title="גלריה" color={site.primaryColor} />

        <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {site.gallery.filter(Boolean).map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt=""
              className="h-44 w-full rounded-[1.5rem] object-cover shadow-xl shadow-slate-200/70"
            />
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "reviews") {
    return (
      <div>
        <SectionTitle title="ביקורות לקוחות" color={site.primaryColor} />

        <div className="mt-8 grid gap-4 xl:grid-cols-2">
          {site.reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-[1.7rem] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/60"
            >
              <div className="text-amber-400">★★★★★</div>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                "{review.text}"
              </p>
              <p className="mt-4 font-black text-slate-950">{review.name}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "faq") {
    return (
      <div>
        <SectionTitle title="שאלות נפוצות" color={site.primaryColor} />

        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {site.faqs.map((faq) => (
            <div
              key={faq.id}
              className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/60"
            >
              <p className="font-black text-slate-950">{faq.question}</p>
              <p className="mt-2 text-sm font-semibold leading-7 text-slate-500">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "booking") {
    return (
      <div className="grid items-center gap-8 text-white xl:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-black text-violet-300">תיאום תורים</p>
          <h2 className="mt-2 text-4xl font-black tracking-tight">
            קובעים תור ישירות מהאתר
          </h2>
          <p className="mt-4 text-sm font-semibold leading-7 text-white/60">
            הלקוח בוחר שירות, תאריך ושעה. הפגישה נכנסת ליומן ול־CRM של העסק.
          </p>
        </div>

        <div className="rounded-[1.7rem] bg-white p-5 text-slate-950 shadow-2xl">
          <div className="grid grid-cols-3 gap-2">
            {["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳"].map((day) => (
              <button
                key={day}
                className="rounded-2xl bg-slate-50 px-3 py-3 text-sm font-black"
              >
                {day}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {["09:00", "10:30", "12:00", "14:00", "16:30", "18:00"].map(
              (time) => (
                <button
                  key={time}
                  className="rounded-2xl border border-violet-100 bg-violet-50 px-3 py-3 text-sm font-black text-violet-700"
                >
                  {time}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "club") {
    return (
      <div className="flex flex-col justify-between gap-5 text-white xl:flex-row xl:items-center">
        <div>
          <p className="text-3xl font-black">הצטרפות למועדון לקוחות</p>
          <p className="mt-2 text-sm font-semibold text-white/80">
            קבלו עדכונים, הטבות וקופונים מהעסק.
          </p>
        </div>

        <button className="rounded-2xl bg-white px-6 py-3 text-sm font-black text-slate-950 shadow-xl">
          הצטרפות
        </button>
      </div>
    );
  }

  if (block.type === "contact") {
    return (
      <div className="text-white">
        <SectionTitle title="יצירת קשר" color={site.primaryColor} light />

        <div className="mt-8 grid gap-4 xl:grid-cols-4">
          <ContactBox label="טלפון" value={site.phone} />
          <ContactBox label="וואטסאפ" value={site.whatsapp} />
          <ContactBox label="אימייל" value={site.email} />
          <ContactBox label="כתובת" value={site.address} />
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <SectionTitle title={block.title} color={site.primaryColor} />
      <p className="mt-4 text-sm font-semibold text-slate-500">
        בלוק מותאם אישית
      </p>
    </div>
  );
}

function EditorCard({
  title,
  subtitle,
  children,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <section className="rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.07)] backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-950">{title}</h3>
          {subtitle && (
            <p className="mt-1 text-xs font-bold leading-5 text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="rounded-2xl bg-violet-100 px-4 py-2 text-xs font-black text-violet-700 transition hover:bg-violet-200"
          >
            {actionLabel}
          </button>
        )}
      </div>

      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 mt-4 block text-sm font-black text-slate-700">
      {children}
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
        dir={dir || "rtl"}
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className={textareaClass}
      />
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="grid grid-cols-[1fr_56px] gap-2">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
          dir="ltr"
        />
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[49px] w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-2"
        />
      </div>
    </div>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 mt-5 flex items-center justify-between">
        <label className="text-sm font-black text-slate-700">{label}</label>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
          {value}px
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-violet-700"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm transition hover:bg-white"
    >
      <span className="text-sm font-black text-slate-700">{label}</span>

      <span
        className={[
          "relative h-7 w-12 rounded-full transition",
          checked ? "bg-violet-700" : "bg-slate-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition",
            checked ? "right-6" : "right-1",
          ].join(" ")}
        />
      </span>
    </button>
  );
}

function SmallAction({
  children,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={[
        "rounded-full px-3 py-1.5 text-xs font-black transition",
        danger
          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-700",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function SectionTitle({
  title,
  color,
  light = false,
}: {
  title: string;
  color: string;
  light?: boolean;
}) {
  return (
    <div className="text-center">
      <p
        className={[
          "text-3xl font-black tracking-tight",
          light ? "text-white" : "text-slate-950",
        ].join(" ")}
      >
        {title}
      </p>
      <div
        className="mx-auto mt-3 h-1 w-16 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

function ContactBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-xl">
      <p className="text-xs font-bold text-white/45">{label}</p>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}