import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { tapasoraDefaultData } from "./defaultData";
import { tapasoraEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const tapasoraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "menu", label: "תפריט", slug: "/menu" },
  { id: "tapas", label: "טאפס", slug: "/tapas" },
  { id: "bar", label: "הבר", slug: "/bar" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "journal", label: "יומן", slug: "/journal" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "הזמנה", slug: "/contact" },
];

const allowedPages = tapasoraPages.map((p) => p.id);

type Props = {
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
};

function v(data: Record<string, any>, key: string) {
  return data?.[key] ?? (tapasoraDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo, onCta }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }) {
  const [navOpen, setNavOpen] = useState(false);
  const go = (id: string) => { setNavOpen(false); goTo(id); };
  const nav = tapasoraPages.map((p) => [p.id, v(data, `nav${p.id[0].toUpperCase()}${p.id.slice(1)}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{ background: "#080410f0", borderColor: "rgba(248,238,248,0.14)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => go("home")} className="tpl-neon tpl-display text-2xl font-bold tracking-tight">{v(data, "brandName")}</button>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => go(id)} className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: currentPage === id ? "#ff2d95" : "#b89bc4" }}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={() => { setNavOpen(false); onCta(); }} className="px-5 py-2.5 text-sm font-bold" style={{ background: "#ff2d95", color: "#12081a" }}>{v(data, "heroPrimary")}</button>
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
      <section className="relative min-h-[90vh] overflow-hidden px-5 py-20 lg:px-8" style={{ background: "#12081a" }}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${v(data, "heroImage")})`, backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #080410cc, #12081a)" }} />
        <div className="relative z-10 mx-auto max-w-7xl pt-16">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "#ff2d95" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 tpl-neon mt-4 max-w-3xl text-5xl font-bold leading-[0.95] md:text-7xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "#b89bc4" }}>{v(data, "heroSubtitle")}</p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-3 md:max-w-xl">
            {[v(data, "item1Image"), v(data, "item2Image"), v(data, "item3Image")].map((src, i) => (
              <div key={i} className="tpl-plate-rise aspect-square overflow-hidden rounded-full border-2" style={{ borderColor: "#ff2d95", animationDelay: `${i * 0.15}s` }}>
                <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="tpl-rise-3 mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "#ff2d95", color: "#12081a" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("menu")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(248,238,248,0.14)" }}>{v(data, "heroSecondary")}</button>
          </div>
        </div>
      </section>
  );
}


function BentoTapas({ data }: { data: Record<string, any> }) {
  const cards = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(248,238,248,0.14)" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">בנטו לילה</h2></Reveal>
        <div className="mt-10 grid gap-3 md:grid-cols-4 md:grid-rows-2">
          {cards.map(([title, meta, text, img], i) => (
            <Reveal key={title} delayMs={i * 80} variant="up" className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}>
              <article className="h-full overflow-hidden border" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1e1028" }}>
                <img src={img} alt="" className={i === 0 ? "aspect-[4/3] w-full object-cover md:aspect-auto md:h-[70%]" : "aspect-[4/3] w-full object-cover"} />
                <div className="p-4">
                  <p className="text-xs font-semibold" style={{ color: "#ff2d95" }}>{meta}</p>
                  <h3 className="tpl-display mt-1 text-xl font-bold">{title}</h3>
                  <p className="mt-1 text-sm" style={{ color: "#b89bc4" }}>{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function NightMarquee({ data }: { data: Record<string, any> }) {
  const tags = ["TAPAS", "NEON", "WINE", "LATE", "SHARE", "TAPAS", "NEON", "WINE"];
  return (
    <section className="overflow-hidden border-y py-3" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1e1028" }}>
      <div className="tpl-marquee-track gap-8 px-4 text-sm font-bold tracking-[0.28em]" style={{ color: "#ff2d95" }}>
        {tags.map((x, i) => <span key={i} className="whitespace-nowrap">{x} ·</span>)}
      </div>
    </section>
  );
}

function WinePour({ data }: { data: Record<string, any> }) {
  const bottles = [["אדום", "#ff2d95"], ["לבן", "#b89bc4"], ["רוזה", "#ff8fab"]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(248,238,248,0.14)" }}>
      <div className="mx-auto flex max-w-3xl justify-center gap-8">
        {bottles.map(([name, color], i) => (
          <Reveal key={name} delayMs={i * 100} variant="up">
            <div className="flex flex-col items-center">
              <div className="relative h-32 w-10 overflow-hidden rounded-t-full border" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#080410" }}>
                <div className="tpl-wine-fill absolute inset-x-0 bottom-0" style={{ background: color, animationDelay: `${i * 0.4}s` }} />
              </div>
              <p className="mt-3 text-xs font-bold tracking-wider">{name}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function SectionKicker({ label }: { label: string }) {
  return <p className="text-xs font-bold tracking-[0.28em]" style={{ color: "#ff2d95" }}>{label}</p>;
}

function PageHero({ data, title, pageId }: { data: Record<string, any>; title: string; pageId: string }) {
  const image = pageId === "about" ? v(data, "aboutImage") : pageId === "gallery" ? v(data, "gallery1Image") : pageId === "journal" ? v(data, "gallery2Image") : v(data, "heroImage");
  return (
    <section className="relative isolate overflow-hidden border-b px-5 py-20 lg:px-8 lg:py-24" style={{ borderColor: "rgba(248,238,248,0.14)" }}>
      <img src={image} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #12081af5, #1e1028cc)" }} />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <SectionKicker label={v(data, "brandName")} />
          <h1 className="tpl-display mt-4 text-5xl font-bold leading-tight md:text-7xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: "#b89bc4" }}>{v(data, "pageHeroText")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[v(data, "gallery1Image"), v(data, "gallery2Image"), v(data, "gallery3Image")].map((src, i) => (
            <div key={i} className="journal-card-media tpl-float relative aspect-square overflow-hidden border" style={{ borderColor: "rgba(248,238,248,0.14)", animationDelay: `${i * 0.25}s` }}>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1e1028" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "whyKicker")} />
        <h2 className="tpl-display mt-4 max-w-3xl text-4xl font-bold md:text-5xl">{v(data, "whyTitle")}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delayMs={i * 90} variant="up">
              <article className="tpl-sweep h-full border p-6 rounded-xl" style={{ borderColor: "rgba(248,238,248,0.14)", background: i % 2 ? "#12081a" : "#080410" }}>
                <span className="tpl-display text-2xl md:text-5xl font-bold" style={{ color: "#ff2d95" }}>0{i + 1}</span>
                <h3 className="mt-5 text-xl font-bold">{reason.title}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: "#b89bc4" }}>{reason.text}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(248,238,248,0.14)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionKicker label={v(data, "menuKicker")} />
            <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "menuShowcaseTitle")}</h2>
          </div>
          <p className="max-w-md text-sm leading-7" style={{ color: "#b89bc4" }}>{v(data, "menuShowcaseText")}</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {dishes.map((dish, i) => (
            <Reveal key={dish.title} delayMs={i * 100} variant="scale">
              <article className="group overflow-hidden border rounded-xl" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1e1028" }}>
                <img src={dish.img} alt="" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <p className="text-xs font-bold tracking-[0.18em]" style={{ color: "#ff2d95" }}>{dish.meta}</p>
                  <h3 className="tpl-display mt-2 text-2xl font-bold">{dish.title}</h3>
                  <p className="mt-3 text-sm leading-7" style={{ color: "#b89bc4" }}>{dish.text}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1e1028" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "galleryKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "galleryTitle")}</h2>
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {shots.map((shot, i) => (
            <Reveal key={shot.label} delayMs={i * 80} variant={i % 2 ? "up" : "scale"}>
              <figure className={`relative overflow-hidden border ${i === 0 ? "md:row-span-2" : ""} rounded-xl`} style={{ borderColor: "rgba(248,238,248,0.14)" }}>
                <img src={shot.src} alt="" className={i === 0 ? "aspect-[4/5] h-full w-full object-cover" : "aspect-square w-full object-cover"} />
                <figcaption className="absolute inset-x-3 bottom-3 px-3 py-2 text-sm font-bold" style={{ background: "#12081add", color: "#f8eef8" }}>{shot.label}</figcaption>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(248,238,248,0.14)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionKicker label={v(data, "teamKicker")} />
            <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "teamTitle")}</h2>
            <p className="mt-5 text-sm leading-7" style={{ color: "#b89bc4" }}>{v(data, "teamText")}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {people.map((person, i) => (
              <Reveal key={person.name} delayMs={i * 90} variant="up">
                <article className="border p-3 rounded-xl" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1e1028" }}>
                  <img src={person.img} alt="" className="aspect-[4/5] w-full object-cover" />
                  <h3 className="mt-4 text-lg font-bold">{person.name}</h3>
                  <p className="text-sm" style={{ color: "#ff2d95" }}>{person.role}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#080410" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "processKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "processTitle")}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delayMs={i * 80} variant="right">
              <article className="relative min-h-48 border p-5 rounded-xl" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1e1028" }}>
                <span className="tpl-display text-2xl md:text-5xl font-bold opacity-30" style={{ color: "#ff2d95" }}>{i + 1}</span>
                <h3 className="mt-6 text-lg font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: "#b89bc4" }}>{step.text}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(248,238,248,0.14)" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "reviewsKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "reviewsTitle")}</h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delayMs={i * 90} variant="fade">
              <blockquote className="h-full border p-6 rounded-xl" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1e1028" }}>
                <p className="text-lg leading-8">״{review.quote}״</p>
                <footer className="mt-5 text-sm font-bold" style={{ color: "#ff2d95" }}>{review.name}</footer>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1e1028" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <SectionKicker label={v(data, "visitKicker")} />
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "visitTitle")}</h2>
          <p className="mt-5 text-lg leading-8" style={{ color: "#b89bc4" }}>{v(data, "visitText")}</p>
          <p className="mt-6 text-sm font-bold">{v(data, "address")}</p>
        </div>
        <div className="grid gap-3">
          {hours.map((hour, i) => (
            <Reveal key={hour.day} delayMs={i * 80} variant="left">
              <div className="flex items-center justify-between border px-5 py-4 rounded-xl" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#12081a" }}>
                <span className="font-bold">{hour.day}</span>
                <span style={{ color: "#ff2d95" }}>{hour.time}</span>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(248,238,248,0.14)" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "insightsKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "insightsTitle")}</h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          <Reveal delayMs={0} variant="up" className="lg:col-span-12">
            <article className="overflow-hidden border rounded-xl group lg:grid lg:grid-cols-2" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1e1028" }}>
              <div className="journal-card-media relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
                <img src={featured.image} alt={featured.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-center p-6 text-right sm:p-8 lg:p-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "var(--p, #f4a261)" }}>{featured.tag}</p>
                <h3 className="tpl-display mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">{featured.title}</h3>
                <p className="mt-3 text-base leading-7" style={{ color: "#b89bc4" }}>{featured.text}</p>
              </div>
            </article>
          </Reveal>
          {rest.map((post, i) => (
            <Reveal key={post.title} delayMs={(i + 1) * 90} variant="up" className="lg:col-span-6">
              <article className="overflow-hidden border rounded-xl group h-full" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1e1028" }}>
                <div className="journal-card-media relative aspect-[16/10] overflow-hidden">
                  <img src={post.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-5 text-right sm:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "var(--p, #f4a261)" }}>{post.tag}</p>
                  <h3 className="mt-3 text-xl font-bold sm:text-2xl">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7" style={{ color: "#b89bc4" }}>{post.text}</p>
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
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(248,238,248,0.14)", background: "linear-gradient(135deg, #ff2d9533, #1e1028)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <SectionKicker label={v(data, "ctaBandKicker")} />
          <h2 className="tpl-display mt-3 text-3xl font-bold md:text-5xl">{v(data, "ctaBandTitle")}</h2>
          <p className="mt-3 max-w-2xl leading-7" style={{ color: "#b89bc4" }}>{v(data, "ctaBandText")}</p>
        </div>
        <button type="button" onClick={onCta} className="tpl-sweep px-7 py-4 text-sm font-bold" style={{ background: "#ff2d95", color: "#12081a" }}>{v(data, "cta")}</button>
      </div>
    </section>
  );
}


function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1a1520" }}>
      <div className="mx-auto max-w-3xl border-2 border-dashed p-8 md:p-12" style={{ borderColor: "#b89bc4" }}>
        <p className="text-xs font-bold tracking-[0.28em] uppercase" style={{ color: "#ff2d95" }}>Chalkboard</p>
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl" style={{ color: "#f8f4e8" }}>{v(data, "aboutTitle")}</h2>
        <p className="mt-6 text-lg leading-8" style={{ color: "#b89bc4" }}>{v(data, "aboutText")}</p>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#1e1028" }}>
      <div className="mx-auto max-w-md font-mono">
        <div className="border p-5" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#12081a" }}>
          <div className="flex justify-between text-xs" style={{ color: "#b89bc4" }}><span>TAB #042</span><span>OPEN</span></div>
          <h2 className="tpl-display mt-4 text-3xl font-bold">{v(data, "contactTitle")}</h2>
          <p className="mt-2 text-sm" style={{ color: "#b89bc4" }}>{v(data, "contactText")}</p>
          <form className="mt-6 grid gap-2" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-skin="template" data-bizuply-form-id="tapasora-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
            <input className="w-full border bg-transparent px-3 py-2 text-right text-sm outline-none" style={{ borderColor: "rgba(248,238,248,0.14)" }} placeholder="שם" name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
            <input className="w-full border bg-transparent px-3 py-2 text-right text-sm outline-none" style={{ borderColor: "rgba(248,238,248,0.14)" }} placeholder="טלפון" name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
            <div className="mt-2 flex justify-between border-t pt-3 text-sm" style={{ borderColor: "rgba(248,238,248,0.14)" }}><span>TOTAL</span><span style={{ color: "#ff2d95" }}>שמירת מקום</span></div>
            <button type="submit" className="mt-2 px-4 py-3 text-sm font-bold" style={{ background: "#ff2d95", color: "#12081a" }}>{v(data, "cta")}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer className="border-t px-5 py-8 lg:px-8" style={{ borderColor: "rgba(248,238,248,0.14)", background: "#080410" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2">
        <span className="tpl-neon tpl-display text-2xl font-bold">{v(data, "brandName")}</span>
        <span className="text-sm" style={{ color: "#b89bc4" }}>{v(data, "phone")} · {v(data, "email")}</span>
      </div>
    </footer>
  );
}

function BespokeSections({ data }: { data: Record<string, any> }) {
  return (
    <>
      <BentoTapas data={data} />
      <NightMarquee data={data} />
      <WinePour data={data} />
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
      <BentoTapas data={data} />
      <NightMarquee data={data} />
      <WinePour data={data} />
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

export default function TapasoraPages({
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}: Props) {
  const merged = useMemo(() => ({ ...tapasoraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={merged} goTo={goTo} onCta={() => goTo("contact")} />,
  };
  for (const pg of tapasoraPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = pg.id === "journal"
      ? <JournalPage data={merged} onCta={() => goTo("contact")} />
      : (
      <InnerPage data={merged} pageId={pg.id} title={pg.label} onCta={() => goTo("contact")} />
    );
  }
  return (
    <div dir="rtl" data-template-id="tapasora" className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#12081a", color: "#f8eef8" }}>
      <style dangerouslySetInnerHTML={{ __html: tapasoraEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
