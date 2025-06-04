import React, { useEffect, useState, useRef } from "react";
import API from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import { createSocket } from "../../../socket";
import { getBusinessId } from "../../../utils/authHelpers";

import DashboardCards from "../../../components/DashboardCards";
import LineChart from "../../../components/dashboard/LineChart";
import PieChart from "../../../components/dashboard/PieChart";
import MonthlyComparisonChart from "../../../components/dashboard/MonthlyComparisonChart";
import RecentActivityTable from "../../../components/dashboard/RecentActivityTable";
import BarChart from "../../../components/dashboard/BarChart";
import Insights from "../../../components/dashboard/Insights";
import NextActions from "../../../components/dashboard/NextActions";
import WeeklySummary from "../../../components/dashboard/WeeklySummary";
import OpenLeadsTable from "../../../components/dashboard/OpenLeadsTable";
import AppointmentsList from "../../../components/dashboard/AppointmentsList";
import CalendarView from "../../../components/dashboard/CalendarView";
import DailyAgenda from "../../../components/dashboard/DailyAgenda";
import BusinessComparison from "../../../components/dashboard/BusinessComparison";
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

  // ברגע שהעמוד נטען, נבצע קודם קריאה ל־"profile" כדי לעלות views_count,
  // ואחר כך נבצע קריאה ל־"stats" כדי להביא את שאר השדות.
  useEffect(() => {
    if (!businessId) return;

    setLoading(true);
    setError(null);

    // 1) קריאה ל־/business/:id/profile – מעלה את views_count ומחזירה את כל אובייקט ה-Business המעודכן.
    API.get(`/business/${businessId}/profile`)
      .then(res => {
        // res.data = האובייקט המלא של העסק לאחר $inc על views_count
        const biz = res.data;
        setStats(prev => ({
          ...prev,
          views_count: biz.views_count,
          businessName: biz.businessName || prev.businessName
        }));
        // 2) לאחר שהצלחנו לעלות views_count, נבצע קריאה ל־stats כדי למשוך את שאר השדות
        return API.get(`/business/${businessId}/stats`);
      })
      .then(res => {
        // res.data.stats = אובייקט שמכיל את כל המפתחות: orders_count, requests_count, וכו'
        const s = res.data.stats;
        setStats(prev => ({
          ...prev,
          requests_count:       s.requests_count       ?? prev.requests_count,
          orders_count:         s.orders_count         ?? prev.orders_count,
          reviews_count:        s.reviews_count        ?? prev.reviews_count,
          messages_count:       s.messages_count       ?? prev.messages_count,
          appointments_count:   s.appointments_count   ?? prev.appointments_count,
          // אם יש שדות נוספים ב-stats (כמו todaysAppointments וכו'), נוסיף גם אותם כאן
          todaysAppointments:   s.todaysAppointments   ?? prev.todaysAppointments,
          income_distribution:  s.income_distribution  ?? prev.income_distribution,
          monthly_comparison:   s.monthly_comparison   ?? prev.monthly_comparison,
          recent_activity:      s.recent_activity      ?? prev.recent_activity,
          appointments:         s.appointments         ?? prev.appointments,
          leads:                s.open_leads_count !== undefined 
                                ? prev.leads // אם השדה open_leads_count קיים, אפשר לשמור אותו בנפרד
                                : prev.leads
        }));
      })
      .catch(err => {
        console.error("❌ Error fetching profile or stats:", err);
        setError("❌ שגיאה בטעינת נתונים מהשרת");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [businessId]);

  // התחברות ל־Socket.IO כדי לקבל עדכונים בזמן אמת
  useEffect(() => {
    if (!initialized || !businessId) return;

    async function setupSocket() {
      // יוצרים חיבור socket עם role + businessId
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
        // newStats מכיל את כל השדות ש־getBusinessStats מחזירה:
        setStats(prev => ({
          ...prev,
          views_count:       newStats.views_count,
          requests_count:    newStats.requests_count,
          orders_count:      newStats.orders_count,
          reviews_count:     newStats.reviews_count,
          messages_count:    newStats.messages_count,
          appointments_count: newStats.appointments_count,
          leads:             newStats.open_leads_count ?? prev.leads,
        }));
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
        console.log("Disconnecting dashboard socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initialized, businessId]);

  const handleQuickAction = action => {
    let msg = null;
    if (action === "meeting") msg = "מעבר להוספת פגישה חדשה (דמו)";
    if (action === "message") msg = "מעבר לשליחת הודעה (דמו)";
    setAlert(msg);
    setTimeout(() => setAlert(null), 2500);
  };

  if (loading) return <p className="loading-text">⏳ טוען נתונים…</p>;
  if (error) return <p className="error-text">{error}</p>;

  const todaysAppointments = Array.isArray(stats.todaysAppointments)
    ? stats.todaysAppointments
    : [];
  const appointments = Array.isArray(stats.appointments)
    ? stats.appointments
    : [];
  const hasTodayMeetings = todaysAppointments.length > 0;

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
          views_count:       stats.views_count,
          requests_count:    stats.requests_count,
          orders_count:      stats.orders_count,
          reviews_count:     stats.reviews_count,
          messages_count:    stats.messages_count,
          appointments_count: stats.appointments_count,
        }}
      />

      <Insights stats={stats} />
      <BusinessComparison stats={stats} />
      <NextActions stats={stats} />

      <div>
        <BarChart
          data={{
            labels: ["פגישות עתידיות", "פניות חדשות", "הודעות מלקוחות"],
            datasets: [
              {
                label: "פעילות העסק",
                data: [
                  stats.appointments_count,
                  stats.requests_count,
                  stats.messages_count,
                ],
                borderRadius: 8,
              },
            ],
          }}
          options={{ responsive: true }}
        />
        {stats.income_distribution && (
          <PieChart data={stats.income_distribution} />
        )}
      </div>

      <div>
        <LineChart stats={stats} />
        {stats.monthly_comparison && (
          <MonthlyComparisonChart data={stats.monthly_comparison} />
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
        <OpenLeadsTable leads={stats.leads} />
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
