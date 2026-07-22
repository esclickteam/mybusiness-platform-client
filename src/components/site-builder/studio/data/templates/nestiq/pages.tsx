import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { nestiqDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const nestiqPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "listings", label: "נכסים", slug: "/listings" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "faq", label: "שאלות", slug: "/faq" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = nestiqPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (nestiqDefaultData as Record<string, any>)[key] ?? "";
}
function cx(...xs: Array<string | false | null | undefined>) { return xs.filter(Boolean).join(" "); }

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = nestiqPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{ background: "#faf5fff2", borderColor: "rgba(30,27,75,0.1)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "#7c3aed", color: "#ffffff" }}>{v(data, "logoText")}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#1e1b4b" : "#6366f1" }}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{ background: "#7c3aed", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(30,27,75,0.1)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
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
      <input className={field} style={{ borderColor: "rgba(30,27,75,0.1)", color: "#1e1b4b" }} placeholder="שם מלא" />
      <input className={field} style={{ borderColor: "rgba(30,27,75,0.1)", color: "#1e1b4b" }} placeholder="טלפון" />
      <input className={field} style={{ borderColor: "rgba(30,27,75,0.1)", color: "#1e1b4b" }} placeholder="אימייל" />
      <textarea className={cx(field, "min-h-28")} style={{ borderColor: "rgba(30,27,75,0.1)", color: "#1e1b4b" }} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#7c3aed", color: "#ffffff" }}>{v(data, "cta")}</button>
    </form>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="px-5 py-20 lg:px-8 lg:py-28" style={{ background: "#faf5ff" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            {[["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]].map(([vk, lk], i) => (
              <div key={vk} className="tpl-counter border p-6 text-center" style={{ borderColor: "rgba(30,27,75,0.1)", animationDelay: `${i * 0.12}s` }}>
                <div className="tpl-display text-5xl font-bold" style={{ color: "#7c3aed" }}>{v(data, vk)}</div>
                <p className="mt-2 text-sm" style={{ color: "#6366f1" }}>{v(data, lk)}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#7c3aed" }}>{v(data, "heroEyebrow")}</p>
            <h1 className="tpl-display tpl-rise-2 mt-4 text-5xl font-bold md:text-7xl">{v(data, "heroTitle")}</h1>
            <p className="tpl-rise-3 mx-auto mt-6 max-w-2xl text-lg leading-8" style={{ color: "#6366f1" }}>{v(data, "heroSubtitle")}</p>
            <div className="tpl-rise-3 mt-8 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#7c3aed", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
              <button type="button" onClick={() => goTo("listings")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(30,27,75,0.1)" }}>{v(data, "heroSecondary")}</button>
            </div>
          </div>
        </div>
      </section>
  );
}


function BadgeCards({ data }: { data: Record<string, any> }) {
  const badges = ["נוף","חניה","ממ״ד","משופץ"];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"rgba(30,27,75,0.1)", background:"#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4].map((i)=>(<article key={i} className="border p-4" style={{ borderColor:"rgba(30,27,75,0.1)" }}>
          <div className="mb-3 flex flex-wrap gap-1">{badges.slice(0,2).map((b)=><span key={b} className="rounded px-2 py-0.5 text-[10px] font-bold" style={{ background:"#7c3aed22", color:"#7c3aed" }}>{b}</span>)}</div>
          <h3 className="tpl-display text-lg font-bold">{v(data,`item${i}Title`)}</h3>
          <p className="mt-2 text-sm" style={{ color:"#7c3aed" }}>{v(data,`item${i}Price`)}</p>
        </article>))}
      </div>
    </section>
  );
}
function FaqVisual({ data }: { data: Record<string, any> }) {
  const faqs = [["איך מתחילים?","משאירים פרטים ומקבלים התאמות."],["מה העמלה?","שקוף ומוסכם מראש."],["כמה זמן?","בממוצע 42 ימים."]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor:"rgba(30,27,75,0.1)" }}>
      <div className="mx-auto max-w-3xl grid gap-3">
        {faqs.map(([q,a])=>(<div key={q} className="border p-4" style={{ borderColor:"rgba(30,27,75,0.1)" }}><p className="font-bold">{q}</p><p className="mt-2 text-sm" style={{ color:"#6366f1" }}>{a}</p></div>))}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#7c3aed" }}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: "#6366f1" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="min-h-[360px] overflow-hidden"><img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(30,27,75,0.1)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#7c3aed" }}>יצירת קשר</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8" style={{ color: "#6366f1" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#6366f1" }}>
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
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{ color: "#6366f1" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#1e1b4b" }}>{v(data, "brandName")}</span>
        <span>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <BadgeCards data={data} />
      <FaqVisual data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, title, children, onCta }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(30,27,75,0.1)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#7c3aed" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
        </div>
      </section>
      {children}
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

export default function NestiqPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...nestiqDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of nestiqPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")}>
        {pg.id.includes("contact") ? null : (<>
        <BadgeCards data={merged} />
        <FaqVisual data={merged} />
        </>)}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "nestiq-preview" : "nestiq"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#faf5ff", color: "#1e1b4b" }}>
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
