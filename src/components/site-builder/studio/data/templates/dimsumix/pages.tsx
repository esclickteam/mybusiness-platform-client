import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { dimsumixDefaultData } from "./defaultData";
import { dimsumixEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const dimsumixPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "baskets", label: "סלים", slug: "/baskets" },
  { id: "steam", label: "הקיטור", slug: "/steam" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = dimsumixPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (dimsumixDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = dimsumixPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{ background: "#18201cf0", borderColor: "rgba(240,245,242,0.12)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="tpl-display text-2xl font-bold">{v(data, "brandName")}</button>
        
        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#f0f5f2" : "#8aa89a" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="rounded-full px-5 py-2.5 text-sm font-bold" style={{ background: "#86efac", color: "#0f1412" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <img src={v(data, "heroImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0f141299, #0f1412f0)" }} />
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="tpl-steam pointer-events-none absolute bottom-[20%] rounded-full bg-white/25" style={{ left: `${10 + i * 8}%`, width: `${10 + (i % 3) * 4}px`, height: `${24 + (i % 4) * 10}px`, animationDelay: `${i * 0.35}s` }} />
        ))}
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
          
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#86efac" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#8aa89a" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#86efac", color: "#0f1412" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("baskets")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(240,245,242,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </section>
  );
}


function BasketSteamStack({ data }: { data: Record<string, any> }) {
  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="relative border-t px-5 py-16 lg:px-8 lg:py-20 overflow-hidden" style={{ borderColor: "rgba(240,245,242,0.12)", background: "#18201c" }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="tpl-steam pointer-events-none absolute bottom-10 rounded-full bg-white/20" style={{ left: `${10 + i * 10}%`, width: `${8 + (i % 3) * 4}px`, height: `${20 + (i % 4) * 8}px`, animationDelay: `${i * 0.4}s`, ["--steam-dur" as string]: `${5 + (i % 3)}s` }} />
      ))}
      <div className="relative mx-auto max-w-4xl">
        <Reveal><h2 className="tpl-display text-center text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="mt-12 mx-auto max-w-md space-y-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delayMs={i * 100} variant="up">
              <article className="tpl-basket flex items-center gap-4 border-2 px-4 py-3" style={{ borderColor: "#86efac", background: "#0f1412", borderRadius: "999px 999px 40% 40%" }}>
                <img src={c.img} alt="" className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <p className="text-xs" style={{ color: "#86efac" }}>{c.meta}</p>
                  <h3 className="tpl-display text-lg font-bold">{c.title}</h3>
                  <p className="text-sm" style={{ color: "#8aa89a" }}>{c.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BasketProcessSteps({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "process1Title"), v(data, "process1Text")], [v(data, "process2Title"), v(data, "process2Text")], [v(data, "process3Title"), v(data, "process3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)" }}>
      <div className="mx-auto max-w-2xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "processTitle")}</h2></Reveal>
        <ol className="mt-10 space-y-0">
          {steps.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 70} variant="right">
              <li className="grid grid-cols-[48px_1fr] gap-4 border-r-2 pr-4 pb-8" style={{ borderColor: i < 2 ? "#86efac" : "transparent" }}>
                <span className="tpl-display text-3xl font-bold" style={{ color: "#86efac" }}>{i + 1}</span>
                <div>
                  <h3 className="tpl-display text-xl font-bold">{t}</h3>
                  <p className="mt-2 text-sm leading-7" style={{ color: "#8aa89a" }}>{x}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function BasketHomeGallery({ data }: { data: Record<string, any> }) {
  const imgs = [v(data, "galleryImage1"), v(data, "galleryImage2"), v(data, "galleryImage3"), v(data, "galleryImage4")];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-5xl">
        <Reveal><h2 className="tpl-display text-center text-2xl sm:text-4xl font-bold">{v(data, "galleryTitle")}</h2></Reveal>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {imgs.map((src, i) => (
            <Reveal key={i} delayMs={i * 70} variant="up">
              <img src={src} alt="" className="aspect-[4/3] w-full object-cover" style={{ borderRadius: i % 2 ? "2rem 0.5rem" : "0.5rem 2rem" }} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BasketHomeReviews({ data }: { data: Record<string, any> }) {
  const revs = [1, 2, 3].map((i) => [v(data, `review${i}Text`), v(data, `review${i}Name`), v(data, `review${i}Role`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-center text-2xl sm:text-4xl font-bold">{v(data, "reviewsTitle")}</h2></Reveal>
        <div className="mt-10 flex gap-4 overflow-x-auto pb-2">
          {revs.map(([text, name, role], i) => (
            <blockquote key={name} className="min-w-[260px] flex-shrink-0 border p-5" style={{ borderColor: "#86efac", background: "#18201c" }}>
              <p className="text-sm leading-7" style={{ color: "#8aa89a" }}>״{text}״</p>
              <footer className="mt-4 text-sm font-bold">{name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function BasketHomeStats({ data }: { data: Record<string, any> }) {
  const stats = [[v(data, "stat1"), v(data, "stat1Label")], [v(data, "stat2"), v(data, "stat2Label")], [v(data, "stat3"), v(data, "stat3Label")]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)", background: "#080b09", color: "#f0f5f2" }}>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8">
        {stats.map(([n, l], i) => (
          <Reveal key={l} delayMs={i * 60} variant="scale">
            <div className="text-center">
              <div className="tpl-display text-2xl sm:text-4xl font-bold" style={{ color: "#86efac" }}>{n}</div>
              <p className="mt-1 text-xs tracking-wider" style={{ color: "#8aa89a" }}>{l}</p>
            </div>
          </Reveal>
        ))}
        <p className="w-full text-center text-sm" style={{ color: "#8aa89a" }}>{v(data, "hours")}</p>
      </div>
    </section>
  );
}

function BasketHomeCtaTeaser({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border p-8 md:flex-row md:items-center" style={{ borderColor: "#86efac", background: "#18201c" }}>
        <div>
          <h2 className="tpl-display text-3xl font-bold md:text-4xl">{v(data, "ctaBandTitle")}</h2>
          <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: "#8aa89a" }}>{v(data, "ctaBandText")}</p>
        </div>
        <button type="button" onClick={() => goTo("contact")} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#86efac", color: "#86efacText" }}>{v(data, "heroPrimary")}</button>
      </div>
    </section>
  );
}



function BasketSpecialtyBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-20 text-center lg:px-8" style={{ background: "#080b09", color: "#f0f5f2" }}>
      <p className="text-xs tracking-[0.3em]" style={{ color: "#86efac" }}>{v(data, "brandName")}</p>
      <h1 className="tpl-display mt-4 text-5xl font-bold md:text-7xl">{v(data, "page1Title")}</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg" style={{ color: "#8aa89a" }}>{v(data, "page1Subtitle")}</p>
    </section>
  );
}
function BasketFullMenuBoard({ data }: { data: Record<string, any> }) {
  const items = [1, 2, 3, 4, 5, 6].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-center text-3xl font-bold">{v(data, "menuListTitle")}</h2></Reveal>
        <div className="mt-10 divide-y" style={{ borderColor: "rgba(240,245,242,0.12)" }}>
          {items.map(([title, meta, text], i) => (
            <div key={title} className="flex items-start justify-between gap-4 py-5">
              <div>
                <h3 className="tpl-display text-xl font-bold">{title}</h3>
                <p className="mt-1 text-sm" style={{ color: "#8aa89a" }}>{text}</p>
              </div>
              <span className="whitespace-nowrap text-sm font-bold" style={{ color: "#86efac" }}>{meta}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function BasketChefPicks({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#86efac" }}>{v(data, "chefPickEyebrow")}</p>
          <h2 className="tpl-display mt-3 text-3xl font-bold">{v(data, "chefPickTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#8aa89a" }}>{v(data, "chefPickText")}</p>
        </div>
        <img src={v(data, "item5Image")} alt="" className="aspect-[4/3] w-full object-cover" />
      </div>
    </section>
  );
}
function BasketCategoryGrid({ data }: { data: Record<string, any> }) {
  const cats = [[v(data, "cat1Title"), v(data, "cat1Text")], [v(data, "cat2Title"), v(data, "cat2Text")], [v(data, "cat3Title"), v(data, "cat3Text")], [v(data, "cat4Title"), v(data, "cat4Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
        {cats.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 70} variant="up">
            <div className="border p-5" style={{ borderColor: "rgba(240,245,242,0.12)", background: i % 2 ? "#18201c" : "#0f1412" }}>
              <h3 className="tpl-display text-xl font-bold" style={{ color: "#86efac" }}>{t}</h3>
              <p className="mt-2 text-sm" style={{ color: "#8aa89a" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
function BasketPairingNotes({ data }: { data: Record<string, any> }) {
  const pairs = [[v(data, "pair1Title"), v(data, "pair1Text")], [v(data, "pair2Title"), v(data, "pair2Text")], [v(data, "pair3Title"), v(data, "pair3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "pairingTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pairs.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 80} variant="up">
              <div className="border-r pr-4" style={{ borderColor: "#86efac" }}>
                <h3 className="font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "#8aa89a" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


function BasketStoryBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative overflow-hidden px-5 py-20 lg:px-8" style={{ background: "#18201c" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#86efac" }}>{v(data, "brandName")}</p>
        <h1 className="tpl-display mt-4 max-w-3xl text-5xl font-bold md:text-6xl">{v(data, "page2Title")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#8aa89a" }}>{v(data, "page2Subtitle")}</p>
      </div>
    </section>
  );
}
function BasketTechniqueLadder({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "tech1Title"), v(data, "tech1Text")], [v(data, "tech2Title"), v(data, "tech2Text")], [v(data, "tech3Title"), v(data, "tech3Text")], [v(data, "tech4Title"), v(data, "tech4Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "techTitle")}</h2></Reveal>
        <div className="mt-10 space-y-6">
          {steps.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 70} variant="up">
              <div className="grid gap-2 border p-5 md:grid-cols-[60px_1fr]" style={{ borderColor: "rgba(240,245,242,0.12)", background: i % 2 ? "#18201c" : "#0f1412" }}>
                <span className="tpl-display text-3xl font-bold" style={{ color: "#86efac" }}>0{i + 1}</span>
                <div>
                  <h3 className="tpl-display text-xl font-bold">{t}</h3>
                  <p className="mt-2 text-sm leading-7" style={{ color: "#8aa89a" }}>{x}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function BasketMaterialCards({ data }: { data: Record<string, any> }) {
  const mats = [[v(data, "mat1Title"), v(data, "mat1Text")], [v(data, "mat2Title"), v(data, "mat2Text")], [v(data, "mat3Title"), v(data, "mat3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "matTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {mats.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 70} variant="up">
              <div className="border p-6" style={{ borderColor: "#86efac" }}>
                <h3 className="tpl-display text-xl font-bold">{t}</h3>
                <p className="mt-3 text-sm" style={{ color: "#8aa89a" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function BasketEventsBand({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "galleryImage2")} alt="" className="aspect-[16/10] w-full object-cover" />
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data, "eventsTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#8aa89a" }}>{v(data, "eventsText")}</p>
          <p className="mt-4 text-sm font-semibold" style={{ color: "#86efac" }}>{v(data, "eventsMeta")}</p>
        </div>
      </div>
    </section>
  );
}


function BasketAboutBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#86efac" }}>{v(data, "aboutEyebrow")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(data, "aboutPageTitle")}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "#8aa89a" }}>{v(data, "aboutPageLead")}</p>
      </div>
    </section>
  );
}
function BasketAboutTimeline({ data }: { data: Record<string, any> }) {
  const items = [[v(data, "timeline1Year"), v(data, "timeline1Text")], [v(data, "timeline2Year"), v(data, "timeline2Text")], [v(data, "timeline3Year"), v(data, "timeline3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "timelineTitle")}</h2></Reveal>
        <div className="relative mt-10">
          <div className="absolute right-3 top-0 bottom-0 w-px" style={{ background: "rgba(240,245,242,0.12)" }} />
          {items.map(([year, text], i) => (
            <Reveal key={year} delayMs={i * 80} variant="right">
              <div className="relative grid gap-2 pb-10 pr-12">
                <div className="absolute right-1.5 top-1 h-3 w-3 rounded-full border-2" style={{ borderColor: "#86efac", background: "#0f1412" }} />
                <p className="text-xs tracking-[0.2em]" style={{ color: "#86efac" }}>{year}</p>
                <p className="text-sm leading-7">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function BasketChefPortrait({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "chefImage")} alt="" className="aspect-[4/5] w-full object-cover" />
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#86efac" }}>{v(data, "chefLabel")}</p>
          <h2 className="tpl-display mt-3 text-2xl sm:text-4xl font-bold">{v(data, "chefName")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#8aa89a" }}>{v(data, "chefBio")}</p>
          <blockquote className="mt-8 border-r-4 pr-4 text-xl" style={{ borderColor: "#86efac" }}>״{v(data, "chefQuote")}״</blockquote>
        </div>
      </div>
    </section>
  );
}
function BasketValuesRow({ data }: { data: Record<string, any> }) {
  const vals = [[v(data, "value1Title"), v(data, "value1Text")], [v(data, "value2Title"), v(data, "value2Text")], [v(data, "value3Title"), v(data, "value3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)", background: "#18201c" }}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {vals.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 70} variant="up">
            <div className="p-5">
              <h3 className="tpl-display text-2xl font-bold" style={{ color: "#86efac" }}>{t}</h3>
              <p className="mt-3 text-sm leading-7" style={{ color: "#8aa89a" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function BasketContactBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#86efac" }}>{v(data, "contactEyebrow")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(data, "contactPageTitle")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#8aa89a" }}>{v(data, "contactPageText")}</p>
      </div>
    </section>
  );
}
function BasketReserveForm({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-lg">
        <h2 className="tpl-display text-3xl font-bold">{v(data, "contactTitle")}</h2>
        <p className="mt-3 text-sm" style={{ color: "#8aa89a" }}>{v(data, "contactText")}</p>
        <div className="mt-8 space-y-3">
          <div className="mr-8 border p-3 text-sm" style={{ borderColor: "rgba(240,245,242,0.12)", background: "#0f1412" }}>היי! מתי נוח לכם?</div>
          <form className="ml-8 grid gap-2 border p-3" style={{ borderColor: "#86efac" }} data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-skin="template" data-bizuply-form-id="dimsumix-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
            <input className="w-full border bg-transparent px-3 py-2.5 text-right text-sm outline-none" style={{ borderColor: "rgba(240,245,242,0.12)", color: "#f0f5f2" }} placeholder="שם + טלפון" name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
            <input className="w-full border bg-transparent px-3 py-2.5 text-right text-sm outline-none" style={{ borderColor: "rgba(240,245,242,0.12)", color: "#f0f5f2" }} placeholder="תאריך ושעה" name="date" data-bizuply-form-field-id="date" />
            <button type="submit" className="px-4 py-3 text-sm font-bold" style={{ background: "#86efac", color: "#86efacText" }}>{v(data, "cta")}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
function BasketHoursMap({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        <div className="border p-6" style={{ borderColor: "rgba(240,245,242,0.12)", background: "#18201c" }}>
          <h3 className="tpl-display text-2xl font-bold">{v(data, "hoursTitle")}</h3>
          <p className="mt-4 text-sm leading-7" style={{ color: "#8aa89a" }}>{v(data, "hours")}</p>
          <p className="mt-4 text-sm">{v(data, "address")}</p>
        </div>
        <div className="relative min-h-[220px] overflow-hidden border" style={{ borderColor: "rgba(240,245,242,0.12)" }}>
          <img src={v(data, "galleryImage1")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border px-4 py-2 text-xs font-bold tracking-wider" style={{ borderColor: "#86efac", background: "#0f1412", color: "#86efac" }}>{v(data, "mapLabel")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
function BasketFaqBlock({ data }: { data: Record<string, any> }) {
  const faqs = [[v(data, "faq1Q"), v(data, "faq1A")], [v(data, "faq2Q"), v(data, "faq2A")], [v(data, "faq3Q"), v(data, "faq3A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-3xl space-y-4">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "faqTitle")}</h2></Reveal>
        {faqs.map(([q, a], i) => (
          <Reveal key={q} delayMs={i * 70} variant="up">
            <details className="border p-4" style={{ borderColor: "rgba(240,245,242,0.12)" }}>
              <summary className="cursor-pointer font-bold">{q}</summary>
              <p className="mt-3 text-sm leading-7" style={{ color: "#8aa89a" }}>{a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(240,245,242,0.12)" }}>
      <svg className="mx-auto mb-4 h-6 w-full max-w-7xl opacity-40" viewBox="0 0 400 20" style={{ color: "#86efac" }}><path fill="none" stroke="currentColor" strokeWidth="2" d="M0,10 Q50,0 100,10 T200,10 T300,10 T400,10" /></svg>
      <div className="mx-auto flex max-w-7xl justify-between text-sm" style={{ color: "#8aa89a" }}>
        <span className="tpl-display font-bold" style={{ color: "#f0f5f2" }}>{v(data, "brandName")}</span>
        <span>{v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <BasketSteamStack data={data} />
      <BasketProcessSteps data={data} />
      <BasketHomeGallery data={data} />
      <BasketHomeReviews data={data} />
      <BasketHomeStats data={data} />
      <BasketHomeCtaTeaser data={data} goTo={goTo} />
      <Footer data={data} />
    </>
  );
}

function BasketsPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <BasketSpecialtyBanner data={data} />
      <BasketFullMenuBoard data={data} />
      <BasketChefPicks data={data} />
      <BasketCategoryGrid data={data} />
      <BasketPairingNotes data={data} />
      <Footer data={data} />
    </>
  );
}

function SteamPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <BasketStoryBanner data={data} />
      <BasketTechniqueLadder data={data} />
      <BasketMaterialCards data={data} />
      <BasketEventsBand data={data} />
      <Footer data={data} />
    </>
  );
}

function AboutPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <BasketAboutBanner data={data} />
      <BasketAboutTimeline data={data} />
      <BasketChefPortrait data={data} />
      <BasketValuesRow data={data} />
      <Footer data={data} />
    </>
  );
}

function ContactPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <BasketContactBanner data={data} />
      <BasketReserveForm data={data} onCta={onCta} />
      <BasketHoursMap data={data} />
      <BasketFaqBlock data={data} />
      <Footer data={data} />
    </>
  );
}

export default function DimsumixPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...dimsumixDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    baskets: <BasketsPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    steam: <SteamPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    about: <AboutPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: <ContactPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  return (
    <div dir="rtl" data-template-id="dimsumix" className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#0f1412", color: "#f0f5f2" }}>
      <style dangerouslySetInnerHTML={{ __html: dimsumixEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
