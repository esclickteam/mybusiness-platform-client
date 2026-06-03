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
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  Star,
  XCircle,
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

function getTodayIso(): string {
  return new Date().toLocaleDateString("en-CA");
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
    const apptDate = new Date(`${appt.date}T${appt.time || "12:00"}`);
    return apptDate >= now && apptDate <= endOfWeek;
  }).length;
}

function getTodayAppointmentsCount(appointments: Appointment[]): number {
  const today = getTodayIso();
  return appointments.filter((appt) => appt.date === today).length;
}

function getUpcomingAppointments(appointments: Appointment[], limit = 5) {
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

function getAppointmentsByStatus(appointments: Appointment[]) {
  const total = appointments.length;
  const completed = appointments.filter((appt) =>
    ["completed", "done", "finished"].includes(String(appt.status || "").toLowerCase())
  ).length;
  const cancelled = appointments.filter((appt) =>
    ["cancelled", "canceled", "declined"].includes(String(appt.status || "").toLowerCase())
  ).length;
  const upcoming = Math.max(total - completed - cancelled, 0);

  return { total, completed, cancelled, upcoming };
}

function getAppointmentsPerDay(appointments: Appointment[]) {
  if (!appointments.length) return 0;

  const uniqueDays = new Set(appointments.map((appt) => appt.date).filter(Boolean));
  return uniqueDays.size ? appointments.length / uniqueDays.size : 0;
}

function getPeakDay(appointments: Appointment[], locale: string) {
  const counts: Record<string, number> = {};

  appointments.forEach((appt) => {
    if (!appt.date) return;
    counts[appt.date] = (counts[appt.date] || 0) + 1;
  });

  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  if (!best) {
    return { label: "-", count: 0 };
  }

  const date = new Date(`${best[0]}T12:00:00`);
  const label = Number.isNaN(date.getTime())
    ? best[0]
    : new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);

  return { label, count: best[1] };
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
  CalendarView.preload();
  DailyAgenda.preload();
  DashboardNav.preload();
}

