import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { spiceforgeDefaultData } from "./defaultData";
import { spiceforgeEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const spiceforgePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "thali", label: "תאלי", slug: "/thali" },
  { id: "spices", label: "תבלינים", slug: "/spices" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = spiceforgePages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (spiceforgeDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = spiceforgePages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 px-4 pt-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 border-2 px-5 py-3 lg:px-8"
        style={{ background: "#2a1810", borderColor: "#e76f51", borderImage: "none" }}>
        <button type="button" onClick={() => goTo("home")} className="tpl-display text-xl font-bold">{v(data, "brandName")}</button>
        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="border-b-2 text-sm font-semibold"
              style={{ borderColor: currentPage === id ? "#e76f51" : "transparent", color: "#fff1e0" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="px-5 py-2 text-sm font-bold" style={{ background: "#e76f51", color: "#1a0f0a" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <img src={v(data, "heroImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0e080599, #1a0f0af0)" }} />
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="tpl-spice pointer-events-none absolute h-2 w-2 rounded-sm" style={{ left: `${3 + i * 6}%`, top: `-2%`, background: ["#e76f51", "#e9c46a", "#f4a261", "#9b2226"][i % 4], animationDelay: `${i * 0.4}s`, ["--spice-dur" as string]: `${7 + (i % 5)}s` }} />
        ))}
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pt-28 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#e76f51" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-5xl font-bold leading-[0.95] md:text-7xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#c4a08a" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#e76f51", color: "#1a0f0a" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("thali")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(255,241,224,0.14)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </section>
  );
}


function SpiceWheelMenu({ data }: { data: Record<string, any> }) {
  const cards = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(255,241,224,0.14)", background: "#2a1810" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">גלגל התבלינים</h2></Reveal>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[280px_1fr]">
          <div className="tpl-spice-wheel mx-auto h-56 w-56 rounded-full border-4 p-8" style={{ borderColor: "#1a0f0a" }}>
            <div className="flex h-full w-full items-center justify-center rounded-full text-center text-sm font-bold" style={{ background: "#1a0f0a" }}>THALI</div>
          </div>
          <div className="grid gap-4">
            {cards.map(([title, meta, text], i) => (
              <Reveal key={title} delayMs={i * 90} variant="right">
                <div className="border-r-4 pr-4" style={{ borderColor: "#e76f51" }}>
                  <p className="text-xs" style={{ color: "#e76f51" }}>{meta}</p>
                  <h3 className="tpl-display mt-1 text-2xl font-bold">{title}</h3>
                  <p className="mt-1 text-sm" style={{ color: "#c4a08a" }}>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SpiralRecipe({ data }: { data: Record<string, any> }) {
  const steps = [["1", "לטגן בצל"], ["2", "להוסיף מסאלה"], ["3", "לבשל לאט"], ["4", "להגיש חם"]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
        {steps.map(([n, label], i) => (
          <Reveal key={n} delayMs={i * 80} variant="scale">
            <div className="tpl-spiral-step border px-5 py-4 text-center" style={{ borderColor: "rgba(255,241,224,0.14)", background: "#2a1810", animationDelay: `${i * 0.1}s`, transform: `rotate(${(i - 1.5) * 4}deg)` }}>
              <div className="text-2xl font-bold" style={{ color: "#e76f51" }}>{n}</div>
              <p className="mt-1 text-sm">{label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t overflow-hidden" style={{ borderColor: "rgba(255,241,224,0.14)", background: "linear-gradient(135deg, #2a1810, #3d2314)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#e76f51" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#c4a08a" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="relative min-h-[320px]">
          <img src={v(data, "aboutImage")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 70% 40%, #e9c46a55, transparent 50%)" }} />
        </div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <div className="mx-auto flex max-w-lg flex-col items-center">
        <div className="relative flex h-80 w-80 flex-col items-center justify-center rounded-full border-4 p-8 text-center" style={{ borderColor: "#e76f51", background: "#2a1810" }}>
          <h2 className="tpl-display text-2xl font-bold">{v(data, "contactTitle")}</h2>
          <p className="mt-2 text-xs" style={{ color: "#c4a08a" }}>{v(data, "contactText")}</p>
          <form className="mt-4 grid w-full gap-2" onSubmit={(e) => e.preventDefault()}>
            <input className="w-full rounded-full border bg-transparent px-3 py-2 text-center text-sm outline-none" style={{ borderColor: "rgba(255,241,224,0.14)" }} placeholder="שם" />
            <input className="w-full rounded-full border bg-transparent px-3 py-2 text-center text-sm outline-none" style={{ borderColor: "rgba(255,241,224,0.14)" }} placeholder="טלפון" />
            <button type="button" onClick={onCta} className="rounded-full px-4 py-2 text-sm font-bold" style={{ background: "#e76f51", color: "#1a0f0a" }}>{v(data, "cta")}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm" style={{ color: "#c4a08a" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#fff1e0" }}>{v(data, "brandName")}</span>
        <div className="flex gap-2">{[0,1,2,3,4].map((i) => <span key={i} className="h-2 w-2 rounded-full" style={{ background: ["#e76f51", "#e9c46a", "#f4a261", "#9b2226", "#c4a08a"][i] }} />)}</div>
        <span>{v(data, "address")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <SpiceWheelMenu data={data} />
      <SpiralRecipe data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#e76f51" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function SpiceforgePages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...spiceforgeDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of spiceforgePages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <SpiceWheelMenu data={merged} />
        <SpiralRecipe data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "spiceforge-preview" : "spiceforge"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#1a0f0a", color: "#fff1e0" }}>
      <style dangerouslySetInnerHTML={{ __html: spiceforgeEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
