import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { lectoraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { lectoraEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const lectoraPages = [
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

const allowedPages = lectoraPages.map((page) => page.id);

type PageEntry = (typeof lectoraPages)[number];

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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="t-display text-2xl font-extrabold tracking-tight text-[var(--p)]">{getValue(data,"logoText")} · {getValue(data,"brandName")}</button>
        <nav className="hidden gap-5 text-xs font-bold uppercase tracking-[0.18em] text-white/70 lg:flex">
          {lectoraPages.map((page) => (
            <button key={page.id} type="button" onClick={() => goTo(page.id)} className={currentPage === page.id ? "text-[var(--a)]" : "hover:text-white"}>{getNavLabel(data, page)}</button>
          ))}
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
    <section data-template-section-type="pageHero" className="relative overflow-hidden px-5 py-28 lg:px-8 bg-[var(--dark)] text-white">
      <img src={getValue(data,"heroImage")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75" />
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
    <section data-template-section-type="about" className="px-5 py-24 lg:px-8 bg-[var(--dark)] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <Reveal className="relative min-h-[360px] overflow-hidden border border-[var(--p)]/25 bg-[var(--surface)]/90">
          <img src={getValue(data,"sectionImage")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)]/80 to-transparent" />
          <span className="absolute bottom-6 right-6 rounded-full px-4 py-2 text-sm font-bold bg-[var(--a)] text-white">קולנועי</span>
        </Reveal>
        <Reveal variant="up" className="border border-[var(--p)]/25 bg-[var(--surface)]/90 p-8 lg:p-12">
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
    <section data-template-section-type="why" className="px-5 py-24 lg:px-8 bg-[var(--dark)] text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"whyEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"whyTitle")}</h2>
      </Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {reasonItems(data).map(([title, text], i) => (
          <Reveal key={title} delayMs={i * 80} className="t-hover border border-[var(--p)]/25 bg-[var(--dark)]/80 p-6">
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
    <section data-template-section-type="method" className="px-5 py-24 lg:px-8 bg-[var(--dark)] text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"methodEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"methodTitle")}</h2>
      </Reveal>
      <div className="relative mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-4">
        {methodItems(data).map(([title, text], i) => (
          <Reveal key={title} delayMs={i * 90} className="t-hover border border-[var(--p)]/25 bg-[var(--dark)]/80 p-6">
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
    <section data-template-section-type="gallery" className="px-5 py-24 lg:px-8 bg-[var(--dark)] text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"galleryEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"galleryTitle")}</h2>
      </Reveal>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4">
        {galleryItems(data).map((image, i) => (
          <Reveal key={image} delayMs={i * 80} className="t-hover relative min-h-[260px] overflow-hidden border border-[var(--p)]/25 bg-[var(--surface)]/90">
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-110 opacity-75" />
            <span className="absolute bottom-4 right-4 px-3 py-1 text-xs font-bold bg-[var(--a)] text-white">0{i + 1}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Outcomes({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="outcomes" className="px-5 py-20 lg:px-8 bg-[var(--dark)] text-white">
      <div className="mx-auto max-w-6xl border border-[var(--p)]/25 bg-[var(--surface)]/90 p-8 lg:p-12">
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
    <section data-template-section-type="pricing" className="px-5 py-24 lg:px-8 bg-[var(--dark)] text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"pricingEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"pricingTitle")}</h2>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
        {priceItems(data).map(([title, text, price], i) => (
          <Reveal key={title} delayMs={i * 90} className="t-hover border border-[var(--p)]/25 bg-[var(--dark)]/80 p-6">
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
    <section data-template-section-type="insights" className="px-5 py-24 lg:px-8 bg-[var(--dark)] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.7fr_1.3fr]">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"insightsEyebrow")}</p>
          <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"insightsTitle")}</h2>
          <button type="button" onClick={() => goTo("faq")} className="mt-8 px-5 py-3 text-sm font-bold bg-[var(--a)] text-white">{getValue(data,"navFaq")}</button>
        </Reveal>
        <div className="grid gap-4">
          {insightItems(data).map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 80} className="t-hover border border-[var(--p)]/25 bg-[var(--dark)]/80 p-6">
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
    <section data-template-section-type="cta" className="px-5 py-20 lg:px-8 bg-[var(--dark)] text-white">
      <Reveal className="mx-auto max-w-5xl border border-[var(--p)]/25 bg-[var(--surface)]/90 p-8 text-center lg:p-14">
        <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data,"ctaBandTitle")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted)]">{getValue(data,"ctaBandText")}</p>
        <button type="button" onClick={() => goTo("contact")} className="mt-8 px-8 py-4 text-sm font-bold bg-[var(--a)] text-white">{getValue(data,"ctaBandButton")}</button>
      </Reveal>
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



export default function LectoraPages(props: LectoraPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...lectoraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "lectora-preview" : "lectora"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: lectoraEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} openModal={() => setModalOpen(true)} />
      <VisualPageStack activePageId={currentPage} pages={lectoraPages.map((page) => ({ id: page.id, content: <>{(pageSectionOrder[page.id] ?? pageSectionOrder.home).map((sectionName, index) => <React.Fragment key={page.id + "-" + sectionName + "-" + index}>{renderSection(sectionName, page, { data: mergedData, openModal: () => setModalOpen(true), goTo })}</React.Fragment>)}</> }))} />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
