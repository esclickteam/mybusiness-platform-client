import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import { createSocket } from "../../../socket";
import { getBusinessId } from "../../../utils/authHelpers";

import DashboardCards from "../../../components/DashboardCards";
import BarChart from "../../../components/dashboard/BarChart";
import RecentActivityTable from "../../../components/dashboard/RecentActivityTable";
import Insights from "../../../components/dashboard/Insights";
import NextActions from "../../../components/dashboard/NextActions";
import WeeklySummary from "../../../components/dashboard/WeeklySummary";
import AppointmentsList from "../../../components/dashboard/AppointmentsList";
import CalendarView from "../../../components/dashboard/CalendarView";
import DailyAgenda from "../../../components/dashboard/DailyAgenda";
import DashboardNav from "../../../components/dashboard/DashboardNav";

import "../../../styles/dashboard.css";

const QuickActions = ({ onAction }) => (
  <div className="quick-actions-row">
    <button className="quick-action-btn" onClick={() => onAction("meeting")}>
      + פגישה חדשה
    </button>
    <button className="quick-action-btn" onClick={() => onAction("message")}>
      + שלח הודעה
    </button>
  </div>
);

const DashboardAlert = ({ text, type = "info" }) => (
  <div className={`dashboard-alert dashboard-alert-${type}`}>{text}</div>
);

const LOCAL_STORAGE_KEY = "dashboardStats";

// פונקציית עזר למיזוג סטטיסטיקות - מתעלמת מסטטיסטיקות ריקות
function mergeStats(oldStats, newStats) {
  const isEmpty = Object.values(newStats).every(
    (val) => val === 0 || val === null || val === undefined
  );

  if (isEmpty) {
    return oldStats;
  }

  return { ...oldStats, ...newStats };
}

