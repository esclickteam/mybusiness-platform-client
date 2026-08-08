import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ban,
  Building2,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  HeartHandshake,
  Sparkles,
  Users,
  UsersRound,
  Wallet,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminsHeader";

type AdminStats = {
  totalUsers: number;
  totalBusinesses: number;
  totalClients: number;
  totalSales: number;
  activeManagers: number;
  blockedUsers: number;
  earlyAccessCount: number;
};

const initialStats: AdminStats = {
  totalUsers: 0,
  totalBusinesses: 0,
  totalClients: 0,
  totalSales: 0,
  activeManagers: 0,
  blockedUsers: 0,
  earlyAccessCount: 0,
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("he-IL").format(Number(value || 0));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

type MetricTone = "purple" | "blue" | "green" | "orange" | "gold" | "red";

type MetricCardProps = {
  title: string;
  value: string;
  note: string;
  icon: ReactNode;
  tone?: MetricTone;
};

const metricIconTones: Record<MetricTone, string> = {
  purple: "bg-[#7C4DFF] text-white shadow-[#7C4DFF]/25",
  blue: "bg-sky-500 text-white shadow-sky-500/25",
  green: "bg-emerald-500 text-white shadow-emerald-500/25",
  orange: "bg-orange-500 text-white shadow-orange-500/25",
  gold: "bg-amber-500 text-white shadow-amber-500/25",
  red: "bg-rose-500 text-white shadow-rose-500/25",
};

function MetricCard({
  title,
  value,
  note,
  icon,
  tone = "purple",
}: MetricCardProps) {
  return (
    <div
      dir="rtl"
      className="rounded-[24px] border border-slate-100 bg-white p-5 text-right shadow-[0_8px_28px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(124,77,255,0.12)]"
    >
      <div className="flex flex-row items-start justify-between gap-4">
        <div className="min-w-0 flex-1 text-right">
          <p className="text-right text-sm font-bold text-slate-500">{title}</p>
          <strong className="mt-3 block text-right text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {value}
          </strong>
          <p className="mt-2 text-right text-xs font-semibold text-slate-400">
            {note}
          </p>
        </div>

        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-lg ${metricIconTones[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

type QuickActionProps = {
  title: string;
  description: string;
  icon: ReactNode;
  iconClassName: string;
  onClick: () => void;
};

function QuickAction({
  title,
  description,
  icon,
  iconClassName,
  onClick,
}: QuickActionProps) {
  return (
    <button
      type="button"
      dir="rtl"
      onClick={onClick}
      className="group flex w-full flex-row items-center gap-4 rounded-[24px] border border-slate-100 bg-white p-5 text-right shadow-[0_8px_28px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_14px_34px_rgba(124,77,255,0.12)]"
    >
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${iconClassName}`}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1 text-right">
        <strong className="block text-right text-base font-black text-slate-900">
          {title}
        </strong>
        <small className="mt-1 block text-right text-sm font-semibold leading-6 text-slate-500">
          {description}
        </small>
      </span>

      <span className="text-slate-300 transition group-hover:-translate-x-1 group-hover:text-[#7C4DFF]">
        <ArrowLeft className="h-5 w-5" />
      </span>
    </button>
  );
}

function AdminFooter() {
  return (
    <footer
      dir="rtl"
      className="mt-12 border-t border-slate-200/80 bg-white/80 px-4 py-5 text-slate-500 md:px-8"
    >
      <div className="mx-auto flex max-w-[1480px] flex-col items-center gap-4 text-sm font-semibold md:flex-row md:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <a href="/support" className="transition hover:text-[#7C4DFF]">
            מרכז עזרה
          </a>
          <a href="/privacy-policy" className="transition hover:text-[#7C4DFF]">
            מדיניות פרטיות
          </a>
          <a href="/terms" className="transition hover:text-[#7C4DFF]">
            תנאי שימוש
          </a>
        </div>

        <p className="text-center text-slate-400">
          © {new Date().getFullYear()} כל הזכויות שמורות.
        </p>

        <div className="flex items-center gap-2 text-slate-500">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#7C4DFF]/10 text-[#7C4DFF]">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <span>גרסה 1.0.0</span>
        </div>
      </div>
    </footer>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [connectedToServer, setConnectedToServer] = useState(false);

  const displayName = user?.name || user?.email || "מנהל";

  const todayLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date());
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboardStats() {
      setLoadingStats(true);
      setStatsError("");

      try {
        const { data } = await API.get("/admin/dashboard-stats");

        if (cancelled) return;

        setStats({
          totalUsers: Number(data?.totalUsers || 0),
          totalBusinesses: Number(data?.totalBusinesses || 0),
          totalClients: Number(data?.totalClients || 0),
          totalSales: Number(data?.totalSales || 0),
          activeManagers: Number(data?.activeManagers || 0),
          blockedUsers: Number(data?.blockedUsers || 0),
          earlyAccessCount: Number(data?.earlyAccessCount || 0),
        });
        setConnectedToServer(true);
      } catch (err) {
        console.error("Failed to load admin dashboard stats:", err);
        if (!cancelled) {
          setStatsError("לא ניתן לטעון נתונים מהשרת");
          setConnectedToServer(false);
        }
      } finally {
        if (!cancelled) {
          setLoadingStats(false);
        }
      }
    }

    loadDashboardStats();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-[#F8F9FA]"
      style={{ fontFamily: '"Assistant", "Inter", "Rubik", sans-serif' }}
    >
      <AdminHeader />

      <main
        dir="rtl"
        className="px-3 py-5 text-right text-slate-800 sm:px-4 sm:py-7 md:px-8"
      >
        <section dir="rtl" className="mx-auto max-w-[1480px] text-right">
          <div className="relative overflow-hidden rounded-[32px] border border-violet-100 bg-gradient-to-l from-[#f3e9ff] via-[#faf7ff] to-white p-5 shadow-[0_18px_50px_rgba(124,77,255,0.08)] sm:p-6 md:p-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 12% 20%, rgba(124,77,255,0.16), transparent 34%), radial-gradient(circle at 88% 10%, rgba(167,139,250,0.18), transparent 28%), radial-gradient(ellipse at 50% 120%, rgba(124,77,255,0.08), transparent 46%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-40"
              style={{
                background:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'%3E%3Cpath fill='%23e9d5ff' d='M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z'/%3E%3C/svg%3E\") bottom/100% 100% no-repeat",
              }}
            />

            <div className="relative z-10 mb-5 flex flex-wrap justify-start gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-4 py-2 text-xs font-bold text-slate-600 shadow-sm">
                <CalendarDays className="h-3.5 w-3.5 text-[#7C4DFF]" />
                {todayLabel}
              </span>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold shadow-sm ${
                  connectedToServer
                    ? "border-emerald-100 bg-white/90 text-emerald-700"
                    : "border-amber-100 bg-white/90 text-amber-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    connectedToServer ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {loadingStats
                  ? "טוען נתונים מהשרת..."
                  : connectedToServer
                    ? "מחובר לשרת"
                    : "נתונים מקומיים ללא שרת"}
              </span>
            </div>

            <div className="relative z-10 flex flex-col justify-between gap-7 xl:flex-row xl:items-end">
              <div className="max-w-3xl text-right">
                <h1 className="text-right text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                  שלום, {displayName}
                </h1>

                <p className="mt-4 max-w-2xl text-right text-base font-semibold leading-8 text-slate-500 md:text-lg">
                  סקירה מהירה של משתמשים, עסקים, מכירות והרשמות מוקדמות. אזור
                  ניהול ברור, בעברית ובכיוון ימין לשמאל.
                </p>

                {statsError ? (
                  <p className="mt-3 text-sm font-bold text-amber-600">
                    {statsError}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:w-[420px] xl:grid-cols-1">
                <button
                  type="button"
                  onClick={() => navigate("/admin/early-access")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7C4DFF] px-6 py-4 text-sm font-black text-white shadow-lg shadow-[#7C4DFF]/30 transition hover:-translate-y-1 hover:bg-[#6B3FE0]"
                >
                  <Users className="h-4 w-4" />
                  צפייה בהרשמות מוקדמות
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/customers")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#7C4DFF] bg-white px-6 py-4 text-sm font-black text-[#7C4DFF] shadow-sm transition hover:-translate-y-1 hover:bg-violet-50"
                >
                  <CreditCard className="h-4 w-4" />
                  ניהול לקוחות
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4 text-right">
              <h2 className="text-right text-2xl font-black text-slate-900">
                סקירת מערכת
              </h2>
              <p className="mt-1 text-right text-sm font-semibold text-slate-500">
                נתונים מרכזיים מכל אזורי המערכת.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 text-right sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="משתמשים במערכת"
                value={loadingStats ? "…" : formatNumber(stats.totalUsers)}
                note="כל המשתמשים הרשומים"
                tone="purple"
                icon={<Users className="h-5 w-5" />}
              />

              <MetricCard
                title="עסקים רשומים"
                value={loadingStats ? "…" : formatNumber(stats.totalBusinesses)}
                note="עסקים שנפתחו במערכת"
                tone="blue"
                icon={<Building2 className="h-5 w-5" />}
              />

              <MetricCard
                title="לקוחות ושותפים"
                value={loadingStats ? "…" : formatNumber(stats.totalClients)}
                note="לקוחות פעילים ורשומים"
                tone="green"
                icon={<UsersRound className="h-5 w-5" />}
              />

              <MetricCard
                title="הרשמות מוקדמות"
                value={
                  loadingStats ? "…" : formatNumber(stats.earlyAccessCount)
                }
                note="נרשמים מטופס ההשקה"
                tone="orange"
                icon={<Sparkles className="h-5 w-5" />}
              />

              <MetricCard
                title="סך מכירות"
                value={loadingStats ? "…" : formatMoney(stats.totalSales)}
                note="סה״כ הכנסות שנמדדו"
                tone="gold"
                icon={<CircleDollarSign className="h-5 w-5" />}
              />

              <MetricCard
                title="מנהלים פעילים"
                value={loadingStats ? "…" : formatNumber(stats.activeManagers)}
                note="מנהלי מערכת פעילים"
                tone="purple"
                icon={<ShieldCheck className="h-5 w-5" />}
              />

              <MetricCard
                title="משתמשים חסומים"
                value={loadingStats ? "…" : formatNumber(stats.blockedUsers)}
                note="חשבונות שנחסמו"
                tone="red"
                icon={<Ban className="h-5 w-5" />}
              />
            </div>
          </div>

          <div className="mt-10 text-right">
            <div className="mb-4 text-right">
              <h2 className="text-right text-2xl font-black text-slate-900">
                פעולות מהירות
              </h2>
              <p className="mt-1 text-right text-sm font-semibold text-slate-500">
                מעבר מהיר לאזורי הניהול החשובים.
              </p>
            </div>

            <div className="grid gap-4 text-right sm:grid-cols-2 xl:grid-cols-3">
              <QuickAction
                icon={<CreditCard className="h-5 w-5" />}
                iconClassName="bg-emerald-100 text-emerald-700"
                title="ניהול לקוחות"
                description="חיפוש עסקים, יצירת לקוח, בחירת חבילה ותשלום Stripe"
                onClick={() => navigate("/admin/customers")}
              />

              <QuickAction
                icon={<Users className="h-5 w-5" />}
                iconClassName="bg-violet-100 text-[#7C4DFF]"
                title="ניהול משתמשים"
                description="צפייה, עריכה, חסימה וניהול משתמשים"
                onClick={() => navigate("/admin/users")}
              />

              <QuickAction
                icon={<Sparkles className="h-5 w-5" />}
                iconClassName="bg-orange-100 text-orange-600"
                title="הרשמה מוקדמת"
                description="רשימת כל האנשים שנרשמו דרך טופס ההשקה"
                onClick={() => navigate("/admin/early-access")}
              />

              <QuickAction
                icon={<HeartHandshake className="h-5 w-5" />}
                iconClassName="bg-amber-100 text-amber-600"
                title="ניהול שותפים"
                description="ניהול אפיליאייטים ושותפים עסקיים"
                onClick={() => navigate("/admin/affiliates")}
              />

              <QuickAction
                icon={<Building2 className="h-5 w-5" />}
                iconClassName="bg-sky-100 text-sky-600"
                title="כניסה לעסקים"
                description="רשימת כל העסקים וכניסה לפי הרשאות החבילה של העסק"
                onClick={() => navigate("/admin/businesses")}
              />

              <QuickAction
                icon={<Wallet className="h-5 w-5" />}
                iconClassName="bg-violet-100 text-violet-700"
                title="תשלומי שותפים"
                description="מעקב וניהול תשלומים לאפיליאייטים"
                onClick={() => navigate("/admin/affiliate-payouts")}
              />

              <QuickAction
                icon={<CircleDollarSign className="h-5 w-5" />}
                iconClassName="bg-emerald-100 text-emerald-600"
                title="בקשות משיכה"
                description="בדיקה ואישור בקשות משיכה"
                onClick={() => navigate("/admin/withdrawals")}
              />
            </div>
          </div>
        </section>
      </main>

      <AdminFooter />
    </div>
  );
}

export default AdminDashboard;
