import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { burgerhausDefaultData } from "./defaultData";
import { burgerhausEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const burgerhausPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "burgers", label: "בורגרים", slug: "/burgers" },
  { id: "smash", label: "הסמאש", slug: "/smash" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = burgerhausPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (burgerhausDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = burgerhausPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50" style={{ background: "#050505" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="border-4 px-3 py-1" style={{ borderColor: "#f59e0b" }}>
          <span className="tpl-display text-xl font-black">{v(data, "brandName")}</span>
        </button>
        
        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#f5f5f5" : "#a3a3a3" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="px-5 py-2.5 text-sm font-black" style={{ background: "#f59e0b", color: "#111111" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative isolate min-h-[90vh] overflow-hidden">
        <img src={v(data, "heroImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #05050566, #111111f5)" }} />
        <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
          
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#f59e0b" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#a3a3a3" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#f59e0b", color: "#111111" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("burgers")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(245,245,245,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </section>
  );
}


function SmashBurgerPile({ data }: { data: Record<string, any> }) {
  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
      <div className="mx-auto max-w-lg">
        <Reveal><h2 className="tpl-display text-center text-4xl font-black md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="relative mt-12 space-y-[-12px]">
          {cards.map((c, i) => (
            <Reveal key={c.title} delayMs={i * 110} variant="up">
              <article className="tpl-smash relative z-[3] flex gap-4 border-4 p-4" style={{ borderColor: "#f59e0b", background: "#1a1a1a", transform: `rotate(${(i - 1) * 2}deg)`, zIndex: 3 - i }}>
                <img src={c.img} alt="" className="h-20 w-20 object-cover" />
                <div>
                  <p className="text-xs font-black uppercase" style={{ color: "#f59e0b" }}>{c.meta}</p>
                  <h3 className="tpl-display text-2xl font-black">{c.title}</h3>
                  <p className="mt-1 text-sm" style={{ color: "#a3a3a3" }}>{c.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SmashProcessSteps({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "process1Title"), v(data, "process1Text")], [v(data, "process2Title"), v(data, "process2Text")], [v(data, "process3Title"), v(data, "process3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-center text-3xl font-bold md:text-4xl">{v(data, "processTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 90} variant="up">
              <div className="border-t-2 pt-4" style={{ borderColor: "#f59e0b" }}>
                <div className="text-xs font-bold tracking-[0.2em]" style={{ color: "#f59e0b" }}>0{i + 1}</div>
                <h3 className="tpl-display mt-2 text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "#a3a3a3" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SmashHomeGallery({ data }: { data: Record<string, any> }) {
  const imgs = [v(data, "galleryImage1"), v(data, "galleryImage2"), v(data, "galleryImage3"), v(data, "galleryImage4")];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,245,245,0.12)", background: "#1a1a1a" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-2xl sm:text-4xl font-bold">{v(data, "galleryTitle")}</h2></Reveal>
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

function SmashHomeReviews({ data }: { data: Record<string, any> }) {
  const revs = [1, 2, 3].map((i) => [v(data, `review${i}Text`), v(data, `review${i}Name`), v(data, `review${i}Role`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-2xl sm:text-4xl font-bold">{v(data, "reviewsTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {revs.map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i * 80} variant="up">
              <blockquote className="border p-5" style={{ borderColor: "rgba(245,245,245,0.12)", background: "#1a1a1a" }}>
                <p className="text-sm leading-7" style={{ color: "#a3a3a3" }}>״{text}״</p>
                <footer className="mt-4 text-sm font-bold">{name} <span className="font-normal" style={{ color: "#a3a3a3" }}>· {role}</span></footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SmashHomeStats({ data }: { data: Record<string, any> }) {
  const stats = [[v(data, "stat1"), v(data, "stat1Label")], [v(data, "stat2"), v(data, "stat2Label")], [v(data, "stat3"), v(data, "stat3Label")]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)", background: "#1a1a1a" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {stats.map(([n, l], i) => (
            <Reveal key={l} delayMs={i * 70} variant="scale">
              <div className="border px-4 py-3" style={{ borderColor: "#f59e0b" }}>
                <div className="tpl-display text-3xl font-bold" style={{ color: "#f59e0b" }}>{n}</div>
                <p className="mt-1 text-xs" style={{ color: "#a3a3a3" }}>{l}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="max-w-md text-center text-sm leading-7 md:text-right" style={{ color: "#a3a3a3" }}>{v(data, "hours")}</p>
      </div>
    </section>
  );
}

function SmashHomeCtaTeaser({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border p-8 md:flex-row md:items-center" style={{ borderColor: "#f59e0b", background: "#1a1a1a" }}>
        <div>
          <h2 className="tpl-display text-3xl font-bold md:text-4xl">{v(data, "ctaBandTitle")}</h2>
          <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: "#a3a3a3" }}>{v(data, "ctaBandText")}</p>
        </div>
        <button type="button" onClick={() => goTo("contact")} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#f59e0b", color: "#f59e0bText" }}>{v(data, "heroPrimary")}</button>
      </div>
    </section>
  );
}



function SmashSpecialtyBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative overflow-hidden border-b px-5 py-20 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
      <img src={v(data, "item4Image")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #111111, transparent)" }} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#f59e0b" }}>{v(data, "brandName")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-7xl">{v(data, "page1Title")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#a3a3a3" }}>{v(data, "page1Subtitle")}</p>
      </div>
    </section>
  );
}
function SmashFullMenuBoard({ data }: { data: Record<string, any> }) {
  const items = [1, 2, 3, 4, 5, 6].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)", background: "#1a1a1a" }}>
      <div className="mx-auto max-w-4xl space-y-6">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "menuListTitle")}</h2></Reveal>
        {items.map(([title, meta, text, img], i) => (
          <Reveal key={title} delayMs={i * 60} variant="right">
            <article className="grid gap-4 border-b pb-6 md:grid-cols-[100px_1fr_auto]" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
              <img src={img} alt="" className="aspect-square w-full object-cover" />
              <div>
                <h3 className="tpl-display text-2xl font-bold">{title}</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "#a3a3a3" }}>{text}</p>
              </div>
              <p className="text-sm font-bold" style={{ color: "#f59e0b" }}>{meta}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
function SmashCategoryGrid({ data }: { data: Record<string, any> }) {
  const cats = [[v(data, "cat1Title"), v(data, "cat1Text")], [v(data, "cat2Title"), v(data, "cat2Text")], [v(data, "cat3Title"), v(data, "cat3Text")], [v(data, "cat4Title"), v(data, "cat4Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
        {cats.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 70} variant="up">
            <div className="border p-5" style={{ borderColor: "rgba(245,245,245,0.12)", background: i % 2 ? "#1a1a1a" : "#111111" }}>
              <h3 className="tpl-display text-xl font-bold" style={{ color: "#f59e0b" }}>{t}</h3>
              <p className="mt-2 text-sm" style={{ color: "#a3a3a3" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
function SmashPairingNotes({ data }: { data: Record<string, any> }) {
  const pairs = [[v(data, "pair1Title"), v(data, "pair1Text")], [v(data, "pair2Title"), v(data, "pair2Text")], [v(data, "pair3Title"), v(data, "pair3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)", background: "#1a1a1a" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "pairingTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pairs.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 80} variant="up">
              <div className="border-r pr-4" style={{ borderColor: "#f59e0b" }}>
                <h3 className="font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "#a3a3a3" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function SmashChefPicks({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#f59e0b" }}>{v(data, "chefPickEyebrow")}</p>
          <h2 className="tpl-display mt-3 text-3xl font-bold">{v(data, "chefPickTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#a3a3a3" }}>{v(data, "chefPickText")}</p>
        </div>
        <img src={v(data, "item5Image")} alt="" className="aspect-[4/3] w-full object-cover" />
      </div>
    </section>
  );
}


function SmashStoryBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative overflow-hidden px-5 py-20 lg:px-8" style={{ background: "#1a1a1a" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#f59e0b" }}>{v(data, "brandName")}</p>
        <h1 className="tpl-display mt-4 max-w-3xl text-5xl font-bold md:text-6xl">{v(data, "page2Title")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#a3a3a3" }}>{v(data, "page2Subtitle")}</p>
      </div>
    </section>
  );
}
function SmashTechniqueLadder({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "tech1Title"), v(data, "tech1Text")], [v(data, "tech2Title"), v(data, "tech2Text")], [v(data, "tech3Title"), v(data, "tech3Text")], [v(data, "tech4Title"), v(data, "tech4Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "techTitle")}</h2></Reveal>
        <div className="mt-10 space-y-6">
          {steps.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 70} variant="up">
              <div className="grid gap-2 border p-5 md:grid-cols-[60px_1fr]" style={{ borderColor: "rgba(245,245,245,0.12)", background: i % 2 ? "#1a1a1a" : "#111111" }}>
                <span className="tpl-display text-3xl font-bold" style={{ color: "#f59e0b" }}>0{i + 1}</span>
                <div>
                  <h3 className="tpl-display text-xl font-bold">{t}</h3>
                  <p className="mt-2 text-sm leading-7" style={{ color: "#a3a3a3" }}>{x}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function SmashMaterialCards({ data }: { data: Record<string, any> }) {
  const mats = [[v(data, "mat1Title"), v(data, "mat1Text")], [v(data, "mat2Title"), v(data, "mat2Text")], [v(data, "mat3Title"), v(data, "mat3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)", background: "#1a1a1a" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "matTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {mats.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 70} variant="up">
              <div className="border p-6" style={{ borderColor: "#f59e0b" }}>
                <h3 className="tpl-display text-xl font-bold">{t}</h3>
                <p className="mt-3 text-sm" style={{ color: "#a3a3a3" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function SmashEventsBand({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "galleryImage2")} alt="" className="aspect-[16/10] w-full object-cover" />
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data, "eventsTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#a3a3a3" }}>{v(data, "eventsText")}</p>
          <p className="mt-4 text-sm font-semibold" style={{ color: "#f59e0b" }}>{v(data, "eventsMeta")}</p>
        </div>
      </div>
    </section>
  );
}


function SmashAboutBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#f59e0b" }}>{v(data, "aboutEyebrow")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(data, "aboutPageTitle")}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "#a3a3a3" }}>{v(data, "aboutPageLead")}</p>
      </div>
    </section>
  );
}
function SmashAboutTimeline({ data }: { data: Record<string, any> }) {
  const items = [[v(data, "timeline1Year"), v(data, "timeline1Text")], [v(data, "timeline2Year"), v(data, "timeline2Text")], [v(data, "timeline3Year"), v(data, "timeline3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)", background: "#1a1a1a" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "timelineTitle")}</h2></Reveal>
        <div className="relative mt-10">
          <div className="absolute right-3 top-0 bottom-0 w-px" style={{ background: "rgba(245,245,245,0.12)" }} />
          {items.map(([year, text], i) => (
            <Reveal key={year} delayMs={i * 80} variant="right">
              <div className="relative grid gap-2 pb-10 pr-12">
                <div className="absolute right-1.5 top-1 h-3 w-3 rounded-full border-2" style={{ borderColor: "#f59e0b", background: "#111111" }} />
                <p className="text-xs tracking-[0.2em]" style={{ color: "#f59e0b" }}>{year}</p>
                <p className="text-sm leading-7">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function SmashChefPortrait({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "chefImage")} alt="" className="aspect-[4/5] w-full object-cover" />
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#f59e0b" }}>{v(data, "chefLabel")}</p>
          <h2 className="tpl-display mt-3 text-2xl sm:text-4xl font-bold">{v(data, "chefName")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#a3a3a3" }}>{v(data, "chefBio")}</p>
          <blockquote className="mt-8 border-r-4 pr-4 text-xl" style={{ borderColor: "#f59e0b" }}>״{v(data, "chefQuote")}״</blockquote>
        </div>
      </div>
    </section>
  );
}
function SmashValuesRow({ data }: { data: Record<string, any> }) {
  const vals = [[v(data, "value1Title"), v(data, "value1Text")], [v(data, "value2Title"), v(data, "value2Text")], [v(data, "value3Title"), v(data, "value3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)", background: "#1a1a1a" }}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {vals.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 70} variant="up">
            <div className="p-5">
              <h3 className="tpl-display text-2xl font-bold" style={{ color: "#f59e0b" }}>{t}</h3>
              <p className="mt-3 text-sm leading-7" style={{ color: "#a3a3a3" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function SmashContactBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#f59e0b" }}>{v(data, "contactEyebrow")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(data, "contactPageTitle")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#a3a3a3" }}>{v(data, "contactPageText")}</p>
      </div>
    </section>
  );
}
function SmashReserveForm({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)", background: "#1a1a1a" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data, "contactTitle")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#a3a3a3" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#a3a3a3" }}><p>{v(data, "phone")}</p><p>{v(data, "email")}</p><p>{v(data, "address")}</p></div>
        </div>
        <form className="grid gap-3 border p-6" style={{ borderColor: "#f59e0b" }} data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-skin="template" data-bizuply-form-id="burgerhaus-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(245,245,245,0.12)", color: "#f5f5f5" }} placeholder="שם מלא" name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(245,245,245,0.12)", color: "#f5f5f5" }} placeholder="טלפון" name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(245,245,245,0.12)", color: "#f5f5f5" }} placeholder="תאריך" name="date" data-bizuply-form-field-id="date" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(245,245,245,0.12)", color: "#f5f5f5" }} placeholder="מספר סועדים" name="guests" data-bizuply-form-field-id="guests" />
          <button type="submit" className="px-6 py-4 text-sm font-bold" style={{ background: "#f59e0b", color: "#f59e0bText" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}
function SmashHoursMap({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        <div className="border p-6" style={{ borderColor: "rgba(245,245,245,0.12)", background: "#1a1a1a" }}>
          <h3 className="tpl-display text-2xl font-bold">{v(data, "hoursTitle")}</h3>
          <p className="mt-4 text-sm leading-7" style={{ color: "#a3a3a3" }}>{v(data, "hours")}</p>
          <p className="mt-4 text-sm">{v(data, "address")}</p>
        </div>
        <div className="relative min-h-[220px] overflow-hidden border" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
          <img src={v(data, "galleryImage1")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border px-4 py-2 text-xs font-bold tracking-wider" style={{ borderColor: "#f59e0b", background: "#111111", color: "#f59e0b" }}>{v(data, "mapLabel")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
function SmashFaqBlock({ data }: { data: Record<string, any> }) {
  const faqs = [[v(data, "faq1Q"), v(data, "faq1A")], [v(data, "faq2Q"), v(data, "faq2A")], [v(data, "faq3Q"), v(data, "faq3A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(245,245,245,0.12)", background: "#1a1a1a" }}>
      <div className="mx-auto max-w-3xl space-y-4">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "faqTitle")}</h2></Reveal>
        {faqs.map(([q, a], i) => (
          <Reveal key={q} delayMs={i * 70} variant="up">
            <details className="border p-4" style={{ borderColor: "rgba(245,245,245,0.12)" }}>
              <summary className="cursor-pointer font-bold">{q}</summary>
              <p className="mt-3 text-sm leading-7" style={{ color: "#a3a3a3" }}>{a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="px-5 py-8 lg:px-8" style={{ background: "#050505" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between border-4 px-4 py-3" style={{ borderColor: "#f59e0b" }}>
        <span className="tpl-display text-xl font-black">{v(data, "brandName")}</span>
        <span className="text-sm" style={{ color: "#a3a3a3" }}>{v(data, "email")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <SmashBurgerPile data={data} />
      <SmashProcessSteps data={data} />
      <SmashHomeGallery data={data} />
      <SmashHomeReviews data={data} />
      <SmashHomeStats data={data} />
      <SmashHomeCtaTeaser data={data} goTo={goTo} />
      <Footer data={data} />
    </>
  );
}

function BurgersPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <SmashSpecialtyBanner data={data} />
      <SmashFullMenuBoard data={data} />
      <SmashCategoryGrid data={data} />
      <SmashPairingNotes data={data} />
      <SmashChefPicks data={data} />
      <Footer data={data} />
    </>
  );
}

function SmashPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <SmashStoryBanner data={data} />
      <SmashTechniqueLadder data={data} />
      <SmashMaterialCards data={data} />
      <SmashEventsBand data={data} />
      <Footer data={data} />
    </>
  );
}

function AboutPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <SmashAboutBanner data={data} />
      <SmashAboutTimeline data={data} />
      <SmashChefPortrait data={data} />
      <SmashValuesRow data={data} />
      <Footer data={data} />
    </>
  );
}

function ContactPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <SmashContactBanner data={data} />
      <SmashReserveForm data={data} onCta={onCta} />
      <SmashHoursMap data={data} />
      <SmashFaqBlock data={data} />
      <Footer data={data} />
    </>
  );
}

export default function BurgerhausPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...burgerhausDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    burgers: <BurgersPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    smash: <SmashPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    about: <AboutPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: <ContactPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  return (
    <div dir="rtl" data-template-id="burgerhaus" className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#111111", color: "#f5f5f5" }}>
      <style dangerouslySetInnerHTML={{ __html: burgerhausEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
