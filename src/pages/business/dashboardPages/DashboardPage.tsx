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
   Small UI blocks
========================================================= */

function LoadingShell({ text }: { text: string }) {
  return (
    <div className="min-h-screen bg-[#070816] px-5 py-10 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center rounded-[36px] border border-white/10 bg-white/[0.06] p-10 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 animate-pulse rounded-full bg-violet-300" />
          <p className="text-sm font-bold text-slate-200">{text}</p>
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
    <div className="min-h-screen bg-[#070816] px-5 py-10 text-white">
      <div className="mx-auto max-w-3xl rounded-[36px] border border-red-300/20 bg-red-500/10 p-8 text-center shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-red-400/15 text-2xl">
          !
        </div>
        <h1 className="text-2xl font-black">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-red-100">{message}</p>
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
    violet: "from-violet-400/20 to-fuchsia-400/10 text-violet-100",
    emerald: "from-emerald-400/20 to-teal-400/10 text-emerald-100",
    amber: "from-amber-400/20 to-orange-400/10 text-amber-100",
    sky: "from-sky-400/20 to-cyan-400/10 text-sky-100",
  };

  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.08] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.12]">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl transition group-hover:bg-white/20" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
            {label}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-white">
            {value}
          </p>
          <p className="mt-2 text-sm leading-5 text-slate-300">{hint}</p>
        </div>

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br text-2xl ${toneClasses[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
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
                      messages_count: safeNumber(currentStats.messages_count) + 1,
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
    return <LoadingShell text="Loading business command center..." />;
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
      className="min-h-screen overflow-hidden bg-[#070816] text-slate-100"
    >
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-violet-600/30 blur-[120px]" />
        <div className="absolute right-[-10rem] top-[12rem] h-[30rem] w-[30rem] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-[-14rem] left-[34%] h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1760px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-30 mb-6 overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.09] px-5 py-5 shadow-[0_26px_100px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:px-7">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-emerald-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
                  Live
                </span>

                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-violet-100">
                  Business command center
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl xl:text-5xl">
                Business Dashboard
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                One premium workspace for appointments, AI insights, client
                messages, reviews, exposure and real-time business activity.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.08] p-4 shadow-xl">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Business
                </p>
                <p className="mt-2 truncate text-sm font-black text-white">
                  {user?.businessName ||
                    syncedStats.businessName ||
                    "Your business"}
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.08] p-4 shadow-xl">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Plan status
                </p>
                <p className="mt-2 text-sm font-black text-white">
                  {user?.hasPaid ? "Paid" : user?.paymentStatus || "Trial"}
                </p>
              </div>

              <button
                type="button"
                onClick={loadStats}
                className="rounded-[28px] border border-violet-300/25 bg-violet-400/15 p-4 text-left shadow-xl transition hover:-translate-y-0.5 hover:bg-violet-400/20"
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-100">
                  Refresh
                </p>
                <p className="mt-2 text-sm font-black text-white">
                  Sync dashboard
                </p>
              </button>
            </div>
          </div>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-32 lg:h-[calc(100vh-9rem)]">
            <div className="flex h-full flex-col overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.08] p-4 shadow-[0_26px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <div className="mb-4 overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/40 p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200">
                  Navigation
                </p>
                <h2 className="mt-2 text-xl font-black text-white">
                  Dashboard sections
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Jump between cards, analytics, appointments and calendar.
                </p>
              </div>

              <nav className="min-h-0 flex-1 overflow-y-auto pr-1">
                <Suspense
                  fallback={
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-sm font-semibold text-slate-200">
                      Loading navigation...
                    </div>
                  }
                >
                  <DashboardNav refs={navRefs} />
                </Suspense>
              </nav>

              <div className="mt-4 rounded-[30px] border border-cyan-300/20 bg-cyan-400/10 p-5">
                <p className="text-sm font-black text-white">
                  Real-time engine
                </p>
                <p className="mt-2 text-xs leading-5 text-cyan-100">
                  Live updates are connected to your business socket room.
                </p>
              </div>
            </div>
          </aside>

          <main className="min-w-0 space-y-6 pb-10">
            {alertMessage && (
              <div className="rounded-[30px] border border-amber-300/20 bg-amber-400/10 p-4 text-sm font-semibold text-amber-100 shadow-xl backdrop-blur-2xl">
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

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.55fr)]">
              <div className="overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.08] p-5 shadow-[0_26px_100px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-6">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200">
                      AI action center
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-white">
                      Smart insights for your business
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      AI recommendations based on your activity, clients,
                      appointments and business performance.
                    </p>
                  </div>
                </div>

                <AiInsightsPanel
                  insights={insights}
                  loading={insightsLoading}
                  businessId={businessId}
                />
              </div>

              <div className="rounded-[38px] border border-white/10 bg-white/[0.08] p-5 shadow-[0_26px_100px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                  Today overview
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Operations pulse
                </h2>

                <div className="mt-6 space-y-3">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
                    <p className="text-xs font-bold text-slate-400">
                      Today appointments
                    </p>
                    <p className="mt-2 text-3xl font-black text-white">
                      {todayAppointments}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
                    <p className="text-xs font-bold text-slate-400">
                      Upcoming week
                    </p>
                    <p className="mt-2 text-3xl font-black text-white">
                      {upcomingAppointments}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
                    <p className="text-xs font-bold text-slate-400">
                      Pending AI approvals
                    </p>
                    <p className="mt-2 text-3xl font-black text-white">
                      {recommendations.length}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {recommendations.length > 0 && (
              <section className="rounded-[38px] border border-amber-300/20 bg-amber-400/10 p-5 shadow-[0_26px_100px_rgba(0,0,0,0.24)] backdrop-blur-2xl sm:p-6">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-100">
                      Pending approval
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-white">
                      AI recommendations
                    </h2>
                  </div>

                  <span className="inline-flex w-fit items-center rounded-full border border-amber-200/20 bg-amber-300/15 px-4 py-2 text-sm font-black text-amber-100">
                    {recommendations.length}
                  </span>
                </div>

                <ul className="space-y-3">
                  {recommendations.map(
                    ({ recommendationId, message, recommendation }) => (
                      <li
                        key={recommendationId}
                        className="rounded-[28px] border border-white/10 bg-slate-950/35 p-4"
                      >
                        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                          <div className="space-y-2">
                            <p className="text-sm leading-6 text-slate-200">
                              <span className="font-black text-white">
                                Client:
                              </span>{" "}
                              {message}
                            </p>

                            <p className="text-sm leading-6 text-amber-100">
                              <span className="font-black text-white">
                                AI Suggestion:
                              </span>{" "}
                              {recommendation}
                            </p>
                          </div>

                          <button
                            type="button"
                            className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-violet-100"
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
              </section>
            )}

            <section className="rounded-[38px] border border-white/10 bg-white/[0.08] p-5 shadow-[0_26px_100px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200">
                  Original business cards
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Business performance cards
                </h2>
              </div>

              <Suspense
                fallback={
                  <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-sm font-semibold text-slate-200">
                    Loading cards...
                  </div>
                }
              >
                <DashboardCards
                  stats={syncedStats}
                  unreadCount={syncedStats.messages_count}
                />
              </Suspense>
            </section>

            <section
              ref={chartsRef}
              className="rounded-[38px] border border-white/10 bg-white/[0.08] p-5 shadow-[0_26px_100px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-6"
            >
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200">
                    Growth analytics
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    Clients who booked appointments by month
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Monthly appointment demand and client activity trends.
                  </p>
                </div>
              </div>

              <Suspense
                fallback={
                  <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-sm font-semibold text-slate-200">
                    Loading chart...
                  </div>
                }
              >
                <BarChartComponent
                  appointments={enrichedAppointments}
                  title="Clients Who Booked Appointments by Month"
                />
              </Suspense>
            </section>

            <section
              ref={appointmentsRef}
              className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
            >
              <div className="rounded-[38px] border border-white/10 bg-white/[0.08] p-5 shadow-[0_26px_100px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-6">
                <div className="mb-5">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200">
                    Daily agenda
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    Selected day schedule
                  </h2>
                </div>

                <Suspense
                  fallback={
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-sm font-semibold text-slate-200">
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
              </div>

              <div className="rounded-[38px] border border-white/10 bg-white/[0.08] p-5 shadow-[0_26px_100px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-6">
                <div className="mb-5">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200">
                    Calendar
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    Appointment overview
                  </h2>
                </div>

                <Suspense
                  fallback={
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-sm font-semibold text-slate-200">
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
              </div>
            </section>

            <section className="rounded-[38px] border border-white/10 bg-white/[0.08] p-5 shadow-[0_26px_100px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                    Upcoming appointments
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    Next activity
                  </h2>
                </div>
              </div>

              {recentAppointments.length === 0 ? (
                <div className="rounded-[30px] border border-white/10 bg-slate-950/35 p-6 text-sm text-slate-300">
                  No upcoming appointments yet.
                </div>
              ) : (
                <div className="grid gap-3">
                  {recentAppointments.map((appt, index) => (
                    <div
                      key={appt._id || appt.id || `${appt.date}-${appt.time}-${index}`}
                      className="grid gap-3 rounded-[30px] border border-white/10 bg-slate-950/35 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div>
                        <p className="text-sm font-black text-white">
                          {appt.clientName}
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                          {appt.serviceName}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-slate-100">
                        {appt.date} {appt.time || ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}