import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  CalendarCheck,
  Check,
  ChevronDown,
  Clock3,
  Crown,
  Globe2,
  Handshake,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  Phone,
  Rocket,
  ShieldCheck,
  Star,
  Store,
  Users,
  Zap,
} from "lucide-react";

type LeadForm = {
  name: string;
  phone: string;
  business: string;
  interest: string;
};

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const LOGO_SRC = "/bizuply%20logo.png";
const LAUNCH_TARGET = new Date("2026-08-10T00:00:00+03:00").getTime();

const headline = "מה אם כל מה שהעסק שלך צריך נמצא במקום אחד?";

const systemFeatures: Array<{
  icon: IconType;
  title: string;
  text: string;
}> = [
  {
    icon: LayoutDashboard,
    title: "CRM לניהול לקוחות ולידים",
    text: "כל הפניות, הלקוחות, הסטטוסים, המשימות והמעקבים במקום אחד — בלי לידים שנעלמים ובלי בלאגן.",
  },
  {
    icon: MessageCircle,
    title: "ניהול לידים ישירות ממטא",
    text: "לידים מפייסבוק ואינסטגרם נכנסים למערכת בצורה מסודרת, עם המשך טיפול מהיר וברור.",
  },
  {
    icon: CalendarCheck,
    title: "יומן, פגישות ותורים",
    text: "ניהול זמינות, תיאום פגישות, תורים, תזכורות ומעקב — בצורה שמתאימה לעסק שעובד עם לקוחות.",
  },
  {
    icon: Store,
    title: "אתר, דפי נחיתה וחנות",
    text: "בניית נוכחות דיגיטלית מקצועית לעסק, כולל אתר, דפי נחיתה, יומן, חנות ותשתית מוכנה לצמיחה.",
  },
  {
    icon: Zap,
    title: "אוטומציות חכמות",
    text: "תהליכים שעובדים בשבילכם: תזכורות, מענה, פולואפים, משימות, מעקב ופעולות שחוזרות על עצמן.",
  },
  {
    icon: Bot,
    title: "יועץ AI לעסק",
    text: "עזרה חכמה בתוכן, החלטות, רעיונות, סדר, שיווק, מכירות וניהול יומיומי של העסק.",
  },
  {
    icon: Handshake,
    title: "שיתופי פעולה עסקיים",
    text: "חיבורים, שירותים, ספקים ופתרונות משלימים שיכולים לעזור לעסק להתקדם בלי לחפש הכל לבד.",
  },
];

const humanServices: Array<{
  icon: IconType;
  title: string;
  text: string;
}> = [
  {
    icon: Phone,
    title: "מענה מהיר ללידים",
    text: "אנשי מכירות שיכולים לעזור להגיב מהר יותר לפניות חמות ולהגדיל את הסיכוי לסגירה.",
  },
  {
    icon: CalendarCheck,
    title: "אישורי הגעה לפגישות",
    text: "וידוא הגעה, תזכורות, מעקב והפחתת ביטולים או אי־הופעות.",
  },
  {
    icon: Clock3,
    title: "מילוי תורים שבוטלו",
    text: "עזרה בריכוז רשימות המתנה וניסיון למלא זמנים שהתפנו כדי לצמצם הפסדים.",
  },
  {
    icon: Megaphone,
    title: "קמפיינים ופוסטים",
    text: "הקמת קמפיינים ממומנים, מעקב אחרי תוצאות והכנת פוסטים לרשתות החברתיות.",
  },
];

const launchBenefits = [
  "גישה ראשונה למערכת לפני כולם",
  "מחירי השקה לקבוצת ההרשמה בלבד",
  "הצטרפות לקבוצת וואטסאפ שתיפתח בקרוב",
  "קבלת כל הפרטים, ההדגמות והעדכונים לפני ההשקה",
  "אפשרות להכיר גם את המערכת, גם את השירותים האנושיים וגם את שיתופי הפעולה",
];

