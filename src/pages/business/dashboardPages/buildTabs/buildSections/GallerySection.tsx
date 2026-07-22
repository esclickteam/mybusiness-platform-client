"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ImageLoader from "@components/ImageLoader";
import BizuplyLoader from "../../../../../components/ui/BizuplyLoader";

type GalleryImage = {
  preview: string;
  publicId: string;
};

type BusinessDetails = {
  _id?: string;
  gallery?: string[];
  galleryImageIds?: string[];
  businessName?: string;
  [key: string]: unknown;
};

type GallerySectionProps = {
  businessDetails: BusinessDetails;
  galleryInputRef?: React.RefObject<HTMLInputElement>;
  handleGalleryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteImage: (publicId: string) => void;
  isSaving?: boolean;
  renderTopBar?: () => React.ReactNode;
  navigate: (path: string) => void;
};

export default function GallerySection({
  businessDetails,
  galleryInputRef,
  handleGalleryChange,
  handleDeleteImage,
  isSaving = false,
  renderTopBar,
  navigate,
}: GallerySectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fallbackGalleryInputRef = useRef<HTMLInputElement | null>(null);

  const activeGalleryInputRef = galleryInputRef ?? fallbackGalleryInputRef;

  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const gallery = businessDetails.gallery ?? [];
    const ids = businessDetails.galleryImageIds ?? [];

    const mapped: GalleryImage[] = gallery.map((url, idx) => ({
      preview: url,
      publicId: ids[idx] || `temp-${idx}`,
    }));

    setImages(mapped);
  }, [businessDetails.gallery, businessDetails.galleryImageIds]);

  const hasImages = images.length > 0;
  const featuredImage = images[0]?.preview;
  const businessName = businessDetails.businessName || "העסק שלך";

  const previewImages = useMemo(() => images.slice(0, 6), [images]);

  const onDelete = (publicId: string) => {
    if (isSaving) return;

    const ok = window.confirm("להסיר את התמונה הזו מהגלריה?");
    if (!ok) return;

    setImages((prev) => prev.filter((img) => img.publicId !== publicId));
    handleDeleteImage(publicId);
  };

  return (
    <section
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.10),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-6 text-right text-slate-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-7 xl:grid-cols-[1.02fr_0.98fr]">
        <div
          ref={containerRef}
          className="order-1 relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_28px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl"
        >
          <div className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-br from-white via-violet-50 to-blue-50 px-6 py-8 sm:px-8">
            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-violet-300/35 blur-3xl" />
            <div className="absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-violet-100 bg-white/80 px-4 py-1.5 text-xs font-black text-violet-700 shadow-sm backdrop-blur">
                  ניהול גלריה
                </div>

                <div className="inline-flex rounded-full border border-blue-100 bg-white/80 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-sm backdrop-blur">
                  תצוגה חיה בזמן אמת
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    תמונות גלריה
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    העלה ונהל את התמונות שמופיעות בגלריית הפרופיל העסקי שלך.
                    תמונות איכותיות גורמות לעמוד להיראות אמין, יוקרתי ומקצועי
                    יותר.
                  </p>
                </div>

                <div className="w-full rounded-2xl border border-white bg-white/85 px-5 py-4 shadow-lg backdrop-blur sm:w-auto">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    סה״כ תמונות
                  </p>
                  <p className="mt-1 text-3xl font-black text-slate-950">
                    {images.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-8">
            <input
              type="file"
              multiple
              accept="image/*"
              ref={activeGalleryInputRef}
              className="hidden"
              disabled={isSaving}
              onChange={handleGalleryChange}
            />

            <button
              type="button"
              disabled={isSaving}
              onClick={() => activeGalleryInputRef.current?.click()}
              className="group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border-2 border-dashed border-violet-200 bg-gradient-to-br from-violet-50 via-white to-blue-50 px-6 py-10 text-center transition hover:border-violet-400 hover:shadow-[0_22px_70px_rgba(124,58,237,0.16)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-violet-300/25 blur-3xl" />
              <div className="absolute -bottom-16 right-10 h-44 w-44 rounded-full bg-blue-300/25 blur-3xl" />

              <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white text-4xl shadow-lg transition group-hover:scale-105 group-hover:shadow-xl">
                📸
              </div>

              <h3 className="relative mt-5 text-xl font-black text-slate-950">
                לחץ להעלאת תמונות
              </h3>

              <p className="relative mt-2 max-w-md text-sm leading-7 text-slate-500">
                אפשר להעלות כמה תמונות יחד. מומלץ להשתמש בתמונות חדות, מוארות
                ורוחביות כדי שהפרופיל הציבורי ייראה מקצועי יותר.
              </p>

              <span className="relative mt-5 inline-flex rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-violet-500/20 transition group-hover:-translate-y-0.5">
                בחירת תמונות
              </span>
            </button>

            <div className="rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-950">
                    גלריה שהועלתה
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    נהל, הצג ומחק תמונות מהגלריה.
                  </p>
                </div>

                {hasImages && (
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                    {images.length} תמונות
                  </span>
                )}
              </div>

              {!hasImages ? (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                    🖼️
                  </div>

                  <h3 className="mt-4 text-lg font-black text-slate-950">
                    עדיין אין תמונות בגלריה
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    התחל בהעלאת תמונות. הן יופיעו כאן וגם בתצוגה המקדימה של
                    הפרופיל הציבורי.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {images.map(({ preview, publicId }, index) => (
                    <div
                      key={`${publicId}-${index}`}
                      className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm"
                    >
                      <ImageLoader
                        src={preview}
                        alt={`תמונת גלריה ${index + 1}`}
                        className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      {index === 0 && (
                        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-violet-700 shadow-sm backdrop-blur">
                          מובילה
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => onDelete(publicId)}
                        disabled={isSaving}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-sm shadow-lg transition hover:scale-105 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="מחיקת תמונה"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {hasImages && !isSaving && (
              <div className="sticky bottom-4 z-10 rounded-[1.5rem] border border-white/80 bg-white/90 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/business/${businessDetails._id}?tab=gallery`)
                  }
                  className="flex h-[52px] w-full items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 text-sm font-black text-white shadow-xl shadow-violet-500/20 transition hover:-translate-y-0.5"
                >
                  צפייה בפרופיל הציבורי
                </button>
              </div>
            )}
          </div>

          {isSaving && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
              <div className="rounded-[1.5rem] border border-white bg-white px-6 py-5 text-center shadow-2xl">
                <BizuplyLoader size="lg" />
                <p className="text-sm font-black text-slate-950">
                  שומר שינויים…
                </p>
              </div>
            </div>
          )}
        </div>

        <aside className="order-2">
          <div className="sticky top-6 overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_28px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            {renderTopBar && (
              <div className="border-b border-slate-100 bg-white/80 px-5 py-4">
                {renderTopBar()}
              </div>
            )}

            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.14),transparent_32%)]" />

              <div className="relative p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black text-violet-700">
                      תצוגה מקדימה של הפרופיל הציבורי
                    </p>
                    <h2 className="mt-1 text-xl font-black text-slate-950">
                      הגלריה של {businessName}
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-xl text-white shadow-lg shadow-violet-500/20">
                    📸
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.7rem] border border-white/80 bg-white shadow-2xl">
                  <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-blue-50">
                    {featuredImage ? (
                      <ImageLoader
                        src={featuredImage}
                        alt="תמונת גלריה מובילה"
                        className="h-72 w-full object-cover sm:h-80"
                      />
                    ) : (
                      <div className="flex h-72 w-full flex-col items-center justify-center text-center sm:h-80">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-lg">
                          🖼️
                        </div>

                        <h3 className="mt-4 text-lg font-black text-slate-950">
                          אין תמונות בגלריה
                        </h3>

                        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                          העלה תמונות כדי שהפרופיל הציבורי ייראה מקצועי יותר.
                        </p>
                      </div>
                    )}

                    <div className="absolute bottom-4 right-4 rounded-full border border-white bg-white/85 px-4 py-2 text-xs font-black text-violet-700 shadow-sm backdrop-blur">
                      גלריה ציבורית
                    </div>

                    <div className="absolute bottom-4 left-4 rounded-full border border-white bg-white/85 px-4 py-2 text-xs font-black text-blue-700 shadow-sm backdrop-blur">
                      {images.length} תמונות
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-950">
                          הגלריה שלנו
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          כך התמונות יופיעו בפרופיל העסקי הציבורי.
                        </p>
                      </div>

                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-black",
                          hasImages
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500",
                        ].join(" ")}
                      >
                        {hasImages ? "פעיל" : "ריק"}
                      </span>
                    </div>

                    {hasImages ? (
                      <div className="mt-5 grid grid-cols-3 gap-3">
                        {previewImages.map(({ preview, publicId }, index) => (
                          <div
                            key={`${publicId}-${index}`}
                            className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm"
                          >
                            <ImageLoader
                              src={preview}
                              alt={`תמונת גלריה ${index + 1}`}
                              className="h-24 w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-5 grid grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                          <div
                            key={item}
                            className="h-24 rounded-2xl border border-dashed border-slate-200 bg-slate-50"
                          />
                        ))}
                      </div>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                          תמונות
                        </p>
                        <p className="mt-1 text-2xl font-black text-slate-950">
                          {images.length}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                          סטטוס
                        </p>
                        <p className="mt-1 text-lg font-black text-slate-950">
                          {hasImages ? "פעיל" : "ריק"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}