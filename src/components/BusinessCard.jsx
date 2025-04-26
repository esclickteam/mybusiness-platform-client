import React from "react";
import { Link } from "react-router-dom";
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

      {/* תיאור */}
      {business.description && (
        <p className="business-card__description">
          {business.description}
        </p>
      )}

      {/* קטגוריה – רק אם קיימת */}
      {business.category && (
        <p className="business-card__subtitle">
          {business.category}
        </p>
      )}

      {/* טלפון */}
      {business.phone && (
        <p className="business-card__phone">📞 {business.phone}</p>
      )}

      {/* כפתור לפרופיל */}
      <Link
        to={`/business/${business._id}`}
        className="business-card__btn"
      >
        צפה בפרופיל
      </Link>
    </div>
  </div>
);

export default BusinessCard;
