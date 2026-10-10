import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import AdminPageHeader from "./shell/AdminPageHeader";

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

const SHORTCUTS = [
  ["לקוחות", "חשבונות, חבילות ותשלום", "/admin/customers"],
  ["דמואים", "שליחת דמו אישי לליד", "/admin/guided-demos"],
  ["משתמשים", "צפייה, חסימה וכניסה לחשבון", "/admin/users"],
  ["הרשמה מוקדמת", "נרשמים מטופס ההשקה", "/admin/early-access"],
  ["שותפים", "אפיליאייטים ופרטנרים", "/admin/affiliates"],
  ["עסקים", "כניסה לפי הרשאות החבילה", "/admin/businesses"],
  ["תשלומי שותפים", "מעקב אחרי עמלות", "/admin/affiliate-payouts"],
  ["משיכות", "בדיקה ואישור בקשות", "/admin/withdrawals"],
] as const;

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

function MetricCard({
  title,
  value,
  note,
  alert = false,
}: {
  title: string;
  value: string;
  note: string;
  alert?: boolean;
}) {
  return (
    <article className={alert ? "biz-stat-card is-alert" : "biz-stat-card"}>
      <p>{title}</p>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
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
    <div>
      <AdminPageHeader
        title={`שלום, ${displayName}`}
        description="סקירה קצרה של משתמשים, עסקים, מכירות והרשמות."
        actions={
          <>
            <span className={connectedToServer ? "biz-status is-ok" : "biz-status"}>
              <i />
              {loadingStats
                ? "טוען נתונים"
                : connectedToServer
                  ? "מחובר לשרת"
                  : "אין חיבור לשרת"}
            </span>
            <button
              type="button"
              className="biz-btn"
              onClick={() => navigate("/admin/early-access")}
            >
              הרשמות מוקדמות
            </button>
          </>
        }
      />

      {statsError ? (
        <p className="mb-3 text-sm font-semibold text-amber-700">{statsError}</p>
      ) : null}

      <section className="biz-stat-grid">
        <MetricCard
          title="משתמשים"
          value={loadingStats ? "…" : formatNumber(stats.totalUsers)}
          note="כל המשתמשים הרשומים"
        />
        <MetricCard
          title="עסקים"
          value={loadingStats ? "…" : formatNumber(stats.totalBusinesses)}
          note="עסקים שנפתחו במערכת"
        />
        <MetricCard
          title="לקוחות ושותפים"
          value={loadingStats ? "…" : formatNumber(stats.totalClients)}
          note="לקוחות פעילים ורשומים"
        />
        <MetricCard
          title="הרשמות מוקדמות"
          value={loadingStats ? "…" : formatNumber(stats.earlyAccessCount)}
          note="נרשמים מטופס ההשקה"
        />
        <MetricCard
          title="סך מכירות"
          value={loadingStats ? "…" : formatMoney(stats.totalSales)}
          note="סה״כ הכנסות שנמדדו"
        />
        <MetricCard
          title="מנהלים פעילים"
          value={loadingStats ? "…" : formatNumber(stats.activeManagers)}
          note="מנהלי מערכת פעילים"
        />
        <MetricCard
          title="משתמשים חסומים"
          value={loadingStats ? "…" : formatNumber(stats.blockedUsers)}
          note="חשבונות שנחסמו"
          alert
        />
      </section>

      <h2 className="biz-section-title">קיצורי דרך</h2>
      <section className="biz-shortcut-grid">
        {SHORTCUTS.map(([title, description, path]) => (
          <button
            key={path}
            type="button"
            className="biz-shortcut"
            onClick={() => navigate(path)}
          >
            <strong>{title}</strong>
            <small>{description}</small>
          </button>
        ))}
      </section>

      <footer className="biz-admin-footer">
        <nav>
          <a href="/support">מרכז עזרה</a>
          <a href="/privacy-policy">מדיניות פרטיות</a>
          <a href="/terms">תנאי שימוש</a>
        </nav>
        <p>© {new Date().getFullYear()} Bizuply</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;
