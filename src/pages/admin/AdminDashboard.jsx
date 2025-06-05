import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../../context/AuthContext";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    totalPlans: 0,
    totalSales: 0,
    activeManagers: 0,
    blockedUsers: 0,
  });

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || !user.token) return;

    // התחברות ל-Socket.IO עם auth מתאים לתפקיד admin
    socketRef.current = io("https://api.esclick.co.il", {
      path: "/socket.io",
      auth: {
        token: user.token,   // Access token JWT
        role: "admin",       // תפקיד אדמין
      },
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket with id:", socketRef.current.id);
    });

    // מאזין לאירוע 'adminDashboardUpdate' שמגיע מהשרת
    socketRef.current.on("adminDashboardUpdate", (newStats) => {
      console.log("Received admin dashboard update:", newStats);
      setStats(newStats);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from socket");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  return (
    <div className="admin-dashboard">
      <h1>👑 דשבורד אדמין ראשי</h1>
      <p className="welcome-admin">שלום, {user?.name || user?.email || "מנהל"}</p>

      <div className="admin-summary">
        <div className="summary-card">
          👥 משתמשים במערכת: <strong>{stats.totalUsers}</strong>
        </div>
        <div className="summary-card">
          🏢 עסקים רשומים: <strong>{stats.totalBusinesses}</strong>
        </div>
        <div className="summary-card">
          📦 חבילות פעילות: <strong>{stats.totalPlans}</strong>
        </div>
        <div className="summary-card">
          💰 סה"כ מכירות: <strong>{stats.totalSales} ₪</strong>
        </div>
        <div className="summary-card">
          🧑‍💼 מנהלים פעילים: <strong>{stats.activeManagers}</strong>
        </div>
        <div className="summary-card">
          🚫 משתמשים חסומים: <strong>{stats.blockedUsers}</strong>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/roles" className="admin-link">
          🔐 ניהול תפקידים והרשאות
        </Link>
        <Link to="/admin/site-edit" className="admin-link">
          🖊️ עריכת תוכן האתר
        </Link>
        <Link to="/admin/plans" className="admin-link">
          📦 ניהול חבילות
        </Link>
        <Link to="/admin/users" className="admin-link">
          👥 ניהול משתמשים
        </Link>
        <Link to="/admin/logs" className="admin-link">
          🕐 פעולות מערכת (לוגים)
        </Link>
        <Link to="/admin/settings" className="admin-link">
          ⚙️ הגדרות כלליות
        </Link>
        <Link to="/reset-password" className="admin-link">
          🔒 שינוי סיסמה
        </Link>
        <Link to="/admin/affiliate-payouts" className="admin-link">
          💸 דו"ח תשלומים לשותפים
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
