import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { noodlixDefaultData } from "./defaultData";
import { noodlixEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const noodlixPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "bowls", label: "קערות", slug: "/bowls" },
  { id: "broth", label: "ציר", slug: "/broth" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = noodlixPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (noodlixDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = noodlixPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border px-5 py-3 shadow-lg"
        style={{ background: "#18201cdd", borderColor: "rgba(238,246,241,0.12)", backdropFilter: "blur(16px)" }}>
        <button type="button" onClick={() => goTo("home")} className="tpl-display text-lg font-bold">{v(data, "brandName")}</button>
        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#3dd6c6" : "#8aa89a" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="rounded-full px-4 py-2 text-xs font-bold" style={{ background: "#3dd6c6", color: "#0a1210" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative isolate flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-5 pt-28" style={{ background: "radial-gradient(ellipse at 50% 60%, #18201c, #0f1412)" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="tpl-steam pointer-events-none absolute rounded-full blur-md" style={{ left: `${35 + (i % 5) * 6}%`, bottom: "38%", width: `${20 + i * 4}px`, height: `${40 + i * 8}px`, background: "rgba(238,246,241,.18)", animationDelay: `${i * 0.5}s`, ["--steam-dur" as string]: `${5 + (i % 4)}s` }} />
        ))}
        <div className="tpl-bowl-float relative z-10 mb-8 h-40 w-40 overflow-hidden rounded-full border-4 md:h-52 md:w-52" style={{ borderColor: "#3dd6c6" }}>
          <img src={v(data, "heroImage")} alt="" className="h-full w-full object-cover" />
        </div>
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#3dd6c6" }}>{v(data, "heroEyebrow")}</p>
        <h1 className="tpl-display tpl-rise-2 mt-4 max-w-3xl text-center text-5xl font-bold leading-[0.95] md:text-7xl">{v(data, "heroTitle")}</h1>
        <p className="tpl-rise-3 mt-6 max-w-lg text-center text-lg leading-8" style={{ color: "#8aa89a" }}>{v(data, "heroSubtitle")}</p>
        <div className="tpl-rise-3 mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={onCta} className="rounded-full px-7 py-3.5 text-sm font-bold" style={{ background: "#3dd6c6", color: "#0a1210" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => goTo("bowls")} className="rounded-full border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(238,246,241,0.12)" }}>{v(data, "heroSecondary")}</button>
        </div>
      </section>
  );
}


function RadialDishes({ data }: { data: Record<string, any> }) {
  const cards = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto max-w-7xl text-center">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">קערות היום</h2></Reveal>
        <div className="relative mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-8">
          <div className="tpl-radial-orbit pointer-events-none absolute inset-0 rounded-full border border-dashed opacity-30" style={{ borderColor: "#3dd6c6" }} />
          {cards.map(([title, meta, text, img], i) => (
            <Reveal key={title} delayMs={i * 100} variant="scale">
              <article className="w-40 text-center md:w-48">
                <div className="mx-auto aspect-square overflow-hidden rounded-full border-2" style={{ borderColor: "#3dd6c6" }}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
                <p className="mt-3 text-xs" style={{ color: "#3dd6c6" }}>{meta}</p>
                <h3 className="tpl-display mt-1 text-lg font-bold">{title}</h3>
                <p className="mt-1 text-xs leading-5" style={{ color: "#8aa89a" }}>{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChopstickSteps({ data }: { data: Record<string, any> }) {
  const steps = [["01", "ציר איטי"], ["02", "אטריות טריות"], ["03", "הרכבה חמה"]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {steps.map(([n, label], i) => (
          <Reveal key={n} delayMs={i * 90} variant="up">
            <div className="relative border-r pr-4" style={{ borderColor: "#3dd6c6" }}>
              <div className="tpl-display text-4xl font-bold" style={{ color: "#3dd6c6" }}>{n}</div>
              <p className="mt-2 text-sm font-semibold">{label}</p>
              <div className="absolute -left-1 top-2 h-16 w-0.5 rotate-12" style={{ background: "#8aa89a" }} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-3xl space-y-4">
        <Reveal>
          <div className="tpl-steam-card rounded-2xl p-6">
            <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#3dd6c6" }}>אודות</p>
            <h2 className="tpl-display mt-3 text-3xl font-bold md:text-4xl">{v(data, "aboutTitle")}</h2>
          </div>
        </Reveal>
        <Reveal delayMs={100}>
          <div className="tpl-steam-card rounded-2xl p-6">
            <p className="text-lg leading-8" style={{ color: "#8aa89a" }}>{v(data, "aboutText")}</p>
          </div>
        </Reveal>
        <Reveal delayMs={180} variant="scale">
          <div className="tpl-steam-card overflow-hidden rounded-2xl">
            <img src={v(data, "aboutImage")} alt="" className="aspect-[21/9] w-full object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <h2 className="tpl-display text-4xl font-bold">{v(data, "contactTitle")}</h2>
        <p className="mt-4 text-lg" style={{ color: "#8aa89a" }}>{v(data, "contactText")}</p>
        <form className="tpl-steam-card mt-8 grid w-full max-w-md gap-3 rounded-full border p-8" style={{ borderColor: "#3dd6c6" }} onSubmit={(e) => e.preventDefault()}>
          <input className="w-full rounded-full border bg-transparent px-4 py-3 text-center outline-none" style={{ borderColor: "rgba(238,246,241,0.12)" }} placeholder="שם" />
          <input className="w-full rounded-full border bg-transparent px-4 py-3 text-center outline-none" style={{ borderColor: "rgba(238,246,241,0.12)" }} placeholder="טלפון" />
          <button type="button" onClick={onCta} className="rounded-full px-6 py-3 text-sm font-bold" style={{ background: "#3dd6c6", color: "#0a1210" }}>{v(data, "cta")}</button>
        </form>
        <p className="mt-6 text-sm" style={{ color: "#8aa89a" }}>{v(data, "phone")} · {v(data, "email")}</p>
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="relative overflow-hidden px-5 pb-8 pt-4 lg:px-8" style={{ background: "#070a09" }}>
      <svg className="mb-4 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path fill="none" stroke="#3dd6c6" strokeWidth="2" d="M0,30 Q180,5 360,30 T720,30 T1080,30 T1440,30" />
      </svg>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm md:flex-row md:justify-between" style={{ color: "#8aa89a" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#eef6f1" }}>{v(data, "brandName")}</span>
        <span>{v(data, "address")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <RadialDishes data={data} />
      <ChopstickSteps data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#3dd6c6" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function NoodlixPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...noodlixDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of noodlixPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <RadialDishes data={merged} />
        <ChopstickSteps data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "noodlix-preview" : "noodlix"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#0f1412", color: "#eef6f1" }}>
      <style dangerouslySetInnerHTML={{ __html: noodlixEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
