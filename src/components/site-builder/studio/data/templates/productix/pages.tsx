import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { productixDefaultData } from "./defaultData";
import { productixEditorCss } from "./editorCss";

export const productixPages = [
  {
    "id": "home",
    "label": "בית",
    "slug": "/"
  },
  {
    "id": "about",
    "label": "אודות",
    "slug": "/about"
  },
  {
    "id": "services",
    "label": "שירותים",
    "slug": "/services"
  },
  {
    "id": "cases",
    "label": "פרויקטים",
    "slug": "/cases"
  },
  {
    "id": "team",
    "label": "צוות",
    "slug": "/team"
  },
  {
    "id": "insights",
    "label": "תובנות",
    "slug": "/insights"
  },
  {
    "id": "process",
    "label": "תהליך",
    "slug": "/process"
  },
  {
    "id": "contact",
    "label": "צור קשר",
    "slug": "/contact"
  }
];

export const pageSectionOrder = {
  home: [
    "Hero",
    "Team",
    "Gallery",
    "Stats",
    "Outcomes",
    "Insights",
    "Pricing",
    "Faq",
    "CTABand",
    "Contact",
    "About",
    "Services",
    "WhyUs",
    "Cases",
    "Method",
    "Footer"
  ],
  about: [
    "PageHero",
    "Method",
    "Outcomes",
    "Insights",
    "Services",
    "Faq",
    "CTABand",
    "Contact",
    "About",
    "WhyUs",
    "Stats",
    "Team",
    "Gallery",
    "Footer"
  ],
  services: [
    "PageHero",
    "Stats",
    "Outcomes",
    "Team",
    "Insights",
    "Faq",
    "CTABand",
    "Contact",
    "Services",
    "Method",
    "Pricing",
    "WhyUs",
    "Cases",
    "Footer"
  ],
  cases: [
    "PageHero",
    "WhyUs",
    "Method",
    "Team",
    "Insights",
    "Pricing",
    "CTABand",
    "Contact",
    "Cases",
    "Stats",
    "Outcomes",
    "Gallery",
    "Services",
    "Footer"
  ],
  team: [
    "PageHero",
    "Stats",
    "Outcomes",
    "Services",
    "Cases",
    "Insights",
    "CTABand",
    "Contact",
    "Team",
    "About",
    "WhyUs",
    "Gallery",
    "Method",
    "Footer"
  ],
  insights: [
    "PageHero",
    "Services",
    "Outcomes",
    "Gallery",
    "Team",
    "Pricing",
    "Faq",
    "Contact",
    "Insights",
    "Stats",
    "Cases",
    "Method",
    "WhyUs",
    "Footer"
  ],
  process: [
    "PageHero",
    "Team",
    "Outcomes",
    "Gallery",
    "Insights",
    "Pricing",
    "Faq",
    "Contact",
    "Method",
    "Services",
    "WhyUs",
    "Stats",
    "Cases",
    "Footer"
  ],
  contact: [
    "PageHero",
    "WhyUs",
    "Method",
    "Stats",
    "Team",
    "Gallery",
    "Faq",
    "Contact",
    "CTABand",
    "About",
    "Services",
    "Cases",
    "Footer"
  ]
} as const;

const allowedPages = productixPages.map((p) => p.id);

