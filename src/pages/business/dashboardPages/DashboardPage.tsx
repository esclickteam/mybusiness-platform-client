"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Activity,
  ArrowRight,
  Bell,
  Calendar,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  DollarSign,
  Eye,
  LayoutDashboard,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  WalletCards,
  XCircle,
  Zap,
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

type LazyAnyComponent = PreloadableComponent<React.ComponentType<any>>;

const CalendarView = lazyWithPreload(() =>
  import("@/components/dashboard/CalendarView")
) as LazyAnyComponent;

const BarChartComponent = lazyWithPreload(() =>
  import("@/components/dashboard/BarChart")
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

function getInitials(name?: string): string {
  const clean = (name || "Business").trim();
  const parts = clean.split(/\s+/).filter(Boolean);

  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getReadableDate(locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());
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
    status: appt.status || "upcoming",
  };
}

function getUpcomingAppointmentsCount(appointments: Appointment[]): number {
  const now = new Date();
  const endOfWeek = new Date();

  endOfWeek.setDate(now.getDate() + 7);

  return appointments.filter((appt) => {
    const apptDate = new Date(`${appt.date}T${appt.time || "00:00"}`);
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

function getWeekDays(locale: string) {
  const today = new Date();
  const start = new Date(today);

  start.setDate(today.getDate() - today.getDay());

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    return {
      iso: date.toISOString().split("T")[0],
      day: new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date),
      dateNumber: date.getDate(),
      isToday: date.toISOString().split("T")[0] === getTodayIso(),
    };
  });
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
  CalendarView.preload();
  BarChartComponent.preload();
}

function LoadingShell({ text }: { text: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f4ff] px-5 py-10 text-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-center rounded-[36px] border border-white/80 bg-white/80 p-10 shadow-[0_30px_100px_rgba(109,40,217,0.14)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 animate-pulse rounded-full bg-violet-600" />
          <p className="text-sm font-black text-slate-700">{text}</p>
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
    <div className="min-h-screen bg-[#f7f4ff] px-5 py-10 text-slate-950">
      <div className="mx-auto max-w-3xl rounded-[36px] border border-red-100 bg-white p-8 text-center shadow-[0_25px_80px_rgba(127,29,29,0.10)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-red-50 text-2xl font-black text-red-600">
          !
        </div>
        <h1 className="text-2xl font-black">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-red-700">{message}</p>
      </div>
    </div>
  );
}

function GlassPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[32px] border border-white/80 bg-white/82 shadow-[0_22px_70px_rgba(88,28,135,0.09)] backdrop-blur-xl ${className}`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-fuchsia-200/30 blur-3xl" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

function SectionHeader({
  icon,
  title,
  action,
  subtitle,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 ring-8 ring-violet-50/40">
            {icon}
          </div>
        )}

        <div className="min-w-0">
          <h2 className="truncate text-base font-black tracking-tight text-slate-950 md:text-lg">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-xs font-semibold text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  delta,
  miniLabel,
  chart = "line",
  accent = "violet",
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  value: React.ReactNode;
  delta?: React.ReactNode;
  miniLabel?: React.ReactNode;
  chart?: "line" | "bars" | "stars";
  accent?: "violet" | "emerald" | "blue" | "amber" | "pink";
}) {
  const accentMap = {
    violet: {
      icon: "bg-violet-50 text-violet-700",
      glow: "from-violet-500/20",
      text: "text-violet-600",
      chip: "bg-violet-50 text-violet-700",
      bar: "bg-violet-400",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-700",
      glow: "from-emerald-500/20",
      text: "text-emerald-600",
      chip: "bg-emerald-50 text-emerald-700",
      bar: "bg-emerald-400",
    },
    blue: {
      icon: "bg-blue-50 text-blue-700",
      glow: "from-blue-500/20",
      text: "text-blue-600",
      chip: "bg-blue-50 text-blue-700",
      bar: "bg-blue-400",
    },
    amber: {
      icon: "bg-amber-50 text-amber-700",
      glow: "from-amber-500/20",
      text: "text-amber-600",
      chip: "bg-amber-50 text-amber-700",
      bar: "bg-amber-400",
    },
    pink: {
      icon: "bg-pink-50 text-pink-700",
      glow: "from-pink-500/20",
      text: "text-pink-600",
      chip: "bg-pink-50 text-pink-700",
      bar: "bg-pink-400",
    },
  };

  const tone = accentMap[accent];

  return (
    <div className="group relative min-h-[156px] overflow-hidden rounded-[28px] border border-white bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(109,40,217,0.13)]">
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${tone.glow} to-transparent blur-2xl`}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone.icon}`}>
          {icon}
        </div>

        {delta && (
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${tone.chip}`}>
            {delta}
          </span>
        )}
      </div>

      <div className="relative z-10 mt-5">
        <p className="text-xs font-bold text-slate-500">{title}</p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="text-3xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          {chart === "stars" ? (
            <div className="flex pb-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={15}
                  className="fill-current"
                />
              ))}
            </div>
          ) : chart === "bars" ? (
            <div className="flex h-10 items-end gap-1.5">
              {[18, 26, 17, 34, 25, 38, 30].map((height, index) => (
                <span
                  key={index}
                  className={`w-1.5 rounded-full ${tone.bar}/70`}
                  style={{ height }}
                />
              ))}
            </div>
          ) : (
            <svg width="92" height="42" viewBox="0 0 92 42" className="overflow-visible">
              <path
                d="M2 31 C14 24, 18 34, 29 20 C39 7, 47 22, 57 16 C67 10, 73 21, 90 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className={tone.text}
              />
              <path
                d="M2 31 C14 24, 18 34, 29 20 C39 7, 47 22, 57 16 C67 10, 73 21, 90 8 L90 42 L2 42 Z"
                className={`${tone.text} opacity-10`}
                fill="currentColor"
              />
            </svg>
          )}
        </div>

        {miniLabel && (
          <p className="mt-1 text-[11px] font-bold text-slate-400">
            {miniLabel}
          </p>
        )}
      </div>
    </div>
  );
}

