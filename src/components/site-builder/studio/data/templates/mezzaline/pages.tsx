import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { mezzalineDefaultData } from "./defaultData";
import { mezzalineEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const mezzalinePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "mezze", label: "מזטה", slug: "/mezze" },
  { id: "table", label: "השולחן", slug: "/table" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = mezzalinePages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (mezzalineDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = mezzalinePages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50" style={{ background: "#f7f1e6f0" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="text-right">
          <span className="tpl-display text-2xl font-bold">{v(data, "brandName")}</span>
          <span className="tpl-branch-under mt-2 block w-24" />
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="relative text-sm font-semibold"
              style={{ color: currentPage === id ? "#2c2a22" : "#7a7260" }}>
              {label}
              {currentPage === id ? <span className="absolute -bottom-1 right-0 left-0 h-px" style={{ background: "#5c7a4a" }} /> : null}
            </button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="rounded-sm px-5 py-2.5 text-sm font-bold" style={{ background: "#5c7a4a", color: "#f7f1e6" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative overflow-hidden px-5 py-16 lg:px-8 lg:py-20" style={{ background: "#f7f1e6" }}>
        {[["12%","18%"],["78%","12%"],["60%","70%"],["22%","65%"]].map(([l, top], i) => (
          <div key={i} className="tpl-olive pointer-events-none absolute h-4 w-3 rounded-full" style={{ left: l, top: top, background: i % 2 ? "#5c7a4a" : "#1c1a14", animationDelay: `${i * 0.6}s` }} />
        ))}
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {[v(data, "heroImage"), v(data, "item1Image"), v(data, "item2Image"), v(data, "item3Image")].map((src, i) => (
              <div key={i} className={`overflow-hidden ${i === 0 ? "row-span-1 aspect-[4/3]" : "aspect-square"}`}>
                <img src={src} alt="" className="tpl-ken h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-10 max-w-2xl">
            <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#5c7a4a" }}>{v(data, "heroEyebrow")}</p>
            <h1 className="tpl-display tpl-rise-2 mt-4 text-5xl font-bold leading-[0.95] md:text-7xl">{v(data, "heroTitle")}</h1>
            <p className="tpl-rise-3 mt-6 text-lg leading-8" style={{ color: "#7a7260" }}>{v(data, "heroSubtitle")}</p>
            <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#5c7a4a", color: "#f7f1e6" }}>{v(data, "heroPrimary")}</button>
              <button type="button" onClick={() => goTo("mezze")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(44,42,34,0.12)" }}>{v(data, "heroSecondary")}</button>
            </div>
          </div>
        </div>
      </section>
  );
}


function MezzePlatterRail({ data }: { data: Record<string, any> }) {
  const dishes = [1, 2, 3, 4].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="tpl-platter-rail mt-10">
          {dishes.map(([title, meta, text, img], i) => (
            <Reveal key={title} delayMs={i * 80} variant="left">
              <article className="overflow-hidden border" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#f7f1e6" }}>
                <img src={img} alt="" className="aspect-[5/4] w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs" style={{ color: "#5c7a4a" }}>{meta}</p>
                  <h3 className="tpl-display mt-1 text-xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6" style={{ color: "#7a7260" }}>{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MezzeProcessSteps({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "process1Title"), v(data, "process1Text")], [v(data, "process2Title"), v(data, "process2Text")], [v(data, "process3Title"), v(data, "process3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-center text-3xl font-bold md:text-4xl">{v(data, "processTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 90} variant="up">
              <div className="border-t-2 pt-4" style={{ borderColor: "#5c7a4a" }}>
                <div className="text-xs font-bold tracking-[0.2em]" style={{ color: "#5c7a4a" }}>0{i + 1}</div>
                <h3 className="tpl-display mt-2 text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "#7a7260" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MezzeHomeGallery({ data }: { data: Record<string, any> }) {
  const imgs = [v(data, "galleryImage1"), v(data, "galleryImage2"), v(data, "galleryImage3"), v(data, "galleryImage4")];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
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

function MezzeHomeReviews({ data }: { data: Record<string, any> }) {
  const revs = [1, 2, 3].map((i) => [v(data, `review${i}Text`), v(data, `review${i}Name`), v(data, `review${i}Role`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold">{v(data, "reviewsTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {revs.map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i * 80} variant="up">
              <blockquote className="border p-5" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
                <p className="text-sm leading-7" style={{ color: "#7a7260" }}>״{text}״</p>
                <footer className="mt-4 text-sm font-bold">{name} <span className="font-normal" style={{ color: "#7a7260" }}>· {role}</span></footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MezzeHomeStats({ data }: { data: Record<string, any> }) {
  const stats = [[v(data, "stat1"), v(data, "stat1Label")], [v(data, "stat2"), v(data, "stat2Label")], [v(data, "stat3"), v(data, "stat3Label")]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="grid grid-cols-3 gap-4 text-center">
          {stats.map(([n, l], i) => (
            <Reveal key={l} delayMs={i * 70} variant="scale">
              <div className=" border px-4 py-3" style={{ borderColor: "#5c7a4a", animationDelay: `${i * 0.3}s` }}>
                <div className="tpl-display text-3xl font-bold" style={{ color: "#5c7a4a" }}>{n}</div>
                <p className="mt-1 text-xs" style={{ color: "#7a7260" }}>{l}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="text-sm" style={{ color: "#7a7260" }}>{v(data, "hours")}</p>
      </div>
    </section>
  );
}

function MezzeHomeCtaTeaser({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <Reveal>
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border p-8 md:flex-row md:items-center" style={{ borderColor: "#5c7a4a", background: "#fffdf8" }}>
          <div>
            <h2 className="tpl-display text-3xl font-bold md:text-4xl">{v(data, "ctaBandTitle")}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: "#7a7260" }}>{v(data, "ctaBandText")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="px-6 py-3 text-sm font-bold" style={{ background: "#5c7a4a", color: "#5c7a4aText" }}>{v(data, "cta")}</button>
            <button type="button" onClick={() => goTo("about")} className="border px-6 py-3 text-sm font-semibold" style={{ borderColor: "rgba(44,42,34,0.12)" }}>{v(data, "navAbout")}</button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}


function MezzeSpecialtyBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative overflow-hidden border-b px-5 py-20 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <img src={v(data, "item4Image")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #f7f1e6, transparent)" }} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#5c7a4a" }}>{v(data, "brandName")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-7xl">{v(data, "page1Title")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#7a7260" }}>{v(data, "page1Subtitle")}</p>
      </div>
    </section>
  );
}

function MezzeFullMenuBoard({ data }: { data: Record<string, any> }) {
  const items = [1, 2, 3, 4, 5, 6].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto max-w-4xl space-y-6">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "menuListTitle")}</h2></Reveal>
        {items.map(([title, meta, text, img], i) => (
          <Reveal key={title} delayMs={i * 60} variant="right">
            <article className="grid gap-4 border-b pb-6 md:grid-cols-[100px_1fr_auto]" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
              <img src={img} alt="" className="aspect-square w-full object-cover" />
              <div>
                <h3 className="tpl-display text-2xl font-bold">{title}</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "#7a7260" }}>{text}</p>
              </div>
              <p className="text-sm font-bold" style={{ color: "#5c7a4a" }}>{meta}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function MezzeCategoryGrid({ data }: { data: Record<string, any> }) {
  const cats = [[v(data, "cat1Title"), v(data, "cat1Text")], [v(data, "cat2Title"), v(data, "cat2Text")], [v(data, "cat3Title"), v(data, "cat3Text")], [v(data, "cat4Title"), v(data, "cat4Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
        {cats.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 70} variant="up">
            <div className="border p-5" style={{ borderColor: "rgba(44,42,34,0.12)", background: i % 2 ? "#fffdf8" : "#f7f1e6" }}>
              <h3 className="tpl-display text-xl font-bold" style={{ color: "#5c7a4a" }}>{t}</h3>
              <p className="mt-2 text-sm" style={{ color: "#7a7260" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function MezzePairingNotes({ data }: { data: Record<string, any> }) {
  const pairs = [[v(data, "pair1Title"), v(data, "pair1Text")], [v(data, "pair2Title"), v(data, "pair2Text")], [v(data, "pair3Title"), v(data, "pair3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "pairingTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pairs.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 80} variant="up">
              <div className="border-r pr-4" style={{ borderColor: "#5c7a4a" }}>
                <h3 className="font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "#7a7260" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MezzeChefPicks({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#5c7a4a" }}>{v(data, "chefPickEyebrow")}</p>
          <h2 className="tpl-display mt-3 text-3xl font-bold">{v(data, "chefPickTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#7a7260" }}>{v(data, "chefPickText")}</p>
        </div>
        <img src={v(data, "item5Image")} alt="" className="aspect-[4/3] w-full object-cover" />
      </div>
    </section>
  );
}


function MezzeStoryBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative min-h-[42vh] overflow-hidden">
      <img src={v(data, "item6Image")} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.55), #f7f1e6)" }} />
      <div className="relative z-10 mx-auto flex min-h-[42vh] max-w-7xl items-end px-5 pb-12 lg:px-8">
        <div>
          <p className="text-xs tracking-[0.28em]" style={{ color: "#5c7a4a" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-3 text-5xl font-bold md:text-6xl">{v(data, "page2Title")}</h1>
          <p className="mt-3 max-w-xl text-lg" style={{ color: "#7a7260" }}>{v(data, "page2Subtitle")}</p>
        </div>
      </div>
    </section>
  );
}

function MezzeTechniqueLadder({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "tech1Title"), v(data, "tech1Text")], [v(data, "tech2Title"), v(data, "tech2Text")], [v(data, "tech3Title"), v(data, "tech3Text")], [v(data, "tech4Title"), v(data, "tech4Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto max-w-3xl space-y-8">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "techTitle")}</h2></Reveal>
        {steps.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 80} variant="right">
            <div className="flex gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center text-sm font-bold" style={{ background: "#5c7a4a", color: "#5c7a4aText" }}>{i + 1}</div>
              <div>
                <h3 className="text-xl font-bold">{t}</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "#7a7260" }}>{x}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function MezzeMaterialCards({ data }: { data: Record<string, any> }) {
  const woods = [[v(data, "mat1Title"), v(data, "mat1Text")], [v(data, "mat2Title"), v(data, "mat2Text")], [v(data, "mat3Title"), v(data, "mat3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "matTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {woods.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 70} variant="up">
              <div className="border p-6 text-center" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
                <h3 className="tpl-display text-2xl font-bold" style={{ color: "#5c7a4a" }}>{t}</h3>
                <p className="mt-3 text-sm" style={{ color: "#7a7260" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MezzeEventsBand({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "galleryImage3")} alt="" className="aspect-[16/10] w-full object-cover" />
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data, "eventsTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#7a7260" }}>{v(data, "eventsText")}</p>
          <p className="mt-4 text-sm font-semibold" style={{ color: "#5c7a4a" }}>{v(data, "eventsMeta")}</p>
        </div>
      </div>
    </section>
  );
}


function MezzeAboutBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-20 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#5c7a4a" }}>{v(data, "aboutEyebrow")}</p>
        <h1 className="tpl-display mt-4 max-w-3xl text-5xl font-bold md:text-6xl">{v(data, "aboutPageTitle")}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: "#7a7260" }}>{v(data, "aboutPageLead")}</p>
      </div>
    </section>
  );
}

function MezzeAboutTimeline({ data }: { data: Record<string, any> }) {
  const pts = [[v(data, "timeline1Year"), v(data, "timeline1Text")], [v(data, "timeline2Year"), v(data, "timeline2Text")], [v(data, "timeline3Year"), v(data, "timeline3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "timelineTitle")}</h2></Reveal>
        <div className="relative mt-10">
          <div className="absolute right-2 top-0 bottom-0 w-px" style={{ background: "rgba(44,42,34,0.12)" }} />
          {pts.map(([y, t], i) => (
            <Reveal key={y} delayMs={i * 90} variant="right">
              <div className="relative pb-10 pr-10">
                <div className="absolute right-0.5 top-1 h-3 w-3 rounded-full" style={{ background: "#5c7a4a" }} />
                <p className="text-xs font-bold" style={{ color: "#5c7a4a" }}>{y}</p>
                <p className="mt-2 text-sm leading-7" style={{ color: "#7a7260" }}>{t}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MezzeChefPortrait({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "chefImage")} alt="" className="aspect-[4/5] w-full object-cover" />
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#5c7a4a" }}>{v(data, "chefLabel")}</p>
          <h2 className="tpl-display mt-3 text-4xl font-bold">{v(data, "chefName")}</h2>
          <p className="mt-5 text-lg leading-8" style={{ color: "#7a7260" }}>{v(data, "chefBio")}</p>
          <blockquote className="mt-6 border-r-2 pr-4 text-xl font-semibold" style={{ borderColor: "#5c7a4a" }}>״{v(data, "chefQuote")}״</blockquote>
        </div>
      </div>
    </section>
  );
}

function MezzeValuesRow({ data }: { data: Record<string, any> }) {
  const vals = [[v(data, "value1Title"), v(data, "value1Text")], [v(data, "value2Title"), v(data, "value2Text")], [v(data, "value3Title"), v(data, "value3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {vals.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 80} variant="up">
            <div>
              <h3 className="tpl-display text-2xl font-bold" style={{ color: "#5c7a4a" }}>{t}</h3>
              <p className="mt-3 text-sm leading-7" style={{ color: "#7a7260" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function MezzeContactBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#5c7a4a" }}>{v(data, "contactEyebrow")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(data, "contactPageTitle")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#7a7260" }}>{v(data, "contactPageText")}</p>
      </div>
    </section>
  );
}

function MezzeReserveForm({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data, "contactTitle")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#7a7260" }}>{v(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm" style={{ color: "#7a7260" }}>
            <p>{v(data, "phone")}</p><p>{v(data, "email")}</p><p>{v(data, "address")}</p>
          </div>
        </div>
        <form className="grid gap-3 border p-6" style={{ borderColor: "#5c7a4a" }} onSubmit={(e) => e.preventDefault()}>
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(44,42,34,0.12)", color: "#2c2a22" }} placeholder="שם מלא" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(44,42,34,0.12)", color: "#2c2a22" }} placeholder="טלפון" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(44,42,34,0.12)", color: "#2c2a22" }} placeholder="תאריך" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(44,42,34,0.12)", color: "#2c2a22" }} placeholder="מספר סועדים" />
          <button type="button" onClick={onCta} className="px-6 py-4 text-sm font-bold" style={{ background: "#5c7a4a", color: "#5c7a4aText" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function MezzeHoursMap({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        <div className="border p-6" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
          <h3 className="tpl-display text-2xl font-bold">{v(data, "hoursTitle")}</h3>
          <p className="mt-4 text-sm leading-7" style={{ color: "#7a7260" }}>{v(data, "hours")}</p>
          <p className="mt-4 text-sm">{v(data, "address")}</p>
        </div>
        <div className="relative min-h-[220px] overflow-hidden border" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
          <img src={v(data, "galleryImage1")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border px-4 py-2 text-xs font-bold tracking-wider" style={{ borderColor: "#5c7a4a", background: "#f7f1e6", color: "#5c7a4a" }}>{v(data, "mapLabel")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function MezzeFaqBlock({ data }: { data: Record<string, any> }) {
  const faqs = [[v(data, "faq1Q"), v(data, "faq1A")], [v(data, "faq2Q"), v(data, "faq2A")], [v(data, "faq3Q"), v(data, "faq3A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto max-w-3xl space-y-4">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "faqTitle")}</h2></Reveal>
        {faqs.map(([q, a], i) => (
          <Reveal key={q} delayMs={i * 70} variant="up">
            <details className="border p-4" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
              <summary className="cursor-pointer font-bold">{q}</summary>
              <p className="mt-3 text-sm leading-7" style={{ color: "#7a7260" }}>{a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-10 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto grid max-w-7xl gap-4 text-sm md:grid-cols-3 md:items-center" style={{ color: "#7a7260" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#2c2a22" }}>{v(data, "brandName")}</span>
        <span className="text-center">מזטה · שמן זית · שולחן משותף</span>
        <span className="md:text-left">{v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <MezzePlatterRail data={data} />
      <MezzeProcessSteps data={data} />
      <MezzeHomeGallery data={data} />
      <MezzeHomeReviews data={data} />
      <MezzeHomeStats data={data} />
      <MezzeHomeCtaTeaser data={data} goTo={goTo} />
      <Footer data={data} />
    </>
  );
}

function MezzePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <MezzeSpecialtyBanner data={data} />
      <MezzeFullMenuBoard data={data} />
      <MezzeCategoryGrid data={data} />
      <MezzePairingNotes data={data} />
      <MezzeChefPicks data={data} />
      <Footer data={data} />
    </>
  );
}

function TablePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <MezzeStoryBanner data={data} />
      <MezzeTechniqueLadder data={data} />
      <MezzeMaterialCards data={data} />
      <MezzeEventsBand data={data} />
      <Footer data={data} />
    </>
  );
}

function AboutPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <MezzeAboutBanner data={data} />
      <MezzeAboutTimeline data={data} />
      <MezzeChefPortrait data={data} />
      <MezzeValuesRow data={data} />
      <Footer data={data} />
    </>
  );
}

function ContactPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <MezzeContactBanner data={data} />
      <MezzeReserveForm data={data} onCta={onCta} />
      <MezzeHoursMap data={data} />
      <MezzeFaqBlock data={data} />
      <Footer data={data} />
    </>
  );
}

export default function MezzalinePages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...mezzalineDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    mezze: <MezzePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    table: <TablePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    about: <AboutPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: <ContactPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "mezzaline-preview" : "mezzaline"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#f7f1e6", color: "#2c2a22" }}>
      <style dangerouslySetInnerHTML={{ __html: mezzalineEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
