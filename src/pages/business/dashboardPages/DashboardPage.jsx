import React, { useEffect, useState } from "react";
import API from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import useDashboardSocket from "../../../hooks/useDashboardSocket";

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
  const businessId = user?.businessId; // הנחה ש-businessId נמצא ב-user
  const token = user?.token;

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

  // החיבור ל-socket דרך ההוק שלך
  const socketStats = useDashboardSocket({ token, businessId });

  // קריאת נתונים ראשונית – מעלה views_count ומביא סטטיסטיקות נוספות
  useEffect(() => {
    if (!businessId) return;

    setLoading(true);
    setError(null);

    API.get(`/business/${businessId}/profile`)
      .then((res) => {
        const biz = res.data;
        setStats((prev) => ({
          ...prev,
          views_count: biz.views_count,
          businessName: biz.businessName || prev.businessName,
        }));
        return API.get(`/business/${businessId}/stats`);
      })
      .then((res) => {
        const s = res.data.stats;
        setStats((prev) => ({
          ...prev,
          requests_count: s.requests_count ?? prev.requests_count,
          orders_count: s.orders_count ?? prev.orders_count,
          reviews_count: s.reviews_count ?? prev.reviews_count,
          messages_count: s.messages_count ?? prev.messages_count,
          appointments_count: s.appointments_count ?? prev.appointments_count,
          todaysAppointments: s.todaysAppointments ?? prev.todaysAppointments,
          income_distribution: s.income_distribution ?? prev.income_distribution,
          monthly_comparison: s.monthly_comparison ?? prev.monthly_comparison,
          recent_activity: s.recent_activity ?? prev.recent_activity,
          appointments: s.appointments ?? prev.appointments,
          leads: s.open_leads_count !== undefined ? prev.leads : prev.leads,
        }));
      })
      .catch((err) => {
        console.error("❌ Error fetching profile or stats:", err);
        setError("❌ שגיאה בטעינת נתונים מהשרת");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [businessId]);

  // עדכון סטטיסטיקות בזמן אמת מה-socket (משולב עם הנתונים הראשוניים)
  useEffect(() => {
    if (!socketStats) return;

    setStats((prev) => ({
      ...prev,
      views_count: socketStats.views_count ?? prev.views_count,
      requests_count: socketStats.requests_count ?? prev.requests_count,
      orders_count: socketStats.orders_count ?? prev.orders_count,
      reviews_count: socketStats.reviews_count ?? prev.reviews_count,
      messages_count: socketStats.messages_count ?? prev.messages_count,
      appointments_count: socketStats.appointments_count ?? prev.appointments_count,
      leads: socketStats.open_leads_count ?? prev.leads,
    }));
  }, [socketStats]);

  const handleQuickAction = (action) => {
    let msg = null;
    if (action === "meeting") msg = "מעבר להוספת פגישה חדשה (דמו)";
    if (action === "message") msg = "מעבר לשליחת הודעה (דמו)";
    setAlert(msg);
    setTimeout(() => setAlert(null), 2500);
  };

  if (!initialized) return <p className="loading-text">⏳ טוען נתונים…</p>;
  if (user?.role !== "business" || !businessId)
    return <p className="error-text">אין לך הרשאה לצפות בדשבורד העסק.</p>;
  if (loading) return <p className="loading-text">⏳ טוען נתונים…</p>;
  if (error) return <p className="error-text">{error}</p>;

  const todaysAppointments = Array.isArray(stats.todaysAppointments)
    ? stats.todaysAppointments
    : [];
  const appointments = Array.isArray(stats.appointments) ? stats.appointments : [];
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
          views_count: stats.views_count,
          requests_count: stats.requests_count,
          orders_count: stats.orders_count,
          reviews_count: stats.reviews_count,
          messages_count: stats.messages_count,
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
        {stats.income_distribution && <PieChart data={stats.income_distribution} />}
      </div>

      <div>
        <LineChart stats={stats} />
        {stats.monthly_comparison && (
          <MonthlyComparisonChart data={stats.monthly_comparison} />
        )}
      </div>

      <div>
        {stats.recent_activity && <RecentActivityTable activities={stats.recent_activity} />}
        {appointments.length > 0 && <AppointmentsList appointments={appointments} />}
      </div>

      <div>
        <WeeklySummary stats={stats} />
        <OpenLeadsTable leads={stats.leads} />
      </div>

      {appointments.length > 0 && (
        <div>
          <CalendarView appointments={appointments} onDateClick={setSelectedDate} />
          <DailyAgenda date={selectedDate} appointments={appointments} businessName={stats.businessName} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
