import React from "react";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import type { VelmoraPageId } from "../pages";
import { velmoraGallery, velmoraProducts } from "../velmoraData";

type Props = {
  onPageChange: (page: VelmoraPageId) => void;
};

type ProductColor = {
  name: string;
  value: string;
};

const selectedProduct = {
  id: "soft-column-dress",
  ref: "REF. VLM-24002",
  title: "שמלת NOA",
  category: "שמלות",
  price: 349,
  oldPrice: 429,
  description:
    "שמלה נקייה בגזרה רכה, בד נעים ותנועה טבעית. פריט שמתאים לאירוע, ערב, עבודה או מראה יומיומי מדויק.",
  mainImage:
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1400&q=90",
  images: [
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1400&q=90",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=90",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=90",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=90",
  ],
  colors: [
    { name: "שמנת", value: "#E9DED0" },
    { name: "שחור", value: "#171411" },
    { name: "זית", value: "#75745A" },
  ] as ProductColor[],
  sizes: ["XS", "S", "M", "L", "XL"],
};

const productDetails = [
  {
    title: "בד",
    text: "בד רך ונעים עם תחושת נפילה טבעית, מתאים ללבישה ממושכת.",
  },
  {
    title: "גזרה",
    text: "גזרה נקייה שמחמיאה למראה יומיומי, עסקי או ערב.",
  },
  {
    title: "טיפול",
    text: "כביסה עדינה, ייבוש בצל וגיהוץ בחום נמוך לפי הצורך.",
  },
];

const benefits = [
  {
    icon: Truck,
    title: "משלוח מהיר",
    text: "אפשרות למשלוח עד הבית או איסוף מהסטודיו.",
  },
  {
    icon: Ruler,
    title: "התאמת מידה",
    text: "טבלת מידות והמלצה לפי גזרה ושימוש.",
  },
  {
    icon: ShieldCheck,
    title: "החלפה נוחה",
    text: "אפשרות החלפה בהתאם למדיניות האתר.",
  },
];

const recommendedProducts = velmoraProducts.slice(0, 4);

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

function formatPrice(price: number) {
  return `₪${price.toLocaleString("he-IL")}`;
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
            ? "animate-[velmoraProductReverse_42s_linear_infinite]"
            : "animate-[velmoraProductMarquee_42s_linear_infinite]",
        ].join(" ")}
      >
        {repeated.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt="השראה למוצר"
            className="h-[210px] w-[320px] shrink-0 object-cover transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
          />
        ))}
      </div>
    </div>
  );
}

