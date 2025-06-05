import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import { createSocket } from "../../../socket";
import { getBusinessId } from "../../../utils/authHelpers";

import DashboardCards from "../../../components/DashboardCards";
import BarChart from "../../../components/dashboard/BarChart";
// import PieChart from "../../../components/dashboard/PieChart"; // הוסר
import MonthlyComparisonChart from "../../../components/dashboard/MonthlyComparisonChart";
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

const DashboardPage = () => {
  const { user, initialized } = useAuth();
  const businessId = getBusinessId();
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
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
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  if (!initialized) {
    return <p className="loading-text">⏳ טוען נתונים…</p>;
  }
  if (user?.role !== "business" || !businessId) {
    return <p className="error-text">אין לך הרשאה לצפות בדשבורד העסק.</p>;
  }

  useEffect(() => {
    if (!businessId) return;
    setLoading(true);
    API.get(`/business/${businessId}/stats`)
      .then(res => {
        console.log("API stats:", res.data);
        setStats(res.data);

        if (!res.data.monthly_comparison) {
          console.warn("Warning: monthly_comparison is missing or empty!");
        } else {
          console.log("monthly_comparison data:", res.data.monthly_comparison);
        }
      })
      .catch(err => {
        console.error("❌ Error fetching stats:", err);
        setError("❌ שגיאה בטעינת נתונים מהשרת");
      })
      .finally(() => setLoading(false));
  }, [businessId]);

  useEffect(() => {
    if (!initialized || !businessId) return;
    if (socketRef.current) return;

    async function setupSocket() {
      const sock = await createSocket({
        role: "business-dashboard",
        businessId,
      });
      if (!sock) return;

      socketRef.current = sock;

      sock.on("connect", () => {
        console.log("Dashboard socket connected:", sock.id);
      });

      sock.on("dashboardUpdate", newStats => {
        console.log("Dashboard update received:", newStats);
        if (newStats && typeof newStats === "object" && "views_count" in newStats) {
          setStats({ ...newStats });
        } else {
          console.warn("Ignoring invalid dashboard update:", newStats);
        }
      });

      sock.on("disconnect", reason => {
        console.log("Dashboard socket disconnected, reason:", reason);
      });

      sock.on("connect_error", err => {
        console.error("Socket connection error:", err);
      });
    }

    setupSocket();

    return () => {
      if (socketRef.current) {
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
  const appointments = Array.isArray(stats.appointments)
    ? stats.appointments
    : [];
  const hasTodayMeetings = todaysAppointments.length > 0;

  const handleQuickAction = action => {
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

      <DashboardCards
        stats={{
          views_count: stats.views_count,
          requests_count: stats.requests_count,
          orders_count: stats.orders_count,
          reviews_count: stats.reviews_count,
          messages_count: stats.messages_count,
          appointments_count: stats.appointments_count,
        }}
      />

      <Insights stats={stats} />
      <NextActions stats={stats} />

      <div>
        <BarChart data={barChartData} />
        {/* PieChart הוסר */}
      </div>

      <div>
        {stats.monthly_comparison ? (
          <MonthlyComparisonChart data={stats.monthly_comparison} />
        ) : (
          <p style={{ textAlign: "center", color: "gray" }}>
            אין נתוני השוואת הכנסות חודשית להצגה
          </p>
        )}
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

      {appointments.length > 0 && (
        <div>
          <CalendarView
            appointments={appointments}
            onDateClick={setSelectedDate}
          />
          <DailyAgenda
            date={selectedDate}
            appointments={appointments}
            businessName={stats.businessName}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
