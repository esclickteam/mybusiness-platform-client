import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ← ודא שהנתיב נכון
import StaffTopBar from "./StaffTopBar";
import "./StaffDashboard.css";

function StaffDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.role !== "worker") {
      navigate("/");
    }
  }, [user, loading]);

  const stats = {
    timeWorkedToday: "04:32",
    totalCalls: 18,
    callsClosed: 7,
    pendingFollowups: 3,
    backOfficeTasks: 2,
  };

  if (loading) return <div className="loading-screen">🔄 טוען נתונים…</div>;

  return (
    <div className="staff-dashboard">
      <StaffTopBar />
      <h1 className="dashboard-title">📊 דשבורד עובדים</h1>
      <p className="welcome-msg">שלום {user?.name || user?.email}</p>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>🕒 זמן עבודה היום</h3>
          <p>{stats.timeWorkedToday}</p>
        </div>
        <div className="stat-card">
          <h3>📞 שיחות שבוצעו</h3>
          <p>{stats.totalCalls}</p>
        </div>
        <div className="stat-card">
          <h3>✔️ שיחות שנסגרו</h3>
          <p>{stats.callsClosed}</p>
        </div>
        <div className="stat-card">
          <h3>⏳ פניות בהמתנה</h3>
          <p>{stats.pendingFollowups}</p>
        </div>
        <div className="stat-card">
          <h3>📁 משימות בק אופיס</h3>
          <p>{stats.backOfficeTasks}</p>
        </div>
      </div>

      <div className="dashboard-links">
        <Link to="/register" className="dashboard-link">➕ הוסף בעל עסק חדש</Link>
        <Link to="/staff/tasks" className="dashboard-link">📋 לוח משימות</Link>
      </div>
    </div>
  );
}

export default StaffDashboard;
