import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { streetbiteDefaultData } from "./defaultData";
import { streetbiteEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const streetbitePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "trucks", label: "משאיות", slug: "/trucks" },
  { id: "spots", label: "נקודות", slug: "/spots" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = streetbitePages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (streetbiteDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = streetbitePages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50" style={{ background: "transparent" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="-rotate-2 border-2 px-4 py-2 shadow-[4px_4px_0_0_#39d353]"
          style={{ background: "#161b22", borderColor: "#39d353" }}>
          <span className="tpl-display text-lg font-black">{v(data, "logoText")} · {v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-3 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="rotate-1 border px-3 py-1.5 text-xs font-bold"
              style={{ borderColor: "rgba(230,237,243,0.12)", background: currentPage === id ? "#39d353" : "#161b22", color: currentPage === id ? "#0d1117" : "#e6edf3" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="border-2 px-4 py-2 text-sm font-black" style={{ borderColor: "#39d353", color: "#39d353" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative min-h-[90vh] overflow-hidden" style={{ background: "#0d1117" }}>
        <div className="absolute inset-x-0 top-[40%] h-24 overflow-hidden">
          <div className="tpl-truck flex gap-6 whitespace-nowrap">
            <div className="flex h-20 w-40 items-center justify-center border-2 text-xs font-black" style={{ borderColor: "#39d353", background: "#161b22" }}>FOOD TRUCK</div>
            <img src={v(data, "heroImage")} alt="" className="h-20 w-48 object-cover" />
            <div className="flex h-20 w-40 items-center justify-center border-2 text-xs font-black" style={{ borderColor: "#39d353", background: "#161b22" }}>OPEN LATE</div>
          </div>
        </div>
        <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-5 pt-24 lg:px-8">
          <p className="tpl-rise text-xs font-black tracking-[0.28em]" style={{ color: "#8b949e" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 tpl-neon-title mt-4 max-w-4xl text-5xl font-black leading-[0.95] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#8b949e" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="border-2 px-7 py-3.5 text-sm font-black" style={{ background: "#39d353", color: "#0d1117", borderColor: "#39d353" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("trucks")} className="border-2 px-7 py-3.5 text-sm font-black" style={{ borderColor: "rgba(230,237,243,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </section>
  );
}


function NightCardStack({ data }: { data: Record<string, any> }) {
  const cards = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(230,237,243,0.12)" }}>
      <div className="mx-auto max-w-lg">
        <Reveal><h2 className="tpl-display text-4xl font-black md:text-5xl">ערימת לילה</h2></Reveal>
        <div className="relative mt-10 space-y-4">
          {cards.map(([title, meta, text, img], i) => (
            <Reveal key={title} delayMs={i * 100} variant="up">
              <article className="tpl-stack-card flex gap-4 border-2 p-3" style={{ borderColor: "#39d353", background: "#161b22", animationDelay: `${i * 0.1}s`, transform: `rotate(${(i - 1) * 1.5}deg)` }}>
                <img src={img} alt="" className="h-20 w-20 object-cover" />
                <div>
                  <p className="text-xs font-black" style={{ color: "#39d353" }}>{meta}</p>
                  <h3 className="tpl-display text-xl font-black">{title}</h3>
                  <p className="text-xs" style={{ color: "#8b949e" }}>{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BouncePins({ data }: { data: Record<string, any> }) {
  const pins = [["דיזנגוף", "עכשיו"], ["נמל ת״א", "21:00"], ["רוטשילד", "מחר"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(230,237,243,0.12)", background: "#161b22" }}>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-8">
        {pins.map(([place, when], i) => (
          <Reveal key={place} delayMs={i * 80} variant="up">
            <div className="text-center">
              <div className="tpl-pin mx-auto h-4 w-4 rounded-full" style={{ background: "#39d353", animationDelay: `${i * 0.2}s` }} />
              <p className="mt-2 text-sm font-black">{place}</p>
              <p className="text-xs" style={{ color: "#8b949e" }}>{when}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(230,237,243,0.12)" }}>
      <div className="mx-auto grid max-w-4xl gap-0 border-4 md:grid-cols-2" style={{ borderColor: "#e6edf3" }}>
        <div className="border-b-4 p-6 md:border-b-0 md:border-l-4" style={{ borderColor: "#e6edf3", background: "#161b22" }}>
          <p className="text-xs font-black uppercase" style={{ color: "#39d353" }}>Comic · 01</p>
          <h2 className="tpl-display mt-3 text-3xl font-black">{v(data, "aboutTitle")}</h2>
          <p className="mt-4 text-sm leading-7" style={{ color: "#8b949e" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="relative min-h-[240px]">
          <img src={v(data, "aboutImage")} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute bottom-3 left-3 border-2 px-2 py-1 text-xs font-black" style={{ background: "#39d353", color: "#0d1117", borderColor: "#e6edf3" }}>POW!</span>
        </div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(230,237,243,0.12)", background: "#161b22" }}>
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border p-4" style={{ borderColor: "rgba(230,237,243,0.12)", background: "#0d1117" }}>
          <p className="mb-4 text-center text-xs font-bold" style={{ color: "#8b949e" }}>SMS · Streetbite</p>
          <div className="mb-3 mr-8 rounded-2xl rounded-tr-sm px-4 py-2 text-sm" style={{ background: "#39d353", color: "#0d1117" }}>{v(data, "contactTitle")}</div>
          <div className="mb-4 ml-8 rounded-2xl rounded-tl-sm border px-4 py-2 text-sm" style={{ borderColor: "rgba(230,237,243,0.12)" }}>{v(data, "contactText")}</div>
          <form className="grid gap-2" onSubmit={(e) => e.preventDefault()}>
            <input className="w-full rounded-full border bg-transparent px-4 py-3 text-right text-sm outline-none" style={{ borderColor: "rgba(230,237,243,0.12)" }} placeholder="הקלידו הודעה..." />
            <button type="button" onClick={onCta} className="rounded-full px-4 py-3 text-sm font-black" style={{ background: "#39d353", color: "#0d1117" }}>{v(data, "cta")}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="tpl-ticket-tear border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(230,237,243,0.12)", background: "#161b22" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#8b949e" }}>
        <span className="tpl-display text-lg font-black" style={{ color: "#e6edf3" }}>{v(data, "brandName")} ★</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <NightCardStack data={data} />
      <BouncePins data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(230,237,243,0.12)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#39d353" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function StreetbitePages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...streetbiteDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of streetbitePages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <NightCardStack data={merged} />
        <BouncePins data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "streetbite-preview" : "streetbite"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#0d1117", color: "#e6edf3" }}>
      <style dangerouslySetInnerHTML={{ __html: streetbiteEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
