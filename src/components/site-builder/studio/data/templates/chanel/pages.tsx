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

const chanelScrollMotionCss = `
  .chanel-template-root {
    position: relative;
    min-height: 100vh;
    overflow-x: hidden;
    overflow-y: visible;
    scroll-behavior: smooth;
    isolation: isolate;
  }

  .chanel-template-root * {
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }

  /*
    אפקט כמו בסרטון:
    כל אלמנט נכנס תוך כדי גלילה.
    לא hover, לא magnetic, לא shine.
  */

  .chanel-template-root .chanel-scroll-motion {
    opacity: var(--chanel-opacity, 0);
    transform:
      translate3d(
        var(--chanel-x, 0px),
        var(--chanel-y, 72px),
        0
      )
      scale(var(--chanel-scale, .96));
    filter: blur(var(--chanel-blur, 12px));
    will-change: opacity, transform, filter;
  }

  .chanel-template-root .chanel-motion-left {
    --chanel-start-x: -74px;
  }

  .chanel-template-root .chanel-motion-right {
    --chanel-start-x: 74px;
  }

  .chanel-template-root .chanel-motion-up {
    --chanel-start-x: 0px;
  }

  .chanel-template-root .chanel-motion-soft {
    --chanel-softness: 0.72;
  }

  .chanel-template-root .chanel-hero-parallax {
    transform: translate3d(0, var(--chanel-hero-y, 0px), 0) scale(var(--chanel-hero-scale, 1.04));
    will-change: transform;
  }

  .chanel-template-root .chanel-home-hero-content {
    opacity: 1;
    transform: none;
    filter: none;
  }

  /*
    ביטול כל ההמצאות הישנות.
  */
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
  .chanel-template-root .chanel-price-row:hover {
    transform: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .chanel-template-root *,
    .chanel-template-root *::before,
    .chanel-template-root *::after {
      animation: none !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
      transform: none !important;
      filter: none !important;
      opacity: 1 !important;
    }
  }
`;

function normalizePageInput(value: unknown): ChanelPageId {
  const raw = String(value ?? "home").trim();

  if (pageAliases[raw]) return pageAliases[raw];

  const clean = raw
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .toLowerCase();

  return pageAliases[clean] || "home";
}

function getChanelPage(pageId: ChanelPageId) {
  return (
    chanelEditorPages.find((item) => item.id === pageId) ||
    chanelEditorPages.find((item) => item.id === "home") ||
    chanelEditorPages[0]
  );
}

function getScrollParent(element: HTMLElement | null): HTMLElement | Window {
  if (!element) return window;

  let parent = element.parentElement;

  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;

    if (
      overflowY === "auto" ||
      overflowY === "scroll" ||
      overflowY === "overlay"
    ) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return window;
}

function getScrollInfo(scrollParent: HTMLElement | Window) {
  if (scrollParent === window) {
    return {
      scrollTop: window.scrollY || window.pageYOffset || 0,
      viewportHeight: window.innerHeight || 900,
      rootTop: 0,
    };
  }

  const element = scrollParent as HTMLElement;
  const rect = element.getBoundingClientRect();

  return {
    scrollTop: element.scrollTop,
    viewportHeight: element.clientHeight || 900,
    rootTop: rect.top,
  };
}

function setMotionProgress(element: HTMLElement, progress: number) {
  const clamped = Math.max(0, Math.min(1, progress));
  const eased = 1 - Math.pow(1 - clamped, 3);

  const startX = Number(element.dataset.motionX || "0");
  const startY = Number(element.dataset.motionY || "72");
  const startScale = Number(element.dataset.motionScale || "0.96");
  const startBlur = Number(element.dataset.motionBlur || "12");

  const currentX = startX * (1 - eased);
  const currentY = startY * (1 - eased);
  const currentScale = startScale + (1 - startScale) * eased;
  const currentBlur = startBlur * (1 - eased);

  element.style.setProperty("--chanel-opacity", String(eased));
  element.style.setProperty("--chanel-x", `${currentX}px`);
  element.style.setProperty("--chanel-y", `${currentY}px`);
  element.style.setProperty("--chanel-scale", String(currentScale));
  element.style.setProperty("--chanel-blur", `${currentBlur}px`);
}

