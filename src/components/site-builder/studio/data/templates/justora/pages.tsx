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
    <div
      className={cx(
        "mx-auto max-w-3xl",
        center ? "text-center" : "text-right",
      )}
    >
      <p
        className={cx(
          "mb-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-xl",
          light
            ? "border border-white/15 bg-white/10 text-[#f5ead6]/85"
            : "border border-[#1b2d3d]/15 bg-white/70 text-[#9b7a45]",
        )}
      >
        {eyebrow}
      </p>

      <h2
        className={cx(
          "text-4xl font-semibold leading-[1.04] tracking-[-0.055em] md:text-6xl",
          light ? "text-[#f8efe0]" : "text-[#172433]",
        )}
      >
        {title}
      </h2>

      {text ? (
        <p
          className={cx(
            "mt-5 text-lg leading-8",
            light ? "text-[#f8efe0]/72" : "text-[#5d6671]",
          )}
        >
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
    <header className="sticky top-0 z-50 border-b border-[#1b2d3d]/10 bg-[#f6efe3]/86 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
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

        <nav className="hidden items-center gap-1 rounded-full border border-[#1b2d3d]/10 bg-white/55 p-1 shadow-sm backdrop-blur-xl lg:flex">
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
            className="hidden rounded-full bg-[#b5894d] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#b5894d]/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:inline-flex"
          >
            {getValue(data, "heroPrimaryButton")}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#172433]/10 bg-white/65 text-[#172433] shadow-sm backdrop-blur lg:hidden"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#172433]/10 bg-[#f6efe3]/95 px-5 pb-5 backdrop-blur-2xl lg:hidden">
          <div className="grid gap-2 rounded-[28px] border border-[#172433]/10 bg-white/60 p-2 shadow-xl shadow-[#172433]/8">
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
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#101821]/65 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[38px] border border-white/20 bg-[#f6efe3] shadow-2xl shadow-black/30">
        <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-[#b5894d]/25 blur-3xl" />
        <div className="absolute bottom-8 right-10 h-52 w-52 rounded-full bg-[#1b2d3d]/18 blur-3xl" />

        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/75 text-xl font-semibold text-[#172433] shadow-sm transition hover:scale-105"
        >
          ×
        </button>

        <div className="relative z-10 grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[#172433] p-8 text-[#f8efe0] lg:p-10">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              בדיקת תיק ראשונית
            </p>

            <h3 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.055em] md:text-5xl">
              השאירו פרטים ונחזור עם כיוון פעולה ברור.
            </h3>

            <p className="mt-5 text-base leading-7 text-[#f8efe0]/75">
              מודאל CTA ממוקד שמתאים למשרד עורכי דין: דיסקרטי, סמכותי וברור.
            </p>

            <div className="mt-8 grid gap-3">
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

          <form className="p-6 lg:p-10">
            <div className="grid gap-4">
              <input
                className="rounded-2xl border border-[#172433]/10 bg-white/85 px-5 py-4 text-right outline-none transition focus:border-[#b5894d]"
                placeholder="שם מלא"
              />
              <input
                className="rounded-2xl border border-[#172433]/10 bg-white/85 px-5 py-4 text-right outline-none transition focus:border-[#b5894d]"
                placeholder="טלפון"
              />
              <input
                className="rounded-2xl border border-[#172433]/10 bg-white/85 px-5 py-4 text-right outline-none transition focus:border-[#b5894d]"
                placeholder="אימייל"
              />
              <select className="rounded-2xl border border-[#172433]/10 bg-white/85 px-5 py-4 text-right outline-none transition focus:border-[#b5894d]">
                <option>תחום משפטי</option>
                <option>דיני משפחה</option>
                <option>משפט מסחרי</option>
                <option>נדל״ן ומקרקעין</option>
                <option>ליטיגציה וייצוג</option>
              </select>
              <textarea
                className="min-h-28 rounded-2xl border border-[#172433]/10 bg-white/85 px-5 py-4 text-right outline-none transition focus:border-[#b5894d]"
                placeholder="כמה מילים על המקרה"
              />

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
  const chips = ["Family Law", "Business", "Real Estate", "Litigation"];

  const stats = [
    [getValue(data, "heroStatOne"), getValue(data, "heroStatOneLabel")],
    [getValue(data, "heroStatTwo"), getValue(data, "heroStatTwoLabel")],
    [getValue(data, "heroStatThree"), getValue(data, "heroStatThreeLabel")],
  ];

  return (
    <section className="relative isolate overflow-hidden px-5 pb-24 pt-14 lg:px-8 lg:pb-36 lg:pt-20">
      <div className="absolute left-[5%] top-20 -z-10 h-72 w-72 rounded-full bg-[#b5894d]/22 blur-3xl" />
      <div className="absolute right-[8%] top-[42%] -z-10 h-80 w-80 rounded-full bg-[#172433]/12 blur-3xl" />
      <div className="absolute left-1/2 top-24 -z-10 h-64 w-64 rounded-full bg-white/65 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-[#172433]/15 bg-white/70 px-4 py-2 text-sm font-semibold text-[#9b7a45] shadow-sm backdrop-blur-xl">
            {getValue(data, "heroEyebrow")}
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.075em] text-[#172433] md:text-7xl lg:text-8xl">
            {getValue(data, "heroTitle")}
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5d6671] md:text-xl">
            {getValue(data, "heroSubtitle")}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#172433]/10 bg-white/65 px-4 py-2 text-sm font-semibold text-[#43515d] shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                {chip}
              </span>
            ))}
          </div>

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
              className="rounded-full border border-[#172433]/15 bg-white/65 px-7 py-4 text-base font-semibold text-[#172433] shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              {getValue(data, "heroSecondaryButton")}
            </button>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {stats.map(([num, label]) => (
              <div
                key={label}
                className="group rounded-3xl border border-[#172433]/10 bg-white/68 p-4 text-center shadow-2xl shadow-[#172433]/8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:bg-white/90"
              >
                <div className="text-2xl font-semibold tracking-[-0.04em] text-[#172433]">
                  {num}
                </div>
                <div className="mt-1 text-xs font-semibold text-[#68717c]">
                  {label}
                </div>
                <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[#b5894d] transition duration-500 group-hover:w-16" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[650px]">
          <div className="absolute right-0 top-0 z-10 h-[610px] w-[82%] rotate-[-2deg] rounded-[48px] bg-[#172433]/10" />

          <div className="group absolute right-2 top-4 z-20 w-[82%] overflow-hidden rounded-[48px] border border-white/80 bg-white/45 p-3 shadow-2xl shadow-[#172433]/16 backdrop-blur-xl transition duration-700 hover:rotate-0 lg:rotate-[1.5deg]">
            <img
              src={getValue(data, "heroImage")}
              alt=""
              className="h-[600px] w-full rounded-[40px] object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-3 rounded-[40px] bg-gradient-to-t from-[#101821]/48 via-transparent to-transparent" />
          </div>

          <div className="group absolute left-0 top-20 z-30 w-[43%] overflow-hidden rounded-[36px] border border-white/80 bg-white/78 p-3 shadow-2xl shadow-[#172433]/16 backdrop-blur-xl transition duration-700 hover:-translate-y-3">
            <img
              src={getValue(data, "aboutImage")}
              alt=""
              className="h-[250px] w-full rounded-[28px] object-cover transition duration-700 group-hover:scale-105"
            />
          </div>

          <div className="absolute bottom-10 right-8 z-40 max-w-[280px] rounded-[32px] border border-white/80 bg-white/84 p-5 shadow-2xl shadow-[#172433]/16 backdrop-blur-xl transition duration-500 hover:-translate-y-2">
            <p className="text-sm font-semibold text-[#172433]">
              {getValue(data, "heroCardTitle")}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#65707a]">
              {getValue(data, "heroCardText")}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {["LAW", "CASE", "WIN"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-[#f2eadb] px-3 py-2 text-center text-xs font-semibold text-[#172433]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-32 left-[16%] z-40 grid h-28 w-28 place-items-center rounded-full bg-[#172433] text-center text-[#f8efe0] shadow-2xl shadow-[#172433]/25 transition duration-500 hover:scale-105">
            <div>
              <div className="text-xs opacity-70">Legal</div>
              <div className="text-2xl font-semibold tracking-[-0.06em]">Trust</div>
            </div>
          </div>

          <div className="absolute left-[30%] top-3 z-40 rounded-full border border-[#172433]/10 bg-white/75 px-4 py-2 text-sm font-semibold text-[#43515d] shadow-xl shadow-[#172433]/10 backdrop-blur-xl">
            ייעוץ דיסקרטי
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip({ goTo }: { goTo: (page: string) => void }) {
  const items = [
    ["01", "בדיקת מקרה", "הבנה מהירה של הסוגיה המשפטית."],
    ["02", "אסטרטגיה", "כיוון פעולה ברור ומותאם."],
    ["03", "ייצוג", "ליווי מקצועי עד לסיום ההליך."],
  ];

  return (
    <section className="px-5 pb-10 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[42px] border border-[#172433]/10 bg-[#172433] p-4 text-[#f8efe0] shadow-2xl shadow-[#172433]/18">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
          {items.map(([num, title, text]) => (
            <div
              key={num}
              className="group rounded-[30px] border border-white/10 bg-white/5 p-5 transition duration-500 hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-3xl font-semibold tracking-[-0.07em] text-[#b5894d]">
                  {num}
                </span>
                <span className="h-2 w-2 rounded-full bg-[#e0c28d] transition duration-500 group-hover:scale-[2]" />
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.04em]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#f8efe0]/70">{text}</p>
            </div>
          ))}

          <button
            type="button"
            onClick={() => goTo("contact")}
            className="rounded-[30px] bg-[#f8efe0] px-7 py-5 text-sm font-semibold text-[#172433] transition duration-300 hover:-translate-y-1 lg:min-w-[170px]"
          >
            השארת פרטים
          </button>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ data }: { data: Record<string, any> }) {
  const bullets = [
    "שפה משפטית יוקרתית וברורה",
    "מבנה שמוביל לקביעת ייעוץ",
    "שילוב בין אמון, ניסיון ותוצאה",
    "מותאם למובייל ולעורך הוויזואלי",
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative">
          <div className="absolute -right-6 -top-6 h-full w-full rounded-[46px] border border-[#172433]/10" />

          <div className="group relative overflow-hidden rounded-[46px] border border-white/80 bg-white/45 p-3 shadow-2xl shadow-[#172433]/10 backdrop-blur-xl">
            <img
              src={getValue(data, "aboutImage")}
              alt=""
              className="h-[560px] w-full rounded-[38px] object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-3 rounded-[38px] bg-gradient-to-t from-[#172433]/30 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-8 right-6 max-w-[275px] rounded-[32px] border border-white/80 bg-white/84 p-5 shadow-2xl shadow-[#172433]/15 backdrop-blur-xl">
            <div className="text-4xl font-semibold tracking-[-0.07em] text-[#172433]">15+</div>
            <p className="mt-2 text-sm leading-6 text-[#5d6671]">
              שנות ניסיון, תהליכים ברורים וייצוג שמבוסס על אסטרטגיה.
            </p>
          </div>
        </div>

        <div>
          <SectionTitle
            eyebrow={getValue(data, "aboutEyebrow")}
            title={getValue(data, "aboutTitle")}
            text={getValue(data, "aboutText")}
          />

          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {bullets.map((item, index) => (
              <div
                key={item}
                className={cx(
                  "group rounded-[30px] border border-[#172433]/10 bg-white/66 p-5 text-[#43515d] shadow-2xl shadow-[#172433]/8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:bg-white/90",
                  index === 1 || index === 2 ? "md:translate-y-6" : "",
                )}
              >
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-[#b5894d]/18 text-[#172433] transition duration-500 group-hover:bg-[#172433] group-hover:text-[#f8efe0]">
                  ✓
                </span>
                <p className="text-base font-semibold leading-7">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PracticeSection({
  data,
  openConsultation,
}: {
  data: Record<string, any>;
  openConsultation: () => void;
}) {
  const practice = [
    {
      number: "01",
      tag: "משפחה",
      title: getValue(data, "practiceOneTitle"),
      text: getValue(data, "practiceOneText"),
      bullets: ["גירושין", "הסכמים", "משמורת"],
      note: "ליווי רגיש",
      tone: "from-white via-white to-[#f5efe5]",
    },
    {
      number: "02",
      tag: "מסחרי",
      title: getValue(data, "practiceTwoTitle"),
      text: getValue(data, "practiceTwoText"),
      bullets: ["חוזים", "שותפויות", "סיכונים"],
      note: "עסקים וחברות",
      tone: "from-white via-white to-[#eef2f7]",
    },
    {
      number: "03",
      tag: "נדל״ן",
      title: getValue(data, "practiceThreeTitle"),
      text: getValue(data, "practiceThreeText"),
      bullets: ["רכישה", "מקרקעין", "חוזים"],
      note: "בדיקה משפטית",
      tone: "from-white via-white to-[#f4efe8]",
    },
    {
      number: "04",
      tag: "ליטיגציה",
      title: getValue(data, "practiceFourTitle"),
      text: getValue(data, "practiceFourText"),
      bullets: ["ייצוג", "אסטרטגיה", "בתי משפט"],
      note: "ניהול תיק",
      tone: "from-white via-white to-[#eef0f3]",
    },
  ];

  return (
    <section className="relative overflow-hidden px-5 py-24 lg:px-8 lg:py-32">
      <div className="absolute left-[7%] top-20 h-56 w-56 rounded-full bg-[#b5894d]/20 blur-3xl" />
      <div className="absolute bottom-10 right-[10%] h-64 w-64 rounded-full bg-[#172433]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_340px]">
          <div className="max-w-3xl text-right">
            <p className="mb-4 inline-flex rounded-full border border-[#172433]/15 bg-white/70 px-4 py-2 text-sm font-semibold text-[#9b7a45] shadow-sm backdrop-blur-xl">
              {getValue(data, "practiceEyebrow")}
            </p>

            <h2 className="max-w-4xl text-4xl font-semibold leading-[1.06] tracking-[-0.055em] text-[#172433] md:text-6xl">
              {getValue(data, "practiceTitle")}
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5d6671]">
              תחומי התמחות שמוצגים בצורה סמכותית, נקייה ומובנת — בלי עומס משפטי מיותר.
            </p>
          </div>

          <div className="rounded-[34px] border border-[#172433]/10 bg-white/66 p-5 shadow-2xl shadow-[#172433]/8 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#9b7a45]">practice overview</span>
              <span className="rounded-full bg-[#172433] px-3 py-1 text-xs font-semibold text-[#f8efe0]">
                4 תחומים
              </span>
            </div>

            <div className="grid gap-3">
              {[
                ["דיסקרטיות", "יחס אישי ושמירה על פרטיות"],
                ["אסטרטגיה", "כיוון פעולה ברור לפני החלטה"],
                ["זמינות", "מענה ראשוני מהיר ומקצועי"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-[#f2eadb] px-4 py-3">
                  <div className="text-xs font-semibold text-[#6b7179]">{label}</div>
                  <div className="mt-1 text-lg font-semibold text-[#172433]">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {practice.map((item, index) => (
            <article
              key={item.title}
              className={cx(
                "group relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[38px] border border-[#172433]/10 bg-gradient-to-br p-7 shadow-2xl shadow-[#172433]/8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:shadow-[#172433]/14",
                item.tone,
                index === 1 || index === 2 ? "lg:translate-y-6" : "",
              )}
            >
              <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-[#b5894d]/0 blur-3xl transition duration-500 group-hover:bg-[#b5894d]/18" />
              <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-[#172433]/0 blur-3xl transition duration-500 group-hover:bg-[#172433]/12" />

              <div className="relative z-10">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <span className="rounded-full border border-[#172433]/10 bg-white/80 px-3 py-1 text-xs font-semibold text-[#65707a]">
                    {item.tag}
                  </span>

                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#172433] text-sm font-semibold text-[#f8efe0] shadow-lg shadow-[#172433]/20">
                    {item.number}
                  </div>
                </div>

                <h3 className="text-3xl font-semibold tracking-[-0.05em] text-[#172433]">
                  {item.title}
                </h3>

                <p className="mt-4 max-w-xl text-base leading-7 text-[#5d6671]">
                  {item.text}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {item.bullets.map((bullet) => (
                    <span
                      key={bullet}
                      className="rounded-full border border-[#172433]/10 bg-white/70 px-3 py-2 text-xs font-semibold text-[#43515d]"
                    >
                      {bullet}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-8 border-t border-[#172433]/10 pt-5">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#b5894d]">{item.note}</span>
                  <span className="text-[#6c737c]">בדיקת התאמה ראשונית</span>
                </div>

                <button
                  type="button"
                  onClick={openConsultation}
                  className="flex w-full items-center justify-between rounded-full border border-[#172433]/10 bg-white/75 px-5 py-4 text-sm font-semibold text-[#172433] shadow-sm transition duration-300 hover:bg-[#172433] hover:text-[#f8efe0]"
                >
                  <span>לקביעת ייעוץ</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#172433]/10 text-[#172433]">
                    ↗
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewSection({
  data,
  openConsultation,
}: {
  data: Record<string, any>;
  openConsultation: () => void;
}) {
  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[50px] border border-[#172433]/10 bg-[#172433] text-[#f8efe0] shadow-2xl shadow-[#172433]/22 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative p-8 lg:p-12">
          <div className="absolute left-8 top-8 h-32 w-32 rounded-full bg-[#b5894d]/20 blur-2xl" />

          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              {getValue(data, "reviewEyebrow")}
            </p>

            <h2 className="text-4xl font-semibold leading-[1.06] tracking-[-0.055em] md:text-6xl">
              {getValue(data, "reviewTitle")}
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#f8efe0]/75">
              {getValue(data, "reviewText")}
            </p>

            <button
              type="button"
              onClick={openConsultation}
              className="mt-8 rounded-full bg-[#f8efe0] px-7 py-4 text-sm font-semibold text-[#172433] transition duration-300 hover:-translate-y-0.5"
            >
              {getValue(data, "reviewButton")}
            </button>
          </div>
        </div>

        <form className="m-4 rounded-[42px] bg-[#f6efe3] p-5 text-[#172433] shadow-inner lg:m-6 lg:p-7">
          <div className="grid gap-4">
            <input className="rounded-2xl border border-[#172433]/10 bg-white px-5 py-4 text-right outline-none transition focus:border-[#b5894d]" placeholder="שם מלא" />
            <input className="rounded-2xl border border-[#172433]/10 bg-white px-5 py-4 text-right outline-none transition focus:border-[#b5894d]" placeholder="טלפון" />
            <select className="rounded-2xl border border-[#172433]/10 bg-white px-5 py-4 text-right outline-none transition focus:border-[#b5894d]">
              <option>סוג המקרה</option>
              <option>דיני משפחה</option>
              <option>משפט מסחרי</option>
              <option>נדל״ן ומקרקעין</option>
              <option>ליטיגציה</option>
            </select>
            <textarea className="min-h-36 rounded-2xl border border-[#172433]/10 bg-white px-5 py-4 text-right outline-none transition focus:border-[#b5894d]" placeholder="תיאור קצר של המקרה" />
            <button type="button" className="rounded-full bg-[#b5894d] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-[#b5894d]/20 transition hover:-translate-y-0.5">
              שליחת פרטים
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function ProcessSection({ data }: { data: Record<string, any> }) {
  const process = [
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="h-fit lg:sticky lg:top-28">
          <SectionTitle
            eyebrow={getValue(data, "processEyebrow")}
            title={getValue(data, "processTitle")}
            text="Sticky storytelling: הצד האסטרטגי נשאר, והשלבים עוברים לידו בצורה ברורה."
          />

          <div className="mt-8 rounded-[34px] border border-[#172433]/10 bg-[#172433] p-6 text-[#f8efe0] shadow-2xl shadow-[#172433]/16">
            <p className="text-sm opacity-70">Legal Strategy</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
              קודם מבינים. אחר כך מתכננים. ואז פועלים.
            </h3>

            <div className="mt-6 grid grid-cols-3 gap-2">
              {["01", "02", "03"].map((step) => (
                <div key={step} className="rounded-2xl bg-white/10 px-3 py-3 text-center text-sm font-semibold">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative space-y-5">
          <div className="absolute right-7 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-[#b5894d] via-[#d9c49a] to-transparent lg:block" />

          {process.map(([title, text], index) => (
            <div
              key={title}
              className="group relative rounded-[38px] border border-[#172433]/10 bg-white/65 p-8 shadow-2xl shadow-[#172433]/8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:bg-white/88"
            >
              <div className="absolute right-5 top-9 hidden h-5 w-5 rounded-full border-4 border-[#f6efe3] bg-[#172433] shadow-lg lg:block" />

              <div className="mb-7 text-7xl font-semibold tracking-[-0.08em] text-[#d8c297] transition duration-500 group-hover:text-[#b5894d]">
                0{index + 1}
              </div>

              <h3 className="text-3xl font-semibold tracking-[-0.05em] text-[#172433]">
                {title}
              </h3>

              <p className="mt-4 text-lg leading-8 text-[#5d6671]">{text}</p>

              <div className="mt-7 h-2 w-full overflow-hidden rounded-full bg-[#172433]/8">
                <div
                  className={cx(
                    "h-full rounded-full bg-[#b5894d] transition duration-700",
                    index === 0 && "w-[40%]",
                    index === 1 && "w-[70%]",
                    index === 2 && "w-full",
                  )}
                />
              </div>
            </div>
          ))}
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

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          center
          eyebrow={getValue(data, "lawyersEyebrow")}
          title={getValue(data, "lawyersTitle")}
          text="צוות שמוצג בצורה מכובדת, נקייה ומדויקת — בלי להעמיס על המשתמש."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {lawyers.map(([name, role, image], index) => (
            <article
              key={name}
              className={cx(
                "group overflow-hidden rounded-[38px] border border-white/80 bg-white/62 p-3 shadow-2xl shadow-[#172433]/8 transition duration-500 hover:-translate-y-3",
                index === 1 ? "lg:translate-y-8" : "",
              )}
            >
              <div className="relative overflow-hidden rounded-[30px]">
                <img
                  src={image}
                  alt=""
                  className="h-[430px] w-full rounded-[30px] object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101821]/65 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 rounded-3xl border border-white/15 bg-[#172433]/75 p-5 text-[#f8efe0] backdrop-blur-md">
                  <h3 className="text-2xl font-semibold tracking-[-0.05em]">{name}</h3>
                  <p className="mt-1 text-sm text-[#f8efe0]/70">{role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CasesSection({ data }: { data: Record<string, any> }) {
  const cases = [
    [getValue(data, "caseOneTitle"), getValue(data, "caseOneText"), "01"],
    [getValue(data, "caseTwoTitle"), getValue(data, "caseTwoText"), "02"],
    [getValue(data, "caseThreeTitle"), getValue(data, "caseThreeText"), "03"],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          center
          eyebrow={getValue(data, "casesEyebrow")}
          title={getValue(data, "casesTitle")}
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {cases.map(([title, text, num]) => (
            <article
              key={title}
              className="group rounded-[38px] border border-[#172433]/10 bg-white/66 p-7 shadow-2xl shadow-[#172433]/8 backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:bg-white/90"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="text-6xl font-semibold tracking-[-0.08em] text-[#d8c297]">
                  {num}
                </span>
                <span className="rounded-full bg-[#172433] px-3 py-1 text-xs font-semibold text-[#f8efe0]">
                  Case
                </span>
              </div>

              <h3 className="text-3xl font-semibold tracking-[-0.05em] text-[#172433]">
                {title}
              </h3>
              <p className="mt-4 leading-7 text-[#5d6671]">{text}</p>

              <div className="mt-8 h-1.5 w-full rounded-full bg-[#172433]/10">
                <div className="h-full w-[72%] rounded-full bg-[#b5894d] transition duration-700 group-hover:w-full" />
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
    [getValue(data, "testimonialOneText"), getValue(data, "testimonialOneName")],
    [getValue(data, "testimonialTwoText"), getValue(data, "testimonialTwoName")],
    [getValue(data, "testimonialThreeText"), getValue(data, "testimonialThreeName")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl rounded-[50px] bg-[#172433] p-6 text-[#f8efe0] shadow-2xl shadow-[#172433]/20 lg:p-12">
        <SectionTitle
          center
          light
          eyebrow={getValue(data, "testimonialsEyebrow")}
          title={getValue(data, "testimonialsTitle")}
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map(([text, name]) => (
            <article
              key={name}
              className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-500 hover:-translate-y-2 hover:bg-white/10"
            >
              <div className="mb-6 text-4xl text-[#b5894d]">״</div>
              <p className="leading-8 text-[#f8efe0]/78">{text}</p>
              <div className="mt-8 border-t border-white/10 pt-5 text-sm font-semibold">
                {name}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection({ data }: { data: Record<string, any> }) {
  const posts = [
    [getValue(data, "postOneTitle"), getValue(data, "postOneText")],
    [getValue(data, "postTwoTitle"), getValue(data, "postTwoText")],
    [getValue(data, "postThreeTitle"), getValue(data, "postThreeText")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          center
          eyebrow={getValue(data, "blogEyebrow")}
          title={getValue(data, "blogTitle")}
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {posts.map(([title, text], index) => (
            <article
              key={title}
              className="group rounded-[38px] border border-[#172433]/10 bg-white/66 p-7 shadow-2xl shadow-[#172433]/8 backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:bg-white/90"
            >
              <div className="mb-7 flex items-center justify-between">
                <p className="text-sm font-semibold text-[#b5894d]">
                  מאמר 0{index + 1}
                </p>
                <span className="rounded-full border border-[#172433]/10 bg-white/55 px-3 py-1 text-xs font-semibold text-[#65707a]">
                  Legal Guide
                </span>
              </div>

              <h3 className="text-2xl font-semibold leading-tight tracking-[-0.05em] text-[#172433]">
                {title}
              </h3>

              <p className="mt-4 leading-7 text-[#5d6671]">{text}</p>

              <button
                type="button"
                className="mt-8 rounded-full border border-[#172433]/15 px-5 py-3 text-sm font-semibold text-[#172433] transition duration-300 hover:bg-white"
              >
                לקריאה
              </button>
            </article>
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
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionTitle
          eyebrow={getValue(data, "faqEyebrow")}
          title={getValue(data, "faqTitle")}
        />

        <div className="space-y-4">
          {faqs.map(([question, answer], index) => {
            const isOpen = open === index;

            return (
              <div
                key={question}
                className="overflow-hidden rounded-[32px] border border-[#172433]/10 bg-white/66 shadow-xl shadow-[#172433]/6 backdrop-blur-xl transition duration-300 hover:bg-white/88"
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
    ["טלפון", getValue(data, "phone")],
    ["אימייל", getValue(data, "email")],
    ["מיקום", getValue(data, "address")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[50px] border border-[#172433]/10 bg-[#172433] text-[#f8efe0] shadow-2xl shadow-[#172433]/20 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative p-8 lg:p-12">
          <div className="absolute left-8 top-8 h-32 w-32 rounded-full bg-[#b5894d]/20 blur-2xl" />
          <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-white/8 blur-3xl" />

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

        <form className="m-4 rounded-[42px] bg-[#f6efe3] p-5 text-[#172433] shadow-inner lg:m-6 lg:p-7">
          <div className="grid gap-4">
            <input className="rounded-2xl border border-[#172433]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b5894d]" placeholder="שם מלא" />
            <input className="rounded-2xl border border-[#172433]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b5894d]" placeholder="טלפון" />
            <input className="rounded-2xl border border-[#172433]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b5894d]" placeholder="אימייל" />
            <textarea className="min-h-36 rounded-2xl border border-[#172433]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b5894d]" placeholder="מה תרצו לשאול?" />

            <button type="button" className="rounded-full bg-[#b5894d] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-[#b5894d]/20 transition duration-300 hover:-translate-y-0.5">
              {getValue(data, "contactButton")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function CtaFooter({
  data,
  goTo,
  openConsultation,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openConsultation: () => void;
}) {
  return (
    <footer className="px-5 pb-10 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[50px] border border-[#172433]/10 bg-white/58 p-8 shadow-2xl shadow-[#172433]/10 backdrop-blur-xl lg:p-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-[#172433]/10 bg-white/70 px-4 py-2 text-sm font-semibold text-[#9b7a45]">
              Justora Experience
            </p>

            <h2 className="max-w-4xl text-4xl font-semibold leading-[1.06] tracking-[-0.055em] text-[#172433] md:text-6xl">
              {getValue(data, "ctaTitle")}
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5d6671]">
              {getValue(data, "ctaText")}
            </p>
          </div>

          <div className="rounded-[38px] border border-[#172433]/10 bg-[#172433] p-6 text-[#f8efe0] shadow-xl shadow-[#172433]/15">
            <div className="text-sm opacity-70">Ready for consultation?</div>
            <div className="mt-3 text-2xl font-semibold tracking-[-0.05em]">
              אתר משפטי שמייצר אמון ופניות איכותיות.
            </div>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={openConsultation}
                className="rounded-full bg-[#f8efe0] px-8 py-4 text-base font-semibold text-[#172433] transition duration-300 hover:-translate-y-0.5"
              >
                {getValue(data, "ctaButton")}
              </button>

              <button
                type="button"
                onClick={() => goTo("practice")}
                className="rounded-full border border-white/15 px-8 py-4 text-base font-semibold text-[#f8efe0] transition duration-300 hover:bg-white/10"
              >
                לראות תחומי התמחות
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#172433]/10 pt-8 text-sm text-[#68717c] md:flex-row">
        <p>© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
        <p>תבנית Justora · Bizuply Studio</p>
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
      <TrustStrip goTo={goTo} />
      <AboutSection data={data} />
      <PracticeSection data={data} openConsultation={openConsultation} />
      <ReviewSection data={data} openConsultation={openConsultation} />
      <ProcessSection data={data} />
      <LawyersSection data={data} />
      <CasesSection data={data} />
      <TestimonialsSection data={data} />
      <BlogSection data={data} />
      <FaqSection data={data} />
      <ContactSection data={data} openConsultation={openConsultation} />
      <CtaFooter data={data} goTo={goTo} openConsultation={openConsultation} />
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
        <AboutSection data={data} />
        <ProcessSection data={data} />
      </>
    ),
    practice: (
      <>
        <PracticeSection data={data} openConsultation={openConsultation} />
        <ReviewSection data={data} openConsultation={openConsultation} />
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
      <section className="relative isolate overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
        <div className="absolute left-[10%] top-10 -z-10 h-56 w-56 rounded-full bg-[#b5894d]/20 blur-3xl" />
        <div className="absolute right-[12%] bottom-10 -z-10 h-56 w-56 rounded-full bg-[#172433]/10 blur-3xl" />

        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-[#172433]/15 bg-white/65 px-4 py-2 text-sm font-semibold text-[#9b7a45] shadow-sm backdrop-blur-xl">
            {getValue(data, "brandName")}
          </p>

          <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.07em] text-[#172433] md:text-7xl">
            {getPageTitle(data, type)}
          </h1>
        </div>
      </section>

      {pageMap[type] ?? null}

      <CtaFooter data={data} goTo={goTo} openConsultation={openConsultation} />
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
      className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_12%_8%,rgba(181,137,77,0.22),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(23,36,51,0.12),transparent_28%),radial-gradient(circle_at_82%_78%,rgba(181,137,77,0.16),transparent_24%),linear-gradient(180deg,#f6efe3_0%,#f2eadb_48%,#eef1f3_100%)] font-sans text-[#172433]"
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