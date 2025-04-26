import React from "react";
import "./BusinessCard.css";

const BusinessCard = ({ business }) => (
  <div className="business-card">
    {business.logoUrl && (
      <div className="business-card__media">
        <img src={business.logoUrl} alt={`${business.name} logo`} />
      </div>
    )}
    <div className="business-card__content">
      <h2 className="business-card__title">{business.name}</h2>
      {business.category && (
        <p className="business-card__subtitle">{business.category}</p>
      )}
      {business.phone && (
        <p className="business-card__phone">📞 {business.phone}</p>
      )}
      <button className="business-card__btn">צפה בפרופיל</button>
    </div>
  </div>
);

export default BusinessCard;
