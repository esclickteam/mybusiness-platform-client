import React from "react";
import {
  ArrowLeft,
  Eye,
  Sparkles,
  ShoppingBag,
  Star,
} from "lucide-react";

import type { VelmoraPageId } from "../pages";
import { velmoraGallery, velmoraProjects } from "../velmoraData";

type Props = {
  onPageChange: (page: VelmoraPageId) => void;
};

const collectionCards = [
  {
    title: "קולקציית קיץ",
    subtitle: "בדים טבעיים, צבעים בהירים וגזרות נקיות.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90",
    tag: "SUMMER EDIT",
  },
  {
    title: "קולקציית ערב",
    subtitle: "פריטים אלגנטיים לאירועים, ערב ויציאה.",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=90",
    tag: "EVENING LINE",
  },
  {
    title: "סטיילינג יומיומי",
    subtitle: "מלתחה מדויקת לעבודה, פגישות ושגרה.",
    image:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1200&q=90",
    tag: "DAILY WEAR",
  },
  {
    title: "קולקציית מעבר",
    subtitle: "שכבות קלות, גווני אדמה ופריטים רב־שימושיים.",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=90",
    tag: "TRANSITION",
  },
  {
    title: "אקססוריז",
    subtitle: "תיקים, צעיפים ופריטים משלימים למראה שלם.",
    image:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=90",
    tag: "ACCESSORIES",
  },
  {
    title: "קולקציית סטודיו",
    subtitle: "פריטים שקטים, נקיים ונוחים לשימוש יומיומי.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=90",
    tag: "STUDIO PIECES",
  },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={[
        "transition-all duration-[900ms] ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function SerifTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={[
        "[font-family:Georgia,Times_New_Roman,serif] font-normal leading-[0.98] tracking-[-0.055em] text-[#2b2722]",
        className,
      ].join(" ")}
    >
      {children}
    </h2>
  );
}

function MovingGallery({
  images,
  reverse = false,
}: {
  images: string[];
  reverse?: boolean;
}) {
  const repeated = [...images, ...images, ...images];

  return (
    <div className="relative overflow-hidden">
      <div
        className={[
          "flex w-max gap-4",
          reverse
            ? "animate-[velmoraCollectionsReverse_42s_linear_infinite]"
            : "animate-[velmoraCollectionsMarquee_42s_linear_infinite]",
        ].join(" ")}
      >
        {repeated.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt="קולקציה"
            className="h-[220px] w-[330px] shrink-0 object-cover transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
          />
        ))}
      </div>
    </div>
  );
}

