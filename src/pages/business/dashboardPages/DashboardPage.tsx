"use client";

import React, {
  useEffect,
  useState,
  useRef,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import API from "@/api";
import { useAuth } from "@/context/AuthContext";
import { createSocket } from "@/socket";

import {
  lazyWithPreload,
  type PreloadableComponent,
} from "@/utils/lazyWithPreload";

import DashboardSkeleton from "@/components/DashboardSkeleton";
import UpgradeOfferCard from "@/components/UpgradeOfferCard";
import useAiInsights from "@/hooks/useAiInsights";
import AiInsightsPanel from "@/components/AiInsightsPanel";

/* =========================================================
   Types
========================================================= */

type AnyRecord = Record<string, any>;

type AuthUser = {
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  businessId?: string;
  businessName?: string;
  hasPaid?: boolean;
  paymentStatus?: string;
  isSubscriptionValid?: boolean;
  isEarlyBirdActive?: boolean;
  earlyBirdModalSeenAt?: string | null;
  earlyBirdExpiresAt?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  initialized: boolean;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  refreshUser: () => Promise<AuthUser | null>;
  setUser: (user: AuthUser | null) => void;
};

type Appointment = {
  _id?: string;
  id?: string;
  date: string;
  time?: string;
  serviceId?: string;
  serviceName?: string;
  clientName?: string;
  status?: string;
  [key: string]: any;
};

type DashboardStats = {
  businessName?: string;
  appointments?: Appointment[];
  appointments_count?: number;
  messages_count?: number;
  views_count?: number;
  requests_count?: number;
  orders_count?: number;
  reviews?: AnyRecord[];
  reviews_count?: number;
  notifications_count?: number;
  services?: Array<{
    _id: string;
    name: string;
  }>;
  [key: string]: any;
};

type RecommendationItem = {
  recommendationId: string;
  message: string;
  recommendation: string;
};

type SocketLike = {
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string) => void;
  emit: (event: string, ...args: any[]) => void;
  disconnect: () => void;
  auth?: AnyRecord;
};

type DashboardNavRefs = {
  cardsRef: React.RefObject<HTMLDivElement | null>;
  chartsRef: React.RefObject<HTMLDivElement | null>;
  appointmentsRef: React.RefObject<HTMLDivElement | null>;
};

type LazyAnyComponent = PreloadableComponent<React.ComponentType<any>>;

/* =========================================================
   Lazy Components
========================================================= */

const DashboardCards = lazyWithPreload(() =>
  import("@/components/DashboardCards")
) as LazyAnyComponent;

const BarChartComponent = lazyWithPreload(() =>
  import("@/components/dashboard/BarChart")
) as LazyAnyComponent;

const CalendarView = lazyWithPreload(() =>
  import("@/components/dashboard/CalendarView")
) as LazyAnyComponent;

const DailyAgenda = lazyWithPreload(() =>
  import("@/components/dashboard/DailyAgenda")
) as LazyAnyComponent;

const DashboardNav = lazyWithPreload(() =>
  import("@/components/dashboard/DashboardNav")
) as LazyAnyComponent;

/* =========================================================
   Helpers
========================================================= */

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function safeNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function formatNumber(value: unknown): string {
  return new Intl.NumberFormat("en-US").format(safeNumber(value));
}

function getTodayIso() {
  return new Date().toISOString().split("T")[0];
}

function enrichAppointment(
  appt: Appointment,
  business: DashboardStats = {}
): Appointment {
  let serviceName = appt.serviceName?.trim();

  if (!serviceName && business.services) {
    const service = business.services.find(
      (s) => s._id?.toString() === appt.serviceId?.toString()
    );

    serviceName = service?.name;
  }

  return {
    ...appt,
    clientName: appt.clientName?.trim() || "Unknown client",
    serviceName: serviceName || "Unknown service",
  };
}

function getUpcomingAppointmentsCount(appointments: Appointment[]) {
  const now = new Date();
  const endOfWeek = new Date();

  endOfWeek.setDate(now.getDate() + 7);

  return appointments.filter((appt) => {
    const apptDate = new Date(appt.date);
    return apptDate >= now && apptDate <= endOfWeek;
  }).length;
}

function getTodayAppointmentsCount(appointments: Appointment[]) {
  const today = getTodayIso();
  return appointments.filter((appt) => appt.date === today).length;
}

