"use client";

import React, { useMemo, useState } from "react";
import Icon from "@/components/UI/Icon";

type RatingKey =
  | "service"
  | "professionalism"
  | "professional"
  | "timeliness"
  | "timing"
  | "availability"
  | "valueForMoney"
  | "value"
  | "goalAchievement"
  | "goal"
  | "overall"
  | "experience";

type RatingValue = number | string | null | undefined;

type ReviewClient =
  | string
  | {
      name?: string;
      fullName?: string;
      [key: string]: unknown;
    };

type Review = {
  _id?: string;
  id?: string;
  client?: ReviewClient;
  user?: string;
  userName?: string;
  name?: string;
  comment?: string;
  text?: string;
  createdAt?: string | Date;
  date?: string | Date;
  averageScore?: number | string;
  rating?: number | string;
  ratings?: Partial<Record<RatingKey, RatingValue>>;
  [key: string]: unknown;
};

type ReviewCardProps = {
  review?: Review | null;
  isPreview?: boolean;
};

type RatingMeta = {
  label: string;
  icon: string;
};

const ratingLabels: Record<string, RatingMeta> = {
  service: { label: "שירות", icon: "service" },
  professional: { label: "מקצועיות", icon: "professionalism" },
  professionalism: { label: "מקצועיות", icon: "professionalism" },
  timing: { label: "עמידה בזמנים", icon: "timeliness" },
  timeliness: { label: "עמידה בזמנים", icon: "timeliness" },
  availability: { label: "זמינות", icon: "availability" },
  value: { label: "תמורה למחיר", icon: "valueForMoney" },
  valueForMoney: { label: "תמורה למחיר", icon: "valueForMoney" },
  goal: { label: "השגת מטרה", icon: "goalAchievement" },
  goalAchievement: { label: "השגת מטרה", icon: "goalAchievement" },
  experience: { label: "חוויה כללית", icon: "overall" },
  overall: { label: "חוויה כללית", icon: "overall" },
};

function toNumber(value: RatingValue) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function getClientName(review: Review) {
  if (typeof review.client === "string" && review.client.trim()) {
    return review.client;
  }

  if (review.client && typeof review.client === "object") {
    return review.client.name || review.client.fullName || "לקוח אנונימי";
  }

  return review.userName || review.user || review.name || "לקוח אנונימי";
}

function getReviewText(review: Review) {
  return review.comment || review.text || "";
}

function formatDate(date?: string | Date) {
  if (!date) return "לא צוין תאריך";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date);

  return parsed.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getRatingEntries(review: Review) {
  const ratings = review.ratings || {};

  return Object.entries(ratings)
    .map(([key, value]) => {
      const numericValue = toNumber(value);
      if (numericValue === null) return null;

      return {
        key,
        value: Math.max(0, Math.min(5, numericValue)),
        meta: ratingLabels[key] || {
          label: key,
          icon: "rating",
        },
      };
    })
    .filter(
      (
        item
      ): item is {
        key: string;
        value: number;
        meta: RatingMeta;
      } => item !== null
    );
}

function getAverage(review: Review, ratingEntries: { value: number }[]) {
  const averageScore = toNumber(review.averageScore);
  if (averageScore !== null) return Math.max(0, Math.min(5, averageScore));

  const directRating = toNumber(review.rating);
  if (directRating !== null) return Math.max(0, Math.min(5, directRating));

  if (ratingEntries.length > 0) {
    const total = ratingEntries.reduce((sum, item) => sum + item.value, 0);
    return Number((total / ratingEntries.length).toFixed(1));
  }

  return 0;
}

function getRatingText(average: number) {
  if (!average) return "ללא דירוג";
  if (average >= 4.7) return "מצוין";
  if (average >= 4.3) return "מעולה";
  if (average >= 4) return "טוב מאוד";
  if (average >= 3) return "טוב";
  return "דורש שיפור";
}

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
    size === "xs"
      ? "text-xs"
      : size === "md"
        ? "text-lg"
        : "text-sm";

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

export default function ReviewCard({
  review,
  isPreview = false,
}: ReviewCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const ratingEntries = useMemo(() => {
    if (!review) return [];
    return getRatingEntries(review);
  }, [review]);

  if (!review) return null;

  const average = getAverage(review, ratingEntries);
  const clientName = getClientName(review);
  const reviewText = getReviewText(review);
  const reviewDate = formatDate(review.createdAt || review.date);
  const ratingText = getRatingText(average);
  const hasDetails = ratingEntries.length > 0;
  const shouldShowDetails = isPreview || showDetails;

  return (
    <article
      dir="rtl"
      className={[
        "group relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-white p-4 text-right shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition",
        isPreview
          ? "shadow-sm"
          : "hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(124,58,237,0.16)]",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 right-10 h-36 w-36 rounded-full bg-blue-200/25 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-lg font-black text-violet-700 shadow-sm">
              {clientName.trim().charAt(0) || "ל"}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-black text-slate-950">
                {clientName}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <StarDisplay rating={average} size="sm" />

                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">
                  {average ? `${average.toFixed(1)} / 5` : "אין דירוג"}
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
            <p
              className={[
                "text-sm leading-7 text-slate-600",
                showDetails || isPreview ? "" : "line-clamp-3",
              ].join(" ")}
            >
              ״{reviewText}״
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50/70 px-4 py-3">
            <p className="text-sm font-semibold text-slate-400">
              לא נכתבה תגובה מילולית לביקורת הזו.
            </p>
          </div>
        )}

        {hasDetails && !isPreview && (
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-violet-50 px-4 py-2 text-xs font-black text-violet-700 transition hover:bg-violet-100"
          >
            {showDetails ? "הסתר פירוט ▲" : "הצגת פירוט דירוגים ▼"}
          </button>
        )}

        {hasDetails && shouldShowDetails && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-sm font-black text-slate-950">
                פירוט דירוגים
              </h4>

              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
                {ratingEntries.length} פרמטרים
              </span>
            </div>

            <div className="grid gap-2">
              {ratingEntries.map(({ key, value, meta }) => (
                <div
                  key={key}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
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
          </div>
        )}

        {!hasDetails && !isPreview && (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-bold text-slate-400">
            אין פירוט דירוגים לביקורת הזו.
          </div>
        )}
      </div>
    </article>
  );
}