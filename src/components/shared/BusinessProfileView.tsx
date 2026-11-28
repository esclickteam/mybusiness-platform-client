"use client";

import React, {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useTranslation } from "react-i18next";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/socketContext";
import { useLocaleDir } from "@/hooks/useLocaleDir";
import PublicProfileCard from "@/components/shared/PublicProfileCard";
import { lockPageScroll } from "@/utils/pageScrollLock";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import "./publicProfile.css";

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

const TAB_KEYS: Record<ProfileTab, string> = {
  Main: "main",
  Gallery: "gallery",
  Reviews: "reviews",
  Website: "website",
  FAQs: "faqs",
};

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
  const { t } = useTranslation();
  const dir = useLocaleDir();
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

  useEffect(() => {
    if (!showReviewModal) return;
    return lockPageScroll();
  }, [showReviewModal]);

  useEffect(() => {
    if (!showReviewModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowReviewModal(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showReviewModal]);

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
            t("businessProfile.view.anonymousClient"),
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
      <BizuplyLoader fullScreen label={t("businessProfile.view.loading")} />
    );
  }

  if (error) {
    return (
      <main
        dir={dir}
        className="pub-profile min-h-screen px-4 py-8 text-start"
      >
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-rose-100 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-black text-rose-600">
            {t("businessProfile.view.loadErrorTitle")}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {t("businessProfile.view.loadErrorText")}
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main
        dir={dir}
        className="pub-profile min-h-screen px-4 py-8 text-start"
      >
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-black text-slate-800">
            {t("businessProfile.view.notFound")}
          </p>
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

  const reviewButton = !isOwner ? (
    <button type="button" className="biz-public__edit" style={{ position: "static" }} onClick={() => setShowReviewModal(true)}>
      {t("businessProfile.view.addReview")}
    </button>
  ) : null;

  return (
    <main dir={dir} className="biz-public min-h-screen px-4 py-6 text-start sm:px-6">
      <div className="biz-public__frame">
        <PublicProfileCard
          businessName={businessName}
          description={description}
          logoUrl={logoUrl}
          coverUrl={coverImage}
          category={isMeaningfulCategory(category) ? category : ""}
          city={city}
          phone={phone}
          email={email}
          formattedPhone={formattedPhone}
          websiteUrl={businessWebsiteUrl}
          whatsappUrl={businessWhatsappUrl}
          normalizedWebsiteUrl={normalizedWebsiteUrl}
          normalizedWhatsappUrl={normalizedWhatsappUrl}
          rating={roundedAvg}
          reviewsCount={reviewsCount}
          mainImages={mainImages}
          gallery={gallery}
          reviews={sortedReviews}
          faqs={faqs}
          tab={currentTab}
          onTabChange={handleTabChange}
          editHref={isOwner ? `/business/${bizId}/dashboard/build` : undefined}
          reviewsAction={reviewButton}
          highlightedReviewId={highlightedReviewId}
        />
      </div>
      {showReviewModal &&
        createPortal(
          <div
            className="biz-public__light"
            onClick={() => setShowReviewModal(false)}
            role="presentation"
          >
            <div
              className="biz-public__card"
              style={{ width: "min(640px, 100%)", maxHeight: "calc(100vh - 48px)", overflow: "auto" }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="review-form-title"
            >
              <button type="button" aria-label={t("businessProfile.view.closeReviewForm")} onClick={() => setShowReviewModal(false)}>
                {t("common.close", "Close")}
              </button>
              <Suspense
                fallback={
                  <div className="p-6">
                    <BizuplyLoader size="lg" label={t("businessProfile.view.loadingReviewForm")} />
                  </div>
                }
              >
                <ReviewForm
                  businessId={bizId}
                  socket={socket as any}
                  layout="modal"
                  onSuccess={async () => {
                    setShowReviewModal(false);
                    await Promise.all([refetch(), refetchReviews()]);
                  }}
                />
              </Suspense>
            </div>
          </div>,
          document.body
        )}
    </main>
  );
}
