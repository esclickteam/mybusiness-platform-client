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
  .chanel-page-shell {
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    overflow: hidden;
    background: #fff;
    color: #2a1b16;
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
    background: #fff;
  }

  .chanel-template-root {
    position: relative;
    min-height: 100%;
    overflow-x: hidden;
    overflow-y: visible;
    isolation: isolate;
  }

  .chanel-template-root .chanel-motion {
    opacity: var(--motion-opacity, 0);
    transform:
      translate3d(var(--motion-x, 0px), var(--motion-y, 86px), 0)
      scale(var(--motion-scale, .965));
    filter: blur(var(--motion-blur, 12px));
    will-change: opacity, transform, filter;
    transition: none !important;
  }

  .chanel-template-root .chanel-motion-image {
    transform:
      translate3d(0, var(--image-y, 0px), 0)
      scale(var(--image-scale, 1.04));
    will-change: transform;
    transition: none !important;
  }

  .chanel-template-root .chanel-ticker-track,
  .chanel-template-root .chanel-footer-strip {
    will-change: transform;
  }

  .chanel-template-root a:hover,
  .chanel-template-root button:hover,
  .chanel-template-root article:hover,
  .chanel-template-root form:hover,
  .chanel-template-root img:hover {
    transform: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .chanel-template-root *,
    .chanel-template-root *::before,
    .chanel-template-root *::after {
      animation: none !important;
      transition-duration: .01ms !important;
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

function easeOutQuint(value: number) {
  const t = clamp(value);
  return 1 - Math.pow(1 - t, 5);
}

function setMotion(element: HTMLElement, rawProgress: number) {
  const progress = easeOutQuint(rawProgress);
  const startX = Number(element.dataset.motionX || "0");
  const startY = Number(element.dataset.motionY || "92");
  const startScale = Number(element.dataset.motionScale || "0.965");
  const startBlur = Number(element.dataset.motionBlur || "12");

  element.style.setProperty("--motion-opacity", String(progress));
  element.style.setProperty("--motion-x", `${startX * (1 - progress)}px`);
  element.style.setProperty("--motion-y", `${startY * (1 - progress)}px`);
  element.style.setProperty(
    "--motion-scale",
    String(startScale + (1 - startScale) * progress),
  );
  element.style.setProperty("--motion-blur", `${startBlur * (1 - progress)}px`);
}

function ChanelEmptyState() {
  return (
    <section
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-white px-6 text-[#2a1b16]"
    >
      <div className="max-w-xl rounded-[28px] border border-[#2a1b16]/10 bg-white p-8 text-center shadow-[0_24px_80px_rgba(42,27,22,.12)]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c95268]">
          Chanel Spa
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.06em]">
          אין תוכן להצגה בעמוד הזה
        </h1>
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
  const motionValuesRef = React.useRef(new Map<HTMLElement, number>());

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

      if (id) {
        const samePageTarget = root.querySelector<HTMLElement>(`#${id}`);
        if (samePageTarget) {
          event.preventDefault();
          const shellRect = scrollShell.getBoundingClientRect();
          const targetRect = samePageTarget.getBoundingClientRect();
          const top = scrollShell.scrollTop + targetRect.top - shellRect.top;
          scrollShell.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
          return;
        }
      }

      if (isStudioStatic) return;

      event.preventDefault();
      setActivePage(normalizePageInput(href));
      scrollShell.scrollTo({ top: 0, behavior: "smooth" });
    }

    links.forEach((link) => link.addEventListener("click", handleClick));
    return () => links.forEach((link) => link.removeEventListener("click", handleClick));
  }, [pageToRender, isStudioStatic]);

  React.useEffect(() => {
    const root = rootRef.current;
    const scrollShell = scrollRef.current;
    if (!root || !scrollShell || typeof window === "undefined") return;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const selectors = [
      ".chanel-about-badge",
      ".chanel-about-copy",
      ".chanel-red-button",
      ".chanel-about-image",
      ".chanel-about-stats",
      ".chanel-partners-row span",
      ".chanel-section-heading",
      ".chanel-process-card",
      ".chanel-therapy-card",
      ".chanel-team-card",
      ".chanel-price-row",
      ".chanel-testimonial-card",
      ".chanel-faq-media",
      ".chanel-faq-item",
      ".chanel-contact-form",
      ".chanel-contact-image",
      ".chanel-blog-card",
      ".chanel-footer-newsletter",
      ".chanel-footer-cols > div",
      ".chanel-footer-word",
      ".chanel-simple-page > div",
    ].join(",");

    const targets = Array.from(root.querySelectorAll<HTMLElement>(selectors));
    const values = motionValuesRef.current;
    values.clear();

    targets.forEach((element, index) => {
      element.classList.add("chanel-motion");

      const direction = index % 6;
      if (direction === 0) {
        element.dataset.motionX = "0";
        element.dataset.motionY = "120";
      } else if (direction === 1) {
        element.dataset.motionX = "-120";
        element.dataset.motionY = "42";
      } else if (direction === 2) {
        element.dataset.motionX = "120";
        element.dataset.motionY = "42";
      } else if (direction === 3) {
        element.dataset.motionX = "0";
        element.dataset.motionY = "150";
      } else if (direction === 4) {
        element.dataset.motionX = "-72";
        element.dataset.motionY = "84";
      } else {
        element.dataset.motionX = "72";
        element.dataset.motionY = "84";
      }

      element.dataset.motionScale = "0.95";
      element.dataset.motionBlur = "15";
      values.set(element, reduceMotion ? 1 : 0);
      setMotion(element, reduceMotion ? 1 : 0);
    });

    const images = Array.from(
      root.querySelectorAll<HTMLImageElement>(
        ".chanel-hero-bg img, .chanel-about-image img, .chanel-process-image img, .chanel-therapy-image img, .chanel-contact-image img",
      ),
    );

    images.forEach((image) => image.classList.add("chanel-motion-image"));

    let frame = 0;

    function update() {
      if (reduceMotion) return;

      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const shellRect = scrollShell.getBoundingClientRect();
        const viewportHeight = scrollShell.clientHeight || shellRect.height || 900;

        targets.forEach((element) => {
          const rect = element.getBoundingClientRect();
          const top = rect.top - shellRect.top;
          const start = viewportHeight * 1.08;
          const end = viewportHeight * 0.22;
          const target = clamp((start - top) / (start - end));
          const current = values.get(element) ?? 0;

          // Lerp gives the slower, soft Webflow-like entry instead of a robotic pop.
          const next = current + (target - current) * 0.105;
          values.set(element, next);
          setMotion(element, next);
        });

        images.forEach((image) => {
          const rect = image.getBoundingClientRect();
          const center = rect.top - shellRect.top + rect.height / 2;
          const offset = (center - viewportHeight / 2) / viewportHeight;
          const y = clamp(offset, -1, 1) * -42;
          const scale = 1.04 + Math.abs(clamp(offset, -1, 1)) * 0.03;
          image.style.setProperty("--image-y", `${y}px`);
          image.style.setProperty("--image-scale", String(scale));
        });

        frame = window.requestAnimationFrame(update);
      });
    }

    scrollShell.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      scrollShell.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
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
