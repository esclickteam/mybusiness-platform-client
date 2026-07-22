import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { landmarkDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const landmarkPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "areas", label: "אזורים", slug: "/areas" },
  { id: "listings", label: "נכסים", slug: "/listings" },
  { id: "guide", label: "מדריך", slug: "/guide" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = landmarkPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (landmarkDefaultData as Record<string, any>)[key] ?? "";
}
function cx(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = landmarkPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#f0f4f8f2", borderColor: "rgba(30,41,59,0.1)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#0ea5e9", color: "#ffffff" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#1e293b" : "#64748b" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#0ea5e9", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(30,41,59,0.1)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(30,41,59,0.1)" }}>
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
      <input className={field} style={{ borderColor: "rgba(30,41,59,0.1)", color: "#1e293b" }} placeholder="שם מלא" />
      <input className={field} style={{ borderColor: "rgba(30,41,59,0.1)", color: "#1e293b" }} placeholder="טלפון" />
      <input className={field} style={{ borderColor: "rgba(30,41,59,0.1)", color: "#1e293b" }} placeholder="אימייל" />
      <textarea className={cx(field, "min-h-28")} style={{ borderColor: "rgba(30,41,59,0.1)", color: "#1e293b" }} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#0ea5e9", color: "#ffffff" }}>{v(data, "cta")}</button>
    </form>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative min-h-[88vh] overflow-hidden" style={{ background: "#f0f4f8" }}>
        <div className="absolute inset-x-0 bottom-0 h-48 opacity-30" style={{ background: "#0f172a", clipPath: "polygon(0 100%, 0 40%, 15% 55%, 30% 35%, 45% 50%, 60% 25%, 75% 45%, 90% 30%, 100% 50%, 100% 100%)" }} />
        {[["20%","35%"],["45%","28%"],["70%","40%"],["85%","32%"]].map(([l,t], i) => (
          <div key={i} className="tpl-pin absolute h-4 w-4 rounded-full" style={{ left: l, top: t, background: "#0ea5e9", animationDelay: `${i * 0.4}s` }} />
        ))}
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-5 pt-24 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#0ea5e9" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#64748b" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#0ea5e9", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("areas")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(30,41,59,0.1)" }}>{v(data, "heroSecondary")}</button>
          </div></div>
      </section>
  );
}


function AreaGuides({ data }: { data: Record<string, any> }) {
  const areas = [1,2,3].map((i)=>[v(data,`item${i}Title`),v(data,`item${i}Text`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"rgba(30,41,59,0.1)" }}>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {areas.map(([t,x])=>(<div key={t} className="border p-5" style={{ borderColor:"rgba(30,41,59,0.1)", background:"#ffffff" }}>
          <div className="tpl-pin mb-3 h-3 w-3 rounded-full" style={{ background:"#0ea5e9" }} /><h3 className="tpl-display text-xl font-bold">{t}</h3><p className="mt-2 text-sm" style={{ color:"#64748b" }}>{x}</p>
        </div>))}
      </div>
    </section>
  );
}
function LocationRows({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor:"rgba(30,41,59,0.1)", background:"#ffffff" }}>
      <div className="mx-auto max-w-7xl divide-y" style={{ borderColor:"rgba(30,41,59,0.1)" }}>
        {[1,2,3,4].map((i)=>(<div key={i} className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div><span className="rounded px-2 py-1 text-xs font-bold" style={{ background:"#0ea5e922", color:"#0ea5e9" }}>{v(data,`item${i}Meta`)}</span><h3 className="tpl-display mt-2 text-2xl font-bold">{v(data,`item${i}Title`)}</h3></div>
          <p className="text-xl font-bold" style={{ color:"#0ea5e9" }}>{v(data,`item${i}Price`)}</p>
        </div>))}
      </div>
    </section>
  );
}

