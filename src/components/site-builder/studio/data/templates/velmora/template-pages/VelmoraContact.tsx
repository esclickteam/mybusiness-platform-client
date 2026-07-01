import React from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
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
            ? "animate-[velmoraContactReverse_42s_linear_infinite]"
            : "animate-[velmoraContactMarquee_42s_linear_infinite]",
        ].join(" ")}
      >
        {repeated.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt="השראה מהסטודיו"
            className="h-[210px] w-[320px] shrink-0 object-cover transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
          />
        ))}
      </div>
    </div>
  );
}

const contactCards = [
  {
    icon: Phone,
    title: "טלפון",
    text: "05-1234567",
    note: "מענה בימים א׳–ה׳",
  },
  {
    icon: Mail,
    title: "אימייל",
    text: "hello@ateliernoa.co.il",
    note: "מענה תוך יום עסקים",
  },
  {
    icon: MapPin,
    title: "סטודיו",
    text: "המרכז 25, תל אביב",
    note: "בתיאום מראש בלבד",
  },
  {
    icon: Clock,
    title: "שעות פעילות",
    text: "09:00–18:00",
    note: "שישי עד 13:00",
  },
];

const reasons = [
  "שאלה על מוצר או קולקציה",
  "התאמת סטיילינג אישי",
  "הזמנה קיימת",
  "שיתוף פעולה",
  "ייעוץ לפני רכישה",
  "פגישה בסטודיו",
];

const faqItems = [
  {
    question: "אפשר לקבל ייעוץ לפני רכישה?",
    answer:
      "כן. ניתן להשאיר פרטים בטופס ולציין איזה סוג פריטים מעניינים את הלקוח או הלקוחה.",
  },
  {
    question: "האם יש שירות סטיילינג אישי?",
    answer:
      "כן. שירות הסטיילינג כולל התאמה לפי סגנון, תקציב, צורך, אירוע או מלתחה קיימת.",
  },
  {
    question: "איך מתבצעת פגישה בסטודיו?",
    answer:
      "הפגישה מתקיימת בתיאום מראש בלבד, לאחר מילוי פרטים ובחירת סוג השירות.",
  },
];

