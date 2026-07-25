import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { formaraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { formaraEditorCss } from "./editorCss";

export const formaraPages = [{ id: "home", label: "בית", slug: "/" }];

type FormaraPagesProps = {
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
  return data?.[key] ?? (formaraDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  const navItems = [
    getValue(data, "navServices"),
    getValue(data, "navProjects"),
    getValue(data, "navProcess"),
  ];

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#1E1C1A]/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-[var(--p)] text-sm font-bold text-[var(--p)]">
            {getValue(data, "logoText")}
          </span>
          <span className="t-display text-3xl leading-none text-white">{getValue(data, "brandName")}</span>
        </div>
        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.22em] text-white/62 lg:flex">
          {navItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <button
          type="button"
          onClick={openModal}
          className="border border-[var(--p)] px-5 py-2.5 text-sm font-semibold text-[var(--p)] transition hover:bg-[var(--p)] hover:text-white"
        >
          {getValue(data, "heroPrimaryButton")}
        </button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden bg-[#1E1C1A]">
      <img src={getValue(data, "heroImage")} alt="" className="t-hero-zoom absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1E1C1A] via-[#1E1C1A]/38 to-[#1E1C1A]/18" />
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t-4 border-[var(--p)] bg-[#1E1C1A]/88 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-9 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:px-8 lg:py-12">
          <div className="t-hero-bar">
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-[var(--a)]">{getValue(data, "heroEyebrow")}</p>
            <h1 className="t-display mt-2 text-6xl leading-[0.86] text-white sm:text-7xl lg:text-[9rem]">
              {getValue(data, "brandName")}
            </h1>
          </div>
          <div className="t-hero-copy border-r border-[var(--p)]/40 pr-6">
            <h2 className="whitespace-pre-line text-3xl font-semibold leading-tight text-white lg:text-5xl">{getValue(data, "heroTitle")}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] lg:text-base">{getValue(data, "heroSubtitle")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">
                {getValue(data, "heroPrimaryButton")}
              </button>
              <button type="button" className="border border-white/25 px-8 py-3.5 text-sm font-semibold text-white">
                {getValue(data, "heroSecondaryButton")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services({ data }: { data: Record<string, any> }) {
  const services = [
    [getValue(data, "itemOneTitle"), getValue(data, "itemOneText"), getValue(data, "serviceOneImage")],
    [getValue(data, "itemTwoTitle"), getValue(data, "itemTwoText"), getValue(data, "serviceTwoImage")],
    [getValue(data, "itemThreeTitle"), getValue(data, "itemThreeText"), getValue(data, "serviceThreeImage")],
  ];

  return (
    <section data-template-section-type="services" className="bg-[#1E1C1A] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-5 border-b border-[var(--p)]/30 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "servicesEyebrow")}</p>
            <h2 className="t-display mt-3 text-5xl leading-none text-white md:text-7xl">{getValue(data, "sectionTwoTitle")}</h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">{getValue(data, "servicesIntro")}</p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {services.map(([title, text, image], index) => (
            <Reveal key={title} delayMs={index * 120} variant="up">
              <article className="t-material-card group h-full border border-[var(--p)]/25 bg-[#28231F]">
                <div className="aspect-square overflow-hidden border-b border-[var(--p)]/25">
                  <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--p)]">0{index + 1}</span>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase({ data }: { data: Record<string, any> }) {
  const projects = [
    [getValue(data, "projectOneTitle"), getValue(data, "projectOneText"), getValue(data, "projectOneImage")],
    [getValue(data, "projectTwoTitle"), getValue(data, "projectTwoText"), getValue(data, "projectTwoImage")],
    [getValue(data, "projectThreeTitle"), getValue(data, "projectThreeText"), getValue(data, "projectThreeImage")],
  ];

  return (
    <section data-template-section-type="showcase" className="bg-[#26211D] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "projectsEyebrow")}</p>
          <h2 className="t-display mt-3 text-5xl leading-none text-white md:text-7xl">{getValue(data, "sectionThreeTitle")}</h2>
        </Reveal>
        <div className="mt-14 space-y-14">
          {projects.map(([title, text, image], index) => (
            <Reveal key={title} variant={index % 2 === 0 ? "right" : "left"}>
              <article className="grid items-center gap-0 border border-[var(--p)]/20 bg-[#1E1C1A] lg:grid-cols-2">
                <div className={`h-[340px] overflow-hidden lg:h-[520px] ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <img src={image} alt="" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                </div>
                <div className="p-8 lg:p-12">
                  <span className="t-display text-6xl text-[var(--p)]">0{index + 1}</span>
                  <h3 className="mt-5 text-3xl font-semibold text-white lg:text-4xl">{title}</h3>
                  <p className="mt-5 max-w-md text-base leading-8 text-[var(--muted)]">{text}</p>
                  <div className="mt-8 h-px w-28 bg-[var(--p)]" />
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
    <section data-template-section-type="philosophy" className="bg-[#1E1C1A] px-5 py-20 lg:px-8 lg:py-28">
      <Reveal variant="scale" className="mx-auto max-w-6xl border-y border-[var(--p)]/45 px-4 py-16 text-center lg:px-12 lg:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data, "philosophyEyebrow")}</p>
        <blockquote className="t-display mx-auto mt-6 max-w-5xl text-5xl leading-tight text-white md:text-7xl lg:text-8xl">
          {getValue(data, "philosophyQuote")}
        </blockquote>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">{getValue(data, "philosophyCredit")}</p>
      </Reveal>
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
    <section data-template-section-type="process" className="bg-[#2A2623] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
            <h2 className="t-display mt-3 text-5xl leading-none text-white md:text-7xl">{getValue(data, "sectionFiveTitle")}</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--muted)]">{getValue(data, "processIntro")}</p>
        </Reveal>
        <div className="-mx-5 mt-12 flex gap-4 overflow-x-auto px-5 pb-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0">
          {steps.map(([title, text], index) => (
            <Reveal key={title} delayMs={index * 110} className="min-w-[260px] lg:min-w-0">
              <article className="h-full border border-[var(--p)]/25 bg-[#1E1C1A] p-5">
                <span className="grid h-20 w-20 place-items-center bg-[var(--p)] text-2xl font-bold text-white">0{index + 1}</span>
                <h3 className="mt-8 text-2xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Materials({ data }: { data: Record<string, any> }) {
  const materials = [
    [getValue(data, "materialOne"), "#8B5E3C"],
    [getValue(data, "materialTwo"), "#C3A07B"],
    [getValue(data, "materialThree"), "#3B332C"],
    [getValue(data, "materialFour"), "#E2D3C4"],
    [getValue(data, "materialFive"), "#5B503F"],
    [getValue(data, "materialSix"), "#F1E9DE"],
  ];

  return (
    <section data-template-section-type="materials" className="bg-[#1E1C1A] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "materialsEyebrow")}</p>
            <h2 className="t-display mt-3 text-5xl leading-none text-white md:text-7xl">{getValue(data, "materialsTitle")}</h2>
          </div>
          <p className="text-sm leading-7 text-[var(--muted)]">{getValue(data, "materialsText")}</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {materials.map(([label, color], index) => (
            <Reveal key={label} delayMs={index * 80} variant="scale">
              <div className="group aspect-square border border-[var(--p)]/25 p-3">
                <div className="h-full w-full border border-black/10 transition duration-500 group-hover:scale-[0.96]" style={{ background: color }}>
                  <div className="flex h-full items-end p-3">
                    <span className="bg-[#1E1C1A]/75 px-3 py-2 text-xs font-semibold text-white backdrop-blur">{label}</span>
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

function Testimonials({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName"), getValue(data, "reviewOneRole")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName"), getValue(data, "reviewTwoRole")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName"), getValue(data, "reviewThreeRole")],
  ];

  return (
    <section data-template-section-type="testimonials" className="bg-[#26211D] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "testimonialsEyebrow")}</p>
          <h2 className="t-display mt-3 text-5xl leading-none text-white md:text-7xl">{getValue(data, "sectionSixTitle")}</h2>
        </Reveal>
        <div className="mt-14 grid gap-0 border-y border-[var(--p)]/35 lg:grid-cols-3">
          {reviews.map(([text, name, role], index) => (
            <Reveal key={name} delayMs={index * 110}>
              <blockquote className="h-full border-b border-[var(--p)]/25 py-9 lg:border-b-0 lg:border-l lg:px-8">
                <p className="text-lg leading-9 text-white">"{text}"</p>
                <footer className="mt-8">
                  <p className="font-bold text-[var(--p)]">{name}</p>
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
    <section data-template-section-type="contact" className="bg-[#1E1C1A] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 border border-[var(--p)]/30 bg-[#28231F] p-6 lg:grid-cols-[0.85fr_1.15fr] lg:p-12">
        <Reveal variant="right">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="t-display mt-3 text-5xl leading-none text-white md:text-7xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-5 max-w-md text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-10 space-y-4 border-t border-[var(--p)]/25 pt-8 text-sm text-white/84">
            <p><span className="text-[var(--p)]">טלפון</span> · {getValue(data, "phone")}</p>
            <p><span className="text-[var(--p)]">אימייל</span> · {getValue(data, "email")}</p>
            <p><span className="text-[var(--p)]">כתובת</span> · {getValue(data, "address")}</p>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <form className="grid gap-4 bg-[#1E1C1A] p-6 lg:p-8">
            <input className="border border-[var(--p)]/25 bg-transparent px-5 py-4 text-right text-white outline-none transition placeholder:text-white/38 focus:border-[var(--p)]" placeholder="שם מלא" />
            <input className="border border-[var(--p)]/25 bg-transparent px-5 py-4 text-right text-white outline-none transition placeholder:text-white/38 focus:border-[var(--p)]" placeholder="טלפון" />
            <input className="border border-[var(--p)]/25 bg-transparent px-5 py-4 text-right text-white outline-none transition placeholder:text-white/38 focus:border-[var(--p)]" placeholder="אימייל" />
            <textarea className="min-h-32 border border-[var(--p)]/25 bg-transparent px-5 py-4 text-right text-white outline-none transition placeholder:text-white/38 focus:border-[var(--p)]" placeholder="מה תרצו לעצב?" />
            <button type="button" onClick={openModal} className="bg-[var(--p)] px-7 py-4 text-sm font-bold text-white">
              {getValue(data, "contactButton")}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="bg-[#1E1C1A] px-5 pb-10 pt-4 lg:px-8">
      <Reveal className="mx-auto max-w-7xl border border-[var(--p)] p-8 text-center lg:p-14">
        <p className="t-display text-4xl text-[var(--p)] md:text-6xl">{getValue(data, "brandName")}</p>
        <h2 className="mt-6 text-3xl font-semibold text-white md:text-5xl">{getValue(data, "ctaTitle")}</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={openModal} className="mt-8 border border-[var(--p)] px-9 py-3.5 text-sm font-bold text-[var(--p)] transition hover:bg-[var(--p)] hover:text-white">
          {getValue(data, "ctaButton")}
        </button>
      </Reveal>
      <p className="mt-8 text-center text-xs text-[var(--muted)]">© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-[var(--p)]/40 bg-[#1E1C1A] p-8 text-white">
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl text-white/70">×</button>
        <h3 className="t-display text-4xl text-white">{getValue(data, "contactTitle")}</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{getValue(data, "contactText")}</p>
        <form className="mt-6 grid gap-3">
          <input className="border border-[var(--p)]/25 bg-transparent px-5 py-4 text-right outline-none" placeholder="שם מלא" />
          <input className="border border-[var(--p)]/25 bg-transparent px-5 py-4 text-right outline-none" placeholder="טלפון" />
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
      <Services data={data} />
      <Showcase data={data} />
      <Philosophy data={data} />
      <Process data={data} />
      <Materials data={data} />
      <Testimonials data={data} />
      <Contact data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function FormaraPages(props: FormaraPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...formaraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "formara-preview" : "formara"} className="min-h-screen w-full overflow-x-hidden bg-[#1E1C1A]">
      <style dangerouslySetInnerHTML={{ __html: formaraEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
