import React, { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Cloud,
  DatabaseZap,
  Globe2,
  LineChart,
  Mail,
  Menu,
  Quote,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";

import { aelineImages, aelinePlans, aelineServices } from "./aelineData";

export type AelinePageId =
  | "home"
  | "services"
  | "about"
  | "pricing"
  | "blog"
  | "contact";

export const aelinePages: Array<{
  id: AelinePageId;
  name: string;
  slug: string;
}> = [
  { id: "home", name: "Home", slug: "/" },
  { id: "services", name: "Services", slug: "/services" },
  { id: "about", name: "About Us", slug: "/about" },
  { id: "pricing", name: "Pricing", slug: "/pricing" },
  { id: "blog", name: "Blog", slug: "/blog" },
  { id: "contact", name: "Contact", slug: "/contact" },
];

type AelinePagesProps = {
  initialPage?: AelinePageId;
  isStudioStatic?: boolean;
};

const navItems: Array<{ id: AelinePageId; label: string }> = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "about", label: "About Us" },
  { id: "pricing", label: "More Links" },
];

const logos = [
  "IPSUM",
  "CLOUDLY",
  "VERTEX",
  "ATLAS",
  "NEURAL",
  "FLOWAI",
  "NOVA",
  "STACK",
];

const expertiseCards = [
  {
    title: "Automation & optimization",
    text: "Streamline your operations through intelligent workflow automation that saves time, reduces errors, and boosts productivity.",
    kind: "expense",
  },
  {
    title: "Data analytics & insights",
    text: "Transform raw data into strategic insight using advanced analytics, dashboards, and predictive modeling.",
    kind: "chart",
  },
  {
    title: "Digital transformation",
    text: "Modernize systems, processes and decision-making frameworks with a practical AI roadmap.",
    kind: "performance",
  },
  {
    title: "Experience intelligence",
    text: "Connect people, data and digital experiences into one intelligent operating system.",
    kind: "radar",
  },
];

const posts = [
  {
    title: "Turning Data into Strategy: The Power of Analytics",
    text: "How leaders can translate raw data into business decisions that actually move growth.",
  },
  {
    title: "5 Ways AI Can Streamline Business Operations",
    text: "Simple automation ideas that improve speed, accuracy and customer experience.",
  },
  {
    title: "Human + Machine: Finding the Perfect Balance",
    text: "Why the strongest AI strategy starts with people, not tools.",
  },
];

