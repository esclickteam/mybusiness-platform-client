import React from "react";
import {
  ArrowLeft,
  BadgeCheck,
  HeartHandshake,
  Scissors,
  Sparkles,
  Shirt,
} from "lucide-react";

import type { VelmoraPageId } from "../pages";
import { velmoraGallery } from "../velmoraData";

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
      { threshold: 0.16 }
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
        "[font-family:Georgia,Times_New_Roman,serif] font-normal leading-[1.02] tracking-[-0.055em] text-[#2b2722]",
        className,
      ].join(" ")}
    >
      {children}
    </h2>
  );
}

const values = [
  {
    icon: Shirt,
    title: "גזרות מדויקות",
    text: "כל פריט נבחר לפי התאמה, נוחות, תנועה ושימושיות לאורך זמן.",
  },
  {
    icon: Sparkles,
    title: "אסתטיקה שקטה",
    text: "שפה נקייה, צבעים רגועים ופריטים שלא מרגישים זמניים או עמוסים.",
  },
  {
    icon: Scissors,
    title: "בחירת חומרים",
    text: "בדים טבעיים, טקסטורות נעימות ופרטים קטנים שמרימים את כל המראה.",
  },
  {
    icon: HeartHandshake,
    title: "חוויה אישית",
    text: "אפשר לקבל הכוונה, התאמה אישית וסטיילינג לפי צורך, אירוע או מלתחה קיימת.",
  },
];

const timeline = [
  {
    year: "01",
    title: "השראה",
    text: "מתחילים מסגנון חיים, שימוש יומיומי, אירועים קרובים וצבעים שמרגישים נכונים.",
  },
  {
    year: "02",
    title: "בחירה",
    text: "בוחרים פריטים לפי בד, גזרה, שילובים קיימים ותחושה כללית של המותג.",
  },
  {
    year: "03",
    title: "התאמה",
    text: "יוצרים מראה שלם — מפריט מרכזי ועד שכבות, אקססוריז ופרטים משלימים.",
  },
];

