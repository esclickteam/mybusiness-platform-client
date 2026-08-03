import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { nailmuseDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { useCrmBookingServiceData } from "../shared/useCrmBookingServiceData";
import { nailmuseEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const nailmusePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "booking", label: "תורים", slug: "/booking" },
];

const allowedPages = nailmusePages.map((p) => p.id);

type NailmusePagesProps = {
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
  businessId?: string;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (nailmuseDefaultData as Record<string, any>)[key] ?? "";
}

function BookingCalendarPanel({ pill, compact, bold, neon }: { pill?: boolean; compact?: boolean; bold?: boolean; neon?: boolean }) {
  // Live CRM mount — syncs services/hours only; embedded chrome keeps template design.
  return (
    <div
      className="mt-6 min-h-[420px] w-full"
      dir="rtl"
      data-bizuply-widget="booking"
      data-bizuply-booking-mount="true"
      data-bizuply-crm-calendar="true"
      data-bizuply-booking-variant="month"
      data-bizuply-booking-chrome="embedded"
      data-bizuply-booking-frame="true"
      style={{ position: "relative", minHeight: 420, background: "transparent" }}
      aria-label="יומן פגישות מה-CRM"
    />
  );
}

function Header({ data, currentPage, goTo }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 beauty-artNails-header-v6 bg-[var(--p)] text-white shadow-xl">
    <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 py-4 lg:px-8">
      <button type="button" onClick={() => goTo("home")} className="t-display text-xl font-bold tracking-[0.18em] text-[var(--p)]">{getValue(data,"brandName")}</button>
      <div className="hidden h-px flex-1 bg-[var(--p)]/30 md:block" />
      <nav className="hidden gap-4 text-xs font-bold uppercase tracking-[0.18em] md:flex">{[{"id":"home","label":getValue(data,"navHome")||"בית"},{"id":"about","label":getValue(data,"navAbout")||"אודות"},{"id":"services","label":getValue(data,"navServices")||"שירותים"},{"id":"booking","label":getValue(data,"navBooking")||"תורים"}].map((p) => (<button key={p.id} type="button" onClick={() => goTo(p.id)} className={currentPage===p.id ? "text-[var(--p)]" : "text-[var(--muted)]"}>{p.label}</button>))}</nav>
      <button type="button" onClick={() => goTo("booking")} className="mr-auto px-4 py-2 text-xs font-bold rounded-full bg-[var(--dark)] text-white">{getValue(data,"heroPrimaryButton")}</button>
    </div>
  </header>
  );
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="hero" data-section-kind="hero" className="beauty-artNails-hero-v16 overflow-hidden bg-[var(--bg)] px-5 pb-20 pt-12 lg:px-8"><Reveal className="mx-auto max-w-4xl text-center"><p className="text-xs font-bold tracking-[0.4em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p><h1 className="t-display mt-4 whitespace-pre-line text-5xl leading-tight text-[var(--p)] md:text-7xl">{getValue(data,"heroTitle")}</h1><p className="mx-auto mt-5 max-w-2xl text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p></Reveal><div className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-3"><img src={getValue(data,"galleryImage1")} alt="" className="h-72 w-full rounded-t-full object-cover" /><img src={getValue(data,"heroImage")} alt="" className="t-ken h-96 w-full object-cover md:-mt-8" /><img src={getValue(data,"itemTwoImage")} alt="" className="h-72 w-full rounded-b-full object-cover md:mt-16" /></div></section>
      <section data-template-section-type="servicesPreview" data-section-kind="servicesPreview" className="beauty-artNails-servicesPreview-frame-6 overflow-hidden px-5 py-12 md:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[0.85fr_1.15fr_0.55fr]">
          <div className="min-h-28 bg-[var(--p)]/15 p-5"><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / servicesPreview</p></div>
          <div className="bg-[var(--surface)] p-6 md:p-10"><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"sectionTwoTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"servicesIntroText")}</p></Reveal><div className="mt-10 grid gap-4 md:grid-cols-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText"),"45-75 דק׳",getValue(data,"itemOneImage")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText"),"60-90 דק׳",getValue(data,"itemTwoImage")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText"),"30-60 דק׳",getValue(data,"itemThreeImage")]].map(([title, text, minutes, image], i) => (<Reveal key={title} delayMs={i*80} className="t-hover overflow-hidden border border-[var(--p)]/25 bg-[var(--surface)]/70"><img src={image} alt="" className="h-48 w-full object-cover" /><div className="p-6"><p className="text-xs font-bold text-[var(--p)]">{minutes}</p><h3 className="mt-3 text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{text}</p></div></Reveal>))}</div></div>
          <div className="t-float hidden border border-[var(--p)]/35 p-5 md:block"><span className="text-xs text-[var(--muted)]">גלריית צבע</span></div>
        </div>
      </section>
      <section data-template-section-type="ritual" data-section-kind="ritual" className="beauty-artNails-ritual-frame-7 px-5 py-12 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl border-y border-[var(--p)]/35 py-10">
          <div className="mb-8 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-end"><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / ritual</p><div className="h-px bg-[var(--p)]/30" /><span className="text-xs text-[var(--muted)]">גלריית צבע</span></div>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"sectionThreeTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"aboutStoryText")}</p></Reveal><div className="mt-10 grid gap-4 md:grid-cols-4">{[["01","שיחה","מגדירות מטרה, רגישויות וסגנון אישי."],["02","הכנה","ניקוי, התאמה ובדיקת נוחות לפני תחילת הטיפול."],["03","ביצוע","עבודה מדויקת בקצב רגוע עם חומרי פרימיום."],["04","המשך","הנחיות בית ותיאום ביקורת לפי הצורך."]].map(([n,title,text], i) => (<Reveal key={n} delayMs={i*70} className="t-hover border-r-2 border-[var(--p)] bg-[var(--surface)]/70 p-5"><span className="text-sm font-bold text-[var(--p)]">{n}</span><h3 className="mt-2 font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="gallery" data-section-kind="gallery" className="beauty-artNails-gallery-frame-8 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--a)_16%,transparent),transparent)] px-5 py-12 md:py-24 text-center lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-8 h-16 w-px bg-[var(--p)]" />
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / gallery</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"sectionFourTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"spaceTourText")}</p></Reveal><div className="mt-10 grid gap-4 md:grid-cols-4">{[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")].map((src, i) => (<Reveal key={i} delayMs={i*70} variant="scale" className={i===0 ? "md:col-span-2 md:row-span-2" : ""}><img src={src} alt="" className="t-ken h-full min-h-[240px] w-full object-cover" /></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="team" data-section-kind="team" className="beauty-artNails-team-frame-9 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[120px_1fr]">
            <div className="font-mono text-sm text-[var(--p)]">MUSE<div className="mt-3 h-24 w-px bg-[var(--p)]/50" /></div>
            <div className="border-l border-[var(--p)]/30 pl-0 lg:pl-8"><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"sectionFiveTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"specialistsText")}</p></Reveal><div className="mt-10 grid gap-5 md:grid-cols-3">{[[getValue(data,"team1Name"),getValue(data,"team1Role"),getValue(data,"team1Image")],[getValue(data,"team2Name"),getValue(data,"team2Role"),getValue(data,"team2Image")],[getValue(data,"team3Name"),getValue(data,"team3Role"),getValue(data,"team3Image")]].map(([name, role, image], i) => (<Reveal key={name} delayMs={i*90} className="t-hover overflow-hidden bg-[var(--surface)]/75"><img src={image} alt="" className="h-64 w-full object-cover" /><div className="p-5"><p className="text-xs text-[var(--p)]">מומחית {i+1}</p><h3 className="mt-1 text-xl font-bold">{name}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{role} · אבחון קשוב, תיעוד מסודר ותוצאה שמותאמת לפנים ולשגרה.</p></div></Reveal>))}</div></div>
          </div>
        </div>
      </section>
      <section data-template-section-type="testimonials" data-section-kind="testimonials" className="beauty-artNails-testimonials-frame-0 relative isolate overflow-hidden px-5 py-12 md:py-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,color-mix(in_srgb,var(--p)_28%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--surface)_70%,transparent),transparent_58%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / testimonials</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"sectionSixTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"pressText")}</p></Reveal><div className="mt-10 grid gap-5 md:grid-cols-[1.2fr_0.8fr_1fr]">{[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text, name, role], i) => (<Reveal key={name} delayMs={i*80} className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-6"><p className="text-2xl text-[var(--p)]">״</p><p className="mt-2 text-lg leading-8">{text}</p><p className="mt-5 text-sm font-bold text-[var(--p)]">{name} · {role}</p></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="packages" data-section-kind="packages" className="beauty-artNails-packages-frame-1 px-5 py-12 md:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="lg:sticky lg:top-28 lg:h-fit"><div className="t-shimmer mb-5 h-px w-32 bg-[var(--p)]" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / packages</p><div className="mt-6 t-display text-2xl md:text-5xl leading-none text-[var(--p)]">02</div></aside>
          <div><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"sectionSevenTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"priceText")}</p></Reveal><div className="mt-10 grid gap-5 lg:grid-cols-3">{[[getValue(data,"packageOneTitle"),getValue(data,"packageOnePrice"),getValue(data,"packageOneText")],[getValue(data,"packageTwoTitle"),getValue(data,"packageTwoPrice"),getValue(data,"packageTwoText")],[getValue(data,"packageThreeTitle"),getValue(data,"packageThreePrice"),getValue(data,"packageThreeText")]].map(([title, price, text], i) => (<Reveal key={title} delayMs={i*90} className="t-hover relative overflow-hidden border border-[var(--p)]/30 bg-[var(--surface)]/75 p-7"><div className="t-shimmer absolute inset-x-0 top-0 h-1 bg-[var(--p)]" /><p className="t-display text-2xl sm:text-4xl text-[var(--p)]">{price}</p><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{text}</p><button type="button" onClick={() => goTo("booking")} className="mt-6 text-sm font-bold text-[var(--p)]">בחירת חבילה</button></Reveal>))}</div></div>
        </div>
      </section>
      <section data-template-section-type="whyUs" data-section-kind="whyUs" className="beauty-artNails-whyUs-frame-2 overflow-hidden px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[3rem] border border-[var(--p)]/25 bg-[var(--surface)] px-6 py-14 shadow-2xl md:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / whyUs</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"sectionEightTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"valuesText")}</p></Reveal><div className="mt-10 grid gap-4 md:grid-cols-3">{[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]].map(([n, label], i) => (<Reveal key={label} delayMs={i*90} variant="scale" className="t-float border-b-4 border-[var(--p)] bg-[var(--surface)]/70 p-7 text-center"><div className="t-display text-2xl md:text-5xl text-[var(--p)]">{n}</div><p className="mt-2 font-bold">{label}</p><p className="mt-2 text-sm text-[var(--muted)]">מדד שמספר על עקביות, דיוק וחוויה שחוזרות בכל ביקור.</p></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="bookingTeaser" data-section-kind="bookingTeaser" className="beauty-artNails-bookingTeaser-frame-3 px-5 py-12 md:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div className="order-2 md:order-1"><Reveal className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]"><div><h2 className="t-display text-2xl md:text-5xl leading-tight text-[var(--p)]">{getValue(data,"bookingTeaserTitle")}</h2><p className="mt-4 max-w-xl text-[var(--muted)]">{getValue(data,"ctaText")}</p></div><button type="button" onClick={() => goTo("booking")} className="t-pulse bg-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--dark)]">{getValue(data,"ctaButton")}</button></Reveal></div>
          <div className="order-1 flex items-start justify-between border-r-4 border-[var(--p)] pr-5 md:order-2"><div><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / bookingTeaser</p></div><span className="text-xs text-[var(--muted)]">גלריית צבע</span></div>
        </div>
      </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="beauty-artNails-footer-brutal border-t-4 border-[var(--p)] px-5 py-8 lg:px-8"><p className="t-display text-2xl font-black uppercase">{getValue(data,"brandName")}</p><p className="mt-2 text-sm">{getValue(data,"address")}</p></footer>
    </>
  );
}

function AboutPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="aboutHero" data-section-kind="aboutHero" className="beauty-artNails-aboutHero-frame-4 relative overflow-hidden bg-[var(--dark)] px-5 py-12 md:py-24 text-[var(--text)] lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--p)_18%,transparent),transparent)]" />
        <div className="relative mx-auto max-w-7xl border border-[var(--p)]/45 p-6 shadow-[0_0_44px_color-mix(in_srgb,var(--p)_18%,transparent)] md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / aboutHero</p>
          <Reveal><div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end"><div><p className="text-xs font-bold tracking-[0.35em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p><h1 className="t-display t-anim mt-4 text-5xl leading-tight text-[var(--p)] md:text-7xl">{getValue(data,"aboutHeroTitle")}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data,"aboutStoryText")}</p></div><img src={getValue(data,"aboutImage")} alt="" className="t-ken min-h-[360px] w-full object-cover" /></div></Reveal>
        </div>
      </section>
      <section data-template-section-type="story" data-section-kind="story" className="beauty-artNails-story-frame-5 bg-[var(--bg)] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[var(--p)]/20 bg-[var(--surface)] p-7 shadow-xl md:p-12">
          <div className="mb-8 flex items-center gap-3"><span className="t-pulse h-2.5 w-2.5 rounded-full bg-[var(--p)]" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / story</p></div>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"aboutStoryTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"aboutStoryText")}</p></Reveal><div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"><Reveal><img src={getValue(data,"sectionImage")} alt="" className="t-ken h-full min-h-[420px] w-full object-cover" /></Reveal><div className="space-y-5">{["הקמנו מקום שמקשיב קודם כל לאדם שמולנו, לפני בחירת צבע, חומר או פרוטוקול.","כל טיפול מתועד בכרטיס לקוחה, עם העדפות, תגובות עור והמלצות המשך ברורות.","הצוות נפגש בכל שבוע לסקירת תוצאות, שיפור תהליכים ובדיקת חומרי עבודה חדשים."].map((text, i) => (<Reveal key={text} delayMs={i*80} className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-6"><span className="text-sm font-bold text-[var(--p)]">פרק {i+1}</span><p className="mt-3 leading-8 text-[var(--muted)]">{text}</p></Reveal>))}</div></div>
        </div>
      </section>
      <section data-template-section-type="spaceTour" data-section-kind="spaceTour" className="beauty-artNails-spaceTour-frame-6 overflow-hidden px-5 py-12 md:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[0.85fr_1.15fr_0.55fr]">
          <div className="min-h-28 bg-[var(--p)]/15 p-5"><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / spaceTour</p></div>
          <div className="bg-[var(--surface)] p-6 md:p-10"><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"spaceTourTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"spaceTourText")}</p></Reveal><div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><Reveal><img src={getValue(data,"galleryImage1")} alt="" className="t-ken h-full min-h-[460px] w-full object-cover" /></Reveal><div className="grid gap-4">{[[getValue(data,"galleryImage2"),"קבלת פנים","עמדת ייעוץ שקטה עם תאורה רכה וכיבוד קטן."],[getValue(data,"galleryImage3"),"חדר טיפול","מיטה מחוממת, סטריליות מלאה ומוזיקה מותאמת."],[getValue(data,"galleryImage4"),"פינת סיום","מראה גדולה, מוצרי המשך והנחיות כתובות."]].map(([src,title,text], i) => (<Reveal key={title} delayMs={i*80} className="t-hover grid grid-cols-[110px_1fr] gap-4 bg-[var(--surface)]/70 p-4"><img src={src} alt="" className="h-28 w-full object-cover" /><div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></div></Reveal>))}</div></div></div>
          <div className="t-float hidden border border-[var(--p)]/35 p-5 md:block"><span className="text-xs text-[var(--muted)]">גלריית צבע</span></div>
        </div>
      </section>
      <section data-template-section-type="values" data-section-kind="values" className="beauty-artNails-values-frame-7 px-5 py-12 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl border-y border-[var(--p)]/35 py-10">
          <div className="mb-8 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-end"><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / values</p><div className="h-px bg-[var(--p)]/30" /><span className="text-xs text-[var(--muted)]">גלריית צבע</span></div>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"valuesTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"valuesText")}</p></Reveal><div className="mt-10 grid gap-4 md:grid-cols-3">{[["01","דיוק","לא מתחילות טיפול לפני התאמת ציפיות ותיעוד מלא."],["02","היגיינה","כלים מחוטאים, עמדות נקיות וחומרים מאושרים בלבד."],["03","רוגע","לוח תורים מרווח כדי שלא תרגישו חלק מפס ייצור."],["04","שקיפות","מחיר, משך ותוצאה צפויה מוסברים מראש."],["05","למידה","הכשרות קבועות והתנסות בטכניקות חדשות."],["06","אחריות","מעקב אחרי הטיפול והמלצות המשך אמיתיות."]].map(([n,title,text], i) => (<Reveal key={n} delayMs={i*60} className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5"><span className="text-xs font-bold text-[var(--p)]">{n}</span><h3 className="mt-2 text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="specialistsDeep" data-section-kind="specialistsDeep" className="beauty-artNails-specialistsDeep-frame-8 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--a)_16%,transparent),transparent)] px-5 py-12 md:py-24 text-center lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-8 h-16 w-px bg-[var(--p)]" />
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / specialistsDeep</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"specialistsTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"specialistsText")}</p></Reveal><div className="mt-10 space-y-5">{[[getValue(data,"team1Name"),getValue(data,"team1Role"),getValue(data,"team1Image")],[getValue(data,"team2Name"),getValue(data,"team2Role"),getValue(data,"team2Image")],[getValue(data,"team3Name"),getValue(data,"team3Role"),getValue(data,"team3Image")]].map(([name, role, image], i) => (<Reveal key={name} delayMs={i*90} className="t-hover grid gap-5 border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5 md:grid-cols-[180px_1fr_auto]"><img src={image} alt="" className="h-44 w-full object-cover" /><div><p className="text-sm text-[var(--p)]">{role}</p><h3 className="mt-1 text-2xl font-bold">{name}</h3><p className="mt-3 leading-7 text-[var(--muted)]">התמחות באבחון אישי, עבודה עדינה וליווי אחרי הטיפול. כל מפגש מתועד כדי לשמור על המשכיות ותוצאה מדויקת.</p></div><div className="self-center text-center"><div className="t-display text-2xl sm:text-4xl text-[var(--p)]">{i+4}</div><p className="text-xs text-[var(--muted)]">שנות ניסיון</p></div></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="certifications" data-section-kind="certifications" className="beauty-artNails-certifications-frame-9 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[120px_1fr]">
            <div className="font-mono text-sm text-[var(--p)]">MUSE<div className="mt-3 h-24 w-px bg-[var(--p)]/50" /></div>
            <div className="border-l border-[var(--p)]/30 pl-0 lg:pl-8"><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"certsTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"certsText")}</p></Reveal><div className="mt-10 grid gap-4 md:grid-cols-4">{[[getValue(data,"galleryImage1"),"נהלי חיטוי"],[getValue(data,"itemOneImage"),"הכשרות מוצר"],[getValue(data,"galleryImage3"),"בטיחות לקוחה"],[getValue(data,"itemTwoImage"),"בדיקת חומרים"]].map(([image,title], i) => (<Reveal key={title} delayMs={i*70} className="t-hover overflow-hidden border border-[var(--p)]/30 bg-[var(--surface)]/70"><img src={image} alt="" className="h-36 w-full object-cover" /><div className="p-5 text-center"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">תעודה, רענון ויישום בפועל בצוות.</p></div></Reveal>))}</div></div>
          </div>
        </div>
      </section>
      <section data-template-section-type="timeline" data-section-kind="timeline" className="beauty-artNails-timeline-frame-0 relative isolate overflow-hidden px-5 py-12 md:py-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,color-mix(in_srgb,var(--p)_28%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--surface)_70%,transparent),transparent_58%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / timeline</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"timelineTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"aboutStoryText")}</p></Reveal><div className="mt-10 space-y-0 border-r border-[var(--p)]/40 pr-6">{[["2018","פתיחת החדר הראשון וקבלת לקוחות קבועות."],["2020","הוספת מערכת תורים ותיעוד דיגיטלי."],["2023","הרחבת הצוות והכשרות מתקדמות."],["2026","חלל חדש עם אזורי טיפול, המתנה ואבחון."]].map(([year,text], i) => (<Reveal key={year} delayMs={i*80} className="relative pb-8"><span className="absolute -right-[31px] top-1 h-3 w-3 rounded-full bg-[var(--p)]" /><div className="grid gap-3 md:grid-cols-[120px_1fr]"><strong className="t-display text-3xl text-[var(--p)]">{year}</strong><p className="leading-7 text-[var(--muted)]">{text}</p></div></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="pressQuotes" data-section-kind="pressQuotes" className="beauty-artNails-pressQuotes-frame-1 px-5 py-12 md:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="lg:sticky lg:top-28 lg:h-fit"><div className="t-shimmer mb-5 h-px w-32 bg-[var(--p)]" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / pressQuotes</p><div className="mt-6 t-display text-2xl md:text-5xl leading-none text-[var(--p)]">02</div></aside>
          <div><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"pressTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"pressText")}</p></Reveal><div className="mt-10 grid gap-5 md:grid-cols-3">{[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]].map(([text, name, role], i) => (<Reveal key={name} delayMs={i*80} className="t-hover bg-[var(--surface)]/70 p-6"><p className="text-xs font-bold tracking-[0.28em] text-[var(--p)]">BEAUTY NOTE {i+1}</p><p className="mt-4 text-lg leading-8">{text}</p><p className="mt-5 text-sm text-[var(--muted)]">{name} · {role}</p></Reveal>))}</div></div>
        </div>
      </section>
      <section data-template-section-type="aboutCta" data-section-kind="aboutCta" className="beauty-artNails-aboutCta-frame-2 overflow-hidden px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[3rem] border border-[var(--p)]/25 bg-[var(--surface)] px-6 py-14 shadow-2xl md:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / aboutCta</p>
          <Reveal className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]"><div><h2 className="t-display text-2xl md:text-5xl leading-tight text-[var(--p)]">{getValue(data,"aboutCtaTitle")}</h2><p className="mt-4 max-w-xl text-[var(--muted)]">{getValue(data,"ctaText")}</p></div><button type="button" onClick={() => goTo("booking")} className="t-pulse bg-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--dark)]">{getValue(data,"ctaButton")}</button></Reveal>
        </div>
      </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="beauty-artNails-footer-brutal border-t-4 border-[var(--p)] px-5 py-8 lg:px-8"><p className="t-display text-2xl font-black uppercase">{getValue(data,"brandName")}</p><p className="mt-2 text-sm">{getValue(data,"address")}</p></footer>
    </>
  );
}

function ServicesPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="servicesHero" data-section-kind="servicesHero" className="beauty-artNails-servicesHero-frame-3 px-5 py-12 md:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div className="order-2 md:order-1"><Reveal><div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end"><div><p className="text-xs font-bold tracking-[0.35em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p><h1 className="t-display t-anim mt-4 text-5xl leading-tight text-[var(--p)] md:text-7xl">{getValue(data,"servicesHeroTitle")}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data,"servicesIntroText")}</p></div><img src={getValue(data,"sectionImage")} alt="" className="t-ken min-h-[340px] w-full object-cover" /></div></Reveal></div>
          <div className="order-1 flex items-start justify-between border-r-4 border-[var(--p)] pr-5 md:order-2"><div><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / servicesHero</p></div><span className="text-xs text-[var(--muted)]">גלריית צבע</span></div>
        </div>
      </section>
      <section data-template-section-type="catalog" data-section-kind="catalog" className="beauty-artNails-catalog-frame-4 relative overflow-hidden bg-[var(--dark)] px-5 py-12 md:py-24 text-[var(--text)] lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--p)_18%,transparent),transparent)]" />
        <div className="relative mx-auto max-w-7xl border border-[var(--p)]/45 p-6 shadow-[0_0_44px_color-mix(in_srgb,var(--p)_18%,transparent)] md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / catalog</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"catalogTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"catalogText")}</p></Reveal><div className="mt-10 grid gap-5 md:grid-cols-2">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText"),"45-75 דק׳",getValue(data,"itemOneImage")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText"),"60-90 דק׳",getValue(data,"itemTwoImage")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText"),"30-60 דק׳",getValue(data,"itemThreeImage")],[getValue(data,"itemFourTitle"),getValue(data,"itemFourText"),"15-30 דק׳",getValue(data,"itemFourImage")]].map(([title, text, minutes, image], i) => (<Reveal key={title} delayMs={i*70} className="t-hover grid gap-4 overflow-hidden border border-[var(--p)]/25 bg-[var(--surface)]/70 p-4 md:grid-cols-[140px_1fr]"><img src={image} alt="" className="h-24 w-full object-cover" /><div><h3 className="text-2xl font-bold">{title}</h3><p className="mt-2 leading-7 text-[var(--muted)]">{text}</p><p className="mt-3 text-sm font-bold text-[var(--p)]">משך משוער: {minutes}</p></div></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="featuredTreatment" data-section-kind="featuredTreatment" className="beauty-artNails-featuredTreatment-frame-5 bg-[var(--bg)] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[var(--p)]/20 bg-[var(--surface)] p-7 shadow-xl md:p-12">
          <div className="mb-8 flex items-center gap-3"><span className="t-pulse h-2.5 w-2.5 rounded-full bg-[var(--p)]" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / featuredTreatment</p></div>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"featuredTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"featuredTreatmentText")}</p></Reveal><div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"><Reveal><img src={getValue(data,"itemOneImage")} alt="" className="t-ken h-full min-h-[460px] w-full object-cover" /></Reveal><Reveal delayMs={100} className="bg-[var(--surface)]/75 p-7"><h3 className="t-display text-2xl sm:text-4xl text-[var(--p)]">{getValue(data,"itemOneTitle")}</h3><p className="mt-4 leading-8 text-[var(--muted)]">{getValue(data,"featuredTreatmentText")}</p><ul className="mt-6 space-y-3 text-sm">{["אבחון לפני התחלה","עבודה בשכבות", "סיום עם המלצות בית"].map((item) => (<li key={item} className="border-b border-[var(--p)]/20 pb-3">{item}</li>))}</ul><button type="button" onClick={() => goTo("booking")} className="mt-7 bg-[var(--p)] px-7 py-3 text-sm font-bold text-[var(--dark)]">קביעת טיפול דגל</button></Reveal></div>
        </div>
      </section>
      <section data-template-section-type="durationGuide" data-section-kind="durationGuide" className="beauty-artNails-durationGuide-frame-6 overflow-hidden px-5 py-12 md:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[0.85fr_1.15fr_0.55fr]">
          <div className="min-h-28 bg-[var(--p)]/15 p-5"><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / durationGuide</p></div>
          <div className="bg-[var(--surface)] p-6 md:p-10"><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"durationTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"durationText")}</p></Reveal><div className="mt-10 overflow-hidden border border-[var(--p)]/30">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText"),"45-75 דק׳",getValue(data,"itemOneImage")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText"),"60-90 דק׳",getValue(data,"itemTwoImage")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText"),"30-60 דק׳",getValue(data,"itemThreeImage")],[getValue(data,"itemFourTitle"),getValue(data,"itemFourText"),"15-30 דק׳",getValue(data,"itemFourImage")]].map(([title, text, minutes, image], i) => (<Reveal key={title} delayMs={i*60} className="grid gap-3 border-b border-[var(--p)]/20 bg-[var(--surface)]/70 p-5 last:border-b-0 md:grid-cols-[96px_1fr_140px_1.4fr]"><img src={image} alt="" className="h-20 w-full object-cover" /><strong>{title}</strong><span className="text-[var(--p)]">{minutes}</span><span className="text-sm text-[var(--muted)]">{text}</span></Reveal>))}</div></div>
          <div className="t-float hidden border border-[var(--p)]/35 p-5 md:block"><span className="text-xs text-[var(--muted)]">גלריית צבע</span></div>
        </div>
      </section>
      <section data-template-section-type="addons" data-section-kind="addons" className="beauty-artNails-addons-frame-7 px-5 py-12 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl border-y border-[var(--p)]/35 py-10">
          <div className="mb-8 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-end"><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / addons</p><div className="h-px bg-[var(--p)]/30" /><span className="text-xs text-[var(--muted)]">גלריית צבע</span></div>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"addonsTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"addonsText")}</p></Reveal><div className="mt-10 flex flex-wrap gap-3">{["מסכת הרגעה","עיסוי קרקפת","אמפולת זוהר","תיקון מהיר","ייעוץ ביתי","צילום תוצאה"].map((item, i) => (<Reveal key={item} delayMs={i*45} className="t-hover rounded-full border border-[var(--p)]/35 bg-[var(--surface)]/70 px-5 py-3 text-sm font-bold">+ {item}</Reveal>))}</div><p className="mt-6 max-w-2xl text-[var(--muted)]">{getValue(data,"addonsText")}</p>
        </div>
      </section>
      <section data-template-section-type="beforeAfter" data-section-kind="beforeAfter" className="beauty-artNails-beforeAfter-frame-8 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--a)_16%,transparent),transparent)] px-5 py-12 md:py-24 text-center lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-8 h-16 w-px bg-[var(--p)]" />
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / beforeAfter</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"beforeAfterTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"beforeAfterText")}</p></Reveal><div className="mt-10 grid gap-5 lg:grid-cols-2"><Reveal className="relative overflow-hidden"><img src={getValue(data,"galleryImage1")} alt="" className="t-ken h-[420px] w-full object-cover opacity-75" /><span className="absolute right-4 top-4 bg-[var(--dark)] px-4 py-2 text-sm text-white">לפני</span></Reveal><Reveal delayMs={100} className="relative overflow-hidden"><img src={getValue(data,"galleryImage3")} alt="" className="t-ken h-[420px] w-full object-cover" /><span className="absolute right-4 top-4 bg-[var(--p)] px-4 py-2 text-sm font-bold text-[var(--dark)]">אחרי</span></Reveal></div>
        </div>
      </section>
      <section data-template-section-type="priceTable" data-section-kind="priceTable" className="beauty-artNails-priceTable-frame-9 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[120px_1fr]">
            <div className="font-mono text-sm text-[var(--p)]">MUSE<div className="mt-3 h-24 w-px bg-[var(--p)]/50" /></div>
            <div className="border-l border-[var(--p)]/30 pl-0 lg:pl-8"><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"priceTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"priceText")}</p></Reveal><div className="mt-10 grid gap-4">{[[getValue(data,"packageOneTitle"),getValue(data,"packageOnePrice"),getValue(data,"packageOneText")],[getValue(data,"packageTwoTitle"),getValue(data,"packageTwoPrice"),getValue(data,"packageTwoText")],[getValue(data,"packageThreeTitle"),getValue(data,"packageThreePrice"),getValue(data,"packageThreeText")]].map(([title, price, text], i) => (<Reveal key={title} delayMs={i*70} className="t-hover grid items-center gap-4 border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5 md:grid-cols-[1fr_120px_1fr_auto]"><h3 className="text-xl font-bold">{title}</h3><strong className="t-display text-3xl text-[var(--p)]">{price}</strong><p className="text-sm text-[var(--muted)]">{text}</p><button type="button" onClick={() => goTo("booking")} className="border border-[var(--p)] px-4 py-2 text-sm text-[var(--p)]">בחירה</button></Reveal>))}</div></div>
          </div>
        </div>
      </section>
      <section data-template-section-type="serviceFaq" data-section-kind="serviceFaq" className="beauty-artNails-serviceFaq-frame-0 relative isolate overflow-hidden px-5 py-12 md:py-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,color-mix(in_srgb,var(--p)_28%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--surface)_70%,transparent),transparent_58%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / serviceFaq</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"serviceFaqTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"servicesIntroText")}</p></Reveal><div className="mt-10 space-y-3">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q, a], i) => (<Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5"><summary className="cursor-pointer text-lg font-bold">{q}</summary><p className="mt-3 leading-7 text-[var(--muted)]">{a}</p></details></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="bookCta" data-section-kind="bookCta" className="beauty-artNails-bookCta-frame-1 px-5 py-12 md:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="lg:sticky lg:top-28 lg:h-fit"><div className="t-shimmer mb-5 h-px w-32 bg-[var(--p)]" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / bookCta</p><div className="mt-6 t-display text-2xl md:text-5xl leading-none text-[var(--p)]">02</div></aside>
          <div><Reveal className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]"><div><h2 className="t-display text-2xl md:text-5xl leading-tight text-[var(--p)]">{getValue(data,"bookCtaTitle")}</h2><p className="mt-4 max-w-xl text-[var(--muted)]">{getValue(data,"ctaText")}</p></div><button type="button" onClick={() => goTo("booking")} className="t-pulse bg-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--dark)]">{getValue(data,"ctaButton")}</button></Reveal></div>
        </div>
      </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="beauty-artNails-footer-brutal border-t-4 border-[var(--p)] px-5 py-8 lg:px-8"><p className="t-display text-2xl font-black uppercase">{getValue(data,"brandName")}</p><p className="mt-2 text-sm">{getValue(data,"address")}</p></footer>
    </>
  );
}

function BookingPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <section data-template-section-type="bookingHero" data-section-kind="bookingHero" className="beauty-artNails-bookingHero-frame-2 overflow-hidden px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[3rem] border border-[var(--p)]/25 bg-[var(--surface)] px-6 py-14 shadow-2xl md:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / bookingHero</p>
          <Reveal><h1 className="t-display t-anim text-5xl leading-tight text-[var(--p)] md:text-7xl">{getValue(data,"bookingHeroTitle")}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data,"ctaText")}</p></Reveal>
        </div>
      </section>
      <section data-section-kind="booking" data-bizuply-block="booking" data-template-section-type="booking" className="beauty-artNails-calendar-frame-3 px-5 py-12 md:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div className="order-2 md:order-1"><div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start"><Reveal><h2 className="t-display text-2xl sm:text-4xl text-[var(--p)]">{getValue(data,"calendarTitle")}</h2><p className="mt-4 text-[var(--muted)]">בחרו יום ושעה פנויה. הלוח כאן לשמירת תור מהירה מתוך התבנית.</p></Reveal><Reveal delayMs={100} className="t-glow bg-[var(--surface)]/80 p-5"><BookingCalendarPanel bold /></Reveal></div></div>
          <div className="order-1 flex items-start justify-between border-r-4 border-[var(--p)] pr-5 md:order-2"><div><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / calendar</p></div><span className="text-xs text-[var(--muted)]">גלריית צבע</span></div>
        </div>
      </section>
      <section data-template-section-type="servicePicker" data-section-kind="servicePicker" className="beauty-artNails-servicePicker-frame-4 relative overflow-hidden bg-[var(--dark)] px-5 py-12 md:py-24 text-[var(--text)] lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--p)_18%,transparent),transparent)]" />
        <div className="relative mx-auto max-w-7xl border border-[var(--p)]/45 p-6 shadow-[0_0_44px_color-mix(in_srgb,var(--p)_18%,transparent)] md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / servicePicker</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"servicePickerTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"catalogText")}</p></Reveal><div className="mt-8 grid gap-3 md:grid-cols-3">{[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText"),"45-75 דק׳",getValue(data,"itemOneImage")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText"),"60-90 דק׳",getValue(data,"itemTwoImage")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText"),"30-60 דק׳",getValue(data,"itemThreeImage")]].map(([title, text, minutes, image], i) => (<Reveal key={title} delayMs={i*70} className="t-hover cursor-pointer overflow-hidden border border-[var(--p)]/25 bg-[var(--surface)]/70"><img src={image} alt="" className="h-28 w-full object-cover" /><div className="p-5"><p className="text-sm font-bold text-[var(--p)]">{minutes}</p><h3 className="mt-2 font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></div></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="specialistPicker" data-section-kind="specialistPicker" className="beauty-artNails-specialistPicker-frame-5 bg-[var(--bg)] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[var(--p)]/20 bg-[var(--surface)] p-7 shadow-xl md:p-12">
          <div className="mb-8 flex items-center gap-3"><span className="t-pulse h-2.5 w-2.5 rounded-full bg-[var(--p)]" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / specialistPicker</p></div>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"specialistTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"specialistsText")}</p></Reveal><div className="mt-8 grid gap-4 md:grid-cols-3">{[[getValue(data,"team1Name"),getValue(data,"team1Role"),getValue(data,"team1Image")],[getValue(data,"team2Name"),getValue(data,"team2Role"),getValue(data,"team2Image")],[getValue(data,"team3Name"),getValue(data,"team3Role"),getValue(data,"team3Image")]].map(([name, role, image], i) => (<Reveal key={name} delayMs={i*70} className="t-hover bg-[var(--surface)]/70 p-5 text-center"><img src={image} alt="" className="mx-auto h-28 w-28 rounded-full object-cover" /><h3 className="mt-4 font-bold">{name}</h3><p className="mt-1 text-sm text-[var(--muted)]">{role}</p></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="hoursPanel" data-section-kind="hoursPanel" className="beauty-artNails-hoursPanel-frame-6 overflow-hidden px-5 py-12 md:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[0.85fr_1.15fr_0.55fr]">
          <div className="min-h-28 bg-[var(--p)]/15 p-5"><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / hoursPanel</p></div>
          <div className="bg-[var(--surface)] p-6 md:p-10"><Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"hoursTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"policyText")}</p></Reveal><Reveal className="mt-8 grid gap-4 md:grid-cols-3">{[["א-ה","09:00-20:00"],["ו","09:00-14:00"],["מענה","עד שעה לאישור"]].map(([d,h]) => (<div key={d} className="border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5"><p className="text-sm text-[var(--muted)]">{d}</p><strong className="text-2xl text-[var(--p)]">{h}</strong></div>))}</Reveal></div>
          <div className="t-float hidden border border-[var(--p)]/35 p-5 md:block"><span className="text-xs text-[var(--muted)]">גלריית צבע</span></div>
        </div>
      </section>
      <section data-template-section-type="policies" data-section-kind="policies" className="beauty-artNails-policies-frame-7 px-5 py-12 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl border-y border-[var(--p)]/35 py-10">
          <div className="mb-8 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-end"><p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / policies</p><div className="h-px bg-[var(--p)]/30" /><span className="text-xs text-[var(--muted)]">גלריית צבע</span></div>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"policiesTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"policyText")}</p></Reveal><div className="mt-8 grid gap-4 md:grid-cols-3">{["ביטול עד 24 שעות ללא חיוב","איחור מעל 15 דקות עלול לקצר טיפול","רגישות או מצב רפואי יש לעדכן מראש"].map((item, i) => (<Reveal key={item} delayMs={i*70} className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5"><span className="text-sm font-bold text-[var(--p)]">0{i+1}</span><p className="mt-3 leading-7 text-[var(--muted)]">{item}</p></Reveal>))}</div>
        </div>
      </section>
      <section data-template-section-type="confirmationForm" data-section-kind="confirmationForm" className="beauty-artNails-confirmationForm-frame-8 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--a)_16%,transparent),transparent)] px-5 py-12 md:py-24 text-center lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-8 h-16 w-px bg-[var(--p)]" />
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / confirmationForm</p>
          <Reveal className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"><div><h2 className="t-display text-2xl sm:text-4xl text-[var(--p)]">{getValue(data,"confirmTitle")}</h2><p className="mt-4 text-[var(--muted)]">{getValue(data,"contactText")}</p></div><form className="grid gap-3 bg-[var(--surface)]/70 p-6" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-id="beauty-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם."><input name="name" data-bizuply-form-field-id="name" autoComplete="name" className="border border-[var(--p)]/25 bg-transparent px-4 py-3 text-right outline-none" placeholder="שם מלא" /><input name="phone" type="tel" data-bizuply-form-field-id="phone" autoComplete="tel" className="border border-[var(--p)]/25 bg-transparent px-4 py-3 text-right outline-none" placeholder="טלפון" /><textarea name="message" data-bizuply-form-field-id="message" className="min-h-28 border border-[var(--p)]/25 bg-transparent px-4 py-3 text-right outline-none" placeholder="הערות" /><button type="submit" className="bg-[var(--p)] py-3.5 text-sm font-bold text-[var(--dark)]">{getValue(data,"contactButton")}</button></form></Reveal>
        </div>
      </section>
      <section data-template-section-type="locationMap" data-section-kind="locationMap" className="beauty-artNails-locationMap-frame-9 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[120px_1fr]">
            <div className="font-mono text-sm text-[var(--p)]">MUSE<div className="mt-3 h-24 w-px bg-[var(--p)]/50" /></div>
            <div className="border-l border-[var(--p)]/30 pl-0 lg:pl-8"><div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"><Reveal><h2 className="t-display text-2xl sm:text-4xl text-[var(--p)]">{getValue(data,"locationTitle")}</h2><p className="mt-4 text-[var(--muted)]">{getValue(data,"address")}</p><p className="mt-2 text-sm">{getValue(data,"phone")} · {getValue(data,"hours")}</p></Reveal><Reveal delayMs={100} className="relative overflow-hidden"><img src={getValue(data,"mapImage")} alt="" className="t-ken aspect-video w-full object-cover opacity-80" /><span className="absolute inset-0 grid place-items-center bg-[var(--dark)]/35 text-sm font-bold text-white">מפה · {getValue(data,"address")}</span></Reveal></div></div>
          </div>
        </div>
      </section>
      <section data-template-section-type="bookingFaq" data-section-kind="bookingFaq" className="beauty-artNails-bookingFaq-frame-0 relative isolate overflow-hidden px-5 py-12 md:py-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,color-mix(in_srgb,var(--p)_28%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--surface)_70%,transparent),transparent_58%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">MUSE / bookingFaq</p>
          <Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"bookingFaqTitle")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"policyText")}</p></Reveal><div className="mt-10 space-y-3">{[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]].map(([q, a], i) => (<Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5"><summary className="cursor-pointer text-lg font-bold">{q}</summary><p className="mt-3 leading-7 text-[var(--muted)]">{a}</p></details></Reveal>))}</div>
        </div>
      </section>
      <footer data-template-section-type="footer" data-section-kind="footer" className="beauty-artNails-footer-brutal border-t-4 border-[var(--p)] px-5 py-8 lg:px-8"><p className="t-display text-2xl font-black uppercase">{getValue(data,"brandName")}</p><p className="mt-2 text-sm">{getValue(data,"address")}</p></footer>
    </>
  );
}

export default function NailmusePages(props: NailmusePagesProps) {
  const {  initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId, businessId } = props;
  const baseData = useMemo(() => ({ ...nailmuseDefaultData, ...(data ?? {}) }), [data]);
  const mergedData = useCrmBookingServiceData(baseData, businessId);
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
    <div dir="rtl" data-template-id={mode === "preview" ? "nailmuse-preview" : "nailmuse"} className="min-h-screen w-full overflow-x-hidden" style={{ background: "#FFF9F0", color: "#5A1C05" }}>
      <style dangerouslySetInnerHTML={{ __html: nailmuseEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))}
      />
    </div>
  );
}
