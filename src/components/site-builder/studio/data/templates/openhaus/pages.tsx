import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { openhausDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const openhausPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "openhouses", label: "בתים פתוחים", slug: "/openhouses" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = openhausPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (openhausDefaultData as Record<string, any>)[key] ?? "";
}
function cx(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = openhausPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#fffbf7f2", borderColor: "rgba(41,37,36,0.1)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#ea580c", color: "#ffffff" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#292524" : "#78716c" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#ea580c", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(41,37,36,0.1)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
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
      <input className={field} style={{ borderColor: "rgba(41,37,36,0.1)", color: "#292524" }} placeholder="שם מלא" />
      <input className={field} style={{ borderColor: "rgba(41,37,36,0.1)", color: "#292524" }} placeholder="טלפון" />
      <input className={field} style={{ borderColor: "rgba(41,37,36,0.1)", color: "#292524" }} placeholder="אימייל" />
      <textarea className={cx(field, "min-h-28")} style={{ borderColor: "rgba(41,37,36,0.1)", color: "#292524" }} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#ea580c", color: "#ffffff" }}>{v(data, "cta")}</button>
    </form>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative min-h-[88vh] overflow-hidden px-5 py-16 lg:px-8">
        <div className="tpl-rotate-stage mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#ea580c" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#78716c" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#ea580c", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("openhouses")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(41,37,36,0.1)" }}>{v(data, "heroSecondary")}</button>
          </div></div>
          <div className="relative h-[420px]">
            <div className="tpl-rotate-track absolute inset-0">
              {[v(data,"heroImage"), v(data,"item1Image"), v(data,"item2Image")].map((src,i) => (
                <div key={i} className="absolute inset-0 overflow-hidden border" style={{ borderColor: "rgba(41,37,36,0.1)", transform: `rotateY(${i * 120}deg) translateZ(220px)` }}>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
  );
}


function OpenHouseTimeline({ data }: { data: Record<string, any> }) {
  const events = [1,2,3,4].map((i)=>[v(data,`item${i}Title`),v(data,`item${i}Meta`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"rgba(41,37,36,0.1)" }}>
      <div className="mx-auto max-w-7xl">
        {events.map(([t,m],i)=>(<div key={t} className="tpl-climb relative border-r-2 pr-8 pb-8" style={{ borderColor:"#ea580c", animationDelay:`${i*0.1}s` }}>
          <span className="text-sm font-bold" style={{ color:"#ea580c" }}>{m}</span><h3 className="tpl-display text-2xl font-bold">{t}</h3>
        </div>))}
      </div>
    </section>
  );
}
function MasonryGallery({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"rgba(41,37,36,0.1)", background:"#ffffff" }}>
      <div className="mx-auto max-w-7xl tpl-masonry">
        {[1,2,3,4].map((i)=>(<figure key={i} className="mb-4 break-inside-avoid overflow-hidden border" style={{ borderColor:"rgba(41,37,36,0.1)" }}>
          <img src={v(data,`item${i}Image`)} alt="" className="w-full object-cover" style={{ height: i%2?"220px":"280px" }} />
        </figure>))}
      </div>
    </section>
  );
}

