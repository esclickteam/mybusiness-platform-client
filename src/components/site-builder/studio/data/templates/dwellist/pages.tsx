import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { dwellistDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const dwellistPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "listings", label: "נכסים", slug: "/listings" },
  { id: "compare", label: "השוואה", slug: "/compare" },
  { id: "mortgage", label: "משכנתא", slug: "/mortgage" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = dwellistPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (dwellistDefaultData as Record<string, any>)[key] ?? "";
}
function cx(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = dwellistPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#faf8f5f2", borderColor: "rgba(44,36,25,0.12)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#5c7c6a", color: "#ffffff" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#2c2419" : "#8a7d6e" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#5c7c6a", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(44,36,25,0.12)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(44,36,25,0.12)" }}>
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
      <input className={field} style={{ borderColor: "rgba(44,36,25,0.12)", color: "#2c2419" }} placeholder="שם מלא" />
      <input className={field} style={{ borderColor: "rgba(44,36,25,0.12)", color: "#2c2419" }} placeholder="טלפון" />
      <input className={field} style={{ borderColor: "rgba(44,36,25,0.12)", color: "#2c2419" }} placeholder="אימייל" />
      <textarea className={cx(field, "min-h-28")} style={{ borderColor: "rgba(44,36,25,0.12)", color: "#2c2419" }} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#5c7c6a", color: "#ffffff" }}>{v(data, "cta")}</button>
    </form>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="grid min-h-[88vh] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-5 py-16 lg:px-12">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#5c7c6a" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#8a7d6e" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#5c7c6a", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("listings")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(44,36,25,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div></div>
        <div className="relative min-h-[44vh] overflow-hidden lg:min-h-[88vh]">
          <img src={v(data, "heroImage")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <svg className="absolute inset-0 h-full w-full p-8" viewBox="0 0 400 400" aria-hidden="true">
            <rect x="40" y="40" width="320" height="320" fill="none" stroke="#5c7c6a" strokeWidth="2" className="tpl-plan-line" />
            <rect x="40" y="40" width="160" height="160" fill="#5c7c6a22" stroke="#5c7c6a" />
            <rect x="200" y="40" width="160" height="160" fill="#5c7c6a11" stroke="#5c7c6a" />
            <rect x="40" y="200" width="320" height="160" fill="#5c7c6a18" stroke="#5c7c6a" />
            <circle cx="120" cy="120" r="8" fill="#5c7c6a" className="tpl-hotspot" />
            <circle cx="280" cy="120" r="8" fill="#5c7c6a" className="tpl-hotspot" style={{ animationDelay: ".5s" }} />
            <circle cx="200" cy="280" r="8" fill="#5c7c6a" className="tpl-hotspot" style={{ animationDelay: "1s" }} />
          </svg>
        </div>
      </section>
  );
}


function HotspotCards({ data }: { data: Record<string, any> }) {
  const rooms = [["סalון","45 מ״ר · אור"],["מטבח","18 מ״ר · שף"],["master","22 מ״ר · ensuite"]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"rgba(44,36,25,0.12)", background:"#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {rooms.map(([t,m])=>(<div key={t} className="tpl-hotspot border p-5" style={{ borderColor:"rgba(44,36,25,0.12)" }}><h3 className="tpl-display text-xl font-bold">{t}</h3><p className="text-sm" style={{ color:"#8a7d6e" }}>{m}</p></div>))}
      </div>
    </section>
  );
}
function CompareStrip({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor:"rgba(44,36,25,0.12)" }}>
      <div className="mx-auto flex max-w-7xl gap-4 overflow-x-auto">
        {[1,2,3].map((i)=>(<div key={i} className="min-w-[240px] flex-shrink-0 border p-4" style={{ borderColor:"rgba(44,36,25,0.12)" }}>
          <img src={v(data,`item${i}Image`)} alt="" className="mb-3 aspect-video w-full object-cover" />
          <p className="font-bold">{v(data,`item${i}Title`)}</p><p className="text-sm" style={{ color:"#8a7d6e" }}>{v(data,`item${i}Meta`)}</p>
        </div>))}
      </div>
    </section>
  );
}
function MortgageVisual({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor:"rgba(44,36,25,0.12)", background:"#ffffff" }}>
      <div className="mx-auto max-w-md grid gap-3">
        <p className="tpl-display text-2xl font-bold">מחשבון משכנתא (הדגמה)</p>
        <input readOnly className="border bg-transparent px-4 py-3" style={{ borderColor:"rgba(44,36,25,0.12)" }} defaultValue="סכום: ₪2,400,000" />
        <input readOnly className="border bg-transparent px-4 py-3" style={{ borderColor:"rgba(44,36,25,0.12)" }} defaultValue="ריבית: 4.8%" />
        <div className="border p-4 text-center font-bold" style={{ borderColor:"#5c7c6a", color:"#5c7c6a" }}>החזר חודשי: ₪12,640</div>
      </div>
    </section>
  );
}

