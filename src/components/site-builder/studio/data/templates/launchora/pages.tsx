import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  Gem,
  Layers3,
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

type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  description: string;
  result: string;
  image: string;
  dark?: boolean;
};

const navItems = [
  { label: "עבודות", href: "#work" },
  { label: "שירותים", href: "#services" },
  { label: "תהליך", href: "#process" },
  { label: "מחירון", href: "#pricing" },
  { label: "שאלות", href: "#faq" },
];

const trustedBrands = [
  "Northline",
  "Cloudcrest",
  "Shapepeak",
  "Lunar",
  "Vertex",
  "Pillar",
  "Brightside",
  "Kora",
];

const skills = [
  "אסטרטגיית מותג",
  "עיצוב אתרים",
  "מיקרו־אינטראקציות",
  "עמודי נחיתה",
  "פורטפוליו",
  "מערכות SaaS",
  "איקומרס",
  "Framer Feel",
  "Tailwind",
  "React",
];

const projects: Project[] = [
  {
    id: "clearbank",
    title: "ClearBank",
    subtitle: "מערכת פיננסית שמרגישה פשוטה, יוקרתית ומהירה.",
    category: "Web App / UX",
    year: "2026",
    description:
      "בנינו חוויית משתמש שמפשטת נתונים מורכבים, מחזקת אמון ומובילה את המשתמש לפעולה ברורה.",
    result: "עלייה של 38% בהמרות בדמו",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "velora",
    title: "Velora",
    subtitle: "מותג פרימיום לספורט ותנועה עם שפה ויזואלית חדה.",
    category: "Brand / Art Direction",
    year: "2026",
    description:
      "שפה מותגית חדשה, היררכיית תוכן ברורה ועמוד מוצר שמדגיש תחושת ביצועים.",
    result: "פי 2.4 יותר הקלקות על CTA",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80",
    dark: true,
  },
  {
    id: "harmen",
    title: "Harmen Studio",
    subtitle: "חנות דיגיטלית רגועה, נקייה ואלגנטית למוצרי בית.",
    category: "E-Commerce",
    year: "2026",
    description:
      "עיצבנו מסע קנייה שמרגיש נעים, ברור ומדויק — מהעמוד הראשי ועד עמוד המוצר.",
    result: "שיפור של 31% בהוספה לסל",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80",
  },
];

const services = [
  {
    title: "אסטרטגיה לפני עיצוב",
    desc: "מגדירים מטרה, קהל, מסר והיררכיה לפני שנוגעים בפיקסלים.",
    icon: Target,
  },
  {
    title: "עיצוב אתר פרימיום",
    desc: "Hero חזק, תנועה עדינה, סקציות ברורות ו־CTA שלא הולך לאיבוד.",
    icon: Palette,
  },
  {
    title: "חוויית משתמש",
    desc: "מבנה שמוביל את הגולש טבעית: להבין, להאמין, ללחוץ, להשאיר פרטים.",
    icon: MousePointer2,
  },
  {
    title: "פיתוח מדויק",
    desc: "React + Tailwind, רספונסיביות מלאה, ביצועים טובים וקוד שקל לתחזק.",
    icon: Code2,
  },
];

const processSteps = [
  {
    step: "01",
    title: "פיצוח",
    text: "מבינים מה העסק מוכר, מי הקהל, מה חשוב להדגיש ואיפה המשתמש אמור ללחוץ.",
  },
  {
    step: "02",
    title: "מבנה UX",
    text: "בונים מסלול גלילה נכון: Hero, אמון, עבודות, שירותים, מחירון, שאלות ו־CTA.",
  },
  {
    step: "03",
    title: "עיצוב ותנועה",
    text: "מוסיפים שפה ויזואלית, אנימציות עדינות, כרטיסים חיים ותחושת פרימיום.",
  },
  {
    step: "04",
    title: "פיתוח",
    text: "ממירים לקוד Tailwind נקי, רספונסיבי ומהיר שמתאים למערכת התבניות שלך.",
  },
];