function TestimonialsBlock({ data }: { data: Record<string, any> }) {
  const items = [
    { quote: v(data, "quote"), author: v(data, "brandName"), role: "לקוחות מרוצים" },
    { quote: v(data, "testimonial2"), author: v(data, "testimonial2Author"), role: v(data, "testimonial2Role") },
    { quote: v(data, "testimonial3"), author: v(data, "testimonial3Author"), role: v(data, "testimonial3Role") },
  ];
  return (
    <section className="tpl-sweep overflow-hidden border-t py-16 lg:py-20" style={{ borderColor: "rgba(30,41,59,0.1)", background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#0ea5e9" }}>המלצות</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold md:text-5xl">מה אומרים עלינו</h2>
      </div>
      <div className="tpl-testi-track mt-10 gap-6 px-5">
        {items.concat(items).map((t, i) => (
          <blockquote key={`testi-${i}`} className="tpl-glass min-w-[320px] max-w-[420px] shrink-0 border p-6 md:min-w-[380px]" style={{ borderColor: "rgba(30,41,59,0.1)" }}>
            <p className="text-lg leading-8" style={{ color: "#1e293b" }}>&ldquo;{t.quote}&rdquo;</p>
            <footer className="mt-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full text-xs font-bold" style={{ background: "#0ea5e9", color: "#ffffff" }}>{String(t.author || "?")[0]}</span>
              <div><p className="font-bold">{t.author}</p><p className="text-xs" style={{ color: "#64748b" }}>{t.role}</p></div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function AgentGrid({ data }: { data: Record<string, any> }) {
  const agents = [
    { name: v(data, "agent1Name"), role: v(data, "agent1Role"), deals: v(data, "agent1Deals"), img: v(data, "agent1Image") },
    { name: v(data, "agent2Name"), role: v(data, "agent2Role"), deals: v(data, "agent2Deals"), img: v(data, "agent2Image") },
    { name: v(data, "agent3Name"), role: v(data, "agent3Role"), deals: v(data, "agent3Deals"), img: v(data, "agent3Image") },
    { name: v(data, "agent4Name"), role: v(data, "agent4Role"), deals: v(data, "agent4Deals"), img: v(data, "agent4Image") },
  ];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(30,41,59,0.1)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#0ea5e9" }}>הצוות</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold md:text-5xl">סוכנים שמכירים כל פינה</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((a, i) => (
            <article key={a.name} className="tpl-climb tpl-glass group overflow-hidden border" style={{ borderColor: "rgba(30,41,59,0.1)", animationDelay: `${i * 0.08}s` }}>
              <div className="relative h-56 overflow-hidden">
                <img src={a.img} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="tpl-glow absolute inset-0 opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="p-5">
                <h3 className="tpl-display text-xl font-bold">{a.name}</h3>
                <p className="mt-1 text-sm" style={{ color: "#0ea5e9" }}>{a.role}</p>
                <p className="mt-3 text-xs font-semibold tracking-wide" style={{ color: "#64748b" }}>{a.deals}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustBadges({ data }: { data: Record<string, any> }) {
  const badges = [
    [v(data, "stat1Value"), v(data, "stat1Label")],
    [v(data, "stat2Value"), v(data, "stat2Label")],
    [v(data, "stat3Value"), v(data, "stat3Label")],
    ["100%", "שקיפות מלאה"],
  ];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(30,41,59,0.1)", background: "#0f172a" }}>
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map(([val, label], i) => (
          <div key={label} className="tpl-climb tpl-shimmer border p-6 text-center" style={{ borderColor: "rgba(30,41,59,0.1)", animationDelay: `${i * 0.1}s` }}>
            <div className="tpl-display text-4xl font-bold md:text-5xl" style={{ color: "#0ea5e9" }}>{val}</div>
            <p className="mt-2 text-sm font-semibold tracking-wide" style={{ color: "#64748b" }}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MarketInsights({ data }: { data: Record<string, any> }) {
  const posts = [
    { title: v(data, "insight1Title"), text: v(data, "insight1Text"), tag: v(data, "insight1Tag") },
    { title: v(data, "insight2Title"), text: v(data, "insight2Text"), tag: v(data, "insight2Tag") },
    { title: v(data, "insight3Title"), text: v(data, "insight3Text"), tag: v(data, "insight3Tag") },
  ];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(30,41,59,0.1)", background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#0ea5e9" }}>תובנות שוק</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold md:text-5xl">מה קורה בשוק הנדל״ן</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {posts.map((p, i) => (
            <article key={p.title} className="tpl-climb group border p-6 transition hover:-translate-y-1" style={{ borderColor: "rgba(30,41,59,0.1)", background: "#f0f4f8", animationDelay: `${i * 0.12}s` }}>
              <span className="rounded px-2 py-1 text-[10px] font-bold tracking-wider" style={{ background: "#0ea5e922", color: "#0ea5e9" }}>{p.tag}</span>
              <h3 className="tpl-display mt-4 text-2xl font-bold">{p.title}</h3>
              <p className="mt-3 text-sm leading-7" style={{ color: "#64748b" }}>{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="relative overflow-hidden px-5 py-16 lg:px-8 lg:py-20" style={{ background: "#0ea5e9" }}>
      <div className="tpl-parallax absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 20% 50%, #ffffff, transparent 55%)" }} />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold tracking-[0.3em]" style={{ color: "#ffffff", opacity: 0.7 }}>{v(data, "brandName")}</p>
          <h2 className="tpl-display mt-3 text-4xl font-bold md:text-5xl" style={{ color: "#ffffff" }}>{v(data, "ctaTitle")}</h2>
          <p className="mt-4 max-w-xl text-lg" style={{ color: "#ffffff", opacity: 0.85 }}>{v(data, "ctaText")}</p>
        </div>
        <button type="button" onClick={onCta} className="tpl-magnetic border-2 px-8 py-4 text-lg font-bold transition hover:scale-105" style={{ borderColor: "#ffffff", color: "#ffffff", background: "transparent" }}>{v(data, "cta")}</button>
      </div>
    </section>
  );
}

function FaqBlock({ data }: { data: Record<string, any> }) {
  const faqs = [
    [v(data, "faq1Q"), v(data, "faq1A")],
    [v(data, "faq2Q"), v(data, "faq2A")],
    [v(data, "faq3Q"), v(data, "faq3A")],
    [v(data, "faq4Q"), v(data, "faq4A")],
  ];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(30,41,59,0.1)" }}>
      <div className="mx-auto max-w-3xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#0ea5e9" }}>שאלות נפוצות</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold">כל מה שרציתם לדעת</h2>
        <div className="mt-10 grid gap-3">
          {faqs.map(([q, a], i) => (
            <details key={q} className="tpl-climb group border" style={{ borderColor: "rgba(30,41,59,0.1)", animationDelay: `${i * 0.08}s` }}>
              <summary className="cursor-pointer list-none px-5 py-4 font-bold marker:content-none">{q}</summary>
              <p className="border-t px-5 py-4 text-sm leading-7" style={{ borderColor: "rgba(30,41,59,0.1)", color: "#64748b" }}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function OfficeMap({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(30,41,59,0.1)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#0ea5e9" }}>המשרד</p>
          <h2 className="tpl-display mt-3 text-4xl font-bold">{v(data, "officeTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#64748b" }}>{v(data, "officeText")}</p>
          <div className="mt-8 space-y-3 text-sm font-semibold">
            <p>{v(data, "address")}</p>
            <p>{v(data, "phone")}</p>
            <p>{v(data, "email")}</p>
          </div>
        </div>
        <div className="tpl-parallax relative min-h-[320px] overflow-hidden border" style={{ borderColor: "rgba(30,41,59,0.1)" }}>
          <img src={v(data, "aboutImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "#0f172a66" }} />
          <div className="tpl-pin absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4" style={{ borderColor: "#0ea5e9", background: "#0ea5e9" }} />
        </div>
      </div>
    </section>
  );
}

function ParallaxShowcase({ data }: { data: Record<string, any> }) {
  const items = [1, 2, 3, 4].map((i) => ({
    title: v(data, `item${i}Title`),
    meta: v(data, `item${i}Meta`),
    price: v(data, `item${i}Price`),
    img: v(data, `item${i}Image`),
  }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(30,41,59,0.1)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#0ea5e9" }}>גלריה</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold md:text-5xl">נכסים במבט שני</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {items.map((c, i) => (
            <article key={c.title} className="tpl-climb tpl-glass group relative overflow-hidden border" style={{ borderColor: "rgba(30,41,59,0.1)", animationDelay: `${i * 0.1}s`, minHeight: i % 2 ? "280px" : "340px" }}>
              <img src={c.img} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, #0f172aee, transparent 60%)" }} />
              <div className="absolute bottom-0 p-6">
                <p className="text-xs font-bold" style={{ color: "#0ea5e9" }}>{c.meta}</p>
                <h3 className="tpl-display mt-1 text-2xl font-bold text-white">{c.title}</h3>
                <p className="mt-2 text-lg font-bold" style={{ color: "#0ea5e9" }}>{c.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AwardsStrip({ data }: { data: Record<string, any> }) {
  const awards = [v(data, "award1"), v(data, "award2"), v(data, "award3"), v(data, "award4")];
  return (
    <section className="tpl-sweep overflow-hidden border-y py-5" style={{ borderColor: "rgba(30,41,59,0.1)", background: "#f0f4f8" }}>
      <div className="tpl-marquee-track gap-12 px-6 text-sm font-bold tracking-[0.22em]" style={{ color: "#0ea5e9" }}>
        {awards.concat(awards).map((a, i) => <span key={`award-${i}`} className="whitespace-nowrap">{a} ·</span>)}
      </div>
    </section>
  );
}

function FeaturedListings({ data }: { data: Record<string, any> }) {
  const cards = [1,2,3,4].map((i) => ({
    title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`),
    price: v(data, `item${i}Price`), img: v(data, `item${i}Image`),
  }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(30,41,59,0.1)", background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#0ea5e9" }}>נכסים</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold md:text-5xl">נכסים נבחרים</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <article key={c.title} className="tpl-climb tpl-glass group overflow-hidden border" style={{ borderColor: "rgba(30,41,59,0.1)", animationDelay: `${i * 0.08}s` }}>
              <div className="relative overflow-hidden">
                <img src={c.img} alt="" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="tpl-glow absolute inset-0 opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold" style={{ color: "#0ea5e9" }}>{c.meta}</p>
                <h3 className="tpl-display mt-1 text-xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm leading-6" style={{ color: "#64748b" }}>{c.text}</p>
                <p className="mt-3 text-lg font-bold" style={{ color: "#0ea5e9" }}>{c.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsRow({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(30,41,59,0.1)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 text-center">
        {stats.map(([vk, lk], i) => (
          <div key={lk} className="tpl-climb tpl-shimmer border p-6" style={{ borderColor: "rgba(30,41,59,0.1)", animationDelay: `${i * 0.1}s` }}>
            <div className="tpl-display text-4xl font-bold md:text-5xl" style={{ color: "#0ea5e9" }}>{v(data, vk)}</div>
            <p className="mt-2 text-sm font-semibold" style={{ color: "#64748b" }}>{v(data, lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProcessTimeline({ data }: { data: Record<string, any> }) {
  const steps = [
    [v(data, "step1"), v(data, "step1Desc")],
    [v(data, "step2"), v(data, "step2Desc")],
    [v(data, "step3"), v(data, "step3Desc")],
    [v(data, "step4"), v(data, "step4Desc")],
  ];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(30,41,59,0.1)", background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#0ea5e9" }}>תהליך</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold">איך אנחנו עובדים</h2>
        <div className="tpl-line-draw mt-10 h-px w-full" style={{ background: "#0ea5e9" }} />
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map(([title, desc], i) => (
            <div key={title} className="tpl-climb border-t pt-5" style={{ borderColor: "#0ea5e9", animationDelay: `${i * 0.1}s` }}>
              <span className="tpl-display text-3xl font-bold" style={{ color: "#0ea5e9" }}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-7" style={{ color: "#64748b" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(30,41,59,0.1)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#0ea5e9" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#64748b" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="min-h-[360px] overflow-hidden"><img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(30,41,59,0.1)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#0ea5e9" }}>יצירת קשר</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#64748b" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#64748b" }}>
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
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(30,41,59,0.1)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#64748b" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#1e293b" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <AreaGuides data={data} />
      <LocationRows data={data} />
      <ParallaxShowcase data={data} />
      <StatsRow data={data} />
      <AwardsStrip data={data} />
      <TestimonialsBlock data={data} />
      <CtaBand data={data} onCta={onCta} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(30,41,59,0.1)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#0ea5e9" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function LandmarkPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...landmarkDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: (
      <>
        <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(30,41,59,0.1)" }}>
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#0ea5e9" }}>{v(merged, "brandName")}</p>
            <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(merged, "contactTitle")}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "#64748b" }}>{v(merged, "contactText")}</p>
          </div>
        </section>
        <ContactBlock data={merged} onCta={() => goTo("contact")} />
        <OfficeMap data={merged} />
      <AgentGrid data={merged} />
      <FaqBlock data={merged} />
      <TrustBadges data={merged} />
      <AwardsStrip data={merged} />
        <Footer data={merged} />
      </>
    ),
  };
    pageContent["areas"] = (
      <InnerPage data={merged} title="אזורים" onCta={() => goTo("contact")}>
        <>
          <AreaGuides data={merged} />
      <ParallaxShowcase data={merged} />
      <MarketInsights data={merged} />
      <StatsRow data={merged} />
      <CtaBand data={merged} onCta={() => goTo("contact")} />
        </>
      </InnerPage>
    );
    pageContent["listings"] = (
      <InnerPage data={merged} title="נכסים" onCta={() => goTo("contact")}>
        <>
          <LocationRows data={merged} />
      <FeaturedListings data={merged} />
      <ParallaxShowcase data={merged} />
      <TrustBadges data={merged} />
      <CtaBand data={merged} onCta={() => goTo("contact")} />
        </>
      </InnerPage>
    );
    pageContent["guide"] = (
      <InnerPage data={merged} title="מדריך" onCta={() => goTo("contact")}>
        <>
          <AreaGuides data={merged} />
      <LocationRows data={merged} />
      <ParallaxShowcase data={merged} />
      <StatsRow data={merged} />
      <FaqBlock data={merged} />
        </>
      </InnerPage>
    );
    pageContent["about"] = (
      <InnerPage data={merged} title="אודות" onCta={() => goTo("contact")}>
        <>
          <AboutBlock data={merged} />
      <AgentGrid data={merged} />
      <TestimonialsBlock data={merged} />
      <TrustBadges data={merged} />
      <AwardsStrip data={merged} />
        </>
      </InnerPage>
    );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "landmark-preview" : "landmark"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#f0f4f8", color: "#1e293b" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
