import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import type { VelmoraPageId } from "../pages";
import {
  velmoraGallery,
  velmoraProducts,
  velmoraProjects,
} from "../velmoraData";

type Props = {
  onPageChange: (page: VelmoraPageId) => void;
};

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

function Reveal({ children, className = "", delay = 0 }: RevealProps) {
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
      { threshold: 0.18 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
      }}
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

function ProductFanCard({
  product,
  index,
  onClick,
}: {
  product: (typeof velmoraProducts)[number];
  index: number;
  onClick: () => void;
}) {
  const positions = [
    { z: 1, transform: "translateY(32px) rotate(-7deg)" },
    { z: 2, transform: "translateY(12px) rotate(-4deg)" },
    { z: 3, transform: "translateY(-12px) rotate(-2deg)" },
    { z: 5, transform: "translateY(-32px) rotate(0deg)" },
    { z: 4, transform: "translateY(-8px) rotate(2deg)" },
    { z: 3, transform: "translateY(16px) rotate(5deg)" },
    { z: 2, transform: "translateY(32px) rotate(8deg)" },
  ];

  const position = positions[index % positions.length];

  return (
    <button
      type="button"
      onClick={onClick}
      data-velmora-fan-card="true"
      data-velmora-fan-index={index}
      style={
        {
          "--velmora-fan-z": position.z,
          "--velmora-fan-transform": position.transform,
        } as React.CSSProperties
      }
      className="group relative -mx-2 h-[310px] w-[190px] shrink-0 overflow-hidden rounded-t-[26px] border border-black/10 bg-white shadow-[0_22px_70px_rgba(0,0,0,0.12)] transition duration-700 md:h-[360px] md:w-[230px]"
    >
      <img
        src={product.image}
        alt={product.title}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-white/10 opacity-25 transition duration-500 group-hover:opacity-60" />

      <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-white/95 p-4 text-right shadow-2xl transition duration-500 group-hover:translate-y-0">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
          {product.ref}
        </p>

        <p className="mt-1 text-sm font-bold text-[#27231f]">
          {product.title}
        </p>

        <p className="mt-1 text-xs text-black/50">{product.price}</p>
      </div>
    </button>
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
    <div className="relative overflow-hidden" data-velmora-moving-gallery="home">
      <div
        data-velmora-moving-gallery-track="home"
        data-velmora-reverse={reverse ? "true" : "false"}
        className="flex w-max gap-4"
      >
        {repeated.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt="גלריית השראה"
            className="h-[170px] w-[245px] shrink-0 rounded-[4px] object-cover shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl md:h-[220px] md:w-[330px]"
          />
        ))}
      </div>
    </div>
  );
}

