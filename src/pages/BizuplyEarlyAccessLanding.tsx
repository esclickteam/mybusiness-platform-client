import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BellRing,
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

const faqs = [
  {
    q: "מה זה ביזאפלי",
    a: "Bizuply היא מערכת שהיא מעטפת מלאה לעסק: CRM, לידים, אתר, דפי נחיתה, אוטומציות, יומן, חנות, AI, שיתופי פעולה ושירותים אנושיים שמורידים עומס אמיתי מבעל העסק.",
  },
  {
    q: "מה הופך את Bizuply לשונה",
    a: "Bizuply לא נבנית רק כמערכת טכנית. היא משלבת טכנולוגיה, שיתופי פעולה ושירותים אנושיים, כדי לעזור לעסק לא רק לקבל פניות — אלא גם לנהל, להגיב, לעקוב ולמכור בצורה מסודרת יותר.",
  },
  {
    q: "למה אתם אומרים שזה נבנה לעסקים באמת",
    a: "כי לאורך הדרך בדקנו תהליכים, צרכים, כאבים והרגלי עבודה של עסקים בשווקים שונים בעולם, כדי להבין מה באמת חסר לבעלי עסקים ביום־יום: פחות עומס, יותר סדר, יותר תגובה מהירה ויותר שליטה.",
  },
  {
    q: "מה הכוונה חברה אמריקאית",
    a: "Bizuply מגיעה מבית חברה אמריקאית, עם חשיבה של מוצר מתקדם לעסקים ועם התאמה לשוק הישראלי — לשפה, לקצב, ללידים, לוואטסאפ ולדרך שבה עסקים כאן עובדים.",
  },
  {
    q: "מה מקבלים בהרשמה מוקדמת",
    a: "נרשמים מוקדמים יקבלו עדכונים ראשונים, הזמנה לקבוצת וואטסאפ שתיפתח בקרוב, מחירי השקה לקבוצה בלבד, ובהמשך הקבוצה תשמש כקהילה סגורה לעסקים שצומחים ביחד.",
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

function PulseCTA({
  dark = false,
  className,
  label = "קחו אותי להרשמה",
}: {
  dark?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <a
      href="#early-access"
      className={cx(
        "biz-pulse-cta biz-clear-cta inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full px-8 py-4 text-base font-black leading-none transition sm:min-h-[64px] sm:px-9 sm:text-lg",
        dark
          ? "bg-gradient-to-br from-[#fff9de] via-[#f3dda5] to-[#c996ff] text-[#230934] shadow-[0_18px_55px_rgba(243,221,165,0.26)]"
          : "bg-gradient-to-br from-[#7b2ee8] via-[#8d55ff] to-[#c996ff] text-white shadow-[0_18px_55px_rgba(123,46,232,0.26)]",
        className,
      )}
    >
      <span className="text-current">{label}</span>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-current sm:h-6 sm:w-6" />
    </a>
  );
}

function FallingHeadline() {
  let charIndex = 0;
  const words = headline.split(" ");

  return (
    <h1
      aria-label={headline}
      style={{ fontFamily: `"Assistant", "Heebo", "Rubik", Arial, sans-serif` }}
      className="mx-auto w-full max-w-[1320px] px-1 text-center text-[clamp(2.15rem,10.5vw,7rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-[#fcf8ff] drop-shadow-[0_16px_45px_rgba(173,123,255,0.10)] sm:text-[clamp(3.2rem,6.1vw,7rem)]"
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
      initial={{ opacity: 0, y: -14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex w-full justify-center"
    >
      <div className="biz-logo-clean">
        <img
          src={LOGO_SRC}
          alt=""
          aria-hidden="true"
          className="biz-logo-white-shadow"
        />

        <span className="biz-logo-dot biz-logo-dot-one" />
        <span className="biz-logo-dot biz-logo-dot-two" />
        <span className="biz-logo-dot biz-logo-dot-three" />
        <span className="biz-logo-dot biz-logo-dot-four" />

        <img
          src={LOGO_SRC}
          alt="Bizuply"
          className="biz-logo-main relative z-20 h-auto object-contain"
        />
      </div>
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
              className="biz-countdown-number mx-auto block whitespace-nowrap pb-1 text-[clamp(3rem,5.9vw,5.8rem)] font-black leading-[1.05] tracking-[-0.06em]"
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

function ProblemToSolutionSection() {
  const scatteredItems: Array<{
    icon: IconType;
    title: string;
    text: string;
  }> = [
    { icon: MessageCircle, title: "לידים ממטא", text: "פייסבוק ואינסטגרם" },
    { icon: Phone, title: "וואטסאפ", text: "הודעות שלא מסודרות" },
    { icon: CalendarCheck, title: "יומן", text: "פגישות ותורים" },
    { icon: Store, title: "אתר וחנות", text: "נוכחות דיגיטלית" },
    { icon: Zap, title: "אוטומציות", text: "תזכורות ופולואפים" },
    { icon: Bot, title: "AI", text: "תוכן והחלטות" },
  ];

  const outcomes = [
    "כל ליד נכנס למקום אחד",
    "כל לקוח מקבל סטטוס ברור",
    "כל תור ומשימה נשמרים במערכת",
    "כל פולואפ קורה בזמן",
  ];

  return (
    <section
      id="about"
      dir="rtl"
      className="relative isolate overflow-hidden bg-[#fbf8ff] px-5 py-24 text-[#2a103c] lg:px-8"
    >
      <div className="pointer-events-none absolute left-[-12%] top-[-14%] -z-10 h-[620px] w-[620px] rounded-full bg-[#eadcff] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-16%] right-[-10%] -z-10 h-[620px] w-[620px] rounded-full bg-[#fff0bd] blur-3xl" />

      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-[#7b2ee8] shadow-[0_16px_45px_rgba(111,39,190,0.08)]">
              <Sparkles className="h-4 w-4" />
              מה הבעיה ש־Bizuply פותרת
            </p>

            <h2 className="text-5xl font-black leading-[0.9] tracking-[-0.035em] sm:text-7xl">
              העסק לא אמור להתפזר בין עשרה כלים
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-9 text-[#6b587c]">
              לידים ממטא, הודעות בוואטסאפ, פגישות ביומן, לקוחות בטבלה, אתר,
              משימות, תזכורות ושיתופי פעולה — כשכל דבר נמצא במקום אחר, קל
              לפספס לקוחות.
            </p>

            <PulseCTA className="mt-8" />
          </div>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_0.18fr_1fr] lg:items-center">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-[38px] border border-[#eadcff] bg-white p-6 text-right shadow-[0_28px_90px_rgba(111,39,190,0.08)]">
              <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-[#eadcff] blur-3xl" />

              <div className="relative mb-6">
                <p className="text-sm font-black text-[#7b2ee8]">
                  לפני Bizuply
                </p>
                <h3 className="mt-2 text-4xl font-black leading-[1.05] tracking-[-0.025em] text-[#2a103c]">
                  כל דבר במקום אחר
                </h3>
                <p className="mt-3 text-base font-semibold leading-8 text-[#6b587c]">
                  העסק עובד, אבל המידע מפוזר בין כלים שונים. זה יוצר עומס,
                  פספוסים וחוסר שליטה.
                </p>
              </div>

              <div className="relative grid gap-3 sm:grid-cols-2">
                {scatteredItems.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.title}
                      initial={{
                        opacity: 0,
                        y: 18,
                        rotate: index % 2 ? -1.5 : 1.5,
                      }}
                      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, duration: 0.55 }}
                      className="rounded-3xl border border-[#eadcff] bg-[#fbf8ff] p-4 shadow-[0_16px_42px_rgba(111,39,190,0.05)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[#7b2ee8] shadow-[0_10px_24px_rgba(111,39,190,0.08)]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#2a103c]">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs font-bold text-[#7a668f]">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="hidden place-items-center lg:grid">
              <div className="biz-transfer-arrow grid h-24 w-24 place-items-center rounded-full border border-[#eadcff] bg-white text-5xl font-black text-[#7b2ee8] shadow-[0_24px_70px_rgba(111,39,190,0.10)]">
                ←
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative h-full overflow-hidden rounded-[38px] border border-[#eadcff] bg-[#14071f] p-6 text-right text-white shadow-[0_34px_110px_rgba(42,16,60,0.32)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(123,46,232,0.32),transparent_34%),radial-gradient(circle_at_88%_78%,rgba(243,221,165,0.18),transparent_30%)]" />
              <div className="biz-dashboard-scan absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/10 to-transparent" />

              <div className="relative mb-6">
                <p className="text-sm font-black text-[#f3dda5]">
                  אחרי Bizuply
                </p>
                <h3 className="mt-2 text-4xl font-black leading-[1.05] tracking-[-0.025em] text-white">
                  הכל נכנס למערכת אחת
                </h3>
                <p className="mt-3 text-base font-semibold leading-8 text-[#d8c9ef]">
                  כל פנייה, לקוח, תור, משימה ושיתוף פעולה מקבלים מקום ברור,
                  סטטוס ברור והמשך טיפול מסודר.
                </p>
              </div>

              <div className="relative rounded-[32px] border border-white/10 bg-white/[0.06] p-5">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black text-[#cdb8ff]">
                      Bizuply Command Center
                    </p>
                    <h4 className="mt-1 text-2xl font-black tracking-[-0.02em] text-white">
                      שליטה מלאה בעסק
                    </h4>
                  </div>

                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f3dda5] text-[#2a103c]">
                    <LayoutDashboard className="h-7 w-7" />
                  </div>
                </div>

                <div className="grid gap-3">
                  {outcomes.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.16 + index * 0.08,
                        duration: 0.52,
                      }}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f3dda5] text-[#2a103c]">
                        <Check className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-black text-white">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ConversionMachineSection() {
  const pipelineSteps: Array<{
    icon: IconType;
    title: string;
    text: string;
  }> = [
    {
      icon: MessageCircle,
      title: "ליד נכנס",
      text: "פנייה חדשה ממטא, אתר או וואטסאפ נכנסת ישר למערכת",
    },
    {
      icon: Zap,
      title: "תגובה מהירה",
      text: "המערכת מסמנת, מתזכרת ומפעילה תהליך המשך טיפול",
    },
    {
      icon: LayoutDashboard,
      title: "ניהול ב־CRM",
      text: "סטטוס, מקור, הערות, משימות וכל המעקב במקום אחד",
    },
    {
      icon: CalendarCheck,
      title: "פגישה או תור",
      text: "קובעים ביומן, שולחים תזכורות ומקטינים ביטולים",
    },
    {
      icon: Rocket,
      title: "יותר סגירות",
      text: "פחות לידים נופלים בדרך ויותר פניות הופכות ללקוחות",
    },
  ];

  return (
    <section
      dir="rtl"
      className="relative isolate overflow-hidden bg-[#0f0619] px-5 py-24 text-white lg:px-8"
    >
      <div className="pointer-events-none absolute left-[-10%] top-[-18%] -z-10 h-[560px] w-[560px] rounded-full bg-[#7b2ee8]/22 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-24%] right-[-8%] -z-10 h-[600px] w-[600px] rounded-full bg-[#f3dda5]/10 blur-3xl" />

      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black text-[#f3dda5]">
              מה Bizuply עושה בפועל
            </p>
            <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.035em] sm:text-7xl">
              הופכת ליד חדש לתהליך מסודר שמתקדם לבד
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-8 text-[#cdbde4]">
              הלקוח לא צריך להבין טכנולוגיה. הוא צריך להבין דבר אחד: כל פנייה
              נכנסת למערכת, מקבלת טיפול, תזכורות, משימות ופולואפים — עד שהעסק
              סוגר יותר.
            </p>

            <PulseCTA dark className="mt-8" />
          </div>
        </Reveal>

        <div className="relative mt-16">
          <div className="biz-pipeline-line pointer-events-none absolute left-[8%] right-[8%] top-[78px] hidden h-px bg-gradient-to-l from-transparent via-[#f3dda5]/40 to-transparent lg:block" />

          <div className="grid gap-5 lg:grid-cols-5" dir="rtl">
            {pipelineSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <Reveal key={step.title} delay={index * 0.07}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.015 }}
                    transition={{ duration: 0.25 }}
                    className="biz-pipeline-card relative h-full overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.055] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl"
                    style={{ animationDelay: `${index * 1.05}s` }}
                  >
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.08] to-transparent" />

                    <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-[#7b2ee8] to-[#c29aff] text-white shadow-[0_18px_45px_rgba(123,46,232,0.28)]">
                      <Icon className="h-7 w-7" />
                    </div>

                    <div className="relative mt-5">
                      <p className="mb-2 text-xs font-black text-[#f3dda5]">
                        שלב {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="text-2xl font-black tracking-[-0.02em] text-white">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm font-semibold leading-7 text-[#cdbde4]">
                        {step.text}
                      </p>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function AllInOneOrbitSection() {
  const orbitCards: Array<{
    icon: IconType;
    title: string;
    text: string;
    number: string;
    position: string;
    lineClass: string;
  }> = [
    {
      icon: CalendarCheck,
      title: "יומן ותורים",
      text: "ניהול זמינות, פגישות, תורים ותזכורות — כדי שכל פנייה תוכל להפוך לפגישה אמיתית",
      number: "01",
      position: "left-1/2 top-0 -translate-x-1/2",
      lineClass: "biz-connector-top",
    },
    {
      icon: MessageCircle,
      title: "לידים ממטא",
      text: "פניות מפייסבוק ואינסטגרם נכנסות למערכת בצורה מסודרת, עם מקור, סטטוס והמשך טיפול",
      number: "02",
      position: "right-0 top-[22%]",
      lineClass: "biz-connector-right-top",
    },
    {
      icon: LayoutDashboard,
      title: "CRM חכם",
      text: "כל הלידים, הלקוחות, הסטטוסים, המשימות והמעקבים במקום אחד",
      number: "03",
      position: "right-2 bottom-[21%]",
      lineClass: "biz-connector-right-bottom",
    },
    {
      icon: Zap,
      title: "אוטומציות",
      text: "תזכורות, פולואפים, משימות והתראות שעובדים בשבילכם ברקע",
      number: "04",
      position: "left-[56%] bottom-0",
      lineClass: "biz-connector-bottom-right",
    },
    {
      icon: Bot,
      title: "AI לעסק",
      text: "עזרה בתוכן, שיווק, רעיונות, סדר, מכירות וניהול יומיומי",
      number: "05",
      position: "left-[16%] bottom-0",
      lineClass: "biz-connector-bottom-left",
    },
    {
      icon: Store,
      title: "אתר, דפי נחיתה וחנות",
      text: "נוכחות דיגיטלית מקצועית לעסק שמתחברת ישירות למערכת",
      number: "06",
      position: "left-0 bottom-[26%]",
      lineClass: "biz-connector-left-bottom",
    },
    {
      icon: Handshake,
      title: "שיתופי פעולה",
      text: "חיבורים, ספקים, שותפים וצוות — הכל מחובר, מסודר ועדכני",
      number: "07",
      position: "left-0 top-[24%]",
      lineClass: "biz-connector-left-top",
    },
  ];

  return (
    <section
      dir="rtl"
      className="relative isolate overflow-hidden bg-white px-5 py-24 text-[#2a103c] lg:px-8"
    >
      <div className="pointer-events-none absolute left-[-18%] top-[-20%] -z-10 h-[760px] w-[760px] rounded-full bg-[#eee2ff] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-18%] right-[-14%] -z-10 h-[700px] w-[700px] rounded-full bg-[#fff0bd] blur-3xl" />

      <div className="mx-auto grid max-w-[1540px] gap-14 xl:grid-cols-[1.08fr_0.72fr] xl:items-center">
        <div className="relative min-h-[860px] overflow-visible lg:min-h-[760px]">
          <div className="biz-allin-rings pointer-events-none absolute left-1/2 top-1/2 z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 rounded-full border border-[#eadcff]/55" />
            <div className="biz-orbit-spin absolute inset-[38px] rounded-full border border-dashed border-[#cfaeff]/55" />
            <div className="biz-orbit-spin-slow absolute inset-[82px] rounded-full border border-[#f3dda5]/45" />
            <div className="absolute inset-[126px] rounded-full border border-dashed border-[#d8bcff]/45" />
          </div>

          <div className="biz-allin-glow pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full" />

          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-1/2 z-20 grid h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/75 text-center shadow-[0_30px_120px_rgba(111,39,190,0.18)] backdrop-blur-2xl"
          >
            <div className="absolute inset-4 rounded-full border border-[#eadcff]" />
            <div className="absolute inset-8 rounded-full border border-dashed border-[#d7b7ff]" />
            <div>
              <p className="text-5xl font-black leading-[0.92] tracking-[-0.04em] text-[#2a103c]">
                ALL IN
              </p>
              <p className="mt-2 text-5xl font-black leading-[0.92] tracking-[-0.04em] text-[#2a103c]">
                ONE
              </p>
              <p className="mt-2 text-5xl font-black leading-[0.92] tracking-[-0.04em] text-[#2a103c]">
                PLACE
              </p>
            </div>
          </motion.div>

          {orbitCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.82, y: 24 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  delay: 0.14 + index * 0.18,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cx(
                  "biz-orbit-feature-card absolute z-30 w-[310px] rounded-[28px] border border-[#eadcff] bg-white/90 p-5 text-right shadow-[0_22px_70px_rgba(111,39,190,0.10)] backdrop-blur-2xl",
                  card.position,
                )}
                style={{ animationDelay: `${index * 0.22}s` }}
              >
                <div
                  className={cx(
                    "biz-orbit-connector pointer-events-none absolute",
                    card.lineClass,
                  )}
                />

                <div className="flex items-start gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#2a103c] text-[#f3dda5] shadow-[0_16px_38px_rgba(42,16,60,0.16)]">
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <h3 className="text-2xl font-black tracking-[-0.02em] text-[#2a103c]">
                        {card.title}
                      </h3>

                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#f3dda5] bg-white text-sm font-black text-[#d3a63f]">
                        {card.number}
                      </span>
                    </div>

                    <p className="text-sm font-semibold leading-7 text-[#6b587c]">
                      {card.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          <div className="biz-orbit-dot absolute left-1/2 top-[24%]" />
          <div className="biz-orbit-dot biz-orbit-dot-2 absolute right-[30%] top-[42%]" />
          <div className="biz-orbit-dot biz-orbit-dot-3 absolute left-[31%] bottom-[34%]" />
        </div>

        <Reveal>
          <div className="text-right">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f3eaff] px-5 py-3 text-xs font-black text-[#7b2ee8]">
              <Sparkles className="h-4 w-4" />
              מה יש בביזאפלי
            </p>

            <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.035em] text-[#2a103c] sm:text-7xl">
              כל מה שהעסק צריך — וביחד זו מערכת מנצחת
            </h2>

            <p className="mt-6 max-w-2xl text-lg font-semibold leading-9 text-[#6b587c]">
              במקום לפצל בין אתר, לידים, וואטסאפ, יומן, קמפיינים, טבלאות
              ותזכורות — Bizuply מחברת הכל למקום אחד, עם תנועה ברורה בין פנייה,
              טיפול וסגירה.
            </p>

            <PulseCTA className="mt-8" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HologramAgentIllustration() {
  return (
    <div className="biz-agent-shell">
      <div className="biz-agent-orbit biz-agent-orbit-one" />
      <div className="biz-agent-orbit biz-agent-orbit-two" />
      <div className="biz-agent-platform" />

      <svg
        viewBox="0 0 520 680"
        className="biz-agent-svg"
        role="img"
        aria-label="נציג אנושי עם אוזניות"
      >
        <defs>
          <linearGradient id="agentHair" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#2b123d" />
            <stop offset="45%" stopColor="#181025" />
            <stop offset="100%" stopColor="#7c46d6" />
          </linearGradient>

          <linearGradient id="agentSkin" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffe6cf" />
            <stop offset="55%" stopColor="#e9b993" />
            <stop offset="100%" stopColor="#c78567" />
          </linearGradient>

          <linearGradient id="agentSuit" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#5a2a81" />
            <stop offset="45%" stopColor="#2a133b" />
            <stop offset="100%" stopColor="#10091a" />
          </linearGradient>

          <linearGradient id="agentGlow" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f3dda5" />
            <stop offset="50%" stopColor="#9b6cff" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0.58 0 0 0 0.45  0 0.23 0 0 0.12  0 0 0.95 0 0.8  0 0 0 1 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="biz-agent-body">
          <ellipse
            cx="260"
            cy="635"
            rx="176"
            ry="22"
            fill="none"
            stroke="url(#agentGlow)"
            strokeWidth="3"
            opacity="0.75"
          />
          <ellipse
            cx="260"
            cy="638"
            rx="118"
            ry="12"
            fill="#a26dff"
            opacity="0.22"
          />

          <path
            d="M114 610 C132 500 168 430 260 430 C352 430 388 500 406 610 Z"
            fill="url(#agentSuit)"
            stroke="#8d63ff"
            strokeWidth="2"
            opacity="0.98"
          />

          <path
            d="M190 440 L250 610 L146 610 C153 536 164 484 190 440Z"
            fill="#1b0f2a"
            opacity="0.78"
          />
          <path
            d="M330 440 L270 610 L374 610 C367 536 356 484 330 440Z"
            fill="#1b0f2a"
            opacity="0.78"
          />

          <path
            d="M220 418 C228 456 292 456 300 418 L292 390 L228 390 Z"
            fill="url(#agentSkin)"
          />

          <path
            d="M148 214 C150 112 216 58 294 76 C370 94 412 168 396 258 C382 338 350 390 260 398 C174 390 146 312 148 214Z"
            fill="url(#agentHair)"
          />

          <path
            d="M174 212 C176 146 218 104 280 106 C340 108 374 154 372 220 C370 306 324 372 264 374 C202 376 172 298 174 212Z"
            fill="url(#agentSkin)"
          />

          <path
            d="M180 218 C194 172 228 132 292 130 C252 152 214 184 184 234Z"
            fill="#32164a"
            opacity="0.74"
          />

          <path
            d="M340 220 C360 220 370 238 364 260 C358 283 338 286 334 270"
            fill="url(#agentSkin)"
          />
          <path
            d="M180 220 C160 220 150 238 156 260 C162 283 182 286 186 270"
            fill="url(#agentSkin)"
          />

          <path
            d="M214 236 C226 227 240 227 252 236"
            fill="none"
            stroke="#2a103c"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M292 236 C304 227 318 227 330 236"
            fill="none"
            stroke="#2a103c"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <ellipse cx="235" cy="254" rx="7" ry="9" fill="#1b1028" />
          <ellipse cx="309" cy="254" rx="7" ry="9" fill="#1b1028" />

          <path
            d="M270 258 C266 278 258 292 248 304 C258 310 272 310 282 304"
            fill="none"
            stroke="#b77f67"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <path
            className="biz-agent-mouth"
            d="M238 330 C252 344 286 344 302 330"
            fill="none"
            stroke="#5a1f32"
            strokeWidth="6"
            strokeLinecap="round"
          />

          <path
            d="M174 238 C174 145 214 90 278 88 C364 88 394 154 386 248"
            fill="none"
            stroke="#8f63ff"
            strokeWidth="9"
            strokeLinecap="round"
            filter="url(#softGlow)"
          />

          <rect
            x="142"
            y="220"
            width="42"
            height="76"
            rx="20"
            fill="#241034"
            stroke="#9b6cff"
            strokeWidth="4"
          />
          <rect
            x="350"
            y="220"
            width="42"
            height="76"
            rx="20"
            fill="#241034"
            stroke="#9b6cff"
            strokeWidth="4"
          />

          <path
            d="M370 292 C390 304 402 326 398 350"
            fill="none"
            stroke="#f3dda5"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle
            cx="396"
            cy="354"
            r="10"
            fill="#f3dda5"
            className="biz-mic-dot"
          />

          <g opacity="0.42">
            {Array.from({ length: 12 }).map((_, index) => (
              <line
                key={index}
                x1={150 + index * 20}
                x2={156 + index * 20}
                y1="505"
                y2="620"
                stroke="#b58cff"
                strokeWidth="1"
              />
            ))}
          </g>
        </g>
      </svg>

      <div className="biz-agent-speaking">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function HologramHumanSection() {
  const featureCards: Array<{
    icon: IconType;
    title: string;
    text: string;
  }> = [
    {
      icon: MessageCircle,
      title: "טיפול ומכירה",
      text: "שיחה, בירור צורך, הסבר, תיאום המשך והובלת הליד לשלב הבא",
    },
    {
      icon: Users,
      title: "מילוי פרטים",
      text: "איסוף וליווי פרטים מדויקים לפני העברה להמשך טיפול",
    },
    {
      icon: Clock3,
      title: "תזכורות והתראות",
      text: "תזכורות חכמות ומעקב אחרי פניות שלא נסגרו",
    },
    {
      icon: Megaphone,
      title: "קמפיינים חכמים",
      text: "עזרה בבניית קמפיינים, תוכן והנעה לפעולה מול לקוחות",
    },
    {
      icon: Handshake,
      title: "שיתופי פעולה",
      text: "איתור שותפים, ספקים וחיבורים שיכולים לעזור לעסק לצמוח",
    },
    {
      icon: Zap,
      title: "תגובה מהירה",
      text: "מענה מהיר ללידים חמים כדי שלא יעברו למתחרים",
    },
  ];

  const floatingCards = [
    {
      title: "תגובה מהירה ללידים",
      text: "מענה אנושי תוך שניות",
      icon: Zap,
      className: "left-0 top-[16%]",
    },
    {
      title: "סיוע במכירות",
      text: "הסבר, התאמה והובלה לסגירה",
      icon: Rocket,
      className: "right-0 top-[20%]",
    },
    {
      title: "תיאום פגישות",
      text: "ישירות ליומן שלך",
      icon: CalendarCheck,
      className: "left-0 bottom-[24%]",
    },
    {
      title: "הזדמנויות שותפות",
      text: "חיבורים והפניות איכותיות",
      icon: Handshake,
      className: "right-0 bottom-[20%]",
    },
  ];

  return (
    <section
      dir="rtl"
      className="biz-human-hologram relative isolate overflow-hidden px-5 py-24 text-white lg:px-8"
    >
      <div className="pointer-events-none absolute left-[-12%] top-[-18%] -z-10 h-[620px] w-[620px] rounded-full bg-[#7b2ee8]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-22%] right-[-10%] -z-10 h-[620px] w-[620px] rounded-full bg-[#f3dda5]/12 blur-3xl" />

      <div
        dir="ltr"
        className="mx-auto grid max-w-[1540px] gap-16 xl:grid-cols-[0.96fr_1.04fr] xl:items-center"
      >
        <Reveal>
          <div className="relative mx-auto min-h-[780px] w-full max-w-[760px]">
            <HologramAgentIllustration />

            {floatingCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 22, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    delay: 0.18 + index * 0.12,
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={cx(
                    "biz-agent-floating-card absolute z-30 w-[230px] rounded-[26px] border border-white/12 bg-white/[0.075] p-5 text-right shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-2xl",
                    card.className,
                  )}
                >
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-full border border-[#f3dda5]/35 bg-[#f3dda5]/15 text-[#f3dda5]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm font-semibold leading-7 text-[#d8c9ef]">
                    {card.text}
                  </p>
                </motion.div>
              );
            })}

            <div className="biz-agent-wire biz-agent-wire-1" />
            <div className="biz-agent-wire biz-agent-wire-2" />
            <div className="biz-agent-wire biz-agent-wire-3" />
            <div className="biz-agent-wire biz-agent-wire-4" />
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div dir="rtl" className="text-right">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-5 py-3 text-xs font-black text-[#f3dda5] shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
              <Sparkles className="h-4 w-4" />
              שכבת שירותים אנושית
            </p>

            <h2 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.035em] text-white sm:text-7xl">
              נציג אנושי שמטפל בלידים ומחפש הזדמנויות
            </h2>

            <p className="mt-6 max-w-3xl text-lg font-semibold leading-9 text-[#d8c9ef]">
              לצד המערכת, Bizuply יכולה לתת לעסק שכבה אנושית שמורידה עומס
              אמיתי: מענה ללידים, פגישות, מילוי פרטים, קמפיינים ושיתופי פעולה —
              הכל מחובר למערכת שלך.
            </p>

            <PulseCTA dark className="mt-8" />

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {featureCards.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06, duration: 0.55 }}
                    className="group rounded-[30px] border border-white/10 bg-white/[0.065] p-6 text-right shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#f3dda5]/40 hover:bg-white/[0.09]"
                  >
                    <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[#f3dda5] text-[#2a103c] shadow-[0_16px_38px_rgba(243,221,165,0.16)]">
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="text-2xl font-black tracking-[-0.02em] text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-7 text-[#cdbde4]">
                      {item.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LaunchValueSection() {
  const cards: Array<{
    icon: IconType;
    label: string;
    title: string;
    text: string;
    points: string[];
  }> = [
    {
      icon: Rocket,
      label: "יתרון השקה",
      title: "נכנסים לפני כולם ומקבלים מחיר מוקדם",
      text: "הנרשמים הראשונים יקבלו עדכונים, הדגמות וגישה למחירי השקה לפני שהמערכת נפתחת לקהל הרחב.",
      points: ["מחיר השקה לקבוצה בלבד", "הצצה ראשונה למערכת", "עדכונים לפני כולם"],
    },
    {
      icon: ShieldCheck,
      label: "גב אמריקאי",
      title: "חברה אמריקאית עם חשיבה של מעטפת עסקית מתקדמת",
      text: "המטרה היא לא לבנות עוד דף נחיתה. המטרה היא לבנות מעטפת מלאה שמחברת בין לידים, תורים, CRM, מכירות, שירות ושיתופי פעולה.",
      points: ["סטנדרט מוצר גבוה", "חשיבה לטווח ארוך", "התאמה לשוק הישראלי"],
    },
    {
      icon: Handshake,
      label: "מעבר למערכת",
      title: "לא רק תוכנה — גם שירותים, קהילה ושיתופי פעולה",
      text: "המערכת נועדה לעזור לעסק לעבוד מסודר יותר, אבל גם לפתוח אפשרויות: נציגים, קמפיינים, תיאומים, ספקים וקהילה סגורה של עסקים שצומחים ביחד.",
      points: ["שירותים אנושיים", "קהילה עסקית סגורה", "חיבורים ותפעול במקום אחד"],
    },
  ];

  const marquee = [
    "CRM",
    "Meta Leads",
    "יומן ותורים",
    "אתר ודפי נחיתה",
    "אוטומציות",
    "AI",
    "שירותים אנושיים",
    "שיתופי פעולה",
    "קהילת עסקים",
    "מעקב מכירות",
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[#fbf8ff] px-5 py-24 text-[#2a103c] lg:px-8">
      <div className="pointer-events-none absolute left-[-12%] top-[-18%] -z-10 h-[620px] w-[620px] rounded-full bg-[#ead7ff] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] -z-10 h-[620px] w-[620px] rounded-full bg-[#fff0bd] blur-3xl" />

      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black text-[#7b2ee8] shadow-[0_16px_45px_rgba(111,39,190,0.08)]">
              <Crown className="h-4 w-4" />
              למה להירשם עכשיו
            </p>

            <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.035em] text-[#2a103c] sm:text-7xl">
              לא עוד כלי קטן — מעטפת מלאה לעסק שנבנית כדי להזיז אותו קדימה
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-9 text-[#6b587c]">
              Bizuply נבנית מתוך בדיקות עם עסקים, תהליכי מכירה, ניהול לידים,
              שירות לקוחות ושיתופי פעולה — כדי לתת לבעל עסק מקום אחד שמרכז את
              העבודה, מוריד עומס ומגדיל שליטה.
            </p>

            <PulseCTA className="mt-8" />
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <Reveal key={card.title} delay={index * 0.08}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                  className="group relative h-full overflow-hidden rounded-[38px] border border-[#2a103c]/15 bg-[#16091f] p-7 text-right text-white shadow-[0_28px_90px_rgba(42,16,60,0.18)]"
                >
                  <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/[0.08] to-transparent" />
                  <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-[#7b2ee8]/20 blur-2xl transition group-hover:bg-[#f3dda5]/20" />

                  <div className="relative">
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-black text-[#f3dda5]">
                          {card.label}
                        </p>
                        <h3 className="mt-3 text-3xl font-black leading-[1.05] tracking-[-0.025em] text-white">
                          {card.title}
                        </h3>
                      </div>

                      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-[#f3dda5] text-[#2a103c] shadow-[0_20px_60px_rgba(243,221,165,0.18)]">
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>

                    <p className="text-base font-semibold leading-8 text-[#d8c9ef]">
                      {card.text}
                    </p>

                    <div className="mt-7 space-y-3">
                      {card.points.map((point) => (
                        <div
                          key={point}
                          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3"
                        >
                          <Check className="h-5 w-5 shrink-0 text-[#f3dda5]" />
                          <span className="text-sm font-black text-white">
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.16}>
          <div className="mt-10 overflow-hidden rounded-[34px] border border-[#2a103c]/10 bg-[#16091f] p-4 shadow-[0_24px_80px_rgba(42,16,60,0.14)]">
            <div className="biz-value-marquee flex min-w-max gap-3">
              {marquee.concat(marquee).map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full border border-white/10 bg-white/[0.07] px-5 py-3 text-sm font-black text-[#f3dda5]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LaunchStepsSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0f0619] px-5 py-24 text-white lg:px-8">
      <div className="pointer-events-none absolute left-[-12%] top-[-18%] -z-10 h-[620px] w-[620px] rounded-full bg-[#7b2ee8]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-18%] right-[-12%] -z-10 h-[620px] w-[620px] rounded-full bg-[#f3dda5]/10 blur-3xl" />

      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f3dda5]/20 bg-[#f3dda5]/10 px-5 py-3 text-xs font-black text-[#f3dda5]">
              <Sparkles className="h-4 w-4" />
              איך מצטרפים
            </p>

            <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.035em] text-white sm:text-7xl">
              שלושה צעדים — ואתם בפנים לפני כולם
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-9 text-[#d8c9ef]">
              ההרשמה לא מחייבת רכישה. היא שומרת לכם מקום לקבלת עדכונים,
              הצצה ראשונה ומחירי השקה. בהמשך הקבוצה תשמש כקהילה סגורה לעסקים
              שצומחים ביחד.
            </p>

            <PulseCTA dark className="mt-8" />
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <Reveal>
            <motion.div
              whileHover={{ y: -10, scale: 1.01 }}
              transition={{ duration: 0.25 }}
              className="relative h-full overflow-hidden rounded-[38px] border border-[#eadcff] bg-[#fbf8ff] p-7 text-[#2a103c] shadow-[0_28px_90px_rgba(0,0,0,0.28)]"
            >
              <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-[#ead7ff] blur-3xl" />

              <div className="relative">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-black text-[#7b2ee8]">שלב 01</p>
                    <h3 className="mt-3 text-3xl font-black leading-[1.05] tracking-[-0.025em] text-[#2a103c]">
                      משאירים פרטים בטופס קצר וברור
                    </h3>
                  </div>

                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-[#2a103c] text-[#f3dda5]">
                    <Users className="h-8 w-8" />
                  </div>
                </div>

                <div className="biz-step-hologram relative mt-8 rounded-[32px] border border-[#eadcff] bg-white p-5">
                  <div className="biz-step-scan absolute inset-x-4 top-4 h-12 rounded-full bg-gradient-to-b from-[#7b2ee8]/16 to-transparent" />

                  {[
                    ["שם מלא", "הלקוח הבא"],
                    ["טלפון", "05X-XXX-XXXX"],
                    ["שם העסק", "סטודיו / קליניקה / חנות"],
                  ].map(([label, value], index) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: 18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.12, duration: 0.55 }}
                      className="relative mb-3 rounded-2xl border border-[#eadcff] bg-[#fbf8ff] px-4 py-3 text-right shadow-[0_12px_30px_rgba(111,39,190,0.05)]"
                    >
                      <p className="text-sm font-black text-[#7b2ee8]">
                        {label}
                      </p>
                      <p className="mt-1 text-base font-black text-[#2a103c]">
                        {value}
                      </p>
                    </motion.div>
                  ))}

                  <div className="biz-holo-check mx-auto mt-5 grid h-14 w-14 place-items-center rounded-full bg-[#7b2ee8] text-white shadow-[0_18px_45px_rgba(123,46,232,0.24)]">
                    <Check className="h-7 w-7" />
                  </div>
                </div>

                <p className="mt-6 text-base font-bold leading-8 text-[#6b587c]">
                  ממלאים שם, טלפון ושם העסק — כדי שנדע למי לשלוח את העדכונים
                  הראשונים וההזמנה לקבוצה.
                </p>
              </div>
            </motion.div>
          </Reveal>

          <Reveal delay={0.08}>
            <motion.div
              whileHover={{ y: -10, scale: 1.01 }}
              transition={{ duration: 0.25 }}
              className="relative h-full overflow-hidden rounded-[38px] border border-[#eadcff] bg-[#fbf8ff] p-7 text-[#2a103c] shadow-[0_28px_90px_rgba(0,0,0,0.28)]"
            >
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#fff0bd] blur-3xl" />

              <div className="relative">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-black text-[#7b2ee8]">שלב 02</p>
                    <h3 className="mt-3 text-3xl font-black leading-[1.05] tracking-[-0.025em] text-[#2a103c]">
                      מקבלים עדכון לפני כולם
                    </h3>
                  </div>

                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-[#2a103c] text-[#f3dda5]">
                    <BellRing className="h-8 w-8" />
                  </div>
                </div>

                <div className="relative mt-8 min-h-[260px] rounded-[32px] border border-[#eadcff] bg-white p-5">
                  <div className="biz-notification-phone mx-auto rounded-[34px] border border-[#eadcff] bg-[#150720] p-4 shadow-[0_24px_70px_rgba(42,16,60,0.18)]">
                    <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/20" />
                    <div className="space-y-3">
                      {[
                        "הקבוצה נפתחת בקרוב",
                        "הדגמה חדשה זמינה",
                        "מחירי השקה נשלחו",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className="biz-notification-pop rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-right"
                          style={{ animationDelay: `${index * 0.55}s` }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f3dda5] text-[#2a103c]">
                              <BellRing className="h-4 w-4" />
                            </span>
                            <p className="text-sm font-black text-white">
                              {item}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-base font-bold leading-8 text-[#6b587c]">
                  כשהקבוצה והעדכונים ייפתחו — אתם מקבלים התראה, הסבר והצצה
                  ראשונה לפני פתיחה רחבה.
                </p>
              </div>
            </motion.div>
          </Reveal>

          <Reveal delay={0.16}>
            <motion.div
              whileHover={{ y: -10, scale: 1.01 }}
              transition={{ duration: 0.25 }}
              className="relative h-full overflow-hidden rounded-[38px] border border-[#eadcff] bg-[#fbf8ff] p-7 text-[#2a103c] shadow-[0_28px_90px_rgba(0,0,0,0.28)]"
            >
              <div className="absolute -left-16 -bottom-16 h-44 w-44 rounded-full bg-[#f3dda5]/55 blur-3xl" />

              <div className="relative">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-black text-[#7b2ee8]">שלב 03</p>
                    <h3 className="mt-3 text-3xl font-black leading-[1.05] tracking-[-0.025em] text-[#2a103c]">
                      מצטרפים למחירי ההשקה
                    </h3>
                  </div>

                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-[#2a103c] text-[#f3dda5]">
                    <Crown className="h-8 w-8" />
                  </div>
                </div>

                <div className="biz-price-stage relative mt-8 min-h-[260px] rounded-[32px] border border-[#eadcff] bg-white p-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(243,221,165,0.42),transparent_34%)]" />

                  <div className="relative mx-auto grid h-36 w-36 place-items-center rounded-full border border-[#f3dda5] bg-white text-center shadow-[0_22px_65px_rgba(243,221,165,0.22)]">
                    <div>
                      <p className="text-sm font-black text-[#7b2ee8]">
                        EARLY ACCESS
                      </p>
                      <p className="mt-2 text-4xl font-black text-[#2a103c]">
                        ₪$
                      </p>
                      <p className="mt-1 text-sm font-black text-[#b8872c]">
                        מחיר השקה
                      </p>
                    </div>
                  </div>

                  {["₪", "$", "₪", "$", "₪", "$"].map((coin, index) => (
                    <span
                      key={`${coin}-${index}`}
                      className="biz-money-coin absolute grid h-10 w-10 place-items-center rounded-full bg-[#f3dda5] text-sm font-black text-[#2a103c] shadow-[0_14px_32px_rgba(243,221,165,0.28)]"
                      style={{
                        left: `${18 + ((index * 13) % 58)}%`,
                        animationDelay: `${index * 0.24}s`,
                      }}
                    >
                      {coin}
                    </span>
                  ))}
                </div>

                <p className="mt-6 text-base font-bold leading-8 text-[#6b587c]">
                  הנרשמים הראשונים יקבלו גישה למחירי השקה לקבוצה בלבד ולזמן
                  מוגבל.
                </p>
              </div>
            </motion.div>
          </Reveal>
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
      className="biz-readable min-h-screen overflow-x-hidden bg-[#fbf8ff] text-[#2a103c]"
    >
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .biz-readable section:not(.biz-hero-bg),
        .biz-readable section:not(.biz-hero-bg) * {
          direction: rtl;
          font-family: "Heebo", "Assistant", "Rubik", Arial, sans-serif;
        }

        .biz-readable section:not(.biz-hero-bg) {
          text-align: right;
        }

        .biz-readable section:not(.biz-hero-bg) .text-center {
          text-align: center;
        }

        .biz-readable section:not(.biz-hero-bg) h1,
        .biz-readable section:not(.biz-hero-bg) h2,
        .biz-readable section:not(.biz-hero-bg) h3,
        .biz-readable section:not(.biz-hero-bg) h4 {
          letter-spacing: -0.018em !important;
          line-height: 1.08 !important;
          font-family: "Heebo", "Assistant", "Rubik", Arial, sans-serif !important;
        }

        .biz-readable section:not(.biz-hero-bg) p,
        .biz-readable section:not(.biz-hero-bg) span,
        .biz-readable section:not(.biz-hero-bg) button,
        .biz-readable section:not(.biz-hero-bg) input,
        .biz-readable section:not(.biz-hero-bg) select,
        .biz-readable section:not(.biz-hero-bg) label {
          letter-spacing: 0 !important;
          font-family: "Heebo", "Assistant", "Rubik", Arial, sans-serif !important;
        }

        .biz-hero-bg {
          background:
            radial-gradient(circle at 18% 18%, rgba(168, 116, 255, 0.18), transparent 25%),
            radial-gradient(circle at 82% 14%, rgba(243, 221, 165, 0.12), transparent 22%),
            radial-gradient(circle at 50% 78%, rgba(160, 90, 255, 0.15), transparent 28%),
            linear-gradient(135deg, #10061b 0%, #1a0a2b 38%, #2b1245 72%, #16081f 100%);
        }

        .biz-logo-clean {
          position: relative;
          isolation: isolate;
          display: grid;
          place-items: center;
          width: clamp(230px, 25vw, 390px);
          height: clamp(92px, 10vw, 150px);
          overflow: visible;
        }

        .biz-logo-main {
          width: clamp(170px, 18vw, 300px);
          filter:
            drop-shadow(0 0 12px rgba(123, 46, 232, 0.78))
            drop-shadow(0 0 24px rgba(80, 150, 255, 0.28));
        }

        .biz-logo-white-shadow {
          position: absolute;
          z-index: 1;
          width: clamp(178px, 18.6vw, 312px);
          height: auto;
          object-fit: contain;
          opacity: 0.42;
          filter:
            brightness(0)
            invert(1)
            blur(13px)
            drop-shadow(0 0 18px rgba(255, 255, 255, 0.46))
            drop-shadow(0 0 36px rgba(243, 221, 165, 0.26));
          transform: scale(1.03);
          pointer-events: none;
          animation: bizLogoWhiteGlow 2.8s ease-in-out infinite;
        }

        .biz-logo-clean::before {
          content: "";
          position: absolute;
          z-index: 0;
          width: clamp(190px, 20vw, 340px);
          height: clamp(58px, 6vw, 98px);
          border-radius: 999px;
          background:
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.26), transparent 44%),
            radial-gradient(circle at 28% 50%, rgba(243, 221, 165, 0.2), transparent 42%),
            radial-gradient(circle at 76% 50%, rgba(201, 150, 255, 0.18), transparent 44%);
          filter: blur(24px);
          opacity: 0.88;
          animation: bizLogoSoftAura 3.8s ease-in-out infinite;
        }

        .biz-logo-clean::after {
          content: "";
          position: absolute;
          z-index: 2;
          width: clamp(210px, 21vw, 350px);
          height: clamp(74px, 7vw, 118px);
          border-radius: 999px;
          border: 1px solid rgba(243, 221, 165, 0.14);
          opacity: 0.65;
          pointer-events: none;
        }

        .biz-logo-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 5;
          border-radius: 999px;
          transform-origin: 0 0;
          pointer-events: none;
        }

        .biz-logo-dot-one {
          width: 9px;
          height: 9px;
          background: #fff7d7;
          box-shadow:
            0 0 12px rgba(255, 247, 215, 0.95),
            0 0 26px rgba(243, 221, 165, 0.78);
          animation: bizLogoDotOrbitWide 5.2s linear infinite;
        }

        .biz-logo-dot-two {
          width: 7px;
          height: 7px;
          background: #c996ff;
          box-shadow:
            0 0 12px rgba(201, 150, 255, 0.9),
            0 0 24px rgba(123, 46, 232, 0.6);
          animation: bizLogoDotOrbitWideReverse 7.4s linear infinite;
        }

        .biz-logo-dot-three {
          width: 6px;
          height: 6px;
          background: #f3dda5;
          box-shadow:
            0 0 10px rgba(243, 221, 165, 0.9),
            0 0 22px rgba(243, 221, 165, 0.58);
          animation: bizLogoDotOrbitSmall 4.6s linear infinite;
        }

        .biz-logo-dot-four {
          width: 5px;
          height: 5px;
          background: #ffffff;
          opacity: 0.72;
          box-shadow:
            0 0 10px rgba(255, 255, 255, 0.9),
            0 0 20px rgba(201, 150, 255, 0.5);
          animation: bizLogoDotOrbitSmallReverse 6.6s linear infinite;
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

        .biz-clear-cta {
          white-space: nowrap;
          letter-spacing: 0 !important;
          text-shadow: none;
        }

        .biz-pulse-cta {
          animation: bizCtaPulse 1.65s ease-in-out infinite;
        }

        .biz-clear-cta:hover {
          transform: translateY(-3px) scale(1.02);
        }

        .biz-transfer-arrow {
          animation: bizArrowPulse 1.4s ease-in-out infinite;
        }

        .biz-dashboard-scan {
          animation: bizScan 3.4s ease-in-out infinite;
        }

        .biz-pipeline-line::after {
          content: "";
          position: absolute;
          top: -3px;
          right: 0;
          width: 120px;
          height: 7px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, #f3dda5, #b68cff, transparent);
          box-shadow:
            0 0 22px rgba(243, 221, 165, 0.5),
            0 0 42px rgba(123, 46, 232, 0.35);
          animation: bizPipelineMoveRtl 6.2s linear infinite;
        }

        .biz-pipeline-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 34px;
          border: 2px solid rgba(243, 221, 165, 0);
          box-shadow:
            0 0 0 rgba(243, 221, 165, 0),
            inset 0 0 0 rgba(243, 221, 165, 0);
          opacity: 0;
          animation: bizCardGoldFrame 6.2s ease-in-out infinite;
          animation-delay: inherit;
        }

        .biz-allin-glow {
          background:
            radial-gradient(circle at 50% 50%, rgba(243, 221, 165, 0.28), transparent 38%),
            radial-gradient(circle at 50% 50%, rgba(123, 46, 232, 0.22), transparent 64%);
          filter: blur(10px);
        }

        .biz-allin-rings {
          opacity: 0.72;
          filter: drop-shadow(0 0 34px rgba(123, 46, 232, 0.08));
          mask-image: radial-gradient(circle, black 0%, black 62%, transparent 76%);
          -webkit-mask-image: radial-gradient(circle, black 0%, black 62%, transparent 76%);
        }

        .biz-orbit-spin {
          animation: bizOrbitClockwise 18s linear infinite;
          box-shadow: 0 0 80px rgba(123, 46, 232, 0.10);
        }

        .biz-orbit-spin-slow {
          animation: bizOrbitClockwise 26s linear infinite;
          box-shadow: 0 0 70px rgba(243, 221, 165, 0.12);
        }

        .biz-orbit-feature-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 28px;
          border: 1.5px solid rgba(243, 221, 165, 0);
          box-shadow: 0 0 0 rgba(243, 221, 165, 0);
          animation: bizOrbitCardGlow 4.4s ease-in-out infinite;
          animation-delay: inherit;
        }

        .biz-orbit-connector {
          z-index: -1;
          height: 2px;
          width: 130px;
          background: linear-gradient(90deg, rgba(123,46,232,0), rgba(123,46,232,0.55), rgba(243,221,165,0.65));
          transform-origin: center;
          opacity: 0;
          animation: bizConnectorReveal 4.4s ease-in-out infinite;
          animation-delay: inherit;
        }

        .biz-connector-top {
          left: 50%;
          bottom: -38px;
          transform: translateX(-50%) rotate(90deg);
        }

        .biz-connector-right-top {
          left: -100px;
          top: 72%;
          transform: rotate(-22deg);
        }

        .biz-connector-right-bottom {
          left: -98px;
          top: 22%;
          transform: rotate(24deg);
        }

        .biz-connector-bottom-right {
          left: 38%;
          top: -48px;
          transform: rotate(-58deg);
        }

        .biz-connector-bottom-left {
          right: 38%;
          top: -48px;
          transform: rotate(58deg);
        }

        .biz-connector-left-bottom {
          right: -98px;
          top: 22%;
          transform: rotate(-24deg);
        }

        .biz-connector-left-top {
          right: -100px;
          top: 72%;
          transform: rotate(22deg);
        }

        .biz-orbit-dot {
          height: 12px;
          width: 12px;
          border-radius: 999px;
          background: #f3dda5;
          box-shadow: 0 0 26px rgba(243, 221, 165, 0.76);
          animation: bizDotPulse 2.8s ease-in-out infinite;
        }

        .biz-orbit-dot-2 {
          background: #9b6cff;
          box-shadow: 0 0 26px rgba(123, 46, 232, 0.76);
          animation-delay: 0.4s;
        }

        .biz-orbit-dot-3 {
          background: #ffffff;
          box-shadow: 0 0 26px rgba(123, 46, 232, 0.55);
          animation-delay: 0.8s;
        }

        .biz-human-hologram {
          background:
            radial-gradient(circle at 16% 18%, rgba(123, 46, 232, 0.24), transparent 34%),
            radial-gradient(circle at 82% 72%, rgba(243, 221, 165, 0.12), transparent 30%),
            linear-gradient(135deg, #090211 0%, #150720 48%, #220d35 100%);
        }

        .biz-agent-shell {
          position: absolute;
          inset: 0;
          z-index: 10;
        }

        .biz-agent-svg {
          position: absolute;
          left: 50%;
          top: 49%;
          z-index: 12;
          width: min(78vw, 520px);
          max-width: 560px;
          transform: translate(-50%, -50%);
          overflow: visible;
          filter:
            drop-shadow(0 0 24px rgba(154, 104, 255, 0.42))
            drop-shadow(0 36px 90px rgba(0, 0, 0, 0.38));
          animation: bizAgentFloat 4.5s ease-in-out infinite;
        }

        .biz-agent-orbit {
          position: absolute;
          left: 50%;
          top: 48%;
          border-radius: 999px;
          pointer-events: none;
          transform: translate(-50%, -50%);
        }

        .biz-agent-orbit-one {
          width: 610px;
          height: 610px;
          border: 1px solid rgba(155, 108, 255, 0.35);
          box-shadow: 0 0 80px rgba(123, 46, 232, 0.16);
          animation: bizOrbitClockwiseCenter 18s linear infinite;
        }

        .biz-agent-orbit-two {
          width: 480px;
          height: 480px;
          border: 1px dashed rgba(243, 221, 165, 0.34);
          animation: bizOrbitClockwiseCenter 28s linear infinite;
        }

        .biz-agent-platform {
          position: absolute;
          left: 50%;
          bottom: 74px;
          width: 430px;
          height: 82px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 50% 50%, rgba(243, 221, 165, 0.38), transparent 24%),
            radial-gradient(circle at 50% 50%, rgba(155, 108, 255, 0.34), transparent 66%);
          border: 1px solid rgba(243, 221, 165, 0.28);
          transform: translateX(-50%);
          filter: blur(0.2px);
          box-shadow:
            0 0 60px rgba(243, 221, 165, 0.24),
            0 0 100px rgba(123, 46, 232, 0.28);
          animation: bizPlatformPulse 2.4s ease-in-out infinite;
        }

        .biz-agent-body {
          animation: bizAgentBreathe 4.2s ease-in-out infinite;
          transform-origin: 260px 380px;
        }

        .biz-agent-mouth {
          animation: bizAgentTalk 0.82s ease-in-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }

        .biz-mic-dot {
          animation: bizMicPulse 1s ease-in-out infinite;
        }

        .biz-agent-speaking {
          position: absolute;
          z-index: 22;
          left: 65%;
          top: 38%;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 10px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(243, 221, 165, 0.18);
          backdrop-filter: blur(12px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.16);
        }

        .biz-agent-speaking span {
          width: 5px;
          height: 18px;
          border-radius: 999px;
          background: #f3dda5;
          box-shadow: 0 0 18px rgba(243, 221, 165, 0.65);
          animation: bizVoiceBars 0.8s ease-in-out infinite;
        }

        .biz-agent-speaking span:nth-child(2) {
          animation-delay: 0.12s;
          height: 28px;
        }

        .biz-agent-speaking span:nth-child(3) {
          animation-delay: 0.24s;
          height: 14px;
        }

        .biz-agent-floating-card {
          animation: bizAgentCardFloat 4.6s ease-in-out infinite;
        }

        .biz-agent-floating-card:nth-of-type(2) {
          animation-delay: 0.4s;
        }

        .biz-agent-floating-card:nth-of-type(3) {
          animation-delay: 0.8s;
        }

        .biz-agent-wire {
          position: absolute;
          z-index: 5;
          height: 2px;
          width: 190px;
          background: linear-gradient(90deg, transparent, rgba(243,221,165,0.86), rgba(155,108,255,0.78), transparent);
          filter: drop-shadow(0 0 18px rgba(243,221,165,0.28));
          animation: bizWirePulse 2.8s ease-in-out infinite;
        }

        .biz-agent-wire-1 {
          left: 170px;
          top: 235px;
          transform: rotate(10deg);
        }

        .biz-agent-wire-2 {
          right: 154px;
          top: 270px;
          transform: rotate(-15deg);
          animation-delay: 0.4s;
        }

        .biz-agent-wire-3 {
          left: 160px;
          bottom: 220px;
          transform: rotate(-16deg);
          animation-delay: 0.8s;
        }

        .biz-agent-wire-4 {
          right: 150px;
          bottom: 210px;
          transform: rotate(16deg);
          animation-delay: 1.2s;
        }

        .biz-value-marquee {
          animation: bizValueMarquee 24s linear infinite;
        }

        .biz-step-hologram {
          overflow: hidden;
          box-shadow:
            inset 0 0 44px rgba(123, 46, 232, 0.06),
            0 22px 60px rgba(0, 0, 0, 0.18);
        }

        .biz-step-scan {
          animation: bizStepScan 2.6s ease-in-out infinite;
        }

        .biz-holo-check {
          animation: bizHoloCheckPulse 1.4s ease-in-out infinite;
        }

        .biz-notification-phone {
          width: min(100%, 290px);
          min-height: 220px;
        }

        .biz-notification-pop {
          transform-origin: 50% 0%;
          animation: bizNotificationPop 2.4s ease-in-out infinite;
        }

        .biz-price-stage {
          overflow: hidden;
        }

        .biz-money-coin {
          bottom: -48px;
          animation: bizMoneyFloat 3.2s ease-in-out infinite;
        }

        @keyframes bizLogoWhiteGlow {
          0%, 100% {
            opacity: 0.34;
            transform: scale(1.01);
          }

          50% {
            opacity: 0.55;
            transform: scale(1.06);
          }
        }

        @keyframes bizLogoSoftAura {
          0%, 100% {
            opacity: 0.62;
            transform: scale(0.96);
          }

          50% {
            opacity: 1;
            transform: scale(1.06);
          }
        }

        @keyframes bizLogoDotOrbitWide {
          from {
            transform: rotate(0deg) translateX(clamp(112px, 12vw, 185px)) rotate(0deg);
          }

          to {
            transform: rotate(360deg) translateX(clamp(112px, 12vw, 185px)) rotate(-360deg);
          }
        }

        @keyframes bizLogoDotOrbitWideReverse {
          from {
            transform: rotate(360deg) translateX(clamp(104px, 11vw, 172px)) rotate(-360deg);
          }

          to {
            transform: rotate(0deg) translateX(clamp(104px, 11vw, 172px)) rotate(0deg);
          }
        }

        @keyframes bizLogoDotOrbitSmall {
          from {
            transform: rotate(0deg) translateX(clamp(78px, 8vw, 132px)) rotate(0deg);
          }

          to {
            transform: rotate(360deg) translateX(clamp(78px, 8vw, 132px)) rotate(-360deg);
          }
        }

        @keyframes bizLogoDotOrbitSmallReverse {
          from {
            transform: rotate(360deg) translateX(clamp(68px, 7vw, 118px)) rotate(-360deg);
          }

          to {
            transform: rotate(0deg) translateX(clamp(68px, 7vw, 118px)) rotate(0deg);
          }
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

        @keyframes bizCtaPulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 0 rgba(123,46,232,0));
          }
          50% {
            transform: scale(1.055);
            filter: drop-shadow(0 0 22px rgba(123,46,232,0.28));
          }
        }

        @keyframes bizArrowPulse {
          0%, 100% {
            transform: translateX(0) scale(1);
            box-shadow: 0 24px 70px rgba(111,39,190,0.10);
          }
          50% {
            transform: translateX(-8px) scale(1.04);
            box-shadow: 0 28px 90px rgba(111,39,190,0.18);
          }
        }

        @keyframes bizPipelineMoveRtl {
          0% {
            right: 0;
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          92% {
            opacity: 1;
          }
          100% {
            right: calc(100% - 120px);
            opacity: 0;
          }
        }

        @keyframes bizCardGoldFrame {
          0%, 8%, 30%, 100% {
            opacity: 0;
            border-color: rgba(243, 221, 165, 0);
            box-shadow:
              0 0 0 rgba(243, 221, 165, 0),
              inset 0 0 0 rgba(243, 221, 165, 0);
          }

          11%, 24% {
            opacity: 1;
            border-color: rgba(243, 221, 165, 0.95);
            box-shadow:
              0 0 28px rgba(243, 221, 165, 0.34),
              inset 0 0 28px rgba(243, 221, 165, 0.08);
          }
        }

        @keyframes bizOrbitClockwise {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bizOrbitClockwiseCenter {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes bizOrbitCardGlow {
          0%, 100% {
            border-color: rgba(243, 221, 165, 0);
            box-shadow: 0 0 0 rgba(243, 221, 165, 0);
          }
          50% {
            border-color: rgba(243, 221, 165, 0.75);
            box-shadow: 0 0 28px rgba(243, 221, 165, 0.22);
          }
        }

        @keyframes bizConnectorReveal {
          0%, 100% {
            opacity: 0.16;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes bizDotPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.45;
          }
          50% {
            transform: scale(1.55);
            opacity: 1;
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

        @keyframes bizAgentFloat {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-12px);
          }
        }

        @keyframes bizAgentBreathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.012);
          }
        }

        @keyframes bizAgentTalk {
          0%, 100% {
            transform: scaleY(0.72) scaleX(1);
            opacity: 0.88;
          }
          35% {
            transform: scaleY(1.25) scaleX(1.06);
            opacity: 1;
          }
          65% {
            transform: scaleY(0.92) scaleX(0.94);
            opacity: 0.95;
          }
        }

        @keyframes bizMicPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.75;
          }
          50% {
            transform: scale(1.35);
            opacity: 1;
          }
        }

        @keyframes bizVoiceBars {
          0%, 100% {
            transform: scaleY(0.45);
            opacity: 0.55;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes bizPlatformPulse {
          0%, 100% {
            opacity: 0.55;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 0.95;
            transform: translateX(-50%) scale(1.04);
          }
        }

        @keyframes bizAgentCardFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bizWirePulse {
          0%, 100% {
            opacity: 0.18;
            filter: drop-shadow(0 0 8px rgba(243,221,165,0.16));
          }
          50% {
            opacity: 0.95;
            filter: drop-shadow(0 0 18px rgba(243,221,165,0.45));
          }
        }

        @keyframes bizValueMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(50%);
          }
        }

        @keyframes bizStepScan {
          0%, 100% {
            transform: translateY(-12px);
            opacity: 0.18;
          }
          50% {
            transform: translateY(132px);
            opacity: 0.55;
          }
        }

        @keyframes bizHoloCheckPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 18px 45px rgba(123,46,232,0.24);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 22px 65px rgba(123,46,232,0.34);
          }
        }

        @keyframes bizNotificationPop {
          0%, 100% {
            opacity: 0.72;
            transform: translateY(0) scale(1);
          }
          18% {
            opacity: 1;
            transform: translateY(-4px) scale(1.035);
          }
          36% {
            opacity: 0.88;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bizMoneyFloat {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.82);
            opacity: 0;
          }
          18% {
            opacity: 1;
          }
          72% {
            opacity: 1;
          }
          100% {
            transform: translateY(-250px) rotate(28deg) scale(1.08);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .biz-logo-white-shadow,
          .biz-logo-clean::before,
          .biz-logo-dot,
          .biz-letter,
          .biz-countdown-number,
          .biz-pulse-cta,
          .biz-transfer-arrow,
          .biz-dashboard-scan,
          .biz-pipeline-line::after,
          .biz-pipeline-card::after,
          .biz-orbit-spin,
          .biz-orbit-spin-slow,
          .biz-orbit-feature-card::after,
          .biz-orbit-connector,
          .biz-orbit-dot,
          .biz-agent-svg,
          .biz-agent-body,
          .biz-agent-mouth,
          .biz-mic-dot,
          .biz-agent-speaking span,
          .biz-agent-orbit-one,
          .biz-agent-orbit-two,
          .biz-agent-platform,
          .biz-agent-floating-card,
          .biz-agent-wire,
          .biz-value-marquee,
          .biz-step-scan,
          .biz-holo-check,
          .biz-notification-pop,
          .biz-money-coin {
            animation: none !important;
            filter: none !important;
          }
        }

        @media (max-width: 1279px) {
          .biz-orbit-feature-card {
            position: relative !important;
            left: auto !important;
            right: auto !important;
            top: auto !important;
            bottom: auto !important;
            transform: none !important;
            width: 100% !important;
          }

          .biz-orbit-connector,
          .biz-orbit-dot,
          .biz-allin-rings {
            display: none !important;
          }

          .biz-agent-floating-card {
            position: relative !important;
            inset: auto !important;
            width: 100% !important;
            margin-top: 14px;
          }

          .biz-agent-wire {
            display: none !important;
          }
        }

        @media (max-width: 767px) {
          .biz-logo-clean {
            width: min(86vw, 280px);
            height: 92px;
          }

          .biz-logo-main {
            width: min(58vw, 220px) !important;
          }

          .biz-logo-white-shadow {
            width: min(61vw, 230px) !important;
            filter:
              brightness(0)
              invert(1)
              blur(10px)
              drop-shadow(0 0 16px rgba(255, 255, 255, 0.38));
          }

          .biz-logo-clean::before {
            width: min(74vw, 250px);
            height: 66px;
            filter: blur(18px);
          }

          .biz-logo-clean::after {
            width: min(78vw, 260px);
            height: 74px;
          }

          .biz-agent-svg {
            width: min(100vw, 420px);
          }

          .biz-agent-orbit-one {
            width: 430px;
            height: 430px;
          }

          .biz-agent-orbit-two {
            width: 330px;
            height: 330px;
          }

          .biz-agent-platform {
            width: 300px;
          }
        }
      `}</style>

      <section className="biz-hero-bg relative isolate min-h-screen overflow-hidden px-4 pb-10 pt-8 sm:px-5 lg:px-8">
        <div className="pointer-events-none absolute left-[-3%] top-[5%] -z-10 h-[360px] w-[360px] rounded-full bg-[#8f63ff]/16 blur-3xl" />
        <div className="pointer-events-none absolute right-[4%] top-[12%] -z-10 h-[280px] w-[280px] rounded-full bg-[#e8d6a5]/12 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[7%] left-[14%] -z-10 h-[330px] w-[330px] rounded-full bg-[#d7b2ff]/12 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#13081b]/20 to-transparent" />

        <div className="mx-auto flex min-h-[100svh] w-full max-w-[1500px] flex-col items-center justify-center px-2 py-6 text-center sm:min-h-[calc(100vh-48px)] sm:px-4">
          <div className="flex w-full flex-col items-center justify-center gap-3 sm:gap-4 lg:gap-5">
            <BigLogo />
            <FallingHeadline />
            <Countdown />
          </div>
        </div>
      </section>

      <ProblemToSolutionSection />
      <ConversionMachineSection />
      <AllInOneOrbitSection />
      <HologramHumanSection />
      <LaunchValueSection />
      <LaunchStepsSection />

      <section
        id="early-access"
        className="relative isolate overflow-hidden bg-[#fbf8ff] px-5 py-24 text-[#2a103c] lg:px-8"
      >
        <div className="absolute left-0 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#ead7ff] blur-3xl" />
        <div className="absolute bottom-0 right-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#fff0bd] blur-3xl" />

        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Reveal>
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-[#7b2ee8] shadow-[0_12px_34px_rgba(111,39,190,0.06)]">
                <Clock3 className="h-4 w-4" />
                הרשמה מוקדמת פתוחה
              </p>

              <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.035em] text-[#2a103c] sm:text-7xl">
                רוצים להיות בין הראשונים שמקבלים מחיר השקה וגישה ראשונה למערכת?
              </h2>

              <p className="mt-6 max-w-xl text-lg font-semibold leading-9 text-[#6b587c]">
                השאירו פרטים ונחזור אליכם לפני כולם. בקרוב תיפתח קבוצת וואטסאפ
                עם כל הפרטים, ההדגמות, העדכונים ומחירי ההשקה לקבוצה בלבד.
                בהמשך הקבוצה תשמש כקהילה סגורה לעסקים שצומחים ביחד.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "בלי התחייבות", icon: ShieldCheck },
                  { label: "עדכונים לפני כולם", icon: Zap },
                  { label: "קהילה סגורה", icon: Users },
                  { label: "מחירי השקה", icon: Crown },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-2xl border border-[#eadcff] bg-white p-4 shadow-[0_14px_38px_rgba(111,39,190,0.05)]"
                    >
                      <Icon className="h-5 w-5 text-[#7b2ee8]" />
                      <span className="font-black text-[#2a103c]">
                        {item.label}
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
                    <h3 className="mt-6 text-4xl font-black tracking-[-0.02em] text-[#2a103c]">
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
                    <h3 className="mt-2 text-4xl font-black leading-none tracking-[-0.02em] text-[#2a103c]">
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
                        מה הכי מעניין אותך
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
                        <option value="community">קהילה עסקית סגורה</option>
                        <option value="all">הכל ביחד</option>
                      </select>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid}
                    className={cx(
                      "biz-pulse-cta mt-6 inline-flex min-h-[64px] w-full items-center justify-center gap-3 rounded-full px-6 text-base font-black leading-none transition sm:min-h-[70px] sm:px-8 sm:text-lg",
                      isValid
                        ? "border border-[#ffe9b8] bg-gradient-to-br from-[#fff9de] via-[#f3dda5] to-[#c996ff] text-[#230934] shadow-[0_20px_60px_rgba(196,150,255,0.24)] hover:-translate-y-1 hover:from-[#fffbe8] hover:via-[#f4e2a2] hover:to-[#b884ff]"
                        : "cursor-not-allowed bg-zinc-200 text-zinc-400",
                    )}
                  >
                    שלחו לי פרטים והזמנה לקבוצה
                    <Phone className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
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

      <section className="relative isolate overflow-hidden bg-[#0f0619] px-5 py-24 text-white lg:px-8">
        <div className="pointer-events-none absolute left-[-12%] top-[-18%] -z-10 h-[620px] w-[620px] rounded-full bg-[#7b2ee8]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] -z-10 h-[620px] w-[620px] rounded-full bg-[#f3dda5]/10 blur-3xl" />

        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div>
              <p className="mb-4 inline-flex rounded-full border border-[#f3dda5]/20 bg-[#f3dda5]/10 px-4 py-2 text-xs font-black text-[#f3dda5]">
                שאלות נפוצות
              </p>
              <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.035em] text-white sm:text-7xl">
                כל מה שצריך לדעת לפני ההצטרפות
              </h2>

              <PulseCTA dark className="mt-8" />
            </div>
          </Reveal>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Reveal key={faq.q} delay={index * 0.05}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="w-full rounded-[28px] border border-white/10 bg-white/[0.06] p-5 text-right transition hover:bg-white/[0.09] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
                >
                  <div className="flex items-center justify-between gap-5">
                    <h3 className="text-xl font-black tracking-[-0.02em] text-white">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={cx(
                        "h-5 w-5 shrink-0 text-[#f3dda5] transition",
                        openFaq === index && "rotate-180",
                      )}
                    />
                  </div>

                  {openFaq === index ? (
                    <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-[#d8c9ef]">
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
            className="biz-pulse-cta inline-flex items-center justify-center gap-2 rounded-full bg-[#7b2ee8] px-6 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#6724c9]"
          >
            להרשמה מוקדמת
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </div>
      </footer>
    </main>
  );
}