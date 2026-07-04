import React from "react";
import {
  ArrowLeft,
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

type VelmoraHomeTemplateData = Record<string, any>;

type Props = {
  onPageChange: (page: VelmoraPageId) => void;
  templateData?: VelmoraHomeTemplateData;
  data?: VelmoraHomeTemplateData;
  studioData?: VelmoraHomeTemplateData;
  isVisualEditor?: boolean;
  isStudioStatic?: boolean;
};

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  /**
   * חשוב:
   * בתוך ה-preview / editor יש scroll container פנימי.
   * IntersectionObserver יכול לזהות אלמנטים לא נכון ואז להחזיר אותם ל-opacity-0.
   * לכן ב-Velmora משאירים את כל התוכן גלוי תמיד.
   */
  return (
    <div
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={[
        "translate-y-0 opacity-100 transition-all duration-[700ms] ease-out",
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


const VELMORA_IMAGE_FALLBACKS = [
  "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1100&q=90",
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1100&q=90",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1100&q=90",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1100&q=90",
  "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1100&q=90",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=90",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1100&q=90",
];

function safeImageSrc(value: unknown, fallbackIndex = 0) {
  const clean = String(value || "").trim();

  if (
    clean &&
    clean !== "undefined" &&
    clean !== "null" &&
    !clean.startsWith("data:,")
  ) {
    return clean;
  }

  return VELMORA_IMAGE_FALLBACKS[
    Math.abs(fallbackIndex) % VELMORA_IMAGE_FALLBACKS.length
  ];
}

function fallbackImageOnError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackIndex = 0,
) {
  const fallback =
    VELMORA_IMAGE_FALLBACKS[
      Math.abs(fallbackIndex) % VELMORA_IMAGE_FALLBACKS.length
    ];

  if (event.currentTarget.src !== fallback) {
    event.currentTarget.src = fallback;
  }
}

function imageBgStyle(src: unknown, fallbackIndex = 0): React.CSSProperties {
  return {
    backgroundImage: `url("${safeImageSrc(src, fallbackIndex)}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

function getDataSection(
  data: VelmoraHomeTemplateData | undefined,
  sectionId: string,
): Record<string, any> {
  const value = data?.[sectionId];

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  return {};
}

function getStringValue(
  section: Record<string, any>,
  key: string,
  fallback: string,
) {
  const value = section?.[key];

  if (typeof value === "string") {
    const clean = value.trim();
    return clean || fallback;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function getNumberValue(
  section: Record<string, any>,
  key: string,
  fallback: number,
) {
  const value = Number(section?.[key]);

  if (Number.isFinite(value) && value > 0) {
    return value;
  }

  return fallback;
}

function getPageValue(
  section: Record<string, any>,
  key: string,
  fallback: VelmoraPageId,
): VelmoraPageId {
  const value = String(section?.[key] || "").trim();

  const allowedPages: VelmoraPageId[] = [
    "home",
    "about",
    "shop",
    "projects",
    "custom",
    "contact",
    "product",
    "cart",
    "terms",
    "privacy",
    "accessibility",
    "faq",
    "shipping",
    "orders",
  ];

  return allowedPages.includes(value as VelmoraPageId)
    ? (value as VelmoraPageId)
    : fallback;
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
          ...imageBgStyle(product.image, index),
        } as React.CSSProperties
      }
      className="group relative -mx-2 h-[310px] w-[190px] shrink-0 overflow-hidden rounded-t-[26px] border border-black/10 bg-white bg-cover bg-center shadow-[0_22px_70px_rgba(0,0,0,0.12)] transition duration-700 md:h-[360px] md:w-[230px]"
    >
      <img
        src={safeImageSrc(product.image, index)}
        alt={product.title}
        onError={(event) => fallbackImageOnError(event, index)}
        className="relative z-[1] block h-full w-full object-cover opacity-100 transition duration-700 group-hover:scale-105"
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
  speed = 38,
}: {
  images: string[];
  reverse?: boolean;
  speed?: number;
}) {
  const safeImages = images.length
    ? images.map((image, index) => safeImageSrc(image, index))
    : VELMORA_IMAGE_FALLBACKS;

  const repeated = [...safeImages, ...safeImages, ...safeImages];

  return (
    <div
      className="relative overflow-hidden"
      data-velmora-moving-gallery="home"
      style={
        {
          "--velmora-gallery-speed": `${speed}s`,
        } as React.CSSProperties
      }
    >
      <div
        data-velmora-moving-gallery-track="home"
        data-velmora-reverse={reverse ? "true" : "false"}
        className="flex w-max gap-4"
      >
        {repeated.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={safeImageSrc(image, index)}
            alt="גלריית השראה"
            onError={(event) => fallbackImageOnError(event, index)}
            className="block h-[170px] w-[245px] shrink-0 rounded-[4px] object-cover opacity-100 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl md:h-[220px] md:w-[330px]"
          />
        ))}
      </div>
    </div>
  );
}

export default function VelmoraHome({
  onPageChange,
  templateData,
  data,
  studioData,
}: Props) {
  const visualData = studioData || templateData || data || {};

  const hero = getDataSection(visualData, "hero");
  const about = getDataSection(visualData, "about");
  const inspiration = getDataSection(visualData, "inspiration");
  const collections = getDataSection(visualData, "collections");
  const customBox = getDataSection(visualData, "customBox");
  const gallery = getDataSection(visualData, "gallery");
  const productsStrip = getDataSection(visualData, "productsStrip");
  const contact = getDataSection(visualData, "contact");

  const heroProducts = velmoraProducts.slice(0, 7);
  const galleryImages =
    Array.isArray(velmoraGallery) && velmoraGallery.length
      ? velmoraGallery.map((image, index) => safeImageSrc(image, index))
      : VELMORA_IMAGE_FALLBACKS;
  const gallerySpeed = getNumberValue(gallery, "speed", 38);

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
            animation: velmoraMarquee var(--velmora-gallery-speed, 38s) linear infinite;
          }

          [data-velmora-moving-gallery-track="home"][data-velmora-reverse="true"] {
            animation: velmoraMarqueeReverse var(--velmora-gallery-speed, 38s) linear infinite;
          }

          [data-template-id="velmora"] img,
          [data-velmora-fan-card="true"] img,
          [data-velmora-moving-gallery="home"] img {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
          }

          [data-velmora-fan-card="true"],
          [style*="background-image"] {
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
          }
        `}
      </style>

      {/* 1. HERO */}
      <section data-template-section-id="hero" className="relative min-h-[900px] px-5 pb-0 pt-32 md:pt-36">
        <div className="pointer-events-none absolute left-1/2 top-20 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-white/60 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />

        <Reveal className="relative mx-auto max-w-7xl text-center">
          <p className="text-sm tracking-[0.26em] text-black/45">
            {getStringValue(
              hero,
              "eyebrow",
              "בוטיק אופנה, סטיילינג אישי וקולקציות נבחרות.",
            )}
          </p>

          <h1 className="mx-auto mt-7 max-w-5xl [font-family:Georgia,Times_New_Roman,serif] text-[58px] font-normal leading-[0.92] tracking-[-0.06em] text-[#2b2722] md:text-[98px]">
            {getStringValue(hero, "title", "אופנה שמרגישה בדיוק נכון")}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-black/55 md:text-lg">
            {getStringValue(
              hero,
              "subtitle",
              "ב־ATELIER NOA ניתן למצוא פריטים טבעיים, גזרות מדויקות וחוויית קנייה נקייה שמתאימה לסגנון יומיומי, עסקי ואישי.",
            )}
          </p>

          <button
            type="button"
            onClick={() => onPageChange(getPageValue(hero, "buttonPageId", "shop"))}
            className="mt-8 inline-flex h-12 items-center gap-3 rounded-[4px] bg-[#292318] px-8 text-sm font-bold text-white shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-black"
          >
            {getStringValue(hero, "buttonText", "לכל הקולקציות")}
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
      <section data-template-section-id="about" className="bg-white px-5 py-24">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <div className="relative">
              <img
                src={safeImageSrc(
                  getStringValue(
                    about,
                    "image",
                    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=90",
                  ),
                  5,
                )}
                alt="בוטיק אופנה"
                onError={(event) => fallbackImageOnError(event, 5)}
                className="block h-[460px] w-full object-cover opacity-100 md:h-[560px]"
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
{getStringValue(about, "eyebrow", "סגנון. איכות. נוכחות.")}
            </p>

            <SerifTitle className="mt-5 text-5xl md:text-6xl">
{getStringValue(about, "title", "פריטים נבחרים שמספרים סיפור")}
            </SerifTitle>

            <p className="mt-6 text-base leading-8 text-black/55">
{getStringValue(
                about,
                "text",
                "הבחירה בפריטים נעשית לפי בד, גזרה, שימושיות ותחושה. כל קולקציה נבנית כדי ליצור מלתחה נקייה, נוחה ומדויקת בלי עומס ובלי רעש.",
              )}
            </p>

            <button
              type="button"
              onClick={() => onPageChange(getPageValue(about, "buttonPageId", "projects"))}
              className="mt-7 inline-flex items-center gap-3 border-b border-black pb-2 text-sm font-medium transition hover:gap-5"
            >
              {getStringValue(about, "buttonText", "לגלות את המותג")}
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* 3. MOVING SLIDER / STORY */}
      <section data-template-section-id="inspiration" className="relative overflow-hidden bg-[#4a3726] py-24 text-white">
        <img
          src={safeImageSrc(
            getStringValue(
              inspiration,
              "backgroundImage",
              "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1800&q=90",
            ),
            4,
          )}
          alt="סטודיו"
          onError={(event) => fallbackImageOnError(event, 4)}
          className="absolute inset-0 block h-full w-full object-cover opacity-45"
        />

        <div className="absolute inset-0 bg-gradient-to-l from-black/45 via-black/10 to-black/45" />

        <div className="relative mx-auto max-w-7xl px-5">
          <Reveal>
            <div className="max-w-xl rounded-[6px] bg-white/92 p-8 text-[#2b2722] shadow-2xl backdrop-blur">
              <p className="text-sm tracking-[0.18em] text-black/45">
{getStringValue(inspiration, "eyebrow", "השראות עכשוויות")}
              </p>

              <SerifTitle className="mt-4 text-4xl">
{getStringValue(inspiration, "title", "תובנות מהסטודיו שלנו")}
              </SerifTitle>

              <p className="mt-4 leading-7 text-black/55">
{getStringValue(
                  inspiration,
                  "text",
                  "טיפים לסטיילינג, שילובי פריטים, התאמות לאירועים ומדריכים לבניית מלתחה חכמה ונוחה.",
                )}
              </p>

              <button
                type="button"
                onClick={() => onPageChange(getPageValue(inspiration, "buttonPageId", "custom"))}
                className="mt-5 inline-flex items-center gap-3 text-sm font-medium transition hover:gap-5"
              >
                {getStringValue(inspiration, "buttonText", "קראו עוד")}
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
      <section data-template-section-id="collections" className="bg-white px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SerifTitle className="text-center text-4xl md:text-5xl">
{getStringValue(collections, "title", "הקולקציות שלנו")}
            </SerifTitle>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {velmoraProjects.map((project, index) => (
              <Reveal key={project.title} delay={index * 120}>
                <button
                  type="button"
                  onClick={() => onPageChange("projects")}
                  style={imageBgStyle(project.image, index + 6)}
                  className="group relative min-h-[390px] overflow-hidden rounded-[6px] border border-black/10 bg-[#f6f2ea] bg-cover bg-top text-right shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <img
                    src={safeImageSrc(project.image, index + 6)}
                    alt={project.title}
                    onError={(event) => fallbackImageOnError(event, index + 6)}
                    className="relative z-[1] block h-64 w-full object-cover opacity-100 transition duration-700 group-hover:scale-105"
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
      <section data-template-section-id="customBox" className="relative bg-[#f6f2ea] px-5 py-28">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/10" />

        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.8fr_1.2fr_0.8fr] lg:items-center">
          <Reveal>
            <img
              src={safeImageSrc(
                "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=90",
                4,
              )}
              alt="סקיצה"
              onError={(event) => fallbackImageOnError(event, 4)}
              className="block h-80 w-full object-cover opacity-100 shadow-sm"
            />
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-[6px] border border-black/10 bg-white/90 p-10 text-center shadow-[0_20px_80px_rgba(0,0,0,0.1)] backdrop-blur">
              <p className="text-sm tracking-[0.18em] text-black/45">
{getStringValue(customBox, "eyebrow", "שירות התאמה אישי")}
              </p>

              <SerifTitle className="mx-auto mt-4 max-w-xl text-4xl md:text-5xl">
{getStringValue(customBox, "title", "בדיוק בסגנון של המותג")}
              </SerifTitle>

              <p className="mx-auto mt-5 max-w-lg leading-7 text-black/55">
{getStringValue(
                  customBox,
                  "text",
                  "אפשר לבנות התאמה אישית של פריטים, צבעים, מידות וסגנון לפי צורך, אירוע או מלתחה קיימת.",
                )}
              </p>

              <button
                type="button"
                onClick={() => onPageChange(getPageValue(customBox, "buttonPageId", "custom"))}
                className="mt-7 rounded-[4px] bg-[#292318] px-8 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
              >
                {getStringValue(customBox, "buttonText", "לקביעת פגישה")}
              </button>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <img
              src={safeImageSrc(
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=90",
                6,
              )}
              alt="סטיילינג"
              onError={(event) => fallbackImageOnError(event, 6)}
              className="block h-80 w-full object-cover opacity-100 shadow-sm"
            />
          </Reveal>
        </div>
      </section>

      {/* 6. AUTO MOVING GALLERY */}
      <section data-template-section-id="gallery" className="bg-white py-24">
        <Reveal>
          <SerifTitle className="mb-12 text-center text-4xl md:text-5xl">
{getStringValue(gallery, "title", "עולם של השראה")}
          </SerifTitle>
        </Reveal>

        <MovingGallery images={galleryImages} speed={gallerySpeed} />

        <div className="mt-5">
          <MovingGallery
            images={[...galleryImages].reverse()}
            reverse
            speed={gallerySpeed}
          />
        </div>
      </section>

      {/* 7. PRODUCTS STRIP */}
      <section data-template-section-id="productsStrip" className="bg-[#eee7da] px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm tracking-[0.18em] text-black/45">
{getStringValue(productsStrip, "eyebrow", "פריטים נבחרים")}
              </p>

              <SerifTitle className="mt-4 text-4xl md:text-5xl">
{getStringValue(productsStrip, "title", "בחירה מדויקת לכל עונה")}
              </SerifTitle>
            </div>

            <button
              type="button"
              onClick={() => onPageChange(getPageValue(productsStrip, "buttonPageId", "shop"))}
              className="inline-flex h-11 items-center gap-3 rounded-[4px] bg-[#292318] px-6 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
            >
              {getStringValue(productsStrip, "buttonText", "מעבר לחנות")}
              <ShoppingBag className="h-4 w-4" />
            </button>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3">
            {velmoraProducts.slice(0, 3).map((product, index) => (
              <Reveal key={product.id} delay={index * 130}>
                <button
                  type="button"
                  onClick={() => onPageChange("product")}
                  style={imageBgStyle(product.image, index)}
                  className="group overflow-hidden rounded-[6px] bg-white bg-cover bg-top text-right shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <img
                    src={safeImageSrc(product.image, index)}
                    alt={product.title}
                    onError={(event) => fallbackImageOnError(event, index)}
                    className="block h-80 w-full object-cover opacity-100 transition duration-700 group-hover:scale-105"
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
      <section data-template-section-id="contact" className="bg-[#f6f2ea] px-5 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="text-sm tracking-[0.18em] text-black/45">
{getStringValue(contact, "eyebrow", "נשמח לעזור")}
            </p>

            <SerifTitle className="mt-4 text-5xl">
              {getStringValue(contact, "title", "יצירת קשר")}
            </SerifTitle>

            <p className="mt-5 max-w-md leading-7 text-black/55">
{getStringValue(
                contact,
                "text",
                "ניתן להשאיר פרטים לקבלת מידע על קולקציות, סטיילינג אישי או שיתוף פעולה.",
              )}
            </p>

            <div className="mt-8 grid gap-3 text-sm text-black/65">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
{getStringValue(contact, "phone", "05-1234567")}
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
{getStringValue(contact, "email", "hello@ateliernoa.co.il")}
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4" />
{getStringValue(contact, "address", "המרכז 25, תל אביב")}
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
{getStringValue(contact, "buttonText", "שליחה")}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}