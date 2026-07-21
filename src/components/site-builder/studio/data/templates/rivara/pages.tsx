import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { rivaraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const rivaraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "waterfront", label: "מול מים", slug: "/waterfront" },
  { id: "nature", label: "טבע", slug: "/nature" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = rivaraPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (rivaraDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const nav = rivaraPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b"
      style={{ background: "#e8f3f2f4", borderColor: "rgba(31,122,120,0.18)", backdropFilter: "blur(14px)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="h-8 w-12 border-t-2 border-b-2" style={{ borderColor: "#1f7a78" }} />
          <span>
            <span className="tpl-display block text-2xl font-bold leading-none" style={{ color: "#12343a" }}>{v(data, "brandName")}</span>
            <span className="text-[11px] tracking-[0.22em]" style={{ color: "#1f7a78" }}>{v(data, "logoText")}</span>
          </span>
        </button>
        <nav className="hidden items-center gap-2 lg:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => goTo(id)}
              className="border-r px-4 py-1.5 text-sm font-semibold"
              style={{ borderColor: "rgba(31,122,120,0.18)", color: currentPage === id ? "#1f7a78" : "#4f6d72" }}
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((x) => !x)}
          className="grid h-10 w-10 place-items-center border lg:hidden"
          style={{ borderColor: "rgba(31,122,120,0.22)", color: "#12343a" }}
        >
          {open ? "×" : "☰"}
        </button>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(31,122,120,0.18)" }}>
          <div className="grid pt-3">
            {nav.map(([id, label]) => (
              <button key={id} type="button" onClick={() => { goTo(id); setOpen(false); }} className="border-b px-2 py-3 text-right text-sm font-semibold" style={{ borderColor: "rgba(31,122,120,0.12)" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function WaveBandHero({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const bands = [
    { label: v(data, "bandOneLabel"), image: v(data, "bandOneImage") },
    { label: v(data, "bandTwoLabel"), image: v(data, "bandTwoImage") },
    { label: v(data, "bandThreeLabel"), image: v(data, "bandThreeImage") },
  ];
  return (
    <section style={{ background: "#e8f3f2" }}>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
        <div>
          <p className="tpl-rise text-xs font-bold tracking-[0.32em]" style={{ color: "#1f7a78" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-5 text-5xl font-bold leading-[1.02] md:text-7xl" style={{ color: "#12343a" }}>{v(data, "heroTitle")}</h1>
        </div>
        <div className="self-end border-r pr-6" style={{ borderColor: "rgba(31,122,120,0.24)" }}>
          <p className="tpl-rise-3 max-w-2xl text-lg leading-8" style={{ color: "#4f6d72" }}>{v(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("waterfront")} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#1f7a78", color: "#e8f3f2" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("contact")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(31,122,120,0.28)", color: "#12343a" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </div>
      <div className="border-y" style={{ borderColor: "rgba(31,122,120,0.18)" }}>
        {bands.map((band, index) => (
          <div key={band.label} className="relative h-[22vh] min-h-[170px] overflow-hidden border-b last:border-b-0 md:h-[29vh]" style={{ borderColor: "rgba(31,122,120,0.16)" }}>
            <img src={band.image} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" style={{ animationDelay: `${index * 0.8}s` }} />
            <div className="absolute inset-0" style={{ background: index === 1 ? "linear-gradient(90deg, #e8f3f288, transparent 55%)" : "linear-gradient(90deg, transparent, #e8f3f2aa)" }} />
            <div className="absolute bottom-6 right-6 flex items-center gap-4">
              <span className="tpl-pulse-line h-px w-20" style={{ background: "#1f7a78" }} />
              <span className="tpl-display text-4xl font-bold" style={{ color: "#12343a" }}>{band.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WaterfrontRows({ data }: { data: Record<string, any> }) {
  const homes = [1, 2, 3].map((i) => ({
    title: v(data, `waterfront${i}Title`),
    meta: v(data, `waterfront${i}Meta`),
    text: v(data, `waterfront${i}Text`),
    image: v(data, `waterfront${i}Image`),
  }));
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24" style={{ background: "#e8f3f2" }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end" style={{ borderColor: "rgba(31,122,120,0.18)" }}>
          <h2 className="tpl-display text-4xl font-bold md:text-6xl">{v(data, "waterfrontTitle")}</h2>
          <p className="max-w-md text-base leading-7" style={{ color: "#4f6d72" }}>{v(data, "waterfrontIntro")}</p>
        </div>
        <div className="space-y-12">
          {homes.map((home, index) => (
            <article key={home.title} className="tpl-rise border" style={{ borderColor: "rgba(31,122,120,0.16)", animationDelay: `${index * 0.08}s` }}>
              <div className="relative h-[46vh] min-h-[320px] overflow-hidden">
                <img src={home.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 45%, rgba(18,52,58,0.24))" }} />
              </div>
              <div className="grid gap-4 border-t px-5 py-5 md:grid-cols-[1fr_auto_1.2fr] md:items-center" style={{ borderColor: "rgba(31,122,120,0.16)", background: "#d9ecea" }}>
                <h3 className="tpl-display text-3xl font-bold">{home.title}</h3>
                <p className="text-sm font-bold tracking-[0.16em]" style={{ color: "#1f7a78" }}>{home.meta}</p>
                <p className="text-base leading-7" style={{ color: "#4f6d72" }}>{home.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function NatureSquares({ data }: { data: Record<string, any> }) {
  const notes = [1, 2, 3].map((i) => ({
    label: v(data, `nature${i}Label`),
    text: v(data, `nature${i}Text`),
    image: v(data, `nature${i}Image`),
  }));
  return (
    <section className="border-y px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(31,122,120,0.18)", background: "#d9ecea" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.55fr_1.45fr] lg:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.3em]" style={{ color: "#1f7a78" }}>טבע קרוב</p>
            <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "natureTitle")}</h2>
            <p className="mt-5 text-lg leading-8" style={{ color: "#4f6d72" }}>{v(data, "natureIntro")}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {notes.map((note, index) => (
              <figure key={note.label} className="tpl-float border bg-[#e8f3f2]" style={{ borderColor: "rgba(31,122,120,0.16)", animationDelay: `${index * 0.3}s` }}>
                <div className="aspect-square overflow-hidden">
                  <img src={note.image} alt="" className="h-full w-full object-cover" />
                </div>
                <figcaption className="border-t px-4 py-4" style={{ borderColor: "rgba(31,122,120,0.16)" }}>
                  <p className="tpl-display text-2xl font-bold">{note.label}</p>
                  <p className="mt-2 text-sm leading-6" style={{ color: "#4f6d72" }}>{note.text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SereneInquiry({ data }: { data: Record<string, any> }) {
  const field = "border bg-transparent px-4 py-3.5 text-right outline-none";
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24" style={{ background: "#cfe6e4" }}>
      <div className="mx-auto grid max-w-6xl gap-10 border p-6 md:grid-cols-[0.85fr_1.15fr] md:p-10" style={{ borderColor: "rgba(31,122,120,0.22)", background: "#e8f3f2" }}>
        <div>
          <p className="text-xs font-bold tracking-[0.3em]" style={{ color: "#1f7a78" }}>שיחה רגועה</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-5 text-lg leading-8" style={{ color: "#4f6d72" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-3 border-r pr-5 text-sm" style={{ borderColor: "#1f7a78", color: "#4f6d72" }}>
            <p>{v(data, "phone")}</p>
            <p>{v(data, "email")}</p>
            <p>{v(data, "address")}</p>
          </div>
        </div>
        <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
          <input className={field} style={{ borderColor: "rgba(31,122,120,0.22)", color: "#12343a" }} placeholder="שם מלא" />
          <input className={field} style={{ borderColor: "rgba(31,122,120,0.22)", color: "#12343a" }} placeholder="טלפון" />
          <textarea className={`${field} min-h-32`} style={{ borderColor: "rgba(31,122,120,0.22)", color: "#12343a" }} placeholder="מים, פארק, פרטיות - מה חשוב לכם?" />
          <button type="button" className="tpl-sweep px-6 py-4 text-sm font-bold" style={{ background: "#1f7a78", color: "#e8f3f2" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function SoftFooter({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-9 lg:px-8" style={{ borderColor: "rgba(31,122,120,0.18)", background: "#e8f3f2" }}>
      <div className="mx-auto grid max-w-7xl gap-4 text-sm md:grid-cols-[1fr_auto_1fr] md:items-center" style={{ color: "#4f6d72" }}>
        <span>{v(data, "footerLine")}</span>
        <span className="tpl-display text-2xl font-bold text-center" style={{ color: "#12343a" }}>{v(data, "brandName")}</span>
        <span className="md:text-left">{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <WaveBandHero data={data} goTo={goTo} />
      <WaterfrontRows data={data} />
      <NatureSquares data={data} />
      <SereneInquiry data={data} />
      <SoftFooter data={data} />
    </>
  );
}

function InnerPage({ data, title, children }: { data: Record<string, any>; title: string; children: React.ReactNode }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(31,122,120,0.18)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.3em]" style={{ color: "#1f7a78" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <SoftFooter data={data} />
    </>
  );
}

export default function RivaraPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...rivaraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} />,
    waterfront: <InnerPage data={merged} title="מול מים"><WaterfrontRows data={merged} /><SereneInquiry data={merged} /></InnerPage>,
    nature: <InnerPage data={merged} title="טבע"><NatureSquares data={merged} /><SereneInquiry data={merged} /></InnerPage>,
    about: <InnerPage data={merged} title="אודות"><NatureSquares data={merged} /></InnerPage>,
    contact: <InnerPage data={merged} title="יצירת קשר"><SereneInquiry data={merged} /></InnerPage>,
  };
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "rivara-preview" : "rivara"} className="min-h-screen w-full overflow-x-hidden" style={{ background: "#e8f3f2", color: "#12343a" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
