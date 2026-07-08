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

const LOGO_CANDIDATES = [
  "/bizuply%20logo.png",
  "/bizuply logo.png",
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
    text: "ניהול פניות, לקוחות, סטטוסים, משימות ומעקב — כדי ששום ליד לא ילך לאיבוד.",
  },
  {
    icon: MessageCircle,
    title: "ניהול לידים ישירות ממטא",
    text: "לידים מקמפיינים בפייסבוק ובאינסטגרם נכנסים למקום מסודר, עם המשך טיפול ברור ומהיר.",
  },
  {
    icon: CalendarCheck,
    title: "תיאום פגישות, יומן ותורים",
    text: "ניהול פגישות, תורים, זמינות ותזכורות בצורה פשוטה שמתאימה לעסק אמיתי.",
  },
  {
    icon: Zap,
    title: "אוטומציות חכמות",
    text: "פחות עבודה ידנית, יותר פעולות שעובדות בשבילכם מאחורי הקלעים — מענה, תזכורות, מעקב ותהליכים.",
  },
  {
    icon: Store,
    title: "אתר מקצועי, דפי נחיתה וחנות",
    text: "בניית נוכחות דיגיטלית לעסק, כולל אתר, יומן, חנות ודפי נחיתה שמוכנים לצמיחה.",
  },
  {
    icon: Bot,
    title: "יועץ AI חכם",
    text: "עזרה חכמה בתוכן, רעיונות, סדר, משימות, מכירות והחלטות יומיומיות לעסק.",
  },
  {
    icon: Handshake,
    title: "שיתופי פעולה עסקיים",
    text: "חיבורים עסקיים שיכולים לפתוח הזדמנויות חדשות ולחזק את הצמיחה של העסק.",
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
    text: "אנשי מכירות שעוזרים להגיב מהר יותר לפניות ולהגדיל את הסיכוי לסגירה.",
  },
  {
    icon: CalendarCheck,
    title: "אישורי הגעה לפגישות",
    text: "וידוא הגעה, תזכורות ומעקב מסודר כדי להפחית ביטולים ואי־הופעות.",
  },
  {
    icon: Clock3,
    title: "מילוי תורים שבוטלו",
    text: "עזרה בריכוז רשימות המתנה וניסיון למלא זמנים שהתפנו.",
  },
  {
    icon: Megaphone,
    title: "קמפיינים ופוסטים",
    text: "הקמת קמפיינים ממומנים, מעקב אחריהם והכנת פוסטים לרשתות החברתיות.",
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
    a: "ביזאפלי היא מערכת ושירות לעסקים שמרכזים CRM, לידים, אתר, דפי נחיתה, אוטומציות, יומן, חנות, AI ושירותים אנושיים שמורידים עומס אמיתי מבעל העסק.",
  },
  {
    q: "זה רק בונה אתרים?",
    a: "לא. האתר הוא רק חלק מהמערכת. המטרה היא לעזור לעסק לקבל פניות, לנהל אותן, להגיב מהר יותר, לחסוך זמן ולצמוח.",
  },
  {
    q: "מה הכוונה שירותים אנושיים?",
    a: "מעבר לטכנולוגיה, יהיו שירותים כמו מענה ללידים, אישורי הגעה, מילוי תורים שבוטלו, קמפיינים, פוסטים ועוד פעולות שמורידות עומס אמיתי מבעל העסק.",
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

function BrandLogo() {
  const [logoIndex, setLogoIndex] = useState(0);
  const [logoFailed, setLogoFailed] = useState(false);

  const logoSrc = LOGO_CANDIDATES[logoIndex];

  function handleError() {
    if (logoIndex < LOGO_CANDIDATES.length - 1) {
      setLogoIndex((current) => current + 1);
      return;
    }

    setLogoFailed(true);
  }

  return (
    <div className="flex items-center justify-start">
      <div className="rounded-[24px] border border-white/50 bg-white/90 px-5 py-3 shadow-[0_18px_55px_rgba(72,29,110,0.12)] backdrop-blur-xl">
        {!logoFailed ? (
          <img
            src={logoSrc}
            alt="Bizuply"
            onError={handleError}
            className="h-10 w-auto object-contain md:h-12"
          />
        ) : (
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#6d28d9] text-white">
              <span className="text-xl font-black">B</span>
            </div>
            <div>
              <p className="text-2xl font-black leading-none tracking-[-0.05em] text-[#2f0f52]">
                Bizuply
              </p>
              <p className="mt-1 text-xs font-bold text-[#6b5b80]">
                מערכת ושירותים לעסקים
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FallingHeadline() {
  let charIndex = 0;
  const words = headline.split(" ");

  return (
    <h1
      aria-label={headline}
      className="max-w-6xl text-5xl font-black leading-[0.9] tracking-[-0.075em] text-[#351458] sm:text-7xl lg:text-8xl xl:text-[7.2rem]"
    >
      {words.map((word, wordIndex) => (
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

          {wordIndex < words.length - 1 ? (
            <span className="inline-block w-3 sm:w-5" />
          ) : null}
        </React.Fragment>
      ))}
    </h1>
  );
}

function HeroSystemVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[720px]">
      <div className="biz-orbit absolute left-1/2 top-6 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-[#cdaef1]/30 opacity-80">
        <div className="absolute right-14 top-10 h-4 w-4 rounded-full bg-[#c78cf0] shadow-[0_0_30px_rgba(199,140,240,0.7)]" />
        <div className="absolute bottom-20 left-10 h-3 w-3 rounded-full bg-[#8d65e6] shadow-[0_0_30px_rgba(141,101,230,0.7)]" />
      </div>

      <div className="biz-split-wrap relative rounded-[38px] border border-white/35 bg-white/18 p-4 shadow-[0_35px_100px_rgba(68,20,110,0.18)] backdrop-blur-2xl">
        <div className="biz-split-stage relative overflow-hidden rounded-[30px] border border-white/40 bg-[#f2e8ff] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          <div className="biz-panel biz-panel-right" />
          <div className="biz-panel biz-panel-left" />

          <div className="relative z-10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#8d5cd6]">
                  Bizuply System
                </p>
                <p className="mt-1 text-3xl font-black tracking-[-0.06em] text-[#2f0f52]">
                  מרכז העסק שלכם
                </p>
              </div>

              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#7a3fd0] shadow-[0_14px_32px_rgba(109,40,217,0.12)]">
                <LayoutDashboard className="h-7 w-7" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["124", "לידים"],
                ["32", "פגישות"],
                ["18", "משימות"],
              ].map(([number, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/50 bg-white/80 p-4 shadow-[0_12px_30px_rgba(72,29,110,0.06)]"
                >
                  <p className="text-4xl font-black tracking-[-0.07em] text-[#351458]">
                    {number}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#7b6796]">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {[
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
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/45 bg-white/75 p-4 shadow-[0_10px_24px_rgba(72,29,110,0.05)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f4ecff] text-[#7a3fd0]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-black text-[#351458]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-[#77658f]">
                          {item.text}
                        </p>
                      </div>
                    </div>

                    <Check className="h-5 w-5 text-[#7a3fd0]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 -mt-7 grid gap-4 px-4 sm:grid-cols-2">
        <div className="rounded-[26px] border border-white/60 bg-white/92 p-5 shadow-[0_20px_60px_rgba(72,29,110,0.1)] backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f4ecff] text-[#7a3fd0]">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-black text-[#351458]">
                מחירי השקה
              </p>
              <p className="text-sm font-bold text-[#7b6796]">
                לקבוצה בלבד
              </p>
            </div>
          </div>
          <p className="text-sm leading-7 text-[#6f5f84]">
            הנרשמים הראשונים יקבלו את כל הפרטים וההטבות לפני פתיחה רחבה.
          </p>
        </div>

        <div className="rounded-[26px] border border-[#e2cdfd] bg-gradient-to-br from-[#f5ebff] to-[#ead9ff] p-5 shadow-[0_20px_60px_rgba(109,40,217,0.08)]">
          <div className="mb-3 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#7a3fd0]">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-black text-[#351458]">
                גישה ראשונה למערכת
              </p>
              <p className="text-sm font-bold text-[#7b6796]">
                לפני כולם
              </p>
            </div>
          </div>
          <p className="text-sm leading-7 text-[#6f5f84]">
            בקרוב תיפתח קבוצת וואטסאפ עם כל הפרטים, העדכונים והמחירים.
          </p>
        </div>
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
      כאן תחברי לשרת שלך:

      await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    */
  }

  return (
    <main dir="rtl" className="min-h-screen overflow-x-hidden bg-[#faf7ff] text-[#351458]">
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .biz-hero-bg {
          background:
            radial-gradient(circle at 18% 12%, rgba(173, 123, 255, 0.32), transparent 30%),
            radial-gradient(circle at 84% 14%, rgba(255, 123, 185, 0.18), transparent 28%),
            linear-gradient(180deg, #f3e8ff 0%, #f8f3ff 44%, #ffffff 100%);
        }

        .biz-letter {
          opacity: 0;
          transform: translate3d(0, -110px, 0) rotate(-10deg) scale(0.92);
          transform-origin: 50% 100%;
          animation: bizLetterDrop 0.78s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        .biz-split-stage::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(circle at 18% 18%, rgba(173,123,255,0.18), transparent 30%),
            radial-gradient(circle at 80% 20%, rgba(255,123,185,0.12), transparent 26%),
            linear-gradient(135deg, rgba(255,255,255,0.45), transparent 45%);
        }

        .biz-panel {
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 4;
          width: 50%;
          background:
            linear-gradient(135deg, rgba(173,123,255,0.72), rgba(233,183,255,0.55), rgba(255,255,255,0.35));
          backdrop-filter: blur(16px);
          opacity: 0.95;
          animation-duration: 1.05s;
          animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
          animation-fill-mode: forwards;
          animation-delay: 1.05s;
        }

        .biz-panel-right {
          right: 50%;
          border-left: 1px solid rgba(255,255,255,0.35);
          transform: translateX(-115%);
          animation-name: bizPanelRightClose;
        }

        .biz-panel-left {
          left: 50%;
          border-right: 1px solid rgba(255,255,255,0.35);
          transform: translateX(115%);
          animation-name: bizPanelLeftClose;
        }

        .biz-split-wrap {
          animation: bizVisualEnter 0.95s cubic-bezier(0.19, 1, 0.22, 1) both;
          animation-delay: 0.5s;
        }

        .biz-orbit {
          animation: bizOrbit 18s linear infinite;
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

        @keyframes bizPanelRightClose {
          from { transform: translateX(-115%); }
          to { transform: translateX(0); }
        }

        @keyframes bizPanelLeftClose {
          from { transform: translateX(115%); }
          to { transform: translateX(0); }
        }

        @keyframes bizVisualEnter {
          from {
            opacity: 0;
            transform: translate3d(0, 42px, 0) scale(0.96);
            filter: blur(12px);
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

        @media (max-width: 1023px) {
          .biz-panel {
            animation-delay: 0.65s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .biz-letter,
          .biz-panel,
          .biz-split-wrap,
          .biz-orbit {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>

      <section className="biz-hero-bg relative isolate overflow-hidden px-5 pb-20 pt-5 lg:px-8 lg:pb-24">
        <header className="mx-auto flex max-w-[1440px] items-center justify-between gap-6">
          <a
            href="#early-access"
            className="hidden rounded-full border border-[#e1cef9] bg-white/85 px-6 py-3 text-sm font-black text-[#351458] shadow-[0_18px_40px_rgba(72,29,110,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white md:inline-flex"
          >
            הרשמה מוקדמת
          </a>

          <BrandLogo />
        </header>

        <div className="mx-auto mt-8 grid max-w-[1440px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="order-2 lg:order-1">
            <HeroSystemVisual />
          </div>

          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="rounded-[40px] border border-white/60 bg-white/88 p-6 shadow-[0_30px_90px_rgba(72,29,110,0.1)] backdrop-blur-2xl sm:p-8 lg:p-10"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#eadbff] bg-[#faf5ff] px-4 py-2 text-xs font-black text-[#7a3fd0]">
                <Sparkles className="h-4 w-4" />
                הרשמה מוקדמת לפני פתיחה בישראל
              </div>

              <FallingHeadline />

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.35, duration: 0.7 }}
                className="mt-8 max-w-2xl text-lg leading-9 text-[#6d5b84]"
              >
                מערכת CRM לניהול לקוחות ולידים, ניהול לידים ישירות ממטא,
                תיאום פגישות, אוטומציות חכמות, בניית אתר מקצועי כולל יומן וחנות,
                יועץ AI חכם ושיתופי פעולה עסקיים שיכולים לפתוח לכם דלתות חדשות.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.52, duration: 0.7 }}
                className="mt-4 max-w-2xl text-xl font-black leading-9 text-[#351458]"
              >
                אבל זה לא נגמר בטכנולוגיה. יש גם שירותים אנושיים שמורידים מכם
                את העומס באמת.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.68, duration: 0.7 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <a
                  href="#early-access"
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#6d28d9] px-8 text-sm font-black text-white shadow-[0_18px_40px_rgba(109,40,217,0.24)] transition hover:-translate-y-1 hover:bg-[#5d22be]"
                >
                  רוצה לקבל מחיר השקה
                  <ArrowLeft className="h-5 w-5" />
                </a>

                <a
                  href="#human"
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-[#e1cef9] bg-white px-8 text-sm font-black text-[#351458] transition hover:-translate-y-1"
                >
                  מה השירות האנושי?
                  <ChevronDown className="h-5 w-5" />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.85, duration: 0.7 }}
                className="mt-10 grid gap-3 sm:grid-cols-3"
              >
                {[
                  ["גישה ראשונה", "לפני כולם"],
                  ["מחירי השקה", "לקבוצה בלבד"],
                  ["וואטסאפ", "תיפתח בקרוב"],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-[26px] border border-[#efe3ff] bg-[#fbf7ff] p-5"
                  >
                    <p className="text-lg font-black text-[#351458]">
                      {title}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#7b6796]">
                      {text}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="what-is" className="bg-white px-5 py-20 text-[#351458] lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-[#f7f0ff] px-4 py-2 text-xs font-black text-[#7a3fd0]">
                  מי אנחנו
                </p>
                <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                  במקום לרדוף אחרי לקוחות, הודעות, תורים ופרסומים — הכל מתחבר.
                </h2>
              </div>

              <div className="space-y-5 text-lg leading-9 text-[#6d5b84]">
                <p>
                  הרבה עסקים עובדים היום עם אתר בנפרד, לידים במקום אחר, וואטסאפ
                  פתוח, קמפיינים במטא, טבלאות, תזכורות ומעקב שלא תמיד ברור.
                </p>
                <p>
                  ביזאפלי נבנתה כדי לרכז את כל הדברים החשובים לעסק במקום אחד:
                  נוכחות דיגיטלית, ניהול לידים, אוטומציות, יומן, חנות, AI
                  ושירותים אנושיים שמורידים עומס באמת.
                </p>
                <p className="font-bold text-[#351458]">
                  בקרוב יושק בישראל שירות חדש לעסקים, מבית חברה אמריקאית.
                  פחות עומס. יותר סדר. יותר לקוחות. יותר צמיחה.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {systemFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <Reveal key={feature.title} delay={index * 0.05}>
                  <div className="h-full rounded-[30px] border border-[#f0e4ff] bg-[#fbf7ff] p-6 transition duration-300 hover:-translate-y-2 hover:border-[#dec7ff] hover:bg-white hover:shadow-[0_24px_60px_rgba(72,29,110,0.08)]">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#6d28d9] text-white">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 text-2xl font-black tracking-[-0.04em] text-[#351458]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#6d5b84]">
                      {feature.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="human" className="bg-[#faf6ff] px-5 py-20 text-[#351458] lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <div className="mb-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-[#7a3fd0]">
                  הצד האנושי
                </p>
                <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                  כי לא כל דבר פותרים עם כפתור.
                </h2>
              </div>

              <p className="text-lg leading-9 text-[#6d5b84]">
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
                  <div className="h-full rounded-[30px] border border-[#f0e4ff] bg-white p-6 shadow-[0_12px_30px_rgba(72,29,110,0.04)] transition hover:-translate-y-2 hover:shadow-[0_24px_55px_rgba(72,29,110,0.08)]">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f5edff] text-[#7a3fd0]">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 text-2xl font-black tracking-[-0.04em] text-[#351458]">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#6d5b84]">
                      {service.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 text-[#351458] lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1fr_0.95fr]">
          <Reveal>
            <div className="h-full rounded-[36px] border border-[#eadcff] bg-[#fbf7ff] p-8 shadow-[0_24px_60px_rgba(72,29,110,0.06)] lg:p-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#6d28d9] text-white">
                  <Users className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#7a3fd0]">
                    למי זה מתאים?
                  </p>
                  <p className="text-3xl font-black tracking-[-0.05em] text-[#351458]">
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
                    className="flex items-start gap-3 rounded-2xl border border-[#eee2ff] bg-white p-4"
                  >
                    <Check className="mt-1 h-5 w-5 shrink-0 text-[#7a3fd0]" />
                    <p className="font-bold leading-7 text-[#5e4b76]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-[36px] border border-[#eadcff] bg-gradient-to-br from-[#f9f3ff] to-[#f2e8ff] p-8 shadow-[0_24px_60px_rgba(72,29,110,0.06)] lg:p-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#7a3fd0]">
                  <Rocket className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#7a3fd0]">
                    מה מקבלים בהרשמה?
                  </p>
                  <p className="text-3xl font-black tracking-[-0.05em] text-[#351458]">
                    יתרון לפני כולם
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {launchBenefits.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/90 p-4"
                  >
                    <Star className="mt-1 h-5 w-5 shrink-0 fill-[#7a3fd0] text-[#7a3fd0]" />
                    <p className="font-bold leading-7 text-[#5e4b76]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#faf6ff] px-5 py-20 text-[#351458] lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-[#7a3fd0]">
                  איך זה עובד
                </p>
                <h2 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                  שלושה צעדים ואתם ברשימה.
                </h2>
              </div>

              <p className="max-w-xl text-lg leading-8 text-[#6d5b84]">
                ההרשמה לא מחייבת רכישה. היא שומרת לכם מקום לקבלת עדכונים,
                הצצה ראשונה ומחירי השקה כשהקבוצה תיפתח.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.08}>
                <div className="relative h-full overflow-hidden rounded-[34px] border border-[#f0e4ff] bg-white p-8 shadow-[0_18px_50px_rgba(72,29,110,0.05)]">
                  <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[#eddcff] blur-2xl" />
                  <p className="relative text-6xl font-black tracking-[-0.08em] text-[#d2b6f5]">
                    {step.number}
                  </p>
                  <h3 className="relative mt-8 text-3xl font-black tracking-[-0.05em] text-[#351458]">
                    {step.title}
                  </h3>
                  <p className="relative mt-3 leading-8 text-[#6d5b84]">
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
        className="bg-white px-5 py-20 text-[#351458] lg:px-8"
      >
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Reveal>
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f7f0ff] px-4 py-2 text-xs font-black text-[#7a3fd0]">
                <Clock3 className="h-4 w-4" />
                הרשמה מוקדמת פתוחה
              </p>

              <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.07em] text-[#351458] sm:text-7xl">
                רוצים להיות בין הראשונים שמקבלים מחיר השקה וגישה ראשונה למערכת?
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-9 text-[#6d5b84]">
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
                      className="flex items-center gap-3 rounded-2xl border border-[#f0e4ff] bg-[#fbf7ff] p-4"
                    >
                      <TypedIcon className="h-5 w-5 text-[#7a3fd0]" />
                      <span className="font-black text-[#351458]">
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
              className="rounded-[36px] border border-[#eadcff] bg-[#fbf7ff] p-4 shadow-[0_28px_80px_rgba(72,29,110,0.08)] sm:p-6 lg:p-8"
            >
              {sent ? (
                <div className="grid min-h-[520px] place-items-center text-center">
                  <div>
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#f3e8ff] text-[#7a3fd0]">
                      <Check className="h-10 w-10" />
                    </div>
                    <h3 className="mt-6 text-4xl font-black tracking-[-0.06em] text-[#351458]">
                      נרשמת בהצלחה
                    </h3>
                    <p className="mx-auto mt-4 max-w-md text-base leading-8 text-[#6d5b84]">
                      שמרנו את הפרטים. בקרוב נפתח קבוצת וואטסאפ ונשלח הזמנה עם
                      כל הפרטים ומחירי ההשקה.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="mt-8 rounded-full bg-[#6d28d9] px-7 py-4 text-sm font-black text-white transition hover:bg-[#5d22be]"
                    >
                      שליחת הרשמה נוספת
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6 rounded-[28px] border border-white/70 bg-white p-5">
                    <p className="text-sm font-black text-[#7a3fd0]">
                      הרשמה מוקדמת
                    </p>
                    <h3 className="mt-2 text-4xl font-black leading-none tracking-[-0.06em] text-[#351458]">
                      הצטרפות לרשימת הראשונים
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#6d5b84]">
                      מלאו פרטים ונעדכן כשקבוצת הוואטסאפ תיפתח.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-black text-[#351458]">
                        שם מלא
                      </span>
                      <input
                        value={form.name}
                        onChange={(event) =>
                          updateField("name", event.target.value)
                        }
                        placeholder="איך קוראים לך?"
                        className="min-h-14 w-full rounded-2xl border border-[#eadcff] bg-white px-5 text-base font-bold text-[#351458] outline-none transition placeholder:text-[#b39ccf] focus:border-[#7a3fd0] focus:ring-4 focus:ring-[#f0e3ff]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-black text-[#351458]">
                        טלפון / וואטסאפ
                      </span>
                      <input
                        value={form.phone}
                        onChange={(event) =>
                          updateField("phone", event.target.value)
                        }
                        placeholder="מספר לקבלת הזמנה לקבוצה"
                        inputMode="tel"
                        className="min-h-14 w-full rounded-2xl border border-[#eadcff] bg-white px-5 text-base font-bold text-[#351458] outline-none transition placeholder:text-[#b39ccf] focus:border-[#7a3fd0] focus:ring-4 focus:ring-[#f0e3ff]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-black text-[#351458]">
                        שם העסק
                      </span>
                      <input
                        value={form.business}
                        onChange={(event) =>
                          updateField("business", event.target.value)
                        }
                        placeholder="שם העסק / התחום שלך"
                        className="min-h-14 w-full rounded-2xl border border-[#eadcff] bg-white px-5 text-base font-bold text-[#351458] outline-none transition placeholder:text-[#b39ccf] focus:border-[#7a3fd0] focus:ring-4 focus:ring-[#f0e3ff]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-black text-[#351458]">
                        מה הכי מעניין אותך?
                      </span>
                      <select
                        value={form.interest}
                        onChange={(event) =>
                          updateField("interest", event.target.value)
                        }
                        className="min-h-14 w-full rounded-2xl border border-[#eadcff] bg-white px-5 text-base font-bold text-[#351458] outline-none transition focus:border-[#7a3fd0] focus:ring-4 focus:ring-[#f0e3ff]"
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
                        ? "bg-[#6d28d9] text-white shadow-[0_18px_40px_rgba(109,40,217,0.22)] hover:-translate-y-1 hover:bg-[#5d22be]"
                        : "cursor-not-allowed bg-zinc-200 text-zinc-400",
                    )}
                  >
                    שלחו לי פרטים והזמנה לקבוצה
                    <Phone className="h-5 w-5" />
                  </button>

                  <p className="mt-4 text-center text-xs leading-6 text-[#8b78a2]">
                    ההרשמה לא מחייבת רכישה. מחירי ההשקה יינתנו לקבוצת ההרשמה
                    המוקדמת בלבד.
                  </p>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#faf6ff] px-5 py-20 text-[#351458] lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div>
              <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-[#7a3fd0]">
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
                  className="w-full rounded-[28px] border border-[#f0e4ff] bg-white p-5 text-right transition hover:shadow-[0_16px_40px_rgba(72,29,110,0.06)]"
                >
                  <div className="flex items-center justify-between gap-5">
                    <h3 className="text-xl font-black tracking-[-0.04em] text-[#351458]">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={cx(
                        "h-5 w-5 shrink-0 text-[#7a3fd0] transition",
                        openFaq === index && "rotate-180",
                      )}
                    />
                  </div>

                  {openFaq === index ? (
                    <p className="mt-4 max-w-3xl text-base leading-8 text-[#6d5b84]">
                      {faq.a}
                    </p>
                  ) : null}
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#efe4ff] bg-white px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 md:flex-row md:items-center">
          <BrandLogo />

          <a
            href="#early-access"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6d28d9] px-6 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#5d22be]"
          >
            להרשמה מוקדמת
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </div>
      </footer>
    </main>
  );
}