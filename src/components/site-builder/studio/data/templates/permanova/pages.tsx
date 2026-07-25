import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { permanovaDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { permanovaEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const permanovaPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "booking", label: "תורים", slug: "/booking" },
];

const allowedPages = permanovaPages.map((p) => p.id);

type PermanovaPagesProps = {
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
  return data?.[key] ?? (permanovaDefaultData as Record<string, any>)[key] ?? "";
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
    <header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="absolute inset-x-0 top-0 z-50 beauty-inkPMU-header-v2 bg-[var(--dark)]/90 text-[var(--secondary)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-6 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="justify-self-start t-display text-4xl">{getValue(data,"brandName")}</button>
        <nav className="hidden justify-self-center gap-5 text-sm lg:flex">{[{"id":"home","label":getValue(data,"navHome")||"בית"},{"id":"about","label":getValue(data,"navAbout")||"אודות"},{"id":"services","label":getValue(data,"navServices")||"שירותים"},{"id":"booking","label":getValue(data,"navBooking")||"תורים"}].map((p) => (<button key={p.id} type="button" onClick={() => goTo(p.id)} className={currentPage===p.id ? "font-bold text-[var(--p)]" : "text-white/75"}>{p.label}</button>))}</nav>
        <button type="button" onClick={() => goTo("booking")} className="justify-self-end px-5 py-2 text-xs font-bold uppercase tracking-widest border border-[var(--p)] bg-[var(--p)] text-white">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>
  );
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="hero" data-section-kind="hero" className="beauty-inkPMU-hero-v12 bg-[var(--dark)] px-5 py-16 text-[var(--text)] lg:px-8"><div className="mx-auto max-w-7xl"><Reveal><p className="text-xs font-bold uppercase tracking-[0.4em] text-[var(--a)]">PMU</p><h1 className="t-display mt-4 max-w-4xl whitespace-pre-line text-5xl leading-tight md:text-7xl">{getValue(data,"heroTitle")}</h1></Reveal><div className="mt-10 grid gap-4 lg:grid-cols-[0.8fr_1.2fr_0.7fr]"><img src={getValue(data,"itemOneImage")} alt="" className="h-72 w-full object-cover lg:mt-20" /><img src={getValue(data,"heroImage")} alt="" className="t-ken h-[560px] w-full object-cover" /><div className="flex flex-col justify-between gap-6"><p className="leading-8 text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p><button type="button" onClick={() => goTo("booking")} className="border border-[var(--p)] px-7 py-3.5 text-sm font-bold text-[var(--p)]">{getValue(data,"heroPrimaryButton")}</button><img src={getValue(data,"galleryImage3")} alt="" className="h-48 w-full object-cover" /></div></div></div></section>
      <section data-template-section-type="servicesPreview" data-section-kind="servicesPreview" className="beauty-inkPMU-servicesPreview-frame-2 overflow-hidden px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[3rem] border border-[var(--p)]/25 bg-[var(--surface)] px-6 py-14 shadow-2xl md:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / servicesPreview</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"sectionTwoTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"servicesIntroText")}</p></Reveal><div className="mt-10 grid gap-4 md:grid-cols-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText"),"45-75 דק׳",getValue(data,"itemOneImage")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText"),"60-90 דק׳",getValue(data,"itemTwoImage")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText"),"30-60 דק׳",getValue(data,"itemThreeImage")]].map(([title, text, minutes, image], i) => (<Reveal key={title} delayMs={i*80} className="t-hover overflow-hidden border border-[var(--p)]/25 bg-[var(--surface)]/70"><img src={image} alt="" className="h-48 w-full object-cover" /><div className="p-6"><p className="text-xs font-bold text-[var(--p)]">{minutes}</p><h3 className="mt-3 text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{text}</p></div></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="ritual" data-section-kind="ritual" className="beauty-inkPMU-ritual-frame-3 px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div className="order-2 md:order-1"><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"sectionThreeTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"aboutStoryText")}</p></Reveal><div className="mt-10 grid gap-4 md:grid-cols-4">{[["01","שיחה","מגדירות מטרה, רגישויות וסגנון אישי."],["02","הכנה","ניקוי, התאמה ובדיקת נוחות לפני תחילת הטיפול."],["03","ביצוע","עבודה מדויקת בקצב רגוע עם חומרי פרימיום."],["04","המשך","הנחיות בית ותיאום ביקורת לפי הצורך."]].map(([n,title,text], i) => (<Reveal key={n} delayMs={i*70} className="t-hover border-r-2 border-[var(--p)] bg-[var(--surface)]/70 p-5"><span className="text-sm font-bold text-[var(--p)]">{n}</span><h3 className="mt-2 font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>))}</div></div>
          <div className="order-1 flex items-start justify-between border-r-4 border-[var(--p)] pr-5 md:order-2"><div><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / ritual</p></div><span className="text-xs text-[var(--muted)]">חדר פיגמנט</span></div>
        </div>
      </section>
      <section data-template-section-type="gallery" data-section-kind="gallery" className="beauty-inkPMU-gallery-frame-4 relative overflow-hidden bg-[var(--dark)] px-5 py-24 text-[var(--text)] lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--p)_18%,transparent),transparent)]" />
        <div className="relative mx-auto max-w-7xl border border-[var(--p)]/45 p-6 shadow-[0_0_44px_color-mix(in_srgb,var(--p)_18%,transparent)] md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / gallery</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"sectionFourTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"spaceTourText")}</p></Reveal><div className="mt-10 grid gap-4 md:grid-cols-4">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (<Reveal key={i} delayMs={i*70} variant="scale" className={i===0 ? "md:col-span-2 md:row-span-2" : ""}><img src={src} alt="" className="t-ken h-full min-h-[240px] w-full object-cover" /></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="team" data-section-kind="team" className="beauty-inkPMU-team-frame-5 bg-[var(--bg)] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[var(--p)]/20 bg-[var(--surface)] p-7 shadow-xl md:p-12">
          <div className="mb-8 flex items-center gap-3"><span className="t-pulse h-2.5 w-2.5 rounded-full bg-[var(--p)]" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / team</p></div>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"sectionFiveTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"specialistsText")}</p></Reveal><div className="mt-10 grid gap-5 md:grid-cols-3">{[[getValue(data,"team1Name"),getValue(data,"team1Role"),getValue(data,"team1Image")],[getValue(data,"team2Name"),getValue(data,"team2Role"),getValue(data,"team2Image")],[getValue(data,"team3Name"),getValue(data,"team3Role"),getValue(data,"team3Image")]].map(([name, role, image], i) => (<Reveal key={name} delayMs={i*90} className="t-hover overflow-hidden bg-[var(--surface)]/75"><img src={image} alt="" className="h-64 w-full object-cover" /><div className="p-5"><p className="text-xs text-[var(--p)]">מומחית {i+1}</p><h3 className="mt-1 text-xl font-bold">{name}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{role} · אבחון קשוב, תיעוד מסודר ותוצאה שמותאמת לפנים ולשגרה.</p></div></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="testimonials" data-section-kind="testimonials" className="beauty-inkPMU-testimonials-frame-6 overflow-hidden px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[0.85fr_1.15fr_0.55fr]">
          <div className="min-h-28 bg-[var(--p)]/15 p-5"><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / testimonials</p></div>
          <div className="bg-[var(--surface)] p-6 md:p-10"><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"sectionSixTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"pressText")}</p></Reveal><div className="mt-10 grid gap-5 md:grid-cols-[1.2fr_0.8fr_1fr]">{[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text, name, role], i) => (<Reveal key={name} delayMs={i*80} className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-6"><p className="text-2xl text-[var(--p)]">״</p><p className="mt-2 text-lg leading-8">{text}</p><p className="mt-5 text-sm font-bold text-[var(--p)]">{name} · {role}</p></Reveal>))}</div></div>
          <div className="t-float hidden border border-[var(--p)]/35 p-5 md:block"><span className="text-xs text-[var(--muted)]">חדר פיגמנט</span></div>
        </div>
      </section>
      <section data-template-section-type="packages" data-section-kind="packages" className="beauty-inkPMU-packages-frame-7 px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl border-y border-[var(--p)]/35 py-10">
          <div className="mb-8 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-end"><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / packages</p><div className="h-px bg-[var(--p)]/30" /><span className="text-xs text-[var(--muted)]">חדר פיגמנט</span></div>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"sectionSevenTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"priceText")}</p></Reveal><div className="mt-10 grid gap-5 lg:grid-cols-3">{[[getValue(data,"packageOneTitle"),getValue(data,"packageOnePrice"),getValue(data,"packageOneText")],[getValue(data,"packageTwoTitle"),getValue(data,"packageTwoPrice"),getValue(data,"packageTwoText")],[getValue(data,"packageThreeTitle"),getValue(data,"packageThreePrice"),getValue(data,"packageThreeText")]].map(([title, price, text], i) => (<Reveal key={title} delayMs={i*90} className="t-hover relative overflow-hidden border border-[var(--p)]/30 bg-[var(--surface)]/75 p-7"><div className="t-shimmer absolute inset-x-0 top-0 h-1 bg-[var(--p)]" /><p className="t-display text-4xl text-[var(--p)]">{price}</p><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{text}</p><button type="button" onClick={() => goTo("booking")} className="mt-6 text-sm font-bold text-[var(--p)]">בחירת חבילה</button></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="whyUs" data-section-kind="whyUs" className="beauty-inkPMU-whyUs-frame-8 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--a)_16%,transparent),transparent)] px-5 py-24 text-center lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-8 h-16 w-px bg-[var(--p)]" />
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / whyUs</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"sectionEightTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"valuesText")}</p></Reveal><div className="mt-10 grid gap-4 md:grid-cols-3">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n, label], i) => (<Reveal key={label} delayMs={i*90} variant="scale" className="t-float border-b-4 border-[var(--p)] bg-[var(--surface)]/70 p-7 text-center"><div className="t-display text-5xl text-[var(--p)]">{n}</div><p className="mt-2 font-bold">{label}</p><p className="mt-2 text-sm text-[var(--muted)]">מדד שמספר על עקביות, דיוק וחוויה שחוזרות בכל ביקור.</p></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="bookingTeaser" data-section-kind="bookingTeaser" className="beauty-inkPMU-bookingTeaser-frame-9 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[120px_1fr]">
            <div className="font-mono text-sm text-[var(--p)]">PMU<div className="mt-3 h-24 w-px bg-[var(--p)]/50" /></div>
            <div className="border-l border-[var(--p)]/30 pl-0 lg:pl-8"><Reveal className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]"><div><h2 className="t-display text-5xl leading-tight text-[var(--p)]">{getValue(data,"bookingTeaserTitle")}</h2><p className="mt-4 max-w-xl text-[var(--muted)]">{getValue(data,"ctaText")}</p></div><button type="button" onClick={() => goTo("booking")} className="t-pulse bg-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--dark)]">{getValue(data,"ctaButton")}</button></Reveal></div>
          </div>
        </div>
      </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="beauty-inkPMU-footer-atelier px-5 py-14 text-center lg:px-8"><p className="t-display text-4xl text-[var(--p)]">{getValue(data,"brandName")}</p><p className="mt-3 text-xs tracking-[0.3em] text-[var(--muted)]">{getValue(data,"email")}</p></footer>
    </>
  );
}

function AboutPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="aboutHero" data-section-kind="aboutHero" className="beauty-inkPMU-aboutHero-frame-0 relative isolate overflow-hidden px-5 py-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,color-mix(in_srgb,var(--p)_28%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--surface)_70%,transparent),transparent_58%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / aboutHero</p>
          <Reveal><div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end"><div><p className="text-xs font-bold tracking-[0.35em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p><h1 className="t-display t-anim mt-4 text-5xl leading-tight text-[var(--p)] md:text-7xl">{getValue(data,"aboutHeroTitle")}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data,"aboutStoryText")}</p></div><img src={getValue(data,"aboutImage")} alt="" className="t-ken min-h-[360px] w-full object-cover" /></div></Reveal>
        </div>
      </section>
      <section data-template-section-type="story" data-section-kind="story" className="beauty-inkPMU-story-frame-1 px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="lg:sticky lg:top-28 lg:h-fit"><div className="t-shimmer mb-5 h-px w-32 bg-[var(--p)]" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / story</p><div className="mt-6 t-display text-5xl leading-none text-[var(--p)]">02</div></aside>
          <div><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"aboutStoryTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"aboutStoryText")}</p></Reveal><div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"><Reveal><img src={getValue(data,"sectionImage")} alt="" className="t-ken h-full min-h-[420px] w-full object-cover" /></Reveal><div className="space-y-5">{["הקמנו מקום שמקשיב קודם כל לאדם שמולנו, לפני בחירת צבע, חומר או פרוטוקול.","כל טיפול מתועד בכרטיס לקוחה, עם העדפות, תגובות עור והמלצות המשך ברורות.","הצוות נפגש בכל שבוע לסקירת תוצאות, שיפור תהליכים ובדיקת חומרי עבודה חדשים."].map((text, i) => (<Reveal key={text} delayMs={i*80} className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-6"><span className="text-sm font-bold text-[var(--p)]">פרק {i+1}</span><p className="mt-3 leading-8 text-[var(--muted)]">{text}</p></Reveal>))}</div></div></div>
        </div>
      </section>
      <section data-template-section-type="spaceTour" data-section-kind="spaceTour" className="beauty-inkPMU-spaceTour-frame-2 overflow-hidden px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[3rem] border border-[var(--p)]/25 bg-[var(--surface)] px-6 py-14 shadow-2xl md:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / spaceTour</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"spaceTourTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"spaceTourText")}</p></Reveal><div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><Reveal><img src={getValue(data,"galleryImage1")} alt="" className="t-ken h-full min-h-[460px] w-full object-cover" /></Reveal><div className="grid gap-4">{[[getValue(data,"galleryImage2"),"קבלת פנים","עמדת ייעוץ שקטה עם תאורה רכה וכיבוד קטן."],[getValue(data,"galleryImage3"),"חדר טיפול","מיטה מחוממת, סטריליות מלאה ומוזיקה מותאמת."],[getValue(data,"galleryImage4"),"פינת סיום","מראה גדולה, מוצרי המשך והנחיות כתובות."]].map(([src,title,text], i) => (<Reveal key={title} delayMs={i*80} className="t-hover grid grid-cols-[110px_1fr] gap-4 bg-[var(--surface)]/70 p-4"><img src={src} alt="" className="h-28 w-full object-cover" /><div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></div></Reveal>))}</div></div>
        </div>
      </section>
      <section data-template-section-type="values" data-section-kind="values" className="beauty-inkPMU-values-frame-3 px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div className="order-2 md:order-1"><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"valuesTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"valuesText")}</p></Reveal><div className="mt-10 grid gap-4 md:grid-cols-3">{[["01","דיוק","לא מתחילות טיפול לפני התאמת ציפיות ותיעוד מלא."],["02","היגיינה","כלים מחוטאים, עמדות נקיות וחומרים מאושרים בלבד."],["03","רוגע","לוח תורים מרווח כדי שלא תרגישו חלק מפס ייצור."],["04","שקיפות","מחיר, משך ותוצאה צפויה מוסברים מראש."],["05","למידה","הכשרות קבועות והתנסות בטכניקות חדשות."],["06","אחריות","מעקב אחרי הטיפול והמלצות המשך אמיתיות."]].map(([n,title,text], i) => (<Reveal key={n} delayMs={i*60} className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5"><span className="text-xs font-bold text-[var(--p)]">{n}</span><h3 className="mt-2 text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p></Reveal>))}</div></div>
          <div className="order-1 flex items-start justify-between border-r-4 border-[var(--p)] pr-5 md:order-2"><div><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / values</p></div><span className="text-xs text-[var(--muted)]">חדר פיגמנט</span></div>
        </div>
      </section>
      <section data-template-section-type="specialistsDeep" data-section-kind="specialistsDeep" className="beauty-inkPMU-specialistsDeep-frame-4 relative overflow-hidden bg-[var(--dark)] px-5 py-24 text-[var(--text)] lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--p)_18%,transparent),transparent)]" />
        <div className="relative mx-auto max-w-7xl border border-[var(--p)]/45 p-6 shadow-[0_0_44px_color-mix(in_srgb,var(--p)_18%,transparent)] md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / specialistsDeep</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"specialistsTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"specialistsText")}</p></Reveal><div className="mt-10 space-y-5">{[[getValue(data,"team1Name"),getValue(data,"team1Role"),getValue(data,"team1Image")],[getValue(data,"team2Name"),getValue(data,"team2Role"),getValue(data,"team2Image")],[getValue(data,"team3Name"),getValue(data,"team3Role"),getValue(data,"team3Image")]].map(([name, role, image], i) => (<Reveal key={name} delayMs={i*90} className="t-hover grid gap-5 border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5 md:grid-cols-[180px_1fr_auto]"><img src={image} alt="" className="h-44 w-full object-cover" /><div><p className="text-sm text-[var(--p)]">{role}</p><h3 className="mt-1 text-2xl font-bold">{name}</h3><p className="mt-3 leading-7 text-[var(--muted)]">התמחות באבחון אישי, עבודה עדינה וליווי אחרי הטיפול. כל מפגש מתועד כדי לשמור על המשכיות ותוצאה מדויקת.</p></div><div className="self-center text-center"><div className="t-display text-4xl text-[var(--p)]">{i+4}</div><p className="text-xs text-[var(--muted)]">שנות ניסיון</p></div></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="certifications" data-section-kind="certifications" className="beauty-inkPMU-certifications-frame-5 bg-[var(--bg)] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[var(--p)]/20 bg-[var(--surface)] p-7 shadow-xl md:p-12">
          <div className="mb-8 flex items-center gap-3"><span className="t-pulse h-2.5 w-2.5 rounded-full bg-[var(--p)]" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / certifications</p></div>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"certsTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"certsText")}</p></Reveal><div className="mt-10 grid gap-4 md:grid-cols-4">{[[getValue(data,"galleryImage1"),"נהלי חיטוי"],[getValue(data,"itemOneImage"),"הכשרות מוצר"],[getValue(data,"galleryImage3"),"בטיחות לקוחה"],[getValue(data,"itemTwoImage"),"בדיקת חומרים"]].map(([image,title], i) => (<Reveal key={title} delayMs={i*70} className="t-hover overflow-hidden border border-[var(--p)]/30 bg-[var(--surface)]/70"><img src={image} alt="" className="h-36 w-full object-cover" /><div className="p-5 text-center"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">תעודה, רענון ויישום בפועל בצוות.</p></div></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="timeline" data-section-kind="timeline" className="beauty-inkPMU-timeline-frame-6 overflow-hidden px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[0.85fr_1.15fr_0.55fr]">
          <div className="min-h-28 bg-[var(--p)]/15 p-5"><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / timeline</p></div>
          <div className="bg-[var(--surface)] p-6 md:p-10"><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"timelineTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"aboutStoryText")}</p></Reveal><div className="mt-10 space-y-0 border-r border-[var(--p)]/40 pr-6">{[["2018","פתיחת החדר הראשון וקבלת לקוחות קבועות."],["2020","הוספת מערכת תורים ותיעוד דיגיטלי."],["2023","הרחבת הצוות והכשרות מתקדמות."],["2026","חלל חדש עם אזורי טיפול, המתנה ואבחון."]].map(([year,text], i) => (<Reveal key={year} delayMs={i*80} className="relative pb-8"><span className="absolute -right-[31px] top-1 h-3 w-3 rounded-full bg-[var(--p)]" /><div className="grid gap-3 md:grid-cols-[120px_1fr]"><strong className="t-display text-3xl text-[var(--p)]">{year}</strong><p className="leading-7 text-[var(--muted)]">{text}</p></div></Reveal>))}</div></div>
          <div className="t-float hidden border border-[var(--p)]/35 p-5 md:block"><span className="text-xs text-[var(--muted)]">חדר פיגמנט</span></div>
        </div>
      </section>
      <section data-template-section-type="pressQuotes" data-section-kind="pressQuotes" className="beauty-inkPMU-pressQuotes-frame-7 px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl border-y border-[var(--p)]/35 py-10">
          <div className="mb-8 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-end"><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / pressQuotes</p><div className="h-px bg-[var(--p)]/30" /><span className="text-xs text-[var(--muted)]">חדר פיגמנט</span></div>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"pressTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"pressText")}</p></Reveal><div className="mt-10 grid gap-5 md:grid-cols-3">{[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text, name, role], i) => (<Reveal key={name} delayMs={i*80} className="t-hover bg-[var(--surface)]/70 p-6"><p className="text-xs font-bold tracking-[0.28em] text-[var(--p)]">BEAUTY NOTE {i+1}</p><p className="mt-4 text-lg leading-8">{text}</p><p className="mt-5 text-sm text-[var(--muted)]">{name} · {role}</p></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="aboutCta" data-section-kind="aboutCta" className="beauty-inkPMU-aboutCta-frame-8 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--a)_16%,transparent),transparent)] px-5 py-24 text-center lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-8 h-16 w-px bg-[var(--p)]" />
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / aboutCta</p>
          <Reveal className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]"><div><h2 className="t-display text-5xl leading-tight text-[var(--p)]">{getValue(data,"aboutCtaTitle")}</h2><p className="mt-4 max-w-xl text-[var(--muted)]">{getValue(data,"ctaText")}</p></div><button type="button" onClick={() => goTo("booking")} className="t-pulse bg-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--dark)]">{getValue(data,"ctaButton")}</button></Reveal>
        </div>
      </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="beauty-inkPMU-footer-atelier px-5 py-14 text-center lg:px-8"><p className="t-display text-4xl text-[var(--p)]">{getValue(data,"brandName")}</p><p className="mt-3 text-xs tracking-[0.3em] text-[var(--muted)]">{getValue(data,"email")}</p></footer>
    </>
  );
}

function ServicesPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="servicesHero" data-section-kind="servicesHero" className="beauty-inkPMU-servicesHero-frame-9 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[120px_1fr]">
            <div className="font-mono text-sm text-[var(--p)]">PMU<div className="mt-3 h-24 w-px bg-[var(--p)]/50" /></div>
            <div className="border-l border-[var(--p)]/30 pl-0 lg:pl-8"><Reveal><div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end"><div><p className="text-xs font-bold tracking-[0.35em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p><h1 className="t-display t-anim mt-4 text-5xl leading-tight text-[var(--p)] md:text-7xl">{getValue(data,"servicesHeroTitle")}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data,"servicesIntroText")}</p></div><img src={getValue(data,"sectionImage")} alt="" className="t-ken min-h-[340px] w-full object-cover" /></div></Reveal></div>
          </div>
        </div>
      </section>
      <section data-template-section-type="catalog" data-section-kind="catalog" className="beauty-inkPMU-catalog-frame-0 relative isolate overflow-hidden px-5 py-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,color-mix(in_srgb,var(--p)_28%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--surface)_70%,transparent),transparent_58%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / catalog</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"catalogTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"catalogText")}</p></Reveal><div className="mt-10 grid gap-5 md:grid-cols-2">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText"),"45-75 דק׳",getValue(data,"itemOneImage")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText"),"60-90 דק׳",getValue(data,"itemTwoImage")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText"),"30-60 דק׳",getValue(data,"itemThreeImage")],[getValue(data,"itemFourTitle"),getValue(data,"itemFourText"),"15-30 דק׳",getValue(data,"itemFourImage")]].map(([title, text, minutes, image], i) => (<Reveal key={title} delayMs={i*70} className="t-hover grid gap-4 overflow-hidden border border-[var(--p)]/25 bg-[var(--surface)]/70 p-4 md:grid-cols-[140px_1fr]"><img src={image} alt="" className="h-24 w-full object-cover" /><div><h3 className="text-2xl font-bold">{title}</h3><p className="mt-2 leading-7 text-[var(--muted)]">{text}</p><p className="mt-3 text-sm font-bold text-[var(--p)]">משך משוער: {minutes}</p></div></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="featuredTreatment" data-section-kind="featuredTreatment" className="beauty-inkPMU-featuredTreatment-frame-1 px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="lg:sticky lg:top-28 lg:h-fit"><div className="t-shimmer mb-5 h-px w-32 bg-[var(--p)]" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / featuredTreatment</p><div className="mt-6 t-display text-5xl leading-none text-[var(--p)]">02</div></aside>
          <div><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"featuredTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"featuredTreatmentText")}</p></Reveal><div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"><Reveal><img src={getValue(data,"itemOneImage")} alt="" className="t-ken h-full min-h-[460px] w-full object-cover" /></Reveal><Reveal delayMs={100} className="bg-[var(--surface)]/75 p-7"><h3 className="t-display text-4xl text-[var(--p)]">{getValue(data,"itemOneTitle")}</h3><p className="mt-4 leading-8 text-[var(--muted)]">{getValue(data,"featuredTreatmentText")}</p><ul className="mt-6 space-y-3 text-sm">{["אבחון לפני התחלה","עבודה בשכבות", "סיום עם המלצות בית"].map((item) => (<li key={item} className="border-b border-[var(--p)]/20 pb-3">{item}</li>))}</ul><button type="button" onClick={() => goTo("booking")} className="mt-7 bg-[var(--p)] px-7 py-3 text-sm font-bold text-[var(--dark)]">קביעת טיפול דגל</button></Reveal></div></div>
        </div>
      </section>
      <section data-template-section-type="durationGuide" data-section-kind="durationGuide" className="beauty-inkPMU-durationGuide-frame-2 overflow-hidden px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[3rem] border border-[var(--p)]/25 bg-[var(--surface)] px-6 py-14 shadow-2xl md:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / durationGuide</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"durationTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"durationText")}</p></Reveal><div className="mt-10 overflow-hidden border border-[var(--p)]/30">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText"),"45-75 דק׳",getValue(data,"itemOneImage")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText"),"60-90 דק׳",getValue(data,"itemTwoImage")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText"),"30-60 דק׳",getValue(data,"itemThreeImage")],[getValue(data,"itemFourTitle"),getValue(data,"itemFourText"),"15-30 דק׳",getValue(data,"itemFourImage")]].map(([title, text, minutes, image], i) => (<Reveal key={title} delayMs={i*60} className="grid gap-3 border-b border-[var(--p)]/20 bg-[var(--surface)]/70 p-5 last:border-b-0 md:grid-cols-[96px_1fr_140px_1.4fr]"><img src={image} alt="" className="h-20 w-full object-cover" /><strong>{title}</strong><span className="text-[var(--p)]">{minutes}</span><span className="text-sm text-[var(--muted)]">{text}</span></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="addons" data-section-kind="addons" className="beauty-inkPMU-addons-frame-3 px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div className="order-2 md:order-1"><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"addonsTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"addonsText")}</p></Reveal><div className="mt-10 flex flex-wrap gap-3">{["מסכת הרגעה","עיסוי קרקפת","אמפולת זוהר","תיקון מהיר","ייעוץ ביתי","צילום תוצאה"].map((item, i) => (<Reveal key={item} delayMs={i*45} className="t-hover rounded-full border border-[var(--p)]/35 bg-[var(--surface)]/70 px-5 py-3 text-sm font-bold">+ {item}</Reveal>))}</div><p className="mt-6 max-w-2xl text-[var(--muted)]">{getValue(data,"addonsText")}</p></div>
          <div className="order-1 flex items-start justify-between border-r-4 border-[var(--p)] pr-5 md:order-2"><div><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / addons</p></div><span className="text-xs text-[var(--muted)]">חדר פיגמנט</span></div>
        </div>
      </section>
      <section data-template-section-type="beforeAfter" data-section-kind="beforeAfter" className="beauty-inkPMU-beforeAfter-frame-4 relative overflow-hidden bg-[var(--dark)] px-5 py-24 text-[var(--text)] lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--p)_18%,transparent),transparent)]" />
        <div className="relative mx-auto max-w-7xl border border-[var(--p)]/45 p-6 shadow-[0_0_44px_color-mix(in_srgb,var(--p)_18%,transparent)] md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / beforeAfter</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"beforeAfterTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"beforeAfterText")}</p></Reveal><div className="mt-10 grid gap-5 lg:grid-cols-2"><Reveal className="relative overflow-hidden"><img src={getValue(data,"galleryImage1")} alt="" className="t-ken h-[420px] w-full object-cover opacity-75" /><span className="absolute right-4 top-4 bg-[var(--dark)] px-4 py-2 text-sm text-white">לפני</span></Reveal><Reveal delayMs={100} className="relative overflow-hidden"><img src={getValue(data,"galleryImage3")} alt="" className="t-ken h-[420px] w-full object-cover" /><span className="absolute right-4 top-4 bg-[var(--p)] px-4 py-2 text-sm font-bold text-[var(--dark)]">אחרי</span></Reveal></div>
        </div>
      </section>
      <section data-template-section-type="priceTable" data-section-kind="priceTable" className="beauty-inkPMU-priceTable-frame-5 bg-[var(--bg)] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[var(--p)]/20 bg-[var(--surface)] p-7 shadow-xl md:p-12">
          <div className="mb-8 flex items-center gap-3"><span className="t-pulse h-2.5 w-2.5 rounded-full bg-[var(--p)]" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / priceTable</p></div>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"priceTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"priceText")}</p></Reveal><div className="mt-10 grid gap-4">{[[getValue(data,"packageOneTitle"),getValue(data,"packageOnePrice"),getValue(data,"packageOneText")],[getValue(data,"packageTwoTitle"),getValue(data,"packageTwoPrice"),getValue(data,"packageTwoText")],[getValue(data,"packageThreeTitle"),getValue(data,"packageThreePrice"),getValue(data,"packageThreeText")]].map(([title, price, text], i) => (<Reveal key={title} delayMs={i*70} className="t-hover grid items-center gap-4 border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5 md:grid-cols-[1fr_120px_1fr_auto]"><h3 className="text-xl font-bold">{title}</h3><strong className="t-display text-3xl text-[var(--p)]">{price}</strong><p className="text-sm text-[var(--muted)]">{text}</p><button type="button" onClick={() => goTo("booking")} className="border border-[var(--p)] px-4 py-2 text-sm text-[var(--p)]">בחירה</button></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="serviceFaq" data-section-kind="serviceFaq" className="beauty-inkPMU-serviceFaq-frame-6 overflow-hidden px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[0.85fr_1.15fr_0.55fr]">
          <div className="min-h-28 bg-[var(--p)]/15 p-5"><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / serviceFaq</p></div>
          <div className="bg-[var(--surface)] p-6 md:p-10"><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"serviceFaqTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"servicesIntroText")}</p></Reveal><div className="mt-10 space-y-3">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q, a], i) => (<Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5"><summary className="cursor-pointer text-lg font-bold">{q}</summary><p className="mt-3 leading-7 text-[var(--muted)]">{a}</p></details></Reveal>))}</div></div>
          <div className="t-float hidden border border-[var(--p)]/35 p-5 md:block"><span className="text-xs text-[var(--muted)]">חדר פיגמנט</span></div>
        </div>
      </section>
      <section data-template-section-type="bookCta" data-section-kind="bookCta" className="beauty-inkPMU-bookCta-frame-7 px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl border-y border-[var(--p)]/35 py-10">
          <div className="mb-8 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-end"><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / bookCta</p><div className="h-px bg-[var(--p)]/30" /><span className="text-xs text-[var(--muted)]">חדר פיגמנט</span></div>
          <Reveal className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]"><div><h2 className="t-display text-5xl leading-tight text-[var(--p)]">{getValue(data,"bookCtaTitle")}</h2><p className="mt-4 max-w-xl text-[var(--muted)]">{getValue(data,"ctaText")}</p></div><button type="button" onClick={() => goTo("booking")} className="t-pulse bg-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--dark)]">{getValue(data,"ctaButton")}</button></Reveal>
        </div>
      </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="beauty-inkPMU-footer-atelier px-5 py-14 text-center lg:px-8"><p className="t-display text-4xl text-[var(--p)]">{getValue(data,"brandName")}</p><p className="mt-3 text-xs tracking-[0.3em] text-[var(--muted)]">{getValue(data,"email")}</p></footer>
    </>
  );
}

function BookingPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="bookingHero" data-section-kind="bookingHero" className="beauty-inkPMU-bookingHero-frame-8 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--a)_16%,transparent),transparent)] px-5 py-24 text-center lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-8 h-16 w-px bg-[var(--p)]" />
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / bookingHero</p>
          <Reveal><h1 className="t-display t-anim text-5xl leading-tight text-[var(--p)] md:text-7xl">{getValue(data,"bookingHeroTitle")}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data,"ctaText")}</p></Reveal>
        </div>
      </section>
      <section data-section-kind="booking" data-bizuply-block="booking" data-template-section-type="booking" className="beauty-inkPMU-calendar-frame-9 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[120px_1fr]">
            <div className="font-mono text-sm text-[var(--p)]">PMU<div className="mt-3 h-24 w-px bg-[var(--p)]/50" /></div>
            <div className="border-l border-[var(--p)]/30 pl-0 lg:pl-8"><div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start"><Reveal><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"calendarTitle")}</h2><p className="mt-4 text-[var(--muted)]">בחרו יום ושעה פנויה. הלוח כאן לשמירת תור מהירה מתוך התבנית.</p></Reveal><Reveal delayMs={100} className="t-glow bg-[var(--surface)]/80 p-5"><BookingCalendarPanel  /></Reveal></div></div>
          </div>
        </div>
      </section>
      <section data-template-section-type="servicePicker" data-section-kind="servicePicker" className="beauty-inkPMU-servicePicker-frame-0 relative isolate overflow-hidden px-5 py-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,color-mix(in_srgb,var(--p)_28%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--surface)_70%,transparent),transparent_58%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / servicePicker</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"servicePickerTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"catalogText")}</p></Reveal><div className="mt-8 grid gap-3 md:grid-cols-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText"),"45-75 דק׳",getValue(data,"itemOneImage")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText"),"60-90 דק׳",getValue(data,"itemTwoImage")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText"),"30-60 דק׳",getValue(data,"itemThreeImage")]].map(([title, text, minutes, image], i) => (<Reveal key={title} delayMs={i*70} className="t-hover cursor-pointer overflow-hidden border border-[var(--p)]/25 bg-[var(--surface)]/70"><img src={image} alt="" className="h-28 w-full object-cover" /><div className="p-5"><p className="text-sm font-bold text-[var(--p)]">{minutes}</p><h3 className="mt-2 font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></div></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="specialistPicker" data-section-kind="specialistPicker" className="beauty-inkPMU-specialistPicker-frame-1 px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="lg:sticky lg:top-28 lg:h-fit"><div className="t-shimmer mb-5 h-px w-32 bg-[var(--p)]" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / specialistPicker</p><div className="mt-6 t-display text-5xl leading-none text-[var(--p)]">02</div></aside>
          <div><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"specialistTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"specialistsText")}</p></Reveal><div className="mt-8 grid gap-4 md:grid-cols-3">{[[getValue(data,"team1Name"),getValue(data,"team1Role"),getValue(data,"team1Image")],[getValue(data,"team2Name"),getValue(data,"team2Role"),getValue(data,"team2Image")],[getValue(data,"team3Name"),getValue(data,"team3Role"),getValue(data,"team3Image")]].map(([name, role, image], i) => (<Reveal key={name} delayMs={i*70} className="t-hover bg-[var(--surface)]/70 p-5 text-center"><img src={image} alt="" className="mx-auto h-28 w-28 rounded-full object-cover" /><h3 className="mt-4 font-bold">{name}</h3><p className="mt-1 text-sm text-[var(--muted)]">{role}</p></Reveal>))}</div></div>
        </div>
      </section>
      <section data-template-section-type="hoursPanel" data-section-kind="hoursPanel" className="beauty-inkPMU-hoursPanel-frame-2 overflow-hidden px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[3rem] border border-[var(--p)]/25 bg-[var(--surface)] px-6 py-14 shadow-2xl md:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / hoursPanel</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"hoursTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"policyText")}</p></Reveal><Reveal className="mt-8 grid gap-4 md:grid-cols-3">{[["א-ה","09:00-20:00"],["ו","09:00-14:00"],["מענה","עד שעה לאישור"]].map(([d,h]) => (<div key={d} className="border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5"><p className="text-sm text-[var(--muted)]">{d}</p><strong className="text-2xl text-[var(--p)]">{h}</strong></div>))}</Reveal>
        </div>
      </section>
      <section data-template-section-type="policies" data-section-kind="policies" className="beauty-inkPMU-policies-frame-3 px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div className="order-2 md:order-1"><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"policiesTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"policyText")}</p></Reveal><div className="mt-8 grid gap-4 md:grid-cols-3">{["ביטול עד 24 שעות ללא חיוב","איחור מעל 15 דקות עלול לקצר טיפול","רגישות או מצב רפואי יש לעדכן מראש"].map((item, i) => (<Reveal key={item} delayMs={i*70} className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5"><span className="text-sm font-bold text-[var(--p)]">0{i+1}</span><p className="mt-3 leading-7 text-[var(--muted)]">{item}</p></Reveal>))}</div></div>
          <div className="order-1 flex items-start justify-between border-r-4 border-[var(--p)] pr-5 md:order-2"><div><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / policies</p></div><span className="text-xs text-[var(--muted)]">חדר פיגמנט</span></div>
        </div>
      </section>
      <section data-template-section-type="confirmationForm" data-section-kind="confirmationForm" className="beauty-inkPMU-confirmationForm-frame-4 relative overflow-hidden bg-[var(--dark)] px-5 py-24 text-[var(--text)] lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--p)_18%,transparent),transparent)]" />
        <div className="relative mx-auto max-w-7xl border border-[var(--p)]/45 p-6 shadow-[0_0_44px_color-mix(in_srgb,var(--p)_18%,transparent)] md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / confirmationForm</p>
          <Reveal className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"><div><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"confirmTitle")}</h2><p className="mt-4 text-[var(--muted)]">{getValue(data,"contactText")}</p></div><form className="grid gap-3 bg-[var(--surface)]/70 p-6" onSubmit={(e)=>e.preventDefault()}><input className="border border-[var(--p)]/25 bg-transparent px-4 py-3 text-right outline-none" placeholder="שם מלא" /><input className="border border-[var(--p)]/25 bg-transparent px-4 py-3 text-right outline-none" placeholder="טלפון" /><textarea className="min-h-28 border border-[var(--p)]/25 bg-transparent px-4 py-3 text-right outline-none" placeholder="הערות" /><button type="button" className="bg-[var(--p)] py-3.5 text-sm font-bold text-[var(--dark)]">{getValue(data,"contactButton")}</button></form></Reveal>
        </div>
      </section>
      <section data-template-section-type="locationMap" data-section-kind="locationMap" className="beauty-inkPMU-locationMap-frame-5 bg-[var(--bg)] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[var(--p)]/20 bg-[var(--surface)] p-7 shadow-xl md:p-12">
          <div className="mb-8 flex items-center gap-3"><span className="t-pulse h-2.5 w-2.5 rounded-full bg-[var(--p)]" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / locationMap</p></div>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"><Reveal><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"locationTitle")}</h2><p className="mt-4 text-[var(--muted)]">{getValue(data,"address")}</p><p className="mt-2 text-sm">{getValue(data,"phone")} · {getValue(data,"hours")}</p></Reveal><Reveal delayMs={100} className="relative overflow-hidden"><img src={getValue(data,"mapImage")} alt="" className="t-ken aspect-video w-full object-cover opacity-80" /><span className="absolute inset-0 grid place-items-center bg-[var(--dark)]/35 text-sm font-bold text-white">מפה · {getValue(data,"address")}</span></Reveal></div>
        </div>
      </section>
      <section data-template-section-type="bookingFaq" data-section-kind="bookingFaq" className="beauty-inkPMU-bookingFaq-frame-6 overflow-hidden px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[0.85fr_1.15fr_0.55fr]">
          <div className="min-h-28 bg-[var(--p)]/15 p-5"><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">PMU / bookingFaq</p></div>
          <div className="bg-[var(--surface)] p-6 md:p-10"><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"bookingFaqTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"policyText")}</p></Reveal><div className="mt-10 space-y-3">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q, a], i) => (<Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5"><summary className="cursor-pointer text-lg font-bold">{q}</summary><p className="mt-3 leading-7 text-[var(--muted)]">{a}</p></details></Reveal>))}</div></div>
          <div className="t-float hidden border border-[var(--p)]/35 p-5 md:block"><span className="text-xs text-[var(--muted)]">חדר פיגמנט</span></div>
        </div>
      </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="beauty-inkPMU-footer-atelier px-5 py-14 text-center lg:px-8"><p className="t-display text-4xl text-[var(--p)]">{getValue(data,"brandName")}</p><p className="mt-3 text-xs tracking-[0.3em] text-[var(--muted)]">{getValue(data,"email")}</p></footer>
    </>
  );
}

export default function PermanovaPages(props: PermanovaPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...permanovaDefaultData, ...(data ?? {}) }), [data]);
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
    <div dir="rtl" data-template-id={mode === "preview" ? "permanova-preview" : "permanova"} className="min-h-screen w-full overflow-x-hidden" style={{ background: "#FFFBF7", color: "#431407" }}>
      <style dangerouslySetInnerHTML={{ __html: permanovaEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))}
      />
    </div>
  );
}
