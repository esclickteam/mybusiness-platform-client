import React from "react";
import "./ClientServiceCard.css";

const ClientServiceCard = ({
  service,
  formatDuration
}) => {
  return (
    <div className="client-service-card">
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
    </div>
  );
};

export default ClientServiceCard;
