import React, { useMemo } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { lunelleDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { lunelleEditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";
import { LunelleCrmServicesGrid, LunelleStoreGrid } from "./integrations";

export const lunellePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "shop", label: "חנות", slug: "/shop" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "prices", label: "מחירים", slug: "/prices" },
  { id: "booking", label: "קביעת תור", slug: "/booking" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const allowedPages = lunellePages.map((p) => p.id);

type LunellePagesProps = {
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
  isStudioStatic?: boolean;
};

type PageProps = {
  data: Record<string, any>;
  goTo: (id: string) => void;
  businessId?: string;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (lunelleDefaultData as Record<string, any>)[key] ?? "";
}

function galleryTileSpanClass(index: number) {
  if (index === 0 || index === 3) return "md:row-span-2";
  if (index === 6 || index === 7) return "md:col-span-2";
  return "";
}

function BookingCalendarPanel() {
  return (
    <div
      className="lunelle-booking-frame mt-6 min-h-[420px] w-full overflow-hidden rounded-[38px] bg-white p-3"
      dir="rtl"
      data-bizuply-widget="booking"
      data-bizuply-booking-mount="true"
      data-bizuply-crm-calendar="true"
      data-bizuply-booking-variant="month"
      data-bizuply-booking-chrome="embedded"
      data-bizuply-booking-surface="#ffffff"
      data-bizuply-booking-ink="#2a171c"
      data-bizuply-booking-soft="#fff7f1"
      data-bizuply-booking-line="rgba(42,23,28,0.12)"
      data-bizuply-booking-accent="#8a4f5f"
      data-bizuply-block="booking"
      data-bizuply-booking-frame="true"
      style={{ position: "relative", minHeight: 420, background: "#ffffff" }}
      aria-label="יומן פגישות מה-CRM"
    />
  );
}

function GalleryMosaic({ data }: { data: Record<string, any> }) {
  const images = [
    getValue(data, "galleryImage1"),
    getValue(data, "galleryImage2"),
    getValue(data, "galleryImage3"),
    getValue(data, "galleryImage4"),
    getValue(data, "galleryImage5"),
    getValue(data, "galleryImage6"),
    getValue(data, "galleryImage7"),
    getValue(data, "galleryImage8"),
  ];

  return (
    <div className="lunelle-gallery-grid mt-12 grid auto-rows-[240px] grid-cols-2 gap-4 md:auto-rows-[280px] md:grid-cols-4 md:gap-5">
      {images.map((src, index) => (
        <Reveal
          key={`gallery-${index}`}
          delayMs={index * 60}
          variant="scale"
          className={`lunelle-gallery-tile relative h-full min-h-[240px] overflow-hidden rounded-[34px] bg-[#f0d8dc] ${galleryTileSpanClass(index)}`}
        >
          <img
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </Reveal>
      ))}
    </div>
  );
}

function ContactForm({
  data,
  formId,
  titleKey = "contactTitle",
}: {
  data: Record<string, any>;
  formId: string;
  titleKey?: string;
}) {
  return (
    <form
      className="lunelle-contact-form relative z-10 rounded-[40px] bg-white p-8 shadow-[0_25px_80px_rgba(42,23,28,.08)] md:p-10"
      data-bizuply-block="lead-form"
      data-bizuply-form-id={formId}
      data-bizuply-crm-lead="true"
      data-bizuply-form-builder="true"
      data-bizuply-success-message="תודה! קיבלנו את ההודעה ונחזור אלייך בהקדם."
    >
      <p className="text-xs font-black tracking-[0.32em] text-[var(--p)]">
        {getValue(data, "navContact")}
      </p>
      <h2 className="lunelle-serif t-display mt-4 text-4xl font-black tracking-[-0.06em] text-[var(--text)] md:text-5xl">
        {getValue(data, titleKey)}
      </h2>
      <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
        {getValue(data, "contactText")}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <input
          name="name"
          data-bizuply-form-field-id="name"
          autoComplete="name"
          placeholder="שם מלא"
          className="rounded-3xl border border-[var(--text)]/10 bg-[var(--bg)] px-5 py-4 text-sm font-bold outline-none"
        />
        <input
          name="phone"
          type="tel"
          data-bizuply-form-field-id="phone"
          autoComplete="tel"
          placeholder="טלפון"
          className="rounded-3xl border border-[var(--text)]/10 bg-[var(--bg)] px-5 py-4 text-sm font-bold outline-none"
        />
      </div>

      <input
        name="email"
        type="email"
        data-bizuply-form-field-id="email"
        autoComplete="email"
        placeholder="אימייל"
        className="mt-4 w-full rounded-3xl border border-[var(--text)]/10 bg-[var(--bg)] px-5 py-4 text-sm font-bold outline-none"
      />

      <textarea
        name="message"
        data-bizuply-form-field-id="message"
        placeholder="כתבי כאן את ההודעה שלך"
        className="mt-4 min-h-[170px] w-full rounded-3xl border border-[var(--text)]/10 bg-[var(--bg)] px-5 py-4 text-sm font-bold outline-none"
      />

      <button
        type="submit"
        className="mt-5 w-full rounded-full bg-[var(--text)] px-8 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(42,23,28,.18)]"
      >
        {getValue(data, "contactButton")}
      </button>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-[var(--bg)] p-5">
          <p className="text-sm font-black">טלפון</p>
          <p className="mt-1 text-[var(--muted)]">{getValue(data, "phone")}</p>
        </div>
        <div className="rounded-3xl bg-[var(--bg)] p-5">
          <p className="text-sm font-black">אימייל</p>
          <p className="mt-1 text-[var(--muted)]">{getValue(data, "email")}</p>
        </div>
      </div>
    </form>
  );
}

function ContactSection({
  data,
  formId,
  titleKey,
}: {
  data: Record<string, any>;
  formId: string;
  titleKey?: string;
}) {
  return (
    <section
      data-template-section-type="contact"
      data-section-kind="contact"
      className="bg-[var(--bg)] px-5 py-24"
    >
      <div className="mx-auto grid max-w-7xl items-stretch gap-8 lg:grid-cols-[1fr_.8fr]">
        <Reveal>
          <ContactForm data={data} formId={formId} titleKey={titleKey} />
        </Reveal>
        <div className="lunelle-contact-media relative z-0 min-h-[360px] overflow-hidden rounded-[40px] bg-[#f1d7dc] shadow-[0_25px_80px_rgba(42,23,28,.12)] lg:min-h-[620px]">
          <img
            src={getValue(data, "contactImage")}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function Header({
  data,
  currentPage,
  goTo,
}: {
  data: Record<string, any>;
  currentPage: string;
  goTo: (id: string) => void;
}) {
  const navItems = [
    { id: "home", label: getValue(data, "navHome") || "בית" },
    { id: "about", label: getValue(data, "navAbout") || "אודות" },
    { id: "services", label: getValue(data, "navServices") || "שירותים" },
    { id: "shop", label: getValue(data, "navShop") || "חנות" },
    { id: "gallery", label: getValue(data, "navGallery") || "גלריה" },
    { id: "prices", label: getValue(data, "navPrices") || "מחירים" },
    { id: "booking", label: getValue(data, "navBooking") || "קביעת תור" },
    { id: "contact", label: getValue(data, "navContact") || "צור קשר" },
  ];

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b border-[var(--text)]/10 bg-[var(--bg)]/90 text-[var(--text)] backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => goTo("home")}
          className="lunelle-serif t-display text-2xl font-black tracking-[-0.05em] text-[var(--text)]"
        >
          {getValue(data, "brandName")}
        </button>

        <nav className="flex flex-wrap justify-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(item.id)}
              className={
                "rounded-full px-3 py-1.5 text-sm font-bold transition " +
                (currentPage === item.id
                  ? "bg-[var(--text)] text-white"
                  : "bg-[var(--surface)] text-[var(--muted)]")
              }
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => goTo("booking")}
          className="rounded-full bg-[var(--text)] px-7 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(42,23,28,.16)]"
        >
          {getValue(data, "heroPrimaryButton")}
        </button>
      </div>
    </header>
  );
}

function Footer({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (id: string) => void;
}) {
  const links = [
    { id: "about", label: getValue(data, "navAbout") || "אודות" },
    { id: "services", label: getValue(data, "navServices") || "שירותים" },
    { id: "shop", label: getValue(data, "navShop") || "חנות" },
    { id: "gallery", label: getValue(data, "navGallery") || "גלריה" },
    { id: "prices", label: getValue(data, "navPrices") || "מחירים" },
    { id: "booking", label: getValue(data, "navBooking") || "קביעת תור" },
    { id: "contact", label: getValue(data, "navContact") || "צור קשר" },
  ];

  return (
    <footer
      data-template-section-type="footer"
      data-section-kind="footer"
      className="bg-[#2a171c] px-6 py-14 text-white"
    >
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div>
          <p className="lunelle-serif t-display text-3xl font-black tracking-[-0.05em]">
            {getValue(data, "brandName")}
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/60">
            {getValue(data, "heroSubtitle")}
          </p>
          <p className="mt-4 text-sm text-white/60">{getValue(data, "address")}</p>
          <p className="mt-1 text-sm text-white/60">{getValue(data, "phone")}</p>
        </div>

        <div>
          <p className="font-black">ניווט</p>
          <div className="mt-4 grid gap-3 text-sm text-white/60">
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => goTo(link.id)}
                className="text-right transition hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-black">יצירת קשר</p>
          <div className="mt-4 grid gap-3 text-sm text-white/60">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "hours")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ data, goTo, businessId }: PageProps) {
  const packages = [
    [
      getValue(data, "packageOneTitle"),
      getValue(data, "packageOnePrice"),
      getValue(data, "packageOneText"),
    ],
    [
      getValue(data, "packageTwoTitle"),
      getValue(data, "packageTwoPrice"),
      getValue(data, "packageTwoText"),
    ],
    [
      getValue(data, "packageThreeTitle"),
      getValue(data, "packageThreePrice"),
      getValue(data, "packageThreeText"),
    ],
  ];

  return (
    <>
      <section
        data-template-section-type="hero"
        data-section-kind="hero"
        className="lunelle-hero relative overflow-x-clip bg-[var(--bg)] px-5 pb-24 pt-16 lg:pb-28 lg:pt-20"
      >
        <div className="pointer-events-none absolute right-[-160px] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#f2c7cf]/45 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-180px] left-[-140px] h-[440px] w-[440px] rounded-full bg-[#e8b8c1]/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_.98fr]">
            <Reveal
              variant="scale"
              delayMs={100}
              className="order-2 lg:order-1"
            >
              <div className="relative mx-auto max-w-[560px]">
                <div className="lunelle-hero-chip absolute -right-4 top-10 z-20 rounded-full bg-[var(--text)] px-5 py-3 text-xs font-black text-white shadow-[0_22px_60px_rgba(42,23,28,.24)] sm:-right-8 sm:px-6 sm:py-4 sm:text-sm">
                  {getValue(data, "heroChip")}
                </div>

                <div className="absolute -left-4 bottom-14 z-20 rounded-[28px] border border-white/60 bg-white/90 p-4 shadow-[0_24px_70px_rgba(42,23,28,.16)] backdrop-blur-2xl sm:-left-8 sm:p-5">
                  <p className="text-[10px] font-black tracking-[0.22em] text-[var(--p)]">
                    {getValue(data, "heroSlotLabel")}
                  </p>
                  <p className="mt-2 text-xl font-black tracking-[-0.04em] text-[var(--text)] sm:text-2xl">
                    {getValue(data, "heroSlotValue")}
                  </p>
                </div>

                <div className="overflow-hidden rounded-[46px] border-[10px] border-white bg-[#f1d7dc] shadow-[0_35px_100px_rgba(42,23,28,.18)]">
                  <img
                    src={getValue(data, "heroImage")}
                    alt=""
                    className="h-[520px] w-full object-cover md:h-[650px]"
                  />
                </div>

                <div className="absolute -bottom-8 right-8 z-20 w-[160px] overflow-hidden rounded-[34px] border-[8px] border-white bg-[#f1d7dc] shadow-[0_26px_80px_rgba(42,23,28,.18)] sm:-bottom-10 sm:right-16 sm:w-[210px]">
                  <img
                    src={getValue(data, "heroDetailImage")}
                    alt=""
                    className="h-[180px] w-full object-cover sm:h-[220px]"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal className="order-1 text-center lg:order-2 lg:text-right">
              <p className="text-xs font-black tracking-[0.36em] text-[var(--p)]">
                {getValue(data, "heroEyebrow")}
              </p>
              <h1 className="lunelle-serif t-display mx-auto mt-6 max-w-4xl whitespace-pre-line text-5xl font-black leading-[0.9] tracking-[-0.07em] text-[var(--text)] md:text-7xl lg:mx-0 lg:text-[104px] lg:leading-[0.86]">
                {getValue(data, "heroTitle")}
              </h1>
              <p className="mx-auto mt-8 max-w-xl text-lg leading-9 text-[var(--muted)] lg:mx-0">
                {getValue(data, "heroSubtitle")}
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
                <button
                  type="button"
                  onClick={() => goTo("booking")}
                  className="rounded-full bg-[var(--text)] px-9 py-4 text-sm font-black text-white shadow-[0_20px_45px_rgba(42,23,28,.22)]"
                >
                  {getValue(data, "heroPrimaryButton")}
                </button>
                <button
                  type="button"
                  onClick={() => goTo("gallery")}
                  className="rounded-full border border-[var(--text)]/12 bg-white px-9 py-4 text-sm font-black text-[var(--text)] shadow-[0_14px_35px_rgba(42,23,28,.06)]"
                >
                  {getValue(data, "heroSecondaryButton")}
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section
        data-template-section-type="services"
        data-section-kind="services"
        className="bg-white px-5 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1fr] lg:items-end">
            <Reveal>
              <p className="text-xs font-black tracking-[0.32em] text-[var(--p)]">
                {getValue(data, "navServices")}
              </p>
              <h2 className="lunelle-serif t-display mt-4 text-5xl font-black leading-[.9] tracking-[-0.06em] text-[var(--text)] md:text-7xl">
                {getValue(data, "sectionTwoTitle")}
              </h2>
            </Reveal>
            <Reveal delayMs={80}>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
                {getValue(data, "servicesIntroText")}
              </p>
            </Reveal>
          </div>

          <div
            className="mt-14"
            data-bizuply-crm-services="true"
            data-lunelle-crm-services="true"
          >
            <LunelleCrmServicesGrid businessId={businessId} />
          </div>
        </div>
      </section>

      <section
        data-template-section-type="about"
        data-section-kind="about"
        className="bg-[var(--bg)] px-5 py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.95fr_1.05fr]">
          <Reveal>
            <p className="text-xs font-black tracking-[0.32em] text-[var(--p)]">
              {getValue(data, "aboutStoryTitle")}
            </p>
            <h2 className="lunelle-serif t-display mt-5 text-5xl font-black leading-[.92] tracking-[-0.06em] text-[var(--text)] md:text-7xl">
              {getValue(data, "aboutHeroTitle")}
            </h2>
            <p className="mt-7 text-lg leading-9 text-[var(--muted)]">
              {getValue(data, "aboutStoryText")}
            </p>
            <div className="mt-9 grid gap-4 md:grid-cols-2">
              <div className="rounded-[30px] border border-[var(--text)]/10 bg-white p-7 shadow-[0_20px_65px_rgba(42,23,28,.06)]">
                <p className="text-xl font-black text-[var(--text)]">
                  {getValue(data, "valueOneTitle")}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  {getValue(data, "valueOneText")}
                </p>
              </div>
              <div className="rounded-[30px] border border-[var(--text)]/10 bg-white p-7 shadow-[0_20px_65px_rgba(42,23,28,.06)]">
                <p className="text-xl font-black text-[var(--text)]">
                  {getValue(data, "valueTwoTitle")}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  {getValue(data, "valueTwoText")}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={100} className="grid grid-cols-2 gap-5">
            <div className="overflow-hidden rounded-[38px] bg-[#f1d7dc] shadow-[0_26px_80px_rgba(42,23,28,.12)]">
              <img
                src={getValue(data, "aboutImage")}
                alt=""
                className="h-[420px] w-full object-cover md:h-[520px]"
              />
            </div>
            <div className="mt-14 overflow-hidden rounded-[38px] bg-[#f1d7dc] shadow-[0_26px_80px_rgba(42,23,28,.12)]">
              <img
                src={getValue(data, "aboutImageTwo")}
                alt=""
                className="h-[420px] w-full object-cover md:h-[520px]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section
        data-template-section-type="gallery"
        data-section-kind="gallery"
        className="bg-white px-5 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <p className="text-xs font-black tracking-[0.32em] text-[var(--p)]">
                {getValue(data, "navGallery")}
              </p>
              <h2 className="lunelle-serif t-display mt-4 text-5xl font-black tracking-[-0.06em] text-[var(--text)] md:text-7xl">
                {getValue(data, "sectionFourTitle")}
              </h2>
            </Reveal>
            <Reveal delayMs={80}>
              <p className="max-w-md text-sm leading-7 text-[var(--muted)]">
                {getValue(data, "galleryText")}
              </p>
            </Reveal>
          </div>
          <GalleryMosaic data={data} />
        </div>
      </section>

      <section
        data-template-section-type="prices"
        data-section-kind="prices"
        className="bg-[#fff1e7] px-5 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black tracking-[0.32em] text-[var(--p)]">
              {getValue(data, "navPrices")}
            </p>
            <h2 className="lunelle-serif t-display mt-4 text-5xl font-black tracking-[-0.06em] text-[var(--text)] md:text-7xl">
              {getValue(data, "sectionSevenTitle")}
            </h2>
            <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
              {getValue(data, "priceText")}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {packages.map(([title, price, text], index) => (
              <Reveal
                key={title}
                delayMs={index * 80}
                className="relative overflow-hidden rounded-[34px] border border-[var(--text)]/10 bg-white p-7 shadow-[0_24px_75px_rgba(42,23,28,.07)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff1e7] text-sm font-black text-[var(--p)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="rounded-full bg-[var(--text)] px-5 py-2 text-lg font-black text-white">
                    {price}
                  </div>
                </div>
                <h3 className="lunelle-serif mt-7 text-3xl font-black tracking-[-0.05em] text-[var(--text)]">
                  {title}
                </h3>
                <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{text}</p>
                <button
                  type="button"
                  onClick={() => goTo("booking")}
                  className="mt-7 inline-flex rounded-full border border-[var(--text)]/12 bg-[var(--bg)] px-6 py-3 text-sm font-black text-[var(--text)]"
                >
                  לבחור טיפול
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        data-template-section-type="shop"
        data-section-kind="shop"
        data-bizuply-block="store"
        className="bg-[var(--bg)] px-5 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-black tracking-[0.32em] text-[var(--p)]">
              {getValue(data, "navShop")}
            </p>
            <h2 className="lunelle-serif t-display mt-4 text-5xl font-black tracking-[-0.06em] text-[var(--text)] md:text-7xl">
              {getValue(data, "shopTitle")}
            </h2>
            <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
              {getValue(data, "shopText")}
            </p>
          </Reveal>
          <div
            className="mt-12 min-h-[280px]"
            data-bizuply-store-mount="true"
            data-lunelle-store-mount="true"
            data-bizuply-block="store"
          >
            <LunelleStoreGrid businessId={businessId} />
          </div>
        </div>
      </section>

      <section
        data-template-section-type="booking"
        data-section-kind="booking"
        data-bizuply-block="booking"
        className="bg-[#2a171c] px-5 py-24 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <Reveal>
            <p className="text-xs font-black tracking-[0.32em] text-[#d6a24a]">
              {getValue(data, "navBooking")}
            </p>
            <h2 className="lunelle-serif t-display mt-5 text-5xl font-black leading-[.95] tracking-[-0.06em] md:text-7xl">
              {getValue(data, "bookingTeaserTitle")}
            </h2>
            <p className="mt-7 text-lg leading-9 text-white/60">
              {getValue(data, "bookingTeaserText")}
            </p>
          </Reveal>
          <Reveal delayMs={100}>
            <BookingCalendarPanel />
          </Reveal>
        </div>
      </section>

      <ContactSection data={data} formId="lunelle-contact" />
      <Footer data={data} goTo={goTo} />
    </>
  );
}

function AboutPage({ data, goTo }: PageProps) {
  const values = [
    [getValue(data, "valueOneTitle"), getValue(data, "valueOneText")],
    [getValue(data, "valueTwoTitle"), getValue(data, "valueTwoText")],
    ["סטודיו שקט", "תורים מרווחים, אווירה רגועה וטיפול בלי לחץ."],
    ["חומרים נבחרים", "גוונים עדינים וגימור נקי שנשאר יפה לאורך זמן."],
  ];

  return (
    <>
      <section
        data-template-section-type="aboutHero"
        data-section-kind="aboutHero"
        className="bg-[var(--bg)] px-5 py-20 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <Reveal>
            <p className="text-xs font-black tracking-[0.32em] text-[var(--p)]">
              {getValue(data, "navAbout")}
            </p>
            <h1 className="lunelle-serif t-display mt-5 text-5xl font-black leading-[.92] tracking-[-0.06em] text-[var(--text)] md:text-7xl">
              {getValue(data, "aboutHeroTitle")}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-[var(--muted)]">
              {getValue(data, "aboutStoryText")}
            </p>
          </Reveal>
          <Reveal delayMs={100} variant="scale">
            <div className="overflow-hidden rounded-[40px] border-[8px] border-white bg-[#f1d7dc] shadow-[0_30px_90px_rgba(42,23,28,.14)]">
              <img
                src={getValue(data, "aboutImage")}
                alt=""
                className="min-h-[360px] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section
        data-template-section-type="story"
        data-section-kind="story"
        className="bg-white px-5 py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <Reveal>
            <img
              src={getValue(data, "sectionImage")}
              alt=""
              className="min-h-[420px] w-full rounded-[38px] object-cover"
            />
          </Reveal>
          <Reveal delayMs={80}>
            <p className="text-xs font-black tracking-[0.32em] text-[var(--p)]">
              {getValue(data, "aboutStoryTitle")}
            </p>
            <h2 className="lunelle-serif t-display mt-4 text-4xl font-black tracking-[-0.06em] text-[var(--text)] md:text-6xl">
              {getValue(data, "aboutStoryTitle")}
            </h2>
            <p className="mt-6 text-lg leading-9 text-[var(--muted)]">
              {getValue(data, "aboutStoryText")}
            </p>
            <div className="mt-8 grid gap-4">
              {[
                "כל תור מוקדש לך בלבד — בלי לחץ ובלי פס ייצור.",
                "מתאימות צבע, צורה וסגנון לפי מה שאת אוהבת באמת.",
                "עבודה עדינה עם דגש על ניקיון, נוחות וגימור מדויק.",
              ].map((text, index) => (
                <div
                  key={text}
                  className="rounded-[28px] border border-[var(--text)]/10 bg-[var(--bg)] p-6"
                >
                  <span className="text-sm font-black text-[var(--p)]">
                    0{index + 1}
                  </span>
                  <p className="mt-3 leading-7 text-[var(--muted)]">{text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section
        data-template-section-type="values"
        data-section-kind="values"
        className="bg-[var(--bg)] px-5 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-black tracking-[0.32em] text-[var(--p)]">
              ערכים
            </p>
            <h2 className="lunelle-serif t-display mt-4 text-5xl font-black tracking-[-0.06em] text-[var(--text)] md:text-6xl">
              {getValue(data, "valuesTitle")}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {values.map(([title, text], index) => (
              <Reveal
                key={title}
                delayMs={index * 70}
                className="rounded-[34px] border border-[var(--text)]/10 bg-white p-8 shadow-[0_20px_60px_rgba(42,23,28,.06)]"
              >
                <span className="text-sm font-black text-[var(--p)]">
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-2xl font-black text-[var(--text)]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        data-template-section-type="aboutCta"
        data-section-kind="aboutCta"
        className="bg-white px-5 py-20"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[40px] bg-[#2a171c] px-8 py-12 text-white md:flex-row md:items-center md:px-12">
          <Reveal>
            <h2 className="lunelle-serif t-display text-4xl font-black tracking-[-0.05em] md:text-5xl">
              {getValue(data, "ctaTitle")}
            </h2>
            <p className="mt-4 max-w-xl text-white/65">
              {getValue(data, "ctaText")}
            </p>
          </Reveal>
          <Reveal delayMs={80}>
            <button
              type="button"
              onClick={() => goTo("booking")}
              className="rounded-full bg-white px-9 py-4 text-sm font-black text-[#2a171c]"
            >
              {getValue(data, "ctaButton")}
            </button>
          </Reveal>
        </div>
      </section>

      <Footer data={data} goTo={goTo} />
    </>
  );
}

function ServicesPage({ data, goTo, businessId }: PageProps) {
  return (
    <>
      <section
        data-template-section-type="servicesHero"
        data-section-kind="servicesHero"
        className="bg-[var(--bg)] px-5 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-black tracking-[0.32em] text-[var(--p)]">
              {getValue(data, "navServices")}
            </p>
            <h1 className="lunelle-serif t-display mt-5 max-w-4xl text-5xl font-black tracking-[-0.06em] text-[var(--text)] md:text-7xl">
              {getValue(data, "servicesHeroTitle")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              {getValue(data, "catalogText")}
            </p>
          </Reveal>
        </div>
      </section>

      <section
        data-template-section-type="catalog"
        data-section-kind="catalog"
        className="bg-white px-5 pb-24"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="lunelle-serif t-display text-4xl font-black tracking-[-0.06em] text-[var(--text)] md:text-5xl">
              {getValue(data, "catalogTitle")}
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)]">
              {getValue(data, "servicesIntroText")}
            </p>
          </Reveal>
          <div
            className="mt-12"
            data-bizuply-crm-services="true"
            data-lunelle-crm-services="true"
          >
            <LunelleCrmServicesGrid businessId={businessId} />
          </div>
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => goTo("booking")}
              className="rounded-full bg-[var(--text)] px-9 py-4 text-sm font-black text-white"
            >
              {getValue(data, "ctaButton")}
            </button>
          </div>
        </div>
      </section>

      <Footer data={data} goTo={goTo} />
    </>
  );
}

function ShopPage({ data, goTo, businessId }: PageProps) {
  return (
    <>
      <section
        data-template-section-type="shopHero"
        data-section-kind="shopHero"
        className="bg-[var(--bg)] px-5 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-black tracking-[0.32em] text-[var(--p)]">
              {getValue(data, "navShop")}
            </p>
            <h1 className="lunelle-serif t-display mt-5 text-5xl font-black tracking-[-0.06em] text-[var(--text)] md:text-7xl">
              {getValue(data, "shopHeroTitle")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              {getValue(data, "shopText")}
            </p>
          </Reveal>
        </div>
      </section>

      <section
        data-template-section-type="shop"
        data-section-kind="shop"
        data-bizuply-block="store"
        className="bg-white px-5 pb-24"
      >
        <div className="mx-auto max-w-7xl">
          <div
            className="min-h-[320px]"
            data-bizuply-store-mount="true"
            data-lunelle-store-mount="true"
            data-bizuply-block="store"
          >
            <LunelleStoreGrid businessId={businessId} />
          </div>
        </div>
      </section>

      <Footer data={data} goTo={goTo} />
    </>
  );
}

function GalleryPage({ data, goTo }: PageProps) {
  return (
    <>
      <section
        data-template-section-type="gallery"
        data-section-kind="gallery"
        className="bg-white px-5 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-black tracking-[0.32em] text-[var(--p)]">
              {getValue(data, "navGallery")}
            </p>
            <h1 className="lunelle-serif t-display mt-4 text-5xl font-black tracking-[-0.06em] text-[var(--text)] md:text-7xl">
              {getValue(data, "galleryHeroTitle")}
            </h1>
            <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
              {getValue(data, "galleryText")}
            </p>
          </Reveal>
          <GalleryMosaic data={data} />
        </div>
      </section>
      <Footer data={data} goTo={goTo} />
    </>
  );
}

function PricesPage({ data, goTo }: PageProps) {
  const packages = [
    [
      getValue(data, "packageOneTitle"),
      getValue(data, "packageOnePrice"),
      getValue(data, "packageOneText"),
    ],
    [
      getValue(data, "packageTwoTitle"),
      getValue(data, "packageTwoPrice"),
      getValue(data, "packageTwoText"),
    ],
    [
      getValue(data, "packageThreeTitle"),
      getValue(data, "packageThreePrice"),
      getValue(data, "packageThreeText"),
    ],
  ];

  const services = [
    [
      getValue(data, "itemOneTitle"),
      getValue(data, "itemOneText"),
      getValue(data, "itemOnePrice"),
      getValue(data, "itemOneTime"),
    ],
    [
      getValue(data, "itemTwoTitle"),
      getValue(data, "itemTwoText"),
      getValue(data, "itemTwoPrice"),
      getValue(data, "itemTwoTime"),
    ],
    [
      getValue(data, "itemThreeTitle"),
      getValue(data, "itemThreeText"),
      getValue(data, "itemThreePrice"),
      getValue(data, "itemThreeTime"),
    ],
    [
      getValue(data, "itemFourTitle"),
      getValue(data, "itemFourText"),
      getValue(data, "itemFourPrice"),
      getValue(data, "itemFourTime"),
    ],
  ];

  return (
    <>
      <section
        data-template-section-type="prices"
        data-section-kind="prices"
        className="bg-[#fff1e7] px-5 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black tracking-[0.32em] text-[var(--p)]">
              {getValue(data, "navPrices")}
            </p>
            <h1 className="lunelle-serif t-display mt-4 text-5xl font-black tracking-[-0.06em] text-[var(--text)] md:text-7xl">
              {getValue(data, "pricesHeroTitle")}
            </h1>
            <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
              {getValue(data, "priceText")}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {packages.map(([title, price, text], index) => (
              <Reveal
                key={title}
                delayMs={index * 80}
                className="rounded-[34px] border border-[var(--text)]/10 bg-white p-7 shadow-[0_24px_75px_rgba(42,23,28,.07)]"
              >
                <div className="rounded-full bg-[var(--text)] px-5 py-2 text-lg font-black text-white inline-block">
                  {price}
                </div>
                <h3 className="lunelle-serif mt-6 text-3xl font-black tracking-[-0.05em] text-[var(--text)]">
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
                <button
                  type="button"
                  onClick={() => goTo("booking")}
                  className="mt-7 text-sm font-black text-[var(--p)]"
                >
                  בחירת חבילה
                </button>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 overflow-hidden rounded-[34px] border border-[var(--text)]/10 bg-white">
            {services.map(([title, text, price, time], index) => (
              <Reveal
                key={title}
                delayMs={index * 50}
                className="grid gap-3 border-b border-[var(--text)]/10 p-6 last:border-b-0 md:grid-cols-[1fr_140px_1.4fr_auto] md:items-center"
              >
                <strong className="text-lg text-[var(--text)]">{title}</strong>
                <span className="text-[var(--p)] font-black">{price}</span>
                <span className="text-sm text-[var(--muted)]">{text}</span>
                <span className="text-sm font-bold text-[var(--muted)]">{time}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Footer data={data} goTo={goTo} />
    </>
  );
}

function BookingPage({ data, goTo }: PageProps) {
  return (
    <>
      <section
        data-template-section-type="bookingHero"
        data-section-kind="bookingHero"
        className="bg-[#2a171c] px-5 py-20 text-white"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-black tracking-[0.32em] text-[#d6a24a]">
              {getValue(data, "navBooking")}
            </p>
            <h1 className="lunelle-serif t-display mt-5 text-5xl font-black leading-[.95] tracking-[-0.06em] md:text-7xl">
              {getValue(data, "bookingHeroTitle")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
              {getValue(data, "bookingTeaserText")}
            </p>
          </Reveal>
        </div>
      </section>

      <section
        data-template-section-type="booking"
        data-section-kind="booking"
        data-bizuply-block="booking"
        className="bg-[#2a171c] px-5 pb-24 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
          <Reveal>
            <h2 className="lunelle-serif t-display text-4xl font-black tracking-[-0.05em] md:text-5xl">
              {getValue(data, "calendarTitle")}
            </h2>
            <p className="mt-4 text-white/60">
              {getValue(data, "bookingTeaserText")}
            </p>
          </Reveal>
          <Reveal delayMs={100}>
            <BookingCalendarPanel />
          </Reveal>
        </div>
      </section>

      <section
        data-template-section-type="policies"
        data-section-kind="policies"
        className="bg-[var(--bg)] px-5 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-black tracking-[0.32em] text-[var(--p)]">
              מדיניות
            </p>
            <h2 className="lunelle-serif t-display mt-4 text-4xl font-black tracking-[-0.06em] text-[var(--text)] md:text-5xl">
              {getValue(data, "policiesTitle")}
            </h2>
            <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
              {getValue(data, "policyText")}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              "ביטול עד 24 שעות ללא חיוב",
              "איחור מעל 15 דקות עלול לקצר טיפול",
              "רגישות או מצב רפואי יש לעדכן מראש",
            ].map((item, index) => (
              <Reveal
                key={item}
                delayMs={index * 70}
                className="rounded-[30px] border border-[var(--text)]/10 bg-white p-6 shadow-[0_18px_55px_rgba(42,23,28,.06)]"
              >
                <span className="text-sm font-black text-[var(--p)]">
                  0{index + 1}
                </span>
                <p className="mt-3 leading-7 text-[var(--muted)]">{item}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => goTo("contact")}
              className="rounded-full border border-[var(--text)]/12 bg-white px-8 py-3 text-sm font-black text-[var(--text)]"
            >
              {getValue(data, "navContact")}
            </button>
          </div>
        </div>
      </section>

      <Footer data={data} goTo={goTo} />
    </>
  );
}

function ContactPage({ data, goTo }: PageProps) {
  return (
    <>
      <ContactSection
        data={data}
        formId="lunelle-contact-page"
        titleKey="contactPageTitle"
      />
      <Footer data={data} goTo={goTo} />
    </>
  );
}

export default function LunellePages(props: LunellePagesProps) {
  const {
    initialPage = "home",
    mode = "preview",
    data,
    onPageChange,
    isPublic,
    viewMode,
    runtimeMode,
    page,
    pageId,
    initialPageId,
    activePageId,
    currentPageId,
    businessId,
  } = props;

  const mergedData = useMemo(
    () => ({ ...lunelleDefaultData, ...(data ?? {}) }),
    [data],
  );

  const { currentPage, goTo } = useTemplatePageNavigation(
    {
      page,
      pageId,
      initialPage,
      initialPageId,
      activePageId,
      currentPageId,
      onPageChange,
      isPublic,
      viewMode,
      runtimeMode,
    },
    { allowedPages, fallbackPage: "home" },
  );

  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={mergedData} goTo={goTo} businessId={businessId} />,
    about: <AboutPage data={mergedData} goTo={goTo} businessId={businessId} />,
    services: (
      <ServicesPage data={mergedData} goTo={goTo} businessId={businessId} />
    ),
    shop: <ShopPage data={mergedData} goTo={goTo} businessId={businessId} />,
    gallery: (
      <GalleryPage data={mergedData} goTo={goTo} businessId={businessId} />
    ),
    prices: (
      <PricesPage data={mergedData} goTo={goTo} businessId={businessId} />
    ),
    booking: (
      <BookingPage data={mergedData} goTo={goTo} businessId={businessId} />
    ),
    contact: (
      <ContactPage data={mergedData} goTo={goTo} businessId={businessId} />
    ),
  };

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "lunelle-preview" : "lunelle"}
      className="lunelle-template-root min-h-screen w-full overflow-x-hidden"
      style={
        {
          background: "#FFF7F1",
          color: "#2A171C",
          ["--bg" as string]: "#FFF7F1",
          ["--text" as string]: "#2A171C",
          ["--p" as string]: "#8a4f5f",
          ["--surface" as string]: "#ffffff",
          ["--muted" as string]: "rgba(42,23,28,0.6)",
        } as React.CSSProperties
      }
    >
      <style dangerouslySetInnerHTML={{ __html: lunelleEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={Object.entries(pageContent).map(([id, content]) => ({
          id,
          content,
        }))}
      />
    </div>
  );
}
