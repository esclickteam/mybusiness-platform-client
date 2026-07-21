import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { tidehausDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const tidehausPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "boards", label: "גלשנים", slug: "/boards" },
  { id: "forecast", label: "תחזית", slug: "/forecast" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "חנות", slug: "/contact" },
];

const allowedPages = tidehausPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (tidehausDefaultData as Record<string, any>)[key] ?? "";
}
function cx(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = tidehausPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#eef6fbf2", borderColor: "rgba(12,42,58,0.12)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#0077b6", color: "#ffffff" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#0c2a3a" : "#4a7185" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#0077b6", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(12,42,58,0.12)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(12,42,58,0.12)" }}>
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
      <input className={field} style={{ borderColor: "rgba(12,42,58,0.12)", color: "#0c2a3a" }} placeholder="שם מלא" />
      <input className={field} style={{ borderColor: "rgba(12,42,58,0.12)", color: "#0c2a3a" }} placeholder="טלפון" />
      <input className={field} style={{ borderColor: "rgba(12,42,58,0.12)", color: "#0c2a3a" }} placeholder="אימייל" />
      <textarea className={cx(field, "min-h-28")} style={{ borderColor: "rgba(12,42,58,0.12)", color: "#0c2a3a" }} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#0077b6", color: "#ffffff" }}>{v(data, "cta")}</button>
    </form>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative min-h-[88vh] overflow-hidden">
        <img src={v(data, "heroImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #eef6fb88, #eef6fbee 70%)" }} />
        <div className="tpl-tide-line absolute inset-x-0 top-[58%] h-[3px]" style={{ background: "repeating-linear-gradient(90deg, #0077b6, #0077b6 12px, transparent 12px, transparent 24px)" }} />
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-5 pt-24 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#0077b6" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-7xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#4a7185" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#0077b6", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("boards")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(12,42,58,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </section>
  );
}


function SurfboardRail({ data }: { data: Record<string, any> }) {
  const boards = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(12,42,58,0.12)", background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">מסילת גלשנים</h2>
        <div className="tpl-board-rail mt-10 pb-2">
          {boards.map(([title, meta, text, img], i) => (
            <article key={title} className="tpl-board-card overflow-hidden border" style={{ borderColor: "rgba(12,42,58,0.12)", background: "#eef6fb", animationDelay: `${i * 0.4}s` }}>
              <img src={img} alt="" className="aspect-[3/5] w-full object-cover" />
              <div className="p-4">
                <p className="text-xs font-bold" style={{ color: "#0077b6" }}>{meta}</p>
                <h3 className="tpl-display mt-1 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm" style={{ color: "#4a7185" }}>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WaveForecast({ data }: { data: Record<string, any> }) {
  const waves = [["08:00", "0.8m"], ["12:00", "1.2m"], ["16:00", "1.6m"], ["20:00", "0.9m"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(12,42,58,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <h3 className="tpl-display text-2xl font-bold">תחזית גלים היום</h3>
        <div className="mt-6 flex flex-wrap gap-3">
          {waves.map(([time, height]) => (
            <div key={time} className="border px-5 py-4 text-center" style={{ borderColor: "rgba(12,42,58,0.12)" }}>
              <div className="text-xs" style={{ color: "#4a7185" }}>{time}</div>
              <div className="tpl-display mt-1 text-2xl font-bold" style={{ color: "#0077b6" }}>{height}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(12,42,58,0.12)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#0077b6" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#4a7185" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="min-h-[360px] overflow-hidden"><img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(12,42,58,0.12)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#0077b6" }}>יצירת קשר</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#4a7185" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#4a7185" }}>
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
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(12,42,58,0.12)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#4a7185" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#0c2a3a" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <SurfboardRail data={data} />
      <WaveForecast data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(12,42,58,0.12)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#0077b6" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function TidehausPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...tidehausDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of tidehausPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <SurfboardRail data={merged} />
        <WaveForecast data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "tidehaus-preview" : "tidehaus"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#eef6fb", color: "#0c2a3a" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
