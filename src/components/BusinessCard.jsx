// src/components/BusinessCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./BusinessCard.css";

const BusinessCard = ({ business }) => {
  const { _id, name, logoUrl, description, category, phone } = business;

  return (
    <div className="business-card">
      {logoUrl && (
        <div className="business-card__media">
          <img src={logoUrl} alt={`${name} logo`} />
        </div>
      )}

      <div className="business-card__content">
        <h2 className="business-card__title">{name}</h2>

        {/* תיאור העסק, אם קיים */}
        {description && (
          <p className="business-card__description">
            {description}
          </p>
        )}

        {/* הקטגוריה תוצג רק אם יש ערך */}
        {category && (
          <p className="business-card__subtitle">
            {category}
          </p>
        )}

        {/* טלפון, אם קיים */}
        {phone && (
          <p className="business-card__phone">
            📞 {phone}
          </p>
        )}

        {/* כפתור קישור לפרופיל */}
        <Link to={`/business/${_id}`} className="business-card__btn">
          צפה בפרופיל
        </Link>
      </div>
    </div>
  );
};

export default BusinessCard;