function AppointmentOverview({
  total,
  averagePerDay,
  upcoming,
  completed,
  canceled,
}: {
  total: number;
  averagePerDay: number;
  upcoming: number;
  completed: number;
  canceled: number;
}) {
  const safeTotal = Math.max(total, 1);

  const rows = [
    {
      label: "Upcoming",
      value: upcoming,
      percent: Math.round((upcoming / safeTotal) * 100),
      icon: <Clock3 size={14} />,
      bar: "bg-violet-500",
    },
    {
      label: "Completed",
      value: completed,
      percent: Math.round((completed / safeTotal) * 100),
      icon: <CheckCircle2 size={14} />,
      bar: "bg-emerald-500",
    },
    {
      label: "Canceled",
      value: canceled,
      percent: Math.round((canceled / safeTotal) * 100),
      icon: <XCircle size={14} />,
      bar: "bg-rose-500",
    },
  ];

  return (
    <GlassPanel className="h-full p-5">
      <SectionHeader
        icon={<Activity size={18} />}
        title="Appointment overview"
        subtitle="This week performance"
        action={
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            This week
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[24px] border border-violet-100 bg-violet-50/70 p-4">
          <p className="text-xs font-black text-slate-500">Total appointments</p>
          <p className="mt-3 text-3xl font-black text-slate-950">{total}</p>
          <p className="mt-1 text-xs font-black text-emerald-600">+18% vs last 7 days</p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <p className="text-xs font-black text-slate-500">Appointments per day avg</p>
          <p className="mt-3 text-3xl font-black text-slate-950">{averagePerDay}</p>
          <p className="mt-1 text-xs font-black text-emerald-600">+8% vs last 7 days</p>
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-slate-100 bg-white p-4">
        <div className="mb-4 flex items-end gap-2">
          {[20, 54, 66, 30, 72, 44, 80].map((height, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-2">
              <div className="h-20 w-full rounded-full bg-slate-100">
                <div
                  className="mt-auto rounded-full bg-gradient-to-t from-violet-600 to-violet-300"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-slate-400">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index]}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-black text-slate-600">
                  {row.icon}
                  {row.label}
                </span>
                <span className="font-black text-slate-950">
                  {row.value} ({row.percent}%)
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${row.bar}`}
                  style={{ width: `${row.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}

function CalendarTimeline({
  appointments,
  selectedDate,
  onSelectDate,
  locale,
}: {
  appointments: Appointment[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  locale: string;
}) {
  const weekDays = useMemo(() => getWeekDays(locale), [locale]);

  const selectedAppointments = useMemo(
    () =>
      appointments
        .filter((appt) => appt.date === selectedDate)
        .sort((a, b) => (a.time || "").localeCompare(b.time || "")),
    [appointments, selectedDate]
  );

  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  return (
    <GlassPanel className="p-5 xl:col-span-2">
      <SectionHeader
        icon={<CalendarDays size={18} />}
        title="Calendar"
        subtitle="Smart schedule overview"
        action={
          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 shadow-sm transition hover:bg-slate-50">
              Day
            </button>
            <button className="rounded-xl bg-violet-600 px-3 py-2 text-xs font-black text-white shadow-[0_12px_28px_rgba(124,58,237,0.25)]">
              Week
            </button>
            <button className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 shadow-sm transition hover:bg-slate-50 sm:block">
              Month
            </button>
            <button className="rounded-xl bg-violet-600 px-3 py-2 text-xs font-black text-white shadow-[0_12px_28px_rgba(124,58,237,0.25)]">
              + New Appointment
            </button>
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const count = appointments.filter((appt) => appt.date === day.iso).length;
          const active = selectedDate === day.iso;

          return (
            <button
              key={day.iso}
              type="button"
              onClick={() => onSelectDate(day.iso)}
              className={`rounded-2xl border px-2 py-3 text-center transition ${
                active
                  ? "border-violet-200 bg-violet-600 text-white shadow-[0_14px_32px_rgba(124,58,237,0.26)]"
                  : "border-slate-100 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50"
              }`}
            >
              <p className="text-[10px] font-black uppercase opacity-80">{day.day}</p>
              <p className="mt-1 text-lg font-black">{day.dateNumber}</p>
              {count > 0 && (
                <span
                  className={`mx-auto mt-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black ${
                    active ? "bg-white/20 text-white" : "bg-violet-100 text-violet-700"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[90px_minmax(0,1fr)]">
        <div className="hidden space-y-3 xl:block">
          {hours.map((hour) => (
            <div key={hour} className="h-14 text-xs font-black text-slate-400">
              {hour}
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-slate-100 bg-gradient-to-br from-white to-violet-50/30 p-4">
          <div className="pointer-events-none absolute left-0 right-0 top-[40%] h-px bg-rose-400/50" />

          {selectedAppointments.length === 0 ? (
            <div className="flex min-h-[330px] items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-white/70 text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-violet-50 text-violet-700">
                  <Calendar size={24} />
                </div>
                <p className="mt-3 text-sm font-black text-slate-700">
                  No appointments for this day
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Choose another date or create a new appointment.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid min-h-[330px] gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {selectedAppointments.map((appt, index) => (
                <div
                  key={appt._id || appt.id || `${appt.date}-${appt.time}-${index}`}
                  className="group flex min-h-[112px] flex-col justify-between rounded-[24px] border border-violet-100 bg-white p-4 shadow-[0_18px_45px_rgba(88,28,135,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(88,28,135,0.13)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-950">
                        {appt.clientName}
                      </p>
                      <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                        {appt.serviceName}
                      </p>
                    </div>

                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black text-violet-700">
                      {appt.status || "Upcoming"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-black text-slate-500">
                      <Clock3 size={14} />
                      {appt.time || "No time"}
                    </span>

                    <button
                      type="button"
                      className="rounded-xl bg-slate-50 p-2 text-slate-500 transition hover:bg-violet-50 hover:text-violet-700"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </GlassPanel>
  );
}

function UpcomingAppointmentsPanel({
  appointments,
  locale,
}: {
  appointments: Appointment[];
  locale: string;
}) {
  const upcoming = getLastAppointments(appointments, 6);

  return (
    <GlassPanel className="h-full p-5">
      <SectionHeader
        icon={<CalendarCheck2 size={18} />}
        title="Upcoming Appointments"
        subtitle="Next booked meetings"
        action={
          <button className="text-xs font-black text-violet-600 transition hover:text-violet-800">
            View all
          </button>
        }
      />

      {upcoming.length === 0 ? (
        <div className="flex min-h-[250px] items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-white/70 text-center">
          <div>
            <CalendarDays className="mx-auto text-slate-300" size={34} />
            <p className="mt-3 text-sm font-black text-slate-700">
              No upcoming appointments yet
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((appt, index) => (
            <div
              key={appt._id || appt.id || `${appt.date}-${appt.time}-${index}`}
              className="flex items-center gap-3 rounded-[24px] border border-slate-100 bg-white p-3 shadow-[0_14px_35px_rgba(15,23,42,0.045)] transition hover:-translate-y-0.5 hover:border-violet-200"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700">
                {getInitials(appt.clientName)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-slate-950">
                  {appt.clientName}
                </p>
                <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                  {appt.serviceName}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xs font-black text-slate-950">{appt.time || ""}</p>
                <p className="mt-1 text-[10px] font-bold text-slate-400">
                  {new Intl.DateTimeFormat(locale, {
                    month: "short",
                    day: "numeric",
                  }).format(new Date(appt.date))}
                </p>
              </div>

              <span className="hidden rounded-full bg-violet-50 px-2 py-1 text-[10px] font-black text-violet-700 sm:inline-flex">
                Upcoming
              </span>
            </div>
          ))}
        </div>
      )}
    </GlassPanel>
  );
}

function RecentActivityPanel({
  appointments,
  reviews,
}: {
  appointments: Appointment[];
  reviews: AnyRecord[];
}) {
  const items = [
    ...appointments.slice(0, 2).map((appt) => ({
      icon: <CalendarDays size={15} />,
      title: "New appointment booked",
      body: `${appt.clientName} — ${appt.serviceName}`,
      time: appt.time || "Now",
      tone: "bg-violet-50 text-violet-700",
    })),
    ...reviews.slice(0, 2).map((review) => ({
      icon: <Star size={15} />,
      title: "New 5-star review",
      body: review.comment || "Client left a review",
      time: "1h ago",
      tone: "bg-pink-50 text-pink-700",
    })),
  ];

  return (
    <GlassPanel className="h-full p-5">
      <SectionHeader
        icon={<Zap size={18} />}
        title="Recent Activity"
        subtitle="Live business pulse"
        action={
          <button className="text-xs font-black text-violet-600 transition hover:text-violet-800">
            View all
          </button>
        }
      />

      {items.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 p-6 text-sm font-bold text-slate-500">
          No recent activity yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-3 rounded-[22px] bg-white/75 p-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${item.tone}`}>
                {item.icon}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-950">{item.title}</p>
                <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                  {item.body}
                </p>
              </div>

              <span className="shrink-0 text-[10px] font-black text-slate-400">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      )}
    </GlassPanel>
  );
}

function AiRecommendationPanel({
  recommendations,
  onApprove,
}: {
  recommendations: RecommendationItem[];
  onApprove: (recommendationId: string) => void;
}) {
  if (recommendations.length === 0) return null;

  return (
    <GlassPanel className="p-5">
      <SectionHeader
        icon={<Sparkles size={18} />}
        title="AI recommendations"
        subtitle="Approve smart actions before sending"
        action={
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
            {recommendations.length} pending
          </span>
        }
      />

      <div className="space-y-3">
        {recommendations.map(({ recommendationId, message, recommendation }) => (
          <div
            key={recommendationId}
            className="grid gap-4 rounded-[26px] border border-amber-100 bg-amber-50/70 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
          >
            <div className="space-y-2">
              <p className="text-sm leading-6 text-slate-700">
                <span className="font-black text-slate-950">Client:</span> {message}
              </p>
              <p className="text-sm leading-6 text-amber-800">
                <span className="font-black text-slate-950">AI suggestion:</span>{" "}
                {recommendation}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onApprove(recommendationId)}
              className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-[0_14px_30px_rgba(109,40,217,0.22)] transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              Approve and send
            </button>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function MobileSidebarHint() {
  return (
    <div className="mb-4 flex items-center justify-between rounded-[26px] border border-white/80 bg-white/80 p-3 shadow-[0_14px_40px_rgba(88,28,135,0.08)] backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white">
          <Sparkles size={18} />
        </div>

        <div>
          <p className="text-sm font-black text-slate-950">GlowPro</p>
          <p className="text-xs font-semibold text-slate-400">Dashboard</p>
        </div>
      </div>

      <button className="rounded-2xl bg-violet-50 p-3 text-violet-700">
        <LayoutDashboard size={18} />
      </button>
    </div>
  );
}

function Sidebar() {
  const nav = [
    { icon: <LayoutDashboard size={17} />, label: "Dashboard", active: true },
    { icon: <CalendarCheck2 size={17} />, label: "Appointments" },
    { icon: <Calendar size={17} />, label: "Calendar" },
    { icon: <Users size={17} />, label: "Clients" },
    { icon: <WalletCards size={17} />, label: "Services" },
    { icon: <MessageCircle size={17} />, label: "Messages", badge: "2" },
    { icon: <Star size={17} />, label: "Reviews" },
    { icon: <DollarSign size={17} />, label: "Finance" },
    { icon: <TrendingUp size={17} />, label: "Marketing" },
  ];

  return (
    <aside className="sticky top-4 hidden h-[calc(100vh-32px)] overflow-hidden rounded-[34px] border border-white/90 bg-white/86 p-4 shadow-[0_24px_80px_rgba(88,28,135,0.11)] backdrop-blur-2xl lg:block">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-[22px] bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-[0_16px_35px_rgba(124,58,237,0.28)]">
          <Sparkles size={22} />
        </div>

        <div>
          <p className="text-lg font-black tracking-tight text-slate-950">
            GlowPro
          </p>
          <p className="text-xs font-bold text-slate-400">Business OS</p>
        </div>
      </div>

      <nav className="space-y-1.5">
        {nav.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-black transition ${
              item.active
                ? "bg-violet-600 text-white shadow-[0_15px_35px_rgba(124,58,237,0.28)]"
                : "text-slate-500 hover:bg-violet-50 hover:text-violet-700"
            }`}
          >
            <span className="flex items-center gap-3">
              {item.icon}
              {item.label}
            </span>

            {item.badge && (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-black text-violet-700">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4 text-center">
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-300/40 blur-2xl" />
        <div className="relative z-10">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
            <Sparkles size={20} />
          </div>
          <p className="text-sm font-black text-slate-950">Upgrade to Pro</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
            Unlock advanced features and grow faster.
          </p>
          <button className="mt-4 w-full rounded-2xl bg-violet-600 py-3 text-xs font-black text-white shadow-[0_14px_32px_rgba(124,58,237,0.25)]">
            Upgrade now
          </button>
        </div>
      </div>
    </aside>
  );
}

function Header({
  user,
  locale,
}: {
  user: AuthUser | null;
  locale: string;
}) {
  const displayName = user?.name || user?.businessName || "Bdika";

  return (
    <header className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-xs font-black text-violet-700 shadow-sm backdrop-blur-xl">
          <Sparkles size={14} />
          {getReadableDate(locale)}
        </div>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
          {getGreeting()}, {displayName}! <span className="inline-block">👋</span>
        </h1>

        <p className="mt-1 text-sm font-semibold text-slate-500">
          Here’s what’s happening with your business today.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-white bg-white/85 text-slate-500 shadow-sm backdrop-blur-xl transition hover:text-violet-700 md:flex"
        >
          <Search size={18} />
        </button>

        <button
          type="button"
          className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white bg-white/85 text-slate-500 shadow-sm backdrop-blur-xl transition hover:text-violet-700"
        >
          <Bell size={18} />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-violet-600 ring-2 ring-white" />
        </button>

        <button
          type="button"
          className="flex items-center gap-3 rounded-[22px] border border-white bg-white/85 px-3 py-2 shadow-sm backdrop-blur-xl"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-black text-white">
            {getInitials(displayName)}
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-black text-slate-950">{displayName}</p>
            <p className="text-[11px] font-bold text-slate-400">Business owner</p>
          </div>

          <ChevronDown size={16} className="text-slate-400" />
        </button>
      </div>
    </header>
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
      setError(
        tx("dashboard.states.loadErrorMessage", "Error loading data from server.")
      );

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
      setAlertMessage(
        tx("dashboard.states.somethingWrong", "Something went wrong. Please try again.")
      );
    }
  };

  const handleApproveRecommendation = useCallback(
    (recommendationId: string) => {
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
              prev.filter((item) => item.recommendationId !== recommendationId)
            );
          } else {
            setAlertMessage(
              `Error: ${
                res?.error ||
                tx("dashboard.states.unknownError", "Unknown error")
              }`
            );
          }
        }
      );
    },
    [tx]
  );

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

  const locale = getLocale(i18n.language);
  const currency = getCurrency(i18n.language);

  const totalAppointments =
    safeNumber(syncedStats.appointments_count) || enrichedAppointments.length;

  const todayAppointments = getTodayAppointmentsCount(enrichedAppointments);
  const upcomingAppointments = getUpcomingAppointmentsCount(
    enrichedAppointments
  );

  const completedAppointments = enrichedAppointments.filter(
    (appt) => appt.status === "completed"
  ).length;

  const canceledAppointments = enrichedAppointments.filter(
    (appt) => appt.status === "canceled" || appt.status === "cancelled"
  ).length;

  const averagePerDay = Math.max(1, Math.round(totalAppointments / 7));

  const revenueValue =
    syncedStats.revenue ??
    syncedStats.revenue_count ??
    syncedStats.orders_count ??
    0;

  const newClientsValue =
    syncedStats.newClients ??
    syncedStats.clients_count ??
    syncedStats.messages_count ??
    0;

  const ratingValue =
    syncedStats.average_rating ??
    syncedStats.rating ??
    (syncedStats.reviews_count ? 4.9 : 0);

  return (
    <div
      dir={i18n.dir()}
      className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,#f1e8ff_0,#f8f6ff_34%,#f6f7fb_68%,#ffffff_100%)] text-slate-950"
    >
      <div className="mx-auto grid w-full max-w-[1800px] gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <Sidebar />

        <main className="min-w-0 pb-10">
          <MobileSidebarHint />

          {alertMessage && (
            <div className="mb-4 rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm font-black text-amber-800 shadow-sm">
              {alertMessage}
            </div>
          )}

          {shouldShowEarlyBirdModal && (
            <div className="mb-4">
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
            </div>
          )}

          <Header user={user} locale={locale} />

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              icon={<CalendarDays size={21} />}
              title="Appointments"
              value={formatNumber(totalAppointments, locale)}
              delta="+18%"
              miniLabel="vs last 7 days"
              chart="line"
              accent="violet"
            />

            <MetricCard
              icon={<DollarSign size={21} />}
              title="Revenue"
              value={formatMoney(revenueValue, locale, currency)}
              delta="+24%"
              miniLabel="vs last 7 days"
              chart="line"
              accent="emerald"
            />

            <MetricCard
              icon={<Users size={21} />}
              title="New Clients"
              value={formatNumber(newClientsValue, locale)}
              delta="+12%"
              miniLabel="vs last 7 days"
              chart="line"
              accent="blue"
            />

            <MetricCard
              icon={<Star size={21} />}
              title="Reviews"
              value={ratingValue}
              delta="+0.3"
              miniLabel="vs last 7 days"
              chart="stars"
              accent="amber"
            />

            <MetricCard
              icon={<Eye size={21} />}
              title="Views"
              value={formatNumber(syncedStats.views_count, locale)}
              delta="+35%"
              miniLabel="vs last 7 days"
              chart="line"
              accent="pink"
            />
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(320px,0.78fr)_minmax(0,1.72fr)]">
            <AppointmentOverview
              total={totalAppointments}
              averagePerDay={averagePerDay}
              upcoming={upcomingAppointments}
              completed={completedAppointments}
              canceled={canceledAppointments}
            />

            <CalendarTimeline
              appointments={enrichedAppointments}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              locale={locale}
            />
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
            <GlassPanel className="min-h-[430px] p-5">
              <SectionHeader
                icon={<TrendingUp size={18} />}
                title="Clients who booked appointments by month"
                subtitle="Monthly booking growth"
                action={
                  <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 shadow-sm hover:bg-slate-50">
                    This Month
                  </button>
                }
              />

              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-violet-100 bg-violet-50/70 p-4">
                  <p className="text-xs font-black text-slate-500">Today</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {todayAppointments}
                  </p>
                </div>

                <div className="rounded-[22px] border border-emerald-100 bg-emerald-50/70 p-4">
                  <p className="text-xs font-black text-slate-500">Upcoming week</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {upcomingAppointments}
                  </p>
                </div>

                <div className="rounded-[22px] border border-pink-100 bg-pink-50/70 p-4">
                  <p className="text-xs font-black text-slate-500">AI pending</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {recommendations.length}
                  </p>
                </div>
              </div>

              <div className="min-h-[310px]">
                <Suspense
                  fallback={
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 text-sm font-black text-slate-600">
                      Loading chart...
                    </div>
                  }
                >
                  <BarChartComponent
                    appointments={enrichedAppointments}
                    title="Clients who booked appointments by month"
                  />
                </Suspense>
              </div>
            </GlassPanel>

            <UpcomingAppointmentsPanel
              appointments={enrichedAppointments}
              locale={locale}
            />
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <RecentActivityPanel
              appointments={getLastAppointments(enrichedAppointments, 4)}
              reviews={syncedStats.reviews || []}
            />

            <GlassPanel className="p-5">
              <SectionHeader
                icon={<Calendar size={18} />}
                title="Appointment calendar"
                subtitle="Monthly view"
                action={
                  <button className="rounded-xl bg-violet-600 px-3 py-2 text-xs font-black text-white shadow-[0_12px_28px_rgba(124,58,237,0.25)]">
                    <Plus size={14} className="mr-1 inline-block" />
                    New
                  </button>
                }
              />

              <Suspense
                fallback={
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 text-sm font-black text-slate-600">
                    Loading calendar...
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
            </GlassPanel>
          </section>

          <section className="mt-5">
            <AiRecommendationPanel
              recommendations={recommendations}
              onApprove={handleApproveRecommendation}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
