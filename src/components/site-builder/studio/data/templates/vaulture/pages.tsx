import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { vaultureDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const vaulturePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "collection", label: "אוסף", slug: "/collection" },
  { id: "exclusive", label: "בלעדי", slug: "/exclusive" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = vaulturePages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (vaultureDefaultData as Record<string, any>)[key] ?? "";
}
function cx(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = vaulturePages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#0c0a08f2", borderColor: "rgba(245,240,232,0.12)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#d4af37", color: "#0c0a08" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#f5f0e8" : "#a89880" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#d4af37", color: "#0c0a08" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(245,240,232,0.12)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(245,240,232,0.12)" }}>
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
      <input className={field} style={{ borderColor: "rgba(245,240,232,0.12)", color: "#f5f0e8" }} placeholder="שם מלא" />
      <input className={field} style={{ borderColor: "rgba(245,240,232,0.12)", color: "#f5f0e8" }} placeholder="טלפון" />
      <input className={field} style={{ borderColor: "rgba(245,240,232,0.12)", color: "#f5f0e8" }} placeholder="אימייל" />
      <textarea className={cx(field, "min-h-28")} style={{ borderColor: "rgba(245,240,232,0.12)", color: "#f5f0e8" }} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#d4af37", color: "#0c0a08" }}>{v(data, "cta")}</button>
    </form>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative isolate min-h-[92vh] overflow-hidden" style={{ background: "#050403" }}>
        <div className="tpl-curtain absolute inset-0"><img src={v(data, "heroImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #050403cc, transparent 55%)" }} />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-5 pb-20 pt-28 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#d4af37" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#a89880" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#d4af37", color: "#0c0a08" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("collection")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(245,240,232,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div></div>
      </section>
  );
}


