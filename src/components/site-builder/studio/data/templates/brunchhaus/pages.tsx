import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { brunchhausDefaultData } from "./defaultData";
import { brunchhausEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const brunchhausPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "brunch", label: "בראנץ׳", slug: "/brunch" },
  { id: "coffee", label: "קפה", slug: "/coffee" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = brunchhausPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (brunchhausDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = brunchhausPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 bg-transparent">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3">
          <span className="tpl-sunny-logo grid h-12 w-12 place-items-center text-sm font-bold" style={{ color: "#3a2a1e" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-5 rounded-full border px-6 py-2 lg:flex" style={{ borderColor: "rgba(58,42,30,0.12)", background: "#ffffffcc" }}>
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#3a2a1e" : "#9a7b62" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="rounded-full px-5 py-2.5 text-sm font-bold" style={{ background: "#f4a261", color: "#3a2a1e" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative min-h-[88vh] overflow-hidden px-5 py-20 lg:px-8" style={{ background: "#fff8f0" }}>
        <div className="tpl-sun-rays pointer-events-none absolute -left-20 -top-20 h-[420px] w-[420px] opacity-40" style={{ background: `conic-gradient(from 0deg, transparent 0deg, #f4a26144 20deg, transparent 40deg, #f4a26133 60deg, transparent 80deg)` }} />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#f4a261" }}>{v(data, "heroEyebrow")}</p>
            <h1 className="tpl-display tpl-rise-2 mt-4 text-5xl font-bold leading-[1.02] md:text-7xl">{v(data, "heroTitle")}</h1>
            <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#9a7b62" }}>{v(data, "heroSubtitle")}</p>
            <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={onCta} className="rounded-full px-7 py-3.5 text-sm font-bold" style={{ background: "#f4a261", color: "#3a2a1e" }}>{v(data, "heroPrimary")}</button>
              <button type="button" onClick={() => goTo("brunch")} className="rounded-full border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(58,42,30,0.12)" }}>{v(data, "heroSecondary")}</button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border-8 border-white shadow-xl" style={{ borderColor: "#ffffff" }}>
            <img src={v(data, "heroImage")} alt="" className="tpl-ken aspect-[4/5] w-full object-cover" />
          </div>
        </div>
      </section>
  );
}


function PolaroidScatter({ data }: { data: Record<string, any> }) {
  const shots = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Image`)]);
  const rots = ["-6deg", "4deg", "-2deg"];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(58,42,30,0.12)", background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">רגעי בראנץ׳</h2></Reveal>
        <div className="mt-12 flex flex-wrap items-end justify-center gap-6">
          {shots.map(([title, meta, img], i) => (
            <Reveal key={title} delayMs={i * 90} variant="scale">
              <figure className="tpl-polaroid w-40 bg-white p-2 pb-8 shadow-lg md:w-48" style={{ ["--rot" as string]: rots[i], transform: `rotate(${rots[i]})` }}>
                <img src={img} alt="" className="aspect-square w-full object-cover" />
                <figcaption className="mt-2 text-center text-xs font-semibold" style={{ color: "#3a2a1e" }}>{title}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WeekendCalendar({ data }: { data: Record<string, any> }) {
  const days = [["ו׳", "08–15"], ["ש׳", "09–16"], ["א׳", "09–14"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(58,42,30,0.12)" }}>
      <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3">
        {days.map(([d, h], i) => (
          <Reveal key={d} delayMs={i * 70} variant="up">
            <div className="border p-4 text-center" style={{ borderColor: "rgba(58,42,30,0.12)", background: "#fff8f0" }}>
              <div className="tpl-display text-2xl font-bold" style={{ color: "#f4a261" }}>{d}</div>
              <p className="mt-1 text-sm" style={{ color: "#9a7b62" }}>{h}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(58,42,30,0.12)" }}>
      <div className="mx-auto max-w-2xl -rotate-1 border-2 border-dashed bg-white p-8 shadow-md" style={{ borderColor: "#f4a261", color: "#3a2a1e" }}>
        <p className="text-xs font-semibold tracking-[0.2em]" style={{ color: "#f4a261" }}>פתק מהשף</p>
        <h2 className="tpl-display mt-4 text-3xl font-bold md:text-4xl">{v(data, "aboutTitle")}</h2>
        <p className="mt-5 text-lg leading-8" style={{ color: "#9a7b62" }}>{v(data, "aboutText")}</p>
        <img src={v(data, "aboutImage")} alt="" className="mt-6 aspect-[16/9] w-full object-cover" />
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(58,42,30,0.12)", background: "#ffffff" }}>
      <div className="mx-auto max-w-md rotate-1 border bg-[#fffdf8] p-6 shadow-xl" style={{ borderColor: "rgba(58,42,30,0.12)" }}>
        <p className="text-center text-xs tracking-[0.3em]" style={{ color: "#f4a261" }}>POSTCARD</p>
        <h2 className="tpl-display mt-3 text-center text-3xl font-bold">{v(data, "contactTitle")}</h2>
        <p className="mt-3 text-center text-sm" style={{ color: "#9a7b62" }}>{v(data, "contactText")}</p>
        <form className="mt-6 grid gap-3" onSubmit={(e) => e.preventDefault()}>
          <input className="border-b bg-transparent px-2 py-2 text-right outline-none" style={{ borderColor: "rgba(58,42,30,0.12)" }} placeholder="שם" />
          <input className="border-b bg-transparent px-2 py-2 text-right outline-none" style={{ borderColor: "rgba(58,42,30,0.12)" }} placeholder="טלפון" />
          <textarea className="min-h-20 border bg-transparent px-3 py-2 text-right outline-none" style={{ borderColor: "rgba(58,42,30,0.12)" }} placeholder="הודעה קצרה" />
          <button type="button" onClick={onCta} className="rounded-full px-6 py-3 text-sm font-bold" style={{ background: "#f4a261", color: "#3a2a1e" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="tpl-napkin-dot border-t px-5 py-10 lg:px-8" style={{ borderColor: "rgba(58,42,30,0.12)", background: "#fff8f0" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-sm" style={{ color: "#9a7b62" }}>
        <span className="tpl-display text-xl font-bold" style={{ color: "#3a2a1e" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <PolaroidScatter data={data} />
      <WeekendCalendar data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(58,42,30,0.12)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#f4a261" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function BrunchhausPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...brunchhausDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of brunchhausPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <PolaroidScatter data={merged} />
        <WeekendCalendar data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "brunchhaus-preview" : "brunchhaus"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#fff8f0", color: "#3a2a1e" }}>
      <style dangerouslySetInnerHTML={{ __html: brunchhausEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