const DashboardPage = () => {
  const { user, initialized } = useAuth();
  const businessId = getBusinessId();
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            views_count: 0,
            requests_count: 0,
            orders_count: 0,
            reviews_count: 0,
            messages_count: 0,
            appointments_count: 0,
            todaysAppointments: [],
            income_distribution: null,
            monthly_comparison: null,
            recent_activity: null,
            appointments: [],
            leads: [],
            businessName: "",
          };
    } catch {
      return {
        views_count: 0,
        requests_count: 0,
        orders_count: 0,
        reviews_count: 0,
        messages_count: 0,
        appointments_count: 0,
        todaysAppointments: [],
        income_distribution: null,
        monthly_comparison: null,
        recent_activity: null,
        appointments: [],
        leads: [],
        businessName: "",
      };
    }
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(!stats || Object.keys(stats).length === 0);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  if (!initialized) {
    return <p className="loading-text">⏳ טוען נתונים…</p>;
  }
  if (user?.role !== "business" || !businessId) {
    return <p className="error-text">אין לך הרשאה לצפות בדשבורד העסק.</p>;
  }

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn("Failed to save dashboard stats to localStorage", e);
    }
  }, [stats]);

  useEffect(() => {
    if (!businessId) return;
    setLoading(true);
    console.log("Fetching stats from API for businessId:", businessId);
    API.get(`/business/${businessId}/stats`)
      .then((res) => {
        console.log("API stats response:", res.data);
        const data = res.data || {};
        const safeData = {
          views_count: data.views_count ?? 0,
          requests_count: data.requests_count ?? 0,
          orders_count: data.orders_count ?? 0,
          reviews_count: data.reviews_count ?? 0,
          messages_count: data.messages_count ?? 0,
          appointments_count: data.appointments_count ?? 0,
          todaysAppointments: Array.isArray(data.todaysAppointments)
            ? data.todaysAppointments
            : [],
          monthly_comparison: data.monthly_comparison ?? null,
          recent_activity: data.recent_activity ?? null,
          appointments: Array.isArray(data.appointments) ? data.appointments : [],
          leads: Array.isArray(data.leads) ? data.leads : [],
          businessName: data.businessName ?? "",
          income_distribution: data.income_distribution ?? null,
        };
        setStats(safeData);
      })
      .catch((err) => {
        console.error("❌ Error fetching stats:", err);
        setError("❌ שגיאה בטעינת נתונים מהשרת");
      })
      .finally(() => {
        setLoading(false);
        console.log("Finished loading API stats");
      });
  }, [businessId]);

  useEffect(() => {
    if (!initialized || !businessId) return;
    if (socketRef.current) return;

    async function setupSocket() {
      console.log("Setting up socket for businessId:", businessId);
      const sock = await createSocket({
        role: "business-dashboard",
        businessId,
      });
      if (!sock) {
        console.warn("Failed to create socket");
        return;
      }

      socketRef.current = sock;

      sock.on("connect", () => {
        console.log("Dashboard socket connected with ID:", sock.id);
      });

      sock.on("dashboardUpdate", (newStats) => {
        console.log("Dashboard update received:", newStats);
        if (newStats && typeof newStats === "object") {
          const cleanedStats = {};
          for (const key in newStats) {
            if (newStats[key] !== undefined) {
              cleanedStats[key] = newStats[key];
            }
          }
          setStats((prevStats) => {
            const merged = mergeStats(prevStats, cleanedStats);
            const isEqual = Object.keys(merged).every(
              (key) => merged[key] === prevStats[key]
            );
            if (isEqual) return prevStats;
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
            } catch (e) {
              console.warn("Failed to save dashboard stats to localStorage", e);
            }
            console.log("Merged stats:", merged);
            return merged;
          });
          console.log("Updated stats state with new dashboard data");
        } else {
          console.warn("Ignoring invalid dashboard update:", newStats);
        }
      });

      sock.on("disconnect", (reason) => {
        console.log("Dashboard socket disconnected, reason:", reason);
      });

      sock.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });
    }

    setupSocket();

    return () => {
      if (socketRef.current) {
        console.log("Disconnecting socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initialized, businessId]);

  if (loading) return <p className="loading-text">⏳ טוען נתונים…</p>;
  if (error) return <p className="error-text">{error}</p>;

  const todaysAppointments = Array.isArray(stats.todaysAppointments)
    ? stats.todaysAppointments
    : [];
  const appointments = Array.isArray(stats.appointments) ? stats.appointments : [];
  const hasTodayMeetings = todaysAppointments.length > 0;

  const handleQuickAction = (action) => {
    switch (action) {
      case "meeting":
        navigate(`/business/${businessId}/dashboard/appointments/new`);
        break;
      case "message":
        navigate(`/business/${businessId}/dashboard/messages/new`);
        break;
      default:
        console.warn("Unknown quick action:", action);
    }
  };

  const barChartData = [
    {
      name: "פגישות עתידיות",
      customers: stats.appointments_count,
      requests: 0,
      orders: 0,
    },
    {
      name: "פניות חדשות",
      customers: 0,
      requests: stats.requests_count,
      orders: 0,
    },
    {
      name: "הודעות מלקוחות",
      customers: 0,
      requests: 0,
      orders: stats.messages_count,
    },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="business-dashboard-header">
        📊 דשבורד העסק
        <span className="greeting">
          {user?.businessName ? ` | שלום, ${user.businessName}!` : ""}
        </span>
      </h2>

      <QuickActions onAction={handleQuickAction} />
      {alert && <DashboardAlert text={alert} type="info" />}
      {hasTodayMeetings && (
        <DashboardAlert
          text={`📅 יש לך ${todaysAppointments.length} פגישות היום!`}
          type="warning"
        />
      )}

      <DashboardNav
        refs={{
          cardsRef: null,
          insightsRef: null,
          comparisonRef: null,
          chartsRef: null,
          leadsRef: null,
          appointmentsRef: null,
          calendarRef: null,
        }}
      />

      <DashboardCards stats={stats} />

      <Insights stats={stats} />
      <NextActions stats={stats} />

      <div>
        <BarChart data={barChartData} />
      </div>

     <div>
  {stats.recent_activity && (
    <RecentActivityTable activities={stats.recent_activity} />
  )}
  {appointments.length > 0 && (
    <AppointmentsList appointments={appointments} />
  )}
</div>

<div>
  <WeeklySummary stats={stats} />
</div>

<div>
  <CalendarView appointments={appointments} onDateClick={setSelectedDate} />
  <DailyAgenda
    date={selectedDate}
    appointments={appointments}
    businessName={stats.businessName}
  />
</div>

    </div>
  );
};

export default DashboardPage;
