import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { noodlixDefaultData } from "./defaultData";
import { noodlixEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const noodlixPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "bowls", label: "קערות", slug: "/bowls" },
  { id: "broth", label: "ציר", slug: "/broth" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = noodlixPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (noodlixDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = noodlixPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border px-5 py-3 shadow-lg"
        style={{ background: "#18201cdd", borderColor: "rgba(238,246,241,0.12)", backdropFilter: "blur(16px)" }}>
        <button type="button" onClick={() => goTo("home")} className="tpl-display text-lg font-bold">{v(data, "brandName")}</button>
        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "#3dd6c6" : "#8aa89a" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="rounded-full px-4 py-2 text-xs font-bold" style={{ background: "#3dd6c6", color: "#0a1210" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative isolate flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-5 pt-28" style={{ background: "radial-gradient(ellipse at 50% 60%, #18201c, #0f1412)" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="tpl-steam pointer-events-none absolute rounded-full blur-md" style={{ left: `${35 + (i % 5) * 6}%`, bottom: "38%", width: `${20 + i * 4}px`, height: `${40 + i * 8}px`, background: "rgba(238,246,241,.18)", animationDelay: `${i * 0.5}s`, ["--steam-dur" as string]: `${5 + (i % 4)}s` }} />
        ))}
        <div className="tpl-bowl-float relative z-10 mb-8 h-40 w-40 overflow-hidden rounded-full border-4 md:h-52 md:w-52" style={{ borderColor: "#3dd6c6" }}>
          <img src={v(data, "heroImage")} alt="" className="h-full w-full object-cover" />
        </div>
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#3dd6c6" }}>{v(data, "heroEyebrow")}</p>
        <h1 className="tpl-display tpl-rise-2 mt-4 max-w-3xl text-center text-5xl font-bold leading-[0.95] md:text-7xl">{v(data, "heroTitle")}</h1>
        <p className="tpl-rise-3 mt-6 max-w-lg text-center text-lg leading-8" style={{ color: "#8aa89a" }}>{v(data, "heroSubtitle")}</p>
        <div className="tpl-rise-3 mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={onCta} className="rounded-full px-7 py-3.5 text-sm font-bold" style={{ background: "#3dd6c6", color: "#0a1210" }}>{v(data, "heroPrimary")}</button>
          <button type="button" onClick={() => goTo("bowls")} className="rounded-full border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(238,246,241,0.12)" }}>{v(data, "heroSecondary")}</button>
        </div>
      </section>
  );
}


