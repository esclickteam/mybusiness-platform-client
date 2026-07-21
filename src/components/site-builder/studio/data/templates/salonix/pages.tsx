import React, { useEffect, useMemo, useState } from "react";

import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { TemplateText } from "../shared/TemplateText";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import {
  salonixAssets,
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
      <TemplateText as="div" className="salonix-custom-title" editId={titleKey} editLabel={titleKey}>
        {getValue(data, titleKey)}
      </TemplateText>
      {subtitleKey ? (
        <TemplateText as="div" className="salonix-sub-title" editId={subtitleKey} editLabel={subtitleKey}>
          {getValue(data, subtitleKey)}
        </TemplateText>
      ) : null}
      <span className="salonix-accent-bar" aria-hidden="true" />
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

  const bgService = getValue(data, "bgServiceImage");

  return (
    <header data-visual-flow-lock="true" data-section-kind="header" className="sticky top-0 z-30 w-full bg-white shadow-sm lg:py-[5px]">
      <div className="salonix-container">
        <nav className="relative flex w-full flex-wrap items-center justify-between px-[15px] lg:px-0">
          <div className="flex w-full flex-col items-center justify-center">
            <button type="button" onClick={() => handleNav("home")} className="shrink-0 py-2">
              <TemplateText
                as="span"
                className="text-3xl font-black uppercase tracking-[0.08em] text-black md:text-4xl"
                editId="brandName"
                editLabel="Brand name"
              >
                {getValue(data, "brandName")}
              </TemplateText>
            </button>
          </div>

          <ul className="hidden w-full items-center justify-center lg:flex">
            {nav.map(([id, label]) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => handleNav(id)}
                  className={cx("salonix-nav-link text-black", currentPage === id && "is-active")}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="absolute end-[15px] top-4 rounded-[3px] border border-black p-[5px] lg:hidden"
            aria-label="תפריט"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <img src={salonixAssets.menuIcon} alt="" className="h-10 w-[50px] cursor-pointer object-contain" />
          </button>
        </nav>

        <div className={cx("salonix-mobile-menu-wrap w-full bg-white lg:hidden", mobileOpen && "is-open")}>
          <ul className="flex flex-col">
            {nav.map(([id, label]) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => handleNav(id)}
                  className={cx(
                    "salonix-mobile-nav-link block w-full text-center",
                    currentPage === id ? "is-active" : "bg-white text-black",
                  )}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <span className="hidden">{bgService}</span>
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
    <section data-section-kind="hero" className="salonix-section-hero w-full" dir="ltr">
      <button type="button" className="salonix-hero-arrow prev" aria-label="Previous" onClick={() => go(-1)}>
        <img src={salonixAssets.heroNext} alt="" className="h-[50px] w-[50px] rotate-180" />
      </button>
      <button type="button" className="salonix-hero-arrow next" aria-label="Next" onClick={() => go(1)}>
        <img src={salonixAssets.heroNext} alt="" className="h-[50px] w-[50px]" />
      </button>

      <div className="salonix-hero-viewport">
        <div className="salonix-hero-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((src, slideIndex) => (
            <div key={`${src}-${slideIndex}`} className="salonix-hero-slide">
              <img src={src} alt="Salonix hero banner" />
            </div>
          ))}
        </div>
      </div>

      <div className="salonix-hero-dots">
        {slides.map((_, dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            aria-label={`Slide ${dotIndex + 1}`}
            className={cx("salonix-dot", dotIndex === index && "is-active")}
            onClick={() => setIndex(dotIndex)}
          />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({
  data,
  service,
  onNavigate,
}: {
  data: Record<string, any>;
  service: (typeof salonixImages.services)[number];
  onNavigate: (pageId: string) => void;
}) {
  const bg = getValue(data, "bgServiceImage");

  return (
    <div className="salonix-hover-item">
      <div
        className="salonix-bg-hover-left hidden bg-cover sm:block"
        style={{ backgroundImage: `url('${bg}')` }}
        aria-hidden="true"
      />
      <div
        className="salonix-bg-hover-right hidden bg-cover sm:block"
        style={{ backgroundImage: `url('${bg}')` }}
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={() => onNavigate("services")}
        className="relative z-10 mx-0 flex w-full flex-col items-center bg-white md:mx-[30px]"
      >
        <div className="salonix-service-ring">
          <img src={service.image} alt={service.title} />
        </div>
        <h3 className="salonix-title-service">{service.title}</h3>
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
    <section data-section-kind="services" className="w-full bg-white">
      <div className="salonix-container">
        <SectionHeading data={data} titleKey="servicesTitle" subtitleKey="servicesSubtitle" />

        <div className="relative z-20 mt-6 hidden w-full grid-cols-1 items-center justify-center gap-x-[10px] gap-y-5 md:grid md:grid-cols-2 lg:grid lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.anchor} data={data} service={service} onNavigate={onNavigate} />
          ))}
        </div>

        <div className="relative mt-6 overflow-hidden lg:hidden" dir="ltr">
          <div className="salonix-mobile-track" style={{ transform: `translateX(-${mobileIndex * 100}%)` }}>
            {services.map((service) => (
              <div key={service.anchor} className="min-w-full shrink-0">
                <ServiceCard data={data} service={service} onNavigate={onNavigate} />
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
    <section data-section-kind="about" className="w-full bg-white pt-10">
      <div className="salonix-container">
        <div className="grid h-full w-full grid-cols-1 items-stretch justify-between gap-0 lg:grid-cols-2 lg:gap-4">
          <div className="h-full w-full">
            <img src={getValue(data, "welcomeImage")} alt={getValue(data, "brandName")} className="h-full w-full object-cover" />
          </div>
          <div className="relative flex flex-col items-center justify-start gap-6 p-4">
            <div
              className="salonix-welcome-bg"
              style={{ backgroundImage: `url('${getValue(data, "bgWelcomeImage")}')` }}
            />
            <TemplateText
              as="div"
              className="relative z-10 text-center text-[26px] font-semibold uppercase leading-[34px] text-white"
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
              className="relative z-10 text-justify text-[18px] font-normal leading-[34px] text-black"
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
            <button type="button" onClick={() => onNavigate("about")} className="relative z-10 w-full text-start">
              <TemplateText
                as="span"
                className="salonix-view-more-link text-[18px] leading-[34px]"
                editId="welcomeButton"
                editLabel="Welcome button"
              >
                {getValue(data, "welcomeButton")}
              </TemplateText>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function GalleryGrid({ images, limit }: { images: string[]; limit?: number }) {
  const list = limit ? images.slice(0, limit) : images;
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {list.map((src, index) => (
        <div key={`${src}-${index}`} className="hover_transform_item">
          <img src={src} alt={`Gallery ${index + 1}`} />
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
        <SectionHeading data={data} titleKey="galleryTitle" subtitleKey="gallerySubtitle" />
        <GalleryGrid images={salonixImages.gallery} limit={12} />
        <div className="flex w-full flex-col items-center justify-center">
          <button type="button" className="salonix-view-more" onClick={() => onNavigate("gallery")}>
            <TemplateText editId="galleryButton" editLabel="Gallery button">
              {getValue(data, "galleryButton")}
            </TemplateText>
          </button>
        </div>
      </div>
    </section>
  );
}

function PageBanner({ title }: { title: string }) {
  return (
    <div className="bg-[rgba(72,72,72,0.7)] py-7 text-center text-sm font-semibold uppercase tracking-wide text-white">
      {title}
    </div>
  );
}

function AboutPage({ data }: { data: Record<string, any> }) {
  const lines = String(getValue(data, "aboutTitle")).split("\n");
  return (
    <div>
      <PageBanner title={getValue(data, "navAbout")} />
      <section className="bg-white py-10">
        <div className="salonix-container grid gap-8 lg:grid-cols-2">
          <img src={getValue(data, "aboutImage")} alt={getValue(data, "brandName")} className="min-h-[320px] w-full object-cover" />
          <div>
            <TemplateText as="h1" className="salonix-custom-title text-right" editId="aboutTitle" editLabel="About title">
              {lines.map((line, index) => (
                <React.Fragment key={`${line}-${index}`}>
                  {line}
                  {index < lines.length - 1 ? <br /> : null}
                </React.Fragment>
              ))}
            </TemplateText>
            <TemplateText as="div" className="mt-6 text-justify text-[18px] leading-[34px]" editId="aboutText" editLabel="About text">
              {String(getValue(data, "aboutText"))
                .split("\n\n")
                .map((paragraph, index) => (
                  <p key={index} className={index > 0 ? "mt-4" : undefined}>
                    {paragraph}
                  </p>
                ))}
            </TemplateText>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServicePriceList() {
  return (
    <section className="bg-white py-10">
      <div className="salonix-container flex flex-col gap-20 pt-5">
        {salonixPriceCategories.map((category, categoryIndex) => (
          <div
            key={category.id}
            id={category.id}
            className={cx(
              "grid w-full grid-cols-1 items-center gap-8 scroll-mt-28 lg:grid-cols-[4fr_8fr] lg:gap-[30px]",
              categoryIndex % 2 === 1 && "lg:[&>div:first-child]:order-2",
            )}
          >
            <div className="flex justify-center">
              {"image" in category && category.image ? (
                <div className="salonix-service-page-ring">
                  <img src={category.image} alt={category.title} className="h-full w-full object-cover" />
                </div>
              ) : null}
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-[15px]">
              <div className="flex w-full flex-col">
                <div className="w-full border-b border-black pb-2">
                  <h2 className="text-[30px] font-bold uppercase leading-[30px] text-black">{category.title}</h2>
                </div>
              </div>
              {"items" in category && category.items ? (
                <div className="flex w-full flex-col gap-4">
                  {category.items.map((item) => (
                    <div key={`${category.id}-${item.name}`} className="salonix-price-line flex items-center justify-between py-1">
                      <p className="text-[15px] font-medium uppercase leading-[22px] text-black">{item.name}</p>
                      <p className="text-[15px] font-bold text-[#fc427f]">{item.price}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              {"groups" in category && category.groups ? (
                <div className="grid w-full gap-6 md:grid-cols-2">
                  {category.groups.map((group) => (
                    <div key={group.title}>
                      <h3 className="mb-3 text-lg font-bold uppercase">{group.title}</h3>
                      {group.items.map((item) => (
                        <div key={`${group.title}-${item.name}`} className="salonix-price-line flex items-center justify-between py-2">
                          <span className="font-semibold uppercase">{item.name}</span>
                          <span className="font-bold text-[#fc427f]">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
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
          <GalleryGrid images={salonixImages.gallery} />
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
          <div>
            <TemplateText as="h2" className="salonix-custom-title text-right text-[28px]" editId="contactTitle">
              {getValue(data, "contactTitle")}
            </TemplateText>
            <TemplateText as="p" className="salonix-sub-title mt-3 text-right" editId="contactSubtitle">
              {getValue(data, "contactSubtitle")}
            </TemplateText>
            <form className="mt-8 space-y-4">
              {[
                ["contactNameLabel", "text"],
                ["contactEmailLabel", "email"],
                ["contactPhoneLabel", "tel"],
              ].map(([key, type]) => (
                <label key={key} className="block text-right">
                  <span className="mb-2 block text-sm font-semibold">{getValue(data, key)}</span>
                  <input type={type} className="w-full border border-[#ddd] px-4 py-3 text-right outline-none" />
                </label>
              ))}
              <label className="block text-right">
                <span className="mb-2 block text-sm font-semibold">{getValue(data, "contactMessageLabel")}</span>
                <textarea rows={5} className="w-full border border-[#ddd] px-4 py-3 text-right outline-none" />
              </label>
              <button type="button" className="salonix-view-more">
                <TemplateText editId="contactButton">{getValue(data, "contactButton")}</TemplateText>
              </button>
            </form>
          </div>
          <div>
            <div className="salonix-google-maps mb-6">
              <iframe src={getValue(data, "mapEmbed")} title="Salonix map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
            <div className="space-y-2 text-right text-[16px] leading-[30px]">
              <p>{getValue(data, "phone")}</p>
              <p>{getValue(data, "email")}</p>
              <p>{getValue(data, "address")}</p>
            </div>
          </div>
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
          <TemplateText as="h1" className="salonix-custom-title" editId="bookingTitle">
            {getValue(data, "bookingTitle")}
          </TemplateText>
          <TemplateText as="p" className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-[#444]" editId="bookingText">
            {getValue(data, "bookingText")}
          </TemplateText>
          <button type="button" className="salonix-view-more mt-8" onClick={() => onNavigate("contact")}>
            <TemplateText editId="bookingButton">{getValue(data, "bookingButton")}</TemplateText>
          </button>
        </div>
      </section>
    </div>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer data-section-kind="footer" className="bg-white">
      <div className="salonix-container" style={{ paddingTop: 0 }}>
        <div className="salonix-google-maps mb-2">
          <iframe src={getValue(data, "mapEmbed")} title="Salonix map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>
      </div>

      <div
        className="salonix-footer-panel w-full bg-cover bg-center"
        style={{ backgroundImage: `url('${getValue(data, "bgFooterImage")}')` }}
      >
        <div className="salonix-container">
          <div className="grid grid-cols-1 items-center justify-between gap-10 md:grid-cols-3 md:items-start md:gap-0">
            <div className="flex flex-col items-center gap-2 md:items-start">
              <span className="h-2 w-[100px] bg-white" />
              <h2 className="text-[28px] font-bold uppercase leading-[50px] text-white">
                {getValue(data, "footerLocationTitle")}
              </h2>
              <div className="space-y-2 text-[14px] font-light leading-[21px] text-white">
                <p>{getValue(data, "address")}</p>
                <p>{getValue(data, "phone")}</p>
                <p>{getValue(data, "email")}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 md:items-start">
              <span className="h-2 w-[100px] bg-white" />
              <h2 className="text-[28px] font-bold uppercase leading-[50px] text-white">
                {getValue(data, "footerHoursTitle")}
              </h2>
              <table className="text-[14px] leading-[21px] text-white">
                <tbody>
                  <tr>
                    <td className="pb-2 pe-2.5 align-top font-bold">{getValue(data, "hoursOneLabel")}</td>
                    <td className="pb-2 font-light">{getValue(data, "hoursOneValue")}</td>
                  </tr>
                  <tr>
                    <td className="pb-2 pe-2.5 align-top font-bold">{getValue(data, "hoursTwoLabel")}</td>
                    <td className="pb-2 font-light">{getValue(data, "hoursTwoValue")}</td>
                  </tr>
                  <tr>
                    <td className="pb-2 pe-2.5 align-top font-bold">{getValue(data, "hoursThreeLabel")}</td>
                    <td className="pb-2 font-light">{getValue(data, "hoursThreeValue")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col items-center gap-2 md:items-start">
              <span className="h-2 w-[100px] bg-white" />
              <h2 className="text-[28px] font-bold uppercase leading-[50px] text-white">
                {getValue(data, "footerSocialTitle")}
              </h2>
              <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                {["Instagram", "Facebook", "TikTok"].map((network) => (
                  <span
                    key={network}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/40 text-xs font-bold text-white"
                  >
                    {network[0]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black py-2.5 md:pb-0 md:pt-0">
        <div className="salonix-container flex h-full items-end justify-center py-2.5 md:justify-start">
          <TemplateText as="p" className="text-center text-[14px] leading-[26px] text-white md:text-start" editId="footerText">
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
          className="custom_hover mx-[15px] w-full rounded border-[3px] border-white bg-black p-[10px] md:mx-0 md:w-auto md:px-[10px] md:py-[7px] lg:w-auto"
        >
          <div className="flex w-full items-center justify-center gap-2">
            <img src={salonixAssets.callIcon} alt="" className="mx-auto h-5 w-5 md:h-8 md:w-8" />
            <p className="whitespace-nowrap text-center text-[17px] font-semibold uppercase text-white md:hidden">
              {getValue(data, "floatCallLabel")}
            </p>
          </div>
        </a>
        <button
          type="button"
          onClick={() => onNavigate("booking")}
          className="custom_hover mx-[15px] w-full rounded border-[3px] border-white bg-black p-[10px] md:mx-0 md:w-auto md:px-[10px] md:py-[7px] lg:w-auto"
        >
          <div className="flex w-full items-center justify-center gap-2">
            <img src={salonixAssets.bookIcon} alt="" className="mx-auto h-5 w-5 md:h-8 md:w-8" />
            <p className="whitespace-nowrap text-center text-[17px] font-semibold uppercase text-white md:hidden">
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
        <img src={salonixAssets.scrollTop} alt="" className="mx-auto h-8 w-8 p-1" />
      </button>
    </>
  );
}

function HomePage({ data, onNavigate }: { data: Record<string, any>; onNavigate: (pageId: string) => void }) {
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
  const mergedData = useMemo(() => ({ ...salonixDefaultData, ...(props.data || {}) }), [props.data]);
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
