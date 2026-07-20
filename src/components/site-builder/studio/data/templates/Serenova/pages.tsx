import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { serenovaDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const serenovaPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "pricing", label: "מחירון", slug: "/pricing" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "blog", label: "מאמרים", slug: "/blog" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const serenovaAllowedPages = serenovaPages.map((page) => page.id);

type SerenovaPagesProps = {
  initialPage?: string;
  initialPageId?: string;
  page?: string;
  pageId?: string;
  activePageId?: string;
  currentPageId?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (serenovaDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getPageTitle(data: Record<string, any>, type: string) {
  if (type === "about") return getValue(data, "navAbout");
  if (type === "services") return getValue(data, "navServices");
  if (type === "pricing") return getValue(data, "navPricing");
  if (type === "gallery") return getValue(data, "navGallery");
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
    <div className={cx("mx-auto max-w-3xl", center ? "text-center" : "text-right")}>
      <p
        className={cx(
          "mb-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-xl",
          light
            ? "border border-white/15 bg-white/10 text-[#fbf6ec]/85"
            : "border border-[#244236]/15 bg-white/65 text-[#5b725f]",
        )}
      >
        {eyebrow}
      </p>

      <h2
        className={cx(
          "text-4xl font-semibold leading-[1.04] tracking-[-0.055em] md:text-6xl",
          light ? "text-[#fbf6ec]" : "text-[#20342a]",
        )}
      >
        {title}
      </h2>

      {text ? (
        <p
          className={cx(
            "mt-5 text-lg leading-8",
            light ? "text-[#fbf6ec]/72" : "text-[#5d6c61]",
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
  openBooking,
}: {
  data: Record<string, any>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  openBooking: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = [
    ["home", getValue(data, "navHome")],
    ["about", getValue(data, "navAbout")],
    ["services", getValue(data, "navServices")],
    ["pricing", getValue(data, "navPricing")],
    ["gallery", getValue(data, "navGallery")],
    ["blog", getValue(data, "navBlog")],
    ["contact", getValue(data, "navContact")],
  ];

  function handleNavigate(id: string) {
    setCurrentPage(id);
    setMobileOpen(false);
  }

  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b border-[#244236]/10 bg-[#f7efe3]/82 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate("home")}
          className="group flex items-center gap-3 text-right"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#244236] text-lg font-semibold text-[#fbf6ec] shadow-lg shadow-[#244236]/20 transition duration-300 group-hover:scale-105">
            {getValue(data, "logoText")}
          </span>

          <span className="text-xl font-semibold tracking-[-0.04em] text-[#20342a]">
            {getValue(data, "brandName")}
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-[#244236]/10 bg-white/50 p-1 shadow-sm backdrop-blur-xl lg:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => handleNavigate(id)}
              className={cx(
                "rounded-full px-4 py-2 text-sm font-semibold transition duration-300",
                currentPage === id
                  ? "bg-[#244236] text-[#fbf6ec] shadow-md"
                  : "text-[#405349] hover:bg-white hover:text-[#20342a]",
              )}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openBooking}
            className="hidden rounded-full bg-[#b99067] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#b99067]/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:inline-flex"
          >
            {getValue(data, "heroPrimaryButton")}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#244236]/10 bg-white/60 text-[#244236] shadow-sm backdrop-blur lg:hidden"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#244236]/10 bg-[#f7efe3]/95 px-5 pb-5 backdrop-blur-2xl lg:hidden">
          <div className="grid gap-2 rounded-[28px] border border-[#244236]/10 bg-white/55 p-2 shadow-xl shadow-[#244236]/8">
            {nav.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                className={cx(
                  "rounded-2xl px-4 py-3 text-right text-sm font-semibold transition",
                  currentPage === id
                    ? "bg-[#244236] text-[#fbf6ec]"
                    : "text-[#405349] hover:bg-white",
                )}
              >
                {label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openBooking();
              }}
              className="rounded-2xl bg-[#b99067] px-4 py-3 text-sm font-semibold text-white"
            >
              {getValue(data, "heroPrimaryButton")}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function BookingModal({
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
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#17251e]/55 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[38px] border border-white/20 bg-[#f7efe3] shadow-2xl shadow-black/30">
        <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-[#b8cfae]/40 blur-3xl" />
        <div className="absolute bottom-8 right-10 h-52 w-52 rounded-full bg-[#d7bf97]/45 blur-3xl" />

        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/70 text-xl font-semibold text-[#244236] shadow-sm transition hover:scale-105"
        >
          ×
        </button>

        <div className="relative z-10 grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[#244236] p-8 text-[#fbf6ec] lg:p-10">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              קביעת שיחת היכרות
            </p>

            <h3 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.055em] md:text-5xl">
              חוויה רגועה שמובילה לפנייה בלי לחץ.
            </h3>

            <p className="mt-5 text-base leading-7 text-[#fbf6ec]/75">
              מודאל CTA ממוקד שמאפשר להשאיר פרטים בלי לחפש את הטופס בהמשך העמוד.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                "שיחה ראשונית קצרה",
                "אפשרות לפגישה אונליין",
                "התאמה אישית לפי סוג השירות",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold backdrop-blur"
                >
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          <form className="p-6 lg:p-10">
            <div className="grid gap-4">
              <input
                className="rounded-2xl border border-[#244236]/10 bg-white/80 px-5 py-4 text-right outline-none transition focus:border-[#b99067]"
                placeholder="שם מלא"
              />
              <input
                className="rounded-2xl border border-[#244236]/10 bg-white/80 px-5 py-4 text-right outline-none transition focus:border-[#b99067]"
                placeholder="טלפון"
              />
              <input
                className="rounded-2xl border border-[#244236]/10 bg-white/80 px-5 py-4 text-right outline-none transition focus:border-[#b99067]"
                placeholder="אימייל"
              />
              <select className="rounded-2xl border border-[#244236]/10 bg-white/80 px-5 py-4 text-right outline-none transition focus:border-[#b99067]">
                <option>מה מעניין אותך?</option>
                <option>טיפול אישי</option>
                <option>ייעוץ רגשי</option>
                <option>ליווי זוגי</option>
                <option>סדנה / הרצאה</option>
              </select>
              <textarea
                className="min-h-28 rounded-2xl border border-[#244236]/10 bg-white/80 px-5 py-4 text-right outline-none transition focus:border-[#b99067]"
                placeholder="כמה מילים על הצורך"
              />

              <button
                type="button"
                className="rounded-full bg-[#b99067] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-[#b99067]/20 transition hover:-translate-y-0.5"
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
  openBooking,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openBooking: () => void;
}) {
  const chips = ["Therapy", "Wellness", "Online", "Private Clinic"];
  const stats = [
    [getValue(data, "heroStatOne"), getValue(data, "heroStatOneLabel")],
    [getValue(data, "heroStatTwo"), getValue(data, "heroStatTwoLabel")],
    [getValue(data, "heroStatThree"), getValue(data, "heroStatThreeLabel")],
  ];

  return (
    <section className="relative isolate overflow-hidden px-5 pb-24 pt-14 lg:px-8 lg:pb-36 lg:pt-20">
      <div className="absolute left-[5%] top-20 -z-10 h-72 w-72 rounded-full bg-[#b8cfae]/40 blur-3xl" />
      <div className="absolute right-[8%] top-[42%] -z-10 h-80 w-80 rounded-full bg-[#d7bf97]/35 blur-3xl" />
      <div className="absolute left-1/2 top-24 -z-10 h-64 w-64 rounded-full bg-white/70 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-[#244236]/15 bg-white/65 px-4 py-2 text-sm font-semibold text-[#5b725f] shadow-sm backdrop-blur-xl">
            {getValue(data, "heroEyebrow")}
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.075em] text-[#20342a] md:text-7xl lg:text-8xl">
            {getValue(data, "heroTitle")}
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5d6c61] md:text-xl">
            {getValue(data, "heroSubtitle")}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#244236]/10 bg-white/60 px-4 py-2 text-sm font-semibold text-[#405349] shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openBooking}
              className="rounded-full bg-[#244236] px-7 py-4 text-base font-semibold text-[#fbf6ec] shadow-2xl shadow-[#244236]/15 transition duration-300 hover:-translate-y-0.5"
            >
              {getValue(data, "heroPrimaryButton")}
            </button>

            <button
              type="button"
              onClick={() => goTo("services")}
              className="rounded-full border border-[#244236]/15 bg-white/60 px-7 py-4 text-base font-semibold text-[#244236] shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              {getValue(data, "heroSecondaryButton")}
            </button>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {stats.map(([num, label]) => (
              <div
                key={label}
                className="group rounded-3xl border border-[#244236]/10 bg-white/62 p-4 text-center shadow-2xl shadow-[#244236]/8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:bg-white/85"
              >
                <div className="text-2xl font-semibold tracking-[-0.04em] text-[#20342a]">
                  {num}
                </div>
                <div className="mt-1 text-xs font-semibold text-[#69766c]">
                  {label}
                </div>
                <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[#b8cfae] transition duration-500 group-hover:w-16 group-hover:bg-[#b99067]" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[650px]">
          <div className="absolute right-0 top-0 z-10 h-[610px] w-[82%] rotate-[-2deg] rounded-[48px] bg-[#244236]/10" />

          <div className="group absolute right-2 top-4 z-20 w-[82%] overflow-hidden rounded-[48px] border border-white/80 bg-white/45 p-3 shadow-2xl shadow-[#244236]/16 backdrop-blur-xl transition duration-700 hover:rotate-0 lg:rotate-[1.5deg]">
            <img
              src={getValue(data, "heroImage")}
              alt=""
              className="h-[600px] w-full rounded-[40px] object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-3 rounded-[40px] bg-gradient-to-t from-[#17251e]/42 via-transparent to-transparent" />
          </div>

          <div className="group absolute left-0 top-20 z-30 w-[43%] overflow-hidden rounded-[36px] border border-white/80 bg-white/75 p-3 shadow-2xl shadow-[#244236]/16 backdrop-blur-xl transition duration-700 hover:-translate-y-3">
            <img
              src={getValue(data, "aboutImage")}
              alt=""
              className="h-[250px] w-full rounded-[28px] object-cover transition duration-700 group-hover:scale-105"
            />
          </div>

          <div className="absolute bottom-10 right-8 z-40 max-w-[280px] rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-2xl shadow-[#244236]/16 backdrop-blur-xl transition duration-500 hover:-translate-y-2">
            <p className="text-sm font-semibold text-[#20342a]">
              {getValue(data, "heroCardTitle")}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#66736a]">
              {getValue(data, "heroCardText")}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {["01", "02", "03"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-[#f2eadc] px-3 py-2 text-center text-xs font-semibold text-[#244236]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-32 left-[16%] z-40 grid h-28 w-28 place-items-center rounded-full bg-[#244236] text-center text-[#fbf6ec] shadow-2xl shadow-[#244236]/25 transition duration-500 hover:scale-105">
            <div>
              <div className="text-xs opacity-70">Soft UX</div>
              <div className="text-2xl font-semibold tracking-[-0.06em]">Flow</div>
            </div>
          </div>

          <div className="absolute left-[30%] top-3 z-40 rounded-full border border-[#244236]/10 bg-white/70 px-4 py-2 text-sm font-semibold text-[#405349] shadow-xl shadow-[#244236]/10 backdrop-blur-xl">
            חוויה רגועה
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceStrip({
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  const items = [
    ["01", "היכרות", "מורידים חשש ומסבירים איך זה עובד."],
    ["02", "התאמה", "עוזרים לבחור שירות או מסלול מתאים."],
    ["03", "פנייה", "CTA ברור שמוביל להשארת פרטים."],
  ];

  return (
    <section className="px-5 pb-10 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[42px] border border-[#244236]/10 bg-[#244236] p-4 text-[#fbf6ec] shadow-2xl shadow-[#244236]/18">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
          {items.map(([num, title, text]) => (
            <div
              key={num}
              className="group rounded-[30px] border border-white/10 bg-white/5 p-5 transition duration-500 hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-3xl font-semibold tracking-[-0.07em] text-[#d7bf97]">
                  {num}
                </span>
                <span className="h-2 w-2 rounded-full bg-[#b8cfae] transition duration-500 group-hover:scale-[2]" />
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.04em]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#fbf6ec]/70">{text}</p>
            </div>
          ))}

          <button
            type="button"
            onClick={() => goTo("contact")}
            className="rounded-[30px] bg-[#fbf6ec] px-7 py-5 text-sm font-semibold text-[#244236] transition duration-300 hover:-translate-y-1 lg:min-w-[170px]"
          >
            להתחיל תהליך
          </button>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ data }: { data: Record<string, any> }) {
  const bullets = [
    "מבנה שמוביל את הלקוח בלי עומס",
    "תחושה רגועה אבל עדיין פרימיום",
    "שכבות תמונה שיוצרות עומק",
    "כרטיסים חיים עם Hover עדין",
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative">
          <div className="absolute -right-6 -top-6 h-full w-full rounded-[46px] border border-[#244236]/10" />

          <div className="group relative overflow-hidden rounded-[46px] border border-white/80 bg-white/45 p-3 shadow-2xl shadow-[#244236]/10 backdrop-blur-xl">
            <img
              src={getValue(data, "aboutImage")}
              alt=""
              className="h-[560px] w-full rounded-[38px] object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-3 rounded-[38px] bg-gradient-to-t from-[#244236]/25 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-8 right-6 max-w-[275px] rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-2xl shadow-[#244236]/15 backdrop-blur-xl">
            <div className="text-4xl font-semibold tracking-[-0.07em] text-[#20342a]">01</div>
            <p className="mt-2 text-sm leading-6 text-[#5f6c62]">
              היררכיה נקייה: קודם אמון, אחר כך שירותים, ואז פנייה ברורה.
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
                  "group rounded-[30px] border border-[#244236]/10 bg-white/62 p-5 text-[#405349] shadow-2xl shadow-[#244236]/8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:bg-white/85",
                  index === 1 || index === 2 ? "md:translate-y-6" : "",
                )}
              >
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-[#b8cfae]/45 text-[#244236] transition duration-500 group-hover:bg-[#244236] group-hover:text-[#fbf6ec]">
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

function ServicesSection({
  data,
  openBooking,
}: {
  data: Record<string, any>;
  openBooking: () => void;
}) {
  const services = [
    {
      number: "01",
      tag: "טיפול אישי",
      title: getValue(data, "serviceOneTitle"),
      text: getValue(data, "serviceOneText"),
      bullets: ["פגישות 1:1", "מרחב בטוח", "ליווי מותאם"],
      note: "אונליין / פרונטלי",
      tone: "from-white via-white to-[#eef4ee] border-[#244236]/10",
    },
    {
      number: "02",
      tag: "זוגיות",
      title: getValue(data, "serviceTwoTitle"),
      text: getValue(data, "serviceTwoText"),
      bullets: ["שיפור תקשורת", "הקשבה", "כלים מעשיים"],
      note: "תהליך משותף",
      tone: "from-white via-white to-[#f5eee5] border-[#244236]/10",
    },
    {
      number: "03",
      tag: "ייעוץ",
      title: getValue(data, "serviceThreeTitle"),
      text: getValue(data, "serviceThreeText"),
      bullets: ["מיקוד רגשי", "הפחתת עומס", "בהירות"],
      note: "מותאם לצורך",
      tone: "from-white via-white to-[#eef2f8] border-[#244236]/10",
    },
    {
      number: "04",
      tag: "סדנאות",
      title: getValue(data, "serviceFourTitle"),
      text: getValue(data, "serviceFourText"),
      bullets: ["לקבוצות", "ארגונים", "תוכן ברור"],
      note: "קבוצות / ארגונים",
      tone: "from-white via-white to-[#f4efe8] border-[#244236]/10",
    },
  ];

  return (
    <section className="relative overflow-hidden px-5 py-24 lg:px-8 lg:py-32">
      <div className="absolute left-[7%] top-20 h-56 w-56 rounded-full bg-[#b8cfae]/25 blur-3xl" />
      <div className="absolute bottom-10 right-[10%] h-64 w-64 rounded-full bg-[#d7bf97]/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_340px]">
          <div className="max-w-3xl text-right">
            <p className="mb-4 inline-flex rounded-full border border-[#244236]/15 bg-white/65 px-4 py-2 text-sm font-semibold text-[#5b725f] shadow-sm backdrop-blur-xl">
              {getValue(data, "servicesEyebrow")}
            </p>

            <h2 className="max-w-4xl text-4xl font-semibold leading-[1.06] tracking-[-0.055em] text-[#20342a] md:text-6xl">
              {getValue(data, "servicesTitle")}
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f6c62]">
              שירותים שמוצגים בצורה אלגנטית, ברורה ולא עמוסה — עם חלוקה נכונה,
              CTA עדין והיררכיה שמרגישה פרימיום.
            </p>
          </div>

          <div className="rounded-[34px] border border-[#244236]/10 bg-white/60 p-5 shadow-2xl shadow-[#244236]/8 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#5b725f]">overview</span>
              <span className="rounded-full bg-[#244236] px-3 py-1 text-xs font-semibold text-[#fbf6ec]">
                4 שירותים
              </span>
            </div>

            <div className="grid gap-3">
              {[
                ["התאמה אישית", "לכל לקוח יש מסלול נכון עבורו"],
                ["פורמט גמיש", "קליניקה פרטית / אונליין"],
                ["מענה", "ברור, אישי ומהיר"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-[#f3ecdf] px-4 py-3">
                  <div className="text-xs font-semibold text-[#6b756f]">{label}</div>
                  <div className="mt-1 text-lg font-semibold text-[#20342a]">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {services.map((service, index) => (
            <article
              key={service.title}
              className={cx(
                "group relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[38px] border bg-gradient-to-br p-7 shadow-2xl shadow-[#244236]/8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:shadow-[#244236]/14",
                service.tone,
                index === 1 || index === 2 ? "lg:translate-y-6" : "",
              )}
            >
              <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-[#b8cfae]/0 blur-3xl transition duration-500 group-hover:bg-[#b8cfae]/25" />
              <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-[#d7bf97]/0 blur-3xl transition duration-500 group-hover:bg-[#d7bf97]/25" />

              <div className="relative z-10">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <span className="rounded-full border border-[#244236]/10 bg-white/80 px-3 py-1 text-xs font-semibold text-[#6a756e]">
                    {service.tag}
                  </span>

                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#244236] text-sm font-semibold text-[#fbf6ec] shadow-lg shadow-[#244236]/20">
                    {service.number}
                  </div>
                </div>

                <h3 className="text-3xl font-semibold tracking-[-0.05em] text-[#20342a]">
                  {service.title}
                </h3>

                <p className="mt-4 max-w-xl text-base leading-7 text-[#5f6c62]">
                  {service.text}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {service.bullets.map((bullet) => (
                    <span
                      key={bullet}
                      className="rounded-full border border-[#244236]/10 bg-white/70 px-3 py-2 text-xs font-semibold text-[#4b5d53]"
                    >
                      {bullet}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-8 border-t border-[#244236]/10 pt-5">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#b99067]">{service.note}</span>
                  <span className="text-[#6c7871]">בדיקת התאמה ראשונית</span>
                </div>

                <button
                  type="button"
                  onClick={openBooking}
                  className="flex w-full items-center justify-between rounded-full border border-[#244236]/10 bg-white/75 px-5 py-4 text-sm font-semibold text-[#244236] shadow-sm transition duration-300 hover:bg-[#244236] hover:text-[#fbf6ec]"
                >
                  <span>לבדוק התאמה</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#244236]/10 text-[#244236]">
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
            text="Sticky storytelling: צד אחד נשאר, והשלבים עוברים לידו בצורה ברורה."
          />

          <div className="mt-8 rounded-[34px] border border-[#244236]/10 bg-[#244236] p-6 text-[#fbf6ec] shadow-2xl shadow-[#244236]/16">
            <p className="text-sm opacity-70">Client Journey</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
              מסע משתמש רגוע, אבל עם תחושת פרימיום אמיתית.
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
          <div className="absolute right-7 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-[#b8cfae] via-[#d7bf97] to-transparent lg:block" />

          {process.map(([title, text], index) => (
            <div
              key={title}
              className="group relative rounded-[38px] border border-[#244236]/10 bg-white/65 p-8 shadow-2xl shadow-[#244236]/8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:bg-white/88"
            >
              <div className="absolute right-5 top-9 hidden h-5 w-5 rounded-full border-4 border-[#f7efe3] bg-[#244236] shadow-lg lg:block" />

              <div className="mb-7 text-7xl font-semibold tracking-[-0.08em] text-[#b8cfae] transition duration-500 group-hover:text-[#b99067]">
                0{index + 1}
              </div>

              <h3 className="text-3xl font-semibold tracking-[-0.05em] text-[#20342a]">
                {title}
              </h3>

              <p className="mt-4 text-lg leading-8 text-[#5f6c62]">{text}</p>

              <div className="mt-7 h-2 w-full overflow-hidden rounded-full bg-[#244236]/8">
                <div
                  className={cx(
                    "h-full rounded-full bg-[#b8cfae] transition duration-700 group-hover:bg-[#b99067]",
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

function PricingSection({
  data,
  openBooking,
}: {
  data: Record<string, any>;
  openBooking: () => void;
}) {
  const plans = [
    [getValue(data, "priceOneName"), getValue(data, "priceOnePrice"), getValue(data, "priceOneText")],
    [getValue(data, "priceTwoName"), getValue(data, "priceTwoPrice"), getValue(data, "priceTwoText")],
    [getValue(data, "priceThreeName"), getValue(data, "priceThreePrice"), getValue(data, "priceThreeText")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          center
          eyebrow={getValue(data, "pricingEyebrow")}
          title={getValue(data, "pricingTitle")}
          text="מחירון ברור עם מסלול מומלץ, מיקרו־אינטראקציות וקריאה לפעולה."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map(([name, price, text], index) => (
            <article
              key={name}
              className={cx(
                "group rounded-[38px] border p-7 shadow-2xl transition duration-500 hover:-translate-y-3",
                index === 1
                  ? "scale-[1.02] border-[#244236] bg-[#244236] text-[#fbf6ec] shadow-[#244236]/25"
                  : "border-[#244236]/10 bg-white/62 text-[#20342a] shadow-[#244236]/8 backdrop-blur-xl hover:bg-white/88",
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-semibold tracking-[-0.04em]">{name}</h3>

                {index === 1 ? (
                  <span className="rounded-full bg-[#fbf6ec] px-3 py-1 text-xs font-semibold text-[#244236]">
                    מומלץ
                  </span>
                ) : (
                  <span className="rounded-full border border-[#244236]/10 px-3 py-1 text-xs font-semibold text-[#66736a]">
                    רגיל
                  </span>
                )}
              </div>

              <div className="mt-8 text-5xl font-semibold tracking-[-0.07em]">
                {price}
              </div>

              <p className={cx("mt-5 leading-7", index === 1 ? "text-[#fbf6ec]/75" : "text-[#5f6c62]")}>
                {text}
              </p>

              <ul className={cx("mt-7 space-y-3 text-sm", index === 1 ? "text-[#fbf6ec]/80" : "text-[#5f6c62]")}>
                <li>• התאמה מלאה למובייל</li>
                <li>• אזורי אמון ו־CTA</li>
                <li>• מבנה שמוביל לפנייה</li>
              </ul>

              <button
                type="button"
                onClick={openBooking}
                className={cx(
                  "mt-9 w-full rounded-full px-6 py-4 text-sm font-semibold transition duration-300",
                  index === 1
                    ? "bg-[#fbf6ec] text-[#244236] hover:-translate-y-0.5"
                    : "bg-[#244236] text-[#fbf6ec] hover:-translate-y-0.5",
                )}
              >
                בחירת מסלול
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ data }: { data: Record<string, any> }) {
  const items = [
    {
      src: getValue(data, "galleryImageOne"),
      title: "מרחב רגוע",
      text: "תמונה גדולה שמייצרת אווירה",
      cls: "lg:col-span-2 lg:row-span-2",
      h: "h-[420px] lg:h-full",
    },
    {
      src: getValue(data, "galleryImageTwo"),
      title: "פגישה אישית",
      text: "תחושה אנושית ומזמינה",
      cls: "",
      h: "h-[280px]",
    },
    {
      src: getValue(data, "galleryImageThree"),
      title: "שקט ובהירות",
      text: "קומפוזיציה נקייה",
      cls: "",
      h: "h-[280px]",
    },
    {
      src: getValue(data, "galleryImageFour"),
      title: "פרימיום רגוע",
      text: "אזור ויזואלי יותר מיוחד",
      cls: "lg:col-span-2",
      h: "h-[300px]",
    },
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          center
          eyebrow={getValue(data, "galleryEyebrow")}
          title={getValue(data, "galleryTitle")}
          text="גריד מגזיני כמו תבנית פרימיום, לא ארבע תמונות משעממות בשורה."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-4 lg:grid-rows-[280px_280px_300px]">
          {items.map((item) => (
            <div
              key={item.src}
              className={cx(
                "group overflow-hidden rounded-[38px] border border-white/80 bg-white/50 p-3 shadow-2xl shadow-[#244236]/10 transition duration-500 hover:-translate-y-2",
                item.cls,
              )}
            >
              <div className="relative h-full overflow-hidden rounded-[30px]">
                <img
                  src={item.src}
                  alt=""
                  className={cx(
                    "w-full rounded-[30px] object-cover transition duration-700 group-hover:scale-105",
                    item.h,
                  )}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#17251e]/58 via-transparent to-transparent opacity-80" />

                <div className="absolute inset-x-4 bottom-4 rounded-3xl border border-white/15 bg-[#244236]/72 px-4 py-4 text-[#fbf6ec] backdrop-blur-md transition duration-500 group-hover:translate-y-[-4px]">
                  <div className="text-sm opacity-70">{item.text}</div>
                  <div className="text-xl font-semibold tracking-[-0.04em]">{item.title}</div>
                </div>
              </div>
            </div>
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
          text="כרטיסי תוכן שנותנים אמון לפני שהלקוח משאיר פרטים."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {posts.map(([title, text], index) => (
            <article
              key={title}
              className="group rounded-[38px] border border-[#244236]/10 bg-white/62 p-7 shadow-2xl shadow-[#244236]/8 backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:bg-white/88"
            >
              <div className="mb-7 flex items-center justify-between">
                <p className="text-sm font-semibold text-[#b99067]">
                  מאמר 0{index + 1}
                </p>

                <span className="rounded-full border border-[#244236]/10 bg-white/55 px-3 py-1 text-xs font-semibold text-[#66736a]">
                  Guide
                </span>
              </div>

              <h3 className="text-2xl font-semibold leading-tight tracking-[-0.05em] text-[#20342a]">
                {title}
              </h3>

              <p className="mt-4 leading-7 text-[#5f6c62]">{text}</p>

              <div className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-[#244236]/10">
                <div
                  className={cx(
                    "h-full rounded-full bg-[#b8cfae] transition duration-700 group-hover:bg-[#b99067]",
                    index === 0 && "w-[58%]",
                    index === 1 && "w-[74%]",
                    index === 2 && "w-[88%]",
                  )}
                />
              </div>

              <button
                type="button"
                className="mt-8 rounded-full border border-[#244236]/15 px-5 py-3 text-sm font-semibold text-[#244236] transition duration-300 hover:bg-white"
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
          text="אקורדיון חלק ב־Tailwind בלבד, בלי CSS מותאם."
        />

        <div className="space-y-4">
          {faqs.map(([question, answer], index) => {
            const isOpen = open === index;

            return (
              <div
                key={question}
                className="overflow-hidden rounded-[32px] border border-[#244236]/10 bg-white/62 shadow-xl shadow-[#244236]/6 backdrop-blur-xl transition duration-300 hover:bg-white/82"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-6 p-6 text-right"
                >
                  <span className="text-xl font-semibold tracking-[-0.04em] text-[#20342a]">
                    {question}
                  </span>

                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#244236] text-lg text-[#fbf6ec]">
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
                    <p className="px-6 pb-6 text-base leading-7 text-[#5f6c62]">
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
  openBooking,
}: {
  data: Record<string, any>;
  openBooking: () => void;
}) {
  const infoCards = [
    ["טלפון", getValue(data, "phone")],
    ["אימייל", getValue(data, "email")],
    ["מיקום", getValue(data, "address")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[50px] border border-[#244236]/10 bg-[#244236] text-[#fbf6ec] shadow-2xl shadow-[#244236]/20 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative p-8 lg:p-12">
          <div className="absolute left-8 top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-[#b99067]/20 blur-3xl" />

          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              {getValue(data, "contactEyebrow")}
            </p>

            <h2 className="text-4xl font-semibold leading-[1.06] tracking-[-0.055em] md:text-6xl">
              {getValue(data, "contactTitle")}
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#fbf6ec]/75">
              {getValue(data, "contactText")}
            </p>

            <div className="mt-10 grid gap-3">
              {infoCards.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[26px] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm transition duration-300 hover:bg-white/10"
                >
                  <div className="text-xs font-semibold text-[#fbf6ec]/60">{label}</div>
                  <div className="mt-1 text-base font-semibold text-[#fbf6ec]">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={openBooking}
              className="mt-8 rounded-full bg-[#fbf6ec] px-7 py-4 text-sm font-semibold text-[#244236] transition duration-300 hover:-translate-y-0.5"
            >
              לפתיחת חלון פנייה מהירה
            </button>
          </div>
        </div>

        <form className="m-4 rounded-[42px] bg-[#f7efe3] p-5 text-[#20342a] shadow-inner lg:m-6 lg:p-7">
          <div className="grid gap-4">
            <input
              className="rounded-2xl border border-[#244236]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b99067]"
              placeholder="שם מלא"
            />
            <input
              className="rounded-2xl border border-[#244236]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b99067]"
              placeholder="טלפון"
            />
            <input
              className="rounded-2xl border border-[#244236]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b99067]"
              placeholder="אימייל"
            />
            <textarea
              className="min-h-36 rounded-2xl border border-[#244236]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b99067]"
              placeholder="מה תרצו לשאול?"
            />

            <button
              type="button"
              className="rounded-full bg-[#b99067] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-[#b99067]/20 transition duration-300 hover:-translate-y-0.5"
            >
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
  openBooking,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openBooking: () => void;
}) {
  return (
    <footer className="px-5 pb-10 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[50px] border border-[#244236]/10 bg-white/58 p-8 shadow-2xl shadow-[#244236]/10 backdrop-blur-xl lg:p-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-[#244236]/10 bg-white/70 px-4 py-2 text-sm font-semibold text-[#5b725f]">
              Serenova Experience
            </p>

            <h2 className="max-w-4xl text-4xl font-semibold leading-[1.06] tracking-[-0.055em] text-[#20342a] md:text-6xl">
              {getValue(data, "ctaTitle")}
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f6c62]">
              {getValue(data, "ctaText")}
            </p>
          </div>

          <div className="rounded-[38px] border border-[#244236]/10 bg-[#244236] p-6 text-[#fbf6ec] shadow-xl shadow-[#244236]/15">
            <div className="text-sm opacity-70">Ready to start?</div>
            <div className="mt-3 text-2xl font-semibold tracking-[-0.05em]">
              חוויה רגועה, נקייה ויותר פרימיום.
            </div>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={openBooking}
                className="rounded-full bg-[#fbf6ec] px-8 py-4 text-base font-semibold text-[#244236] transition duration-300 hover:-translate-y-0.5"
              >
                {getValue(data, "ctaButton")}
              </button>

              <button
                type="button"
                onClick={() => goTo("services")}
                className="rounded-full border border-white/15 px-8 py-4 text-base font-semibold text-[#fbf6ec] transition duration-300 hover:bg-white/10"
              >
                לראות שירותים
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#244236]/10 pt-8 text-sm text-[#68766b] md:flex-row">
        <p>
          © {new Date().getFullYear()} {getValue(data, "brandName")}
        </p>
        <p>תבנית Serenova · Bizuply Studio</p>
      </div>
    </footer>
  );
}

function HomePage({
  data,
  goTo,
  openBooking,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openBooking: () => void;
}) {
  return (
    <>
      <Hero data={data} goTo={goTo} openBooking={openBooking} />
      <ExperienceStrip data={data} goTo={goTo} />
      <AboutSection data={data} />
      <ServicesSection data={data} openBooking={openBooking} />
      <ProcessSection data={data} />
      <PricingSection data={data} openBooking={openBooking} />
      <GallerySection data={data} />
      <BlogSection data={data} />
      <FaqSection data={data} />
      <ContactSection data={data} openBooking={openBooking} />
      <CtaFooter data={data} goTo={goTo} openBooking={openBooking} />
    </>
  );
}

function SimplePage({
  data,
  type,
  goTo,
  openBooking,
}: {
  data: Record<string, any>;
  type: string;
  goTo: (page: string) => void;
  openBooking: () => void;
}) {
  const pageMap: Record<string, React.ReactNode> = {
    about: (
      <>
        <AboutSection data={data} />
        <ProcessSection data={data} />
      </>
    ),
    services: (
      <>
        <ServicesSection data={data} openBooking={openBooking} />
        <ProcessSection data={data} />
      </>
    ),
    pricing: <PricingSection data={data} openBooking={openBooking} />,
    gallery: <GallerySection data={data} />,
    blog: <BlogSection data={data} />,
    contact: <ContactSection data={data} openBooking={openBooking} />,
  };

  return (
    <>
      <section className="relative isolate overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
        <div className="absolute left-[10%] top-10 -z-10 h-56 w-56 rounded-full bg-[#b8cfae]/35 blur-3xl" />
        <div className="absolute right-[12%] bottom-10 -z-10 h-56 w-56 rounded-full bg-[#d7bf97]/35 blur-3xl" />

        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-[#244236]/15 bg-white/60 px-4 py-2 text-sm font-semibold text-[#5b725f] shadow-sm backdrop-blur-xl">
            {getValue(data, "brandName")}
          </p>

          <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.07em] text-[#20342a] md:text-7xl">
            {getPageTitle(data, type)}
          </h1>
        </div>
      </section>

      {pageMap[type] ?? null}

      <CtaFooter data={data} goTo={goTo} openBooking={openBooking} />
    </>
  );
}

export default function SerenovaPages({
  initialPage = "home",
  initialPageId,
  page,
  pageId,
  activePageId,
  currentPageId,
  mode = "preview",
  data,
  onPageChange,
  isPublic,
  viewMode,
  runtimeMode,
}: SerenovaPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...serenovaDefaultData,
      ...(data ?? {}),
    }),
    [data],
  );

  const { currentPage, goTo } = useTemplatePageNavigation(
    {
      page,
      pageId,
      initialPage,
      initialPageId,
      activePageId,
      currentPageId,
      onPageChange,
      isPublic,
      viewMode,
      runtimeMode,
    },
    { allowedPages: serenovaAllowedPages, fallbackPage: "home" },
  );
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "serenova-preview" : "serenova"}
      className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_12%_8%,rgba(184,207,174,0.38),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(215,191,151,0.32),transparent_28%),radial-gradient(circle_at_82%_78%,rgba(184,207,174,0.20),transparent_24%),linear-gradient(180deg,#f7efe3_0%,#f2eadc_48%,#edf2ea_100%)] font-sans text-[#20342a]"
    >
      <Header
        data={mergedData}
        currentPage={currentPage}
        setCurrentPage={goTo}
        openBooking={() => setBookingOpen(true)}
      />

      <VisualPageStack
        activePageId={currentPage}
        pages={[
          {
            id: "home",
            content: (
              <HomePage
                data={mergedData}
                goTo={goTo}
                openBooking={() => setBookingOpen(true)}
              />
            ),
          },
          ...serenovaPages
            .filter((item) => item.id !== "home")
            .map((item) => ({
              id: item.id,
              content: (
                <SimplePage
                  data={mergedData}
                  type={item.id}
                  goTo={goTo}
                  openBooking={() => setBookingOpen(true)}
                />
              ),
            })),
        ]}
      />

      <BookingModal
        data={mergedData}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}