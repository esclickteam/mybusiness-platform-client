import React, { useMemo } from "react";
import ReviewsModule from "../ReviewsModule";

type Review = {
  _id?: string;
  id?: string;
  date?: string | Date;
  rating?: number;
  text?: string;
  userName?: string;
  [key: string]: unknown;
};

type CurrentUser = {
  _id?: string;
  id?: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
};

type ReviewsSectionProps = {
  reviews?: Review[];
  currentUser?: CurrentUser | null;
  businessId?: string;
  socket?: unknown;
  renderTopBar?: () => React.ReactNode;
};

export default function ReviewsSection({
  reviews = [],
  currentUser = null,
  businessId,
  socket,
  renderTopBar,
}: ReviewsSectionProps) {
  const lastTwoReviews = useMemo(() => {
    return [...reviews]
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 2);
  }, [reviews]);

  const totalReviews = reviews.length;

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;

    const total = reviews.reduce((sum, review) => {
      return sum + Number(review.rating || 0);
    }, 0);

    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  return (
    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      {/* FULL REVIEWS */}
      <div className="order-2 overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] xl:order-1">
        <div className="border-b border-slate-100 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 px-6 py-7 text-white sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-black text-white/80 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Customer Reviews
          </div>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Reviews Management
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                Manage all customer reviews and keep your profile trustworthy.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-wide text-white/50">
                  Reviews
                </p>
                <p className="mt-1 text-2xl font-black">{totalReviews}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-wide text-white/50">
                  Rating
                </p>
                <p className="mt-1 text-2xl font-black">
                  {averageRating || "—"}
                  {averageRating ? (
                    <span className="ml-1 text-base text-amber-300">★</span>
                  ) : null}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8">
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

      {/* PREVIEW */}
      <aside className="order-1 xl:order-2">
        <div className="sticky top-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          {renderTopBar && (
            <div className="border-b border-slate-100 bg-white/80 px-5 py-4">
              {renderTopBar()}
            </div>
          )}

          <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-sky-50 p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-300/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-blue-300/20 blur-3xl" />

            <div className="relative">
              <div className="mb-5 rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-xl backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">
                      Live preview
                    </div>

                    <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                      Latest Reviews
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      The newest reviews will appear in the business profile
                      preview.
                    </p>
                  </div>

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-2xl shadow-xl shadow-slate-950/20">
                    ⭐
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Total
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-950">
                      {totalReviews}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Avg
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-950">
                      {averageRating || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur">
                {lastTwoReviews.length > 0 ? (
                  <ReviewsModule
                    reviews={lastTwoReviews}
                    currentUser={currentUser}
                    businessId={businessId}
                    socket={socket}
                    isPreview={true}
                  />
                ) : (
                  <div className="flex min-h-64 flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                      💬
                    </div>

                    <h4 className="mt-4 text-lg font-black text-slate-950">
                      No reviews yet
                    </h4>

                    <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                      Once customers leave reviews, the latest two will appear
                      here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}