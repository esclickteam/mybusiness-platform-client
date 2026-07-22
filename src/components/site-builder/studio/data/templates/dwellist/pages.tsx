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
  };
  for (const pg of dwellistPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <HotspotCards data={merged} />
        <CompareStrip data={merged} />
        <MortgageVisual data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "dwellist-preview" : "dwellist"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#faf8f5", color: "#2c2419" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
