import React, { useState } from "react";
import ClientCalendar from "./ClientCalendar";
import "./ClientServiceCard.css";

const ClientServiceCard = ({
  service,
  workHours,
  formatDuration
}) => {
  const [mode, setMode] = useState("list");

  return (
    <div className="client-service-card">
      {mode === "list" ? (
        <>
          {/* הצגת תמונת השירות אם קיימת */}
          {service.imageUrl && (
            <img
              src={service.imageUrl}
              alt={service.name}
              className="client-service-card__img"
            />
          )}

          <h4>{service.name}</h4>
          {service.description && (
            <p className="service-description">{service.description}</p>
          )}
          {service.price && <p className="price">{service.price} ₪</p>}
          <p>⏱️ {formatDuration(service.duration)}</p>

          <button
            type="button"
            className="go-to-calendar-btn"
            onClick={() => setMode("calendar")}
          >
            📅 לתיאום ביומן
          </button>
        </>
      ) : (
        <ClientCalendar
          workHours={workHours}
          selectedService={service}
          onBackToList={() => setMode("list")}
        />
      )}
    </div>
  );
};

export default ClientServiceCard;
