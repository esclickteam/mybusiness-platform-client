import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../../context/AuthContext";
import "./AdminDashboard.css";
import AdminHeader from "./AdminHeader";

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

  /* ===============================
     🔐 Guard – Admin only
  =============================== */
  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  /* ===============================
     🔌 Socket connection
  =============================== */
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    async function setupSocket() {
      const token = await refreshAccessToken();
      if (!token) {
        logout();
        return;
      }

      socketRef.current = io("https://api.bizuply.com", {
        path: "/socket.io",
        auth: {
          token,
          role: "admin",
        },
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Admin socket connected:", socketRef.current.id);
      });

      socketRef.current.on("adminDashboardUpdate", (newStats) => {
        if (!isMounted) return;
        setStats(newStats);
      });

      socketRef.current.on("tokenExpired", async () => {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          logout();
          return;
        }
        socketRef.current.auth.token = newToken;
        socketRef.current.disconnect();
        socketRef.current.connect();
      });

      socketRef.current.on("disconnect", () => {
        console.log("❌ Admin socket disconnected");
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("Socket error:", err.message);
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

  /* ===============================
     🖥️ UI
  =============================== */
  return (
    <>
      {/* 🔝 HEADER */}
      <AdminHeader />

      {/* 📊 DASHBOARD */}
      <div className="admin-dashboard">
        <h1>👑 Main Admin Dashboard</h1>

        <p className="welcome-admin">
          Hello, {user?.name || user?.email || "Admin"}
        </p>

        <div className="admin-summary">
          <div className="summary-card">
            👥 Users in System: <strong>{stats.totalUsers}</strong>
          </div>

          <div className="summary-card">
            🏢 Registered Businesses: <strong>{stats.totalBusinesses}</strong>
          </div>

          <div className="summary-card">
            👥 Registered Clients: <strong>{stats.totalClients}</strong>
          </div>

          <div className="summary-card">
            💰 Total Sales: <strong>{stats.totalSales} $</strong>
          </div>

          <div className="summary-card">
            🧑‍💼 Active Managers: <strong>{stats.activeManagers}</strong>
          </div>

          <div className="summary-card">
            🚫 Blocked Users: <strong>{stats.blockedUsers}</strong>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
