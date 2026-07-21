import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { villaireDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const villairePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "villas", label: "וילות", slug: "/villas" },
  { id: "architecture", label: "אדריכלות", slug: "/architecture" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = villairePages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (villaireDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <header
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b"
      style={{ background: "#0a0a0af6", borderColor: "rgba(226,199,160,0.18)", backdropFilter: "blur(14px)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="tpl-display text-2xl font-bold tracking-[0.08em]" style={{ color: "#f4efe6" }}>
          {v(data, "brandName")}
        </button>
        <button type="button" onClick={() => goTo("contact")} className="border px-5 py-2.5 text-xs font-bold tracking-[0.22em]" style={{ borderColor: "#e2c7a0", color: "#e2c7a0" }}>
          {v(data, "heroPrimary")}
        </button>
      </div>
    </header>
  );
}

function CinemaHero({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <section className="px-5 py-16 text-center lg:px-8 lg:py-24" style={{ background: "#0a0a0a" }}>
      <p className="tpl-rise text-xs font-bold tracking-[0.42em]" style={{ color: "#e2c7a0" }}>{v(data, "heroEyebrow")}</p>
      <h1 className="tpl-display tpl-rise-2 mx-auto mt-7 max-w-5xl text-6xl font-bold leading-[0.9] md:text-8xl lg:text-9xl" style={{ color: "#f4efe6" }}>{v(data, "heroTitle")}</h1>
      <div className="tpl-draw mx-auto mt-9 h-px w-48" style={{ background: "#e2c7a0" }} />
      <p className="tpl-rise-3 mx-auto mt-8 max-w-2xl text-lg leading-8" style={{ color: "#a89a86" }}>{v(data, "heroSubtitle")}</p>
      <div className="tpl-rise-3 mt-9 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => goTo("contact")} className="px-8 py-4 text-sm font-bold" style={{ background: "#e2c7a0", color: "#0a0a0a" }}>{v(data, "heroPrimary")}</button>
        <button type="button" onClick={() => goTo("villas")} className="border px-8 py-4 text-sm font-semibold" style={{ borderColor: "rgba(226,199,160,0.3)", color: "#f4efe6" }}>{v(data, "heroSecondary")}</button>
      </div>
      <div className="tpl-sweep relative mx-auto mt-16 max-w-6xl overflow-hidden border" style={{ borderColor: "rgba(226,199,160,0.18)" }}>
        <img src={v(data, "heroImage")} alt="" className="tpl-ken aspect-[21/9] w-full object-cover" />
      </div>
    </section>
  );
}

function FeaturedVilla({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8 lg:py-20" style={{ borderColor: "rgba(226,199,160,0.16)", background: "#0a0a0a" }}>
      <div className="mx-auto max-w-7xl">
        <div className="relative border" style={{ borderColor: "rgba(226,199,160,0.18)" }}>
          <img src={v(data, "featuredImage")} alt="" className="h-[62vh] min-h-[390px] w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 52%, rgba(10,10,10,0.82))" }} />
          <div className="absolute inset-x-0 bottom-0 grid gap-4 border-t px-6 py-6 md:grid-cols-[1fr_auto]" style={{ borderColor: "rgba(226,199,160,0.22)", background: "rgba(10,10,10,0.78)" }}>
            <div>
              <p className="text-xs font-bold tracking-[0.32em]" style={{ color: "#e2c7a0" }}>{v(data, "featuredLabel")}</p>
              <h2 className="tpl-display mt-2 text-4xl font-bold md:text-6xl" style={{ color: "#f4efe6" }}>{v(data, "featuredTitle")}</h2>
            </div>
            <p className="max-w-md self-end text-base leading-7" style={{ color: "#a89a86" }}>{v(data, "featuredCaption")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function VillaLedger({ data }: { data: Record<string, any> }) {
  const villas = [1, 2, 3, 4].map((i) => ({
    name: v(data, `villa${i}Name`),
    rooms: v(data, `villa${i}Rooms`),
    action: v(data, `villa${i}Action`),
  }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(226,199,160,0.16)", background: "#0a0a0a" }}>
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-bold tracking-[0.38em]" style={{ color: "#e2c7a0" }}>{v(data, "ledgerEyebrow")}</p>
        <div className="mt-10 border-t" style={{ borderColor: "rgba(226,199,160,0.24)" }}>
          {villas.map((villa, index) => (
            <button key={villa.name} type="button" className="tpl-rise grid w-full gap-4 border-b py-6 text-right md:grid-cols-[1fr_0.5fr_0.6fr] md:items-center" style={{ borderColor: "rgba(226,199,160,0.18)", animationDelay: `${index * 0.07}s` }}>
              <span className="tpl-display text-3xl font-bold" style={{ color: "#f4efe6" }}>{villa.name}</span>
              <span className="text-sm tracking-[0.22em]" style={{ color: "#a89a86" }}>{villa.rooms}</span>
              <span className="text-left text-xs font-bold tracking-[0.26em]" style={{ color: "#e2c7a0" }}>{villa.action}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChampagnePrinciples({ data }: { data: Record<string, any> }) {
  const principles = [1, 2, 3].map((i) => ({
    title: v(data, `principle${i}Title`),
    text: v(data, `principle${i}Text`),
  }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-24" style={{ borderColor: "rgba(226,199,160,0.16)", background: "#111111" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="text-xs font-bold tracking-[0.38em]" style={{ color: "#e2c7a0" }}>ARCHITECTURE</p>
          <h2 className="tpl-display mt-4 text-5xl font-bold leading-none md:text-6xl" style={{ color: "#f4efe6" }}>{v(data, "principlesTitle")}</h2>
        </div>
        <div className="grid gap-8">
          {principles.map((principle) => (
            <article key={principle.title} className="border-l-2 pl-8" style={{ borderColor: "#e2c7a0" }}>
              <h3 className="tpl-display text-3xl font-bold" style={{ color: "#f4efe6" }}>{principle.title}</h3>
              <p className="mt-3 max-w-2xl text-lg leading-8" style={{ color: "#a89a86" }}>{principle.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function NarrowInquiry({ data }: { data: Record<string, any> }) {
  const field = "border bg-transparent px-4 py-3.5 text-center outline-none";
  return (
    <section className="border-t px-5 py-16 text-center lg:px-8 lg:py-24" style={{ borderColor: "rgba(226,199,160,0.16)", background: "#0a0a0a" }}>
      <div className="mx-auto max-w-xl">
        <p className="text-xs font-bold tracking-[0.38em]" style={{ color: "#e2c7a0" }}>PRIVATE REQUEST</p>
        <h2 className="tpl-display mt-5 text-5xl font-bold md:text-6xl" style={{ color: "#f4efe6" }}>{v(data, "contactTitle")}</h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-7" style={{ color: "#a89a86" }}>{v(data, "contactText")}</p>
        <form className="mt-10 grid gap-3" onSubmit={(e) => e.preventDefault()}>
          <input className={field} style={{ borderColor: "rgba(226,199,160,0.26)", color: "#f4efe6" }} placeholder="שם" />
          <input className={field} style={{ borderColor: "rgba(226,199,160,0.26)", color: "#f4efe6" }} placeholder="טלפון" />
          <textarea className={`${field} min-h-28`} style={{ borderColor: "rgba(226,199,160,0.26)", color: "#f4efe6" }} placeholder="איזו וילה אתם מדמיינים?" />
          <button type="button" className="tpl-sweep px-6 py-4 text-sm font-bold" style={{ background: "#e2c7a0", color: "#0a0a0a" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function ThinFooter({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-7 lg:px-8" style={{ borderColor: "rgba(226,199,160,0.18)", background: "#050505" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs tracking-[0.22em] md:flex-row md:items-center md:justify-between" style={{ color: "#a89a86" }}>
        <span className="tpl-display text-xl tracking-normal" style={{ color: "#f4efe6" }}>{v(data, "brandName")}</span>
        <span>{v(data, "footerLine")}</span>
        <span>{v(data, "email")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <CinemaHero data={data} goTo={goTo} />
      <FeaturedVilla data={data} />
      <VillaLedger data={data} />
      <ChampagnePrinciples data={data} />
      <NarrowInquiry data={data} />
      <ThinFooter data={data} />
    </>
  );
}

function InnerPage({ data, title, children }: { data: Record<string, any>; title: string; children: React.ReactNode }) {
  return (
    <>
      <section className="border-b px-5 py-20 text-center lg:px-8" style={{ borderColor: "rgba(226,199,160,0.16)" }}>
        <p className="text-xs font-bold tracking-[0.38em]" style={{ color: "#e2c7a0" }}>{v(data, "brandName")}</p>
        <h1 className="tpl-display mt-5 text-6xl font-bold md:text-7xl" style={{ color: "#f4efe6" }}>{title}</h1>
      </section>
      {children}
      <ThinFooter data={data} />
    </>
  );
}

export default function VillairePages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...villaireDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} />,
    villas: <InnerPage data={merged} title="וילות"><FeaturedVilla data={merged} /><VillaLedger data={merged} /></InnerPage>,
    architecture: <InnerPage data={merged} title="אדריכלות"><ChampagnePrinciples data={merged} /></InnerPage>,
    about: <InnerPage data={merged} title="אודות"><ChampagnePrinciples data={merged} /><FeaturedVilla data={merged} /></InnerPage>,
    contact: <InnerPage data={merged} title="יצירת קשר"><NarrowInquiry data={merged} /></InnerPage>,
  };
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "villaire-preview" : "villaire"} className="min-h-screen w-full overflow-x-hidden" style={{ background: "#0a0a0a", color: "#f4efe6" }}>
      <Header data={merged} goTo={goTo} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
