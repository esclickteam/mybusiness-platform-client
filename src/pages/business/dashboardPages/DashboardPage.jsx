// src/pages/business/dashboardPages/DashboardPage.jsx
import React, { useEffect, useState, useRef } from "react";
import API from "../../../api";
import { useAuth } from "../../../context/AuthContext";
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
// QuickActions component for quick dashboard actions
const QuickActions = ({ onAction }) => (
  <div className="quick-actions-row">
    <button className="quick-action-btn" onClick={() => onAction("meeting")}>+ פגישה חדשה</button>
    <button className="quick-action-btn" onClick={() => onAction("message")}>+ שלח הודעה</button>
  </div>
);

// Alert component for dashboard messages
const DashboardAlert = ({ text, type = "info" }) => (
  <div className={`dashboard-alert dashboard-alert-${type}`}>{text}</div>
);
import "../../../styles/dashboard.css";

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  const cardsRef        = useRef(null);
  const insightsRef     = useRef(null);
  const comparisonRef   = useRef(null);
  const chartsRef       = useRef(null);
  const leadsRef        = useRef(null);
  const appointmentsRef = useRef(null);
  const calendarRef     = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.businessId) return;
      try {
        const res = await API.get(
          `/business/${user.businessId}/stats`,
          { withCredentials: true }
        );
        setStats(res.data);
      } catch (err) {
        console.error("❌ Error fetching stats:", err);
        setError("❌ שגיאה בטעינת נתונים מהשרת");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  useEffect(() => {
    if (!user?.businessId) return;
    const es = new EventSource(
      `${import.meta.env.VITE_API_URL}/updates/stream/${user.businessId}`,
      { withCredentials: true }
    );
    es.addEventListener("statsUpdate", (e) => {
      try {
        const payload = JSON.parse(e.data);
        setStats(payload.extra);
      } catch (err) {
        console.error("🚨 Error parsing SSE:", err);
      }
    });
    es.onerror = () => {
      console.error("🚨 SSE connection error, closing");
      es.close();
    };
    return () => es.close();
  }, [user]);

  const handleQuickAction = (action) => {
    let msg = null;
    if (action === "meeting") msg = "מעבר להוספת פגישה חדשה (דמו)";
    if (action === "message") msg = "מעבר לשליחת הודעה (דמו)";
    setAlert(msg);
    setTimeout(() => setAlert(null), 2500);
  };

  if (authLoading || loading) return <p className="loading-text">⏳ טוען נתונים…</p>;
  if (error) return <p className="error-text">{error}</p>;

  const todaysAppointments = stats.todaysAppointments || [];
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
        refs={{ cardsRef, insightsRef, comparisonRef, chartsRef, leadsRef, appointmentsRef, calendarRef }}
      />

      <div ref={cardsRef}>
        <DashboardCards
          stats={{
            views_count:        stats.views_count || 0,
            requests_count:     stats.requests_count || 0,
            orders_count:       stats.orders_count || 0,
            reviews_count:      stats.reviews_count || 0,
            messages_count:     stats.messages_count || 0,
            appointments_count: stats.appointments_count || 0,
          }}
        />
      </div>

      <div ref={insightsRef}>
        <Insights stats={stats} />
      </div>

      <div ref={comparisonRef}>
        <BusinessComparison stats={stats} />
      </div>

      <NextActions stats={stats} />

      <div ref={chartsRef} className="graph-row">
        <BarChart
          data={{
            labels: ["פגישות עתידיות", "פניות חדשות", "הודעות מלקוחות"],
            datasets: [
              { label: "פעילות העסק", data: [stats.appointments_count || 0, stats.requests_count || 0, stats.messages_count || 0], borderRadius: 8 }
            ],
          }}
          options={{ responsive: true }}
        />
        {stats.income_distribution && (
          <div className="graph-box">
            <PieChart data={stats.income_distribution} />
          </div>
        )}
      </div>

      <div className="graph-row">
        <LineChart stats={stats} />
        {stats.monthly_comparison && <MonthlyComparisonChart data={stats.monthly_comparison} />}
      </div>

      <div className="graph-row equal-height">
        {stats.recent_activity && <RecentActivityTable activities={stats.recent_activity} />}
        {stats.appointments?.length > 0 && <AppointmentsList appointments={stats.appointments} />}
      </div>

      <div ref={leadsRef} className="graph-row">
        <WeeklySummary stats={stats} />
        <OpenLeadsTable leads={stats.leads || []} />
      </div>

      {stats.appointments?.length > 0 && (
        <div ref={calendarRef} className="calendar-row">
          <CalendarView appointments={stats.appointments} onDateClick={setSelectedDate} />
          <DailyAgenda date={selectedDate} appointments={stats.appointments} businessName={stats.businessName} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