function VaultCards({ data }: { data: Record<string, any> }) {
  const cards = [1,2,3,4].map((i)=>[v(data,`item${i}Title`),v(data,`item${i}Price`),v(data,`item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"rgba(245,240,232,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
        {cards.map(([title,price,img])=>(<article key={title} className="group overflow-hidden border" style={{ borderColor:"#d4af3744", background:"#1a1612" }}>
          <div className="relative h-56 overflow-hidden"><img src={img} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
          <div className="p-5"><h3 className="tpl-display text-2xl font-bold">{title}</h3><p className="mt-2 text-lg" style={{ color:"#d4af37" }}>{price}</p></div>
        </article>))}
      </div>
    </section>
  );
}
function TestimonialStrip({ data }: { data: Record<string, any> }) {
  const quotes = [v(data,"quote"),"ליווי מקצועי מהרגע הראשון.","שקיפות מלאה בכל שלב."];
  return (
    <section className="overflow-hidden border-t py-6" style={{ borderColor:"rgba(245,240,232,0.12)" }}>
      <div className="tpl-testi-track gap-8 px-4">
        {quotes.concat(quotes).map((q,i)=>(<blockquote key={`quote-${i}`} className="whitespace-nowrap border px-6 py-3 text-lg" style={{ borderColor:"rgba(245,240,232,0.12)", color:"#a89880" }}>{q}</blockquote>))}
      </div>
    </section>
  );
}

function VaultGalleryWall({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "#d4af3744", background: "#050403" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        {[1,2,3,4].map((i) => (
          <article key={i} className="tpl-curtain group overflow-hidden border" style={{ borderColor: "#d4af3755" }}>
            <img src={v(data, `item${i}Image`)} alt="" className="h-64 w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="p-5"><h3 className="tpl-display text-2xl font-bold">{v(data, `item${i}Title`)}</h3></div>
          </article>
        ))}
      </div>
    </section>
  );
}
function VaultAgentRoster({ data }: { data: Record<string, any> }) {
  const agents = [1,2,3,4].map((i) => ({ n: v(data, `agent${i}Name`), r: v(data, `agent${i}Role`), d: v(data, `agent${i}Deals`), img: v(data, `agent${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,240,232,0.12)", background: "#1a1612" }}>
      <div className="mx-auto max-w-7xl divide-y" style={{ borderColor: "rgba(245,240,232,0.12)" }}>
        {agents.map((a) => (
          <div key={a.n} className="flex flex-wrap items-center gap-5 py-6">
            <img src={a.img} alt="" className="h-20 w-20 rounded-full object-cover" />
            <div><h3 className="tpl-display text-xl font-bold">{a.n}</h3><p style={{ color: "#d4af37" }}>{a.r} · {a.d}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
function VaultQuoteRail({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(245,240,232,0.12)" }}>
      <div className="mx-auto max-w-3xl border-r-4 pr-8" style={{ borderColor: "#d4af37" }}>
        <p className="tpl-display text-3xl font-bold leading-snug">{v(data, "quote")}</p>
        <p className="mt-4 text-sm" style={{ color: "#a89880" }}>— {v(data, "brandName")}</p>
      </div>
    </section>
  );
}
function VaultTrustMetrics({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(245,240,232,0.12)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4">
        {stats.map(([vk,lk],i) => (
          <div key={lk} className="tpl-climb border p-5 text-center" style={{ borderColor: "rgba(245,240,232,0.12)", animationDelay: `${i*0.1}s` }}>
            <div className="tpl-display text-4xl font-bold" style={{ color: "#d4af37" }}>{v(data,vk)}</div>
            <p className="mt-2 text-sm" style={{ color: "#a89880" }}>{v(data,lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
function VaultMarketPulse({ data }: { data: Record<string, any> }) {
  const posts = [[v(data,"insight1Title"),v(data,"insight1Text"),v(data,"insight1Tag")],[v(data,"insight2Title"),v(data,"insight2Text"),v(data,"insight2Tag")],[v(data,"insight3Title"),v(data,"insight3Text"),v(data,"insight3Tag")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,240,232,0.12)", background: "#1a1612" }}>
      <h2 className="tpl-display mx-auto max-w-7xl text-4xl font-bold">תובנות Vault</h2>
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 lg:grid-cols-3">
        {posts.map(([t,x,g]) => (
          <article key={t} className="border p-5" style={{ borderColor: "rgba(245,240,232,0.12)" }}>
            <span className="text-[10px] font-bold" style={{ color: "#d4af37" }}>{g}</span>
            <h3 className="tpl-display mt-2 text-xl font-bold">{t}</h3>
            <p className="mt-2 text-sm leading-7" style={{ color: "#a89880" }}>{x}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function VaultCtaRibbon({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="px-5 py-14 lg:px-8" style={{ background: "#d4af37" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div><h2 className="tpl-display text-3xl font-bold md:text-4xl" style={{ color: "#0c0a08" }}>{v(data,"ctaTitle")}</h2>
        <p className="mt-2 max-w-xl" style={{ color: "#0c0a08", opacity: 0.85 }}>{v(data,"ctaText")}</p></div>
        <button type="button" onClick={onCta} className="border-2 px-8 py-3 font-bold" style={{ borderColor: "#0c0a08", color: "#0c0a08" }}>{v(data,"cta")}</button>
      </div>
    </section>
  );
}

function VaultFaqPanel({ data }: { data: Record<string, any> }) {
  const faqs = [[v(data,"faq1Q"),v(data,"faq1A")],[v(data,"faq2Q"),v(data,"faq2A")],[v(data,"faq3Q"),v(data,"faq3A")],[v(data,"faq4Q"),v(data,"faq4A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,240,232,0.12)" }}>
      <div className="mx-auto max-w-3xl grid gap-2">
        {faqs.map(([q,a]) => (
          <details key={q} className="border" style={{ borderColor: "rgba(245,240,232,0.12)" }}>
            <summary className="cursor-pointer px-4 py-3 font-bold">{q}</summary>
            <p className="border-t px-4 py-3 text-sm leading-7" style={{ borderColor: "rgba(245,240,232,0.12)", color: "#a89880" }}>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function VaultOfficeBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,240,232,0.12)", background: "#1a1612" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data,"officeTitle")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#a89880" }}>{v(data,"officeText")}</p>
          <p className="mt-6 text-sm font-semibold">{v(data,"phone")} · {v(data,"email")}</p>
        </div>
        <div className="relative min-h-[280px] overflow-hidden border" style={{ borderColor: "rgba(245,240,232,0.12)" }}>
          <img src={v(data,"aboutImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function VaultAwardsLane({ data }: { data: Record<string, any> }) {
  const awards = [v(data,"award1"),v(data,"award2"),v(data,"award3"),v(data,"award4")];
  return (
    <section className="overflow-hidden border-y py-4" style={{ borderColor: "rgba(245,240,232,0.12)", background: "#0c0a08" }}>
      <div className="tpl-marquee-track gap-10 px-6 text-xs font-bold tracking-[0.25em]" style={{ color: "#d4af37" }}>
        {awards.concat(awards).map((a,i) => <span key={i} className="whitespace-nowrap">{a} ·</span>)}
      </div>
    </section>
  );
}

function VaultProcessRail({ data }: { data: Record<string, any> }) {
  const steps = [[v(data,"step1"),v(data,"step1Desc")],[v(data,"step2"),v(data,"step2Desc")],[v(data,"step3"),v(data,"step3Desc")],[v(data,"step4"),v(data,"step4Desc")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,240,232,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {steps.map(([t,d],i) => (
          <div key={t} className="tpl-climb border-t pt-4" style={{ borderColor: "#d4af37", animationDelay: `${i*0.1}s` }}>
            <span className="text-2xl font-bold" style={{ color: "#d4af37" }}>0{i+1}</span>
            <h3 className="mt-2 font-bold">{t}</h3><p className="mt-1 text-sm" style={{ color: "#a89880" }}>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function VaultListingGrid({ data }: { data: Record<string, any> }) {
  const cards = [1,2,3,4].map((i) => ({ t: v(data,`item${i}Title`), m: v(data,`item${i}Meta`), p: v(data,`item${i}Price`), img: v(data,`item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,240,232,0.12)", background: "#1a1612" }}>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <article key={c.t} className="overflow-hidden border" style={{ borderColor: "rgba(245,240,232,0.12)" }}>
            <img src={c.img} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="p-4"><p className="text-xs" style={{ color: "#d4af37" }}>{c.m}</p><h3 className="font-bold">{c.t}</h3><p className="mt-2 font-bold" style={{ color: "#d4af37" }}>{c.p}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function VaultStatsRow({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-10 lg:px-8" style={{ borderColor: "rgba(245,240,232,0.12)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 text-center">
        {stats.map(([vk,lk],i) => (
          <div key={lk} className="tpl-climb" style={{ animationDelay: `${i*0.1}s` }}>
            <div className="tpl-display text-4xl font-bold" style={{ color: "#d4af37" }}>{v(data,vk)}</div>
            <p className="text-sm" style={{ color: "#a89880" }}>{v(data,lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(245,240,232,0.12)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#d4af37" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#a89880" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="min-h-[360px] overflow-hidden"><img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,240,232,0.12)", background: "#1a1612" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#d4af37" }}>יצירת קשר</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#a89880" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#a89880" }}>
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
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(245,240,232,0.12)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#a89880" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#f5f0e8" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <VaultCards data={data} />
      <TestimonialStrip data={data} />
      <VaultGalleryWall data={data} />
      <VaultAwardsLane data={data} />
      <VaultQuoteRail data={data} />
      <VaultCtaRibbon data={data} onCta={onCta} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,240,232,0.12)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#d4af37" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function VaulturePages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...vaultureDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: (
      <>
        <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,240,232,0.12)" }}>
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#d4af37" }}>{v(merged, "brandName")}</p>
            <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(merged, "contactTitle")}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "#a89880" }}>{v(merged, "contactText")}</p>
          </div>
        </section>
        <ContactBlock data={merged} onCta={() => goTo("contact")} />
        <VaultOfficeBlock data={merged} />
      <VaultAgentRoster data={merged} />
      <VaultFaqPanel data={merged} />
      <VaultTrustMetrics data={merged} />
      <VaultAwardsLane data={merged} />
        <Footer data={merged} />
      </>
    ),
  };
    pageContent["collection"] = (
      <InnerPage data={merged} title="אוסף" onCta={() => goTo("contact")}>
        <>
          <VaultCards data={merged} />
      <VaultGalleryWall data={merged} />
      <VaultListingGrid data={merged} />
      <VaultStatsRow data={merged} />
      <VaultCtaRibbon data={merged} onCta={() => goTo("contact")} />
        </>
      </InnerPage>
    );
    pageContent["exclusive"] = (
      <InnerPage data={merged} title="בלעדי" onCta={() => goTo("contact")}>
        <>
          <VaultCards data={merged} />
      <VaultListingGrid data={merged} />
      <VaultQuoteRail data={merged} />
      <VaultTrustMetrics data={merged} />
      <VaultCtaRibbon data={merged} onCta={() => goTo("contact")} />
        </>
      </InnerPage>
    );
    pageContent["about"] = (
      <InnerPage data={merged} title="אודות" onCta={() => goTo("contact")}>
        <>
          <AboutBlock data={merged} />
      <VaultAgentRoster data={merged} />
      <VaultQuoteRail data={merged} />
      <VaultTrustMetrics data={merged} />
      <VaultAwardsLane data={merged} />
        </>
      </InnerPage>
    );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "vaulture-preview" : "vaulture"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#0c0a08", color: "#f5f0e8" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
