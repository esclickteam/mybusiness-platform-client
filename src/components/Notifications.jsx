import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Notifications({ socket, user, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // טען התראות מהשרת בהתחלה
  useEffect(() => {
    if (!user) return;

    async function loadNotifications() {
      try {
        const res = await fetch("/api/business/my/notifications", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        if (data.ok) setNotifications(data.notifications);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    }
    loadNotifications();
  }, [user]);

  // מאזין להתראות בזמן אמת דרך socket
  useEffect(() => {
    if (!socket) return;

    const handler = (data) => {
      const newNotif = {
        id: data._id || data.id || Date.now(),
        type: data.type || "notification",
        text: data.text || "התראה חדשה",
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    };

    const events = [
      "newNotification",
      "reviewCreated",
      "appointmentCreated",
      "newProposalCreated",
      "newMessage",
    ];

    events.forEach((event) => socket.on(event, handler));

    return () => {
      events.forEach((event) => socket.off(event, handler));
    };
  }, [socket]);

  // סימון התראה כנקראה בשרת ובמקום
  const markAsRead = async (id) => {
    try {
      await fetch(`/api/business/my/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  // טיפול בלחיצה על התראה
  const handleClick = (notif) => {
    if (!notif.read) markAsRead(notif.id);

    switch (notif.type) {
      case "message":
        navigate("/messages");
        break;
      case "collaboration":
        navigate("/collaborations");
        break;
      case "meeting":
        navigate("/meetings");
        break;
      case "review":
        navigate("/reviews");
        break;
      default:
        break;
    }
    onClose();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "40px",
        right: "10px",
        width: "320px",
        maxHeight: "400px",
        overflowY: "auto",
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        borderRadius: "8px",
        zIndex: 1000,
      }}
    >
      {notifications.length === 0 && (
        <div style={{ padding: "15px", textAlign: "center" }}>
          אין התראות חדשות
        </div>
      )}

      {notifications.map((notif) => (
        <div
          key={notif.id}
          onClick={() => handleClick(notif)}
          style={{
            padding: "10px 15px",
            borderBottom: "1px solid #eee",
            fontWeight: notif.read ? "normal" : "700",
            backgroundColor: notif.read ? "white" : "#e8f4ff",
            cursor: "pointer",
            userSelect: "none",
          }}
          title={notif.text}
        >
          {notif.text}
        </div>
      ))}
    </div>
  );
}
