import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { nailoraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { nailoraEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const nailoraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "booking", label: "תורים", slug: "/booking" },
];

const allowedPages = nailoraPages.map((p) => p.id);

type NailoraPagesProps = {
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
  return data?.[key] ?? (nailoraDefaultData as Record<string, any>)[key] ?? "";
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
    <header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 bg-[var(--bg)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={() => goTo("home")} className="t-display text-3xl font-bold text-[var(--p)]">{getValue(data,"brandName")}</button>
        <div className="flex flex-wrap items-center justify-center gap-2">{[{"id":"home","label":getValue(data,"navHome")||"בית"},{"id":"about","label":getValue(data,"navAbout")||"אודות"},{"id":"services","label":getValue(data,"navServices")||"שירותים"},{"id":"booking","label":getValue(data,"navBooking")||"תורים"}].map((p) => (
          <button key={p.id} type="button" onClick={() => goTo(p.id)} className={"rounded-full px-3 py-1 text-sm " + (currentPage===p.id ? "bg-[var(--p)] text-white" : "bg-[var(--surface)] text-[var(--muted)]")}>{p.label}</button>
        ))}</div>
        <button type="button" onClick={() => goTo("booking")} className="rounded-full bg-[var(--p)] px-6 py-2 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>
  );
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="hero" data-section-kind="hero" className="overflow-hidden bg-[var(--bg)] px-4 pb-16 pt-10">
      <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
        <Reveal>
          <p className="inline-block rounded-full bg-[var(--a)]/40 px-4 py-1 text-xs font-bold text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
          <h1 className="t-display t-anim mt-4 text-5xl font-bold leading-tight md:text-6xl">{getValue(data,"heroTitle")}</h1>
          <p className="t-anim t-d1 mt-4 text-base text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("booking")} className="rounded-full bg-[var(--p)] px-7 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("services")} className="rounded-full border-2 border-[var(--p)] px-7 py-3.5 text-sm font-bold text-[var(--p)]">{getValue(data,"heroSecondaryButton")}</button>
          </div>
        </Reveal>
        <Reveal variant="scale" delayMs={120}>
          <div className="relative">
            <div className="t-float absolute -right-3 -top-3 h-20 w-20 rounded-full bg-[var(--a)]/50" />
            <img src={getValue(data,"heroImage")} alt="" className="t-ken aspect-[4/5] w-full rounded-[2rem] object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
      <section data-template-section-type="servicesPreview" data-section-kind="servicesPreview" className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal><h2 className="t-display text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
        <div className="mt-10 flex gap-4 overflow-x-auto pb-4">
          {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover min-w-[260px] shrink-0 rounded-3xl bg-[var(--surface)] p-6 shadow-md">
              <div className="mb-3 h-2 w-12 rounded-full bg-[var(--p)]" />
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
      <section data-template-section-type="ritual" data-section-kind="ritual" className="bg-[var(--surface)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-6xl text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-center">
        {[["בחירה","בוחרות טיפול"],["טיפוח","הידיים עובדות"],["זוהר","יוצאות זוהרות"]].map(([a,b],i) => (
          <Reveal key={a} delayMs={i*100} variant="scale">
            <div className="t-float relative grid h-40 w-40 place-items-center rounded-full bg-[var(--p)] text-center text-white" style={{animationDelay:`${i*0.3}s`}}>
              <div><div className="text-xs opacity-80">{a}</div><div className="mt-1 font-bold">{b}</div></div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
      <section data-template-section-type="gallery" data-section-kind="gallery" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (
            <Reveal key={i} delayMs={i*70} variant="scale"><img src={src} alt="" className="aspect-square w-full object-cover" /></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="team" data-section-kind="team" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"sectionFiveTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="testimonials" data-section-kind="testimonials" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"sectionSixTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i*80} className="t-hover"><p className="text-lg leading-8">“{text}”</p><p className="mt-3 text-sm font-bold text-[var(--p)]">{name} · {role}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="packages" data-section-kind="packages" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"packageOneTitle"),getValue(data,"packageOnePrice"),getValue(data,"packageOneText")],[getValue(data,"packageTwoTitle"),getValue(data,"packageTwoPrice"),getValue(data,"packageTwoText")],[getValue(data,"packageThreeTitle"),getValue(data,"packageThreePrice"),getValue(data,"packageThreeText")]].map(([t,p,x], i) => (
            <Reveal key={t} delayMs={i*80} className="t-hover"><div className="text-2xl font-bold text-[var(--p)]">{p}</div><h3 className="mt-2 font-bold">{t}</h3><p className="mt-2 text-sm text-[var(--muted)]">{x}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="whyUs" data-section-kind="whyUs" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"sectionEightTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="bookingTeaser" data-section-kind="bookingTeaser" className="px-5 py-16">
      <Reveal className="mx-auto max-w-xl rounded-full bg-[var(--p)] px-8 py-10 text-center text-white">
        <h2 className="t-display text-3xl font-bold">{getValue(data,"bookingTeaserTitle")}</h2>
        <button type="button" onClick={() => goTo("booking")} className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-bold text-[var(--p)]">{getValue(data,"ctaButton")}</button>
      </Reveal>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="bg-[var(--p)] px-5 py-10 text-center text-white">
      <p className="t-display text-3xl font-bold">{getValue(data,"brandName")}</p>
      <p className="mt-2 text-sm opacity-90">{getValue(data,"address")}</p>
    </footer>
    </>
  );
}

function AboutPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="aboutHero" data-section-kind="aboutHero" className="bg-[var(--bg)] px-5 py-16 text-center">
      <Reveal variant="scale"><p className="text-xs font-bold text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
      <h1 className="t-display t-anim mt-3 text-5xl font-bold text-[var(--p)]">{getValue(data,"aboutHeroTitle")}</h1></Reveal>
    </section>
      <section data-template-section-type="story" data-section-kind="story" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"aboutStoryTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="spaceTour" data-section-kind="spaceTour" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"spaceTourTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (
            <Reveal key={i} delayMs={i*70} variant="scale"><img src={src} alt="" className="aspect-square w-full object-cover" /></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="values" data-section-kind="values" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"valuesTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="specialistsDeep" data-section-kind="specialistsDeep" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"specialistsTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="certifications" data-section-kind="certifications" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"certsTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="timeline" data-section-kind="timeline" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"timelineTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="pressQuotes" data-section-kind="pressQuotes" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"pressTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i*80} className="t-hover"><p className="text-lg leading-8">“{text}”</p><p className="mt-3 text-sm font-bold text-[var(--p)]">{name} · {role}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="aboutCta" data-section-kind="aboutCta" className="px-5 py-16">
      <Reveal className="mx-auto max-w-xl rounded-full bg-[var(--p)] px-8 py-10 text-center text-white">
        <h2 className="t-display text-3xl font-bold">{getValue(data,"aboutCtaTitle")}</h2>
        <button type="button" onClick={() => goTo("booking")} className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-bold text-[var(--p)]">{getValue(data,"ctaButton")}</button>
      </Reveal>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="bg-[var(--p)] px-5 py-10 text-center text-white">
      <p className="t-display text-3xl font-bold">{getValue(data,"brandName")}</p>
      <p className="mt-2 text-sm opacity-90">{getValue(data,"address")}</p>
    </footer>
    </>
  );
}

function ServicesPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="servicesHero" data-section-kind="servicesHero" className="bg-[var(--bg)] px-5 py-16 text-center">
      <Reveal variant="scale"><p className="text-xs font-bold text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
      <h1 className="t-display t-anim mt-3 text-5xl font-bold text-[var(--p)]">{getValue(data,"servicesHeroTitle")}</h1></Reveal>
    </section>
      <section data-template-section-type="catalog" data-section-kind="catalog" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"catalogTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="featuredTreatment" data-section-kind="featuredTreatment" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"featuredTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="durationGuide" data-section-kind="durationGuide" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"durationTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="addons" data-section-kind="addons" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"addonsTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="beforeAfter" data-section-kind="beforeAfter" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"beforeAfterTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (
            <Reveal key={i} delayMs={i*70} variant="scale"><img src={src} alt="" className="aspect-square w-full object-cover" /></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="priceTable" data-section-kind="priceTable" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"priceTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"packageOneTitle"),getValue(data,"packageOnePrice"),getValue(data,"packageOneText")],[getValue(data,"packageTwoTitle"),getValue(data,"packageTwoPrice"),getValue(data,"packageTwoText")],[getValue(data,"packageThreeTitle"),getValue(data,"packageThreePrice"),getValue(data,"packageThreeText")]].map(([t,p,x], i) => (
            <Reveal key={t} delayMs={i*80} className="t-hover"><div className="text-2xl font-bold text-[var(--p)]">{p}</div><h3 className="mt-2 font-bold">{t}</h3><p className="mt-2 text-sm text-[var(--muted)]">{x}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="serviceFaq" data-section-kind="serviceFaq" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"serviceFaqTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a], i) => (
            <Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></details></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="bookCta" data-section-kind="bookCta" className="px-5 py-16">
      <Reveal className="mx-auto max-w-xl rounded-full bg-[var(--p)] px-8 py-10 text-center text-white">
        <h2 className="t-display text-3xl font-bold">{getValue(data,"bookCtaTitle")}</h2>
        <button type="button" onClick={() => goTo("booking")} className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-bold text-[var(--p)]">{getValue(data,"ctaButton")}</button>
      </Reveal>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="bg-[var(--p)] px-5 py-10 text-center text-white">
      <p className="t-display text-3xl font-bold">{getValue(data,"brandName")}</p>
      <p className="mt-2 text-sm opacity-90">{getValue(data,"address")}</p>
    </footer>
    </>
  );
}

function BookingPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="bookingHero" data-section-kind="bookingHero" className="bg-[var(--bg)] px-5 py-16 text-center">
      <Reveal variant="scale"><p className="text-xs font-bold text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
      <h1 className="t-display t-anim mt-3 text-5xl font-bold text-[var(--p)]">{getValue(data,"bookingHeroTitle")}</h1></Reveal>
    </section>
      <section data-section-kind="booking" data-bizuply-block="booking" data-template-section-type="booking" className="px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-[var(--surface)] p-6 shadow-xl md:p-8">
        <Reveal><h2 className="text-center text-3xl font-bold text-[var(--p)]">{getValue(data,"calendarTitle")}</h2></Reveal>
        <BookingCalendarPanel pill />
      </div>
    </section>
      <section data-template-section-type="servicePicker" data-section-kind="servicePicker" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"servicePickerTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="specialistPicker" data-section-kind="specialistPicker" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"specialistTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="hoursPanel" data-section-kind="hoursPanel" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"hoursTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="policies" data-section-kind="policies" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"policiesTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a], i) => (
            <Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></details></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="confirmationForm" data-section-kind="confirmationForm" className="px-5 py-16">
      <Reveal className="mx-auto max-w-lg rounded-3xl bg-[var(--surface)] p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-[var(--p)]">{getValue(data,"confirmTitle")}</h2>
        <form className="mt-5 grid gap-3" onSubmit={(e)=>e.preventDefault()}>
          <input className="rounded-full border px-5 py-3 text-right outline-none" placeholder="שם מלא" />
          <input className="rounded-full border px-5 py-3 text-right outline-none" placeholder="טלפון" />
          <textarea className="min-h-24 rounded-2xl border px-5 py-3 text-right outline-none" placeholder="הערות" />
          <button type="button" className="rounded-full bg-[var(--p)] py-3 font-bold text-white">{getValue(data,"contactButton")}</button>
        </form>
      </Reveal>
    </section>
      <section data-template-section-type="locationMap" data-section-kind="locationMap" className="px-5 py-16">
      <Reveal className="mx-auto max-w-4xl overflow-hidden rounded-3xl">
        <img src={getValue(data,"mapImage")} alt="" className="t-ken aspect-[21/9] w-full object-cover" />
        <div className="bg-[var(--p)] px-6 py-4 text-white"><h2 className="font-bold">{getValue(data,"locationTitle")}</h2><p className="text-sm opacity-90">{getValue(data,"address")}</p></div>
      </Reveal>
    </section>
      <section data-template-section-type="bookingFaq" data-section-kind="bookingFaq" className="overflow-hidden bg-[var(--surface)] py-12">
      <Reveal><h2 className="t-display px-5 text-center text-4xl font-bold text-[var(--p)]">{getValue(data,"bookingFaqTitle")}</h2></Reveal>
      <div className="t-marquee mt-8 flex gap-6 px-4">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a], i) => (
            <Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></details></Reveal>
          ))}</div>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="bg-[var(--p)] px-5 py-10 text-center text-white">
      <p className="t-display text-3xl font-bold">{getValue(data,"brandName")}</p>
      <p className="mt-2 text-sm opacity-90">{getValue(data,"address")}</p>
    </footer>
    </>
  );
}

export default function NailoraPages(props: NailoraPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...nailoraDefaultData, ...(data ?? {}) }), [data]);
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
    <div dir="rtl" data-template-id={mode === "preview" ? "nailora-preview" : "nailora"} className="min-h-screen w-full overflow-x-hidden" style={{ background: "#FFF8FA", color: "#3D1F2E" }}>
      <style dangerouslySetInnerHTML={{ __html: nailoraEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))}
      />
    </div>
  );
}
