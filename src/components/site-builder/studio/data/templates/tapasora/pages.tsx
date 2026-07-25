import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { tapasoraDefaultData } from "./defaultData";
import { tapasoraEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const tapasoraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "tapas", label: "טאפס", slug: "/tapas" },
  { id: "bar", label: "הבר", slug: "/bar" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = tapasoraPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (tapasoraDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = tapasoraPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{ background: "#080410f0", borderColor: "rgba(248,238,248,0.14)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="tpl-neon tpl-display text-2xl font-bold tracking-tight">{v(data, "brandName")}</button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: currentPage === id ? "#ff2d95" : "#b89bc4" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="px-5 py-2.5 text-sm font-bold" style={{ background: "#ff2d95", color: "#12081a" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative min-h-[90vh] overflow-hidden px-5 py-20 lg:px-8" style={{ background: "#12081a" }}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${v(data, "heroImage")})`, backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #080410cc, #12081a)" }} />
        <div className="relative z-10 mx-auto max-w-7xl pt-16">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#ff2d95" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 tpl-neon mt-4 max-w-3xl text-5xl font-bold leading-[0.95] md:text-7xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#b89bc4" }}>{v(data, "heroSubtitle")}</p>
          <div className="mt-12 grid grid-cols-3 gap-3 md:max-w-xl">
            {[v(data, "item1Image"), v(data, "item2Image"), v(data, "item3Image")].map((src, i) => (
              <div key={i} className="tpl-plate-rise aspect-square overflow-hidden rounded-full border-2" style={{ borderColor: "#ff2d95", animationDelay: `${i * 0.15}s` }}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="tpl-rise-3 mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#ff2d95", color: "#12081a" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("tapas")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(248,238,248,0.14)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </section>
  );
}


function BentoTapas({ data }: { data: Record<string, any> }) {
  const cards = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(248,238,248,0.14)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">בנטו לילה</h2></Reveal>
        <div className="mt-10 grid gap-3 md:grid-cols-4 md:grid-rows-2">
          {cards.map(([title, meta, text, img], i) => (
            <Reveal key={title} delayMs={i * 80} variant="up" className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}>
              <article className="h-full overflow-hidden border" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1e1028" }}>
                <img src={img} alt="" className={i === 0 ? "aspect-[4/3] w-full object-cover md:aspect-auto md:h-[70%]" : "aspect-[4/3] w-full object-cover"} />
                <div className="p-4">
                  <p className="text-xs font-semibold" style={{ color: "#ff2d95" }}>{meta}</p>
                  <h3 className="tpl-display mt-1 text-xl font-bold">{title}</h3>
                  <p className="mt-1 text-sm" style={{ color: "#b89bc4" }}>{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function NightMarquee({ data }: { data: Record<string, any> }) {
  const tags = ["TAPAS", "NEON", "WINE", "LATE", "SHARE", "TAPAS", "NEON", "WINE"];
  return (
    <section className="overflow-hidden border-y py-3" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1e1028" }}>
      <div className="tpl-marquee-track gap-8 px-4 text-sm font-bold tracking-[0.28em]" style={{ color: "#ff2d95" }}>
        {tags.map((x, i) => <span key={i} className="whitespace-nowrap">{x} ·</span>)}
      </div>
    </section>
  );
}

function WinePour({ data }: { data: Record<string, any> }) {
  const bottles = [["אדום", "#ff2d95"], ["לבן", "#b89bc4"], ["רוזה", "#ff8fab"]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(248,238,248,0.14)" }}>
      <div className="mx-auto flex max-w-3xl justify-center gap-8">
        {bottles.map(([name, color], i) => (
          <Reveal key={name} delayMs={i * 100} variant="up">
            <div className="flex flex-col items-center">
              <div className="relative h-32 w-10 overflow-hidden rounded-t-full border" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#080410" }}>
                <div className="tpl-wine-fill absolute inset-x-0 bottom-0" style={{ background: color, animationDelay: `${i * 0.4}s` }} />
              </div>
              <p className="mt-3 text-xs font-bold tracking-wider">{name}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1a1520" }}>
      <div className="mx-auto max-w-3xl border-2 border-dashed p-8 md:p-12" style={{ borderColor: "#b89bc4" }}>
        <p className="text-xs font-bold tracking-[0.28em] uppercase" style={{ color: "#ff2d95" }}>Chalkboard</p>
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl" style={{ color: "#f8f4e8" }}>{v(data, "aboutTitle")}</h2>
        <p className="mt-6 text-lg leading-8" style={{ color: "#b89bc4" }}>{v(data, "aboutText")}</p>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1e1028" }}>
      <div className="mx-auto max-w-md font-mono">
        <div className="border p-5" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#12081a" }}>
          <div className="flex justify-between text-xs" style={{ color: "#b89bc4" }}><span>TAB #042</span><span>OPEN</span></div>
          <h2 className="tpl-display mt-4 text-3xl font-bold">{v(data, "contactTitle")}</h2>
          <p className="mt-2 text-sm" style={{ color: "#b89bc4" }}>{v(data, "contactText")}</p>
          <form className="mt-6 grid gap-2" onSubmit={(e) => e.preventDefault()}>
            <input className="w-full border bg-transparent px-3 py-2 text-right text-sm outline-none" style={{ borderColor: "rgba(248,238,248,0.14)" }} placeholder="שם" />
            <input className="w-full border bg-transparent px-3 py-2 text-right text-sm outline-none" style={{ borderColor: "rgba(248,238,248,0.14)" }} placeholder="טלפון" />
            <div className="mt-2 flex justify-between border-t pt-3 text-sm" style={{ borderColor: "rgba(248,238,248,0.14)" }}><span>TOTAL</span><span style={{ color: "#ff2d95" }}>שמירת מקום</span></div>
            <button type="button" onClick={onCta} className="mt-2 px-4 py-3 text-sm font-bold" style={{ background: "#ff2d95", color: "#12081a" }}>{v(data, "cta")}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#080410" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2">
        <span className="tpl-neon tpl-display text-2xl font-bold">{v(data, "brandName")}</span>
        <span className="text-sm" style={{ color: "#b89bc4" }}>{v(data, "phone")} · {v(data, "email")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <BentoTapas data={data} />
      <NightMarquee data={data} />
      <WinePour data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(248,238,248,0.14)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#ff2d95" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function TapasoraPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...tapasoraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of tapasoraPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <BentoTapas data={merged} />
        <NightMarquee data={merged} />
        <WinePour data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "tapasora-preview" : "tapasora"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#12081a", color: "#f8eef8" }}>
      <style dangerouslySetInnerHTML={{ __html: tapasoraEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
