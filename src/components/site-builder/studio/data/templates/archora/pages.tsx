import React, { useEffect, useMemo, useRef, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { archoraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal, useCountUp } from "../shared/Reveal";
import { archoraEditorCss } from "./editorCss";

export const archoraPages = [{ id: "home", label: "בית", slug: "/" }];

type ArchoraPagesProps = {
  initialPage?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
  page?: string;
  pageId?: string;
  initialPageId?: string;
  activePageId?: string;
  currentPageId?: string;
};

function getValue(data: Record<string, any>, key: string) {
  const value = data?.[key];
  if (value === undefined || value === null || value === "") {
    return (archoraDefaultData as Record<string, any>)[key] ?? "";
  }
  return value;
}

function getImage(data: Record<string, any>, key: string) {
  return String(getValue(data, key) || (archoraDefaultData as Record<string, any>)[key]);
}

function getNumber(data: Record<string, any>, key: string) {
  const parsed = Number(getValue(data, key));
  return Number.isFinite(parsed) ? parsed : 0;
}

function CounterStat({
  target,
  label,
  suffix = "",
  delayMs = 0,
}: {
  target: number;
  label: string;
  suffix?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const value = useCountUp(target, active, 1500);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Reveal delayMs={delayMs} variant="scale">
      <div ref={ref} className="aspect-square border border-[#111]/20 bg-[#111] p-6 text-right text-[var(--p)] md:p-8">
        <strong className="ar-latin block text-5xl font-extrabold md:text-6xl">
          {value}
          {suffix}
        </strong>
        <p className="mt-6 text-sm font-semibold leading-7 text-white/78">{label}</p>
      </div>
    </Reveal>
  );
}

function Header({ data }: { data: Record<string, any> }) {
  const links = [
    [getValue(data, "navProjects"), "#projects"],
    [getValue(data, "navServices"), "#services"],
    [getValue(data, "navProcess"), "#process"],
    [getValue(data, "navContact"), "#contact"],
  ];

  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#111]/10 text-white backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <a href="#home" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center border border-[var(--p)] bg-[var(--p)] text-sm font-black text-[#111]">{getValue(data, "logoText")}</span>
          <span className="ar-latin text-2xl font-extrabold">{getValue(data, "brandName")}</span>
        </a>
        <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.24em] text-white/78 lg:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="relative pb-2 transition hover:text-[var(--p)] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-right after:scale-x-0 after:bg-[var(--p)] after:transition after:duration-300 hover:after:scale-x-100">
              {label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="border border-[var(--p)] px-5 py-3 text-sm font-bold text-[var(--p)] transition hover:bg-[var(--p)] hover:text-[#111]">
          {getValue(data, "heroPrimaryButton")}
        </a>
      </div>
    </header>
  );
}

