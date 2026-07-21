import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { parcelDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const parcelPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "plots", label: "מגרשים", slug: "/plots" },
  { id: "planning", label: "תכנון", slug: "/planning" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = parcelPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (parcelDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const nav = parcelPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b"
      style={{ background: "#efe9daf4", borderColor: "rgba(107,90,46,0.24)", backdropFilter: "blur(12px)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-stretch text-right">
          <span className="grid w-12 place-items-center border" style={{ borderColor: "#6b5a2e", color: "#6b5a2e" }}>▧</span>
          <span className="border-y border-l px-4 py-2" style={{ borderColor: "rgba(107,90,46,0.28)" }}>
            <span className="tpl-display block text-xl font-bold" style={{ color: "#243018" }}>{v(data, "brandName")}</span>
            <span className="text-[10px] tracking-[0.24em]" style={{ color: "#6b5a2e" }}>{v(data, "logoText")}</span>
          </span>
        </button>
        <nav className="hidden items-center gap-0 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="border-y border-l px-4 py-2 text-xs font-bold tracking-[0.08em]" style={{ borderColor: "rgba(107,90,46,0.22)", color: currentPage === id ? "#243018" : "#6e684f", background: currentPage === id ? "#e4dcc8" : "transparent" }}>
              {label}
            </button>
          ))}
        </nav>
        <button type="button" onClick={() => setOpen((x) => !x)} className="border px-3 py-2 text-sm lg:hidden" style={{ borderColor: "rgba(107,90,46,0.28)" }}>
          {open ? "סגור" : "תפריט"}
        </button>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(107,90,46,0.22)" }}>
          <div className="grid pt-3">
            {nav.map(([id, label]) => (
              <button key={id} type="button" onClick={() => { goTo(id); setOpen(false); }} className="border-b py-3 text-right text-sm font-bold" style={{ borderColor: "rgba(107,90,46,0.16)" }}>{label}</button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function SurveyHero({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <section className="relative overflow-hidden px-5 py-14 lg:px-8 lg:py-20" style={{ background: "#efe9da" }}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(107,90,46,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(107,90,46,0.18) 1px, transparent 1px)", backgroundSize: "54px 54px" }} />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.88fr] lg:items-end">
        <div>
          <p className="tpl-rise text-xs font-bold tracking-[0.32em]" style={{ color: "#6b5a2e" }}>{v(data, "heroEyebrow")}</p>
          <div className="tpl-climb mt-3 text-[9rem] font-black leading-[0.78] md:text-[15rem]" style={{ color: "#6b5a2e" }}>{v(data, "bigStat")}</div>
          <p className="mt-3 border-t pt-3 text-xs font-bold tracking-[0.26em]" style={{ borderColor: "rgba(107,90,46,0.28)", color: "#6e684f" }}>{v(data, "bigStatLabel")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-8 max-w-3xl text-5xl font-bold leading-[1.02] md:text-7xl" style={{ color: "#243018" }}>{v(data, "heroTitle")}</h1>
        </div>
        <div className="tpl-float border bg-[#e4dcc8] p-3" style={{ borderColor: "rgba(107,90,46,0.28)" }}>
          <img src={v(data, "heroImage")} alt="" className="aspect-[5/4] w-full object-cover" />
          <div className="grid grid-cols-2 border-t text-xs font-bold tracking-[0.18em]" style={{ borderColor: "rgba(107,90,46,0.24)", color: "#6e684f" }}>
            <span className="border-l px-3 py-3" style={{ borderColor: "rgba(107,90,46,0.2)" }}>{v(data, "mapCode")}</span>
            <span className="px-3 py-3 text-left">{v(data, "mapScale")}</span>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto mt-10 grid max-w-7xl gap-5 border-t pt-7 md:grid-cols-[1fr_auto]" style={{ borderColor: "rgba(107,90,46,0.28)" }}>
        <p className="max-w-2xl text-lg leading-8" style={{ color: "#6e684f" }}>{v(data, "heroSubtitle")}</p>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <button type="button" onClick={() => goTo("plots")} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#6b5a2e", color: "#efe9da" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => goTo("planning")} className="border px-7 py-3.5 text-sm font-bold" style={{ borderColor: "rgba(107,90,46,0.3)", color: "#243018" }}>{v(data, "heroSecondary")}</button>
        </div>
      </div>
    </section>
  );
}

function PlotSpecs({ data }: { data: Record<string, any> }) {
  const plots = [1, 2, 3].map((i) => ({
    size: v(data, `plot${i}Size`),
    title: v(data, `plot${i}Title`),
    zone: v(data, `plot${i}Zone`),
    note: v(data, `plot${i}Note`),
  }));
  return (
    <section className="border-y px-5 py-16 lg:px-8 lg:py-24" style={{ borderColor: "rgba(107,90,46,0.24)", background: "#efe9da" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 border-b pb-8 md:grid-cols-[0.7fr_1.3fr]" style={{ borderColor: "rgba(107,90,46,0.24)" }}>
          <p className="text-xs font-bold tracking-[0.32em]" style={{ color: "#6b5a2e" }}>SURVEY MAGAZINE</p>
          <h2 className="tpl-display text-4xl font-bold md:text-6xl" style={{ color: "#243018" }}>{v(data, "plotsTitle")}</h2>
        </div>
        <div>
          {plots.map((plot, index) => (
            <article key={plot.title} className="tpl-rise grid gap-6 border-b py-9 md:grid-cols-[0.45fr_0.75fr_1fr] md:items-start" style={{ borderColor: "rgba(107,90,46,0.24)", animationDelay: `${index * 0.08}s` }}>
              <div>
                <p className="text-6xl font-black leading-none" style={{ color: "#6b5a2e" }}>{plot.size}</p>
                <p className="mt-2 text-xs font-bold tracking-[0.22em]" style={{ color: "#6e684f" }}>מ״ר</p>
              </div>
              <div>
                <h3 className="tpl-display text-3xl font-bold" style={{ color: "#243018" }}>{plot.title}</h3>
                <p className="mt-3 border-t pt-3 text-sm font-bold" style={{ borderColor: "rgba(107,90,46,0.24)", color: "#6b5a2e" }}>{plot.zone}</p>
              </div>
              <p className="text-lg leading-8" style={{ color: "#6e684f" }}>{plot.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanningSidenotes({ data }: { data: Record<string, any> }) {
  const notes = [1, 2, 3].map((i) => ({
    mark: v(data, `note${i}Mark`),
    title: v(data, `note${i}Title`),
    text: v(data, `note${i}Text`),
  }));
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24" style={{ background: "#e4dcc8" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.42fr_1fr]">
        <aside className="border-r pr-6" style={{ borderColor: "#6b5a2e" }}>
          <p className="text-xs font-bold tracking-[0.32em]" style={{ color: "#6b5a2e" }}>שולי תכנון</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl" style={{ color: "#243018" }}>{v(data, "planningTitle")}</h2>
          <p className="mt-5 text-base leading-7" style={{ color: "#6e684f" }}>{v(data, "planningIntro")}</p>
        </aside>
        <div className="grid gap-0 border-t" style={{ borderColor: "rgba(107,90,46,0.24)" }}>
          {notes.map((note) => (
            <article key={note.title} className="grid gap-5 border-b py-7 md:grid-cols-[0.2fr_0.8fr_1fr]" style={{ borderColor: "rgba(107,90,46,0.24)" }}>
              <span className="text-3xl font-black" style={{ color: "#6b5a2e" }}>{note.mark}</span>
              <h3 className="text-xl font-bold" style={{ color: "#243018" }}>{note.title}</h3>
              <p className="leading-7" style={{ color: "#6e684f" }}>{note.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SurveyRequest({ data }: { data: Record<string, any> }) {
  const field = "border bg-transparent px-4 py-3.5 text-right outline-none";
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-24" style={{ borderColor: "rgba(107,90,46,0.24)", background: "#efe9da" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1fr]">
        <div className="border p-6" style={{ borderColor: "rgba(107,90,46,0.28)", background: "#e4dcc8" }}>
          <p className="text-xs font-bold tracking-[0.32em]" style={{ color: "#6b5a2e" }}>בקשת סקר</p>
          <h2 className="tpl-display mt-5 text-5xl font-bold md:text-6xl" style={{ color: "#243018" }}>{v(data, "contactTitle")}</h2>
          <p className="mt-5 text-lg leading-8" style={{ color: "#6e684f" }}>{v(data, "contactText")}</p>
          <p className="mt-10 border-t pt-4 text-sm font-bold tracking-[0.18em]" style={{ borderColor: "rgba(107,90,46,0.28)", color: "#6b5a2e" }}>{v(data, "phone")} · {v(data, "email")}</p>
        </div>
        <form className="grid gap-3 self-start" onSubmit={(e) => e.preventDefault()}>
          <input className={field} style={{ borderColor: "rgba(107,90,46,0.28)", color: "#243018" }} placeholder="שם מלא" />
          <input className={field} style={{ borderColor: "rgba(107,90,46,0.28)", color: "#243018" }} placeholder="אזור מבוקש" />
          <input className={field} style={{ borderColor: "rgba(107,90,46,0.28)", color: "#243018" }} placeholder="גודל רצוי במ״ר" />
          <textarea className={`${field} min-h-32`} style={{ borderColor: "rgba(107,90,46,0.28)", color: "#243018" }} placeholder="ייעוד, תקציב, הערות תכנון" />
          <button type="button" className="tpl-sweep px-6 py-4 text-sm font-bold" style={{ background: "#6b5a2e", color: "#efe9da" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function ParchmentFooter({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(107,90,46,0.24)", background: "#e4dcc8" }}>
      <div className="mx-auto grid max-w-7xl gap-3 text-xs font-bold tracking-[0.18em] md:grid-cols-3 md:items-center" style={{ color: "#6e684f" }}>
        <span>{v(data, "brandName")} / {v(data, "logoText")}</span>
        <span className="md:text-center">{v(data, "footerLine")}</span>
        <span className="md:text-left">{v(data, "address")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <SurveyHero data={data} goTo={goTo} />
      <PlotSpecs data={data} />
      <PlanningSidenotes data={data} />
      <SurveyRequest data={data} />
      <ParchmentFooter data={data} />
    </>
  );
}

function InnerPage({ data, title, children }: { data: Record<string, any>; title: string; children: React.ReactNode }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(107,90,46,0.24)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.32em]" style={{ color: "#6b5a2e" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl" style={{ color: "#243018" }}>{title}</h1>
        </div>
      </section>
      {children}
      <ParchmentFooter data={data} />
    </>
  );
}

export default function ParcelPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...parcelDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} />,
    plots: <InnerPage data={merged} title="מגרשים"><PlotSpecs data={merged} /><SurveyRequest data={merged} /></InnerPage>,
    planning: <InnerPage data={merged} title="תכנון"><PlanningSidenotes data={merged} /></InnerPage>,
    about: <InnerPage data={merged} title="אודות"><PlanningSidenotes data={merged} /><PlotSpecs data={merged} /></InnerPage>,
    contact: <InnerPage data={merged} title="יצירת קשר"><SurveyRequest data={merged} /></InnerPage>,
  };
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "parcel-preview" : "parcel"} className="min-h-screen w-full overflow-x-hidden" style={{ background: "#efe9da", color: "#243018" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