function PlanGalleryWall({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,36,25,0.12)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-2">
        {[1,2,3,4].map((i) => (
          <div key={i} className="relative border-2 border-dashed p-3" style={{ borderColor: "#5c7c6a" }}>
            <span className="tpl-hotspot absolute left-3 top-3 h-3 w-3 rounded-full" style={{ background: "#5c7c6a" }} />
            <img src={v(data, `item${i}Image`)} alt="" className="aspect-[5/3] w-full object-cover opacity-90" />
            <p className="mt-2 font-bold">{v(data, `item${i}Title`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
function PlanAgentRoster({ data }: { data: Record<string, any> }) {
  const agents = [1,2,3,4].map((i) => ({ n: v(data, `agent${i}Name`), r: v(data, `agent${i}Role`), d: v(data, `agent${i}Deals`), img: v(data, `agent${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,36,25,0.12)", background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl divide-y" style={{ borderColor: "rgba(44,36,25,0.12)" }}>
        {agents.map((a) => (
          <div key={a.n} className="flex flex-wrap items-center gap-5 py-6">
            <img src={a.img} alt="" className="h-20 w-20 rounded-full object-cover" />
            <div><h3 className="tpl-display text-xl font-bold">{a.n}</h3><p style={{ color: "#5c7c6a" }}>{a.r} · {a.d}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
function PlanQuoteRail({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,36,25,0.12)" }}>
      <div className="mx-auto max-w-3xl border-r-4 pr-8" style={{ borderColor: "#5c7c6a" }}>
        <p className="tpl-display text-3xl font-bold leading-snug">{v(data, "quote")}</p>
        <p className="mt-4 text-sm" style={{ color: "#8a7d6e" }}>— {v(data, "brandName")}</p>
      </div>
    </section>
  );
}
function PlanTrustMetrics({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(44,36,25,0.12)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4">
        {stats.map(([vk,lk],i) => (
          <div key={lk} className="tpl-climb border p-5 text-center" style={{ borderColor: "rgba(44,36,25,0.12)", animationDelay: `${i*0.1}s` }}>
            <div className="tpl-display text-4xl font-bold" style={{ color: "#5c7c6a" }}>{v(data,vk)}</div>
            <p className="mt-2 text-sm" style={{ color: "#8a7d6e" }}>{v(data,lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
function PlanMarketPulse({ data }: { data: Record<string, any> }) {
  const posts = [[v(data,"insight1Title"),v(data,"insight1Text"),v(data,"insight1Tag")],[v(data,"insight2Title"),v(data,"insight2Text"),v(data,"insight2Tag")],[v(data,"insight3Title"),v(data,"insight3Text"),v(data,"insight3Tag")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,36,25,0.12)", background: "#ffffff" }}>
      <h2 className="tpl-display mx-auto max-w-7xl text-4xl font-bold">תובנות Plan</h2>
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 lg:grid-cols-3">
        {posts.map(([t,x,g]) => (
          <article key={t} className="border p-5" style={{ borderColor: "rgba(44,36,25,0.12)" }}>
            <span className="text-[10px] font-bold" style={{ color: "#5c7c6a" }}>{g}</span>
            <h3 className="tpl-display mt-2 text-xl font-bold">{t}</h3>
            <p className="mt-2 text-sm leading-7" style={{ color: "#8a7d6e" }}>{x}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PlanCtaRibbon({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="px-5 py-14 lg:px-8" style={{ background: "#5c7c6a" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div><h2 className="tpl-display text-3xl font-bold md:text-4xl" style={{ color: "#ffffff" }}>{v(data,"ctaTitle")}</h2>
        <p className="mt-2 max-w-xl" style={{ color: "#ffffff", opacity: 0.85 }}>{v(data,"ctaText")}</p></div>
        <button type="button" onClick={onCta} className="border-2 px-8 py-3 font-bold" style={{ borderColor: "#ffffff", color: "#ffffff" }}>{v(data,"cta")}</button>
      </div>
    </section>
  );
}

function PlanFaqPanel({ data }: { data: Record<string, any> }) {
  const faqs = [[v(data,"faq1Q"),v(data,"faq1A")],[v(data,"faq2Q"),v(data,"faq2A")],[v(data,"faq3Q"),v(data,"faq3A")],[v(data,"faq4Q"),v(data,"faq4A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,36,25,0.12)" }}>
      <div className="mx-auto max-w-3xl grid gap-2">
        {faqs.map(([q,a]) => (
          <details key={q} className="border" style={{ borderColor: "rgba(44,36,25,0.12)" }}>
            <summary className="cursor-pointer px-4 py-3 font-bold">{q}</summary>
            <p className="border-t px-4 py-3 text-sm leading-7" style={{ borderColor: "rgba(44,36,25,0.12)", color: "#8a7d6e" }}>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function PlanOfficeBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,36,25,0.12)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data,"officeTitle")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#8a7d6e" }}>{v(data,"officeText")}</p>
          <p className="mt-6 text-sm font-semibold">{v(data,"phone")} · {v(data,"email")}</p>
        </div>
        <div className="relative min-h-[280px] overflow-hidden border" style={{ borderColor: "rgba(44,36,25,0.12)" }}>
          <img src={v(data,"aboutImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function PlanAwardsLane({ data }: { data: Record<string, any> }) {
  const awards = [v(data,"award1"),v(data,"award2"),v(data,"award3"),v(data,"award4")];
  return (
    <section className="overflow-hidden border-y py-4" style={{ borderColor: "rgba(44,36,25,0.12)", background: "#faf8f5" }}>
      <div className="tpl-marquee-track gap-10 px-6 text-xs font-bold tracking-[0.25em]" style={{ color: "#5c7c6a" }}>
        {awards.concat(awards).map((a,i) => <span key={i} className="whitespace-nowrap">{a} ·</span>)}
      </div>
    </section>
  );
}

function PlanProcessRail({ data }: { data: Record<string, any> }) {
  const steps = [[v(data,"step1"),v(data,"step1Desc")],[v(data,"step2"),v(data,"step2Desc")],[v(data,"step3"),v(data,"step3Desc")],[v(data,"step4"),v(data,"step4Desc")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,36,25,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {steps.map(([t,d],i) => (
          <div key={t} className="tpl-climb border-t pt-4" style={{ borderColor: "#5c7c6a", animationDelay: `${i*0.1}s` }}>
            <span className="text-2xl font-bold" style={{ color: "#5c7c6a" }}>0{i+1}</span>
            <h3 className="mt-2 font-bold">{t}</h3><p className="mt-1 text-sm" style={{ color: "#8a7d6e" }}>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PlanListingGrid({ data }: { data: Record<string, any> }) {
  const cards = [1,2,3,4].map((i) => ({ t: v(data,`item${i}Title`), m: v(data,`item${i}Meta`), p: v(data,`item${i}Price`), img: v(data,`item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,36,25,0.12)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <article key={c.t} className="overflow-hidden border" style={{ borderColor: "rgba(44,36,25,0.12)" }}>
            <img src={c.img} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="p-4"><p className="text-xs" style={{ color: "#5c7c6a" }}>{c.m}</p><h3 className="font-bold">{c.t}</h3><p className="mt-2 font-bold" style={{ color: "#5c7c6a" }}>{c.p}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PlanStatsRow({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-10 lg:px-8" style={{ borderColor: "rgba(44,36,25,0.12)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 text-center">
        {stats.map(([vk,lk],i) => (
          <div key={lk} className="tpl-climb" style={{ animationDelay: `${i*0.1}s` }}>
            <div className="tpl-display text-4xl font-bold" style={{ color: "#5c7c6a" }}>{v(data,vk)}</div>
            <p className="text-sm" style={{ color: "#8a7d6e" }}>{v(data,lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(44,36,25,0.12)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#5c7c6a" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#8a7d6e" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="min-h-[360px] overflow-hidden"><img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,36,25,0.12)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#5c7c6a" }}>יצירת קשר</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#8a7d6e" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#8a7d6e" }}>
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
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(44,36,25,0.12)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#8a7d6e" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#2c2419" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <HotspotCards data={data} />
      <CompareStrip data={data} />
      <MortgageVisual data={data} />
      <PlanGalleryWall data={data} />
      <PlanAwardsLane data={data} />
      <PlanQuoteRail data={data} />
      <PlanCtaRibbon data={data} onCta={onCta} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,36,25,0.12)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#5c7c6a" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function DwellistPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...dwellistDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: (
      <>
        <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,36,25,0.12)" }}>
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#5c7c6a" }}>{v(merged, "brandName")}</p>
            <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(merged, "contactTitle")}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "#8a7d6e" }}>{v(merged, "contactText")}</p>
          </div>
        </section>
        <ContactBlock data={merged} onCta={() => goTo("contact")} />
        <PlanOfficeBlock data={merged} />
      <PlanAgentRoster data={merged} />
      <PlanFaqPanel data={merged} />
      <PlanTrustMetrics data={merged} />
      <PlanAwardsLane data={merged} />
        <Footer data={merged} />
      </>
    ),
  };
    pageContent["listings"] = (
      <InnerPage data={merged} title="נכסים" onCta={() => goTo("contact")}>
        <>
          <PlanListingGrid data={merged} />
      <HotspotCards data={merged} />
      <PlanGalleryWall data={merged} />
      <PlanStatsRow data={merged} />
      <PlanCtaRibbon data={merged} onCta={() => goTo("contact")} />
        </>
      </InnerPage>
    );
    pageContent["compare"] = (
      <InnerPage data={merged} title="השוואה" onCta={() => goTo("contact")}>
        <>
          <CompareStrip data={merged} />
      <PlanGalleryWall data={merged} />
      <PlanFaqPanel data={merged} />
      <PlanTrustMetrics data={merged} />
      <PlanCtaRibbon data={merged} onCta={() => goTo("contact")} />
        </>
      </InnerPage>
    );
    pageContent["mortgage"] = (
      <InnerPage data={merged} title="משכנתא" onCta={() => goTo("contact")}>
        <>
          <MortgageVisual data={merged} />
      <PlanStatsRow data={merged} />
      <PlanFaqPanel data={merged} />
      <PlanMarketPulse data={merged} />
      <PlanCtaRibbon data={merged} onCta={() => goTo("contact")} />
        </>
      </InnerPage>
    );
    pageContent["about"] = (
      <InnerPage data={merged} title="אודות" onCta={() => goTo("contact")}>
        <>
          <AboutBlock data={merged} />
      <PlanAgentRoster data={merged} />
      <PlanQuoteRail data={merged} />
      <PlanTrustMetrics data={merged} />
      <PlanAwardsLane data={merged} />
        </>
      </InnerPage>
    );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "dwellist-preview" : "dwellist"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#faf8f5", color: "#2c2419" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
