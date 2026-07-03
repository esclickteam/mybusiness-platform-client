import React, { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronDown,
  Cloud,
  DatabaseZap,
  Globe2,
  LineChart,
  Mail,
  Menu,
  Quote,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";

import { aelineImages } from "./aelineData";
import { aelineEditorCss } from "./editorCss";

export type AelinePageId =
  | "home"
  | "services"
  | "about"
  | "pricing"
  | "blog"
  | "contact";

export const aelinePages: Array<{
  id: AelinePageId;
  name: string;
  slug: string;
}> = [
  { id: "home", name: "בית", slug: "/" },
  { id: "services", name: "שירותים", slug: "/services" },
  { id: "about", name: "אודות", slug: "/about" },
  { id: "pricing", name: "מחירים", slug: "/pricing" },
  { id: "blog", name: "בלוג", slug: "/blog" },
  { id: "contact", name: "יצירת קשר", slug: "/contact" },
];

type AelinePagesProps = {
  initialPage?: AelinePageId;
  isStudioStatic?: boolean;
};

const navItems: Array<{ id: AelinePageId; label: string }> = [
  { id: "home", label: "בית" },
  { id: "services", label: "שירותים" },
  { id: "about", label: "אודות" },
  { id: "pricing", label: "מחירים" },
];

const services = [
  {
    number: "01",
    title: "אסטרטגיית AI",
    text: "בניית תוכנית עבודה חכמה להטמעת בינה מלאכותית בעסק, עם סדרי עדיפויות, תהליכים והשפעה עסקית אמיתית.",
  },
  {
    number: "02",
    title: "מערכות אוטומציה",
    text: "החלפת פעולות ידניות וחוזרות במערכות חכמות שמחברות בין לקוחות, נתונים, משימות ותהליכים.",
  },
  {
    number: "03",
    title: "דאטה ותובנות",
    text: "הפיכת מידע גולמי לדשבורדים, החלטות מדויקות וצמיחה מדידה לאורך זמן.",
  },
];

const plans = [
  {
    name: "מסלול התחלה",
    price: "₪8,900",
    text: "מתאים לעסקים שרוצים להתחיל להכניס AI ואוטומציות בצורה מסודרת.",
    items: [
      "פגישת אסטרטגיה",
      "מיפוי תהליכים עסקיים",
      "תוכנית אוטומציה בסיסית",
      "ליווי במייל",
    ],
  },
  {
    name: "מסלול צמיחה",
    price: "₪29,900",
    text: "מתאים לעסקים שרוצים להטמיע מערכות חכמות ולחבר דאטה, מכירות ושירות.",
    items: [
      "יועץ מלווה קבוע",
      "הקמת אוטומציות מקצה לקצה",
      "דשבורדים ותובנות עסקיות",
      "דוחות חכמים מבוססי AI",
    ],
  },
  {
    name: "מסלול ארגוני",
    price: "מותאם אישית",
    text: "מתאים לארגונים וצוותים גדולים עם תהליכים מורכבים ומערכות קיימות.",
    items: [
      "מפת דרכים מלאה להטמעת AI",
      "ארכיטקטורת אוטומציה מותאמת",
      "ניתוח דאטה מתקדם",
      "תמיכה וליווי פרימיום",
    ],
  },
];

const expertiseCards = [
  {
    title: "אוטומציה ואופטימיזציה",
    text: "ייעול תהליכים עסקיים באמצעות אוטומציות חכמות שחוסכות זמן, מצמצמות טעויות ומשפרות ביצועים.",
    kind: "expense",
  },
  {
    title: "אנליטיקה ותובנות עסקיות",
    text: "הפיכת דאטה גולמי לתובנות אסטרטגיות, דשבורדים, תחזיות והחלטות עסקיות מדויקות.",
    kind: "chart",
  },
  {
    title: "טרנספורמציה דיגיטלית",
    text: "ליווי עסקים בתהליך מעבר למערכות חכמות, תהליכים מודרניים וקבלת החלטות מבוססת מידע.",
    kind: "performance",
  },
  {
    title: "חוויית לקוח חכמה",
    text: "חיבור בין אנשים, דאטה וחוויות דיגיטליות כדי ליצור מערכת עסקית חכמה, יעילה ומותאמת אישית.",
    kind: "radar",
  },
];

const posts = [
  {
    title: "איך להפוך דאטה לאסטרטגיה עסקית",
    text: "כך עסקים יכולים לקחת מידע קיים ולהפוך אותו להחלטות שמייצרות צמיחה אמיתית.",
  },
  {
    title: "5 דרכים שבהן AI מייעל פעילות עסקית",
    text: "רעיונות פשוטים לאוטומציות שמשפרות מהירות, דיוק וחוויית לקוח.",
  },
  {
    title: "אנשים ומכונות: האיזון הנכון",
    text: "למה אסטרטגיית AI חזקה מתחילה באנשים, ורק אחר כך בכלים ובטכנולוגיה.",
  },
];

function AelineButton({
  children,
  onClick,
  variant = "lime",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "lime" | "blue" | "dark" | "light";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-editable-link="true"
      className={[
        "group inline-flex h-14 items-center justify-center gap-3 rounded-full px-7 text-sm font-black tracking-[0.08em] shadow-sm transition duration-300 active:scale-[0.98]",
        variant === "lime"
          ? "bg-[#d8ff4f] text-black hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(216,255,79,0.42)]"
          : variant === "blue"
            ? "bg-[#176fae] text-white hover:-translate-y-1 hover:bg-[#0d5f9d]"
            : variant === "dark"
              ? "bg-black text-white hover:-translate-y-1 hover:bg-[#111]"
              : "border border-black/10 bg-white text-black hover:-translate-y-1 hover:border-black/30",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Header({
  activePage,
  onPageChange,
}: {
  activePage: AelinePageId;
  onPageChange: (page: AelinePageId) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      data-section-kind="header"
      data-section-title="Header"
      className="absolute left-0 right-0 top-0 z-50 px-5 py-4 text-white"
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-5">
        <button
          type="button"
          onClick={() => onPageChange("home")}
          className="flex items-center gap-3"
        >
          <span
            data-gjs-type="text"
            className="text-2xl font-black tracking-[-0.04em]"
          >
            איילין
          </span>
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onPageChange(item.id)}
              className={[
                "inline-flex items-center gap-2 text-sm font-black tracking-[0.08em] transition hover:text-[#d8ff4f]",
                activePage === item.id ? "text-[#d8ff4f]" : "text-white",
              ].join(" ")}
            >
              {item.label}
              {item.id === "pricing" && <ChevronDown className="h-4 w-4" />}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-4 grid max-w-[1280px] gap-2 rounded-[26px] bg-white p-3 text-black shadow-2xl lg:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onPageChange(item.id);
                setMobileOpen(false);
              }}
              className="rounded-2xl px-4 py-3 text-right text-sm font-black hover:bg-black/5"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function FloatingHeroCard({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "aeline-float-card absolute rounded-[18px] border border-white/55 bg-white/92 p-4 text-black shadow-[0_22px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function HeroCardRail() {
  const cards = [
    {
      title: "אימון דאטה",
      value: "העלאת תוכן",
      small: "למערכת AI",
      type: "blue",
    },
    {
      title: "נקודות דאטה",
      value: "520k+",
      small: "צמיחה חכמה",
      type: "white",
    },
    {
      title: "ביצועים",
      value: "49%",
      small: "צמיחה עסקית",
      type: "dark",
    },
    {
      title: "הכנסות",
      value: "₪9,800",
      small: "₪4,400",
      type: "image",
    },
    {
      title: "תובנות בכל",
      value: "החלטה",
      small: "מערכות AI",
      type: "chart",
    },
    {
      title: "הוצאה חודשית",
      value: "₪18,000",
      small: "/ ₪36,000",
      type: "expense",
    },
    {
      title: "מומחיות",
      value: "AI + אסטרטגיה",
      small: "בינה עסקית",
      type: "dark",
    },
    {
      title: "הודעות",
      value: "זרימת AI",
      small: "יומן + CRM",
      type: "glass",
    },
  ];

  return (
    <div className="aeline-hero-carousel relative mx-auto h-[270px] w-full max-w-[980px]">
      <div className="absolute left-1/2 top-1/2 h-28 w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 blur-3xl" />

      <div className="aeline-hero-ring absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2">
        {cards.map((card, index) => {
          const angle = `${(360 / cards.length) * index}deg`;

          return (
            <article
              key={`${card.title}-${index}`}
              className={[
                "aeline-hero-ring-card group absolute left-1/2 top-1/2 h-[138px] w-[168px]",
                "overflow-hidden rounded-[18px] border border-white/70 p-4 text-right",
                "shadow-[0_28px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl",
                "transition duration-500 hover:scale-110",
                card.type === "dark"
                  ? "bg-black text-white"
                  : card.type === "blue"
                    ? "bg-sky-300 text-white"
                    : card.type === "glass"
                      ? "bg-white/45 text-white"
                      : "bg-white text-black",
              ].join(" ")}
              style={
                {
                  "--aeline-angle": angle,
                  "--aeline-z": "430px",
                } as React.CSSProperties
              }
            >
              {card.type === "image" ? (
                <>
                  <img
                    data-gjs-type="image"
                    src={aelineImages.team}
                    alt="הכנסות לקוח"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white/92 p-2 text-black shadow-lg">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <p className="text-[9px] font-black text-black/35">
                          הוצאה
                        </p>
                        <p className="text-sm font-black">₪4,400</p>
                      </div>

                      <div>
                        <p className="text-[9px] font-black text-black/35">
                          הכנסה
                        </p>
                        <p className="text-sm font-black">₪9,800</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[10px] font-black leading-4 tracking-[0.06em] opacity-55">
                    {card.title}
                  </p>

                  <p className="mt-3 text-2xl font-black leading-7 tracking-[-0.05em]">
                    {card.value}
                  </p>

                  <p className="mt-1 text-[10px] font-bold opacity-45">
                    {card.small}
                  </p>

                  {card.type === "chart" && (
                    <div className="mt-5 flex h-12 items-end justify-end gap-1">
                      {[16, 24, 34, 44, 58, 76].map((height, itemIndex) => (
                        <span
                          key={height}
                          className={[
                            "w-4 rounded-t",
                            itemIndex === 5 ? "bg-sky-400" : "bg-black/5",
                          ].join(" ")}
                          style={{ height }}
                        />
                      ))}
                    </div>
                  )}

                  {card.type === "expense" && (
                    <div className="mt-4">
                      <div className="h-2 rounded-full bg-black/5">
                        <div className="h-2 w-2/3 rounded-full bg-sky-400" />
                      </div>

                      <div className="mt-3 grid gap-1">
                        {["מערכת פרימיום", "אוטומציה", "דאטה"].map(
                          (item, itemIndex) => (
                            <div
                              key={`${item}-${itemIndex}`}
                              className="flex items-center justify-between rounded-md bg-black/5 px-2 py-1 text-[8px] font-bold"
                            >
                              <span>{item}</span>
                              <span>₪450</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {card.type === "glass" && (
                    <div className="mt-5 grid gap-2">
                      <div className="mx-auto flex w-24 items-center justify-between rounded-full bg-white/75 px-3 py-1 text-[9px] font-black text-sky-500">
                        יומן
                        <span className="h-2 w-2 rounded-full bg-[#d8ff4f]" />
                      </div>

                      <div className="mx-auto flex w-28 items-center justify-between rounded-full bg-white/75 px-3 py-1 text-[9px] font-black text-sky-500">
                        הודעות
                        <span className="h-2 w-2 rounded-full bg-[#d8ff4f]" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function HeroSection({
  onPageChange,
}: {
  onPageChange: (page: AelinePageId) => void;
}) {
  return (
    <section
      data-section-kind="hero"
      data-section-title="Hero"
      className="relative min-h-[950px] overflow-hidden bg-[linear-gradient(180deg,#0878b7_0%,#1598df_55%,#39aef2_100%)] px-6 pb-20 pt-36 text-white"
    >
      <div className="absolute inset-0 opacity-35 [background:radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.55),transparent_26%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.35),transparent_26%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.35),transparent_24%)]" />

      <div className="aeline-cloud aeline-cloud-one absolute bottom-16 left-[-120px] h-40 w-[520px] rounded-full bg-white/70 blur-2xl" />
      <div className="aeline-cloud aeline-cloud-two absolute bottom-8 right-[-100px] h-36 w-[460px] rounded-full bg-white/65 blur-2xl" />
      <div className="aeline-cloud aeline-cloud-three absolute bottom-28 left-[20%] h-28 w-[360px] rounded-full bg-white/35 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-[1280px] text-center">
        <h1
          data-gjs-type="text"
          className="mx-auto max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.08em] text-white md:text-7xl"
        >
          בונים את העתיד עם
          <span className="block text-white/65">AI ואסטרטגיה</span>
        </h1>

        <p
          data-gjs-type="text"
          className="mx-auto mt-7 max-w-2xl text-base font-semibold leading-8 text-white"
        >
          אנחנו עוזרים לעסקים לצמוח, להתייעל ולקבל החלטות חכמות יותר באמצעות
          ייעוץ מבוסס דאטה ואוטומציות חכמות.
        </p>

        <div className="relative z-30 mt-9 flex flex-wrap justify-center gap-3">
          <AelineButton onClick={() => onPageChange("contact")}>
            התחילו עכשיו
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
              <ArrowRight className="h-4 w-4" />
            </span>
          </AelineButton>

          <AelineButton variant="blue" onClick={() => onPageChange("services")}>
            צפייה בדמו
          </AelineButton>
        </div>

        <div className="relative z-10 mt-28 md:mt-32 lg:mt-40">
          <HeroCardRail />
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold text-white">
            דירוג 4.9/5 על ידי יותר מ־4,900 לקוחות
          </p>

          <div className="mt-3 flex justify-center gap-1 text-[#d8ff4f]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section
      data-section-kind="about"
      data-section-title="About"
      className="relative bg-white px-6 py-24 text-black"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="text-center">
          <p className="text-xs font-black tracking-[0.18em] text-black">
            · אודות
          </p>

          <h2
            data-gjs-type="text"
            className="mx-auto mt-7 max-w-4xl text-4xl font-medium leading-[1.08] tracking-[-0.06em] md:text-6xl"
          >
            שותף ייעוץ גלובלי
            <br />
            שמוביל עסקים לבנות
            <span className="mx-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-sky-400 align-middle text-white">
              <BarChart3 className="h-7 w-7" />
            </span>
            מערכות חכמות
            <br />
            <span className="text-black/45">
              ודרך עבודה
              <span className="mx-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#d8ff4f] align-middle text-black">
                <Sparkles className="h-7 w-7" />
              </span>
              יעילה יותר
            </span>
          </h2>
        </div>

        <div className="mt-20 grid gap-5 lg:grid-cols-[1fr_1fr_1fr]">
          <article className="group overflow-hidden rounded-[24px] bg-sky-400 p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-black tracking-[-0.05em]">
                שיתופי פעולה
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
                <LineChart className="h-5 w-5" />
              </span>
            </div>

            <div className="mt-16 rounded-[18px] bg-white p-5 text-black">
              <p className="text-7xl font-light tracking-[-0.08em]">120+</p>
              <p className="mt-5 text-base leading-6">
                שיתופי פעולה עם ספקי טכנולוגיה, AI, ענן ומערכות עסקיות.
              </p>
            </div>
          </article>

          <article className="rounded-[24px] bg-[#f1f1f1] p-6 transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
            <p className="text-sm font-medium">מחויבות לתוצאות מדידות</p>
            <p className="mt-5 text-5xl font-light tracking-[-0.06em]">100%</p>

            <div className="mt-16 flex -space-x-3">
              {["#111", "#d8ff4f", "#ff6259", "#8ed6ff"].map((color) => (
                <span
                  key={color}
                  className="h-9 w-9 rounded-full border-2 border-white"
                  style={{ background: color }}
                />
              ))}
            </div>

            <p
              data-gjs-type="text"
              className="mt-5 text-base font-medium leading-6"
            >
              “אסטרטגיית האוטומציה שלהם שינתה לגמרי את הדרך שבה אנחנו עובדים.
              הכול יעיל, חכם ומחובר.”
            </p>
          </article>

          <div className="grid gap-5">
            <article className="rounded-[24px] bg-[#d8ff4f] p-6 transition duration-300 hover:-translate-y-2">
              <p className="text-sm font-medium">נקודות דאטה</p>
              <p className="mt-5 text-5xl font-light tracking-[-0.06em]">
                520k+
              </p>
              <p
                data-gjs-type="text"
                className="mt-9 max-w-sm text-base font-medium leading-6"
              >
                נתונים מנותחים מדי חודש כדי להוביל החלטות עסקיות חכמות יותר.
              </p>
            </article>

            <article className="flex items-center justify-between rounded-[24px] bg-black p-6 text-white transition duration-300 hover:-translate-y-2">
              <p className="text-base font-medium">מדינות פעילות</p>
              <p className="text-5xl font-light tracking-[-0.06em]">20+</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({
  onPageChange,
}: {
  onPageChange: (page: AelinePageId) => void;
}) {
  return (
    <section
      data-section-kind="services"
      data-section-title="Services"
      className="bg-[#f4f1e9] px-6 py-28 text-black"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black tracking-[0.35em] text-black/35">
              שירותים
            </p>

            <h2
              data-gjs-type="text"
              className="mt-8 max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.08em] md:text-8xl"
            >
              ייעוץ, אוטומציה
              <br />
              וחדשנות חכמה
            </h2>
          </div>

          <AelineButton variant="dark" onClick={() => onPageChange("contact")}>
            התחלת פרויקט
            <ArrowRight className="h-4 w-4" />
          </AelineButton>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              data-section-kind="service-card"
              data-section-title={service.title}
              className="group min-h-[360px] rounded-[34px] border border-black/5 bg-white p-9 shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-4 hover:bg-black hover:text-white hover:shadow-[0_30px_90px_rgba(0,0,0,0.18)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-black/30 group-hover:text-white/30">
                  {service.number}
                </span>

                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3dff88] text-black transition duration-300 group-hover:rotate-12 group-hover:scale-110">
                  <Zap className="h-6 w-6" />
                </span>
              </div>

              <h3
                data-gjs-type="text"
                className="mt-28 text-4xl font-black tracking-[-0.06em]"
              >
                {service.title}
              </h3>

              <p
                data-gjs-type="text"
                className="mt-7 text-lg leading-8 text-black/55 group-hover:text-white/60"
              >
                {service.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisualMockup({ kind }: { kind: string }) {
  if (kind === "expense") {
    return (
      <div className="relative h-64">
        <FloatingHeroCard className="left-12 top-4 w-52 rotate-[-8deg]">
          <p className="text-xs font-bold">הוצאה חודשית</p>
          <p className="mt-2 text-2xl font-semibold">
            ₪18,000 <span className="text-black/25">/ ₪36,000</span>
          </p>
          <div className="mt-4 h-2 rounded-full bg-black/5">
            <div className="h-2 w-2/3 rounded-full bg-sky-400" />
          </div>
        </FloatingHeroCard>
      </div>
    );
  }

  if (kind === "chart") {
    return (
      <div className="relative h-64">
        <FloatingHeroCard className="left-16 top-4 w-56 rotate-[7deg]">
          <p className="text-xl font-medium leading-6">
            תובנות בכל החלטה
          </p>

          <div className="mt-8 flex h-28 items-end gap-3">
            {[25, 35, 48, 63, 82, 110].map((height, index) => (
              <span
                key={height}
                className={[
                  "w-7 rounded-t-lg",
                  index === 5 ? "bg-sky-400" : "bg-black/5",
                ].join(" ")}
                style={{ height }}
              />
            ))}
          </div>
        </FloatingHeroCard>
      </div>
    );
  }

  if (kind === "performance") {
    return (
      <div className="relative h-64">
        <FloatingHeroCard className="left-16 top-10 w-56 rotate-[-3deg]">
          <div className="rounded-2xl bg-black p-4 text-white">
            <p className="text-sm font-bold">ביצועים</p>
            <p className="text-[10px] text-white/45">בשבעת הימים האחרונים</p>
          </div>

          <p className="mt-5 text-4xl font-light tracking-[-0.08em]">
            49%{" "}
            <span className="rounded-full bg-[#d8ff4f] px-2 text-sm">
              +2.5%
            </span>
          </p>
        </FloatingHeroCard>
      </div>
    );
  }

  return (
    <div className="relative flex h-64 items-center justify-center">
      <div className="absolute h-56 w-56 rounded-full border border-black/10" />
      <div className="absolute h-40 w-40 rounded-full border border-black/10" />
      <div className="absolute h-24 w-24 rounded-full border border-black/10" />

      <div className="z-10 flex h-16 w-16 rotate-45 items-center justify-center rounded-2xl bg-black text-white shadow-xl">
        <Sparkles className="-rotate-45" />
      </div>
    </div>
  );
}

function ExpertiseSection() {
  return (
    <section
      data-section-kind="expertise"
      data-section-title="Expertise"
      className="bg-white px-3 py-24 text-black"
    >
      <div className="mx-auto max-w-[1420px]">
        <div className="mb-16 px-3 text-center">
          <p className="text-xs font-black tracking-[0.22em] text-black/40">
            מומחיות
          </p>

          <h2
            data-gjs-type="text"
            className="mx-auto mt-6 max-w-4xl text-5xl font-medium leading-[1] tracking-[-0.07em] md:text-7xl"
          >
            כשחשיבה אנושית פוגשת
            <span className="text-black/40"> טכנולוגיה חכמה</span>
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {expertiseCards.map((card) => (
            <article
              key={card.title}
              className="group overflow-hidden rounded-[14px] bg-[#f8f8f8] p-10 transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]"
            >
              <VisualMockup kind={card.kind} />

              <h3
                data-gjs-type="text"
                className="mt-6 text-center text-3xl font-medium tracking-[-0.05em]"
              >
                {card.title}
              </h3>

              <p
                data-gjs-type="text"
                className="mx-auto mt-4 max-w-xl text-center text-base leading-7 text-black/60"
              >
                {card.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({
  onPageChange,
}: {
  onPageChange: (page: AelinePageId) => void;
}) {
  return (
    <section
      data-section-kind="pricing"
      data-section-title="Pricing"
      className="bg-[#f4f1e9] px-6 py-28 text-black"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-14 text-center">
          <p className="text-xs font-black tracking-[0.22em] text-black/40">
            מחירים
          </p>

          <h2
            data-gjs-type="text"
            className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.08em] md:text-7xl"
          >
            מסלולים גמישים לכל שלב בצמיחה
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <article
              key={plan.name}
              className={[
                "rounded-[34px] border p-8 transition duration-300 hover:-translate-y-3",
                index === 1
                  ? "border-black bg-black text-white shadow-[0_30px_90px_rgba(0,0,0,0.18)]"
                  : "border-black/10 bg-white text-black shadow-[0_20px_60px_rgba(0,0,0,0.05)]",
              ].join(" ")}
            >
              <p className="text-sm font-black tracking-[0.12em] opacity-45">
                {plan.name}
              </p>

              <h3
                data-gjs-type="text"
                className="mt-8 text-5xl font-black tracking-[-0.07em]"
              >
                {plan.price}
              </h3>

              <p
                data-gjs-type="text"
                className="mt-3 text-sm leading-7 opacity-55"
              >
                {plan.text}
              </p>

              <div className="mt-8 grid gap-3">
                {plan.items.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-bold">
                    <CheckCircle2 className="h-5 w-5 text-[#3dff88]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onPageChange("contact")}
                data-editable-link="true"
                className={[
                  "mt-9 h-12 w-full rounded-full text-sm font-black transition hover:-translate-y-1",
                  index === 1
                    ? "bg-[#3dff88] text-black"
                    : "bg-black text-white",
                ].join(" ")}
              >
                התחילו עכשיו
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section
      data-section-kind="testimonials"
      data-section-title="Testimonials"
      className="bg-white px-6 py-24"
    >
      <div className="mx-auto max-w-[1280px] rounded-[36px] bg-black p-8 text-white lg:p-14">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <Quote className="h-12 w-12 text-[#d8ff4f]" />

            <h2
              data-gjs-type="text"
              className="mt-6 text-5xl font-black tracking-[-0.07em]"
            >
              מה לקוחות אומרים
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              "אסטרטגיית האוטומציה שינתה לגמרי את הדרך שבה אנחנו עובדים.",
              "התהליך היה ברור, מודרני ומאוד פרקטי.",
              "סוף סוף אנחנו מבינים את הדאטה שלנו ויודעים איך להשתמש בו.",
              "חוויית ייעוץ פרימיום מהשלב הראשון ועד ההטמעה.",
            ].map((text, index) => (
              <article
                key={index}
                className="rounded-[26px] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-2"
              >
                <p data-gjs-type="text" className="text-sm leading-7 text-white/70">
                  “{text}”
                </p>

                <p className="mt-5 text-sm font-black text-white">
                  לקוח #{index + 1}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogSection({
  onPageChange,
}: {
  onPageChange: (page: AelinePageId) => void;
}) {
  return (
    <section
      data-section-kind="blog"
      data-section-title="Blog"
      className="bg-[#f4f1e9] px-6 py-28 text-black"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black tracking-[0.22em] text-black/40">
              בלוג
            </p>

            <h2
              data-gjs-type="text"
              className="mt-5 text-5xl font-black tracking-[-0.07em]"
            >
              תובנות ומגמות אחרונות
            </h2>
          </div>

          <AelineButton variant="light" onClick={() => onPageChange("blog")}>
            צפייה בכל המאמרים
          </AelineButton>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={post.title}
              className="group overflow-hidden rounded-[30px] bg-white transition duration-300 hover:-translate-y-3 hover:shadow-[0_28px_80px_rgba(0,0,0,0.12)]"
            >
              <img
                data-gjs-type="image"
                src={[aelineImages.abstract, aelineImages.meeting, aelineImages.team][index]}
                alt={post.title}
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="p-6">
                <p className="text-xs font-black tracking-[0.12em] text-black/35">
                  תובנה
                </p>

                <h3
                  data-gjs-type="text"
                  className="mt-4 text-2xl font-black tracking-[-0.05em]"
                >
                  {post.title}
                </h3>

                <p
                  data-gjs-type="text"
                  className="mt-3 text-sm leading-7 text-black/55"
                >
                  {post.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({
  onPageChange,
}: {
  onPageChange: (page: AelinePageId) => void;
}) {
  return (
    <section
      data-section-kind="cta"
      data-section-title="CTA"
      className="bg-white px-6 py-28"
    >
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[40px] bg-[#1288cf] p-10 text-center text-white shadow-[0_28px_90px_rgba(18,136,207,0.25)] lg:p-16">
        <Cloud className="mx-auto h-16 w-16 text-white/70" />

        <h2
          data-gjs-type="text"
          className="mx-auto mt-8 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.08em] md:text-7xl"
        >
          בנו מערכת חכמה יותר לעסק שלכם
        </h2>

        <p
          data-gjs-type="text"
          className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-8 text-white/80"
        >
          השתמשו באזור הזה כדי לאסוף לידים, לקבוע שיחות ייעוץ או להוביל את
          המבקרים לשלב הבא.
        </p>

        <div className="mt-9 flex justify-center">
          <AelineButton onClick={() => onPageChange("contact")}>
            יצירת קשר
            <ArrowRight className="h-4 w-4" />
          </AelineButton>
        </div>
      </div>
    </section>
  );
}

function Footer({
  onPageChange,
}: {
  onPageChange: (page: AelinePageId) => void;
}) {
  return (
    <footer
      data-section-kind="footer"
      data-section-title="Footer"
      className="bg-black px-6 py-14 text-white"
    >
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="text-2xl font-black tracking-[-0.05em]">איילין</p>

          <p
            data-gjs-type="text"
            className="mt-5 max-w-md text-sm leading-7 text-white/55"
          >
            תבנית פרימיום לעסקי ייעוץ, AI ואוטומציות עם תנועה, עומק וחוויית
            משתמש מודרנית.
          </p>
        </div>

        <div>
          <p className="text-sm font-black tracking-[0.12em] text-white/35">
            עמודים
          </p>

          <div className="mt-4 grid gap-2">
            {aelinePages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => onPageChange(page.id)}
                className="text-right text-sm font-bold text-white/60 transition hover:text-white"
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-black tracking-[0.12em] text-white/35">
            ניוזלטר
          </p>

          <div className="mt-4 flex rounded-full border border-white/10 bg-white/5 p-1">
            <input
              placeholder="כתובת אימייל"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm font-bold text-white outline-none placeholder:text-white/35"
            />

            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d8ff4f] text-black">
              <Mail className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function AelineShell({
  activePage,
  onPageChange,
  children,
}: {
  activePage: AelinePageId;
  onPageChange: (page: AelinePageId) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      data-template-id="aeline"
      dir="rtl"
      className="min-h-screen overflow-hidden bg-white text-black [font-family:Inter,Arial,sans-serif]"
    >
      <style>{aelineEditorCss}</style>

      <Header activePage={activePage} onPageChange={onPageChange} />
      {children}
      <Footer onPageChange={onPageChange} />
    </div>
  );
}

function HomePage({
  onPageChange,
}: {
  onPageChange: (page: AelinePageId) => void;
}) {
  return (
    <main>
      <HeroSection onPageChange={onPageChange} />
      <AboutSection />
      <ServicesSection onPageChange={onPageChange} />
      <ExpertiseSection />
      <PricingSection onPageChange={onPageChange} />
      <TestimonialsSection />
      <BlogSection onPageChange={onPageChange} />
      <CtaSection onPageChange={onPageChange} />
    </main>
  );
}

function SimplePage({
  title,
  label,
  icon,
  children,
}: {
  title: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="bg-white px-6 pb-24 pt-40 text-black">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black tracking-[0.08em] text-black/55">
          {icon}
          {label}
        </div>

        <h1
          data-gjs-type="text"
          className="max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.08em] md:text-8xl"
        >
          {title}
        </h1>

        <div className="mt-12">{children}</div>
      </div>
    </main>
  );
}

export default function AelinePages({
  initialPage = "home",
}: AelinePagesProps) {
  const [activePage, setActivePage] = useState<AelinePageId>(initialPage);
  const siteRootRef = useRef<HTMLDivElement | null>(null);

  const content = useMemo(() => {
    if (activePage === "home") {
      return <HomePage onPageChange={setActivePage} />;
    }

    if (activePage === "services") {
      return (
        <SimplePage
          title="ייעוץ, אוטומציה וחדשנות חכמה לעסקים"
          label="שירותים"
          icon={<Bot className="h-4 w-4" />}
        >
          <ServicesSection onPageChange={setActivePage} />
          <ExpertiseSection />
        </SimplePage>
      );
    }

    if (activePage === "about") {
      return (
        <SimplePage
          title="שותף ייעוץ גלובלי לבניית מערכות עסקיות חכמות"
          label="אודות"
          icon={<Globe2 className="h-4 w-4" />}
        >
          <AboutSection />
        </SimplePage>
      );
    }

    if (activePage === "pricing") {
      return (
        <SimplePage
          title="מסלולים גמישים לכל שלב בצמיחה"
          label="מחירים"
          icon={<BarChart3 className="h-4 w-4" />}
        >
          <PricingSection onPageChange={setActivePage} />
        </SimplePage>
      );
    }

    if (activePage === "blog") {
      return (
        <SimplePage
          title="תובנות ומגמות אחרונות"
          label="בלוג"
          icon={<DatabaseZap className="h-4 w-4" />}
        >
          <BlogSection onPageChange={setActivePage} />
        </SimplePage>
      );
    }

    return (
      <SimplePage
        title="התחילו את הטרנספורמציה החכמה שלכם"
        label="יצירת קשר"
        icon={<Mail className="h-4 w-4" />}
      >
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[34px] bg-black p-8 text-white">
            <h2
              data-gjs-type="text"
              className="text-4xl font-black tracking-[-0.06em]"
            >
              בואו נבנה משהו חכם יותר
            </h2>

            <p
              data-gjs-type="text"
              className="mt-5 text-sm leading-7 text-white/55"
            >
              כאן אפשר להוסיף פרטי יצירת קשר, קישור ליומן פגישות או טופס CRM
              לאיסוף לידים.
            </p>
          </div>

          <form className="grid gap-4 rounded-[34px] bg-[#f4f1e9] p-8">
            <input
              placeholder="שם מלא"
              className="h-12 rounded-2xl border border-black/10 px-4 text-sm font-bold outline-none"
            />

            <input
              placeholder="אימייל"
              className="h-12 rounded-2xl border border-black/10 px-4 text-sm font-bold outline-none"
            />

            <textarea
              placeholder="הודעה"
              className="min-h-36 rounded-2xl border border-black/10 p-4 text-sm font-bold outline-none"
            />

            <button
              type="button"
              className="h-12 rounded-full bg-black text-sm font-black text-white"
            >
              שליחה
            </button>
          </form>
        </div>
      </SimplePage>
    );
  }, [activePage]);

  return (
    <div ref={siteRootRef}>
      <AelineShell activePage={activePage} onPageChange={setActivePage}>
        {content}
      </AelineShell>
    </div>
  );
}