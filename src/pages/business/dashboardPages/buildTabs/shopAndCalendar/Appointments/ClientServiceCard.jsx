import React from "react";
import "./ClientServiceCard.css";

const ClientServiceCard = ({
  service,
  formatDuration,
  onSelect,
}) => {
  return (
    <article
      className="service-card client-service-card"
      aria-label={`Service ${service.name}`}
    >
      {/* תמונה */}
      {service.imageUrl && (
        <div className="service-image-wrapper">
          <img
            src={service.imageUrl}
            alt={service.name}
            loading="lazy"
            className="client-service-card__img"
          />
        </div>
      )}

      {/* שם */}
      <h4 className="service-title">{service.name}</h4>

      {/* תיאור (מקוצר וקליל) */}
      {service.description && (
        <p className="service-description">
          {service.description.length > 80
            ? service.description.slice(0, 80) + "…"
            : service.description}
        </p>
      )}

      {/* מחיר + משך */}
      <div className="service-meta">
        {service.price != null && (
          <span className="service-price">{service.price} $</span>
        )}
        {service.duration && (
          <span className="service-duration">
            ⏱ {formatDuration(service.duration)}
          </span>
        )}
      </div>

      {/* כפתור */}
      <button
        type="button"
        className="go-to-calendar-btn"
        onClick={() => onSelect?.(service)}
        aria-label={`Book ${service.name}`}
      >
        📅 Book
      </button>
    </article>
  );
};

export default ClientServiceCard;
