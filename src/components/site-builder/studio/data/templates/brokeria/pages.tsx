import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { brokeriaDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const brokeriaPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "listings", label: "נכסים", slug: "/listings" },
  { id: "agents", label: "סוכנים", slug: "/agents" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = brokeriaPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (brokeriaDefaultData as Record<string, any>)[key] ?? "";
}
function cx(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = brokeriaPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#0a0f18f2", borderColor: "rgba(240,244,250,0.14)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#c9a962", color: "#0a0f18" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#f0f4fa" : "#8b9cb5" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#c9a962", color: "#0a0f18" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(240,244,250,0.14)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
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
      <input className={field} style={{ borderColor: "rgba(240,244,250,0.14)", color: "#f0f4fa" }} placeholder="שם מלא" />
      <input className={field} style={{ borderColor: "rgba(240,244,250,0.14)", color: "#f0f4fa" }} placeholder="טלפון" />
      <input className={field} style={{ borderColor: "rgba(240,244,250,0.14)", color: "#f0f4fa" }} placeholder="אימייל" />
      <textarea className={cx(field, "min-h-28")} style={{ borderColor: "rgba(240,244,250,0.14)", color: "#f0f4fa" }} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#c9a962", color: "#0a0f18" }}>{v(data, "cta")}</button>
    </form>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative isolate min-h-[100vh] overflow-hidden">
        <img src={v(data, "heroImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #05081055, #0a0f18ee 80%)" }} />
        <div className="relative z-10 mx-auto flex min-h-[100vh] max-w-7xl flex-col justify-center px-5 pt-28 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#c9a962" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#8b9cb5" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#c9a962", color: "#0a0f18" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("listings")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(240,244,250,0.14)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-20 border-t py-3" style={{ borderColor: "rgba(240,244,250,0.14)", background: "#141c2aee" }}>
          <div className="tpl-prop-ticker gap-10 px-4 text-sm font-bold" style={{ color: "#c9a962" }}>
            {[1,2,3,4,1,2,3,4].map((i, idx) => (<span key={`ticker-${idx}`} className="whitespace-nowrap">{v(data, `item${i}Title`)} · {v(data, `item${i}Price`)} ·</span>))}
          </div>
        </div>
      </section>
  );
}


