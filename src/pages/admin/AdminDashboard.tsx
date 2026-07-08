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
    purple: {
      wrap: "from-purple-600/18 to-fuchsia-500/8 border-purple-400/20",
      icon: "bg-purple-500/20 text-purple-100 ring-purple-300/20",
      glow: "bg-purple-500/20",
    },
    gold: {
      wrap: "from-amber-500/20 to-yellow-400/8 border-amber-300/25",
      icon: "bg-amber-400/20 text-amber-100 ring-amber-300/25",
      glow: "bg-amber-400/20",
    },
    green: {
      wrap: "from-emerald-500/18 to-teal-400/8 border-emerald-300/20",
      icon: "bg-emerald-400/20 text-emerald-100 ring-emerald-300/20",
      glow: "bg-emerald-400/20",
    },
    blue: {
      wrap: "from-sky-500/18 to-blue-400/8 border-sky-300/20",
      icon: "bg-sky-400/20 text-sky-100 ring-sky-300/20",
      glow: "bg-sky-400/20",
    },
    red: {
      wrap: "from-rose-500/18 to-red-400/8 border-rose-300/20",
      icon: "bg-rose-400/20 text-rose-100 ring-rose-300/20",
      glow: "bg-rose-400/20",
    },
  };

  return (
    <div
      dir="rtl"
      className={`relative overflow-hidden rounded-[28px] border bg-gradient-to-br ${tones[tone].wrap} p-5 text-right shadow-2xl shadow-black/20 backdrop-blur`}
    >
      <div
        className={`pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full blur-3xl ${tones[tone].glow}`}
      />

      <div className="relative z-10 flex flex-row items-start justify-between gap-4">
        <div className="min-w-0 flex-1 text-right">
          <p className="text-right text-sm font-black text-white/62">{title}</p>

          <strong className="mt-3 block text-right text-4xl font-black tracking-tight text-white">
            {value}
          </strong>

          <p className="mt-2 text-right text-xs font-bold text-white/42">
            {note}
          </p>
        </div>

        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl ring-1 ${tones[tone].icon}`}
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
      className={`group flex w-full flex-row items-center gap-4 rounded-[26px] border p-5 text-right shadow-2xl shadow-black/20 transition hover:-translate-y-1 ${
        primary
          ? "border-purple-300/30 bg-gradient-to-l from-purple-600 to-fuchsia-700 text-white"
          : "border-white/10 bg-white/[0.07] text-white hover:bg-white/[0.1]"
      }`}
    >
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl ${
          primary ? "bg-white/18" : "bg-white/10"
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
            primary ? "text-white/78" : "text-white/48"
          }`}
        >
          {description}
        </small>
      </span>

      <span className="text-xl font-black text-white/75 transition group-hover:-translate-x-1">
        ←
      </span>
    </button>
  );
}

