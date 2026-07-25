import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { growthlyDefaultData } from "./defaultData";
import { growthlyEditorCss } from "./editorCss";

export const growthlyPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "cases", label: "פרויקטים", slug: "/cases" },
  { id: "team", label: "צוות", slug: "/team" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const allowedPages = growthlyPages.map((p) => p.id);

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
  return data?.[key] ?? (growthlyDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void }) {
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
    <header data-visual-flow-lock="true" data-template-section-type="header" className={`sticky top-0 z-50 border-b border-black/10 bg-[var(--surface)]/92 text-[var(--text)] backdrop-blur-xl`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="text-right">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-[var(--p)] text-sm font-black text-white">{getValue(data, "logoText")}</span>
            <div>
              <p className="ag-display text-xl font-extrabold leading-none">{getValue(data, "brandName")}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">{getValue(data, "tagline")}</p>
            </div>
          </div>
        </button>
        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => goTo(id)}
              className={`text-xs font-bold uppercase tracking-[0.14em] transition ${currentPage === id ? "text-[var(--p)]" : "opacity-70 hover:opacity-100"}`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => goTo("contact")} className="hidden bg-[var(--p)] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white md:inline-flex">
            {getValue(data, "heroPrimaryButton")}
          </button>
          <button type="button" className="grid h-11 w-11 place-items-center border border-black/10 lg:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? "×" : "☰"}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-black/10 px-5 py-4 lg:hidden">
          <div className="grid gap-2">
            {nav.map(([id, label]) => (
              <button key={id} type="button" onClick={() => { goTo(id); setOpen(false); }} className="py-2 text-right text-sm font-bold">
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Hero({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <section data-template-section-type="hero" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="text-right">
          <p className="inline-flex border border-[var(--p)]/30 bg-[var(--p)]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-6 text-4xl font-extrabold leading-tight md:text-6xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[var(--muted)] md:text-lg">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-start gap-3">
            <button type="button" onClick={() => goTo("contact")} className="bg-[var(--p)] px-7 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("cases")} className="border border-[var(--p)] px-7 py-4 text-sm font-black text-[var(--p)]">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </div>
        <div className={`overflow-hidden border border-black/10`}>
          <img src={getValue(data, "heroImage")} alt="" className="aspect-[4/3] h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  const stats = [
    [getValue(data, "statOne"), getValue(data, "statOneLabel")],
    [getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
    [getValue(data, "statThree"), getValue(data, "statThreeLabel")],
    [getValue(data, "statFour"), getValue(data, "statFourLabel")],
  ];
  return (
    <section className={`border-y border-black/10 bg-[var(--surface)] px-5 py-12 lg:px-8`}>
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className={`ag-card border border-black/10 bg-[var(--bg)] p-6 text-center`}>
            <p className="ag-display text-4xl font-extrabold text-[var(--p)]">{value}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--muted)]">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function About({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <img src={getValue(data, "aboutImage")} alt="" className={`aspect-[4/3] w-full object-cover border border-black/10`} />
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "aboutEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold leading-tight md:text-5xl">{getValue(data, "aboutTitle")}</h2>
          <p className="mt-6 text-base leading-8 text-[var(--muted)]">{getValue(data, "aboutText")}</p>
        </div>
      </div>
    </section>
  );
}

function Services({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const items = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
  ];
  return (
    <section className={`bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28`}>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "servicesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "servicesTitle")}</h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {items.map(([title, text], i) => (
            <article key={title} className={`ag-card border border-black/10 bg-[var(--bg)] p-7 text-right`}>
              <p className="text-sm font-black text-[var(--p)]">0{i + 1}</p>
              <h3 className="mt-3 text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              <button type="button" onClick={() => goTo("contact")} className="mt-6 text-sm font-black text-[var(--p)]">לפרטים ←</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cases({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "caseOneTitle"), getValue(data, "caseOneText")],
    [getValue(data, "caseTwoTitle"), getValue(data, "caseTwoText")],
    [getValue(data, "caseThreeTitle"), getValue(data, "caseThreeText")],
  ];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "casesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "casesTitle")}</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(([title, text], i) => (
            <article key={title} className={`ag-card min-h-[240px] border border-black/10 bg-[var(--surface)] p-7 text-right`}>
              <p className="ag-display text-5xl font-extrabold text-[var(--p)]/30">0{i + 1}</p>
              <h3 className="mt-4 text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "teamOneName"), getValue(data, "teamOneRole")],
    [getValue(data, "teamTwoName"), getValue(data, "teamTwoRole")],
    [getValue(data, "teamThreeName"), getValue(data, "teamThreeRole")],
  ];
  return (
    <section className={`bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28`}>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "teamEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "teamTitle")}</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(([name, role]) => (
            <article key={name} className={`ag-card border border-black/10 bg-[var(--bg)] p-8 text-center`}>
              <div className="mx-auto grid h-20 w-20 place-items-center bg-[var(--p)] text-2xl font-black text-white">{String(name).slice(0, 1)}</div>
              <h3 className="mt-5 text-xl font-bold">{name}</h3>
              <p className="mt-2 text-sm font-semibold text-[var(--muted)]">{role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Insights({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const items = [
    [getValue(data, "insightOneTitle"), getValue(data, "insightOneText")],
    [getValue(data, "insightTwoTitle"), getValue(data, "insightTwoText")],
    [getValue(data, "insightThreeTitle"), getValue(data, "insightThreeText")],
  ];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "insightsEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "insightsTitle")}</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(([title, text]) => (
            <article key={title} className={`ag-card border border-black/10 bg-[var(--surface)] p-7 text-right`}>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              <button type="button" onClick={() => goTo("contact")} className="mt-5 text-sm font-black text-[var(--p)]">קראו עוד ←</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ data }: { data: Record<string, any> }) {
  const steps = [
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    [getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];
  return (
    <section className={`bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28`}>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "processTitle")}</h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, text], i) => (
            <article key={title} className={`ag-card border border-black/10 bg-[var(--bg)] p-6 text-right`}>
              <p className="text-sm font-black text-[var(--p)]">שלב 0{i + 1}</p>
              <h3 className="mt-3 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className={`mx-auto grid max-w-7xl gap-8 border border-black/10 bg-[var(--surface)] p-6 md:p-10 lg:grid-cols-2`}>
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-5 text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm font-bold">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </div>
        <form className="grid gap-3">
          <input className={`border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none`} placeholder="שם מלא" />
          <input className={`border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none`} placeholder="טלפון" />
          <input className={`border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none`} placeholder="חברה / תחום" />
          <textarea className={`min-h-32 border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none`} placeholder="במה נוכל לעזור?" />
          <button type="button" className="bg-[var(--p)] px-6 py-4 text-sm font-black text-white">{getValue(data, "contactButton")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const links = growthlyPages.filter((p) => p.id !== "home");
  return (
    <footer className="bg-[var(--dark)] px-5 py-16 text-white lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="ag-display text-4xl font-extrabold md:text-6xl">{getValue(data, "brandName")}</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-2xl font-bold md:text-4xl">{getValue(data, "ctaTitle")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/70">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={() => goTo("contact")} className="mt-8 bg-[var(--p)] px-8 py-4 text-sm font-black text-white">
          {getValue(data, "ctaButton")}
        </button>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {links.map((p) => (
            <button key={p.id} type="button" onClick={() => goTo(p.id)} className="border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/80">
              {p.label}
            </button>
          ))}
        </div>
        <p className="mt-10 text-xs text-white/50">© {new Date().getFullYear()} {getValue(data, "brandName")} · {getValue(data, "footerText")}</p>
      </div>
    </footer>
  );
}

function PageHero({ data, title }: { data: Record<string, any>; title: string }) {
  return (
    <section className={`border-b border-black/10 px-5 py-14 lg:px-8 lg:py-20`}>
      <div className="mx-auto max-w-7xl text-right">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "brandName")} · {getValue(data, "nicheLabel")}</p>
        <h1 className="ag-display mt-4 text-4xl font-extrabold md:text-6xl">{title}</h1>
      </div>
    </section>
  );
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} />
      <Stats data={data} />
      <About data={data} />
      <Services data={data} goTo={goTo} />
      <Cases data={data} />
      <Team data={data} />
      <Insights data={data} goTo={goTo} />
      <Process data={data} />
      <Contact data={data} />
      <Footer data={data} goTo={goTo} />
    </>
  );
}

function InnerPage({ data, type, goTo }: { data: Record<string, any>; type: string; goTo: (id: string) => void }) {
  const titles: Record<string, string> = {
    about: getValue(data, "navAbout"),
    services: getValue(data, "navServices"),
    cases: getValue(data, "navCases"),
    team: getValue(data, "navTeam"),
    insights: getValue(data, "navInsights"),
    process: getValue(data, "navProcess"),
    contact: getValue(data, "navContact"),
  };

  const map: Record<string, React.ReactNode> = {
    about: (<><About data={data} /><Stats data={data} /><Team data={data} /></>),
    services: (<><Services data={data} goTo={goTo} /><Process data={data} /></>),
    cases: (<><Cases data={data} /><Stats data={data} /></>),
    team: (<><Team data={data} /><About data={data} /></>),
    insights: (<><Insights data={data} goTo={goTo} /><Cases data={data} /></>),
    process: (<><Process data={data} /><Services data={data} goTo={goTo} /></>),
    contact: (<><Contact data={data} /></>),
  };

  return (
    <>
      <PageHero data={data} title={titles[type] || getValue(data, "brandName")} />
      {map[type] ?? null}
      <Footer data={data} goTo={goTo} />
    </>
  );
}

export default function GrowthlyPages({
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
  const mergedData = useMemo(() => ({ ...growthlyDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "growthly-preview" : "growthly"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: growthlyEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} goTo={goTo} /> },
          ...growthlyPages.filter((p) => p.id !== "home").map((p) => ({
            id: p.id,
            content: <InnerPage data={mergedData} type={p.id} goTo={goTo} />,
          })),
        ]}
      />
    </div>
  );
}
