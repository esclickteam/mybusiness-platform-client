import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { codehausDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { codehausEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";
import SafeImg from "../shared/SafeImg";

export const codehausPages = [
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

const allowedPages = codehausPages.map((page) => page.id);

type PageEntry = (typeof codehausPages)[number];

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
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 border-b border-[var(--p)]/30 bg-black/90 font-mono text-xs backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="font-mono text-[var(--p)]">~/edu/<span className="text-white">{getValue(data,"brandName").toLowerCase()}</span></button>
        <nav className="hidden items-center gap-4 text-[var(--muted)] lg:flex">
          {codehausPages.map((page) => (
            <button key={page.id} type="button" onClick={() => goTo(page.id)} className={currentPage === page.id ? "text-[var(--p)]" : "hover:text-white"}>{page.id}</button>
          ))}
        </nav>
        <button type="button" onClick={openModal} className="border border-[var(--p)] px-3 py-1 text-[var(--p)]">apply --now</button>
      </div>
    </header>
  );
}



function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] bg-black px-5 pt-24 lg:px-8">
      <div className="absolute inset-0 opacity-30"><SafeImg src={getValue(data,"heroImage")} alt="" className="t-ken h-full w-full object-cover grayscale" /></div>
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
            <div className="mb-3 h-16 w-16 overflow-hidden bg-[var(--surface)]"><SafeImg src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover" /></div>
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
    <section data-template-section-type="pageHero" className="relative overflow-hidden px-5 py-28 lg:px-8 bg-black font-mono text-white">
      <SafeImg src={getValue(data,"heroImage")} alt="" className="absolute inset-0 h-full w-full object-cover grayscale" />
      <div className="absolute inset-0 bg-[var(--dark)]/70" />
      <Reveal className="relative z-10 mx-auto max-w-5xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--a)]">{getValue(data,"heroEyebrow")}</p>
        <h1 className="t-display mt-5 text-5xl font-bold md:text-7xl">{getNavLabel(data, page)}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--muted)]">{getValue(data,"aboutText")}</p>
        <p className="mt-4 font-mono text-[var(--p)]">$ open /{page.id}</p>
      </Reveal>
    </section>
  );
}

function About({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="about" className="px-5 py-24 lg:px-8 bg-black font-mono text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <Reveal className="relative min-h-[360px] overflow-hidden border border-[var(--p)]/35 bg-[var(--surface)]">
          <SafeImg src={getValue(data,"sectionImage")} alt="" className="absolute inset-0 h-full w-full object-cover grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)]/80 to-transparent" />
          <span className="absolute bottom-6 right-6 rounded-full px-4 py-2 text-sm font-bold border border-[var(--p)] text-[var(--p)]">קוד</span>
        </Reveal>
        <Reveal variant="up" className="border border-[var(--p)]/35 bg-[var(--surface)] p-8 lg:p-12">
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
    <section data-template-section-type="why" className="px-5 py-24 lg:px-8 bg-black font-mono text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"whyEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"whyTitle")}</h2>
      </Reveal>
      <div className="mt-12 mx-auto max-w-4xl space-y-3">
        {reasonItems(data).map(([title, text], i) => (
          <Reveal key={title} delayMs={i * 80} className="t-hover border border-[var(--p)]/30 bg-black p-5">
            <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold border border-[var(--p)] text-[var(--p)]">{i + 1}</span>
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
    <section data-template-section-type="method" className="px-5 py-24 lg:px-8 bg-black font-mono text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"methodEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"methodTitle")}</h2>
      </Reveal>
      <div className="mx-auto mt-10 max-w-4xl border-r-2 border-[var(--p)]/40 pr-8">
        {methodItems(data).map(([title, text], i) => (
          <Reveal key={title} delayMs={i * 90} className="t-hover border border-[var(--p)]/30 bg-black p-5">
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
    <section data-template-section-type="gallery" className="px-5 py-24 lg:px-8 bg-black font-mono text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"galleryEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"galleryTitle")}</h2>
      </Reveal>
      <div className="mx-auto mt-10 grid max-w-5xl gap-3 md:grid-cols-4">
        {galleryItems(data).map((image, i) => (
          <Reveal key={image} delayMs={i * 80} className="t-hover relative min-h-[260px] overflow-hidden border border-[var(--p)]/35 bg-[var(--surface)]">
            <SafeImg src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-110 grayscale" />
            <span className="absolute bottom-4 right-4 px-3 py-1 text-xs font-bold border border-[var(--p)] text-[var(--p)]">0{i + 1}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Outcomes({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="outcomes" className="px-5 py-20 lg:px-8 bg-black font-mono text-white">
      <div className="mx-auto max-w-6xl border border-[var(--p)]/35 bg-[var(--surface)] p-8 lg:p-12">
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
    <section data-template-section-type="pricing" className="px-5 py-24 lg:px-8 bg-black font-mono text-white">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"pricingEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"pricingTitle")}</h2>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
        {priceItems(data).map(([title, text, price], i) => (
          <Reveal key={title} delayMs={i * 90} className="t-hover border border-[var(--p)]/30 bg-black p-5">
            <p className="text-sm text-[var(--muted)]">{title}</p>
            <p className="t-display mt-4 text-4xl font-bold">₪{price}</p>
            <p className="mt-4 min-h-14 text-sm leading-7 text-[var(--muted)]">{text}</p>
            <button type="button" onClick={() => goTo("contact")} className="mt-8 w-full px-5 py-3 text-sm font-bold border border-[var(--p)] text-[var(--p)]">{getValue(data,"ctaBandButton")}</button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Insights({ data, goTo }: Pick<PageProps, "data" | "goTo">) {
  return (
    <section data-template-section-type="insights" className="px-5 py-24 lg:px-8 bg-black font-mono text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.7fr_1.3fr]">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"insightsEyebrow")}</p>
          <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"insightsTitle")}</h2>
          <button type="button" onClick={() => goTo("faq")} className="mt-8 px-5 py-3 text-sm font-bold border border-[var(--p)] text-[var(--p)]">{getValue(data,"navFaq")}</button>
        </Reveal>
        <div className="grid gap-4">
          {insightItems(data).map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 80} className="t-hover border border-[var(--p)]/30 bg-black p-5">
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
    <section data-template-section-type="cta" className="px-5 py-20 lg:px-8 bg-black font-mono text-white">
      <Reveal className="mx-auto max-w-5xl border border-[var(--p)]/35 bg-[var(--surface)] p-8 text-center lg:p-14">
        <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data,"ctaBandTitle")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted)]">{getValue(data,"ctaBandText")}</p>
        <button type="button" onClick={() => goTo("contact")} className="mt-8 px-8 py-4 text-sm font-bold border border-[var(--p)] text-[var(--p)]">{getValue(data,"ctaBandButton")}</button>
      </Reveal>
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



export default function CodehausPages(props: CodehausPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...codehausDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "codehaus-preview" : "codehaus"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: codehausEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} openModal={() => setModalOpen(true)} />
      <VisualPageStack activePageId={currentPage} pages={codehausPages.map((page) => ({ id: page.id, content: <>{(pageSectionOrder[page.id] ?? pageSectionOrder.home).map((sectionName, index) => <React.Fragment key={page.id + "-" + sectionName + "-" + index}>{renderSection(sectionName, page, { data: mergedData, openModal: () => setModalOpen(true), goTo })}</React.Fragment>)}</> }))} />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
