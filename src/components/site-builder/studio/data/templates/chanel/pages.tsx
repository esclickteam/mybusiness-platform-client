import React from "react";
import { chanelEditorCss } from "./chanelEditorCss";
import { chanelEditorPages } from "./chanelData";

export type ChanelPageId =
  | "home"
  | "about"
  | "services"
  | "gallery"
  | "prices"
  | "booking"
  | "contact";

export const chanelPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "טיפולים", slug: "/services" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "prices", label: "מחירים", slug: "/prices" },
  { id: "booking", label: "קביעת תור", slug: "/booking" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
] as const;

type Props = {
  initialPage?: ChanelPageId | string;
  isStudioStatic?: boolean;
  mode?: "preview" | "editor" | "public";
};

const pageAliases: Record<string, ChanelPageId> = {
  "": "home",
  "/": "home",
  home: "home",
  "#home": "home",
  בית: "home",

  about: "about",
  "#about": "about",
  אודות: "about",

  services: "services",
  "#services": "services",
  טיפולים: "services",
  שירותים: "services",

  gallery: "gallery",
  "#gallery": "gallery",
  גלריה: "gallery",

  prices: "prices",
  "#prices": "prices",
  pricing: "prices",
  "#pricing": "prices",
  מחירים: "prices",

  booking: "booking",
  "#booking": "booking",
  appointment: "booking",
  appointments: "booking",
  "קביעת-תור": "booking",
  "קביעת תור": "booking",

  contact: "contact",
  "#contact": "contact",
  "צור-קשר": "contact",
  "צור קשר": "contact",
};

const chanelRuntimeCss = `
  [data-template-id="chanel"] {
    overflow: hidden !important;
  }

  .chanel-page-shell {
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    overflow: hidden;
    background: #fff8f3;
    color: #241711;
  }

  .chanel-scroll-shell {
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    scroll-behavior: smooth;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    background: #fff8f3;
  }

  .chanel-template-root {
    position: relative;
    min-height: 100%;
    overflow-x: hidden;
    overflow-y: visible;
    isolation: isolate;
  }

  .chanel-template-root * {
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }

  .chanel-template-root .chanel-motion-item {
    opacity: var(--chanel-motion-opacity, 0);
    transform:
      translate3d(
        var(--chanel-motion-x, 0px),
        var(--chanel-motion-y, 100px),
        0
      )
      scale(var(--chanel-motion-scale, 0.94));
    filter: blur(var(--chanel-motion-blur, 16px));
    will-change: opacity, transform, filter;
    transition: none !important;
  }

  .chanel-template-root .chanel-motion-image {
    transform:
      translate3d(
        var(--chanel-image-x, 0px),
        var(--chanel-image-y, 0px),
        0
      )
      scale(var(--chanel-image-scale, 1));
    will-change: transform;
    transition: none !important;
  }

  .chanel-template-root .chanel-motion-marquee {
    transform: translate3d(var(--chanel-marquee-x, 0px), 0, 0);
    will-change: transform;
    transition: none !important;
  }

  .chanel-template-root .chanel-motion-hero-image {
    transform:
      translate3d(0, var(--chanel-hero-image-y, 0px), 0)
      scale(var(--chanel-hero-image-scale, 1.05));
    will-change: transform;
    transition: none !important;
  }

  .chanel-template-root .chanel-home-hero-content {
    opacity: var(--chanel-hero-content-opacity, 1);
    transform: translate3d(0, var(--chanel-hero-content-y, 0px), 0);
    filter: blur(var(--chanel-hero-content-blur, 0px));
    will-change: opacity, transform, filter;
    transition: none !important;
  }

  .chanel-template-root .chanel-home-eyebrow,
  .chanel-template-root .chanel-home-hero h1,
  .chanel-template-root .chanel-home-hero-content > p,
  .chanel-template-root .chanel-home-hero-actions {
    transition: none !important;
    will-change: opacity, transform, filter;
  }

  .chanel-template-root .chanel-shine::before,
  .chanel-template-root .chanel-image-glow::after {
    display: none !important;
    content: none !important;
  }

  .chanel-template-root .chanel-soft-float {
    animation: none !important;
  }

  .chanel-template-root .chanel-magnetic {
    transform: none !important;
  }

  .chanel-template-root article:hover,
  .chanel-template-root form:hover,
  .chanel-template-root .chanel-card:hover,
  .chanel-template-root .chanel-service-card:hover,
  .chanel-template-root .chanel-team-card:hover,
  .chanel-template-root .chanel-blog-card:hover,
  .chanel-template-root .chanel-process-card:hover,
  .chanel-template-root .chanel-price-row:hover,
  .chanel-template-root a:hover,
  .chanel-template-root button:hover {
    transform: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .chanel-template-root *,
    .chanel-template-root *::before,
    .chanel-template-root *::after {
      animation: none !important;
      transition-duration: 0.01ms !important;
      transform: none !important;
      filter: none !important;
      opacity: 1 !important;
    }
  }
`;

