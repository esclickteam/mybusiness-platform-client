import React, { useMemo, useState } from "react";
import { justoraDefaultData } from "./defaultData";

export const justoraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "practice", label: "תחומי התמחות", slug: "/practice" },
  { id: "lawyers", label: "עורכי דין", slug: "/lawyers" },
  { id: "cases", label: "תיקים", slug: "/cases" },
  { id: "blog", label: "מאמרים", slug: "/blog" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

type JustoraPagesProps = {
  initialPage?: string;
  page?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (justoraDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getPageTitle(data: Record<string, any>, type: string) {
  if (type === "about") return getValue(data, "navAbout");
  if (type === "practice") return getValue(data, "navPractice");
  if (type === "lawyers") return getValue(data, "navLawyers");
  if (type === "cases") return getValue(data, "navCases");
  if (type === "blog") return getValue(data, "navBlog");
  if (type === "contact") return getValue(data, "navContact");
  return getValue(data, "brandName");
}

function SectionTitle({
  eyebrow,
  title,
  text,
  center = false,
  light = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={cx("max-w-3xl", center ? "mx-auto text-center" : "text-right")}>
      <p
        className={cx(
          "mb-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold",
          light
            ? "border border-white/15 bg-white/10 text-[#f8efe0]/80"
            : "border border-[#172433]/12 bg-white/70 text-[#9b7a45]",
        )}
      >
        {eyebrow}
      </p>

      <h2
        className={cx(
          "text-4xl font-semibold leading-[1.03] tracking-[-0.055em] md:text-6xl",
          light ? "text-[#f8efe0]" : "text-[#172433]",
        )}
      >
        {title}
      </h2>

      {text ? (
        <p className={cx("mt-5 text-lg leading-8", light ? "text-[#f8efe0]/70" : "text-[#5d6671]")}>
          {text}
        </p>
      ) : null}
    </div>
  );
}

function Header({
  data,
  currentPage,
  setCurrentPage,
  openConsultation,
}: {
  data: Record<string, any>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  openConsultation: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = [
    ["home", getValue(data, "navHome")],
    ["about", getValue(data, "navAbout")],
    ["practice", getValue(data, "navPractice")],
    ["lawyers", getValue(data, "navLawyers")],
    ["cases", getValue(data, "navCases")],
    ["blog", getValue(data, "navBlog")],
    ["contact", getValue(data, "navContact")],
  ];

  function handleNavigate(id: string) {
    setCurrentPage(id);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#172433]/10 bg-[#f7efe2]/88 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate("home")}
          className="group flex items-center gap-3 text-right"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#172433] text-lg font-semibold text-[#f8efe0] shadow-lg shadow-[#172433]/20 transition duration-300 group-hover:scale-105">
            {getValue(data, "logoText")}
          </span>

          <span className="text-xl font-semibold tracking-[-0.04em] text-[#172433]">
            {getValue(data, "brandName")}
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-[#172433]/10 bg-white/60 p-1 shadow-sm backdrop-blur-xl lg:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => handleNavigate(id)}
              className={cx(
                "rounded-full px-4 py-2 text-sm font-semibold transition duration-300",
                currentPage === id
                  ? "bg-[#172433] text-[#f8efe0] shadow-md"
                  : "text-[#43515d] hover:bg-white hover:text-[#172433]",
              )}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openConsultation}
            className="hidden rounded-full bg-[#b5894d] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#b5894d]/20 transition duration-300 hover:-translate-y-0.5 sm:inline-flex"
          >
            {getValue(data, "heroPrimaryButton")}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#172433]/10 bg-white/70 text-[#172433] shadow-sm lg:hidden"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#172433]/10 bg-[#f7efe2]/96 px-5 pb-5 backdrop-blur-2xl lg:hidden">
          <div className="grid gap-2 rounded-[28px] border border-[#172433]/10 bg-white/65 p-2 shadow-xl shadow-[#172433]/10">
            {nav.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                className={cx(
                  "rounded-2xl px-4 py-3 text-right text-sm font-semibold transition",
                  currentPage === id
                    ? "bg-[#172433] text-[#f8efe0]"
                    : "text-[#43515d] hover:bg-white",
                )}
              >
                {label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openConsultation();
              }}
              className="rounded-2xl bg-[#b5894d] px-4 py-3 text-sm font-semibold text-white"
            >
              {getValue(data, "heroPrimaryButton")}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function ConsultationModal({
  data,
  open,
  onClose,
}: {
  data: Record<string, any>;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#101821]/70 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/15 bg-[#f7efe2] shadow-2xl shadow-black/30">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/80 text-xl font-semibold text-[#172433] shadow-sm transition hover:scale-105"
        >
          ×
        </button>

        <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative overflow-hidden bg-[#172433] p-8 text-[#f8efe0] lg:p-11">
            <div className="absolute left-8 top-8 h-40 w-40 rounded-full bg-[#b5894d]/20 blur-3xl" />
            <div className="absolute bottom-8 right-8 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                בדיקת תיק ראשונית
              </p>

              <h3 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.055em] md:text-5xl">
                השאירו פרטים ונחזור עם כיוון פעולה ברור.
              </h3>

              <p className="mt-5 text-base leading-7 text-[#f8efe0]/75">
                מודאל ייעוץ משפטי ממוקד: דיסקרטי, סמכותי וברור — בלי להעמיס על המשתמש.
              </p>

              <div className="mt-9 grid gap-3">
                {["בדיקת התאמה", "שיחת ייעוץ ראשונית", "בניית כיוון משפטי"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold backdrop-blur"
                    >
                      ✓ {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          <form className="p-6 lg:p-10">
            <div className="grid gap-4">
              <input className="rounded-2xl border border-[#172433]/10 bg-white/85 px-5 py-4 text-right outline-none transition focus:border-[#b5894d]" placeholder="שם מלא" />
              <input className="rounded-2xl border border-[#172433]/10 bg-white/85 px-5 py-4 text-right outline-none transition focus:border-[#b5894d]" placeholder="טלפון" />
              <input className="rounded-2xl border border-[#172433]/10 bg-white/85 px-5 py-4 text-right outline-none transition focus:border-[#b5894d]" placeholder="אימייל" />
              <select className="rounded-2xl border border-[#172433]/10 bg-white/85 px-5 py-4 text-right outline-none transition focus:border-[#b5894d]">
                <option>תחום משפטי</option>
                <option>דיני משפחה</option>
                <option>משפט מסחרי</option>
                <option>נדל״ן ומקרקעין</option>
                <option>ליטיגציה וייצוג</option>
              </select>
              <textarea className="min-h-32 rounded-2xl border border-[#172433]/10 bg-white/85 px-5 py-4 text-right outline-none transition focus:border-[#b5894d]" placeholder="כמה מילים על המקרה" />

              <button
                type="button"
                className="rounded-full bg-[#b5894d] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-[#b5894d]/20 transition hover:-translate-y-0.5"
              >
                {getValue(data, "contactButton")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Hero({
  data,
  goTo,
  openConsultation,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openConsultation: () => void;
}) {
  const stats = [
    ["275+", "תיקים מוצלחים"],
    ["157+", "לקוחות מרוצים"],
    ["50M", "חיסכון ללקוחות"],
  ];

  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-14 lg:px-8 lg:pb-24 lg:pt-20">
      <div className="absolute left-[8%] top-16 h-72 w-72 rounded-full bg-[#b5894d]/18 blur-3xl" />
      <div className="absolute bottom-20 right-[10%] h-80 w-80 rounded-full bg-[#172433]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1380px]">
        <div className="grid items-end gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="pb-2">
            <p className="mb-5 inline-flex rounded-full border border-[#172433]/15 bg-white/70 px-4 py-2 text-sm font-semibold text-[#9b7a45] shadow-sm">
              {getValue(data, "heroEyebrow")}
            </p>

            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.96] tracking-[-0.08em] text-[#172433] md:text-7xl lg:text-[96px]">
              {getValue(data, "heroTitle")}
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5d6671] md:text-xl">
              {getValue(data, "heroSubtitle")}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openConsultation}
                className="rounded-full bg-[#172433] px-7 py-4 text-base font-semibold text-[#f8efe0] shadow-2xl shadow-[#172433]/15 transition duration-300 hover:-translate-y-0.5"
              >
                {getValue(data, "heroPrimaryButton")}
              </button>

              <button
                type="button"
                onClick={() => goTo("practice")}
                className="rounded-full border border-[#172433]/15 bg-white/70 px-7 py-4 text-base font-semibold text-[#172433] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                {getValue(data, "heroSecondaryButton")}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-5 -top-5 h-full w-full rounded-[44px] bg-[#172433]" />

            <div className="relative overflow-hidden rounded-[44px] border border-white/75 bg-white/50 p-3 shadow-2xl shadow-[#172433]/20">
              <img
                src={getValue(data, "heroImage")}
                alt=""
                className="h-[540px] w-full rounded-[34px] object-cover"
              />

              <div className="absolute inset-3 rounded-[34px] bg-gradient-to-t from-[#101821]/68 via-[#101821]/10 to-transparent" />

              <div className="absolute bottom-8 right-8 max-w-[300px] rounded-[28px] border border-white/15 bg-[#f8efe0]/90 p-5 text-[#172433] shadow-2xl backdrop-blur">
                <p className="text-sm font-semibold">{getValue(data, "heroCardTitle")}</p>
                <p className="mt-2 text-sm leading-6 text-[#5d6671]">
                  {getValue(data, "heroCardText")}
                </p>
              </div>

              <div className="absolute left-8 top-8 rounded-full bg-[#b5894d] px-4 py-2 text-sm font-semibold text-white shadow-xl">
                Your legal advocate
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid overflow-hidden rounded-[34px] border border-[#172433]/10 bg-white/72 shadow-2xl shadow-[#172433]/10 backdrop-blur-xl md:grid-cols-3">
          {stats.map(([num, label], index) => (
            <div
              key={label}
              className={cx(
                "p-7 text-center md:p-9",
                index !== 2 && "border-b border-[#172433]/10 md:border-b-0 md:border-l",
              )}
            >
              <div className="text-5xl font-semibold tracking-[-0.08em] text-[#172433] md:text-6xl">
                {num}
              </div>
              <div className="mt-3 text-sm font-semibold text-[#6b7179]">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PracticeAreasSection({
  data,
  openConsultation,
}: {
  data: Record<string, any>;
  openConsultation: () => void;
}) {
  const practice = [
    {
      title: getValue(data, "practiceOneTitle"),
      text: getValue(data, "practiceOneText"),
      icon: "01",
      tag: "Family Law",
    },
    {
      title: getValue(data, "practiceTwoTitle"),
      text: getValue(data, "practiceTwoText"),
      icon: "02",
      tag: "Corporate Law",
    },
    {
      title: getValue(data, "practiceFourTitle"),
      text: getValue(data, "practiceFourText"),
      icon: "03",
      tag: "Criminal Defense",
    },
    {
      title: "דיני עבודה",
      text: "ייעוץ וליווי בסכסוכי עבודה, חוזים, פיטורין, זכויות עובדים ומעסיקים.",
      icon: "04",
      tag: "Employment Law",
    },
    {
      title: "נזקי גוף",
      text: "ייצוג וליווי בתביעות נזיקין, תאונות, רשלנות ופגיעות משמעותיות.",
      icon: "05",
      tag: "Personal Injury",
    },
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1380px]">
        <div className="grid items-end gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionTitle
            eyebrow={getValue(data, "practiceEyebrow")}
            title="מגוון תחומי התמחות משפטיים"
            text="כמו ב־Justify, תחומי ההתמחות מוצגים ככרטיסים רחבים וברורים שמאפשרים למשתמש להבין מיד לאן לפנות."
          />

          <div className="flex justify-start gap-3 lg:justify-end">
            <button
              type="button"
              onClick={openConsultation}
              className="rounded-full bg-[#172433] px-6 py-4 text-sm font-semibold text-[#f8efe0] transition hover:-translate-y-0.5"
            >
              ייעוץ ראשוני
            </button>
            <button
              type="button"
              className="rounded-full border border-[#172433]/15 bg-white/70 px-6 py-4 text-sm font-semibold text-[#172433] transition hover:bg-white"
            >
              כל התחומים
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {practice.map((item, index) => (
            <article
              key={item.title}
              className={cx(
                "group relative min-h-[300px] overflow-hidden rounded-[34px] border border-[#172433]/10 bg-white/72 p-7 shadow-xl shadow-[#172433]/8 transition duration-500 hover:-translate-y-2 hover:bg-white",
                index === 0 && "lg:col-span-2",
                index === 4 && "lg:col-span-2",
              )}
            >
              <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-[#b5894d]/0 blur-3xl transition duration-500 group-hover:bg-[#b5894d]/20" />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="mb-10 flex items-center justify-between">
                    <span className="rounded-full bg-[#172433] px-4 py-2 text-sm font-semibold text-[#f8efe0]">
                      {item.icon}
                    </span>
                    <span className="text-sm font-semibold text-[#9b7a45]">{item.tag}</span>
                  </div>

                  <h3 className="max-w-xl text-3xl font-semibold tracking-[-0.05em] text-[#172433]">
                    {item.title}
                  </h3>

                  <p className="mt-4 max-w-xl text-base leading-7 text-[#5d6671]">
                    {item.text}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openConsultation}
                  className="mt-8 flex w-full items-center justify-between rounded-full border border-[#172433]/10 bg-[#f7efe2] px-5 py-4 text-sm font-semibold text-[#172433] transition duration-300 group-hover:bg-[#172433] group-hover:text-[#f8efe0]"
                >
                  <span>בדיקת התאמה</span>
                  <span>↗</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookNowSection({
  data,
  openConsultation,
}: {
  data: Record<string, any>;
  openConsultation: () => void;
}) {
  return (
    <section className="px-5 py-8 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-[1380px] overflow-hidden rounded-[46px] bg-[#172433] text-[#f8efe0] shadow-2xl shadow-[#172433]/25 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[430px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1300&q=85"
            alt=""
            className="h-full min-h-[430px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#172433]/80 via-[#172433]/20 to-transparent" />
        </div>

        <div className="relative p-8 lg:p-12">
          <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-[#b5894d]/20 blur-3xl" />

          <div className="relative z-10">
            <p className="mb-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Book now
            </p>

            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-0.055em] md:text-6xl">
              קבעו פגישה פרונטלית או ייעוץ משפטי אונליין.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#f8efe0]/72">
              בדיוק כמו ב־Justify: בלוק גדול, חד וברור שמוביל לפעולה אחת — קביעת ייעוץ.
            </p>

            <button
              type="button"
              onClick={openConsultation}
              className="mt-9 rounded-full bg-[#f8efe0] px-8 py-4 text-base font-semibold text-[#172433] transition hover:-translate-y-0.5"
            >
              {getValue(data, "reviewButton")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LawyersSection({ data }: { data: Record<string, any> }) {
  const lawyers = [
    [getValue(data, "lawyerOneName"), getValue(data, "lawyerOneRole"), getValue(data, "lawyerOneImage")],
    [getValue(data, "lawyerTwoName"), getValue(data, "lawyerTwoRole"), getValue(data, "lawyerTwoImage")],
    [getValue(data, "lawyerThreeName"), getValue(data, "lawyerThreeRole"), getValue(data, "lawyerThreeImage")],
  ];

  const points = [
    "בניית אסטרטגיה משפטית כבר מהשיחה הראשונה.",
    "ניהול מסמכים, ראיות ולוחות זמנים בצורה מסודרת.",
    "עדכונים ברורים ושקיפות לאורך כל הדרך.",
    "שמירה על דיסקרטיות מלאה ויחס אישי.",
    "חשיבה משפטית שמחברת בין סיכון, זמן ותוצאה.",
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1380px]">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionTitle
              eyebrow={getValue(data, "lawyersEyebrow")}
              title="עזרה משפטית מקצועית שמובילה לתוצאה טובה יותר."
              text="אזור עורכי הדין בנוי כמו Justify — לא רק כרטיסי צוות, אלא שילוב של ערך, נקודות מקצועיות ותמונות אמינות של עורכי דין."
            />

            <div className="mt-10 grid gap-4">
              {points.map((point, index) => (
                <div
                  key={point}
                  className="group flex items-center gap-4 rounded-[26px] border border-[#172433]/10 bg-white/70 p-4 shadow-lg shadow-[#172433]/5 transition hover:-translate-y-1 hover:bg-white"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#172433] text-sm font-semibold text-[#f8efe0]">
                    {index + 1}
                  </span>
                  <p className="font-semibold leading-7 text-[#43515d]">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {lawyers.map(([name, role, image], index) => (
              <article
                key={name}
                className={cx(
                  "group overflow-hidden rounded-[36px] border border-white/80 bg-white/70 p-3 shadow-2xl shadow-[#172433]/10 transition duration-500 hover:-translate-y-3",
                  index === 0 && "md:col-span-2",
                  index === 2 && "md:translate-y-8",
                )}
              >
                <div className="relative overflow-hidden rounded-[28px]">
                  <img
                    src={image}
                    alt=""
                    className={cx(
                      "w-full rounded-[28px] object-cover transition duration-700 group-hover:scale-105",
                      index === 0 ? "h-[430px]" : "h-[330px]",
                    )}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101821]/68 via-transparent to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 rounded-3xl border border-white/15 bg-[#172433]/78 p-5 text-[#f8efe0] backdrop-blur-md">
                    <h3 className="text-2xl font-semibold tracking-[-0.05em]">{name}</h3>
                    <p className="mt-1 text-sm text-[#f8efe0]/70">{role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CasesSection({ data }: { data: Record<string, any> }) {
  const cases = [
    [getValue(data, "caseOneTitle"), getValue(data, "caseOneText"), "$75,000", "Family Law"],
    [getValue(data, "caseTwoTitle"), getValue(data, "caseTwoText"), "$85,000", "Corporate"],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle
            eyebrow={getValue(data, "casesEyebrow")}
            title="סיפורי הצלחה משפטיים"
            text="במקום גריד רגיל, כאן יש כרטיסי Case Studies גדולים עם סכום, תחום ותיאור — כמו ב־Justify."
          />

          <button
            type="button"
            className="w-fit rounded-full border border-[#172433]/15 bg-white/70 px-6 py-4 text-sm font-semibold text-[#172433] transition hover:bg-white"
          >
            כל התיקים
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {cases.map(([title, text, amount, tag], index) => (
            <article
              key={title}
              className="group overflow-hidden rounded-[40px] border border-[#172433]/10 bg-white/70 shadow-2xl shadow-[#172433]/10 transition duration-500 hover:-translate-y-2 hover:bg-white"
            >
              <div className="grid h-full lg:grid-cols-[0.8fr_1.2fr]">
                <div className="relative min-h-[300px] bg-[#172433] p-7 text-[#f8efe0]">
                  <div className="absolute left-5 top-5 h-28 w-28 rounded-full bg-[#b5894d]/25 blur-2xl" />

                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                        {tag}
                      </span>
                      <div className="mt-10 text-6xl font-semibold tracking-[-0.08em] text-[#b5894d]">
                        {amount}
                      </div>
                    </div>

                    <p className="text-sm text-[#f8efe0]/60">
                      Case Study 0{index + 1}
                    </p>
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="text-3xl font-semibold tracking-[-0.05em] text-[#172433]">
                    {title}
                  </h3>
                  <p className="mt-4 leading-8 text-[#5d6671]">{text}</p>

                  <button
                    type="button"
                    className="mt-8 rounded-full bg-[#172433] px-6 py-4 text-sm font-semibold text-[#f8efe0] transition hover:-translate-y-0.5"
                  >
                    קריאת מקרה
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ data }: { data: Record<string, any> }) {
  const testimonials = [
    ["Professional and dedicated", getValue(data, "testimonialOneText"), getValue(data, "testimonialOneName")],
    ["Exceptional service", getValue(data, "testimonialTwoText"), getValue(data, "testimonialTwoName")],
    ["Highly recommend", getValue(data, "testimonialThreeText"), getValue(data, "testimonialThreeName")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="h-fit lg:sticky lg:top-28">
          <SectionTitle
            eyebrow={getValue(data, "testimonialsEyebrow")}
            title="מה לקוחות אומרים?"
            text="המלצות מוצגות כטקסטים ארוכים ואמינים עם דירוג ותחושה משפטית נקייה."
          />
        </div>

        <div className="grid gap-5">
          {testimonials.map(([title, text, name], index) => (
            <article
              key={title}
              className="rounded-[34px] border border-[#172433]/10 bg-white/72 p-7 shadow-xl shadow-[#172433]/8 transition duration-500 hover:-translate-y-2 hover:bg-white"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#172433]">
                    “{title}”
                  </h3>
                  <p className="mt-4 text-lg leading-8 text-[#5d6671]">"{text}"</p>
                </div>

                <div className="hidden rounded-full bg-[#172433] px-4 py-2 text-sm font-semibold text-[#f8efe0] sm:block">
                  0{index + 1}
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-[#172433]/10 pt-5">
                <p className="font-semibold text-[#172433]">{name}</p>
                <p className="text-[#b5894d]">★★★★★</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FreeReviewSection({
  data,
  openConsultation,
}: {
  data: Record<string, any>;
  openConsultation: () => void;
}) {
  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1380px] overflow-hidden rounded-[48px] bg-[#172433] p-7 text-[#f8efe0] shadow-2xl shadow-[#172433]/25 lg:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Free Case Review
            </p>

            <h2 className="max-w-4xl text-4xl font-semibold leading-[1.03] tracking-[-0.055em] md:text-6xl">
              קבלו בדיקת תיק ראשונית לפני שמקבלים החלטה משפטית.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#f8efe0]/72">
              בלוק CTA גדול כמו ב־Justify — ממוקד, יוקרתי וברור. מתאים בדיוק להמרת לקוחות.
            </p>

            <button
              type="button"
              onClick={openConsultation}
              className="mt-9 rounded-full bg-[#f8efe0] px-8 py-4 text-base font-semibold text-[#172433] transition hover:-translate-y-0.5"
            >
              {getValue(data, "heroPrimaryButton")}
            </button>
          </div>

          <div className="grid gap-4">
            {["בדיקת סיכונים", "איסוף פרטים", "כיוון פעולה", "הערכת המשך טיפול"].map(
              (item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:bg-white/10"
                >
                  <span className="font-semibold">{item}</span>
                  <span className="text-[#b5894d]">0{index + 1}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogSection({ data }: { data: Record<string, any> }) {
  const posts = [
    [getValue(data, "postOneTitle"), getValue(data, "postOneText"), "Divorce", "June 20, 2024"],
    [getValue(data, "postTwoTitle"), getValue(data, "postTwoText"), "Defense", "June 20, 2024"],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle
            eyebrow={getValue(data, "blogEyebrow")}
            title="Discover our resource"
            text="אזור מאמרים דומה ל־Justify: שני מאמרים גדולים, תגית, תאריך וטקסט קצר."
          />

          <button
            type="button"
            className="w-fit rounded-full border border-[#172433]/15 bg-white/70 px-6 py-4 text-sm font-semibold text-[#172433] transition hover:bg-white"
          >
            כל המאמרים
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {posts.map(([title, text, tag, date], index) => (
            <article
              key={title}
              className="group rounded-[38px] border border-[#172433]/10 bg-white/72 p-7 shadow-xl shadow-[#172433]/8 transition duration-500 hover:-translate-y-2 hover:bg-white"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="rounded-full bg-[#172433] px-4 py-2 text-sm font-semibold text-[#f8efe0]">
                  {tag}
                </span>
                <span className="text-sm font-semibold text-[#9b7a45]">{date}</span>
              </div>

              <h3 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.05em] text-[#172433]">
                {title}
              </h3>

              <p className="mt-4 max-w-xl leading-8 text-[#5d6671]">{text}</p>

              <button
                type="button"
                className="mt-9 rounded-full border border-[#172433]/15 px-6 py-4 text-sm font-semibold text-[#172433] transition hover:bg-[#172433] hover:text-[#f8efe0]"
              >
                לקריאה
              </button>

              <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-[#172433]/10">
                <div
                  className={cx(
                    "h-full rounded-full bg-[#b5894d] transition duration-700 group-hover:w-full",
                    index === 0 ? "w-[70%]" : "w-[52%]",
                  )}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialFeedSection({ data }: { data: Record<string, any> }) {
  const images = [
    getValue(data, "lawyerOneImage"),
    getValue(data, "lawyerTwoImage"),
    getValue(data, "lawyerThreeImage"),
    getValue(data, "heroImage"),
    getValue(data, "aboutImage"),
    "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1528747008803-f9f5ccbc0852?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=85",
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1380px]">
        <SectionTitle
          center
          eyebrow="Instagram feed"
          title="עקבו אחרינו ברשתות"
          text="אזור תמונות רחב כמו ב־Justify — נותן חיים, אמינות ותחושה של משרד פעיל."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className={cx(
                "group overflow-hidden rounded-[30px] border border-white/80 bg-white/60 p-2 shadow-xl shadow-[#172433]/8 transition duration-500 hover:-translate-y-2",
                index === 0 && "md:row-span-2",
                index === 3 && "md:row-span-2",
              )}
            >
              <img
                src={image}
                alt=""
                className={cx(
                  "w-full rounded-[24px] object-cover transition duration-700 group-hover:scale-105",
                  index === 0 || index === 3 ? "h-[420px]" : "h-[200px]",
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ data }: { data: Record<string, any> }) {
  const [open, setOpen] = useState(0);

  const faqs = [
    [getValue(data, "faqOneQuestion"), getValue(data, "faqOneAnswer")],
    [getValue(data, "faqTwoQuestion"), getValue(data, "faqTwoAnswer")],
    [getValue(data, "faqThreeQuestion"), getValue(data, "faqThreeAnswer")],
  ];

  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1380px] gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionTitle
          eyebrow={getValue(data, "faqEyebrow")}
          title={getValue(data, "faqTitle")}
          text="שאלות נפוצות לפני שיחת ייעוץ ראשונית."
        />

        <div className="space-y-4">
          {faqs.map(([question, answer], index) => {
            const isOpen = open === index;

            return (
              <div
                key={question}
                className="overflow-hidden rounded-[30px] border border-[#172433]/10 bg-white/72 shadow-xl shadow-[#172433]/6 transition hover:bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-6 p-6 text-right"
                >
                  <span className="text-xl font-semibold tracking-[-0.04em] text-[#172433]">
                    {question}
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#172433] text-lg text-[#f8efe0]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div
                  className={cx(
                    "grid transition-all duration-500 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-base leading-7 text-[#5d6671]">
                      {answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactSection({
  data,
  openConsultation,
}: {
  data: Record<string, any>;
  openConsultation: () => void;
}) {
  const infoCards = [
    ["Office Address", getValue(data, "address")],
    ["General Inquiries", getValue(data, "email")],
    ["Phone", getValue(data, "phone")],
  ];

  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1380px] overflow-hidden rounded-[48px] border border-[#172433]/10 bg-[#172433] text-[#f8efe0] shadow-2xl shadow-[#172433]/20 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative p-8 lg:p-12">
          <div className="absolute left-8 top-8 h-32 w-32 rounded-full bg-[#b5894d]/20 blur-2xl" />

          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              {getValue(data, "contactEyebrow")}
            </p>

            <h2 className="text-4xl font-semibold leading-[1.06] tracking-[-0.055em] md:text-6xl">
              {getValue(data, "contactTitle")}
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#f8efe0]/75">
              {getValue(data, "contactText")}
            </p>

            <div className="mt-10 grid gap-3">
              {infoCards.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[26px] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm transition duration-300 hover:bg-white/10"
                >
                  <div className="text-xs font-semibold text-[#f8efe0]/60">{label}</div>
                  <div className="mt-1 text-base font-semibold text-[#f8efe0]">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={openConsultation}
              className="mt-8 rounded-full bg-[#f8efe0] px-7 py-4 text-sm font-semibold text-[#172433] transition duration-300 hover:-translate-y-0.5"
            >
              לפתיחת חלון ייעוץ מהיר
            </button>
          </div>
        </div>

        <form className="m-4 rounded-[40px] bg-[#f7efe2] p-5 text-[#172433] shadow-inner lg:m-6 lg:p-7">
          <div className="grid gap-4">
            <input className="rounded-2xl border border-[#172433]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b5894d]" placeholder="שם מלא" />
            <input className="rounded-2xl border border-[#172433]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b5894d]" placeholder="טלפון" />
            <input className="rounded-2xl border border-[#172433]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b5894d]" placeholder="אימייל" />
            <textarea className="min-h-36 rounded-2xl border border-[#172433]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b5894d]" placeholder="מה תרצו לשאול?" />

            <button
              type="button"
              className="rounded-full bg-[#b5894d] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-[#b5894d]/20 transition duration-300 hover:-translate-y-0.5"
            >
              {getValue(data, "contactButton")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer({
  data,
  goTo,
  openConsultation,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openConsultation: () => void;
}) {
  const nav = [
    ["home", getValue(data, "navHome")],
    ["about", getValue(data, "navAbout")],
    ["practice", getValue(data, "navPractice")],
    ["cases", getValue(data, "navCases")],
    ["blog", getValue(data, "navBlog")],
    ["lawyers", getValue(data, "navLawyers")],
    ["contact", getValue(data, "navContact")],
  ];

  return (
    <footer className="px-5 pb-10 lg:px-8">
      <div className="mx-auto max-w-[1380px] overflow-hidden rounded-[48px] bg-[#101821] text-[#f8efe0] shadow-2xl shadow-[#172433]/25">
        <div className="grid gap-10 p-8 lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr] lg:p-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#b5894d] text-lg font-semibold text-white">
                {getValue(data, "logoText")}
              </span>
              <span className="text-2xl font-semibold tracking-[-0.04em]">
                {getValue(data, "brandName")}
              </span>
            </div>

            <p className="mt-6 max-w-sm leading-8 text-[#f8efe0]/65">
              {getValue(data, "ctaText")}
            </p>

            <button
              type="button"
              onClick={openConsultation}
              className="mt-7 rounded-full bg-[#f8efe0] px-7 py-4 text-sm font-semibold text-[#172433] transition hover:-translate-y-0.5"
            >
              {getValue(data, "ctaButton")}
            </button>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-semibold">Navigation</h4>
            <div className="grid gap-3">
              {nav.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => goTo(id)}
                  className="w-fit text-sm font-semibold text-[#f8efe0]/65 transition hover:text-[#b5894d]"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-semibold">CMS</h4>
            <div className="grid gap-3 text-sm font-semibold text-[#f8efe0]/65">
              <span>Blog</span>
              <span>Blog Post Page</span>
              <span>Practice Page</span>
              <span>Lawyers Page</span>
              <span>Cases Page</span>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-semibold">Contact</h4>
            <div className="grid gap-4 text-sm font-semibold text-[#f8efe0]/65">
              <span>{getValue(data, "address")}</span>
              <span>{getValue(data, "email")}</span>
              <span>{getValue(data, "phone")}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-8 py-6 text-sm text-[#f8efe0]/50 lg:px-12">
          © {new Date().getFullYear()} {getValue(data, "brandName")} · Justora Template
        </div>
      </div>
    </footer>
  );
}

function HomePage({
  data,
  goTo,
  openConsultation,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openConsultation: () => void;
}) {
  return (
    <>
      <Hero data={data} goTo={goTo} openConsultation={openConsultation} />
      <PracticeAreasSection data={data} openConsultation={openConsultation} />
      <BookNowSection data={data} openConsultation={openConsultation} />
      <LawyersSection data={data} />
      <CasesSection data={data} />
      <TestimonialsSection data={data} />
      <FreeReviewSection data={data} openConsultation={openConsultation} />
      <BlogSection data={data} />
      <SocialFeedSection data={data} />
      <FaqSection data={data} />
      <ContactSection data={data} openConsultation={openConsultation} />
      <Footer data={data} goTo={goTo} openConsultation={openConsultation} />
    </>
  );
}

function SimplePage({
  data,
  type,
  goTo,
  openConsultation,
}: {
  data: Record<string, any>;
  type: string;
  goTo: (page: string) => void;
  openConsultation: () => void;
}) {
  const pageMap: Record<string, React.ReactNode> = {
    about: (
      <>
        <BookNowSection data={data} openConsultation={openConsultation} />
        <LawyersSection data={data} />
        <TestimonialsSection data={data} />
      </>
    ),
    practice: (
      <>
        <PracticeAreasSection data={data} openConsultation={openConsultation} />
        <FreeReviewSection data={data} openConsultation={openConsultation} />
      </>
    ),
    lawyers: <LawyersSection data={data} />,
    cases: (
      <>
        <CasesSection data={data} />
        <TestimonialsSection data={data} />
      </>
    ),
    blog: <BlogSection data={data} />,
    contact: <ContactSection data={data} openConsultation={openConsultation} />,
  };

  return (
    <>
      <section className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
        <div className="absolute left-[10%] top-10 h-56 w-56 rounded-full bg-[#b5894d]/20 blur-3xl" />
        <div className="absolute right-[12%] bottom-10 h-56 w-56 rounded-full bg-[#172433]/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1380px] text-center">
          <p className="mb-4 inline-flex rounded-full border border-[#172433]/15 bg-white/70 px-4 py-2 text-sm font-semibold text-[#9b7a45] shadow-sm">
            {getValue(data, "brandName")}
          </p>

          <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.07em] text-[#172433] md:text-7xl">
            {getPageTitle(data, type)}
          </h1>
        </div>
      </section>

      {pageMap[type] ?? null}

      <Footer data={data} goTo={goTo} openConsultation={openConsultation} />
    </>
  );
}

export default function JustoraPages({
  initialPage = "home",
  page,
  mode = "preview",
  data,
}: JustoraPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...justoraDefaultData,
      ...(data ?? {}),
    }),
    [data],
  );

  const [currentPage, setCurrentPage] = useState(page || initialPage || "home");
  const [consultationOpen, setConsultationOpen] = useState(false);

  function goTo(nextPage: string) {
    setCurrentPage(nextPage);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "justora-preview" : "justora"}
      className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_12%_8%,rgba(181,137,77,0.20),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(23,36,51,0.12),transparent_28%),linear-gradient(180deg,#f7efe2_0%,#f2eadb_52%,#eef1f3_100%)] font-sans text-[#172433]"
    >
      <Header
        data={mergedData}
        currentPage={currentPage}
        setCurrentPage={goTo}
        openConsultation={() => setConsultationOpen(true)}
      />

      {currentPage === "home" ? (
        <HomePage
          data={mergedData}
          goTo={goTo}
          openConsultation={() => setConsultationOpen(true)}
        />
      ) : (
        <SimplePage
          data={mergedData}
          type={currentPage}
          goTo={goTo}
          openConsultation={() => setConsultationOpen(true)}
        />
      )}

      <ConsultationModal
        data={mergedData}
        open={consultationOpen}
        onClose={() => setConsultationOpen(false)}
      />
    </div>
  );
}