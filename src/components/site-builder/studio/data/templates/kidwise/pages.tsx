import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { kidwiseDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { kidwiseEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const kidwisePages = [{ id: "home", label: "בית", slug: "/" }];

type KidwisePagesProps = {
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
  return data?.[key] ?? (kidwiseDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 bg-[var(--bg)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="t-float grid h-11 w-11 place-items-center rounded-2xl bg-[var(--a)] text-lg font-bold text-[var(--dark)]">{getValue(data,"logoText")}</span>
          <span className="t-display text-xl font-bold text-[var(--dark)]">{getValue(data,"brandName")}</span>
        </div>
        <button type="button" onClick={openModal} className="rounded-full bg-[var(--p)] px-5 py-2.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-l from-[var(--bg)] via-[var(--bg)]/88 to-[var(--bg)]/35" />
      <div className="t-float absolute -left-10 top-24 h-40 w-40 rounded-full bg-[var(--a)]/45" />
      <div className="t-float absolute right-10 top-40 h-24 w-24 rounded-full bg-[var(--p)]/35" style={{animationDelay:"1s"}} />
      <div className="t-pulse absolute bottom-28 left-1/3 h-16 w-16 rotate-12 bg-[var(--a)]/50" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-center px-5 py-24 lg:px-8">
        <Reveal variant="right" className="max-w-xl">
          <h1 className="t-display text-5xl font-bold leading-[1.05] text-[var(--dark)] md:text-7xl">{getValue(data,"brandName")}</h1>
          <p className="mt-4 whitespace-pre-line text-xl text-[var(--p)] md:text-2xl">{getValue(data,"heroTitle")}</p>
          <p className="mt-4 text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <button type="button" onClick={openModal} className="t-pulse mt-8 rounded-full bg-[var(--a)] px-8 py-4 text-sm font-bold text-[var(--dark)]">{getValue(data,"heroPrimaryButton")}</button>
        </Reveal>
      </div>
    </section>
  );
}

function Courses({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="courses" className="px-5 py-20 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-6">
        {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*90} className="t-hover flex items-center gap-5">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full text-2xl font-bold text-white" style={{background:["#10B981","#FBBF24","#34D399"][i]}}>{i+1}</span>
            <div className="flex-1 rounded-3xl bg-white p-5 shadow-sm">
              <h3 className="text-xl font-bold text-[var(--dark)]">{title}</h3>
              <p className="text-sm text-[var(--muted)]">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Curriculum({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="curriculum" className="bg-white px-5 py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["מגלים","סקרנות"],["מנסים","ידיים"],["יוצרים","גאווה"],["משתפים","חברים"]].map(([t,d],i) => (
          <Reveal key={t} delayMs={i*80} variant="up" className="t-hover rounded-3xl border-4 border-dashed p-6 text-center" style={{borderColor:["#10B981","#FBBF24","#34D399","#F59E0B"][i]}}>
            <div className="t-float mx-auto h-3 w-3 rounded-full" style={{background:["#10B981","#FBBF24","#34D399","#F59E0B"][i]}} />
            <h3 className="mt-3 text-lg font-bold text-[var(--dark)]">{t}</h3>
            <p className="text-sm text-[var(--muted)]">{d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Instructors({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="instructors" className="px-5 py-20 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex flex-wrap justify-center gap-8">
        {["תמר","יואב","שירה"].map((n,i) => (
          <Reveal key={n} delayMs={i*100} className="t-hover text-center">
            <div className="t-float mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-[var(--a)]" style={{animationDelay:i*0.4+"s"}}>
              <img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover" />
            </div>
            <p className="mt-3 font-bold text-[var(--dark)]">{n}</p>
            <p className="text-sm text-[var(--p)]">מורה חברותי/ת</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="stats" className="px-5 py-16 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-6">
        {[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l],i) => (
          <Reveal key={l} delayMs={i*80} className="t-float rounded-3xl bg-[var(--p)] px-8 py-6 text-center text-white" style={{animationDelay:i*0.35+"s"}}>
            <div className="t-display text-4xl font-bold">{n}</div>
            <div className="text-sm text-white/90">{l}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="testimonials" className="bg-white px-5 py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSixTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text,name],i) => (
          <Reveal key={name} delayMs={i*90} className="t-hover relative rounded-[2rem] bg-[var(--bg)] p-6">
            <div className="absolute -top-3 right-6 rounded-full bg-[var(--a)] px-3 py-1 text-xs font-bold">הורה</div>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">"{text}"</p>
            <p className="mt-4 font-bold text-[var(--p)]">{name}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Faq({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="faq" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <Reveal><h2 className="t-display mb-8 text-center text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        {[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70}>
            <details className="t-hover overflow-hidden rounded-3xl bg-white shadow-sm">
              <summary className="cursor-pointer list-none p-6 text-lg font-bold text-[var(--dark)]">{q}</summary>
              <p className="px-6 pb-6 text-[var(--muted)]">{a}</p>
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
      <div className="mx-auto max-w-lg rounded-[2rem] bg-[var(--a)] p-8 text-[var(--dark)]">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"contactTitle")}</h2>
        <p className="mt-2 text-sm opacity-80">להורים — נחזור אליכם במהירות</p></Reveal>
        <form className="mt-6 grid gap-3">
          <input className="rounded-2xl border-0 px-5 py-4 outline-none" placeholder="שם ההורה" />
          <input className="rounded-2xl border-0 px-5 py-4 outline-none" placeholder="טלפון" />
          <input className="rounded-2xl border-0 px-5 py-4 outline-none" placeholder="גיל הילד/ה" />
          <button type="button" onClick={openModal} className="rounded-2xl bg-[var(--dark)] py-4 font-bold text-white">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="px-5 py-12 text-center lg:px-8">
      <p className="t-display text-3xl font-bold text-[var(--p)]">{getValue(data,"brandName")}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{getValue(data,"ctaTitle")}</p>
      <p className="mt-6 text-xs text-[var(--muted)]">© {new Date().getFullYear()}</p>
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

export default function KidwisePages(props: KidwisePagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...kidwiseDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "kidwise-preview" : "kidwise"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: kidwiseEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