export default function VelmoraAbout({ onPageChange }: Props) {
  return (
    <main className="overflow-hidden bg-[#f6f2ea] text-[#27231f]">
      {/* HERO */}
      <section className="px-5 pb-24 pt-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <Reveal>
            <p className="text-sm tracking-[0.22em] text-black/45">
              אודות ATELIER NOA
            </p>

            <SerifTitle className="mt-6 text-[56px] md:text-[86px]">
              אופנה שנבנית מתוך שקט, דיוק וסגנון אישי
            </SerifTitle>

            <p className="mt-7 max-w-xl text-base leading-8 text-black/55 md:text-lg">
              ATELIER NOA נבנה כבית לאופנה נקייה, איכותית ונעימה — מקום שבו
              פריטים נבחרים בקפידה כדי ליצור מלתחה מדויקת, שימושית ועל־זמנית.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onPageChange("shop")}
                className="inline-flex h-12 items-center gap-3 rounded-[4px] bg-[#292318] px-8 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
              >
                מעבר לחנות
                <ArrowLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onPageChange("custom")}
                className="inline-flex h-12 items-center gap-3 rounded-[4px] border border-black/15 bg-white px-8 text-sm font-bold text-[#292318] transition hover:border-black"
              >
                סטיילינג אישי
              </button>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1400&q=90"
                alt="סטודיו אופנה"
                className="h-[560px] w-full object-cover shadow-[0_28px_90px_rgba(0,0,0,0.12)]"
              />

              <div className="absolute -bottom-8 right-8 max-w-sm rounded-[6px] border border-black/10 bg-white/92 p-6 shadow-2xl backdrop-blur">
                <p className="text-xs font-bold tracking-[0.2em] text-black/40">
                  BRAND STORY
                </p>

                <p className="mt-3 [font-family:Georgia,serif] text-3xl leading-tight text-[#2b2722]">
                  פריטים שמרגישים נכונים גם היום וגם בעוד שנים.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STORY */}
      <section className="bg-white px-5 py-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <p className="text-sm tracking-[0.22em] text-black/45">
              הסיפור שלנו
            </p>

            <SerifTitle className="mt-5 text-5xl md:text-6xl">
              לא עוד קולקציה מהירה — אלא שפה שלמה
            </SerifTitle>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-6 text-base leading-8 text-black/55 md:text-lg">
              <p>
                המותג נולד מתוך רצון ליצור חוויית אופנה נקייה יותר: פחות עומס,
                פחות רעש, יותר התאמה אמיתית לחיים, לעבודה, לאירועים וליומיום.
              </p>

              <p>
                כל פריט באתר נבחר כדי להשתלב במלתחה קיימת, ליצור שילובים חדשים
                ולתת תחושה של סדר, איכות ונוכחות בלי מאמץ.
              </p>

              <p>
                מעבר לחנות, האתר מציע גם שירותי סטיילינג והתאמה אישית — כדי
                לאפשר בחירה מדויקת יותר לפי סגנון, צורך ותקציב.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-[#eee7da] px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SerifTitle className="text-center text-4xl md:text-5xl">
              הערכים שמובילים את המותג
            </SerifTitle>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {values.map((item, index) => {
              const Icon = item.icon;

              return (
                <Reveal key={item.title} delay={index * 120}>
                  <div className="min-h-[280px] rounded-[6px] border border-black/10 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#292318] text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-8 [font-family:Georgia,serif] text-3xl leading-tight">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-black/55">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* LARGE IMAGE / QUOTE */}
      <section className="relative bg-[#3b3025] px-5 py-28 text-white">
        <img
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=90"
          alt="קולקציה"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />

        <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-black/50" />

        <Reveal className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm tracking-[0.22em] text-white/55">
            הגישה שלנו
          </p>

          <h2 className="[font-family:Georgia,serif] mt-6 text-5xl font-normal leading-tight tracking-[-0.04em] md:text-7xl">
            מלתחה טובה מתחילה בפריטים שמרגישים טבעיים, נוחים ונכונים.
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/70">
            המטרה היא לא להעמיס — אלא לדייק. לבחור פחות, אבל טוב יותר. ליצור
            שילובים שמחזיקים לאורך זמן ומרגישים נאמנים לסגנון האישי.
          </p>
        </Reveal>
      </section>

      {/* PROCESS */}
      <section className="bg-white px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm tracking-[0.22em] text-black/45">
                  תהליך עבודה
                </p>

                <SerifTitle className="mt-4 text-4xl md:text-5xl">
                  איך נבנית בחירה מדויקת
                </SerifTitle>
              </div>

              <button
                type="button"
                onClick={() => onPageChange("custom")}
                className="inline-flex h-11 items-center gap-3 rounded-[4px] bg-[#292318] px-6 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
              >
                התאמה אישית
                <ArrowLeft className="h-4 w-4" />
              </button>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {timeline.map((item, index) => (
              <Reveal key={item.year} delay={index * 140}>
                <div className="border-t border-black/20 pt-7">
                  <p className="text-sm font-bold tracking-[0.22em] text-black/35">
                    {item.year}
                  </p>

                  <h3 className="mt-6 [font-family:Georgia,serif] text-4xl">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-7 text-black/55">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-[#f6f2ea] px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SerifTitle className="text-center text-4xl md:text-5xl">
              רגעים מהסטודיו
            </SerifTitle>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {velmoraGallery.slice(0, 6).map((image, index) => (
              <Reveal key={image} delay={index * 90}>
                <img
                  src={image}
                  alt="סטודיו ואופנה"
                  className={[
                    "w-full object-cover shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl",
                    index % 3 === 1 ? "h-[420px]" : "h-[320px]",
                  ].join(" ")}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-5 py-24">
        <Reveal className="mx-auto max-w-4xl rounded-[8px] border border-black/10 bg-[#f6f2ea] p-10 text-center shadow-[0_24px_90px_rgba(0,0,0,0.08)]">
          <BadgeCheck className="mx-auto h-9 w-9 text-[#292318]" />

          <SerifTitle className="mx-auto mt-5 max-w-2xl text-4xl md:text-5xl">
            אפשר להתחיל מקולקציה קיימת או לבנות התאמה אישית
          </SerifTitle>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-black/55">
            מעבר לעמוד החנות מאפשר לראות את כל הפריטים. למי שמחפש התאמה מדויקת
            יותר, ניתן לעבור לשירות הסטיילינג האישי.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => onPageChange("shop")}
              className="h-12 rounded-[4px] bg-[#292318] px-8 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
            >
              מעבר לחנות
            </button>

            <button
              type="button"
              onClick={() => onPageChange("custom")}
              className="h-12 rounded-[4px] border border-black/15 bg-white px-8 text-sm font-bold text-[#292318] transition hover:border-black"
            >
              סטיילינג אישי
            </button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}