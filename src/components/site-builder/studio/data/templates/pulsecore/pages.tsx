import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Dumbbell,
  Flame,
  HeartPulse,
  Mail,
  Menu,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  X,
  Zap,
} from "lucide-react";

import { pulsecoreImages } from "./pulsecoreData";
import { pulsecoreEditorCss } from "./editorCss";

export type PulsecorePageId =
  | "home"
  | "programs"
  | "trainers"
  | "pricing"
  | "schedule"
  | "contact";

type PulsecorePageInput = PulsecorePageId | string;

export const pulsecorePages: Array<{
  id: PulsecorePageId;
  name: string;
  slug: string;
}> = [
  { id: "home", name: "בית", slug: "/" },
  { id: "programs", name: "תוכניות", slug: "/תוכניות" },
  { id: "trainers", name: "מאמנים", slug: "/מאמנים" },
  { id: "pricing", name: "מחירים", slug: "/מחירים" },
  { id: "schedule", name: "מערכת שעות", slug: "/מערכת-שעות" },
  { id: "contact", name: "הצטרפות", slug: "/הצטרפות" },
];

type PulsecorePagesProps = {
  initialPage?: PulsecorePageInput;
  isStudioStatic?: boolean;
};

const navItems: Array<{ id: PulsecorePageId; label: string }> = [
  { id: "home", label: "בית" },
  { id: "programs", label: "תוכניות" },
  { id: "trainers", label: "מאמנים" },
  { id: "pricing", label: "מחירים" },
  { id: "schedule", label: "שעות" },
];

const stats = [
  { label: "מתאמנים פעילים", value: "2,400+" },
  { label: "אימונים בשבוע", value: "68" },
  { label: "שיפור ממוצע", value: "34%" },
];

const programs = [
  {
    title: "HIIT Burn",
    text: "אימון קצר, חד ועוצמתי שמשלב דופק גבוה, כוח ותנועה מהירה.",
    icon: Flame,
    color: "#FF4D1D",
  },
  {
    title: "Strength Lab",
    text: "אימוני כוח מדויקים לבניית שריר, יציבה, שליטה וביטחון.",
    icon: Dumbbell,
    color: "#D7FF36",
  },
  {
    title: "Mobility Flow",
    text: "תנועה, גמישות והתאוששות כדי לשמור על גוף חזק לאורך זמן.",
    icon: HeartPulse,
    color: "#8B5CF6",
  },
];

const trainers = [
  {
    name: "נועה רייך",
    role: "מאמנת כוח ותנועה",
    text: "מתמחה בבניית תוכניות אישיות, טכניקה נכונה ושיפור ביצועים.",
  },
  {
    name: "דניאל כהן",
    role: "מאמן HIIT ופונקציונלי",
    text: "מוביל אימונים אנרגטיים עם דגש על קצב, התמדה ותוצאות.",
  },
  {
    name: "מאיה לוי",
    role: "מאמנת מוביליטי",
    text: "עוזרת למתאמנים לזוז טוב יותר, להימנע מעומסים ולהתחזק נכון.",
  },
];

const plans = [
  {
    name: "Basic",
    price: "₪249",
    text: "למי שרוצה להתחיל לזוז בקצב נוח.",
    items: ["2 אימונים בשבוע", "גישה לאפליקציה", "קבוצת וואטסאפ"],
  },
  {
    name: "Pro",
    price: "₪399",
    text: "המסלול הפופולרי למי שרוצה תוצאות עקביות.",
    items: ["אימונים ללא הגבלה", "בדיקת מדדים חודשית", "ליווי מאמן"],
    featured: true,
  },
  {
    name: "Elite",
    price: "₪690",
    text: "ליווי אישי מלא למי שרוצה תוכנית מדויקת.",
    items: ["תוכנית אישית", "2 פגישות מאמן בחודש", "מעקב תזונה והרגלים"],
  },
];

const schedule = [
  { day: "ראשון", time: "07:00", name: "HIIT Burn" },
  { day: "ראשון", time: "19:00", name: "Strength Lab" },
  { day: "שני", time: "18:30", name: "Mobility Flow" },
  { day: "שלישי", time: "07:30", name: "Power Circuit" },
  { day: "רביעי", time: "20:00", name: "HIIT Burn" },
  { day: "חמישי", time: "18:00", name: "Strength Lab" },
];

