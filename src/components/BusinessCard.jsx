import React from "react";
import { Link } from "react-router-dom";
import "./BusinessCard.css";

const BusinessCard = ({ business }) => {
  const { _id, name, logo, description, category, phone } = business;

  return (
    <div className="business-card">
      {logo && (
        <div className="business-card__media">
          <img src={logo} alt={`${name} logo`} />
        </div>
      )}

      <div className="business-card__content">
        <h2 className="business-card__title">{name}</h2>

        {description && (
          <p className="business-card__description">{description}</p>
        )}

        {category && (
          <p className="business-card__subtitle">{category}</p>
        )}

        {phone && (
          <p className="business-card__phone">📞 {phone}</p>
        )}

        <Link to={`/business/${_id}`} className="business-card__btn">
          צפה בפרופיל
        </Link>
      </div>
    </div>
  );
};

export default BusinessCard;
