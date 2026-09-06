"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/ui/Icon";
import ReviewDetailModal from "@/components/ReviewDetailModal";
import {
  getReviewAverage,
  getReviewClientName,
  getReviewDateLabel,
  getReviewRatingEntries,
  getReviewRatingLabel,
  getReviewText,
  type ReviewRecord,
} from "@/utils/reviewDisplay";
import { getTextDirection } from "../i18n/localeUtils";

type ReviewCardProps = {
  review?: ReviewRecord | null;
  isPreview?: boolean;
  highlighted?: boolean;
  reviewDomId?: string;
};

function StarDisplay({
  rating,
  size = "sm",
  ariaLabel,
}: {
  rating: number;
  size?: "xs" | "sm" | "md";
  ariaLabel: string;
}) {
  const safeRating = Math.max(0, Math.min(5, rating));
  const full = Math.floor(safeRating);
  const half = safeRating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  const sizeClass =
    size === "xs" ? "text-xs" : size === "md" ? "text-lg" : "text-sm";

  return (
    <span
      dir="ltr"
      aria-label={ariaLabel}
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

export default function ReviewCard({
  review,
  isPreview = false,
  highlighted = false,
  reviewDomId,
}: ReviewCardProps) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const [modalOpen, setModalOpen] = useState(false);

  const ratingEntries = useMemo(() => {
    if (!review) return [];
    return getReviewRatingEntries(review);
  }, [review, i18n.language]);

  if (!review) return null;

  const average = getReviewAverage(review, ratingEntries);
  const clientName = getReviewClientName(review);
  const reviewText = getReviewText(review);
  const reviewDate = getReviewDateLabel(review.createdAt || review.date);
  const ratingText = getReviewRatingLabel(average);
  const isInteractive = !isPreview;
  const starsAria = t("leftover.reviews.starsAria", "Rating {{rating}} out of 5", {
    rating: average.toFixed(1),
  });
  const initialFallback = t("leftover.reviews.initialFallback", "C");

  const cardBody = (
    <>
      <div className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 right-10 h-36 w-36 rounded-full bg-blue-200/25 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-lg font-black text-violet-700 shadow-sm">
              {clientName.trim().charAt(0) || initialFallback}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-black text-slate-800">
                {clientName}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <StarDisplay rating={average} size="sm" ariaLabel={starsAria} />

                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">
                  {average
                    ? `${average.toFixed(1)} / 5`
                    : t("leftover.reviews.noRating", "No rating")}
                </span>

                <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-black text-violet-700">
                  {ratingText}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500">
            <Icon name="rating" size={14} />
            <span>{reviewDate}</span>
          </div>
        </div>

        {reviewText ? (
          <div className="mt-4 rounded-[1.25rem] border border-slate-100 bg-slate-50/70 px-4 py-3">
            <p className="line-clamp-3 text-sm leading-7 text-slate-600">
              ״{reviewText}״
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50/70 px-4 py-3">
            <p className="text-sm font-semibold text-slate-400">
              {t("leftover.reviews.noVerbal", "No written comment was added to this review.")}
            </p>
          </div>
        )}

        {isInteractive && (
          <p className="mt-4 text-xs font-black text-violet-600">
            {t("leftover.reviews.clickForDetails", "Click to view full details")}
            {ratingEntries.length > 0
              ? ` · ${t("leftover.reviews.paramsRated", "{{count}} rated parameters", { count: ratingEntries.length })}`
              : ""}
          </p>
        )}
      </div>
    </>
  );

  return (
    <>
      {isInteractive ? (
        <button
          type="button"
          id={reviewDomId}
          dir={pageDir}
          onClick={() => setModalOpen(true)}
          className={[
            "group relative w-full overflow-hidden rounded-[1.6rem] border bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition",
            pageDir === "rtl" ? "text-right" : "text-left",
            "cursor-pointer hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(124,58,237,0.16)] focus:outline-none focus:ring-4 focus:ring-violet-100",
            highlighted
              ? "border-violet-400 ring-4 ring-violet-200 shadow-[0_24px_70px_rgba(124,58,237,0.24)]"
              : "border-white/80",
          ].join(" ")}
        >
          {cardBody}
        </button>
      ) : (
        <article
          id={reviewDomId}
          dir={pageDir}
          className={[
            "group relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-white p-4 shadow-sm",
            pageDir === "rtl" ? "text-right" : "text-left",
            highlighted
              ? "border-violet-400 ring-4 ring-violet-200"
              : "",
          ].join(" ")}
        >
          {cardBody}
        </article>
      )}

      {isInteractive && (
        <ReviewDetailModal
          review={review}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
