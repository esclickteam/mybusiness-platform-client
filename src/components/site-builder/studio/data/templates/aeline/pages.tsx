import React, { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CheckCircle2,
  DatabaseZap,
  Globe2,
  Mail,
  Menu,
  Quote,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

import {
  aelineImages,
  aelinePlans,
  aelineServices,
} from "./aelineData";

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
  { id: "about", name: "About", slug: "/about" },
  { id: "pricing", name: "Pricing", slug: "/pricing" },
  { id: "blog", name: "Blog", slug: "/blog" },
  { id: "contact", name: "Contact", slug: "/contact" },
];

type AelinePagesProps = {
  initialPage?: AelinePageId;
  isStudioStatic?: boolean;
};

const navItems: Array<{ id: AelinePageId; label: string }> = [
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "pricing", label: "Pricing" },
  { id: "blog", label: "Blog" },
];

const logos = [
  "NOVA",
  "CLOUDLY",
  "VERTEX",
  "UPSHIFT",
  "ATLAS",
  "FLOWAI",
  "NEURAL",
  "STACK",
];

const posts = [
  {
    title: "Turning data into strategic decisions",
    text: "How modern teams can move from messy information to clear growth systems.",
  },
  {
    title: "5 automations every business should build",
    text: "Simple operational flows that save time and improve customer experience.",
  },
  {
    title: "Human + AI: the practical balance",
    text: "A useful framework for adopting intelligent tools without losing clarity.",
  },
];