function resolvePulsecorePageId(
  value: PulsecorePageInput | undefined,
): PulsecorePageId {
  const clean = String(value || "home")
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .toLowerCase();

  if (!clean || clean === "home" || clean === "בית") return "home";

  if (
    clean === "programs" ||
    clean === "classes" ||
    clean === "services" ||
    clean === "תוכניות" ||
    clean === "שיעורים"
  ) {
    return "programs";
  }

  if (
    clean === "trainers" ||
    clean === "team" ||
    clean === "מאמנים" ||
    clean === "צוות"
  ) {
    return "trainers";
  }

  if (
    clean === "pricing" ||
    clean === "prices" ||
    clean === "plans" ||
    clean === "מחירים" ||
    clean === "מנויים"
  ) {
    return "pricing";
  }

  if (
    clean === "schedule" ||
    clean === "calendar" ||
    clean === "מערכת-שעות" ||
    clean === "מערכת שעות" ||
    clean === "שעות"
  ) {
    return "schedule";
  }

  if (
    clean === "contact" ||
    clean === "join" ||
    clean === "signup" ||
    clean === "הצטרפות" ||
    clean === "יצירת-קשר" ||
    clean === "יצירת קשר"
  ) {
    return "contact";
  }

  return "home";
}

function PulseButton({
  children,
  onClick,
  variant = "accent",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "accent" | "orange" | "dark" | "light";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-editable-link="true"
      className={[
        "inline-flex h-14 items-center justify-center gap-3 rounded-full px-7 text-sm font-black tracking-[0.08em] transition duration-300 active:scale-[0.98]",
        variant === "accent"
          ? "bg-[#D7FF36] text-black hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(215,255,54,0.35)]"
          : variant === "orange"
            ? "bg-[#FF4D1D] text-white hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(255,77,29,0.35)]"
            : variant === "dark"
              ? "bg-black text-white hover:-translate-y-1"
              : "border border-white/15 bg-white/10 text-white hover:-translate-y-1 hover:bg-white/18",
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
  activePage: PulsecorePageId;
  onPageChange: (page: PulsecorePageId) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="absolute left-0 right-0 top-0 z-50 px-5 py-5 text-white">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between rounded-full border border-white/10 bg-black/35 px-5 py-3 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => onPageChange("home")}
          className="flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D7FF36] text-black">
            <Zap className="h-5 w-5" />
          </span>

          <span className="text-xl font-black tracking-[-0.04em]">
            PulseCore
          </span>
        </button>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onPageChange(item.id)}
              className={[
                "text-sm font-black transition hover:text-[#D7FF36]",
                activePage === item.id ? "text-[#D7FF36]" : "text-white/75",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:block">
          <PulseButton onClick={() => onPageChange("contact")}>
            אימון ניסיון
            <ArrowLeft className="h-4 w-4" />
          </PulseButton>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-4 grid max-w-[1320px] gap-2 rounded-[28px] bg-white p-3 text-black shadow-2xl lg:hidden">
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

          <button
            type="button"
            onClick={() => {
              onPageChange("contact");
              setMobileOpen(false);
            }}
            className="rounded-2xl bg-black px-4 py-3 text-right text-sm font-black text-white"
          >
            אימון ניסיון
          </button>
        </div>
      )}
    </header>
  );
}

function HeroFloatingStats() {
  return (
    <div className="absolute bottom-6 left-5 z-20 hidden gap-4 lg:flex">
      <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-4 text-white shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5">
          <HeartPulse className="h-5 w-5" />
        </span>

        <div className="text-right">
          <p className="text-sm font-black">BPM 148</p>
          <p className="text-xs font-bold text-white/45">דופק ממוצע</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-4 text-white shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5">
          <Timer className="h-5 w-5" />
        </span>

        <div className="text-right">
          <p className="text-sm font-black">45 דקות</p>
          <p className="text-xs font-bold text-white/45">אימון ממוקד</p>
        </div>
      </div>
    </div>
  );
}

