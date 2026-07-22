"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import StarRatingChart from "./StarRatingChart";
import ReviewForm from "./ReviewForm";

type ReviewValue = string | number | undefined | null;

type Review = {
  _id?: string;
  id?: string;
  user?: string;
  userName?: string;
  name?: string;
  date?: string | Date;
  comment?: string;
  text?: string;
  rating?: number | string;

  service?: ReviewValue;
  professional?: ReviewValue;
  timing?: ReviewValue;
  availability?: ReviewValue;
  value?: ReviewValue;
  goal?: ReviewValue;
  experience?: ReviewValue;

  isExample?: boolean;
  [key: string]: unknown;
};

type CurrentUser = {
  _id?: string;
  id?: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
};

type SocketLike = {
  emit?: (eventName: string, payload?: unknown) => void;
  on?: (eventName: string, callback: (payload: Review) => void) => void;
  off?: (eventName: string, callback?: (payload: Review) => void) => void;
};

type ReviewsModuleProps = {
  reviews?: Review[];
  currentUser?: CurrentUser | null;
  businessId?: string;
  socket?: SocketLike | null;
  isPreview?: boolean;
  highlightedReviewId?: string;
};

type ParameterKey =
  | "service"
  | "professional"
  | "timing"
  | "availability"
  | "value"
  | "goal"
  | "experience";

const PARAMETERS: Record<ParameterKey, string> = {
  service: "🤝 שירות",
  professional: "💼 מקצועיות",
  timing: "⏰ עמידה בזמנים",
  availability: "📞 זמינות",
  value: "💰 תמורה למחיר",
  goal: "🎯 השגת מטרה",
  experience: "🎉 חוויה כללית",
};

const exampleReviews: Review[] = [
  {
    id: "example-review-1",
    user: "דוד ב.",
    date: "10/03/2025",
    comment:
      "חוויית שירות מעולה! קיבלתי מענה מהיר, מחיר הוגן ועמידה מלאה בזמנים. ממליץ מאוד.",
    service: "5",
    professional: "4.5",
    timing: "5",
    availability: "5",
    value: "4.5",
    goal: "5",
    experience: "4.5",
    isExample: true,
  },
];

function toNumber(value: ReviewValue) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function formatDate(date?: string | Date) {
  if (!date) return "לא צוין תאריך";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getReviewUser(review: Review) {
  return (
    review.userName ||
    review.user ||
    review.name ||
    (review.isExample ? "לקוח לדוגמה" : "לקוח אנונימי")
  );
}

function getReviewComment(review: Review) {
  return review.text || review.comment || "לא נכתב תוכן לביקורת.";
}

function getReviewKey(review: Review, index: number) {
  return review._id || review.id || `${getReviewUser(review)}-${index}`;
}

function getReviewAverage(review: Review) {
  const parameterValues = Object.keys(PARAMETERS)
    .map((key) => toNumber(review[key as ParameterKey] as ReviewValue))
    .filter((value): value is number => value !== null);

  if (parameterValues.length > 0) {
    const total = parameterValues.reduce((sum, value) => sum + value, 0);
    return Number((total / parameterValues.length).toFixed(1));
  }

  const directRating = toNumber(review.rating);
  return directRating !== null ? Number(directRating.toFixed(1)) : null;
}

function StarDisplay({ rating }: { rating: number }) {
  const safeRating = Math.max(0, Math.min(5, rating));
  const full = Math.floor(safeRating);
  const half = safeRating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span
      dir="ltr"
      aria-label={`דירוג ${safeRating} מתוך 5`}
      className="whitespace-nowrap text-sm tracking-[1px] text-amber-500"
    >
      {"★".repeat(full)}
      {half && "✩"}
      {"☆".repeat(empty)}
    </span>
  );
}