const testimonials = [
  {
    name: "שרה לין",
    role: "מנהלת שיווק, ClearBank",
    text: "האתר החדש סוף סוף מרגיש כמו המותג שרצינו להיות. הגולשים מבינים מהר יותר מה אנחנו עושים ופונים הרבה יותר.",
    featured: true,
  },
  {
    name: "דוד פארק",
    role: "מנכ״ל, Northline",
    text: "החוויה מרגישה יוקרתית אבל לא מסובכת. הכול ברור, מהיר ומוביל לפעולה.",
    featured: false,
  },
  {
    name: "מאיה פטל",
    role: "מייסדת, Shapepeak",
    text: "זו הפעם הראשונה שהאתר שלנו נראה באמת כמו עסק פרימיום.",
    featured: false,
  },
];

const pricing = [
  {
    name: "אתר פרימיום",
    desc: "לעסק שרוצה נראות גבוהה, מבנה ברור וחוויית גלילה חזקה.",
    price: "₪6,500",
    label: "מחיר התחלתי",
    cta: "להתחיל פרויקט",
    featured: true,
    features: [
      "עמוד בית מלא",
      "עד 8 סקציות פרימיום",
      "אפקטים וכניסות בגלילה",
      "רספונסיביות מלאה",
      "התאמה ל־Tailwind",
    ],
  },
  {
    name: "מותג + אתר",
    desc: "לעסק שרוצה גם שפה ויזואלית, גם אתר וגם חוויה יותר עמוקה.",
    price: "₪12,000",
    label: "החל מ־",
    cta: "לקביעת שיחה",
    featured: false,
    features: [
      "כל מה שכלול באתר פרימיום",
      "שפת מותג בסיסית",
      "עמודי משנה",
      "מודאלים / Case Studies",
      "ליווי לאחר השקה",
    ],
  },
];

