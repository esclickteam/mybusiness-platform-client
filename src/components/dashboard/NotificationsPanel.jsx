import React, { useState, useEffect } from "react";

const NotificationsPanel = ({ stats }) => {
  const [visible, setVisible] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!stats || typeof stats !== "object") return;

    const notifications = [];

    // 📅 Upcoming appointments in the next 24 hours
    const upcoming = stats.appointments?.filter((a) => {
      const diff = new Date(a.date) - new Date();
      return diff > 0 && diff < 1000 * 60 * 60 * 24;
    });

    if (upcoming?.length) {
      notifications.push(`📅 You have ${upcoming.length} upcoming appointment(s) in the next 24 hours`);
    }

    // ⚠️ Stale leads
    const leads = stats.leads || [];
    const staleLeads = leads.filter((l) => {
      const diff = (new Date() - new Date(l.date)) / (1000 * 60 * 60 * 24);
      return diff > 3 && l.status !== "Closed";
    });

    if (staleLeads.length > 0) {
      notifications.push(`⚠️ There are ${staleLeads.length} lead(s) not handled for over 3 days`);
    }

    // ⭐ No reviews
    if ((stats.reviews_count || 0) === 0) {
      notifications.push("⭐ No new reviews for your business yet");
    }

    // 🛒 No active services (example check)
    if (!stats.services || Object.keys(stats.services).length === 0) {
      notifications.push("🛒 No services configured — add some to attract customers");
    }

    if (notifications.length === 0) {
      notifications.push("✅ All good! No notifications right now");
    }

    setMessages(notifications);
  }, [stats]);

  if (!visible || messages.length === 0) return null;

  return (
    <div className="notifications-panel">
      <button
        onClick={() => setVisible(false)}
        style={{ float: "left", border: "none", background: "transparent", cursor: "pointer" }}
        aria-label="Close notifications"
      >
        ❌
      </button>
      {messages.map((msg, i) => (
        <div key={i} className="notification-item">{msg}</div>
      ))}
    </div>
  );
};

export default NotificationsPanel;