function AelineButton({
  children,
  onClick,
  variant = "lime",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "lime" | "blue" | "dark" | "light";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-editable-link="true"
      className={[
        "group inline-flex h-14 items-center justify-center gap-3 rounded-full px-7 text-sm font-black uppercase tracking-[0.18em] shadow-sm transition duration-300 active:scale-[0.98]",
        variant === "lime"
          ? "bg-[#d8ff4f] text-black hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(216,255,79,0.42)]"
          : variant === "blue"
            ? "bg-[#176fae] text-white hover:-translate-y-1 hover:bg-[#0d5f9d]"
            : variant === "dark"
              ? "bg-black text-white hover:-translate-y-1 hover:bg-[#111]"
              : "border border-black/10 bg-white text-black hover:-translate-y-1 hover:border-black/30",
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
  activePage: AelinePageId;
  onPageChange: (page: AelinePageId) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      data-section-kind="header"
      data-section-title="Header"
      className="absolute left-0 right-0 top-0 z-50 px-5 py-4 text-white"
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-5">
        <button
          type="button"
          onClick={() => onPageChange("home")}
          className="flex items-center gap-3"
        >
          <span className="relative flex h-9 w-9 items-center justify-center">
            <span className="absolute h-8 w-8 rotate-45 rounded-[8px] bg-white" />
            <Sparkles className="relative z-10 h-4 w-4 text-[#1288cf]" />
          </span>

          <span
            data-gjs-type="text"
            className="text-xl font-bold tracking-[-0.04em]"
          >
            Aeline
          </span>
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onPageChange(item.id)}
              className={[
                "inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] transition hover:text-[#d8ff4f]",
                activePage === item.id ? "text-[#d8ff4f]" : "text-white",
              ].join(" ")}
            >
              {item.label}
              {item.label === "More Links" && (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          ))}
        </nav>

        <div className="hidden lg:block">
          <AelineButton onClick={() => onPageChange("contact")}>
            Buy Template
          </AelineButton>
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
        <div className="mx-auto mt-4 grid max-w-[1280px] gap-2 rounded-[26px] bg-white p-3 text-black shadow-2xl lg:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onPageChange(item.id);
                setMobileOpen(false);
              }}
              className="rounded-2xl px-4 py-3 text-left text-sm font-black uppercase tracking-[0.12em] hover:bg-black/5"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function FloatingHeroCard({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "aeline-float-card absolute rounded-[18px] border border-white/55 bg-white/92 p-4 text-black shadow-[0_22px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function HeroCardRail() {
  const cards = [
    { title: "Monthly", value: "$4,900", small: "/ $10,000" },
    { title: "Income", value: "$2,670", small: "$1,200" },
    { title: "Intelligence in", value: "Every Decision", small: "AI systems" },
    { title: "Expertise", value: "Strategy + AI", small: "Artificial intelligence" },
    { title: "Data training", value: "Upload", small: "your content" },
    { title: "Data Points", value: "520k+", small: "Analyzed monthly" },
    { title: "Progress", value: "49%", small: "Growth" },
  ];

  return (
    <div className="relative mx-auto mt-12 h-[230px] w-full max-w-[860px]">
      <div className="absolute left-1/2 top-16 h-24 w-[92%] -translate-x-1/2 rounded-full bg-white/30 blur-3xl" />

      {cards.map((card, index) => {
        const positions = [
          "left-[0%] top-[70px] rotate-[-12deg]",
          "left-[14%] top-[42px] rotate-[-8deg]",
          "left-[29%] top-[22px] rotate-[-3deg]",
          "left-[45%] top-[10px] rotate-[0deg]",
          "left-[61%] top-[24px] rotate-[4deg]",
          "left-[75%] top-[50px] rotate-[9deg]",
          "left-[88%] top-[82px] rotate-[14deg]",
        ];

        return (
          <div
            key={card.title}
            className={[
              "aeline-card-orbit absolute h-[132px] w-[142px] rounded-[16px] border border-white/60 bg-white p-4 text-left text-black shadow-[0_24px_60px_rgba(0,0,0,0.22)] transition duration-500 hover:z-20 hover:-translate-y-4 hover:rotate-0 hover:scale-110",
              positions[index],
              index === 3 ? "bg-black text-white" : "",
              index === 4 ? "bg-sky-300 text-white" : "",
            ].join(" ")}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.12em] opacity-55">
              {card.title}
            </p>
            <p className="mt-3 text-2xl font-black tracking-[-0.05em]">
              {card.value}
            </p>
            <p className="mt-1 text-[10px] font-bold opacity-45">{card.small}</p>

            {index === 2 && (
              <div className="mt-4 flex h-10 items-end gap-1">
                {[20, 28, 38, 50, 66, 88].map((height) => (
                  <span
                    key={height}
                    className="w-3 rounded-t bg-sky-300"
                    style={{ height }}
                  />
                ))}
              </div>
            )}

            {index === 0 && (
              <div className="mt-4 h-2 rounded-full bg-slate-100">
                <div className="h-2 w-2/3 rounded-full bg-sky-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function HeroSection({
  onPageChange,
}: {
  onPageChange: (page: AelinePageId) => void;
}) {
  return (
    <section
      data-section-kind="hero"
      data-section-title="Hero"
      className="relative min-h-[950px] overflow-hidden bg-[linear-gradient(180deg,#0878b7_0%,#1598df_55%,#39aef2_100%)] px-6 pb-20 pt-36 text-white"
    >
      <div className="absolute inset-0 opacity-35 [background:radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.55),transparent_26%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.35),transparent_26%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.35),transparent_24%)]" />

      <div className="aeline-cloud aeline-cloud-one absolute bottom-16 left-[-120px] h-40 w-[520px] rounded-full bg-white/70 blur-2xl" />
      <div className="aeline-cloud aeline-cloud-two absolute bottom-8 right-[-100px] h-36 w-[460px] rounded-full bg-white/65 blur-2xl" />
      <div className="aeline-cloud aeline-cloud-three absolute bottom-28 left-[20%] h-28 w-[360px] rounded-full bg-white/35 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-[1280px] text-center">
        <h1
          data-gjs-type="text"
          className="mx-auto max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.08em] text-white md:text-7xl"
        >
          Building the future with
          <span className="block text-white/65">AI and strategy</span>
        </h1>

        <p
          data-gjs-type="text"
          className="mx-auto mt-7 max-w-xl text-base font-semibold leading-7 text-white"
        >
          We help organizations unlock growth and efficiency through data-driven
          consulting and intelligent automation.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <AelineButton variant="blue" onClick={() => onPageChange("services")}>
            View Demo
          </AelineButton>

          <AelineButton onClick={() => onPageChange("contact")}>
            Get Started
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
              <ArrowRight className="h-4 w-4" />
            </span>
          </AelineButton>
        </div>

        <HeroCardRail />

        <div className="mt-6">
          <p className="text-sm font-bold text-white">
            Rated 4.9/5 by 4,900+ clients
          </p>

          <div className="mt-3 flex justify-center gap-1 text-[#d8ff4f]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section
      data-section-kind="about"
      data-section-title="About"
      className="relative bg-white px-6 py-24 text-black"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-black">
            · About Us
          </p>

          <h2
            data-gjs-type="text"
            className="mx-auto mt-7 max-w-4xl text-4xl font-medium leading-[1.08] tracking-[-0.06em] md:text-6xl"
          >
            A global consulting partner
            <br />
            dedicated to building
            <span className="mx-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-sky-400 align-middle text-white">
              <BarChart3 className="h-7 w-7" />
            </span>
            smarter
            <br />
            <span className="text-black/45">
              and
              <span className="mx-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#d8ff4f] align-middle text-black">
                <Sparkles className="h-7 w-7" />
              </span>
              more adaptive
            </span>
          </h2>
        </div>

        <div className="mt-20 grid gap-5 lg:grid-cols-[1fr_1fr_1fr]">
          <article className="group overflow-hidden rounded-[24px] bg-sky-400 p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-black uppercase tracking-[-0.05em]">
                Ipsum
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
                <LineChart className="h-5 w-5" />
              </span>
            </div>

            <div className="mt-16 rounded-[18px] bg-white p-5 text-black">
              <p className="text-7xl font-light tracking-[-0.08em]">120+</p>
              <p className="mt-5 text-base leading-6">
                Collaborating with leading AI and cloud technology providers.
              </p>
            </div>
          </article>

          <article className="rounded-[24px] bg-[#f1f1f1] p-6 transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
            <p className="text-sm font-medium">Commitment to measurable</p>
            <p className="mt-5 text-5xl font-light tracking-[-0.06em]">100%</p>

            <div className="mt-16 flex -space-x-3">
              {["#111", "#d8ff4f", "#ff6259", "#8ed6ff"].map((color) => (
                <span
                  key={color}
                  className="h-9 w-9 rounded-full border-2 border-white"
                  style={{ background: color }}
                />
              ))}
            </div>

            <p
              data-gjs-type="text"
              className="mt-5 text-base font-medium leading-6"
            >
              “Their automation strategy completely reshaped how we work. It’s
              efficient, intelligent, and seamless.”
            </p>
          </article>

          <div className="grid gap-5">
            <article className="rounded-[24px] bg-[#d8ff4f] p-6 transition duration-300 hover:-translate-y-2">
              <p className="text-sm font-medium">Data Points</p>
              <p className="mt-5 text-5xl font-light tracking-[-0.06em]">
                520k+
              </p>
              <p
                data-gjs-type="text"
                className="mt-9 max-w-sm text-base font-medium leading-6"
              >
                Analyzed monthly to power smarter business strategies.
              </p>
            </article>

            <article className="flex items-center justify-between rounded-[24px] bg-black p-6 text-white transition duration-300 hover:-translate-y-2">
              <p className="text-base font-medium">Continents</p>
              <p className="text-5xl font-light tracking-[-0.06em]">20+</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({
  onPageChange,
}: {
  onPageChange: (page: AelinePageId) => void;
}) {
  return (
    <section
      data-section-kind="services"
      data-section-title="Services"
      className="bg-[#f4f1e9] px-6 py-28 text-black"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.55em] text-black/35">
              Services
            </p>

            <h2
              data-gjs-type="text"
              className="mt-8 max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.08em] md:text-8xl"
            >
              Consulting and
              <br />
              intelligent innovation
            </h2>
          </div>

          <AelineButton variant="dark" onClick={() => onPageChange("contact")}>
            Start Project
            <ArrowRight className="h-4 w-4" />
          </AelineButton>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {aelineServices.map((service) => (
            <article
              key={service.title}
              data-section-kind="service-card"
              data-section-title={service.title}
              className="group min-h-[360px] rounded-[34px] border border-black/5 bg-white p-9 shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-4 hover:bg-black hover:text-white hover:shadow-[0_30px_90px_rgba(0,0,0,0.18)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-black/30 group-hover:text-white/30">
                  {service.number}
                </span>

                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3dff88] text-black transition duration-300 group-hover:rotate-12 group-hover:scale-110">
                  <Zap className="h-6 w-6" />
                </span>
              </div>

              <h3
                data-gjs-type="text"
                className="mt-28 text-4xl font-black tracking-[-0.06em]"
              >
                {service.title}
              </h3>

              <p
                data-gjs-type="text"
                className="mt-7 text-lg leading-8 text-black/55 group-hover:text-white/60"
              >
                {service.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisualMockup({ kind }: { kind: string }) {
  if (kind === "expense") {
    return (
      <div className="relative h-64">
        <FloatingHeroCard className="left-12 top-4 w-52 rotate-[-8deg]">
          <p className="text-xs font-bold">Monthly expense</p>
          <p className="mt-2 text-2xl font-semibold">
            $ 4900 <span className="text-black/25">/ $10,000</span>
          </p>
          <div className="mt-4 h-2 rounded-full bg-black/5">
            <div className="h-2 w-2/3 rounded-full bg-sky-400" />
          </div>
        </FloatingHeroCard>
      </div>
    );
  }

  if (kind === "chart") {
    return (
      <div className="relative h-64">
        <FloatingHeroCard className="left-16 top-4 w-56 rotate-[7deg]">
          <p className="text-xl font-medium leading-6">
            Intelligence in Every Decision
          </p>

          <div className="mt-8 flex h-28 items-end gap-3">
            {[25, 35, 48, 63, 82, 110].map((height, index) => (
              <span
                key={height}
                className={[
                  "w-7 rounded-t-lg",
                  index === 5 ? "bg-sky-400" : "bg-black/5",
                ].join(" ")}
                style={{ height }}
              />
            ))}
          </div>
        </FloatingHeroCard>
      </div>
    );
  }

  if (kind === "performance") {
    return (
      <div className="relative h-64">
        <FloatingHeroCard className="left-16 top-10 w-56 rotate-[-3deg]">
          <div className="rounded-2xl bg-black p-4 text-white">
            <p className="text-sm font-bold">Performance</p>
            <p className="text-[10px] text-white/45">In the past 7 days</p>
          </div>

          <p className="mt-5 text-4xl font-light tracking-[-0.08em]">
            49% <span className="rounded-full bg-[#d8ff4f] px-2 text-sm">+2.5%</span>
          </p>
        </FloatingHeroCard>
      </div>
    );
  }

  return (
    <div className="relative flex h-64 items-center justify-center">
      <div className="absolute h-56 w-56 rounded-full border border-black/10" />
      <div className="absolute h-40 w-40 rounded-full border border-black/10" />
      <div className="absolute h-24 w-24 rounded-full border border-black/10" />

      <div className="z-10 flex h-16 w-16 rotate-45 items-center justify-center rounded-2xl bg-black text-white shadow-xl">
        <Sparkles className="-rotate-45" />
      </div>
    </div>
  );
}

function ExpertiseSection() {
  return (
    <section
      data-section-kind="expertise"
      data-section-title="Expertise"
      className="bg-white px-3 py-24 text-black"
    >
      <div className="mx-auto max-w-[1420px]">
        <div className="mb-16 px-3 text-center">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-black/40">
            Expertise
          </p>

          <h2
            data-gjs-type="text"
            className="mx-auto mt-6 max-w-4xl text-5xl font-medium leading-[1] tracking-[-0.07em] md:text-7xl"
          >
            Where human insight meets
            <span className="text-black/40"> intelligent technology</span>
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {expertiseCards.map((card) => (
            <article
              key={card.title}
              className="group overflow-hidden rounded-[14px] bg-[#f8f8f8] p-10 transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]"
            >
              <VisualMockup kind={card.kind} />

              <h3
                data-gjs-type="text"
                className="mt-6 text-center text-3xl font-medium tracking-[-0.05em]"
              >
                {card.title}
              </h3>

              <p
                data-gjs-type="text"
                className="mx-auto mt-4 max-w-xl text-center text-base leading-7 text-black/60"
              >
                {card.text}
              </p>
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
  onPageChange: (page: AelinePageId) => void;
}) {
  return (
    <section
      data-section-kind="pricing"
      data-section-title="Pricing"
      className="bg-[#f4f1e9] px-6 py-28 text-black"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-14 text-center">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-black/40">
            Pricing
          </p>

          <h2
            data-gjs-type="text"
            className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.08em] md:text-7xl"
          >
            Flexible plans for every stage of growth
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {aelinePlans.map((plan, index) => (
            <article
              key={plan.name}
              className={[
                "rounded-[34px] border p-8 transition duration-300 hover:-translate-y-3",
                index === 1
                  ? "border-black bg-black text-white shadow-[0_30px_90px_rgba(0,0,0,0.18)]"
                  : "border-black/10 bg-white text-black shadow-[0_20px_60px_rgba(0,0,0,0.05)]",
              ].join(" ")}
            >
              <p className="text-sm font-black uppercase tracking-[0.22em] opacity-45">
                {plan.name}
              </p>

              <h3
                data-gjs-type="text"
                className="mt-8 text-5xl font-black tracking-[-0.07em]"
              >
                {plan.price}
              </h3>

              <p
                data-gjs-type="text"
                className="mt-3 text-sm leading-7 opacity-55"
              >
                {plan.text}
              </p>

              <div className="mt-8 grid gap-3">
                {plan.items.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-bold">
                    <CheckCircle2 className="h-5 w-5 text-[#3dff88]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onPageChange("contact")}
                data-editable-link="true"
                className={[
                  "mt-9 h-12 w-full rounded-full text-sm font-black transition hover:-translate-y-1",
                  index === 1
                    ? "bg-[#3dff88] text-black"
                    : "bg-black text-white",
                ].join(" ")}
              >
                Get Started
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section
      data-section-kind="testimonials"
      data-section-title="Testimonials"
      className="bg-white px-6 py-24"
    >
      <div className="mx-auto max-w-[1280px] rounded-[36px] bg-black p-8 text-white lg:p-14">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <Quote className="h-12 w-12 text-[#d8ff4f]" />

            <h2
              data-gjs-type="text"
              className="mt-6 text-5xl font-black tracking-[-0.07em]"
            >
              What clients say
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Their automation strategy completely reshaped how we work.",
              "The process was clear, modern and incredibly practical.",
              "We finally understand our data and how to use it.",
              "A premium consulting experience from start to finish.",
            ].map((text, index) => (
              <article
                key={index}
                className="rounded-[26px] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-2"
              >
                <p data-gjs-type="text" className="text-sm leading-7 text-white/70">
                  “{text}”
                </p>

                <p className="mt-5 text-sm font-black text-white">
                  Client #{index + 1}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogSection({
  onPageChange,
}: {
  onPageChange: (page: AelinePageId) => void;
}) {
  return (
    <section
      data-section-kind="blog"
      data-section-title="Blog"
      className="bg-[#f4f1e9] px-6 py-28 text-black"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-black/40">
              Blog
            </p>

            <h2
              data-gjs-type="text"
              className="mt-5 text-5xl font-black tracking-[-0.07em]"
            >
              Latest insights and trends
            </h2>
          </div>

          <AelineButton variant="light" onClick={() => onPageChange("blog")}>
            View All
          </AelineButton>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={post.title}
              className="group overflow-hidden rounded-[30px] bg-white transition duration-300 hover:-translate-y-3 hover:shadow-[0_28px_80px_rgba(0,0,0,0.12)]"
            >
              <img
                data-gjs-type="image"
                src={[aelineImages.abstract, aelineImages.meeting, aelineImages.team][index]}
                alt={post.title}
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-black/35">
                  Insight
                </p>

                <h3
                  data-gjs-type="text"
                  className="mt-4 text-2xl font-black tracking-[-0.05em]"
                >
                  {post.title}
                </h3>

                <p
                  data-gjs-type="text"
                  className="mt-3 text-sm leading-7 text-black/55"
                >
                  {post.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({
  onPageChange,
}: {
  onPageChange: (page: AelinePageId) => void;
}) {
  return (
    <section
      data-section-kind="cta"
      data-section-title="CTA"
      className="bg-white px-6 py-28"
    >
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[40px] bg-[#1288cf] p-10 text-center text-white shadow-[0_28px_90px_rgba(18,136,207,0.25)] lg:p-16">
        <Cloud className="mx-auto h-16 w-16 text-white/70" />

        <h2
          data-gjs-type="text"
          className="mx-auto mt-8 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.08em] md:text-7xl"
        >
          Build smarter systems for your business
        </h2>

        <p
          data-gjs-type="text"
          className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-8 text-white/80"
        >
          Use this final section to collect leads, book calls or move visitors
          into your next step.
        </p>

        <div className="mt-9 flex justify-center">
          <AelineButton onClick={() => onPageChange("contact")}>
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </AelineButton>
        </div>
      </div>
    </section>
  );
}

function Footer({
  onPageChange,
}: {
  onPageChange: (page: AelinePageId) => void;
}) {
  return (
    <footer
      data-section-kind="footer"
      data-section-title="Footer"
      className="bg-black px-6 py-14 text-white"
    >
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center">
              <span className="absolute h-9 w-9 rotate-45 rounded-[8px] bg-white" />
              <Sparkles className="relative z-10 h-5 w-5 text-black" />
            </span>

            <p className="text-2xl font-bold tracking-[-0.05em]">Aeline</p>
          </div>

          <p
            data-gjs-type="text"
            className="mt-5 max-w-md text-sm leading-7 text-white/55"
          >
            Premium AI consulting template with strong motion, depth and
            business-focused conversion sections.
          </p>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-white/35">
            Pages
          </p>

          <div className="mt-4 grid gap-2">
            {aelinePages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => onPageChange(page.id)}
                className="text-left text-sm font-bold text-white/60 transition hover:text-white"
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-white/35">
            Newsletter
          </p>

          <div className="mt-4 flex rounded-full border border-white/10 bg-white/5 p-1">
            <input
              placeholder="Email address"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm font-bold text-white outline-none placeholder:text-white/35"
            />

            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d8ff4f] text-black">
              <Mail className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function AelineShell({
  activePage,
  onPageChange,
  children,
}: {
  activePage: AelinePageId;
  onPageChange: (page: AelinePageId) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      data-template-id="aeline"
      className="min-h-screen overflow-hidden bg-white text-black [font-family:Inter,Arial,sans-serif]"
    >
      <Header activePage={activePage} onPageChange={onPageChange} />
      {children}
      <Footer onPageChange={onPageChange} />
    </div>
  );
}

function HomePage({
  onPageChange,
}: {
  onPageChange: (page: AelinePageId) => void;
}) {
  return (
    <main>
      <HeroSection onPageChange={onPageChange} />
      <AboutSection />
      <ServicesSection onPageChange={onPageChange} />
      <ExpertiseSection />
      <PricingSection onPageChange={onPageChange} />
      <TestimonialsSection />
      <BlogSection onPageChange={onPageChange} />
      <CtaSection onPageChange={onPageChange} />
    </main>
  );
}

function SimplePage({
  title,
  label,
  icon,
  children,
}: {
  title: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="bg-white px-6 pb-24 pt-40 text-black">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-black/55">
          {icon}
          {label}
        </div>

        <h1
          data-gjs-type="text"
          className="max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.08em] md:text-8xl"
        >
          {title}
        </h1>

        <div className="mt-12">{children}</div>
      </div>
    </main>
  );
}

export default function AelinePages({
  initialPage = "home",
}: AelinePagesProps) {
  const [activePage, setActivePage] = useState<AelinePageId>(initialPage);
  const siteRootRef = useRef<HTMLDivElement | null>(null);

  const content = useMemo(() => {
    if (activePage === "home") {
      return <HomePage onPageChange={setActivePage} />;
    }

    if (activePage === "services") {
      return (
        <SimplePage
          title="Comprehensive consulting and intelligent innovation"
          label="Services"
          icon={<Bot className="h-4 w-4" />}
        >
          <ServicesSection onPageChange={setActivePage} />
          <ExpertiseSection />
        </SimplePage>
      );
    }

    if (activePage === "about") {
      return (
        <SimplePage
          title="A global consulting partner dedicated to building smarter systems"
          label="About Us"
          icon={<Globe2 className="h-4 w-4" />}
        >
          <AboutSection />
        </SimplePage>
      );
    }

    if (activePage === "pricing") {
      return (
        <SimplePage
          title="Flexible plans for every stage of growth"
          label="Pricing"
          icon={<BarChart3 className="h-4 w-4" />}
        >
          <PricingSection onPageChange={setActivePage} />
        </SimplePage>
      );
    }

    if (activePage === "blog") {
      return (
        <SimplePage
          title="Latest insights and trends"
          label="Blog"
          icon={<DatabaseZap className="h-4 w-4" />}
        >
          <BlogSection onPageChange={setActivePage} />
        </SimplePage>
      );
    }

    return (
      <SimplePage
        title="Start your AI transformation"
        label="Contact"
        icon={<Mail className="h-4 w-4" />}
      >
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[34px] bg-black p-8 text-white">
            <h2
              data-gjs-type="text"
              className="text-4xl font-black tracking-[-0.06em]"
            >
              Let’s build something smarter
            </h2>

            <p
              data-gjs-type="text"
              className="mt-5 text-sm leading-7 text-white/55"
            >
              Add your contact details, scheduling link or CRM form here.
            </p>
          </div>

          <form className="grid gap-4 rounded-[34px] bg-[#f4f1e9] p-8">
            <input
              placeholder="Name"
              className="h-12 rounded-2xl border border-black/10 px-4 text-sm font-bold outline-none"
            />

            <input
              placeholder="Email"
              className="h-12 rounded-2xl border border-black/10 px-4 text-sm font-bold outline-none"
            />

            <textarea
              placeholder="Message"
              className="min-h-36 rounded-2xl border border-black/10 p-4 text-sm font-bold outline-none"
            />

            <button
              type="button"
              className="h-12 rounded-full bg-black text-sm font-black text-white"
            >
              Submit
            </button>
          </form>
        </div>
      </SimplePage>
    );
  }, [activePage]);

  return (
    <div ref={siteRootRef}>
      <AelineShell activePage={activePage} onPageChange={setActivePage}>
        {content}
      </AelineShell>
    </div>
  );
}