function StatusRow({
  label,
  value,
  color = "text-white",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-right">
      <span className="text-right text-sm font-bold text-white/52">{label}</span>
      <strong className={`text-right text-sm font-black ${color}`}>{value}</strong>
    </div>
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
        className="min-h-screen bg-[#12071f] bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.28),transparent_34%),radial-gradient(circle_at_15%_15%,rgba(217,70,239,0.18),transparent_32%),linear-gradient(180deg,#180a2d_0%,#10061d_45%,#0b0714_100%)] px-4 py-7 text-right text-white md:px-8"
      >
        <section dir="rtl" className="mx-auto max-w-[1480px] text-right">
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-8">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative z-10 flex flex-col justify-between gap-7 xl:flex-row xl:items-end">
              <div className="max-w-4xl text-right">
                <div className="mb-4 flex flex-wrap justify-start gap-2 text-right">
                  <span className="rounded-full bg-purple-500/18 px-4 py-2 text-xs font-black text-purple-100 ring-1 ring-purple-300/20">
                    פאנל אדמין
                  </span>

                  <span className="rounded-full bg-white/8 px-4 py-2 text-xs font-bold text-white/60 ring-1 ring-white/10">
                    {todayLabel}
                  </span>

                  <span className="rounded-full bg-amber-400/12 px-4 py-2 text-xs font-bold text-amber-100 ring-1 ring-amber-300/20">
                    נתונים מקומיים ללא שרת
                  </span>
                </div>

                <h1 className="text-right text-4xl font-black tracking-tight text-white md:text-6xl">
                  שלום, {displayName}
                </h1>

                <p className="mt-4 max-w-3xl text-right text-base font-bold leading-8 text-white/55 md:text-lg">
                  סקירה מהירה של משתמשים, עסקים, מכירות, שותפים והרשמות מוקדמות.
                  פאנל ניהול ברור, כהה ומקצועי עם ניגודיות גבוהה.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:w-[390px] xl:grid-cols-1">
                <button
                  type="button"
                  onClick={() => navigate("/admin/early-access")}
                  className="rounded-2xl bg-gradient-to-l from-purple-500 to-fuchsia-600 px-6 py-4 text-sm font-black text-white shadow-2xl shadow-purple-950/40 transition hover:-translate-y-1"
                >
                  צפייה בהרשמות מוקדמות
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
                  className="rounded-2xl border border-white/12 bg-white/10 px-6 py-4 text-sm font-black text-white shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:bg-white/14"
                >
                  ניהול משתמשים
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4 text-right">
              <h2 className="text-right text-2xl font-black text-white">
                סקירת מערכת
              </h2>

              <p className="mt-1 text-right text-sm font-bold text-white/45">
                נתונים מרכזיים מכל אזורי המערכת.
              </p>
            </div>

            <div className="grid gap-4 text-right md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="משתמשים במערכת"
                value={formatNumber(stats.totalUsers)}
                icon="👥"
                note="כל המשתמשים הרשומים"
                tone="purple"
              />

              <MetricCard
                title="עסקים רשומים"
                value={formatNumber(stats.totalBusinesses)}
                icon="🏢"
                note="עסקים שנפתחו במערכת"
                tone="blue"
              />

              <MetricCard
                title="לקוחות רשומים"
                value={formatNumber(stats.totalClients)}
                icon="🧑‍🤝‍🧑"
                note="לקוחות פעילים ורשומים"
                tone="green"
              />

              <MetricCard
                title="הרשמות מוקדמות"
                value={formatNumber(earlyAccessCount)}
                icon="✨"
                note="נרשמים מטופס ההשקה"
                tone="gold"
              />

              <MetricCard
                title="סך מכירות"
                value={formatMoney(stats.totalSales)}
                icon="💰"
                note="סה״כ הכנסות שנמדדו"
                tone="gold"
              />

              <MetricCard
                title="מנהלים פעילים"
                value={formatNumber(stats.activeManagers)}
                icon="🧑‍💼"
                note="מנהלי מערכת פעילים"
                tone="purple"
              />

              <MetricCard
                title="משתמשים חסומים"
                value={formatNumber(stats.blockedUsers)}
                icon="🚫"
                note="חשבונות שנחסמו"
                tone="red"
              />
            </div>
          </div>

          <div className="mt-10 grid gap-6 text-right xl:grid-cols-[1fr_420px]">
            <section className="text-right">
              <div className="mb-4 text-right">
                <h2 className="text-right text-2xl font-black text-white">
                  פעולות מהירות
                </h2>

                <p className="mt-1 text-right text-sm font-bold text-white/45">
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

            <aside className="rounded-[30px] border border-white/10 bg-white/[0.07] p-5 text-right shadow-2xl shadow-black/25 backdrop-blur-xl">
              <h2 className="text-right text-xl font-black text-white">
                סטטוס מערכת
              </h2>

              <p className="mt-1 text-right text-sm font-bold text-white/42">
                מצב החיבורים והמידע בפאנל.
              </p>

              <div className="mt-5 space-y-3 text-right">
                <StatusRow label="מקור נתונים" value="מקומי" />
                <StatusRow
                  label="שרת"
                  value="עדיין לא מחובר"
                  color="text-amber-200"
                />
                <StatusRow
                  label="הרשמות"
                  value={formatNumber(earlyAccessCount)}
                  color="text-purple-200"
                />
              </div>

              <div className="mt-5 rounded-2xl border border-purple-300/20 bg-purple-500/12 p-4 text-right">
                <p className="text-right text-sm font-bold leading-7 text-purple-100/85">
                  כרגע הרשמות מוקדמות נשמרות מקומית בדפדפן. כשיחובר שרת,
                  אותו אזור יוכל למשוך נתונים מ־API בלי לשבור את העיצוב.
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