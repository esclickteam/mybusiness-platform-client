import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { markoraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { markoraEditorCss } from "./editorCss";

export const markoraPages = [{ id: "home", label: "בית", slug: "/" }];

type MarkoraPagesProps = {
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
  return data?.[key] ?? (markoraDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  const links = [
    [getValue(data, "navServices"), "#services"],
    [getValue(data, "sectionFourTitle"), "#campaigns"],
    [getValue(data, "sectionFiveTitle"), "#process"],
    [getValue(data, "navContact"), "#contact"],
  ];

  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[var(--bg)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <a href="#" className="grid h-10 w-10 place-items-center border border-[var(--p)] bg-[var(--p)] text-sm font-black text-white" aria-label={getValue(data, "brandName")}>
          {getValue(data, "logoText")}
        </a>
        <nav className="hidden items-center gap-7 text-sm font-bold text-white/70 lg:flex" aria-label="ניווט ראשי">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="m-nav-link">
              {label}
            </a>
          ))}
        </nav>
        <button type="button" onClick={openModal} className="border border-[var(--p)] bg-[var(--p)] px-5 py-3 text-sm font-black text-white transition hover:bg-transparent hover:text-[var(--p)]">
          {getValue(data, "heroPrimaryButton")}
        </button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden bg-[var(--bg)] pt-20">
      <div className="m-hero-grid absolute inset-0 opacity-40" />
      <div className="m-diagonal absolute -left-28 top-12 h-[120vh] w-24 bg-[var(--p)] opacity-90" />
      <div dir="ltr" className="relative z-10 mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl gap-10 px-5 py-12 lg:grid-cols-2 lg:items-center lg:px-8">
        <div dir="rtl" className="lg:col-start-1 lg:row-start-1">
          <p className="m-hero-in text-xs font-black uppercase tracking-[0.36em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <p className="t-display m-chaos m-hero-in m-d1 mt-4 text-[18vw] font-black uppercase leading-[0.75] tracking-[-0.12em] text-white md:text-[9rem] lg:text-[10.5rem]">
            {getValue(data, "brandName")}
          </p>
          <h1 className="t-display m-hero-in m-d2 -mt-2 whitespace-pre-line text-5xl font-black leading-[0.9] tracking-[-0.05em] md:text-8xl">
            {getValue(data, "heroTitle")}
          </h1>
          <p className="m-hero-in m-d3 mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="m-hero-in m-d3 mt-9 flex flex-wrap items-center gap-3">
            <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-4 text-sm font-black text-white transition hover:bg-white hover:text-[var(--bg)]">
              {getValue(data, "heroPrimaryButton")}
            </button>
            <a href="#campaigns" className="m-inline-link px-2 py-4 text-sm font-black text-white">
              {getValue(data, "heroSecondaryButton")}
            </a>
          </div>
        </div>
        <div dir="rtl" className="m-hero-image-wrap relative lg:col-start-2 lg:row-start-1">
          <div className="absolute -right-5 -top-5 h-full w-full border border-[var(--p)]" />
          <div className="relative h-[520px] overflow-hidden border border-white/15 bg-[var(--surface)] lg:h-[680px]">
            <img src={getValue(data, "heroImage")} alt="" className="m-ken h-full w-full object-cover" />
            <div className="absolute bottom-0 right-0 bg-[var(--p)] px-5 py-4 text-sm font-black text-white">{getValue(data, "heroImageTag")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services({ data }: { data: Record<string, any> }) {
  const services = [
    [getValue(data, "itemOneTitle"), getValue(data, "itemOneText")],
    [getValue(data, "itemTwoTitle"), getValue(data, "itemTwoText")],
    [getValue(data, "itemThreeTitle"), getValue(data, "itemThreeText")],
  ];

  return (
    <section id="services" data-template-section-type="services" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl" delayMs={80}>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data, "servicesEyebrow")}</p>
          <h2 className="t-display mt-4 text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl">{getValue(data, "sectionTwoTitle")}</h2>
        </Reveal>
        <div className="mt-14 border-y border-white/12">
          {services.map(([title, text], index) => (
            <Reveal key={title} delayMs={150 + index * 120} variant="left">
              <article className="m-service-row grid gap-5 border-b border-white/12 bg-[var(--bg)] px-2 py-8 last:border-b-0 md:grid-cols-[120px_1fr_0.85fr] md:items-center">
                <span className="t-display text-5xl font-black text-[var(--p)]">0{index + 1}</span>
                <h3 className="t-display text-3xl font-black tracking-[-0.03em] md:text-5xl">{title}</h3>
                <p className="text-base leading-8 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Marquee({ data }: { data: Record<string, any> }) {
  const channels = String(getValue(data, "marqueeItems")).split("|");
  const repeated = [...channels, ...channels, ...channels];

  return (
    <section data-template-section-type="marquee" className="overflow-hidden border-y border-[var(--p)] bg-[var(--p)] py-5 text-[var(--bg)]">
      <Reveal delayMs={80} variant="fade">
        <div className="m-marquee-track flex w-max items-center gap-8">
          {repeated.map((channel, index) => (
            <span key={`${channel}-${index}`} className="t-display text-4xl font-black uppercase tracking-[-0.05em] md:text-6xl">
              {channel}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function CampaignShowcase({ data }: { data: Record<string, any> }) {
  const campaigns = [
    [getValue(data, "campaignOneTitle"), getValue(data, "campaignOneImage")],
    [getValue(data, "campaignTwoTitle"), getValue(data, "campaignTwoImage")],
    [getValue(data, "campaignThreeTitle"), getValue(data, "campaignThreeImage")],
    [getValue(data, "campaignFourTitle"), getValue(data, "campaignFourImage")],
  ];

  return (
    <section id="campaigns" data-template-section-type="campaign-showcase" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <Reveal delayMs={80} variant="right">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data, "campaignEyebrow")}</p>
          <h2 className="t-display mt-4 text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl">{getValue(data, "sectionFourTitle")}</h2>
          <p className="mt-7 leading-8 text-[var(--muted)]">{getValue(data, "campaignText")}</p>
        </Reveal>
        <div className="grid grid-cols-2 border border-white/10">
          {campaigns.map(([title, image], index) => (
            <Reveal key={title} delayMs={150 + index * 100} variant="scale">
              <article className="m-mosaic-tile group relative aspect-square overflow-hidden border border-white/10 bg-[var(--bg)]">
                <img src={image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                <h3 className="absolute bottom-4 right-4 max-w-[75%] text-lg font-black leading-tight text-white md:text-2xl">{title}</h3>
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
    ["01", getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    ["02", getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    ["03", getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    ["04", getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];

  return (
    <section id="process" data-template-section-type="process" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-4xl text-center" delayMs={80}>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="t-display mt-4 text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl">{getValue(data, "sectionFiveTitle")}</h2>
        </Reveal>
        <div className="m-zigzag mt-16 grid gap-8 lg:grid-cols-4">
          {steps.map(([num, title, text], index) => (
            <Reveal key={num} delayMs={150 + index * 110} variant={index % 2 === 0 ? "right" : "left"}>
              <article className="m-step-block min-h-[270px] border border-[var(--p)]/50 bg-[var(--surface)] p-7">
                <span className="t-display text-5xl font-black text-[var(--p)]">{num}</span>
                <h3 className="t-display mt-8 text-3xl font-black leading-none">{title}</h3>
                <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Results({ data }: { data: Record<string, any> }) {
  const results = [
    [getValue(data, "resultOneValue"), getValue(data, "resultOneLabel")],
    [getValue(data, "resultTwoValue"), getValue(data, "resultTwoLabel")],
    [getValue(data, "resultThreeValue"), getValue(data, "resultThreeLabel")],
  ];

  return (
    <section data-template-section-type="results" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end" delayMs={80}>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data, "resultsEyebrow")}</p>
            <h2 className="t-display mt-4 text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl">{getValue(data, "sectionThreeTitle")}</h2>
          </div>
          <p className="max-w-xl leading-8 text-[var(--muted)]">{getValue(data, "resultsText")}</p>
        </Reveal>
        <div className="mt-10 grid border border-white/10 bg-[var(--bg)] md:grid-cols-3">
          {results.map(([value, label], index) => (
            <Reveal key={label} delayMs={160 + index * 120} variant="up">
              <div className="min-h-[260px] border-b border-white/10 p-7 md:border-b-0 md:border-l md:last:border-l-0 md:border-white/10">
                <p className="t-display text-6xl font-black leading-none text-[var(--p)] md:text-8xl">{value}</p>
                <p className="mt-8 text-lg font-black leading-7">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName"), getValue(data, "reviewOneRole")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName"), getValue(data, "reviewTwoRole")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName"), getValue(data, "reviewThreeRole")],
  ];

  return (
    <section data-template-section-type="testimonials" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-4xl" delayMs={80}>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data, "testimonialEyebrow")}</p>
          <h2 className="t-display mt-4 text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl">{getValue(data, "sectionSixTitle")}</h2>
        </Reveal>
        <div className="mt-12 space-y-5">
          {reviews.map(([text, name, role], index) => (
            <Reveal key={name} delayMs={160 + index * 110} variant="left">
              <blockquote className="m-quote-bar grid gap-5 border-r-8 border-[var(--p)] bg-[var(--surface)] p-6 md:grid-cols-[1fr_240px] md:items-center md:p-8">
                <p className="text-xl font-bold leading-9 text-white md:text-3xl">"{text}"</p>
                <footer className="border-t border-white/10 pt-5 md:border-r md:border-t-0 md:pr-6 md:pt-0">
                  <p className="font-black text-[var(--p)]">{name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{role}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="contact" data-template-section-type="contact" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl border border-white/10 lg:grid-cols-2">
        <Reveal className="bg-[var(--bg)] p-8 lg:p-12" delayMs={170} variant="left">
          <form className="grid gap-4">
            <input className="border border-white/15 bg-transparent px-5 py-4 text-right outline-none transition focus:border-[var(--p)]" placeholder="שם מלא" />
            <input className="border border-white/15 bg-transparent px-5 py-4 text-right outline-none transition focus:border-[var(--p)]" placeholder="טלפון" />
            <input className="border border-white/15 bg-transparent px-5 py-4 text-right outline-none transition focus:border-[var(--p)]" placeholder="אימייל" />
            <textarea className="min-h-36 border border-white/15 bg-transparent px-5 py-4 text-right outline-none transition focus:border-[var(--p)]" placeholder="מה אתם רוצים לשווק?" />
            <button type="button" onClick={openModal} className="bg-[var(--p)] px-7 py-4 text-sm font-black text-white transition hover:bg-white hover:text-[var(--bg)]">
              {getValue(data, "contactButton")}
            </button>
          </form>
        </Reveal>
        <Reveal className="m-contact-panel bg-[var(--p)] p-8 text-white lg:p-12" delayMs={80} variant="right">
          <p className="text-sm font-black uppercase tracking-[0.35em]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="t-display mt-4 text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-7 max-w-xl text-lg font-bold leading-8 text-white/85">{getValue(data, "contactText")}</p>
          <div className="mt-12 grid gap-4 text-sm font-black">
            <a href={`tel:${getValue(data, "phone")}`} className="border border-white/35 p-4">{getValue(data, "phone")}</a>
            <a href={`mailto:${getValue(data, "email")}`} className="border border-white/35 p-4">{getValue(data, "email")}</a>
            <p className="border border-white/35 p-4">{getValue(data, "address")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="bg-[var(--bg)] px-5 py-16 lg:px-8 lg:py-24">
      <Reveal className="mx-auto grid max-w-7xl gap-8 border border-[var(--p)] p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12" delayMs={80}>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data, "brandName")}</p>
          <h2 className="t-display mt-4 max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.05em] md:text-7xl">{getValue(data, "ctaTitle")}</h2>
          <p className="mt-5 max-w-2xl leading-8 text-[var(--muted)]">{getValue(data, "ctaText")}</p>
        </div>
        <button type="button" onClick={openModal} className="border border-[var(--p)] px-8 py-5 text-sm font-black text-[var(--p)] transition hover:bg-[var(--p)] hover:text-white">
          {getValue(data, "ctaButton")}
        </button>
      </Reveal>
      <p className="mx-auto mt-8 max-w-7xl text-xs font-bold text-white/40">© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-[var(--p)] bg-[var(--bg)] p-8 text-[var(--text)]">
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl text-[var(--p)]" aria-label="סגירה">
          ×
        </button>
        <p className="text-sm font-black uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data, "brandName")}</p>
        <h3 className="t-display mt-3 text-4xl font-black leading-none">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3">
          <input className="border border-white/15 bg-transparent px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="שם מלא" />
          <input className="border border-white/15 bg-transparent px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="טלפון" />
          <button type="button" className="bg-[var(--p)] py-4 text-sm font-black text-white">{getValue(data, "contactButton")}</button>
        </form>
      </div>
    </div>
  );
}

function HomePage({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <>
      <Hero data={data} openModal={openModal} />
      <Services data={data} />
      <Marquee data={data} />
      <CampaignShowcase data={data} />
      <Process data={data} />
      <Results data={data} />
      <Testimonials data={data} />
      <Contact data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function MarkoraPages(props: MarkoraPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...markoraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "markora-preview" : "markora"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: markoraEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
