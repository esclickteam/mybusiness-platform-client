import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { nestiqDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const nestiqPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "listings", label: "נכסים", slug: "/listings" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "faq", label: "שאלות", slug: "/faq" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = nestiqPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (nestiqDefaultData as Record<string, any>)[key] ?? "";
}
function cx(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = nestiqPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#faf5fff2", borderColor: "rgba(30,27,75,0.1)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#7c3aed", color: "#ffffff" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#1e1b4b" : "#6366f1" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#7c3aed", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(30,27,75,0.1)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
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
      <input className={field} style={{ borderColor: "rgba(30,27,75,0.1)", color: "#1e1b4b" }} placeholder="שם מלא" />
      <input className={field} style={{ borderColor: "rgba(30,27,75,0.1)", color: "#1e1b4b" }} placeholder="טלפון" />
      <input className={field} style={{ borderColor: "rgba(30,27,75,0.1)", color: "#1e1b4b" }} placeholder="אימייל" />
      <textarea className={cx(field, "min-h-28")} style={{ borderColor: "rgba(30,27,75,0.1)", color: "#1e1b4b" }} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#7c3aed", color: "#ffffff" }}>{v(data, "cta")}</button>
    </form>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="px-5 py-20 lg:px-8 lg:py-28" style={{ background: "#faf5ff" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            {[["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]].map(([vk, lk], i) => (
              <div key={vk} className="tpl-counter border p-6 text-center" style={{ borderColor: "rgba(30,27,75,0.1)", animationDelay: `${i * 0.12}s` }}>
                <div className="tpl-display text-5xl font-bold" style={{ color: "#7c3aed" }}>{v(data, vk)}</div>
                <p className="mt-2 text-sm" style={{ color: "#6366f1" }}>{v(data, lk)}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#7c3aed" }}>{v(data, "heroEyebrow")}</p>
            <h1 className="tpl-display tpl-rise-2 mt-4 text-5xl font-bold md:text-7xl">{v(data, "heroTitle")}</h1>
            <p className="tpl-rise-3 mx-auto mt-6 max-w-2xl text-lg leading-8" style={{ color: "#6366f1" }}>{v(data, "heroSubtitle")}</p>
            <div className="tpl-rise-3 mt-8 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#7c3aed", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
              <button type="button" onClick={() => goTo("listings")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(30,27,75,0.1)" }}>{v(data, "heroSecondary")}</button>
            </div>
          </div>
        </div>
      </section>
  );
}


function BadgeCards({ data }: { data: Record<string, any> }) {
  const badges = ["נוף","חניה","ממ״ד","משופץ"];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"rgba(30,27,75,0.1)", background:"#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4].map((i)=>(<article key={i} className="border p-4" style={{ borderColor:"rgba(30,27,75,0.1)" }}>
          <div className="mb-3 flex flex-wrap gap-1">{badges.slice(0,2).map((b)=><span key={b} className="rounded px-2 py-0.5 text-[10px] font-bold" style={{ background:"#7c3aed22", color:"#7c3aed" }}>{b}</span>)}</div>
          <h3 className="tpl-display text-lg font-bold">{v(data,`item${i}Title`)}</h3>
          <p className="mt-2 text-sm" style={{ color:"#7c3aed" }}>{v(data,`item${i}Price`)}</p>
        </article>))}
      </div>
    </section>
  );
}
function FaqVisual({ data }: { data: Record<string, any> }) {
  const faqs = [["איך מתחילים?","משאירים פרטים ומקבלים התאמות."],["מה העמלה?","שקוף ומוסכם מראש."],["כמה זמן?","בממוצע 42 ימים."]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor:"rgba(30,27,75,0.1)" }}>
      <div className="mx-auto max-w-3xl grid gap-3">
        {faqs.map(([q,a])=>(<div key={q} className="border p-4" style={{ borderColor:"rgba(30,27,75,0.1)" }}><p className="font-bold">{q}</p><p className="mt-2 text-sm" style={{ color:"#6366f1" }}>{a}</p></div>))}
      </div>
    </section>
  );
}

