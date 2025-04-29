import React from "react";
import { Link } from "react-router-dom";
import "./BusinessCard.css";

const BusinessCard = ({ business }) => {
  const {
    _id,
    name,
    logo,
    description,
    category,
    phone,
    address = {},
  } = business;
  const { city } = address; // לחילוץ נוח של העיר

  return (
    <div className="business-card">
      {logo && (
        <div className="business-card__media">
          <img src={logo} alt={`${name} logo`} />
        </div>
      )}

      <h2 className="business-card__title">{name}</h2>

      {category && (
        <p className="business-card__subtitle">
          <strong>קטגוריה:</strong> {category}
        </p>
      )}

      {description && (
        <p className="business-card__description">
          <strong>תיאור:</strong> {description}
        </p>
      )}

      {phone && (
        <p className="business-card__phone">
          <strong>טלפון:</strong> {phone}
        </p>
      )}

      {city && (
        <p className="business-card__city">
          <strong>עיר:</strong> {city}
        </p>
      )}

      <Link to={`/business/${_id}`} className="business-card__btn">
        צפה בפרופיל
      </Link>
    </div>
  );
};

export default BusinessCard;
