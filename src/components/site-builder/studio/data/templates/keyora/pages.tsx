import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { keyoraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const keyoraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "listings", label: "נכסים", slug: "/listings" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

const allowedPages = keyoraPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (keyoraDefaultData as Record<string, any>)[key] ?? "";
}

function KeyoraUnderlineHeader({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = keyoraPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{ background: "#fffffff4", borderColor: "rgba(15,27,45,0.12)", backdropFilter: "blur(10px)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="justify-self-start text-right">
          <span className="tpl-display text-2xl font-extrabold tracking-tight" style={{ color: "#0b5fff" }}>{v(data, "brandName")}</span>
        </button>
        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="relative px-1 pb-2 text-sm font-bold" style={{ color: "#0f1b2d" }}>
              {label}
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-right transition-transform" style={{ background: "#0b5fff", transform: currentPage === id ? "scaleX(1)" : "scaleX(0)" }} />
            </button>
          ))}
        </nav>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCta} className="hidden px-5 py-2.5 text-sm font-extrabold sm:inline-flex" style={{ background: "#0b5fff", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => setOpen((x) => !x)} className="grid h-10 w-10 place-items-center border lg:hidden" style={{ borderColor: "rgba(15,27,45,0.12)" }}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{ borderColor: "rgba(15,27,45,0.12)", background: "#ffffff" }}>
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

