"use client";

import React, { useEffect, useRef, useState } from "react";
import ImageLoader from "@components/ImageLoader";

type GalleryImage = {
  preview: string;
  publicId: string;
};

type עסקDetails = {
  _id?: string;
  gallery?: string[];
  galleryImageIds?: string[];
  businessName?: string;
  [key: string]: unknown;
};

type GallerySectionProps = {
  businessDetails: עסקDetails;
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

  const [תמונות, setתמונות] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const gallery = businessDetails.gallery ?? [];
    const ids = businessDetails.galleryImageIds ?? [];

    const mapped = gallery.map((url, idx) => ({
      preview: url,
      publicId: ids[idx] || `temp-${idx}`,
    }));

    setתמונות(mapped);
  }, [businessDetails.gallery, businessDetails.galleryImageIds]);

  const onDelete = (publicId: string) => {
    if (isSaving) return;

    const ok = window.confirm("להסיר את התמונה הזו מהגלריה?");
    if (!ok) return;

    setתמונות((prev) => prev.filter((img) => img.publicId !== publicId));
    handleDeleteImage(publicId);
  };

  const hasתמונות = תמונות.length > 0;
  const featuredImage = תמונות[0]?.preview;

  return (
    <section dir="rtl" className="grid gap-6 text-right xl:grid-cols-[1.05fr_0.95fr]">
      {/* EDIT FORM - LEFT SIDE */}
      <div
        ref={containerRef}
        className="order-1 relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] xl:order-1"
      >
        <div className="border-b border-slate-100 bg-gradient-to-br from-white via-slate-50 to-violet-50 px-6 py-7 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-xs font-black text-violet-700">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            ניהול גלריה
          </div>

          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                תמונות גלריה
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                העלה ונהל את התמונות שמופיעות בגלריית הפרופיל העסקי שלך.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                סה״כ תמונות
              </p>
              <p className="mt-1 text-2xl font-black text-slate-950">
                {תמונות.length}
              </p>
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
            className="group flex w-full flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-violet-300 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white text-4xl shadow-sm transition group-hover:scale-105 group-hover:shadow-lg">
              📸
            </div>

            <h3 className="mt-5 text-xl font-black text-slate-950">
              לחץ להעלאת תמונות
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              אפשר להעלות כמה תמונות יחד. מומלץ להשתמש בתמונות איכותיות כדי שהפרופיל הציבורי ייראה מקצועי ויוקרתי.
            </p>

            <span className="mt-5 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/20 transition group-hover:bg-violet-700">
              בחירת תמונות
            </span>
          </button>

          <div className="rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  גלריה שהועלתה
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  נהל, הצג ומחק תמונות מהגלריה.
                </p>
              </div>

              {hasתמונות && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                  {תמונות.length} תמונות
                </span>
              )}
            </div>


            {!hasתמונות ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                  🖼️
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-950">
                  עדיין אין תמונות בגלריה
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  התחל בהעלאת תמונות. הן יופיעו כאן וגם בתצוגה המקדימה של הפרופיל הציבורי.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {תמונות.map(({ preview, publicId }, index) => (
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
                      <div className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-black text-white backdrop-blur">
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

          {hasתמונות && !isSaving && (
            <div className="sticky bottom-4 z-10 rounded-[1.5rem] border border-white/80 bg-white/85 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
              <button
                type="button"
                onClick={() =>
                  navigate(`/business/${businessDetails._id}?tab=gallery`)
                }
                className="flex h-13 w-full items-center justify-center rounded-2xl bg-slate-950 px-6 text-sm font-black text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                צפייה בפרופיל הציבורי
              </button>
            </div>
          )}
        </div>

        {isSaving && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="rounded-[1.5rem] border border-white bg-white px-6 py-5 text-center shadow-2xl">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />
              <p className="text-sm font-black text-slate-950">
                שומר שינויים…
              </p>
            </div>
          </div>
        )}
      </div>

      {/* PREVIEW - RIGHT SIDE */}
      <aside className="order-2 xl:order-2">
        <div className="sticky top-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          {renderTopBar && (
            <div className="border-b border-slate-100 bg-white/80 px-5 py-4">
              {renderTopBar()}
            </div>
          )}

          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 p-5 text-white sm:p-6">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black text-white/75 backdrop-blur">
                    תצוגה מקדימה של הפרופיל הציבורי
                  </div>

                  <h2 className="mt-3 text-3xl font-black tracking-tight">
                    הגלריה שלנו
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/60">
                    כך הגלריה תיראה בפרופיל העסקי הציבורי.
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl shadow-xl backdrop-blur">
                  📸
                </div>
              </div>

              {featuredImage ? (
                <div className="mb-4 overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/10 shadow-2xl">
                  <ImageLoader
                    src={featuredImage}
                    alt="תמונת גלריה מובילה"
                    className="h-64 w-full object-cover sm:h-80"
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-64 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-white/20 bg-white/10 text-center backdrop-blur sm:h-80">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                    🖼️
                  </div>

                  <h3 className="mt-4 text-lg font-black">
                    אין תמונות בגלריה
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-white/55">
                    העלה תמונות כדי שהפרופיל הציבורי ייראה מקצועי יותר.
                  </p>
                </div>
              )}

              {hasתמונות && (
                <div className="grid grid-cols-3 gap-3">
                  {תמונות.slice(0, 6).map(({ preview, publicId }, index) => (
                    <div
                      key={`${publicId}-${index}`}
                      className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg"
                    >
                      <ImageLoader
                        src={preview}
                        alt={`תמונת גלריה ${index + 1}`}
                        className="h-24 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-wide text-white/45">
                    תמונות
                  </p>
                  <p className="mt-1 text-2xl font-black">{תמונות.length}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-wide text-white/45">
                    סטטוס
                  </p>
                  <p className="mt-1 text-lg font-black">
                    {hasתמונות ? "פעיל" : "ריק"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}