function PageButton({
  children,
  onClick,
  variant = "dark",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "dark" | "light";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-editable-link="true"
      className={[
        "inline-flex h-12 items-center justify-center gap-3 rounded-full px-6 text-sm font-black transition active:scale-[0.98]",
        variant === "dark"
          ? "bg-black text-white hover:-translate-y-1 hover:bg-[#3dff88] hover:text-black"
          : "border border-black/15 bg-white text-black hover:-translate-y-1 hover:border-black",
      ].join(" ")}
    >
      {children}
    </button>
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      data-template-id="aeline"
      className="min-h-screen bg-[#f4f1e9] text-black [font-family:Inter,Arial,sans-serif]"
    >
      <header
        data-section-kind="header"
        data-section-title="Header"
        className="sticky top-0 z-50 border-b border-black/10 bg-[#f4f1e9]/90 px-5 py-4 backdrop-blur-2xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 rounded-full border border-black/10 bg-white/80 px-5 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
          <button
            type="button"
            onClick={() => onPageChange("home")}
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <span
              data-gjs-type="text"
              className="text-xl font-black tracking-[-0.05em]"
            >
              Aeline
            </span>
          </button>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onPageChange(item.id)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-bold transition",
                  activePage === item.id
                    ? "bg-black text-white"
                    : "text-black/55 hover:bg-black/5 hover:text-black",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <PageButton onClick={() => onPageChange("contact")} variant="light">
              Contact
            </PageButton>
            <PageButton onClick={() => onPageChange("contact")}>
              Get Started
              <ArrowRight className="h-4 w-4" />
            </PageButton>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="mx-auto mt-3 grid max-w-7xl gap-2 rounded-[28px] border border-black/10 bg-white p-3 lg:hidden">
            {[{ id: "home" as const, label: "Home" }, ...navItems].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onPageChange(item.id);
                  setMobileOpen(false);
                }}
                className="rounded-2xl px-4 py-3 text-left text-sm font-black hover:bg-black/5"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {children}

      <footer
        data-section-kind="footer"
        data-section-title="Footer"
        className="border-t border-black/10 bg-black px-6 py-14 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3dff88] text-black">
                <Sparkles className="h-5 w-5" />
              </span>
              <p className="text-2xl font-black tracking-[-0.05em]">Aeline</p>
            </div>
            <p
              data-gjs-type="text"
              className="mt-5 max-w-md text-sm leading-7 text-white/55"
            >
              A premium AI consulting template for teams that want to present strategy,
              automation and data services with confidence.
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
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3dff88] text-black">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ onPageChange }: { onPageChange: (page: AelinePageId) => void }) {
  return (
    <main>
      <section
        data-section-kind="hero"
        data-section-title="Hero"
        className="relative overflow-hidden px-6 py-20 lg:py-28"
      >
        <div className="absolute left-10 top-28 h-28 w-28 rounded-full bg-[#3dff88]/50 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-black/55">
              <BrainCircuit className="h-4 w-4" />
              AI Consulting Studio
            </div>

            <h1
              data-gjs-type="text"
              className="max-w-4xl text-6xl font-black leading-[0.88] tracking-[-0.08em] text-black md:text-8xl"
            >
              Building the future with AI and strategy
            </h1>

            <p
              data-gjs-type="text"
              className="mt-7 max-w-2xl text-lg font-medium leading-8 text-black/55"
            >
              Help organizations unlock growth, efficiency and better decisions
              through automation, data systems and intelligent consulting.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <PageButton onClick={() => onPageChange("contact")}>
                Get Started
                <ArrowRight className="h-4 w-4" />
              </PageButton>
              <PageButton onClick={() => onPageChange("services")} variant="light">
                View Services
              </PageButton>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <div className="rounded-[24px] border border-black/10 bg-white px-5 py-4">
                <p className="text-3xl font-black tracking-[-0.06em]">120+</p>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">
                  Projects
                </p>
              </div>
              <div className="rounded-[24px] border border-black/10 bg-white px-5 py-4">
                <p className="text-3xl font-black tracking-[-0.06em]">98%</p>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">
                  Satisfaction
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aeline-orb absolute -left-8 top-10 z-10 rounded-[32px] bg-black p-5 text-white shadow-[0_25px_80px_rgba(0,0,0,0.22)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
                Performance
              </p>
              <p className="mt-2 text-4xl font-black">+49%</p>
            </div>

            <div className="aeline-orb-delay absolute -right-4 bottom-10 z-10 rounded-[32px] bg-[#3dff88] p-5 text-black shadow-[0_25px_80px_rgba(0,0,0,0.14)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-black/45">
                Automation
              </p>
              <p className="mt-2 text-4xl font-black">520k</p>
            </div>

            <div className="overflow-hidden rounded-[48px] border border-black/10 bg-white p-3 shadow-[0_35px_100px_rgba(0,0,0,0.12)]">
              <img
                data-gjs-type="image"
                src={aelineImages.hero}
                alt="AI strategy"
                className="h-[620px] w-full rounded-[38px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        data-section-kind="logos"
        data-section-title="Trusted Logos"
        className="overflow-hidden border-y border-black/10 bg-white py-5"
      >
        <div className="aeline-marquee-track flex w-max gap-10 whitespace-nowrap">
          {[...logos, ...logos].map((logo, index) => (
            <span
              key={`${logo}-${index}`}
              className="text-2xl font-black tracking-[-0.06em] text-black/25"
            >
              {logo}
            </span>
          ))}
        </div>
      </section>

      <ServicesSection onPageChange={onPageChange} />
      <ExpertiseSection />
      <PricingSection onPageChange={onPageChange} />
      <TestimonialsSection />
      <BlogSection onPageChange={onPageChange} />
      <CtaSection onPageChange={onPageChange} />
    </main>
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
      className="px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-black/35">
              Services
            </p>
            <h2
              data-gjs-type="text"
              className="mt-4 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.07em] text-black md:text-7xl"
            >
              Consulting and intelligent innovation
            </h2>
          </div>

          <PageButton onClick={() => onPageChange("contact")}>
            Start Project
            <ArrowRight className="h-4 w-4" />
          </PageButton>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {aelineServices.map((service) => (
            <article
              key={service.title}
              data-section-kind="service-card"
              data-section-title={service.title}
              className="group rounded-[38px] border border-black/10 bg-white p-8 shadow-[0_18px_60px_rgba(0,0,0,0.05)] transition hover:-translate-y-2 hover:bg-black hover:text-white"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-black/35 group-hover:text-white/35">
                  {service.number}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3dff88] text-black">
                  <Zap className="h-5 w-5" />
                </span>
              </div>
              <h3 data-gjs-type="text" className="mt-16 text-3xl font-black tracking-[-0.05em]">
                {service.title}
              </h3>
              <p data-gjs-type="text" className="mt-4 text-sm leading-7 text-black/55 group-hover:text-white/55">
                {service.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpertiseSection() {
  return (
    <section
      data-section-kind="expertise"
      data-section-title="Expertise"
      className="px-6 py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-[44px] border border-black/10 bg-white p-3">
          <img
            data-gjs-type="image"
            src={aelineImages.dashboard}
            alt="Dashboard"
            className="h-[560px] w-full rounded-[34px] object-cover"
          />
        </div>

        <div className="rounded-[44px] bg-black p-8 text-white lg:p-12">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-white/35">
            Expertise
          </p>
          <h2
            data-gjs-type="text"
            className="mt-5 text-5xl font-black leading-[0.96] tracking-[-0.07em] md:text-7xl"
          >
            Where human insight meets intelligent technology
          </h2>
          <p data-gjs-type="text" className="mt-7 max-w-2xl text-base leading-8 text-white/55">
            Use this section to explain the value of your strategy, systems and
            delivery process. Every card, image and text is editable.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              ["Automation", "Save time through connected workflows."],
              ["Analytics", "See business performance clearly."],
              ["Strategy", "Prioritize what creates measurable results."],
              ["Implementation", "Launch systems that the team can use."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <CheckCircle2 className="h-5 w-5 text-[#3dff88]" />
                <h3 data-gjs-type="text" className="mt-4 text-xl font-black">
                  {title}
                </h3>
                <p data-gjs-type="text" className="mt-2 text-sm leading-6 text-white/50">
                  {text}
                </p>
              </div>
            ))}
          </div>
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
      className="px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-black/35">
            Pricing
          </p>
          <h2
            data-gjs-type="text"
            className="mx-auto mt-4 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl"
          >
            Flexible plans for every stage of growth
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {aelinePlans.map((plan, index) => (
            <article
              key={plan.name}
              className={[
                "rounded-[38px] border p-8 shadow-[0_18px_60px_rgba(0,0,0,0.05)]",
                index === 1
                  ? "border-black bg-black text-white"
                  : "border-black/10 bg-white text-black",
              ].join(" ")}
            >
              <p className="text-sm font-black uppercase tracking-[0.22em] opacity-45">
                {plan.name}
              </p>
              <h3 data-gjs-type="text" className="mt-8 text-5xl font-black tracking-[-0.07em]">
                {plan.price}
              </h3>
              <p data-gjs-type="text" className="mt-3 text-sm leading-7 opacity-55">
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
      className="px-6 py-24"
    >
      <div className="mx-auto max-w-7xl rounded-[48px] border border-black/10 bg-white p-8 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Quote className="h-10 w-10 text-[#3dff88]" />
            <h2 data-gjs-type="text" className="mt-5 text-5xl font-black tracking-[-0.07em]">
              What clients say
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              "The strategy gave our team a clear path from ideas to action.",
              "The automation work helped us move faster without adding complexity.",
              "We finally understand our data and what to do next.",
              "A practical, sharp and modern consulting experience.",
            ].map((text, index) => (
              <article key={index} className="rounded-[30px] bg-[#f4f1e9] p-6">
                <p data-gjs-type="text" className="text-sm leading-7 text-black/60">
                  “{text}”
                </p>
                <p className="mt-5 text-sm font-black text-black">
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
    <section data-section-kind="blog" data-section-title="Blog" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-black/35">
              Blog
            </p>
            <h2 data-gjs-type="text" className="mt-4 text-5xl font-black tracking-[-0.07em]">
              Latest insights and trends
            </h2>
          </div>
          <PageButton onClick={() => onPageChange("blog")} variant="light">
            View All
          </PageButton>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article key={post.title} className="overflow-hidden rounded-[36px] border border-black/10 bg-white">
              <img
                data-gjs-type="image"
                src={[aelineImages.abstract, aelineImages.meeting, aelineImages.team][index]}
                alt={post.title}
                className="h-64 w-full object-cover"
              />
              <div className="p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-black/35">
                  Insight
                </p>
                <h3 data-gjs-type="text" className="mt-4 text-2xl font-black tracking-[-0.05em]">
                  {post.title}
                </h3>
                <p data-gjs-type="text" className="mt-3 text-sm leading-7 text-black/55">
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
    <section data-section-kind="cta" data-section-title="CTA" className="px-6 py-24">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[48px] bg-black text-white lg:grid-cols-[1fr_0.8fr]">
        <div className="p-8 lg:p-14">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-white/35">
            Start now
          </p>
          <h2 data-gjs-type="text" className="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl">
            Build smarter systems for your business
          </h2>
          <p data-gjs-type="text" className="mt-6 max-w-2xl text-base leading-8 text-white/55">
            Use this final section to collect leads, book calls or send visitors
            to your contact page.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={() => onPageChange("contact")}
              className="inline-flex h-12 items-center gap-3 rounded-full bg-[#3dff88] px-6 text-sm font-black text-black transition hover:-translate-y-1"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <img
          data-gjs-type="image"
          src={aelineImages.team}
          alt="Team"
          className="h-full min-h-[420px] w-full object-cover"
        />
      </div>
    </section>
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
    <main className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-black/55">
          {icon}
          {label}
        </div>

        <h1 data-gjs-type="text" className="max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.08em] md:text-8xl">
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
    if (activePage === "home") return <HomePage onPageChange={setActivePage} />;

    if (activePage === "services") {
      return (
        <SimplePage title="AI services and automation" label="Services" icon={<Bot className="h-4 w-4" />}>
          <ServicesSection onPageChange={setActivePage} />
          <ExpertiseSection />
        </SimplePage>
      );
    }

    if (activePage === "about") {
      return (
        <SimplePage title="Human strategy meets artificial intelligence" label="About" icon={<Globe2 className="h-4 w-4" />}>
          <div className="grid gap-6 lg:grid-cols-2">
            <img data-gjs-type="image" src={aelineImages.team} alt="Team" className="h-[560px] rounded-[44px] object-cover" />
            <div className="rounded-[44px] bg-white p-10">
              <h2 data-gjs-type="text" className="text-4xl font-black tracking-[-0.06em]">A consulting partner for smarter operations</h2>
              <p data-gjs-type="text" className="mt-5 text-base leading-8 text-black/55">
                Replace this text with your real story, process, team and business promise.
              </p>
            </div>
          </div>
        </SimplePage>
      );
    }

    if (activePage === "pricing") {
      return (
        <SimplePage title="Flexible plans for every stage" label="Pricing" icon={<BarChart3 className="h-4 w-4" />}>
          <PricingSection onPageChange={setActivePage} />
        </SimplePage>
      );
    }

    if (activePage === "blog") {
      return (
        <SimplePage title="Latest insights and trends" label="Blog" icon={<DatabaseZap className="h-4 w-4" />}>
          <BlogSection onPageChange={setActivePage} />
        </SimplePage>
      );
    }

    return (
      <SimplePage title="Start your transformation" label="Contact" icon={<Mail className="h-4 w-4" />}>
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[40px] bg-black p-8 text-white">
            <h2 data-gjs-type="text" className="text-4xl font-black tracking-[-0.06em]">Let’s build something smarter</h2>
            <p data-gjs-type="text" className="mt-5 text-sm leading-7 text-white/55">
              Add your contact details, scheduling link or CRM form here.
            </p>
          </div>
          <form className="grid gap-4 rounded-[40px] bg-white p-8">
            <input placeholder="Name" className="h-12 rounded-2xl border border-black/10 px-4 text-sm font-bold outline-none" />
            <input placeholder="Email" className="h-12 rounded-2xl border border-black/10 px-4 text-sm font-bold outline-none" />
            <textarea placeholder="Message" className="min-h-36 rounded-2xl border border-black/10 p-4 text-sm font-bold outline-none" />
            <button type="button" className="h-12 rounded-full bg-black text-sm font-black text-white">
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