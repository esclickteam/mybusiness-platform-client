import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { polyglotaDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { polyglotaEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";
import SafeImg from "../shared/SafeImg";

export const polyglotaPages = [
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

const allowedPages = polyglotaPages.map((page) => page.id);

type PageEntry = (typeof polyglotaPages)[number];

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
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 bg-white/90 text-[var(--dark)] shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="t-display text-xl font-bold text-[var(--p)]">{getValue(data,"logoText")} · {getValue(data,"brandName")}</button>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-[var(--muted)] lg:flex">
          {polyglotaPages.map((page) => (
            <button key={page.id} type="button" onClick={() => goTo(page.id)} className={currentPage === page.id ? "text-[var(--p)]" : "hover:text-[var(--dark)]"}>{getNavLabel(data, page)}</button>
          ))}
        </nav>
        <button type="button" onClick={openModal} className="rounded-full bg-[var(--p)] px-5 py-2.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>
  );
}



function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <SafeImg src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
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
      <Reveal className="mx-auto max-w-5xl"><h2 className="t-display text-2xl sm:text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
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
    <section data-template-section-type="curriculum" className="bg-white px-5 py-12 md:py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-2xl sm:text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
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
      <Reveal><h2 className="t-display text-2xl sm:text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mt-10 flex gap-6 overflow-x-auto pb-4">
        {["שרה","חואן","ליאור","אמל"].map((n,i) => (
          <Reveal key={n} delayMs={i*80} className="t-hover min-w-[180px] shrink-0 text-center">
            <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-[var(--a)]">
              <SafeImg src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover" />
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
    <section data-template-section-type="testimonials" className="px-5 py-12 md:py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-2xl sm:text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSixTitle")}</h2></Reveal>
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
    <section data-template-section-type="faq" className="bg-white px-5 py-12 md:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="t-display mb-6 text-center text-2xl sm:text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
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
  const fallback = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85";
  return [getValue(data,"galleryOneImage"), getValue(data,"galleryTwoImage"), getValue(data,"galleryThreeImage"), getValue(data,"galleryFourImage")]
    .map((image) => String(image || "").trim() || fallback);
}

function PageHero({ data, page, goTo }: PageProps & { page: PageEntry }) {
  return (
    <section data-template-section-type="pageHero" className="relative overflow-hidden px-5 py-14 md:py-28 lg:px-8 bg-[var(--bg)] text-[var(--dark)]">
      <SafeImg src={getValue(data,"heroImage")} alt="" className="absolute inset-0 h-full w-full object-cover rounded-[2rem]" />
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
    <section data-template-section-type="about" className="px-5 py-12 md:py-24 lg:px-8 bg-[var(--bg)] text-[var(--dark)]">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <Reveal className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-white shadow-sm">
          <SafeImg src={getValue(data,"sectionImage")} alt="" className="absolute inset-0 h-full w-full object-cover rounded-[2rem]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)]/80 to-transparent" />
          <span className="absolute bottom-6 right-6 rounded-full px-4 py-2 text-sm font-bold bg-[var(--a)] text-white">שפות</span>
        </Reveal>
        <Reveal variant="up" className="rounded-[2rem] bg-white shadow-sm p-8 lg:p-12">
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
    <section data-template-section-type="why" className="px-5 py-12 md:py-24 lg:px-8 bg-[var(--bg)] text-[var(--dark)]">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"whyEyebrow")}</p>
        <h2 className="t-display mt-4 text-2xl sm:text-4xl font-bold">{getValue(data,"whyTitle")}</h2>
      </Reveal>
      <div className="mt-12 mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
        {reasonItems(data).map(([title, text], i) => (
          <Reveal key={title} delayMs={i * 80} className="t-hover rounded-[2rem] bg-white p-6 shadow-sm">
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
    <section data-template-section-type="method" className="px-5 py-12 md:py-24 lg:px-8 bg-[var(--bg)] text-[var(--dark)]">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"methodEyebrow")}</p>
        <h2 className="t-display mt-4 text-2xl sm:text-4xl font-bold">{getValue(data,"methodTitle")}</h2>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-4">
        {methodItems(data).map(([title, text], i) => (
          <Reveal key={title} delayMs={i * 90} className="t-hover rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="t-display text-2xl sm:text-4xl text-[var(--a)]">{String(i + 1).padStart(2, "0")}</p>
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
    <section data-template-section-type="gallery" className="px-5 py-12 md:py-24 lg:px-8 bg-[var(--bg)] text-[var(--dark)]">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"galleryEyebrow")}</p>
        <h2 className="t-display mt-4 text-2xl sm:text-4xl font-bold">{getValue(data,"galleryTitle")}</h2>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-[1.2fr_.8fr_1fr]">
        {galleryItems(data).map((image, i) => (
          <Reveal key={image} delayMs={i * 80} className="t-hover relative min-h-[260px] overflow-hidden rounded-[2rem] bg-white shadow-sm">
            <SafeImg src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-110 rounded-[2rem]" />
            <span className="absolute bottom-4 right-4 px-3 py-1 text-xs font-bold bg-[var(--a)] text-white">0{i + 1}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Outcomes({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="outcomes" className="px-5 py-20 lg:px-8 bg-[var(--bg)] text-[var(--dark)]">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-white shadow-sm p-8 lg:p-12">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"outcomesEyebrow")}</p>
          <h2 className="t-display mt-4 text-2xl sm:text-4xl font-bold">{getValue(data,"outcomesTitle")}</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {outcomeItems(data).map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90} className="t-hover border-t border-[var(--p)]/25 pt-6">
              <p className="t-display text-2xl sm:text-4xl font-bold text-[var(--a)]">{title}</p>
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
    <section data-template-section-type="pricing" className="px-5 py-12 md:py-24 lg:px-8 bg-[var(--bg)] text-[var(--dark)]">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"pricingEyebrow")}</p>
        <h2 className="t-display mt-4 text-2xl sm:text-4xl font-bold">{getValue(data,"pricingTitle")}</h2>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
        {priceItems(data).map(([title, text, price], i) => (
          <Reveal key={title} delayMs={i * 90} className="t-hover rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm text-[var(--muted)]">{title}</p>
            <p className="t-display mt-4 text-2xl sm:text-4xl font-bold">₪{price}</p>
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
    <section data-template-section-type="insights" className="px-5 py-12 md:py-24 lg:px-8 bg-[var(--bg)] text-[var(--dark)]">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.7fr_1.3fr]">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"insightsEyebrow")}</p>
          <h2 className="t-display mt-4 text-2xl sm:text-4xl font-bold">{getValue(data,"insightsTitle")}</h2>
          <button type="button" onClick={() => goTo("faq")} className="mt-8 px-5 py-3 text-sm font-bold bg-[var(--a)] text-white">{getValue(data,"navFaq")}</button>
        </Reveal>
        <div className="grid gap-4">
          {insightItems(data).map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 80} className="t-hover rounded-[2rem] bg-white p-6 shadow-sm">
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
    <section data-template-section-type="cta" className="px-5 py-20 lg:px-8 bg-[var(--bg)] text-[var(--dark)]">
      <Reveal className="mx-auto max-w-5xl rounded-[2rem] bg-white shadow-sm p-8 text-center lg:p-14">
        <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data,"ctaBandTitle")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted)]">{getValue(data,"ctaBandText")}</p>
        <button type="button" onClick={() => goTo("contact")} className="mt-8 px-8 py-4 text-sm font-bold bg-[var(--a)] text-white">{getValue(data,"ctaBandButton")}</button>
      </Reveal>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="contact" className="px-5 py-12 md:py-24 lg:px-8">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-sm">
        <Reveal><h2 className="t-display text-3xl font-bold text-[var(--dark)]">{getValue(data,"contactTitle")}</h2></Reveal>
        <form className="mt-6 grid gap-3" data-bizuply-block="lead-form" data-bizuply-form-id="polyglota-contact-1" data-bizuply-crm-lead="true" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.">
          <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  className="rounded-xl border border-[var(--p)]/20 px-5 py-4 outline-none" placeholder="שם" />
          <input name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel"  className="rounded-xl border border-[var(--p)]/20 px-5 py-4 outline-none" placeholder="טלפון" />
          <select className="rounded-xl border border-[var(--p)]/20 px-5 py-4 outline-none"><option>בחרו שפה</option><option>אנגלית</option><option>ספרדית</option><option>ערבית</option></select>
          <button type="submit" onClick={openModal} className="rounded-xl bg-[var(--p)] py-4 font-bold text-white">{getValue(data,"contactButton")}</button>
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
        <form className="mt-6 grid gap-3" data-bizuply-block="lead-form" data-bizuply-form-id="polyglota-contact-2" data-bizuply-crm-lead="true" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.">
          <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none" placeholder="שם מלא" />
          <input name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel"  className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none" placeholder="טלפון" />
          <button type="submit" className="bg-[var(--p)] py-4 text-sm font-bold text-[var(--dark)]">{getValue(data, "contactButton")}</button>
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



export default function PolyglotaPages(props: PolyglotaPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...polyglotaDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "polyglota-preview" : "polyglota"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: polyglotaEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} openModal={() => setModalOpen(true)} />
      <VisualPageStack activePageId={currentPage} pages={polyglotaPages.map((page) => ({ id: page.id, content: <>{(pageSectionOrder[page.id] ?? pageSectionOrder.home).map((sectionName, index) => <React.Fragment key={page.id + "-" + sectionName + "-" + index}>{renderSection(sectionName, page, { data: mergedData, openModal: () => setModalOpen(true), goTo })}</React.Fragment>)}</> }))} />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
