import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { noodlixDefaultData } from "./defaultData";
import { noodlixEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";

export const noodlixPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "menu", label: "תפריט", slug: "/menu" },
  { id: "bowls", label: "קערות", slug: "/bowls" },
  { id: "broth", label: "ציר", slug: "/broth" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "journal", label: "יומן", slug: "/journal" },
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
          <button type="button" onClick={() => goTo("menu")} className="rounded-full border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "rgba(238,246,241,0.12)" }}>{v(data, "heroSecondary")}</button>
        </div>
      </section>
  );
}


function RadialDishes({ data }: { data: Record<string, any> }) {
  const cards = [1, 2, 3].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto max-w-7xl text-center">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">קערות היום</h2></Reveal>
        <div className="relative mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-8">
          <div className="tpl-radial-orbit pointer-events-none absolute inset-0 rounded-full border border-dashed opacity-30" style={{ borderColor: "#3dd6c6" }} />
          {cards.map(([title, meta, text, img], i) => (
            <Reveal key={title} delayMs={i * 100} variant="scale">
              <article className="w-40 text-center md:w-48">
                <div className="mx-auto aspect-square overflow-hidden rounded-full border-2" style={{ borderColor: "#3dd6c6" }}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
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

function ChopstickSteps({ data }: { data: Record<string, any> }) {
  const steps = [["01", "ציר איטי"], ["02", "אטריות טריות"], ["03", "הרכבה חמה"]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {steps.map(([n, label], i) => (
          <Reveal key={n} delayMs={i * 90} variant="up">
            <div className="relative border-r pr-4" style={{ borderColor: "#3dd6c6" }}>
              <div className="tpl-display text-2xl sm:text-4xl font-bold" style={{ color: "#3dd6c6" }}>{n}</div>
              <p className="mt-2 text-sm font-semibold">{label}</p>
              <div className="absolute -left-1 top-2 h-16 w-0.5 rotate-12" style={{ background: "#8aa89a" }} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function SectionKicker({ label }: { label: string }) {
  return <p className="text-xs font-bold tracking-[0.28em]" style={{ color: "#3dd6c6" }}>{label}</p>;
}

function PageHero({ data, title, pageId }: { data: Record<string, any>; title: string; pageId: string }) {
  const image = pageId === "about" ? v(data, "aboutImage") : pageId === "gallery" ? v(data, "gallery1Image") : pageId === "journal" ? v(data, "gallery2Image") : v(data, "heroImage");
  return (
    <section className="relative isolate overflow-hidden border-b px-5 py-20 lg:px-8 lg:py-24" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <img src={image} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0f1412f5, #18201ccc)" }} />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <SectionKicker label={v(data, "brandName")} />
          <h1 className="tpl-display mt-4 text-5xl font-bold leading-tight md:text-7xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: "#8aa89a" }}>{v(data, "pageHeroText")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[v(data, "gallery1Image"), v(data, "gallery2Image"), v(data, "gallery3Image")].map((src, i) => (
            <div key={i} className="tpl-float aspect-square overflow-hidden border" style={{ borderColor: "rgba(238,246,241,0.12)", animationDelay: `${i * 0.25}s` }}>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "whyKicker")} />
        <h2 className="tpl-display mt-4 max-w-3xl text-4xl font-bold md:text-5xl">{v(data, "whyTitle")}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delayMs={i * 90} variant="up">
              <article className="tpl-sweep h-full border p-6 rounded-[2rem]" style={{ borderColor: "rgba(238,246,241,0.12)", background: i % 2 ? "#0f1412" : "#070a09" }}>
                <span className="tpl-display text-2xl md:text-5xl font-bold" style={{ color: "#3dd6c6" }}>0{i + 1}</span>
                <h3 className="mt-5 text-xl font-bold">{reason.title}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: "#8aa89a" }}>{reason.text}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionKicker label={v(data, "menuKicker")} />
            <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "menuShowcaseTitle")}</h2>
          </div>
          <p className="max-w-md text-sm leading-7" style={{ color: "#8aa89a" }}>{v(data, "menuShowcaseText")}</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {dishes.map((dish, i) => (
            <Reveal key={dish.title} delayMs={i * 100} variant="scale">
              <article className="group overflow-hidden border rounded-[2rem]" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
                <img src={dish.img} alt="" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <p className="text-xs font-bold tracking-[0.18em]" style={{ color: "#3dd6c6" }}>{dish.meta}</p>
                  <h3 className="tpl-display mt-2 text-2xl font-bold">{dish.title}</h3>
                  <p className="mt-3 text-sm leading-7" style={{ color: "#8aa89a" }}>{dish.text}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "galleryKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "galleryTitle")}</h2>
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {shots.map((shot, i) => (
            <Reveal key={shot.label} delayMs={i * 80} variant={i % 2 ? "up" : "scale"}>
              <figure className={`relative overflow-hidden border ${i === 0 ? "md:row-span-2" : ""} rounded-[2rem]`} style={{ borderColor: "rgba(238,246,241,0.12)" }}>
                <img src={shot.src} alt="" className={i === 0 ? "aspect-[4/5] h-full w-full object-cover" : "aspect-square w-full object-cover"} />
                <figcaption className="absolute inset-x-3 bottom-3 px-3 py-2 text-sm font-bold" style={{ background: "#0f1412dd", color: "#eef6f1" }}>{shot.label}</figcaption>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionKicker label={v(data, "teamKicker")} />
            <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "teamTitle")}</h2>
            <p className="mt-5 text-sm leading-7" style={{ color: "#8aa89a" }}>{v(data, "teamText")}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {people.map((person, i) => (
              <Reveal key={person.name} delayMs={i * 90} variant="up">
                <article className="border p-3 rounded-[2rem]" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
                  <img src={person.img} alt="" className="aspect-[4/5] w-full object-cover" />
                  <h3 className="mt-4 text-lg font-bold">{person.name}</h3>
                  <p className="text-sm" style={{ color: "#3dd6c6" }}>{person.role}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#070a09" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "processKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "processTitle")}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delayMs={i * 80} variant="right">
              <article className="relative min-h-48 border p-5 rounded-[2rem]" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
                <span className="tpl-display text-2xl md:text-5xl font-bold opacity-30" style={{ color: "#3dd6c6" }}>{i + 1}</span>
                <h3 className="mt-6 text-lg font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: "#8aa89a" }}>{step.text}</p>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "reviewsKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "reviewsTitle")}</h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delayMs={i * 90} variant="fade">
              <blockquote className="h-full border p-6 rounded-[2rem]" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
                <p className="text-lg leading-8">״{review.quote}״</p>
                <footer className="mt-5 text-sm font-bold" style={{ color: "#3dd6c6" }}>{review.name}</footer>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <SectionKicker label={v(data, "visitKicker")} />
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "visitTitle")}</h2>
          <p className="mt-5 text-lg leading-8" style={{ color: "#8aa89a" }}>{v(data, "visitText")}</p>
          <p className="mt-6 text-sm font-bold">{v(data, "address")}</p>
        </div>
        <div className="grid gap-3">
          {hours.map((hour, i) => (
            <Reveal key={hour.day} delayMs={i * 80} variant="left">
              <div className="flex items-center justify-between border px-5 py-4 rounded-[2rem]" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#0f1412" }}>
                <span className="font-bold">{hour.day}</span>
                <span style={{ color: "#3dd6c6" }}>{hour.time}</span>
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
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto max-w-7xl">
        <SectionKicker label={v(data, "insightsKicker")} />
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{v(data, "insightsTitle")}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.title} delayMs={i * 90} variant="up">
              <article className="overflow-hidden border rounded-[2rem]" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
                <img src={post.image} alt="" className="aspect-[16/10] w-full object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-bold">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7" style={{ color: "#8aa89a" }}>{post.text}</p>
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
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "rgba(238,246,241,0.12)", background: "linear-gradient(135deg, #3dd6c633, #18201c)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <SectionKicker label={v(data, "ctaBandKicker")} />
          <h2 className="tpl-display mt-3 text-3xl font-bold md:text-5xl">{v(data, "ctaBandTitle")}</h2>
          <p className="mt-3 max-w-2xl leading-7" style={{ color: "#8aa89a" }}>{v(data, "ctaBandText")}</p>
        </div>
        <button type="button" onClick={onCta} className="tpl-sweep px-7 py-4 text-sm font-bold" style={{ background: "#3dd6c6", color: "#0a1210" }}>{v(data, "cta")}</button>
      </div>
    </section>
  );
}


function AboutBlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)", background: "#18201c" }}>
      <div className="mx-auto max-w-3xl space-y-4">
        <Reveal>
          <div className="tpl-steam-card rounded-2xl p-6">
            <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "#3dd6c6" }}>אודות</p>
            <h2 className="tpl-display mt-3 text-3xl font-bold md:text-4xl">{v(data, "aboutTitle")}</h2>
          </div>
        </Reveal>
        <Reveal delayMs={100}>
          <div className="tpl-steam-card rounded-2xl p-6">
            <p className="text-lg leading-8" style={{ color: "#8aa89a" }}>{v(data, "aboutText")}</p>
          </div>
        </Reveal>
        <Reveal delayMs={180} variant="scale">
          <div className="tpl-steam-card overflow-hidden rounded-2xl">
            <img src={v(data, "aboutImage")} alt="" className="aspect-[21/9] w-full object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactBlock({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "rgba(238,246,241,0.12)" }}>
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <h2 className="tpl-display text-2xl sm:text-4xl font-bold">{v(data, "contactTitle")}</h2>
        <p className="mt-4 text-lg" style={{ color: "#8aa89a" }}>{v(data, "contactText")}</p>
        <form className="tpl-steam-card mt-8 grid w-full max-w-md gap-3 rounded-full border p-8" style={{ borderColor: "#3dd6c6" }} onSubmit={(e) => e.preventDefault()}>
          <input className="w-full rounded-full border bg-transparent px-4 py-3 text-center outline-none" style={{ borderColor: "rgba(238,246,241,0.12)" }} placeholder="שם" />
          <input className="w-full rounded-full border bg-transparent px-4 py-3 text-center outline-none" style={{ borderColor: "rgba(238,246,241,0.12)" }} placeholder="טלפון" />
          <button type="button" onClick={onCta} className="rounded-full px-6 py-3 text-sm font-bold" style={{ background: "#3dd6c6", color: "#0a1210" }}>{v(data, "cta")}</button>
        </form>
        <p className="mt-6 text-sm" style={{ color: "#8aa89a" }}>{v(data, "phone")} · {v(data, "email")}</p>
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

function BespokeSections({ data }: { data: Record<string, any> }) {
  return (
    <>
      <RadialDishes data={data} />
      <ChopstickSteps data={data} />
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
      <RadialDishes data={data} />
      <ChopstickSteps data={data} />
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
  };
  for (const pg of noodlixPages) {
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={merged} pageId={pg.id} title={pg.label} onCta={() => goTo("contact")} />
    );
  }
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "noodlix-preview" : "noodlix"} className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#0f1412", color: "#eef6f1" }}>
      <style dangerouslySetInnerHTML={{ __html: noodlixEditorCss }} />
      <Header data={merged} currentPage={currentPage} goTo={goTo} onCta={() => goTo("contact")} />
      <VisualPageStack activePageId={currentPage} pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))} />
    </div>
  );
}
