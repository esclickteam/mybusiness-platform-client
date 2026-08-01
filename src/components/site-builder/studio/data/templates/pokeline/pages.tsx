import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { pokelineDefaultData } from "./defaultData";
import { pokelineEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const pokelinePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "bowls", label: "קערות", slug: "/bowls" },
  { id: "build", label: "בנו קערה", slug: "/build" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = pokelinePages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (pokelineDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = pokelinePages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{ background: "#071a1f", borderColor: "rgba(232,247,246,0.12)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="tpl-display text-lg font-semibold tracking-[0.18em]">{v(data, "brandName")}</button>
        
        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#e8f7f6" : "#7eb8b4" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ borderColor: "#2dd4bf", color: "#2dd4bf" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <div className="absolute inset-0" style={{ background: "#071a1f" }} />
        <div className="tpl-orbit absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed opacity-30" style={{ borderColor: "#2dd4bf" }} />
        <div className="relative z-10 mx-auto grid min-h-[92vh] max-w-7xl items-center gap-10 px-5 py-12 md:py-24 lg:grid-cols-2 lg:px-8">
          <div>
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#2dd4bf" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#7eb8b4" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#2dd4bf", color: "#071a1f" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("bowls")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(232,247,246,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div></div>
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full">
            <img src={v(data, "heroImage")} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
  );
}


function OrbitBowlMap({ data }: { data: Record<string, any> }) {
  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
      <div className="mx-auto max-w-7xl text-center">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="relative mx-auto mt-16 flex h-[340px] max-w-xl items-center justify-center">
          <div className="tpl-orbit absolute inset-8 rounded-full border border-dashed opacity-40" style={{ borderColor: "#2dd4bf" }} />
          <div className="relative z-10 h-36 w-36 overflow-hidden rounded-full border-4" style={{ borderColor: "#2dd4bf" }}>
            <img src={v(data, "item1Image")} alt="" className="h-full w-full object-cover" />
          </div>
          {cards.map((c, i) => (
            <article key={c.title} className="absolute w-28 text-center" style={{ top: `${20 + i * 28}%`, right: i === 1 ? "0%" : "8%", left: i === 0 ? "0%" : "auto" }}>
              <img src={c.img} alt="" className="mx-auto h-14 w-14 rounded-full object-cover" />
              <h3 className="tpl-display mt-2 text-sm font-bold">{c.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrbitProcessSteps({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "process1Title"), v(data, "process1Text")], [v(data, "process2Title"), v(data, "process2Text")], [v(data, "process3Title"), v(data, "process3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)", background: "#0d262c" }}>
      <div className="mx-auto max-w-5xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold md:text-4xl">{v(data, "processTitle")}</h2></Reveal>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-stretch">
          {steps.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 80} variant="left" className="flex-1">
              <div className="flex h-full flex-col items-start gap-3 border p-5" style={{ borderColor: "rgba(232,247,246,0.12)", background: "#071a1f" }}>
                <span className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold" style={{ background: "#2dd4bf", color: "#2dd4bfText" }}>{i + 1}</span>
                <h3 className="tpl-display text-xl font-bold">{t}</h3>
                <p className="text-sm leading-7" style={{ color: "#7eb8b4" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrbitHomeGallery({ data }: { data: Record<string, any> }) {
  const imgs = [v(data, "galleryImage1"), v(data, "galleryImage2"), v(data, "galleryImage3"), v(data, "galleryImage4")];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-2xl sm:text-4xl font-bold">{v(data, "galleryTitle")}</h2></Reveal>
        <div className="mt-10 flex gap-3 overflow-x-auto pb-2">
          {imgs.map((src, i) => (
            <Reveal key={i} delayMs={i * 60} variant="left">
              <img src={src} alt="" className="h-48 w-64 flex-shrink-0 object-cover md:h-56 md:w-72" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrbitHomeReviews({ data }: { data: Record<string, any> }) {
  const revs = [1, 2, 3].map((i) => [v(data, `review${i}Text`), v(data, `review${i}Name`), v(data, `review${i}Role`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)", background: "#0d262c" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-2xl sm:text-4xl font-bold">{v(data, "reviewsTitle")}</h2></Reveal>
        <div className="mt-10 space-y-6">
          {revs.map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i * 70} variant="right">
              <blockquote className="border-r-4 pr-5" style={{ borderColor: "#2dd4bf" }}>
                <p className="text-lg leading-8">״{text}״</p>
                <footer className="mt-3 text-sm font-bold" style={{ color: "#7eb8b4" }}>{name} · {role}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrbitHomeStats({ data }: { data: Record<string, any> }) {
  const stats = [[v(data, "stat1"), v(data, "stat1Label")], [v(data, "stat2"), v(data, "stat2Label")], [v(data, "stat3"), v(data, "stat3Label")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
        {stats.map(([n, l], i) => (
          <Reveal key={l} delayMs={i * 70} variant="up">
            <div className="text-center md:text-right">
              <div className="tpl-display text-2xl md:text-5xl font-bold" style={{ color: "#2dd4bf" }}>{n}</div>
              <p className="mt-2 text-sm" style={{ color: "#7eb8b4" }}>{l}</p>
            </div>
          </Reveal>
        ))}
        <div className="border p-4 md:col-span-1" style={{ borderColor: "rgba(232,247,246,0.12)", background: "#0d262c" }}>
          <p className="text-xs font-bold tracking-wider" style={{ color: "#2dd4bf" }}>{v(data, "hoursTitle")}</p>
          <p className="mt-2 text-sm leading-7" style={{ color: "#7eb8b4" }}>{v(data, "hours")}</p>
        </div>
      </div>
    </section>
  );
}

function OrbitHomeCtaTeaser({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border p-8 md:flex-row md:items-center" style={{ borderColor: "#2dd4bf", background: "#0d262c" }}>
        <div>
          <h2 className="tpl-display text-3xl font-bold md:text-4xl">{v(data, "ctaBandTitle")}</h2>
          <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: "#7eb8b4" }}>{v(data, "ctaBandText")}</p>
        </div>
        <button type="button" onClick={() => goTo("contact")} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#2dd4bf", color: "#2dd4bfText" }}>{v(data, "heroPrimary")}</button>
      </div>
    </section>
  );
}



function OrbitSpecialtyBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)", background: "#0d262c" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="text-xs tracking-[0.28em]" style={{ color: "#2dd4bf" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(data, "page1Title")}</h1>
          <p className="mt-4 text-lg" style={{ color: "#7eb8b4" }}>{v(data, "page1Subtitle")}</p>
        </div>
        <img src={v(data, "item4Image")} alt="" className="aspect-[16/10] w-full object-cover" />
      </div>
    </section>
  );
}
function OrbitCategoryGrid({ data }: { data: Record<string, any> }) {
  const cats = [[v(data, "cat1Title"), v(data, "cat1Text")], [v(data, "cat2Title"), v(data, "cat2Text")], [v(data, "cat3Title"), v(data, "cat3Text")], [v(data, "cat4Title"), v(data, "cat4Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
        {cats.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 70} variant="up">
            <div className="border p-5" style={{ borderColor: "rgba(232,247,246,0.12)", background: i % 2 ? "#0d262c" : "#071a1f" }}>
              <h3 className="tpl-display text-xl font-bold" style={{ color: "#2dd4bf" }}>{t}</h3>
              <p className="mt-2 text-sm" style={{ color: "#7eb8b4" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
function OrbitFullMenuBoard({ data }: { data: Record<string, any> }) {
  const items = [1, 2, 3, 4, 5, 6].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "menuListTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, meta, text, img], i) => (
            <Reveal key={title} delayMs={i * 50} variant="up">
              <article className="overflow-hidden border" style={{ borderColor: "rgba(232,247,246,0.12)", background: "#0d262c" }}>
                <img src={img} alt="" className="aspect-[5/4] w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="tpl-display text-xl font-bold">{title}</h3>
                    <span className="text-xs font-bold" style={{ color: "#2dd4bf" }}>{meta}</span>
                  </div>
                  <p className="mt-2 text-sm" style={{ color: "#7eb8b4" }}>{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function OrbitChefPicks({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#2dd4bf" }}>{v(data, "chefPickEyebrow")}</p>
          <h2 className="tpl-display mt-3 text-3xl font-bold">{v(data, "chefPickTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#7eb8b4" }}>{v(data, "chefPickText")}</p>
        </div>
        <img src={v(data, "item5Image")} alt="" className="aspect-[4/3] w-full object-cover" />
      </div>
    </section>
  );
}
function OrbitPairingNotes({ data }: { data: Record<string, any> }) {
  const pairs = [[v(data, "pair1Title"), v(data, "pair1Text")], [v(data, "pair2Title"), v(data, "pair2Text")], [v(data, "pair3Title"), v(data, "pair3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)", background: "#0d262c" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "pairingTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pairs.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 80} variant="up">
              <div className="border-r pr-4" style={{ borderColor: "#2dd4bf" }}>
                <h3 className="font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "#7eb8b4" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


function OrbitStoryBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative overflow-hidden px-5 py-20 lg:px-8" style={{ background: "#0d262c" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#2dd4bf" }}>{v(data, "brandName")}</p>
        <h1 className="tpl-display mt-4 max-w-3xl text-5xl font-bold md:text-6xl">{v(data, "page2Title")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#7eb8b4" }}>{v(data, "page2Subtitle")}</p>
      </div>
    </section>
  );
}
function OrbitTechniqueLadder({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "tech1Title"), v(data, "tech1Text")], [v(data, "tech2Title"), v(data, "tech2Text")], [v(data, "tech3Title"), v(data, "tech3Text")], [v(data, "tech4Title"), v(data, "tech4Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "techTitle")}</h2></Reveal>
        <div className="mt-10 space-y-6">
          {steps.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 70} variant="right">
              <div className="grid gap-2 border p-5 md:grid-cols-[60px_1fr]" style={{ borderColor: "rgba(232,247,246,0.12)", background: i % 2 ? "#0d262c" : "#071a1f" }}>
                <span className="tpl-display text-3xl font-bold" style={{ color: "#2dd4bf" }}>0{i + 1}</span>
                <div>
                  <h3 className="tpl-display text-xl font-bold">{t}</h3>
                  <p className="mt-2 text-sm leading-7" style={{ color: "#7eb8b4" }}>{x}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function OrbitMaterialCards({ data }: { data: Record<string, any> }) {
  const mats = [[v(data, "mat1Title"), v(data, "mat1Text")], [v(data, "mat2Title"), v(data, "mat2Text")], [v(data, "mat3Title"), v(data, "mat3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)", background: "#0d262c" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "matTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {mats.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 70} variant="up">
              <div className="border p-6" style={{ borderColor: "#2dd4bf" }}>
                <h3 className="tpl-display text-xl font-bold">{t}</h3>
                <p className="mt-3 text-sm" style={{ color: "#7eb8b4" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function OrbitEventsBand({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "galleryImage2")} alt="" className="aspect-[16/10] w-full object-cover" />
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data, "eventsTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#7eb8b4" }}>{v(data, "eventsText")}</p>
          <p className="mt-4 text-sm font-semibold" style={{ color: "#2dd4bf" }}>{v(data, "eventsMeta")}</p>
        </div>
      </div>
    </section>
  );
}


function OrbitAboutBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#2dd4bf" }}>{v(data, "aboutEyebrow")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(data, "aboutPageTitle")}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "#7eb8b4" }}>{v(data, "aboutPageLead")}</p>
      </div>
    </section>
  );
}
function OrbitAboutTimeline({ data }: { data: Record<string, any> }) {
  const items = [[v(data, "timeline1Year"), v(data, "timeline1Text")], [v(data, "timeline2Year"), v(data, "timeline2Text")], [v(data, "timeline3Year"), v(data, "timeline3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)", background: "#0d262c" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "timelineTitle")}</h2></Reveal>
        <div className="relative mt-10">
          <div className="absolute right-3 top-0 bottom-0 w-px" style={{ background: "rgba(232,247,246,0.12)" }} />
          {items.map(([year, text], i) => (
            <Reveal key={year} delayMs={i * 80} variant="right">
              <div className="relative grid gap-2 pb-10 pr-12">
                <div className="absolute right-1.5 top-1 h-3 w-3 rounded-full border-2" style={{ borderColor: "#2dd4bf", background: "#071a1f" }} />
                <p className="text-xs tracking-[0.2em]" style={{ color: "#2dd4bf" }}>{year}</p>
                <p className="text-sm leading-7">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function OrbitChefPortrait({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "chefImage")} alt="" className="aspect-[4/5] w-full object-cover" />
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#2dd4bf" }}>{v(data, "chefLabel")}</p>
          <h2 className="tpl-display mt-3 text-2xl sm:text-4xl font-bold">{v(data, "chefName")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#7eb8b4" }}>{v(data, "chefBio")}</p>
          <blockquote className="mt-8 border-r-4 pr-4 text-xl" style={{ borderColor: "#2dd4bf" }}>״{v(data, "chefQuote")}״</blockquote>
        </div>
      </div>
    </section>
  );
}
function OrbitValuesRow({ data }: { data: Record<string, any> }) {
  const vals = [[v(data, "value1Title"), v(data, "value1Text")], [v(data, "value2Title"), v(data, "value2Text")], [v(data, "value3Title"), v(data, "value3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)", background: "#0d262c" }}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {vals.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 70} variant="up">
            <div className="p-5">
              <h3 className="tpl-display text-2xl font-bold" style={{ color: "#2dd4bf" }}>{t}</h3>
              <p className="mt-3 text-sm leading-7" style={{ color: "#7eb8b4" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function OrbitContactBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#2dd4bf" }}>{v(data, "contactEyebrow")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(data, "contactPageTitle")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#7eb8b4" }}>{v(data, "contactPageText")}</p>
      </div>
    </section>
  );
}
function OrbitReserveForm({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
      <div className="mx-auto max-w-xl text-center">
        <h2 className="tpl-display text-3xl font-bold">{v(data, "contactTitle")}</h2>
        <p className="mt-4 leading-8" style={{ color: "#7eb8b4" }}>{v(data, "contactText")}</p>
        <form className="mt-8 grid gap-3 rounded-[2rem] border p-6 text-right" style={{ borderColor: "#2dd4bf", background: "#0d262c" }}  data-bizuply-block="lead-form" data-bizuply-form-id="pokeline-contact-1" data-bizuply-crm-lead="true" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם." >
          <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  className="w-full rounded-full border bg-transparent px-4 py-3.5 outline-none" style={{ borderColor: "rgba(232,247,246,0.12)", color: "#e8f7f6" }} placeholder="שם מלא" />
          <input name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel"  className="w-full rounded-full border bg-transparent px-4 py-3.5 outline-none" style={{ borderColor: "rgba(232,247,246,0.12)", color: "#e8f7f6" }} placeholder="טלפון" />
          <input className="w-full rounded-full border bg-transparent px-4 py-3.5 outline-none" style={{ borderColor: "rgba(232,247,246,0.12)", color: "#e8f7f6" }} placeholder="תאריך" />
          <button type="button" onClick={onCta} className="rounded-full px-6 py-4 text-sm font-bold" style={{ background: "#2dd4bf", color: "#2dd4bfText" }}>{v(data, "cta")}</button>
        </form>
        <p className="mt-6 text-sm" style={{ color: "#7eb8b4" }}>{v(data, "phone")} · {v(data, "email")}</p>
      </div>
    </section>
  );
}
function OrbitHoursMap({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        <div className="border p-6" style={{ borderColor: "rgba(232,247,246,0.12)", background: "#0d262c" }}>
          <h3 className="tpl-display text-2xl font-bold">{v(data, "hoursTitle")}</h3>
          <p className="mt-4 text-sm leading-7" style={{ color: "#7eb8b4" }}>{v(data, "hours")}</p>
          <p className="mt-4 text-sm">{v(data, "address")}</p>
        </div>
        <div className="relative min-h-[220px] overflow-hidden border" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
          <img src={v(data, "galleryImage1")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border px-4 py-2 text-xs font-bold tracking-wider" style={{ borderColor: "#2dd4bf", background: "#071a1f", color: "#2dd4bf" }}>{v(data, "mapLabel")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
function OrbitFaqBlock({ data }: { data: Record<string, any> }) {
  const faqs = [[v(data, "faq1Q"), v(data, "faq1A")], [v(data, "faq2Q"), v(data, "faq2A")], [v(data, "faq3Q"), v(data, "faq3A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(232,247,246,0.12)", background: "#0d262c" }}>
      <div className="mx-auto max-w-3xl space-y-4">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "faqTitle")}</h2></Reveal>
        {faqs.map(([q, a], i) => (
          <Reveal key={q} delayMs={i * 70} variant="up">
            <details className="border p-4" style={{ borderColor: "rgba(232,247,246,0.12)" }}>
              <summary className="cursor-pointer font-bold">{q}</summary>
              <p className="mt-3 text-sm leading-7" style={{ color: "#7eb8b4" }}>{a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2" style={{ borderColor: "#2dd4bf" }} />
        <span className="tpl-display text-lg font-semibold tracking-[0.2em]">{v(data, "brandName")}</span>
        <span className="text-sm" style={{ color: "#7eb8b4" }}>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <OrbitBowlMap data={data} />
      <OrbitProcessSteps data={data} />
      <OrbitHomeGallery data={data} />
      <OrbitHomeReviews data={data} />
      <OrbitHomeStats data={data} />
      <OrbitHomeCtaTeaser data={data} goTo={goTo} />
      <Footer data={data} />
    </>
  );
}

function BowlsPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <OrbitSpecialtyBanner data={data} />
      <OrbitCategoryGrid data={data} />
      <OrbitFullMenuBoard data={data} />
      <OrbitChefPicks data={data} />
      <OrbitPairingNotes data={data} />
      <Footer data={data} />
    </>
  );
}

function BuildPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <OrbitStoryBanner data={data} />
      <OrbitTechniqueLadder data={data} />
      <OrbitMaterialCards data={data} />
      <OrbitEventsBand data={data} />
      <Footer data={data} />
    </>
  );
}

function AboutPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <OrbitAboutBanner data={data} />
      <OrbitAboutTimeline data={data} />
      <OrbitChefPortrait data={data} />
      <OrbitValuesRow data={data} />
      <Footer data={data} />
    </>
  );
}

function ContactPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <OrbitContactBanner data={data} />
      <OrbitReserveForm data={data} onCta={onCta} />
      <OrbitHoursMap data={data} />
      <OrbitFaqBlock data={data} />
      <Footer data={data} />
    </>
  );
}

export default function PokelinePages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...pokelineDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    bowls: <BowlsPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    build: <BuildPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    about: <AboutPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: <ContactPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "pokeline-preview" : "pokeline"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#071a1f", color: "#e8f7f6" }}>
      <style dangerouslySetInnerHTML={{ __html: pokelineEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
