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
        {quotes.concat(quotes).map((q,i)=>(<blockquote key={i} className="whitespace-nowrap border px-6 py-3 text-lg" style={{ borderColor:"rgba(245,240,232,0.12)", color:"#a89880" }}>{q}</blockquote>))}
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
  };
  for (const pg of vaulturePages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <VaultCards data={merged} />
        <TestimonialStrip data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "vaulture-preview" : "vaulture"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#0c0a08", color: "#f5f0e8" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
