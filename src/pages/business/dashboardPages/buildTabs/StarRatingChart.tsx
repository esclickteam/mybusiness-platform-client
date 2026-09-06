"use client";

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { getTextDirection } from "../../../../i18n/localeUtils";

type ReviewValue = string | number | null | undefined;

type ReviewItem = {
  service?: ReviewValue;
  professional?: ReviewValue;
  professionalism?: ReviewValue;
  timing?: ReviewValue;
  timeliness?: ReviewValue;
  availability?: ReviewValue;
  value?: ReviewValue;
  valueForMoney?: ReviewValue;
  goal?: ReviewValue;
  goalAchievement?: ReviewValue;
  experience?: ReviewValue;
  overall?: ReviewValue;
  ratings?: Record<string, ReviewValue>;
  [key: string]: unknown;
};

type StarRatingChartProps = {
  reviews?: ReviewItem[];
};

type ParameterItem = {
  key: string;
  fallbackKeys: string[];
  labelKey: string;
  fallback: string;
  icon: string;
};

const PARAMETERS: ParameterItem[] = [
  {
    key: "service",
    fallbackKeys: ["service"],
    labelKey: "leftover.reviews.service",
    fallback: "Service",
    icon: "🤝",
  },
  {
    key: "professional",
    fallbackKeys: ["professional", "professionalism"],
    labelKey: "leftover.reviews.professional",
    fallback: "Professionalism",
    icon: "💼",
  },
  {
    key: "timing",
    fallbackKeys: ["timing", "timeliness"],
    labelKey: "leftover.reviews.timing",
    fallback: "Punctuality",
    icon: "⏰",
  },
  {
    key: "availability",
    fallbackKeys: ["availability"],
    labelKey: "leftover.reviews.availability",
    fallback: "Availability",
    icon: "📞",
  },
  {
    key: "value",
    fallbackKeys: ["value", "valueForMoney"],
    labelKey: "leftover.reviews.value",
    fallback: "Value for money",
    icon: "💰",
  },
  {
    key: "goal",
    fallbackKeys: ["goal", "goalAchievement"],
    labelKey: "leftover.reviews.goal",
    fallback: "Goal achieved",
    icon: "🎯",
  },
  {
    key: "experience",
    fallbackKeys: ["experience", "overall"],
    labelKey: "leftover.reviews.experience",
    fallback: "Overall experience",
    icon: "✨",
  },
];

function toNumber(value: ReviewValue) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function getReviewParameterValue(review: ReviewItem, parameter: ParameterItem) {
  for (const key of parameter.fallbackKeys) {
    const directValue = toNumber(review[key] as ReviewValue);

    if (directValue !== null) {
      return Math.max(0, Math.min(5, directValue));
    }

    const ratingValue = toNumber(review.ratings?.[key]);

    if (ratingValue !== null) {
      return Math.max(0, Math.min(5, ratingValue));
    }
  }

  return null;
}

function getRatingLabel(rating: number, t: (key: string, fallback: string) => string) {
  if (!rating) return t("leftover.reviews.noRating", "No rating");
  if (rating >= 4.7) return t("leftover.reviews.outstanding", "Outstanding");
  if (rating >= 4.3) return t("leftover.reviews.excellent", "Excellent");
  if (rating >= 4) return t("leftover.reviews.veryGood", "Very good");
  if (rating >= 3) return t("leftover.reviews.good", "Good");
  return t("leftover.reviews.needsWork", "Needs improvement");
}

function StarDisplay({ rating, ariaLabel }: { rating: number; ariaLabel: string }) {
  const safeRating = Math.max(0, Math.min(5, rating));
  const full = Math.floor(safeRating);
  const half = safeRating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span
      dir="ltr"
      aria-label={ariaLabel}
      className="inline-flex whitespace-nowrap text-sm tracking-[1px] text-amber-400"
    >
      {"★".repeat(full)}
      {half ? "★" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

export default function StarRatingChart({
  reviews = [],
}: StarRatingChartProps) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);

  const data = useMemo(() => {
    return PARAMETERS.map((parameter) => {
      const values = reviews
        .map((review) => getReviewParameterValue(review, parameter))
        .filter((value): value is number => value !== null);

      const average = values.length
        ? values.reduce((sum, value) => sum + value, 0) / values.length
        : 0;

      const roundedAverage = Number(average.toFixed(1));

      return {
        ...parameter,
        average: roundedAverage,
        count: values.length,
        percent: Math.min(100, Math.max(0, (roundedAverage / 5) * 100)),
      };
    });
  }, [reviews]);

  const totalReviews = reviews.length;

  const overallAverage = useMemo(() => {
    const values = data
      .map((item) => item.average)
      .filter((value) => value > 0);

    if (!values.length) return 0;

    const total = values.reduce((sum, value) => sum + value, 0);
    return Number((total / values.length).toFixed(1));
  }, [data]);

  return (
    <section
      dir={pageDir}
      className={[
        "w-full rounded-[1.75rem] border border-white/80 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-5",
        pageDir === "rtl" ? "text-right" : "text-left",
      ].join(" ")}
    >
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
            {t("leftover.reviews.chartBadge", "Rating summary")}
          </div>

          <h3 className="mt-3 text-xl font-black tracking-tight text-slate-800">
            {t("leftover.reviews.chartTitle", "Ratings by parameter")}
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {t(
              "leftover.reviews.chartHint",
              "Average ratings from the customer experience in each area."
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-center">
          <p className="text-xs font-black text-amber-700">
            {t("leftover.reviews.overallAvg", "Overall average")}
          </p>

          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="text-2xl font-black text-slate-800">
              {overallAverage ? overallAverage.toFixed(1) : "—"}
            </span>

            <span className="text-lg text-amber-400">★</span>
          </div>

          <p className="mt-1 text-xs font-bold text-amber-700">
            {getRatingLabel(overallAverage, t)}
          </p>
        </div>
      </div>

      {totalReviews === 0 ? (
        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
            ⭐
          </div>

          <h4 className="mt-4 text-base font-black text-slate-800">
            {t("leftover.reviews.notEnoughTitle", "Not enough ratings yet")}
          </h4>

          <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
            {t(
              "leftover.reviews.notEnoughHint",
              "After customers leave reviews, a professional breakdown by parameter will appear here."
            )}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {data.map(({ key, labelKey, fallback, icon, average, count, percent }) => {
            const hasRating = count > 0;

            return (
              <div
                key={key}
                className="rounded-[1.35rem] border border-slate-100 bg-slate-50/70 p-4 transition hover:border-violet-100 hover:bg-white hover:shadow-sm"
              >
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                      {icon}
                    </span>

                    <div>
                      <p className="text-sm font-black text-slate-800">
                        {t(labelKey, fallback)}
                      </p>

                      <p className="mt-0.5 text-xs font-bold text-slate-400">
                        {hasRating
                          ? t("leftover.reviews.ratingsCount", "{{count}} ratings", { count })
                          : t("leftover.reviews.noParamRating", "This parameter has no rating yet")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:justify-end">
                    <StarDisplay
                      rating={average}
                      ariaLabel={t("leftover.reviews.starsAria", "Rating {{rating}} out of 5", {
                        rating: average.toFixed(1),
                      })}
                    />

                    <span
                      dir="ltr"
                      className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700 shadow-sm"
                    >
                      {hasRating ? `${average.toFixed(1)} / 5` : "—"}
                    </span>
                  </div>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 transition-all duration-500"
                    style={{ width: `${hasRating ? percent : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}