function LoadingShell({ text }: { text: React.ReactNode }) {
  return (
    <div className="min-h-[70vh] bg-[#f6f7fb] px-5 py-10 text-slate-950">
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
    <div className="min-h-[70vh] bg-[#f6f7fb] px-5 py-10 text-slate-950">
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

function DashboardHeader({
  title,
  subtitle,
  onNewAppointment,
}: {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  onNewAppointment: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500 sm:text-base">
          {subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={onNewAppointment}
        className="inline-flex w-fit items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-[0_16px_34px_rgba(124,58,237,0.24)] transition hover:-translate-y-0.5 hover:bg-violet-700"
      >
        <Plus size={17} />
        New Appointment
      </button>
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
      className={`rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)] ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-black tracking-tight text-slate-950 sm:text-lg">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function AppointmentOverviewPanel({
  appointments,
  locale,
  title,
}: {
  appointments: Appointment[];
  locale: string;
  title: React.ReactNode;
}) {
  const status = getAppointmentsByStatus(appointments);
  const appointmentsPerDay = getAppointmentsPerDay(appointments);
  const peakDay = getPeakDay(appointments, locale);

  const maxValue = Math.max(status.upcoming, status.completed, status.cancelled, 1);

  const trendData = useMemo(() => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      const iso = date.toLocaleDateString("en-CA");
      const count = appointments.filter((appt) => appt.date === iso).length;
      return {
        label: new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date),
        count,
      };
    });
  }, [appointments, locale]);

  const maxTrend = Math.max(...trendData.map((item) => item.count), 1);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)]">
      <div className="pointer-events-none absolute -left-20 -top-20 h-44 w-44 rounded-full bg-violet-100/80 blur-3xl" />

      <div className="relative z-10 mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">{title}</h2>
          <p className="mt-1 text-xs font-bold text-slate-500">This week</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 shadow-sm">
          This week
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-4 border-b border-slate-100 pb-5">
        <div>
          <p className="text-4xl font-black tracking-tight text-slate-950">
            {formatNumber(status.total, locale)}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-500">Total appointments</p>
          <p className="mt-1 text-xs font-black text-emerald-600">↑ 18% vs last 7 days</p>
        </div>

        <div className="border-l border-slate-100 pl-4">
          <p className="text-4xl font-black tracking-tight text-slate-950">
            {appointmentsPerDay.toFixed(1)}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-500">Appointments per day</p>
          <p className="mt-1 text-xs font-black text-emerald-600">↑ 18% vs last 7 days</p>
        </div>
      </div>

      <div className="relative z-10 mt-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-black text-slate-950">Appointments trend</p>
          <span className="text-xs font-bold text-violet-600">View all</span>
        </div>

        <div className="flex h-36 items-end gap-3 rounded-3xl border border-slate-100 bg-slate-50/60 px-4 py-4">
          {trendData.map((item) => (
            <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex h-24 w-full items-end justify-center">
                <div
                  className="w-full max-w-8 rounded-t-xl bg-gradient-to-t from-violet-600 to-violet-300 shadow-[0_10px_20px_rgba(124,58,237,0.18)]"
                  style={{ height: `${Math.max(10, (item.count / maxTrend) * 100)}%` }}
                />
              </div>
              <span className="truncate text-[10px] font-black text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-5 space-y-3">
        <StatusRow
          icon={<Clock3 size={15} />}
          label="Upcoming"
          value={status.upcoming}
          total={status.total}
          maxValue={maxValue}
          barClassName="bg-violet-500"
        />
        <StatusRow
          icon={<CheckCircle2 size={15} />}
          label="Completed"
          value={status.completed}
          total={status.total}
          maxValue={maxValue}
          barClassName="bg-emerald-500"
        />
        <StatusRow
          icon={<XCircle size={15} />}
          label="Canceled"
          value={status.cancelled}
          total={status.total}
          maxValue={maxValue}
          barClassName="bg-pink-500"
        />
      </div>

      <div className="relative z-10 mt-5 flex items-center justify-between rounded-2xl bg-violet-50 px-4 py-3 text-sm font-black text-violet-700 ring-1 ring-violet-100">
        <span className="inline-flex items-center gap-2">
          <CalendarDays size={16} />
          Peak day: {peakDay.label}
        </span>
        <span>{peakDay.count} appointments</span>
      </div>
    </section>
  );
}

function StatusRow({
  icon,
  label,
  value,
  total,
  maxValue,
  barClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  total: number;
  maxValue: number;
  barClassName: string;
}) {
  const percent = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="grid grid-cols-[115px_minmax(0,1fr)_70px] items-center gap-3 text-xs font-bold text-slate-600">
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${barClassName}`}
          style={{ width: `${Math.max(6, (value / maxValue) * 100)}%` }}
        />
      </div>
      <div className="text-right text-slate-700">
        {value} ({percent}%)
      </div>
    </div>
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
        <button type="button" className="text-xs font-black text-violet-600 hover:text-violet-800">
          {actionText}
        </button>
      }
      className="min-h-[260px]"
    >
      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-900">{item.text}</p>
                {item.subtext && (
                  <p className="mt-1 truncate text-xs font-semibold text-slate-500">{item.subtext}</p>
                )}
              </div>
              <span className="text-xs font-bold text-slate-400">{index + 1}h ago</span>
            </div>
          ))}
        </div>
      )}
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

      if (typeof translated !== "string") return fallback;
      if (translated === key) return fallback;
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
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshingUser, setIsRefreshingUser] = useState<boolean>(false);

  const shouldShowEarlyBirdModal =
    user?.isEarlyBirdActive &&
    user?.paymentStatus === "trial" &&
    !user?.earlyBirdModalSeenAt &&
    !isRefreshingUser;

  const openAppointments = useCallback(() => {
    if (!businessId) return;
    navigate(`/business/${businessId}/dashboard/crm/appointments`);
  }, [businessId, navigate]);

  useEffect(() => {
    document.body.setAttribute("data-theme", "business");
    return () => document.body.removeAttribute("data-theme");
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
            navigate(`/business/${updatedUser.businessId}/dashboard`, { replace: true });
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
          tx(
            "dashboard.states.subscriptionPending",
            "Your subscription has not been activated yet. Try again in a few minutes."
          )
        );
        window.history.replaceState({}, document.title, location.pathname);
      } catch {
        setIsRefreshingUser(false);
        setAlertMessage(
          tx(
            "dashboard.states.subscriptionCheckError",
            "Error checking subscription status."
          )
        );
        window.history.replaceState({}, document.title, location.pathname);
      }
    };

    poll();
  }, [location.search, location.pathname, navigate, refreshAccessToken, refreshUser, setUser, tx]);

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
      if (err?.message === "No token") logout();
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

      const sock = (await createSocket(refreshAccessToken, logout, businessId)) as SocketLike | null;
      if (!sock || !isMounted) return;

      socketRef.current = sock;
      reconnectAttempts.current = 0;

      sock.on("connect", () => {
        sock.emit("joinBusinessRoom", businessId);
        sock.emit("subscribeToBusinessUpdates", businessId);
      });

      sock.on("disconnect", () => {
        if (isMounted && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
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

        sock.auth = { ...(sock.auth || {}), token: newToken };
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
          const data = typeof payload === "string" ? JSON.parse(payload) : payload;
          if (!data?.type) return;

          const { type, data: eventData } = data;

          switch (type) {
            case "dashboardUpdate":
              debouncedSetStats(eventData);
              break;

            case "profileViewsUpdated":
              setStats((currentStats) => {
                if (!currentStats) return currentStats;
                if (!eventData?.views_count || safeNumber(currentStats.views_count) >= safeNumber(eventData.views_count)) {
                  return currentStats;
                }
                return { ...currentStats, views_count: eventData.views_count };
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
                const exists = currentStats.reviews?.some((review) => review._id === eventData._id);
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
                      notifications_count: eventData.count || currentStats.notifications_count || 0,
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
          const exists = currentStats.reviews?.some((review) => review._id === reviewData._id);
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
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
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
      if (conversationId) socketRef.current.emit("markMessagesRead", conversationId);
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

      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) {
      console.error("Early Bird checkout error:", err);
      setAlertMessage(tx("dashboard.states.somethingWrong", "Something went wrong. Please try again."));
    }
  };

  if (!initialized) {
    return <LoadingShell text={tx("dashboard.states.loading", "Loading business dashboard...")} />;
  }

  const isAdmin = user?.role === "admin";
  const isBusinessOwner = user?.role === "business" && user?.businessId === businessId;

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

  if (loading && !stats) return <DashboardSkeleton />;

  if (error) {
    return (
      <ErrorShell
        title={tx("dashboard.states.loadErrorTitle", "Could not load dashboard")}
        message={alertMessage || error}
      />
    );
  }

  if (isRefreshingUser) {
    return <LoadingShell text={tx("dashboard.states.refreshingUser", "Refreshing user data...")} />;
  }

  const effectiveStats = stats || {};
  const enrichedAppointments = (effectiveStats.appointments || []).map((appt) =>
    enrichAppointment(appt, effectiveStats)
  );

  const syncedStats: DashboardStats = {
    ...effectiveStats,
    appointments_count: enrichedAppointments.length,
    messages_count: safeNumber(effectiveStats.messages_count),
  };

  const navRefs: DashboardNavRefs = { cardsRef, chartsRef, appointmentsRef };
  const locale = getLocale(i18n.language);
  const currency = getCurrency(i18n.language);
  const businessDisplayName = syncedStats.businessName || user?.businessName || "Your business";

  const todayAppointments = getTodayAppointmentsCount(enrichedAppointments);
  const upcomingAppointments = getUpcomingAppointmentsCount(enrichedAppointments);
  const recentAppointments = getUpcomingAppointments(enrichedAppointments, 5);

  const recentActivityItems = [
    ...recentAppointments.slice(0, 2).map((appt) => ({
      icon: <CalendarDays size={17} />,
      text: `${appt.clientName} • ${appt.serviceName}`,
      subtext: `${appt.date} ${appt.time || ""}`,
    })),
    ...(syncedStats.reviews || []).slice(0, 2).map((review) => ({
      icon: <Star size={17} />,
      text: review.comment || tx("dashboard.recent.reviewReceived", "New review received"),
      subtext: review.createdAt || "",
    })),
  ];

  return (
    <div dir={i18n.dir()} className="min-h-screen overflow-x-hidden bg-[#f6f7fb] text-slate-950">
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

          <DashboardHeader
            title={tx(
              "dashboard.welcomeTitle",
              `Good morning, ${user?.name || user?.businessName || "Bdikaa"}! 👋`
            )}
            subtitle={tx(
              "dashboard.welcomeSubtitle",
              "Here’s what’s happening with your business today."
            )}
            onNewAppointment={openAppointments}
          />

          <div ref={cardsRef}>
            <Suspense
              fallback={
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600 shadow-sm">
                  {tx("dashboard.performance.loading", "Loading cards...")}
                </div>
              }
            >
              <DashboardCards stats={syncedStats} t={t} locale={locale} currency={currency} />
            </Suspense>
          </div>

          <div
            ref={appointmentsRef}
            className="grid gap-5 xl:grid-cols-[minmax(320px,0.55fr)_minmax(0,1.45fr)] xl:items-stretch"
          >
            <AppointmentOverviewPanel
              appointments={enrichedAppointments}
              locale={locale}
              title={tx("dashboard.calendar.title", "Appointment overview")}
            />

            <div ref={chartsRef}>
              <Suspense
                fallback={
                  <div className="min-h-[520px] rounded-[28px] border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600 shadow-sm">
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
                  onNewAppointment={openAppointments}
                />
              </Suspense>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <RecentActivityCard
              title={tx("dashboard.recentActivity.title", "Recent Activity")}
              actionText={tx("dashboard.actions.viewAll", "View all")}
              items={recentActivityItems}
              emptyText={tx("dashboard.recentActivity.empty", "No recent activity yet.")}
            />

            <Suspense
              fallback={
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600 shadow-sm">
                  {tx("dashboard.agenda.loading", "Loading agenda...")}
                </div>
              }
            >
              <DailyAgenda
                date={selectedDate}
                appointments={enrichedAppointments}
                businessName={businessDisplayName}
                businessId={businessId}
                t={t}
                locale={locale}
              />
            </Suspense>
          </div>

          <SectionShell title={tx("dashboard.operations.title", "Activity pulse")}>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-violet-100 bg-violet-50 p-5">
                <p className="text-xs font-black text-slate-500">
                  {tx("dashboard.operations.todayAppointments", "Appointments today")}
                </p>
                <p className="mt-2 text-3xl font-black text-slate-950">{todayAppointments}</p>
              </div>

              <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 p-5">
                <p className="text-xs font-black text-slate-500">
                  {tx("dashboard.operations.upcomingWeek", "Upcoming week")}
                </p>
                <p className="mt-2 text-3xl font-black text-slate-950">{upcomingAppointments}</p>
              </div>

              <div className="rounded-[24px] border border-pink-100 bg-pink-50 p-5">
                <p className="text-xs font-black text-slate-500">
                  {tx("dashboard.operations.pendingAiApprovals", "AI recommendations pending approval")}
                </p>
                <p className="mt-2 text-3xl font-black text-slate-950">{recommendations.length}</p>
              </div>
            </div>
          </SectionShell>

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
                {recommendations.map(({ recommendationId, message, recommendation }) => (
                  <li key={recommendationId} className="rounded-[20px] border border-amber-200 bg-amber-50 p-4">
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
                            {tx("dashboard.recommendations.aiSuggestion", "AI suggestion:")}
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
                              tx("dashboard.states.socketNotConnected", "Real-time connection is not connected")
                            );
                            return;
                          }

                          socketRef.current.emit("approveRecommendation", { recommendationId }, (res: any) => {
                            if (res?.ok) {
                              setRecommendations((prev) =>
                                prev.filter((item) => item.recommendationId !== recommendationId)
                              );
                            } else {
                              setAlertMessage(
                                `Error: ${res?.error || tx("dashboard.states.unknownError", "Unknown error")}`
                              );
                            }
                          });
                        }}
                      >
                        {tx("dashboard.recommendations.approveAndSend", "Approve and send")}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </SectionShell>
          )}

          <SectionShell
            title={tx("dashboard.upcoming.title", "Next activity")}
            action={
              <button
                type="button"
                onClick={openAppointments}
                className="inline-flex items-center gap-1 text-xs font-black text-violet-600 hover:text-violet-800"
              >
                {tx("dashboard.upcoming.viewAll", "View all appointments")}
                <ArrowRight size={14} />
              </button>
            }
            className="xl:max-w-[760px]"
          >
            {recentAppointments.length === 0 ? (
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                {tx("dashboard.upcoming.empty", "No upcoming appointments yet.")}
              </div>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((appt, index) => (
                  <div
                    key={appt._id || appt.id || `${appt.date}-${appt.time}-${index}`}
                    className="group rounded-[24px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_18px_45px_rgba(109,40,217,0.10)]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 ring-8 ring-violet-50">
                          <CalendarDays size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-950">{appt.clientName}</p>
                          <p className="mt-1 truncate text-sm font-medium text-slate-500">{appt.serviceName}</p>
                        </div>
                      </div>

                      <div className="shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
                        <p className="text-xs font-bold text-slate-400">{appt.date}</p>
                        <p className="mt-1 text-sm font-black text-slate-800">{appt.time || ""}</p>
                      </div>
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