function PanelGalleryWall({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 tpl-masonry" style={{ borderColor: "rgba(41,37,36,0.1)", background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl columns-2 gap-4">
        {[1,2,3,4].map((i) => (
          <figure key={i} className="mb-4 break-inside-avoid overflow-hidden border" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
            <img src={v(data, `item${i}Image`)} alt="" className="w-full object-cover" style={{ height: i%2?"200px":"260px" }} />
          </figure>
        ))}
      </div>
    </section>
  );
}
function PanelAgentRoster({ data }: { data: Record<string, any> }) {
  const agents = [1,2,3,4].map((i) => ({ n: v(data, `agent${i}Name`), r: v(data, `agent${i}Role`), d: v(data, `agent${i}Deals`), img: v(data, `agent${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(41,37,36,0.1)", background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl divide-y" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
        {agents.map((a) => (
          <div key={a.n} className="flex flex-wrap items-center gap-5 py-6">
            <img src={a.img} alt="" className="h-20 w-20 rounded-full object-cover" />
            <div><h3 className="tpl-display text-xl font-bold">{a.n}</h3><p style={{ color: "#ea580c" }}>{a.r} · {a.d}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
function PanelQuoteRail({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
      <div className="mx-auto max-w-3xl border-r-4 pr-8" style={{ borderColor: "#ea580c" }}>
        <p className="tpl-display text-3xl font-bold leading-snug">{v(data, "quote")}</p>
        <p className="mt-4 text-sm" style={{ color: "#78716c" }}>— {v(data, "brandName")}</p>
      </div>
    </section>
  );
}
function PanelTrustMetrics({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4">
        {stats.map(([vk,lk],i) => (
          <div key={lk} className="tpl-climb border p-5 text-center" style={{ borderColor: "rgba(41,37,36,0.1)", animationDelay: `${i*0.1}s` }}>
            <div className="tpl-display text-4xl font-bold" style={{ color: "#ea580c" }}>{v(data,vk)}</div>
            <p className="mt-2 text-sm" style={{ color: "#78716c" }}>{v(data,lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
function PanelMarketPulse({ data }: { data: Record<string, any> }) {
  const posts = [[v(data,"insight1Title"),v(data,"insight1Text"),v(data,"insight1Tag")],[v(data,"insight2Title"),v(data,"insight2Text"),v(data,"insight2Tag")],[v(data,"insight3Title"),v(data,"insight3Text"),v(data,"insight3Tag")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(41,37,36,0.1)", background: "#ffffff" }}>
      <h2 className="tpl-display mx-auto max-w-7xl text-4xl font-bold">תובנות Panel</h2>
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 lg:grid-cols-3">
        {posts.map(([t,x,g]) => (
          <article key={t} className="border p-5" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
            <span className="text-[10px] font-bold" style={{ color: "#ea580c" }}>{g}</span>
            <h3 className="tpl-display mt-2 text-xl font-bold">{t}</h3>
            <p className="mt-2 text-sm leading-7" style={{ color: "#78716c" }}>{x}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PanelCtaRibbon({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="px-5 py-14 lg:px-8" style={{ background: "#ea580c" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div><h2 className="tpl-display text-3xl font-bold md:text-4xl" style={{ color: "#ffffff" }}>{v(data,"ctaTitle")}</h2>
        <p className="mt-2 max-w-xl" style={{ color: "#ffffff", opacity: 0.85 }}>{v(data,"ctaText")}</p></div>
        <button type="button" onClick={onCta} className="border-2 px-8 py-3 font-bold" style={{ borderColor: "#ffffff", color: "#ffffff" }}>{v(data,"cta")}</button>
      </div>
    </section>
  );
}

function PanelFaqPanel({ data }: { data: Record<string, any> }) {
  const faqs = [[v(data,"faq1Q"),v(data,"faq1A")],[v(data,"faq2Q"),v(data,"faq2A")],[v(data,"faq3Q"),v(data,"faq3A")],[v(data,"faq4Q"),v(data,"faq4A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
      <div className="mx-auto max-w-3xl grid gap-2">
        {faqs.map(([q,a]) => (
          <details key={q} className="border" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
            <summary className="cursor-pointer px-4 py-3 font-bold">{q}</summary>
            <p className="border-t px-4 py-3 text-sm leading-7" style={{ borderColor: "rgba(41,37,36,0.1)", color: "#78716c" }}>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function PanelOfficeBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(41,37,36,0.1)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data,"officeTitle")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#78716c" }}>{v(data,"officeText")}</p>
          <p className="mt-6 text-sm font-semibold">{v(data,"phone")} · {v(data,"email")}</p>
        </div>
        <div className="relative min-h-[280px] overflow-hidden border" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
          <img src={v(data,"aboutImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function PanelAwardsLane({ data }: { data: Record<string, any> }) {
  const awards = [v(data,"award1"),v(data,"award2"),v(data,"award3"),v(data,"award4")];
  return (
    <section className="overflow-hidden border-y py-4" style={{ borderColor: "rgba(41,37,36,0.1)", background: "#fffbf7" }}>
      <div className="tpl-marquee-track gap-10 px-6 text-xs font-bold tracking-[0.25em]" style={{ color: "#ea580c" }}>
        {awards.concat(awards).map((a,i) => <span key={i} className="whitespace-nowrap">{a} ·</span>)}
      </div>
    </section>
  );
}

function PanelProcessRail({ data }: { data: Record<string, any> }) {
  const steps = [[v(data,"step1"),v(data,"step1Desc")],[v(data,"step2"),v(data,"step2Desc")],[v(data,"step3"),v(data,"step3Desc")],[v(data,"step4"),v(data,"step4Desc")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {steps.map(([t,d],i) => (
          <div key={t} className="tpl-climb border-t pt-4" style={{ borderColor: "#ea580c", animationDelay: `${i*0.1}s` }}>
            <span className="text-2xl font-bold" style={{ color: "#ea580c" }}>0{i+1}</span>
            <h3 className="mt-2 font-bold">{t}</h3><p className="mt-1 text-sm" style={{ color: "#78716c" }}>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PanelListingGrid({ data }: { data: Record<string, any> }) {
  const cards = [1,2,3,4].map((i) => ({ t: v(data,`item${i}Title`), m: v(data,`item${i}Meta`), p: v(data,`item${i}Price`), img: v(data,`item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(41,37,36,0.1)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <article key={c.t} className="overflow-hidden border" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
            <img src={c.img} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="p-4"><p className="text-xs" style={{ color: "#ea580c" }}>{c.m}</p><h3 className="font-bold">{c.t}</h3><p className="mt-2 font-bold" style={{ color: "#ea580c" }}>{c.p}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PanelStatsRow({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-10 lg:px-8" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 text-center">
        {stats.map(([vk,lk],i) => (
          <div key={lk} className="tpl-climb" style={{ animationDelay: `${i*0.1}s` }}>
            <div className="tpl-display text-4xl font-bold" style={{ color: "#ea580c" }}>{v(data,vk)}</div>
            <p className="text-sm" style={{ color: "#78716c" }}>{v(data,lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#ea580c" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#78716c" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="min-h-[360px] overflow-hidden"><img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(41,37,36,0.1)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#ea580c" }}>יצירת קשר</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#78716c" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#78716c" }}>
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
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#78716c" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#292524" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <OpenHouseTimeline data={data} />
      <MasonryGallery data={data} />
      <PanelGalleryWall data={data} />
      <PanelAwardsLane data={data} />
      <PanelQuoteRail data={data} />
      <PanelCtaRibbon data={data} onCta={onCta} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#ea580c" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function OpenhausPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...openhausDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: (
      <>
        <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(41,37,36,0.1)" }}>
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#ea580c" }}>{v(merged, "brandName")}</p>
            <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(merged, "contactTitle")}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "#78716c" }}>{v(merged, "contactText")}</p>
          </div>
        </section>
        <ContactBlock data={merged} onCta={() => goTo("contact")} />
        <PanelOfficeBlock data={merged} />
      <PanelAgentRoster data={merged} />
      <PanelFaqPanel data={merged} />
      <PanelTrustMetrics data={merged} />
      <PanelAwardsLane data={merged} />
        <Footer data={merged} />
      </>
    ),
  };
    pageContent["openhouses"] = (
      <InnerPage data={merged} title="בתים פתוחים" onCta={() => goTo("contact")}>
        <>
          <OpenHouseTimeline data={merged} />
      <MasonryGallery data={merged} />
      <PanelGalleryWall data={merged} />
      <PanelTrustMetrics data={merged} />
      <PanelFaqPanel data={merged} />
        </>
      </InnerPage>
    );
    pageContent["gallery"] = (
      <InnerPage data={merged} title="גלריה" onCta={() => goTo("contact")}>
        <>
          <MasonryGallery data={merged} />
      <PanelGalleryWall data={merged} />
      <PanelListingGrid data={merged} />
      <PanelStatsRow data={merged} />
      <PanelCtaRibbon data={merged} onCta={() => goTo("contact")} />
        </>
      </InnerPage>
    );
    pageContent["about"] = (
      <InnerPage data={merged} title="אודות" onCta={() => goTo("contact")}>
        <>
          <AboutBlock data={merged} />
      <PanelAgentRoster data={merged} />
      <PanelQuoteRail data={merged} />
      <PanelTrustMetrics data={merged} />
      <PanelAwardsLane data={merged} />
        </>
      </InnerPage>
    );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "openhaus-preview" : "openhaus"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#fffbf7", color: "#292524" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
