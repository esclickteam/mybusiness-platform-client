"use client";

import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/UI/Icon";
import {
  getReviewAverage,
  getReviewClientName,
  getReviewDateLabel,
  getReviewRatingEntries,
  getReviewRatingLabel,
  getReviewText,
  type ReviewRecord,
} from "@/utils/reviewDisplay";

type ReviewDetailModalProps = {
  review: ReviewRecord | null;
  open: boolean;
  onClose: () => void;
};

function StarDisplay({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "xs" | "sm" | "md";
}) {
  const safeRating = Math.max(0, Math.min(5, rating));
  const full = Math.floor(safeRating);
  const half = safeRating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  const sizeClass =
    size === "xs" ? "text-xs" : size === "md" ? "text-xl" : "text-sm";

  return (
    <span
      dir="ltr"
      aria-label={`דירוג ${safeRating.toFixed(1)} מתוך 5`}
      className={[
        "inline-flex items-center whitespace-nowrap tracking-[1px] text-amber-400",
        sizeClass,
      ].join(" ")}
    >
      {"★".repeat(full)}
      {half ? "★" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

export default function ReviewDetailModal({
  review,
  open,
  onClose,
}: ReviewDetailModalProps) {
  const ratingEntries = useMemo(
    () => (review ? getReviewRatingEntries(review) : []),
    [review]
  );

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!review) return null;

  const average = getReviewAverage(review, ratingEntries);
  const clientName = getReviewClientName(review);
  const reviewText = getReviewText(review);
  const reviewDate = getReviewDateLabel(review.createdAt || review.date);
  const ratingText = getReviewRatingLabel(average);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[10050] flex items-start justify-center overflow-y-auto overscroll-contain bg-slate-950/45 p-4 backdrop-blur-sm sm:p-6"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            dir="rtl"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="relative my-auto w-full max-w-xl overflow-hidden rounded-[2rem] bg-white text-right shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-detail-title"
          >
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-violet-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-8 h-52 w-52 rounded-full bg-blue-200/30 blur-3xl" />

            <button
              type="button"
              aria-label="סגירת פירוט הביקורת"
              onClick={onClose}
              className="absolute left-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-xl font-black text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
            >
              ×
            </button>

            <div className="relative border-b border-slate-100 px-6 pb-5 pt-7 sm:px-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700">
                <Icon name="rating" size={14} />
                פירוט ביקורת
              </div>

              <div className="mt-4 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-xl font-black text-violet-700 shadow-sm">
                  {clientName.trim().charAt(0) || "ל"}
                </div>

                <div className="min-w-0 flex-1">
                  <h2
                    id="review-detail-title"
                    className="text-2xl font-black text-slate-950"
                  >
                    {clientName}
                  </h2>

                  <p className="mt-1 text-sm font-bold text-slate-500">
                    {reviewDate}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StarDisplay rating={average} size="md" />
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-black text-amber-700">
                      {average ? `${average.toFixed(1)} / 5` : "אין דירוג"}
                    </span>
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-black text-violet-700">
                      {ratingText}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative max-h-[min(70dvh,640px)] space-y-5 overflow-y-auto px-6 py-5 sm:px-7">
              <section>
                <h3 className="text-sm font-black text-slate-900">
                  תגובת הלקוח
                </h3>

                {reviewText ? (
                  <div className="mt-3 rounded-[1.25rem] border border-slate-100 bg-slate-50/80 px-4 py-4">
                    <p className="text-sm leading-8 text-slate-600">
                      ״{reviewText}״
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm font-semibold text-slate-400">
                    לא נכתבה תגובה מילולית לביקורת הזו.
                  </p>
                )}
              </section>

              {ratingEntries.length > 0 ? (
                <section>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-black text-slate-900">
                      פירוט דירוגים
                    </h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                      {ratingEntries.length} פרמטרים שדורגו
                    </span>
                  </div>

                  <div className="grid gap-2">
                    {ratingEntries.map(({ key, value, meta }) => (
                      <div
                        key={key}
                        className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
                            <Icon name={meta.icon} size={16} />
                          </span>
                          <span>{meta.label}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                          <StarDisplay rating={value} size="xs" />
                          <span dir="ltr" className="text-slate-500">
                            ({value.toFixed(1)})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-4 text-sm font-bold text-slate-400">
                  לא נבחרו פרמטרי דירוג מפורטים לביקורת הזו.
                </section>
              )}
            </div>

            <div className="relative border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:px-7">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-violet-600 text-sm font-black text-white transition hover:bg-violet-700"
              >
                סגירה
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
