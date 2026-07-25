import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { sushisenDefaultData } from "./defaultData";
import { sushisenEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const sushisenPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "omakase", label: "אומאקאסה", slug: "/omakase" },
  { id: "nigiri", label: "ניגירי", slug: "/nigiri" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = sushisenPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (sushisenDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = sushisenPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{ background: "#0b0b0b", borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="tpl-display text-lg font-semibold tracking-[0.2em]">{v(data, "brandName")}</button>
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-xs font-medium tracking-[0.18em] uppercase"
              style={{ color: currentPage === id ? "#d4af37" : "#9a958c" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="border px-4 py-1.5 text-xs font-semibold tracking-wider" style={{ borderColor: "#d4af37", color: "#d4af37" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative min-h-[88vh] overflow-hidden" style={{ background: "#0b0b0b" }}>
        <div className="absolute inset-x-0 top-[30%] overflow-hidden border-y py-4" style={{ borderColor: "#d4af3744", background: "#161616" }}>
          <div className="tpl-conveyor">
            {[v(data, "heroImage"), v(data, "item1Image"), v(data, "item2Image"), v(data, "item3Image"), v(data, "heroImage"), v(data, "item1Image")].map((src, i) => (
              <div key={i} className="h-36 w-48 flex-shrink-0 overflow-hidden md:h-44 md:w-64">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.34em]" style={{ color: "#d4af37" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-3xl text-6xl font-bold leading-[0.92] md:text-7xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#9a958c" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#d4af37", color: "#0b0b0b" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("omakase")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(242,240,234,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </section>
  );
}


function NigiriSnapRail({ data }: { data: Record<string, any> }) {
  const boards = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">מסילת ניגירי</h2></Reveal>
        <div className="tpl-nigiri-rail mt-10 pb-2">
          {boards.map(([title, meta, text, img], i) => (
            <article key={title} className="tpl-nigiri-card border p-3" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#0b0b0b", animationDelay: `${i * 0.5}s` }}>
              <img src={img} alt="" className="aspect-[4/3] w-full object-cover" />
              <p className="mt-3 text-xs tracking-wider" style={{ color: "#d4af37" }}>{meta}</p>
              <h3 className="tpl-display mt-1 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm" style={{ color: "#9a958c" }}>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WasabiStats({ data }: { data: Record<string, any> }) {
  const stats = [["12", "מושבים"], ["6:00", "דג טרי"], ["18", "מנות יום"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 text-center">
        {stats.map(([n, l], i) => (
          <Reveal key={l} delayMs={i * 80} variant="scale">
            <div className="tpl-wasabi mx-auto inline-block border px-6 py-5" style={{ borderColor: "#d4af37", animationDelay: `${i * 0.25}s` }}>
              <div className="tpl-display text-4xl font-bold" style={{ color: "#d4af37" }}>{n}</div>
              <p className="mt-2 text-xs tracking-wider" style={{ color: "#9a958c" }}>{l}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-20 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="h-72 w-56 overflow-hidden border" style={{ borderColor: "#d4af37" }}>
          <img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" />
        </div>
        <p className="mt-8 text-xs tracking-[0.34em]" style={{ color: "#d4af37" }}>אודות</p>
        <h2 className="tpl-display mt-3 text-4xl font-bold">{v(data, "aboutTitle")}</h2>
        <p className="mt-5 text-lg leading-8" style={{ color: "#9a958c" }}>{v(data, "aboutText")}</p>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#050505" }}>
      <div className="mx-auto max-w-xl border p-8" style={{ borderColor: "#d4af37" }}>
        <div className="mb-6 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }} />
        <h2 className="tpl-display text-center text-3xl font-bold">{v(data, "contactTitle")}</h2>
        <p className="mt-3 text-center text-sm" style={{ color: "#9a958c" }}>{v(data, "contactText")}</p>
        <form className="mt-8 grid gap-3" onSubmit={(e) => e.preventDefault()}>
          <input className="w-full border bg-transparent px-4 py-3 text-right outline-none" style={{ borderColor: "rgba(242,240,234,0.12)" }} placeholder="שם" />
          <input className="w-full border bg-transparent px-4 py-3 text-right outline-none" style={{ borderColor: "rgba(242,240,234,0.12)" }} placeholder="טלפון" />
          <button type="button" onClick={onCta} className="px-6 py-3 text-sm font-bold tracking-wider" style={{ background: "#d4af37", color: "#0b0b0b" }}>{v(data, "cta")}</button>
        </form>
        <div className="mt-6 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }} />
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="px-5 py-6 lg:px-8" style={{ background: "#0b0b0b" }}>
      <div className="mx-auto h-px max-w-7xl" style={{ background: "#d4af37" }} />
      <div className="mx-auto mt-4 flex max-w-7xl justify-between text-xs tracking-[0.2em]" style={{ color: "#9a958c" }}>
        <span>{v(data, "brandName")}</span>
        <span>{v(data, "email")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <NigiriSnapRail data={data} />
      <WasabiStats data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
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

export default function SushisenPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...sushisenDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of sushisenPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <NigiriSnapRail data={merged} />
        <WasabiStats data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "sushisen-preview" : "sushisen"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#0b0b0b", color: "#f2f0ea" }}>
      <style dangerouslySetInnerHTML={{ __html: sushisenEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
