import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { blushlabDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { blushlabEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const blushlabPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "booking", label: "תורים", slug: "/booking" },
];

const allowedPages = blushlabPages.map((p) => p.id);

type BlushlabPagesProps = {
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
  return data?.[key] ?? (blushlabDefaultData as Record<string, any>)[key] ?? "";
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
    <header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-end justify-between px-5 py-6 lg:px-8">
        <div>
          <button type="button" onClick={() => goTo("home")} className="t-display text-4xl text-white">{getValue(data,"brandName")}</button>
          <p className="mt-1 text-xs tracking-[0.3em] text-[var(--a)]">{getValue(data,"heroEyebrow")}</p>
        </div>
        <nav className="hidden gap-5 text-sm text-white/80 lg:flex">{[{"id":"home","label":getValue(data,"navHome")||"בית"},{"id":"about","label":getValue(data,"navAbout")||"אודות"},{"id":"services","label":getValue(data,"navServices")||"שירותים"},{"id":"booking","label":getValue(data,"navBooking")||"תורים"}].map((p) => (
          <button key={p.id} type="button" onClick={() => goTo(p.id)} className={currentPage===p.id ? "font-bold text-[var(--p)]" : "text-[var(--muted)]"}>{p.label}</button>
        ))}</nav>
        <button type="button" onClick={() => goTo("booking")} className="border border-white/40 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>
  );
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="hero" data-section-kind="hero" className="relative min-h-[92svh] overflow-hidden bg-[var(--bg)]">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,transparent,var(--dark)_70%)]" />
      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-4xl flex-col items-center justify-center px-5 text-center">
        <Reveal variant="scale">
          <h1 className="t-display t-anim text-6xl text-white md:text-8xl">{getValue(data,"brandName")}</h1>
          <p className="t-anim t-d1 mx-auto mt-6 max-w-lg text-lg text-white/80">{getValue(data,"heroSubtitle")}</p>
          <button type="button" onClick={() => goTo("booking")} className="t-glow mt-10 border border-[var(--a)] bg-[var(--p)] px-10 py-4 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
        </Reveal>
      </div>
    </section>
      <section data-template-section-type="servicesPreview" data-section-kind="servicesPreview" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
        <div className="space-y-4">
          {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*70} variant="left" className="t-hover grid gap-2 border-t border-[var(--p)]/30 py-6 md:grid-cols-[1fr_2fr]">
              <h3 className="t-display text-2xl">{title}</h3>
              <p className="text-[var(--muted)]">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
      <section data-template-section-type="ritual" data-section-kind="ritual" className="px-5 py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <Reveal><img src={getValue(data,"sectionImage")} alt="" className="t-ken aspect-[4/5] w-full object-cover" /></Reveal>
        <div>
          <Reveal><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
          <ol className="mt-10 space-y-8 border-r border-[var(--p)]/40 pr-6">
            {["שיחת קצרה על הצרכים","בחירת פרוטוקול","ביצוע מדויק","הנחיות המשך"].map((t,i)=>(
              <Reveal key={t} delayMs={i*80} variant="right"><li className="text-lg"><span className="text-[var(--p)]">— </span>{t}</li></Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
      <section data-template-section-type="gallery" data-section-kind="gallery" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
        <div className="space-y-4">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (
            <Reveal key={i} delayMs={i*70} variant="scale"><img src={src} alt="" className="aspect-square w-full object-cover" /></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="team" data-section-kind="team" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"sectionFiveTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="testimonials" data-section-kind="testimonials" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"sectionSixTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i*80} className="t-hover"><p className="text-lg leading-8">“{text}”</p><p className="mt-3 text-sm font-bold text-[var(--p)]">{name} · {role}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="packages" data-section-kind="packages" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"packageOneTitle"),getValue(data,"packageOnePrice"),getValue(data,"packageOneText")],[getValue(data,"packageTwoTitle"),getValue(data,"packageTwoPrice"),getValue(data,"packageTwoText")],[getValue(data,"packageThreeTitle"),getValue(data,"packageThreePrice"),getValue(data,"packageThreeText")]].map(([t,p,x], i) => (
            <Reveal key={t} delayMs={i*80} className="t-hover"><div className="text-2xl font-bold text-[var(--p)]">{p}</div><h3 className="mt-2 font-bold">{t}</h3><p className="mt-2 text-sm text-[var(--muted)]">{x}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="whyUs" data-section-kind="whyUs" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"sectionEightTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="bookingTeaser" data-section-kind="bookingTeaser" className="relative overflow-hidden px-5 py-24 lg:px-8">
      <img src={getValue(data,"sectionImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal><h2 className="t-display text-5xl text-white">{getValue(data,"bookingTeaserTitle")}</h2>
        <button type="button" onClick={() => goTo("booking")} className="mt-8 border border-white px-8 py-3 text-sm text-white">{getValue(data,"ctaButton")}</button></Reveal>
      </div>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="px-5 py-14 text-center lg:px-8">
      <p className="t-display text-4xl text-[var(--p)]">{getValue(data,"brandName")}</p>
      <p className="mt-3 text-xs tracking-[0.3em] text-[var(--muted)]">{getValue(data,"email")}</p>
    </footer>
    </>
  );
}

function AboutPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="aboutHero" data-section-kind="aboutHero" className="border-b border-[var(--p)]/20 px-5 py-20 lg:px-8">
      <Reveal variant="right"><h1 className="t-display max-w-3xl text-6xl text-[var(--p)]">{getValue(data,"aboutHeroTitle")}</h1>
      <p className="mt-4 max-w-xl text-[var(--muted)]">{getValue(data,"aboutStoryText")}</p></Reveal>
    </section>
      <section data-template-section-type="story" data-section-kind="story" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"aboutStoryTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="spaceTour" data-section-kind="spaceTour" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"spaceTourTitle")}</h2></Reveal>
        <div className="space-y-4">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (
            <Reveal key={i} delayMs={i*70} variant="scale"><img src={src} alt="" className="aspect-square w-full object-cover" /></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="values" data-section-kind="values" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"valuesTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="specialistsDeep" data-section-kind="specialistsDeep" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"specialistsTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="certifications" data-section-kind="certifications" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"certsTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="timeline" data-section-kind="timeline" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"timelineTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="pressQuotes" data-section-kind="pressQuotes" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"pressTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i*80} className="t-hover"><p className="text-lg leading-8">“{text}”</p><p className="mt-3 text-sm font-bold text-[var(--p)]">{name} · {role}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="aboutCta" data-section-kind="aboutCta" className="relative overflow-hidden px-5 py-24 lg:px-8">
      <img src={getValue(data,"sectionImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal><h2 className="t-display text-5xl text-white">{getValue(data,"aboutCtaTitle")}</h2>
        <button type="button" onClick={() => goTo("booking")} className="mt-8 border border-white px-8 py-3 text-sm text-white">{getValue(data,"ctaButton")}</button></Reveal>
      </div>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="px-5 py-14 text-center lg:px-8">
      <p className="t-display text-4xl text-[var(--p)]">{getValue(data,"brandName")}</p>
      <p className="mt-3 text-xs tracking-[0.3em] text-[var(--muted)]">{getValue(data,"email")}</p>
    </footer>
    </>
  );
}

function ServicesPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="servicesHero" data-section-kind="servicesHero" className="border-b border-[var(--p)]/20 px-5 py-20 lg:px-8">
      <Reveal variant="right"><h1 className="t-display max-w-3xl text-6xl text-[var(--p)]">{getValue(data,"servicesHeroTitle")}</h1>
      <p className="mt-4 max-w-xl text-[var(--muted)]">{getValue(data,"aboutStoryText")}</p></Reveal>
    </section>
      <section data-template-section-type="catalog" data-section-kind="catalog" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"catalogTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="featuredTreatment" data-section-kind="featuredTreatment" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"featuredTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="durationGuide" data-section-kind="durationGuide" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"durationTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="addons" data-section-kind="addons" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"addonsTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="beforeAfter" data-section-kind="beforeAfter" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"beforeAfterTitle")}</h2></Reveal>
        <div className="space-y-4">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (
            <Reveal key={i} delayMs={i*70} variant="scale"><img src={src} alt="" className="aspect-square w-full object-cover" /></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="priceTable" data-section-kind="priceTable" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"priceTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"packageOneTitle"),getValue(data,"packageOnePrice"),getValue(data,"packageOneText")],[getValue(data,"packageTwoTitle"),getValue(data,"packageTwoPrice"),getValue(data,"packageTwoText")],[getValue(data,"packageThreeTitle"),getValue(data,"packageThreePrice"),getValue(data,"packageThreeText")]].map(([t,p,x], i) => (
            <Reveal key={t} delayMs={i*80} className="t-hover"><div className="text-2xl font-bold text-[var(--p)]">{p}</div><h3 className="mt-2 font-bold">{t}</h3><p className="mt-2 text-sm text-[var(--muted)]">{x}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="serviceFaq" data-section-kind="serviceFaq" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"serviceFaqTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a], i) => (
            <Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></details></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="bookCta" data-section-kind="bookCta" className="relative overflow-hidden px-5 py-24 lg:px-8">
      <img src={getValue(data,"sectionImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal><h2 className="t-display text-5xl text-white">{getValue(data,"bookCtaTitle")}</h2>
        <button type="button" onClick={() => goTo("booking")} className="mt-8 border border-white px-8 py-3 text-sm text-white">{getValue(data,"ctaButton")}</button></Reveal>
      </div>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="px-5 py-14 text-center lg:px-8">
      <p className="t-display text-4xl text-[var(--p)]">{getValue(data,"brandName")}</p>
      <p className="mt-3 text-xs tracking-[0.3em] text-[var(--muted)]">{getValue(data,"email")}</p>
    </footer>
    </>
  );
}

function BookingPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="bookingHero" data-section-kind="bookingHero" className="border-b border-[var(--p)]/20 px-5 py-20 lg:px-8">
      <Reveal variant="right"><h1 className="t-display max-w-3xl text-6xl text-[var(--p)]">{getValue(data,"bookingHeroTitle")}</h1>
      <p className="mt-4 max-w-xl text-[var(--muted)]">{getValue(data,"aboutStoryText")}</p></Reveal>
    </section>
      <section data-section-kind="booking" data-bizuply-block="booking" data-template-section-type="booking" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal><h2 className="t-display text-5xl text-[var(--p)]">{getValue(data,"calendarTitle")}</h2><p className="mt-4 text-[var(--muted)]">{getValue(data,"ctaText")}</p></Reveal>
        <BookingCalendarPanel />
      </div>
    </section>
      <section data-template-section-type="servicePicker" data-section-kind="servicePicker" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"servicePickerTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="specialistPicker" data-section-kind="specialistPicker" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"specialistTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="hoursPanel" data-section-kind="hoursPanel" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"hoursTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="policies" data-section-kind="policies" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"policiesTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a], i) => (
            <Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></details></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="confirmationForm" data-section-kind="confirmationForm" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <Reveal><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"confirmTitle")}</h2><p className="mt-3 text-[var(--muted)]">{getValue(data,"contactText")}</p></Reveal>
        <Reveal delayMs={100}><form className="grid gap-3" onSubmit={(e)=>e.preventDefault()}>
          <input className="border-b border-[var(--p)]/40 bg-transparent py-3 text-right outline-none" placeholder="שם מלא" />
          <input className="border-b border-[var(--p)]/40 bg-transparent py-3 text-right outline-none" placeholder="טלפון" />
          <textarea className="min-h-28 border-b border-[var(--p)]/40 bg-transparent py-3 text-right outline-none" placeholder="הערות" />
          <button type="button" className="mt-2 bg-[var(--p)] py-3.5 text-sm font-bold text-white">{getValue(data,"contactButton")}</button>
        </form></Reveal>
      </div>
    </section>
      <section data-template-section-type="locationMap" data-section-kind="locationMap" className="px-5 py-20 text-center lg:px-8">
      <Reveal><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"locationTitle")}</h2>
      <p className="mt-3 text-[var(--muted)]">{getValue(data,"address")}</p>
      <img src={getValue(data,"mapImage")} alt="" className="t-ken mx-auto mt-8 aspect-video max-w-3xl object-cover" /></Reveal>
    </section>
      <section data-template-section-type="bookingFaq" data-section-kind="bookingFaq" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><h2 className="t-display sticky top-28 text-5xl text-[var(--p)]">{getValue(data,"bookingFaqTitle")}</h2></Reveal>
        <div className="space-y-4">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a], i) => (
            <Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></details></Reveal>
          ))}</div>
      </div>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="px-5 py-14 text-center lg:px-8">
      <p className="t-display text-4xl text-[var(--p)]">{getValue(data,"brandName")}</p>
      <p className="mt-3 text-xs tracking-[0.3em] text-[var(--muted)]">{getValue(data,"email")}</p>
    </footer>
    </>
  );
}

export default function BlushlabPages(props: BlushlabPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...blushlabDefaultData, ...(data ?? {}) }), [data]);
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
    <div dir="rtl" data-template-id={mode === "preview" ? "blushlab-preview" : "blushlab"} className="min-h-screen w-full overflow-x-hidden" style={{ background: "#14080C", color: "#FFF1F2" }}>
      <style dangerouslySetInnerHTML={{ __html: blushlabEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))}
      />
    </div>
  );
}
