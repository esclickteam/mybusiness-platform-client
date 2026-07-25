import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { notelineDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { notelineEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const notelinePages = [
  {
    id: "home",
    label: "בית",
    slug: "/"
  },
  {
    id: "about",
    label: "אודות",
    slug: "/about"
  },
  {
    id: "courses",
    label: "קורסים",
    slug: "/courses"
  },
  {
    id: "curriculum",
    label: "סילבוס",
    slug: "/curriculum"
  },
  {
    id: "instructors",
    label: "מנחים",
    slug: "/instructors"
  },
  {
    id: "campus",
    label: "קמפוס",
    slug: "/campus"
  },
  {
    id: "faq",
    label: "שאלות",
    slug: "/faq"
  },
  {
    id: "contact",
    label: "צור קשר",
    slug: "/contact"
  }
];

const allowedPages = notelinePages.map((page) => page.id);

type PageEntry = (typeof notelinePages)[number];

type NotelinePagesProps = {
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
  return data?.[key] ?? (notelineDefaultData as Record<string, any>)[key] ?? "";
}

const navLabelKeys: Record<string, string> = {
  home: "navHome",
  about: "navAbout",
  courses: "navCourses",
  curriculum: "navCurriculum",
  instructors: "navInstructors",
  campus: "navCampus",
  faq: "navFaq",
  contact: "navContact",
};

type PageProps = { data: Record<string, any>; openModal: () => void; goTo: (pageId: string) => void };

function getNavLabel(data: Record<string, any>, page: { id: string; label: string }) {
  return getValue(data, navLabelKeys[page.id]) || page.label;
}

function Header({ data, currentPage, goTo, openModal }: { data: Record<string, any>; currentPage: string; goTo: (pageId: string) => void; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="absolute inset-x-0 top-0 z-50 text-white">
      <div className="mx-auto flex max-w-7xl items-end justify-between px-5 py-5 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="t-display text-xl font-bold text-[var(--a)]">{getValue(data,"logoText")} · {getValue(data,"brandName")}</button>
        <nav className="hidden gap-5 text-xs uppercase tracking-[0.22em] text-white/70 lg:flex">
          {notelinePages.map((page) => (
            <button key={page.id} type="button" onClick={() => goTo(page.id)} className={currentPage === page.id ? "text-[var(--a)]" : "hover:text-white"}>{getNavLabel(data, page)}</button>
          ))}
        </nav>
        <button type="button" onClick={openModal} className="border border-[var(--a)] px-5 py-2 text-sm text-[var(--a)]">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>
  );
}



function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)] via-[var(--dark)]/60 to-transparent" />
      <svg className="absolute bottom-0 left-0 right-0 h-32 w-full text-[var(--bg)]" viewBox="0 0 1440 120" preserveAspectRatio="none"><path fill="currentColor" d="M0,64 C240,120 480,0 720,40 C960,80 1200,100 1440,40 L1440,120 L0,120 Z" className="t-wave" /></svg>
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 lg:px-8">
        <Reveal>
          <h1 className="t-display text-6xl font-bold text-[var(--a)] md:text-8xl">{getValue(data,"brandName")}</h1>
          <p className="mt-4 max-w-xl text-2xl text-white">{getValue(data,"heroTitle").replace(getValue(data,"brandName"),"").trim()}</p>
          <p className="mt-5 max-w-lg text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <button type="button" onClick={openModal} className="t-pulse mt-8 w-fit bg-[var(--p)] px-8 py-4 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
        </Reveal>
      </div>
    </section>
  );
}

