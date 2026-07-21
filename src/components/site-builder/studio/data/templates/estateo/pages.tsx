import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { estateoDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const estateoPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "estates", label: "אחוזות", slug: "/estates" },
  { id: "private", label: "פרטי", slug: "/private" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = estateoPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (estateoDefaultData as Record<string, any>)[key] ?? "";
}

function EstateoCenteredHeader({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = estateoPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  const leftNav = nav.slice(0, 2);
  const rightNav = nav.slice(2);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{ background: "rgba(16,14,12,0.92)", borderColor: "rgba(244,236,223,0.14)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 lg:px-8">
        <nav className="hidden justify-start gap-7 lg:flex">
          {leftNav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-xs font-semibold tracking-[0.22em]" style={{ color: currentPage === id ? "#d4af6a" : "#a89880" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={() => goTo("home")} className="text-center">
          <span className="tpl-display block text-3xl font-bold tracking-[0.08em]">{v(data, "brandName")}</span>
          <span className="mt-1 block text-[10px] tracking-[0.36em]" style={{ color: "#d4af6a" }}>PRIVATE ESTATES</span>
        </button>
        <div className="hidden items-center justify-end gap-7 lg:flex">
          {rightNav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-xs font-semibold tracking-[0.22em]" style={{ color: currentPage === id ? "#d4af6a" : "#a89880" }}>{label}</button>
          ))}
          <button type="button" onClick={onCta} className="border px-4 py-2 text-xs font-bold tracking-[0.18em]" style={{ borderColor: "#d4af6a", color: "#d4af6a" }}>{v(data, "heroPrimary")}</button>
        </div>
        <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center justify-self-end border lg:hidden" style={{ borderColor: "rgba(244,236,223,0.18)" }}>{open ? "×" : "☰"}</button>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(244,236,223,0.14)", background: "#100e0c" }}>
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

function EstateoPosterHero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <section className="grid min-h-[88vh] border-b lg:grid-cols-[0.42fr_0.58fr]" style={{ borderColor: "rgba(244,236,223,0.14)" }}>
      <div className="flex flex-col justify-between p-7 lg:p-12" style={{ background: "#100e0c" }}>
        <div>
          <p className="tpl-rise text-xs font-semibold tracking-[0.34em]" style={{ color: "#d4af6a" }}>{v(data, "heroEyebrow")}</p>
          <div className="tpl-draw mt-8 h-px w-32" style={{ background: "#d4af6a" }} />
        </div>
        <div className="py-12">
          <h1 className="tpl-display tpl-rise-2 text-6xl font-bold leading-[0.9] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-7 max-w-md text-lg leading-8" style={{ color: "#a89880" }}>{v(data, "heroSubtitle")}</p>
        </div>
        <div className="tpl-rise-3 flex flex-wrap gap-3">
          <button type="button" onClick={onCta} className="tpl-sweep px-7 py-4 text-sm font-bold" style={{ background: "#d4af6a", color: "#100e0c" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => goTo("estates")} className="border px-7 py-4 text-sm font-semibold" style={{ borderColor: "rgba(244,236,223,0.18)", color: "#f4ecdf" }}>{v(data, "heroSecondary")}</button>
        </div>
      </div>
      <div className="relative min-h-[58vh] overflow-hidden">
        <img src={v(data, "heroImage")} alt="" className="tpl-ken h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(16,14,12,.44), transparent 45%, rgba(16,14,12,.3))" }} />
        <div className="tpl-float absolute bottom-10 right-10 max-w-xs border p-6" style={{ borderColor: "#d4af6a", background: "rgba(16,14,12,0.84)" }}>
          <p className="text-xs tracking-[0.3em]" style={{ color: "#d4af6a" }}>PRIVATE ACCESS</p>
          <p className="tpl-display mt-3 text-3xl font-bold">{v(data, "privateBoxTitle")}</p>
          <p className="mt-3 text-sm leading-6" style={{ color: "#a89880" }}>{v(data, "privateBoxText")}</p>
        </div>
      </div>
    </section>
  );
}

