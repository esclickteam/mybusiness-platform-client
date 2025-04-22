import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ודא שהנתיב נכון
import "./ManagerDashboard.css";

function ManagerDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.role !== "manager") {
      navigate("/"); // או /login
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
    { id: 1, name: "רוני", calls: 32, sales: 5, goals: 10, status: "פעיל" },
    { id: 2, name: "שחר", calls: 18, sales: 2, goals: 7, status: "בהפסקה" },
    { id: 3, name: "אורי", calls: 40, sales: 9, goals: 12, status: "פעיל" },
  ];

  if (loading) return <div className="loading-screen">🔄 טוען נתונים…</div>;

  return (
    <div className="manager-dashboard">
      <h1>👨‍💼 ברוך הבא, {user?.name || user?.email || "מנהל"}</h1>

      <div className="top-summary">
        <div className="summary-box">👥 גודל צוות: <strong>{stats.teamSize}</strong></div>
        <div className="summary-box">💰 סה"כ מכירות החודש: <strong>{stats.totalSales} ₪</strong></div>
        <div className="summary-box">📞 שיחות אתמול: <strong>{stats.totalCalls}</strong></div>
        <div className="summary-box">📦 חבילות פעילות: <strong>{stats.activePlans}</strong></div>
        <div className="summary-box">📋 משימות פתוחות: <strong>{stats.openTasks}</strong></div>
        <div className="summary-box">📥 לידים היום: <strong>{stats.leadsToday}</strong></div>
      </div>

      <div className="dashboard-actions">
        <Link to="/admin/reviews" className="action-link">🗑️ ניהול ביקורות</Link>
        <Link to="/admin/block" className="action-link">🚫 חסימת משתמשים</Link>
        <Link to="/admin/team" className="action-link">👥 ניהול עובדים</Link>
        <Link to="/admin/messages" className="action-link">📩 הודעות פנימיות</Link>
        <Link to="/admin/permissions" className="action-link">🔐 ניהול הרשאות</Link>
        <Link to="/admin/knowledge" className="action-link">📚 מאגר ידע</Link>
        <Link to="/admin/leads" className="action-link">📈 ניהול לידים</Link>
        <Link to="/admin/logs" className="action-link">🕐 לוגים / פעולות</Link>
      </div>

      <h2>צוות שלי</h2>
      <table className="team-table">
        <thead>
          <tr>
            <th>שם עובד</th>
            <th>שיחות</th>
            <th>מכירות</th>
            <th>יעד</th>
            <th>סטטוס</th>
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