function CounterGalleryWall({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2">
        {[1,2,3,4].map((i) => (
          <article key={i} className="tpl-counter border p-4" style={{ borderColor: "rgba(30,27,75,0.1)", animationDelay: `${i*0.1}s` }}>
            <img src={v(data, `item${i}Image`)} alt="" className="mb-3 aspect-video w-full object-cover" />
            <h3 className="font-bold">{v(data, `item${i}Title`)}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
function CounterAgentRoster({ data }: { data: Record<string, any> }) {
  const agents = [1,2,3,4].map((i) => ({ n: v(data, `agent${i}Name`), r: v(data, `agent${i}Role`), d: v(data, `agent${i}Deals`), img: v(data, `agent${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(30,27,75,0.1)", background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl divide-y" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
        {agents.map((a) => (
          <div key={a.n} className="flex flex-wrap items-center gap-5 py-6">
            <img src={a.img} alt="" className="h-20 w-20 rounded-full object-cover" />
            <div><h3 className="tpl-display text-xl font-bold">{a.n}</h3><p style={{ color: "#7c3aed" }}>{a.r} · {a.d}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
function CounterQuoteRail({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
      <div className="mx-auto max-w-3xl border-r-4 pr-8" style={{ borderColor: "#7c3aed" }}>
        <p className="tpl-display text-3xl font-bold leading-snug">{v(data, "quote")}</p>
        <p className="mt-4 text-sm" style={{ color: "#6366f1" }}>— {v(data, "brandName")}</p>
      </div>
    </section>
  );
}
function CounterTrustMetrics({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4">
        {stats.map(([vk,lk],i) => (
          <div key={lk} className="tpl-climb border p-5 text-center" style={{ borderColor: "rgba(30,27,75,0.1)", animationDelay: `${i*0.1}s` }}>
            <div className="tpl-display text-4xl font-bold" style={{ color: "#7c3aed" }}>{v(data,vk)}</div>
            <p className="mt-2 text-sm" style={{ color: "#6366f1" }}>{v(data,lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
function CounterMarketPulse({ data }: { data: Record<string, any> }) {
  const posts = [[v(data,"insight1Title"),v(data,"insight1Text"),v(data,"insight1Tag")],[v(data,"insight2Title"),v(data,"insight2Text"),v(data,"insight2Tag")],[v(data,"insight3Title"),v(data,"insight3Text"),v(data,"insight3Tag")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(30,27,75,0.1)", background: "#ffffff" }}>
      <h2 className="tpl-display mx-auto max-w-7xl text-4xl font-bold">תובנות Counter</h2>
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 lg:grid-cols-3">
        {posts.map(([t,x,g]) => (
          <article key={t} className="border p-5" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
            <span className="text-[10px] font-bold" style={{ color: "#7c3aed" }}>{g}</span>
            <h3 className="tpl-display mt-2 text-xl font-bold">{t}</h3>
            <p className="mt-2 text-sm leading-7" style={{ color: "#6366f1" }}>{x}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CounterCtaRibbon({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="px-5 py-14 lg:px-8" style={{ background: "#7c3aed" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div><h2 className="tpl-display text-3xl font-bold md:text-4xl" style={{ color: "#ffffff" }}>{v(data,"ctaTitle")}</h2>
        <p className="mt-2 max-w-xl" style={{ color: "#ffffff", opacity: 0.85 }}>{v(data,"ctaText")}</p></div>
        <button type="button" onClick={onCta} className="border-2 px-8 py-3 font-bold" style={{ borderColor: "#ffffff", color: "#ffffff" }}>{v(data,"cta")}</button>
      </div>
    </section>
  );
}

function CounterFaqPanel({ data }: { data: Record<string, any> }) {
  const faqs = [[v(data,"faq1Q"),v(data,"faq1A")],[v(data,"faq2Q"),v(data,"faq2A")],[v(data,"faq3Q"),v(data,"faq3A")],[v(data,"faq4Q"),v(data,"faq4A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
      <div className="mx-auto max-w-3xl grid gap-2">
        {faqs.map(([q,a]) => (
          <details key={q} className="border" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
            <summary className="cursor-pointer px-4 py-3 font-bold">{q}</summary>
            <p className="border-t px-4 py-3 text-sm leading-7" style={{ borderColor: "rgba(30,27,75,0.1)", color: "#6366f1" }}>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CounterOfficeBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(30,27,75,0.1)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data,"officeTitle")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#6366f1" }}>{v(data,"officeText")}</p>
          <p className="mt-6 text-sm font-semibold">{v(data,"phone")} · {v(data,"email")}</p>
        </div>
        <div className="relative min-h-[280px] overflow-hidden border" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
          <img src={v(data,"aboutImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function CounterAwardsLane({ data }: { data: Record<string, any> }) {
  const awards = [v(data,"award1"),v(data,"award2"),v(data,"award3"),v(data,"award4")];
  return (
    <section className="overflow-hidden border-y py-4" style={{ borderColor: "rgba(30,27,75,0.1)", background: "#faf5ff" }}>
      <div className="tpl-marquee-track gap-10 px-6 text-xs font-bold tracking-[0.25em]" style={{ color: "#7c3aed" }}>
        {awards.concat(awards).map((a,i) => <span key={i} className="whitespace-nowrap">{a} ·</span>)}
      </div>
    </section>
  );
}

function CounterProcessRail({ data }: { data: Record<string, any> }) {
  const steps = [[v(data,"step1"),v(data,"step1Desc")],[v(data,"step2"),v(data,"step2Desc")],[v(data,"step3"),v(data,"step3Desc")],[v(data,"step4"),v(data,"step4Desc")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {steps.map(([t,d],i) => (
          <div key={t} className="tpl-climb border-t pt-4" style={{ borderColor: "#7c3aed", animationDelay: `${i*0.1}s` }}>
            <span className="text-2xl font-bold" style={{ color: "#7c3aed" }}>0{i+1}</span>
            <h3 className="mt-2 font-bold">{t}</h3><p className="mt-1 text-sm" style={{ color: "#6366f1" }}>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CounterListingGrid({ data }: { data: Record<string, any> }) {
  const cards = [1,2,3,4].map((i) => ({ t: v(data,`item${i}Title`), m: v(data,`item${i}Meta`), p: v(data,`item${i}Price`), img: v(data,`item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(30,27,75,0.1)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <article key={c.t} className="overflow-hidden border" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
            <img src={c.img} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="p-4"><p className="text-xs" style={{ color: "#7c3aed" }}>{c.m}</p><h3 className="font-bold">{c.t}</h3><p className="mt-2 font-bold" style={{ color: "#7c3aed" }}>{c.p}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CounterStatsRow({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-10 lg:px-8" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 text-center">
        {stats.map(([vk,lk],i) => (
          <div key={lk} className="tpl-climb" style={{ animationDelay: `${i*0.1}s` }}>
            <div className="tpl-display text-4xl font-bold" style={{ color: "#7c3aed" }}>{v(data,vk)}</div>
            <p className="text-sm" style={{ color: "#6366f1" }}>{v(data,lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#7c3aed" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#6366f1" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="min-h-[360px] overflow-hidden"><img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(30,27,75,0.1)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#7c3aed" }}>יצירת קשר</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#6366f1" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#6366f1" }}>
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
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#6366f1" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#1e1b4b" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <BadgeCards data={data} />
      <FaqVisual data={data} />
      <CounterGalleryWall data={data} />
      <CounterAwardsLane data={data} />
      <CounterQuoteRail data={data} />
      <CounterCtaRibbon data={data} onCta={onCta} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#7c3aed" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function NestiqPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...nestiqDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: (
      <>
        <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#7c3aed" }}>{v(merged, "brandName")}</p>
            <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(merged, "contactTitle")}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "#6366f1" }}>{v(merged, "contactText")}</p>
          </div>
        </section>
        <ContactBlock data={merged} onCta={() => goTo("contact")} />
        <CounterOfficeBlock data={merged} />
      <CounterAgentRoster data={merged} />
      <CounterFaqPanel data={merged} />
      <CounterTrustMetrics data={merged} />
      <CounterAwardsLane data={merged} />
        <Footer data={merged} />
      </>
    ),
  };
    pageContent["listings"] = (
      <InnerPage data={merged} title="נכסים" onCta={() => goTo("contact")}>
        <>
          <BadgeCards data={merged} />
      <CounterListingGrid data={merged} />
      <CounterGalleryWall data={merged} />
      <CounterStatsRow data={merged} />
      <CounterCtaRibbon data={merged} onCta={() => goTo("contact")} />
        </>
      </InnerPage>
    );
    pageContent["insights"] = (
      <InnerPage data={merged} title="תובנות" onCta={() => goTo("contact")}>
        <>
          <BadgeCards data={merged} />
      <FaqVisual data={merged} />
      <CounterMarketPulse data={merged} />
      <CounterGalleryWall data={merged} />
      <CounterTrustMetrics data={merged} />
        </>
      </InnerPage>
    );
    pageContent["faq"] = (
      <InnerPage data={merged} title="שאלות" onCta={() => goTo("contact")}>
        <>
          <BadgeCards data={merged} />
      <FaqVisual data={merged} />
      <CounterMarketPulse data={merged} />
      <CounterGalleryWall data={merged} />
      <CounterTrustMetrics data={merged} />
        </>
      </InnerPage>
    );
    pageContent["about"] = (
      <InnerPage data={merged} title="אודות" onCta={() => goTo("contact")}>
        <>
          <AboutBlock data={merged} />
      <CounterAgentRoster data={merged} />
      <CounterQuoteRail data={merged} />
      <CounterTrustMetrics data={merged} />
      <CounterAwardsLane data={merged} />
        </>
      </InnerPage>
    );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "nestiq-preview" : "nestiq"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#faf5ff", color: "#1e1b4b" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
