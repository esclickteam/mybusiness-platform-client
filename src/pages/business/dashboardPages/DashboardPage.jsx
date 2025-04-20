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

const DashboardPage = () => {
  const auth = useAuth() || {};
  const user = auth.user;

  const devMode = true; // ✅ מאפשר גישה חופשית גם אם המשתמש לא מחובר

  const [stats, setStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = user || JSON.parse(localStorage.getItem("user") || "null");
  const isTestUser = currentUser?.email === "testasakim@example.com";

  const cardsRef = useRef(null);
  const insightsRef = useRef(null);
  const comparisonRef = useRef(null);
  const chartsRef = useRef(null);
  const leadsRef = useRef(null);
  const appointmentsRef = useRef(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser && !devMode) {
        setError("⚠️ יש להתחבר כדי לגשת לדף זה.");
        setLoading(false);
        return;
      }

      if (isTestUser) {
        setStats({
          mock: true,
          views_count: 88,
          requests_count: 14,
          orders_count: 6,
          reviews_count: 2,
          upcoming_appointments: 0,
          average_orders_in_field: 12,
          businessType: "קוסמטיקה",
          appointments: [
            { date: "2025-04-02T10:00", client: "נועה כהן", service: "עיסוי שוודי" },
            { date: "2025-04-03T16:30", client: "דני לוי", service: "ייעוץ תזונה" }
          ],
          weekly_labels: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"],
          weekly_views: [20, 40, 35, 60, 50, 70, 88],
          weekly_requests: [5, 6, 8, 7, 9, 10, 14],
          weekly_orders: [1, 2, 4, 5, 3, 5, 6],
          income_distribution: {
            "שירותים": 3200,
            "מכירה": 1800,
            "שיתופי פעולה": 950,
            "הכנסות אחרות": 400,
          },
          monthly_comparison: {
            months: ["ינואר", "פברואר", "מרץ", "אפריל"],
            thisYear: [4500, 5200, 4900, 6100],
            lastYear: [3800, 4600, 4700, 5800],
          },
          recent_activity: [
            { date: "2025-03-28", type: "הזמנה", details: "לקוח חדש רכש טיפול פנים" },
            { date: "2025-03-27", type: "פניה", details: "נשלחה בקשה לפגישה" },
            { date: "2025-03-25", type: "ביקורת", details: "התקבלה ביקורת ⭐⭐⭐⭐⭐" },
          ],
          leads: [
            { name: "נועה כהן", date: "2025-03-30", status: "ממתין למענה" },
            { name: "דני לוי", date: "2025-03-29", status: "בטיפול" },
          ]
        });
        setLoading(false);
        return;
      }

      try {
        const response = await API.get(`/api/businesses/stats/${currentUser?.businessId || "dev-id"}`);
        setStats(response.data);
      } catch (err) {
        console.error("שגיאה בטעינת נתונים:", err);
        setError("שגיאה בטעינת נתונים מהשרת");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  if (loading) return <p className="loading-text">⏳ טוען נתונים...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="dashboard-container">
      <h2 className="business-dashboard-header">📊 דשבורד העסק</h2>

      <DashboardNav refs={{ cardsRef, insightsRef, comparisonRef, chartsRef, leadsRef, appointmentsRef, calendarRef }} />
      {stats && <NotificationsPanel stats={stats} />}

      <div ref={cardsRef}>{stats && <DashboardCards stats={stats} />}</div>
      <div ref={insightsRef}>{stats && <Insights stats={stats} />}</div>
      <div ref={comparisonRef}>{stats && <BusinessComparison stats={stats} />}</div>
      {stats && <NextActions stats={stats} />}
      {stats && <StatsProgressBar value={stats.orders_count || 0} goal={20} label="התקדמות לקראת יעד ההזמנות החודשי" />}

      <div ref={chartsRef} className="graph-row">
        <BarChart data={{
          labels: ["לקוחות", "בקשות", "הזמנות"],
          datasets: [{
            label: "נתוני העסק",
            data: [stats?.views_count || 0, stats?.requests_count || 0, stats?.orders_count || 0],
            backgroundColor: ["#6a5acd", "#ffa07a", "#90ee90"],
            borderRadius: 8,
          }],
        }} options={{ responsive: true }} />
        {stats?.income_distribution && (
          <div className="graph-box">
            <PieChart data={stats.income_distribution} />
          </div>
        )}
      </div>

      <div className="graph-row">
        <div className="graph-box"><LineChart stats={stats} /></div>
        {stats?.monthly_comparison && (
          <div className="graph-box">
            <MonthlyComparisonChart data={stats.monthly_comparison} />
          </div>
        )}
      </div>

      <div className="graph-row equal-height">
        {stats?.recent_activity && (
          <div className="graph-box">
            <RecentActivityTable activities={stats.recent_activity} />
          </div>
        )}
        {stats?.appointments?.length > 0 && (
          <div className="graph-box appointments-box">
            <AppointmentsList appointments={stats.appointments} />
          </div>
        )}
      </div>

      <div ref={leadsRef} className="graph-row">
        <WeeklySummary stats={stats} />
        <OpenLeadsTable leads={stats.leads || []} />
      </div>

      {stats?.appointments?.length > 0 && (
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
