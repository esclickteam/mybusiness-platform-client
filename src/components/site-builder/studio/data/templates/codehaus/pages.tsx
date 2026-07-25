import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { codehausDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { codehausEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const codehausPages = [{ id: "home", label: "בית", slug: "/" }];

type CodehausPagesProps = {
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
  return data?.[key] ?? (codehausDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 border-b border-[var(--p)]/30 bg-black/90 font-mono text-xs backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <span className="text-[var(--p)]">~/edu/<span className="text-white">{getValue(data,"brandName").toLowerCase()}</span></span>
        <div className="flex gap-4 text-[var(--muted)]">
          <span className="hidden sm:inline">branch: main</span>
          <button type="button" onClick={openModal} className="border border-[var(--p)] px-3 py-1 text-[var(--p)]">apply --now</button>
        </div>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] bg-black px-5 pt-24 lg:px-8">
      <div className="absolute inset-0 opacity-30"><img src={getValue(data,"heroImage")} alt="" className="t-ken h-full w-full object-cover grayscale" /></div>
      <div className="relative z-10 mx-auto max-w-4xl border border-[var(--p)]/40 bg-black/85 p-6 font-mono md:p-10">
        <div className="mb-4 flex gap-2"><span className="h-3 w-3 rounded-full bg-red-500" /><span className="h-3 w-3 rounded-full bg-yellow-500" /><span className="h-3 w-3 rounded-full bg-[var(--p)]" /></div>
        <Reveal>
          <p className="text-[var(--muted)]">$ whoami</p>
          <h1 className="t-display mt-2 text-4xl font-bold text-[var(--p)] md:text-6xl">{getValue(data,"brandName")}</h1>
          <p className="mt-4 text-sm text-white/80 md:text-base">{getValue(data,"heroTitle")}</p>
          <p className="mt-4 max-w-xl text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <p className="mt-6 text-[var(--p)]">$ npm run career<span className="t-pulse inline-block">_</span></p>
          <button type="button" onClick={openModal} className="mt-8 border border-[var(--p)] bg-[var(--p)]/10 px-6 py-3 text-sm font-bold text-[var(--p)]">{getValue(data,"heroPrimaryButton")}</button>
        </Reveal>
      </div>
    </section>
  );
}

function Courses({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="courses" className="px-5 py-20 font-mono lg:px-8">
      <Reveal><h2 className="text-2xl text-[var(--p)]">// {getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-8 max-w-4xl space-y-4">
        {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*80} className="t-hover border border-[var(--p)]/30 bg-[var(--surface)] p-5">
            <pre className="text-xs text-[var(--muted)]">{"{"}"</pre>
            <p className="text-[var(--p)]">"track": "{title}",</p>
            <p className="text-white/80">"desc": "{text}",</p>
            <p className="text-[var(--a)]">"price": {[8900,12000,6500][i]}</p>
            <pre className="text-xs text-[var(--muted)]">{"}"}</pre>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Curriculum({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="curriculum" className="border-y border-[var(--p)]/20 bg-[var(--surface)] px-5 py-24 font-mono lg:px-8">
      <Reveal><h2 className="text-2xl text-[var(--p)]">git log --curriculum</h2></Reveal>
      <div className="relative mx-auto mt-10 max-w-3xl border-r-2 border-[var(--p)]/40 pr-8">
        {[["feat: setup env","שבוע 1-2"],["feat: first app","שבוע 3-6"],["feat: APIs","שבוע 7-10"],["release: portfolio","שבוע 11-12"]].map(([c,w],i) => (
          <Reveal key={c} delayMs={i*90} className="relative mb-8">
            <span className="absolute -right-[41px] top-1 h-4 w-4 rounded-full bg-[var(--p)]" />
            <p className="text-xs text-[var(--muted)]">commit {i+1} · {w}</p>
            <p className="text-lg text-white">{c}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Instructors({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="instructors" className="px-5 py-24 font-mono lg:px-8">
      <Reveal><h2 className="text-2xl text-[var(--p)]">contributors</h2></Reveal>
      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["@noa","mentor"],["@itai","fullstack"],["@michal","data"],["@gal","devops"]].map(([h,r],i) => (
          <Reveal key={h} delayMs={i*70} className="t-hover border border-[var(--p)]/25 p-4">
            <div className="mb-3 h-16 w-16 overflow-hidden bg-[var(--surface)]"><img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover" /></div>
            <p className="text-[var(--p)]">{h}</p>
            <p className="text-xs text-[var(--muted)]">{r}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="stats" className="bg-black px-5 py-16 font-mono lg:px-8">
      <div className="mx-auto max-w-3xl border border-[var(--p)]/40 p-6 text-[var(--p)]">
        <p className="mb-4 text-xs text-[var(--muted)]">$ ./stats --ascii</p>
        {[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l]) => (
          <div key={l} className="flex justify-between border-b border-[var(--p)]/20 py-3 text-sm">
            <span>{l}</span><span className="font-bold text-white">{n}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="testimonials" className="px-5 py-24 font-mono lg:px-8">
      <Reveal><h2 className="text-2xl text-[var(--p)]">pull requests / reviews</h2></Reveal>
      <div className="mx-auto mt-8 max-w-3xl space-y-4">
        {[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text,name,role],i) => (
          <Reveal key={name} delayMs={i*80} className="t-hover border border-[var(--p)]/30 bg-[var(--surface)] p-5">
            <p className="text-xs text-[var(--a)]">PR #{120+i} merged · {role}</p>
            <p className="mt-2 text-white/90">"{text}"</p>
            <p className="mt-3 text-sm text-[var(--p)]">@{name.replace(" ","_").toLowerCase()}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Faq({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="faq" className="bg-[var(--surface)] px-5 py-24 font-mono lg:px-8">
      <div className="mx-auto max-w-3xl border border-[var(--p)]/30 p-6">
        <p className="text-[var(--muted)]">console.faq()</p>
        {[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70} className="mt-5 border-t border-[var(--p)]/20 pt-5">
            <p className="text-[var(--p)]">Q: {q}</p>
            <p className="mt-2 text-sm text-white/70">A: {a}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="contact" className="px-5 py-24 font-mono lg:px-8">
      <div className="mx-auto max-w-xl border border-[var(--p)]/40 bg-black p-6">
        <Reveal>
          <p className="text-xs text-[var(--muted)]">// application.js</p>
          <h2 className="mt-2 text-xl text-[var(--p)]">{getValue(data,"contactTitle")}</h2>
        </Reveal>
        <form className="mt-6 grid gap-3">
          <input className="border border-[var(--p)]/30 bg-transparent px-4 py-3 text-[var(--p)] outline-none" placeholder="name =" />
          <input className="border border-[var(--p)]/30 bg-transparent px-4 py-3 text-[var(--p)] outline-none" placeholder="email =" />
          <button type="button" onClick={openModal} className="bg-[var(--p)] py-3 font-bold text-black">node submit.js</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="border-t border-[var(--p)]/20 px-5 py-8 font-mono text-xs text-[var(--muted)] lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3">
        <span>© {new Date().getFullYear()} {getValue(data,"brandName")} — exit 0</span>
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

export default function CodehausPages(props: CodehausPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...codehausDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "codehaus-preview" : "codehaus"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: codehausEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
