import React, { useEffect, useMemo, useRef, useState } from "react";

import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { TemplateText } from "../shared/TemplateText";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import {
  gridlineDefaultData,
  gridlineImages,
  gridlineServiceCategories,
} from "./defaultData";
import { gridlineEditorCss } from "./editorCss";

export const gridlinePages = [
  { id: "home", label: "Home", slug: "/" },
  { id: "about", label: "About Us", slug: "/about" },
  { id: "services", label: "Services", slug: "/service" },
  { id: "gallery", label: "Gallery", slug: "/gallery" },
  { id: "contact", label: "Contact Us", slug: "/contact" },
  { id: "booking", label: "Booking", slug: "/booking" },
];

const gridlineAllowedPages = gridlinePages.map((page) => page.id);

type GridlinePagesProps = {
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
  return data?.[key] ?? (gridlineDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function useReveal() {
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={cx("gala-reveal", visible && "is-visible", className)}>
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
      <TemplateText
        as="div"
        className="gala-custom-title"
        editId={titleKey}
        editLabel={titleKey}
      >
        {getValue(data, titleKey)}
      </TemplateText>
      {subtitleKey ? (
        <TemplateText
          as="div"
          className="gala-sub-title"
          editId={subtitleKey}
          editLabel={subtitleKey}
        >
          {getValue(data, subtitleKey)}
        </TemplateText>
      ) : null}
      <span className="gala-accent-bar" aria-hidden="true" />
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
    ["booking", getValue(data, "navBooking"), getValue(data, "bookingUrl")],
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
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-30 w-full bg-white shadow-sm lg:py-[5px]"
    >
      <div className="gala-container">
        <nav className="relative flex h-full w-full items-center justify-between px-[15px] lg:gap-6 lg:px-0">
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label="Menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="block h-0.5 w-6 bg-black" />
            <span className="block h-0.5 w-6 bg-black" />
            <span className="block h-0.5 w-6 bg-black" />
          </button>

          <div className="flex w-full flex-col items-center justify-center">
            <button type="button" onClick={() => handleNav("home")} className="shrink-0">
              <img
                src={getValue(data, "logoImage")}
                alt={getValue(data, "brandName")}
                className="max-h-[90px] object-contain"
              />
            </button>
          </div>

          <div className="hidden w-full lg:block">
            <ul className="flex h-full items-center justify-center">
              {nav.map(([id, label, external]) => (
                <li key={id}>
                  {external && id === "booking" ? (
                    <a
                      href={external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gala-nav-link text-black"
                    >
                      {label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleNav(id)}
                      className={cx(
                        "gala-nav-link text-black",
                        currentPage === id && "is-active",
                      )}
                    >
                      {label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-10 lg:hidden" />
        </nav>

        <div className={cx("gala-mobile-nav bg-white lg:hidden", mobileOpen && "is-open")}>
          <ul className="flex flex-col border-t border-[#ececec] py-2">
            {nav.map(([id, label, external]) => (
              <li key={id}>
                {external && id === "booking" ? (
                  <a
                    href={external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-3 text-sm font-semibold uppercase"
                  >
                    {label}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNav(id)}
                    className={cx(
                      "block w-full px-4 py-3 text-left text-sm font-semibold uppercase",
                      currentPage === id && "bg-[#909090] text-white",
                    )}
                  >
                    {label}
                  </button>
                )}
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
    <section
      data-section-kind="hero"
      className="gala-section-hero relative w-full"
    >
      <button
        type="button"
        className="gala-hero-arrow prev"
        aria-label="Previous slide"
        onClick={() => go(-1)}
      >
        ‹
      </button>
      <button
        type="button"
        className="gala-hero-arrow next"
        aria-label="Next slide"
        onClick={() => go(1)}
      >
        ›
      </button>

      <div className="relative w-full" style={{ aspectRatio: "863 / 320" }}>
        {slides.map((src, slideIndex) => (
          <div
            key={`${src}-${slideIndex}`}
            className={cx("gala-hero-slide", slideIndex === index && "is-active")}
          >
            <img
              src={src}
              alt="Beauty nail"
              className="aspect-[863/320] w-full cursor-pointer object-cover"
            />
          </div>
        ))}
      </div>

      <div className="gala-hero-dots">
        {slides.map((_, dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            aria-label={`Slide ${dotIndex + 1}`}
            className={cx("gala-dot", dotIndex === index && "is-active")}
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
  service: (typeof gridlineImages.services)[number];
  onNavigate: (pageId: string) => void;
}) {
  return (
    <div className="gala-hover-item relative h-full w-full px-[15px]">
      <div
        className="gala-bg-hover-left hidden bg-cover sm:block"
        style={{ backgroundImage: `url('${getValue(data, "bgServiceImage")}')` }}
      />
      <div
        className="gala-bg-hover-right hidden bg-cover sm:block"
        style={{ backgroundImage: `url('${getValue(data, "bgServiceImage")}')` }}
      />
      <button
        type="button"
        onClick={() => onNavigate("services")}
        className="mx-0 flex w-full flex-col items-center justify-center bg-white md:mx-[30px]"
      >
        <div className="gala-service-circle">
          <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
        </div>
        <h3 className="gala-title-service">{service.title}</h3>
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
  const services = gridlineImages.services;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMobileIndex((current) => (current + 1) % services.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [services.length]);

  return (
    <section data-section-kind="services" className="w-full bg-white py-4">
      <div className="gala-container">
        <Reveal>
          <SectionHeading
            data={data}
            titleKey="servicesTitle"
            subtitleKey="servicesSubtitle"
          />
        </Reveal>

        <div className="relative z-20 mt-6 hidden w-full grid-cols-1 items-center justify-center gap-x-[10px] gap-y-[20px] md:grid-cols-2 lg:grid lg:grid-cols-3 xl:grid-cols-6">
          {services.map((service) => (
            <ServiceCard
              key={service.anchor}
              data={data}
              service={service}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        <div className="relative mt-6 overflow-hidden lg:hidden">
          <div
            className="gala-service-track"
            style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
          >
            {services.map((service) => (
              <div key={service.anchor} className="min-w-full shrink-0 px-2">
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
                className={cx("gala-dot border-black!", mobileIndex === dotIndex && "is-active")}
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
      <div className="gala-container">
        <Reveal>
          <div className="grid grid-cols-1 items-stretch justify-between gap-0 lg:grid-cols-2 lg:gap-4">
            <div className="relative min-h-[320px] overflow-hidden">
              <img
                src={getValue(data, "welcomeImage")}
                alt={getValue(data, "brandName")}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="relative flex flex-col items-center justify-start gap-6 p-4">
              <div
                className="gala-welcome-bg"
                style={{
                  backgroundImage: `url('${getValue(data, "bgWelcomeImage")}')`,
                }}
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
              <button type="button" onClick={() => onNavigate("about")} className="relative z-10 w-full">
                <TemplateText
                  as="span"
                  className="gala-view-more-link text-[18px] leading-[34px]"
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

function GalleryGrid({
  images,
  limit,
}: {
  images: string[];
  limit?: number;
}) {
  const list = limit ? images.slice(0, limit) : images;
  return (
    <div className="mt-6 grid grid-cols-2 gap-[12px] md:grid-cols-3 lg:grid-cols-4">
      {list.map((src, index) => (
        <div key={`${src}-${index}`} className="gala-hover-transform aspect-square cursor-pointer">
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
    <section data-section-kind="gallery" className="section_gallery w-full bg-white py-5">
      <div className="gala-container">
        <Reveal>
          <SectionHeading
            data={data}
            titleKey="galleryTitle"
            subtitleKey="gallerySubtitle"
          />
          <GalleryGrid images={gridlineImages.gallery} limit={12} />
          <div className="flex w-full flex-col items-center justify-center">
            <button type="button" className="gala-view-more" onClick={() => onNavigate("gallery")}>
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
  return <div className="gala-breadcrumb">{title}</div>;
}

function AboutPage({ data }: { data: Record<string, any> }) {
  const lines = String(getValue(data, "aboutTitle")).split("\n");

  return (
    <div>
      <PageBanner title={getValue(data, "navAbout")} />
      <section className="bg-white py-10">
        <div className="gala-container grid gap-8 lg:grid-cols-2">
          <Reveal>
            <img
              src={getValue(data, "aboutImage")}
              alt={getValue(data, "brandName")}
              className="h-full min-h-[320px] w-full object-cover"
            />
          </Reveal>
          <Reveal>
            <TemplateText
              as="h1"
              className="gala-custom-title text-left"
              editId="aboutTitle"
              editLabel="About title"
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
              className="mt-6 text-justify text-[18px] leading-[34px] text-black"
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

function ServicePriceList({ data }: { data: Record<string, any> }) {
  return (
    <section className="bg-white py-10">
      <div className="gala-container space-y-12">
        {gridlineServiceCategories.map((category) => (
          <Reveal key={category.id}>
            <div id={category.id} className="scroll-mt-28">
              <h2 className="gala-custom-title text-left text-[28px]">{category.title}</h2>
              <span className="gala-accent-bar mt-3" />

              {"items" in category && category.items ? (
                <div className="mt-6">
                  {category.items.map((item) => (
                    <div
                      key={`${category.id}-${item.name}`}
                      className="gala-price-row flex flex-col gap-1 py-4 md:flex-row md:items-start md:justify-between"
                    >
                      <div>
                        <p className="text-[16px] font-semibold uppercase text-black">{item.name}</p>
                        {"note" in item && item.note ? (
                          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#666]">{item.note}</p>
                        ) : null}
                      </div>
                      <p className="text-[16px] font-bold text-[#fc427f]">{item.price}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {"groups" in category && category.groups ? (
                <div className="mt-6 grid gap-8 md:grid-cols-2">
                  {category.groups.map((group) => (
                    <div key={group.title} className="rounded border border-[#ececec] p-5">
                      <h3 className="text-lg font-bold uppercase">{group.title}</h3>
                      <div className="mt-4 space-y-3">
                        {group.items.map((item) => (
                          <div
                            key={`${group.title}-${item.name}`}
                            className="gala-price-row flex items-center justify-between py-2"
                          >
                            <span className="font-semibold uppercase">{item.name}</span>
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

        <Reveal>
          <div className="rounded border border-[#ececec] bg-[#fafafa] p-8 text-center">
            <TemplateText
              as="h3"
              className="text-2xl font-bold uppercase"
              editId="bookingTitle"
              editLabel="Booking title"
            >
              {getValue(data, "bookingTitle")}
            </TemplateText>
            <TemplateText
              as="p"
              className="mx-auto mt-4 max-w-2xl text-[18px] leading-8 text-[#444]"
              editId="bookingText"
              editLabel="Booking text"
            >
              {getValue(data, "bookingText")}
            </TemplateText>
            <a
              href={getValue(data, "bookingUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="gala-view-more mt-6 inline-block"
            >
              <TemplateText editId="bookingButton" editLabel="Booking button">
                {getValue(data, "bookingButton")}
              </TemplateText>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function GalleryPage() {
  return (
    <div>
      <PageBanner title="Gallery" />
      <section className="bg-white py-10">
        <div className="gala-container">
          <Reveal>
            <GalleryGrid images={gridlineImages.galleryFull} />
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
        <div className="gala-container grid gap-10 lg:grid-cols-2">
          <Reveal>
            <TemplateText
              as="h2"
              className="gala-custom-title text-left text-[28px]"
              editId="contactTitle"
              editLabel="Contact title"
            >
              {getValue(data, "contactTitle")}
            </TemplateText>
            <TemplateText
              as="p"
              className="gala-sub-title mt-3 text-left"
              editId="contactSubtitle"
              editLabel="Contact subtitle"
            >
              {getValue(data, "contactSubtitle")}
            </TemplateText>
            <TemplateText
              as="p"
              className="mt-4 text-[18px] leading-8 text-[#444]"
              editId="contactText"
              editLabel="Contact text"
            >
              {getValue(data, "contactText")}
            </TemplateText>

            <div className="mt-8 space-y-4 text-[18px] leading-[30px]">
              <p>
                <strong>Phone:</strong>{" "}
                <TemplateText editId="phone" editLabel="Phone">
                  {getValue(data, "phone")}
                </TemplateText>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <TemplateText editId="email" editLabel="Email">
                  {getValue(data, "email")}
                </TemplateText>
              </p>
              <p>
                <strong>Address:</strong>{" "}
                <TemplateText editId="address" editLabel="Address">
                  {getValue(data, "address")}
                </TemplateText>
              </p>
              <div className="pt-2">
                <TemplateText editId="hoursLineOne" editLabel="Hours line 1">
                  {getValue(data, "hoursLineOne")}
                </TemplateText>
                <br />
                <TemplateText editId="hoursLineTwo" editLabel="Hours line 2">
                  {getValue(data, "hoursLineTwo")}
                </TemplateText>
                <br />
                <TemplateText editId="hoursLineThree" editLabel="Hours line 3">
                  {getValue(data, "hoursLineThree")}
                </TemplateText>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <form className="space-y-4 rounded border border-[#ececec] bg-[#fafafa] p-6">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold uppercase">
                  {getValue(data, "contactNameLabel")}
                </span>
                <input
                  type="text"
                  className="w-full border border-[#ddd] bg-white px-4 py-3 outline-none"
                  placeholder={getValue(data, "contactNameLabel")}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold uppercase">
                  {getValue(data, "contactEmailLabel")}
                </span>
                <input
                  type="email"
                  className="w-full border border-[#ddd] bg-white px-4 py-3 outline-none"
                  placeholder={getValue(data, "contactEmailLabel")}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold uppercase">
                  {getValue(data, "contactPhoneLabel")}
                </span>
                <input
                  type="tel"
                  className="w-full border border-[#ddd] bg-white px-4 py-3 outline-none"
                  placeholder={getValue(data, "contactPhoneLabel")}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold uppercase">
                  {getValue(data, "contactMessageLabel")}
                </span>
                <textarea
                  rows={5}
                  className="w-full border border-[#ddd] bg-white px-4 py-3 outline-none"
                  placeholder={getValue(data, "contactMessageLabel")}
                />
              </label>
              <button type="button" className="gala-view-more">
                <TemplateText editId="contactButton" editLabel="Contact button">
                  {getValue(data, "contactButton")}
                </TemplateText>
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function BookingPage({ data }: { data: Record<string, any> }) {
  return (
    <div>
      <PageBanner title={getValue(data, "navBooking")} />
      <section className="bg-white py-16">
        <div className="gala-container max-w-3xl text-center">
          <Reveal>
            <TemplateText
              as="h1"
              className="gala-custom-title"
              editId="bookingTitle"
              editLabel="Booking title"
            >
              {getValue(data, "bookingTitle")}
            </TemplateText>
            <TemplateText
              as="p"
              className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-[#444]"
              editId="bookingText"
              editLabel="Booking text"
            >
              {getValue(data, "bookingText")}
            </TemplateText>
            <a
              href={getValue(data, "bookingUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="gala-view-more mt-8 inline-block"
            >
              <TemplateText editId="bookingButton" editLabel="Booking button">
                {getValue(data, "bookingButton")}
              </TemplateText>
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer data-section-kind="footer" className="bg-white">
      <div className="gala-container grid gap-8 py-10 md:grid-cols-3">
        <div>
          <img
            src={getValue(data, "logoImage")}
            alt={getValue(data, "brandName")}
            className="max-h-[80px] object-contain"
          />
          <TemplateText
            as="p"
            className="mt-4 text-[18px] leading-8 text-[#444]"
            editId="contactText"
            editLabel="Footer intro"
          >
            {getValue(data, "contactText")}
          </TemplateText>
        </div>
        <div>
          <h3 className="text-lg font-bold uppercase">Contact</h3>
          <div className="mt-4 space-y-2 text-[16px] leading-[30px]">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold uppercase">Opening Hours</h3>
          <div className="mt-4 space-y-1 text-[16px] leading-[30px]">
            <p>{getValue(data, "hoursLineOne")}</p>
            <p>{getValue(data, "hoursLineTwo")}</p>
            <p>{getValue(data, "hoursLineThree")}</p>
          </div>
        </div>
      </div>
      <div className="bg-black py-3">
        <div className="gala-container">
          <TemplateText
            as="p"
            className="text-center text-[14px] leading-[26px] text-white"
            editId="footerText"
            editLabel="Footer text"
          >
            {getValue(data, "footerText")}
          </TemplateText>
        </div>
      </div>
    </footer>
  );
}

function FloatingActions({ data }: { data: Record<string, any> }) {
  return (
    <>
      <div className="fixed bottom-0 z-50 flex w-full flex-row items-center justify-center gap-5 md:bottom-[85px] md:right-[15px] md:w-auto md:flex-col">
        <a
          href={`tel:${String(getValue(data, "phone")).replace(/[^\d+]/g, "")}`}
          className="gala-custom-hover mx-[15px] w-full cursor-pointer rounded border-[3px] border-white bg-black p-[10px] md:mx-0 md:w-auto md:px-[10px] md:py-[7px] lg:w-auto"
        >
          <div className="flex w-full items-center justify-center gap-2">
            <span className="text-xl text-white">☎</span>
            <p className="whitespace-nowrap text-center text-[17px] font-semibold uppercase text-white md:hidden">
              {getValue(data, "floatCallLabel")}
            </p>
          </div>
        </a>
        <a
          href={getValue(data, "bookingUrl")}
          target="_blank"
          rel="noopener noreferrer"
          className="gala-custom-hover mx-[15px] w-full cursor-pointer rounded border-[3px] border-white bg-black p-[10px] md:mx-0 md:w-auto md:px-[10px] md:py-[7px] lg:w-auto"
        >
          <div className="flex w-full items-center justify-center gap-2">
            <span className="text-xl text-white">📅</span>
            <p className="whitespace-nowrap text-center text-[17px] font-semibold uppercase text-white md:hidden">
              {getValue(data, "floatBookLabel")}
            </p>
          </div>
        </a>
      </div>
      <ScrollTopButton />
    </>
  );
}

function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 500);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cx(
        "gala-scroll-top fixed bottom-[80px] right-[15px] z-50 rounded border-[3px] border-[#fc427f] bg-[#fc427f] px-[10px] py-[5px] md:bottom-[15px]",
        visible && "is-visible",
      )}
    >
      <span className="block p-1 text-xl text-white">↑</span>
    </button>
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

function GridlinePages(props: GridlinePagesProps) {
  const mergedData = useMemo(
    () => ({ ...gridlineDefaultData, ...(props.data || {}) }),
    [props.data],
  );

  const mode = props.mode || "preview";
  const { currentPage, goTo } = useTemplatePageNavigation(props, {
    allowedPages: gridlineAllowedPages,
    fallbackPage: "home",
  });

  return (
    <div
      data-template-id={mode === "preview" ? "gridline-preview" : "gridline"}
      data-bizuply-site="true"
      data-studio-page="true"
      className="min-h-screen w-full overflow-x-hidden bg-white font-sans text-black"
      dir="ltr"
    >
      <style>{gridlineEditorCss}</style>
      <Header
        data={mergedData}
        currentPage={currentPage}
        onNavigate={goTo}
      />

      <VisualPageStack
        activePageId={currentPage}
        pages={[
          {
            id: "home",
            content: <HomePage data={mergedData} onNavigate={goTo} />,
          },
          {
            id: "about",
            content: <AboutPage data={mergedData} />,
          },
          {
            id: "services",
            content: (
              <div>
                <PageBanner title={getValue(mergedData, "navServices")} />
                <ServicePriceList data={mergedData} />
              </div>
            ),
          },
          {
            id: "gallery",
            content: <GalleryPage />,
          },
          {
            id: "contact",
            content: <ContactPage data={mergedData} />,
          },
          {
            id: "booking",
            content: <BookingPage data={mergedData} />,
          },
        ]}
      />

      <Footer data={mergedData} />
      <FloatingActions data={mergedData} />
    </div>
  );
}

export default GridlinePages;