type Props = {
  initialPage?: string;
  initialPageId?: string;
  page?: string;
  pageId?: string;
  activePageId?: string;
  currentPageId?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (productixDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void }) {
  void "productix:Header:5:roadmap product ui";
  const [open, setOpen] = useState(false);
  const nav = [
    ["home", getValue(data, "navHome")],
    ["about", getValue(data, "navAbout")],
    ["services", getValue(data, "navServices")],
    ["cases", getValue(data, "navCases")],
    ["team", getValue(data, "navTeam")],
    ["insights", getValue(data, "navInsights")],
    ["process", getValue(data, "navProcess")],
    ["contact", getValue(data, "navContact")],
  ];
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 mx-3 mt-3 rounded-full border border-white/15 bg-[var(--surface)]/85 text-[var(--text)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="group flex items-center gap-3 text-right">
          <span className="ag-pulse grid h-11 w-11 place-items-center rounded-full bg-[var(--p)] text-sm font-black text-white">PR</span>
          <span>
            <span className="ag-display block text-xl font-black leading-none">{getValue(data, "brandName")}</span>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">{getValue(data, "tagline")}</span>
          </span>
        </button>
        <nav className="hidden items-center gap-2 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className={(currentPage === id ? "bg-[var(--p)] text-white " : "text-current/70 hover:text-current ") + "rounded-full px-4 py-2 text-xs font-black transition"}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={() => goTo("contact")} className="hidden rounded-full bg-[var(--a)] px-5 py-3 text-xs font-black text-[var(--dark)] md:inline-flex">{getValue(data, "heroPrimaryButton")}</button>
        <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-current/20 lg:hidden" onClick={() => setOpen((v) => !v)}>{open ? "×" : "☰"}</button>
      </div>
      {open ? (
        <div className="border-t border-current/10 px-5 py-4 lg:hidden">
          <div className="grid gap-2">
            {nav.map(([id, label]) => (
              <button key={id} type="button" onClick={() => { goTo(id); setOpen(false); }} className="rounded-2xl bg-current/5 px-4 py-3 text-right text-sm font-bold">{label}</button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function PageHero({ data, pageId }: { data: Record<string, any>; pageId: string }) {
  void "productix:PageHero:5:roadmap product ui";
  const pageTitles: Record<string, string> = {
    about: getValue(data, "navAbout"),
    services: getValue(data, "navServices"),
    cases: getValue(data, "navCases"),
    team: getValue(data, "navTeam"),
    insights: getValue(data, "navInsights"),
    process: getValue(data, "navProcess"),
    contact: getValue(data, "navContact"),
  };
  return (
    <section className="relative overflow-hidden bg-[var(--bg)] px-5 py-20 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--a)]/60" />
      <Reveal variant="up" className="mx-auto max-w-7xl text-right">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--a)]">{getValue(data, "brandName")} · {getValue(data, "nicheLabel")}</p>
        <h1 className="ag-display mt-5 max-w-5xl text-5xl font-black leading-none md:text-7xl">{pageTitles[pageId] || getValue(data, "brandName")}</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
      </Reveal>
    </section>
  );
}

function Hero({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  void "productix:Hero:5:roadmap product ui";
  const stats = [
    [getValue(data, "statOne"), getValue(data, "statOneLabel")],
    [getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
    [getValue(data, "statThree"), getValue(data, "statThreeLabel")],
    [getValue(data, "statFour"), getValue(data, "statFourLabel")],
  ];
  return (
    <section data-template-section-type="hero" className="relative overflow-hidden bg-[var(--dark)] text-white">
      <img src={getValue(data, "heroImage")} alt="" className="ag-ken absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-l from-[var(--dark)] via-[var(--dark)]/80 to-[var(--p)]/30" />
      <div className="relative z-10 mx-auto grid min-h-[92svh] max-w-7xl items-center gap-8 px-5 py-20 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
        <Reveal variant="scale" className="order-2 grid gap-4 lg:order-1">
          {stats.map(([value, label], i) => (
            <div key={label} className="ag-card rounded-full border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-xl">
              <p className="ag-display text-3xl font-black text-[var(--a)]">{value}</p>
              <p className="text-xs font-bold text-white/70">{label}</p>
            </div>
          ))}
        </Reveal>
        <Reveal variant="right" className="order-1 text-right lg:order-2">
          <div className="mb-8 inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-black text-[var(--a)]">{getValue(data, "heroEyebrow")}</div>
          <h1 className="ag-display max-w-5xl text-5xl font-black leading-[0.95] md:text-7xl lg:text-8xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="ag-pulse bg-[var(--a)] px-8 py-4 text-sm font-black text-[var(--dark)]">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("cases")} className="border border-white/30 px-8 py-4 text-sm font-black">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function About({ data }: { data: Record<string, any> }) {
  void "productix:About:5:roadmap product ui";
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr] items-center">
        <Reveal variant="right" className="">
          <div className="relative overflow-hidden rounded-[1rem_5rem_1rem_5rem] border border-current/10 bg-[var(--surface)] p-3">
            <img src={getValue(data, "aboutImage")} alt="" className="ag-ken h-[520px] w-full object-cover" />
            <div className="absolute bottom-6 right-6 rounded-3xl bg-[var(--dark)]/80 p-5 text-white backdrop-blur">
              <p className="text-xs font-black text-[var(--a)]">ROADMAP PRODUCT UI</p>
              <p className="ag-display mt-2 text-3xl font-black">{getValue(data, "statOne")}</p>
            </div>
          </div>
        </Reveal>
        <Reveal variant="up" className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "aboutEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black leading-tight md:text-6xl">{getValue(data, "aboutTitle")}</h2>
          <p className="mt-6 text-base leading-8 text-[var(--muted)]">{getValue(data, "aboutText")}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[getValue(data, "whyOneTitle"), getValue(data, "whyTwoTitle"), getValue(data, "whyThreeTitle")].map((item, i) => (
              <div key={item} className="ag-card rounded-3xl border border-current/10 bg-[var(--surface)] p-5">
                <span className="ag-display text-3xl font-black text-[var(--a)]">0{i + 1}</span>
                <p className="mt-3 text-sm font-bold">{item}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Services({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  void "productix:Services:5:roadmap product ui";
  const services = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
  ];
  return (
    <section className="bg-[var(--dark)] text-white px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--a)]">{getValue(data, "servicesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "servicesTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_1fr_0.9fr]">
          {services.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90} variant="scale">
              <article className="ag-card group min-h-[260px] rounded-[2rem] border border-current/10 bg-[var(--bg)]/60 p-6 text-right backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <span className="ag-display text-2xl md:text-5xl font-black text-[var(--p)]/40">0{i + 1}</span>
                  <span className="h-12 w-12 rounded-full bg-[var(--a)]/20 transition group-hover:scale-125" />
                </div>
                <h3 className="mt-8 text-2xl font-black">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
                <button type="button" onClick={() => goTo("contact")} className="mt-6 text-xs font-black text-[var(--a)]">בדקו התאמה ←</button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cases({ data }: { data: Record<string, any> }) {
  void "productix:Cases:5:roadmap product ui";
  const items = [
    [getValue(data, "caseOneTitle"), getValue(data, "caseOneText"), getValue(data, "caseOneImage")],
    [getValue(data, "caseTwoTitle"), getValue(data, "caseTwoText"), getValue(data, "caseTwoImage")],
    [getValue(data, "caseThreeTitle"), getValue(data, "caseThreeText"), getValue(data, "caseThreeImage")],
  ];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "casesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "casesTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {items.map(([title, text, image], i) => (
            <Reveal key={title} delayMs={i * 110} variant="up">
              <article className="ag-card relative min-h-[520px] overflow-hidden rounded-t-[5rem] rounded-b-3xl border border-current/10 bg-[var(--surface)] text-right">
                <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)] via-[var(--dark)]/55 to-transparent" />
                <div className="relative z-10 flex min-h-[inherit] flex-col justify-end p-7 text-white">
                  <span className="mb-5 w-fit rounded-full bg-[var(--a)] px-4 py-2 text-xs font-black text-[var(--dark)]">CASE 0{i + 1}</span>
                  <h3 className="ag-display text-3xl font-black md:text-5xl">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/75">{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team({ data }: { data: Record<string, any> }) {
  void "productix:Team:5:roadmap product ui";
  const people = [
    [getValue(data, "teamOneName"), getValue(data, "teamOneRole"), getValue(data, "teamOneImage")],
    [getValue(data, "teamTwoName"), getValue(data, "teamTwoRole"), getValue(data, "teamTwoImage")],
    [getValue(data, "teamThreeName"), getValue(data, "teamThreeRole"), getValue(data, "teamThreeImage")],
  ];
  return (
    <section className="bg-[var(--bg)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "teamEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "teamTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {people.map(([name, role, image], i) => (
            <Reveal key={name} delayMs={i * 100} variant="scale">
              <article className="ag-card overflow-hidden rounded-[2.5rem] border border-current/10 bg-[var(--surface)] text-right">
                <div className="relative h-[420px]">
                  <img src={image} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)]/90 to-transparent" />
                  <div className="absolute bottom-0 right-0 p-6 text-white">
                    <p className="ag-display text-2xl md:text-5xl font-black text-[var(--a)]">0{i + 1}</p>
                    <h3 className="mt-2 text-3xl font-black">{name}</h3>
                    <p className="mt-1 text-sm font-bold text-white/70">{role}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ data }: { data: Record<string, any> }) {
  void "productix:Gallery:5:roadmap product ui";
  const images = [
    getValue(data, "galleryOneImage"),
    getValue(data, "galleryTwoImage"),
    getValue(data, "galleryThreeImage"),
    getValue(data, "galleryFourImage"),
  ];
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "galleryEyebrow")}</p>
          <h2 className="ag-display mt-3 text-4xl font-black md:text-6xl">{getValue(data, "galleryTitle")}</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {images.map((image, i) => (
            <Reveal key={image} delayMs={i * 80} variant="scale" className="even:md:translate-y-10">
              <div className="ag-card h-[300px] overflow-hidden rounded-[1rem_4rem_1rem_4rem] border border-current/10 bg-[var(--surface)] p-2">
                <img src={image} alt="" className="ag-ken h-full w-full object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs({ data, goTo }: { data: Record<string, any>; goTo?: (id: string) => void }) {
  void "productix:WhyUs:5:roadmap product ui";
  const items = [
    [getValue(data, "whyOneTitle"), getValue(data, "whyOneText")],
    [getValue(data, "whyTwoTitle"), getValue(data, "whyTwoText")],
    [getValue(data, "whyThreeTitle"), getValue(data, "whyThreeText")],
  ];
  return (
    <section className="bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "whyEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "whyTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90} variant="scale">
              <article className="ag-card rounded-[1rem_3rem_1rem_3rem] border border-current/10 bg-[var(--surface)] p-7 text-right">
                <div className="mb-7 h-2 w-28 rounded-full bg-[var(--a)]" />
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
                
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Method({ data }: { data: Record<string, any> }) {
  void "productix:Method:5:roadmap product ui";
  const steps = [[getValue(data, "processOneTitle"), getValue(data, "processOneText")], [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")], [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")], [getValue(data, "processFourTitle"), getValue(data, "processFourText")]];
  return (
    <section className="bg-[var(--bg)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--a)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "processTitle")}</h2>
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-4">
          {steps.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 100} variant="scale">
              <article className="ag-card rounded-[1rem_3rem_1rem_3rem] border border-current/10 bg-[var(--surface)]/80 p-6 text-right ">
                <span className="ag-display grid h-14 w-14 place-items-center rounded-full bg-[var(--p)] text-xl font-black text-white">0{i + 1}</span>
                <h3 className="mt-8 text-2xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  void "productix:Stats:5:roadmap product ui";
  const stats = [[getValue(data, "statOne"), getValue(data, "statOneLabel")], [getValue(data, "statTwo"), getValue(data, "statTwoLabel")], [getValue(data, "statThree"), getValue(data, "statThreeLabel")], [getValue(data, "statFour"), getValue(data, "statFourLabel")]];
  return (
    <section className="bg-[var(--surface)] px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {stats.map(([value, label], i) => (
          <Reveal key={label} delayMs={i * 80} variant="scale">
            <div className="ag-card rounded-[1rem_3rem_1rem_3rem] border border-current/10 bg-[var(--surface)] p-7 text-right">
              <p className="ag-display text-2xl md:text-5xl font-black text-[var(--p)]">{value}</p>
              <p className="mt-3 text-sm font-bold text-[var(--muted)]">{label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Outcomes({ data, goTo }: { data: Record<string, any>; goTo?: (id: string) => void }) {
  void "productix:Outcomes:5:roadmap product ui";
  const items = [
    [getValue(data, "outcomeOneTitle"), getValue(data, "outcomeOneText")],
    [getValue(data, "outcomeTwoTitle"), getValue(data, "outcomeTwoText")],
    [getValue(data, "outcomeThreeTitle"), getValue(data, "outcomeThreeText")],
  ];
  return (
    <section className="bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "outcomesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "outcomesTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90} variant="scale">
              <article className="ag-card rounded-[1rem_3rem_1rem_3rem] border border-current/10 bg-[var(--surface)] p-7 text-right">
                <div className="mb-7 h-2 w-28 rounded-full bg-[var(--a)]" />
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
                
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Insights({ data, goTo }: { data: Record<string, any>; goTo?: (id: string) => void }) {
  void "productix:Insights:5:roadmap product ui";
  const items = [
    [getValue(data, "insightOneTitle"), getValue(data, "insightOneText")],
    [getValue(data, "insightTwoTitle"), getValue(data, "insightTwoText")],
    [getValue(data, "insightThreeTitle"), getValue(data, "insightThreeText")],
  ];
  return (
    <section className="bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "insightsEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "insightsTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90} variant="scale">
              <article className="ag-card rounded-[1rem_3rem_1rem_3rem] border border-current/10 bg-[var(--surface)] p-7 text-right">
                <div className="mb-7 h-2 w-28 rounded-full bg-[var(--a)]" />
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
                <button type="button" onClick={() => goTo?.("contact")} className="mt-6 text-xs font-black text-[var(--p)]">קראו עוד</button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ data }: { data: Record<string, any> }) {
  void "productix:Pricing:5:roadmap product ui";
  const tiers = [[getValue(data, "pricingOneTitle"), getValue(data, "pricingOnePrice"), getValue(data, "pricingOneText")], [getValue(data, "pricingTwoTitle"), getValue(data, "pricingTwoPrice"), getValue(data, "pricingTwoText")], [getValue(data, "pricingThreeTitle"), getValue(data, "pricingThreePrice"), getValue(data, "pricingThreeText")]];
  return (
    <section className="bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "pricingEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "pricingTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {tiers.map(([title, price, text], i) => (
            <Reveal key={title} delayMs={i * 90} variant="scale">
              <article className="ag-card rounded-[1rem_3rem_1rem_3rem] border border-current/10 bg-[var(--surface)] p-7 text-right">
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="ag-display mt-6 text-2xl sm:text-4xl font-black text-[var(--p)]">{price}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ data }: { data: Record<string, any> }) {
  void "productix:Faq:5:roadmap product ui";
  const faqs = [[getValue(data, "faqOneQuestion"), getValue(data, "faqOneAnswer")], [getValue(data, "faqTwoQuestion"), getValue(data, "faqTwoAnswer")], [getValue(data, "faqThreeQuestion"), getValue(data, "faqThreeAnswer")]];
  return (
    <section className="px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "faqEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "faqTitle")}</h2>
        </Reveal>
        <div className="mt-10 grid gap-3">
          {faqs.map(([q, a], i) => (
            <Reveal key={q} delayMs={i * 80} variant="up">
              <article className="ag-card rounded-[1rem_3rem_1rem_3rem] border border-current/10 bg-[var(--surface)] p-6 text-right">
                <h3 className="text-xl font-black">{q}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{a}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABand({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  void "productix:CTABand:5:roadmap product ui";
  return (
    <section className="px-5 py-12 lg:px-8">
      <Reveal variant="scale" className="mx-auto max-w-7xl overflow-hidden rounded-[1rem_3rem_1rem_3rem] bg-[var(--p)] p-8 text-right text-white md:p-12">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-white/70">{getValue(data, "nicheLabel")}</p>
            <h2 className="ag-display mt-3 text-4xl font-black md:text-6xl">{getValue(data, "ctaTitle")}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/80">{getValue(data, "ctaText")}</p>
          </div>
          <button type="button" onClick={() => goTo("contact")} className="ag-pulse rounded-full bg-[var(--a)] px-8 py-4 text-sm font-black text-[var(--dark)]">{getValue(data, "ctaButton")}</button>
        </div>
      </Reveal>
    </section>
  );
}

function Contact({ data }: { data: Record<string, any> }) {
  void "productix:Contact:5:roadmap product ui";
  return (
    <section className="bg-[var(--dark)] text-white px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal variant="right" className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--a)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-5 text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 grid gap-3 text-sm font-bold">
            <span className="rounded-full border border-current/10 px-4 py-3">{getValue(data, "phone")}</span>
            <span className="rounded-full border border-current/10 px-4 py-3">{getValue(data, "email")}</span>
            <span className="rounded-full border border-current/10 px-4 py-3">{getValue(data, "address")}</span>
          </div>
        </Reveal>
        <Reveal variant="scale" className="rounded-[1rem_3rem_1rem_3rem] border border-current/10 bg-[var(--bg)]/60 p-5 md:p-8">
          <form className="grid gap-3">
            <input className="rounded-2xl border border-current/10 bg-[var(--surface)] px-4 py-4 text-right outline-none" placeholder="שם מלא" />
            <div className="grid gap-3 md:grid-cols-2">
              <input className="rounded-2xl border border-current/10 bg-[var(--surface)] px-4 py-4 text-right outline-none" placeholder="טלפון" />
              <input className="rounded-2xl border border-current/10 bg-[var(--surface)] px-4 py-4 text-right outline-none" placeholder="חברה / תחום" />
            </div>
            <textarea className="min-h-32 rounded-2xl border border-current/10 bg-[var(--surface)] px-4 py-4 text-right outline-none" placeholder="במה נוכל לעזור?" />
            <button type="button" className="rounded-2xl bg-[var(--p)] px-6 py-4 text-sm font-black text-white">{getValue(data, "contactButton")}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  void "productix:Footer:5:roadmap product ui";
  const links = productixPages.filter((p) => p.id !== "home");
  return (
    <footer data-template-section-type="footer" className="bg-[var(--dark)] px-5 py-16 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 text-right lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <p className="ag-display text-2xl md:text-5xl font-black">{getValue(data, "brandName")}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/60">{getValue(data, "footerText")}</p>
        </Reveal>
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            {links.map((p) => (
              <button key={p.id} type="button" onClick={() => goTo(p.id)} className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/75">{p.label}</button>
            ))}
          </div>
          <p className="text-xs text-white/45">© {new Date().getFullYear()} {getValue(data, "brandName")} · Bizuply</p>
        </div>
      </div>
    </footer>
  );
}

function RenderSection({ name, data, goTo, pageId }: { name: string; data: Record<string, any>; goTo: (id: string) => void; pageId: string }) {
  switch (name) {
    case "PageHero":
      return <PageHero data={data} pageId={pageId} />;
    case "Hero":
      return <Hero data={data} goTo={goTo} />;
    case "About":
      return <About data={data} />;
    case "Services":
      return <Services data={data} goTo={goTo} />;
    case "Cases":
      return <Cases data={data} />;
    case "WhyUs":
      return <WhyUs data={data} goTo={goTo} />;
    case "Method":
      return <Method data={data} />;
    case "Team":
      return <Team data={data} />;
    case "Gallery":
      return <Gallery data={data} />;
    case "Stats":
      return <Stats data={data} />;
    case "Outcomes":
      return <Outcomes data={data} goTo={goTo} />;
    case "Insights":
      return <Insights data={data} goTo={goTo} />;
    case "Pricing":
      return <Pricing data={data} />;
    case "Faq":
      return <Faq data={data} />;
    case "CTABand":
      return <CTABand data={data} goTo={goTo} />;
    case "Contact":
      return <Contact data={data} />;
    case "Footer":
      return <Footer data={data} goTo={goTo} />;
    default:
      return null;
  }
}

function TemplatePage({ pageId, data, goTo }: { pageId: keyof typeof pageSectionOrder; data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      {pageSectionOrder[pageId].map((sectionName) => (
        <RenderSection key={sectionName} name={sectionName} data={data} goTo={goTo} pageId={pageId} />
      ))}
    </>
  );
}

export default function ProductixPages({
  initialPage = "home",
  initialPageId,
  page,
  pageId,
  activePageId,
  currentPageId,
  mode = "preview",
  data,
  onPageChange,
  isPublic,
  viewMode,
  runtimeMode,
}: Props) {
  const mergedData = useMemo(() => ({ ...productixDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "productix-preview" : "productix"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: productixEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={productixPages.map((p) => ({
          id: p.id,
          content: <TemplatePage pageId={p.id as keyof typeof pageSectionOrder} data={mergedData} goTo={goTo} />,
        }))}
      />
    </div>
  );
}
