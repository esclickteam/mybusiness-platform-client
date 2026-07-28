import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { savoryDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { savoryEditorCss } from "./editorCss";

export const savoryPages = [{ id: "home", label: "בית", slug: "/" }];

type SavoryPagesProps = {
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
  return data?.[key] ?? (savoryDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  const navItems = [
    [getValue(data, "navHome"), "#home"],
    [getValue(data, "navMenu"), "#menu"],
    [getValue(data, "navChef"), "#chef"],
    [getValue(data, "navEvents"), "#events"],
  ];

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[rgba(10,9,8,0.82)] backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-5 lg:px-8">
        <a href="#home" className="flex items-center gap-3 text-[var(--s-text)]">
          <span className="grid h-11 w-11 place-items-center border border-[var(--s-primary)] text-sm font-extrabold tracking-[0.18em] text-[var(--s-primary)]">
            {getValue(data, "logoText")}
          </span>
          <span className="s-display s-latin text-2xl font-bold leading-none tracking-[-0.04em]">
            {getValue(data, "brandName")}
          </span>
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="s-underline-grow text-sm font-semibold text-[var(--s-muted)] transition hover:text-[var(--s-text)]"
            >
              {label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={openModal}
          className="s-button-primary hidden px-6 py-3 text-sm sm:inline-flex"
        >
          {getValue(data, "heroPrimaryButton")}
        </button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="home" data-template-section-type="hero" className="min-h-[100svh] border-b border-white/10 bg-[var(--s-bg)]">
      <div className="grid min-h-[100svh] lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative z-10 flex min-h-[68svh] items-end bg-[var(--s-bg)] px-5 pb-14 pt-32 md:min-h-[100svh] lg:items-center lg:px-8 lg:pb-0">
          <div className="mr-auto max-w-2xl lg:ml-0 lg:mr-auto">
            <p className="s-display s-latin s-fade-up text-6xl font-bold leading-[0.84] text-[var(--s-primary)] md:text-8xl lg:text-9xl">
              {getValue(data, "brandName")}
            </p>
            <h1 className="s-display s-fade-up s-delay-1 mt-8 max-w-xl text-4xl font-bold leading-[1.02] text-[var(--s-text)] md:text-6xl">
              {getValue(data, "heroTitle")}
            </h1>
            <p className="s-fade-up s-delay-2 mt-7 max-w-lg text-base leading-8 text-[var(--s-muted)] md:text-lg">
              {getValue(data, "heroSubtitle")}
            </p>
            <div className="s-fade-up s-delay-3 mt-10 flex flex-wrap gap-3">
              <button type="button" onClick={openModal} className="s-button-primary px-8 py-4 text-sm">
                {getValue(data, "heroPrimaryButton")}
              </button>
              <a href="#menu" className="s-button-secondary px-8 py-4 text-sm">
                {getValue(data, "heroSecondaryButton")}
              </a>
            </div>
          </div>
        </div>
        <div className="relative min-h-[56svh] lg:min-h-[100svh]">
          <img
            src={getValue(data, "heroImage")}
            alt={getValue(data, "heroImageAlt")}
            className="s-hero-image absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function Menu({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "menuItemOneTitle"), getValue(data, "menuItemOneText"), getValue(data, "menuItemOnePrice")],
    [getValue(data, "menuItemTwoTitle"), getValue(data, "menuItemTwoText"), getValue(data, "menuItemTwoPrice")],
    [getValue(data, "menuItemThreeTitle"), getValue(data, "menuItemThreeText"), getValue(data, "menuItemThreePrice")],
    [getValue(data, "menuItemFourTitle"), getValue(data, "menuItemFourText"), getValue(data, "menuItemFourPrice")],
    [getValue(data, "menuItemFiveTitle"), getValue(data, "menuItemFiveText"), getValue(data, "menuItemFivePrice")],
    [getValue(data, "menuItemSixTitle"), getValue(data, "menuItemSixText"), getValue(data, "menuItemSixPrice")],
  ];

  return (
    <section id="menu" data-template-section-type="menu" className="bg-[var(--s-bg)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.45fr_1fr]">
          <div className="max-w-md">
            <p className="s-section-kicker">{getValue(data, "menuIntro")}</p>
            <h2 className="s-display mt-4 text-4xl font-bold leading-tight text-[var(--s-text)] md:text-6xl">
              {getValue(data, "sectionTwoTitle")}
            </h2>
            <p className="mt-6 leading-8 text-[var(--s-muted)]">{getValue(data, "sectionTwoText")}</p>
          </div>
          <div className="border-t border-[var(--s-line-strong)]">
            {items.map(([title, text, price]) => (
              <article
                key={title}
                className="grid gap-4 border-b border-[var(--s-line)] py-7 md:grid-cols-[1fr_auto] md:items-start"
              >
                <div>
                  <h3 className="s-display text-2xl font-semibold text-[var(--s-text)]">{title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--s-muted)]">{text}</p>
                </div>
                <p className="s-display text-3xl font-bold text-[var(--s-primary)]">₪{price}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ChefStory({ data }: { data: Record<string, any> }) {
  return (
    <section id="chef" data-template-section-type="chef-story" className="bg-[var(--s-surface)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-stretch gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="s-image-scale min-h-[460px]">
          <img
            src={getValue(data, "chefImage")}
            alt={getValue(data, "chefImageAlt")}
            className="h-full min-h-[460px] w-full object-cover"
          />
        </div>
        <div className="flex items-center border-y border-[var(--s-line)] py-12 lg:px-8">
          <div>
            <p className="s-section-kicker">{getValue(data, "chefRole")}</p>
            <h2 className="s-display mt-4 text-4xl font-bold leading-tight text-[var(--s-text)] md:text-6xl">
              {getValue(data, "sectionThreeTitle")}
            </h2>
            <h3 className="mt-8 text-xl font-extrabold text-[var(--s-primary)]">{getValue(data, "chefName")}</h3>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--s-muted)]">{getValue(data, "chefText")}</p>
            <blockquote className="s-display mt-10 border-r border-[var(--s-primary)] pr-6 text-2xl font-semibold leading-10 text-[var(--s-text)]">
              ״{getValue(data, "chefQuote")}״
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery({ data }: { data: Record<string, any> }) {
  const images = [
    [getValue(data, "galleryImageOne"), getValue(data, "galleryImageOneAlt"), "md:col-span-7 md:row-span-2 md:min-h-[520px]"],
    [getValue(data, "galleryImageTwo"), getValue(data, "galleryImageTwoAlt"), "md:col-span-5 md:min-h-[250px]"],
    [getValue(data, "galleryImageThree"), getValue(data, "galleryImageThreeAlt"), "md:col-span-5 md:min-h-[250px]"],
    [getValue(data, "galleryImageFour"), getValue(data, "galleryImageFourAlt"), "md:col-span-4 md:min-h-[280px]"],
    [getValue(data, "galleryImageFive"), getValue(data, "galleryImageFiveAlt"), "md:col-span-8 md:min-h-[280px]"],
  ];

  return (
    <section data-template-section-type="gallery" className="bg-[var(--s-bg)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="s-section-kicker">גלריה</p>
            <h2 className="s-display mt-4 text-4xl font-bold text-[var(--s-text)] md:text-6xl">
              {getValue(data, "sectionFourTitle")}
            </h2>
          </div>
          <p className="max-w-md leading-8 text-[var(--s-muted)]">{getValue(data, "sectionFourText")}</p>
        </div>
        <div className="grid auto-rows-[220px] gap-4 md:grid-cols-12 md:auto-rows-[250px]">
          {images.map(([src, alt, size]) => (
            <figure key={src} className={cx("s-image-scale min-h-[220px]", size)}>
              <img src={src} alt={alt} className="h-full w-full object-cover" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName"), getValue(data, "reviewOneRole")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName"), getValue(data, "reviewTwoRole")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName"), getValue(data, "reviewThreeRole")],
  ];

  return (
    <section data-template-section-type="reviews" className="bg-[var(--s-surface)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="s-section-kicker">ביקורות</p>
          <h2 className="s-display mt-4 text-4xl font-bold text-[var(--s-text)] md:text-6xl">
            {getValue(data, "sectionFiveTitle")}
          </h2>
          <p className="mt-5 leading-8 text-[var(--s-muted)]">{getValue(data, "sectionFiveText")}</p>
        </div>
        <div className="mt-16 grid gap-10 lg:grid-cols-3">
          {reviews.map(([text, name, role]) => (
            <blockquote key={name} className="border-t border-[var(--s-line-strong)] pt-8">
              <p className="s-display text-2xl font-semibold leading-10 text-[var(--s-text)]">״{text}״</p>
              <footer className="mt-8">
                <p className="font-bold text-[var(--s-primary)]">{name}</p>
                <p className="mt-1 text-sm text-[var(--s-muted)]">{role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Events({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  const events = [
    ["01", getValue(data, "eventOneTitle"), getValue(data, "eventOneText")],
    ["02", getValue(data, "eventTwoTitle"), getValue(data, "eventTwoText")],
    ["03", getValue(data, "eventThreeTitle"), getValue(data, "eventThreeText")],
  ];

  return (
    <section id="events" data-template-section-type="events" className="bg-[var(--s-bg)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.44fr_1fr]">
        <div>
          <p className="s-section-kicker">אירוח פרטי</p>
          <h2 className="s-display mt-4 text-4xl font-bold leading-tight text-[var(--s-text)] md:text-6xl">
            {getValue(data, "sectionSixTitle")}
          </h2>
          <p className="mt-6 leading-8 text-[var(--s-muted)]">{getValue(data, "sectionSixText")}</p>
          <button type="button" onClick={openModal} className="s-button-secondary mt-9 px-8 py-4 text-sm">
            בקשת אירוע
          </button>
        </div>
        <div className="border-t border-[var(--s-line)]">
          {events.map(([number, title, text]) => (
            <article key={number} className="grid gap-5 border-b border-[var(--s-line)] py-9 md:grid-cols-[120px_1fr]">
              <p className="s-display text-2xl md:text-5xl font-bold text-[var(--s-primary)]">{number}</p>
              <div>
                <h3 className="text-2xl font-extrabold text-[var(--s-text)]">{title}</h3>
                <p className="mt-3 max-w-2xl leading-8 text-[var(--s-muted)]">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HoursLocation({ data }: { data: Record<string, any> }) {
  const hours = [
    getValue(data, "hoursSundayThursday"),
    getValue(data, "hoursFriday"),
    getValue(data, "hoursSaturday"),
  ];

  return (
    <section data-template-section-type="hours-location" className="bg-[var(--s-surface)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.86fr]">
        <div>
          <p className="s-section-kicker">שעות ומיקום</p>
          <h2 className="s-display mt-4 text-4xl font-bold text-[var(--s-text)] md:text-6xl">
            {getValue(data, "sectionSevenTitle")}
          </h2>
          <p className="mt-6 max-w-xl leading-8 text-[var(--s-muted)]">{getValue(data, "sectionSevenText")}</p>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[var(--s-primary)]">שעות</p>
              <div className="mt-5 space-y-4">
                {hours.map((item) => (
                  <p key={item} className="border-b border-[var(--s-line)] pb-4 text-[var(--s-text)]">
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[var(--s-primary)]">כתובת</p>
              <p className="mt-5 text-2xl font-bold text-[var(--s-text)]">{getValue(data, "locationArea")}</p>
              <p className="mt-4 leading-7 text-[var(--s-muted)]">{getValue(data, "parkingInfo")}</p>
            </div>
          </div>
        </div>
        <div className="relative min-h-[420px] border border-[var(--s-line)] bg-[var(--s-dark)] p-8">
          <div className="absolute inset-x-8 top-1/2 h-px bg-[var(--s-line-strong)]" />
          <div className="absolute inset-y-8 left-1/2 w-px bg-[var(--s-line)]" />
          <div className="absolute bottom-8 right-8 h-24 w-24 border border-[var(--s-primary)]" />
          <div className="relative flex h-full min-h-[356px] flex-col justify-between">
            <p className="s-display s-latin text-2xl md:text-5xl font-bold text-[var(--s-primary)]">{getValue(data, "brandName")}</p>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[var(--s-muted)]">תל אביב</p>
              <p className="mt-3 max-w-xs text-2xl font-bold leading-9 text-[var(--s-text)]">{getValue(data, "address")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reservation({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="reservation" className="bg-[var(--s-bg)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 border-y border-[var(--s-line)] py-16 lg:grid-cols-[0.88fr_1.12fr]">
        <div>
          <p className="s-section-kicker">הזמנות</p>
          <h2 className="s-display mt-4 text-4xl font-bold leading-tight text-[var(--s-text)] md:text-6xl">
            {getValue(data, "sectionEightTitle")}
          </h2>
          <p className="mt-6 max-w-lg leading-8 text-[var(--s-muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 space-y-3 text-sm text-[var(--s-muted)]">
            <p>
              <span className="font-extrabold text-[var(--s-primary)]">טלפון</span> · {getValue(data, "phone")}
            </p>
            <p>
              <span className="font-extrabold text-[var(--s-primary)]">אימייל</span> · {getValue(data, "email")}
            </p>
          </div>
        </div>
        <form className="grid gap-4 bg-[var(--s-surface)] p-6 md:grid-cols-2 md:p-9">
          <input
            className="border border-white/10 bg-transparent px-5 py-4 text-right text-[var(--s-text)] outline-none transition placeholder:text-[var(--s-muted)] focus:border-[var(--s-primary)]"
            placeholder="שם מלא"
          />
          <input
            className="border border-white/10 bg-transparent px-5 py-4 text-right text-[var(--s-text)] outline-none transition placeholder:text-[var(--s-muted)] focus:border-[var(--s-primary)]"
            placeholder="טלפון"
          />
          <input
            className="border border-white/10 bg-transparent px-5 py-4 text-right text-[var(--s-text)] outline-none transition placeholder:text-[var(--s-muted)] focus:border-[var(--s-primary)]"
            placeholder={getValue(data, "reservationDateLabel")}
          />
          <input
            className="border border-white/10 bg-transparent px-5 py-4 text-right text-[var(--s-text)] outline-none transition placeholder:text-[var(--s-muted)] focus:border-[var(--s-primary)]"
            placeholder={getValue(data, "reservationGuestsLabel")}
          />
          <textarea
            className="min-h-[132px] border border-white/10 bg-transparent px-5 py-4 text-right text-[var(--s-text)] outline-none transition placeholder:text-[var(--s-muted)] focus:border-[var(--s-primary)] md:col-span-2"
            placeholder={getValue(data, "reservationNoteLabel")}
          />
          <button type="button" onClick={openModal} className="s-button-primary px-8 py-4 text-sm md:col-span-2">
            {getValue(data, "contactButton")}
          </button>
        </form>
      </div>
    </section>
  );
}

function FooterCta({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer-cta" className="bg-[var(--s-dark)] px-5 pb-10 pt-24 lg:px-8 lg:pt-32">
      <div className="mx-auto max-w-7xl text-center">
        <p className="s-display s-latin text-5xl font-bold text-[var(--s-primary)] md:text-7xl">{getValue(data, "brandName")}</p>
        <h2 className="s-display mx-auto mt-8 max-w-4xl text-4xl font-bold leading-tight text-[var(--s-text)] md:text-6xl">
          {getValue(data, "ctaTitle")}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl leading-8 text-[var(--s-muted)]">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={openModal} className="s-button-primary mt-10 px-10 py-4 text-sm">
          {getValue(data, "ctaButton")}
        </button>
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-[var(--s-line)] pt-8 text-sm text-[var(--s-muted)] md:flex-row">
          <p>© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
          <p>{getValue(data, "address")} · {getValue(data, "phone")}</p>
        </div>
      </div>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[rgba(0,0,0,0.78)] px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-[var(--s-line-strong)] bg-[var(--s-surface)] p-8 text-[var(--s-text)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 text-2xl leading-none text-[var(--s-muted)] transition hover:text-[var(--s-primary)]"
          aria-label="סגירת חלון"
        >
          ×
        </button>
        <p className="s-section-kicker">הזמנה</p>
        <h3 className="s-display mt-3 text-3xl font-bold">{getValue(data, "contactTitle")}</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--s-muted)]">{getValue(data, "contactText")}</p>
        <form className="mt-7 grid gap-3">
          <input
            className="border border-white/10 bg-transparent px-5 py-4 text-right outline-none transition placeholder:text-[var(--s-muted)] focus:border-[var(--s-primary)]"
            placeholder="שם מלא"
          />
          <input
            className="border border-white/10 bg-transparent px-5 py-4 text-right outline-none transition placeholder:text-[var(--s-muted)] focus:border-[var(--s-primary)]"
            placeholder="טלפון"
          />
          <button type="button" className="s-button-primary py-4 text-sm">
            {getValue(data, "contactButton")}
          </button>
        </form>
      </div>
    </div>
  );
}

function HomePage({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <>
      <Hero data={data} openModal={openModal} />
      <Menu data={data} />
      <ChefStory data={data} />
      <Gallery data={data} />
      <Reviews data={data} />
      <Events data={data} openModal={openModal} />
      <HoursLocation data={data} />
      <Reservation data={data} openModal={openModal} />
      <FooterCta data={data} openModal={openModal} />
    </>
  );
}

export default function SavoryPages({
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
}: SavoryPagesProps) {
  const mergedData = useMemo(() => ({ ...savoryDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "savory-preview" : "savory"}
      className="min-h-screen w-full overflow-x-hidden bg-[var(--s-bg)] text-[var(--s-text)]"
    >
      <style dangerouslySetInnerHTML={{ __html: savoryEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
