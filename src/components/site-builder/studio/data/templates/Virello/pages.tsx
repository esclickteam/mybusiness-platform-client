import React, { useMemo, useState } from "react";

export type VirelloPageId = "home" | "about" | "project" | "blog" | "contact";

export type VirelloPagesProps = {
  initialPage?: VirelloPageId;
  activePageId?: VirelloPageId;
  mode?: "preview" | "editor" | "public";
  data?: Record<string, any>;
  businessId?: string;
};

type NavItem = {
  id: VirelloPageId;
  label: string;
  number: string;
};

type ProjectItem = {
  kind: string;
  title: string;
  date: string;
  image: string;
};

const navItems: NavItem[] = [
  { id: "home", label: "בית", number: "01" },
  { id: "about", label: "אודות", number: "02" },
  { id: "project", label: "פרויקטים", number: "03" },
  { id: "blog", label: "בלוג", number: "04" },
  { id: "contact", label: "צור קשר", number: "05" },
];

const heroCards = [
  {
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=760&q=85",
    className:
      "left-[1%] top-[13%] h-[210px] w-[160px] rotate-[-10deg] animate-[VirelloFloatA_8s_ease-in-out_infinite]",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=760&q=85",
    className:
      "left-[25%] top-[2%] h-[250px] w-[190px] rotate-[7deg] animate-[VirelloFloatB_9s_ease-in-out_infinite]",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=760&q=85",
    className:
      "right-[22%] top-[16%] h-[225px] w-[170px] rotate-[-6deg] animate-[VirelloFloatC_10s_ease-in-out_infinite]",
  },
  {
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=760&q=85",
    className:
      "right-[1%] top-[4%] h-[260px] w-[190px] rotate-[11deg] animate-[VirelloFloatA_8.5s_ease-in-out_infinite]",
  },
  {
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=760&q=85",
    className:
      "left-[44%] bottom-[2%] h-[205px] w-[280px] rotate-[3deg] animate-[VirelloFloatB_9.5s_ease-in-out_infinite]",
  },
];

const services = [
  ["01", "חוויית משתמש", "✦"],
  ["02", "עיצוב אתרים", "◌"],
  ["03", "פיתוח", "▰"],
  ["04", "קידום ושיווק", "◇"],
];

const projects: ProjectItem[] = [
  {
    kind: "מיתוג",
    title: "לויה — עיצוב מותג",
    date: "11 ספטמבר, 2026",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85",
  },
  {
    kind: "אפליקציה",
    title: "Ausi — אפליקציה מיתוג עיצוב",
    date: "09 אוגוסט, 2026",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    kind: "פרינט",
    title: "Gio — Billboard מיתוג",
    date: "27 פברואר, 2026",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85",
  },
  {
    kind: "מיתוג",
    title: "Fiona — Product מיתוג",
    date: "09 ינואר, 2026",
    image:
      "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=85",
  },
];

const testimonials = [
  {
    title: "מעולה!",
    text: "הצוות סיפק תוצאה חדה, מקצועית ומרשימה עם חוויית משתמש ברמה גבוהה.",
    name: "גיל אברמי",
  },
  {
    title: "מצוין!",
    text: "שותף מקצועי שמבין עיצוב, אסטרטגיה ותוצאות עסקיות אמיתיות.",
    name: "רומי לוין",
  },
  {
    title: "עבודה מדהימה!",
    text: "שינוי משמעותי לעסק. הכול הפך ברור יותר, מהיר יותר ומדויק יותר.",
    name: "דניאל מזרחי",
  },
];

const team = [
  {
    name: "יונתן כהן",
    role: "מפתח",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "מאור לוי",
    role: "מעצב",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "נועה ישראלי",
    role: "מנהלת פרויקטים",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "איתי ברק",
    role: "מפתח",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85",
  },
];

const blogPosts = [
  {
    title: "איך לבנות מותג עסקי חכם ומהיר יותר עם Virello",
    author: "מיה ספיר",
    date: "16 פברואר, 2026",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "The Art and Strategy Behind Modern Digital מיתוג",
    author: "אורן שלו",
    date: "27 פברואר, 2026",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "איך עסקים מובילים צמיחה בעידן דיגיטלי",
    author: "מיכאל בראון",
    date: "15 מרץ, 2026",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=85",
  },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}


const VISUAL_CONTENT_KEY = "__content";

const VirelloDataContext = React.createContext<Record<string, any>>({});

function useVirelloData() {
  return React.useContext(VirelloDataContext) || {};
}

function readPath(source: Record<string, any>, path: string) {
  if (!source || !path) return undefined;

  return path.split(".").reduce<any>((cursor, key) => {
    if (cursor === undefined || cursor === null) return undefined;

    if (Array.isArray(cursor) && /^\d+$/.test(key)) {
      return cursor[Number(key)];
    }

    return cursor?.[key];
  }, source);
}

