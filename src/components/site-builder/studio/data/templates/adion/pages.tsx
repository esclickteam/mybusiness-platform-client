import React, { useEffect, useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";

export type AdionPageId =
  | "home"
  | "about"
  | "cases"
  | "pricing"
  | "blog"
  | "contact";

type AdionPagesProps = {
  initialPage?: AdionPageId | string;
  mode?: "preview" | "editor" | "site" | string;
};

export const adionPages = [
  { id: "home", label: "בית", path: "/" },
  { id: "about", label: "אודות", path: "/about" },
  { id: "cases", label: "עבודות", path: "/cases" },
  { id: "pricing", label: "מחירים", path: "/pricing" },
  { id: "blog", label: "בלוג", path: "/blog" },
  { id: "contact", label: "צור קשר", path: "/contact" },
] as const;

const images = {
  hero:
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1800&q=85",
  heroAlt:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85",
  service1:
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85",
  service2:
    "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&w=1000&q=85",
  service3:
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=85",
  case1:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
  case2:
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85",
  case3:
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
  case4:
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85",
  portrait:
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=85",
  studio:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
  gallery1:
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=85",
  gallery2:
    "https://images.unsplash.com/photo-1496449903678-68ddcb189a24?auto=format&fit=crop&w=1000&q=85",
  gallery3:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
  gallery4:
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85",
  gallery5:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85",
  gallery6:
    "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=1000&q=85",
  gallery7:
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=85",
  gallery8:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function scrollTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function getSafePage(page?: string): AdionPageId {
  const valid = adionPages.some((item) => item.id === page);
  return valid ? (page as AdionPageId) : "home";
}

function AdionStyle() {
  return (
    <style>{`
      @keyframes adion-fade-up {
        from { opacity: 0; transform: translate3d(0, 34px, 0); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
      }

      @keyframes adion-marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }

      @keyframes adion-marquee-reverse {
        from { transform: translateX(-50%); }
        to { transform: translateX(0); }
      }

      @keyframes adion-float {
        0%, 100% { transform: translate3d(0, 0, 0) rotate(-2deg); }
        50% { transform: translate3d(0, -18px, 0) rotate(2deg); }
      }

      @keyframes adion-pulse-ring {
        0% { transform: scale(.92); opacity: .75; }
        70% { transform: scale(1.15); opacity: .05; }
        100% { transform: scale(.92); opacity: 0; }
      }

      @keyframes adion-word-reveal {
        from {
          opacity: 0;
          transform: translate3d(-50%, 48%, 0) scaleY(1.18);
          filter: blur(12px);
        }
        to {
          opacity: 1;
          transform: translate3d(-50%, 0, 0) scaleY(1);
          filter: blur(0);
        }
      }

      @keyframes adion-gallery-rise {
        from {
          opacity: 0;
          transform: translate3d(0, 120px, 0) scale(.96);
          filter: blur(10px);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
          filter: blur(0);
        }
      }

      @keyframes adion-frame-pop {
        from {
          opacity: 0;
          transform: translate3d(0, 80px, 0) rotate(var(--tilt)) skewX(var(--skew)) scale(.92);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0) rotate(var(--tilt)) skewX(var(--skew)) scale(1);
        }
      }

      @keyframes adion-soft-pan {
        0%, 100% { object-position: 50% 50%; }
        50% { object-position: 50% 42%; }
      }

      .adion-fade-up {
        animation: adion-fade-up .8s cubic-bezier(.2,.75,.2,1) both;
      }

      .adion-marquee {
        animation: adion-marquee 26s linear infinite;
      }

      .adion-marquee-reverse {
        animation: adion-marquee-reverse 30s linear infinite;
      }

      .adion-float {
        animation: adion-float 5.5s ease-in-out infinite;
      }

      .adion-pulse-ring {
        animation: adion-pulse-ring 2.7s ease-out infinite;
      }

      .adion-giant-word {
        animation: adion-word-reveal 1.05s cubic-bezier(.16, 1, .3, 1) both;
      }

      .adion-gallery-stage {
        animation: adion-gallery-rise 1.05s .15s cubic-bezier(.16, 1, .3, 1) both;
      }

      .adion-frame-card {
        transform: translate3d(0, 0, 0) rotate(var(--tilt)) skewX(var(--skew)) scale(1);
        animation: adion-frame-pop .9s cubic-bezier(.16, 1, .3, 1) both;
        animation-delay: var(--delay);
        transition:
          transform .7s cubic-bezier(.16, 1, .3, 1),
          border-color .7s ease,
          filter .7s ease,
          opacity .7s ease;
        will-change: transform;
      }

      .adion-frame-card:hover {
        transform: translate3d(0, -18px, 0) rotate(0deg) skewX(0deg) scale(1.035);
        border-color: rgba(246, 239, 227, .68);
        z-index: 30;
      }

      .adion-frame-card img {
        animation: adion-soft-pan 8s ease-in-out infinite;
      }

      .adion-frame-card:hover img {
        filter: grayscale(0);
        transform: scale(1.08);
      }
    `}</style>
  );
}

function Shell({
  page,
  setPage,
  mode,
  children,
}: {
  page: AdionPageId;
  setPage: (page: AdionPageId) => void;
  mode?: string;
  children: React.ReactNode;
}) {
  const isPreview = mode === "preview";

  return (
    <div
      dir="rtl"
      data-template-id="adion-framion-inspired"
      className={cx(
        "min-h-screen bg-[#10100e] text-[#f6efe3]",
        "selection:bg-[#f6efe3] selection:text-[#10100e]",
        isPreview && "h-full overflow-y-auto"
      )}
    >
      <AdionStyle />

      <div className="pointer-events-none fixed inset-0 z-0 opacity-70">
        <div className="absolute left-[-14rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#f7c873]/10 blur-3xl" />
        <div className="absolute bottom-[-18rem] right-[-10rem] h-[38rem] w-[38rem] rounded-full bg-[#ffffff]/10 blur-3xl" />
      </div>

      <Header page={page} setPage={setPage} />

      <main className="relative z-10">{children}</main>

      <Footer setPage={setPage} />
    </div>
  );
}

function Header({
  page,
  setPage,
}: {
  page: AdionPageId;
  setPage: (page: AdionPageId) => void;
}) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b border-white/10 bg-[#10100e]/78 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setPage("home")}
          className="group flex items-center gap-3"
        >
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white text-[#10100e]">
            <span className="absolute inset-0 bg-[#f7c873] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative text-sm font-black tracking-[-0.08em]">
              AD
            </span>
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.35em]">
            Adion
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 lg:flex">
          {adionPages.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPage(item.id)}
              className={cx(
                "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300",
                page === item.id
                  ? "bg-[#f6efe3] text-[#10100e]"
                  : "text-white/62 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setPage("contact")}
          className="group relative overflow-hidden rounded-full border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all duration-500 hover:border-[#f7c873]/80"
        >
          <span className="absolute inset-0 translate-y-full bg-[#f7c873] transition-transform duration-500 group-hover:translate-y-0" />
          <span className="relative group-hover:text-[#10100e]">קבעו צילום</span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 lg:hidden">
        {adionPages.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPage(item.id)}
            className={cx(
              "shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em]",
              page === item.id
                ? "border-[#f6efe3] bg-[#f6efe3] text-[#10100e]"
                : "border-white/10 bg-white/[0.04] text-white/65"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}

function Button({
  children,
  onClick,
  variant = "light",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "light" | "dark" | "ghost";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-4 text-xs font-black uppercase tracking-[0.18em] transition-all duration-500",
        variant === "light" &&
          "bg-[#f6efe3] text-[#10100e] hover:bg-[#f7c873]",
        variant === "dark" &&
          "bg-[#10100e] text-[#f6efe3] hover:bg-[#2b2a25]",
        variant === "ghost" &&
          "border border-white/15 bg-white/[0.04] text-white hover:border-white/40 hover:bg-white/10"
      )}
    >
      <span className="relative z-10">{children}</span>
      <span className="mr-3 transition-transform duration-300 group-hover:-translate-x-1">
        ←
      </span>
    </button>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/65">
      <span className="text-[#f7c873]">✦</span>
      {children}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  text,
  align = "right",
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  align?: "right" | "center";
}) {
  return (
    <div
      className={cx(
        "mx-auto mb-12 max-w-5xl",
        align === "center" ? "text-center" : "text-right"
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-5xl font-black uppercase leading-[0.86] tracking-[-0.08em] text-[#f6efe3] sm:text-7xl lg:text-8xl">
        {title}
      </h2>
      {text && (
        <p
          className={cx(
            "mt-6 max-w-2xl text-base leading-8 text-white/58 sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}

function Marquee({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-white/[0.03] py-4">
      <div
        className={cx(
          "flex w-max items-center gap-5 whitespace-nowrap",
          reverse ? "adion-marquee-reverse" : "adion-marquee"
        )}
      >
        {doubled.map((item, index) => (
          <React.Fragment key={`${item}-${index}`}>
            <span className="text-xl font-black uppercase tracking-[-0.04em] text-white/80 sm:text-3xl">
              {item}
            </span>
            <span className="text-[#f7c873]">✦</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function SocialRound({ label, title }: { label: string; title: string }) {
  return (
    <button
      type="button"
      aria-label={title}
      className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-sm font-black text-white/80 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-[#f7c873] hover:bg-[#f7c873] hover:text-[#10100e]"
    >
      <span className="transition duration-500 group-hover:scale-110">
        {label}
      </span>
    </button>
  );
}

function Hero({ setPage }: { setPage: (page: AdionPageId) => void }) {
  const cards = [
    {
      src: images.gallery1,
      alt: "פריים הפקה עריכתי",
      className:
        "left-[-5%] top-[4%] h-[92px] w-[33%] sm:h-[118px] sm:w-[27%] lg:h-[128px] lg:w-[25%]",
      tilt: "-5deg",
      skew: "-8deg",
      delay: "160ms",
    },
    {
      src: images.gallery2,
      alt: "פריים סטודיו מינימליסטי",
      className:
        "left-[25%] top-[2%] h-[92px] w-[33%] sm:h-[118px] sm:w-[27%] lg:h-[128px] lg:w-[25%]",
      tilt: "0deg",
      skew: "0deg",
      delay: "230ms",
    },
    {
      src: images.gallery3,
      alt: "פריים אופנה בתנועה",
      className:
        "left-[54%] top-[4%] h-[92px] w-[33%] sm:h-[118px] sm:w-[27%] lg:h-[128px] lg:w-[25%]",
      tilt: "2deg",
      skew: "5deg",
      delay: "300ms",
    },
    {
      src: images.gallery4,
      alt: "פריים ויזואלי יצירתי",
      className:
        "left-[82%] top-[3%] h-[92px] w-[33%] sm:h-[118px] sm:w-[27%] lg:h-[128px] lg:w-[25%]",
      tilt: "-6deg",
      skew: "-8deg",
      delay: "370ms",
    },
    {
      src: images.service2,
      alt: "פורטרט עם פרחים",
      className:
        "left-[-4%] top-[25%] h-[185px] w-[39%] sm:h-[220px] sm:w-[27%] lg:h-[240px] lg:w-[25%]",
      tilt: "4deg",
      skew: "-6deg",
      delay: "260ms",
    },
    {
      src: images.gallery5,
      alt: "פורטרט סטודיו",
      className:
        "left-[25%] top-[24%] h-[185px] w-[39%] sm:h-[220px] sm:w-[27%] lg:h-[240px] lg:w-[25%]",
      tilt: "0deg",
      skew: "0deg",
      delay: "330ms",
    },
    {
      src: images.hero,
      alt: "הפקה וירטואלית",
      className:
        "left-[54%] top-[25%] h-[185px] w-[39%] sm:h-[220px] sm:w-[27%] lg:h-[240px] lg:w-[25%]",
      tilt: "-1deg",
      skew: "7deg",
      delay: "400ms",
    },
    {
      src: images.gallery6,
      alt: "קונספט ויזואלי",
      className:
        "left-[83%] top-[24%] h-[185px] w-[39%] sm:h-[220px] sm:w-[27%] lg:h-[240px] lg:w-[25%]",
      tilt: "-6deg",
      skew: "-8deg",
      delay: "470ms",
    },
    {
      src: images.gallery7,
      alt: "פריים זוגי",
      className:
        "left-[-8%] top-[62%] h-[170px] w-[38%] sm:h-[210px] sm:w-[27%] lg:h-[240px] lg:w-[25%]",
      tilt: "-4deg",
      skew: "-8deg",
      delay: "520ms",
    },
    {
      src: images.case4,
      alt: "ארט דיירקשן",
      className:
        "left-[24%] top-[60%] h-[170px] w-[38%] sm:h-[210px] sm:w-[27%] lg:h-[240px] lg:w-[25%]",
      tilt: "1deg",
      skew: "0deg",
      delay: "590ms",
    },
    {
      src: images.service3,
      alt: "בימוי סצנה ויזואלית",
      className:
        "left-[54%] top-[62%] h-[170px] w-[38%] sm:h-[210px] sm:w-[27%] lg:h-[240px] lg:w-[25%]",
      tilt: "-3deg",
      skew: "7deg",
      delay: "660ms",
    },
    {
      src: images.gallery8,
      alt: "פנים קולנועיות",
      className:
        "left-[83%] top-[60%] h-[170px] w-[38%] sm:h-[210px] sm:w-[27%] lg:h-[240px] lg:w-[25%]",
      tilt: "5deg",
      skew: "-7deg",
      delay: "730ms",
    },
  ];

  return (
    <section className="relative min-h-[calc(100vh-76px)] overflow-hidden border-b border-white/10 bg-[#10100e] px-4 pb-0 pt-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-white/[0.045] blur-3xl" />
        <div className="absolute left-[-18rem] top-[30%] h-[32rem] w-[32rem] rounded-full bg-[#f7c873]/[0.06] blur-3xl" />
        <div className="absolute bottom-[-16rem] right-[-18rem] h-[36rem] w-[36rem] rounded-full bg-white/[0.06] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1800px]">
        <div className="relative h-[150px] overflow-hidden sm:h-[190px] lg:h-[220px] xl:h-[245px]">
          <h1 className="adion-giant-word absolute left-1/2 top-[-2.5vw] select-none bg-gradient-to-b from-white via-white/60 to-white/5 bg-clip-text text-[26vw] font-black uppercase leading-none tracking-[-0.16em] text-transparent sm:text-[23vw] lg:text-[20vw]">
            ADION
          </h1>
        </div>

        <div className="relative z-20 mt-3 flex items-center justify-center">
          <p className="adion-fade-up max-w-2xl text-center text-base font-medium leading-7 text-white/62 sm:text-lg lg:text-xl">
            הפקת וידאו, צילום ותוכן ויזואלי למותגים מודרניים.
          </p>
        </div>

        <div className="pointer-events-none absolute left-0 top-[170px] z-30 hidden items-center gap-4 sm:flex lg:top-[185px]">
          <SocialRound label="𝕏" title="X" />
          <SocialRound label="◎" title="Instagram" />
        </div>

        <div className="pointer-events-none absolute right-0 top-[170px] z-30 hidden items-center gap-4 sm:flex lg:top-[185px]">
          <SocialRound label="▶" title="YouTube" />
          <SocialRound label="v" title="Vimeo" />
        </div>

        <div className="adion-gallery-stage relative mx-[calc(50%-50vw)] mt-14 h-[540px] overflow-hidden sm:mt-16 sm:h-[620px] lg:mt-20 lg:h-[650px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-[#10100e] via-[#10100e]/75 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-52 bg-gradient-to-t from-[#10100e] via-[#10100e]/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-[#10100e] to-transparent sm:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-[#10100e] to-transparent sm:w-32" />

          <div className="absolute inset-0 [perspective:1200px]">
            {cards.map((item, index) => (
              <div
                key={`${item.alt}-${index}`}
                className={cx(
                  "adion-frame-card absolute overflow-hidden rounded-[1.25rem] border-[3px] border-[#20201d] bg-[#151512] shadow-[0_22px_70px_rgba(0,0,0,.62)]",
                  item.className
                )}
                style={
                  {
                    "--tilt": item.tilt,
                    "--skew": item.skew,
                    "--delay": item.delay,
                  } as React.CSSProperties
                }
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover grayscale transition duration-700"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage("cases")}
            className="group relative overflow-hidden rounded-full bg-[#f6efe3] px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-[#10100e] transition duration-500 hover:bg-[#f7c873]"
          >
            צפייה בעבודות
            <span className="mr-3 inline-block transition duration-300 group-hover:-translate-x-1">
              ←
            </span>
          </button>
          <button
            type="button"
            onClick={() => setPage("contact")}
            className="group relative overflow-hidden rounded-full border border-white/15 bg-white/[0.05] px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-white backdrop-blur-xl transition duration-500 hover:border-white/45 hover:bg-white/10"
          >
            צור קשר
            <span className="mr-3 inline-block transition duration-300 group-hover:-translate-x-1">
              ←
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 sm:p-6">
        <div className="mb-5 text-xs font-black uppercase tracking-[0.25em] text-white/45">
          לקוחות ושותפים
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {["Northway", "Moment", "Frontier", "Skyline", "Nova", "Studio X"].map(
            (item) => (
              <div
                key={item}
                className="flex h-20 items-center justify-center rounded-2xl border border-white/10 bg-[#10100e]/50 text-sm font-black uppercase tracking-[0.25em] text-white/42 transition duration-500 hover:bg-white hover:text-[#10100e]"
              >
                {item}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

function Manifesto({ setPage }: { setPage: (page: AdionPageId) => void }) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_.75fr] lg:items-end">
          <div>
            <h2 className="text-[16vw] font-black uppercase leading-[0.78] tracking-[-0.12em] text-[#f6efe3] sm:text-[12vw] lg:text-[8.4vw]">
              המקום
              <br />
              שבו
              <br />
              רעיון
              <br />
              הופך
              <br />
              לסיפור
              <br />
              ויזואלי.
            </h2>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div className="mb-8 h-16 w-16 rounded-full bg-[#f7c873] p-4 text-center text-2xl text-[#10100e]">
              ▶
            </div>
            <p className="text-xl leading-9 text-white/66">
              אנחנו הופכים רעיונות לחוויות ויזואליות קולנועיות. אסטרטגיה,
              צילום, הפקה ועריכה מתחברים יחד כדי ליצור תוכן שנראה חד,
              רגשי ופרימיום.
            </p>
            <div className="mt-8">
              <Button variant="ghost" onClick={() => setPage("about")}>
                הסיפור שלנו
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      title: "הפקה",
      text: "משלב הרעיון ועד יום הצילום — אנחנו מנהלים את התהליך עם כיוון ויזואלי ברור ותקשורת מקצועית.",
      image: images.service1,
    },
    {
      title: "בימוי",
      text: "אנחנו מגדירים את האווירה, התנועה, הפריימים והקצב כדי שכל סצנה תרגיש מדויקת.",
      image: images.service2,
    },
    {
      title: "עריכה",
      text: "חיתוך מדויק, צבע, סאונד וקצב הופכים חומר גלם לקמפיין מלוטש ומרשים.",
      image: images.service3,
    },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <SectionTitle
          eyebrow="שירותים"
          title={
            <>
              מהרעיון
              <br />
              ועד הפריים הסופי.
            </>
          }
          text="סטודיו ויזואלי מלא לצילום, סרטוני מותג, תוכן לסושיאל וקמפיינים פרימיום."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {services.map((item, index) => (
            <article
              key={item.title}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]"
            >
              <div className="relative h-[360px] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="absolute left-5 top-5 rounded-full bg-[#f6efe3] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#10100e]">
                  0{index + 1}
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-4xl font-black uppercase tracking-[-0.07em]">
                  {item.title}
                </h3>
                <p className="mt-4 leading-7 text-white/56">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cases({ setPage }: { setPage: (page: AdionPageId) => void }) {
  const cases = [
    {
      title: "Northway",
      year: "2026",
      image: images.case1,
      tag: "סרט מותג",
    },
    {
      title: "Moment",
      year: "2025",
      image: images.case2,
      tag: "צילום עריכתי",
    },
    {
      title: "Frontier",
      year: "2024",
      image: images.case3,
      tag: "קמפיין",
    },
    {
      title: "Skyline",
      year: "2023",
      image: images.case4,
      tag: "פורטרטים",
    },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle
            eyebrow="עבודות נבחרות"
            title={
              <>
                פרויקטים
                <br />
                עם אימפקט ויזואלי.
              </>
            }
          />
          <div className="pb-3">
            <Button variant="ghost" onClick={() => setPage("cases")}>
              לכל העבודות
            </Button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {cases.map((item, index) => (
            <article
              key={item.title}
              className={cx(
                "group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]",
                index % 2 === 1 && "lg:translate-y-16"
              )}
            >
              <div className="relative h-[440px] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10100e] via-transparent to-transparent" />
                <div className="absolute left-6 right-6 top-6 flex items-center justify-between">
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#10100e]">
                    {item.tag}
                  </span>
                  <span className="rounded-full border border-white/20 bg-black/25 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur">
                    {item.year}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                  <h3 className="text-5xl font-black uppercase tracking-[-0.08em]">
                    {item.title}
                  </h3>
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f7c873] text-xl font-black text-[#10100e] transition duration-500 group-hover:rotate-[-35deg]">
                    ←
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    {
      quote:
        "הקמפיין שלנו סוף סוף נראה קולנועי, יוקרתי וברור. הסרטון הסופי עזר לנו להשיק את המותג בביטחון.",
      name: "אמילי פארקר",
      role: "מנהלת קריאייטיב",
      rating: "5/5",
    },
    {
      quote:
        "התהליך היה מסודר, יצירתי ומהיר. כל פריים הרגיש מדויק ומחובר למותג שלנו.",
      name: "דניאל מיטשל",
      role: "מנהל שיווק",
      rating: "4.9/5",
    },
    {
      quote:
        "הם הפכו את הסיפור שלנו לתוכן שנראה יקר, חד ומלא רגש.",
      name: "אוליביה טרנר",
      role: "מנהלת מוצר",
      rating: "5/5",
    },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <SectionTitle
          eyebrow="ביקורות"
          title={
            <>
              מה הלקוחות
              <br />
              אומרים.
            </>
          }
          text="מילים אמיתיות ממותגים ויוצרים שחיפשו תוצאה ויזואלית ברמה גבוהה ותהליך חלק."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {reviews.map((item) => (
            <article
              key={item.name}
              className="rounded-[2rem] border border-white/10 bg-[#f6efe3] p-7 text-[#10100e] transition duration-500 hover:-translate-y-2 hover:bg-[#f7c873]"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="text-5xl font-black tracking-[-0.08em]">
                  {item.rating}
                </span>
                <span className="text-5xl leading-none">״</span>
              </div>
              <p className="text-xl font-semibold leading-9">{item.quote}</p>
              <div className="mt-10 border-t border-black/10 pt-5">
                <div className="font-black uppercase tracking-[-0.03em]">
                  {item.name}
                </div>
                <div className="mt-1 text-sm font-semibold text-black/55">
                  {item.role}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ setPage }: { setPage: (page: AdionPageId) => void }) {
  const plans = [
    {
      badge: "Starter",
      name: "בסיסי",
      price: "₪8,900 לפרויקט",
      text: "למותגים שצריכים צילום נקי, פרימיום ותהליך הפקה יעיל.",
      features: [
        "קונספט קריאייטיבי",
        "יום צילום מקצועי",
        "עריכה קולנועית",
        "ייצוא באיכות גבוהה",
        "ליווי ותקשורת שוטפת",
      ],
    },
    {
      badge: "Pro",
      name: "מתקדם",
      price: "₪23,900 לפרויקט",
      text: "לקמפיינים שצריכים כיוון ויזואלי מלא, צוות הפקה ופוסט-פרודקשן מתקדם.",
      features: [
        "אסטרטגיה ותכנון",
        "בימוי קריאייטיבי מלא",
        "צוות הפקה",
        "תיקון צבע מתקדם",
        "פורמטים לכל הפלטפורמות",
      ],
    },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <SectionTitle
          eyebrow="מחירים"
          title={
            <>
              חבילות ברורות.
              <br />
              תוצאה פרימיום.
            </>
          }
          text="חבילות פשוטות ששומרות על תהליך מקצועי, מדויק וממוקד."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {plans.map((plan, index) => (
            <article
              key={plan.name}
              className={cx(
                "rounded-[2rem] border p-7 sm:p-10",
                index === 1
                  ? "border-[#f7c873]/50 bg-[#f7c873] text-[#10100e]"
                  : "border-white/10 bg-white/[0.04] text-[#f6efe3]"
              )}
            >
              <div className="mb-8 flex items-center justify-between gap-4">
                <span
                  className={cx(
                    "rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em]",
                    index === 1
                      ? "bg-[#10100e] text-[#f6efe3]"
                      : "bg-[#f6efe3] text-[#10100e]"
                  )}
                >
                  ✦ {plan.badge}
                </span>
                <span className="text-sm font-black uppercase tracking-[0.25em] opacity-60">
                  0{index + 1}
                </span>
              </div>

              <h3 className="text-6xl font-black uppercase leading-none tracking-[-0.09em]">
                {plan.name}
              </h3>
              <div className="mt-5 text-3xl font-black tracking-[-0.06em]">
                {plan.price}
              </div>
              <p className="mt-5 max-w-xl leading-8 opacity-70">{plan.text}</p>

              <button
                type="button"
                onClick={() => setPage("contact")}
                className={cx(
                  "mt-8 w-full rounded-full px-6 py-4 text-xs font-black uppercase tracking-[0.18em] transition",
                  index === 1
                    ? "bg-[#10100e] text-[#f6efe3] hover:bg-black"
                    : "bg-[#f6efe3] text-[#10100e] hover:bg-[#f7c873]"
                )}
              >
                התחלת פרויקט ←
              </button>

              <div className="mt-10 space-y-4">
                <div className="text-xs font-black uppercase tracking-[0.22em] opacity-50">
                  מה כלול:
                </div>
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center justify-between border-t border-current/10 pt-4"
                  >
                    <span className="font-semibold">{feature}</span>
                    <span>+</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ setPage }: { setPage: (page: AdionPageId) => void }) {
  const faqs = [
    {
      q: "איזה סוגי תוכן אתם מפיקים?",
      a: "סרטוני מותג, קמפיינים, תוכן לסושיאל, פורטרטים, סרטוני אירועים, צילום סטודיו וסרטוני השקה.",
    },
    {
      q: "כמה זמן לוקח פרויקט?",
      a: "רוב הפרויקטים מסתיימים בתוך שבועיים עד ארבעה שבועות, בהתאם להיקף, לוקיישנים וצרכי עריכה.",
    },
    {
      q: "אתם מטפלים בכל התהליך?",
      a: "כן. אנחנו יכולים לנהל קונספט, תכנון, צילום, עריכה, צבע, סאונד והכנת הקבצים הסופיים.",
    },
    {
      q: "אפשר לקבל עזרה גם בקונספט?",
      a: "כן. אנחנו עוזרים לבנות את הסיפור, האווירה, הכיוון הוויזואלי ורשימת הצילומים לפני תחילת ההפקה.",
    },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[.65fr_1fr]">
        <div>
          <SectionTitle
            eyebrow="שאלות נפוצות"
            title={
              <>
                עדיין יש
                <br />
                שאלות?
              </>
            }
            text="כל מה שלקוחות בדרך כלל שואלים לפני שמתחילים הפקה ויזואלית."
          />
          <Button variant="ghost" onClick={() => setPage("contact")}>
            דברו איתנו
          </Button>
        </div>

        <div className="space-y-3">
          {faqs.map((item, index) => (
            <details
              key={item.q}
              className="group rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-xl font-black tracking-[-0.04em]">
                <span>
                  {index + 1}. {item.q}
                </span>
                <span className="transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-5 max-w-3xl leading-8 text-white/58">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function BigCta({ setPage }: { setPage: (page: AdionPageId) => void }) {
  return (
    <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-28">
      <div className="mx-auto overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#f6efe3] p-6 text-[#10100e] sm:p-10 lg:p-14">
        <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-[#10100e] p-6 text-[#f6efe3] sm:p-10">
          <img
            src={images.heroAlt}
            alt="הפקה ויזואלית"
            className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10100e] via-[#10100e]/50 to-transparent" />

          <div className="relative z-10 flex min-h-[460px] flex-col justify-end">
            <h2 className="max-w-6xl text-[16vw] font-black uppercase leading-[0.75] tracking-[-0.12em] sm:text-[11vw] lg:text-[8.2vw]">
              בואו
              <br />
              ניצור
              <br />
              את הסרטון
              <br />
              שלכם.
            </h2>
            <div className="mt-8">
              <Button onClick={() => setPage("contact")}>יצירת קשר</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage({ setPage }: { setPage: (page: AdionPageId) => void }) {
  return (
    <>
      <Hero setPage={setPage} />
      <Partners />
      <Manifesto setPage={setPage} />
      <Services />
      <Cases setPage={setPage} />
      <Reviews />
      <Pricing setPage={setPage} />
      <Faq setPage={setPage} />
      <BigCta setPage={setPage} />
    </>
  );
}

function AboutPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-3">
          <img
            src={images.portrait}
            alt="מייסד הסטודיו"
            className="h-[680px] w-full rounded-[1.5rem] object-cover grayscale"
          />
        </div>

        <div>
          <Eyebrow>אודות</Eyebrow>
          <h1 className="text-[16vw] font-black uppercase leading-[0.76] tracking-[-0.12em] sm:text-[11vw] lg:text-[7.8vw]">
            סטודיו
            <br />
            לסיפורים
            <br />
            קולנועיים.
          </h1>
          <p className="mt-8 max-w-3xl text-xl leading-9 text-white/62">
            Adion הוא סטודיו ויזואלי לצלמים, יוצרי וידאו וצוותי הפקה שרוצים
            נוכחות דיגיטלית יוקרתית. התבנית משלבת טיפוגרפיה גדולה,
            תמונות חזקות ותנועה קולנועית.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-[1500px] gap-4 sm:grid-cols-3">
        {[
          ["25+", "פרויקטים שהושלמו"],
          ["4.9", "דירוג ממוצע"],
          ["8Y", "שנות ניסיון ויזואלי"],
        ].map(([num, label]) => (
          <div
            key={label}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8"
          >
            <div className="text-7xl font-black tracking-[-0.1em]">{num}</div>
            <div className="mt-3 text-xs font-black uppercase tracking-[0.25em] text-white/45">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CasesPage() {
  return (
    <>
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            eyebrow="עבודות"
            title={
              <>
                עבודות
                <br />
                עם נוכחות.
              </>
            }
            text="עמוד עבודות בסגנון קייס סטאדי, עם כרטיסי תמונה גדולים, שנים, קטגוריות ותנועה פרימיום."
          />
        </div>
      </section>
      <Cases setPage={() => undefined} />
      <Marquee
        reverse
        items={["קמפיינים", "פורטרטים", "אירועים", "סרטים", "השקות"]}
      />
    </>
  );
}

function PricingPage({ setPage }: { setPage: (page: AdionPageId) => void }) {
  return (
    <>
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            eyebrow="מחירים"
            title={
              <>
                בחרו את
                <br />
                ההפקה שלכם.
              </>
            }
            text="עמוד לחבילות, הצעות מחיר מותאמות ותהליך עבודה ברור."
          />
        </div>
      </section>
      <Pricing setPage={setPage} />
      <Faq setPage={setPage} />
    </>
  );
}

function BlogPage() {
  const posts = [
    {
      title: "איך מתכננים קמפיין ויזואלי חזק",
      image: images.studio,
      date: "12 ביוני 2026",
    },
    {
      title: "למה עריכה קולנועית משנה את תפיסת המותג",
      image: images.service2,
      date: "28 במאי 2026",
    },
    {
      title: "מה להכין לפני יום צילום",
      image: images.service1,
      date: "18 באפריל 2026",
    },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <SectionTitle
          eyebrow="בלוג"
          title={
            <>
              הערות
              <br />
              מהסטודיו.
            </>
          }
          text="כרטיסים עריכתיים למדריכים, עדכונים וסיפורים מאחורי הקלעים."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]"
            >
              <div className="h-[340px] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-7">
                <div className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#f7c873]">
                  {post.date}
                </div>
                <h2 className="text-3xl font-black uppercase leading-none tracking-[-0.06em]">
                  {post.title}
                </h2>
                <p className="mt-5 leading-7 text-white/55">
                  תקציר קצר למאמר שיוכל להתחבר בהמשך למערכת הבלוג שלכם.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <Eyebrow>צור קשר</Eyebrow>
          <h1 className="text-[16vw] font-black uppercase leading-[0.76] tracking-[-0.12em] sm:text-[11vw] lg:text-[7.8vw]">
            מתחילים
            <br />
            את
            <br />
            הפרויקט.
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-9 text-white/62">
            ספרו לנו מה תרצו לצלם, מתי אתם צריכים את זה ואיזו תוצאה תרצו ליצור.
          </p>
        </div>

        <form className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          {[
            ["שם", "השם שלכם"],
            ["אימייל", "hello@email.com"],
            ["פרויקט", "סרט מותג, חתונה, קמפיין..."],
          ].map(([label, placeholder]) => (
            <label key={label} className="mb-5 block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-white/45">
                {label}
              </span>
              <input
                placeholder={placeholder}
                className="w-full rounded-2xl border border-white/10 bg-[#10100e] px-5 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-[#f7c873]"
              />
            </label>
          ))}

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-white/45">
              הודעה
            </span>
            <textarea
              rows={6}
              placeholder="ספרו לנו על הפרויקט..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-[#10100e] px-5 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-[#f7c873]"
            />
          </label>

          <button
            type="button"
            className="mt-6 w-full rounded-full bg-[#f7c873] px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#10100e] transition hover:bg-[#f6efe3]"
          >
            שליחת הודעה ←
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer({ setPage }: { setPage: (page: AdionPageId) => void }) {
  return (
    <footer className="relative z-10 border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <button
            type="button"
            onClick={() => setPage("home")}
            className="text-5xl font-black uppercase leading-none tracking-[-0.09em] transition hover:text-[#f7c873]"
          >
            Adion ®
          </button>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/46">
            בונים מותגים ויזואליים עם אסטרטגיה, תנועה וקריאייטיב קולנועי.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {adionPages.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPage(item.id)}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/52 transition hover:border-[#f7c873] hover:text-[#f7c873]"
            >
              {item.label} 0{index + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={scrollTop}
            className="rounded-full bg-[#f6efe3] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#10100e]"
          >
            חזרה למעלה
          </button>
        </div>
      </div>
    </footer>
  );
}

export default function AdionPages({
  initialPage = "home",
  mode = "site",
}: AdionPagesProps) {
  const [page, setPageState] = useState<AdionPageId>(getSafePage(initialPage));

  useEffect(() => {
    setPageState(getSafePage(initialPage));
  }, [initialPage]);

  const setPage = useMemo(
    () => (nextPage: AdionPageId) => {
      setPageState(nextPage);
      scrollTop();
    },
    []
  );

  return (
    <Shell page={page} setPage={setPage} mode={mode}>
      <VisualPageStack
        activePageId={page}
        pages={[
          { id: "home", content: <HomePage setPage={setPage} /> },
          { id: "about", content: <AboutPage /> },
          { id: "cases", content: <CasesPage /> },
          { id: "pricing", content: <PricingPage setPage={setPage} /> },
          { id: "blog", content: <BlogPage /> },
          { id: "contact", content: <ContactPage /> },
        ]}
      />
    </Shell>
  );
}