import React, { useEffect, useMemo, useRef, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { autovoltDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal, useCountUp } from "../shared/Reveal";
import { autovoltEditorCss } from "./editorCss";

export const autovoltPages = [{ id: "home", label: "בית", slug: "/" }];

type AutovoltPagesProps = {
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
  return data?.[key] ?? (autovoltDefaultData as Record<string, any>)[key] ?? "";
}

function CountPanel({ target, suffix, label, delayMs }: { target: number; suffix: string; label: string; delayMs: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const value = useCountUp(target, enabled, 1400);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setEnabled(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEnabled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Reveal delayMs={delayMs} variant="up">
      <div ref={ref} className="av-counter aspect-square border border-[var(--blue)]/45 bg-[#0D141C] p-6">
        <span className="t-display block text-7xl font-bold uppercase leading-none text-[var(--blue)] md:text-8xl">
          {value}{suffix}
        </span>
        <p className="mt-5 max-w-[12rem] text-sm font-bold uppercase tracking-[0.22em] text-white/68">{label}</p>
      </div>
    </Reveal>
  );
}

function Header({ data, goHome }: { data: Record<string, any>; goHome: () => void }) {
  const links = [
    [getValue(data, "navServices"), "#services"],
    [getValue(data, "navProcess"), "#process"],
    [getValue(data, "navPackages"), "#packages"],
    [getValue(data, "navBooking"), "#booking"],
  ];

  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="fixed inset-x-0 top-0 z-50 border-b border-[var(--blue)]/25 bg-[#0A0F14]/88 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={goHome} className="flex items-center gap-3" aria-label={getValue(data, "brandName")}>
          <span className="av-logo-slash grid h-11 w-11 place-items-center border border-[var(--blue)] text-sm font-black text-[var(--blue)]">{getValue(data, "logoText")}</span>
          <span className="t-display text-3xl font-bold uppercase leading-none tracking-[0.03em]">{getValue(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-7 text-xs font-bold uppercase tracking-[0.22em] text-white/62 lg:flex" aria-label="ניווט ראשי">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="transition hover:text-[var(--blue)]">
              {label}
            </a>
          ))}
        </nav>
        <a href="#booking" className="bg-[var(--blue)] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#0A0F14] transition hover:bg-white">
          {getValue(data, "heroPrimaryButton")}
        </a>
      </div>
    </header>
  );
}

