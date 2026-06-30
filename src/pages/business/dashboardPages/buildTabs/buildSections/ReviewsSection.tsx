"use client";

import React, { useMemo } from "react";
import ReviewsModule from "../ReviewsModule";

type ReviewValue = string | number | undefined | null;

type Review = {
  _id?: string;
  id?: string;
  date?: string | Date;
  rating?: number | string;
  text?: string;
  comment?: string;
  userName?: string;
  user?: string;
  name?: string;

  service?: ReviewValue;
  professional?: ReviewValue;
  timing?: ReviewValue;
  availability?: ReviewValue;
  value?: ReviewValue;
  goal?: ReviewValue;
  experience?: ReviewValue;

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
  emit: (eventName: string, payload?: unknown) => void;
  on: (eventName: string, callback: (payload: Review) => void) => void;
  off: (eventName: string, callback?: (payload: Review) => void) => void;
};

type ReviewsSectionProps = {
  reviews?: Review[];
  currentUser?: CurrentUser | null;
  businessId?: string;
  socket?: SocketLike | null;
  renderTopBar?: () => React.ReactNode;
};

type ParameterKey =
  | "service"
  | "professional"
  | "timing"
  | "availability"
  | "value"
  | "goal"
  | "experience";

const PARAMETER_KEYS: ParameterKey[] = [
  "service",
  "professional",
  "timing",
  "availability",
  "value",
  "goal",
  "experience",
];

