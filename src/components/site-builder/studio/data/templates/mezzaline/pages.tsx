import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { mezzalineDefaultData } from "./defaultData";
import { mezzalineEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const mezzalinePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "mezze", label: "מזטה", slug: "/mezze" },
  { id: "table", label: "השולחן", slug: "/table" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = mezzalinePages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (mezzalineDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = mezzalinePages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50" style={{ background: "#f7f1e6f0" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="text-right">
          <span className="tpl-display text-2xl font-bold">{v(data, "brandName")}</span>
          <span className="tpl-branch-under mt-2 block w-24" />
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="relative text-sm font-semibold"
              style={{ color: currentPage === id ? "#2c2a22" : "#7a7260" }}>
              {label}
              {currentPage === id ? <span className="absolute -bottom-1 right-0 left-0 h-px" style={{ background: "#5c7a4a" }} /> : null}
            </button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="rounded-sm px-5 py-2.5 text-sm font-bold" style={{ background: "#5c7a4a", color: "#f7f1e6" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative overflow-hidden px-5 py-16 lg:px-8 lg:py-20" style={{ background: "#f7f1e6" }}>
        {[["12%","18%"],["78%","12%"],["60%","70%"],["22%","65%"]].map(([l, top], i) => (
          <div key={i} className="tpl-olive pointer-events-none absolute h-4 w-3 rounded-full" style={{ left: l, top: top, background: i % 2 ? "#5c7a4a" : "#1c1a14", animationDelay: `${i * 0.6}s` }} />
        ))}
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {[v(data, "heroImage"), v(data, "item1Image"), v(data, "item2Image"), v(data, "item3Image")].map((src, i) => (
              <div key={i} className={`overflow-hidden ${i === 0 ? "row-span-1 aspect-[4/3]" : "aspect-square"}`}>
                <img src={src} alt="" className="tpl-ken h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-10 max-w-2xl">
            <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#5c7a4a" }}>{v(data, "heroEyebrow")}</p>
            <h1 className="tpl-display tpl-rise-2 mt-4 text-5xl font-bold leading-[0.95] md:text-7xl">{v(data, "heroTitle")}</h1>
            <p className="tpl-rise-3 mt-6 text-lg leading-8" style={{ color: "#7a7260" }}>{v(data, "heroSubtitle")}</p>
            <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#5c7a4a", color: "#f7f1e6" }}>{v(data, "heroPrimary")}</button>
              <button type="button" onClick={() => goTo("mezze")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(44,42,34,0.12)" }}>{v(data, "heroSecondary")}</button>
            </div>
          </div>
        </div>
      </section>
  );
}


function PlatterScroll({ data }: { data: Record<string, any> }) {
  const dishes = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">מגש משותף</h2></Reveal>
        <div className="tpl-platter-rail mt-10">
          {dishes.map(([title, meta, text, img], i) => (
            <Reveal key={title} delayMs={i * 80} variant="left">
              <article className="overflow-hidden border" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#f7f1e6" }}>
                <img src={img} alt="" className="aspect-[5/4] w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs" style={{ color: "#5c7a4a" }}>{meta}</p>
                  <h3 className="tpl-display mt-1 text-xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6" style={{ color: "#7a7260" }}>{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ParchmentQuote({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-y px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#f7f1e6" }}>
      <Reveal variant="fade">
        <blockquote className="mx-auto max-w-3xl text-center">
          <p className="tpl-display text-2xl font-semibold leading-relaxed md:text-3xl" style={{ color: "#2c2a22" }}>״שולחן מלא צבעים — ככה נראית אהבה ים-תיכונית.״</p>
          <footer className="mt-4 text-sm" style={{ color: "#7a7260" }}>— {v(data, "brandName")}</footer>
        </blockquote>
      </Reveal>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#5c7a4a" }}>מהגינה</p>
            <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          </div>
          <p className="text-lg leading-8" style={{ color: "#7a7260" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="mt-10 grid grid-cols-3 gap-2">
          <img src={v(data, "aboutImage")} alt="" className="col-span-2 aspect-[16/10] w-full object-cover" />
          <div className="flex flex-col justify-between border p-4" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#f7f1e6" }}>
            <span className="inline-block h-8 w-8 rounded-full" style={{ background: "#5c7a4a" }} />
            <p className="text-sm font-semibold">עשבי תיבול טריים כל בוקר</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#f7f1e6" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="border p-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#5c7a4a" }}>שולחן גן</p>
          <h2 className="tpl-display mt-3 text-4xl font-bold">{v(data, "contactTitle")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#7a7260" }}>{v(data, "contactText")}</p>
          <div className="mt-6 space-y-1 text-sm" style={{ color: "#7a7260" }}>
            <p>{v(data, "phone")}</p><p>{v(data, "email")}</p><p>{v(data, "address")}</p>
          </div>
        </div>
        <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(44,42,34,0.12)" }} placeholder="שם מלא" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(44,42,34,0.12)" }} placeholder="טלפון" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(44,42,34,0.12)" }} placeholder="מספר סועדים" />
          <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#5c7a4a", color: "#f7f1e6" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-10 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto grid max-w-7xl gap-4 text-sm md:grid-cols-3 md:items-center" style={{ color: "#7a7260" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#2c2a22" }}>{v(data, "brandName")}</span>
        <span className="text-center">מזטה · שמן זית · שולחן משותף</span>
        <span className="md:text-left">{v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <PlatterScroll data={data} />
      <ParchmentQuote data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#5c7a4a" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function MezzalinePages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...mezzalineDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of mezzalinePages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <PlatterScroll data={merged} />
        <ParchmentQuote data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "mezzaline-preview" : "mezzaline"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#f7f1e6", color: "#2c2a22" }}>
      <style dangerouslySetInnerHTML={{ __html: mezzalineEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