export default function VelmoraProduct({ onPageChange }: Props) {
  const [selectedImage, setSelectedImage] = React.useState(
    selectedProduct.mainImage
  );
  const [selectedSize, setSelectedSize] = React.useState("M");
  const [selectedColor, setSelectedColor] = React.useState<ProductColor>(
    selectedProduct.colors[0]
  );
  const [quantity, setQuantity] = React.useState(1);
  const [openDetail, setOpenDetail] = React.useState<string>("בד");

  function increaseQuantity() {
    setQuantity((current) => current + 1);
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  return (
    <main className="overflow-hidden bg-[#f6f2ea] text-[#27231f]">
      <style>
        {`
          @keyframes velmoraProductMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }

          @keyframes velmoraProductReverse {
            0% { transform: translateX(-33.333%); }
            100% { transform: translateX(0); }
          }
        `}
      </style>

      {/* PRODUCT MAIN */}
      <section className="px-5 pb-24 pt-24">
        <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          {/* IMAGES */}
          <Reveal>
            <div className="grid gap-5 lg:grid-cols-[110px_1fr]">
              <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:grid lg:overflow-visible">
                {selectedProduct.images.map((image) => {
                  const active = selectedImage === image;

                  return (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={[
                        "h-24 w-24 shrink-0 overflow-hidden rounded-[6px] border bg-white transition lg:h-28 lg:w-full",
                        active
                          ? "border-[#292318] ring-2 ring-[#292318]/10"
                          : "border-black/10 hover:border-black/40",
                      ].join(" ")}
                    >
                      <img
                        src={image}
                        alt="תמונת מוצר"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>

              <div className="order-1 overflow-hidden rounded-[8px] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.12)] lg:order-2">
                <img
                  src={selectedImage}
                  alt={selectedProduct.title}
                  className="h-[620px] w-full object-cover transition duration-700 hover:scale-105"
                />
              </div>
            </div>
          </Reveal>

          {/* PRODUCT INFO */}
          <Reveal delay={150}>
            <aside className="sticky top-28 h-fit rounded-[8px] border border-black/10 bg-white/82 p-7 shadow-[0_24px_90px_rgba(0,0,0,0.08)] backdrop-blur">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-black/35">
                    {selectedProduct.ref}
                  </p>

                  <p className="mt-3 text-sm font-bold text-black/45">
                    {selectedProduct.category}
                  </p>
                </div>

                <button
                  type="button"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[#f6f2ea] text-[#292318] transition hover:bg-[#292318] hover:text-white"
                  aria-label="שמירה למועדפים"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              <h1 className="mt-6 [font-family:Georgia,Times_New_Roman,serif] text-[58px] font-normal leading-[0.92] tracking-[-0.055em] text-[#2b2722] md:text-[82px]">
                {selectedProduct.title}
              </h1>

              <div className="mt-5 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star key={item} className="h-4 w-4 fill-current" />
                ))}

                <span className="mr-2 text-sm font-bold text-black/45">
                  4.9 · 128 ביקורות
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <p className="text-3xl font-black text-[#292318]">
                  {formatPrice(selectedProduct.price)}
                </p>

                <p className="text-lg text-black/35 line-through">
                  {formatPrice(selectedProduct.oldPrice)}
                </p>

                <span className="rounded-full bg-[#292318] px-3 py-1 text-xs font-bold text-white">
                  מבצע
                </span>
              </div>

              <p className="mt-6 text-base leading-8 text-black/55">
                {selectedProduct.description}
              </p>

              {/* COLORS */}
              <div className="mt-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-black text-[#292318]">צבע</p>
                  <p className="text-sm text-black/45">
                    {selectedColor.name}
                  </p>
                </div>

                <div className="mt-3 flex gap-2">
                  {selectedProduct.colors.map((color) => {
                    const active = selectedColor.name === color.name;

                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={[
                          "flex h-10 w-10 items-center justify-center rounded-full border transition",
                          active
                            ? "border-[#292318]"
                            : "border-black/10 hover:border-black/40",
                        ].join(" ")}
                        aria-label={color.name}
                      >
                        <span
                          className="h-7 w-7 rounded-full border border-black/10"
                          style={{ backgroundColor: color.value }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SIZES */}
              <div className="mt-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-black text-[#292318]">מידה</p>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-sm font-bold text-black/50 hover:text-black"
                  >
                    מדריך מידות
                    <Ruler className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-5 gap-2">
                  {selectedProduct.sizes.map((size) => {
                    const active = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={[
                          "h-11 rounded-[4px] border text-sm font-black transition",
                          active
                            ? "border-[#292318] bg-[#292318] text-white"
                            : "border-black/10 bg-[#f6f2ea] text-[#292318] hover:border-black",
                        ].join(" ")}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* QUANTITY */}
              <div className="mt-8">
                <p className="text-sm font-black text-[#292318]">כמות</p>

                <div className="mt-3 flex w-fit items-center overflow-hidden rounded-[4px] border border-black/10 bg-[#f6f2ea]">
                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="flex h-11 w-12 items-center justify-center hover:bg-white"
                    aria-label="הגדלת כמות"
                  >
                    <Plus className="h-4 w-4" />
                  </button>

                  <div className="flex h-11 min-w-14 items-center justify-center border-x border-black/10 bg-white px-4 text-sm font-black">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="flex h-11 w-12 items-center justify-center hover:bg-white"
                    aria-label="הקטנת כמות"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-8 grid gap-3">
                <button
                  type="button"
                  className="flex h-13 items-center justify-center gap-3 rounded-[4px] bg-[#292318] px-7 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-black"
                >
                  הוספה לסל
                  <ShoppingBag className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onPageChange("shop")}
                  className="flex h-13 items-center justify-center gap-3 rounded-[4px] border border-black/10 bg-white px-7 py-4 text-sm font-black text-[#292318] transition hover:border-black"
                >
                  חזרה לחנות
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>

              {/* DETAILS ACCORDION */}
              <div className="mt-8 border-t border-black/10 pt-4">
                {productDetails.map((detail) => {
                  const active = openDetail === detail.title;

                  return (
                    <div key={detail.title} className="border-b border-black/10">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDetail(active ? "" : detail.title)
                        }
                        className="flex w-full items-center justify-between gap-4 py-4 text-right"
                      >
                        <span className="text-sm font-black text-[#292318]">
                          {detail.title}
                        </span>

                        <ChevronDown
                          className={[
                            "h-4 w-4 transition",
                            active ? "rotate-180" : "",
                          ].join(" ")}
                        />
                      </button>

                      {active && (
                        <p className="pb-4 text-sm leading-7 text-black/55">
                          {detail.text}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto grid max-w-[1500px] gap-5 md:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <Reveal key={benefit.title} delay={index * 110}>
                <article className="rounded-[8px] border border-black/10 bg-[#f6f2ea] p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#292318] text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-8 [font-family:Georgia,serif] text-3xl">
                    {benefit.title}
                  </h3>

                  <p className="mt-4 leading-7 text-black/55">
                    {benefit.text}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* STORY BLOCK */}
      <section className="bg-[#eee7da] px-5 py-28">
        <div className="mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="text-sm tracking-[0.22em] text-black/45">
              PRODUCT STORY
            </p>

            <SerifTitle className="mt-5 text-5xl md:text-7xl">
              פריט שנבנה סביב תנועה, נוחות ונראות נקייה
            </SerifTitle>

            <p className="mt-7 max-w-xl text-base leading-8 text-black/55 md:text-lg">
              המוצר נבחר כחלק מקולקציה שמדגישה בדים טבעיים, גזרות מדויקות
              ושימושיות לאורך זמן. אפשר לשלב אותו עם פריטים קיימים או לבנות
              סביבו לוק מלא.
            </p>

            <button
              type="button"
              onClick={() => onPageChange("custom")}
              className="mt-8 inline-flex h-12 items-center gap-3 rounded-[4px] bg-[#292318] px-8 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
            >
              התאמת סטיילינג
              <Sparkles className="h-4 w-4" />
            </button>
          </Reveal>

          <Reveal delay={160}>
            <div className="grid grid-cols-2 gap-5">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=90"
                alt="פריט אופנה"
                className="h-[520px] w-full object-cover"
              />

              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=90"
                alt="סטיילינג"
                className="mt-20 h-[520px] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* SIZE / FIT */}
      <section className="bg-white px-5 py-24">
        <div className="mx-auto max-w-[1100px] text-center">
          <Reveal>
            <BadgeCheck className="mx-auto h-10 w-10 text-[#292318]" />

            <SerifTitle className="mx-auto mt-5 max-w-3xl text-5xl md:text-6xl">
              התאמה נכונה מתחילה בפרטים הקטנים
            </SerifTitle>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-black/55">
              ניתן לבחור מידה וצבע, לבדוק זמינות ולהוסיף לסל. עבור התאמה אישית
              יותר, אפשר לעבור לעמוד הסטיילינג ולקבל המלצה מסודרת.
            </p>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-12 grid gap-3 md:grid-cols-5">
              {selectedProduct.sizes.map((size) => (
                <div
                  key={size}
                  className="rounded-[6px] border border-black/10 bg-[#f6f2ea] p-5"
                >
                  <p className="text-sm font-black text-black/35">מידה</p>
                  <p className="mt-2 [font-family:Georgia,serif] text-4xl">
                    {size}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* RECOMMENDED PRODUCTS */}
      <section className="bg-[#f6f2ea] px-5 py-24">
        <div className="mx-auto max-w-[1500px]">
          <Reveal className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm tracking-[0.22em] text-black/45">
                מומלץ להשלים עם
              </p>

              <SerifTitle className="mt-4 text-5xl md:text-6xl">
                פריטים נוספים מהקולקציה
              </SerifTitle>
            </div>

            <button
              type="button"
              onClick={() => onPageChange("shop")}
              className="inline-flex h-11 items-center gap-3 rounded-[4px] bg-[#292318] px-6 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-black"
            >
              כל המוצרים
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {recommendedProducts.map((product, index) => (
              <Reveal key={product.id} delay={index * 110}>
                <button
                  type="button"
                  onClick={() => onPageChange("product")}
                  className="group overflow-hidden rounded-[8px] bg-white text-right shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-[350px] w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="p-5">
                    <p className="text-xs tracking-[0.18em] text-black/35">
                      {product.ref}
                    </p>

                    <h3 className="mt-2 text-xl font-bold">{product.title}</h3>

                    <p className="mt-1 text-sm text-black/45">
                      {product.subtitle}
                    </p>

                    <p className="mt-3 font-black">{product.price}</p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MOVING GALLERY */}
      <section className="bg-white py-24">
        <Reveal>
          <SerifTitle className="mb-12 text-center text-5xl md:text-6xl">
            השראה סביב המוצר
          </SerifTitle>
        </Reveal>

        <MovingGallery images={velmoraGallery} />

        <div className="mt-5">
          <MovingGallery images={[...velmoraGallery].reverse()} reverse />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative bg-[#30261d] px-5 py-28 text-white">
        <img
          src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=90"
          alt="קולקציית אופנה"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />

        <div className="absolute inset-0 bg-black/45" />

        <Reveal className="relative mx-auto max-w-4xl text-center">
          <ShoppingBag className="mx-auto h-10 w-10" />

          <h2 className="mt-6 [font-family:Georgia,serif] text-5xl font-normal leading-tight tracking-[-0.04em] md:text-7xl">
            אפשר להוסיף לסל או להמשיך לבחור פריטים
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/70">
            עמוד מוצר מלא מאפשר ללקוחות לראות תמונות, לבחור מידה, צבע וכמות,
            לקרוא פרטים ולהמשיך לחנות או לסטיילינג אישי.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="h-12 rounded-[4px] bg-white px-8 text-sm font-bold text-[#292318] transition hover:-translate-y-1"
            >
              הוספה לסל
            </button>

            <button
              type="button"
              onClick={() => onPageChange("shop")}
              className="h-12 rounded-[4px] border border-white/30 px-8 text-sm font-bold text-white transition hover:bg-white hover:text-[#292318]"
            >
              חזרה לחנות
            </button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}