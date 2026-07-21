import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { azurelineDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const azurelinePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "fleet", label: "צי", slug: "/fleet" },
  { id: "routes", label: "מסלולים", slug: "/routes" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = azurelinePages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (azurelineDefaultData as Record<string, any>)[key] ?? "";
}
function cx(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = azurelinePages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#f8fcfff2", borderColor: "rgba(10,37,64,0.1)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#0066cc", color: "#ffffff" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#0a2540" : "#5a7a96" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#0066cc", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(10,37,64,0.1)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(10,37,64,0.1)" }}>
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
      <input className={field} style={{ borderColor: "rgba(10,37,64,0.1)", color: "#0a2540" }} placeholder="שם מלא" />
      <input className={field} style={{ borderColor: "rgba(10,37,64,0.1)", color: "#0a2540" }} placeholder="טלפון" />
      <input className={field} style={{ borderColor: "rgba(10,37,64,0.1)", color: "#0a2540" }} placeholder="אימייל" />
      <textarea className={cx(field, "min-h-28")} style={{ borderColor: "rgba(10,37,64,0.1)", color: "#0a2540" }} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#0066cc", color: "#ffffff" }}>{v(data, "cta")}</button>
    </form>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-28" style={{ background: "#f8fcff" }}>
        <div className="mx-auto max-w-4xl text-center">
          <p className="tpl-rise text-xs font-semibold tracking-[0.34em]" style={{ color: "#0066cc" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-6 text-5xl font-bold leading-[1.02] md:text-7xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mx-auto mt-6 max-w-xl text-lg leading-8" style={{ color: "#5a7a96" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#0066cc", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("fleet")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(10,37,64,0.1)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="tpl-horizon" style={{ background: "#0066cc" }} />
          {[0, 1, 2].map((i) => (
            <div key={i} className="tpl-ripple absolute left-1/2 top-1/2 rounded-full border-2" style={{ width: "80px", height: "80px", marginLeft: "-40px", marginTop: "-40px", borderColor: "#0066cc", animationDelay: `${i * 1.1}s` }} />
          ))}
          <img src={v(data, "heroImage")} alt="" className="tpl-ken mt-8 aspect-[21/9] w-full object-cover" />
        </div>
      </section>
  );
}


function RouteDots({ data }: { data: Record<string, any> }) {
  const routes = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(10,37,64,0.1)" }}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">מסלולי הפלגה</h2>
        <div className="relative mt-12">
          <div className="absolute right-4 top-0 bottom-0 w-px" style={{ background: "rgba(10,37,64,0.1)" }} />
          {routes.map(([title, meta, text], i) => (
            <div key={title} className="tpl-climb relative grid gap-4 pb-10 pr-12 md:grid-cols-[1fr_2fr]" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="absolute right-[11px] top-2 h-3 w-3 rounded-full border-2" style={{ borderColor: "#0066cc", background: "#f8fcff" }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: "#0066cc" }}>{meta}</p>
                <h3 className="tpl-display mt-1 text-2xl font-bold">{title}</h3>
              </div>
              <p className="text-sm leading-7" style={{ color: "#5a7a96" }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(10,37,64,0.1)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#0066cc" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#5a7a96" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="min-h-[360px] overflow-hidden"><img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(10,37,64,0.1)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#0066cc" }}>יצירת קשר</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#5a7a96" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#5a7a96" }}>
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
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(10,37,64,0.1)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#5a7a96" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#0a2540" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <RouteDots data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(10,37,64,0.1)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#0066cc" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function AzurelinePages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...azurelineDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of azurelinePages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <RouteDots data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "azureline-preview" : "azureline"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#f8fcff", color: "#0a2540" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