export default function VelmoraContact({ onPageChange }: Props) {
  return (
    <main className="overflow-hidden bg-[#f6f2ea] text-[#27231f]">
      <style>
        {`
          @keyframes velmoraContactMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }

          @keyframes velmoraContactReverse {
            0% { transform: translateX(-33.333%); }
            100% { transform: translateX(0); }
          }
        `}
      </style>

      {/* 1. HERO */}
      <section className="relative min-h-[720px] px-5 pb-20 pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(255,255,255,0.95),transparent_42%)]" />

        <div className="relative mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="text-sm tracking-[0.26em] text-black/45">
              CONTACT ATELIER NOA
            </p>

            <h1 className="mt-8 [font-family:Georgia,Times_New_Roman,serif] text-[64px] font-normal leading-[0.9] tracking-[-0.06em] text-[#2b2722] md:text-[112px]">
              יצירת קשר
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-black/55 md:text-lg">
              ניתן להשאיר פרטים לקבלת מידע על מוצרים, קולקציות, סטיילינג אישי,
              פגישה בסטודיו או שיתוף פעולה. הפנייה תעבור לצוות ותחזור תשובה
              מסודרת.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact-form"
                className="inline-flex h-12 items-center gap-3 rounded-[4px] bg-[#292318] px-8 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
              >
                מילוי טופס
                <ArrowLeft className="h-4 w-4" />
              </a>

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
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1500&q=90"
                alt="סטודיו אופנה"
                className="h-[560px] w-full object-cover shadow-[0_28px_90px_rgba(0,0,0,0.12)]"
              />

              <div className="absolute -bottom-8 right-8 max-w-sm rounded-[6px] border border-black/10 bg-white/92 p-6 shadow-2xl backdrop-blur">
                <p className="text-xs font-bold tracking-[0.22em] text-black/40">
                  RESPONSE TIME
                </p>

                <p className="mt-3 [font-family:Georgia,serif] text-3xl leading-tight">
                  פנייה מסודרת מאפשרת התאמה מהירה ומדויקת יותר.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. CONTACT INFO CARDS */}
      <section className="bg-white px-5 py-24">
        <div className="mx-auto max-w-[1500px]">
          <Reveal className="text-center">
            <p className="text-sm tracking-[0.22em] text-black/45">
              פרטי התקשרות
            </p>

            <SerifTitle className="mx-auto mt-5 max-w-4xl text-5xl md:text-7xl">
              כל הדרכים ליצור קשר
            </SerifTitle>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <Reveal key={card.title} delay={index * 110}>
                  <article className="min-h-[260px] rounded-[8px] border border-black/10 bg-[#f6f2ea] p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#292318] text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-8 [font-family:Georgia,serif] text-3xl">
                      {card.title}
                    </h3>

                    <p className="mt-3 text-lg font-bold text-[#292318]">
                      {card.text}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-black/50">
                      {card.note}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FORM */}
      <section id="contact-form" className="bg-[#eee7da] px-5 py-28">
        <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="text-sm tracking-[0.22em] text-black/45">
              שליחת פנייה
            </p>

            <SerifTitle className="mt-5 text-5xl md:text-7xl">
              ספרו לנו במה אפשר לעזור
            </SerifTitle>

            <p className="mt-7 max-w-xl text-base leading-8 text-black/55 md:text-lg">
              הטופס מתאים לשאלות על מוצרים, זמינות, סטיילינג אישי, תיאום פגישה
              או שיתוף פעולה עם המותג.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                "מענה מסודר לאחר קבלת הפרטים",
                "אפשרות לתיאום פגישה בסטודיו",
                "התאמה אישית לפי צורך ותקציב",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#292318] text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-black/65">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160}>
            <form className="rounded-[8px] border border-black/10 bg-white p-7 shadow-[0_24px_90px_rgba(0,0,0,0.09)]">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-black/60">
                    שם מלא
                  </span>

                  <input
                    placeholder="שם מלא"
                    className="h-12 rounded-[4px] border border-black/10 bg-[#f6f2ea] px-4 text-sm outline-none transition focus:border-black"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-bold text-black/60">
                    טלפון
                  </span>

                  <input
                    placeholder="05-0000000"
                    className="h-12 rounded-[4px] border border-black/10 bg-[#f6f2ea] px-4 text-sm outline-none transition focus:border-black"
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-black/60">
                    אימייל
                  </span>

                  <input
                    placeholder="name@email.com"
                    className="h-12 rounded-[4px] border border-black/10 bg-[#f6f2ea] px-4 text-sm outline-none transition focus:border-black"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-bold text-black/60">
                    נושא הפנייה
                  </span>

                  <select className="h-12 rounded-[4px] border border-black/10 bg-[#f6f2ea] px-4 text-sm outline-none transition focus:border-black">
                    <option>בחירת נושא</option>
                    <option>שאלה על מוצר</option>
                    <option>סטיילינג אישי</option>
                    <option>תיאום פגישה</option>
                    <option>שיתוף פעולה</option>
                  </select>
                </label>
              </div>

              <label className="mt-4 grid gap-2">
                <span className="text-sm font-bold text-black/60">
                  הודעה
                </span>

                <textarea
                  rows={7}
                  placeholder="אפשר לכתוב כאן את פרטי הפנייה..."
                  className="resize-none rounded-[4px] border border-black/10 bg-[#f6f2ea] p-4 text-sm outline-none transition focus:border-black"
                />
              </label>

              <div className="mt-5 flex flex-wrap gap-2">
                {reasons.map((reason) => (
                  <span
                    key={reason}
                    className="rounded-full border border-black/10 bg-[#f6f2ea] px-4 py-2 text-xs font-bold text-black/55"
                  >
                    {reason}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className="mt-7 inline-flex h-12 items-center gap-3 rounded-[4px] bg-[#292318] px-8 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
              >
                שליחת פנייה
                <Send className="h-4 w-4" />
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* 4. VISIT STUDIO */}
      <section className="bg-white px-5 py-28">
        <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1500&q=90"
              alt="סטודיו"
              className="h-[620px] w-full object-cover"
            />
          </Reveal>

          <Reveal delay={150}>
            <p className="text-sm tracking-[0.22em] text-black/45">
              VISIT THE STUDIO
            </p>

            <SerifTitle className="mt-5 text-5xl md:text-7xl">
              פגישה בסטודיו בתיאום מראש
            </SerifTitle>

            <p className="mt-7 max-w-xl text-base leading-8 text-black/55 md:text-lg">
              ניתן לתאם פגישה לייעוץ, התאמת פריטים, מדידות או בחירת קולקציה.
              לאחר שליחת הפרטים מתקבלת חזרה מסודרת עם אפשרויות להמשך.
            </p>

            <div className="mt-8 grid gap-4">
              {[
                {
                  icon: CalendarDays,
                  title: "תיאום מראש",
                  text: "פגישות מתקיימות לפי זמינות ותיאום מול הצוות.",
                },
                {
                  icon: Sparkles,
                  title: "התאמה אישית",
                  text: "אפשר להגיע עם צורך ברור, אירוע קרוב או רצון לבנות מלתחה.",
                },
                {
                  icon: MessageCircle,
                  title: "ליווי מסודר",
                  text: "הצוות חוזר עם פרטים, המלצות והמשך תהליך.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex gap-4 border-b border-black/10 pb-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#292318] text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-bold text-[#292318]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-black/50">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="bg-[#f6f2ea] px-5 py-24">
        <div className="mx-auto max-w-[1100px]">
          <Reveal className="text-center">
            <p className="text-sm tracking-[0.22em] text-black/45">
              שאלות נפוצות
            </p>

            <SerifTitle className="mx-auto mt-5 max-w-3xl text-5xl md:text-6xl">
              לפני שיוצרים קשר
            </SerifTitle>
          </Reveal>

          <div className="mt-12 grid gap-4">
            {faqItems.map((item, index) => (
              <Reveal key={item.question} delay={index * 120}>
                <article className="rounded-[8px] border border-black/10 bg-white p-7 shadow-sm">
                  <h3 className="[font-family:Georgia,serif] text-3xl">
                    {item.question}
                  </h3>

                  <p className="mt-4 leading-7 text-black/55">
                    {item.answer}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MOVING GALLERY */}
      <section className="bg-white py-24">
        <Reveal>
          <SerifTitle className="mb-12 text-center text-5xl md:text-6xl">
            השראה מהסטודיו
          </SerifTitle>
        </Reveal>

        <MovingGallery images={velmoraGallery} />

        <div className="mt-5">
          <MovingGallery images={[...velmoraGallery].reverse()} reverse />
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="relative bg-[#30261d] px-5 py-28 text-white">
        <img
          src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=90"
          alt="קולקציה"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />

        <div className="absolute inset-0 bg-black/45" />

        <Reveal className="relative mx-auto max-w-4xl text-center">
          <Instagram className="mx-auto h-10 w-10" />

          <h2 className="mt-6 [font-family:Georgia,serif] text-5xl font-normal leading-tight tracking-[-0.04em] md:text-7xl">
            אפשר להתחיל מפנייה קצרה ולהמשיך להתאמה מלאה
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/70">
            השאירו פרטים, ציינו את סוג הפנייה, והצוות יחזור עם המלצה או המשך
            תהליך מתאים.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#contact-form"
              className="inline-flex h-12 items-center gap-3 rounded-[4px] bg-white px-8 text-sm font-bold text-[#292318] transition hover:-translate-y-1"
            >
              מילוי טופס
              <Mail className="h-4 w-4" />
            </a>

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