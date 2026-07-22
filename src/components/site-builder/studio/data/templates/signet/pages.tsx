import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { signetDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const signetPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "listings", label: "נכסים", slug: "/listings" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = signetPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (signetDefaultData as Record<string, any>)[key] ?? "";
}
function cx(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = signetPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#1a1814f2", borderColor: "rgba(245,240,230,0.12)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#b8860b", color: "#1a1814" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#f5f0e6" : "#b8a898" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#b8860b", color: "#1a1814" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(245,240,230,0.12)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(245,240,230,0.12)" }}>
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
      <input className={field} style={{ borderColor: "rgba(245,240,230,0.12)", color: "#f5f0e6" }} placeholder="שם מלא" />
      <input className={field} style={{ borderColor: "rgba(245,240,230,0.12)", color: "#f5f0e6" }} placeholder="טלפון" />
      <input className={field} style={{ borderColor: "rgba(245,240,230,0.12)", color: "#f5f0e6" }} placeholder="אימייל" />
      <textarea className={cx(field, "min-h-28")} style={{ borderColor: "rgba(245,240,230,0.12)", color: "#f5f0e6" }} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#b8860b", color: "#1a1814" }}>{v(data, "cta")}</button>
    </form>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative min-h-[88vh] overflow-hidden">
        <img src={v(data, "heroImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "#0d0c0abb" }} />
        <div className="tpl-stamp absolute left-1/2 top-1/2 z-10 grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 text-center text-xs font-bold" style={{ borderColor: "#b8860b", color: "#b8860b" }}>חתום<br/>איכות</div>
        <div className="relative z-20 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#b8860b" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#b8a898" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#b8860b", color: "#1a1814" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("process")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(245,240,230,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div></div>
      </section>
  );
}


function StampSteps({ data }: { data: Record<string, any> }) {
  const steps = ["אפיון","סינון","סיור","חתימה"];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"rgba(245,240,230,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
        {steps.map((s,i)=>(<div key={s} className="tpl-stamp border p-6 text-center" style={{ borderColor:"#b8860b", animationDelay:`${i*0.2}s` }}>
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full border-2 text-xs font-bold" style={{ borderColor:"#b8860b", color:"#b8860b" }}>חתום</div>
          <p className="font-bold">{s}</p>
        </div>))}
      </div>
    </section>
  );
}
function ListingSpotlight({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"rgba(245,240,230,0.12)", background:"#2a2620" }}>
      <div className="mx-auto grid max-w-7xl overflow-hidden border lg:grid-cols-2" style={{ borderColor:"rgba(245,240,230,0.12)" }}>
        <img src={v(data,"item1Image")} alt="" className="min-h-[320px] w-full object-cover" />
        <div className="flex flex-col justify-center p-8">
          <p className="text-xs font-bold tracking-[0.24em]" style={{ color:"#b8860b" }}>נכס השבוע</p>
          <h3 className="tpl-display mt-3 text-4xl font-bold">{v(data,"item1Title")}</h3>
          <p className="mt-4 text-lg" style={{ color:"#b8a898" }}>{v(data,"item1Text")}</p>
          <p className="mt-6 text-3xl font-bold" style={{ color:"#b8860b" }}>{v(data,"item1Price")}</p>
        </div>
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
    <section className="tpl-sweep overflow-hidden border-t py-16 lg:py-20" style={{ borderColor: "rgba(245,240,230,0.12)", background: "#2a2620" }}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#b8860b" }}>המלצות</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold md:text-5xl">מה אומרים עלינו</h2>
      </div>
      <div className="tpl-testi-track mt-10 gap-6 px-5">
        {items.concat(items).map((t, i) => (
          <blockquote key={`testi-${i}`} className="tpl-glass min-w-[320px] max-w-[420px] shrink-0 border p-6 md:min-w-[380px]" style={{ borderColor: "rgba(245,240,230,0.12)" }}>
            <p className="text-lg leading-8" style={{ color: "#f5f0e6" }}>&ldquo;{t.quote}&rdquo;</p>
            <footer className="mt-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full text-xs font-bold" style={{ background: "#b8860b", color: "#1a1814" }}>{String(t.author || "?")[0]}</span>
              <div><p className="font-bold">{t.author}</p><p className="text-xs" style={{ color: "#b8a898" }}>{t.role}</p></div>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,240,230,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#b8860b" }}>הצוות</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold md:text-5xl">סוכנים שמכירים כל פינה</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((a, i) => (
            <article key={a.name} className="tpl-climb tpl-glass group overflow-hidden border" style={{ borderColor: "rgba(245,240,230,0.12)", animationDelay: `${i * 0.08}s` }}>
              <div className="relative h-56 overflow-hidden">
                <img src={a.img} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="tpl-glow absolute inset-0 opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="p-5">
                <h3 className="tpl-display text-xl font-bold">{a.name}</h3>
                <p className="mt-1 text-sm" style={{ color: "#b8860b" }}>{a.role}</p>
                <p className="mt-3 text-xs font-semibold tracking-wide" style={{ color: "#b8a898" }}>{a.deals}</p>
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
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(245,240,230,0.12)", background: "#0d0c0a" }}>
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map(([val, label], i) => (
          <div key={label} className="tpl-climb tpl-shimmer border p-6 text-center" style={{ borderColor: "rgba(245,240,230,0.12)", animationDelay: `${i * 0.1}s` }}>
            <div className="tpl-display text-4xl font-bold md:text-5xl" style={{ color: "#b8860b" }}>{val}</div>
            <p className="mt-2 text-sm font-semibold tracking-wide" style={{ color: "#b8a898" }}>{label}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,240,230,0.12)", background: "#2a2620" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#b8860b" }}>תובנות שוק</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold md:text-5xl">מה קורה בשוק הנדל״ן</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {posts.map((p, i) => (
            <article key={p.title} className="tpl-climb group border p-6 transition hover:-translate-y-1" style={{ borderColor: "rgba(245,240,230,0.12)", background: "#1a1814", animationDelay: `${i * 0.12}s` }}>
              <span className="rounded px-2 py-1 text-[10px] font-bold tracking-wider" style={{ background: "#b8860b22", color: "#b8860b" }}>{p.tag}</span>
              <h3 className="tpl-display mt-4 text-2xl font-bold">{p.title}</h3>
              <p className="mt-3 text-sm leading-7" style={{ color: "#b8a898" }}>{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="relative overflow-hidden px-5 py-16 lg:px-8 lg:py-20" style={{ background: "#b8860b" }}>
      <div className="tpl-parallax absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 20% 50%, #1a1814, transparent 55%)" }} />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold tracking-[0.3em]" style={{ color: "#1a1814", opacity: 0.7 }}>{v(data, "brandName")}</p>
          <h2 className="tpl-display mt-3 text-4xl font-bold md:text-5xl" style={{ color: "#1a1814" }}>{v(data, "ctaTitle")}</h2>
          <p className="mt-4 max-w-xl text-lg" style={{ color: "#1a1814", opacity: 0.85 }}>{v(data, "ctaText")}</p>
        </div>
        <button type="button" onClick={onCta} className="tpl-magnetic border-2 px-8 py-4 text-lg font-bold transition hover:scale-105" style={{ borderColor: "#1a1814", color: "#1a1814", background: "transparent" }}>{v(data, "cta")}</button>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,240,230,0.12)" }}>
      <div className="mx-auto max-w-3xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#b8860b" }}>שאלות נפוצות</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold">כל מה שרציתם לדעת</h2>
        <div className="mt-10 grid gap-3">
          {faqs.map(([q, a], i) => (
            <details key={q} className="tpl-climb group border" style={{ borderColor: "rgba(245,240,230,0.12)", animationDelay: `${i * 0.08}s` }}>
              <summary className="cursor-pointer list-none px-5 py-4 font-bold marker:content-none">{q}</summary>
              <p className="border-t px-5 py-4 text-sm leading-7" style={{ borderColor: "rgba(245,240,230,0.12)", color: "#b8a898" }}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function OfficeMap({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,240,230,0.12)", background: "#2a2620" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#b8860b" }}>המשרד</p>
          <h2 className="tpl-display mt-3 text-4xl font-bold">{v(data, "officeTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#b8a898" }}>{v(data, "officeText")}</p>
          <div className="mt-8 space-y-3 text-sm font-semibold">
            <p>{v(data, "address")}</p>
            <p>{v(data, "phone")}</p>
            <p>{v(data, "email")}</p>
          </div>
        </div>
        <div className="tpl-parallax relative min-h-[320px] overflow-hidden border" style={{ borderColor: "rgba(245,240,230,0.12)" }}>
          <img src={v(data, "aboutImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "#0d0c0a66" }} />
          <div className="tpl-pin absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4" style={{ borderColor: "#b8860b", background: "#b8860b" }} />
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,240,230,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#b8860b" }}>גלריה</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold md:text-5xl">נכסים במבט שני</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {items.map((c, i) => (
            <article key={c.title} className="tpl-climb tpl-glass group relative overflow-hidden border" style={{ borderColor: "rgba(245,240,230,0.12)", animationDelay: `${i * 0.1}s`, minHeight: i % 2 ? "280px" : "340px" }}>
              <img src={c.img} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, #0d0c0aee, transparent 60%)" }} />
              <div className="absolute bottom-0 p-6">
                <p className="text-xs font-bold" style={{ color: "#b8860b" }}>{c.meta}</p>
                <h3 className="tpl-display mt-1 text-2xl font-bold text-white">{c.title}</h3>
                <p className="mt-2 text-lg font-bold" style={{ color: "#b8860b" }}>{c.price}</p>
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
    <section className="tpl-sweep overflow-hidden border-y py-5" style={{ borderColor: "rgba(245,240,230,0.12)", background: "#1a1814" }}>
      <div className="tpl-marquee-track gap-12 px-6 text-sm font-bold tracking-[0.22em]" style={{ color: "#b8860b" }}>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,240,230,0.12)", background: "#2a2620" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#b8860b" }}>נכסים</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold md:text-5xl">נכסים נבחרים</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <article key={c.title} className="tpl-climb tpl-glass group overflow-hidden border" style={{ borderColor: "rgba(245,240,230,0.12)", animationDelay: `${i * 0.08}s` }}>
              <div className="relative overflow-hidden">
                <img src={c.img} alt="" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="tpl-glow absolute inset-0 opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold" style={{ color: "#b8860b" }}>{c.meta}</p>
                <h3 className="tpl-display mt-1 text-xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm leading-6" style={{ color: "#b8a898" }}>{c.text}</p>
                <p className="mt-3 text-lg font-bold" style={{ color: "#b8860b" }}>{c.price}</p>
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
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(245,240,230,0.12)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 text-center">
        {stats.map(([vk, lk], i) => (
          <div key={lk} className="tpl-climb tpl-shimmer border p-6" style={{ borderColor: "rgba(245,240,230,0.12)", animationDelay: `${i * 0.1}s` }}>
            <div className="tpl-display text-4xl font-bold md:text-5xl" style={{ color: "#b8860b" }}>{v(data, vk)}</div>
            <p className="mt-2 text-sm font-semibold" style={{ color: "#b8a898" }}>{v(data, lk)}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,240,230,0.12)", background: "#2a2620" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#b8860b" }}>תהליך</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold">איך אנחנו עובדים</h2>
        <div className="tpl-line-draw mt-10 h-px w-full" style={{ background: "#b8860b" }} />
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map(([title, desc], i) => (
            <div key={title} className="tpl-climb border-t pt-5" style={{ borderColor: "#b8860b", animationDelay: `${i * 0.1}s` }}>
              <span className="tpl-display text-3xl font-bold" style={{ color: "#b8860b" }}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-7" style={{ color: "#b8a898" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(245,240,230,0.12)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#b8860b" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#b8a898" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="min-h-[360px] overflow-hidden"><img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,240,230,0.12)", background: "#2a2620" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#b8860b" }}>יצירת קשר</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#b8a898" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#b8a898" }}>
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
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(245,240,230,0.12)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#b8a898" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#f5f0e6" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <StampSteps data={data} />
      <ListingSpotlight data={data} />
      <ParallaxShowcase data={data} />
      <MarketInsights data={data} />
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
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,240,230,0.12)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#b8860b" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function SignetPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...signetDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: (
      <>
        <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,240,230,0.12)" }}>
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#b8860b" }}>{v(merged, "brandName")}</p>
            <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(merged, "contactTitle")}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "#b8a898" }}>{v(merged, "contactText")}</p>
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
    pageContent["process"] = (
      <InnerPage data={merged} title="תהליך" onCta={() => goTo("contact")}>
        <>
          <StampSteps data={merged} />
      <ProcessTimeline data={merged} />
      <FaqBlock data={merged} />
      <StatsRow data={merged} />
      <CtaBand data={merged} onCta={() => goTo("contact")} />
        </>
      </InnerPage>
    );
    pageContent["listings"] = (
      <InnerPage data={merged} title="נכסים" onCta={() => goTo("contact")}>
        <>
          <ListingSpotlight data={merged} />
      <FeaturedListings data={merged} />
      <ParallaxShowcase data={merged} />
      <TrustBadges data={merged} />
      <CtaBand data={merged} onCta={() => goTo("contact")} />
        </>
      </InnerPage>
    );
    pageContent["about"] = (
      <InnerPage data={merged} title="אודות" onCta={() => goTo("contact")}>
        <>
          <AboutBlock data={merged} />
      <AgentGrid data={merged} />
      <TestimonialsBlock data={merged} />
      <StampSteps data={merged} />
      <AwardsStrip data={merged} />
        </>
      </InnerPage>
    );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "signet-preview" : "signet"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#1a1814", color: "#f5f0e6" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
