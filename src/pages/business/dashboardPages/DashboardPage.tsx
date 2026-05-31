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
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  TrendingUp,
  CalendarDays,
  Star,
  ArrowRight,
} from "lucide-react";

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
  recentMessages?: Array<{
    _id?: string;
    id?: string;
    senderName?: string;
    senderBusiness?: string;
    text?: string;
    createdAt?: string;
  }>;
  collaborations_count?: number;
  proposals_count?: number;
  revenue?: number;
  revenue_count?: number;
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

function formatNumber(value: unknown, locale = "en-US"): string {
  return new Intl.NumberFormat(locale).format(safeNumber(value));
}

function formatMoney(value: unknown, locale = "en-US", currency = "USD"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(safeNumber(value));
}

function getTodayIso(): string {
  return new Date().toISOString().split("T")[0];
}

function getLocale(language?: string): string {
  if (language === "he") return "he-IL";
  return language || "en-US";
}

function getCurrency(language?: string): string {
  return language === "he" || language === "he-IL" ? "ILS" : "USD";
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

function getUpcomingAppointmentsCount(appointments: Appointment[]): number {
  const now = new Date();
  const endOfWeek = new Date();

  endOfWeek.setDate(now.getDate() + 7);

  return appointments.filter((appt) => {
    const apptDate = new Date(appt.date);
    return apptDate >= now && apptDate <= endOfWeek;
  }).length;
}

function getTodayAppointmentsCount(appointments: Appointment[]): number {
  const today = getTodayIso();
  return appointments.filter((appt) => appt.date === today).length;
}

function getLastAppointments(appointments: Appointment[], limit = 5) {
  const now = Date.now();

  return [...appointments]
    .filter((appt) => {
      const dateTime = new Date(
        `${appt.date}T${appt.time || "00:00"}`
      ).getTime();

      return Number.isFinite(dateTime) && dateTime >= now - 24 * 60 * 60 * 1000;
    })
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

function LoadingShell({ text }: { text: React.ReactNode }) {
  return (
    <div className="min-h-[70vh] bg-[#f5f6fb] px-5 py-10 text-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-center rounded-[28px] border border-violet-100 bg-white p-10 shadow-[0_20px_60px_rgba(88,28,135,0.08)]">
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
  title: React.ReactNode;
  message: React.ReactNode;
}) {
  return (
    <div className="min-h-[70vh] bg-[#f5f6fb] px-5 py-10 text-slate-950">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-red-100 bg-white p-8 text-center shadow-[0_20px_60px_rgba(127,29,29,0.08)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-red-50 text-2xl font-black text-red-600">
          !
        </div>
        <h1 className="text-2xl font-black">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-red-700">{message}</p>
      </div>
    </div>
  );
}

function SectionShell({
  title,
  action,
  children,
  className = "",
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.05)] ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black tracking-tight text-slate-950">
          {title}
        </h2>

        {action}
      </div>

      {children}
    </section>
  );
}

function WelcomeBanner({
  title,
  subtitle,
  insightTitle,
  insightText,
}: {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  insightTitle: React.ReactNode;
  insightText: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
      <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-[0_16px_35px_rgba(109,40,217,0.24)]">
            <Sparkles size={26} />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h1>

            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[24px] border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-violet-50 px-5 py-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
        <div className="relative z-10 max-w-[330px]">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-200 bg-white text-violet-600">
            <TrendingUp size={22} />
          </div>

          <p className="text-sm font-black text-violet-700">{insightTitle}</p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {insightText}
          </p>
        </div>

        <div className="pointer-events-none absolute bottom-0 right-0 h-full w-[48%] opacity-90">
          <div className="absolute bottom-4 right-3 h-24 w-16 rounded-t-[999px] bg-violet-200/80" />
          <div className="absolute bottom-4 right-16 h-32 w-20 rounded-t-[999px] bg-violet-300/80" />
          <div className="absolute bottom-4 right-32 h-20 w-16 rounded-t-[999px] bg-violet-100/90" />
          <div className="absolute bottom-4 right-44 h-14 w-12 rounded-t-[999px] bg-violet-50" />
          <div className="absolute bottom-[130px] right-[92px] h-12 w-[2px] bg-slate-400" />
          <div className="absolute bottom-[168px] right-[84px] rounded-full bg-pink-400 px-3 py-1 text-[10px] font-bold text-white shadow">
            ★
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStatCard({
  title,
  value,
  delta,
  tone = "violet",
}: {
  title: React.ReactNode;
  value: React.ReactNode;
  delta?: React.ReactNode;
  tone?: "violet" | "green" | "pink";
}) {
  const toneMap = {
    violet: "bg-violet-50 text-violet-700 border-violet-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    pink: "bg-pink-50 text-pink-700 border-pink-100",
  };

  return (
    <div className={`rounded-[18px] border p-4 ${toneMap[tone]} shadow-sm`}>
      <p className="text-xs font-bold text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
      {delta && <p className="mt-1 text-xs font-semibold">{delta}</p>}
    </div>
  );
}

function PipelineSection({
  title,
  actionText,
  items,
}: {
  title: React.ReactNode;
  actionText: React.ReactNode;
  items: Array<{ label: React.ReactNode; value: number; tone: string }>;
}) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <SectionShell
      title={title}
      action={
        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          {actionText}
        </button>
      }
      className="h-full"
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.tone }}
                />
                <span className="truncate text-sm font-semibold text-slate-700">
                  {item.label}
                </span>
              </div>

              <span className="text-sm font-bold text-slate-900">
                {item.value}
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max((item.value / maxValue) * 100, 8)}%`,
                  backgroundColor: item.tone,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function RecentMessagesCard({
  title,
  actionText,
  messages,
  emptyText,
}: {
  title: React.ReactNode;
  actionText: React.ReactNode;
  messages: Array<{
    name: string;
    subtitle?: string;
    text?: string;
    badge?: string | number;
  }>;
  emptyText: React.ReactNode;
}) {
  return (
    <SectionShell
      title={title}
      action={
        <button
          type="button"
          className="text-xs font-bold text-violet-600 hover:text-violet-800"
        >
          {actionText}
        </button>
      }
      className="h-full"
    >
      {messages.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-black text-violet-700">
                {item.name?.charAt(0)?.toUpperCase() || "C"}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-900">
                      {item.name}
                    </p>

                    {item.subtitle && (
                      <p className="truncate text-xs text-slate-500">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {item.badge ? (
                    <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-violet-100 px-2 text-xs font-bold text-violet-700">
                      {item.badge}
                    </span>
                  ) : null}
                </div>

                {item.text && (
                  <p className="mt-1 max-h-10 overflow-hidden text-sm leading-5 text-slate-600">
                    {item.text}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  );
}

function RecentActivityCard({
  title,
  actionText,
  items,
  emptyText,
}: {
  title: React.ReactNode;
  actionText: React.ReactNode;
  items: Array<{
    icon: React.ReactNode;
    text: React.ReactNode;
    subtext?: React.ReactNode;
  }>;
  emptyText: React.ReactNode;
}) {
  return (
    <SectionShell
      title={title}
      action={
        <button
          type="button"
          className="text-xs font-bold text-violet-600 hover:text-violet-800"
        >
          {actionText}
        </button>
      }
      className="h-full"
    >
      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                {item.icon}
              </div>

              <div className="min-w-0">
                <p className="text-sm text-slate-700">{item.text}</p>

                {item.subtext && (
                  <p className="mt-1 text-xs text-slate-400">{item.subtext}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  );
}

function CollaborationsCard({
  title,
  actionText,
  activeValue,
  activeLabel,
  proposalsValue,
  proposalsLabel,
  emptyText,
}: {
  title: React.ReactNode;
  actionText: React.ReactNode;
  activeValue: React.ReactNode;
  activeLabel: React.ReactNode;
  proposalsValue: React.ReactNode;
  proposalsLabel: React.ReactNode;
  emptyText: React.ReactNode;
}) {
  return (
    <SectionShell
      title={title}
      action={
        <button
          type="button"
          className="text-xs font-bold text-violet-600 hover:text-violet-800"
        >
          {actionText}
        </button>
      }
      className="h-full"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <MiniStatCard title={activeLabel} value={activeValue} tone="violet" />
        <MiniStatCard title={proposalsLabel} value={proposalsValue} tone="pink" />
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        {emptyText}
      </div>
    </SectionShell>
  );
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation();

  const tx = useCallback(
    (key: string, fallback: string, values?: Record<string, any>): string => {
      const translated = t(key, {
        ...(values || {}),
        returnObjects: false,
      } as any);

      if (typeof translated !== "string") {
        return fallback;
      }

      if (translated === key) {
        return fallback;
      }

      return translated;
    },
    [t]
  );

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
        setAlertMessage(tx("dashboard.states.subscriptionPending", "Your subscription has not been activated yet. Try again in a few minutes."));
        window.history.replaceState({}, document.title, location.pathname);
      } catch {
        setIsRefreshingUser(false);
        setAlertMessage(tx("dashboard.states.subscriptionCheckError", "Error checking subscription status."));
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
    tx,
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
      setError(tx("dashboard.states.loadErrorMessage", "Error loading data from server."));

      if (err?.message === "No token") {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [businessId, refreshAccessToken, logout, tx]);

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
      setAlertMessage(tx("dashboard.states.somethingWrong", "Something went wrong. Please try again."));
    }
  };

  if (!initialized) {
    return (
      <LoadingShell
        text={tx("dashboard.states.loading", "Loading business dashboard...")}
      />
    );
  }

  const isAdmin = user?.role === "admin";
  const isBusinessOwner =
    user?.role === "business" && user?.businessId === businessId;

  if (!isAdmin && !isBusinessOwner) {
    return (
      <ErrorShell
        title={tx("dashboard.states.accessDeniedTitle", "Access denied")}
        message={tx(
          "dashboard.states.accessDeniedMessage",
          "You do not have permission to access this business dashboard."
        )}
      />
    );
  }

  if (loading && !stats) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorShell
        title={tx("dashboard.states.loadErrorTitle", "Could not load dashboard")}
        message={alertMessage || error}
      />
    );
  }

  if (isRefreshingUser) {
    return (
      <LoadingShell
        text={tx("dashboard.states.refreshingUser", "Refreshing user data...")}
      />
    );
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

  const locale = getLocale(i18n.language);
  const currency = getCurrency(i18n.language);

  const todayAppointments = getTodayAppointmentsCount(enrichedAppointments);
  const upcomingAppointments = getUpcomingAppointmentsCount(
    enrichedAppointments
  );
  const recentAppointments = getLastAppointments(enrichedAppointments, 5);

  const pipelineItems = [
    {
      label: tx("dashboard.pipeline.leads", "Lead"),
      value: safeNumber(syncedStats.views_count),
      tone: "#8b5cf6",
    },
    {
      label: tx("dashboard.pipeline.qualified", "Qualified"),
      value: safeNumber(syncedStats.messages_count),
      tone: "#3b82f6",
    },
    {
      label: tx("dashboard.pipeline.proposals", "Proposal Sent"),
      value: safeNumber(syncedStats.requests_count),
      tone: "#f59e0b",
    },
    {
      label: tx("dashboard.pipeline.negotiation", "Negotiation"),
      value: safeNumber(syncedStats.appointments_count),
      tone: "#06b6d4",
    },
    {
      label: tx("dashboard.pipeline.closedWon", "Closed Won"),
      value: safeNumber(syncedStats.orders_count),
      tone: "#22c55e",
    },
  ];

  const recentMessages =
    Array.isArray(syncedStats.recentMessages) &&
    syncedStats.recentMessages.length
      ? syncedStats.recentMessages.slice(0, 3).map((message, index) => ({
          name:
            message.senderName ||
            tx("dashboard.recent.defaultClientName", `Client ${index + 1}`),
          subtitle: message.senderBusiness || "",
          text: message.text || "",
          badge: index === 0 ? 2 : index === 1 ? 1 : undefined,
        }))
      : [];

  const recentActivityItems = [
    ...recentAppointments.slice(0, 2).map((appt) => ({
      icon: <CalendarDays size={16} />,
      text: `${appt.clientName} • ${appt.serviceName}`,
      subtext: `${appt.date} ${appt.time || ""}`,
    })),
    ...(syncedStats.reviews || []).slice(0, 2).map((review) => ({
      icon: <Star size={16} />,
      text:
        review.comment ||
        tx("dashboard.recent.reviewReceived", "New review received"),
      subtext: review.createdAt || "",
    })),
  ];

  const revenueValue =
    syncedStats.revenue ??
    syncedStats.revenue_count ??
    syncedStats.orders_count ??
    0;

  return (
    <div
      dir={i18n.dir()}
      className="min-h-screen overflow-x-hidden bg-[#f5f6fb] text-slate-950"
    >
      <div className="mx-auto w-full max-w-[1720px] px-4 py-5 sm:px-6 lg:px-8">
        <main className="space-y-5 pb-12">
          {alertMessage && (
            <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800 shadow-sm">
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
                  setAlertMessage(
                    tx(
                      "dashboard.states.closeOfferError",
                      "Could not close the offer right now. Please try again."
                    )
                  );
                }
              }}
            />
          )}

          <WelcomeBanner
            title={tx(
              "dashboard.welcomeTitle",
              `Welcome back, ${user?.name || user?.businessName || "Olivia"}! 👋`
            )}
            subtitle={tx(
              "dashboard.welcomeSubtitle",
              "Here's what's happening with your business today."
            )}
            insightTitle={tx("dashboard.insightTitle", "Insight of the day")}
            insightText={tx(
              "dashboard.insightText",
              "You closed 24% more deals this month compared to last month. Keep it up!"
            )}
          />

          <div ref={cardsRef}>
            <Suspense
              fallback={
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600 shadow-sm">
                  {tx("dashboard.performance.loading", "Loading cards...")}
                </div>
              }
            >
              <DashboardCards
                stats={syncedStats}
                t={t}
                locale={locale}
                currency={currency}
              />
            </Suspense>
          </div>

          <div
            ref={appointmentsRef}
            className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)_minmax(320px,0.9fr)]"
          >
            <SectionShell
              title={tx(
                "dashboard.analytics.title",
                "Business Growth Overview"
              )}
              action={
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {tx("dashboard.thisMonth", "This Month")}
                </button>
              }
            >
              <div className="mb-4 grid gap-3 sm:grid-cols-4">
                <MiniStatCard
                  title={tx("dashboard.cards.revenue", "Revenue")}
                  value={formatMoney(revenueValue, locale, currency)}
                  tone="violet"
                />

                <MiniStatCard
                  title={tx("dashboard.cards.transactions", "Transactions")}
                  value={formatNumber(syncedStats.requests_count, locale)}
                  tone="green"
                />

                <MiniStatCard
                  title={tx("dashboard.cards.newClients", "New Clients")}
                  value={formatNumber(syncedStats.messages_count, locale)}
                  tone="pink"
                />

                <MiniStatCard
                  title={tx("dashboard.cards.conversionRate", "Conversion Rate")}
                  value={`${Math.min(
                    100,
                    safeNumber(syncedStats.orders_count) * 5
                  )}%`}
                  tone="violet"
                />
              </div>

              <div ref={chartsRef}>
                <Suspense
                  fallback={
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-600">
                      {tx("dashboard.analytics.loading", "Loading chart...")}
                    </div>
                  }
                >
                  <BarChartComponent
                    appointments={enrichedAppointments}
                    title={tx(
                      "dashboard.analytics.title",
                      "Clients who booked appointments by month"
                    )}
                  />
                </Suspense>
              </div>
            </SectionShell>

            <PipelineSection
              title={tx("dashboard.pipeline.title", "Sales Pipeline")}
              actionText={tx("dashboard.pipeline.allPipelines", "All Pipelines")}
              items={pipelineItems}
            />

            <Suspense
              fallback={
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600 shadow-sm">
                  {tx("dashboard.agenda.loading", "Loading agenda...")}
                </div>
              }
            >
              <DailyAgenda
                date={selectedDate}
                appointments={enrichedAppointments}
                businessName={
                  syncedStats.businessName ||
                  tx("dashboard.yourBusiness", "Your business")
                }
                businessId={businessId}
                t={t}
                locale={locale}
              />
            </Suspense>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <SectionShell
              title={tx("dashboard.calendar.title", "Appointment overview")}
            >
              <Suspense
                fallback={
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-600">
                    {tx("dashboard.calendar.loading", "Loading calendar...")}
                  </div>
                }
              >
                <CalendarView
                  appointments={enrichedAppointments}
                  onDateClick={setSelectedDate}
                  selectedDate={selectedDate}
                  t={t}
                  locale={locale}
                />
              </Suspense>
            </SectionShell>

            <SectionShell
              title={tx("dashboard.operations.title", "Activity pulse")}
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <MiniStatCard
                  title={tx(
                    "dashboard.operations.todayAppointments",
                    "Appointments today"
                  )}
                  value={todayAppointments}
                  tone="violet"
                />

                <MiniStatCard
                  title={tx("dashboard.operations.upcomingWeek", "Upcoming week")}
                  value={upcomingAppointments}
                  tone="green"
                />

                <MiniStatCard
                  title={tx(
                    "dashboard.operations.pendingAiApprovals",
                    "AI recommendations pending approval"
                  )}
                  value={recommendations.length}
                  tone="pink"
                />
              </div>
            </SectionShell>
          </div>

          {recommendations.length > 0 && (
            <SectionShell
              title={tx("dashboard.recommendations.title", "AI recommendations")}
              action={
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                  {recommendations.length}
                </span>
              }
            >
              <ul className="space-y-3">
                {recommendations.map(
                  ({ recommendationId, message, recommendation }) => (
                    <li
                      key={recommendationId}
                      className="rounded-[20px] border border-amber-200 bg-amber-50 p-4"
                    >
                      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div className="space-y-2">
                          <p className="text-sm leading-6 text-slate-700">
                            <span className="font-black text-slate-950">
                              {tx("dashboard.recommendations.client", "Client:")}
                            </span>{" "}
                            {message}
                          </p>

                          <p className="text-sm leading-6 text-amber-800">
                            <span className="font-black text-slate-950">
                              {tx(
                                "dashboard.recommendations.aiSuggestion",
                                "AI suggestion:"
                              )}
                            </span>{" "}
                            {recommendation}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-[0_14px_30px_rgba(109,40,217,0.22)] transition hover:-translate-y-0.5 hover:bg-violet-700"
                          onClick={() => {
                            if (!socketRef.current) {
                              setAlertMessage(
                                tx(
                                  "dashboard.states.socketNotConnected",
                                  "Real-time connection is not connected"
                                )
                              );
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
                                    `Error: ${
                                      res?.error ||
                                      tx(
                                        "dashboard.states.unknownError",
                                        "Unknown error"
                                      )
                                    }`
                                  );
                                }
                              }
                            );
                          }}
                        >
                          {tx(
                            "dashboard.recommendations.approveAndSend",
                            "Approve and send"
                          )}
                        </button>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </SectionShell>
          )}

          <div className="grid gap-5 xl:grid-cols-4">
            <RecentMessagesCard
              title={tx("dashboard.recentMessages.title", "Recent Messages")}
              actionText={tx("dashboard.actions.viewAll", "View all")}
              messages={recentMessages}
              emptyText={tx(
                "dashboard.recentMessages.empty",
                "No recent messages yet."
              )}
            />

            <SectionShell
              title={tx("dashboard.aiAssistant.title", "AI Assistant")}
              action={
                <button
                  type="button"
                  className="text-xs font-bold text-violet-600 hover:text-violet-800"
                >
                  {tx("dashboard.actions.viewAll", "View all")}
                </button>
              }
              className="h-full"
            >
              <AiInsightsPanel
                insights={insights}
                loading={insightsLoading}
                businessId={businessId}
              />
            </SectionShell>

            <RecentActivityCard
              title={tx("dashboard.recentActivity.title", "Recent Activity")}
              actionText={tx("dashboard.actions.viewAll", "View all")}
              items={recentActivityItems}
              emptyText={tx(
                "dashboard.recentActivity.empty",
                "No recent activity yet."
              )}
            />

            <CollaborationsCard
              title={tx(
                "dashboard.collaborations.title",
                "Collaborations & Proposals"
              )}
              actionText={tx("dashboard.actions.viewAll", "View all")}
              activeValue={formatNumber(
                syncedStats.collaborations_count || 0,
                locale
              )}
              activeLabel={tx(
                "dashboard.collaborations.active",
                "Active Collaborations"
              )}
              proposalsValue={formatNumber(
                syncedStats.proposals_count || 0,
                locale
              )}
              proposalsLabel={tx(
                "dashboard.collaborations.proposals",
                "Open Proposals"
              )}
              emptyText={tx(
                "dashboard.collaborations.empty",
                "Your collaboration and proposal activity will appear here."
              )}
            />
          </div>

          <SectionShell
            title={tx("dashboard.upcoming.title", "Next activity")}
            action={
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-800"
              >
                {tx("dashboard.upcoming.viewAll", "View all appointments")}
                <ArrowRight size={14} />
              </button>
            }
          >
            {recentAppointments.length === 0 ? (
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                {tx(
                  "dashboard.upcoming.empty",
                  "No upcoming appointments yet."
                )}
              </div>
            ) : (
              <div className="grid gap-3">
                {recentAppointments.map((appt, index) => (
                  <div
                    key={
                      appt._id ||
                      appt.id ||
                      `${appt.date}-${appt.time}-${index}`
                    }
                    className="grid gap-3 rounded-[20px] border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                        <CalendarDays size={20} />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-950">
                          {appt.clientName}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {appt.serviceName}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
                      {appt.date} {appt.time || ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionShell>

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