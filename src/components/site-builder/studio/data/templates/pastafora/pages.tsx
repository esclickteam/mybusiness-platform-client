import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { pastaforaDefaultData } from "./defaultData";
import { pastaforaEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const pastaforaPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "pastas", label: "פסטות", slug: "/pastas" },
  { id: "sauce", label: "הרטבים", slug: "/sauce" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = pastaforaPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (pastaforaDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = pastaforaPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{ background: "#faf7f2f5", borderColor: "rgba(44,24,16,0.12)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="tpl-display text-2xl font-bold italic">{v(data, "brandName")}</button>
        
        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#2c1810" : "#8b6b5a" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="px-5 py-2.5 text-sm font-bold" style={{ background: "#b91c1c", color: "#faf7f2" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative isolate min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0" style={{ background: "#faf7f2" }} />
        <div className="tpl-swirl absolute -left-20 top-20 h-80 w-80 rounded-full opacity-40" style={{ background: `conic-gradient(from 0deg, #b91c1c55, transparent, #b91c1c33)` }} />
        <div className="relative z-10 mx-auto grid min-h-[90vh] max-w-7xl items-center gap-10 px-5 py-12 md:py-24 lg:grid-cols-2 lg:px-8">
          <div>
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#b91c1c" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#8b6b5a" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#b91c1c", color: "#faf7f2" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("pastas")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(44,24,16,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div></div>
          <img src={v(data, "heroImage")} alt="" className="aspect-[4/5] w-full object-cover" style={{ borderRadius: "40% 60% 50% 50%" }} />
        </div>
      </section>
  );
}


function NoodleSwirlBoard({ data }: { data: Record<string, any> }) {
  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,24,16,0.12)", background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[240px_1fr]">
          <div className="tpl-swirl relative mx-auto h-52 w-52 rounded-full border-4" style={{ borderColor: "#b91c1c", background: "conic-gradient(from 0deg, #b91c1c33, transparent, #b91c1c66, transparent)" }}>
            <div className="absolute inset-8 overflow-hidden rounded-full">
              <img src={v(data, "item2Image")} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="grid gap-4">
            {cards.map((c, i) => (
              <Reveal key={c.title} delayMs={i * 80} variant="left">
                <article className="grid gap-3 border-b pb-4 md:grid-cols-[80px_1fr]" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
                  <img src={c.img} alt="" className="aspect-square w-full object-cover" style={{ borderRadius: "30%" }} />
                  <div>
                    <p className="text-xs" style={{ color: "#b91c1c" }}>{c.meta}</p>
                    <h3 className="tpl-display text-xl font-bold">{c.title}</h3>
                    <p className="mt-1 text-sm" style={{ color: "#8b6b5a" }}>{c.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NoodleProcessSteps({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "process1Title"), v(data, "process1Text")], [v(data, "process2Title"), v(data, "process2Text")], [v(data, "process3Title"), v(data, "process3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)", background: "#ffffff" }}>
      <div className="mx-auto max-w-5xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold md:text-4xl">{v(data, "processTitle")}</h2></Reveal>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-stretch">
          {steps.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 80} variant="left" className="flex-1">
              <div className="flex h-full flex-col items-start gap-3 border p-5" style={{ borderColor: "rgba(44,24,16,0.12)", background: "#faf7f2" }}>
                <span className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold" style={{ background: "#b91c1c", color: "#b91c1cText" }}>{i + 1}</span>
                <h3 className="tpl-display text-xl font-bold">{t}</h3>
                <p className="text-sm leading-7" style={{ color: "#8b6b5a" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function NoodleHomeGallery({ data }: { data: Record<string, any> }) {
  const imgs = [v(data, "galleryImage1"), v(data, "galleryImage2"), v(data, "galleryImage3"), v(data, "galleryImage4")];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
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

function NoodleHomeReviews({ data }: { data: Record<string, any> }) {
  const revs = [1, 2, 3].map((i) => [v(data, `review${i}Text`), v(data, `review${i}Name`), v(data, `review${i}Role`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)", background: "#ffffff" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-2xl sm:text-4xl font-bold">{v(data, "reviewsTitle")}</h2></Reveal>
        <div className="mt-10 space-y-6">
          {revs.map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i * 70} variant="right">
              <blockquote className="border-r-4 pr-5" style={{ borderColor: "#b91c1c" }}>
                <p className="text-lg leading-8">״{text}״</p>
                <footer className="mt-3 text-sm font-bold" style={{ color: "#8b6b5a" }}>{name} · {role}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function NoodleHomeStats({ data }: { data: Record<string, any> }) {
  const stats = [[v(data, "stat1"), v(data, "stat1Label")], [v(data, "stat2"), v(data, "stat2Label")], [v(data, "stat3"), v(data, "stat3Label")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
        {stats.map(([n, l], i) => (
          <Reveal key={l} delayMs={i * 70} variant="up">
            <div className="text-center md:text-right">
              <div className="tpl-display text-2xl md:text-5xl font-bold" style={{ color: "#b91c1c" }}>{n}</div>
              <p className="mt-2 text-sm" style={{ color: "#8b6b5a" }}>{l}</p>
            </div>
          </Reveal>
        ))}
        <div className="border p-4 md:col-span-1" style={{ borderColor: "rgba(44,24,16,0.12)", background: "#ffffff" }}>
          <p className="text-xs font-bold tracking-wider" style={{ color: "#b91c1c" }}>{v(data, "hoursTitle")}</p>
          <p className="mt-2 text-sm leading-7" style={{ color: "#8b6b5a" }}>{v(data, "hours")}</p>
        </div>
      </div>
    </section>
  );
}

function NoodleHomeCtaTeaser({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border p-8 md:flex-row md:items-center" style={{ borderColor: "#b91c1c", background: "#ffffff" }}>
        <div>
          <h2 className="tpl-display text-3xl font-bold md:text-4xl">{v(data, "ctaBandTitle")}</h2>
          <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: "#8b6b5a" }}>{v(data, "ctaBandText")}</p>
        </div>
        <button type="button" onClick={() => goTo("contact")} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#b91c1c", color: "#b91c1cText" }}>{v(data, "heroPrimary")}</button>
      </div>
    </section>
  );
}



function NoodleSpecialtyBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="text-xs tracking-[0.28em]" style={{ color: "#b91c1c" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(data, "page1Title")}</h1>
          <p className="mt-4 text-lg" style={{ color: "#8b6b5a" }}>{v(data, "page1Subtitle")}</p>
        </div>
        <img src={v(data, "item4Image")} alt="" className="aspect-[16/10] w-full object-cover" />
      </div>
    </section>
  );
}
function NoodleCategoryGrid({ data }: { data: Record<string, any> }) {
  const cats = [[v(data, "cat1Title"), v(data, "cat1Text")], [v(data, "cat2Title"), v(data, "cat2Text")], [v(data, "cat3Title"), v(data, "cat3Text")], [v(data, "cat4Title"), v(data, "cat4Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
        {cats.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 70} variant="up">
            <div className="border p-5" style={{ borderColor: "rgba(44,24,16,0.12)", background: i % 2 ? "#ffffff" : "#faf7f2" }}>
              <h3 className="tpl-display text-xl font-bold" style={{ color: "#b91c1c" }}>{t}</h3>
              <p className="mt-2 text-sm" style={{ color: "#8b6b5a" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
function NoodleFullMenuBoard({ data }: { data: Record<string, any> }) {
  const items = [1, 2, 3, 4, 5, 6].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "menuListTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, meta, text, img], i) => (
            <Reveal key={title} delayMs={i * 50} variant="up">
              <article className="overflow-hidden border" style={{ borderColor: "rgba(44,24,16,0.12)", background: "#ffffff" }}>
                <img src={img} alt="" className="aspect-[5/4] w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="tpl-display text-xl font-bold">{title}</h3>
                    <span className="text-xs font-bold" style={{ color: "#b91c1c" }}>{meta}</span>
                  </div>
                  <p className="mt-2 text-sm" style={{ color: "#8b6b5a" }}>{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function NoodleChefPicks({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#b91c1c" }}>{v(data, "chefPickEyebrow")}</p>
          <h2 className="tpl-display mt-3 text-3xl font-bold">{v(data, "chefPickTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#8b6b5a" }}>{v(data, "chefPickText")}</p>
        </div>
        <img src={v(data, "item5Image")} alt="" className="aspect-[4/3] w-full object-cover" />
      </div>
    </section>
  );
}
function NoodlePairingNotes({ data }: { data: Record<string, any> }) {
  const pairs = [[v(data, "pair1Title"), v(data, "pair1Text")], [v(data, "pair2Title"), v(data, "pair2Text")], [v(data, "pair3Title"), v(data, "pair3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)", background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "pairingTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pairs.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 80} variant="up">
              <div className="border-r pr-4" style={{ borderColor: "#b91c1c" }}>
                <h3 className="font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "#8b6b5a" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


function NoodleStoryBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative overflow-hidden px-5 py-20 lg:px-8" style={{ background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#b91c1c" }}>{v(data, "brandName")}</p>
        <h1 className="tpl-display mt-4 max-w-3xl text-5xl font-bold md:text-6xl">{v(data, "page2Title")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#8b6b5a" }}>{v(data, "page2Subtitle")}</p>
      </div>
    </section>
  );
}
function NoodleTechniqueLadder({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "tech1Title"), v(data, "tech1Text")], [v(data, "tech2Title"), v(data, "tech2Text")], [v(data, "tech3Title"), v(data, "tech3Text")], [v(data, "tech4Title"), v(data, "tech4Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "techTitle")}</h2></Reveal>
        <div className="mt-10 space-y-6">
          {steps.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 70} variant="right">
              <div className="grid gap-2 border p-5 md:grid-cols-[60px_1fr]" style={{ borderColor: "rgba(44,24,16,0.12)", background: i % 2 ? "#ffffff" : "#faf7f2" }}>
                <span className="tpl-display text-3xl font-bold" style={{ color: "#b91c1c" }}>0{i + 1}</span>
                <div>
                  <h3 className="tpl-display text-xl font-bold">{t}</h3>
                  <p className="mt-2 text-sm leading-7" style={{ color: "#8b6b5a" }}>{x}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function NoodleMaterialCards({ data }: { data: Record<string, any> }) {
  const mats = [[v(data, "mat1Title"), v(data, "mat1Text")], [v(data, "mat2Title"), v(data, "mat2Text")], [v(data, "mat3Title"), v(data, "mat3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)", background: "#ffffff" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "matTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {mats.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 70} variant="up">
              <div className="border p-6" style={{ borderColor: "#b91c1c" }}>
                <h3 className="tpl-display text-xl font-bold">{t}</h3>
                <p className="mt-3 text-sm" style={{ color: "#8b6b5a" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function NoodleEventsBand({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "galleryImage2")} alt="" className="aspect-[16/10] w-full object-cover" />
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data, "eventsTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#8b6b5a" }}>{v(data, "eventsText")}</p>
          <p className="mt-4 text-sm font-semibold" style={{ color: "#b91c1c" }}>{v(data, "eventsMeta")}</p>
        </div>
      </div>
    </section>
  );
}


function NoodleAboutBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#b91c1c" }}>{v(data, "aboutEyebrow")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(data, "aboutPageTitle")}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "#8b6b5a" }}>{v(data, "aboutPageLead")}</p>
      </div>
    </section>
  );
}
function NoodleAboutTimeline({ data }: { data: Record<string, any> }) {
  const items = [[v(data, "timeline1Year"), v(data, "timeline1Text")], [v(data, "timeline2Year"), v(data, "timeline2Text")], [v(data, "timeline3Year"), v(data, "timeline3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)", background: "#ffffff" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "timelineTitle")}</h2></Reveal>
        <div className="relative mt-10">
          <div className="absolute right-3 top-0 bottom-0 w-px" style={{ background: "rgba(44,24,16,0.12)" }} />
          {items.map(([year, text], i) => (
            <Reveal key={year} delayMs={i * 80} variant="right">
              <div className="relative grid gap-2 pb-10 pr-12">
                <div className="absolute right-1.5 top-1 h-3 w-3 rounded-full border-2" style={{ borderColor: "#b91c1c", background: "#faf7f2" }} />
                <p className="text-xs tracking-[0.2em]" style={{ color: "#b91c1c" }}>{year}</p>
                <p className="text-sm leading-7">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function NoodleChefPortrait({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "chefImage")} alt="" className="aspect-[4/5] w-full object-cover" />
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#b91c1c" }}>{v(data, "chefLabel")}</p>
          <h2 className="tpl-display mt-3 text-2xl sm:text-4xl font-bold">{v(data, "chefName")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#8b6b5a" }}>{v(data, "chefBio")}</p>
          <blockquote className="mt-8 border-r-4 pr-4 text-xl" style={{ borderColor: "#b91c1c" }}>״{v(data, "chefQuote")}״</blockquote>
        </div>
      </div>
    </section>
  );
}
function NoodleValuesRow({ data }: { data: Record<string, any> }) {
  const vals = [[v(data, "value1Title"), v(data, "value1Text")], [v(data, "value2Title"), v(data, "value2Text")], [v(data, "value3Title"), v(data, "value3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)", background: "#ffffff" }}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {vals.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 70} variant="up">
            <div className="p-5">
              <h3 className="tpl-display text-2xl font-bold" style={{ color: "#b91c1c" }}>{t}</h3>
              <p className="mt-3 text-sm leading-7" style={{ color: "#8b6b5a" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function NoodleContactBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#b91c1c" }}>{v(data, "contactEyebrow")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(data, "contactPageTitle")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#8b6b5a" }}>{v(data, "contactPageText")}</p>
      </div>
    </section>
  );
}
function NoodleReserveForm({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
      <div className="mx-auto max-w-xl text-center">
        <h2 className="tpl-display text-3xl font-bold">{v(data, "contactTitle")}</h2>
        <p className="mt-4 leading-8" style={{ color: "#8b6b5a" }}>{v(data, "contactText")}</p>
        <form className="mt-8 grid gap-3 rounded-[2rem] border p-6 text-right" style={{ borderColor: "#b91c1c", background: "#ffffff" }} onSubmit={(e) => e.preventDefault()}>
          <input className="w-full rounded-full border bg-transparent px-4 py-3.5 outline-none" style={{ borderColor: "rgba(44,24,16,0.12)", color: "#2c1810" }} placeholder="שם מלא" />
          <input className="w-full rounded-full border bg-transparent px-4 py-3.5 outline-none" style={{ borderColor: "rgba(44,24,16,0.12)", color: "#2c1810" }} placeholder="טלפון" />
          <input className="w-full rounded-full border bg-transparent px-4 py-3.5 outline-none" style={{ borderColor: "rgba(44,24,16,0.12)", color: "#2c1810" }} placeholder="תאריך" />
          <button type="button" onClick={onCta} className="rounded-full px-6 py-4 text-sm font-bold" style={{ background: "#b91c1c", color: "#b91c1cText" }}>{v(data, "cta")}</button>
        </form>
        <p className="mt-6 text-sm" style={{ color: "#8b6b5a" }}>{v(data, "phone")} · {v(data, "email")}</p>
      </div>
    </section>
  );
}
function NoodleHoursMap({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        <div className="border p-6" style={{ borderColor: "rgba(44,24,16,0.12)", background: "#ffffff" }}>
          <h3 className="tpl-display text-2xl font-bold">{v(data, "hoursTitle")}</h3>
          <p className="mt-4 text-sm leading-7" style={{ color: "#8b6b5a" }}>{v(data, "hours")}</p>
          <p className="mt-4 text-sm">{v(data, "address")}</p>
        </div>
        <div className="relative min-h-[220px] overflow-hidden border" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
          <img src={v(data, "galleryImage1")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border px-4 py-2 text-xs font-bold tracking-wider" style={{ borderColor: "#b91c1c", background: "#faf7f2", color: "#b91c1c" }}>{v(data, "mapLabel")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
function NoodleFaqBlock({ data }: { data: Record<string, any> }) {
  const faqs = [[v(data, "faq1Q"), v(data, "faq1A")], [v(data, "faq2Q"), v(data, "faq2A")], [v(data, "faq3Q"), v(data, "faq3A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,24,16,0.12)", background: "#ffffff" }}>
      <div className="mx-auto max-w-3xl space-y-4">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "faqTitle")}</h2></Reveal>
        {faqs.map(([q, a], i) => (
          <Reveal key={q} delayMs={i * 70} variant="up">
            <details className="border p-4" style={{ borderColor: "rgba(44,24,16,0.12)" }}>
              <summary className="cursor-pointer font-bold">{q}</summary>
              <p className="mt-3 text-sm leading-7" style={{ color: "#8b6b5a" }}>{a}</p>
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
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-center">
        <div className="tpl-swirl h-8 w-8 rounded-full border-2" style={{ borderColor: "#b91c1c" }} />
        <span className="tpl-display text-xl font-bold italic">{v(data, "brandName")}</span>
        <span className="text-sm" style={{ color: "#8b6b5a" }}>{v(data, "email")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <NoodleSwirlBoard data={data} />
      <NoodleProcessSteps data={data} />
      <NoodleHomeGallery data={data} />
      <NoodleHomeReviews data={data} />
      <NoodleHomeStats data={data} />
      <NoodleHomeCtaTeaser data={data} goTo={goTo} />
      <Footer data={data} />
    </>
  );
}

function PastasPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <NoodleSpecialtyBanner data={data} />
      <NoodleCategoryGrid data={data} />
      <NoodleFullMenuBoard data={data} />
      <NoodleChefPicks data={data} />
      <NoodlePairingNotes data={data} />
      <Footer data={data} />
    </>
  );
}

function SaucePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <NoodleStoryBanner data={data} />
      <NoodleTechniqueLadder data={data} />
      <NoodleMaterialCards data={data} />
      <NoodleEventsBand data={data} />
      <Footer data={data} />
    </>
  );
}

function AboutPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <NoodleAboutBanner data={data} />
      <NoodleAboutTimeline data={data} />
      <NoodleChefPortrait data={data} />
      <NoodleValuesRow data={data} />
      <Footer data={data} />
    </>
  );
}

function ContactPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <NoodleContactBanner data={data} />
      <NoodleReserveForm data={data} onCta={onCta} />
      <NoodleHoursMap data={data} />
      <NoodleFaqBlock data={data} />
      <Footer data={data} />
    </>
  );
}

export default function PastaforaPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...pastaforaDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    pastas: <PastasPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    sauce: <SaucePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    about: <AboutPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: <ContactPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "pastafora-preview" : "pastafora"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#faf7f2", color: "#2c1810" }}>
      <style dangerouslySetInnerHTML={{ __html: pastaforaEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
