import React, { useMemo, useState } from "react";

import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { virelloDefaultData } from "./defaultData";

export type VirelloPageId = "home" | "about" | "project" | "blog" | "contact";

export type VirelloPagesProps = {
  data?: Record<string, any>;
  initialPage?: VirelloPageId;
  activePageId?: VirelloPageId;
  pageId?: VirelloPageId;
  initialPageId?: VirelloPageId;
  currentPageId?: VirelloPageId;
  mode?: "preview" | "edit" | "editor" | "public";
  businessId?: string;
  isStudioStatic?: boolean;
};

type NavItem = {
  id: VirelloPageId;
  label: string;
  number: string;
  slug?: string;
};


export const virelloPages = [
  {
    id: "home",
    name: "בית",
    slug: "/",
  },
  {
    id: "about",
    name: "אודות",
    slug: "/about",
  },
  {
    id: "project",
    name: "פרויקטים",
    slug: "/project",
  },
  {
    id: "blog",
    name: "בלוג",
    slug: "/blog",
  },
  {
    id: "contact",
    name: "צור קשר",
    slug: "/contact",
  },
] as const;

type VirelloData = typeof virelloDefaultData;

type VirelloDataContextValue = {
  data: Record<string, any>;
  base: VirelloData;
};

const VISUAL_CONTENT_KEY = "__content";

const VirelloDataContext = React.createContext<VirelloDataContextValue>({
  data: {},
  base: virelloDefaultData,
});

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function asPlainObject(value: unknown): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, any>;
}

function readPath(source: Record<string, any>, path: string): any {
  return String(path || "")
    .split(".")
    .filter(Boolean)
    .reduce<any>((current, key) => {
      if (!current || typeof current !== "object") return undefined;
      return current[key];
    }, source);
}

function readVisualItem(data: Record<string, any>, elementId: string) {
  const content = asPlainObject(data?.[VISUAL_CONTENT_KEY]);
  const direct = content[elementId];

  if (direct && typeof direct === "object" && !Array.isArray(direct)) {
    return direct as Record<string, any>;
  }

  if (typeof direct === "string") {
    return {
      text: direct,
      src: direct,
      url: direct,
      secureUrl: direct,
    };
  }

  const nested = readPath(data || {}, elementId);

  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return nested as Record<string, any>;
  }

  if (typeof nested === "string") {
    return {
      text: nested,
      src: nested,
      url: nested,
      secureUrl: nested,
    };
  }

  return {};
}

function useVirelloData() {
  return React.useContext(VirelloDataContext);
}

function getVisualText(data: Record<string, any>, id: string, fallback: string) {
  const item = readVisualItem(data, id);
  const value = item.text ?? item.value ?? readPath(data, id);

  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}

function getVisualMedia(data: Record<string, any>, id: string, fallbackSrc: string) {
  const item = readVisualItem(data, id);
  const src = String(
    item.src || item.secureUrl || item.secure_url || item.url || item.originalUrl || fallbackSrc || "",
  );

  const explicitType = String(
    item.mediaType || item.resourceType || item.resource_type || item.type || "",
  ).toLowerCase();

  const isVideo =
    explicitType === "video" ||
    src.includes("/video/upload/") ||
    /\.(mp4|webm|mov|m4v|ogg|ogv)(\?|#|$)/i.test(src);

  return {
    src,
    mediaType: isVideo ? "video" : "image",
    alt: String(item.alt || item.originalName || item.name || ""),
  };
}

function VisualText({
  id,
  fallback,
  as: Tag = "span",
  className = "",
}: {
  id: string;
  fallback: string | number;
  as?: React.ElementType;
  className?: string;
}) {
  const { data } = useVirelloData();
  const text = getVisualText(data, id, String(fallback ?? ""));
  const TextTag = Tag as React.ElementType;

  return (
    <TextTag
      data-visual-edit-id={id}
      data-visual-edit-type="text"
      data-visual-editable="true"
      data-gjs-type="text"
      className={className}
    >
      {text}
    </TextTag>
  );
}

function VisualMedia({
  id,
  fallbackSrc,
  alt = "",
  className = "",
}: {
  id: string;
  fallbackSrc: string;
  alt?: string;
  className?: string;
}) {
  const { data } = useVirelloData();
  const media = getVisualMedia(data, id, fallbackSrc);

  if (media.mediaType === "video") {
    return (
      <video
        data-visual-edit-id={id}
        data-visual-edit-type="image"
        data-visual-media-type="video"
        data-visual-editable="true"
        src={media.src}
        className={className}
        muted
        loop
        playsInline
        autoPlay
      />
    );
  }

  return (
    <img
      data-visual-edit-id={id}
      data-visual-edit-type="image"
      data-visual-media-type="image"
      data-visual-editable="true"
      src={media.src}
      alt={media.alt || alt}
      className={className}
    />
  );
}

function VirelloEffects() {
  return (
    <style>
      {`
        @keyframes VirelloFloatA {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--r, 0deg)); }
          50% { transform: translate3d(0, -22px, 0) rotate(calc(var(--r, 0deg) + 2deg)); }
        }

        @keyframes VirelloFloatB {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--r, 0deg)); }
          50% { transform: translate3d(12px, 18px, 0) rotate(calc(var(--r, 0deg) - 3deg)); }
        }

        @keyframes VirelloFloatC {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--r, 0deg)); }
          50% { transform: translate3d(-14px, -16px, 0) rotate(calc(var(--r, 0deg) + 4deg)); }
        }

        @keyframes VirelloMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes VirelloMarqueeReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        @keyframes VirelloSpin { to { transform: rotate(360deg); } }

        @keyframes VirelloPulseBlob {
          0%, 100% { transform: scale(1); opacity: .65; }
          50% { transform: scale(1.18); opacity: .95; }
        }

        @keyframes VirelloRevealUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .Virello-reveal { animation: VirelloRevealUp .8s cubic-bezier(.22, 1, .36, 1) both; }
        .Virello-card-tilt { transform-style: preserve-3d; }
        .Virello-card-tilt:hover { transform: translateY(-10px) rotate(-1.5deg); }
      `}
    </style>
  );
}

function DotPattern({ className = "" }: { className?: string }) {
  return (
    <div
      className={cx("pointer-events-none absolute opacity-30", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(48,27,18,.5) 1.4px, transparent 1.4px)",
        backgroundSize: "18px 18px",
      }}
    />
  );
}

