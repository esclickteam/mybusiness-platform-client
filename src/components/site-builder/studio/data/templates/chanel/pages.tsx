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

type MotionState = {
  element: HTMLElement;
  current: number;
  target: number;
  x: number;
  y: number;
  scale: number;
  blur: number;
  rotate: number;
  clip: number;
  mode: "up" | "left" | "right" | "zoom" | "mask";
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

  .chanel-template-root .chanel-scroll-motion-item {
    opacity: var(--chanel-opacity, 0);
    transform:
      translate3d(var(--chanel-x, 0px), var(--chanel-y, 160px), 0)
      scale(var(--chanel-scale, 0.92))
      rotate(var(--chanel-rotate, 0deg));
    filter: blur(var(--chanel-blur, 20px));
    clip-path: inset(var(--chanel-clip-top, 0%) 0% var(--chanel-clip-bottom, 16%) 0%);
    will-change: opacity, transform, filter, clip-path;
    transition: none !important;
  }

  .chanel-template-root .chanel-motion-image img,
  .chanel-template-root .chanel-hero-visual img {
    transform: translate3d(0, var(--chanel-image-y, 0px), 0) scale(var(--chanel-image-scale, 1.08));
    will-change: transform;
    transition: none !important;
  }

  .chanel-template-root .chanel-hero-inner,
  .chanel-template-root .chanel-hero-left,
  .chanel-template-root .chanel-hero-stats {
    transition: none !important;
    will-change: opacity, transform, filter;
  }

  .chanel-template-root .chanel-testimonials-track,
  .chanel-template-root .chanel-footer-strip {
    transform: translate3d(var(--chanel-track-x, 0px), 0, 0);
    will-change: transform;
    transition: none !important;
  }

  .chanel-template-root .chanel-shine::before,
  .chanel-template-root .chanel-image-glow::after {
    display: none !important;
    content: none !important;
  }

  .chanel-template-root .chanel-soft-float,
  .chanel-template-root .chanel-magnetic {
    animation: none !important;
  }

  .chanel-template-root *:hover {
    animation: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .chanel-template-root *,
    .chanel-template-root *::before,
    .chanel-template-root *::after {
      animation: none !important;
      transition-duration: 0.01ms !important;
      transform: none !important;
      filter: none !important;
      clip-path: none !important;
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

function easeOutQuart(value: number) {
  const t = clamp(value);
  return 1 - Math.pow(1 - t, 4);
}

function easeInOutCubic(value: number) {
  const t = clamp(value);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function buildMotionState(element: HTMLElement, index: number): MotionState {
  const modes: MotionState["mode"][] = ["up", "left", "right", "mask", "zoom"];
  const mode = modes[index % modes.length];

  const values = {
    up: { x: 0, y: 170, scale: 0.94, blur: 20, rotate: 0, clip: 18 },
    left: { x: -160, y: 90, scale: 0.95, blur: 18, rotate: -1.6, clip: 12 },
    right: { x: 160, y: 90, scale: 0.95, blur: 18, rotate: 1.6, clip: 12 },
    zoom: { x: 0, y: 80, scale: 0.88, blur: 20, rotate: 0, clip: 18 },
    mask: { x: 0, y: 120, scale: 1, blur: 10, rotate: 0, clip: 42 },
  }[mode];

  return {
    element,
    current: 0,
    target: 0,
    mode,
    ...values,
  };
}

function renderMotion(state: MotionState) {
  const p = easeOutQuart(state.current);
  const inv = 1 - p;

  state.element.style.setProperty("--chanel-opacity", String(p));
  state.element.style.setProperty("--chanel-x", `${state.x * inv}px`);
  state.element.style.setProperty("--chanel-y", `${state.y * inv}px`);
  state.element.style.setProperty("--chanel-scale", String(state.scale + (1 - state.scale) * p));
  state.element.style.setProperty("--chanel-blur", `${state.blur * inv}px`);
  state.element.style.setProperty("--chanel-rotate", `${state.rotate * inv}deg`);
  state.element.style.setProperty("--chanel-clip-bottom", `${state.clip * inv}%`);
  state.element.style.setProperty("--chanel-clip-top", `${Math.max(0, state.clip * 0.24 * inv)}%`);
}

function ChanelEmptyState() {
  return (
    <section
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#fff8f3] px-6 text-[#241711]"
    >
      <div className="max-w-xl rounded-[32px] border border-[#241711]/10 bg-white p-8 text-center shadow-[0_24px_80px_rgba(36,23,17,.12)]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#756157]">
          Chanel Spa
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.06em]">
          אין תוכן להצגה בעמוד הזה
        </h1>
        <p className="mt-4 text-sm font-semibold leading-7 text-[#241711]/60">
          העמוד קיים ברשימת הדפים, אבל ה־HTML שלו ריק בתוך chanelEditorPages.
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
        scrollShell.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
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

    const selector = [
      ".chanel-hero-left",
      ".chanel-hero-visual",
      ".chanel-hero-stats > div",
      ".chanel-partners-row span",
      ".chanel-section-center",
      ".chanel-journey-card",
      ".chanel-dark-title",
      ".chanel-service-row",
      ".chanel-team-card",
      ".chanel-price-row",
      ".chanel-testimonials-track article",
      ".chanel-faq-image-stack img",
      ".chanel-faq-grid > div:last-child",
      ".chanel-faq-row",
      ".chanel-contact-image",
      ".chanel-contact-form",
      ".chanel-blog-card",
      ".chanel-footer-main > div",
      ".chanel-footer-brand",
      ".chanel-simple-page > div",
    ].join(",");

    const states = Array.from(root.querySelectorAll<HTMLElement>(selector)).map(
      (element, index) => {
        element.classList.add("chanel-scroll-motion-item");
        const imageParent = element.querySelector("img") ? element : null;
        imageParent?.classList.add("chanel-motion-image");
        const state = buildMotionState(element, index);
        if (reduceMotion) state.current = state.target = 1;
        renderMotion(state);
        return state;
      },
    );

    const heroImage = root.querySelector<HTMLImageElement>(".chanel-hero-visual img");
    const heroLeft = root.querySelector<HTMLElement>(".chanel-hero-left");
    const heroStats = root.querySelector<HTMLElement>(".chanel-hero-stats");
    const testimonialsTrack = root.querySelector<HTMLElement>(".chanel-testimonials-track");
    const footerStrip = root.querySelector<HTMLElement>(".chanel-footer-strip");

    let frame = 0;
    let running = false;

    function computeTargets() {
      const shellRect = scrollShell.getBoundingClientRect();
      const viewportHeight = scrollShell.clientHeight || shellRect.height || 900;

      states.forEach((state) => {
        const rect = state.element.getBoundingClientRect();
        const relativeTop = rect.top - shellRect.top;
        const start = viewportHeight * 1.12;
        const end = viewportHeight * 0.22;
        state.target = clamp((start - relativeTop) / (start - end));
      });

      const heroSection = root.querySelector<HTMLElement>(".chanel-hero-section");
      const heroRect = heroSection?.getBoundingClientRect();
      if (heroRect) {
        const heroTop = heroRect.top - shellRect.top;
        const heroProgress = clamp(Math.abs(heroTop) / Math.max(1, viewportHeight * 0.72));
        const eased = easeInOutCubic(heroProgress);

        if (heroImage) {
          heroImage.style.setProperty("--chanel-image-y", `${eased * 68}px`);
          heroImage.style.setProperty("--chanel-image-scale", String(1.08 + eased * 0.045));
        }

        if (heroLeft) {
          heroLeft.style.opacity = String(1 - eased * 0.55);
          heroLeft.style.transform = `translate3d(0, ${eased * 46}px, 0)`;
          heroLeft.style.filter = `blur(${eased * 7}px)`;
        }

        if (heroStats) {
          heroStats.style.opacity = String(1 - eased * 0.45);
          heroStats.style.transform = `translate3d(0, ${eased * 34}px, 0)`;
        }
      }

      const maxScroll = Math.max(1, scrollShell.scrollHeight - scrollShell.clientHeight);
      const globalProgress = scrollShell.scrollTop / maxScroll;

      if (testimonialsTrack) {
        testimonialsTrack.style.setProperty("--chanel-track-x", `${globalProgress * -420}px`);
      }

      if (footerStrip) {
        footerStrip.style.setProperty("--chanel-track-x", `${globalProgress * -280}px`);
      }
    }

    function animate() {
      running = true;
      let shouldContinue = false;

      states.forEach((state) => {
        const delta = state.target - state.current;
        if (Math.abs(delta) > 0.002) {
          shouldContinue = true;
          state.current += delta * 0.075;
        } else {
          state.current = state.target;
        }
        renderMotion(state);
      });

      if (shouldContinue) {
        frame = window.requestAnimationFrame(animate);
      } else {
        running = false;
      }
    }

    function requestUpdate() {
      if (reduceMotion) return;
      computeTargets();
      if (!running) {
        cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(animate);
      }
    }

    computeTargets();
    if (!reduceMotion) requestUpdate();

    scrollShell.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      scrollShell.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
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
