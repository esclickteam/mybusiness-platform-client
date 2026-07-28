import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { lexhavenDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { lexhavenEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const lexhavenPages = [{ id: "home", label: "בית", slug: "/" }];

type LexhavenPagesProps = {
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
  return data?.[key] ?? (lexhavenDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky inset-x-0 top-0 z-50 border-b border-[var(--p)]/20 bg-[var(--bg)]/95 text-[var(--p)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-[var(--p)] text-sm font-bold">{getValue(data, "logoText")}</span>
          <span className="t-display text-2xl font-bold tracking-tight">{getValue(data, "brandName")}</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
          <a href="#practice">{getValue(data, "navServices")}</a>
          <a href="#attorneys">{getValue(data, "navAbout")}</a>
          <a href="#contact">{getValue(data, "navContact")}</a>
        </nav>
        <button type="button" onClick={openModal} className="bg-[var(--p)] px-5 py-3 text-sm font-bold text-white">{getValue(data, "heroPrimaryButton")}</button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="bg-[var(--bg)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-stretch gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal variant="right" className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="t-display mt-5 whitespace-pre-line text-5xl font-bold leading-[1.08] text-[var(--text)] md:text-7xl">{getValue(data, "heroTitle")}</h1>
          <div className="mt-7 h-1 w-28 bg-[var(--p)]" />
          <p className="mt-8 max-w-2xl text-lg leading-9 text-[var(--muted)] md:text-xl">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-4 text-sm font-bold text-white">{getValue(data, "heroPrimaryButton")}</button>
            <a href="#practice" className="border border-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--p)]">{getValue(data, "heroSecondaryButton")}</a>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <div className="relative h-full min-h-[440px] border-l-[18px] border-[var(--p)] bg-[var(--p)]/10 p-4">
            <img src={getValue(data, "heroImage")} alt="" className="h-full min-h-[440px] w-full object-cover grayscale-[20%]" />
            <div className="absolute bottom-8 right-0 bg-[var(--p)] px-8 py-5 text-white shadow-2xl">
              <p className="t-display text-3xl font-bold">{getValue(data, "heroStatOne")}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em]">{getValue(data, "heroStatOneLabel")}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PracticeAreas({ data }: { data: Record<string, any> }) {
  const areas = [
    [getValue(data, "practiceOneTitle"), getValue(data, "practiceOneText")],
    [getValue(data, "practiceTwoTitle"), getValue(data, "practiceTwoText")],
    [getValue(data, "practiceThreeTitle"), getValue(data, "practiceThreeText")],
    [getValue(data, "practiceFourTitle"), getValue(data, "practiceFourText")],
  ];

  return (
    <section id="practice" data-template-section-type="services" className="border-y border-[var(--p)]/15 bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data, "sectionTwoEyebrow")}</p>
            <h2 className="t-display max-w-3xl text-4xl font-bold leading-tight md:text-6xl">{getValue(data, "sectionTwoTitle")}</h2>
          </div>
        </Reveal>
        <div className="mt-12 divide-y divide-[var(--p)]/20 border-y border-[var(--p)]/30">
          {areas.map(([title, text], index) => (
            <Reveal key={title} delayMs={index * 90} variant="up">
              <article className="lexhaven-practice-row grid gap-5 py-8 md:grid-cols-[120px_0.8fr_1.2fr] md:items-center">
                <span className="t-display text-2xl md:text-5xl font-bold text-[var(--p)]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="text-2xl font-bold text-[var(--text)]">{title}</h3>
                <p className="text-base leading-8 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="about" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal variant="right">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data, "sectionThreeEyebrow")}</p>
          <h2 className="t-display mt-4 text-4xl font-bold leading-tight md:text-6xl">{getValue(data, "sectionThreeTitle")}</h2>
          <div className="mt-10 grid gap-8 text-lg leading-9 text-[var(--muted)] md:grid-cols-2">
            <p>{getValue(data, "manifestoOne")}</p>
            <p>{getValue(data, "manifestoTwo")}</p>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <blockquote className="border-r-[10px] border-[var(--p)] bg-[var(--surface)] p-8 shadow-[24px_24px_0_rgba(122,31,43,0.08)] lg:p-12">
            <span className="t-display block text-3xl md:text-7xl leading-none text-[var(--p)]">"</span>
            <p className="t-display mt-4 text-3xl font-bold leading-snug text-[var(--text)]">{getValue(data, "pullQuote")}</p>
            <footer className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-[var(--p)]">{getValue(data, "pullQuoteBy")}</footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

function Attorneys({ data }: { data: Record<string, any> }) {
  const attorneys = [
    [getValue(data, "attorneyOneImage"), getValue(data, "attorneyOneName"), getValue(data, "attorneyOneTitle"), getValue(data, "attorneyOneCredentials")],
    [getValue(data, "attorneyTwoImage"), getValue(data, "attorneyTwoName"), getValue(data, "attorneyTwoTitle"), getValue(data, "attorneyTwoCredentials")],
    [getValue(data, "attorneyThreeImage"), getValue(data, "attorneyThreeName"), getValue(data, "attorneyThreeTitle"), getValue(data, "attorneyThreeCredentials")],
    [getValue(data, "attorneyFourImage"), getValue(data, "attorneyFourName"), getValue(data, "attorneyFourTitle"), getValue(data, "attorneyFourCredentials")],
  ];

  return (
    <section id="attorneys" data-template-section-type="team" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data, "sectionFourEyebrow")}</p>
            <h2 className="t-display mt-4 text-4xl font-bold md:text-6xl">{getValue(data, "sectionFourTitle")}</h2>
          </div>
        </Reveal>
        <div className="mt-12 flex gap-6 overflow-x-auto pb-5">
          {attorneys.map(([image, name, title, credentials], index) => (
            <Reveal key={name} delayMs={index * 90} variant="up" className="min-w-[250px] flex-1">
              <article className="group h-full border border-[var(--p)]/20 bg-[var(--bg)]">
                <div className="overflow-hidden border-b border-[var(--p)]/20">
                  <img src={image} alt="" className="h-72 w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                </div>
                <div className="p-6">
                  <h3 className="t-display text-2xl font-bold text-[var(--text)]">{name}</h3>
                  <p className="mt-1 text-sm font-bold text-[var(--p)]">{title}</p>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{credentials}</p>
                </div>
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
    <section data-template-section-type="process" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="t-display text-4xl font-bold md:text-6xl">{getValue(data, "sectionFiveTitle")}</h2>
            <p className="max-w-md text-base leading-8 text-[var(--muted)]">{getValue(data, "sectionFiveText")}</p>
          </div>
        </Reveal>
        <div className="lexhaven-process-track relative mt-16 flex flex-col gap-10 md:flex-row md:gap-0">
          {steps.map(([num, title, text], index) => (
            <Reveal key={num} delayMs={index * 100} className="relative flex-1">
              <article className="relative z-10 bg-[var(--bg)] pl-8 md:pl-10">
                <span className="grid h-16 w-16 place-items-center border-2 border-[var(--p)] bg-[var(--bg)] text-lg font-bold text-[var(--p)]">{num}</span>
                <h3 className="mt-6 text-xl font-bold">{title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="testimonials" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal variant="scale">
          <blockquote className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "sectionSixTitle")}</p>
            <p className="t-display mt-8 text-4xl font-bold leading-snug text-[var(--text)] md:text-6xl">"{getValue(data, "reviewOneText")}"</p>
            <footer className="mt-10 border-t border-[var(--p)]/25 pt-8">
              <p className="font-bold text-[var(--text)]">{getValue(data, "reviewOneName")}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{getValue(data, "reviewOneRole")}</p>
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

function Faq({ data }: { data: Record<string, any> }) {
  const [open, setOpen] = useState(0);
  const faqs = [
    [getValue(data, "faqOneQuestion"), getValue(data, "faqOneAnswer")],
    [getValue(data, "faqTwoQuestion"), getValue(data, "faqTwoAnswer")],
    [getValue(data, "faqThreeQuestion"), getValue(data, "faqThreeAnswer")],
  ];

  return (
    <section data-template-section-type="faq" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal variant="right">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data, "sectionSevenEyebrow")}</p>
          <h2 className="t-display mt-4 text-4xl font-bold md:text-6xl">{getValue(data, "sectionSevenTitle")}</h2>
        </Reveal>
        <div className="space-y-4">
          {faqs.map(([q, a], i) => (
            <Reveal key={q} delayMs={i * 80} variant="left">
              <div className="border border-[var(--p)]/25 bg-[var(--surface)]">
                <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-6 text-right">
                  <span className="text-lg font-bold">{q}</span>
                  <span className="grid h-9 w-9 place-items-center bg-[var(--p)] text-white">{open === i ? "−" : "+"}</span>
                </button>
                <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm leading-8 text-[var(--muted)]">{a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="contact" data-template-section-type="contact" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl border-[14px] border-[var(--p)] p-4 md:p-8">
        <div className="bg-[var(--bg)] p-7 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <Reveal variant="right">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data, "sectionEightTitle")}</p>
              <h2 className="t-display mt-4 text-4xl font-bold md:text-6xl">{getValue(data, "contactTitle")}</h2>
              <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
              <div className="mt-8 space-y-3 text-sm font-semibold text-[var(--text)]">
                <p><span className="text-[var(--p)]">טלפון</span> / {getValue(data, "phone")}</p>
                <p><span className="text-[var(--p)]">אימייל</span> / {getValue(data, "email")}</p>
                <p><span className="text-[var(--p)]">כתובת</span> / {getValue(data, "address")}</p>
              </div>
            </Reveal>
            <Reveal variant="left" delayMs={120}>
              <form className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className="border border-[var(--p)]/25 bg-white px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="שם מלא" />
                  <input className="border border-[var(--p)]/25 bg-white px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="טלפון" />
                </div>
                <input className="border border-[var(--p)]/25 bg-white px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="אימייל" />
                <textarea className="min-h-32 border border-[var(--p)]/25 bg-white px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="ספרו לנו בקצרה על הסוגיה" />
                <button type="button" onClick={openModal} className="bg-[var(--p)] px-7 py-4 text-sm font-bold text-white">{getValue(data, "contactButton")}</button>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="bg-[var(--p)] px-5 py-16 text-white lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end">
        <Reveal variant="right">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/70">{getValue(data, "brandName")}</p>
          <h2 className="t-display mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">{getValue(data, "ctaTitle")}</h2>
          <p className="mt-5 max-w-2xl text-white/75">{getValue(data, "ctaText")}</p>
        </Reveal>
        <Reveal variant="left" delayMs={100}>
          <button type="button" onClick={openModal} className="border border-white bg-white px-8 py-4 text-sm font-bold text-[var(--p)]">{getValue(data, "ctaButton")}</button>
        </Reveal>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/20 pt-6 text-xs text-white/70 md:flex-row">
        <p>© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
        <p>{getValue(data, "email")} · {getValue(data, "phone")}</p>
      </div>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-[var(--p)]/30 bg-[var(--bg)] p-8">
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl text-[var(--p)]">×</button>
        <h3 className="t-display text-3xl font-bold">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3">
          <input className="border border-[var(--p)]/25 bg-white px-5 py-4 text-right outline-none" placeholder="שם מלא" />
          <input className="border border-[var(--p)]/25 bg-white px-5 py-4 text-right outline-none" placeholder="טלפון" />
          <button type="button" className="bg-[var(--p)] py-4 text-sm font-bold text-white">{getValue(data, "contactButton")}</button>
        </form>
      </div>
    </div>
  );
}

function HomePage({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <>
      <Hero data={data} openModal={openModal} />
      <PracticeAreas data={data} />
      <WhyUs data={data} />
      <Attorneys data={data} />
      <Process data={data} />
      <Testimonials data={data} />
      <Faq data={data} />
      <Contact data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function LexhavenPages(props: LexhavenPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...lexhavenDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "lexhaven-preview" : "lexhaven"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: lexhavenEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
