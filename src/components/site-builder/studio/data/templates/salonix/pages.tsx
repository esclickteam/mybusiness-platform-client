import React, { useEffect, useMemo, useRef, useState } from "react";

import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { TemplateText } from "../shared/TemplateText";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import {
  salonixDefaultData,
  salonixImages,
  salonixPriceCategories,
} from "./defaultData";
import { salonixEditorCss } from "./editorCss";

export const salonixPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
  { id: "booking", label: "קביעת תור", slug: "/booking" },
];

const salonixAllowedPages = salonixPages.map((page) => page.id);

type SalonixPagesProps = {
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
  return data?.[key] ?? (salonixDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={cx(
        "salonix-reveal",
        visible && "is-visible",
        delay === 1 && "salonix-reveal-delay-1",
        delay === 2 && "salonix-reveal-delay-2",
        delay === 3 && "salonix-reveal-delay-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  data,
  titleKey,
  subtitleKey,
}: {
  data: Record<string, any>;
  titleKey: string;
  subtitleKey?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4">
      <TemplateText as="div" className="salonix-title" editId={titleKey} editLabel={titleKey}>
        {getValue(data, titleKey)}
      </TemplateText>
      {subtitleKey ? (
        <TemplateText
          as="div"
          className="salonix-subtitle"
          editId={subtitleKey}
          editLabel={subtitleKey}
        >
          {getValue(data, subtitleKey)}
        </TemplateText>
      ) : null}
      <span className="salonix-bar" aria-hidden="true" />
    </div>
  );
}

function Header({
  data,
  currentPage,
  onNavigate,
}: {
  data: Record<string, any>;
  currentPage: string;
  onNavigate: (pageId: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = [
    ["home", getValue(data, "navHome")],
    ["about", getValue(data, "navAbout")],
    ["services", getValue(data, "navServices")],
    ["booking", getValue(data, "navBooking")],
    ["gallery", getValue(data, "navGallery")],
    ["contact", getValue(data, "navContact")],
  ] as const;

  function handleNav(pageId: string) {
    onNavigate(pageId);
    setMobileOpen(false);
  }

  return (
    <header
      data-visual-flow-lock="true"
      data-section-kind="header"
      className="sticky top-0 z-30 w-full bg-white shadow-sm lg:py-1"
    >
      <div className="salonix-container">
        <nav className="relative flex items-center justify-between px-[15px] lg:px-0">
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label="תפריט"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="block h-0.5 w-6 bg-black" />
            <span className="block h-0.5 w-6 bg-black" />
            <span className="block h-0.5 w-6 bg-black" />
          </button>

          <div className="flex flex-1 justify-center">
            <button type="button" onClick={() => handleNav("home")} className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-black text-sm font-black text-white">
                {getValue(data, "logoText")}
              </span>
              <TemplateText
                as="span"
                className="hidden text-lg font-bold uppercase tracking-wide md:inline"
                editId="brandName"
                editLabel="Brand name"
              >
                {getValue(data, "brandName")}
              </TemplateText>
            </button>
          </div>

          <ul className="hidden items-center justify-center lg:flex">
            {nav.map(([id, label]) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => handleNav(id)}
                  className={cx("salonix-nav-btn text-black", currentPage === id && "is-active")}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <div className="w-10 lg:hidden" />
        </nav>

        <div className={cx("salonix-mobile-menu lg:hidden", mobileOpen && "is-open")}>
          <ul className="border-t border-[#ececec] py-2">
            {nav.map(([id, label]) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => handleNav(id)}
                  className={cx(
                    "block w-full px-4 py-3 text-right text-sm font-semibold uppercase",
                    currentPage === id && "bg-[#909090] text-white",
                  )}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}

function HeroSlider({ data }: { data: Record<string, any> }) {
  const slides = [
    getValue(data, "heroSlideOne"),
    getValue(data, "heroSlideTwo"),
    getValue(data, "heroSlideThree"),
    getValue(data, "heroSlideFour"),
  ].filter(Boolean);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  function go(delta: number) {
    setIndex((current) => (current + delta + slides.length) % slides.length);
  }

  return (
    <section data-section-kind="hero" className="salonix-hero w-full">
      <button type="button" className="salonix-hero-arrow prev" aria-label="הקודם" onClick={() => go(-1)}>
        ›
      </button>
      <button type="button" className="salonix-hero-arrow next" aria-label="הבא" onClick={() => go(1)}>
        ‹
      </button>

      <div className="salonix-hero-frame">
        {slides.map((src, slideIndex) => (
          <div
            key={`${src}-${slideIndex}`}
            className={cx("salonix-hero-slide", slideIndex === index && "is-active")}
          >
            <img src={src} alt="Salonix hero" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      <div className="salonix-hero-dots">
        {slides.map((_, dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            aria-label={`שקופית ${dotIndex + 1}`}
            className={cx("salonix-dot", dotIndex === index && "is-active")}
            onClick={() => setIndex(dotIndex)}
          />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  onNavigate,
}: {
  service: (typeof salonixImages.services)[number];
  onNavigate: (pageId: string) => void;
}) {
  return (
    <div className="salonix-service-card">
      <span className="salonix-leaf-left hidden sm:block" aria-hidden="true" />
      <span className="salonix-leaf-right hidden sm:block" aria-hidden="true" />
      <button
        type="button"
        onClick={() => onNavigate("services")}
        className="relative z-10 mx-auto flex w-full max-w-[360px] flex-col items-center bg-white py-2 md:mx-[30px]"
      >
        <div className="salonix-service-ring">
          <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
        </div>
        <h3 className="salonix-service-label">{service.title}</h3>
      </button>
    </div>
  );
}

function ServicesSection({
  data,
  onNavigate,
}: {
  data: Record<string, any>;
  onNavigate: (pageId: string) => void;
}) {
  const [mobileIndex, setMobileIndex] = useState(0);
  const services = salonixImages.services;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMobileIndex((current) => (current + 1) % services.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [services.length]);

  return (
    <section data-section-kind="services" className="w-full bg-white py-4">
      <div className="salonix-container">
        <Reveal>
          <SectionHeading
            data={data}
            titleKey="servicesTitle"
            subtitleKey="servicesSubtitle"
          />
        </Reveal>

        <div className="relative z-20 mt-6 hidden w-full grid-cols-2 items-center gap-x-[10px] gap-y-5 lg:grid lg:grid-cols-3 xl:grid-cols-6">
          {services.map((service, index) => (
            <Reveal key={service.anchor} delay={(index % 3) as 0 | 1 | 2}>
              <ServiceCard service={service} onNavigate={onNavigate} />
            </Reveal>
          ))}
        </div>

        <div className="relative mt-6 overflow-hidden lg:hidden">
          <div
            className="salonix-mobile-track"
            style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
          >
            {services.map((service) => (
              <div key={service.anchor} className="min-w-full shrink-0">
                <ServiceCard service={service} onNavigate={onNavigate} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {services.map((service, dotIndex) => (
              <button
                key={service.anchor}
                type="button"
                aria-label={service.title}
                className={cx("salonix-dot !border-black", mobileIndex === dotIndex && "is-active")}
                onClick={() => setMobileIndex(dotIndex)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WelcomeSection({
  data,
  onNavigate,
}: {
  data: Record<string, any>;
  onNavigate: (pageId: string) => void;
}) {
  const lines = String(getValue(data, "welcomeTitle")).split("\n");

  return (
    <section data-section-kind="about" className="w-full bg-white py-8">
      <div className="salonix-container">
        <Reveal>
          <div className="grid grid-cols-1 items-stretch gap-0 lg:grid-cols-2 lg:gap-4">
            <div className="min-h-[320px] overflow-hidden">
              <img
                src={getValue(data, "welcomeImage")}
                alt={getValue(data, "brandName")}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="salonix-welcome-panel flex flex-col items-center justify-start gap-6 p-4">
              <TemplateText
                as="div"
                className="text-center text-[26px] font-semibold uppercase leading-[34px] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]"
                editId="welcomeTitle"
                editLabel="Welcome title"
              >
                {lines.map((line, index) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {line}
                    {index < lines.length - 1 ? <br /> : null}
                  </React.Fragment>
                ))}
              </TemplateText>
              <TemplateText
                as="div"
                className="text-justify text-[18px] leading-[34px] text-black"
                editId="welcomeText"
                editLabel="Welcome text"
              >
                {String(getValue(data, "welcomeText"))
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p key={index} className={index > 0 ? "mt-4" : undefined}>
                      {paragraph}
                    </p>
                  ))}
              </TemplateText>
              <button type="button" onClick={() => onNavigate("about")} className="w-full text-right">
                <TemplateText
                  as="span"
                  className="salonix-link-pink text-[18px] leading-[34px]"
                  editId="welcomeButton"
                  editLabel="Welcome button"
                >
                  {getValue(data, "welcomeButton")}
                </TemplateText>
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function GalleryGrid({ images, limit }: { images: string[]; limit?: number }) {
  const list = limit ? images.slice(0, limit) : images;
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {list.map((src, index) => (
        <div key={`${src}-${index}`} className="salonix-gallery-item">
          <img src={src} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

function GalleryPreview({
  data,
  onNavigate,
}: {
  data: Record<string, any>;
  onNavigate: (pageId: string) => void;
}) {
  return (
    <section data-section-kind="gallery" className="w-full bg-white py-5">
      <div className="salonix-container">
        <Reveal>
          <SectionHeading data={data} titleKey="galleryTitle" subtitleKey="gallerySubtitle" />
          <GalleryGrid images={salonixImages.gallery} limit={12} />
          <div className="flex justify-center">
            <button type="button" className="salonix-btn-dark" onClick={() => onNavigate("gallery")}>
              <TemplateText editId="galleryButton" editLabel="Gallery button">
                {getValue(data, "galleryButton")}
              </TemplateText>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PageBanner({ title }: { title: string }) {
  return <div className="salonix-banner">{title}</div>;
}

function AboutPage({ data }: { data: Record<string, any> }) {
  const lines = String(getValue(data, "aboutTitle")).split("\n");
  return (
    <div>
      <PageBanner title={getValue(data, "navAbout")} />
      <section className="bg-white py-10">
        <div className="salonix-container grid gap-8 lg:grid-cols-2">
          <Reveal>
            <img
              src={getValue(data, "aboutImage")}
              alt={getValue(data, "brandName")}
              className="min-h-[320px] w-full object-cover"
            />
          </Reveal>
          <Reveal delay={1}>
            <TemplateText as="h1" className="salonix-title text-right" editId="aboutTitle" editLabel="About title">
              {lines.map((line, index) => (
                <React.Fragment key={`${line}-${index}`}>
                  {line}
                  {index < lines.length - 1 ? <br /> : null}
                </React.Fragment>
              ))}
            </TemplateText>
            <TemplateText
              as="div"
              className="mt-6 text-justify text-[18px] leading-[34px]"
              editId="aboutText"
              editLabel="About text"
            >
              {String(getValue(data, "aboutText"))
                .split("\n\n")
                .map((paragraph, index) => (
                  <p key={index} className={index > 0 ? "mt-4" : undefined}>
                    {paragraph}
                  </p>
                ))}
            </TemplateText>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function ServicePriceList() {
  return (
    <section className="bg-white py-10">
      <div className="salonix-container space-y-12">
        {salonixPriceCategories.map((category, index) => (
          <Reveal key={category.id} delay={(index % 3) as 0 | 1 | 2}>
            <div id={category.id} className="scroll-mt-28">
              <h2 className="salonix-title text-right text-[28px]">{category.title}</h2>
              <span className="salonix-bar ms-auto mt-3" />
              {"items" in category && category.items ? (
                <div className="mt-6">
                  {category.items.map((item) => (
                    <div
                      key={`${category.id}-${item.name}`}
                      className="salonix-price-row flex flex-col gap-1 border-b border-[#ececec] py-4 md:flex-row md:items-start md:justify-between"
                    >
                      <div className="text-right">
                        <p className="text-base font-semibold">{item.name}</p>
                        {"note" in item && item.note ? (
                          <p className="mt-1 text-sm leading-6 text-[#666]">{item.note}</p>
                        ) : null}
                      </div>
                      <p className="text-base font-bold text-[#fc427f]">{item.price}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              {"groups" in category && category.groups ? (
                <div className="mt-6 grid gap-8 md:grid-cols-2">
                  {category.groups.map((group) => (
                    <div key={group.title} className="rounded border border-[#ececec] p-5">
                      <h3 className="text-lg font-bold">{group.title}</h3>
                      <div className="mt-4 space-y-3">
                        {group.items.map((item) => (
                          <div
                            key={`${group.title}-${item.name}`}
                            className="salonix-price-row flex items-center justify-between py-2"
                          >
                            <span className="font-semibold">{item.name}</span>
                            <span className="font-bold text-[#fc427f]">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function GalleryPage() {
  return (
    <div>
      <PageBanner title="גלריה" />
      <section className="bg-white py-10">
        <div className="salonix-container">
          <Reveal>
            <GalleryGrid images={salonixImages.gallery} />
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function ContactPage({ data }: { data: Record<string, any> }) {
  return (
    <div>
      <PageBanner title={getValue(data, "contactTitle")} />
      <section className="bg-white py-10">
        <div className="salonix-container grid gap-10 lg:grid-cols-2">
          <Reveal>
            <TemplateText as="h2" className="salonix-title text-right text-[28px]" editId="contactTitle">
              {getValue(data, "contactTitle")}
            </TemplateText>
            <TemplateText as="p" className="salonix-subtitle mt-3 text-right" editId="contactSubtitle">
              {getValue(data, "contactSubtitle")}
            </TemplateText>
            <TemplateText as="p" className="mt-4 text-[18px] leading-8 text-[#444]" editId="contactText">
              {getValue(data, "contactText")}
            </TemplateText>
            <div className="mt-8 space-y-3 text-right text-[18px] leading-[30px]">
              <p>
                טלפון: <TemplateText editId="phone">{getValue(data, "phone")}</TemplateText>
              </p>
              <p>
                אימייל: <TemplateText editId="email">{getValue(data, "email")}</TemplateText>
              </p>
              <p>
                כתובת: <TemplateText editId="address">{getValue(data, "address")}</TemplateText>
              </p>
              <div className="pt-2">
                <TemplateText editId="hoursLineOne">{getValue(data, "hoursLineOne")}</TemplateText>
                <br />
                <TemplateText editId="hoursLineTwo">{getValue(data, "hoursLineTwo")}</TemplateText>
                <br />
                <TemplateText editId="hoursLineThree">{getValue(data, "hoursLineThree")}</TemplateText>
              </div>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <form className="space-y-4 rounded border border-[#ececec] bg-[#fafafa] p-6">
              {[
                ["contactNameLabel", "text"],
                ["contactEmailLabel", "email"],
                ["contactPhoneLabel", "tel"],
              ].map(([key, type]) => (
                <label key={key} className="block text-right">
                  <span className="mb-2 block text-sm font-semibold">{getValue(data, key)}</span>
                  <input
                    type={type}
                    className="w-full border border-[#ddd] bg-white px-4 py-3 text-right outline-none"
                    placeholder={getValue(data, key)}
                  />
                </label>
              ))}
              <label className="block text-right">
                <span className="mb-2 block text-sm font-semibold">
                  {getValue(data, "contactMessageLabel")}
                </span>
                <textarea
                  rows={5}
                  className="w-full border border-[#ddd] bg-white px-4 py-3 text-right outline-none"
                  placeholder={getValue(data, "contactMessageLabel")}
                />
              </label>
              <button type="button" className="salonix-btn-dark">
                <TemplateText editId="contactButton">{getValue(data, "contactButton")}</TemplateText>
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function BookingPage({ data, onNavigate }: { data: Record<string, any>; onNavigate: (p: string) => void }) {
  return (
    <div id="booking">
      <PageBanner title={getValue(data, "navBooking")} />
      <section className="bg-white py-16">
        <div className="salonix-container max-w-3xl text-center">
          <Reveal>
            <TemplateText as="h1" className="salonix-title" editId="bookingTitle">
              {getValue(data, "bookingTitle")}
            </TemplateText>
            <TemplateText as="p" className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-[#444]" editId="bookingText">
              {getValue(data, "bookingText")}
            </TemplateText>
            <button type="button" className="salonix-btn-dark mt-8" onClick={() => onNavigate("contact")}>
              <TemplateText editId="bookingButton">{getValue(data, "bookingButton")}</TemplateText>
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer data-section-kind="footer" className="bg-white">
      <div className="salonix-container grid gap-8 py-10 md:grid-cols-3">
        <div className="text-right">
          <p className="text-2xl font-black uppercase">{getValue(data, "brandName")}</p>
          <TemplateText as="p" className="mt-4 text-[18px] leading-8 text-[#444]" editId="contactText">
            {getValue(data, "contactText")}
          </TemplateText>
        </div>
        <div className="text-right">
          <h3 className="text-lg font-bold">יצירת קשר</h3>
          <div className="mt-4 space-y-2 text-[16px] leading-[30px]">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </div>
        <div className="text-right">
          <h3 className="text-lg font-bold">שעות פעילות</h3>
          <div className="mt-4 space-y-1 text-[16px] leading-[30px]">
            <p>{getValue(data, "hoursLineOne")}</p>
            <p>{getValue(data, "hoursLineTwo")}</p>
            <p>{getValue(data, "hoursLineThree")}</p>
          </div>
        </div>
      </div>
      <div className="bg-black py-3">
        <div className="salonix-container">
          <TemplateText as="p" className="text-center text-[14px] leading-[26px] text-white" editId="footerText">
            {getValue(data, "footerText")}
          </TemplateText>
        </div>
      </div>
    </footer>
  );
}

function FloatingActions({
  data,
  onNavigate,
}: {
  data: Record<string, any>;
  onNavigate: (pageId: string) => void;
}) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 500);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed bottom-0 z-50 flex w-full flex-row items-center justify-center gap-5 md:bottom-[85px] md:end-[15px] md:w-auto md:flex-col">
        <a
          href={`tel:${String(getValue(data, "phone")).replace(/[^\d+]/g, "")}`}
          className="salonix-float-btn mx-[15px] w-full rounded bg-black p-[10px] md:mx-0 md:w-auto md:px-[10px] md:py-[7px]"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl text-white">☎</span>
            <p className="whitespace-nowrap text-[17px] font-semibold uppercase text-white md:hidden">
              {getValue(data, "floatCallLabel")}
            </p>
          </div>
        </a>
        <button
          type="button"
          onClick={() => onNavigate("booking")}
          className="salonix-float-btn mx-[15px] w-full rounded bg-black p-[10px] md:mx-0 md:w-auto md:px-[10px] md:py-[7px]"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl text-white">📅</span>
            <p className="whitespace-nowrap text-[17px] font-semibold uppercase text-white md:hidden">
              {getValue(data, "floatBookLabel")}
            </p>
          </div>
        </button>
      </div>
      <button
        type="button"
        aria-label="חזרה למעלה"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cx(
          "salonix-scroll-top fixed bottom-[80px] end-[15px] z-50 rounded border-[3px] border-[#fc427f] bg-[#fc427f] px-[10px] py-[5px] md:bottom-[15px]",
          showTop && "is-visible",
        )}
      >
        <span className="block p-1 text-xl text-white">↑</span>
      </button>
    </>
  );
}

function HomePage({
  data,
  onNavigate,
}: {
  data: Record<string, any>;
  onNavigate: (pageId: string) => void;
}) {
  return (
    <>
      <HeroSlider data={data} />
      <ServicesSection data={data} onNavigate={onNavigate} />
      <WelcomeSection data={data} onNavigate={onNavigate} />
      <GalleryPreview data={data} onNavigate={onNavigate} />
    </>
  );
}

function SalonixPages(props: SalonixPagesProps) {
  const mergedData = useMemo(
    () => ({ ...salonixDefaultData, ...(props.data || {}) }),
    [props.data],
  );
  const mode = props.mode || "preview";
  const { currentPage, goTo } = useTemplatePageNavigation(props, {
    allowedPages: salonixAllowedPages,
    fallbackPage: "home",
  });

  return (
    <div
      data-template-id={mode === "preview" ? "salonix-preview" : "salonix"}
      data-bizuply-site="true"
      data-studio-page="true"
      className="min-h-screen w-full overflow-x-hidden bg-white font-sans text-black"
      dir="rtl"
    >
      <style>{salonixEditorCss}</style>
      <Header data={mergedData} currentPage={currentPage} onNavigate={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} onNavigate={goTo} /> },
          { id: "about", content: <AboutPage data={mergedData} /> },
          {
            id: "services",
            content: (
              <div>
                <PageBanner title={getValue(mergedData, "navServices")} />
                <ServicePriceList />
              </div>
            ),
          },
          { id: "gallery", content: <GalleryPage /> },
          { id: "contact", content: <ContactPage data={mergedData} /> },
          { id: "booking", content: <BookingPage data={mergedData} onNavigate={goTo} /> },
        ]}
      />
      <Footer data={mergedData} />
      <FloatingActions data={mergedData} onNavigate={goTo} />
    </div>
  );
}

export default SalonixPages;
