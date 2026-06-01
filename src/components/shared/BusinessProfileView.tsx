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

const ServicesSelector = lazy(() => import("../ServicesSelector"));

const ClientCalendar = lazy(
  () =>
    import(
      "../../pages/business/dashboardPages/buildTabs/shopAndCalendar/Appointments/ClientCalendar"
    )
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

type ServiceItem = {
  _id: string;
  name?: string;
  title?: string;
  price?: number;
  duration?: number;
  [key: string]: unknown;
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
  category?: string;
  categories?: CategoryItem[];
  mainImages?: string[];
  gallery?: string[];
  address?: {
    city?: string;
  };
  faqs?: FaqItem[];
  services?: ServiceItem[];
  views_count?: number;
  rating?: number;
  reviewsCount?: number;
  reviews?: ReviewItem[];
};

type WorkHourItem = {
  day?: number | string;
  isOpen?: boolean;
  start?: string;
  end?: string;
  breaks?: unknown[];
  [key: string]: unknown;
};

type WorkHoursData = WorkHourItem[] | Record<string, WorkHourItem>;

type ScheduleMap = Record<string, WorkHourItem>;

type SocketLike = {
  emit: (...args: any[]) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
  _joinedRooms?: Set<string>;
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

const TAB_MAP: Record<string, string> = {
  main: "Main",
  gallery: "Gallery",
  reviews: "Reviews",
  faqs: "FAQs",
  calendar: "Calendar",
};

const TABS = ["Main", "Gallery", "Reviews", "FAQs", "Calendar"];

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

  const [currentTab, setCurrentTab] = useState(initialTab);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [schedule, setSchedule] = useState<ScheduleMap>({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null
  );
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const galleryRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const galleryVisible = useOnScreen(galleryRef);
  const reviewsVisible = useOnScreen(reviewsRef);
  const calendarVisible = useOnScreen(calendarRef);

  const [galleryLoaded, setGalleryLoaded] = useState(false);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [calendarLoaded, setCalendarLoaded] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<BusinessData>({
    queryKey: ["business", bizId],
    queryFn: async () => {
      const res = await API.get(`/business/${bizId}`);
      return res.data.business || res.data;
    },
    enabled: Boolean(bizId),
    staleTime: 5 * 60 * 1000,
  });

  const { data: workHoursData } = useQuery<WorkHoursData>({
    queryKey: ["workHours", bizId],
    queryFn: async () => {
      const res = await API.get("/appointments/get-work-hours", {
        params: { businessId: bizId },
      });

      return res.data.workHours;
    },
    enabled: Boolean(bizId),
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
    setServices(data.services || []);
  }, [data]);

  useEffect(() => {
    if (!workHoursData) return;

    let normalizedSchedule: ScheduleMap = {};

    if (Array.isArray(workHoursData)) {
      workHoursData.forEach((item) => {
        if (item.day === undefined || item.day === null) return;
        normalizedSchedule[String(item.day)] = item;
      });
    } else if (typeof workHoursData === "object") {
      normalizedSchedule = workHoursData;
    }

    setSchedule(normalizedSchedule);
  }, [workHoursData]);

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
          name: review.client?.name || "Anonymous",
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
    if (calendarVisible) setCalendarLoaded(true);
  }, [calendarVisible]);

  useEffect(() => {
    if (currentTab === "Gallery") setGalleryLoaded(true);
    if (currentTab === "Reviews") setReviewsLoaded(true);
    if (currentTab === "Calendar") setCalendarLoaded(true);
  }, [currentTab]);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    });
  }, [reviews]);

  const scheduleArray = useMemo(() => Object.values(schedule), [schedule]);

  const categories = useMemo<CategoryItem[]>(() => {
    return Array.isArray(data?.categories) ? data.categories : [];
  }, [data?.categories]);

  const roundedAvg =
    data?.rating != null ? Math.round(Number(data.rating) * 10) / 10 : 0;

  const reviewsCount =
    data?.reviewsCount != null ? Number(data.reviewsCount) : reviews.length;

  const hasRating = reviewsCount > 0;

  const isOwner = user?.role === "business" && user.businessId === bizId;

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setSelectedService(null);

    const key = tab.toLowerCase();
    window.history.replaceState(null, "", `?tab=${key}`);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          <p className="text-sm font-semibold text-slate-500">
            Loading business profile…
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-bold text-red-600">Error loading data</p>
          <p className="mt-2 text-sm text-slate-500">
            Please try refreshing the page.
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-800">
            Business not found
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
    category = "",
    mainImages = [],
    gallery = [],
    address: { city = "" } = {},
  } = data;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f4edff_0%,#f8fafc_38%,#ffffff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-violet-100 bg-white/85 shadow-[0_24px_80px_rgba(88,28,135,0.10)] backdrop-blur">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-52 h-64 w-64 rounded-full bg-fuchsia-100/60 blur-3xl" />

          <div className="relative px-5 py-6 sm:px-8 lg:px-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 text-xs font-bold text-violet-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Public Business Profile
              </div>

              {isOwner && (
                <Link
                  to={`/business/${bizId}/dashboard/edit`}
                  className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
                >
                  ✏️ Edit Business Details
                </Link>
              )}
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] border border-violet-100 bg-gradient-to-br from-violet-50 to-white shadow-xl shadow-violet-100">
                  {logoUrl ? (
                    <img
                      className="h-full w-full object-cover"
                      src={logoUrl}
                      alt={`${businessName} logo`}
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
                    {businessName}
                  </h1>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    {category && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 font-semibold text-violet-800">
                        <Icon name="category" />
                        {category}
                      </span>
                    )}

                    {city && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 font-semibold text-slate-700">
                        <Icon name="city" />
                        {city}
                      </span>
                    )}

                    {hasRating && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 font-semibold text-amber-700">
                        ⭐ {roundedAvg.toFixed(1)}
                        <span className="text-amber-600/80">
                          ({reviewsCount} reviews)
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-violet-100 bg-gradient-to-br from-violet-600 to-fuchsia-600 p-5 text-white shadow-xl shadow-violet-200">
                <p className="text-sm font-semibold text-violet-100">
                  Want to book an appointment?
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  Choose service, date and time
                </h2>
                <p className="mt-2 text-sm leading-6 text-violet-50">
                  This profile is public. Clients can book without creating an
                  account.
                </p>

                <button
                  type="button"
                  onClick={() => handleTabChange("Calendar")}
                  className="mt-5 w-full rounded-2xl bg-white px-5 py-3 text-sm font-black text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-50"
                >
                  Book Appointment
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              {phone && (
                <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-slate-950">
                    <Icon name="phone" />
                    Phone
                  </div>
                  <p className="mt-1 text-slate-600">{phone}</p>
                </div>
              )}

              {description && (
                <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm sm:col-span-2">
                  <div className="flex items-center gap-2 font-bold text-slate-950">
                    <Icon name="description" />
                    Description
                  </div>
                  <p className="mt-2 leading-7 text-slate-600">
                    {description}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-violet-100 pt-6">
              <div
                className="flex gap-3 overflow-x-auto pb-2"
                role="tablist"
                aria-label="Business profile tabs"
              >
                {TABS.map((tab) => {
                  const isActive = tab === currentTab;

                  return (
                    <button
                      key={tab}
                      type="button"
                      className={`shrink-0 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                        isActive
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                          : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-100 hover:bg-violet-50 hover:text-violet-700"
                      }`}
                      onClick={() => handleTabChange(tab)}
                      role="tab"
                      aria-selected={isActive}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-slate-100 bg-white/90 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
          {currentTab === "Main" && (
            <div className="space-y-8">
              {mainImages.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mainImages.slice(0, 6).map((url, index) => (
                    <img
                      key={`${url}-${index}`}
                      src={url}
                      alt={`Main image ${index + 1}`}
                      loading="lazy"
                      className="h-64 w-full rounded-[1.5rem] object-cover shadow-lg shadow-slate-100"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No images available"
                  text="Images added by the business will appear here."
                />
              )}

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-950">
                    Latest Reviews
                  </h2>

                  <button
                    type="button"
                    onClick={() => handleTabChange("Reviews")}
                    className="rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 hover:bg-violet-100"
                  >
                    View all
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
                    title="No reviews yet"
                    text="Customer reviews will appear here."
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
                        alt={`Gallery image ${index + 1}`}
                        loading="lazy"
                        className="h-64 w-full rounded-[1.5rem] object-cover shadow-lg shadow-slate-100"
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No gallery images"
                    text="Gallery images will appear here."
                  />
                )
              ) : (
                <p className="text-center text-sm font-semibold text-slate-500">
                  Loading gallery…
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
                        Customer Reviews
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {reviewsCount} reviews
                      </p>
                    </div>

                    {!isOwner && user && (
                      <button
                        type="button"
                        className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
                        onClick={() => setShowReviewModal(true)}
                      >
                        Add Review
                      </button>
                    )}
                  </div>

                  {showReviewModal && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                      onClick={() => setShowReviewModal(false)}
                    >
                      <div
                        className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Suspense fallback={<div>Loading review form...</div>}>
                          <ReviewForm
                            businessId={bizId}
                            socket={socket as any}
                            onSuccess={async () => {
                              setShowReviewModal(false);
                              await Promise.all([refetch(), refetchReviews()]);
                            }}
                          />
                        </Suspense>

                        <button
                          type="button"
                          className="mt-4 w-full rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200"
                          onClick={() => setShowReviewModal(false)}
                        >
                          Close
                        </button>
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
                      title="No reviews available"
                      text="Customer reviews will appear here."
                    />
                  )}
                </div>
              ) : (
                <p className="text-center text-sm font-semibold text-slate-500">
                  Loading reviews…
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
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-black text-slate-950 hover:bg-violet-50"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      >
                        <span>{faq.question}</span>
                        <span
                          className={`text-lg text-violet-600 transition ${
                            isOpen ? "rotate-180" : ""
                          }`}
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
                  title="No FAQs yet"
                  text="Questions and answers will appear here."
                />
              )}
            </div>
          )}

          {currentTab === "Calendar" && (
            <div ref={calendarRef}>
              {calendarLoaded ? (
                <div className="mx-auto max-w-5xl">
                  <div className="mb-6 text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
                      Public booking
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-slate-950">
                      {selectedService
                        ? "Choose Date & Time"
                        : "Choose a Service"}
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      Clients can schedule an appointment directly from this
                      public profile without logging in.
                    </p>
                  </div>

                  <Suspense fallback={<div>Loading services…</div>}>
                    <ServicesSelector
                      services={services}
                      categories={categories}
                      onSelect={(service: ServiceItem) =>
                        setSelectedService(service)
                      }
                    />
                  </Suspense>

                  {!selectedService ? (
                    <p className="mt-6 text-center text-sm font-semibold text-slate-500">
                      Please select a service to view available times.
                    </p>
                  ) : (
                    <div className="mt-6">
                      <button
                        type="button"
                        className="mb-5 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200"
                        onClick={() => setSelectedService(null)}
                      >
                        ← Change Service
                      </button>

                      <Suspense
                        fallback={<div>Loading appointment calendar…</div>}
                      >
                        <ClientCalendar
                          workHours={scheduleArray}
                          selectedService={selectedService}
                          onBackToList={() => setSelectedService(null)}
                          businessId={bizId}
                        />
                      </Suspense>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-sm font-semibold text-slate-500">
                  Loading calendar…
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-violet-200 bg-violet-50/50 px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
        ✨
      </div>
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}