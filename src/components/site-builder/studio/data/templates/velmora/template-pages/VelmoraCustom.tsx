import React from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Check,
  Eye,
  Mail,
  MessageCircle,
  Ruler,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react";

import type { VelmoraPageId } from "../pages";
import { velmoraGallery, velmoraProducts } from "../velmoraData";

type Props = {
  onPageChange: (page: VelmoraPageId) => void;
};

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={[
        "transition-all duration-[900ms] ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function SerifTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={[
        "[font-family:Georgia,Times_New_Roman,serif] font-normal leading-[0.98] tracking-[-0.055em] text-[#2b2722]",
        className,
      ].join(" ")}
    >
      {children}
    </h2>
  );
}

function MovingGallery({
  images,
  reverse = false,
}: {
  images: string[];
  reverse?: boolean;
}) {
  const repeated = [...images, ...images, ...images];

  return (
    <div className="relative overflow-hidden">
      <div
        className={[
          "flex w-max gap-4",
          reverse
            ? "animate-[velmoraCustomReverse_40s_linear_infinite]"
            : "animate-[velmoraCustomMarquee_40s_linear_infinite]",
        ].join(" ")}
      >
        {repeated.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt="סטיילינג והשראה"
            className="h-[210px] w-[320px] shrink-0 object-cover transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
          />
        ))}
      </div>
    </div>
  );
}

const serviceCards = [
  {
    icon: Wand2,
    title: "בניית סגנון אישי",
    text: "בחירת שפה ויזואלית ברורה: צבעים, גזרות, שילובים ותחושה כללית שמתאימה למותג או למלתחה.",
  },
  {
    icon: Ruler,
    title: "התאמת פריטים",
    text: "התאמה לפי שימוש, צורך, תקציב, עונה וסגנון קיים — בלי עומס ובלי בחירות מיותרות.",
  },
  {
    icon: CalendarDays,
    title: "לוקים לאירועים",
    text: "בניית לוקים לפגישות, אירועים, ימי צילום, עבודה, ערב או שימוש יומיומי.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "אבחון סגנון",
    text: "מתחילים בשאלון קצר והבנה של סגנון, צרכים, צבעים מועדפים, שימושים יומיומיים ותקציב.",
  },
  {
    number: "02",
    title: "בחירת כיוון",
    text: "יוצרים כיוון ויזואלי עם השראות, שילובים, צבעים ופריטים שמתאימים למטרה.",
  },
  {
    number: "03",
    title: "בניית לוקים",
    text: "מרכיבים לוקים שלמים עם פריטים קיימים או חדשים, כולל אקססוריז והמלצות שילוב.",
  },
  {
    number: "04",
    title: "סיכום מסודר",
    text: "מקבלים רשימה ברורה של פריטים, שילובים, המלצות וצעדים להמשך.",
  },
];

const packages = [
  {
    title: "ייעוץ בסיסי",
    price: "₪249",
    text: "פגישה ממוקדת לבחירת כיוון, צבעים ופריטים מומלצים.",
    items: ["שאלון סגנון", "שיחת ייעוץ", "רשימת המלצות"],
  },
  {
    title: "סטיילינג מלא",
    price: "₪490",
    text: "בניית לוקים שלמים לפי צורך, תקציב וסגנון אישי.",
    items: ["אבחון מלא", "5 לוקים מוכנים", "רשימת קניות"],
    highlighted: true,
  },
  {
    title: "ליווי פרימיום",
    price: "₪790",
    text: "תהליך מלא לבניית מלתחה או קולקציה מותאמת.",
    items: ["שיחת עומק", "10 לוקים", "ליווי והכוונה"],
  },
];

