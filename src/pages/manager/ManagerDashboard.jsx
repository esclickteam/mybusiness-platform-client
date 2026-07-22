import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Make sure the path is correct
import "./ManagerDashboard.css";
import BizuplyLoader from "../../components/ui/BizuplyLoader";

function ManagerDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.role !== "manager") {
      navigate("/"); // or /login
    }
  }, [user, loading]);

  const stats = {
    teamSize: 12,
    totalSales: 37920,
    totalCalls: 642,
    activePlans: 95,
    openTasks: 18,
    leadsToday: 7,
  };

  const teamStats = [
    { id: 1, name: "Roni", calls: 32, sales: 5, goals: 10, status: "Active" },
    { id: 2, name: "Shahar", calls: 18, sales: 2, goals: 7, status: "On Break" },
    { id: 3, name: "Ori", calls: 40, sales: 9, goals: 12, status: "Active" },
  ];

  if (loading) return <BizuplyLoader fullScreen label="Loading data..." />;

  return (
    <div className="manager-dashboard">
      <h1>👨‍💼 Welcome, {user?.name || user?.email || "Manager"}</h1>

      <div className="top-summary">
        <div className="summary-box">
          👥 Team Size: <strong>{stats.teamSize}</strong>
        </div>
        <div className="summary-box">
          💰 Total Sales This Month: <strong>{stats.totalSales} $</strong>
        </div>
        <div className="summary-box">
          📞 Calls Yesterday: <strong>{stats.totalCalls}</strong>
        </div>
        <div className="summary-box">
          📦 Active Plans: <strong>{stats.activePlans}</strong>
        </div>
        <div className="summary-box">
          📋 Open Tasks: <strong>{stats.openTasks}</strong>
        </div>
        <div className="summary-box">
          📥 Leads Today: <strong>{stats.leadsToday}</strong>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/admin/reviews" className="action-link">🗑️ Manage Reviews</Link>
        <Link to="/admin/block" className="action-link">🚫 Block Users</Link>
        <Link to="/admin/team" className="action-link">👥 Manage Staff</Link>
        <Link to="/admin/messages" className="action-link">📩 Internal Messages</Link>
        <Link to="/admin/permissions" className="action-link">🔐 Manage Permissions</Link>
        <Link to="/admin/knowledge" className="action-link">📚 Knowledge Base</Link>
        <Link to="/admin/leads" className="action-link">📈 Manage Leads</Link>
        <Link to="/admin/logs" className="action-link">🕐 Logs / Activity</Link>
      </div>

      <h2>My Team</h2>
      <table className="team-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Calls</th>
            <th>Sales</th>
            <th>Goal</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {teamStats.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.calls}</td>
              <td>{emp.sales}</td>
              <td>{emp.goals}</td>
              <td>{emp.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagerDashboard;