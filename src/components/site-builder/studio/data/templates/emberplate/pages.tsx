import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { emberplateDefaultData } from "./defaultData";
import { emberplateEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const emberplatePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "menu", label: "תפריט", slug: "/menu" },
  { id: "grill", label: "הגריל", slug: "/grill" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = emberplatePages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (emberplateDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = emberplatePages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#0a0604ee", borderColor: "rgba(246,235,224,0.12)", backdropFilter: "blur(10px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="relative grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#e85d04", color: "#140c08" }}>
            {v(data, "logoText")}
            <span className="tpl-ember absolute -top-1 -left-1 h-1.5 w-1.5 rounded-full" style={{ background: "#e85d04", ["--ember-dur" as string]: "5s" }} />
            <span className="tpl-ember absolute top-0 left-2 h-1 w-1 rounded-full" style={{ background: "#ffba08", ["--ember-dur" as string]: "6.5s", animationDelay: ".4s" }} />
          </span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#f6ebe0" : "#b89a82" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#e85d04", color: "#140c08" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(246,235,224,0.12)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(246,235,224,0.12)" }}>
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

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <img src={v(data, "heroImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0a060488, #140c08ee)" }} />
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="tpl-ember pointer-events-none absolute rounded-full" style={{ left: `${4 + i * 5.2}%`, bottom: `-2%`, width: `${3 + (i % 3)}px`, height: `${3 + (i % 3)}px`, background: i % 2 ? "#e85d04" : "#ffba08", animationDelay: `${i * 0.35}s`, ["--ember-dur" as string]: `${5 + (i % 5)}s` }} />
        ))}
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#e85d04" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#b89a82" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#e85d04", color: "#140c08" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("menu")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(246,235,224,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </section>
  );
}


function MeatTimeline({ data }: { data: Record<string, any> }) {
  const cards = [1, 2, 3].map((i) => ({
    title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`),
  }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(246,235,224,0.12)", background: "#1f1410" }}>
      <div className="mx-auto max-w-3xl tpl-meat-line pr-8">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">ציר הבשר</h2></Reveal>
        <div className="mt-10 grid gap-8">
          {cards.map((c, i) => (
            <Reveal key={c.title} delayMs={i * 100} variant="right">
              <article className="grid gap-4 md:grid-cols-[140px_1fr] md:items-center">
                <img src={c.img} alt="" className="aspect-square w-full object-cover" />
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em]" style={{ color: "#e85d04" }}>{c.meta}</p>
                  <h3 className="tpl-display mt-1 text-2xl font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm leading-7" style={{ color: "#b89a82" }}>{c.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GlowHourChips({ data }: { data: Record<string, any> }) {
  const chips = [["א׳–ה׳", "12:00–23:00"], ["ו׳", "12:00–15:00"], ["שבת", "סגור"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(246,235,224,0.12)" }}>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-4">
        {chips.map(([d, h], i) => (
          <Reveal key={d} delayMs={i * 80} variant="scale">
            <div className="tpl-glow-chip border px-6 py-4 text-center" style={{ borderColor: "#e85d04", background: "#1f1410", animationDelay: `${i * 0.3}s` }}>
              <div className="text-xs font-bold tracking-wider" style={{ color: "#e85d04" }}>{d}</div>
              <div className="mt-1 text-sm font-semibold">{h}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative border-t overflow-hidden" style={{ borderColor: "rgba(246,235,224,0.12)" }}>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#b89a82 1px, transparent 1px)", backgroundSize: "6px 6px" }} />
      <div className="relative mx-auto grid max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="order-2 min-h-[360px] overflow-hidden lg:order-1"><img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
        <div className="order-1 px-5 py-16 lg:order-2 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#e85d04" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#b89a82" }}>{v(data, "aboutText")}</p>
        </div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(246,235,224,0.12)", background: "#1f1410" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#e85d04" }}>הזמנה</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#b89a82" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#b89a82" }}>
            <p>{v(data, "phone")}</p><p>{v(data, "email")}</p><p>{v(data, "address")}</p>
          </div>
        </div>
        <form className="tpl-ember-pulse grid gap-3 border p-6" style={{ borderColor: "#e85d04" }} onSubmit={(e) => e.preventDefault()}>
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(246,235,224,0.12)", color: "#f6ebe0" }} placeholder="שם מלא" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(246,235,224,0.12)", color: "#f6ebe0" }} placeholder="טלפון" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(246,235,224,0.12)", color: "#f6ebe0" }} placeholder="תאריך" />
          <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#e85d04", color: "#140c08" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(246,235,224,0.12)" }}>
      <div className="mx-auto h-px max-w-7xl" style={{ background: `linear-gradient(90deg, transparent, #e85d04, transparent)` }} />
      <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#b89a82" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#f6ebe0" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <MeatTimeline data={data} />
      <GlowHourChips data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(246,235,224,0.12)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#e85d04" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function EmberplatePages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...emberplateDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of emberplatePages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <MeatTimeline data={merged} />
        <GlowHourChips data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "emberplate-preview" : "emberplate"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#140c08", color: "#f6ebe0" }}>
      <style dangerouslySetInnerHTML={{ __html: emberplateEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