function SectionKicker({ id, fallback }: { id: string; fallback: string }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#301b12]/15 bg-white/70 px-4 py-2 text-sm font-black text-[#301b12] shadow-sm">
      <span className="h-2 w-2 rounded-full bg-[#ff9fbc]" />
      <VisualText id={id} fallback={fallback} />
    </div>
  );
}

function ArrowRound({ dark = true }: { dark?: boolean }) {
  return (
    <span
      className={cx(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1",
        dark ? "bg-[#301b12] text-[#fff8f0]" : "bg-[#fff8f0] text-[#301b12]",
      )}
    >
      ↗
    </span>
  );
}

function Header({
  activePage,
  onNavigate,
}: {
  activePage: VirelloPageId;
  onNavigate: (page: VirelloPageId) => void;
}) {
  const { base } = useVirelloData();
  const navItems = (base.nav as NavItem[]) || [];

  return (
    <header className="sticky top-0 z-50 border-b border-[#301b12]/10 bg-[#fff8f0]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1520px] items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => onNavigate("home")} className="group flex items-center gap-3">
          <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-[#301b12] text-lg font-black text-white">
            <span className="absolute inset-0 animate-[VirelloSpin_10s_linear_infinite] rounded-full border border-dashed border-white/35" />
            v
          </span>

          <VisualText
            id="brand.name"
            fallback={base.brand.name}
            className="text-2xl font-black tracking-[-0.08em] text-[#301b12]"
          />
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cx(
                "rounded-full px-5 py-3 text-sm font-black transition-all duration-300",
                activePage === item.id
                  ? "bg-[#301b12] text-white"
                  : "text-[#301b12]/70 hover:bg-[#301b12]/8 hover:text-[#301b12]",
              )}
            >
              <VisualText id={`nav.${index}.number`} fallback={item.number} className="mr-2 text-xs opacity-55" />
              <VisualText id={`nav.${index}.label`} fallback={item.label} />
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          {base.brand.socialLinks.map((item, index) => (
            <VisualText
              key={`${item}-${index}`}
              id={`brand.socialLinks.${index}`}
              fallback={item}
              className="text-sm font-black text-[#301b12]/55 transition hover:text-[#301b12]"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => onNavigate("contact")}
          className="rounded-full bg-[#301b12] px-5 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(48,27,18,.22)] transition hover:-translate-y-1"
        >
          <VisualText id="hero.primaryButton" fallback={base.hero.primaryButton} />
        </button>
      </div>
    </header>
  );
}

function Hero({ onNavigate }: { onNavigate: (page: VirelloPageId) => void }) {
  const { base } = useVirelloData();

  const heroCardClasses = [
    "left-[1%] top-[13%] h-[210px] w-[160px] rotate-[-10deg] animate-[VirelloFloatA_8s_ease-in-out_infinite]",
    "left-[25%] top-[2%] h-[250px] w-[190px] rotate-[7deg] animate-[VirelloFloatB_9s_ease-in-out_infinite]",
    "right-[22%] top-[16%] h-[225px] w-[170px] rotate-[-6deg] animate-[VirelloFloatC_10s_ease-in-out_infinite]",
    "right-[1%] top-[4%] h-[260px] w-[190px] rotate-[11deg] animate-[VirelloFloatA_8.5s_ease-in-out_infinite]",
    "left-[44%] bottom-[2%] h-[205px] w-[280px] rotate-[3deg] animate-[VirelloFloatB_9.5s_ease-in-out_infinite]",
  ];

  const rotations = ["-10deg", "7deg", "-6deg", "11deg", "3deg"];

  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-10 lg:px-8 lg:pb-28">
      <DotPattern className="left-[-30px] top-24 h-48 w-48 rounded-full" />

      <div className="pointer-events-none absolute left-[8%] top-16 h-52 w-52 animate-[VirelloPulseBlob_7s_ease-in-out_infinite] rounded-full bg-[#ffd0df] blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-[30%] h-64 w-64 animate-[VirelloPulseBlob_8s_ease-in-out_infinite] rounded-full bg-[#d8c4ff] blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-[36%] h-48 w-48 rounded-full bg-[#ffe3a8] blur-3xl" />

      <div className="mx-auto max-w-[1520px]">
        <div className="grid gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div className="relative z-20 Virello-reveal">
            <div className="mb-7 flex flex-wrap items-center gap-3">
              <VisualText
                id="hero.kicker"
                fallback={base.hero.kicker}
                className="rounded-full border border-[#301b12]/15 bg-white/70 px-4 py-2 text-sm font-black text-[#301b12]"
              />

              {base.hero.tags.map((tag, index) => (
                <VisualText
                  key={`${tag}-${index}`}
                  id={`hero.tags.${index}`}
                  fallback={tag}
                  className={cx(
                    "rounded-full px-4 py-2 text-sm font-black text-[#301b12]",
                    index === 0 ? "bg-[#ffe3a8]" : "bg-[#eadcff]",
                  )}
                />
              ))}
            </div>

            <VisualText
              id="hero.title"
              fallback={base.hero.title}
              as="h1"
              className="text-[26vw] font-black leading-[0.68] tracking-[-0.14em] text-[#301b12] sm:text-[20vw] lg:text-[12.5vw]"
            />

            <div className="mt-7 max-w-2xl">
              <VisualText
                id="hero.subtitle"
                fallback={base.hero.subtitle}
                as="h2"
                className="text-3xl font-black leading-[0.98] tracking-[-0.06em] text-[#301b12] sm:text-5xl"
              />

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => onNavigate("contact")}
                  className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#301b12] px-6 py-4 text-sm font-black text-white shadow-[0_20px_50px_rgba(48,27,18,.22)] transition hover:-translate-y-1"
                >
                  <VisualText id="hero.primaryButton" fallback={base.hero.primaryButton} />
                  <ArrowRound dark={false} />
                </button>

                <div className="flex gap-4 text-sm font-black text-[#301b12]/45">
                  {base.brand.socialLinks.map((item, index) => (
                    <VisualText key={`${item}-${index}`} id={`brand.socialLinks.${index}`} fallback={`${item} /`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[520px] lg:h-[620px]">
            <VisualText
              id="hero.badgeText"
              fallback={base.hero.badgeText}
              className="absolute left-[14%] bottom-[4%] z-10 grid h-28 w-28 place-items-center rounded-full bg-[#301b12] text-center text-sm font-black leading-tight text-white shadow-[0_30px_70px_rgba(48,27,18,.3)]"
            />

            <div className="absolute right-[18%] top-[40%] h-24 w-24 animate-[VirelloSpin_14s_linear_infinite] rounded-[30px] border-[14px] border-[#ffe3a8]" />

            <VisualText
              id="hero.floatingText"
              fallback={base.hero.floatingText}
              className="absolute bottom-20 right-[3%] rounded-full bg-[#fff8f0] px-5 py-3 text-sm font-black text-[#301b12] shadow-[0_18px_50px_rgba(48,27,18,.16)]"
            />

            {base.hero.images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className={cx(
                  "group absolute overflow-hidden rounded-[2rem] border-[8px] border-[#fff8f0] bg-white shadow-[0_35px_90px_rgba(48,27,18,.22)] transition duration-500 hover:z-30 hover:scale-105",
                  heroCardClasses[index],
                )}
                style={{ "--r": rotations[index] } as React.CSSProperties}
              >
                <VisualMedia
                  id={`hero.images.${index}`}
                  fallbackSrc={image}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesMarquee() {
  const { base } = useVirelloData();
  const repeated = [...base.services, ...base.services, ...base.services, ...base.services];

  return (
    <section className="overflow-hidden py-10">
      <div className="mx-auto max-w-[1520px] px-5 lg:px-8">
        <div className="mb-8 grid gap-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <SectionKicker id="services.kicker" fallback="שירותים" />
            <VisualText
              id="services.title"
              fallback="אנחנו בונים. המותגים שלכם עפים."
              as="h2"
              className="max-w-3xl text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl"
            />
          </div>

          <VisualText
            id="services.description"
            fallback="שירותי אסטרטגיה, עיצוב, פיתוח ושיווק שמתחברים למותג אחד ברור, מהיר ומרשים."
            as="p"
            className="max-w-lg text-lg font-bold leading-8 text-[#301b12]/60"
          />
        </div>
      </div>

      <div className="relative overflow-hidden py-5">
        <div className="flex w-max gap-4 animate-[VirelloMarquee_30s_linear_infinite] hover:[animation-play-state:paused]">
          {repeated.map((service, index) => {
            const originalIndex = index % base.services.length;

            return (
              <article
                key={`${service.title}-${index}`}
                className="group flex h-[170px] w-[330px] shrink-0 items-center justify-between rounded-[2rem] border border-[#301b12]/10 bg-[#fff8f0] p-6 shadow-[0_18px_50px_rgba(48,27,18,.08)] transition hover:-translate-y-2 hover:bg-[#301b12] hover:text-white"
              >
                <div>
                  <VisualText id={`services.${originalIndex}.number`} fallback={service.number} className="mb-7 text-sm font-black opacity-50" />
                  <VisualText id={`services.${originalIndex}.title`} fallback={service.title} as="h3" className="text-3xl font-black tracking-[-.06em]" />
                </div>

                <VisualText
                  id={`services.${originalIndex}.icon`}
                  fallback={service.icon}
                  className="grid h-20 w-20 place-items-center rounded-[1.6rem] bg-[#ffe3a8] text-4xl text-[#301b12] transition duration-300 group-hover:rotate-12 group-hover:scale-110"
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AboutSection({ onNavigate }: { onNavigate: (page: VirelloPageId) => void }) {
  const { base } = useVirelloData();

  return (
    <section className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
      <div className="absolute left-0 top-0 h-20 w-full bg-gradient-to-r from-[#fbd3df] via-[#f4e6ff] to-[#fff8f0]" />

      <div className="mx-auto grid max-w-[1520px] gap-6 pt-16 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#ffd4e2] via-[#f2e4ff] to-[#ffe3a8] p-6 shadow-[0_30px_90px_rgba(48,27,18,.12)]">
          <DotPattern className="right-8 top-8 h-40 w-40" />

          <div className="relative z-10 flex min-h-[540px] flex-col justify-between rounded-[2.4rem] bg-[#301b12] p-6 text-white">
            <div className="flex items-center justify-between">
              <SectionKicker id="about.kicker" fallback={base.about.kicker} />

              <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#301b12]">↗</span>
            </div>

            <div className="overflow-hidden rounded-[2rem]">
              <VisualMedia
                id="about.image"
                fallbackSrc={base.about.image}
                className="h-[340px] w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
          </div>

          <div className="absolute bottom-8 left-8 grid h-32 w-32 place-items-center rounded-full bg-[#fff8f0] text-center text-[#301b12] shadow-[0_20px_60px_rgba(48,27,18,.18)]">
            <div>
              <VisualText id="about.experience.value" fallback={base.about.experience.value} as="p" className="text-6xl font-black tracking-[-.09em]" />
              <VisualText id="about.experience.label" fallback={base.about.experience.label} as="p" className="text-xs font-black uppercase leading-tight" />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[3rem] bg-[#301b12] p-7 text-white md:p-10">
          <div>
            <SectionKicker id="about.kicker" fallback={base.about.kicker} />

            <VisualText
              id="about.title"
              fallback={base.about.title}
              as="h2"
              className="max-w-4xl text-5xl font-black leading-[.93] tracking-[-.075em] md:text-7xl"
            />

            <VisualText
              id="about.description"
              fallback={base.about.description}
              as="p"
              className="mt-7 max-w-3xl text-lg font-bold leading-8 text-white/62"
            />
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {base.stats.slice(0, 2).map((stat, index) => (
              <div key={`${stat.value}-${index}`} className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
                <VisualText id={`stats.${index}.value`} fallback={stat.value} as="p" className="text-6xl font-black tracking-[-.08em]" />
                <VisualText id={`stats.${index}.label`} fallback={stat.label} as="p" className="mt-2 text-sm font-bold text-white/60" />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate("about")}
            className="group mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black text-[#301b12]"
          >
            <VisualText id="about.button" fallback={base.about.button} />
            <ArrowRound />
          </button>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const { base, data } = useVirelloData();

  return (
    <section className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1520px] gap-8 lg:grid-cols-[.78fr_1.22fr]">
        <div>
          <SectionKicker id="whyUs.kicker" fallback={base.whyUs.kicker} />

          <VisualText
            id="whyUs.title"
            fallback={base.whyUs.title}
            as="h2"
            className="text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl"
          />
        </div>

        <div className="relative overflow-hidden rounded-[3rem] border border-[#301b12]/10 bg-white/75 p-7 shadow-[0_30px_90px_rgba(48,27,18,.08)] md:p-10">
          <DotPattern className="right-[-20px] top-[-20px] h-44 w-44" />

          <div className="relative z-10 space-y-6">
            {base.whyUs.progress.map((bar, index) => (
              <div key={`${bar.label}-${index}`}>
                <div className="mb-3 flex items-center justify-between text-sm font-black text-[#301b12]">
                  <VisualText id={`whyUs.progress.${index}.label`} fallback={bar.label} />
                  <VisualText id={`whyUs.progress.${index}.value`} fallback={bar.value} />
                </div>

                <div className="h-5 overflow-hidden rounded-full bg-[#301b12]/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#301b12] via-[#ff9fbc] to-[#ffe3a8] shadow-[0_0_30px_rgba(255,159,188,.45)]"
                    style={{ width: getVisualText(data, `whyUs.progress.${index}.value`, bar.value) }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-10 grid gap-4 md:grid-cols-[.9fr_1.1fr]">
            {base.stats.slice(2, 4).map((stat, index) => {
              const realIndex = index + 2;

              return (
                <div key={`${stat.value}-${index}`} className={cx("rounded-[2.2rem] p-7", index === 0 ? "bg-[#ffe3a8]" : "bg-[#eadcff]")}>
                  {index === 1 ? (
                    <div className="absolute right-5 top-5 h-20 w-20 animate-[VirelloSpin_16s_linear_infinite] rounded-full border-[12px] border-[#301b12]/15" />
                  ) : null}
                  <VisualText id={`stats.${realIndex}.value`} fallback={stat.value} as="p" className="text-7xl font-black tracking-[-.095em] text-[#301b12]" />
                  <VisualText id={`stats.${realIndex}.label`} fallback={stat.label} as="p" className="mt-2 font-black text-[#301b12]/60" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const { base } = useVirelloData();

  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1520px]">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <SectionKicker id="projects.kicker" fallback="פרויקטים" />

            <VisualText
              id="projects.title"
              fallback="אנחנו בונים\nמוצרים דיגיטליים מעולים"
              as="h2"
              className="whitespace-pre-line text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl"
            />
          </div>

          <button className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#301b12]/15 bg-white/70 px-6 py-4 text-sm font-black text-[#301b12]">
            <VisualText id="projects.button" fallback="כל הפרויקטים" />
            <ArrowRound />
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {base.projects.map((project, index) => (
            <article
              key={`${project.title}-${index}`}
              className={cx(
                "Virello-card-tilt group overflow-hidden rounded-[3rem] border border-[#301b12]/10 bg-white/75 p-4 shadow-[0_30px_90px_rgba(48,27,18,.10)] transition duration-500",
                index % 2 === 1 && "md:translate-y-16",
              )}
            >
              <div className="h-[390px] overflow-hidden rounded-[2.4rem] bg-[#eadcff]">
                <VisualMedia id={`projects.${index}.image`} fallbackSrc={project.image} className="h-full w-full object-cover transition duration-[900ms] group-hover:scale-110" />
              </div>

              <div className="flex items-end justify-between gap-5 p-5">
                <div>
                  <VisualText id={`projects.${index}.kind`} fallback={project.kind} as="p" className="mb-2 text-sm font-black text-[#301b12]/45" />
                  <VisualText id={`projects.${index}.title`} fallback={project.title} as="h3" className="text-3xl font-black leading-tight tracking-[-.06em] text-[#301b12]" />
                  <VisualText id={`projects.${index}.date`} fallback={project.date} as="p" className="mt-3 text-sm font-bold text-[#301b12]/45" />
                </div>

                <ArrowRound />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const { base } = useVirelloData();
  const repeated = [...base.testimonials, ...base.testimonials, ...base.testimonials];

  return (
    <section className="relative overflow-hidden bg-[#f5e9ff] py-20 lg:py-28">
      <div className="mx-auto max-w-[1520px] px-5 lg:px-8">
        <SectionKicker id="testimonials.kicker" fallback="לקוחות מספרים" />

        <VisualText
          id="testimonials.title"
          fallback="אל תסתמכו רק\nעל המילה שלנו"
          as="h2"
          className="mb-12 max-w-5xl whitespace-pre-line text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl"
        />
      </div>

      <div className="overflow-hidden">
        <div className="flex w-max gap-5 animate-[VirelloMarqueeReverse_34s_linear_infinite] hover:[animation-play-state:paused]">
          {repeated.map((item, index) => {
            const originalIndex = index % base.testimonials.length;

            return (
              <article key={`${item.name}-${index}`} className="w-[410px] shrink-0 rounded-[2.5rem] bg-white/80 p-7 shadow-[0_25px_75px_rgba(48,27,18,.10)]">
                <VisualText id={`testimonials.${originalIndex}.title`} fallback={item.title} as="p" className="text-4xl font-black tracking-[-.07em] text-[#301b12]" />
                <VisualText id={`testimonials.${originalIndex}.text`} fallback={item.text} as="p" className="mt-6 min-h-[120px] text-xl font-black leading-8 text-[#301b12]/72" />

                <div className="mt-8 flex items-center gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-full bg-[#301b12]">
                    <VisualMedia id={`testimonials.${originalIndex}.image`} fallbackSrc={item.image} className="h-full w-full object-cover grayscale" />
                  </div>

                  <div>
                    <VisualText id={`testimonials.${originalIndex}.name`} fallback={item.name} as="p" className="font-black text-[#301b12]" />
                    <VisualText id={`testimonials.${originalIndex}.role`} fallback={item.role} as="p" className="text-sm font-bold text-[#301b12]/45" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LogoMarquee() {
  const { base } = useVirelloData();

  return (
    <div className="mt-12 overflow-hidden py-6">
      <div className="flex w-max gap-14 animate-[VirelloMarquee_26s_linear_infinite]">
        {[...base.logos, ...base.logos, ...base.logos].map((logo, index) => {
          const originalIndex = index % base.logos.length;

          return (
            <VisualText
              key={`${logo}-${index}`}
              id={`logos.${originalIndex}`}
              fallback={logo}
              className="text-4xl font-black tracking-[-.08em] text-[#301b12]/40"
            />
          );
        })}
      </div>
    </div>
  );
}

function TeamSection() {
  const { base } = useVirelloData();

  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1520px]">
        <SectionKicker id="team.kicker" fallback="צוות" />

        <VisualText
          id="team.title"
          fallback="צוות קטן,\nאימפקט גדול"
          as="h2"
          className="mb-12 max-w-5xl whitespace-pre-line text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl"
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {base.team.map((member, index) => (
            <article
              key={`${member.name}-${index}`}
              className={cx(
                "group overflow-hidden rounded-[2.8rem] border border-[#301b12]/10 bg-white/75 p-4 shadow-[0_25px_80px_rgba(48,27,18,.09)] transition duration-500 hover:-translate-y-3",
                index % 2 === 1 && "xl:translate-y-12",
              )}
            >
              <div className="relative h-80 overflow-hidden rounded-[2.2rem] bg-[#ffe3a8]">
                <VisualMedia id={`team.${index}.image`} fallbackSrc={member.image} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />

                <div className="absolute left-4 top-4 flex gap-2 opacity-0 transition duration-300 group-hover:opacity-100">
                  {base.brand.socialLinks.map((social, socialIndex) => (
                    <VisualText
                      key={`${social}-${socialIndex}`}
                      id={`brand.socialLinks.${socialIndex}`}
                      fallback={social}
                      className="grid h-10 w-10 place-items-center rounded-full bg-white text-xs font-black text-[#301b12]"
                    />
                  ))}
                </div>
              </div>

              <div className="p-5">
                <VisualText id={`team.${index}.name`} fallback={member.name} as="h3" className="text-2xl font-black tracking-[-.06em] text-[#301b12]" />
                <VisualText id={`team.${index}.role`} fallback={member.role} as="p" className="mt-1 text-sm font-bold text-[#301b12]/50" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const { base } = useVirelloData();

  return (
    <section className="bg-[#fff1c6] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1520px]">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <SectionKicker id="pricing.kicker" fallback={base.pricing.kicker} />

            <VisualText
              id="pricing.title"
              fallback={base.pricing.title}
              as="h2"
              className="max-w-5xl text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl"
            />
          </div>

          <div className="flex w-fit rounded-full bg-white p-2">
            <VisualText id="pricing.monthlyLabel" fallback={base.pricing.monthlyLabel} className="rounded-full bg-[#301b12] px-6 py-3 text-sm font-black text-white" />
            <VisualText id="pricing.yearlyLabel" fallback={base.pricing.yearlyLabel} className="rounded-full px-6 py-3 text-sm font-black text-[#301b12]" />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          {base.pricing.plans.map((plan, index) => (
            <article
              key={`${plan.price}-${index}`}
              className={cx(
                "rounded-[2.8rem] p-7 shadow-[0_30px_85px_rgba(48,27,18,.12)] transition duration-500 hover:-translate-y-3",
                index === 1
                  ? "bg-[#301b12] text-white"
                  : index === 2
                    ? "bg-[#eadcff] text-[#301b12]"
                    : "bg-white text-[#301b12]",
              )}
            >
              <VisualText id={`pricing.plans.${index}.price`} fallback={plan.price} as="p" className="text-7xl font-black tracking-[-.1em]" />
              <VisualText id={`pricing.plans.${index}.saving`} fallback="חיסכון של כ־20% בתשלום שנתי" as="p" className="mt-2 text-sm font-black opacity-55" />
              <VisualText id={`pricing.plans.${index}.name`} fallback={plan.name} as="h3" className="mt-8 text-3xl font-black tracking-[-.06em]" />
              <VisualText id={`pricing.plans.${index}.description`} fallback={plan.description} as="p" className="mt-2 text-sm font-bold opacity-65" />

              <button className="mt-8 w-full rounded-full bg-[#ffe3a8] px-5 py-4 text-sm font-black text-[#301b12]">
                <VisualText id={`pricing.plans.${index}.button`} fallback="התחלת ניסיון" />
              </button>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={`${feature}-${featureIndex}`} className="flex items-center gap-3 text-sm font-black">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-white/60 text-[#301b12]">✓</span>
                    <VisualText id={`pricing.plans.${index}.features.${featureIndex}`} fallback={feature} />
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const { base } = useVirelloData();

  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1520px]">
        <SectionKicker id="process.kicker" fallback="תהליך" />

        <VisualText
          id="process.title"
          fallback="כך אנחנו הופכים רעיון למוצר דיגיטלי"
          as="h2"
          className="mb-12 max-w-5xl text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl"
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {base.process.map((step, index) => (
            <article key={`${step.number}-${index}`} className="group relative min-h-[360px] overflow-hidden rounded-[2.8rem] border border-[#301b12]/10 bg-white/75 p-7 shadow-[0_25px_80px_rgba(48,27,18,.09)] transition duration-500 hover:-translate-y-3 hover:bg-[#301b12] hover:text-white">
              <VisualText id={`process.${index}.number`} fallback={step.number} as="p" className="absolute right-6 top-4 text-[7rem] font-black leading-none tracking-[-.12em] text-[#301b12]/10 transition group-hover:text-white/10" />
              <VisualText id={`process.${index}.icon`} fallback={step.icon} className="relative z-10 mb-16 grid h-20 w-20 place-items-center rounded-[1.8rem] bg-[#ffe3a8] text-4xl text-[#301b12] transition group-hover:rotate-12" />
              <VisualText id={`process.${index}.label`} fallback={step.label} as="p" className="relative z-10 text-sm font-black opacity-55" />
              <VisualText id={`process.${index}.title`} fallback={step.title} as="h3" className="relative z-10 mt-4 text-3xl font-black leading-tight tracking-[-.06em]" />
              <VisualText id={`process.${index}.timeline`} fallback={step.timeline} as="p" className="relative z-10 mt-8 rounded-full bg-[#301b12]/8 px-4 py-3 text-sm font-black text-[#301b12]/70 group-hover:bg-white/10 group-hover:text-white/65" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const { base } = useVirelloData();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#f8e6ef] px-5 py-20 lg:px-8 lg:py-28">
      <DotPattern className="left-6 bottom-8 h-52 w-52" />

      <div className="mx-auto grid max-w-[1520px] gap-8 lg:grid-cols-[.85fr_1.15fr]">
        <div>
          <SectionKicker id="faq.kicker" fallback="שאלות נפוצות" />

          <VisualText
            id="faq.title"
            fallback="שאלו אותנו,\nאנחנו כאן לעזור"
            as="h2"
            className="whitespace-pre-line text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl"
          />
        </div>

        <div className="space-y-3">
          {base.faq.map((faq, index) => (
            <article key={`${faq.question}-${index}`} className="overflow-hidden rounded-[2rem] bg-white/82 shadow-[0_18px_55px_rgba(48,27,18,.08)]">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="flex w-full items-center justify-between gap-5 p-6 text-right text-xl font-black tracking-[-.03em] text-[#301b12]"
              >
                <VisualText id={`faq.${index}.question`} fallback={faq.question} />
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#301b12] text-white">{openIndex === index ? "−" : "+"}</span>
              </button>

              {openIndex === index && (
                <VisualText id={`faq.${index}.answer`} fallback={faq.answer} as="p" className="px-6 pb-6 text-base font-bold leading-8 text-[#301b12]/62" />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection({ onNavigate }: { onNavigate: (page: VirelloPageId) => void }) {
  const { base } = useVirelloData();

  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1520px]">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionKicker id="blog.kicker" fallback="הבלוג שלנו" />

            <VisualText
              id="blog.titleBlock"
              fallback="טיפים מודרניים\nלצמיחה דיגיטלית"
              as="h2"
              className="max-w-5xl whitespace-pre-line text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl"
            />
          </div>

          <button type="button" onClick={() => onNavigate("blog")} className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#301b12] px-6 py-4 text-sm font-black text-white">
            <VisualText id="blog.button" fallback="כל המאמרים" />
            <ArrowRound dark={false} />
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {base.blog.map((post, index) => (
            <article key={`${post.title}-${index}`} className={cx("group overflow-hidden rounded-[2.8rem] border border-[#301b12]/10 bg-white/75 p-4 shadow-[0_25px_80px_rgba(48,27,18,.09)] transition duration-500 hover:-translate-y-3", index === 1 && "lg:translate-y-10")}>
              <div className="h-72 overflow-hidden rounded-[2.2rem]">
                <VisualMedia id={`blog.${index}.image`} fallbackSrc={post.image} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              </div>

              <div className="p-5">
                <div className="mb-4 flex items-center justify-between text-xs font-black text-[#301b12]/45">
                  <VisualText id={`blog.${index}.author`} fallback={post.author} />
                  <VisualText id={`blog.${index}.date`} fallback={post.date} />
                </div>

                <VisualText id={`blog.${index}.title`} fallback={post.title} as="h3" className="text-2xl font-black leading-tight tracking-[-.06em] text-[#301b12]" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCta({ onNavigate }: { onNavigate: (page: VirelloPageId) => void }) {
  const { base } = useVirelloData();

  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1520px] overflow-hidden rounded-[3.2rem] bg-[#301b12] p-8 text-white shadow-[0_35px_100px_rgba(48,27,18,.18)] md:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <VisualText id="contact.ctaTitle" fallback={base.contact.ctaTitle} as="h2" className="text-6xl font-black leading-[.86] tracking-[-.085em] md:text-8xl" />

          <div>
            <VisualText id="contact.ctaDescription" fallback={base.contact.ctaDescription} as="p" className="mb-7 text-lg font-bold leading-8 text-white/62" />

            <button type="button" onClick={() => onNavigate("contact")} className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black text-[#301b12]">
              <VisualText id="contact.ctaButton" fallback={base.contact.ctaButton} />
              <ArrowRound />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ onNavigate }: { onNavigate: (page: VirelloPageId) => void }) {
  const { base } = useVirelloData();

  return (
    <footer className="border-t border-[#301b12]/10 px-5 py-12 lg:px-8">
      <div className="mx-auto grid max-w-[1520px] gap-8 lg:grid-cols-[1fr_.8fr_1.2fr]">
        <div>
          <button type="button" onClick={() => onNavigate("home")} className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#301b12] text-xl font-black text-white">v</span>
            <VisualText id="brand.name" fallback={base.brand.name} className="text-3xl font-black tracking-[-.08em] text-[#301b12]" />
          </button>

          <VisualText id="brand.address" fallback={base.brand.address} as="p" className="mt-5 max-w-sm text-sm font-bold leading-7 text-[#301b12]/55" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {base.nav.map((item, index) => (
            <button key={item.id} type="button" onClick={() => onNavigate(item.id as VirelloPageId)} className="w-fit text-sm font-black text-[#301b12]/55 hover:text-[#301b12]">
              <VisualText id={`nav.${index}.number`} fallback={`(${item.number})`} /> <VisualText id={`nav.${index}.label`} fallback={item.label} />
            </button>
          ))}
        </div>

        <form onSubmit={(event) => event.preventDefault()} className="rounded-[2rem] bg-white/70 p-5 shadow-sm">
          <VisualText id="footer.newsletterLabel" fallback="הצטרפו לעדכונים" as="label" className="mb-3 block text-sm font-black text-[#301b12]" />

          <div className="flex gap-2">
            <input type="email" placeholder="כתובת אימייל" className="min-w-0 flex-1 rounded-full border border-[#301b12]/10 bg-white px-4 py-3 text-sm font-bold text-[#301b12] outline-none focus:border-[#301b12]" />

            <button className="rounded-full bg-[#301b12] px-5 py-3 text-sm font-black text-white">
              <VisualText id="footer.newsletterButton" fallback="הצטרפות" />
            </button>
          </div>
        </form>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1520px] flex-col justify-between gap-4 border-t border-[#301b12]/10 pt-6 text-sm font-bold text-[#301b12]/45 md:flex-row">
        <VisualText id="footer.copyright" fallback={`© 2026 ${base.brand.name}. כל הזכויות שמורות`} as="p" />

        <div className="flex gap-4">
          {base.brand.socialLinks.map((item, index) => (
            <VisualText key={`${item}-${index}`} id={`brand.socialLinks.${index}`} fallback={item} />
          ))}
        </div>
      </div>
    </footer>
  );
}

function HomePage({ onNavigate }: { onNavigate: (page: VirelloPageId) => void }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <ServicesMarquee />
      <AboutSection onNavigate={onNavigate} />
      <WhyUs />
      <ProjectsSection />
      <Testimonials />
      <LogoMarquee />
      <TeamSection />
      <PricingSection />
      <ProcessSection />
      <FaqSection />
      <BlogSection onNavigate={onNavigate} />
      <ContactCta onNavigate={onNavigate} />
    </>
  );
}

function AboutPage({ onNavigate }: { onNavigate: (page: VirelloPageId) => void }) {
  return (
    <>
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1520px]">
          <SectionKicker id="about.pageKicker" fallback="אודות Virello" />

          <VisualText
            id="about.pageTitle"
            fallback="סטודיו דיגיטלי עם אסטרטגיה חדה וכיוון קריאייטיבי ברור"
            as="h1"
            className="max-w-6xl text-7xl font-black leading-[.82] tracking-[-.09em] text-[#301b12] md:text-9xl"
          />
        </div>
      </section>

      <AboutSection onNavigate={onNavigate} />
      <WhyUs />
      <TeamSection />
      <ContactCta onNavigate={onNavigate} />
    </>
  );
}

function ProjectPage({ onNavigate }: { onNavigate: (page: VirelloPageId) => void }) {
  return (
    <>
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1520px]">
          <SectionKicker id="project.pageKicker" fallback="פרויקטים" />

          <VisualText
            id="project.pageTitle"
            fallback="עבודות נבחרות למותגים שרוצים לגדול"
            as="h1"
            className="max-w-6xl text-7xl font-black leading-[.82] tracking-[-.09em] text-[#301b12] md:text-9xl"
          />
        </div>
      </section>

      <ProjectsSection />
      <Testimonials />
      <ContactCta onNavigate={onNavigate} />
    </>
  );
}

function BlogPage({ onNavigate }: { onNavigate: (page: VirelloPageId) => void }) {
  return (
    <>
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1520px]">
          <SectionKicker id="blog.pageKicker" fallback="בלוג" />

          <VisualText
            id="blog.pageTitle"
            fallback="רעיונות, טרנדים ואסטרטגיה למותגים דיגיטליים"
            as="h1"
            className="max-w-6xl text-7xl font-black leading-[.82] tracking-[-.09em] text-[#301b12] md:text-9xl"
          />
        </div>
      </section>

      <BlogSection onNavigate={onNavigate} />
      <FaqSection />
      <ContactCta onNavigate={onNavigate} />
    </>
  );
}

function ContactPage() {
  const { base } = useVirelloData();

  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1520px] gap-8 lg:grid-cols-[.95fr_1.05fr]">
        <div>
          <SectionKicker id="contact.kicker" fallback={base.contact.kicker} />

          <VisualText
            id="contact.title"
            fallback={base.contact.title}
            as="h1"
            className="text-7xl font-black leading-[.82] tracking-[-.09em] text-[#301b12] md:text-9xl"
          />

          <VisualText id="contact.description" fallback={base.contact.description} as="p" className="mt-8 max-w-xl text-xl font-bold leading-9 text-[#301b12]/62" />
        </div>

        <form onSubmit={(event) => event.preventDefault()} className="rounded-[3rem] border border-[#301b12]/10 bg-white/80 p-6 shadow-[0_25px_80px_rgba(48,27,18,.09)] md:p-10">
          <div className="grid gap-4 md:grid-cols-2">
            <input placeholder="שם מלא" className="rounded-full border border-[#301b12]/10 bg-[#fff8f0] px-5 py-4 text-sm font-bold outline-none" />
            <input placeholder="טלפון" className="rounded-full border border-[#301b12]/10 bg-[#fff8f0] px-5 py-4 text-sm font-bold outline-none" />
          </div>

          <input placeholder="אימייל" className="mt-4 w-full rounded-full border border-[#301b12]/10 bg-[#fff8f0] px-5 py-4 text-sm font-bold outline-none" />
          <textarea placeholder="ספרו לנו על הפרויקט" className="mt-4 min-h-[180px] w-full rounded-[2rem] border border-[#301b12]/10 bg-[#fff8f0] p-5 text-sm font-bold outline-none" />

          <button className="mt-4 w-full rounded-full bg-[#301b12] px-6 py-5 text-sm font-black text-white">
            <VisualText id="contact.button" fallback={base.contact.button} />
          </button>
        </form>
      </div>
    </section>
  );
}

function resolveInitialPage(props: VirelloPagesProps): VirelloPageId {
  const value = props.activePageId || props.pageId || props.currentPageId || props.initialPageId || props.initialPage || "home";

  if (["home", "about", "project", "blog", "contact"].includes(value)) {
    return value as VirelloPageId;
  }

  return "home";
}

export default function VirelloPages(props: VirelloPagesProps) {
  const initialResolvedPage = useMemo(() => resolveInitialPage(props), [props.activePageId, props.pageId, props.currentPageId, props.initialPageId, props.initialPage]);
  const [internalPage, setInternalPage] = useState<VirelloPageId>(initialResolvedPage);

  const activePage = props.activePageId || props.pageId || props.currentPageId || internalPage;

  const contextValue = useMemo<VirelloDataContextValue>(
    () => ({
      data: props.data || {},
      base: virelloDefaultData,
    }),
    [props.data],
  );

  const handleNavigate = (page: VirelloPageId) => {
    setInternalPage(page);
  };

  return (
    <VirelloDataContext.Provider value={contextValue}>
      <main
        data-template-id="virello"
        data-visual-template="virello"
        data-active-page-id={activePage}
        dir="rtl"
        className="min-h-screen overflow-hidden bg-[#fff8f0] text-[#301b12]"
      >
        <VirelloEffects />
        <Header activePage={activePage as VirelloPageId} onNavigate={handleNavigate} />

        <VisualPageStack
          activePageId={activePage}
          pages={[
            { id: "home", content: <HomePage onNavigate={handleNavigate} /> },
            { id: "about", content: <AboutPage onNavigate={handleNavigate} /> },
            {
              id: "project",
              content: <ProjectPage onNavigate={handleNavigate} />,
            },
            { id: "blog", content: <BlogPage onNavigate={handleNavigate} /> },
            { id: "contact", content: <ContactPage /> },
          ]}
        />

        <Footer onNavigate={handleNavigate} />
      </main>
    </VirelloDataContext.Provider>
  );
}
