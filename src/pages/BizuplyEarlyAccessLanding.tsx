import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  CalendarCheck,
  Check,
  ChevronDown,
  Clock3,
  Crown,
  Handshake,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  MousePointerClick,
  Phone,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Users,
  Wand2,
  Zap,
} from "lucide-react";

type LeadForm = {
  name: string;
  phone: string;
  business: string;
  interest: string;
};

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const LOGO_CANDIDATES = [
  "/images/bizuply-logo.svg",
  "/images/logo.svg",
  "/bizuply-logo.svg",
  "/logo.svg",
  "/logo.png",
  "/bizuply-logo.png",
];

const headline = "מה אם כל מה שעסק צריך היה עובד במקום אחד?";

const systemFeatures: Array<{
  icon: IconType;
  title: string;
  text: string;
}> = [
  {
    icon: LayoutDashboard,
    title: "CRM לניהול לקוחות ולידים",
    text: "ניהול פניות, לקוחות, סטטוסים, משימות ומעקב במקום אחד — בלי לאבד לידים בדרך.",
  },
  {
    icon: MessageCircle,
    title: "ניהול לידים ישירות ממטא",
    text: "פניות מקמפיינים בפייסבוק ואינסטגרם נכנסות למערכת מסודרת, עם המשך טיפול מהיר וברור.",
  },
  {
    icon: CalendarCheck,
    title: "תיאום פגישות, יומן ותורים",
    text: "ניהול זמינות, תורים, פגישות ותזכורות בצורה שמתאימה לעסקים שעובדים עם לקוחות כל יום.",
  },
  {
    icon: Store,
    title: "אתר מקצועי, דפי נחיתה וחנות",
    text: "בניית נוכחות דיגיטלית לעסק, כולל אתר, יומן, חנות, דפי נחיתה ותשתית שמוכנה לצמיחה.",
  },
  {
    icon: Zap,
    title: "אוטומציות חכמות",
    text: "פחות עבודה ידנית, יותר תהליכים שעובדים בשבילכם: תזכורות, מענה, מעקב ופעולות חוזרות.",
  },
  {
    icon: Bot,
    title: "יועץ AI חכם",
    text: "עזרה בקבלת החלטות, ניסוח תוכן, רעיונות, סדר, פעולות שיווקיות וניהול הפעילות השוטפת.",
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
    text: "אנשי מכירות שיעזרו להגיב מהר יותר לפניות חמות ולהגדיל את הסיכוי לסגירה.",
  },
  {
    icon: CalendarCheck,
    title: "אישורי הגעה לפגישות",
    text: "וידוא הגעה, תזכורות, מעקב והפחתת ביטולים או אי־הופעות.",
  },
  {
    icon: Clock3,
    title: "מילוי תורים שבוטלו",
    text: "ריכוז רשימות המתנה וניסיון למלא זמנים שהתפנו כדי לצמצם הפסדים.",
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
  "אפשרות להכיר גם את המערכת וגם את השירותים האנושיים",
];

const steps = [
  {
    number: "01",
    title: "משאירים פרטים",
    text: "שם, טלפון וסוג העסק — כדי שנדע למי לשלוח את העדכונים הראשונים.",
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
    a: "ביזאפלי היא מערכת ושירות לעסקים שמרכזים CRM, לידים, אתר, דפי נחיתה, אוטומציות, יומן, חנות, AI ושירותים אנושיים שמורידים עומס אמיתי מבעל העסק.",
  },
  {
    q: "זה רק בונה אתרים?",
    a: "לא. האתר הוא רק חלק מהמערכת. המטרה היא לעזור לעסק לקבל פניות, לנהל אותן, להגיב מהר יותר, לחסוך זמן ולצמוח.",
  },
  {
    q: "מה הכוונה שירותים אנושיים?",
    a: "מעבר לטכנולוגיה, יהיו שירותים כמו מענה ללידים, אישורי הגעה, מילוי תורים שבוטלו, קמפיינים, פוסטים ועוד פעולות שמורידות עומס מבעל העסק.",
  },
  {
    q: "מה מקבלים בהרשמה מוקדמת?",
    a: "נרשמים מוקדמים יקבלו עדכונים ראשונים, הזמנה לקבוצת וואטסאפ שתיפתח בקרוב ומחירי השקה לקבוצה בלבד.",
  },
  {
    q: "ההרשמה מחייבת רכישה?",
    a: "לא. ההרשמה שומרת לכם מקום לקבלת פרטים ועדכונים לפני כולם.",
  },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
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
      initial={{ opacity: 0, y: 34, scale: 0.98 }}
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

function BrandLogo({ light = true }: { light?: boolean }) {
  const [logoIndex, setLogoIndex] = useState(0);
  const [logoFailed, setLogoFailed] = useState(false);

  const logoSrc = LOGO_CANDIDATES[logoIndex];

  function handleLogoError() {
    if (logoIndex < LOGO_CANDIDATES.length - 1) {
      setLogoIndex((current) => current + 1);
      return;
    }

    setLogoFailed(true);
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={cx(
          "grid h-12 w-12 place-items-center overflow-hidden rounded-2xl shadow-2xl",
          light
            ? "bg-white text-[#6d28d9] shadow-purple-950/25"
            : "bg-[#12081f] text-white shadow-purple-950/10",
        )}
      >
        {!logoFailed ? (
          <img
            src={logoSrc}
            alt="Bizuply"
            onError={handleLogoError}
            className="h-8 w-8 object-contain"
          />
        ) : (
          <span className="text-xl font-black">B</span>
        )}
      </div>

      <div>
        <p
          className={cx(
            "text-2xl font-black leading-none tracking-[-0.05em]",
            light ? "text-white" : "text-[#16091f]",
          )}
        >
          Bizuply
        </p>
        <p
          className={cx(
            "mt-1 text-xs font-bold",
            light ? "text-white/50" : "text-zinc-500",
          )}
        >
          מערכת ושירותים לעסקים
        </p>
      </div>
    </div>
  );
}

function FallingHeadline() {
  let charIndex = 0;

  return (
    <h1
      aria-label={headline}
      className="max-w-6xl text-5xl font-black leading-[0.9] tracking-[-0.075em] sm:text-7xl lg:text-8xl xl:text-[7.6rem]"
    >
      {headline.split(" ").map((word, wordIndex) => (
        <React.Fragment key={`${word}-${wordIndex}`}>
          <span className="inline-flex whitespace-nowrap">
            {Array.from(word).map((letter, letterIndex) => {
              const delay = 0.12 + charIndex * 0.035;
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
          {wordIndex < headline.split(" ").length - 1 ? (
            <span className="inline-block w-3 sm:w-5" />
          ) : null}
        </React.Fragment>
      ))}
    </h1>
  );
}

function HeroSystemVisual() {
  const items = [
    {
      title: "ליד חדש ממטא",
      text: "ממתין למענה מהיר",
      icon: MessageCircle,
    },
    {
      title: "פגישה נקבעה",
      text: "תזכורת נשלחה ללקוח",
      icon: CalendarCheck,
    },
    {
      title: "קמפיין פעיל",
      text: "מעקב אחרי תוצאות",
      icon: Megaphone,
    },
  ];

  return (
    <div className="relative min-h-[620px]">
      <div className="biz-orbit absolute left-1/2 top-8 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-white/10 opacity-70">
        <div className="absolute right-14 top-10 h-4 w-4 rounded-full bg-fuchsia-300 shadow-[0_0_40px_rgba(217,70,239,0.9)]" />
        <div className="absolute bottom-20 left-10 h-3 w-3 rounded-full bg-purple-300 shadow-[0_0_40px_rgba(168,85,247,0.9)]" />
      </div>

      <div className="biz-split-wrap absolute right-0 top-4 w-[86%] max-w-[720px] rounded-[36px] border border-white/10 bg-white/10 p-4 shadow-2xl shadow-purple-950/40 backdrop-blur-2xl">
        <div className="biz-split-stage relative overflow-hidden rounded-[30px] bg-[#12081f] p-5">
          <div className="biz-panel biz-panel-right" />
          <div className="biz-panel biz-panel-left" />

          <div className="relative z-10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-purple-200">
                  Bizuply System
                </p>
                <p className="mt-1 text-3xl font-black tracking-[-0.06em] text-white">
                  מרכז העסק שלכם
                </p>
              </div>

              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-purple-500/20 text-purple-100">
                <LayoutDashboard className="h-7 w-7" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["124", "לידים"],
                ["32", "פגישות"],
                ["18", "משימות"],
              ].map(([number, label]) => (
                <div key={label} className="rounded-2xl bg-white/10 p-4">
                  <p className="text-4xl font-black tracking-[-0.07em] text-white">
                    {number}
                  </p>
                  <p className="mt-1 text-xs font-bold text-white/45">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {items.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-purple-100">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-black text-white">{item.title}</p>
                        <p className="mt-1 text-sm text-white/45">
                          {item.text}
                        </p>
                      </div>
                    </div>

                    <Check className="h-5 w-5 text-emerald-300" />
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_0.8fr]">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/30 to-fuchsia-500/20 p-5">
                <p className="text-sm font-bold text-purple-100">
                  יועץ AI חכם
                </p>
                <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">
                  מה כדאי לעשות עם הלידים של השבוע?
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 text-[#170a2b]">
                <p className="text-sm font-black text-purple-700">
                  קבוצת וואטסאפ
                </p>
                <p className="mt-2 text-xl font-black tracking-[-0.05em]">
                  תיפתח בקרוב
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  מחיר השקה לקבוצה בלבד.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="biz-float-a absolute bottom-20 left-0 w-[58%] rounded-[30px] border border-white/10 bg-white p-5 text-[#170a2b] shadow-2xl shadow-purple-950/25">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-100 text-purple-700">
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-black">מחירי השקה</p>
            <p className="text-sm font-bold text-zinc-500">לקבוצה בלבד</p>
          </div>
        </div>
        <p className="text-sm leading-7 text-zinc-600">
          הנרשמים הראשונים יקבלו את כל הפרטים וההטבות לפני פתיחה רחבה.
        </p>
      </div>

      <div className="biz-float-b absolute bottom-4 right-12 w-[46%] rounded-[30px] border border-white/10 bg-gradient-to-br from-purple-500 to-fuchsia-500 p-5 shadow-2xl shadow-fuchsia-950/35">
        <Rocket className="mb-4 h-8 w-8 text-white" />
        <p className="text-2xl font-black leading-tight text-white">
          גישה ראשונה למערכת
        </p>
        <p className="mt-2 text-sm leading-6 text-white/75">
          לפני כולם, עם עדכונים בקבוצת וואטסאפ.
        </p>
      </div>
    </div>
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
      כאן אפשר לחבר לשרת:

      await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    */
  }

  return (
    <main dir="rtl" className="min-h-screen overflow-x-hidden bg-[#08030e] text-white">
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .biz-hero-bg {
          background:
            radial-gradient(circle at 20% 14%, rgba(168, 85, 247, 0.34), transparent 32%),
            radial-gradient(circle at 84% 10%, rgba(236, 72, 153, 0.22), transparent 30%),
            radial-gradient(circle at 46% 86%, rgba(59, 130, 246, 0.15), transparent 36%),
            linear-gradient(180deg, #08030e 0%, #14061f 54%, #f7f2ff 54%, #ffffff 100%);
        }

        .biz-letter {
          opacity: 0;
          transform: translate3d(0, -115px, 0) rotate(-10deg) scale(0.92);
          transform-origin: 50% 100%;
          animation: bizLetterDrop 0.78s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          text-shadow: 0 18px 55px rgba(168, 85, 247, 0.22);
        }

        .biz-split-stage::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(circle at 22% 18%, rgba(168, 85, 247, 0.22), transparent 32%),
            radial-gradient(circle at 82% 22%, rgba(236, 72, 153, 0.14), transparent 34%),
            linear-gradient(135deg, rgba(255,255,255,0.06), transparent 48%);
        }

        .biz-panel {
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 4;
          width: 50%;
          background:
            radial-gradient(circle at 50% 20%, rgba(255,255,255,0.22), transparent 34%),
            linear-gradient(135deg, rgba(168,85,247,0.78), rgba(236,72,153,0.42), rgba(15,8,28,0.92));
          backdrop-filter: blur(18px);
          opacity: 0.92;
          animation-duration: 1.05s;
          animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
          animation-fill-mode: forwards;
          animation-delay: 1.05s;
        }

        .biz-panel-right {
          right: 50%;
          border-left: 1px solid rgba(255,255,255,0.2);
          transform: translateX(-115%);
          animation-name: bizPanelRightClose;
        }

        .biz-panel-left {
          left: 50%;
          border-right: 1px solid rgba(255,255,255,0.2);
          transform: translateX(115%);
          animation-name: bizPanelLeftClose;
        }

        .biz-split-wrap {
          animation: bizVisualEnter 1s cubic-bezier(0.19, 1, 0.22, 1) both;
          animation-delay: 0.55s;
        }

        .biz-orbit {
          animation: bizOrbit 18s linear infinite;
        }

        .biz-float-a {
          animation: bizFloatA 7s ease-in-out infinite;
        }

        .biz-float-b {
          animation: bizFloatB 8s ease-in-out infinite;
        }

        .biz-card-shine {
          position: relative;
          overflow: hidden;
        }

        .biz-card-shine::after {
          content: "";
          position: absolute;
          inset: -90%;
          background: linear-gradient(120deg, transparent 38%, rgba(255,255,255,0.26), transparent 62%);
          transform: translateX(-70%) rotate(16deg);
          animation: bizShine 5s ease-in-out infinite;
        }

        @keyframes bizLetterDrop {
          0% {
            opacity: 0;
            transform: translate3d(0, -115px, 0) rotate(-10deg) scale(0.92);
            filter: blur(10px);
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

        @keyframes bizPanelRightClose {
          from {
            transform: translateX(-115%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes bizPanelLeftClose {
          from {
            transform: translateX(115%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes bizVisualEnter {
          from {
            opacity: 0;
            transform: translate3d(0, 42px, 0) scale(0.94);
            filter: blur(16px);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes bizOrbit {
          from {
            transform: translateX(-50%) rotate(0deg);
          }
          to {
            transform: translateX(-50%) rotate(360deg);
          }
        }

        @keyframes bizFloatA {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(-1deg);
          }
          50% {
            transform: translate3d(0, -18px, 0) rotate(1deg);
          }
        }

        @keyframes bizFloatB {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(1deg);
          }
          50% {
            transform: translate3d(0, 14px, 0) rotate(-1deg);
          }
        }

        @keyframes bizShine {
          0%, 42% {
            transform: translateX(-70%) rotate(16deg);
          }
          72%, 100% {
            transform: translateX(70%) rotate(16deg);
          }
        }

        @media (max-width: 1023px) {
          .biz-panel {
            animation-delay: 0.65s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .biz-letter,
          .biz-panel,
          .biz-split-wrap,
          .biz-orbit,
          .biz-float-a,
          .biz-float-b,
          .biz-card-shine::after {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>

      <section className="biz-hero-bg relative isolate min-h-screen overflow-hidden">
        <header className="relative z-20 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 lg:px-8">
          <BrandLogo />

          <a
            href="#early-access"
            className="biz-card-shine hidden rounded-full bg-white px-6 py-3 text-sm font-black text-[#170a2b] shadow-2xl shadow-purple-950/20 transition hover:-translate-y-0.5 hover:bg-purple-100 md:inline-flex"
          >
            הרשמה מוקדמת
          </a>
        </header>

        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 pb-20 pt-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-8 lg:pb-28 lg:pt-16">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-purple-100 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-fuchsia-200" />
              הרשמה מוקדמת לפני פתיחה בישראל
            </div>

            <FallingHeadline />

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.45, duration: 0.7 }}
              className="mt-8 max-w-2xl text-lg leading-9 text-white/75"
            >
              מערכת CRM לניהול לקוחות ולידים, ניהול לידים ישירות ממטא,
              תיאום פגישות, אוטומציות חכמות, בניית אתר מקצועי כולל יומן וחנות,
              יועץ AI חכם ושיתופי פעולה עסקיים שיכולים לפתוח לכם דלתות חדשות.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.62, duration: 0.7 }}
              className="mt-4 max-w-2xl text-xl font-black leading-9 text-white"
            >
              אבל זה לא נגמר בטכנולוגיה. אנחנו דואגים גם לצד האנושי.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.78, duration: 0.7 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#early-access"
                className="biz-card-shine inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-8 text-sm font-black text-[#170a2b] shadow-2xl shadow-purple-950/30 transition hover:-translate-y-1"
              >
                רוצה לקבל מחיר השקה
                <ArrowLeft className="h-5 w-5" />
              </a>

              <a
                href="#human"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/15 bg-white/10 px-8 text-sm font-black text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
              >
                מה השירות האנושי?
                <ChevronDown className="h-5 w-5" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.95, duration: 0.7 }}
              className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3"
            >
              {[
                ["גישה ראשונה", "לפני כולם"],
                ["מחירי השקה", "לקבוצה בלבד"],
                ["וואטסאפ", "תיפתח בקרוב"],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
                >
                  <p className="text-xl font-black">{title}</p>
                  <p className="mt-1 text-sm font-bold text-white/55">
                    {text}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <HeroSystemVisual />
        </div>
      </section>

      <section id="what-is" className="bg-white px-5 py-20 text-[#170a2b] lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-purple-50 px-4 py-2 text-xs font-black text-purple-700">
                  מי אנחנו
                </p>
                <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                  במקום לרדוף אחרי לקוחות, הודעות, תורים ופרסומים — הכל מתחבר.
                </h2>
              </div>

              <div className="space-y-5 text-lg leading-9 text-zinc-600">
                <p>
                  הרבה עסקים עובדים היום עם אתר בנפרד, לידים במקום אחר,
                  וואטסאפ פתוח, קמפיינים במטא, טבלאות, תזכורות ומעקב שלא תמיד
                  ברור.
                </p>
                <p>
                  ביזאפלי נבנתה כדי לרכז את כל הדברים החשובים לעסק במקום אחד:
                  נוכחות דיגיטלית, ניהול לידים, אוטומציות, יומן, חנות, AI
                  ושירותים אנושיים שמורידים עומס באמת.
                </p>
                <p className="font-bold text-[#170a2b]">
                  בקרוב יושק בישראל שירות חדש לעסקים, מבית חברה אמריקאית.
                  פחות עומס. יותר סדר. יותר לקוחות. יותר צמיחה.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {systemFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <Reveal key={feature.title} delay={index * 0.06}>
                  <div className="group h-full rounded-[32px] border border-purple-100 bg-[#fbf7ff] p-6 transition duration-300 hover:-translate-y-2 hover:border-purple-200 hover:bg-white hover:shadow-2xl hover:shadow-purple-950/10">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#170a2b] text-white transition group-hover:rotate-3 group-hover:scale-105">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 text-2xl font-black tracking-[-0.04em]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-600">
                      {feature.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="human" className="bg-[#f7f2ff] px-5 py-20 text-[#170a2b] lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <div className="mb-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-purple-700">
                  הצד האנושי
                </p>
                <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                  כי לא כל דבר פותרים עם כפתור.
                </h2>
              </div>

              <p className="text-lg leading-9 text-zinc-600">
                מה אם היו לכם גם שירותים אנושיים שמורידים מכם את העומס באמת?
                אישורי הגעה, ריכוז הזמנות, מילוי תורים שבוטלו, מענה מהיר
                ללידים, קמפיינים, פוסטים ועוד.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {humanServices.map((service, index) => {
              const Icon = service.icon;

              return (
                <Reveal key={service.title} delay={index * 0.07}>
                  <div className="h-full rounded-[32px] border border-purple-100 bg-white p-6 shadow-xl shadow-purple-950/5 transition hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-950/10">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-purple-100 text-purple-700">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 text-2xl font-black tracking-[-0.04em]">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-600">
                      {service.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 text-[#170a2b] lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1fr_0.9fr]">
          <Reveal>
            <div className="h-full rounded-[36px] bg-[#170a2b] p-8 text-white shadow-2xl shadow-purple-950/20 lg:p-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-purple-100">
                  <Users className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-black text-purple-200">
                    למי זה מתאים?
                  </p>
                  <p className="text-3xl font-black tracking-[-0.05em]">
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
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 p-4"
                  >
                    <Check className="mt-1 h-5 w-5 shrink-0 text-emerald-300" />
                    <p className="font-bold leading-7 text-white/85">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="h-full rounded-[36px] border border-purple-100 bg-[#fbf7ff] p-8 shadow-2xl shadow-purple-950/10 lg:p-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-purple-100 text-purple-700">
                  <Rocket className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-black text-purple-700">
                    מה מקבלים בהרשמה?
                  </p>
                  <p className="text-3xl font-black tracking-[-0.05em]">
                    יתרון לפני כולם
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {launchBenefits.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-white p-4"
                  >
                    <Star className="mt-1 h-5 w-5 shrink-0 fill-purple-600 text-purple-600" />
                    <p className="font-bold leading-7 text-zinc-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f7f2ff] px-5 py-20 text-[#170a2b] lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-purple-700">
                  איך זה עובד
                </p>
                <h2 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                  שלושה צעדים ואתם ברשימה.
                </h2>
              </div>
              <p className="max-w-xl text-lg leading-8 text-zinc-600">
                ההרשמה לא מחייבת רכישה. היא שומרת לכם מקום לקבלת עדכונים,
                הצצה ראשונה ומחירי השקה כשהקבוצה תיפתח.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.08}>
                <div className="relative h-full overflow-hidden rounded-[34px] border border-purple-100 bg-white p-8 shadow-xl shadow-purple-950/5">
                  <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-purple-200/40 blur-2xl" />
                  <p className="relative text-6xl font-black tracking-[-0.08em] text-purple-200">
                    {step.number}
                  </p>
                  <h3 className="relative mt-8 text-3xl font-black tracking-[-0.05em]">
                    {step.title}
                  </h3>
                  <p className="relative mt-3 leading-8 text-zinc-600">
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
        className="relative isolate overflow-hidden bg-[#170a2b] px-5 py-20 text-white lg:px-8"
      >
        <div className="absolute left-0 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 -z-10 h-[420px] w-[420px] rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-purple-100">
                <Clock3 className="h-4 w-4" />
                הרשמה מוקדמת פתוחה
              </p>

              <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                רוצים להיות בין הראשונים שמקבלים מחיר השקה וגישה ראשונה למערכת?
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-9 text-white/70">
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
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4"
                    >
                      <TypedIcon className="h-5 w-5 text-purple-200" />
                      <span className="font-black">{String(label)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <form
              onSubmit={handleSubmit}
              className="rounded-[36px] border border-white/10 bg-white p-4 text-[#170a2b] shadow-2xl shadow-purple-950/30 sm:p-6 lg:p-8"
            >
              {sent ? (
                <div className="grid min-h-[520px] place-items-center text-center">
                  <div>
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="h-10 w-10" />
                    </div>
                    <h3 className="mt-6 text-4xl font-black tracking-[-0.06em]">
                      נרשמת בהצלחה
                    </h3>
                    <p className="mx-auto mt-4 max-w-md text-base leading-8 text-zinc-600">
                      שמרנו את הפרטים. בקרוב נפתח קבוצת וואטסאפ ונשלח הזמנה עם
                      כל הפרטים ומחירי ההשקה.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="mt-8 rounded-full bg-[#170a2b] px-7 py-4 text-sm font-black text-white transition hover:bg-purple-900"
                    >
                      שליחת הרשמה נוספת
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6 rounded-[30px] bg-[#f7f2ff] p-5">
                    <p className="text-sm font-black text-purple-700">
                      הרשמה מוקדמת
                    </p>
                    <h3 className="mt-2 text-4xl font-black leading-none tracking-[-0.06em]">
                      הצטרפות לרשימת הראשונים
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-600">
                      מלאו פרטים ונעדכן כשקבוצת הוואטסאפ תיפתח.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-black">
                        שם מלא
                      </span>
                      <input
                        value={form.name}
                        onChange={(event) =>
                          updateField("name", event.target.value)
                        }
                        placeholder="איך קוראים לך?"
                        className="min-h-14 w-full rounded-2xl border border-purple-100 bg-white px-5 text-base font-bold outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-black">
                        טלפון / וואטסאפ
                      </span>
                      <input
                        value={form.phone}
                        onChange={(event) =>
                          updateField("phone", event.target.value)
                        }
                        placeholder="מספר לקבלת הזמנה לקבוצה"
                        inputMode="tel"
                        className="min-h-14 w-full rounded-2xl border border-purple-100 bg-white px-5 text-base font-bold outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-black">
                        שם העסק
                      </span>
                      <input
                        value={form.business}
                        onChange={(event) =>
                          updateField("business", event.target.value)
                        }
                        placeholder="שם העסק / התחום שלך"
                        className="min-h-14 w-full rounded-2xl border border-purple-100 bg-white px-5 text-base font-bold outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-black">
                        מה הכי מעניין אותך?
                      </span>
                      <select
                        value={form.interest}
                        onChange={(event) =>
                          updateField("interest", event.target.value)
                        }
                        className="min-h-14 w-full rounded-2xl border border-purple-100 bg-white px-5 text-base font-bold outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                      >
                        <option value="">בחירה</option>
                        <option value="crm">CRM וניהול לידים</option>
                        <option value="meta">לידים ממטא</option>
                        <option value="website">אתר / יומן / חנות</option>
                        <option value="human-services">שירותים אנושיים</option>
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
                        ? "biz-card-shine bg-[#170a2b] text-white shadow-xl shadow-purple-950/20 hover:-translate-y-1 hover:bg-purple-900"
                        : "cursor-not-allowed bg-zinc-200 text-zinc-400",
                    )}
                  >
                    שלחו לי פרטים והזמנה לקבוצה
                    <Phone className="h-5 w-5" />
                  </button>

                  <p className="mt-4 text-center text-xs leading-6 text-zinc-500">
                    ההרשמה לא מחייבת רכישה. מחירי ההשקה יינתנו לקבוצת ההרשמה
                    המוקדמת בלבד.
                  </p>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-5 py-20 text-[#170a2b] lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div>
              <p className="mb-4 inline-flex rounded-full bg-purple-50 px-4 py-2 text-xs font-black text-purple-700">
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
                  className="w-full rounded-3xl border border-purple-100 bg-[#fbf7ff] p-5 text-right transition hover:bg-white hover:shadow-xl hover:shadow-purple-950/10"
                >
                  <div className="flex items-center justify-between gap-5">
                    <h3 className="text-xl font-black tracking-[-0.04em]">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={cx(
                        "h-5 w-5 shrink-0 transition",
                        openFaq === index && "rotate-180",
                      )}
                    />
                  </div>

                  {openFaq === index ? (
                    <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-600">
                      {faq.a}
                    </p>
                  ) : null}
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#08030e] px-5 py-10 text-white lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <BrandLogo />

          <a
            href="#early-access"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-black text-[#170a2b] transition hover:-translate-y-1 hover:bg-purple-100"
          >
            להרשמה מוקדמת
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </div>
      </footer>
    </main>
  );
}