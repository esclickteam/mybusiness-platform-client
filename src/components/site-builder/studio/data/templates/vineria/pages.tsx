import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { vineriaDefaultData } from "./defaultData";
import { vineriaEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const vineriaPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "wines", label: "יינות", slug: "/wines" },
  { id: "tasting", label: "טעימות", slug: "/tasting" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = vineriaPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (vineriaDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = vineriaPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{ background: "#1a1218f5", borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-5">
        <button type="button" onClick={() => goTo("home")} className="tpl-display text-3xl font-semibold tracking-[0.12em]">{v(data, "brandName")}</button>
        <nav className="flex flex-wrap items-center justify-center gap-5">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-xs font-medium tracking-[0.22em] uppercase"
              style={{ color: currentPage === id ? "#9b2335" : "#a8959a" }}>{label}</button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <div className="tpl-depth-1 absolute inset-0">
          <img src={v(data, "heroImage")} alt="" className="h-full w-full object-cover opacity-70" />
        </div>
        <div className="tpl-depth-2 absolute inset-x-0 bottom-0 h-[50%]" style={{ background: "linear-gradient(180deg, transparent, #0c080c)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #1a121855, #1a1218ee)" }} />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-4xl flex-col items-center justify-center px-5 pt-28 text-center">
          <p className="tpl-rise text-xs font-semibold tracking-[0.4em]" style={{ color: "#9b2335" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-6 text-5xl font-semibold leading-[1.05] md:text-7xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-lg text-lg leading-8" style={{ color: "#a8959a" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-10 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={onCta} className="px-8 py-3.5 text-sm font-semibold tracking-wider" style={{ background: "#9b2335", color: "#f5ebe0" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("wines")} className="border px-8 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(245,235,224,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </section>
  );
}


function TastingTimeline({ data }: { data: Record<string, any> }) {
  const notes = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-4xl font-semibold md:text-5xl">הערות טעימה</h2></Reveal>
        <div className="relative mt-12">
          <div className="absolute right-3 top-0 bottom-0 w-px" style={{ background: "rgba(245,235,224,0.12)" }} />
          {notes.map(([title, meta, text], i) => (
            <Reveal key={title} delayMs={i * 100} variant="right">
              <div className="relative grid gap-2 pb-10 pr-12">
                <div className="absolute right-1.5 top-1 h-3 w-3 rounded-full border-2" style={{ borderColor: "#9b2335", background: "#1a1218" }} />
                <p className="text-xs tracking-[0.2em]" style={{ color: "#9b2335" }}>{meta}</p>
                <h3 className="tpl-display text-2xl font-semibold">{title}</h3>
                <p className="text-sm leading-7" style={{ color: "#a8959a" }}>{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CorkBadges({ data }: { data: Record<string, any> }) {
  const corks = ["אדום", "לבן", "מבעבע", "טבעי"];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-5">
        {corks.map((c, i) => (
          <Reveal key={c} delayMs={i * 70} variant="scale">
            <div className="tpl-cork flex h-16 w-12 items-center justify-center rounded-sm text-[10px] font-bold tracking-wider" style={{ background: "#c4a574", color: "#0c080c", animationDelay: `${i * 0.3}s` }}>{c}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto max-w-3xl border px-8 py-12 text-center" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
        <p className="text-xs tracking-[0.4em]" style={{ color: "#9b2335" }}>LETTERPRESS</p>
        <h2 className="tpl-display mt-5 text-4xl font-semibold md:text-5xl">{v(data, "aboutTitle")}</h2>
        <div className="mx-auto mt-6 h-px w-24" style={{ background: "#9b2335" }} />
        <p className="mt-6 text-lg leading-8" style={{ color: "#a8959a" }}>{v(data, "aboutText")}</p>
        <img src={v(data, "aboutImage")} alt="" className="mx-auto mt-8 aspect-[21/9] w-full max-w-lg object-cover opacity-90" />
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-2">
        <div className="text-center lg:text-right">
          <p className="text-xs tracking-[0.34em]" style={{ color: "#9b2335" }}>RESERVATION</p>
          <h2 className="tpl-display mt-4 text-4xl font-semibold">{v(data, "contactTitle")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#a8959a" }}>{v(data, "contactText")}</p>
          <p className="mt-6 text-sm" style={{ color: "#a8959a" }}>{v(data, "phone")} · {v(data, "email")}</p>
        </div>
        <form className="grid gap-4 border p-6" style={{ borderColor: "rgba(245,235,224,0.12)" }} onSubmit={(e) => e.preventDefault()}>
          <input className="w-full border-b bg-transparent px-2 py-3 text-right outline-none" style={{ borderColor: "rgba(245,235,224,0.12)" }} placeholder="שם מלא" />
          <input className="w-full border-b bg-transparent px-2 py-3 text-right outline-none" style={{ borderColor: "rgba(245,235,224,0.12)" }} placeholder="טלפון" />
          <input className="w-full border-b bg-transparent px-2 py-3 text-right outline-none" style={{ borderColor: "rgba(245,235,224,0.12)" }} placeholder="תאריך מועדף" />
          <button type="button" onClick={onCta} className="mt-2 px-6 py-3 text-sm font-semibold tracking-wider" style={{ background: "#9b2335", color: "#f5ebe0" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-10 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4">
        <div className="tpl-stamp border-2 px-4 py-2 text-xs font-bold tracking-[0.3em]" style={{ borderColor: "#9b2335", color: "#9b2335" }}>EST. CELLAR</div>
        <span className="tpl-display text-xl font-semibold">{v(data, "brandName")}</span>
        <span className="text-sm" style={{ color: "#a8959a" }}>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <TastingTimeline data={data} />
      <CorkBadges data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#9b2335" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function VineriaPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...vineriaDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of vineriaPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <TastingTimeline data={merged} />
        <CorkBadges data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "vineria-preview" : "vineria"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#1a1218", color: "#f5ebe0" }}>
      <style dangerouslySetInnerHTML={{ __html: vineriaEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
