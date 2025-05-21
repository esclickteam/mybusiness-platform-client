// src/pages/business/dashboardPages/DashboardPage.jsx
import React, { useEffect, useState, useRef } from "react";
import API from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import DashboardCards from "../../../components/DashboardCards";
import Insights from "../../../components/dashboard/Insights";
import BusinessComparison from "../../../components/dashboard/BusinessComparison";
import NextActions from "../../../components/dashboard/NextActions";
import BarChart from "../../../components/dashboard/BarChart";
import PieChart from "../../../components/dashboard/PieChart";
import LineChart from "../../../components/dashboard/LineChart";
import MonthlyComparisonChart from "../../../components/dashboard/MonthlyComparisonChart";
import RecentActivityTable from "../../../components/dashboard/RecentActivityTable";
import OpenLeadsTable from "../../../components/dashboard/OpenLeadsTable";
import AppointmentsList from "../../../components/dashboard/AppointmentsList";
import CalendarView from "../../../components/dashboard/CalendarView";
import DailyAgenda from "../../../components/dashboard/DailyAgenda";
import DashboardNav from "../../../components/dashboard/DashboardNav";
import QuickActions from "../../../components/dashboard/QuickActions";
import DashboardAlert from "../../../components/dashboard/DashboardAlert";
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

  // טוען את הסטטיסטיקות הראשוניות
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.businessId) return;
      try {
        const res = await API.get(`/business/${user.businessId}/stats`, { withCredentials: true });
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

  // התחברות ל-SSE לעדכוני real-time
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

      {/* סטטיסטיקות ראשיות בזמן אמת */}
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
              {
                label: "פעילות העסק",
                data: [
                  stats.appointments_count || 0,
                  stats.requests_count   || 0,
                  stats.messages_count   || 0,
                ],
                borderRadius: 8,
              },
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
        <div className="graph-box">
          <LineChart stats={stats} />
        </div>
        {stats.monthly_comparison && (
          <div className="graph-box">
            <MonthlyComparisonChart data={stats.monthly_comparison} />
          </div>
        )}
      </div>

      <div className="graph-row equal-height">
        {stats.recent_activity && (
          <div className="graph-box">
            <RecentActivityTable activities={stats.recent_activity} />
          </div>
        )}
        {stats.appointments?.length > 0 && (
          <div className="graph-box appointments-box">
            <AppointmentsList appointments={stats.appointments} />
          </div>
        )}
      </div>

      <div ref={leadsRef} className="graph-row">
        <WeeklySummary stats={stats} />
        <OpenLeadsTable leads={stats.leads || []} />
      </div>

      {stats.appointments?.length > 0 && (
        <div ref={calendarRef} className="calendar-row">
          <div className="calendar-grid-box">
            <CalendarView
              appointments={stats.appointments}
              onDateClick={setSelectedDate}
            />
          </div>
          <div className="day-agenda-box">
            <DailyAgenda
              date={selectedDate}
              appointments={stats.appointments}
              businessName={stats.businessName}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;