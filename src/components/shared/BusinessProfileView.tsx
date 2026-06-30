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
        <div className="mx-auto max-w-5xl space-y-8">
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
                <div className="grid justify-center gap-4 lg:grid-cols-2">
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
      className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(124,58,237,0.26),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.16),transparent_34%),linear-gradient(135deg,#e0e7ff_0%,#f8fafc_42%,#ede9fe_100%)] px-4 py-6 text-right text-slate-950 sm:px-6 lg:px-8"
    >
      <section className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.94)_38%,rgba(237,233,254,0.88)_100%)] shadow-[0_34px_110px_rgba(79,70,229,0.18)] backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

          {isOwner && (
            <Link
              to={`/business/${bizId}/dashboard/edit`}
              className="absolute left-5 top-5 z-20 inline-flex h-10 items-center justify-center rounded-full border border-white/80 bg-white/85 px-4 text-xs font-black text-violet-700 shadow-lg shadow-violet-500/10 backdrop-blur transition hover:-translate-y-0.5 hover:bg-violet-50"
            >
              ✏️ עריכה
            </Link>
          )}

          <div className="relative p-4 sm:p-6 lg:p-8">
            {coverImage ? (
              <div className="overflow-hidden rounded-[2rem] border border-white/80 shadow-[0_24px_70px_rgba(30,41,59,0.14)]">
                <img
                  src={coverImage}
                  alt={`תמונת קאבר של ${businessName}`}
                  loading="lazy"
                  className="h-72 w-full object-cover sm:h-96 lg:h-[430px]"
                />
              </div>
            ) : (
              <div className="flex h-72 w-full items-center justify-center rounded-[2rem] border border-white/80 bg-gradient-to-br from-violet-100 via-white to-blue-100 text-center shadow-[0_24px_70px_rgba(30,41,59,0.10)] sm:h-96 lg:h-[430px]">
                <div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-lg">
                    ✨
                  </div>

                  <p className="mt-4 text-lg font-black text-slate-950">
                    ברוכים הבאים
                  </p>
                </div>
              </div>
            )}

            <div className="mx-auto -mt-20 max-w-5xl rounded-[2.2rem] border border-white/90 bg-white/92 p-5 text-center shadow-[0_30px_90px_rgba(30,41,59,0.14)] backdrop-blur-xl sm:p-7">
              <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-100 via-white to-blue-100 shadow-[0_22px_55px_rgba(124,58,237,0.22)]">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={`לוגו ${businessName}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-black text-violet-600">
                    {businessName?.charAt(0)?.toUpperCase() || "B"}
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                {businessName || "שם העסק"}
              </h1>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {isMeaningfulCategory(category) && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-black text-violet-800">
                    <Icon name="category" />
                    {category}
                  </span>
                )}

                {city && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700">
                    <Icon name="city" />
                    {city}
                  </span>
                )}

                {hasRating && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">
                    ⭐ {roundedAvg.toFixed(1)}
                    <span className="text-amber-600/80">
                      ({reviewsCount} ביקורות)
                    </span>
                  </span>
                )}
              </div>

              {description && (
                <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-8 text-slate-600">
                  {description}
                </p>
              )}

              <div className="mx-auto mt-6 grid max-w-4xl place-items-center gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {phone && (
                  <div className="w-full max-w-sm rounded-2xl border border-violet-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(245,243,255,0.78)_100%)] p-4 text-center shadow-[0_12px_32px_rgba(79,70,229,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(79,70,229,0.14)]">
                    <p className="text-xs font-black text-slate-400">טלפון</p>

                    <p
                      dir="ltr"
                      className="mt-1 text-center text-lg font-black text-slate-950"
                    >
                      {formattedPhone}
                    </p>
                  </div>
                )}

                {email && (
                  <div className="w-full max-w-sm rounded-2xl border border-violet-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(245,243,255,0.78)_100%)] p-4 text-center shadow-[0_12px_32px_rgba(79,70,229,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(79,70,229,0.14)]">
                    <p className="text-xs font-black text-slate-400">אימייל</p>

                    <p
                      dir="ltr"
                      className="mt-1 truncate text-center text-lg font-black text-slate-950"
                    >
                      {email}
                    </p>
                  </div>
                )}
              </div>

              {businessWebsiteUrl && (
                <a
                  href={normalizedWebsiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mx-auto mt-6 flex h-[52px] max-w-sm items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 text-sm font-black !text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5"
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

              <div className="mx-auto mt-7 max-w-5xl border-t border-violet-100/80 pt-6">
                <div
                  className="flex flex-wrap items-center justify-center gap-3 text-center"
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
                          "flex min-w-[124px] items-center justify-center rounded-2xl px-5 py-3 text-center text-sm font-black transition",
                          isActive
                            ? "bg-gradient-to-l from-violet-600 to-blue-600 text-white shadow-[0_14px_34px_rgba(124,58,237,0.30)]"
                            : "border border-violet-100 bg-white/90 text-slate-600 shadow-[0_8px_22px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:bg-violet-50 hover:text-violet-700 hover:shadow-[0_12px_30px_rgba(124,58,237,0.14)]",
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

              <div className="mx-auto mt-8 max-w-6xl rounded-[2rem] border border-violet-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(245,243,255,0.78)_48%,rgba(239,246,255,0.82)_100%)] p-5 text-center shadow-[0_20px_70px_rgba(79,70,229,0.12)] backdrop-blur-xl sm:p-8">
                {renderTabContent()}
              </div>
            </div>
          </div>
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