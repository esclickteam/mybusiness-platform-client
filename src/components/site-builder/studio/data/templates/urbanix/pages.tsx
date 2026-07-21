import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { urbanixDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const urbanixPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "apartments", label: "דירות", slug: "/apartments" },
  { id: "towers", label: "מגדלים", slug: "/towers" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = urbanixPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (urbanixDefaultData as Record<string, any>)[key] ?? "";
}

function UrbanixAccentHeader({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = urbanixPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{ background: "rgba(20,21,22,0.94)", borderColor: "rgba(242,242,240,0.12)", backdropFilter: "blur(10px)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-5 px-5 py-4 lg:px-8">
        <span className="tpl-pulse-line h-12 w-2" style={{ background: "#c8f542" }} />
        <button type="button" onClick={() => goTo("home")} className="text-right">
          <span className="tpl-display text-3xl font-black uppercase" style={{ color: "#f2f2f0" }}>{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-0 border-r lg:flex" style={{ borderColor: "rgba(242,242,240,0.12)" }}>
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="border-l px-4 py-2 text-xs font-black tracking-[0.18em]" style={{ borderColor: "rgba(242,242,240,0.12)", color: currentPage === id ? "#c8f542" : "#f2f2f0" }}>{label}</button>
          ))}
          <button type="button" onClick={onCta} className="px-4 py-2 text-xs font-black" style={{ background: "#c8f542", color: "#101210" }}>{v(data, "heroPrimary")}</button>
        </nav>
        <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(242,242,240,0.12)" }}>{open ? "×" : "☰"}</button>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(242,242,240,0.12)", background: "#141516" }}>
          <div className="grid gap-1 pt-3">
            {nav.map(([id, label]) => (
              <button key={id} type="button" onClick={() => { goTo(id); setOpen(false); }} className="px-3 py-3 text-right text-sm font-black">{label}</button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function UrbanixGiantHero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  const neighborhoods = [v(data, "district1Name"), v(data, "district2Name"), v(data, "district3Name"), "נווה צדק", "יפו", "רמת אביב"];
  return (
    <section className="relative overflow-hidden" style={{ background: "#141516" }}>
      <div className="px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="tpl-rise text-xs font-black tracking-[0.34em]" style={{ color: "#c8f542" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-6xl text-6xl font-black leading-[0.86] md:text-8xl lg:text-[10rem]" style={{ color: "#f2f2f0" }}>{v(data, "heroTitle")}</h1>
          <div className="mt-8 grid gap-6 lg:grid-cols-[0.5fr_0.5fr] lg:items-end">
            <p className="tpl-rise-3 max-w-xl text-xl leading-9" style={{ color: "#9a9d98" }}>{v(data, "heroSubtitle")}</p>
            <div className="tpl-rise-3 flex flex-wrap gap-3 lg:justify-end">
              <button type="button" onClick={onCta} className="tpl-sweep px-7 py-4 text-sm font-black" style={{ background: "#c8f542", color: "#101210" }}>{v(data, "heroPrimary")}</button>
              <button type="button" onClick={() => goTo("towers")} className="border px-7 py-4 text-sm font-black" style={{ borderColor: "rgba(242,242,240,0.14)", color: "#f2f2f0" }}>{v(data, "heroSecondary")}</button>
            </div>
          </div>
        </div>
      </div>
      <div className="tpl-sweep overflow-hidden border-y py-4" style={{ borderColor: "rgba(242,242,240,0.12)", background: "#1e2022" }}>
        <div className="tpl-marquee-track gap-10 px-4 text-sm font-black tracking-[0.22em]" style={{ color: "#c8f542" }}>
          {[...neighborhoods, ...neighborhoods, ...neighborhoods].map((x, i) => <span key={`${x}-${i}`} className="whitespace-nowrap">{x} /</span>)}
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.2fr_0.8fr]">
        <div className="min-h-[390px] overflow-hidden border-r" style={{ borderColor: "rgba(242,242,240,0.12)" }}>
          <img src={v(data, "heroImage")} alt="" className="tpl-ken h-full w-full object-cover grayscale" />
        </div>
        <div className="grid border-t lg:border-t-0" style={{ borderColor: "rgba(242,242,240,0.12)", background: "#1e2022" }}>
          <div className="border-b p-8" style={{ borderColor: "rgba(242,242,240,0.12)" }}>
            <div className="tpl-display text-8xl font-black leading-none" style={{ color: "#c8f542" }}>{v(data, "bigStat")}</div>
            <p className="mt-2 text-sm font-black tracking-[0.2em]" style={{ color: "#9a9d98" }}>{v(data, "bigStatLabel")}</p>
          </div>
          <div className="p-8">
            <p className="text-xs font-black tracking-[0.26em]" style={{ color: "#c8f542" }}>LIVE GRID</p>
            <p className="mt-4 text-lg leading-8" style={{ color: "#f2f2f0" }}>{v(data, "aboutText")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function UrbanixPriceMenu({ data }: { data: Record<string, any> }) {
  const items = [1, 2, 3, 4].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Text`), v(data, `item${i}Price`)]);
  return (
    <section className="border-y px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,242,240,0.12)", background: "#141516" }}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 border-b pb-8 md:flex-row md:items-end" style={{ borderColor: "rgba(242,242,240,0.12)" }}>
          <div>
            <p className="text-xs font-black tracking-[0.34em]" style={{ color: "#c8f542" }}>PRICE MENU</p>
            <h2 className="tpl-display mt-3 text-5xl font-black md:text-7xl">דירות לפי קצב ומחיר.</h2>
          </div>
          <p className="max-w-sm text-sm leading-7" style={{ color: "#9a9d98" }}>מחירון טיפוגרפי חד: שם, קו מקווקו, מחיר. בלי כרטיסים.</p>
        </div>
        <div className="mt-8">
          {items.map(([title, text, price]) => (
            <article key={title} className="grid gap-3 border-b py-6 md:grid-cols-[auto_1fr_auto] md:items-baseline" style={{ borderColor: "rgba(242,242,240,0.12)" }}>
              <h3 className="tpl-display text-4xl font-black md:text-5xl">{title}</h3>
              <div className="hidden h-px border-t border-dotted md:block" style={{ borderColor: "rgba(200,245,66,0.55)" }} />
              <div className="md:text-left">
                <p className="tpl-display text-3xl font-black" style={{ color: "#c8f542" }}>{price}</p>
                <p className="mt-1 text-sm" style={{ color: "#9a9d98" }}>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function UrbanixDistrictColumns({ data }: { data: Record<string, any> }) {
  const districts = [1, 2, 3].map((i) => ({
    name: v(data, `district${i}Name`),
    stat: v(data, `district${i}Stat`),
    text: v(data, `district${i}Text`),
  }));
  return (
    <section className="border-b" style={{ borderColor: "rgba(242,242,240,0.12)", background: "#1e2022" }}>
      <div className="mx-auto grid max-w-7xl md:grid-cols-3">
        {districts.map((district, index) => (
          <article key={district.name} className="min-h-[420px] border-b p-7 md:border-b-0 md:border-l last:border-l-0 lg:p-10" style={{ borderColor: "rgba(242,242,240,0.12)", background: index === 1 ? "#c8f542" : "#1e2022", color: index === 1 ? "#101210" : "#f2f2f0" }}>
            <p className="text-xs font-black tracking-[0.28em]" style={{ color: index === 1 ? "#101210" : "#c8f542" }}>DISTRICT 0{index + 1}</p>
            <h3 className="tpl-display mt-8 text-5xl font-black leading-none md:text-6xl">{district.name}</h3>
            <div className="tpl-display mt-12 text-7xl font-black leading-none">{district.stat}</div>
            <p className="mt-6 text-lg leading-8" style={{ color: index === 1 ? "#263018" : "#9a9d98" }}>{district.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function UrbanixLimeContact({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  const field = "border bg-transparent px-4 py-4 text-right outline-none";
  return (
    <section style={{ background: "#141516" }}>
      <div className="px-5 py-10 lg:px-8" style={{ background: "#c8f542", color: "#101210" }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="tpl-display text-5xl font-black leading-none md:text-7xl">{v(data, "contactTitle")}</h2>
          <button type="button" onClick={onCta} className="border px-7 py-4 text-sm font-black" style={{ borderColor: "#101210" }}>{v(data, "cta")}</button>
        </div>
      </div>
      <div className="px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm leading-7" style={{ color: "#9a9d98" }}>{v(data, "contactText")}</p>
            <div className="mt-8 space-y-3 text-sm font-black" style={{ color: "#c8f542" }}>
              <p>{v(data, "phone")}</p>
              <p>{v(data, "email")}</p>
              <p>{v(data, "address")}</p>
            </div>
          </div>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
            <input className={field} style={{ borderColor: "rgba(242,242,240,0.14)", color: "#f2f2f0" }} placeholder="שם" />
            <input className={field} style={{ borderColor: "rgba(242,242,240,0.14)", color: "#f2f2f0" }} placeholder="טלפון" />
            <input className={field} style={{ borderColor: "rgba(242,242,240,0.14)", color: "#f2f2f0" }} placeholder="שכונה" />
            <input className={field} style={{ borderColor: "rgba(242,242,240,0.14)", color: "#f2f2f0" }} placeholder="תקציב" />
            <textarea className={`${field} min-h-28 md:col-span-2`} style={{ borderColor: "rgba(242,242,240,0.14)", color: "#f2f2f0" }} placeholder="מה הדדליין לכניסה?" />
          </form>
        </div>
      </div>
    </section>
  );
}

function UrbanixBrutalistFooter({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t" style={{ borderColor: "rgba(242,242,240,0.12)", background: "#0a0b0c" }}>
      <div className="mx-auto grid max-w-7xl border-r text-sm md:grid-cols-4" style={{ borderColor: "rgba(242,242,240,0.12)", color: "#f2f2f0" }}>
        {[v(data, "brandName"), v(data, "email"), v(data, "phone"), "NO SOFT CORNERS"].map((item, index) => (
          <div key={item} className="border-b border-l p-5 font-black md:border-b-0" style={{ borderColor: "rgba(242,242,240,0.12)", color: index === 3 ? "#c8f542" : "#f2f2f0" }}>{item}</div>
        ))}
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <UrbanixGiantHero data={data} goTo={goTo} onCta={onCta} />
      <UrbanixPriceMenu data={data} />
      <UrbanixDistrictColumns data={data} />
      <UrbanixLimeContact data={data} onCta={onCta} />
      <UrbanixBrutalistFooter data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,242,240,0.12)", background: "#141516" }}>
        <p className="text-xs font-black tracking-[0.34em]" style={{ color: "#c8f542" }}>{v(data, "brandName")}</p>
        <h1 className="tpl-display mt-4 text-7xl font-black leading-none md:text-9xl">{title}</h1>
      </section>
      {children}
      <UrbanixLimeContact data={data} onCta={onCta} />
      <UrbanixBrutalistFooter data={data} />
    </>
  );
}

export default function UrbanixPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...urbanixDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of urbanixPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id === "apartments" ? <UrbanixPriceMenu data={merged} /> : null}
        {pg.id === "towers" || pg.id === "about" ? <UrbanixDistrictColumns data={merged} /> : null}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "urbanix-preview" : "urbanix"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#141516", color: "#f2f2f0" }}>
      <UrbanixAccentHeader data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
