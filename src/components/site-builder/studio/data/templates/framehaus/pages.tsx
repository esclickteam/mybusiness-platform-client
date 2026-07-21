import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { TemplateText } from "../shared/TemplateText";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { framehausDefaultData } from "./defaultData";
import { framehausEditorCss } from "./editorCss";

export const framehausPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "גלריה", slug: "/work" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const framehausAllowedPages = framehausPages.map((page) => page.id);
const scopedFramehausEditorCss = framehausEditorCss
  .split('[data-template-id="framehaus"]')
  .join(
    '[data-template-id="framehaus"], [data-template-id="framehaus-preview"]',
  );

type FramehausPagesProps = {
  initialPage?: string;
  initialPageId?: string;
  page?: string;
  pageId?: string;
  activePageId?: string;
  currentPageId?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (framehausDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getPageTitle(data: Record<string, any>, pageId: string) {
  if (pageId === "about") return getValue(data, "navAbout");
  if (pageId === "services") return getValue(data, "navServices");
  if (pageId === "work") return getValue(data, "navWork");
  if (pageId === "process") return getValue(data, "processTitle");
  if (pageId === "contact") return getValue(data, "navContact");
  return getValue(data, "brandName");
}

function getStats(data: Record<string, any>) {
  return [
    [getValue(data, "statOne"), getValue(data, "statOneLabel")],
    [getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
    [getValue(data, "statThree"), getValue(data, "statThreeLabel")],
    [getValue(data, "statFour"), getValue(data, "statFourLabel")],
  ];
}

function EditorialIntro({
  eyebrow,
  title,
  text,
  center = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={cx("mx-auto max-w-3xl", center ? "text-center" : "text-right")}>
      <TemplateText
        as="p"
        className="mb-4 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.34em] text-[#ff3b30]"
      >
        <span className="h-px w-10 bg-[#ff3b30]" />
        {eyebrow}
      </TemplateText>
      <TemplateText
        as="h2"
        className="text-4xl font-black uppercase leading-[0.94] tracking-[-0.05em] text-[#111111] md:text-6xl"
      >
        {title}
      </TemplateText>
      {text ? (
        <TemplateText as="p" className="mt-5 text-lg leading-8 text-[#5e5e5e]">
          {text}
        </TemplateText>
      ) : null}
    </div>
  );
}

function FramedImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cx("border-[8px] border-black bg-white p-2", className)}>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

function EditorialButton({
  children,
  onClick,
  kind = "solid",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  kind?: "solid" | "outline";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "border-2 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] transition duration-300 hover:-translate-y-0.5 rounded-none",
        kind === "solid"
          ? "border-[#111111] bg-[#111111] text-[#fafafa] hover:bg-[#ff3b30] hover:border-[#ff3b30]"
          : "border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-[#fafafa]",
        className,
      )}
    >
      {children}
    </button>
  );
}

