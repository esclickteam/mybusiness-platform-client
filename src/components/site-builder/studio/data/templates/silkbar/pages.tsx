import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { silkbarDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { silkbarEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const silkbarPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "booking", label: "תורים", slug: "/booking" },
];

const allowedPages = silkbarPages.map((p) => p.id);

type SilkbarPagesProps = {
  initialPage?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
  page?: string;
  pageId?: string;
  initialPageId?: string;
  activePageId?: string;
  currentPageId?: string;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (silkbarDefaultData as Record<string, any>)[key] ?? "";
}

function BookingCalendarPanel({ pill, compact, bold, neon }: { pill?: boolean; compact?: boolean; bold?: boolean; neon?: boolean }) {
  const [selectedDay, setSelectedDay] = useState(12);
  const [selectedTime, setSelectedTime] = useState("10:30");
  const weekDays = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
  const times = ["09:00", "10:00", "10:30", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];
  const cells = Array.from({ length: 35 }, (_, i) => (i < 31 ? i + 1 : null));
  const dayPills = [10, 11, 12, 13, 14, 15, 16];
  const cellCls = bold ? "border-2 border-[var(--dark)]" : neon ? "border border-[var(--p)]/50" : "border border-[var(--p)]/20";
  const activeCls = "bg-[var(--p)] text-[var(--dark)]";
  return (
    <div className="mt-6" dir="rtl">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold">יולי 2026</p>
        <div className="flex gap-2 overflow-x-auto">
          {dayPills.map((d) => (
            <button key={d} type="button" onClick={() => setSelectedDay(d)}
              className={"shrink-0 px-3 py-1.5 text-sm font-bold transition " + (pill ? "rounded-full " : "") + (selectedDay === d ? activeCls : cellCls)}>
              {d}
            </button>
          ))}
        </div>
      </div>
      <div className={"grid grid-cols-7 gap-1 text-center text-xs " + (compact ? "mx-auto max-w-sm" : "")}>
        {weekDays.map((w) => (
          <div key={w} className="py-2 font-bold text-[var(--muted)]">{w}</div>
        ))}
        {cells.map((d, i) => (
          <button
            key={i}
            type="button"
            disabled={d == null}
            onClick={() => d != null && setSelectedDay(d)}
            className={"aspect-square text-sm transition " + (d == null ? "opacity-0" : cellCls) + " " + (d === selectedDay ? activeCls + " t-pulse" : "hover:border-[var(--p)]")}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <p className="mb-3 text-sm font-bold">שעות פנויות · יום {selectedDay}</p>
        <div className="flex flex-wrap gap-2">
          {times.map((tm) => (
            <button key={tm} type="button" onClick={() => setSelectedTime(tm)}
              className={"px-3 py-2 text-sm font-semibold transition " + (pill ? "rounded-full " : "") + (selectedTime === tm ? activeCls + " t-glow" : cellCls)}>
              {tm}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-[var(--muted)]">נבחר: {selectedDay}/7 · {selectedTime}</p>
      </div>
    </div>
  );
}

function Header({ data, currentPage, goTo }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b border-[var(--p)]/15 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-3 lg:px-8">
        <nav className="hidden justify-self-start gap-5 text-sm md:flex">{[{"id":"home","label":getValue(data,"navHome")||"בית"},{"id":"about","label":getValue(data,"navAbout")||"אודות"},{"id":"services","label":getValue(data,"navServices")||"שירותים"},{"id":"booking","label":getValue(data,"navBooking")||"תורים"}].map((p) => (
          <button key={p.id} type="button" onClick={() => goTo(p.id)} className={currentPage===p.id ? "font-bold text-[var(--p)]" : "text-[var(--muted)]"}>{p.label}</button>
        ))}</nav>
        <button type="button" onClick={() => goTo("home")} className="t-display justify-self-center text-2xl font-bold">{getValue(data,"brandName")}</button>
        <button type="button" onClick={() => goTo("booking")} className="justify-self-end bg-[var(--p)] px-4 py-2 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>
  );
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="hero" data-section-kind="hero" className="bg-[var(--bg)]">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center px-5 py-20 lg:px-12 lg:py-28">
          <Reveal variant="right">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
            <h1 className="t-display t-anim mt-5 whitespace-pre-line text-5xl font-bold leading-[1.05] md:text-6xl">{getValue(data,"heroTitle")}</h1>
            <p className="t-anim t-d1 mt-6 max-w-md text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
            <div className="mt-8 flex gap-3">
              <button type="button" onClick={() => goTo("booking")} className="bg-[var(--p)] px-7 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
              <button type="button" onClick={() => goTo("about")} className="underline decoration-[var(--p)] underline-offset-4">{getValue(data,"heroSecondaryButton")}</button>
            </div>
          </Reveal>
        </div>
        <div className="relative min-h-[420px] overflow-hidden">
          <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
          <div className="t-float absolute bottom-8 left-8 bg-[var(--surface)]/95 px-5 py-3 text-sm font-bold shadow-lg">{getValue(data,"heroStatOne")} {getValue(data,"heroStatOneLabel")}</div>
        </div>
      </div>
    </section>
      <section data-template-section-type="servicesPreview" data-section-kind="servicesPreview" className="bg-[var(--surface)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl text-4xl font-bold">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-3">
        {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
          <Reveal key={title} delayMs={i*90} className="t-hover group">
            <div className="aspect-[4/3] overflow-hidden"><img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" /></div>
            <h3 className="mt-4 text-xl font-bold">{title}</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
      <section data-template-section-type="ritual" data-section-kind="ritual" className="px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl text-4xl font-bold">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-4">
        {["אבחון","הכנה","טיפול","מעקב"].map((t,i)=>(
          <Reveal key={t} delayMs={i*70} className="t-hover border-t-4 border-[var(--p)] bg-[var(--surface)] p-5">
            <div className="text-3xl font-bold text-[var(--p)]/40">0{i+1}</div>
            <h3 className="mt-2 font-bold">{t}</h3>
          </Reveal>
        ))}
      </div>
    </section>
      <section data-template-section-type="gallery" data-section-kind="gallery" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (
            <Reveal key={i} delayMs={i*70} variant="scale"><img src={src} alt="" className="aspect-square w-full object-cover" /></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="team" data-section-kind="team" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"sectionFiveTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="testimonials" data-section-kind="testimonials" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"sectionSixTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i*80} className="t-hover"><p className="text-lg leading-8">“{text}”</p><p className="mt-3 text-sm font-bold text-[var(--p)]">{name} · {role}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="packages" data-section-kind="packages" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"packageOneTitle"),getValue(data,"packageOnePrice"),getValue(data,"packageOneText")],[getValue(data,"packageTwoTitle"),getValue(data,"packageTwoPrice"),getValue(data,"packageTwoText")],[getValue(data,"packageThreeTitle"),getValue(data,"packageThreePrice"),getValue(data,"packageThreeText")]].map(([t,p,x], i) => (
            <Reveal key={t} delayMs={i*80} className="t-hover"><div className="text-2xl font-bold text-[var(--p)]">{p}</div><h3 className="mt-2 font-bold">{t}</h3><p className="mt-2 text-sm text-[var(--muted)]">{x}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="whyUs" data-section-kind="whyUs" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"sectionEightTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="bookingTeaser" data-section-kind="bookingTeaser" className="px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-8 bg-[var(--surface)] p-8 md:grid-cols-2">
        <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"bookingTeaserTitle")}</h2><p className="mt-3 text-[var(--muted)]">{getValue(data,"ctaText")}</p></Reveal>
        <Reveal delayMs={100}><button type="button" onClick={() => goTo("booking")} className="w-full bg-[var(--p)] py-4 text-sm font-bold text-white">{getValue(data,"ctaButton")}</button></Reveal>
      </div>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="grid gap-4 border-t border-[var(--p)]/20 px-5 py-10 md:grid-cols-3 lg:px-8">
      <span className="t-display text-xl font-bold">{getValue(data,"brandName")}</span>
      <span className="text-sm text-[var(--muted)]">{getValue(data,"hours")}</span>
      <span className="text-sm text-[var(--muted)] md:text-left">{getValue(data,"address")}</span>
    </footer>
    </>
  );
}

function AboutPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="aboutHero" data-section-kind="aboutHero" className="grid lg:grid-cols-2">
      <div className="flex items-center px-5 py-16 lg:px-12"><Reveal><h1 className="t-display text-5xl font-bold">{getValue(data,"aboutHeroTitle")}</h1></Reveal></div>
      <img src={getValue(data,"aboutImage")} alt="" className="t-ken min-h-[320px] w-full object-cover" />
    </section>
      <section data-template-section-type="story" data-section-kind="story" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"aboutStoryTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="spaceTour" data-section-kind="spaceTour" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"spaceTourTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (
            <Reveal key={i} delayMs={i*70} variant="scale"><img src={src} alt="" className="aspect-square w-full object-cover" /></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="values" data-section-kind="values" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"valuesTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="specialistsDeep" data-section-kind="specialistsDeep" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"specialistsTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="certifications" data-section-kind="certifications" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"certsTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="timeline" data-section-kind="timeline" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"timelineTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="pressQuotes" data-section-kind="pressQuotes" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"pressTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i*80} className="t-hover"><p className="text-lg leading-8">“{text}”</p><p className="mt-3 text-sm font-bold text-[var(--p)]">{name} · {role}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="aboutCta" data-section-kind="aboutCta" className="px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-8 bg-[var(--surface)] p-8 md:grid-cols-2">
        <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"aboutCtaTitle")}</h2><p className="mt-3 text-[var(--muted)]">{getValue(data,"ctaText")}</p></Reveal>
        <Reveal delayMs={100}><button type="button" onClick={() => goTo("booking")} className="w-full bg-[var(--p)] py-4 text-sm font-bold text-white">{getValue(data,"ctaButton")}</button></Reveal>
      </div>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="grid gap-4 border-t border-[var(--p)]/20 px-5 py-10 md:grid-cols-3 lg:px-8">
      <span className="t-display text-xl font-bold">{getValue(data,"brandName")}</span>
      <span className="text-sm text-[var(--muted)]">{getValue(data,"hours")}</span>
      <span className="text-sm text-[var(--muted)] md:text-left">{getValue(data,"address")}</span>
    </footer>
    </>
  );
}

function ServicesPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="servicesHero" data-section-kind="servicesHero" className="grid lg:grid-cols-2">
      <div className="flex items-center px-5 py-16 lg:px-12"><Reveal><h1 className="t-display text-5xl font-bold">{getValue(data,"servicesHeroTitle")}</h1></Reveal></div>
      <img src={getValue(data,"aboutImage")} alt="" className="t-ken min-h-[320px] w-full object-cover" />
    </section>
      <section data-template-section-type="catalog" data-section-kind="catalog" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"catalogTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="featuredTreatment" data-section-kind="featuredTreatment" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"featuredTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="durationGuide" data-section-kind="durationGuide" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"durationTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="addons" data-section-kind="addons" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"addonsTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="beforeAfter" data-section-kind="beforeAfter" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"beforeAfterTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (
            <Reveal key={i} delayMs={i*70} variant="scale"><img src={src} alt="" className="aspect-square w-full object-cover" /></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="priceTable" data-section-kind="priceTable" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"priceTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"packageOneTitle"),getValue(data,"packageOnePrice"),getValue(data,"packageOneText")],[getValue(data,"packageTwoTitle"),getValue(data,"packageTwoPrice"),getValue(data,"packageTwoText")],[getValue(data,"packageThreeTitle"),getValue(data,"packageThreePrice"),getValue(data,"packageThreeText")]].map(([t,p,x], i) => (
            <Reveal key={t} delayMs={i*80} className="t-hover"><div className="text-2xl font-bold text-[var(--p)]">{p}</div><h3 className="mt-2 font-bold">{t}</h3><p className="mt-2 text-sm text-[var(--muted)]">{x}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="serviceFaq" data-section-kind="serviceFaq" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"serviceFaqTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a], i) => (
            <Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></details></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="bookCta" data-section-kind="bookCta" className="px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-8 bg-[var(--surface)] p-8 md:grid-cols-2">
        <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"bookCtaTitle")}</h2><p className="mt-3 text-[var(--muted)]">{getValue(data,"ctaText")}</p></Reveal>
        <Reveal delayMs={100}><button type="button" onClick={() => goTo("booking")} className="w-full bg-[var(--p)] py-4 text-sm font-bold text-white">{getValue(data,"ctaButton")}</button></Reveal>
      </div>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="grid gap-4 border-t border-[var(--p)]/20 px-5 py-10 md:grid-cols-3 lg:px-8">
      <span className="t-display text-xl font-bold">{getValue(data,"brandName")}</span>
      <span className="text-sm text-[var(--muted)]">{getValue(data,"hours")}</span>
      <span className="text-sm text-[var(--muted)] md:text-left">{getValue(data,"address")}</span>
    </footer>
    </>
  );
}

function BookingPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="bookingHero" data-section-kind="bookingHero" className="grid lg:grid-cols-2">
      <div className="flex items-center px-5 py-16 lg:px-12"><Reveal><h1 className="t-display text-5xl font-bold">{getValue(data,"bookingHeroTitle")}</h1></Reveal></div>
      <img src={getValue(data,"aboutImage")} alt="" className="t-ken min-h-[320px] w-full object-cover" />
    </section>
      <section data-section-kind="booking" data-bizuply-block="booking" data-template-section-type="booking" className="bg-[var(--surface)] px-5 py-16 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-5xl text-4xl font-bold">{getValue(data,"calendarTitle")}</h2></Reveal>
      <div className="mx-auto mt-8 max-w-5xl"><BookingCalendarPanel /></div>
    </section>
      <section data-template-section-type="servicePicker" data-section-kind="servicePicker" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"servicePickerTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="specialistPicker" data-section-kind="specialistPicker" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"specialistTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="hoursPanel" data-section-kind="hoursPanel" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"hoursTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="policies" data-section-kind="policies" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"policiesTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a], i) => (
            <Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></details></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="confirmationForm" data-section-kind="confirmationForm" className="bg-[var(--surface)] px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"confirmTitle")}</h2>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={(e)=>e.preventDefault()}>
          <input className="border border-[var(--p)]/20 px-4 py-3 text-right outline-none md:col-span-1" placeholder="שם מלא" />
          <input className="border border-[var(--p)]/20 px-4 py-3 text-right outline-none" placeholder="טלפון" />
          <textarea className="min-h-28 border border-[var(--p)]/20 px-4 py-3 text-right outline-none md:col-span-2" placeholder="הערות" />
          <button type="button" className="bg-[var(--p)] py-3 font-bold text-white md:col-span-2">{getValue(data,"contactButton")}</button>
        </form></Reveal>
      </div>
    </section>
      <section data-template-section-type="locationMap" data-section-kind="locationMap" className="grid lg:grid-cols-[1.2fr_0.8fr]">
      <img src={getValue(data,"mapImage")} alt="" className="t-ken min-h-[300px] w-full object-cover" />
      <div className="flex flex-col justify-center bg-[var(--surface)] px-8 py-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"locationTitle")}</h2>
        <p className="mt-4 text-[var(--muted)]">{getValue(data,"address")}</p>
        <p className="mt-2">{getValue(data,"hours")}</p></Reveal>
      </div>
    </section>
      <section data-template-section-type="bookingFaq" data-section-kind="bookingFaq" className="bg-[var(--bg)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl border-r-4 border-[var(--p)] pr-5 text-4xl font-bold">{getValue(data,"bookingFaqTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto pb-3">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a], i) => (
            <Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></details></Reveal>
          ))}</div>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="grid gap-4 border-t border-[var(--p)]/20 px-5 py-10 md:grid-cols-3 lg:px-8">
      <span className="t-display text-xl font-bold">{getValue(data,"brandName")}</span>
      <span className="text-sm text-[var(--muted)]">{getValue(data,"hours")}</span>
      <span className="text-sm text-[var(--muted)] md:text-left">{getValue(data,"address")}</span>
    </footer>
    </>
  );
}

export default function SilkbarPages(props: SilkbarPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...silkbarDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );

  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={mergedData} goTo={goTo} />,
    about: <AboutPage data={mergedData} goTo={goTo} />,
    services: <ServicesPage data={mergedData} goTo={goTo} />,
    booking: <BookingPage data={mergedData} goTo={goTo} />,
  };

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "silkbar-preview" : "silkbar"} className="min-h-screen w-full overflow-x-hidden" style={{ background: "#F7FCFB", color: "#134E4A" }}>
      <style dangerouslySetInnerHTML={{ __html: silkbarEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))}
      />
    </div>
  );
}