function FeaturedCards({ data }: { data: Record<string, any> }) {
  const cards = [1,2,3,4].map((i) => ({
    title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`),
    price: v(data, `item${i}Price`), img: v(data, `item${i}Image`),
  }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(240,244,250,0.14)", background: "#141c2a" }}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">נכסים נבחרים</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <article key={c.title} className="tpl-zoom-card group overflow-hidden border" style={{ borderColor: "rgba(240,244,250,0.14)", background: "#0a0f18" }}>
              <img src={c.img} alt="" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="p-4">
                <p className="text-xs font-semibold" style={{ color: "#c9a962" }}>{c.meta}</p>
                <h3 className="tpl-display mt-1 text-xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm leading-6" style={{ color: "#8b9cb5" }}>{c.text}</p>
                <p className="mt-3 text-lg font-bold" style={{ color: "#c9a962" }}>{c.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function AgentStrip({ data }: { data: Record<string, any> }) {
  const agents = ["דנה כהן · מכירות", "יוסי לevi · השקעות", "מיכal רוז · יוקרה", "עמית שר · השכרה"];
  return (
    <section className="tpl-sweep overflow-hidden border-y py-4" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
      <div className="tpl-marquee-track gap-10 px-4 text-sm font-bold" style={{ color: "#f0f4fa" }}>
        {agents.concat(agents).map((a, i) => <span key={`agent-${i}`} className="whitespace-nowrap">{a} ·</span>)}
      </div>
    </section>
  );
}
function AnimatedStats({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 text-center">
        {stats.map(([vk, lk], i) => (
          <div key={lk} className="tpl-climb" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="tpl-display text-4xl font-bold md:text-5xl" style={{ color: "#c9a962" }}>{v(data, vk)}</div>
            <p className="mt-2 text-sm" style={{ color: "#8b9cb5" }}>{v(data, lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TickerGalleryWall({ data }: { data: Record<string, any> }) {
  const items = [1,2,3,4].map((i) => ({ t: v(data, `item${i}Title`), p: v(data, `item${i}Price`), img: v(data, `item${i}Image`) }));
  return (
    <section className="border-t overflow-hidden" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <h2 className="tpl-display text-4xl font-bold">גלריית נכסים קולנועית</h2>
        <div className="mt-10 flex gap-4 overflow-x-auto pb-4">
          {items.map((c) => (
            <article key={c.t} className="tpl-zoom-card min-w-[280px] shrink-0 overflow-hidden border" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
              <img src={c.img} alt="" className="h-52 w-full object-cover transition duration-700 hover:scale-110" />
              <div className="p-4" style={{ background: "#141c2a" }}>
                <h3 className="tpl-display font-bold">{c.t}</h3>
                <p className="mt-1 font-bold" style={{ color: "#c9a962" }}>{c.p}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function TickerAgentRoster({ data }: { data: Record<string, any> }) {
  const agents = [1,2,3,4].map((i) => ({ n: v(data, `agent${i}Name`), r: v(data, `agent${i}Role`), d: v(data, `agent${i}Deals`), img: v(data, `agent${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,244,250,0.14)", background: "#050810" }}>
      <h2 className="tpl-display mx-auto max-w-7xl text-4xl font-bold">צוות הפרימיום</h2>
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {agents.map((a,i) => (
          <article key={a.n} className="tpl-climb border text-center" style={{ borderColor: "#c9a96255", animationDelay: `${i*0.08}s` }}>
            <img src={a.img} alt="" className="aspect-[3/4] w-full object-cover" />
            <div className="p-4"><h3 className="tpl-display text-lg font-bold">{a.n}</h3><p className="text-sm" style={{ color: "#c9a962" }}>{a.r}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
function TickerQuoteRail({ data }: { data: Record<string, any> }) {
  const q = [v(data,"quote"), v(data,"testimonial2"), v(data,"testimonial3")];
  return (
    <section className="tpl-sweep overflow-hidden border-t py-8" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
      <div className="tpl-testi-track gap-8 px-6">
        {q.concat(q).map((t,i) => <span key={i} className="whitespace-nowrap text-lg italic" style={{ color: "#8b9cb5" }}>{t} —</span>)}
      </div>
    </section>
  );
}
function TickerTrustMetrics({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(240,244,250,0.14)", background: "#050810" }}>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-8">
        {stats.map(([vk,lk]) => (
          <div key={lk} className="text-center"><div className="tpl-display text-5xl font-bold" style={{ color: "#c9a962" }}>{v(data,vk)}</div><p className="mt-2 text-xs tracking-widest" style={{ color: "#8b9cb5" }}>{v(data,lk)}</p></div>
        ))}
      </div>
    </section>
  );
}
function TickerMarketPulse({ data }: { data: Record<string, any> }) {
  const posts = [[v(data,"insight1Title"),v(data,"insight1Text"),v(data,"insight1Tag")],[v(data,"insight2Title"),v(data,"insight2Text"),v(data,"insight2Tag")],[v(data,"insight3Title"),v(data,"insight3Text"),v(data,"insight3Tag")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,244,250,0.14)", background: "#141c2a" }}>
      <h2 className="tpl-display mx-auto max-w-7xl text-4xl font-bold">תובנות Ticker</h2>
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 lg:grid-cols-3">
        {posts.map(([t,x,g]) => (
          <article key={t} className="border p-5" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
            <span className="text-[10px] font-bold" style={{ color: "#c9a962" }}>{g}</span>
            <h3 className="tpl-display mt-2 text-xl font-bold">{t}</h3>
            <p className="mt-2 text-sm leading-7" style={{ color: "#8b9cb5" }}>{x}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TickerCtaRibbon({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="px-5 py-14 lg:px-8" style={{ background: "#c9a962" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div><h2 className="tpl-display text-3xl font-bold md:text-4xl" style={{ color: "#0a0f18" }}>{v(data,"ctaTitle")}</h2>
        <p className="mt-2 max-w-xl" style={{ color: "#0a0f18", opacity: 0.85 }}>{v(data,"ctaText")}</p></div>
        <button type="button" onClick={onCta} className="border-2 px-8 py-3 font-bold" style={{ borderColor: "#0a0f18", color: "#0a0f18" }}>{v(data,"cta")}</button>
      </div>
    </section>
  );
}

function TickerFaqPanel({ data }: { data: Record<string, any> }) {
  const faqs = [[v(data,"faq1Q"),v(data,"faq1A")],[v(data,"faq2Q"),v(data,"faq2A")],[v(data,"faq3Q"),v(data,"faq3A")],[v(data,"faq4Q"),v(data,"faq4A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
      <div className="mx-auto max-w-3xl grid gap-2">
        {faqs.map(([q,a]) => (
          <details key={q} className="border" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
            <summary className="cursor-pointer px-4 py-3 font-bold">{q}</summary>
            <p className="border-t px-4 py-3 text-sm leading-7" style={{ borderColor: "rgba(240,244,250,0.14)", color: "#8b9cb5" }}>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function TickerOfficeBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,244,250,0.14)", background: "#141c2a" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data,"officeTitle")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#8b9cb5" }}>{v(data,"officeText")}</p>
          <p className="mt-6 text-sm font-semibold">{v(data,"phone")} · {v(data,"email")}</p>
        </div>
        <div className="relative min-h-[280px] overflow-hidden border" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
          <img src={v(data,"aboutImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function TickerAwardsLane({ data }: { data: Record<string, any> }) {
  const awards = [v(data,"award1"),v(data,"award2"),v(data,"award3"),v(data,"award4")];
  return (
    <section className="overflow-hidden border-y py-4" style={{ borderColor: "rgba(240,244,250,0.14)", background: "#0a0f18" }}>
      <div className="tpl-marquee-track gap-10 px-6 text-xs font-bold tracking-[0.25em]" style={{ color: "#c9a962" }}>
        {awards.concat(awards).map((a,i) => <span key={i} className="whitespace-nowrap">{a} ·</span>)}
      </div>
    </section>
  );
}

function TickerProcessRail({ data }: { data: Record<string, any> }) {
  const steps = [[v(data,"step1"),v(data,"step1Desc")],[v(data,"step2"),v(data,"step2Desc")],[v(data,"step3"),v(data,"step3Desc")],[v(data,"step4"),v(data,"step4Desc")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {steps.map(([t,d],i) => (
          <div key={t} className="tpl-climb border-t pt-4" style={{ borderColor: "#c9a962", animationDelay: `${i*0.1}s` }}>
            <span className="text-2xl font-bold" style={{ color: "#c9a962" }}>0{i+1}</span>
            <h3 className="mt-2 font-bold">{t}</h3><p className="mt-1 text-sm" style={{ color: "#8b9cb5" }}>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TickerListingGrid({ data }: { data: Record<string, any> }) {
  const cards = [1,2,3,4].map((i) => ({ t: v(data,`item${i}Title`), m: v(data,`item${i}Meta`), p: v(data,`item${i}Price`), img: v(data,`item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,244,250,0.14)", background: "#141c2a" }}>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <article key={c.t} className="overflow-hidden border" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
            <img src={c.img} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="p-4"><p className="text-xs" style={{ color: "#c9a962" }}>{c.m}</p><h3 className="font-bold">{c.t}</h3><p className="mt-2 font-bold" style={{ color: "#c9a962" }}>{c.p}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TickerStatsRow({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-10 lg:px-8" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 text-center">
        {stats.map(([vk,lk],i) => (
          <div key={lk} className="tpl-climb" style={{ animationDelay: `${i*0.1}s` }}>
            <div className="tpl-display text-4xl font-bold" style={{ color: "#c9a962" }}>{v(data,vk)}</div>
            <p className="text-sm" style={{ color: "#8b9cb5" }}>{v(data,lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#c9a962" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#8b9cb5" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="min-h-[360px] overflow-hidden"><img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(240,244,250,0.14)", background: "#141c2a" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#c9a962" }}>יצירת קשר</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#8b9cb5" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#8b9cb5" }}>
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
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#8b9cb5" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#f0f4fa" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <FeaturedCards data={data} />
      <AgentStrip data={data} />
      <AnimatedStats data={data} />
      <TickerGalleryWall data={data} />
      <TickerAwardsLane data={data} />
      <TickerQuoteRail data={data} />
      <TickerCtaRibbon data={data} onCta={onCta} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#c9a962" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function BrokeriaPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...brokeriaDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: (
      <>
        <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(240,244,250,0.14)" }}>
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#c9a962" }}>{v(merged, "brandName")}</p>
            <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(merged, "contactTitle")}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "#8b9cb5" }}>{v(merged, "contactText")}</p>
          </div>
        </section>
        <ContactBlock data={merged} onCta={() => goTo("contact")} />
        <TickerOfficeBlock data={merged} />
      <TickerAgentRoster data={merged} />
      <TickerFaqPanel data={merged} />
      <TickerTrustMetrics data={merged} />
      <TickerAwardsLane data={merged} />
        <Footer data={merged} />
      </>
    ),
  };
    pageContent["listings"] = (
      <InnerPage data={merged} title="נכסים" onCta={() => goTo("contact")}>
        <>
          <FeaturedCards data={merged} />
      <TickerGalleryWall data={merged} />
      <AnimatedStats data={merged} />
      <TickerTrustMetrics data={merged} />
      <TickerCtaRibbon data={merged} onCta={() => goTo("contact")} />
        </>
      </InnerPage>
    );
    pageContent["agents"] = (
      <InnerPage data={merged} title="סוכנים" onCta={() => goTo("contact")}>
        <>
          <TickerAgentRoster data={merged} />
      <TickerAwardsLane data={merged} />
      <TickerQuoteRail data={merged} />
      <AnimatedStats data={merged} />
      <TickerCtaRibbon data={merged} onCta={() => goTo("contact")} />
        </>
      </InnerPage>
    );
    pageContent["about"] = (
      <InnerPage data={merged} title="אודות" onCta={() => goTo("contact")}>
        <>
          <AboutBlock data={merged} />
      <TickerProcessRail data={merged} />
      <TickerTrustMetrics data={merged} />
      <TickerQuoteRail data={merged} />
      <TickerAwardsLane data={merged} />
        </>
      </InnerPage>
    );
    pageContent["insights"] = (
      <InnerPage data={merged} title="תובנות" onCta={() => goTo("contact")}>
        <>
          <TickerMarketPulse data={merged} />
      <TickerFaqPanel data={merged} />
      <TickerGalleryWall data={merged} />
      <TickerTrustMetrics data={merged} />
      <TickerCtaRibbon data={merged} onCta={() => goTo("contact")} />
        </>
      </InnerPage>
    );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "brokeria-preview" : "brokeria"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#0a0f18", color: "#f0f4fa" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
