import React, { useState, useEffect } from "react";
import API from "@api";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import "./FacebookStyleNotifications.css";

export default function FacebookStyleNotifications() {
  const { user, socket } = useAuth();   // ⬅️ מוסיפים socket!
  const [tab, setTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  /* ================================
     📌  Load notifications on mount
  ================================= */
  useEffect(() => {
    if (user?.businessId) fetchNotifications();
  }, [user?.businessId]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/business/my/notifications");
      if (res.data.ok) setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  /* ================================
     🔥 REAL-TIME NOTIFICATIONS (Missing Before)
  ================================= */
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    console.log("📡 Listening for live notifications...");

    // הלקוח מצטרף לחדר העסק
    socket.emit("joinRoom", user.businessId);

    // 1️⃣ הודעה חדשה
    socket.on("businessUpdates", (event) => {
      console.log("🔥 LIVE EVENT:", event);

      const { type, data } = event;

      if (type === "newNotification") {
        setNotifications((prev) => [data, ...prev]);
      }

      if (type === "newMessage") {
        const notif = {
          id: Date.now().toString(),
          text: "✉️ New message from a customer",
          timestamp: new Date().toISOString(),
          read: false,
          unreadCount: 1,
        };
        setNotifications((prev) => [notif, ...prev]);
      }

      if (type === "newRecommendationNotification") {
        setNotifications((prev) => [data, ...prev]);
      }
    });

    return () => {
      socket.off("businessUpdates");
    };
  }, [socket, user?.businessId]);

  /* ================================
     📌 Mark Notification as Read
  ================================= */
  const markAsRead = async (id) => {
    try {
      await API.put(`/business/my/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  /* ================================
     📌 Filter by tab
  ================================= */
  const filtered =
    tab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const timeAgo = (timestamp) => {
    const diff = (Date.now() - new Date(timestamp)) / 1000;
    if (diff < 60) return `${Math.floor(diff)} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return new Date(timestamp).toLocaleDateString("en-US");
  };

  if (!user?.businessId) return null;

  return (
    <div className="notif-left-wrapper">
      {/* Bell button */}
      <button className="fb-bell" onClick={() => setOpen(!open)}>
        🔔
        {notifications.some((n) => !n.read) && (
          <span className="fb-count">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fb-panel"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <div className="fb-tabs">
              <button
                className={tab === "all" ? "active" : ""}
                onClick={() => setTab("all")}
              >
                All
              </button>
              <button
                className={tab === "unread" ? "active" : ""}
                onClick={() => setTab("unread")}
              >
                Unread
              </button>
            </div>

            <div className="fb-section-title">Recent</div>

            <div className="fb-list">
              {filtered.length === 0 ? (
                <p className="fb-empty">No new notifications </p>
              ) : (
                filtered.map((n) => (
                  <div
                    key={n.id}
                    className={`fb-item ${n.read ? "read" : "unread"}`}
                    onClick={() => markAsRead(n.id)}
                  >
                    <div className="fb-text-content">
                      <p>{n.text}</p>
                      <small>{timeAgo(n.timestamp)}</small>
                    </div>
                    {!n.read && <span className="fb-dot" />}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
