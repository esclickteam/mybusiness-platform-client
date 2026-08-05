import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { mezzalineDefaultData } from "./defaultData";
import { mezzalineEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const mezzalinePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "menu", label: "תפריט", slug: "/menu" },
  { id: "mezze", label: "מזטה", slug: "/mezze" },
  { id: "table", label: "השולחן", slug: "/table" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "journal", label: "יומן", slug: "/journal" },
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
  const [navOpen, setNavOpen] = useState(false);
  const go = (id: string) => { setNavOpen(false); goTo(id); };
  const nav = mezzalinePages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50" style={{ background: "#f7f1e6f0" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => go("home")} className="text-right">
          <span className="tpl-display text-2xl font-bold">{v(data, "brandName")}</span>
          <span className="tpl-branch-under mt-2 block w-24" />
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => go(id)} className="relative text-sm font-semibold"
              style={{ color: currentPage === id ? "#2c2a22" : "#7a7260" }}>
              {label}
              {currentPage === id ? <span className="absolute -bottom-1 right-0 left-0 h-px" style={{ background: "#5c7a4a" }} /> : null}
            </button>
          ))}
        </nav>
        <button type="button" onClick={() => { setNavOpen(false); onCta(); }} className="rounded-sm px-5 py-2.5 text-sm font-bold" style={{ background: "#5c7a4a", color: "#f7f1e6" }}>{v(data, "heroPrimary")}</button>
        <button type="button" aria-expanded={navOpen} aria-label={navOpen ? "סגור תפריט" : "פתח תפריט"} onClick={() => setNavOpen((o) => !o)} className="inline-flex h-10 w-10 items-center justify-center border lg:hidden" style={{ borderColor: "rgba(0,0,0,0.12)" }}>
          <span className="flex w-4 flex-col gap-1"><span className={`h-0.5 bg-current transition ${navOpen ? "translate-y-1.5 rotate-45" : ""}`} /><span className={`h-0.5 bg-current transition ${navOpen ? "opacity-0" : ""}`} /><span className={`h-0.5 bg-current transition ${navOpen ? "-translate-y-1.5 -rotate-45" : ""}`} /></span>
        </button>
      </div>
      {navOpen ? (
        <nav className="border-t px-5 py-4 lg:hidden" style={{ borderColor: "rgba(0,0,0,0.08)", background: "var(--surface, #fff)" }}>
          <div className="mx-auto grid max-w-7xl gap-2">
            {nav.map(([id, label]) => (
              <button key={`m-${id}`} type="button" onClick={() => go(id)} className="rounded-xl px-4 py-3 text-right text-sm font-semibold">{label}</button>
            ))}
          </div>
        </nav>
      ) : null}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
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
              <button type="button" onClick={() => goTo("menu")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(44,42,34,0.12)" }}>{v(data, "heroSecondary")}</button>
            </div>
          </div>
        </div>
      </section>
  );
}


