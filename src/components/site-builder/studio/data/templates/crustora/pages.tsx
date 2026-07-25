import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { crustoraDefaultData } from "./defaultData";
import { crustoraEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const crustoraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "pizzas", label: "פיצות", slug: "/pizzas" },
  { id: "oven", label: "התנור", slug: "/oven" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = crustoraPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (crustoraDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = crustoraPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{ background: "#faf4ebf5", borderColor: "rgba(42,24,16,0.12)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="group text-right">
          <span className="tpl-display text-2xl font-black tracking-tight">{v(data, "brandName")}</span>
          <span className="tpl-stretch-under mt-1 block h-1 w-full" style={{ background: "#c1121f" }} />
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-bold uppercase tracking-wide"
              style={{ color: currentPage === id ? "#c1121f" : "#8b6b52" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="px-5 py-2.5 text-sm font-bold" style={{ background: "#c1121f", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="grid min-h-[88vh] lg:grid-cols-2" style={{ background: "#faf4eb" }}>
        <div className="relative flex flex-col justify-center px-5 py-16 lg:px-12" style={{ clipPath: "polygon(0 0, 100% 0, 88% 100%, 0 100%)" }}>
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#c1121f" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 text-5xl font-black leading-[0.95] md:text-7xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-md text-lg leading-8" style={{ color: "#8b6b52" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#c1121f", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("pizzas")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(42,24,16,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
        <div className="relative flex items-center justify-center overflow-hidden py-12" style={{ background: "#ffffff" }}>
          <div className="tpl-pizza-spin h-64 w-64 overflow-hidden rounded-full border-8 shadow-2xl md:h-80 md:w-80" style={{ borderColor: "#c1121f" }}>
            <img src={v(data, "heroImage")} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
  );
}


function TriMasonryMenu({ data }: { data: Record<string, any> }) {
  const cards = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(42,24,16,0.12)", background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-black md:text-5xl">משולשי תפריט</h2></Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {cards.map(([title, meta, text, img], i) => (
            <Reveal key={title} delayMs={i * 100} variant="up">
              <article className="text-center">
                <div className="tpl-tri-card mx-auto aspect-square max-w-[220px] overflow-hidden bg-black">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
                <p className="mt-4 text-xs font-bold" style={{ color: "#c1121f" }}>{meta}</p>
                <h3 className="tpl-display mt-1 text-2xl font-black">{title}</h3>
                <p className="mt-2 text-sm" style={{ color: "#8b6b52" }}>{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OvenHeatStrip({ data }: { data: Record<string, any> }) {
  return (
    <section className="tpl-heat-shimmer relative overflow-hidden border-y py-10" style={{ borderColor: "rgba(42,24,16,0.12)", background: `linear-gradient(90deg, #c1121f22, #ffffff, #c1121f22)` }}>
      <Reveal>
        <p className="text-center tpl-display text-2xl font-black md:text-3xl">450° · 90 שניות · תנור עצים</p>
      </Reveal>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative border-t overflow-hidden px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(42,24,16,0.12)" }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="tpl-flour pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-white/70" style={{ left: `${8 + i * 7}%`, top: `-2%`, animationDelay: `${i * 0.45}s`, ["--flour-dur" as string]: `${7 + (i % 4)}s` }} />
      ))}
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-bold tracking-[0.24em]" style={{ color: "#c1121f" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-black md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#8b6b52" }}>{v(data, "aboutText")}</p>
        </div>
        <img src={v(data, "aboutImage")} alt="" className="aspect-[4/3] w-full object-cover border" style={{ borderColor: "rgba(42,24,16,0.12)" }} />
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(42,24,16,0.12)", background: "#ffffff" }}>
      <div className="mx-auto max-w-lg">
        <div className="relative border-2 bg-white p-6 shadow-lg" style={{ borderColor: "#1a0e0a", borderStyle: "dashed" }}>
          <p className="text-center text-xs font-black tracking-[0.3em]">ORDER TICKET</p>
          <h2 className="tpl-display mt-3 text-center text-3xl font-black">{v(data, "contactTitle")}</h2>
          <p className="mt-3 text-center text-sm" style={{ color: "#8b6b52" }}>{v(data, "contactText")}</p>
          <form className="mt-6 grid gap-3" onSubmit={(e) => e.preventDefault()}>
            <input className="border-b bg-transparent px-2 py-3 text-right outline-none" style={{ borderColor: "rgba(42,24,16,0.12)" }} placeholder="שם" />
            <input className="border-b bg-transparent px-2 py-3 text-right outline-none" style={{ borderColor: "rgba(42,24,16,0.12)" }} placeholder="כתובת" />
            <input className="border-b bg-transparent px-2 py-3 text-right outline-none" style={{ borderColor: "rgba(42,24,16,0.12)" }} placeholder="טלפון" />
            <button type="button" onClick={onCta} className="mt-2 px-6 py-3 text-sm font-bold" style={{ background: "#c1121f", color: "#ffffff" }}>{v(data, "cta")}</button>
          </form>
          <p className="mt-4 text-center text-xs" style={{ color: "#8b6b52" }}>{v(data, "address")}</p>
        </div>
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="relative px-5 py-10 lg:px-8" style={{ background: "#c1121f", color: "#ffffff" }}>
      <div className="absolute inset-x-0 -top-3 h-3" style={{ background: `radial-gradient(circle at 10px 0, transparent 8px, #c1121f 9px)`, backgroundSize: "20px 12px" }} />
      <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm md:flex-row md:justify-between">
        <span className="tpl-display text-lg font-black">{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <TriMasonryMenu data={data} />
      <OvenHeatStrip data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(42,24,16,0.12)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#c1121f" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function CrustoraPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...crustoraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of crustoraPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <TriMasonryMenu data={merged} />
        <OvenHeatStrip data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "crustora-preview" : "crustora"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#faf4eb", color: "#2a1810" }}>
      <style dangerouslySetInnerHTML={{ __html: crustoraEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
