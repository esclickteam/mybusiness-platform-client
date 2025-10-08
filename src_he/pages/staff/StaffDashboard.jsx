import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ← Make sure the path is correct
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

  if (loading) return <div className="loading-screen">🔄 Loading data…</div>;

  return (
    <div className="staff-dashboard">
      <StaffTopBar />
      <h1 className="dashboard-title">📊 Staff Dashboard</h1>
      <p className="welcome-msg">Hello {user?.name || user?.email}</p>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>🕒 Time Worked Today</h3>
          <p>{stats.timeWorkedToday}</p>
        </div>
        <div className="stat-card">
          <h3>📞 Calls Made</h3>
          <p>{stats.totalCalls}</p>
        </div>
        <div className="stat-card">
          <h3>✔️ Calls Closed</h3>
          <p>{stats.callsClosed}</p>
        </div>
        <div className="stat-card">
          <h3>⏳ Pending Follow-ups</h3>
          <p>{stats.pendingFollowups}</p>
        </div>
        <div className="stat-card">
          <h3>📁 Back Office Tasks</h3>
          <p>{stats.backOfficeTasks}</p>
        </div>
      </div>

      <div className="dashboard-links">
        <Link to="/register" className="dashboard-link">➕ Add New Business Owner</Link>
        <Link to="/staff/tasks" className="dashboard-link">📋 Task Board</Link>
      </div>
    </div>
  );
}

export default StaffDashboard;
