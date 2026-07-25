import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { mentoraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { mentoraEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const mentoraPages = [{ id: "home", label: "בית", slug: "/" }];

type MentoraPagesProps = {
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
  return data?.[key] ?? (mentoraDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 border-b border-[var(--p)]/20 bg-[var(--dark)]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--p)] text-sm font-bold text-[var(--dark)]">{getValue(data,"logoText")}</span>
          <span className="text-sm font-semibold tracking-wide">{getValue(data,"brandName")}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
          <span>{getValue(data,"phone")}</span>
          <button type="button" onClick={openModal} className="bg-[var(--p)] px-4 py-2 font-bold text-[var(--dark)]">{getValue(data,"heroPrimaryButton")}</button>
        </div>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh]">
      <div className="grid min-h-[100svh] lg:grid-cols-2">
        <div className="sticky top-0 flex min-h-[50svh] flex-col justify-center bg-[var(--dark)] px-5 py-20 lg:min-h-[100svh] lg:px-12">
          <Reveal variant="right">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
            <h1 className="t-display mt-4 text-6xl font-bold leading-[0.95] text-[var(--p)] md:text-8xl">{getValue(data,"brandName")}</h1>
            <p className="mt-4 whitespace-pre-line text-2xl text-white md:text-3xl">{getValue(data,"heroTitle").replace(getValue(data,"brandName"),"").trim() || "ליווי שמשנה מסלול."}</p>
            <p className="mt-6 max-w-md text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
            <button type="button" onClick={openModal} className="t-pulse mt-8 w-fit bg-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--dark)]">{getValue(data,"heroPrimaryButton")}</button>
          </Reveal>
        </div>
        <div className="relative min-h-[50svh] overflow-hidden lg:min-h-[100svh]">
          <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function Courses({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="courses" className="px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 max-w-5xl space-y-6">
        {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*100} className="t-hover flex flex-col gap-2 border-b border-[var(--p)]/30 pb-6 md:flex-row md:items-end md:justify-between" style={{paddingInlineStart:`${i*2}rem`}}>
            <div><p className="text-xs text-[var(--p)]">מסלול 0{i+1}</p><h3 className="t-display text-3xl font-bold">{title}</h3><p className="mt-2 max-w-lg text-sm text-[var(--muted)]">{text}</p></div>
            <span className="text-xl font-bold text-[var(--p)]">₪{[2400,3600,4800][i]}/חודש</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Curriculum({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="curriculum" className="bg-[var(--surface)] px-5 py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="relative mx-auto mt-16 grid max-w-4xl place-items-center">
        <div className="t-pulse absolute h-64 w-64 rounded-full border border-[var(--p)]/40" />
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {["אבחון","מיפוי","ליווי","מדידה"].map((s,i) => (
            <Reveal key={s} delayMs={i*90} variant="scale" className="t-float grid h-28 w-28 place-items-center rounded-full border border-[var(--p)] bg-[var(--bg)] text-center text-sm font-bold" style={{animationDelay:`${i*0.3}s`}}>{s}</Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Instructors({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="instructors" className="px-5 py-24 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionFourTitle")}</h2></Reveal>
        <div className="mt-10 flex items-center -space-x-6 space-x-reverse">
          {[0,1,2,3,4].map((i) => (
            <div key={i} className="t-hover h-24 w-24 overflow-hidden rounded-full border-4 border-[var(--bg)]" style={{zIndex:5-i}}>
              <img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover" style={{filter:`hue-rotate(${i*20}deg)`}} />
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-[var(--muted)]">12 מנטורים פעילים · התאמה אישית</p>
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="stats" className="border-y border-[var(--p)]/25 bg-[var(--dark)]">
      <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-x-reverse divide-[var(--p)]/25">
        {[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l]) => (
          <div key={l} className="px-4 py-10 text-center">
            <div className="t-display text-3xl font-bold text-[var(--p)] md:text-5xl">{n}</div>
            <div className="mt-2 text-xs text-[var(--muted)] md:text-sm">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="testimonials" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionSixTitle")}</h2></Reveal>
        {[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text,name,role],i) => (
          <Reveal key={name} delayMs={i*100} className="t-hover border-r-2 border-[var(--p)] pr-6">
            <p className="text-xl leading-9">"{text}"</p>
            <footer className="mt-3 text-sm text-[var(--p)]">{name} · {role}</footer>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Faq({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="faq" className="bg-[var(--surface)] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="t-display mb-8 text-4xl font-bold">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        {[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70}>
            <details className="group mb-3 overflow-hidden bg-[var(--bg)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold transition group-open:bg-[var(--p)] group-open:text-[var(--dark)]">
                {q}<span className="text-xl">+</span>
              </summary>
              <p className="p-5 text-sm text-[var(--muted)]">{a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="contact" className="px-5 py-24 lg:px-8">
      <Reveal className="mx-auto max-w-xl text-center">
        <h2 className="t-display text-4xl font-bold">{getValue(data,"contactTitle")}</h2>
        <p className="mt-4 text-[var(--muted)]">{getValue(data,"contactText")}</p>
      </Reveal>
      <form className="mx-auto mt-10 grid max-w-xl gap-3">
        <input className="border border-[var(--p)]/30 bg-[var(--surface)] px-5 py-4 outline-none" placeholder="שם" />
        <input className="border border-[var(--p)]/30 bg-[var(--surface)] px-5 py-4 outline-none" placeholder="טלפון" />
        <select className="border border-[var(--p)]/30 bg-[var(--surface)] px-5 py-4 outline-none"><option>בחרו מסלול</option><option>קריירה</option><option>יזמות</option></select>
        <button type="button" onClick={openModal} className="bg-[var(--p)] py-4 font-bold text-[var(--dark)]">{getValue(data,"contactButton")}</button>
      </form>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="bg-[var(--dark)] px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="t-display text-3xl font-bold text-[var(--p)] md:text-5xl">{getValue(data,"ctaTitle")}</h2>
        <p className="mx-auto mt-4 max-w-lg text-[var(--muted)]">{getValue(data,"ctaText")}</p>
        <button type="button" onClick={openModal} className="t-pulse mt-8 bg-[var(--p)] px-10 py-4 font-bold text-[var(--dark)]">{getValue(data,"ctaButton")}</button>
        <p className="mt-10 text-xs text-[var(--muted)]">© {new Date().getFullYear()} {getValue(data,"brandName")}</p>
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

export default function MentoraPages(props: MentoraPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...mentoraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "mentora-preview" : "mentora"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: mentoraEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