function Hero({ data }: { data: Record<string, any> }) {
  return (
    <section id="home" data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden bg-[#111]">
      <img src={getImage(data, "heroImage")} alt="" className="ar-hero-image absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#111]/35 via-[#111]/52 to-[#111]" />
      <div className="absolute inset-0 ar-grid-noise opacity-45" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 lg:px-8 lg:pb-24">
        <Reveal variant="right" className="max-w-6xl text-right">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <div className="relative mt-5 inline-block">
            <span className="ar-slash absolute -left-5 top-2 h-[88%] w-5 bg-[var(--p)] md:-left-8 md:w-7" />
            <h1 className="ar-latin text-[clamp(3.8rem,12vw,9rem)] font-extrabold leading-[0.9] text-white">
              {getValue(data, "brandName")}
            </h1>
          </div>
          <h2 className="ar-display mt-8 max-w-3xl text-3xl font-extrabold leading-tight text-white md:text-5xl">{getValue(data, "heroTitle")}</h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 md:text-xl">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-9 flex flex-wrap justify-start gap-3">
            <a href="#contact" className="bg-[var(--p)] px-8 py-4 text-sm font-black text-[#111] transition hover:translate-y-[-3px] hover:bg-white">
              {getValue(data, "heroPrimaryButton")}
            </a>
            <a href="#projects" className="border border-white/25 px-8 py-4 text-sm font-bold text-white transition hover:border-[var(--p)] hover:text-[var(--p)]">
              {getValue(data, "heroSecondaryButton")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectMarquee({ data }: { data: Record<string, any> }) {
  const items = [
    getValue(data, "marqueeOne"),
    getValue(data, "marqueeTwo"),
    getValue(data, "marqueeThree"),
    getValue(data, "marqueeFour"),
    getValue(data, "marqueeFive"),
  ];

  return (
    <section data-template-section-type="marquee" className="overflow-hidden border-y border-[var(--p)] bg-[var(--p)] py-5 text-[#111]">
      <div className="ar-marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {[...items, ...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`} className="ar-display text-2xl font-extrabold md:text-4xl">
            {item}
            <span className="mx-8 inline-block h-3 w-3 bg-[#111]" />
          </span>
        ))}
      </div>
    </section>
  );
}

function Projects({ data }: { data: Record<string, any> }) {
  const projects = [
    {
      title: getValue(data, "projectOneTitle"),
      text: getValue(data, "projectOneText"),
      image: getImage(data, "projectOneImage"),
    },
    {
      title: getValue(data, "projectTwoTitle"),
      text: getValue(data, "projectTwoText"),
      image: getImage(data, "projectTwoImage"),
    },
    {
      title: getValue(data, "projectThreeTitle"),
      text: getValue(data, "projectThreeText"),
      image: getImage(data, "projectThreeImage"),
    },
    {
      title: getValue(data, "projectFourTitle"),
      text: getValue(data, "projectFourText"),
      image: getImage(data, "projectFourImage"),
    },
  ];

  return (
    <section id="projects" data-template-section-type="projects" className="bg-[#111] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "projectEyebrow")}</p>
          <h2 className="ar-display mx-auto mt-4 max-w-4xl text-3xl font-extrabold leading-tight text-white md:text-5xl">{getValue(data, "projectTitle")}</h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.title} delayMs={index * 90} variant="scale">
              <article className="ar-project-card group relative aspect-[4/3] overflow-hidden border border-white/12 bg-[#1A1A1A]">
                <img src={project.image} alt="" className="ar-project-img absolute inset-0 h-full w-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-right md:p-8">
                  <span className="bg-[var(--p)] px-3 py-1 text-xs font-black text-[#111]">0{index + 1}</span>
                  <h3 className="ar-display mt-4 text-2xl font-extrabold leading-tight text-white md:text-3xl">{project.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/78">{project.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Philosophy({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="philosophy" className="relative overflow-hidden bg-[#050505] px-5 py-20 lg:px-8 lg:py-24">
      <div className="absolute inset-0 ar-grid-noise opacity-20" />
      <Reveal className="relative z-10 mx-auto max-w-5xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.38em] text-[var(--p)]">{getValue(data, "philosophyEyebrow")}</p>
        <h2 className="ar-display mt-5 text-3xl font-extrabold leading-snug text-white md:text-5xl">
          {getValue(data, "philosophyTitle")}
        </h2>
        <p className="mx-auto mt-7 max-w-3xl text-lg leading-9 text-white/75">{getValue(data, "philosophyText")}</p>
        <a href="#contact" className="mt-10 inline-flex bg-[var(--p)] px-8 py-4 text-sm font-black text-[#111] transition hover:bg-white">
          {getValue(data, "heroPrimaryButton")}
        </a>
      </Reveal>
    </section>
  );
}

function Services({ data }: { data: Record<string, any> }) {
  const services = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
  ];

  return (
    <section id="services" data-template-section-type="services" className="bg-[#111] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "servicesEyebrow")}</p>
          <h2 className="ar-display mt-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">{getValue(data, "servicesTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {services.map(([title, text], index) => (
            <Reveal key={title} delayMs={index * 100}>
              <article className="ar-service-panel flex min-h-[240px] flex-col justify-between border border-white/12 p-7 text-right md:min-h-[260px] md:p-8">
                <span className="ar-latin text-2xl md:text-5xl font-extrabold text-[var(--p)]">0{index + 1}</span>
                <div>
                  <h3 className="text-2xl font-bold text-white md:text-3xl">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/72">{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  const stats = [
    [getNumber(data, "statOneNumber"), getValue(data, "statOneLabel"), ""],
    [getNumber(data, "statTwoNumber"), getValue(data, "statTwoLabel"), ""],
    [getNumber(data, "statThreeNumber"), getValue(data, "statThreeLabel"), "%"],
    [getNumber(data, "statFourNumber"), getValue(data, "statFourLabel"), ""],
  ] as const;

  return (
    <section data-template-section-type="stats" className="ar-lime-band bg-[var(--p)] px-5 py-20 text-[#111] lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
        <Reveal variant="right" className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.34em]">{getValue(data, "statsEyebrow")}</p>
          <h2 className="ar-display mt-4 text-4xl font-extrabold leading-tight md:text-6xl">מספרים עם הד.</h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map(([target, label, suffix], index) => (
            <CounterStat key={label} target={target} label={label} suffix={suffix} delayMs={index * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ data }: { data: Record<string, any> }) {
  const steps = [
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    [getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];

  return (
    <section id="process" data-template-section-type="process" className="relative bg-[#0A0A0A] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal variant="right" className="text-right">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="ar-display mt-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">{getValue(data, "processTitle")}</h2>
        </Reveal>
        <div className="relative">
          <div className="ar-timeline-line absolute bottom-0 right-5 top-0 w-px" />
          <div className="space-y-8">
            {steps.map(([title, text], index) => (
              <Reveal key={title} delayMs={index * 120} variant="left">
                <article className="relative pr-16 text-right">
                  <span className="ar-node absolute right-0 top-1 grid h-10 w-10 place-items-center border border-[var(--p)] bg-[#0A0A0A] text-xs font-black text-[var(--p)]">{index + 1}</span>
                  <div className="border border-white/12 bg-white/[0.03] p-6">
                    <h3 className="text-2xl font-bold text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/72">{text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact({ data }: { data: Record<string, any> }) {
  return (
    <section id="contact" data-template-section-type="contact" className="bg-[#111] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl overflow-hidden border border-white/12 bg-[#0A0A0A] lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal variant="right" className="min-h-[420px]">
          <div className="ar-project-card relative h-full min-h-[420px] overflow-hidden">
            <img src={getImage(data, "contactImage")} alt="" className="ar-project-img h-full w-full object-cover opacity-78" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
            <div className="absolute bottom-0 right-0 p-8 text-right">
              <p className="text-sm font-bold text-[var(--p)]">{getValue(data, "phone")}</p>
              <p className="mt-2 text-sm text-white/72">{getValue(data, "email")}</p>
              <p className="mt-2 text-sm text-white/72">{getValue(data, "address")}</p>
            </div>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120} className="p-6 text-right md:p-10 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-[var(--p)]">brief intake</p>
          <h2 className="ar-display mt-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-5 text-base leading-8 text-white/72">{getValue(data, "contactText")}</p>
          <form className="mt-8 grid gap-4" data-bizuply-block="lead-form" data-bizuply-form-id="archora-contact-1" data-bizuply-crm-lead="true" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.">
            <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  className="ar-field px-4 py-4" placeholder="שם מלא" />
            <input name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel"  className="ar-field px-4 py-4" placeholder="טלפון" />
            <input className="ar-field px-4 py-4" placeholder="סוג הנכס / מיקום" />
            <textarea name="message" data-bizuply-form-field-id="message"  className="ar-field min-h-[132px] px-4 py-4" placeholder="ספרו לנו מה חייב לקרות בחלל" />
            <button type="button" className="bg-[var(--p)] px-7 py-4 text-sm font-black text-[#111] transition hover:bg-white">
              {getValue(data, "contactButton")}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer data-template-section-type="footer" className="bg-[var(--p)] px-5 py-16 text-[#111] lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 text-center">
        <Reveal>
          <p className="ar-latin text-4xl font-extrabold md:text-6xl">{getValue(data, "brandName")}</p>
          <h2 className="ar-display mt-4 text-3xl font-extrabold leading-tight md:text-5xl">{getValue(data, "ctaTitle")}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-8 text-[#111]/80">{getValue(data, "ctaText")}</p>
        </Reveal>
        <Reveal delayMs={120}>
          <a href="#contact" className="ar-cta-btn px-10 py-5 text-base">
            {getValue(data, "ctaButton")}
          </a>
          <p className="mt-5 text-sm font-bold">{getValue(data, "email")} / {getValue(data, "phone")}</p>
        </Reveal>
      </div>
    </footer>
  );
}

export default function ArchoraPages({ initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId }: ArchoraPagesProps) {
  const mergedData = useMemo(() => ({ ...archoraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "archora-preview" : "archora"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: archoraEditorCss }} />
      <VisualPageStack activePageId={currentPage} pages={[{ id: "home", content: (
        <>
          <Header data={mergedData} />
          <Hero data={mergedData} />
          <ProjectMarquee data={mergedData} />
          <Projects data={mergedData} />
          <Philosophy data={mergedData} />
          <Services data={mergedData} />
          <Stats data={mergedData} />
          <Process data={mergedData} />
          <Contact data={mergedData} />
          <Footer data={mergedData} />
        </>
      ) }]} />
    </div>
  );
}
