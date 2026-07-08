import React, { useMemo, useState } from "react";
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

const systemFeatures = [
  {
    icon: LayoutDashboard,
    title: "CRM לניהול לקוחות ולידים",
    text: "ריכוז פניות, לקוחות, סטטוסים, משימות ומעקב — כדי ששום ליד לא ילך לאיבוד.",
  },
  {
    icon: MessageCircle,
    title: "ניהול לידים ישירות ממטא",
    text: "לידים מקמפיינים ופייסבוק/אינסטגרם נכנסים למקום מסודר, עם המשך טיפול מהיר וברור.",
  },
  {
    icon: CalendarCheck,
    title: "תיאום פגישות ותורים",
    text: "ניהול פגישות, תורים, יומן ותזכורות בצורה פשוטה שמתאימה לעסק אמיתי.",
  },
  {
    icon: Zap,
    title: "אוטומציות חכמות",
    text: "פחות פעולות ידניות, יותר תהליכים שעובדים בשבילכם מאחורי הקלעים.",
  },
  {
    icon: Store,
    title: "אתר מקצועי, יומן וחנות",
    text: "בניית אתר לעסק, דפי נחיתה, חנות, יומן ותשתית דיגיטלית שמוכנה לצמיחה.",
  },
  {
    icon: Bot,
    title: "יועץ AI חכם",
    text: "עזרה חכמה בקבלת החלטות, רעיונות, תוכן, סדר וניהול הפעילות השוטפת.",
  },
];

const humanServices = [
  {
    icon: Phone,
    title: "מענה מהיר ללידים",
    text: "אנשי מכירות יכולים לעזור לכם להגיב מהר יותר לפניות ולהגדיל סיכוי לסגירה.",
  },
  {
    icon: CalendarCheck,
    title: "אישורי הגעה לפגישות",
    text: "וידוא הגעה, תזכורות, מעקב והפחתת ביטולים או אי־הופעות.",
  },
  {
    icon: Clock3,
    title: "מילוי תורים שבוטלו",
    text: "עזרה בריכוז רשימות המתנה וניסיון למלא זמנים שהתפנו.",
  },
  {
    icon: Megaphone,
    title: "קמפיינים ופוסטים",
    text: "הקמת קמפיינים ממומנים, מעקב, והכנת פוסטים לרשתות החברתיות.",
  },
];

const benefits = [
  "גישה ראשונה למערכת לפני כולם",
  "מחירי השקה לקבוצה בלבד",
  "הצטרפות לקבוצת וואטסאפ שתיפתח בקרוב",
  "קבלת כל הפרטים, ההדגמות והעדכונים לפני ההשקה",
  "אפשרות להכיר את השירותים האנושיים והמערכת במקום אחד",
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
    text: "נחזור אליכם עם פרטים, הסבר על המערכת והזמנה לקבוצה כשהיא תיפתח.",
  },
  {
    number: "03",
    title: "מצטרפים למחיר השקה",
    text: "מחירי ההשקה יינתנו לקבוצת ההרשמה המוקדמת בלבד ולזמן מוגבל.",
  },
];

