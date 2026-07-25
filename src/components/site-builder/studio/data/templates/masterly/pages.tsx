import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { masterlyDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { masterlyEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const masterlyPages = [{ id: "home", label: "בית", slug: "/" }];

type MasterlyPagesProps = {
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
  return data?.[key] ?? (masterlyDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-8">
        <nav className="hidden gap-8 text-[10px] uppercase tracking-[0.35em] text-[var(--a)] md:flex">
          <a href="#courses">{getValue(data,"navCourses")}</a>
          <a href="#contact">{getValue(data,"navContact")}</a>
        </nav>
        <button type="button" onClick={openModal} className="border border-[var(--p)] px-5 py-2 text-[10px] uppercase tracking-[0.25em] text-[var(--p)]">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden bg-black">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-5 text-center">
        <Reveal variant="fade">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--a)]">{getValue(data,"heroEyebrow")}</p>
          <h1 className="t-display mt-6 text-7xl font-semibold tracking-[0.08em] text-[var(--p)] md:text-9xl">{getValue(data,"brandName")}</h1>
          <div className="mx-auto mt-6 h-px w-24 bg-[var(--p)]" />
          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[var(--muted)] md:text-base">{getValue(data,"heroSubtitle")}</p>
          <button type="button" onClick={openModal} className="t-pulse mt-10 border border-[var(--p)] bg-[var(--p)]/10 px-10 py-4 text-xs uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data,"heroPrimaryButton")}</button>
        </Reveal>
      </div>
    </section>
  );
}

function Courses({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="courses" data-template-section-type="courses" className="px-5 py-28 lg:px-8">
      <Reveal className="mx-auto max-w-6xl"><h2 className="t-display text-center text-4xl text-[var(--p)] md:text-5xl">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-16 grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal variant="scale" className="relative min-h-[360px] overflow-hidden">
          <img src={getValue(data,"sectionImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-0 p-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--a)]">Featured</p>
            <h3 className="t-display mt-2 text-3xl text-white">{getValue(data,"itemOneTitle")}</h3>
            <p className="mt-2 max-w-md text-sm text-white/70">{getValue(data,"itemOneText")}</p>
          </div>
        </Reveal>
        <div className="space-y-6">
          {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].slice(1).map(([title,text],i) => (
            <Reveal key={title} delayMs={i*100} className="t-hover border-b border-[var(--p)]/30 pb-6">
              <h3 className="t-display text-2xl text-[var(--p)]">{title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Curriculum({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="curriculum" className="bg-[var(--surface)] px-5 py-28 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="mx-auto mt-16 max-w-4xl space-y-12">
        {[["I","פתיחה והקשר"],["II","עומק ותרגול"],["III","שיא ובמה"]].map(([n,t],i) => (
          <Reveal key={n} delayMs={i*100} className="t-hover flex items-baseline gap-8 border-b border-white/10 pb-8">
            <span className="t-display text-7xl text-[var(--p)]/40 md:text-9xl">{n}</span>
            <div><p className="text-xs uppercase tracking-[0.3em] text-[var(--a)]">Chapter</p><h3 className="mt-2 text-2xl text-white">{t}</h3></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Instructors({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="instructors" className="px-5 py-28 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
        {[["אלון","Story"],["נטע","Stage"],["יובל","Brand"]].map(([n,r],i) => (
          <Reveal key={n} delayMs={i*110} variant="scale" className="t-hover group text-center">
            <div className="relative mx-auto h-64 w-full overflow-hidden">
              <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_40%,#000_100%)]" />
              <img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            </div>
            <p className="t-display mt-4 text-2xl text-[var(--p)]">{n}</p>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">{r}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="stats" className="border-y border-[var(--p)]/20 px-5 py-16 lg:px-8">
      <div className="mx-auto flex max-w-4xl justify-between gap-6">
        {[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l],i) => (
          <Reveal key={l} delayMs={i*80} className="text-center">
            <div className="t-display text-3xl text-[var(--p)] md:text-4xl">{n}</div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">{l}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="testimonials" className="relative overflow-hidden px-5 py-28 lg:px-8">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"sectionSixTitle")}</h2></Reveal>
        {[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].slice(0,2).map(([text,name],i) => (
          <Reveal key={name} delayMs={i*120} className="mt-14">
            <p className="text-xl leading-10 text-white/90 md:text-2xl">"{text}"</p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[var(--a)]">{name}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Faq({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="faq" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Reveal className="mb-12 text-center"><h2 className="t-display text-3xl text-[var(--p)]">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        {[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70} className="mb-8 text-center">
            <p className="text-sm font-medium text-white">{q}</p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[var(--muted)]">{a}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="contact" data-template-section-type="contact" className="px-5 py-28 lg:px-8">
      <div className="mx-auto max-w-md border border-[var(--p)]/40 p-10 text-center">
        <Reveal>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--a)]">Exclusive</p>
          <h2 className="t-display mt-3 text-3xl text-[var(--p)]">{getValue(data,"contactTitle")}</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">{getValue(data,"contactText")}</p>
        </Reveal>
        <form className="mt-8 grid gap-3 text-right">
          <input className="border border-[var(--p)]/30 bg-transparent px-5 py-4 text-sm outline-none" placeholder="שם מלא" />
          <input className="border border-[var(--p)]/30 bg-transparent px-5 py-4 text-sm outline-none" placeholder="אימייל" />
          <button type="button" onClick={openModal} className="bg-[var(--p)] py-4 text-xs font-bold uppercase tracking-[0.25em] text-black">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="border-t border-[var(--p)]/20 px-5 py-12 text-center lg:px-8">
      <p className="t-display text-2xl tracking-[0.2em] text-[var(--p)]">{getValue(data,"brandName")}</p>
      <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">{getValue(data,"ctaTitle")}</p>
      <p className="mt-8 text-[10px] text-[var(--muted)]">© {new Date().getFullYear()}</p>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-[var(--p)]/30 bg-[var(--surface)] p-8">
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
      <Courses data={data} openModal={openModal} />
      <Curriculum data={data} />
      <Instructors data={data} />
      <Stats data={data} />
      <Testimonials data={data} />
      <Faq data={data} />
      <Contact data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function MasterlyPages(props: MasterlyPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...masterlyDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "masterly-preview" : "masterly"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: masterlyEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
