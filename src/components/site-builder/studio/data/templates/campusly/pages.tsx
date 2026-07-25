import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { campuslyDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { campuslyEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const campuslyPages = [{ id: "home", label: "בית", slug: "/" }];

type CampuslyPagesProps = {
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
  return data?.[key] ?? (campuslyDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 border-b border-[var(--p)]/15 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border-2 border-[var(--p)] text-sm font-bold text-[var(--p)]">{getValue(data,"logoText")}</span>
          <div>
            <p className="t-display text-lg font-bold text-[var(--dark)]">{getValue(data,"brandName")}</p>
            <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">Academic Tutoring</p>
          </div>
        </div>
        <button type="button" onClick={openModal} className="bg-[var(--p)] px-5 py-2.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[88svh] overflow-hidden">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[var(--dark)]/55" />
      <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-5xl flex-col items-center justify-center px-5 text-center text-white">
        <Reveal variant="scale">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--a)]">{getValue(data,"heroEyebrow")}</p>
          <h1 className="t-display mt-4 text-6xl font-bold md:text-8xl">{getValue(data,"brandName")}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">{getValue(data,"heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={openModal} className="t-pulse bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
            <button type="button" className="border border-white/40 px-8 py-3.5 text-sm font-semibold">{getValue(data,"heroSecondaryButton")}</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Courses({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="courses" className="px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-8 max-w-4xl overflow-hidden border border-[var(--p)]/20 bg-white">
        <div className="grid grid-cols-[1fr_100px_80px] bg-[var(--p)] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white">
          <span>מקצוע</span><span>רמה</span><span>ש״ס</span>
        </div>
        {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*70} className="t-hover grid grid-cols-[1fr_100px_80px] items-center border-t border-[var(--p)]/10 px-4 py-4">
            <div><p className="font-bold text-[var(--dark)]">{title}</p><p className="text-xs text-[var(--muted)]">{text}</p></div>
            <span className="text-sm text-[var(--p)]">{["5 יח׳","אקדמי","מתקדם"][i]}</span>
            <span className="font-bold text-[var(--dark)]">{[45,60,90][i]}</span>
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
      <div className="relative mx-auto mt-14 max-w-4xl">
        <div className="absolute left-0 right-0 top-6 h-0.5 bg-[var(--p)]/30" />
        <div className="relative grid grid-cols-4 gap-2">
          {["אבחון","סמסטר א׳","סמסטר ב׳","בחינה"].map((s,i) => (
            <Reveal key={s} delayMs={i*90} className="text-center">
              <div className="t-pulse mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full border-4 border-[var(--p)] bg-white text-sm font-bold text-[var(--p)]">{i+1}</div>
              <p className="text-sm font-bold text-[var(--dark)]">{s}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Instructors({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="instructors" className="px-5 py-24 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 max-w-4xl divide-y divide-[var(--p)]/15 border border-[var(--p)]/15 bg-white">
        {[["ד״ר יעל אברהם","מתמטיקה"],["פרופ׳ דן לוי","אנגלית"],["מיכל כץ","פסיכומטרי"]].map(([n,r],i) => (
          <Reveal key={n} delayMs={i*80} className="t-hover flex items-center gap-5 p-5">
            <div className="h-14 w-14 overflow-hidden rounded-full bg-[var(--bg)]"><img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover" /></div>
            <div className="flex-1"><p className="font-bold text-[var(--dark)]">{n}</p><p className="text-sm text-[var(--p)]">{r}</p></div>
            <span className="text-xs text-[var(--muted)]">קבלה</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="stats" className="bg-[var(--dark)] px-5 py-14 text-white lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-around gap-8">
        {[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l],i) => (
          <Reveal key={l} delayMs={i*80} className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-[var(--a)]">GPA / KPI</p>
            <div className="t-display text-5xl font-bold">{n}</div>
            <div className="text-sm text-white/70">{l}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="testimonials" className="px-5 py-24 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSixTitle")}</h2></Reveal>
        <div className="mx-auto mt-12 max-w-3xl space-y-12">
        {[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text,name,role],i) => (
          <Reveal key={name} delayMs={i*100} className={`${i%2?"text-left":"text-right"}`}>
            <p className="t-display text-3xl leading-snug text-[var(--p)]">"{text}"</p>
            <p className="mt-4 text-sm font-bold text-[var(--dark)]">{name} · <span className="font-normal text-[var(--muted)]">{role}</span></p>
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
        <Reveal className="mb-8 text-center"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSevenTitle")}</h2>
        <p className="text-sm text-[var(--muted)]">University Q&A</p></Reveal>
        {[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70} className="mb-3 border border-[var(--p)]/20 p-5">
            <p className="font-bold text-[var(--dark)]">ש{i+1}. {q}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{a}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="contact" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-xl border border-[var(--p)]/25 bg-white p-8 shadow-sm">
        <Reveal><h2 className="t-display text-3xl font-bold text-[var(--dark)]">{getValue(data,"contactTitle")}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Campus enrollment</p></Reveal>
        <form className="mt-6 grid gap-3">
          <input className="border border-[var(--p)]/20 px-5 py-4 outline-none" placeholder="שם מלא" />
          <input className="border border-[var(--p)]/20 px-5 py-4 outline-none" placeholder="טלפון" />
          <select className="border border-[var(--p)]/20 px-5 py-4 outline-none"><option>בחרו מקצוע</option><option>מתמטיקה</option><option>אנגלית</option><option>פסיכומטרי</option></select>
          <button type="button" onClick={openModal} className="bg-[var(--p)] py-4 font-bold text-white">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="border-t border-[var(--p)]/15 bg-[var(--dark)] px-5 py-10 text-white lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm">
        <span className="t-display text-xl">{getValue(data,"brandName")}</span>
        <span className="text-white/60">{getValue(data,"email")}</span>
        <span className="text-white/60">© {new Date().getFullYear()}</span>
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

export default function CampuslyPages(props: CampuslyPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...campuslyDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "campusly-preview" : "campusly"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: campuslyEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