function readVisualItem(data: Record<string, any>, elementId: string) {
  const content =
    data?.[VISUAL_CONTENT_KEY] &&
    typeof data[VISUAL_CONTENT_KEY] === "object" &&
    !Array.isArray(data[VISUAL_CONTENT_KEY])
      ? data[VISUAL_CONTENT_KEY]
      : {};

  const contentItem = content[elementId];

  if (contentItem && typeof contentItem === "object" && !Array.isArray(contentItem)) {
    return contentItem as Record<string, any>;
  }

  if (typeof contentItem === "string") {
    return { text: contentItem, src: contentItem };
  }

  const nestedValue = readPath(data, elementId);

  if (nestedValue && typeof nestedValue === "object" && !Array.isArray(nestedValue)) {
    return nestedValue as Record<string, any>;
  }

  if (typeof nestedValue === "string") {
    return { text: nestedValue, src: nestedValue };
  }

  return {};
}

function visualText(data: Record<string, any>, elementId: string, fallback: string) {
  const item = readVisualItem(data, elementId);
  return String(item.text ?? item.value ?? readPath(data, elementId) ?? fallback ?? "");
}

function visualMedia(data: Record<string, any>, elementId: string, fallbackSrc: string) {
  const item = readVisualItem(data, elementId);
  const src = String(item.src || item.secureUrl || item.url || item.originalUrl || fallbackSrc || "");
  const mediaType = String(item.mediaType || item.resourceType || "").toLowerCase();

  return {
    src,
    alt: String(item.alt || item.originalName || ""),
    mediaType: mediaType || (src.includes("/video/upload/") ? "video" : "image"),
  };
}

