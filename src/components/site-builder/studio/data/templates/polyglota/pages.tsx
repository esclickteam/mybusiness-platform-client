import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { polyglotaDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { polyglotaEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const polyglotaPages = [{ id: "home", label: "בית", slug: "/" }];

type PolyglotaPagesProps = {
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
  return data?.[key] ?? (polyglotaDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-5 py-6">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</span>
        <button type="button" onClick={openModal} className="rounded-full border border-[var(--p)] px-6 py-2 text-sm font-bold text-[var(--p)]">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/85 to-[var(--bg)]/40" />
      <div className="absolute inset-0 opacity-50" style={{background:"radial-gradient(circle at 50% 20%, #38BDF866, transparent 55%)"}} />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-5 pb-24 pt-28 text-center lg:px-8">
        <Reveal variant="scale">
          <h1 className="t-display text-6xl font-extrabold leading-[0.95] text-[var(--dark)] md:text-8xl">{getValue(data,"brandName")}</h1>
          <p className="mt-4 whitespace-pre-line text-xl text-[var(--p)] md:text-3xl">{getValue(data,"heroTitle")}</p>
          <p className="mx-auto mt-5 max-w-xl text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={openModal} className="t-pulse bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
            <button type="button" className="border border-[var(--p)] px-8 py-3.5 text-sm font-bold text-[var(--p)]">{getValue(data,"heroSecondaryButton")}</button>
          </div>
        </Reveal>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-y border-[var(--p)]/25 bg-[var(--bg)]/80 py-3 backdrop-blur-sm">
        <div className="t-marquee flex gap-10 text-sm font-bold text-[var(--p)]">
          {["עברית","English","Español","العربية","Français","Deutsch","עברית","English","Español","العربية"].map((l,i) => <span key={i}>{l}</span>)}
        </div>
      </div>
    </section>
  );
}

function Courses({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="courses" className="px-5 py-20 lg:px-8">
      <Reveal className="mx-auto max-w-5xl"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-8 max-w-5xl divide-y divide-[var(--p)]/15">
        {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*80} className="t-hover grid gap-2 py-6 md:grid-cols-[140px_1fr_100px] md:items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--p)]">שפה 0{i+1}</span>
            <div><h3 className="text-xl font-bold text-[var(--dark)]">{title}</h3><p className="text-sm text-[var(--muted)]">{text}</p></div>
            <button type="button" onClick={openModal} className="justify-self-start text-sm font-bold text-[var(--p)] md:justify-self-end">הרשמה ←</button>
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
      <div className="mx-auto mt-14 max-w-4xl space-y-10">
        {[["היכרות","מילים ראשונות וביטחון"],["תרגול","שיחה חיה פעמיים בשבוע"],["שטף","פרויקט דיבור אישי"]].map(([t,d],i) => (
          <Reveal key={t} delayMs={i*90} className={`flex items-center gap-6 ${i%2===1?"flex-row-reverse text-left":""}`}>
            <div className="t-float grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[var(--p)] text-xl font-bold text-white">{i+1}</div>
            <div><h3 className="text-xl font-bold text-[var(--dark)]">{t}</h3><p className="text-sm text-[var(--muted)]">{d}</p></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Instructors({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="instructors" className="px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mt-10 flex gap-6 overflow-x-auto pb-4">
        {["שרה","חואן","ליאור","אמל"].map((n,i) => (
          <Reveal key={n} delayMs={i*80} className="t-hover min-w-[180px] shrink-0 text-center">
            <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-[var(--a)]">
              <img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover" />
            </div>
            <p className="mt-3 font-bold text-[var(--dark)]">{n}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="stats" className="bg-[var(--p)] px-5 py-12 text-white lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-around gap-6">
        {[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l],i) => (
          <Reveal key={l} delayMs={i*70} className="flex items-center gap-3">
            <span className="t-pulse h-2 w-2 rounded-full bg-white" />
            <div><div className="t-display text-3xl font-bold">{n}</div><div className="text-xs text-white/80">{l}</div></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="testimonials" className="px-5 py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSixTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text,name],i) => (
          <Reveal key={name} delayMs={i*90} className="t-hover relative bg-white p-6 pt-10 shadow-sm">
            <div className="absolute -top-4 right-6 rounded-2xl rounded-bl-sm bg-[var(--a)] px-3 py-1 text-xs font-bold text-[var(--dark)]">ציטוט</div>
            <p className="text-sm leading-7 text-[var(--muted)]">"{text}"</p>
            <p className="mt-4 font-bold text-[var(--p)]">{name}</p>
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
        <Reveal><h2 className="t-display mb-6 text-center text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["הרשמה","לוז","מחיר"].map((t) => <span key={t} className="rounded-full border border-[var(--p)] px-4 py-1 text-xs font-bold text-[var(--p)]">{t}</span>)}
        </div>
        {[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a],i) => (
          <Reveal key={q} delayMs={i*60} className="mb-3 rounded-2xl border border-[var(--p)]/20 p-5">
            <p className="font-bold text-[var(--dark)]">{q}</p>
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
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-sm">
        <Reveal><h2 className="t-display text-3xl font-bold text-[var(--dark)]">{getValue(data,"contactTitle")}</h2></Reveal>
        <form className="mt-6 grid gap-3">
          <input className="rounded-xl border border-[var(--p)]/20 px-5 py-4 outline-none" placeholder="שם" />
          <input className="rounded-xl border border-[var(--p)]/20 px-5 py-4 outline-none" placeholder="טלפון" />
          <select className="rounded-xl border border-[var(--p)]/20 px-5 py-4 outline-none"><option>בחרו שפה</option><option>אנגלית</option><option>ספרדית</option><option>ערבית</option></select>
          <button type="button" onClick={openModal} className="rounded-xl bg-[var(--p)] py-4 font-bold text-white">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="border-t border-[var(--p)]/15 px-5 py-10 text-center lg:px-8">
      <p className="t-display text-2xl font-bold text-[var(--p)]">{getValue(data,"brandName")}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{getValue(data,"email")} · {getValue(data,"phone")}</p>
      <p className="mt-4 text-xs text-[var(--muted)]">© {new Date().getFullYear()}</p>
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

export default function PolyglotaPages(props: PolyglotaPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...polyglotaDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "polyglota-preview" : "polyglota"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: polyglotaEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
