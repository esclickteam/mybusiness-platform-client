import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { estateoDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const estateoPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "estates", label: "אחוזות", slug: "/estates" },
  { id: "private", label: "פרטי", slug: "/private" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = estateoPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (estateoDefaultData as Record<string, any>)[key] ?? "";
}
function cx(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = estateoPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#100e0cf2", borderColor: "rgba(244,236,223,0.14)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#d4af6a", color: "#100e0c" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#f4ecdf" : "#a89880" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#d4af6a", color: "#100e0c" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(244,236,223,0.14)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(244,236,223,0.14)" }}>
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
      <input className={field} style={{ borderColor: "rgba(244,236,223,0.14)", color: "#f4ecdf" }} placeholder="שם מלא" />
      <input className={field} style={{ borderColor: "rgba(244,236,223,0.14)", color: "#f4ecdf" }} placeholder="טלפון" />
      <input className={field} style={{ borderColor: "rgba(244,236,223,0.14)", color: "#f4ecdf" }} placeholder="אימייל" />
      <textarea className={cx(field, "min-h-28")} style={{ borderColor: "rgba(244,236,223,0.14)", color: "#f4ecdf" }} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#d4af6a", color: "#100e0c" }}>{v(data, "cta")}</button>
    </form>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative grid min-h-[88vh] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative z-10 flex flex-col justify-between border-b p-8 lg:border-b-0 lg:border-l lg:p-12" style={{ borderColor: "rgba(244,236,223,0.14)", background: "#100e0c" }}>
          <div>
            <p className="tpl-rise text-xs font-semibold tracking-[0.3em]" style={{ color: "#d4af6a" }}>{v(data, "heroEyebrow")}</p>
            <div className="tpl-draw mt-6 h-px w-28" style={{ background: "#d4af6a" }} />
            <h1 className="tpl-display tpl-rise-2 mt-8 text-6xl font-bold leading-[0.92] md:text-7xl lg:text-8xl">{v(data, "heroTitle")}</h1>
          </div>
          <div className="tpl-rise-3 mt-10">
            <p className="max-w-md text-lg leading-8" style={{ color: "#a89880" }}>{v(data, "heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#d4af6a", color: "#100e0c" }}>{v(data, "heroPrimary")}</button>
              <button type="button" onClick={() => goTo("estates")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(244,236,223,0.14)" }}>{v(data, "heroSecondary")}</button>
            </div>
          </div>
        </div>
        <div className="relative min-h-[48vh] overflow-hidden lg:min-h-[88vh]">
          <img src={v(data, "heroImage")} alt="" className="tpl-ken h-full w-full object-cover" />
          <div className="absolute bottom-8 left-8 right-8 border p-5 backdrop-blur-md tpl-float" style={{ borderColor: "#d4af6a", background: "#100e0ccc" }}>
            <p className="text-xs tracking-[0.24em]" style={{ color: "#d4af6a" }}>PRIVATE ACCESS</p>
            <p className="tpl-display mt-2 text-2xl font-bold">תיק נכסים סגור</p>
          </div>
        </div>
      </section>
  );
}

function ItemsList({ data }: { data: Record<string, any> }) {
  const items = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(244,236,223,0.14)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#d4af6a" }}>{v(data, "brandName")}</p>
        <h2 className="tpl-display mt-3 text-4xl font-bold md:text-5xl">נכסים נבחרים</h2>
        <div className="mt-10">
          {items.map(([title, meta, text]) => (
            <div key={title} className="grid gap-3 border-t py-8 md:grid-cols-[1.2fr_0.6fr_1.2fr] md:items-baseline" style={{ borderColor: "rgba(244,236,223,0.14)" }}>
              <h3 className="tpl-display text-2xl font-bold">{title}</h3>
              <p className="text-sm font-semibold" style={{ color: "#d4af6a" }}>{meta}</p>
              <p className="text-base leading-7" style={{ color: "#a89880" }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(244,236,223,0.14)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#d4af6a" }}>אודות</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(244,236,223,0.14)", background: "#1a1612" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#d4af6a" }}>יצירת קשר</p>
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
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(244,236,223,0.14)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#a89880" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#f4ecdf" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <ItemsList data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(244,236,223,0.14)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#d4af6a" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function EstateoPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...estateoDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of estateoPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : <ItemsList data={merged} />}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "estateo-preview" : "estateo"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#100e0c", color: "#f4ecdf" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
