import React, { useState } from "react";
import ClientCalendar from "./ClientCalendar";
import "./ClientServiceCard.css"; // 👈 ודא שזה מחובר!

const ClientServiceCard = ({ service, workHours }) => {
  const [mode, setMode] = useState("list");

  const userEmail = localStorage.getItem("userEmail") || "";
  const isDemoUser = userEmail === "newuser@example.com";

  let demoHours = {};
  try {
    const raw = localStorage.getItem("demoWorkHours");
    if (raw) {
      demoHours = JSON.parse(raw);
    }
  } catch (e) {
    console.warn("⚠️ demoWorkHours לא תקין", e);
  }

  const hoursToUse = isDemoUser ? demoHours : workHours;

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}:${m.toString().padStart(2, "0")} שעות`;
  };

  return (
    <div className="client-service-card">
      {mode === "list" ? (
        <>
          <h4>{service.name}</h4>
          {service.price && <p>{service.price} ₪</p>}
          <p>⏱️ {formatDuration(service.duration)}</p>

          <button
            className="go-to-calendar-btn"
            onClick={() => setMode("calendar")}
          >
            📅 לתיאום ביומן
          </button>
        </>
      ) : (
        <ClientCalendar
          workHours={hoursToUse}
          selectedService={service}
          onBackToList={() => setMode("list")}
        />
      )}
    </div>
  );
};

export default ClientServiceCard;
