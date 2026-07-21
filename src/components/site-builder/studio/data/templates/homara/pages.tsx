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
function cx(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = homaraPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#f7f2eaf2", borderColor: "rgba(36,48,24,0.16)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#3f6f5a", color: "#1A1612" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#2a241c" : "#6f665c" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#3f6f5a", color: "#f7f2ea" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(36,48,24,0.16)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(36,48,24,0.16)" }}>
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
      <input className={field} style={{ borderColor: "rgba(36,48,24,0.16)", color: "#2a241c" }} placeholder="שם מלא" />
      <input className={field} style={{ borderColor: "rgba(36,48,24,0.16)", color: "#2a241c" }} placeholder="טלפון" />
      <input className={field} style={{ borderColor: "rgba(36,48,24,0.16)", color: "#2a241c" }} placeholder="אימייל" />
      <textarea className={cx(field, "min-h-28")} style={{ borderColor: "rgba(36,48,24,0.16)", color: "#2a241c" }} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#3f6f5a", color: "#f7f2ea" }}>{v(data, "cta")}</button>
    </form>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  const layout = "editorial";
  const actions = (
    <div className="mt-8 flex flex-wrap gap-3">
      <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#3f6f5a", color: "#f7f2ea" }}>{v(data, "heroPrimary")}</button>
      <button type="button" onClick={() => goTo("homes")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(36,48,24,0.16)" }}>{v(data, "heroSecondary")}</button>
    </div>
  );

  if (layout === "type") {
    return (
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <img src={v(data, "heroImage")} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, #f7f2eaf5 0%, #f7f2ea90 50%, transparent 100%)" }} />
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.26em]" style={{ color: "#3f6f5a" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display mt-4 max-w-4xl text-6xl font-extrabold leading-[0.95] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#6f665c" }}>{v(data, "heroSubtitle")}</p>
          {actions}
        </div>
      </section>
    );
  }

  if (layout === "poster") {
    return (
      <section className="mx-auto grid max-w-7xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex min-h-[70vh] flex-col justify-between border p-8 lg:p-12" style={{ borderColor: "rgba(36,48,24,0.16)", background: "#efe7db" }}>
          <div>
            <p className="text-xs font-semibold tracking-[0.26em]" style={{ color: "#3f6f5a" }}>{v(data, "heroEyebrow")}</p>
            <h1 className="tpl-display mt-8 text-6xl font-bold leading-[0.95] md:text-7xl">{v(data, "heroTitle")}</h1>
          </div>
          <div>
            <p className="max-w-md text-lg leading-8" style={{ color: "#6f665c" }}>{v(data, "heroSubtitle")}</p>
            {actions}
          </div>
        </div>
        <div className="min-h-[50vh] border-t lg:border-t-0 lg:border-r" style={{ borderColor: "rgba(36,48,24,0.16)" }}>
          <img src={v(data, "heroImage")} alt="" className="h-full w-full object-cover lg:min-h-[70vh]" />
        </div>
      </section>
    );
  }

  if (layout === "magazine") {
    return (
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#3f6f5a" }}>{v(data, "heroEyebrow")}</p>
            <h1 className="tpl-display mt-4 text-5xl font-bold leading-[1.02] md:text-7xl">{v(data, "heroTitle")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#6f665c" }}>{v(data, "heroSubtitle")}</p>
            {actions}
          </div>
          <div className="min-h-[340px] border" style={{ borderColor: "rgba(36,48,24,0.16)" }}>
            <img src={v(data, "heroImage")} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    );
  }

  if (layout === "editorial" || layout === "airy" || layout === "bands" || layout === "split") {
    return (
      <section className="relative isolate overflow-hidden">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center px-5 py-16 lg:px-8 lg:py-24">
            <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#3f6f5a" }}>{v(data, "heroEyebrow")}</p>
            <h1 className="tpl-display mt-5 text-5xl font-bold leading-[1.02] md:text-7xl">{v(data, "heroTitle")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#6f665c" }}>{v(data, "heroSubtitle")}</p>
            {actions}
          </div>
          <div className="min-h-[420px]">
            <img src={v(data, "heroImage")} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate min-h-[86vh] overflow-hidden">
      <img src={v(data, "heroImage")} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, #f7f2eaf2 0%, #f7f2ea95 46%, transparent 78%)" }} />
      <div className="relative z-10 mx-auto flex min-h-[86vh] max-w-7xl items-end px-5 pb-16 pt-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.26em]" style={{ color: "#3f6f5a" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display mt-4 text-6xl font-bold leading-[0.95] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="mt-6 max-w-lg text-lg leading-8" style={{ color: "#6f665c" }}>{v(data, "heroSubtitle")}</p>
          {actions}
        </div>
      </div>
    </section>
  );
}

function ImageBand({ title, text, image, reverse = false }: { title: string; text: string; image: string; reverse?: boolean }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(36,48,24,0.16)" }}>
      <div className={cx("mx-auto grid max-w-7xl lg:grid-cols-2", reverse && "lg:[&>*:first-child]:order-2")}>
        <div className="flex flex-col justify-center px-5 py-16 lg:px-12 lg:py-24">
          <h2 className="tpl-display text-4xl font-bold leading-[1.08] md:text-5xl">{title}</h2>
          <p className="mt-6 max-w-md text-base leading-8" style={{ color: "#6f665c" }}>{text}</p>
        </div>
        <div className="min-h-[320px] lg:min-h-[500px]"><img src={image} alt="" className="h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function ItemsList({ data }: { data: Record<string, any> }) {
  const items = [
    [v(data, "item1Title"), v(data, "item1Meta"), v(data, "item1Text")],
    [v(data, "item2Title"), v(data, "item2Meta"), v(data, "item2Text")],
    [v(data, "item3Title"), v(data, "item3Meta"), v(data, "item3Text")],
  ];
  return (
    <section className="border-t px-5 py-20 lg:px-8 lg:py-28" style={{ borderColor: "rgba(36,48,24,0.16)" }}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "roomsTitle")}</h2>
        <div className="mt-12">
          {items.map(([title, meta, text]) => (
            <div key={title} className="grid gap-3 border-t py-8 md:grid-cols-[1fr_0.55fr_1.2fr] md:items-baseline" style={{ borderColor: "rgba(36,48,24,0.16)" }}>
              <h3 className="tpl-display text-2xl font-bold">{title}</h3>
              <p className="text-sm font-semibold" style={{ color: "#3f6f5a" }}>{meta}</p>
              <p className="text-base leading-7" style={{ color: "#6f665c" }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(36,48,24,0.16)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-12 lg:py-24">
          <h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#6f665c" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="min-h-[360px]"><img src={v(data, "aboutImage")} alt="" className="h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-20 lg:px-8 lg:py-28" style={{ borderColor: "rgba(36,48,24,0.16)" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-5 max-w-md text-base leading-8" style={{ color: "#6f665c" }}>{v(data, "contactText")}</p>
          <div className="mt-10 space-y-3 text-sm">
            <p><span style={{ color: "#6f665c" }}>טלפון · </span>{v(data, "phone")}</p>
            <p><span style={{ color: "#6f665c" }}>אימייל · </span>{v(data, "email")}</p>
            <p><span style={{ color: "#6f665c" }}>כתובת · </span>{v(data, "address")}</p>
          </div>
        </div>
        <ContactForm data={data} onCta={onCta} />
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(36,48,24,0.16)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#6f665c" }}>
        <p>© {new Date().getFullYear()} {v(data, "brandName")}</p>
        <p>תבנית Homara · Bizuply Studio</p>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <ImageBand title={v(data, "bandOneTitle")} text={v(data, "bandOneText")} image={v(data, "bandOneImage")} />
      <ImageBand title={v(data, "bandTwoTitle")} text={v(data, "bandTwoText")} image={v(data, "bandTwoImage")} reverse />
      <ItemsList data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(36,48,24,0.16)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#3f6f5a" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
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
  for (const p of homaraPages) {
    if (p.id === "home") continue;
    pageContent[p.id] = (
      <InnerPage data={merged} title={p.label} onCta={() => goTo("contact")}>
        {p.id.includes("contact") ? null : (<><ItemsList data={merged} /><AboutBlock data={merged} /></>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "homara-preview" : "homara"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#f7f2ea", color: "#2a241c" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
