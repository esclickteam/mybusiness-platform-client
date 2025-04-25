// src/components/BusinessProfileCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './BusinessProfileCard.css';


const BusinessProfileCard = ({ business }) => (
  <Link to={`/business/${business._id}`} className="business-card">
    <div className="business-card__inner">
      <h2 className="business-card__name">{business.name}</h2>
      <p className="business-card__description">{business.description}</p>
      <p className="business-card__phone">טלפון: {business.phone}</p>
    </div>
  </Link>
);

export default BusinessProfileCard;
