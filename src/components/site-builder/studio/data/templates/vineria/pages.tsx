import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { vineriaDefaultData } from "./defaultData";
import { vineriaEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const vineriaPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "menu", label: "תפריט", slug: "/menu" },
  { id: "wines", label: "יינות", slug: "/wines" },
  { id: "tasting", label: "טעימות", slug: "/tasting" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "journal", label: "יומן", slug: "/journal" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = vineriaPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (vineriaDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const nav = vineriaPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{ background: "#1a1218f5", borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-5">
        <button type="button" onClick={() => goTo("home")} className="tpl-display text-3xl font-semibold tracking-[0.12em]">{v(data, "brandName")}</button>
        <nav className="flex flex-wrap items-center justify-center gap-5">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-xs font-medium tracking-[0.22em] uppercase"
              style={{ color: currentPage === id ? "#9b2335" : "#a8959a" }}>{label}</button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero({ data, goTo, onCta }: { data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }) {
  return (
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <div className="tpl-depth-1 absolute inset-0">
          <img src={v(data, "heroImage")} alt="" className="h-full w-full object-cover opacity-70" />
        </div>
        <div className="tpl-depth-2 absolute inset-x-0 bottom-0 h-[50%]" style={{ background: "linear-gradient(180deg, transparent, #0c080c)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #1a121855, #1a1218ee)" }} />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-4xl flex-col items-center justify-center px-5 pt-28 text-center">
          <p className="tpl-rise text-xs font-semibold tracking-[0.4em]" style={{ color: "#9b2335" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-6 text-5xl font-semibold leading-[1.05] md:text-7xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-lg text-lg leading-8" style={{ color: "#a8959a" }}>{v(data, "heroSubtitle")}</p>
          <div className="tpl-rise-3 mt-10 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={onCta} className="px-8 py-3.5 text-sm font-semibold tracking-wider" style={{ background: "#9b2335", color: "#f5ebe0" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("menu")} className="border px-8 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(245,235,224,0.12)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </section>
  );
}


function TastingTimeline({ data }: { data: Record<string, any> }) {
  const notes = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-4xl font-semibold md:text-5xl">הערות טעימה</h2></Reveal>
        <div className="relative mt-12">
          <div className="absolute right-3 top-0 bottom-0 w-px" style={{ background: "rgba(245,235,224,0.12)" }} />
          {notes.map(([title, meta, text], i) => (
            <Reveal key={title} delayMs={i * 100} variant="right">
              <div className="relative grid gap-2 pb-10 pr-12">
                <div className="absolute right-1.5 top-1 h-3 w-3 rounded-full border-2" style={{ borderColor: "#9b2335", background: "#1a1218" }} />
                <p className="text-xs tracking-[0.2em]" style={{ color: "#9b2335" }}>{meta}</p>
                <h3 className="tpl-display text-2xl font-semibold">{title}</h3>
                <p className="text-sm leading-7" style={{ color: "#a8959a" }}>{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CorkBadges({ data }: { data: Record<string, any> }) {
  const corks = ["אדום", "לבן", "מבעבע", "טבעי"];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-5">
        {corks.map((c, i) => (
          <Reveal key={c} delayMs={i * 70} variant="scale">
            <div className="tpl-cork flex h-16 w-12 items-center justify-center rounded-sm text-[10px] font-bold tracking-wider" style={{ background: "#c4a574", color: "#0c080c", animationDelay: `${i * 0.3}s` }}>{c}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function SectionKicker({ label }: { label: string }) {
  return <p className="text-xs font-bold tracking-[0.28em]" style={{ color: "#9b2335" }}>{label}</p>;
}

function PageHero({ data, title, pageId }: { data: Record<string, any>; title: string; pageId: string }) {
  const image = pageId === "about" ? v(data, "aboutImage") : pageId === "gallery" ? v(data, "gallery1Image") : pageId === "journal" ? v(data, "gallery2Image") : v(data, "heroImage");
  return (
    <section className="relative isolate overflow-hidden border-b px-5 py-20 lg:px-8 lg:py-24" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <img src={image} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a1218f5, #241820cc)" }} />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <SectionKicker label={v(data, "brandName")} />
          <h1 className="tpl-display mt-4 text-5xl font-bold leading-tight md:text-7xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: "#a8959a" }}>{v(data, "pageHeroText")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[v(data, "gallery1Image"), v(data, "gallery2Image"), v(data, "gallery3Image")].map((src, i) => (
            <div key={i} className="tpl-float aspect-square overflow-hidden border" style={{ borderColor: "rgba(245,235,224,0.12)", animationDelay: `${i * 0.25}s` }}>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "whyKicker")} />
        <h2 className="tpl-display mt-4 max-w-3xl text-4xl font-bold md:text-5xl">{v(data, "whyTitle")}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delayMs={i * 90} variant="up">
              <article className="tpl-sweep h-full border p-6 rounded-none" style={{ borderColor: "rgba(245,235,224,0.12)", background: i % 2 ? "#1a1218" : "#0c080c" }}>
                <span className="tpl-display text-2xl md:text-5xl font-bold" style={{ color: "#9b2335" }}>0{i + 1}</span>
                <h3 className="mt-5 text-xl font-bold">{reason.title}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: "#a8959a" }}>{reason.text}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionKicker label={v(data, "menuKicker")} />
            <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "menuShowcaseTitle")}</h2>
          </div>
          <p className="max-w-md text-sm leading-7" style={{ color: "#a8959a" }}>{v(data, "menuShowcaseText")}</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {dishes.map((dish, i) => (
            <Reveal key={dish.title} delayMs={i * 100} variant="scale">
              <article className="group overflow-hidden border rounded-none" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
                <img src={dish.img} alt="" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <p className="text-xs font-bold tracking-[0.18em]" style={{ color: "#9b2335" }}>{dish.meta}</p>
                  <h3 className="tpl-display mt-2 text-2xl font-bold">{dish.title}</h3>
                  <p className="mt-3 text-sm leading-7" style={{ color: "#a8959a" }}>{dish.text}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "galleryKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "galleryTitle")}</h2>
        <div className="mt-10 grid gap-3 md:grid-cols-4">
          {shots.map((shot, i) => (
            <Reveal key={shot.label} delayMs={i * 80} variant={i % 2 ? "up" : "scale"}>
              <figure className={`relative overflow-hidden border ${i === 0 ? "md:row-span-2" : ""} rounded-none`} style={{ borderColor: "rgba(245,235,224,0.12)" }}>
                <img src={shot.src} alt="" className={i === 0 ? "aspect-[4/5] h-full w-full object-cover" : "aspect-square w-full object-cover"} />
                <figcaption className="absolute inset-x-3 bottom-3 px-3 py-2 text-sm font-bold" style={{ background: "#1a1218dd", color: "#f5ebe0" }}>{shot.label}</figcaption>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionKicker label={v(data, "teamKicker")} />
            <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "teamTitle")}</h2>
            <p className="mt-5 text-sm leading-7" style={{ color: "#a8959a" }}>{v(data, "teamText")}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {people.map((person, i) => (
              <Reveal key={person.name} delayMs={i * 90} variant="up">
                <article className="border p-3 rounded-none" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
                  <img src={person.img} alt="" className="aspect-[4/5] w-full object-cover" />
                  <h3 className="mt-4 text-lg font-bold">{person.name}</h3>
                  <p className="text-sm" style={{ color: "#9b2335" }}>{person.role}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#0c080c" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "processKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "processTitle")}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delayMs={i * 80} variant="right">
              <article className="relative min-h-48 border p-5 rounded-none" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
                <span className="tpl-display text-2xl md:text-5xl font-bold opacity-30" style={{ color: "#9b2335" }}>{i + 1}</span>
                <h3 className="mt-6 text-lg font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: "#a8959a" }}>{step.text}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "reviewsKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "reviewsTitle")}</h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delayMs={i * 90} variant="fade">
              <blockquote className="h-full border p-6 rounded-none" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
                <p className="text-lg leading-8">״{review.quote}״</p>
                <footer className="mt-5 text-sm font-bold" style={{ color: "#9b2335" }}>{review.name}</footer>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <SectionKicker label={v(data, "visitKicker")} />
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "visitTitle")}</h2>
          <p className="mt-5 text-lg leading-8" style={{ color: "#a8959a" }}>{v(data, "visitText")}</p>
          <p className="mt-6 text-sm font-bold">{v(data, "address")}</p>
        </div>
        <div className="grid gap-3">
          {hours.map((hour, i) => (
            <Reveal key={hour.day} delayMs={i * 80} variant="left">
              <div className="flex items-center justify-between border px-5 py-4 rounded-none" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#1a1218" }}>
                <span className="font-bold">{hour.day}</span>
                <span style={{ color: "#9b2335" }}>{hour.time}</span>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "insightsKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "insightsTitle")}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.title} delayMs={i * 90} variant="up">
              <article className="overflow-hidden border rounded-none" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
                <img src={post.image} alt="" className="aspect-[16/10] w-full object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-bold">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7" style={{ color: "#a8959a" }}>{post.text}</p>
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
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)", background: "linear-gradient(135deg, #9b233533, #241820)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <SectionKicker label={v(data, "ctaBandKicker")} />
          <h2 className="tpl-display mt-3 text-3xl font-bold md:text-5xl">{v(data, "ctaBandTitle")}</h2>
          <p className="mt-3 max-w-2xl leading-7" style={{ color: "#a8959a" }}>{v(data, "ctaBandText")}</p>
        </div>
        <button type="button" onClick={onCta} className="tpl-sweep px-7 py-4 text-sm font-bold" style={{ background: "#9b2335", color: "#f5ebe0" }}>{v(data, "cta")}</button>
      </div>
    </section>
  );
}


function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto max-w-3xl border px-8 py-12 text-center" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
        <p className="text-xs tracking-[0.4em]" style={{ color: "#9b2335" }}>LETTERPRESS</p>
        <h2 className="tpl-display mt-5 text-4xl font-semibold md:text-5xl">{v(data, "aboutTitle")}</h2>
        <div className="mx-auto mt-6 h-px w-24" style={{ background: "#9b2335" }} />
        <p className="mt-6 text-lg leading-8" style={{ color: "#a8959a" }}>{v(data, "aboutText")}</p>
        <img src={v(data, "aboutImage")} alt="" className="mx-auto mt-8 aspect-[21/9] w-full max-w-lg object-cover opacity-90" />
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(245,235,224,0.12)", background: "#241820" }}>
      <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-2">
        <div className="text-center lg:text-right">
          <p className="text-xs tracking-[0.34em]" style={{ color: "#9b2335" }}>RESERVATION</p>
          <h2 className="tpl-display mt-4 text-2xl sm:text-4xl font-semibold">{v(data, "contactTitle")}</h2>
          <p className="mt-4 leading-8" style={{ color: "#a8959a" }}>{v(data, "contactText")}</p>
          <p className="mt-6 text-sm" style={{ color: "#a8959a" }}>{v(data, "phone")} · {v(data, "email")}</p>
        </div>
        <form className="grid gap-4 border p-6" style={{ borderColor: "rgba(245,235,224,0.12)" }}  data-bizuply-block="lead-form" data-bizuply-form-id="vineria-contact-1" data-bizuply-crm-lead="true" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם." >
          <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  className="w-full border-b bg-transparent px-2 py-3 text-right outline-none" style={{ borderColor: "rgba(245,235,224,0.12)" }} placeholder="שם מלא" />
          <input name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel"  className="w-full border-b bg-transparent px-2 py-3 text-right outline-none" style={{ borderColor: "rgba(245,235,224,0.12)" }} placeholder="טלפון" />
          <input className="w-full border-b bg-transparent px-2 py-3 text-right outline-none" style={{ borderColor: "rgba(245,235,224,0.12)" }} placeholder="תאריך מועדף" />
          <button type="button" onClick={onCta} className="mt-2 px-6 py-3 text-sm font-semibold tracking-wider" style={{ background: "#9b2335", color: "#f5ebe0" }}>{v(data, "cta")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-10 lg:px-8" style={{ borderColor: "rgba(245,235,224,0.12)" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4">
        <div className="tpl-stamp border-2 px-4 py-2 text-xs font-bold tracking-[0.3em]" style={{ borderColor: "#9b2335", color: "#9b2335" }}>EST. CELLAR</div>
        <span className="tpl-display text-xl font-semibold">{v(data, "brandName")}</span>
        <span className="text-sm" style={{ color: "#a8959a" }}>{v(data, "email")} · {v(data, "phone")}</span>
      </div>
    </footer>
  );
}

function BespokeSections({ data }: { data: Record<string, any> }) {
  return (
    <>
      <TastingTimeline data={data} />
      <CorkBadges data={data} />
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
      <TastingTimeline data={data} />
      <CorkBadges data={data} />
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

export default function VineriaPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...vineriaDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of vineriaPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} pageId={pg.id} title={pg.label} onCta={() => goTo("contact")} />
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "vineria-preview" : "vineria"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#1a1218", color: "#f5ebe0" }}>
      <style dangerouslySetInnerHTML={{ __html: vineriaEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
