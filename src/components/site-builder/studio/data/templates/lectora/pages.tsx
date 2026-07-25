import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { lectoraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { lectoraEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const lectoraPages = [{ id: "home", label: "בית", slug: "/" }];

type LectoraPagesProps = {
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
  return data?.[key] ?? (lectoraDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <nav className="hidden gap-6 text-sm text-white/70 md:flex">
          <a href="#courses">{getValue(data,"navCourses")}</a>
          <a href="#faq">{getValue(data,"navAbout")}</a>
          <a href="#contact">{getValue(data,"navContact")}</a>
        </nav>
        <button type="button" onClick={openModal} className="t-pulse bg-[var(--a)] px-5 py-2.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)] via-[var(--dark)]/70 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
        <Reveal variant="up">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--a)]">{getValue(data,"heroEyebrow")}</p>
          <h1 className="t-display t-anim mt-4 text-6xl font-extrabold leading-[0.92] text-white md:text-8xl lg:text-9xl">{getValue(data,"brandName")}</h1>
          <p className="t-anim t-d1 mt-3 whitespace-pre-line text-2xl font-semibold text-white/90 md:text-4xl">{getValue(data,"heroTitle")}</p>
          <p className="t-anim t-d2 mt-5 max-w-xl text-lg text-white/70">{getValue(data,"heroSubtitle")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button type="button" onClick={openModal} className="t-pulse bg-[var(--p)] px-8 py-4 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
            <button type="button" className="border border-white/30 px-8 py-4 text-sm font-semibold text-white">{getValue(data,"heroSecondaryButton")}</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Courses({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="courses" data-template-section-type="courses" className="overflow-hidden border-y border-[var(--p)]/30 bg-[var(--surface)] py-10">
      <div className="t-marquee flex gap-8 whitespace-nowrap px-4">
        {[...[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]], ...[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]]].map(([title], i) => (
          <span key={i} className="inline-flex items-center gap-4 text-2xl font-bold text-[var(--p)]">
            <span className="h-2 w-2 rounded-full bg-[var(--a)]" />{title}<span className="text-[var(--muted)]">· קורס חי</span>
          </span>
        ))}
      </div>
      <div className="mx-auto mt-10 grid max-w-7xl gap-4 px-5 md:grid-cols-3 lg:px-8">
        {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
          <Reveal key={title} delayMs={i * 90} className="t-hover border border-[var(--p)]/30 bg-[var(--bg)] p-6">
            <div className="text-3xl font-bold text-[var(--a)]">₪{[890, 1290, 1590][i]}</div>
            <h3 className="mt-3 text-xl font-bold">{title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Curriculum({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="curriculum" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
        <div className="mt-10 space-y-3">
          {[["01","פתיחה וקונספט"],["02","תרגול מודרך"],["03","פרויקט גמר"],["04","משוב ומנטורינג"]].map(([n,t],i) => (
            <Reveal key={n} delayMs={i*70}>
              <details className="t-hover group border border-[var(--p)]/25 bg-[var(--surface)] open:border-[var(--a)]">
                <summary className="flex cursor-pointer list-none items-center gap-5 p-5 font-bold">
                  <span className="t-display text-2xl text-[var(--p)]">{n}</span>{t}
                </summary>
                <p className="px-5 pb-5 text-sm text-[var(--muted)]">שיעורים מוקלטים + מפגש חי שבועי עם המנחה.</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Instructors({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="instructors" className="bg-[var(--surface)] px-5 py-24 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl text-4xl font-bold md:text-5xl">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-5 overflow-x-auto pb-4">
        {[["נועה","בימוי"],["איתי","מוצר"],["מיכל","AI"],["גל","שיווק"]].map(([n,r],i) => (
          <Reveal key={n} delayMs={i*80} className="t-hover min-w-[200px] shrink-0">
            <div className="aspect-[3/4] overflow-hidden bg-[var(--bg)]">
              <img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover opacity-80 transition duration-700 hover:scale-110" />
            </div>
            <p className="mt-3 font-bold">{n}</p>
            <p className="text-sm text-[var(--p)]">{r}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="stats" className="px-5 py-20 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-8">
        {[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l],i) => (
          <Reveal key={l} delayMs={i*100} variant="scale" className="t-float t-hover grid h-40 w-40 place-items-center rounded-full border border-[var(--p)] bg-[var(--surface)] text-center" style={{animationDelay:`${i*0.4}s`}}>
            <div><div className="t-display text-3xl font-bold text-[var(--a)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="testimonials" className="overflow-hidden border-y border-[var(--p)]/25 bg-[var(--dark)] py-8">
      <div className="t-marquee flex gap-16 whitespace-nowrap text-lg">
        {[...[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]], ...[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]]].map(([text,name],i) => (
          <span key={i} className="text-white/80">"{text}" — <span className="text-[var(--a)]">{name}</span></span>
        ))}
      </div>
    </section>
  );
}

function Faq({ data }: { data: Record<string, any> }) {
  return (
    <section id="faq" data-template-section-type="faq" className="px-5 py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[280px_1fr]">
        <Reveal><h2 className="t-display sticky top-28 text-4xl font-bold">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        <div className="space-y-3">
          {[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a],i) => (
            <Reveal key={q} delayMs={i*80}>
              <details className="border-r-4 border-[var(--a)] bg-[var(--surface)] p-5">
                <summary className="cursor-pointer list-none font-bold">{q}</summary>
                <p className="mt-3 text-sm text-[var(--muted)]">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="contact" data-template-section-type="contact" className="px-5 py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl overflow-hidden border border-[var(--p)]/30 lg:grid-cols-2">
        <div className="bg-[var(--p)] p-10 text-[var(--dark)] lg:p-14">
          <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"contactTitle")}</h2>
          <p className="mt-4 opacity-80">{getValue(data,"contactText")}</p>
          <p className="mt-8 text-sm">{getValue(data,"phone")}</p>
          <p className="text-sm">{getValue(data,"email")}</p></Reveal>
        </div>
        <form className="grid gap-4 bg-[var(--surface)] p-10 lg:p-14">
          <input className="border border-[var(--p)]/30 bg-transparent px-5 py-4 outline-none" placeholder="שם מלא" />
          <input className="border border-[var(--p)]/30 bg-transparent px-5 py-4 outline-none" placeholder="טלפון" />
          <button type="button" onClick={openModal} className="bg-[var(--a)] py-4 text-sm font-bold text-white">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="border-t border-[var(--p)]/20 px-5 py-12 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <span className="t-display text-2xl font-bold text-[var(--p)]">{getValue(data,"brandName")}</span>
        <p className="text-sm text-[var(--muted)]">© {new Date().getFullYear()} · {getValue(data,"address")}</p>
        <button type="button" onClick={openModal} className="border border-[var(--a)] px-5 py-2 text-sm text-[var(--a)]">{getValue(data,"ctaButton")}</button>
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

export default function LectoraPages(props: LectoraPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...lectoraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "lectora-preview" : "lectora"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: lectoraEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
