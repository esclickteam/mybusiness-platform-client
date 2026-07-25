import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { sushisenDefaultData } from "./defaultData";
import { sushisenEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const sushisenPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "menu", label: "תפריט", slug: "/menu" },
  { id: "omakase", label: "אומאקאסה", slug: "/omakase" },
  { id: "nigiri", label: "ניגירי", slug: "/nigiri" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "journal", label: "יומן", slug: "/journal" },
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
            <button type="button" onClick={() => goTo("menu")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(242,240,234,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </section>
  );
}


function NigiriSnapRail({ data }: { data: Record<string, any> }) {
  const boards = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">מסילת ניגירי</h2></Reveal>
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

function WasabiStats({ data }: { data: Record<string, any> }) {
  const stats = [["12", "מושבים"], ["6:00", "דג טרי"], ["18", "מנות יום"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 text-center">
        {stats.map(([n, l], i) => (
          <Reveal key={l} delayMs={i * 80} variant="scale">
            <div className="tpl-wasabi mx-auto inline-block border px-6 py-5" style={{ borderColor: "#d4af37", animationDelay: `${i * 0.25}s` }}>
              <div className="tpl-display text-4xl font-bold" style={{ color: "#d4af37" }}>{n}</div>
              <p className="mt-2 text-xs tracking-wider" style={{ color: "#9a958c" }}>{l}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function SectionKicker({ label }: { label: string }) {
  return <p className="text-xs font-bold tracking-[0.28em]" style={{ color: "#d4af37" }}>{label}</p>;
}

function PageHero({ data, title, pageId }: { data: Record<string, any>; title: string; pageId: string }) {
  const image = pageId === "about" ? v(data, "aboutImage") : pageId === "gallery" ? v(data, "gallery1Image") : pageId === "journal" ? v(data, "gallery2Image") : v(data, "heroImage");
  return (
    <section className="relative isolate overflow-hidden border-b px-5 py-20 lg:px-8 lg:py-24" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <img src={image} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0b0b0bf5, #161616cc)" }} />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <SectionKicker label={v(data, "brandName")} />
          <h1 className="tpl-display mt-4 text-5xl font-bold leading-tight md:text-7xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: "#9a958c" }}>{v(data, "pageHeroText")}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[v(data, "gallery1Image"), v(data, "gallery2Image"), v(data, "gallery3Image")].map((src, i) => (
            <div key={i} className="tpl-float aspect-square overflow-hidden border" style={{ borderColor: "rgba(242,240,234,0.12)", animationDelay: `${i * 0.25}s` }}>
              <img src={src} alt="" className="h-full w-full object-cover" />
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "whyKicker")} />
        <h2 className="tpl-display mt-4 max-w-3xl text-4xl font-bold md:text-5xl">{v(data, "whyTitle")}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delayMs={i * 90} variant="up">
              <article className="tpl-sweep h-full border p-6 rounded-none" style={{ borderColor: "rgba(242,240,234,0.12)", background: i % 2 ? "#0b0b0b" : "#050505" }}>
                <span className="tpl-display text-5xl font-bold" style={{ color: "#d4af37" }}>0{i + 1}</span>
                <h3 className="mt-5 text-xl font-bold">{reason.title}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: "#9a958c" }}>{reason.text}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionKicker label={v(data, "menuKicker")} />
            <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "menuShowcaseTitle")}</h2>
          </div>
          <p className="max-w-md text-sm leading-7" style={{ color: "#9a958c" }}>{v(data, "menuShowcaseText")}</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {dishes.map((dish, i) => (
            <Reveal key={dish.title} delayMs={i * 100} variant="scale">
              <article className="group overflow-hidden border rounded-none" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
                <img src={dish.img} alt="" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <p className="text-xs font-bold tracking-[0.18em]" style={{ color: "#d4af37" }}>{dish.meta}</p>
                  <h3 className="tpl-display mt-2 text-2xl font-bold">{dish.title}</h3>
                  <p className="mt-3 text-sm leading-7" style={{ color: "#9a958c" }}>{dish.text}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "galleryKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "galleryTitle")}</h2>
        <div className="mt-10 grid gap-3 md:grid-cols-4">
          {shots.map((shot, i) => (
            <Reveal key={shot.label} delayMs={i * 80} variant={i % 2 ? "up" : "scale"}>
              <figure className={`relative overflow-hidden border ${i === 0 ? "md:row-span-2" : ""} rounded-none`} style={{ borderColor: "rgba(242,240,234,0.12)" }}>
                <img src={shot.src} alt="" className={i === 0 ? "aspect-[4/5] h-full w-full object-cover" : "aspect-square w-full object-cover"} />
                <figcaption className="absolute inset-x-3 bottom-3 px-3 py-2 text-sm font-bold" style={{ background: "#0b0b0bdd", color: "#f2f0ea" }}>{shot.label}</figcaption>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionKicker label={v(data, "teamKicker")} />
            <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "teamTitle")}</h2>
            <p className="mt-5 text-sm leading-7" style={{ color: "#9a958c" }}>{v(data, "teamText")}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {people.map((person, i) => (
              <Reveal key={person.name} delayMs={i * 90} variant="up">
                <article className="border p-3 rounded-none" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
                  <img src={person.img} alt="" className="aspect-[4/5] w-full object-cover" />
                  <h3 className="mt-4 text-lg font-bold">{person.name}</h3>
                  <p className="text-sm" style={{ color: "#d4af37" }}>{person.role}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#050505" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "processKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "processTitle")}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delayMs={i * 80} variant="right">
              <article className="relative min-h-48 border p-5 rounded-none" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
                <span className="tpl-display text-5xl font-bold opacity-30" style={{ color: "#d4af37" }}>{i + 1}</span>
                <h3 className="mt-6 text-lg font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: "#9a958c" }}>{step.text}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "reviewsKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "reviewsTitle")}</h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delayMs={i * 90} variant="fade">
              <blockquote className="h-full border p-6 rounded-none" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
                <p className="text-lg leading-8">״{review.quote}״</p>
                <footer className="mt-5 text-sm font-bold" style={{ color: "#d4af37" }}>{review.name}</footer>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <SectionKicker label={v(data, "visitKicker")} />
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "visitTitle")}</h2>
          <p className="mt-5 text-lg leading-8" style={{ color: "#9a958c" }}>{v(data, "visitText")}</p>
          <p className="mt-6 text-sm font-bold">{v(data, "address")}</p>
        </div>
        <div className="grid gap-3">
          {hours.map((hour, i) => (
            <Reveal key={hour.day} delayMs={i * 80} variant="left">
              <div className="flex items-center justify-between border px-5 py-4 rounded-none" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#0b0b0b" }}>
                <span className="font-bold">{hour.day}</span>
                <span style={{ color: "#d4af37" }}>{hour.time}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Insights({ data }: { data: Record<string, any> }) {
  const posts = [1, 2, 3].map((i) => ({ title: v(data, `insight${i}Title`), text: v(data, `insight${i}Text`), image: v(data, `insight${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "insightsKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "insightsTitle")}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.title} delayMs={i * 90} variant="up">
              <article className="overflow-hidden border rounded-none" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#161616" }}>
                <img src={post.image} alt="" className="aspect-[16/10] w-full object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-bold">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7" style={{ color: "#9a958c" }}>{post.text}</p>
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
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)", background: "linear-gradient(135deg, #d4af3733, #161616)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <SectionKicker label={v(data, "ctaBandKicker")} />
          <h2 className="tpl-display mt-3 text-3xl font-bold md:text-5xl">{v(data, "ctaBandTitle")}</h2>
          <p className="mt-3 max-w-2xl leading-7" style={{ color: "#9a958c" }}>{v(data, "ctaBandText")}</p>
        </div>
        <button type="button" onClick={onCta} className="tpl-sweep px-7 py-4 text-sm font-bold" style={{ background: "#d4af37", color: "#0b0b0b" }}>{v(data, "cta")}</button>
      </div>
    </section>
  );
}


function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-20 lg:px-8" style={{ borderColor: "rgba(242,240,234,0.12)" }}>
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="h-72 w-56 overflow-hidden border" style={{ borderColor: "#d4af37" }}>
          <img src={v(data, "aboutImage")} alt="" className="tpl-ken h-full w-full object-cover" />
        </div>
        <p className="mt-8 text-xs tracking-[0.34em]" style={{ color: "#d4af37" }}>אודות</p>
        <h2 className="tpl-display mt-3 text-4xl font-bold">{v(data, "aboutTitle")}</h2>
        <p className="mt-5 text-lg leading-8" style={{ color: "#9a958c" }}>{v(data, "aboutText")}</p>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(242,240,234,0.12)", background: "#050505" }}>
      <div className="mx-auto max-w-xl border p-8" style={{ borderColor: "#d4af37" }}>
        <div className="mb-6 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }} />
        <h2 className="tpl-display text-center text-3xl font-bold">{v(data, "contactTitle")}</h2>
        <p className="mt-3 text-center text-sm" style={{ color: "#9a958c" }}>{v(data, "contactText")}</p>
        <form className="mt-8 grid gap-3" onSubmit={(e) => e.preventDefault()}>
          <input className="w-full border bg-transparent px-4 py-3 text-right outline-none" style={{ borderColor: "rgba(242,240,234,0.12)" }} placeholder="שם" />
          <input className="w-full border bg-transparent px-4 py-3 text-right outline-none" style={{ borderColor: "rgba(242,240,234,0.12)" }} placeholder="טלפון" />
          <button type="button" onClick={onCta} className="px-6 py-3 text-sm font-bold tracking-wider" style={{ background: "#d4af37", color: "#0b0b0b" }}>{v(data, "cta")}</button>
        </form>
        <div className="mt-6 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }} />
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

function BespokeSections({ data }: { data: Record<string, any> }) {
  return (
    <>
      <NigiriSnapRail data={data} />
      <WasabiStats data={data} />
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
      <NigiriSnapRail data={data} />
      <WasabiStats data={data} />
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
  };
  for (const pg of sushisenPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} pageId={pg.id} title={pg.label} onCta={() => goTo("contact")} />
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "sushisen-preview" : "sushisen"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#0b0b0b", color: "#f2f0ea" }}>
      <style dangerouslySetInnerHTML={{ __html: sushisenEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
