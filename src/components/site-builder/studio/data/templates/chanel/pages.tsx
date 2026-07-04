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
  { id: "home", label: "Home", slug: "/" },
  { id: "about", label: "About", slug: "/about" },
  { id: "services", label: "Services", slug: "/services" },
  { id: "gallery", label: "Gallery", slug: "/gallery" },
  { id: "prices", label: "Pricing", slug: "/prices" },
  { id: "booking", label: "Booking", slug: "/booking" },
  { id: "contact", label: "Contact", slug: "/contact" },
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

  about: "about",
  "#about": "about",

  services: "services",
  "#services": "services",

  gallery: "gallery",
  "#gallery": "gallery",

  prices: "prices",
  "#prices": "prices",
  pricing: "prices",
  "#pricing": "prices",

  booking: "booking",
  "#booking": "booking",
  appointment: "booking",
  appointments: "booking",

  contact: "contact",
  "#contact": "contact",
};

const chanelInspiredEffectsCss = `
  .chanel-template-root {
    scroll-behavior: smooth;
    isolation: isolate;
  }

  .chanel-template-root * {
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }

  .chanel-template-root [data-section-kind] {
    position: relative;
  }

  .chanel-template-root .chanel-auto-reveal {
    opacity: 0;
    transform: translateY(34px) scale(0.985);
    filter: blur(10px);
    transition:
      opacity 900ms cubic-bezier(.16,1,.3,1),
      transform 900ms cubic-bezier(.16,1,.3,1),
      filter 900ms cubic-bezier(.16,1,.3,1);
    will-change: opacity, transform, filter;
  }

  .chanel-template-root .chanel-auto-reveal.chanel-is-visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }

  .chanel-template-root .chanel-auto-reveal:nth-child(2n) {
    transition-delay: 90ms;
  }

  .chanel-template-root .chanel-auto-reveal:nth-child(3n) {
    transition-delay: 150ms;
  }

  .chanel-template-root .chanel-auto-reveal:nth-child(4n) {
    transition-delay: 210ms;
  }

  .chanel-template-root .chanel-glass {
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow: 0 18px 55px rgba(43, 27, 21, .08);
  }

  .chanel-template-root .chanel-soft-float {
    animation: chanelSoftFloat 7s ease-in-out infinite;
    will-change: transform;
  }

  .chanel-template-root .chanel-soft-float:nth-child(2n) {
    animation-duration: 8.5s;
    animation-delay: -1.8s;
  }

  .chanel-template-root .chanel-soft-float:nth-child(3n) {
    animation-duration: 9.5s;
    animation-delay: -3s;
  }

  @keyframes chanelSoftFloat {
    0%, 100% {
      transform: translate3d(0, 0, 0) rotate(0deg);
    }
    50% {
      transform: translate3d(0, -14px, 0) rotate(.6deg);
    }
  }

  .chanel-template-root .chanel-image-glow {
    position: relative;
  }

  .chanel-template-root .chanel-image-glow::after {
    content: "";
    position: absolute;
    inset: auto 12% -18px 12%;
    height: 42px;
    border-radius: 999px;
    background: rgba(200, 151, 122, .22);
    filter: blur(22px);
    pointer-events: none;
    opacity: .75;
    transition: opacity 450ms ease, transform 450ms ease;
  }

  .chanel-template-root .chanel-card,
  .chanel-template-root [data-section-kind="service-card"],
  .chanel-template-root [data-section-kind="gallery-image"],
  .chanel-template-root [data-section-kind="testimonials"] article,
  .chanel-template-root [data-section-kind="prices"] .grid,
  .chanel-template-root form {
    transition:
      transform 550ms cubic-bezier(.16,1,.3,1),
      box-shadow 550ms cubic-bezier(.16,1,.3,1),
      border-color 550ms cubic-bezier(.16,1,.3,1),
      background-color 550ms cubic-bezier(.16,1,.3,1);
    will-change: transform;
  }

  .chanel-template-root .chanel-card:hover,
  .chanel-template-root [data-section-kind="service-card"]:hover,
  .chanel-template-root [data-section-kind="gallery-image"]:hover,
  .chanel-template-root [data-section-kind="testimonials"] article:hover,
  .chanel-template-root form:hover {
    transform: translateY(-10px);
    box-shadow: 0 32px 95px rgba(43, 27, 21, .15);
  }

  .chanel-template-root img {
    transition:
      transform 900ms cubic-bezier(.16,1,.3,1),
      filter 900ms cubic-bezier(.16,1,.3,1),
      opacity 900ms cubic-bezier(.16,1,.3,1);
    will-change: transform;
  }

  .chanel-template-root .chanel-image-hover:hover,
  .chanel-template-root [data-section-kind="gallery-image"]:hover img,
  .chanel-template-root [data-section-kind="service-card"]:hover img {
    transform: scale(1.07);
    filter: saturate(1.08) contrast(1.03);
  }

  .chanel-template-root .chanel-parallax-image {
    transform: translate3d(0, var(--chanel-parallax-y, 0px), 0) scale(1.035);
  }

  .chanel-template-root a[data-editable-link="true"],
  .chanel-template-root button {
    transition:
      transform 320ms cubic-bezier(.16,1,.3,1),
      box-shadow 320ms cubic-bezier(.16,1,.3,1),
      background-color 320ms cubic-bezier(.16,1,.3,1),
      color 320ms cubic-bezier(.16,1,.3,1);
  }

  .chanel-template-root a[data-editable-link="true"]:hover,
  .chanel-template-root button:hover {
    transform: translateY(-3px);
  }

  .chanel-template-root .chanel-magnetic {
    will-change: transform;
  }

  .chanel-template-root .chanel-marquee {
    overflow: hidden;
    white-space: nowrap;
  }

  .chanel-template-root .chanel-marquee-track {
    display: inline-flex;
    min-width: max-content;
    gap: 2rem;
    animation: chanelMarquee 22s linear infinite;
  }

  @keyframes chanelMarquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  .chanel-template-root .chanel-shine {
    position: relative;
    overflow: hidden;
  }

  .chanel-template-root .chanel-shine::before {
    content: "";
    position: absolute;
    inset: -80% auto -80% -40%;
    width: 32%;
    transform: rotate(18deg);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, .58),
      transparent
    );
    opacity: 0;
    transition: opacity 300ms ease;
    pointer-events: none;
  }

  .chanel-template-root .chanel-shine:hover::before {
    opacity: 1;
    animation: chanelShine 900ms cubic-bezier(.16,1,.3,1);
  }

  @keyframes chanelShine {
    from {
      left: -42%;
    }
    to {
      left: 120%;
    }
  }

  .chanel-template-root .chanel-sticky-nav {
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .chanel-template-root input,
  .chanel-template-root textarea,
  .chanel-template-root select {
    transition:
      border-color 250ms ease,
      box-shadow 250ms ease,
      background-color 250ms ease;
  }

  .chanel-template-root input:focus,
  .chanel-template-root textarea:focus,
  .chanel-template-root select:focus {
    border-color: rgba(200, 151, 122, .55) !important;
    box-shadow: 0 0 0 5px rgba(200, 151, 122, .22);
  }

  @media (prefers-reduced-motion: reduce) {
    .chanel-template-root *,
    .chanel-template-root *::before,
    .chanel-template-root *::after {
      animation: none !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

function normalizePageInput(value: unknown): ChanelPageId {
  const clean = String(value ?? "home")
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .toLowerCase();

  return pageAliases[clean] || pageAliases[String(value ?? "").trim()] || "home";
}

function getChanelPage(pageId: ChanelPageId) {
  return (
    chanelEditorPages.find((item) => item.id === pageId) ||
    chanelEditorPages.find((item) => item.id === "home") ||
    chanelEditorPages[0]
  );
}

function ChanelEmptyState() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#fbf4ee] px-6 text-[#2b1b15]">
      <div className="max-w-xl rounded-[32px] border border-[#2b1b15]/10 bg-white p-8 text-center shadow-[0_24px_80px_rgba(43,27,21,.12)]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#7b5f52]">
          Chanel Spa
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-[-0.06em]">
          No content to display
        </h1>

        <p className="mt-4 text-sm font-semibold leading-7 text-[#2b1b15]/60">
          The page exists in the page list, but its HTML is empty inside
          chanelEditorPages. Update chanelData.ts.
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

    const header = root.querySelector<HTMLElement>(
      '[data-section-kind="header"]',
    );

    header?.classList.add("chanel-sticky-nav", "chanel-glass");

    const revealTargets = root.querySelectorAll<HTMLElement>(
      [
        "section",
        "article",
        "form",
        "[data-section-kind]",
        "[data-section-kind='service-card']",
        "[data-section-kind='gallery-image']",
        ".chanel-card",
      ].join(","),
    );

    revealTargets.forEach((element) => {
      element.classList.add("chanel-auto-reveal");
    });

    const cards = root.querySelectorAll<HTMLElement>(
      [
        ".chanel-card",
        "[data-section-kind='service-card']",
        "[data-section-kind='gallery-image']",
        "[data-section-kind='testimonials'] article",
        "form",
      ].join(","),
    );

    cards.forEach((card) => {
      card.classList.add("chanel-shine");
    });

    const floatingItems = root.querySelectorAll<HTMLElement>(
      [
        '[data-section-kind="hero"] img',
        '[data-section-kind="about"] img',
        '[data-section-kind="contact"] img',
        ".chanel-float",
      ].join(","),
    );

    floatingItems.forEach((element) => {
      element.classList.add("chanel-soft-float");
    });

    const parallaxImages = root.querySelectorAll<HTMLImageElement>(
      [
        '[data-section-kind="hero"] img',
        '[data-section-kind="about"] img',
        '[data-section-kind="contact"] img',
      ].join(","),
    );

    parallaxImages.forEach((image) => {
      image.classList.add("chanel-parallax-image");
      image.closest("div")?.classList.add("chanel-image-glow");
    });

    const buttons = root.querySelectorAll<HTMLElement>(
      'a[data-editable-link="true"], button',
    );

    buttons.forEach((button) => {
      button.classList.add("chanel-magnetic");
    });

    let observer: IntersectionObserver | null = null;

    if (!reduceMotion && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("chanel-is-visible");
              observer?.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          threshold: 0.14,
          rootMargin: "0px 0px -8% 0px",
        },
      );

      revealTargets.forEach((element) => observer?.observe(element));
    } else {
      revealTargets.forEach((element) =>
        element.classList.add("chanel-is-visible"),
      );
    }

    let animationFrame = 0;

    function handleScroll() {
      if (reduceMotion) return;

      cancelAnimationFrame(animationFrame);

      animationFrame = window.requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight || 900;

        parallaxImages.forEach((image) => {
          const rect = image.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const progress = (center - viewportHeight / 2) / viewportHeight;
          const y = Math.max(-18, Math.min(18, progress * -28));

          image.style.setProperty("--chanel-parallax-y", `${y}px`);
        });
      });
    }

    function handlePointerMove(event: PointerEvent) {
      if (reduceMotion) return;

      const target = event.target as HTMLElement | null;
      const magnetic = target?.closest<HTMLElement>(".chanel-magnetic");

      if (!magnetic || !root.contains(magnetic)) return;

      const rect = magnetic.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      magnetic.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    }

    function handlePointerOut(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      const magnetic = target?.closest<HTMLElement>(".chanel-magnetic");

      if (!magnetic || !root.contains(magnetic)) return;

      magnetic.style.transform = "";
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerout", handlePointerOut);

    handleScroll();

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerout", handlePointerOut);
      cancelAnimationFrame(animationFrame);
    };
  }, [pageToRender]);

  const html = typeof page?.html === "string" ? page.html.trim() : "";

  return (
    <main
      dir="ltr"
      data-template-id="chanel"
      className="min-h-screen bg-[#fbf4ee] text-[#2b1b15]"
    >
      <style>{chanelEditorCss}</style>
      <style>{chanelInspiredEffectsCss}</style>

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