function KeyoraSearchHero({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  const counters = [
    [v(data, "stat1Value"), v(data, "stat1Label")],
    [v(data, "stat2Value"), v(data, "stat2Label")],
    [v(data, "stat3Value"), v(data, "stat3Label")],
  ];
  return (
    <section className="relative overflow-hidden px-5 py-16 lg:px-8 lg:py-24" style={{ background: "#f5f8fc" }}>
      <div className="pointer-events-none absolute -left-10 top-2 text-[16rem] font-black leading-none opacity-[0.05] md:text-[24rem]" style={{ color: "#0b5fff" }}>K</div>
      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-bold tracking-[0.32em]" style={{ color: "#0b5fff" }}>{v(data, "heroEyebrow")}</p>
        <h1 className="tpl-display tpl-rise-2 mt-5 max-w-5xl text-6xl font-black leading-[0.92] md:text-8xl lg:text-9xl">{v(data, "heroTitle")}</h1>
        <p className="tpl-rise-3 mt-6 max-w-2xl text-xl leading-9" style={{ color: "#5b6b7c" }}>{v(data, "heroSubtitle")}</p>
        <div className="tpl-rise-3 mt-10 grid border p-2 shadow-[12px_12px_0_#0b5fff] md:grid-cols-[1.3fr_1fr_0.8fr_auto]" style={{ borderColor: "rgba(15,27,45,0.14)", background: "#ffffff" }}>
          {["עיר / שכונה", "תקציב", "חדרים"].map((placeholder) => (
            <input key={placeholder} className="border-b bg-transparent px-4 py-4 text-sm outline-none md:border-b-0 md:border-l last:border-l-0" style={{ borderColor: "rgba(15,27,45,0.12)", color: "#0f1b2d" }} placeholder={placeholder} />
          ))}
          <button type="button" onClick={onCta} className="tpl-sweep px-7 py-4 text-sm font-black" style={{ background: "#0b5fff", color: "#ffffff" }}>{v(data, "heroPrimary")}</button>
        </div>
        <div className="mt-14 grid gap-0 border-y md:grid-cols-3" style={{ borderColor: "rgba(15,27,45,0.12)" }}>
          {counters.map(([value, label]) => (
            <div key={label} className="tpl-rise border-b py-6 md:border-b-0 md:border-l last:border-l-0" style={{ borderColor: "rgba(15,27,45,0.12)" }}>
              <div className="tpl-display text-5xl font-black" style={{ color: "#0b5fff" }}>{value}</div>
              <div className="mt-2 text-sm font-bold" style={{ color: "#5b6b7c" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function KeyoraNumberedIndex({ data }: { data: Record<string, any> }) {
  const items = [1, 2, 3, 4].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Price`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(15,27,45,0.12)", background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 md:grid-cols-[0.4fr_1fr] md:items-end">
          <p className="text-xs font-black tracking-[0.3em]" style={{ color: "#0b5fff" }}>INDEX</p>
          <h2 className="tpl-display text-4xl font-black md:text-6xl">נכסים כנתונים ברורים.</h2>
        </div>
        <div className="mt-10 border-t" style={{ borderColor: "rgba(15,27,45,0.14)" }}>
          {items.map(([title, meta, text, price], index) => (
            <article key={title} className="group grid gap-4 border-b py-7 md:grid-cols-[0.18fr_1fr_1.1fr_0.7fr] md:items-baseline" style={{ borderColor: "rgba(15,27,45,0.14)" }}>
              <span className="tpl-display text-4xl font-black" style={{ color: "#0b5fff" }}>{String(index + 1).padStart(2, "0")}</span>
              <h3 className="tpl-display text-2xl font-black md:text-3xl">{title}</h3>
              <p className="text-sm leading-7" style={{ color: "#5b6b7c" }}><b style={{ color: "#0f1b2d" }}>{meta}</b> · {text}</p>
              <p className="text-left text-xl font-black md:text-right" style={{ color: "#0b5fff" }}>{price}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function KeyoraProcessStrip({ data }: { data: Record<string, any> }) {
  const steps = [1, 2, 3].map((i) => [v(data, `step${i}Title`), v(data, `step${i}Text`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(15,27,45,0.12)", background: "#f5f8fc" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-black tracking-[0.3em]" style={{ color: "#0b5fff" }}>PROCESS</p>
        <div className="mt-8 grid border md:grid-cols-3" style={{ borderColor: "rgba(15,27,45,0.14)", background: "#ffffff" }}>
          {steps.map(([title, text], index) => (
            <div key={title} className="border-b p-7 md:border-b-0 md:border-l last:border-l-0" style={{ borderColor: "rgba(15,27,45,0.14)" }}>
              <span className="tpl-display text-6xl font-black" style={{ color: index === 1 ? "#0f1b2d" : "#0b5fff" }}>0{index + 1}</span>
              <h3 className="mt-8 text-xl font-black">{title}</h3>
              <p className="mt-3 text-base leading-7" style={{ color: "#5b6b7c" }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function KeyoraClarityBrief({ data }: { data: Record<string, any> }) {
  const checks = [v(data, "aboutPoint1"), v(data, "aboutPoint2"), v(data, "aboutPoint3")];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(15,27,45,0.12)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border-r-4 pr-6" style={{ borderColor: "#0b5fff" }}>
          <p className="text-xs font-black tracking-[0.3em]" style={{ color: "#0b5fff" }}>ABOUT</p>
          <h2 className="tpl-display mt-4 text-4xl font-black md:text-6xl">{v(data, "aboutTitle")}</h2>
        </div>
        <div>
          <p className="text-xl leading-9" style={{ color: "#5b6b7c" }}>{v(data, "aboutText")}</p>
          <div className="mt-8 grid gap-3">
            {checks.map((check) => (
              <div key={check} className="flex items-center gap-3 border-b pb-3 text-base font-bold" style={{ borderColor: "rgba(15,27,45,0.12)" }}>
                <span className="h-2 w-8" style={{ background: "#0b5fff" }} />
                <span>{check}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function KeyoraBluePanelContact({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  const field = "border px-4 py-4 text-right outline-none";
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-24" style={{ borderColor: "rgba(15,27,45,0.12)", background: "#f5f8fc" }}>
      <div className="mx-auto grid max-w-7xl border lg:grid-cols-[0.48fr_0.52fr]" style={{ borderColor: "rgba(15,27,45,0.14)", background: "#ffffff" }}>
        <aside className="p-8 lg:p-12" style={{ background: "#0b5fff", color: "#ffffff" }}>
          <p className="text-xs font-black tracking-[0.3em] opacity-80">CONTACT</p>
          <h2 className="tpl-display mt-5 text-5xl font-black leading-tight md:text-6xl">{v(data, "contactTitle")}</h2>
          <p className="mt-6 text-lg leading-8 opacity-85">{v(data, "contactText")}</p>
          <div className="mt-10 space-y-3 text-sm font-bold">
            <p>{v(data, "phone")}</p>
            <p>{v(data, "email")}</p>
            <p>{v(data, "address")}</p>
          </div>
        </aside>
        <form className="grid gap-4 p-8 lg:p-12" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4 md:grid-cols-2">
            <input className={field} style={{ borderColor: "rgba(15,27,45,0.14)", color: "#0f1b2d", background: "#ffffff" }} placeholder="שם מלא" />
            <input className={field} style={{ borderColor: "rgba(15,27,45,0.14)", color: "#0f1b2d", background: "#ffffff" }} placeholder="טלפון" />
          </div>
          <input className={field} style={{ borderColor: "rgba(15,27,45,0.14)", color: "#0f1b2d", background: "#ffffff" }} placeholder="עיר, תקציב, מספר חדרים" />
          <textarea className={`${field} min-h-28`} style={{ borderColor: "rgba(15,27,45,0.14)", color: "#0f1b2d", background: "#ffffff" }} placeholder="מה צריך לקרות כדי שתגידו כן?" />
          <button type="button" onClick={onCta} className="tpl-sweep px-7 py-4 text-sm font-black" style={{ background: "#0f1b2d", color: "#ffffff" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function KeyoraUtilityFooter({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(15,27,45,0.12)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-5 text-sm md:grid-cols-[1fr_auto]" style={{ color: "#5b6b7c" }}>
        <div><span className="tpl-display text-xl font-black" style={{ color: "#0b5fff" }}>{v(data, "brandName")}</span> · {v(data, "email")}</div>
        <div className="flex flex-wrap gap-5">
          {keyoraPages.slice(1).map((page) => (
            <button key={page.id} type="button" onClick={() => goTo(page.id)} className="font-bold">{page.label}</button>
          ))}
        </div>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <KeyoraSearchHero data={data} onCta={onCta} />
      <KeyoraNumberedIndex data={data} />
      <KeyoraProcessStrip data={data} />
      <KeyoraClarityBrief data={data} />
      <KeyoraBluePanelContact data={data} onCta={onCta} />
      <KeyoraUtilityFooter data={data} goTo={goTo} />
    </>
  );
}

function InnerPage({ data, title, children, onCta, goTo }: { data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void; goTo: (id: string) => void }) {
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(15,27,45,0.12)", background: "#f5f8fc" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black tracking-[0.3em]" style={{ color: "#0b5fff" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-6xl font-black md:text-7xl">{title}</h1>
        </div>
      </section>
      {children}
      <KeyoraBluePanelContact data={data} onCta={onCta} />
      <KeyoraUtilityFooter data={data} goTo={goTo} />
    </>
  );
}

export default function KeyoraPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...keyoraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of keyoraPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} title={pg.label} onCta={() => goTo("contact")} goTo={goTo}>
        {pg.id === "listings" ? <KeyoraNumberedIndex data={merged} /> : null}
        {pg.id === "process" ? <KeyoraProcessStrip data={merged} /> : null}
        {pg.id === "about" ? <KeyoraClarityBrief data={merged} /> : null}
      </InnerPage>
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "keyora-preview" : "keyora"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#f5f8fc", color: "#0f1b2d" }}>
      <KeyoraUnderlineHeader data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