function HeroSection({
  onPageChange,
}: {
  onPageChange: (page: PulsecorePageId) => void;
}) {
  return (
    <section className="relative min-h-[920px] overflow-hidden bg-[#080808] px-5 pb-16 pt-28 text-white md:min-h-screen md:pt-32">
      <img
        data-gjs-type="image"
        src={pulsecoreImages.hero}
        alt="אימון פיטנס עוצמתי"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.42)_32%,rgba(0,0,0,0.55)_66%,rgba(0,0,0,0.94)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_72%,rgba(255,77,29,0.38),transparent_31%),radial-gradient(circle_at_88%_18%,rgba(215,255,54,0.22),transparent_30%),radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),rgba(0,0,0,0.62)_72%)]" />
      <div className="pulsecore-grid-bg absolute inset-0 opacity-30" />

      <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1320px] flex-col items-center justify-center text-center md:min-h-[calc(100vh-8rem)]">
        <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black text-white/80 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
          <Sparkles className="h-4 w-4 text-[#D7FF36]" />
          סטודיו פרטי לאימונים מותאמים אישית
        </div>

        <h1
          data-gjs-type="text"
          className="mx-auto max-w-6xl text-6xl font-black leading-[0.88] tracking-[-0.09em] drop-shadow-[0_14px_35px_rgba(0,0,0,0.75)] md:text-8xl lg:text-[112px]"
        >
          אימון חזק.
          <span className="block text-[#D7FF36]">אנרגיה גבוהה.</span>
          תוצאה ברורה.
        </h1>

        <p
          data-gjs-type="text"
          className="mx-auto mt-8 max-w-2xl text-base font-semibold leading-8 text-white/76 drop-shadow-[0_10px_25px_rgba(0,0,0,0.75)] md:text-lg"
        >
          תכנית כושר אישית, מותאמת, סטודיו פרטי וחדר כושר פרימיום להצגת
          תוצאות אימון אמיתיות, מחירים והצטרפות מהירה.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <PulseButton onClick={() => onPageChange("contact")}>
            לקביעת אימון ניסיון
            <ArrowLeft className="h-4 w-4" />
          </PulseButton>

          <PulseButton variant="light" onClick={() => onPageChange("programs")}>
            לראות תוכניות
            <Play className="h-4 w-4" />
          </PulseButton>
        </div>
      </div>

      <div className="absolute left-6 top-28 z-20 hidden items-center gap-3 rounded-full border border-white/14 bg-white/10 px-4 py-3 text-xs font-black text-white shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:flex lg:top-32">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D7FF36] text-black">
          <Flame className="h-4 w-4" />
        </span>
        אימון ניסיון זמין השבוע
      </div>

      <HeroFloatingStats />
    </section>
  );
}

function MarqueeSection() {
  const words = [
    "כוח",
    "דופק",
    "תנועה",
    "תוצאות",
    "קהילה",
    "מוטיבציה",
    "התמדה",
    "אנרגיה",
  ];

  const repeated = [...words, ...words, ...words];

  return (
    <section className="overflow-hidden border-y border-white/10 bg-[#FF4D1D] py-5 text-black">
      <div className="pulsecore-marquee-track flex w-max gap-10">
        {repeated.map((word, index) => (
          <div key={`${word}-${index}`} className="flex items-center gap-10">
            <span className="text-5xl font-black tracking-[-0.07em]">
              {word}
            </span>
            <Star className="h-7 w-7 fill-current" />
          </div>
        ))}
      </div>
    </section>
  );
}