function PlatterScroll({ data }: { data: Record<string, any> }) {
  const dishes = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">מגש משותף</h2></Reveal>
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

function ParchmentQuote({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-y px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#f7f1e6" }}>
      <Reveal variant="fade">
        <blockquote className="mx-auto max-w-3xl text-center">
          <p className="tpl-display text-2xl font-semibold leading-relaxed md:text-3xl" style={{ color: "#2c2a22" }}>״שולחן מלא צבעים — ככה נראית אהבה ים-תיכונית.״</p>
          <footer className="mt-4 text-sm" style={{ color: "#7a7260" }}>— {v(data, "brandName")}</footer>
        </blockquote>
      </Reveal>
    </section>
  );
}


function SectionKicker({ label }: { label: string }) {
  return <p className="text-xs font-bold tracking-[0.28em]" style={{ color: "#5c7a4a" }}>{label}</p>;
}

function PageHero({ data, title, pageId }: { data: Record<string, any>; title: string; pageId: string }) {
  const image = pageId === "about" ? v(data, "aboutImage") : pageId === "gallery" ? v(data, "gallery1Image") : pageId === "journal" ? v(data, "gallery2Image") : v(data, "heroImage");
  return (
    <section className="relative isolate overflow-hidden border-b px-5 py-20 lg:px-8 lg:py-24" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <img src={image} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #f7f1e6f5, #fffdf8cc)" }} />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <SectionKicker label={v(data, "brandName")} />
          <h1 className="tpl-display mt-4 text-5xl font-bold leading-tight md:text-7xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: "#7a7260" }}>{v(data, "pageHeroText")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[v(data, "gallery1Image"), v(data, "gallery2Image"), v(data, "gallery3Image")].map((src, i) => (
            <div key={i} className="journal-card-media tpl-float relative aspect-square overflow-hidden border" style={{ borderColor: "rgba(44,42,34,0.12)", animationDelay: `${i * 0.25}s` }}>
              <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs({ data }: { data: Record<string, any> }) {
  const reasons = [1, 2, 3].map((i) => ({ title: v(data, `why${i}Title`), text: v(data, `why${i}Text`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "whyKicker")} />
        <h2 className="tpl-display mt-4 max-w-3xl text-4xl font-bold md:text-5xl">{v(data, "whyTitle")}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delayMs={i * 90} variant="up">
              <article className="tpl-sweep h-full border p-6 rounded-tl-[3rem]" style={{ borderColor: "rgba(44,42,34,0.12)", background: i % 2 ? "#f7f1e6" : "#1c1a14" }}>
                <span className="tpl-display text-2xl md:text-5xl font-bold" style={{ color: "#5c7a4a" }}>0{i + 1}</span>
                <h3 className="mt-5 text-xl font-bold">{reason.title}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: "#7a7260" }}>{reason.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MenuShowcase({ data }: { data: Record<string, any> }) {
  const dishes = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionKicker label={v(data, "menuKicker")} />
            <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "menuShowcaseTitle")}</h2>
          </div>
          <p className="max-w-md text-sm leading-7" style={{ color: "#7a7260" }}>{v(data, "menuShowcaseText")}</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {dishes.map((dish, i) => (
            <Reveal key={dish.title} delayMs={i * 100} variant="scale">
              <article className="group overflow-hidden border rounded-tl-[3rem]" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
                <img src={dish.img} alt="" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <p className="text-xs font-bold tracking-[0.18em]" style={{ color: "#5c7a4a" }}>{dish.meta}</p>
                  <h3 className="tpl-display mt-2 text-2xl font-bold">{dish.title}</h3>
                  <p className="mt-3 text-sm leading-7" style={{ color: "#7a7260" }}>{dish.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ data }: { data: Record<string, any> }) {
  const shots = [1, 2, 3, 4].map((i) => ({ src: v(data, `gallery${i}Image`), label: v(data, `gallery${i}Title`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "galleryKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "galleryTitle")}</h2>
        <div className="mt-10 grid gap-3 md:grid-cols-4">
          {shots.map((shot, i) => (
            <Reveal key={shot.label} delayMs={i * 80} variant={i % 2 ? "up" : "scale"}>
              <figure className={`relative overflow-hidden border ${i === 0 ? "md:row-span-2" : ""} rounded-tl-[3rem]`} style={{ borderColor: "rgba(44,42,34,0.12)" }}>
                <img src={shot.src} alt="" className={i === 0 ? "aspect-[4/5] h-full w-full object-cover" : "aspect-square w-full object-cover"} />
                <figcaption className="absolute inset-x-3 bottom-3 px-3 py-2 text-sm font-bold" style={{ background: "#f7f1e6dd", color: "#2c2a22" }}>{shot.label}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection({ data }: { data: Record<string, any> }) {
  const people = [1, 2, 3].map((i) => ({ name: v(data, `team${i}Name`), role: v(data, `team${i}Role`), img: v(data, `team${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionKicker label={v(data, "teamKicker")} />
            <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "teamTitle")}</h2>
            <p className="mt-5 text-sm leading-7" style={{ color: "#7a7260" }}>{v(data, "teamText")}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {people.map((person, i) => (
              <Reveal key={person.name} delayMs={i * 90} variant="up">
                <article className="border p-3 rounded-tl-[3rem]" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
                  <img src={person.img} alt="" className="aspect-[4/5] w-full object-cover" />
                  <h3 className="mt-4 text-lg font-bold">{person.name}</h3>
                  <p className="text-sm" style={{ color: "#5c7a4a" }}>{person.role}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function KitchenMethod({ data }: { data: Record<string, any> }) {
  const steps = [1, 2, 3, 4].map((i) => ({ title: v(data, `process${i}Title`), text: v(data, `process${i}Text`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#1c1a14" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "processKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "processTitle")}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delayMs={i * 80} variant="right">
              <article className="relative min-h-48 border p-5 rounded-tl-[3rem]" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
                <span className="tpl-display text-2xl md:text-5xl font-bold opacity-30" style={{ color: "#5c7a4a" }}>{i + 1}</span>
                <h3 className="mt-6 text-lg font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: "#7a7260" }}>{step.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  const reviews = [1, 2, 3].map((i) => ({ quote: v(data, `review${i}Quote`), name: v(data, `review${i}Name`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "reviewsKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "reviewsTitle")}</h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delayMs={i * 90} variant="fade">
              <blockquote className="h-full border p-6 rounded-tl-[3rem]" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
                <p className="text-lg leading-8">״{review.quote}״</p>
                <footer className="mt-5 text-sm font-bold" style={{ color: "#5c7a4a" }}>{review.name}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisitBlock({ data }: { data: Record<string, any> }) {
  const hours = [1, 2, 3].map((i) => ({ day: v(data, `hours${i}Day`), time: v(data, `hours${i}Time`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <SectionKicker label={v(data, "visitKicker")} />
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "visitTitle")}</h2>
          <p className="mt-5 text-lg leading-8" style={{ color: "#7a7260" }}>{v(data, "visitText")}</p>
          <p className="mt-6 text-sm font-bold">{v(data, "address")}</p>
        </div>
        <div className="grid gap-3">
          {hours.map((hour, i) => (
            <Reveal key={hour.day} delayMs={i * 80} variant="left">
              <div className="flex items-center justify-between border px-5 py-4 rounded-tl-[3rem]" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#f7f1e6" }}>
                <span className="font-bold">{hour.day}</span>
                <span style={{ color: "#5c7a4a" }}>{hour.time}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Insights({ data }: { data: Record<string, any> }) {
  const posts = [1, 2, 3].map((i) => ({ title: v(data, `insight${i}Title`), text: v(data, `insight${i}Text`), image: v(data, `insight${i}Image`), tag: i === 1 ? "מדריך" : i === 2 ? "סיפור" : "טיפים" }));
  const [featured, ...rest] = posts;
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "insightsKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "insightsTitle")}</h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          <Reveal delayMs={0} variant="up" className="lg:col-span-12">
            <article className="overflow-hidden border rounded-tl-[3rem] group lg:grid lg:grid-cols-2" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
              <div className="journal-card-media relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
                <img src={featured.image} alt={featured.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-center p-6 text-right sm:p-8 lg:p-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "var(--p, #f4a261)" }}>{featured.tag}</p>
                <h3 className="tpl-display mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">{featured.title}</h3>
                <p className="mt-3 text-base leading-7" style={{ color: "#7a7260" }}>{featured.text}</p>
              </div>
            </article>
          </Reveal>
          {rest.map((post, i) => (
            <Reveal key={post.title} delayMs={(i + 1) * 90} variant="up" className="lg:col-span-6">
              <article className="overflow-hidden border rounded-tl-[3rem] group h-full" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
                <div className="journal-card-media relative aspect-[16/10] overflow-hidden">
                  <img src={post.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-5 text-right sm:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "var(--p, #f4a261)" }}>{post.tag}</p>
                  <h3 className="mt-3 text-xl font-bold sm:text-2xl">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7" style={{ color: "#7a7260" }}>{post.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABand({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "linear-gradient(135deg, #5c7a4a33, #fffdf8)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <SectionKicker label={v(data, "ctaBandKicker")} />
          <h2 className="tpl-display mt-3 text-3xl font-bold md:text-5xl">{v(data, "ctaBandTitle")}</h2>
          <p className="mt-3 max-w-2xl leading-7" style={{ color: "#7a7260" }}>{v(data, "ctaBandText")}</p>
        </div>
        <button type="button" onClick={onCta} className="tpl-sweep px-7 py-4 text-sm font-bold" style={{ background: "#5c7a4a", color: "#f7f1e6" }}>{v(data, "cta")}</button>
      </div>
    </section>
  );
}


function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#5c7a4a" }}>מהגינה</p>
            <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "aboutTitle")}</h2>
          </div>
          <p className="text-lg leading-8" style={{ color: "#7a7260" }}>{v(data, "aboutText")}</p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-2">
          <img src={v(data, "aboutImage")} alt="" className="col-span-2 aspect-[16/10] w-full object-cover" />
          <div className="flex flex-col justify-between border p-4" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#f7f1e6" }}>
            <span className="inline-block h-8 w-8 rounded-full" style={{ background: "#5c7a4a" }} />
            <p className="text-sm font-semibold">עשבי תיבול טריים כל בוקר</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#f7f1e6" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="border p-8" style={{ borderColor: "rgba(44,42,34,0.12)", background: "#fffdf8" }}>
          <p className="text-xs tracking-[0.24em]" style={{ color: "#5c7a4a" }}>שולחן גן</p>
          <h2 className="tpl-display mt-3 text-2xl sm:text-4xl font-bold">{v(data, "contactTitle")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#7a7260" }}>{v(data, "contactText")}</p>
          <div className="mt-6 space-y-1 text-sm" style={{ color: "#7a7260" }}>
            <p>{v(data, "phone")}</p><p>{v(data, "email")}</p><p>{v(data, "address")}</p>
          </div>
        </div>
        <form className="grid gap-3" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-skin="template" data-bizuply-form-id="mezzaline-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(44,42,34,0.12)" }} placeholder="שם מלא" name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(44,42,34,0.12)" }} placeholder="טלפון" name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{ borderColor: "rgba(44,42,34,0.12)" }} placeholder="מספר סועדים" name="guests" data-bizuply-form-field-id="guests" />
          <button type="submit" className="px-6 py-4 text-sm font-bold" style={{ background: "#5c7a4a", color: "#f7f1e6" }}>{v(data, "cta")}</button>
        </form>
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

function BespokeSections({ data }: { data: Record<string, any> }) {
  return (
    <>
      <PlatterScroll data={data} />
      <ParchmentQuote data={data} />
    </>
  );
}

function SharedPageSections({ data, pageId, onCta }: { data: Record<string, any>; pageId: string; onCta: () => void }) {
  return (
    <>
      {pageId === "contact" ? null : <BespokeSections data={data} />}
      <AboutBlock data={data} />
      <WhyUs data={data} />
      <MenuShowcase data={data} />
      <GallerySection data={data} />
      <TeamSection data={data} />
      <KitchenMethod data={data} />
      <Testimonials data={data} />
      <VisitBlock data={data} />
      <Insights data={data} />
      <CTABand data={data} onCta={onCta} />
    </>
  );
}

function HomePage({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} onCta={onCta} />
      <PlatterScroll data={data} />
      <ParchmentQuote data={data} />
      <AboutBlock data={data} />
      <WhyUs data={data} />
      <MenuShowcase data={data} />
      <GallerySection data={data} />
      <TeamSection data={data} />
      <KitchenMethod data={data} />
      <Testimonials data={data} />
      <VisitBlock data={data} />
      <Insights data={data} />
      <CTABand data={data} onCta={onCta} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function JournalPage({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  const posts = [1, 2, 3].map((i) => ({ title: v(data, `insight${i}Title`), text: v(data, `insight${i}Text`), image: v(data, `insight${i}Image`) }));
  return (
    <>
      <section className="journal-hero relative isolate min-h-[72vh] overflow-hidden">
        <div className="journal-media absolute inset-0">
          <img src={posts[0]?.image || v(data, "gallery2Image") || v(data, "heroImage")} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
        <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-end px-5 py-16 text-right text-white lg:px-8 lg:py-24">
          <SectionKicker label={v(data, "insightsKicker")} />
          <h1 className="tpl-display mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">{v(data, "insightsTitle")}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">{v(data, "pageHeroText")}</p>
        </div>
      </section>
      <Insights data={data} />
      <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[v(data, "gallery1Image"), v(data, "gallery2Image"), v(data, "gallery3Image")].map((src, i) => (
            <div key={i} className="journal-card-media relative aspect-[4/5] overflow-hidden">
              <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>
      <CTABand data={data} onCta={onCta} />
      <ContactBlock data={data} onCta={onCta} />
      <Footer data={data} />
    </>
  );
}

function InnerPage({ data, pageId, title, onCta }: { data: Record<string, any>; pageId: string; title: string; onCta: () => void }) {
  return (
    <>
      <PageHero data={data} title={title} pageId={pageId} />
      <SharedPageSections data={data} pageId={pageId} onCta={onCta} />
      <ContactBlock data={data} onCta={onCta} />
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
  };
  for (const pg of mezzalinePages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = pg.id === "journal"
      ? <JournalPage data={merged} onCta={() => goTo("contact")} />
      : (
      <InnerPage data={merged} pageId={pg.id} title={pg.label} onCta={() => goTo("contact")} />
    );
  }
  return (
    <div dir="rtl" data-template-id="mezzaline" className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#f7f1e6", color: "#2c2a22" }}>
      <style dangerouslySetInnerHTML={{ __html: mezzalineEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
