import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { spiceforgeDefaultData } from "./defaultData";
import { spiceforgeEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const spiceforgePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "thali", label: "תאלי", slug: "/thali" },
  { id: "spices", label: "תבלינים", slug: "/spices" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = spiceforgePages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (spiceforgeDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = spiceforgePages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 px-4 pt-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 border-2 px-5 py-3 lg:px-8"
        style={{ background: "#2a1810", borderColor: "#e76f51", borderImage: "none" }}>
        <button type="button" onClick={() => goTo("home")} className="tpl-display text-xl font-bold">{v(data, "brandName")}</button>
        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="border-b-2 text-sm font-semibold"
              style={{ borderColor: currentPage === id ? "#e76f51" : "transparent", color: "#fff1e0" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={onCta} className="px-5 py-2 text-sm font-bold" style={{ background: "#e76f51", color: "#1a0f0a" }}>{v(data, "heroPrimary")}</button>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <img src={v(data, "heroImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0e080599, #1a0f0af0)" }} />
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="tpl-spice pointer-events-none absolute h-2 w-2 rounded-sm" style={{ left: `${3 + i * 6}%`, top: `-2%`, background: ["#e76f51", "#e9c46a", "#f4a261", "#9b2226"][i % 4], animationDelay: `${i * 0.4}s`, ["--spice-dur" as string]: `${7 + (i % 5)}s` }} />
        ))}
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pt-28 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#e76f51" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-5xl font-bold leading-[0.95] md:text-7xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#c4a08a" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#e76f51", color: "#1a0f0a" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("thali")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(255,241,224,0.14)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </section>
  );
}


