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
  { id: "services", name: "פתרונות", slug: "/services" },
  { id: "about", name: "הסטודיו", slug: "/about" },
  { id: "pricing", name: "חבילות", slug: "/pricing" },
  { id: "blog", name: "מגזין", slug: "/blog" },
  { id: "contact", name: "שיחה ראשונה", slug: "/contact" },
];

type AelinePagesProps = {
  initialPage?: AelinePageId;
  isStudioStatic?: boolean;
};

const TEMPLATE_NAME = "נובה פלואו";

const navItems: Array<{ id: AelinePageId; label: string }> = [
  { id: "home", label: "בית" },
  { id: "services", label: "פתרונות" },
  { id: "about", label: "הסטודיו" },
  { id: "pricing", label: "חבילות" },
];

const services = [
  {
    number: "01",
    title: "מערכת לידים ומכירות",
    text: "בניית מסע לקוח ברור שמחבר בין טפסים, הודעות, פולואפים, אנשי מכירות ודשבורד אחד שמרכז את כל התמונה.",
  },
  {
    number: "02",
    title: "אוטומציות שירות",
    text: "תהליכים חכמים שמטפלים בפניות, תזכורות, עדכונים ופעולות חוזרות כדי שהצוות יתעסק במה שבאמת חשוב.",
  },
  {
    number: "03",
    title: "חוויית לקוח דיגיטלית",
    text: "עיצוב חוויה שמרגישה מהירה, יוקרתית וברורה — מהכניסה הראשונה ועד השארת פרטים או רכישה.",
  },
];

const plans = [
  {
    name: "חבילת Launch",
    price: "₪6,500",
    text: "לעסק שרוצה להרים תשתית דיגיטלית חכמה ולהתחיל לנהל פניות בצורה מסודרת.",
    items: [
      "אפיון מסע לקוח",
      "עמוד נחיתה ממיר",
      "חיבור טופס לידים",
      "אוטומציית הודעת פתיחה",
    ],
  },
  {
    name: "חבילת Scale",
    price: "₪18,900",
    text: "לעסק שרוצה לחבר מכירות, שירות, תזכורות ודוחות למערכת אחת שעובדת ברקע.",
    items: [
      "בניית CRM תפעולי",
      "אוטומציות פולואפ",
      "דשבורד ביצועים",
      "תהליך עבודה לצוות",
    ],
  },
  {
    name: "חבילת Flow",
    price: "מותאם אישית",
    text: "לעסקים עם כמה מחלקות, מספר ערוצי פנייה ותהליכים מורכבים שדורשים מערכת מותאמת.",
    items: [
      "מיפוי תהליכים מלא",
      "חיבור מערכות קיימות",
      "אוטומציות מתקדמות",
      "ליווי והטמעה לצוות",
    ],
  },
];

const expertiseCards = [
  {
    title: "מכירות בלי בלגן",
    text: "כל ליד מקבל טיפול, תיוג, תזכורת ופולואפ בלי לרדוף אחרי הודעות מפוזרות בין וואטסאפ, טפסים ומיילים.",
    kind: "expense",
  },
  {
    title: "דוחות שמספרים סיפור",
    text: "נתונים ברורים על פניות, סגירות, מקורות לידים, זמני תגובה והזדמנויות לשיפור.",
    kind: "chart",
  },
  {
    title: "שירות מהיר יותר",
    text: "פחות פעולות ידניות, פחות טעויות ויותר חוויית לקוח מקצועית מרגע הפנייה ועד סיום הטיפול.",
    kind: "performance",
  },
  {
    title: "מערכת שגדלה איתכם",
    text: "מבנה גמיש שאפשר להרחיב בהמשך לעמודים, תורים, חנות, קמפיינים, צוותים ואוטומציות נוספות.",
    kind: "radar",
  },
];

