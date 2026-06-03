"use client";

import React, { useMemo, useState } from "react";

type ThemeKey = "clean" | "modern" | "luxury";
type DeviceMode = "desktop" | "mobile";

type ActivePanel =
  | "design"
  | "business"
  | "hero"
  | "about"
  | "services"
  | "products"
  | "gallery"
  | "reviews"
  | "faq"
  | "booking"
  | "customerClub"
  | "contact"
  | "domain"
  | "seo";

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
  rating: number;
};

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type SiteState = {
  published: boolean;
  slug: string;
  customDomain: string;

  theme: ThemeKey;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  rounded: boolean;
  softShadows: boolean;
  glassEffect: boolean;

  businessName: string;
  category: string;
  city: string;
  logoText: string;

  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  mainCtaText: string;
  secondaryCtaText: string;

  aboutTitle: string;
  aboutText: string;

  servicesEnabled: boolean;
  productsEnabled: boolean;
  bookingEnabled: boolean;
  paymentsEnabled: boolean;
  customerClubEnabled: boolean;

  services: ServiceItem[];
  products: ProductItem[];
  gallery: string[];
  reviews: ReviewItem[];
  faqs: FaqItem[];

  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;

  seoTitle: string;
  seoDescription: string;
};

const initialSite: SiteState = {
  published: false,
  slug: "hadar-beauty",
  customDomain: "",

  theme: "luxury",
  primaryColor: "#7c3aed",
  secondaryColor: "#f5efff",
  fontFamily: "Heebo",
  rounded: true,
  softShadows: true,
  glassEffect: true,

  businessName: "הדר עשת ביוטי",
  category: "איפור קבוע וטיפולי יופי",
  city: "קריית אתא",
  logoText: "HB",

  heroTitle: "הדר עשת ביוטי",
  heroSubtitle: "איפור קבוע וטיפולי יופי בהתאמה אישית, בגימור טבעי ומדויק.",
  heroImage:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90",
  mainCtaText: "קביעת תור",
  secondaryCtaText: "שליחת הודעה",

  aboutTitle: "קצת על העסק",
  aboutText:
    "סטודיו מקצועי לטיפולי יופי, איפור קבוע, גבות ושירותי אסתטיקה מתקדמים. כל טיפול מותאם אישית למבנה הפנים, לסגנון ולמטרה של הלקוחה.",

  servicesEnabled: true,
  productsEnabled: true,
  bookingEnabled: true,
  paymentsEnabled: true,
  customerClubEnabled: true,

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
      rating: 5,
    },
    {
      id: "review-2",
      name: "נועה כהן",
      text: "חוויה מהממת, המקום נקי, נעים והתוצאה בדיוק כמו שרציתי.",
      rating: 5,
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

  phone: "050-0000000",
  whatsapp: "050-0000000",
  email: "hello@business.com",
  address: "קריית אתא",
  instagram: "",
  facebook: "",

  seoTitle: "הדר עשת ביוטי | איפור קבוע בקריות",
  seoDescription:
    "אתר עסקי מקצועי עם שירותים, גלריה, ביקורות, תיאום תורים ומוצרים.",
};

const panels: { key: ActivePanel; label: string; icon: string }[] = [
  { key: "design", label: "עיצוב", icon: "✦" },
  { key: "business", label: "פרטי העסק", icon: "⌂" },
  { key: "hero", label: "הדר ראשי", icon: "◈" },
  { key: "about", label: "אודות", icon: "☰" },
  { key: "services", label: "שירותים", icon: "◇" },
  { key: "products", label: "מוצרים וסליקה", icon: "▣" },
  { key: "gallery", label: "גלריה", icon: "▧" },
  { key: "reviews", label: "ביקורות", icon: "☆" },
  { key: "faq", label: "שאלות נפוצות", icon: "?" },
  { key: "booking", label: "תיאום תורים", icon: "◷" },
  { key: "customerClub", label: "מועדון לקוחות", icon: "♛" },
  { key: "contact", label: "יצירת קשר", icon: "☎" },
  { key: "domain", label: "דומיין", icon: "◎" },
  { key: "seo", label: "SEO", icon: "↗" },
];

