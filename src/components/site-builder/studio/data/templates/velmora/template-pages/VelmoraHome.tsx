import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Mail,
  MapPin,
  Phone,
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
        "[font-family:Georgia,serif] font-normal leading-[1.02] tracking-[-0.04em] text-[#2b2722]",
        className,
      ].join(" ")}
    >
      {children}
    </h2>
  );
}

export default function VelmoraHome({ onPageChange }: Props) {
  return (
    <main className="overflow-hidden bg-[#f6f2ea]">
      {/* HERO */}
      <section className="relative min-h-[760px] px-5 pb-0 pt-28">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm tracking-[0.18em] text-black/50">
            בוטיק אופנה, סטיילינג אישי וקולקציות נבחרות.
          </p>

          <h1 className="mx-auto mt-8 max-w-5xl [font-family:Georgia,serif] text-[54px] font-normal leading-[0.95] tracking-[-0.05em] text-[#2b2722] md:text-[86px]">
            אופנה שמרגישה בדיוק נכון
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-black/55">
            ב־ATELIER NOA ניתן למצוא פריטים טבעיים, גזרות מדויקות וחוויית
            קנייה שקטה ונקייה שמתאימה לסגנון יומיומי, עסקי ואישי.
          </p>

          <button
            type="button"
            onClick={() => onPageChange("shop")}
            className="mt-7 inline-flex h-12 items-center gap-3 rounded-[4px] bg-[#292318] px-8 text-sm font-bold text-white transition hover:bg-black"
          >
            לכל הקולקציות
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-auto mt-14 flex max-w-7xl items-end justify-center gap-3 overflow-hidden">
          {velmoraProducts.slice(0, 6).map((product, index) => (
            <button
              key={product.id}
              type="button"
              onClick={() => onPageChange("product")}
              className={[
                "group relative w-[180px] shrink-0 overflow-hidden rounded-t-[18px] border border-black/10 bg-white/60 shadow-[0_18px_50px_rgba(0,0,0,0.08)] transition duration-500 hover:-translate-y-5 hover:shadow-[0_30px_80px_rgba(0,0,0,0.18)]",
                index % 2 === 0 ? "h-[280px]" : "h-[330px]",
              ].join(" ")}
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-white/35" />

              <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-white/95 p-3 text-right shadow-xl transition duration-500 group-hover:translate-y-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">
                  {product.ref}
                </p>
                <p className="mt-1 text-xs font-bold text-black">
                  {product.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SECOND SECTION */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1300&q=90"
              alt="בוטיק אופנה"
              className="h-[430px] w-full object-cover"
            />

            <div className="absolute inset-6 border border-black/20" />
          </div>

          <div className="max-w-lg">
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
              className="mt-7 inline-flex items-center gap-3 border-b border-black pb-2 text-sm font-medium"
            >
              לגלות את המותג
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* MOVING TEXT / SLIDER FEEL */}
      <section className="relative bg-[#4a3726] py-20 text-white">
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=90"
          alt="סטודיו"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="max-w-xl rounded-[6px] bg-white/92 p-8 text-[#2b2722] shadow-2xl">
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
              className="mt-5 inline-flex items-center gap-3 text-sm font-medium"
            >
              קראו עוד
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="h-2 w-2 rounded-full bg-white/40" />
            <span className="h-2 w-2 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      {/* COLLECTION CARDS */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <SerifTitle className="text-center text-4xl md:text-5xl">
            הקולקציות שלנו
          </SerifTitle>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {velmoraProjects.map((project) => (
              <button
                key={project.title}
                type="button"
                onClick={() => onPageChange("projects")}
                className="group relative overflow-hidden rounded-[6px] border border-black/10 bg-[#f6f2ea] text-right shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/45" />

                <div className="absolute inset-0 flex translate-y-6 flex-col justify-end p-5 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-xl [font-family:Georgia,serif] text-white">
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
                  <button
                    type="button"
                    className="mt-3 border-b border-black text-sm"
                  >
                    לגלות
                  </button>
                </div>
              </button>
            ))}

            <button
              type="button"
              onClick={() => onPageChange("shop")}
              className="group relative overflow-hidden rounded-[6px] border border-black/10 bg-[#3c3023] p-8 text-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <SerifTitle className="text-3xl text-white">
                קולקציית מעבר
              </SerifTitle>

              <p className="mt-4 leading-7 text-white/70">
                שכבות קלות, גוונים רכים ופריטים שמתאימים לעונות מעבר.
              </p>

              <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs font-bold">
                צפייה בפריטים
                <ArrowLeft className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* CUSTOM BOX */}
      <section className="relative bg-[#f6f2ea] px-5 py-24">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.8fr_1.2fr_0.8fr] lg:items-center">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=90"
            alt="סקיצה"
            className="h-80 w-full object-cover"
          />

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
              className="mt-7 rounded-[4px] bg-[#292318] px-8 py-3 text-sm font-bold text-white"
            >
              לקביעת פגישה
            </button>
          </div>

          <img
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=90"
            alt="סטיילינג"
            className="h-80 w-full object-cover"
          />
        </div>
      </section>

      {/* GALLERY CAROUSEL */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <SerifTitle className="text-center text-4xl">
            עולם של השראה
          </SerifTitle>

          <div className="mt-10 flex items-center gap-4">
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/15"
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            <div className="flex flex-1 gap-3 overflow-hidden">
              {velmoraGallery.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt="גלריית השראה"
                  className="h-36 w-52 shrink-0 object-cover transition duration-500 hover:-translate-y-2"
                />
              ))}
            </div>

            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/15"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 flex justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-black" />
            <span className="h-2 w-2 rounded-full bg-black/25" />
            <span className="h-2 w-2 rounded-full bg-black/25" />
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="bg-[#f6f2ea] px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
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
          </div>

          <form className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                placeholder="שם מלא"
                className="h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black"
              />

              <input
                placeholder="טלפון"
                className="h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black"
              />
            </div>

            <input
              placeholder="אימייל"
              className="h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black"
            />

            <textarea
              placeholder="הודעה"
              rows={5}
              className="resize-none border border-black/10 bg-white p-4 text-sm outline-none focus:border-black"
            />

            <button
              type="button"
              className="h-11 w-40 bg-[#292318] text-sm font-bold text-white"
            >
              שליחה
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}