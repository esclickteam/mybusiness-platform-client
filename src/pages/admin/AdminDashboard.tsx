import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminsHeader";
import {
  EARLY_ACCESS_EVENT_NAME,
  getEarlyAccessRegistrations,
} from "./earlyAccessStorage";

type AdminStats = {
  totalUsers: number;
  totalBusinesses: number;
  totalClients: number;
  totalSales: number;
  activeManagers: number;
  blockedUsers: number;
};

const initialStats: AdminStats = {
  totalUsers: 0,
  totalBusinesses: 0,
  totalClients: 0,
  totalSales: 0,
  activeManagers: 0,
  blockedUsers: 0,
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("he-IL").format(value || 0);
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

type StatCardProps = {
  icon: string;
  title: string;
  value: string;
  helper: string;
  className?: string;
};

function StatCard({ icon, title, value, helper, className = "" }: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-purple-200/70 bg-white/85 p-5 shadow-xl shadow-purple-950/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-950/10 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-100/80 via-transparent to-transparent" />

      <div className="relative z-10 flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-lg shadow-purple-950/10">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-black text-purple-950/60">{title}</p>
          <strong className="mt-2 block text-3xl font-black tracking-tight text-purple-950 md:text-4xl">
            {value}
          </strong>
          <span className="mt-2 block text-xs font-bold text-purple-950/50">
            {helper}
          </span>
        </div>
      </div>
    </div>
  );
}

type ActionCardProps = {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  featured?: boolean;
};

