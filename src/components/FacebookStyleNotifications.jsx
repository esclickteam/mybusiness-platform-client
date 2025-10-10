import React, { useState, useEffect } from "react";
import API from "@api";
import { motion, AnimatePresence } from "framer-motion";
import "./FacebookStyleNotifications.css";

export default function FacebookStyleNotifications() {
  const [tab, setTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/business/my/notifications");
      if (res.data.ok) setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

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

  const filtered =
    tab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const timeAgo = (timestamp) => {
    const diff = (Date.now() - new Date(timestamp)) / 1000;
    if (diff < 60) return `${Math.floor(diff)} שניות`;
    if (diff < 3600) return `${Math.floor(diff / 60)} דקות`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} שעות`;
    return new Date(timestamp).toLocaleDateString("he-IL");
  };

  return (
    <div className="fb-notif-wrapper">
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
            {/* Tabs */}
            <div className="fb-tabs">
              <button
                className={tab === "all" ? "active" : ""}
                onClick={() => setTab("all")}
              >
                הכל
              </button>
              <button
                className={tab === "unread" ? "active" : ""}
                onClick={() => setTab("unread")}
              >
                לא נקראו
              </button>
            </div>

            <div className="fb-section-title">חדש</div>

            {/* Notifications List */}
            <div className="fb-list">
              {filtered.length === 0 ? (
                <p className="fb-empty">אין התראות חדשות 🎉</p>
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