function Hero({ data }: { data: Record<string, any> }) {
  return (
    <section id="home" data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden bg-[var(--dark)]">
      <img src={getValue(data, "heroImage")} alt="" className="av-hero-car absolute inset-0 h-full w-full object-cover opacity-74" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0A0F14_0%,rgba(10,15,20,0.9)_28%,rgba(10,15,20,0.22)_78%),linear-gradient(180deg,rgba(56,189,248,0.18),#0A0F14_96%)]" />
      <div className="av-blue-scan absolute inset-x-0 top-1/2 h-px bg-[var(--blue)]/70" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 lg:px-8 lg:pb-24">
        <Reveal variant="right" className="max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.5em] text-[var(--blue)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="t-display av-hero-title mt-5 whitespace-pre-line text-[20vw] font-bold uppercase leading-[0.72] tracking-[-0.05em] text-white md:text-[14vw] lg:text-[11rem]">
            {getValue(data, "heroTitle")}
          </h1>
          <div className="mt-8 grid gap-6 border-y border-[var(--blue)]/25 py-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <p className="max-w-2xl text-lg font-semibold leading-8 text-white/70 md:text-xl">{getValue(data, "heroSubtitle")}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#booking" className="bg-[var(--blue)] px-8 py-4 text-sm font-black uppercase tracking-[0.22em] text-[#0A0F14] transition hover:bg-white">
                {getValue(data, "heroPrimaryButton")}
              </a>
              <a href="#services" className="border border-white/25 px-8 py-4 text-sm font-bold uppercase tracking-[0.22em] text-white transition hover:border-[var(--blue)] hover:text-[var(--blue)]">
                {getValue(data, "heroSecondaryButton")}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Services({ data }: { data: Record<string, any> }) {
  const services = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText"), getValue(data, "serviceOnePrice")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText"), getValue(data, "serviceTwoPrice")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText"), getValue(data, "serviceThreePrice")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText"), getValue(data, "serviceFourPrice")],
  ];

  return (
    <section id="services" data-template-section-type="services" className="bg-[var(--dark)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.42em] text-[var(--blue)]">{getValue(data, "servicesEyebrow")}</p>
            <h2 className="t-display mt-3 text-6xl font-bold uppercase leading-none text-white md:text-8xl">{getValue(data, "sectionServicesTitle")}</h2>
          </div>
          <p className="max-w-2xl text-lg font-semibold leading-8 text-white/58">{getValue(data, "servicesIntro")}</p>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map(([title, text, price], index) => (
            <Reveal key={title} delayMs={index * 90} variant="scale">
              <article className="av-chrome-card group flex aspect-square flex-col justify-between border border-white/14 p-6">
                <div className="flex items-start justify-between">
                  <span className="t-display text-6xl font-bold leading-none text-white/18">0{index + 1}</span>
                  <span className="border border-[var(--blue)]/45 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--blue)]">chrome</span>
                </div>
                <div>
                  <h3 className="t-display text-4xl font-bold uppercase leading-none text-white">{title}</h3>
                  <p className="mt-4 text-sm font-semibold leading-6 text-white/58">{text}</p>
                </div>
                <strong className="t-display text-right text-6xl font-bold leading-none text-[var(--blue)]">{price}</strong>
              </article>
            </Reveal>
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
    <section id="process" data-template-section-type="process" className="bg-[#070B10] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-14">
          <h2 className="t-display text-6xl font-bold uppercase leading-none text-white md:text-8xl">{getValue(data, "sectionProcessTitle")}</h2>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-4">
          {steps.map(([title, text], index) => (
            <Reveal key={title} delayMs={index * 100} variant="up">
              <article className="av-process-step relative min-h-[270px] border border-[var(--blue)]/28 bg-[var(--surface)] p-6">
                <span className="grid h-14 w-14 place-items-center bg-[var(--blue)] text-xl font-black text-[#0A0F14]">0{index + 1}</span>
                <h3 className="t-display mt-10 text-4xl font-bold uppercase leading-none text-white">{title}</h3>
                <p className="mt-5 text-sm font-semibold leading-7 text-white/58">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfter({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="comparison" className="bg-[var(--dark)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.42em] text-[var(--blue)]">{getValue(data, "beforeAfterEyebrow")}</p>
            <h2 className="t-display mt-3 text-6xl font-bold uppercase leading-none text-white md:text-8xl">{getValue(data, "sectionBeforeAfterTitle")}</h2>
          </div>
          <p className="max-w-md text-sm font-semibold uppercase leading-7 tracking-wide text-white/58">{getValue(data, "beforeAfterText")}</p>
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal variant="right">
            <figure className="relative aspect-square overflow-hidden border border-white/14">
              <img src={getValue(data, "beforeImage")} alt="" className="h-full w-full object-cover grayscale" />
              <figcaption className="absolute right-0 top-0 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.24em] text-[#0A0F14]">{getValue(data, "beforeLabel")}</figcaption>
            </figure>
          </Reveal>
          <Reveal variant="left" delayMs={120}>
            <figure className="relative aspect-square overflow-hidden border border-[var(--blue)]">
              <img src={getValue(data, "afterImage")} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,rgba(56,189,248,0.18),transparent_36%)]" />
              <figcaption className="absolute left-0 top-0 bg-[var(--blue)] px-5 py-3 text-xs font-black uppercase tracking-[0.24em] text-[#0A0F14]">{getValue(data, "afterLabel")}</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Packages({ data }: { data: Record<string, any> }) {
  const packages = [
    [getValue(data, "packageOneTitle"), getValue(data, "packageOnePrice"), getValue(data, "packageOneText"), getValue(data, "packageOneFeature")],
    [getValue(data, "packageTwoTitle"), getValue(data, "packageTwoPrice"), getValue(data, "packageTwoText"), getValue(data, "packageTwoFeature")],
  ];

  return (
    <section id="packages" data-template-section-type="packages" className="bg-[#070B10] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="t-display text-6xl font-bold uppercase leading-none text-white md:text-8xl">{getValue(data, "sectionPackagesTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {packages.map(([title, price, text, feature], index) => (
            <Reveal key={title} delayMs={index * 120} variant="scale">
              <article className="av-tier group relative aspect-square overflow-hidden border border-[var(--blue)]/35 bg-[var(--surface)] p-8 md:p-10">
                <span className="text-xs font-black uppercase tracking-[0.32em] text-[var(--blue)]">tier 0{index + 1}</span>
                <h3 className="t-display mt-8 text-6xl font-bold uppercase leading-none text-white md:text-8xl">{title}</h3>
                <p className="mt-6 max-w-md text-base font-semibold leading-8 text-white/62">{text}</p>
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between gap-5 border-t border-white/14 pt-6">
                  <strong className="t-display text-7xl font-bold leading-none text-[var(--blue)]">{price}</strong>
                  <span className="max-w-[14rem] text-right text-sm font-black uppercase tracking-[0.2em] text-white/70">{feature}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ data }: { data: Record<string, any> }) {
  const strips = [
    [getValue(data, "galleryOneImage"), getValue(data, "galleryOneTitle")],
    [getValue(data, "galleryTwoImage"), getValue(data, "galleryTwoTitle")],
    [getValue(data, "galleryThreeImage"), getValue(data, "galleryThreeTitle")],
  ];

  return (
    <section data-template-section-type="gallery" className="bg-[var(--dark)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-end">
          <h2 className="t-display text-6xl font-bold uppercase leading-none text-white md:text-8xl">{getValue(data, "sectionGalleryTitle")}</h2>
          <p className="max-w-lg justify-self-end text-sm font-semibold uppercase leading-7 tracking-wide text-white/58">{getValue(data, "galleryText")}</p>
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {strips.map(([image, title], index) => (
            <Reveal key={title} delayMs={index * 100} variant="up">
              <figure className="group relative h-[640px] overflow-hidden border border-white/14 bg-[var(--surface)]">
                <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F14] via-transparent to-transparent" />
                <figcaption className="absolute bottom-0 right-0 w-full border-t border-[var(--blue)] bg-[#0A0F14]/82 px-6 py-5 text-xs font-black uppercase tracking-[0.3em] text-[var(--blue)] backdrop-blur">
                  {title}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counters({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="stats" className="bg-[var(--blue)] px-5 py-20 text-[#0A0F14] lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.42em]">{getValue(data, "statsEyebrow")}</p>
          <h2 className="t-display mt-3 text-6xl font-bold uppercase leading-none md:text-8xl">{getValue(data, "sectionStatsTitle")}</h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          <CountPanel target={Number(getValue(data, "statOneNumber"))} suffix={getValue(data, "statOneSuffix")} label={getValue(data, "statOneLabel")} delayMs={0} />
          <CountPanel target={Number(getValue(data, "statTwoNumber"))} suffix={getValue(data, "statTwoSuffix")} label={getValue(data, "statTwoLabel")} delayMs={100} />
          <CountPanel target={Number(getValue(data, "statThreeNumber"))} suffix={getValue(data, "statThreeSuffix")} label={getValue(data, "statThreeLabel")} delayMs={200} />
        </div>
      </div>
    </section>
  );
}

function Booking({ data }: { data: Record<string, any> }) {
  return (
    <section id="booking" data-template-section-type="contact" className="bg-[#070B10] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal variant="right" className="border border-[var(--blue)]/35 bg-[var(--surface)] p-8 lg:p-10">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-[var(--blue)]">{getValue(data, "bookingEyebrow")}</p>
          <h2 className="t-display mt-4 text-6xl font-bold uppercase leading-none text-white md:text-8xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-6 text-base font-semibold leading-8 text-white/62">{getValue(data, "contactText")}</p>
          <a href={`tel:${getValue(data, "phone")}`} className="t-display mt-10 block text-6xl font-bold uppercase leading-none text-[var(--blue)] md:text-7xl">{getValue(data, "phone")}</a>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <form className="grid gap-4 border border-white/14 bg-[#0A0F14] p-6 shadow-[0_30px_90px_rgba(56,189,248,0.12)] lg:p-10">
            <div className="grid gap-4 md:grid-cols-2">
              <input className="border border-white/14 bg-[var(--surface)] px-5 py-4 text-right font-bold text-white outline-none transition placeholder:text-white/34 focus:border-[var(--blue)]" placeholder="שם מלא" />
              <input className="border border-white/14 bg-[var(--surface)] px-5 py-4 text-right font-bold text-white outline-none transition placeholder:text-white/34 focus:border-[var(--blue)]" placeholder="טלפון" />
            </div>
            <input className="border border-white/14 bg-[var(--surface)] px-5 py-4 text-right font-bold text-white outline-none transition placeholder:text-white/34 focus:border-[var(--blue)]" placeholder="דגם הרכב" />
            <select className="border border-white/14 bg-[var(--surface)] px-5 py-4 text-right font-bold text-white outline-none transition focus:border-[var(--blue)]" defaultValue="">
              <option value="" disabled>בחרו חבילה</option>
              <option>{getValue(data, "packageOneTitle")}</option>
              <option>{getValue(data, "packageTwoTitle")}</option>
            </select>
            <textarea className="min-h-[140px] border border-white/14 bg-[var(--surface)] px-5 py-4 text-right font-bold text-white outline-none transition placeholder:text-white/34 focus:border-[var(--blue)]" placeholder="מה מצב הצבע ומה חשוב לכם?" />
            <button type="button" className="bg-[var(--blue)] px-8 py-4 text-sm font-black uppercase tracking-[0.24em] text-[#0A0F14] transition hover:bg-white">
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
    <footer data-template-section-type="footer" className="bg-[var(--dark)] px-5 py-16 text-white lg:px-8">
      <Reveal className="mx-auto flex max-w-7xl flex-col justify-between gap-8 border-y border-[var(--blue)]/35 py-10 md:flex-row md:items-center">
        <div>
          <p className="t-display text-7xl font-bold uppercase leading-none md:text-9xl">{getValue(data, "ctaTitle")}</p>
          <p className="mt-4 max-w-xl text-sm font-bold uppercase tracking-[0.18em] text-white/52">{getValue(data, "ctaText")}</p>
        </div>
        <a href="#booking" className="border-2 border-[var(--blue)] px-9 py-4 text-sm font-black uppercase tracking-[0.24em] text-[var(--blue)] transition hover:bg-[var(--blue)] hover:text-[#0A0F14]">
          {getValue(data, "ctaButton")}
        </a>
      </Reveal>
    </footer>
  );
}

export default function AutovoltPages({ initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId }: AutovoltPagesProps) {
  const mergedData = useMemo(() => ({ ...autovoltDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );

  const content = (
    <>
      <Header data={mergedData} goHome={() => goTo("home")} />
      <Hero data={mergedData} />
      <Services data={mergedData} />
      <Process data={mergedData} />
      <BeforeAfter data={mergedData} />
      <Packages data={mergedData} />
      <Gallery data={mergedData} />
      <Counters data={mergedData} />
      <Booking data={mergedData} />
      <Footer data={mergedData} />
    </>
  );

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "autovolt-preview" : "autovolt"} className="min-h-screen w-full overflow-x-hidden bg-[var(--dark)]">
      <style dangerouslySetInnerHTML={{ __html: autovoltEditorCss }} />
      <VisualPageStack activePageId={currentPage} pages={[{ id: "home", content }]} />
    </div>
  );
}