export default function VelmoraProjects({ onPageChange }: Props) {
  return (
    <main className="overflow-hidden bg-[#f6f2ea] text-[#27231f]">
      <style>
        {`
          @keyframes velmoraCollectionsMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }

          @keyframes velmoraCollectionsReverse {
            0% { transform: translateX(-33.333%); }
            100% { transform: translateX(0); }
          }
        `}
      </style>

      {/* HERO FULL WIDTH */}
      <section className="relative min-h-[760px] px-5 pb-20 pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.95),transparent_42%)]" />

        <div className="relative mx-auto max-w-[1500px]">
          <Reveal className="text-center">
            <p className="text-sm tracking-[0.26em] text-black/45">
              ATELIER NOA COLLECTIONS
            </p>

            <h1 className="mx-auto mt-8 max-w-5xl [font-family:Georgia,Times_New_Roman,serif] text-[64px] font-normal leading-[0.9] tracking-[-0.06em] text-[#2b2722] md:text-[112px]">
              קולקציות שנבנות כסיפור שלם
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-black/55 md:text-lg">
              כל קולקציה מציגה שפה אחרת: גזרות, צבעים, חומרים ותחושה. אפשר
              להיכנס לכל קולקציה, לצפות בפריטים ולעבור לעמוד החנות.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => onPageChange("shop")}
                className="inline-flex h-12 items-center gap-3 rounded-[4px] bg-[#292318] px-8 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
              >
                מעבר לחנות
                <ShoppingBag className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onPageChange("custom")}
                className="inline-flex h-12 items-center gap-3 rounded-[4px] border border-black/15 bg-white px-8 text-sm font-bold text-[#292318] transition hover:border-black"
              >
                סטיילינג אישי
              </button>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-20 grid gap-5 md:grid-cols-3">
              {collectionCards.slice(0, 3).map((collection, index) => (
                <button
                  key={collection.title}
                  type="button"
                  onClick={() => onPageChange("shop")}
                  className={[
                    "group relative overflow-hidden bg-white shadow-[0_24px_80px_rgba(0,0,0,0.12)] transition duration-700 hover:-translate-y-4 hover:shadow-[0_36px_110px_rgba(0,0,0,0.2)]",
                    index === 1 ? "md:-mt-10" : "md:mt-10",
                  ].join(" ")}
                >
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="h-[500px] w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/45" />

                  <div className="absolute inset-x-0 bottom-0 translate-y-6 p-7 text-right text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-xs font-bold tracking-[0.22em] text-white/65">
                      {collection.tag}
                    </p>

                    <h3 className="mt-3 [font-family:Georgia,serif] text-4xl">
                      {collection.title}
                    </h3>

                    <p className="mt-3 max-w-sm leading-7 text-white/75">
                      {collection.subtitle}
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/45 px-4 py-2 text-xs font-bold">
                      צפייה בקולקציה
                      <Eye className="h-4 w-4" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* BIG EDITORIAL BLOCK */}
      <section className="bg-white px-5 py-28">
        <div className="mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=90"
              alt="קולקציית אופנה"
              className="h-[680px] w-full object-cover"
            />
          </Reveal>

          <Reveal delay={150}>
            <p className="text-sm tracking-[0.22em] text-black/45">
              COLLECTION STORY
            </p>

            <SerifTitle className="mt-5 text-5xl md:text-7xl">
              לכל קולקציה יש קצב, צבע ונוכחות משלה
            </SerifTitle>

            <p className="mt-7 max-w-xl text-base leading-8 text-black/55 md:text-lg">
              הקולקציות בנויות כדי לאפשר בחירה קלה וברורה: מה מתאים לעבודה,
              מה לערב, מה ליומיום ומה יוצר מראה שלם. כל אזור באתר מציג את
              הקולקציה בצורה רחבה, ויזואלית ומכירתית.
            </p>

            <button
              type="button"
              onClick={() => onPageChange("shop")}
              className="mt-8 inline-flex items-center gap-3 border-b border-black pb-2 text-sm font-medium transition hover:gap-5"
            >
              לראות את כל הפריטים
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* COLLECTION GRID FULL WIDTH */}
      <section className="bg-[#eee7da] px-5 py-28">
        <div className="mx-auto max-w-[1500px]">
          <Reveal className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm tracking-[0.22em] text-black/45">
                COLLECTIONS
              </p>

              <SerifTitle className="mt-4 text-5xl md:text-6xl">
                כל הקולקציות
              </SerifTitle>
            </div>

            <button
              type="button"
              onClick={() => onPageChange("shop")}
              className="inline-flex h-11 items-center gap-3 rounded-[4px] bg-[#292318] px-6 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
            >
              מעבר לחנות
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {collectionCards.map((collection, index) => (
              <Reveal key={collection.title} delay={(index % 6) * 90}>
                <button
                  type="button"
                  onClick={() => onPageChange("shop")}
                  className="group relative min-h-[460px] overflow-hidden bg-white text-right shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/45" />

                  <div className="absolute inset-0 flex translate-y-8 flex-col justify-end p-7 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-xs font-bold tracking-[0.22em] text-white/65">
                      {collection.tag}
                    </p>

                    <h3 className="mt-3 [font-family:Georgia,serif] text-4xl text-white">
                      {collection.title}
                    </h3>

                    <p className="mt-3 max-w-sm leading-7 text-white/75">
                      {collection.subtitle}
                    </p>
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-bold tracking-[0.2em] text-black/35">
                      {collection.tag}
                    </p>

                    <h3 className="mt-3 [font-family:Georgia,serif] text-3xl">
                      {collection.title}
                    </h3>

                    <p className="mt-3 leading-7 text-black/55">
                      {collection.subtitle}
                    </p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MOVING GALLERY */}
      <section className="bg-white py-28">
        <Reveal>
          <SerifTitle className="mb-12 text-center text-5xl md:text-6xl">
            השראות מתוך הקולקציות
          </SerifTitle>
        </Reveal>

        <MovingGallery images={velmoraGallery} />

        <div className="mt-5">
          <MovingGallery images={[...velmoraGallery].reverse()} reverse />
        </div>
      </section>

      {/* PROJECTS / LOOKBOOK */}
      <section className="bg-[#f6f2ea] px-5 py-28">
        <div className="mx-auto max-w-[1500px]">
          <Reveal className="mb-12 text-center">
            <p className="text-sm tracking-[0.22em] text-black/45">
              LOOKBOOK
            </p>

            <SerifTitle className="mx-auto mt-4 max-w-4xl text-5xl md:text-7xl">
              לוקים מוכנים מתוך הסטודיו
            </SerifTitle>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-3">
            {velmoraProjects.map((project, index) => (
              <Reveal key={project.title} delay={index * 120}>
                <article className="group overflow-hidden bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-[430px] w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/40" />
                  </div>

                  <div className="p-7">
                    <div className="flex items-center gap-1 text-[#292318]">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <Star key={item} className="h-4 w-4 fill-current" />
                      ))}
                    </div>

                    <h3 className="mt-6 [font-family:Georgia,serif] text-4xl">
                      {project.title}
                    </h3>

                    <p className="mt-4 leading-7 text-black/55">
                      {project.text}
                    </p>

                    <button
                      type="button"
                      onClick={() => onPageChange("shop")}
                      className="mt-6 inline-flex items-center gap-3 border-b border-black pb-2 text-sm font-medium transition hover:gap-5"
                    >
                      מעבר לפריטים
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FULL WIDTH */}
      <section className="relative bg-[#30261d] px-5 py-28 text-white">
        <img
          src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=90"
          alt="קולקציה"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />

        <div className="absolute inset-0 bg-black/45" />

        <Reveal className="relative mx-auto max-w-4xl text-center">
          <Sparkles className="mx-auto h-9 w-9" />

          <h2 className="mt-6 [font-family:Georgia,serif] text-5xl font-normal leading-tight tracking-[-0.04em] md:text-7xl">
            אפשר לבחור קולקציה מוכנה או לבנות התאמה אישית
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/70">
            מעבר לחנות יציג את כל הפריטים. שירות סטיילינג אישי מאפשר התאמה
            מדויקת יותר לפי צורך, סגנון ותקציב.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => onPageChange("shop")}
              className="h-12 rounded-[4px] bg-white px-8 text-sm font-bold text-[#292318] transition hover:-translate-y-1"
            >
              מעבר לחנות
            </button>

            <button
              type="button"
              onClick={() => onPageChange("custom")}
              className="h-12 rounded-[4px] border border-white/30 px-8 text-sm font-bold text-white transition hover:bg-white hover:text-[#292318]"
            >
              סטיילינג אישי
            </button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}