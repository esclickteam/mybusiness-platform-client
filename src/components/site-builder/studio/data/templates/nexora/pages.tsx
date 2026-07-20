import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { TemplateDecor, TemplateText } from "../shared/TemplateText";
import { nexoraDefaultData } from "./defaultData";

export const nexoraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "features", label: "יכולות", slug: "/features" },
  { id: "pricing", label: "תמחור", slug: "/pricing" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

type NexoraPagesProps = {
  initialPage?: string;
  page?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (nexoraDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getPageTitle(data: Record<string, any>, type: string) {
  if (type === "features") return getValue(data, "navFeatures");
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
      <TemplateText
        as="p"
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300"
      >
        {eyebrow}
      </TemplateText>
      <TemplateText
        as="h2"
        className="text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl"
      >
        {title}
      </TemplateText>
      {text ? (
        <TemplateText as="p" className="mt-5 text-lg leading-8 text-slate-400">
          {text}
        </TemplateText>
      ) : null}
    </div>
  );
}

function GradientButton({
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
      className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30"
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
    ["features", getValue(data, "navFeatures")],
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
      data-visual-flow-lock="true"
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b border-white/5 bg-[#0b1020]/80 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate("home")}
          className="group flex items-center gap-3 text-right"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white shadow-lg shadow-indigo-500/30 transition duration-300 group-hover:scale-105">
            {getValue(data, "logoText")}
          </span>
          <span className="text-xl font-bold tracking-tight text-white">
            {getValue(data, "brandName")}
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/5 p-1 lg:flex">
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
            className="hidden rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition duration-300 hover:-translate-y-0.5 sm:inline-flex"
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
        <div className="border-t border-white/5 bg-[#0b1020]/97 px-5 pb-5 lg:hidden">
          <div className="grid gap-2 rounded-[28px] border border-white/8 bg-white/5 p-2">
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
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openBooking();
              }}
              className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white"
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
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#050814]/80 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-[#0e1428] p-8 shadow-2xl shadow-indigo-900/40">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/5 text-xl font-semibold text-white transition hover:scale-105"
        >
          ×
        </button>
        <div className="relative z-10">
          <TemplateText
            as="p"
            className="inline-flex rounded-full bg-indigo-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300"
          >
            {getValue(data, "contactEyebrow")}
          </TemplateText>
          <TemplateText as="h3" className="mt-5 text-3xl font-bold text-white">
            {getValue(data, "contactTitle")}
          </TemplateText>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {getValue(data, "contactText")}
          </p>
          <form className="mt-7 grid gap-4">
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
              placeholder={getValue(data, "formNamePlaceholder")}
            />
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
              placeholder={getValue(data, "formEmailPlaceholder")}
            />
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
              placeholder={getValue(data, "formCompanyPlaceholder")}
            />
            <button
              type="button"
              className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5"
            >
              {getValue(data, "contactButton")}
            </button>
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
  const stats = [
    [getValue(data, "heroStatOne"), getValue(data, "heroStatOneLabel")],
    [getValue(data, "heroStatTwo"), getValue(data, "heroStatTwoLabel")],
    [getValue(data, "heroStatThree"), getValue(data, "heroStatThreeLabel")],
  ];

  return (
    <section className="relative isolate overflow-hidden px-5 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
      <div className="absolute left-1/2 top-0 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />
      <div className="absolute right-[10%] top-[30%] -z-10 h-72 w-72 rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="mx-auto max-w-4xl text-center">
        <TemplateText
          as="p"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300"
        >
          {getValue(data, "heroEyebrow")}
        </TemplateText>
        <TemplateText
          as="h1"
          className="mx-auto max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight text-white md:text-7xl"
        >
          {getValue(data, "heroTitle")}
        </TemplateText>
        <TemplateText
          as="p"
          className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400 md:text-xl"
        >
          {getValue(data, "heroSubtitle")}
        </TemplateText>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <GradientButton onClick={openBooking}>{getValue(data, "heroPrimaryButton")}</GradientButton>
          <button
            type="button"
            onClick={() => goTo("features")}
            className="rounded-full border border-white/12 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
          >
            {getValue(data, "heroSecondaryButton")}
          </button>
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-5xl">
        <div className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-2 shadow-2xl shadow-indigo-900/30 backdrop-blur">
          <img
            src={getValue(data, "heroImage")}
            alt=""
            className="w-full rounded-[20px] object-cover transition duration-700 group-hover:scale-[1.02]"
          />
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {stats.map(([num, label]) => (
            <div
              key={label}
              className="rounded-3xl border border-white/8 bg-white/5 p-5 text-center backdrop-blur transition duration-500 hover:-translate-y-2 hover:border-indigo-400/30"
            >
              <TemplateText
                as="div"
                className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-3xl font-bold text-transparent"
              >
                {num}
              </TemplateText>
              <TemplateText as="div" className="mt-1 text-xs font-semibold text-slate-400">
                {label}
              </TemplateText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LogosStrip({ data }: { data: Record<string, any> }) {
  const logos = [
    getValue(data, "logoOne"),
    getValue(data, "logoTwo"),
    getValue(data, "logoThree"),
    getValue(data, "logoFour"),
    getValue(data, "logoFive"),
    getValue(data, "logoSix"),
  ];
  return (
    <section className="px-5 py-14 lg:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {getValue(data, "logosTitle")}
        </p>
        <div className="mt-8 grid grid-cols-3 gap-6 opacity-70 md:grid-cols-6">
          {logos.map((logo) => (
            <div
              key={logo}
              className="text-center text-lg font-bold tracking-tight text-slate-400 transition duration-300 hover:text-white"
            >
              <TemplateText as="span">{logo}</TemplateText>
            </div>
          ))}
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
              className="group relative overflow-hidden rounded-[28px] border border-white/8 bg-white/5 p-7 backdrop-blur transition duration-500 hover:-translate-y-2 hover:border-indigo-400/30"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/0 blur-2xl transition duration-500 group-hover:bg-indigo-500/20" />
              <div className="relative z-10">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-xl text-indigo-300">
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
              className="group rounded-[28px] border border-white/8 bg-white/5 p-8 backdrop-blur transition duration-500 hover:-translate-y-2 hover:border-violet-400/30"
            >
              <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-5xl font-bold text-transparent">
                {num}
              </span>
              <h3 className="mt-5 text-2xl font-bold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
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
    [
      getValue(data, "priceOneName"),
      getValue(data, "priceOnePrice"),
      getValue(data, "priceOnePeriod"),
      getValue(data, "priceOneText"),
      [
        getValue(data, "priceOneFeatureOne"),
        getValue(data, "priceOneFeatureTwo"),
        getValue(data, "priceOneFeatureThree"),
      ],
    ],
    [
      getValue(data, "priceTwoName"),
      getValue(data, "priceTwoPrice"),
      getValue(data, "priceTwoPeriod"),
      getValue(data, "priceTwoText"),
      [
        getValue(data, "priceTwoFeatureOne"),
        getValue(data, "priceTwoFeatureTwo"),
        getValue(data, "priceTwoFeatureThree"),
        getValue(data, "priceTwoFeatureFour"),
      ],
    ],
    [
      getValue(data, "priceThreeName"),
      getValue(data, "priceThreePrice"),
      getValue(data, "priceThreePeriod"),
      getValue(data, "priceThreeText"),
      [
        getValue(data, "priceThreeFeatureOne"),
        getValue(data, "priceThreeFeatureTwo"),
        getValue(data, "priceThreeFeatureThree"),
        getValue(data, "priceThreeFeatureFour"),
      ],
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
                "group relative overflow-hidden rounded-[32px] border p-8 backdrop-blur transition duration-500 hover:-translate-y-3",
                index === 1
                  ? "border-indigo-400/40 bg-gradient-to-b from-indigo-500/15 to-violet-500/10"
                  : "border-white/8 bg-white/5 hover:border-white/15",
              )}
            >
              {index === 1 ? (
                <TemplateText
                  as="span"
                  className="absolute left-6 top-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-1 text-xs font-semibold text-white"
                >
                  {getValue(data, "pricingPopularBadge")}
                </TemplateText>
              ) : null}
              <TemplateText as="h3" className="text-xl font-bold text-white">
                {name}
              </TemplateText>
              <div className="mt-6 flex items-baseline gap-1">
                <TemplateText as="span" className="text-5xl font-bold text-white">
                  {price}
                </TemplateText>
                <TemplateText as="span" className="text-sm text-slate-400">
                  {period}
                </TemplateText>
              </div>
              <TemplateText as="p" className="mt-3 text-sm leading-6 text-slate-400">
                {text}
              </TemplateText>
              <ul className="mt-7 space-y-3 text-sm text-slate-300">
                {(features as readonly string[]).map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <TemplateDecor className="text-indigo-400">✓</TemplateDecor>
                    <TemplateText as="span">{feature}</TemplateText>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={openBooking}
                className={cx(
                  "mt-9 w-full rounded-full px-6 py-4 text-sm font-semibold transition duration-300",
                  index === 1
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:-translate-y-0.5"
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
        <SectionTitle eyebrow={getValue(data, "testimonialsEyebrow")} title={getValue(data, "testimonialsTitle")} />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {reviews.map(([text, name, role], index) => (
            <article
              key={name + index}
              className="group rounded-[28px] border border-white/8 bg-white/5 p-8 backdrop-blur transition duration-500 hover:-translate-y-2 hover:border-indigo-400/30"
            >
              <div className="mb-5 text-indigo-400">★★★★★</div>
              <p className="text-base leading-8 text-slate-200">“{text}”</p>
              <div className="mt-7 flex items-center gap-3 border-t border-white/8 pt-5">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
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
                className="overflow-hidden rounded-[24px] border border-white/8 bg-white/5 backdrop-blur transition duration-300 hover:border-white/15"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-6 p-6 text-right"
                >
                  <span className="text-lg font-bold text-white">{question}</span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-lg text-white">
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
        <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-2 shadow-2xl shadow-indigo-900/30">
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
    [getValue(data, "labelPhone"), getValue(data, "phone")],
    [getValue(data, "labelEmail"), getValue(data, "email")],
    [getValue(data, "labelAddress"), getValue(data, "address")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-indigo-600/20 to-violet-600/10 lg:grid-cols-[1fr_1fr]">
        <div className="p-8 lg:p-12">
          <SectionTitle
            center={false}
            eyebrow={getValue(data, "contactEyebrow")}
            title={getValue(data, "contactTitle")}
            text={getValue(data, "contactText")}
          />
          <div className="mt-10 grid gap-3">
            {info.map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-4">
                <TemplateText
                  as="div"
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"
                >
                  {label}
                </TemplateText>
                <div className="mt-1 text-base font-semibold text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
        <form className="m-4 rounded-[30px] border border-white/8 bg-[#0b1020]/70 p-6 lg:m-6 lg:p-8">
          <div className="grid gap-4">
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
              placeholder={getValue(data, "formNamePlaceholder")}
            />
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
              placeholder={getValue(data, "formEmailPlaceholder")}
            />
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
              placeholder={getValue(data, "formCompanyPlaceholder")}
            />
            <textarea
              className="min-h-32 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
              placeholder={getValue(data, "formMessagePlaceholder")}
            />
            <button
              type="button"
              onClick={openBooking}
              className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition duration-300 hover:-translate-y-0.5"
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
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[44px] border border-white/10 bg-gradient-to-br from-indigo-600/25 via-violet-600/15 to-transparent p-8 lg:p-14">
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
            <GradientButton onClick={openBooking}>{getValue(data, "ctaButton")}</GradientButton>
            <button
              type="button"
              onClick={() => goTo("pricing")}
              className="rounded-full border border-white/12 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-white/10"
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
        <p>תבנית Nexora · Bizuply Studio</p>
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
      <FeaturesSection data={data} />
      <WorkflowSection data={data} />
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
    features: (
      <>
        <FeaturesSection data={data} />
        <WorkflowSection data={data} />
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
        <TestimonialsSection data={data} />
      </>
    ),
    contact: <ContactSection data={data} openBooking={openBooking} />,
  };

  return (
    <>
      <section className="relative isolate overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
        <div className="absolute left-1/2 top-0 -z-10 h-72 w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-indigo-400/25 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
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

export default function NexoraPages({
  initialPage = "home",
  page,
  mode = "preview",
  data,
}: NexoraPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...nexoraDefaultData,
      ...(data ?? {}),
    }),
    [data],
  );

  const [currentPage, setCurrentPage] = useState(page || initialPage || "home");
  const [bookingOpen, setBookingOpen] = useState(false);

  function goTo(nextPage: string) {
    setCurrentPage(nextPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "nexora-preview" : "nexora"}
      className="min-h-screen w-full overflow-x-hidden bg-[#0b1020] font-sans text-white"
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
          ...nexoraPages
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