export default function VelmoraCustom({ onPageChange }: Props) {
  const featuredProducts = velmoraProducts.slice(0, 4);

  return (
    <main className="overflow-hidden bg-[#f6f2ea] text-[#27231f]">
      <style>
        {`
          @keyframes velmoraCustomMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }

          @keyframes velmoraCustomReverse {
            0% { transform: translateX(-33.333%); }
            100% { transform: translateX(0); }
          }
        `}
      </style>

      {/* 1. HERO */}
      <section className="relative min-h-[760px] px-5 pb-20 pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.95),transparent_42%)]" />

        <div className="relative mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="text-sm tracking-[0.26em] text-black/45">
              PERSONAL STYLING
            </p>

            <h1 className="mt-8 [font-family:Georgia,Times_New_Roman,serif] text-[64px] font-normal leading-[0.9] tracking-[-0.06em] text-[#2b2722] md:text-[110px]">
              סטיילינג אישי שמרגיש מדויק
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-black/55 md:text-lg">
              שירות התאמה אישי לבניית מלתחה, לוקים וקולקציות לפי סגנון, צורך,
              תקציב ושימוש יומיומי. מתאים ללקוחות פרטיים, מותגים, ימי צילום
              ועסקים.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onPageChange("contact")}
                className="inline-flex h-12 items-center gap-3 rounded-[4px] bg-[#292318] px-8 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
              >
                קביעת שיחה
                <ArrowLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onPageChange("shop")}
                className="inline-flex h-12 items-center gap-3 rounded-[4px] border border-black/15 bg-white px-8 text-sm font-bold text-[#292318] transition hover:border-black"
              >
                מעבר לחנות
              </button>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="relative grid gap-5 md:grid-cols-2">
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=90"
                alt="סטיילינג אישי"
                className="h-[560px] w-full object-cover shadow-[0_28px_90px_rgba(0,0,0,0.12)]"
              />

              <div className="grid gap-5 pt-16">
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=90"
                  alt="סטודיו אופנה"
                  className="h-[260px] w-full object-cover shadow-sm"
                />

                <div className="rounded-[6px] border border-black/10 bg-white/92 p-6 shadow-2xl backdrop-blur">
                  <p className="text-xs font-bold tracking-[0.22em] text-black/40">
                    STYLE NOTE
                  </p>

                  <p className="mt-3 [font-family:Georgia,serif] text-3xl leading-tight">
                    פחות עומס. יותר דיוק. מלתחה שעובדת באמת.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. SERVICE CARDS */}
      <section className="bg-white px-5 py-24">
        <div className="mx-auto max-w-[1500px]">
          <Reveal className="text-center">
            <p className="text-sm tracking-[0.22em] text-black/45">
              מה כולל השירות
            </p>

            <SerifTitle className="mx-auto mt-5 max-w-4xl text-5xl md:text-7xl">
              תהליך שמחבר בין אופי, שימוש וסגנון
            </SerifTitle>
          </Reveal>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {serviceCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <Reveal key={card.title} delay={index * 120}>
                  <article className="min-h-[330px] rounded-[8px] border border-black/10 bg-[#f6f2ea] p-8 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="flex h-13 w-13 items-center justify-center rounded-full bg-[#292318] p-4 text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-10 [font-family:Georgia,serif] text-4xl leading-tight">
                      {card.title}
                    </h3>

                    <p className="mt-5 leading-8 text-black/55">{card.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. BEFORE / AFTER EDITORIAL */}
      <section className="bg-[#eee7da] px-5 py-28">
        <div className="mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <div className="grid grid-cols-2 gap-5">
              <img
                src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=90"
                alt="לוק לפני התאמה"
                className="h-[520px] w-full object-cover"
              />

              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=90"
                alt="לוק אחרי התאמה"
                className="mt-20 h-[520px] w-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={160}>
            <p className="text-sm tracking-[0.22em] text-black/45">
              STYLE TRANSFORMATION
            </p>

            <SerifTitle className="mt-5 text-5xl md:text-7xl">
              לא מחליפים הכול — מדייקים את מה שכבר קיים
            </SerifTitle>

            <p className="mt-7 max-w-xl text-base leading-8 text-black/55 md:text-lg">
              התהליך לא נועד לייצר עומס חדש, אלא להבין מה עובד, מה חסר, מה
              כדאי להשלים ואיך ליצור שילובים שנראים טוב ומרגישים נוחים.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                "מיפוי פריטים קיימים",
                "המלצות צבעים וגזרות",
                "בניית לוקים לפי שימוש",
                "רשימת קניות מסודרת",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border-b border-black/10 pb-3"
                >
                  <BadgeCheck className="h-5 w-5 text-[#292318]" />
                  <span className="font-bold text-black/70">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. PROCESS */}
      <section className="bg-white px-5 py-24">
        <div className="mx-auto max-w-[1500px]">
          <Reveal className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm tracking-[0.22em] text-black/45">
                תהליך עבודה
              </p>

              <SerifTitle className="mt-4 text-5xl md:text-6xl">
                איך זה עובד
              </SerifTitle>
            </div>

            <button
              type="button"
              onClick={() => onPageChange("contact")}
              className="inline-flex h-11 items-center gap-3 rounded-[4px] bg-[#292318] px-6 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
            >
              התחלת תהליך
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <Reveal key={step.number} delay={index * 120}>
                <article className="border-t border-black/20 pt-7">
                  <p className="text-sm font-bold tracking-[0.22em] text-black/35">
                    {step.number}
                  </p>

                  <h3 className="mt-6 [font-family:Georgia,serif] text-4xl">
                    {step.title}
                  </h3>

                  <p className="mt-4 leading-7 text-black/55">{step.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PACKAGES */}
      <section className="bg-[#f6f2ea] px-5 py-24">
        <div className="mx-auto max-w-[1500px]">
          <Reveal className="text-center">
            <p className="text-sm tracking-[0.22em] text-black/45">
              חבילות שירות
            </p>

            <SerifTitle className="mx-auto mt-5 max-w-4xl text-5xl md:text-7xl">
              בחירת מסלול שמתאים לצורך
            </SerifTitle>
          </Reveal>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {packages.map((item, index) => (
              <Reveal key={item.title} delay={index * 120}>
                <article
                  className={[
                    "min-h-[500px] rounded-[8px] border p-8 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl",
                    item.highlighted
                      ? "border-[#292318] bg-[#292318] text-white"
                      : "border-black/10 bg-white text-[#27231f]",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="[font-family:Georgia,serif] text-4xl">
                      {item.title}
                    </h3>

                    {item.highlighted && (
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#292318]">
                        מומלץ
                      </span>
                    )}
                  </div>

                  <p className="mt-6 [font-family:Georgia,serif] text-5xl">
                    {item.price}
                  </p>

                  <p
                    className={[
                      "mt-5 leading-7",
                      item.highlighted ? "text-white/70" : "text-black/55",
                    ].join(" ")}
                  >
                    {item.text}
                  </p>

                  <div className="mt-8 grid gap-3">
                    {item.items.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <Check
                          className={[
                            "h-5 w-5",
                            item.highlighted ? "text-white" : "text-[#292318]",
                          ].join(" ")}
                        />
                        <span className="text-sm font-bold">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onPageChange("contact")}
                    className={[
                      "mt-10 h-12 w-full rounded-[4px] text-sm font-bold transition hover:-translate-y-1",
                      item.highlighted
                        ? "bg-white text-[#292318]"
                        : "bg-[#292318] text-white",
                    ].join(" ")}
                  >
                    בחירת מסלול
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FEATURED PRODUCTS */}
      <section className="bg-white px-5 py-24">
        <div className="mx-auto max-w-[1500px]">
          <Reveal className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm tracking-[0.22em] text-black/45">
                פריטים שמתאימים לתהליך
              </p>

              <SerifTitle className="mt-4 text-5xl md:text-6xl">
                בחירה ראשונית מהחנות
              </SerifTitle>
            </div>

            <button
              type="button"
              onClick={() => onPageChange("shop")}
              className="inline-flex h-11 items-center gap-3 rounded-[4px] bg-[#292318] px-6 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
            >
              לכל הפריטים
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <Reveal key={product.id} delay={index * 120}>
                <button
                  type="button"
                  onClick={() => onPageChange("product")}
                  className="group overflow-hidden bg-[#f6f2ea] text-right shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="p-5">
                    <p className="text-xs tracking-[0.18em] text-black/35">
                      {product.ref}
                    </p>

                    <h3 className="mt-2 text-xl font-bold">{product.title}</h3>

                    <p className="mt-1 text-sm text-black/45">
                      {product.subtitle}
                    </p>

                    <button
                      type="button"
                      className="mt-4 inline-flex items-center gap-2 border-b border-black pb-1 text-sm font-medium"
                    >
                      צפייה
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. AUTO MOVING GALLERY */}
      <section className="bg-[#eee7da] py-24">
        <Reveal>
          <SerifTitle className="mb-12 text-center text-5xl md:text-6xl">
            השראה לתהליך הסטיילינג
          </SerifTitle>
        </Reveal>

        <MovingGallery images={velmoraGallery} />

        <div className="mt-5">
          <MovingGallery images={[...velmoraGallery].reverse()} reverse />
        </div>
      </section>

      {/* 8. CONTACT CTA */}
      <section className="relative bg-[#30261d] px-5 py-28 text-white">
        <img
          src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=90"
          alt="סטיילינג אישי"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />

        <div className="absolute inset-0 bg-black/45" />

        <Reveal className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#292318]">
            <MessageCircle className="h-6 w-6" />
          </div>

          <h2 className="mt-6 [font-family:Georgia,serif] text-5xl font-normal leading-tight tracking-[-0.04em] md:text-7xl">
            התחלת תהליך סטיילינג אישי
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/70">
            אפשר להשאיר פרטים, לבחור מסלול או לבקש התאמה ראשונית. לאחר מכן
            ניתן להמשיך לחנות, לבחור פריטים ולבנות לוקים מלאים.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => onPageChange("contact")}
              className="inline-flex h-12 items-center gap-3 rounded-[4px] bg-white px-8 text-sm font-bold text-[#292318] transition hover:-translate-y-1"
            >
              השארת פרטים
              <Mail className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onPageChange("shop")}
              className="h-12 rounded-[4px] border border-white/30 px-8 text-sm font-bold text-white transition hover:bg-white hover:text-[#292318]"
            >
              מעבר לחנות
            </button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}