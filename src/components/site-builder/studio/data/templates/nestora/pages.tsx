import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { nestoraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const nestoraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "featured", label: "נבחרים", slug: "/featured" },
  { id: "approach", label: "גישה", slug: "/approach" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = nestoraPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (nestoraDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const nav = nestoraPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b"
      style={{ background: "#eef1f5f3", borderColor: "rgba(61,90,128,0.16)", backdropFilter: "blur(14px)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="tpl-display text-3xl font-bold leading-none" style={{ color: "#1e2836" }}>
          {v(data, "brandName")}
        </button>
        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm" style={{ color: currentPage === id ? "#3d5a80" : "#6a7585" }}>
              {label}
            </button>
          ))}
        </nav>
        <button type="button" onClick={() => setOpen((x) => !x)} className="border px-3 py-2 text-sm lg:hidden" style={{ borderColor: "rgba(61,90,128,0.2)" }}>
          {open ? "סגור" : "תפריט"}
        </button>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(61,90,128,0.16)" }}>
          <div className="grid pt-3">
            {nav.map(([id, label]) => (
              <button key={id} type="button" onClick={() => { goTo(id); setOpen(false); }} className="border-b py-3 text-right text-sm" style={{ borderColor: "rgba(61,90,128,0.12)" }}>{label}</button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function QuoteFeatureHero({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24" style={{ background: "#eef1f5" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-bold tracking-[0.32em]" style={{ color: "#3d5a80" }}>{v(data, "heroEyebrow")}</p>
        <blockquote className="tpl-display tpl-rise-2 mt-6 max-w-5xl text-5xl font-bold leading-[1.06] md:text-7xl" style={{ color: "#1e2836" }}>
          <span style={{ color: "#3d5a80" }}>“</span>{v(data, "quote")}<span style={{ color: "#3d5a80" }}>”</span>
        </blockquote>
        <div className="mt-10 grid gap-10 lg:grid-cols-[0.45fr_1fr] lg:items-end">
          <div>
            <h1 className="tpl-display text-4xl font-bold" style={{ color: "#1e2836" }}>{v(data, "heroTitle")}</h1>
            <p className="mt-5 text-lg leading-8" style={{ color: "#6a7585" }}>{v(data, "heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => goTo("contact")} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#3d5a80", color: "#eef1f5" }}>{v(data, "heroPrimary")}</button>
              <button type="button" onClick={() => goTo("featured")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(61,90,128,0.22)", color: "#1e2836" }}>{v(data, "heroSecondary")}</button>
            </div>
          </div>
          <figure className="tpl-sweep relative overflow-hidden border" style={{ borderColor: "rgba(61,90,128,0.16)" }}>
            <img src={v(data, "heroImage")} alt="" className="tpl-ken aspect-[16/9] w-full object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 grid gap-3 border-t px-5 py-4 md:grid-cols-[auto_1fr_auto]" style={{ borderColor: "rgba(238,241,245,0.28)", background: "rgba(18,24,32,0.82)", color: "#eef1f5" }}>
              <span className="text-xs font-bold tracking-[0.3em]" style={{ color: "#9eb3ce" }}>FEATURED</span>
              <span className="tpl-display text-2xl font-bold">{v(data, "featuredTitle")}</span>
              <span className="text-sm" style={{ color: "#c8d1de" }}>{v(data, "featuredMeta")}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function BoutiqueProperties({ data }: { data: Record<string, any> }) {
  const properties = [1, 2, 3].map((i) => ({
    title: v(data, `property${i}Title`),
    text: v(data, `property${i}Text`),
    image: v(data, `property${i}Image`),
  }));
  return (
    <section className="border-t px-5 lg:px-8" style={{ borderColor: "rgba(61,90,128,0.14)", background: "#eef1f5" }}>
      <div className="mx-auto max-w-5xl">
        {properties.map((property, index) => (
          <article key={property.title} className="border-b py-20 md:py-28" style={{ borderColor: "rgba(61,90,128,0.14)" }}>
            <div className="overflow-hidden border" style={{ borderColor: "rgba(61,90,128,0.14)" }}>
              <img src={property.image} alt="" className="h-[52vh] min-h-[340px] w-full object-cover" />
            </div>
            <div className="mx-auto mt-8 max-w-2xl text-center">
              <p className="text-xs font-bold tracking-[0.32em]" style={{ color: "#3d5a80" }}>{String(index + 1).padStart(2, "0")}</p>
              <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl" style={{ color: "#1e2836" }}>{property.title}</h2>
              <p className="mt-5 text-lg leading-8" style={{ color: "#6a7585" }}>{property.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PersonalLetter({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-24" style={{ borderColor: "rgba(61,90,128,0.14)", background: "#e2e7ee" }}>
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold tracking-[0.32em]" style={{ color: "#3d5a80" }}>המכתב שלנו</p>
        <h2 className="tpl-display mt-5 text-5xl font-bold md:text-6xl" style={{ color: "#1e2836" }}>{v(data, "approachTitle")}</h2>
        <div className="mt-10 space-y-8 text-xl leading-10" style={{ color: "#445064" }}>
          <p>{v(data, "approachParagraph1")}</p>
          <p>{v(data, "approachParagraph2")}</p>
          <p>{v(data, "approachParagraph3")}</p>
        </div>
      </div>
    </section>
  );
}

function PersonalContact({ data }: { data: Record<string, any> }) {
  const field = "border bg-transparent px-4 py-3.5 text-right outline-none";
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-24" style={{ borderColor: "rgba(61,90,128,0.14)", background: "#eef1f5" }}>
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.85fr]">
        <div className="border-r pr-7" style={{ borderColor: "#3d5a80" }}>
          <p className="text-xs font-bold tracking-[0.32em]" style={{ color: "#3d5a80" }}>פתק אישי</p>
          <h2 className="tpl-display mt-5 text-5xl font-bold md:text-6xl" style={{ color: "#1e2836" }}>{v(data, "contactTitle")}</h2>
          <p className="mt-6 max-w-xl text-xl leading-9" style={{ color: "#6a7585" }}>{v(data, "contactText")}</p>
          <div className="mt-10 space-y-2 text-sm" style={{ color: "#6a7585" }}>
            <p>{v(data, "phone")}</p>
            <p>{v(data, "email")}</p>
          </div>
        </div>
        <form className="grid gap-3 self-start" onSubmit={(e) => e.preventDefault()}>
          <input className={field} style={{ borderColor: "rgba(61,90,128,0.2)", color: "#1e2836" }} placeholder="שם" />
          <input className={field} style={{ borderColor: "rgba(61,90,128,0.2)", color: "#1e2836" }} placeholder="טלפון" />
          <textarea className={`${field} min-h-32`} style={{ borderColor: "rgba(61,90,128,0.2)", color: "#1e2836" }} placeholder="מה יהיה בית מדויק עבורכם?" />
          <button type="button" className="tpl-sweep px-6 py-4 text-sm font-bold" style={{ background: "#3d5a80", color: "#eef1f5" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function QuietFooter({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-12 text-center lg:px-8" style={{ borderColor: "rgba(61,90,128,0.14)", background: "#eef1f5" }}>
      <span className="tpl-display text-3xl font-bold" style={{ color: "#1e2836" }}>{v(data, "brandName")}</span>
    </footer>
  );
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <QuoteFeatureHero data={data} goTo={goTo} />
      <BoutiqueProperties data={data} />
      <PersonalLetter data={data} />
      <PersonalContact data={data} />
      <QuietFooter data={data} />
    </>
  );
}

function InnerPage({ data, title, children }: { data: Record<string, any>; title: string; children: React.ReactNode }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(61,90,128,0.14)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.32em]" style={{ color: "#3d5a80" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl" style={{ color: "#1e2836" }}>{title}</h1>
        </div>
      </section>
      {children}
      <QuietFooter data={data} />
    </>
  );
}

export default function NestoraPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...nestoraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} />,
    featured: <InnerPage data={merged} title="נבחרים"><BoutiqueProperties data={merged} /></InnerPage>,
    approach: <InnerPage data={merged} title="גישה"><PersonalLetter data={merged} /></InnerPage>,
    about: <InnerPage data={merged} title="אודות"><PersonalLetter data={merged} /><BoutiqueProperties data={merged} /></InnerPage>,
    contact: <InnerPage data={merged} title="יצירת קשר"><PersonalContact data={merged} /></InnerPage>,
  };
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "nestora-preview" : "nestora"} className="min-h-screen w-full overflow-x-hidden" style={{ background: "#eef1f5", color: "#1e2836" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
