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
  Sparkles,
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
    title: "CRM חכם",
    text: "כל הלידים, הלקוחות, הסטטוסים, המשימות והמעקבים במקום אחד — בלי בלאגן ובלי לידים שנעלמים.",
  },
  {
    icon: MessageCircle,
    title: "לידים ישירות ממטא",
    text: "פניות מפייסבוק ואינסטגרם נכנסות למערכת בצורה מסודרת, עם שיוך, מקור, סטטוס והמשך טיפול.",
  },
  {
    icon: CalendarCheck,
    title: "יומן ותורים",
    text: "ניהול זמינות, פגישות, תורים, תזכורות ומעקב — כדי שכל פנייה תוכל להפוך לפגישה אמיתית.",
  },
  {
    icon: Store,
    title: "אתר, דפי נחיתה וחנות",
    text: "נוכחות דיגיטלית מקצועית לעסק, עם אתר, דפי נחיתה, חנות, יומן וחיבור ישיר למערכת.",
  },
  {
    icon: Zap,
    title: "אוטומציות",
    text: "תזכורות, פולואפים, משימות, התראות ותהליכים שחוזרים על עצמם — עובדים אוטומטית ברקע.",
  },
  {
    icon: Bot,
    title: "AI לעסק",
    text: "עזרה בתוכן, שיווק, רעיונות, סדר, מכירות וניהול יומיומי — בלי להרגיש לבד מול כל ההחלטות.",
  },
  {
    icon: Handshake,
    title: "שיתופי פעולה",
    text: "חיבורים, ספקים, שירותים ופתרונות משלימים שיכולים לעזור לעסק להתקדם מהר יותר.",
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
    text: "עזרה בתגובה מהירה לפניות חמות כדי להגדיל את הסיכוי לסגירה.",
  },
  {
    icon: CalendarCheck,
    title: "אישורי הגעה",
    text: "וידוא הגעה, תזכורות ומעקב אחרי לקוחות לפני פגישות ותורים.",
  },
  {
    icon: Clock3,
    title: "מילוי תורים שבוטלו",
    text: "עזרה בריכוז רשימות המתנה ובמילוי זמנים שהתפנו ברגע האחרון.",
  },
  {
    icon: Megaphone,
    title: "קמפיינים ופוסטים",
    text: "הקמת קמפיינים, הכנת פוסטים, מעקב אחרי ביצועים ושיפור תוצאות.",
  },
];

const saasFlow = [
  {
    icon: MessageCircle,
    label: "לידים ממטא",
    text: "פייסבוק ואינסטגרם",
  },
  {
    icon: LayoutDashboard,
    label: "CRM",
    text: "סטטוסים ומשימות",
  },
  {
    icon: CalendarCheck,
    label: "יומן",
    text: "פגישות ותורים",
  },
  {
    icon: Zap,
    label: "אוטומציות",
    text: "פולואפים ותזכורות",
  },
  {
    icon: Bot,
    label: "AI",
    text: "תוכן והחלטות",
  },
];

const launchBenefits = [
  "גישה ראשונה למערכת לפני כולם",
  "מחירי השקה לקבוצת ההרשמה בלבד",
  "הצטרפות לקבוצת וואטסאפ שתיפתח בקרוב",
  "קבלת הדגמות ועדכונים לפני ההשקה",
  "היכרות עם המערכת, השירותים האנושיים ושיתופי הפעולה",
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
        duration: 0.75,
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
      className="mx-auto max-w-[1320px] text-center text-[clamp(2.8rem,6.1vw,7rem)] font-extrabold leading-[0.97] tracking-[-0.035em] text-[#fcf8ff] drop-shadow-[0_16px_45px_rgba(173,123,255,0.10)]"
    >
      {words.map((word, wordIndex) => (
        <React.Fragment key={`${word}-${wordIndex}`}>
          <span className="inline-flex whitespace-nowrap">
            {Array.from(word).map((letter, letterIndex) => {
              const delay = 0.1 + charIndex * 0.025;
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
            <span className="inline-block w-2 sm:w-4" />
          ) : null}
        </React.Fragment>
      ))}
    </h1>
  );
}

function BigLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex justify-center"
    >
      <img
        src={LOGO_SRC}
        alt="Bizuply"
        className="h-auto w-[220px] object-contain drop-shadow-[0_22px_50px_rgba(142,92,255,0.34)] sm:w-[280px] lg:w-[340px] xl:w-[380px]"
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
      transition={{ delay: 1.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-[880px] overflow-visible px-2 sm:max-w-[920px]"
    >
      <div
        dir="ltr"
        className="grid w-full grid-cols-4 items-end gap-x-1 sm:gap-x-2 md:gap-x-3 lg:gap-x-4"
      >
        {items.map((item, index) => (
          <div key={item.label} className="min-w-0 text-center">
            <div
              className="biz-countdown-number mx-auto block whitespace-nowrap pb-1 text-[clamp(3.25rem,5.9vw,5.8rem)] font-black leading-[1.05] tracking-[-0.06em]"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {String(item.value).padStart(2, "0")}
            </div>

            <div className="mt-0.5 text-[9px] font-black tracking-[0.18em] text-[#f3dda5] sm:text-[10px] md:text-xs">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SaaSDashboardMockup() {
  const rows = [
    ["ליד חדש", "חם", "וואטסאפ"],
    ["פגישה נקבעה", "בטיפול", "יומן"],
    ["הצעת מחיר", "פתוח", "CRM"],
    ["תור שהתפנה", "דחוף", "אוטומציה"],
  ];

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="biz-dashboard-light absolute -inset-8 rounded-[44px]" />

      <motion.div
        initial={{ opacity: 0, y: 26, rotateX: 8 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[36px] border border-white/14 bg-[#160a25]/88 p-4 shadow-[0_38px_110px_rgba(24,7,42,0.55)] backdrop-blur-2xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_12%,rgba(146,90,255,0.24),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(241,211,145,0.12),transparent_26%)]" />
        <div className="biz-scan absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black text-[#c6a6ff]">
                Bizuply Command Center
              </p>
              <h3 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
                שליטה מלאה בעסק בזמן אמת
              </h3>
            </div>

            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-[#f3dda5]" />
              <span className="h-3 w-3 rounded-full bg-[#a875ff]" />
              <span className="h-3 w-3 rounded-full bg-white/55" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["248", "לידים החודש"],
              ["74%", "תגובה מהירה"],
              ["31", "תורים נקבעו"],
            ].map(([num, label], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.55 }}
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-4"
              >
                <p className="text-3xl font-black tracking-[-0.07em] text-[#f3dda5]">
                  {num}
                </p>
                <p className="mt-1 text-xs font-bold text-[#cdbde4]">{label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {rows.map((row, index) => (
              <motion.div
                key={`${row[0]}-${index}`}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 + index * 0.08, duration: 0.52 }}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-3"
              >
                <p className="text-sm font-black text-white">{row[0]}</p>
                <span className="rounded-full bg-[#f3dda5]/14 px-3 py-1 text-[11px] font-black text-[#f3dda5]">
                  {row[1]}
                </span>
                <span className="rounded-full bg-[#a875ff]/15 px-3 py-1 text-[11px] font-black text-[#d9c2ff]">
                  {row[2]}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FlowSection() {
  return (
    <section className="relative overflow-hidden bg-[#0f0619] px-5 py-24 text-white lg:px-8">
      <div className="pointer-events-none absolute left-[-10%] top-[-18%] h-[520px] w-[520px] rounded-full bg-[#7b2ee8]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-22%] right-[-8%] h-[560px] w-[560px] rounded-full bg-[#f3dda5]/10 blur-3xl" />

      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black text-[#f3dda5]">
              זרימת עבודה חכמה
            </p>
            <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.075em] sm:text-7xl">
              מהפנייה הראשונה ועד הסגירה — הכל מחובר.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-8 text-[#cdbde4]">
              במקום לרוץ בין כלים, הודעות, יומנים וטבלאות — כל שלב בתהליך העסקי
              נכנס למערכת אחת עם תנועה ברורה.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-16 grid gap-5 lg:grid-cols-5">
          <div className="biz-flow-line pointer-events-none absolute left-[8%] right-[8%] top-16 hidden h-px bg-gradient-to-l from-transparent via-[#f3dda5]/40 to-transparent lg:block" />

          {saasFlow.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.label} delay={index * 0.07}>
                <div className="relative h-full rounded-[32px] border border-white/10 bg-white/[0.055] p-5 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-[#7b2ee8] to-[#c29aff] text-white shadow-[0_18px_45px_rgba(123,46,232,0.28)]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-2xl font-black tracking-[-0.05em] text-white">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm font-semibold leading-7 text-[#cdbde4]">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
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
      className="min-h-screen overflow-x-hidden bg-[#fbf8ff] text-[#2a103c]"
    >
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .biz-hero-bg {
          background:
            radial-gradient(circle at 18% 18%, rgba(168, 116, 255, 0.18), transparent 25%),
            radial-gradient(circle at 82% 14%, rgba(243, 221, 165, 0.12), transparent 22%),
            radial-gradient(circle at 50% 78%, rgba(160, 90, 255, 0.15), transparent 28%),
            linear-gradient(135deg, #10061b 0%, #1a0a2b 38%, #2b1245 72%, #16081f 100%);
        }

        .biz-letter {
          opacity: 0;
          transform: translate3d(0, -90px, 0) rotate(-6deg) scale(0.96);
          transform-origin: 50% 100%;
          animation: bizLetterDrop 0.72s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          text-shadow: 0 18px 40px rgba(220, 190, 255, 0.10);
        }

        .biz-countdown-number {
          background: linear-gradient(
            180deg,
            #fff9de 0%,
            #f4e2a2 20%,
            #e7d4ff 43%,
            #f0d17f 68%,
            #c996ff 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 14px rgba(255, 236, 179, 0.06);
          filter:
            drop-shadow(0 0 18px rgba(224, 193, 119, 0.16))
            drop-shadow(0 10px 24px rgba(174, 109, 255, 0.18));
          animation: bizNumberPulse 1s ease-in-out infinite;
          will-change: transform;
        }

        .biz-dashboard-light {
          background:
            radial-gradient(circle at 22% 24%, rgba(123, 46, 232, 0.24), transparent 34%),
            radial-gradient(circle at 80% 52%, rgba(243, 221, 165, 0.15), transparent 34%);
          filter: blur(20px);
        }

        .biz-scan {
          animation: bizScan 3.4s ease-in-out infinite;
        }

        .biz-flow-line::after {
          content: "";
          position: absolute;
          top: -2px;
          width: 86px;
          height: 5px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, #f3dda5, transparent);
          animation: bizFlow 3.2s linear infinite;
        }

        .biz-float-soft {
          animation: bizFloatSoft 4s ease-in-out infinite;
        }

        @keyframes bizLetterDrop {
          0% {
            opacity: 0;
            transform: translate3d(0, -90px, 0) rotate(-6deg) scale(0.96);
            filter: blur(6px);
          }

          70% {
            opacity: 1;
            transform: translate3d(0, 4px, 0) rotate(0deg) scale(1.01);
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
            transform: scale(1.05);
            opacity: 0.97;
          }
        }

        @keyframes bizScan {
          0%, 100% {
            transform: translateY(-30px);
            opacity: 0.12;
          }
          50% {
            transform: translateY(150px);
            opacity: 0.34;
          }
        }

        @keyframes bizFlow {
          from {
            left: 0%;
          }
          to {
            left: calc(100% - 86px);
          }
        }

        @keyframes bizFloatSoft {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .biz-letter,
          .biz-countdown-number,
          .biz-scan,
          .biz-flow-line::after,
          .biz-float-soft {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>

      <section className="biz-hero-bg relative isolate min-h-screen overflow-hidden px-4 pb-10 pt-8 sm:px-5 lg:px-8">
        <div className="pointer-events-none absolute left-[-3%] top-[5%] -z-10 h-[360px] w-[360px] rounded-full bg-[#8f63ff]/16 blur-3xl" />
        <div className="pointer-events-none absolute right-[4%] top-[12%] -z-10 h-[280px] w-[280px] rounded-full bg-[#e8d6a5]/12 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[7%] left-[14%] -z-10 h-[330px] w-[330px] rounded-full bg-[#d7b2ff]/12 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#13081b]/20 to-transparent" />

        <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-[1500px] flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center justify-center gap-6 sm:gap-7">
            <BigLogo />
            <FallingHeadline />
            <Countdown />
          </div>
        </div>
      </section>

      <section id="about" className="relative overflow-hidden bg-[#fbf8ff] px-5 py-24 text-[#2a103c] lg:px-8">
        <div className="pointer-events-none absolute left-[-10%] top-[10%] h-[460px] w-[460px] rounded-full bg-[#e6d7ff] blur-3xl" />
        <div className="pointer-events-none absolute right-[-12%] bottom-[-10%] h-[520px] w-[520px] rounded-full bg-[#f7eed0] blur-3xl" />

        <div className="relative mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Reveal>
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-[#7b2ee8] shadow-[0_16px_45px_rgba(111,39,190,0.08)]">
                <Sparkles className="h-4 w-4" />
                מערכת SaaS לעסקים בצמיחה
              </p>

              <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.075em] sm:text-7xl">
                לא עוד כלי אחד. מערכת הפעלה מלאה לעסק.
              </h2>

              <div className="mt-7 space-y-5 text-lg font-semibold leading-9 text-[#6b587c]">
                <p>
                  Bizuply נבנתה כדי לרכז את כל מה שבעל עסק מתעסק איתו ביום־יום:
                  לידים, לקוחות, יומן, תורים, אתר, דפי נחיתה, אוטומציות, AI,
                  שיתופי פעולה ושירותים אנושיים.
                </p>

                <p>
                  לפני בניית המערכת בדקנו תהליכים, צרכים והרגלי עבודה של עסקים
                  בשווקים שונים בעולם — כדי להבין איפה הם מאבדים זמן, כסף ופניות.
                </p>

                <p className="font-black text-[#2a103c]">
                  המטרה פשוטה: פחות עומס, יותר סדר, תגובה מהירה יותר ללידים
                  ותשתית שנראית כמו עסק גדול גם כשהצוות עדיין קטן.
                </p>
              </div>
            </div>
          </Reveal>

          <SaaSDashboardMockup />
        </div>
      </section>

      <FlowSection />

      <section className="bg-white px-5 py-24 text-[#2a103c] lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-[#f3eaff] px-4 py-2 text-xs font-black text-[#7b2ee8]">
                  מה יש בפנים
                </p>
                <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.075em] sm:text-7xl">
                  כל מודול עובד לבד — וביחד זה מרגיש כמו מכונה.
                </h2>
              </div>

              <p className="text-lg font-semibold leading-9 text-[#6b587c]">
                במקום לפצל בין אתר, לידים, וואטסאפ, יומן, קמפיינים, טבלאות
                ותזכורות — Bizuply מחברת הכל למקום אחד, עם תנועה ברורה בין
                פנייה, טיפול, פגישה וסגירה.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {systemFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <Reveal key={feature.title} delay={index * 0.045}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.012 }}
                    transition={{ duration: 0.25 }}
                    className="group relative h-full overflow-hidden rounded-[32px] border border-[#eadcff] bg-[#fbf8ff] p-6 shadow-[0_18px_50px_rgba(111,39,190,0.05)]"
                  >
                    <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-[#eadbff] opacity-0 blur-2xl transition group-hover:opacity-100" />

                    <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-[#2a103c] text-[#f3dda5] shadow-[0_16px_42px_rgba(42,16,60,0.16)] transition group-hover:rotate-3 group-hover:scale-105">
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="relative mt-6 text-2xl font-black tracking-[-0.055em] text-[#2a103c]">
                      {feature.title}
                    </h3>

                    <p className="relative mt-3 text-sm font-semibold leading-7 text-[#6b587c]">
                      {feature.text}
                    </p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#fbf8ff] px-5 py-24 text-[#2a103c] lg:px-8">
        <div className="pointer-events-none absolute left-[-10%] top-[-12%] h-[520px] w-[520px] rounded-full bg-[#eadbff] blur-3xl" />

        <div className="relative mx-auto max-w-[1440px]">
          <Reveal>
            <div className="mx-auto mb-14 max-w-4xl text-center">
              <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-[#7b2ee8] shadow-[0_14px_38px_rgba(111,39,190,0.06)]">
                שכבת שירותים אנושית
              </p>
              <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.075em] sm:text-7xl">
                כי לא כל דבר פותרים עם כפתור.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-9 text-[#6b587c]">
                לצד המערכת, אפשר להיעזר בשירותים אנושיים ושיתופי פעולה שעוזרים
                לעסק להגיב מהר יותר, להתנהל מסודר יותר ולהיראות מקצועי יותר.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {humanServices.map((service, index) => {
              const Icon = service.icon;

              return (
                <Reveal key={service.title} delay={index * 0.06}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="biz-float-soft h-full rounded-[32px] border border-[#eadcff] bg-white p-6 shadow-[0_18px_55px_rgba(111,39,190,0.06)]"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f1e7ff] text-[#7b2ee8]">
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="mt-6 text-2xl font-black tracking-[-0.055em] text-[#2a103c]">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-sm font-semibold leading-7 text-[#6b587c]">
                      {service.text}
                    </p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#11071b] px-5 py-24 text-white lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1fr_0.95fr]">
          <Reveal>
            <div className="h-full rounded-[38px] border border-white/10 bg-white/[0.055] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:p-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f3dda5] text-[#2a103c]">
                  <Users className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#f3dda5]">
                    למי זה מתאים?
                  </p>
                  <p className="text-3xl font-black tracking-[-0.055em] text-white">
                    לעסקים שרוצים להיראות ולעבוד גדול יותר
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
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4"
                  >
                    <Check className="mt-1 h-5 w-5 shrink-0 text-[#f3dda5]" />
                    <p className="font-bold leading-7 text-[#ddd0ef]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-[38px] border border-[#f3dda5]/18 bg-gradient-to-br from-white/[0.09] to-[#7b2ee8]/12 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.28)] lg:p-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.10] text-[#f3dda5]">
                  <Rocket className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#f3dda5]">
                    מה מקבלים בהרשמה?
                  </p>
                  <p className="text-3xl font-black tracking-[-0.055em] text-white">
                    יתרון לפני כולם
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {launchBenefits.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.065] p-4"
                  >
                    <Star className="mt-1 h-5 w-5 shrink-0 fill-[#f3dda5] text-[#f3dda5]" />
                    <p className="font-bold leading-7 text-[#ddd0ef]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-5 py-24 text-[#2a103c] lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <div className="mb-12 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-[#f3eaff] px-4 py-2 text-xs font-black text-[#7b2ee8]">
                  איך זה עובד
                </p>
                <h2 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.075em] sm:text-7xl">
                  שלושה צעדים ואתם ברשימה.
                </h2>
              </div>

              <p className="max-w-xl text-lg font-semibold leading-8 text-[#6b587c]">
                ההרשמה לא מחייבת רכישה. היא שומרת לכם מקום לקבלת עדכונים,
                הצצה ראשונה ומחירי השקה כשהקבוצה תיפתח.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.08}>
                <div className="relative h-full overflow-hidden rounded-[34px] border border-[#eadcff] bg-[#fbf8ff] p-8 shadow-[0_18px_50px_rgba(111,39,190,0.05)]">
                  <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[#ead7ff] blur-2xl" />
                  <p className="relative text-6xl font-black tracking-[-0.08em] text-[#d2b0fb]">
                    {step.number}
                  </p>
                  <h3 className="relative mt-8 text-3xl font-black tracking-[-0.055em] text-[#2a103c]">
                    {step.title}
                  </h3>
                  <p className="relative mt-3 font-semibold leading-8 text-[#6b587c]">
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
        className="relative isolate overflow-hidden bg-[#fbf8ff] px-5 py-24 text-[#2a103c] lg:px-8"
      >
        <div className="absolute left-0 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#ead7ff] blur-3xl" />
        <div className="absolute bottom-0 right-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#f7eed0] blur-3xl" />

        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Reveal>
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-[#7b2ee8] shadow-[0_12px_34px_rgba(111,39,190,0.06)]">
                <Clock3 className="h-4 w-4" />
                הרשמה מוקדמת פתוחה
              </p>

              <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.075em] text-[#2a103c] sm:text-7xl">
                רוצים להיות בין הראשונים שמקבלים מחיר השקה וגישה ראשונה למערכת?
              </h2>

              <p className="mt-6 max-w-xl text-lg font-semibold leading-9 text-[#6b587c]">
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
                      className="flex items-center gap-3 rounded-2xl border border-[#eadcff] bg-white p-4 shadow-[0_14px_38px_rgba(111,39,190,0.05)]"
                    >
                      <TypedIcon className="h-5 w-5 text-[#7b2ee8]" />
                      <span className="font-black text-[#2a103c]">
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
              className="rounded-[38px] border border-[#eadcff] bg-white p-4 shadow-[0_28px_80px_rgba(111,39,190,0.08)] sm:p-6 lg:p-8"
            >
              {sent ? (
                <div className="grid min-h-[520px] place-items-center text-center">
                  <div>
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#f3e8ff] text-[#7b2ee8]">
                      <Check className="h-10 w-10" />
                    </div>
                    <h3 className="mt-6 text-4xl font-black tracking-[-0.06em] text-[#2a103c]">
                      נרשמת בהצלחה
                    </h3>
                    <p className="mx-auto mt-4 max-w-md text-base font-semibold leading-8 text-[#6b587c]">
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
                  <div className="mb-6 rounded-[30px] border border-[#eadcff] bg-[#fbf8ff] p-5">
                    <p className="text-sm font-black text-[#7b2ee8]">
                      הרשמה מוקדמת
                    </p>
                    <h3 className="mt-2 text-4xl font-black leading-none tracking-[-0.06em] text-[#2a103c]">
                      הצטרפות לרשימת הראשונים
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-7 text-[#6b587c]">
                      מלאו פרטים ונעדכן כשקבוצת הוואטסאפ תיפתח.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-black text-[#2a103c]">
                        שם מלא
                      </span>
                      <input
                        value={form.name}
                        onChange={(event) =>
                          updateField("name", event.target.value)
                        }
                        placeholder="איך קוראים לך?"
                        className="min-h-14 w-full rounded-2xl border border-[#eadcff] bg-white px-5 text-base font-bold text-[#2a103c] outline-none transition placeholder:text-[#b39ccf] focus:border-[#7b2ee8] focus:ring-4 focus:ring-[#f0e3ff]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-black text-[#2a103c]">
                        טלפון / וואטסאפ
                      </span>
                      <input
                        value={form.phone}
                        onChange={(event) =>
                          updateField("phone", event.target.value)
                        }
                        placeholder="מספר לקבלת הזמנה לקבוצה"
                        inputMode="tel"
                        className="min-h-14 w-full rounded-2xl border border-[#eadcff] bg-white px-5 text-base font-bold text-[#2a103c] outline-none transition placeholder:text-[#b39ccf] focus:border-[#7b2ee8] focus:ring-4 focus:ring-[#f0e3ff]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-black text-[#2a103c]">
                        שם העסק
                      </span>
                      <input
                        value={form.business}
                        onChange={(event) =>
                          updateField("business", event.target.value)
                        }
                        placeholder="שם העסק / התחום שלך"
                        className="min-h-14 w-full rounded-2xl border border-[#eadcff] bg-white px-5 text-base font-bold text-[#2a103c] outline-none transition placeholder:text-[#b39ccf] focus:border-[#7b2ee8] focus:ring-4 focus:ring-[#f0e3ff]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-black text-[#2a103c]">
                        מה הכי מעניין אותך?
                      </span>
                      <select
                        value={form.interest}
                        onChange={(event) =>
                          updateField("interest", event.target.value)
                        }
                        className="min-h-14 w-full rounded-2xl border border-[#eadcff] bg-white px-5 text-base font-bold text-[#2a103c] outline-none transition focus:border-[#7b2ee8] focus:ring-4 focus:ring-[#f0e3ff]"
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

      <section className="bg-white px-5 py-24 text-[#2a103c] lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div>
              <p className="mb-4 inline-flex rounded-full bg-[#f3eaff] px-4 py-2 text-xs font-black text-[#7b2ee8]">
                שאלות נפוצות
              </p>
              <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.075em] sm:text-7xl">
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
                  className="w-full rounded-[28px] border border-[#eadcff] bg-[#fbf8ff] p-5 text-right transition hover:bg-white hover:shadow-[0_16px_40px_rgba(111,39,190,0.06)]"
                >
                  <div className="flex items-center justify-between gap-5">
                    <h3 className="text-xl font-black tracking-[-0.04em] text-[#2a103c]">
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
                    <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-[#6b587c]">
                      {faq.a}
                    </p>
                  ) : null}
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#eadcff] bg-[#fbf8ff] px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-5 md:flex-row">
          <img
            src={LOGO_SRC}
            alt="Bizuply"
            className="h-auto w-[190px] object-contain"
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