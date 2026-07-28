import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { numerisDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { numerisEditorCss } from "./editorCss";

export const numerisPages = [{ id: "home", label: "בית", slug: "/" }];

type NumerisPagesProps = {
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
  return data?.[key] ?? (numerisDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="fixed inset-x-0 top-0 z-50 border-b border-[var(--p)]/12 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#home" className="flex items-center gap-3 text-[var(--text)]">
          <span className="grid h-10 w-10 place-items-center bg-[var(--p)] text-sm font-bold text-white">{getValue(data, "logoText")}</span>
          <span className="t-display text-2xl font-bold tracking-[-0.04em]">{getValue(data, "brandName")}</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-[var(--muted)] md:flex">
          <a href="#services" className="transition hover:text-[var(--p)]">{getValue(data, "navServices")}</a>
          <a href="#packages" className="transition hover:text-[var(--p)]">חבילות</a>
          <a href="#contact" className="transition hover:text-[var(--p)]">{getValue(data, "navContact")}</a>
        </nav>
        <button type="button" onClick={openModal} className="border border-[var(--p)] bg-white px-5 py-2.5 text-sm font-bold text-[var(--p)] transition hover:bg-[var(--p)] hover:text-white">
          {getValue(data, "heroPrimaryButton")}
        </button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="home" data-template-section-type="hero" className="nu-ledger-bg bg-[var(--bg)] px-5 pb-20 pt-32 lg:px-8 lg:pb-28 lg:pt-40">
      <div className="mx-auto max-w-7xl">
        <div className="relative grid gap-10 border border-[var(--p)]/12 bg-white p-6 shadow-[0_30px_90px_rgba(15,110,86,0.08)] lg:grid-cols-[1.08fr_0.92fr] lg:p-12">
          <div className="absolute right-0 top-0 h-1 w-40 bg-[var(--p)]" />
          <Reveal variant="right" className="self-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
            <h1 className="t-display mt-5 whitespace-pre-line text-5xl font-bold leading-[1.02] tracking-[-0.05em] md:text-7xl">{getValue(data, "heroTitle")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-4 text-sm font-bold text-white transition hover:bg-[var(--a)]">{getValue(data, "heroPrimaryButton")}</button>
              <a href="#services" className="border border-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--p)] transition hover:bg-[var(--p)] hover:text-white">{getValue(data, "heroSecondaryButton")}</a>
            </div>
          </Reveal>
          <Reveal variant="left" delayMs={120}>
            <div className="relative mx-auto aspect-square w-full max-w-[430px] border border-[var(--p)]/18 bg-[var(--bg)] p-5">
              <img src={getValue(data, "heroImage")} alt="" className="h-full w-full object-cover" />
              <div className="absolute -bottom-5 -right-5 border border-[var(--p)] bg-white px-5 py-4 shadow-[0_18px_45px_rgba(15,110,86,0.12)]">
                <span className="block text-xs font-bold text-[var(--muted)]">דוח חודשי</span>
                <strong className="t-display text-3xl text-[var(--p)]">{getValue(data, "heroBadge")}</strong>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ServicesTable({ data }: { data: Record<string, any> }) {
  const rows = [
    [getValue(data, "itemOneTitle"), getValue(data, "itemOneText"), getValue(data, "serviceOnePrice")],
    [getValue(data, "itemTwoTitle"), getValue(data, "itemTwoText"), getValue(data, "serviceTwoPrice")],
    [getValue(data, "itemThreeTitle"), getValue(data, "itemThreeText"), getValue(data, "serviceThreePrice")],
    [getValue(data, "itemFourTitle"), getValue(data, "itemFourText"), getValue(data, "serviceFourPrice")],
  ];

  return (
    <section id="services" data-template-section-type="services" className="bg-white px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">service ledger</p>
            <h2 className="t-display mt-3 text-4xl font-bold tracking-[-0.05em] md:text-6xl">{getValue(data, "sectionTwoTitle")}</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--muted)]">{getValue(data, "sectionTwoText")}</p>
        </Reveal>
        <div className="border border-[var(--p)]/14">
          <div className="grid grid-cols-[0.8fr_1.2fr_0.55fr] bg-[var(--p)] px-4 py-3 text-sm font-bold text-white md:px-6">
            <span>שירות</span>
            <span>תיאור</span>
            <span className="text-left">החל מ-</span>
          </div>
          {rows.map(([title, text, price], index) => (
            <Reveal key={title} delayMs={index * 70} variant="up">
              <div className="grid grid-cols-1 gap-3 border-t border-[var(--p)]/12 px-4 py-5 transition hover:bg-[var(--bg)] md:grid-cols-[0.8fr_1.2fr_0.55fr] md:px-6 md:py-6">
                <h3 className="text-lg font-bold text-[var(--text)]">{title}</h3>
                <p className="text-sm leading-7 text-[var(--muted)]">{text}</p>
                <strong className="text-left text-xl text-[var(--p)]">{price}</strong>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustStats({ data }: { data: Record<string, any> }) {
  const stats = [
    [getValue(data, "heroStatOne"), getValue(data, "heroStatOneLabel")],
    [getValue(data, "heroStatTwo"), getValue(data, "heroStatTwoLabel")],
    [getValue(data, "heroStatThree"), getValue(data, "heroStatThreeLabel")],
    [getValue(data, "heroStatFour"), getValue(data, "heroStatFourLabel")],
  ];

  return (
    <section data-template-section-type="stats" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal variant="right">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">trust metrics</p>
          <h2 className="t-display mt-3 text-4xl font-bold tracking-[-0.05em] md:text-6xl">{getValue(data, "sectionThreeTitle")}</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-[var(--muted)]">{getValue(data, "sectionThreeText")}</p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map(([number, label], index) => (
            <Reveal key={label} delayMs={index * 90} variant="scale">
              <div className="nu-stat-tile aspect-square border border-[var(--p)] bg-[var(--p)] p-5 text-white md:p-7">
                <div className="t-display text-4xl font-bold md:text-6xl">{number}</div>
                <p className="mt-4 text-sm leading-6 text-white/80">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Packages({ data }: { data: Record<string, any> }) {
  const packages = [
    [getValue(data, "packageOneTitle"), getValue(data, "packageOnePrice"), getValue(data, "packageOneText"), getValue(data, "packageOneFeature")],
    [getValue(data, "packageTwoTitle"), getValue(data, "packageTwoPrice"), getValue(data, "packageTwoText"), getValue(data, "packageTwoFeature")],
    [getValue(data, "packageThreeTitle"), getValue(data, "packageThreePrice"), getValue(data, "packageThreeText"), getValue(data, "packageThreeFeature")],
  ];

  return (
    <section id="packages" data-template-section-type="packages" className="bg-white px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12">
          <h2 className="t-display text-4xl font-bold tracking-[-0.05em] md:text-6xl">{getValue(data, "sectionFourTitle")}</h2>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-3">
          {packages.map(([title, price, text, feature], index) => (
            <Reveal key={title} delayMs={index * 100} variant="up">
              <article className="aspect-square border border-[var(--p)] bg-white p-6 transition hover:-translate-y-1 hover:bg-[var(--bg)] md:p-8">
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--p)]">plan 0{index + 1}</span>
                <h3 className="t-display mt-4 text-3xl font-bold tracking-[-0.04em]">{title}</h3>
                <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{text}</p>
                <div className="mt-6 border-t border-[var(--p)]/18 pt-5">
                  <strong className="text-3xl text-[var(--p)]">{price}</strong>
                  <p className="mt-3 text-sm font-semibold text-[var(--text)]">{feature}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessChecklist({ data }: { data: Record<string, any> }) {
  const steps = [
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    [getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];

  return (
    <section data-template-section-type="process" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr]">
        <Reveal variant="right">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">monthly close</p>
          <h2 className="t-display mt-3 text-4xl font-bold tracking-[-0.05em] md:text-6xl">{getValue(data, "sectionFiveTitle")}</h2>
        </Reveal>
        <div className="border border-[var(--p)]/14 bg-white">
          {steps.map(([title, text], index) => (
            <Reveal key={title} delayMs={index * 80}>
              <div className="grid gap-4 border-b border-[var(--p)]/12 p-5 last:border-b-0 md:grid-cols-[52px_0.7fr_1fr] md:items-center md:p-6">
                <span className="grid h-11 w-11 place-items-center bg-[var(--p)] text-xl font-bold text-white">✓</span>
                <h3 className="text-xl font-bold text-[var(--text)]">{title}</h3>
                <p className="text-sm leading-7 text-[var(--muted)]">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComplianceStrip({ data }: { data: Record<string, any> }) {
  const partners = [
    getValue(data, "partnerOne"),
    getValue(data, "partnerTwo"),
    getValue(data, "partnerThree"),
    getValue(data, "partnerFour"),
    getValue(data, "partnerFive"),
  ];

  return (
    <section data-template-section-type="compliance" className="bg-white px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl border-y border-[var(--p)]/18 py-8">
        <Reveal className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h2 className="t-display text-3xl font-bold tracking-[-0.04em]">{getValue(data, "sectionSixTitle")}</h2>
          <p className="max-w-lg text-sm leading-7 text-[var(--muted)]">{getValue(data, "sectionSixText")}</p>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {partners.map((partner, index) => (
            <Reveal key={partner} delayMs={index * 60} variant="fade">
              <div className="border border-[var(--p)]/16 bg-[var(--bg)] px-4 py-5 text-center text-sm font-bold text-[var(--p)]">{partner}</div>
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
    <section data-template-section-type="testimonials" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <h2 className="t-display text-4xl font-bold tracking-[-0.05em] md:text-6xl">{getValue(data, "sectionSevenTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {reviews.map(([text, name, role], index) => (
            <Reveal key={name} delayMs={index * 100} variant="up">
              <blockquote className="h-full border border-[var(--p)]/14 border-l-[6px] border-l-[var(--p)] bg-white p-7">
                <p className="t-display text-2xl leading-9 text-[var(--text)]">"{text}"</p>
                <footer className="mt-8 border-t border-[var(--p)]/12 pt-5">
                  <p className="font-bold text-[var(--p)]">{name}</p>
                  <p className="text-sm text-[var(--muted)]">{role}</p>
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
    <section id="contact" data-template-section-type="contact" className="bg-white px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal variant="right" className="border border-[var(--p)]/14 bg-[var(--bg)] p-8 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">contact</p>
          <h2 className="t-display mt-3 text-4xl font-bold tracking-[-0.05em] md:text-6xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 space-y-3 text-sm text-[var(--muted)]">
            <p><span className="font-bold text-[var(--p)]">טלפון</span> · {getValue(data, "phone")}</p>
            <p><span className="font-bold text-[var(--p)]">אימייל</span> · {getValue(data, "email")}</p>
            <p><span className="font-bold text-[var(--p)]">כתובת</span> · {getValue(data, "address")}</p>
          </div>
        </Reveal>
        <Reveal variant="left">
          <form className="grid gap-4 border border-[var(--p)]/14 bg-white p-6 shadow-[0_24px_70px_rgba(15,110,86,0.08)] md:p-8">
            <input className="border border-[var(--p)]/18 bg-white px-5 py-4 text-right outline-none transition placeholder:text-[var(--muted)]/55 focus:border-[var(--p)]" placeholder="שם מלא" />
            <input className="border border-[var(--p)]/18 bg-white px-5 py-4 text-right outline-none transition placeholder:text-[var(--muted)]/55 focus:border-[var(--p)]" placeholder="טלפון" />
            <input className="border border-[var(--p)]/18 bg-white px-5 py-4 text-right outline-none transition placeholder:text-[var(--muted)]/55 focus:border-[var(--p)]" placeholder="אימייל" />
            <textarea className="min-h-32 border border-[var(--p)]/18 bg-white px-5 py-4 text-right outline-none transition placeholder:text-[var(--muted)]/55 focus:border-[var(--p)]" placeholder="כמה עובדים / חשבוניות בחודש?" />
            <button type="button" onClick={openModal} className="bg-[var(--p)] px-7 py-4 text-sm font-bold text-white transition hover:bg-[var(--a)]">{getValue(data, "contactButton")}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="bg-[var(--p)] px-5 py-14 text-white lg:px-8">
      <Reveal className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/72">{getValue(data, "brandName")}</p>
          <h2 className="t-display mt-3 max-w-2xl text-4xl font-bold tracking-[-0.05em] md:text-6xl">{getValue(data, "ctaTitle")}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/78">{getValue(data, "ctaText")}</p>
        </div>
        <button type="button" onClick={openModal} className="border border-white bg-white px-8 py-4 text-sm font-bold text-[var(--p)] transition hover:bg-transparent hover:text-white">{getValue(data, "ctaButton")}</button>
      </Reveal>
      <p className="mx-auto mt-10 max-w-7xl text-xs text-white/58">© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[var(--dark)]/55 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-[var(--p)] bg-white p-8 text-[var(--text)]">
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl text-[var(--muted)] transition hover:text-[var(--p)]">×</button>
        <h3 className="t-display text-3xl font-bold tracking-[-0.04em]">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3">
          <input className="border border-[var(--p)]/18 px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="שם מלא" />
          <input className="border border-[var(--p)]/18 px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="טלפון" />
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
      <ServicesTable data={data} />
      <TrustStats data={data} />
      <Packages data={data} />
      <ProcessChecklist data={data} />
      <ComplianceStrip data={data} />
      <Testimonials data={data} />
      <Contact data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function NumerisPages(props: NumerisPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...numerisDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "numeris-preview" : "numeris"} className="min-h-screen w-full overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
      <style dangerouslySetInnerHTML={{ __html: numerisEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
