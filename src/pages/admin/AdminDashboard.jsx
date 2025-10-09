import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../../context/AuthContext";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { user, refreshAccessToken, logout } = useAuth();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    totalClients: 0,
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
    if (!user) return;

    let isMounted = true;

    async function setupSocket() {
      const token = await refreshAccessToken();
      if (!token) {
        logout();
        return;
      }

      socketRef.current = io("https://api.esclick.co.il", {
        path: "/socket.io",
        auth: {
          token,
          role: "admin",
        },
        transports: ['websocket'],
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to socket with id:", socketRef.current.id);
      });

      socketRef.current.on("adminDashboardUpdate", (newStats) => {
        if (!isMounted) return;
        console.log("Received admin dashboard update:", newStats);
        setStats(newStats);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from socket");
      });

      socketRef.current.on("tokenExpired", async () => {
        console.log("Token expired, refreshing...");
        const newToken = await refreshAccessToken();
        if (!newToken) {
          logout();
          return;
        }
        socketRef.current.auth.token = newToken;
        socketRef.current.disconnect();
        socketRef.current.connect();
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });
    }

    setupSocket();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user, refreshAccessToken, logout]);

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
          👥 לקוחות רשומים: <strong>{stats.totalClients}</strong>
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

        {/* הקישור החדש לניהול משווקים */}
        <Link to="/admin/affiliates" className="admin-link">
          🤝 ניהול משווקים (שותפים)
        </Link>

        <Link to="/admin/affiliate-payouts" className="admin-link">
          💸 דו"ח תשלומים לשותפים
        </Link>
        <Link to="/admin/withdrawals" className="admin-link">
          🏧 בקשות משיכה לשותפים
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
