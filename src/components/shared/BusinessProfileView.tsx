"use client";

import React, {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/socketContext";
import Icon from "@/components/UI/Icon";
import ReviewCard from "../../components/ReviewCard";

const ReviewForm = lazy(
  () => import("../../pages/business/dashboardPages/buildTabs/ReviewForm")
);

type UserRole = "business" | "customer" | "admin" | "staff" | string;

type AuthUser = {
  _id?: string;
  name?: string;
  role?: UserRole;
  businessId?: string;
};

type FaqItem = {
  _id?: string;
  question: string;
  answer: string;
};

type CategoryItem = {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  [key: string]: unknown;
};

type ReviewItem = {
  _id?: string;
  rating?: number;
  averageScore?: number;
  comment?: string;
  createdAt?: string;
  date?: string;
  client?: {
    name?: string;
  };
  ratings?: Record<string, number>;
  [key: string]: unknown;
};

type BusinessData = {
  _id?: string;
  businessName?: string;
  logo?: string;
  description?: string;
  phone?: string;
  email?: string;
  category?: string;
  categories?: CategoryItem[];
  mainImages?: string[];
  gallery?: string[];
  address?: {
    city?: string;
  };
  faqs?: FaqItem[];
  views_count?: number;
  rating?: number;
  reviewsCount?: number;
  reviews?: ReviewItem[];

  websiteUrl?: string;
  website?: string;
  siteUrl?: string;
  publicSiteUrl?: string;
  miniSiteUrl?: string;
  builderSiteUrl?: string;
};

type SocketLike = {
  emit: (...args: any[]) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
  _joinedRooms?: Set<string>;
};

type EmptyStateProps = {
  title: string;
  text: string;
  icon?: string;
  children?: React.ReactNode;
};

const TAB_MAP: Record<string, ProfileTab> = {
  main: "Main",
  gallery: "Gallery",
  reviews: "Reviews",
  faqs: "FAQs",
};

const TABS = ["Main", "Gallery", "Reviews", "FAQs"] as const;

type ProfileTab = (typeof TABS)[number];

const TAB_LABELS: Record<ProfileTab, string> = {
  Main: "ראשי",
  Gallery: "גלריה",
  Reviews: "ביקורות",
  FAQs: "שאלות נפוצות",
};

function useOnScreen(ref: React.RefObject<HTMLElement | null>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}

function getBusinessWebsiteUrl(data?: BusinessData) {
  if (!data) return "";

  return (
    data.websiteUrl ||
    data.website ||
    data.siteUrl ||
    data.publicSiteUrl ||
    data.miniSiteUrl ||
    data.builderSiteUrl ||
    ""
  );
}

function normalizeWebsiteUrl(url?: string) {
  const clean = String(url || "").trim();
  if (!clean) return "";

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  return `https://${clean}`;
}

function formatPhone(phone?: string) {
  if (!phone) return "";

  const clean = String(phone)
    .trim()
    .replace(/[\s()-]/g, "");

  if (clean.startsWith("+972")) return `0${clean.slice(4)}`;
  if (clean.startsWith("972")) return `0${clean.slice(3)}`;

  return clean;
}

function isMeaningfulCategory(category?: string) {
  const clean = String(category || "").trim();
  return clean !== "" && clean !== "כללי" && clean.toLowerCase() !== "general";
}

export default function BusinessProfileView() {
  const { user } = useAuth() as {
    user: AuthUser | null;
  };

  const socket = useSocket() as SocketLike | null;

  const { businessId: paramId } = useParams<{ businessId: string }>();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const bizId = paramId || user?.businessId || "";

  const initialTab =
    TAB_MAP[searchParams.get("tab")?.toLowerCase() || ""] || "Main";

  const [currentTab, setCurrentTab] = useState<ProfileTab>(initialTab);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const galleryRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);

  const galleryVisible = useOnScreen(galleryRef);
  const reviewsVisible = useOnScreen(reviewsRef);

  const [galleryLoaded, setGalleryLoaded] = useState(false);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<BusinessData>({
    queryKey: ["business", bizId],
    queryFn: async () => {
      const res = await API.get(`/business/${bizId}`);
      return res.data.business || res.data;
    },
    enabled: Boolean(bizId),
    staleTime: 5 * 60 * 1000,
  });

  const { data: reviews = [], refetch: refetchReviews } = useQuery<
    ReviewItem[]
  >({
    queryKey: ["reviews", bizId],
    queryFn: async () => {
      const res = await API.get(`/business/${bizId}/profile`);
      return res.data.reviews || res.data.business?.reviews || [];
    },
    enabled: Boolean(bizId),
  });

  useEffect(() => {
    if (!data) return;
    setFaqs(data.faqs || []);
  }, [data]);

  useEffect(() => {
    if (!socket || !bizId) return;

    if (!socket._joinedRooms) socket._joinedRooms = new Set();

    if (!socket._joinedRooms.has(bizId)) {
      socket.emit("joinBusinessRoom", bizId);
      socket._joinedRooms.add(bizId);
    }

    if (user?.businessId === bizId) return;

    const viewedKey = `viewed_${bizId}`;

    const win = window as typeof window & {
      __sentProfileView?: Set<string>;
    };

    const hasSentView = win.__sentProfileView ?? new Set<string>();
    win.__sentProfileView = hasSentView;

    if (hasSentView.has(bizId) || sessionStorage.getItem(viewedKey)) return;

    hasSentView.add(bizId);
    sessionStorage.setItem(viewedKey, "1");

    socket.emit(
      "profileView",
      { businessId: bizId, src: "public" },
      (res: {
        ok?: boolean;
        stats?: { views_count?: number };
        error?: string;
      }) => {
        if (res?.ok && res.stats?.views_count !== undefined) {
          queryClient.setQueryData<BusinessData>(["business", bizId], (old) =>
            old
              ? {
                  ...old,
                  views_count: res.stats?.views_count,
                }
              : old
          );
        }

        if (res?.error) {
          console.error("Failed to register profile view:", res.error);
        }
      }
    );
  }, [socket, bizId, user?.businessId, queryClient]);

  useEffect(() => {
    if (!socket || !bizId) return;

    const handleNewReview = (incomingReview: unknown) => {
      const review = incomingReview as ReviewItem;

      const normalizedReview: ReviewItem = {
        _id: review._id,
        rating: review.rating || review.averageScore || 0,
        averageScore: review.rating || review.averageScore || 0,
        comment: review.comment || "",
        createdAt: review.date || new Date().toISOString(),
        client: {
          name: review.client?.name || "לקוח אנונימי",
        },
        ratings: review.ratings || {},
      };

      queryClient.setQueryData<ReviewItem[]>(["reviews", bizId], (old = []) => [
        normalizedReview,
        ...old,
      ]);

      queryClient.refetchQueries({
        queryKey: ["reviews", bizId],
        exact: true,
      });
    };

    socket.on("review:new", handleNewReview);

    return () => {
      socket.off("review:new", handleNewReview);
    };
  }, [socket, bizId, queryClient]);

  useEffect(() => {
    if (galleryVisible) setGalleryLoaded(true);
  }, [galleryVisible]);

  useEffect(() => {
    if (reviewsVisible) setReviewsLoaded(true);
  }, [reviewsVisible]);

  useEffect(() => {
    if (currentTab === "Gallery") setGalleryLoaded(true);
    if (currentTab === "Reviews") setReviewsLoaded(true);
  }, [currentTab]);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    });
  }, [reviews]);

  const roundedAvg =
    data?.rating != null ? Math.round(Number(data.rating) * 10) / 10 : 0;

  const reviewsCount =
    data?.reviewsCount != null ? Number(data.reviewsCount) : reviews.length;

  const hasRating = reviewsCount > 0;
  const isOwner = user?.role === "business" && user.businessId === bizId;

  const handleTabChange = (tab: ProfileTab) => {
    setCurrentTab(tab);
    window.history.replaceState(null, "", `?tab=${tab.toLowerCase()}`);
  };

  if (isLoading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-16 text-right"
      >
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/80 bg-white/90 p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />

          <p className="text-sm font-black text-slate-600">
            טוען את עמוד העסק...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-16 text-right"
      >
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-rose-100 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-black text-rose-600">
            לא הצלחנו לטעון את העמוד
          </p>

          <p className="mt-2 text-sm text-slate-500">
            נסה לרענן את הדף בעוד רגע.
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-16 text-right"
      >
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-black text-slate-800">העסק לא נמצא</p>
        </div>
      </main>
    );
  }

  const {
    businessName = "",
    logo: logoUrl,
    description = "",
    phone = "",
    email = "",
    category = "",
    mainImages = [],
    gallery = [],
    address: { city = "" } = {},
  } = data;

  const businessWebsiteUrl = getBusinessWebsiteUrl(data);
  const normalizedWebsiteUrl = normalizeWebsiteUrl(businessWebsiteUrl);
  const formattedPhone = formatPhone(phone);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.10),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.08),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-6 text-right text-slate-950 sm:px-6 lg:px-8"
    >
      <section className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/90 shadow-[0_28px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-52 h-64 w-64 rounded-full bg-blue-300/25 blur-3xl" />

          <div className="relative px-5 py-6 sm:px-8 lg:px-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
              {isOwner && (
                <Link
                  to={`/business/${bizId}/dashboard/edit`}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
                >
                  ✏️ עריכת פרטי העסק
                </Link>
              )}
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-center">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] border border-violet-100 bg-gradient-to-br from-violet-50 to-blue-50 shadow-xl shadow-violet-100/70">
                  {logoUrl ? (
                    <img
                      className="h-full w-full object-cover"
                      src={logoUrl}
                      alt={`לוגו ${businessName}`}
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-3xl font-black text-violet-600">
                      {businessName?.charAt(0)?.toUpperCase() || "B"}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    {businessName || "שם העסק"}
                  </h1>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    {isMeaningfulCategory(category) && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 font-black text-violet-800">
                        <Icon name="category" />
                        {category}
                      </span>
                    )}

                    {city && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 font-black text-slate-700">
                        <Icon name="city" />
                        {city}
                      </span>
                    )}

                    {hasRating && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 font-black text-amber-700">
                        ⭐ {roundedAvg.toFixed(1)}
                        <span className="text-amber-600/80">
                          ({reviewsCount} ביקורות)
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center rounded-[1.8rem] border border-violet-100 bg-white/80 p-5 shadow-xl shadow-violet-100/70 backdrop-blur">
                {businessWebsiteUrl ? (
                  <a
                    href={normalizedWebsiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-[52px] w-full items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
                  >
                    כניסה לאתר העסק
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleTabChange("Gallery")}
                    className="flex h-[52px] w-full items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
                  >
                    צפייה בגלריה
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              {phone && (
                <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-slate-950">
                    <Icon name="phone" />
                    טלפון
                  </div>

                  <p dir="ltr" className="mt-1 text-left text-slate-600">
                    {formattedPhone}
                  </p>
                </div>
              )}

              {email && (
                <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-slate-950">
                    ✉️ אימייל
                  </div>

                  <p dir="ltr" className="mt-1 truncate text-left text-slate-600">
                    {email}
                  </p>
                </div>
              )}

              {businessWebsiteUrl && (
                <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-violet-800">
                    🌐 אתר העסק
                  </div>

                  <a
                    href={normalizedWebsiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    dir="ltr"
                    className="mt-1 block truncate text-left font-black text-violet-700 hover:underline"
                  >
                    {businessWebsiteUrl}
                  </a>
                </div>
              )}

              {description && (
                <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm sm:col-span-2">
                  <div className="flex items-center gap-2 font-black text-slate-950">
                    <Icon name="description" />
                    אודות העסק
                  </div>

                  <p className="mt-2 leading-7 text-slate-600">
                    {description}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-violet-100 pt-6">
              <div
                className="flex justify-center gap-3 overflow-x-auto pb-2 text-center"
                role="tablist"
                aria-label="טאבים של עמוד העסק"
              >
                {TABS.map((tab) => {
                  const isActive = tab === currentTab;

                  return (
                    <button
                      key={tab}
                      type="button"
                      className={[
                        "flex min-w-[120px] shrink-0 items-center justify-center rounded-2xl px-5 py-3 text-center text-sm font-black transition",
                        isActive
                          ? "bg-gradient-to-l from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20"
                          : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-100 hover:bg-violet-50 hover:text-violet-700",
                      ].join(" ")}
                      onClick={() => handleTabChange(tab)}
                      role="tab"
                      aria-selected={isActive}
                    >
                      {TAB_LABELS[tab]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
          {currentTab === "Main" && (
            <div className="space-y-8">
              {mainImages.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mainImages.slice(0, 6).map((url, index) => (
                    <img
                      key={`${url}-${index}`}
                      src={url}
                      alt={`תמונה ראשית ${index + 1}`}
                      loading="lazy"
                      className="h-64 w-full rounded-[1.5rem] object-cover shadow-lg shadow-slate-100"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="עדיין אין תמונות ראשיות"
                  text="התמונות שהעסק יוסיף יופיעו כאן."
                  icon="🖼️"
                />
              )}

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-950">
                    ביקורות אחרונות
                  </h2>

                  <button
                    type="button"
                    onClick={() => handleTabChange("Reviews")}
                    className="rounded-full bg-violet-50 px-4 py-2 text-sm font-black text-violet-700 hover:bg-violet-100"
                  >
                    צפייה בכל הביקורות
                  </button>
                </div>

                {sortedReviews.length ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {sortedReviews.slice(0, 2).map((review, index) => (
                      <ReviewCard key={review._id || index} review={review} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="עדיין אין ביקורות"
                    text="ביקורות של לקוחות יופיעו כאן."
                    icon="⭐"
                  />
                )}
              </div>
            </div>
          )}

          {currentTab === "Gallery" && (
            <div ref={galleryRef}>
              {galleryLoaded ? (
                gallery.length ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {gallery.map((url, index) => (
                      <img
                        key={`${url}-${index}`}
                        src={url}
                        alt={`תמונת גלריה ${index + 1}`}
                        loading="lazy"
                        className="h-64 w-full rounded-[1.5rem] object-cover shadow-lg shadow-slate-100"
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="עדיין אין תמונות בגלריה"
                    text="תמונות הגלריה שהעסק יעלה יופיעו כאן."
                    icon="📸"
                  />
                )
              ) : (
                <p className="text-center text-sm font-black text-slate-500">
                  טוען גלריה...
                </p>
              )}
            </div>
          )}

          {currentTab === "Reviews" && (
            <div ref={reviewsRef}>
              {reviewsLoaded ? (
                <div className="space-y-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-slate-950">
                        ביקורות לקוחות
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {reviewsCount} ביקורות
                      </p>
                    </div>

                    {!isOwner && (
                      <button
                        type="button"
                        className="rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
                        onClick={() => setShowReviewModal(true)}
                      >
                        הוספת ביקורת
                      </button>
                    )}
                  </div>

                  {showReviewModal && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
                      onClick={() => setShowReviewModal(false)}
                    >
                      <div
                        className="relative w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <button
                          type="button"
                          aria-label="סגירת טופס ביקורת"
                          className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-xl font-black text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
                          onClick={() => setShowReviewModal(false)}
                        >
                          ×
                        </button>

                        <Suspense
                          fallback={
                            <div className="rounded-2xl bg-slate-50 p-6 text-sm font-black text-slate-500">
                              טוען טופס ביקורת...
                            </div>
                          }
                        >
                          <ReviewForm
                            businessId={bizId}
                            socket={socket as any}
                            onSuccess={async () => {
                              setShowReviewModal(false);
                              await Promise.all([refetch(), refetchReviews()]);
                            }}
                          />
                        </Suspense>
                      </div>
                    </div>
                  )}

                  {sortedReviews.length ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                      {sortedReviews.map((review, index) => (
                        <ReviewCard key={review._id || index} review={review} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="עדיין אין ביקורות"
                      text="ביקורות של לקוחות יופיעו כאן."
                      icon="⭐"
                    >
                      {!isOwner && (
                        <button
                          type="button"
                          onClick={() => setShowReviewModal(true)}
                          className="mt-5 inline-flex items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
                        >
                          כתיבת הביקורת הראשונה
                        </button>
                      )}
                    </EmptyState>
                  )}
                </div>
              ) : (
                <p className="text-center text-sm font-black text-slate-500">
                  טוען ביקורות...
                </p>
              )}
            </div>
          )}

          {currentTab === "FAQs" && (
            <div className="mx-auto max-w-3xl space-y-3">
              {faqs.length ? (
                faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;

                  return (
                    <div
                      key={faq._id || index}
                      className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right text-sm font-black text-slate-950 hover:bg-violet-50"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      >
                        <span>{faq.question}</span>

                        <span
                          className={[
                            "text-lg text-violet-600 transition",
                            isOpen ? "rotate-180" : "",
                          ].join(" ")}
                        >
                          ▾
                        </span>
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-100 px-5 py-4 text-sm leading-7 text-slate-600">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <EmptyState
                  title="עדיין אין שאלות נפוצות"
                  text="שאלות ותשובות של העסק יופיעו כאן."
                  icon="❔"
                />
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function EmptyState({ title, text, icon = "✨", children }: EmptyStateProps) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-violet-200 bg-violet-50/50 px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
        {icon}
      </div>

      <h3 className="text-lg font-black text-slate-950">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {text}
      </p>

      {children}
    </div>
  );
}