const posts = [
  {
    title: "איך להפוך לידים לשיחות מכירה אמיתיות",
    text: "הדרך לבנות מסע קצר וברור שמקטין פספוסים ומעלה את אחוזי הסגירה.",
  },
  {
    title: "מה עסק קטן יכול לאוטומט כבר היום",
    text: "רעיונות פשוטים לתהליכים שחוסכים שעות עבודה ומשפרים את חוויית הלקוח.",
  },
  {
    title: "למה דשבורד טוב משנה החלטות",
    text: "כשכל הנתונים מול העיניים, קל יותר להבין מה עובד ומה חייב להשתנות.",
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
          ? "bg-[#7FFFD4] text-[#160f2e] hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(127,255,212,0.42)]"
          : variant === "blue"
            ? "bg-[#FF8A5B] text-white hover:-translate-y-1 hover:bg-[#ff7841]"
            : variant === "dark"
              ? "bg-[#160f2e] text-white hover:-translate-y-1 hover:bg-[#24164a]"
              : "border border-[#160f2e]/10 bg-white text-[#160f2e] hover:-translate-y-1 hover:border-[#160f2e]/30",
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
            {TEMPLATE_NAME}
          </span>
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onPageChange(item.id)}
              className={[
                "inline-flex items-center gap-2 text-sm font-black tracking-[0.08em] transition hover:text-[#7FFFD4]",
                activePage === item.id ? "text-[#7FFFD4]" : "text-white",
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
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#160f2e] lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-4 grid max-w-[1280px] gap-2 rounded-[26px] bg-white p-3 text-[#160f2e] shadow-2xl lg:hidden">
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
        "aeline-float-card absolute rounded-[18px] border border-white/55 bg-white/92 p-4 text-[#160f2e] shadow-[0_22px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl",
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
      title: "ליד חדש",
      value: "נכנס עכשיו",
      small: "מקמפיין ממומן",
      type: "blue",
    },
    {
      title: "פניות החודש",
      value: "1,284",
      small: "עלייה של 31%",
      type: "white",
    },
    {
      title: "זמן תגובה",
      value: "2.4 דק׳",
      small: "ממוצע לצוות",
      type: "dark",
    },
    {
      title: "עסקאות",
      value: "₪74k",
      small: "₪31k",
      type: "image",
    },
    {
      title: "מגמת מכירות",
      value: "בעלייה",
      small: "דוח שבועי",
      type: "chart",
    },
    {
      title: "תקציב קמפיין",
      value: "₪12,600",
      small: "/ ₪20,000",
      type: "expense",
    },
    {
      title: "פייפליין",
      value: "38 עסקאות",
      small: "בשלבי טיפול",
      type: "dark",
    },
    {
      title: "אוטומציה",
      value: "Flow פעיל",
      small: "CRM + הודעות",
      type: "glass",
    },
  ];

  return (
    <div className="aeline-hero-carousel relative mx-auto h-[270px] w-full max-w-[980px]">
      <div className="absolute left-1/2 top-1/2 h-28 w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7FFFD4]/25 blur-3xl" />

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
                  ? "bg-[#160f2e] text-white"
                  : card.type === "blue"
                    ? "bg-[#7FFFD4] text-[#160f2e]"
                    : card.type === "glass"
                      ? "bg-white/45 text-white"
                      : "bg-white text-[#160f2e]",
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
                    src={aelineImages.meeting}
                    alt="עסקאות פעילות"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white/92 p-2 text-[#160f2e] shadow-lg">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <p className="text-[9px] font-black text-[#160f2e]/35">
                          נסגר
                        </p>
                        <p className="text-sm font-black">₪31k</p>
                      </div>

                      <div>
                        <p className="text-[9px] font-black text-[#160f2e]/35">
                          פתוח
                        </p>
                        <p className="text-sm font-black">₪74k</p>
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
                      {[20, 28, 36, 52, 66, 82].map((height, itemIndex) => (
                        <span
                          key={height}
                          className={[
                            "w-4 rounded-t",
                            itemIndex === 5 ? "bg-[#FF8A5B]" : "bg-[#160f2e]/10",
                          ].join(" ")}
                          style={{ height }}
                        />
                      ))}
                    </div>
                  )}

                  {card.type === "expense" && (
                    <div className="mt-4">
                      <div className="h-2 rounded-full bg-[#160f2e]/10">
                        <div className="h-2 w-2/3 rounded-full bg-[#FF8A5B]" />
                      </div>

                      <div className="mt-3 grid gap-1">
                        {["מודעות", "לידים", "רימרקטינג"].map(
                          (item, itemIndex) => (
                            <div
                              key={`${item}-${itemIndex}`}
                              className="flex items-center justify-between rounded-md bg-[#160f2e]/5 px-2 py-1 text-[8px] font-bold"
                            >
                              <span>{item}</span>
                              <span>₪720</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {card.type === "glass" && (
                    <div className="mt-5 grid gap-2">
                      <div className="mx-auto flex w-24 items-center justify-between rounded-full bg-white/75 px-3 py-1 text-[9px] font-black text-[#160f2e]">
                        CRM
                        <span className="h-2 w-2 rounded-full bg-[#7FFFD4]" />
                      </div>

                      <div className="mx-auto flex w-28 items-center justify-between rounded-full bg-white/75 px-3 py-1 text-[9px] font-black text-[#160f2e]">
                        הודעות
                        <span className="h-2 w-2 rounded-full bg-[#FF8A5B]" />
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
      className="relative min-h-[950px] overflow-hidden bg-[linear-gradient(180deg,#160f2e_0%,#3c1d6e_45%,#ff8a5b_115%)] px-6 pb-20 pt-36 text-white"
    >
      <div className="absolute inset-0 opacity-45 [background:radial-gradient(circle_at_22%_18%,rgba(127,255,212,0.55),transparent_24%),radial-gradient(circle_at_78%_20%,rgba(255,138,91,0.48),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.18),transparent_30%)]" />

      <div className="aeline-cloud aeline-cloud-one absolute bottom-16 left-[-120px] h-40 w-[520px] rounded-full bg-[#7FFFD4]/35 blur-2xl" />
      <div className="aeline-cloud aeline-cloud-two absolute bottom-8 right-[-100px] h-36 w-[460px] rounded-full bg-[#FF8A5B]/35 blur-2xl" />
      <div className="aeline-cloud aeline-cloud-three absolute bottom-28 left-[20%] h-28 w-[360px] rounded-full bg-white/25 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-[1280px] text-center">
        <h1
          data-gjs-type="text"
          className="mx-auto max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.08em] text-white md:text-7xl"
        >
          הופכים פניות
          <span className="block text-[#7FFFD4]">ללקוחות משלמים</span>
        </h1>

        <p
          data-gjs-type="text"
          className="mx-auto mt-7 max-w-2xl text-base font-semibold leading-8 text-white/86"
        >
          סטודיו דיגיטלי שמחבר בין עיצוב, אוטומציות, CRM ותהליכי מכירה כדי
          לעזור לעסקים לעבוד מהר יותר, מסודר יותר ורווחי יותר.
        </p>

        <div className="relative z-30 mt-9 flex flex-wrap justify-center gap-3">
          <AelineButton onClick={() => onPageChange("contact")}>
            קבעו שיחת התאמה
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#160f2e] text-white">
              <ArrowRight className="h-4 w-4" />
            </span>
          </AelineButton>

          <AelineButton variant="blue" onClick={() => onPageChange("services")}>
            לראות פתרונות
          </AelineButton>
        </div>

        <div className="relative z-10 mt-28 md:mt-32 lg:mt-40">
          <HeroCardRail />
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold text-white">
            יותר מ־1,200 תהליכים דיגיטליים נבנו לעסקים בצמיחה
          </p>

          <div className="mt-3 flex justify-center gap-1 text-[#7FFFD4]">
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
      className="relative bg-[#fff8f2] px-6 py-24 text-[#160f2e]"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="text-center">
          <p className="text-xs font-black tracking-[0.18em] text-[#3c1d6e]">
            · הסטודיו
          </p>

          <h2
            data-gjs-type="text"
            className="mx-auto mt-7 max-w-4xl text-4xl font-medium leading-[1.08] tracking-[-0.06em] md:text-6xl"
          >
            אנחנו לא בונים רק אתר
            <br />
            אנחנו בונים
            <span className="mx-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#7FFFD4] align-middle text-[#160f2e]">
              <BarChart3 className="h-7 w-7" />
            </span>
            מערכת שמוכרת
            <br />
            <span className="text-[#160f2e]/45">
              ומייצרת
              <span className="mx-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#FF8A5B] align-middle text-white">
                <Sparkles className="h-7 w-7" />
              </span>
              סדר בעסק
            </span>
          </h2>
        </div>

        <div className="mt-20 grid gap-5 lg:grid-cols-[1fr_1fr_1fr]">
          <article className="group overflow-hidden rounded-[24px] bg-[#3c1d6e] p-5 text-white shadow-[0_24px_70px_rgba(22,15,46,0.18)] transition duration-300 hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-black tracking-[-0.05em]">
                תהליכי מכירה
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#160f2e]">
                <LineChart className="h-5 w-5" />
              </span>
            </div>

            <div className="mt-16 rounded-[18px] bg-white p-5 text-[#160f2e]">
              <p className="text-7xl font-light tracking-[-0.08em]">84%</p>
              <p className="mt-5 text-base leading-6">
                שיפור ממוצע בסדר, מעקב וזמן תגובה אחרי הטמעת תהליך מסודר.
              </p>
            </div>
          </article>

          <article className="rounded-[24px] bg-white p-6 transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(22,15,46,0.08)]">
            <p className="text-sm font-medium">פחות פעולות ידניות</p>
            <p className="mt-5 text-5xl font-light tracking-[-0.06em]">42%</p>

            <div className="mt-16 flex -space-x-3">
              {["#160f2e", "#7FFFD4", "#FF8A5B", "#f9d66b"].map((color) => (
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
              “פתאום כל הפניות, המשימות והמעקבים נמצאים במקום אחד. הצוות פשוט
              יודע מה לעשות.”
            </p>
          </article>

          <div className="grid gap-5">
            <article className="rounded-[24px] bg-[#7FFFD4] p-6 text-[#160f2e] transition duration-300 hover:-translate-y-2">
              <p className="text-sm font-medium">לידים שנוהלו</p>
              <p className="mt-5 text-5xl font-light tracking-[-0.06em]">
                96k+
              </p>
              <p
                data-gjs-type="text"
                className="mt-9 max-w-sm text-base font-medium leading-6"
              >
                פניות עברו דרך תהליכים דיגיטליים שמסדרים טיפול, תזכורות
                ופולואפים.
              </p>
            </article>

            <article className="flex items-center justify-between rounded-[24px] bg-[#160f2e] p-6 text-white transition duration-300 hover:-translate-y-2">
              <p className="text-base font-medium">תחומים שונים</p>
              <p className="text-5xl font-light tracking-[-0.06em]">18+</p>
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
      className="bg-[#f4efff] px-6 py-28 text-[#160f2e]"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black tracking-[0.35em] text-[#160f2e]/35">
              פתרונות
            </p>

            <h2
              data-gjs-type="text"
              className="mt-8 max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.08em] md:text-8xl"
            >
              פחות עומס
              <br />
              יותר מכירות
            </h2>
          </div>

          <AelineButton variant="dark" onClick={() => onPageChange("contact")}>
            התחלת תהליך
            <ArrowRight className="h-4 w-4" />
          </AelineButton>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              data-section-kind="service-card"
              data-section-title={service.title}
              className="group min-h-[360px] rounded-[34px] border border-[#160f2e]/5 bg-white p-9 shadow-[0_20px_60px_rgba(22,15,46,0.04)] transition duration-300 hover:-translate-y-4 hover:bg-[#160f2e] hover:text-white hover:shadow-[0_30px_90px_rgba(22,15,46,0.18)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-[#160f2e]/30 group-hover:text-white/30">
                  {service.number}
                </span>

                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF8A5B] text-white transition duration-300 group-hover:rotate-12 group-hover:scale-110">
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
                className="mt-7 text-lg leading-8 text-[#160f2e]/55 group-hover:text-white/60"
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
          <p className="text-xs font-bold">תקציב קמפיין</p>
          <p className="mt-2 text-2xl font-semibold">
            ₪12,600 <span className="text-[#160f2e]/25">/ ₪20,000</span>
          </p>
          <div className="mt-4 h-2 rounded-full bg-[#160f2e]/5">
            <div className="h-2 w-2/3 rounded-full bg-[#FF8A5B]" />
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
            מגמת לידים חודשית
          </p>

          <div className="mt-8 flex h-28 items-end gap-3">
            {[25, 42, 48, 72, 88, 116].map((height, index) => (
              <span
                key={height}
                className={[
                  "w-7 rounded-t-lg",
                  index === 5 ? "bg-[#FF8A5B]" : "bg-[#160f2e]/5",
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
          <div className="rounded-2xl bg-[#160f2e] p-4 text-white">
            <p className="text-sm font-bold">תגובה מהירה</p>
            <p className="text-[10px] text-white/45">מדד שירות שבועי</p>
          </div>

          <p className="mt-5 text-4xl font-light tracking-[-0.08em]">
            2.4{" "}
            <span className="rounded-full bg-[#7FFFD4] px-2 text-sm text-[#160f2e]">
              דקות
            </span>
          </p>
        </FloatingHeroCard>
      </div>
    );
  }

  return (
    <div className="relative flex h-64 items-center justify-center">
      <div className="absolute h-56 w-56 rounded-full border border-[#160f2e]/10" />
      <div className="absolute h-40 w-40 rounded-full border border-[#160f2e]/10" />
      <div className="absolute h-24 w-24 rounded-full border border-[#160f2e]/10" />

      <div className="z-10 flex h-16 w-16 rotate-45 items-center justify-center rounded-2xl bg-[#160f2e] text-white shadow-xl">
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
      className="bg-white px-3 py-24 text-[#160f2e]"
    >
      <div className="mx-auto max-w-[1420px]">
        <div className="mb-16 px-3 text-center">
          <p className="text-xs font-black tracking-[0.22em] text-[#160f2e]/40">
            יכולות
          </p>

          <h2
            data-gjs-type="text"
            className="mx-auto mt-6 max-w-4xl text-5xl font-medium leading-[1] tracking-[-0.07em] md:text-7xl"
          >
            כשעיצוב טוב פוגש
            <span className="text-[#160f2e]/40"> תהליך עסקי מדויק</span>
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {expertiseCards.map((card) => (
            <article
              key={card.title}
              className="group overflow-hidden rounded-[14px] bg-[#f7f4ff] p-10 transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(22,15,46,0.08)]"
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
                className="mx-auto mt-4 max-w-xl text-center text-base leading-7 text-[#160f2e]/60"
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
      className="bg-[#fff8f2] px-6 py-28 text-[#160f2e]"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-14 text-center">
          <p className="text-xs font-black tracking-[0.22em] text-[#160f2e]/40">
            חבילות
          </p>

          <h2
            data-gjs-type="text"
            className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.08em] md:text-7xl"
          >
            בוחרים את הקצב שמתאים לעסק
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <article
              key={plan.name}
              className={[
                "rounded-[34px] border p-8 transition duration-300 hover:-translate-y-3",
                index === 1
                  ? "border-[#160f2e] bg-[#160f2e] text-white shadow-[0_30px_90px_rgba(22,15,46,0.18)]"
                  : "border-[#160f2e]/10 bg-white text-[#160f2e] shadow-[0_20px_60px_rgba(22,15,46,0.05)]",
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
                    <CheckCircle2 className="h-5 w-5 text-[#7FFFD4]" />
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
                    ? "bg-[#7FFFD4] text-[#160f2e]"
                    : "bg-[#160f2e] text-white",
                ].join(" ")}
              >
                לבדוק התאמה
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
      <div className="mx-auto max-w-[1280px] rounded-[36px] bg-[#160f2e] p-8 text-white lg:p-14">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <Quote className="h-12 w-12 text-[#7FFFD4]" />

            <h2
              data-gjs-type="text"
              className="mt-6 text-5xl font-black tracking-[-0.07em]"
            >
              מה השתנה אצל לקוחות
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              "הפסקנו לאבד פניות. כל ליד מקבל טיפול מסודר וברור.",
              "הצוות יודע בדיוק מה השלב הבא, בלי לרדוף אחרי הודעות.",
              "הדשבורד עזר לנו להבין מאיפה מגיעות המכירות הכי טובות.",
              "המערכת מרגישה כאילו היא נבנתה בדיוק בשביל דרך העבודה שלנו.",
            ].map((text, index) => (
              <article
                key={index}
                className="rounded-[26px] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-2"
              >
                <p data-gjs-type="text" className="text-sm leading-7 text-white/70">
                  “{text}”
                </p>

                <p className="mt-5 text-sm font-black text-white">
                  עסק #{index + 1}
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
      className="bg-[#f4efff] px-6 py-28 text-[#160f2e]"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black tracking-[0.22em] text-[#160f2e]/40">
              מגזין
            </p>

            <h2
              data-gjs-type="text"
              className="mt-5 text-5xl font-black tracking-[-0.07em]"
            >
              רעיונות לעסק שעובד חכם
            </h2>
          </div>

          <AelineButton variant="light" onClick={() => onPageChange("blog")}>
            לכל המאמרים
          </AelineButton>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={post.title}
              className="group overflow-hidden rounded-[30px] bg-white transition duration-300 hover:-translate-y-3 hover:shadow-[0_28px_80px_rgba(22,15,46,0.12)]"
            >
              <img
                data-gjs-type="image"
                src={[aelineImages.abstract, aelineImages.dashboard, aelineImages.meeting][index]}
                alt={post.title}
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="p-6">
                <p className="text-xs font-black tracking-[0.12em] text-[#160f2e]/35">
                  מדריך
                </p>

                <h3
                  data-gjs-type="text"
                  className="mt-4 text-2xl font-black tracking-[-0.05em]"
                >
                  {post.title}
                </h3>

                <p
                  data-gjs-type="text"
                  className="mt-3 text-sm leading-7 text-[#160f2e]/55"
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
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[40px] bg-[#3c1d6e] p-10 text-center text-white shadow-[0_28px_90px_rgba(60,29,110,0.25)] lg:p-16">
        <Cloud className="mx-auto h-16 w-16 text-[#7FFFD4]" />

        <h2
          data-gjs-type="text"
          className="mx-auto mt-8 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.08em] md:text-7xl"
        >
          הגיע הזמן שהעסק יעבוד בשבילכם
        </h2>

        <p
          data-gjs-type="text"
          className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-8 text-white/80"
        >
          השאירו פרטים, קבעו שיחה או חברו את הטופס למערכת הלידים שלכם.
        </p>

        <div className="mt-9 flex justify-center">
          <AelineButton onClick={() => onPageChange("contact")}>
            לקביעת שיחה
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
      className="bg-[#160f2e] px-6 py-14 text-white"
    >
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="text-2xl font-black tracking-[-0.05em]">
            {TEMPLATE_NAME}
          </p>

          <p
            data-gjs-type="text"
            className="mt-5 max-w-md text-sm leading-7 text-white/55"
          >
            תבנית פרימיום לעסקים שרוצים להציג תהליך חכם, חוויית לקוח חזקה
            ומערכת שמובילה לפניות איכותיות.
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
            עדכונים
          </p>

          <div className="mt-4 flex rounded-full border border-white/10 bg-white/5 p-1">
            <input
              placeholder="כתובת אימייל"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm font-bold text-white outline-none placeholder:text-white/35"
            />

            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7FFFD4] text-[#160f2e]">
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
      className="min-h-screen overflow-hidden bg-white text-[#160f2e] [font-family:Inter,Arial,sans-serif]"
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
    <main className="bg-white px-6 pb-24 pt-40 text-[#160f2e]">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#160f2e]/10 bg-white px-4 py-2 text-xs font-black tracking-[0.08em] text-[#160f2e]/55">
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
          title="פתרונות דיגיטליים שמסדרים מכירות ושירות"
          label="פתרונות"
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
          title="סטודיו שמחבר בין עיצוב, תהליך וטכנולוגיה"
          label="הסטודיו"
          icon={<Globe2 className="h-4 w-4" />}
        >
          <AboutSection />
        </SimplePage>
      );
    }

    if (activePage === "pricing") {
      return (
        <SimplePage
          title="חבילות שמתאימות לקצב הצמיחה שלכם"
          label="חבילות"
          icon={<BarChart3 className="h-4 w-4" />}
        >
          <PricingSection onPageChange={setActivePage} />
        </SimplePage>
      );
    }

    if (activePage === "blog") {
      return (
        <SimplePage
          title="רעיונות לעסק שעובד חכם יותר"
          label="מגזין"
          icon={<DatabaseZap className="h-4 w-4" />}
        >
          <BlogSection onPageChange={setActivePage} />
        </SimplePage>
      );
    }

    return (
      <SimplePage
        title="בואו נבנה לכם תהליך שמייצר יותר פניות"
        label="שיחה ראשונה"
        icon={<Mail className="h-4 w-4" />}
      >
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[34px] bg-[#160f2e] p-8 text-white">
            <h2
              data-gjs-type="text"
              className="text-4xl font-black tracking-[-0.06em]"
            >
              ספרו לנו איפה העסק נתקע
            </h2>

            <p
              data-gjs-type="text"
              className="mt-5 text-sm leading-7 text-white/55"
            >
              כאן אפשר לחבר טופס, יומן פגישות או CRM כדי לאסוף פניות בצורה
              מסודרת.
            </p>
          </div>

          <form className="grid gap-4 rounded-[34px] bg-[#f4efff] p-8">
            <input
              placeholder="שם מלא"
              className="h-12 rounded-2xl border border-[#160f2e]/10 px-4 text-sm font-bold outline-none"
            />

            <input
              placeholder="אימייל"
              className="h-12 rounded-2xl border border-[#160f2e]/10 px-4 text-sm font-bold outline-none"
            />

            <textarea
              placeholder="מה תרצו לשפר בעסק?"
              className="min-h-36 rounded-2xl border border-[#160f2e]/10 p-4 text-sm font-bold outline-none"
            />

            <button
              type="button"
              className="h-12 rounded-full bg-[#160f2e] text-sm font-black text-white"
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