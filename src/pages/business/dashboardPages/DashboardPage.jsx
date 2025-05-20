import React, { useEffect, useState, useRef } from "react";
import API from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import DashboardCards from "../../../components/DashboardCards";
import LineChart from "../../../components/dashboard/LineChart";
import StatsProgressBar from "../../../components/dashboard/StatsProgressBar";
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
import NotificationsPanel from "../../../components/dashboard/NotificationsPanel";
import DashboardNav from "../../../components/dashboard/DashboardNav";
import "../../../styles/dashboard.css";

// קומפוננטה ל-Quick Actions
const QuickActions = ({ onAction }) => (
  <div className="quick-actions-row">
    <button className="quick-action-btn" onClick={() => onAction("order")}>
      + הזמנה חדשה
    </button>
    <button className="quick-action-btn" onClick={() => onAction("meeting")}>
      + פגישה חדשה
    </button>
    <button className="quick-action-btn" onClick={() => onAction("message")}>
      + שלח הודעה
    </button>
  </div>
);

// קומפוננטת Alert קצרה
const DashboardAlert = ({ text, type = "info" }) => (
  <div className={`dashboard-alert dashboard-alert-${type}`}>{text}</div>
);

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UX state ל־alert מהיר
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
      if (!user) {
        setError("⚠️ יש להתחבר כדי לגשת לדף זה.");
        setLoading(false);
        return;
      }
      const businessUserId = user.businessId;
      if (!businessUserId) {
        setError("⚠️ מזהה העסק לא זוהה.");
        setLoading(false);
        return;
      }
      try {
        const response = await API.get(
          `/business/${businessUserId}/stats`,
          { withCredentials: true }
        );
        setStats(response.data);
      } catch (err) {
        console.error("❌ שגיאה בטעינת נתונים:", err);
        setError("❌ שגיאה בטעינת נתונים מהשרת");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  // פעולה מתוך quick actions (ניתן להרחיב)
  const handleQuickAction = (action) => {
    switch (action) {
      case "order":
        setAlert("מעבר ליצירת הזמנה חדשה (בהמשך - ייפתח דיאלוג/עמוד)");
        break;
      case "meeting":
        setAlert("מעבר להוספת פגישה חדשה (בהמשך - ייפתח דיאלוג/עמוד)");
        break;
      case "message":
        setAlert("מעבר לשליחת הודעה (בהמשך - ייפתח דיאלוג/עמוד)");
        break;
      default:
        break;
    }
    setTimeout(() => setAlert(null), 2500);
  };

  if (authLoading || loading) {
    return <p className="loading-text">⏳ טוען נתונים…</p>;
  }
  if (error) {
    return <p className="error-text">{error}</p>;
  }

  // דוגמה ל-alert: פגישות היום או יעד קרוב
  const hasTodayMeetings =
    stats && stats.todaysAppointments && stats.todaysAppointments.length > 0;
  const isGoalClose =
    stats &&
    stats.orders_count &&
    stats.orders_count >= 0.8 * (stats.orders_goal || 20);

  return (
    <div className="dashboard-container">
      <h2 className="business-dashboard-header">
        📊 דשבורד העסק
        <span className="greeting">
          {user?.businessName ? ` | שלום, ${user.businessName}!` : ""}
        </span>
      </h2>

      {/* Quick Actions */}
      <QuickActions onAction={handleQuickAction} />

      {/* Alert דינאמי (או מהיר) */}
      {alert && <DashboardAlert text={alert} type="info" />}
      {hasTodayMeetings && (
        <DashboardAlert
          text={`📅 יש לך ${stats.todaysAppointments.length} פגישות היום!`}
          type="warning"
        />
      )}
      {isGoalClose && (
        <DashboardAlert
          text={`🏆 אתה מתקרב ליעד ההזמנות! (${stats.orders_count} מתוך ${stats.orders_goal || 20})`}
          type="success"
        />
      )}

      <DashboardNav
        refs={{
          cardsRef,
          insightsRef,
          comparisonRef,
          chartsRef,
          leadsRef,
          appointmentsRef,
          calendarRef
        }}
      />

      {stats && <NotificationsPanel stats={stats} />}

      <div ref={cardsRef}>
        <DashboardCards stats={stats} />
      </div>
      <div ref={insightsRef}>
        <Insights stats={stats} />
      </div>
      <div ref={comparisonRef}>
        <BusinessComparison stats={stats} />
      </div>

      <NextActions stats={stats} />
      <StatsProgressBar
        value={stats.orders_count || 0}
        goal={stats.orders_goal || 20}
        label="התקדמות לקראת יעד ההזמנות החודשי"
      />

      <div ref={chartsRef} className="graph-row">
        <BarChart
          data={{
            labels: ["לקוחות", "בקשות", "הזמנות"],
            datasets: [
              {
                label: "נתוני העסק",
                data: [
                  stats.views_count   || 0,
                  stats.requests_count|| 0,
                  stats.orders_count  || 0,
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
              onDateClick={(date) => setSelectedDate(date)}
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
