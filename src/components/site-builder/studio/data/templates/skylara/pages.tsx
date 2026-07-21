import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { skylaraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const skylaraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "towers", label: "מגדלים", slug: "/towers" },
  { id: "floors", label: "קומות", slug: "/floors" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = skylaraPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (skylaraDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const nav = skylaraPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b"
      style={{ background: "#06101cf5", borderColor: "rgba(57,208,255,0.22)", backdropFilter: "blur(14px)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="tpl-pulse-line h-10 w-1" style={{ background: "#39d0ff" }} />
          <span className="tpl-display text-2xl font-bold tracking-[-0.03em]" style={{ color: "#e8f1ff" }}>{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-xs font-bold tracking-[0.22em]" style={{ color: currentPage === id ? "#39d0ff" : "#7f97b0" }}>
              {label}
            </button>
          ))}
        </nav>
        <button type="button" onClick={() => setOpen((x) => !x)} className="border px-3 py-2 text-sm lg:hidden" style={{ borderColor: "rgba(57,208,255,0.28)", color: "#39d0ff" }}>
          {open ? "×" : "☰"}
        </button>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(57,208,255,0.2)" }}>
          <div className="grid pt-3">
            {nav.map(([id, label]) => (
              <button key={id} type="button" onClick={() => { goTo(id); setOpen(false); }} className="border-b py-3 text-right text-sm font-bold" style={{ borderColor: "rgba(57,208,255,0.14)" }}>{label}</button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function TowerHero({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const floors = ["46", "38", "28", "17", "08"];
  return (
    <section className="grid min-h-[88vh] lg:grid-cols-[0.42fr_1.58fr]" style={{ background: "#06101c" }}>
      <div className="relative min-h-[560px] overflow-hidden border-b lg:border-b-0 lg:border-l" style={{ borderColor: "rgba(57,208,255,0.22)" }}>
        <img src={v(data, "heroImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,16,28,0.1), #06101ce8)" }} />
        <div className="absolute inset-x-6 bottom-8">
          {floors.map((floor, index) => (
            <div key={floor} className="tpl-climb flex items-center justify-between border-t py-3 text-xs font-bold tracking-[0.24em]" style={{ borderColor: "#39d0ff", color: "#39d0ff", animationDelay: `${index * 0.08}s` }}>
              <span>FLOOR</span>
              <span>{floor}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center px-5 py-16 lg:px-12 lg:py-24">
        <div className="max-w-4xl">
          <p className="tpl-rise text-xs font-bold tracking-[0.36em]" style={{ color: "#39d0ff" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-5 text-6xl font-bold leading-[0.92] md:text-8xl lg:text-9xl" style={{ color: "#e8f1ff" }}>{v(data, "heroTitle")}</h1>
          <div className="tpl-draw mt-9 h-px w-40" style={{ background: "#39d0ff" }} />
          <p className="tpl-rise-3 mt-7 max-w-2xl text-lg leading-8" style={{ color: "#7f97b0" }}>{v(data, "heroSubtitle")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("floors")} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#39d0ff", color: "#041018" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("towers")} className="border px-7 py-3.5 text-sm font-bold" style={{ borderColor: "rgba(57,208,255,0.32)", color: "#e8f1ff" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloorApartments({ data }: { data: Record<string, any> }) {
  const apartments = [1, 2, 3].map((i) => ({
    floor: v(data, `apartment${i}Floor`),
    title: v(data, `apartment${i}Title`),
    meta: v(data, `apartment${i}Meta`),
    text: v(data, `apartment${i}Text`),
  }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-24" style={{ borderColor: "rgba(57,208,255,0.18)", background: "#06101c" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 border-b pb-8 md:grid-cols-[0.7fr_1.3fr]" style={{ borderColor: "rgba(57,208,255,0.18)" }}>
          <p className="text-xs font-bold tracking-[0.36em]" style={{ color: "#39d0ff" }}>FLOOR CLIMB</p>
          <h2 className="tpl-display text-4xl font-bold md:text-6xl" style={{ color: "#e8f1ff" }}>{v(data, "apartmentsTitle")}</h2>
        </div>
        <div className="relative mt-6">
          <div className="absolute bottom-0 right-6 top-0 w-px" style={{ background: "rgba(57,208,255,0.26)" }} />
          {apartments.map((apartment, index) => (
            <article key={apartment.title} className="tpl-climb grid gap-5 border-b py-8 pr-14 md:grid-cols-[0.35fr_0.65fr_1fr] md:items-center" style={{ borderColor: "rgba(57,208,255,0.18)", animationDelay: `${index * 0.12}s` }}>
              <div className="relative">
                <span className="absolute -right-[3.65rem] top-1 h-3 w-3" style={{ background: "#39d0ff" }} />
                <span className="tpl-display text-6xl font-bold leading-none" style={{ color: "#39d0ff" }}>{apartment.floor}</span>
              </div>
              <div>
                <h3 className="tpl-display text-3xl font-bold" style={{ color: "#e8f1ff" }}>{apartment.title}</h3>
                <p className="mt-2 text-xs font-bold tracking-[0.24em]" style={{ color: "#39d0ff" }}>{apartment.meta}</p>
              </div>
              <p className="text-lg leading-8" style={{ color: "#7f97b0" }}>{apartment.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AmenityOutlines({ data }: { data: Record<string, any> }) {
  const amenities = [1, 2, 3, 4].map((i) => ({
    name: v(data, `amenity${i}Name`),
    text: v(data, `amenity${i}Text`),
  }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(57,208,255,0.18)", background: "#0c1a2b" }}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-6xl" style={{ color: "#e8f1ff" }}>{v(data, "amenitiesTitle")}</h2>
        <div className="mt-10 grid border-t" style={{ borderColor: "rgba(57,208,255,0.22)" }}>
          {amenities.map((amenity, index) => (
            <div key={amenity.name} className="grid gap-4 border-b px-0 py-6 md:grid-cols-[0.22fr_0.78fr_1fr]" style={{ borderColor: "rgba(57,208,255,0.22)" }}>
              <span className="text-xs font-bold tracking-[0.26em]" style={{ color: "#39d0ff" }}>{String(index + 1).padStart(2, "0")}</span>
              <h3 className="text-2xl font-bold" style={{ color: "#e8f1ff" }}>{amenity.name}</h3>
              <p className="leading-7" style={{ color: "#7f97b0" }}>{amenity.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkylineBand({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative h-[54vh] min-h-[360px] overflow-hidden border-y" style={{ borderColor: "rgba(57,208,255,0.18)" }}>
      <img src={v(data, "skylineImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #06101cf0, rgba(6,16,28,0.25), #06101caa)" }} />
      <div className="absolute bottom-8 right-5 left-5 mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 className="tpl-display max-w-2xl text-5xl font-bold md:text-7xl" style={{ color: "#e8f1ff" }}>{v(data, "skylineTitle")}</h2>
        <p className="max-w-md text-lg leading-8" style={{ color: "#7f97b0" }}>{v(data, "skylineText")}</p>
      </div>
    </section>
  );
}

function CyanContact({ data }: { data: Record<string, any> }) {
  const field = "border bg-transparent px-4 py-3.5 text-right outline-none";
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24" style={{ background: "#06101c" }}>
      <div className="mx-auto grid max-w-7xl gap-10 border p-6 lg:grid-cols-[0.75fr_1fr] lg:p-10" style={{ borderColor: "rgba(57,208,255,0.26)", background: "#0c1a2b" }}>
        <div>
          <p className="text-xs font-bold tracking-[0.36em]" style={{ color: "#39d0ff" }}>ELEVATED MATCH</p>
          <h2 className="tpl-display mt-5 text-5xl font-bold md:text-6xl" style={{ color: "#e8f1ff" }}>{v(data, "contactTitle")}</h2>
          <p className="mt-5 text-lg leading-8" style={{ color: "#7f97b0" }}>{v(data, "contactText")}</p>
          <p className="mt-8 text-sm font-bold tracking-[0.2em]" style={{ color: "#39d0ff" }}>{v(data, "phone")} · {v(data, "email")}</p>
        </div>
        <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
          <input className={field} style={{ borderColor: "rgba(57,208,255,0.28)", color: "#e8f1ff" }} placeholder="שם מלא" />
          <input className={field} style={{ borderColor: "rgba(57,208,255,0.28)", color: "#e8f1ff" }} placeholder="קומה רצויה" />
          <input className={field} style={{ borderColor: "rgba(57,208,255,0.28)", color: "#e8f1ff" }} placeholder="אזור / מגדל" />
          <textarea className={`${field} min-h-32`} style={{ borderColor: "rgba(57,208,255,0.28)", color: "#e8f1ff" }} placeholder="נוף, מרפסת, שירותי בניין" />
          <button type="button" className="tpl-sweep px-6 py-4 text-sm font-bold" style={{ background: "#39d0ff", color: "#041018" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function FloorFooter({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(57,208,255,0.18)", background: "#02070e" }}>
      <div className="mx-auto grid max-w-7xl gap-4 text-xs font-bold tracking-[0.24em] md:grid-cols-[1fr_auto_1fr] md:items-center" style={{ color: "#7f97b0" }}>
        <span>FLOOR 46 / {v(data, "brandName")}</span>
        <span className="tpl-display text-3xl tracking-normal" style={{ color: "#39d0ff" }}>{v(data, "footerEcho")}</span>
        <span className="md:text-left">{v(data, "email")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <TowerHero data={data} goTo={goTo} />
      <FloorApartments data={data} />
      <AmenityOutlines data={data} />
      <SkylineBand data={data} />
      <CyanContact data={data} />
      <FloorFooter data={data} />
    </>
  );
}

function InnerPage({ data, title, children }: { data: Record<string, any>; title: string; children: React.ReactNode }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(57,208,255,0.18)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.36em]" style={{ color: "#39d0ff" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-5 text-5xl font-bold md:text-7xl" style={{ color: "#e8f1ff" }}>{title}</h1>
        </div>
      </section>
      {children}
      <FloorFooter data={data} />
    </>
  );
}

export default function SkylaraPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...skylaraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} />,
    towers: <InnerPage data={merged} title="מגדלים"><SkylineBand data={merged} /><AmenityOutlines data={merged} /></InnerPage>,
    floors: <InnerPage data={merged} title="קומות"><FloorApartments data={merged} /><CyanContact data={merged} /></InnerPage>,
    about: <InnerPage data={merged} title="אודות"><AmenityOutlines data={merged} /><SkylineBand data={merged} /></InnerPage>,
    contact: <InnerPage data={merged} title="יצירת קשר"><CyanContact data={merged} /></InnerPage>,
  };
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "skylara-preview" : "skylara"} className="min-h-screen w-full overflow-x-hidden" style={{ background: "#06101c", color: "#e8f1ff" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
