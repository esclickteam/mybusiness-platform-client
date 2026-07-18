"use client";

import React, {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
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

  whatsappUrl?: string;
  whatsapp?: string;
  whatsappLink?: string;
  whatsAppUrl?: string;
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

const TABS = ["Main", "Gallery", "Reviews", "Website", "FAQs"] as const;

type ProfileTab = (typeof TABS)[number];

const TAB_MAP: Record<string, ProfileTab> = {
  main: "Main",
  gallery: "Gallery",
  reviews: "Reviews",
  website: "Website",
  site: "Website",
  faqs: "FAQs",
};

const TAB_LABELS: Record<ProfileTab, string> = {
  Main: "ראשי",
  Gallery: "גלריה",
  Reviews: "ביקורות",
  Website: "אתר",
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

function getBusinessWhatsappUrl(data?: BusinessData) {
  if (!data) return "";

  return (
    data.whatsappUrl ||
    data.whatsapp ||
    data.whatsappLink ||
    data.whatsAppUrl ||
    ""
  );
}

function normalizeWhatsappUrl(value?: string) {
  const clean = String(value || "").trim();
  if (!clean) return "";

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  let digits = clean.replace(/[^\d+]/g, "");

  if (digits.startsWith("+")) {
    digits = digits.slice(1);
  }

  if (digits.startsWith("0")) {
    digits = `972${digits.slice(1)}`;
  }

  return digits ? `https://wa.me/${digits}` : "";
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
  const [highlightedReviewId, setHighlightedReviewId] = useState(
    () => searchParams.get("reviewId") || ""
  );
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
      const list = res.data.reviews || res.data.business?.reviews || [];

      if (Array.isArray(list) && list.length > 0) {
        queryClient.setQueryData<BusinessData>(["business", bizId], (old) => ({
          ...(old || {}),
          rating: res.data.rating ?? res.data.averageRating ?? old?.rating,
          reviewsCount: list.length,
        }));
      }

      return list;
    },
    enabled: Boolean(bizId),
    staleTime: 0,
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
        createdAt: review.createdAt || review.date || new Date().toISOString(),
        client: {
          name:
            review.client?.name ||
            (review as ReviewItem & { clientName?: string }).clientName ||
            "לקוח אנונימי",
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

  useEffect(() => {
    const tabParam = searchParams.get("tab")?.toLowerCase();
    const reviewId = searchParams.get("reviewId") || "";

    if (tabParam && TAB_MAP[tabParam]) {
      setCurrentTab(TAB_MAP[tabParam]);
    }

    if (reviewId) {
      setHighlightedReviewId(reviewId);
      setCurrentTab("Reviews");
      setReviewsLoaded(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!highlightedReviewId || !bizId) return;

    const exists = reviews.some(
      (review) => String(review._id) === highlightedReviewId
    );

    if (!exists) {
      void refetchReviews();
      void refetch();
    }
  }, [highlightedReviewId, bizId, reviews, refetchReviews, refetch]);

  useEffect(() => {
    const handleOpenReview = (event: Event) => {
      const detail = (event as CustomEvent<{ reviewId?: string }>).detail;

      setCurrentTab("Reviews");
      setReviewsLoaded(true);

      if (detail?.reviewId) {
        setHighlightedReviewId(detail.reviewId);
      }
    };

    window.addEventListener("bizuply:open-review", handleOpenReview);

    return () => {
      window.removeEventListener("bizuply:open-review", handleOpenReview);
    };
  }, []);

  useEffect(() => {
    if (!highlightedReviewId || currentTab !== "Reviews" || !reviewsLoaded) {
      return;
    }

    const scrollTimer = window.setTimeout(() => {
      document
        .getElementById(`review-${highlightedReviewId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);

    const clearTimer = window.setTimeout(() => {
      setHighlightedReviewId("");
    }, 6000);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(clearTimer);
    };
  }, [highlightedReviewId, currentTab, reviewsLoaded, reviews.length]);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    });
  }, [reviews]);

  const roundedAvg = useMemo(() => {
    if (reviews.length > 0) {
      const values = reviews
        .map((review) => Number(review.rating || review.averageScore || 0))
        .filter((value) => Number.isFinite(value) && value > 0);

      if (values.length) {
        return (
          Math.round(
            (values.reduce((sum, value) => sum + value, 0) / values.length) * 10
          ) / 10
        );
      }
    }

    return data?.rating != null ? Math.round(Number(data.rating) * 10) / 10 : 0;
  }, [reviews, data?.rating]);

  const reviewsCount =
    reviews.length > 0
      ? reviews.length
      : data?.reviewsCount != null
        ? Number(data.reviewsCount)
        : 0;

  const hasRating = reviewsCount > 0;
  const isOwner = user?.role === "business" && user.businessId === bizId;

  const handleTabChange = (tab: ProfileTab) => {
    setCurrentTab(tab);

    if (tab === "Reviews") {
      setReviewsLoaded(true);
      void refetchReviews();
    }

    window.history.replaceState(null, "", `?tab=${tab.toLowerCase()}`);
  };

  if (isLoading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(124,58,237,0.26),transparent_32%),linear-gradient(135deg,#e0e7ff_0%,#f8fafc_42%,#ede9fe_100%)] px-4 py-16 text-right"
      >
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/80 bg-white/90 p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur">
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
        className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(124,58,237,0.26),transparent_32%),linear-gradient(135deg,#e0e7ff_0%,#f8fafc_42%,#ede9fe_100%)] px-4 py-16 text-right"
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
        className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(124,58,237,0.26),transparent_32%),linear-gradient(135deg,#e0e7ff_0%,#f8fafc_42%,#ede9fe_100%)] px-4 py-16 text-right"
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

  const coverImage = mainImages[0] || gallery[0] || "";
  const businessWebsiteUrl = getBusinessWebsiteUrl(data);
  const normalizedWebsiteUrl = normalizeWebsiteUrl(businessWebsiteUrl);
  const businessWhatsappUrl = getBusinessWhatsappUrl(data);
  const normalizedWhatsappUrl = normalizeWhatsappUrl(businessWhatsappUrl);
  const formattedPhone = formatPhone(phone);

  const renderTabContent = () => {
    if (currentTab === "Main") {
      return (
        <div className="mx-auto w-full max-w-5xl space-y-8 text-right">
          {description && (
            <div className="rounded-2xl border border-violet-100/80 bg-white/80 px-4 py-4 text-right sm:px-5">
              <h2 className="text-base font-black text-slate-950">אודות העסק</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
            </div>
          )}

          {mainImages.length ? (
            <div className="grid place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mainImages.slice(0, 6).map((url, index) => (
                <img
                  key={`${url}-${index}`}
                  src={url}
                  alt={`תמונה ראשית ${index + 1}`}
                  loading="lazy"
                  className="h-64 w-full max-w-sm rounded-[1.5rem] object-cover shadow-[0_16px_45px_rgba(79,70,229,0.14)]"
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

          <div className="mx-auto max-w-4xl">
            <div className="mb-4 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between">
              <h2 className="text-xl font-black text-slate-950">
                ביקורות אחרונות
              </h2>

              <button
                type="button"
                onClick={() => handleTabChange("Reviews")}
                className="rounded-full bg-violet-50 px-4 py-2 text-sm font-black text-violet-700 transition hover:bg-violet-100"
              >
                צפייה בכל הביקורות
              </button>
            </div>

            {sortedReviews.length ? (
              <div className="grid justify-center gap-4 lg:grid-cols-2">
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
      );
    }

    if (currentTab === "Gallery") {
      return (
        <div ref={galleryRef} className="mx-auto max-w-5xl">
          {galleryLoaded ? (
            gallery.length ? (
              <div className="grid place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((url, index) => (
                  <img
                    key={`${url}-${index}`}
                    src={url}
                    alt={`תמונת גלריה ${index + 1}`}
                    loading="lazy"
                    className="h-64 w-full max-w-sm rounded-[1.5rem] object-cover shadow-[0_16px_45px_rgba(79,70,229,0.14)]"
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="אין תמונות בגלריה"
                text="התמונות שהעסק יעלה יופיעו כאן."
                icon="🖼️"
              />
            )
          ) : (
            <p className="text-center text-sm font-black text-slate-500">
              טוען גלריה...
            </p>
          )}
        </div>
      );
    }

    if (currentTab === "Reviews") {
      return (
        <div ref={reviewsRef} className="mx-auto max-w-5xl">
          {reviewsLoaded ? (
            <div className="space-y-5">
              <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between">
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
                    className="rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-5 py-3 text-sm font-black !text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
                    onClick={() => setShowReviewModal(true)}
                  >
                    הוספת ביקורת
                  </button>
                )}
              </div>

              {showReviewModal &&
                createPortal(
                  <div
                    className="fixed inset-0 z-[10050] flex items-start justify-center overflow-y-auto overscroll-contain bg-slate-950/40 p-4 backdrop-blur-sm sm:p-6"
                    onClick={() => setShowReviewModal(false)}
                  >
                    <div
                      className="relative my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        aria-label="סגירת טופס ביקורת"
                        className="absolute left-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-xl font-black text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
                        onClick={() => setShowReviewModal(false)}
                      >
                        ×
                      </button>

                      <div className="min-h-0 flex-1 overflow-y-auto p-6">
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
                  </div>,
                  document.body
                )}

              {sortedReviews.length ? (
                <div className="grid justify-center gap-4 lg:grid-cols-2">
                  {sortedReviews.map((review, index) => (
                    <ReviewCard
                      key={review._id || index}
                      review={review}
                      reviewDomId={
                        review._id ? `review-${review._id}` : undefined
                      }
                      highlighted={
                        Boolean(review._id) &&
                        String(review._id) === highlightedReviewId
                      }
                    />
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
                      className="mt-5 inline-flex items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 py-3 text-sm font-black !text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
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
      );
    }

    if (currentTab === "Website") {
      return (
        <div className="mx-auto max-w-3xl">
          {businessWebsiteUrl || businessWhatsappUrl ? (
            <div className="overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-8 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-lg">
                🌐
              </div>

              <h2 className="mt-5 text-3xl font-black text-slate-950">
                אתר העסק
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-600">
                אפשר להיכנס לאתר העסק ולראות מידע נוסף, שירותים, תכנים
                ועדכונים.
              </p>

              {businessWebsiteUrl && (
                <a
                  href={normalizedWebsiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  dir="ltr"
                  className="mx-auto mt-6 flex h-[52px] max-w-sm items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 text-sm font-black !text-white shadow-xl shadow-violet-500/20 transition hover:-translate-y-0.5"
                >
                  כניסה לאתר העסק
                </a>
              )}

              {businessWhatsappUrl && (
                <a
                  href={normalizedWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mx-auto mt-3 flex h-[52px] max-w-sm items-center justify-center rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-500 px-6 text-sm font-black !text-white shadow-xl shadow-emerald-500/20 transition hover:-translate-y-0.5"
                >
                  שליחת הודעה בוואטסאפ
                </a>
              )}
            </div>
          ) : (
            <EmptyState
              title="עדיין אין אתר מחובר"
              text="כאשר העסק יחבר אתר, הקישור יופיע כאן."
              icon="🌐"
            />
          )}
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.length ? (
          faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;

            return (
              <div
                key={faq._id || index}
                className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_10px_28px_rgba(79,70,229,0.08)]"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right text-sm font-black text-slate-950 transition hover:bg-violet-50"
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
                  <div className="border-t border-violet-100 px-5 py-4 text-center text-sm leading-7 text-slate-600">
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
    );
  };

  return (
    <main
      dir="rtl"
      className="flex min-h-[calc(100dvh-72px)] flex-col bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.14),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(124,58,237,0.18),transparent_32%),linear-gradient(135deg,#e0e7ff_0%,#f8fafc_42%,#ede9fe_100%)] px-3 py-2 text-right text-slate-950 sm:px-5 sm:py-3"
    >
      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-2 sm:gap-3">
        <div className="relative shrink-0 overflow-hidden rounded-2xl border border-white/90 bg-white/95 p-3 shadow-[0_10px_36px_rgba(79,70,229,0.10)] sm:p-4">
          {coverImage && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-cover bg-center opacity-20 sm:h-20"
              style={{ backgroundImage: `url(${coverImage})` }}
            />
          )}
          <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-violet-400/10 blur-2xl" />

          {isOwner && (
            <Link
              to={`/business/${bizId}/dashboard/edit`}
              className="absolute left-3 top-3 z-10 inline-flex h-8 items-center justify-center rounded-full border border-violet-100 bg-white px-3 text-[11px] font-black text-violet-700 shadow-sm transition hover:bg-violet-50"
            >
              ✏️ עריכה
            </Link>
          )}

          <div className="relative flex items-start gap-3 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-violet-100 bg-gradient-to-br from-violet-100 via-white to-blue-100 shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`לוגו ${businessName}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-black text-violet-600 sm:text-2xl">
                  {businessName?.charAt(0)?.toUpperCase() || "B"}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1 pe-1 pt-0.5 sm:pe-0">
              <h1 className="text-lg font-black leading-tight text-slate-950 sm:text-2xl">
                {businessName || "שם העסק"}
              </h1>

              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {isMeaningfulCategory(category) && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-violet-100 bg-violet-50 px-2.5 py-0.5 text-[11px] font-black text-violet-800 sm:text-xs">
                    <Icon name="category" />
                    {category}
                  </span>
                )}

                {city && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-[11px] font-black text-slate-700 sm:text-xs">
                    <Icon name="city" />
                    {city}
                  </span>
                )}

                {hasRating && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-0.5 text-[11px] font-black text-amber-700 sm:text-xs">
                    ⭐ {roundedAvg.toFixed(1)} ({reviewsCount})
                  </span>
                )}
              </div>

              {(phone || email) && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-600 sm:text-xs">
                  {phone && (
                    <span dir="ltr" className="rounded-lg bg-slate-50 px-2 py-1">
                      {formattedPhone}
                    </span>
                  )}
                  {email && (
                    <span dir="ltr" className="max-w-[220px] truncate rounded-lg bg-slate-50 px-2 py-1 sm:max-w-none">
                      {email}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {(businessWebsiteUrl || businessWhatsappUrl) && (
            <div className="relative mt-2.5 flex flex-wrap gap-2 border-t border-violet-100/80 pt-2.5">
              {businessWebsiteUrl && (
                <a
                  href={normalizedWebsiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 flex-1 items-center justify-center rounded-xl bg-gradient-to-l from-violet-600 to-blue-600 px-3 text-xs font-black !text-white shadow-md shadow-violet-500/15 transition hover:-translate-y-0.5 sm:flex-none sm:px-4"
                >
                  כניסה לאתר
                </a>
              )}

              {businessWhatsappUrl && (
                <a
                  href={normalizedWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 flex-1 items-center justify-center rounded-xl bg-gradient-to-l from-emerald-500 to-teal-500 px-3 text-xs font-black !text-white shadow-md shadow-emerald-500/10 transition hover:-translate-y-0.5 sm:flex-none sm:px-4"
                >
                  וואטסאפ
                </a>
              )}
            </div>
          )}
        </div>

        <div className="sticky top-0 z-30 shrink-0 rounded-2xl border border-white/90 bg-white/95 py-2 shadow-[0_8px_28px_rgba(79,70,229,0.08)] backdrop-blur-md">
          <div className="overflow-x-auto px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div
              className="flex w-max min-w-full gap-2"
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
                      "shrink-0 rounded-xl px-4 py-2.5 text-sm font-black transition sm:px-5 sm:py-3",
                      isActive
                        ? "bg-gradient-to-l from-violet-600 to-blue-600 text-white shadow-[0_8px_20px_rgba(124,58,237,0.28)]"
                        : "border border-violet-100 bg-white text-slate-600 shadow-sm hover:bg-violet-50 hover:text-violet-700",
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

        <div className="flex min-h-[calc(100dvh-72px-11rem)] flex-1 flex-col rounded-2xl border border-violet-100/70 bg-white/95 p-4 text-right shadow-[0_10px_40px_rgba(79,70,229,0.08)] sm:min-h-[calc(100dvh-72px-10rem)] sm:p-6 lg:p-7">
          {renderTabContent()}
        </div>
      </section>
    </main>
  );
}

function EmptyState({ title, text, icon = "✨", children }: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-dashed border-violet-200 bg-violet-50/70 px-6 py-12 text-center shadow-[0_16px_44px_rgba(79,70,229,0.08)]">
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