function Courses({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="courses" className="px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <ol className="mx-auto mt-10 max-w-3xl space-y-2">
        {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*80} className="t-hover flex items-center gap-4 border-b border-white/10 py-4">
            <span className="t-display w-10 text-[var(--a)]">{String(i+1).padStart(2,"0")}</span>
            <div className="flex-1"><h3 className="font-bold">{title}</h3><p className="text-sm text-[var(--muted)]">{text}</p></div>
            <span className="text-xs text-[var(--p)]">{[3,4,5][i]}:2{i}</span>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

function Curriculum({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="curriculum" className="bg-[var(--surface)] px-5 py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 max-w-4xl">
        <div className="mb-6 flex justify-between border-b-2 border-[var(--a)] pb-2">
          {[1,2,3,4,5].map((n) => <span key={n} className="text-xs text-[var(--muted)]">♪ {n}</span>)}
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {["טכניקה","רפרטואר","אימפרוביזציה","במה"].map((s,i) => (
            <Reveal key={s} delayMs={i*80} className="t-hover border border-[var(--a)]/30 p-5 text-center">
              <div className="t-wave mx-auto mb-3 h-8 w-1 bg-[var(--a)]" style={{animationDelay:`${i*0.2}s`}} />
              <p className="font-bold">{s}</p>
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
      <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-6xl gap-0 md:grid-cols-3">
        {[["דני","גיטרה"],["יעל","שירה"],["עומר","הפקה"]].map(([n,r],i) => (
          <Reveal key={n} delayMs={i*90} className="t-hover relative min-h-[280px] overflow-hidden">
            <img src={getValue(data,"sectionImage")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700 hover:scale-110" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black p-6">
              <p className="t-display text-2xl">{n}</p>
              <p className="text-sm text-[var(--a)]">{r}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="stats" className="border-y border-[var(--a)]/30 px-5 py-14 lg:px-8">
      <div className="mx-auto flex max-w-5xl items-end justify-around gap-4">
        {[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l],i) => (
          <Reveal key={l} delayMs={i*80} className="text-center">
            <div className="mx-auto mb-3 flex h-16 items-end justify-center gap-1">
              {[40,70,55,90,60].map((h,j) => (
                <div key={j} className="t-wave w-2 bg-[var(--a)]" style={{ height: h + "%", animationDelay: (i + j) * 0.1 + "s" }} />
              ))}
            </div>
            <div className="t-display text-2xl text-[var(--a)]">{n}</div>
            <div className="text-xs text-[var(--muted)]">{l}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="testimonials" className="px-5 py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionSixTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 max-w-3xl space-y-10 text-center">
        {[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text,name],i) => (
          <Reveal key={name} delayMs={i*100}>
            <p className="t-display text-2xl leading-10 text-[var(--a)]">"{text}"</p>
            <p className="mt-3 text-sm text-[var(--muted)]">— {name}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Faq({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="faq" className="bg-[var(--surface)] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Reveal><h2 className="t-display mb-8 text-4xl font-bold">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        {[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70} className="mb-4 flex gap-4">
            <span className="t-display text-3xl text-[var(--a)]">♪</span>
            <div><p className="font-bold">{q}</p><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function reasonItems(data: Record<string, any>) {
  return [
    [getValue(data,"whyOneTitle"), getValue(data,"whyOneText")],
    [getValue(data,"whyTwoTitle"), getValue(data,"whyTwoText")],
    [getValue(data,"whyThreeTitle"), getValue(data,"whyThreeText")],
  ];
}

function methodItems(data: Record<string, any>) {
  return [
    [getValue(data,"methodOneTitle"), getValue(data,"methodOneText")],
    [getValue(data,"methodTwoTitle"), getValue(data,"methodTwoText")],
    [getValue(data,"methodThreeTitle"), getValue(data,"methodThreeText")],
    [getValue(data,"methodFourTitle"), getValue(data,"methodFourText")],
  ];
}

function outcomeItems(data: Record<string, any>) {
  return [
    [getValue(data,"outcomeOneTitle"), getValue(data,"outcomeOneText")],
    [getValue(data,"outcomeTwoTitle"), getValue(data,"outcomeTwoText")],
    [getValue(data,"outcomeThreeTitle"), getValue(data,"outcomeThreeText")],
  ];
}

function insightItems(data: Record<string, any>) {
  return [
    [getValue(data,"insightOneTitle"), getValue(data,"insightOneText")],
    [getValue(data,"insightTwoTitle"), getValue(data,"insightTwoText")],
    [getValue(data,"insightThreeTitle"), getValue(data,"insightThreeText")],
  ];
}

function priceItems(data: Record<string, any>) {
  return [
    [getValue(data,"itemOneTitle"), getValue(data,"itemOneText"), getValue(data,"priceOne")],
    [getValue(data,"itemTwoTitle"), getValue(data,"itemTwoText"), getValue(data,"priceTwo")],
    [getValue(data,"itemThreeTitle"), getValue(data,"itemThreeText"), getValue(data,"priceThree")],
  ];
}

function galleryItems(data: Record<string, any>) {
  return [getValue(data,"galleryOneImage"), getValue(data,"galleryTwoImage"), getValue(data,"galleryThreeImage"), getValue(data,"galleryFourImage")];
}

function PageHero({ data, page, goTo }: PageProps & { page: PageEntry }) {
  return (
    <section data-template-section-type="pageHero" className="relative overflow-hidden px-5 py-28 lg:px-8 bg-[var(--bg)] text-white">
      <img src={getValue(data,"heroImage")} alt="" className="absolute inset-0 h-full w-full object-cover saturate-75" />
      <div className="absolute inset-0 bg-[var(--dark)]/70" />
      <Reveal className="relative z-10 mx-auto max-w-5xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--a)]">{getValue(data,"heroEyebrow")}</p>
        <h1 className="t-display mt-5 text-5xl font-bold md:text-7xl">{getNavLabel(data, page)}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--muted)]">{getValue(data,"aboutText")}</p>
        <button type="button" onClick={() => goTo("contact")} className="mt-8 inline-flex px-6 py-3 text-sm font-bold bg-[var(--a)] text-white">{getValue(data,"ctaBandButton")}</button>
      </Reveal>
    </section>
  );
}

function About({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="about" className="px-5 py-24 lg:px-8 bg-[var(--bg)] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <Reveal className="relative min-h-[360px] overflow-hidden border border-[var(--a)]/30 bg-[linear-gradient(180deg,rgba(255,255,255,.04)_0_2px,transparent_2px_36px)]">
          <img src={getValue(data,"sectionImage")} alt="" className="absolute inset-0 h-full w-full object-cover saturate-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)]/80 to-transparent" />
          <span className="absolute bottom-6 right-6 rounded-full px-4 py-2 text-sm font-bold bg-[var(--a)] text-white">מוזיקלי</span>
        </Reveal>
        <Reveal variant="up" className="border border-[var(--a)]/30 bg-[linear-gradient(180deg,rgba(255,255,255,.04)_0_2px,transparent_2px_36px)] p-8 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"aboutEyebrow")}</p>
          <h2 className="t-display mt-4 text-4xl font-bold md:text-5xl">{getValue(data,"aboutTitle")}</h2>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{getValue(data,"aboutText")}</p>
        </Reveal>
      </div>
    </section>
  );
}

function WhyUs({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="why" className="px-5 py-24 lg:px-8 bg-[var(--bg)] text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"whyEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"whyTitle")}</h2>
      </Reveal>
      <div className="mt-12 mx-auto max-w-4xl divide-y divide-[var(--a)]/20">
        {reasonItems(data).map(([title, text], i) => (
          <Reveal key={title} delayMs={i * 80} className="t-hover border-b border-[var(--a)]/30 bg-[var(--surface)] p-6">
            <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold bg-[var(--a)] text-white">{i + 1}</span>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Method({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="method" className="px-5 py-24 lg:px-8 bg-[var(--bg)] text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"methodEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"methodTitle")}</h2>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-5xl gap-0 md:grid-cols-4">
        {methodItems(data).map(([title, text], i) => (
          <Reveal key={title} delayMs={i * 90} className="t-hover border-b border-[var(--a)]/30 bg-[var(--surface)] p-6">
            <p className="t-display text-4xl text-[var(--a)]">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-4 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Gallery({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="gallery" className="px-5 py-24 lg:px-8 bg-[var(--bg)] text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"galleryEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"galleryTitle")}</h2>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-0 md:grid-cols-4">
        {galleryItems(data).map((image, i) => (
          <Reveal key={image} delayMs={i * 80} className="t-hover relative min-h-[260px] overflow-hidden border border-[var(--a)]/30 bg-[linear-gradient(180deg,rgba(255,255,255,.04)_0_2px,transparent_2px_36px)]">
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-110 saturate-75" />
            <span className="absolute bottom-4 right-4 px-3 py-1 text-xs font-bold bg-[var(--a)] text-white">0{i + 1}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Outcomes({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="outcomes" className="px-5 py-20 lg:px-8 bg-[var(--bg)] text-white">
      <div className="mx-auto max-w-6xl border border-[var(--a)]/30 bg-[linear-gradient(180deg,rgba(255,255,255,.04)_0_2px,transparent_2px_36px)] p-8 lg:p-12">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"outcomesEyebrow")}</p>
          <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"outcomesTitle")}</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {outcomeItems(data).map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90} className="t-hover border-t border-[var(--p)]/25 pt-6">
              <p className="t-display text-4xl font-bold text-[var(--a)]">{title}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ data, goTo }: Pick<PageProps, "data" | "goTo">) {
  return (
    <section data-template-section-type="pricing" className="px-5 py-24 lg:px-8 bg-[var(--bg)] text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"pricingEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"pricingTitle")}</h2>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
        {priceItems(data).map(([title, text, price], i) => (
          <Reveal key={title} delayMs={i * 90} className="t-hover border-b border-[var(--a)]/30 bg-[var(--surface)] p-6">
            <p className="text-sm text-[var(--muted)]">{title}</p>
            <p className="t-display mt-4 text-4xl font-bold">₪{price}</p>
            <p className="mt-4 min-h-14 text-sm leading-7 text-[var(--muted)]">{text}</p>
            <button type="button" onClick={() => goTo("contact")} className="mt-8 w-full px-5 py-3 text-sm font-bold bg-[var(--a)] text-white">{getValue(data,"ctaBandButton")}</button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Insights({ data, goTo }: Pick<PageProps, "data" | "goTo">) {
  return (
    <section data-template-section-type="insights" className="px-5 py-24 lg:px-8 bg-[var(--bg)] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.7fr_1.3fr]">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"insightsEyebrow")}</p>
          <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"insightsTitle")}</h2>
          <button type="button" onClick={() => goTo("faq")} className="mt-8 px-5 py-3 text-sm font-bold bg-[var(--a)] text-white">{getValue(data,"navFaq")}</button>
        </Reveal>
        <div className="grid gap-4">
          {insightItems(data).map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 80} className="t-hover border-b border-[var(--a)]/30 bg-[var(--surface)] p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--a)]">article 0{i + 1}</p>
              <h3 className="mt-3 text-2xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABand({ data, goTo }: Pick<PageProps, "data" | "goTo">) {
  return (
    <section data-template-section-type="cta" className="px-5 py-20 lg:px-8 bg-[var(--bg)] text-white">
      <Reveal className="mx-auto max-w-5xl border border-[var(--a)]/30 bg-[linear-gradient(180deg,rgba(255,255,255,.04)_0_2px,transparent_2px_36px)] p-8 text-center lg:p-14">
        <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data,"ctaBandTitle")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted)]">{getValue(data,"ctaBandText")}</p>
        <button type="button" onClick={() => goTo("contact")} className="mt-8 px-8 py-4 text-sm font-bold bg-[var(--a)] text-white">{getValue(data,"ctaBandButton")}</button>
      </Reveal>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="contact" className="px-5 py-24 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
        <Reveal>
          <h2 className="t-display text-4xl font-bold">{getValue(data,"contactTitle")}</h2>
          <p className="mt-4 text-[var(--muted)]">{getValue(data,"contactText")}</p>
          <p className="mt-6 text-sm">{getValue(data,"address")}</p>
        </Reveal>
        <form className="border border-[var(--a)]/40 bg-[var(--surface)] p-8">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--a)]">audition form</p>
          <input className="mb-3 w-full border border-white/10 bg-transparent px-4 py-3 outline-none" placeholder="שם" />
          <input className="mb-3 w-full border border-white/10 bg-transparent px-4 py-3 outline-none" placeholder="כלי / תחום" />
          <button type="button" onClick={openModal} className="w-full bg-[var(--p)] py-3 font-bold text-white">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="border-t border-[var(--a)]/20 px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <span className="t-display text-xl text-[var(--a)]">{getValue(data,"brandName")}</span>
        <p className="text-xs text-[var(--muted)]">{getValue(data,"ctaTitle")}</p>
        <button type="button" onClick={openModal} className="text-sm text-[var(--p)]">{getValue(data,"ctaButton")}</button>
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

const pageSectionOrder: Record<string, string[]> = {
  home: ["Hero", "About", "Courses", "WhyUs", "Curriculum", "Instructors", "Gallery", "Stats", "Testimonials", "Outcomes", "Pricing", "Insights", "Faq", "CTABand", "Contact", "Footer"],
  about: ["PageHero", "About", "WhyUs", "Stats", "Instructors", "Gallery", "Method", "Testimonials", "Outcomes", "CTABand", "Contact", "Footer"],
  courses: ["PageHero", "Courses", "Pricing", "Curriculum", "WhyUs", "Gallery", "Instructors", "Outcomes", "Faq", "CTABand", "Contact", "Footer"],
  curriculum: ["PageHero", "Curriculum", "Method", "Courses", "WhyUs", "Outcomes", "Instructors", "Insights", "Faq", "Contact", "Footer"],
  instructors: ["PageHero", "Instructors", "About", "WhyUs", "Gallery", "Testimonials", "Outcomes", "Method", "CTABand", "Contact", "Footer"],
  campus: ["PageHero", "Gallery", "About", "Stats", "WhyUs", "Instructors", "Insights", "Outcomes", "CTABand", "Contact", "Footer"],
  faq: ["PageHero", "Faq", "Insights", "WhyUs", "Method", "Pricing", "Testimonials", "Courses", "CTABand", "Contact", "Footer"],
  contact: ["PageHero", "Contact", "About", "Faq", "WhyUs", "Instructors", "Gallery", "Outcomes", "CTABand", "Footer"],
};

function renderSection(sectionName: string, page: PageEntry, props: PageProps) {
  switch (sectionName) {
    case "Hero": return <Hero data={props.data} openModal={props.openModal} />;
    case "PageHero": return <PageHero data={props.data} page={page} goTo={props.goTo} openModal={props.openModal} />;
    case "About": return <About data={props.data} />;
    case "Courses": return <Courses data={props.data} openModal={props.openModal} />;
    case "WhyUs": return <WhyUs data={props.data} />;
    case "Curriculum": return <Curriculum data={props.data} />;
    case "Instructors": return <Instructors data={props.data} />;
    case "Gallery": return <Gallery data={props.data} />;
    case "Stats": return <Stats data={props.data} />;
    case "Testimonials": return <Testimonials data={props.data} />;
    case "Outcomes": return <Outcomes data={props.data} />;
    case "Pricing": return <Pricing data={props.data} goTo={props.goTo} />;
    case "Insights": return <Insights data={props.data} goTo={props.goTo} />;
    case "Faq": return <Faq data={props.data} />;
    case "CTABand": return <CTABand data={props.data} goTo={props.goTo} />;
    case "Contact": return <Contact data={props.data} openModal={props.openModal} />;
    case "Footer": return <Footer data={props.data} openModal={props.openModal} />;
    default: return null;
  }
}



export default function NotelinePages(props: NotelinePagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...notelineDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "noteline-preview" : "noteline"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: notelineEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} openModal={() => setModalOpen(true)} />
      <VisualPageStack activePageId={currentPage} pages={notelinePages.map((page) => ({ id: page.id, content: <>{(pageSectionOrder[page.id] ?? pageSectionOrder.home).map((sectionName, index) => <React.Fragment key={page.id + "-" + sectionName + "-" + index}>{renderSection(sectionName, page, { data: mergedData, openModal: () => setModalOpen(true), goTo })}</React.Fragment>)}</> }))} />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