function toNumber(value: ReviewValue) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function getReviewDateTime(review: Review) {
  if (!review.date) return 0;

  const time = new Date(review.date).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function getReviewAverage(review: Review) {
  const detailedValues = PARAMETER_KEYS.map((key) =>
    toNumber(review[key] as ReviewValue)
  ).filter((value): value is number => value !== null);

  if (detailedValues.length > 0) {
    const total = detailedValues.reduce((sum, value) => sum + value, 0);
    return total / detailedValues.length;
  }

  const rating = toNumber(review.rating);
  return rating ?? 0;
}

function getRatingLabel(rating: number) {
  if (!rating) return "אין דירוג";
  if (rating >= 4.5) return "מעולה";
  if (rating >= 4) return "טוב מאוד";
  if (rating >= 3) return "טוב";
  return "דורש שיפור";
}

export default function ReviewsSection({
  reviews = [],
  currentUser = null,
  businessId,
  socket = null,
  renderTopBar,
}: ReviewsSectionProps) {
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      return getReviewDateTime(b) - getReviewDateTime(a);
    });
  }, [reviews]);

  const lastTwoReviews = useMemo(() => {
    return sortedReviews.slice(0, 2);
  }, [sortedReviews]);

  const totalReviews = reviews.length;

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;

    const total = reviews.reduce((sum, review) => {
      return sum + getReviewAverage(review);
    }, 0);

    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  const ratingLabel = getRatingLabel(averageRating);
  const hasReviews = totalReviews > 0;

  return (
    <section
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.10),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-6 text-right text-slate-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-7 xl:grid-cols-[1.02fr_0.98fr]">
        {/* ניהול ביקורות */}
        <div className="order-1 overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_28px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-br from-white via-violet-50 to-blue-50 px-6 py-8 sm:px-8">
            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-violet-300/35 blur-3xl" />
            <div className="absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-1.5 text-xs font-black text-violet-700 shadow-sm backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  ביקורות לקוחות
                </div>

                <div className="inline-flex rounded-full border border-blue-100 bg-white/80 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-sm backdrop-blur">
                  תצוגה חיה בזמן אמת
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    ניהול ביקורות
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    נהל את כל ביקורות הלקוחות, עקוב אחרי הדירוג הממוצע ושמור על
                    פרופיל עסקי אמין, פעיל ומקצועי.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
                  <div className="rounded-2xl border border-white bg-white/85 p-4 shadow-lg backdrop-blur">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      ביקורות
                    </p>

                    <p className="mt-1 text-3xl font-black text-slate-950">
                      {totalReviews}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white bg-white/85 p-4 shadow-lg backdrop-blur">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      דירוג ממוצע
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-3xl font-black text-slate-950">
                        {averageRating || "—"}
                      </p>

                      {averageRating ? (
                        <span className="text-xl text-amber-400">★</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-xl">
                  💬
                </div>

                <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-400">
                  סה״כ ביקורות
                </p>

                <p className="mt-1 text-2xl font-black text-slate-950">
                  {totalReviews}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-xl">
                  ⭐
                </div>

                <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-400">
                  דירוג ממוצע
                </p>

                <p className="mt-1 text-2xl font-black text-slate-950">
                  {averageRating || "—"}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
                  ✨
                </div>

                <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-400">
                  סטטוס
                </p>

                <p className="mt-1 text-2xl font-black text-slate-950">
                  {hasReviews ? ratingLabel : "ריק"}
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-950">
                    כל הביקורות
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    כאן אפשר לראות את כל ביקורות הלקוחות שמופיעות בפרופיל
                    העסקי.
                  </p>
                </div>

                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                  {totalReviews} ביקורות
                </span>
              </div>

              <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                <ReviewsModule
                  reviews={reviews}
                  currentUser={currentUser}
                  businessId={businessId}
                  socket={socket}
                  isPreview={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* תצוגה מקדימה */}
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
                      ביקורות לקוחות
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-xl text-white shadow-lg shadow-violet-500/20">
                    ⭐
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.7rem] border border-white/80 bg-white shadow-2xl">
                  <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-blue-50 px-5 py-7 text-slate-950">
                    <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-violet-300/30 blur-3xl" />
                    <div className="absolute -bottom-20 right-12 h-52 w-52 rounded-full bg-blue-300/25 blur-3xl" />

                    <div className="relative">
                      <div className="inline-flex rounded-full border border-violet-100 bg-white/80 px-3 py-1 text-xs font-black text-violet-700 shadow-sm backdrop-blur">
                        תצוגה מקדימה חיה
                      </div>

                      <h3 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
                        הביקורות האחרונות
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        שתי הביקורות החדשות ביותר יוצגו בפרופיל העסקי הציבורי.
                      </p>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white bg-white/85 p-4 shadow-sm backdrop-blur">
                          <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                            סה״כ
                          </p>

                          <p className="mt-1 text-2xl font-black text-slate-950">
                            {totalReviews}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white bg-white/85 p-4 shadow-sm backdrop-blur">
                          <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                            ממוצע
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <p className="text-2xl font-black text-slate-950">
                              {averageRating || "—"}
                            </p>

                            {averageRating ? (
                              <span className="text-base text-amber-400">
                                ★
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-950">
                          מה לקוחות אומרים
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          כך הביקורות יופיעו בעמוד הציבורי של העסק.
                        </p>
                      </div>

                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-black",
                          hasReviews
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500",
                        ].join(" ")}
                      >
                        {hasReviews ? "פעיל" : "ריק"}
                      </span>
                    </div>

                    <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4">
                      {lastTwoReviews.length > 0 ? (
                        <ReviewsModule
                          reviews={lastTwoReviews}
                          currentUser={currentUser}
                          businessId={businessId}
                          socket={socket}
                          isPreview={true}
                        />
                      ) : (
                        <div className="flex min-h-64 flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-3xl shadow-sm">
                            💬
                          </div>

                          <h4 className="mt-4 text-lg font-black text-slate-950">
                            עדיין אין ביקורות
                          </h4>

                          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                            אחרי שלקוחות ישאירו ביקורות, שתי הביקורות האחרונות
                            יופיעו כאן.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                          ביקורות
                        </p>

                        <p className="mt-1 text-2xl font-black text-slate-950">
                          {totalReviews}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                          דירוג
                        </p>

                        <p className="mt-1 text-2xl font-black text-slate-950">
                          {averageRating || "—"}
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