import React from "react";
import { lunelleEditorCss } from "./editorCss";
import { lunelleEditorPages } from "./lunelleData";

export type LunellePageId =
  | "home"
  | "about"
  | "services"
  | "gallery"
  | "prices"
  | "booking"
  | "contact";

export const lunellePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "prices", label: "מחירים", slug: "/prices" },
  { id: "booking", label: "קביעת תור", slug: "/booking" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
] as const;

type Props = {
  initialPage?: LunellePageId | string;
  isStudioStatic?: boolean;
};

const pageAliases: Record<string, LunellePageId> = {
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
  שירותים: "services",

  gallery: "gallery",
  "#gallery": "gallery",
  גלריה: "gallery",

  prices: "prices",
  "#prices": "prices",
  pricing: "prices",
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

const nailoraInspiredEffectsCss = `
  .lunelle-template-root {
    scroll-behavior: smooth;
    isolation: isolate;
  }

  .lunelle-template-root * {
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }

  .lunelle-template-root [data-section-kind] {
    position: relative;
  }

  .lunelle-template-root .lunelle-auto-reveal {
    opacity: 0;
    transform: translateY(34px) scale(0.985);
    filter: blur(10px);
    transition:
      opacity 900ms cubic-bezier(.16,1,.3,1),
      transform 900ms cubic-bezier(.16,1,.3,1),
      filter 900ms cubic-bezier(.16,1,.3,1);
    will-change: opacity, transform, filter;
  }

  .lunelle-template-root .lunelle-auto-reveal.lunelle-is-visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }

  .lunelle-template-root .lunelle-auto-reveal:nth-child(2n) {
    transition-delay: 90ms;
  }

  .lunelle-template-root .lunelle-auto-reveal:nth-child(3n) {
    transition-delay: 150ms;
  }

  .lunelle-template-root .lunelle-auto-reveal:nth-child(4n) {
    transition-delay: 210ms;
  }

  .lunelle-template-root .lunelle-polish-glass {
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow: 0 18px 55px rgba(42, 23, 28, .08);
  }

  .lunelle-template-root .lunelle-soft-float {
    animation: lunelleSoftFloat 7s ease-in-out infinite;
    will-change: transform;
  }

  .lunelle-template-root .lunelle-soft-float:nth-child(2n) {
    animation-duration: 8.5s;
    animation-delay: -1.8s;
  }

  .lunelle-template-root .lunelle-soft-float:nth-child(3n) {
    animation-duration: 9.5s;
    animation-delay: -3s;
  }

  @keyframes lunelleSoftFloat {
    0%, 100% {
      transform: translate3d(0, 0, 0) rotate(0deg);
    }
    50% {
      transform: translate3d(0, -14px, 0) rotate(.6deg);
    }
  }

  .lunelle-template-root .lunelle-image-glow {
    position: relative;
  }

  .lunelle-template-root .lunelle-image-glow::after {
    content: "";
    position: absolute;
    inset: auto 12% -18px 12%;
    height: 42px;
    border-radius: 999px;
    background: rgba(138, 79, 95, .18);
    filter: blur(22px);
    pointer-events: none;
    opacity: .75;
    transition: opacity 450ms ease, transform 450ms ease;
  }

  .lunelle-template-root .lunelle-card,
  .lunelle-template-root [data-section-kind="service-card"],
  .lunelle-template-root [data-section-kind="gallery-image"],
  .lunelle-template-root [data-section-kind="testimonials"] article,
  .lunelle-template-root [data-section-kind="prices"] .grid,
  .lunelle-template-root form {
    transition:
      transform 550ms cubic-bezier(.16,1,.3,1),
      box-shadow 550ms cubic-bezier(.16,1,.3,1),
      border-color 550ms cubic-bezier(.16,1,.3,1),
      background-color 550ms cubic-bezier(.16,1,.3,1);
    will-change: transform;
  }

  .lunelle-template-root .lunelle-card:hover,
  .lunelle-template-root [data-section-kind="service-card"]:hover,
  .lunelle-template-root [data-section-kind="gallery-image"]:hover,
  .lunelle-template-root [data-section-kind="testimonials"] article:hover,
  .lunelle-template-root form:hover {
    transform: translateY(-10px);
    box-shadow: 0 32px 95px rgba(42, 23, 28, .15);
  }

  .lunelle-template-root img {
    transition:
      transform 900ms cubic-bezier(.16,1,.3,1),
      filter 900ms cubic-bezier(.16,1,.3,1),
      opacity 900ms cubic-bezier(.16,1,.3,1);
    will-change: transform;
  }

  .lunelle-template-root .lunelle-image-hover:hover,
  .lunelle-template-root [data-section-kind="gallery-image"]:hover img,
  .lunelle-template-root [data-section-kind="service-card"]:hover img {
    transform: scale(1.07);
    filter: saturate(1.08) contrast(1.03);
  }

  .lunelle-template-root .lunelle-parallax-image {
    transform: translate3d(0, var(--lunelle-parallax-y, 0px), 0) scale(1.035);
  }

  .lunelle-template-root a[data-editable-link="true"],
  .lunelle-template-root button {
    transition:
      transform 320ms cubic-bezier(.16,1,.3,1),
      box-shadow 320ms cubic-bezier(.16,1,.3,1),
      background-color 320ms cubic-bezier(.16,1,.3,1),
      color 320ms cubic-bezier(.16,1,.3,1);
  }

  .lunelle-template-root a[data-editable-link="true"]:hover,
  .lunelle-template-root button:hover {
    transform: translateY(-3px);
  }

  .lunelle-template-root .lunelle-magnetic {
    will-change: transform;
  }

  .lunelle-template-root .lunelle-marquee {
    overflow: hidden;
    white-space: nowrap;
  }

  .lunelle-template-root .lunelle-marquee-track {
    display: inline-flex;
    min-width: max-content;
    gap: 2rem;
    animation: lunelleMarquee 22s linear infinite;
  }

  @keyframes lunelleMarquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(50%);
    }
  }

  .lunelle-template-root .lunelle-shine {
    position: relative;
    overflow: hidden;
  }

  .lunelle-template-root .lunelle-shine::before {
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

  .lunelle-template-root .lunelle-shine:hover::before {
    opacity: 1;
    animation: lunelleShine 900ms cubic-bezier(.16,1,.3,1);
  }

  @keyframes lunelleShine {
    from {
      left: -42%;
    }
    to {
      left: 120%;
    }
  }

  .lunelle-template-root .lunelle-sticky-nav {
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .lunelle-template-root input,
  .lunelle-template-root textarea,
  .lunelle-template-root select {
    transition:
      border-color 250ms ease,
      box-shadow 250ms ease,
      background-color 250ms ease;
  }

  .lunelle-template-root input:focus,
  .lunelle-template-root textarea:focus,
  .lunelle-template-root select:focus {
    border-color: rgba(138, 79, 95, .45) !important;
    box-shadow: 0 0 0 5px rgba(232, 184, 193, .28);
  }

  @media (prefers-reduced-motion: reduce) {
    .lunelle-template-root *,
    .lunelle-template-root *::before,
    .lunelle-template-root *::after {
      animation: none !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

function normalizePageInput(value: unknown): LunellePageId {
  const clean = String(value ?? "home")
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .toLowerCase();

  return pageAliases[clean] || pageAliases[String(value ?? "").trim()] || "home";
}

function getLunellePage(pageId: LunellePageId) {
  return (
    lunelleEditorPages.find((item) => item.id === pageId) ||
    lunelleEditorPages.find((item) => item.id === "home") ||
    lunelleEditorPages[0]
  );
}

function LunelleEmptyState() {
  return (
    <section
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#fff7f1] px-6 text-[#2a171c]"
    >
      <div className="max-w-xl rounded-[32px] border border-[#2a171c]/10 bg-white p-8 text-center shadow-[0_24px_80px_rgba(42,23,28,.12)]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#8a4f5f]">
          Lunelle Studio
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-[-0.06em]">
          אין תוכן להצגה בעמוד הזה
        </h1>

        <p className="mt-4 text-sm font-semibold leading-7 text-[#2a171c]/60">
          העמוד קיים ברשימת הדפים, אבל ה־HTML שלו ריק בתוך
          lunelleEditorPages. צריך לעדכן את lunelleData.ts.
        </p>
      </div>
    </section>
  );
}

export default function LunellePages({
  initialPage = "home",
  isStudioStatic = false,
}: Props = {}) {
  const safeInitialPage = React.useMemo(
    () => normalizePageInput(initialPage),
    [initialPage],
  );

  const [activePage, setActivePage] =
    React.useState<LunellePageId>(safeInitialPage);

  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setActivePage(safeInitialPage);
  }, [safeInitialPage]);

  const pageToRender = isStudioStatic ? safeInitialPage : activePage;
  const page = getLunellePage(pageToRender);

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
    header?.classList.add("lunelle-sticky-nav", "lunelle-polish-glass");

    const revealTargets = root.querySelectorAll<HTMLElement>(
      [
        "section",
        "article",
        "form",
        "[data-section-kind]",
        "[data-section-kind='service-card']",
        "[data-section-kind='gallery-image']",
        ".lunelle-card",
      ].join(","),
    );

    revealTargets.forEach((element) => {
      element.classList.add("lunelle-auto-reveal");
    });

    const cards = root.querySelectorAll<HTMLElement>(
      [
        ".lunelle-card",
        "[data-section-kind='service-card']",
        "[data-section-kind='gallery-image']",
        "[data-section-kind='testimonials'] article",
        "form",
      ].join(","),
    );

    cards.forEach((card) => {
      card.classList.add("lunelle-shine");
    });

    const floatingItems = root.querySelectorAll<HTMLElement>(
      [
        '[data-section-kind="hero"] img',
        '[data-section-kind="about"] img',
        '[data-section-kind="contact"] img',
        ".lunelle-float",
      ].join(","),
    );

    floatingItems.forEach((element) => {
      element.classList.add("lunelle-soft-float");
    });

    const parallaxImages = root.querySelectorAll<HTMLImageElement>(
      [
        '[data-section-kind="hero"] img',
        '[data-section-kind="about"] img',
        '[data-section-kind="contact"] img',
      ].join(","),
    );

    parallaxImages.forEach((image) => {
      image.classList.add("lunelle-parallax-image");
      image.closest("div")?.classList.add("lunelle-image-glow");
    });

    const buttons = root.querySelectorAll<HTMLElement>(
      'a[data-editable-link="true"], button',
    );

    buttons.forEach((button) => {
      button.classList.add("lunelle-magnetic");
    });

    let observer: IntersectionObserver | null = null;

    if (!reduceMotion && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("lunelle-is-visible");
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
        element.classList.add("lunelle-is-visible"),
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

          image.style.setProperty("--lunelle-parallax-y", `${y}px`);
        });
      });
    }

    function handlePointerMove(event: PointerEvent) {
      if (reduceMotion) return;

      const target = event.target as HTMLElement | null;
      const magnetic = target?.closest<HTMLElement>(".lunelle-magnetic");

      if (!magnetic || !root.contains(magnetic)) return;

      const rect = magnetic.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      magnetic.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    }

    function handlePointerOut(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      const magnetic = target?.closest<HTMLElement>(".lunelle-magnetic");

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
      dir="rtl"
      data-template-id="lunelle"
      className="min-h-screen bg-[#fff7f1] text-[#2a171c]"
    >
      <style>{lunelleEditorCss}</style>
      <style>{nailoraInspiredEffectsCss}</style>

      {html ? (
        <div
          ref={rootRef}
          className="lunelle-template-root min-h-screen"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <LunelleEmptyState />
      )}
    </main>
  );
}