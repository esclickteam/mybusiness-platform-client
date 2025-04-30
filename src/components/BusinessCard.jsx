import React from "react";
import { useNavigate } from 'react-router-dom';
import "./BusinessCard.css";

export default function BusinessCard({ business, onClick }) {
  const { _id, name, logo, description, category, phone, address = {} } = business;
  const { city } = address;
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/business/${_id}`);
    }
  };

  return (
    <div
      className="business-card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {logo && (
        <div className="business-card__media">
          <img src={logo} alt={`${name} logo`} loading="lazy" />
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

      <button
        className="business-card__btn"
        onClick={e => {
          e.stopPropagation();
          handleCardClick();
        }}
      >
        צפה בפרופיל
      </button>
    </div>
  );
}