function FramehausHeader({
  data,
  currentPage,
  goTo,
  openInquiry,
}: {
  data: Record<string, any>;
  currentPage: string;
  goTo: (pageId: string) => void;
  openInquiry: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = [
    ["home", getValue(data, "navHome")],
    ["about", getValue(data, "navAbout")],
    ["services", getValue(data, "navServices")],
    ["work", getValue(data, "navWork")],
    ["process", "תהליך"],
    ["contact", getValue(data, "navContact")],
  ];

  function handleNavigate(pageId: string) {
    goTo(pageId);
    setMobileOpen(false);
  }

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b-2 border-black bg-[#fafafa]/95 backdrop-blur-xl"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-4 px-5 py-4 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <div className="flex items-center justify-between gap-3 lg:justify-start">
          <button type="button" onClick={() => handleNavigate("home")} className="text-right">
            <TemplateText as="div" className="text-3xl font-black uppercase tracking-[-0.08em] text-[#111111]">
              {getValue(data, "brandName")}
            </TemplateText>
            <TemplateText as="div" className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#ff3b30]">
              {getValue(data, "tagline")}
            </TemplateText>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 border-2 border-black text-[#111111] lg:hidden"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>

        <nav className="hidden items-center justify-center gap-6 lg:flex">
          {nav.map(([pageId, label]) => (
            <button
              key={pageId}
              type="button"
              onClick={() => handleNavigate(pageId)}
              className={cx(
                "border-b-2 pb-1 text-sm font-bold uppercase tracking-[0.18em] transition duration-300",
                currentPage === pageId
                  ? "border-[#ff3b30] text-[#111111]"
                  : "border-transparent text-[#666666] hover:text-[#111111]",
              )}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="hidden justify-end lg:flex">
          <EditorialButton onClick={openInquiry}>{getValue(data, "heroPrimaryButton")}</EditorialButton>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t-2 border-black px-5 pb-5 lg:hidden">
          <div className="grid gap-2 pt-4">
            {nav.map(([pageId, label]) => (
              <button
                key={pageId}
                type="button"
                onClick={() => handleNavigate(pageId)}
                className={cx(
                  "border-2 px-4 py-3 text-right text-sm font-bold uppercase tracking-[0.18em] rounded-none",
                  currentPage === pageId
                    ? "border-[#111111] bg-[#111111] text-[#fafafa]"
                    : "border-black text-[#111111]",
                )}
              >
                {label}
              </button>
            ))}
            <EditorialButton
              onClick={() => {
                setMobileOpen(false);
                openInquiry();
              }}
            >
              {getValue(data, "heroPrimaryButton")}
            </EditorialButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function InquiryModal({
  data,
  open,
  onClose,
}: {
  data: Record<string, any>;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/65 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl border-[8px] border-black bg-[#fafafa] p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 grid h-10 w-10 border-2 border-black text-lg text-[#111111]"
        >
          ×
        </button>
        <TemplateText as="p" className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#ff3b30]">
          Editorial Booking
        </TemplateText>
        <TemplateText as="h3" className="mt-4 text-3xl font-black uppercase text-[#111111]">
          {getValue(data, "contactTitle")}
        </TemplateText>
        <TemplateText as="p" className="mt-3 max-w-xl text-sm leading-7 text-[#5e5e5e]">
          {getValue(data, "contactText")}
        </TemplateText>
        <form className="mt-8 grid gap-0 border-2 border-black">
          {[
            "שם מלא",
            "אימייל",
            "סוג צילום / קמפיין",
            "תאריך מועדף",
          ].map((placeholder) => (
            <input
              key={placeholder}
              className="h-14 border-b-2 border-black bg-transparent px-5 text-right text-sm text-[#111111] outline-none placeholder:text-[#777]"
              placeholder={placeholder}
            />
          ))}
          <textarea
            className="min-h-32 bg-transparent px-5 py-4 text-right text-sm text-[#111111] outline-none placeholder:text-[#777]"
            placeholder="ספרו לנו איזה עולם אתם רוצים לבנות בפריים."
          />
          <button
            type="button"
            className="border-t-2 border-black bg-[#ff3b30] px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white"
          >
            {getValue(data, "contactButton")}
          </button>
        </form>
      </div>
    </div>
  );
}

function HeroSection({
  data,
  goTo,
  openInquiry,
}: {
  data: Record<string, any>;
  goTo: (pageId: string) => void;
  openInquiry: () => void;
}) {
  const stats = getStats(data).slice(0, 3);

  return (
    <section className="relative overflow-hidden border-b-2 border-black px-5 py-12 lg:px-8 lg:py-16">
      <div className="framehaus-hero-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-5">
        <div className="col-span-12 border-b-2 border-black pb-6 lg:col-span-5 lg:border-b-0 lg:border-l-2 lg:pb-0 lg:pl-6">
          <TemplateText
            as="p"
            className="mb-4 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.34em] text-[#ff3b30]"
          >
            <span className="h-px w-10 bg-[#ff3b30]" />
            {getValue(data, "heroEyebrow")}
          </TemplateText>
          <TemplateText
            as="h1"
            className="max-w-3xl text-5xl font-black uppercase leading-[0.86] tracking-[-0.06em] text-[#111111] md:text-7xl"
          >
            {getValue(data, "heroTitle")}
          </TemplateText>
          <TemplateText as="p" className="mt-6 max-w-xl text-lg leading-8 text-[#5e5e5e]">
            {getValue(data, "heroSubtitle")}
          </TemplateText>
          <div className="mt-9 flex flex-wrap gap-3">
            <EditorialButton onClick={openInquiry}>{getValue(data, "heroPrimaryButton")}</EditorialButton>
            <EditorialButton kind="outline" onClick={() => goTo("work")}>
              {getValue(data, "heroSecondaryButton")}
            </EditorialButton>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <FramedImage
            src={getValue(data, "heroImage")}
            alt={getValue(data, "brandName")}
            className="h-[420px] lg:h-[640px]"
          />
        </div>

        <div className="col-span-12 grid gap-4 lg:col-span-3">
          <div className="border-2 border-black bg-white p-5">
            <TemplateText as="div" className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#ff3b30]">
              Issue 01
            </TemplateText>
            <TemplateText as="div" className="mt-3 text-2xl font-black uppercase leading-tight text-[#111111]">
              {getValue(data, "tagline")}
            </TemplateText>
            <TemplateText as="p" className="mt-3 text-sm leading-7 text-[#5e5e5e]">
              {getValue(data, "aboutText")}
            </TemplateText>
          </div>
          <div className="grid gap-0 border-2 border-black">
            {stats.map(([value, label]) => (
              <div key={label} className="border-b-2 border-black px-4 py-4 last:border-b-0">
                <TemplateText as="div" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666666]">
                  {label}
                </TemplateText>
                <TemplateText as="div" className="mt-2 text-3xl font-black text-[#111111]">
                  {value}
                </TemplateText>
              </div>
            ))}
          </div>
          <div className="border-2 border-black bg-[#111111] px-5 py-5 text-white">
            <TemplateText as="div" className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#ff3b30]">
              Studio Note
            </TemplateText>
            <TemplateText as="p" className="mt-3 text-sm leading-7 text-white/75">
              {getValue(data, "footerText")}
            </TemplateText>
          </div>
        </div>
      </div>
    </section>
  );
}

function MastheadStrip({ data }: { data: Record<string, any> }) {
  const items = [
    getValue(data, "brandName"),
    getValue(data, "tagline"),
    getValue(data, "address"),
    getValue(data, "email"),
  ];

  return (
    <section className="border-b-2 border-black bg-[#111111] px-5 py-5 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-px border-y border-[#fafafa]/20 py-2 md:grid-cols-4">
        {items.map((item, index) => (
          <TemplateText
            key={item + index}
            as="div"
            className="px-3 text-center text-[11px] font-bold uppercase tracking-[0.34em] text-white/80"
          >
            {item}
          </TemplateText>
        ))}
      </div>
    </section>
  );
}

function StatsSection({ data }: { data: Record<string, any> }) {
  const stats = getStats(data);
  return (
    <section className="border-b-2 border-black px-5 py-12 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-px border-2 border-black bg-black md:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="bg-[#fafafa] px-5 py-6 text-right">
            <TemplateText as="div" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666666]">
              {label}
            </TemplateText>
            <TemplateText as="div" className="mt-3 text-4xl font-black text-[#111111]">
              {value}
            </TemplateText>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutSection({ data }: { data: Record<string, any> }) {
  const notes = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
  ];

  return (
    <section className="border-b-2 border-black px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5">
          <EditorialIntro
            eyebrow={getValue(data, "aboutEyebrow")}
            title={getValue(data, "aboutTitle")}
            text={getValue(data, "aboutText")}
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <FramedImage
            src={getValue(data, "aboutImage")}
            alt={getValue(data, "aboutTitle")}
            className="h-[500px]"
          />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <div className="grid gap-0 border-2 border-black">
            {notes.map(([title, text], index) => (
              <div key={title} className="border-b-2 border-black bg-white px-5 py-5 last:border-b-0">
                <TemplateText as="div" className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#ff3b30]">
                  Note 0{index + 1}
                </TemplateText>
                <TemplateText as="h3" className="mt-3 text-xl font-black uppercase text-[#111111]">
                  {title}
                </TemplateText>
                <TemplateText as="p" className="mt-3 text-sm leading-7 text-[#5e5e5e]">
                  {text}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({
  data,
  openInquiry,
}: {
  data: Record<string, any>;
  openInquiry: () => void;
}) {
  const services = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
  ];

  return (
    <section className="border-b-2 border-black px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <EditorialIntro
          eyebrow={getValue(data, "servicesEyebrow")}
          title={getValue(data, "servicesTitle")}
          text={getValue(data, "ctaText")}
        />
        <div className="mt-12 grid gap-0 border-y-2 border-black">
          {services.map(([title, text], index) => (
            <article
              key={title}
              className="grid gap-5 border-b-2 border-black py-6 last:border-b-0 md:grid-cols-[110px_1fr_auto]"
            >
              <TemplateText as="div" className="text-4xl font-black text-[#ff3b30]">
                0{index + 1}
              </TemplateText>
              <div>
                <TemplateText as="h3" className="text-2xl font-black uppercase text-[#111111]">
                  {title}
                </TemplateText>
                <TemplateText as="p" className="mt-3 max-w-2xl text-sm leading-7 text-[#5e5e5e]">
                  {text}
                </TemplateText>
              </div>
              <div className="md:text-left">
                <button
                  type="button"
                  onClick={openInquiry}
                  className="border-2 border-black px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#111111] transition hover:bg-[#111111] hover:text-[#fafafa]"
                >
                  Reserve ↗
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ data }: { data: Record<string, any> }) {
  const works = [
    {
      title: getValue(data, "workOneTitle"),
      text: getValue(data, "workOneText"),
      image: getValue(data, "heroImage"),
      cols: "lg:col-span-7",
      height: "h-[520px]",
    },
    {
      title: getValue(data, "workTwoTitle"),
      text: getValue(data, "workTwoText"),
      image: getValue(data, "aboutImage"),
      cols: "lg:col-span-5 lg:mt-20",
      height: "h-[420px]",
    },
    {
      title: getValue(data, "workThreeTitle"),
      text: getValue(data, "workThreeText"),
      image: getValue(data, "heroImage"),
      cols: "lg:col-span-6",
      height: "h-[420px]",
    },
    {
      title: getValue(data, "brandName"),
      text: getValue(data, "ctaText"),
      image: getValue(data, "aboutImage"),
      cols: "lg:col-span-6 lg:-mt-16",
      height: "h-[380px]",
    },
  ];

  return (
    <section className="border-b-2 border-black bg-[#f3f3f3] px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <EditorialIntro
          eyebrow={getValue(data, "workEyebrow")}
          title={getValue(data, "workTitle")}
          center
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          {works.map((work, index) => (
            <article key={work.title + index} className={work.cols}>
              <FramedImage src={work.image} alt={work.title} className={work.height} />
              <div className="mt-4 border-r-4 border-[#ff3b30] pr-4 text-right">
                <TemplateText as="div" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666666]">
                  Spread 0{index + 1}
                </TemplateText>
                <TemplateText as="h3" className="mt-2 text-2xl font-black uppercase text-[#111111]">
                  {work.title}
                </TemplateText>
                <TemplateText as="p" className="mt-3 text-sm leading-7 text-[#5e5e5e]">
                  {work.text}
                </TemplateText>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ data }: { data: Record<string, any> }) {
  const steps = [
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    [getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];

  return (
    <section className="border-b-2 border-black px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <EditorialIntro
          eyebrow={getValue(data, "processEyebrow")}
          title={getValue(data, "processTitle")}
          text={getValue(data, "heroSubtitle")}
        />
        <div className="mt-12 grid gap-px border-2 border-black bg-black md:grid-cols-2 xl:grid-cols-4">
          {steps.map(([title, text], index) => (
            <div key={title} className="bg-[#fafafa] p-6">
              <TemplateText as="div" className="text-5xl font-black text-[#ff3b30]">
                0{index + 1}
              </TemplateText>
              <TemplateText as="h3" className="mt-5 text-2xl font-black uppercase text-[#111111]">
                {title}
              </TemplateText>
              <TemplateText as="p" className="mt-3 text-sm leading-7 text-[#5e5e5e]">
                {text}
              </TemplateText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ManifestoSection({
  data,
  openInquiry,
}: {
  data: Record<string, any>;
  openInquiry: () => void;
}) {
  return (
    <section className="border-b-2 border-black bg-[#111111] px-5 py-16 text-white lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border-r-4 border-[#ff3b30] pr-5">
          <TemplateText as="div" className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#ff3b30]">
            Editorial Statement
          </TemplateText>
          <TemplateText as="div" className="mt-4 text-2xl font-black uppercase leading-tight">
            {getValue(data, "tagline")}
          </TemplateText>
        </div>
        <div>
          <TemplateText as="h2" className="text-4xl font-black uppercase leading-[0.92] md:text-6xl">
            {getValue(data, "ctaTitle")}
          </TemplateText>
          <TemplateText as="p" className="mt-5 max-w-3xl text-lg leading-8 text-white/70">
            {getValue(data, "ctaText")}
          </TemplateText>
          <TemplateText as="p" className="mt-5 max-w-3xl text-sm leading-7 text-white/50">
            {getValue(data, "footerText")}
          </TemplateText>
          <div className="mt-8">
            <EditorialButton onClick={openInquiry} className="border-white bg-white text-[#111111] hover:border-[#ff3b30] hover:bg-[#ff3b30] hover:text-white">
              {getValue(data, "ctaButton")}
            </EditorialButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection({
  data,
  openInquiry,
}: {
  data: Record<string, any>;
  openInquiry: () => void;
}) {
  const info = [
    ["Phone", getValue(data, "phone")],
    ["Email", getValue(data, "email")],
    ["Studio", getValue(data, "address")],
  ];

  return (
    <section className="border-b-2 border-black px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-px border-2 border-black bg-black lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-[#fafafa] p-8 lg:p-10">
          <EditorialIntro
            eyebrow={getValue(data, "contactEyebrow")}
            title={getValue(data, "contactTitle")}
            text={getValue(data, "contactText")}
          />
          <div className="mt-10 grid gap-0 border-2 border-black">
            {info.map(([label, value]) => (
              <div key={label} className="border-b-2 border-black px-5 py-4 last:border-b-0">
                <TemplateText as="div" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666666]">
                  {label}
                </TemplateText>
                <TemplateText as="div" className="mt-2 text-base font-bold text-[#111111]">
                  {value}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>
        <form className="grid gap-0 bg-white">
          {[
            "שם מלא",
            "אימייל",
            "מותג / לקוח",
            "סוג הפרויקט",
          ].map((placeholder) => (
            <input
              key={placeholder}
              className="h-16 border-b-2 border-black bg-transparent px-5 text-right text-sm text-[#111111] outline-none placeholder:text-[#777]"
              placeholder={placeholder}
            />
          ))}
          <textarea
            className="min-h-40 border-b-2 border-black bg-transparent px-5 py-4 text-right text-sm text-[#111111] outline-none placeholder:text-[#777]"
            placeholder="מה אתם רוצים שנראה, נצלם ונגרום לו להרגיש?"
          />
          <div className="p-5">
            <EditorialButton onClick={openInquiry} className="w-full justify-center bg-[#ff3b30] border-[#ff3b30] hover:bg-[#111111] hover:border-[#111111]">
              {getValue(data, "contactButton")}
            </EditorialButton>
          </div>
        </form>
      </div>
    </section>
  );
}

function FooterSection({
  data,
  goTo,
  openInquiry,
}: {
  data: Record<string, any>;
  goTo: (pageId: string) => void;
  openInquiry: () => void;
}) {
  const links = [
    ["about", getValue(data, "navAbout")],
    ["services", getValue(data, "navServices")],
    ["work", getValue(data, "navWork")],
    ["process", "תהליך"],
    ["contact", getValue(data, "navContact")],
  ];

  return (
    <footer className="px-5 py-12 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 border-2 border-black bg-white p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
        <div>
          <TemplateText as="div" className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#ff3b30]">
            Framehaus Edition
          </TemplateText>
          <TemplateText as="h2" className="mt-4 text-4xl font-black uppercase leading-[0.94] text-[#111111] md:text-6xl">
            {getValue(data, "ctaTitle")}
          </TemplateText>
          <TemplateText as="p" className="mt-5 max-w-2xl text-lg leading-8 text-[#5e5e5e]">
            {getValue(data, "ctaText")}
          </TemplateText>
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          <EditorialButton onClick={openInquiry}>{getValue(data, "ctaButton")}</EditorialButton>
          <div className="mt-3 flex flex-wrap gap-2 lg:justify-end">
            {links.map(([pageId, label]) => (
              <button
                key={pageId}
                type="button"
                onClick={() => goTo(pageId)}
                className="border-2 border-black px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#111111] transition hover:bg-[#111111] hover:text-[#fafafa]"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-4 border-t-2 border-black pt-8 text-sm text-[#666666] md:flex-row md:items-center md:justify-between">
        <TemplateText as="p">
          © {new Date().getFullYear()} {getValue(data, "brandName")}
        </TemplateText>
        <TemplateText as="p">{getValue(data, "footerText")}</TemplateText>
      </div>
    </footer>
  );
}

function HomePage({
  data,
  goTo,
  openInquiry,
}: {
  data: Record<string, any>;
  goTo: (pageId: string) => void;
  openInquiry: () => void;
}) {
  return (
    <>
      <HeroSection data={data} goTo={goTo} openInquiry={openInquiry} />
      <MastheadStrip data={data} />
      <StatsSection data={data} />
      <AboutSection data={data} />
      <ServicesSection data={data} openInquiry={openInquiry} />
      <GallerySection data={data} />
      <ProcessSection data={data} />
      <ManifestoSection data={data} openInquiry={openInquiry} />
      <ContactSection data={data} openInquiry={openInquiry} />
      <FooterSection data={data} goTo={goTo} openInquiry={openInquiry} />
    </>
  );
}

function InnerPage({
  data,
  type,
  goTo,
  openInquiry,
}: {
  data: Record<string, any>;
  type: string;
  goTo: (pageId: string) => void;
  openInquiry: () => void;
}) {
  const pageMap: Record<string, React.ReactNode> = {
    about: (
      <>
        <AboutSection data={data} />
        <ManifestoSection data={data} openInquiry={openInquiry} />
      </>
    ),
    services: (
      <>
        <ServicesSection data={data} openInquiry={openInquiry} />
        <GallerySection data={data} />
      </>
    ),
    work: (
      <>
        <GallerySection data={data} />
        <StatsSection data={data} />
      </>
    ),
    process: (
      <>
        <ProcessSection data={data} />
        <AboutSection data={data} />
      </>
    ),
    contact: <ContactSection data={data} openInquiry={openInquiry} />,
  };

  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-black px-5 py-16 lg:px-8 lg:py-24">
        <div className="framehaus-hero-grid pointer-events-none absolute inset-0 opacity-20" />
        <div className="mx-auto max-w-7xl text-right">
          <TemplateText as="p" className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#ff3b30]">
            {getValue(data, "brandName")}
          </TemplateText>
          <TemplateText as="h1" className="mt-5 max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-[#111111] md:text-7xl">
            {getPageTitle(data, type)}
          </TemplateText>
        </div>
      </section>

      {pageMap[type] ?? null}

      <FooterSection data={data} goTo={goTo} openInquiry={openInquiry} />
    </>
  );
}

export default function FramehausPages({
  initialPage = "home",
  initialPageId,
  page,
  pageId,
  activePageId,
  currentPageId,
  mode = "preview",
  data,
  onPageChange,
  isPublic,
  viewMode,
  runtimeMode,
}: FramehausPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...framehausDefaultData,
      ...(data ?? {}),
    }),
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
    { allowedPages: framehausAllowedPages, fallbackPage: "home" },
  );
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "framehaus-preview" : "framehaus"}
      className="min-h-screen w-full overflow-x-hidden bg-[#fafafa] text-[#111111] rounded-none"
      style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
    >
      <style>{scopedFramehausEditorCss}</style>

      <FramehausHeader
        data={mergedData}
        currentPage={currentPage}
        goTo={goTo}
        openInquiry={() => setInquiryOpen(true)}
      />

      <VisualPageStack
        activePageId={currentPage}
        pages={[
          {
            id: "home",
            content: (
              <HomePage
                data={mergedData}
                goTo={goTo}
                openInquiry={() => setInquiryOpen(true)}
              />
            ),
          },
          ...framehausPages
            .filter((pageItem) => pageItem.id !== "home")
            .map((pageItem) => ({
              id: pageItem.id,
              content: (
                <InnerPage
                  data={mergedData}
                  type={pageItem.id}
                  goTo={goTo}
                  openInquiry={() => setInquiryOpen(true)}
                />
              ),
            })),
        ]}
      />

      <InquiryModal
        data={mergedData}
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </div>
  );
}
