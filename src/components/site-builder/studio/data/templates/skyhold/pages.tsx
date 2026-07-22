import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { skyholdDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const skyholdPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "penthouses", label: "פנטהאוזים", slug: "/penthouses" },
  { id: "towers", label: "מגדלים", slug: "/towers" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = skyholdPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (skyholdDefaultData as Record<string, any>)[key] ?? "";
}
function cx(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = skyholdPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#0f1419f2", borderColor: "rgba(232,237,245,0.14)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#38bdf8", color: "#0f1419" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#e8edf5" : "#7a8fa8" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#38bdf8", color: "#0f1419" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(232,237,245,0.14)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(232,237,245,0.14)" }}>
          <div className="grid gap-1 pt-3">
            {nav.map(([id, label]) => (
              <button key={id} type="button" onClick={() => { goTo(id); setOpen(false); }} className="px-3 py-3 text-right text-sm font-semibold">{label}</button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function ContactForm({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  const field = "w-full border bg-transparent px-4 py-3.5 text-right outline-none";
  return (
    <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
      <input className={field} style={{ borderColor: "rgba(232,237,245,0.14)", color: "#e8edf5" }} placeholder="שם מלא" />
      <input className={field} style={{ borderColor: "rgba(232,237,245,0.14)", color: "#e8edf5" }} placeholder="טלפון" />
      <input className={field} style={{ borderColor: "rgba(232,237,245,0.14)", color: "#e8edf5" }} placeholder="אימייל" />
      <textarea className={cx(field, "min-h-28")} style={{ borderColor: "rgba(232,237,245,0.14)", color: "#e8edf5" }} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#38bdf8", color: "#0f1419" }}>{v(data, "cta")}</button>
    </form>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="grid min-h-[90vh] lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col items-center justify-center border-l px-8 py-16" style={{ borderColor: "rgba(232,237,245,0.14)", background: "#1a2332" }}>
          <p className="text-xs tracking-[0.3em]" style={{ color: "#38bdf8" }}>קומה</p>
          <div className="tpl-elevator-digits tpl-display mt-4 overflow-hidden text-7xl font-bold" style={{ height: "1.2em", color: "#38bdf8" }}>
            <div>42</div><div>28</div><div>15</div><div>03</div>
          </div>
        </div>
        <div className="relative min-h-[50vh] lg:min-h-[90vh]">
          <img src={v(data, "heroImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "#080c1088" }} />
          <div className="relative z-10 flex h-full flex-col justify-end p-8 lg:p-12">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#38bdf8" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#7a8fa8" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#38bdf8", color: "#0f1419" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("penthouses")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(232,237,245,0.14)" }}>{v(data, "heroSecondary")}</button>
          </div></div>
        </div>
      </section>
  );
}


function PenthouseStack({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"rgba(232,237,245,0.14)", background:"#1a2332" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        {[1,2,3].map((i)=>(<article key={i} className="tpl-climb flex flex-col overflow-hidden border md:flex-row" style={{ borderColor:"rgba(232,237,245,0.14)", animationDelay:`${i*0.12}s`, marginRight:`${i*12}px` }}>
          <img src={v(data,`item${i}Image`)} alt="" className="h-48 w-full object-cover md:h-auto md:w-72" />
          <div className="p-6"><h3 className="tpl-display text-2xl font-bold">{v(data,`item${i}Title`)}</h3><p className="mt-2" style={{ color:"#38bdf8" }}>{v(data,`item${i}Price`)}</p></div>
        </article>))}
      </div>
    </section>
  );
}
function SkylineStats({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor:"rgba(232,237,245,0.14)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 text-center">
        {stats.map(([vk, lk], i) => (
          <div key={lk} className="tpl-climb" style={{ animationDelay:`${i*0.1}s` }}>
            <div className="tpl-display text-4xl font-bold" style={{ color:"#38bdf8" }}>{v(data, vk)}</div>
            <p className="mt-2 text-sm" style={{ color:"#7a8fa8" }}>{v(data, lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TowerGalleryWall({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,237,245,0.14)", background: "#1a2332" }}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {[1,2,3].map((i) => (
          <article key={i} className="tpl-climb overflow-hidden border" style={{ borderColor: "rgba(232,237,245,0.14)", marginRight: `${i*16}px`, animationDelay: `${i*0.12}s` }}>
            <img src={v(data, `item${i}Image`)} alt="" className="h-48 w-full object-cover" />
            <div className="p-5"><h3 className="tpl-display text-xl font-bold">{v(data, `item${i}Title`)}</h3></div>
          </article>
        ))}
      </div>
    </section>
  );
}
function TowerAgentRoster({ data }: { data: Record<string, any> }) {
  const agents = [1,2,3,4].map((i) => ({ n: v(data, `agent${i}Name`), r: v(data, `agent${i}Role`), d: v(data, `agent${i}Deals`), img: v(data, `agent${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,237,245,0.14)", background: "#1a2332" }}>
      <div className="mx-auto max-w-7xl divide-y" style={{ borderColor: "rgba(232,237,245,0.14)" }}>
        {agents.map((a) => (
          <div key={a.n} className="flex flex-wrap items-center gap-5 py-6">
            <img src={a.img} alt="" className="h-20 w-20 rounded-full object-cover" />
            <div><h3 className="tpl-display text-xl font-bold">{a.n}</h3><p style={{ color: "#38bdf8" }}>{a.r} · {a.d}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
function TowerQuoteRail({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(232,237,245,0.14)" }}>
      <div className="mx-auto max-w-3xl border-r-4 pr-8" style={{ borderColor: "#38bdf8" }}>
        <p className="tpl-display text-3xl font-bold leading-snug">{v(data, "quote")}</p>
        <p className="mt-4 text-sm" style={{ color: "#7a8fa8" }}>— {v(data, "brandName")}</p>
      </div>
    </section>
  );
}
function TowerTrustMetrics({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(232,237,245,0.14)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4">
        {stats.map(([vk,lk],i) => (
          <div key={lk} className="tpl-climb border p-5 text-center" style={{ borderColor: "rgba(232,237,245,0.14)", animationDelay: `${i*0.1}s` }}>
            <div className="tpl-display text-4xl font-bold" style={{ color: "#38bdf8" }}>{v(data,vk)}</div>
            <p className="mt-2 text-sm" style={{ color: "#7a8fa8" }}>{v(data,lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
function TowerMarketPulse({ data }: { data: Record<string, any> }) {
  const posts = [[v(data,"insight1Title"),v(data,"insight1Text"),v(data,"insight1Tag")],[v(data,"insight2Title"),v(data,"insight2Text"),v(data,"insight2Tag")],[v(data,"insight3Title"),v(data,"insight3Text"),v(data,"insight3Tag")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,237,245,0.14)", background: "#1a2332" }}>
      <h2 className="tpl-display mx-auto max-w-7xl text-4xl font-bold">תובנות Tower</h2>
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 lg:grid-cols-3">
        {posts.map(([t,x,g]) => (
          <article key={t} className="border p-5" style={{ borderColor: "rgba(232,237,245,0.14)" }}>
            <span className="text-[10px] font-bold" style={{ color: "#38bdf8" }}>{g}</span>
            <h3 className="tpl-display mt-2 text-xl font-bold">{t}</h3>
            <p className="mt-2 text-sm leading-7" style={{ color: "#7a8fa8" }}>{x}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TowerCtaRibbon({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="px-5 py-14 lg:px-8" style={{ background: "#38bdf8" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div><h2 className="tpl-display text-3xl font-bold md:text-4xl" style={{ color: "#0f1419" }}>{v(data,"ctaTitle")}</h2>
        <p className="mt-2 max-w-xl" style={{ color: "#0f1419", opacity: 0.85 }}>{v(data,"ctaText")}</p></div>
        <button type="button" onClick={onCta} className="border-2 px-8 py-3 font-bold" style={{ borderColor: "#0f1419", color: "#0f1419" }}>{v(data,"cta")}</button>
      </div>
    </section>
  );
}

function TowerFaqPanel({ data }: { data: Record<string, any> }) {
  const faqs = [[v(data,"faq1Q"),v(data,"faq1A")],[v(data,"faq2Q"),v(data,"faq2A")],[v(data,"faq3Q"),v(data,"faq3A")],[v(data,"faq4Q"),v(data,"faq4A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,237,245,0.14)" }}>
      <div className="mx-auto max-w-3xl grid gap-2">
        {faqs.map(([q,a]) => (
          <details key={q} className="border" style={{ borderColor: "rgba(232,237,245,0.14)" }}>
            <summary className="cursor-pointer px-4 py-3 font-bold">{q}</summary>
            <p className="border-t px-4 py-3 text-sm leading-7" style={{ borderColor: "rgba(232,237,245,0.14)", color: "#7a8fa8" }}>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function TowerOfficeBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,237,245,0.14)", background: "#1a2332" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data,"officeTitle")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#7a8fa8" }}>{v(data,"officeText")}</p>
          <p className="mt-6 text-sm font-semibold">{v(data,"phone")} · {v(data,"email")}</p>
        </div>
        <div className="relative min-h-[280px] overflow-hidden border" style={{ borderColor: "rgba(232,237,245,0.14)" }}>
          <img src={v(data,"aboutImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function TowerAwardsLane({ data }: { data: Record<string, any> }) {
  const awards = [v(data,"award1"),v(data,"award2"),v(data,"award3"),v(data,"award4")];
  return (
    <section className="overflow-hidden border-y py-4" style={{ borderColor: "rgba(232,237,245,0.14)", background: "#0f1419" }}>
      <div className="tpl-marquee-track gap-10 px-6 text-xs font-bold tracking-[0.25em]" style={{ color: "#38bdf8" }}>
        {awards.concat(awards).map((a,i) => <span key={i} className="whitespace-nowrap">{a} ·</span>)}
      </div>
    </section>
  );
}

function TowerProcessRail({ data }: { data: Record<string, any> }) {
  const steps = [[v(data,"step1"),v(data,"step1Desc")],[v(data,"step2"),v(data,"step2Desc")],[v(data,"step3"),v(data,"step3Desc")],[v(data,"step4"),v(data,"step4Desc")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,237,245,0.14)" }}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {steps.map(([t,d],i) => (
          <div key={t} className="tpl-climb border-t pt-4" style={{ borderColor: "#38bdf8", animationDelay: `${i*0.1}s` }}>
            <span className="text-2xl font-bold" style={{ color: "#38bdf8" }}>0{i+1}</span>
            <h3 className="mt-2 font-bold">{t}</h3><p className="mt-1 text-sm" style={{ color: "#7a8fa8" }}>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TowerListingGrid({ data }: { data: Record<string, any> }) {
  const cards = [1,2,3,4].map((i) => ({ t: v(data,`item${i}Title`), m: v(data,`item${i}Meta`), p: v(data,`item${i}Price`), img: v(data,`item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,237,245,0.14)", background: "#1a2332" }}>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <article key={c.t} className="overflow-hidden border" style={{ borderColor: "rgba(232,237,245,0.14)" }}>
            <img src={c.img} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="p-4"><p className="text-xs" style={{ color: "#38bdf8" }}>{c.m}</p><h3 className="font-bold">{c.t}</h3><p className="mt-2 font-bold" style={{ color: "#38bdf8" }}>{c.p}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TowerStatsRow({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-10 lg:px-8" style={{ borderColor: "rgba(232,237,245,0.14)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 text-center">
        {stats.map(([vk,lk],i) => (
          <div key={lk} className="tpl-climb" style={{ animationDelay: `${i*0.1}s` }}>
            <div className="tpl-display text-4xl font-bold" style={{ color: "#38bdf8" }}>{v(data,vk)}</div>
            <p className="text-sm" style={{ color: "#7a8fa8" }}>{v(data,lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(232,237,245,0.14)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#38bdf8" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#7a8fa8" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="min-h-[360px] overflow-hidden"><img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(232,237,245,0.14)", background: "#1a2332" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#38bdf8" }}>יצירת קשר</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#7a8fa8" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#7a8fa8" }}>
            <p>{v(data, "phone")}</p>
            <p>{v(data, "email")}</p>
            <p>{v(data, "address")}</p>
          </div>
        </div>
        <ContactForm data={data} onCta={onCta} />
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(232,237,245,0.14)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#7a8fa8" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#e8edf5" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <PenthouseStack data={data} />
      <SkylineStats data={data} />
      <TowerGalleryWall data={data} />
      <TowerAwardsLane data={data} />
      <TowerQuoteRail data={data} />
      <TowerCtaRibbon data={data} onCta={onCta} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(232,237,245,0.14)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#38bdf8" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function SkyholdPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...skyholdDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: (
      <>
        <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(232,237,245,0.14)" }}>
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#38bdf8" }}>{v(merged, "brandName")}</p>
            <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(merged, "contactTitle")}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "#7a8fa8" }}>{v(merged, "contactText")}</p>
          </div>
        </section>
        <ContactBlock data={merged} onCta={() => goTo("contact")} />
        <TowerOfficeBlock data={merged} />
      <TowerAgentRoster data={merged} />
      <TowerFaqPanel data={merged} />
      <TowerTrustMetrics data={merged} />
      <TowerAwardsLane data={merged} />
        <Footer data={merged} />
      </>
    ),
  };
    pageContent["penthouses"] = (
      <InnerPage data={merged} title="פנטהאוזים" onCta={() => goTo("contact")}>
        <>
          <PenthouseStack data={merged} />
      <TowerListingGrid data={merged} />
      <TowerGalleryWall data={merged} />
      <TowerQuoteRail data={merged} />
      <TowerCtaRibbon data={merged} onCta={() => goTo("contact")} />
        </>
      </InnerPage>
    );
    pageContent["towers"] = (
      <InnerPage data={merged} title="מגדלים" onCta={() => goTo("contact")}>
        <>
          <PenthouseStack data={merged} />
      <SkylineStats data={merged} />
      <TowerGalleryWall data={merged} />
      <TowerAgentRoster data={merged} />
      <TowerFaqPanel data={merged} />
        </>
      </InnerPage>
    );
    pageContent["about"] = (
      <InnerPage data={merged} title="אודות" onCta={() => goTo("contact")}>
        <>
          <AboutBlock data={merged} />
      <SkylineStats data={merged} />
      <TowerAgentRoster data={merged} />
      <TowerQuoteRail data={merged} />
      <TowerAwardsLane data={merged} />
        </>
      </InnerPage>
    );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "skyhold-preview" : "skyhold"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#0f1419", color: "#e8edf5" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
