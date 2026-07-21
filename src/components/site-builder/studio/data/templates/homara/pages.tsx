import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { homaraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const homaraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "homes", label: "בתים", slug: "/homes" },
  { id: "neighborhoods", label: "שכונות", slug: "/neighborhoods" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = homaraPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (homaraDefaultData as Record<string, any>)[key] ?? "";
}

function HomaraSoftHeader({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = homaraPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{ background: "rgba(243,240,232,0.94)", borderColor: "rgba(36,48,40,0.14)", backdropFilter: "blur(10px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="h-8 w-8 border" style={{ borderColor: "#3f6f5a", background: "#ebe6da" }} />
          <span className="tpl-display text-2xl font-bold">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-bold" style={{ color: currentPage === id ? "#3f6f5a" : "#6d7568" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex" style={{ background: "#3f6f5a", color: "#f3f0e8" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(36,48,40,0.14)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(36,48,40,0.14)", background: "#f3f0e8" }}>
          <div className="grid gap-1 pt-3">
            {nav.map(([id, label]) => (
              <button key={id} type="button" onClick={() => { goTo(id); setOpen(false); }} className="px-3 py-3 text-right text-sm font-bold">{label}</button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function HomaraCircleHero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <section className="relative overflow-hidden px-5 py-16 lg:px-8 lg:py-24" style={{ background: "#f3f0e8" }}>
      <div className="absolute inset-x-0 top-1/2 h-px" style={{ background: "rgba(63,111,90,0.18)" }} />
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <p className="tpl-rise text-xs font-bold tracking-[0.3em]" style={{ color: "#3f6f5a" }}>{v(data, "heroEyebrow")}</p>
        <div className="tpl-float relative mt-8 h-[280px] w-[280px] overflow-hidden rounded-full border-4 md:h-[390px] md:w-[390px]" style={{ borderColor: "#3f6f5a" }}>
          <img src={v(data, "heroImage")} alt="" className="tpl-ken h-full w-full object-cover" />
        </div>
        <h1 className="tpl-display tpl-rise-2 mt-10 max-w-4xl text-5xl font-bold leading-[1.02] md:text-7xl">{v(data, "heroTitle")}</h1>
        <p className="tpl-rise-3 mt-6 max-w-2xl text-lg leading-8" style={{ color: "#6d7568" }}>{v(data, "heroSubtitle")}</p>
        <div className="tpl-rise-3 mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={onCta} className="tpl-sweep px-7 py-4 text-sm font-bold" style={{ background: "#3f6f5a", color: "#f3f0e8" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => goTo("neighborhoods")} className="border px-7 py-4 text-sm font-bold" style={{ borderColor: "rgba(36,48,40,0.16)", color: "#243028" }}>{v(data, "heroSecondary")}</button>
        </div>
      </div>
    </section>
  );
}

function HomaraZigZagHomes({ data }: { data: Record<string, any> }) {
  const homes = [1, 2, 3].map((i) => ({
    title: v(data, `item${i}Title`),
    meta: v(data, `item${i}Meta`),
    text: v(data, `item${i}Text`),
    image: v(data, `item${i}Image`),
  }));
  return (
    <section className="border-y" style={{ borderColor: "rgba(36,48,40,0.14)", background: "#ebe6da" }}>
      <div className="mx-auto max-w-7xl">
        <div className="px-5 py-12 lg:px-8">
          <p className="text-xs font-bold tracking-[0.3em]" style={{ color: "#3f6f5a" }}>HOMES</p>
          <h2 className="tpl-display mt-3 text-4xl font-bold md:text-6xl">בתים עם מקום לשגרה טובה.</h2>
        </div>
        {homes.map((home, index) => (
          <article key={home.title} className="grid border-t lg:grid-cols-2" style={{ borderColor: "rgba(36,48,40,0.14)" }}>
            <div className={`min-h-[360px] overflow-hidden ${index % 2 === 1 ? "lg:order-2" : ""}`}>
              <img src={home.image} alt="" className="tpl-ken h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center p-7 lg:p-12">
              <p className="text-sm font-bold" style={{ color: "#3f6f5a" }}>{home.meta}</p>
              <h3 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{home.title}</h3>
              <p className="mt-5 text-lg leading-8" style={{ color: "#6d7568" }}>{home.text}</p>
              <div className="tpl-draw mt-8 h-px w-24" style={{ background: "#3f6f5a" }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function HomaraNeighborhoodNames({ data }: { data: Record<string, any> }) {
  const places = [v(data, "place1"), v(data, "place2"), v(data, "place3"), v(data, "place4")];
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24" style={{ background: "#f3f0e8" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.3em]" style={{ color: "#3f6f5a" }}>שכונות</p>
            <p className="mt-5 text-lg leading-8" style={{ color: "#6d7568" }}>{v(data, "neighborhoodText")}</p>
          </div>
          <div className="border-t" style={{ borderColor: "rgba(36,48,40,0.14)" }}>
            {places.map((place, index) => (
              <div key={place} className="group flex items-center justify-between border-b py-5" style={{ borderColor: "rgba(36,48,40,0.14)" }}>
                <span className="tpl-display text-5xl font-bold leading-none md:text-7xl" style={{ color: index === 1 ? "#3f6f5a" : "#243028" }}>{place}</span>
                <span className="text-sm font-bold" style={{ color: "#6d7568" }}>0{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HomaraFamilyPromise({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-y px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(36,48,40,0.14)", background: "#243028", color: "#f3f0e8" }}>
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.7fr_1.3fr] md:items-center">
        <p className="text-xs font-bold tracking-[0.3em]" style={{ color: "#b7c7a6" }}>ABOUT</p>
        <div>
          <h2 className="tpl-display text-4xl font-bold md:text-6xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8" style={{ color: "#d9d6ca" }}>{v(data, "aboutText")}</p>
        </div>
      </div>
    </section>
  );
}

function HomaraPhoneContact({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  const field = "border bg-transparent px-4 py-4 text-right outline-none";
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24" style={{ background: "#ebe6da" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="text-xs font-bold tracking-[0.3em]" style={{ color: "#3f6f5a" }}>דברו איתנו</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-6xl">{v(data, "contactTitle")}</h2>
          <a href={`tel:${v(data, "phone")}`} className="tpl-display mt-8 block text-6xl font-bold leading-none md:text-8xl" style={{ color: "#3f6f5a" }}>{v(data, "phone")}</a>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#6d7568" }}>{v(data, "contactText")}</p>
        </div>
        <form className="grid gap-4 border p-6" style={{ borderColor: "rgba(36,48,40,0.14)", background: "#f3f0e8" }} onSubmit={(e) => e.preventDefault()}>
          <input className={field} style={{ borderColor: "rgba(36,48,40,0.14)", color: "#243028" }} placeholder="שם" />
          <input className={field} style={{ borderColor: "rgba(36,48,40,0.14)", color: "#243028" }} placeholder="אזור ושכונה" />
          <input className={field} style={{ borderColor: "rgba(36,48,40,0.14)", color: "#243028" }} placeholder="כמה חדרים?" />
          <button type="button" onClick={onCta} className="tpl-sweep px-7 py-4 text-sm font-bold" style={{ background: "#3f6f5a", color: "#f3f0e8" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function HomaraWarmFooter({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(36,48,40,0.14)", background: "#f3f0e8" }}>
      <div className="mx-auto grid max-w-7xl gap-4 text-sm md:grid-cols-[1fr_auto_1fr]" style={{ color: "#6d7568" }}>
        <span className="tpl-display text-2xl font-bold" style={{ color: "#243028" }}>{v(data, "brandName")}</span>
        <span className="md:text-center">{v(data, "email")}</span>
        <span className="md:text-left">{v(data, "address")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <HomaraCircleHero data={data} goTo={goTo} onCta={onCta} />
      <HomaraZigZagHomes data={data} />
      <HomaraNeighborhoodNames data={data} />
      <HomaraFamilyPromise data={data} />
      <HomaraPhoneContact data={data} onCta={onCta} />
      <HomaraWarmFooter data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 text-center lg:px-8 lg:py-20" style={{ borderColor: "rgba(36,48,40,0.14)", background: "#f3f0e8" }}>
        <p className="text-xs font-bold tracking-[0.3em]" style={{ color: "#3f6f5a" }}>{v(data, "brandName")}</p>
        <h1 className="tpl-display mt-4 text-6xl font-bold md:text-7xl">{title}</h1>
      </section>
      {children}
      <HomaraPhoneContact data={data} onCta={onCta} />
      <HomaraWarmFooter data={data} />
    </>
  );
}

export default function HomaraPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...homaraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of homaraPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id === "homes" ? <HomaraZigZagHomes data={merged} /> : null}
        {pg.id === "neighborhoods" ? <HomaraNeighborhoodNames data={merged} /> : null}
        {pg.id === "about" ? <HomaraFamilyPromise data={merged} /> : null}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "homara-preview" : "homara"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#f3f0e8", color: "#243028" }}>
      <HomaraSoftHeader data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
