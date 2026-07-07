import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleDot,
  Code2,
  Gem,
  Layers3,
  LineChart,
  Menu,
  MousePointer2,
  Palette,
  Plus,
  Quote,
  Sparkles,
  Star,
  Target,
  X,
  Zap,
} from "lucide-react";

type LaunchoraPageId = "home";

type LaunchoraPagesProps = {
  initialPage?: LaunchoraPageId;
  mode?: "preview" | "editor" | "live";
};

const navItems = [
  { label: "עבודות", href: "#work" },
  { label: "שירותים", href: "#services" },
  { label: "אודות", href: "#about" },
  { label: "שאלות", href: "#resources" },
  { label: "מחירון", href: "#pricing" },
];

const clientLogos = [
  "נורת׳ליין",
  "קלאודקרסט",
  "שייפפיק",
  "לונאר",
  "ורטקס",
  "פילאר",
  "ברייטסייד",
];

const projects = [
  {
    title: "פלטפורמת פיננסים לעסקים מודרניים.",
    tag: "עיצוב אתר",
    name: "קלירבנק",
    desc: "עיצוב מערכת Web App",
    tone: "from-[#edf4ff] via-[#f7fbff] to-white",
    dark: false,
  },
  {
    title: "מותג ביצועים שנבנה לתנועה.",
    tag: "מיתוג",
    name: "ולורה",
    desc: "מיתוג וארט דיירקשן",
    tone: "from-[#050505] via-[#101010] to-[#202020]",
    dark: true,
  },
  {
    title: "עיצוב נקי, מדויק ויוקרתי לבית.",
    tag: "איקומרס",
    name: "הרמן סטודיו",
    desc: "חוויית חנות דיגיטלית",
    tone: "from-[#fff0df] via-[#fff8ef] to-white",
    dark: false,
  },
];

const services = [
  {
    title: "אסטרטגיית מותג",
    desc: "מיצוב, מסרים וזהות ויזואלית שמבליטים את העסק.",
    icon: Target,
  },
  {
    title: "עיצוב אתרים",
    desc: "אתרים יוקרתיים וממוקדי המרה שמותאמים למטרות העסק.",
    icon: Palette,
  },
  {
    title: "עיצוב מוצר",
    desc: "חוויות דיגיטליות אינטואיטיביות שפותרות בעיות אמיתיות.",
    icon: Layers3,
  },
  {
    title: "פיתוח",
    desc: "בנייה מהירה, רספונסיבית ומדויקת עם React, Tailwind ו־CMS.",
    icon: Code2,
  },
];

const testimonials = [
  {
    name: "שרה לין",
    role: "מנהלת שיווק, קלירבנק",
    text: "הצוות הפך את המותג והאתר שלנו למשהו שהלקוחות באמת מתחברים אליו. התוצאה מרגישה מדויקת, יוקרתית וממירה.",
    featured: true,
  },
  {
    name: "דוד פארק",
    role: "מנכ״ל, נורת׳ליין",
    text: "התהליך היה חלק מהשיחה הראשונה ועד ההשקה. ראינו שיפור משמעותי כבר בחודש הראשון.",
    featured: false,
  },
  {
    name: "מאיה פטל",
    role: "מייסדת שותפה, שייפפיק",
    text: "עיצוב ברמה גבוהה, ירידה לפרטים וחוויית עבודה מצוינת. ממליצה בחום.",
    featured: false,
  },
];

const pricing = [
  {
    name: "חבילת צמיחה",
    desc: "מתאימה לעסקים בתחילת הדרך ולעסקים שרוצים אתר פרימיום ראשון.",
    price: "₪6,500",
    label: "מחיר חד־פעמי",
    cta: "התחלת פרויקט",
    featured: true,
    features: [
      "סדנת אסטרטגיית מותג",
      "עיצוב אתר עד 10 עמודים",
      "רספונסיבי ומוכן ל־SEO",
      "חודש תמיכה לאחר ההשקה",
    ],
  },
  {
    name: "חבילת סקייל",
    desc: "מתאימה לחברות שרוצות להעלות רמה, להתרחב ולבנות מערכת מלאה.",
    price: "₪12,000",
    label: "החל מ־",
    cta: "קביעת שיחה",
    featured: false,
    features: [
      "כל מה שכלול בחבילת צמיחה",
      "אנימציות ואינטראקציות מתקדמות",
      "CMS ואינטגרציות",
      "3 חודשי תמיכה מועדפת",
    ],
  },
];