const faqs = [
  {
    q: "מה הכי חשוב בתבנית הזאת?",
    a: "החוויה. שהגולש יבין מהר מה העסק עושה, יתרשם מהעיצוב, יראה עבודות, יקבל אמון ויגיע ל־CTA בלי בלבול.",
  },
  {
    q: "זה מתאים לעברית ו־RTL?",
    a: "כן. כל המבנה מוגדר RTL, כולל חצים, תפריט מובייל, כרטיסים, FAQ והיררכיית טקסט.",
  },
  {
    q: "אפשר לערוך את התמונות והטקסטים?",
    a: "כן. כל התוכן מרוכז במערכים בתחילת הקובץ כדי שיהיה קל להחליף שמות, טקסטים, מחירים ותמונות.",
  },
  {
    q: "זה יותר קרוב ל־LaunchNow?",
    a: "כן. הכיוון עכשיו הרבה יותר פורטפוליו/סטודיו: Hero אישי, פרויקטים גדולים, טיקר, תהליך, המלצות ו־CTA ברור.",
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
      { threshold: 0.12 }
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

function ArrowIcon({ className = "" }: { className?: string }) {
  return <ArrowRight size={17} className={`rotate-180 ${className}`} />;
}

function AvatarStack() {
  const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
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

function HeroVisual() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[610px] lg:h-[520px]">
      <div className="absolute inset-8 rounded-full bg-[#dfe7ff] blur-3xl" />

      <div className="launchora-float-slow absolute right-2 top-16 z-10 h-64 w-48 rotate-[8deg] overflow-hidden rounded-[2rem] bg-black p-5 text-white shadow-2xl sm:right-10 sm:h-80 sm:w-60">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <Sparkles size={14} />
          סטודיו דיגיטל
        </div>
        <p className="mt-10 text-4xl font-black leading-[0.9] tracking-[-0.06em]">
          פחות רעש. יותר רושם.
        </p>
        <div className="mt-8 space-y-3">
          <div className="h-2 w-28 rounded-full bg-white/30" />
          <div className="h-2 w-36 rounded-full bg-white/20" />
          <div className="h-2 w-20 rounded-full bg-white/20" />
        </div>
      </div>

      <div className="launchora-float absolute left-0 top-9 h-72 w-56 rotate-[-7deg] overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-black/5 sm:left-8 sm:h-96 sm:w-72">
        <img
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-5 right-5 left-5">
          <p className="text-xs font-medium text-white/70">Case Study</p>
          <p className="mt-1 text-xl font-bold leading-tight text-white">
            חוויית מותג שמרגישה יקרה
          </p>
        </div>
      </div>

      <div className="launchora-float-main absolute bottom-2 right-12 z-20 w-[82%] rounded-[2rem] bg-white p-5 shadow-[0_35px_100px_rgba(15,23,42,0.18)] ring-1 ring-black/5 sm:right-24 sm:w-[430px] sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-white">
              <Gem size={15} />
            </span>
            <div>
              <p className="text-sm font-bold">Launchora</p>
              <p className="text-[11px] text-neutral-400">UX Dashboard</p>
            </div>
          </div>
          <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-[11px] font-bold text-[#5277ff]">
            +42%
          </span>
        </div>

        <div className="rounded-3xl bg-[#f7f7f6] p-4">
          <div className="mb-4 flex items-center justify-between text-[11px] text-neutral-400">
            <span>מסלול משתמש</span>
            <span>המרה</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {["נחיתה", "אמון", "הוכחה", "פנייה"].map((label, index) => (
              <div key={label} className="rounded-2xl bg-white p-3 shadow-sm">
                <div
                  className={`mb-6 h-2 rounded-full ${
                    index === 0
                      ? "bg-black"
                      : index === 1
                        ? "bg-[#5277ff]"
                        : "bg-neutral-300"
                  }`}
                />
                <p className="text-[10px] font-semibold text-neutral-700">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-neutral-100 p-4">
          <div>
            <p className="text-[11px] text-neutral-400">זמן ממוצע באתר</p>
            <p className="mt-1 text-lg font-black">03:42</p>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-black text-white">
            <Clock3 size={16} />
          </div>
        </div>
      </div>

      <div className="launchora-chip absolute bottom-24 right-2 z-30 flex items-center gap-2 rounded-2xl border border-black/5 bg-white/90 px-4 py-3 text-xs font-bold text-neutral-700 shadow-xl backdrop-blur">
        <Target size={15} className="text-[#5277ff]" />
        UX קודם לעיצוב
      </div>

      <div className="launchora-chip-reverse absolute left-2 top-5 z-30 flex items-center gap-2 rounded-2xl border border-black/5 bg-white/90 px-4 py-3 text-xs font-bold text-neutral-700 shadow-xl backdrop-blur">
        <Zap size={15} className="text-[#5277ff]" />
        טעינה מהירה
      </div>
    </div>
  );
}

function Marquee() {
  const items = [...skills, ...skills];

  return (
    <div className="relative overflow-hidden border-y border-black/[0.06] bg-white py-5">
      <div className="launchora-marquee flex w-max items-center gap-3">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-3 rounded-full border border-neutral-200 bg-[#fbfbfa] px-5 py-2 text-sm font-semibold text-neutral-700"
          >
            <Sparkles size={14} className="text-[#5277ff]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-3 backdrop-blur-md sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-[2rem] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white/90 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-bold text-neutral-400">
              {project.category} · {project.year}
            </p>
            <h3 className="mt-1 text-xl font-black text-neutral-950">
              {project.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 text-neutral-700 transition hover:bg-black hover:text-white"
            aria-label="סגירת חלון"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.1fr_.9fr] lg:p-8">
          <div className="overflow-hidden rounded-[1.5rem] bg-neutral-100">
            <img
              src={project.image}
              alt=""
              className="h-[300px] w-full object-cover sm:h-[430px]"
            />
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="text-3xl font-black leading-tight tracking-[-0.05em] text-neutral-950 sm:text-5xl">
                {project.subtitle}
              </p>
              <p className="mt-5 text-base leading-8 text-neutral-600">
                {project.description}
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-black p-6 text-white">
              <p className="text-xs font-bold text-white/50">תוצאה</p>
              <p className="mt-2 text-2xl font-black tracking-[-0.04em]">
                {project.result}
              </p>
            </div>

            <a
              href="#contact"
              onClick={onClose}
              className="flex h-13 items-center justify-center gap-2 rounded-full bg-[#5277ff] px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              רוצה כזה לעסק שלך?
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  return (
    <Reveal delay={index * 90}>
      <button
        type="button"
        onClick={() => onOpen(project)}
        className={`group block w-full overflow-hidden rounded-[2rem] text-right shadow-sm ring-1 ring-black/5 transition duration-500 hover:-translate-y-2 hover:shadow-2xl ${
          project.dark ? "bg-black text-white" : "bg-white text-neutral-950"
        }`}
      >
        <div className="relative h-[360px] overflow-hidden sm:h-[460px]">
          <img
            src={project.image}
            alt=""
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div
            className={`absolute inset-0 ${
              project.dark
                ? "bg-gradient-to-t from-black via-black/25 to-transparent"
                : "bg-gradient-to-t from-black/65 via-black/10 to-transparent"
            }`}
          />

          <div className="absolute top-5 right-5 flex items-center gap-2">
            <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-black backdrop-blur">
              {project.category}
            </span>
            <span className="rounded-full bg-black/70 px-4 py-2 text-xs font-bold text-white backdrop-blur">
              {project.year}
            </span>
          </div>

          <div className="absolute bottom-6 right-6 left-6">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-black shadow-lg transition duration-300 group-hover:-translate-y-1">
              לצפייה בפרויקט
              <ArrowIcon />
            </div>
            <h3 className="max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-5xl">
              {project.title}
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/80">
              {project.subtitle}
            </p>
          </div>
        </div>
      </button>
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
      <article className="group h-full rounded-[1.75rem] border border-neutral-200 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:border-black/20 hover:shadow-2xl">
        <div className="mb-10 flex items-center justify-between">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef2ff] text-[#5277ff] transition duration-500 group-hover:scale-110 group-hover:bg-black group-hover:text-white">
            <Icon size={20} />
          </span>
          <ArrowIcon className="text-neutral-400 transition duration-500 group-hover:-translate-x-1 group-hover:text-black" />
        </div>

        <h3 className="text-xl font-black tracking-[-0.04em] text-neutral-950">
          {service.title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-neutral-500">
          {service.desc}
        </p>
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
        <article className="relative h-full overflow-hidden rounded-[2rem] bg-black p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(82,119,255,.35),transparent_32%)]" />
          <Quote size={42} className="relative z-10 text-white/50" />
          <p className="relative z-10 mt-5 text-2xl font-bold leading-tight tracking-[-0.04em] sm:text-3xl">
            {item.text}
          </p>

          <div className="relative z-10 mt-10 flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="font-bold">{item.name}</p>
              <p className="mt-1 text-sm text-white/50">{item.role}</p>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star
                  key={starIndex}
                  size={16}
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
      <article className="h-full rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl">
        <Quote size={30} className="text-neutral-200" />
        <p className="mt-5 text-base font-semibold leading-8 text-neutral-900">
          {item.text}
        </p>
        <div className="mt-10">
          <p className="font-bold text-neutral-950">{item.name}</p>
          <p className="mt-1 text-sm text-neutral-500">{item.role}</p>
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
      <article
        className={`relative h-full overflow-hidden rounded-[2rem] p-7 shadow-sm ring-1 ring-black/5 transition duration-500 hover:-translate-y-2 hover:shadow-2xl ${
          plan.featured ? "bg-black text-white" : "bg-white text-neutral-950"
        }`}
      >
        {plan.featured && (
          <div className="absolute left-6 top-6 rounded-full bg-white px-4 py-2 text-xs font-black text-black">
            הכי פופולרי
          </div>
        )}

        <div className="max-w-md">
          <h3 className="text-2xl font-black tracking-[-0.05em]">
            {plan.name}
          </h3>
          <p
            className={`mt-3 text-sm leading-7 ${
              plan.featured ? "text-white/60" : "text-neutral-500"
            }`}
          >
            {plan.desc}
          </p>
        </div>

        <div className="mt-10">
          <p className="text-5xl font-black tracking-[-0.07em]">
            {plan.price}
          </p>
          <p
            className={`mt-2 text-sm ${
              plan.featured ? "text-white/50" : "text-neutral-500"
            }`}
          >
            {plan.label}
          </p>
        </div>

        <ul className="mt-10 space-y-4">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm">
              <Check
                size={17}
                className={plan.featured ? "text-white" : "text-black"}
              />
              <span className={plan.featured ? "text-white/75" : "text-neutral-700"}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className={`mt-10 flex h-13 items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-black transition duration-300 hover:-translate-y-1 ${
            plan.featured
              ? "bg-white text-black hover:shadow-2xl"
              : "bg-black text-white hover:shadow-xl"
          }`}
        >
          {plan.cta}
          <ArrowIcon />
        </a>
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
    <div className="overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-5 px-6 py-5 text-right text-base font-black text-neutral-950 transition hover:bg-neutral-50"
      >
        <span>{item.q}</span>
        <Plus
          size={18}
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
          <p className="px-6 pb-6 text-sm leading-7 text-neutral-500">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  kicker,
  title,
  text,
  action,
}: {
  kicker?: string;
  title: string;
  text?: string;
  action?: string;
}) {
  return (
    <Reveal>
      <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 lg:flex-row lg:items-end">
        <div>
          {kicker && (
            <p className="mb-3 text-sm font-black text-[#5277ff]">{kicker}</p>
          )}
          <h2 className="max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.07em] text-neutral-950 sm:text-6xl">
            {title}
          </h2>
        </div>

        {(text || action) && (
          <div className="max-w-md">
            {text && <p className="text-base leading-8 text-neutral-500">{text}</p>}
            {action && (
              <a
                href="#contact"
                className="mt-5 inline-flex items-center gap-2 text-sm font-black text-neutral-950"
              >
                {action}
                <ArrowIcon />
              </a>
            )}
          </div>
        )}
      </div>
    </Reveal>
  );
}

export default function LaunchoraPages({
  initialPage = "home",
  mode = "preview",
}: LaunchoraPagesProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
          scroll-behavior: smooth;
        }

        .launchora-reveal {
          opacity: 0;
          transform: translateY(28px) scale(.985);
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
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-7deg); }
          50% { transform: translate3d(0, -16px, 0) rotate(-4deg); }
        }

        @keyframes launchoraFloatMain {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -12px, 0); }
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

        @keyframes launchoraMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }

        @keyframes launchoraGridMove {
          0% { background-position: 0 0; }
          100% { background-position: 80px 80px; }
        }

        @keyframes launchoraShine {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .launchora-float { animation: launchoraFloat 7s ease-in-out infinite; }
        .launchora-float-main { animation: launchoraFloatMain 6.5s ease-in-out infinite; }
        .launchora-float-slow { animation: launchoraFloatSlow 8s ease-in-out infinite; }
        .launchora-chip { animation: launchoraChip 5.5s ease-in-out infinite; }
        .launchora-chip-reverse { animation: launchoraChipReverse 5.8s ease-in-out infinite; }
        .launchora-marquee { animation: launchoraMarquee 28s linear infinite; }

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
          .launchora-marquee,
          .launchora-grid-bg {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }

          .launchora-root {
            scroll-behavior: auto;
          }
        }
      `}</style>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#fbfbfa]/82 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-white shadow-lg shadow-black/10">
              <Gem size={18} />
            </span>
            <span className="hidden text-sm font-black tracking-[-0.03em] sm:block">
              לנצ׳ורה
            </span>
          </a>

          <nav className="hidden items-center gap-9 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-bold text-neutral-600 transition hover:text-neutral-950"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="launchora-shine relative hidden h-12 items-center gap-3 overflow-hidden rounded-full bg-black px-6 text-sm font-black text-white shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl sm:flex"
            >
              בואו נדבר
              <ArrowIcon />
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
            <div className="mr-auto h-full w-[86%] max-w-sm bg-white p-6 shadow-2xl">
              <div className="mb-10 flex items-center justify-between">
                <span className="text-lg font-black">לנצ׳ורה</span>
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
                    className="flex items-center justify-between rounded-2xl px-4 py-4 text-lg font-black hover:bg-neutral-50"
                  >
                    {item.label}
                    <ArrowIcon />
                  </a>
                ))}
              </div>

              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="mt-8 flex h-13 items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-sm font-black text-white"
              >
                התחלת פרויקט
                <ArrowIcon />
              </a>
            </div>
          </div>
        )}
      </header>

      <section id="top" className="relative overflow-hidden">
        <div className="launchora-grid-bg absolute inset-0 opacity-70" />
        <div className="absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-white blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-12 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal>
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-black text-neutral-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#5277ff]" />
                זמינים לפרויקט הבא באוגוסט
              </div>

              <h1 className="max-w-[690px] text-[58px] font-black leading-[0.86] tracking-[-0.085em] text-neutral-950 sm:text-[86px] lg:text-[108px]">
                עיצוב שמרגיש יקר ומוכר יותר
                <span className="text-[#5277ff]">.</span>
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-8 text-neutral-600">
                תבנית פורטפוליו/סטודיו שמובילה את הגולש בצורה טבעית:
                רושם ראשוני חזק, עבודות שמוכיחות יכולת, אמון, מחירון ופעולה.
              </p>

              <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center">
                <a
                  href="#work"
                  className="launchora-shine relative flex h-14 w-fit items-center justify-center gap-3 overflow-hidden rounded-full bg-black px-7 text-sm font-black text-white shadow-xl shadow-black/15 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  לראות עבודות
                  <ArrowIcon />
                </a>

                <a
                  href="#pricing"
                  className="flex h-14 w-fit items-center justify-center gap-3 rounded-full border border-neutral-200 bg-white px-7 text-sm font-black text-neutral-950 transition duration-300 hover:-translate-y-1 hover:border-black"
                >
                  מחירון
                  <ChevronDown size={17} />
                </a>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <AvatarStack />
                <p className="text-sm leading-6 text-neutral-500">
                  אמון של{" "}
                  <span className="font-black text-neutral-950">120+ עסקים</span>
                  <br />
                  סטודיו, יועצים, SaaS, מעצבים וחנויות.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={130}>
            <HeroVisual />
          </Reveal>
        </div>
      </section>

      <Marquee />

      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
        <Reveal>
          <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="mb-6 text-center text-xs font-black text-neutral-400">
              מותגים ועסקים שהחוויה הזאת מתאימה להם
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {trustedBrands.map((logo, index) => (
                <div
                  key={logo}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#fbfbfa] px-3 py-4 text-xs font-black text-neutral-700"
                >
                  {index % 3 === 0 ? (
                    <Sparkles size={14} />
                  ) : index % 3 === 1 ? (
                    <Zap size={14} />
                  ) : (
                    <BadgeCheck size={14} />
                  )}
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section id="work" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <SectionHeader
          kicker="עבודות נבחרות"
          title="לא כרטיסים קטנים. עבודות גדולות שעושות רושם."
          text="כל פרויקט מקבל במה, תמונה חזקה, תוצאה ברורה וכניסה למודאל — זה משפר הבנה, אמון ותחושת פרימיום."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={setSelectedProject}
            />
          ))}
        </div>
      </section>

      <section id="services" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <SectionHeader
          kicker="שירותים"
          title="כל סקציה באתר צריכה לעבוד בשביל ההמרה."
          text="העיצוב נראה יפה, אבל המבנה מכוון פעולה: להבין, להתרשם, לסמוך, לפנות."
          action="רוצה לבנות כזה?"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </section>

      <section id="process" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <SectionHeader
          kicker="תהליך"
          title="חוויית משתמש שמרגישה טבעית מהרגע הראשון."
          text="הגולש לא צריך לחשוב יותר מדי. כל חלק בעמוד מסביר לו למה להמשיך ולמה לפנות."
        />

        <div className="grid gap-4 lg:grid-cols-4">
          {processSteps.map((item, index) => (
            <Reveal key={item.step} delay={index * 80}>
              <article className="group h-full rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl">
                <p className="text-sm font-black text-[#5277ff]">{item.step}</p>
                <h3 className="mt-8 text-2xl font-black tracking-[-0.05em] text-neutral-950">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-neutral-500">
                  {item.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="sticky top-28 rounded-[2rem] bg-black p-8 text-white shadow-2xl">
              <p className="text-sm font-black text-white/50">למה זה עובד?</p>
              <h2 className="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.07em]">
                כי זה לא רק יפה. זה ברור.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/60">
                משתמש שנכנס לאתר צריך להבין תוך שניות איפה הוא נמצא, למה זה
                מתאים לו ומה הפעולה הבאה. לכן כל כפתור, מרווח, כותרת ואפקט כאן
                בנויים סביב חוויה והמרה.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5">
            {testimonials.map((item, index) => (
              <TestimonialCard key={item.name} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <SectionHeader
          kicker="מחירון"
          title="שתי אפשרויות פשוטות. בלי בלבול."
          text="המחירון בנוי כדי להוריד חסמים: מה מקבלים, למי זה מתאים ומה הצעד הבא."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {pricing.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <SectionHeader
          kicker="שאלות נפוצות"
          title="עונים לפני שהלקוח מתלבט."
          text="FAQ טוב סוגר התנגדויות ומקצר את הדרך להשארת פרטים."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {faqs.map((item, index) => (
            <Reveal key={item.q} delay={index * 70}>
              <FAQItem item={item} defaultOpen={index === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-7xl px-5 pb-24 pt-14 sm:px-8 lg:pb-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.3rem] bg-black p-8 text-white shadow-2xl sm:p-12 lg:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(82,119,255,.42),transparent_30%)]" />
            <div className="absolute bottom-[-90px] left-[-70px] h-80 w-80 rounded-full border border-white/10" />
            <div className="absolute bottom-[-120px] left-[90px] h-80 w-80 rounded-full border border-[#5277ff]/25" />
            <div className="absolute top-[-130px] right-[-130px] h-80 w-80 rounded-full bg-white/5 blur-2xl" />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-end">
              <div>
                <p className="mb-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white/70">
                  השלב הבא
                </p>
                <h2 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.075em] sm:text-7xl">
                  מוכנים לאתר שמרגיש הרבה יותר מקצועי?
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-white/60">
                  בואו נבנה תבנית עם חוויה חזקה, גלילה נעימה, פרויקטים מרשימים
                  ו־CTA ברור שלא הולך לאיבוד.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <a
                  href="#top"
                  className="flex h-14 items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-black text-black transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  להתחיל עכשיו
                  <ArrowIcon />
                </a>

                <div className="flex items-center gap-4 rounded-3xl bg-white/10 p-4">
                  <AvatarStack />
                  <p className="text-xs leading-5 text-white/60">
                    מתאים לסטודיו, נותני שירות, מעצבים, SaaS, יועצים ועסקים
                    שרוצים להיראות יקרים יותר.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="fixed inset-x-3 bottom-3 z-40 rounded-full bg-black p-2 shadow-2xl lg:hidden">
        <a
          href="#contact"
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-white text-sm font-black text-black"
        >
          התחלת פרויקט
          <ArrowIcon />
        </a>
      </div>
    </main>
  );
}