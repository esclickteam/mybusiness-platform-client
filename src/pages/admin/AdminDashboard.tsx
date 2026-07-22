import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

type MetricCardProps = {
  title: string;
  value: string;
  icon: string;
  note: string;
  tone?: "purple" | "gold" | "green" | "blue" | "red";
};

function MetricCard({
  title,
  value,
  icon,
  note,
  tone = "purple",
}: MetricCardProps) {
  const tones = {
    purple:
      "border-purple-200 bg-gradient-to-br from-white via-purple-50 to-purple-100 text-purple-950",
    gold:
      "border-amber-200 bg-gradient-to-br from-white via-amber-50 to-yellow-100 text-amber-950",
    green:
      "border-emerald-200 bg-gradient-to-br from-white via-emerald-50 to-teal-100 text-emerald-950",
    blue:
      "border-sky-200 bg-gradient-to-br from-white via-sky-50 to-blue-100 text-sky-950",
    red:
      "border-rose-200 bg-gradient-to-br from-white via-rose-50 to-red-100 text-rose-950",
  };

  const iconTones = {
    purple: "bg-purple-700 text-white shadow-purple-700/25",
    gold: "bg-amber-500 text-white shadow-amber-500/25",
    green: "bg-emerald-600 text-white shadow-emerald-600/25",
    blue: "bg-sky-600 text-white shadow-sky-600/25",
    red: "bg-rose-600 text-white shadow-rose-600/25",
  };

  return (
    <div
      dir="rtl"
      className={`rounded-[26px] border p-5 text-right shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${tones[tone]}`}
    >
      <div className="flex flex-row items-start justify-between gap-4">
        <div className="min-w-0 flex-1 text-right">
          <p className="text-right text-sm font-black opacity-70">{title}</p>

          <strong className="mt-3 block text-right text-4xl font-black tracking-tight">
            {value}
          </strong>

          <p className="mt-2 text-right text-xs font-bold opacity-55">{note}</p>
        </div>

        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl shadow-lg ${iconTones[tone]}`}
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
  icon: string;
  onClick: () => void;
  primary?: boolean;
};

function QuickAction({
  title,
  description,
  icon,
  onClick,
  primary = false,
}: QuickActionProps) {
  return (
    <button
      type="button"
      dir="rtl"
      onClick={onClick}
      className={`group flex w-full flex-row items-center gap-4 rounded-[26px] border p-5 text-right shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${
        primary
          ? "border-purple-700 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-white"
          : "border-slate-200 bg-white text-slate-800 hover:border-purple-200 hover:bg-purple-50"
      }`}
    >
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl ${
          primary ? "bg-white/18" : "bg-purple-100 text-purple-800"
        }`}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1 text-right">
        <strong className="block text-right text-base font-black">
          {title}
        </strong>

        <small
          className={`mt-1 block text-right text-sm font-bold leading-6 ${
            primary ? "text-white/80" : "text-slate-500"
          }`}
        >
          {description}
        </small>
      </span>

      <span
        className={`text-xl font-black transition group-hover:-translate-x-1 ${
          primary ? "text-white/80" : "text-purple-700"
        }`}
      >
        ←
      </span>
    </button>
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
    return new Intl.DateTimeFormat("he-IL", {
      weekday: "long",
      day: "numeric",
      month: "long",
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
    <>
      <AdminHeader />

      <main
        dir="rtl"
        className="min-h-screen bg-[#f6f2fb] px-4 py-7 text-right text-slate-800 md:px-8"
      >
        <section dir="rtl" className="mx-auto max-w-[1480px] text-right">
          <div className="relative overflow-hidden rounded-[34px] border border-purple-200 bg-gradient-to-l from-purple-950 via-purple-900 to-fuchsia-800 p-6 text-white shadow-2xl shadow-purple-950/20 md:p-8">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

            <div className="relative z-10 flex flex-col justify-between gap-7 xl:flex-row xl:items-end">
              <div className="max-w-4xl text-right">
                <div className="mb-4 flex flex-wrap justify-start gap-2 text-right">
                  <span className="rounded-full bg-white/14 px-4 py-2 text-xs font-black text-white ring-1 ring-white/20">
                    פאנל אדמין
                  </span>

                  <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white/75 ring-1 ring-white/15">
                    {todayLabel}
                  </span>

                  <span
                    className={`rounded-full px-4 py-2 text-xs font-bold ring-1 ${
                      connectedToServer
                        ? "bg-emerald-300/18 text-emerald-100 ring-emerald-200/25"
                        : "bg-amber-300/18 text-amber-100 ring-amber-200/25"
                    }`}
                  >
                    {loadingStats
                      ? "טוען נתונים מהשרת..."
                      : connectedToServer
                        ? "מחובר לשרת"
                        : "נתונים מקומיים ללא שרת"}
                  </span>
                </div>

                <h1 className="text-right text-4xl font-black tracking-tight text-white md:text-6xl">
                  שלום, {displayName}
                </h1>

                <p className="mt-4 max-w-3xl text-right text-base font-bold leading-8 text-white/70 md:text-lg">
                  סקירה מהירה של משתמשים, עסקים, מכירות והרשמות מוקדמות.
                  אזור ניהול ברור, בעברית ובכיוון ימין לשמאל.
                </p>

                {statsError ? (
                  <p className="mt-3 text-sm font-bold text-amber-100">
                    {statsError}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:w-[390px] xl:grid-cols-1">
                <button
                  type="button"
                  onClick={() => navigate("/admin/early-access")}
                  className="rounded-2xl bg-white px-6 py-4 text-sm font-black text-purple-950 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:bg-purple-50"
                >
                  צפייה בהרשמות מוקדמות
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
                  className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-black text-white shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:bg-white/15"
                >
                  ניהול משתמשים
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4 text-right">
              <h2 className="text-right text-2xl font-black text-purple-950">
                סקירת מערכת
              </h2>

              <p className="mt-1 text-right text-sm font-bold text-purple-950/55">
                נתונים מרכזיים מכל אזורי המערכת.
              </p>
            </div>

            <div className="grid gap-4 text-right md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="משתמשים במערכת"
                value={loadingStats ? "…" : formatNumber(stats.totalUsers)}
                icon="👥"
                note="כל המשתמשים הרשומים"
                tone="purple"
              />

              <MetricCard
                title="עסקים רשומים"
                value={loadingStats ? "…" : formatNumber(stats.totalBusinesses)}
                icon="🏢"
                note="עסקים שנפתחו במערכת"
                tone="blue"
              />

              <MetricCard
                title="לקוחות רשומים"
                value={loadingStats ? "…" : formatNumber(stats.totalClients)}
                icon="🧑‍🤝‍🧑"
                note="לקוחות פעילים ורשומים"
                tone="green"
              />

              <MetricCard
                title="הרשמות מוקדמות"
                value={
                  loadingStats ? "…" : formatNumber(stats.earlyAccessCount)
                }
                icon="✨"
                note="נרשמים מטופס ההשקה"
                tone="gold"
              />

              <MetricCard
                title="סך מכירות"
                value={loadingStats ? "…" : formatMoney(stats.totalSales)}
                icon="💰"
                note="סה״כ הכנסות שנמדדו"
                tone="gold"
              />

              <MetricCard
                title="מנהלים פעילים"
                value={loadingStats ? "…" : formatNumber(stats.activeManagers)}
                icon="🧑‍💼"
                note="מנהלי מערכת פעילים"
                tone="purple"
              />

              <MetricCard
                title="משתמשים חסומים"
                value={loadingStats ? "…" : formatNumber(stats.blockedUsers)}
                icon="🚫"
                note="חשבונות שנחסמו"
                tone="red"
              />
            </div>
          </div>

          <div className="mt-10 grid gap-6 text-right xl:grid-cols-[1fr_420px]">
            <section className="text-right">
              <div className="mb-4 text-right">
                <h2 className="text-right text-2xl font-black text-purple-950">
                  פעולות מהירות
                </h2>

                <p className="mt-1 text-right text-sm font-bold text-purple-950/55">
                  מעבר מהיר לאזורי הניהול החשובים.
                </p>
              </div>

              <div className="grid gap-4 text-right lg:grid-cols-2">
                <QuickAction
                  icon="✨"
                  title="הרשמה מוקדמת"
                  description="רשימת כל האנשים שנרשמו דרך טופס ההשקה"
                  onClick={() => navigate("/admin/early-access")}
                  primary
                />

                <QuickAction
                  icon="👥"
                  title="ניהול משתמשים"
                  description="צפייה, עריכה, חסימה וניהול משתמשים"
                  onClick={() => navigate("/admin/users")}
                />

                <QuickAction
                  icon="🏢"
                  title="כניסה לעסקים"
                  description="רשימת כל העסקים וכניסה עם הרשאות מלאות"
                  onClick={() => navigate("/admin/businesses")}
                />

                <QuickAction
                  icon="🤝"
                  title="ניהול שותפים"
                  description="ניהול אפיליאייטים ושותפים עסקיים"
                  onClick={() => navigate("/admin/affiliates")}
                />

                <QuickAction
                  icon="💸"
                  title="בקשות משיכה"
                  description="בדיקה ואישור בקשות משיכה"
                  onClick={() => navigate("/admin/withdrawals")}
                />

                <QuickAction
                  icon="🏦"
                  title="תשלומי שותפים"
                  description="מעקב וניהול תשלומים לאפיליאייטים"
                  onClick={() => navigate("/admin/affiliate-payouts")}
                />
              </div>
            </section>

            <aside className="rounded-[28px] border border-purple-200 bg-white p-5 text-right shadow-xl shadow-purple-950/8">
              <h2 className="text-right text-xl font-black text-purple-950">
                סטטוס מערכת
              </h2>

              <p className="mt-1 text-right text-sm font-bold text-purple-950/45">
                מצב החיבורים והמידע בפאנל.
              </p>

              <div className="mt-5 space-y-3 text-right">
                <div className="flex flex-row items-center justify-between rounded-2xl bg-purple-50 p-4">
                  <span className="text-sm font-bold text-purple-950/55">
                    מקור נתונים
                  </span>
                  <strong className="text-sm font-black text-purple-950">
                    {connectedToServer ? "שרת" : "מקומי"}
                  </strong>
                </div>

                <div
                  className={`flex flex-row items-center justify-between rounded-2xl p-4 ${
                    connectedToServer ? "bg-emerald-50" : "bg-amber-50"
                  }`}
                >
                  <span
                    className={`text-sm font-bold ${
                      connectedToServer
                        ? "text-emerald-950/60"
                        : "text-amber-950/60"
                    }`}
                  >
                    שרת
                  </span>
                  <strong
                    className={`text-sm font-black ${
                      connectedToServer
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }`}
                  >
                    {loadingStats
                      ? "מתחבר..."
                      : connectedToServer
                        ? "מחובר"
                        : "לא מחובר"}
                  </strong>
                </div>

                <div className="flex flex-row items-center justify-between rounded-2xl bg-fuchsia-50 p-4">
                  <span className="text-sm font-bold text-fuchsia-950/55">
                    הרשמות
                  </span>
                  <strong className="text-sm font-black text-fuchsia-700">
                    {loadingStats
                      ? "…"
                      : formatNumber(stats.earlyAccessCount)}
                  </strong>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}

export default AdminDashboard;
