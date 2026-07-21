import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { horizonixDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const horizonixPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "tours", label: "סיורים", slug: "/tours" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = horizonixPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (horizonixDefaultData as Record<string, any>)[key] ?? "";
}
function cx(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = horizonixPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#0d1117f2", borderColor: "rgba(240,246,252,0.12)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#58a6ff", color: "#0d1117" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#f0f6fc" : "#8b949e" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#58a6ff", color: "#0d1117" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(240,246,252,0.12)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(240,246,252,0.12)" }}>
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

function ContactForm({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  const field = "w-full border bg-transparent px-4 py-3.5 text-right outline-none";
  return (
    <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
      <input className={field} style={{ borderColor: "rgba(240,246,252,0.12)", color: "#f0f6fc" }} placeholder="שם מלא" />
      <input className={field} style={{ borderColor: "rgba(240,246,252,0.12)", color: "#f0f6fc" }} placeholder="טלפון" />
      <input className={field} style={{ borderColor: "rgba(240,246,252,0.12)", color: "#f0f6fc" }} placeholder="אימייל" />
      <textarea className={cx(field, "min-h-28")} style={{ borderColor: "rgba(240,246,252,0.12)", color: "#f0f6fc" }} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#58a6ff", color: "#0d1117" }}>{v(data, "cta")}</button>
    </form>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative overflow-hidden">
        <div className="overflow-hidden">
          <div className="tpl-pan-track">
            {[v(data, "heroImage"), v(data, "item1Image"), v(data, "item2Image")].map((src, i) => (
              <div key={i} className="tpl-pan-panel relative">
                <img src={src} alt="" className="h-full min-h-[72vh] w-full object-cover" />
                <div className="absolute inset-0 flex items-end p-8" style={{ background: "linear-gradient(180deg, transparent 40%, #010409cc)" }}>
                  {i === 0 ? (
                    <>
                      <div>
                        <p className="text-xs tracking-[0.24em]" style={{ color: "#58a6ff" }}>{v(data, "heroEyebrow")}</p>
                        <h1 className="tpl-display mt-3 max-w-xl text-5xl font-bold md:text-6xl">{v(data, "heroTitle")}</h1>
                        <p className="mt-4 max-w-md text-base leading-7" style={{ color: "#8b949e" }}>{v(data, "heroSubtitle")}</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <button type="button" onClick={onCta} className="px-6 py-3 text-sm font-bold" style={{ background: "#58a6ff", color: "#0d1117" }}>{v(data, "heroPrimary")}</button>
                          <button type="button" onClick={() => goTo("gallery")} className="border px-6 py-3 text-sm font-semibold" style={{ borderColor: "rgba(240,246,252,0.12)" }}>{v(data, "heroSecondary")}</button>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
}


function GalleryZoomGrid({ data }: { data: Record<string, any> }) {
  const shots = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(240,246,252,0.12)", background: "#161b22" }}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">גלריית חוף</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {shots.map(([title, meta, img]) => (
            <figure key={title} className="tpl-gallery-zoom overflow-hidden border" style={{ borderColor: "rgba(240,246,252,0.12)" }}>
              <img src={img} alt="" className="aspect-[4/5] w-full object-cover" />
              <figcaption className="p-4">
                <p className="text-xs" style={{ color: "#58a6ff" }}>{meta}</p>
                <p className="tpl-display mt-1 text-lg font-bold">{title}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function TourPackages({ data }: { data: Record<string, any> }) {
  const tours = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`)]);
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(240,246,252,0.12)" }}>
      <div className="mx-auto max-w-7xl grid gap-4 md:grid-cols-3">
        {tours.map(([title, meta, text]) => (
          <div key={title} className="border p-5" style={{ borderColor: "rgba(240,246,252,0.12)" }}>
            <p className="text-xs font-semibold" style={{ color: "#58a6ff" }}>{meta}</p>
            <h3 className="tpl-display mt-2 text-xl font-bold">{title}</h3>
            <p className="mt-2 text-sm" style={{ color: "#8b949e" }}>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(240,246,252,0.12)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#58a6ff" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#8b949e" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="min-h-[360px] overflow-hidden"><img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(240,246,252,0.12)", background: "#161b22" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#58a6ff" }}>יצירת קשר</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#8b949e" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#8b949e" }}>
            <p>{v(data, "phone")}</p>
            <p>{v(data, "email")}</p>
            <p>{v(data, "address")}</p>
          </div>
        </div>
        <ContactForm data={data} onCta={onCta} />
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(240,246,252,0.12)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#8b949e" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#f0f6fc" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <GalleryZoomGrid data={data} />
      <TourPackages data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(240,246,252,0.12)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#58a6ff" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function HorizonixPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...horizonixDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of horizonixPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <GalleryZoomGrid data={merged} />
        <TourPackages data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "horizonix-preview" : "horizonix"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#0d1117", color: "#f0f6fc" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