function EstateoFullBleedRows({ data }: { data: Record<string, any> }) {
  const rows = [1, 2, 3].map((i) => ({
    title: v(data, `item${i}Title`),
    meta: v(data, `item${i}Meta`),
    text: v(data, `item${i}Text`),
    image: v(data, `item${i}Image`),
  }));
  return (
    <section className="border-b" style={{ borderColor: "rgba(244,236,223,0.14)", background: "#100e0c" }}>
      {rows.map((item, index) => (
        <article key={item.title} className="relative min-h-[50vh] overflow-hidden border-t" style={{ borderColor: "rgba(244,236,223,0.14)" }}>
          <img src={item.image} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: index % 2 === 0 ? "linear-gradient(90deg, rgba(16,14,12,.12), rgba(16,14,12,.86))" : "linear-gradient(270deg, rgba(16,14,12,.12), rgba(16,14,12,.86))" }} />
          <div className={`relative z-10 flex min-h-[50vh] items-end px-5 py-10 lg:px-8 ${index % 2 === 0 ? "justify-end" : "justify-start"}`}>
            <div className="max-w-xl border-t pt-6" style={{ borderColor: "#d4af6a" }}>
              <p className="text-xs font-semibold tracking-[0.3em]" style={{ color: "#d4af6a" }}>{item.meta}</p>
              <h3 className="tpl-display mt-3 text-5xl font-bold leading-none md:text-7xl">{item.title}</h3>
              <p className="mt-5 text-lg leading-8" style={{ color: "#d8ccb8" }}>{item.text}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

function EstateoManifesto({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-20 text-center lg:px-8 lg:py-28" style={{ borderColor: "rgba(244,236,223,0.14)", background: "#100e0c" }}>
      <div className="mx-auto max-w-4xl">
        <div className="tpl-draw mx-auto h-px w-40" style={{ background: "#d4af6a", transformOrigin: "center" }} />
        <p className="mt-10 text-xs font-semibold tracking-[0.34em]" style={{ color: "#d4af6a" }}>MANIFESTO</p>
        <blockquote className="tpl-display mt-6 text-4xl font-bold leading-tight md:text-6xl">{v(data, "quote")}</blockquote>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8" style={{ color: "#a89880" }}>{v(data, "aboutText")}</p>
      </div>
    </section>
  );
}

function EstateoInvitationContact({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  const field = "border-0 border-b bg-transparent px-0 py-4 text-center outline-none";
  return (
    <section className="px-5 py-20 text-center lg:px-8 lg:py-28" style={{ background: "#1a1612" }}>
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.34em]" style={{ color: "#d4af6a" }}>INVITATION</p>
        <h2 className="tpl-display mt-5 text-5xl font-bold leading-tight md:text-7xl">{v(data, "contactTitle")}</h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8" style={{ color: "#a89880" }}>{v(data, "contactText")}</p>
        <form className="mt-10 grid gap-5" onSubmit={(e) => e.preventDefault()}>
          <input className={field} style={{ borderColor: "rgba(244,236,223,0.2)", color: "#f4ecdf" }} placeholder="שם מלא" />
          <input className={field} style={{ borderColor: "rgba(244,236,223,0.2)", color: "#f4ecdf" }} placeholder="טלפון פרטי" />
          <input className={field} style={{ borderColor: "rgba(244,236,223,0.2)", color: "#f4ecdf" }} placeholder="טווח רכישה" />
          <button type="button" onClick={onCta} className="tpl-sweep mt-4 px-7 py-4 text-sm font-bold" style={{ background: "#d4af6a", color: "#100e0c" }}>{v(data, "cta")}</button>
        </form>
        <div className="mt-10 text-sm leading-7" style={{ color: "#a89880" }}>{v(data, "email")} · {v(data, "phone")}</div>
      </div>
    </section>
  );
}

function EstateoChampagneFooter({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-6 lg:px-8" style={{ borderColor: "rgba(212,175,106,0.38)", background: "#100e0c" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs tracking-[0.24em] md:flex-row" style={{ color: "#d4af6a" }}>
        <span className="tpl-display text-xl tracking-normal" style={{ color: "#f4ecdf" }}>{v(data, "brandName")}</span>
        <span>{v(data, "address")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <EstateoPosterHero data={data} goTo={goTo} onCta={onCta} />
      <EstateoFullBleedRows data={data} />
      <EstateoManifesto data={data} />
      <EstateoInvitationContact data={data} onCta={onCta} />
      <EstateoChampagneFooter data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-20 text-center lg:px-8 lg:py-24" style={{ borderColor: "rgba(244,236,223,0.14)", background: "#100e0c" }}>
        <p className="text-xs font-semibold tracking-[0.34em]" style={{ color: "#d4af6a" }}>{v(data, "brandName")}</p>
        <h1 className="tpl-display mt-5 text-6xl font-bold md:text-8xl">{title}</h1>
      </section>
      {children}
      <EstateoInvitationContact data={data} onCta={onCta} />
      <EstateoChampagneFooter data={data} />
    </>
  );
}

export default function EstateoPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...estateoDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of estateoPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id === "estates" || pg.id === "private" ? <EstateoFullBleedRows data={merged} /> : null}
        {pg.id === "about" ? <EstateoManifesto data={merged} /> : null}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "estateo-preview" : "estateo"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#100e0c", color: "#f4ecdf" }}>
      <EstateoCenteredHeader data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
