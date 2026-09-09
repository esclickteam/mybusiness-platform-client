import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const NotificationsPanel = ({ stats }) => {
  const { t } = useTranslation();
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
      notifications.push(
        `📅 ${t("notifications.upcomingAppointments", { count: upcoming.length })}`
      );
    }

    // ⚠️ Stale leads
    const leads = stats.leads || [];
    const staleLeads = leads.filter((l) => {
      const diff = (new Date() - new Date(l.date)) / (1000 * 60 * 60 * 24);
      return diff > 3 && l.status !== "Closed";
    });

    if (staleLeads.length > 0) {
      notifications.push(
        `⚠️ ${t("notifications.staleLeads", { count: staleLeads.length })}`
      );
    }

    // ⭐ No reviews
    if ((stats.reviews_count || 0) === 0) {
      notifications.push(`⭐ ${t("notifications.noReviews")}`);
    }

    // 🛒 No active services (example check)
    if (!stats.services || Object.keys(stats.services).length === 0) {
      notifications.push(`🛒 ${t("notifications.noServices")}`);
    }

    if (notifications.length === 0) {
      notifications.push(`✅ ${t("notifications.allGood")}`);
    }

    setMessages(notifications);
  }, [stats, t]);

  if (!visible || messages.length === 0) return null;

  return (
    <div className="notifications-panel">
      <button
        onClick={() => setVisible(false)}
        style={{ float: "left", border: "none", background: "transparent", cursor: "pointer" }}
        aria-label={t("notifications.closeAria")}
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
