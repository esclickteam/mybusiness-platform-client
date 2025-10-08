import React, { useState, useEffect } from "react";

const NotificationsPanel = ({ stats }) => {
  const [visible, setVisible] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!stats || typeof stats !== "object") return;

    const notifications = [];

    // 📅 פגישות קרובות ב־24 שעות
    const upcoming = stats.appointments?.filter((a) => {
      const diff = new Date(a.date) - new Date();
      return diff > 0 && diff < 1000 * 60 * 60 * 24;
    });

    if (upcoming?.length) {
      notifications.push(`📅 יש לך ${upcoming.length} פגישות קרובות ב־24 השעות הקרובות`);
    }

    // ⚠️ לידים ישנים
    const leads = stats.leads || [];
    const staleLeads = leads.filter((l) => {
      const diff = (new Date() - new Date(l.date)) / (1000 * 60 * 60 * 24);
      return diff > 3 && l.status !== "נסגר";
    });

    if (staleLeads.length > 0) {
      notifications.push(`⚠️ יש ${staleLeads.length} לידים שלא טופלו מעל 3 ימים`);
    }

    // ⭐ אין ביקורות
    if ((stats.reviews_count || 0) === 0) {
      notifications.push("⭐ עדיין אין ביקורות חדשות לעסק");
    }

    // 🛒 אין שירותים פעילים (בדיקה לדוגמה)
    if (!stats.services || Object.keys(stats.services).length === 0) {
      notifications.push("🛒 אין שירותים מוגדרים בעסק – הוסף כדי למשוך לקוחות");
    }

    if (notifications.length === 0) {
      notifications.push("✅ הכל תקין! אין התראות כרגע");
    }

    setMessages(notifications);
  }, [stats]);

  if (!visible || messages.length === 0) return null;

  return (
    <div className="notifications-panel">
      <button onClick={() => setVisible(false)} style={{ float: "left", border: "none", background: "transparent", cursor: "pointer" }}>
        ❌
      </button>
      {messages.map((msg, i) => (
        <div key={i} className="notification-item">{msg}</div>
      ))}
    </div>
  );
};

export default NotificationsPanel;
