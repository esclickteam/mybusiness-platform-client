import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { fluxoraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const fluxoraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "feed", label: "הפיד", slug: "/feed" },
  { id: "community", label: "קהילה", slug: "/community" },
  { id: "pricing", label: "תמחור", slug: "/pricing" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const fluxoraAllowedPages = fluxoraPages.map((page) => page.id);

type FluxoraPagesProps = {
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
  return data?.[key] ?? (fluxoraDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getPageTitle(data: Record<string, any>, type: string) {
  if (type === "feed") return getValue(data, "navFeed");
  if (type === "community") return getValue(data, "navCommunity");
  if (type === "pricing") return getValue(data, "navPricing");
  if (type === "about") return getValue(data, "navAbout");
  if (type === "contact") return getValue(data, "navContact");
  return getValue(data, "brandName");
}

function SectionTitle({
  eyebrow,
  title,
  text,
  center = true,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={cx("mx-auto max-w-3xl", center ? "text-center" : "text-right")}>
      <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3dffa8]/25 bg-[#3dffa8]/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#9dffc9]">
        {eyebrow}
      </p>
      <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#f4f8fc] md:text-5xl">
        {title}
      </h2>
      {text ? <p className="mt-5 text-lg leading-8 text-slate-400">{text}</p> : null}
    </div>
  );
}

function AccentButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-[#3dffa8] px-7 py-3.5 text-sm font-bold text-[#07110c] shadow-[0_16px_40px_rgba(61,255,168,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#6dffbd]"
    >
      {children}
    </button>
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
    ["feed", getValue(data, "navFeed")],
    ["community", getValue(data, "navCommunity")],
    ["pricing", getValue(data, "navPricing")],
    ["about", getValue(data, "navAbout")],
    ["contact", getValue(data, "navContact")],
  ];

  function handleNavigate(id: string) {
    setCurrentPage(id);
    setMobileOpen(false);
  }

  return (
    <header
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b border-white/5 bg-[#070b10]/88 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate("home")}
          className="group flex items-center gap-3 text-right"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#3dffa8] text-sm font-black text-[#07110c] shadow-[0_10px_30px_rgba(61,255,168,0.28)] transition duration-300 group-hover:scale-105">
            {getValue(data, "logoText")}
          </span>
          <span className="text-xl font-bold tracking-tight text-[#f4f8fc]">
            {getValue(data, "brandName")}
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/[0.03] p-1 lg:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => handleNavigate(id)}
              className={cx(
                "rounded-full px-4 py-2 text-sm font-semibold transition duration-300",
                currentPage === id
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white",
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
            className="hidden rounded-full bg-[#3dffa8] px-5 py-2.5 text-sm font-bold text-[#07110c] shadow-[0_12px_30px_rgba(61,255,168,0.25)] transition duration-300 hover:-translate-y-0.5 sm:inline-flex"
          >
            {getValue(data, "heroPrimaryButton")}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/5 bg-[#070b10]/97 px-5 pb-5 lg:hidden">
          <div className="grid gap-2 rounded-[28px] border border-white/8 bg-white/[0.03] p-2">
            {nav.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                className={cx(
                  "rounded-2xl px-4 py-3 text-right text-sm font-semibold transition",
                  currentPage === id ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5",
                )}
              >
                {label}
              </button>
            ))}
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
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#04070b]/80 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-[#0d131b] p-8 shadow-2xl">
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#3dffa8]/15 blur-3xl" />
        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/5 text-xl font-semibold text-white"
        >
          ×
        </button>
        <div className="relative z-10">
          <p className="inline-flex rounded-full bg-[#3dffa8]/12 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#9dffc9]">
            הצטרפות
          </p>
          <h3 className="mt-5 text-3xl font-bold text-white">בואו נפתח לכם את Fluxora.</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">{getValue(data, "contactText")}</p>
          <form className="mt-7 grid gap-4">
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none placeholder:text-slate-500 focus:border-[#3dffa8]/50"
              placeholder="שם מלא"
            />
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none placeholder:text-slate-500 focus:border-[#3dffa8]/50"
              placeholder="אימייל עבודה"
            />
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none placeholder:text-slate-500 focus:border-[#3dffa8]/50"
              placeholder="שם החברה / הצוות"
            />
            <button
              type="button"
              className="rounded-full bg-[#3dffa8] px-7 py-4 text-base font-bold text-[#07110c]"
            >
              {getValue(data, "contactButton")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function FeedPreviewCards({ data }: { data: Record<string, any> }) {
  const cards = [
    [getValue(data, "feedCardOneTag"), getValue(data, "feedCardOneTitle"), getValue(data, "feedCardOneMeta")],
    [getValue(data, "feedCardTwoTag"), getValue(data, "feedCardTwoTitle"), getValue(data, "feedCardTwoMeta")],
    [getValue(data, "feedCardThreeTag"), getValue(data, "feedCardThreeTitle"), getValue(data, "feedCardThreeMeta")],
    [getValue(data, "feedCardFourTag"), getValue(data, "feedCardFourTitle"), getValue(data, "feedCardFourMeta")],
  ];

  return (
    <div className="grid gap-3">
      {cards.map(([tag, title, meta], index) => (
        <article
          key={title}
          className={cx(
            "group rounded-2xl border border-white/8 bg-[#0f1620]/90 p-4 backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-[#3dffa8]/35",
            index === 0 && "shadow-[0_20px_50px_rgba(61,255,168,0.08)]",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-[#3dffa8]/25 bg-[#3dffa8]/10 px-2.5 py-1 text-[11px] font-bold text-[#9dffc9]">
              {tag}
            </span>
            <span className="text-[11px] font-medium text-slate-500">{meta}</span>
          </div>
          <h3 className="mt-3 text-base font-bold leading-6 text-[#f4f8fc] transition group-hover:text-[#c8ffe0]">
            {title}
          </h3>
        </article>
      ))}
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
  const stats = [
    [getValue(data, "heroStatOne"), getValue(data, "heroStatOneLabel")],
    [getValue(data, "heroStatTwo"), getValue(data, "heroStatTwoLabel")],
    [getValue(data, "heroStatThree"), getValue(data, "heroStatThreeLabel")],
  ];

  return (
    <section className="relative isolate overflow-hidden px-5 pb-20 pt-14 lg:px-8 lg:pb-28 lg:pt-20">
      <div className="absolute left-[15%] top-0 -z-10 h-[420px] w-[520px] rounded-full bg-[#3dffa8]/12 blur-[130px]" />
      <div className="absolute right-[8%] top-[20%] -z-10 h-72 w-72 rounded-full bg-[#38bdf8]/12 blur-[110px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="text-right">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3dffa8]/25 bg-[#3dffa8]/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#9dffc9]">
            {getValue(data, "heroEyebrow")}
          </p>
          <h1 className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight text-[#f4f8fc] md:text-6xl lg:text-7xl">
            {getValue(data, "heroTitle")}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400 md:text-xl">
            {getValue(data, "heroSubtitle")}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <AccentButton onClick={openBooking}>{getValue(data, "heroPrimaryButton")}</AccentButton>
            <button
              type="button"
              onClick={() => goTo("feed")}
              className="rounded-full border border-white/12 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
            >
              {getValue(data, "heroSecondaryButton")}
            </button>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {stats.map(([num, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center"
              >
                <div className="text-2xl font-bold text-[#3dffa8]">{num}</div>
                <div className="mt-1 text-[11px] font-semibold text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[36px] bg-gradient-to-br from-[#3dffa8]/15 via-transparent to-[#38bdf8]/10 blur-xl" />
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0c121a] p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between px-1">
              <p className="text-sm font-bold text-white">הפיד שלי</p>
              <span className="rounded-full bg-[#3dffa8]/15 px-3 py-1 text-[11px] font-bold text-[#9dffc9]">
                מותאם אישית
              </span>
            </div>
            <FeedPreviewCards data={data} />
          </div>
        </div>
      </div>
    </section>
  );
}

function LogosStrip({ data }: { data: Record<string, any> }) {
  const logos = ["CloudNine", "Northline", "Orbit", "Stacklab", "Bytecraft", "Lumen"];
  return (
    <section className="px-5 py-12 lg:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
          {getValue(data, "logosTitle")}
        </p>
        <div className="mt-8 grid grid-cols-3 gap-6 opacity-70 md:grid-cols-6">
          {logos.map((logo) => (
            <div
              key={logo}
              className="text-center text-lg font-bold tracking-tight text-slate-400 transition hover:text-white"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeedSection({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow={getValue(data, "feedEyebrow")} title={getValue(data, "feedTitle")} />
        <div className="mx-auto mt-14 max-w-3xl">
          <FeedPreviewCards data={data} />
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ data }: { data: Record<string, any> }) {
  const features = [
    ["◆", getValue(data, "featureOneTitle"), getValue(data, "featureOneText")],
    ["◈", getValue(data, "featureTwoTitle"), getValue(data, "featureTwoText")],
    ["⬡", getValue(data, "featureThreeTitle"), getValue(data, "featureThreeText")],
    ["◉", getValue(data, "featureFourTitle"), getValue(data, "featureFourText")],
    ["✦", getValue(data, "featureFiveTitle"), getValue(data, "featureFiveText")],
    ["✳", getValue(data, "featureSixTitle"), getValue(data, "featureSixText")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow={getValue(data, "featuresEyebrow")} title={getValue(data, "featuresTitle")} />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([icon, title, text]) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.03] p-7 transition duration-500 hover:-translate-y-2 hover:border-[#3dffa8]/30"
            >
              <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#3dffa8]/0 blur-2xl transition duration-500 group-hover:bg-[#3dffa8]/15" />
              <div className="relative z-10">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#3dffa8]/12 text-xl text-[#9dffc9]">
                  {icon}
                </span>
                <h3 className="mt-6 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowSection({ data }: { data: Record<string, any> }) {
  const steps = [
    ["01", getValue(data, "workflowOneTitle"), getValue(data, "workflowOneText")],
    ["02", getValue(data, "workflowTwoTitle"), getValue(data, "workflowTwoText")],
    ["03", getValue(data, "workflowThreeTitle"), getValue(data, "workflowThreeText")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow={getValue(data, "workflowEyebrow")} title={getValue(data, "workflowTitle")} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map(([num, title, text]) => (
            <div
              key={num}
              className="rounded-[28px] border border-white/8 bg-white/[0.03] p-8 transition duration-500 hover:-translate-y-2 hover:border-[#38bdf8]/30"
            >
              <span className="text-5xl font-bold text-[#3dffa8]">{num}</span>
              <h3 className="mt-5 text-2xl font-bold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunitySection({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "communityOneTitle"), getValue(data, "communityOneText")],
    [getValue(data, "communityTwoTitle"), getValue(data, "communityTwoText")],
    [getValue(data, "communityThreeTitle"), getValue(data, "communityThreeText")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow={getValue(data, "communityEyebrow")}
          title={getValue(data, "communityTitle")}
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {items.map(([title, text]) => (
            <article
              key={title}
              className="rounded-[28px] border border-white/8 bg-gradient-to-b from-[#3dffa8]/8 to-transparent p-8 transition duration-500 hover:-translate-y-2"
            >
              <h3 className="text-2xl font-bold text-white">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{text}</p>
            </article>
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
    [
      getValue(data, "priceOneName"),
      getValue(data, "priceOnePrice"),
      getValue(data, "priceOnePeriod"),
      getValue(data, "priceOneText"),
      ["פיד מותאם אישית", "תוסף דפדפן", "קהילות בסיסיות"],
    ],
    [
      getValue(data, "priceTwoName"),
      getValue(data, "priceTwoPrice"),
      getValue(data, "priceTwoPeriod"),
      getValue(data, "priceTwoText"),
      ["סינון מתקדם", "מצב קריירה", "סיכומים שבועיים", "ללא פרסומות"],
    ],
    [
      getValue(data, "priceThreeName"),
      getValue(data, "priceThreePrice"),
      getValue(data, "priceThreePeriod"),
      getValue(data, "priceThreeText"),
      ["הכול בפלוס", "שיתוף צוותי", "דוחות למנהלים", "SSO והרשאות"],
    ],
  ] as const;

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow={getValue(data, "pricingEyebrow")} title={getValue(data, "pricingTitle")} />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map(([name, price, period, text, features], index) => (
            <article
              key={name}
              className={cx(
                "relative overflow-hidden rounded-[32px] border p-8 transition duration-500 hover:-translate-y-3",
                index === 1
                  ? "border-[#3dffa8]/40 bg-gradient-to-b from-[#3dffa8]/12 to-[#0d131b]"
                  : "border-white/8 bg-white/[0.03] hover:border-white/15",
              )}
            >
              {index === 1 ? (
                <span className="absolute left-6 top-6 rounded-full bg-[#3dffa8] px-3 py-1 text-xs font-bold text-[#07110c]">
                  הכי פופולרי
                </span>
              ) : null}
              <h3 className="text-xl font-bold text-white">{name}</h3>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white">{price}</span>
                <span className="text-sm text-slate-400">{period}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
              <ul className="mt-7 space-y-3 text-sm text-slate-300">
                {(features as readonly string[]).map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="text-[#3dffa8]">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={openBooking}
                className={cx(
                  "mt-9 w-full rounded-full px-6 py-4 text-sm font-bold transition duration-300",
                  index === 1
                    ? "bg-[#3dffa8] text-[#07110c] hover:-translate-y-0.5"
                    : "border border-white/12 bg-white/5 text-white hover:bg-white/10",
                )}
              >
                {getValue(data, "heroPrimaryButton")}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName"), getValue(data, "reviewOneRole")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName"), getValue(data, "reviewTwoRole")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName"), getValue(data, "reviewThreeRole")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow={getValue(data, "testimonialsEyebrow")}
          title={getValue(data, "testimonialsTitle")}
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {reviews.map(([text, name, role], index) => (
            <article
              key={name + index}
              className="rounded-[28px] border border-white/8 bg-white/[0.03] p-8 transition duration-500 hover:-translate-y-2 hover:border-[#3dffa8]/30"
            >
              <div className="mb-5 text-[#3dffa8]">★★★★★</div>
              <p className="text-base leading-8 text-slate-200">“{text}”</p>
              <div className="mt-7 flex items-center gap-3 border-t border-white/8 pt-5">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#3dffa8] text-sm font-bold text-[#07110c]">
                  {String(name).charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{name}</p>
                  <p className="text-xs text-slate-400">{role}</p>
                </div>
              </div>
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
        <SectionTitle center={false} eyebrow={getValue(data, "faqEyebrow")} title={getValue(data, "faqTitle")} />
        <div className="space-y-4">
          {faqs.map(([question, answer], index) => {
            const isOpen = open === index;
            return (
              <div
                key={question}
                className="overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.03]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-6 p-6 text-right"
                >
                  <span className="text-lg font-bold text-white">{question}</span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#3dffa8] text-lg font-bold text-[#07110c]">
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
                    <p className="px-6 pb-6 text-base leading-7 text-slate-400">{answer}</p>
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

function AboutSection({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionTitle
            center={false}
            eyebrow={getValue(data, "aboutEyebrow")}
            title={getValue(data, "aboutTitle")}
            text={getValue(data, "aboutText")}
          />
        </div>
        <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-2">
          <img
            src={getValue(data, "aboutImage")}
            alt=""
            className="h-[440px] w-full rounded-[24px] object-cover transition duration-700 group-hover:scale-105"
          />
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
  const info = [
    ["טלפון", getValue(data, "phone")],
    ["אימייל", getValue(data, "email")],
    ["כתובת", getValue(data, "address")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#3dffa8]/12 to-[#38bdf8]/8 lg:grid-cols-[1fr_1fr]">
        <div className="p-8 lg:p-12">
          <SectionTitle
            center={false}
            eyebrow={getValue(data, "contactEyebrow")}
            title={getValue(data, "contactTitle")}
            text={getValue(data, "contactText")}
          />
          <div className="mt-10 grid gap-3">
            {info.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-4">
                <div className="text-xs font-semibold tracking-[0.16em] text-slate-400">{label}</div>
                <div className="mt-1 text-base font-semibold text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
        <form className="m-4 rounded-[30px] border border-white/8 bg-[#070b10]/70 p-6 lg:m-6 lg:p-8">
          <div className="grid gap-4">
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none placeholder:text-slate-500 focus:border-[#3dffa8]/50"
              placeholder="שם מלא"
            />
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none placeholder:text-slate-500 focus:border-[#3dffa8]/50"
              placeholder="אימייל עבודה"
            />
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none placeholder:text-slate-500 focus:border-[#3dffa8]/50"
              placeholder="שם החברה"
            />
            <textarea
              className="min-h-32 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none placeholder:text-slate-500 focus:border-[#3dffa8]/50"
              placeholder="ספרו לנו על הצוות שלכם"
            />
            <button
              type="button"
              onClick={openBooking}
              className="rounded-full bg-[#3dffa8] px-7 py-4 text-base font-bold text-[#07110c]"
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
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[44px] border border-white/10 bg-gradient-to-br from-[#3dffa8]/18 via-[#0d131b] to-transparent p-8 lg:p-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight text-white md:text-5xl">
              {getValue(data, "ctaTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              {getValue(data, "ctaText")}
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <AccentButton onClick={openBooking}>{getValue(data, "ctaButton")}</AccentButton>
            <button
              type="button"
              onClick={() => goTo("pricing")}
              className="rounded-full border border-white/12 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {getValue(data, "navPricing")}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-slate-500 md:flex-row">
        <p>
          © {new Date().getFullYear()} {getValue(data, "brandName")}
        </p>
        <p>תבנית Fluxora · Bizuply Studio</p>
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
      <LogosStrip data={data} />
      <FeedSection data={data} />
      <FeaturesSection data={data} />
      <WorkflowSection data={data} />
      <CommunitySection data={data} />
      <PricingSection data={data} openBooking={openBooking} />
      <TestimonialsSection data={data} />
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
    feed: (
      <>
        <FeedSection data={data} />
        <FeaturesSection data={data} />
      </>
    ),
    community: (
      <>
        <CommunitySection data={data} />
        <TestimonialsSection data={data} />
      </>
    ),
    pricing: (
      <>
        <PricingSection data={data} openBooking={openBooking} />
        <FaqSection data={data} />
      </>
    ),
    about: (
      <>
        <AboutSection data={data} />
        <WorkflowSection data={data} />
      </>
    ),
    contact: <ContactSection data={data} openBooking={openBooking} />,
  };

  return (
    <>
      <section className="relative isolate overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
        <div className="absolute left-1/2 top-0 -z-10 h-72 w-[600px] -translate-x-1/2 rounded-full bg-[#3dffa8]/12 blur-[120px]" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-[#3dffa8]/25 bg-[#3dffa8]/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#9dffc9]">
            {getValue(data, "brandName")}
          </p>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[1.04] tracking-tight text-white md:text-7xl">
            {getPageTitle(data, type)}
          </h1>
        </div>
      </section>

      {pageMap[type] ?? null}

      <CtaFooter data={data} goTo={goTo} openBooking={openBooking} />
    </>
  );
}

export default function FluxoraPages({
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
}: FluxoraPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...fluxoraDefaultData,
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
    { allowedPages: fluxoraAllowedPages, fallbackPage: "home" },
  );
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "fluxora-preview" : "fluxora"}
      className="min-h-screen w-full overflow-x-hidden bg-[#070b10] font-sans text-[#e8eef5]"
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
          ...fluxoraPages
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
