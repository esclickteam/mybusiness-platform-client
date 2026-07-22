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
  Bell,
  Calendar,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Clock,
  ChevronDown,
  Eye,
  Plus,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
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
import BizuplyLoader from "@/components/ui/BizuplyLoader";
import UpgradeOfferCard from "@/components/UpgradeOfferCard";
import DashboardOverview from "@/components/dashboard/overview/DashboardOverview";
import { useDashboardOverview } from "@/hooks/useDashboardOverview";

type AnyRecord = Record<string, any>;

type AuthUser = {
  _id?: string;
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
  crmClientId?: string | { _id?: string; fullName?: string };
  clientSnapshot?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  phone?: string;
  email?: string;
  [key: string]: any;
};

type CRMClient = {
  _id?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  appointments?: unknown[];
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
  newClients?: number;
  clients_count?: number;
  crm_clients_count?: number;
  customers_count?: number;
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
  return new Date().toISOString().split("T")[0];
}

function getLocale(language?: string): string {
  const lang = String(language || "en").split("-")[0].toLowerCase();
  return lang === "he" ? "he-IL" : "en-US";
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


function getStartOfWeek(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start;
}

function getEndOfWeek(startOfWeek: Date): Date {
  const end = new Date(startOfWeek);
  end.setDate(startOfWeek.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function parseAppointmentDate(appt: Appointment): Date | null {
  if (!appt.date) return null;

  const dateTime = new Date(`${appt.date}T${appt.time || "00:00"}`);

  if (!Number.isFinite(dateTime.getTime())) return null;

  return dateTime;
}

function getWeeklyAppointmentCounts(
  appointments: Appointment[],
  weekOffset = 0
): number[] {
  const today = new Date();
  const currentWeekStart = getStartOfWeek(today);
  const weekStart = new Date(currentWeekStart);

  weekStart.setDate(currentWeekStart.getDate() + weekOffset * 7);

  const weekEnd = getEndOfWeek(weekStart);
  const counts = Array.from({ length: 7 }, () => 0);

  appointments.forEach((appt) => {
    const date = parseAppointmentDate(appt);

    if (!date) return;
    if (date < weekStart || date > weekEnd) return;

    counts[date.getDay()] += 1;
  });

  return counts;
}

function getWeeklyAppointmentsByStatus(
  appointments: Appointment[],
  weekOffset = 0
) {
  const today = new Date();
  const currentWeekStart = getStartOfWeek(today);
  const weekStart = new Date(currentWeekStart);

  weekStart.setDate(currentWeekStart.getDate() + weekOffset * 7);

  const weekEnd = getEndOfWeek(weekStart);

  const weekAppointments = appointments.filter((appt) => {
    const date = parseAppointmentDate(appt);

    if (!date) return false;

    return date >= weekStart && date <= weekEnd;
  });

  const completed = weekAppointments.filter(
    (appt) => String(appt.status || "").toLowerCase() === "completed"
  ).length;

  const canceled = weekAppointments.filter((appt) => {
    const status = String(appt.status || "").toLowerCase();
    return status === "canceled" || status === "cancelled";
  }).length;

  const upcoming = Math.max(weekAppointments.length - completed - canceled, 0);

  return {
    total: weekAppointments.length,
    upcoming,
    completed,
    canceled,
  };
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
    throw new Error("Missing token");
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
    throw new Error("Missing token");
  }

  const res = await API.get(
    `/appointments/all-with-services?businessId=${businessId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

async function fetchCRMClients(
  businessId: string,
  refreshAccessToken: () => Promise<string | null>
): Promise<CRMClient[]> {
  const token = await refreshAccessToken();

  if (!token) {
    throw new Error("Missing token");
  }

  const res = await API.get(`/crm-clients/${businessId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return Array.isArray(res.data) ? res.data : [];
}

function getUniqueClientsFromAppointments(appointments: Appointment[]): number {
  const uniqueClients = new Set<string>();

  appointments.forEach((appt) => {
    const crmClientId =
      typeof appt.crmClientId === "object"
        ? appt.crmClientId?._id
        : appt.crmClientId;

    const key =
      crmClientId ||
      appt.clientSnapshot?.email ||
      appt.clientSnapshot?.phone ||
      appt.email ||
      appt.phone ||
      appt.clientName;

    if (key) {
      uniqueClients.add(String(key).trim().toLowerCase());
    }
  });

  return uniqueClients.size;
}

export function preloadDashboardComponents() {
  CalendarView.preload();
}

function LoadingShell({ text }: { text: React.ReactNode }) {
  return (
    <BizuplyLoader
      fullScreen
      label={typeof text === "string" ? text : undefined}
    />
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
  appointments,
}: {
  appointments: Appointment[];
}) {
  const thisWeek = useMemo(
    () => getWeeklyAppointmentCounts(appointments, 0),
    [appointments]
  );

  const lastWeek = useMemo(
    () => getWeeklyAppointmentCounts(appointments, -1),
    [appointments]
  );

  const status = useMemo(
    () => getWeeklyAppointmentsByStatus(appointments, 0),
    [appointments]
  );

  const total = status.total;
  const averagePerDay = Math.round((total / 7) * 10) / 10;
  const safeTotal = Math.max(total, 1);
  const maxValue = Math.max(...thisWeek, ...lastWeek, 1);

  const statusRows = [
    {
      label: "Upcoming",
      value: status.upcoming,
      percent: Math.round((status.upcoming / safeTotal) * 100),
      icon: <Clock size={14} />,
      bar: "bg-violet-500",
    },
    {
      label: "Completed",
      value: status.completed,
      percent: Math.round((status.completed / safeTotal) * 100),
      icon: <CheckCircle2 size={14} />,
      bar: "bg-emerald-500",
    },
    {
      label: "Canceled",
      value: status.canceled,
      percent: Math.round((status.canceled / safeTotal) * 100),
      icon: <XCircle size={14} />,
      bar: "bg-rose-500",
    },
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const peakDayIndex = thisWeek.indexOf(Math.max(...thisWeek));
  const peakDay = days[peakDayIndex];
  const peakAppointments = thisWeek[peakDayIndex];

  return (
    <GlassPanel className="h-full p-5">
      <SectionHeader
        icon={<Activity size={18} />}
        title="Appointment Overview"
        subtitle="Synced with real-time appointments"
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
          <p className="mt-1 text-xs font-black text-emerald-600">
            From all system appointments
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <p className="text-xs font-black text-slate-500">Average appointments per day</p>
          <p className="mt-3 text-3xl font-black text-slate-950">
            {averagePerDay}
          </p>
          <p className="mt-1 text-xs font-black text-emerald-600">
            Based on the current week
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[26px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-black text-slate-800">Appointment trend</h3>

          <div className="flex items-center gap-4 text-[11px] font-black">
            <span className="flex items-center gap-1.5 text-violet-600">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              This week
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              Last week
            </span>
          </div>
        </div>

        <div className="grid h-[150px] grid-cols-7 items-end gap-3">
          {days.map((day, index) => {
            const lastWeekHeight = lastWeek[index] === 0 ? 0 : Math.max(14, (lastWeek[index] / maxValue) * 100);
            const thisWeekHeight = thisWeek[index] === 0 ? 0 : Math.max(14, (thisWeek[index] / maxValue) * 100);

            return (
              <div key={day} className="flex h-full flex-col justify-end">
                <div className="flex h-[118px] items-end justify-center gap-1.5">
                  <div className="flex h-full w-4 items-end">
                    <div
                      className="w-full rounded-t-full bg-slate-200 transition-all"
                      style={{ height: `${lastWeekHeight}%` }}
                      title={`Last week: ${lastWeek[index]}`}
                    />
                  </div>

                  <div className="flex h-full w-4 items-end">
                    <div
                      className="w-full rounded-t-full bg-gradient-to-t from-violet-600 to-violet-300 shadow-[0_8px_18px_rgba(124,58,237,0.25)] transition-all"
                      style={{ height: `${thisWeekHeight}%` }}
                      title={`This week: ${thisWeek[index]}`}
                    />
                  </div>
                </div>

                <p className="mt-3 text-center text-[11px] font-black text-slate-400">
                  {day}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 space-y-3">
          {statusRows.map((row) => (
            <div key={row.label}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-2 font-black text-slate-600">
                  <span className="text-slate-500">{row.icon}</span>
                  {row.label}
                </span>

                <span className="font-black text-slate-800">
                  {row.value} ({row.percent}%)
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${row.bar} transition-all`}
                  style={{ width: `${row.percent}%` }}
                />
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between rounded-[18px] bg-violet-50 px-3 py-2 text-xs">
            <span className="font-black text-violet-700">Peak day: {peakDay}</span>
            <span className="font-black text-violet-500">
              {peakAppointments} appointments
            </span>
          </div>
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
        subtitle="Your next scheduled appointments"
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

              <div className="shrink-0 text-left">
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
      title: "New appointment scheduled",
      body: `${appt.clientName} — ${appt.serviceName}`,
      time: appt.time || "Now",
      tone: "bg-violet-50 text-violet-700",
    })),
    ...reviews.slice(0, 2).map((review) => ({
      icon: <Star size={15} />,
      title: "New 5-star review",
      body: review.comment || "A client left a review",
      time: "1 hour ago",
      tone: "bg-pink-50 text-pink-700",
    })),
  ];

  return (
    <GlassPanel className="h-full p-5">
      <SectionHeader
        icon={<Zap size={18} />}
        title="Recent Activity"
        subtitle="Live updates from your business"
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
        title="AI Recommendations"
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

function Header({
  user,
  locale,
}: {
  user: AuthUser | null;
  locale: string;
}) {
  const displayName = user?.name || user?.businessName || "Demo";

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
          Here is what is happening in your business today.
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
  const [crmClientsCount, setCrmClientsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshingUser, setIsRefreshingUser] = useState<boolean>(false);
  const [isEarlyBirdDismissed, setIsEarlyBirdDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("bizuplyEarlyBirdDismissed") === "true";
  });
  const [analyticsRefreshToken, setAnalyticsRefreshToken] = useState(0);

  const {
    data: overviewData,
    loading: overviewLoading,
    error: overviewError,
    filters: overviewFilters,
    updateFilters: updateOverviewFilters,
    refetch: refetchOverview,
  } = useDashboardOverview({
    businessId,
    enabled: Boolean(businessId && initialized),
    refreshToken: analyticsRefreshToken,
  });

  const bumpAnalyticsRefresh = useCallback(() => {
    setAnalyticsRefreshToken((current) => current + 1);
  }, []);

  const shouldShowEarlyBirdModal =
    user?.isEarlyBirdActive &&
    user?.paymentStatus === "trial" &&
    !isRefreshingUser &&
    !isEarlyBirdDismissed;

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
            "Your subscription has not been activated yet. Please try again in a few minutes."
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
        tx("dashboard.states.loadErrorMessage", "Error loading data from the server.")
      );

      if (err?.message === "Missing token") {
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
      console.error("Error refreshing appointments from the API:", err);
    }
  }, [businessId, refreshAccessToken]);

  const refreshCRMClientsFromAPI = useCallback(async () => {
    if (!businessId) return;

    try {
      const clients = await fetchCRMClients(businessId, refreshAccessToken);

      setCrmClientsCount(clients.length);

      setStats((oldStats) => ({
        ...(oldStats || {}),
        clients_count: clients.length,
        crm_clients_count: clients.length,
        newClients: clients.length,
      }));
    } catch (err) {
      console.error("Error refreshing CRM clients from the API:", err);
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
        const newToken = await refreshAccessToken({ force: true });

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
        bumpAnalyticsRefresh();
      });

      sock.on("dashboardAnalyticsUpdated", () => {
        bumpAnalyticsRefresh();
      });

      sock.on("crmLeadCreated", () => {
        bumpAnalyticsRefresh();
      });

      sock.on("newProposalCreated", () => {
        bumpAnalyticsRefresh();
      });

      sock.on("proposalStatusUpdated", () => {
        bumpAnalyticsRefresh();
      });

      sock.on("appointmentCreated", () => {
        refreshAppointmentsFromAPI();
        refreshCRMClientsFromAPI();
        bumpAnalyticsRefresh();
      });
      sock.on("appointmentUpdated", () => {
        refreshAppointmentsFromAPI();
        refreshCRMClientsFromAPI();
        bumpAnalyticsRefresh();
      });
      sock.on("appointmentDeleted", () => {
        refreshAppointmentsFromAPI();
        refreshCRMClientsFromAPI();
        bumpAnalyticsRefresh();
      });
      sock.on("crmClientCreated", refreshCRMClientsFromAPI);
      sock.on("crmClientUpdated", refreshCRMClientsFromAPI);
      sock.on("crmClientDeleted", refreshCRMClientsFromAPI);

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
              bumpAnalyticsRefresh();
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
              bumpAnalyticsRefresh();
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
              console.log("[Unhandled business update]", type);
          }
        } catch (err) {
          console.error("Error parsing businessUpdates data:", err);
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
        bumpAnalyticsRefresh();
      });
    };

    loadStats();
    refreshAppointmentsFromAPI();
    refreshCRMClientsFromAPI();
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
    refreshCRMClientsFromAPI,
    loadStats,
    bumpAnalyticsRefresh,
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

  const handleEarlyBirdClose = useCallback(() => {
    setIsEarlyBirdDismissed(true);
    setAlertMessage(null);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("bizuplyEarlyBirdDismissed", "true");
    }
  }, []);

  const handleEarlyBirdUpgrade = async () => {
    const checkoutUserId = user?.userId || user?._id;

    if (!checkoutUserId) {
      setAlertMessage(
        tx(
          "dashboard.states.missingUserId",
          "Payment cannot be opened because the user has not loaded yet."
        )
      );
      return;
    }

    try {
      const res = await API.post("/stripe/create-checkout-session", {
        userId: checkoutUserId,
        plan: "monthly",
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
        return;
      }

      throw new Error("Missing payment link");
    } catch (err) {
      console.error("Early Bird payment error:", err);
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
            "The real-time connection is not connected"
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

  if (overviewLoading && !overviewData && !stats) {
    return <DashboardSkeleton />;
  }

  if (error && !overviewData && !stats) {
    return (
      <ErrorShell
        title={tx("dashboard.states.loadErrorTitle", "Unable to load the dashboard")}
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

  const totalAppointments =
    safeNumber(syncedStats.appointments_count) || enrichedAppointments.length;

  const todayAppointments = getTodayAppointmentsCount(enrichedAppointments);
  const upcomingAppointments = getUpcomingAppointmentsCount(
    enrichedAppointments
  );


  const fallbackClientsFromAppointments =
    getUniqueClientsFromAppointments(enrichedAppointments);

  const newClientsValue =
    crmClientsCount ||
    safeNumber(syncedStats.crm_clients_count) ||
    safeNumber(syncedStats.clients_count) ||
    safeNumber(syncedStats.newClients) ||
    fallbackClientsFromAppointments;

  const ratingValue =
    syncedStats.average_rating ??
    syncedStats.rating ??
    (syncedStats.reviews_count ? 4.9 : 0);

  const pageDir = String(i18n.language || "en").split("-")[0] === "he" ? "rtl" : "ltr";

  return (
    <div
      dir={pageDir}
      className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,#f1e8ff_0,#f8f6ff_34%,#f6f7fb_68%,#ffffff_100%)] text-slate-950"
    >
      <div className="mx-auto w-full max-w-[1680px] px-4 py-4 sm:px-6 lg:px-8">
        <main className="min-w-0 pb-10">

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
                onClose={handleEarlyBirdClose}
              />
            </div>
          )}

          <DashboardOverview
            businessName={
              user?.businessName || effectiveStats.businessName || user?.name
            }
            calendarAppointments={enrichedAppointments}
            data={overviewData}
            loading={overviewLoading}
            error={overviewError}
            filters={overviewFilters}
            onFiltersChange={updateOverviewFilters}
            onRetry={refetchOverview}
          />

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