const faqs = [
  {
    q: "כמה זמן לוקח פרויקט ממוצע?",
    a: "פרויקט ממוקד בדרך כלל לוקח 2–4 שבועות. פרויקט רחב יותר של מיתוג, אתר ומערכת עמודים יכול לקחת 4–8 שבועות לפי היקף העבודה.",
  },
  {
    q: "האם אתם עובדים גם עם עסקים קטנים?",
    a: "כן. התבנית מתאימה לעסקים קטנים, סטודיו, יועצים, סוכנויות, מעצבים, יוצרים ונותני שירותי פרימיום.",
  },
  {
    q: "באילו כלים משתמשים?",
    a: "העיצוב מרגיש כמו Framer/Webflow, אבל הקוד בנוי ב־React, TSX ו־Tailwind כדי שיהיה קל לחבר אותו למערכת שלך.",
  },
  {
    q: "אפשר להמשיך לליווי אחרי ההשקה?",
    a: "כן. אפשר להציע גם פרויקט חד־פעמי וגם ריטיינר חודשי לצמיחה, שיפורים, עמודים נוספים ואופטימיזציה.",
  },
];

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      },
      { threshold: 0.16 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return ref;
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useReveal();

  return (
    <div
      ref={ref}
      className={`launchora-reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function AvatarStack() {
  const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80",
  ];

  return (
    <div className="flex items-center">
      {avatars.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm"
          style={{ marginRight: index === 0 ? 0 : -10 }}
        />
      ))}
    </div>
  );
}

function HeroCards() {
  return (
    <div className="relative mx-auto mt-10 h-[360px] w-full max-w-[620px] sm:h-[420px] lg:mt-0">
      <div className="absolute inset-0 rounded-full bg-[#7aa7ff]/20 blur-3xl" />

      <div className="launchora-float-slow absolute right-3 top-16 h-60 w-48 rotate-[8deg] overflow-hidden rounded-[2rem] border border-white/20 bg-black p-5 text-white shadow-2xl sm:right-8 sm:h-72 sm:w-56">
        <div className="flex items-center gap-2 text-xs text-white/70">
          <CircleDot size={14} />
          נקסלי
        </div>
        <h3 className="mt-9 text-3xl font-semibold leading-none">
          בהירות שמובילה לצמיחה.
        </h3>
        <p className="mt-4 text-sm leading-6 text-white/55">
          מערכות פרימיום למותגים שרוצים להתקדם מהר.
        </p>
        <div className="mt-8 h-24 rounded-2xl bg-white/10 p-3">
          <div className="h-2 w-20 rounded-full bg-white/30" />
          <div className="mt-4 h-2 w-28 rounded-full bg-white/20" />
          <div className="mt-4 h-2 w-16 rounded-full bg-white/20" />
        </div>
      </div>

      <div className="launchora-float absolute left-0 top-6 h-[270px] w-[260px] rotate-[-5deg] overflow-hidden rounded-[2rem] border border-white/60 bg-[#dceaff] shadow-2xl sm:h-[340px] sm:w-[330px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,.9),transparent_30%),linear-gradient(135deg,#d7e8ff,#f8fbff)]" />
        <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-[#ff8f70]/30 blur-2xl" />
        <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-white/50 blur-xl" />
      </div>

      <div className="launchora-float-main absolute right-8 top-2 z-10 w-[86%] rotate-[-4deg] rounded-[2rem] border border-black/5 bg-white p-5 shadow-[0_35px_80px_rgba(15,23,42,0.18)] sm:right-20 sm:w-[440px] sm:p-7">
        <div className="flex items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div className="flex items-center gap-2 font-semibold text-neutral-900">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-black text-white">
              <Sparkles size={12} />
            </span>
            נורת׳ליין
          </div>
          <div className="hidden items-center gap-5 sm:flex">
            <span>פיצ׳רים</span>
            <span>מחירון</span>
            <span>לקוחות</span>
          </div>
          <button className="rounded-full bg-black px-3 py-1 text-[10px] text-white">
            התחלה
          </button>
        </div>

        <h3 className="mt-8 max-w-[300px] text-3xl font-semibold leading-[0.95] tracking-[-0.05em] text-neutral-950 sm:text-4xl">
          כשהבהירות פוגשת{" "}
          <span className="text-[#5277ff]">ביצועים.</span>
        </h3>

        <p className="mt-3 max-w-[290px] text-xs leading-5 text-neutral-500">
          מערכת אנליטיקה לצוותים שרוצים להבין מה באמת עובד ולגדול חכם.
        </p>

        <div className="mt-6 grid grid-cols-[1.2fr_.8fr] gap-4">
          <div className="rounded-2xl border border-neutral-100 bg-[#f8fbff] p-4">
            <div className="mb-4 flex h-8 items-center gap-2 rounded-full bg-white px-3 text-[10px] text-neutral-400 shadow-sm">
              <MousePointer2 size={12} />
              חיפוש נתונים...
            </div>
            <svg viewBox="0 0 240 110" className="h-24 w-full overflow-visible">
              <defs>
                <linearGradient id="launchoraChart" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6b8cff" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#6b8cff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 80 C25 68 32 45 55 55 C82 68 95 25 118 38 C140 51 151 66 175 45 C198 25 216 33 240 18 L240 110 L0 110 Z"
                fill="url(#launchoraChart)"
              />
              <path
                d="M0 80 C25 68 32 45 55 55 C82 68 95 25 118 38 C140 51 151 66 175 45 C198 25 216 33 240 18"
                fill="none"
                stroke="#5277ff"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
              <p className="text-[10px] text-neutral-400">הכנסות</p>
              <p className="mt-1 text-xl font-bold text-neutral-950">₪24,780</p>
              <p className="mt-1 text-[10px] text-[#5277ff]">
                +18.5% מהחודש הקודם
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
              <p className="text-[10px] text-neutral-400">ערוצי צמיחה</p>
              <div className="mt-3 h-2 rounded-full bg-neutral-100">
                <div className="h-2 w-[66%] rounded-full bg-black" />
              </div>
              <button className="mt-4 rounded-full bg-black px-3 py-1.5 text-[10px] text-white">
                צפייה בדוח
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="launchora-chip absolute bottom-8 right-8 z-20 flex items-center gap-2 rounded-2xl border border-black/5 bg-white/90 px-4 py-3 text-xs font-medium text-neutral-700 shadow-xl backdrop-blur">
        <Target size={15} className="text-[#5277ff]" />
        אסטרטגיה לפני הכול
      </div>

      <div className="launchora-chip-reverse absolute bottom-4 left-2 z-20 flex items-center gap-2 rounded-2xl border border-black/5 bg-white/90 px-4 py-3 text-xs font-medium text-neutral-700 shadow-xl backdrop-blur">
        <LineChart size={15} className="text-[#5277ff]" />
        תוצאות שמרגישים
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  return (
    <Reveal delay={index * 90}>
      <article className="group cursor-pointer">
        <div
          className={`relative h-44 overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${project.tone} p-5 shadow-sm ring-1 ring-black/5 transition duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl`}
        >
          <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
          </div>

          <div
            className={`relative z-10 max-w-[220px] text-2xl font-semibold leading-[1.02] tracking-[-0.04em] ${
              project.dark ? "text-white" : "text-neutral-950"
            }`}
          >
            {project.title}
          </div>

          <span
            className={`absolute bottom-5 right-5 z-10 rounded-full px-3 py-1 text-[11px] font-medium ${
              project.dark
                ? "bg-white/15 text-white ring-1 ring-white/20"
                : "bg-white/70 text-neutral-800 ring-1 ring-black/5"
            }`}
          >
            {project.tag}
          </span>

          {index === 0 && (
            <div className="absolute left-5 top-6 h-32 w-40 rotate-[-3deg] rounded-2xl bg-white p-4 shadow-xl">
              <p className="text-[10px] text-neutral-400">הכנסות</p>
              <p className="mt-1 text-lg font-bold">₪128,430</p>
              <svg viewBox="0 0 180 70" className="mt-3 h-16 w-full">
                <path
                  d="M0 55 C25 20 50 70 80 38 C110 4 130 42 180 16"
                  fill="none"
                  stroke="#5277ff"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}

          {index === 1 && (
            <div className="absolute bottom-0 left-0 h-40 w-52 rounded-tr-full bg-[radial-gradient(circle_at_70%_60%,rgba(255,255,255,.35),transparent_38%),linear-gradient(135deg,#111,#333)]" />
          )}

          {index === 2 && (
            <div className="absolute bottom-0 left-5 h-36 w-32 rounded-t-full bg-[linear-gradient(135deg,#d7b38d,#fff3e1)] shadow-xl">
              <div className="absolute bottom-5 left-1/2 h-24 w-1 -translate-x-1/2 bg-black/50" />
              <div className="absolute bottom-2 left-8 h-1 w-24 rotate-[-14deg] bg-black/50" />
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-bold text-neutral-950">{project.name}</h3>
          <p className="mt-1 text-sm text-neutral-500">{project.desc}</p>
        </div>
      </article>
    </Reveal>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const Icon = service.icon;

  return (
    <Reveal delay={index * 80}>
      <article className="group rounded-[1.35rem] border border-neutral-200 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-2 hover:border-neutral-950/20 hover:shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eef2ff] text-[#5277ff] transition duration-500 group-hover:scale-110 group-hover:bg-black group-hover:text-white">
            <Icon size={19} />
          </span>
          <ArrowRight
            size={18}
            className="translate-x-0 rotate-180 text-neutral-500 transition duration-500 group-hover:-translate-x-1 group-hover:text-neutral-950"
          />
        </div>
        <h3 className="font-semibold text-neutral-950">{service.title}</h3>
        <p className="mt-3 text-sm leading-6 text-neutral-500">{service.desc}</p>
      </article>
    </Reveal>
  );
}

function TestimonialCard({
  item,
  index,
}: {
  item: (typeof testimonials)[number];
  index: number;
}) {
  if (item.featured) {
    return (
      <Reveal delay={index * 90} className="lg:col-span-2">
        <article className="relative min-h-[210px] overflow-hidden rounded-[1.75rem] bg-black p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(82,119,255,.28),transparent_35%)]" />
          <Quote size={42} className="relative z-10 text-white/70" />
          <p className="relative z-10 mt-4 max-w-[620px] text-2xl font-medium leading-tight tracking-[-0.035em]">
            {item.text}
          </p>
          <div className="relative z-10 mt-8 flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                alt=""
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-white/55">{item.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star
                  key={starIndex}
                  size={17}
                  className="fill-white text-white"
                />
              ))}
            </div>
          </div>
        </article>
      </Reveal>
    );
  }

  return (
    <Reveal delay={index * 90}>
      <article className="h-full rounded-[1.75rem] border border-neutral-200 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl">
        <Quote size={32} className="text-neutral-200" />
        <p className="mt-5 text-base font-medium leading-7 text-neutral-900">
          {item.text}
        </p>
        <div className="mt-8 flex items-center gap-3">
          <img
            src={
              index === 1
                ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
            }
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-neutral-950">
              {item.name}
            </p>
            <p className="text-xs text-neutral-500">{item.role}</p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function PricingCard({
  plan,
  index,
}: {
  plan: (typeof pricing)[number];
  index: number;
}) {
  return (
    <Reveal delay={index * 100}>
      <article className="rounded-[1.75rem] border border-neutral-200 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <h3 className="text-lg font-bold text-neutral-950">{plan.name}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              {plan.desc}
            </p>
            <div className="mt-8">
              <p className="text-4xl font-bold tracking-[-0.05em] text-neutral-950">
                {plan.price}
              </p>
              <p className="mt-1 text-sm text-neutral-500">{plan.label}</p>
            </div>
          </div>

          <ul className="space-y-4">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm text-neutral-700"
              >
                <Check size={16} className="mt-0.5 text-neutral-950" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          className={`mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition duration-300 ${
            plan.featured
              ? "bg-black text-white hover:scale-[1.015] hover:shadow-xl"
              : "border border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
          }`}
        >
          {plan.cta}
          <ArrowRight size={16} className="rotate-180" />
        </button>
      </article>
    </Reveal>
  );
}

function FAQItem({
  item,
  defaultOpen = false,
}: {
  item: (typeof faqs)[number];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-5 px-5 py-4 text-right text-sm font-semibold text-neutral-950 transition hover:bg-neutral-50"
      >
        {item.q}
        <Plus
          size={17}
          className={`shrink-0 transition duration-300 ${
            open ? "rotate-45" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-6 text-neutral-500">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  title,
  eyebrow,
  action,
}: {
  title: string;
  eyebrow?: string;
  action?: string;
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 text-sm font-medium text-neutral-500">{eyebrow}</p>
        )}
        <h2 className="text-3xl font-bold tracking-[-0.05em] text-neutral-950 sm:text-4xl">
          {title}
        </h2>
      </div>

      {action && (
        <button className="group flex items-center gap-2 text-sm font-semibold text-neutral-950">
          {action}
          <ArrowRight
            size={16}
            className="rotate-180 transition duration-300 group-hover:-translate-x-1"
          />
        </button>
      )}
    </div>
  );
}

