import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { skillforgeDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { skillforgeEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const skillforgePages = [{ id: "home", label: "בית", slug: "/" }];

type SkillforgePagesProps = {
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
  return data?.[key] ?? (skillforgeDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 border-b-2 border-[var(--p)] bg-[var(--dark)]">
      <div className="mx-auto flex max-w-7xl items-stretch lg:px-0">
        <div className="flex items-center bg-[var(--p)] px-5 py-3 text-sm font-black uppercase tracking-wider text-[var(--dark)]">{getValue(data,"brandName")}</div>
        <div className="flex flex-1 items-center justify-end gap-4 px-5 text-xs uppercase tracking-widest text-[var(--muted)]">
          <span className="hidden sm:inline">{getValue(data,"heroEyebrow")}</span>
          <button type="button" onClick={openModal} className="border border-[var(--p)] px-4 py-2 text-[var(--p)]">{getValue(data,"heroPrimaryButton")}</button>
        </div>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[90svh] overflow-hidden bg-[var(--bg)] px-5 py-20 lg:px-8">
      <div className="absolute inset-0 opacity-25"><img src={getValue(data,"heroImage")} alt="" className="t-ken h-full w-full object-cover grayscale" /></div>
      <div className="relative z-10 mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
          <h1 className="t-display mt-4 text-7xl font-bold uppercase leading-[0.88] text-white md:text-9xl">{getValue(data,"brandName")}</h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <button type="button" onClick={openModal} className="t-pulse mt-10 bg-[var(--p)] px-10 py-4 text-sm font-black uppercase text-[var(--dark)]">{getValue(data,"heroPrimaryButton")}</button>
        </Reveal>
      </div>
    </section>
  );
}

function Courses({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="courses" className="px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold uppercase text-[var(--p)]">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 max-w-5xl space-y-4">
        {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*80} className="t-hover flex items-center gap-6 border-2 border-[var(--muted)]/30 bg-[var(--surface)] p-5" style={{clipPath:"polygon(0 0, 100% 0, 100% 85%, 96% 100%, 0 100%)"}}>
            <span className="t-display text-4xl text-[var(--p)]">0{i+1}</span>
            <div><h3 className="text-xl font-bold uppercase">{title}</h3><p className="text-sm text-[var(--muted)]">{text}</p></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Curriculum({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="curriculum" className="border-y-2 border-[var(--p)] bg-[var(--surface)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold uppercase">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="mt-10 flex gap-4 overflow-x-auto pb-4">
        {["אבחון חום","חישול ליבה","צינון תרגול","הקשחה בשטח"].map((s,i) => (
          <Reveal key={s} delayMs={i*90} className="t-hover min-w-[220px] shrink-0 border border-[var(--p)] p-6">
            <div className="mb-4 h-1 w-full bg-[var(--p)]" />
            <p className="text-xs text-[var(--p)]">STAGE {i+1}</p>
            <p className="mt-2 text-xl font-bold uppercase">{s}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Instructors({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="instructors" className="px-5 py-24 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold uppercase text-[var(--p)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
        {[["רן כהן","COACH"],["דנה לוי","LEAD"],["עידו שמש","PRO"]].map(([n,r],i) => (
          <Reveal key={n} delayMs={i*90} className="t-hover border-2 border-[var(--p)] bg-[var(--surface)] p-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden border border-[var(--p)]"><img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover grayscale" /></div>
              <div>
                <p className="text-[10px] text-[var(--p)]">ID · 00{i+1}</p>
                <p className="font-bold uppercase">{n}</p>
                <p className="text-xs text-[var(--muted)]">{r}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="stats" className="bg-black px-5 py-12 lg:px-8">
      <div className="mx-auto grid max-w-5xl grid-cols-3 gap-3">
        {[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l]) => (
          <div key={l} className="t-pulse border border-[var(--p)] bg-[var(--dark)] p-4 text-center">
            <div className="t-display text-3xl font-bold text-[var(--p)] md:text-5xl" style={{textShadow:"0 0 12px #A3E63588"}}>{n}</div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-[var(--muted)]">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="testimonials" className="overflow-hidden border-y border-[var(--p)]/40 py-6">
      <div className="t-marquee flex gap-12 whitespace-nowrap text-sm uppercase tracking-wider text-[var(--p)]">
        {[...[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]], ...[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]]].map(([text,name],i) => (
          <span key={i}><span className="text-white">{name}</span>: {text}</span>
        ))}
      </div>
    </section>
  );
}

function Faq({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="faq" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="t-display mb-8 text-4xl font-bold uppercase text-[var(--p)]">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        {[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70} className="mb-4 border-2 border-[var(--muted)]/40 bg-[var(--surface)]">
            <div className="flex items-start gap-3 p-5">
              <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[var(--p)]" />
              <div><p className="font-bold uppercase">{q}</p><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="contact" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-xl border-2 border-[var(--p)] p-8">
        <Reveal><h2 className="t-display text-3xl font-bold uppercase text-[var(--p)]">{getValue(data,"contactTitle")}</h2></Reveal>
        <form className="mt-6 grid gap-3">
          <input className="border border-[var(--muted)]/40 bg-transparent px-4 py-3 uppercase outline-none" placeholder="FULL NAME" />
          <input className="border border-[var(--muted)]/40 bg-transparent px-4 py-3 uppercase outline-none" placeholder="PHONE" />
          <button type="button" onClick={openModal} className="bg-[var(--p)] py-4 font-black uppercase text-[var(--dark)]">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="border-t-2 border-[var(--p)] px-5 py-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-widest">
        <span className="text-[var(--p)]">{getValue(data,"brandName")}</span>
        <span className="text-[var(--muted)]">{getValue(data,"ctaTitle")}</span>
        <button type="button" onClick={openModal} className="text-[var(--p)]">{getValue(data,"ctaButton")}</button>
      </div>
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

export default function SkillforgePages(props: SkillforgePagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...skillforgeDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "skillforge-preview" : "skillforge"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: skillforgeEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
