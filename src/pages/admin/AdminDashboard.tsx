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
  accent?: "purple" | "green" | "yellow" | "red" | "blue";
};

function MetricCard({
  title,
  value,
  icon,
  note,
  accent = "purple",
}: MetricCardProps) {
  const accentClasses = {
    purple: "bg-purple-50 text-purple-700 ring-purple-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    yellow: "bg-amber-50 text-amber-700 ring-amber-100",
    red: "bg-rose-50 text-rose-700 ring-rose-100",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
  };

  return (
    <div
      dir="rtl"
      className="rounded-2xl border border-slate-200 bg-white p-5 text-right shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex flex-row items-start justify-between gap-4">
        <div className="min-w-0 flex-1 text-right">
          <p className="text-right text-sm font-bold text-slate-500">{title}</p>

          <strong className="mt-3 block text-right text-3xl font-black tracking-tight text-slate-950">
            {value}
          </strong>

          <p className="mt-2 text-right text-xs font-semibold text-slate-400">
            {note}
          </p>
        </div>

        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl ring-1 ${accentClasses[accent]}`}
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
      className={`group flex w-full flex-row items-center gap-4 rounded-2xl border p-5 text-right shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        primary
          ? "border-purple-200 bg-purple-700 text-white"
          : "border-slate-200 bg-white text-slate-950"
      }`}
    >
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl ${
          primary ? "bg-white/15" : "bg-slate-50"
        }`}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1 text-right">
        <strong className="block text-right text-base font-black">
          {title}
        </strong>

        <small
          className={`mt-1 block text-right text-sm font-semibold leading-6 ${
            primary ? "text-white/75" : "text-slate-500"
          }`}
        >
          {description}
        </small>
      </span>

      <span
        className={`text-xl font-black transition group-hover:-translate-x-1 ${
          primary ? "text-white/80" : "text-purple-600"
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
        className="min-h-screen bg-slate-50 px-4 py-6 text-right text-slate-950 md:px-8"
      >
        <section dir="rtl" className="mx-auto max-w-[1380px] text-right">
          <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 text-right lg:flex-row lg:items-end">
            <div className="text-right">
              <div className="mb-3 flex flex-wrap justify-start gap-2 text-right">
                <span className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-black text-purple-700 ring-1 ring-purple-100">
                  פאנל אדמין
                </span>

                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
                  {todayLabel}
                </span>

                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
                  נתונים מקומיים ללא שרת
                </span>
              </div>

              <h1 className="text-right text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                שלום, {displayName}
              </h1>

              <p className="mt-2 max-w-2xl text-right text-sm font-semibold leading-7 text-slate-500">
                סקירה מהירה של המשתמשים, העסקים, המכירות וההרשמות המוקדמות במערכת.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/admin/early-access")}
                className="rounded-xl bg-purple-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-purple-800"
              >
                הרשמות מוקדמות
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                ניהול משתמשים
              </button>
            </div>
          </div>

          <div className="grid gap-4 text-right md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="משתמשים במערכת"
              value={formatNumber(stats.totalUsers)}
              icon="👥"
              note="כל המשתמשים הרשומים"
              accent="purple"
            />

            <MetricCard
              title="עסקים רשומים"
              value={formatNumber(stats.totalBusinesses)}
              icon="🏢"
              note="עסקים שנפתחו במערכת"
              accent="blue"
            />

            <MetricCard
              title="לקוחות רשומים"
              value={formatNumber(stats.totalClients)}
              icon="🧑‍🤝‍🧑"
              note="לקוחות פעילים ורשומים"
              accent="green"
            />

            <MetricCard
              title="הרשמות מוקדמות"
              value={formatNumber(earlyAccessCount)}
              icon="✨"
              note="נרשמים מטופס ההשקה"
              accent="yellow"
            />

            <MetricCard
              title="סך מכירות"
              value={formatMoney(stats.totalSales)}
              icon="💰"
              note="סה״כ הכנסות שנמדדו"
              accent="yellow"
            />

            <MetricCard
              title="מנהלים פעילים"
              value={formatNumber(stats.activeManagers)}
              icon="🧑‍💼"
              note="מנהלי מערכת פעילים"
              accent="purple"
            />

            <MetricCard
              title="משתמשים חסומים"
              value={formatNumber(stats.blockedUsers)}
              icon="🚫"
              note="חשבונות שנחסמו"
              accent="red"
            />
          </div>

          <div className="mt-9 grid gap-6 text-right xl:grid-cols-[1fr_360px]">
            <section className="text-right">
              <div className="mb-4 flex items-end justify-between gap-4 text-right">
                <div className="text-right">
                  <h2 className="text-right text-xl font-black text-slate-950">
                    פעולות מהירות
                  </h2>

                  <p className="mt-1 text-right text-sm font-semibold text-slate-500">
                    מעבר מהיר לאזורים החשובים של הפאנל.
                  </p>
                </div>
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

            <aside className="rounded-2xl border border-slate-200 bg-white p-5 text-right shadow-sm">
              <h2 className="text-right text-lg font-black text-slate-950">
                סטטוס מערכת
              </h2>

              <div className="mt-5 space-y-4 text-right">
                <div className="flex flex-row items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 text-right">
                  <span className="text-right text-sm font-bold text-slate-500">
                    מקור נתונים
                  </span>
                  <strong className="text-right text-sm font-black text-slate-950">
                    מקומי
                  </strong>
                </div>

                <div className="flex flex-row items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 text-right">
                  <span className="text-right text-sm font-bold text-slate-500">
                    שרת
                  </span>
                  <strong className="text-right text-sm font-black text-amber-700">
                    עדיין לא מחובר
                  </strong>
                </div>

                <div className="flex flex-row items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 text-right">
                  <span className="text-right text-sm font-bold text-slate-500">
                    הרשמות
                  </span>
                  <strong className="text-right text-sm font-black text-purple-700">
                    {formatNumber(earlyAccessCount)}
                  </strong>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50 p-4 text-right">
                <p className="text-right text-sm font-bold leading-7 text-purple-900">
                  כרגע הרשמות מוקדמות נשמרות מקומית בדפדפן. ברגע שתחברי שרת,
                  אותו אזור יוכל למשוך את הרשומות מה־API בלי לשנות את כל העיצוב.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}

export default AdminDashboard;