export default function LaunchoraPages({
  initialPage = "home",
  mode = "preview",
}: LaunchoraPagesProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const page = useMemo(() => initialPage, [initialPage]);

  if (page !== "home") return null;

  return (
    <main
      dir="rtl"
      className="launchora-root min-h-screen overflow-x-hidden bg-[#fbfbfa] text-neutral-950"
      data-template="launchora"
      data-mode={mode}
    >
      <style>{`
        .launchora-root {
          --launchora-blue: #5277ff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .launchora-reveal {
          opacity: 0;
          transform: translateY(26px) scale(.985);
          transition:
            opacity 760ms cubic-bezier(.2,.8,.2,1),
            transform 760ms cubic-bezier(.2,.8,.2,1);
          will-change: opacity, transform;
        }

        .launchora-reveal.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        @keyframes launchoraFloat {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-5deg); }
          50% { transform: translate3d(0, -16px, 0) rotate(-3deg); }
        }

        @keyframes launchoraFloatMain {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-4deg); }
          50% { transform: translate3d(0, -12px, 0) rotate(-2deg); }
        }

        @keyframes launchoraFloatSlow {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(8deg); }
          50% { transform: translate3d(0, 14px, 0) rotate(5deg); }
        }

        @keyframes launchoraChip {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-10px, -8px, 0); }
        }

        @keyframes launchoraChipReverse {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(10px, -8px, 0); }
        }

        @keyframes launchoraShine {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        @keyframes launchoraGridMove {
          0% { background-position: 0 0; }
          100% { background-position: 80px 80px; }
        }

        .launchora-float { animation: launchoraFloat 7s ease-in-out infinite; }
        .launchora-float-main { animation: launchoraFloatMain 6.5s ease-in-out infinite; }
        .launchora-float-slow { animation: launchoraFloatSlow 8s ease-in-out infinite; }
        .launchora-chip { animation: launchoraChip 5.5s ease-in-out infinite; }
        .launchora-chip-reverse { animation: launchoraChipReverse 5.8s ease-in-out infinite; }

        .launchora-grid-bg {
          background-image:
            linear-gradient(to right, rgba(15,23,42,.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,23,42,.045) 1px, transparent 1px);
          background-size: 80px 80px;
          animation: launchoraGridMove 22s linear infinite;
        }

        .launchora-shine::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);
          transform: translateX(100%);
        }

        .launchora-shine:hover::before {
          animation: launchoraShine 900ms ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .launchora-reveal,
          .launchora-float,
          .launchora-float-main,
          .launchora-float-slow,
          .launchora-chip,
          .launchora-chip-reverse,
          .launchora-grid-bg {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#fbfbfa]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-white shadow-lg shadow-black/10">
              <Gem size={18} />
            </span>
            <span className="hidden text-sm font-bold tracking-[-0.03em] sm:block">
              לנצ׳ורה
            </span>
          </a>

          <nav className="hidden items-center gap-10 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden h-12 items-center gap-3 rounded-full bg-black px-6 text-sm font-semibold text-white shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl sm:flex"
            >
              בואו נדבר
              <ArrowRight size={16} className="rotate-180" />
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full border border-neutral-200 bg-white lg:hidden"
              aria-label="פתיחת תפריט"
            >
              <Menu size={19} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm lg:hidden">
            <div className="mr-auto h-full w-[82%] max-w-sm bg-white p-6 shadow-2xl">
              <div className="mb-10 flex items-center justify-between">
                <span className="text-lg font-bold">לנצ׳ורה</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100"
                  aria-label="סגירת תפריט"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-4 text-lg font-semibold hover:bg-neutral-50"
                  >
                    {item.label}
                    <ArrowRight size={17} className="rotate-180" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <section id="top" className="relative overflow-hidden">
        <div className="launchora-grid-bg absolute inset-0 opacity-70" />
        <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-white blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          <Reveal>
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#5277ff]" />
                פנויים לפרויקטים חדשים
              </div>

              <h1 className="max-w-[620px] text-[58px] font-black leading-[0.9] tracking-[-0.075em] text-neutral-950 sm:text-[82px] lg:text-[96px]">
                עיצוב שמזיז מותגים קדימה
                <span className="text-[#5277ff]">.</span>
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-8 text-neutral-600">
                אנחנו עוזרים לעסקים שאפתניים לצמוח עם מיתוג אסטרטגי, אתרים
                חכמים וחוויות דיגיטליות שמביאות תוצאות.
              </p>

              <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center">
                <a
                  href="#pricing"
                  className="launchora-shine relative flex h-14 w-fit items-center justify-center gap-3 overflow-hidden rounded-full bg-black px-7 text-sm font-bold text-white shadow-xl shadow-black/15 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  התחלת פרויקט
                  <ArrowRight size={17} className="rotate-180" />
                </a>

                <div className="flex items-center gap-4">
                  <AvatarStack />
                  <p className="text-sm text-neutral-500">
                    אמון של{" "}
                    <span className="font-semibold text-neutral-900">
                      120+ צוותים
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <HeroCards />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="rounded-[1.5rem] border border-neutral-200 bg-white/80 px-6 py-6 shadow-sm backdrop-blur">
            <p className="mb-6 text-center text-xs font-medium text-neutral-400">
              מותגים חדשניים שבחרו בנו
            </p>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-7">
              {clientLogos.map((logo, index) => (
                <div
                  key={logo}
                  className="flex items-center justify-center gap-2 text-sm font-bold text-neutral-700"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-neutral-50 text-neutral-950">
                    {index % 3 === 0 ? (
                      <Sparkles size={16} />
                    ) : index % 3 === 1 ? (
                      <Zap size={16} />
                    ) : (
                      <BadgeCheck size={16} />
                    )}
                  </span>
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section id="work" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
        <SectionTitle title="עבודות נבחרות" action="לכל הפרויקטים" />

        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
        </div>
      </section>

      <section id="services" className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        <SectionTitle
          title="מה אנחנו עושים"
          action="פתרונות מדויקים לעסקים שרוצים לצמוח."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        <SectionTitle title="מה הלקוחות אומרים" action="עוד המלצות" />

        <div className="grid gap-5 lg:grid-cols-4">
          {testimonials.map((item, index) => (
            <TestimonialCard key={item.name} item={item} index={index} />
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        <SectionTitle
          title="מחירון פשוט ושקוף"
          action="פתרון מותאם לכל שלב בצמיחה."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {pricing.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </section>

      <section id="resources" className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-[-0.05em] text-neutral-950 sm:text-4xl">
            שאלות נפוצות
          </h2>
          <p className="text-sm text-neutral-500">
            עדיין יש שאלות?{" "}
            <a href="#contact" className="font-semibold text-[#5277ff]">
              דברו איתנו
            </a>
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {faqs.map((item, index) => (
            <Reveal key={item.q} delay={index * 70}>
              <FAQItem item={item} defaultOpen={index === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-black p-8 text-white shadow-2xl sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(82,119,255,.38),transparent_32%)]" />
            <div className="absolute bottom-[-90px] left-[-70px] h-80 w-80 rounded-full border border-white/10" />
            <div className="absolute bottom-[-120px] left-[80px] h-80 w-80 rounded-full border border-[#5277ff]/25" />
            <div className="absolute bottom-[-150px] left-[220px] h-80 w-80 rounded-full border border-white/10" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
              <div>
                <h2 className="max-w-xl text-4xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-5xl">
                  מוכנים לבנות משהו יוצא דופן?
                </h2>
                <p className="mt-5 max-w-md text-base leading-7 text-white/65">
                  בואו ניצור מותג וחוויה דיגיטלית שהלקוחות שלכם יזכרו.
                </p>
              </div>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center lg:justify-end">
                <a
                  href="#top"
                  className="flex h-14 w-fit items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-bold text-black transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  התחלת פרויקט
                  <ArrowRight size={17} className="rotate-180" />
                </a>

                <div className="flex items-center gap-4">
                  <AvatarStack />
                  <p className="max-w-[170px] text-xs leading-5 text-white/60">
                    הצטרפו ל־120+ עסקים שכבר צומחים איתנו
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}