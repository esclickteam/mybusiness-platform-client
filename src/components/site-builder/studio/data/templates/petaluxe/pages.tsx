import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { petaluxeDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { petaluxeEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const petaluxePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "booking", label: "תורים", slug: "/booking" },
];

const allowedPages = petaluxePages.map((p) => p.id);

type PetaluxePagesProps = {
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
  return data?.[key] ?? (petaluxeDefaultData as Record<string, any>)[key] ?? "";
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
    <header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 bg-[var(--bg)]/90 backdrop-blur">
      <div className="mx-auto max-w-5xl px-5 py-5 text-center">
        <button type="button" onClick={() => goTo("home")} className="t-display text-4xl text-[var(--p)]">{getValue(data,"brandName")}</button>
        <nav className="mt-3 flex flex-wrap justify-center gap-5 text-sm">{[{"id":"home","label":getValue(data,"navHome")||"בית"},{"id":"about","label":getValue(data,"navAbout")||"אודות"},{"id":"services","label":getValue(data,"navServices")||"שירותים"},{"id":"booking","label":getValue(data,"navBooking")||"תורים"}].map((p) => (
          <button key={p.id} type="button" onClick={() => goTo(p.id)} className={currentPage===p.id ? "font-bold text-[var(--p)]" : "text-[var(--muted)]"}>{p.label}</button>
        ))}</nav>
      </div>
    </header>
  );
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="hero" data-section-kind="hero" className="relative overflow-hidden bg-[var(--bg)] px-5 pb-20 pt-10 text-center lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[var(--a)]/30 to-transparent" />
      <Reveal variant="fade">
        <p className="text-xs tracking-[0.4em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
        <h1 className="t-display t-anim mx-auto mt-4 max-w-3xl text-6xl leading-tight text-[var(--p)] md:text-7xl">{getValue(data,"brandName")}</h1>
        <p className="t-anim t-d1 mx-auto mt-6 max-w-xl text-lg text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
        <button type="button" onClick={() => goTo("booking")} className="mt-8 bg-[var(--p)] px-10 py-3.5 text-sm font-semibold text-white">{getValue(data,"heroPrimaryButton")}</button>
      </Reveal>
      <Reveal delayMs={150} variant="up">
        <img src={getValue(data,"heroImage")} alt="" className="t-ken mx-auto mt-12 aspect-[21/9] w-full max-w-5xl object-cover" />
      </Reveal>
    </section>
      <section data-template-section-type="servicesPreview" data-section-kind="servicesPreview" className="px-5 py-20 text-center lg:px-8">
      <Reveal><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-8">
        {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
          <Reveal key={title} delayMs={i*90} className="t-hover border border-[var(--a)]/40 bg-[var(--surface)] px-8 py-8">
            <h3 className="t-display text-3xl text-[var(--p)]">{title}</h3>
            <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
      <section data-template-section-type="ritual" data-section-kind="ritual" className="px-5 py-20 text-center lg:px-8">
      <Reveal><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-6">
        {["פגישת היכרות עדינה","בניית לוק אישי","יום האירוע ברוגע"].map((t,i)=>(
          <Reveal key={t} delayMs={i*100} className="t-hover border-y border-[var(--a)] py-6">
            <p className="text-xs tracking-[0.3em] text-[var(--p)]">שלב {i+1}</p>
            <h3 className="t-display mt-2 text-3xl">{t}</h3>
          </Reveal>
        ))}
      </div>
    </section>
      <section data-template-section-type="gallery" data-section-kind="gallery" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (
            <Reveal key={i} delayMs={i*70} variant="scale"><img src={src} alt="" className="aspect-square w-full object-cover" /></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="team" data-section-kind="team" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"sectionFiveTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="testimonials" data-section-kind="testimonials" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"sectionSixTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i*80} className="t-hover"><p className="text-lg leading-8">“{text}”</p><p className="mt-3 text-sm font-bold text-[var(--p)]">{name} · {role}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="packages" data-section-kind="packages" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"packageOneTitle"),getValue(data,"packageOnePrice"),getValue(data,"packageOneText")],[getValue(data,"packageTwoTitle"),getValue(data,"packageTwoPrice"),getValue(data,"packageTwoText")],[getValue(data,"packageThreeTitle"),getValue(data,"packageThreePrice"),getValue(data,"packageThreeText")]].map(([t,p,x], i) => (
            <Reveal key={t} delayMs={i*80} className="t-hover"><div className="text-2xl font-bold text-[var(--p)]">{p}</div><h3 className="mt-2 font-bold">{t}</h3><p className="mt-2 text-sm text-[var(--muted)]">{x}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="whyUs" data-section-kind="whyUs" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"sectionEightTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="bookingTeaser" data-section-kind="bookingTeaser" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"bookingTeaserTitle")}</h2>
      <p className="mx-auto mt-4 max-w-md text-[var(--muted)]">{getValue(data,"ctaText")}</p>
      <button type="button" onClick={() => goTo("booking")} className="mt-8 bg-[var(--p)] px-10 py-3.5 text-sm text-white">{getValue(data,"ctaButton")}</button></Reveal>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="px-5 py-12 text-center lg:px-8">
      <p className="t-display text-4xl text-[var(--p)]">{getValue(data,"brandName")}</p>
      <p className="mt-3 text-sm text-[var(--muted)]">{getValue(data,"phone")} · {getValue(data,"email")}</p>
    </footer>
    </>
  );
}

function AboutPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="aboutHero" data-section-kind="aboutHero" className="bg-gradient-to-b from-[var(--a)]/25 to-[var(--bg)] px-5 py-20 text-center">
      <Reveal variant="fade"><h1 className="t-display text-6xl text-[var(--p)]">{getValue(data,"aboutHeroTitle")}</h1></Reveal>
    </section>
      <section data-template-section-type="story" data-section-kind="story" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"aboutStoryTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="spaceTour" data-section-kind="spaceTour" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"spaceTourTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (
            <Reveal key={i} delayMs={i*70} variant="scale"><img src={src} alt="" className="aspect-square w-full object-cover" /></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="values" data-section-kind="values" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"valuesTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="specialistsDeep" data-section-kind="specialistsDeep" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"specialistsTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="certifications" data-section-kind="certifications" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"certsTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="timeline" data-section-kind="timeline" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"timelineTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="pressQuotes" data-section-kind="pressQuotes" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"pressTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i*80} className="t-hover"><p className="text-lg leading-8">“{text}”</p><p className="mt-3 text-sm font-bold text-[var(--p)]">{name} · {role}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="aboutCta" data-section-kind="aboutCta" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"aboutCtaTitle")}</h2>
      <p className="mx-auto mt-4 max-w-md text-[var(--muted)]">{getValue(data,"ctaText")}</p>
      <button type="button" onClick={() => goTo("booking")} className="mt-8 bg-[var(--p)] px-10 py-3.5 text-sm text-white">{getValue(data,"ctaButton")}</button></Reveal>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="px-5 py-12 text-center lg:px-8">
      <p className="t-display text-4xl text-[var(--p)]">{getValue(data,"brandName")}</p>
      <p className="mt-3 text-sm text-[var(--muted)]">{getValue(data,"phone")} · {getValue(data,"email")}</p>
    </footer>
    </>
  );
}

function ServicesPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="servicesHero" data-section-kind="servicesHero" className="bg-gradient-to-b from-[var(--a)]/25 to-[var(--bg)] px-5 py-20 text-center">
      <Reveal variant="fade"><h1 className="t-display text-6xl text-[var(--p)]">{getValue(data,"servicesHeroTitle")}</h1></Reveal>
    </section>
      <section data-template-section-type="catalog" data-section-kind="catalog" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"catalogTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="featuredTreatment" data-section-kind="featuredTreatment" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"featuredTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="durationGuide" data-section-kind="durationGuide" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"durationTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="addons" data-section-kind="addons" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"addonsTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="beforeAfter" data-section-kind="beforeAfter" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"beforeAfterTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (
            <Reveal key={i} delayMs={i*70} variant="scale"><img src={src} alt="" className="aspect-square w-full object-cover" /></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="priceTable" data-section-kind="priceTable" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"priceTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"packageOneTitle"),getValue(data,"packageOnePrice"),getValue(data,"packageOneText")],[getValue(data,"packageTwoTitle"),getValue(data,"packageTwoPrice"),getValue(data,"packageTwoText")],[getValue(data,"packageThreeTitle"),getValue(data,"packageThreePrice"),getValue(data,"packageThreeText")]].map(([t,p,x], i) => (
            <Reveal key={t} delayMs={i*80} className="t-hover"><div className="text-2xl font-bold text-[var(--p)]">{p}</div><h3 className="mt-2 font-bold">{t}</h3><p className="mt-2 text-sm text-[var(--muted)]">{x}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="serviceFaq" data-section-kind="serviceFaq" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"serviceFaqTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a], i) => (
            <Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></details></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="bookCta" data-section-kind="bookCta" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"bookCtaTitle")}</h2>
      <p className="mx-auto mt-4 max-w-md text-[var(--muted)]">{getValue(data,"ctaText")}</p>
      <button type="button" onClick={() => goTo("booking")} className="mt-8 bg-[var(--p)] px-10 py-3.5 text-sm text-white">{getValue(data,"ctaButton")}</button></Reveal>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="px-5 py-12 text-center lg:px-8">
      <p className="t-display text-4xl text-[var(--p)]">{getValue(data,"brandName")}</p>
      <p className="mt-3 text-sm text-[var(--muted)]">{getValue(data,"phone")} · {getValue(data,"email")}</p>
    </footer>
    </>
  );
}

function BookingPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="bookingHero" data-section-kind="bookingHero" className="bg-gradient-to-b from-[var(--a)]/25 to-[var(--bg)] px-5 py-20 text-center">
      <Reveal variant="fade"><h1 className="t-display text-6xl text-[var(--p)]">{getValue(data,"bookingHeroTitle")}</h1></Reveal>
    </section>
      <section data-section-kind="booking" data-bizuply-block="booking" data-template-section-type="booking" className="px-5 py-20 text-center lg:px-8">
      <Reveal><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"calendarTitle")}</h2></Reveal>
      <div className="mx-auto mt-8 max-w-3xl text-right"><BookingCalendarPanel /></div>
    </section>
      <section data-template-section-type="servicePicker" data-section-kind="servicePicker" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"servicePickerTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="specialistPicker" data-section-kind="specialistPicker" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"specialistTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="hoursPanel" data-section-kind="hoursPanel" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"hoursTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="policies" data-section-kind="policies" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"policiesTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a], i) => (
            <Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></details></Reveal>
          ))}</div>
    </section>
      <section data-template-section-type="confirmationForm" data-section-kind="confirmationForm" className="px-5 py-20 text-center lg:px-8">
      <Reveal><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"confirmTitle")}</h2>
        <form className="mx-auto mt-8 grid max-w-md gap-3 text-right" onSubmit={(e)=>e.preventDefault()}>
          <input className="border border-[var(--a)] px-4 py-3 outline-none" placeholder="שם מלא" />
          <input className="border border-[var(--a)] px-4 py-3 outline-none" placeholder="טלפון" />
          <textarea className="min-h-28 border border-[var(--a)] px-4 py-3 outline-none" placeholder="הערות ליום האירוע" />
          <button type="button" className="bg-[var(--p)] py-3.5 text-white">{getValue(data,"contactButton")}</button>
        </form></Reveal>
    </section>
      <section data-template-section-type="locationMap" data-section-kind="locationMap" className="px-5 py-16 text-center lg:px-8">
      <Reveal><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"locationTitle")}</h2>
      <p className="mt-3">{getValue(data,"address")}</p>
      <img src={getValue(data,"mapImage")} alt="" className="t-ken mx-auto mt-8 aspect-[16/7] w-full max-w-4xl object-cover" /></Reveal>
    </section>
      <section data-template-section-type="bookingFaq" data-section-kind="bookingFaq" className="px-5 py-20 text-center lg:px-8">
      <Reveal variant="fade"><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"bookingFaqTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a], i) => (
            <Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></details></Reveal>
          ))}</div>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="px-5 py-12 text-center lg:px-8">
      <p className="t-display text-4xl text-[var(--p)]">{getValue(data,"brandName")}</p>
      <p className="mt-3 text-sm text-[var(--muted)]">{getValue(data,"phone")} · {getValue(data,"email")}</p>
    </footer>
    </>
  );
}

export default function PetaluxePages(props: PetaluxePagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...petaluxeDefaultData, ...(data ?? {}) }), [data]);
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
    <div dir="rtl" data-template-id={mode === "preview" ? "petaluxe-preview" : "petaluxe"} className="min-h-screen w-full overflow-x-hidden" style={{ background: "#FFF5F9", color: "#4A044E" }}>
      <style dangerouslySetInnerHTML={{ __html: petaluxeEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))}
      />
    </div>
  );
}