export default function VelmoraHome({ onPageChange }: Props) {
  const heroProducts = velmoraProducts.slice(0, 7);
  const galleryImages = velmoraGallery;

  return (
    <main className="overflow-hidden bg-[#f6f2ea] text-[#27231f]">
      <style>
        {`
          @keyframes velmoraMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }

          @keyframes velmoraMarqueeReverse {
            0% { transform: translateX(-33.333%); }
            100% { transform: translateX(0); }
          }

          @keyframes velmoraFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-14px); }
          }

          @keyframes velmoraSoftPulse {
            0%, 100% { opacity: 0.65; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.035); }
          }

          [data-velmora-fan-card="true"] {
            z-index: var(--velmora-fan-z);
            transform: var(--velmora-fan-transform);
          }

          [data-velmora-fan-card="true"]:hover {
            z-index: 20 !important;
            transform: translateY(-40px) rotate(0deg) !important;
            box-shadow: 0 38px 100px rgba(0,0,0,0.22) !important;
          }

          [data-velmora-moving-gallery-track="home"][data-velmora-reverse="false"] {
            animation: velmoraMarquee 38s linear infinite;
          }

          [data-velmora-moving-gallery-track="home"][data-velmora-reverse="true"] {
            animation: velmoraMarqueeReverse 38s linear infinite;
          }
        `}
      </style>

      {/* 1. HERO */}
      <section className="relative min-h-[900px] px-5 pb-0 pt-32 md:pt-36">
        <div className="pointer-events-none absolute left-1/2 top-20 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-white/60 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />

        <Reveal className="relative mx-auto max-w-7xl text-center">
          <p className="text-sm tracking-[0.26em] text-black/45">
            בוטיק אופנה, סטיילינג אישי וקולקציות נבחרות.
          </p>

          <h1 className="mx-auto mt-7 max-w-5xl [font-family:Georgia,Times_New_Roman,serif] text-[58px] font-normal leading-[0.92] tracking-[-0.06em] text-[#2b2722] md:text-[98px]">
            אופנה שמרגישה בדיוק נכון
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-black/55 md:text-lg">
            ב־ATELIER NOA ניתן למצוא פריטים טבעיים, גזרות מדויקות וחוויית
            קנייה נקייה שמתאימה לסגנון יומיומי, עסקי ואישי.
          </p>

          <button
            type="button"
            onClick={() => onPageChange("shop")}
            className="mt-8 inline-flex h-12 items-center gap-3 rounded-[4px] bg-[#292318] px-8 text-sm font-bold text-white shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-black"
          >
            לכל הקולקציות
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Reveal>

        <Reveal delay={180} className="relative mx-auto mt-20 flex max-w-7xl items-end justify-center overflow-visible">
          <div className="flex items-end justify-center">
            {heroProducts.map((product, index) => (
              <ProductFanCard
                key={product.id}
                product={product}
                index={index}
                onClick={() => onPageChange("product")}
              />
            ))}
          </div>
        </Reveal>
      </section>

      {/* 2. IMAGE + TEXT */}
      <section className="bg-white px-5 py-24">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=90"
                alt="בוטיק אופנה"
                className="h-[460px] w-full object-cover md:h-[560px]"
              />

              <div className="absolute inset-8 border border-black/20" />

              <div className="absolute bottom-6 right-6 rounded-[4px] bg-white/90 px-5 py-4 shadow-xl backdrop-blur">
                <p className="text-xs font-bold tracking-[0.2em] text-black/45">
                  ATELIER EDIT
                </p>
                <p className="mt-1 [font-family:Georgia,serif] text-2xl">
                  פריטים עם אופי
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={160} className="max-w-lg">
            <p className="text-sm tracking-[0.18em] text-black/45">
              סגנון. איכות. נוכחות.
            </p>

            <SerifTitle className="mt-5 text-5xl md:text-6xl">
              פריטים נבחרים שמספרים סיפור
            </SerifTitle>

            <p className="mt-6 text-base leading-8 text-black/55">
              הבחירה בפריטים נעשית לפי בד, גזרה, שימושיות ותחושה. כל קולקציה
              נבנית כדי ליצור מלתחה נקייה, נוחה ומדויקת בלי עומס ובלי רעש.
            </p>

            <button
              type="button"
              onClick={() => onPageChange("projects")}
              className="mt-7 inline-flex items-center gap-3 border-b border-black pb-2 text-sm font-medium transition hover:gap-5"
            >
              לגלות את המותג
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* 3. MOVING SLIDER / STORY */}
      <section className="relative overflow-hidden bg-[#4a3726] py-24 text-white">
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1800&q=90"
          alt="סטודיו"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />

        <div className="absolute inset-0 bg-gradient-to-l from-black/45 via-black/10 to-black/45" />

        <div className="relative mx-auto max-w-7xl px-5">
          <Reveal>
            <div className="max-w-xl rounded-[6px] bg-white/92 p-8 text-[#2b2722] shadow-2xl backdrop-blur">
              <p className="text-sm tracking-[0.18em] text-black/45">
                השראות עכשוויות
              </p>

              <SerifTitle className="mt-4 text-4xl">
                תובנות מהסטודיו שלנו
              </SerifTitle>

              <p className="mt-4 leading-7 text-black/55">
                טיפים לסטיילינג, שילובי פריטים, התאמות לאירועים ומדריכים לבניית
                מלתחה חכמה ונוחה.
              </p>

              <button
                type="button"
                onClick={() => onPageChange("custom")}
                className="mt-5 inline-flex items-center gap-3 text-sm font-medium transition hover:gap-5"
              >
                קראו עוד
                <ArrowLeft className="h-4 w-4" />
              </button>
            </div>
          </Reveal>

          <div className="mt-10 flex justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="h-2 w-2 rounded-full bg-white/40" />
            <span className="h-2 w-2 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      {/* 4. COLLECTION CARDS */}
      <section className="bg-white px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SerifTitle className="text-center text-4xl md:text-5xl">
              הקולקציות שלנו
            </SerifTitle>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {velmoraProjects.map((project, index) => (
              <Reveal key={project.title} delay={index * 120}>
                <button
                  type="button"
                  onClick={() => onPageChange("projects")}
                  className="group relative min-h-[390px] overflow-hidden rounded-[6px] border border-black/10 bg-[#f6f2ea] text-right shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/50" />

                  <div className="absolute inset-0 flex translate-y-8 flex-col justify-end p-5 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-2xl [font-family:Georgia,serif] text-white">
                      {project.title}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/75">
                      {project.text}
                    </p>

                    <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/50 px-4 py-2 text-xs font-bold text-white">
                      צפייה בפרטים
                      <Eye className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="[font-family:Georgia,serif] text-2xl">
                      {project.title}
                    </p>

                    <span className="mt-3 inline-flex border-b border-black text-sm">
                      לגלות
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}

            <Reveal delay={360}>
              <button
                type="button"
                onClick={() => onPageChange("shop")}
                className="group relative min-h-[390px] overflow-hidden rounded-[6px] border border-black/10 bg-[#3c3023] p-8 text-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <Sparkles className="h-8 w-8" />

                <SerifTitle className="mt-10 text-3xl text-white">
                  קולקציית מעבר
                </SerifTitle>

                <p className="mt-4 leading-7 text-white/70">
                  שכבות קלות, גוונים רכים ופריטים שמתאימים לעונות מעבר.
                </p>

                <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs font-bold transition group-hover:bg-white group-hover:text-[#3c3023]">
                  צפייה בפריטים
                  <ArrowLeft className="h-4 w-4" />
                </span>
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. CUSTOM CENTER BOX */}
      <section className="relative bg-[#f6f2ea] px-5 py-28">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/10" />

        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.8fr_1.2fr_0.8fr] lg:items-center">
          <Reveal>
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=90"
              alt="סקיצה"
              className="h-80 w-full object-cover shadow-sm"
            />
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-[6px] border border-black/10 bg-white/90 p-10 text-center shadow-[0_20px_80px_rgba(0,0,0,0.1)] backdrop-blur">
              <p className="text-sm tracking-[0.18em] text-black/45">
                שירות התאמה אישי
              </p>

              <SerifTitle className="mx-auto mt-4 max-w-xl text-4xl md:text-5xl">
                בדיוק בסגנון של המותג
              </SerifTitle>

              <p className="mx-auto mt-5 max-w-lg leading-7 text-black/55">
                אפשר לבנות התאמה אישית של פריטים, צבעים, מידות וסגנון לפי צורך,
                אירוע או מלתחה קיימת.
              </p>

              <button
                type="button"
                onClick={() => onPageChange("custom")}
                className="mt-7 rounded-[4px] bg-[#292318] px-8 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
              >
                לקביעת פגישה
              </button>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=90"
              alt="סטיילינג"
              className="h-80 w-full object-cover shadow-sm"
            />
          </Reveal>
        </div>
      </section>

      {/* 6. AUTO MOVING GALLERY */}
      <section className="bg-white py-24">
        <Reveal>
          <SerifTitle className="mb-12 text-center text-4xl md:text-5xl">
            עולם של השראה
          </SerifTitle>
        </Reveal>

        <MovingGallery images={galleryImages} />

        <div className="mt-5">
          <MovingGallery images={[...galleryImages].reverse()} reverse />
        </div>
      </section>

      {/* 7. PRODUCTS STRIP */}
      <section className="bg-[#eee7da] px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm tracking-[0.18em] text-black/45">
                פריטים נבחרים
              </p>

              <SerifTitle className="mt-4 text-4xl md:text-5xl">
                בחירה מדויקת לכל עונה
              </SerifTitle>
            </div>

            <button
              type="button"
              onClick={() => onPageChange("shop")}
              className="inline-flex h-11 items-center gap-3 rounded-[4px] bg-[#292318] px-6 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
            >
              מעבר לחנות
              <ShoppingBag className="h-4 w-4" />
            </button>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3">
            {velmoraProducts.slice(0, 3).map((product, index) => (
              <Reveal key={product.id} delay={index * 130}>
                <button
                  type="button"
                  onClick={() => onPageChange("product")}
                  className="group overflow-hidden rounded-[6px] bg-white text-right shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="p-5">
                    <p className="text-xs tracking-[0.18em] text-black/40">
                      {product.ref}
                    </p>

                    <h3 className="mt-2 text-xl font-bold">{product.title}</h3>

                    <p className="mt-1 text-sm text-black/50">
                      {product.subtitle}
                    </p>

                    <p className="mt-3 font-bold">{product.price}</p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CONTACT FORM */}
      <section className="bg-[#f6f2ea] px-5 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="text-sm tracking-[0.18em] text-black/45">
              נשמח לעזור
            </p>

            <SerifTitle className="mt-4 text-5xl">יצירת קשר</SerifTitle>

            <p className="mt-5 max-w-md leading-7 text-black/55">
              ניתן להשאיר פרטים לקבלת מידע על קולקציות, סטיילינג אישי או שיתוף
              פעולה.
            </p>

            <div className="mt-8 grid gap-3 text-sm text-black/65">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
                05-1234567
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                hello@ateliernoa.co.il
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4" />
                המרכז 25, תל אביב
              </div>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <form className="grid gap-3">
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  placeholder="שם מלא"
                  className="h-11 border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-black"
                />

                <input
                  placeholder="טלפון"
                  className="h-11 border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-black"
                />
              </div>

              <input
                placeholder="אימייל"
                className="h-11 border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-black"
              />

              <textarea
                placeholder="הודעה"
                rows={5}
                className="resize-none border border-black/10 bg-white p-4 text-sm outline-none transition focus:border-black"
              />

              <button
                type="button"
                className="h-11 w-40 bg-[#292318] text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
              >
                שליחה
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}