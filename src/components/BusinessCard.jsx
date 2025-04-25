// src/components/BusinessCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './BusinessCard.css';

const BusinessCard = ({ business }) => {
  const { _id, name, description, phone, logo } = business;

  return (
    <div className="business-card">
      <Link to={`/business/${_id}`} className="business-card__link">
        {logo && (
          <img
            src={logo}
            alt={name}
            className="business-card__logo"
          />
        )}
        <h2 className="business-card__name">{name}</h2>
      </Link>

      {description && (
        <p className="business-card__description">
          {description.length > 60
            ? description.slice(0, 60) + '…'
            : description}
        </p>
      )}

      {phone && <p className="business-card__phone">טלפון: {phone}</p>}
    </div>
  );
};

export default BusinessCard;