const colorOptions = [
  "#7c3aed",
  "#9333ea",
  "#c026d3",
  "#db2777",
  "#111827",
  "#92400e",
  "#0f766e",
  "#2563eb",
];

const inputClass =
  "w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3.5 text-sm font-bold text-slate-800 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100";

const textareaClass =
  "w-full resize-none rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3.5 text-sm font-bold leading-7 text-slate-800 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100";

export default function BusinessMiniSiteBuilder() {
  const [site, setSite] = useState<SiteState>(initialSite);
  const [activePanel, setActivePanel] = useState<ActivePanel>("design");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [savedAt, setSavedAt] = useState("");

  const publicUrl = useMemo(() => {
    const cleanSlug = site.slug.trim() || "your-business";
    return `https://${cleanSlug}.bizuply.com`;
  }, [site.slug]);

  const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(site.slug);

  const updateSite = <K extends keyof SiteState>(key: K, value: SiteState[K]) => {
    setSite((prev) => ({ ...prev, [key]: value }));
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

    setSite((prev) => ({ ...prev, published: true }));
    setSavedAt(
      new Date().toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const addService = () => {
    updateSite("services", [
      ...site.services,
      {
        id: crypto.randomUUID(),
        title: "שירות חדש",
        description: "תיאור קצר של השירות",
        price: "₪0",
        duration: "60 דקות",
      },
    ]);
  };

  const updateService = (
    id: string,
    field: keyof ServiceItem,
    value: string
  ) => {
    updateSite(
      "services",
      site.services.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const removeService = (id: string) => {
    updateSite(
      "services",
      site.services.filter((service) => service.id !== id)
    );
  };

  const addProduct = () => {
    updateSite("products", [
      ...site.products,
      {
        id: crypto.randomUUID(),
        title: "מוצר חדש",
        description: "תיאור קצר של המוצר",
        price: "₪0",
      },
    ]);
  };

  const updateProduct = (
    id: string,
    field: keyof ProductItem,
    value: string
  ) => {
    updateSite(
      "products",
      site.products.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const removeProduct = (id: string) => {
    updateSite(
      "products",
      site.products.filter((product) => product.id !== id)
    );
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_10%,rgba(124,58,237,0.18),transparent_34%),radial-gradient(circle_at_85%_15%,rgba(217,70,239,0.12),transparent_32%),linear-gradient(135deg,#f8f7ff_0%,#f3f0ff_45%,#ffffff_100%)] text-slate-950"
      style={{ fontFamily: site.fontFamily }}
    >
      <div className="grid h-screen grid-cols-[270px_455px_minmax(0,1fr)]">
        <aside className="relative flex h-screen flex-col border-l border-white/70 bg-white/75 shadow-[0_30px_120px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <div className="flex h-[94px] items-center gap-3 border-b border-slate-200/70 px-6">
            <div className="flex h-13 w-13 items-center justify-center rounded-[1.35rem] bg-gradient-to-br from-violet-700 via-fuchsia-600 to-violet-500 text-xl font-black text-white shadow-2xl shadow-violet-200">
              B
            </div>

            <div>
              <p className="text-xs font-black text-violet-700">Bizuply</p>
              <h1 className="text-xl font-black tracking-tight text-slate-950">
                האתר שלי
              </h1>
              <p className="text-xs font-bold text-slate-400">Website Studio</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <p className="mb-3 px-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              תפריט עריכה
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
          </div>

          <div className="border-t border-slate-200/70 p-4">
            <div className="overflow-hidden rounded-[1.7rem] bg-slate-950 p-4 text-white shadow-2xl shadow-slate-300">
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
          <div className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 px-6 py-5 shadow-sm backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">
                  עריכת אתר
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
            {activePanel === "design" && (
              <>
                <EditorCard title="בחירת תבנית" subtitle="בחרי את הסגנון הכללי של האתר">
                  <div className="grid grid-cols-3 gap-3">
                    {(["clean", "modern", "luxury"] as ThemeKey[]).map((theme) => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => updateSite("theme", theme)}
                        className={[
                          "group rounded-[1.5rem] border p-2.5 text-center transition-all duration-200",
                          site.theme === theme
                            ? "border-violet-500 bg-violet-50 shadow-2xl shadow-violet-100"
                            : "border-slate-200 bg-white/80 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-xl hover:shadow-slate-200/70",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "relative mb-3 h-24 overflow-hidden rounded-[1.15rem]",
                            theme === "clean"
                              ? "bg-gradient-to-br from-slate-50 to-slate-200"
                              : "",
                            theme === "modern"
                              ? "bg-gradient-to-br from-rose-100 via-white to-violet-200"
                              : "",
                            theme === "luxury"
                              ? "bg-gradient-to-br from-slate-950 via-stone-900 to-black"
                              : "",
                          ].join(" ")}
                        >
                          <div className="absolute bottom-3 right-3 h-3 w-16 rounded-full bg-white/70" />
                          <div className="absolute bottom-8 right-3 h-3 w-10 rounded-full bg-white/60" />
                          <div className="absolute left-3 top-3 h-8 w-8 rounded-xl bg-white/50" />
                        </div>
                        <p className="text-sm font-black capitalize text-slate-800">
                          {theme}
                        </p>
                      </button>
                    ))}
                  </div>
                </EditorCard>

                <EditorCard title="צבעי מיתוג" subtitle="הצבעים ישפיעו על כפתורים, הדגשות וכרטיסים">
                  <div className="flex flex-wrap gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => updateSite("primaryColor", color)}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-white shadow-xl ring-1 ring-slate-200 transition hover:-translate-y-0.5"
                        style={{ backgroundColor: color }}
                      >
                        {site.primaryColor === color && (
                          <span className="text-lg font-black text-white">✓</span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-[1fr_72px] gap-3">
                    <div>
                      <Label>צבע מותאם אישית</Label>
                      <input
                        value={site.primaryColor}
                        onChange={(e) => updateSite("primaryColor", e.target.value)}
                        className={inputClass}
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <Label>בחירה</Label>
                      <input
                        type="color"
                        value={site.primaryColor}
                        onChange={(e) => updateSite("primaryColor", e.target.value)}
                        className="h-[50px] w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
                      />
                    </div>
                  </div>
                </EditorCard>

                <EditorCard title="טיפוגרפיה ונראות" subtitle="שליטה במראה הכללי של האתר">
                  <Label>פונט</Label>
                  <select
                    value={site.fontFamily}
                    onChange={(e) => updateSite("fontFamily", e.target.value)}
                    className={inputClass}
                  >
                    <option value="Heebo">Heebo</option>
                    <option value="Assistant">Assistant</option>
                    <option value="Rubik">Rubik</option>
                    <option value="Arial">Arial</option>
                  </select>

                  <div className="mt-5 space-y-3">
                    <Toggle
                      label="פינות מעוגלות"
                      checked={site.rounded}
                      onChange={(value) => updateSite("rounded", value)}
                    />
                    <Toggle
                      label="צללים רכים"
                      checked={site.softShadows}
                      onChange={(value) => updateSite("softShadows", value)}
                    />
                    <Toggle
                      label="אפקט זכוכית יוקרתי"
                      checked={site.glassEffect}
                      onChange={(value) => updateSite("glassEffect", value)}
                    />
                  </div>
                </EditorCard>
              </>
            )}

            {activePanel === "business" && (
              <EditorCard title="פרטי העסק" subtitle="הפרטים שיופיעו באתר הציבורי">
                <Field label="שם העסק" value={site.businessName} onChange={(v) => updateSite("businessName", v)} />
                <Field label="תחום העסק" value={site.category} onChange={(v) => updateSite("category", v)} />
                <Field label="עיר / אזור" value={site.city} onChange={(v) => updateSite("city", v)} />
                <Field label="טקסט לוגו קצר" value={site.logoText} onChange={(v) => updateSite("logoText", v)} />
              </EditorCard>
            )}

            {activePanel === "hero" && (
              <EditorCard title="הדר ראשי" subtitle="החלק הראשון שהלקוחות רואים באתר">
                <Field label="כותרת ראשית" value={site.heroTitle} onChange={(v) => updateSite("heroTitle", v)} />
                <Textarea label="כותרת משנה" value={site.heroSubtitle} onChange={(v) => updateSite("heroSubtitle", v)} />
                <Field label="תמונת קאבר URL" value={site.heroImage} onChange={(v) => updateSite("heroImage", v)} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="כפתור ראשי" value={site.mainCtaText} onChange={(v) => updateSite("mainCtaText", v)} />
                  <Field label="כפתור משני" value={site.secondaryCtaText} onChange={(v) => updateSite("secondaryCtaText", v)} />
                </div>
              </EditorCard>
            )}

            {activePanel === "about" && (
              <EditorCard title="אודות" subtitle="טקסט מקצועי קצר על העסק">
                <Field label="כותרת" value={site.aboutTitle} onChange={(v) => updateSite("aboutTitle", v)} />
                <Textarea rows={8} label="טקסט אודות" value={site.aboutText} onChange={(v) => updateSite("aboutText", v)} />
              </EditorCard>
            )}

            {activePanel === "services" && (
              <EditorCard title="שירותים" subtitle="שירותים שאפשר להציג ולהזמין" actionLabel="+ הוספת שירות" onAction={addService}>
                <Toggle label="הצגת שירותים באתר" checked={site.servicesEnabled} onChange={(v) => updateSite("servicesEnabled", v)} />

                <div className="mt-5 space-y-4">
                  {site.services.map((service) => (
                    <div key={service.id} className="rounded-[1.7rem] border border-slate-200/80 bg-white/80 p-4 shadow-lg shadow-slate-200/50">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-black text-slate-800">{service.title}</p>
                        <button type="button" onClick={() => removeService(service.id)} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-600">
                          מחיקה
                        </button>
                      </div>

                      <Field label="שם שירות" value={service.title} onChange={(v) => updateService(service.id, "title", v)} />
                      <Textarea label="תיאור" value={service.description} onChange={(v) => updateService(service.id, "description", v)} />

                      <div className="grid grid-cols-2 gap-3">
                        <Field label="מחיר" value={service.price} onChange={(v) => updateService(service.id, "price", v)} />
                        <Field label="משך זמן" value={service.duration} onChange={(v) => updateService(service.id, "duration", v)} />
                      </div>
                    </div>
                  ))}
                </div>
              </EditorCard>
            )}

            {activePanel === "products" && (
              <EditorCard title="מוצרים וסליקה" subtitle="מוצרים לרכישה וחיבור לסליקה של העסק" actionLabel="+ הוספת מוצר" onAction={addProduct}>
                <div className="space-y-3">
                  <Toggle label="הצגת מוצרים באתר" checked={site.productsEnabled} onChange={(v) => updateSite("productsEnabled", v)} />
                  <Toggle label="חיבור לסליקה של העסק" checked={site.paymentsEnabled} onChange={(v) => updateSite("paymentsEnabled", v)} />
                </div>

                <div className="mt-5 space-y-4">
                  {site.products.map((product) => (
                    <div key={product.id} className="rounded-[1.7rem] border border-slate-200/80 bg-white/80 p-4 shadow-lg shadow-slate-200/50">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-black text-slate-800">{product.title}</p>
                        <button type="button" onClick={() => removeProduct(product.id)} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-600">
                          מחיקה
                        </button>
                      </div>

                      <Field label="שם מוצר" value={product.title} onChange={(v) => updateProduct(product.id, "title", v)} />
                      <Textarea label="תיאור מוצר" value={product.description} onChange={(v) => updateProduct(product.id, "description", v)} />
                      <Field label="מחיר" value={product.price} onChange={(v) => updateProduct(product.id, "price", v)} />
                    </div>
                  ))}
                </div>
              </EditorCard>
            )}

            {activePanel === "gallery" && (
              <EditorCard title="גלריה" subtitle="תמונות שיופיעו באתר הציבורי">
                <div className="grid grid-cols-2 gap-3">
                  {site.gallery.map((image, index) => (
                    <div key={index} className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
                      <img src={image} alt="" className="h-28 w-full object-cover" />
                      <input
                        value={image}
                        onChange={(e) => {
                          const next = [...site.gallery];
                          next[index] = e.target.value;
                          updateSite("gallery", next);
                        }}
                        className="w-full border-0 bg-white px-3 py-3 text-xs font-bold outline-none"
                        dir="ltr"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => updateSite("gallery", [...site.gallery, ""])}
                  className="mt-4 w-full rounded-2xl border border-dashed border-violet-300 bg-violet-50/60 px-4 py-3 text-sm font-black text-violet-700 transition hover:bg-violet-100"
                >
                  + הוספת תמונה
                </button>
              </EditorCard>
            )}

            {activePanel === "reviews" && (
              <EditorCard title="ביקורות" subtitle="ביקורות שיופיעו באתר">
                <div className="space-y-4">
                  {site.reviews.map((review) => (
                    <div key={review.id} className="rounded-[1.7rem] border border-slate-200/80 bg-white/80 p-4 shadow-lg shadow-slate-200/50">
                      <Field
                        label="שם לקוח"
                        value={review.name}
                        onChange={(v) =>
                          updateSite(
                            "reviews",
                            site.reviews.map((item) =>
                              item.id === review.id ? { ...item, name: v } : item
                            )
                          )
                        }
                      />
                      <Textarea
                        label="טקסט ביקורת"
                        value={review.text}
                        onChange={(v) =>
                          updateSite(
                            "reviews",
                            site.reviews.map((item) =>
                              item.id === review.id ? { ...item, text: v } : item
                            )
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </EditorCard>
            )}

            {activePanel === "faq" && (
              <EditorCard title="שאלות נפוצות" subtitle="שאלות שעוזרות ללקוחות להבין את השירות">
                <div className="space-y-4">
                  {site.faqs.map((faq) => (
                    <div key={faq.id} className="rounded-[1.7rem] border border-slate-200/80 bg-white/80 p-4 shadow-lg shadow-slate-200/50">
                      <Field
                        label="שאלה"
                        value={faq.question}
                        onChange={(v) =>
                          updateSite(
                            "faqs",
                            site.faqs.map((item) =>
                              item.id === faq.id ? { ...item, question: v } : item
                            )
                          )
                        }
                      />
                      <Textarea
                        label="תשובה"
                        value={faq.answer}
                        onChange={(v) =>
                          updateSite(
                            "faqs",
                            site.faqs.map((item) =>
                              item.id === faq.id ? { ...item, answer: v } : item
                            )
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </EditorCard>
            )}

            {activePanel === "booking" && (
              <EditorCard title="תיאום תורים" subtitle="חיבור האתר ליומן של ביזאפלי">
                <Toggle label="הפעלת תיאום תורים באתר" checked={site.bookingEnabled} onChange={(v) => updateSite("bookingEnabled", v)} />

                <div className="mt-5 rounded-[1.7rem] border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 shadow-lg shadow-violet-100/60">
                  <p className="text-sm font-black text-violet-900">
                    הלקוח יבחר שירות, תאריך ושעה
                  </p>
                  <p className="mt-2 text-sm font-bold leading-6 text-violet-700">
                    הפגישה תיכנס אוטומטית לדשבורד, ליומן ול־CRM של העסק.
                  </p>
                </div>
              </EditorCard>
            )}

            {activePanel === "customerClub" && (
              <EditorCard title="מועדון לקוחות" subtitle="פיצ׳ר קטן באתר, לא החלק הראשי">
                <Toggle label="הצגת הצטרפות למועדון לקוחות באתר" checked={site.customerClubEnabled} onChange={(v) => updateSite("customerClubEnabled", v)} />

                <div className="mt-5 rounded-[1.7rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-300">
                  <p className="text-sm font-black">יופיע כסקשן קטן באתר</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-white/60">
                    לדוגמה: “הצטרפו למועדון וקבלו הטבות”. לא כעמוד הראשי.
                  </p>
                </div>
              </EditorCard>
            )}

            {activePanel === "contact" && (
              <EditorCard title="יצירת קשר" subtitle="פרטי קשר שיופיעו באתר">
                <Field label="טלפון" value={site.phone} onChange={(v) => updateSite("phone", v)} />
                <Field label="וואטסאפ" value={site.whatsapp} onChange={(v) => updateSite("whatsapp", v)} />
                <Field label="אימייל" value={site.email} onChange={(v) => updateSite("email", v)} />
                <Field label="כתובת" value={site.address} onChange={(v) => updateSite("address", v)} />
                <Field label="אינסטגרם" value={site.instagram} onChange={(v) => updateSite("instagram", v)} />
                <Field label="פייסבוק" value={site.facebook} onChange={(v) => updateSite("facebook", v)} />
              </EditorCard>
            )}

            {activePanel === "domain" && (
              <EditorCard title="דומיין ציבורי" subtitle="העסק בוחר שם באנגלית לכתובת האתר שלו">
                <Label>שם האתר באנגלית</Label>

                <div className="flex overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-lg shadow-slate-200/60">
                  <input
                    value={site.slug}
                    onChange={(e) =>
                      updateSite("slug", e.target.value.toLowerCase().trim())
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
                  <p className="text-xs font-bold text-white/45">כתובת האתר הציבורי</p>
                  <p className="mt-2 break-all text-lg font-black" dir="ltr">
                    {publicUrl}
                  </p>
                </div>

                <Field
                  label="דומיין אישי, אופציונלי"
                  value={site.customDomain}
                  onChange={(v) => updateSite("customDomain", v)}
                  placeholder="www.yourbusiness.co.il"
                />
              </EditorCard>
            )}

            {activePanel === "seo" && (
              <EditorCard title="SEO" subtitle="כותרת ותיאור למנועי חיפוש">
                <Field label="כותרת SEO" value={site.seoTitle} onChange={(v) => updateSite("seoTitle", v)} />
                <Textarea rows={6} label="תיאור SEO" value={site.seoDescription} onChange={(v) => updateSite("seoDescription", v)} />
              </EditorCard>
            )}
          </div>
        </section>

        <section className="h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.16),transparent_30%),linear-gradient(135deg,#f6f3ff,#ffffff)] p-6">
          <div className="sticky top-0 z-30 mb-5 flex items-center justify-between rounded-[1.7rem] border border-white/80 bg-white/80 px-5 py-4 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">
                תצוגה מקדימה
              </p>
              <p className="mt-1 text-sm font-black text-slate-800" dir="ltr">
                {publicUrl}
              </p>
            </div>

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
          </div>

          <div
            className={[
              "mx-auto transition-all duration-300",
              deviceMode === "mobile" ? "max-w-[390px]" : "max-w-6xl",
            ].join(" ")}
          >
            <LivePreview site={site} />
          </div>
        </section>
      </div>
    </main>
  );
}

function LivePreview({ site }: { site: SiteState }) {
  const radius = site.rounded ? "rounded-[2.25rem]" : "rounded-none";
  const shadow = site.softShadows
    ? "shadow-[0_35px_120px_rgba(15,23,42,0.14)]"
    : "";

  return (
    <div className={`overflow-hidden border border-white bg-white ${radius} ${shadow}`}>
      <header className="flex items-center justify-between border-b border-slate-100 bg-white/90 px-7 py-5 backdrop-blur-xl">
        <nav className="hidden gap-6 text-sm font-black text-slate-600 xl:flex">
          <a>דף הבית</a>
          <a>אודות</a>
          {site.servicesEnabled && <a>שירותים</a>}
          {site.productsEnabled && <a>מוצרים</a>}
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

      <section className="relative grid min-h-[480px] overflow-hidden xl:grid-cols-[1fr_0.9fr]">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 15% 20%, ${site.secondaryColor}, transparent 34%), linear-gradient(135deg, #ffffff 0%, #f8fafc 55%, ${site.secondaryColor} 100%)`,
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-8 py-12 xl:px-14">
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
                {site.mainCtaText}
              </button>
            )}

            <button className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-sm font-black text-slate-800 shadow-lg">
              {site.secondaryCtaText}
            </button>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center p-8">
          <div className="relative">
            <div
              className="absolute -inset-5 rounded-[2.5rem] blur-3xl"
              style={{ backgroundColor: `${site.primaryColor}30` }}
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
      </section>

      <PreviewSection>
        <SectionTitle title={site.aboutTitle} color={site.primaryColor} />
        <p className="mx-auto mt-4 max-w-3xl text-center text-base font-semibold leading-8 text-slate-600">
          {site.aboutText}
        </p>
      </PreviewSection>

      {site.servicesEnabled && (
        <PreviewSection muted>
          <SectionTitle title="השירותים שלנו" color={site.primaryColor} />

          <div className="mt-8 grid gap-4 xl:grid-cols-3">
            {site.services.map((service) => (
              <article
                key={service.id}
                className="group rounded-[1.7rem] border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl"
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
        </PreviewSection>
      )}

      {site.productsEnabled && (
        <PreviewSection>
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
        </PreviewSection>
      )}

      <PreviewSection muted>
        <SectionTitle title="גלריה" color={site.primaryColor} />

        <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {site.gallery.filter(Boolean).map((image, index) => (
            <img
              key={index}
              src={image}
              alt=""
              className="h-44 w-full rounded-[1.5rem] object-cover shadow-xl shadow-slate-200/70"
            />
          ))}
        </div>
      </PreviewSection>

      <PreviewSection>
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
      </PreviewSection>

      {site.customerClubEnabled && (
        <section className="px-8 pb-12">
          <div
            className="rounded-[2rem] p-6 text-white shadow-2xl"
            style={{ backgroundColor: site.primaryColor }}
          >
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <p className="text-2xl font-black">הצטרפות למועדון לקוחות</p>
                <p className="mt-2 text-sm font-semibold text-white/80">
                  קבלו עדכונים, הטבות וקופונים מהעסק.
                </p>
              </div>

              <button className="rounded-2xl bg-white px-6 py-3 text-sm font-black text-slate-950 shadow-xl">
                הצטרפות
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="bg-slate-950 px-8 py-12 text-white">
        <SectionTitle title="יצירת קשר" color={site.primaryColor} light />

        <div className="mt-8 grid gap-4 xl:grid-cols-4">
          <ContactBox label="טלפון" value={site.phone} />
          <ContactBox label="וואטסאפ" value={site.whatsapp} />
          <ContactBox label="אימייל" value={site.email} />
          <ContactBox label="כתובת" value={site.address} />
        </div>
      </section>
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
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
        onChange={(e) => onChange(e.target.value)}
        className={textareaClass}
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

function PreviewSection({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <section className={["px-8 py-12", muted ? "bg-slate-50" : "bg-white"].join(" ")}>
      {children}
    </section>
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