function SpiceWheelMenu({ data }: { data: Record<string, any> }) {
  const cards = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(255,241,224,0.14)", background: "#2a1810" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[280px_1fr]">
          <div className="tpl-spice-wheel mx-auto h-56 w-56 rounded-full border-4 p-8" style={{ borderColor: "#1a0f0a" }}>
            <div className="flex h-full w-full items-center justify-center rounded-full text-center text-sm font-bold" style={{ background: "#1a0f0a" }}>THALI</div>
          </div>
          <div className="grid gap-4">
            {cards.map(([title, meta, text], i) => (
              <Reveal key={title} delayMs={i * 90} variant="right">
                <div className="border-r-4 pr-4" style={{ borderColor: "#e76f51" }}>
                  <p className="text-xs" style={{ color: "#e76f51" }}>{meta}</p>
                  <h3 className="tpl-display mt-1 text-2xl font-bold">{title}</h3>
                  <p className="mt-1 text-sm" style={{ color: "#c4a08a" }}>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SpiceProcessSteps({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "process1Title"), v(data, "process1Text")], [v(data, "process2Title"), v(data, "process2Text")], [v(data, "process3Title"), v(data, "process3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-center text-3xl font-bold md:text-4xl">{v(data, "processTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 90} variant="up">
              <div className="border-t-2 pt-4" style={{ borderColor: "#e76f51" }}>
                <div className="text-xs font-bold tracking-[0.2em]" style={{ color: "#e76f51" }}>0{i + 1}</div>
                <h3 className="tpl-display mt-2 text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "#c4a08a" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpiceHomeGallery({ data }: { data: Record<string, any> }) {
  const imgs = [v(data, "galleryImage1"), v(data, "galleryImage2"), v(data, "galleryImage3"), v(data, "galleryImage4")];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)", background: "#2a1810" }}>
      <div className="mx-auto max-w-7xl text-center">
        <Reveal><h2 className="tpl-display text-4xl font-bold">{v(data, "galleryTitle")}</h2></Reveal>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {imgs.map((src, i) => (
            <Reveal key={i} delayMs={i * 70} variant="scale">
              <img src={src} alt="" className="h-36 w-36 rounded-full object-cover border-2" style={{ borderColor: "#e76f51" }} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpiceHomeReviews({ data }: { data: Record<string, any> }) {
  const revs = [1, 2, 3].map((i) => [v(data, `review${i}Text`), v(data, `review${i}Name`), v(data, `review${i}Role`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold">{v(data, "reviewsTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {revs.map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i * 80} variant="up">
              <blockquote className="border p-5" style={{ borderColor: "rgba(255,241,224,0.14)", background: "#2a1810" }}>
                <p className="text-sm leading-7" style={{ color: "#c4a08a" }}>״{text}״</p>
                <footer className="mt-4 text-sm font-bold">{name} <span className="font-normal" style={{ color: "#c4a08a" }}>· {role}</span></footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpiceHomeStats({ data }: { data: Record<string, any> }) {
  const stats = [[v(data, "stat1"), v(data, "stat1Label")], [v(data, "stat2"), v(data, "stat2Label")], [v(data, "stat3"), v(data, "stat3Label")]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)", background: "#2a1810" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="grid grid-cols-3 gap-4 text-center">
          {stats.map(([n, l], i) => (
            <Reveal key={l} delayMs={i * 70} variant="scale">
              <div className=" border px-4 py-3" style={{ borderColor: "#e76f51", animationDelay: `${i * 0.3}s` }}>
                <div className="tpl-display text-3xl font-bold" style={{ color: "#e76f51" }}>{n}</div>
                <p className="mt-1 text-xs" style={{ color: "#c4a08a" }}>{l}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="text-sm" style={{ color: "#c4a08a" }}>{v(data, "hours")}</p>
      </div>
    </section>
  );
}

function SpiceHomeCtaTeaser({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <Reveal>
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border p-8 md:flex-row md:items-center" style={{ borderColor: "#e76f51", background: "#2a1810" }}>
          <div>
            <h2 className="tpl-display text-3xl font-bold md:text-4xl">{v(data, "ctaBandTitle")}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: "#c4a08a" }}>{v(data, "ctaBandText")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="px-6 py-3 text-sm font-bold" style={{ background: "#e76f51", color: "#e76f51Text" }}>{v(data, "cta")}</button>
            <button type="button" onClick={() => goTo("about")} className="border px-6 py-3 text-sm font-semibold" style={{ borderColor: "rgba(255,241,224,0.14)" }}>{v(data, "navAbout")}</button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}


function SpiceSpecialtyBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative overflow-hidden border-b px-5 py-20 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <img src={v(data, "item4Image")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #1a0f0a, transparent)" }} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "#e76f51" }}>{v(data, "brandName")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-7xl">{v(data, "page1Title")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#c4a08a" }}>{v(data, "page1Subtitle")}</p>
      </div>
    </section>
  );
}

function SpiceFullMenuBoard({ data }: { data: Record<string, any> }) {
  const items = [1, 2, 3, 4, 5, 6].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)", background: "#2a1810" }}>
      <div className="mx-auto max-w-4xl space-y-6">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "menuListTitle")}</h2></Reveal>
        {items.map(([title, meta, text, img], i) => (
          <Reveal key={title} delayMs={i * 60} variant="right">
            <article className="grid gap-4 border-b pb-6 md:grid-cols-[100px_1fr_auto]" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
              <img src={img} alt="" className="aspect-square w-full object-cover" />
              <div>
                <h3 className="tpl-display text-2xl font-bold">{title}</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "#c4a08a" }}>{text}</p>
              </div>
              <p className="text-sm font-bold" style={{ color: "#e76f51" }}>{meta}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SpiceCategoryGrid({ data }: { data: Record<string, any> }) {
  const cats = [[v(data, "cat1Title"), v(data, "cat1Text")], [v(data, "cat2Title"), v(data, "cat2Text")], [v(data, "cat3Title"), v(data, "cat3Text")], [v(data, "cat4Title"), v(data, "cat4Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
        {cats.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 70} variant="up">
            <div className="border p-5" style={{ borderColor: "rgba(255,241,224,0.14)", background: i % 2 ? "#2a1810" : "#1a0f0a" }}>
              <h3 className="tpl-display text-xl font-bold" style={{ color: "#e76f51" }}>{t}</h3>
              <p className="mt-2 text-sm" style={{ color: "#c4a08a" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SpicePairingNotes({ data }: { data: Record<string, any> }) {
  const pairs = [[v(data, "pair1Title"), v(data, "pair1Text")], [v(data, "pair2Title"), v(data, "pair2Text")], [v(data, "pair3Title"), v(data, "pair3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)", background: "#2a1810" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "pairingTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pairs.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 80} variant="up">
              <div className="border-r pr-4" style={{ borderColor: "#e76f51" }}>
                <h3 className="font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "#c4a08a" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpiceChefPicks({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#e76f51" }}>{v(data, "chefPickEyebrow")}</p>
          <h2 className="tpl-display mt-3 text-3xl font-bold">{v(data, "chefPickTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#c4a08a" }}>{v(data, "chefPickText")}</p>
        </div>
        <img src={v(data, "item5Image")} alt="" className="aspect-[4/3] w-full object-cover" />
      </div>
    </section>
  );
}


function SpiceStoryBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="relative min-h-[42vh] overflow-hidden">
      <img src={v(data, "item6Image")} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.55), #1a0f0a)" }} />
      <div className="relative z-10 mx-auto flex min-h-[42vh] max-w-7xl items-end px-5 pb-12 lg:px-8">
        <div>
          <p className="text-xs tracking-[0.28em]" style={{ color: "#e76f51" }}>{v(data, "brandName")}</p>
          <h1 className="tpl-display mt-3 text-5xl font-bold md:text-6xl">{v(data, "page2Title")}</h1>
          <p className="mt-3 max-w-xl text-lg" style={{ color: "#c4a08a" }}>{v(data, "page2Subtitle")}</p>
        </div>
      </div>
    </section>
  );
}

function SpiceTechniqueLadder({ data }: { data: Record<string, any> }) {
  const steps = [[v(data, "tech1Title"), v(data, "tech1Text")], [v(data, "tech2Title"), v(data, "tech2Text")], [v(data, "tech3Title"), v(data, "tech3Text")], [v(data, "tech4Title"), v(data, "tech4Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)", background: "#2a1810" }}>
      <div className="mx-auto max-w-3xl space-y-8">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "techTitle")}</h2></Reveal>
        {steps.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 80} variant="right">
            <div className="flex gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center text-sm font-bold" style={{ background: "#e76f51", color: "#e76f51Text" }}>{i + 1}</div>
              <div>
                <h3 className="text-xl font-bold">{t}</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "#c4a08a" }}>{x}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SpiceMaterialCards({ data }: { data: Record<string, any> }) {
  const woods = [[v(data, "mat1Title"), v(data, "mat1Text")], [v(data, "mat2Title"), v(data, "mat2Text")], [v(data, "mat3Title"), v(data, "mat3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "matTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {woods.map(([t, x], i) => (
            <Reveal key={t} delayMs={i * 70} variant="up">
              <div className="border p-6 text-center" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
                <h3 className="tpl-display text-2xl font-bold" style={{ color: "#e76f51" }}>{t}</h3>
                <p className="mt-3 text-sm" style={{ color: "#c4a08a" }}>{x}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpiceEventsBand({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)", background: "#2a1810" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "galleryImage3")} alt="" className="aspect-[16/10] w-full object-cover" />
        <div>
          <h2 className="tpl-display text-3xl font-bold">{v(data, "eventsTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "#c4a08a" }}>{v(data, "eventsText")}</p>
          <p className="mt-4 text-sm font-semibold" style={{ color: "#e76f51" }}>{v(data, "eventsMeta")}</p>
        </div>
      </div>
    </section>
  );
}


function SpiceAboutBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-20 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)", background: "#2a1810" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#e76f51" }}>{v(data, "aboutEyebrow")}</p>
        <h1 className="tpl-display mt-4 max-w-3xl text-5xl font-bold md:text-6xl">{v(data, "aboutPageTitle")}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: "#c4a08a" }}>{v(data, "aboutPageLead")}</p>
      </div>
    </section>
  );
}

function SpiceAboutTimeline({ data }: { data: Record<string, any> }) {
  const pts = [[v(data, "timeline1Year"), v(data, "timeline1Text")], [v(data, "timeline2Year"), v(data, "timeline2Text")], [v(data, "timeline3Year"), v(data, "timeline3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "timelineTitle")}</h2></Reveal>
        <div className="relative mt-10">
          <div className="absolute right-2 top-0 bottom-0 w-px" style={{ background: "rgba(255,241,224,0.14)" }} />
          {pts.map(([y, t], i) => (
            <Reveal key={y} delayMs={i * 90} variant="right">
              <div className="relative pb-10 pr-10">
                <div className="absolute right-0.5 top-1 h-3 w-3 rounded-full" style={{ background: "#e76f51" }} />
                <p className="text-xs font-bold" style={{ color: "#e76f51" }}>{y}</p>
                <p className="mt-2 text-sm leading-7" style={{ color: "#c4a08a" }}>{t}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpiceChefPortrait({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)", background: "#2a1810" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <img src={v(data, "chefImage")} alt="" className="aspect-[4/5] w-full object-cover" />
        <div>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#e76f51" }}>{v(data, "chefLabel")}</p>
          <h2 className="tpl-display mt-3 text-4xl font-bold">{v(data, "chefName")}</h2>
          <p className="mt-5 text-lg leading-8" style={{ color: "#c4a08a" }}>{v(data, "chefBio")}</p>
          <blockquote className="mt-6 border-r-2 pr-4 text-xl font-semibold" style={{ borderColor: "#e76f51" }}>״{v(data, "chefQuote")}״</blockquote>
        </div>
      </div>
    </section>
  );
}

function SpiceValuesRow({ data }: { data: Record<string, any> }) {
  const vals = [[v(data, "value1Title"), v(data, "value1Text")], [v(data, "value2Title"), v(data, "value2Text")], [v(data, "value3Title"), v(data, "value3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {vals.map(([t, x], i) => (
          <Reveal key={t} delayMs={i * 80} variant="up">
            <div>
              <h3 className="tpl-display text-2xl font-bold" style={{ color: "#e76f51" }}>{t}</h3>
              <p className="mt-3 text-sm leading-7" style={{ color: "#c4a08a" }}>{x}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function SpiceContactBanner({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{ color: "#e76f51" }}>{v(data, "contactEyebrow")}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{v(data, "contactPageTitle")}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "#c4a08a" }}>{v(data, "contactPageText")}</p>
      </div>
    </section>
  );
}

function SpiceReserveForm({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <div className="mx-auto flex max-w-lg flex-col items-center">
        <div className="relative flex w-full max-w-md flex-col items-center justify-center rounded-full border-4 p-10 text-center" style={{ borderColor: "#e76f51", background: "#2a1810" }}>
          <h2 className="tpl-display text-2xl font-bold">{v(data, "contactTitle")}</h2>
          <p className="mt-2 text-xs" style={{ color: "#c4a08a" }}>{v(data, "contactText")}</p>
          <form className="mt-4 grid w-full gap-2" onSubmit={(e) => e.preventDefault()}>
            <input className="w-full rounded-full border bg-transparent px-3 py-2 text-center text-sm outline-none" style={{ borderColor: "rgba(255,241,224,0.14)" }} placeholder="שם" />
            <input className="w-full rounded-full border bg-transparent px-3 py-2 text-center text-sm outline-none" style={{ borderColor: "rgba(255,241,224,0.14)" }} placeholder="טלפון" />
            <input className="w-full rounded-full border bg-transparent px-3 py-2 text-center text-sm outline-none" style={{ borderColor: "rgba(255,241,224,0.14)" }} placeholder="תאריך" />
            <button type="button" onClick={onCta} className="rounded-full px-4 py-2 text-sm font-bold" style={{ background: "#e76f51", color: "#e76f51Text" }}>{v(data, "cta")}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

function SpiceHoursMap({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        <div className="border p-6" style={{ borderColor: "rgba(255,241,224,0.14)", background: "#2a1810" }}>
          <h3 className="tpl-display text-2xl font-bold">{v(data, "hoursTitle")}</h3>
          <p className="mt-4 text-sm leading-7" style={{ color: "#c4a08a" }}>{v(data, "hours")}</p>
          <p className="mt-4 text-sm">{v(data, "address")}</p>
        </div>
        <div className="relative min-h-[220px] overflow-hidden border" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
          <img src={v(data, "galleryImage1")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border px-4 py-2 text-xs font-bold tracking-wider" style={{ borderColor: "#e76f51", background: "#1a0f0a", color: "#e76f51" }}>{v(data, "mapLabel")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpiceFaqBlock({ data }: { data: Record<string, any> }) {
  const faqs = [[v(data, "faq1Q"), v(data, "faq1A")], [v(data, "faq2Q"), v(data, "faq2A")], [v(data, "faq3Q"), v(data, "faq3A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)", background: "#2a1810" }}>
      <div className="mx-auto max-w-3xl space-y-4">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{v(data, "faqTitle")}</h2></Reveal>
        {faqs.map(([q, a], i) => (
          <Reveal key={q} delayMs={i * 70} variant="up">
            <details className="border p-4" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
              <summary className="cursor-pointer font-bold">{q}</summary>
              <p className="mt-3 text-sm leading-7" style={{ color: "#c4a08a" }}>{a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(255,241,224,0.14)" }}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm" style={{ color: "#c4a08a" }}>
        <span className="tpl-display text-lg font-bold" style={{ color: "#fff1e0" }}>{v(data, "brandName")}</span>
        <div className="flex gap-2">{[0,1,2,3,4].map((i) => <span key={i} className="h-2 w-2 rounded-full" style={{ background: ["#e76f51", "#e9c46a", "#f4a261", "#9b2226", "#c4a08a"][i] }} />)}</div>
        <span>{v(data, "address")}</span>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <SpiceWheelMenu data={data} />
      <SpiceProcessSteps data={data} />
      <SpiceHomeGallery data={data} />
      <SpiceHomeReviews data={data} />
      <SpiceHomeStats data={data} />
      <SpiceHomeCtaTeaser data={data} goTo={goTo} />
      <Footer data={data} />
    </>
  );
}

function ThaliPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <SpiceSpecialtyBanner data={data} />
      <SpiceCategoryGrid data={data} />
      <SpiceFullMenuBoard data={data} />
      <SpiceChefPicks data={data} />
      <SpicePairingNotes data={data} />
      <Footer data={data} />
    </>
  );
}

function SpicesPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <SpiceStoryBanner data={data} />
      <SpiceTechniqueLadder data={data} />
      <SpiceMaterialCards data={data} />
      <SpiceEventsBand data={data} />
      <Footer data={data} />
    </>
  );
}

function AboutPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <SpiceAboutBanner data={data} />
      <SpiceAboutTimeline data={data} />
      <SpiceChefPortrait data={data} />
      <SpiceValuesRow data={data} />
      <Footer data={data} />
    </>
  );
}

function ContactPage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <SpiceContactBanner data={data} />
      <SpiceReserveForm data={data} onCta={onCta} />
      <SpiceHoursMap data={data} />
      <SpiceFaqBlock data={data} />
      <Footer data={data} />
    </>
  );
}

export default function SpiceforgePages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...spiceforgeDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    thali: <ThaliPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    spices: <SpicesPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    about: <AboutPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
    contact: <ContactPage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "spiceforge-preview" : "spiceforge"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#1a0f0a", color: "#fff1e0" }}>
      <style dangerouslySetInnerHTML={{ __html: spiceforgeEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