function SteamRadialDishes({ data }: { data: Record<string, any> }) {
  const cards = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto max-w-7xl text-center">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="relative mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-8">
          <div className="tpl-radial-orbit pointer-events-none absolute inset-0 rounded-full border border-dashed opacity-30" style={{ borderColor: "#3dd6c6" }} />
          {cards.map(([title, meta, text, img], i) => (
            <Reveal key={title} delayMs={i * 100} variant="scale">
              <article className="w-40 text-center md:w-48">
                <div className="mx-auto aspect-square overflow-hidden rounded-full border-2" style={{ borderColor: "#3dd6c6" }}><img src={img} alt="" className="h-full w-full object-cover" /></div>
                <p className="mt-3 text-xs" style={{ color: "#3dd6c6" }}>{meta}</p>
                <h3 className="tpl-display mt-1 text-lg font-bold">{title}</h3>
                <p className="mt-1 text-xs leading-5" style={{ color: "#8aa89a" }}>{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SteamProcessSteps({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "process1Title"), v(data, "process1Text")], [v(data, "process2Title"), v(data, "process2Text")], [v(data, "process3Title"), v(data, "process3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-center text-3xl font-bold md:text-4xl">{v(data, "processTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 90} variant="up">
              <div className="border-t-2 pt-4" style={{ borderColor: "#3dd6c6" }}>
                <div className="text-xs font-bold tracking-[0.2em]" style={{ color: "#3dd6c6" }}>0{i + 1}</div>
                <h3 className="tpl-display mt-2 text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "#8aa89a" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SteamHomeGallery({ data }: { data: Record<string, any> }) {
  const imgs = [v(data, "galleryImage1"), v(data, "galleryImage2"), v(data, "galleryImage3"), v(data, "galleryImage4")];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-7xl text-center">
        <Reveal><h2 className="tpl-display text-4xl font-bold">{v(data, "galleryTitle")}</h2></Reveal>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {imgs.map((src, i) => (
            <Reveal key={i} delayMs={i * 70} variant="scale">
              <img src={src} alt="" className="h-36 w-36 rounded-full object-cover border-2" style={{ borderColor: "#3dd6c6" }} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SteamHomeReviews({ data }: { data: Record<string, any> }) {
  const revs = [1, 2, 3].map((i) => [v(data, `review${i}Text`), v(data, `review${i}Name`), v(data, `review${i}Role`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold">{v(data, "reviewsTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {revs.map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i * 80} variant="up">
              <blockquote className="border p-5" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
                <p className="text-sm leading-7" style={{ color: "#8aa89a" }}>״{text}״</p>
                <footer className="mt-4 text-sm font-bold">{name} <span className="font-normal" style={{ color: "#8aa89a" }}>· {role}</span></footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SteamHomeStats({ data }: { data: Record<string, any> }) {
  const stats = [[v(data, "stat1"), v(data, "stat1Label")], [v(data, "stat2"), v(data, "stat2Label")], [v(data, "stat3"), v(data, "stat3Label")]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="grid grid-cols-3 gap-4 text-center">
          {stats.map(([n, l], i) => (
            <Reveal key={l} delayMs={i * 70} variant="scale">
              <div className=" border px-4 py-3" style={{ borderColor: "#3dd6c6", animationDelay: `${i * 0.3}s` }}>
                <div className="tpl-display text-3xl font-bold" style={{ color: "#3dd6c6" }}>{n}</div>
                <p className="mt-1 text-xs" style={{ color: "#8aa89a" }}>{l}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="text-sm" style={{ color: "#8aa89a" }}>{v(data, "hours")}</p>
      </div>
    </section>
  );
}

function SteamHomeCtaTeaser({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <Reveal>
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border p-8 md:flex-row md:items-center" style={{ borderColor: "#3dd6c6", background: "#18201c" }}>
          <div>
            <h2 className="tpl-display text-3xl font-bold md:text-4xl">{v(data, "ctaBandTitle")}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: "#8aa89a" }}>{v(data, "ctaBandText")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="px-6 py-3 text-sm font-bold" style={{ background: "#3dd6c6", color: "#3dd6c6Text" }}>{v(data, "cta")}</button>
            <button type="button" onClick={() => goTo("about")} className="border px-6 py-3 text-sm font-semibold" style={{ borderColor: "rgba(238,246,241,0.12)" }}>{v(data, "navAbout")}</button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}


function SteamSpecialtyBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative overflow-hidden border-b px-5 py-20 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <img src={v(data, "item4Image")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #0f1412, transparent)" }} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#3dd6c6" }}>{v(data, "brandName")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-7xl">{v(data, "page1Title")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#8aa89a" }}>{v(data, "page1Subtitle")}</p>
      </div>
    </section>
  );
}

function SteamFullMenuBoard({ data }: { data: Record<string, any> }) {
  const items = [1, 2, 3, 4, 5, 6].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-4xl space-y-6">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "menuListTitle")}</h2></Reveal>
        {items.map(([title, meta, text, img], i) => (
          <Reveal key={title} delayMs={i * 60} variant="right">
            <article className="grid gap-4 border-b pb-6 md:grid-cols-[100px_1fr_auto]" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
              <img src={img} alt="" className="aspect-square w-full object-cover" />
              <div>
                <h3 className="tpl-display text-2xl font-bold">{title}</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "#8aa89a" }}>{text}</p>
              </div>
              <p className="text-sm font-bold" style={{ color: "#3dd6c6" }}>{meta}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SteamCategoryGrid({ data }: { data: Record<string, any> }) {
  const cats = [[v(data, "cat1Title"), v(data, "cat1Text")], [v(data, "cat2Title"), v(data, "cat2Text")], [v(data, "cat3Title"), v(data, "cat3Text")], [v(data, "cat4Title"), v(data, "cat4Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
        {cats.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 70} variant="up">
            <div className="border p-5" style={{ borderColor: "rgba(238,246,241,0.12)", background: i % 2 ? "#18201c" : "#0f1412" }}>
              <h3 className="tpl-display text-xl font-bold" style={{ color: "#3dd6c6" }}>{t}</h3>
              <p className="mt-2 text-sm" style={{ color: "#8aa89a" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SteamPairingNotes({ data }: { data: Record<string, any> }) {
  const pairs = [[v(data, "pair1Title"), v(data, "pair1Text")], [v(data, "pair2Title"), v(data, "pair2Text")], [v(data, "pair3Title"), v(data, "pair3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "pairingTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pairs.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 80} variant="up">
              <div className="border-r pr-4" style={{ borderColor: "#3dd6c6" }}>
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

function SteamChefPicks({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#3dd6c6" }}>{v(data, "chefPickEyebrow")}</p>
          <h2 className="tpl-display mt-3 text-3xl font-bold">{v(data, "chefPickTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#8aa89a" }}>{v(data, "chefPickText")}</p>
        </div>
        <img src={v(data, "item5Image")} alt="" className="aspect-[4/3] w-full object-cover" />
      </div>
    </section>
  );
}


function SteamStoryBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative min-h-[42vh] overflow-hidden">
      <img src={v(data, "item6Image")} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.55), #0f1412)" }} />
      <div className="relative z-10 mx-auto flex min-h-[42vh] max-w-7xl items-end px-5 pb-12 lg:px-8">
        <div>
          <p className="text-xs tracking-[0.28em]" style={{ color: "#3dd6c6" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-3 text-5xl font-bold md:text-6xl">{v(data, "page2Title")}</h1>
          <p className="mt-3 max-w-xl text-lg" style={{ color: "#8aa89a" }}>{v(data, "page2Subtitle")}</p>
        </div>
      </div>
    </section>
  );
}

function SteamTechniqueLadder({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "tech1Title"), v(data, "tech1Text")], [v(data, "tech2Title"), v(data, "tech2Text")], [v(data, "tech3Title"), v(data, "tech3Text")], [v(data, "tech4Title"), v(data, "tech4Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-3xl space-y-8">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "techTitle")}</h2></Reveal>
        {steps.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 80} variant="right">
            <div className="flex gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center text-sm font-bold" style={{ background: "#3dd6c6", color: "#3dd6c6Text" }}>{i + 1}</div>
              <div>
                <h3 className="text-xl font-bold">{t}</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "#8aa89a" }}>{x}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SteamMaterialCards({ data }: { data: Record<string, any> }) {
  const woods = [[v(data, "mat1Title"), v(data, "mat1Text")], [v(data, "mat2Title"), v(data, "mat2Text")], [v(data, "mat3Title"), v(data, "mat3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "matTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {woods.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 70} variant="up">
              <div className="border p-6 text-center" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
                <h3 className="tpl-display text-2xl font-bold" style={{ color: "#3dd6c6" }}>{t}</h3>
                <p className="mt-3 text-sm" style={{ color: "#8aa89a" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SteamEventsBand({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "galleryImage3")} alt="" className="aspect-[16/10] w-full object-cover" />
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data, "eventsTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#8aa89a" }}>{v(data, "eventsText")}</p>
          <p className="mt-4 text-sm font-semibold" style={{ color: "#3dd6c6" }}>{v(data, "eventsMeta")}</p>
        </div>
      </div>
    </section>
  );
}


function SteamAboutBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-20 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#3dd6c6" }}>{v(data, "aboutEyebrow")}</p>
        <h1 className="tpl-display mt-4 max-w-3xl text-5xl font-bold md:text-6xl">{v(data, "aboutPageTitle")}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: "#8aa89a" }}>{v(data, "aboutPageLead")}</p>
      </div>
    </section>
  );
}

function SteamAboutTimeline({ data }: { data: Record<string, any> }) {
  const pts = [[v(data, "timeline1Year"), v(data, "timeline1Text")], [v(data, "timeline2Year"), v(data, "timeline2Text")], [v(data, "timeline3Year"), v(data, "timeline3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "timelineTitle")}</h2></Reveal>
        <div className="relative mt-10">
          <div className="absolute right-2 top-0 bottom-0 w-px" style={{ background: "rgba(238,246,241,0.12)" }} />
          {pts.map(([y, t], i) => (
            <Reveal key={y} delayMs={i * 90} variant="right">
              <div className="relative pb-10 pr-10">
                <div className="absolute right-0.5 top-1 h-3 w-3 rounded-full" style={{ background: "#3dd6c6" }} />
                <p className="text-xs font-bold" style={{ color: "#3dd6c6" }}>{y}</p>
                <p className="mt-2 text-sm leading-7" style={{ color: "#8aa89a" }}>{t}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SteamChefPortrait({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "chefImage")} alt="" className="aspect-[4/5] w-full object-cover" />
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#3dd6c6" }}>{v(data, "chefLabel")}</p>
          <h2 className="tpl-display mt-3 text-4xl font-bold">{v(data, "chefName")}</h2>
          <p className="mt-5 text-lg leading-8" style={{ color: "#8aa89a" }}>{v(data, "chefBio")}</p>
          <blockquote className="mt-6 border-r-2 pr-4 text-xl font-semibold" style={{ borderColor: "#3dd6c6" }}>״{v(data, "chefQuote")}״</blockquote>
        </div>
      </div>
    </section>
  );
}

function SteamValuesRow({ data }: { data: Record<string, any> }) {
  const vals = [[v(data, "value1Title"), v(data, "value1Text")], [v(data, "value2Title"), v(data, "value2Text")], [v(data, "value3Title"), v(data, "value3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {vals.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 80} variant="up">
            <div>
              <h3 className="tpl-display text-2xl font-bold" style={{ color: "#3dd6c6" }}>{t}</h3>
              <p className="mt-3 text-sm leading-7" style={{ color: "#8aa89a" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function SteamContactBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#3dd6c6" }}>{v(data, "contactEyebrow")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(data, "contactPageTitle")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#8aa89a" }}>{v(data, "contactPageText")}</p>
      </div>
    </section>
  );
}

function SteamReserveForm({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto flex max-w-lg flex-col items-center">
        <div className="relative flex w-full max-w-md flex-col items-center justify-center rounded-full border-4 p-10 text-center" style={{ borderColor: "#3dd6c6", background: "#18201c" }}>
          <h2 className="tpl-display text-2xl font-bold">{v(data, "contactTitle")}</h2>
          <p className="mt-2 text-xs" style={{ color: "#8aa89a" }}>{v(data, "contactText")}</p>
          <form className="mt-4 grid w-full gap-2" onSubmit={(e) => e.preventDefault()}>
            <input className="w-full rounded-full border bg-transparent px-3 py-2 text-center text-sm outline-none" style={{ borderColor: "rgba(238,246,241,0.12)" }} placeholder="שם" />
            <input className="w-full rounded-full border bg-transparent px-3 py-2 text-center text-sm outline-none" style={{ borderColor: "rgba(238,246,241,0.12)" }} placeholder="טלפון" />
            <input className="w-full rounded-full border bg-transparent px-3 py-2 text-center text-sm outline-none" style={{ borderColor: "rgba(238,246,241,0.12)" }} placeholder="תאריך" />
            <button type="button" onClick={onCta} className="rounded-full px-4 py-2 text-sm font-bold" style={{ background: "#3dd6c6", color: "#3dd6c6Text" }}>{v(data, "cta")}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

function SteamHoursMap({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        <div className="border p-6" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
          <h3 className="tpl-display text-2xl font-bold">{v(data, "hoursTitle")}</h3>
          <p className="mt-4 text-sm leading-7" style={{ color: "#8aa89a" }}>{v(data, "hours")}</p>
          <p className="mt-4 text-sm">{v(data, "address")}</p>
        </div>
        <div className="relative min-h-[220px] overflow-hidden border" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
          <img src={v(data, "galleryImage1")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border px-4 py-2 text-xs font-bold tracking-wider" style={{ borderColor: "#3dd6c6", background: "#0f1412", color: "#3dd6c6" }}>{v(data, "mapLabel")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SteamFaqBlock({ data }: { data: Record<string, any> }) {
  const faqs = [[v(data, "faq1Q"), v(data, "faq1A")], [v(data, "faq2Q"), v(data, "faq2A")], [v(data, "faq3Q"), v(data, "faq3A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-3xl space-y-4">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "faqTitle")}</h2></Reveal>
        {faqs.map(([q, a], i) => (
          <Reveal key={q} delayMs={i * 70} variant="up">
            <details className="border p-4" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
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
    <footer className="relative overflow-hidden px-5 pb-8 pt-4 lg:px-8" style={{ background: "#070a09" }}>
      <svg className="mb-4 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path fill="none" stroke="#3dd6c6" strokeWidth="2" d="M0,30 Q180,5 360,30 T720,30 T1080,30 T1440,30" />
      </svg>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm md:flex-row md:justify-between" style={{ color: "#8aa89a" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#eef6f1" }}>{v(data, "brandName")}</span>
        <span>{v(data, "address")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <SteamRadialDishes data={data} />
      <SteamProcessSteps data={data} />
      <SteamHomeGallery data={data} />
      <SteamHomeReviews data={data} />
      <SteamHomeStats data={data} />
      <SteamHomeCtaTeaser data={data} goTo={goTo} />
      <Footer data={data} />
    </>
  );
}

function BowlsPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <SteamSpecialtyBanner data={data} />
      <SteamCategoryGrid data={data} />
      <SteamFullMenuBoard data={data} />
      <SteamChefPicks data={data} />
      <SteamPairingNotes data={data} />
      <Footer data={data} />
    </>
  );
}

function BrothPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <SteamStoryBanner data={data} />
      <SteamTechniqueLadder data={data} />
      <SteamMaterialCards data={data} />
      <SteamEventsBand data={data} />
      <Footer data={data} />
    </>
  );
}

function AboutPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <SteamAboutBanner data={data} />
      <SteamAboutTimeline data={data} />
      <SteamChefPortrait data={data} />
      <SteamValuesRow data={data} />
      <Footer data={data} />
    </>
  );
}

function ContactPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <SteamContactBanner data={data} />
      <SteamReserveForm data={data} onCta={onCta} />
      <SteamHoursMap data={data} />
      <SteamFaqBlock data={data} />
      <Footer data={data} />
    </>
  );
}

export default function NoodlixPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...noodlixDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    bowls: <BowlsPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    broth: <BrothPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    about: <AboutPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: <ContactPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "noodlix-preview" : "noodlix"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#0f1412", color: "#eef6f1" }}>
      <style dangerouslySetInnerHTML={{ __html: noodlixEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