function ProgramsSection({
  onPageChange,
}: {
  onPageChange: (page: PulsecorePageId) => void;
}) {
  return (
    <section className="bg-[#0D0D0D] px-5 py-28 text-white">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black tracking-[0.32em] text-[#D7FF36]">
              תוכניות אימון
            </p>

            <h2 className="mt-5 max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.08em] md:text-8xl">
              בחרו את האימון
              <br />
              שמדליק אתכם
            </h2>
          </div>

          <PulseButton onClick={() => onPageChange("contact")}>
            להצטרפות
            <ArrowLeft className="h-4 w-4" />
          </PulseButton>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {programs.map((program) => {
            const Icon = program.icon;

            return (
              <article
                key={program.title}
                className="group min-h-[390px] overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.06] p-8 transition duration-300 hover:-translate-y-4 hover:bg-white hover:text-black"
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full text-black transition duration-300 group-hover:rotate-12 group-hover:scale-110"
                  style={{ background: program.color }}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-24 text-4xl font-black tracking-[-0.06em]">
                  {program.title}
                </h3>

                <p className="mt-6 text-base font-medium leading-8 text-white/55 group-hover:text-black/55">
                  {program.text}
                </p>

                <button
                  type="button"
                  onClick={() => onPageChange("contact")}
                  className="mt-8 inline-flex items-center gap-3 text-sm font-black text-[#D7FF36] group-hover:text-black"
                >
                  הרשמה לאימון
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TrainersSection() {
  return (
    <section className="bg-[#D7FF36] px-5 py-28 text-black">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-14 text-center">
          <p className="text-sm font-black tracking-[0.32em] text-black/45">
            הצוות
          </p>

          <h2 className="mx-auto mt-5 max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.08em] md:text-8xl">
            מאמנים שמרימים אתכם קדימה
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {trainers.map((trainer, index) => (
            <article
              key={trainer.name}
              className="group overflow-hidden rounded-[34px] bg-black text-white transition duration-300 hover:-translate-y-4"
            >
              <img
                src={[
                  pulsecoreImages.trainer,
                  pulsecoreImages.boxing,
                  pulsecoreImages.workout,
                ][index]}
                alt={trainer.name}
                className="h-[430px] w-full object-cover opacity-88 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
              />

              <div className="p-7">
                <p className="text-sm font-black text-[#D7FF36]">
                  {trainer.role}
                </p>

                <h3 className="mt-2 text-3xl font-black tracking-[-0.06em]">
                  {trainer.name}
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/55">
                  {trainer.text}
                </p>
              </div>
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
  onPageChange: (page: PulsecorePageId) => void;
}) {
  return (
    <section className="bg-[#080808] px-5 py-28 text-white">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-14 text-center">
          <p className="text-sm font-black tracking-[0.32em] text-[#FF4D1D]">
            מנויים
          </p>

          <h2 className="mx-auto mt-5 max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.08em] md:text-8xl">
            מסלול שמתאים לקצב שלכם
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={[
                "rounded-[34px] border p-8 transition duration-300 hover:-translate-y-3",
                plan.featured
                  ? "border-[#D7FF36] bg-[#D7FF36] text-black shadow-[0_30px_90px_rgba(215,255,54,0.18)]"
                  : "border-white/10 bg-white/[0.06] text-white",
              ].join(" ")}
            >
              <p className="text-sm font-black opacity-55">{plan.name}</p>

              <h3 className="mt-7 text-6xl font-black tracking-[-0.08em]">
                {plan.price}
              </h3>

              <p className="mt-4 text-sm leading-7 opacity-60">{plan.text}</p>

              <div className="mt-8 grid gap-3">
                {plan.items.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-bold">
                    <CheckCircle2
                      className={[
                        "h-5 w-5",
                        plan.featured ? "text-black" : "text-[#D7FF36]",
                      ].join(" ")}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onPageChange("contact")}
                className={[
                  "mt-9 h-12 w-full rounded-full text-sm font-black transition hover:-translate-y-1",
                  plan.featured
                    ? "bg-black text-white"
                    : "bg-[#D7FF36] text-black",
                ].join(" ")}
              >
                להצטרפות
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScheduleSection({
  onPageChange,
}: {
  onPageChange: (page: PulsecorePageId) => void;
}) {
  return (
    <section className="bg-[#111] px-5 py-28 text-white">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black tracking-[0.32em] text-[#D7FF36]">
              מערכת שעות
            </p>

            <h2 className="mt-5 max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.08em] md:text-8xl">
              שבוע מלא באנרגיה
            </h2>
          </div>

          <PulseButton variant="orange" onClick={() => onPageChange("contact")}>
            שמירת מקום
            <CalendarDays className="h-4 w-4" />
          </PulseButton>
        </div>

        <div className="grid gap-3">
          {schedule.map((item, index) => (
            <article
              key={`${item.day}-${item.time}-${item.name}`}
              className="group grid gap-4 rounded-[28px] border border-white/10 bg-white/[0.06] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-black md:grid-cols-[1fr_1fr_1.5fr_auto]"
            >
              <p className="text-xl font-black">{item.day}</p>
              <p className="text-xl font-black text-[#D7FF36] group-hover:text-black">
                {item.time}
              </p>
              <p className="text-xl font-black">{item.name}</p>

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF4D1D] text-white">
                {index + 1}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="bg-[#FF4D1D] px-5 py-28 text-white">
      <div className="mx-auto max-w-[1320px] rounded-[40px] bg-black p-8 lg:p-14">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <BadgeCheck className="h-14 w-14 text-[#D7FF36]" />

            <h2 className="mt-7 text-5xl font-black leading-[0.95] tracking-[-0.08em] md:text-7xl">
              אנשים שמרגישים את השינוי
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              "הפעם הראשונה שהתמדתי יותר מחודשיים — וזה פשוט עובד.",
              "האימונים קצרים, חזקים ומדויקים. סוף סוף רואים תוצאות.",
              "הצוות נותן תחושה אישית גם בקבוצה.",
              "המערכת והאווירה גורמות לי להגיע גם כשאין כוח.",
            ].map((text, index) => (
              <article
                key={index}
                className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6"
              >
                <p className="text-sm leading-7 text-white/70">“{text}”</p>

                <div className="mt-5 flex gap-1 text-[#D7FF36]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const faqs = [
    {
      q: "צריך ניסיון קודם?",
      a: "לא. יש התאמה לפי רמה, קצב ומטרה אישית.",
    },
    {
      q: "אפשר להגיע לאימון ניסיון?",
      a: "כן. אפשר להשאיר פרטים ולקבוע אימון ראשון ללא התחייבות.",
    },
    {
      q: "יש תוכניות אישיות?",
      a: "כן. במסלולים המתקדמים אפשר לקבל תוכנית מותאמת ומעקב מאמן.",
    },
  ];

  return (
    <section className="bg-[#080808] px-5 py-28 text-white">
      <div className="mx-auto max-w-[980px]">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.32em] text-[#D7FF36]">
            שאלות נפוצות
          </p>

          <h2 className="mt-5 text-6xl font-black leading-[0.9] tracking-[-0.08em]">
            לפני שמתחילים
          </h2>
        </div>

        <div className="mt-12 grid gap-4">
          {faqs.map((faq) => (
            <article
              key={faq.q}
              className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6"
            >
              <h3 className="text-2xl font-black">{faq.q}</h3>
              <p className="mt-3 text-sm leading-7 text-white/55">{faq.a}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="bg-[#D7FF36] px-5 py-28 text-black">
      <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[40px] bg-black p-8 text-white lg:p-12">
          <ShieldCheck className="h-14 w-14 text-[#D7FF36]" />

          <h2 className="mt-7 text-5xl font-black leading-[0.95] tracking-[-0.08em] md:text-7xl">
            מוכנים להתחיל לזוז?
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/60">
            השאירו פרטים ונחזור אליכם לתיאום אימון ניסיון, התאמת מסלול או
            שיחת היכרות קצרה.
          </p>
        </div>

        <form className="grid gap-4 rounded-[40px] bg-white p-8 lg:p-12">
          <input
            placeholder="שם מלא"
            className="h-14 rounded-2xl border border-black/10 px-5 text-sm font-bold outline-none"
          />

          <input
            placeholder="טלפון"
            className="h-14 rounded-2xl border border-black/10 px-5 text-sm font-bold outline-none"
          />

          <input
            placeholder="מטרה עיקרית"
            className="h-14 rounded-2xl border border-black/10 px-5 text-sm font-bold outline-none"
          />

          <textarea
            placeholder="מה חשוב לנו לדעת?"
            className="min-h-36 rounded-2xl border border-black/10 p-5 text-sm font-bold outline-none"
          />

          <button
            type="button"
            className="h-14 rounded-full bg-black text-sm font-black text-white transition hover:-translate-y-1"
          >
            שליחה
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer({
  onPageChange,
}: {
  onPageChange: (page: PulsecorePageId) => void;
}) {
  return (
    <footer className="bg-black px-5 py-14 text-white">
      <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="text-3xl font-black tracking-[-0.06em]">PulseCore</p>

          <p className="mt-5 max-w-md text-sm leading-7 text-white/45">
            תבנית פיטנס אנרגטית למאמנים, חדרי כושר וסטודיואים שרוצים אתר
            שמרגיש חזק, חי וממיר.
          </p>
        </div>

        <div>
          <p className="text-sm font-black text-white/35">עמודים</p>

          <div className="mt-4 grid gap-2">
            {pulsecorePages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => onPageChange(page.id)}
                className="text-right text-sm font-bold text-white/55 transition hover:text-white"
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-black text-white/35">עדכונים</p>

          <div className="mt-4 flex rounded-full border border-white/10 bg-white/[0.06] p-1">
            <input
              placeholder="אימייל"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm font-bold outline-none placeholder:text-white/30"
            />

            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D7FF36] text-black">
              <Mail className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PulsecoreShell({
  activePage,
  onPageChange,
  children,
}: {
  activePage: PulsecorePageId;
  onPageChange: (page: PulsecorePageId) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      data-template-id="pulsecore"
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[#080808] text-white"
    >
      <style>{pulsecoreEditorCss}</style>

      <Header activePage={activePage} onPageChange={onPageChange} />
      {children}
      <Footer onPageChange={onPageChange} />
    </div>
  );
}

function HomePage({
  onPageChange,
}: {
  onPageChange: (page: PulsecorePageId) => void;
}) {
  return (
    <main>
      <HeroSection onPageChange={onPageChange} />
      <MarqueeSection />
      <ProgramsSection onPageChange={onPageChange} />
      <TrainersSection />
      <PricingSection onPageChange={onPageChange} />
      <ScheduleSection onPageChange={onPageChange} />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
    </main>
  );
}

function SimplePage({
  title,
  label,
  children,
}: {
  title: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <main className="bg-[#080808] px-5 pb-24 pt-40 text-white">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black text-[#D7FF36]">
          {label}
        </div>

        <h1 className="max-w-5xl text-6xl font-black leading-[0.9] tracking-[-0.08em] md:text-8xl">
          {title}
        </h1>

        <div className="mt-14">{children}</div>
      </div>
    </main>
  );
}

export default function PulsecorePages({
  initialPage = "home",
}: PulsecorePagesProps) {
  const [activePage, setActivePage] = useState<PulsecorePageId>(() =>
    resolvePulsecorePageId(initialPage),
  );

  const siteRootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActivePage(resolvePulsecorePageId(initialPage));
  }, [initialPage]);

  const content = useMemo(() => {
    if (activePage === "home") {
      return <HomePage onPageChange={setActivePage} />;
    }

    if (activePage === "programs") {
      return (
        <SimplePage title="תוכניות אימון לכל רמה וקצב" label="תוכניות">
          <ProgramsSection onPageChange={setActivePage} />
        </SimplePage>
      );
    }

    if (activePage === "trainers") {
      return (
        <SimplePage title="מאמנים שמלווים אתכם עד התוצאה" label="מאמנים">
          <TrainersSection />
        </SimplePage>
      );
    }

    if (activePage === "pricing") {
      return (
        <SimplePage title="מנויים גמישים לפי מטרה" label="מחירים">
          <PricingSection onPageChange={setActivePage} />
        </SimplePage>
      );
    }

    if (activePage === "schedule") {
      return (
        <SimplePage title="מערכת שעות שבועית" label="מערכת שעות">
          <ScheduleSection onPageChange={setActivePage} />
        </SimplePage>
      );
    }

    return (
      <SimplePage title="קבעו אימון ניסיון" label="הצטרפות">
        <ContactSection />
      </SimplePage>
    );
  }, [activePage]);

  return (
    <div ref={siteRootRef}>
      <PulsecoreShell activePage={activePage} onPageChange={setActivePage}>
        {content}
      </PulsecoreShell>
    </div>
  );
}