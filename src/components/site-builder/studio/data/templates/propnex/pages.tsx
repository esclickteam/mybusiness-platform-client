import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { propnexDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const propnexPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "listings", label: "נכסים", slug: "/listings" },
  { id: "neighborhoods", label: "שכונות", slug: "/neighborhoods" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = propnexPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (propnexDefaultData as Record<string, any>)[key] ?? "";
}
function cx(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = propnexPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#f4f6f9f2", borderColor: "rgba(17,24,39,0.1)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#2563eb", color: "#ffffff" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#111827" : "#6b7280" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#2563eb", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(17,24,39,0.1)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(17,24,39,0.1)" }}>
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
      <input className={field} style={{ borderColor: "rgba(17,24,39,0.1)", color: "#111827" }} placeholder="שם מלא" />
      <input className={field} style={{ borderColor: "rgba(17,24,39,0.1)", color: "#111827" }} placeholder="טלפון" />
      <input className={field} style={{ borderColor: "rgba(17,24,39,0.1)", color: "#111827" }} placeholder="אימייל" />
      <textarea className={cx(field, "min-h-28")} style={{ borderColor: "rgba(17,24,39,0.1)", color: "#111827" }} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#2563eb", color: "#ffffff" }}>{v(data, "cta")}</button>
    </form>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="px-5 py-16 lg:px-8 lg:py-20" style={{ background: "#f4f6f9" }}>
        <div className="mx-auto max-w-7xl tpl-bento">
          <div className="col-span-4 overflow-hidden border p-6 md:col-span-3 md:row-span-2" style={{ borderColor: "rgba(17,24,39,0.1)", background: "#ffffff" }}>
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#2563eb" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#6b7280" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#2563eb", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("listings")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(17,24,39,0.1)" }}>{v(data, "heroSecondary")}</button>
          </div>
          </div>
          <div className="col-span-2 overflow-hidden md:col-span-3"><img src={v(data, "heroImage")} alt="" className="tpl-ken h-full min-h-[280px] w-full object-cover" /></div>
          <div className="col-span-2 border p-4 md:col-span-2" style={{ borderColor: "rgba(17,24,39,0.1)" }}><img src={v(data, "item1Image")} alt="" className="aspect-video w-full object-cover" /></div>
          <div className="col-span-2 border p-4 md:col-span-1" style={{ borderColor: "rgba(17,24,39,0.1)", background: "#2563eb", color: "#ffffff" }}>
            <p className="text-xs font-bold">STAT</p><p className="tpl-display text-3xl font-bold">{v(data, "stat1Value")}</p><p className="text-sm">{v(data, "stat1Label")}</p>
          </div>
        </div>
      </section>
  );
}


function BentoShowcase({ data }: { data: Record<string, any> }) {
  const items = [1,2,3,4].map((i) => [v(data,`item${i}Title`), v(data,`item${i}Price`), v(data,`item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(17,24,39,0.1)" }}>
      <div className="mx-auto max-w-7xl tpl-bento">
        {items.map(([title, price, img], i) => (
          <article key={title} className="overflow-hidden border p-3" style={{ borderColor:"rgba(17,24,39,0.1)", gridColumn: i===0?"span 3":"span 2", background:"#ffffff" }}>
            <img src={img} alt="" className="aspect-video w-full object-cover" />
            <h3 className="tpl-display mt-3 text-xl font-bold">{title}</h3><p style={{ color:"#2563eb" }}>{price}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
function NeighborhoodMarquee({ data }: { data: Record<string, any> }) {
  const tags = ["נווה צדק","פlorian","רamat aviv","יפו","שרona"];
  return (
    <section className="tpl-sweep overflow-hidden border-y py-3" style={{ borderColor:"rgba(17,24,39,0.1)", background:"#ffffff" }}>
      <div className="tpl-marquee-track gap-8 px-4 text-sm font-bold tracking-[0.2em]" style={{ color:"#2563eb" }}>
        {tags.concat(tags).map((t,i)=><span key={`tag-${i}`} className="whitespace-nowrap">{t} ·</span>)}
      </div>
    </section>
  );
}
function ProcessSteps({ data }: { data: Record<string, any> }) {
  const steps = ["מיפוי דרישות","סינון נכסים","סיורים ממוקדים","סגירת עסקה"];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor:"rgba(17,24,39,0.1)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="tpl-line-draw mb-8 h-px w-full" style={{ background:"#2563eb" }} />
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((s,i)=>(<div key={s} className="tpl-climb border-t pt-4" style={{ borderColor:"#2563eb", animationDelay:`${`${i*0.1}s` })[2:-4]}s` }}><span className="text-2xl font-bold" style={{ color:"#2563eb" }}>0{i+1}</span><p className="mt-2 font-semibold">{s}</p></div>))}
        </div>
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(17,24,39,0.1)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#2563eb" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#6b7280" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="min-h-[360px] overflow-hidden"><img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(17,24,39,0.1)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#2563eb" }}>יצירת קשר</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#6b7280" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#6b7280" }}>
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
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(17,24,39,0.1)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#6b7280" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#111827" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <BentoShowcase data={data} />
      <NeighborhoodMarquee data={data} />
      <ProcessSteps data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(17,24,39,0.1)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#2563eb" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function PropnexPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...propnexDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of propnexPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <BentoShowcase data={merged} />
        <NeighborhoodMarquee data={merged} />
        <ProcessSteps data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "propnex-preview" : "propnex"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#f4f6f9", color: "#111827" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