function normalizePageInput(value: unknown): ChanelPageId {
  const raw = String(value ?? "home").trim();

  if (pageAliases[raw]) return pageAliases[raw];

  const clean = raw.replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();

  return pageAliases[clean] || "home";
}

function getChanelPage(pageId: ChanelPageId) {
  return (
    chanelEditorPages.find((item) => item.id === pageId) ||
    chanelEditorPages.find((item) => item.id === "home") ||
    chanelEditorPages[0]
  );
}

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function easeOutCubic(value: number) {
  const t = clamp(value);
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(value: number) {
  const t = clamp(value);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function setMotionProgress(element: HTMLElement, rawProgress: number) {
  const progress = easeOutCubic(rawProgress);

  const startX = Number(element.dataset.motionX || "0");
  const startY = Number(element.dataset.motionY || "100");
  const startScale = Number(element.dataset.motionScale || "0.94");
  const startBlur = Number(element.dataset.motionBlur || "16");

  element.style.setProperty("--chanel-motion-opacity", String(progress));
  element.style.setProperty("--chanel-motion-x", `${startX * (1 - progress)}px`);
  element.style.setProperty("--chanel-motion-y", `${startY * (1 - progress)}px`);
  element.style.setProperty(
    "--chanel-motion-scale",
    String(startScale + (1 - startScale) * progress),
  );
  element.style.setProperty("--chanel-motion-blur", `${startBlur * (1 - progress)}px`);
}

function ChanelEmptyState() {
  return (
    <section
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#fff8f3] px-6 text-[#241711]"
    >
      <div className="max-w-xl rounded-[32px] border border-[#241711]/10 bg-white p-8 text-center shadow-[0_24px_80px_rgba(36,23,17,.12)]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#7b5f52]">
          Chanel Spa
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-[-0.06em]">
          אין תוכן להצגה בעמוד הזה
        </h1>

        <p className="mt-4 text-sm font-semibold leading-7 text-[#241711]/60">
          העמוד קיים ברשימת הדפים, אבל ה־HTML שלו ריק בתוך chanelEditorPages.
          צריך לעדכן את chanelData.ts.
        </p>
      </div>
    </section>
  );
}

export default function ChanelPages({
  initialPage = "home",
  isStudioStatic = false,
}: Props = {}) {
  const safeInitialPage = React.useMemo(
    () => normalizePageInput(initialPage),
    [initialPage],
  );

  const [activePage, setActivePage] =
    React.useState<ChanelPageId>(safeInitialPage);

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setActivePage(safeInitialPage);
  }, [safeInitialPage]);

  const pageToRender = isStudioStatic ? safeInitialPage : activePage;
  const page = getChanelPage(pageToRender);

  React.useEffect(() => {
    const root = rootRef.current;
    const scrollShell = scrollRef.current;

    if (!root || !scrollShell) return;

    const links = root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

    function handleClick(event: MouseEvent) {
      const target = event.currentTarget as HTMLAnchorElement | null;
      const href = target?.getAttribute("href") || "";
      const id = href.replace("#", "").trim();

      if (!id) return;

      const samePageTarget = root.querySelector<HTMLElement>(`#${id}`);

      if (samePageTarget) {
        event.preventDefault();

        const shellRect = scrollShell.getBoundingClientRect();
        const targetRect = samePageTarget.getBoundingClientRect();
        const nextTop = scrollShell.scrollTop + targetRect.top - shellRect.top;

        scrollShell.scrollTo({
          top: Math.max(0, nextTop),
          behavior: "smooth",
        });

        return;
      }

      if (isStudioStatic) return;

      event.preventDefault();
      setActivePage(normalizePageInput(href));
      scrollShell.scrollTo({ top: 0, behavior: "smooth" });
    }

    links.forEach((link) => link.addEventListener("click", handleClick));

    return () => {
      links.forEach((link) => link.removeEventListener("click", handleClick));
    };
  }, [pageToRender, isStudioStatic]);

  React.useEffect(() => {
    const root = rootRef.current;
    const scrollShell = scrollRef.current;

    if (!root || !scrollShell || typeof window === "undefined") return;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const motionSelectors = [
      "[data-motion='fade-up']",
      "[data-motion='fade-right']",
      "[data-motion='fade-left']",
      "[data-motion='stagger-row']",
      "[data-motion='process-card']",
      "[data-motion='process-image']",
      "[data-motion='service-card']",
      "[data-motion='team-card']",
      "[data-motion='price-row']",
      "[data-motion='faq-row']",
      "[data-motion='blog-card']",
      ".chanel-home-intro-title",
      ".chanel-home-intro-card",
      ".chanel-home-logo-row span",
      ".chanel-home-section-title",
      ".chanel-home-price-row",
      ".chanel-home-testimonial-card",
      ".chanel-home-booking-grid > div",
      ".chanel-home-form",
      ".chanel-home-footer-main > div",
      ".chanel-home-footer-image",
      ".chanel-home-simple-page > div",
    ].join(",");

    const motionTargets = Array.from(
      new Set(Array.from(root.querySelectorAll<HTMLElement>(motionSelectors))),
    );

    motionTargets.forEach((element, index) => {
      element.classList.add("chanel-motion-item");

      const explicitMotion = element.getAttribute("data-motion");

      if (explicitMotion === "fade-right") {
        element.dataset.motionX = "120";
        element.dataset.motionY = "34";
      } else if (explicitMotion === "fade-left") {
        element.dataset.motionX = "-120";
        element.dataset.motionY = "34";
      } else if (explicitMotion === "process-image") {
        element.dataset.motionX = index % 2 === 0 ? "120" : "-120";
        element.dataset.motionY = "88";
      } else if (explicitMotion === "service-card") {
        element.dataset.motionX = index % 2 === 0 ? "92" : "-92";
        element.dataset.motionY = "70";
      } else if (explicitMotion === "price-row") {
        element.dataset.motionX = "0";
        element.dataset.motionY = "76";
      } else if (explicitMotion === "team-card") {
        element.dataset.motionX = index % 2 === 0 ? "86" : "-86";
        element.dataset.motionY = "64";
      } else {
        const direction = index % 5;

        if (direction === 0) {
          element.dataset.motionX = "0";
          element.dataset.motionY = "125";
        } else if (direction === 1) {
          element.dataset.motionX = "-120";
          element.dataset.motionY = "58";
        } else if (direction === 2) {
          element.dataset.motionX = "120";
          element.dataset.motionY = "58";
        } else if (direction === 3) {
          element.dataset.motionX = "0";
          element.dataset.motionY = "160";
        } else {
          element.dataset.motionX = "0";
          element.dataset.motionY = "90";
        }
      }

      element.dataset.motionScale = "0.93";
      element.dataset.motionBlur = "18";

      setMotionProgress(element, reduceMotion ? 1 : 0);
    });

    const heroImage = root.querySelector<HTMLImageElement>(
      ".chanel-home-hero-bg img",
    );

    const hero = root.querySelector<HTMLElement>(".chanel-home-hero");
    const heroContent = root.querySelector<HTMLElement>(
      ".chanel-home-hero-content",
    );
    const heroEyebrow = root.querySelector<HTMLElement>(".chanel-home-eyebrow");
    const heroTitle = root.querySelector<HTMLElement>(".chanel-home-hero h1");
    const heroText = root.querySelector<HTMLElement>(
      ".chanel-home-hero-content > p:not(.chanel-home-eyebrow)",
    );
    const heroActions = root.querySelector<HTMLElement>(
      ".chanel-home-hero-actions",
    );

    const marqueeTargets = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".chanel-home-testimonials-track, .chanel-home-footer-ticker",
      ),
    );

    const imageTargets = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".chanel-home-intro-image img, .chanel-home-process-image img, .chanel-home-service-image img, .chanel-home-team-card img, .chanel-home-faq-visual img, .chanel-home-blog-card img",
      ),
    );

    heroImage?.classList.add("chanel-motion-hero-image");
    marqueeTargets.forEach((item) => item.classList.add("chanel-motion-marquee"));
    imageTargets.forEach((item) => item.classList.add("chanel-motion-image"));

    let frame = 0;

    function updateMotion() {
      if (reduceMotion) return;

      cancelAnimationFrame(frame);

      frame = window.requestAnimationFrame(() => {
        const shellRect = scrollShell.getBoundingClientRect();
        const viewportHeight = scrollShell.clientHeight || shellRect.height || 900;
        const scrollTop = scrollShell.scrollTop;

        motionTargets.forEach((element) => {
          const rect = element.getBoundingClientRect();
          const relativeTop = rect.top - shellRect.top;

          const start = viewportHeight * 1.08;
          const end = viewportHeight * 0.23;
          const progress = (start - relativeTop) / (start - end);

          setMotionProgress(element, progress);
        });

        imageTargets.forEach((image) => {
          const rect = image.getBoundingClientRect();
          const center = rect.top - shellRect.top + rect.height / 2;
          const distance = (center - viewportHeight / 2) / viewportHeight;
          const y = clamp(distance, -1, 1) * -38;

          image.style.setProperty("--chanel-image-y", `${y}px`);
          image.style.setProperty("--chanel-image-x", "0px");
          image.style.setProperty("--chanel-image-scale", "1.055");
        });

        marqueeTargets.forEach((track, index) => {
          const speed = index === 0 ? -0.22 : 0.16;
          track.style.setProperty("--chanel-marquee-x", `${scrollTop * speed}px`);
        });

        if (hero && heroImage) {
          const heroRect = hero.getBoundingClientRect();
          const heroTop = heroRect.top - shellRect.top;
          const heroProgress = clamp(
            Math.abs(heroTop) / Math.max(1, viewportHeight),
            0,
            1,
          );

          const easedHero = easeInOutCubic(heroProgress);

          heroImage.style.setProperty(
            "--chanel-hero-image-y",
            `${easedHero * 78}px`,
          );

          heroImage.style.setProperty(
            "--chanel-hero-image-scale",
            String(1.05 + easedHero * 0.055),
          );
        }

        if (hero && heroContent) {
          const heroRect = hero.getBoundingClientRect();
          const heroTop = heroRect.top - shellRect.top;

          const leaveProgress = clamp(
            Math.abs(heroTop) / Math.max(1, viewportHeight * 0.62),
            0,
            1,
          );

          const easedLeave = easeInOutCubic(leaveProgress);

          heroContent.style.setProperty(
            "--chanel-hero-content-opacity",
            String(1 - easedLeave * 0.65),
          );

          heroContent.style.setProperty(
            "--chanel-hero-content-y",
            `${easedLeave * 58}px`,
          );

          heroContent.style.setProperty(
            "--chanel-hero-content-blur",
            `${easedLeave * 8}px`,
          );

          if (heroEyebrow) {
            heroEyebrow.style.transform = `translateY(${-18 * easedLeave}px)`;
            heroEyebrow.style.opacity = String(1 - easedLeave * 0.35);
          }

          if (heroTitle) {
            heroTitle.style.transform = `translateY(${28 * easedLeave}px)`;
          }

          if (heroText) {
            heroText.style.transform = `translateY(${42 * easedLeave}px)`;
            heroText.style.opacity = String(1 - easedLeave * 0.45);
          }

          if (heroActions) {
            heroActions.style.transform = `translateY(${58 * easedLeave}px)`;
            heroActions.style.opacity = String(1 - easedLeave * 0.55);
          }
        }
      });
    }

    scrollShell.addEventListener("scroll", updateMotion, { passive: true });
    window.addEventListener("resize", updateMotion);

    updateMotion();

    return () => {
      scrollShell.removeEventListener("scroll", updateMotion);
      window.removeEventListener("resize", updateMotion);
      cancelAnimationFrame(frame);
    };
  }, [pageToRender]);

  const html = typeof page?.html === "string" ? page.html.trim() : "";

  return (
    <main dir="rtl" data-template-id="chanel" className="chanel-page-shell">
      <style>{chanelEditorCss}</style>
      <style>{chanelRuntimeCss}</style>

      <div ref={scrollRef} className="chanel-scroll-shell">
        {html ? (
          <div
            ref={rootRef}
            className="chanel-template-root"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <ChanelEmptyState />
        )}
      </div>
    </main>
  );
}
