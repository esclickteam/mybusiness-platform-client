import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { sushisenDefaultData } from "./defaultData";
import { sushisenEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const sushisenPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "omakase", label: "אומאקאסה", slug: "/omakase" },
  { id: "nigiri", label: "ניגירי", slug: "/nigiri" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = sushisenPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (sushisenDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = sushisenPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{ background: "#0b0b0b", borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="tpl-display text-lg font-semibold tracking-[0.2em]">{v(data, "brandName")}</button>
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-xs font-medium tracking-[0.18em] uppercase"
              style={{ color: currentPage === id ? "#d4af37" : "#9a958c" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="border px-4 py-1.5 text-xs font-semibold tracking-wider" style={{ borderColor: "#d4af37", color: "#d4af37" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative min-h-[88vh] overflow-hidden" style={{ background: "#0b0b0b" }}>
        <div className="absolute inset-x-0 top-[30%] overflow-hidden border-y py-4" style={{ borderColor: "#d4af3744", background: "#161616" }}>
          <div className="tpl-conveyor">
            {[v(data, "heroImage"), v(data, "item1Image"), v(data, "item2Image"), v(data, "item3Image"), v(data, "heroImage"), v(data, "item1Image")].map((src, i) => (
              <div key={i} className="h-36 w-48 flex-shrink-0 overflow-hidden md:h-44 md:w-64">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.34em]" style={{ color: "#d4af37" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-3xl text-6xl font-bold leading-[0.92] md:text-7xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#9a958c" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#d4af37", color: "#0b0b0b" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("omakase")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(242,240,234,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </section>
  );
}


function ZenNigiriRail({ data }: { data: Record<string, any> }) {
  const boards = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="tpl-nigiri-rail mt-10 pb-2">
          {boards.map(([title, meta, text, img], i) => (
            <article key={title} className="tpl-nigiri-card border p-3" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#0b0b0b", animationDelay: `${i * 0.5}s` }}>
              <img src={img} alt="" className="aspect-[4/3] w-full object-cover" />
              <p className="mt-3 text-xs tracking-wider" style={{ color: "#d4af37" }}>{meta}</p>
              <h3 className="tpl-display mt-1 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm" style={{ color: "#9a958c" }}>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ZenProcessSteps({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "process1Title"), v(data, "process1Text")], [v(data, "process2Title"), v(data, "process2Text")], [v(data, "process3Title"), v(data, "process3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-center text-3xl font-bold md:text-4xl">{v(data, "processTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 90} variant="up">
              <div className="border-t-2 pt-4" style={{ borderColor: "#d4af37" }}>
                <div className="text-xs font-bold tracking-[0.2em]" style={{ color: "#d4af37" }}>0{i + 1}</div>
                <h3 className="tpl-display mt-2 text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "#9a958c" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ZenHomeGallery({ data }: { data: Record<string, any> }) {
  const imgs = [v(data, "galleryImage1"), v(data, "galleryImage2"), v(data, "galleryImage3"), v(data, "galleryImage4")];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
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

function ZenHomeReviews({ data }: { data: Record<string, any> }) {
  const revs = [1, 2, 3].map((i) => [v(data, `review${i}Text`), v(data, `review${i}Name`), v(data, `review${i}Role`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold">{v(data, "reviewsTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {revs.map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i * 80} variant="up">
              <blockquote className="border p-5" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
                <p className="text-sm leading-7" style={{ color: "#9a958c" }}>״{text}״</p>
                <footer className="mt-4 text-sm font-bold">{name} <span className="font-normal" style={{ color: "#9a958c" }}>· {role}</span></footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ZenHomeStats({ data }: { data: Record<string, any> }) {
  const stats = [[v(data, "stat1"), v(data, "stat1Label")], [v(data, "stat2"), v(data, "stat2Label")], [v(data, "stat3"), v(data, "stat3Label")]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="grid grid-cols-3 gap-4 text-center">
          {stats.map(([n, l], i) => (
            <Reveal key={l} delayMs={i * 70} variant="scale">
              <div className="tpl-wasabi border px-4 py-3" style={{ borderColor: "#d4af37", animationDelay: `${i * 0.3}s` }}>
                <div className="tpl-display text-3xl font-bold" style={{ color: "#d4af37" }}>{n}</div>
                <p className="mt-1 text-xs" style={{ color: "#9a958c" }}>{l}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="text-sm" style={{ color: "#9a958c" }}>{v(data, "hours")}</p>
      </div>
    </section>
  );
}

function ZenHomeCtaTeaser({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <Reveal>
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border p-8 md:flex-row md:items-center" style={{ borderColor: "#d4af37", background: "#161616" }}>
          <div>
            <h2 className="tpl-display text-3xl font-bold md:text-4xl">{v(data, "ctaBandTitle")}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: "#9a958c" }}>{v(data, "ctaBandText")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="px-6 py-3 text-sm font-bold" style={{ background: "#d4af37", color: "#d4af37Text" }}>{v(data, "cta")}</button>
            <button type="button" onClick={() => goTo("about")} className="border px-6 py-3 text-sm font-semibold" style={{ borderColor: "rgba(242,240,234,0.12)" }}>{v(data, "navAbout")}</button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}


function ZenSpecialtyBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative overflow-hidden border-b px-5 py-20 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <img src={v(data, "item4Image")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #0b0b0b, transparent)" }} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#d4af37" }}>{v(data, "brandName")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-7xl">{v(data, "page1Title")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#9a958c" }}>{v(data, "page1Subtitle")}</p>
      </div>
    </section>
  );
}

function ZenFullMenuBoard({ data }: { data: Record<string, any> }) {
  const items = [1, 2, 3, 4, 5, 6].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
      <div className="mx-auto max-w-4xl space-y-6">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "menuListTitle")}</h2></Reveal>
        {items.map(([title, meta, text, img], i) => (
          <Reveal key={title} delayMs={i * 60} variant="right">
            <article className="grid gap-4 border-b pb-6 md:grid-cols-[100px_1fr_auto]" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
              <img src={img} alt="" className="aspect-square w-full object-cover" />
              <div>
                <h3 className="tpl-display text-2xl font-bold">{title}</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "#9a958c" }}>{text}</p>
              </div>
              <p className="text-sm font-bold" style={{ color: "#d4af37" }}>{meta}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ZenCategoryGrid({ data }: { data: Record<string, any> }) {
  const cats = [[v(data, "cat1Title"), v(data, "cat1Text")], [v(data, "cat2Title"), v(data, "cat2Text")], [v(data, "cat3Title"), v(data, "cat3Text")], [v(data, "cat4Title"), v(data, "cat4Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
        {cats.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 70} variant="up">
            <div className="border p-5" style={{ borderColor: "rgba(242,240,234,0.12)", background: i % 2 ? "#161616" : "#0b0b0b" }}>
              <h3 className="tpl-display text-xl font-bold" style={{ color: "#d4af37" }}>{t}</h3>
              <p className="mt-2 text-sm" style={{ color: "#9a958c" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ZenPairingNotes({ data }: { data: Record<string, any> }) {
  const pairs = [[v(data, "pair1Title"), v(data, "pair1Text")], [v(data, "pair2Title"), v(data, "pair2Text")], [v(data, "pair3Title"), v(data, "pair3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "pairingTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pairs.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 80} variant="up">
              <div className="border-r pr-4" style={{ borderColor: "#d4af37" }}>
                <h3 className="font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "#9a958c" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ZenChefPicks({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#d4af37" }}>{v(data, "chefPickEyebrow")}</p>
          <h2 className="tpl-display mt-3 text-3xl font-bold">{v(data, "chefPickTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#9a958c" }}>{v(data, "chefPickText")}</p>
        </div>
        <img src={v(data, "item5Image")} alt="" className="aspect-[4/3] w-full object-cover" />
      </div>
    </section>
  );
}


function ZenStoryBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative min-h-[42vh] overflow-hidden">
      <img src={v(data, "item6Image")} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.55), #0b0b0b)" }} />
      <div className="relative z-10 mx-auto flex min-h-[42vh] max-w-7xl items-end px-5 pb-12 lg:px-8">
        <div>
          <p className="text-xs tracking-[0.28em]" style={{ color: "#d4af37" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-3 text-5xl font-bold md:text-6xl">{v(data, "page2Title")}</h1>
          <p className="mt-3 max-w-xl text-lg" style={{ color: "#9a958c" }}>{v(data, "page2Subtitle")}</p>
        </div>
      </div>
    </section>
  );
}

function ZenTechniqueLadder({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "tech1Title"), v(data, "tech1Text")], [v(data, "tech2Title"), v(data, "tech2Text")], [v(data, "tech3Title"), v(data, "tech3Text")], [v(data, "tech4Title"), v(data, "tech4Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
      <div className="mx-auto max-w-3xl space-y-8">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "techTitle")}</h2></Reveal>
        {steps.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 80} variant="right">
            <div className="flex gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center text-sm font-bold" style={{ background: "#d4af37", color: "#d4af37Text" }}>{i + 1}</div>
              <div>
                <h3 className="text-xl font-bold">{t}</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "#9a958c" }}>{x}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ZenMaterialCards({ data }: { data: Record<string, any> }) {
  const woods = [[v(data, "mat1Title"), v(data, "mat1Text")], [v(data, "mat2Title"), v(data, "mat2Text")], [v(data, "mat3Title"), v(data, "mat3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "matTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {woods.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 70} variant="up">
              <div className="border p-6 text-center" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
                <h3 className="tpl-display text-2xl font-bold" style={{ color: "#d4af37" }}>{t}</h3>
                <p className="mt-3 text-sm" style={{ color: "#9a958c" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ZenEventsBand({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "galleryImage3")} alt="" className="aspect-[16/10] w-full object-cover" />
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data, "eventsTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#9a958c" }}>{v(data, "eventsText")}</p>
          <p className="mt-4 text-sm font-semibold" style={{ color: "#d4af37" }}>{v(data, "eventsMeta")}</p>
        </div>
      </div>
    </section>
  );
}


function ZenAboutBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-20 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#d4af37" }}>{v(data, "aboutEyebrow")}</p>
        <h1 className="tpl-display mt-4 max-w-3xl text-5xl font-bold md:text-6xl">{v(data, "aboutPageTitle")}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: "#9a958c" }}>{v(data, "aboutPageLead")}</p>
      </div>
    </section>
  );
}

function ZenAboutTimeline({ data }: { data: Record<string, any> }) {
  const pts = [[v(data, "timeline1Year"), v(data, "timeline1Text")], [v(data, "timeline2Year"), v(data, "timeline2Text")], [v(data, "timeline3Year"), v(data, "timeline3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "timelineTitle")}</h2></Reveal>
        <div className="relative mt-10">
          <div className="absolute right-2 top-0 bottom-0 w-px" style={{ background: "rgba(242,240,234,0.12)" }} />
          {pts.map(([y, t], i) => (
            <Reveal key={y} delayMs={i * 90} variant="right">
              <div className="relative pb-10 pr-10">
                <div className="absolute right-0.5 top-1 h-3 w-3 rounded-full" style={{ background: "#d4af37" }} />
                <p className="text-xs font-bold" style={{ color: "#d4af37" }}>{y}</p>
                <p className="mt-2 text-sm leading-7" style={{ color: "#9a958c" }}>{t}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ZenChefPortrait({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-20 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="h-72 w-56 overflow-hidden border" style={{ borderColor: "#d4af37" }}><img src={v(data, "chefImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
        <p className="mt-8 text-xs tracking-[0.34em]" style={{ color: "#d4af37" }}>{v(data, "chefLabel")}</p>
        <h2 className="tpl-display mt-3 text-4xl font-bold">{v(data, "chefName")}</h2>
        <p className="mt-5 text-lg leading-8" style={{ color: "#9a958c" }}>{v(data, "chefBio")}</p>
        <blockquote className="mt-6 text-xl font-semibold">״{v(data, "chefQuote")}״</blockquote>
      </div>
    </section>
  );
}

function ZenValuesRow({ data }: { data: Record<string, any> }) {
  const vals = [[v(data, "value1Title"), v(data, "value1Text")], [v(data, "value2Title"), v(data, "value2Text")], [v(data, "value3Title"), v(data, "value3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {vals.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 80} variant="up">
            <div>
              <h3 className="tpl-display text-2xl font-bold" style={{ color: "#d4af37" }}>{t}</h3>
              <p className="mt-3 text-sm leading-7" style={{ color: "#9a958c" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function ZenContactBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#d4af37" }}>{v(data, "contactEyebrow")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(data, "contactPageTitle")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#9a958c" }}>{v(data, "contactPageText")}</p>
      </div>
    </section>
  );
}

function ZenReserveForm({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data, "contactTitle")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#9a958c" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#9a958c" }}>
            <p>{v(data, "phone")}</p><p>{v(data, "email")}</p><p>{v(data, "address")}</p>
          </div>
        </div>
        <form className="grid gap-3 border p-6" style={{ borderColor: "#d4af37" }} onSubmit={(e) => e.preventDefault()}>
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(242,240,234,0.12)", color: "#f2f0ea" }} placeholder="שם מלא" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(242,240,234,0.12)", color: "#f2f0ea" }} placeholder="טלפון" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(242,240,234,0.12)", color: "#f2f0ea" }} placeholder="תאריך" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(242,240,234,0.12)", color: "#f2f0ea" }} placeholder="מספר סועדים" />
          <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#d4af37", color: "#d4af37Text" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function ZenHoursMap({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        <div className="border p-6" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
          <h3 className="tpl-display text-2xl font-bold">{v(data, "hoursTitle")}</h3>
          <p className="mt-4 text-sm leading-7" style={{ color: "#9a958c" }}>{v(data, "hours")}</p>
          <p className="mt-4 text-sm">{v(data, "address")}</p>
        </div>
        <div className="relative min-h-[220px] overflow-hidden border" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
          <img src={v(data, "galleryImage1")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border px-4 py-2 text-xs font-bold tracking-wider" style={{ borderColor: "#d4af37", background: "#0b0b0b", color: "#d4af37" }}>{v(data, "mapLabel")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ZenFaqBlock({ data }: { data: Record<string, any> }) {
  const faqs = [[v(data, "faq1Q"), v(data, "faq1A")], [v(data, "faq2Q"), v(data, "faq2A")], [v(data, "faq3Q"), v(data, "faq3A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
      <div className="mx-auto max-w-3xl space-y-4">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "faqTitle")}</h2></Reveal>
        {faqs.map(([q, a], i) => (
          <Reveal key={q} delayMs={i * 70} variant="up">
            <details className="border p-4" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
              <summary className="cursor-pointer font-bold">{q}</summary>
              <p className="mt-3 text-sm leading-7" style={{ color: "#9a958c" }}>{a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="px-5 py-6 lg:px-8" style={{ background: "#0b0b0b" }}>
      <div className="mx-auto h-px max-w-7xl" style={{ background: "#d4af37" }} />
      <div className="mx-auto mt-4 flex max-w-7xl justify-between text-xs tracking-[0.2em]" style={{ color: "#9a958c" }}>
        <span>{v(data, "brandName")}</span>
        <span>{v(data, "email")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <ZenNigiriRail data={data} />
      <ZenProcessSteps data={data} />
      <ZenHomeGallery data={data} />
      <ZenHomeReviews data={data} />
      <ZenHomeStats data={data} />
      <ZenHomeCtaTeaser data={data} goTo={goTo} />
      <Footer data={data} />
    </>
  );
}

function OmakasePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <ZenSpecialtyBanner data={data} />
      <ZenCategoryGrid data={data} />
      <ZenFullMenuBoard data={data} />
      <ZenChefPicks data={data} />
      <ZenPairingNotes data={data} />
      <Footer data={data} />
    </>
  );
}

function NigiriPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <ZenStoryBanner data={data} />
      <ZenTechniqueLadder data={data} />
      <ZenMaterialCards data={data} />
      <ZenEventsBand data={data} />
      <Footer data={data} />
    </>
  );
}

function AboutPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <ZenAboutBanner data={data} />
      <ZenAboutTimeline data={data} />
      <ZenChefPortrait data={data} />
      <ZenValuesRow data={data} />
      <Footer data={data} />
    </>
  );
}

function ContactPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <ZenContactBanner data={data} />
      <ZenReserveForm data={data} onCta={onCta} />
      <ZenHoursMap data={data} />
      <ZenFaqBlock data={data} />
      <Footer data={data} />
    </>
  );
}

export default function SushisenPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...sushisenDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    omakase: <OmakasePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    nigiri: <NigiriPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    about: <AboutPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: <ContactPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "sushisen-preview" : "sushisen"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#0b0b0b", color: "#f2f0ea" }}>
      <style dangerouslySetInnerHTML={{ __html: sushisenEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