function ReviewCard({
  review,
  isPreview = false,
  highlighted = false,
  reviewDomId,
}: {
  review: Review;
  isPreview?: boolean;
  highlighted?: boolean;
  reviewDomId?: string;
}) {
  const [open, setOpen] = useState(false);

  const avg = getReviewAverage(review);
  const comment = getReviewComment(review);

  const availableDetails = Object.entries(PARAMETERS).filter(([key]) => {
    const value = review[key as ParameterKey] as ReviewValue;
    return value !== undefined && value !== null && value !== "";
  });

  const shouldShowDetails = (open || isPreview) && availableDetails.length > 0;

  return (
    <div
      id={reviewDomId}
      dir="rtl"
      className={[
        "overflow-hidden rounded-[1.5rem] border bg-white p-4 text-right shadow-[0_14px_38px_rgba(15,23,42,0.06)] transition",
        highlighted
          ? "border-violet-400 ring-4 ring-violet-200 shadow-[0_24px_70px_rgba(124,58,237,0.24)]"
          : review.isExample
            ? "border-violet-200 bg-gradient-to-br from-white to-violet-50"
            : "border-slate-200",
        isPreview ? "shadow-none" : "hover:-translate-y-0.5 hover:shadow-xl",
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <strong className="block truncate text-sm font-black text-slate-800">
            {getReviewUser(review)}
          </strong>

          {review.isExample && (
            <span className="mt-2 inline-flex rounded-full bg-violet-100 px-3 py-1 text-[11px] font-black text-violet-700">
              ביקורת לדוגמה
            </span>
          )}
        </div>

        <span className="shrink-0 text-xs font-bold text-slate-400">
          🗓️ {formatDate(review.date)}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-black text-slate-800">
          ⭐ {avg !== null ? avg.toFixed(1) : "—"} / 5
        </span>

        {avg !== null && <StarDisplay rating={avg} />}
      </div>

      <p
        className={[
          "mt-4 text-sm leading-7 text-slate-600",
          open || isPreview ? "" : "line-clamp-3",
        ].join(" ")}
      >
        {comment}
      </p>

      {!isPreview && (
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="mt-4 inline-flex rounded-2xl bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-violet-100 hover:text-violet-700"
        >
          {open ? "הסתר פירוט ▲" : "צפייה בביקורת המלאה ▼"}
        </button>
      )}

      {shouldShowDetails && (
        <div className="mt-4 grid gap-2 border-t border-slate-200 pt-4">
          {availableDetails.map(([key, label]) => {
            const value = review[key as ParameterKey] as ReviewValue;
            const numericValue = toNumber(value);

            if (numericValue === null) return null;

            return (
              <div
                key={key}
                className="flex flex-col gap-2 rounded-2xl bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700 sm:flex-row sm:items-center sm:justify-between"
              >
                <span>{label}</span>

                <span className="flex items-center gap-2">
                  <StarDisplay rating={numericValue} />
                  <span dir="ltr">({numericValue})</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ReviewsModule({
  reviews = [],
  currentUser = null,
  businessId,
  socket = null,
  isPreview = false,
  highlightedReviewId = "",
}: ReviewsModuleProps) {
  const [showForm, setShowForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [liveReviews, setLiveReviews] = useState<Review[]>(reviews);

  useEffect(() => {
    setLiveReviews(reviews);
  }, [reviews]);

  useEffect(() => {
    if (!currentUser || !businessId || isPreview) {
      setCanReview(false);
      return;
    }

    let isMounted = true;

    axios
      .get(`/reviews/can-review?businessId=${businessId}`)
      .then((response) => {
        if (!isMounted) return;
        setCanReview(Boolean(response.data?.canReview));
      })
      .catch(() => {
        if (!isMounted) return;
        setCanReview(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser, businessId, isPreview]);

  useEffect(() => {
    if (!socket || !businessId) return;
    if (!socket.emit || !socket.on || !socket.off) return;

    const handleNewReview = (review: Review) => {
      setLiveReviews((prev) => [review, ...prev]);
    };

    socket.emit("joinBusinessRoom", businessId);
    socket.on("review:new", handleNewReview);

    return () => {
      socket.off?.("review:new", handleNewReview);
    };
  }, [socket, businessId]);

  const displayReviews = useMemo(() => {
    if (liveReviews.length > 0) return liveReviews;
    if (currentUser && !isPreview) return exampleReviews;
    return [];
  }, [liveReviews, currentUser, isPreview]);

  const showEmptyState = displayReviews.length === 0;

  return (
    <div
      dir="rtl"
      className={[
        "w-full text-right",
        isPreview ? "space-y-0" : "space-y-5",
      ].join(" ")}
    >
      {!isPreview && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="m-0 text-2xl font-black tracking-tight text-slate-800">
              ⭐ ביקורות לקוחות
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              כאן מופיעות ביקורות שהלקוחות השאירו על העסק.
            </p>
          </div>

          {currentUser && canReview && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-5 text-sm font-black text-slate-800 shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
            >
              💬 כתיבת ביקורת
            </button>
          )}
        </div>
      )}

      {showForm && !isPreview && (
        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm">
          <ReviewForm
            businessId={businessId}
            socket={socket}
            onSuccess={(review: Review) => {
              setLiveReviews((prev) => [review, ...prev]);
              setShowForm(false);
            }}
          />
        </div>
      )}

      {!showEmptyState && !isPreview && (
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm">
          <StarRatingChart reviews={displayReviews} />
        </div>
      )}

      {showEmptyState ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-3xl shadow-sm">
            💬
          </div>

          <h3 className="mt-4 text-lg font-black text-slate-800">
            עדיין אין ביקורות
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
            כשהלקוחות ישאירו ביקורות, הן יופיעו כאן ויעזרו לחזק את האמון
            בפרופיל העסקי.
          </p>
        </div>
      ) : (
        <div className={["grid gap-4", isPreview ? "mt-0" : "mt-2"].join(" ")}>
          {displayReviews.map((review, index) => {
            const reviewId = String(review._id || review.id || "");

            return (
              <ReviewCard
                key={getReviewKey(review, index)}
                review={review}
                isPreview={isPreview}
                reviewDomId={reviewId ? `review-${reviewId}` : undefined}
                highlighted={
                  Boolean(reviewId) && reviewId === highlightedReviewId
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}