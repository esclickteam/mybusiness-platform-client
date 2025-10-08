import React from "react";
import "./ClientServiceCard.css";

const ClientServiceCard = ({
  service,
  formatDuration,
  onSelect // action prop when clicked
}) => {
  return (
    <div className="client-service-card">
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
        className="go-to-calendar-btn"
        onClick={() => onSelect && onSelect(service)}
      >
        📅 קבע תור
      </button>
    </div>
  );
};

export default ClientServiceCard;
