import React from "react";
import "./AdminDashboard.css";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const stats = {
    totalUsers: 980,
    totalBusinesses: 245,
    totalPlans: 8,
    totalSales: 58920,
    activeManagers: 6,
    blockedUsers: 17
  };

  return (
    <div className="admin-dashboard">
      <h1>👑 דשבורד אדמין ראשי</h1>

      <div className="admin-summary">
        <div className="summary-card">👥 משתמשים במערכת: <strong>{stats.totalUsers}</strong></div>
        <div className="summary-card">🏢 עסקים רשומים: <strong>{stats.totalBusinesses}</strong></div>
        <div className="summary-card">📦 חבילות פעילות: <strong>{stats.totalPlans}</strong></div>
        <div className="summary-card">💰 סה"כ מכירות: <strong>{stats.totalSales} ₪</strong></div>
        <div className="summary-card">🧑‍💼 מנהלים פעילים: <strong>{stats.activeManagers}</strong></div>
        <div className="summary-card">🚫 משתמשים חסומים: <strong>{stats.blockedUsers}</strong></div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/roles" className="admin-link">🔐 ניהול תפקידים והרשאות</Link>
        <Link to="/admin/site-edit" className="admin-link">🖊️ עריכת תוכן האתר</Link>
        <Link to="/admin/plans" className="admin-link">📦 ניהול חבילות</Link>
        <Link to="/admin/users" className="admin-link">👥 ניהול משתמשים</Link>
        <Link to="/admin/logs" className="admin-link">🕐 פעולות מערכת (לוגים)</Link>
        <Link to="/admin/settings" className="admin-link">⚙️ הגדרות כלליות</Link>
        <Link to="/reset-password" className="admin-link">🔒 שינוי סיסמה</Link> {/* ← הוספנו כאן */}
        <Link to="/admin/affiliate-payouts" className="admin-link">💸 דו"ח תשלומים לשותפים</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
