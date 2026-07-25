import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { dermaraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { dermaraEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const dermaraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "booking", label: "תורים", slug: "/booking" },
];

const allowedPages = dermaraPages.map((p) => p.id);

type DermaraPagesProps = {
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
  return data?.[key] ?? (dermaraDefaultData as Record<string, any>)[key] ?? "";
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
    <header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 bg-[var(--surface)] shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--p)] t-pulse" />
          <span className="t-display text-xl font-bold">{getValue(data,"brandName")}</span>
        </button>
        <nav className="hidden gap-6 text-sm font-semibold text-[var(--muted)] md:flex">{[{"id":"home","label":getValue(data,"navHome")||"בית"},{"id":"about","label":getValue(data,"navAbout")||"אודות"},{"id":"services","label":getValue(data,"navServices")||"שירותים"},{"id":"booking","label":getValue(data,"navBooking")||"תורים"}].map((p) => (
          <button key={p.id} type="button" onClick={() => goTo(p.id)} className={currentPage===p.id ? "font-bold text-[var(--p)]" : "text-[var(--muted)]"}>{p.label}</button>
        ))}</nav>
        <button type="button" onClick={() => goTo("booking")} className="rounded-lg bg-[var(--p)] px-5 py-2.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>
  );
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="hero" data-section-kind="hero" className="bg-[var(--bg)] px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[var(--surface)] shadow-xl">
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-12">
            <Reveal>
              <p className="text-sm font-semibold text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
              <h1 className="t-display t-anim mt-3 text-4xl font-bold md:text-5xl">{getValue(data,"heroTitle")}</h1>
              <p className="t-anim t-d1 mt-4 text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
              <button type="button" onClick={() => goTo("booking")} className="t-pulse mt-8 w-fit rounded-xl bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
            </Reveal>
          </div>
          <img src={getValue(data,"heroImage")} alt="" className="t-ken h-full min-h-[360px] w-full object-cover" />
        </div>
      </div>
    </section>
      <section data-template-section-type="servicesPreview" data-section-kind="servicesPreview" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl border border-[var(--p)]/20 bg-[var(--surface)] p-8 md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold md:text-4xl">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover rounded-2xl bg-[var(--bg)] p-5">
              <div className="text-2xl font-bold text-[var(--p)]">{["45׳","60׳","90׳"][i]}</div>
              <h3 className="mt-2 font-bold">{title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
      <section data-template-section-type="ritual" data-section-kind="ritual" className="bg-[var(--bg)] px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[["צ׳ק־אין","10 דק׳"],["טיפול ליבה","45–90 דק׳"],["אפטרקר","5 דק׳"]].map(([t,m],i)=>(
            <Reveal key={t} delayMs={i*80} className="t-hover rounded-2xl border border-[var(--p)]/20 p-5">
              <p className="text-xs font-bold text-[var(--p)]">{m}</p>
              <h3 className="mt-2 text-xl font-bold">{t}</h3>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
      <section data-template-section-type="gallery" data-section-kind="gallery" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"sectionFourTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (
            <Reveal key={i} delayMs={i*70} variant="scale"><img src={src} alt="" className="aspect-square w-full object-cover" /></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="team" data-section-kind="team" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"sectionFiveTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="testimonials" data-section-kind="testimonials" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"sectionSixTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i*80} className="t-hover"><p className="text-lg leading-8">“{text}”</p><p className="mt-3 text-sm font-bold text-[var(--p)]">{name} · {role}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="packages" data-section-kind="packages" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"packageOneTitle"),getValue(data,"packageOnePrice"),getValue(data,"packageOneText")],[getValue(data,"packageTwoTitle"),getValue(data,"packageTwoPrice"),getValue(data,"packageTwoText")],[getValue(data,"packageThreeTitle"),getValue(data,"packageThreePrice"),getValue(data,"packageThreeText")]].map(([t,p,x], i) => (
            <Reveal key={t} delayMs={i*80} className="t-hover"><div className="text-2xl font-bold text-[var(--p)]">{p}</div><h3 className="mt-2 font-bold">{t}</h3><p className="mt-2 text-sm text-[var(--muted)]">{x}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="whyUs" data-section-kind="whyUs" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"sectionEightTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="bookingTeaser" data-section-kind="bookingTeaser" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-[var(--p)]/20 bg-[var(--surface)] p-10 text-center shadow">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"bookingTeaserTitle")}</h2>
        <button type="button" onClick={() => goTo("booking")} className="t-pulse mt-6 rounded-xl bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">{getValue(data,"ctaButton")}</button></Reveal>
      </div>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="bg-[var(--surface)] px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <span className="font-bold">{getValue(data,"brandName")}</span>
        <span className="text-sm text-[var(--muted)]">{getValue(data,"email")} · {getValue(data,"phone")}</span>
      </div>
    </footer>
    </>
  );
}

function AboutPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="aboutHero" data-section-kind="aboutHero" className="px-5 py-14 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] px-8 py-14 shadow">
        <Reveal><h1 className="t-display text-4xl font-bold md:text-5xl">{getValue(data,"aboutHeroTitle")}</h1>
        <p className="mt-4 text-[var(--muted)]">{getValue(data,"ctaText")}</p></Reveal>
      </div>
    </section>
      <section data-template-section-type="story" data-section-kind="story" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"aboutStoryTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="spaceTour" data-section-kind="spaceTour" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"spaceTourTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (
            <Reveal key={i} delayMs={i*70} variant="scale"><img src={src} alt="" className="aspect-square w-full object-cover" /></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="values" data-section-kind="values" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"valuesTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="specialistsDeep" data-section-kind="specialistsDeep" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"specialistsTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="certifications" data-section-kind="certifications" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"certsTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="timeline" data-section-kind="timeline" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"timelineTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="pressQuotes" data-section-kind="pressQuotes" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"pressTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text, name, role], i) => (
            <Reveal key={name} delayMs={i*80} className="t-hover"><p className="text-lg leading-8">“{text}”</p><p className="mt-3 text-sm font-bold text-[var(--p)]">{name} · {role}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="aboutCta" data-section-kind="aboutCta" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-[var(--p)]/20 bg-[var(--surface)] p-10 text-center shadow">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"aboutCtaTitle")}</h2>
        <button type="button" onClick={() => goTo("booking")} className="t-pulse mt-6 rounded-xl bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">{getValue(data,"ctaButton")}</button></Reveal>
      </div>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="bg-[var(--surface)] px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <span className="font-bold">{getValue(data,"brandName")}</span>
        <span className="text-sm text-[var(--muted)]">{getValue(data,"email")} · {getValue(data,"phone")}</span>
      </div>
    </footer>
    </>
  );
}

function ServicesPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="servicesHero" data-section-kind="servicesHero" className="px-5 py-14 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] px-8 py-14 shadow">
        <Reveal><h1 className="t-display text-4xl font-bold md:text-5xl">{getValue(data,"servicesHeroTitle")}</h1>
        <p className="mt-4 text-[var(--muted)]">{getValue(data,"ctaText")}</p></Reveal>
      </div>
    </section>
      <section data-template-section-type="catalog" data-section-kind="catalog" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"catalogTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="featuredTreatment" data-section-kind="featuredTreatment" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"featuredTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="durationGuide" data-section-kind="durationGuide" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"durationTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="addons" data-section-kind="addons" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"addonsTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="beforeAfter" data-section-kind="beforeAfter" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"beforeAfterTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (
            <Reveal key={i} delayMs={i*70} variant="scale"><img src={src} alt="" className="aspect-square w-full object-cover" /></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="priceTable" data-section-kind="priceTable" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"priceTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"packageOneTitle"),getValue(data,"packageOnePrice"),getValue(data,"packageOneText")],[getValue(data,"packageTwoTitle"),getValue(data,"packageTwoPrice"),getValue(data,"packageTwoText")],[getValue(data,"packageThreeTitle"),getValue(data,"packageThreePrice"),getValue(data,"packageThreeText")]].map(([t,p,x], i) => (
            <Reveal key={t} delayMs={i*80} className="t-hover"><div className="text-2xl font-bold text-[var(--p)]">{p}</div><h3 className="mt-2 font-bold">{t}</h3><p className="mt-2 text-sm text-[var(--muted)]">{x}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="serviceFaq" data-section-kind="serviceFaq" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"serviceFaqTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a], i) => (
            <Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></details></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="bookCta" data-section-kind="bookCta" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-[var(--p)]/20 bg-[var(--surface)] p-10 text-center shadow">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"bookCtaTitle")}</h2>
        <button type="button" onClick={() => goTo("booking")} className="t-pulse mt-6 rounded-xl bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">{getValue(data,"ctaButton")}</button></Reveal>
      </div>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="bg-[var(--surface)] px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <span className="font-bold">{getValue(data,"brandName")}</span>
        <span className="text-sm text-[var(--muted)]">{getValue(data,"email")} · {getValue(data,"phone")}</span>
      </div>
    </footer>
    </>
  );
}

function BookingPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="bookingHero" data-section-kind="bookingHero" className="px-5 py-14 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] px-8 py-14 shadow">
        <Reveal><h1 className="t-display text-4xl font-bold md:text-5xl">{getValue(data,"bookingHeroTitle")}</h1>
        <p className="mt-4 text-[var(--muted)]">{getValue(data,"ctaText")}</p></Reveal>
      </div>
    </section>
      <section data-section-kind="booking" data-bizuply-block="booking" data-template-section-type="booking" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-[var(--p)]/20 bg-[var(--surface)] p-6 shadow md:p-10">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"calendarTitle")}</h2></Reveal>
        <BookingCalendarPanel />
      </div>
    </section>
      <section data-template-section-type="servicePicker" data-section-kind="servicePicker" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"servicePickerTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="specialistPicker" data-section-kind="specialistPicker" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"specialistTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]].map(([title, text], i) => (
            <Reveal key={title} delayMs={i*80} className="t-hover"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="hoursPanel" data-section-kind="hoursPanel" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"hoursTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n,l], i) => (
            <Reveal key={l} delayMs={i*90} variant="scale" className="t-float text-center"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="policies" data-section-kind="policies" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"policiesTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a], i) => (
            <Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></details></Reveal>
          ))}</div>
      </div>
    </section>
      <section data-template-section-type="confirmationForm" data-section-kind="confirmationForm" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-xl rounded-3xl bg-[var(--surface)] p-8 shadow">
        <Reveal><h2 className="text-2xl font-bold">{getValue(data,"confirmTitle")}</h2>
        <form className="mt-5 grid gap-3" onSubmit={(e)=>e.preventDefault()}>
          <input className="rounded-xl border px-4 py-3 text-right outline-none" placeholder="שם מלא" />
          <input className="rounded-xl border px-4 py-3 text-right outline-none" placeholder="טלפון" />
          <textarea className="min-h-28 rounded-xl border px-4 py-3 text-right outline-none" placeholder="הערות לטיפול" />
          <button type="button" className="rounded-xl bg-[var(--p)] py-3.5 font-bold text-white">{getValue(data,"contactButton")}</button>
        </form></Reveal>
      </div>
    </section>
      <section data-template-section-type="locationMap" data-section-kind="locationMap" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-6 shadow md:p-8">
        <Reveal className="grid gap-6 md:grid-cols-2 md:items-center">
          <div><h2 className="t-display text-3xl font-bold">{getValue(data,"locationTitle")}</h2><p className="mt-3 text-[var(--muted)]">{getValue(data,"address")}</p></div>
          <img src={getValue(data,"mapImage")} alt="" className="t-ken aspect-video w-full rounded-2xl object-cover" />
        </Reveal>
      </div>
    </section>
      <section data-template-section-type="bookingFaq" data-section-kind="bookingFaq" className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--surface)] p-8 shadow-lg md:p-12">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"bookingFaqTitle")}</h2></Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q,a], i) => (
            <Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></details></Reveal>
          ))}</div>
      </div>
    </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="bg-[var(--surface)] px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <span className="font-bold">{getValue(data,"brandName")}</span>
        <span className="text-sm text-[var(--muted)]">{getValue(data,"email")} · {getValue(data,"phone")}</span>
      </div>
    </footer>
    </>
  );
}

export default function DermaraPages(props: DermaraPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...dermaraDefaultData, ...(data ?? {}) }), [data]);
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
    <div dir="rtl" data-template-id={mode === "preview" ? "dermara-preview" : "dermara"} className="min-h-screen w-full overflow-x-hidden" style={{ background: "#F7FFFD", color: "#134E4A" }}>
      <style dangerouslySetInnerHTML={{ __html: dermaraEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))}
      />
    </div>
  );
}