function ActionCard({
  icon,
  title,
  description,
  onClick,
  featured = false,
}: ActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-4 rounded-[28px] border p-5 text-right shadow-xl transition hover:-translate-y-1 ${
        featured
          ? "border-purple-700 bg-gradient-to-br from-purple-700 to-purple-950 text-white shadow-purple-800/20"
          : "border-purple-200/70 bg-white/85 text-purple-950 shadow-purple-950/5 hover:shadow-purple-950/10"
      }`}
    >
      <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-lg shadow-purple-950/10">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <strong className="block text-lg font-black">{title}</strong>
        <small
          className={`mt-1 block text-sm font-bold leading-6 ${
            featured ? "text-white/75" : "text-purple-950/55"
          }`}
        >
          {description}
        </small>
      </span>

      <span
        className={`text-2xl font-black transition group-hover:-translate-x-1 ${
          featured ? "text-white/80" : "text-purple-700"
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

  const [stats] = useState<AdminStats>(initialStats);
  const [earlyAccessCount, setEarlyAccessCount] = useState(0);

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
    function refreshEarlyAccessCount() {
      setEarlyAccessCount(getEarlyAccessRegistrations().length);
    }

    refreshEarlyAccessCount();

    window.addEventListener("storage", refreshEarlyAccessCount);
    window.addEventListener(EARLY_ACCESS_EVENT_NAME, refreshEarlyAccessCount);

    return () => {
      window.removeEventListener("storage", refreshEarlyAccessCount);
      window.removeEventListener(EARLY_ACCESS_EVENT_NAME, refreshEarlyAccessCount);
    };
  }, []);

  return (
    <>
      <AdminHeader />

      <main
        dir="rtl"
        className="min-h-screen bg-[#f8f3ff] bg-[radial-gradient(circle_at_top_right,rgba(216,154,34,0.16),transparent_32%),radial-gradient(circle_at_top_left,rgba(124,58,237,0.16),transparent_36%)] px-4 py-6 text-purple-950 md:px-8 md:py-8"
      >
        <section className="mx-auto max-w-[1440px]">
          <div className="relative overflow-hidden rounded-[34px] border border-purple-200/70 bg-white/80 p-6 shadow-2xl shadow-purple-950/10 backdrop-blur md:p-9">
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-purple-400/10 blur-3xl" />
            <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" />

            <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="mb-4 inline-flex rounded-full bg-purple-50 px-4 py-2 text-sm font-black text-purple-800 ring-1 ring-purple-200">
                  👑 פאנל ניהול ראשי
                </div>

                <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-purple-950 md:text-6xl">
                  ברוכה הבאה, {displayName}
                </h1>

                <p className="mt-4 max-w-3xl text-base font-bold leading-8 text-purple-950/60 md:text-lg">
                  ניהול מלא של המערכת, משתמשים, עסקים, שותפים, תשלומים והרשמות
                  מוקדמות — במקום אחד, בעברית ובחוויית שימוש נקייה.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-purple-950/70 ring-1 ring-purple-200">
                    {todayLabel}
                  </span>

                  <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-purple-950/70 ring-1 ring-purple-200">
                    מצב זמני: נתונים מקומיים ללא שרת
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px] lg:grid-cols-1">
                <button
                  type="button"
                  onClick={() => navigate("/admin/early-access")}
                  className="rounded-2xl bg-gradient-to-l from-purple-700 to-purple-950 px-6 py-4 text-base font-black text-white shadow-xl shadow-purple-800/25 transition hover:-translate-y-0.5"
                >
                  צפייה בהרשמות מוקדמות
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
                  className="rounded-2xl bg-white px-6 py-4 text-base font-black text-purple-900 ring-1 ring-purple-200 transition hover:-translate-y-0.5 hover:bg-purple-50"
                >
                  ניהול משתמשים
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4">
              <h2 className="text-2xl font-black text-purple-950">סקירת מערכת</h2>
              <p className="mt-1 text-sm font-bold text-purple-950/55">
                כרגע מוצגים נתונים מקומיים. כשיהיה שרת, נחבר את אותם כרטיסים ל־API.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon="👥"
                title="משתמשים במערכת"
                value={formatNumber(stats.totalUsers)}
                helper="כל המשתמשים הרשומים"
              />

              <StatCard
                icon="🏢"
                title="עסקים רשומים"
                value={formatNumber(stats.totalBusinesses)}
                helper="עסקים שנפתחו במערכת"
              />

              <StatCard
                icon="🧑‍🤝‍🧑"
                title="לקוחות רשומים"
                value={formatNumber(stats.totalClients)}
                helper="לקוחות פעילים ורשומים"
              />

              <StatCard
                icon="✨"
                title="הרשמות מוקדמות"
                value={formatNumber(earlyAccessCount)}
                helper="נרשמים מהטופס המקומי"
                className="ring-2 ring-yellow-300/50"
              />

              <StatCard
                icon="💰"
                title="סך מכירות"
                value={formatMoney(stats.totalSales)}
                helper="סה״כ הכנסות שנמדדו"
              />

              <StatCard
                icon="🧑‍💼"
                title="מנהלים פעילים"
                value={formatNumber(stats.activeManagers)}
                helper="מנהלי מערכת פעילים"
              />

              <StatCard
                icon="🚫"
                title="משתמשים חסומים"
                value={formatNumber(stats.blockedUsers)}
                helper="חשבונות שנחסמו"
              />
            </div>
          </div>

          <div className="mt-10">
            <div className="mb-4">
              <h2 className="text-2xl font-black text-purple-950">פעולות מהירות</h2>
              <p className="mt-1 text-sm font-bold text-purple-950/55">
                מעבר מהיר לאזורי הניהול החשובים.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <ActionCard
                icon="👥"
                title="ניהול משתמשים"
                description="צפייה, עריכה, חסימה וניהול משתמשים"
                onClick={() => navigate("/admin/users")}
              />

              <ActionCard
                icon="✨"
                title="הרשמה מוקדמת"
                description="כל מי שנרשם דרך טופס ההשקה יופיע כאן"
                onClick={() => navigate("/admin/early-access")}
                featured
              />

              <ActionCard
                icon="🤝"
                title="ניהול שותפים"
                description="ניהול אפיליאייטים ושותפים עסקיים"
                onClick={() => navigate("/admin/affiliates")}
              />

              <ActionCard
                icon="💸"
                title="בקשות משיכה"
                description="בדיקה ואישור בקשות משיכה"
                onClick={() => navigate("/admin/withdrawals")}
              />

              <ActionCard
                icon="🏦"
                title="תשלומי שותפים"
                description="מעקב וניהול תשלומים לאפיליאייטים"
                onClick={() => navigate("/admin/affiliate-payouts")}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default AdminDashboard;