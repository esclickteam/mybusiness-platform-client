import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { craftoraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { craftoraEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const craftoraPages = [{ id: "home", label: "בית", slug: "/" }];

type CraftoraPagesProps = {
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
  return data?.[key] ?? (craftoraDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="absolute inset-x-0 top-0 z-50 mix-blend-difference">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 text-white lg:px-8">
        <span className="t-display text-2xl tracking-wide">{getValue(data,"brandName")}</span>
        <nav className="hidden gap-8 text-xs uppercase tracking-[0.2em] md:flex">
          <a href="#courses">{getValue(data,"navCourses")}</a>
          <a href="#contact">{getValue(data,"navContact")}</a>
        </nav>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden bg-[var(--bg)]">
      <div className="absolute inset-0 grid grid-cols-3 gap-2 p-2 opacity-80">
        <img src={getValue(data,"heroImage")} alt="" className="t-ken h-full w-full object-cover" />
        <img src={getValue(data,"sectionImage")} alt="" className="t-ken h-full w-full object-cover" style={{animationDelay:"2s"}} />
        <img src={getValue(data,"heroImage")} alt="" className="t-ken h-full w-full object-cover grayscale" style={{animationDelay:"4s"}} />
      </div>
      <div className="absolute inset-0 bg-[var(--bg)]/55" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-start justify-end px-5 pb-20 lg:px-8">
        <Reveal>
          <h1 className="t-display text-6xl font-bold leading-[0.95] text-[var(--dark)] md:text-8xl">{getValue(data,"brandName")}</h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <button type="button" onClick={openModal} className="mt-8 bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
        </Reveal>
      </div>
    </section>
  );
}

function Courses({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="courses" data-template-section-type="courses" className="px-5 py-24 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 max-w-5xl space-y-8">
        {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*100} className={`t-hover grid items-center gap-6 md:grid-cols-2 ${i%2?"md:[&>div:first-child]:order-2":""}`}>
            <div className={`${i===1?"md:translate-x-8":""} border border-[var(--p)]/30 bg-white p-8`}>
              <h3 className="t-display text-3xl text-[var(--dark)]">{title}</h3>
              <p className="mt-3 text-[var(--muted)]">{text}</p>
            </div>
            <div className="h-48 overflow-hidden bg-[var(--surface)]"><img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover transition duration-700 hover:scale-105" /></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Curriculum({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="curriculum" className="overflow-hidden bg-[var(--dark)] px-5 py-24 text-[var(--bg)] lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="relative mx-auto mt-14 max-w-5xl">
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 rotate-12 bg-[var(--p)]/50" />
        {["חומר גלם","תרגול באטלייה","ביקורת עמיתים","תערוכה קטנה"].map((s,i) => (
          <Reveal key={s} delayMs={i*90} className={`relative mb-10 flex ${i%2?"justify-start":"justify-end"}`}>
            <div className="w-64 border border-[var(--p)] bg-[var(--dark)] p-5">
              <span className="text-[var(--p)]">0{i+1}</span>
              <p className="mt-2 text-xl font-bold">{s}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Instructors({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="instructors" className="px-5 py-24 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="relative mx-auto mt-16 h-[420px] max-w-4xl">
        {[["נועה",0],["איתי",1],["מיכל",2]].map(([n,i]) => (
          <Reveal key={n} delayMs={i*120} className="t-hover absolute w-48 overflow-hidden border-4 border-white shadow-lg" style={{top: i*40+"px", right: i*120+"px", zIndex: 3-i}}>
            <img src={getValue(data,"sectionImage")} alt="" className="h-56 w-full object-cover" />
            <p className="bg-white p-3 font-bold text-[var(--dark)]">{n}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="stats" className="bg-[var(--p)] px-5 py-14 text-white lg:px-8">
      <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4 text-center">
        {[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l]) => (
          <div key={l}><div className="t-display text-4xl font-bold">{n}</div><div className="mt-1 text-xs opacity-80">{l}</div></div>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="testimonials" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSixTitle")}</h2></Reveal>
        {[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text,name],i) => (
          <Reveal key={name} delayMs={i*100} className="mt-10 border-r-4 border-[var(--p)] pr-6">
            <p className="t-display text-2xl leading-10 text-[var(--dark)]">"{text}"</p>
            <p className="mt-3 text-sm text-[var(--muted)]">{name}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Faq({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="faq" className="bg-white px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="t-display mb-10 text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        {[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70} className="mb-6 grid grid-cols-[60px_1fr] gap-4">
            <span className="t-display text-4xl text-[var(--p)]">{i+1}</span>
            <div><p className="font-bold text-[var(--dark)]">{q}</p><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="contact" data-template-section-type="contact" className="px-5 py-24 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-10 border border-[var(--p)]/25 bg-white p-8 md:grid-cols-2 lg:p-12">
        <Reveal>
          <h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"contactTitle")}</h2>
          <p className="mt-4 text-[var(--muted)]">שעות הסטודיו</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--dark)]">
            <li>א׳–ה׳ · 10:00–20:00</li>
            <li>ו׳ · 09:00–13:00</li>
            <li>{getValue(data,"address")}</li>
          </ul>
        </Reveal>
        <form className="grid gap-3">
          <input className="border border-[var(--p)]/30 px-5 py-4 outline-none" placeholder="שם" />
          <input className="border border-[var(--p)]/30 px-5 py-4 outline-none" placeholder="טלפון" />
          <button type="button" onClick={openModal} className="bg-[var(--p)] py-4 font-bold text-white">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="border-t border-[var(--p)]/20 px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between text-sm">
        <span className="t-display text-xl text-[var(--p)]">{getValue(data,"brandName")}</span>
        <span className="text-[var(--muted)]">© {new Date().getFullYear()}</span>
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

export default function CraftoraPages(props: CraftoraPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...craftoraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "craftora-preview" : "craftora"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: craftoraEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