function ChanelEmptyState() {
  return (
    <section
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#fff7f2] px-6 text-[#2b1b15]"
    >
      <div className="max-w-xl rounded-[32px] border border-[#2b1b15]/10 bg-white p-8 text-center shadow-[0_24px_80px_rgba(43,27,21,.12)]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#7b5f52]">
          Chanel Spa
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-[-0.06em]">
          אין תוכן להצגה בעמוד הזה
        </h1>

        <p className="mt-4 text-sm font-semibold leading-7 text-[#2b1b15]/60">
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

  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setActivePage(safeInitialPage);
  }, [safeInitialPage]);

  const pageToRender = isStudioStatic ? safeInitialPage : activePage;
  const page = getChanelPage(pageToRender);

  React.useEffect(() => {
    if (isStudioStatic) return;

    const root = rootRef.current;
    if (!root) return;

    const links = root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

    function handleClick(event: MouseEvent) {
      const target = event.currentTarget as HTMLAnchorElement | null;
      const href = target?.getAttribute("href") || "";

      const id = href.replace("#", "").trim();
      const samePageTarget = id ? root.querySelector<HTMLElement>(`#${id}`) : null;

      if (samePageTarget) {
        event.preventDefault();
        samePageTarget.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }

      const nextPage = normalizePageInput(href);

      if (!nextPage) return;

      event.preventDefault();
      setActivePage(nextPage);
    }

    links.forEach((link) => link.addEventListener("click", handleClick));

    return () => {
      links.forEach((link) => link.removeEventListener("click", handleClick));
    };
  }, [pageToRender, isStudioStatic]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const motionTargets = Array.from(
      root.querySelectorAll<HTMLElement>(
        [
          ".chanel-home-intro-title",
          ".chanel-home-intro-card",
          ".chanel-home-logo-row",
          ".chanel-home-section-title",
          ".chanel-home-process-card",
          ".chanel-home-process-image",
          ".chanel-home-services-head",
          ".chanel-home-service-card",
          ".chanel-home-team-card",
          ".chanel-home-pricing-grid > div",
          ".chanel-home-price-row",
          ".chanel-home-testimonials-row article",
          ".chanel-home-booking-grid > div",
          ".chanel-home-form",
          ".chanel-home-footer-main > div",
          ".chanel-home-footer-image",
          ".chanel-home-simple-page > div",
        ].join(","),
      ),
    );

    motionTargets.forEach((element, index) => {
      element.classList.add("chanel-scroll-motion");

      const direction = index % 3;

      if (direction === 0) {
        element.dataset.motionX = "0";
        element.dataset.motionY = "82";
      }

      if (direction === 1) {
        element.dataset.motionX = "-74";
        element.dataset.motionY = "44";
      }

      if (direction === 2) {
        element.dataset.motionX = "74";
        element.dataset.motionY = "44";
      }

      element.dataset.motionScale = "0.965";
      element.dataset.motionBlur = "12";

      if (reduceMotion) {
        setMotionProgress(element, 1);
      } else {
        setMotionProgress(element, 0);
      }
    });

    const heroImages = Array.from(
      root.querySelectorAll<HTMLImageElement>(".chanel-home-hero-bg img"),
    );

    heroImages.forEach((image) => {
      image.classList.add("chanel-hero-parallax");
    });

    const scrollParent = getScrollParent(root);

    let animationFrame = 0;

    function updateMotion() {
      if (reduceMotion) return;

      cancelAnimationFrame(animationFrame);

      animationFrame = window.requestAnimationFrame(() => {
        const { viewportHeight } = getScrollInfo(scrollParent);

        motionTargets.forEach((element) => {
          const rect = element.getBoundingClientRect();

          const start = viewportHeight * 0.94;
          const end = viewportHeight * 0.28;
          const progress = (start - rect.top) / (start - end);

          setMotionProgress(element, progress);
        });

        const heroRect = root
          .querySelector<HTMLElement>(".chanel-home-hero")
          ?.getBoundingClientRect();

        const heroProgress = heroRect
          ? Math.max(-1, Math.min(1, heroRect.top / viewportHeight))
          : 0;

        const heroY = heroProgress * 42;
        const heroScale = 1.04 + Math.abs(heroProgress) * 0.025;

        heroImages.forEach((image) => {
          image.style.setProperty("--chanel-hero-y", `${heroY}px`);
          image.style.setProperty("--chanel-hero-scale", String(heroScale));
        });
      });
    }

    const targetToListen =
      scrollParent === window ? window : (scrollParent as HTMLElement);

    targetToListen.addEventListener("scroll", updateMotion, { passive: true });
    window.addEventListener("resize", updateMotion);

    updateMotion();

    return () => {
      targetToListen.removeEventListener("scroll", updateMotion);
      window.removeEventListener("resize", updateMotion);
      cancelAnimationFrame(animationFrame);
    };
  }, [pageToRender]);

  const html = typeof page?.html === "string" ? page.html.trim() : "";

  return (
    <main
      dir="rtl"
      data-template-id="chanel"
      className="min-h-screen bg-[#fff7f2] text-[#2b1b15]"
      style={{
        overflowX: "hidden",
        overflowY: "visible",
      }}
    >
      <style>{chanelEditorCss}</style>
      <style>{chanelScrollMotionCss}</style>

      {html ? (
        <div
          ref={rootRef}
          className="chanel-template-root min-h-screen"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <ChanelEmptyState />
      )}
    </main>
  );
}