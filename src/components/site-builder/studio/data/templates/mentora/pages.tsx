import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { mentoraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { mentoraEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";
import SafeImg from "../shared/SafeImg";

export const mentoraPages = [
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

const allowedPages = mentoraPages.map((page) => page.id);

type PageEntry = (typeof mentoraPages)[number];

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
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 border-b border-[var(--p)]/20 bg-[var(--dark)]/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-sm font-semibold tracking-wide">{getValue(data,"logoText")} · {getValue(data,"brandName")}</button>
        <nav className="hidden items-center gap-4 text-xs text-[var(--muted)] lg:flex">
          {mentoraPages.map((page) => (
            <button key={page.id} type="button" onClick={() => goTo(page.id)} className={currentPage === page.id ? "text-[var(--p)]" : "hover:text-white"}>{getNavLabel(data, page)}</button>
          ))}
        </nav>
        <button type="button" onClick={openModal} className="rounded-full bg-[var(--p)] px-5 py-2.5 text-sm font-bold text-[var(--dark)]">{getValue(data,"heroPrimaryButton")}</button>
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
          <SafeImg src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function Courses({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="courses" className="px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display text-2xl sm:text-4xl font-bold">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 max-w-5xl space-y-6">
        {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*100} className="t-hover flex flex-col gap-2 border-b border-[var(--p)]/30 pb-6 md:flex-row md:items-end md:justify-between">
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
    <section data-template-section-type="curriculum" className="bg-[var(--surface)] px-5 py-12 md:py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-2xl sm:text-4xl font-bold">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="relative mx-auto mt-16 grid max-w-4xl place-items-center">
        <div className="t-pulse absolute h-64 w-64 rounded-full border border-[var(--p)]/40" />
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {["אבחון","מיפוי","ליווי","מדידה"].map((s,i) => (
            <Reveal key={s} delayMs={i*90} variant="scale" className="t-float grid h-28 w-28 place-items-center rounded-full border border-[var(--p)] bg-[var(--bg)] text-center text-sm font-bold">{s}</Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Instructors({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="instructors" className="px-5 py-12 md:py-24 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <Reveal><h2 className="t-display text-2xl sm:text-4xl font-bold">{getValue(data,"sectionFourTitle")}</h2></Reveal>
        <div className="mt-10 flex items-center -space-x-6 space-x-reverse">
          {[0,1,2,3,4].map((i) => (
            <div key={i} className="t-hover h-24 w-24 overflow-hidden rounded-full border-4 border-[var(--bg)]" style={{zIndex:5-i}}>
              <SafeImg src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover" style={{filter:`hue-rotate(${i*20}deg)`}} />
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
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-3 divide-x divide-x-reverse divide-[var(--p)]/25">
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
    <section data-template-section-type="testimonials" className="px-5 py-12 md:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <Reveal><h2 className="t-display text-2xl sm:text-4xl font-bold">{getValue(data,"sectionSixTitle")}</h2></Reveal>
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
    <section data-template-section-type="faq" className="bg-[var(--surface)] px-5 py-12 md:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="t-display mb-8 text-2xl sm:text-4xl font-bold">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
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
    <section data-template-section-type="pageHero" className="relative overflow-hidden px-5 py-14 md:py-28 lg:px-8 bg-[var(--bg)] text-white">
      <SafeImg src={getValue(data,"heroImage")} alt="" className="absolute inset-0 h-full w-full object-cover rounded-full" />
      <div className="absolute inset-0 bg-[var(--dark)]/70" />
      <Reveal className="relative z-10 mx-auto max-w-5xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--a)]">{getValue(data,"heroEyebrow")}</p>
        <h1 className="t-display mt-5 text-5xl font-bold md:text-7xl">{getNavLabel(data, page)}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--muted)]">{getValue(data,"aboutText")}</p>
        <button type="button" onClick={() => goTo("contact")} className="mt-8 inline-flex px-6 py-3 text-sm font-bold bg-[var(--p)] text-[var(--dark)]">{getValue(data,"ctaBandButton")}</button>
      </Reveal>
    </section>
  );
}

function About({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="about" className="px-5 py-12 md:py-24 lg:px-8 bg-[var(--bg)] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <Reveal className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-[var(--p)]/25 bg-[var(--surface)]">
          <SafeImg src={getValue(data,"sectionImage")} alt="" className="absolute inset-0 h-full w-full object-cover rounded-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)]/80 to-transparent" />
          <span className="absolute bottom-6 right-6 rounded-full px-4 py-2 text-sm font-bold bg-[var(--p)] text-[var(--dark)]">אישי</span>
        </Reveal>
        <Reveal variant="up" className="rounded-[2rem] border border-[var(--p)]/25 bg-[var(--surface)] p-8 lg:p-12">
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
    <section data-template-section-type="why" className="px-5 py-12 md:py-24 lg:px-8 bg-[var(--bg)] text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"whyEyebrow")}</p>
        <h2 className="t-display mt-4 text-2xl sm:text-4xl font-bold">{getValue(data,"whyTitle")}</h2>
      </Reveal>
      <div className="mt-12 flex flex-wrap justify-center gap-5">
        {reasonItems(data).map(([title, text], i) => (
          <Reveal key={title} delayMs={i * 80} className="t-hover rounded-full border border-[var(--p)]/35 bg-[var(--dark)] p-6 text-center">
            <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold bg-[var(--p)] text-[var(--dark)]">{i + 1}</span>
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
    <section data-template-section-type="method" className="px-5 py-12 md:py-24 lg:px-8 bg-[var(--bg)] text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"methodEyebrow")}</p>
        <h2 className="t-display mt-4 text-2xl sm:text-4xl font-bold">{getValue(data,"methodTitle")}</h2>
      </Reveal>
      <div className="mx-auto mt-12 flex max-w-5xl flex-wrap items-center justify-center gap-6">
        {methodItems(data).map(([title, text], i) => (
          <Reveal key={title} delayMs={i * 90} className="t-hover rounded-full border border-[var(--p)]/35 bg-[var(--dark)] p-6 text-center">
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
    <section data-template-section-type="gallery" className="px-5 py-12 md:py-24 lg:px-8 bg-[var(--bg)] text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"galleryEyebrow")}</p>
        <h2 className="t-display mt-4 text-2xl sm:text-4xl font-bold">{getValue(data,"galleryTitle")}</h2>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-5 md:grid-cols-4">
        {galleryItems(data).map((image, i) => (
          <Reveal key={image} delayMs={i * 80} className="t-hover relative min-h-[260px] overflow-hidden rounded-[2rem] border border-[var(--p)]/25 bg-[var(--surface)]">
            <SafeImg src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-110 rounded-full" />
            <span className="absolute bottom-4 right-4 px-3 py-1 text-xs font-bold bg-[var(--p)] text-[var(--dark)]">0{i + 1}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Outcomes({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="outcomes" className="px-5 py-20 lg:px-8 bg-[var(--bg)] text-white">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-[var(--p)]/25 bg-[var(--surface)] p-8 lg:p-12">
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
    <section data-template-section-type="pricing" className="px-5 py-12 md:py-24 lg:px-8 bg-[var(--bg)] text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"pricingEyebrow")}</p>
        <h2 className="t-display mt-4 text-2xl sm:text-4xl font-bold">{getValue(data,"pricingTitle")}</h2>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
        {priceItems(data).map(([title, text, price], i) => (
          <Reveal key={title} delayMs={i * 90} className="t-hover rounded-full border border-[var(--p)]/35 bg-[var(--dark)] p-6 text-center">
            <p className="text-sm text-[var(--muted)]">{title}</p>
            <p className="t-display mt-4 text-2xl sm:text-4xl font-bold">₪{price}</p>
            <p className="mt-4 min-h-14 text-sm leading-7 text-[var(--muted)]">{text}</p>
            <button type="button" onClick={() => goTo("contact")} className="mt-8 w-full px-5 py-3 text-sm font-bold bg-[var(--p)] text-[var(--dark)]">{getValue(data,"ctaBandButton")}</button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Insights({ data, goTo }: Pick<PageProps, "data" | "goTo">) {
  return (
    <section data-template-section-type="insights" className="px-5 py-12 md:py-24 lg:px-8 bg-[var(--bg)] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.7fr_1.3fr]">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"insightsEyebrow")}</p>
          <h2 className="t-display mt-4 text-2xl sm:text-4xl font-bold">{getValue(data,"insightsTitle")}</h2>
          <button type="button" onClick={() => goTo("faq")} className="mt-8 px-5 py-3 text-sm font-bold bg-[var(--p)] text-[var(--dark)]">{getValue(data,"navFaq")}</button>
        </Reveal>
        <div className="grid gap-4">
          {insightItems(data).map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 80} className="t-hover rounded-full border border-[var(--p)]/35 bg-[var(--dark)] p-6 text-center">
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
      <Reveal className="mx-auto max-w-5xl rounded-[2rem] border border-[var(--p)]/25 bg-[var(--surface)] p-8 text-center lg:p-14">
        <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data,"ctaBandTitle")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted)]">{getValue(data,"ctaBandText")}</p>
        <button type="button" onClick={() => goTo("contact")} className="mt-8 px-8 py-4 text-sm font-bold bg-[var(--p)] text-[var(--dark)]">{getValue(data,"ctaBandButton")}</button>
      </Reveal>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="contact" className="px-5 py-12 md:py-24 lg:px-8">
      <Reveal className="mx-auto max-w-xl text-center">
        <h2 className="t-display text-2xl sm:text-4xl font-bold">{getValue(data,"contactTitle")}</h2>
        <p className="mt-4 text-[var(--muted)]">{getValue(data,"contactText")}</p>
      </Reveal>
      <form className="mx-auto mt-10 grid max-w-xl gap-3" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-id="mentora-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
        <input className="border border-[var(--p)]/30 bg-[var(--surface)] px-5 py-4 outline-none" placeholder="שם"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
        <input className="border border-[var(--p)]/30 bg-[var(--surface)] px-5 py-4 outline-none" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
        <select className="border border-[var(--p)]/30 bg-[var(--surface)] px-5 py-4 outline-none"><option>בחרו מסלול</option><option>קריירה</option><option>יזמות</option></select>
        <button type="submit" onClick={openModal} className="bg-[var(--p)] py-4 font-bold text-[var(--dark)]">{getValue(data,"contactButton")}</button>
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
        <form className="mt-6 grid gap-3" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-id="mentora-contact-2" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
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



export default function MentoraPages(props: MentoraPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...mentoraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "mentora-preview" : "mentora"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: mentoraEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} openModal={() => setModalOpen(true)} />
      <VisualPageStack activePageId={currentPage} pages={mentoraPages.map((page) => ({ id: page.id, content: <>{(pageSectionOrder[page.id] ?? pageSectionOrder.home).map((sectionName, index) => <React.Fragment key={page.id + "-" + sectionName + "-" + index}>{renderSection(sectionName, page, { data: mergedData, openModal: () => setModalOpen(true), goTo })}</React.Fragment>)}</> }))} />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
