"use client";

import React, { useEffect, useRef, useState } from "react";
import ImageLoader from "@components/ImageLoader";

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

    const mapped = gallery.map((url, idx) => ({
      preview: url,
      publicId: ids[idx] || `temp-${idx}`,
    }));

    setImages(mapped);
  }, [businessDetails.gallery, businessDetails.galleryImageIds]);

  const onDelete = (publicId: string) => {
    if (isSaving) return;

    const ok = window.confirm("Remove this image from the gallery?");
    if (!ok) return;

    setImages((prev) => prev.filter((img) => img.publicId !== publicId));
    handleDeleteImage(publicId);
  };

  const hasImages = images.length > 0;
  const featuredImage = images[0]?.preview;

  return (
    <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      {/* EDIT FORM - LEFT SIDE */}
      <div
        ref={containerRef}
        className="order-1 relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] xl:order-1"
      >
        <div className="border-b border-slate-100 bg-gradient-to-br from-white via-slate-50 to-violet-50 px-6 py-7 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-xs font-black text-violet-700">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            Gallery Manager
          </div>

          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Gallery Images
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Upload and manage the photos that appear in your business
                profile gallery.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Total Images
              </p>
              <p className="mt-1 text-2xl font-black text-slate-950">
                {images.length}
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
              Click to upload images
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              You can upload multiple images at once. Use high-quality photos to
              make the public profile look premium.
            </p>

            <span className="mt-5 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/20 transition group-hover:bg-violet-700">
              Choose Images
            </span>
          </button>

          <div className="rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Uploaded Gallery
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage, preview and remove gallery images.
                </p>
              </div>

              {hasImages && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                  {images.length} images
                </span>
              )}
            </div>

            {!hasImages ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                  🖼️
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-950">
                  No images in the gallery yet
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Start by uploading photos. They will appear here and inside
                  the public profile preview.
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
                      alt={`Gallery image ${index + 1}`}
                      className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {index === 0 && (
                      <div className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-black text-white backdrop-blur">
                        Featured
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => onDelete(publicId)}
                      disabled={isSaving}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-sm shadow-lg transition hover:scale-105 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Delete image"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {hasImages && !isSaving && (
            <div className="sticky bottom-4 z-10 rounded-[1.5rem] border border-white/80 bg-white/85 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
              <button
                type="button"
                onClick={() =>
                  navigate(`/business/${businessDetails._id}?tab=gallery`)
                }
                className="flex h-13 w-full items-center justify-center rounded-2xl bg-slate-950 px-6 text-sm font-black text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                View Public Profile
              </button>
            </div>
          )}
        </div>

        {isSaving && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="rounded-[1.5rem] border border-white bg-white px-6 py-5 text-center shadow-2xl">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />
              <p className="text-sm font-black text-slate-950">
                Saving changes…
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
                    Public profile preview
                  </div>

                  <h2 className="mt-3 text-3xl font-black tracking-tight">
                    Our Gallery
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/60">
                    This is how your gallery will look on the public business
                    profile.
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
                    alt="Featured gallery image"
                    className="h-64 w-full object-cover sm:h-80"
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-64 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-white/20 bg-white/10 text-center backdrop-blur sm:h-80">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                    🖼️
                  </div>

                  <h3 className="mt-4 text-lg font-black">
                    No images in the gallery
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-white/55">
                    Upload images to make your public profile look more
                    professional.
                  </p>
                </div>
              )}

              {hasImages && (
                <div className="grid grid-cols-3 gap-3">
                  {images.slice(0, 6).map(({ preview, publicId }, index) => (
                    <div
                      key={`${publicId}-${index}`}
                      className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg"
                    >
                      <ImageLoader
                        src={preview}
                        alt={`Gallery image ${index + 1}`}
                        className="h-24 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-wide text-white/45">
                    Images
                  </p>
                  <p className="mt-1 text-2xl font-black">{images.length}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-wide text-white/45">
                    Status
                  </p>
                  <p className="mt-1 text-lg font-black">
                    {hasImages ? "Active" : "Empty"}
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