const steps = [
  {
    number: "01",
    title: "משאירים פרטים",
    text: "שם, טלפון ושם העסק — כדי שנדע למי לשלוח את העדכונים הראשונים.",
  },
  {
    number: "02",
    title: "מקבלים עדכון לפני כולם",
    text: "נחזור אליכם עם הסבר על המערכת והזמנה לקבוצת הוואטסאפ כשהיא תיפתח.",
  },
  {
    number: "03",
    title: "מצטרפים למחירי ההשקה",
    text: "המחירים הראשונים יינתנו לקבוצה בלבד ולזמן מוגבל.",
  },
];

const faqs = [
  {
    q: "מה זה ביזאפלי?",
    a: "ביזאפלי היא מערכת ושירות לעסקים שמרכזים CRM, לידים, אתר, דפי נחיתה, אוטומציות, יומן, חנות, AI, שיתופי פעולה ושירותים אנושיים שמורידים עומס אמיתי מבעל העסק.",
  },
  {
    q: "מה הופך את ביזאפלי לשונה?",
    a: "ביזאפלי לא נבנית רק כמערכת טכנית. היא משלבת טכנולוגיה, שיתופי פעולה ושירותים אנושיים, כדי לעזור לעסק לא רק לקבל פניות — אלא גם לנהל, להגיב, לעקוב ולמכור בצורה מסודרת יותר.",
  },
  {
    q: "למה אתם אומרים שזה נבנה לעסקים באמת?",
    a: "כי לאורך הדרך בדקנו תהליכים, צרכים, כאבים והרגלי עבודה של עסקים בשווקים שונים בעולם, כדי להבין מה באמת חסר לבעלי עסקים ביום־יום: פחות עומס, יותר סדר, יותר תגובה מהירה ויותר שליטה.",
  },
  {
    q: "מה הכוונה חברה אמריקאית?",
    a: "ביזאפלי מגיעה מבית חברה אמריקאית, עם חשיבה של מוצר מתקדם לעסקים ועם התאמה לשוק הישראלי — לשפה, לקצב, ללידים, לוואטסאפ ולדרך שבה עסקים כאן עובדים.",
  },
  {
    q: "מה מקבלים בהרשמה מוקדמת?",
    a: "נרשמים מוקדמים יקבלו עדכונים ראשונים, הזמנה לקבוצת וואטסאפ שתיפתח בקרוב ומחירי השקה לקבוצה בלבד.",
  },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getCountdownParts() {
  const now = Date.now();
  const diff = Math.max(0, LAUNCH_TARGET - now);

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.72,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FallingHeadline() {
  let charIndex = 0;
  const words = headline.split(" ");

  return (
    <h1
      aria-label={headline}
      className="mx-auto max-w-[1500px] text-center text-[3.9rem] font-black leading-[0.86] tracking-[-0.085em] text-[#23093c] sm:text-7xl md:text-8xl lg:text-[8.6rem] xl:text-[10rem]"
    >
      {words.map((word, wordIndex) => (
        <React.Fragment key={`${word}-${wordIndex}`}>
          <span className="inline-flex whitespace-nowrap">
            {Array.from(word).map((letter, letterIndex) => {
              const delay = 0.12 + charIndex * 0.03;
              charIndex += 1;

              return (
                <span
                  key={`${word}-${letter}-${letterIndex}`}
                  className="biz-letter inline-block"
                  style={{ animationDelay: `${delay}s` }}
                >
                  {letter}
                </span>
              );
            })}
          </span>

          {wordIndex < words.length - 1 ? (
            <span className="inline-block w-3 sm:w-5" />
          ) : null}
        </React.Fragment>
      ))}
    </h1>
  );
}

function BigLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex justify-center"
    >
      <img
        src={LOGO_SRC}
        alt="Bizuply"
        className="h-auto w-[190px] object-contain drop-shadow-[0_20px_45px_rgba(111,39,190,0.18)] sm:w-[250px] lg:w-[320px]"
      />
    </motion.div>
  );
}

