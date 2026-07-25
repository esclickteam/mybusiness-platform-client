import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { pulsefitDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { pulsefitEditorCss } from "./editorCss";

export const pulsefitPages = [{ id: "home", label: "בית", slug: "/" }];

type PulsefitPagesProps = {
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
  return data?.[key] ?? (pulsefitDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "var(--p)", color: "var(--dark)", borderRadius: 0 }}>{getValue(data, "logoText")}</span>
          <span className="t-display text-2xl font-bold">{getValue(data, "brandName")}</span>
        </div>
        <button type="button" onClick={openModal} className="hidden sm:inline-flex border border-[var(--p)] px-5 py-2.5 text-sm font-semibold text-[var(--p)]">{getValue(data, "heroPrimaryButton")}</button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[#121212]/75" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 lg:px-8">
        <p className="t-anim text-xs font-bold uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
        <h1 className="t-display t-anim t-d1 mt-3 whitespace-pre-line text-6xl font-bold uppercase leading-[0.92] md:text-8xl">{getValue(data,"heroTitle")}</h1>
        <p className="t-anim t-d2 mt-6 max-w-xl text-lg text-white/75">{getValue(data,"heroSubtitle")}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-4 text-sm font-bold uppercase text-black">{getValue(data,"heroPrimaryButton")}</button>
          <button type="button" className="border border-white/30 px-8 py-4 text-sm font-bold uppercase text-white">{getValue(data,"heroSecondaryButton")}</button>
        </div>
      </div>
    </section>
  );
}

function Services({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="services" className="px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data,"sectionTwoTitle")}</h2>
        <div className="mt-10 divide-y divide-white/10 border border-white/10">
          {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title,text],i) => (
            <article key={title} className="t-card grid gap-2 bg-[var(--surface)] p-7 md:grid-cols-[80px_1fr]">
              <span className="text-3xl font-bold text-[var(--p)]">0{i+1}</span>
              <div><h3 className="text-xl font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  const stats = [
    [getValue(data, "heroStatOne"), getValue(data, "heroStatOneLabel")],
    [getValue(data, "heroStatTwo"), getValue(data, "heroStatTwoLabel")],
    [getValue(data, "heroStatThree"), getValue(data, "heroStatThreeLabel")],
  ];
  return (
    <section data-template-section-type="stats" className="border-y border-[var(--p)]/20 bg-[var(--surface)] px-5 py-14 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        {stats.map(([n, l]) => (
          <div key={l} className="t-card border border-[var(--p)]/20 p-6 text-center">
            <div className="t-display text-4xl font-bold text-[var(--p)] md:text-5xl">{n}</div>
            <div className="mt-2 text-sm text-[var(--muted)]">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Showcase({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="showcase" className="px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div className="overflow-hidden border border-[var(--p)]/20">
          <img src={getValue(data, "sectionImage")} alt="" className="h-[420px] w-full object-cover transition duration-700 hover:scale-105" />
        </div>
        <div>
          <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data, "sectionFourTitle")}</h2>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 grid gap-4">
            {["אבחון כושר", "תוכנית אישית", "מעקב שבועי"].map((step, i) => (
              <div key={step} className="t-card flex items-center gap-4 border border-[var(--p)]/20 bg-[var(--surface)] p-4">
                <span className="grid h-10 w-10 place-items-center bg-[var(--p)] text-sm font-bold text-[var(--dark)]">{i + 1}</span>
                <span className="font-semibold">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Process({ data }: { data: Record<string, any> }) {
  const steps = [
    ["01", "היכרות", "מבינים מטרות, קהל ואילוצים."],
    ["02", "תכנון", "בונים מסלול פעולה מדיד."],
    ["03", "ביצוע", "מיישמים עם בקרה שוטפת."],
    ["04", "שיפור", "מדידה ואופטימיזציה מתמדת."],
  ];
  return (
    <section data-template-section-type="process" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data, "sectionFiveTitle")}</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([num, title, text]) => (
            <article key={num} className="t-card border border-[var(--p)]/20 bg-[var(--bg)] p-6">
              <div className="t-display text-3xl text-[var(--p)]">{num}</div>
              <h3 className="mt-3 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{text}</p>
            </article>
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
    <section data-template-section-type="testimonials" className="px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data, "sectionSixTitle")}</h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {reviews.map(([text, name, role]) => (
            <blockquote key={name} className="t-card border border-[var(--p)]/20 bg-[var(--surface)] p-7">
              <p className="leading-8 text-[var(--text)]">"{text}"</p>
              <footer className="mt-6 border-t border-[var(--p)]/15 pt-4">
                <p className="font-bold">{name}</p>
                <p className="text-sm text-[var(--muted)]">{role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
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
    <section data-template-section-type="faq" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="t-display text-center text-4xl font-bold md:text-5xl">{getValue(data, "sectionSevenTitle")}</h2>
        <div className="mt-10 space-y-3">
          {faqs.map(([q, a], i) => (
            <div key={q} className="t-card border border-[var(--p)]/20 bg-[var(--bg)]">
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-right">
                <span className="font-bold">{q}</span>
                <span className="grid h-8 w-8 place-items-center bg-[var(--p)] text-[var(--dark)]">{open === i ? "−" : "+"}</span>
              </button>
              {open === i ? <p className="px-5 pb-5 text-sm leading-7 text-[var(--muted)]">{a}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="contact" className="px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <div>
          <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-4 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 space-y-3 text-sm">
            <p><span className="text-[var(--p)]">טלפון</span> · {getValue(data, "phone")}</p>
            <p><span className="text-[var(--p)]">אימייל</span> · {getValue(data, "email")}</p>
            <p><span className="text-[var(--p)]">כתובת</span> · {getValue(data, "address")}</p>
          </div>
        </div>
        <form className="t-card grid gap-4 border border-[var(--p)]/20 bg-[var(--surface)] p-8">
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="שם מלא" />
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="טלפון" />
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="אימייל" />
          <button type="button" onClick={openModal} className="bg-[var(--p)] px-7 py-4 text-sm font-bold text-[var(--dark)]">{getValue(data, "contactButton")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="border-t border-[var(--p)]/20 px-5 pb-10 pt-16 lg:px-8">
      <div className="mx-auto max-w-7xl border border-[var(--p)]/25 bg-[var(--surface)] p-10 text-center lg:p-16" style={{ borderRadius: 0 }}>
        <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data, "ctaTitle")}</h2>
        <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={openModal} className="mt-8 bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-[var(--dark)]">{getValue(data, "ctaButton")}</button>
      </div>
      <p className="mt-8 text-center text-xs text-[var(--muted)]">© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-[var(--p)]/30 bg-[var(--surface)] p-8" style={{ borderRadius: 0 }}>
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl">×</button>
        <h3 className="t-display text-3xl font-bold">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3">
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none" placeholder="שם מלא" />
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none" placeholder="טלפון" />
          <button type="button" className="bg-[var(--p)] py-4 text-sm font-bold text-[var(--dark)]">{getValue(data, "contactButton")}</button>
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
      <Stats data={data} />
      <Showcase data={data} />
      <Process data={data} />
      <Testimonials data={data} />
      <Faq data={data} />
      <Contact data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function PulsefitPages(props: PulsefitPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...pulsefitDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "pulsefit-preview" : "pulsefit"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: pulsefitEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
