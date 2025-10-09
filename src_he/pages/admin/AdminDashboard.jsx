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
      <h1>👑 Main Admin Dashboard</h1>
      <p className="welcome-admin">Hello, {user?.name || user?.email || "Admin"}</p>

      <div className="admin-summary">
        <div className="summary-card">
          👥 Users in the system: <strong>{stats.totalUsers}</strong>
        </div>
        <div className="summary-card">
          🏢 Registered businesses: <strong>{stats.totalBusinesses}</strong>
        </div>
        <div className="summary-card">
          👥 Registered clients: <strong>{stats.totalClients}</strong>
        </div>
        <div className="summary-card">
          💰 Total sales: <strong>{stats.totalSales} ₪</strong>
        </div>
        <div className="summary-card">
          🧑‍💼 Active managers: <strong>{stats.activeManagers}</strong>
        </div>
        <div className="summary-card">
          🚫 Blocked users: <strong>{stats.blockedUsers}</strong>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/roles" className="admin-link">
          🔐 Role and permission management
        </Link>
        <Link to="/admin/site-edit" className="admin-link">
          🖊️ Edit site content
        </Link>
        <Link to="/admin/plans" className="admin-link">
          📦 Package management
        </Link>
        <Link to="/admin/users" className="admin-link">
          👥 User management
        </Link>
        <Link to="/admin/logs" className="admin-link">
          🕐 System actions (logs)
        </Link>
        <Link to="/admin/settings" className="admin-link">
          ⚙️ General settings
        </Link>
        <Link to="/reset-password" className="admin-link">
          🔒 Change password
        </Link>

        {/* The new link for managing affiliates */}
        <Link to="/admin/affiliates" className="admin-link">
          🤝 Affiliate management
        </Link>

        <Link to="/admin/affiliate-payouts" className="admin-link">
          💸 Partner payment report
        </Link>
        <Link to="/admin/withdrawals" className="admin-link">
          🏧 Withdrawal requests for partners
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
