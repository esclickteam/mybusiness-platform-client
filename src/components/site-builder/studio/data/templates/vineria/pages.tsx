import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { vineriaDefaultData } from "./defaultData";
import { vineriaEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const vineriaPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "wines", label: "יינות", slug: "/wines" },
  { id: "tasting", label: "טעימות", slug: "/tasting" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = vineriaPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (vineriaDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = vineriaPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{ background: "#1a1218f5", borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-5">
        <button type="button" onClick={() => goTo("home")} className="tpl-display text-3xl font-semibold tracking-[0.12em]">{v(data, "brandName")}</button>
        <nav className="flex flex-wrap items-center justify-center gap-5">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-xs font-medium tracking-[0.22em] uppercase"
              style={{ color: currentPage === id ? "#9b2335" : "#a8959a" }}>{label}</button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <div className="tpl-depth-1 absolute inset-0">
          <img src={v(data, "heroImage")} alt="" className="h-full w-full object-cover opacity-70" />
        </div>
        <div className="tpl-depth-2 absolute inset-x-0 bottom-0 h-[50%]" style={{ background: "linear-gradient(180deg, transparent, #0c080c)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #1a121855, #1a1218ee)" }} />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-4xl flex-col items-center justify-center px-5 pt-28 text-center">
          <p className="tpl-rise text-xs font-semibold tracking-[0.4em]" style={{ color: "#9b2335" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-6 text-5xl font-semibold leading-[1.05] md:text-7xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-lg text-lg leading-8" style={{ color: "#a8959a" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-10 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={onCta} className="px-8 py-3.5 text-sm font-semibold tracking-wider" style={{ background: "#9b2335", color: "#f5ebe0" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("wines")} className="border px-8 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(245,235,224,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </section>
  );
}


function CellarNotesTimeline({ data }: { data: Record<string, any> }) {
  const notes = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-4xl font-semibold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="relative mt-12">
          <div className="absolute right-3 top-0 bottom-0 w-px" style={{ background: "rgba(245,235,224,0.12)" }} />
          {notes.map(([title, meta, text], i) => (
            <Reveal key={title} delayMs={i * 100} variant="right">
              <div className="relative grid gap-2 pb-10 pr-12">
                <div className="absolute right-1.5 top-1 h-3 w-3 rounded-full border-2" style={{ borderColor: "#9b2335", background: "#1a1218" }} />
                <p className="text-xs tracking-[0.2em]" style={{ color: "#9b2335" }}>{meta}</p>
                <h3 className="tpl-display text-2xl font-semibold">{title}</h3>
                <p className="text-sm leading-7" style={{ color: "#a8959a" }}>{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CellarProcessSteps({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "process1Title"), v(data, "process1Text")], [v(data, "process2Title"), v(data, "process2Text")], [v(data, "process3Title"), v(data, "process3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-center text-3xl font-bold md:text-4xl">{v(data, "processTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 90} variant="up">
              <div className="border-t-2 pt-4" style={{ borderColor: "#9b2335" }}>
                <div className="text-xs font-bold tracking-[0.2em]" style={{ color: "#9b2335" }}>0{i + 1}</div>
                <h3 className="tpl-display mt-2 text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "#a8959a" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CellarHomeGallery({ data }: { data: Record<string, any> }) {
  const imgs = [v(data, "galleryImage1"), v(data, "galleryImage2"), v(data, "galleryImage3"), v(data, "galleryImage4")];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold">{v(data, "galleryTitle")}</h2></Reveal>
        <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-4">
          {imgs.map((src, i) => (
            <Reveal key={i} delayMs={i * 70} variant="scale">
              <img src={src} alt="" className={"w-full object-cover " + (i % 2 ? "aspect-[3/4]" : "aspect-square")} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CellarHomeReviews({ data }: { data: Record<string, any> }) {
  const revs = [1, 2, 3].map((i) => [v(data, `review${i}Text`), v(data, `review${i}Name`), v(data, `review${i}Role`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold">{v(data, "reviewsTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {revs.map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i * 80} variant="up">
              <blockquote className="border p-5" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
                <p className="text-sm leading-7" style={{ color: "#a8959a" }}>״{text}״</p>
                <footer className="mt-4 text-sm font-bold">{name} <span className="font-normal" style={{ color: "#a8959a" }}>· {role}</span></footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CellarHomeStats({ data }: { data: Record<string, any> }) {
  const stats = [[v(data, "stat1"), v(data, "stat1Label")], [v(data, "stat2"), v(data, "stat2Label")], [v(data, "stat3"), v(data, "stat3Label")]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="grid grid-cols-3 gap-4 text-center">
          {stats.map(([n, l], i) => (
            <Reveal key={l} delayMs={i * 70} variant="scale">
              <div className=" border px-4 py-3" style={{ borderColor: "#9b2335", animationDelay: `${i * 0.3}s` }}>
                <div className="tpl-display text-3xl font-bold" style={{ color: "#9b2335" }}>{n}</div>
                <p className="mt-1 text-xs" style={{ color: "#a8959a" }}>{l}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="text-sm" style={{ color: "#a8959a" }}>{v(data, "hours")}</p>
      </div>
    </section>
  );
}

function CellarHomeCtaTeaser({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <Reveal>
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border p-8 md:flex-row md:items-center" style={{ borderColor: "#9b2335", background: "#241820" }}>
          <div>
            <h2 className="tpl-display text-3xl font-bold md:text-4xl">{v(data, "ctaBandTitle")}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: "#a8959a" }}>{v(data, "ctaBandText")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="px-6 py-3 text-sm font-bold" style={{ background: "#9b2335", color: "#9b2335Text" }}>{v(data, "cta")}</button>
            <button type="button" onClick={() => goTo("about")} className="border px-6 py-3 text-sm font-semibold" style={{ borderColor: "rgba(245,235,224,0.12)" }}>{v(data, "navAbout")}</button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}


function CellarSpecialtyBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative overflow-hidden border-b px-5 py-20 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <img src={v(data, "item4Image")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #1a1218, transparent)" }} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#9b2335" }}>{v(data, "brandName")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-7xl">{v(data, "page1Title")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#a8959a" }}>{v(data, "page1Subtitle")}</p>
      </div>
    </section>
  );
}

function CellarFullMenuBoard({ data }: { data: Record<string, any> }) {
  const items = [1, 2, 3, 4, 5, 6].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto max-w-4xl space-y-6">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "menuListTitle")}</h2></Reveal>
        {items.map(([title, meta, text, img], i) => (
          <Reveal key={title} delayMs={i * 60} variant="right">
            <article className="grid gap-4 border-b pb-6 md:grid-cols-[100px_1fr_auto]" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
              <img src={img} alt="" className="aspect-square w-full object-cover" />
              <div>
                <h3 className="tpl-display text-2xl font-bold">{title}</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "#a8959a" }}>{text}</p>
              </div>
              <p className="text-sm font-bold" style={{ color: "#9b2335" }}>{meta}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CellarCategoryGrid({ data }: { data: Record<string, any> }) {
  const cats = [[v(data, "cat1Title"), v(data, "cat1Text")], [v(data, "cat2Title"), v(data, "cat2Text")], [v(data, "cat3Title"), v(data, "cat3Text")], [v(data, "cat4Title"), v(data, "cat4Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
        {cats.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 70} variant="up">
            <div className="border p-5" style={{ borderColor: "rgba(245,235,224,0.12)", background: i % 2 ? "#241820" : "#1a1218" }}>
              <h3 className="tpl-display text-xl font-bold" style={{ color: "#9b2335" }}>{t}</h3>
              <p className="mt-2 text-sm" style={{ color: "#a8959a" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CellarPairingNotes({ data }: { data: Record<string, any> }) {
  const pairs = [[v(data, "pair1Title"), v(data, "pair1Text")], [v(data, "pair2Title"), v(data, "pair2Text")], [v(data, "pair3Title"), v(data, "pair3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "pairingTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pairs.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 80} variant="up">
              <div className="border-r pr-4" style={{ borderColor: "#9b2335" }}>
                <h3 className="font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "#a8959a" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CellarChefPicks({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#9b2335" }}>{v(data, "chefPickEyebrow")}</p>
          <h2 className="tpl-display mt-3 text-3xl font-bold">{v(data, "chefPickTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#a8959a" }}>{v(data, "chefPickText")}</p>
        </div>
        <img src={v(data, "item5Image")} alt="" className="aspect-[4/3] w-full object-cover" />
      </div>
    </section>
  );
}


function CellarStoryBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative min-h-[42vh] overflow-hidden">
      <img src={v(data, "item6Image")} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.55), #1a1218)" }} />
      <div className="relative z-10 mx-auto flex min-h-[42vh] max-w-7xl items-end px-5 pb-12 lg:px-8">
        <div>
          <p className="text-xs tracking-[0.28em]" style={{ color: "#9b2335" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-3 text-5xl font-bold md:text-6xl">{v(data, "page2Title")}</h1>
          <p className="mt-3 max-w-xl text-lg" style={{ color: "#a8959a" }}>{v(data, "page2Subtitle")}</p>
        </div>
      </div>
    </section>
  );
}

function CellarTechniqueLadder({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "tech1Title"), v(data, "tech1Text")], [v(data, "tech2Title"), v(data, "tech2Text")], [v(data, "tech3Title"), v(data, "tech3Text")], [v(data, "tech4Title"), v(data, "tech4Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto max-w-3xl space-y-8">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "techTitle")}</h2></Reveal>
        {steps.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 80} variant="right">
            <div className="flex gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center text-sm font-bold" style={{ background: "#9b2335", color: "#9b2335Text" }}>{i + 1}</div>
              <div>
                <h3 className="text-xl font-bold">{t}</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "#a8959a" }}>{x}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CellarMaterialCards({ data }: { data: Record<string, any> }) {
  const woods = [[v(data, "mat1Title"), v(data, "mat1Text")], [v(data, "mat2Title"), v(data, "mat2Text")], [v(data, "mat3Title"), v(data, "mat3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "matTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {woods.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 70} variant="up">
              <div className="border p-6 text-center" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
                <h3 className="tpl-display text-2xl font-bold" style={{ color: "#9b2335" }}>{t}</h3>
                <p className="mt-3 text-sm" style={{ color: "#a8959a" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CellarEventsBand({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "galleryImage3")} alt="" className="aspect-[16/10] w-full object-cover" />
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data, "eventsTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#a8959a" }}>{v(data, "eventsText")}</p>
          <p className="mt-4 text-sm font-semibold" style={{ color: "#9b2335" }}>{v(data, "eventsMeta")}</p>
        </div>
      </div>
    </section>
  );
}


function CellarAboutBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-20 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#9b2335" }}>{v(data, "aboutEyebrow")}</p>
        <h1 className="tpl-display mt-4 max-w-3xl text-5xl font-bold md:text-6xl">{v(data, "aboutPageTitle")}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: "#a8959a" }}>{v(data, "aboutPageLead")}</p>
      </div>
    </section>
  );
}

function CellarAboutTimeline({ data }: { data: Record<string, any> }) {
  const pts = [[v(data, "timeline1Year"), v(data, "timeline1Text")], [v(data, "timeline2Year"), v(data, "timeline2Text")], [v(data, "timeline3Year"), v(data, "timeline3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "timelineTitle")}</h2></Reveal>
        <div className="relative mt-10">
          <div className="absolute right-2 top-0 bottom-0 w-px" style={{ background: "rgba(245,235,224,0.12)" }} />
          {pts.map(([y, t], i) => (
            <Reveal key={y} delayMs={i * 90} variant="right">
              <div className="relative pb-10 pr-10">
                <div className="absolute right-0.5 top-1 h-3 w-3 rounded-full" style={{ background: "#9b2335" }} />
                <p className="text-xs font-bold" style={{ color: "#9b2335" }}>{y}</p>
                <p className="mt-2 text-sm leading-7" style={{ color: "#a8959a" }}>{t}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CellarChefPortrait({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "chefImage")} alt="" className="aspect-[4/5] w-full object-cover" />
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#9b2335" }}>{v(data, "chefLabel")}</p>
          <h2 className="tpl-display mt-3 text-4xl font-bold">{v(data, "chefName")}</h2>
          <p className="mt-5 text-lg leading-8" style={{ color: "#a8959a" }}>{v(data, "chefBio")}</p>
          <blockquote className="mt-6 border-r-2 pr-4 text-xl font-semibold" style={{ borderColor: "#9b2335" }}>״{v(data, "chefQuote")}״</blockquote>
        </div>
      </div>
    </section>
  );
}

function CellarValuesRow({ data }: { data: Record<string, any> }) {
  const vals = [[v(data, "value1Title"), v(data, "value1Text")], [v(data, "value2Title"), v(data, "value2Text")], [v(data, "value3Title"), v(data, "value3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {vals.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 80} variant="up">
            <div>
              <h3 className="tpl-display text-2xl font-bold" style={{ color: "#9b2335" }}>{t}</h3>
              <p className="mt-3 text-sm leading-7" style={{ color: "#a8959a" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function CellarContactBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#9b2335" }}>{v(data, "contactEyebrow")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(data, "contactPageTitle")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#a8959a" }}>{v(data, "contactPageText")}</p>
      </div>
    </section>
  );
}

function CellarReserveForm({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data, "contactTitle")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#a8959a" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#a8959a" }}>
            <p>{v(data, "phone")}</p><p>{v(data, "email")}</p><p>{v(data, "address")}</p>
          </div>
        </div>
        <form className="grid gap-3 border p-6" style={{ borderColor: "#9b2335" }} onSubmit={(e) => e.preventDefault()}>
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(245,235,224,0.12)", color: "#f5ebe0" }} placeholder="שם מלא" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(245,235,224,0.12)", color: "#f5ebe0" }} placeholder="טלפון" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(245,235,224,0.12)", color: "#f5ebe0" }} placeholder="תאריך" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(245,235,224,0.12)", color: "#f5ebe0" }} placeholder="מספר סועדים" />
          <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#9b2335", color: "#9b2335Text" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function CellarHoursMap({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        <div className="border p-6" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
          <h3 className="tpl-display text-2xl font-bold">{v(data, "hoursTitle")}</h3>
          <p className="mt-4 text-sm leading-7" style={{ color: "#a8959a" }}>{v(data, "hours")}</p>
          <p className="mt-4 text-sm">{v(data, "address")}</p>
        </div>
        <div className="relative min-h-[220px] overflow-hidden border" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
          <img src={v(data, "galleryImage1")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border px-4 py-2 text-xs font-bold tracking-wider" style={{ borderColor: "#9b2335", background: "#1a1218", color: "#9b2335" }}>{v(data, "mapLabel")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CellarFaqBlock({ data }: { data: Record<string, any> }) {
  const faqs = [[v(data, "faq1Q"), v(data, "faq1A")], [v(data, "faq2Q"), v(data, "faq2A")], [v(data, "faq3Q"), v(data, "faq3A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto max-w-3xl space-y-4">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "faqTitle")}</h2></Reveal>
        {faqs.map(([q, a], i) => (
          <Reveal key={q} delayMs={i * 70} variant="up">
            <details className="border p-4" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
              <summary className="cursor-pointer font-bold">{q}</summary>
              <p className="mt-3 text-sm leading-7" style={{ color: "#a8959a" }}>{a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-10 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4">
        <div className="tpl-stamp border-2 px-4 py-2 text-xs font-bold tracking-[0.3em]" style={{ borderColor: "#9b2335", color: "#9b2335" }}>EST. CELLAR</div>
        <span className="tpl-display text-xl font-semibold">{v(data, "brandName")}</span>
        <span className="text-sm" style={{ color: "#a8959a" }}>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <CellarNotesTimeline data={data} />
      <CellarProcessSteps data={data} />
      <CellarHomeGallery data={data} />
      <CellarHomeReviews data={data} />
      <CellarHomeStats data={data} />
      <CellarHomeCtaTeaser data={data} goTo={goTo} />
      <Footer data={data} />
    </>
  );
}

function WinesPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <CellarSpecialtyBanner data={data} />
      <CellarFullMenuBoard data={data} />
      <CellarCategoryGrid data={data} />
      <CellarPairingNotes data={data} />
      <CellarChefPicks data={data} />
      <Footer data={data} />
    </>
  );
}

function TastingPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <CellarStoryBanner data={data} />
      <CellarEventsBand data={data} />
      <CellarTechniqueLadder data={data} />
      <CellarMaterialCards data={data} />
      <Footer data={data} />
    </>
  );
}

function AboutPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <CellarAboutBanner data={data} />
      <CellarAboutTimeline data={data} />
      <CellarChefPortrait data={data} />
      <CellarValuesRow data={data} />
      <Footer data={data} />
    </>
  );
}

function ContactPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <CellarContactBanner data={data} />
      <CellarReserveForm data={data} onCta={onCta} />
      <CellarHoursMap data={data} />
      <CellarFaqBlock data={data} />
      <Footer data={data} />
    </>
  );
}

export default function VineriaPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...vineriaDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    wines: <WinesPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    tasting: <TastingPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    about: <AboutPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: <ContactPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "vineria-preview" : "vineria"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#1a1218", color: "#f5ebe0" }}>
      <style dangerouslySetInnerHTML={{ __html: vineriaEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