const faqs = [
  {
    q: "מה זה ביזאפלי?",
    a: "ביזאפלי היא מערכת ושירות לעסקים שמרכזים CRM, לידים, אתר, אוטומציות, יומן, חנות, AI ושירותים אנושיים שמורידים עומס מהעסק.",
  },
  {
    q: "זה רק בונה אתרים?",
    a: "לא. האתר הוא חלק מהמערכת, אבל המטרה רחבה יותר: לעזור לעסק לקבל פניות, לנהל אותן, להגיב מהר יותר, לחסוך זמן ולצמוח.",
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
    <main dir="rtl" className="min-h-screen overflow-x-hidden bg-[#09040f] text-white">
      <style>{`
        .bizuply-hero-bg {
          background-image:
            radial-gradient(circle at 18% 18%, rgba(168, 85, 247, 0.32), transparent 30%),
            radial-gradient(circle at 82% 12%, rgba(236, 72, 153, 0.24), transparent 32%),
            radial-gradient(circle at 50% 90%, rgba(59, 130, 246, 0.16), transparent 36%),
            linear-gradient(180deg, #09040f 0%, #130720 52%, #f7f2ff 52%, #ffffff 100%);
        }

        .bizuply-orbit {
          animation: bizuplyOrbit 18s linear infinite;
        }

        .bizuply-float-a {
          animation: bizuplyFloatA 7s ease-in-out infinite;
        }

        .bizuply-float-b {
          animation: bizuplyFloatB 8s ease-in-out infinite;
        }

        .bizuply-float-c {
          animation: bizuplyFloatC 6.5s ease-in-out infinite;
        }

        .bizuply-shine {
          position: relative;
          overflow: hidden;
        }

        .bizuply-shine::after {
          content: "";
          position: absolute;
          inset: -80%;
          background: linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.28), transparent 65%);
          transform: translateX(-70%) rotate(18deg);
          animation: bizuplyShine 4.8s ease-in-out infinite;
        }

        .bizuply-marquee {
          animation: bizuplyMarquee 30s linear infinite;
        }

        @keyframes bizuplyOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bizuplyFloatA {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-1deg); }
          50% { transform: translate3d(0, -16px, 0) rotate(1deg); }
        }

        @keyframes bizuplyFloatB {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(1deg); }
          50% { transform: translate3d(0, 14px, 0) rotate(-1deg); }
        }

        @keyframes bizuplyFloatC {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(0, -10px, 0) scale(1.02); }
        }

        @keyframes bizuplyShine {
          0%, 45% { transform: translateX(-70%) rotate(18deg); }
          75%, 100% { transform: translateX(70%) rotate(18deg); }
        }

        @keyframes bizuplyMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .bizuply-orbit,
          .bizuply-float-a,
          .bizuply-float-b,
          .bizuply-float-c,
          .bizuply-shine::after,
          .bizuply-marquee {
            animation: none !important;
          }
        }
      `}</style>

      <section className="bizuply-hero-bg relative isolate min-h-screen overflow-hidden">
        <div className="bizuply-orbit absolute left-1/2 top-16 -z-10 h-[680px] w-[680px] -translate-x-1/2 rounded-full border border-white/10 opacity-40">
          <div className="absolute right-16 top-8 h-4 w-4 rounded-full bg-fuchsia-300 shadow-[0_0_40px_rgba(217,70,239,0.9)]" />
          <div className="absolute bottom-24 left-10 h-3 w-3 rounded-full bg-purple-300 shadow-[0_0_40px_rgba(168,85,247,0.9)]" />
        </div>

        <header className="relative z-20 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-lg font-black text-[#5b21b6] shadow-2xl shadow-purple-950/20">
              B
            </div>
            <div>
              <p className="text-xl font-black tracking-[-0.04em]">Bizuply</p>
              <p className="text-xs font-bold text-white/50">מערכת ושירותים לעסקים</p>
            </div>
          </div>

          <a
            href="#early-access"
            className="hidden rounded-full bg-white px-5 py-3 text-sm font-black text-[#170a2b] shadow-xl shadow-purple-950/20 transition hover:-translate-y-0.5 hover:bg-purple-100 md:inline-flex"
          >
            הרשמה מוקדמת
          </a>
        </header>

        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 pb-20 pt-10 lg:grid-cols-[1.03fr_0.97fr] lg:px-8 lg:pb-28 lg:pt-20">
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-purple-100 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-fuchsia-200" />
              הרשמה מוקדמת לפני פתיחה בישראל
            </div>

            <h1 className="max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-7xl lg:text-8xl xl:text-[7.2rem]">
              מה אם הייתם יכולים לקבל את כל מה שעסק צריך — במקום אחד?
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-9 text-white/75">
              מערכת CRM לניהול לקוחות ולידים, ניהול לידים ישירות ממטא, תיאום
              פגישות, אוטומציות חכמות, בניית אתר מקצועי כולל יומן וחנות, יועץ
              AI חכם ושיתופי פעולה עסקיים שיכולים לפתוח לכם דלתות חדשות.
            </p>

            <p className="mt-4 max-w-2xl text-lg font-bold leading-9 text-white">
              אבל זה לא נגמר בטכנולוגיה.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#early-access"
                className="bizuply-shine inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-8 text-sm font-black text-[#170a2b] shadow-2xl shadow-purple-950/30 transition hover:-translate-y-1"
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
            </div>

            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["גישה ראשונה", "לפני כולם"],
                ["מחירי השקה", "לקבוצה בלבד"],
                ["וואטסאפ", "תיפתח בקרוב"],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-xl"
                >
                  <p className="text-xl font-black">{title}</p>
                  <p className="mt-1 text-sm font-bold text-white/55">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 min-h-[620px]">
            <div className="bizuply-float-a absolute right-0 top-6 w-[82%] rounded-4xl border border-white/10 bg-white/12 p-4 shadow-2xl shadow-purple-950/30 backdrop-blur-2xl">
              <div className="rounded-4xl bg-[#10091c] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-200">
                      bizuply system
                    </p>
                    <p className="mt-1 text-2xl font-black">מרכז העסק שלכם</p>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-500/20 text-purple-100">
                    <LayoutDashboard className="h-6 w-6" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["124", "לידים"],
                    ["32", "פגישות"],
                    ["18", "משימות"],
                  ].map(([number, label]) => (
                    <div key={label} className="rounded-2xl bg-white/6 p-4">
                      <p className="text-3xl font-black">{number}</p>
                      <p className="mt-1 text-xs font-bold text-white/45">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    ["ליד חדש ממטא", "ממתין למענה מהיר"],
                    ["תור שבוטל", "נשלחה הצעה לרשימת המתנה"],
                    ["קמפיין פעיל", "מעקב אחרי תוצאות"],
                  ].map(([title, text]) => (
                    <div
                      key={title}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div>
                        <p className="font-black">{title}</p>
                        <p className="mt-1 text-sm text-white/45">{text}</p>
                      </div>
                      <Check className="h-5 w-5 text-emerald-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bizuply-float-b absolute bottom-20 left-0 w-[58%] rounded-4xl border border-white/10 bg-white p-5 text-[#170a2b] shadow-2xl shadow-purple-950/20">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-100 text-purple-700">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-black">קבוצת וואטסאפ</p>
                  <p className="text-sm font-bold text-zinc-500">תיפתח בקרוב</p>
                </div>
              </div>
              <p className="text-sm leading-7 text-zinc-600">
                כל הנרשמים הראשונים יקבלו הזמנה, פרטים מלאים ומחירי השקה
                שיינתנו לקבוצה בלבד.
              </p>
            </div>

            <div className="bizuply-float-c absolute bottom-4 right-14 w-[48%] rounded-4xl border border-white/10 bg-gradient-to-br from-purple-500 to-fuchsia-500 p-5 shadow-2xl shadow-fuchsia-950/30">
              <Crown className="mb-4 h-8 w-8 text-white" />
              <p className="text-2xl font-black leading-tight">מחיר השקה לקבוצה בלבד</p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                ההטבה תישמר לנרשמים המוקדמים לפני פתיחה רחבה.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-purple-100 bg-white py-5 text-[#170a2b]">
        <div className="bizuply-marquee flex w-max gap-4">
          {[...Array(2)].map((_, group) => (
            <div key={group} className="flex items-center gap-4">
              {[
                "פחות עומס",
                "יותר סדר",
                "יותר לקוחות",
                "יותר צמיחה",
                "מערכת אחת",
                "שירות אנושי",
              ].map((item) => (
                <React.Fragment key={`${group}-${item}`}>
                  <span className="text-2xl font-black tracking-[-0.04em] lg:text-4xl">
                    {item}
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-purple-100 text-purple-700">
                    <Sparkles className="h-4 w-4" />
                  </span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section id="what-is" className="bg-white px-5 py-20 text-[#170a2b] lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-purple-50 px-4 py-2 text-xs font-black text-purple-700">
                מי אנחנו
              </p>
              <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                אנחנו דואגים לכל מה שמסביב, כדי שאתם תתמקדו בעבודה שלכם.
              </h2>
            </div>

            <div className="space-y-5 text-lg leading-9 text-zinc-600">
              <p>
                במקום לרדוף אחרי לקוחות, הודעות, תורים, פרסומים ומשימות —
                ביזאפלי נבנתה כדי לרכז את הדברים החשובים לעסק במקום אחד.
              </p>
              <p>
                המערכת משלבת טכנולוגיה, אוטומציות, AI, ניהול לידים, אתר,
                יומן, חנות וכלים שעוזרים לעסק להתנהל בצורה מסודרת יותר.
              </p>
              <p className="font-bold text-[#170a2b]">
                בקרוב יושק בישראל שירות חדש לעסקים, מבית חברה אמריקאית.
                עסקים בישראל עומדים לקבל דרך חדשה לעבוד: פחות עומס. יותר סדר.
                יותר לקוחות. יותר צמיחה.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {systemFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-4xl border border-purple-100 bg-[#fbf7ff] p-6 transition duration-300 hover:-translate-y-2 hover:border-purple-200 hover:bg-white hover:shadow-2xl hover:shadow-purple-950/10"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#170a2b] text-white transition group-hover:rotate-3 group-hover:scale-105">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-2xl font-black tracking-[-0.04em]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="human" className="bg-[#f7f2ff] px-5 py-20 text-[#170a2b] lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-purple-700">
                הצד האנושי
              </p>
              <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                אבל זה לא נגמר בטכנולוגיה.
              </h2>
            </div>

            <p className="text-lg leading-9 text-zinc-600">
              מה אם היו לכם גם שירותים אנושיים שמורידים מכם את העומס באמת?
              אישורי הגעה, ריכוז הזמנות, מילוי תורים שבוטלו, מענה מהיר ללידים,
              קמפיינים, פוסטים ועוד.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {humanServices.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="rounded-4xl border border-purple-100 bg-white p-6 shadow-xl shadow-purple-950/5 transition hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-950/12"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-purple-100 text-purple-700">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-2xl font-black tracking-[-0.04em]">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">{service.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 text-[#170a2b] lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-4xl bg-[#170a2b] p-8 text-white shadow-2xl shadow-purple-950/20 lg:p-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-purple-100">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-black text-purple-200">למי זה מתאים?</p>
                <p className="text-3xl font-black tracking-[-0.05em]">לעסקים שרוצים לגדול</p>
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
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/6 p-4"
                >
                  <Check className="mt-1 h-5 w-5 shrink-0 text-emerald-300" />
                  <p className="font-bold leading-7 text-white/85">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl border border-purple-100 bg-[#fbf7ff] p-8 shadow-2xl shadow-purple-950/10 lg:p-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-purple-100 text-purple-700">
                <Rocket className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-black text-purple-700">מה מקבלים בהרשמה?</p>
                <p className="text-3xl font-black tracking-[-0.05em]">יתרון לפני כולם</p>
              </div>
            </div>

            <div className="space-y-3">
              {benefits.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-white p-4">
                  <Star className="mt-1 h-5 w-5 shrink-0 fill-purple-600 text-purple-600" />
                  <p className="font-bold leading-7 text-zinc-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="early-access" className="relative isolate overflow-hidden bg-[#170a2b] px-5 py-20 text-white lg:px-8">
        <div className="absolute left-0 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 -z-10 h-[420px] w-[420px] rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
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
                const TypedIcon = Icon as typeof ShieldCheck;

                return (
                  <div key={String(label)} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 p-4">
                    <TypedIcon className="h-5 w-5 text-purple-200" />
                    <span className="font-black">{String(label)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-4xl border border-white/10 bg-white p-4 text-[#170a2b] shadow-2xl shadow-purple-950/30 sm:p-6 lg:p-8"
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
                    שמרנו את הפרטים. בקרוב נפתח קבוצת וואטסאפ ונשלח הזמנה עם כל
                    הפרטים ומחירי ההשקה.
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
                <div className="mb-6 rounded-4xl bg-[#f7f2ff] p-5">
                  <p className="text-sm font-black text-purple-700">הרשמה מוקדמת</p>
                  <h3 className="mt-2 text-4xl font-black leading-none tracking-[-0.06em]">
                    הצטרפות לרשימת הראשונים
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">
                    מלאו פרטים ונעדכן כשקבוצת הוואטסאפ תיפתח.
                  </p>
                </div>

                <div className="grid gap-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-black">שם מלא</span>
                    <input
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="איך קוראים לך?"
                      className="min-h-14 w-full rounded-2xl border border-purple-100 bg-white px-5 text-base font-bold outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-black">טלפון / וואטסאפ</span>
                    <input
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      placeholder="מספר לקבלת הזמנה לקבוצה"
                      inputMode="tel"
                      className="min-h-14 w-full rounded-2xl border border-purple-100 bg-white px-5 text-base font-bold outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-black">שם העסק</span>
                    <input
                      value={form.business}
                      onChange={(event) => updateField("business", event.target.value)}
                      placeholder="שם העסק / התחום שלך"
                      className="min-h-14 w-full rounded-2xl border border-purple-100 bg-white px-5 text-base font-bold outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-black">מה הכי מעניין אותך?</span>
                    <select
                      value={form.interest}
                      onChange={(event) => updateField("interest", event.target.value)}
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
                      ? "bg-[#170a2b] text-white shadow-xl shadow-purple-950/20 hover:-translate-y-1 hover:bg-purple-900"
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
        </div>
      </section>

      <section className="bg-white px-5 py-20 text-[#170a2b] lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-purple-50 px-4 py-2 text-xs font-black text-purple-700">
              שאלות נפוצות
            </p>
            <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
              כל מה שצריך לדעת לפני ההצטרפות.
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <button
                key={faq.q}
                type="button"
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                className="w-full rounded-3xl border border-purple-100 bg-[#fbf7ff] p-5 text-right transition hover:bg-white hover:shadow-xl hover:shadow-purple-950/10"
              >
                <div className="flex items-center justify-between gap-5">
                  <h3 className="text-xl font-black tracking-[-0.04em]">{faq.q}</h3>
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
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#0b0614] px-5 py-10 text-white lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <div>
            <p className="text-3xl font-black tracking-[-0.06em]">Bizuply</p>
            <p className="mt-2 text-sm text-white/45">
              פחות עומס. יותר סדר. יותר לקוחות. יותר צמיחה.
            </p>
          </div>

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