function Countdown() {
  const [time, setTime] = useState(getCountdownParts());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTime(getCountdownParts());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const items = [
    { label: "ימים", value: time.days },
    { label: "שעות", value: time.hours },
    { label: "דקות", value: time.minutes },
    { label: "שניות", value: time.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-12 w-full max-w-6xl"
    >
      <div className="mb-6 flex items-center justify-center gap-2 text-center text-sm font-black text-[#7b2ee8] sm:text-base">
        <Clock3 className="h-5 w-5" />
        ספירה לאחור לפתיחת ההרשמה המוקדמת · 10.8.26
      </div>

      <div
        dir="ltr"
        className="flex flex-wrap items-end justify-center gap-x-8 gap-y-7 sm:gap-x-12 lg:gap-x-16"
      >
        {items.map((item, index) => (
          <div key={item.label} className="text-center">
            <div
              className="biz-countdown-number text-6xl font-black leading-none tracking-[-0.08em] text-[#6d28f0] sm:text-7xl lg:text-[7.3rem]"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {String(item.value).padStart(2, "0")}
            </div>
            <div className="mt-2 text-xs font-black tracking-[0.24em] text-[#4d257d] sm:text-sm">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function BizuplyEarlyAccessLanding() {
  const [form, setForm] = useState<LeadForm>({
    name: "",
    phone: "",
    business: "",
    interest: "",
  });

  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const isValid = useMemo(() => {
    return form.name.trim().length > 1 && form.phone.trim().length > 7;
  }, [form.name, form.phone]);

  function updateField(key: keyof LeadForm, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValid) return;

    setSent(true);

    /*
      כאן תחברי לשרת שלך:

      await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    */
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-x-hidden bg-[#f8f4ff] text-[#33104f]"
    >
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .biz-hero-bg {
          background:
            radial-gradient(circle at 18% 14%, rgba(160, 95, 255, 0.18), transparent 28%),
            radial-gradient(circle at 82% 16%, rgba(208, 175, 255, 0.24), transparent 30%),
            radial-gradient(circle at 50% 74%, rgba(125, 62, 240, 0.10), transparent 34%),
            linear-gradient(180deg, #f3eaff 0%, #f8f4ff 54%, #ffffff 100%);
        }

        .biz-letter {
          opacity: 0;
          transform: translate3d(0, -110px, 0) rotate(-10deg) scale(0.92);
          transform-origin: 50% 100%;
          animation: bizLetterDrop 0.78s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        .biz-countdown-number {
          text-shadow:
            0 0 22px rgba(139, 92, 246, 0.22),
            0 12px 34px rgba(123, 46, 232, 0.14);
          animation: bizNumberPulse 1s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes bizLetterDrop {
          0% {
            opacity: 0;
            transform: translate3d(0, -110px, 0) rotate(-10deg) scale(0.92);
            filter: blur(8px);
          }

          70% {
            opacity: 1;
            transform: translate3d(0, 8px, 0) rotate(2deg) scale(1.01);
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
            filter: blur(0);
          }
        }

        @keyframes bizNumberPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.94;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .biz-letter,
          .biz-countdown-number {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>

      <section className="biz-hero-bg relative isolate min-h-screen overflow-hidden px-5 pb-16 pt-10 lg:px-8">
        <div className="pointer-events-none absolute left-[-5%] top-[2%] -z-10 h-[340px] w-[340px] rounded-full bg-[#e8d7ff] blur-3xl" />
        <div className="pointer-events-none absolute right-[2%] top-[14%] -z-10 h-[280px] w-[280px] rounded-full bg-[#d8b5ff]/50 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[8%] left-[18%] -z-10 h-[320px] w-[320px] rounded-full bg-[#efe2ff] blur-3xl" />
        <div className="pointer-events-none absolute bottom-[10%] right-[10%] -z-10 h-[240px] w-[240px] rounded-full bg-[#f3e9ff] blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-white/70 to-transparent" />

        <BigLogo />

        <div className="mx-auto flex min-h-[calc(100vh-130px)] max-w-[1500px] flex-col items-center justify-center text-center">
          <FallingHeadline />
          <Countdown />
        </div>
      </section>

      <section id="about" className="bg-white px-5 py-20 text-[#33104f] lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-[#f6edff] px-4 py-2 text-xs font-black text-[#7b2ee8]">
                  מי אנחנו
                </p>
                <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                  חברה אמריקאית שבנתה פתרון לעסקים שרוצים לעבוד חכם יותר.
                </h2>
              </div>

              <div className="space-y-5 text-lg leading-9 text-[#6d5b84]">
                <p>
                  Bizuply נולדה מתוך הבנה שבעלי עסקים לא צריכים עוד כלי אחד
                  שדורש מהם לעבוד יותר קשה. הם צריכים מערכת שמרכזת, מסדרת,
                  מזכירה, מחברת ומפנה להם זמן.
                </p>

                <p>
                  לפני בניית המערכת, בדקנו תהליכים עם עסקים בשווקים שונים בעולם:
                  איך הם מקבלים לידים, איפה הם מאבדים לקוחות, מה מעכב מכירות,
                  מה גוזל מהם זמן, ואיפה שיתופי פעולה נכונים יכולים לעזור לעסק
                  לצמוח מהר יותר.
                </p>

                <p className="font-black text-[#33104f]">
                  התוצאה היא לא רק מערכת טכנולוגית. זו מעטפת לעסק: CRM, לידים
                  ממטא, אתר, יומן, חנות, אוטומציות, AI, שיתופי פעולה ושירותים
                  אנושיים — הכל כדי לייצר פחות עומס, יותר סדר, יותר לקוחות
                  ויותר צמיחה.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Globe2,
                title: "נבנה מתוך בדיקות גלובליות",
                text: "למדנו עסקים, תהליכים ואתגרים בשווקים שונים כדי להבין מה באמת עובד.",
              },
              {
                icon: Users,
                title: "מותאם לעסק אמיתי",
                text: "לא עוד מערכת מסובכת. הכל בנוי סביב הצורה שבה בעלי עסקים באמת עובדים.",
              },
              {
                icon: Crown,
                title: "השקה ראשונה בישראל",
                text: "הנרשמים המוקדמים יקבלו את ההזדמנות הראשונה להצטרף במחירי השקה.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <Reveal key={item.title} delay={index * 0.08}>
                  <div className="h-full rounded-[34px] border border-[#efdefd] bg-[#fbf7ff] p-7 shadow-[0_18px_50px_rgba(111,39,190,0.06)]">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#7b2ee8] text-white">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 text-2xl font-black tracking-[-0.05em] text-[#33104f]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-7 text-[#6d5b84]">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#fbf7ff] px-5 py-20 text-[#33104f] lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <div className="mb-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-[#7b2ee8]">
                  המערכת
                </p>
                <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                  כל מה שהעסק צריך כדי לקבל, לנהל ולסגור יותר פניות.
                </h2>
              </div>

              <p className="text-lg font-semibold leading-9 text-[#6d5b84]">
                במקום לפצל בין אתר, לידים, וואטסאפ, יומן, קמפיינים, טבלאות
                ותזכורות — Bizuply מחברת את כל החלקים למקום אחד.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {systemFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <Reveal key={feature.title} delay={index * 0.05}>
                  <div className="group h-full rounded-[32px] border border-[#efdefd] bg-white p-6 shadow-[0_18px_50px_rgba(111,39,190,0.04)] transition hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(111,39,190,0.09)]">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f0e4ff] text-[#7b2ee8] transition group-hover:rotate-3 group-hover:scale-105">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 text-2xl font-black tracking-[-0.05em] text-[#33104f]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-7 text-[#6d5b84]">
                      {feature.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="human" className="bg-white px-5 py-20 text-[#33104f] lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <div className="mb-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-[#f6edff] px-4 py-2 text-xs font-black text-[#7b2ee8]">
                  הצד האנושי
                </p>
                <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                  כי לא כל דבר פותרים עם כפתור.
                </h2>
              </div>

              <p className="text-lg font-semibold leading-9 text-[#6d5b84]">
                מה אם היו לכם גם שירותים אנושיים שמורידים מכם את העומס באמת?
                אישורי הגעה, ריכוז הזמנות, מילוי תורים שבוטלו, מענה מהיר ללידים,
                קמפיינים, פוסטים ועוד.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {humanServices.map((service, index) => {
              const Icon = service.icon;

              return (
                <Reveal key={service.title} delay={index * 0.06}>
                  <div className="h-full rounded-[32px] border border-[#efdefd] bg-[#fbf7ff] p-6 shadow-[0_18px_50px_rgba(111,39,190,0.04)] transition hover:-translate-y-2 hover:bg-white hover:shadow-[0_28px_70px_rgba(111,39,190,0.08)]">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#7b2ee8] shadow-[0_12px_35px_rgba(111,39,190,0.07)]">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 text-2xl font-black tracking-[-0.05em] text-[#33104f]">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-7 text-[#6d5b84]">
                      {service.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#fbf7ff] px-5 py-20 text-[#33104f] lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1fr_0.95fr]">
          <Reveal>
            <div className="h-full rounded-[38px] border border-[#ead7ff] bg-white p-8 shadow-[0_24px_70px_rgba(111,39,190,0.06)] lg:p-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#7b2ee8] text-white">
                  <Users className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#7b2ee8]">
                    למי זה מתאים?
                  </p>
                  <p className="text-3xl font-black tracking-[-0.05em] text-[#33104f]">
                    לעסקים שרוצים לגדול
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {[
                  "עסקים שמקבלים לידים ורוצים לנהל אותם טוב יותר",
                  "עסקים שרוצים אתר, יומן, חנות ודפי נחיתה במקום אחד",
                  "עסקים שרוצים להוריד עומס ממענה, תורים, פוסטים וקמפיינים",
                  "עסקים שרוצים לעבוד מסודר יותר ולהגיב מהר יותר ללקוחות",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-[#efdefd] bg-[#fbf7ff] p-4"
                  >
                    <Check className="mt-1 h-5 w-5 shrink-0 text-[#7b2ee8]" />
                    <p className="font-bold leading-7 text-[#5f4a7a]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-[38px] border border-[#ead7ff] bg-gradient-to-br from-white to-[#f2e8ff] p-8 shadow-[0_24px_70px_rgba(111,39,190,0.06)] lg:p-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#7b2ee8] shadow-[0_14px_40px_rgba(111,39,190,0.08)]">
                  <Rocket className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#7b2ee8]">
                    מה מקבלים בהרשמה?
                  </p>
                  <p className="text-3xl font-black tracking-[-0.05em] text-[#33104f]">
                    יתרון לפני כולם
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {launchBenefits.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/90 p-4"
                  >
                    <Star className="mt-1 h-5 w-5 shrink-0 fill-[#7b2ee8] text-[#7b2ee8]" />
                    <p className="font-bold leading-7 text-[#5f4a7a]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-5 py-20 text-[#33104f] lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-[#f6edff] px-4 py-2 text-xs font-black text-[#7b2ee8]">
                  איך זה עובד
                </p>
                <h2 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                  שלושה צעדים ואתם ברשימה.
                </h2>
              </div>

              <p className="max-w-xl text-lg font-semibold leading-8 text-[#6d5b84]">
                ההרשמה לא מחייבת רכישה. היא שומרת לכם מקום לקבלת עדכונים,
                הצצה ראשונה ומחירי השקה כשהקבוצה תיפתח.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.08}>
                <div className="relative h-full overflow-hidden rounded-[34px] border border-[#efdefd] bg-[#fbf7ff] p-8 shadow-[0_18px_50px_rgba(111,39,190,0.04)]">
                  <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[#ead7ff] blur-2xl" />
                  <p className="relative text-6xl font-black tracking-[-0.08em] text-[#d2b0fb]">
                    {step.number}
                  </p>
                  <h3 className="relative mt-8 text-3xl font-black tracking-[-0.05em] text-[#33104f]">
                    {step.title}
                  </h3>
                  <p className="relative mt-3 font-semibold leading-8 text-[#6d5b84]">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="early-access"
        className="relative isolate overflow-hidden bg-[#fbf7ff] px-5 py-20 text-[#33104f] lg:px-8"
      >
        <div className="absolute left-0 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#ead7ff] blur-3xl" />
        <div className="absolute bottom-0 right-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#f3e7ff] blur-3xl" />

        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Reveal>
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-[#7b2ee8] shadow-[0_12px_34px_rgba(111,39,190,0.06)]">
                <Clock3 className="h-4 w-4" />
                הרשמה מוקדמת פתוחה
              </p>

              <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.07em] text-[#33104f] sm:text-7xl">
                רוצים להיות בין הראשונים שמקבלים מחיר השקה וגישה ראשונה למערכת?
              </h2>

              <p className="mt-6 max-w-xl text-lg font-semibold leading-9 text-[#6d5b84]">
                השאירו פרטים ונחזור אליכם לפני כולם. בקרוב תיפתח קבוצת וואטסאפ
                עם כל הפרטים, ההדגמות, העדכונים ומחירי ההשקה לקבוצה בלבד.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  ["בלי התחייבות", ShieldCheck],
                  ["עדכונים לפני כולם", Zap],
                  ["קבוצה סגורה", Users],
                  ["מחירי השקה", Crown],
                ].map(([label, Icon]) => {
                  const TypedIcon = Icon as IconType;

                  return (
                    <div
                      key={String(label)}
                      className="flex items-center gap-3 rounded-2xl border border-[#efdefd] bg-white p-4"
                    >
                      <TypedIcon className="h-5 w-5 text-[#7b2ee8]" />
                      <span className="font-black text-[#33104f]">
                        {String(label)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <form
              onSubmit={handleSubmit}
              className="rounded-[38px] border border-[#ead7ff] bg-white p-4 shadow-[0_28px_80px_rgba(111,39,190,0.08)] sm:p-6 lg:p-8"
            >
              {sent ? (
                <div className="grid min-h-[520px] place-items-center text-center">
                  <div>
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#f3e8ff] text-[#7b2ee8]">
                      <Check className="h-10 w-10" />
                    </div>
                    <h3 className="mt-6 text-4xl font-black tracking-[-0.06em] text-[#33104f]">
                      נרשמת בהצלחה
                    </h3>
                    <p className="mx-auto mt-4 max-w-md text-base font-semibold leading-8 text-[#6d5b84]">
                      שמרנו את הפרטים. בקרוב נפתח קבוצת וואטסאפ ונשלח הזמנה עם
                      כל הפרטים ומחירי ההשקה.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="mt-8 rounded-full bg-[#7b2ee8] px-7 py-4 text-sm font-black text-white transition hover:bg-[#6724c9]"
                    >
                      שליחת הרשמה נוספת
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6 rounded-[30px] border border-[#efdefd] bg-[#fbf7ff] p-5">
                    <p className="text-sm font-black text-[#7b2ee8]">
                      הרשמה מוקדמת
                    </p>
                    <h3 className="mt-2 text-4xl font-black leading-none tracking-[-0.06em] text-[#33104f]">
                      הצטרפות לרשימת הראשונים
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-7 text-[#6d5b84]">
                      מלאו פרטים ונעדכן כשקבוצת הוואטסאפ תיפתח.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-black text-[#33104f]">
                        שם מלא
                      </span>
                      <input
                        value={form.name}
                        onChange={(event) =>
                          updateField("name", event.target.value)
                        }
                        placeholder="איך קוראים לך?"
                        className="min-h-14 w-full rounded-2xl border border-[#ead7ff] bg-white px-5 text-base font-bold text-[#33104f] outline-none transition placeholder:text-[#b39ccf] focus:border-[#7b2ee8] focus:ring-4 focus:ring-[#f0e3ff]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-black text-[#33104f]">
                        טלפון / וואטסאפ
                      </span>
                      <input
                        value={form.phone}
                        onChange={(event) =>
                          updateField("phone", event.target.value)
                        }
                        placeholder="מספר לקבלת הזמנה לקבוצה"
                        inputMode="tel"
                        className="min-h-14 w-full rounded-2xl border border-[#ead7ff] bg-white px-5 text-base font-bold text-[#33104f] outline-none transition placeholder:text-[#b39ccf] focus:border-[#7b2ee8] focus:ring-4 focus:ring-[#f0e3ff]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-black text-[#33104f]">
                        שם העסק
                      </span>
                      <input
                        value={form.business}
                        onChange={(event) =>
                          updateField("business", event.target.value)
                        }
                        placeholder="שם העסק / התחום שלך"
                        className="min-h-14 w-full rounded-2xl border border-[#ead7ff] bg-white px-5 text-base font-bold text-[#33104f] outline-none transition placeholder:text-[#b39ccf] focus:border-[#7b2ee8] focus:ring-4 focus:ring-[#f0e3ff]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-black text-[#33104f]">
                        מה הכי מעניין אותך?
                      </span>
                      <select
                        value={form.interest}
                        onChange={(event) =>
                          updateField("interest", event.target.value)
                        }
                        className="min-h-14 w-full rounded-2xl border border-[#ead7ff] bg-white px-5 text-base font-bold text-[#33104f] outline-none transition focus:border-[#7b2ee8] focus:ring-4 focus:ring-[#f0e3ff]"
                      >
                        <option value="">בחירה</option>
                        <option value="crm">CRM וניהול לידים</option>
                        <option value="meta">לידים ממטא</option>
                        <option value="website">אתר / יומן / חנות</option>
                        <option value="human-services">שירותים אנושיים</option>
                        <option value="collaborations">שיתופי פעולה</option>
                        <option value="all">הכל ביחד</option>
                      </select>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid}
                    className={cx(
                      "mt-6 inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-full px-8 text-base font-black transition",
                      isValid
                        ? "bg-[#7b2ee8] text-white shadow-[0_18px_40px_rgba(123,46,232,0.22)] hover:-translate-y-1 hover:bg-[#6724c9]"
                        : "cursor-not-allowed bg-zinc-200 text-zinc-400",
                    )}
                  >
                    שלחו לי פרטים והזמנה לקבוצה
                    <Phone className="h-5 w-5" />
                  </button>

                  <p className="mt-4 text-center text-xs font-semibold leading-6 text-[#8b78a2]">
                    ההרשמה לא מחייבת רכישה. מחירי ההשקה יינתנו לקבוצת ההרשמה
                    המוקדמת בלבד.
                  </p>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-5 py-20 text-[#33104f] lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div>
              <p className="mb-4 inline-flex rounded-full bg-[#f6edff] px-4 py-2 text-xs font-black text-[#7b2ee8]">
                שאלות נפוצות
              </p>
              <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                כל מה שצריך לדעת לפני ההצטרפות.
              </h2>
            </div>
          </Reveal>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Reveal key={faq.q} delay={index * 0.05}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="w-full rounded-[28px] border border-[#efdefd] bg-[#fbf7ff] p-5 text-right transition hover:bg-white hover:shadow-[0_16px_40px_rgba(111,39,190,0.06)]"
                >
                  <div className="flex items-center justify-between gap-5">
                    <h3 className="text-xl font-black tracking-[-0.04em] text-[#33104f]">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={cx(
                        "h-5 w-5 shrink-0 text-[#7b2ee8] transition",
                        openFaq === index && "rotate-180",
                      )}
                    />
                  </div>

                  {openFaq === index ? (
                    <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-[#6d5b84]">
                      {faq.a}
                    </p>
                  ) : null}
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#efdefd] bg-[#fbf7ff] px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-5 md:flex-row">
          <img
            src={LOGO_SRC}
            alt="Bizuply"
            className="h-auto w-[160px] object-contain"
          />

          <a
            href="#early-access"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7b2ee8] px-6 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#6724c9]"
          >
            להרשמה מוקדמת
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </div>
      </footer>
    </main>
  );
}