function getLastAppointments(appointments: Appointment[], limit = 5) {
  return [...appointments]
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
      const dateB = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
      return dateA - dateB;
    })
    .slice(0, limit);
}

async function fetchDashboardStats(
  businessId: string,
  refreshAccessToken: () => Promise<string | null>
): Promise<DashboardStats> {
  const token = await refreshAccessToken();

  if (!token) {
    throw new Error("No token");
  }

  const res = await API.get(`/business/${businessId}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}

async function fetchAppointments(
  businessId: string,
  refreshAccessToken: () => Promise<string | null>
): Promise<Appointment[]> {
  const token = await refreshAccessToken();

  if (!token) {
    throw new Error("No token");
  }

  const res = await API.get(
    `/appointments/all-with-services?businessId=${businessId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export function preloadDashboardComponents() {
  DashboardCards.preload();
  BarChartComponent.preload();
  CalendarView.preload();
  DailyAgenda.preload();
  DashboardNav.preload();
}

/* =========================================================
   Small UI Components
========================================================= */

function LoadingShell({ text }: { text: string }) {
  return (
    <div className="min-h-[70vh] bg-[#f7f4ff] px-5 py-10 text-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-center rounded-[32px] border border-violet-100 bg-white p-10 shadow-[0_20px_70px_rgba(88,28,135,0.10)]">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 animate-pulse rounded-full bg-violet-600" />
          <p className="text-sm font-bold text-slate-700">{text}</p>
        </div>
      </div>
    </div>
  );
}

function ErrorShell({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="min-h-[70vh] bg-[#f7f4ff] px-5 py-10 text-slate-950">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-red-100 bg-white p-8 text-center shadow-[0_20px_70px_rgba(127,29,29,0.10)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-red-50 text-2xl font-black text-red-600">
          !
        </div>
        <h1 className="text-2xl font-black">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-red-700">{message}</p>
      </div>
    </div>
  );
}

function PremiumMetricCard({
  label,
  value,
  hint,
  icon,
  tone = "violet",
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: string;
  tone?: "violet" | "emerald" | "amber" | "sky";
}) {
  const toneClasses = {
    violet: {
      card: "from-violet-50 to-white",
      icon: "bg-violet-100 text-violet-700",
      line: "bg-violet-500",
    },
    emerald: {
      card: "from-emerald-50 to-white",
      icon: "bg-emerald-100 text-emerald-700",
      line: "bg-emerald-500",
    },
    amber: {
      card: "from-amber-50 to-white",
      icon: "bg-amber-100 text-amber-700",
      line: "bg-amber-500",
    },
    sky: {
      card: "from-sky-50 to-white",
      icon: "bg-sky-100 text-sky-700",
      line: "bg-sky-500",
    },
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br ${toneClasses[tone].card} p-5 shadow-[0_16px_45px_rgba(88,28,135,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(88,28,135,0.13)]`}
    >
      <div
        className={`absolute left-0 top-0 h-full w-1.5 ${toneClasses[tone].line}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-2 text-sm leading-5 text-slate-600">{hint}</p>
        </div>

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${toneClasses[tone].icon}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  eyebrow,
  title,
  description,
  children,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(88,28,135,0.08)] sm:p-6 ${className}`}
    >
      <div className="mb-5">
        {eyebrow && (
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   Main Page
========================================================= */

export default function DashboardPage() {
  const {
    user,
    initialized,
    logout,
    refreshAccessToken,
    refreshUser,
    setUser,
  } = useAuth() as AuthContextValue;

  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as { conversationId?: string } | null;

  const today = useMemo(() => getTodayIso(), []);

  const cardsRef = useRef<HTMLDivElement | null>(null);
  const chartsRef = useRef<HTMLDivElement | null>(null);
  const appointmentsRef = useRef<HTMLDivElement | null>(null);

  const socketRef = useRef<SocketLike | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(
    []
  );
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshingUser, setIsRefreshingUser] = useState<boolean>(false);

  const { insights, loading: insightsLoading } = useAiInsights(businessId);

  const shouldShowEarlyBirdModal =
    user?.isEarlyBirdActive &&
    user?.paymentStatus === "trial" &&
    !user?.earlyBirdModalSeenAt &&
    !isRefreshingUser;

  useEffect(() => {
    document.body.setAttribute("data-theme", "business");

    return () => {
      document.body.removeAttribute("data-theme");
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      window.history.replaceState(
        {},
        document.title,
        location.pathname + location.search
      );
    }

    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    if (
      initialized &&
      user?.role === "business" &&
      user?.businessId &&
      location.pathname === "/dashboard"
    ) {
      navigate(`/business/${user.businessId}/dashboard`, { replace: true });
    }
  }, [initialized, user?.role, user?.businessId, location.pathname, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("paid") !== "1") return;

    setIsRefreshingUser(true);

    let attempts = 0;
    const maxAttempts = 10;

    const poll = async () => {
      attempts += 1;

      try {
        await refreshAccessToken();

        const updatedUser = await refreshUser();

        if (updatedUser?.hasPaid) {
          setIsRefreshingUser(false);
          setUser(updatedUser);
          window.history.replaceState({}, document.title, location.pathname);

          if (updatedUser.role === "business" && updatedUser.businessId) {
            navigate(`/business/${updatedUser.businessId}/dashboard`, {
              replace: true,
            });
          } else {
            navigate("/dashboard", { replace: true });
          }

          return;
        }

        if (attempts < maxAttempts) {
          setTimeout(poll, 3000);
          return;
        }

        setIsRefreshingUser(false);
        setAlertMessage(
          "Your subscription has not been activated yet. Try again soon."
        );
        window.history.replaceState({}, document.title, location.pathname);
      } catch {
        setIsRefreshingUser(false);
        setAlertMessage("Error checking subscription status.");
        window.history.replaceState({}, document.title, location.pathname);
      }
    };

    poll();
  }, [
    location.search,
    location.pathname,
    navigate,
    refreshAccessToken,
    refreshUser,
    setUser,
  ]);

  useEffect(() => {
    preloadDashboardComponents();
  }, []);

  const debouncedSetStats = useRef(
    debounce((newStats: DashboardStats) => {
      setStats(newStats);
      localStorage.setItem("dashboardStats", JSON.stringify(newStats));
    }, 300)
  ).current;

  const loadStats = useCallback(async () => {
    if (!businessId) return;

    setLoading(true);
    setError(null);

    const cached = localStorage.getItem("dashboardStats");

    if (cached) {
      try {
        setStats(JSON.parse(cached));
      } catch {
        localStorage.removeItem("dashboardStats");
      }
    }

    try {
      const data = await fetchDashboardStats(businessId, refreshAccessToken);
      setStats(data);
      localStorage.setItem("dashboardStats", JSON.stringify(data));
    } catch (err: any) {
      setError("Error loading data from server.");

      if (err?.message === "No token") {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [businessId, refreshAccessToken, logout]);

  const refreshAppointmentsFromAPI = useCallback(async () => {
    if (!businessId) return;

    try {
      const appts = await fetchAppointments(businessId, refreshAccessToken);

      setStats((oldStats) => ({
        ...(oldStats || {}),
        appointments: appts,
        appointments_count: appts.length,
      }));
    } catch (err) {
      console.error("Error refreshing appointments from API:", err);
    }
  }, [businessId, refreshAccessToken]);

  useEffect(() => {
    if (!initialized || !businessId) return;

    let isMounted = true;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const setupSocket = async () => {
      const token = await refreshAccessToken();

      if (!token) {
        logout();
        return;
      }

      const sock = (await createSocket(
        refreshAccessToken,
        logout,
        businessId
      )) as SocketLike | null;

      if (!sock || !isMounted) return;

      socketRef.current = sock;
      reconnectAttempts.current = 0;

      sock.on("connect", () => {
        sock.emit("joinBusinessRoom", businessId);
        sock.emit("subscribeToBusinessUpdates", businessId);
      });

      sock.on("disconnect", () => {
        if (isMounted && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(
            1000 * 2 ** reconnectAttempts.current,
            30000
          );

          reconnectTimeout = setTimeout(() => {
            reconnectAttempts.current += 1;
            setupSocket();
          }, delay);
        }
      });

      sock.on("tokenExpired", async () => {
        const newToken = await refreshAccessToken();

        if (!newToken) {
          logout();
          return;
        }

        sock.auth = {
          ...(sock.auth || {}),
          token: newToken,
        };

        sock.emit("authenticate", { token: newToken });
      });

      sock.on("dashboardUpdate", (newStats: DashboardStats) => {
        debouncedSetStats(newStats);
      });

      sock.on("appointmentCreated", refreshAppointmentsFromAPI);
      sock.on("appointmentUpdated", refreshAppointmentsFromAPI);
      sock.on("appointmentDeleted", refreshAppointmentsFromAPI);

      sock.on("newRecommendation", (rec: RecommendationItem) => {
        setRecommendations((prev) => [...prev, rec]);
      });

      sock.off("businessUpdates");

      sock.on("businessUpdates", (payload: any) => {
        try {
          const data =
            typeof payload === "string" ? JSON.parse(payload) : payload;

          if (!data?.type) return;

          const { type, data: eventData } = data;

          switch (type) {
            case "dashboardUpdate":
              debouncedSetStats(eventData);
              break;

            case "profileViewsUpdated":
              setStats((currentStats) => {
                if (!currentStats) return currentStats;

                if (
                  !eventData?.views_count ||
                  safeNumber(currentStats.views_count) >=
                    safeNumber(eventData.views_count)
                ) {
                  return currentStats;
                }

                return {
                  ...currentStats,
                  views_count: eventData.views_count,
                };
              });
              break;

            case "appointmentCreated":
            case "appointmentUpdated":
            case "appointmentDeleted":
              refreshAppointmentsFromAPI();
              break;

            case "newReview":
              setStats((currentStats) => {
                if (!currentStats) return currentStats;

                const exists = currentStats.reviews?.some(
                  (review) => review._id === eventData._id
                );

                if (exists) return currentStats;

                return {
                  ...currentStats,
                  reviews: [...(currentStats.reviews || []), eventData],
                  reviews_count: safeNumber(currentStats.reviews_count) + 1,
                };
              });
              break;

            case "newNotification":
            case "notificationBundle":
              setStats((currentStats) =>
                currentStats
                  ? {
                      ...currentStats,
                      notifications_count:
                        eventData.count ||
                        currentStats.notifications_count ||
                        0,
                    }
                  : currentStats
              );
              break;

            case "newMessage":
              setStats((currentStats) =>
                currentStats
                  ? {
                      ...currentStats,
                      messages_count:
                        safeNumber(currentStats.messages_count) + 1,
                    }
                  : currentStats
              );
              break;

            default:
              console.log("[Unhandled Business Update]", type);
          }
        } catch (err) {
          console.error("Error parsing businessUpdates payload:", err);
        }
      });

      sock.on("newReview", (reviewData: AnyRecord) => {
        setStats((currentStats) => {
          if (!currentStats) return currentStats;

          const exists = currentStats.reviews?.some(
            (review) => review._id === reviewData._id
          );

          if (exists) return currentStats;

          return {
            ...currentStats,
            reviews: [...(currentStats.reviews || []), reviewData],
            reviews_count: safeNumber(currentStats.reviews_count) + 1,
          };
        });
      });
    };

    loadStats();
    refreshAppointmentsFromAPI();
    setupSocket();

    return () => {
      isMounted = false;

      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }

      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [
    initialized,
    businessId,
    logout,
    refreshAccessToken,
    debouncedSetStats,
    refreshAppointmentsFromAPI,
    loadStats,
  ]);

  useEffect(() => {
    if (!socketRef.current) return;

    if (location.pathname.includes("/messages")) {
      const conversationId = locationState?.conversationId;

      if (conversationId) {
        socketRef.current.emit("markMessagesRead", conversationId);
      }
    }
  }, [location.pathname, locationState]);

  const handleEarlyBirdUpgrade = async () => {
    if (!user?.userId) return;

    try {
      await API.post("/users/mark-earlybird-modal-seen");

      const res = await API.post("/stripe/create-checkout-session", {
        userId: user.userId,
        plan: "monthly",
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Early Bird checkout error:", err);
      setAlertMessage("Something went wrong. Please try again.");
    }
  };

  if (!initialized) {
    return <LoadingShell text="Loading business dashboard..." />;
  }

  const isAdmin = user?.role === "admin";
  const isBusinessOwner =
    user?.role === "business" && user?.businessId === businessId;

  if (!isAdmin && !isBusinessOwner) {
    return (
      <ErrorShell
        title="Access denied"
        message="You do not have permission to access this business dashboard."
      />
    );
  }

  if (loading && !stats) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorShell
        title="Could not load dashboard"
        message={alertMessage || error}
      />
    );
  }

  if (isRefreshingUser) {
    return <LoadingShell text="Refreshing user info..." />;
  }

  const effectiveStats = stats || {};

  const enrichedAppointments = (effectiveStats.appointments || []).map((appt) =>
    enrichAppointment(appt, effectiveStats)
  );

  const syncedStats: DashboardStats = {
    ...effectiveStats,
    messages_count: safeNumber(effectiveStats.messages_count),
  };

  const navRefs: DashboardNavRefs = {
    cardsRef,
    chartsRef,
    appointmentsRef,
  };

  const todayAppointments = getTodayAppointmentsCount(enrichedAppointments);
  const upcomingAppointments = getUpcomingAppointmentsCount(
    enrichedAppointments
  );
  const recentAppointments = getLastAppointments(enrichedAppointments, 5);

  const metricCards = [
    {
      label: "Profile views",
      value: formatNumber(syncedStats.views_count),
      hint: "Live exposure from your public business page",
      icon: "👁",
      tone: "violet" as const,
    },
    {
      label: "Appointments",
      value: formatNumber(syncedStats.appointments_count),
      hint: `${todayAppointments} today · ${upcomingAppointments} next 7 days`,
      icon: "📅",
      tone: "sky" as const,
    },
    {
      label: "Messages",
      value: formatNumber(syncedStats.messages_count),
      hint: "Unread and active client conversations",
      icon: "💬",
      tone: "emerald" as const,
    },
    {
      label: "Reviews",
      value: formatNumber(syncedStats.reviews_count),
      hint: "Customer trust and rating activity",
      icon: "⭐",
      tone: "amber" as const,
    },
  ];

  return (
    <div
      dir="ltr"
      className="min-h-screen overflow-x-hidden overflow-y-auto bg-[#f7f4ff] text-slate-950"
    >
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-12rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-violet-200/70 blur-[120px]" />
        <div className="absolute right-[-10rem] top-[10rem] h-[30rem] w-[30rem] rounded-full bg-sky-100/80 blur-[120px]" />
        <div className="absolute bottom-[-14rem] left-[34%] h-[32rem] w-[32rem] rounded-full bg-fuchsia-100/80 blur-[120px]" />
      </div>

      <div className="mx-auto flex w-full max-w-[1760px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-30 mb-6 overflow-hidden rounded-[34px] border border-violet-100 bg-white/95 px-5 py-5 shadow-[0_24px_70px_rgba(88,28,135,0.10)] backdrop-blur-2xl sm:px-7">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />

          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.8)]" />
                  Live
                </span>

                <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
                  Business dashboard
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl xl:text-5xl">
                Business Dashboard
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                Manage appointments, AI insights, client messages, reviews,
                exposure and real-time business activity from one clean
                workspace.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Business
                </p>
                <p className="mt-2 truncate text-sm font-black text-slate-950">
                  {user?.businessName ||
                    syncedStats.businessName ||
                    "Your business"}
                </p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Plan status
                </p>
                <p className="mt-2 text-sm font-black text-slate-950">
                  {user?.hasPaid ? "Paid" : user?.paymentStatus || "Trial"}
                </p>
              </div>

              <button
                type="button"
                onClick={loadStats}
                className="rounded-[24px] border border-violet-200 bg-violet-600 p-4 text-left text-white shadow-[0_16px_35px_rgba(109,40,217,0.22)] transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-100">
                  Refresh
                </p>
                <p className="mt-2 text-sm font-black">Sync dashboard</p>
              </button>
            </div>
          </div>
        </header>

        <main className="space-y-6 pb-12">
          {alertMessage && (
            <div className="rounded-[26px] border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800 shadow-[0_14px_40px_rgba(180,83,9,0.10)]">
              {alertMessage}
            </div>
          )}

          {shouldShowEarlyBirdModal && (
            <UpgradeOfferCard
              expiresAt={user?.earlyBirdExpiresAt}
              onUpgrade={handleEarlyBirdUpgrade}
              onClose={async () => {
                try {
                  await API.post("/users/mark-earlybird-modal-seen");
                  await refreshUser();
                } catch {
                  setAlertMessage("Could not close the offer. Try again.");
                }
              }}
            />
          )}

          <section
            ref={cardsRef}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {metricCards.map((card) => (
              <PremiumMetricCard key={card.label} {...card} />
            ))}
          </section>

          <section
            ref={appointmentsRef}
            className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
          >
            <SectionCard
              eyebrow="Daily agenda"
              title="Selected day schedule"
              description="See the appointments for the selected date in a clean operational view."
            >
              <Suspense
                fallback={
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-600">
                    Loading agenda...
                  </div>
                }
              >
                <DailyAgenda
                  date={selectedDate}
                  appointments={enrichedAppointments}
                  businessName={syncedStats.businessName}
                  businessId={businessId}
                />
              </Suspense>
            </SectionCard>

            <SectionCard
              eyebrow="Calendar"
              title="Appointment overview"
              description="Choose a date and manage your appointment flow."
            >
              <Suspense
                fallback={
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-600">
                    Loading calendar...
                  </div>
                }
              >
                <CalendarView
                  appointments={enrichedAppointments}
                  onDateClick={setSelectedDate}
                  selectedDate={selectedDate}
                />
              </Suspense>
            </SectionCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)]">
            <SectionCard
              eyebrow="AI action center"
              title="Smart insights for your business"
              description="AI recommendations based on your activity, clients, appointments and business performance."
            >
              <AiInsightsPanel
                insights={insights}
                loading={insightsLoading}
                businessId={businessId}
              />
            </SectionCard>

            <SectionCard eyebrow="Today overview" title="Operations pulse">
              <div className="space-y-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500">
                    Today appointments
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-950">
                    {todayAppointments}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500">
                    Upcoming week
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-950">
                    {upcomingAppointments}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500">
                    Pending AI approvals
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-950">
                    {recommendations.length}
                  </p>
                </div>
              </div>
            </SectionCard>
          </section>

          {recommendations.length > 0 && (
            <SectionCard
              eyebrow="Pending approval"
              title="AI recommendations"
              description="Review AI suggestions before sending them to customers."
            >
              <ul className="space-y-3">
                {recommendations.map(
                  ({ recommendationId, message, recommendation }) => (
                    <li
                      key={recommendationId}
                      className="rounded-[26px] border border-amber-200 bg-amber-50 p-4"
                    >
                      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div className="space-y-2">
                          <p className="text-sm leading-6 text-slate-700">
                            <span className="font-black text-slate-950">
                              Client:
                            </span>{" "}
                            {message}
                          </p>

                          <p className="text-sm leading-6 text-amber-800">
                            <span className="font-black text-slate-950">
                              AI Suggestion:
                            </span>{" "}
                            {recommendation}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-[0_14px_30px_rgba(109,40,217,0.22)] transition hover:-translate-y-0.5 hover:bg-violet-700"
                          onClick={() => {
                            if (!socketRef.current) {
                              setAlertMessage("Socket not connected");
                              return;
                            }

                            socketRef.current.emit(
                              "approveRecommendation",
                              { recommendationId },
                              (res: any) => {
                                if (res?.ok) {
                                  setRecommendations((prev) =>
                                    prev.filter(
                                      (item) =>
                                        item.recommendationId !==
                                        recommendationId
                                    )
                                  );
                                } else {
                                  setAlertMessage(
                                    `Error: ${res?.error || "Unknown error"}`
                                  );
                                }
                              }
                            );
                          }}
                        >
                          Approve & Send
                        </button>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </SectionCard>
          )}

          <SectionCard
            eyebrow="Business performance"
            title="Dashboard cards"
            description="Your existing performance cards, connected to the live stats object."
          >
            <Suspense
              fallback={
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-600">
                  Loading cards...
                </div>
              }
            >
              <DashboardCards
                stats={syncedStats}
                unreadCount={syncedStats.messages_count}
              />
            </Suspense>
          </SectionCard>

          <SectionCard
            eyebrow="Growth analytics"
            title="Clients who booked appointments by month"
            description="Monthly appointment demand and client activity trends."
            className=""
          >
            <div ref={chartsRef}>
              <Suspense
                fallback={
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-600">
                    Loading chart...
                  </div>
                }
              >
                <BarChartComponent
                  appointments={enrichedAppointments}
                  title="Clients Who Booked Appointments by Month"
                />
              </Suspense>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Upcoming appointments"
            title="Next activity"
            description="A quick view of the next appointments in your business."
          >
            {recentAppointments.length === 0 ? (
              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                No upcoming appointments yet.
              </div>
            ) : (
              <div className="grid gap-3">
                {recentAppointments.map((appt, index) => (
                  <div
                    key={appt._id || appt.id || `${appt.date}-${appt.time}-${index}`}
                    className="grid gap-3 rounded-[26px] border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <p className="text-sm font-black text-slate-950">
                        {appt.clientName}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {appt.serviceName}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
                      {appt.date} {appt.time || ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <div className="hidden">
            <Suspense fallback={null}>
              <DashboardNav refs={navRefs} />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}