function VisualText({
  id,
  fallback,
  as: Tag = "span",
  className = "",
}: {
  id: string;
  fallback: string;
  as?: React.ElementType;
  className?: string;
}) {
  const data = useVirelloData();
  const text = visualText(data, id, fallback);
  const TextTag = Tag as React.ElementType;

  return (
    <TextTag
      data-visual-edit-id={id}
      data-visual-edit-type="text"
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
  className = "",
  alt = "",
}: {
  id: string;
  fallbackSrc: string;
  className?: string;
  alt?: string;
}) {
  const data = useVirelloData();
  const media = visualMedia(data, id, fallbackSrc);

  if (media.mediaType === "video") {
    return (
      <video
        data-visual-edit-id={id}
        data-visual-edit-type="image"
        data-visual-media-type="video"
        src={media.src}
        className={className}
        muted
        playsInline
        autoPlay
        loop
      />
    );
  }

  return (
    <img
      data-visual-edit-id={id}
      data-visual-edit-type="image"
      data-visual-media-type="image"
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

        @keyframes VirelloSpin {
          to { transform: rotate(360deg); }
        }

        @keyframes VirelloPulseBlob {
          0%, 100% { transform: scale(1); opacity: .65; }
          50% { transform: scale(1.18); opacity: .95; }
        }

        @keyframes VirelloRevealUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .Virello-reveal {
          animation: VirelloRevealUp .8s cubic-bezier(.22, 1, .36, 1) both;
        }

        .Virello-card-tilt {
          transform-style: preserve-3d;
        }

        .Virello-card-tilt:hover {
          transform: translateY(-10px) rotate(-1.5deg);
        }
      `}
    </style>
  );
}

function DotPattern({ className = "" }: { className?: string }) {
  return (
    <div
      className={cx(
        "pointer-events-none absolute opacity-30",
        className,
      )}
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(48,27,18,.5) 1.4px, transparent 1.4px)",
        backgroundSize: "18px 18px",
      }}
    />
  );
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#301b12]/15 bg-white/70 px-4 py-2 text-sm font-black text-[#301b12] shadow-sm">
      <span className="h-2 w-2 rounded-full bg-[#ff9fbc]" />
      {children}
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
  return (
    <header className="sticky top-0 z-50 border-b border-[#301b12]/10 bg-[#fff8f0]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1520px] items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="group flex items-center gap-3"
        >
          <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-[#301b12] text-lg font-black text-white">
            <span className="absolute inset-0 animate-[VirelloSpin_10s_linear_infinite] rounded-full border border-dashed border-white/35" />
            v
          </span>

          <span className="text-2xl font-black tracking-[-0.08em] text-[#301b12]">
            Virello
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
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
              <span className="mr-2 text-xs opacity-55">({item.number})</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          {["FB /", "X /", "IN"].map((item) => (
            <span
              key={item}
              className="text-sm font-black text-[#301b12]/55 transition hover:text-[#301b12]"
            >
              {item}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onNavigate("contact")}
          className="rounded-full bg-[#301b12] px-5 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(48,27,18,.22)] transition hover:-translate-y-1"
        >
          מתחילים עכשיו
        </button>
      </div>
    </header>
  );
}

function Hero({ onNavigate }: { onNavigate: (page: VirelloPageId) => void }) {
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
              <span className="rounded-full border border-[#301b12]/15 bg-white/70 px-4 py-2 text-sm font-black text-[#301b12]">
                [ תל אביב, ישראל ]
              </span>

              <span className="rounded-full bg-[#ffe3a8] px-4 py-2 text-sm font-black text-[#301b12]">
                מיתוג
              </span>

              <span className="rounded-full bg-[#eadcff] px-4 py-2 text-sm font-black text-[#301b12]">
                אנימציה
              </span>
            </div>

            <h1 className="text-[26vw] font-black leading-[0.68] tracking-[-0.14em] text-[#301b12] sm:text-[20vw] lg:text-[12.5vw]">
              Virello
            </h1>

            <div className="mt-7 max-w-2xl">
              <h2 className="text-3xl font-black leading-[0.98] tracking-[-0.06em] text-[#301b12] sm:text-5xl">
                אנחנו בונים מותגים, אתרים וחוויות דיגיטליות שמזיזות עסקים קדימה
              </h2>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => onNavigate("contact")}
                  className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#301b12] px-6 py-4 text-sm font-black text-white shadow-[0_20px_50px_rgba(48,27,18,.22)] transition hover:-translate-y-1"
                >
                  מתחילים עכשיו
                  <ArrowRound dark={false} />
                </button>

                <div className="flex gap-4 text-sm font-black text-[#301b12]/45">
                  <span>FB /</span>
                  <span>X /</span>
                  <span>IN /</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[520px] lg:h-[620px]">
            <div className="absolute left-[14%] bottom-[4%] z-10 grid h-28 w-28 place-items-center rounded-full bg-[#301b12] text-center text-sm font-black leading-tight text-white shadow-[0_30px_70px_rgba(48,27,18,.3)]">

              1.2k
              <br />
              פרויקטים
            </div>

            <div className="absolute right-[18%] top-[40%] h-24 w-24 animate-[VirelloSpin_14s_linear_infinite] rounded-[30px] border-[14px] border-[#ffe3a8]" />

            <div className="absolute bottom-20 right-[3%] rounded-full bg-[#fff8f0] px-5 py-3 text-sm font-black text-[#301b12] shadow-[0_18px_50px_rgba(48,27,18,.16)]">
              סטודיו דיגיטלי
            </div>

            {heroCards.map((card, index) => (
              <div
                key={card.image}
                className={cx(
                  "group absolute overflow-hidden rounded-[2rem] border-[8px] border-[#fff8f0] bg-white shadow-[0_35px_90px_rgba(48,27,18,.22)] transition duration-500 hover:z-30 hover:scale-105",
                  card.className,
                )}
                style={
                  {
                    "--r":
                      index === 0
                        ? "-10deg"
                        : index === 1
                          ? "7deg"
                          : index === 2
                            ? "-6deg"
                            : index === 3
                              ? "11deg"
                              : "3deg",
                  } as React.CSSProperties
                }
              >
                <VisualMedia
                  id={`hero.images.${index}`}
                  fallbackSrc={card.image}
                  alt=""
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
  const repeated = [...services, ...services, ...services, ...services];

  return (
    <section className="overflow-hidden py-10">
      <div className="mx-auto max-w-[1520px] px-5 lg:px-8">
        <div className="mb-8 grid gap-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <SectionKicker>שירותים</SectionKicker>
            <h2 className="max-w-3xl text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl">
              אנחנו בונים. המותגים שלכם עפים.
            </h2>
          </div>

          <p className="max-w-lg text-lg font-bold leading-8 text-[#301b12]/60">
            שירותי אסטרטגיה, עיצוב, פיתוח ושיווק שמתחברים למותג אחד ברור, מהיר ומרשים.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden py-5">
        <div className="flex w-max gap-4 animate-[VirelloMarquee_30s_linear_infinite] hover:[animation-play-state:paused]">
          {repeated.map(([number, title, icon], index) => (
            <article
              key={`${title}-${index}`}
              className="group flex h-[170px] w-[330px] shrink-0 items-center justify-between rounded-[2rem] border border-[#301b12]/10 bg-[#fff8f0] p-6 shadow-[0_18px_50px_rgba(48,27,18,.08)] transition hover:-translate-y-2 hover:bg-[#301b12] hover:text-white"
            >
              <div>
                <p className="mb-7 text-sm font-black opacity-50">[{number}]</p>
                <h3 className="text-3xl font-black tracking-[-.06em]">
                  {title}
                </h3>
              </div>

              <span className="grid h-20 w-20 place-items-center rounded-[1.6rem] bg-[#ffe3a8] text-4xl text-[#301b12] transition duration-300 group-hover:rotate-12 group-hover:scale-110">
                {icon}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection({ onNavigate }: { onNavigate: (page: VirelloPageId) => void }) {
  return (
    <section className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
      <div className="absolute left-0 top-0 h-20 w-full bg-gradient-to-r from-[#fbd3df] via-[#f4e6ff] to-[#fff8f0]" />

      <div className="mx-auto grid max-w-[1520px] gap-6 pt-16 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#ffd4e2] via-[#f2e4ff] to-[#ffe3a8] p-6 shadow-[0_30px_90px_rgba(48,27,18,.12)]">
          <DotPattern className="right-8 top-8 h-40 w-40" />

          <div className="relative z-10 flex min-h-[540px] flex-col justify-between rounded-[2.4rem] bg-[#301b12] p-6 text-white">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black">
                קריאייטיב
              </span>

              <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#301b12]">
                ↗
              </span>
            </div>

            <div className="overflow-hidden rounded-[2rem]">
              <VisualMedia
                id="about.image"
                fallbackSrc="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1300&q=85"
                alt=""
                className="h-[340px] w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
          </div>

          <div className="absolute bottom-8 left-8 grid h-32 w-32 place-items-center rounded-full bg-[#fff8f0] text-center text-[#301b12] shadow-[0_20px_60px_rgba(48,27,18,.18)]">
            <div>
              <p className="text-6xl font-black tracking-[-.09em]">07</p>
              <p className="text-xs font-black uppercase leading-tight">
                שנות
                <br />
                ניסיון
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[3rem] bg-[#301b12] p-7 text-white md:p-10">
          <div>
            <SectionKicker>אודות</SectionKicker>

            <h2 className="max-w-4xl text-5xl font-black leading-[.93] tracking-[-.075em] md:text-7xl">
              ב־Virello אנחנו יוצרים פתרונות דיגיטליים שמחברים מותגים לקהל, לצמיחה ולהובלה
            </h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
              <p className="text-6xl font-black tracking-[-.08em]">4.9</p>
              <p className="mt-2 text-sm font-bold text-white/60">
                1.3k+ דירוגים ממוצעים
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
              <p className="text-6xl font-black tracking-[-.08em]">1.2k</p>
              <p className="mt-2 text-sm font-bold text-white/60">
                פרויקטים שהושלמו
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("about")}
            className="group mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black text-[#301b12]"
          >
            עוד עלינו
            <ArrowRound />
          </button>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const bars = [
    ["עיצוב", "92%"],
    ["פיתוח", "58%"],
    ["שיווק", "83%"],
    ["מיתוג", "87%"],
  ];

  return (
    <section className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1520px] gap-8 lg:grid-cols-[.78fr_1.22fr]">
        <div>
          <SectionKicker>למה אנחנו</SectionKicker>

          <h2 className="text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl">
            למה Virello נכון לעסק שלכם
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-[3rem] border border-[#301b12]/10 bg-white/75 p-7 shadow-[0_30px_90px_rgba(48,27,18,.08)] md:p-10">
          <DotPattern className="right-[-20px] top-[-20px] h-44 w-44" />

          <div className="relative z-10 space-y-6">
            {bars.map(([label, value]) => (
              <div key={label}>
                <div className="mb-3 flex items-center justify-between text-sm font-black text-[#301b12]">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>

                <div className="h-5 overflow-hidden rounded-full bg-[#301b12]/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#301b12] via-[#ff9fbc] to-[#ffe3a8] shadow-[0_0_30px_rgba(255,159,188,.45)]"
                    style={{ width: value }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-10 grid gap-4 md:grid-cols-[.9fr_1.1fr]">
            <div className="rounded-[2.2rem] bg-[#ffe3a8] p-7">
              <p className="text-7xl font-black tracking-[-.095em] text-[#301b12]">
                73k
              </p>
              <p className="mt-2 font-black text-[#301b12]/60">
                פרויקטים שהושלמו
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[2.2rem] bg-[#eadcff] p-7">
              <div className="absolute right-5 top-5 h-20 w-20 animate-[VirelloSpin_16s_linear_infinite] rounded-full border-[12px] border-[#301b12]/15" />
              <p className="text-7xl font-black tracking-[-.095em] text-[#301b12]">
                120
              </p>
              <p className="mt-2 font-black text-[#301b12]/60">מומחים</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1520px]">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <SectionKicker>פרויקטים</SectionKicker>

            <h2 className="text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl">
              אנחנו בונים
              <br />
              מוצרים דיגיטליים מעולים
            </h2>
          </div>

          <button className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#301b12]/15 bg-white/70 px-6 py-4 text-sm font-black text-[#301b12]">
            כל הפרויקטים
            <ArrowRound />
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className={cx(
                "Virello-card-tilt group overflow-hidden rounded-[3rem] border border-[#301b12]/10 bg-white/75 p-4 shadow-[0_30px_90px_rgba(48,27,18,.10)] transition duration-500",
                index % 2 === 1 && "md:translate-y-16",
              )}
            >
              <div className="h-[390px] overflow-hidden rounded-[2.4rem] bg-[#eadcff]">
                <VisualMedia
                  id={`projects.${index}.image`}
                  fallbackSrc={project.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-[900ms] group-hover:scale-110"
                />
              </div>

              <div className="flex items-end justify-between gap-5 p-5">
                <div>
                  <p className="mb-2 text-sm font-black text-[#301b12]/45">
                    {project.kind}
                  </p>

                  <h3 className="text-3xl font-black leading-tight tracking-[-.06em] text-[#301b12]">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-sm font-bold text-[#301b12]/45">
                    {project.date}
                  </p>
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
  const repeated = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="relative overflow-hidden bg-[#f5e9ff] py-20 lg:py-28">
      <div className="mx-auto max-w-[1520px] px-5 lg:px-8">
        <SectionKicker>לקוחות מספרים</SectionKicker>

        <h2 className="mb-12 max-w-5xl text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl">
          אל תסתמכו רק
          <br />
          על המילה שלנו
        </h2>
      </div>

      <div className="overflow-hidden">
        <div className="flex w-max gap-5 animate-[VirelloMarqueeReverse_34s_linear_infinite] hover:[animation-play-state:paused]">
          {repeated.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className="w-[410px] shrink-0 rounded-[2.5rem] bg-white/80 p-7 shadow-[0_25px_75px_rgba(48,27,18,.10)]"
            >
              <p className="text-4xl font-black tracking-[-.07em] text-[#301b12]">
                {item.title}
              </p>

              <p className="mt-6 min-h-[120px] text-xl font-black leading-8 text-[#301b12]/72">
                “{item.text}”
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="h-14 w-14 overflow-hidden rounded-full bg-[#301b12]">
                  <VisualMedia
                    id={`testimonials.${index % testimonials.length}.image`}
                    fallbackSrc="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=85"
                    alt=""
                    className="h-full w-full object-cover grayscale"
                  />
                </div>

                <div>
                  <p className="font-black text-[#301b12]">{item.name}</p>
                  <p className="text-sm font-bold text-[#301b12]/45">מנכ״ל</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

    </section>
  );
}

function LogoMarquee() {
  const logos = ["LOGO", "NOVA", "VIRELLO", "BRAND", "FLOW", "PIXEL", "MOTION"];

  return (
    <div className="mt-12 overflow-hidden py-6">
      <div className="flex w-max gap-14 animate-[VirelloMarquee_26s_linear_infinite]">
        {[...logos, ...logos, ...logos].map((logo, index) => (
          <span
            key={`${logo}-${index}`}
            className="text-4xl font-black tracking-[-.08em] text-[#301b12]/40"
          >
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}

function TeamSection() {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1520px]">
        <SectionKicker>צוות</SectionKicker>

        <h2 className="mb-12 max-w-5xl text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl">
          צוות קטן,
          <br />
          אימפקט גדול
        </h2>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {team.map((member, index) => (
            <article
              key={member.name}
              className={cx(
                "group overflow-hidden rounded-[2.8rem] border border-[#301b12]/10 bg-white/75 p-4 shadow-[0_25px_80px_rgba(48,27,18,.09)] transition duration-500 hover:-translate-y-3",
                index % 2 === 1 && "xl:translate-y-12",
              )}
            >
              <div className="relative h-80 overflow-hidden rounded-[2.2rem] bg-[#ffe3a8]">
                <VisualMedia
                  id={`team.${index}.image`}
                  fallbackSrc={member.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute left-4 top-4 flex gap-2 opacity-0 transition duration-300 group-hover:opacity-100">
                  {["fb", "in", "x"].map((social) => (
                    <span
                      key={social}
                      className="grid h-10 w-10 place-items-center rounded-full bg-white text-xs font-black text-[#301b12]"
                    >
                      {social}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-2xl font-black tracking-[-.06em] text-[#301b12]">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-bold text-[#301b12]/50">
                  {member.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    ["₪299", "בסיסי", "מתאים לעסק בתחילת הדרך", ["עיצוב אתר", "פיתוח צד לקוח", "פיתוח אפליקציה"]],
    ["₪699", "צמיחה", "מתאים לצוותים ועסקים בצמיחה", ["עיצוב אתר", "פיתוח צד לקוח", "פיתוח אפליקציה", "פיתוח מתקדם", "AI לעסק"]],
    ["₪1,200", "פרימיום", "מתאים לעסק בתחילת הדרך", ["עיצוב אתר", "פיתוח צד לקוח", "פיתוח אפליקציה"]],
    ["₪2,500", "מותאם אישית", "מתאים לצוותים ועסקים בצמיחה", ["עיצוב אתר", "פיתוח צד לקוח", "פיתוח אפליקציה", "פיתוח מתקדם", "AI לעסק"]],
  ];

  return (
    <section className="bg-[#fff1c6] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1520px]">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <SectionKicker>חבילות</SectionKicker>

            <h2 className="max-w-5xl text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl">
              בחרו את החבילה שמתאימה לעסק שלכם
            </h2>
          </div>

          <div className="flex w-fit rounded-full bg-white p-2">
            <button className="rounded-full bg-[#301b12] px-6 py-3 text-sm font-black text-white">
              חודשי
            </button>
            <button className="rounded-full px-6 py-3 text-sm font-black text-[#301b12]">
              שנתי
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          {plans.map(([price, name, desc, features], index) => (
            <article
              key={`${price}-${index}`}
              className={cx(
                "rounded-[2.8rem] p-7 shadow-[0_30px_85px_rgba(48,27,18,.12)] transition duration-500 hover:-translate-y-3",
                index === 1
                  ? "bg-[#301b12] text-white"
                  : index === 2
                    ? "bg-[#eadcff] text-[#301b12]"
                    : "bg-white text-[#301b12]",
              )}
            >
              <p className="text-7xl font-black tracking-[-.1em]">{price}</p>

              <p className="mt-2 text-sm font-black opacity-55">
                חיסכון של כ־20% בתשלום שנתי
              </p>

              <h3 className="mt-8 text-3xl font-black tracking-[-.06em]">
                {name as string}
              </h3>

              <p className="mt-2 text-sm font-bold opacity-65">{desc as string}</p>

              <button className="mt-8 w-full rounded-full bg-[#ffe3a8] px-5 py-4 text-sm font-black text-[#301b12]">
                התחלת ניסיון
              </button>

              <ul className="mt-8 space-y-3">
                {(features as string[]).map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-black">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-white/60 text-[#301b12]">
                      ✓
                    </span>
                    {feature}
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
  const steps = [
    ["01", "אפיון", "שיחת אפיון והבנת מטרות הפרויקט", "זמן משוער — יום אחד", "💬"],
    ["02", "אסטרטגיה", "עיצוב Experiences that are Built with Precision", "זמן משוער — 3 ימים", "✎"],
    ["03", "פיתוח", "פיתוח והשקה שמקדמים את העסק קדימה", "זמן משוער — לפי היקף הפרויקט", "↗"],
  ];

  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1520px]">
        <SectionKicker>תהליך</SectionKicker>

        <h2 className="mb-12 max-w-5xl text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl">
          כך אנחנו הופכים רעיון למוצר דיגיטלי
        </h2>

        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map(([number, label, title, timeline, icon]) => (
            <article
              key={number}
              className="group relative min-h-[360px] overflow-hidden rounded-[2.8rem] border border-[#301b12]/10 bg-white/75 p-7 shadow-[0_25px_80px_rgba(48,27,18,.09)] transition duration-500 hover:-translate-y-3 hover:bg-[#301b12] hover:text-white"
            >
              <p className="absolute right-6 top-4 text-[7rem] font-black leading-none tracking-[-.12em] text-[#301b12]/10 transition group-hover:text-white/10">
                {number}
              </p>

              <span className="relative z-10 mb-16 grid h-20 w-20 place-items-center rounded-[1.8rem] bg-[#ffe3a8] text-4xl text-[#301b12] transition group-hover:rotate-12">
                {icon}
              </span>

              <p className="relative z-10 text-sm font-black opacity-55">
                {label}
              </p>

              <h3 className="relative z-10 mt-4 text-3xl font-black leading-tight tracking-[-.06em]">
                {title}
              </h3>

              <p className="relative z-10 mt-8 rounded-full bg-[#301b12]/8 px-4 py-3 text-sm font-black text-[#301b12]/70 group-hover:bg-white/10 group-hover:text-white/65">
                {timeline}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    ["האם יש תקופת ניסיון?", "כן. אפשר להתנסות, להבין את הערך ולקבל החלטה בצורה רגועה לפני שמתחייבים."],
    ["איך נקבע המחיר?", "חבילות varies depending on selected features, usage limits, service level, and the overall requirements of your business."],
    ["מה אפשר לבנות איתכם?", "אפשר לבנות אתר תדמית, עמוד נחיתה, מערכת תורים, אוטומציות, קמפיינים וחוויות דיגיטליות נוספות."],
    ["אפשר לשנות חבילה בהמשך?", "כן. ניתן לשדרג או לשנות חבילה בהתאם לצמיחה ולצרכים של העסק."],
    ["אילו אמצעי תשלום קיימים?", "ניתן לשלם בכרטיס אשראי ובאמצעי תשלום מאובטחים נוספים."],
  ];

  return (
    <section className="relative overflow-hidden bg-[#f8e6ef] px-5 py-20 lg:px-8 lg:py-28">
      <DotPattern className="left-6 bottom-8 h-52 w-52" />

      <div className="mx-auto grid max-w-[1520px] gap-8 lg:grid-cols-[.85fr_1.15fr]">
        <div>
          <SectionKicker>שאלות נפוצות</SectionKicker>

          <h2 className="text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl">
            שאלו אותנו,
            <br />
            אנחנו כאן לעזור
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map(([question, answer], index) => (
            <article
              key={question}
              className="overflow-hidden rounded-[2rem] bg-white/82 shadow-[0_18px_55px_rgba(48,27,18,.08)]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="flex w-full items-center justify-between gap-5 p-6 text-right text-xl font-black tracking-[-.03em] text-[#301b12]"
              >
                <span>{question}</span>

                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#301b12] text-white">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <p className="px-6 pb-6 text-base font-bold leading-8 text-[#301b12]/62">
                  {answer}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection({ onNavigate }: { onNavigate: (page: VirelloPageId) => void }) {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1520px]">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionKicker>הבלוג שלנו</SectionKicker>

            <h2 className="max-w-5xl text-6xl font-black leading-[.86] tracking-[-.085em] text-[#301b12] md:text-8xl">
              טיפים מודרניים
              <br />
              לצמיחה דיגיטלית
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("blog")}
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#301b12] px-6 py-4 text-sm font-black text-white"
          >
            כל המאמרים
            <ArrowRound dark={false} />
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <article
              key={post.title}
              className={cx(
                "group overflow-hidden rounded-[2.8rem] border border-[#301b12]/10 bg-white/75 p-4 shadow-[0_25px_80px_rgba(48,27,18,.09)] transition duration-500 hover:-translate-y-3",
                index === 1 && "lg:translate-y-10",
              )}
            >
              <div className="h-72 overflow-hidden rounded-[2.2rem]">
                <VisualMedia
                  id={`blog.${index}.image`}
                  fallbackSrc={post.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-5">
                <div className="mb-4 flex items-center justify-between text-xs font-black text-[#301b12]/45">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>

                <h3 className="text-2xl font-black leading-tight tracking-[-.06em] text-[#301b12]">
                  {post.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCta({ onNavigate }: { onNavigate: (page: VirelloPageId) => void }) {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1520px] overflow-hidden rounded-[3.2rem] bg-[#301b12] p-8 text-white shadow-[0_35px_100px_rgba(48,27,18,.18)] md:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <h2 className="text-6xl font-black leading-[.86] tracking-[-.085em] md:text-8xl">
            בואו נבנה יחד נוכחות דיגיטלית שבאמת עובדת
          </h2>

          <div>
            <p className="mb-7 text-lg font-bold leading-8 text-white/62">
              רוצים אתר מרשים, מהיר ומדויק למותג שלכם? נשמח לשמוע על הפרויקט ולהציע כיוון נכון.
            </p>

            <button
              type="button"
              onClick={() => onNavigate("contact")}
              className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black text-[#301b12]"
            >
              דברו איתנו
              <ArrowRound />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ onNavigate }: { onNavigate: (page: VirelloPageId) => void }) {
  return (
    <footer className="border-t border-[#301b12]/10 px-5 py-12 lg:px-8">
      <div className="mx-auto grid max-w-[1520px] gap-8 lg:grid-cols-[1fr_.8fr_1.2fr]">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#301b12] text-xl font-black text-white">
              v
            </span>
            <span className="text-3xl font-black tracking-[-.08em] text-[#301b12]">
              Virello
            </span>
          </button>

          <p className="mt-5 max-w-sm text-sm font-bold leading-7 text-[#301b12]/55">
            רחוב הברזל 12, תל אביב
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="w-fit text-sm font-black text-[#301b12]/55 hover:text-[#301b12]"
            >
              ({item.number}) {item.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="rounded-[2rem] bg-white/70 p-5 shadow-sm"
        >
          <label className="mb-3 block text-sm font-black text-[#301b12]">
            הצטרפו לעדכונים
          </label>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="כתובת אימייל"
              className="min-w-0 flex-1 rounded-full border border-[#301b12]/10 bg-white px-4 py-3 text-sm font-bold text-[#301b12] outline-none focus:border-[#301b12]"
            />

            <button className="rounded-full bg-[#301b12] px-5 py-3 text-sm font-black text-white">
              הצטרפות
            </button>
          </div>
        </form>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1520px] flex-col justify-between gap-4 border-t border-[#301b12]/10 pt-6 text-sm font-bold text-[#301b12]/45 md:flex-row">
        <p>© 2026 Virello. כל הזכויות שמורות</p>

        <div className="flex gap-4">
          <span>FB</span>
          <span>X</span>
          <span>LI</span>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ onNavigate }: { onNavigate: (page: VirelloPageId) => void }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <AboutSection onNavigate={onNavigate} />
      <WhyUs />
      <ProjectsSection />
      <Testimonials />
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
          <SectionKicker>אודות Virello</SectionKicker>

          <h1 className="max-w-6xl text-7xl font-black leading-[.82] tracking-[-.09em] text-[#301b12] md:text-9xl">
            סטודיו דיגיטלי עם אסטרטגיה חדה וכיוון קריאייטיבי ברור
          </h1>
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
          <SectionKicker>פרויקטים</SectionKicker>

          <h1 className="max-w-6xl text-7xl font-black leading-[.82] tracking-[-.09em] text-[#301b12] md:text-9xl">
            עבודות נבחרות למותגים שרוצים לגדול
          </h1>
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
          <SectionKicker>בלוג</SectionKicker>

          <h1 className="max-w-6xl text-7xl font-black leading-[.82] tracking-[-.09em] text-[#301b12] md:text-9xl">
            רעיונות, טרנדים ואסטרטגיה למותגים דיגיטליים
          </h1>
        </div>
      </section>

      <BlogSection onNavigate={onNavigate} />
      <FaqSection />
      <ContactCta onNavigate={onNavigate} />
    </>
  );
}

function ContactPage() {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1520px] gap-8 lg:grid-cols-[.95fr_1.05fr]">
        <div>
          <SectionKicker>צור קשר</SectionKicker>

          <h1 className="text-7xl font-black leading-[.82] tracking-[-.09em] text-[#301b12] md:text-9xl">
            בואו נבנה משהו גדול
          </h1>

          <p className="mt-8 max-w-xl text-xl font-bold leading-9 text-[#301b12]/62">
            השאירו פרטים ונחזור אליכם לשיחת התאמה קצרה.
          </p>
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="rounded-[3rem] border border-[#301b12]/10 bg-white/80 p-6 shadow-[0_25px_80px_rgba(48,27,18,.09)] md:p-10"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="שם מלא"
              className="rounded-full border border-[#301b12]/10 bg-[#fff8f0] px-5 py-4 text-sm font-bold text-[#301b12] outline-none focus:border-[#301b12]"
            />

            <input
              placeholder="טלפון"
              className="rounded-full border border-[#301b12]/10 bg-[#fff8f0] px-5 py-4 text-sm font-bold text-[#301b12] outline-none focus:border-[#301b12]"
            />

            <input
              placeholder="אימייל"
              className="rounded-full border border-[#301b12]/10 bg-[#fff8f0] px-5 py-4 text-sm font-bold text-[#301b12] outline-none focus:border-[#301b12] md:col-span-2"
            />

            <textarea
              placeholder="ספרו לנו על הפרויקט"
              rows={7}
              className="resize-none rounded-[2rem] border border-[#301b12]/10 bg-[#fff8f0] px-5 py-4 text-sm font-bold text-[#301b12] outline-none focus:border-[#301b12] md:col-span-2"
            />
          </div>

          <button className="mt-5 w-full rounded-full bg-[#301b12] px-6 py-4 text-sm font-black text-white">
            שליחת הודעה
          </button>
        </form>
      </div>
    </section>
  );
}

export default function VirelloPages({ initialPage = "home", activePageId, data = {} }: VirelloPagesProps) {
  const [activePage, setActivePage] = useState<VirelloPageId>(activePageId || initialPage);

  const pageContent = useMemo(() => {
    if (activePage === "about") return <AboutPage onNavigate={setActivePage} />;
    if (activePage === "project") return <ProjectPage onNavigate={setActivePage} />;
    if (activePage === "blog") return <BlogPage onNavigate={setActivePage} />;
    if (activePage === "contact") return <ContactPage />;

    return <HomePage onNavigate={setActivePage} />;
  }, [activePage]);

  return (
    <VirelloDataContext.Provider value={data || {}}>
      <div
        dir="rtl"
        data-template-id="virello"
        className="min-h-screen w-full overflow-x-hidden bg-[#fff8f0] text-[#301b12]"
      >
        <VirelloEffects />
        <Header activePage={activePage} onNavigate={setActivePage} />
        <main>{pageContent}</main>
        <Footer onNavigate={setActivePage} />
      </div>
    </VirelloDataContext.Provider>
  );
}

export const virelloPages = [
  {
    id: "home",
    label: "בית",
    name: "בית",
    title: "בית",
    slug: "/",
    Component: () => <VirelloPages initialPage="home" />,
  },
  {
    id: "about",
    label: "אודות",
    name: "אודות",
    title: "אודות",
    slug: "/about",
    Component: () => <VirelloPages initialPage="about" />,
  },
  {
    id: "project",
    label: "פרויקטים",
    name: "פרויקטים",
    title: "פרויקטים",
    slug: "/project",
    Component: () => <VirelloPages initialPage="project" />,
  },
  {
    id: "blog",
    label: "בלוג",
    name: "בלוג",
    title: "בלוג",
    slug: "/blog",
    Component: () => <VirelloPages initialPage="blog" />,
  },
  {
    id: "contact",
    label: "צור קשר",
    name: "צור קשר",
    title: "צור קשר",
    slug: "/contact",
    Component: () => <VirelloPages initialPage="contact" />,
  },
] as const;