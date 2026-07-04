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

const chanelInspiredEffectsCss = `
  .chanel-template-root {
    scroll-behavior: smooth;
    isolation: isolate;
  }

  .chanel-template-root * {
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }

  /*
    חשוב:
    אין כאן hover animations, אין magnetic, אין shine, אין float.
    האפקטים הם רק reveal בגלילה כמו בתבנית ששלחת.
  */

  .chanel-template-root .chanel-scroll-reveal {
    opacity: 0;
    transform: translateY(58px);
    filter: blur(9px);
    transition:
      opacity 950ms cubic-bezier(.16, 1, .3, 1),
      transform 950ms cubic-bezier(.16, 1, .3, 1),
      filter 950ms cubic-bezier(.16, 1, .3, 1);
    will-change: opacity, transform, filter;
  }

  .chanel-template-root .chanel-scroll-reveal.chanel-in-view {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }

  .chanel-template-root .chanel-delay-1 {
    transition-delay: 90ms;
  }

  .chanel-template-root .chanel-delay-2 {
    transition-delay: 160ms;
  }

  .chanel-template-root .chanel-delay-3 {
    transition-delay: 230ms;
  }

  .chanel-template-root .chanel-delay-4 {
    transition-delay: 300ms;
  }

  .chanel-template-root .chanel-hero-parallax {
    transform: translate3d(0, var(--chanel-parallax-y, 0px), 0) scale(1.045);
    transition: transform 100ms linear;
    will-change: transform;
  }

  .chanel-template-root img {
    will-change: transform;
  }

  /*
    ביטול מוחלט של אפקטים מהגרסאות הקודמות.
    גם אם class נשאר ב-HTML, הוא לא יגרום להבהוב.
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

  .chanel-template-root .chanel-card:hover,
  .chanel-template-root .chanel-service-card:hover,
  .chanel-template-root .chanel-team-card:hover,
  .chanel-template-root .chanel-blog-card:hover,
  .chanel-template-root .chanel-process-card:hover,
  .chanel-template-root .chanel-price-row:hover,
  .chanel-template-root form:hover,
  .chanel-template-root article:hover {
    transform: none !important;
  }

  .chanel-template-root a[data-editable-link="true"],
  .chanel-template-root button {
    transition:
      transform 260ms cubic-bezier(.16, 1, .3, 1),
      background-color 260ms cubic-bezier(.16, 1, .3, 1),
      color 260ms cubic-bezier(.16, 1, .3, 1),
      border-color 260ms cubic-bezier(.16, 1, .3, 1);
  }

  .chanel-template-root a[data-editable-link="true"]:hover,
  .chanel-template-root button:hover {
    transform: translateY(-2px);
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

  if (pageAliases[raw]) {
    return pageAliases[raw];
  }

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

function ChanelEmptyState() {
  return (
    <section
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#fbf4ee] px-6 text-[#2b1b15]"
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

    /*
      אפקטי כניסה בגלילה:
      לא מוסיפים hover, לא מוסיפים magnetic, לא מוסיפים shine.
    */

    const revealTargets = Array.from(
      root.querySelectorAll<HTMLElement>(
        [
          ".chanel-home-hero-content",
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
          ".chanel-section-head",
          ".chanel-about-main-image",
          ".chanel-about-card",
          ".chanel-stat-card",
          ".chanel-process-card",
          ".chanel-service-card",
          ".chanel-team-card",
          ".chanel-price-row",
          ".chanel-testimonial-card",
          ".chanel-faq-item",
          ".chanel-blog-card",
          ".chanel-contact-form",
          ".chanel-form",
          ".chanel-contact-image",
        ].join(","),
      ),
    );

    revealTargets.forEach((element, index) => {
      element.classList.add("chanel-scroll-reveal");

      const delayIndex = index % 5;

      if (delayIndex > 0) {
        element.classList.add(`chanel-delay-${delayIndex}`);
      }
    });

    const heroImages = Array.from(
      root.querySelectorAll<HTMLImageElement>(
        [
          ".chanel-home-hero-bg img",
          ".chanel-hero-main-image img",
          ".chanel-hero-small-image img",
        ].join(","),
      ),
    );

    heroImages.forEach((image) => {
      image.classList.add("chanel-hero-parallax");
    });

    let observer: IntersectionObserver | null = null;

    if (!reduceMotion && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("chanel-in-view");
            observer?.unobserve(entry.target);
          });
        },
        {
          threshold: 0.16,
          rootMargin: "0px 0px -9% 0px",
        },
      );

      revealTargets.forEach((element) => observer?.observe(element));
    } else {
      revealTargets.forEach((element) => {
        element.classList.add("chanel-in-view");
      });
    }

    let animationFrame = 0;

    function handleScroll() {
      if (reduceMotion) return;

      cancelAnimationFrame(animationFrame);

      animationFrame = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || 0;
        const y = Math.max(-36, Math.min(36, scrollY * -0.035));

        heroImages.forEach((image) => {
          image.style.setProperty("--chanel-parallax-y", `${y}px`);
        });
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, [pageToRender]);

  const html = typeof page?.html === "string" ? page.html.trim() : "";

  return (
    <main
      dir="rtl"
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