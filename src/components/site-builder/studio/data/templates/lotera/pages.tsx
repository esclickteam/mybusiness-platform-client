import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { loteraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const loteraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "listings", label: "נכסים", slug: "/listings" },
  { id: "areas", label: "אזורים", slug: "/areas" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = loteraPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (loteraDefaultData as Record<string, any>)[key] ?? "";
}

function LoteraSeaHeader({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = loteraPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 -mb-[74px] border-b"
      style={{ background: "rgba(7,19,31,0.34)", borderColor: "rgba(238,245,251,0.18)", backdropFilter: "blur(14px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="h-9 w-px" style={{ background: "#5eb4ff" }} />
          <span className="tpl-display text-2xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="relative pb-1 text-sm font-semibold"
              style={{ color: currentPage === id ? "#eef5fb" : "#b5c9da" }}>
              {label}
              {currentPage === id ? <span className="absolute inset-x-0 -bottom-1 h-px" style={{ background: "#5eb4ff" }} /> : null}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden border px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ borderColor: "#5eb4ff", color: "#eef5fb" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(238,245,251,0.22)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(238,245,251,0.18)", background: "#07131f" }}>
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

function LoteraCinematicHero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  const teasers = [1, 2, 3].map((i) => [v(data, `dock${i}Title`), v(data, `dock${i}Text`), v(data, `dock${i}Meta`)]);
  return (
    <section className="relative isolate min-h-[100vh] overflow-hidden">
      <img src={v(data, "heroImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(7,19,31,0.38) 0%, rgba(7,19,31,0.16) 40%, #07131f 100%)" }} />
      <div className="tpl-pulse-line absolute inset-x-0 top-[45%] h-px" style={{ background: "linear-gradient(90deg, transparent, #5eb4ff, transparent)" }} />
      <div className="relative z-10 mx-auto flex min-h-[100vh] max-w-7xl flex-col justify-end px-5 pb-32 pt-36 lg:px-8">
        <p className="tpl-rise text-xs font-semibold tracking-[0.34em]" style={{ color: "#5eb4ff" }}>{v(data, "heroEyebrow")}</p>
        <h1 className="tpl-display tpl-rise-2 mt-5 max-w-5xl text-6xl font-bold leading-[0.9] md:text-8xl lg:text-9xl">{v(data, "heroTitle")}</h1>
        <p className="tpl-rise-3 mt-6 max-w-2xl text-xl leading-9" style={{ color: "#c2d6e8" }}>{v(data, "heroSubtitle")}</p>
        <div className="tpl-rise-3 mt-9 flex flex-wrap gap-3">
          <button type="button" onClick={onCta} className="tpl-sweep px-7 py-4 text-sm font-bold" style={{ background: "#5eb4ff", color: "#041018" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => goTo("listings")} className="border px-7 py-4 text-sm font-semibold" style={{ borderColor: "rgba(238,245,251,0.24)", color: "#eef5fb" }}>{v(data, "heroSecondary")}</button>
        </div>
      </div>
      <div className="absolute inset-x-5 bottom-6 z-20 mx-auto max-w-7xl lg:inset-x-8">
        <div className="grid border backdrop-blur-xl md:grid-cols-3" style={{ borderColor: "rgba(238,245,251,0.22)", background: "rgba(7,19,31,0.62)" }}>
          {teasers.map(([title, text, meta], index) => (
            <button key={title} type="button" onClick={() => goTo("listings")} className="group border-b p-5 text-right md:border-b-0 md:border-l last:border-l-0"
              style={{ borderColor: "rgba(238,245,251,0.16)" }}>
              <span className="text-xs font-bold tracking-[0.24em]" style={{ color: "#5eb4ff" }}>0{index + 1} / {meta}</span>
              <strong className="tpl-display mt-3 block text-2xl font-bold">{title}</strong>
              <span className="mt-2 block text-sm leading-6" style={{ color: "#adc4d8" }}>{text}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function LoteraTideRail({ data }: { data: Record<string, any> }) {
  const listings = [1, 2, 3, 4].map((i) => ({
    title: v(data, `item${i}Title`),
    meta: v(data, `item${i}Meta`),
    text: v(data, `item${i}Text`),
    image: v(data, `item${i}Image`),
  }));
  return (
    <section className="overflow-hidden border-t py-16 lg:py-24" style={{ borderColor: "rgba(238,245,251,0.16)", background: "#07131f" }}>
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-8 px-5 lg:px-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em]" style={{ color: "#5eb4ff" }}>קו מים נבחר</p>
          <h2 className="tpl-display mt-4 max-w-2xl text-5xl font-bold leading-none md:text-7xl">נכסים שנראים כמו אופק פתוח.</h2>
        </div>
        <p className="hidden max-w-xs text-sm leading-7 lg:block" style={{ color: "#8fa8bd" }}>מסילה אופקית עם עומק, מחיר ותחושת מקום - לא רשימת כרטיסים רגילה.</p>
      </div>
      <div className="mt-12 overflow-x-auto px-5 pb-4 lg:px-8">
        <div className="flex min-w-max gap-6">
          {listings.map((item, index) => (
            <article key={item.title} className="group w-[76vw] max-w-[520px] border md:w-[480px]" style={{ borderColor: "rgba(238,245,251,0.16)", background: "#0b1b2a" }}>
              <div className="h-72 overflow-hidden">
                <img src={item.image} alt="" className="tpl-ken h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-5 p-6">
                <span className="tpl-display text-5xl font-bold" style={{ color: "#5eb4ff" }}>{index + 1}</span>
                <div>
                  <h3 className="tpl-display text-3xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm font-semibold" style={{ color: "#5eb4ff" }}>{item.meta}</p>
                  <p className="mt-4 text-base leading-7" style={{ color: "#a9c0d4" }}>{item.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LoteraWaterStory({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative border-t px-5 py-20 lg:px-8 lg:py-28" style={{ borderColor: "rgba(238,245,251,0.16)" }}>
      <div className="mx-auto grid max-w-7xl items-center gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="min-h-[520px] overflow-hidden">
          <img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" />
        </div>
        <div className="relative border p-8 lg:-mr-20 lg:p-12" style={{ borderColor: "rgba(238,245,251,0.18)", background: "rgba(7,19,31,0.92)" }}>
          <div className="tpl-draw mb-8 h-px w-28" style={{ background: "#5eb4ff" }} />
          <p className="text-xs font-bold tracking-[0.28em]" style={{ color: "#5eb4ff" }}>הסיפור שלנו</p>
          <h2 className="tpl-display mt-4 text-5xl font-bold leading-tight md:text-6xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 text-lg leading-9" style={{ color: "#a9c0d4" }}>{v(data, "aboutText")}</p>
          <blockquote className="mt-8 border-r-2 pr-5 text-2xl leading-10" style={{ borderColor: "#5eb4ff", color: "#eef5fb" }}>{v(data, "quote")}</blockquote>
        </div>
      </div>
    </section>
  );
}

function LoteraHarborContact({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  const field = "border-0 border-b bg-transparent px-0 py-4 text-right outline-none";
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-24" style={{ borderColor: "rgba(238,245,251,0.16)", background: "#030910" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em]" style={{ color: "#5eb4ff" }}>עוגנים שיחה</p>
          <h2 className="tpl-display mt-4 text-5xl font-bold leading-tight md:text-7xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#9db5c9" }}>{v(data, "contactText")}</p>
          <div className="mt-10 grid gap-3 text-sm" style={{ color: "#c2d6e8" }}>
            <span>{v(data, "phone")}</span>
            <span>{v(data, "email")}</span>
            <span>{v(data, "address")}</span>
          </div>
        </div>
        <form className="grid gap-5 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <input className={field} style={{ borderColor: "rgba(238,245,251,0.22)", color: "#eef5fb" }} placeholder="שם מלא" />
          <input className={field} style={{ borderColor: "rgba(238,245,251,0.22)", color: "#eef5fb" }} placeholder="טלפון" />
          <input className={field} style={{ borderColor: "rgba(238,245,251,0.22)", color: "#eef5fb" }} placeholder="אזור מבוקש" />
          <input className={field} style={{ borderColor: "rgba(238,245,251,0.22)", color: "#eef5fb" }} placeholder="תקציב" />
          <textarea className={`${field} min-h-24 md:col-span-2`} style={{ borderColor: "rgba(238,245,251,0.22)", color: "#eef5fb" }} placeholder="מה חשוב לכם לראות מהחלון?" />
          <button type="button" onClick={onCta} className="tpl-sweep px-7 py-4 text-sm font-bold md:col-span-2" style={{ background: "#5eb4ff", color: "#041018" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function LoteraPierFooter({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(238,245,251,0.12)", background: "#07131f" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#8fa8bd" }}>
        <span className="tpl-display text-2xl font-bold" style={{ color: "#eef5fb" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <LoteraCinematicHero data={data} goTo={goTo} onCta={onCta} />
      <LoteraTideRail data={data} />
      <LoteraWaterStory data={data} />
      <LoteraHarborContact data={data} onCta={onCta} />
      <LoteraPierFooter data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 pb-16 pt-32 lg:px-8 lg:pb-20 lg:pt-36" style={{ borderColor: "rgba(238,245,251,0.16)", background: "#07131f" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.3em]" style={{ color: "#5eb4ff" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-6xl font-bold md:text-7xl">{title}</h1>
        </div>
      </section>
      {children}
      <LoteraHarborContact data={data} onCta={onCta} />
      <LoteraPierFooter data={data} />
    </>
  );
}

export default function LoteraPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...loteraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of loteraPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id === "listings" ? <LoteraTideRail data={merged} /> : null}
        {pg.id === "areas" || pg.id === "about" ? <LoteraWaterStory data={merged} /> : null}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "lotera-preview" : "lotera"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#07131f", color: "#eef5fb" }}>
      <LoteraSeaHeader data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
